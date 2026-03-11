import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// KING'S INDIAN DEFENSE LESSONS (ki-1 through ki-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O
//            6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.b4 Nh5
//            10.Re1 f5 11.Ng5 Nf6 12.Bf3 c6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6:   'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_c4:    'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_g6:    'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:   'rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  after_Bg7:   'rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
  after_e4:    'rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4',
  after_d6:    'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5',
  after_Nf3:   'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5',
  after_OO_b:  'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 2 6',
  after_Be2:   'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ - 3 6',
  after_e5:    'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 7',
  after_OO_w:  'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 1 7',
  after_Nc6:   'r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 2 8',
  after_d5:    'r1bq1rk1/ppp2pbp/2np1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 8',
  after_Ne7:   'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 1 9',
  after_b4:    'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/1PP1P3/2N2N2/P3BPPP/R1BQ1RK1 b - - 0 9',
  after_Nh5:   'r1bq1rk1/ppp1npbp/3p2p1/3Pp2n/1PP1P3/2N2N2/P3BPPP/R1BQ1RK1 w - - 1 10',
  after_Re1:   'r1bq1rk1/ppp1npbp/3p2p1/3Pp2n/1PP1P3/2N2N2/P3BPPP/R1BQR1K1 b - - 2 10',
  after_f5:    'r1bq1rk1/ppp1n1bp/3p2p1/3Ppp1n/1PP1P3/2N2N2/P3BPPP/R1BQR1K1 w - - 0 11',
  after_Ng5:   'r1bq1rk1/ppp1n1bp/3p2p1/3PppNn/1PP1P3/2N5/P3BPPP/R1BQR1K1 b - - 1 11',
  after_Nf6b:  'r1bq1rk1/ppp1n1bp/3p1np1/3PppN1/1PP1P3/2N5/P3BPPP/R1BQR1K1 w - - 2 12',
  after_Bf3:   'r1bq1rk1/ppp1n1bp/3p1np1/3PppN1/1PP1P3/2N2B2/P4PPP/R1BQR1K1 b - - 3 12',
  after_c6:    'r1bq1rk1/pp2n1bp/2pp1np1/3PppN1/1PP1P3/2N2B2/P4PPP/R1BQR1K1 w - - 0 13',

  // Deviation: 5.h3
  dev_h3_after_h3:  'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N4P/PP3PP1/R1BQKBNR b KQkq - 0 5',
  dev_h3_after_OO:  'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N4P/PP3PP1/R1BQKBNR w KQ - 1 6',
  dev_h3_after_Be3: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N1B2P/PP3PP1/R2QKBNR b KQ - 2 6',
  dev_h3_after_e5:  'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N1B2P/PP3PP1/R2QKBNR w KQ - 0 7',
  dev_h3_after_d5:  'rnbq1rk1/ppp2pbp/3p1np1/3Pp3/2P1P3/2N1B2P/PP3PP1/R2QKBNR b KQ - 0 7',
  dev_h3_after_Na6: 'r1bq1rk1/ppp2pbp/n2p1np1/3Pp3/2P1P3/2N1B2P/PP3PP1/R2QKBNR w KQ - 1 8',

  // ── Level 2 main line (13.Be3 h6 ... 22.Bb3 Rf5) ──
  l2_after_Be3:     'r1bq1rk1/pp2n1bp/2pp1np1/3PppN1/1PP1P3/2N1BB2/P4PPP/R2QR1K1 b - - 1 13',
  l2_after_h6:      'r1bq1rk1/pp2n1b1/2pp1npp/3PppN1/1PP1P3/2N1BB2/P4PPP/R2QR1K1 w - - 0 14',
  l2_after_Ne6:     'r1bq1rk1/pp2n1b1/2ppNnpp/3Ppp2/1PP1P3/2N1BB2/P4PPP/R2QR1K1 b - - 1 14',
  l2_after_Bxe6:    'r2q1rk1/pp2n1b1/2ppbnpp/3Ppp2/1PP1P3/2N1BB2/P4PPP/R2QR1K1 w - - 0 15',
  l2_after_dxe6:    'r2q1rk1/pp2n1b1/2ppPnpp/4pp2/1PP1P3/2N1BB2/P4PPP/R2QR1K1 b - - 0 15',
  l2_after_fxe4:    'r2q1rk1/pp2n1b1/2ppPnpp/4p3/1PP1p3/2N1BB2/P4PPP/R2QR1K1 w - - 0 16',
  l2_after_Nxe4_w:  'r2q1rk1/pp2n1b1/2ppPnpp/4p3/1PP1N3/4BB2/P4PPP/R2QR1K1 b - - 0 16',
  l2_after_Nxe4_b:  'r2q1rk1/pp2n1b1/2ppP1pp/4p3/1PP1n3/4BB2/P4PPP/R2QR1K1 w - - 0 17',
  l2_after_Bxe4:    'r2q1rk1/pp2n1b1/2ppP1pp/4p3/1PP1B3/4B3/P4PPP/R2QR1K1 b - - 0 17',
  l2_after_d5:      'r2q1rk1/pp2n1b1/2p1P1pp/3pp3/1PP1B3/4B3/P4PPP/R2QR1K1 w - - 0 18',
  l2_after_cxd5_w:  'r2q1rk1/pp2n1b1/2p1P1pp/3Pp3/1P2B3/4B3/P4PPP/R2QR1K1 b - - 0 18',
  l2_after_cxd5_b:  'r2q1rk1/pp2n1b1/4P1pp/3pp3/1P2B3/4B3/P4PPP/R2QR1K1 w - - 0 19',
  l2_after_Bc2:     'r2q1rk1/pp2n1b1/4P1pp/3pp3/1P6/4B3/P1B2PPP/R2QR1K1 b - - 1 19',
  l2_after_b6:      'r2q1rk1/p3n1b1/1p2P1pp/3pp3/1P6/4B3/P1B2PPP/R2QR1K1 w - - 0 20',
  l2_after_Qg4:     'r2q1rk1/p3n1b1/1p2P1pp/3pp3/1P4Q1/4B3/P1B2PPP/R3R1K1 b - - 1 20',
  l2_after_e4_push: 'r2q1rk1/p3n1b1/1p2P1pp/3p4/1P2p1Q1/4B3/P1B2PPP/R3R1K1 w - - 0 21',
  l2_after_Rad1:    'r2q1rk1/p3n1b1/1p2P1pp/3p4/1P2p1Q1/4B3/P1B2PPP/3RR1K1 b - - 1 21',
  l2_after_Qc7:     'r4rk1/p1q1n1b1/1p2P1pp/3p4/1P2p1Q1/4B3/P1B2PPP/3RR1K1 w - - 2 22',

  // ── Level 2 deviation: 13.Bb2 (instead of 13.Be3) ──
  dev_Bb2_after_Bb2:     'r1bq1rk1/pp2n1bp/2pp1np1/3PppN1/1PP1P3/2N2B2/PB3PPP/R2QR1K1 b - - 1 13',
  dev_Bb2_after_h6:      'r1bq1rk1/pp2n1b1/2pp1npp/3PppN1/1PP1P3/2N2B2/PB3PPP/R2QR1K1 w - - 0 14',
  dev_Bb2_after_Ne6:     'r1bq1rk1/pp2n1b1/2ppNnpp/3Ppp2/1PP1P3/2N2B2/PB3PPP/R2QR1K1 b - - 1 14',
  dev_Bb2_after_Bxe6:    'r2q1rk1/pp2n1b1/2ppbnpp/3Ppp2/1PP1P3/2N2B2/PB3PPP/R2QR1K1 w - - 0 15',
  dev_Bb2_after_dxe6:    'r2q1rk1/pp2n1b1/2ppPnpp/4pp2/1PP1P3/2N2B2/PB3PPP/R2QR1K1 b - - 0 15',
  dev_Bb2_after_fxe4:    'r2q1rk1/pp2n1b1/2ppPnpp/4p3/1PP1p3/2N2B2/PB3PPP/R2QR1K1 w - - 0 16',
  dev_Bb2_after_Nxe4_w:  'r2q1rk1/pp2n1b1/2ppPnpp/4p3/1PP1N3/5B2/PB3PPP/R2QR1K1 b - - 0 16',
  dev_Bb2_after_Nxe4_b:  'r2q1rk1/pp2n1b1/2ppP1pp/4p3/1PP1n3/5B2/PB3PPP/R2QR1K1 w - - 0 17',
  dev_Bb2_after_Rxe4:    'r2q1rk1/pp2n1b1/2ppP1pp/4p3/1PP1R3/5B2/PB3PPP/R2Q2K1 b - - 0 17',
  dev_Bb2_after_d5:      'r2q1rk1/pp2n1b1/2p1P1pp/3pp3/1PP1R3/5B2/PB3PPP/R2Q2K1 w - - 0 18',
  dev_Bb2_after_cxd5_w:  'r2q1rk1/pp2n1b1/2p1P1pp/3Pp3/1P2R3/5B2/PB3PPP/R2Q2K1 b - - 0 18',
  dev_Bb2_after_cxd5_b:  'r2q1rk1/pp2n1b1/4P1pp/3pp3/1P2R3/5B2/PB3PPP/R2Q2K1 w - - 0 19',

  // Deviation: 7.Be3
  dev_Be3_after_Be3: 'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N1BN2/PP2BPPP/R2QK2R b KQ - 1 7',
  dev_Be3_after_Ng4: 'rnbq1rk1/ppp2pbp/3p2p1/4p3/2PPP1n1/2N1BN2/PP2BPPP/R2QK2R w KQ - 2 8',
  dev_Be3_after_Bg5: 'rnbq1rk1/ppp2pbp/3p2p1/4p1B1/2PPP1n1/2N2N2/PP2BPPP/R2QK2R b KQ - 3 8',
  dev_Be3_after_f6:  'rnbq1rk1/ppp3bp/3p1pp1/4p1B1/2PPP1n1/2N2N2/PP2BPPP/R2QK2R w KQ - 0 9',
  dev_Be3_after_Bh4: 'rnbq1rk1/ppp3bp/3p1pp1/4p3/2PPP1nB/2N2N2/PP2BPPP/R2QK2R b KQ - 1 9',
  dev_Be3_after_g5:  'rnbq1rk1/ppp3bp/3p1p2/4p1p1/2PPP1nB/2N2N2/PP2BPPP/R2QK2R w KQ - 0 10',
}


