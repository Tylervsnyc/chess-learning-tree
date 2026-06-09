import { useEffect, useMemo, useState } from 'react';
import { useLessonProgress } from '@/hooks/useProgress';
import { selectByCategory } from '@/lib/speech/priority-queue';
import { getQuipPool } from '@/lib/quips/load-quip-pool';
import { toneForLevel } from '@/lib/quips/tone';
import { useUser } from '@/hooks/useUser';
import { getStreak, invalidateStreak } from '@/lib/streak-client';

export type WorkoutActivity = 'play' | 'tactics';

export interface DailyWorkoutStatus {
  play: boolean;
  tactics: boolean;
  allDone: boolean;
  completedCount: number;
  nextActivity: WorkoutActivity | null;
}

const NEXT_MAP: Record<WorkoutActivity, WorkoutActivity[]> = {
  play: ['tactics'],
  tactics: ['play'],
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Server-derived pillar cache ──────────────────────────────────────────
// The authoritative source is /api/workout/streak (it reads game_sessions,
// lesson_progress, puzzle_attempts, and opening_progress — Rookie's Run was
// dropped from the loop 2026-06-01). Reads go through the shared
// streak-client cache so the many consumers per page share one request.
//
// NOTE: the streak route does not currently return `todayPillars`, so this
// resolves to null and callers fall back to local progress — same behavior
// as before the shared cache, minus the wasted network round-trip.

type Pillars = { play: boolean; tactics: boolean };

async function fetchPillars(): Promise<Pillars | null> {
  const data = (await getStreak()) as
    | ({ todayPillars?: { play: boolean; path: boolean } } & Record<string, unknown>)
    | null;
  if (!data?.todayPillars) return null;
  return {
    play: !!data.todayPillars.play,
    tactics: !!data.todayPillars.path,
  };
}

/** Force a re-fetch on next read — call after completing an activity. */
export function invalidateWorkoutPillars() {
  invalidateStreak();
}

export function useDailyWorkout(justCompleted?: WorkoutActivity) {
  const { user } = useUser();
  const {
    ritualPlayDate,
    ritualTacticsDate,
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
    };
    const play = base.play || justCompleted === 'play';
    const tactics = base.tactics || justCompleted === 'tactics';
    const completedCount = [play, tactics].filter(Boolean).length;
    const allDone = completedCount === 2;

    let nextActivity: WorkoutActivity | null = null;
    if (!allDone && justCompleted) {
      const order = NEXT_MAP[justCompleted];
      const statusMap: Record<WorkoutActivity, boolean> = { play, tactics };
      nextActivity = order.find(a => !statusMap[a]) ?? null;
    }

    return { play, tactics, allDone, completedCount, nextActivity };
  }, [serverPillars, ritualPlayDate, ritualTacticsDate, justCompleted]);

  // Pool loads on demand (CHE-373) — the line fills in once the chunk arrives.
  const [suggestionLine, setSuggestionLine] = useState<string | null>(null);
  useEffect(() => {
    const category = status.allDone
      ? 'ritual:all_done'
      : status.nextActivity
        ? `ritual:${status.nextActivity}_next`
        : null;
    if (!category) { setSuggestionLine(null); return; }
    let cancelled = false;
    getQuipPool()
      .then((pool) => {
        if (cancelled) return;
        setSuggestionLine(selectByCategory(pool, category, undefined, undefined, { tone })?.text ?? null);
      })
      .catch(() => { if (!cancelled) setSuggestionLine(null); });
    return () => { cancelled = true; };
  }, [status.allDone, status.nextActivity, tone]);

  return { status, suggestionLine, recordRitualPlay };
}
