import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProtectedImage from "@/components/ProtectedImage";
import ImageDetails from "@/components/ImageDetails";
import { Picture } from "@/types";

export default function ImagePageClient({ image }: { image: Picture }) {
  return (
    <article className="w-full pb-6">
      <div className="flex items-center py-2">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-subtitle text-[10px] uppercase tracking-widest text-white/50 transition hover:border-white/20 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          Galerie
        </Link>
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <ProtectedImage
            src={image.publicid}
            alt={`${image.target}${image.title ? ` — ${image.title}` : ""} — ${image.target_category}`}
            width="1600"
            classname="w-full max-h-[78vh] object-contain"
          />
        </div>

        <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:pr-2">
          <ImageDetails image={image} />
        </aside>
      </div>
    </article>
  );
}
