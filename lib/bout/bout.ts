/**
 * Bout mode (BOUT_MODE) — pure logic, no React.
 *
 * ONE game vs Rookie split across chess rounds; the board freezes during
 * boxing rounds; you resume the same position gassed. Design source of truth:
 * docs/chess-boxing-app-structure.md ("Bout mode").
 *
 * Clock design (binding):
 * - One REAL clock — the user's: a 9:00 bank carried across all chess rounds.
 *   Flagging = real loss.
 * - Rookie's clock is pacing/flavor only. She thinks 2-4s/move, her clock
 *   ticks visually, she can NEVER flag.
 * - The bell always wins: round timer at zero freezes the board mid-position.
 *   Final bell with no mate = points decision.
 * - Three ways to lose: checkmated, flagged, outscored on the cards.
 */

export const CHESS_ROUND_SECONDS = 180; // 3:00 bell per chess round
export const BOXING_ROUND_SECONDS = 60; // v1 boxing rounds
export const USER_BANK_SECONDS = 540; // 9:00 across all chess rounds
export const ROOKIE_CLOCK_SECONDS = 540; // flavor only — never reaches zero
export const ROOKIE_CLOCK_FLOOR = 8; // her clock visually never drops below this

/** Rookie's move pacing: 2-4s per move (micro-recovery for the user). */
export const ROOKIE_THINK_MIN_MS = 2000;
export const ROOKIE_THINK_MAX_MS = 4000;

export type BoutSegmentKind = 'chess' | 'boxing';

export interface BoutSegment {
  kind: BoutSegmentKind;
  seconds: number;
  /** 1-based round number within its kind (Chess 1..3, Boxing 1..2). */
  round: number;
}

/** The v1 round card: Chess 1 → Boxing 1 → Chess 2 → Boxing 2 → Chess 3. */
export const BOUT_SEGMENTS: BoutSegment[] = [
  { kind: 'chess', seconds: CHESS_ROUND_SECONDS, round: 1 },
  { kind: 'boxing', seconds: BOXING_ROUND_SECONDS, round: 1 },
  { kind: 'chess', seconds: CHESS_ROUND_SECONDS, round: 2 },
  { kind: 'boxing', seconds: BOXING_ROUND_SECONDS, round: 2 },
  { kind: 'chess', seconds: CHESS_ROUND_SECONDS, round: 3 },
];

export const BOXING_ROUND_COUNT = BOUT_SEGMENTS.filter((s) => s.kind === 'boxing').length;

// ─── Judges' cards ───────────────────────────────────────────────────────────
// Each boxing round is scored on punch output — one point per counted punch
// (same punch machinery as the workout's exercise segments). Rookie is the
// opponent on the cards: her round score is a believable target derived from a
// par pace with ±15% variance, deterministic per bout-seed + round.

/** Par punch output for one 60s boxing round (~1 punch/sec working pace). */
export const BOXING_PAR = 60;

/** Cheap deterministic 0..1 from (seed, round) — stable for a whole bout. */
function seededFrac(seed: number, round: number): number {
  const x = Math.sin(seed * 374761 + round * 668265) * 43758.5453;
  return x - Math.floor(x);
}

/** Rookie's score for one boxing round: par ±15%, deterministic per seed. */
export function rookieBoxingScore(seed: number, round: number): number {
  return Math.round(BOXING_PAR * (0.85 + seededFrac(seed, round) * 0.3));
}

export type BoutOutcome =
  | 'ko_win' // you checkmated Rookie
  | 'ko_loss' // Rookie checkmated you
  | 'flag_loss' // your 9:00 bank ran out
  | 'draw' // stalemate / dead position mid-bout
  | 'decision_win' // final bell, you outscored her (tie goes to you)
  | 'decision_loss'; // final bell, outscored on the cards

/** Points decision at the final bell. Tie goes to the user (crowd favorite). */
export function decideOnCards(userCards: number[], rookieCards: number[]): BoutOutcome {
  const user = userCards.reduce((s, n) => s + n, 0);
  const rookie = rookieCards.reduce((s, n) => s + n, 0);
  return user >= rookie ? 'decision_win' : 'decision_loss';
}

export function fmtClock(s: number): string {
  const clamped = Math.max(0, s);
  const m = Math.floor(clamped / 60);
  const sec = clamped % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Rookie's bout lines ─────────────────────────────────────────────────────
// Small bout-specific set (no speech systems — the quip pools must never be
// statically imported from a page). Voice: short, warm, over-invested; sore
// loser when SHE loses. No emojis.

export const BOUT_LINES = {
  prefight: [
    'Three rounds of chess. Two rounds of gloves. One of us cries at the end.',
    "I've been shadowboxing all morning. Metaphorically. No arms.",
  ],
  bellFreeze: [
    "That's the bell. Board's frozen — I'll hold the position. Go hit something.",
    'Bell! Gloves on. I remember every square, just so you know.',
    "Round's over. I'll be here, plotting. Loudly.",
  ],
  bellResume: [
    'Gloves off, board on. Same position — I never left.',
    "Where were we. Right — here. I've been thinking about this the whole round.",
    'Back to the board. Try to breathe on your own time.',
  ],
  clockTaunt: [
    "Your clock. I'm just saying. Your clock.",
    "Tick tock. I don't even have a heartbeat and mine is racing for you.",
    'Under thirty. Move with your hands, think with your gut.',
  ],
  boxing: [
    'Punch like you mean it — the judges are watching. I bribed none of them.',
    'Hands up, chin down. The knights talk if your guard drops.',
  ],
  koWin: [
    "Checkmate. That's yours forever.",
    'Mate. Right through the gloves. Proud of you.',
  ],
  meltdown: [
    'I was WINNING. On the CARDS. This is fine. This is completely fine.',
    'The judges had me AHEAD. And you just — no. Rematch. Right now.',
  ],
  koLoss: [
    'Checkmate — but you made me sweat every square of it.',
    "That's the bout. You fought hard. Next time the cards fall your way.",
  ],
  flagLoss: [
    "Flag's down. The clock got you before I did — and honestly, it was close.",
    'Time. The cruelest piece on the board. Run it back?',
  ],
  decisionWin: [
    'The judges say you. The judges are correct and very brave.',
    "Decision: yours. You out-worked me between the moves. That's the sport.",
  ],
  decisionLoss: [
    'Decision: me. On work rate. The board was all you though — I felt it.',
    'The cards say me. Barely. Throw more leather next time and it flips.',
  ],
  draw: [
    'A draw. We both live. The judges are furious.',
  ],
} as const;

export function pickLine(arr: readonly string[], seed: number): string {
  return arr[Math.abs(seed) % arr.length];
}
