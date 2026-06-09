import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runEloCompute, computeEloForUser } from '@/lib/elo/profile-elo';

/**
 * GET /api/profile/elo
 *
 * Estimated chess rating + rating-over-time series for the signed-in user.
 *
 *   → { current: number, events: number, series: [{ date, elo }] }
 *
 * The compute (and its 5-min per-user cache) lives in lib/elo/profile-elo.ts,
 * shared with GET /api/profile/dashboard.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // `?fresh=1` bypasses the 5-min cache (completion screen needs the rating to
  // include the lesson the user just finished).
  const fresh = new URL(request.url).searchParams.get('fresh') === '1';
  const estimate = fresh ? await runEloCompute(user.id) : await computeEloForUser(user.id);
  return NextResponse.json(estimate);
}
