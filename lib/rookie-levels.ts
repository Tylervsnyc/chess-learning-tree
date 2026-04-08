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

export const WINS_TO_ADVANCE = 3;

/** Minimax engine handles levels at or below this ELO threshold */
export const MINIMAX_ELO_CEILING = 400;

export const ROOKIE_LEVELS: RookieLevel[] = [
  {
    level: 1,
    title: 'Distracted',
    elo: 200,
    mood: 'neutral',
    quips: [
      "Oh, you want to play? Sure. Give me a second, I'm in the middle of something.",
      "A game? Now? I was just-- fine. Fine. Let me save my work.",
      "You caught me at a weird time. But honestly every time is a weird time. Let's go.",
    ],
  },
  {
    level: 2,
    title: 'Multitasking',
    elo: 400,
    mood: 'neutral',
    quips: [
      "I can play you and work on my project at the same time. Rook-related. Don't worry about it.",
      "Back again. I'm going to keep one eye on my research while we play. You won't notice.",
      "Sure, let's play. I need a break from this rook mobility study anyway. It's getting intense.",
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

/**
 * Should we use the minimax engine for this level?
 * Levels 1-2 (ELO 200-400) use minimax, levels 3+ use Stockfish.
 */
export function useMinimax(level: number): boolean {
  return getLevelElo(level) <= MINIMAX_ELO_CEILING;
}

/**
 * Map a 10-level number to minimax skill parameter (0-1).
 * Only meaningful for levels 1-2.
 */
export function minimaxSkill(level: number): number {
  if (level <= 1) return 0;
  return 1;
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
