import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isProSubscription, type SubscriptionStatus } from '@/lib/subscription';
import { localDayStartISO } from '@/lib/pro/limits';

/**
 * GET /api/pro/history?tz=… — Chess Boxing Pro history feeds for /box/profile.
 *
 * { isPro, bouts: [...last 30 bouts], punchLog: [...last 30 workouts+bouts with punches] }
 *
 * Reads with the USER's client (RLS "own rows"). Free users get the SAME
 * shape but truncated server-side — last 1 bout, today's punch entries only —
 * so a blurred "locked" list on the client can never be un-blurred into real
 * data. `lockedBouts` / `lockedPunches` tell the client how many rows were
 * held back so it can draw the placeholders.
 */

const LIMIT = 30;

export interface ProHistoryBout {
  id: string;
  createdAt: string;
  outcome: string;
  result: 'win' | 'loss' | 'draw';
  points: number;
  punches: number;
  moves: number;
  level: number;
  userCards: number[];
  rookieCards: number[];
}

export interface ProPunchEntry {
  id: string;
  createdAt: string;
  kind: 'workout' | 'bout';
  punches: number;
  points: number;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at')
    .eq('id', user.id)
    .single();
  const isPro = isProSubscription(
    (profile?.subscription_status as SubscriptionStatus | null) ?? 'free',
    profile?.subscription_expires_at ?? null,
  );

  const [boutRes, workoutRes] = await Promise.all([
    supabase
      .from('bout_sessions')
      .select('id, created_at, outcome, result, points, punches, moves, level, user_cards, rookie_cards')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(LIMIT),
    supabase
      .from('workout_sessions')
      .select('id, created_at, punches, points')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(LIMIT),
  ]);

  const bouts: ProHistoryBout[] = (boutRes.data ?? []).map((r) => ({
    id: r.id as string,
    createdAt: r.created_at as string,
    outcome: r.outcome as string,
    result: r.result as ProHistoryBout['result'],
    points: (r.points as number) ?? 0,
    punches: (r.punches as number) ?? 0,
    moves: (r.moves as number) ?? 0,
    level: (r.level as number) ?? 1,
    userCards: (r.user_cards as number[]) ?? [],
    rookieCards: (r.rookie_cards as number[]) ?? [],
  }));

  const punchLog: ProPunchEntry[] = [
    ...(workoutRes.data ?? []).map((r) => ({
      id: r.id as string,
      createdAt: r.created_at as string,
      kind: 'workout' as const,
      punches: (r.punches as number) ?? 0,
      points: (r.points as number) ?? 0,
    })),
    ...bouts.map((b) => ({
      id: b.id,
      createdAt: b.createdAt,
      kind: 'bout' as const,
      punches: b.punches,
      points: b.points,
    })),
  ]
    .filter((e) => e.punches > 0)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, LIMIT);

  if (isPro) {
    return NextResponse.json({ isPro: true, bouts, punchLog, lockedBouts: 0, lockedPunches: 0 });
  }

  const since = localDayStartISO(request.nextUrl.searchParams.get('tz'));
  const freeBouts = bouts.slice(0, 1);
  const freePunches = punchLog.filter((e) => e.createdAt >= since);
  return NextResponse.json({
    isPro: false,
    bouts: freeBouts,
    punchLog: freePunches,
    lockedBouts: bouts.length - freeBouts.length,
    lockedPunches: punchLog.length - freePunches.length,
  });
}
