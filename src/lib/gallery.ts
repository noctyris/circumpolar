import type { Picture } from "@/types";

export const SORT_OPTIONS = [
  { value: "capture_date", label: "Date de capture" },
  { value: "upload_date", label: "Date de publication" },
  { value: "title", label: "Titre" },
  { value: "target", label: "Cible" },
  { value: "target_category", label: "Catégorie" },
  { value: "focal_length", label: "Focale" },
  { value: "f_number", label: "Ouverture" },
  { value: "bortle_class", label: "Classe de Bortle" },
  { value: "id", label: "Référence" },
] as const;

export type PictureSort = (typeof SORT_OPTIONS)[number]["value"];
export const DEFAULT_SORT: PictureSort = "capture_date";

export const GROUP_OPTIONS = [
  { value: "none", label: "Aucun" },
  { value: "target_category", label: "Catégorie" },
  { value: "optics", label: "Optique" },
  { value: "camera", label: "Caméra" },
  { value: "location", label: "Lieu" },
  { value: "bortle_class", label: "Classe de Bortle" },
  { value: "target", label: "Cible" },
] as const;

export type PictureGroup = (typeof GROUP_OPTIONS)[number]["value"];

export type SortOrder = "asc" | "desc";

export function parseSort(value?: string): PictureSort {
  return SORT_OPTIONS.some((option) => option.value === value) ? (value as PictureSort) : DEFAULT_SORT;
}

export function parseGroup(value?: string): PictureGroup {
  return GROUP_OPTIONS.some((option) => option.value === value) ? (value as PictureGroup) : "none";
}

export function parseOrder(value?: string): SortOrder {
  return value === "asc" ? "asc" : "desc";
}

export type PictureGroupResult = {
  key: string;
  label: string | null;
  images: Picture[];
};

function groupValue(image: Picture, group: Exclude<PictureGroup, "none">): string {
  const value = image[group];

  if (value === undefined || value === null || value === "") {
    return "Non renseigné";
  }

  if (group === "bortle_class") {
    return `Bortle ${value}`;
  }

  return String(value);
}

export function groupPictures(images: Picture[], group: PictureGroup): PictureGroupResult[] {
  if (group === "none") {
    return [{ key: "all", label: null, images }];
  }

  const groups = new Map<string, Picture[]>();

  for (const image of images) {
    const value = groupValue(image, group);
    const bucket = groups.get(value);

    if (bucket) {
      bucket.push(image);
    } else {
      groups.set(value, [image]);
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([label, groupImages]) => ({
      key: `${group}-${label}`,
      label,
      images: groupImages,
    }));
}
