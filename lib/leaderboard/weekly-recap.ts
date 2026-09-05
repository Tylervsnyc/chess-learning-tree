import { createServiceClient } from '@/lib/supabase/service';
import { fetchWindowScores, scoreFor, compareEntries } from '@/lib/leaderboard/scoring';
import { previousWeekWindow, weekWindowFrom } from '@/lib/leaderboard/period';

/**
 * Weekly Top 10 recap — the numbers behind the Monday "Chess Boxing Top 10"
 * email and the shareable board card (/api/og/leaderboard-week).
 *
 * Same scoring as /api/leaderboard weekly (lib/leaderboard/scoring.ts), over a
 * COMPLETED week (Monday 00:00 ET → next Monday 00:00 ET). Global-board rules
 * apply: only users with a handle who have not opted out are ranked.
 */

export interface RecapEntry {
  rank: number;
  userId: string;
  username: string;
  points: number;
  punches: number;
}

export interface SessionOfWeek {
  userId: string;
  username: string;
  points: number;
  correct: number;
  wrong: number;
  /** 0-100, rounded. */
  accuracyPct: number;
  perfect: boolean;
  createdAt: string;
}

export interface WeeklyRecap {
  /** Monday, YYYY-MM-DD. */
  weekStart: string;
  /** Following Monday, YYYY-MM-DD (exclusive). */
  weekEnd: string;
  /** ISO bounds actually used for the queries. */
  startISO: string;
  endISO: string;
  top: RecapEntry[];
  /** Everyone ranked, not just the top 10 — for "you finished #N" lines. */
  ranked: RecapEntry[];
  sessionOfWeek: SessionOfWeek | null;
  totalCompetitors: number;
}

export const RECAP_TOP_N = 10;

type SessionRow = {
  user_id: string;
  points: number | null;
  correct_count: number | null;
  wrong_count: number | null;
  perfect: boolean | null;
  created_at: string;
};

/**
 * @param weekStartISO Monday as YYYY-MM-DD (or a full ISO string — only the
 *   date part is read). Defaults to the previous completed week.
 */
export async function getWeeklyRecap(weekStartISO?: string): Promise<WeeklyRecap> {
  const win = weekStartISO ? weekWindowFrom(weekStartISO.slice(0, 10)) : previousWeekWindow();
  const svc = createServiceClient();

  const scores = await fetchWindowScores(svc, { startISO: win.startISO, endISO: win.endISO });

  // Handles + opt-in. Global board rules: a handle is required, opt-out hides.
  const uids = [...scores.totals.keys()];
  const handleById = new Map<string, string>();
  if (uids.length) {
    // .in() with a long list is fine at our scale (hundreds, not millions).
    const { data: profs, error } = await svc
      .from('profiles')
      .select('id, username, leaderboard_opt_in')
      .in('id', uids);
    if (error) throw new Error(`recap profiles read failed: ${error.message}`);
    for (const p of profs ?? []) {
      const username = (p.username as string | null) ?? null;
      const optIn = (p.leaderboard_opt_in as boolean | null) ?? true;
      if (username && optIn) handleById.set(p.id as string, username);
    }
  }

  const eligible: Omit<RecapEntry, 'rank'>[] = [];
  for (const uid of uids) {
    const username = handleById.get(uid);
    if (!username) continue;
    eligible.push({
      userId: uid,
      username,
      points: scoreFor(scores, 'total', uid),
      punches: scores.punchTotals.get(uid) ?? 0,
    });
  }
  eligible.sort(compareEntries);
  const ranked: RecapEntry[] = eligible.map((e, i) => ({ rank: i + 1, ...e }));

  // Session of the week: highest single workout_sessions.points in the window,
  // among ranked users; tiebreak on accuracy. Columns beyond points may be
  // missing on an older DB — degrade to "no session of the week".
  let sessionOfWeek: SessionOfWeek | null = null;
  const { data: sessions, error: sErr } = await svc
    .from('workout_sessions')
    .select('user_id, points, correct_count, wrong_count, perfect, created_at')
    .gte('created_at', win.startISO)
    .lt('created_at', win.endISO)
    .order('points', { ascending: false })
    .limit(200);
  if (sErr) {
    console.error('recap session-of-week read failed', sErr);
  } else {
    let best: (SessionRow & { acc: number }) | null = null;
    for (const raw of (sessions ?? []) as SessionRow[]) {
      if (!handleById.has(raw.user_id)) continue;
      const pts = raw.points ?? 0;
      const c = raw.correct_count ?? 0;
      const w = raw.wrong_count ?? 0;
      const acc = c + w > 0 ? c / (c + w) : 0;
      if (!best || pts > (best.points ?? 0) || (pts === (best.points ?? 0) && acc > best.acc)) {
        best = { ...raw, acc };
      }
    }
    if (best) {
      const c = best.correct_count ?? 0;
      const w = best.wrong_count ?? 0;
      sessionOfWeek = {
        userId: best.user_id,
        username: handleById.get(best.user_id)!,
        points: best.points ?? 0,
        correct: c,
        wrong: w,
        accuracyPct: Math.round(best.acc * 100),
        perfect: best.perfect === true || (c > 0 && w === 0),
        createdAt: best.created_at,
      };
    }
  }

  return {
    weekStart: win.weekStart,
    weekEnd: win.endISO.slice(0, 10),
    startISO: win.startISO,
    endISO: win.endISO,
    top: ranked.slice(0, RECAP_TOP_N),
    ranked,
    sessionOfWeek,
    totalCompetitors: ranked.length,
  };
}
