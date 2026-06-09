import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRecentWorkoutSessions } from '@/lib/workout/sessions';

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
 *
 * The query lives in lib/workout/sessions.ts, shared with
 * GET /api/profile/dashboard.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const rawLimit = Number(request.nextUrl.searchParams.get('limit'));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(50, Math.trunc(rawLimit)) : 10;

  try {
    const sessions = await getRecentWorkoutSessions(supabase, user.id, limit);
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
}
