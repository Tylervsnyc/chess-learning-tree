import type { SupabaseClient } from '@supabase/supabase-js';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { PRO_FREE_LIMITS } from '@/lib/subscription';

/**
 * Chess Boxing Pro — free-tier daily limits, server truth.
 *
 * Counts finished bouts / workouts since the start of the user's LOCAL day
 * (same local-day notion the streak uses) straight from `bout_sessions` and
 * `workout_sessions`. Nothing is stored; nothing to drift.
 */

export interface ProLimits {
  boutsToday: number;
  workoutsToday: number;
  boutLimit: number;
  workoutLimit: number;
  isPro: boolean;
  canBout: boolean;
  canWorkout: boolean;
}

/** Milliseconds by which wall-clock time in `tz` leads UTC at instant `d`. */
function tzOffsetMs(d: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(d.getTime() / 1000) * 1000;
}

/** ISO instant of 00:00 today in the user's timezone (falls back to UTC). */
export function localDayStartISO(tzRaw: string | null | undefined): string {
  let tz = tzRaw || 'UTC';
  let today = getTodayInTZ(tz);
  if (!isValidDate(today)) {
    tz = 'UTC';
    today = getTodayInTZ(tz);
  }
  const guess = new Date(`${today}T00:00:00Z`);
  return new Date(guess.getTime() - tzOffsetMs(guess, tz)).toISOString();
}

export async function countToday(
  supabase: SupabaseClient,
  userId: string,
  tz: string | null | undefined,
): Promise<{ boutsToday: number; workoutsToday: number }> {
  const since = localDayStartISO(tz);
  const [bouts, workouts] = await Promise.all([
    supabase
      .from('bout_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since),
    supabase
      .from('workout_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since),
  ]);
  // A missing table (unmigrated env) reads as 0 — never lock someone out over it.
  return { boutsToday: bouts.count ?? 0, workoutsToday: workouts.count ?? 0 };
}

export function buildLimits(
  counts: { boutsToday: number; workoutsToday: number },
  isPro: boolean,
): ProLimits {
  return {
    ...counts,
    boutLimit: PRO_FREE_LIMITS.BOUTS_PER_DAY,
    workoutLimit: PRO_FREE_LIMITS.WORKOUTS_PER_DAY,
    isPro,
    canBout: isPro || counts.boutsToday < PRO_FREE_LIMITS.BOUTS_PER_DAY,
    canWorkout: isPro || counts.workoutsToday < PRO_FREE_LIMITS.WORKOUTS_PER_DAY,
  };
}
