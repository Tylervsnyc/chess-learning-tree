import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/workout/sessions?limit=10
 *
 * Returns the user's recent workout sessions, newest first. The full missed
 * puzzle list is intentionally NOT returned here (fetch a single session for
 * that) — only the count, to keep the list light.
 *
 * Returns {
 *   sessions: [{ id, createdAt, points, correct, wrong, perfect,
 *               durationMinutes, missedCount }]
 * }
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const rawLimit = Number(request.nextUrl.searchParams.get('limit'));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(50, Math.trunc(rawLimit)) : 10;

  const { data, error } = await supabase
    .from('workout_sessions')
    .select(
      'id, created_at, points, correct_count, wrong_count, perfect, duration_minutes, missed_puzzles',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('workout sessions read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  const sessions = (data ?? []).map((r) => ({
    id: r.id as string,
    createdAt: r.created_at as string,
    points: (r.points as number) ?? 0,
    correct: (r.correct_count as number) ?? 0,
    wrong: (r.wrong_count as number) ?? 0,
    perfect: (r.perfect as boolean) ?? false,
    durationMinutes: (r.duration_minutes as number | null) ?? null,
    missedCount: Array.isArray(r.missed_puzzles) ? r.missed_puzzles.length : 0,
  }));

  return NextResponse.json({ sessions });
}
