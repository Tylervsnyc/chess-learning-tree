import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — MARTIAN GAMBIT LESSONS (wam-1 through wam-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// The Martian features TWO knight sacrifices (Ne6 then Nxf7) against the
// Caro-Kann 4…Bf5 main line. Lean INTO the meme — "Witty's double sacrifice,"
// "first Ne6, then Nxf7," "the coffin bishop on f7."
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// ⚠️  CHUNKING RULE: EVERY lesson teaches EXACTLY 3 white moves.
// Main: 7 main lessons × 3 = 21 white moves + 1 puzzle move (Qf5+) = 22 total.
// Deviations: 7 deviations × 3 = 21 additional white moves.
//
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5
//            5.Ng5 Bg6 6.N1f3 h6 7.Ne6!! fxe6
//            8.Ne5 Bf7 9.Bc4 Nd7 10.Nxf7! Kxf7
//            11.Qg4 Qa5+ 12.Bd2 Qc7
//            13.Bxe6+ Ke8 14.Qg6+ Kd8
//            15.O-O Ngf6 16.Rfe1 a5 17.c4 c5
//            18.dxc5 Nxc5 19.Rad1!! Nxe6 20.Bxa5+ Kc8
//            21.Bxc7 Nxc7 22.Qf5+ (winning)
//
// Deviations (Witty's actual play, June-Nov 2024 chess.com archive):
//   wam-dev-5-e6   — 5…e6 (62 games) → 6.N1f3 Nd7 7.Nh4 Bg6 8.Bc4
//   wam-dev-5-h6   — 5…h6 (33 games) → 6.Nxf7! Kxf7 7.Nf3 Nd7 8.Ne5+ (the Alien transposition)
//   wam-dev-5-Nf6  — 5…Nf6 (24 games) → 6.N1f3 Nbd7 7.Bc4 e6 8.Ne5
//   wam-dev-6-e6   — 6…e6 (22 games) → 7.Ne5 Nd7 8.Nxg6 hxg6 9.Bc4
//   wam-dev-6-Nd7  — 6…Nd7 (18 games) → 7.Bc4 e6 8.Qe2 Ngf6 9.O-O
//   wam-dev-8-Bf5  — 8…Bf5 (71 games) → 9.Bc4 Nd7 10.Bxe6 Nxe5 11.Bxf5
//   wam-dev-8-Be4  — 8…Be4 (21 games, 100% wins!) → 9.Bc4 Nd7 10.Qe2 Nxe5 11.dxe5
//
// FENs computed with chess.js from move sequences (verified).
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:     'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:     'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:     'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:     'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/RNBQKBNR b KQkq - 1 3',
  after_dxe4:   'rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Nxe4:   'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Bf5:    'rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng5:    'rn1qkbnr/pp2pppp/2p5/5bN1/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_Bg6:    'rn1qkbnr/pp2pppp/2p3b1/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  after_N1f3:   'rn1qkbnr/pp2pppp/2p3b1/6N1/3P4/5N2/PPP2PPP/R1BQKB1R b KQkq - 4 6',
  after_h6:     'rn1qkbnr/pp2ppp1/2p3bp/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 7',
  after_Ne6:    'rn1qkbnr/pp2ppp1/2p1N1bp/8/3P4/5N2/PPP2PPP/R1BQKB1R b KQkq - 1 7',
  after_fxe6:   'rn1qkbnr/pp2p1p1/2p1p1bp/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 8',
  after_Ne5:    'rn1qkbnr/pp2p1p1/2p1p1bp/4N3/3P4/8/PPP2PPP/R1BQKB1R b KQkq - 1 8',
  after_Bf7:    'rn1qkbnr/pp2pbp1/2p1p2p/4N3/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 2 9',
  after_Bc4:    'rn1qkbnr/pp2pbp1/2p1p2p/4N3/2BP4/8/PPP2PPP/R1BQK2R b KQkq - 3 9',
  after_Nd7:    'r2qkbnr/pp1npbp1/2p1p2p/4N3/2BP4/8/PPP2PPP/R1BQK2R w KQkq - 4 10',
  after_Nxf7:   'r2qkbnr/pp1npNp1/2p1p2p/8/2BP4/8/PPP2PPP/R1BQK2R b KQkq - 0 10',
  after_Kxf7:   'r2q1bnr/pp1npkp1/2p1p2p/8/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 11',
  after_Qg4:    'r2q1bnr/pp1npkp1/2p1p2p/8/2BP2Q1/8/PPP2PPP/R1B1K2R b KQ - 1 11',
  after_Qa5:    'r4bnr/pp1npkp1/2p1p2p/q7/2BP2Q1/8/PPP2PPP/R1B1K2R w KQ - 2 12',
  after_Bd2:    'r4bnr/pp1npkp1/2p1p2p/q7/2BP2Q1/8/PPPB1PPP/R3K2R b KQ - 3 12',
  after_Qc7:    'r4bnr/ppqnpkp1/2p1p2p/8/2BP2Q1/8/PPPB1PPP/R3K2R w KQ - 4 13',
  after_Bxe6:   'r4bnr/ppqnpkp1/2p1B2p/8/3P2Q1/8/PPPB1PPP/R3K2R b KQ - 0 13',
  after_Ke8:    'r3kbnr/ppqnp1p1/2p1B2p/8/3P2Q1/8/PPPB1PPP/R3K2R w KQ - 1 14',
  after_Qg6:    'r3kbnr/ppqnp1p1/2p1B1Qp/8/3P4/8/PPPB1PPP/R3K2R b KQ - 2 14',
  after_Kd8:    'r2k1bnr/ppqnp1p1/2p1B1Qp/8/3P4/8/PPPB1PPP/R3K2R w KQ - 3 15',
  after_OO:     'r2k1bnr/ppqnp1p1/2p1B1Qp/8/3P4/8/PPPB1PPP/R4RK1 b - - 4 15',
  after_Ngf6:   'r2k1b1r/ppqnp1p1/2p1BnQp/8/3P4/8/PPPB1PPP/R4RK1 w - - 5 16',
  after_Rfe1:   'r2k1b1r/ppqnp1p1/2p1BnQp/8/3P4/8/PPPB1PPP/R3R1K1 b - - 6 16',
  after_a5:     'r2k1b1r/1pqnp1p1/2p1BnQp/p7/3P4/8/PPPB1PPP/R3R1K1 w - - 0 17',
  after_c4:     'r2k1b1r/1pqnp1p1/2p1BnQp/p7/2PP4/8/PP1B1PPP/R3R1K1 b - - 0 17',
  after_c5:     'r2k1b1r/1pqnp1p1/4BnQp/p1p5/2PP4/8/PP1B1PPP/R3R1K1 w - - 0 18',
  after_dxc5:   'r2k1b1r/1pqnp1p1/4BnQp/p1P5/2P5/8/PP1B1PPP/R3R1K1 b - - 0 18',
  after_Nxc5:   'r2k1b1r/1pq1p1p1/4BnQp/p1n5/2P5/8/PP1B1PPP/R3R1K1 w - - 0 19',
  after_Rad1:   'r2k1b1r/1pq1p1p1/4BnQp/p1n5/2P5/8/PP1B1PPP/3RR1K1 b - - 1 19',
  after_Nxe6:   'r2k1b1r/1pq1p1p1/4nnQp/p7/2P5/8/PP1B1PPP/3RR1K1 w - - 0 20',
  after_Bxa5:   'r2k1b1r/1pq1p1p1/4nnQp/B7/2P5/8/PP3PPP/3RR1K1 b - - 0 20',
  after_Kc8:    'r1k2b1r/1pq1p1p1/4nnQp/B7/2P5/8/PP3PPP/3RR1K1 w - - 1 21',
  after_Bxc7:   'r1k2b1r/1pB1p1p1/4nnQp/8/2P5/8/PP3PPP/3RR1K1 b - - 0 21',
  after_Nxc7:   'r1k2b1r/1pn1p1p1/5nQp/8/2P5/8/PP3PPP/3RR1K1 w - - 0 22',
  after_Qf5:    'r1k2b1r/1pn1p1p1/5n1p/5Q2/2P5/8/PP3PPP/3RR1K1 b - - 1 22',

  // === DEVIATION wam-dev-5-e6: 5…e6 6.N1f3 Nd7 7.Nh4 Bg6 8.Bc4 ===
  dev5e6_after_e6:    'rn1qkbnr/pp3ppp/2p1p3/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  dev5e6_after_N1f3:  'rn1qkbnr/pp3ppp/2p1p3/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R b KQkq - 1 6',
  dev5e6_after_Nd7:   'r2qkbnr/pp1n1ppp/2p1p3/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 7',
  dev5e6_after_Nh4:   'r2qkbnr/pp1n1ppp/2p1p3/5bN1/3P3N/8/PPP2PPP/R1BQKB1R b KQkq - 3 7',
  dev5e6_after_Bg6:   'r2qkbnr/pp1n1ppp/2p1p1b1/6N1/3P3N/8/PPP2PPP/R1BQKB1R w KQkq - 4 8',
  dev5e6_after_Bc4:   'r2qkbnr/pp1n1ppp/2p1p1b1/6N1/2BP3N/8/PPP2PPP/R1BQK2R b KQkq - 5 8',

  // === DEVIATION wam-dev-5-h6: 5…h6 6.Nxf7 Kxf7 7.Nf3 Nd7 8.Ne5+ ===
  dev5h6_after_h6:    'rn1qkbnr/pp2ppp1/2p4p/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  dev5h6_after_Nxf7:  'rn1qkbnr/pp2pNp1/2p4p/5b2/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 0 6',
  dev5h6_after_Kxf7:  'rn1q1bnr/pp2pkp1/2p4p/5b2/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7',
  dev5h6_after_Nf3:   'rn1q1bnr/pp2pkp1/2p4p/5b2/3P4/5N2/PPP2PPP/R1BQKB1R b KQ - 1 7',
  dev5h6_after_Nd7:   'r2q1bnr/pp1npkp1/2p4p/5b2/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  dev5h6_after_Ne5:   'r2q1bnr/pp1npkp1/2p4p/4Nb2/3P4/8/PPP2PPP/R1BQKB1R b KQ - 3 8',

  // === DEVIATION wam-dev-5-Nf6: 5…Nf6 6.N1f3 Nbd7 7.Bc4 e6 8.Ne5 ===
  dev5Nf6_after_Nf6:  'rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  dev5Nf6_after_N1f3: 'rn1qkb1r/pp2pppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R b KQkq - 4 6',
  dev5Nf6_after_Nbd7: 'r2qkb1r/pp1npppp/2p2n2/5bN1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7',
  dev5Nf6_after_Bc4:  'r2qkb1r/pp1npppp/2p2n2/5bN1/2BP4/5N2/PPP2PPP/R1BQK2R b KQkq - 6 7',
  dev5Nf6_after_e6:   'r2qkb1r/pp1n1ppp/2p1pn2/5bN1/2BP4/5N2/PPP2PPP/R1BQK2R w KQkq - 0 8',
  dev5Nf6_after_Ne5:  'r2qkb1r/pp1n1ppp/2p1pn2/4NbN1/2BP4/8/PPP2PPP/R1BQK2R b KQkq - 1 8',

  // === DEVIATION wam-dev-6-e6: 6…e6 7.Ne5 Nd7 8.Nxg6 hxg6 9.Bc4 ===
  dev6e6_after_e6:    'rn1qkbnr/pp3ppp/2p1p1b1/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 7',
  dev6e6_after_Ne5:   'rn1qkbnr/pp3ppp/2p1p1b1/4N1N1/3P4/8/PPP2PPP/R1BQKB1R b KQkq - 1 7',
  dev6e6_after_Nd7:   'r2qkbnr/pp1n1ppp/2p1p1b1/4N1N1/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 2 8',
  dev6e6_after_Nxg6:  'r2qkbnr/pp1n1ppp/2p1p1N1/6N1/3P4/8/PPP2PPP/R1BQKB1R b KQkq - 0 8',
  dev6e6_after_hxg6:  'r2qkbnr/pp1n1pp1/2p1p1p1/6N1/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 0 9',
  dev6e6_after_Bc4:   'r2qkbnr/pp1n1pp1/2p1p1p1/6N1/2BP4/8/PPP2PPP/R1BQK2R b KQkq - 1 9',

  // === DEVIATION wam-dev-6-Nd7: 6…Nd7 7.Bc4 e6 8.Qe2 Ngf6 9.O-O ===
  dev6Nd7_after_Nd7:  'r2qkbnr/pp1npppp/2p3b1/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 5 7',
  dev6Nd7_after_Bc4:  'r2qkbnr/pp1npppp/2p3b1/6N1/2BP4/5N2/PPP2PPP/R1BQK2R b KQkq - 6 7',
  dev6Nd7_after_e6:   'r2qkbnr/pp1n1ppp/2p1p1b1/6N1/2BP4/5N2/PPP2PPP/R1BQK2R w KQkq - 0 8',
  dev6Nd7_after_Qe2:  'r2qkbnr/pp1n1ppp/2p1p1b1/6N1/2BP4/5N2/PPP1QPPP/R1B1K2R b KQkq - 1 8',
  dev6Nd7_after_Ngf6: 'r2qkb1r/pp1n1ppp/2p1pnb1/6N1/2BP4/5N2/PPP1QPPP/R1B1K2R w KQkq - 2 9',
  dev6Nd7_after_OO:   'r2qkb1r/pp1n1ppp/2p1pnb1/6N1/2BP4/5N2/PPP1QPPP/R1B2RK1 b kq - 3 9',

  // === DEVIATION wam-dev-8-Bf5: 8…Bf5 9.Bc4 Nd7 10.Bxe6 Nxe5 11.Bxf5 ===
  dev8Bf5_after_Bf5:  'rn1qkbnr/pp2p1p1/2p1p2p/4Nb2/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 2 9',
  dev8Bf5_after_Bc4:  'rn1qkbnr/pp2p1p1/2p1p2p/4Nb2/2BP4/8/PPP2PPP/R1BQK2R b KQkq - 3 9',
  dev8Bf5_after_Nd7:  'r2qkbnr/pp1np1p1/2p1p2p/4Nb2/2BP4/8/PPP2PPP/R1BQK2R w KQkq - 4 10',
  dev8Bf5_after_Bxe6: 'r2qkbnr/pp1np1p1/2p1B2p/4Nb2/3P4/8/PPP2PPP/R1BQK2R b KQkq - 0 10',
  dev8Bf5_after_Nxe5: 'r2qkbnr/pp2p1p1/2p1B2p/4nb2/3P4/8/PPP2PPP/R1BQK2R w KQkq - 0 11',
  dev8Bf5_after_Bxf5: 'r2qkbnr/pp2p1p1/2p4p/4nB2/3P4/8/PPP2PPP/R1BQK2R b KQkq - 0 11',

  // === DEVIATION wam-dev-8-Be4: 8…Be4 9.Bc4 Nd7 10.Qe2 Nxe5 11.dxe5 ===
  dev8Be4_after_Be4:  'rn1qkbnr/pp2p1p1/2p1p2p/4N3/3Pb3/8/PPP2PPP/R1BQKB1R w KQkq - 2 9',
  dev8Be4_after_Bc4:  'rn1qkbnr/pp2p1p1/2p1p2p/4N3/2BPb3/8/PPP2PPP/R1BQK2R b KQkq - 3 9',
  dev8Be4_after_Nd7:  'r2qkbnr/pp1np1p1/2p1p2p/4N3/2BPb3/8/PPP2PPP/R1BQK2R w KQkq - 4 10',
  dev8Be4_after_Qe2:  'r2qkbnr/pp1np1p1/2p1p2p/4N3/2BPb3/8/PPP1QPPP/R1B1K2R b KQkq - 5 10',
  dev8Be4_after_Nxe5: 'r2qkbnr/pp2p1p1/2p1p2p/4n3/2BPb3/8/PPP1QPPP/R1B1K2R w KQkq - 0 11',
  dev8Be4_after_dxe5: 'r2qkbnr/pp2p1p1/2p1p2p/4P3/2B1b3/8/PPP1QPPP/R1B1K2R b KQkq - 0 11',
}


