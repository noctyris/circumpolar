import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-indigo-300">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-200/70">
        Erreur 404
      </p>
      <h1 className="mt-3 font-title text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/60">
        Cette page n’existe pas ou a été déplacée. Les images, elles, sont toujours
        dans la galerie.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-subtitle text-[10px] uppercase tracking-widest text-white/75 transition hover:border-indigo-300/30 hover:bg-indigo-500/10 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Retour à la galerie
      </Link>
    </section>
  );
}
