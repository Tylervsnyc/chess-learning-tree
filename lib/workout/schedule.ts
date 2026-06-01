/**
 * Interval Workout — schedule generator.
 *
 * Pure TypeScript, no React. Builds a deterministic circuit that alternates
 * chess-puzzle segments with physical-exercise segments, separated by short
 * breaks.
 *
 * A "block" = one active segment (3 min) + one break (1 min) = 4 min.
 * Active segments alternate: chess -> exercise -> chess -> exercise ...
 * So one full 8-min loop is: puzzles, break, exercise, break.
 *
 * A 1-min break is inserted AFTER each active segment, except we never end on
 * a break (the trailing break is dropped).
 */

export const ACTIVE_SECONDS = 180; // 3 minutes
export const BREAK_SECONDS = 60; // 1 minute

/** Flat bonus for finishing a whole session with zero wrong answers. */
export const PERFECT_SESSION_BONUS = 50;

// ─── Scoring: base points × combo multiplier ────────────────────────────────
// Harder puzzles are worth more (base tiers). A run of correct answers grows a
// combo multiplier; a single wrong answer breaks the combo back to ×1 and
// scores 0 (no negative — losing the streak is the cost). Combo persists across
// the whole session; breaks/workout segments don't reset it.

/** Base points for a correct puzzle, by puzzle rating. */
export function basePoints(rating: number): number {
  if (rating < 1000) return 10;
  if (rating < 1400) return 15;
  if (rating < 1800) return 20;
  return 25;
}

/** Combo multiplier for the current correct-streak length. */
export function comboMultiplier(streak: number): number {
  if (streak >= 8) return 2;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1;
}

/**
 * Points awarded for a correct answer given the streak length AFTER this
 * answer (i.e. pass `prevStreak + 1`). Rounded to a whole number.
 */
export function pointsForCorrect(rating: number, streakAfter: number): number {
  return Math.round(basePoints(rating) * comboMultiplier(streakAfter));
}

export type SegmentKind = 'chess' | 'workout' | 'break';

export interface Segment {
  kind: SegmentKind;
  seconds: number;
  index: number;
}

/** Duration options offered in the setup screen, in minutes. */
export const DURATION_PRESETS = [8, 16, 24, 32] as const;

/**
 * Build the full ordered list of segments for a session of `totalMinutes`.
 *
 * Generates blocks (active + break) until elapsed time reaches the requested
 * total, then drops a trailing break so the session never ends on a rest.
 */
/** One round = puzzles, break, exercise, break. */
export const ROUND: SegmentKind[] = ['chess', 'break', 'workout', 'break'];
export const ROUND_LENGTH = ROUND.length; // 4 segments
export const ROUND_SECONDS = ACTIVE_SECONDS * 2 + BREAK_SECONDS * 2; // 8 min

export function buildSchedule(totalMinutes: number): Segment[] {
  const totalSeconds = Math.max(ROUND_SECONDS, Math.round(totalMinutes * 60));
  const rounds = Math.max(1, Math.round(totalSeconds / ROUND_SECONDS));

  const segments: Segment[] = [];
  let index = 0;
  for (let r = 0; r < rounds; r++) {
    for (const kind of ROUND) {
      const seconds = kind === 'break' ? BREAK_SECONDS : ACTIVE_SECONDS;
      segments.push({ kind, seconds, index: index++ });
    }
  }
  return segments;
}

/** Human-readable label for a segment kind. */
export function labelFor(kind: SegmentKind): string {
  switch (kind) {
    case 'chess':
      return 'Puzzles';
    case 'workout':
      return 'Exercise';
    case 'break':
      return 'Break';
  }
}

/** Short prompt / instruction shown during a segment. */
export function promptFor(kind: SegmentKind): string {
  switch (kind) {
    case 'chess':
      return 'Solve as many as you can';
    case 'workout':
      return 'Move your body';
    case 'break':
      return 'Break — catch your breath';
  }
}