// ═══════════════════════════════════════════════════════════
// wam-1: THE SETUP (1.e4 c6 2.d4 d5 3.Nc3 dxe4)
// First lesson — no recap.
// Teaches 3 white moves: e4, d4, Nc3
// Ends with Black playing dxe4 (sets up wam-2)
// ═══════════════════════════════════════════════════════════

const WAM_1: OpeningLesson = {
  id: 'wam-1',
  title: 'The Setup',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Martian Gambit — Witty's double knight sacrifice. First a knight on e6, then a second knight on f7. The king ends up in the middle of the board, surrounded.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "This whole thing only fires when Black plays the 4…Bf5 line of the Caro-Kann. Step one: get there.",
    },

    // ── TEACH 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Open the game.',
      hint: 'Push the king pawn two squares.',
      correctFeedback: "e4. Same start as the Alien Gambit — the Caro-Kann needs an e4 to react to.",
      wrongFeedback: 'Play e4 — same start as the main Alien Gambit.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Black plays c6 — the Caro-Kann. They're prepping d5 to challenge your e4.",
      arrow: ['e2', 'e4'],
    },

    // ── TEACH 2: d4 ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 — the Caro-Kann signature. Black wants to hit e4 with d5 next.",
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Build a two-pawn center.',
      hint: 'Push d2 to d4.',
      correctFeedback: 'd4. Two pawns abreast on d4 and e4. Black has to react.',
      wrongFeedback: 'Play d4 — claim the whole center.',
    },

    // ── TEACH 3: Nc3 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "And there it is — d5 attacks your e4 pawn.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Defend e4 by developing a knight.',
      hint: 'Knight to c3 — defends e4 and develops at the same time.',
      correctFeedback: "Nc3 — develops AND defends e4. Now Black almost always takes — dxe4.",
      wrongFeedback: 'Play Nc3 — develop and defend in one move.',
      postMoveArrow: ['c3', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "dxe4 — Black grabs the pawn. They think it's free. It is not.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Run it back.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Setup complete. Black grabbed e4. Next: recapture and trigger the Martian when Black plays Bf5.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-2: BLACK'S BISHOP MOVE (4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6)
// Teaches 3 white moves: Nxe4, Ng5, N1f3
// Black's 4…Bf5 is the trigger for the Martian (vs 4…Nf6 = Alien Gambit).
// Ends with Black's h6 — the trigger for Ne6 next lesson.
// ═══════════════════════════════════════════════════════════

const WAM_2: OpeningLesson = {
  id: 'wam-2',
  title: "Black's Bishop Move",
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "If Black plays Nf6 here, you play the Alien Gambit. If Black plays Bf5, you play the Martian. Different defense, different sacrifice.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },

    // ── TEACH 1: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Recapture with the knight.',
      hint: 'Knight takes e4.',
      correctFeedback: "Nxe4. Knight in the center. Now Black has to make the choice that decides everything.",
      wrongFeedback: 'Play Nxe4 — take with the knight.',
    },

    // ── BLACK Bf5 — THE TRIGGER ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Bf5 — Black develops the bishop OUT of the pawn chain before locking it in. This is the Caro-Kann main line. And it's exactly what triggers the Martian.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'f5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "The bishop on f5 attacks your knight on e4. You need to move it. Most White players retreat to g3 — you're going to jump to g5 instead.",
      highlightSquares: ['e4', 'f5'],
    },

    // ── TEACH 2: Ng5 ──
    {
      type: 'play-move',
      fen: FEN.after_Bf5,
      correctMove: 'Ng5',
      prompt: "Knight jumps forward — toward f7.",
      hint: 'Knight to g5 — heading for f7.',
      correctFeedback: "Ng5! The knight ignores the bishop and threatens f7. Black has to deal with this — the bishop on f5 is suddenly less important than the king.",
      wrongFeedback: 'Play Ng5 — same idea as the Alien Gambit, head for f7.',
      postMoveArrow: ['g5', 'f7'],
    },

    // ── BLACK Bg6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "Bg6 — Black tucks the bishop back to safety on g6. The bishop is protected by the h7 pawn. Remember that — it matters in three moves.",
      autoAdvance: 800,
      highlightSquares: ['f5', 'g6'],
    },

    // ── TEACH 3: N1f3 ──
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "Develop your other knight. Both knights can reach f3, so the notation is 'N1f3' — the knight from rank 1 (the g1 knight).",
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bg6,
      correctMove: 'N1f3',
      prompt: "Develop the g1 knight.",
      hint: 'Knight from g1 to f3.',
      correctFeedback: "N1f3 — the other knight develops. Two knights eyeing the kingside, waiting for Black to make the wrong move.",
      wrongFeedback: 'Play N1f3 — develop the g1 knight (not the g5 one).',
    },

    // ── BLACK h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 — Black says 'shoo, knight.' Looks innocent. It's not. The h6 pawn just walked off h7 — which means the bishop on g6 has no support from above.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Run it back from move 4.",
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5 — the Martian trigger.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bf5,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg6,
      correctMove: 'N1f3',
      prompt: 'Your move.',
      hint: 'N1f3.',
      correctFeedback: 'N1f3.',
      wrongFeedback: 'N1f3.',
    },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Bishop on g6, h-pawn on h6, bishop unsupported. Next lesson: the first sacrifice. Knight to e6.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-3: TWO KNIGHTS IN (7.Ne6!! fxe6 8.Ne5 Bf7 9.Bc4 Nd7)
