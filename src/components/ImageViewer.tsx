"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { LoaderCircle, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import ProtectedImage from "./ProtectedImage";
import useBodyScrollLock from "./useBodyScrollLock";
import { Picture } from "@/types";

const MAX_SCALE = 4;
const ZOOM_WIDTH = "3000";

const zoomButton =
  "rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30";

type View = { scale: number; x: number; y: number };
type FocalPoint = { clientX: number; clientY: number };

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

function zoomTo(
  current: View,
  nextScale: number,
  focal: FocalPoint | null,
  stage: HTMLDivElement | null
): View {
  const scale = Math.min(MAX_SCALE, Math.max(1, nextScale));
  if (Math.abs(scale - current.scale) < 0.001) return current;

  if (scale === 1) return { scale, x: 0, y: 0 };
  if (!stage || !focal) {
    return { scale, ...clampOffset(stage, current.x, current.y, scale) };
  }

  // Le point sous le curseur (ou entre les deux doigts) reste immobile.
  const rect = stage.getBoundingClientRect();
  const px = focal.clientX - rect.left - rect.width / 2;
  const py = focal.clientY - rect.top - rect.height / 2;
  const x = px - ((px - current.x) / current.scale) * scale;
  const y = py - ((py - current.y) / current.scale) * scale;

  return { scale, ...clampOffset(stage, x, y, scale) };
}

