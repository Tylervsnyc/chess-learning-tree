/**
 * lib/rookie/matchmaking.ts
 *
 * Turns the Rookie rating into the level she actually plays at.
 *
 * This replaces "win 3 games to unlock the next level". That system could only
 * ratchet upward: a lucky run put you a rung above your real strength and left
 * you there permanently, losing. There was no finding your level, only
 * climbing until you stalled.
 *
 * Now the level is DERIVED from the rating, every game. The rating falls when
 * you lose, so the level falls with it — no separate demotion rule to keep in
 * sync, and nothing to get stuck.
 *
 * Pure functions. No React, no DB.
 */

import { ROOKIE_LEVELS } from '@/lib/rookie-levels';

/**
 * How far BELOW the player Rookie aims, in Elo.
 *
 * A learning app should feel winnable — the target is the player winning about
 * 60% of matched games, not a coin flip. 70 Elo is what that costs:
 * expectancy = 1 / (1 + 10^(-70/400)) ≈ 0.60.
 *
 * Retune this one number to change how hard the whole app feels.
 */
export const HANDICAP_ELO = 70;

/** Target win rate the handicap is set to produce — for copy and tests. */
export const TARGET_WIN_RATE = 0.6;

/**
 * A rating this far above Rookie's top level means she is simply outmatched;
 * the level pins at 10 rather than pretending there's more ladder.
 */
export function maxLevel(): number {
  return ROOKIE_LEVELS.length;
}

/** Expected score for a player rated `rating` against an opponent. */
export function expectedScore(rating: number, opponent: number): number {
  return 1 / (1 + Math.pow(10, (opponent - rating) / 400));
}

/**
 * The level whose rating sits closest to `target`.
 *
 * Nearest-rung, not "highest rung below" — overshooting by 20 is a better
 * match than undershooting by 180, and the ladder's steps are wide.
 */
export function levelForRating(target: number): number {
  let best = 1;
  let bestGap = Infinity;
  for (const lvl of ROOKIE_LEVELS) {
    const gap = Math.abs(lvl.elo - target);
    if (gap < bestGap) {
      bestGap = gap;
      best = lvl.level;
    }
  }
  return best;
}

export interface MatchedLevel {
  level: number;
  /** The strength we were aiming for, before snapping to a rung. */
  target: number;
  /** What the player should score against this level, 0..1. */
  expectedWinRate: number;
  /** How far the nearest rung missed the target, in Elo. */
  snapError: number;
}

/**
 * Pick Rookie's level for a player at `rookieRating`.
 *
 * `cap` clamps the result — the workout's Fight Rounds cap at FIGHT_MAX_LEVEL
 * because the deeper engines are too heavy for a timed segment.
 */
export function matchLevel(rookieRating: number, cap = maxLevel()): MatchedLevel {
  const target = rookieRating - HANDICAP_ELO;
  const level = Math.max(1, Math.min(cap, levelForRating(target)));
  const levelElo = ROOKIE_LEVELS[level - 1].elo;
  return {
    level,
    target: Math.round(target),
    expectedWinRate: expectedScore(rookieRating, levelElo),
    snapError: Math.round(levelElo - target),
  };
}

export type LevelChange = 'up' | 'down' | 'same';

/** Which way the level moved — drives Rookie's line, nothing else. */
export function levelChange(previous: number, next: number): LevelChange {
  if (next > previous) return 'up';
  if (next < previous) return 'down';
  return 'same';
}
