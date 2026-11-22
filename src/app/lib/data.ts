import { cache } from "react";
import postgres from "postgres";
import { Picture } from "@/types";
import type { PictureSort, SortOrder } from "@/lib/gallery";
import { normalizePictureLists } from "@/lib/picture-lists";

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL (ou DATABASE_URL) est requis pour accéder à la base.");
}

const sql = postgres(connectionString, {
  ssl: process.env.POSTGRES_SSL === "false" ? false : "require",
  max: Number(process.env.POSTGRES_POOL_MAX ?? 10),
});

// Les identifiants SQL ne peuvent pas être passés en paramètres : on les
// choisit uniquement dans cette table fermée.
const SORT_COLUMNS: Record<PictureSort, string> = {
  capture_date: "capture_date",
  upload_date: "upload_date",
  title: "title",
  target: "target",
  target_category: "target_category",
  focal_length: "focal_length",
  f_number: "f_number",
  bortle_class: "bortle_class",
  id: "id",
};

const PICTURE_COLUMNS = `
  id, title, target, publicid, annotated_publicid, capture_date, optics,
  camera, mount, accessories, focal_length, f_number, capture_data,
  processing_software, ra, dec, bortle_class, location, target_category,
  upload_date
`;

export async function fetchImages(
  options: { sort?: PictureSort; order?: SortOrder } = {}
): Promise<Picture[]> {
  const column = SORT_COLUMNS[options.sort ?? "capture_date"] ?? "capture_date";
  const direction = options.order === "asc" ? "ASC" : "DESC";
  const rows = await sql.unsafe(
    `SELECT ${PICTURE_COLUMNS} FROM pictures ORDER BY ${column} ${direction} NULLS LAST, id DESC`
  );

  return rows.map((row) => normalizePictureLists(row));
}

export const fetchSingleImage = cache(async (id: string | number): Promise<Picture[]> => {
  const rows = await sql.unsafe(
    `SELECT ${PICTURE_COLUMNS} FROM pictures WHERE id = $1 ORDER BY capture_date DESC`,
    [id]
  );
  return rows.map((row) => normalizePictureLists(row));
});

export default sql;