export default function ImageViewer({
  image,
  className,
  frameClassName,
}: {
  image: Picture;
  className?: string;
  frameClassName?: string;
}) {
  const [annotated, setAnnotated] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [zoomLoadedSrc, setZoomLoadedSrc] = useState<string | null>(null);
  const [zoomFailedSrc, setZoomFailedSrc] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const pan = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const src = annotated && image.annotated_publicid ? image.annotated_publicid : image.publicid;
  const title = image.title || image.target;
  const alt = `${image.target}${image.title ? ` — ${image.title}` : ""} — ${image.target_category}${annotated ? " (annotée)" : ""}`;
  const previewReady = loadedSrc === src;
  const previewFailed = failedSrc === src;
  const zoomReady = zoomLoadedSrc === src;
  const zoomFailed = zoomFailedSrc === src;

  useBodyScrollLock(zoomed);

  const handlePreviewLoad = useCallback(() => {
    setLoadedSrc(src);
    setFailedSrc(null);
  }, [src]);

  const handlePreviewError = useCallback(() => {
    setFailedSrc(src);
  }, [src]);

  const handleZoomLoad = useCallback(() => {
    setZoomLoadedSrc(src);
    setZoomFailedSrc(null);
  }, [src]);

  const handleZoomError = useCallback(() => {
    setZoomFailedSrc(src);
  }, [src]);

  const closeZoom = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else setZoomed(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
  }, [zoomed]);

  useEffect(() => {
    if (!zoomed) return;

    // Échap ferme d'abord le zoom et ne doit pas atteindre la modale parente.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      closeZoom();
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [closeZoom, zoomed]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!zoomed || !stage) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1;
      const focal = { clientX: event.clientX, clientY: event.clientY };

      setView((current) =>
        zoomTo(current, current.scale - event.deltaY * deltaMultiplier * 0.0015, focal, stage)
      );
    }

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomed]);

  function resetView() {
    setView({ scale: 1, x: 0, y: 0 });
    setDragging(false);
    pointers.current.clear();
    pinch.current = null;
    pan.current = null;
  }

  function changeScale(delta: number) {
    setView((current) => zoomTo(current, current.scale + delta, null, stageRef.current));
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
      const focal = { clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 };

      setView((current) =>
        zoomTo(
          current,
          gesture.scale * (distance(a, b) / gesture.distance),
          focal,
          stageRef.current
        )
      );
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

  function onDoubleClick(event: MouseEvent<HTMLDivElement>) {
    if (view.scale > 1) {
      resetView();
      return;
    }

    setView((current) =>
      zoomTo(
        current,
        2.5,
        { clientX: event.clientX, clientY: event.clientY },
        stageRef.current
      )
    );
  }

  return (
    <>
      <div className={`w-full ${className ?? "space-y-3"}`}>
        <div
          className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] ${
            frameClassName ?? "aspect-[4/3]"
          }`}
        >
          <ProtectedImage
            src={src}
            alt={alt}
            width="1600"
            loading="eager"
            wrapperClassname="absolute inset-0"
            classname="object-contain"
            fill
            onLoad={handlePreviewLoad}
            onError={handlePreviewError}
          />

          {!previewReady && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/[0.02]">
              {previewFailed ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                  Image indisponible
                </p>
              ) : (
                <>
                  <LoaderCircle className="h-6 w-6 animate-spin text-white/55" aria-hidden="true" />
                  <span className="sr-only" role="status">
                    Chargement de l’image…
                  </span>
                </>
              )}
            </div>
          )}

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

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
          {image.annotated_publicid ? (
            <div
              role="group"
              aria-label="Version de l'image"
              className="inline-flex rounded-full border border-white/10 bg-white/5 p-1"
            >
              <button
                type="button"
                onClick={() => setAnnotated(false)}
                aria-pressed={!annotated}
                className={`rounded-full px-3 py-1.5 font-subtitle text-[10px] uppercase tracking-widest transition ${annotated ? "text-white/65 hover:text-white" : "bg-white text-black"}`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setAnnotated(true)}
                aria-pressed={annotated}
                className={`rounded-full px-3 py-1.5 font-subtitle text-[10px] uppercase tracking-widest transition ${annotated ? "bg-white text-black" : "text-white/65 hover:text-white"}`}
              >
                Annotée
              </button>
            </div>
          ) : (
            <span />
          )}

          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
            <span className="sm:hidden">Toucher pour agrandir</span>
            <span className="hidden sm:inline">Cliquer pour agrandir</span>
          </span>
        </div>
      </div>

      {zoomed && (
        <dialog
          ref={dialogRef}
          onClose={(event) => {
            event.stopPropagation();
            resetView();
            setZoomed(false);
          }}
          onCancel={(event) => {
            event.preventDefault();
            event.stopPropagation();
            closeZoom();
          }}
          aria-label={`Image agrandie — ${title}`}
          className="m-0 h-[100dvh] w-screen max-w-none overflow-hidden border-none bg-[#050505] p-0 text-white backdrop:bg-black/80"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate font-subtitle text-xs uppercase tracking-[0.2em] text-white/70">
                  {title}
                </p>
                <p className="truncate font-mono text-[10px] uppercase tracking-widest text-white/55">
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
              className={`relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden ${
                view.scale > 1
                  ? dragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-zoom-in"
              }`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={onDoubleClick}
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
                  width={ZOOM_WIDTH}
                  loading="eager"
                  classname="max-h-[calc(100dvh-9rem)] w-auto max-w-[92vw] object-contain"
                  onLoad={handleZoomLoad}
                  onError={handleZoomError}
                />
              </div>

              {!zoomReady && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {zoomFailed ? (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                      Image indisponible
                    </p>
                  ) : (
                    <>
                      <LoaderCircle className="h-7 w-7 animate-spin text-white/55" aria-hidden="true" />
                      <span className="sr-only" role="status">
                        Chargement du zoom…
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:gap-3">
              <button
                type="button"
                onClick={() => changeScale(-0.5)}
                disabled={view.scale <= 1}
                aria-label="Dézoomer"
                className={zoomButton}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span
                aria-live="polite"
                className="min-w-14 text-center font-mono text-xs text-white/60"
              >
                {Math.round(view.scale * 100)} %
              </span>
              <button
                type="button"
                onClick={() => changeScale(0.5)}
                disabled={view.scale >= MAX_SCALE}
                aria-label="Zoomer"
                className={zoomButton}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetView}
                disabled={view.scale === 1}
                aria-label="Réinitialiser le zoom"
                className={zoomButton}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/55 sm:block">
                Molette · pincement · double-clic · glisser
              </span>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
