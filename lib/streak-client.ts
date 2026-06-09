'use client';

/**
 * Shared client-side reader for /api/workout/streak.
 *
 * Why: the streak endpoint runs a 4-table scan per call, and before this store
 * existed FIVE surfaces fetched it independently — DailyWorkoutBadge and
 * DailyWorkoutWatcher on EVERY route change, plus useDailyStreak,
 * useDailyWorkout, profile, and the completion screens. Navigating 5 screens
 * cost ~20 DB queries for data that changes at most a few times a day (CHE-374).
 *
 * The cache is module-level: one fetch serves every consumer on the page.
 * - Reads within TTL_MS return the cached value (keyed to the user's local
 *   day, so a day rollover at midnight always refetches).
 * - Concurrent callers share one in-flight request.
 * - `fresh: true` bypasses the cache — completion surfaces use it so the
 *   just-finished unit is reflected immediately — and the result UPDATES the
 *   cache, so navigation-driven consumers (badge, watcher) see the new streak
 *   without their own round-trip.
 * - `invalidateStreak()` drops the cache; call it when a completion write
 *   lands outside a fresh-reading surface.
 *
 * The streak claim (POST /api/workout/celebrate) is intentionally NOT here —
 * it must stay uncached and atomic.
 */

export type StreakData = {
  current: number;
  longest: number;
  completedToday: boolean;
  activeDays: string[];
};

const TTL_MS = 60_000;

let cache: { data: StreakData; day: string; fetchedAt: number } | null = null;
let inFlight: Promise<StreakData | null> | null = null;

export function getTz(): string {
  return typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';
}

function localDay(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: getTz(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export async function getStreak(opts?: { fresh?: boolean }): Promise<StreakData | null> {
  const day = localDay();
  if (
    !opts?.fresh &&
    cache &&
    cache.day === day &&
    Date.now() - cache.fetchedAt < TTL_MS
  ) {
    return cache.data;
  }
  if (inFlight) return inFlight;

  inFlight = fetch(`/api/workout/streak?tz=${encodeURIComponent(getTz())}`, {
    cache: 'no-store',
  })
    .then((r) => (r.ok ? (r.json() as Promise<StreakData>) : null))
    .then((data) => {
      if (data && typeof data.current === 'number') {
        cache = { data, day, fetchedAt: Date.now() };
        return data;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** Drop the cached streak — next read refetches. Call after a completion write. */
export function invalidateStreak() {
  cache = null;
}
