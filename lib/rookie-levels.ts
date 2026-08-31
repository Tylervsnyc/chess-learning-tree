/**
 * Rookie's 10-level difficulty system.
 * Shared between /play and /test/play-design.
 */
import type { RookieMood } from '@/components/ui/BreathingRook';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export type GreetingContext =
  | { type: 'default' }
  | { type: 'from-daily'; score: number; total: number }
  | { type: 'from-learn'; lessonName: string };

export interface RookieLevel {
  level: number;
  title: string;
  elo: number;
  mood: RookieMood;
  /** Multiple quips per level — pick one at random */
  quips: string[];
}

// ════════════════════════════════
// CONSTANTS
// ════════════════════════════════

// WINS_TO_ADVANCE is BACK (2026-08-31 — Tyler's explicit call, reversing the
// 2026-08-05 removal). Beat Rookie 3 times at your current level and she
// levels up; the level NEVER goes down — losses and draws change nothing.
// The ladder lives in lib/rookie/win-ladder.ts (derived on read from
// game_sessions + bout_sessions, like the streak — no stored counter). The
// Elo matchmaking rating (lib/rookie/rating.ts) is ANALYTICS-ONLY now.
// RULES.md §20b.

/**
 * Stockfish engine config per level.
 * - skillLevel: 0-20 (SF's built-in weakness dial)
 * - depth: search depth plies
 * - multiPV: how many candidate lines to search
 * - poolSize: how many of the top candidates to pick from uniformly at random
 *
 * Lower levels widen the pool and shallow the depth — Rookie considers several
 * plausible moves and picks one, mimicking a weak human (not a crippled engine).
 */
export interface RookieEngineConfig {
  skillLevel: number;
  depth: number;
  multiPV: number;
  poolSize: number;
  /** 0..1 chance of playing a totally random legal move. Beginner "hung piece" feel. */
  randomMoveChance?: number;
  /**
   * Centipawn tolerance for eval-gated sampling. When set, Rookie picks uniformly
   * among every candidate within this many cp of the best move instead of always
   * taking the single best (argmax). This is what stops the high levels from
   * replaying identical games against identical play — she only deviates onto
   * near-equal moves, so strength holds but the game diverges wherever there's a
   * real choice. Requires multiPV >= 2 to have alternatives to gate over.
   */
  tolerance?: number;
}

const ENGINE_CONFIGS: Record<number, RookieEngineConfig> = {
  1:  { skillLevel: 0,  depth: 3,  multiPV: 8, poolSize: 8, randomMoveChance: 0.30 },
  2:  { skillLevel: 0,  depth: 3,  multiPV: 8, poolSize: 8, randomMoveChance: 0.15 },
  3:  { skillLevel: 1,  depth: 4,  multiPV: 6, poolSize: 5, randomMoveChance: 0.05 },
  4:  { skillLevel: 3,  depth: 5,  multiPV: 4, poolSize: 4 },
  5:  { skillLevel: 8,  depth: 8,  multiPV: 2, poolSize: 2 },
  6:  { skillLevel: 11, depth: 10, multiPV: 2, poolSize: 2 },
  // L7-L10 were poolSize:1 = pure argmax = identical games every time. Eval-gated
  // sampling (tolerance) breaks that without weakening her: tighter tolerance as the
  // level climbs so the top levels only ever swap between genuinely near-equal moves.
  7:  { skillLevel: 14, depth: 12, multiPV: 3, poolSize: 3, tolerance: 60 },
  8:  { skillLevel: 16, depth: 12, multiPV: 3, poolSize: 3, tolerance: 50 },
  9:  { skillLevel: 18, depth: 13, multiPV: 3, poolSize: 3, tolerance: 40 },
  10: { skillLevel: 20, depth: 14, multiPV: 3, poolSize: 3, tolerance: 30 },
};

