import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';

/**
 * GET /api/workout/streak?tz=America/Los_Angeles
 *
 * The streak is dead simple: a day counts if the user did *anything* on the
 * app that day (in their local TZ) — completed a lesson, played a game, or
 * solved a puzzle. The streak walks back from today until the first empty day.
 *
 * Returns { current, longest, completedToday }.
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

  const [lessons, games, puzzles, openings] = await Promise.all([
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
      .from('puzzle_attempts')
      .select('attempted_at')
      .eq('user_id', user.id)
      .gte('attempted_at', since),
    supabase
      .from('opening_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', since),
  ]);

  if (lessons.error || games.error || puzzles.error || openings.error) {
    console.error('workout streak read failed', {
      lessons: lessons.error,
      games: games.error,
      puzzles: puzzles.error,
      openings: openings.error,
    });
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  // Any activity at all makes the day count. Rookie's Run is intentionally NOT
  // part of the streak: it was dropped from the daily loop (2026-06-01) and its
  // run_completions table has never logged a row (CHE-342).
  const activeDays = toLocalDateSet(
    [
      ...(lessons.data ?? []).map((r) => r.completed_at as string),
      ...(games.data ?? []).map((r) => r.ended_at as string),
      ...(puzzles.data ?? []).map((r) => r.attempted_at as string),
      ...(openings.data ?? []).map((r) => r.completed_at as string),
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

  return NextResponse.json({ current, longest, completedToday });
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
