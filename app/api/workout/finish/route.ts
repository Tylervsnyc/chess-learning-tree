import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/workout/finish
 *
 * Body: { points: number }
 *
 * Adds `points` to the user's lifetime workout_points total on their profile.
 * The total is floored at 0 so it can never go negative.
 *
 * Returns { workoutPoints } — the new lifetime total.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: { points?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const points = body.points;
  if (typeof points !== 'number' || !Number.isFinite(points)) {
    return NextResponse.json({ error: 'points must be a finite number' }, { status: 400 });
  }

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

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ workout_points: next })
    .eq('id', user.id);

  if (updateError) {
    console.error('workout finish update failed', updateError);
    return NextResponse.json({ error: 'update failed' }, { status: 500 });
  }

  return NextResponse.json({ workoutPoints: next });
}
