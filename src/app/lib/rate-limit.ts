/**
 * Limiteur de tentatives de connexion, en mémoire du processus.
 *
 * Suffisant pour arrêter un bruteforce mono-instance ; une instance serverless
 * supplémentaire repart d'un compteur vierge, d'où le double compteur (par IP
 * *et* global) qui borne aussi le volume total.
 */

const attempts = new Map<string, number[]>();
const MAX_KEYS = 5000;

function recentAttempts(key: string, windowMs: number, now: number): number[] {
  const recent = (attempts.get(key) ?? []).filter((ts) => now - ts < windowMs);
  if (recent.length === 0) {
    attempts.delete(key);
  } else {
    attempts.set(key, recent);
  }
  return recent;
}

function pruneStale() {
  if (attempts.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [key, timestamps] of attempts) {
    if (timestamps.every((ts) => now - ts > 60 * 60 * 1000)) {
      attempts.delete(key);
    }
  }
}

/** Vrai si le quota de tentatives échouées est déjà atteint. */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  return recentAttempts(key, windowMs, Date.now()).length >= limit;
}

/** Enregistre une tentative échouée. */
export function recordFailure(key: string, windowMs: number): void {
  const now = Date.now();
  const recent = recentAttempts(key, windowMs, now);
  recent.push(now);
  attempts.set(key, recent);
  pruneStale();
}

/** Efface le compteur (connexion réussie). */
export function clearFailures(key: string): void {
  attempts.delete(key);
}
