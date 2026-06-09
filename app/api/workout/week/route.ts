import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWorkoutWeek, InvalidTimezoneError } from '@/lib/workout/week';

/**
 * GET /api/workout/week?tz=America/Los_Angeles
 *
 * Sums workout_sessions.points per local day for the current week
 * (Monday → Sunday in the user's tz).
 *
 * Returns {
 *   days: [{ date: 'YYYY-MM-DD', label: 'Mon', points: number }, ... 7 entries Mon..Sun],
 *   weekTotal: number
 * }
 *
 * The aggregation lives in lib/workout/week.ts, shared with
 * GET /api/profile/dashboard.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const tz = request.nextUrl.searchParams.get('tz') || 'UTC';

  try {
    const week = await getWorkoutWeek(supabase, user.id, tz);
    return NextResponse.json(week);
  } catch (e) {
    if (e instanceof InvalidTimezoneError) {
      return NextResponse.json({ error: 'invalid tz' }, { status: 400 });
    }
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
}
