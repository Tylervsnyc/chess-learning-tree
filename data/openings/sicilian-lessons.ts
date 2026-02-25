import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN DEFENSE LESSONS (sc-1 through sc-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5
//            7.Nb3 Be7 8.Qd2 O-O 9.O-O-O b5 10.f3 Bb7 11.Kb1 Nbd7 12.g4 Rc8
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c5: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_d6: 'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  after_d4: 'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3',
  after_cxd4: 'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  after_Nxd4: 'rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  after_Nf6: 'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  after_Nc3: 'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  after_a6: 'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  after_Be3: 'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6',
  after_e5: 'rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7',
  after_Nb3: 'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R b KQkq - 1 7',
  after_Be7: 'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq - 2 8',
  after_Qd2: 'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NN1B3/PPPQ1PPP/R3KB1R b KQkq - 3 8',
  after_OO: 'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN1B3/PPPQ1PPP/R3KB1R w KQ - 4 9',
  after_OOO: 'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN1B3/PPPQ1PPP/2KR1B1R b - - 5 9',
  after_b5: 'rnbq1rk1/4bppp/p2p1n2/1p2p3/4P3/1NN1B3/PPPQ1PPP/2KR1B1R w - - 0 10',
  after_f3: 'rnbq1rk1/4bppp/p2p1n2/1p2p3/4P3/1NN1BP2/PPPQ2PP/2KR1B1R b - - 0 10',
  after_Bb7: 'rn1q1rk1/1b2bppp/p2p1n2/1p2p3/4P3/1NN1BP2/PPPQ2PP/2KR1B1R w - - 1 11',
  after_Kb1: 'rn1q1rk1/1b2bppp/p2p1n2/1p2p3/4P3/1NN1BP2/PPPQ2PP/1K1R1B1R b - - 2 11',
  after_Nbd7: 'r2q1rk1/1b1nbppp/p2p1n2/1p2p3/4P3/1NN1BP2/PPPQ2PP/1K1R1B1R w - - 3 12',
  after_g4: 'r2q1rk1/1b1nbppp/p2p1n2/1p2p3/4P1P1/1NN1BP2/PPPQ3P/1K1R1B1R b - - 0 12',
  after_Rc8: '2rq1rk1/1b1nbppp/p2p1n2/1p2p3/4P1P1/1NN1BP2/PPPQ3P/1K1R1B1R w - - 1 13',

  // Punish Qxd4? line
  pqd4_after_d4: 'rnbqkbnr/pp1ppppp/8/2p5/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  pqd4_after_cxd4: 'rnbqkbnr/pp1ppppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  pqd4_after_Qxd4: 'rnbqkbnr/pp1ppppp/8/8/3QP3/8/PPP2PPP/RNB1KBNR b KQkq - 0 3',
  pqd4_after_Nc6: 'r1bqkbnr/pp1ppppp/2n5/8/3QP3/8/PPP2PPP/RNB1KBNR w KQkq - 1 4',
  pqd4_after_Qe3: 'r1bqkbnr/pp1ppppp/2n5/8/4P3/4Q3/PPP2PPP/RNB1KBNR b KQkq - 2 4',
  pqd4_after_Nf6: 'r1bqkb1r/pp1ppppp/2n2n2/8/4P3/4Q3/PPP2PPP/RNB1KBNR w KQkq - 3 5',

  // Punish 2.Bc4?! line
  pbc4_after_Bc4: 'rnbqkbnr/pp1ppppp/8/2p5/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2',
  pbc4_after_e6: 'rnbqkbnr/pp1p1ppp/4p3/2p5/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 3',
  pbc4_after_Nc3: 'rnbqkbnr/pp1p1ppp/4p3/2p5/2B1P3/2N5/PPPP1PPP/R1BQK1NR b KQkq - 1 3',
  pbc4_after_d5: 'rnbqkbnr/pp3ppp/4p3/2pp4/2B1P3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4',
  pbc4_after_exd5: 'rnbqkbnr/pp3ppp/4p3/2pP4/2B5/2N5/PPPP1PPP/R1BQK1NR b KQkq - 0 4',
  pbc4_after_exd5_b: 'rnbqkbnr/pp3ppp/8/2pp4/2B5/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 5',
  pbc4_after_Bb3: 'rnbqkbnr/pp3ppp/8/2pp4/8/1BN5/PPPP1PPP/R1BQK1NR b KQkq - 1 5',
  pbc4_after_Nf6_bc4: 'rnbqkb1r/pp3ppp/5n2/2pp4/8/1BN5/PPPP1PPP/R1BQK1NR w KQkq - 2 6',
  pbc4_after_d3: 'rnbqkb1r/pp3ppp/5n2/2pp4/8/1BNP4/PPP2PPP/R1BQK1NR b KQkq - 0 6',
  pbc4_after_Bd6: 'rnbqk2r/pp3ppp/3b1n2/2pp4/8/1BNP4/PPP2PPP/R1BQK1NR w KQkq - 1 7',

  // Dragon line (from 5.Nc3)
  dragon_after_g6: 'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  dragon_after_Be3: 'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6',
  dragon_after_Bg7: 'rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7',
  dragon_after_f3: 'rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7',
  dragon_after_OO: 'rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ - 1 8',

  // Dragon 2 line
  dragon2_after_Qd2: 'rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ - 2 8',
  dragon2_after_Nc6: 'r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9',
  dragon2_after_Bc4: 'r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9',
  dragon2_after_Bd7: 'r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10',
  dragon2_after_OOO: 'r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R b - - 6 10',
  dragon2_after_Rc8: '2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11',

  // Classical line
  classical_after_Nc6: 'r1bqkbnr/pp2pppp/2np4/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  classical_after_Nc3: 'r1bqkbnr/pp2pppp/2np4/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  classical_after_Nf6_cl: 'r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 3 6',
  classical_after_Be2: 'r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 4 6',
  classical_after_e5_cl: 'r1bqkb1r/pp3ppp/2np1n2/4p3/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq - 0 7',

  // ═══ PUNISH POSITIONS ═══

  // sc-1 punish: After 2.Nf3 d6, White plays 3.Bc4?
  sc1p_after_Bc4: 'rnbqkbnr/pp2pppp/3p4/2p5/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 3',
  sc1p_after_Nf6: 'rnbqkb1r/pp2pppp/3p1n2/2p5/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4',
  sc1p_after_d3: 'rnbqkb1r/pp2pppp/3p1n2/2p5/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
  sc1p_after_e5: 'rnbqkb1r/pp3ppp/3p1n2/2p1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',

  // sc-2 punish: After 5.Nc3 a6, White plays 6.f4?
  sc2p_after_f4: 'rnbqkb1r/1p2pppp/p2p1n2/8/3NPP2/2N5/PPP3PP/R1BQKB1R b KQkq - 0 6',
  sc2p_after_e5_p: 'rnbqkb1r/1p3ppp/p2p1n2/4p3/3NPP2/2N5/PPP3PP/R1BQKB1R w KQkq - 0 7',
  sc2p_after_Nf3_p: 'rnbqkb1r/1p3ppp/p2p1n2/4p3/4PP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 1 7',
  sc2p_after_Qc7: 'rnb1kb1r/1pq2ppp/p2p1n2/4p3/4PP2/2N2N2/PPP3PP/R1BQKB1R w KQkq - 2 8',

  // sc-3 punish: After 7.Nb3 Be7, White plays 8.Bd3?
  sc3p_after_Bd3: 'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NNBB3/PPP2PPP/R2QK2R b KQkq - 3 8',
  sc3p_after_OO: 'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NNBB3/PPP2PPP/R2QK2R w KQ - 4 9',

  // sc-4 punish: After 9...b5, White plays 10.Nd5?
  sc4p_after_Nd5: 'rnbq1rk1/4bppp/p2p1n2/1p1Np3/4P3/1N2B3/PPPQ1PPP/2KR1B1R b - - 1 10',
  sc4p_after_Nxd5: 'rnbq1rk1/4bppp/p2p4/1p1np3/4P3/1N2B3/PPPQ1PPP/2KR1B1R w - - 0 11',
  sc4p_after_exd5: 'rnbq1rk1/4bppp/p2p4/1p1Pp3/8/1N2B3/PPPQ1PPP/2KR1B1R b - - 0 11',

  // Dragon-1 punish: After 6.Be3 Bg7, White plays 7.Bc4?
  d1p_after_Bc4: 'rnbqk2r/pp2ppbp/3p1np1/8/2BNP3/2N1B3/PPP2PPP/R2QK2R b KQkq - 3 7',
  d1p_after_OO: 'rnbq1rk1/pp2ppbp/3p1np1/8/2BNP3/2N1B3/PPP2PPP/R2QK2R w KQ - 4 8',

  // Dragon-2 punish: After 8.Qd2 Nc6, White plays 9.e5?
  d2p_after_e5: 'r1bq1rk1/pp2ppbp/2np1np1/4P3/3N4/2N1BP2/PPPQ2PP/R3KB1R b KQ - 0 9',
  d2p_after_dxe5: 'r1bq1rk1/pp2ppbp/2n2np1/4p3/3N4/2N1BP2/PPPQ2PP/R3KB1R w KQ - 0 10',

  // Classical punish: After 4...Nc6, White plays 5.Nxc6?
  clp_after_Nxc6: 'r1bqkbnr/pp2pppp/2Np4/8/4P3/8/PPP2PPP/RNBQKB1R b KQkq - 0 5',
  clp_after_bxc6: 'r1bqkbnr/p3pppp/2pp4/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 6',

  // Punish-Qxd4 lesson punish: Qa4 retreat
  pqd4p_after_Qa4: 'r1bqkbnr/pp1ppppp/2n5/8/Q3P3/8/PPP2PPP/RNB1KBNR b KQkq - 2 4',
  pqd4p_after_Nf6: 'r1bqkb1r/pp1ppppp/2n2n2/8/Q3P3/8/PPP2PPP/RNB1KBNR w KQkq - 3 5',

  // Punish-Bc4 lesson punish: Bb3 position
  pbc4p_after_Nf6: 'rnbqkb1r/pp3ppp/5n2/2pp4/8/1BN5/PPPP1PPP/R1BQK1NR w KQkq - 2 6',
  pbc4p_after_d3: 'rnbqkb1r/pp3ppp/5n2/2pp4/8/1BNP4/PPP2PPP/R1BQK1NR b KQkq - 0 6',
  pbc4p_after_Bd6: 'rnbqk2r/pp3ppp/3b1n2/2pp4/8/1BNP4/PPP2PPP/R1BQK1NR w KQkq - 1 7',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Sicilian Move
// Teaches: 1.e4 c5 2.Nf3 d6 3.d4 cxd4
// BLACK opening — user plays Black moves, White auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const SC_LESSON_1: OpeningLesson = {
  id: 'sc-1',
  title: 'The Sicilian Move',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: No recap (first lesson of the opening)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1.e4 c5 2.Nf3 d6 3.d4 cxd4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Sicilian Defense — the most popular and combative response to 1.e4. Instead of mirroring White, you fight for the center on YOUR terms.",
    },

    // --- White plays 1.e4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },

    // --- Black plays 1...c5 ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Most players answer 1.e4 with 1...e5. But in the Sicilian, you play 1...c5 — grabbing queenside space and fighting for d4.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c5',
      prompt: "Start the Sicilian — fight for the d4 square.",
      hint: "Push your c-pawn two squares. Control d4 from the side.",
      correctFeedback: "c5! That's the Sicilian. You're fighting for d4 without mirroring White.",
      wrongFeedback: "In the Sicilian, Black plays c5 — attacking d4 from the flank.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // --- White plays 2.Nf3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "2.Nf3 — White develops naturally, preparing d4.",
      autoAdvance: 800,
    },

    // --- Black plays 2...d6 ---
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Play d6 — solid and flexible. It supports a future ...e5, guards against tricks, and keeps all your options open.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'd6',
      prompt: "A solid, flexible pawn move.",
      hint: "Push your d-pawn one square — support the center from behind.",
      correctFeedback: "d6! Flexible and strong. You're preparing for the central clash.",
      wrongFeedback: "Play d6 — it supports your center and keeps options open.",
      highlightSquares: ['d7', 'd6'],
    },

    // --- White plays 3.d4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "3.d4 — the critical moment! White challenges the center. This is what you've been waiting for.",
      autoAdvance: 800,
    },

    // --- Black plays 3...cxd4 ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Take on d4! You trade your c-pawn for White's d-pawn. The payoff? You get the half-open c-file — a highway for your rook later.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'cxd4',
      prompt: "Capture! Trade the c-pawn for the d-pawn.",
      hint: "Take the pawn on d4 with your c5 pawn.",
      correctFeedback: "cxd4! The Sicilian exchange. You gave up the c-pawn but opened the c-file — that's the whole point of the Sicilian.",
      wrongFeedback: "Capture on d4 with cxd4 — this is the key Sicilian trade.",
      highlightSquares: ['c5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 3.Bc4? (Italian thinking)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "What if White tries something else? After 2.Nf3 d6, imagine White plays 3.Bc4 — thinking like the Italian Game. Can you punish it?",
    },

    // 3.Bc4? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc1p_after_Bc4,
      text: "3.Bc4? The bishop eyes f7, but in the Sicilian this accomplishes nothing. The position is closed.",
      autoAdvance: 800,
    },

    // 3...Nf6 (user plays)
    {
      type: 'play-move',
      fen: FEN.sc1p_after_Bc4,
      correctMove: 'Nf6',
      prompt: "White wasted a tempo. Develop freely!",
      hint: "Your knight goes to f6 — attacking e4 with no worries.",
      correctFeedback: "Nf6! Free development. The Bc4 isn't doing anything useful here.",
      wrongFeedback: "Develop your knight to f6 — it attacks e4 and White's bishop is misplaced.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // 4.d3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc1p_after_d3,
      text: "4.d3 — White is stuck playing passively. No d4 break available.",
      autoAdvance: 800,
    },

    // 4...e5 (user plays)
    {
      type: 'play-move',
      fen: FEN.sc1p_after_d3,
      correctMove: 'e5',
      prompt: "Grab the center while White flounders!",
      hint: "Push e5 — take space in the center.",
      correctFeedback: "e5! You own the center. White's Bc4 is staring at a wall. That's the punishment for Italian thinking in the Sicilian.",
      wrongFeedback: "Push e5 — seize the center while White is passive.",
      highlightSquares: ['e7', 'e5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay c5, d6, cxd4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three Black moves of the Sicilian.",
      buttonText: "LET'S GO",
    },

    // 1.e4
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    // Recall: c5
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c5',
      prompt: "The Sicilian move.",
      hint: "c-pawn, two squares.",
      correctFeedback: "c5!",
      wrongFeedback: "The Sicilian starts with c5.",
      highlightSquares: ['c7', 'c5'],
    },
    // 2.Nf3
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    // Recall: d6
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'd6',
      prompt: "Solid and flexible.",
      hint: "d-pawn, one square.",
      correctFeedback: "d6.",
      wrongFeedback: "Play d6.",
      highlightSquares: ['d7', 'd6'],
    },
    // 3.d4
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    // Recall: cxd4
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'cxd4',
      prompt: "The exchange — open the c-file.",
      hint: "Capture on d4.",
      correctFeedback: "cxd4 — the Sicilian is on the board!",
      wrongFeedback: "Take on d4.",
      highlightSquares: ['c5', 'd4'],
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: The Najdorf
// Teaches: 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5
// Recap: c5, d6, cxd4
// ═══════════════════════════════════════════════════════════