// Teaches 3 white moves: Ne6, Ne5, Bc4
// The first sacrifice plus the follow-up that traps the bishop on f7.
// ═══════════════════════════════════════════════════════════

const WAM_3: OpeningLesson = {
  id: 'wam-3',
  title: 'Two Knights In',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Look at e6. The knight on b8 isn't there to defend it. The bishop on g6 doesn't see it. Only the f7 pawn defends e6 — and the queen on d8 is right behind.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // ── TEACH 1: Ne6!! THE MARTIAN SACRIFICE ──
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: "Sacrifice the knight on e6 — attack the queen.",
      hint: 'Knight to e6 — it hits the queen on d8.',
      correctFeedback: "Ne6!! The first Martian sacrifice. The knight attacks the queen AND offers itself to fxe6. Black almost has to take — but taking opens the f-file and locks their bishop on g6 into a coffin.",
      wrongFeedback: "Play Ne6 — the Martian goes to e6, not f7. The queen on d8 is the target.",
      postMoveArrow: [['e6', 'd8'], ['f7', 'e6']],
    },

    // ── BLACK fxe6 ──
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: "fxe6 — Black takes. Free knight, right? Look what just happened: the f7 pawn is GONE, and Black's bishop on g6 is now stuck.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: "The bishop on g6 can only retreat to f7 or h5. h5 hangs to your queen. f7 walks into a coffin — and that's where you want it.",
      highlightSquares: ['g6', 'f7'],
    },

    // ── TEACH 2: Ne5 ──
    {
      type: 'play-move',
      fen: FEN.after_fxe6,
      correctMove: 'Ne5',
      prompt: "Jump the SECOND knight in — to e5.",
      hint: 'Knight from f3 to e5 — attacks the bishop on g6.',
      correctFeedback: "Ne5! The second knight crashes in, attacking the bishop on g6. The bishop has nowhere good to run.",
      wrongFeedback: 'Play Ne5 — the f3 knight jumps to e5, attacking the bishop.',
      postMoveArrow: ['e5', 'g6'],
    },

    // ── BLACK Bf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Bf7,
      text: "Bf7 — bishop retreats to its coffin. The knight on e5, the queen on d1, the open f-file — they're all about to converge.",
      autoAdvance: 800,
      highlightSquares: ['g6', 'f7'],
    },

    // ── TEACH 3: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.after_Bf7,
      correctMove: 'Bc4',
      prompt: "Develop the bishop — pin the f7 bishop to the king.",
      hint: 'Bishop to c4 — eyes f7.',
      correctFeedback: "Bc4! Your bishop pins the f7 bishop to the king. Black's only defender is the b8 knight.",
      wrongFeedback: 'Play Bc4 — bishop goes to c4 and attacks f7.',
      postMoveArrow: ['c4', 'f7'],
    },

    // ── BLACK Nd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 — Black brings the knight over to defend f7. Looks solid. It's not. Your knight on e5 and your bishop on c4 are both pointing at f7. Next lesson: second sacrifice.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Two knights in. From after h6.",
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: 'Your move.',
      hint: 'Ne6.',
      correctFeedback: 'Ne6.',
      wrongFeedback: 'Ne6.',
    },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.after_fxe6,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },
    { type: 'instruction', fen: FEN.after_Bf7, text: 'Bf7.', autoAdvance: 800, highlightSquares: ['g6', 'f7'] },
    {
      type: 'play-move',
      fen: FEN.after_Bf7,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "First sacrifice landed, coffin bishop on f7, bishop pinning. Material: down a knight for a pawn. Next: the SECOND sacrifice.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-4: THE SECOND SACRIFICE (10.Nxf7! Kxf7 11.Qg4 Qa5+ 12.Bd2 Qc7)
// Teaches 3 white moves: Nxf7, Qg4, Bd2
// ═══════════════════════════════════════════════════════════

const WAM_4: OpeningLesson = {
  id: 'wam-4',
  title: 'The Second Sacrifice',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Knight on e5, bishop on c4, both pointing at f7. Sacrifice the SECOND knight. Drag the king out.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the coffin.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Bf7, text: 'Bf7.', autoAdvance: 800, highlightSquares: ['g6', 'f7'] },
    { type: 'play-move', fen: FEN.after_Bf7, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },

    // ── TEACH 1: Nxf7! ──
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Nxf7',
      prompt: "The second sacrifice. Take f7.",
      hint: 'Knight takes the bishop on f7.',
      correctFeedback: "Nxf7! Two knights down. Black has to recapture with the king — and now your bishop on c4 has a direct line to the exposed king.",
      wrongFeedback: 'Play Nxf7 — the second sacrifice. Trust the attack.',
      postMoveArrow: ['f7', 'e8'],
    },

    // ── BLACK Kxf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Kxf7 — the king is forced to take. It's now on f7, in the middle of the board, with no pawn cover. That's exactly what we wanted.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Material: two knights for a bishop and two pawns. Down a piece by count. But the king is on f7 with no defenders. Time to bring the queen.",
      highlightSquares: ['f7'],
    },

    // ── TEACH 2: Qg4 ──
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Qg4',
      prompt: "Bring the queen out — to g4.",
      hint: 'Queen to g4 — threatens g7 and joins the attack.',
      correctFeedback: "Qg4! Queen joins the attack, threatening the g7 pawn. Black has to react fast — and the most common reaction is a desperate check.",
      wrongFeedback: 'Play Qg4 — queen comes to g4, joining the attack.',
      postMoveArrow: ['g4', 'g7'],
    },

    // ── BLACK Qa5+ ──
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "Qa5+ — Black checks your king. Their best try in the position. You have to block.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'a5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "Block options: c3 (pawn) or Bd2 (bishop). Bd2 is best — blocks the check AND develops the bishop.",
      highlightSquares: ['a5', 'e1'],
    },

    // ── TEACH 3: Bd2 ──
    {
      type: 'play-move',
      fen: FEN.after_Qa5,
      correctMove: 'Bd2',
      prompt: "Block the check with a developing piece.",
      hint: 'Bishop to d2 — blocks AND develops.',
      correctFeedback: "Bd2 — blocks the check, develops the bishop. Black's queen has to retreat now.",
      wrongFeedback: 'Play Bd2 — block with the bishop, two jobs at once.',
    },

    // ── BLACK Qc7 ──
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Qc7 — Black's queen retreats to defend the kingside. Now you have a clean attack with the queen on g4 and bishop on c4.",
      autoAdvance: 800,
      highlightSquares: ['a5', 'c7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "From Nd7 — sacrifice, queen out, handle the check.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Qg4',
      prompt: 'Your move.',
      hint: 'Qg4.',
      correctFeedback: 'Qg4.',
      wrongFeedback: 'Qg4.',
    },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    {
      type: 'play-move',
      fen: FEN.after_Qa5,
      correctMove: 'Bd2',
      prompt: 'Your move.',
      hint: 'Bd2.',
      correctFeedback: 'Bd2.',
      wrongFeedback: 'Bd2.',
    },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['a5', 'c7'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Queen on g4, bishop on c4, attack fully loaded. Next: punch through with Bxe6+ and start the king hunt.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-5: CRACK THE KING (13.Bxe6+ Ke8 14.Qg6+ Kd8 15.O-O Ngf6)
// Teaches 3 white moves: Bxe6+, Qg6+, O-O
// ═══════════════════════════════════════════════════════════

const WAM_5: OpeningLesson = {
  id: 'wam-5',
  title: 'Crack the King',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Time to crack the king. Your bishop on c4 has a clear path to e6 — and the king on f7 can't take back (the bishop is defended by the queen on g4).",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the queen retreat.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Bf7, text: 'Bf7.', autoAdvance: 800, highlightSquares: ['g6', 'f7'] },
    { type: 'play-move', fen: FEN.after_Bf7, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nd7, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Qg4', prompt: 'Your move.', hint: 'Qg4.', correctFeedback: 'Qg4.', wrongFeedback: 'Qg4.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    { type: 'play-move', fen: FEN.after_Qa5, correctMove: 'Bd2', prompt: 'Your move.', hint: 'Bd2.', correctFeedback: 'Bd2.', wrongFeedback: 'Bd2.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['a5', 'c7'] },

    // ── TEACH 1: Bxe6+ ──
    {
      type: 'play-move',
      fen: FEN.after_Qc7,
      correctMove: 'Bxe6+',
      prompt: "Take the e6 pawn with check.",
      hint: 'Bishop takes e6 — check!',
      correctFeedback: "Bxe6+! The bishop crashes in with check, defended by your queen. The king can't take, can't go back to f7 — Ke8 is forced.",
      wrongFeedback: 'Play Bxe6+ — bishop takes with check, defended by the queen.',
      postMoveArrow: ['e6', 'f7'],
    },

    // ── BLACK Ke8 ──
    {
      type: 'instruction',
      fen: FEN.after_Ke8,
      text: "Ke8 — king runs back. But it's not safe there. Your queen on g4 has a free swing.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e8'],
    },

    // ── TEACH 2: Qg6+ ──
    {
      type: 'play-move',
      fen: FEN.after_Ke8,
      correctMove: 'Qg6+',
      prompt: "Queen check — push the king further.",
      hint: 'Queen to g6 — check from the diagonal.',
      correctFeedback: "Qg6+! The queen lands with check on the e8–h5 diagonal. The king has to flee to d8 — and now the attack is total.",
      wrongFeedback: 'Play Qg6+ — queen check on the diagonal.',
      postMoveArrow: ['g6', 'e8'],
    },

    // ── BLACK Kd8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kd8,
      text: "Kd8 — king flees to d8. Look at the board: bishop on e6, queen on g6, bishop on d2. Every piece pointed at the king. Time to bring the rooks.",
      autoAdvance: 800,
      highlightSquares: ['e6', 'g6', 'd2', 'd8'],
    },

    // ── TEACH 3: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_Kd8,
      correctMove: 'O-O',
      prompt: "Castle into the attack — activate the rook.",
      hint: 'Castle kingside.',
      correctFeedback: "O-O! Castle short. Your rook on f1 lands on f-file and your king is safe. Both rooks ready to join the fight.",
      wrongFeedback: 'Play O-O — castle kingside, activate the rook.',
      postMoveArrow: ['f1', 'f8'],
    },

    // ── BLACK Ngf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Ngf6,
      text: "Ngf6 — Black develops the knight to f6, trying to defend. But your bishop on e6 and queen on g6 already have the king surrounded.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Crack the king. From Qc7.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Qc7,
      correctMove: 'Bxe6+',
      prompt: 'Your move.',
      hint: 'Bxe6+.',
      correctFeedback: 'Bxe6+.',
      wrongFeedback: 'Bxe6+.',
    },
    { type: 'instruction', fen: FEN.after_Ke8, text: 'Ke8.', autoAdvance: 800, highlightSquares: ['f7', 'e8'] },
    {
      type: 'play-move',
      fen: FEN.after_Ke8,
      correctMove: 'Qg6+',
      prompt: 'Your move.',
      hint: 'Qg6+.',
      correctFeedback: 'Qg6+.',
      wrongFeedback: 'Qg6+.',
    },
    { type: 'instruction', fen: FEN.after_Kd8, text: 'Kd8.', autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    {
      type: 'play-move',
      fen: FEN.after_Kd8,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_Ngf6, text: 'Ngf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ngf6,
      text: "King on d8, you castled, both rooks active. Next: pile on with Rfe1 and start cracking the center.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-6: PILE ON (16.Rfe1 a5 17.c4 c5 18.dxc5 Nxc5)
// Teaches 3 white moves: Rfe1, c4, dxc5
// ═══════════════════════════════════════════════════════════

const WAM_6: OpeningLesson = {
  id: 'wam-6',
  title: 'Pile On',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ngf6,
      text: "King stuck on d8, your pieces all over the kingside. Time to swing the rook into the e-file and push pawns to break Black's center.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the castle.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Bf7, text: 'Bf7.', autoAdvance: 800, highlightSquares: ['g6', 'f7'] },
    { type: 'play-move', fen: FEN.after_Bf7, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nd7, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Qg4', prompt: 'Your move.', hint: 'Qg4.', correctFeedback: 'Qg4.', wrongFeedback: 'Qg4.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    { type: 'play-move', fen: FEN.after_Qa5, correctMove: 'Bd2', prompt: 'Your move.', hint: 'Bd2.', correctFeedback: 'Bd2.', wrongFeedback: 'Bd2.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['a5', 'c7'] },
    { type: 'play-move', fen: FEN.after_Qc7, correctMove: 'Bxe6+', prompt: 'Your move.', hint: 'Bxe6+.', correctFeedback: 'Bxe6+.', wrongFeedback: 'Bxe6+.' },
    { type: 'instruction', fen: FEN.after_Ke8, text: 'Ke8.', autoAdvance: 800, highlightSquares: ['f7', 'e8'] },
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'Qg6+', prompt: 'Your move.', hint: 'Qg6+.', correctFeedback: 'Qg6+.', wrongFeedback: 'Qg6+.' },
    { type: 'instruction', fen: FEN.after_Kd8, text: 'Kd8.', autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    { type: 'play-move', fen: FEN.after_Kd8, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Ngf6, text: 'Ngf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // ── TEACH 1: Rfe1 ──
    {
      type: 'play-move',
      fen: FEN.after_Ngf6,
      correctMove: 'Rfe1',
      prompt: "Swing the f-rook to e1 — pile on the e-file.",
      hint: 'Rook from f1 to e1.',
      correctFeedback: "Rfe1! The rook joins the attack on the e-file, supporting your bishop on e6. Pressure mounting.",
      wrongFeedback: 'Play Rfe1 — rook lifts to e1 to pile on the e-file.',
      postMoveArrow: ['e1', 'e6'],
    },

    // ── BLACK a5 ──
    {
      type: 'instruction',
      fen: FEN.after_a5,
      text: "a5 — Black pushes the a-pawn to give the queen on c7 some space, threatening Qa5 next to harass your bishop. Ignore it.",
      autoAdvance: 800,
      highlightSquares: ['a7', 'a5'],
    },

    // ── TEACH 2: c4 ──
    {
      type: 'play-move',
      fen: FEN.after_a5,
      correctMove: 'c4',
      prompt: "Push the c-pawn — restrict Black's pieces.",
      hint: 'Pawn from c2 to c4.',
      correctFeedback: "c4! Locks up the queenside and stops Black's knight from going to d5. Black has to break the tension or be slowly squeezed.",
      wrongFeedback: 'Play c4 — take squares away from Black.',
    },

    // ── BLACK c5 ──
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 — Black breaks in the center, attacking your d4 pawn. They need counter-play badly.",
      autoAdvance: 800,
      highlightSquares: ['c6', 'c5'],
    },

    // ── TEACH 3: dxc5 ──
    {
      type: 'play-move',
      fen: FEN.after_c5,
      correctMove: 'dxc5',
      prompt: "Take with the d-pawn.",
      hint: 'd-pawn takes c5.',
      correctFeedback: "dxc5 — trade pawns. The d-file opens up for your rook on d1 (well, after it gets there). Black recaptures.",
      wrongFeedback: 'Play dxc5 — take the pawn and open up the position.',
    },

    // ── BLACK Nxc5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc5,
      text: "Nxc5 — Black's d7 knight recaptures. The knight blocks the c-file but is loose. Your bishop on e6 is still pointing at the kingside, queen on g6, rooks ready to swing.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'c5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ngf6,
      text: "Pile on. From Ngf6.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Ngf6,
      correctMove: 'Rfe1',
      prompt: 'Your move.',
      hint: 'Rfe1.',
      correctFeedback: 'Rfe1.',
      wrongFeedback: 'Rfe1.',
    },
    { type: 'instruction', fen: FEN.after_a5, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    {
      type: 'play-move',
      fen: FEN.after_a5,
      correctMove: 'c4',
      prompt: 'Your move.',
      hint: 'c4.',
      correctFeedback: 'c4.',
      wrongFeedback: 'c4.',
    },
    { type: 'instruction', fen: FEN.after_c5, text: 'c5.', autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.after_c5,
      correctMove: 'dxc5',
      prompt: 'Your move.',
      hint: 'dxc5.',
      correctFeedback: 'dxc5.',
      wrongFeedback: 'dxc5.',
    },
    { type: 'instruction', fen: FEN.after_Nxc5, text: 'Nxc5.', autoAdvance: 800, highlightSquares: ['d7', 'c5'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc5,
      text: "Knight on c5, but it's about to get blown apart. Next: Rad1!! — the quiet move that ends the game.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-7: MATE THE KING (19.Rad1!! Nxe6 20.Bxa5+ Kc8 21.Bxc7 Nxc7 + puzzle for 22.Qf5+)
// Teaches 3 white moves: Rad1, Bxa5+, Bxc7
// PLUS a puzzle for the final Qf5+ (the 22nd white move).
// ═══════════════════════════════════════════════════════════

const WAM_7: OpeningLesson = {
  id: 'wam-7',
  title: 'Mate the King',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc5,
      text: "Final stretch. The knight on c5 looks active, but it's about to be the reason Black loses everything.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the recapture.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Bf7, text: 'Bf7.', autoAdvance: 800, highlightSquares: ['g6', 'f7'] },
    { type: 'play-move', fen: FEN.after_Bf7, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nd7, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Qg4', prompt: 'Your move.', hint: 'Qg4.', correctFeedback: 'Qg4.', wrongFeedback: 'Qg4.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    { type: 'play-move', fen: FEN.after_Qa5, correctMove: 'Bd2', prompt: 'Your move.', hint: 'Bd2.', correctFeedback: 'Bd2.', wrongFeedback: 'Bd2.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['a5', 'c7'] },
    { type: 'play-move', fen: FEN.after_Qc7, correctMove: 'Bxe6+', prompt: 'Your move.', hint: 'Bxe6+.', correctFeedback: 'Bxe6+.', wrongFeedback: 'Bxe6+.' },
    { type: 'instruction', fen: FEN.after_Ke8, text: 'Ke8.', autoAdvance: 800, highlightSquares: ['f7', 'e8'] },
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'Qg6+', prompt: 'Your move.', hint: 'Qg6+.', correctFeedback: 'Qg6+.', wrongFeedback: 'Qg6+.' },
    { type: 'instruction', fen: FEN.after_Kd8, text: 'Kd8.', autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    { type: 'play-move', fen: FEN.after_Kd8, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Ngf6, text: 'Ngf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Ngf6, correctMove: 'Rfe1', prompt: 'Your move.', hint: 'Rfe1.', correctFeedback: 'Rfe1.', wrongFeedback: 'Rfe1.' },
    { type: 'instruction', fen: FEN.after_a5, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'c5.', autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'dxc5', prompt: 'Your move.', hint: 'dxc5.', correctFeedback: 'dxc5.', wrongFeedback: 'dxc5.' },
    { type: 'instruction', fen: FEN.after_Nxc5, text: 'Nxc5.', autoAdvance: 800, highlightSquares: ['d7', 'c5'] },

    // ── TEACH 1: Rad1!! ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc5,
      text: "The killer move is quiet — bring the OTHER rook to d1. Both rooks on the d/e files, king totally trapped.",
      highlightSquares: ['a1', 'd1', 'd8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxc5,
      correctMove: 'Rad1',
      prompt: "Other rook to d1 — close the trap.",
      hint: 'Rook from a1 to d1.',
      correctFeedback: "Rad1!! The quiet killer. Both rooks active, king on d8 has nowhere to run. Now Black tries Nxe6 to grab the bishop — but it doesn't help.",
      wrongFeedback: 'Play Rad1 — the other rook joins on d1.',
      postMoveArrow: ['d1', 'd8'],
    },

    // ── BLACK Nxe6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe6,
      text: "Nxe6 — Black grabs the bishop, desperate. But now the c5 knight is on e6 and the a5 pawn is undefended.",
      autoAdvance: 800,
      highlightSquares: ['c5', 'e6'],
    },

    // ── TEACH 2: Bxa5+ ──
    {
      type: 'play-move',
      fen: FEN.after_Nxe6,
      correctMove: 'Bxa5+',
      prompt: "Take the a-pawn with check — pin the queen.",
      hint: 'Bishop from d2 takes a5, check.',
      correctFeedback: "Bxa5+! Bishop takes the pawn with discovered check on the queen. The king HAS to move — and the queen on c7 is hanging.",
      wrongFeedback: 'Play Bxa5+ — bishop takes the pawn AND attacks the queen.',
      postMoveArrow: ['a5', 'c7'],
    },

    // ── BLACK Kc8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kc8,
      text: "Kc8 — king runs to c8. But the queen on c7 is still attacked by your bishop.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'c8'],
    },

    // ── TEACH 3: Bxc7 ──
    {
      type: 'play-move',
      fen: FEN.after_Kc8,
      correctMove: 'Bxc7',
      prompt: "Take the queen.",
      hint: 'Bishop takes the queen on c7.',
      correctFeedback: "Bxc7! Queen captured. Black must take back — Nxc7 is forced.",
      wrongFeedback: 'Play Bxc7 — take the queen.',
    },

    // ── BLACK Nxc7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc7,
      text: "Nxc7 — Black recaptures with the e6 knight. Final position: you've won the queen for a bishop. Material now massively in your favor.",
      autoAdvance: 800,
      highlightSquares: ['e6', 'c7'],
    },

    // ── PUZZLE: Qf5+ — the final winning move ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc7,
      text: "One more move to find. The queen on g6 has a winning shot.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_Nxc7,
      solutionMoves: ['Qf5+'],
      playerColor: 'white',
      prompt: "Final shot — queen check that wins more material.",
      hint: "Queen to f5 with check — it forks the king and threatens Rxe7.",
      correctFeedback: "Qf5+! Check, and threatens Rxe7 winning more material. The Martian Gambit at full power — 22 moves, two knight sacrifices, a king hunt, and a winning attack.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qf5,
      text: "Qf5+. End of the line. Two knights gone, queen won, king destroyed. The double sacrifice landed in full.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-5-e6: DEVIATION — Black plays 5…e6 (16%, 62 games)
// Teaches 3 white moves: N1f3, Nh4, Bc4
// Witty plays N1f3 in 98% of games. Then attacks the f5 bishop with Nh4.
// ═══════════════════════════════════════════════════════════

const WAM_DEV_5_E6: OpeningLesson = {
  id: 'wam-dev-5-e6',
  title: 'If 5…e6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Black plays e6 instead of Bg6 here — 16% of the time, 62 games. The bishop stays on f5. Witty plays N1f3 in 98% of these games — same setup, you just attack the bishop instead of the king.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },

    // ── DEVIATION: Black plays 5…e6 ──
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_e6,
      text: "e6 — Black plays this instead of Bg6. They're getting the e-pawn out to free their dark-squared bishop.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_e6,
      text: "The Ne6 sac doesn't work here (Black already has an e6 pawn). But your plan barely changes — develop N1f3, then attack the f5 bishop.",
      highlightSquares: ['f5', 'g1', 'f3'],
    },

    // ── TEACH 1: N1f3 ──
    {
      type: 'play-move',
      fen: FEN.dev5e6_after_e6,
      correctMove: 'N1f3',
      prompt: "Develop the g1 knight.",
      hint: 'Knight from g1 to f3.',
      correctFeedback: "N1f3 — same developing move as the main line. Witty plays this in 60 of 61 games (98%). Black usually responds with Nd7 (37 games), preparing to develop more.",
      wrongFeedback: 'Play N1f3 — Witty plays this 98% of the time here.',
    },

    // ── BLACK Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_Nd7,
      text: "Nd7 — Black's most common response (37 of 60 games). They're developing toward the kingside. Bishop on f5 still hanging out there.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: Nh4 ──
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_Nd7,
      text: "Attack the bishop on f5. Knight to h4 hits it — Black has to move the bishop or lose it.",
      highlightSquares: ['f3', 'h4', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5e6_after_Nd7,
      correctMove: 'Nh4',
      prompt: "Knight to h4 — attack the bishop on f5.",
      hint: 'Knight from f3 to h4.',
      correctFeedback: "Nh4! Attacks the bishop on f5. Witty plays this in 18 of 37 games after Nd7 — the most common attacking choice. Black almost always retreats to Bg6.",
      wrongFeedback: 'Play Nh4 — hit the f5 bishop and force it to move.',
      postMoveArrow: ['h4', 'f5'],
    },

    // ── BLACK Bg6 ──
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_Bg6,
      text: "Bg6 — Black retreats. The bishop ends up on g6 anyway — same spot as the main line. Now you finish developing.",
      autoAdvance: 800,
      highlightSquares: ['f5', 'g6'],
    },

    // ── TEACH 3: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.dev5e6_after_Bg6,
      correctMove: 'Bc4',
      prompt: "Develop the bishop toward f7.",
      hint: 'Bishop to c4 — aim at the f7 square.',
      correctFeedback: "Bc4 — bishop on c4 aiming at f7. Same idea as the main line: get all your pieces pointed at the Black king before going hunting. Position is good — 59% win rate over 61 games.",
      wrongFeedback: 'Play Bc4 — point the bishop at f7, same as the main line.',
      postMoveArrow: ['c4', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_Bc4,
      text: "Two knights, bishop on c4, all pointing at the kingside. The Ne6 sac didn't fire, but you have a healthy attacking setup. Black to move.",
      highlightSquares: ['c4', 'g5', 'h4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Black plays e6. Run the sequence.",
    },
    { type: 'instruction', fen: FEN.dev5e6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.dev5e6_after_e6,
      correctMove: 'N1f3',
      prompt: 'Your move.',
      hint: 'N1f3.',
      correctFeedback: 'N1f3.',
      wrongFeedback: 'N1f3.',
    },
    { type: 'instruction', fen: FEN.dev5e6_after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev5e6_after_Nd7,
      correctMove: 'Nh4',
      prompt: 'Your move.',
      hint: 'Nh4.',
      correctFeedback: 'Nh4.',
      wrongFeedback: 'Nh4.',
    },
    { type: 'instruction', fen: FEN.dev5e6_after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    {
      type: 'play-move',
      fen: FEN.dev5e6_after_Bg6,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev5e6_after_Bc4,
      text: "When Black plays e6, you adapt: N1f3, then Nh4 to harass the bishop, then Bc4 for the pile-on. The sacrifice didn't fire — but your setup did.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-5-h6: DEVIATION — Black plays 5…h6 (8%, 33 games)
// Teaches 3 white moves: Nxf7, Nf3, Ne5+
// The crazy one — Black kicks the knight, you sac on f7 anyway.
// Witty plays Nxf7 in 100% of these 33 games — transposes to the Alien Gambit!
// ═══════════════════════════════════════════════════════════

const WAM_DEV_5_H6: OpeningLesson = {
  id: 'wam-dev-5-h6',
  title: 'If 5…h6 (Alien Sac)',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "This one's wild. Black plays h6 here — 8% of games, 33 of them. They think they're kicking your knight. You sac on f7 anyway. Same sacrifice as the Alien Gambit, just from a Bf5 starting position.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Witty has played this position 33 times. 33 times he played Nxf7. Win rate: 79%. Different opening, same sac.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },

    // ── DEVIATION: 5…h6 ──
    {
      type: 'instruction',
      fen: FEN.dev5h6_after_h6,
      text: "h6 — Black kicks the knight. Most people would retreat. You don't.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'instruction',
      fen: FEN.dev5h6_after_h6,
      text: "Look at f7. Only the king defends it. Sound familiar? This is the Alien Gambit position — except Black's bishop is already on f5 instead of waiting on c8.",
      highlightSquares: ['f7', 'g5', 'e8'],
    },

    // ── TEACH 1: Nxf7! ──
    {
      type: 'play-move',
      fen: FEN.dev5h6_after_h6,
      correctMove: 'Nxf7',
      prompt: "Sacrifice on f7 — same as the Alien.",
      hint: 'Knight takes f7.',
      correctFeedback: "Nxf7!! The same sac, different opening. Black has no choice — Kxf7 is forced. Now you bring out the second knight and start the king hunt.",
      wrongFeedback: 'Play Nxf7 — sacrifice the knight, drag out the king. Trust the line.',
      postMoveArrow: ['f7', 'e8'],
    },

    // ── BLACK Kxf7 ──
    {
      type: 'instruction',
      fen: FEN.dev5h6_after_Kxf7,
      text: "Kxf7 — king forced to the middle of the board. No pawn cover, no defenders. Time to develop with pressure.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },

    // ── TEACH 2: Nf3 ──
    {
      type: 'play-move',
      fen: FEN.dev5h6_after_Kxf7,
      correctMove: 'Nf3',
      prompt: "Develop the other knight.",
      hint: 'Knight to f3 — same as the Alien Gambit follow-up.',
      correctFeedback: "Nf3! Witty plays this 100% of the time after the sac — 33 of 33 games. Develops AND blocks any …Qxd4 ideas. Black's most common reply: Nd7 (17 games).",
      wrongFeedback: 'Play Nf3 — develop the knight, block Qd4 threats.',
    },

    // ── BLACK Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev5h6_after_Nd7,
      text: "Nd7 — Black develops, prepping Nf6 next. The most common response (17 of 33 games).",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 3: Ne5+ ──
    {
      type: 'play-move',
      fen: FEN.dev5h6_after_Nd7,
      correctMove: 'Ne5+',
      prompt: "Knight to e5 with check.",
      hint: 'Knight jumps from f3 to e5 — check from the knight.',
      correctFeedback: "Ne5+! Discovered check from the knight AND attacks the bishop on f5. Witty plays this in 14 of 33 games — the most common attacking continuation. Black has to move the king.",
      wrongFeedback: 'Play Ne5+ — knight check that also attacks the bishop on f5.',
      postMoveArrow: ['e5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.dev5h6_after_Ne5,
      text: "Knight on e5 giving check, bishop on f5 hanging, king on f7 stranded. Black has to react — and any king move loses tempo. Material: down a knight, but the attack continues.",
      highlightSquares: ['e5', 'f5', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Black plays h6. You sac anyway. Run it.",
    },
    { type: 'instruction', fen: FEN.dev5h6_after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    {
      type: 'play-move',
      fen: FEN.dev5h6_after_h6,
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    { type: 'instruction', fen: FEN.dev5h6_after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    {
      type: 'play-move',
      fen: FEN.dev5h6_after_Kxf7,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    { type: 'instruction', fen: FEN.dev5h6_after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev5h6_after_Nd7,
      correctMove: 'Ne5+',
      prompt: 'Your move.',
      hint: 'Ne5+.',
      correctFeedback: 'Ne5+.',
      wrongFeedback: 'Ne5+.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev5h6_after_Ne5,
      text: "Different opening, same sacrifice. When Black plays h6 here, the Alien fires. 79% win rate over 33 games.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-5-Nf6: DEVIATION — Black plays 5…Nf6 (6%, 24 games)
// Teaches 3 white moves: N1f3, Bc4, Ne5
// Witty plays N1f3 in 100% of games, Bc4 in 12 of 24 (50%, most common).
// ═══════════════════════════════════════════════════════════

const WAM_DEV_5_NF6: OpeningLesson = {
  id: 'wam-dev-5-Nf6',
  title: 'If 5…Nf6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Black plays Nf6 here — 6% of games, 24 games total. Witty's win rate: 88% (21 wins, 3 losses). Black develops to defend f7 and h7.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },

    // ── DEVIATION: 5…Nf6 ──
    {
      type: 'instruction',
      fen: FEN.dev5Nf6_after_Nf6,
      text: "Nf6 — Black develops a defender, eyes the e4 knight (already moved) and indirectly defends h7.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 1: N1f3 ──
    {
      type: 'play-move',
      fen: FEN.dev5Nf6_after_Nf6,
      correctMove: 'N1f3',
      prompt: "Develop the other knight.",
      hint: 'Knight from g1 to f3.',
      correctFeedback: "N1f3 — 100% of 24 games. You develop normally and wait for Black to commit. Most common Black response: Nbd7 (7 games) or h6 (9 games) — and if h6, you sac with Nxf7!",
      wrongFeedback: 'Play N1f3 — develop the knight, wait for Black to commit.',
    },

    // ── BLACK Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.dev5Nf6_after_Nbd7,
      text: "Nbd7 — Black brings the other knight out, defending and preparing to control e5. (If Black had played h6 instead, you'd sac on f7 — same Alien pattern.)",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.dev5Nf6_after_Nbd7,
      correctMove: 'Bc4',
      prompt: "Develop the bishop toward f7.",
      hint: 'Bishop to c4.',
      correctFeedback: "Bc4 — Witty plays this in 12 of 24 games (50%, most common). Bishop aims at f7 — same theme as the main line. Black usually plays e6 to block the diagonal.",
      wrongFeedback: 'Play Bc4 — point the bishop at f7.',
      postMoveArrow: ['c4', 'f7'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.dev5Nf6_after_e6,
      text: "e6 — Black blocks the bishop's diagonal. Now you finish your setup.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 3: Ne5 ──
    {
      type: 'play-move',
      fen: FEN.dev5Nf6_after_e6,
      correctMove: 'Ne5',
      prompt: "Jump the f3 knight to e5 — central outpost.",
      hint: 'Knight from f3 to e5.',
      correctFeedback: "Ne5 — both knights eyeing f7 again. Attacks Black's bishop on f5 indirectly (defends e5 outpost). Witty plays this in 9 of 24 games — most aggressive continuation.",
      wrongFeedback: 'Play Ne5 — central knight outpost, both knights pointed at f7.',
      postMoveArrow: ['e5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.dev5Nf6_after_Ne5,
      text: "Two knights on g5 and e5, bishop on c4 — every piece pointed at the f7 square. 88% win rate from this position. Black is in trouble.",
      highlightSquares: ['e5', 'g5', 'c4', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Black plays Nf6. Run the sequence.",
    },
    { type: 'instruction', fen: FEN.dev5Nf6_after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    {
      type: 'play-move',
      fen: FEN.dev5Nf6_after_Nf6,
      correctMove: 'N1f3',
      prompt: 'Your move.',
      hint: 'N1f3.',
      correctFeedback: 'N1f3.',
      wrongFeedback: 'N1f3.',
    },
    { type: 'instruction', fen: FEN.dev5Nf6_after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev5Nf6_after_Nbd7,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.dev5Nf6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.dev5Nf6_after_e6,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev5Nf6_after_Ne5,
      text: "When Black plays Nf6: develop, drop the bishop, double down on f7. 88% win rate over 24 games.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-6-e6: DEVIATION — Black plays 6…e6 (9%, 22 games)
// Teaches 3 white moves: Ne5, Nxg6, Bc4
// Witty plays Ne5 in 10 of 22 games (45%). 82% win rate (18W/4L).
// ═══════════════════════════════════════════════════════════

const WAM_DEV_6_E6: OpeningLesson = {
  id: 'wam-dev-6-e6',
  title: 'If 6…e6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "After 5…Bg6 6.N1f3, Black plays e6 instead of h6 — 9% of games, 22 games. They're skipping the kick and developing. Witty plays Ne5 attacking the bishop on g6 — 18 wins, 4 losses (82%).",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },

    // ── DEVIATION: 6…e6 ──
    {
      type: 'instruction',
      fen: FEN.dev6e6_after_e6,
      text: "e6 — Black plays this instead of h6. No kick, but no fight for e5 either.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 1: Ne5 ──
    {
      type: 'play-move',
      fen: FEN.dev6e6_after_e6,
      correctMove: 'Ne5',
      prompt: "Jump the knight to e5 — attack the bishop on g6.",
      hint: 'Knight from f3 to e5.',
      correctFeedback: "Ne5! Both knights eyeing g6 now. Witty plays this in 10 of 22 games (45%). Win rate from here: 100% in this branch (10 wins, 0 losses).",
      wrongFeedback: 'Play Ne5 — attack the bishop on g6 with the central knight.',
      postMoveArrow: ['e5', 'g6'],
    },

    // ── BLACK Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev6e6_after_Nd7,
      text: "Nd7 — Black develops, hoping to challenge your e5 knight. Doesn't help — your knight on g5 still wants to capture on g6.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: Nxg6 ──
    {
      type: 'play-move',
      fen: FEN.dev6e6_after_Nd7,
      correctMove: 'Nxg6',
      prompt: "Take the bishop on g6.",
      hint: 'Knight from g5 captures g6 (the g5 knight, the OTHER one — N5xg6 if needed).',
      correctFeedback: "Nxg6! Bishop captured. Black has to recapture with the h-pawn — and that opens the h-file for your rook.",
      wrongFeedback: 'Play Nxg6 — take the bishop. Black recaptures with the h-pawn.',
      postMoveArrow: ['g6', 'h7'],
    },

    // ── BLACK hxg6 ──
    {
      type: 'instruction',
      fen: FEN.dev6e6_after_hxg6,
      text: "hxg6 — Black recaptures with the h-pawn (forced — the f-pawn can't reach g6). The h-file is now wide open for your rook on h1.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'g6', 'h1', 'h8'],
    },

    // ── TEACH 3: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.dev6e6_after_hxg6,
      correctMove: 'Bc4',
      prompt: "Develop the bishop toward f7.",
      hint: 'Bishop to c4.',
      correctFeedback: "Bc4 — finish development. Open h-file ready for the rook, bishop on c4 aiming at f7. Black's kingside is wrecked, you're up the bishop pair.",
      wrongFeedback: 'Play Bc4 — finish your setup, aim at f7.',
      postMoveArrow: ['c4', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.dev6e6_after_Bc4,
      text: "Open h-file, bishop on c4, knight on g5. Black's pawn structure is shattered. Attack is rolling.",
      highlightSquares: ['c4', 'g5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "Black plays e6. Hit g6 and open the h-file.",
    },
    { type: 'instruction', fen: FEN.dev6e6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.dev6e6_after_e6,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },
    { type: 'instruction', fen: FEN.dev6e6_after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev6e6_after_Nd7,
      correctMove: 'Nxg6',
      prompt: 'Your move.',
      hint: 'Nxg6.',
      correctFeedback: 'Nxg6.',
      wrongFeedback: 'Nxg6.',
    },
    { type: 'instruction', fen: FEN.dev6e6_after_hxg6, text: 'hxg6.', autoAdvance: 800, highlightSquares: ['h7', 'g6'] },
    {
      type: 'play-move',
      fen: FEN.dev6e6_after_hxg6,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev6e6_after_Bc4,
      text: "Ne5, Nxg6, Bc4. Trade off the bishop, blast open the h-file, finish development. 82% win rate over 22 games.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-6-Nd7: DEVIATION — Black plays 6…Nd7 (7%, 18 games)
// Teaches 3 white moves: Bc4, Qe2, O-O
// Witty plays Bc4 in 14 of 18 games (78%). Cleanest follow-up: Qe2, O-O.
// ═══════════════════════════════════════════════════════════

const WAM_DEV_6_ND7: OpeningLesson = {
  id: 'wam-dev-6-Nd7',
  title: 'If 6…Nd7',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "After 5…Bg6 6.N1f3, Black plays Nd7 instead of h6 — 7% of games, 18 of them. Witty plays Bc4 in 14 of those 18. You set up like the main line and look for the Ne6 sac next.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },

    // ── DEVIATION: 6…Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev6Nd7_after_Nd7,
      text: "Nd7 — Black develops, defending f7 and preparing Ngf6 next. No kick on the g5 knight.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 1: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.dev6Nd7_after_Nd7,
      correctMove: 'Bc4',
      prompt: "Develop the bishop — aim at f7.",
      hint: 'Bishop to c4.',
      correctFeedback: "Bc4 — Witty's choice in 14 of 18 games (78%). Bishop on c4 aims at f7, sets up the same attacking pattern as the main line. Black usually plays e6 to defend.",
      wrongFeedback: 'Play Bc4 — same theme as the main line, aim at f7.',
      postMoveArrow: ['c4', 'f7'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.dev6Nd7_after_e6,
      text: "e6 — Black's most common reply (9 of 14 games), blocking the bishop's diagonal. Now you finish development.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 2: Qe2 ──
    {
      type: 'play-move',
      fen: FEN.dev6Nd7_after_e6,
      correctMove: 'Qe2',
      prompt: "Queen to e2 — support the center, prep castling.",
      hint: 'Queen from d1 to e2.',
      correctFeedback: "Qe2 — Witty plays this in 7 of 14 games (50%). Queen supports e6 ideas, gets out of the way for castling. Quiet, strong development.",
      wrongFeedback: 'Play Qe2 — queen development, clear the way for castling.',
    },

    // ── BLACK Ngf6 ──
    {
      type: 'instruction',
      fen: FEN.dev6Nd7_after_Qe2,
      text: "Ngf6 — Black brings the other knight out, defending h7 and contesting the center.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 3: O-O ──
    {
      type: 'play-move',
      fen: FEN.dev6Nd7_after_Qe2,
      correctMove: 'O-O',
      prompt: "Castle kingside — finish development.",
      hint: 'Castle short.',
      correctFeedback: "O-O — king safe, rook on f1. Setup is clean: bishop on c4, queen on e2, knights ready. Look for Ne6 sac next when Black plays the wrong move.",
      wrongFeedback: 'Play O-O — castle and activate the rook.',
    },
    {
      type: 'instruction',
      fen: FEN.dev6Nd7_after_OO,
      text: "Fully developed, castled, two knights eyeing f7. Black is solid but cramped. The position is comfortable for White.",
      highlightSquares: ['c4', 'e2', 'g5', 'f3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "Black plays Nd7. Run the setup.",
    },
    { type: 'instruction', fen: FEN.dev6Nd7_after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev6Nd7_after_Nd7,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.dev6Nd7_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.dev6Nd7_after_e6,
      correctMove: 'Qe2',
      prompt: 'Your move.',
      hint: 'Qe2.',
      correctFeedback: 'Qe2.',
      wrongFeedback: 'Qe2.',
    },
    { type: 'instruction', fen: FEN.dev6Nd7_after_Qe2, text: 'Ngf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    {
      type: 'play-move',
      fen: FEN.dev6Nd7_after_Qe2,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev6Nd7_after_OO,
      text: "Bc4, Qe2, O-O. No sacrifice fired, but you have a clean developing setup — and the Ne6 sac is still in the holster if Black slips.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-8-Bf5: DEVIATION — Black plays 8…Bf5 (40%, 71 games — huge!)
// Teaches 3 white moves: Bc4, Bxe6, Bxf5
// Witty plays Bc4 in 39 of 69 (57%), then 100% Bxe6 after Nd7, then Bxf5.
// 81% win rate over 69 games.
// ═══════════════════════════════════════════════════════════

const WAM_DEV_8_BF5: OpeningLesson = {
  id: 'wam-dev-8-Bf5',
  title: 'If 8…Bf5',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "After 8.Ne5, Black plays Bf5 instead of the coffin Bf7 — 40% of the time, 71 games. Almost as common as Bf7. Witty plays Bc4 in 57% of these games. The plan: grab the e6 pawn, then the f5 bishop.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay through the first sacrifice.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },

    // ── DEVIATION: 8…Bf5 ──
    {
      type: 'instruction',
      fen: FEN.dev8Bf5_after_Bf5,
      text: "Bf5 — instead of the coffin retreat to f7, Black drops the bishop on f5. Active square, eyes c2. But f7 is open AND e6 is undefended.",
      autoAdvance: 800,
      highlightSquares: ['g6', 'f5'],
    },

    // ── TEACH 1: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.dev8Bf5_after_Bf5,
      correctMove: 'Bc4',
      prompt: "Bishop to c4 — attack e6.",
      hint: 'Bishop to c4 — it attacks the e6 pawn.',
      correctFeedback: "Bc4! Witty plays this in 39 of 69 games (57%). Hits e6 — and the f7 pawn is GONE so e6 only has the d-pawn defending it. Black usually plays Nd7 to defend.",
      wrongFeedback: 'Play Bc4 — bishop attacks e6, which has no f7 pawn to defend it anymore.',
      postMoveArrow: ['c4', 'e6'],
    },

    // ── BLACK Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev8Bf5_after_Bc4,
      text: "Nd7 — most common (13 of 39 games). Black develops AND attacks your knight on e5. Looks scary. It isn't.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: Bxe6 ──
    {
      type: 'play-move',
      fen: FEN.dev8Bf5_after_Nd7,
      correctMove: 'Bxe6',
      prompt: "Take the e6 pawn.",
      hint: 'Bishop captures e6.',
      correctFeedback: "Bxe6! Witty plays this in 100% of 13 games after Nd7. You grab the pawn and the e-file opens. Black has to react — usually with Nxe5 trading the knight.",
      wrongFeedback: 'Play Bxe6 — grab the pawn, open the e-file.',
      postMoveArrow: ['e6', 'e8'],
    },

    // ── BLACK Nxe5 ──
    {
      type: 'instruction',
      fen: FEN.dev8Bf5_after_Bxe6,
      text: "Nxe5 — Black trades off your strong knight. They had to — your bishop and queen were lining up on the king.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'e5'],
    },

    // ── TEACH 3: Bxf5 ──
    {
      type: 'play-move',
      fen: FEN.dev8Bf5_after_Nxe5,
      correctMove: 'Bxf5',
      prompt: "Take the bishop on f5.",
      hint: 'Bishop from e6 takes f5.',
      correctFeedback: "Bxf5! Witty plays this in 10 of 13 games (77%). You've now captured a pawn AND a bishop. Black is down material with a stranded king. 81% win rate from this position.",
      wrongFeedback: 'Play Bxf5 — take the second bishop, pile up the material.',
    },
    {
      type: 'instruction',
      fen: FEN.dev8Bf5_after_Bxf5,
      text: "Two bishops captured, knight grabbed back. Material is even-ish but Black's king is exposed and you have a winning attack setup. 81% win rate over 69 games.",
      highlightSquares: ['f5', 'e8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Black plays Bf5 instead of the coffin. Bc4, Bxe6, Bxf5.",
    },
    { type: 'instruction', fen: FEN.dev8Bf5_after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['g6', 'f5'] },
    {
      type: 'play-move',
      fen: FEN.dev8Bf5_after_Bf5,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.dev8Bf5_after_Bc4, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev8Bf5_after_Nd7,
      correctMove: 'Bxe6',
      prompt: 'Your move.',
      hint: 'Bxe6.',
      correctFeedback: 'Bxe6.',
      wrongFeedback: 'Bxe6.',
    },
    { type: 'instruction', fen: FEN.dev8Bf5_after_Bxe6, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['d7', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev8Bf5_after_Nxe5,
      correctMove: 'Bxf5',
      prompt: 'Your move.',
      hint: 'Bxf5.',
      correctFeedback: 'Bxf5.',
      wrongFeedback: 'Bxf5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev8Bf5_after_Bxf5,
      text: "Bc4, Bxe6, Bxf5 — eat the bishop pair. The 40% deviation, handled. 81% win rate over 69 games.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-8-Be4: DEVIATION — Black plays 8…Be4 (12%, 21 games, 100% Witty wins!)
// Teaches 3 white moves: Bc4, Qe2, dxe5
// Witty plays Bc4 in 17 of 21 (81%), then Qe2 in 12 of 17 (most common after Nd7).
// 21 games, 21 wins. 100% win rate.
// ═══════════════════════════════════════════════════════════

const WAM_DEV_8_BE4: OpeningLesson = {
  id: 'wam-dev-8-Be4',
  title: 'If 8…Be4 (100% wins)',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Witty has played this position 21 times. He has won 21 times. 100% win rate. Black's bishop on e4 is a dead piece — it walks into the trap on its own.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Black plays Be4 — trying to be active, going for c2 threats. It's wrong. You don't even need the sacrifice anymore — just clean development wins.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay through the first sacrifice.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },

    // ── DEVIATION: 8…Be4 ──
    {
      type: 'instruction',
      fen: FEN.dev8Be4_after_Be4,
      text: "Be4 — Black drops the bishop on e4 going for c2 threats. The bishop is exposed and the king is still on e8 with no f7 pawn.",
      autoAdvance: 800,
      highlightSquares: ['g6', 'e4'],
    },

    // ── TEACH 1: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.dev8Be4_after_Be4,
      correctMove: 'Bc4',
      prompt: "Bishop to c4 — aim at e6.",
      hint: 'Bishop to c4.',
      correctFeedback: "Bc4! 17 of 21 Witty games (81%). Bishop on c4 hits e6 and supports the kingside attack. Black usually plays Nd7 trying to defend (10 of 17 games).",
      wrongFeedback: 'Play Bc4 — aim at the weak e6 pawn.',
      postMoveArrow: ['c4', 'e6'],
    },

    // ── BLACK Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev8Be4_after_Bc4,
      text: "Nd7 — Black develops. Now the position is set: your knight on e5 is the strongest piece on the board, both bishops are pointed at the kingside.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: Qe2 ──
    {
      type: 'play-move',
      fen: FEN.dev8Be4_after_Nd7,
      correctMove: 'Qe2',
      prompt: "Queen to e2 — support the knight, prep castling.",
      hint: 'Queen to e2.',
      correctFeedback: "Qe2! Witty plays this in 12 of 17 games (71%). Queen supports the e-file, defends the knight, sets up castling. Quiet but devastating.",
      wrongFeedback: 'Play Qe2 — queen development, support the knight.',
    },

    // ── BLACK Nxe5 ──
    {
      type: 'instruction',
      fen: FEN.dev8Be4_after_Qe2,
      text: "Nxe5 — Black trades knights. They had to — your knight was too strong. But now they've used the d7 knight, and the king is even more exposed.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'e5'],
    },

    // ── TEACH 3: dxe5 ──
    {
      type: 'play-move',
      fen: FEN.dev8Be4_after_Nxe5,
      correctMove: 'dxe5',
      prompt: "Recapture with the d-pawn.",
      hint: 'd-pawn takes e5.',
      correctFeedback: "dxe5! Pawn on e5 dominates the board — blockades the e-file, attacks any piece on f6, supports any future Bxe6+. The Black bishop on e4 is now hanging in the air with nothing to do.",
      wrongFeedback: 'Play dxe5 — recapture with the pawn, take over the center.',
    },
    {
      type: 'instruction',
      fen: FEN.dev8Be4_after_dxe5,
      text: "Position locked: pawn on e5, bishops aimed at the king, queen on e2, ready to castle. Black has tried this 21 times. Witty has won 21 times. The bishop on e4 is a dead piece — just go finish the job.",
      highlightSquares: ['e5', 'c4', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Black plays Be4 — the 100%-loss line. Bc4, Qe2, dxe5.",
    },
    { type: 'instruction', fen: FEN.dev8Be4_after_Be4, text: 'Be4.', autoAdvance: 800, highlightSquares: ['g6', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.dev8Be4_after_Be4,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.dev8Be4_after_Bc4, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.dev8Be4_after_Nd7,
      correctMove: 'Qe2',
      prompt: 'Your move.',
      hint: 'Qe2.',
      correctFeedback: 'Qe2.',
      wrongFeedback: 'Qe2.',
    },
    { type: 'instruction', fen: FEN.dev8Be4_after_Qe2, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['d7', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev8Be4_after_Qe2,
      correctMove: 'dxe5',
      prompt: 'Your move.',
      hint: 'dxe5.',
      correctFeedback: 'dxe5.',
      wrongFeedback: 'dxe5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev8Be4_after_dxe5,
      text: "21 games. 21 wins. The bishop on e4 walks into a position it cannot survive. Bc4, Qe2, dxe5 — and Black is losing.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-test-1: LEVEL 1 TEST
// Tests main line + every deviation. Zero guidance.
// ═══════════════════════════════════════════════════════════

const WAM_TEST_1: OpeningLesson = {
  id: 'wam-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the full Martian Gambit — both knight sacrifices, the king hunt, and all seven real-play deviations: 5…e6, 5…h6, 5…Nf6, 6…e6, 6…Nd7, 8…Bf5, 8…Be4. From memory.",
    },

    // ── MAIN LINE ──
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_Bg6, text: 'Bg6.', autoAdvance: 800, highlightSquares: ['f5', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bg6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.after_fxe6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Bf7, text: 'Bf7.', autoAdvance: 800, highlightSquares: ['g6', 'f7'] },
    { type: 'play-move', fen: FEN.after_Bf7, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nd7, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Qg4', prompt: 'Your move.', hint: 'Qg4.', correctFeedback: 'Qg4.', wrongFeedback: 'Qg4.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    { type: 'play-move', fen: FEN.after_Qa5, correctMove: 'Bd2', prompt: 'Your move.', hint: 'Bd2.', correctFeedback: 'Bd2.', wrongFeedback: 'Bd2.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['a5', 'c7'] },
    { type: 'play-move', fen: FEN.after_Qc7, correctMove: 'Bxe6+', prompt: 'Your move.', hint: 'Bxe6+.', correctFeedback: 'Bxe6+.', wrongFeedback: 'Bxe6+.' },
    { type: 'instruction', fen: FEN.after_Ke8, text: 'Ke8.', autoAdvance: 800, highlightSquares: ['f7', 'e8'] },
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'Qg6+', prompt: 'Your move.', hint: 'Qg6+.', correctFeedback: 'Qg6+.', wrongFeedback: 'Qg6+.' },
    { type: 'instruction', fen: FEN.after_Kd8, text: 'Kd8 — winning attack.', autoAdvance: 800, highlightSquares: ['e8', 'd8'] },

    // ── DEV 1: 5…e6 ──
    { type: 'instruction', fen: FEN.after_Ng5, text: "Deviation 1: Black plays 5…e6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev5e6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.dev5e6_after_e6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },

    // ── DEV 2: 5…h6 ──
    { type: 'instruction', fen: FEN.after_Ng5, text: "Deviation 2: Black plays 5…h6. Sac on f7 anyway.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev5h6_after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.dev5h6_after_h6, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },

    // ── DEV 3: 5…Nf6 ──
    { type: 'instruction', fen: FEN.after_Ng5, text: "Deviation 3: Black plays 5…Nf6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev5Nf6_after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev5Nf6_after_Nf6, correctMove: 'N1f3', prompt: 'Your move.', hint: 'N1f3.', correctFeedback: 'N1f3.', wrongFeedback: 'N1f3.' },

    // ── DEV 4: 6…e6 ──
    { type: 'instruction', fen: FEN.after_N1f3, text: "Deviation 4: Black plays 6…e6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev6e6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.dev6e6_after_e6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },

    // ── DEV 5: 6…Nd7 ──
    { type: 'instruction', fen: FEN.after_N1f3, text: "Deviation 5: Black plays 6…Nd7.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev6Nd7_after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.dev6Nd7_after_Nd7, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // ── DEV 6: 8…Bf5 ──
    { type: 'instruction', fen: FEN.after_Ne5, text: "Deviation 6: Black plays 8…Bf5 (40% of games).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev8Bf5_after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['g6', 'f5'] },
    { type: 'play-move', fen: FEN.dev8Bf5_after_Bf5, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // ── DEV 7: 8…Be4 ──
    { type: 'instruction', fen: FEN.after_Ne5, text: "Deviation 7: Black plays 8…Be4 (100% Witty wins).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dev8Be4_after_Be4, text: 'Be4.', autoAdvance: 800, highlightSquares: ['g6', 'e4'] },
    { type: 'play-move', fen: FEN.dev8Be4_after_Be4, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.dev8Be4_after_Bc4,
      text: "Test complete. Two knight sacrifices, the king hunt, and every real-play deviation Witty faces — all of it, in your pocket.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const WITTY_ALIEN_MARTIAN_LESSONS: Record<string, OpeningLesson> = {
  'wam-1': WAM_1,
  'wam-2': WAM_2,
  'wam-3': WAM_3,
  'wam-4': WAM_4,
  'wam-5': WAM_5,
  'wam-6': WAM_6,
  'wam-7': WAM_7,
  'wam-dev-5-e6': WAM_DEV_5_E6,
  'wam-dev-5-h6': WAM_DEV_5_H6,
  'wam-dev-5-Nf6': WAM_DEV_5_NF6,
  'wam-dev-6-e6': WAM_DEV_6_E6,
  'wam-dev-6-Nd7': WAM_DEV_6_ND7,
  'wam-dev-8-Bf5': WAM_DEV_8_BF5,
  'wam-dev-8-Be4': WAM_DEV_8_BE4,
  'wam-test-1': WAM_TEST_1,
}

export function getWittyAlienMartianLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_MARTIAN_LESSONS[id]
}