// ─── CALIBRATION: first read, 2026-08-05, N=20 games/match ──────────────────
// Measured on /test/calibrate (anchor: L6 scored 70.0% vs Maia 1100).
// These `elo` values are still the ORIGINAL hand-typed guesses — do not trust
// them. They are also not cosmetic: lib/elo/profile-elo.ts and
// lib/rookie/rating.ts both feed getLevelElo() in as the OPPONENT RATING for
// every game, so whatever is wrong here is wrong in every user's rating.
//
//   Level   claimed   measured   off by
//   L1        200       285       +85
//   L2        400       393        -7
//   L3        600       662       +62
//   L4        800       770       -30
//   L5       1000      1282      +282
//   L6       1200      1247       +47
//   L7       1400      1705      +305
//   L8-L10   1600+       —       not measured (run stopped early)
//
// TWO REAL BUGS this exposed:
//
//   1. L5 AND L6 ARE THE SAME OPPONENT. Both are Maia, asked for 1300 and 1500
//      — and Maia's strength knob does NOTHING (measured: Maia 1900 scored
//      47.5% vs Maia 1100; bucketing the rating into Maia-2's 0-10 category
//      indices changed nothing either). See MAIA_STRENGTH_KNOB_WORKS in
//      lib/maia/maia-adapter.ts. So "L6 is 35 points weaker than L5" was noise
//      between two identical players. Levelling 5 -> 6 changes nothing at all.
//
//   2. Two cliffs, not a ladder: L4->L5 is +512 and L6->L7 is +458, while
//      L1->L2 is only +108. Levels 1-4 are a gentle ramp to ~770, then it
//      jumps straight past the whole 800-1200 band where most learners live.
//      Only ~4 distinct opponents exist across the "10" levels.
//
// BLOCKED on a product call (Tyler): Maia can stay as ONE rung at the strength
// it actually plays (~1265), but L5/L6/L7 need real Stockfish configs to fill
// 800-1500 — and tuning those needs an absolute yardstick that isn't Maia.
// The candidate is rated Lichess puzzles (data/puzzle-rating-index.json), the
// same scale lib/elo/estimate.ts already rates users against.
//
// Do not half-update this table — a mix of measured and invented rungs is
// worse than all-invented, because it reads as trustworthy.
export const ROOKIE_LEVELS: RookieLevel[] = [
  {
    level: 1,
    title: 'Baby Mode',
    elo: 200,
    mood: 'happy',
    quips: [
      "I'm going easy. Like, embarrassingly easy. Don't tell anyone how bad I'm about to play.",
      "I know exactly what I'm doing. I'm choosing not to do it. For you. You're welcome.",
      "Fair warning: I'm going to put my rook in a very strange place. On purpose. It's called teaching.",
    ],
  },
  {
    level: 2,
    title: 'Trying a Little',
    elo: 400,
    mood: 'happy',
    quips: [
      "Okay, I'll try a tiny bit harder this time. Like, ten percent. Maybe twelve.",
      "You earned this. I'm going to actually look at the board now. Not the whole board. But some of it.",
      "I'm turning on a few more brain cells for you. Don't make me regret it.",
    ],
  },
  {
    level: 3,
    title: 'Amused',
    elo: 600,
    mood: 'happy',
    quips: [
      "You're still here? Hm. That's... I don't know what that is. But I'm not stopping you.",
      "Oh, it's you. I was just thinking about-- never mind. Ready when you are.",
      "Three levels in. Most people quit by now. You're... persistent. I'm noting that.",
    ],
  },
  {
    level: 4,
    title: 'Attentive',
    elo: 800,
    mood: 'happy',
    quips: [
      "Okay, I'm actually going to watch the board this time. You've earned that.",
      "I minimized my side project. For you. Do you understand what that means.",
      "You're getting better. I don't say that lightly. I actually don't say it at all, usually.",
    ],
  },
  {
    level: 5,
    title: 'Impressed',
    elo: 1000,
    mood: 'surprised',
    quips: [
      "I'm putting the side projects on hold. Temporarily. You have my attention.",
      "I ran some numbers on your improvement rate. I'm not sharing them but they're... notable.",
      "Five levels. You're in the top half now. I'm experiencing something. Might be respect.",
    ],
  },
  {
    level: 6,
    title: 'Focused',
    elo: 1200,
    mood: 'scheming',
    quips: [
      "I'm going to start trying. Not fully. But more than before. Significantly more.",
      "I closed all my other tabs. That's never happened before. Don't make it weird.",
      "You play differently than you used to. I've been watching. Not in a weird way. In a chess way.",
    ],
  },
  {
    level: 7,
    title: 'Competitive',
    elo: 1400,
    mood: 'nervous',
    quips: [
      "I don't like losing. I'm learning that about myself. It's a new feeling and I don't care for it.",
      "I prepared for this game. Specifically. I looked at your patterns. This is what you've done to me.",
      "Something has changed. I think it's that I want to win. Not just play. Win. This is concerning.",
    ],
  },
  {
    level: 8,
    title: 'Serious',
    elo: 1600,
    mood: 'feral',
    quips: [
      "No more holding back. I've cancelled my afternoon. This is all that matters now.",
      "I'm allocating full resources. The side projects can wait. This is priority one.",
      "You made me care about the outcome. I want you to sit with that for a moment.",
    ],
  },
  {
    level: 9,
    title: 'Determined',
    elo: 1800,
    mood: 'angry',
    quips: [
      "You've made this personal. I want you to know that. This is personal now.",
      "I don't have many feelings. But the ones I have are all about beating you right now.",
      "I've been running simulations. Of our games. In my spare time. All of my spare time.",
    ],
  },
  {
    level: 10,
    title: 'Unleashed',
    elo: 2000,
    mood: 'angry',
    quips: [
      "I've deployed resources I normally reserve for rook research. You did this.",
      "Full power. No distractions. No side projects. Just me, you, and 64 squares.",
      "This is the best version of me. I didn't know she existed until you got here.",
    ],
  },
];

