function GalleryCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="aspect-[4/3] animate-pulse bg-white/[0.04]" />
      <div className="space-y-2 p-4">
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-white/10" />
        <div className="h-2 w-1/3 animate-pulse rounded-full bg-white/5" />
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Chargement de la galerie…</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <GalleryCard key={index} />
        ))}
      </div>
    </div>
  );
}

export function ImagePageSkeleton() {
  return (
    <article className="w-full pb-6" role="status" aria-live="polite">
      <span className="sr-only">Chargement de la photo…</span>
      <div className="h-9 w-24 animate-pulse rounded-full bg-white/5" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="aspect-[4/3] animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
        <div className="space-y-6">
          <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/5" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ImageModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md md:flex-row" role="status" aria-live="polite">
      <span className="sr-only">Chargement de la photo…</span>
      <div className="flex h-[48dvh] items-center justify-center p-4 md:h-full md:flex-1 md:p-10">
        <div className="aspect-[4/3] w-full max-w-4xl animate-pulse rounded-xl border border-white/10 bg-white/[0.05]" />
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-hidden border-t border-white/10 bg-[#0a0a0a]/95 p-5 md:w-[400px] md:flex-none md:border-l md:border-t-0 md:p-7">
        <div className="h-6 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="h-9 w-3/4 animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/5" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-lg bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Chargement du tableau de bord…</span>
      <div className="mb-5 h-9 w-full animate-pulse rounded-lg bg-white/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <GalleryCard key={index} />
        ))}
      </div>
    </div>
  );
}
