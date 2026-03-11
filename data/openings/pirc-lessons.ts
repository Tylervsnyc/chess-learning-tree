import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PIRC DEFENSE — Austrian Attack (Predict/Reveal)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
//            6.Bd3 Na6 7.O-O c5 8.d5 Bg4 9.Bc4 Nc7 10.h3 Bxf3
//
// Identity moves: 1.e4 d6 (not taught, auto-played)
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d6:    'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_Nf6:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3',
  after_Nc3:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3',
  after_g6:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_f4:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4',
  after_Bg7:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 1 5',
  after_Nf3:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 2 5',
  after_OO:    'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R w KQ - 3 6',
  after_Bd3:   'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R b KQ - 4 6',
  after_Na6:   'r1bq1rk1/ppp1ppbp/n2p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R w KQ - 5 7',
  after_OO_w:  'r1bq1rk1/ppp1ppbp/n2p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQ1RK1 b - - 6 7',
  after_c5:    'r1bq1rk1/pp2ppbp/n2p1np1/2p5/3PPP2/2NB1N2/PPP3PP/R1BQ1RK1 w - - 0 8',
  after_d5:    'r1bq1rk1/pp2ppbp/n2p1np1/2pP4/4PP2/2NB1N2/PPP3PP/R1BQ1RK1 b - - 0 8',
  after_Bg4:   'r2q1rk1/pp2ppbp/n2p1np1/2pP4/4PPb1/2NB1N2/PPP3PP/R1BQ1RK1 w - - 1 9',
  after_Bc4:   'r2q1rk1/pp2ppbp/n2p1np1/2pP4/2B1PPb1/2N2N2/PPP3PP/R1BQ1RK1 b - - 2 9',
  after_Nc7:   'r2q1rk1/ppn1ppbp/3p1np1/2pP4/2B1PPb1/2N2N2/PPP3PP/R1BQ1RK1 w - - 3 10',
  after_h3:    'r2q1rk1/ppn1ppbp/3p1np1/2pP4/2B1PPb1/2N2N1P/PPP3P1/R1BQ1RK1 b - - 0 10',
  after_Bxf3:  'r2q1rk1/ppn1ppbp/3p1np1/2pP4/2B1PP2/2N2b1P/PPP3P1/R1BQ1RK1 w - - 0 11',

  // Deviation: White plays Be3 instead of Bd3
  dev_Be3:      'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N1BN2/PPP3PP/R2QKB1R b KQ - 4 6',
  dev_Be3_Na6:  'r1bq1rk1/ppp1ppbp/n2p1np1/8/3PPP2/2N1BN2/PPP3PP/R2QKB1R w KQ - 5 7',
  dev_Be3_Bd3:  'r1bq1rk1/ppp1ppbp/n2p1np1/8/3PPP2/2NBBN2/PPP3PP/R2QK2R b KQ - 6 7',
  dev_Be3_c5:   'r1bq1rk1/pp2ppbp/n2p1np1/2p5/3PPP2/2NBBN2/PPP3PP/R2QK2R w KQ - 0 8',
  dev_Be3_d5:   'r1bq1rk1/pp2ppbp/n2p1np1/2pP4/4PP2/2NBBN2/PPP3PP/R2QK2R b KQ - 0 8',
  dev_Be3_Bg4:  'r2q1rk1/pp2ppbp/n2p1np1/2pP4/4PPb1/2NBBN2/PPP3PP/R2QK2R w KQ - 1 9',

  // Deviation: White plays e5 instead of O-O
  dev_e5:       'r1bq1rk1/ppp1ppbp/n2p1np1/4P3/3P1P2/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 7',
  dev_e5_dxe5:  'r1bq1rk1/ppp1ppbp/n4np1/4p3/3P1P2/2NB1N2/PPP3PP/R1BQK2R w KQ - 0 8',
  dev_e5_fxe5:  'r1bq1rk1/ppp1ppbp/n4np1/4P3/3P4/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 8',
  dev_e5_Nd7:   'r1bq1rk1/pppnppbp/n5p1/4P3/3P4/2NB1N2/PPP3PP/R1BQK2R w KQ - 1 9',
  dev_e5_OO:    'r1bq1rk1/pppnppbp/n5p1/4P3/3P4/2NB1N2/PPP3PP/R1BQ1RK1 b - - 2 9',
  dev_e5_c5:    'r1bq1rk1/pp1nppbp/n5p1/2p1P3/3P4/2NB1N2/PPP3PP/R1BQ1RK1 w - - 0 10',
}

