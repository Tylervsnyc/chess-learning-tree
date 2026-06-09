import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEloEstimate } from '@/lib/elo/profile-elo';

/**
 * GET /api/profile/elo
 *
 * Estimated chess rating + rating-over-time series for the signed-in user.
 *
 *   → { current: number, events: number, series: [{ date, elo }] }
 *
 * `current` is always caught up via the stored profile rating + incremental
 * fold (CHE-375); `series` comes from the 5-min cached full replay with
 * today's point patched to match `current`. The `?fresh=1` flag the
 * completion screen sends is still accepted but is now a no-op — `current`
 * is fresh on every read, with no full recompute.
 *
 * The compute lives in lib/elo/profile-elo.ts, shared with
 * GET /api/profile/dashboard.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json(await getEloEstimate(user.id));
}