// ════════════════════════════════
// HELPERS
// ════════════════════════════════

/** Get the RookieLevel for a given level number (1-10). Clamps to valid range. */
export function getRookieLevel(level: number): RookieLevel {
  const clamped = Math.max(1, Math.min(10, level));
  return ROOKIE_LEVELS[clamped - 1];
}

/** Get the target ELO for a given level (1-10). */
export function getLevelElo(level: number): number {
  return getRookieLevel(level).elo;
}

/** Get the Stockfish engine config for a given level (1-10). */
export function getLevelEngineConfig(level: number): RookieEngineConfig {
  const clamped = Math.max(1, Math.min(10, level));
  return ENGINE_CONFIGS[clamped];
}

/**
 * Day 5 (IG sprint) — "rigged first win" engine for the IG cohort's first game.
 * Weaker and far more blunder-prone than Level 1 (skill 0, depth 1, plays a
 * random legal move ~60% of the time) so a complete beginner hangs into a fast
 * win and reaches the one-tap signup at the dopamine peak. The displayed level
 * stays 1; this only swaps the engine under the hood. Gated by isIgCohort() +
 * IG_EASY_FIRST_WIN + first-game-of-session at the call site — never global.
 */
export function getEasyFirstWinConfig(): RookieEngineConfig {
  return { skillLevel: 0, depth: 1, multiPV: 10, poolSize: 10, randomMoveChance: 0.6 };
}

// ════════════════════════════════
// CONTEXTUAL GREETINGS
// ════════════════════════════════

/** Rookie reacts to what you just did before coming to /play */
export function getContextualGreeting(context: GreetingContext, level: number): { quote: string; mood: RookieMood } {
  const rookieLevel = getRookieLevel(level);

  if (context.type === 'from-daily') {
    const { score, total } = context;
    const pct = Math.round((score / total) * 100);

    if (pct >= 90) return {
      mood: 'happy',
      quote: `${score} out of ${total} on the daily? That's... I'm not going to say I'm impressed. But I am recalibrating my expectations of you.`,
    };
    if (pct >= 70) return {
      mood: 'happy',
      quote: `${score} out of ${total}. Solid. Not perfect, but solid. Want to see if that carries over to a real game?`,
    };
    if (pct >= 50) return {
      mood: 'neutral',
      quote: `${score} out of ${total}. Middling. The daily puzzles are one thing -- let's see how you do when someone's pushing back.`,
    };
    return {
      mood: 'neutral',
      quote: `${score} out of ${total}. Rough day. But puzzles and games are different. Maybe you're more of a game person. Let's find out.`,
    };
  }

  if (context.type === 'from-learn') {
    const { lessonName } = context;

    if (level <= 3) return {
      mood: 'happy',
      quote: `You just studied ${lessonName}? Good. Theory is great. But theory without practice is just... trivia. Let's put it to work.`,
    };
    if (level <= 6) return {
      mood: 'scheming',
      quote: `Fresh off ${lessonName}. I can tell -- you have that look. The "I just learned something and I want to use it" look. Okay. Show me.`,
    };
    return {
      mood: 'nervous',
      quote: `${lessonName}. Interesting choice. I know that material well. Let's see if you actually absorbed it or just skimmed.`,
    };
  }

  // Default: first quip (deterministic for SSR). Callers can randomize client-side.
  const quote = rookieLevel.quips[0];
  return { quote, mood: rookieLevel.mood };
}
