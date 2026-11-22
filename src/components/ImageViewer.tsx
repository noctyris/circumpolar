"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import ProtectedImage from "./ProtectedImage";
import { Picture } from "@/types";

const MAX_SCALE = 6;

const zoomButton =
  "rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30";

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clampOffset(stage: HTMLDivElement | null, x: number, y: number, scale: number) {
  if (!stage || scale <= 1) return { x: 0, y: 0 };

  // On garde toujours l'image dans le cadre, même en la déplaçant vite.
  const maxX = (stage.clientWidth * (scale - 1)) / 2;
  const maxY = (stage.clientHeight * (scale - 1)) / 2;
  return {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxY, Math.min(maxY, y)),
  };
}

export default function ImageViewer({ image, classname }: { image: Picture; classname?: string }) {
  const [annotated, setAnnotated] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });

  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const pan = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const src = annotated && image.annotated_publicid ? image.annotated_publicid : image.publicid;
  const title = image.title || image.target;
  const alt = `${image.target}${image.title ? ` — ${image.title}` : ""} — ${image.target_category}${annotated ? " (annotée)" : ""}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
  }, [zoomed]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!zoomed || !stage) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      setView((current) => {
        const scale = Math.min(MAX_SCALE, Math.max(1, current.scale - event.deltaY * 0.0015));
        return { scale, ...clampOffset(stage, current.x, current.y, scale) };
      });
    }

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomed]);

  useEffect(() => {
    if (!zoomed) return;

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [zoomed]);

  function resetView() {
    setView({ scale: 1, x: 0, y: 0 });
    setDragging(false);
    pointers.current.clear();
    pinch.current = null;
    pan.current = null;
  }

  function closeZoom() {
    dialogRef.current?.close();
  }

  function changeScale(delta: number) {
    setView((current) => {
      const scale = Math.min(MAX_SCALE, Math.max(1, current.scale + delta));
      return { scale, ...clampOffset(stageRef.current, current.x, current.y, scale) };
    });
  }

  function toggleZoom() {
    setView((current) =>
      current.scale > 1 ? { scale: 1, x: 0, y: 0 } : { scale: 2.5, x: 0, y: 0 }
    );
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 1) {
      pan.current = { x: event.clientX, y: event.clientY, offsetX: view.x, offsetY: view.y };
    } else if (pointers.current.size === 2) {
      pan.current = null;
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = { distance: distance(a, b) || 1, scale: view.scale };
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const gesture = pinch.current;
    if (pointers.current.size === 2 && gesture) {
      const [a, b] = Array.from(pointers.current.values());
      setView((current) => {
        const scale = Math.min(MAX_SCALE, Math.max(1, gesture.scale * (distance(a, b) / gesture.distance)));
        return { scale, ...clampOffset(stageRef.current, current.x, current.y, scale) };
      });
      return;
    }

    if (pan.current && view.scale > 1) {
      const offset = clampOffset(
        stageRef.current,
        pan.current.offsetX + event.clientX - pan.current.x,
        pan.current.offsetY + event.clientY - pan.current.y,
        view.scale
      );
      setView({ scale: view.scale, ...offset });
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinch.current = null;

    if (pointers.current.size === 0) {
      pan.current = null;
      setDragging(false);
      return;
    }

    const [point] = Array.from(pointers.current.values());
    pan.current = { x: point.x, y: point.y, offsetX: view.x, offsetY: view.y };
  }

  return (
    <>
      <div className="w-full space-y-3">
        <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <ProtectedImage
            src={src}
            alt={alt}
            width="1600"
            classname={`w-full object-contain ${classname ?? "max-h-[78vh]"}`}
          />
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`Agrandir l'image ${title}`}
            className="absolute inset-0 z-20 cursor-zoom-in"
          />
          <span className="pointer-events-none absolute right-3 top-3 z-30 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur">
            <Maximize2 className="h-3 w-3" />
            Zoom
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {image.annotated_publicid ? (
            <div role="group" aria-label="Version de l'image" className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setAnnotated(false)}
                aria-pressed={!annotated}
                className={`rounded-full px-3 py-1.5 font-subtitle text-[10px] uppercase tracking-widest transition ${annotated ? "text-white/50 hover:text-white" : "bg-white text-black"}`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setAnnotated(true)}
                aria-pressed={annotated}
                className={`rounded-full px-3 py-1.5 font-subtitle text-[10px] uppercase tracking-widest transition ${annotated ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
              >
                Annotée
              </button>
            </div>
          ) : (
            <span />
          )}

          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            <span className="sm:hidden">Toucher pour agrandir</span>
            <span className="hidden sm:inline">Cliquer pour agrandir</span>
          </span>
        </div>
      </div>

      {zoomed && (
        <dialog
          ref={dialogRef}
          onClose={() => {
            resetView();
            setZoomed(false);
          }}
          aria-label={`Image agrandie — ${title}`}
          className="m-0 h-[100dvh] w-screen max-w-none overflow-hidden border-none bg-[#050505] p-0 text-white backdrop:bg-black/80"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate font-subtitle text-xs uppercase tracking-[0.2em] text-white/70">{title}</p>
                <p className="truncate font-mono text-[10px] uppercase tracking-widest text-white/30">
                  {annotated ? "Version annotée" : image.target}
                </p>
              </div>
              <button
                type="button"
                onClick={closeZoom}
                aria-label="Fermer le zoom"
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={stageRef}
              className="relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={toggleZoom}
            >
              <div
                className="flex max-h-full max-w-full items-center justify-center"
                style={{
                  transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                  transition: dragging ? "none" : "transform 180ms ease-out",
                }}
              >
                <ProtectedImage
                  src={src}
                  alt={alt}
                  width="2400"
                  classname="max-h-[calc(100dvh-9rem)] w-auto max-w-[92vw] object-contain"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-white/10 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:gap-3">
              <button type="button" onClick={() => changeScale(-0.5)} disabled={view.scale <= 1} aria-label="Dézoomer" className={zoomButton}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-14 text-center font-mono text-xs text-white/60">{Math.round(view.scale * 100)} %</span>
              <button type="button" onClick={() => changeScale(0.5)} disabled={view.scale >= MAX_SCALE} aria-label="Zoomer" className={zoomButton}>
                <Plus className="h-4 w-4" />
              </button>
              <button type="button" onClick={resetView} disabled={view.scale === 1} aria-label="Réinitialiser le zoom" className={zoomButton}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-widest text-white/25 sm:block">
                Molette · pincement · double-clic
              </span>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
