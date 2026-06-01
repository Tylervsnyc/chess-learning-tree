/**
 * Interval Workout — schedule generator.
 *
 * Pure TypeScript, no React. Builds a deterministic circuit that alternates
 * chess-puzzle segments with physical-exercise segments, separated by short
 * breaks.
 *
 * A "block" = one active segment (3 min) + one break (1 min) = 4 min.
 * Active segments alternate: chess -> physical -> chess -> physical ...
 * and the physical ones alternate workout -> boxing. So the active sequence is:
 *   chess, workout, chess, boxing, chess, workout, chess, boxing, ...
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

export type SegmentKind = 'chess' | 'workout' | 'boxing' | 'break';

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
export function buildSchedule(totalMinutes: number): Segment[] {
  const totalSeconds = Math.max(0, Math.round(totalMinutes * 60));
  const segments: Segment[] = [];

  // The active sequence: chess, then alternating physical (workout/boxing),
  // back to chess, and so on.
  const activeOrder: SegmentKind[] = [];
  let elapsed = 0;
  let activeCount = 0; // how many active segments placed so far
  let physicalCount = 0; // how many physical segments placed (to alternate workout/boxing)
  let index = 0;

  while (elapsed < totalSeconds) {
    // Determine this active segment's kind.
    // Even active positions (0, 2, 4...) are chess; odd are physical.
    let kind: SegmentKind;
    if (activeCount % 2 === 0) {
      kind = 'chess';
    } else {
      kind = physicalCount % 2 === 0 ? 'workout' : 'boxing';
      physicalCount += 1;
    }
    activeCount += 1;
    activeOrder.push(kind);

    // Active segment
    segments.push({ kind, seconds: ACTIVE_SECONDS, index: index++ });
    elapsed += ACTIVE_SECONDS;

    if (elapsed >= totalSeconds) break;

    // Break after the active segment
    segments.push({ kind: 'break', seconds: BREAK_SECONDS, index: index++ });
    elapsed += BREAK_SECONDS;
  }

  // Never end on a break.
  while (segments.length > 0 && segments[segments.length - 1].kind === 'break') {
    segments.pop();
  }

  // Re-index in case we popped trailing breaks (keep indices contiguous).
  return segments.map((seg, i) => ({ ...seg, index: i }));
}

/** Human-readable label for a segment kind. */
export function labelFor(kind: SegmentKind): string {
  switch (kind) {
    case 'chess':
      return 'Puzzles';
    case 'workout':
      return 'Bodyweight workout';
    case 'boxing':
      return 'Boxing';
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
      return 'Now: bodyweight workout';
    case 'boxing':
      return 'Now: boxing';
    case 'break':
      return 'Break — catch your breath';
  }
}
