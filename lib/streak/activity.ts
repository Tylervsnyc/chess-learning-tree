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

/**
 * Chess Boxing activity only — bouts and workouts, nothing else.
 *
 * The general activity map above counts lessons/openings/runs too, so it can't
 * answer "have they boxed?". Bouts are the clean signal (they only exist under
 * /box); workouts are included because they're the ranked mode inside the app.
 * Both reads degrade to empty rather than failing the whole cron, same posture
 * as the bout_sessions read in fetchCompletionRows.
 */
export interface BoxingActivity extends UserActivity {
  /** Earliest bout timestamp, for the "first ever bout" window. */
  firstBoutAt: string | null;
  /** Outcome of that first bout, so the welcome email can react to it. */
  firstBoutResult: 'win' | 'loss' | 'draw' | null;
  bouts: number;
  wins: number;
  losses: number;
  draws: number;
  /** Best single round across workouts and bouts. */
  bestRound: number;
  punches: number;
}

function emptyBoxing(): BoxingActivity {
  return {
    days: [],
    lastDay: null,
    firstBoutAt: null,
    firstBoutResult: null,
    bouts: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    bestRound: 0,
    punches: 0,
  };
}

/** Paged select of arbitrary columns, for the tables we need more than a timestamp from. */
async function fetchRows(
  supabase: SupabaseClient,
  table: string,
  columns: string,
): Promise<Record<string, unknown>[]> {
  const out: Record<string, unknown>[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .not('user_id', 'is', null)
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`${table} read failed: ${error.message}`);
    out.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < PAGE) break;
    from += PAGE;
  }
  return out;
}

export async function fetchBoxingActivityByUser(
  supabase: SupabaseClient,
): Promise<Map<string, BoxingActivity>> {
  const safe = (p: Promise<Record<string, unknown>[]>, label: string) =>
    p.catch((e) => {
      console.warn(`${label} unavailable for boxing activity:`, (e as Error).message);
      return [] as Record<string, unknown>[];
    });

  const [bouts, workouts] = await Promise.all([
    safe(
      fetchRows(supabase, 'bout_sessions', 'user_id, ended_at, result, points, punches'),
      'bout_sessions',
    ),
    safe(
      fetchRows(supabase, 'workout_sessions', 'user_id, created_at, best_round_points, punches'),
      'workout_sessions',
    ),
  ]);

  const out = new Map<string, BoxingActivity>();
  const daySets = new Map<string, Set<string>>();

  const rec = (userId: string): BoxingActivity => {
    let r = out.get(userId);
    if (!r) {
      r = emptyBoxing();
      out.set(userId, r);
    }
    if (!daySets.has(userId)) daySets.set(userId, new Set());
    return r;
  };

  const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

  for (const row of bouts) {
    const userId = row.user_id as string;
    const ts = row.ended_at as string | null;
    if (!userId || !ts) continue;
    const r = rec(userId);
    daySets.get(userId)!.add(ts.slice(0, 10));

    r.bouts += 1;
    const result = row.result as string | null;
    if (result === 'win') r.wins += 1;
    else if (result === 'loss') r.losses += 1;
    else if (result === 'draw') r.draws += 1;

    r.punches += num(row.punches);
    r.bestRound = Math.max(r.bestRound, num(row.points));

    if (!r.firstBoutAt || ts < r.firstBoutAt) {
      r.firstBoutAt = ts;
      r.firstBoutResult =
        result === 'win' || result === 'loss' || result === 'draw' ? result : null;
    }
  }

  for (const row of workouts) {
    const userId = row.user_id as string;
    const ts = row.created_at as string | null;
    if (!userId || !ts) continue;
    const r = rec(userId);
    daySets.get(userId)!.add(ts.slice(0, 10));
    r.punches += num(row.punches);
    r.bestRound = Math.max(r.bestRound, num(row.best_round_points));
  }

  for (const [userId, set] of daySets) {
    const days = [...set].sort();
    const r = out.get(userId)!;
    r.days = days;
    r.lastDay = days[days.length - 1] ?? null;
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
