import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * The ONE do-anything-streak computation (RULES §11, CHE-388).
 *
 * Extracted from /api/workout/streak so the streak endpoint and server-side
 * consumers (achievements engine) share a single implementation — never
 * re-derive the streak elsewhere. A day counts when the user FINISHED a unit:
 * lesson, Play/Daily-Rook game, opening lesson, Chess Boxing workout, or bout.
 * Nothing is stored; profiles.current_streak is write-dead ghost data.
 */

export interface StreakComputation {
  current: number;
  longest: number;
  completedToday: boolean;
  /** Sorted YYYY-MM-DD days (user TZ) with any finished unit. */
  activeDays: string[];
}

export interface CompletionFetch {
  timestamps: string[];
  /** Error from one of the four core tables (bout_sessions degrades silently). */
  coreError: unknown | null;
}

/**
 * Read every completion timestamp across the 5 completion tables. Works with
 * either the user-context client (RLS-scoped) or the service client + userId.
 * bout_sessions is created by hand on the live DB, so a missing table degrades
 * to "no bouts" instead of failing the read.
 */
export async function fetchCompletionTimestamps(
  supabase: SupabaseClient,
  userId: string,
  sinceISO: string,
): Promise<CompletionFetch> {
  const [lessons, games, workouts, openings, bouts] = await Promise.all([
    supabase.from('lesson_progress').select('completed_at').eq('user_id', userId).gte('completed_at', sinceISO),
    supabase
      .from('game_sessions')
      .select('ended_at')
      .eq('user_id', userId)
      .not('ended_at', 'is', null)
      .gte('ended_at', sinceISO),
    supabase.from('workout_sessions').select('created_at').eq('user_id', userId).gte('created_at', sinceISO),
    supabase.from('opening_progress').select('completed_at').eq('user_id', userId).gte('completed_at', sinceISO),
    supabase.from('bout_sessions').select('ended_at').eq('user_id', userId).gte('ended_at', sinceISO),
  ]);

  const boutRows = bouts.error || !bouts.data ? [] : (bouts.data as { ended_at: string }[]);
  if (bouts.error && !/bout_sessions/.test((bouts.error.message as string) ?? '')) {
    console.error('streak bout read failed', bouts.error);
  }

  const coreError = lessons.error || games.error || workouts.error || openings.error || null;

  return {
    timestamps: [
      ...((lessons.data ?? []) as { completed_at: string }[]).map((r) => r.completed_at),
      ...((games.data ?? []) as { ended_at: string }[]).map((r) => r.ended_at),
      ...((workouts.data ?? []) as { created_at: string }[]).map((r) => r.created_at),
      ...((openings.data ?? []) as { completed_at: string }[]).map((r) => r.completed_at),
      ...boutRows.map((r) => r.ended_at),
    ],
    coreError,
  };
}

/** Current + longest streak from raw completion timestamps, in the user's TZ. */
export function computeStreak(timestamps: string[], tz: string, today: string): StreakComputation {
  const activeDays = toLocalDateSet(timestamps, tz);
  const completedToday = activeDays.has(today);

  // Current: walk back from today (or yesterday if today not done — streak still alive).
  let current = 0;
  let cursor = today;
  if (!completedToday) cursor = shiftDate(cursor, -1);
  while (activeDays.has(cursor)) {
    current++;
    cursor = shiftDate(cursor, -1);
  }

  // Longest run of consecutive active days.
  const sorted = [...activeDays].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && shiftDate(prev, 1) === d) run++;
    else run = 1;
    if (run > longest) longest = run;
    prev = d;
  }

  return { current, longest, completedToday, activeDays: sorted };
}

export function toLocalDateSet(timestamps: string[], tz: string): Set<string> {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const out = new Set<string>();
  for (const ts of timestamps) {
    if (!ts) continue;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) continue;
    out.add(fmt.format(d));
  }
  return out;
}

export function shiftDate(yyyyMmDd: string, deltaDays: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
