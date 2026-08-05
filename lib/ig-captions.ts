/**
 * Instagram caption copy — ONE source of truth.
 *
 * Every hook / guess-line / CTA / hashtag the daily puzzle reels use lives
 * here and nowhere else. Imported by:
 *   - scripts/render-daily-video.ts   (writes the caption at render time)
 *   - scripts/ig-recaption-queue.ts   (rewrites captions on unposted queue items)
 *
 * Keep the pools BIG — small pools made every caption read identical across
 * the week (Tyler flagged it 2026-08-04). See RULES.md §44 "Caption Format".
 */

import { hookForPuzzle } from './ig-puzzle-insight';

export const THEME_HOOKS: Record<string, string[]> = {
  mateIn1: [
    'Checkmate in ONE move!',
    'Can you spot the mate?',
    'One move ends it. Which one?',
    'Mate in 1 — faster than your coffee order.',
    'The game is over in one move. See it?',
  ],
  mateIn2: [
    'Checkmate in 2 — can you see it?',
    'Find the forced mate in 2!',
    'Two moves. Zero escapes.',
    'Two moves and the king has nowhere left.',
    'Mate in 2 — the setup is the hard part.',
  ],
  mateIn3: [
    'Checkmate in 3 moves!',
    'This mate is BEAUTIFUL',
    'Three moves, all forced. Find the path.',
    'A mate in 3 with a gorgeous finish.',
    'Three moves. The net closes fast.',
  ],
  backRankMate: [
    'Back rank is WIDE open 👀',
    'Classic back rank mate!',
    'The king built his own prison.',
    'The king is trapped behind his own pawns.',
    'The back rank is weaker than it looks.',
  ],
  smotheredMate: [
    'Smothered mate alert! 🐴',
    'The knight delivers!',
    'Trapped by his own bodyguards.',
    'Only a knight can finish this.',
    'Boxed in by his own army — one knight finishes it.',
  ],
  fork: [
    'Fork incoming! 🍴',
    'Can you find the fork?',
    'One move, two targets.',
    'Somebody is about to lose a piece.',
    'The family fork — nobody is safe.',
  ],
  pin: [
    'This pin wins material!',
    'Pinned and helpless!',
    'That piece only LOOKS like a defender.',
    'The pin is mightier than the sword.',
    'Frozen in place — now punish it.',
  ],
  skewer: [
    'Skewer right through!',
    'X-ray vision required 👀',
    'Attack through one piece into another.',
    'Hit the front piece. Win the one behind it.',
    'A skewer wins what the pin cannot.',
  ],
  sacrifice: [
    'Would you sacrifice here? 🔥',
    'SACRIFICE for the win!',
    'Give up your best piece. Trust me.',
    'The material does not matter. The king does.',
    'This sacrifice looks insane. It is correct.',
  ],
  discoveredAttack: [
    'Discovered attack incoming!',
    'The hidden threat!',
    'Move one piece, unleash another.',
    'The real attacker is hiding behind.',
    'One move, two threats — that is the trick.',
  ],
  kingsideAttack: [
    'Kingside is under siege!',
    'Attack the king!',
    'The pawn shield is cracking.',
    'Storm the castle. The defenders are gone.',
    'All the pieces point at one corner.',
  ],
  queensideAttack: [
    'Queenside pressure!',
    'Can you crack the queenside?',
    'The queenside is collapsing.',
    'The action is on the OTHER wing.',
    'Break through where nobody is looking.',
  ],
  deflection: [
    'Deflect and conquer!',
    'Move that defender!',
    'That piece has two jobs. It can only do one.',
    'Drag the defender away — then strike.',
    'The guard is overloaded. Prove it.',
  ],
  attraction: [
    'Lure them in! 🎯',
    'The perfect trap!',
    'Invite the king forward. He cannot refuse.',
    'Bait, then snap the trap shut.',
    'The capture looks free. It is not.',
  ],
  // Fallback pool for puzzles whose primary theme isn't in the table above.
  generic: [
    'Can you solve this? 🤔',
    'Find the best move!',
    'One move changes everything here.',
    'The winning move is on the board. Find it.',
    'Stop scrolling — solve this first.',
  ],
};

