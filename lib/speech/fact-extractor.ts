/**
 * Fact Extractor — pulls 2-3 discrete observations from a completed game.
 *
 * These feed into Rookie's opening Claude call for the next game:
 * "Last time you hung a bishop on move 12. Just saying."
 *
 * Pure function — takes game data, returns string facts.
 */

import type { MoveRecord } from '@/lib/game-session';
import type { GameAnalysis } from '@/lib/game-eval';

export interface GameFactInput {
  result: 'win' | 'loss' | 'draw';
  resultMethod?: 'checkmate' | 'stalemate' | 'resignation' | 'timeout';
  playerColor: 'white' | 'black';
  moves: MoveRecord[];
  analysis?: GameAnalysis | null;
  gamesPlayed: number; // how many games before this one
  totalWins: number;
}

/**
 * Extract memory hooks from a completed game.
 *
 * These feed Rookie's opening line for the NEXT game. Rookie is OVER-INVESTED
 * in the player, not a stat auditor — so these are warm, competitive callbacks
 * ("you beat me last time"), never nagging numeric nitpicks ("you hung your
 * queen twice", "40% accuracy"). Citing the player's mistakes back at them by
 * count reads as false context and off-voice — we don't do it. Keep it to the
 * few beats that make Rookie sound like she remembers and cares.
 */
export function extractFacts(input: GameFactInput): string[] {
  const { result, resultMethod, gamesPlayed, totalWins } = input;
  const facts: string[] = [];

  // ── Big, warm, competitive beats only ──

  if (result === 'win' && totalWins === 0) {
    facts.push('Beat Rookie for the very first time last game — she wants a rematch');
  } else if (result === 'win' && resultMethod === 'checkmate') {
    facts.push('Checkmated Rookie last game — she is taking it personally (affectionately)');
  } else if (result === 'win') {
    facts.push('Beat Rookie last game');
  } else if (result === 'draw') {
    facts.push('Drew with Rookie last game — she wants a winner this time');
  } else if (result === 'loss') {
    // Don't rub it in. Rookie is rooting for them — frame it as a rematch she's into.
    facts.push('Lost a close one to Rookie last game — she is rooting for the comeback');
  }

  // First game grounding
  if (gamesPlayed === 0) {
    facts.push('This is their very first game against Rookie');
  }

  // Cap at 2 — Rookie remembers a beat or two, not a box score.
  return facts.slice(0, 2);
}
