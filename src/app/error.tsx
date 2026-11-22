"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/20 bg-amber-400/10 text-amber-300">
        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
        Une erreur est survenue
      </p>
      <h1 className="mt-3 font-title text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
        Le ciel est momentanément couvert
      </h1>
      <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/60">
        La page n’a pas pu être chargée. Tu peux réessayer ou revenir à la galerie.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-subtitle text-[10px] uppercase tracking-widest text-white/75 transition hover:border-indigo-300/30 hover:bg-indigo-500/10 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-subtitle text-[10px] uppercase tracking-widest text-white/55 transition hover:text-white"
        >
          Retour à la galerie
        </Link>
      </div>
    </section>
  );
}
