import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SCANDINAVIAN DEFENSE LESSONS (s-1 through s-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5
//            7.Bd2 e6 8.Nd5 Qd8 9.Nxf6+ gxf6
//            10.Bb3 Nd7 11.Qe2 Qc7 12.Nh4 Bg6
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d5:    'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_exd5:  'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2',
  after_Qxd5:  'rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:   'rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3',
  after_Qa5:   'rnb1kbnr/ppp1pppp/8/q7/8/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 4',
  after_d4:    'rnb1kbnr/ppp1pppp/8/q7/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Nf6:   'rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Nf3:   'rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  after_c6:    'rnb1kb1r/pp2pppp/2p2n2/q7/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  after_Bc4:   'rnb1kb1r/pp2pppp/2p2n2/q7/2BP4/2N2N2/PPP2PPP/R1BQK2R b KQkq - 1 6',
  after_Bf5:   'rn2kb1r/pp2pppp/2p2n2/q4b2/2BP4/2N2N2/PPP2PPP/R1BQK2R w KQkq - 2 7',
  after_Bd2:   'rn2kb1r/pp2pppp/2p2n2/q4b2/2BP4/2N2N2/PPPB1PPP/R2QK2R b KQkq - 3 7',
  after_e6:    'rn2kb1r/pp3ppp/2p1pn2/q4b2/2BP4/2N2N2/PPPB1PPP/R2QK2R w KQkq - 0 8',
  after_Nd5:   'rn2kb1r/pp3ppp/2p1pn2/q2N1b2/2BP4/5N2/PPPB1PPP/R2QK2R b KQkq - 1 8',
  after_Qd8:   'rn1qkb1r/pp3ppp/2p1pn2/3N1b2/2BP4/5N2/PPPB1PPP/R2QK2R w KQkq - 2 9',
  after_Nxf6:  'rn1qkb1r/pp3ppp/2p1pN2/5b2/2BP4/5N2/PPPB1PPP/R2QK2R b KQkq - 0 9',
  after_gxf6:  'rn1qkb1r/pp3p1p/2p1pp2/5b2/2BP4/5N2/PPPB1PPP/R2QK2R w KQkq - 0 10',
  after_Bb3:   'rn1qkb1r/pp3p1p/2p1pp2/5b2/3P4/1B3N2/PPPB1PPP/R2QK2R b KQkq - 1 10',
  after_Nd7:   'r2qkb1r/pp1n1p1p/2p1pp2/5b2/3P4/1B3N2/PPPB1PPP/R2QK2R w KQkq - 2 11',
  after_Qe2:   'r2qkb1r/pp1n1p1p/2p1pp2/5b2/3P4/1B3N2/PPPBQPPP/R3K2R b KQkq - 3 11',
  after_Qc7:   'r3kb1r/ppqn1p1p/2p1pp2/5b2/3P4/1B3N2/PPPBQPPP/R3K2R w KQkq - 4 12',
  after_Nh4:   'r3kb1r/ppqn1p1p/2p1pp2/5b2/3P3N/1B6/PPPBQPPP/R3K2R b KQkq - 5 12',
  after_Bg6:   'r3kb1r/ppqn1p1p/2p1ppb1/8/3P3N/1B6/PPPBQPPP/R3K2R w KQkq - 6 13',

  // Deviation: 4.Bc4 (instead of 4.d4)
  dev_Bc4_after_Bc4:  'rnb1kbnr/ppp1pppp/8/q7/2B5/2N5/PPPP1PPP/R1BQK1NR b KQkq - 3 4',
  dev_Bc4_after_Nf6:  'rnb1kb1r/ppp1pppp/5n2/q7/2B5/2N5/PPPP1PPP/R1BQK1NR w KQkq - 4 5',
  dev_Bc4_after_d3:   'rnb1kb1r/ppp1pppp/5n2/q7/2B5/2NP4/PPP2PPP/R1BQK1NR b KQkq - 0 5',
  dev_Bc4_after_c6:   'rnb1kb1r/pp2pppp/2p2n2/q7/2B5/2NP4/PPP2PPP/R1BQK1NR w KQkq - 0 6',
  dev_Bc4_after_Bd2:  'rnb1kb1r/pp2pppp/2p2n2/q7/2B5/2NP4/PPPB1PPP/R2QK1NR b KQkq - 1 6',
  dev_Bc4_after_Qc7:  'rnb1kb1r/ppq1pppp/2p2n2/8/2B5/2NP4/PPPB1PPP/R2QK1NR w KQkq - 2 7',

  // Deviation: 5.Bd2 (instead of 5.Nf3)
  dev_Bd2_after_Bd2:  'rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N5/PPPB1PPP/R2QKBNR b KQkq - 2 5',
  dev_Bd2_after_c6:   'rnb1kb1r/pp2pppp/2p2n2/q7/3P4/2N5/PPPB1PPP/R2QKBNR w KQkq - 0 6',
  dev_Bd2_after_Bc4:  'rnb1kb1r/pp2pppp/2p2n2/q7/2BP4/2N5/PPPB1PPP/R2QK1NR b KQkq - 1 6',
  dev_Bd2_after_Bf5:  'rn2kb1r/pp2pppp/2p2n2/q4b2/2BP4/2N5/PPPB1PPP/R2QK1NR w KQkq - 2 7',
  dev_Bd2_after_Nd5:  'rn2kb1r/pp2pppp/2p2n2/q2N1b2/2BP4/8/PPPB1PPP/R2QK1NR b KQkq - 3 7',
  dev_Bd2_after_Qd8:  'rn1qkb1r/pp2pppp/2p2n2/3N1b2/2BP4/8/PPPB1PPP/R2QK1NR w KQkq - 4 8',
  dev_Bd2_after_Nxf6: 'rn1qkb1r/pp2pppp/2p2N2/5b2/2BP4/8/PPPB1PPP/R2QK1NR b KQkq - 0 8',
  dev_Bd2_after_gxf6: 'rn1qkb1r/pp2pp1p/2p2p2/5b2/2BP4/8/PPPB1PPP/R2QK1NR w KQkq - 0 9',

  // Deviation: 7.Ne5 (instead of 7.Bd2)
  dev_Ne5_after_Ne5:  'rn2kb1r/pp2pppp/2p2n2/q3Nb2/2BP4/2N5/PPP2PPP/R1BQK2R b KQkq - 3 7',
  dev_Ne5_after_e6:   'rn2kb1r/pp3ppp/2p1pn2/q3Nb2/2BP4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 8',
  dev_Ne5_after_g4:   'rn2kb1r/pp3ppp/2p1pn2/q3Nb2/2BP2P1/2N5/PPP2P1P/R1BQK2R b KQkq - 0 8',
  dev_Ne5_after_Bg6:  'rn2kb1r/pp3ppp/2p1pnb1/q3N3/2BP2P1/2N5/PPP2P1P/R1BQK2R w KQkq - 1 9',
  dev_Ne5_after_h4:   'rn2kb1r/pp3ppp/2p1pnb1/q3N3/2BP2PP/2N5/PPP2P2/R1BQK2R b KQkq - 0 9',
  dev_Ne5_after_Nbd7: 'r3kb1r/pp1n1ppp/2p1pnb1/q3N3/2BP2PP/2N5/PPP2P2/R1BQK2R w KQkq - 1 10',
}


