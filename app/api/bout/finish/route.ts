import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import {
  boutPoints,
  boutResult,
  BOXING_ROUND_COUNT,
  USER_BANK_SECONDS,
  type BoutOutcome,
} from '@/lib/bout/bout';

/**
 * POST /api/bout/finish — record a finished Chess Boxing bout (Bout v2).
 *
 * Body: {
 *   outcome: BoutOutcome,
 *   roundsSurvived: number,   // boxing rounds reached the bell in
 *   moves: number,
 *   level: number,
 *   clockLeftSeconds: number,
 *   finalFen?: string,
 *   clientSessionId: string,  // idempotency key, generated per bout
 * }
 *
 * The stored row makes a bout a real finished unit: it feeds the streak
 * (/api/workout/streak reads bout_sessions), the leaderboard windows
 * (/api/leaderboard), and the fight record on /profile.
 *
 * TRUST: points are NOT accepted from the client — they are recomputed here
 * from the reported result via boutPoints(), and the only input that feeds it
 * is roundsSurvived, clamped to the number of boxing rounds that exist. There
 * is NO physical tracking in a bout (no camera, no tap pad), so there is
 * nothing a client could inflate beyond that. The write uses
 * the service role because bout_sessions has no public insert policy (a user
 * must not be able to hand-write a row onto a public board).
 *
 * Returns { ok, boutId, points, result } — or { ok: false, needsMigration: true }
 * if the table isn't migrated yet, so the client can finish the bout cleanly
 * instead of erroring in the user's face.
 */

// A 3-round bout at 3:00 a round with a 9:00 bank can't run past this.
const MAX_MOVES = 400;

const OUTCOMES: readonly BoutOutcome[] = [
  'ko_win',
  'ko_loss',
  'flag_loss',
  'draw',
  'decision_win',
  'decision_loss',
];

function isOutcome(v: unknown): v is BoutOutcome {
  return typeof v === 'string' && (OUTCOMES as readonly string[]).includes(v);
}

/** Clamp a client number into [0, max]; anything non-finite becomes 0. */
function clampInt(v: unknown, max: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(max, Math.trunc(v)));
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  if (!isOutcome(body.outcome)) {
    return NextResponse.json({ error: 'invalid outcome' }, { status: 400 });
  }
  const outcome = body.outcome;

  const roundsSurvived = clampInt(body.roundsSurvived, BOXING_ROUND_COUNT);
  const moves = clampInt(body.moves, MAX_MOVES);
  const level = Math.max(1, Math.min(10, clampInt(body.level, 10) || 1));
  const clockLeftSeconds = clampInt(body.clockLeftSeconds, USER_BANK_SECONDS);
  const finalFen = typeof body.finalFen === 'string' ? body.finalFen.slice(0, 120) : null;
  const clientSessionId =
    typeof body.clientSessionId === 'string' && body.clientSessionId.length <= 64
      ? body.clientSessionId
      : null;

  const points = boutPoints({ outcome, roundsSurvived });
  const result = boutResult(outcome);

  const svc = createServiceClient();

  // Idempotency: if this bout already landed (double-tap, retry, flaky
  // network), return the existing row instead of writing a second one.
  if (clientSessionId) {
    const { data: existing } = await svc
      .from('bout_sessions')
      .select('id, points, result')
      .eq('client_session_id', clientSessionId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({
        ok: true,
        boutId: existing.id as string,
        points: (existing.points as number) ?? points,
        result: (existing.result as string) ?? result,
        duplicate: true,
      });
    }
  }

  const { data, error } = await svc
    .from('bout_sessions')
    .insert({
      user_id: user.id,
      outcome,
      result,
      points,
      punches: 0, // no physical tracking; column retained for schema stability
      moves,
      level,
      user_cards: [],
      rookie_cards: [],
      clock_left_seconds: clockLeftSeconds,
      final_fen: finalFen,
      client_session_id: clientSessionId,
    })
    .select('id')
    .single();

  if (error) {
    // The table may not be migrated yet (DDL is run by hand on the live DB).
    // A bout must never fail in the user's face over a missing table — the
    // result screen is already earned.
    if (/bout_sessions/.test(error.message ?? '')) {
      console.warn('bout_sessions not migrated — bout not persisted', error.message);
      return NextResponse.json({ ok: false, needsMigration: true, points, result });
    }
    console.error('bout finish insert failed', error);
    return NextResponse.json({ error: 'write failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, boutId: data.id as string, points, result });
}
