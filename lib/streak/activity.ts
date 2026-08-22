import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side activity derivation (CHE-368).
 *
 * profiles.current_streak / last_activity_date drifted into ghost data (they
 * were incremented by legacy lesson/puzzle code and Math.max-merged with
 * localStorage). The truth is the activity tables themselves — the same four
 * finished-unit tables /api/workout/streak reads, plus puzzle_attempts for
 * "first touch" / solver checks. These helpers bulk-fetch per-user activity
 * with a service client so crons (drip) can target on real behavior.
 *
 * All days are UTC (crons have no user TZ; close enough for email windows).
 */

const PAGE = 1000;

interface TsRow {
  user_id: string;
  ts: string;
}

async function fetchUserTimestamps(
  supabase: SupabaseClient,
  table: string,
  col: string,
  filter?: (q: ReturnType<SupabaseClient['from']>['select'] extends never ? never : any) => any,
): Promise<TsRow[]> {
  const out: TsRow[] = [];
  let from = 0;
  for (;;) {
    let q = supabase
      .from(table)
      .select(`user_id, ${col}`)
      .not('user_id', 'is', null)
      .range(from, from + PAGE - 1);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table} read failed: ${error.message}`);
    for (const r of (data ?? []) as unknown as Record<string, unknown>[]) {
      const ts = r[col];
      if (ts) out.push({ user_id: r.user_id as string, ts: ts as string });
    }
    if (!data || data.length < PAGE) break;
    from += PAGE;
  }
  return out;
}

/**
 * The finished-unit tables — mirrors /api/workout/streak. Chess Boxing bouts
 * are read best-effort: the table is created by hand on the live DB, so a
 * missing bout_sessions degrades to "no bouts" instead of failing every cron.
 */
async function fetchCompletionRows(supabase: SupabaseClient): Promise<TsRow[]> {
  const [lessons, games, workouts, openings, bouts, runs] = await Promise.all([
    fetchUserTimestamps(supabase, 'lesson_progress', 'completed_at'),
    fetchUserTimestamps(supabase, 'game_sessions', 'ended_at', (q) => q.not('ended_at', 'is', null)),
    fetchUserTimestamps(supabase, 'workout_sessions', 'created_at'),
    fetchUserTimestamps(supabase, 'opening_progress', 'completed_at'),
    fetchUserTimestamps(supabase, 'bout_sessions', 'ended_at').catch((e) => {
      console.warn('bout_sessions unavailable for activity derivation:', (e as Error).message);
      return [] as TsRow[];
    }),
    fetchUserTimestamps(supabase, 'run_completions', 'completed_at'),
  ]);
  return [...lessons, ...games, ...workouts, ...openings, ...bouts, ...runs];
}

export interface UserActivity {
  /** Sorted unique UTC days (YYYY-MM-DD) with a finished unit. */
  days: string[];
  /** Latest finished-unit day, or null. */
  lastDay: string | null;
}

/** Per-user finished-unit activity days for ALL users, in two queries per table. */
export async function fetchActivityByUser(
  supabase: SupabaseClient,
): Promise<Map<string, UserActivity>> {
  const rows = await fetchCompletionRows(supabase);
  const daySets = new Map<string, Set<string>>();
  for (const { user_id, ts } of rows) {
    const day = ts.slice(0, 10);
    if (!daySets.has(user_id)) daySets.set(user_id, new Set());
    daySets.get(user_id)!.add(day);
  }
  const out = new Map<string, UserActivity>();
  for (const [userId, set] of daySets) {
    const days = [...set].sort();
    out.set(userId, { days, lastDay: days[days.length - 1] ?? null });
  }
  return out;
}

/**
 * Earliest activity timestamp per user — ANY engagement counts here (the four
 * completion tables plus raw puzzle_attempts), because the D1 trigger fires
 * off the user's first touch, not their first finished unit.
 */
export async function fetchFirstActivityByUser(
  supabase: SupabaseClient,
): Promise<Map<string, string>> {
  const [completions, attempts] = await Promise.all([
    fetchCompletionRows(supabase),
    fetchUserTimestamps(supabase, 'puzzle_attempts', 'attempted_at'),
  ]);
  const out = new Map<string, string>();
  for (const { user_id, ts } of [...completions, ...attempts]) {
    const prev = out.get(user_id);
    if (!prev || ts < prev) out.set(user_id, ts);
  }
  return out;
}

/** Users who have solved at least one puzzle (the aha-moment marker). */
export async function fetchSolverSet(supabase: SupabaseClient): Promise<Set<string>> {
  const rows = await fetchUserTimestamps(supabase, 'puzzle_attempts', 'attempted_at', (q) =>
    q.eq('correct', true),
  );
  return new Set(rows.map((r) => r.user_id));
}

function shiftDay(yyyyMmDd: string, deltaDays: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

/** Current streak (walk back from today; yesterday keeps it alive). */
export function currentStreakFromDays(days: string[], todayUtc: string): number {
  const set = new Set(days);
  let current = 0;
  let cursor = set.has(todayUtc) ? todayUtc : shiftDay(todayUtc, -1);
  while (set.has(cursor)) {
    current++;
    cursor = shiftDay(cursor, -1);
  }
  return current;
}
