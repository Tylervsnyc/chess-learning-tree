import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/workout/sessions/[id]
 *
 * Returns a single workout session owned by the current user — including the
 * full missed_puzzles array so the user can replay them. Returns 404 if the
 * session doesn't exist or isn't owned by the caller.
 *
 * Returns { missedPuzzles, points, correct, wrong, perfect, createdAt }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('missed_puzzles, points, correct_count, wrong_count, perfect, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('workout session read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json({
    missedPuzzles: Array.isArray(data.missed_puzzles) ? data.missed_puzzles : [],
    points: (data.points as number) ?? 0,
    correct: (data.correct_count as number) ?? 0,
    wrong: (data.wrong_count as number) ?? 0,
    perfect: (data.perfect as boolean) ?? false,
    createdAt: data.created_at as string,
  });
}
