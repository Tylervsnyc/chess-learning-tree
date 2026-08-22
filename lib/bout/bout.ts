/**
 * Bout mode (BOUT_MODE) — pure logic, no React.
 *
 * ONE game vs Rookie split across chess rounds; the board freezes during
 * boxing rounds; you resume the same position gassed. Design source of truth:
 * docs/chess-boxing-app-structure.md ("Bout mode").
 *
 * Clock design (binding):
 * - One REAL clock — the user's: a bank carried across all chess rounds
 *   (2:00 per chess round on the card). Flagging = real loss.
 * - Rookie's clock is pacing/flavor only. She thinks 2-4s/move, her clock
 *   ticks visually, she can NEVER flag.
 * - The bell always wins: round timer at zero freezes the board mid-position.
 *   Final bell with no mate = decision on material.
 * - Three ways to lose: checkmated, flagged, behind on material at the bell.
 */

import type { FightStats } from '@/lib/box/fight-stats';

// ─── The round card ──────────────────────────────────────────────────────────
// LOCKED STRUCTURE (2026-08-05, Tyler): a bout is always
//   chess 3:00 · break 1:00 · boxing 3:00 · break 1:00 · chess 3:00 · …
// Chess always opens and always closes; a 1:00 break sits between EVERY round;
// there is never a trailing break. That is the sport, and it does not vary.
//
// What varies is only the NUMBER of rounds — that's the format dial. The full
// official 11-round card is 43 minutes, which is not a phone workout, so we
// ship three lengths off the same locked structure.

export const CHESS_ROUND_SECONDS = 180; // 3:00 bell per chess round
export const BOXING_ROUND_SECONDS = 180; // 3:00 bell per boxing round
export const BREAK_SECONDS = 60; // 1:00 between every round

/**
 * The user's chess bank scales with the card: 2:00 per chess round. Sparring
 * 4:00 · Standard 6:00 · Championship 12:00 (the WCBA number). Tight enough
 * that flagging is a real way to lose — which it has to be, or the clock is
 * decoration.
 */
export const BANK_SECONDS_PER_CHESS_ROUND = 120;

export const ROOKIE_CLOCK_FLOOR = 8; // her clock visually never drops below this

/** Rookie's move pacing: 2-4s per move (micro-recovery for the user). */
export const ROOKIE_THINK_MIN_MS = 2000;
export const ROOKIE_THINK_MAX_MS = 4000;

export type BoutFormat = 'sparring' | 'standard' | 'championship';

export interface BoutFormatSpec {
  id: BoutFormat;
  label: string;
  /** Chess rounds on the card. Boxing rounds are always this minus one. */
  chessRounds: number;
  blurb: string;
}

export const BOUT_FORMATS: Record<BoutFormat, BoutFormatSpec> = {
  sparring: {
    id: 'sparring',
    label: 'Sparring',
    chessRounds: 2,
    blurb: 'Two chess rounds, one in the gloves. Practice — not ranked.',
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    chessRounds: 3,
    blurb: 'Three chess, two boxing. The ranked bout.',
  },
  championship: {
    id: 'championship',
    label: 'Championship',
    chessRounds: 6,
    blurb: 'The full official card. Six chess, five boxing. Not ranked.',
  },
};

export const BOUT_FORMAT_ORDER: BoutFormat[] = ['sparring', 'standard', 'championship'];

/**
 * ONE format is ranked. A leaderboard where people fought different-length
 * bouts isn't a ranking, it's a list — so only Standard pays points. Sparring
 * and Championship still count as a finished unit for the streak.
 */
export const RANKED_FORMAT: BoutFormat = 'standard';

/**
 * Ranked bouts per day. Fight Night: one that counts, then unlimited
 * exhibition. Enforced server-side in /api/bout/finish against the same daily
 * window the leaderboard uses, so the cap and the board can never disagree.
 */
export const DAILY_RANKED_BOUT_LIMIT = 1;

