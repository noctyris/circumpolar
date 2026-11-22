import postgres from "postgres";
import { Picture } from "@/types";
import type { PictureSort, SortOrder } from "@/lib/gallery";
import { normalizePictureLists } from "@/lib/picture-lists";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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

export async function fetchImages(
  options: { sort?: PictureSort; order?: SortOrder } = {}
): Promise<Picture[]> {
  const column = SORT_COLUMNS[options.sort ?? "capture_date"] ?? "capture_date";
  const direction = options.order === "asc" ? "ASC" : "DESC";
  const rows = await sql.unsafe(
    `SELECT * FROM pictures ORDER BY ${column} ${direction} NULLS LAST, id DESC`
  );

  return rows.map((row) => normalizePictureLists(row));
}

export async function fetchSingleImage(id: string | number): Promise<Picture[]> {
  const rows = await sql`SELECT * FROM pictures WHERE ID=${id} ORDER BY capture_date DESC`;
  return rows.map((row) => normalizePictureLists(row));
}

export default sql;
