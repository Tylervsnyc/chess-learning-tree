import type { AchievementDef } from './types';

/**
 * The achievement catalog (Phase 1 — Chess Boxing).
 *
 * Copy lives in code, not the DB (same pattern as the quip pool). Every line
 * is Rookie: short, warm, over-invested, never cruel about the player — the
 * roast targets the situation. Voice rules: .claude/rookie-voice-bible.md.
 *
 * IDs are stable forever — they're stored in user_achievements. Add new
 * achievements freely; never rename or reuse an id.
 */
export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  // ── Bout ──────────────────────────────────────────────────────────────────
  {
    id: 'bout-first-blood',
    category: 'bout',
    name: 'First Blood',
    description: "Your first win. I'm framing this. I already framed it.",
    icon: '🥊',
  },
  {
    id: 'bout-ko-artist',
    category: 'bout',
    name: 'KO Artist',
    description: 'Checkmate is just a KO where the referee is math.',
    icon: '💥',
    thresholds: [1, 10, 50, 200],
  },
  {
    id: 'bout-went-the-distance',
    category: 'bout',
    name: 'Went the Distance',
    description: 'Every round. Every bell. Somewhere a training montage is playing about you.',
    icon: '🔔',
  },
  {
    id: 'bout-judges-favorite',
    category: 'bout',
    name: "Judges' Favorite",
    description: "You didn't knock me out, you just quietly took all my pawns. Colder, honestly.",
    icon: '📋',
    thresholds: [1, 10, 50],
  },
  {
    id: 'bout-hometown-decision',
    category: 'bout',
    name: 'Hometown Decision',
    description: 'Dead even and they gave it to you. The crowd loves you. I demand an inquiry.',
    icon: '🏟️',
  },
  {
    id: 'bout-meltdown-button',
    category: 'bout',
    name: 'The Meltdown Button',
    description: 'I was WINNING. I want that recorded: I was winning, and this still happened.',
    icon: '🌋',
  },
  {
    id: 'bout-buzzer-beater',
    category: 'bout',
    name: 'Buzzer Beater',
    description:
      'Under ten seconds left and you found mate. I need to sit down. I am sitting down. I need to sit down more.',
    icon: '⏱️',
  },
  {
    id: 'bout-and-still',
    category: 'bout',
    name: 'And STILL Champion',
    description: "Five Fight Nights, five wins. Defend the belt or I'm taking it back.",
    icon: '👑',
  },
  {
    id: 'bout-championship-rounds',
    category: 'bout',
    name: 'Championship Rounds',
    description: 'Thirty-three minutes of chess boxing. Your cardio is now a chess piece.',
    icon: '🏆',
  },
  {
    id: 'bout-up-the-ladder',
    category: 'bout',
    name: 'Up the Ladder',
    description: 'I stopped going easy on you several levels ago. This is concerning.',
    icon: '🪜',
    levelTiered: true,
  },
  {
    id: 'bout-sparring-partner',
    category: 'bout',
    name: 'Sparring Partner',
    description:
      "Ten exhibition bouts. No stakes, all heart. That's either love of the game or fear of Fight Night.",
    icon: '🤝',
    thresholds: [10],
  },

  // ── Puzzles ───────────────────────────────────────────────────────────────
  {
    id: 'puzzle-grinder',
    category: 'puzzle',
    name: 'Puzzle Grinder',
    description: 'Your pattern recognition is now legally a superpower.',
    icon: '🧩',
    thresholds: [100, 1000, 5000, 10000],
  },
  {
    id: 'puzzle-combo-meal',
    category: 'puzzle',
    name: 'Combo Meal',
    description: 'Eight in a row. The multiplier maxed out. The multiplier has never been more proud.',
    icon: '🍔',
  },
  {
    id: 'puzzle-flawless',
    category: 'puzzle',
    name: 'Flawless',
    description:
      "A full flawless session. I checked the math twice because frankly I didn't believe the math.",
    icon: '💎',
    thresholds: [1, 2, 3, 4], // tier = longest flawless duration band (8/16/24/32 min)
  },

  // ── Training ──────────────────────────────────────────────────────────────
  {
    id: 'training-fired-up',
    category: 'training',
    name: 'Fired Up',
    description:
      'Eighty punches, one round. Your next chess round is legally required to be 25% better. House rules.',
    icon: '🔥',
  },
  {
    id: 'training-thousand-fists',
    category: 'training',
    name: 'Thousand Fists',
    description: "At some point this stopped being a chess app and I didn't stop you.",
    icon: '👊',
    thresholds: [1000, 10000, 100000],
  },
  {
    id: 'training-new-belt-day',
    category: 'training',
    name: 'New Belt Day',
    description:
      'Another personal best. Your old best is in the locker room questioning its life choices.',
    icon: '📈',
    thresholds: [5, 25, 100],
  },
  {
    id: 'training-round-of-your-life',
    category: 'training',
    name: 'Round of Your Life',
    description:
      "Five hundred points in one round. I'd review the tape but honestly it would just embarrass the tape.",
    icon: '⚡',
  },
  {
    id: 'training-double-shift',
    category: 'training',
    name: 'Double Shift',
    description: 'Two full sessions in one day. The gym has a cot in the back if it comes to that.',
    icon: '🕐',
  },

  // ── Dedication ────────────────────────────────────────────────────────────
  {
    id: 'dedication-the-regular',
    category: 'dedication',
    name: 'The Regular',
    description:
      "I see you more than I see my own engine. I mean that warmly and also I'm worried about both of us.",
    icon: '🔥',
    thresholds: [3, 7, 30, 100, 365],
  },
  {
    id: 'dedication-comeback-kid',
    category: 'dedication',
    name: 'Comeback Kid',
    description:
      'You came back. I kept the campfire going. I never doubted you. I doubted you a medium amount.',
    icon: '🏕️',
  },
  {
    id: 'dedication-night-shift',
    category: 'dedication',
    name: 'Night Shift',
    description: "It's the middle of the night and you chose chess boxing. Correct choice. Go to bed.",
    icon: '🌙',
  },

  // ── Shame (secret until earned — the Dungeon Crawler Carl specialty) ──────
  {
    id: 'shame-glass-jaw',
    category: 'shame',
    name: 'Glass Jaw',
    description:
      "KO'd before the gloves even came on. In boxing they'd call that a puncher's chance. I had one. Sorry. Not that sorry.",
    icon: '🫙',
    secret: true,
  },
  {
    id: 'shame-flagged',
    category: 'shame',
    name: 'Flagged',
    description: 'You had all that time. You spent it like a lottery winner. The clock says hi.',
    icon: '🚩',
    secret: true,
  },
  {
    id: 'shame-three-strikes',
    category: 'shame',
    name: 'Three Strikes',
    description:
      "Struck out in the opening segment. The puzzles started a group chat about you. I'm in it.",
    icon: '❌',
    secret: true,
  },
  {
    id: 'shame-full-carlsberg',
    category: 'shame',
    name: 'The Full Carlsberg',
    description:
      "Five losses in one day and you kept getting back up. That's the most boxer thing I've ever seen. Medal. Now go drink water.",
    icon: '🥤',
    secret: true,
  },
];

const BY_ID = new Map(ACHIEVEMENT_CATALOG.map((d) => [d.id, d]));

export function getAchievementDef(id: string): AchievementDef | undefined {
  return BY_ID.get(id);
}
