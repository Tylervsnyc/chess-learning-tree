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
// ⚠️  CHUNKING RULE: EVERY main-line lesson teaches EXACTLY 3 white moves.
// 7 main lessons × 3 = 21 white moves + 1 puzzle move (Qf5+) = 22 total.
// Deviations also teach 3 white moves each.
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
// Source: research/alien-gambit-oneandonly.pgn — "Martian gambit" chapter
//         research/alien-gambit-ishaan.pgn — Trap 7 (Bf5 sideline when no h6)
//
// FENs computed with chess.js from move sequences (verified).
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:     'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:     'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:     'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:     'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
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

  // === DEVIATION no-h6: 6…e6 7.Ne5! Nf6 8.Bd3 Bxd3 9.Qxd3 ===
  noh6_after_e6:    'rn1qkbnr/pp3ppp/2p1p1b1/6N1/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 7',
  noh6_after_Ne5:   'rn1qkbnr/pp3ppp/2p1p1b1/4N1N1/3P4/8/PPP2PPP/R1BQKB1R b KQkq - 1 7',
  noh6_after_Nf6:   'rn1qkb1r/pp3ppp/2p1pnb1/4N1N1/3P4/8/PPP2PPP/R1BQKB1R w KQkq - 2 8',
  noh6_after_Bd3:   'rn1qkb1r/pp3ppp/2p1pnb1/4N1N1/3P4/3B4/PPP2PPP/R1BQK2R b KQkq - 3 8',
  noh6_after_Bxd3:  'rn1qkb1r/pp3ppp/2p1pn2/4N1N1/3P4/3b4/PPP2PPP/R1BQK2R w KQkq - 0 9',
  noh6_after_Qxd3:  'rn1qkb1r/pp3ppp/2p1pn2/4N1N1/3P4/3Q4/PPP2PPP/R1B1K2R b KQkq - 0 9',

  // === DEVIATION decline: 7…Qa5+ 8.Bd2 Qxd2+ 9.Qxd2 fxe6 10.Bd3 ===
  dec_after_Qa5:    'rn2kbnr/pp2ppp1/2p1N1bp/q7/3P4/5N2/PPP2PPP/R1BQKB1R w KQkq - 2 8',
  dec_after_Bd2:    'rn2kbnr/pp2ppp1/2p1N1bp/q7/3P4/5N2/PPPB1PPP/R2QKB1R b KQkq - 3 8',
  dec_after_Qxd2:   'rn2kbnr/pp2ppp1/2p1N1bp/8/3P4/5N2/PPPq1PPP/R2QKB1R w KQkq - 0 9',
  dec_after_QxQd2:  'rn2kbnr/pp2ppp1/2p1N1bp/8/3P4/5N2/PPPQ1PPP/R3KB1R b KQkq - 0 9',
  dec_after_fxe6:   'rn2kbnr/pp2p1p1/2p1p1bp/8/3P4/5N2/PPPQ1PPP/R3KB1R w KQkq - 0 10',
  dec_after_Bd3:    'rn2kbnr/pp2p1p1/2p1p1bp/8/3P4/3B1N2/PPPQ1PPP/R3K2R b KQkq - 1 10',
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
// wam-dev-no-h6: DEVIATION — 6…e6 instead of h6 (Ishaan Trap 7)
// Teaches 3 white moves: Ne5, Bd3, Qxd3
// Black's 7…Nf6 8…Bxd3 are the natural continuation.
// ═══════════════════════════════════════════════════════════

