"use client";
import { getCldImageUrl } from "next-cloudinary";
import { useEffect, useRef } from "react";

/**
 * Affichage d'une image sur un <canvas> : dissuasion visuelle uniquement
 * (clic droit, glisser-déposer). Ce n'est pas un contrôle d'accès — l'URL
 * Cloudinary reste dérivable et l'image est de toute façon téléchargée par le
 * navigateur.
 */
export default function ProtectedImage({
  src,
  alt,
  width,
  height,
  classname,
  wrapperClassname,
  fill = false,
  onLoad,
  onError,
}: {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  classname: string;
  wrapperClassname?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);

  const url = getCldImageUrl({
    width: width || "800",
    height,
    src,
    quality: "auto",
    format: "webp",
    transformations: [],
  });

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let active = true;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      if (!active) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      onLoadRef.current?.();
    };

    img.onerror = () => {
      if (active) onErrorRef.current?.();
    };

    return () => {
      active = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return (
    <div className={`group cursor-zoom-in ${wrapperClassname ?? "relative"}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        onContextMenu={(event) => event.preventDefault()}
        className={`${classname} ${fill ? "h-full w-full" : "h-auto"}`}
        style={{ userSelect: "none", touchAction: "none" }}
      />
      <noscript>
        <img src={url} alt={alt ?? ""} className={`${classname} h-auto`} draggable={false} />
      </noscript>
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      />
    </div>
  );
}
