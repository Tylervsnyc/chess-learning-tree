import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';

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

  const [lessons, games, workouts, openings, bouts] = await Promise.all([
    supabase
      .from('lesson_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', since),
    supabase
      .from('game_sessions')
      .select('ended_at')
      .eq('user_id', user.id)
      .not('ended_at', 'is', null)
      .gte('ended_at', since),
    supabase
      .from('workout_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', since),
    supabase
      .from('opening_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', since),
    // Chess Boxing bouts (Bout v2). The table is created by hand on the live
    // DB, so a missing table must not take the whole streak down — it degrades
    // to "no bouts" until the migration is run.
    supabase
      .from('bout_sessions')
      .select('ended_at')
      .eq('user_id', user.id)
      .gte('ended_at', since),
  ]);

  const boutRows =
    bouts.error || !bouts.data
      ? []
      : (bouts.data as { ended_at: string }[]);
  if (bouts.error && !/bout_sessions/.test(bouts.error.message ?? '')) {
    console.error('workout streak bout read failed', bouts.error);
  }

  if (lessons.error || games.error || workouts.error || openings.error) {
    console.error('workout streak read failed', {
      lessons: lessons.error,
      games: games.error,
      workouts: workouts.error,
      openings: openings.error,
    });
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  // A FINISHED unit makes the day count: a completed lesson, a finished game
  // (Play or Daily Rook), a completed opening, or a finished Chess Boxing
  // workout. Mid-lesson puzzle attempts are deliberately excluded — an
  // abandoned lesson shouldn't earn the day. Rookie's Run is also NOT part of
  // the streak: it was dropped from the daily loop (2026-06-01) and its
  // run_completions table has never logged a row (CHE-342).
  const activeDays = toLocalDateSet(
    [
      ...(lessons.data ?? []).map((r) => r.completed_at as string),
      ...(games.data ?? []).map((r) => r.ended_at as string),
      ...(workouts.data ?? []).map((r) => r.created_at as string),
      ...(openings.data ?? []).map((r) => r.completed_at as string),
      ...boutRows.map((r) => r.ended_at),
    ],
    tz,
  );

  const completedToday = activeDays.has(today);

  // Current: walk back from today (or yesterday if today not done — streak still alive).
  let current = 0;
  let cursor = today;
  if (!completedToday) cursor = shiftDate(cursor, -1);
  while (activeDays.has(cursor)) {
    current++;
    cursor = shiftDate(cursor, -1);
  }

  // Longest run of consecutive active days.
  const sorted = [...activeDays].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && shiftDate(prev, 1) === d) run++;
    else run = 1;
    if (run > longest) longest = run;
    prev = d;
  }

  return NextResponse.json({ current, longest, completedToday, activeDays: sorted });
}

function toLocalDateSet(timestamps: string[], tz: string): Set<string> {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const out = new Set<string>();
  for (const ts of timestamps) {
    if (!ts) continue;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) continue;
    out.add(fmt.format(d));
  }
  return out;
}

function shiftDate(yyyyMmDd: string, deltaDays: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
