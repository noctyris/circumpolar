import Link from "next/link";
import { Suspense } from "react";
import { fetchImages } from "../lib/data";
import Grid from "@/components/dashboard/Grid";
import { DashboardSkeleton } from "@/components/Skeletons";
import { isPictureIncomplete } from "@/lib/picture-quality";

type DashboardProps = {
  searchParams: Promise<{ view?: string }>;
};

async function DashboardContent({ showIncomplete }: { showIncomplete: boolean }) {
  const images = await fetchImages();
  const incomplete = images.filter(isPictureIncomplete);
  const visible = showIncomplete ? incomplete : images;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
            Administration
          </p>
          <h1 className="text-2xl font-bold">Galerie privée</h1>
        </div>

        <nav aria-label="Filtre du tableau de bord" className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            aria-current={!showIncomplete ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 font-body text-xs transition ${
              !showIncomplete
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            Toutes · {images.length}
          </Link>
          <Link
            href="/dashboard?view=incomplete"
            aria-current={showIncomplete ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 font-body text-xs transition ${
              showIncomplete
                ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            À compléter · {incomplete.length}
          </Link>
        </nav>
      </div>

      {visible.length > 0 ? (
        <Grid images={visible} />
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
          Toutes les fiches sont complètes.
        </p>
      )}

      <div className="pointer-events-none sticky bottom-6 z-30 mt-auto self-end">
        <Link
          href="/dashboard/new"
          className="pointer-events-auto -mr-7 flex h-12 w-12 items-center justify-center rounded-full bg-white/50 text-4xl shadow-lg duration-300 hover:bg-white/70 hover:text-6xl"
        >
          +
        </Link>
      </div>
    </>
  );
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const { view } = await searchParams;
  const showIncomplete = view === "incomplete";

  return (
    <Suspense key={view ?? "all"} fallback={<DashboardSkeleton />}>
      <DashboardContent showIncomplete={showIncomplete} />
    </Suspense>
  );
}
