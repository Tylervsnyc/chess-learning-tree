import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidDate } from '@/lib/run/daily';

/**
 * POST /api/run/complete
 * Body: { runId, runDate (YYYY-MM-DD in user TZ), levelsCleared, tz }
 * Records a daily run completion. Idempotent upsert on (user_id, run_date).
 * Anonymous callers get a silent 200 (page is playable; nothing recorded).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ recorded: false, reason: 'anonymous' }, { status: 200 });
  }

  let body: {
    runId?: string;
    runDate?: string;
    levelsCleared?: number;
    tz?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { runId, runDate, levelsCleared, tz } = body;
  if (!runId || !runDate || !tz || typeof levelsCleared !== 'number') {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  if (!isValidDate(runDate)) {
    return NextResponse.json({ error: 'invalid date' }, { status: 400 });
  }

  const { error } = await supabase
    .from('run_completions')
    .upsert(
      {
        user_id: user.id,
        run_date: runDate,
        run_id: runId,
        levels_cleared: levelsCleared,
        tz,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,run_date' },
    );

  if (error) {
    console.error('run_completions upsert failed', error);
    return NextResponse.json({ error: 'write failed', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ recorded: true });
}
