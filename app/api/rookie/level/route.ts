import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { applyGameResult } from '@/lib/rookie/rating';
import {
  deriveWinLadder,
  applyWin,
  winCounts,
  maxLevel,
  WINS_TO_ADVANCE,
  type WinLadderState,
} from '@/lib/rookie/win-ladder';
import { getLevelElo } from '@/lib/rookie-levels';

/**
 * /api/rookie/level — how strong Rookie should play for this user.
 *
 * WIN-COUNTER LADDER, restored 2026-08-31 (Tyler's call, reversing the
 * 2026-08-05 rating-matchmaking rework): beat Rookie 3 times at your level and
 * she levels up. The level ONLY goes up — losses and draws change nothing.
 * A win counts only when played AT the ladder level or above (the level
 * picker lets users replay lower rungs for fun — those wins never promote).
 *
 * GET  → { level, winsAtLevel, winsToAdvance, levelElo }
 * POST { level, result: 'win'|'loss'|'draw' } →
 *        { level, winsAtLevel, winsToAdvance, levelElo, change: 'up'|'same' }
 *
 * The ladder is DERIVED on every read by replaying the user's win history
 * (lib/rookie/win-ladder.ts — game_sessions + bout_sessions), like the
 * streak: no stored counter, nothing to drift. The client's game_sessions
 * insert races this POST, so the POST checks whether the just-reported win
 * already landed (a counted win in the last minute) before folding it on top
 * — a player can't finish two real games inside a minute.
 *
 * The old Elo rating (lib/rookie/rating.ts) is ANALYTICS-ONLY: the POST still
 * folds the result so profiles.rookie_rating stays continuous, but the level
 * never reads it.
 *
 * Logged-out players get a 401 and keep using their localStorage ladder
 * ('rookie-level' + 'rookie-level-wins', managed by lib/rookie/level-client.ts).
 *
 * The level is never accepted from a client (bout points scale with it —
 * see /api/bout/finish); the reported `level` is validated but the ladder is
 * derived server-side regardless.
 */

const RESULTS = { win: 1, draw: 0.5, loss: 0 } as const;

/** A counted win this recent is assumed to BE the game the POST reports. */
const JUST_LANDED_MS = 60_000;

function isResult(v: unknown): v is keyof typeof RESULTS {
  return v === 'win' || v === 'loss' || v === 'draw';
}

function ladderJson(state: WinLadderState, extra?: Record<string, unknown>) {
  return NextResponse.json({
    level: state.level,
    winsAtLevel: state.winsAtLevel,
    winsToAdvance: WINS_TO_ADVANCE,
    levelElo: getLevelElo(state.level),
    ...extra,
  });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const svc = createServiceClient();
  const derived = await deriveWinLadder(svc, user.id);
  return ladderJson(derived);
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
  const derived = await deriveWinLadder(svc, user.id);

  let before: WinLadderState = derived;
  let after: WinLadderState = derived;
  if (body.result === 'win') {
    const landed =
      derived.lastWinAt !== null &&
      Date.now() - Date.parse(derived.lastWinAt) < JUST_LANDED_MS;
    if (landed && winCounts(derived.beforeLastWin, rawLevel)) {
      // The game_sessions insert beat us here AND this win qualified from the
      // pre-win state — the derived state already includes it. beforeLastWin
      // tells us if it crossed a boundary.
      before = derived.beforeLastWin;
    } else if (winCounts(derived, rawLevel)) {
      // The insert hasn't landed yet — fold the reported win on top. The next
      // derive will count the real row and agree with this answer.
      after = applyWin(derived);
    }
    // else: a win at a LOWER level (replayed for fun via the level picker) —
    // it never moves the ladder. The derive above already ignores such rows.
  }

  // Analytics-only: keep the old Elo rating continuous. Nothing reads it for
  // matchmaking any more (2026-08-31) — do not derive a level from it.
  await applyGameResult(svc, user.id, rawLevel, RESULTS[body.result]);

  return ladderJson(after, { change: after.level > before.level ? 'up' : 'same' });
}
