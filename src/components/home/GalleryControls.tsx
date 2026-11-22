"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Layers3 } from "lucide-react";
import {
  DEFAULT_SORT,
  GROUP_OPTIONS,
  SORT_OPTIONS,
  type PictureGroup,
  type PictureSort,
  type SortOrder,
} from "@/lib/gallery";

const selectClass =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-xs text-white/70 outline-none transition hover:border-white/20 focus:border-accent/60";

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

  return (
    <div
      aria-busy={pending}
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-opacity ${pending ? "opacity-60" : ""}`}
    >
      <label className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Trier</span>
        <select value={sort} onChange={(event) => update("sort", event.target.value)} className={selectClass}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => update("order", order === "desc" ? "asc" : "desc")}
        aria-label={order === "desc" ? "Passer en ordre croissant" : "Passer en ordre décroissant"}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-xs text-white/60 transition hover:border-white/20 hover:text-white"
      >
        {order === "desc" ? <ArrowDownWideNarrow className="h-3.5 w-3.5" /> : <ArrowUpNarrowWide className="h-3.5 w-3.5" />}
        {order === "desc" ? "Décroissant" : "Croissant"}
      </button>

      <label className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
          <Layers3 className="h-3.5 w-3.5" />
          Grouper
        </span>
        <select value={group} onChange={(event) => update("group", event.target.value)} className={selectClass}>
          {GROUP_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <span className="sr-only" role="status" aria-live="polite">
        {pending ? "Mise à jour de la galerie" : ""}
      </span>
    </div>
  );
}
