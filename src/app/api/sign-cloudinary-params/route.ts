import { v2 as cloudinary } from "cloudinary";
import { auth } from "@root/auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Seuls ces paramètres peuvent être signés : signer le reste (transformations
// `eager`, `invalidate`, `public_id`…) permettrait de piloter le compte
// Cloudinary à volonté.
const ALLOWED_KEYS = ["timestamp", "source", "folder"] as const;

function safeFolder(folder: unknown): string | null {
  if (typeof folder !== "string") return null;
  const trimmed = folder.trim();
  // Dossier relatif simple : pas de `..`, pas de chemin absolu.
  if (!/^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/.test(trimmed)) return null;
  return trimmed;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const raw = (body as { paramsToSign?: unknown } | null)?.paramsToSign;
  if (!raw || typeof raw !== "object") {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const unsigned = raw as Record<string, unknown>;
  const unknownKeys = Object.keys(unsigned).filter(
    (key) => !(ALLOWED_KEYS as readonly string[]).includes(key),
  );
  if (unknownKeys.length > 0) {
    console.error(
      `Signature Cloudinary refusée pour les paramètres : ${unknownKeys.join(", ")}`,
    );
    return Response.json(
      { error: `Paramètres non autorisés : ${unknownKeys.join(", ")}` },
      { status: 400 },
    );
  }

  const timestamp = Number(unsigned.timestamp);
  if (!Number.isInteger(timestamp) || timestamp <= 0) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const paramsToSign: Record<string, string | number> = { timestamp };

  if (unsigned.source !== undefined) {
    if (typeof unsigned.source !== "string" || unsigned.source.length > 32) {
      return Response.json({ error: "Bad request" }, { status: 400 });
    }
    paramsToSign.source = unsigned.source;
  }

  if (unsigned.folder !== undefined) {
    const folder = safeFolder(unsigned.folder);
    if (!folder) {
      return Response.json({ error: "Bad request" }, { status: 400 });
    }
    paramsToSign.folder = folder;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return Response.json({ signature });
}
