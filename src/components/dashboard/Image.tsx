import { Picture } from "@/types";
import ProtectedImage from "../ProtectedImage";
import Link from "next/link";
import { AlertCircle, SquarePen } from "lucide-react";
import { missingPictureFields } from "@/lib/picture-quality";

const dateFormat = new Intl.DateTimeFormat("fr-FR");

function formatCaptureDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date inconnue" : dateFormat.format(date);
}

export default function PictureCard({ image }: { image: Picture }) {
  const missing = missingPictureFields(image);

  return (
    <Link href={`/dashboard/edit/${image.id}`} scroll={false}>
      <div className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 transition group-focus-visible:border-indigo-300/50">
        <ProtectedImage
          src={image.publicid}
          alt={`${image.title || image.target} — ${image.target_category}`}
          width="800"
          classname="w-full h-auto block duration-500 group-hover:scale-105 group-hover:opacity-50"
        />

        {missing.length > 0 && (
          <span
            title={`À compléter : ${missing.join(", ")}`}
            className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-200 backdrop-blur"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            À compléter
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-100 transition-all duration-500 ease-out lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <span className="block truncate font-subtitle text-xs font-light tracking-[0.2em] text-white">
                {image.title || image.target}
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {image.title && (
                  <span className="font-subtitle text-xs font-light text-white/65 transition duration-500 group-hover:text-white">
                    {image.target}
                  </span>
                )}
                <span className="font-subtitle text-xs font-light text-white/65 transition duration-500 group-hover:text-white">
                  {formatCaptureDate(image.capture_date)}
                </span>
              </div>
            </div>
            <div className="shrink-0 rounded-full bg-black/80 p-2 text-white/80 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
              <SquarePen className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-2 h-[1px] w-0 bg-accent transition-all delay-100 duration-700 group-hover:w-full" />
        </div>

        <div className="absolute inset-0 z-30" onContextMenu={(event) => event.preventDefault()} />
      </div>
    </Link>
  );
}
