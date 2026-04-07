import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// CARO-KANN SMYSLOV VARIATION LESSONS (cks-1 through cks-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6
//            6.Bd3 e6 7.N1f3 Bd6 8.Qe2 h6 9.Ne4 Nxe4 10.Qxe4 Qc7
//            11.O-O b6 12.Qg4 Kf8
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:         'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:      'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:      'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:      'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:     'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_dxe4:    'rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Nxe4:    'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Nd7:     'r1bqkbnr/pp1npppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng5:     'r1bqkbnr/pp1npppp/2p5/6N1/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_Ngf6:    'r1bqkb1r/pp1npppp/2p2n2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  after_Bd3:     'r1bqkb1r/pp1npppp/2p2n2/6N1/3P4/3B4/PPP2PPP/R1BQK1NR b KQkq - 4 6',
  after_e6:      'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B4/PPP2PPP/R1BQK1NR w KQkq - 0 7',
  after_N1f3:    'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R b KQkq - 1 7',
  after_Bd6:     'r1bqk2r/pp1n1ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 2 8',
  after_Qe2:     'r1bqk2r/pp1n1ppp/2pbpn2/6N1/3P4/3B1N2/PPP1QPPP/R1B1K2R b KQkq - 3 8',
  after_h6:      'r1bqk2r/pp1n1pp1/2pbpn1p/6N1/3P4/3B1N2/PPP1QPPP/R1B1K2R w KQkq - 0 9',
  after_Ne4:          'r1bqk2r/pp1n1pp1/2pbpn1p/8/3PN3/3B1N2/PPP1QPPP/R1B1K2R b KQkq - 1 9',
  after_black_Nxe4:  'r1bqk2r/pp1n1pp1/2pbp2p/8/3Pn3/3B1N2/PPP1QPPP/R1B1K2R w KQkq - 0 10',
  after_Qxe4:        'r1bqk2r/pp1n1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B1K2R b KQkq - 0 10',
  after_Qc7:     'r1b1k2r/ppqn1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B1K2R w KQkq - 1 11',
  after_OO:      'r1b1k2r/ppqn1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B2RK1 b kq - 2 11',
  after_b6:      'r1b1k2r/p1qn1pp1/1ppbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B2RK1 w kq - 0 12',
  after_Qg4:     'r1b1k2r/p1qn1pp1/1ppbp2p/8/3P2Q1/3B1N2/PPP2PPP/R1B2RK1 b kq - 1 12',
  after_Kf8:     'r1b2k1r/p1qn1pp1/1ppbp2p/8/3P2Q1/3B1N2/PPP2PPP/R1B2RK1 w - - 2 13',

  // Deviation: 5.Bd3 Ngf6 6.Ng5 e6 7.N1f3 Bd6
  devBd3_start:      'r1bqkbnr/pp1npppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  devBd3_after_Bd3:  'r1bqkbnr/pp1npppp/2p5/8/3PN3/3B4/PPP2PPP/R1BQK1NR b KQkq - 2 5',
  devBd3_after_Ngf6: 'r1bqkb1r/pp1npppp/2p2n2/8/3PN3/3B4/PPP2PPP/R1BQK1NR w KQkq - 3 6',
  devBd3_after_Ng5:  'r1bqkb1r/pp1npppp/2p2n2/6N1/3P4/3B4/PPP2PPP/R1BQK1NR b KQkq - 4 6',
  devBd3_after_e6:   'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B4/PPP2PPP/R1BQK1NR w KQkq - 0 7',
  devBd3_after_N1f3: 'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R b KQkq - 1 7',
  devBd3_after_Bd6:  'r1bqk2r/pp1n1ppp/2pbpn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 2 8',

  // Deviation: 6.Bc4 e6 7.Qe2 Nb6 8.Bd3 h6
  devBc4_start:      'r1bqkb1r/pp1npppp/2p2n2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  devBc4_after_Bc4:  'r1bqkb1r/pp1npppp/2p2n2/6N1/2BP4/8/PPP2PPP/R1BQK1NR b KQkq - 4 6',
  devBc4_after_e6:   'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/2BP4/8/PPP2PPP/R1BQK1NR w KQkq - 0 7',
  devBc4_after_Qe2:  'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/2BP4/8/PPP1QPPP/R1B1K1NR b KQkq - 1 7',
  devBc4_after_Nb6:  'r1bqkb1r/pp3ppp/1np1pn2/6N1/2BP4/8/PPP1QPPP/R1B1K1NR w KQkq - 2 8',
  devBc4_after_Bd3:  'r1bqkb1r/pp3ppp/1np1pn2/6N1/3P4/3B4/PPP1QPPP/R1B1K1NR b KQkq - 3 8',
  devBc4_after_h6:   'r1bqkb1r/pp3pp1/1np1pn1p/6N1/3P4/3B4/PPP1QPPP/R1B1K1NR w KQkq - 0 9',
  devBc4_after_N5f3: 'r1bqkb1r/pp3pp1/1np1pn1p/8/3P4/3B1N2/PPP1QPPP/R1B1K1NR b KQkq - 1 9',

  // Deviation: 7.Qe2 Bd6 8.N1f3 h6 9.Ne4 Nxe4
  devQe2_start:      'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B4/PPP2PPP/R1BQK1NR w KQkq - 0 7',
  devQe2_after_Qe2:  'r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B4/PPP1QPPP/R1B1K1NR b KQkq - 1 7',
  devQe2_after_Bd6:  'r1bqk2r/pp1n1ppp/2pbpn2/6N1/3P4/3B4/PPP1QPPP/R1B1K1NR w KQkq - 2 8',
  devQe2_after_N1f3: 'r1bqk2r/pp1n1ppp/2pbpn2/6N1/3P4/3B1N2/PPP1QPPP/R1B1K2R b KQkq - 3 8',
  devQe2_after_h6:   'r1bqk2r/pp1n1pp1/2pbpn1p/6N1/3P4/3B1N2/PPP1QPPP/R1B1K2R w KQkq - 0 9',
  devQe2_after_Ne4:  'r1bqk2r/pp1n1pp1/2pbpn1p/8/3PN3/3B1N2/PPP1QPPP/R1B1K2R b KQkq - 1 9',
  devQe2_after_Nxe4: 'r1bqk2r/pp1n1pp1/2pbp2p/8/3Pn3/3B1N2/PPP1QPPP/R1B1K2R w KQkq - 0 10',
  devQe2_after_Qxe4: 'r1bqk2r/pp1n1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B1K2R b KQkq - 0 10',
  devQe2_after_Qc7:  'r1b1k2r/ppqn1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B1K2R w KQkq - 1 11',
  devQe2_after_OO:   'r1b1k2r/ppqn1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B2RK1 b kq - 2 11',
  devQe2_after_b6:   'r1b1k2r/p1qn1pp1/1ppbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B2RK1 w kq - 0 12',
  devQe2_after_Qg4:  'r1b1k2r/p1qn1pp1/1ppbp2p/8/3P2Q1/3B1N2/PPP2PPP/R1B2RK1 b kq - 1 12',
}


