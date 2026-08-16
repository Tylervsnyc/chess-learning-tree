/**
 * Rookies Run scoring.
 *
 * One number, derived from four forces:
 *   - Move economy        (lower = better)
 *   - Capture value       (richer captures = bonus)
 *   - Speed               (fewer seconds = better)
 *   - Level completion    (each cleared level pays a flat bonus)
 *   - Tempo on hand       (leftover tempo at run end pays a small bonus)
 *
 * Formula:
 *   score = BASE
 *         − MOVE_PENALTY × moves
 *         + Σ piece_value(captured)
 *         − TIME_PENALTY × seconds
 *         + LEVEL_BONUS × levelsCleared
 *         + TEMPO_REMAINING_BONUS × tempoRemaining
 *
 * Score is never negative — we clamp at 0.
 */

import type { PieceType } from './types';

export const SCORE = {
  BASE: 1000,
  MOVE_PENALTY: 25,
  TIME_PENALTY_PER_SEC: 2,
  LEVEL_BONUS: 250,
  TEMPO_REMAINING_BONUS: 15,
} as const;

export const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  queen: 90,
};

/** Tempo gained when Rookie captures a piece of the given type. */
export const TEMPO_REWARD: Record<PieceType, number> = {
  pawn: 1,
  knight: 2,
  bishop: 2,
  queen: 4,
};

/** Maximum tempo Rookie can hold at once. */
export const TEMPO_MAX = 8;

export interface ScoreInput {
  moves: number;
  captures: PieceType[];
  elapsedMs: number;
  levelsCleared?: number;
  tempoRemaining?: number;
}

export interface ScoreBreakdown {
  base: number;
  movePenalty: number; // negative number
  captureBonus: number; // positive number
  timePenalty: number; // negative number
  levelBonus: number; // positive number
  tempoBonus: number; // positive number
  seconds: number;
  total: number; // clamped >= 0
}

export function computeScore(input: ScoreInput): ScoreBreakdown {
  const base = SCORE.BASE;
  const movePenalty = -SCORE.MOVE_PENALTY * input.moves;
  const captureBonus = input.captures.reduce(
    (sum, t) => sum + (PIECE_VALUES[t] ?? 0),
    0,
  );
  const seconds = Math.max(0, Math.round(input.elapsedMs / 1000));
  const timePenalty = -SCORE.TIME_PENALTY_PER_SEC * seconds;
  const levelBonus = SCORE.LEVEL_BONUS * (input.levelsCleared ?? 0);
  const tempoBonus = SCORE.TEMPO_REMAINING_BONUS * (input.tempoRemaining ?? 0);
  const raw =
    base + movePenalty + captureBonus + timePenalty + levelBonus + tempoBonus;
  return {
    base,
    movePenalty,
    captureBonus,
    timePenalty,
    levelBonus,
    tempoBonus,
    seconds,
    total: Math.max(0, raw),
  };
}
