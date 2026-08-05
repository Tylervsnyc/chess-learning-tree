import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { periodStartISO, isPeriod, type LeaderboardPeriod } from '@/lib/leaderboard/period';

/**
 * GET /api/leaderboard?scope=global|crew&period=daily|weekly|monthly&crewId=
 *
 * Weekly/monthly rank by TOTAL workout points earned within the window
 * (rewards showing up and doing more sessions). DAILY ranks by BEST SINGLE
 * ROUND (max workout_sessions.best_round_points) so grinding many sessions
 * can't buy the day — one great round wins it. Legacy sessions without
 * best_round_points fall back to that user's best single-session points.
 * Scores come straight from workout_sessions — no scoring logic here (Tyler
 * tunes that upstream) — plus bout_sessions (Bout v2), whose points are
 * computed once at /api/bout/finish. A bout counts as one session: it adds to
 * the weekly/monthly total and competes for the daily best-single crown.
 *
 * - global: only users who opted in AND set a handle.
 * - crew:   members of the caller's crew (or ?crewId=). Requires membership.
 *
 * Returns { rows: top 50, me: {rank, points, username}, metric, ... } where
 * metric is 'best_round' (daily) or 'total' (weekly/monthly).
 */

const TOP_N = 50;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const url = new URL(request.url);
  const scope = url.searchParams.get('scope') === 'crew' ? 'crew' : 'global';
  const periodParam = url.searchParams.get('period');
  const period: LeaderboardPeriod = isPeriod(periodParam) ? periodParam : 'weekly';
  const startISO = periodStartISO(period);

  const svc = createServiceClient();

  // ── Determine the eligible set of users for this scope ─────────────────────
  let crew: { id: string; name: string } | null = null;
  let memberIds: Set<string> | null = null; // null = "everyone" (global)

  if (scope === 'crew') {
    const requestedCrewId = url.searchParams.get('crewId');
    // The caller's crews.
    const { data: myCrews } = await svc
      .from('crew_members')
      .select('crew_id')
      .eq('user_id', user.id);
    const myCrewIds = (myCrews ?? []).map((r) => r.crew_id as string);
    const crewId =
      requestedCrewId && myCrewIds.includes(requestedCrewId)
        ? requestedCrewId
        : myCrewIds[0];

    if (!crewId) {
      return NextResponse.json({
        scope, period, notInCrew: true, rows: [], me: null, crew: null,
      });
    }
    const { data: crewRow } = await svc
      .from('crews')
      .select('id, name')
      .eq('id', crewId)
      .single();
    crew = crewRow ? { id: crewRow.id as string, name: crewRow.name as string } : null;

    const { data: members } = await svc
      .from('crew_members')
      .select('user_id')
      .eq('crew_id', crewId);
    memberIds = new Set((members ?? []).map((r) => r.user_id as string));
  }

  // ── Score per user within the window ───────────────────────────────────────
  // Daily = best single round; weekly/monthly = total points. The
  // best_round_points column may not be migrated yet — retry the read without
  // it and fall back to per-session points.
  type SessionRow = {
    user_id: string;
    points: number | null;
    punches?: number | null;
    best_round_points?: number | null;
  };
  let sessions: SessionRow[] | null = null;
  const first = await svc
    .from('workout_sessions')
    .select('user_id, points, created_at, punches, best_round_points')
    .gte('created_at', startISO);
  let error = first.error;
  sessions = (first.data ?? null) as SessionRow[] | null;
  if (error && /best_round_points/.test(error.message ?? '')) {
    const retry = await svc
      .from('workout_sessions')
      .select('user_id, points, created_at, punches')
      .gte('created_at', startISO);
    error = retry.error;
    sessions = (retry.data ?? null) as SessionRow[] | null;
  }

  if (error) {
    console.error('leaderboard sessions read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  // Chess Boxing bouts pay into the SAME windows (Bout v2) — a bout is a
  // finished unit like a workout. Read best-effort: bout_sessions is created
  // by hand on the live DB, so a missing table just means no bout points yet.
  type BoutRow = { user_id: string; points: number | null; punches: number | null };
  let bouts: BoutRow[] = [];
  const boutRead = await svc
    .from('bout_sessions')
    .select('user_id, points, punches, created_at')
    .gte('created_at', startISO);
  if (boutRead.error) {
    if (!/bout_sessions/.test(boutRead.error.message ?? '')) {
      console.error('leaderboard bout read failed', boutRead.error);
    }
  } else {
    bouts = (boutRead.data ?? []) as BoutRow[];
  }

  const metric: 'best_round' | 'total' = period === 'daily' ? 'best_round' : 'total';

  const totals = new Map<string, number>();
  const punchTotals = new Map<string, number>();
  // Daily fallback for users with only legacy rows (no best_round_points):
  // their best single-session points still puts them on the board.
  const bestRounds = new Map<string, number>();
  const bestSessions = new Map<string, number>();
  // Best single BOUT in the window — competes with the best workout round for
  // the daily crown (see scoreFor).
  const bestBouts = new Map<string, number>();
  for (const row of sessions ?? []) {
    const uid = row.user_id as string;
    if (memberIds && !memberIds.has(uid)) continue;
    const pts = (row.points as number) ?? 0;
    totals.set(uid, (totals.get(uid) ?? 0) + pts);
    punchTotals.set(uid, (punchTotals.get(uid) ?? 0) + ((row.punches as number) ?? 0));
    const br = (row as { best_round_points?: number | null }).best_round_points;
    if (typeof br === 'number') {
      bestRounds.set(uid, Math.max(bestRounds.get(uid) ?? 0, br));
    }
    bestSessions.set(uid, Math.max(bestSessions.get(uid) ?? 0, pts));
  }

  // Bouts add to the weekly/monthly total, and each bout stands as a single
  // "session" for the daily best-single metric — one great bout can win the
  // day the same way one great workout round can.
  for (const row of bouts) {
    const uid = row.user_id;
    if (memberIds && !memberIds.has(uid)) continue;
    const pts = row.points ?? 0;
    totals.set(uid, (totals.get(uid) ?? 0) + pts);
    punchTotals.set(uid, (punchTotals.get(uid) ?? 0) + (row.punches ?? 0));
    bestBouts.set(uid, Math.max(bestBouts.get(uid) ?? 0, pts));
  }

  const scoreFor = (uid: string): number => {
    if (metric === 'total') return totals.get(uid) ?? 0;
    const br = bestRounds.get(uid);
    const workoutBest = br !== undefined ? br : bestSessions.get(uid) ?? 0;
    // Daily crown goes to the single best effort of either discipline.
    return Math.max(workoutBest, bestBouts.get(uid) ?? 0);
  };

  // Handles + opt-in for the candidate users.
  const uids = [...totals.keys()];
  const handleById = new Map<string, { username: string | null; optIn: boolean }>();
  if (uids.length) {
    const { data: profs } = await svc
      .from('profiles')
      .select('id, username, leaderboard_opt_in')
      .in('id', uids);
    for (const p of profs ?? []) {
      handleById.set(p.id as string, {
        username: (p.username as string) ?? null,
        optIn: (p.leaderboard_opt_in as boolean) ?? true,
      });
    }
  }

  // ── Build the ranked list ──────────────────────────────────────────────────
  type Entry = { userId: string; username: string; points: number; punches: number };
  const eligible: Entry[] = [];
  for (const uid of totals.keys()) {
    const h = handleById.get(uid);
    if (!h?.username) continue; // no handle → not shown
    if (scope === 'global' && !h.optIn) continue; // global honors opt-out
    eligible.push({
      userId: uid,
      username: h.username,
      points: scoreFor(uid),
      punches: punchTotals.get(uid) ?? 0,
    });
  }
  eligible.sort((a, b) => b.points - a.points || a.username.localeCompare(b.username));

  const ranked = eligible.map((e, i) => ({
    rank: i + 1,
    username: e.username,
    points: e.points,
    punches: e.punches,
    isSelf: e.userId === user.id,
  }));

  const meRow = ranked.find((r) => r.isSelf) ?? null;

  return NextResponse.json({
    scope,
    period,
    metric,
    crew: crew ? { id: crew.id, name: crew.name } : null,
    rows: ranked.slice(0, TOP_N),
    me: meRow, // null if the caller has no points/handle in this window
    total: ranked.length,
  });
}
