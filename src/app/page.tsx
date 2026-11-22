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
            <div className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2">
              <h2 className="font-subtitle text-xs uppercase tracking-[0.25em] text-white/60">
                {section.label}
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
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
      <GalleryControls sort={sort} order={order} group={group} />

      <Suspense key={`${sort}-${order}-${group}`} fallback={<GallerySkeleton />}>
        <GalleryData sort={sort} order={order} group={group} />
      </Suspense>
    </div>
  );
}
