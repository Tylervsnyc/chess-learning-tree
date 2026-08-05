import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/bout/record — the caller's fight record (Bout v2).
 *
 * Returns { record: { wins, losses, draws, kos, total, points }, recent: [...] }
 * where `recent` is the last 10 bouts (newest first) for the Profile list.
 *
 * Reads with the USER's client so RLS ("own bouts readable") is the guard —
 * there is no way to ask for someone else's record.
 *
 * If bout_sessions isn't migrated yet this returns an empty record rather than
 * an error, so /profile renders its normal empty state.
 */

const RECENT_LIMIT = 10;

const EMPTY = {
  record: { wins: 0, losses: 0, draws: 0, kos: 0, total: 0, points: 0 },
  recent: [] as unknown[],
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('bout_sessions')
    .select('id, created_at, outcome, result, points, punches, moves, level')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    if (/bout_sessions/.test(error.message ?? '')) {
      return NextResponse.json(EMPTY);
    }
    console.error('bout record read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  const rows = data ?? [];
  const record = {
    wins: rows.filter((r) => r.result === 'win').length,
    losses: rows.filter((r) => r.result === 'loss').length,
    draws: rows.filter((r) => r.result === 'draw').length,
    // Checkmates land differently than a decision — worth its own number.
    kos: rows.filter((r) => r.outcome === 'ko_win').length,
    total: rows.length,
    points: rows.reduce((s, r) => s + ((r.points as number) ?? 0), 0),
  };

  return NextResponse.json({ record, recent: rows.slice(0, RECENT_LIMIT) });
}
