/**
 * lib/rookie/win-ladder.ts
 *
 * THE level authority for how strong Rookie plays — "beat her 3 times and she
 * levels up", RESTORED 2026-08-31 by Tyler's call, deliberately reversing the
 * 2026-08-05 rating-matchmaking rework (commit ebad9bc).
 *
 * The rules (RULES.md §20b):
 *   - 3 wins at your current level advance you one level. Cap at level 10.
 *   - Wins don't have to be consecutive; losses and draws change NOTHING.
 *   - The level only ever goes UP. There is no demotion path, by design.
 *
 * Derived on read, like the streak — no stored counter, no new columns. The
 * server replays every finished Rookie game (game_sessions: result +
 * rookie_difficulty) and every Chess Boxing bout (bout_sessions) in
 * chronological order, counting each win toward the then-current derived
 * level. Historical games played under the old matchmaking at whatever
 * difficulty count the same way — every win is a win. Simple, predictable.
 *
 * The old Elo matchmaking rating (lib/rookie/rating.ts) is ANALYTICS-ONLY
 * now: it still gets folded so the number stays continuous, but nothing reads
 * it to pick a level.
 *
 * Pure functions + one DB derive. No React.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { ROOKIE_LEVELS } from '@/lib/rookie-levels';

/** Wins at the current level needed to advance one rung. */
export const WINS_TO_ADVANCE = 3;

/** Top of the ladder. */
export function maxLevel(): number {
  return ROOKIE_LEVELS.length;
}

export interface WinLadderState {
  /** Rookie's current level, 1..10. Only ever goes up. */
  level: number;
  /** Wins banked at this level so far, 0..WINS_TO_ADVANCE-1 (0 at the cap). */
  winsAtLevel: number;
}

export const LADDER_START: WinLadderState = { level: 1, winsAtLevel: 0 };

/**
 * Fold ONE win into the ladder. The 3rd win at a level advances it and resets
 * the count; at the cap nothing accumulates. Losses/draws never call this.
 */
export function applyWin(state: WinLadderState): WinLadderState {
  const cap = maxLevel();
  if (state.level >= cap) return { level: cap, winsAtLevel: 0 };
  const wins = state.winsAtLevel + 1;
  if (wins >= WINS_TO_ADVANCE) return { level: state.level + 1, winsAtLevel: 0 };
  return { level: state.level, winsAtLevel: wins };
}

export interface DerivedWinLadder extends WinLadderState {
  /**
   * State BEFORE the most recent counted win — lets a POST that races the
   * game_sessions insert tell whether the just-reported win already landed
   * and whether it crossed a level boundary.
   */
  beforeLastWin: WinLadderState;
  /** When the most recent counted win landed, or null if no wins yet. */
  lastWinAt: string | null;
  /** Total wins counted, all levels. */
  totalWins: number;
}

/** True when a Supabase error is just "that table isn't there yet". */
function isMissingTable(message: string | undefined): boolean {
  return /does not exist|relation .* does not/i.test(message ?? '');
}

/**
 * Replay the user's whole win history into a ladder state.
 *
 * Sources, merged chronologically:
 *   - game_sessions rows with a result AND a rookie_difficulty (i.e. /play
 *     games vs Rookie — puzzle sessions have no difficulty), win rows only.
 *   - bout_sessions win rows (a Chess Boxing bout is a full game vs Rookie).
 *
 * Only WIN timestamps matter — losses and draws are ignored for progression,
 * so they aren't even fetched.
 */
export async function deriveWinLadder(
  supabase: SupabaseClient,
  userId: string,
): Promise<DerivedWinLadder> {
  const winTimes: string[] = [];

  const games = await supabase
    .from('game_sessions')
    .select('ended_at')
    .eq('user_id', userId)
    .eq('result', 'win')
    .not('rookie_difficulty', 'is', null)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: true });
  if (games.error) {
    console.error('win ladder: game read failed', games.error);
  } else {
    for (const row of games.data ?? []) {
      if (typeof row.ended_at === 'string') winTimes.push(row.ended_at);
    }
  }

  const bouts = await supabase
    .from('bout_sessions')
    .select('created_at')
    .eq('user_id', userId)
    .eq('result', 'win')
    .order('created_at', { ascending: true });
  if (bouts.error) {
    // Missing table = the bout migration hasn't run yet — no bouts, not a bug.
    if (!isMissingTable(bouts.error.message) && !/bout_sessions/.test(bouts.error.message ?? '')) {
      console.error('win ladder: bout read failed', bouts.error);
    }
  } else {
    for (const row of bouts.data ?? []) {
      if (typeof row.created_at === 'string') winTimes.push(row.created_at);
    }
  }

  winTimes.sort((a, b) => a.localeCompare(b));

  let state: WinLadderState = LADDER_START;
  let beforeLastWin: WinLadderState = LADDER_START;
  for (const _t of winTimes) {
    beforeLastWin = state;
    state = applyWin(state);
  }

  return {
    ...state,
    beforeLastWin,
    lastWinAt: winTimes.length > 0 ? winTimes[winTimes.length - 1] : null,
    totalWins: winTimes.length,
  };
}
