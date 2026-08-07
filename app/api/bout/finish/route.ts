import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { periodStartISO } from '@/lib/leaderboard/period';
import {
  getRookieRating,
  applyGameResult,
  raiseRatingToFloor,
  BOUT_GAME_WEIGHT,
} from '@/lib/rookie/rating';
import { matchLevel, floorRatingForLevel, maxLevel } from '@/lib/rookie/matchmaking';
import { FIGHT_MAX_LEVEL } from '@/lib/workout/schedule';
import {
  boutPoints,
  boutResult,
  bankSeconds,
  boxingRoundCount,
  isBoutFormat,
  DAILY_RANKED_BOUT_LIMIT,
  RANKED_FORMAT,
  type BoutFormat,
  type BoutOutcome,
} from '@/lib/bout/bout';

/**
 * POST /api/bout/finish — record a finished Chess Boxing bout (Bout v2).
 *
 * Body: {
 *   outcome: BoutOutcome,
 *   roundsSurvived: number,   // boxing rounds reached the bell in
 *   moves: number,
 *   // NOTE: no `level` — the server derives it (see below).
 *   format: BoutFormat,       // sparring | standard | championship
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
 * from the reported result via boutPoints(), on inputs clamped to what the
 * reported format can actually contain. There is NO physical tracking in a
 * bout (no camera, no tap pad), so there is nothing a client could inflate
 * beyond that. The write uses the service role because bout_sessions has no
 * public insert policy (a user must not be able to hand-write a row onto a
 * public board).
 *
 * RANKED vs EXHIBITION — a bout only pays points if BOTH hold:
 *   1. format === RANKED_FORMAT (Standard). One board, one card length; a
 *      ranking across different-length bouts isn't a ranking.
 *   2. the user is under DAILY_RANKED_BOUT_LIMIT ranked bouts today. Fight
 *      Night: one that counts, then unlimited exhibition.
 * An exhibition bout still writes a row (0 points) so it counts for the streak
 * and the fight record — it just can't buy the weekly/monthly board. "Today"
 * is the leaderboard's own daily window, so the cap and the board can never
 * disagree about where the day starts.
 *
 * Returns { ok, boutId, points, result, ranked } — or
 * { ok: false, needsMigration: true } if the table isn't migrated yet, so the
 * client can finish the bout cleanly instead of erroring in the user's face.
 */

// Even the 6-chess-round Championship card can't run past this.
const MAX_MOVES = 400;

/** Fight-record bucket → Elo score for the Rookie rating. */
const RATING_SCORE = { win: 1, draw: 0.5, loss: 0 } as const;

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

  // Unknown/absent format falls back to the ranked one — old clients that
  // don't send it were all fighting the Standard card.
  const format: BoutFormat = isBoutFormat(body.format) ? body.format : RANKED_FORMAT;
  const boxingRounds = boxingRoundCount(format);

  const roundsSurvived = clampInt(body.roundsSurvived, boxingRounds);
  const moves = clampInt(body.moves, MAX_MOVES);
  const clockLeftSeconds = clampInt(body.clockLeftSeconds, bankSeconds(format));
  const finalFen = typeof body.finalFen === 'string' ? body.finalFen.slice(0, 120) : null;
  const clientSessionId =
    typeof body.clientSessionId === 'string' && body.clientSessionId.length <= 64
      ? body.clientSessionId
      : null;

  const result = boutResult(outcome);

  const svc = createServiceClient();

  // LEVEL IS NOT ACCEPTED FROM THE CLIENT. Bout points scale with Rookie's
  // level, and the client's level came from editable localStorage — sending
  // `level: 10` would have bought a 1.6x multiplier on every ranked bout. The
  // server derives it from the user's Rookie rating instead.
  const { rating } = await getRookieRating(svc, user.id);
  const level = matchLevel(rating, FIGHT_MAX_LEVEL).level;

  // Idempotency: if this bout already landed (double-tap, retry, flaky
  // network), return the existing row instead of writing a second one.
  if (clientSessionId) {
    const { data: existing } = await svc
      .from('bout_sessions')
      .select('id, points, result')
      .eq('client_session_id', clientSessionId)
      .maybeSingle();
    if (existing) {
      const storedPoints = (existing.points as number) ?? 0;
      return NextResponse.json({
        ok: true,
        boutId: existing.id as string,
        points: storedPoints,
        result: (existing.result as string) ?? result,
        ranked: storedPoints > 0,
        duplicate: true,
      });
    }
  }

  // ── Ranked or exhibition ───────────────────────────────────────────────────
  // Only the ranked card pays, and only under the daily cap. Points-bearing
  // rows in today's window ARE the ranked bouts (an exhibition stores 0), so
  // the count needs no extra column and can't drift from what the board sees.
  let ranked = format === RANKED_FORMAT;
  if (ranked) {
    const { data: todaysRanked, error: capError } = await svc
      .from('bout_sessions')
      .select('id, points')
      .eq('user_id', user.id)
      .gt('points', 0)
      .gte('created_at', periodStartISO('daily'));
    // A failed read must not silently hand out a free ranked bout — but it
    // also must not eat one the user earned. Missing table = no bouts yet.
    if (capError && !/bout_sessions/.test(capError.message ?? '')) {
      console.error('bout daily cap read failed', capError);
    }
    if ((todaysRanked ?? []).length >= DAILY_RANKED_BOUT_LIMIT) ranked = false;
  }

  const points = boutPoints({ outcome, roundsSurvived, level, boxingRounds, ranked });

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
      return NextResponse.json({ ok: false, needsMigration: true, points, result, ranked });
    }
    console.error('bout finish insert failed', error);
    return NextResponse.json({ error: 'write failed' }, { status: 500 });
  }

  // A bout is a full game against Rookie fought across rounds, so it moves the
  // Rookie rating at DOUBLE weight (BOUT_GAME_WEIGHT, both directions) —
  // otherwise a player who only ever fights bouts would never have her
  // difficulty adapt. Folded HERE rather than from the client so it can't be
  // replayed, and only on a fresh row (the duplicate path returns above).
  const updated = await applyGameResult(svc, user.id, level, RATING_SCORE[result], BOUT_GAME_WEIGHT);

  // Promotion rule: a CHECKMATE win in the ring at your true level guarantees
  // the next rung — the rating is lifted to the next level's floor, so the
  // next /play game (and the next bout, cap permitting) is against a stronger
  // Rookie. Skipped when the bout was capped below your real level
  // (FIGHT_MAX_LEVEL): beating a capped-down Rookie proves nothing new.
  const trueLevel = matchLevel(rating).level;
  if (outcome === 'ko_win' && level === trueLevel && level < maxLevel()) {
    await raiseRatingToFloor(svc, user.id, updated, floorRatingForLevel(level + 1));
  }

  return NextResponse.json({ ok: true, boutId: data.id as string, points, result, ranked });
}
