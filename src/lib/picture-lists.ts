import type { Picture } from "@/types";

export type PictureListField = "accessories" | "processing_software";
export type PictureListValue = string | string[] | null;

/**
 * Les anciennes colonnes stockaient des listes séparées par des virgules.
 * On accepte les deux formats pendant la migration.
 */
export function normalizeList(value: unknown): string[] | undefined {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const normalized = items.map((item) => String(item).trim()).filter(Boolean);
  const unique = Array.from(new Set(normalized));

  return unique.length > 0 ? unique : undefined;
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function normalizePictureLists(row: Record<string, unknown>): Picture {
  return {
    ...row,
    accessories: normalizeList(row.accessories),
    processing_software: normalizeList(row.processing_software),
    // PostgreSQL renvoie les colonnes numeric sous forme de chaînes.
    focal_length: toNumber(row.focal_length),
    f_number: toNumber(row.f_number),
    ra: toNumber(row.ra),
    dec: toNumber(row.dec),
    bortle_class: toNumber(row.bortle_class),
  } as unknown as Picture;
}
