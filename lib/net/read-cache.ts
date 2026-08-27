/**
 * Last-known-good responses for a handful of GET routes (see api-policy.ts).
 *
 * Written only on a successful live response, read only when a request fails.
 * That ordering is the whole design: the server is always the source of truth
 * and this can never shadow it — it just stops the app claiming you have no
 * progress and no streak the moment the signal drops.
 *
 * localStorage rather than IndexedDB: these are a few small JSON blobs read on
 * render, and a synchronous read keeps them out of the paint path.
 */
const PREFIX = 'cp:read-cache:';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // a month; older than that, show empty

interface Cached {
  at: number;
  body: unknown;
}

export function writeCache(key: string, body: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), body } satisfies Cached));
  } catch {
    // Quota or private mode — a missing cache is a supported state.
  }
}

export function readCache(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.at > MAX_AGE_MS) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return parsed.body;
  } catch {
    return null;
  }
}
