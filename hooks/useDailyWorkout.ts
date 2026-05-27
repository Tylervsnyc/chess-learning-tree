import { useEffect, useMemo, useState } from 'react';
import { useLessonProgress } from '@/hooks/useProgress';
import { selectByCategory } from '@/lib/speech/priority-queue';
import { QUIP_POOL } from '@/lib/quips/quip-pool';
import { toneForLevel } from '@/lib/quips/tone';
import { useUser } from '@/hooks/useUser';

export type WorkoutActivity = 'play' | 'tactics' | 'daily';

export interface DailyWorkoutStatus {
  play: boolean;
  tactics: boolean;
  daily: boolean;
  allDone: boolean;
  completedCount: number;
  nextActivity: WorkoutActivity | null;
}

const NEXT_MAP: Record<WorkoutActivity, WorkoutActivity[]> = {
  play: ['tactics', 'daily'],
  tactics: ['daily', 'play'],
  daily: ['play', 'tactics'],
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Server-derived pillar cache ──────────────────────────────────────────
// The authoritative source is /api/workout/streak (it reads game_sessions,
// lesson_progress, and run_completions). Multiple consumers mount this hook
// per page (ActivityComplete, PlayPageRookie), so dedupe with a tiny cache.

type Pillars = { play: boolean; tactics: boolean; daily: boolean };
let pillarCache: { date: string; pillars: Pillars; fetchedAt: number } | null = null;
let inFlight: Promise<Pillars | null> | null = null;
const CACHE_TTL_MS = 15_000;

async function fetchPillars(): Promise<Pillars | null> {
  const now = Date.now();
  const today = getToday();
  if (pillarCache && pillarCache.date === today && now - pillarCache.fetchedAt < CACHE_TTL_MS) {
    return pillarCache.pillars;
  }
  if (inFlight) return inFlight;
  const tz = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';
  inFlight = fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data: { todayPillars?: { play: boolean; path: boolean; run: boolean } } | null) => {
      if (!data?.todayPillars) return null;
      const pillars: Pillars = {
        play: !!data.todayPillars.play,
        tactics: !!data.todayPillars.path,
        daily: !!data.todayPillars.run,
      };
      pillarCache = { date: today, pillars, fetchedAt: Date.now() };
      return pillars;
    })
    .catch(() => null)
    .finally(() => { inFlight = null; });
  return inFlight;
}

/** Force a re-fetch on next read — call after completing an activity. */
export function invalidateWorkoutPillars() {
  pillarCache = null;
}

export function useDailyWorkout(justCompleted?: WorkoutActivity) {
  const { user } = useUser();
  const {
    ritualPlayDate,
    ritualTacticsDate,
    ritualDailyDate,
    recordRitualPlay,
  } = useLessonProgress();
  const { attitudeLevel } = useUser();
  const tone = toneForLevel(attitudeLevel ?? 3);

  const [serverPillars, setServerPillars] = useState<Pillars | null>(null);
  useEffect(() => {
    if (!user) { setServerPillars(null); return; }
    let cancelled = false;
    // Invalidate when a completion was just recorded so the server gets re-read.
    if (justCompleted) invalidateWorkoutPillars();
    fetchPillars().then((p) => { if (!cancelled) setServerPillars(p); });
    return () => { cancelled = true; };
  }, [user, justCompleted]);

  const status: DailyWorkoutStatus = useMemo(() => {
    const today = getToday();

    // Prefer server pillars (authoritative). Fall back to local progress for
    // logged-out users or before the fetch resolves. Always OR with the
    // just-completed activity since the server may not have caught up yet.
    const base = serverPillars ?? {
      play: ritualPlayDate === today,
      tactics: ritualTacticsDate === today,
      daily: ritualDailyDate === today,
    };
    const play = base.play || justCompleted === 'play';
    const tactics = base.tactics || justCompleted === 'tactics';
    const daily = base.daily || justCompleted === 'daily';
    const completedCount = [play, tactics, daily].filter(Boolean).length;
    const allDone = completedCount === 3;

    let nextActivity: WorkoutActivity | null = null;
    if (!allDone && justCompleted) {
      const order = NEXT_MAP[justCompleted];
      const statusMap: Record<WorkoutActivity, boolean> = { play, tactics, daily };
      nextActivity = order.find(a => !statusMap[a]) ?? null;
    }

    return { play, tactics, daily, allDone, completedCount, nextActivity };
  }, [serverPillars, ritualPlayDate, ritualTacticsDate, ritualDailyDate, justCompleted]);

  const suggestionLine = useMemo(() => {
    if (status.allDone) {
      return selectByCategory(QUIP_POOL, 'ritual:all_done', undefined, undefined, { tone })?.text ?? null;
    }
    if (status.nextActivity) {
      return selectByCategory(QUIP_POOL, `ritual:${status.nextActivity}_next`, undefined, undefined, { tone })?.text ?? null;
    }
    return null;
  }, [status.allDone, status.nextActivity, tone]);

  return { status, suggestionLine, recordRitualPlay };
}
