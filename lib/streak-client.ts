'use client';

/**
 * THE single client-side home of the daily streak (CHE-388).
 *
 * Reads: every surface (nav badge, profile, completion screens) goes through
 * `getStreak()` — one module-level cache, one in-flight request, one
 * localStorage snapshot — so two surfaces can never show different numbers.
 * The endpoint runs a 4-table scan per call; before this store existed FIVE
 * surfaces fetched it independently, ~20 DB queries per session (CHE-374).
 *
 * - Reads within TTL_MS return the cached value (keyed to the user's local
 *   day, so a day rollover at midnight always refetches).
 * - Concurrent callers share one in-flight request.
 * - `fresh: true` bypasses the cache — completion surfaces use it so the
 *   just-finished unit is reflected immediately — and the result UPDATES the
 *   cache, so navigation-driven consumers (badge) see the new streak without
 *   their own round-trip.
 * - `peekStreak(userId)` returns the last-known value synchronously (module
 *   cache, falling back to a localStorage snapshot validated against TODAY +
 *   THIS USER) for instant paint while `getStreak()` revalidates. A stale or
 *   other-user snapshot returns null — it can never be rendered.
 *
 * Claims: `claimStreakToday()` is the ONLY way a celebration is earned. It
 * polls for the just-landed completion write, then atomically claims the day
 * via POST /api/workout/celebrate — first claim per (user, date) wins, so at
 * most one surface celebrates per day no matter how many race. It is called
 * ONLY from completion screens (ActivityComplete, StreakComplete); there is
 * deliberately no global watcher that could pop the celebration mid-activity.
 */

export type StreakData = {
  current: number;
  longest: number;
  completedToday: boolean;
  activeDays: string[];
};

export type StreakClaim =
  | { status: 'celebrated'; streak: number } // first finish today — this surface won the claim
  | { status: 'already'; streak: number } // day already claimed (another surface/device)
  | { status: 'none' }; // no qualifying finish landed within the poll window

const TTL_MS = 60_000;
const SNAPSHOT_KEY = 'cp:workout-streak:v2';
const USER_KEY = 'cp:uid';

let cache: { data: StreakData; day: string; fetchedAt: number } | null = null;
let inFlight: Promise<StreakData | null> | null = null;
// Last user id any caller identified — lets fetches that have no user in scope
// (claim polls, profile's pre-auth fetch) still persist the snapshot. The nav
// badge passes its id on every page, so this is set within the first render.
let knownUserId: string | null = null;

export function getTz(): string {
  return typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';
}

/** Today as YYYY-MM-DD in the user's local timezone. */
export function localDay(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: getTz(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

type Snapshot = { day: string; userId: string; data: StreakData };

function readSnapshot(userId: string): StreakData | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw) as Snapshot;
    // A snapshot from another day or another user must never paint — that was
    // the nav-vs-profile mismatch (yesterday's count surviving a failed fetch).
    if (snap.day !== localDay() || snap.userId !== userId) return null;
    return snap.data;
  } catch {
    return null;
  }
}

function writeSnapshot(userId: string, day: string, data: StreakData) {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ day, userId, data } satisfies Snapshot));
    localStorage.setItem(USER_KEY, userId);
  } catch {
    // quota / private mode — snapshot is an optimization only
  }
}

/** Last userId that wrote a streak snapshot — lets components peek before auth resolves. */
export function getStoredUserId(): string | null {
  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

/**
 * Last-known streak, synchronously, for instant paint. Module cache first,
 * then the localStorage snapshot (same day + same user only). Callers must
 * still `getStreak()` to revalidate.
 */
export function peekStreak(userId: string): StreakData | null {
  if (cache && cache.day === localDay()) return cache.data;
  return readSnapshot(userId);
}

export async function getStreak(opts?: {
  fresh?: boolean;
  /** When known, the fetched result is also persisted as this user's snapshot. */
  userId?: string;
}): Promise<StreakData | null> {
  if (opts?.userId) knownUserId = opts.userId;
  const day = localDay();
  if (
    !opts?.fresh &&
    cache &&
    cache.day === day &&
    Date.now() - cache.fetchedAt < TTL_MS
  ) {
    return cache.data;
  }
  // fresh readers must NOT be handed an in-flight request that started before
  // their completion write landed — they exist to see that write.
  if (!opts?.fresh && inFlight) return inFlight;

  const request: Promise<StreakData | null> = fetch(
    `/api/workout/streak?tz=${encodeURIComponent(getTz())}`,
    { cache: 'no-store' },
  )
    .then((r) => (r.ok ? (r.json() as Promise<StreakData>) : null))
    .then((data) => {
      if (data && typeof data.current === 'number') {
        cache = { data, day, fetchedAt: Date.now() };
        if (knownUserId) writeSnapshot(knownUserId, day, data);
        return data;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      // Only clear our own slot — a newer fresh request may have replaced it.
      if (inFlight === request) inFlight = null;
    });
  inFlight = request;
  return request;
}

/** Drop the cached streak — next read refetches. Call after a completion write. */
export function invalidateStreak() {
  cache = null;
}

/**
 * Poll for the just-landed completion write, then atomically claim today's
 * celebration. Call ONLY from a completion screen. The completion write is
 * often still in flight when that screen mounts (e.g. game_sessions.end() is
 * fire-and-forget), hence the bounded poll. If the write never lands inside
 * the window, the answer is 'none' and the celebration simply waits for the
 * next finished unit — it must never be handed to a global watcher that could
 * fire it mid-activity (that was the recurring mid-lesson popup).
 *
 * `signal.cancelled` stops the poll AND prevents the claim, so an unmounted
 * surface can't silently consume the day's celebration.
 */
export async function claimStreakToday(opts?: {
  attempts?: number;
  delayMs?: number;
  signal?: { cancelled: boolean };
}): Promise<StreakClaim> {
  const attempts = opts?.attempts ?? 4;
  const delayMs = opts?.delayMs ?? 1000;
  for (let i = 0; i < attempts; i++) {
    if (opts?.signal?.cancelled) return { status: 'none' };
    if (i > 0) await new Promise((r) => setTimeout(r, delayMs));
    const data = await getStreak({ fresh: true });
    if (opts?.signal?.cancelled) return { status: 'none' };
    if (!data?.completedToday) continue;
    try {
      const r = await fetch(`/api/workout/celebrate?tz=${encodeURIComponent(getTz())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak: data.current }),
      });
      if (!r.ok) return { status: 'already', streak: data.current };
      const { claimed } = (await r.json()) as { claimed: boolean };
      return claimed
        ? { status: 'celebrated', streak: data.current }
        : { status: 'already', streak: data.current };
    } catch {
      return { status: 'already', streak: data.current };
    }
  }
  return { status: 'none' };
}
