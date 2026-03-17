import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// ENGLISH OPENING LESSONS (en-1 through en-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.g3 d5 5.cxd5 Nxd5
//            6.Bg2 Nb6 7.O-O Be7 8.a3 O-O 9.b4 Be6 10.Rb1
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity moves (1.c4 e5)
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_c4:         'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1',
  after_e5:         'rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2',

  // Lesson 1: 2.Nc3 Nf6 3.Nf3 Nc6 4.g3
  after_Nc3:        'rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 1 2',
  after_Nf6:        'rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq - 2 3',
  after_Nf3:        'rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N2N2/PP1PPPPP/R1BQKB1R b KQkq - 3 3',
  after_Nc6:        'r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 4 4',
  after_g3:         'r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/2N2NP1/PP1PPP1P/R1BQKB1R b KQkq - 0 4',

  // Lesson 2: 5.cxd5 Nxd5 6.Bg2 Nb6 7.O-O
  after_d5:         'r1bqkb1r/ppp2ppp/2n2n2/3pp3/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 0 5',
  after_cxd5:       'r1bqkb1r/ppp2ppp/2n2n2/3Pp3/8/2N2NP1/PP1PPP1P/R1BQKB1R b KQkq - 0 5',
  after_Nxd5:       'r1bqkb1r/ppp2ppp/2n5/3np3/8/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 0 6',
  after_Bg2:        'r1bqkb1r/ppp2ppp/2n5/3np3/8/2N2NP1/PP1PPPBP/R1BQK2R b KQkq - 1 6',
  after_Nb6:        'r1bqkb1r/ppp2ppp/1nn5/4p3/8/2N2NP1/PP1PPPBP/R1BQK2R w KQkq - 2 7',
  after_OO:         'r1bqkb1r/ppp2ppp/1nn5/4p3/8/2N2NP1/PP1PPPBP/R1BQ1RK1 b kq - 3 7',

  // Lesson 3: 8.a3 O-O 9.b4 Be6 10.Rb1
  after_Be7:        'r1bqk2r/ppp1bppp/1nn5/4p3/8/2N2NP1/PP1PPPBP/R1BQ1RK1 w kq - 4 8',
  after_a3:         'r1bqk2r/ppp1bppp/1nn5/4p3/8/P1N2NP1/1P1PPPBP/R1BQ1RK1 b kq - 0 8',
  after_OO_b:       'r1bq1rk1/ppp1bppp/1nn5/4p3/8/P1N2NP1/1P1PPPBP/R1BQ1RK1 w - - 1 9',
  after_b4:         'r1bq1rk1/ppp1bppp/1nn5/4p3/1P6/P1N2NP1/3PPPBP/R1BQ1RK1 b - - 0 9',
  after_Be6:        'r2q1rk1/ppp1bppp/1nn1b3/4p3/1P6/P1N2NP1/3PPPBP/R1BQ1RK1 w - - 1 10',
  after_Rb1:        'r2q1rk1/ppp1bppp/1nn1b3/4p3/1P6/P1N2NP1/3PPPBP/1RBQ1RK1 b - - 2 10',

  // Deviation 1: 4...Bb4 (instead of 4...d5)
  dev1_after_Bb4:   'r1bqk2r/pppp1ppp/2n2n2/4p3/1bP5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5',
  dev1_after_Bg2:   'r1bqk2r/pppp1ppp/2n2n2/4p3/1bP5/2N2NP1/PP1PPPBP/R1BQK2R b KQkq - 2 5',
  dev1_after_OO_b:  'r1bq1rk1/pppp1ppp/2n2n2/4p3/1bP5/2N2NP1/PP1PPPBP/R1BQK2R w KQ - 3 6',
  dev1_after_OO_w:  'r1bq1rk1/pppp1ppp/2n2n2/4p3/1bP5/2N2NP1/PP1PPPBP/R1BQ1RK1 b - - 4 6',
  dev1_after_e4:    'r1bq1rk1/pppp1ppp/2n2n2/8/1bP1p3/2N2NP1/PP1PPPBP/R1BQ1RK1 w - - 0 7',
  dev1_after_Ng5:   'r1bq1rk1/pppp1ppp/2n2n2/6N1/1bP1p3/2N3P1/PP1PPPBP/R1BQ1RK1 b - - 1 7',

  // Lesson 4 (L2): 11.d3 a5 12.b5 Nd4 13.Nd2 Qc8
  after_f6:         'r2q1rk1/ppp1b1pp/1nn1bp2/4p3/1P6/P1N2NP1/3PPPBP/1RBQ1RK1 w - - 0 11',
  after_d3_L2:      'r2q1rk1/ppp1b1pp/1nn1bp2/4p3/1P6/P1NP1NP1/4PPBP/1RBQ1RK1 b - - 0 11',
  after_a5:         'r2q1rk1/1pp1b1pp/1nn1bp2/p3p3/1P6/P1NP1NP1/4PPBP/1RBQ1RK1 w - - 0 12',
  after_b5_L2:      'r2q1rk1/1pp1b1pp/1nn1bp2/pP2p3/8/P1NP1NP1/4PPBP/1RBQ1RK1 b - - 0 12',
  after_Nd4:        'r2q1rk1/1pp1b1pp/1n2bp2/pP2p3/3n4/P1NP1NP1/4PPBP/1RBQ1RK1 w - - 1 13',
  after_Nd2:        'r2q1rk1/1pp1b1pp/1n2bp2/pP2p3/3n4/P1NP2P1/3NPPBP/1RBQ1RK1 b - - 2 13',
  after_Qc8:        'r1q2rk1/1pp1b1pp/1n2bp2/pP2p3/3n4/P1NP2P1/3NPPBP/1RBQ1RK1 w - - 3 14',

  // Deviation 2: 6...Bc5 (instead of 6...Nb6)
  dev2_after_Bc5:   'r1bqk2r/ppp2ppp/2n5/2bnp3/8/2N2NP1/PP1PPPBP/R1BQK2R w KQkq - 2 7',
  dev2_after_OO_w:  'r1bqk2r/ppp2ppp/2n5/2bnp3/8/2N2NP1/PP1PPPBP/R1BQ1RK1 b kq - 3 7',
  dev2_after_OO_b:  'r1bq1rk1/ppp2ppp/2n5/2bnp3/8/2N2NP1/PP1PPPBP/R1BQ1RK1 w - - 4 8',
  dev2_after_d3:    'r1bq1rk1/ppp2ppp/2n5/2bnp3/8/2NP1NP1/PP2PPBP/R1BQ1RK1 b - - 0 8',
  dev2_after_h6:    'r1bq1rk1/ppp2pp1/2n4p/2bnp3/8/2NP1NP1/PP2PPBP/R1BQ1RK1 w - - 0 9',
  dev2_after_Nxd5:  'r1bq1rk1/ppp2pp1/2n4p/2bNp3/8/3P1NP1/PP2PPBP/R1BQ1RK1 b - - 0 9',
}


