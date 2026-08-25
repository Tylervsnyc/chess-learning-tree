'use client';

import { useEffect, useState } from 'react';
import {
  getStoredUserId,
  getStreak,
  getTz,
  peekStreak,
  type StreakData,
} from '@/lib/streak-client';
import type { WeekData } from '@/components/shared/WeekChart';
import type { EloSeriesPoint } from '@/lib/elo/rookie-rating';
// The server owns these shapes — import them rather than restate them, or the
// client's idea of a profile drifts from what the route actually sends.
import type { LifetimeStats } from '@/lib/profile/stats';
import type { WorkoutSessionSummary } from '@/lib/workout/sessions';

/**
 * hooks/useProfileData — the ONE read behind every profile surface.
 *
 * /profile (web) and /box/profile (app) show the same numbers in different
 * shapes. They each used to run their own copy of the same three requests,
 * which is how two screens showing the same person can quietly disagree —
 * different cache options, different error handling, different idea of what
 * "no data yet" means. One hook, one shape, both screens.
 *
 * The three sources, and why they are what they are:
 *   - streak    → getStreak() ONLY. Never fetch /api/workout/streak directly;
 *                 it's a 4-table scan and the client cache is the one reader
 *                 (CHE-388, RULES.md §11).
 *   - dashboard → GET /api/profile/dashboard returns stats + week + sessions
 *                 + elo in a single round-trip (CHE-379, was four calls).
 *   - record    → GET /api/bout/record, the fight record.
 *
 * Fires on mount without waiting for useUser(): these routes authenticate off
 * the cookie themselves, so the data loads in parallel with the auth check
 * rather than behind it. Logged-out callers get 401s, which land here as nulls
 * and render as the signed-out state.
 */

export interface EloData {
  current: number;
  events: number;
  series: EloSeriesPoint[];
}

export interface BoutRecord {
  wins: number;
  losses: number;
  draws: number;
  kos: number;
  total: number;
  points: number;
}

export interface ProfileData {
  streak: StreakData | null;
  stats: LifetimeStats | null;
  week: WeekData | null;
  sessions: WorkoutSessionSummary[] | null;
  elo: EloData | null;
  record: BoutRecord | null;
  /** True until the whole set has settled. Individual fields may be null after. */
  loading: boolean;
}

/**
 * Seed the streak synchronously from the day-and-user-validated localStorage
 * snapshot. Without this the streak hero renders at zero and then jumps when
 * the fetch lands, which was visibly shoving the rest of /profile down on load
 * (CHE-379). Returns null on the server and for a signed-out visitor.
 */
function seedStreak(): StreakData | null {
  if (typeof window === 'undefined') return null;
  const uid = getStoredUserId();
  return uid ? peekStreak(uid) : null;
}

export function useProfileData(): ProfileData {
  const [data, setData] = useState<ProfileData>(() => ({
    streak: seedStreak(),
    stats: null,
    week: null,
    sessions: null,
    elo: null,
    record: null,
    loading: true,
  }));

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getStreak().catch(() => null),
      fetch(`/api/profile/dashboard?tz=${encodeURIComponent(getTz())}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch('/api/bout/record', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([s, d, b]) => {
      if (cancelled) return;
      setData((prev) => ({
        // Keep the seeded snapshot if the live read failed — a stale-but-real
        // streak beats flashing back to nothing.
        streak: s ?? prev.streak,
        stats: (d?.stats as LifetimeStats) ?? null,
        week: (d?.week as WeekData) ?? null,
        sessions: Array.isArray(d?.sessions) ? (d.sessions as WorkoutSessionSummary[]) : [],
        elo: (d?.elo as EloData) ?? null,
        record: (b?.record as BoutRecord) ?? null,
        loading: false,
      }));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
