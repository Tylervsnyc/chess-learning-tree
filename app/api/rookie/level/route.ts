import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getRookieRating, applyGameResult } from '@/lib/rookie/rating';
import { matchLevel, levelChange, maxLevel } from '@/lib/rookie/matchmaking';

/**
 * /api/rookie/level — how strong Rookie should play for this user.
 *
 * GET  → { rating, level, provisional, expectedWinRate }
 * POST { level, result: 'win'|'loss'|'draw' } → records the game, returns the
 *        new { rating, level, change: 'up'|'down'|'same' }
 *
 * The level is DERIVED from the rating on every read, so there is one number
 * and it cannot disagree with itself. The rating falls on losses, which is how
 * Rookie eases off — there is no separate demotion path.
 *
 * Logged-out players get a 401 and keep using their localStorage level; that
 * cache merges up on login.
 *
 * Reads use the service role because the rating is derived from game_sessions
 * and written to a privileged profile column — a client must never be able to
 * hand itself an easier opponent, or a bigger bout multiplier (bout points
 * scale with level, see /api/bout/finish).
 */

const RESULTS = { win: 1, draw: 0.5, loss: 0 } as const;

function isResult(v: unknown): v is keyof typeof RESULTS {
  return v === 'win' || v === 'loss' || v === 'draw';
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const svc = createServiceClient();
  const { rating, provisional } = await getRookieRating(svc, user.id);
  const matched = matchLevel(rating);

  return NextResponse.json({
    rating,
    provisional,
    level: matched.level,
    expectedWinRate: Number(matched.expectedWinRate.toFixed(3)),
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  if (!isResult(body.result)) {
    return NextResponse.json({ error: 'invalid result' }, { status: 400 });
  }
  const rawLevel = typeof body.level === 'number' ? Math.trunc(body.level) : NaN;
  if (!Number.isFinite(rawLevel) || rawLevel < 1 || rawLevel > maxLevel()) {
    return NextResponse.json({ error: 'invalid level' }, { status: 400 });
  }

  const svc = createServiceClient();
  const before = matchLevel((await getRookieRating(svc, user.id)).rating);
  const after = await applyGameResult(svc, user.id, rawLevel, RESULTS[body.result]);
  const matched = matchLevel(after.rating);

  return NextResponse.json({
    rating: after.rating,
    provisional: after.provisional,
    level: matched.level,
    change: levelChange(before.level, matched.level),
    expectedWinRate: Number(matched.expectedWinRate.toFixed(3)),
  });
}
