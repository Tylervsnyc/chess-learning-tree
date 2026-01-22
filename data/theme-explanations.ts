// Theme explanations with real puzzle positions and highlights
// Used by ThemeHelpModal and test-theme-help page

export interface ThemeExplanation {
  name: string;
  description: string;
  keyPoints: string[];
  exampleFen: string;
  exampleDescription: string;
  toMove: string;
  arrows: [string, string, string][]; // [fromSquare, toSquare, color]
  highlights: Record<string, { backgroundColor: string }>;
}

export const THEME_EXPLANATIONS: Record<string, ThemeExplanation> = {
  fork: {
    name: 'Fork',
    description: 'A fork is when one piece attacks two or more enemy pieces at the same time. The opponent can only save one piece, so you win material.',
    keyPoints: [
      'Knights are the best forking pieces because they can\'t be blocked',
      'Look for squares where your piece attacks multiple targets',
      'The king is often a good fork target since it must move',
    ],
    // Knight on d7 forks king on f8 and rook on b8
    exampleFen: '1r3k2/3N4/8/8/8/8/8/4K3 w - - 0 1',
    exampleDescription: 'The knight on d7 forks the black king on f8 and the rook on b8. Black must move the king, and White captures the rook!',
    toMove: 'White just played Nd7+',
    arrows: [],
    highlights: {
      'd7': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Forking knight
      'f8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // King (target)
      'b8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Rook (target)
    },
  },
  knightFork: {
    name: 'Knight Fork',
    description: 'Knights are the best forking pieces because they jump over other pieces and cannot be blocked. The "family fork" attacks king, queen, AND rook!',
    keyPoints: [
      'Knights move in an "L" shape',
      'Look for king + queen or king + rook combinations',
      'The family fork attacks king, queen, and rook at once',
    ],
    // Knight on e6 forks king f8, queen d8, rook c7
    exampleFen: '3q1k2/2r5/4N3/8/8/8/8/4K3 w - - 0 1',
    exampleDescription: 'White\'s knight on e6 forks the king on f8, queen on d8, AND rook on c7! This "family fork" wins the queen.',
    toMove: 'White just played Ne6+',
    arrows: [],
    highlights: {
      'e6': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Forking knight
      'f8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // King
      'd8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Queen
      'c7': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Rook
    },
  },
  pin: {
    name: 'Pin',
    description: 'A pin is when a piece attacks an enemy piece that cannot move (or shouldn\'t move) because it would expose a more valuable piece behind it.',
    keyPoints: [
      'Absolute pin: piece behind is the king - illegal to move!',
      'Relative pin: moving loses material but is legal',
      'Bishops, rooks, and queens create pins along lines',
    ],
    // Simple clean pin: Bishop pins knight to king along diagonal
    exampleFen: '4k3/8/2n5/1B6/8/8/8/4K3 w - - 0 1',
    exampleDescription: 'The white bishop on b5 pins the black knight on c6 to the king on e8. The pin runs along the diagonal b5-c6-d7-e8. The knight cannot legally move!',
    toMove: 'Black\'s knight is pinned',
    arrows: [],
    highlights: {
      'b5': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },   // Pinning bishop
      'c6': { backgroundColor: 'rgba(255, 170, 0, 0.6)' }, // Pinned knight
      'e8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },   // King (pin target)
    },
  },
  skewer: {
    name: 'Skewer',
    description: 'A skewer is like a reverse pin. You attack a valuable piece, and when it moves away, you capture a less valuable piece behind it.',
    keyPoints: [
      'The MORE valuable piece is in front (opposite of a pin)',
      'King + Queen lineups are classic skewer targets',
      'Often happens in endgames with rooks',
    ],
    // Bishop skewers king on e5, winning queen on h8
    exampleFen: '7q/8/8/4k3/8/8/1B6/7K w - - 0 1',
    exampleDescription: 'White plays Be5+! The bishop checks the king on the long diagonal. When the king moves, White captures the queen on h8!',
    toMove: 'White to move',
    arrows: [],
    highlights: {
      'b2': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },   // Bishop
      'e5': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },   // King (in front)
      'h8': { backgroundColor: 'rgba(255, 170, 0, 0.5)' }, // Queen (behind)
    },
  },
  discoveredAttack: {
    name: 'Discovered Attack',
    description: 'Move one piece to reveal an attack from another piece behind it. The moving piece can ALSO create a threat!',
    keyPoints: [
      'The moving piece can attack something too (double attack)',
      'Discovered CHECK is extremely powerful',
      'Look for your pieces lined up with enemy targets',
    ],
    // Knight on d4 blocks queen a1's diagonal to h8. Knight moves and discovers check!
    exampleFen: '7k/8/2r5/8/3N4/8/8/Q6K w - - 0 1',
    exampleDescription: 'The knight on d4 blocks the queen\'s diagonal to h8. White plays Nxc6! - capturing the rook AND discovering check on the king from the queen. Double attack!',
    toMove: 'White to move',
    arrows: [],
    highlights: {
      'd4': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Moving piece (knight)
      'a1': { backgroundColor: 'rgba(255, 255, 0, 0.5)' }, // Discovering piece (queen)
      'h8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // King (discovered check target)
      'c6': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Rook (knight's target)
    },
  },
  backRankMate: {
    name: 'Back Rank Mate',
    description: 'A rook or queen checkmates a king trapped on the back rank by its own pawns. The king has nowhere to escape!',
    keyPoints: [
      'Watch for kings with no escape squares',
      'Create "luft" (pawn move like h3) to give your king air',
      'Heavy pieces on open files target the back rank',
    ],
    // Classic back rank mate
    exampleFen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    exampleDescription: 'White plays Ra8#! The black king is trapped by its own pawns on f7, g7, h7. Checkmate!',
    toMove: 'White to move',
    arrows: [
      ['a1', 'a8', 'rgba(255, 0, 0, 0.8)'],  // Rook delivers mate
    ],
    highlights: {
      'a1': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },
      'a8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Mating square
      'g8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Trapped king
      'f7': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocking pawn
      'g7': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocking pawn
      'h7': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocking pawn
    },
  },
  smotheredMate: {
    name: 'Smothered Mate',
    description: 'A knight checkmates a king completely surrounded by its own pieces. Only a knight can do this because it jumps!',
    keyPoints: [
      'Only a knight can deliver smothered mate',
      'Often requires a queen sacrifice to force it',
      'Classic: Qg8+! Rxg8, Nf7# (Philidor\'s Legacy)',
    ],
    // Knight on f7 delivers smothered mate - king h8 surrounded by rook g8 and pawns
    exampleFen: '6rk/5Npp/8/8/8/8/8/6K1 b - - 0 1',
    exampleDescription: 'The knight on f7 delivers checkmate! The king on h8 is smothered by its own rook on g8 and pawns on g7, h7. The knight can\'t be captured!',
    toMove: 'Checkmate!',
    arrows: [],
    highlights: {
      'f7': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Mating knight
      'h8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Smothered king
      'g8': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocking rook
      'g7': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocking pawn
      'h7': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocking pawn
    },
  },
  mateIn1: {
    name: 'Mate in 1',
    description: 'Find the one move that delivers checkmate! The king must be in check with no escape, no block, and no capture.',
    keyPoints: [
      'Check all your checks systematically',
      'King needs: no escape squares, no blocks, no captures',
      'Queens are the most common mating piece',
    ],
    // Queen mate in 1
    exampleFen: '6k1/5ppp/8/8/8/8/5PPP/1Q4K1 w - - 0 1',
    exampleDescription: 'White plays Qb8#! The queen gives check, the pawns block escape, nothing can capture or block. Checkmate!',
    toMove: 'White to move',
    arrows: [
      ['b1', 'b8', 'rgba(255, 0, 0, 0.8)'],  // Queen delivers mate
    ],
    highlights: {
      'b1': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Queen
      'b8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Mating square
      'g8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // King
    },
  },
  deflection: {
    name: 'Deflection',
    description: 'Force an enemy piece away from defending something important. Once the defender moves, you win!',
    keyPoints: [
      'Identify what the enemy piece is protecting',
      'Force it away with a bigger threat',
      'Often involves a sacrifice the opponent must accept',
    ],
    // Rook defends queen, deflect it with check, win the queen
    exampleFen: '3r2k1/5ppp/8/8/3q4/7P/5PP1/3RR1K1 w - - 0 1',
    exampleDescription: 'Black\'s rook on d8 is defending the queen on d4. White plays Re8+! The rook MUST take (Rxe8) to escape check. Now the queen on d4 is undefended - Rxd4 wins it!',
    toMove: 'White to move',
    arrows: [],
    highlights: {
      'e1': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // White rook gives check
      'd8': { backgroundColor: 'rgba(255, 170, 0, 0.5)' }, // Rook is deflected from defending
      'd4': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Queen will be won
    },
  },
  sacrifice: {
    name: 'Sacrifice',
    description: 'Give up material to gain something bigger - checkmate, winning more material back, or a crushing attack.',
    keyPoints: [
      'Don\'t sacrifice without a concrete reason',
      'Common goals: open lines, deflect defenders, expose king',
      'Calculate to make sure you get compensation',
    ],
    // Queen sacrifice for back rank mate
    exampleFen: 'r5k1/5ppp/8/8/3Q4/8/8/3R2K1 w - - 0 1',
    exampleDescription: 'White sacrifices the queen! Qd8+! is check. Rxd8 is forced. Then Rxd8# is checkmate - the king is trapped by its own pawns! Giving up the queen to force mate is worth it.',
    toMove: 'White to move',
    arrows: [],
    highlights: {
      'd4': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Queen sacrifices on d8
      'a8': { backgroundColor: 'rgba(255, 170, 0, 0.5)' }, // Rook must take
      'd1': { backgroundColor: 'rgba(255, 255, 0, 0.5)' }, // Rook delivers mate
      'g8': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Trapped king
    },
  },
  hangingPiece: {
    name: 'Hanging Piece',
    description: 'A hanging piece is undefended and can be captured for free. Always scan for loose pieces - yours AND your opponent\'s!',
    keyPoints: [
      'Before moving: "Does this leave anything undefended?"',
      'After opponent moves: "Did they leave anything hanging?"',
      'Free material is free material - take it!',
    ],
    // Knight on e5 with no defenders, white bishop can take it
    exampleFen: '4k3/8/8/4n3/8/2B5/8/4K3 w - - 0 1',
    exampleDescription: 'The black knight on e5 is hanging - nothing defends it! White plays Bxe5 and wins a free knight. Always look for undefended pieces!',
    toMove: 'White to move',
    arrows: [],
    highlights: {
      'e5': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Hanging knight!
      'c3': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Bishop can capture
    },
  },
  trappedPiece: {
    name: 'Trapped Piece',
    description: 'A trapped piece has no safe squares to escape. Don\'t let your pieces wander too deep into enemy territory!',
    keyPoints: [
      'Knights in corners are easy to trap',
      'Bishops can get trapped by pawns',
      'Queens hunting pawns early often get trapped',
    ],
    // Knight trapped in corner - nowhere to go
    exampleFen: '7k/8/8/8/8/6P1/5P2/6Kn w - - 0 1',
    exampleDescription: 'Black\'s knight on h1 is completely trapped! A knight can only go to f2 or g3, but White\'s pawns control both squares. The knight has no escape and will be captured.',
    toMove: 'Black\'s knight is trapped',
    arrows: [],
    highlights: {
      'h1': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Trapped knight
      'f2': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocked by pawn
      'g3': { backgroundColor: 'rgba(255, 170, 0, 0.4)' }, // Blocked by pawn
    },
  },
  promotion: {
    name: 'Promotion',
    description: 'When a pawn reaches the last rank, it becomes a queen (or any piece). Getting a pawn to promote often wins the game!',
    keyPoints: [
      'Almost always promote to a queen',
      'Underpromote to knight to give check when queen can\'t',
      'Passed pawns (no enemy pawns blocking) are dangerous',
    ],
    // Pawn promotes
    exampleFen: '8/P7/8/8/8/8/k7/4K3 w - - 0 1',
    exampleDescription: 'White plays a8=Q and gets a brand new queen! With king and queen vs lone king, checkmate is easy.',
    toMove: 'White to move',
    arrows: [
      ['a7', 'a8', 'rgba(0, 255, 0, 0.8)'],  // Pawn promotes!
    ],
    highlights: {
      'a7': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Promoting pawn
      'a8': { backgroundColor: 'rgba(255, 255, 0, 0.5)' }, // Promotion square
    },
  },
  enPassant: {
    name: 'En Passant',
    description: '"In passing" - when a pawn advances 2 squares and lands beside your pawn, you can capture it as if it only moved 1 square.',
    keyPoints: [
      'Must capture IMMEDIATELY or lose the right',
      'Your pawn lands where the enemy pawn passed through',
      'Only works when pawn moves 2 squares from start',
    ],
    // En passant capture
    exampleFen: '8/8/8/3Pp3/8/8/8/4K2k w - e6 0 1',
    exampleDescription: 'Black just played e7-e5. White can capture en passant: dxe6! The d5 pawn captures and lands on e6.',
    toMove: 'White to move',
    arrows: [
      ['d5', 'e6', 'rgba(0, 255, 0, 0.8)'],  // En passant capture
    ],
    highlights: {
      'd5': { backgroundColor: 'rgba(0, 255, 0, 0.5)' },  // Capturing pawn
      'e5': { backgroundColor: 'rgba(255, 0, 0, 0.5)' },  // Pawn being captured
      'e6': { backgroundColor: 'rgba(255, 255, 0, 0.5)' }, // Landing square
    },
  },
  castling: {
    name: 'Castling',
    description: 'King and rook move together in one move. Castle early to protect your king and connect your rooks!',
    keyPoints: [
      'King moves 2 squares toward rook, rook jumps over',
      'Can\'t castle through, out of, or into check',
      'Can\'t castle if king or that rook has moved',
    ],
    // Ready to castle
    exampleFen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
    exampleDescription: 'Both sides can castle! Kingside (O-O): king to g1/g8, rook to f1/f8. Queenside (O-O-O): king to c1/c8, rook to d1/d8.',
    toMove: 'Either side to castle',
    arrows: [
      ['e1', 'g1', 'rgba(0, 255, 0, 0.8)'],  // King to kingside
      ['h1', 'f1', 'rgba(0, 255, 0, 0.6)'],  // Rook jumps over
    ],
    highlights: {
      'e1': { backgroundColor: 'rgba(0, 255, 0, 0.4)' },
      'g1': { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
      'h1': { backgroundColor: 'rgba(0, 255, 0, 0.4)' },
      'f1': { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    },
  },
};

// Helper to get theme explanation by ID (handles case variations)
export function getThemeExplanation(themeId: string): ThemeExplanation | null {
  // Direct match
  if (THEME_EXPLANATIONS[themeId]) {
    return THEME_EXPLANATIONS[themeId];
  }

  // Try lowercase
  const lowerId = themeId.toLowerCase();
  if (THEME_EXPLANATIONS[lowerId]) {
    return THEME_EXPLANATIONS[lowerId];
  }

  // Try camelCase conversion (e.g., "knight-fork" -> "knightFork")
  const camelId = lowerId.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (THEME_EXPLANATIONS[camelId]) {
    return THEME_EXPLANATIONS[camelId];
  }

  return null;
}

// Get all theme IDs
export function getAllThemeIds(): string[] {
  return Object.keys(THEME_EXPLANATIONS);
}