export function isBoutFormat(v: unknown): v is BoutFormat {
  return v === 'sparring' || v === 'standard' || v === 'championship';
}

export type BoutSegmentKind = 'chess' | 'boxing' | 'break';

export interface BoutSegment {
  kind: BoutSegmentKind;
  seconds: number;
  /** 1-based round number within its kind. Breaks carry the round they follow. */
  round: number;
}

export function chessRoundCount(format: BoutFormat): number {
  return BOUT_FORMATS[format].chessRounds;
}

/** Boxing rounds always sit BETWEEN chess rounds, so there is one fewer. */
export function boxingRoundCount(format: BoutFormat): number {
  return Math.max(0, chessRoundCount(format) - 1);
}

/** The user's chess bank for a format, in seconds. */
export function bankSeconds(format: BoutFormat): number {
  return chessRoundCount(format) * BANK_SECONDS_PER_CHESS_ROUND;
}

/**
 * The card for a format: chess first, chess last, boxing between, a 1:00 break
 * after every round except the last. Built, never hand-listed — the structure
 * is a rule, not a table someone can edit out of shape.
 */
export function buildSegments(format: BoutFormat): BoutSegment[] {
  const chess = chessRoundCount(format);
  const segments: BoutSegment[] = [];
  for (let i = 1; i <= chess; i++) {
    segments.push({ kind: 'chess', seconds: CHESS_ROUND_SECONDS, round: i });
    if (i < chess) {
      segments.push({ kind: 'break', seconds: BREAK_SECONDS, round: i });
      segments.push({ kind: 'boxing', seconds: BOXING_ROUND_SECONDS, round: i });
      segments.push({ kind: 'break', seconds: BREAK_SECONDS, round: i });
    }
  }
  return segments;
}

/** Total wall-clock length of a card, in seconds (for the format picker). */
export function boutDurationSeconds(format: BoutFormat): number {
  return buildSegments(format).reduce((sum, s) => sum + s.seconds, 0);
}

// ─── The decision ────────────────────────────────────────────────────────────
// The final bell is decided on the BOARD first — material when time runs out.
// "You were up a rook when the bell rang, that's your decision." When material
// is dead level, the JUDGES' CARDS decide (2026-08-17, Tyler): Quadrant Fight
// scores every boxing round 0-100 for you and for Rookie (`cardScore` /
// `rookieCard`); higher total takes the level. Still tied → the user (crowd
// favorite). If the camera game is off, the cards are empty and it plays
// exactly like the pure material rule.
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

/** Sum of a card list, each entry clamped to the 0-100 judges' scale. */
export function sumCards(cards: readonly number[]): number {
  return cards.reduce((sum, c) => sum + clampCard(c), 0);
}

/**
 * Decision at the final bell with judges' cards. Material decides whenever a
 * side is up at least a pawn; when the board is dead level, the cards decide;
 * cards tied (or no cards) → the user.
 */
export function decideAtBell(
  fen: string,
  userCards: readonly number[] = [],
  rookieCards: readonly number[] = [],
): BoutOutcome {
  const balance = materialBalance(fen);
  if (balance >= 1) return 'decision_win';
  if (balance <= -1) return 'decision_loss';
  return sumCards(userCards) >= sumCards(rookieCards) ? 'decision_win' : 'decision_loss';
}

/** Did the cards (not material) settle this bell? For the result screen. */
export function cardsDecided(fen: string, userCards: readonly number[], rookieCards: readonly number[]): boolean {
  return userCards.length > 0 && rookieCards.length > 0 && Math.abs(materialBalance(fen)) < 1;
}

// ─── Judges' cards ───────────────────────────────────────────────────────────
// One card per boxing round, 0-100 (a 10-point must system is too coarse for a
// leaderboard column). Pure functions of the FightStats Quadrant Fight reports.

