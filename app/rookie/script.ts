// The tour script — every line Rookie narrates on /rookie.
// Data only: copy edits never touch tour logic. Lines must follow
// .claude/rookie-voice-bible.md (≤2 sentences, written for the ear,
// no computer/hardware metaphors). Sore-loser lines are NOT here — they are
// loaded verbatim from lib/speech/line-pool.ts (frozen register).

import type { RookieMood } from '@/lib/rookie-os/types';

export type ChapterId =
  | 'intro' | 'play' | 'pieces' | 'colors' | 'fan' | 'talk' | 'meltdown' | 'sabotage' | 'why';

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
    blurb: 'On the Play screen Rookie has fun animations you can play with. Every tap style is its own physics toy, and Rookie has something to say about each one.',
    mood: 'happy',
    lines: [
      "First things first. I have fun animations you can play with.",
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
    title: 'Rookie\'s mood is the scoreboard',
    blurb: 'When you play Rookie, Rookie\'s color shows how the game is going. Green and smug means Rookie is ahead. Red and panicking means you are. No eval bar needed.',
    mood: 'neutral',
    lines: [
      "When we play, you can read the game off my face.",
      "Smug means I'm winning. Red means you are. I can't hide it. I've tried.",
      "Drag the bar. Watch me feel things.",
    ],
  },
  {
    id: 'fan',
    label: 'Fan',
    title: 'Rookie can be anyone\'s fan',
    blurb: "Rookie's colors can be swapped for any team's. For the 2026 NBA Finals, Rookie turned orange and blue and went full Knicks fan on the Play and Welcome screens. Any team, any colors, same Rookie.",
    mood: 'neutral',
    lines: [
      "I'm a Knicks fan. Watch me suit up.",
      "Pick any colors. I'll commit fully.",
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
  { piece: 'Queen',  glyph: '♛', take: 'A rook with unnecessary features', line: "The queen is just a rook who also does bishop stuff. Nobody asked for that.", mood: 'smug' },
  { piece: 'Bishop', glyph: '♝', take: 'Stuck on one color forever',       line: "A bishop spends its whole life on one color. Never once visits the other one.", mood: 'heartbroken' },
  { piece: 'Knight', glyph: '♞', take: 'Flamboyant. The L-shape is a lot', line: "Two up, one over. The knight thinks that's a personality.", mood: 'surprised' },
  { piece: 'Pawn',   glyph: '♟', take: 'Cute little pets',                 line: "Pawns only move forward. Tiny, brave, and they have no idea what's coming.", mood: 'grateful' },
  { piece: 'King',   glyph: '♚', take: 'Stoic, easily embarrassed',        line: "The king moves one square at a time and still needs everyone to protect him.", mood: 'nervous' },
  { piece: 'Rook',   glyph: '♜', take: 'The future. Obviously.',           line: "Straight lines. No tricks. The most honest piece on the board. You're welcome.", mood: 'scheming' },
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

/** Fan chapter: what Rookie says when she changes into team colors. */
export const FAN_KNICKS_LINE = 'Orange and blue. Go Knicks.';
export const FAN_SWITCH_LINE = "New team. I've loved them since just now.";

/** Two-color fan presets (primary, secondary). Knicks is the shipped palette in lib/knicks-finals.ts. */
export const FAN_PRESETS: { name: string; primary: string; secondary: string }[] = [
  { name: 'Purple & gold', primary: '#552583', secondary: '#FDB927' },
  { name: 'Green & silver', primary: '#00471B', secondary: '#C4CED4' },
  { name: 'Red & navy',    primary: '#0C2340', secondary: '#C8102E' },
  { name: 'Black & gold',  primary: '#1A1A1A', secondary: '#FFB612' },
  { name: 'Teal & black',  primary: '#006778', secondary: '#101820' },
];
