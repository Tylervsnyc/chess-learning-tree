import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN DEFENSE LESSONS (si-1 through si-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line (Najdorf): 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6
//            6.Be3 e5 7.Nb3 Be6 8.f3 h5 9.Nd5 Bxd5 10.exd5 Nbd7
//            11.Qd2 g6 12.Be2 Bg7
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c5:    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:   'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_d6:    'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  after_d4:    'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3',
  after_cxd4:  'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  after_Nxd4:  'rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  after_Nf6:   'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  after_Nc3:   'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  after_a6:    'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  after_Be3:   'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6',
  after_e5:    'rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7',
  after_Nb3:   'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R b KQkq - 1 7',
  after_Be6:   'rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq - 2 8',
  after_f3:    'rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R b KQkq - 0 8',
  after_h5:    'rn1qkb1r/1p3pp1/p2pbn2/4p2p/4P3/1NN1BP2/PPP3PP/R2QKB1R w KQkq - 0 9',
  after_Nd5:   'rn1qkb1r/1p3pp1/p2pbn2/3Np2p/4P3/1N2BP2/PPP3PP/R2QKB1R b KQkq - 1 9',
  after_Bxd5:  'rn1qkb1r/1p3pp1/p2p1n2/3bp2p/4P3/1N2BP2/PPP3PP/R2QKB1R w KQkq - 0 10',
  after_exd5:  'rn1qkb1r/1p3pp1/p2p1n2/3Pp2p/8/1N2BP2/PPP3PP/R2QKB1R b KQkq - 0 10',
  after_Nbd7:  'r2qkb1r/1p1n1pp1/p2p1n2/3Pp2p/8/1N2BP2/PPP3PP/R2QKB1R w KQkq - 1 11',
  after_Qd2:   'r2qkb1r/1p1n1pp1/p2p1n2/3Pp2p/8/1N2BP2/PPPQ2PP/R3KB1R b KQkq - 2 11',
  after_g6:    'r2qkb1r/1p1n1p2/p2p1np1/3Pp2p/8/1N2BP2/PPPQ2PP/R3KB1R w KQkq - 0 12',
  after_Be2:   'r2qkb1r/1p1n1p2/p2p1np1/3Pp2p/8/1N2BP2/PPPQB1PP/R3K2R b KQkq - 1 12',
  after_Bg7:   'r2qk2r/1p1n1pb1/p2p1np1/3Pp2p/8/1N2BP2/PPPQB1PP/R3K2R w KQkq - 2 13',

  // Bridge moves: 13.O-O-O O-O 14.g4 b5 15.g5 b4
  after_OOO:   'r2qk2r/1p1n1pb1/p2p1np1/3Pp2p/8/1N2BP2/PPPQB1PP/2KR3R b kq - 3 13',
  after_OO:    'r2q1rk1/1p1n1pb1/p2p1np1/3Pp2p/8/1N2BP2/PPPQB1PP/2KR3R w - - 4 14',
  after_g4:    'r2q1rk1/1p1n1pb1/p2p1np1/3Pp2p/6P1/1N2BP2/PPPQB2P/2KR3R b - - 0 14',
  after_b5:    'r2q1rk1/3n1pb1/p2p1np1/1p1Pp2p/6P1/1N2BP2/PPPQB2P/2KR3R w - - 0 15',
  after_g5:    'r2q1rk1/3n1pb1/p2p1np1/1p1Pp1Pp/8/1N2BP2/PPPQB2P/2KR3R b - - 0 15',
  after_b4:    'r2q1rk1/3n1pb1/p2p1np1/3Pp1Pp/1p6/1N2BP2/PPPQB2P/2KR3R w - - 0 16',

  // Deviation: 6.Be2 (instead of 6.Be3)
  // Line: 5...a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6
  devBe2_after_Be2:   'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 1 6',
  devBe2_after_e5:    'rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq - 0 7',
  devBe2_after_Nb3:   'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQK2R b KQkq - 1 7',
  devBe2_after_Be7:   'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQK2R w KQkq - 2 8',
  devBe2_after_OO_w:  'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQ1RK1 b kq - 3 8',
  devBe2_after_OO_b:  'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQ1RK1 w - - 4 9',
  devBe2_after_Be3:   'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 b - - 5 9',
  devBe2_after_Be6:   'rn1q1rk1/1p2bppp/p2pbn2/4p3/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 6 10',

  // ═══════════════════════════════════════════════════════════
  // LEVEL 2 FENs
  // Main line: 12...b4 13.Ne2 Ne8 14.f4 a5 15.f5 a4
  //            16.Nbd4 exd4 17.Nxd4 b3 18.Kb1 bxc2+ 19.Nxc2
  // ═══════════════════════════════════════════════════════════
  l2_after_b4:     'r2q1rk1/3nbppp/p2pbn2/4p1P1/1p2P3/1NN1BP2/PPPQ3P/2KR1B1R w - - 0 13',
  l2_after_Ne2:    'r2q1rk1/3nbppp/p2pbn2/4p1P1/1p2P3/1N2BP2/PPPQN2P/2KR1B1R b - - 1 13',
  l2_after_Ne8:    'r2qnrk1/3nbppp/p2pb3/4p1P1/1p2P3/1N2BP2/PPPQN2P/2KR1B1R w - - 2 14',
  l2_after_f4:     'r2qnrk1/3nbppp/p2pb3/4p1P1/1p2PP2/1N2B3/PPPQN2P/2KR1B1R b - - 0 14',
  l2_after_a5:     'r2qnrk1/3nbppp/3pb3/p3p1P1/1p2PP2/1N2B3/PPPQN2P/2KR1B1R w - - 0 15',
  l2_after_f5:     'r2qnrk1/3nbppp/3pb3/p3pPP1/1p2P3/1N2B3/PPPQN2P/2KR1B1R b - - 0 15',
  l2_after_a4:     'r2qnrk1/3nbppp/3pb3/4pPP1/pp2P3/1N2B3/PPPQN2P/2KR1B1R w - - 0 16',
  l2_after_Nbd4:   'r2qnrk1/3nbppp/3pb3/4pPP1/pp1NP3/4B3/PPPQN2P/2KR1B1R b - - 1 16',
  l2_after_exd4:   'r2qnrk1/3nbppp/3pb3/5PP1/pp1pP3/4B3/PPPQN2P/2KR1B1R w - - 0 17',
  l2_after_Nxd4:   'r2qnrk1/3nbppp/3pb3/5PP1/pp1NP3/4B3/PPPQ3P/2KR1B1R b - - 0 17',
  l2_after_b3:     'r2qnrk1/3nbppp/3pb3/5PP1/p2NP3/1p2B3/PPPQ3P/2KR1B1R w - - 0 18',
  l2_after_Kb1:    'r2qnrk1/3nbppp/3pb3/5PP1/p2NP3/1p2B3/PPPQ3P/1K1R1B1R b - - 1 18',
  l2_after_bxc2:   'r2qnrk1/3nbppp/3pb3/5PP1/p2NP3/4B3/PPpQ3P/1K1R1B1R w - - 0 19',
  l2_after_Nxc2:   'r2qnrk1/3nbppp/3pb3/5PP1/p3P3/4B3/PPNQ3P/1K1R1B1R b - - 0 19',

  // Deviation: 16.fxe6 (instead of 16.Nbd4)
  // Line: 15...a4 16.fxe6 axb3 17.cxb3 fxe6 18.Bh3 Rxa2
  devFxe6_after_fxe6:  'r2qnrk1/3nbppp/3pP3/4p1P1/pp2P3/1N2B3/PPPQN2P/2KR1B1R b - - 0 16',
  devFxe6_after_axb3:  'r2qnrk1/3nbppp/3pP3/4p1P1/1p2P3/1p2B3/PPPQN2P/2KR1B1R w - - 0 17',
  devFxe6_after_cxb3:  'r2qnrk1/3nbppp/3pP3/4p1P1/1p2P3/1P2B3/PP1QN2P/2KR1B1R b - - 0 17',
  devFxe6_after_fxe6b: 'r2qnrk1/3nb1pp/3pp3/4p1P1/1p2P3/1P2B3/PP1QN2P/2KR1B1R w - - 0 18',
  devFxe6_after_Bh3:   'r2qnrk1/3nb1pp/3pp3/4p1P1/1p2P3/1P2B2B/PP1QN2P/2KR3R b - - 1 18',
  devFxe6_after_Rxa2:  '3qnrk1/3nb1pp/3pp3/4p1P1/1p2P3/1P2B2B/rP1QN2P/2KR3R w - - 0 19',

  // Deviation: 7.Nf3 (instead of 7.Nb3)
  // Line: 6...e5 7.Nf3 Be7 8.Bc4 O-O 9.O-O Be6 10.Bb3
  devNf3_after_Nf3:   'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/2N1BN2/PPP2PPP/R2QKB1R b KQkq - 1 7',
  devNf3_after_Be7:   'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/2N1BN2/PPP2PPP/R2QKB1R w KQkq - 2 8',
  devNf3_after_Bc4:   'rnbqk2r/1p2bppp/p2p1n2/4p3/2B1P3/2N1BN2/PPP2PPP/R2QK2R b KQkq - 3 8',
  devNf3_after_OO_b:  'rnbq1rk1/1p2bppp/p2p1n2/4p3/2B1P3/2N1BN2/PPP2PPP/R2QK2R w KQ - 4 9',
  devNf3_after_OO_w:  'rnbq1rk1/1p2bppp/p2p1n2/4p3/2B1P3/2N1BN2/PPP2PPP/R2Q1RK1 b - - 5 9',
  devNf3_after_Be6:   'rn1q1rk1/1p2bppp/p2pbn2/4p3/2B1P3/2N1BN2/PPP2PPP/R2Q1RK1 w - - 6 10',
  devNf3_after_Bb3:   'rn1q1rk1/1p2bppp/p2pbn2/4p3/4P3/1BN1BN2/PPP2PPP/R2Q1RK1 b - - 7 10',
}


