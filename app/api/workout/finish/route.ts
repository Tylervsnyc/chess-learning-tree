import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Cap stored missed puzzles to bound the row size.
const MAX_MISSED = 30;

/**
 * POST /api/workout/finish
 *
 * Body: {
 *   points: number,
 *   durationMinutes?: number,
 *   correct?: number,
 *   wrong?: number,
 *   perfect?: boolean,
 *   missedPuzzles?: any[]
 * }
 *
 * Adds `points` to the user's lifetime workout_points total on their profile
 * (floored at 0 so it can never go negative) AND records a row in
 * workout_sessions with the per-session results + missed puzzles for replay.
 *
 * Returns { workoutPoints, sessionId } — the new lifetime total and the
 * inserted session id (or null if the session insert failed).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: {
    points?: unknown;
    durationMinutes?: unknown;
    correct?: unknown;
    wrong?: unknown;
    perfect?: unknown;
    missedPuzzles?: unknown;
    seenPuzzleIds?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const points = body.points;
  if (typeof points !== 'number' || !Number.isFinite(points)) {
    return NextResponse.json({ error: 'points must be a finite number' }, { status: 400 });
  }

  const toInt = (v: unknown): number =>
    typeof v === 'number' && Number.isFinite(v) ? Math.trunc(v) : 0;
  const durationMinutes =
    typeof body.durationMinutes === 'number' && Number.isFinite(body.durationMinutes)
      ? Math.trunc(body.durationMinutes)
      : null;
  const correct = toInt(body.correct);
  const wrong = toInt(body.wrong);
  const perfect = body.perfect === true;
  const missedPuzzles = Array.isArray(body.missedPuzzles)
    ? body.missedPuzzles.slice(0, MAX_MISSED)
    : [];

  // Every puzzle shown this session (solved + missed). Recorded so future
  // workouts can exclude them and stay fresh. Cap to bound a single upsert.
  const seenPuzzleIds = Array.isArray(body.seenPuzzleIds)
    ? Array.from(
        new Set(
          body.seenPuzzleIds.filter((id): id is string => typeof id === 'string' && id.length > 0),
        ),
      ).slice(0, 200)
    : [];

  const { data: profile, error: readError } = await supabase
    .from('profiles')
    .select('workout_points')
    .eq('id', user.id)
    .single();

  if (readError) {
    console.error('workout finish read failed', readError);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  const current = typeof profile?.workout_points === 'number' ? profile.workout_points : 0;
  const next = Math.max(0, current + points);

  // Personal-best + recent history for the results popup. Read BEFORE inserting
  // this session so "previous best" reflects only prior sessions.
  const sessionStored = Math.max(0, Math.trunc(points));
  const { data: prior } = await supabase
    .from('workout_sessions')
    .select('points')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(9);
  const priorPoints = (prior ?? []).map((r) => (r.points as number) ?? 0); // newest first
  const previousBest = priorPoints.length ? Math.max(...priorPoints) : 0;
  const isPersonalBest = sessionStored > previousBest && sessionStored > 0;
  // Chronological points for the chart, with this session last.
  const recentPoints = [...priorPoints].reverse().concat(sessionStored);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ workout_points: next })
    .eq('id', user.id);

  if (updateError) {
    console.error('workout finish update failed', updateError);
    return NextResponse.json({ error: 'update failed' }, { status: 500 });
  }

  // Record the session. If this fails we still return the lifetime total — a
  // missing session log shouldn't 500 the whole workout completion.
  let sessionId: string | null = null;
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      duration_minutes: durationMinutes,
      points: Math.max(0, Math.trunc(points)),
      correct_count: correct,
      wrong_count: wrong,
      perfect,
      missed_puzzles: missedPuzzles,
    })
    .select('id')
    .single();

  if (sessionError) {
    console.error('workout session insert failed', sessionError);
  } else {
    sessionId = session?.id ?? null;
  }

  // Record the puzzles this user has now seen so future workouts skip them.
  // Conflict-do-nothing keeps the first seen_at and makes this idempotent.
  // Non-fatal: a failure here just means a puzzle might repeat someday.
  if (seenPuzzleIds.length > 0) {
    const { error: seenError } = await supabase
      .from('workout_seen_puzzles')
      .upsert(
        seenPuzzleIds.map((puzzle_id) => ({ user_id: user.id, puzzle_id })),
        { onConflict: 'user_id,puzzle_id', ignoreDuplicates: true },
      );
    if (seenError) console.error('workout seen-puzzle upsert failed', seenError);
  }

  return NextResponse.json({
    workoutPoints: next,
    sessionId,
    isPersonalBest,
    previousBest,
    recentPoints,
  });
}
