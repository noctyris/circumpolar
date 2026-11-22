import sql from "@/app/lib/data";
import {
  normalizeList,
  type PictureListField,
  type PictureListValue,
} from "@/lib/picture-lists";

type ColumnType = "jsonb" | "text";

let columnTypesPromise: Promise<Record<PictureListField, ColumnType>> | null = null;

async function getColumnTypes(): Promise<Record<PictureListField, ColumnType>> {
  columnTypesPromise ??= sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pictures'
      AND column_name IN ('accessories', 'processing_software')
  `
    .then((rows) => {
      const typeOf = (name: PictureListField): ColumnType =>
        rows.find((row) => row.column_name === name)?.data_type === "jsonb" ? "jsonb" : "text";

      return {
        accessories: typeOf("accessories"),
        processing_software: typeOf("processing_software"),
      };
    })
    .catch(() => ({ accessories: "text", processing_software: "text" }));

  return columnTypesPromise;
}

export async function prepareListForDb(
  value: unknown,
  field: PictureListField
): Promise<PictureListValue> {
  const list = normalizeList(value);
  if (!list) return null;

  const types = await getColumnTypes();
  return types[field] === "jsonb" ? list : list.join(", ");
}