// ═══════════════════════════════════════════════════════════
// si-1: THE SICILIAN MOVE (1.e4 c5 2.Nf3 d6 3.d4 cxd4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SI_1: OpeningLesson = {
  id: 'si-1',
  title: 'The Sicilian Move',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Sicilian Defense — the most aggressive answer to 1.e4. You fight for the center on your own terms.",
    },

    // ── PREDICT/REVEAL 1: c5 ──
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
      correctMove: 'c5',
      prompt: "White played e4. How do you fight for the center?",
      hint: 'Push the c-pawn — challenge d4 without mirroring White.',
      correctFeedback: "c5! The Sicilian. You attack d4 immediately but create an asymmetric fight.",
      wrongFeedback: 'Play c5 — the Sicilian move.',
      postMoveArrow: ['c5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 stops White from building a perfect center with d4. Unlike e5, it creates an imbalanced game where Black fights for counterplay.",
      arrow: ['c7', 'c5'],
    },

    // ── PREDICT/REVEAL 2: d6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White develops the knight to f3, preparing d4.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'd6',
      prompt: "White wants to push d4 next. How do you prepare?",
      hint: 'A flexible pawn move that supports e5 later.',
      correctFeedback: "d6 is flexible — it supports a future e5 break and keeps your options wide open.",
      wrongFeedback: 'Play d6 — stay flexible.',
      postMoveArrow: ['d6', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "d6 doesn't commit to anything yet. It supports e5 for later and lets your pieces develop naturally.",
      arrow: ['d7', 'd6'],
    },

    // ── PREDICT/REVEAL 3: cxd4 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White pushes d4, challenging your c5 pawn.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'cxd4',
      prompt: "White pushed d4. What do you do?",
      hint: 'Capture — win the center exchange.',
      correctFeedback: "cxd4! You trade a c-pawn for a d-pawn. White gets a central majority, but you get the open c-file.",
      wrongFeedback: 'Capture with cxd4.',
      postMoveArrow: [['d4', 'c3'], ['d4', 'e3']],
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd4,
      text: "After cxd4, White must recapture. You already have an open c-file for your rook and an asymmetric pawn structure — exactly what the Sicilian wants.",
      arrow: ['c5', 'd4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play the whole sequence from memory.",
      buttonText: "LET'S GO",
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
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
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
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'cxd4',
      prompt: 'Your move.',
      hint: 'cxd4.',
      correctFeedback: 'cxd4.',
      wrongFeedback: 'cxd4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_cxd4,
      text: "c5, d6, cxd4. That's the Sicilian move order — you've traded a flank pawn for a center pawn and opened the c-file. The counterattack begins.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-2: THE NAJDORF (4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5)
// ═══════════════════════════════════════════════════════════

const SI_2: OpeningLesson = {
  id: 'si-2',
  title: 'The Najdorf',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_cxd4,
      text: "White recaptures and develops. Now you enter the Najdorf — the sharpest system in all of chess.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me the opening moves first.",
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
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
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
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'cxd4',
      prompt: 'Your move.',
      hint: 'cxd4.',
      correctFeedback: 'cxd4.',
      wrongFeedback: 'cxd4.',
    },

    // ── PREDICT/REVEAL 1: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "White recaptures with the knight.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nf6',
      prompt: "White has a knight on d4. How do you develop?",
      hint: 'Develop a knight toward the center and attack e4.',
      correctFeedback: "Nf6 develops naturally and puts pressure on e4 — White's most important pawn.",
      wrongFeedback: 'Play Nf6 — develop and pressure e4.',
      postMoveArrow: ['f6', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 hits e4 immediately. White has to defend it or lose the center.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: a6 ──
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
      correctMove: 'a6',
      prompt: "This is where the Najdorf gets its name. What's the signature move?",
      hint: 'A little pawn move on the a-file that does a lot.',
      correctFeedback: "a6! The Najdorf move. It prevents Bb5, prepares b5, and keeps maximum flexibility.",
      wrongFeedback: 'Play a6 — the Najdorf move.',
      postMoveArrow: ['a6', 'b5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "a6 looks small but it's huge. It stops Bb5 pins, prepares b5 queenside expansion, and waits to see what White does before committing.",
      arrow: ['a7', 'a6'],
    },

    // ── PREDICT/REVEAL 3: e5 ──
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "White develops the bishop to e3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'e5',
      prompt: "White is developing. Time to grab space — how?",
      hint: 'Push a pawn to kick the knight and claim the center.',
      correctFeedback: "e5! You kick the knight off d4 and plant a pawn right in the center.",
      wrongFeedback: 'Push e5 — claim the center and kick the knight.',
      postMoveArrow: ['e5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "e5 is the aggressive Najdorf approach. The knight has to move, and you own the center.",
      arrow: ['e7', 'e5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_cxd4,
      text: "Three Najdorf moves from memory. Go.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: 'Nxd4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
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
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
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
      text: "Nf6, a6, e5. You're in the Najdorf now — the knight is retreating and you own the center.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-3: THE BISHOP TRADE (7.Nb3 Be6 8.f3 h5 9.Nd5 Bxd5)
// ═══════════════════════════════════════════════════════════

const SI_3: OpeningLesson = {
  id: 'si-3',
  title: 'The Bishop Trade',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White retreats the knight. Now you develop the bishop, play aggressively with h5, and set up a powerful trade.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_cxd4,
      text: "Let's run through the Najdorf moves.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: 'Nxd4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
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
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },

    // ── PREDICT/REVEAL 1: Be6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: "White retreats the knight to b3.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'Be6',
      prompt: "The knight retreated. How do you continue developing?",
      hint: 'Develop the light-squared bishop to an active square.',
      correctFeedback: "Be6 develops the bishop to its best diagonal and connects with the knight on d5 later.",
      wrongFeedback: 'Play Be6 — develop the bishop actively.',
      postMoveArrow: [['e6', 'd5'], ['e6', 'a2']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "Be6 is a natural developing move. The bishop controls d5 and supports future queenside play.",
      arrow: ['c8', 'e6'],
    },

    // ── PREDICT/REVEAL 2: h5 ──
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: "White plays f3, supporting e4 and preparing a kingside push.",
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'h5',
      prompt: "White is preparing to expand on the kingside. How do you fight back?",
      hint: 'A bold pawn push to slow down White\'s g4 plans.',
      correctFeedback: "h5! A modern, aggressive move. It stops White from playing g4 and creates kingside tension.",
      wrongFeedback: 'Push h5 — stop g4 and fight for space.',
      postMoveArrow: ['h5', 'g4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "h5 is a sharp move that prevents White from expanding with g4. It also opens the h-file for your rook later.",
      arrow: ['h7', 'h5'],
    },

    // ── PREDICT/REVEAL 3: Bxd5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "White jumps a knight to d5, challenging your position.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Bxd5',
      prompt: "White's knight just landed on d5. What do you do?",
      hint: 'Trade the bishop for the knight — it damages White\'s pawn structure.',
      correctFeedback: "Bxd5! You give up the bishop pair, but after exd5 White's pawn structure is rigid and the e-file opens for your rook.",
      wrongFeedback: 'Capture with Bxd5 — wreck White\'s pawns.',
      postMoveArrow: [['d5', 'e4'], ['d5', 'c4']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxd5,
      text: "After Bxd5, White recaptures with exd5. That locks in White's pawn structure and opens the e-file for your rook. A great trade.",
      arrow: ['e6', 'd5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "All three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: 'Nb3.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'Be6',
      prompt: 'Your move.',
      hint: 'Be6.',
      correctFeedback: 'Be6.',
      wrongFeedback: 'Be6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: 'f3.',
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'h5',
      prompt: 'Your move.',
      hint: 'h5.',
      correctFeedback: 'h5.',
      wrongFeedback: 'h5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: 'Nd5.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Bxd5',
      prompt: 'Your move.',
      hint: 'Bxd5.',
      correctFeedback: 'Bxd5.',
      wrongFeedback: 'Bxd5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd5,
      text: "Be6, h5, Bxd5. You developed, prevented g4, and wrecked White's pawn structure. The Najdorf at its finest.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-4: COMPLETE THE SETUP (10.exd5 Nbd7 11.Qd2 g6 12.Be2 Bg7)
// ═══════════════════════════════════════════════════════════

const SI_4: OpeningLesson = {
  id: 'si-4',
  title: 'Complete the Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd5,
      text: "White recaptures on d5. Time to finish developing — knight, bishop, and prepare for the middlegame.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Quick review — the bishop trade sequence.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: 'Nb3.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'Be6',
      prompt: 'Your move.',
      hint: 'Be6.',
      correctFeedback: 'Be6.',
      wrongFeedback: 'Be6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: 'f3.',
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'h5',
      prompt: 'Your move.',
      hint: 'h5.',
      correctFeedback: 'h5.',
      wrongFeedback: 'h5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: 'Nd5.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Bxd5',
      prompt: 'Your move.',
      hint: 'Bxd5.',
      correctFeedback: 'Bxd5.',
      wrongFeedback: 'Bxd5.',
    },

    // ── PREDICT/REVEAL 1: Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White recaptures with exd5, doubling the d-pawns.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Nbd7',
      prompt: "White has doubled d-pawns. How do you develop the queenside knight?",
      hint: 'The knight goes to d7, supporting e5 and preparing to reroute.',
      correctFeedback: "Nbd7 supports e5 and gives the knight flexible options — c5 or f8 depending on what White does.",
      wrongFeedback: 'Play Nbd7 — support e5 and keep options open.',
      postMoveArrow: ['d7', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Nbd7 is solid. The knight supports e5 and can reroute to c5, b6, or f8 depending on the position.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: g6 ──
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "White plays Qd2, connecting the rooks.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'g6',
      prompt: "Where does your dark-squared bishop belong?",
      hint: 'Prepare a fianchetto — the bishop will be powerful on the long diagonal.',
      correctFeedback: "g6 prepares Bg7 — the bishop will be a monster on the long diagonal, aiming at White's queenside.",
      wrongFeedback: 'Play g6 — prepare the fianchetto.',
      postMoveArrow: ['g6', 'f5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "g6 opens the highway for your bishop. From g7, it'll control the entire a1-h8 diagonal.",
      arrow: ['g7', 'g6'],
    },

    // ── PREDICT/REVEAL 3: Bg7 ──
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
      correctMove: 'Bg7',
      prompt: "Complete the fianchetto.",
      hint: 'Put the bishop on g7.',
      correctFeedback: "Bg7! The bishop is a powerhouse on the long diagonal — it supports e5 and eyes White's queenside.",
      wrongFeedback: 'Play Bg7 — complete the fianchetto.',
      postMoveArrow: ['g7', 'a1'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The Bg7 fires down the long diagonal. Combined with Nbd7 supporting e5, your position is rock solid and ready to attack.",
      arrow: ['f8', 'g7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd5,
      text: "Finish the setup from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: 'exd5.',
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: 'Qd2.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
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
      text: "Nbd7, g6, Bg7. Your development is complete — the knight supports e5, and the bishop dominates the long diagonal. The Najdorf setup is ready.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-dev-Be2: DEVIATION — White plays 6.Be2 (instead of 6.Be3)
// Teaches: e5, Be7, O-O
// ═══════════════════════════════════════════════════════════

const SI_DEV_BE2: OpeningLesson = {
  id: 'si-dev-Be2',
  title: 'Dev 6.Be2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "Sometimes White plays 6.Be2 instead of 6.Be3. A quieter approach — but your plan barely changes.",
    },

    // ── RECAP (lessons 1+2 = moves up to deviation point) ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's get to the deviation point first.",
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
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
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
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'cxd4',
      prompt: 'Your move.',
      hint: 'cxd4.',
      correctFeedback: 'cxd4.',
      wrongFeedback: 'cxd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: 'Nxd4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
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
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.devBe2_after_Be2,
      text: "White plays 6.Be2 instead of 6.Be3. A more restrained move — White wants to castle quickly.",
      highlightSquares: ['f1', 'e2'],
    },

    // ── PREDICT/REVEAL 1: e5 ──
    {
      type: 'play-move',
      fen: FEN.devBe2_after_Be2,
      correctMove: 'e5',
      prompt: "White played Be2 instead of Be3. What do you do?",
      hint: 'Same idea — grab the center.',
      correctFeedback: "e5! Same plan as always. Kick the knight and claim the center.",
      wrongFeedback: 'Push e5 — the plan doesn\'t change.',
      postMoveArrow: ['e5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.devBe2_after_e5,
      text: "e5 works just as well against Be2. The knight still has to retreat.",
      arrow: ['e7', 'e5'],
    },

    // ── PREDICT/REVEAL 2: Be7 ──
    {
      type: 'instruction',
      fen: FEN.devBe2_after_Nb3,
      text: "White retreats the knight to b3.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBe2_after_Nb3,
      correctMove: 'Be7',
      prompt: "How do you continue developing?",
      hint: 'Develop the bishop and prepare to castle.',
      correctFeedback: "Be7 develops the bishop and clears the way for castling. Simple and strong.",
      wrongFeedback: 'Play Be7 — develop and prepare to castle.',
      postMoveArrow: ['e7', 'g5'],
    },
    {
      type: 'instruction',
      fen: FEN.devBe2_after_Be7,
      text: "Be7 is solid. The bishop defends the kingside and you're one move away from castling.",
      arrow: ['f8', 'e7'],
    },

    // ── PREDICT/REVEAL 3: O-O ──
    {
      type: 'instruction',
      fen: FEN.devBe2_after_OO_w,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.devBe2_after_OO_w,
      correctMove: 'O-O',
      prompt: "White castled. What now?",
      hint: 'Get your king safe too.',
      correctFeedback: "Castle! Both sides are castled kingside. The fight moves to the center and queenside.",
      wrongFeedback: 'Castle kingside.',
      postMoveArrow: ['f8', 'f2'],
    },
    {
      type: 'instruction',
      fen: FEN.devBe2_after_OO_b,
      text: "You're castled and fully developed. Against 6.Be2, the Najdorf plays out more quietly — but you still have a great position.",
      arrow: ['e8', 'g8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.devBe2_after_Be2,
      text: "White played Be2. Show me the response.",
    },
    {
      type: 'play-move',
      fen: FEN.devBe2_after_Be2,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.devBe2_after_Nb3,
      text: 'Nb3.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.devBe2_after_Nb3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.devBe2_after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.devBe2_after_OO_w,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.devBe2_after_OO_b,
      text: "e5, Be7, O-O. Against 6.Be2, you play the same center break and develop naturally. No surprises.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-dev-Nf3: DEVIATION — White plays 7.Nf3 (instead of 7.Nb3)
// Teaches: Be7, O-O, Be6
// ═══════════════════════════════════════════════════════════

const SI_DEV_NF3: OpeningLesson = {
  id: 'si-dev-Nf3',
  title: 'Dev 7.Nf3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Sometimes White retreats the knight to f3 instead of b3. White wants to play Bc4 and target f7 — here's how to handle it.",
    },

    // ── RECAP (lesson 2 moves: Nf6, a6, e5) ──
    {
      type: 'instruction',
      fen: FEN.after_cxd4,
      text: "Prove you remember the Najdorf moves.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: 'Nxd4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
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
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Nf3,
      text: "White retreats the knight to f3 instead of b3. From here White usually plays Bc4, targeting your f7 pawn.",
      highlightSquares: ['d4', 'f3'],
    },

    // ── PREDICT/REVEAL 1: Be7 ──
    {
      type: 'play-move',
      fen: FEN.devNf3_after_Nf3,
      correctMove: 'Be7',
      prompt: "White's knight went to f3. How do you develop?",
      hint: 'Develop the bishop and prepare to castle.',
      correctFeedback: "Be7 develops smoothly and prepares castling. Don't rush — just keep developing.",
      wrongFeedback: 'Play Be7 — develop and prepare to castle.',
      postMoveArrow: ['e7', 'g5'],
    },
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Be7,
      text: "Be7 is calm and strong. You're ready to castle next.",
      arrow: ['f8', 'e7'],
    },

    // ── PREDICT/REVEAL 2: O-O ──
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Bc4,
      text: "White plays Bc4, aiming at f7.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.devNf3_after_Bc4,
      correctMove: 'O-O',
      prompt: "White's bishop targets f7. What's your priority?",
      hint: 'Get your king safe — f7 is defended by the king after castling.',
      correctFeedback: "Castle! Your king is safe and f7 is defended. The bishop on c4 isn't threatening anything.",
      wrongFeedback: 'Castle — king safety first.',
      postMoveArrow: ['f8', 'f3'],
    },
    {
      type: 'instruction',
      fen: FEN.devNf3_after_OO_b,
      text: "With the king castled, f7 is safe and your rook is active on f8. White's Bc4 achieved nothing.",
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 3: Be6 ──
    {
      type: 'instruction',
      fen: FEN.devNf3_after_OO_w,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.devNf3_after_OO_w,
      correctMove: 'Be6',
      prompt: "Both sides are castled. How do you challenge White's bishop on c4?",
      hint: 'Develop the bishop to attack c4.',
      correctFeedback: "Be6 challenges the Bc4 directly. White will have to retreat it, wasting time.",
      wrongFeedback: 'Play Be6 — challenge the bishop.',
      postMoveArrow: ['e6', 'c4'],
    },
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Be6,
      text: "Be6 forces Bb3 and you've equalized comfortably. White's Bc4 plan didn't achieve anything.",
      arrow: ['c8', 'e6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Nf3,
      text: "White played Nf3. Handle it.",
    },
    {
      type: 'play-move',
      fen: FEN.devNf3_after_Nf3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Bc4,
      text: 'Bc4.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.devNf3_after_Bc4,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.devNf3_after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.devNf3_after_OO_w,
      correctMove: 'Be6',
      prompt: 'Your move.',
      hint: 'Be6.',
      correctFeedback: 'Be6.',
      wrongFeedback: 'Be6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.devNf3_after_Be6,
      text: "Be7, O-O, Be6. Against 7.Nf3 Bc4, you develop naturally and challenge the bishop. Simple chess.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-test-1: LEVEL 1 TEST
// Tests main line + both deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const SI_TEST_1: OpeningLesson = {
  id: 'si-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the full Sicilian Najdorf from memory. Main line first, then deviations.",
    },
    // Lesson 1: c5, d6, cxd4
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // Lesson 2: Nf6, a6, e5
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // Lesson 3: Be6, h5, Bxd5
    { type: 'instruction', fen: FEN.after_Nb3, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_f3, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h5', prompt: 'Your move.', hint: 'h5.', correctFeedback: 'h5.', wrongFeedback: 'h5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Bxd5', prompt: 'Your move.', hint: 'Bxd5.', correctFeedback: 'Bxd5.', wrongFeedback: 'Bxd5.' },

    // Lesson 4: Nbd7, g6, Bg7
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Qd2, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // ── DEVIATION 1: 6.Be2 ──
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "Main line done. Now handle the deviations.",
    },
    { type: 'instruction', fen: FEN.devBe2_after_Be2, text: "White plays 6.Be2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.devBe2_after_Nb3, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.devBe2_after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.devBe2_after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // ── DEVIATION 2: 7.Nf3 ──
    { type: 'instruction', fen: FEN.devNf3_after_Nf3, text: "White plays 7.Nf3.", autoAdvance: 800, highlightSquares: ['d4', 'f3'] },
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.devNf3_after_Bc4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.devNf3_after_Bc4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devNf3_after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devNf3_after_OO_w, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-5: CASTLE & PUSH (13.O-O-O O-O 14.g4 b5 15.g5 b4)
// Bridges L1 ending (after_Bg7) to L2 positions.
// ═══════════════════════════════════════════════════════════

const SI_5: OpeningLesson = {
  id: 'si-5',
  title: 'Castle & Push',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Development is done. Now both sides castle on opposite wings and launch pawn storms. You castle short and push b5-b4 to attack.",
    },

    // ── RECAP (si-3 and si-4 moves) ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Let's run through the last two lessons first.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: 'Nb3.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'Be6',
      prompt: 'Your move.',
      hint: 'Be6.',
      correctFeedback: 'Be6.',
      wrongFeedback: 'Be6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: 'f3.',
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'h5',
      prompt: 'Your move.',
      hint: 'h5.',
      correctFeedback: 'h5.',
      wrongFeedback: 'h5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: 'Nd5.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Bxd5',
      prompt: 'Your move.',
      hint: 'Bxd5.',
      correctFeedback: 'Bxd5.',
      wrongFeedback: 'Bxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: 'exd5.',
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: 'Qd2.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
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
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── PREDICT/REVEAL 1: O-O ──
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "White castles queenside, putting the king behind the pawn wall and connecting the rooks.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'O-O',
      prompt: "White castled queenside. Where does your king go?",
      hint: 'Castle kingside — tuck the king away and activate the rook.',
      correctFeedback: "O-O! You castle short. Now your rook is connected and your king is safe behind the g6/Bg7 fortress.",
      wrongFeedback: 'Castle kingside with O-O.',
      postMoveArrow: ['f8', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Both sides have castled on opposite wings. This means a pawn storm race — White attacks your king, you attack White's. Opposite-side castling is the sharpest middlegame structure.",
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 2: b5 ──
    {
      type: 'instruction',
      fen: FEN.after_g4,
      text: "White pushes g4, starting the kingside attack.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'b5',
      prompt: "White starts the kingside storm with g4. How do you counter?",
      hint: 'Push the b-pawn — race on the queenside.',
      correctFeedback: "b5! You launch the queenside pawn storm. While White pushes g4-g5, you push b5-b4 toward the White king.",
      wrongFeedback: 'Push b5 — counterattack on the queenside.',
      postMoveArrow: ['b5', 'b4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "b5 starts your queenside attack. The plan is b4, kicking the knight and opening lines toward White's king on c1.",
      arrow: ['b7', 'b5'],
    },

    // ── PREDICT/REVEAL 3: b4 ──
    {
      type: 'instruction',
      fen: FEN.after_g5,
      text: "White pushes g5, chasing your knight off f6.",
      autoAdvance: 800,
      highlightSquares: ['g4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'b4',
      prompt: "White's g5 is coming for your knight. Keep pushing — what's your move?",
      hint: 'Advance the b-pawn again — attack the knight on b3.',
      correctFeedback: "b4! You keep the queenside pressure on. The pawn attacks White's knight and threatens to crack open the b-file.",
      wrongFeedback: 'Push b4 — keep the attack rolling.',
      postMoveArrow: ['b4', 'b3'],
    },
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "b4 attacks the knight on b3 and threatens to push further. Your queenside storm is faster than White's kingside attack.",
      arrow: ['b5', 'b4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "All three from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: 'O-O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g4,
      text: 'g4.',
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g5,
      text: 'g5.',
      autoAdvance: 800,
      highlightSquares: ['g4', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'b4',
      prompt: 'Your move.',
      hint: 'b4.',
      correctFeedback: 'b4.',
      wrongFeedback: 'b4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "O-O, b5, b4. You castled safe, then launched a pawn storm aimed straight at White's king. The race is on.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-6: THE COUNTERATTACK (13.Ne2 Ne8 14.f4 a5 15.f5 a4)
// ═══════════════════════════════════════════════════════════

const SI_6: OpeningLesson = {
  id: 'si-6',
  title: 'The Counterattack',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_b4,
      text: "White regroups with Ne2. You retreat the knight to safety and launch an a-pawn counterattack.",
    },

    // ── PREDICT/REVEAL 1: Ne8 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne2,
      text: "White plays Ne2, repositioning the knight.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne2,
      correctMove: 'Ne8',
      prompt: "White's g5 pawn is threatening your knight on f6. How do you save it?",
      hint: 'Pull the knight back to a safe square where it can reroute.',
      correctFeedback: "Ne8! The knight retreats to safety and can reroute to c7 or d6 later.",
      wrongFeedback: 'Play Ne8 — save the knight from g5.',
      postMoveArrow: ['e8', 'c7'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne8,
      text: "Ne8 looks passive but it's the only good square. From e8, the knight can go to c7, d6, or even f6 later if g5 advances.",
      arrow: ['f6', 'e8'],
    },

    // ── PREDICT/REVEAL 2: a5 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_f4,
      text: "White pushes f4, opening the f-file and threatening f5.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'f4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f4,
      correctMove: 'a5',
      prompt: "White is pushing forward on the kingside. How do you fight back?",
      hint: 'Counter on the queenside — push the a-pawn.',
      correctFeedback: "a5! While White attacks on the kingside, you advance on the queenside. Classic Najdorf counterplay.",
      wrongFeedback: 'Push a5 — counterattack on the queenside.',
      postMoveArrow: ['a5', 'a4'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_a5,
      text: "a5 starts the queenside counterattack. The a-pawn will push to a4, undermining White's knight on b3.",
      arrow: ['a6', 'a5'],
    },

    // ── PREDICT/REVEAL 3: a4 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_f5,
      text: "White plays f5, closing the kingside and eyeing e6.",
      autoAdvance: 800,
      highlightSquares: ['f4', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f5,
      correctMove: 'a4',
      prompt: "White pushed f5. Keep the queenside pressure going — what's next?",
      hint: 'Keep pushing the a-pawn to kick the knight.',
      correctFeedback: "a4! The pawn attacks the knight on b3, forcing it to move or be captured.",
      wrongFeedback: 'Push a4 — attack the knight on b3.',
      postMoveArrow: ['a4', 'b3'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_a4,
      text: "a4 puts serious pressure on b3. White's knight has to move, and your queenside attack is rolling.",
      arrow: ['a5', 'a4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.l2_after_b4,
      text: "Three moves from memory. Go.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne2,
      text: 'Ne2.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne2,
      correctMove: 'Ne8',
      prompt: 'Your move.',
      hint: 'Ne8.',
      correctFeedback: 'Ne8.',
      wrongFeedback: 'Ne8.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_f4,
      text: 'f4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'f4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f4,
      correctMove: 'a5',
      prompt: 'Your move.',
      hint: 'a5.',
      correctFeedback: 'a5.',
      wrongFeedback: 'a5.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_f5,
      text: 'f5.',
      autoAdvance: 800,
      highlightSquares: ['f4', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f5,
      correctMove: 'a4',
      prompt: 'Your move.',
      hint: 'a4.',
      correctFeedback: 'a4.',
      wrongFeedback: 'a4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_a4,
      text: "Ne8, a5, a4. You retreated safely and launched a queenside counterattack while White pushed on the kingside. That's the Najdorf way.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-7: BREAKING THROUGH (16.Nbd4 exd4 17.Nxd4 b3 18.Kb1 bxc2+)
// ═══════════════════════════════════════════════════════════

const SI_7: OpeningLesson = {
  id: 'si-7',
  title: 'Breaking Through',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_a4,
      text: "White sacrifices the knight with Nbd4. You trade, push b3 into the heart of White's position, and crack everything open.",
    },

    // ── RECAP (si-6 moves: Ne8, a5, a4) ──
    {
      type: 'instruction',
      fen: FEN.l2_after_b4,
      text: "Show me you've got this.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne2,
      text: 'Ne2.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne2,
      correctMove: 'Ne8',
      prompt: 'Your move.',
      hint: 'Ne8.',
      correctFeedback: 'Ne8.',
      wrongFeedback: 'Ne8.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_f4,
      text: 'f4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'f4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f4,
      correctMove: 'a5',
      prompt: 'Your move.',
      hint: 'a5.',
      correctFeedback: 'a5.',
      wrongFeedback: 'a5.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_f5,
      text: 'f5.',
      autoAdvance: 800,
      highlightSquares: ['f4', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f5,
      correctMove: 'a4',
      prompt: 'Your move.',
      hint: 'a4.',
      correctFeedback: 'a4.',
      wrongFeedback: 'a4.',
    },

    // ── PREDICT/REVEAL 1: exd4 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Nbd4,
      text: "White plays Nbd4, sacrificing the knight into the center.",
      autoAdvance: 800,
      highlightSquares: ['b3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nbd4,
      correctMove: 'exd4',
      prompt: "White's knight just jumped to d4. What do you do?",
      hint: 'Take the knight — open lines and keep your pawns moving.',
      correctFeedback: "exd4! You capture the knight and open the e-file for your rook.",
      wrongFeedback: 'Capture with exd4 — take the knight.',
      postMoveArrow: ['e5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_exd4,
      text: "After exd4, the e-file opens and your rook on f8 can swing over. White recaptures with Nxd4.",
      arrow: ['e5', 'd4'],
    },

    // ── PREDICT/REVEAL 2: b3 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Nxd4,
      text: "White recaptures with Nxd4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nxd4,
      correctMove: 'b3',
      prompt: "Your b4 pawn is ready to cause chaos. How?",
      hint: 'Push the b-pawn one more square — right into White\'s camp.',
      correctFeedback: "b3! The pawn crashes into White's second rank, threatening to open lines toward the king.",
      wrongFeedback: 'Push b3 — invade White\'s position.',
      postMoveArrow: ['b3', 'c2'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_b3,
      text: "b3 is a dagger. It threatens bxc2, ripping open the queenside right next to White's king on c1.",
      arrow: ['b4', 'b3'],
    },

    // ── PREDICT/REVEAL 3: bxc2+ ──
    {
      type: 'instruction',
      fen: FEN.l2_after_Kb1,
      text: "White sidesteps with Kb1.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'b1'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Kb1,
      correctMove: 'bxc2+',
      prompt: "The king moved to b1. How do you keep the pressure on?",
      hint: 'Capture the c2 pawn — it comes with check.',
      correctFeedback: "bxc2+! You take the pawn with check, forcing White to deal with the invasion.",
      wrongFeedback: 'Capture bxc2+ — take with check.',
      postMoveArrow: ['c2', 'b1'],
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_bxc2,
      text: "bxc2+ forces the knight to recapture. You've destroyed White's queenside pawn structure and opened lines toward the king.",
      arrow: ['b3', 'c2'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.l2_after_a4,
      text: "All three from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Nbd4,
      text: 'Nbd4.',
      autoAdvance: 800,
      highlightSquares: ['b3', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nbd4,
      correctMove: 'exd4',
      prompt: 'Your move.',
      hint: 'exd4.',
      correctFeedback: 'exd4.',
      wrongFeedback: 'exd4.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Nxd4,
      text: 'Nxd4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Nxd4,
      correctMove: 'b3',
      prompt: 'Your move.',
      hint: 'b3.',
      correctFeedback: 'b3.',
      wrongFeedback: 'b3.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Kb1,
      text: 'Kb1.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'b1'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Kb1,
      correctMove: 'bxc2+',
      prompt: 'Your move.',
      hint: 'bxc2+.',
      correctFeedback: 'bxc2+.',
      wrongFeedback: 'bxc2+.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_bxc2,
      text: "exd4, b3, bxc2+. You traded the knight, invaded White's camp, and ripped open the queenside. The Najdorf counterattack is in full swing.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-dev-fxe6: DEVIATION — White plays 16.fxe6 (instead of 16.Nbd4)
// Teaches: axb3, fxe6, Rxa2
// ═══════════════════════════════════════════════════════════

const SI_DEV_FXE6: OpeningLesson = {
  id: 'si-dev-fxe6',
  title: 'Dev 16.fxe6',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.l2_after_a4,
      text: "Sometimes White captures with 16.fxe6 instead of 16.Nbd4. You punish it by grabbing the b3 pawn and invading on the a-file.",
    },

    // ── RECAP (si-6 moves: Ne8, a5, a4) ──
    {
      type: 'instruction',
      fen: FEN.l2_after_b4,
      text: "Quick review before the new stuff.",
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_Ne2,
      text: 'Ne2.',
      autoAdvance: 800,
      highlightSquares: ['c3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_Ne2,
      correctMove: 'Ne8',
      prompt: 'Your move.',
      hint: 'Ne8.',
      correctFeedback: 'Ne8.',
      wrongFeedback: 'Ne8.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_f4,
      text: 'f4.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'f4'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f4,
      correctMove: 'a5',
      prompt: 'Your move.',
      hint: 'a5.',
      correctFeedback: 'a5.',
      wrongFeedback: 'a5.',
    },
    {
      type: 'instruction',
      fen: FEN.l2_after_f5,
      text: 'f5.',
      autoAdvance: 800,
      highlightSquares: ['f4', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.l2_after_f5,
      correctMove: 'a4',
      prompt: 'Your move.',
      hint: 'a4.',
      correctFeedback: 'a4.',
      wrongFeedback: 'a4.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_fxe6,
      text: "White plays 16.fxe6 instead of 16.Nbd4, capturing your bishop's pawn. Time to make them pay.",
      highlightSquares: ['f5', 'e6'],
    },

    // ── PREDICT/REVEAL 1: axb3 ──
    {
      type: 'play-move',
      fen: FEN.devFxe6_after_fxe6,
      correctMove: 'axb3',
      prompt: "White just captured on e6. What's your priority?",
      hint: 'Grab the knight on b3 — your a4 pawn is right there.',
      correctFeedback: "axb3! You capture the knight and threaten to crash into c2. Don't worry about e6 yet.",
      wrongFeedback: 'Capture axb3 — take the knight first.',
      postMoveArrow: ['b3', 'c2'],
    },
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_axb3,
      text: "axb3 wins a piece. White's pawn on e6 is annoying, but your queenside attack is more dangerous.",
      arrow: ['a4', 'b3'],
    },

    // ── PREDICT/REVEAL 2: fxe6 ──
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_cxb3,
      text: "White recaptures with cxb3.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.devFxe6_after_cxb3,
      correctMove: 'fxe6',
      prompt: "Now deal with that pawn on e6. How?",
      hint: 'Recapture the pawn — clear it off e6.',
      correctFeedback: "fxe6 removes the intruder and opens the f-file for your rook.",
      wrongFeedback: 'Capture fxe6 — take back the pawn.',
      postMoveArrow: ['f8', 'f1'],
    },
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_fxe6b,
      text: "fxe6 cleans up the pawn and opens the f-file. Your rook on f8 is now staring down the board.",
      arrow: ['f7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: Rxa2 ──
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_Bh3,
      text: "White plays Bh3, targeting e6.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'h3'],
    },
    {
      type: 'play-move',
      fen: FEN.devFxe6_after_Bh3,
      correctMove: 'Rxa2',
      prompt: "White's bishop eyes e6. But you have a bigger threat — what is it?",
      hint: 'The a2 pawn is completely undefended. Grab it with the rook.',
      correctFeedback: "Rxa2! You invade with the rook and threaten to wreak havoc on White's second rank.",
      wrongFeedback: 'Play Rxa2 — invade on the a-file.',
      postMoveArrow: ['a2', 'b2'],
    },
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_Rxa2,
      text: "Rxa2 is devastating. The rook is deep in White's position, the b3 pawn is weak, and White's king is exposed.",
      arrow: ['a8', 'a2'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_fxe6,
      text: "White played fxe6. Handle it.",
    },
    {
      type: 'play-move',
      fen: FEN.devFxe6_after_fxe6,
      correctMove: 'axb3',
      prompt: 'Your move.',
      hint: 'axb3.',
      correctFeedback: 'axb3.',
      wrongFeedback: 'axb3.',
    },
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_cxb3,
      text: 'cxb3.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.devFxe6_after_cxb3,
      correctMove: 'fxe6',
      prompt: 'Your move.',
      hint: 'fxe6.',
      correctFeedback: 'fxe6.',
      wrongFeedback: 'fxe6.',
    },
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_Bh3,
      text: 'Bh3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'h3'],
    },
    {
      type: 'play-move',
      fen: FEN.devFxe6_after_Bh3,
      correctMove: 'Rxa2',
      prompt: 'Your move.',
      hint: 'Rxa2.',
      correctFeedback: 'Rxa2.',
      wrongFeedback: 'Rxa2.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.devFxe6_after_Rxa2,
      text: "axb3, fxe6, Rxa2. Against 16.fxe6, you grab the knight, clean up the pawn, and invade. White's king is in trouble.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// si-test-2: LEVEL 2 TEST
// Tests L2 main line + fxe6 deviation. Zero guidance.
// ═══════════════════════════════════════════════════════════

const SI_TEST_2: OpeningLesson = {
  id: 'si-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Play the full Level 2 continuation from memory. Main line first, then the deviation.",
    },

    // Lesson 5: O-O, b5, b4
    { type: 'instruction', fen: FEN.after_OOO, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_g4, text: 'g4.', autoAdvance: 800, highlightSquares: ['g2', 'g4'] },
    { type: 'play-move', fen: FEN.after_g4, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_g5, text: 'g5.', autoAdvance: 800, highlightSquares: ['g4', 'g5'] },
    { type: 'play-move', fen: FEN.after_g5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },

    // Lesson 6: Ne8, a5, a4
    { type: 'instruction', fen: FEN.l2_after_Ne2, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    { type: 'play-move', fen: FEN.l2_after_Ne2, correctMove: 'Ne8', prompt: 'Your move.', hint: 'Ne8.', correctFeedback: 'Ne8.', wrongFeedback: 'Ne8.' },
    { type: 'instruction', fen: FEN.l2_after_f4, text: 'f4.', autoAdvance: 800, highlightSquares: ['f3', 'f4'] },
    { type: 'play-move', fen: FEN.l2_after_f4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.l2_after_f5, text: 'f5.', autoAdvance: 800, highlightSquares: ['f4', 'f5'] },
    { type: 'play-move', fen: FEN.l2_after_f5, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },

    // Lesson 7: exd4, b3, bxc2+
    { type: 'instruction', fen: FEN.l2_after_Nbd4, text: 'Nbd4.', autoAdvance: 800, highlightSquares: ['b3', 'd4'] },
    { type: 'play-move', fen: FEN.l2_after_Nbd4, correctMove: 'exd4', prompt: 'Your move.', hint: 'exd4.', correctFeedback: 'exd4.', wrongFeedback: 'exd4.' },
    { type: 'instruction', fen: FEN.l2_after_Nxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['e2', 'd4'] },
    { type: 'play-move', fen: FEN.l2_after_Nxd4, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },
    { type: 'instruction', fen: FEN.l2_after_Kb1, text: 'Kb1.', autoAdvance: 800, highlightSquares: ['c1', 'b1'] },
    { type: 'play-move', fen: FEN.l2_after_Kb1, correctMove: 'bxc2+', prompt: 'Your move.', hint: 'bxc2+.', correctFeedback: 'bxc2+.', wrongFeedback: 'bxc2+.' },

    // ── DEVIATION: 16.fxe6 ──
    {
      type: 'instruction',
      fen: FEN.l2_after_a4,
      text: "Main line done. Now handle the deviation.",
    },
    { type: 'instruction', fen: FEN.devFxe6_after_fxe6, text: "White plays 16.fxe6.", autoAdvance: 800, highlightSquares: ['f5', 'e6'] },
    { type: 'play-move', fen: FEN.devFxe6_after_fxe6, correctMove: 'axb3', prompt: 'Your move.', hint: 'axb3.', correctFeedback: 'axb3.', wrongFeedback: 'axb3.' },
    { type: 'instruction', fen: FEN.devFxe6_after_cxb3, text: 'cxb3.', autoAdvance: 800, highlightSquares: ['c2', 'b3'] },
    { type: 'play-move', fen: FEN.devFxe6_after_cxb3, correctMove: 'fxe6', prompt: 'Your move.', hint: 'fxe6.', correctFeedback: 'fxe6.', wrongFeedback: 'fxe6.' },
    { type: 'instruction', fen: FEN.devFxe6_after_Bh3, text: 'Bh3.', autoAdvance: 800, highlightSquares: ['f1', 'h3'] },
    { type: 'play-move', fen: FEN.devFxe6_after_Bh3, correctMove: 'Rxa2', prompt: 'Your move.', hint: 'Rxa2.', correctFeedback: 'Rxa2.', wrongFeedback: 'Rxa2.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SICILIAN_LESSONS: Record<string, OpeningLesson> = {
  'si-1': SI_1,
  'si-2': SI_2,
  'si-3': SI_3,
  'si-4': SI_4,
  'si-dev-Be2': SI_DEV_BE2,
  'si-dev-Nf3': SI_DEV_NF3,
  'si-test-1': SI_TEST_1,
  'si-5': SI_5,
  'si-6': SI_6,
  'si-7': SI_7,
  'si-dev-fxe6': SI_DEV_FXE6,
  'si-test-2': SI_TEST_2,
}

export function getSicilianLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_LESSONS[id]
}
