import { Picture } from "@/types";
import ProtectedImage from "../ProtectedImage";
import Link from "next/link";

const categoryStyles: Record<string, string> = {
  "Ciel profond": "border-indigo-300/30 bg-indigo-500/25 text-indigo-50",
  "Système solaire": "border-amber-300/30 bg-amber-500/20 text-amber-50",
  Solaire: "border-orange-300/30 bg-orange-500/20 text-orange-50",
  Lunaire: "border-sky-300/30 bg-sky-400/15 text-sky-50",
  Planétaire: "border-cyan-300/30 bg-cyan-500/20 text-cyan-50",
  "Open Field": "border-fuchsia-300/30 bg-fuchsia-500/20 text-fuchsia-50",
};

const defaultCategoryStyle = "border-white/15 bg-black/40 text-white/75";

export default function AstroImage({ image }: { image: Picture }) {
  return (
    <Link href={`/image/${image.id}`} scroll={false}>
      <div className="group relative w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-white/5 transition duration-500 group-hover:border-indigo-300/25 group-hover:shadow-[0_22px_60px_-36px_rgba(99,102,241,0.9)]">
        <ProtectedImage
          src={image.publicid}
          alt={`${image.title || image.target} — ${image.target_category}`}
          width="400"
          classname="w-full h-auto block duration-500 group-hover:scale-105 group-hover:opacity-50"
        />

        <span
          className={`pointer-events-none absolute left-3 top-3 z-20 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] shadow-lg shadow-black/20 backdrop-blur-md ${
            categoryStyles[image.target_category] ?? defaultCategoryStyle
          }`}
        >
          {image.target_category}
        </span>

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-100 transition-all duration-500 ease-out lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <span className="font-subtitle text-xs font-light uppercase tracking-[0.2em] text-white">
            {image.title || image.target}
          </span>

          <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-fuchsia-300 transition-all delay-100 duration-700 lg:w-0 lg:group-hover:w-full" />
        </div>

        <div className="absolute inset-0 z-30" onContextMenu={(e) => e.preventDefault()} />
      </div>
    </Link>
  );
}
