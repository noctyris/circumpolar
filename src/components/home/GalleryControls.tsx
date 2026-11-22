"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ChevronDown,
  Layers3,
  LoaderCircle,
  SlidersHorizontal,
} from "lucide-react";
import {
  DEFAULT_SORT,
  GROUP_OPTIONS,
  SORT_OPTIONS,
  type PictureGroup,
  type PictureSort,
  type SortOrder,
} from "@/lib/gallery";

const selectClass =
  "w-full cursor-pointer appearance-none bg-transparent pr-5 font-body text-xs text-white/80 outline-none [color-scheme:dark] sm:w-auto";

const controlBase = "rounded-xl border border-white/10 bg-white/[0.04] transition";

export default function GalleryControls({
  sort,
  order,
  group,
}: {
  sort: PictureSort;
  order: SortOrder;
  group: PictureGroup;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function update(key: "sort" | "order" | "group", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (
      (key === "sort" && value === DEFAULT_SORT) ||
      (key === "order" && value === "desc") ||
      (key === "group" && value === "none")
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    });
  }

  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "Date";
  const groupLabel = GROUP_OPTIONS.find((option) => option.value === group)?.label;
  const summary =
    group === "none"
      ? `${sortLabel} · ${order === "desc" ? "décroissant" : "croissant"}`
      : `${sortLabel} · ${groupLabel}`;

  return (
    <div aria-busy={pending} className="space-y-2">
      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        aria-expanded={filtersOpen}
        aria-controls="gallery-filters"
        className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-[#0b0b0f]/90 px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-indigo-300/25 sm:hidden"
      >
        {pending ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-indigo-300" aria-hidden="true" />
        ) : (
          <SlidersHorizontal className="h-4 w-4 text-indigo-300" aria-hidden="true" />
        )}
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
          Filtres
        </span>
        <span className="ml-auto min-w-0 truncate font-body text-xs text-white/35">
          {summary}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${
            filtersOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div id="gallery-filters" className={`${filtersOpen ? "block" : "hidden"} sm:block`}>
        <div
          className={`relative rounded-2xl bg-gradient-to-r from-indigo-500/45 via-cyan-400/25 to-fuchsia-400/35 p-px shadow-[0_24px_80px_-52px_rgba(99,102,241,0.9)] transition-opacity ${
            pending ? "opacity-70" : ""
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 rounded-[15px] bg-[#0b0b0f]/95 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
        <span className="flex shrink-0 items-center gap-2 pl-1 pr-1">
          {pending ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-indigo-300" aria-hidden="true" />
          ) : (
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
          )}
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 sm:inline">
            Affiner
          </span>
        </span>

        <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-white/10 sm:block" />

        <label
          className={`${controlBase} flex min-w-0 flex-1 items-center gap-2 px-3 py-1.5 hover:border-indigo-400/25 focus-within:border-indigo-400/50 focus-within:bg-indigo-500/[0.06] sm:flex-none`}
        >
          <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-indigo-300" aria-hidden="true" />
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-indigo-200/60">
            Trier
          </span>
          <span className="relative min-w-0 flex-1 sm:flex-none">
            <select
              value={sort}
              onChange={(event) => update("sort", event.target.value)}
              aria-label="Trier par"
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-indigo-200/50"
              aria-hidden="true"
            />
          </span>
        </label>

        <div
          role="group"
          aria-label="Ordre de tri"
          className={`${controlBase} flex shrink-0 items-center gap-1 p-1 pl-3`}
        >
          <span className="pr-1 font-mono text-[9px] uppercase tracking-widest text-cyan-200/60">
            Ordre
          </span>
          <div className="flex rounded-lg border border-white/5 bg-black/25 p-0.5">
            <button
              type="button"
              onClick={() => update("order", "desc")}
              aria-pressed={order === "desc"}
              aria-label="Trier par ordre décroissant"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 font-body text-[11px] transition ${
                order === "desc"
                  ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <ArrowDownWideNarrow className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Décroissant</span>
              <span className="sm:hidden">Desc.</span>
            </button>
            <button
              type="button"
              onClick={() => update("order", "asc")}
              aria-pressed={order === "asc"}
              aria-label="Trier par ordre croissant"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 font-body text-[11px] transition ${
                order === "asc"
                  ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <ArrowUpNarrowWide className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Croissant</span>
              <span className="sm:hidden">Asc.</span>
            </button>
          </div>
        </div>

        <label
          className={`${controlBase} flex min-w-0 flex-1 items-center gap-2 px-3 py-1.5 hover:border-fuchsia-400/25 focus-within:border-fuchsia-400/50 focus-within:bg-fuchsia-500/[0.06] sm:flex-none`}
        >
          <Layers3 className="h-3.5 w-3.5 shrink-0 text-fuchsia-300" aria-hidden="true" />
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-fuchsia-200/60">
            Grouper
          </span>
          <span className="relative min-w-0 flex-1 sm:flex-none">
            <select
              value={group}
              onChange={(event) => update("group", event.target.value)}
              aria-label="Grouper par"
              className={selectClass}
            >
              {GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-fuchsia-200/50"
              aria-hidden="true"
            />
          </span>
        </label>

          </div>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {pending ? "Mise à jour de la galerie" : ""}
      </span>
    </div>
  );
}