// ═══════════════════════════════════════════════════════════
// pi-1: The Pirc Setup (Nf6, g6, Bg7)
// ═══════════════════════════════════════════════════════════

const PI_LESSON_1: OpeningLesson = {
  id: 'pi-1',
  title: 'The Pirc Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_d6, text: "The Pirc Defense starts with d6. Now White grabs the center — your job is to develop and prepare to strike back." },

    // White plays d4
    { type: 'instruction', fen: FEN.after_d6, text: "White plays d4, claiming the center.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Develop a piece toward the center. What do you play?", hint: 'Bring your knight out — it attacks e4.', correctFeedback: "Nf6 develops the knight and puts pressure on White's e4 pawn.", wrongFeedback: 'Play Nf6 to develop and attack e4.', postMoveArrow: ['f6', 'e4'] },
    { type: 'instruction', fen: FEN.after_Nf6, text: "Nf6 develops with purpose — the knight eyes e4 and prepares the fianchetto.", arrow: ['g8', 'f6'] },

    // White plays Nc3
    { type: 'instruction', fen: FEN.after_Nf6, text: "White plays Nc3, defending e4.", autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 2: g6
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Set up the fianchetto. Where does the pawn go?", hint: 'Push g6 to make room for your bishop on g7.', correctFeedback: "g6 prepares the fianchetto — your bishop will be a monster on g7.", wrongFeedback: 'Play g6 to prepare the bishop fianchetto.', postMoveArrow: ['g6', 'g7'] },
    { type: 'instruction', fen: FEN.after_g6, text: "g6 opens the long diagonal for your dark-squared bishop. This is the Pirc signature setup.", arrow: ['g7', 'g6'] },

    // White plays f4
    { type: 'instruction', fen: FEN.after_g6, text: "White plays f4 — the Austrian Attack! Aggressive, but it weakens the kingside.", autoAdvance: 800, highlightSquares: ['f2', 'f4'] },

    // PREDICT 3: Bg7
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Complete the fianchetto. Where does the bishop go?", hint: 'The bishop belongs on g7 — the long diagonal.', correctFeedback: "Bg7 completes the fianchetto. The bishop controls the long a1-h8 diagonal.", wrongFeedback: 'Play Bg7 to fianchetto the bishop.', postMoveArrow: ['g7', 'a1'] },
    { type: 'instruction', fen: FEN.after_Bg7, text: "Bg7 is a powerful piece. It aims down the long diagonal at White's center and queenside.", arrow: ['f8', 'g7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d6, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_d6, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    { type: 'instruction', fen: FEN.after_Bg7, text: "Nf6, g6, Bg7 — the Pirc is set up. White has the center, but your bishop is ready to rip it apart." },
  ],
}

// ═══════════════════════════════════════════════════════════
// pi-2: Castle & Develop (O-O, Na6, c5)
// ═══════════════════════════════════════════════════════════

const PI_LESSON_2: OpeningLesson = {
  id: 'pi-2',
  title: 'Castle & Develop',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bg7, text: "Your fianchetto is complete. Now castle to safety, develop your knight, and challenge White's center." },

    // RECAP
    { type: 'instruction', fen: FEN.after_d6, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // White plays Nf3
    { type: 'instruction', fen: FEN.after_Bg7, text: "White plays Nf3, developing the knight.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Your king is in the center. What's the priority?", hint: 'Get your king to safety — castle kingside.', correctFeedback: "O-O tucks the king away and connects your rooks.", wrongFeedback: 'Castle kingside to get your king safe.', postMoveArrow: ['f8', 'e8'] },
    { type: 'instruction', fen: FEN.after_OO, text: "Castling gets the king safe and activates the rook. Now you're ready to fight.", arrow: ['e8', 'g8'] },

    // White plays Bd3
    { type: 'instruction', fen: FEN.after_OO, text: "White plays Bd3, developing the bishop.", autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 2: Na6
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Na6', prompt: "Time to develop your queenside knight. Where does it go?", hint: 'Na6 heads toward c7 and eventually b5 or supports c5.', correctFeedback: "Na6 develops the knight. It can reroute to c7 later, supporting the center.", wrongFeedback: 'Play Na6 — the knight is heading for c7.', postMoveArrow: ['a6', 'c7'] },
    { type: 'instruction', fen: FEN.after_Na6, text: "Na6 looks unusual, but the knight is heading to c7 — a flexible square that supports both d5 and b5.", arrow: ['b8', 'a6'] },

    // White plays O-O
    { type: 'instruction', fen: FEN.after_Na6, text: "White castles.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 3: c5
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'c5', prompt: "Time to challenge White's center. What pawn move strikes at d4?", hint: 'Push c5 to hit the d4 pawn.', correctFeedback: "c5 challenges the center directly. The Pirc counterattack begins.", wrongFeedback: 'Play c5 to attack the d4 pawn.', postMoveArrow: ['c5', 'd4'] },
    { type: 'instruction', fen: FEN.after_c5, text: "c5 strikes at White's d4 pawn. White can't maintain the center forever — your counterplay has started.", arrow: ['c7', 'c5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bg7, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },
    { type: 'instruction', fen: FEN.after_Na6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    { type: 'instruction', fen: FEN.after_c5, text: "O-O, Na6, c5 — castled, developed, and the center is under attack. You're rolling." },
  ],
}

// ═══════════════════════════════════════════════════════════
// pi-3: The Counterattack (Bg4, Nc7, Bxf3)
// ═══════════════════════════════════════════════════════════

const PI_LESSON_3: OpeningLesson = {
  id: 'pi-3',
  title: 'The Counterattack',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_c5, text: "White pushes d5 to lock the center. You'll pin the knight, reroute yours, and trade the bishop at the perfect moment." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bg7, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },
    { type: 'instruction', fen: FEN.after_Na6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // White plays d5
    { type: 'instruction', fen: FEN.after_c5, text: "White pushes d5, locking the center and gaining space.", autoAdvance: 800, highlightSquares: ['d4', 'd5'] },

    // PREDICT 1: Bg4
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bg4', prompt: "The center is locked. How do you create pressure?", hint: 'Pin the f3 knight to the queen with your bishop.', correctFeedback: "Bg4 pins the knight to the queen. White's f3 knight is under serious pressure.", wrongFeedback: 'Play Bg4 to pin the knight on f3.', postMoveArrow: ['g4', 'f3'] },
    { type: 'instruction', fen: FEN.after_Bg4, text: "Bg4 pins the f3 knight. White can't move it without losing material, and the pin creates long-term pressure.", arrow: ['c8', 'g4'] },

    // White plays Bc4
    { type: 'instruction', fen: FEN.after_Bg4, text: "White plays Bc4, repositioning the bishop to an active diagonal.", autoAdvance: 800, highlightSquares: ['d3', 'c4'] },

    // PREDICT 2: Nc7
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nc7', prompt: "Your knight on a6 needs a better square. Where does it go?", hint: 'Reroute the knight to c7 — it supports b5 and covers d5.', correctFeedback: "Nc7 reroutes the knight to a flexible square. It eyes b5 and supports the d5 break.", wrongFeedback: 'Play Nc7 to reroute the knight.', postMoveArrow: ['c7', 'b5'] },
    { type: 'instruction', fen: FEN.after_Nc7, text: "Nc7 puts the knight on a great square. From here it can jump to b5 or support a future d6 push.", arrow: ['a6', 'c7'] },

    // White plays h3
    { type: 'instruction', fen: FEN.after_Nc7, text: "White plays h3, asking the bishop what it wants to do.", autoAdvance: 800, highlightSquares: ['h2', 'h3'] },

    // PREDICT 3: Bxf3
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Bxf3', prompt: "White is kicking your bishop. What's the best response?", hint: 'Trade the bishop for the knight — Bxf3 damages White\'s pawn structure.', correctFeedback: "Bxf3 trades the bishop for the knight and doubles White's pawns after Qxf3 or gxf3.", wrongFeedback: 'Play Bxf3 to trade and damage White\'s structure.', postMoveArrow: ['f3', 'g2'] },
    { type: 'instruction', fen: FEN.after_Bxf3, text: "Bxf3 is the right moment to trade. White must recapture, and the doubled pawns or weakened king position gives you long-term play.", arrow: ['g4', 'f3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_c5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_c5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },
    { type: 'instruction', fen: FEN.after_Bg4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['d3', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nc7', prompt: 'Your move.', hint: 'Nc7.', correctFeedback: 'Nc7.', wrongFeedback: 'Nc7.' },
    { type: 'instruction', fen: FEN.after_Nc7, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Bxf3', prompt: 'Your move.', hint: 'Bxf3.', correctFeedback: 'Bxf3.', wrongFeedback: 'Bxf3.' },

    { type: 'instruction', fen: FEN.after_Bxf3, text: "Bg4, Nc7, Bxf3 — pin, reroute, trade. The counterattack is in full swing." },
  ],
}

// ═══════════════════════════════════════════════════════════
// pi-dev-Be3: If White plays Be3 instead of Bd3 (Na6, c5, Bg4)
// ═══════════════════════════════════════════════════════════

const PI_DEV_BE3: OpeningLesson = {
  id: 'pi-dev-Be3',
  title: 'If 6.Be3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "Sometimes White develops the bishop to e3 instead of d3. Same plan — develop, push c5, and create pressure." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bg7, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // DEVIATION: Be3 instead of Bd3
    { type: 'instruction', fen: FEN.after_OO, text: "White plays Be3 instead of Bd3 — developing the bishop to support d4.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 1: Na6
    { type: 'play-move', fen: FEN.dev_Be3, correctMove: 'Na6', prompt: "White went Be3. What's your developing move?", hint: 'Develop the knight toward c7 — same idea as the main line.', correctFeedback: "Na6 develops with the same plan. The knight heads for c7.", wrongFeedback: 'Play Na6 — same plan, different move order.', postMoveArrow: ['a6', 'c7'] },
    { type: 'instruction', fen: FEN.dev_Be3_Na6, text: "Na6 keeps the same plan. Whether White plays Bd3 or Be3, the knight goes to a6 and then c7.", arrow: ['b8', 'a6'] },

    // White plays Bd3
    { type: 'instruction', fen: FEN.dev_Be3_Na6, text: "White plays Bd3.", autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 2: c5
    { type: 'play-move', fen: FEN.dev_Be3_Bd3, correctMove: 'c5', prompt: "Challenge the center. What's the key pawn move?", hint: 'Push c5 to attack d4.', correctFeedback: "c5 hits the center. White's d4 pawn is under fire.", wrongFeedback: 'Play c5 to strike at d4.', postMoveArrow: ['c5', 'd4'] },
    { type: 'instruction', fen: FEN.dev_Be3_c5, text: "c5 attacks d4 directly. Whether the bishop is on e3 or not, c5 is always your plan.", arrow: ['c7', 'c5'] },

    // White plays d5
    { type: 'instruction', fen: FEN.dev_Be3_c5, text: "White pushes d5.", autoAdvance: 800, highlightSquares: ['d4', 'd5'] },

    // PREDICT 3: Bg4
    { type: 'play-move', fen: FEN.dev_Be3_d5, correctMove: 'Bg4', prompt: "The center is locked. How do you keep up the pressure?", hint: 'Pin the knight on f3 with your bishop.', correctFeedback: "Bg4 pins the knight again. Same pressure, same plan.", wrongFeedback: 'Play Bg4 to pin the knight.', postMoveArrow: ['g4', 'f3'] },
    { type: 'instruction', fen: FEN.dev_Be3_Bg4, text: "Bg4 pins the f3 knight. Even with Be3, your counterplay is the same: Na6, c5, Bg4.", arrow: ['c8', 'g4'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Be3, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev_Be3, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },
    { type: 'instruction', fen: FEN.dev_Be3_Na6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_Be3_Bd3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.dev_Be3_c5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_Be3_d5, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },

    { type: 'instruction', fen: FEN.dev_Be3_Bg4, text: "Against Be3: Na6, c5, Bg4. Same plan, same result — your counterplay is unstoppable." },
  ],
}

// ═══════════════════════════════════════════════════════════
// pi-dev-e5: If White plays e5 instead of O-O (dxe5, Nd7, c5)
// ═══════════════════════════════════════════════════════════

const PI_DEV_E5: OpeningLesson = {
  id: 'pi-dev-e5',
  title: 'If 7.e5',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Na6, text: "Instead of castling, White pushes e5 aggressively. Don't panic — take the pawn and regroup." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bg7, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },

    // DEVIATION: e5 instead of O-O
    { type: 'instruction', fen: FEN.after_Na6, text: "White pushes e5 instead of castling — attacking your knight on f6.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },

    // PREDICT 1: dxe5
    { type: 'play-move', fen: FEN.dev_e5, correctMove: 'dxe5', prompt: "White pushed e5 into your territory. What's the best response?", hint: 'Capture the pawn — dxe5 opens the position.', correctFeedback: "dxe5 takes the pawn. The center opens up in your favor.", wrongFeedback: 'Take the pawn with dxe5.', postMoveArrow: ['e5', 'f4'] },
    { type: 'instruction', fen: FEN.dev_e5_dxe5, text: "dxe5 captures the pawn. White will recapture with fxe5, but you're ready to regroup.", arrow: ['d6', 'e5'] },

    // White plays fxe5
    { type: 'instruction', fen: FEN.dev_e5_dxe5, text: "White recaptures: fxe5.", autoAdvance: 800, highlightSquares: ['f4', 'e5'] },

    // PREDICT 2: Nd7
    { type: 'play-move', fen: FEN.dev_e5_fxe5, correctMove: 'Nd7', prompt: "Your knight is under attack from the e5 pawn. Where does it go?", hint: 'Retreat to d7 — the knight is safe there and blocks the d-file.', correctFeedback: "Nd7 retreats the knight to safety. From d7 it can reroute to c5 or e5 later.", wrongFeedback: 'Play Nd7 to save the knight.', postMoveArrow: ['d7', 'c5'] },
    { type: 'instruction', fen: FEN.dev_e5_Nd7, text: "Nd7 saves the knight and keeps options open. It can jump to c5 to attack the d3 bishop.", arrow: ['f6', 'd7'] },

    // White plays O-O
    { type: 'instruction', fen: FEN.dev_e5_Nd7, text: "White castles.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 3: c5
    { type: 'play-move', fen: FEN.dev_e5_OO, correctMove: 'c5', prompt: "Strike at the center. What's the key move?", hint: 'Push c5 — challenge White\'s d4 pawn.', correctFeedback: "c5 hits d4 and opens up your position. The counterattack continues.", wrongFeedback: 'Play c5 to attack the d4 pawn.', postMoveArrow: ['c5', 'd4'] },
    { type: 'instruction', fen: FEN.dev_e5_c5, text: "c5 challenges d4 and gives your pieces room. Even after e5, the Pirc counterplay with c5 works perfectly.", arrow: ['c7', 'c5'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_e5, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.dev_e5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.dev_e5_dxe5, text: 'fxe5.', autoAdvance: 800, highlightSquares: ['f4', 'e5'] },
    { type: 'play-move', fen: FEN.dev_e5_fxe5, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.dev_e5_Nd7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_e5_OO, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    { type: 'instruction', fen: FEN.dev_e5_c5, text: "Against e5: dxe5, Nd7, c5. Take the pawn, regroup, and counter. White gained nothing." },
  ],
}

// ═══════════════════════════════════════════════════════════
// pi-test-1: Level 1 Test (main line + deviations)
// ═══════════════════════════════════════════════════════════

const PI_TEST_1: OpeningLesson = {
  id: 'pi-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (9 Black moves) ===
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },
    { type: 'instruction', fen: FEN.after_Na6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },
    { type: 'instruction', fen: FEN.after_Bg4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['d3', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nc7', prompt: 'Your move.', hint: 'Nc7.', correctFeedback: 'Nc7.', wrongFeedback: 'Nc7.' },
    { type: 'instruction', fen: FEN.after_Nc7, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Bxf3', prompt: 'Your move.', hint: 'Bxf3.', correctFeedback: 'Bxf3.', wrongFeedback: 'Bxf3.' },

    // === DEVIATION 1: Be3 instead of Bd3 ===
    { type: 'instruction', fen: FEN.after_OO, text: 'But wait — White plays Be3 instead.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.dev_Be3, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },
    { type: 'instruction', fen: FEN.dev_Be3_Na6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_Be3_Bd3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.dev_Be3_c5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_Be3_d5, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },

    // === DEVIATION 2: e5 instead of O-O ===
    { type: 'instruction', fen: FEN.after_Na6, text: 'Now White pushes e5 instead of castling.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.dev_e5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.dev_e5_dxe5, text: 'fxe5.', autoAdvance: 800, highlightSquares: ['f4', 'e5'] },
    { type: 'play-move', fen: FEN.dev_e5_fxe5, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.dev_e5_Nd7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_e5_OO, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const PIRC_LESSONS: Record<string, OpeningLesson> = {
  'pi-1': PI_LESSON_1,
  'pi-2': PI_LESSON_2,
  'pi-3': PI_LESSON_3,
  'pi-dev-Be3': PI_DEV_BE3,
  'pi-dev-e5': PI_DEV_E5,
  'pi-test-1': PI_TEST_1,
}

export function getPircLesson(id: string): OpeningLesson | undefined {
  return PIRC_LESSONS[id]
}
