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

// ─── Scoring v2: base × combo × pay factor, anchored to your high-water ELO ──
// Harder puzzles are worth more (base tiers). A run of correct answers grows a
// combo multiplier; a wrong answer breaks the combo back to ×1 and scores 0.
//
// Anti-sandbagging (the v2 change): every award is anchored to the session's
// HIGH-WATER ELO — the highest adaptive target you've reached this session,
// which only ratchets up. Puzzles near your high water pay full; slightly
// below pay half; far below (300+ under) are "farm" tier — they pay exactly
// 1 point and never grow the combo. So tanking the difficulty target by
// failing on purpose earns nothing: the easy puzzles that follow are farm.
//
// A wrong answer NEVER ends a segment — you keep swinging until the bell,
// however many you miss. The cost is scoring only: 0 points, the combo breaks
// back to x1, and the target ELO eases down, which pushes the next puzzles
// toward farm tier under the high-water anchor. That pay factor (not a strike
// limit) is what makes tanking the difficulty worthless.
//
// One more v2 mechanic (enforced by the workout page, constant lives here):
// - FIRED UP: throw FIRED_UP_PUNCH_TARGET+ punches during one exercise
//   segment (punch cam on) and the NEXT chess segment pays +25%.

/** Point multiplier on a Fired Up chess segment. */
export const FIRED_UP_MULTIPLIER = 1.25;
/** Punches within ONE exercise segment needed to fire up the next chess segment. */
export const FIRED_UP_PUNCH_TARGET = 80;

/** Base points for a correct puzzle, by puzzle rating (v2 tiers). */
export function basePoints(rating: number): number {
  if (rating < 1000) return 10;
  if (rating < 1400) return 18;
  if (rating < 1800) return 30;
  return 45;
}

/** Combo multiplier for the current correct-streak length. */
export function comboMultiplier(streak: number): number {
  if (streak >= 8) return 2;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1;
}

/**
 * How much a puzzle pays relative to the session's high-water ELO.
 * 1 = full (at or near your peak), 0.5 = a bit below, 0 = "farm" tier
 * (300+ below peak) — farm puzzles pay a flat 1 point and must not grow
 * the combo.
 */
export function payFactor(puzzleRating: number, highWaterElo: number): number {
  if (puzzleRating >= highWaterElo - 150) return 1;
  if (puzzleRating >= highWaterElo - 300) return 0.5;
  return 0; // farm tier
}

/**
 * v2 points for a correct answer. Pass the streak length AFTER this answer
 * (i.e. `prevStreak + 1`). Farm-tier puzzles (payFactor 0) pay a flat 1 —
 * no combo, no Fired Up scaling. Everything else pays at least 1.
 */
export function pointsForCorrectV2(
  rating: number,
  streakAfter: number,
  highWaterElo: number,
  firedUp: boolean,
): number {
  const pf = payFactor(rating, highWaterElo);
  if (pf === 0) return 1;
  const raw = Math.round(basePoints(rating) * comboMultiplier(streakAfter) * pf);
  const scaled = firedUp ? Math.round(raw * FIRED_UP_MULTIPLIER) : raw;
  return Math.max(1, scaled);
}

// ─── Fight rounds (WORKOUT_FIGHT_ROUNDS): "judges' points" scoring ───────────
// One continuous game vs Rookie across the chess segments. At each chess-
// segment end (and at any game end) the segment is scored on NET MATERIAL
// gained since the segment started — like judges scoring a boxing round.
// Points scale with Rookie's level (beating up Baby Mode pays half), Fired Up
// (≥80 punches the previous exercise segment) pays +25%, and each round's
// material points are capped so one blowout segment can't run away with the
// leaderboard. Checkmating Rookie adds a round bonus + a session win bonus;
// the win bonus deliberately does NOT count toward bestRoundPoints so the
// daily best-round board stays comparable with puzzle rounds.

/** Judges' points per pawn-equivalent of net material gained in a segment. */
export const FIGHT_POINTS_PER_PAWN = 10;
/** Cap on material judges' points per ROUND (one chess segment per round). */
export const FIGHT_ROUND_MATERIAL_CAP = 120;
/** Round-points bonus for checkmating Rookie (counts toward best round). */
export const FIGHT_MATE_ROUND_BONUS = 100;
/** Session bonus for checkmating Rookie (level-scaled, NOT in bestRoundPoints). */
export const FIGHT_WIN_SESSION_BONUS = 300;
/** Session bonus for a draw/stalemate (unscaled, NOT in bestRoundPoints). */
export const FIGHT_DRAW_SESSION_BONUS = 100;

/** Pawn-equivalent piece values for the cheap material eval. */
export const FIGHT_PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
};

/**
 * How much a fight round pays relative to Rookie's level (anti farm-the-baby).
 *
 * Covers the full 1-10 /play ladder — fight rounds are no longer capped, so a
 * player who has climbed to L8 must be paid for the Rookie they actually
 * fought. Rises ~0.15/level above L4, matching levelMultiplier's slope in
 * lib/bout/bout.ts so the ring and the workout value a level the same way.
 */
export function fightLevelFactor(level: number): number {
  switch (Math.max(1, Math.min(10, Math.round(level)))) {
    case 1: return 0.5;
    case 2: return 0.7;
    case 3: return 0.85;
    case 4: return 1;
    case 5: return 1.15;
    case 6: return 1.3;
    case 7: return 1.45;
    case 8: return 1.6;
    case 9: return 1.75;
    default: return 1.9;
  }
}

/**
 * White's material lead in pawn units from a FEN (the player is always white
 * in fight rounds). Positive = player is up material.
 */
export function whiteMaterialLead(fen: string): number {
  const board = fen.split(' ')[0];
  let lead = 0;
  for (const ch of board) {
    const lower = ch.toLowerCase();
    const val = FIGHT_PIECE_VALUES[lower];
    if (val === undefined) continue;
    lead += ch === lower ? -val : val; // lowercase = black
  }
  return lead;
}

/**
 * Judges' points for one segment: +10 per pawn-equivalent of NET material
 * gained since the segment started, level-scaled, Fired Up ×1.25, never
 * negative. The per-round cap is applied by the caller (a game can end and a
 * segment can end inside the same round — the cap covers their sum).
 */
export function fightMaterialPoints(
  materialDelta: number,
  level: number,
  firedUp: boolean,
): number {
  if (materialDelta <= 0) return 0;
  const raw = materialDelta * FIGHT_POINTS_PER_PAWN * fightLevelFactor(level);
  return Math.round(firedUp ? raw * FIRED_UP_MULTIPLIER : raw);
}

/** Level-scaled session bonus for checkmating Rookie. */
export function fightWinBonus(level: number): number {
  return Math.round(FIGHT_WIN_SESSION_BONUS * fightLevelFactor(level));
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
