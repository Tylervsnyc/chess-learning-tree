import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';

/**
 * POST /api/workout/celebrate?tz=America/Los_Angeles
 *
 * Atomically claims today's Daily Workout celebration. First call on a given
 * date wins (returns { claimed: true }). Subsequent calls on the same day
 * return { claimed: false } so the popup never fires twice across devices.
 *
 * Body: { streak: number } — the streak number at time of claim, stored for
 * later analytics.
 */
export async function POST(request: NextRequest) {
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

  let streak = 0;
  try {
    const body = await request.json();
    if (typeof body?.streak === 'number' && body.streak >= 0) streak = body.streak;
  } catch {
    /* empty body ok */
  }

  // Try to insert. If it conflicts on (user_id, workout_date), the row already
  // exists — someone (us, on another device, earlier today) already celebrated.
  const { error } = await supabase
    .from('workout_celebrations')
    .insert({ user_id: user.id, workout_date: today, tz, streak });

  if (!error) {
    return NextResponse.json({ claimed: true });
  }

  // 23505 = unique_violation — expected and means "already celebrated today".
  // Anything else is an unexpected failure; report it as not-claimed so the
  // popup still fires (better to celebrate twice than miss it entirely).
  if ((error as { code?: string }).code === '23505') {
    return NextResponse.json({ claimed: false });
  }

  console.error('workout celebrate insert failed', error);
  return NextResponse.json({ claimed: false, error: 'insert failed' }, { status: 500 });
}