// ═══════════════════════════════════════════════════════════
// s-1: QUEEN STRIKES (1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const S_1: OpeningLesson = {
  id: 's-1',
  title: 'Queen Strikes',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Scandinavian Defense — you immediately challenge White's e4 pawn with your queen's pawn. Bold and direct.",
    },

    // ── PREDICT/REVEAL 1: d5 ──
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
      correctMove: 'd5',
      prompt: "White just played e4. How do you fight back immediately?",
      hint: 'Strike the center right away with a pawn.',
      correctFeedback: 'd5 directly challenges the e4 pawn — no waiting around.',
      wrongFeedback: "Play d5 — attack White's e4 pawn head-on.",
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 attacks e4 immediately. This is the Scandinavian Defense — the most direct reply to 1.e4.",
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 2: Qxd5 ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures with exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: "White took your pawn. How do you get it back?",
      hint: 'Your queen can recapture on d5.',
      correctFeedback: 'Qxd5 wins the pawn back and puts your queen in the center.',
      wrongFeedback: 'Take back with Qxd5 — recapture the pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxd5,
      text: "Your queen sits on d5, controlling the center. White will try to kick it, but you have a plan.",
      arrow: ['d8', 'd5'],
    },

    // ── PREDICT/REVEAL 3: Qa5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3, attacking your queen.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Qa5',
      prompt: "Your queen is under attack. Where does she go?",
      hint: 'Move the queen to a safe square on the a-file where she stays active.',
      correctFeedback: 'Qa5 keeps the queen active and pins the c3 knight along the a5-e1 diagonal.',
      wrongFeedback: 'Play Qa5 — a safe square where the queen stays active.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "From a5, your queen is safe and creates a sneaky pin along the a5-e1 diagonal toward White's king.",
      arrow: ['d5', 'a5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Now play all three moves from memory.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "You know the Scandinavian setup — d5, Qxd5, Qa5. Time to learn how to develop from here.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-2: DEVELOP & FORTIFY (4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5)
// ═══════════════════════════════════════════════════════════

const S_2: OpeningLesson = {
  id: 's-2',
  title: 'Develop & Fortify',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "Your queen is safe on a5. Now it's time to develop your pieces and lock down the center.",
    },

    // ── RECAP (lesson 1 moves) ──
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },

    // ── PREDICT/REVEAL 1: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White pushes d4, claiming more space in the center.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "White has a big center. What piece do you develop?",
      hint: 'Bring a knight toward the center.',
      correctFeedback: 'Nf6 develops the knight and eyes the d5 and e4 squares.',
      wrongFeedback: 'Play Nf6 — develop the knight to its best square.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "The knight on f6 controls key central squares and prepares to support your development.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: c6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White develops with Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: "Your knight is out. How do you secure the center?",
      hint: 'A pawn move to support d5 and give your queen a retreat square.',
      correctFeedback: 'c6 locks down the d5 square and gives your queen access to c7.',
      wrongFeedback: 'Play c6 — a solid pawn move that supports d5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 is a key move. It supports a future d5 push and keeps the c7 square open for your queen.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 3: Bf5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White puts the bishop on c4, aiming at f7.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: "White's bishop targets f7. How do you develop your light-squared bishop?",
      hint: 'Get the bishop outside the pawn chain before playing e6.',
      correctFeedback: 'Bf5 develops the bishop to an active diagonal before closing it in with e6.',
      wrongFeedback: 'Play Bf5 — get the bishop active before locking it behind e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Bf5 is a great move. In the Scandinavian, you always try to develop this bishop before playing e6.",
      arrow: ['c8', 'f5'],
    },

    // ── RECALL ──
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Solid development. Your pieces are active and the center is secure. Next, we handle White's middlegame plans.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-dev-Bc4: DEVIATION 4.Bc4 (instead of 4.d4)
// Branches from lesson 1 (after 3...Qa5)
// Response: 4...Nf6 5.d3 c6 6.Bd2 Qc7
// ═══════════════════════════════════════════════════════════

