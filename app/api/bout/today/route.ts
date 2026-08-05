import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { periodStartISO } from '@/lib/leaderboard/period';
import { DAILY_RANKED_BOUT_LIMIT } from '@/lib/bout/bout';

/**
 * GET /api/bout/today — is today's ranked bout still available?
 *
 * The pre-fight screen needs to tell the truth BEFORE the user fights: pick
 * Standard after you've already had your ranked bout and it's an exhibition,
 * and finding that out on the result screen would feel like a bug.
 *
 * Counted exactly the way /api/bout/finish enforces the cap — points-bearing
 * rows inside the leaderboard's own daily window — so the two can never
 * disagree about how many are left.
 *
 * Returns { rankedUsed, rankedLimit, rankedLeft }. Logged-out or unmigrated
 * both read as "a ranked bout is available" — never block a fight over this.
 */
export async function GET() {
  const fallback = {
    rankedUsed: 0,
    rankedLimit: DAILY_RANKED_BOUT_LIMIT,
    rankedLeft: DAILY_RANKED_BOUT_LIMIT,
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(fallback);

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('bout_sessions')
    .select('id')
    .eq('user_id', user.id)
    .gt('points', 0)
    .gte('created_at', periodStartISO('daily'));

  if (error) {
    if (!/bout_sessions/.test(error.message ?? '')) {
      console.error('bout today read failed', error);
    }
    return NextResponse.json(fallback);
  }

  const rankedUsed = (data ?? []).length;
  return NextResponse.json({
    rankedUsed,
    rankedLimit: DAILY_RANKED_BOUT_LIMIT,
    rankedLeft: Math.max(0, DAILY_RANKED_BOUT_LIMIT - rankedUsed),
  });
}
