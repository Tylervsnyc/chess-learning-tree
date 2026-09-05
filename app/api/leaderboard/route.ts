import { NextRequest, NextResponse } from 'next/server';
import { isPremiumSubscription, type SubscriptionStatus } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { periodStartISO, isPeriod, type LeaderboardPeriod } from '@/lib/leaderboard/period';
import {
  fetchWindowScores,
  scoreFor as scoreForMetric,
  compareEntries,
  type WindowScores,
} from '@/lib/leaderboard/scoring';

/**
 * GET /api/leaderboard?scope=global|crew&period=daily|weekly|monthly&crewId=
 *
 * DAILY ranks by BEST SINGLE ROUND (max workout_sessions.best_round_points)
 * so grinding many sessions can't buy the day — one great round wins it.
 * Legacy sessions without best_round_points fall back to that user's best
 * single-session points.
 *
 * Weekly/monthly (LEADERBOARD_DAILY_SLOT): every user gets ONE ranked slot
 * per UTC day — their best single effort that day (best workout round or
 * best bout) fills it — and the window score is the SUM of those daily
 * slots. Equal opportunity: a 5-session Tuesday contributes exactly one
 * slot, so showing up 7 days beats grinding 3. With the flag off this
 * falls back to raw point totals within the window.
 * Scores come straight from workout_sessions — no scoring logic here (Tyler
 * tunes that upstream) — plus bout_sessions (Bout v2), whose points are
 * computed once at /api/bout/finish. A bout counts as one session: it adds to
 * the weekly/monthly total and competes for the daily best-single crown.
 *
 * - global: only users who opted in AND set a handle.
 * - crew:   members of the caller's crew (or ?crewId=). Requires membership.
 *
 * Returns { rows: top 50, me: {rank, points, username}, metric, ... } where
 * metric is 'best_round' (daily) or 'total' (weekly/monthly). Crew scope also
 * returns `roster`: unranked crew members (no scores this window, or no
 * handle → username:null) so the full crew always renders.
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
  // Shared with the Monday Top 10 email (lib/leaderboard/scoring.ts) so the
  // board and the recap can never disagree. Daily = best single effort;
  // weekly/monthly = sum of daily slots (LEADERBOARD_DAILY_SLOT) or raw totals.
  let scores: WindowScores;
  try {
    scores = await fetchWindowScores(svc, { startISO, memberIds });
  } catch (err) {
    console.error('leaderboard sessions read failed', err);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
  const { totals, punchTotals } = scores;

  const metric: 'best_round' | 'total' = period === 'daily' ? 'best_round' : 'total';
  const scoreFor = (uid: string): number => scoreForMetric(scores, metric, uid);

  // Handles + opt-in for the candidate users.
  const uids = [...totals.keys()];
  const handleById = new Map<string, { username: string | null; optIn: boolean; isPro: boolean }>();
  if (uids.length) {
    const { data: profs } = await svc
      .from('profiles')
      .select('id, username, leaderboard_opt_in, subscription_status, subscription_expires_at, is_patron')
      .in('id', uids);
    for (const p of profs ?? []) {
      handleById.set(p.id as string, {
        username: (p.username as string) ?? null,
        optIn: (p.leaderboard_opt_in as boolean) ?? true,
        // CHESSBOXING_PRO gold name: premium (Stripe or RevenueCat) OR patron.
        isPro:
          p.is_patron === true ||
          isPremiumSubscription(
            (p.subscription_status as SubscriptionStatus | null) ?? 'free',
            (p.subscription_expires_at as string | null) ?? null,
          ),
      });
    }
  }

  // ── Build the ranked list ──────────────────────────────────────────────────
  type Entry = { userId: string; username: string; points: number; punches: number; isPro: boolean };
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
      isPro: h.isPro,
    });
  }
  eligible.sort(compareEntries);

  const ranked = eligible.map((e, i) => ({
    rank: i + 1,
    username: e.username,
    points: e.points,
    punches: e.punches,
    isSelf: e.userId === user.id,
    isPro: e.isPro,
  }));

  const meRow = ranked.find((r) => r.isSelf) ?? null;

  // ── Crew roster tail ───────────────────────────────────────────────────────
  // On crew scope, return EVERY member — a 3-person crew board that renders
  // 1 row reads as a dead app. Members who aren't in the ranked list (no
  // scores this window, or scores but no handle) come back unranked in
  // `roster`, points included (0 + noScores:true when they haven't fought).
  // Members without a handle are INCLUDED with username:null — the UI shows
  // them as "unnamed fighter" so the crew's real size is always visible.
  // Small crews only, so no cap on the tail.
  type RosterRow = {
    username: string | null;
    points: number;
    punches: number;
    isSelf: boolean;
    noScores: boolean;
  };
  let roster: RosterRow[] | undefined;
  if (scope === 'crew' && memberIds) {
    const rankedIds = new Set(eligible.map((e) => e.userId));
    const tailIds = [...memberIds].filter((uid) => !rankedIds.has(uid));
    const missing = tailIds.filter((uid) => !handleById.has(uid));
    if (missing.length) {
      const { data: profs } = await svc
        .from('profiles')
        .select('id, username')
        .in('id', missing);
      for (const p of profs ?? []) {
        handleById.set(p.id as string, {
          username: (p.username as string) ?? null,
          optIn: true,
          isPro: false,
        });
      }
    }
    roster = tailIds.map((uid) => ({
      username: handleById.get(uid)?.username ?? null,
      points: scoreFor(uid),
      punches: punchTotals.get(uid) ?? 0,
      isSelf: uid === user.id,
      noScores: !totals.has(uid),
    }));
    roster.sort(
      (a, b) =>
        b.points - a.points ||
        (a.username ?? '~').localeCompare(b.username ?? '~'),
    );
  }

  return NextResponse.json({
    scope,
    period,
    metric,
    crew: crew ? { id: crew.id, name: crew.name } : null,
    rows: ranked.slice(0, TOP_N),
    me: meRow, // null if the caller has no points/handle in this window
    total: ranked.length,
    // Only present on crew scope. Additive — existing consumers ignore it.
    ...(roster ? { roster } : {}),
  });
}
