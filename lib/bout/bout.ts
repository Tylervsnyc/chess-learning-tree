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
 *   Final bell with no mate = decision on material.
 * - Three ways to lose: checkmated, flagged, behind on material at the bell.
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

// ─── The decision ────────────────────────────────────────────────────────────
// There is NO physical tracking (2026-08-05, Tyler): boxing rounds are a timer
// plus Rookie in your corner, nothing counted. So the final bell is decided on
// the BOARD — material when time runs out. "You were up a rook when the bell
// rang, that's your decision." Tie goes to the user (crowd favorite).
//
// Deliberately NOT an engine eval: material is the one thing a beginner can
// look at and agree with. A decision you can't understand isn't a decision.

/** Standard piece values. Kings are excluded — both sides always have one. */
const PIECE_VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };

/**
 * Material balance from a FEN, in pawns, from WHITE's point of view (the user
 * always plays white in a bout). Positive = user is up material.
 */
export function materialBalance(fen: string): number {
  const board = fen.split(' ')[0] ?? '';
  let score = 0;
  for (const ch of board) {
    const v = PIECE_VALUE[ch.toLowerCase()];
    if (v === undefined) continue;
    score += ch === ch.toUpperCase() ? v : -v;
  }
  return score;
}

export type BoutOutcome =
  | 'ko_win' // you checkmated Rookie
  | 'ko_loss' // Rookie checkmated you
  | 'flag_loss' // your 9:00 bank ran out
  | 'draw' // stalemate / dead position mid-bout
  | 'decision_win' // final bell, ahead on material (level goes to you)
  | 'decision_loss'; // final bell, behind on material

/**
 * Decision at the final bell, on material. Tie (or dead level) goes to the
 * user — the crowd favorite gets the nod.
 */
export function decideOnMaterial(fen: string): BoutOutcome {
  return materialBalance(fen) >= 0 ? 'decision_win' : 'decision_loss';
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
  // Rookie in your corner during a boxing round. Nothing is being counted —
  // she is the whole round. Rotated on a timer, so this pool has to be deep
  // enough that a 60s round never repeats and two rounds rarely overlap.
  // Register: coach who is far too invested, occasionally derailed by chess.
  boxing: [
    'Hands up. Chin down. Breathe out when you throw.',
    "Work. Just work. I'll hold the position, I promise I won't peek.",
    'Shoulders loose. You are carrying them like a queen you refuse to trade.',
    "Halfway. This is where it stops being fun — that's the part that counts.",
    "Don't watch the clock. The clock is my job.",
    'Move your feet. Nobody ever got mated standing still.',
    'Big breath. Slow one. The board will still be a disaster in a minute.',
    "You're doing the thing where you hold your breath. Out. Push it out.",
    "Ten seconds of ugly beats a minute of pretty. Give me ugly.",
    'I know it burns. I have read extensively about burning.',
    "Last stretch. Empty the tank — you can think when you sit down.",
    'Finish the round. Then we go be geniuses together.',
    'Nobody is counting. That is the point. Just work.',
    'Hands up, chin down. The knights talk if your guard drops.',
  ],
  koWin: [
    "Checkmate. That's yours forever.",
    'Mate. Right through the gloves. Proud of you.',
  ],
  meltdown: [
    'I was UP MATERIAL. I was WINNING. This is fine. This is completely fine.',
    'I had a whole extra piece. And you just — no. Rematch. Right now.',
  ],
  koLoss: [
    'Checkmate — but you made me sweat every square of it.',
    "That's the bout. You fought hard. Next time the position falls your way.",
  ],
  flagLoss: [
    "Flag's down. The clock got you before I did — and honestly, it was close.",
    'Time. The cruelest piece on the board. Run it back?',
  ],
  decisionWin: [
    'Bell rang, you had more wood on the board. Decision: yours.',
    "Decision: yours. You kept the pieces AND kept breathing. That's the sport.",
  ],
  decisionLoss: [
    'Decision: me. I was up material when the bell went. Barely counts. Counts.',
    'One trade next time and that flips. I will be thinking about it all week.',
  ],
  draw: [
    'A draw. We both live. The judges are furious.',
  ],
} as const;

export function pickLine(arr: readonly string[], seed: number): string {
  return arr[Math.abs(seed) % arr.length];
}

// ─── Bout scoring (v2) ───────────────────────────────────────────────────────
// A finished bout earns leaderboard points, the same currency the workout
// pays in. With no physical tracking there is nothing to measure in the
// boxing rounds, so the formula is: showing up + the chess result + how far
// into the bout you got. Nothing here can be inflated by phone-tapping.
//
// The API re-computes this server-side from the reported result — the client
// never sends a point total (see app/api/bout/finish).

/** Every bout that reaches the final bell or a decisive end. */
export const BOUT_BASE_POINTS = 100;

/** The chess result is the headline — it pays the most. */
export const BOUT_OUTCOME_POINTS: Record<BoutOutcome, number> = {
  ko_win: 400,
  decision_win: 250,
  draw: 150,
  decision_loss: 100,
  ko_loss: 60,
  flag_loss: 50,
};

/** Surviving to the bell of a boxing round — the conditioning half. */
export const BOUT_POINTS_PER_ROUND = 60;

export interface BoutScoreInput {
  outcome: BoutOutcome;
  /** Boxing rounds the user reached the bell in (0..BOXING_ROUND_COUNT). */
  roundsSurvived: number;
}

/**
 * Leaderboard points for one finished bout. Deterministic and pure so the
 * client preview and the server's stored value can never disagree.
 */
export function boutPoints({ outcome, roundsSurvived }: BoutScoreInput): number {
  const rounds = Math.max(0, Math.min(BOXING_ROUND_COUNT, Math.trunc(roundsSurvived)));
  const total =
    BOUT_BASE_POINTS + (BOUT_OUTCOME_POINTS[outcome] ?? 0) + rounds * BOUT_POINTS_PER_ROUND;
  return Math.max(0, Math.round(total));
}

/** 'win' | 'loss' | 'draw' — the fight-record bucket for an outcome. */
export function boutResult(outcome: BoutOutcome): 'win' | 'loss' | 'draw' {
  if (outcome === 'ko_win' || outcome === 'decision_win') return 'win';
  if (outcome === 'draw') return 'draw';
  return 'loss';
}
