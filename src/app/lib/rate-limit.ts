/**
 * Limiteur de tentatives de connexion.
 *
 * Le compteur principal est en base PostgreSQL : il reste partagé entre les
 * instances serverless. Un compteur mémoire sert uniquement de secours si la
 * table n'est pas encore migrée ou si la base est momentanément indisponible.
 */

import sql from "@/app/lib/data";

const attempts = new Map<string, number[]>();
const MAX_MEMORY_KEYS = 5000;

function recentMemoryAttempts(key: string, windowMs: number, now: number): number[] {
  const recent = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length === 0) {
    attempts.delete(key);
  } else {
    attempts.set(key, recent);
  }
  return recent;
}

function pruneMemory() {
  if (attempts.size <= MAX_MEMORY_KEYS) return;
  const now = Date.now();
  for (const [key, timestamps] of attempts) {
    if (timestamps.every((timestamp) => now - timestamp > 60 * 60 * 1000)) {
      attempts.delete(key);
    }
  }
}

function memoryIsRateLimited(key: string, limit: number, windowMs: number): boolean {
  return recentMemoryAttempts(key, windowMs, Date.now()).length >= limit;
}

function memoryRecordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const recent = recentMemoryAttempts(key, windowMs, now);
  recent.push(now);
  attempts.set(key, recent);
  pruneMemory();
}

function memoryClearFailures(key: string) {
  attempts.delete(key);
}

/** Vrai si le quota de tentatives échouées est déjà atteint. */
export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  try {
    const rows = await sql<{ count: number }[]>`
      SELECT count(*)::int AS count
      FROM login_attempts
      WHERE key = ${key}
        AND attempted_at > now() - (${windowMs} * interval '1 millisecond')
    `;
    return Number(rows[0]?.count ?? 0) >= limit;
  } catch {
    return memoryIsRateLimited(key, limit, windowMs);
  }
}

/** Enregistre une tentative échouée. */
export async function recordFailure(key: string, windowMs: number): Promise<void> {
  memoryRecordFailure(key, windowMs);

  try {
    await sql`INSERT INTO login_attempts (key) VALUES (${key})`;
    await sql`DELETE FROM login_attempts WHERE attempted_at < now() - interval '1 day'`;
  } catch {
    // Le fallback mémoire a déjà été alimenté ci-dessus.
  }
}

/** Efface le compteur (connexion réussie). */
export async function clearFailures(key: string): Promise<void> {
  memoryClearFailures(key);

  try {
    await sql`DELETE FROM login_attempts WHERE key = ${key}`;
  } catch {
    // Le compteur mémoire est déjà nettoyé.
  }
}
