import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { fetchCompletionTimestamps, computeStreak, shiftDate } from '@/lib/streak/compute';

/**
 * GET /api/workout/streak?tz=America/Los_Angeles
 *
 * The streak is "finish a unit": a day counts if the user *finished* something
 * on the app that day (in their local TZ) — completed a lesson, finished a Play
 * or Daily-Rook game, completed an opening, finished a Chess Boxing workout, or
 * fought a Chess Boxing bout to its end.
 * Answering a single puzzle mid-lesson does NOT count (an abandoned lesson
 * shouldn't earn the day) — only the completion does. The streak walks back
 * from today until the first empty day.
 *
 * The actual table reads + math live in lib/streak/compute.ts (the ONE streak
 * implementation, shared with the achievements engine — CHE-388: never add a
 * second copy).
 *
 * Returns { current, longest, completedToday, activeDays }.
 * `activeDays` is the sorted list of YYYY-MM-DD days (user TZ) with any activity,
 * so the client can render a practice calendar.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const tz = request.nextUrl.searchParams.get('tz') || 'UTC';
  const today = getTodayInTZ(tz);
  if (!isValidDate(today)) {
    return NextResponse.json({ error: 'invalid tz' }, { status: 400 });
  }

  // Cap lookback to last ~400 days for sanity.
  const since = shiftDate(today, -400) + 'T00:00:00Z';

  const { timestamps, coreError } = await fetchCompletionTimestamps(supabase, user.id, since);
  if (coreError) {
    console.error('workout streak read failed', coreError);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  const { current, longest, completedToday, activeDays } = computeStreak(timestamps, tz, today);

  return NextResponse.json({ current, longest, completedToday, activeDays });
}
