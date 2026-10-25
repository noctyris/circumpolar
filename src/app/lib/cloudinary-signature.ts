/**
 * Construction des paramètres d'upload à faire signer par Cloudinary.
 *
 * Le widget envoie l'ensemble des paramètres qu'il utilisera pour l'upload ;
 * on n'en signe qu'une liste blanche. Signer `eager`/`transformation`/
 * `invalidate` ouvrirait la porte à des transformations coûteuses, `public_id`
 * à l'écrasement d'assets existants et `type`/`access_mode` à un stockage
 * arbitraire.
 */

export const ALLOWED_UPLOAD_PARAMS = [
  "timestamp",
  "source",
  "folder",
  "upload_preset",
] as const;

export type SignableParams = Record<string, string | number>;

export type SignatureParamsResult =
  | { ok: true; params: SignableParams }
  | { ok: false; error: string; received: string[] };

const SAFE_TOKEN = /^[A-Za-z0-9_-]{1,64}$/;
// Dossier relatif simple : pas de `..`, pas de chemin absolu.
const SAFE_FOLDER = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/;

export function buildParamsToSign(raw: unknown): SignatureParamsResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Requête invalide.", received: [] };
  }

  const unsigned = raw as Record<string, unknown>;
  const received = Object.keys(unsigned);

  const unknownKeys = received.filter(
    (key) => !(ALLOWED_UPLOAD_PARAMS as readonly string[]).includes(key)
  );
  if (unknownKeys.length > 0) {
    return {
      ok: false,
      error: `Paramètres non autorisés : ${unknownKeys.join(", ")}`,
      received,
    };
  }

  const timestamp = Number(unsigned.timestamp);
  if (!Number.isInteger(timestamp) || timestamp <= 0) {
    return { ok: false, error: "Horodatage invalide.", received };
  }

  const params: SignableParams = { timestamp };

  if (unsigned.source !== undefined) {
    if (typeof unsigned.source !== "string" || !SAFE_TOKEN.test(unsigned.source)) {
      return { ok: false, error: "Source invalide.", received };
    }
    params.source = unsigned.source;
  }

  if (unsigned.folder !== undefined) {
    if (typeof unsigned.folder !== "string" || !SAFE_FOLDER.test(unsigned.folder.trim())) {
      return { ok: false, error: "Dossier invalide.", received };
    }
    params.folder = (unsigned.folder as string).trim();
  }

  if (unsigned.upload_preset !== undefined) {
    if (
      typeof unsigned.upload_preset !== "string" ||
      !SAFE_TOKEN.test(unsigned.upload_preset)
    ) {
      return { ok: false, error: "Preset d'upload invalide.", received };
    }
    params.upload_preset = unsigned.upload_preset;
  }

  return { ok: true, params };
}
