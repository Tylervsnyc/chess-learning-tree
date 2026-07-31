import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { periodStartISO, isPeriod, type LeaderboardPeriod } from '@/lib/leaderboard/period';

/**
 * GET /api/leaderboard?scope=global|crew&period=daily|weekly|monthly&crewId=
 *
 * Ranks users by TOTAL workout points earned within the period window
 * (rewards showing up and doing more sessions). Scores come straight from
 * workout_sessions.points — no scoring logic here (Tyler tunes that upstream).
 *
 * - global: only users who opted in AND set a handle.
 * - crew:   members of the caller's crew (or ?crewId=). Requires membership.
 *
 * Returns { rows: top 50, me: {rank, points, username}, ... }.
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

  // ── Sum points per user within the window ──────────────────────────────────
  const { data: sessions, error } = await svc
    .from('workout_sessions')
    .select('user_id, points, created_at, punches')
    .gte('created_at', startISO);

  if (error) {
    console.error('leaderboard sessions read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  const totals = new Map<string, number>();
  const punchTotals = new Map<string, number>();
  for (const row of sessions ?? []) {
    const uid = row.user_id as string;
    if (memberIds && !memberIds.has(uid)) continue;
    totals.set(uid, (totals.get(uid) ?? 0) + ((row.points as number) ?? 0));
    punchTotals.set(uid, (punchTotals.get(uid) ?? 0) + ((row.punches as number) ?? 0));
  }

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
  for (const [uid, points] of totals) {
    const h = handleById.get(uid);
    if (!h?.username) continue; // no handle → not shown
    if (scope === 'global' && !h.optIn) continue; // global honors opt-out
    eligible.push({ userId: uid, username: h.username, points, punches: punchTotals.get(uid) ?? 0 });
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
    crew: crew ? { id: crew.id, name: crew.name } : null,
    rows: ranked.slice(0, TOP_N),
    me: meRow, // null if the caller has no points/handle in this window
    total: ranked.length,
  });
}