// ═══════════════════════════════════════════════════════════
// ki-1: THE SETUP (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const KI_1: OpeningLesson = {
  id: 'ki-1',
  title: 'The Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The King's Indian Defense — you let White build a big center, then blow it up. First, the setup.",
    },

    // ── PREDICT/REVEAL 1: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White opens with d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "What's your first move?",
      hint: 'Develop the knight toward the center.',
      correctFeedback: 'Nf6 controls e4 and d5 — two key central squares.',
      wrongFeedback: 'Try the knight — aim for the center.',
      postMoveArrow: [['f6', 'e4'], ['f6', 'd5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 is flexible — it develops a piece, controls the center, and keeps all your options open.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: g6 ──
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4, grabbing more space.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: "Time to prepare the fianchetto. How?",
      hint: 'Push the g-pawn one square to make room for the bishop.',
      correctFeedback: 'g6 prepares Bg7 — the bishop will be a monster on the long diagonal.',
      wrongFeedback: "Push g6 — you're building the fianchetto.",
      postMoveArrow: ['g6', 'f5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "g6 opens the highway from g7 to a1. Your bishop is about to control that whole diagonal.",
      arrow: ['g7', 'g6'],
    },

    // ── PREDICT/REVEAL 3: Bg7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White develops the knight to c3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: "Complete the fianchetto.",
      hint: 'Put the bishop on g7.',
      correctFeedback: 'Bg7! The bishop fires down the long diagonal, aiming straight at the center.',
      wrongFeedback: 'Place the bishop on g7 to complete the fianchetto.',
      postMoveArrow: [['g7', 'd4'], ['g7', 'c3']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The Bg7 is your best piece. It aims at d4 and will become a weapon once the center opens up.",
      arrow: ['f8', 'g7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play the whole setup from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: 'd4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: 'c4.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: 'Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "That's the King's Indian setup — Nf6, g6, Bg7. Now White will build the center, and you'll strike it down.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-2: THE CENTER STRIKE (4.e4 d6 5.Nf3 O-O 6.Be2 e5)
// ═══════════════════════════════════════════════════════════

const KI_2: OpeningLesson = {
  id: 'ki-2',
  title: 'The Center Strike',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "White is about to build a massive center. Your plan: prepare quietly, then hit it with e5.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me you remember the setup.",
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: 'd4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: 'c4.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: 'Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── PREDICT/REVEAL 1: d6 ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White pushes e4 — a huge center.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "White has pawns on c4, d4, e4. How do you prepare to fight back?",
      hint: 'Support a future e5 push with a pawn move.',
      correctFeedback: "d6 supports e5 and keeps things flexible — you're not challenging yet, just preparing.",
      wrongFeedback: 'Play d6 — it supports the e5 break you need later.',
      postMoveArrow: ['d6', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "d6 is patient. It holds back e5 for the right moment and gives your dark-squared bishop room to breathe.",
      arrow: ['d7', 'd6'],
    },

    // ── PREDICT/REVEAL 2: O-O ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White develops the knight to f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Your king is still in the center. What should you do before starting the fight?",
      hint: 'Get your king to safety first.',
      correctFeedback: "Castle! Your king is safe on g8, and the rook comes to f8 where it'll support f5 later.",
      wrongFeedback: 'Castle kingside — king safety before combat.',
      postMoveArrow: ['f8', 'f2'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Castling tucks the king away and connects the rooks. The f8 rook will be critical later.",
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 3: e5 ──
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "White develops the bishop to e2.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "You're castled and ready. Time to challenge the center — how?",
      hint: 'Strike at the d4 pawn with a pawn of your own.',
      correctFeedback: "e5! You challenge d4 head-on. This is THE move of the King's Indian.",
      wrongFeedback: "Push e5 — it's time to fight for the center.",
      postMoveArrow: ['e5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "e5 attacks d4 and opens the diagonal for your g7 bishop. The real battle starts now.",
      arrow: ['e7', 'e5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Prove you've got these three moves down.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: 'Be2.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "d6, O-O, e5. You've set up the tension — now White has a big decision to make.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-3: THE REROUTE (7.O-O Nc6 8.d5 Ne7 9.b4 Nh5)
// ═══════════════════════════════════════════════════════════

const KI_3: OpeningLesson = {
  id: 'ki-3',
  title: 'The Reroute',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White closes the center with d5. Your plan: reroute the knights toward the kingside.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Quick review — play the last three moves.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: 'Be2.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },

    // ── PREDICT/REVEAL 1: Nc6 ──
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "White just castled. How do you increase pressure on d4?",
      hint: 'Develop the knight to add another attacker to d4.',
      correctFeedback: "Nc6 puts a second piece on d4. White will have to make a decision about the center.",
      wrongFeedback: 'Bring the knight to c6 — pile up on d4.',
      postMoveArrow: ['c6', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Now d4 is attacked twice (e5 pawn and Nc6). White almost always closes with d5 here.",
      arrow: ['b8', 'c6'],
    },

    // ── PREDICT/REVEAL 2: Ne7 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "White closes the center with d5, pushing the knight away.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: "Your knight on c6 is pushed. Where does it go?",
      hint: "Reroute it — Ne7 heads toward the kingside.",
      correctFeedback: "Ne7! The knight is heading to g6 or f5 — both are great kingside squares.",
      wrongFeedback: "Play Ne7 — the knight reroutes toward the king's attack.",
      postMoveArrow: [['e7', 'g6'], ['e7', 'f5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Ne7 is the key rerouting move. From e7 the knight can jump to g6, f5, or support f5 pawn pushes.",
      arrow: ['c6', 'e7'],
    },

    // ── PREDICT/REVEAL 3: Nh5 ──
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "White plays b4, expanding on the queenside.",
      autoAdvance: 800,
      highlightSquares: ['b2', 'b4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_b4,
      correctMove: 'Nh5',
      prompt: "White is pushing on the queenside. What do you do on the kingside?",
      hint: "Move the f6 knight — it's heading for f4.",
      correctFeedback: "Nh5! The knight eyes f4, a dream outpost for the kingside attack.",
      wrongFeedback: 'Play Nh5 — the knight is headed for f4.',
      postMoveArrow: ['h5', 'f4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nh5,
      text: "Nh5 aims for f4. Once it lands there, it supports the f5 pawn break and pressures White's king.",
      arrow: ['f6', 'h5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Play all three rerouting moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: 'Your move.',
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: 'b4.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'b4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_b4,
      correctMove: 'Nh5',
      prompt: 'Your move.',
      hint: 'Nh5.',
      correctFeedback: 'Nh5.',
      wrongFeedback: 'Nh5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nh5,
      text: "Nc6, Ne7, Nh5. Both knights are rerouted toward the kingside. The attack is coming.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-4: THE ATTACK (10.Re1 f5 11.Ng5 Nf6 12.Bf3 c6)
// ═══════════════════════════════════════════════════════════

const KI_4: OpeningLesson = {
  id: 'ki-4',
  title: 'The Attack',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nh5,
      text: "Time to launch the kingside attack. f5 is the key break.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Let's see if you remember the reroute.",
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: 'Your move.',
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: 'b4.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'b4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_b4,
      correctMove: 'Nh5',
      prompt: 'Your move.',
      hint: 'Nh5.',
      correctFeedback: 'Nh5.',
      wrongFeedback: 'Nh5.',
    },

    // ── PREDICT/REVEAL 1: f5 ──
    {
      type: 'instruction',
      fen: FEN.after_Re1,
      text: "White moves the rook to e1, reinforcing the center.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Re1,
      correctMove: 'f5',
      prompt: "Your pieces are ready. How do you open lines toward White's king?",
      hint: 'Push a pawn to crack open the kingside.',
      correctFeedback: "f5! The signature King's Indian break. This opens the f-file and attacks White's e4 pawn.",
      wrongFeedback: "Push f5 — it's the key to the kingside attack.",
      postMoveArrow: ['f5', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_f5,
      text: "f5 is the move you've been building toward. It challenges e4 and opens the f-file for your rook.",
      arrow: ['f7', 'f5'],
    },

    // ── PREDICT/REVEAL 2: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "White jumps Ng5, targeting e6 and f7.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Nf6',
      prompt: "White's knight threatens e6. How do you defend and stay active?",
      hint: 'Bring the h5 knight back to a better square.',
      correctFeedback: "Nf6 covers e4 and d5 while keeping your kingside structure solid.",
      wrongFeedback: 'Play Nf6 — defend and keep your pieces active.',
      postMoveArrow: ['f6', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6b,
      text: "The knight returns to f6, where it defends and controls the center. White's Ng5 achieved nothing.",
      arrow: ['h5', 'f6'],
    },

    // ── PREDICT/REVEAL 3: c6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bf3,
      text: "White plays Bf3, putting pressure on d5.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bf3,
      correctMove: 'c6',
      prompt: "White's bishop and pawn both target d5. How do you fight back?",
      hint: 'Undermine the d5 pawn with a pawn of your own.',
      correctFeedback: "c6 chips away at d5. If White takes, you recapture and open the c-file.",
      wrongFeedback: 'Play c6 to undermine the d5 pawn.',
      postMoveArrow: ['c6', 'd5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 challenges d5 from the base. The center is cracking and your pieces are ready to pour through.",
      arrow: ['c7', 'c6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nh5,
      text: "All three attack moves from memory. Go.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Re1,
      text: 'Re1.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'e1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Re1,
      correctMove: 'f5',
      prompt: 'Your move.',
      hint: 'f5.',
      correctFeedback: 'f5.',
      wrongFeedback: 'f5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: 'Ng5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng5,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bf3,
      text: 'Bf3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "f5, Nf6, c6. The attack is launched and the center is crumbling. That's the King's Indian.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-dev-h3: DEVIATION — White plays 5.h3 (instead of 5.Nf3)
// Teaches: O-O, e5, Na6
// ═══════════════════════════════════════════════════════════

const KI_DEV_H3: OpeningLesson = {
  id: 'ki-dev-h3',
  title: 'Dev 5.h3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Sometimes White plays 5.h3 instead of 5.Nf3. Here's how to handle it.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run through the setup first.",
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: 'd4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: 'c4.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: 'Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_h3,
      text: "White plays 5.h3 instead of 5.Nf3. A slow move — White wants to prevent Bg4 pins later.",
      highlightSquares: ['h2', 'h3'],
    },

    // ── PREDICT/REVEAL 1: O-O ──
    {
      type: 'play-move',
      fen: FEN.dev_h3_after_h3,
      correctMove: 'O-O',
      prompt: "White spent a tempo on h3. What's your best move?",
      hint: 'Get your king safe — same plan as usual.',
      correctFeedback: "Castle! h3 doesn't threaten anything, so you stick to the plan.",
      wrongFeedback: 'Castle kingside — stay on schedule.',
      postMoveArrow: ['f8', 'f2'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_OO,
      text: "White wasted a tempo on h3. You're castled and ready to strike — ahead of schedule.",
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 2: e5 ──
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_Be3,
      text: "White develops the bishop to e3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h3_after_Be3,
      correctMove: 'e5',
      prompt: "Same plan — what's the center break?",
      hint: 'Push e5, just like the main line.',
      correctFeedback: "e5! Same idea, same break. The h3 move didn't change your plan at all.",
      wrongFeedback: 'Push e5 — challenge the center.',
      postMoveArrow: ['e5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_e5,
      text: "e5 hits d4 and activates the Bg7. Your plan doesn't change just because White played h3.",
      arrow: ['e7', 'e5'],
    },

    // ── PREDICT/REVEAL 3: Na6 ──
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_d5,
      text: "White closes with d5.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h3_after_d5,
      correctMove: 'Na6',
      prompt: "The center is closed. Where does the knight develop?",
      hint: "Think about rerouting to c5 — that's a great outpost.",
      correctFeedback: "Na6! The knight heads to c5, where it attacks e4 and controls key squares.",
      wrongFeedback: 'Play Na6 — the knight is heading for c5.',
      postMoveArrow: ['a6', 'c5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_Na6,
      text: "Na6 to c5 is a classic maneuver. The knight on c5 will pressure e4 and White's center.",
      arrow: ['b8', 'a6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_h3,
      text: "White played h3. Show me the response.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_h3_after_h3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h3_after_Be3,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h3_after_d5,
      correctMove: 'Na6',
      prompt: 'Your move.',
      hint: 'Na6.',
      correctFeedback: 'Na6.',
      wrongFeedback: 'Na6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_h3_after_Na6,
      text: "O-O, e5, Na6. White's h3 didn't change anything — you stick to the plan and reroute.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-dev-Be3: DEVIATION — White plays 7.Be3 (instead of 7.O-O)
// Teaches: Ng4, f6, g5
// ═══════════════════════════════════════════════════════════

const KI_DEV_BE3: OpeningLesson = {
  id: 'ki-dev-Be3',
  title: 'Dev 7.Be3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Sometimes White plays 7.Be3 instead of castling. This lets you go on the attack immediately.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Prove you remember the center strike.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: 'Be2.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Be3,
      text: "White plays 7.Be3 instead of castling. The bishop on e3 is exposed — time to attack it.",
      highlightSquares: ['c1', 'e3'],
    },

    // ── PREDICT/REVEAL 1: Ng4 ──
    {
      type: 'play-move',
      fen: FEN.dev_Be3_after_Be3,
      correctMove: 'Ng4',
      prompt: "The bishop just landed on e3. How do you punish it?",
      hint: 'Attack the bishop directly with a knight.',
      correctFeedback: "Ng4! The knight attacks the Be3 and forces White to react.",
      wrongFeedback: 'Jump Ng4 — attack the exposed bishop.',
      postMoveArrow: ['g4', 'e3'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Ng4,
      text: "Ng4 forces the bishop to move again. White is losing time dealing with your threat.",
      arrow: ['f6', 'g4'],
    },

    // ── PREDICT/REVEAL 2: f6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Bg5,
      text: "White plays Bg5, pinning your queen.",
      autoAdvance: 800,
      highlightSquares: ['e3', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Be3_after_Bg5,
      correctMove: 'f6',
      prompt: "White's bishop pins your queen through f6. How do you break the pin?",
      hint: 'Push a pawn to chase the bishop away.',
      correctFeedback: "f6 drives the bishop back. It has nowhere good to go.",
      wrongFeedback: 'Push f6 to break the pin and chase the bishop.',
      postMoveArrow: ['f6', 'g5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_f6,
      text: "f6 kicks the bishop. White has to retreat to h4, where it's running out of squares.",
      arrow: ['f7', 'f6'],
    },

    // ── PREDICT/REVEAL 3: g5 ──
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Bh4,
      text: "White retreats to Bh4.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Be3_after_Bh4,
      correctMove: 'g5',
      prompt: "The bishop is on h4 with nowhere to run. How do you trap it?",
      hint: 'Push another pawn to win the bishop.',
      correctFeedback: "g5! The bishop is trapped on h4 — it has to go to g3 where it's passive.",
      wrongFeedback: 'Push g5 to trap the bishop.',
      postMoveArrow: ['g5', 'f4'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_g5,
      text: "g5 chases the bishop to g3 where it's completely shut out of the game. You won the battle.",
      arrow: ['g6', 'g5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Be3,
      text: "White played Be3. Chase it down.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Be3_after_Be3,
      correctMove: 'Ng4',
      prompt: 'Your move.',
      hint: 'Ng4.',
      correctFeedback: 'Ng4.',
      wrongFeedback: 'Ng4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Bg5,
      text: 'Bg5.',
      autoAdvance: 800,
      highlightSquares: ['e3', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Be3_after_Bg5,
      correctMove: 'f6',
      prompt: 'Your move.',
      hint: 'f6.',
      correctFeedback: 'f6.',
      wrongFeedback: 'f6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_Bh4,
      text: 'Bh4.',
      autoAdvance: 800,
      highlightSquares: ['g5', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Be3_after_Bh4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Be3_after_g5,
      text: "Ng4, f6, g5. When White drops the bishop to e3 before castling, you punish it immediately.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-test-1: LEVEL 1 TEST
// Tests main line + both deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const KI_TEST_1: OpeningLesson = {
  id: 'ki-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the full King's Indian from memory. Main line first, then deviations.",
    },
    // Lesson 1: Nf6, g6, Bg7
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // Lesson 2: d6, O-O, e5
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // Lesson 3: Nc6, Ne7, Nh5
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'b4.', autoAdvance: 800, highlightSquares: ['b2', 'b4'] },
    { type: 'play-move', fen: FEN.after_b4, correctMove: 'Nh5', prompt: 'Your move.', hint: 'Nh5.', correctFeedback: 'Nh5.', wrongFeedback: 'Nh5.' },

    // Lesson 4: f5, Nf6, c6
    { type: 'instruction', fen: FEN.after_Re1, text: 'Re1.', autoAdvance: 800, highlightSquares: ['f1', 'e1'] },
    { type: 'play-move', fen: FEN.after_Re1, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },
    { type: 'instruction', fen: FEN.after_Ng5, text: 'Ng5.', autoAdvance: 800, highlightSquares: ['f3', 'g5'] },
    { type: 'play-move', fen: FEN.after_Ng5, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Bf3, text: 'Bf3.', autoAdvance: 800, highlightSquares: ['e2', 'f3'] },
    { type: 'play-move', fen: FEN.after_Bf3, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },

    // ── DEVIATION 1: 5.h3 ──
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Main line done. Now handle the deviations.",
    },
    { type: 'instruction', fen: FEN.dev_h3_after_h3, text: "White plays 5.h3.", autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.dev_h3_after_h3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_h3_after_Be3, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.dev_h3_after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.dev_h3_after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_h3_after_d5, correctMove: 'Na6', prompt: 'Your move.', hint: 'Na6.', correctFeedback: 'Na6.', wrongFeedback: 'Na6.' },

    // ── DEVIATION 2: 7.Be3 ──
    { type: 'instruction', fen: FEN.dev_Be3_after_Be3, text: "White plays 7.Be3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.dev_Be3_after_Be3, correctMove: 'Ng4', prompt: 'Your move.', hint: 'Ng4.', correctFeedback: 'Ng4.', wrongFeedback: 'Ng4.' },
    { type: 'instruction', fen: FEN.dev_Be3_after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['e3', 'g5'] },
    { type: 'play-move', fen: FEN.dev_Be3_after_Bg5, correctMove: 'f6', prompt: 'Your move.', hint: 'f6.', correctFeedback: 'f6.', wrongFeedback: 'f6.' },
    { type: 'instruction', fen: FEN.dev_Be3_after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.dev_Be3_after_Bh4, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5.', wrongFeedback: 'g5.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-5: FORCING TRADES (13.Be3 h6 14.Ne6 Bxe6 15.dxe6 fxe4)
// First L2 lesson — no recap (L1 test just passed).
// ═══════════════════════════════════════════════════════════

const KI_5: OpeningLesson = {
  id: 'ki-5',
  title: 'Forcing Trades',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "White develops the bishop and the knight invades. Your plan: trade pieces and win the center.",
    },

    // ── PREDICT/REVEAL 1: h6 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Be3,
      text: "White plays Be3, developing the bishop.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Be3,
      correctMove: 'h6',
      prompt: "White's knight on g5 is annoying. How do you kick it?",
      hint: 'A pawn move to threaten the knight.',
      correctFeedback: 'h6 attacks the knight on g5 — it has to move or be captured.',
      wrongFeedback: 'Push h6 to attack the knight on g5.',
      postMoveArrow: ['h6', 'g5'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_h6,
      text: "h6 forces the knight to commit. White will jump to e6, but you have a plan for that.",
      arrow: ['h7', 'h6'],
    },

    // ── PREDICT/REVEAL 2: Bxe6 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne6,
      text: "White jumps Ne6, forking your queen and rook.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: "The knight just landed on e6. How do you deal with it?",
      hint: 'Capture the knight with the bishop from c8.',
      correctFeedback: 'Bxe6 removes the invader. White has to recapture with the pawn.',
      wrongFeedback: 'Take the knight — Bxe6.',
      postMoveArrow: ['e6', 'd8'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Bxe6,
      text: "The knight is gone. White recaptures with dxe6, but now your f-pawn can strike.",
      arrow: ['c8', 'e6'],
    },

    // ── PREDICT/REVEAL 3: fxe4 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_dxe6,
      text: "White recaptures dxe6.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_dxe6,
      correctMove: 'fxe4',
      prompt: "White has a pawn on e6 but your f5 pawn is free to capture. What do you take?",
      hint: 'Capture the e4 pawn with your f-pawn.',
      correctFeedback: 'fxe4 wins a pawn and opens the f-file for your rook.',
      wrongFeedback: 'Take on e4 with the f-pawn.',
      postMoveArrow: ['e4', 'f1'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_fxe4,
      text: "fxe4 wins material and opens the f-file. White's e6 pawn is isolated and weak.",
      arrow: ['f5', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Now play all three moves from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Be3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne6,
      text: 'Ne6.',
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: 'Your move.',
      hint: 'Bxe6.',
      correctFeedback: 'Bxe6.',
      wrongFeedback: 'Bxe6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_dxe6,
      text: 'dxe6.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_dxe6,
      correctMove: 'fxe4',
      prompt: 'Your move.',
      hint: 'fxe4.',
      correctFeedback: 'fxe4.',
      wrongFeedback: 'fxe4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_fxe4,
      text: "h6, Bxe6, fxe4. You forced the trades and came out ahead. The center is yours.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-dev-Bb2: DEVIATION — White plays 13.Bb2 (instead of 13.Be3)
// Teaches: h6, Bxe6, fxe4
// ═══════════════════════════════════════════════════════════

const KI_DEV_BB2: OpeningLesson = {
  id: 'ki-dev-Bb2',
  title: 'Dev 13.Bb2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Sometimes White plays 13.Bb2 instead of 13.Be3. The bishop goes to a different diagonal, but your plan stays the same.",
    },

    // ── RECAP (L2 moves from ki-5) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Quick review before the new stuff.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Be3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne6,
      text: 'Ne6.',
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: 'Your move.',
      hint: 'Bxe6.',
      correctFeedback: 'Bxe6.',
      wrongFeedback: 'Bxe6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_dxe6,
      text: 'dxe6.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_dxe6,
      correctMove: 'fxe4',
      prompt: 'Your move.',
      hint: 'fxe4.',
      correctFeedback: 'fxe4.',
      wrongFeedback: 'fxe4.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_Bb2,
      text: "White plays 13.Bb2 instead of 13.Be3. The bishop goes to the long diagonal, but the knight on g5 is still the problem.",
      highlightSquares: ['c1', 'b2'],
    },

    // ── PREDICT/REVEAL 1: h6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Bb2_after_Bb2,
      correctMove: 'h6',
      prompt: "White's bishop went to b2 instead of e3. What about that knight on g5?",
      hint: 'Same idea — kick the knight.',
      correctFeedback: 'h6! Same response. The knight on g5 still needs to be challenged.',
      wrongFeedback: 'Play h6 — kick the knight regardless of where the bishop went.',
      postMoveArrow: ['h6', 'g5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_h6,
      text: "h6 forces the knight. Whether the bishop is on e3 or b2, the knight on g5 is the priority.",
      arrow: ['h7', 'h6'],
    },

    // ── PREDICT/REVEAL 2: Bxe6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_Ne6,
      text: "White jumps Ne6 again.",
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bb2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: "Same knight jump. Same response?",
      hint: 'Capture the knight.',
      correctFeedback: 'Bxe6! Identical treatment — remove the invader.',
      wrongFeedback: 'Take the knight with Bxe6.',
      postMoveArrow: ['e6', 'd8'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_Bxe6,
      text: "Knight removed. White recaptures dxe6 and now your f-pawn strikes.",
      arrow: ['c8', 'e6'],
    },

    // ── PREDICT/REVEAL 3: fxe4 ──
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_dxe6,
      text: "White recaptures dxe6.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bb2_after_dxe6,
      correctMove: 'fxe4',
      prompt: "Same pawn structure. What captures?",
      hint: 'Take the e4 pawn with the f-pawn.',
      correctFeedback: 'fxe4! Same capture, same advantage. The Bb2 made no difference here.',
      wrongFeedback: 'Capture on e4 with the f-pawn.',
      postMoveArrow: ['e4', 'f1'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_fxe4,
      text: "fxe4 wins the pawn and opens the f-file. The only difference: after Bb2, White recaptures with Rxe4 instead of Bxe4.",
      arrow: ['f5', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_Bb2,
      text: "White played Bb2. Show me the response.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bb2_after_Bb2,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_Ne6,
      text: 'Ne6.',
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bb2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: 'Your move.',
      hint: 'Bxe6.',
      correctFeedback: 'Bxe6.',
      wrongFeedback: 'Bxe6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_dxe6,
      text: 'dxe6.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bb2_after_dxe6,
      correctMove: 'fxe4',
      prompt: 'Your move.',
      hint: 'fxe4.',
      correctFeedback: 'fxe4.',
      wrongFeedback: 'fxe4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Bb2_after_fxe4,
      text: "h6, Bxe6, fxe4. Whether the bishop goes to e3 or b2, your response is the same. One less thing to memorize.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-6: RECAPTURING (16.Nxe4 Nxe4 17.Bxe4 d5 18.cxd5 cxd5)
// ═══════════════════════════════════════════════════════════

const KI_6: OpeningLesson = {
  id: 'ki-6',
  title: 'Recapturing',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_fxe4,
      text: "White recaptures pieces, and you trade right back. Then comes the big break: d5.",
    },

    // ── RECAP (L2 moves: ki-5) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Prove you know these moves!",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Be3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne6,
      text: 'Ne6.',
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: 'Your move.',
      hint: 'Bxe6.',
      correctFeedback: 'Bxe6.',
      wrongFeedback: 'Bxe6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_dxe6,
      text: 'dxe6.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_dxe6,
      correctMove: 'fxe4',
      prompt: 'Your move.',
      hint: 'fxe4.',
      correctFeedback: 'fxe4.',
      wrongFeedback: 'fxe4.',
    },

    // ── PREDICT/REVEAL 1: Nxe4 (Black) ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Nxe4_w,
      text: "White recaptures Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nxe4_w,
      correctMove: 'Nxe4',
      prompt: "White just took on e4. What do you do?",
      hint: 'Recapture with your knight.',
      correctFeedback: 'Nxe4! Trade knights and keep the position clean.',
      wrongFeedback: 'Take back on e4 with your knight.',
      postMoveArrow: ['e4', 'd2'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Nxe4_b,
      text: "Knights traded. Your knight on e4 is well-placed — White has to deal with it.",
      arrow: ['f6', 'e4'],
    },

    // ── PREDICT/REVEAL 2: d5 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Bxe4,
      text: "White takes Bxe4.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Bxe4,
      correctMove: 'd5',
      prompt: "The center is open. Time for the big break. What pawn move?",
      hint: 'Push the d-pawn to challenge the bishop.',
      correctFeedback: 'd5! This attacks the bishop on e4 and opens the position for your pieces.',
      wrongFeedback: 'Push d5 — strike the center while the bishop is exposed.',
      postMoveArrow: ['d5', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_d5,
      text: "d5 hits the bishop and blows the center wide open. White has to move the bishop and recapture.",
      arrow: ['d6', 'd5'],
    },

    // ── PREDICT/REVEAL 3: cxd5 (Black) ──
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_w,
      text: "White captures cxd5.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_cxd5_w,
      correctMove: 'cxd5',
      prompt: "White just took your d5 pawn. How do you recapture?",
      hint: 'Take back with the c-pawn.',
      correctFeedback: 'cxd5 recaptures and gives you a strong central pawn on d5.',
      wrongFeedback: 'Recapture with cxd5.',
      postMoveArrow: ['d5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_b,
      text: "You have a strong passed pawn on d5 and open lines everywhere. The trades worked in your favor.",
      arrow: ['c6', 'd5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.l2_after_fxe4,
      text: "All three recapture moves from memory. Go.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Nxe4_w,
      text: 'Nxe4.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nxe4_w,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Bxe4,
      text: 'Bxe4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Bxe4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_w,
      text: 'cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_cxd5_w,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_b,
      text: "Nxe4, d5, cxd5. Precise recaptures give you a strong center and active pieces.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-7: THE COUNTERATTACK (19.Bc2 b6 20.Qg4 e4 21.Rad1 Qc7)
// ═══════════════════════════════════════════════════════════

const KI_7: OpeningLesson = {
  id: 'ki-7',
  title: 'The Counterattack',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_b,
      text: "You cleared the center. Now secure the queenside, push the e-pawn, and bring the queen into action.",
    },

    // ── RECAP (L2 moves: ki-5 + ki-6) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Show me you've got this.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Be3,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne6,
      text: 'Ne6.',
      autoAdvance: 800,
      highlightSquares: ['g5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne6,
      correctMove: 'Bxe6',
      prompt: 'Your move.',
      hint: 'Bxe6.',
      correctFeedback: 'Bxe6.',
      wrongFeedback: 'Bxe6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_dxe6,
      text: 'dxe6.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_dxe6,
      correctMove: 'fxe4',
      prompt: 'Your move.',
      hint: 'fxe4.',
      correctFeedback: 'fxe4.',
      wrongFeedback: 'fxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Nxe4_w,
      text: 'Nxe4.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nxe4_w,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Bxe4,
      text: 'Bxe4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Bxe4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_w,
      text: 'cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_cxd5_w,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },

    // ── PREDICT/REVEAL 1: b6 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Bc2,
      text: "White retreats the bishop to c2.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'c2'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Bc2,
      correctMove: 'b6',
      prompt: "The bishop retreated. How do you improve your queenside?",
      hint: 'A quiet pawn move to control the c5 and a5 squares.',
      correctFeedback: 'b6 secures the queenside and prepares to activate the bishop on g7.',
      wrongFeedback: 'Play b6 to solidify the queenside.',
      postMoveArrow: ['b6', 'c5'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_b6,
      text: "b6 is a quiet but strong move. It controls c5, supports the d5 pawn, and keeps everything solid.",
      arrow: ['b7', 'b6'],
    },

    // ── PREDICT/REVEAL 2: e4 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Qg4,
      text: "White plays Qg4, targeting your kingside.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Qg4,
      correctMove: 'e4',
      prompt: "White's queen is eyeing your king. What's your counterattack?",
      hint: 'Push the e-pawn forward to gain space.',
      correctFeedback: 'e4! The pawn charges forward, gaining space and cutting off White\'s pieces.',
      wrongFeedback: 'Push e4 — counterattack in the center.',
      postMoveArrow: ['e4', 'e3'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_e4_push,
      text: "e4 is a powerful advance. It restricts White's pieces and creates a passed pawn threat.",
      arrow: ['e5', 'e4'],
    },

    // ── PREDICT/REVEAL 3: Qc7 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Rad1,
      text: "White plays Rad1, putting pressure on d5.",
      autoAdvance: 800,
      highlightSquares: ['a1', 'd1'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Rad1,
      correctMove: 'Qc7',
      prompt: "White put a rook on d1. Where does your queen belong?",
      hint: 'Centralize the queen to connect your rooks.',
      correctFeedback: 'Qc7 centralizes the queen and connects the rooks. Ready for action.',
      wrongFeedback: 'Play Qc7 to centralize and connect.',
      postMoveArrow: ['c7', 'c2'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Qc7,
      text: "Qc7 puts pressure on the c2 bishop and connects your rooks. A flexible, strong position.",
      arrow: ['d8', 'c7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.l2_after_cxd5_b,
      text: "Three counterattack moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Bc2,
      text: 'Bc2.',
      autoAdvance: 800,
      highlightSquares: ['e4', 'c2'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Bc2,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Qg4,
      text: 'Qg4.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Qg4,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Rad1,
      text: 'Rad1.',
      autoAdvance: 800,
      highlightSquares: ['a1', 'd1'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Rad1,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Qc7,
      text: "b6, e4, Qc7. The counterattack is rolling. Your pieces are active and White is on the defensive.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ki-test-2: LEVEL 2 TEST
// Tests all L2 main line moves + Bb2 deviation. Zero guidance.
// ═══════════════════════════════════════════════════════════

const KI_TEST_2: OpeningLesson = {
  id: 'ki-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Play the full Level 2 continuation from memory. Then handle the deviation.",
    },

    // Lesson 5: h6, Bxe6, fxe4
    { type: 'instruction', fen: FEN.l2_after_Be3, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.l2_after_Be3, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.l2_after_Ne6, text: 'Ne6.', autoAdvance: 800, highlightSquares: ['g5', 'e6'] },
    { type: 'play-move', fen: FEN.l2_after_Ne6, correctMove: 'Bxe6', prompt: 'Your move.', hint: 'Bxe6.', correctFeedback: 'Bxe6.', wrongFeedback: 'Bxe6.' },
    { type: 'instruction', fen: FEN.l2_after_dxe6, text: 'dxe6.', autoAdvance: 800, highlightSquares: ['d5', 'e6'] },
    { type: 'play-move', fen: FEN.l2_after_dxe6, correctMove: 'fxe4', prompt: 'Your move.', hint: 'fxe4.', correctFeedback: 'fxe4.', wrongFeedback: 'fxe4.' },

    // Lesson 6: Nxe4, d5, cxd5
    { type: 'instruction', fen: FEN.l2_after_Nxe4_w, text: 'Nxe4.', autoAdvance: 800, highlightSquares: ['c3', 'e4'] },
    { type: 'play-move', fen: FEN.l2_after_Nxe4_w, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.l2_after_Bxe4, text: 'Bxe4.', autoAdvance: 800, highlightSquares: ['f3', 'e4'] },
    { type: 'play-move', fen: FEN.l2_after_Bxe4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.l2_after_cxd5_w, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.l2_after_cxd5_w, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5.', wrongFeedback: 'cxd5.' },

    // Lesson 7: b6, e4, Qc7
    { type: 'instruction', fen: FEN.l2_after_Bc2, text: 'Bc2.', autoAdvance: 800, highlightSquares: ['e4', 'c2'] },
    { type: 'play-move', fen: FEN.l2_after_Bc2, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },
    { type: 'instruction', fen: FEN.l2_after_Qg4, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.l2_after_Qg4, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.l2_after_Rad1, text: 'Rad1.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },
    { type: 'play-move', fen: FEN.l2_after_Rad1, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },

    // ── DEVIATION: 13.Bb2 ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Main line done. Now handle the Bb2 deviation.",
    },
    { type: 'instruction', fen: FEN.dev_Bb2_after_Bb2, text: "White plays 13.Bb2.", autoAdvance: 800, highlightSquares: ['c1', 'b2'] },
    { type: 'play-move', fen: FEN.dev_Bb2_after_Bb2, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.dev_Bb2_after_Ne6, text: 'Ne6.', autoAdvance: 800, highlightSquares: ['g5', 'e6'] },
    { type: 'play-move', fen: FEN.dev_Bb2_after_Ne6, correctMove: 'Bxe6', prompt: 'Your move.', hint: 'Bxe6.', correctFeedback: 'Bxe6.', wrongFeedback: 'Bxe6.' },
    { type: 'instruction', fen: FEN.dev_Bb2_after_dxe6, text: 'dxe6.', autoAdvance: 800, highlightSquares: ['d5', 'e6'] },
    { type: 'play-move', fen: FEN.dev_Bb2_after_dxe6, correctMove: 'fxe4', prompt: 'Your move.', hint: 'fxe4.', correctFeedback: 'fxe4.', wrongFeedback: 'fxe4.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const KINGS_INDIAN_LESSONS: Record<string, OpeningLesson> = {
  'ki-1': KI_1,
  'ki-2': KI_2,
  'ki-3': KI_3,
  'ki-4': KI_4,
  'ki-dev-h3': KI_DEV_H3,
  'ki-dev-Be3': KI_DEV_BE3,
  'ki-test-1': KI_TEST_1,
  'ki-5': KI_5,
  'ki-6': KI_6,
  'ki-7': KI_7,
  'ki-dev-Bb2': KI_DEV_BB2,
  'ki-test-2': KI_TEST_2,
}

export function getKingsIndianLesson(id: string): OpeningLesson | undefined {
  return KINGS_INDIAN_LESSONS[id]
}
