import type { SupabaseClient } from '@supabase/supabase-js';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { PRO_FREE_LIMITS } from '@/lib/subscription';

/**
 * Rookie Pro — free-tier daily limits, server truth (FEATURE_FLAGS.PRO).
 *
 * Counts since the start of the user's LOCAL day (same local-day notion the
 * streak uses), straight from the tables that already record the activity:
 *   lessons  — lesson_progress.completed_at (a replay re-stamps the same row,
 *              so this counts DISTINCT lessons finished today)
 *   reviews  — review_usage.created_at (one row per user + game, written by
 *              /api/coach-review; docs/rookie-pro-sql.sql)
 *   fights   — bout_sessions.created_at
 *   Puzzle Boxing — workout_sessions.created_at
 * Nothing is stored as a counter; nothing to drift. A missing table or column
 * (unmigrated env) reads as 0 — never lock someone out over it.
 */

export interface ProCounts {
  lessonsToday: number;
  reviewsToday: number;
  boutsToday: number;
  workoutsToday: number;
}

export interface ProLimits extends ProCounts {
  lessonLimit: number;
  reviewLimit: number;
  boutLimit: number;
  workoutLimit: number;
  isPro: boolean;
  canLesson: boolean;
  canReview: boolean;
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
): Promise<ProCounts> {
  const since = localDayStartISO(tz);
  const head = { count: 'exact' as const, head: true };
  const [lessons, reviews, bouts, workouts] = await Promise.all([
    supabase.from('lesson_progress').select('id', head).eq('user_id', userId).gte('completed_at', since),
    supabase.from('review_usage').select('user_id', head).eq('user_id', userId).gte('created_at', since),
    supabase.from('bout_sessions').select('id', head).eq('user_id', userId).gte('created_at', since),
    supabase.from('workout_sessions').select('id', head).eq('user_id', userId).gte('created_at', since),
  ]);
  return {
    lessonsToday: lessons.count ?? 0,
    reviewsToday: reviews.count ?? 0,
    boutsToday: bouts.count ?? 0,
    workoutsToday: workouts.count ?? 0,
  };
}

export const ZERO_COUNTS: ProCounts = { lessonsToday: 0, reviewsToday: 0, boutsToday: 0, workoutsToday: 0 };

export function buildLimits(counts: ProCounts, isPro: boolean): ProLimits {
  const L = PRO_FREE_LIMITS;
  return {
    ...counts,
    lessonLimit: L.LESSONS_PER_DAY,
    reviewLimit: L.REVIEWS_PER_DAY,
    boutLimit: L.BOUTS_PER_DAY,
    workoutLimit: L.WORKOUTS_PER_DAY,
    isPro,
    canLesson: isPro || counts.lessonsToday < L.LESSONS_PER_DAY,
    canReview: isPro || counts.reviewsToday < L.REVIEWS_PER_DAY,
    canBout: isPro || counts.boutsToday < L.BOUTS_PER_DAY,
    canWorkout: isPro || counts.workoutsToday < L.WORKOUTS_PER_DAY,
  };
}