function clampCard(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Card = volume + accuracy (2026-08-21, HP/knockdowns removed): the round's
// metric is counts — punches landed vs missed, dodges made vs hits taken.
// ~100 needs both volume AND precision; neither alone gets you there.
const CARD_VOLUME_WEIGHT = 0.5; // points per clean action
const CARD_ACCURACY_WEIGHT = 60; // points at 100% accuracy

/** Your card for one boxing round. */
export function cardScore(stats: FightStats): number {
  const hits = stats.punchesLanded + stats.dodgesMade; // volume of clean actions
  const attempts = hits + stats.punchesMissed + stats.hitsTaken;
  const acc = attempts > 0 ? hits / attempts : 0;
  return clampCard(hits * CARD_VOLUME_WEIGHT + acc * CARD_ACCURACY_WEIGHT);
}

/**
 * Rookie's card for the round — a deterministic foil so `rookie_cards` means
 * something: she scores when she lands on you and loses ground when you slip.
 */
export function rookieCard(stats: FightStats, level: number): number {
  const lvl = Math.max(1, Math.min(10, Math.trunc(level) || 1));
  return clampCard(35 + lvl * 4 + stats.hitsTaken * 2 - stats.dodgesMade);
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
  // The 1:00 break between rounds. Short, breathy, gets you to the next bell.
  breakLines: [
    'Sixty seconds. Sit down, breathe, say nothing clever.',
    'Break. Hands on your knees is allowed. Quitting is not.',
    'One minute. I will be right here holding the position hostage.',
    'Water. Air. Then we go again.',
    'Rest. You have earned exactly sixty seconds of it.',
    'Shake it out. Next round starts whether you are ready or not.',
  ],
  // Rookie in your corner during a boxing round. Nothing is being counted —
  // she is the whole round. Rotated every ~12s, and a round is now 3:00, so
  // this pool must be deep enough (15+ slots) that one round never repeats
  // and two rounds in a bout rarely overlap.
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
    'Jab. Jab. Then something you regret. That is the sport.',
    'Elbows in. You are leaking guard like an open file.',
    'Three minutes is not long. It is only long right now.',
    'Turn the hip over. Power comes from the floor, not the arm.',
    'Reset your feet. You have drifted. Everyone drifts.',
    'Breathe in through the nose. I read that somewhere and I trust it.',
    'You look tired. Good. Tired is where the round actually starts.',
    'Do not headhunt. Body first. Same as trading pieces first.',
    'Chin behind the shoulder. I like your face the way it is.',
    'Minute in. The hard part is exactly as long as the easy part was.',
    'Short punches. You are reaching. Reaching is how you get countered.',
    'I would be throwing hands right now if I had any. Envy is my whole thing.',
    'Two minutes down. The board is not going anywhere and neither are you.',
    'Slow is smooth. Smooth is fast. Fast is how you win the last thirty.',
    'Keep the rhythm. Rhythm is just tempo and I love tempo.',
    'Guard up when you are tired. Especially when you are tired.',
    'Under a minute. This is the part you will remember tomorrow.',
    'Thirty seconds. Whatever you have left, spend it now.',
    'Do not coast to the bell. Coasting is a habit and habits show up in chess.',
    'Last ten. Loud ones. Finish the round like it mattered, because it did.',
    'That is nearly it. Do not think about the position yet. Not yet.',
    'Jab, jab, cross. Again. Find a tempo you can hold for the whole round.',
    'No bag? Shadowbox. Throw at the air like it just pinned your queen.',
    'Double up the jab, then the cross. Breathe out on every punch.',
    'Work in bursts — ten hard seconds on the bag, then move your feet and breathe.',
    'Hands back to your chin after every combination. Guard first, flashy later.',
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

// ─── Bout scoring (v3) ───────────────────────────────────────────────────────
// A finished bout earns leaderboard points, the same currency the workout
// pays in. Two things are actually earned in a bout and both are in the
// formula:
//
//   1. THE CHESS RESULT — the headline, pays the most.
//   2. WHO YOU BEAT — Rookie's level, as a multiplier.
//
// (2) is the v3 fix. v2 paid a flat rate, so KO'ing level-1 Rookie was worth
// exactly as much as KO'ing level-10 — farmable forever on the easiest
// setting. Now the level is the multiplier and sandbagging pays less than
// fighting straight.
//
// "Rounds survived" is no longer a per-round payout: with no physical
// tracking (no camera, no tap pad) a boxing round measures nothing but
// attendance, and attendance shouldn't out-earn the board. It survives as one
// flat WENT THE DISTANCE bonus for reaching the final bell with every boxing
// round behind you.
//
// Only the ranked format pays at all (see RANKED_FORMAT + the daily cap).
// The API re-computes all of this server-side from the reported result — the
// client never sends a point total (see app/api/bout/finish).

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

/** Flat bonus for going the distance — every boxing round finished. */
export const BOUT_DISTANCE_BONUS = 50;

/**
 * Rookie's level as a payout multiplier: level 1 pays ×0.7, level 10 pays
 * ×1.6. Linear on purpose — a beginner can read "harder Rookie is worth more"
 * off the number without a curve to explain.
 */
export function levelMultiplier(level: number): number {
  const lvl = Math.max(1, Math.min(10, Math.trunc(level) || 1));
  return 0.6 + lvl * 0.1;
}

export interface BoutScoreInput {
  outcome: BoutOutcome;
  /** Boxing rounds the user reached the bell in. */
  roundsSurvived: number;
  /** Rookie's difficulty level, 1-10. */
  level: number;
  /** Boxing rounds on this card — roundsSurvived is clamped to it. */
  boxingRounds: number;
  /** Unranked formats and bouts over the daily cap are exhibition: 0 points. */
  ranked?: boolean;
  /** Judges' cards, one per boxing round (0-100). Empty when the camera game is off. */
  userCards?: readonly number[];
}

/**
 * Leaderboard points for one finished bout. Deterministic and pure so the
 * client preview and the server's stored value can never disagree.
 */
export interface BoutPointsBreakdown {
  /** Chess side: base + outcome, scaled by Rookie's level, plus the distance bonus. */
  chess: number;
  /** Boxing side: half a point per judges' card point (0 when the camera game was off). */
  boxing: number;
  total: number;
}

/** The payout split the way the result card shows it: chess · boxing · total. */
export function boutPointsBreakdown({
  outcome,
  roundsSurvived,
  level,
  boxingRounds,
  ranked = true,
  userCards = [],
}: BoutScoreInput): BoutPointsBreakdown {
  if (!ranked) return { chess: 0, boxing: 0, total: 0 };
  const maxRounds = Math.max(0, Math.trunc(boxingRounds));
  const rounds = Math.max(0, Math.min(maxRounds, Math.trunc(roundsSurvived)));
  const wentTheDistance = maxRounds > 0 && rounds >= maxRounds;
  const scored = (BOUT_BASE_POINTS + (BOUT_OUTCOME_POINTS[outcome] ?? 0)) * levelMultiplier(level);
  const chess = Math.max(0, Math.round(scored) + (wentTheDistance ? BOUT_DISTANCE_BONUS : 0));
  // Boxing bonus: half a point per card point, max 50/round — about the same
  // weight as the distance bonus, so a big night on the pads is felt but a
  // checkmate still pays more.
  const boxing = Math.round(sumCards(userCards.slice(0, maxRounds)) * 0.5);
  return { chess, boxing, total: chess + boxing };
}

export function boutPoints(input: BoutScoreInput): number {
  return boutPointsBreakdown(input).total;
}

/** 'win' | 'loss' | 'draw' — the fight-record bucket for an outcome. */
export function boutResult(outcome: BoutOutcome): 'win' | 'loss' | 'draw' {
  if (outcome === 'ko_win' || outcome === 'decision_win') return 'win';
  if (outcome === 'draw') return 'draw';
  return 'loss';
}
