import { Suspense } from "react";
import { fetchImages } from "./lib/data";
import Grid from "@/components/home/Grid";
import GalleryControls from "@/components/home/GalleryControls";
import { GallerySkeleton } from "@/components/Skeletons";
import {
  groupPictures,
  parseGroup,
  parseOrder,
  parseSort,
  type PictureGroup,
  type PictureSort,
  type SortOrder,
} from "@/lib/gallery";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ sort?: string; order?: string; group?: string }>;
};

async function GalleryData({
  sort,
  order,
  group,
}: {
  sort: PictureSort;
  order: SortOrder;
  group: PictureGroup;
}) {
  const images = await fetchImages({ sort, order });

  if (images.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center font-body text-sm text-white/50">
        Aucune image pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {groupPictures(images, group).map((section) => (
        <section key={section.key} className="space-y-4">
          {section.label && (
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
              <h2 className="flex items-center gap-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/70">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 via-cyan-300 to-fuchsia-300 shadow-[0_0_10px_rgba(99,102,241,0.7)]"
                />
                {section.label}
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-200/55">
                {section.images.length} image{section.images.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          <Grid images={section.images} />
        </section>
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const sort = parseSort(params.sort);
  const order = parseOrder(params.order);
  const group = parseGroup(params.group);

  return (
    <div className="space-y-5">
      <div className="space-y-2 pt-1">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-indigo-200/65">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
          />
          Galerie
        </p>
        <p className="max-w-2xl font-body text-sm leading-relaxed text-white/50 sm:text-base">
          Ciel profond, Lune, Soleil et planétaire, capturés depuis le Morbihan.
        </p>
      </div>

      <GalleryControls sort={sort} order={order} group={group} />

      <Suspense key={`${sort}-${order}-${group}`} fallback={<GallerySkeleton />}>
        <GalleryData sort={sort} order={order} group={group} />
      </Suspense>
    </div>
  );
}
