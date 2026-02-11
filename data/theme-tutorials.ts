/**
 * Theme Tutorial Configs — Level 1
 *
 * Each tutorial has a rich intro shown before the first puzzle.
 * Some also include hint cards shown during specific puzzles.
 *
 * Tiers:
 *   quick  — intro only, no hint cards
 *   medium — intro + 1 hint card on puzzle 1
 *   full   — intro + hint cards on puzzles 1 and 2
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ThemeTutorialHint {
  puzzleIndex: number;
  title?: string;
  message: string;
}

export interface ThemeTutorial {
  lessonId: string;
  theme: string;
  tier: 'quick' | 'medium' | 'full';
  intro: { title: string; message: string };
  hints?: ThemeTutorialHint[];
}

// ---------------------------------------------------------------------------
// Tutorial data
// ---------------------------------------------------------------------------

export const THEME_TUTORIALS: ThemeTutorial[] = [
  // ── Quick (intro only) ─────────────────────────────────────────────────

  {
    lessonId: '1.2.1',
    theme: 'backRankMate',
    tier: 'quick',
    intro: {
      title: 'Back Rank Mate',
      message:
        'The king is trapped behind its own pawns on the back rank. A rook or queen can deliver checkmate because the pawns block the king\'s escape. Look for positions where the king has no breathing room!',
    },
  },
  {
    lessonId: '1.2.2',
    theme: 'smotheredMate',
    tier: 'quick',
    intro: {
      title: 'Smothered Mate',
      message:
        'A knight checkmates the king when it\'s completely boxed in by its own pieces. The knight is the only piece that can jump over blockers \u2014 perfect for this sneaky tactic!',
    },
  },
  {
    lessonId: '1.2.3',
    theme: 'arabianMate',
    tier: 'quick',
    intro: {
      title: 'Arabian Mate',
      message:
        'A knight and rook team up to deliver checkmate on the edge of the board. The knight covers the escape squares while the rook delivers the final blow.',
    },
  },
  {
    lessonId: '1.2.4',
    theme: 'hookMate',
    tier: 'quick',
    intro: {
      title: 'Hook Mate',
      message:
        'Similar to Arabian Mate but the knight plays a double role \u2014 it delivers check AND blocks the king\'s escape route. Look for the knight + rook combo near the corner!',
    },
  },
  {
    lessonId: '1.5.1',
    theme: 'hangingPiece',
    tier: 'quick',
    intro: {
      title: 'Hanging Pieces',
      message:
        'A hanging piece is one that\'s left undefended \u2014 free for the taking! Always scan the board for unprotected pieces. If your opponent leaves something hanging, grab it!',
    },
  },
  {
    lessonId: '1.9.1',
    theme: 'rookEndgame',
    tier: 'quick',
    intro: {
      title: 'Rook Endgames',
      message:
        'Welcome to endgames! With fewer pieces on the board, your king becomes a powerful attacker. Activate your king and use your rook to control ranks and files.',
    },
  },
  {
    lessonId: '1.10.3',
    theme: 'promotion',
    tier: 'quick',
    intro: {
      title: 'Pawn Promotion',
      message:
        'When a pawn reaches the 8th rank, it transforms into any piece \u2014 usually a queen! Push your passed pawns forward and protect them on their journey to promotion.',
    },
  },
  {
    lessonId: '1.11.2',
    theme: 'trappedPiece',
    tier: 'quick',
    intro: {
      title: 'Trapped Pieces',
      message:
        'A trapped piece has no safe squares to move to \u2014 it\'s stuck! Look for pieces that are boxed in and find a way to win them. Even a queen can be trapped!',
    },
  },

  // ── Medium (intro + 1 hint) ────────────────────────────────────────────

  {
    lessonId: '1.3.1',
    theme: 'mateIn2',
    tier: 'medium',
    intro: {
      title: 'Mate in Two',
      message:
        'Time to think ahead! In these puzzles, you\'ll deliver checkmate in exactly two moves. Your first move must force the opponent into a position where checkmate is unavoidable.',
    },
    hints: [
      {
        puzzleIndex: 0,
        title: 'Think Ahead!',
        message:
          'What move forces the king into a corner? Your first move should limit the king\'s options \u2014 then deliver the finishing blow!',
      },
    ],
  },
  {
    lessonId: '1.7.1',
    theme: 'skewer',
    tier: 'medium',
    intro: {
      title: 'Skewers',
      message:
        'A skewer attacks a valuable piece in a line, forcing it to move and exposing a piece behind it. It\'s like a backwards pin \u2014 the more valuable piece is in front!',
    },
    hints: [
      {
        puzzleIndex: 0,
        title: 'Find the Line!',
        message:
          'Look for a line (rank, file, or diagonal) where two enemy pieces stand. Attack the more valuable one in front \u2014 win what\'s behind it!',
      },
    ],
  },
  {
    lessonId: '1.11.1',
    theme: 'deflection',
    tier: 'medium',
    intro: {
      title: 'Deflection',
      message:
        'Deflection means luring a key defender away from what it\'s protecting. Force the defender to move, and suddenly its ward is left vulnerable!',
    },
    hints: [
      {
        puzzleIndex: 0,
        title: 'Lure the Defender!',
        message:
          'Which enemy piece is guarding something important? Find a way to force it to move \u2014 then strike what it was protecting!',
      },
    ],
  },

  // ── Full (intro + 2 hints) ─────────────────────────────────────────────

  {
    lessonId: '1.6.1',
    theme: 'fork',
    tier: 'full',
    intro: {
      title: 'Forks',
      message:
        'A fork attacks two (or more!) pieces at once with a single piece. Knights are the most famous forkers because they can jump to unexpected squares. Look for one square that threatens multiple targets!',
    },
    hints: [
      {
        puzzleIndex: 0,
        title: 'Find the Fork!',
        message:
          'Look for one square where your piece attacks TWO enemy pieces at once. Knights, bishops, and even pawns can fork!',
      },
      {
        puzzleIndex: 1,
        title: 'Another Fork!',
        message:
          'Great job! Now find another forking opportunity. Target the most valuable pieces you can \u2014 especially the king and queen!',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

const tutorialsByLesson = new Map<string, ThemeTutorial>(
  THEME_TUTORIALS.map((t) => [t.lessonId, t]),
);

/** Return the tutorial config for a lesson, or undefined if none exists. */
export function getTutorialForLesson(
  lessonId: string,
): ThemeTutorial | undefined {
  return tutorialsByLesson.get(lessonId);
}
