import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// CARO-KANN DEFENSE LESSONS (ck-1 through ck-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6
//            7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6 11.Bf4 Ngf6 12.O-O-O Be7
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4: 'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5: 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3: 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_dxe4: 'rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Nxe4: 'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Bf5: 'rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng3: 'rn1qkbnr/pp2pppp/2p5/5b2/3P4/6N1/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_Bg6: 'rn1qkbnr/pp2pppp/2p3b1/8/3P4/6N1/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  after_h4: 'rn1qkbnr/pp2pppp/2p3b1/8/3P3P/6N1/PPP2PP1/R1BQKBNR b KQkq - 0 6',
  after_h6: 'rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/6N1/PPP2PP1/R1BQKBNR w KQkq - 0 7',
  after_Nf3: 'rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R b KQkq - 1 7',
  after_Nd7: 'r2qkbnr/pp1nppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R w KQkq - 2 8',
  after_h5: 'r2qkbnr/pp1nppp1/2p3bp/7P/3P4/5NN1/PPP2PP1/R1BQKB1R b KQkq - 0 8',
  after_Bh7: 'r2qkbnr/pp1npppb/2p4p/7P/3P4/5NN1/PPP2PP1/R1BQKB1R w KQkq - 1 9',
  after_Bd3: 'r2qkbnr/pp1npppb/2p4p/7P/3P4/3B1NN1/PPP2PP1/R1BQK2R b KQkq - 2 9',
  after_Bxd3: 'r2qkbnr/pp1nppp1/2p4p/7P/3P4/3b1NN1/PPP2PP1/R1BQK2R w KQkq - 0 10',
  after_Qxd3: 'r2qkbnr/pp1nppp1/2p4p/7P/3P4/3Q1NN1/PPP2PP1/R1B1K2R b KQkq - 0 10',
  after_e6: 'r2qkbnr/pp1n1pp1/2p1p2p/7P/3P4/3Q1NN1/PPP2PP1/R1B1K2R w KQkq - 0 11',
  after_Bf4: 'r2qkbnr/pp1n1pp1/2p1p2p/7P/3P1B2/3Q1NN1/PPP2PP1/R3K2R b KQkq - 1 11',
  after_Ngf6: 'r2qkb1r/pp1n1pp1/2p1pn1p/7P/3P1B2/3Q1NN1/PPP2PP1/R3K2R w KQkq - 2 12',
  after_OOO: 'r2qkb1r/pp1n1pp1/2p1pn1p/7P/3P1B2/3Q1NN1/PPP2PP1/2KR3R b kq - 3 12',
  after_Be7: 'r2qk2r/pp1nbpp1/2p1pn1p/7P/3P1B2/3Q1NN1/PPP2PP1/2KR3R w kq - 4 13',

  // Punish 2.Nf3?! line (ck-punish-nf3)
  pnf3_after_Nf3: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  pnf3_after_d5: 'rnbqkbnr/pp2pppp/2p5/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  pnf3_after_exd5: 'rnbqkbnr/pp2pppp/2p5/3P4/8/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  pnf3_after_cxd5: 'rnbqkbnr/pp2pppp/8/3p4/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4',

  // Punish 3.e5? line (ck-punish-e5)
  pe5_after_e5: 'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  pe5_after_Bf5: 'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4',
  pe5_after_Nf3_pe5: 'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4',
  pe5_after_e6: 'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5',

  // Advance variation (ck-advance-1): from 3.e5 line: 5.Be2 c5 6.O-O Nc6
  adv_after_Be2: 'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq - 1 5',
  adv_after_c5: 'rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQK2R w KQkq - 0 6',
  adv_after_OO: 'rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 b kq - 1 6',
  adv_after_Nc6: 'r2qkbnr/pp3ppp/2n1p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 w kq - 2 7',

  // Exchange variation (ck-exchange-1): 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6
  ex_after_exd5: 'rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  ex_after_cxd5: 'rnbqkbnr/pp2pppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4',
  ex_after_Bd3: 'rnbqkbnr/pp2pppp/8/3p4/3P4/3B4/PPP2PPP/RNBQK1NR b KQkq - 1 4',
  ex_after_Nc6: 'r1bqkbnr/pp2pppp/2n5/3p4/3P4/3B4/PPP2PPP/RNBQK1NR w KQkq - 2 5',
  ex_after_c3: 'r1bqkbnr/pp2pppp/2n5/3p4/3P4/2PB4/PP3PPP/RNBQK1NR b KQkq - 0 5',
  ex_after_Nf6: 'r1bqkb1r/pp2pppp/2n2n2/3p4/3P4/2PB4/PP3PPP/RNBQK1NR w KQkq - 1 6',

  // Two Knights variation (ck-twoknight-1): 4.Nxe4 Nf6 5.Nxf6+ exf6 6.Bc4 Bd6
  tk_after_Nf6: 'rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  tk_after_Nxf6: 'rnbqkb1r/pp2pppp/2p2N2/8/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 0 5',
  tk_after_exf6: 'rnbqkb1r/pp3ppp/2p2p2/8/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  tk_after_Bc4: 'rnbqkb1r/pp3ppp/2p2p2/8/2BP4/8/PPP2PPP/R1BQK1NR b KQkq - 1 6',
  tk_after_Bd6: 'rnbqk2r/pp3ppp/2pb1p2/8/2BP4/8/PPP2PPP/R1BQK1NR w KQkq - 2 7',

  // ─── LESSON PUNISH POSITIONS ───

  // ck-1 punish: 3.Bd3?! dxe4 4.Bxe4 Nf6
  ck1p_after_Bd3: 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/3B4/PPP2PPP/RNBQK1NR b KQkq - 1 3',
  ck1p_after_dxe4: 'rnbqkbnr/pp2pppp/2p5/8/3Pp3/3B4/PPP2PPP/RNBQK1NR w KQkq - 0 4',
  ck1p_after_Bxe4: 'rnbqkbnr/pp2pppp/2p5/8/3PB3/8/PPP2PPP/RNBQK1NR b KQkq - 0 4',
  ck1p_after_Nf6: 'rnbqkb1r/pp2pppp/2p2n2/8/3PB3/8/PPP2PPP/RNBQK1NR w KQkq - 1 5',

  // ck-2 punish: 5.Nc5?! b6
  ck2p_after_Nc5: 'rn1qkbnr/pp2pppp/2p5/2N2b2/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  ck2p_after_b6: 'rn1qkbnr/p3pppp/1pp5/2N2b2/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',

  // ck-3 punish: 8.Bd3?! (too early, no h5 prep)
  ck3p_after_Bd3: 'r2qkbnr/pp1nppp1/2p3bp/8/3P3P/3B1NN1/PPP2PP1/R1BQK2R b KQkq - 3 8',
  ck3p_after_Bxd3: 'r2qkbnr/pp1nppp1/2p4p/8/3P3P/3b1NN1/PPP2PP1/R1BQK2R w KQkq - 0 9',
  ck3p_after_Qxd3: 'r2qkbnr/pp1nppp1/2p4p/8/3P3P/3Q1NN1/PPP2PP1/R1B1K2R b KQkq - 0 9',
  ck3p_after_e6: 'r2qkbnr/pp1n1pp1/2p1p2p/8/3P3P/3Q1NN1/PPP2PP1/R1B1K2R w KQkq - 0 10',

  // ck-4 punish: 11.Ne5?! Nxe5 12.dxe5 Qxd3
  ck4p_after_Ne5: 'r2qkbnr/pp1n1pp1/2p1p2p/4N2P/3P4/3Q2N1/PPP2PP1/R1B1K2R b KQkq - 1 11',
  ck4p_after_Nxe5: 'r2qkbnr/pp3pp1/2p1p2p/4n2P/3P4/3Q2N1/PPP2PP1/R1B1K2R w KQkq - 0 12',
  ck4p_after_dxe5: 'r2qkbnr/pp3pp1/2p1p2p/4P2P/8/3Q2N1/PPP2PP1/R1B1K2R b KQkq - 0 12',
  ck4p_after_Qxd3: 'r3kbnr/pp3pp1/2p1p2p/4P2P/8/3q2N1/PPP2PP1/R1B1K2R w KQkq - 0 13',

  // punish-nf3 lesson punish: 3.e5?! Bf5
  pnf3p_after_e5: 'rnbqkbnr/pp2pppp/2p5/3pP3/8/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  pnf3p_after_Bf5: 'rn1qkbnr/pp2pppp/2p5/3pPb2/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 4',

  // punish-e5 lesson punish: (no extra punish for this short lesson)

  // advance lesson punish: 6.c3?! Nc6
  advp_after_c3: 'rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 0 6',
  advp_after_Nc6: 'r2qkbnr/pp3ppp/2n1p3/2ppPb2/3P4/2P2N2/PP2BPPP/RNBQK2R w KQkq - 1 7',

  // exchange lesson punish: 5...Bf5 (developing actively)
  exp_after_Bf5: 'r2qkbnr/pp2pppp/2n5/3p1b2/3P4/2PB4/PP3PPP/RNBQK1NR w KQkq - 1 6',

  // two knights lesson punish: 6.Be2?! Bd6
  tkp_after_Be2: 'rnbqkb1r/pp3ppp/2p2p2/8/3P4/8/PPP1BPPP/R1BQK1NR b KQkq - 1 6',
  tkp_after_Bd6: 'rnbqk2r/pp3ppp/2pb1p2/8/3P4/8/PPP1BPPP/R1BQK1NR w KQkq - 2 7',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Caro-Kann
