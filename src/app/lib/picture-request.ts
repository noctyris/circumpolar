import type { NextRequest } from "next/server";
import {
  normalizePictureInput,
  pictureInputSchema,
  type NormalizedPictureInput,
} from "@/lib/picture-schema";

const MAX_BODY_BYTES = 100_000;

type RequestResult =
  | { ok: true; data: NormalizedPictureInput }
  | { ok: false; status: number; error: string; issues?: string[] };

export async function readPictureRequest(req: NextRequest): Promise<RequestResult> {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: "Requête trop volumineuse." };
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: "Requête trop volumineuse." };
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { ok: false, status: 400, error: "Corps JSON invalide." };
  }

  const parsed = pictureInputSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Certains champs sont invalides.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }

  return { ok: true, data: normalizePictureInput(parsed.data) };
}