// ═══════════════════════════════════════════════════════════
// en-1: The Fianchetto Setup (2.Nc3, 3.Nf3, 4.g3)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const EN_1: OpeningLesson = {
  id: 'en-1',
  title: 'The Fianchetto Setup',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_e5, text: "The English Opening begins with 1.c4. After Black plays e5, you'll develop both knights and prepare a kingside fianchetto." },

    // Black plays 1...e5 already happened (identity). White to move.

    // PREDICT 1: Nc3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: "What's the natural developing move here?", hint: 'Develop the queenside knight toward the center.', correctFeedback: 'Nc3 develops the knight and controls the d5 square.', wrongFeedback: 'Bring the knight to c3 — it eyes d5 and supports the c4 pawn.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3 develops toward the center and keeps an eye on d5, the key square in the English.', arrow: ['b1', 'c3'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Black develops Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 2: Nf3
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Both sides are developing. What comes next?', hint: 'Develop the other knight to its natural square.', correctFeedback: 'Nf3 develops the kingside knight, controls d4 and e5.', wrongFeedback: 'Play Nf3 — get the knight out to a strong central square.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3 completes your knight development. Both knights are active and controlling central squares.', arrow: ['g1', 'f3'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Black mirrors with Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: g3
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Knights are developed. Time to prepare the bishop. What move sets up the fianchetto?', hint: 'Push the g-pawn one square to make room for the bishop.', correctFeedback: 'g3 prepares Bg2, putting the bishop on the long diagonal.', wrongFeedback: 'Play g3 — it clears g2 for the bishop fianchetto.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'g3 is the hallmark of the English. The bishop will go to g2 next, controlling the long diagonal from a1 to h8.', arrow: ['g2', 'g3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e5, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_g3, text: "Nc3, Nf3, g3 — the English setup. Knights developed, fianchetto prepared. Next you'll exchange in the center and deploy the bishop." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-2: Central Exchange (5.cxd5, 6.Bg2, 7.O-O)
// ═══════════════════════════════════════════════════════════

const EN_2: OpeningLesson = {
  id: 'en-2',
  title: 'Central Exchange',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_g3, text: "Black challenges the center with d5. You'll capture, fianchetto the bishop, and castle." },

    // RECAP
    { type: 'instruction', fen: FEN.after_e5, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },

    // Black plays d5
    { type: 'instruction', fen: FEN.after_g3, text: 'Black strikes the center with d5, challenging your c4 pawn.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },

    // PREDICT 1: cxd5
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Black just pushed d5. How do you respond?', hint: 'Capture the pawn on d5 with your c4 pawn.', correctFeedback: 'cxd5 captures the center pawn and opens the position for your bishop.', wrongFeedback: 'Take on d5 with cxd5 — you open lines and the bishop will be powerful on g2.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'cxd5 opens the long diagonal for your future bishop on g2. Black will recapture with the knight.', arrow: ['c4', 'd5'] },

    // Black plays Nxd5
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Black recaptures Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },

    // PREDICT 2: Bg2
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'The diagonal is clear. Where does the bishop go?', hint: 'Fianchetto the bishop to g2.', correctFeedback: 'Bg2 completes the fianchetto. The bishop strikes through the center along the long diagonal.', wrongFeedback: 'Play Bg2 — the fianchetto is the whole point of g3.' },
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Bg2 is a powerhouse. It pressures the center and pins down the d5 knight against the a8 rook.', arrow: ['f1', 'g2'] },

    // Black plays Nb6
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Black retreats Nb6, getting out of the bishop\'s line.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.after_Nb6, correctMove: 'O-O', prompt: 'Your bishop is developed. What is the logical next step?', hint: 'Get your king to safety.', correctFeedback: 'O-O castles kingside, connecting the rooks and securing the king.', wrongFeedback: 'Castle kingside — your king needs safety and your rook joins the game.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Castling completes your kingside development. The rook is now connected and ready for action.', arrow: ['e1', 'g1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_g3, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_g3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Nb6.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },
    { type: 'play-move', fen: FEN.after_Nb6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_OO, text: "cxd5, Bg2, O-O — center exchanged, bishop fianchettoed, king castled. The English setup is complete." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-3: Queenside Expansion (8.a3, 9.b4, 10.Rb1)
// ═══════════════════════════════════════════════════════════

const EN_3: OpeningLesson = {
  id: 'en-3',
  title: 'Queenside Expansion',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_OO, text: "Your kingside is set. Now you'll expand on the queenside with a3, b4, and Rb1 to grab space." },

    // RECAP
    { type: 'instruction', fen: FEN.after_e5, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Nb6.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },
    { type: 'play-move', fen: FEN.after_Nb6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // Black plays Be7
    { type: 'instruction', fen: FEN.after_OO, text: 'Black develops Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },

    // PREDICT 1: a3
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'a3', prompt: 'Your kingside is developed. How do you start expanding on the queenside?', hint: 'A quiet pawn move that prepares b4.', correctFeedback: 'a3 prepares the b4 push, securing queenside space.', wrongFeedback: 'Play a3 — it prepares b4 and gives your queenside expansion a foundation.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'a3 is a patient move. It supports b4 and prevents any Nb4 jumps from Black.', arrow: ['a2', 'a3'] },

    // Black castles
    { type: 'instruction', fen: FEN.after_a3, text: 'Black castles O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 2: b4
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'b4', prompt: "You've prepared it. Time to push.", hint: 'Expand on the queenside with the b-pawn.', correctFeedback: 'b4 grabs queenside space and restricts Black\'s knight on b6.', wrongFeedback: 'Push b4 — take space on the queenside.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'b4 claims queenside territory. The knight on b6 is now boxed in, and you control the c5 square.', arrow: ['b2', 'b4'] },

    // Black plays Be6
    { type: 'instruction', fen: FEN.after_b4, text: 'Black develops Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },

    // PREDICT 3: Rb1
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Rb1', prompt: 'You have queenside space. How do you activate the rook?', hint: 'Put the rook behind your b-pawn.', correctFeedback: 'Rb1 supports the b4 pawn and eyes the b-file for future play.', wrongFeedback: 'Play Rb1 — the rook belongs behind the advancing pawn.' },
    { type: 'instruction', fen: FEN.after_Rb1, text: 'Rb1 puts the rook on the semi-open b-file, supporting b4 and preparing to push b5.', arrow: ['a1', 'b1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_OO, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_OO, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'a3', prompt: 'Your move.', hint: 'a3.', correctFeedback: 'a3.', wrongFeedback: 'a3.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Rb1', prompt: 'Your move.', hint: 'Rb1.', correctFeedback: 'Rb1.', wrongFeedback: 'Rb1.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Rb1, text: "a3, b4, Rb1 — queenside expansion complete. You have space, active pieces, and a clear plan to push further." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-dev-Bb4: Deviation — 4...Bb4 (instead of 4...d5)
// Black pins the knight. White: 5.Bg2, 6.O-O, 7.Ng5
// ═══════════════════════════════════════════════════════════

const EN_DEV_BB4: OpeningLesson = {
  id: 'en-dev-Bb4',
  title: 'Dev 4...Bb4',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_g3, text: "Sometimes Black plays Bb4 instead of d5, pinning your knight. Here's how to handle it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_e5, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.dev1_after_Bb4, text: 'Black plays Bb4 instead of d5, pinning your knight to the king.', autoAdvance: 800, highlightSquares: ['f8', 'b4'] },

    // PREDICT 1: Bg2
    { type: 'play-move', fen: FEN.dev1_after_Bb4, correctMove: 'Bg2', prompt: "Black pins your knight. What's your plan?", hint: 'Continue with the fianchetto — don\'t worry about the pin yet.', correctFeedback: 'Bg2 completes the fianchetto. The pin on the knight is temporary.', wrongFeedback: 'Play Bg2 — stick to your plan. The fianchetto is more important than reacting to the pin.' },
    { type: 'instruction', fen: FEN.dev1_after_Bg2, text: 'Bg2 ignores the pin and develops naturally. The bishop on g2 is more valuable long-term than worrying about Bb4.', arrow: ['f1', 'g2'] },

    // Black castles
    { type: 'instruction', fen: FEN.dev1_after_Bg2, text: 'Black castles O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.dev1_after_OO_b, correctMove: 'O-O', prompt: 'Black has castled. What do you do?', hint: 'Get your king safe too.', correctFeedback: 'O-O castles and connects the rooks. Simple development.', wrongFeedback: 'Castle kingside — follow the same plan.' },
    { type: 'instruction', fen: FEN.dev1_after_OO_w, text: 'Both sides are castled. Now Black will try to seize the center.', arrow: ['e1', 'g1'] },

    // Black pushes e4
    { type: 'instruction', fen: FEN.dev1_after_OO_w, text: 'Black pushes e4, attacking your knight on f3.', autoAdvance: 800, highlightSquares: ['e5', 'e4'] },

    // PREDICT 3: Ng5
    { type: 'play-move', fen: FEN.dev1_after_e4, correctMove: 'Ng5', prompt: 'Your knight is attacked by e4. Where does it jump?', hint: 'The knight leaps to an aggressive square, eyeing f7 and e6.', correctFeedback: 'Ng5 jumps to an active square, targeting f7 and e6.', wrongFeedback: 'Play Ng5 — the knight retreats forward, not backward.' },
    { type: 'instruction', fen: FEN.dev1_after_Ng5, text: 'Ng5 is aggressive. The knight eyes f7 and e6, creating pressure despite Black\'s space advantage in the center.', arrow: ['f3', 'g5'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev1_after_Bb4, text: "Now play all three responses from memory." },
    { type: 'play-move', fen: FEN.dev1_after_Bb4, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.dev1_after_Bg2, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev1_after_OO_b, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev1_after_OO_w, text: 'e4.', autoAdvance: 800, highlightSquares: ['e5', 'e4'] },
    { type: 'play-move', fen: FEN.dev1_after_e4, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev1_after_Ng5, text: "Bg2, O-O, Ng5 — against the Bb4 pin, stick to your fianchetto plan and counter-attack when Black pushes e4." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-dev-Bc5: Deviation — 6...Bc5 (instead of 6...Nb6)
// Black develops bishop actively. White: 7.O-O, 8.d3, 9.Nxd5
// ═══════════════════════════════════════════════════════════

const EN_DEV_BC5: OpeningLesson = {
  id: 'en-dev-Bc5',
  title: 'Dev 6...Bc5',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Bg2, text: "Sometimes after Bg2, Black plays Bc5 instead of Nb6, developing the bishop aggressively. Here's how to respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_e5, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.dev2_after_Bc5, text: 'Black plays Bc5 instead of Nb6, putting the bishop on an active diagonal.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.dev2_after_Bc5, correctMove: 'O-O', prompt: 'Black developed the bishop to c5. What do you do?', hint: 'Get your king safe first.', correctFeedback: 'O-O castles and keeps your development flowing.', wrongFeedback: 'Castle kingside — development first, worry about the bishop later.' },
    { type: 'instruction', fen: FEN.dev2_after_OO_w, text: 'Castling is always right here. Your king is safe and you can plan against the Bc5.', arrow: ['e1', 'g1'] },

    // Black castles
    { type: 'instruction', fen: FEN.dev2_after_OO_w, text: 'Black castles O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 2: d3
    { type: 'play-move', fen: FEN.dev2_after_OO_b, correctMove: 'd3', prompt: 'Both sides are castled. How do you build your position?', hint: 'A solid central pawn move that controls e4 and opens the bishop.', correctFeedback: 'd3 shores up the center, controls e4, and opens the c1 bishop.', wrongFeedback: 'Play d3 — it solidifies the center and prepares to develop the c1 bishop.' },
    { type: 'instruction', fen: FEN.dev2_after_d3, text: 'd3 is solid and flexible. It supports e4 if needed and opens a path for the c1 bishop.', arrow: ['d2', 'd3'] },

    // Black plays h6
    { type: 'instruction', fen: FEN.dev2_after_d3, text: 'Black plays h6, preventing Ng5.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // PREDICT 3: Nxd5
    { type: 'play-move', fen: FEN.dev2_after_h6, correctMove: 'Nxd5', prompt: "Black's knight sits on d5. What's the right trade?", hint: 'Capture the centralized knight.', correctFeedback: 'Nxd5 trades off Black\'s strong centralized knight.', wrongFeedback: 'Take the knight on d5 — remove Black\'s best piece from the center.' },
    { type: 'instruction', fen: FEN.dev2_after_Nxd5, text: 'Nxd5 eliminates Black\'s centralized knight. After the recapture, your Bg2 will dominate the long diagonal.', arrow: ['c3', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev2_after_Bc5, text: "Now play all three responses from memory." },
    { type: 'play-move', fen: FEN.dev2_after_Bc5, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev2_after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev2_after_OO_b, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.dev2_after_d3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.dev2_after_h6, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev2_after_Nxd5, text: "O-O, d3, Nxd5 — against the Bc5 setup, castle quickly, solidify with d3, and trade off Black's central knight." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-test-1: Level 1 Test
// Test main line + both deviations. All zero guidance.
// ═══════════════════════════════════════════════════════════

const EN_TEST_1: OpeningLesson = {
  id: 'en-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_e5, text: "Time to prove you know the English Opening. Play the full main line and handle both deviations." },

    // === MAIN LINE RECALL ===
    // Move 1: Nc3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    // Move 2: Nf3
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    // Move 3: g3
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    // Move 4: cxd5
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    // Move 5: Bg2
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Nb6.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },
    // Move 6: O-O
    { type: 'play-move', fen: FEN.after_Nb6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    // Move 7: a3
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'a3', prompt: 'Your move.', hint: 'a3.', correctFeedback: 'a3.', wrongFeedback: 'a3.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    // Move 8: b4
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    // Move 9: Rb1
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Rb1', prompt: 'Your move.', hint: 'Rb1.', correctFeedback: 'Rb1.', wrongFeedback: 'Rb1.' },

    // === DEVIATION 1: 4...Bb4 ===
    { type: 'instruction', fen: FEN.after_g3, text: "Now — Black plays Bb4 instead of d5." },
    { type: 'instruction', fen: FEN.dev1_after_Bb4, text: 'Bb4.', autoAdvance: 800, highlightSquares: ['f8', 'b4'] },
    { type: 'play-move', fen: FEN.dev1_after_Bb4, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.dev1_after_Bg2, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev1_after_OO_b, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev1_after_OO_w, text: 'e4.', autoAdvance: 800, highlightSquares: ['e5', 'e4'] },
    { type: 'play-move', fen: FEN.dev1_after_e4, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },

    // === DEVIATION 2: 6...Bc5 ===
    { type: 'instruction', fen: FEN.after_Bg2, text: "Now — Black plays Bc5 instead of Nb6." },
    { type: 'instruction', fen: FEN.dev2_after_Bc5, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.dev2_after_Bc5, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev2_after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev2_after_OO_b, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.dev2_after_d3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.dev2_after_h6, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Rb1, text: "You passed the English Opening Level 1 test. Main line and both deviations — all down." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-4: The Middlegame Plan (11.d3, 12.b5, 13.Nd2)
// ═══════════════════════════════════════════════════════════

const EN_4: OpeningLesson = {
  id: 'en-4',
  title: 'The Middlegame Plan',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Rb1, text: "Your queenside is rolling. Now you'll solidify the center, lock the queenside with b5, and reroute the knight." },

    // RECAP (all L1 moves: 2.Nc3 through 10.Rb1)
    { type: 'instruction', fen: FEN.after_e5, text: "Full line from the top — show me it's automatic." },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Nb6.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },
    { type: 'play-move', fen: FEN.after_Nb6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'a3', prompt: 'Your move.', hint: 'a3.', correctFeedback: 'a3.', wrongFeedback: 'a3.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Rb1', prompt: 'Your move.', hint: 'Rb1.', correctFeedback: 'Rb1.', wrongFeedback: 'Rb1.' },

    // Black plays f6
    { type: 'instruction', fen: FEN.after_Rb1, text: 'Black plays f6, strengthening the center.', autoAdvance: 800, highlightSquares: ['f7', 'f6'] },

    // PREDICT 1: d3
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd3', prompt: "Black has solidified the center with f6. How do you reinforce yours?", hint: 'A quiet central pawn move that supports e4 and opens the bishop.', correctFeedback: 'd3 shores up the center, prepares e4, and frees the c1 bishop.', wrongFeedback: 'Play d3 — solidify your center before continuing the queenside attack.' },
    { type: 'instruction', fen: FEN.after_d3_L2, text: 'd3 is patient and strong. It controls e4, supports the knight on c3, and opens a diagonal for the c1 bishop.', arrow: ['d2', 'd3'] },

    // Black plays a5
    { type: 'instruction', fen: FEN.after_d3_L2, text: 'Black pushes a5, attacking your b4 pawn.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },

    // PREDICT 2: b5
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'b5', prompt: "Black challenges your queenside with a5. How do you respond?", hint: 'Push the pawn forward — don\'t retreat.', correctFeedback: 'b5 locks the queenside and cramps Black\'s knight on c6.', wrongFeedback: 'Push b5 — advance past the challenge and lock things down.' },
    { type: 'instruction', fen: FEN.after_b5_L2, text: 'b5 is decisive. The knight on c6 is cut off from b4 and d4 is weakened. Your queenside space advantage is permanent.', arrow: ['b4', 'b5'] },

    // Black plays Nd4
    { type: 'instruction', fen: FEN.after_b5_L2, text: 'Black jumps Nd4, seizing the outpost.', autoAdvance: 800, highlightSquares: ['c6', 'd4'] },

    // PREDICT 3: Nd2
    { type: 'play-move', fen: FEN.after_Nd4, correctMove: 'Nd2', prompt: "Black planted a knight on d4. What's your plan?", hint: 'Reroute the knight from f3 — it needs a better square.', correctFeedback: 'Nd2 reroutes the knight toward e4 or c4, where it\'ll be much stronger.', wrongFeedback: 'Play Nd2 — the knight moves to a better circuit via e4 or c4.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Nd2 heads for e4 or c4. From either square it attacks the center and pressures Black\'s position.', arrow: ['f3', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Rb1, text: "Three new moves — play them back." },
    { type: 'instruction', fen: FEN.after_Rb1, text: 'f6.', autoAdvance: 800, highlightSquares: ['f7', 'f6'] },
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3_L2, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5_L2, text: 'Nd4.', autoAdvance: 800, highlightSquares: ['c6', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nd4, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nd2, text: "d3, b5, Nd2 — center locked, queenside sealed, knight rerouting. The English middlegame plan is in motion." },
  ],
}


// ═══════════════════════════════════════════════════════════
// en-test-2: Level 2 Test
// Test main line through L2. All zero guidance.
// ═══════════════════════════════════════════════════════════

const EN_TEST_2: OpeningLesson = {
  id: 'en-test-2',
  title: 'Lvl 2 Test',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_e5, text: "Play the full English Opening through the middlegame plan. All twelve White moves." },

    // === FULL MAIN LINE RECALL ===
    // L1 moves
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Bg2', prompt: 'Your move.', hint: 'Bg2.', correctFeedback: 'Bg2.', wrongFeedback: 'Bg2.' },
    { type: 'instruction', fen: FEN.after_Bg2, text: 'Nb6.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },
    { type: 'play-move', fen: FEN.after_Nb6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'a3', prompt: 'Your move.', hint: 'a3.', correctFeedback: 'a3.', wrongFeedback: 'a3.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Rb1', prompt: 'Your move.', hint: 'Rb1.', correctFeedback: 'Rb1.', wrongFeedback: 'Rb1.' },

    // L2 moves
    { type: 'instruction', fen: FEN.after_Rb1, text: 'f6.', autoAdvance: 800, highlightSquares: ['f7', 'f6'] },
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3_L2, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5_L2, text: 'Nd4.', autoAdvance: 800, highlightSquares: ['c6', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nd4, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nd2, text: "You passed the English Opening Level 2 test. Twelve moves deep — opening through middlegame, all locked in." },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getEnglishLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'en-1': return EN_1
    case 'en-2': return EN_2
    case 'en-3': return EN_3
    case 'en-dev-Bb4': return EN_DEV_BB4
    case 'en-dev-Bc5': return EN_DEV_BC5
    case 'en-test-1': return EN_TEST_1
    case 'en-4': return EN_4
    case 'en-test-2': return EN_TEST_2
    default: return undefined
  }
}