export const DIFFICULT_HOOKS = [
  'DIFFICULT PUZZLE 🔥 Only the sharp eyes get this one.',
  "This one's TOUGH. Think you can crack it?",
  'DIFFICULT PUZZLE. Most people miss it — can you?',
  'DIFFICULT PUZZLE. The first move is the one nobody considers.',
  'Warning: this one has broken strong players.',
  'DIFFICULT PUZZLE. The obvious move loses. Find the real one.',
  "If you solve this without the answer, you're better than most.",
  'DIFFICULT PUZZLE 🔥 Every natural move fails here.',
  'Masters pause on this one. How fast can you see it?',
  'This position looks quiet. It is not.',
  'DIFFICULT PUZZLE. One winning move. Nine tempting ones.',
  'Your engine sees it instantly. Can you?',
];

/** Difficult reels ask for a guess before the reveal — rotate the ask too. */
export const GUESS_LINES = [
  'Drop your guess in the comments BEFORE you watch the solution 👇',
  'Comment your move before the reveal — no peeking 👇',
  'First move only — put it in the comments before you watch 👇',
  'Guess in the comments, then watch to see if you were right 👇',
];

export const CTA_LINES = [
  'Play daily puzzles free → chesspath.app',
  'Solve one like this every day → chesspath.app',
  'More puzzles like this, free → chesspath.app',
  'Train this pattern daily → chesspath.app',
];

/**
 * The themes we build reels around — i.e. exactly the themes we have hooks for.
 * Curation, rendering and captioning all read this one list.
 */
export const VIDEO_THEMES = Object.keys(THEME_HOOKS).filter(t => t !== 'generic');

/** Same list minus mate-in-1, which is never a "difficult" puzzle. */
export const HARD_VIDEO_THEMES = VIDEO_THEMES.filter(t => t !== 'mateIn1');

/** Primary theme for a puzzle = the first one we have a hook for. */
export function primaryTheme(themes: string[]): string {
  return VIDEO_THEMES.find(t => themes.includes(t)) ?? themes[0] ?? 'generic';
}

export const CORE_HASHTAGS = ['#chess', '#chesspuzzle', '#chesspath', '#dailypuzzle'];

export const ROTATING_HASHTAGS = [
  '#chessreels', '#checkmate', '#chessmoves',
  '#learnchess', '#chesstactics', '#chesslife',
];

/** Stable per-puzzle hash so a given puzzle always gets the same caption. */
export function captionHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 7) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function hookFor(theme: string, difficult: boolean, hash: number): string {
  const pool = difficult
    ? DIFFICULT_HOOKS
    : THEME_HOOKS[theme] ?? THEME_HOOKS.generic;
  return pool[hash % pool.length];
}

export function guessLineFor(hash: number): string {
  return GUESS_LINES[(hash >> 3) % GUESS_LINES.length];
}

export function ctaFor(hash: number): string {
  return CTA_LINES[(hash >> 5) % CTA_LINES.length];
}

export function hashtagsFor(hash: number): string {
  const start = hash % ROTATING_HASHTAGS.length;
  const picked = ROTATING_HASHTAGS.slice(start, start + 2);
  return [...CORE_HASHTAGS, ...picked].join(' ');
}

export interface CaptionInput {
  puzzleId: string;
  rating: number;
  theme: string;
  quip: string;
  difficult: boolean;
  /** Puzzle FEN + raw Lichess moves. Supply these and a difficult reel opens
   *  with a line derived from the actual position instead of generic hype. */
  fen?: string;
  rawMoves?: string[];
}

/**
 * The hook for a reel. Difficult reels prefer a position-derived insight
 * (lib/ig-puzzle-insight.ts) and only fall back to the generic DIFFICULT_HOOKS
 * pool when the position yields nothing provable.
 */
export function hookForReel(
  { puzzleId, theme, difficult, fen, rawMoves }: CaptionInput,
): string {
  const hash = captionHash(puzzleId);
  if (difficult && fen && rawMoves?.length) {
    const insight = hookForPuzzle(fen, rawMoves, hash);
    if (insight) return insight;
  }
  return hookFor(theme, difficult, hash);
}

/** The canonical caption. Deterministic in puzzleId — same puzzle, same text. */
export function generateCaption(input: CaptionInput): string {
  const { puzzleId, rating, quip, difficult } = input;
  const hash = captionHash(puzzleId);
  const hook = hookForReel(input);
  const guessLine = difficult ? `\n${guessLineFor(hash)}\n` : '';

  return `${hook}
${guessLine}
Rating: ${rating} ⭐
"${quip}"

${ctaFor(hash)}

${hashtagsFor(hash)}`;
}