// Teaches: 1.e4 c6 2.d4 d5 3.Nc3 dxe4
// BLACK opening — user plays Black moves, White auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const CK_LESSON_1: OpeningLesson = {
  id: 'ck-1',
  title: 'The Caro-Kann',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: No recap (first lesson of the opening)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1.e4 c6 2.d4 d5 3.Nc3 dxe4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Caro-Kann Defense — one of the most solid responses to 1.e4. You'll build a rock-solid position and develop your bishop BEFORE locking it in.",
    },

    // --- White plays 1.e4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },

    // --- Black plays 1...c6 ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Instead of challenging e4 directly, play c6. It looks quiet, but it PREPARES d5 on the next move — with pawn support.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: "Prepare d5 with a supporting pawn.",
      hint: "Push your c-pawn one square. c6 prepares d5.",
      correctFeedback: "c6! The Caro-Kann. You're setting up d5 with backup.",
      wrongFeedback: "In the Caro-Kann, Black plays c6 — preparing d5.",
      highlightSquares: ['c7', 'c6'],
    },

    // --- White plays 2.d4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4 — White takes the full center. Now it's time to strike.",
      autoAdvance: 800,
    },

    // --- Black plays 2...d5 ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Now play d5! This is why you played c6 first — the d5 pawn is supported by c6. You're challenging the center immediately.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge the center — your c-pawn has your back.",
      hint: "Push d5. The c6 pawn supports it.",
      correctFeedback: "d5! Now you're fighting for the center with a SUPPORTED pawn. That's the Caro-Kann difference.",
      wrongFeedback: "Play d5 — challenge White's e4 pawn directly.",
      highlightSquares: ['d7', 'd5'],
      postMoveArrow: ['c6', 'd5'],
    },

    // --- White plays 3.Nc3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3 — White defends e4 with the knight.",
      autoAdvance: 800,
    },

    // --- Black plays 3...dxe4 ---
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Take on e4! After Nxe4, you'll develop your bishop to f5 — the whole point of playing c6 instead of e6.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: "Capture — open the door for your bishop.",
      hint: "Take the e4 pawn with dxe4.",
      correctFeedback: "dxe4! After White recaptures, your light-squared bishop gets to escape to f5. Mission accomplished.",
      wrongFeedback: "Capture on e4 with dxe4 — this is the key Caro-Kann exchange.",
      highlightSquares: ['d5', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 3.Bd3?!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "What if White develops badly? After 1.e4 c6 2.d4 d5, imagine White plays 3.Bd3 — blocking their own d-pawn.",
    },

    // 3.Bd3?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck1p_after_Bd3,
      text: "3.Bd3? The bishop blocks the d-pawn and doesn't help defend e4. Time to punish.",
      autoAdvance: 800,
    },

    // 3...dxe4 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck1p_after_Bd3,
      correctMove: 'dxe4',
      prompt: "Win a pawn — the bishop is in the way!",
      hint: "Take on e4. White's bishop blocks the recapture with a pawn.",
      correctFeedback: "dxe4! White has to recapture with the bishop, wasting time. You're already better.",
      wrongFeedback: "Take on e4 — the bishop on d3 makes White's position awkward.",
      highlightSquares: ['d5', 'e4'],
    },

    // 4.Bxe4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck1p_after_Bxe4,
      text: "4.Bxe4 — the bishop had to recapture. Now attack it.",
      autoAdvance: 800,
    },

    // 4...Nf6 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck1p_after_Bxe4,
      correctMove: 'Nf6',
      prompt: "Develop with tempo — attack the bishop!",
      hint: "Knight to f6 attacks the bishop on e4.",
      correctFeedback: "Nf6! The bishop has to move AGAIN. You're developing with free tempo.",
      wrongFeedback: "Play Nf6 — develop and attack the bishop at the same time.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay c6, d5, dxe4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three Black moves of the Caro-Kann.",
      buttonText: "LET'S GO",
    },

    // 1.e4
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    // Recall: c6
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: "Your move.",
      hint: "c6.",
      correctFeedback: "c6.",
      wrongFeedback: "c6.",
    },
    // 2.d4
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    // Recall: d5
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Your move.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
    },
    // 3.Nc3
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    // Recall: dxe4
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: "Your move.",
      hint: "dxe4.",
      correctFeedback: "dxe4.",
      wrongFeedback: "dxe4.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: Bishop Out First
