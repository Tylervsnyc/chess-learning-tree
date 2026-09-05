import type { SupabaseClient } from '@supabase/supabase-js';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * Leaderboard scoring — the ONE place a window of workout_sessions +
 * bout_sessions turns into per-user scores.
 *
 * Used by /api/leaderboard (live boards) and lib/leaderboard/weekly-recap.ts
 * (the Monday Top 10 email). Same window, same numbers — the email can never
 * disagree with the board.
 *
 * Rules (see the route header for the long version):
 * - Daily metric = best single effort (best workout round or best bout).
 * - Weekly/monthly with LEADERBOARD_DAILY_SLOT = SUM of each UTC day's best
 *   single effort. Flag off = raw point totals.
 * - A bout counts as one session in every window.
 */

export type ScoreMetric = 'best_round' | 'total';

export interface WindowScores {
  /** Window score per user (already daily-slotted when the flag is on). */
  totals: Map<string, number>;
  punchTotals: Map<string, number>;
  /** Best workout round per user, when best_round_points exists on the row. */
  bestRounds: Map<string, number>;
  /** Best single workout session points per user (legacy fallback). */
  bestSessions: Map<string, number>;
  /** Best single bout per user. */
  bestBouts: Map<string, number>;
}

export interface WindowOptions {
  /** created_at >= startISO */
  startISO: string;
  /** created_at < endISO (omit for "until now"). */
  endISO?: string;
  /** Restrict to these users (crew scope). Omit for everyone. */
  memberIds?: Set<string> | null;
}

type SessionRow = {
  user_id: string;
  points: number | null;
  created_at?: string | null;
  punches?: number | null;
  best_round_points?: number | null;
};

type BoutRow = {
  user_id: string;
  points: number | null;
  punches: number | null;
  created_at?: string | null;
};

/**
 * Read + score every workout and bout in the window.
 * Throws on a workout_sessions read failure; a missing bout_sessions table is
 * tolerated (it is created by hand on the live DB).
 */
export async function fetchWindowScores(
  svc: SupabaseClient,
  { startISO, endISO, memberIds }: WindowOptions,
): Promise<WindowScores> {
  // The best_round_points column may not be migrated yet — retry without it.
  const readSessions = (cols: string) => {
    let q = svc.from('workout_sessions').select(cols).gte('created_at', startISO);
    if (endISO) q = q.lt('created_at', endISO);
    return q;
  };
  let sessions: SessionRow[] = [];
  const first = await readSessions('user_id, points, created_at, punches, best_round_points');
  let error = first.error;
  sessions = ((first.data ?? []) as unknown) as SessionRow[];
  if (error && /best_round_points/.test(error.message ?? '')) {
    const retry = await readSessions('user_id, points, created_at, punches');
    error = retry.error;
    sessions = ((retry.data ?? []) as unknown) as SessionRow[];
  }
  if (error) throw new Error(`leaderboard sessions read failed: ${error.message}`);

  let bouts: BoutRow[] = [];
  let bq = svc
    .from('bout_sessions')
    .select('user_id, points, punches, created_at')
    .gte('created_at', startISO);
  if (endISO) bq = bq.lt('created_at', endISO);
  const boutRead = await bq;
  if (boutRead.error) {
    if (!/bout_sessions/.test(boutRead.error.message ?? '')) {
      console.error('leaderboard bout read failed', boutRead.error);
    }
  } else {
    bouts = (boutRead.data ?? []) as BoutRow[];
  }

  const totals = new Map<string, number>();
  const punchTotals = new Map<string, number>();
  const bestRounds = new Map<string, number>();
  const bestSessions = new Map<string, number>();
  const bestBouts = new Map<string, number>();
  const daySlots = new Map<string, Map<string, number>>();
  const bumpSlot = (uid: string, createdAt: string | null | undefined, val: number) => {
    const day = (createdAt ?? '').slice(0, 10) || 'unknown';
    let days = daySlots.get(uid);
    if (!days) daySlots.set(uid, (days = new Map()));
    days.set(day, Math.max(days.get(day) ?? 0, val));
  };

  for (const row of sessions) {
    const uid = row.user_id;
    if (memberIds && !memberIds.has(uid)) continue;
    const pts = row.points ?? 0;
    totals.set(uid, (totals.get(uid) ?? 0) + pts);
    punchTotals.set(uid, (punchTotals.get(uid) ?? 0) + (row.punches ?? 0));
    const br = row.best_round_points;
    if (typeof br === 'number') bestRounds.set(uid, Math.max(bestRounds.get(uid) ?? 0, br));
    bestSessions.set(uid, Math.max(bestSessions.get(uid) ?? 0, pts));
    // Slot value: best round if the row has one, else the legacy session total.
    bumpSlot(uid, row.created_at, typeof br === 'number' ? br : pts);
  }

  for (const row of bouts) {
    const uid = row.user_id;
    if (memberIds && !memberIds.has(uid)) continue;
    const pts = row.points ?? 0;
    totals.set(uid, (totals.get(uid) ?? 0) + pts);
    punchTotals.set(uid, (punchTotals.get(uid) ?? 0) + (row.punches ?? 0));
    bestBouts.set(uid, Math.max(bestBouts.get(uid) ?? 0, pts));
    bumpSlot(uid, row.created_at, pts);
  }

  // Daily-slot mode: one scoring slot per day, consistency beats grinding.
  if (FEATURE_FLAGS.LEADERBOARD_DAILY_SLOT) {
    for (const [uid, days] of daySlots) {
      let sum = 0;
      for (const v of days.values()) sum += v;
      totals.set(uid, sum);
    }
  }

  return { totals, punchTotals, bestRounds, bestSessions, bestBouts };
}

/** A user's score under the given metric. */
export function scoreFor(scores: WindowScores, metric: ScoreMetric, uid: string): number {
  if (metric === 'total') return scores.totals.get(uid) ?? 0;
  const br = scores.bestRounds.get(uid);
  const workoutBest = br !== undefined ? br : scores.bestSessions.get(uid) ?? 0;
  // Daily crown goes to the single best effort of either discipline.
  return Math.max(workoutBest, scores.bestBouts.get(uid) ?? 0);
}

/** Stable ordering shared by the board and the recap: points desc, then handle. */
export function compareEntries(
  a: { points: number; username: string },
  b: { points: number; username: string },
): number {
  return b.points - a.points || a.username.localeCompare(b.username);
}
