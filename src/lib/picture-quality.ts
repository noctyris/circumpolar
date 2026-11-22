import type { Picture } from "@/types";

const COORDINATE_CATEGORIES = new Set(["Ciel profond", "Open Field"]);

export function missingPictureFields(image: Picture): string[] {
  const missing: string[] = [];

  if (COORDINATE_CATEGORIES.has(image.target_category) && (image.ra == null || image.dec == null)) {
    missing.push("coordonnées");
  }

  if (!image.processing_software?.length) missing.push("logiciels");

  return missing;
}

export function isPictureIncomplete(image: Picture): boolean {
  return missingPictureFields(image).length > 0;
}