const WAM_DEV_NO_H6: OpeningLesson = {
  id: 'wam-dev-no-h6',
  title: 'If e6 (no h6)',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "Sometimes Black skips h6 and plays e6 first — trying to control e5 and stop your second knight from jumping in. You get to e5 anyway, and now BOTH knights are eyeing f7.",
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

    // ── DEVIATION: Black plays e6 instead of h6 ──
    {
      type: 'instruction',
      fen: FEN.noh6_after_e6,
      text: "e6 — Black plays this instead of h6. They're prepping Bd6 to fight for e5 and stop your knight from jumping in.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.noh6_after_e6,
      text: "Don't let them set up. Jump to e5 anyway — your f3 knight goes RIGHT NOW, and both knights end up forking f7.",
      highlightSquares: ['f3', 'e5', 'g5'],
    },

    // ── TEACH 1: Ne5! ──
    {
      type: 'play-move',
      fen: FEN.noh6_after_e6,
      correctMove: 'Ne5',
      prompt: "Knight to e5 — beat them to it.",
      hint: 'Knight from f3 to e5.',
      correctFeedback: "Ne5! Both your knights now point at f7 — the g5 knight and the e5 knight. Black has a real problem defending.",
      wrongFeedback: 'Play Ne5 — get to e5 before Black can stop you.',
      postMoveArrow: [['e5', 'f7'], ['g5', 'f7']],
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.noh6_after_Nf6,
      text: "Nf6 — Black develops, defending h7 and preparing to contest the kingside. Sensible move. The sacrifice can't fire here — Black's bishop on g6 has support now.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 2: Bd3 ──
    {
      type: 'instruction',
      fen: FEN.noh6_after_Nf6,
      text: "Switch gears. Challenge Black's bishop on g6 — Bd3 attacks it down the b1-h7 diagonal.",
      highlightSquares: ['f1', 'd3', 'g6'],
    },
    {
      type: 'play-move',
      fen: FEN.noh6_after_Nf6,
      correctMove: 'Bd3',
      prompt: "Challenge the bishop on g6.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3 — your bishop and Black's bishop face off. Black has to trade or retreat.",
      wrongFeedback: 'Play Bd3 — challenge the bishop on g6.',
      postMoveArrow: ['d3', 'g6'],
    },

    // ── BLACK Bxd3 ──
    {
      type: 'instruction',
      fen: FEN.noh6_after_Bxd3,
      text: "Bxd3 — Black trades bishops. Now you recapture and your queen gets a great square.",
      autoAdvance: 800,
      highlightSquares: ['g6', 'd3'],
    },

    // ── TEACH 3: Qxd3 ──
    {
      type: 'play-move',
      fen: FEN.noh6_after_Bxd3,
      correctMove: 'Qxd3',
      prompt: "Recapture with the queen.",
      hint: 'Queen takes d3.',
      correctFeedback: "Qxd3 — queen recaptures, eyeing the b1-h7 diagonal and h7 in particular. Position is roughly equal but very playable.",
      wrongFeedback: 'Play Qxd3 — take with the queen.',
      postMoveArrow: ['d3', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.noh6_after_Qxd3,
      text: "Two knights eyeing f7, queen pointing at h7, clean development. The Martian sacrifice didn't fire — but you have a normal, playable attacking position.",
      highlightSquares: ['e5', 'g5', 'd3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_N1f3,
      text: "Black plays e6. Run the sequence.",
    },
    { type: 'instruction', fen: FEN.noh6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.noh6_after_e6,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },
    { type: 'instruction', fen: FEN.noh6_after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    {
      type: 'play-move',
      fen: FEN.noh6_after_Nf6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },
    { type: 'instruction', fen: FEN.noh6_after_Bxd3, text: 'Bxd3.', autoAdvance: 800, highlightSquares: ['g6', 'd3'] },
    {
      type: 'play-move',
      fen: FEN.noh6_after_Bxd3,
      correctMove: 'Qxd3',
      prompt: 'Your move.',
      hint: 'Qxd3.',
      correctFeedback: 'Qxd3.',
      wrongFeedback: 'Qxd3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.noh6_after_Qxd3,
      text: "When Black skips h6, you skip the Ne6 sac. Trade bishops, queen on d3, normal position. The trick weapon is back in the holster.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-decline: DEVIATION — 7…Qa5+ (Black declines with check)
// Teaches 3 white moves: Bd2, Qxd2, Bd3
// Queens get traded; Black wins the knight on e6 but you finish developing.
// ═══════════════════════════════════════════════════════════

const WAM_DEV_DECLINE: OpeningLesson = {
  id: 'wam-dev-decline',
  title: 'If Qa5+ (decline)',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Honest moment: if Black sees the trap, they play Qa5+ instead of fxe6. The queen moves AND gives check — your sacrifice is declined. You've got to know how to handle it.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the sacrifice.",
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

    // ── DEVIATION: 7…Qa5+ ──
    {
      type: 'instruction',
      fen: FEN.dec_after_Qa5,
      text: "Qa5+ — Black's best response. The queen escapes the knight's attack AND gives check at the same time. The sacrifice didn't land.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'a5'],
    },
    {
      type: 'instruction',
      fen: FEN.dec_after_Qa5,
      text: "You have to block. Bd2 is the only good square — blocks the check and develops.",
      highlightSquares: ['a5', 'e1'],
    },

    // ── TEACH 1: Bd2 ──
    {
      type: 'play-move',
      fen: FEN.dec_after_Qa5,
      correctMove: 'Bd2',
      prompt: "Block the check with a developing piece.",
      hint: 'Bishop to d2 — blocks AND develops.',
      correctFeedback: "Bd2 — blocks the check. But watch: your bishop on d2 is ALSO attacking Black's queen on a5 (a5-e1 diagonal). Black has to decide.",
      wrongFeedback: 'Play Bd2 — block with the bishop, two jobs at once.',
      postMoveArrow: ['d2', 'a5'],
    },

    // ── BLACK Qxd2+ ──
    {
      type: 'instruction',
      fen: FEN.dec_after_Qxd2,
      text: "Qxd2+ — Black trades queens. Smart — they don't want your queen to escape and they're already winning material. You're forced to recapture.",
      autoAdvance: 800,
      highlightSquares: ['a5', 'd2'],
    },

    // ── TEACH 2: Qxd2 ──
    {
      type: 'play-move',
      fen: FEN.dec_after_Qxd2,
      correctMove: 'Qxd2',
      prompt: "Recapture the queen.",
      hint: 'Queen takes d2.',
      correctFeedback: "Qxd2 — queens off. Now Black can finally grab your knight on e6.",
      wrongFeedback: 'Play Qxd2 — recapture with the queen.',
    },

    // ── BLACK fxe6 ──
    {
      type: 'instruction',
      fen: FEN.dec_after_fxe6,
      text: "fxe6 — Black takes the knight. You're down a piece for a pawn in an endgame. Time to finish development and make it as hard as possible.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },

    // ── TEACH 3: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.dec_after_fxe6,
      correctMove: 'Bd3',
      prompt: "Develop the last bishop — toward h7.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3 — challenges Black's bishop on g6, finishes development. You're worse but the position is playable. Time to fight on.",
      wrongFeedback: 'Play Bd3 — develop the bishop and challenge g6.',
      postMoveArrow: ['d3', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.dec_after_Bd3,
      text: "Honest assessment: when Black finds Qa5+, the gambit goes from 'attacking masterpiece' to 'down a piece, fight for the draw.' Trick weapons don't always work — that's the deal.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Black declines with Qa5+. Block, trade queens, develop.",
    },
    { type: 'instruction', fen: FEN.dec_after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    {
      type: 'play-move',
      fen: FEN.dec_after_Qa5,
      correctMove: 'Bd2',
      prompt: 'Your move.',
      hint: 'Bd2.',
      correctFeedback: 'Bd2.',
      wrongFeedback: 'Bd2.',
    },
    { type: 'instruction', fen: FEN.dec_after_Qxd2, text: 'Qxd2+.', autoAdvance: 800, highlightSquares: ['a5', 'd2'] },
    {
      type: 'play-move',
      fen: FEN.dec_after_Qxd2,
      correctMove: 'Qxd2',
      prompt: 'Your move.',
      hint: 'Qxd2.',
      correctFeedback: 'Qxd2.',
      wrongFeedback: 'Qxd2.',
    },
    { type: 'instruction', fen: FEN.dec_after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    {
      type: 'play-move',
      fen: FEN.dec_after_fxe6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dec_after_Bd3,
      text: "Bd2, Qxd2, Bd3 — the decline sequence. Most opponents under 2000 won't find Qa5+. When they do, you fight on a piece down.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-test-1: LEVEL 1 TEST
// Tests main line + both deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const WAM_TEST_1: OpeningLesson = {
  id: 'wam-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the full Martian Gambit — both knight sacrifices, the king hunt, and every deviation. From memory.",
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

    // ── DEV 1: e6 (no h6) ──
    { type: 'instruction', fen: FEN.after_N1f3, text: "Deviation 1: Black plays e6 instead of h6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.noh6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.noh6_after_e6, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },

    // ── DEV 2: Qa5+ (decline) ──
    { type: 'instruction', fen: FEN.after_Ne6, text: "Deviation 2: Black declines with Qa5+.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.dec_after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    { type: 'play-move', fen: FEN.dec_after_Qa5, correctMove: 'Bd2', prompt: 'Your move.', hint: 'Bd2.', correctFeedback: 'Bd2.', wrongFeedback: 'Bd2.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.dec_after_Bd2,
      text: "Test complete. Two knight sacrifices, the bishop coffin, the king hunt, the e6 skip, the Qa5+ decline — the whole Martian, in your pocket.",
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
  'wam-dev-no-h6': WAM_DEV_NO_H6,
  'wam-dev-decline': WAM_DEV_DECLINE,
  'wam-test-1': WAM_TEST_1,
}

export function getWittyAlienMartianLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_MARTIAN_LESSONS[id]
}
