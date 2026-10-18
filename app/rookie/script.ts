// The tour script — every line Rookie narrates on /rookie.
// Data only: copy edits never touch tour logic. Lines must follow
// .claude/rookie-voice-bible.md (≤2 sentences, written for the ear,
// no computer/hardware metaphors). Sore-loser lines are NOT here — they are
// loaded verbatim from lib/speech/line-pool.ts (frozen register).

import type { RookieMood } from '@/lib/rookie-os/types';

export type ChapterId =
  | 'intro' | 'play' | 'pieces' | 'colors' | 'eval' | 'talk' | 'meltdown' | 'sabotage' | 'why';

export interface Chapter {
  id: ChapterId;
  /** Short label for the progress dots */
  label: string;
  title: string;
  /** One plain sentence for the reader (not spoken) */
  blurb: string;
  /** Stage mood when the chapter opens */
  mood: RookieMood;
  /** Rookie's narration, spoken in order when the chapter opens */
  lines: string[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    label: 'Hi',
    title: 'Meet Rookie',
    blurb: 'The chess coach who is unreasonably invested in your games. Rookie is a rook, and Rookie sees everything like one.',
    mood: 'neutral',
    lines: [
      "Hi. I'm Rookie. I'm a rook.",
      "I see the whole board in straight lines. It's the correct way to see it.",
      "Let me show you around.",
    ],
  },
  {
    id: 'play',
    label: 'Play',
    title: 'Play with Rookie',
    blurb: 'On the Play screen you can poke Rookie. Every tap style is its own physics toy, and Rookie has something to say about each one.',
    mood: 'happy',
    lines: [
      "First things first. You can poke me.",
      "Go ahead. Pick one. I'll pretend to mind.",
    ],
  },
  {
    id: 'pieces',
    label: 'Pieces',
    title: 'The world, according to a rook',
    blurb: 'Rookie has a strong opinion about every piece, and every opinion comes from being a rook.',
    mood: 'scheming',
    lines: [
      "Everything I know about chess, I know as a rook.",
      "Tap a piece. I have opinions.",
    ],
  },
  {
    id: 'colors',
    label: 'Color',
    title: 'Rookie changes color like an octopus',
    blurb: 'Rookie is 22 blocks of color. Every mood re-tints all of them, so you can read how Rookie feels from across the room.',
    mood: 'excited',
    lines: [
      "I change color like an octopus. You'll always know how I feel.",
      "Tap a mood. Try not to judge.",
    ],
  },
  {
    id: 'eval',
    label: 'Eval',
    title: "Rookie's color is the evaluation",
    blurb: "During a game, the engine evaluation drives Rookie's mood. You can read the position from Rookie without looking at an eval bar.",
    mood: 'neutral',
    lines: [
      "During a game, my color is the score.",
      "Drag the bar. Watch me feel things.",
    ],
  },
  {
    id: 'talk',
    label: 'Voice',
    title: 'Rookie talks with every block',
    blurb: "Rookie is fully voiced. Rookie's blocks pulse with every syllable and keep the mood color while Rookie talks.",
    mood: 'happy',
    lines: [
      "When I talk, I light up on every syllable.",
      "Same words, different mood. Try it.",
    ],
  },
  {
    id: 'meltdown',
    label: 'Losing',
    title: 'When Rookie is losing',
    blurb: 'Rookie is a spectacular sore loser. When the game turns, Rookie goes red and sets off an alarm.',
    mood: 'nervous',
    lines: [
      "Now. When I'm losing.",
      "I handle it with grace.",
    ],
  },
  {
    id: 'sabotage',
    label: 'Sabotage',
    title: 'And when Rookie is losing badly',
    blurb: 'Down big, Rookie tries to sabotage the player with distractions and sound effects. This is the most-loved thing Rookie does.',
    mood: 'panicking',
    lines: [
      "And when I'm losing badly, I fight dirty.",
      "Press one. I'm not proud of these. I'm a little proud.",
    ],
  },
  {
    id: 'why',
    label: 'Why',
    title: 'Why Rookie',
    blurb: 'A mascot with a point of view, a voice, a color language tied to the game, and a sense of humor about losing.',
    mood: 'grateful',
    lines: [
      "So that's me. I'm on your side. Loudly.",
      "Mostly.",
    ],
  },
];

/** Piece opinions — taken from the voice bible's Piece Personalities table. */
export const PIECE_OPINIONS: { piece: string; glyph: string; take: string; line: string; mood: RookieMood }[] = [
  { piece: 'Queen',  glyph: '♛', take: 'A rook with unnecessary features', line: "Everyone loves the queen. I think she's showing off.", mood: 'smug' },
  { piece: 'Bishop', glyph: '♝', take: 'Stuck on one color forever',       line: "Your bishops will never meet. I think about it too much.", mood: 'heartbroken' },
  { piece: 'Knight', glyph: '♞', take: 'Flamboyant. The L-shape is a lot', line: "Two up, one over. Every time. Why.", mood: 'surprised' },
  { piece: 'Pawn',   glyph: '♟', take: 'Cute little pets',                 line: "From pawn to that. I could cry.", mood: 'grateful' },
  { piece: 'King',   glyph: '♚', take: 'Stoic, easily embarrassed',        line: "My king just looked at me. Never good.", mood: 'nervous' },
  { piece: 'Rook',   glyph: '♜', take: 'The future. Obviously.',           line: "Open files are just the beginning.", mood: 'scheming' },
];

/** Color descriptions — from MOOD_TINTS in components/ui/BreathingRook.tsx. */
export const MOOD_COLORS: Record<string, string> = {
  neutral: 'Default rainbow',
  happy: 'Warm green glow',
  nervous: 'Washed-out grey blue',
  angry: 'Deep red',
  smug: 'Rich purple',
  surprised: 'Electric cyan',
  embarrassed: 'Powers down',
  excited: 'Golden overdrive',
  defeated: 'Dark husk',
  scheming: 'Sinister green',
  panicking: 'Red siren',
  zen: 'Soft pastel',
  feral: 'Rainbow strobe',
  heartbroken: 'Deep indigo',
};

/** One line spoken in several moods for the talking demo. */
export const TALK_LINE = "I'm rooting for you. It's honestly a lot.";
export const TALK_MOODS: RookieMood[] = ['happy', 'smug', 'angry', 'excited', 'heartbroken'];

/** Canned eval curve for "autoplay a game" (Rookie's eval in pawns, move by move). */
export const AUTOPLAY_CURVE = [0, 0.3, 0.8, 1.6, 2.4, 3.4, 2.2, 0.9, 0.2, -0.7, -1.8, -2.6, -3.6, -5.2];