// ═══════════════════════════════════════════════════════════
// cks-1: THE SMYSLOV SETUP (1.e4 c6 2.d4 d5 3.Nc3 dxe4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const CKS_1: OpeningLesson = {
  id: 'cks-1',
  title: 'The Smyslov Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Caro-Kann Smyslov Variation — Black plays Nd7 instead of Bf5, keeping the knight flexible and the center solid.",
    },

    // ── PREDICT/REVEAL 1: c6 ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White opens with e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: "White played e4. Start the Caro-Kann.",
      hint: 'Push the c-pawn one square — it prepares d5.',
      correctFeedback: 'c6 sets up d5. You want to challenge the center next move.',
      wrongFeedback: 'Play c6 — it prepares a d5 push.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 is quiet but purposeful — next you push d5 and directly challenge White's center.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 2: d5 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4, staking out more space.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "White grabbed more center space. Fight back.",
      hint: 'Push the d-pawn two squares to attack e4.',
      correctFeedback: 'd5 hits the e4 pawn directly — White has to respond.',
      wrongFeedback: 'Play d5 — challenge White on e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 attacks e4. White brings a knight to defend it — and that's when you capture.",
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 3: dxe4 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White defends e4 with Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: "White defended with Nc3. Take the pawn.",
      hint: 'Capture on e4 with your d-pawn.',
      correctFeedback: 'dxe4 wins the pawn — White will retake with the knight, and then the Smyslov begins.',
      wrongFeedback: 'Capture on e4 with dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "You captured on e4. White retakes with the knight — and instead of Bf5, the Smyslov plays Nd7. The knight heads for c5 or b6.",
      arrow: ['d5', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "The foundation is set. Next you'll learn the key Smyslov idea — developing the knight to d7 instead of the bishop.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-2: KNIGHT TO D7 (4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6)
// ═══════════════════════════════════════════════════════════

const CKS_2: OpeningLesson = {
  id: 'cks-2',
  title: 'Knight to d7',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Here's the Smyslov move: instead of rushing the bishop out, you bring the knight to d7. It covers the center and stays flexible.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's see what you remember!",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },

    // ── PREDICT/REVEAL 1: Nd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White recaptures with Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: "White's knight sits on e4. What's the Smyslov move?",
      hint: 'Develop the queenside knight — not the bishop.',
      correctFeedback: 'Nd7 is the Smyslov. The knight supports e5 or f6 and keeps e6 open for the bishop later.',
      wrongFeedback: 'Play Nd7 — the Smyslov knight development.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 instead of Bf5 — that's the whole Smyslov idea. The knight heads toward f6 to defend, while keeping the f-pawn and e6 flexible.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: Ngf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White lunges forward with Ng5, targeting f7 and e6.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: "White's knight is on g5 and eyeing f7. How do you defend?",
      hint: 'Bring the other knight to f6 — it defends and develops at the same time.',
      correctFeedback: 'Ngf6 develops and defends f7. The d7 knight protects f6 so you can play this safely.',
      wrongFeedback: 'Play Ngf6 — the g8 knight defends against Ng5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ngf6,
      text: "Ngf6 covers f7 and puts a piece in the center. White has to back up the g5 threat now.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 3: e6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White develops the bishop to d3, eyeing h7.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: "White set up the bishop on d3. Shore up the center.",
      hint: 'Push e6 — it closes the diagonal and gives your bishop a future.',
      correctFeedback: 'e6 secures the center and opens the f8 diagonal so your bishop can develop to d6.',
      wrongFeedback: 'Play e6 — close the center and prepare Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 locks things down. Next you'll develop the f8 bishop to d6 — mirroring White's setup on the other diagonal.",
      arrow: ['e7', 'e6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Both knights are out, the center is solid. Next: put the bishop on d6 and get ready for the knight exchange.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-dev-Bd3: IF 5.Bd3 (instead of Ng5)
// Branch from cks-2 (after 4.Nxe4 Nd7)
// Black's 3 moves: Ngf6, e6, Bd6
// ═══════════════════════════════════════════════════════════

const CKS_DEV_BD3: OpeningLesson = {
  id: 'cks-dev-Bd3',
  title: 'If 5.Bd3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.devBd3_start,
      text: "Sometimes White develops the bishop to d3 before pushing the knight to g5. Same plan for Black — just a different move order.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick review before the new stuff.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Bd3,
      text: "White plays Bd3 instead of Ng5 — developing the bishop early.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },

    // ── PREDICT/REVEAL 1: Ngf6 ──
    {
      type: 'play-move',
      fen: FEN.devBd3_after_Bd3,
      correctMove: 'Ngf6',
      prompt: "White developed the bishop early. Keep developing.",
      hint: 'Bring the g8 knight to f6 — it develops and stays ready for anything.',
      correctFeedback: 'Ngf6 develops the last minor piece and keeps Ng5 from being a threat later.',
      wrongFeedback: 'Play Ngf6 — develop the knight.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Ngf6,
      text: "Ngf6 is solid development — and if White ever plays Ng5, you're already prepared to defend f7.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: e6 ──
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Ng5,
      text: "White pushes the knight to g5 after all.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_Ng5,
      correctMove: 'e6',
      prompt: "White's knight is on g5. Secure the center.",
      hint: 'Play e6 — it closes the center and defends f7 indirectly.',
      correctFeedback: 'e6 closes the diagonal and prepares to develop the f8 bishop to d6.',
      wrongFeedback: 'Play e6 — close the center.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_e6,
      text: "e6 shuts down White's threats and keeps everything solid. Now you develop the bishop.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: Bd6 ──
    {
      type: 'instruction',
      fen: FEN.devBd3_after_N1f3,
      text: "White develops the other knight with N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_N1f3,
      correctMove: 'Bd6',
      prompt: "White finished developing. Time to complete your development too.",
      hint: 'Put the bishop on d6 — it mirrors White and prepares kingside activity.',
      correctFeedback: "Bd6 develops the bishop and eyes h2. Now you're fully developed and the position has transposed to the main line.",
      wrongFeedback: 'Play Bd6 — develop the bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Bd6,
      text: "Bd6 completes your development. The position now mirrors the main line — White's move order just delayed Ng5 by one move.",
      arrow: ['f8', 'd6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Bd3,
      text: "Now play all three responses from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_Bd3,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_Ng5,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_N1f3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Bd6,
      text: "Same position as the main line — White just played the moves in a different order. Your plan is the same either way.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-dev-Bc4: IF 6.Bc4 (instead of Bd3)
// Branch from cks-2 (after 5.Ng5 Ngf6)
// Black's 3 moves: e6, Nb6, h6
// ═══════════════════════════════════════════════════════════

const CKS_DEV_BC4: OpeningLesson = {
  id: 'cks-dev-Bc4',
  title: 'If 6.Bc4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.devBc4_start,
      text: "Sometimes White plays Bc4 instead of Bd3 — aiming the bishop at f7. Close the diagonal and kick it back.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Prove you know these moves!",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bc4,
      text: "White plays Bc4 instead of Bd3 — aiming the bishop straight at f7.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },

    // ── PREDICT/REVEAL 1: e6 ──
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Bc4,
      correctMove: 'e6',
      prompt: "White's bishop is pointing at f7. What do you play?",
      hint: 'Close the diagonal — one move shuts down the threat.',
      correctFeedback: 'e6 blocks the c4 bishop from reaching f7. The threat is neutralized.',
      wrongFeedback: 'Play e6 — close the c4-f7 diagonal.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_e6,
      text: "e6 shuts the bishop out of f7. White will back the bishop up — and that's when you use your knight.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: Nb6 ──
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Qe2,
      text: "White brings out the queen to e2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Qe2,
      correctMove: 'Nb6',
      prompt: "White played Qe2. How do you attack the misplaced bishop?",
      hint: 'The d7 knight can go to b6 and attack the bishop on c4.',
      correctFeedback: 'Nb6 attacks the bishop on c4 — it has to move, giving you a free tempo.',
      wrongFeedback: 'Play Nb6 — attack the bishop on c4.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Nb6,
      text: "Nb6 hits the bishop and forces it to retreat. You gain a tempo while developing.",
      arrow: ['d7', 'b6'],
    },

    // ── PREDICT/REVEAL 3: h6 ──
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bd3,
      text: "The bishop retreats to d3.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Bd3,
      correctMove: 'h6',
      prompt: "White's bishop retreated to d3. The g5 knight is still lurking. What do you play?",
      hint: 'Kick the knight off g5 — one pawn move does it.',
      correctFeedback: 'h6 attacks the g5 knight and forces it to retreat. You control the kingside pawn advance.',
      wrongFeedback: 'Play h6 — attack the knight on g5.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_h6,
      text: "h6 chases the knight away. White has to back up, and you've gained space on the kingside.",
      arrow: ['h7', 'h6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bc4,
      text: "Now play all three responses from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Bc4,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Qe2,
      correctMove: 'Nb6',
      prompt: 'Your move.',
      hint: 'Nb6.',
      correctFeedback: 'Nb6.',
      wrongFeedback: 'Nb6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Bd3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.devBc4_after_h6,
      text: "Well handled — you closed the diagonal, gained a tempo with Nb6, and chased the knight with h6. That's how you punish Bc4.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-3: BISHOP OUT (7.N1f3 Bd6 8.Qe2 h6 9.Ne4 Nxe4)
// ═══════════════════════════════════════════════════════════

const CKS_3: OpeningLesson = {
  id: 'cks-3',
  title: 'Bishop Out',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Time to develop the f8 bishop. It goes to d6, matching White's bishop — and then you kick the g5 knight and prepare the key exchange.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me you've got this.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },

    // ── PREDICT/REVEAL 1: Bd6 ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "White brings the other knight to f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_N1f3,
      correctMove: 'Bd6',
      prompt: "White completed the knight development. Where does your bishop go?",
      hint: 'The bishop develops to d6 — mirror White and aim at h2.',
      correctFeedback: 'Bd6 develops the bishop, challenges White on the diagonal, and prepares to trade knights on e4.',
      wrongFeedback: 'Play Bd6 — put the bishop on the active diagonal.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Bd6 is a key square — the bishop eyes h2 and keeps pressure on White's kingside setup.",
      arrow: ['f8', 'd6'],
    },

    // ── PREDICT/REVEAL 2: h6 ──
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "White centralizes the queen on e2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qe2,
      correctMove: 'h6',
      prompt: "White's queen is on e2. The g5 knight is still around. What do you play?",
      hint: 'Kick the knight off g5 with a pawn move.',
      correctFeedback: 'h6 forces the g5 knight to move — it will go to e4 where you can trade it off.',
      wrongFeedback: 'Play h6 — chase the knight from g5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 forces the knight to retreat. White typically plays Ne4 — and that's the trade you want.",
      arrow: ['h7', 'h6'],
    },

    // ── PREDICT/REVEAL 3: Nxe4 ──
    {
      type: 'instruction',
      fen: FEN.after_Ne4,
      text: "White retreats the knight to e4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ne4,
      correctMove: 'Nxe4',
      prompt: "The knight went to e4. Trade it off.",
      hint: 'Capture on e4 with your f6 knight.',
      correctFeedback: 'Nxe4 trades the knights and clears the center. White will recapture with the queen.',
      wrongFeedback: 'Play Nxe4 — take the knight on e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_black_Nxe4,
      text: "The knight trade clears the center. White's queen will recapture — and then you play Qc7, the key Smyslov move.",
      arrow: ['f6', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_N1f3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qe2,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne4,
      text: "White plays Ne4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ne4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_black_Nxe4,
      text: "The center is clear. Next lesson: play Qc7, develop b6, and handle the Qg4 check with Kf8.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-dev-Qe2: IF 7.Qe2 (instead of N1f3)
// Branch from cks-3 (after 6.Bd3 e6)
// Black's 3 moves: Bd6, h6, Nxe4
// ═══════════════════════════════════════════════════════════

const CKS_DEV_QE2: OpeningLesson = {
  id: 'cks-dev-Qe2',
  title: 'If 7.Qe2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.devQe2_start,
      text: "Sometimes White plays Qe2 before N1f3 — a slight move-order change. Your plan stays the same: Bd6, h6, then trade on e4.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick review before the new stuff.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Qe2,
      text: "White plays Qe2 before developing the f3 knight — a different move order.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },

    // ── PREDICT/REVEAL 1: Bd6 ──
    {
      type: 'play-move',
      fen: FEN.devQe2_after_Qe2,
      correctMove: 'Bd6',
      prompt: "White brought the queen to e2 early. Keep developing.",
      hint: 'Develop the bishop to d6 — same plan as the main line.',
      correctFeedback: 'Bd6 develops normally. The queen on e2 does not change your plan.',
      wrongFeedback: 'Play Bd6 — develop the bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Bd6,
      text: "Bd6 is the right move regardless of White's queen. Your bishop belongs on d6.",
      arrow: ['f8', 'd6'],
    },

    // ── PREDICT/REVEAL 2: h6 ──
    {
      type: 'instruction',
      fen: FEN.devQe2_after_N1f3,
      text: "White develops N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_N1f3,
      correctMove: 'h6',
      prompt: "White played N1f3. Same situation — g5 knight still there. What do you play?",
      hint: 'Kick the g5 knight with h6.',
      correctFeedback: 'h6 forces the g5 knight to move — Ne4 follows, and you trade it off.',
      wrongFeedback: 'Play h6 — chase the knight from g5.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_h6,
      text: "h6 forces the knight to retreat. The rest plays out just like the main line.",
      arrow: ['h7', 'h6'],
    },

    // ── PREDICT/REVEAL 3: Nxe4 ──
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Ne4,
      text: "White plays Ne4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_Ne4,
      correctMove: 'Nxe4',
      prompt: "The knight stepped to e4. Trade it off.",
      hint: 'Capture on e4 with your f6 knight.',
      correctFeedback: 'Nxe4 trades the knights. This is the same position as the main line after the exchange.',
      wrongFeedback: 'Play Nxe4 — take the knight.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Nxe4,
      text: "The position now transposes exactly into the main line. White's Qe2 before N1f3 made no real difference.",
      arrow: ['f6', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Qe2,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_Qe2,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_N1f3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Ne4,
      text: "White plays Ne4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_Ne4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Nxe4,
      text: "Same result whether White plays Qe2 first or N1f3 first. Your plan works either way.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-4: KING STEPS UP (10.Qxe4 Qc7 11.O-O b6 12.Qg4 Kf8)
// ═══════════════════════════════════════════════════════════

const CKS_4: OpeningLesson = {
  id: 'cks-4',
  title: 'King Steps Up',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_black_Nxe4,
      text: "After the knight trade, White's queen recaptures on e4. Now come the three key Smyslov moves: Qc7, b6, and the remarkable Kf8.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's see what you remember!",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_N1f3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qe2,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne4,
      text: "White plays Ne4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ne4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // ── PREDICT/REVEAL 1: Qc7 ──
    {
      type: 'instruction',
      fen: FEN.after_Qxe4,
      text: "White recaptures with Qxe4. The queen is strong on e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxe4,
      correctMove: 'Qc7',
      prompt: "White's queen sits on e4. Where do you put your queen?",
      hint: 'The queen goes to c7 — it protects the bishop on d6 and attacks e5.',
      correctFeedback: 'Qc7 defends the d6 bishop from Qxh7 threats and prepares queenside expansion.',
      wrongFeedback: 'Play Qc7 — activate the queen and defend d6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Qc7 is active and practical — it covers d6, prepares b6, and keeps an eye on the center.",
      arrow: ['d8', 'c7'],
    },

    // ── PREDICT/REVEAL 2: b6 ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles kingside.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'b6',
      prompt: "White castled. Prepare to develop your dark-squared bishop.",
      hint: 'Push b6 — it gives the c8 bishop a route to b7 or a6.',
      correctFeedback: 'b6 prepares to fianchetto the bishop and gives Black active play on the queenside.',
      wrongFeedback: 'Play b6 — prepare to develop the c8 bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b6,
      text: "b6 opens the diagonal for the c8 bishop. It's heading to b7 or a6 — and it will be very active.",
      arrow: ['b7', 'b6'],
    },

    // ── PREDICT/REVEAL 3: Kf8 ──
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: "White pushes the queen to g4, threatening to fork with Qxg7.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qg4,
      correctMove: 'Kf8',
      prompt: "White's queen is on g4 and eyeing g7. How do you handle the threat?",
      hint: 'The king steps to f8 — it sidesteps the g4 queen and tucks away safely.',
      correctFeedback: 'Kf8 is the Smyslov king — it sidesteps the queen threat and the king is actually safe on f8.',
      wrongFeedback: 'Play Kf8 — tuck the king to safety.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kf8,
      text: "Kf8 is a signature Smyslov move. The king is safe on f8, the rook on h8 stays connected, and Black has a fully playable position.",
      arrow: ['e8', 'f8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_black_Nxe4,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxe4,
      text: "White plays Qxe4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxe4,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: "White plays Qg4.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qg4,
      correctMove: 'Kf8',
      prompt: 'Your move.',
      hint: 'Kf8.',
      correctFeedback: 'Kf8.',
      wrongFeedback: 'Kf8.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kf8,
      text: "That's the full Smyslov Variation. Qc7 activates the queen, b6 prepares the bishop, and Kf8 sidesteps the queen threat. The level test is next.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cks-test-1: LEVEL TEST
// Tests main line + all 3 deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const CKS_TEST_1: OpeningLesson = {
  id: 'cks-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE: 12 Black moves ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_N1f3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qe2,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne4,
      text: "White plays Ne4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ne4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxe4,
      text: "White plays Qxe4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxe4,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: "White plays Qg4.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qg4,
      correctMove: 'Kf8',
      prompt: 'Your move.',
      hint: 'Kf8.',
      correctFeedback: 'Kf8.',
      wrongFeedback: 'Kf8.',
    },

    // ── DEVIATION: 5.Bd3 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_Bd3,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_Ng5,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBd3_after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBd3_after_N1f3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },

    // ── DEVIATION: 6.Bc4 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Bc4,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Qe2,
      correctMove: 'Nb6',
      prompt: 'Your move.',
      hint: 'Nb6.',
      correctFeedback: 'Nb6.',
      wrongFeedback: 'Nb6.',
    },
    {
      type: 'instruction',
      fen: FEN.devBc4_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBc4_after_Bd3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── DEVIATION: 7.Qe2 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White plays Ng5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Qe2,
      text: "White plays Qe2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_Qe2,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_N1f3,
      text: "White plays N1f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_N1f3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.devQe2_after_Ne4,
      text: "White plays Ne4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.devQe2_after_Ne4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP
// ═══════════════════════════════════════════════════════════

export function getCaroKannSmyslovLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'cks-1':         return CKS_1
    case 'cks-2':         return CKS_2
    case 'cks-dev-Bd3':   return CKS_DEV_BD3
    case 'cks-dev-Bc4':   return CKS_DEV_BC4
    case 'cks-3':         return CKS_3
    case 'cks-dev-Qe2':   return CKS_DEV_QE2
    case 'cks-4':         return CKS_4
    case 'cks-test-1':    return CKS_TEST_1
    default:              return undefined
  }
}
