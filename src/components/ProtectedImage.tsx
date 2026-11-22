"use client";

/* eslint-disable @next/next/no-img-element -- The protected gallery needs the
 * native image element for Cloudinary's variable aspect ratios and its own
 * Cloudinary loader. Next Image requires a fixed box or fill layout, which
 * would either crop the photos or change the masonry layout. */
import { getCldImageUrl } from "next-cloudinary";

type Loading = "lazy" | "eager";

export default function ProtectedImage({
  src,
  alt,
  width,
  height,
  classname,
  wrapperClassname,
  fill = false,
  loading = "lazy",
  priority = false,
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
  loading?: Loading;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const url = getCldImageUrl({
    width: width || "800",
    height,
    src,
    quality: "auto",
    format: "webp",
    transformations: [],
  });

  const numericWidth = width ? Number(width) : undefined;
  const numericHeight = height ? Number(height) : undefined;

  return (
    <div className={`group overflow-hidden ${wrapperClassname ?? "relative"}`}>
      <img
        src={url}
        alt={alt ?? ""}
        width={fill ? undefined : Number.isFinite(numericWidth) ? numericWidth : undefined}
        height={fill ? undefined : Number.isFinite(numericHeight) ? numericHeight : undefined}
        loading={priority ? "eager" : loading}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        onLoad={onLoad}
        onError={onError}
        className={`${classname} ${fill ? "absolute inset-0 h-full w-full" : ""}`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      />
    </div>
  );
}