// Teaches: 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6
// Recap: c6, d5, dxe4
// ═══════════════════════════════════════════════════════════

export const CK_LESSON_2: OpeningLesson = {
  id: 'ck-2',
  title: 'Bishop Out First',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c6, d5, dxe4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the Caro-Kann opening moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c6',
      prompt: "The Caro-Kann move.", hint: "c6.",
      correctFeedback: "c6.", wrongFeedback: "c6.",
      highlightSquares: ['c7', 'c6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'd5',
      prompt: "Challenge the center.", hint: "d5.",
      correctFeedback: "d5.", wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'dxe4',
      prompt: "Capture.", hint: "dxe4.",
      correctFeedback: "dxe4.", wrongFeedback: "dxe4.",
      highlightSquares: ['d5', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6)
    // ═══════════════════════════════════════════

    // 4.Nxe4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "4.Nxe4 — White recaptures with the knight. Now for the magic.",
      autoAdvance: 800,
    },

    // 4...Bf5 — THE WHOLE POINT
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "THIS is why you played c6 instead of e6. Your light-squared bishop goes to f5 BEFORE you lock it in with e6. In the French Defense, this bishop gets stuck — not here.",
      highlightSquares: ['c8', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: "The whole point of the Caro-Kann — bishop out!",
      hint: "Bishop to f5 — develop it before playing e6.",
      correctFeedback: "Bf5! The bishop is FREE. This is the Caro-Kann's signature advantage.",
      wrongFeedback: "Bishop to f5 — get it out before e6 locks it in.",
      highlightSquares: ['c8', 'f5'],
    },

    // 5.Ng3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "5.Ng3 — White attacks your bishop. Don't panic.",
      autoAdvance: 800,
    },

    // 5...Bg6
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "Retreat to g6. The bishop stays active on the diagonal, and White will struggle to dislodge it further.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: "Retreat — but stay active.",
      hint: "Move the bishop to g6 — it's still strong there.",
      correctFeedback: "Bg6! Safe and still controlling key squares. The knight wasted time chasing you.",
      wrongFeedback: "Bishop to g6 — retreat but keep the pressure.",
      highlightSquares: ['f5', 'g6'],
    },

    // 6.h4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "6.h4 — White pushes the h-pawn, threatening h5 to trap your bishop. You need to stop it.",
      autoAdvance: 800,
    },

    // 6...h6
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "Play h6! This prevents h5 and gives your bishop a safe escape route to h7 if needed. Simple and solid.",
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: "Stop h5 — give the bishop room.",
      hint: "Push h6 to prevent White from playing h5.",
      correctFeedback: "h6! The bishop is safe. White's h4 push achieved nothing. That's the Caro-Kann — solid as a rock.",
      wrongFeedback: "Play h6 — prevent h5 and keep your bishop safe.",
      highlightSquares: ['h7', 'h6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 4.Nxe4 Bf5, White plays 5.Nc5?!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "What if White gets greedy? After 4.Nxe4 Bf5, imagine White plays 5.Nc5 — attacking your b7 pawn.",
    },

    // 5.Nc5?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck2p_after_Nc5,
      text: "5.Nc5?! Greedy. The knight looks aggressive but it's undefended and easy to kick.",
      autoAdvance: 800,
    },

    // 5...b6 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck2p_after_Nc5,
      correctMove: 'b6',
      prompt: "Kick the knight — it has nowhere good to go!",
      hint: "Push b6 to attack the knight on c5.",
      correctFeedback: "b6! The knight has to retreat. You gained time and the knight trip accomplished nothing.",
      wrongFeedback: "Play b6 — attack the greedy knight.",
      highlightSquares: ['b7', 'b6'],
      postMoveArrow: ['b6', 'c5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (Bf5, Bg6, h6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Your turn. Play the three bishop moves.",
      buttonText: "LET'S GO",
    },

    // 4.Nxe4 already on board
    // Recall: Bf5
    {
      type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'Bf5',
      prompt: "Your move.", hint: "Bf5.",
      correctFeedback: "Bf5.", wrongFeedback: "Bf5.",
    },
    // 5.Ng3
    { type: 'instruction', fen: FEN.after_Ng3, text: "5.Ng3.", autoAdvance: 800 },
    // Recall: Bg6
    {
      type: 'play-move', fen: FEN.after_Ng3, correctMove: 'Bg6',
      prompt: "Your move.", hint: "Bg6.",
      correctFeedback: "Bg6.", wrongFeedback: "Bg6.",
    },
    // 6.h4
    { type: 'instruction', fen: FEN.after_h4, text: "6.h4.", autoAdvance: 800 },
    // Recall: h6
    {
      type: 'play-move', fen: FEN.after_h4, correctMove: 'h6',
      prompt: "Your move.", hint: "h6.",
      correctFeedback: "h6.", wrongFeedback: "h6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Punish 2.Nf3?
// Teaches: 2.Nf3?! d5 3.exd5 cxd5
// ═══════════════════════════════════════════════════════════

export const CK_PUNISH_NF3: OpeningLesson = {
  id: 'ck-punish-nf3',
  title: 'Punish 2.Nf3?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "After 1.e4, you played c6. But what if White doesn't play 2.d4?",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c6',
      prompt: "The Caro-Kann.", hint: "c6.",
      correctFeedback: "c6.", wrongFeedback: "c6.",
      highlightSquares: ['c7', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (2.Nf3?! d5 3.exd5 cxd5)
    // ═══════════════════════════════════════════

    // 2.Nf3?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pnf3_after_Nf3,
      text: "2.Nf3?! White plays a knight instead of d4. This is harmless — you still get your ideal center.",
      autoAdvance: 800,
    },

    // 2...d5
    {
      type: 'instruction',
      fen: FEN.pnf3_after_Nf3,
      text: "Play d5 anyway! Without d4, White can't build a classical center. You're already equal.",
    },
    {
      type: 'play-move',
      fen: FEN.pnf3_after_Nf3,
      correctMove: 'd5',
      prompt: "Grab the center — White didn't play d4!",
      hint: "Push d5. White skipped d4, so the center is yours.",
      correctFeedback: "d5! You claimed the center. White's Nf3 doesn't challenge d5 at all.",
      wrongFeedback: "Play d5 — take the center while White plays passively.",
      highlightSquares: ['d7', 'd5'],
    },

    // 3.exd5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pnf3_after_exd5,
      text: "3.exd5 — White exchanges. Now recapture with the c-pawn!",
      autoAdvance: 800,
    },

    // 3...cxd5
    {
      type: 'instruction',
      fen: FEN.pnf3_after_exd5,
      text: "Take back with the c-pawn. You get an ideal pawn center — d5 controls the board.",
    },
    {
      type: 'play-move',
      fen: FEN.pnf3_after_exd5,
      correctMove: 'cxd5',
      prompt: "Recapture — build the perfect center.",
      hint: "Take with the c-pawn: cxd5.",
      correctFeedback: "cxd5! A beautiful pawn on d5 in the center. That's the reward for knowing the Caro-Kann.",
      wrongFeedback: "Take with the c-pawn — cxd5 gives you the ideal center.",
      highlightSquares: ['c6', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 2.Nf3, White pushes 3.e5?!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pnf3_after_d5,
      text: "What if White pushes 3.e5 instead of taking? That's bad too — your bishop escapes!",
    },

    // 3.e5?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pnf3p_after_e5,
      text: "3.e5?! White advances but creates a target. Your bishop gets the dream square.",
      autoAdvance: 800,
    },

    // 3...Bf5 (user plays)
    {
      type: 'play-move',
      fen: FEN.pnf3p_after_e5,
      correctMove: 'Bf5',
      prompt: "Bishop out — the Caro-Kann way!",
      hint: "The light-squared bishop goes to f5.",
      correctFeedback: "Bf5! Bishop out, position solid. White's e5 pawn is overextended.",
      wrongFeedback: "Play Bf5 — develop the bishop to its best square.",
      highlightSquares: ['c8', 'f5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (d5, cxd5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pnf3_after_Nf3,
      text: "One more time. White played 2.Nf3 — your response?",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.pnf3_after_Nf3, correctMove: 'd5',
      prompt: "Your move.", hint: "d5.",
      correctFeedback: "d5.", wrongFeedback: "d5.",
    },
    { type: 'instruction', fen: FEN.pnf3_after_exd5, text: "3.exd5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pnf3_after_exd5, correctMove: 'cxd5',
      prompt: "Your move.", hint: "cxd5.",
      correctFeedback: "cxd5.", wrongFeedback: "cxd5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Punish 3.e5?
// Teaches: 3.e5? Bf5 4.Nf3 e6
// ═══════════════════════════════════════════════════════════

export const CK_PUNISH_E5: OpeningLesson = {
  id: 'ck-punish-e5',
  title: 'Punish 3.e5?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "After 1.e4 c6 2.d4 d5, White has a choice. What if they push 3.e5?",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c6',
      prompt: "The Caro-Kann.", hint: "c6.",
      correctFeedback: "c6.", wrongFeedback: "c6.",
      highlightSquares: ['c7', 'c6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'd5',
      prompt: "Challenge the center.", hint: "d5.",
      correctFeedback: "d5.", wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3.e5? Bf5 4.Nf3 e6)
    // ═══════════════════════════════════════════

    // 3.e5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe5_after_e5,
      text: "3.e5? White pushes too early! The pawn grabs space but creates a target — and your bishop escapes.",
      autoAdvance: 800,
    },

    // 3...Bf5
    {
      type: 'instruction',
      fen: FEN.pe5_after_e5,
      text: "This is your dream scenario. The bishop goes to f5 BEFORE e6. In the French Defense, the bishop gets stuck behind e6 — not in the Caro-Kann!",
    },
    {
      type: 'play-move',
      fen: FEN.pe5_after_e5,
      correctMove: 'Bf5',
      prompt: "Bishop to its dream square!",
      hint: "Develop the bishop to f5 — before playing e6.",
      correctFeedback: "Bf5! The bishop is out and active. White's e5 push just helped you develop faster.",
      wrongFeedback: "Bishop to f5 — this is the whole point of the Caro-Kann.",
      highlightSquares: ['c8', 'f5'],
    },

    // 4.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe5_after_Nf3_pe5,
      text: "4.Nf3 — White develops. Now lock in your structure.",
      autoAdvance: 800,
    },

    // 4...e6
    {
      type: 'instruction',
      fen: FEN.pe5_after_Nf3_pe5,
      text: "Play e6. NOW you can play it — your bishop is already out! This pawn supports d5 and creates a solid chain.",
    },
    {
      type: 'play-move',
      fen: FEN.pe5_after_Nf3_pe5,
      correctMove: 'e6',
      prompt: "Lock in the structure — bishop is already free.",
      hint: "Push e6. The bishop is out, so e6 is perfect now.",
      correctFeedback: "e6! Rock-solid structure with an active bishop. White's Advance is harmless.",
      wrongFeedback: "Play e6 — support d5 and complete the structure.",
      highlightSquares: ['e7', 'e6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (Bf5, e6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pe5_after_e5,
      text: "Again. White pushed 3.e5 — your response?",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.pe5_after_e5, correctMove: 'Bf5',
      prompt: "Your move.", hint: "Bf5.",
      correctFeedback: "Bf5.", wrongFeedback: "Bf5.",
    },
    { type: 'instruction', fen: FEN.pe5_after_Nf3_pe5, text: "4.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe5_after_Nf3_pe5, correctMove: 'e6',
      prompt: "Your move.", hint: "e6.",
      correctFeedback: "e6.", wrongFeedback: "e6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: The Retreat
// Teaches: 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3
// Recap: Bf5, Bg6, h6
// ═══════════════════════════════════════════════════════════

export const CK_LESSON_3: OpeningLesson = {
  id: 'ck-3',
  title: 'The Retreat',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (Bf5, Bg6, h6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Quick recap — play the bishop development moves.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'Bf5',
      prompt: "Bishop out!", hint: "Bf5.",
      correctFeedback: "Bf5.", wrongFeedback: "Bf5.",
      highlightSquares: ['c8', 'f5'],
    },
    { type: 'instruction', fen: FEN.after_Ng3, text: "5.Ng3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Ng3, correctMove: 'Bg6',
      prompt: "Retreat.", hint: "Bg6.",
      correctFeedback: "Bg6.", wrongFeedback: "Bg6.",
      highlightSquares: ['f5', 'g6'],
    },
    { type: 'instruction', fen: FEN.after_h4, text: "6.h4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_h4, correctMove: 'h6',
      prompt: "Stop h5.", hint: "h6.",
      correctFeedback: "h6.", wrongFeedback: "h6.",
      highlightSquares: ['h7', 'h6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3)
    // ═══════════════════════════════════════════

    // 7.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "7.Nf3 — White develops the other knight. Time for YOUR knight.",
      autoAdvance: 800,
    },

    // 7...Nd7
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Develop your knight to d7. It supports a future e6 and c5, and keeps the f6 square open for the other knight.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nd7',
      prompt: "Develop the knight — d7 is flexible.",
      hint: "Knight to d7. It supports future pawn breaks.",
      correctFeedback: "Nd7! Flexible development. The knight can go to e5, f6, or support c5 later.",
      wrongFeedback: "Knight to d7 — keep your options open.",
      highlightSquares: ['b8', 'd7'],
    },

    // 8.h5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "8.h5 — White pushes! Your bishop is being challenged. Time for the planned retreat.",
      autoAdvance: 800,
    },

    // 8...Bh7
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "Retreat to h7. The bishop has done its job on g6 — now it tucks in safely. Don't worry, you'll trade it off cleanly next move.",
    },
    {
      type: 'play-move',
      fen: FEN.after_h5,
      correctMove: 'Bh7',
      prompt: "Retreat — the bishop's work is done here.",
      hint: "Bishop to h7 — safe and sound.",
      correctFeedback: "Bh7! The retreat was planned all along. White spent two moves pushing the h-pawn — you lost nothing.",
      wrongFeedback: "Bishop to h7 — this was the plan from the start.",
      highlightSquares: ['g6', 'h7'],
    },

    // 9.Bd3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "9.Bd3 — White develops the bishop, targeting h7. Perfect — trade it off!",
      autoAdvance: 800,
    },

    // 9...Bxd3
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "Take the bishop! Trading bishops eliminates White's attacking piece and simplifies the position — exactly what the Caro-Kann wants.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Bxd3',
      prompt: "Trade — simplify the position.",
      hint: "Capture the bishop on d3 with Bxd3.",
      correctFeedback: "Bxd3! Clean trade. Your bishop did its job — developed early, dodged h5, and traded on your terms.",
      wrongFeedback: "Take the bishop — Bxd3 simplifies in your favor.",
      highlightSquares: ['h7', 'd3'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 7.Nf3 Nd7, White plays 8.Bd3?! (too early)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "What if White plays Bd3 before h5? That's a mistake — you trade for free without the hassle.",
    },

    // 8.Bd3?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck3p_after_Bd3,
      text: "8.Bd3?! White skipped h5. No chase, no drama — just trade immediately.",
      autoAdvance: 800,
    },

    // 8...Bxd3 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck3p_after_Bd3,
      correctMove: 'Bxd3',
      prompt: "Free trade — no h5 headache!",
      hint: "Capture the bishop on d3.",
      correctFeedback: "Bxd3! You traded the bishops without any h5 complications. White made it easy.",
      wrongFeedback: "Take on d3 — free trade.",
      highlightSquares: ['g6', 'd3'],
    },

    // 9.Qxd3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck3p_after_Qxd3,
      text: "9.Qxd3.",
      autoAdvance: 800,
    },

    // 9...e6 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck3p_after_Qxd3,
      correctMove: 'e6',
      prompt: "Lock it in — the bishop is already gone.",
      hint: "Play e6 — it's safe now that the bishop traded.",
      correctFeedback: "e6! Solid structure, no bad bishop. That's the Caro-Kann at its best.",
      wrongFeedback: "Play e6 to complete the structure.",
      highlightSquares: ['e7', 'e6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (Nd7, Bh7, Bxd3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "One more time. Play the retreat sequence.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nd7',
      prompt: "Your move.", hint: "Nd7.",
      correctFeedback: "Nd7.", wrongFeedback: "Nd7.",
    },
    { type: 'instruction', fen: FEN.after_h5, text: "8.h5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_h5, correctMove: 'Bh7',
      prompt: "Your move.", hint: "Bh7.",
      correctFeedback: "Bh7.", wrongFeedback: "Bh7.",
    },
    { type: 'instruction', fen: FEN.after_Bd3, text: "9.Bd3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bxd3',
      prompt: "Your move.", hint: "Bxd3.",
      correctFeedback: "Bxd3.", wrongFeedback: "Bxd3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: The Advance
// Teaches: 5.Be2 c5 6.O-O Nc6 (from 3.e5 Bf5 4.Nf3 e6 position)
// ═══════════════════════════════════════════════════════════

export const CK_ADVANCE_1: OpeningLesson = {
  id: 'ck-advance-1',
  title: 'The Advance',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (Bf5, e6 from the e5 line)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pe5_after_e5,
      text: "Remember the 3.e5 line? You played Bf5 and e6. Now let's go deeper.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.pe5_after_e5, correctMove: 'Bf5',
      prompt: "Bishop out!", hint: "Bf5.",
      correctFeedback: "Bf5.", wrongFeedback: "Bf5.",
      highlightSquares: ['c8', 'f5'],
    },
    { type: 'instruction', fen: FEN.pe5_after_Nf3_pe5, text: "4.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe5_after_Nf3_pe5, correctMove: 'e6',
      prompt: "Lock it in.", hint: "e6.",
      correctFeedback: "e6.", wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (5.Be2 c5 6.O-O Nc6)
    // ═══════════════════════════════════════════

    // 5.Be2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.adv_after_Be2,
      text: "5.Be2 — White develops modestly. Time to counterattack the center.",
      autoAdvance: 800,
    },

    // 5...c5
    {
      type: 'instruction',
      fen: FEN.adv_after_Be2,
      text: "Strike with c5! This is the classic pawn break against the Advance. Attack White's d4 pawn and fight for space.",
    },
    {
      type: 'play-move',
      fen: FEN.adv_after_Be2,
      correctMove: 'c5',
      prompt: "Attack the center — break through!",
      hint: "Push c5 to challenge White's d4 pawn.",
      correctFeedback: "c5! The key counterattack. White's center is under pressure.",
      wrongFeedback: "Play c5 — attack d4 and fight for the center.",
      highlightSquares: ['c6', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // 6.O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.adv_after_OO,
      text: "6.O-O — White castles. Now develop your knight.",
      autoAdvance: 800,
    },

    // 6...Nc6
    {
      type: 'instruction',
      fen: FEN.adv_after_OO,
      text: "Knight to c6 — develop and add pressure on d4. The center is crumbling for White.",
    },
    {
      type: 'play-move',
      fen: FEN.adv_after_OO,
      correctMove: 'Nc6',
      prompt: "Develop — pile on d4.",
      hint: "Knight to c6 adds pressure on d4.",
      correctFeedback: "Nc6! Two pieces attacking d4. The Advance variation is no problem for you.",
      wrongFeedback: "Knight to c6 — develop and pressure d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 5.Be2 c5, White plays 6.c3?!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.adv_after_c5,
      text: "What if White tries 6.c3 to hold d4? That's passive — you keep developing freely.",
    },

    // 6.c3?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.advp_after_c3,
      text: "6.c3?! Passive. White is just trying to hold — you develop with tempo.",
      autoAdvance: 800,
    },

    // 6...Nc6 (user plays)
    {
      type: 'play-move',
      fen: FEN.advp_after_c3,
      correctMove: 'Nc6',
      prompt: "Develop freely — White is stuck defending.",
      hint: "Knight to c6 — attack d4 again.",
      correctFeedback: "Nc6! You're fully developed while White is still defending. The c3 pawn is passive.",
      wrongFeedback: "Play Nc6 — keep the pressure on d4.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (c5, Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.adv_after_Be2,
      text: "One more time. White played 5.Be2.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.adv_after_Be2, correctMove: 'c5',
      prompt: "Your move.", hint: "c5.",
      correctFeedback: "c5.", wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.adv_after_OO, text: "6.O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.adv_after_OO, correctMove: 'Nc6',
      prompt: "Your move.", hint: "Nc6.",
      correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: Complete the Setup
// Teaches: 10.Qxd3 e6 11.Bf4 Ngf6 12.O-O-O Be7
// Recap: Nd7, Bh7, Bxd3
// ═══════════════════════════════════════════════════════════

export const CK_LESSON_4: OpeningLesson = {
  id: 'ck-4',
  title: 'Complete the Setup',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (Nd7, Bh7, Bxd3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Quick recap — play the retreat sequence.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nd7',
      prompt: "Develop.", hint: "Nd7.",
      correctFeedback: "Nd7.", wrongFeedback: "Nd7.",
      highlightSquares: ['b8', 'd7'],
    },
    { type: 'instruction', fen: FEN.after_h5, text: "8.h5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_h5, correctMove: 'Bh7',
      prompt: "Retreat.", hint: "Bh7.",
      correctFeedback: "Bh7.", wrongFeedback: "Bh7.",
      highlightSquares: ['g6', 'h7'],
    },
    { type: 'instruction', fen: FEN.after_Bd3, text: "9.Bd3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bxd3',
      prompt: "Trade.", hint: "Bxd3.",
      correctFeedback: "Bxd3.", wrongFeedback: "Bxd3.",
      highlightSquares: ['h7', 'd3'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (10.Qxd3 e6 11.Bf4 Ngf6 12.O-O-O Be7)
    // ═══════════════════════════════════════════

    // 10.Qxd3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Qxd3,
      text: "10.Qxd3 — White recaptures. Now complete your development.",
      autoAdvance: 800,
    },

    // 10...e6
    {
      type: 'instruction',
      fen: FEN.after_Qxd3,
      text: "Play e6. NOW it's safe — the light-squared bishop is already traded. e6 supports d5 and opens a diagonal for your dark-squared bishop.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxd3,
      correctMove: 'e6',
      prompt: "Safe to play now — the bishop is gone.",
      hint: "Push e6. The light-squared bishop traded, so e6 is perfect.",
      correctFeedback: "e6! No bad bishop problem. The Caro-Kann structure is complete.",
      wrongFeedback: "Play e6 — the bishop is traded, so e6 is safe.",
      highlightSquares: ['e7', 'e6'],
    },

    // 11.Bf4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Bf4,
      text: "11.Bf4 — White develops. Your turn to bring out the knight.",
      autoAdvance: 800,
    },

    // 11...Ngf6
    {
      type: 'instruction',
      fen: FEN.after_Bf4,
      text: "Knight to f6! It develops naturally, eyes d5, and prepares castling.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bf4,
      correctMove: 'Ngf6',
      prompt: "Develop the last knight.",
      hint: "Knight from g8 to f6.",
      correctFeedback: "Ngf6! Both knights developed, center locked in. Almost there.",
      wrongFeedback: "Play Ngf6 — develop the knight naturally.",
      highlightSquares: ['g8', 'f6'],
    },

    // 12.O-O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "12.O-O-O — White castles queenside. Finish your development.",
      autoAdvance: 800,
    },

    // 12...Be7
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "Bishop to e7 — the last piece to develop. After this, you can castle and your position is perfect.",
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Be7',
      prompt: "Last piece — complete the setup.",
      hint: "Bishop to e7, then you can castle.",
      correctFeedback: "Be7! Development complete. Solid center, no weaknesses, ready to castle. THAT is the Caro-Kann at its finest.",
      wrongFeedback: "Play Be7 — complete the development.",
      highlightSquares: ['f8', 'e7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 10.Qxd3 e6, White plays 11.Ne5?!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "What if White tries 11.Ne5? It looks aggressive, but you can punish it.",
    },

    // 11.Ne5?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck4p_after_Ne5,
      text: "11.Ne5?! The knight jumps in, but your d7 knight can take it — winning the pawn on d4.",
      autoAdvance: 800,
    },

    // 11...Nxe5 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck4p_after_Ne5,
      correctMove: 'Nxe5',
      prompt: "Capture the knight — win material!",
      hint: "Take the knight on e5 with your d7 knight.",
      correctFeedback: "Nxe5! After dxe5, the d4 pawn is gone and your queen is active.",
      wrongFeedback: "Capture on e5 with the d7 knight.",
      highlightSquares: ['d7', 'e5'],
    },

    // 12.dxe5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ck4p_after_dxe5,
      text: "12.dxe5.",
      autoAdvance: 800,
    },

    // 12...Qxd3 (user plays)
    {
      type: 'play-move',
      fen: FEN.ck4p_after_dxe5,
      correctMove: 'Qxd3',
      prompt: "Take the queen!",
      hint: "Queen takes d3.",
      correctFeedback: "Qxd3! You've won White's queen. That Ne5 was a blunder.",
      wrongFeedback: "Qxd3 — take the undefended queen.",
      highlightSquares: ['d8', 'd3'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (e6, Ngf6, Be7)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxd3,
      text: "Last time. Complete the setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Qxd3, correctMove: 'e6',
      prompt: "Your move.", hint: "e6.",
      correctFeedback: "e6.", wrongFeedback: "e6.",
    },
    { type: 'instruction', fen: FEN.after_Bf4, text: "11.Bf4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bf4, correctMove: 'Ngf6',
      prompt: "Your move.", hint: "Ngf6.",
      correctFeedback: "Ngf6.", wrongFeedback: "Ngf6.",
    },
    { type: 'instruction', fen: FEN.after_OOO, text: "12.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_OOO, correctMove: 'Be7',
      prompt: "Your move.", hint: "Be7.",
      correctFeedback: "Be7.", wrongFeedback: "Be7.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: The Exchange
// Teaches: 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6
// ═══════════════════════════════════════════════════════════

export const CK_EXCHANGE_1: OpeningLesson = {
  id: 'ck-exchange-1',
  title: 'The Exchange',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "After 1.e4 c6 2.d4 d5, White sometimes exchanges immediately. Let's handle it.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c6',
      prompt: "Caro-Kann.", hint: "c6.",
      correctFeedback: "c6.", wrongFeedback: "c6.",
      highlightSquares: ['c7', 'c6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'd5',
      prompt: "Challenge.", hint: "d5.",
      correctFeedback: "d5.", wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6)
    // ═══════════════════════════════════════════

    // 3.exd5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ex_after_exd5,
      text: "3.exd5 — the Exchange variation. White simplifies immediately. Recapture!",
      autoAdvance: 800,
    },

    // 3...cxd5
    {
      type: 'instruction',
      fen: FEN.ex_after_exd5,
      text: "Take back with the c-pawn. You get an open c-file and symmetrical center. Easy to play.",
    },
    {
      type: 'play-move',
      fen: FEN.ex_after_exd5,
      correctMove: 'cxd5',
      prompt: "Recapture — open the c-file.",
      hint: "Take with the c-pawn: cxd5.",
      correctFeedback: "cxd5! Symmetrical center, open c-file. The Exchange is easy for Black.",
      wrongFeedback: "Recapture with cxd5 — open the c-file.",
      highlightSquares: ['c6', 'd5'],
    },

    // 4.Bd3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ex_after_Bd3,
      text: "4.Bd3 — White develops. Develop your knight.",
      autoAdvance: 800,
    },

    // 4...Nc6
    {
      type: 'instruction',
      fen: FEN.ex_after_Bd3,
      text: "Knight to c6 — develop naturally and put pressure on d4.",
    },
    {
      type: 'play-move',
      fen: FEN.ex_after_Bd3,
      correctMove: 'Nc6',
      prompt: "Develop — eyes on d4.",
      hint: "Knight to c6.",
      correctFeedback: "Nc6! Developed and pressuring d4. The Exchange variation is harmless.",
      wrongFeedback: "Knight to c6 — develop and pressure d4.",
      highlightSquares: ['b8', 'c6'],
    },

    // 5.c3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ex_after_c3,
      text: "5.c3 — White supports d4. Keep developing.",
      autoAdvance: 800,
    },

    // 5...Nf6
    {
      type: 'instruction',
      fen: FEN.ex_after_c3,
      text: "Knight to f6 — natural development, eyes on e4 and d5. You're already equal.",
    },
    {
      type: 'play-move',
      fen: FEN.ex_after_c3,
      correctMove: 'Nf6',
      prompt: "Natural development.",
      hint: "Knight to f6.",
      correctFeedback: "Nf6! Both knights out, equal position. The Exchange is no problem at all.",
      wrongFeedback: "Play Nf6 — develop and equalize.",
      highlightSquares: ['g8', 'f6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH (no complex punish — quiz instead)
    // ═══════════════════════════════════════════

    {
      type: 'quiz',
      fen: FEN.ex_after_Nf6,
      question: "Why is the Exchange variation easy for Black?",
      options: [
        "Black has an extra pawn",
        "The open c-file and easy development",
        "White's king is exposed",
        "Black can castle queenside quickly",
      ],
      correctIndex: 1,
      explanation: "The Exchange gives Black the open c-file and free development. No imbalances to struggle with — that's why stronger players avoid it as White.",
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (cxd5, Nc6, Nf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.ex_after_exd5,
      text: "Again. Exchange variation.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.ex_after_exd5, correctMove: 'cxd5',
      prompt: "Your move.", hint: "cxd5.",
      correctFeedback: "cxd5.", wrongFeedback: "cxd5.",
    },
    { type: 'instruction', fen: FEN.ex_after_Bd3, text: "4.Bd3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.ex_after_Bd3, correctMove: 'Nc6',
      prompt: "Your move.", hint: "Nc6.",
      correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.ex_after_c3, text: "5.c3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.ex_after_c3, correctMove: 'Nf6',
      prompt: "Your move.", hint: "Nf6.",
      correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Two Knights
// Teaches: 4...Nf6 5.Nxf6+ exf6 6.Bc4 Bd6
// ═══════════════════════════════════════════════════════════

export const CK_TWOKNIGHT_1: OpeningLesson = {
  id: 'ck-twoknight-1',
  title: 'Two Knights',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c6, d5, dxe4 to get to Nxe4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "After 4.Nxe4, the Classical plays Bf5. But there's another option — 4...Nf6!?",
      buttonText: "LET'S GO",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4...Nf6 5.Nxf6+ exf6 6.Bc4 Bd6)
    // ═══════════════════════════════════════════

    // 4...Nf6
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Play Nf6 — challenging the knight directly! White will trade, giving you doubled pawns but a powerful position.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Nf6',
      prompt: "Challenge the knight head-on!",
      hint: "Knight to f6 — attack the knight on e4.",
      correctFeedback: "Nf6! The Two Knights variation. Aggressive and dynamic.",
      wrongFeedback: "Play Nf6 — challenge the knight directly.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // 5.Nxf6+ (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tk_after_Nxf6,
      text: "5.Nxf6+ — White captures with check. Time for a key decision.",
      autoAdvance: 800,
    },

    // 5...exf6
    {
      type: 'instruction',
      fen: FEN.tk_after_Nxf6,
      text: "Take back with the e-pawn! Yes, you get doubled f-pawns. But you also get the open e-file AND the bishop pair. That's a great trade.",
    },
    {
      type: 'play-move',
      fen: FEN.tk_after_Nxf6,
      correctMove: 'exf6',
      prompt: "Recapture — accept the doubled pawns.",
      hint: "Take with the e-pawn: exf6. The open e-file is worth it.",
      correctFeedback: "exf6! Doubled pawns, but the open e-file and two bishops are powerful compensation.",
      wrongFeedback: "Take with exf6 — the open e-file is worth the doubled pawns.",
      highlightSquares: ['e7', 'f6'],
    },

    // 6.Bc4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tk_after_Bc4,
      text: "6.Bc4 — White develops. Now put your bishop on a great diagonal.",
      autoAdvance: 800,
    },

    // 6...Bd6
    {
      type: 'instruction',
      fen: FEN.tk_after_Bc4,
      text: "Bishop to d6! It eyes the kingside, supports a future Qe7, and your position is rich with possibilities.",
    },
    {
      type: 'play-move',
      fen: FEN.tk_after_Bc4,
      correctMove: 'Bd6',
      prompt: "Active bishop — aim at the kingside.",
      hint: "Bishop to d6 — a strong attacking square.",
      correctFeedback: "Bd6! Active and aggressive. The Two Knights gives you dynamic play with both bishops.",
      wrongFeedback: "Play Bd6 — an aggressive developing move.",
      highlightSquares: ['f8', 'd6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 6.Be2?!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.tk_after_exf6,
      text: "What if White plays 6.Be2 instead of Bc4? That's too passive.",
    },

    // 6.Be2?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tkp_after_Be2,
      text: "6.Be2?! Passive. The bishop does nothing on e2. You develop freely.",
      autoAdvance: 800,
    },

    // 6...Bd6 (user plays)
    {
      type: 'play-move',
      fen: FEN.tkp_after_Be2,
      correctMove: 'Bd6',
      prompt: "Develop aggressively — White is passive.",
      hint: "Bishop to d6.",
      correctFeedback: "Bd6! Your pieces are active, White's are passive. The Be2 was a waste.",
      wrongFeedback: "Play Bd6 — take advantage of White's passive play.",
      highlightSquares: ['f8', 'd6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (Nf6, exf6, Bd6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "One more time. The Two Knights.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'Nf6',
      prompt: "Your move.", hint: "Nf6.",
      correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },
    { type: 'instruction', fen: FEN.tk_after_Nxf6, text: "5.Nxf6+.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.tk_after_Nxf6, correctMove: 'exf6',
      prompt: "Your move.", hint: "exf6.",
      correctFeedback: "exf6.", wrongFeedback: "exf6.",
    },
    { type: 'instruction', fen: FEN.tk_after_Bc4, text: "6.Bc4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.tk_after_Bc4, correctMove: 'Bd6',
      prompt: "Your move.", hint: "Bd6.",
      correctFeedback: "Bd6.", wrongFeedback: "Bd6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LEVEL 1 TEST
// Full-line recall of the Classical Caro-Kann + variations
// ═══════════════════════════════════════════════════════════

export const CK_TEST_1: OpeningLesson = {
  id: 'ck-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the entire Caro-Kann Classical — all 12 moves. No hints.",
      buttonText: "BEGIN",
    },

    // --- Main line: c6, d5, dxe4, Bf5, Bg6, h6, Nd7, Bh7, Bxd3, e6, Ngf6, Be7 ---

    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c6',
      prompt: "Your move.", hint: "c6.", correctFeedback: "c6.", wrongFeedback: "c6.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'd5',
      prompt: "Your move.", hint: "d5.", correctFeedback: "d5.", wrongFeedback: "d5.",
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'dxe4',
      prompt: "Your move.", hint: "dxe4.", correctFeedback: "dxe4.", wrongFeedback: "dxe4.",
    },
    { type: 'instruction', fen: FEN.after_Nxe4, text: "4.Nxe4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'Bf5',
      prompt: "Your move.", hint: "Bf5.", correctFeedback: "Bf5.", wrongFeedback: "Bf5.",
    },
    { type: 'instruction', fen: FEN.after_Ng3, text: "5.Ng3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Ng3, correctMove: 'Bg6',
      prompt: "Your move.", hint: "Bg6.", correctFeedback: "Bg6.", wrongFeedback: "Bg6.",
    },
    { type: 'instruction', fen: FEN.after_h4, text: "6.h4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_h4, correctMove: 'h6',
      prompt: "Your move.", hint: "h6.", correctFeedback: "h6.", wrongFeedback: "h6.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: "7.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nd7',
      prompt: "Your move.", hint: "Nd7.", correctFeedback: "Nd7.", wrongFeedback: "Nd7.",
    },
    { type: 'instruction', fen: FEN.after_h5, text: "8.h5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_h5, correctMove: 'Bh7',
      prompt: "Your move.", hint: "Bh7.", correctFeedback: "Bh7.", wrongFeedback: "Bh7.",
    },
    { type: 'instruction', fen: FEN.after_Bd3, text: "9.Bd3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bxd3',
      prompt: "Your move.", hint: "Bxd3.", correctFeedback: "Bxd3.", wrongFeedback: "Bxd3.",
    },
    { type: 'instruction', fen: FEN.after_Qxd3, text: "10.Qxd3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Qxd3, correctMove: 'e6',
      prompt: "Your move.", hint: "e6.", correctFeedback: "e6.", wrongFeedback: "e6.",
    },
    { type: 'instruction', fen: FEN.after_Bf4, text: "11.Bf4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bf4, correctMove: 'Ngf6',
      prompt: "Your move.", hint: "Ngf6.", correctFeedback: "Ngf6.", wrongFeedback: "Ngf6.",
    },
    { type: 'instruction', fen: FEN.after_OOO, text: "12.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_OOO, correctMove: 'Be7',
      prompt: "Your move.", hint: "Be7.",
      correctFeedback: "Be7.",
      wrongFeedback: "Be7.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

const CARO_KANN_LESSONS: Record<string, OpeningLesson> = {
  'ck-1': CK_LESSON_1,
  'ck-2': CK_LESSON_2,
  'ck-punish-nf3': CK_PUNISH_NF3,
  'ck-punish-e5': CK_PUNISH_E5,
  'ck-3': CK_LESSON_3,
  'ck-advance-1': CK_ADVANCE_1,
  'ck-4': CK_LESSON_4,
  'ck-exchange-1': CK_EXCHANGE_1,
  'ck-twoknight-1': CK_TWOKNIGHT_1,
  'ck-test-1': CK_TEST_1,
}

export function getCaroKannLesson(id: string): OpeningLesson | undefined {
  return CARO_KANN_LESSONS[id]
}