export const SC_LESSON_2: OpeningLesson = {
  id: 'sc-2',
  title: 'The Najdorf',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c5, d6, cxd4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the Sicilian opening moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c5',
      prompt: "The Sicilian move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'd6',
      prompt: "Solid and flexible.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'cxd4',
      prompt: "Exchange.",
      hint: "cxd4.",
      correctFeedback: "cxd4.",
      wrongFeedback: "cxd4.",
      highlightSquares: ['c5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5)
    // ═══════════════════════════════════════════

    // 4.Nxd4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "4.Nxd4 — White recaptures. Now the real Sicilian begins.",
      autoAdvance: 800,
    },

    // 4...Nf6
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "Develop your knight to f6. It attacks the e4 pawn immediately — forcing White to make decisions.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nf6',
      prompt: "Develop and attack e4.",
      hint: "Knight to f6 hits the e4 pawn.",
      correctFeedback: "Nf6! Attacking e4 right away. White can't ignore this.",
      wrongFeedback: "Develop your knight to f6 — it attacks e4.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // 5.Nc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "5.Nc3 — White defends e4 with the knight.",
      autoAdvance: 800,
    },

    // 5...a6 — THE NAJDORF MOVE
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Now for the signature Najdorf move: 5...a6! It looks quiet, but it's incredibly flexible. It prevents Bb5+, prepares ...e5 or ...b5, and keeps White guessing.",
      highlightSquares: ['a7', 'a6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'a6',
      prompt: "The Najdorf move — a little pawn with a big purpose.",
      hint: "Push the a-pawn one square. Prevent Bb5+ and prepare ...b5.",
      correctFeedback: "a6! The Najdorf is on the board. Fischer, Kasparov, Carlsen — all Najdorf players.",
      wrongFeedback: "Play a6 — the signature Najdorf move.",
      highlightSquares: ['a7', 'a6'],
    },

    // 6.Be3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "6.Be3 — White develops the bishop. A common English Attack setup.",
      autoAdvance: 800,
    },

    // 6...e5 — strike the center!
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "Strike the center with e5! This kicks the d4 knight and grabs space. The center is YOURS.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'e5',
      prompt: "Hit the center and kick the knight!",
      hint: "Push e5 — attack the knight on d4 and grab central space.",
      correctFeedback: "e5! The knight has to move and you control the center. Classic Najdorf.",
      wrongFeedback: "Push e5 — kick the knight and take the center.",
      highlightSquares: ['e7', 'e5'],
      postMoveArrow: ['e5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 5.Nc3 a6, White plays 6.f4?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "What if White overextends? After 5.Nc3 a6, imagine White plays 6.f4 — pushing the kingside too fast.",
    },

    // 6.f4? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc2p_after_f4,
      text: "6.f4? Aggressive, but it weakens the king and leaves e5 begging to be attacked.",
      autoAdvance: 800,
    },

    // 6...e5!
    {
      type: 'play-move',
      fen: FEN.sc2p_after_f4,
      correctMove: 'e5',
      prompt: "White overextended. Strike!",
      hint: "Push e5 — attack the knight AND the f4 pawn.",
      correctFeedback: "e5! The knight is under fire and the f4 pawn is awkward. White is already in trouble.",
      wrongFeedback: "Strike with e5 — it attacks everything.",
      highlightSquares: ['e7', 'e5'],
    },

    // 7.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc2p_after_Nf3_p,
      text: "7.Nf3 — the knight retreats. White's f4 pawn is just a weakness now.",
      autoAdvance: 800,
    },

    // 7...Qc7
    {
      type: 'play-move',
      fen: FEN.sc2p_after_Nf3_p,
      correctMove: 'Qc7',
      prompt: "Develop the queen with purpose.",
      hint: "Qc7 — eyes the c-file and supports e5.",
      correctFeedback: "Qc7! Black has a great game. The f4 pawn is a liability and you're developing smoothly.",
      wrongFeedback: "Play Qc7 — support e5 and prepare for the c-file.",
      highlightSquares: ['d8', 'c7'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay c5, d6, cxd4, Nf6, a6, e5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Full recall — play all six Black moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c5',
      prompt: "The Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6',
      prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4',
      prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4.",
    },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6',
      prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6',
      prompt: "The Najdorf.", hint: "a6.", correctFeedback: "a6!", wrongFeedback: "a6.",
    },
    { type: 'instruction', fen: FEN.after_Be3, text: "6.Be3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5',
      prompt: "Strike the center.", hint: "e5.", correctFeedback: "e5! The Najdorf is complete.", wrongFeedback: "e5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Castle & Attack
// Teaches: 7.Nb3 Be7 8.Qd2 O-O 9.O-O-O b5
// Recap: c5, d6, cxd4, Nf6, a6, e5
// ═══════════════════════════════════════════════════════════

export const SC_LESSON_3: OpeningLesson = {
  id: 'sc-3',
  title: 'Castle & Attack',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the Najdorf setup.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.", highlightSquares: ['c7', 'c5'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: "Najdorf.", hint: "a6.", correctFeedback: "a6.", wrongFeedback: "a6." },
    { type: 'instruction', fen: FEN.after_Be3, text: "6.Be3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: "Center.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (7.Nb3 Be7 8.Qd2 O-O 9.O-O-O b5)
    // ═══════════════════════════════════════════

    // 7.Nb3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: "7.Nb3 — the knight retreats from the center. Time to develop your bishop.",
      autoAdvance: 800,
    },

    // 7...Be7
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: "Develop Be7 — a natural square that prepares castling. Simple and effective.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'Be7',
      prompt: "Develop the bishop and prepare to castle.",
      hint: "Bishop to e7 — get ready to castle kingside.",
      correctFeedback: "Be7! Ready to castle. The position is heating up.",
      wrongFeedback: "Play Be7 — develop and prepare to castle.",
      highlightSquares: ['f8', 'e7'],
    },

    // 8.Qd2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "8.Qd2 — White prepares to castle queenside. This means opposite-side castling — a full-on attack race!",
      autoAdvance: 800,
    },

    // 8...O-O
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "Castle NOW. Get your king safe before the fireworks begin.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'O-O',
      prompt: "Get your king to safety!",
      hint: "Castle kingside — king goes to g8.",
      correctFeedback: "O-O! King is tucked away. Now it's time to attack White's king.",
      wrongFeedback: "Castle kingside to get your king safe.",
      highlightSquares: ['e8', 'g8'],
    },

    // 9.O-O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "9.O-O-O — White castles queenside! Opposite-side castling. Both kings are exposed to pawn storms. It's a RACE.",
      autoAdvance: 800,
    },

    // 9...b5!
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "b5! Launch the queenside pawn storm. Your pawns march toward White's king. This is what a6 was preparing all along!",
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'b5',
      prompt: "Start the pawn storm! Attack White's king!",
      hint: "Push b5 — your pawns are marching toward the enemy king.",
      correctFeedback: "b5! The pawn storm begins. This is why a6 was so important — it made b5 possible without Bb5+ tricks.",
      wrongFeedback: "Play b5 — launch the queenside attack!",
      highlightSquares: ['b7', 'b5'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 7.Nb3 Be7, White plays 8.Bd3?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "What if White plays passively? After 7.Nb3 Be7, imagine White plays 8.Bd3 — blocking the d-file.",
    },

    // 8.Bd3? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc3p_after_Bd3,
      text: "8.Bd3? Passive. The bishop blocks the d-file and White can't organize an attack.",
      autoAdvance: 800,
    },

    // 8...O-O
    {
      type: 'play-move',
      fen: FEN.sc3p_after_Bd3,
      correctMove: 'O-O',
      prompt: "White is passive. Castle and enjoy your great position!",
      hint: "Castle kingside — you're already better.",
      correctFeedback: "O-O! You're castled, fully developed, and White's pieces are tripping over each other. That's the cost of passive play.",
      wrongFeedback: "Castle — you have a comfortable position.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (all 9 Black moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Full recall — play all nine Black moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: "Najdorf.", hint: "a6.", correctFeedback: "a6.", wrongFeedback: "a6." },
    { type: 'instruction', fen: FEN.after_Be3, text: "6.Be3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: "Center.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_Nb3, text: "7.Nb3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: "Develop.", hint: "Be7.", correctFeedback: "Be7.", wrongFeedback: "Be7." },
    { type: 'instruction', fen: FEN.after_Qd2, text: "8.Qd2.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'O-O', prompt: "King safety.", hint: "Castle.", correctFeedback: "O-O.", wrongFeedback: "Castle kingside." },
    { type: 'instruction', fen: FEN.after_OOO, text: "9.O-O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'b5', prompt: "STORM!", hint: "b5.", correctFeedback: "b5! The attack begins.", wrongFeedback: "b5 — launch the pawn storm." },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: Complete the Setup
// Teaches: 10.f3 Bb7 11.Kb1 Nbd7 12.g4 Rc8
// Recap: c5, d6, cxd4, Nf6, a6, e5, Be7, O-O, b5
// ═══════════════════════════════════════════════════════════

export const SC_LESSON_4: OpeningLesson = {
  id: 'sc-4',
  title: 'Complete the Setup',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap — play the full Najdorf through b5.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: "Najdorf.", hint: "a6.", correctFeedback: "a6.", wrongFeedback: "a6." },
    { type: 'instruction', fen: FEN.after_Be3, text: "6.Be3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: "Center.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_Nb3, text: "7.Nb3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: "Develop.", hint: "Be7.", correctFeedback: "Be7.", wrongFeedback: "Be7." },
    { type: 'instruction', fen: FEN.after_Qd2, text: "8.Qd2.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "Castle." },
    { type: 'instruction', fen: FEN.after_OOO, text: "9.O-O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'b5', prompt: "Storm!", hint: "b5.", correctFeedback: "b5.", wrongFeedback: "b5." },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (10.f3 Bb7 11.Kb1 Nbd7 12.g4 Rc8)
    // ═══════════════════════════════════════════

    // 10.f3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: "10.f3 — White reinforces e4 and prepares g4. The kingside storm is coming. But so is yours.",
      autoAdvance: 800,
    },

    // 10...Bb7
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: "Develop the bishop to b7. It eyes e4 along the long diagonal — a sniper targeting White's center.",
    },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'Bb7',
      prompt: "Develop the bishop to the long diagonal.",
      hint: "Bishop to b7 — aim at e4 through the center.",
      correctFeedback: "Bb7! The bishop is a monster on this diagonal. It pressures e4 all game long.",
      wrongFeedback: "Play Bb7 — put the bishop on the long diagonal.",
      highlightSquares: ['c8', 'b7'],
      postMoveArrow: ['b7', 'e4'],
    },

    // 11.Kb1 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Kb1,
      text: "11.Kb1 — White tucks the king into the corner for safety. A standard prophylactic move.",
      autoAdvance: 800,
    },

    // 11...Nbd7
    {
      type: 'instruction',
      fen: FEN.after_Kb1,
      text: "Develop your last minor piece. Nbd7 — the knight heads for c5 or b6, both excellent outposts.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Kb1,
      correctMove: 'Nbd7',
      prompt: "Get the last knight into the game.",
      hint: "Knight from b8 to d7 — headed for c5.",
      correctFeedback: "Nbd7! The knight is heading for c5 — a dream square where it attacks e4 and a4.",
      wrongFeedback: "Develop the knight to d7.",
      highlightSquares: ['b8', 'd7'],
    },

    // 12.g4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_g4,
      text: "12.g4 — White starts the kingside pawn storm! It's a race now. Who attacks faster?",
      autoAdvance: 800,
    },

    // 12...Rc8!
    {
      type: 'instruction',
      fen: FEN.after_g4,
      text: "Rc8! Put the rook on the open c-file. This is what the ENTIRE Sicilian was about — your rook owns the c-file like a highway straight to White's king.",
    },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'Rc8',
      prompt: "The c-file — YOUR highway. Put a rook on it!",
      hint: "Rook to c8 — own the open file.",
      correctFeedback: "Rc8! The Sicilian setup is complete. Your rook stares down the c-file at White's king. This is what the c5-cxd4 trade was all about!",
      wrongFeedback: "Rook to c8 — own the c-file!",
      highlightSquares: ['a8', 'c8'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 9...b5, White plays 10.Nd5?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "What if White jumps the gun? After 9...b5, imagine White plays 10.Nd5 — looks scary but it's premature.",
    },

    // 10.Nd5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc4p_after_Nd5,
      text: "10.Nd5? Looks aggressive, but the knight isn't supported properly. Time to punish!",
      autoAdvance: 800,
    },

    // 10...Nxd5!
    {
      type: 'play-move',
      fen: FEN.sc4p_after_Nd5,
      correctMove: 'Nxd5',
      prompt: "The knight jumped too early. Trade it off!",
      hint: "Capture the knight on d5 with your knight.",
      correctFeedback: "Nxd5! Bye bye knight. White spent two moves putting it there and you just removed it.",
      wrongFeedback: "Take the knight with Nxd5.",
      highlightSquares: ['f6', 'd5'],
    },

    // 11.exd5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.sc4p_after_exd5,
      text: "11.exd5 — White recaptures, but now their pawn structure is compromised and the e4 square is gone.",
      autoAdvance: 800,
    },

    {
      type: 'instruction',
      fen: FEN.sc4p_after_exd5,
      text: "Black is better. The d5 pawn is a target, and you have a beautiful position with active pieces everywhere.",
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (all 12 Black moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "The full Najdorf — all twelve Black moves. You've got this.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: "Attack.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: "Najdorf.", hint: "a6.", correctFeedback: "a6.", wrongFeedback: "a6." },
    { type: 'instruction', fen: FEN.after_Be3, text: "6.Be3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: "Center.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_Nb3, text: "7.Nb3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: "Develop.", hint: "Be7.", correctFeedback: "Be7.", wrongFeedback: "Be7." },
    { type: 'instruction', fen: FEN.after_Qd2, text: "8.Qd2.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "Castle." },
    { type: 'instruction', fen: FEN.after_OOO, text: "9.O-O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'b5', prompt: "Storm!", hint: "b5.", correctFeedback: "b5.", wrongFeedback: "b5." },
    { type: 'instruction', fen: FEN.after_f3, text: "10.f3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Bb7', prompt: "Long diagonal.", hint: "Bb7.", correctFeedback: "Bb7.", wrongFeedback: "Bb7." },
    { type: 'instruction', fen: FEN.after_Kb1, text: "11.Kb1.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Kb1, correctMove: 'Nbd7', prompt: "Last piece.", hint: "Nbd7.", correctFeedback: "Nbd7.", wrongFeedback: "Nbd7." },
    { type: 'instruction', fen: FEN.after_g4, text: "12.g4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_g4, correctMove: 'Rc8', prompt: "Own the c-file!", hint: "Rc8.", correctFeedback: "Rc8! The Najdorf is complete. You're a Sicilian player now.", wrongFeedback: "Rc8 — the c-file is yours." },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH LESSON: Punish Qxd4?
// Teaches: After 1.e4 c5 2.d4 cxd4 3.Qxd4? — queen out too early
// ═══════════════════════════════════════════════════════════

export const SC_PUNISH_QD4: OpeningLesson = {
  id: 'sc-punish-qd4',
  title: 'Punish Qxd4?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (quick c5 replay)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "White tries to recapture with the queen. Let's punish it.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c5',
      prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 2.d4 cxd4 3.Qxd4? Nc6! 4.Qe3 Nf6
    // ═══════════════════════════════════════════

    // 2.d4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pqd4_after_d4,
      text: "2.d4 — White pushes immediately. This is fine, but watch what happens next.",
      autoAdvance: 800,
    },

    // 2...cxd4
    {
      type: 'play-move',
      fen: FEN.pqd4_after_d4,
      correctMove: 'cxd4',
      prompt: "Take the pawn.",
      hint: "Capture on d4.",
      correctFeedback: "cxd4.",
      wrongFeedback: "cxd4.",
      highlightSquares: ['c5', 'd4'],
    },

    // 3.Qxd4? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pqd4_after_Qxd4,
      text: "3.Qxd4? The queen comes out to recapture. Bad idea! She's exposed in the center with no protection.",
      autoAdvance: 800,
    },

    // 3...Nc6!
    {
      type: 'instruction',
      fen: FEN.pqd4_after_Qxd4,
      text: "Develop with tempo! Nc6 attacks the queen — she has to waste another move running away.",
    },
    {
      type: 'play-move',
      fen: FEN.pqd4_after_Qxd4,
      correctMove: 'Nc6',
      prompt: "Attack the queen while developing!",
      hint: "Knight to c6 — hits the queen and develops a piece.",
      correctFeedback: "Nc6! Developing with tempo. The queen has to retreat and you're ahead in development.",
      wrongFeedback: "Play Nc6 — attack the queen while developing.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // 4.Qe3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pqd4_after_Qe3,
      text: "4.Qe3 — the queen retreats awkwardly. She's wasted two moves and is blocking White's own development.",
      autoAdvance: 800,
    },

    // 4...Nf6
    {
      type: 'play-move',
      fen: FEN.pqd4_after_Qe3,
      correctMove: 'Nf6',
      prompt: "Keep developing — you're way ahead.",
      hint: "Knight to f6 — attack e4 and keep developing.",
      correctFeedback: "Nf6! Two pieces developed while the queen wanders. Black is already winning the opening battle.",
      wrongFeedback: "Nf6 — keep developing while the queen wastes time.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — Show alternative queen retreat
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pqd4_after_Nc6,
      text: "What if the queen runs to a4 instead? Same story — you keep developing for free.",
    },

    // 4.Qa4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pqd4p_after_Qa4,
      text: "4.Qa4 — another awkward retreat. The queen is offside on a4.",
      autoAdvance: 800,
    },

    // 4...Nf6
    {
      type: 'play-move',
      fen: FEN.pqd4p_after_Qa4,
      correctMove: 'Nf6',
      prompt: "Develop and attack. The queen is out of play.",
      hint: "Nf6 — business as usual.",
      correctFeedback: "Nf6! The queen on a4 does nothing. You have two pieces out and White has zero. That's the cost of 3.Qxd4?",
      wrongFeedback: "Nf6 — develop while the queen sits on the sideline.",
      highlightSquares: ['g8', 'f6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (cxd4, Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Recall — punish the Qxd4 line.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.pqd4_after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pqd4_after_d4, correctMove: 'cxd4',
      prompt: "Take.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4.",
    },
    { type: 'instruction', fen: FEN.pqd4_after_Qxd4, text: "3.Qxd4?", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pqd4_after_Qxd4, correctMove: 'Nc6',
      prompt: "Develop with tempo!", hint: "Nc6.", correctFeedback: "Nc6! The queen runs.", wrongFeedback: "Nc6 attacks the queen.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH LESSON: Punish 2.Bc4?
// Teaches: After 1.e4 c5 2.Bc4?! — Italian thinking doesn't work here
// ═══════════════════════════════════════════════════════════

export const SC_PUNISH_BC4: OpeningLesson = {
  id: 'sc-punish-bc4',
  title: 'Punish 2.Bc4?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (quick c5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "White plays Bc4 early — aiming at f7. But this is the Sicilian, not the Italian!",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c5',
      prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 2.Bc4 e6! 3.Nc3 d5! 4.exd5 exd5
    // ═══════════════════════════════════════════

    // 2.Bc4?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pbc4_after_Bc4,
      text: "2.Bc4?! White aims the bishop at f7 — but in the Sicilian, there's no weakness there yet.",
      autoAdvance: 800,
    },

    // 2...e6!
    {
      type: 'instruction',
      fen: FEN.pbc4_after_Bc4,
      text: "Block the diagonal with e6! The bishop on c4 is now staring at a wall.",
    },
    {
      type: 'play-move',
      fen: FEN.pbc4_after_Bc4,
      correctMove: 'e6',
      prompt: "Block the bishop's diagonal!",
      hint: "e6 — shut the door on the Bc4.",
      correctFeedback: "e6! The bishop is blocked. It's aiming at nothing now.",
      wrongFeedback: "Play e6 — close the diagonal against the bishop.",
      highlightSquares: ['e7', 'e6'],
    },

    // 3.Nc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pbc4_after_Nc3,
      text: "3.Nc3 — White develops normally.",
      autoAdvance: 800,
    },

    // 3...d5!
    {
      type: 'instruction',
      fen: FEN.pbc4_after_Nc3,
      text: "Now seize the center with d5! This hits the bishop AND the e4 pawn. Double attack!",
    },
    {
      type: 'play-move',
      fen: FEN.pbc4_after_Nc3,
      correctMove: 'd5',
      prompt: "Hit the center with tempo against the bishop!",
      hint: "d5 attacks both the e4 pawn and threatens the Bc4.",
      correctFeedback: "d5! The bishop has to retreat and you have a powerful center. That's what happens when you play Bc4 too early in the Sicilian.",
      wrongFeedback: "Push d5 — attack the center and the bishop.",
      highlightSquares: ['d7', 'd5'],
    },

    // 4.exd5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pbc4_after_exd5,
      text: "4.exd5.",
      autoAdvance: 800,
    },

    // 4...exd5
    {
      type: 'play-move',
      fen: FEN.pbc4_after_exd5,
      correctMove: 'exd5',
      prompt: "Recapture.",
      hint: "Take back with the e-pawn.",
      correctFeedback: "exd5! You have a dominant center pawn on d5. The bishop must retreat.",
      wrongFeedback: "Recapture with exd5.",
      highlightSquares: ['e6', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — Show bishop retreating, Black develops freely
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pbc4_after_exd5_b,
      text: "The bishop has to retreat. Watch how Black takes over.",
    },

    // 5.Bb3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pbc4_after_Bb3,
      text: "5.Bb3 — the bishop retreats to b3, staring at the d5 pawn but completely blocked.",
      autoAdvance: 800,
    },

    // 5...Nf6
    {
      type: 'play-move',
      fen: FEN.pbc4_after_Bb3,
      correctMove: 'Nf6',
      prompt: "Develop freely — you own the center.",
      hint: "Knight to f6 — natural development.",
      correctFeedback: "Nf6! Free development. Black has a beautiful center and White's bishop is stuck watching.",
      wrongFeedback: "Nf6 — develop naturally.",
      highlightSquares: ['g8', 'f6'],
    },

    // 6.d3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pbc4p_after_d3,
      text: "6.d3 — White plays passively. No d4 break possible.",
      autoAdvance: 800,
    },

    // 6...Bd6
    {
      type: 'play-move',
      fen: FEN.pbc4p_after_d3,
      correctMove: 'Bd6',
      prompt: "Develop the bishop actively.",
      hint: "Bishop to d6 — active and controlling space.",
      correctFeedback: "Bd6! Black has full control. Pawns on c5 and d5, pieces developing freely. White's Bc4 plan was a complete waste of time.",
      wrongFeedback: "Bd6 — active development.",
      highlightSquares: ['f8', 'd6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (e6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Recall — punish the Bc4 line.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.pbc4_after_Bc4, text: "2.Bc4?!", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pbc4_after_Bc4, correctMove: 'e6',
      prompt: "Block the diagonal.", hint: "e6.", correctFeedback: "e6!", wrongFeedback: "e6.",
    },
    { type: 'instruction', fen: FEN.pbc4_after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pbc4_after_Nc3, correctMove: 'd5',
      prompt: "Seize the center!", hint: "d5.", correctFeedback: "d5! The bishop retreats in shame.", wrongFeedback: "d5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BRANCH LESSON: The Dragon
// Teaches: 5...g6 6.Be3 Bg7 7.f3 O-O (branches after 5.Nc3)
// Recap: c5, d6, cxd4 (through the Open Sicilian)
// ═══════════════════════════════════════════════════════════

export const SC_DRAGON_1: OpeningLesson = {
  id: 'sc-dragon-1',
  title: 'The Dragon',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c5, d6, cxd4, Nf6 — through Open Sicilian)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time for a different path. After the Open Sicilian, instead of the Najdorf — we play the Dragon!",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 5...g6 6.Be3 Bg7 7.f3 O-O
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Instead of a6 (Najdorf), play g6! This is the Dragon — you fianchetto the bishop on g7 to breathe fire down the long diagonal.",
    },

    // 5...g6
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Enter the Dragon! Prepare the fianchetto.",
      hint: "g6 — make room for the Dragon bishop on g7.",
      correctFeedback: "g6! The Dragon variation. Named after the star pattern the pawns make — and because this bishop BREATHES FIRE.",
      wrongFeedback: "Play g6 to start the Dragon setup.",
      highlightSquares: ['g7', 'g6'],
    },

    // 6.Be3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.dragon_after_Be3,
      text: "6.Be3 — White develops. Standard stuff.",
      autoAdvance: 800,
    },

    // 6...Bg7
    {
      type: 'instruction',
      fen: FEN.dragon_after_Be3,
      text: "Deploy the Dragon Bishop! On g7 it controls the entire a1-h8 diagonal — a monster piece.",
    },
    {
      type: 'play-move',
      fen: FEN.dragon_after_Be3,
      correctMove: 'Bg7',
      prompt: "Unleash the Dragon Bishop!",
      hint: "Bishop to g7 — the long diagonal is yours.",
      correctFeedback: "Bg7! The Dragon Bishop. It stares all the way down to a1, pressuring White's entire queenside.",
      wrongFeedback: "Bishop to g7 — own the long diagonal.",
      highlightSquares: ['f8', 'g7'],
      postMoveArrow: ['g7', 'a1'],
    },

    // 7.f3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.dragon_after_f3,
      text: "7.f3 — White reinforces e4.",
      autoAdvance: 800,
    },

    // 7...O-O
    {
      type: 'play-move',
      fen: FEN.dragon_after_f3,
      correctMove: 'O-O',
      prompt: "Get the king safe!",
      hint: "Castle kingside.",
      correctFeedback: "O-O! Castled and connected. The Dragon setup is complete — bishop on g7, king safe, ready for war.",
      wrongFeedback: "Castle kingside.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 6.Be3 Bg7, White plays 7.Bc4?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.dragon_after_Bg7,
      text: "What if White overcommits the bishop? After 6.Be3 Bg7, imagine White plays 7.Bc4 — it looks active but the bishop is vulnerable.",
    },

    // 7.Bc4? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.d1p_after_Bc4,
      text: "7.Bc4? The bishop comes out too early. It'll become a target for ...d5 later.",
      autoAdvance: 800,
    },

    // 7...O-O
    {
      type: 'play-move',
      fen: FEN.d1p_after_Bc4,
      correctMove: 'O-O',
      prompt: "Castle and prepare to attack the bishop later.",
      hint: "Castle first, then the bishop on c4 becomes a target.",
      correctFeedback: "O-O! Castled safely. The Bc4 will be a target once you play ...d5. Your Dragon bishop dominates the board.",
      wrongFeedback: "Castle — the bishop will regret coming to c4.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (g6, Bg7, O-O)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Recall the Dragon moves.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6',
      prompt: "The Dragon.", hint: "g6.", correctFeedback: "g6!", wrongFeedback: "g6.",
    },
    { type: 'instruction', fen: FEN.dragon_after_Be3, text: "6.Be3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon_after_Be3, correctMove: 'Bg7',
      prompt: "Dragon Bishop.", hint: "Bg7.", correctFeedback: "Bg7!", wrongFeedback: "Bg7.",
    },
    { type: 'instruction', fen: FEN.dragon_after_f3, text: "7.f3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon_after_f3, correctMove: 'O-O',
      prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O — the Dragon is ready.", wrongFeedback: "Castle.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BRANCH LESSON: Dragon Plans
// Teaches: 8.Qd2 Nc6 9.Bc4 Bd7 10.O-O-O Rc8
// Recap: through Dragon setup (g6, Bg7, O-O)
// ═══════════════════════════════════════════════════════════

export const SC_DRAGON_2: OpeningLesson = {
  id: 'sc-dragon-2',
  title: 'Dragon Plans',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (through Dragon castling)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Recap — play the Dragon setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6',
      prompt: "Dragon.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.",
    },
    { type: 'instruction', fen: FEN.dragon_after_Be3, text: "6.Be3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon_after_Be3, correctMove: 'Bg7',
      prompt: "Dragon Bishop.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7.",
    },
    { type: 'instruction', fen: FEN.dragon_after_f3, text: "7.f3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon_after_f3, correctMove: 'O-O',
      prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "Castle.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 8.Qd2 Nc6 9.Bc4 Bd7 10.O-O-O Rc8
    // ═══════════════════════════════════════════

    // 8.Qd2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.dragon2_after_Qd2,
      text: "8.Qd2 — White prepares queenside castling. The Yugoslav Attack is coming!",
      autoAdvance: 800,
    },

    // 8...Nc6
    {
      type: 'instruction',
      fen: FEN.dragon2_after_Qd2,
      text: "Develop Nc6 — challenge the d4 knight and prepare to fight for the c-file.",
    },
    {
      type: 'play-move',
      fen: FEN.dragon2_after_Qd2,
      correctMove: 'Nc6',
      prompt: "Challenge d4 and develop.",
      hint: "Knight to c6 — attack d4.",
      correctFeedback: "Nc6! Challenging the center knight. The Dragon is getting its pieces into the fight.",
      wrongFeedback: "Nc6 — challenge d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // 9.Bc4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.dragon2_after_Bc4,
      text: "9.Bc4 — White develops the bishop actively, eyeing f7.",
      autoAdvance: 800,
    },

    // 9...Bd7
    {
      type: 'instruction',
      fen: FEN.dragon2_after_Bc4,
      text: "Develop Bd7 — connect the rooks and prepare ...Rc8. Quiet but essential.",
    },
    {
      type: 'play-move',
      fen: FEN.dragon2_after_Bc4,
      correctMove: 'Bd7',
      prompt: "Connect the rooks.",
      hint: "Bishop to d7 — prepare Rc8.",
      correctFeedback: "Bd7! Rooks are connected. Now the c-file assault begins.",
      wrongFeedback: "Bd7 — connect the rooks.",
      highlightSquares: ['c8', 'd7'],
    },

    // 10.O-O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.dragon2_after_OOO,
      text: "10.O-O-O — White castles queenside! Opposite-side castling again. Time to own the c-file.",
      autoAdvance: 800,
    },

    // 10...Rc8!
    {
      type: 'play-move',
      fen: FEN.dragon2_after_OOO,
      correctMove: 'Rc8',
      prompt: "The c-file is your weapon!",
      hint: "Rook to c8 — aim it at White's king.",
      correctFeedback: "Rc8! The Dragon's main weapon — the rook on the c-file points directly at White's castled king. Combined with the bishop on g7, you have tremendous pressure.",
      wrongFeedback: "Rc8 — own the c-file!",
      highlightSquares: ['a8', 'c8'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 8.Qd2 Nc6, White plays 9.e5?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.dragon2_after_Nc6,
      text: "What if White pushes too early? After 8.Qd2 Nc6, imagine 9.e5 — looks aggressive but it's premature.",
    },

    // 9.e5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.d2p_after_e5,
      text: "9.e5? Pushing without preparation. The pawn is just a gift.",
      autoAdvance: 800,
    },

    // 9...dxe5!
    {
      type: 'play-move',
      fen: FEN.d2p_after_e5,
      correctMove: 'dxe5',
      prompt: "Free pawn! Take it!",
      hint: "Capture dxe5 — White pushed too early.",
      correctFeedback: "dxe5! Free pawn. White's center is destroyed and your Dragon bishop on g7 is more powerful than ever with the center open.",
      wrongFeedback: "Take the free pawn with dxe5.",
      highlightSquares: ['d6', 'e5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (Nc6, Bd7, Rc8)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.dragon_after_OO,
      text: "Recall the Dragon plans.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.dragon2_after_Qd2, text: "8.Qd2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon2_after_Qd2, correctMove: 'Nc6',
      prompt: "Challenge d4.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.dragon2_after_Bc4, text: "9.Bc4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon2_after_Bc4, correctMove: 'Bd7',
      prompt: "Connect rooks.", hint: "Bd7.", correctFeedback: "Bd7.", wrongFeedback: "Bd7.",
    },
    { type: 'instruction', fen: FEN.dragon2_after_OOO, text: "10.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon2_after_OOO, correctMove: 'Rc8',
      prompt: "C-file!", hint: "Rc8.", correctFeedback: "Rc8! The Dragon is breathing fire.", wrongFeedback: "Rc8.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BRANCH LESSON: The Classical
// Teaches: 4...Nc6 5.Nc3 Nf6 6.Be2 e5
// Recap: c5, d6, cxd4
// ═══════════════════════════════════════════════════════════

export const SC_CLASSICAL_1: OpeningLesson = {
  id: 'sc-classical-1',
  title: 'The Classical',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (c5, d6, cxd4 through Open Sicilian)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Classical Sicilian — a different approach after 4.Nxd4. Both knights come out before striking the center.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: "Sicilian.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: "Solid.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: "Exchange.", hint: "cxd4.", correctFeedback: "cxd4.", wrongFeedback: "cxd4." },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 4.Nxd4 Nc6 5.Nc3 Nf6 6.Be2 e5
    // ═══════════════════════════════════════════

    // 4.Nxd4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "4.Nxd4 — now instead of Nf6 (Najdorf) or g6 (Dragon), try the Classical approach.",
      autoAdvance: 800,
    },

    // 4...Nc6
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "Play Nc6! Develop the knight and directly challenge the d4 knight. Classical and logical.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd4,
      correctMove: 'Nc6',
      prompt: "Challenge d4 directly!",
      hint: "Knight to c6 — hit the d4 knight.",
      correctFeedback: "Nc6! The Classical Sicilian. Your knight fights for d4 control immediately.",
      wrongFeedback: "Nc6 — challenge the knight on d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // 5.Nc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.classical_after_Nc3,
      text: "5.Nc3 — White develops normally.",
      autoAdvance: 800,
    },

    // 5...Nf6
    {
      type: 'instruction',
      fen: FEN.classical_after_Nc3,
      text: "Now play Nf6 — both knights are out, attacking e4 from different angles.",
    },
    {
      type: 'play-move',
      fen: FEN.classical_after_Nc3,
      correctMove: 'Nf6',
      prompt: "Get the second knight out.",
      hint: "Nf6 — attack e4.",
      correctFeedback: "Nf6! Both knights are out and e4 is under double attack. White has to be careful.",
      wrongFeedback: "Nf6 — develop and attack e4.",
      highlightSquares: ['g8', 'f6'],
    },

    // 6.Be2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.classical_after_Be2,
      text: "6.Be2 — White develops modestly.",
      autoAdvance: 800,
    },

    // 6...e5!
    {
      type: 'instruction',
      fen: FEN.classical_after_Be2,
      text: "Strike with e5! The d4 knight is under pressure. If it stays, you'll pile on. If it moves, you control the center.",
    },
    {
      type: 'play-move',
      fen: FEN.classical_after_Be2,
      correctMove: 'e5',
      prompt: "Hit the center! Force the knight to decide.",
      hint: "e5 — attack the d4 knight and grab space.",
      correctFeedback: "e5! The Classical Sicilian at its best. The d4 knight is under pressure and you own the center.",
      wrongFeedback: "Push e5 — challenge d4.",
      highlightSquares: ['e7', 'e5'],
      postMoveArrow: ['e5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — After 4...Nc6, White plays 5.Nxc6?
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.classical_after_Nc6,
      text: "What if White trades the knight? After 4...Nc6, imagine 5.Nxc6 — giving up the centralized knight for free.",
    },

    // 5.Nxc6? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.clp_after_Nxc6,
      text: "5.Nxc6? White trades a centralized knight for a knight that just arrived. Bad deal!",
      autoAdvance: 800,
    },

    // 5...bxc6!
    {
      type: 'play-move',
      fen: FEN.clp_after_Nxc6,
      correctMove: 'bxc6',
      prompt: "Recapture and open the b-file!",
      hint: "Take with the b-pawn — open the b-file for your rook.",
      correctFeedback: "bxc6! You opened the b-file for your rook AND gained central control. White's trade was a gift.",
      wrongFeedback: "Take with bxc6 — open the b-file.",
      highlightSquares: ['b7', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (Nc6, Nf6, e5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "Recall the Classical moves.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nc6',
      prompt: "Classical.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.classical_after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.classical_after_Nc3, correctMove: 'Nf6',
      prompt: "Both knights.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },
    { type: 'instruction', fen: FEN.classical_after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.classical_after_Be2, correctMove: 'e5',
      prompt: "Strike!", hint: "e5.", correctFeedback: "e5! The Classical Sicilian.", wrongFeedback: "e5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// TEST LESSON: Level 1 Test
// Full Najdorf from memory + handle variations
// ═══════════════════════════════════════════════════════════

export const SC_TEST_1: OpeningLesson = {
  id: 'sc-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // PART 1: Full Najdorf main line (12 moves, no hand-holding)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Level 1 Test. Play the full Najdorf from memory. Then handle the variations.",
      buttonText: "BEGIN",
    },

    // Move 1: c5
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'c5',
      prompt: "Your move.", hint: "The Sicilian move.", correctFeedback: "c5.", wrongFeedback: "Start with c5.",
    },

    // Move 2: d6
    { type: 'instruction', fen: FEN.after_Nf3, text: "2.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6',
      prompt: "Your move.", hint: "Solid and flexible.", correctFeedback: "d6.", wrongFeedback: "d6.",
    },

    // Move 3: cxd4
    { type: 'instruction', fen: FEN.after_d4, text: "3.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4',
      prompt: "Your move.", hint: "The exchange.", correctFeedback: "cxd4.", wrongFeedback: "cxd4.",
    },

    // Move 4: Nf6
    { type: 'instruction', fen: FEN.after_Nxd4, text: "4.Nxd4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6',
      prompt: "Your move.", hint: "Attack e4.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },

    // Move 5: a6
    { type: 'instruction', fen: FEN.after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6',
      prompt: "What's the plan?", hint: "The Najdorf signature.", correctFeedback: "a6! The Najdorf.", wrongFeedback: "a6.",
    },

    // Move 6: e5
    { type: 'instruction', fen: FEN.after_Be3, text: "6.Be3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5',
      prompt: "Your move.", hint: "Strike the center.", correctFeedback: "e5!", wrongFeedback: "e5.",
    },

    // Move 7: Be7
    { type: 'instruction', fen: FEN.after_Nb3, text: "7.Nb3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7',
      prompt: "Your move.", hint: "Prepare to castle.", correctFeedback: "Be7.", wrongFeedback: "Be7.",
    },

    // Move 8: O-O
    { type: 'instruction', fen: FEN.after_Qd2, text: "8.Qd2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Qd2, correctMove: 'O-O',
      prompt: "Your move.", hint: "King safety first.", correctFeedback: "O-O.", wrongFeedback: "Castle.",
    },

    // Move 9: b5
    { type: 'instruction', fen: FEN.after_OOO, text: "9.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_OOO, correctMove: 'b5',
      prompt: "Your move.", hint: "Launch the storm.", correctFeedback: "b5! The attack begins.", wrongFeedback: "b5.",
    },

    // Move 10: Bb7
    { type: 'instruction', fen: FEN.after_f3, text: "10.f3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_f3, correctMove: 'Bb7',
      prompt: "Your move.", hint: "Long diagonal.", correctFeedback: "Bb7.", wrongFeedback: "Bb7.",
    },

    // Move 11: Nbd7
    { type: 'instruction', fen: FEN.after_Kb1, text: "11.Kb1.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Kb1, correctMove: 'Nbd7',
      prompt: "Your move.", hint: "Last minor piece.", correctFeedback: "Nbd7.", wrongFeedback: "Nbd7.",
    },

    // Move 12: Rc8
    { type: 'instruction', fen: FEN.after_g4, text: "12.g4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_g4, correctMove: 'Rc8',
      prompt: "Your move.", hint: "The c-file.", correctFeedback: "Rc8! The Najdorf is complete.", wrongFeedback: "Rc8.",
    },

    // ═══════════════════════════════════════════
    // PART 2: Face Qxd4? and punish
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "White tries a different approach. Handle it.",
    },

    // 2.d4 (auto-advance)
    { type: 'instruction', fen: FEN.pqd4_after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pqd4_after_d4, correctMove: 'cxd4',
      prompt: "Your move.", hint: "Take.", correctFeedback: "cxd4.", wrongFeedback: "cxd4.",
    },

    // 3.Qxd4? (auto-advance)
    { type: 'instruction', fen: FEN.pqd4_after_Qxd4, text: "3.Qxd4? Queen grabs the pawn.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pqd4_after_Qxd4, correctMove: 'Nc6',
      prompt: "Punish it.", hint: "Develop with tempo.", correctFeedback: "Nc6! The queen runs.", wrongFeedback: "Nc6 — attack the queen.",
    },

    // 4.Qe3 (auto-advance)
    { type: 'instruction', fen: FEN.pqd4_after_Qe3, text: "4.Qe3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pqd4_after_Qe3, correctMove: 'Nf6',
      prompt: "Keep developing.", hint: "Nf6.", correctFeedback: "Nf6! You're ahead in development.", wrongFeedback: "Nf6.",
    },

    // ═══════════════════════════════════════════
    // PART 3: Face Bc4? and punish
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "One more variation. White plays Bc4 early.",
    },

    // 2.Bc4?! (auto-advance)
    { type: 'instruction', fen: FEN.pbc4_after_Bc4, text: "2.Bc4?!", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pbc4_after_Bc4, correctMove: 'e6',
      prompt: "Block the diagonal.", hint: "e6.", correctFeedback: "e6!", wrongFeedback: "e6.",
    },

    // 3.Nc3 (auto-advance)
    { type: 'instruction', fen: FEN.pbc4_after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pbc4_after_Nc3, correctMove: 'd5',
      prompt: "Seize the center!", hint: "d5.", correctFeedback: "d5! The bishop retreats.", wrongFeedback: "d5.",
    },

    // ═══════════════════════════════════════════
    // PART 4: Dragon — g6, Bg7, O-O
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Now the Dragon. Different path after 5.Nc3.",
    },

    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6',
      prompt: "Enter the Dragon.", hint: "Fianchetto.", correctFeedback: "g6!", wrongFeedback: "g6.",
    },
    { type: 'instruction', fen: FEN.dragon_after_Be3, text: "6.Be3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon_after_Be3, correctMove: 'Bg7',
      prompt: "The Dragon Bishop.", hint: "Bg7.", correctFeedback: "Bg7!", wrongFeedback: "Bg7.",
    },
    { type: 'instruction', fen: FEN.dragon_after_f3, text: "7.f3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.dragon_after_f3, correctMove: 'O-O',
      prompt: "Your move.", hint: "Castle.", correctFeedback: "O-O! Dragon complete.", wrongFeedback: "Castle.",
    },

    // ═══════════════════════════════════════════
    // PART 5: Classical — Nc6, Nf6, e5
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "Final variation. The Classical approach.",
    },

    {
      type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nc6',
      prompt: "Classical.", hint: "Challenge d4.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.classical_after_Nc3, text: "5.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.classical_after_Nc3, correctMove: 'Nf6',
      prompt: "Both knights.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },
    { type: 'instruction', fen: FEN.classical_after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.classical_after_Be2, correctMove: 'e5',
      prompt: "Strike!", hint: "e5.", correctFeedback: "e5! You know the Sicilian Defense. All of it.", wrongFeedback: "e5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

export const SICILIAN_LESSONS: OpeningLesson[] = [
  SC_LESSON_1,
  SC_LESSON_2,
  SC_PUNISH_QD4,
  SC_PUNISH_BC4,
  SC_LESSON_3,
  SC_DRAGON_1,
  SC_LESSON_4,
  SC_DRAGON_2,
  SC_CLASSICAL_1,
  SC_TEST_1,
]

export function getSicilianLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_LESSONS.find(l => l.id === id)
}
