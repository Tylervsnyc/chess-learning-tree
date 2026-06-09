import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLifetimeStats } from '@/lib/profile/stats';
import { getWorkoutWeek } from '@/lib/workout/week';
import { getRecentWorkoutSessions } from '@/lib/workout/sessions';
import { getEloEstimate } from '@/lib/elo/profile-elo';

/**
 * GET /api/profile/dashboard?tz=America/Los_Angeles
 *
 * Everything the /profile page needs in ONE round-trip (CHE-379) — replaces
 * 4 separate authenticated calls (stats, week, sessions, elo). Authenticates
 * once, then runs the underlying queries in parallel via the same lib
 * functions the individual routes use, so the two paths can't drift.
 *
 * Returns {
 *   stats:    LifetimeStats | null,          // lib/profile/stats.ts
 *   week:     WeekData | null,               // lib/workout/week.ts
 *   sessions: WorkoutSessionSummary[] | null,// lib/workout/sessions.ts (limit 10)
 *   elo:      { current, events, series } | null, // lib/elo/profile-elo.ts (stored current + 5-min cached series)
 * }
 *
 * Each section degrades to null independently (matching the page's previous
 * per-fetch failure handling) — one bad read doesn't blank the whole profile.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const tz = request.nextUrl.searchParams.get('tz') || 'UTC';

  const [stats, week, sessions, elo] = await Promise.all([
    getLifetimeStats(supabase, user.id).catch(() => null),
    getWorkoutWeek(supabase, user.id, tz).catch(() => null),
    getRecentWorkoutSessions(supabase, user.id, 10).catch(() => null),
    getEloEstimate(user.id).catch((e) => {
      console.error('dashboard elo compute failed', e);
      return null;
    }),
  ]);

  return NextResponse.json({ stats, week, sessions, elo });
}
