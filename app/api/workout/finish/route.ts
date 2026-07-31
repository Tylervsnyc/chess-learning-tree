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
    clientSessionId?: unknown;
    punches?: unknown;
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
  // Camera-counted punches thrown during the exercise segments (0 if the user
  // didn't enable the punch cam). Stored best-effort below.
  const punches = toInt(body.punches);
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

  // Idempotency key: one stable id per workout, re-sent on every retry of the
  // same session. Lets us detect a replay (network retry / refresh / resume)
  // and award the points exactly once. Absent (legacy client) -> non-idempotent.
  const clientSessionId =
    typeof body.clientSessionId === 'string' && body.clientSessionId.length > 0
      ? body.clientSessionId
      : null;

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

  // Insert the session row FIRST as the idempotency guard. With a stable
  // client_session_id, a replay hits the (user_id, client_session_id) unique
  // constraint and DO-NOTHING returns zero inserted rows — our signal to skip
  // the points increment. A genuine insert error (not a conflict) still lets us
  // award points, matching the prior "a missing session log shouldn't cost the
  // user their points" behavior.
  let sessionId: string | null = null;
  const { data: insertedRows, error: sessionError } = await supabase
    .from('workout_sessions')
    .upsert(
      [{
        user_id: user.id,
        client_session_id: clientSessionId,
        duration_minutes: durationMinutes,
        points: sessionStored,
        correct_count: correct,
        wrong_count: wrong,
        perfect,
        missed_puzzles: missedPuzzles,
      }],
      { onConflict: 'user_id,client_session_id', ignoreDuplicates: true },
    )
    .select('id');

  if (sessionError) console.error('workout session insert failed', sessionError);

  const replayed =
    !sessionError && Array.isArray(insertedRows) && insertedRows.length === 0 && !!clientSessionId;

  if (insertedRows && insertedRows.length > 0) {
    sessionId = insertedRows[0].id ?? null;
  } else if (replayed) {
    // Already recorded — return the existing row's id, don't double-count.
    const { data: existing } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('client_session_id', clientSessionId)
      .maybeSingle();
    sessionId = existing?.id ?? null;
  }

  // Best-effort: store the session's punch count. The `punches` column is added
  // by a migration; tolerate its absence (un-migrated DB) so finishing never
  // breaks — a failed update here is logged, not fatal, and never blocks points.
  if (!replayed && sessionId && punches > 0) {
    const { error: punchErr } = await supabase
      .from('workout_sessions')
      .update({ punches })
      .eq('id', sessionId);
    if (punchErr) console.error('workout punches update failed (column missing?)', punchErr);
  }

  // Award points + record seen puzzles exactly once per logical session.
  let nextTotal = current;
  if (!replayed) {
    nextTotal = Math.max(0, current + points);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ workout_points: nextTotal })
      .eq('id', user.id);
    if (updateError) {
      console.error('workout finish update failed', updateError);
      return NextResponse.json({ error: 'update failed' }, { status: 500 });
    }

    // Record the puzzles this user has now seen so future workouts skip them.
    // Conflict-do-nothing keeps the first seen_at. Non-fatal.
    if (seenPuzzleIds.length > 0) {
      const { error: seenError } = await supabase
        .from('workout_seen_puzzles')
        .upsert(
          seenPuzzleIds.map((puzzle_id) => ({ user_id: user.id, puzzle_id })),
          { onConflict: 'user_id,puzzle_id', ignoreDuplicates: true },
        );
      if (seenError) console.error('workout seen-puzzle upsert failed', seenError);
    }
  }

  return NextResponse.json({
    workoutPoints: nextTotal,
    sessionId,
    isPersonalBest: replayed ? false : isPersonalBest,
    previousBest,
    recentPoints,
    replayed,
  });
}
