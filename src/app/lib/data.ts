import postgres from "postgres";
import { Picture } from "@/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchImages(): Promise<Picture[]> {
  return await sql`SELECT * FROM pictures ORDER BY capture_date DESC`;
}

export async function fetchSingleImage(id: string|number): Promise<Picture[]> {
  return await sql`SELECT * FROM pictures WHERE ID=${id} ORDER BY capture_date DESC`;
}

export default sql;
