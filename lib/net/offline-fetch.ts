/**
 * The network adapter for the offline app bundle.
 *
 * WHY A FETCH INTERCEPTOR AND NOT 40 EDITED CALL SITES
 * Two things are true of EVERY `/api/...` call once the app is served from the
 * device, and neither is about any individual feature:
 *
 *   1. a relative URL now points at the app bundle, not the server, so it 404s
 *      even on perfect wifi — every call must be re-pointed at chesspath.app;
 *   2. cookies don't cross that origin, so every call must carry the bearer
 *      token instead (see lib/supabase/server.ts).
 *
 * That's a property of the platform, not of `useProgress` or `level-client`.
 * Encoding it once here keeps ONE implementation of the rule — and means code
 * written next month gets it automatically instead of silently regressing.
 * Which route may be queued or cached is the part that IS feature-specific, and
 * that lives in api-policy.ts where it can be read at a glance.
 *
 * On the web this file does nothing at all: install() returns immediately
 * unless IS_OFFLINE_APP, so no site visitor ever gets a patched fetch.
 */
import { IS_OFFLINE_APP } from '@/lib/config/offline';
import { createClient } from '@/lib/supabase/client';
import { isQueueableWrite, isCacheableRead } from './api-policy';
import { readCache, writeCache } from './read-cache';
import { enqueue, peekAll, remove, recordFailure } from './outbox';

/** Where the app's API actually lives. */
const API_BASE = 'https://chesspath.app';

let installed = false;
let draining = false;

function rawUrl(input: RequestInfo | URL): string {
  return typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
}

/**
 * The /api pathname of a request, or null if it isn't one of ours.
 *
 * Three spellings all mean "our API": a relative `/api/...`, the same thing
 * resolved against the page origin (which is what a `Request` object holds —
 * `new Request('/api/x').url` is already absolute), and the real server URL.
 */
function apiPathname(input: RequestInfo | URL): string | null {
  const url = new URL(rawUrl(input), window.location.origin);
  if (!url.pathname.startsWith('/api/')) return null;
  if (url.origin !== window.location.origin && url.origin !== API_BASE) return null;
  return url.pathname;
}

/** The same request, re-pointed at the real server. */
function absolute(input: RequestInfo | URL): RequestInfo | URL {
  const url = new URL(rawUrl(input), window.location.origin);
  if (url.origin === API_BASE) return input;
  const target = API_BASE + url.pathname + url.search;
  return typeof input === 'string' || input instanceof URL ? target : new Request(target, input);
}

/** The access token supabase-js is already holding, if the user is signed in. */
async function authHeader(): Promise<Record<string, string>> {
  try {
    const { data } = await createClient().auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/**
 * Send everything the queue is holding, oldest first.
 *
 * Stops at the first failure rather than skipping past it: later progress
 * writes assume the earlier ones landed, so draining out of order would
 * reintroduce exactly the inconsistency the queue exists to prevent.
 */
export async function drainOutbox(): Promise<{ sent: number; dropped: number }> {
  if (draining || !navigator.onLine) return { sent: 0, dropped: 0 };
  draining = true;

  let sent = 0;
  let dropped = 0;
  try {
    const auth = await authHeader();
    for (const entry of await peekAll()) {
      try {
        const res = await fetch(entry.url, {
          method: entry.method,
          headers: { ...entry.headers, ...auth },
          body: entry.body,
        });

        // 401/403 means "not signed in right now" — the session expired on the
        // walk home, or the app was reopened before supabase-js refreshed it.
        // The write itself is fine; dropping it here would lose a lesson the
        // user finished. Keep it, stop, and let the next sign-in drain it.
        if (res.status === 401 || res.status === 403) break;

        // Any other 4xx means the server understood and refused — replaying
        // won't help, so drop it rather than wedging everything behind it.
        if (res.ok || (res.status >= 400 && res.status < 500)) {
          if (entry.id != null) await remove(entry.id);
          if (res.ok) sent++;
          else dropped++;
          continue;
        }
        throw new Error(`status ${res.status}`);
      } catch {
        if (await recordFailure(entry)) dropped++;
        break; // preserve order; try again on the next reconnect
      }
    }
  } finally {
    draining = false;
  }

  return { sent, dropped };
}

export function installOfflineFetch(): void {
  if (!IS_OFFLINE_APP || installed || typeof window === 'undefined') return;
  installed = true;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const pathname = apiPathname(input);
    if (!pathname) return nativeFetch(input, init);

    const method = (init?.method || (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET') || 'GET').toUpperCase();

    // Capture a replayable copy of the body BEFORE anything reads the stream.
    // For fetch(url, init) it's a string in init; for fetch(new Request(...))
    // it's a one-shot stream inside the object, consumed by the network call
    // (and by `new Request(url, request)` in absolute()). Cloning after a
    // failed send throws "body is already used" — so it's read first, and
    // only for writes that could actually end up in the outbox.
    const replayBody = !isQueueableWrite(pathname, method)
      ? null
      : typeof init?.body === 'string'
        ? init.body
        : typeof input !== 'string' && !(input instanceof URL)
          ? await input.clone().text()
          : null;

    const target = absolute(input);
    const headers = new Headers(init?.headers);
    for (const [k, v] of Object.entries(await authHeader())) headers.set(k, v);

    const cacheKey = pathname;

    try {
      const response = await nativeFetch(target, { ...init, headers });

      if (response.ok && isCacheableRead(pathname, method)) {
        writeCache(cacheKey, await response.clone().json().catch(() => null));
      }
      return response;
    } catch (networkError) {
      // Genuinely offline (or the server is unreachable).
      if (isQueueableWrite(pathname, method)) {
        await enqueue({
          url: rawUrl(target),
          method,
          body: replayBody || null,
          headers: { 'Content-Type': headers.get('Content-Type') || 'application/json' },
          queuedAt: Date.now(),
        });
        // Tell the caller it worked: it did — the write is durable and will
        // land. Failing here would roll back UI the user has already earned.
        return new Response(JSON.stringify({ queued: true }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (isCacheableRead(pathname, method)) {
        const cached = readCache(cacheKey);
        if (cached !== null) {
          return new Response(JSON.stringify(cached), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'X-From-Cache': '1' },
          });
        }
      }

      // Everything else resolves to a failed RESPONSE rather than rejecting.
      // Before the app was served from the device these same calls came back as
      // ordinary error responses, and the call sites are written for that. If
      // this threw instead, any `fetch()` not individually wrapped would become
      // an unhandled rejection — a behaviour change dressed up as a fix. The
      // request still failed; the caller just learns about it the usual way.
      void networkError;
      return new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json', 'X-Offline': '1' },
      });
    }
  };

  window.addEventListener('online', () => { void drainOutbox(); });
  void drainOutbox();
}