const S_DEV_BC4: OpeningLesson = {
  id: 's-dev-Bc4',
  title: 'Dev 4.Bc4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "Sometimes White plays Bc4 instead of d4, developing the bishop right away. Here's how to respond.",
    },

    // ── RECAP to deviation point ──
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Bc4,
      text: "White plays Bc4 instead of d4, putting the bishop on an active diagonal.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },

    // ── PREDICT/REVEAL 1: Nf6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_Bc4,
      correctMove: 'Nf6',
      prompt: "White developed the bishop early. What's your best developing move?",
      hint: 'Bring the knight out to a natural square.',
      correctFeedback: 'Nf6 develops with tempo — the knight eyes d5 and e4.',
      wrongFeedback: 'Play Nf6 — develop the knight first.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Nf6,
      text: "Nf6 is the same developing move regardless of whether White plays d4 or Bc4. Good habits.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: c6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_d3,
      text: "White plays d3, a quieter setup.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_d3,
      correctMove: 'c6',
      prompt: "White is going for a slow build. How do you secure the center?",
      hint: 'Support d5 with a pawn.',
      correctFeedback: 'c6 secures the d5 square and prepares to develop naturally.',
      wrongFeedback: 'Play c6 — lock down the center.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_c6,
      text: "c6 gives you a rock-solid center. White's bishop on c4 is less effective now.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 3: Qc7 ──
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Bd2,
      text: "White plays Bd2, connecting the rooks.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_Bd2,
      correctMove: 'Qc7',
      prompt: "Where does your queen want to go now?",
      hint: 'Tuck the queen to a safer square that stays connected to the center.',
      correctFeedback: 'Qc7 moves the queen off the a-file and eyes the kingside.',
      wrongFeedback: 'Play Qc7 — reposition the queen to a better diagonal.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Qc7,
      text: "Qc7 is a smart regrouping. The queen is out of danger and supports future e5 or d5 ideas.",
      arrow: ['a5', 'c7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_Bc4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_d3,
      text: "White plays d3.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_d3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_Bd2,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Qc7,
      text: "Against 4.Bc4, you develop naturally and regroup the queen. Same principles, different move order.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-dev-Bd2: DEVIATION 5.Bd2 (instead of 5.Nf3)
// Branches from lesson 2 (after 4...Nf6)
// Response: 5...c6 6.Bc4 Bf5 7.Nd5 Qd8
// ═══════════════════════════════════════════════════════════

const S_DEV_BD2: OpeningLesson = {
  id: 's-dev-Bd2',
  title: 'Dev 5.Bd2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Sometimes White plays Bd2 instead of Nf3, preparing to break the pin. Here's how to handle it.",
    },

    // ── RECAP to deviation point ──
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bd2,
      text: "White plays Bd2 instead of Nf3, breaking the pin on the c3 knight.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },

    // ── PREDICT/REVEAL 1: c6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bd2,
      correctMove: 'c6',
      prompt: "White broke the pin. What's your plan?",
      hint: 'Secure the center with a pawn.',
      correctFeedback: 'c6 holds down d5 and prepares natural development.',
      wrongFeedback: 'Play c6 — shore up the center before developing.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_c6,
      text: "c6 is your anchor. It controls d5 and lets your pieces develop comfortably.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 2: Bf5 ──
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bc4,
      text: "White plays Bc4, aiming at f7.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bc4,
      correctMove: 'Bf5',
      prompt: "White's bishop targets your kingside. How do you develop?",
      hint: 'Get your light-squared bishop active.',
      correctFeedback: 'Bf5 gets the bishop out before you play e6.',
      wrongFeedback: 'Play Bf5 — activate the bishop while you can.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bf5,
      text: "Bf5 develops actively. You want this bishop outside the pawn chain before closing things with e6.",
      arrow: ['c8', 'f5'],
    },

    // ── PREDICT/REVEAL 3: Qd8 ──
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Nd5,
      text: "White jumps Nd5, attacking your queen on a5.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Nd5,
      correctMove: 'Qd8',
      prompt: "The knight attacks your queen. Where does she retreat?",
      hint: 'Back to her starting square — it is the safest retreat.',
      correctFeedback: 'Qd8 retreats to safety. The knight on d5 will trade itself off soon.',
      wrongFeedback: 'Play Qd8 — retreat to the safe home square.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Qd8,
      text: "Qd8 looks passive, but the knight on d5 has to commit. After Nxf6+ gxf6, you open the g-file for counterplay.",
      arrow: ['a5', 'd8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bd2,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Nd5,
      text: "White plays Nd5.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Nd5,
      correctMove: 'Qd8',
      prompt: 'Your move.',
      hint: 'Qd8.',
      correctFeedback: 'Qd8.',
      wrongFeedback: 'Qd8.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Qd8,
      text: "Against 5.Bd2, you play the same setup: c6, Bf5, and retreat when needed. White's knight will trade off.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-3: THE KNIGHT SACRIFICE (7.Bd2 e6 8.Nd5 Qd8 9.Nxf6+ gxf6)
// ═══════════════════════════════════════════════════════════

const S_3: OpeningLesson = {
  id: 's-3',
  title: 'The Knight Sacrifice',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "White's about to push a knight into your position. You'll handle it by absorbing the pressure and opening the g-file.",
    },

    // ── RECAP (lessons 1-2) ──
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── PREDICT/REVEAL 1: e6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2, connecting the rooks.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'e6',
      prompt: "White has finished developing. How do you solidify your position?",
      hint: 'Protect d5 and prepare to develop the dark-squared bishop.',
      correctFeedback: 'e6 is solid. It guards d5 and opens the diagonal for your bishop on f8.',
      wrongFeedback: 'Play e6 — protect d5 and prepare to develop.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 completes the pawn wall. Your bishop on f5 is already outside the chain — perfect timing.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: Qd8 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "White jumps Nd5, attacking your queen and threatening Nc7+.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qd8',
      prompt: "The knight jumps in! Where does your queen go?",
      hint: 'Retreat to the back rank.',
      correctFeedback: 'Qd8 avoids all tricks. The knight on d5 has to do something — and it will trade.',
      wrongFeedback: 'Play Qd8 — the safest square for your queen right now.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qd8,
      text: "Qd8 is calm and collected. The knight on d5 will capture on f6, but that actually helps you.",
      arrow: ['a5', 'd8'],
    },

    // ── PREDICT/REVEAL 3: gxf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxf6,
      text: "White takes Nxf6+, capturing your knight with check.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxf6,
      correctMove: 'gxf6',
      prompt: "Your knight was captured with check. How do you recapture?",
      hint: 'Take back with the g-pawn to open the g-file.',
      correctFeedback: 'gxf6 opens the g-file. Your rook on h8 will love the semi-open line.',
      wrongFeedback: 'Play gxf6 — open the g-file for your rook.',
    },
    {
      type: 'instruction',
      fen: FEN.after_gxf6,
      text: "Your pawn structure looks unusual, but the open g-file gives you real attacking chances.",
      arrow: ['g7', 'f6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "White plays Nd5.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qd8',
      prompt: 'Your move.',
      hint: 'Qd8.',
      correctFeedback: 'Qd8.',
      wrongFeedback: 'Qd8.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf6,
      text: "White plays Nxf6+.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxf6,
      correctMove: 'gxf6',
      prompt: 'Your move.',
      hint: 'gxf6.',
      correctFeedback: 'gxf6.',
      wrongFeedback: 'gxf6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_gxf6,
      text: "You absorbed the knight trade and opened the g-file. The Scandinavian gets interesting from here.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-dev-Ne5: DEVIATION 7.Ne5 (instead of 7.Bd2)
// Branches from lesson 3 (after 6...Bf5)
// Response: 7...e6 8.g4 Bg6 9.h4 Nbd7
// ═══════════════════════════════════════════════════════════

const S_DEV_NE5: OpeningLesson = {
  id: 's-dev-Ne5',
  title: 'Dev 7.Ne5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Sometimes White pushes the knight to e5 instead of playing Bd2. It looks aggressive, but you have a solid response.",
    },

    // ── RECAP to deviation point ──
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_Ne5,
      text: "White plays Ne5 instead of Bd2, planting the knight aggressively in your territory.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },

    // ── PREDICT/REVEAL 1: e6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_Ne5,
      correctMove: 'e6',
      prompt: "White's knight is on e5. How do you keep developing?",
      hint: 'Solidify the center and prepare to develop the dark-squared bishop.',
      correctFeedback: 'e6 builds a solid center and opens the bishop diagonal.',
      wrongFeedback: 'Play e6 — solid and principled.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_e6,
      text: "e6 keeps your structure sound. The knight on e5 is strong but doesn't threaten anything concrete yet.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: Bg6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_g4,
      text: "White pushes g4, attacking your bishop on f5.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_g4,
      correctMove: 'Bg6',
      prompt: "Your bishop is under attack. Where does it go?",
      hint: 'Retreat to a safe square where the bishop is still useful.',
      correctFeedback: 'Bg6 keeps the bishop active and safe behind the pawn shield.',
      wrongFeedback: 'Play Bg6 — retreat the bishop to safety.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_Bg6,
      text: "Bg6 is the only good square. The bishop stays on a useful diagonal and is hard to attack further.",
      arrow: ['f5', 'g6'],
    },

    // ── PREDICT/REVEAL 3: Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_h4,
      text: "White pushes h4, continuing the kingside advance.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_h4,
      correctMove: 'Nbd7',
      prompt: "White is expanding on the kingside. How do you develop?",
      hint: 'Bring the queenside knight out — it also attacks the e5 knight.',
      correctFeedback: 'Nbd7 develops the knight and challenges White\'s outpost on e5.',
      wrongFeedback: 'Play Nbd7 — develop and pressure the e5 knight.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_Nbd7,
      text: "Nbd7 attacks the e5 knight directly. White will likely trade, simplifying the position in your favor.",
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_Ne5,
      text: "White plays Ne5.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_Ne5,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_g4,
      text: "White plays g4.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_g4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_h4,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_Nbd7,
      text: "Against Ne5, you stay solid with e6, dodge the bishop attack with Bg6, and challenge the knight with Nbd7.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-4: REGROUP & ATTACK (10.Bb3 Nd7 11.Qe2 Qc7 12.Nh4 Bg6)
// ═══════════════════════════════════════════════════════════

const S_4: OpeningLesson = {
  id: 's-4',
  title: 'Regroup & Attack',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_gxf6,
      text: "The knight trade is done. Now you regroup your pieces for the middlegame.",
    },

    // ── RECAP (lessons 1-3) ──
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "White plays Nd5.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qd8',
      prompt: 'Your move.',
      hint: 'Qd8.',
      correctFeedback: 'Qd8.',
      wrongFeedback: 'Qd8.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf6,
      text: "White plays Nxf6+.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxf6,
      correctMove: 'gxf6',
      prompt: 'Your move.',
      hint: 'gxf6.',
      correctFeedback: 'gxf6.',
      wrongFeedback: 'gxf6.',
    },

    // ── PREDICT/REVEAL 1: Nd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "White retreats the bishop to b3, keeping it on the diagonal.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bb3,
      correctMove: 'Nd7',
      prompt: "You need more pieces in the game. What develops?",
      hint: 'Your b8 knight needs to join the fight.',
      correctFeedback: 'Nd7 develops the last minor piece and supports e5 or c5 ideas.',
      wrongFeedback: 'Play Nd7 — bring the knight into the game.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 is flexible. The knight can go to b6, c5, or e5 depending on how White plays.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: Qc7 ──
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "White plays Qe2, connecting the rooks and eyeing the e-file.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qe2,
      correctMove: 'Qc7',
      prompt: "Your queen has been on d8 for a while. Where should she go?",
      hint: 'Activate the queen on a square that connects to both sides of the board.',
      correctFeedback: 'Qc7 activates the queen and prepares O-O-O or keeps flexible.',
      wrongFeedback: 'Play Qc7 — activate the queen on the c-file.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Qc7 is the ideal square. Your queen supports the c6 pawn and eyes the kingside along the c7-h2 diagonal.",
      arrow: ['d8', 'c7'],
    },

    // ── PREDICT/REVEAL 3: Bg6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nh4,
      text: "White plays Nh4, attacking your bishop on f5.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nh4,
      correctMove: 'Bg6',
      prompt: "Your bishop is attacked. Where does it retreat?",
      hint: 'Move the bishop one square back.',
      correctFeedback: 'Bg6 keeps the bishop safe and still on a useful diagonal.',
      wrongFeedback: 'Play Bg6 — retreat the bishop to a safe square.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "Bg6 is solid. The knight on h4 is actually offside now, and your bishop will help defend or support a kingside push.",
      arrow: ['f5', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "White plays Bb3.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bb3,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
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
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nh4,
      text: "White plays Nh4.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nh4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "You know the full Scandinavian main line. Develop, absorb the knight trade, and regroup for a rich middlegame.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// s-test-1: LEVEL 1 TEST
// Tests main line + all 3 deviations. Pure recall, zero guidance.
// ═══════════════════════════════════════════════════════════

const S_TEST_1: OpeningLesson = {
  id: 's-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ═══ MAIN LINE RECALL (12 moves) ═══
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "White plays Nd5.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qd8',
      prompt: 'Your move.',
      hint: 'Qd8.',
      correctFeedback: 'Qd8.',
      wrongFeedback: 'Qd8.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf6,
      text: "White plays Nxf6+.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxf6,
      correctMove: 'gxf6',
      prompt: 'Your move.',
      hint: 'gxf6.',
      correctFeedback: 'gxf6.',
      wrongFeedback: 'gxf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "White plays Bb3.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bb3,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
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
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nh4,
      text: "White plays Nh4.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nh4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // ═══ DEVIATION 1: 4.Bc4 ═══
    // Replay to branch point (after 3...Qa5), then deviation
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },
    // Deviation: 4.Bc4
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_Bc4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_d3,
      text: "White plays d3.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_d3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bc4_after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bc4_after_Bd2,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },

    // ═══ DEVIATION 2: 5.Bd2 ═══
    // Replay to branch point (after 4...Nf6), then deviation
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    // Deviation: 5.Bd2
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bd2,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Nd5,
      text: "White plays Nd5.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Nd5,
      correctMove: 'Qd8',
      prompt: 'Your move.',
      hint: 'Qd8.',
      correctFeedback: 'Qd8.',
      wrongFeedback: 'Qd8.',
    },

    // ═══ DEVIATION 3: 7.Ne5 ═══
    // Replay to branch point (after 6...Bf5), then deviation
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White captures exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'Qxd5',
      prompt: 'Your move.',
      hint: 'Qxd5.',
      correctFeedback: 'Qxd5.',
      wrongFeedback: 'Qxd5.',
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
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
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
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "White plays Bc4.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    // Deviation: 7.Ne5
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_Ne5,
      text: "White plays Ne5.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_Ne5,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_g4,
      text: "White plays g4.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_g4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Ne5_after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Ne5_after_h4,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getScandinavianLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 's-1': return S_1
    case 's-2': return S_2
    case 's-dev-Bc4': return S_DEV_BC4
    case 's-dev-Bd2': return S_DEV_BD2
    case 's-3': return S_3
    case 's-dev-Ne5': return S_DEV_NE5
    case 's-4': return S_4
    case 's-test-1': return S_TEST_1
    default: return undefined
  }
}
