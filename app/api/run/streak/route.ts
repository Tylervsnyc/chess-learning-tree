import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';

/**
 * GET /api/run/streak?tz=America/Los_Angeles
 * Returns { current, longest, completedToday } for the signed-in user.
 * Streak is derived: walk back from today (in user TZ) until first gap.
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

  const { data, error } = await supabase
    .from('run_completions')
    .select('run_date')
    .eq('user_id', user.id)
    .order('run_date', { ascending: false });

  if (error) {
    console.error('run_completions read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  const dates = new Set<string>((data ?? []).map((r) => r.run_date as string));
  const completedToday = dates.has(today);

  // Current: walk back from today (or yesterday if today not done — streak still alive)
  let current = 0;
  let cursor = today;
  // If today isn't completed, the streak hasn't ended yet — count from yesterday.
  if (!completedToday) cursor = shiftDate(cursor, -1);
  while (dates.has(cursor)) {
    current++;
    cursor = shiftDate(cursor, -1);
  }

  // Longest: scan all dates for the longest consecutive run.
  const sorted = [...dates].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && shiftDate(prev, 1) === d) {
      run++;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = d;
  }

  return NextResponse.json({ current, longest, completedToday });
}

function shiftDate(yyyyMmDd: string, deltaDays: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
