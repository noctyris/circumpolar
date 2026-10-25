"use client";
import { getCldImageUrl } from "next-cloudinary";
import { useEffect, useRef } from "react";

/**
 * Affichage d'une image sur un <canvas> : dissuasion visuelle uniquement
 * (clic droit, glisser-déposer). Ce n'est pas un contrôle d'accès — l'URL
 * Cloudinary reste dérivable et l'image est de toute façon téléchargée par le
 * navigateur.
 */
export default function ProtectedImage({src, alt, width, height, classname}: {src: string, alt?: string, width?: string, height?: string, classname: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const url = getCldImageUrl({
    width: width || "800",
    height: height,
    src,
    quality: 'auto',
    format: 'webp',
    transformations: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
    }
  }, [url]);

  return (
    <div className="relative group cursor-zoom-in">
      <canvas 
        ref={canvasRef} 
        role="img"
        aria-label={alt}
        onContextMenu={(e) => e.preventDefault()} 
        className={`${classname} h-auto`} 
        style={{ userSelect: 'none', touchAction: 'none' }} 
      />
      <noscript>
        <img src={url} alt={alt ?? ""} className={`${classname} h-auto`} draggable={false} />
      </noscript>
      <div 
        className="absolute inset-0 z-10" 
        onContextMenu={(e) => e.preventDefault()} 
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
}
