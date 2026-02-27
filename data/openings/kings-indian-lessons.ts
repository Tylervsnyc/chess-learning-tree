import type { OpeningLesson } from '@/types/opening-lesson'

// =====================================================================
// KING'S INDIAN DEFENSE LESSONS (ki-1 through ki-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5
//            7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7 10.f3 f5 11.Be3 f4 12.Bf2 g5
// =====================================================================

const FEN = {
  // Main line positions
  start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6: 'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_c4: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_g6: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  after_Bg7: 'rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
  after_e4: 'rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4',
  after_d6: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5',
  after_Nf3: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5',
  after_OO: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 2 6',
  after_Be2: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ - 3 6',
  after_e5: 'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 7',
  after_OO_w: 'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 1 7',
  after_Nc6: 'r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 2 8',
  after_d5: 'r1bq1rk1/ppp2pbp/2np1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 8',
  after_Ne7: 'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 1 9',
  after_Ne1: 'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N5/PP2BPPP/R1BQNRK1 b - - 2 9',
  after_Nd7: 'r1bq1rk1/pppnnpbp/3p2p1/3Pp3/2P1P3/2N5/PP2BPPP/R1BQNRK1 w - - 3 10',
  after_f3: 'r1bq1rk1/pppnnpbp/3p2p1/3Pp3/2P1P3/2N2P2/PP2B1PP/R1BQNRK1 b - - 0 10',
  after_f5: 'r1bq1rk1/pppnn1bp/3p2p1/3Ppp2/2P1P3/2N2P2/PP2B1PP/R1BQNRK1 w - - 0 11',
  after_Be3: 'r1bq1rk1/pppnn1bp/3p2p1/3Ppp2/2P1P3/2N1BP2/PP2B1PP/R2QNRK1 b - - 1 11',
  after_f4: 'r1bq1rk1/pppnn1bp/3p2p1/3Pp3/2P1Pp2/2N1BP2/PP2B1PP/R2QNRK1 w - - 0 12',
  after_Bf2: 'r1bq1rk1/pppnn1bp/3p2p1/3Pp3/2P1Pp2/2N2P2/PP2BBPP/R2QNRK1 b - - 1 12',
  after_g5: 'r1bq1rk1/pppnn1bp/3p4/3Pp1p1/2P1Pp2/2N2P2/PP2BBPP/R2QNRK1 w - - 0 13',

  // Punish 3.Bg5? line (ki-1 lesson)
  ki1p_after_Bg5: 'rnbqkb1r/pppppp1p/5np1/6B1/2PP4/8/PP2PPPP/RN1QKBNR b KQkq - 1 3',
  ki1p_after_Bg7: 'rnbqk2r/ppppppbp/5np1/6B1/2PP4/8/PP2PPPP/RN1QKBNR w KQkq - 2 4',
  ki1p_after_Nc3: 'rnbqk2r/ppppppbp/5np1/6B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4',
  ki1p_after_d5: 'rnbqk2r/ppp1ppbp/5np1/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 0 5',

  // Punish 5.Bg5? line (ki-2 lesson)
  ki2p_after_Bg5: 'rnbqk2r/ppp1ppbp/3p1np1/6B1/2PPP3/2N5/PP3PPP/R2QKBNR b KQkq - 1 5',
  ki2p_after_h6: 'rnbqk2r/ppp1ppb1/3p1npp/6B1/2PPP3/2N5/PP3PPP/R2QKBNR w KQkq - 0 6',
  ki2p_after_Bh4: 'rnbqk2r/ppp1ppb1/3p1npp/8/2PPP2B/2N5/PP3PPP/R2QKBNR b KQkq - 1 6',
  ki2p_after_g5: 'rnbqk2r/ppp1ppb1/3p1n1p/6p1/2PPP2B/2N5/PP3PPP/R2QKBNR w KQkq - 0 7',
  ki2p_after_Bg3: 'rnbqk2r/ppp1ppb1/3p1n1p/6p1/2PPP3/2N3B1/PP3PPP/R2QKBNR b KQkq - 1 7',
  ki2p_after_Nh5: 'rnbqk2r/ppp1ppb1/3p3p/6pn/2PPP3/2N3B1/PP3PPP/R2QKBNR w KQkq - 2 8',

  // Punish 7.dxe5? line
  ki3p_after_dxe5: 'rnbq1rk1/ppp2pbp/3p1np1/4P3/2P1P3/2N2N2/PP2BPPP/R1BQK2R b KQ - 0 7',
  ki3p_after_dxe5_b: 'rnbq1rk1/ppp2pbp/5np1/4p3/2P1P3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 8',
  ki3p_after_Qxd8: 'rnbQ1rk1/ppp2pbp/5np1/4p3/2P1P3/2N2N2/PP2BPPP/R1B1K2R b KQ - 0 8',
  ki3p_after_Rxd8: 'rnbr2k1/ppp2pbp/5np1/4p3/2P1P3/2N2N2/PP2BPPP/R1B1K2R w KQ - 0 9',

  // Punish 8.Be3? line
  ki4p_after_Be3: 'r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N1BN2/PP2BPPP/R2Q1RK1 b - - 3 8',
  ki4p_after_Ng4: 'r1bq1rk1/ppp2pbp/2np2p1/4p3/2PPP1n1/2N1BN2/PP2BPPP/R2Q1RK1 w - - 4 9',
  ki4p_after_Bc1: 'r1bq1rk1/ppp2pbp/2np2p1/4p3/2PPP1n1/2N2N2/PP2BPPP/R1BQ1RK1 b - - 5 9',
  ki4p_after_f5: 'r1bq1rk1/ppp3bp/2np2p1/4pp2/2PPP1n1/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 10',

  // Samisch line (5.f3)
  sam_after_f3: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2P2/PP4PP/R1BQKBNR b KQkq - 0 5',
  sam_after_OO: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2P2/PP4PP/R1BQKBNR w KQ - 1 6',
  sam_after_Be3: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N1BP2/PP4PP/R2QKBNR b KQ - 2 6',
  sam_after_e5: 'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N1BP2/PP4PP/R2QKBNR w KQ - 0 7',
  sam_after_d5: 'rnbq1rk1/ppp2pbp/3p1np1/3Pp3/2P1P3/2N1BP2/PP4PP/R2QKBNR b KQ - 0 7',
  sam_after_Nh5: 'rnbq1rk1/ppp2pbp/3p2p1/3Pp2n/2P1P3/2N1BP2/PP4PP/R2QKBNR w KQ - 1 8',

  // Samisch punish: 6.Bg5?
  samp_after_Bg5: 'rnbq1rk1/ppp1ppbp/3p1np1/6B1/2PPP3/2N2P2/PP4PP/R2QKBNR b KQ - 2 6',
  samp_after_h6: 'rnbq1rk1/ppp1ppb1/3p1npp/6B1/2PPP3/2N2P2/PP4PP/R2QKBNR w KQ - 0 7',
  samp_after_Bh4: 'rnbq1rk1/ppp1ppb1/3p1npp/8/2PPP2B/2N2P2/PP4PP/R2QKBNR b KQ - 1 7',
  samp_after_g5: 'rnbq1rk1/ppp1ppb1/3p1n1p/6p1/2PPP2B/2N2P2/PP4PP/R2QKBNR w KQ - 0 8',

  // Four Pawns Attack line (5.f4)
  fp_after_f4: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP4PP/R1BQKBNR b KQkq - 0 5',
  fp_after_c5: 'rnbqk2r/pp2ppbp/3p1np1/2p5/2PPPP2/2N5/PP4PP/R1BQKBNR w KQkq - 0 6',
  fp_after_d5_fp: 'rnbqk2r/pp2ppbp/3p1np1/2pP4/2P1PP2/2N5/PP4PP/R1BQKBNR b KQkq - 0 6',
  fp_after_OO_fp: 'rnbq1rk1/pp2ppbp/3p1np1/2pP4/2P1PP2/2N5/PP4PP/R1BQKBNR w KQ - 1 7',

  // Four Pawns punish: 6.dxc5?
  fpp_after_dxc5: 'rnbqk2r/pp2ppbp/3p1np1/2P5/2P1PP2/2N5/PP4PP/R1BQKBNR b KQkq - 0 6',
  fpp_after_Qa5: 'rnb1k2r/pp2ppbp/3p1np1/q1P5/2P1PP2/2N5/PP4PP/R1BQKBNR w KQkq - 1 7',

  // Classical line
  classical_after_Nf3: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5',
  classical_after_OO: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 2 6',
  classical_after_Be2: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ - 3 6',
  classical_after_e5: 'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 7',
  classical_after_OO_w: 'rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 1 7',
  classical_after_Nc6: 'r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 2 8',
}

// =====================================================================
// LESSON 1: The Setup
// Teaches: 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7
// BLACK opening -- user plays Black moves, White auto-advances.
// No recap (first lesson).
// =====================================================================

export const KI_LESSON_1: OpeningLesson = {
  id: 'ki-1',
  title: 'The Setup',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: No recap (first lesson) ===

    // === ACT 2: TEACH (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7) ===

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the King's Indian Defense -- the ultimate counterattacking weapon against 1.d4. You let White build a big center, then blow it up.",
    },

    // 1.d4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "1.d4.",
      autoAdvance: 800,
    },

    // 1...Nf6
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Against 1.d4, start with 1...Nf6 -- flexible and aggressive. You're not showing your hand yet.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Develop your knight -- stay flexible.",
      hint: "Knight to f6 -- attack e4 and keep all options open.",
      correctFeedback: "Nf6! The perfect start. Flexible, aggressive, and ready for anything.",
      wrongFeedback: "Play Nf6 -- develop the knight and control the center.",
      highlightSquares: ['g8', 'f6'],
    },

    // 2.c4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "2.c4 -- White grabs more space. That's fine -- let them overextend.",
      autoAdvance: 800,
    },

    // 2...g6
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "Play g6 -- prepare the fianchetto. Your bishop will be a monster on the long diagonal.",
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: "Prepare the fianchetto.",
      hint: "Push g6 -- make room for your bishop on g7.",
      correctFeedback: "g6! The fianchetto is coming. That bishop will aim straight at White's center.",
      wrongFeedback: "Play g6 -- prepare to fianchetto the bishop.",
      highlightSquares: ['g7', 'g6'],
    },

    // 3.Nc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3 -- White develops naturally.",
      autoAdvance: 800,
    },

    // 3...Bg7
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Complete the fianchetto with Bg7. This bishop is the soul of the King's Indian -- it'll power your kingside attack later.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: "Complete the fianchetto!",
      hint: "Bishop to g7 -- the long diagonal is yours.",
      correctFeedback: "Bg7! The King's Indian setup is complete. That bishop is a beast.",
      wrongFeedback: "Play Bg7 -- fianchetto the bishop onto the long diagonal.",
      highlightSquares: ['f8', 'g7'],
      postMoveArrow: ['g7', 'a1'],
    },

    // === ACT 3: PUNISH -- White plays 3.Bg5? ===

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "What if White tries 3.Bg5 instead of Nc3? They're trying to pin or harass your knight early. You can punish it.",
    },

    // 3.Bg5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ki1p_after_Bg5,
      text: "3.Bg5? This looks aggressive but it's premature -- the bishop can be chased with tempo.",
      autoAdvance: 800,
    },

    // 3...Bg7 (user plays, just develop)
    {
      type: 'play-move',
      fen: FEN.ki1p_after_Bg5,
      correctMove: 'Bg7',
      prompt: "Ignore the bishop. Keep developing!",
      hint: "Bg7 -- finish your setup. The Bg5 isn't threatening anything real.",
      correctFeedback: "Bg7! You don't need to react to everything. The fianchetto is more important.",
      wrongFeedback: "Play Bg7 -- stay on plan, the Bg5 isn't dangerous.",
      highlightSquares: ['f8', 'g7'],
    },

    // 4.Nc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ki1p_after_Nc3,
      text: "4.Nc3 -- White develops.",
      autoAdvance: 800,
    },

    // 4...d5! (user plays, seize the center)
    {
      type: 'play-move',
      fen: FEN.ki1p_after_Nc3,
      correctMove: 'd5',
      prompt: "The center is open -- grab it!",
      hint: "d5! Strike while the iron is hot. White's Bg5 wasn't useful.",
      correctFeedback: "d5! You seized the center immediately. White wasted a move on Bg5 and you punished it. That's the KID spirit.",
      wrongFeedback: "Play d5 -- strike the center while White's bishop is misplaced.",
      highlightSquares: ['d7', 'd5'],
      postMoveArrow: ['d5', 'c4'],
    },

    // === ACT 4: RECALL ===

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three Black moves of the King's Indian setup.",
      buttonText: "LET'S GO",
    },

    // 1.d4
    { type: 'instruction', fen: FEN.after_d4, text: "1.d4.", autoAdvance: 800 },
    // Recall: Nf6
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },
    // 2.c4
    { type: 'instruction', fen: FEN.after_c4, text: "2.c4.", autoAdvance: 800 },
    // Recall: g6
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: "Your move.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
    },
    // 3.Nc3
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    // Recall: Bg7
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
  ],
}

// =====================================================================
// LESSON 2: The Center Fight
// Teaches: 4.e4 d6 5.Nf3 O-O 6.Be2 e5
// Recap from lesson 1, then new moves.
// =====================================================================

export const KI_LESSON_2: OpeningLesson = {
  id: 'ki-2',
  title: 'The Center Fight',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (Nf6, g6, Bg7) ===

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap -- play the King's Indian setup.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: "1.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },
    { type: 'instruction', fen: FEN.after_c4, text: "2.c4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: "Your move.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },

    // === ACT 2: TEACH (4.e4 d6 5.Nf3 O-O 6.Be2 e5) ===

    // 4.e4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "4.e4 -- White builds a massive pawn center. Don't panic. This is exactly what you want.",
      autoAdvance: 800,
    },

    // 4...d6
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Play d6 -- support a future e5 push. You're building pressure, not rushing.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Solid and patient. Support the center.",
      hint: "d6 -- prepare the e5 break.",
      correctFeedback: "d6! Patient and strong. The e5 break is coming.",
      wrongFeedback: "Play d6 -- support your center before striking.",
      highlightSquares: ['d7', 'd6'],
    },

    // 5.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "5.Nf3 -- White develops the knight.",
      autoAdvance: 800,
    },

    // 5...O-O
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Castle! Get your king safe before the fireworks start.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Safety first -- castle kingside.",
      hint: "Castle! O-O.",
      correctFeedback: "Castled! Your king is safe and your rook is ready for action.",
      wrongFeedback: "Castle kingside -- O-O.",
    },

    // 6.Be2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "6.Be2 -- White completes development. Now it's time to strike.",
      autoAdvance: 800,
    },

    // 6...e5!
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "NOW you strike! Play e5 -- challenge White's center head on. This is the whole point of the King's Indian.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "The moment you've been waiting for!",
      hint: "e5! Strike the center!",
      correctFeedback: "e5! BOOM. The center clash is on. This is the King's Indian at its finest.",
      wrongFeedback: "Play e5 -- this is the key King's Indian break.",
      highlightSquares: ['e7', 'e5'],
      postMoveArrow: ['e5', 'd4'],
    },

    // === ACT 3: PUNISH -- 5.Bg5? ===

    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "What if White plays 5.Bg5 instead of Nf3? The pin looks scary, but you can chase it.",
    },

    // 5.Bg5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ki2p_after_Bg5,
      text: "5.Bg5? Pinning the knight -- but it's premature.",
      autoAdvance: 800,
    },

    // 5...h6
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bg5,
      correctMove: 'h6',
      prompt: "Challenge the bishop -- where will it go?",
      hint: "h6 -- kick the bishop.",
      correctFeedback: "h6! The bishop has to move. You're gaining tempo.",
      wrongFeedback: "Play h6 -- challenge the bishop immediately.",
      highlightSquares: ['h7', 'h6'],
    },

    // 6.Bh4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ki2p_after_Bh4,
      text: "6.Bh4 -- the bishop retreats but stays on the diagonal.",
      autoAdvance: 800,
    },

    // 6...g5!
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bh4,
      correctMove: 'g5',
      prompt: "Keep pushing! Chase that bishop further.",
      hint: "g5! Drive the bishop all the way back.",
      correctFeedback: "g5! The bishop is running out of squares. You've gained two tempi and space on the kingside.",
      wrongFeedback: "Play g5 -- push the bishop back and gain more space.",
      highlightSquares: ['g6', 'g5'],
    },

    // === ACT 4: RECALL ===

    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Time to recall. Play d6, O-O, and e5.",
      buttonText: "LET'S GO",
    },

    // 4.e4
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },
    // 5.Nf3
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    // 6.Be2
    { type: 'instruction', fen: FEN.after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },
  ],
}

// =====================================================================
// LESSON: Punish 5.Bg5?
// Teaches: 5.Bg5? h6 6.Bh4 g5 7.Bg3 Nh5
// =====================================================================

export const KI_PUNISH_BG5: OpeningLesson = {
  id: 'ki-punish-bg5',
  title: 'Punish 5.Bg5?',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (d6) ===
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Let's set the scene. White has played 4.e4.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },

    // === ACT 2: TEACH (5.Bg5? h6 6.Bh4 g5 7.Bg3 Nh5) ===

    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Now White makes a mistake -- 5.Bg5? This looks aggressive, pinning your knight, but you can chase it and seize the dark squares.",
    },

    { type: 'instruction', fen: FEN.ki2p_after_Bg5, text: "5.Bg5? -- too early.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.ki2p_after_Bg5,
      text: "Start by asking the bishop a question with h6. Where is it going to go?",
    },
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bg5,
      correctMove: 'h6',
      prompt: "Challenge the bishop!",
      hint: "h6 -- kick it.",
      correctFeedback: "h6! The bishop has to decide.",
      wrongFeedback: "Play h6 -- challenge the bishop's position.",
      highlightSquares: ['h7', 'h6'],
    },

    { type: 'instruction', fen: FEN.ki2p_after_Bh4, text: "6.Bh4 -- it retreats.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.ki2p_after_Bh4,
      text: "Keep pushing! g5 drives the bishop even further back and gains kingside space.",
    },
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bh4,
      correctMove: 'g5',
      prompt: "Chase it again!",
      hint: "g5 -- push the bishop back.",
      correctFeedback: "g5! The bishop is retreating in shame.",
      wrongFeedback: "Play g5 -- keep chasing the bishop.",
      highlightSquares: ['g6', 'g5'],
    },

    { type: 'instruction', fen: FEN.ki2p_after_Bg3, text: "7.Bg3 -- all the way back.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.ki2p_after_Bg3,
      text: "Now the finishing touch -- Nh5! Attack the bishop AND prepare to plant your knight on f4.",
    },
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bg3,
      correctMove: 'Nh5',
      prompt: "The knight leaps in!",
      hint: "Nh5 -- attack the bishop and eye the f4 square.",
      correctFeedback: "Nh5! The knight attacks the bishop and eyes f4. White's Bg5 adventure cost three tempi. That's a brutal punishment.",
      wrongFeedback: "Play Nh5 -- attack the bishop and aim for f4.",
      highlightSquares: ['f6', 'h5'],
      postMoveArrow: ['h5', 'f4'],
    },

    // === ACT 3: RECALL ===

    {
      type: 'instruction',
      fen: FEN.ki2p_after_Bg5,
      text: "Replay the punishment -- h6, g5, Nh5.",
      buttonText: "LET'S GO",
    },

    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bg5,
      correctMove: 'h6',
      prompt: "Your move.",
      hint: "h6.",
      correctFeedback: "h6.",
      wrongFeedback: "h6.",
    },
    { type: 'instruction', fen: FEN.ki2p_after_Bh4, text: "6.Bh4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bh4,
      correctMove: 'g5',
      prompt: "Your move.",
      hint: "g5.",
      correctFeedback: "g5.",
      wrongFeedback: "g5.",
    },
    { type: 'instruction', fen: FEN.ki2p_after_Bg3, text: "7.Bg3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.ki2p_after_Bg3,
      correctMove: 'Nh5',
      prompt: "Your move.",
      hint: "Nh5.",
      correctFeedback: "Nh5.",
      wrongFeedback: "Nh5.",
    },
  ],
}

// =====================================================================
// LESSON: Punish dxe5?
// Teaches: 7.dxe5? dxe5
// =====================================================================

export const KI_PUNISH_DXE5: OpeningLesson = {
  id: 'ki-punish-dxe5',
  title: 'Punish dxe5?',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (e5) ===
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Let's set the scene. After castling, White plays 6.Be2.",
    },
    { type: 'instruction', fen: FEN.after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "Strike the center!",
      hint: "e5.",
      correctFeedback: "e5!",
      wrongFeedback: "e5.",
    },

    // === ACT 2: TEACH (7.dxe5? dxe5) ===

    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White makes a positional mistake -- 7.dxe5? This releases the tension in the center. You want to punish it.",
    },

    { type: 'instruction', fen: FEN.ki3p_after_dxe5, text: "7.dxe5? -- White trades too early.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.ki3p_after_dxe5,
      text: "Recapture with dxe5. Now you have a beautiful pawn on e5 and tons of open lines for your pieces.",
    },
    {
      type: 'play-move',
      fen: FEN.ki3p_after_dxe5,
      correctMove: 'dxe5',
      prompt: "Recapture and enjoy the open position.",
      hint: "dxe5 -- take back and open lines.",
      correctFeedback: "dxe5! Perfect. You have a strong e5 pawn, the d-file is open for your queen, and your Bg7 is now a monster on the diagonal. White released the tension for nothing.",
      wrongFeedback: "Recapture with dxe5.",
      highlightSquares: ['d6', 'e5'],
      postMoveArrow: ['g7', 'a1'],
    },

    // === ACT 3: EXPLOIT THE OPEN FILE ===

    {
      type: 'instruction',
      fen: FEN.ki3p_after_dxe5_b,
      text: "White tries to simplify with Qxd8, trading queens. But this actually helps you.",
    },
    { type: 'instruction', fen: FEN.ki3p_after_Qxd8, text: "8.Qxd8.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.ki3p_after_Qxd8,
      correctMove: 'Rxd8',
      prompt: "Recapture and seize the open file.",
      hint: "Take back with the rook.",
      correctFeedback: "Rxd8! Your rook owns the only open file. White has no counterplay.",
      wrongFeedback: "Recapture with Rxd8.",
    },

    // === ACT 4: QUIZ ===

    {
      type: 'quiz',
      fen: FEN.ki3p_after_dxe5_b,
      question: "Why is 7.dxe5 bad for White in the King's Indian?",
      options: [
        "It wins a pawn for White",
        "It releases the central tension and gives Black free development",
        "It traps Black's bishop",
        "It opens the f-file for White's rook",
      ],
      correctIndex: 1,
      explanation: "White gives up the tension in the center for nothing. Black gets a strong e5 pawn, open lines, and a dominant Bg7. The whole point of the King's Indian is this kind of position.",
    },

    // === ACT 5: RECALL ===

    {
      type: 'instruction',
      fen: FEN.ki3p_after_dxe5,
      text: "Full sequence one more time -- punish the trade.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.ki3p_after_dxe5,
      correctMove: 'dxe5',
      prompt: "Recapture.",
      hint: "dxe5.",
      correctFeedback: "dxe5!",
      wrongFeedback: "dxe5.",
    },
    { type: 'instruction', fen: FEN.ki3p_after_Qxd8, text: "8.Qxd8.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.ki3p_after_Qxd8,
      correctMove: 'Rxd8',
      prompt: "Seize the file.",
      hint: "Rxd8.",
      correctFeedback: "Rxd8! You punished White's premature trade and own the d-file.",
      wrongFeedback: "Rxd8.",
    },
  ],
}

// =====================================================================
// LESSON 3: The Pawn Storm
// Teaches: 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7
// =====================================================================

export const KI_LESSON_3: OpeningLesson = {
  id: 'ki-3',
  title: 'The Pawn Storm',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (d6, O-O, e5) ===

    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Quick recap first.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    { type: 'instruction', fen: FEN.after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },

    // === ACT 2: TEACH (7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7) ===

    // 7.O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "7.O-O -- White castles. The center is locked. Now it's a race -- you attack the kingside, they attack the queenside.",
      autoAdvance: 800,
    },

    // 7...Nc6
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "Develop your knight to c6 -- pressure d4 and get ready to reroute after White pushes d5.",
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "Develop and pressure d4.",
      hint: "Nc6 -- add pressure to d4.",
      correctFeedback: "Nc6! Pressuring d4. White will have to close the center.",
      wrongFeedback: "Play Nc6 -- develop the knight toward the center.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // 8.d5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "8.d5 -- White closes the center. This is normal. Now the board splits: you own the kingside, they own the queenside.",
      autoAdvance: 800,
    },

    // 8...Ne7
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "The knight has to retreat -- but Ne7 is perfect. It reroutes to g6 or f5 for the kingside attack.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: "Reroute the knight.",
      hint: "Ne7 -- head toward the kingside.",
      correctFeedback: "Ne7! Smart retreat. This knight is heading to g6 or f5 to join the kingside attack.",
      wrongFeedback: "Play Ne7 -- the knight reroutes for the kingside.",
      highlightSquares: ['c6', 'e7'],
    },

    // 9.Ne1 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Ne1,
      text: "9.Ne1 -- White reroutes too, heading for d3 to support c5. It's a slow strategic battle.",
      autoAdvance: 800,
    },

    // 9...Nd7
    {
      type: 'instruction',
      fen: FEN.after_Ne1,
      text: "Play Nd7 -- clear the f-file for your f-pawn! The f5 break is the heart of your attack.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Ne1,
      correctMove: 'Nd7',
      prompt: "Clear the way for f5!",
      hint: "Nd7 -- the knight moves so the f-pawn can advance.",
      correctFeedback: "Nd7! The f-file is clear. f5 is coming next and the kingside attack is rolling.",
      wrongFeedback: "Play Nd7 -- clear the f-file for the pawn storm.",
      highlightSquares: ['f6', 'd7'],
      postMoveArrow: ['f7', 'f5'],
    },

    // === ACT 3: PUNISH -- 8.Be3? ===

    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "What if White plays 8.Be3 instead of d5? They leave the center open and you can exploit it.",
    },

    { type: 'instruction', fen: FEN.ki4p_after_Be3, text: "8.Be3? -- a tempo gift.", autoAdvance: 800 },

    {
      type: 'play-move',
      fen: FEN.ki4p_after_Be3,
      correctMove: 'Ng4',
      prompt: "The bishop is on e3 -- jump in!",
      hint: "Ng4! Attack the bishop and force it back.",
      correctFeedback: "Ng4! You attack the bishop immediately. If it retreats, you've gained a tempo and have ideas of f5.",
      wrongFeedback: "Play Ng4 -- attack the Be3 and gain tempo.",
      highlightSquares: ['f6', 'g4'],
      postMoveArrow: ['g4', 'e3'],
    },

    // === ACT 4: RECALL ===

    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Replay the three moves -- Nc6, Ne7, Nd7.",
      buttonText: "LET'S GO",
    },

    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: "Ne7.",
      correctFeedback: "Ne7.",
      wrongFeedback: "Ne7.",
    },
    { type: 'instruction', fen: FEN.after_Ne1, text: "9.Ne1.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ne1,
      correctMove: 'Nd7',
      prompt: "Your move.",
      hint: "Nd7.",
      correctFeedback: "Nd7.",
      wrongFeedback: "Nd7.",
    },
  ],
}

// =====================================================================
// LESSON 4: Launch the Attack
// Teaches: 10.f3 f5 11.Be3 f4 12.Bf2 g5
// =====================================================================

export const KI_LESSON_4: OpeningLesson = {
  id: 'ki-4',
  title: 'Launch the Attack',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (Nc6, Ne7, Nd7) ===

    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Recap time. Get your pieces in position.",
    },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: "Ne7.",
      correctFeedback: "Ne7.",
      wrongFeedback: "Ne7.",
    },
    { type: 'instruction', fen: FEN.after_Ne1, text: "9.Ne1.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ne1,
      correctMove: 'Nd7',
      prompt: "Your move.",
      hint: "Nd7.",
      correctFeedback: "Nd7.",
      wrongFeedback: "Nd7.",
    },

    // === ACT 2: TEACH (10.f3 f5 11.Be3 f4 12.Bf2 g5) ===

    // 10.f3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: "10.f3 -- White supports e4. Now it's time to launch your attack!",
      autoAdvance: 800,
    },

    // 10...f5!
    {
      type: 'instruction',
      fen: FEN.after_f3,
      text: "f5! This is THE King's Indian move. You're crashing through on the kingside. The pawn storm begins.",
    },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'f5',
      prompt: "Launch the storm!",
      hint: "f5 -- this is what the King's Indian is all about.",
      correctFeedback: "f5!! The attack has begun. White's king is in danger.",
      wrongFeedback: "Play f5 -- start the kingside pawn storm.",
      highlightSquares: ['f7', 'f5'],
      postMoveArrow: ['f5', 'f4'],
    },

    // 11.Be3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "11.Be3 -- White develops the bishop to support the center.",
      autoAdvance: 800,
    },

    // 11...f4!
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "Push f4! Kick the bishop and gain more space. Your pawns are steamrolling forward.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'f4',
      prompt: "Keep pushing -- kick the bishop!",
      hint: "f4 -- gain space and attack.",
      correctFeedback: "f4! The bishop has to move and your kingside pawns are rolling. This is textbook King's Indian.",
      wrongFeedback: "Play f4 -- push the bishop back and advance your attack.",
      highlightSquares: ['f5', 'f4'],
    },

    // 12.Bf2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Bf2,
      text: "12.Bf2 -- the bishop retreats. Now finish the storm.",
      autoAdvance: 800,
    },

    // 12...g5!
    {
      type: 'instruction',
      fen: FEN.after_Bf2,
      text: "g5! The final wave of the pawn storm. The g-pawn joins the attack, preparing g4 to rip open the kingside.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bf2,
      correctMove: 'g5',
      prompt: "The final wave!",
      hint: "g5 -- bring every pawn into the attack.",
      correctFeedback: "g5!! The full King's Indian pawn storm! f4 and g5 are crashing into White's kingside. g4 is coming next, opening lines to White's king. This is the dream position.",
      wrongFeedback: "Play g5 -- complete the pawn storm.",
      highlightSquares: ['g6', 'g5'],
      postMoveArrow: ['g5', 'g4'],
    },

    // === ACT 3: QUIZ ===

    {
      type: 'quiz',
      fen: FEN.after_g5,
      question: "What is Black's main plan in the King's Indian after d5 closes the center?",
      options: [
        "Trade all the pieces and head for an endgame",
        "Attack on the queenside with a5 and b5",
        "Launch a kingside pawn storm with f5, f4, and g5",
        "Wait for White to make a mistake",
      ],
      correctIndex: 2,
      explanation: "In the King's Indian, when White closes the center with d5, it becomes a race. Black attacks on the kingside with f5-f4-g5, while White pushes on the queenside with c5. Your job is to checkmate first!",
    },

    // === ACT 4: RECALL ===

    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "One last time -- f5, f4, g5. The storm!",
      buttonText: "LET'S GO",
    },

    { type: 'instruction', fen: FEN.after_f3, text: "10.f3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'f5',
      prompt: "Your move.",
      hint: "f5.",
      correctFeedback: "f5!",
      wrongFeedback: "f5.",
    },
    { type: 'instruction', fen: FEN.after_Be3, text: "11.Be3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'f4',
      prompt: "Your move.",
      hint: "f4.",
      correctFeedback: "f4!",
      wrongFeedback: "f4.",
    },
    { type: 'instruction', fen: FEN.after_Bf2, text: "12.Bf2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bf2,
      correctMove: 'g5',
      prompt: "Your move.",
      hint: "g5.",
      correctFeedback: "g5! The storm is complete.",
      wrongFeedback: "g5.",
    },
  ],
}

// =====================================================================
// LESSON: The Classical
// Teaches: 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6
// (Classical variation -- standard development by White)
// =====================================================================

export const KI_CLASSICAL_1: OpeningLesson = {
  id: 'ki-classical-1',
  title: 'The Classical',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (d6) ===
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The Classical is the most common setup. Let's learn the standard development.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },

    // === ACT 2: TEACH (5.Nf3 O-O 6.Be2 e5 7.O-O Nc6) ===

    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3 -- the Classical move. White develops the knight naturally.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Castle immediately. Your king is safe on g8, and the rook activates on f8.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Get your king safe!",
      hint: "O-O -- castle kingside.",
      correctFeedback: "Castled! King safe, rook active. The King's Indian formula.",
      wrongFeedback: "Castle -- O-O.",
    },

    { type: 'instruction', fen: FEN.after_Be2, text: "6.Be2 -- White prepares to castle.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "Now e5! Challenge the center immediately. This is the key break in the King's Indian.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "Strike the center!",
      hint: "e5 -- the key King's Indian break.",
      correctFeedback: "e5! The center clash. This is where the game really starts.",
      wrongFeedback: "Play e5 -- challenge White's center.",
      highlightSquares: ['e7', 'e5'],
    },

    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O -- White castles too.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "Develop your knight to c6. Pressure d4 and prepare the rerouting after d5.",
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "Develop and pressure d4!",
      hint: "Nc6 -- develop toward the center.",
      correctFeedback: "Nc6! You're fully developed with a solid position. The Classical King's Indian -- ready for battle.",
      wrongFeedback: "Play Nc6 -- develop the knight.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // === ACT 3: RECALL ===

    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Recall time. Play O-O, e5, Nc6.",
      buttonText: "LET'S GO",
    },

    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    { type: 'instruction', fen: FEN.after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
  ],
}

// =====================================================================
// LESSON: Four Pawns Attack
// Teaches: 5.f4 c5 6.d5 O-O
// =====================================================================

export const KI_FOUR_PAWNS_1: OpeningLesson = {
  id: 'ki-four-pawns-1',
  title: 'Four Pawns Attack',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (d6) ===
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Sometimes White goes all-in with the Four Pawns Attack. Don't panic.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },

    // === ACT 2: TEACH (5.f4 c5 6.d5 O-O) ===

    {
      type: 'instruction',
      fen: FEN.fp_after_f4,
      text: "5.f4?! The Four Pawns Attack. White has pawns on c4, d4, e4, and f4 -- a massive center. But it's overextended.",
    },

    {
      type: 'instruction',
      fen: FEN.fp_after_f4,
      text: "Strike back with c5! Attack the base of White's pawn chain. If those pawns crack, the whole center collapses.",
    },
    {
      type: 'play-move',
      fen: FEN.fp_after_f4,
      correctMove: 'c5',
      prompt: "Attack the pawn chain!",
      hint: "c5 -- strike the base of White's center.",
      correctFeedback: "c5! Perfect counter. You're attacking the d4 pawn, the foundation of White's massive center.",
      wrongFeedback: "Play c5 -- attack the base of the pawn chain.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    { type: 'instruction', fen: FEN.fp_after_d5_fp, text: "6.d5 -- White advances to hold the center.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.fp_after_d5_fp,
      text: "Castle! Get safe and prepare to undermine the center with e6 or b5 later.",
    },
    {
      type: 'play-move',
      fen: FEN.fp_after_d5_fp,
      correctMove: 'O-O',
      prompt: "Castle and prepare the counter.",
      hint: "O-O -- king safety first.",
      correctFeedback: "Castled! Your king is safe. Now you can chip away at White's center with e6 or b5 -- those four pawns aren't as scary as they look.",
      wrongFeedback: "Castle -- O-O.",
    },

    // === ACT 3: PUNISH -- 6.dxc5? ===

    {
      type: 'instruction',
      fen: FEN.fp_after_c5,
      text: "What if White captures 6.dxc5 instead of d5? That's a mistake -- you win the pawn back with interest.",
    },

    { type: 'instruction', fen: FEN.fpp_after_dxc5, text: "6.dxc5? -- greedy.", autoAdvance: 800 },

    {
      type: 'play-move',
      fen: FEN.fpp_after_dxc5,
      correctMove: 'Qa5',
      prompt: "Win the pawn back with a fork!",
      hint: "Qa5 -- pin the c5 pawn and attack.",
      correctFeedback: "Qa5! The queen attacks c5 and pins it against the Nc3. White can't hold the extra pawn. The Four Pawns Attack crumbled.",
      wrongFeedback: "Play Qa5 -- fork the pawn and the knight.",
      highlightSquares: ['d8', 'a5'],
      postMoveArrow: ['a5', 'c5'],
    },

    // === ACT 4: RECALL ===

    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Replay -- c5 and O-O.",
      buttonText: "LET'S GO",
    },

    { type: 'instruction', fen: FEN.fp_after_f4, text: "5.f4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fp_after_f4,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.fp_after_d5_fp, text: "6.d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fp_after_d5_fp,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
  ],
}

// =====================================================================
// LESSON: The Samisch
// Teaches: 5.f3 O-O 6.Be3 e5 7.d5 Nh5
// =====================================================================

export const KI_SAMISCH_1: OpeningLesson = {
  id: 'ki-samisch-1',
  title: 'The Samisch',
  defaultOrientation: 'black',
  steps: [

    // === ACT 1: RECAP (d6) ===
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The Samisch is White's aggressive attempt to control e4 with pawns. You know what to do.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },

    // === ACT 2: TEACH (5.f3 O-O 6.Be3 e5 7.d5 Nh5) ===

    {
      type: 'instruction',
      fen: FEN.sam_after_f3,
      text: "5.f3 -- the Samisch Variation. White bolsters e4 with pawns instead of knights. It's slow but solid.",
    },

    {
      type: 'instruction',
      fen: FEN.sam_after_f3,
      text: "Castle first. The king is safe on g8, and you'll need the rook on f8.",
    },
    {
      type: 'play-move',
      fen: FEN.sam_after_f3,
      correctMove: 'O-O',
      prompt: "Castle!",
      hint: "O-O -- get safe first.",
      correctFeedback: "Castled! Now prepare the center break.",
      wrongFeedback: "Castle -- O-O.",
    },

    { type: 'instruction', fen: FEN.sam_after_Be3, text: "6.Be3 -- White develops the bishop.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.sam_after_Be3,
      text: "e5! Same plan as always -- challenge the center. The King's Indian playbook works against the Samisch too.",
    },
    {
      type: 'play-move',
      fen: FEN.sam_after_Be3,
      correctMove: 'e5',
      prompt: "Strike the center!",
      hint: "e5 -- the same King's Indian break.",
      correctFeedback: "e5! You know the drill. Challenge the center, prepare the kingside storm.",
      wrongFeedback: "Play e5 -- the key central break.",
      highlightSquares: ['e7', 'e5'],
    },

    { type: 'instruction', fen: FEN.sam_after_d5, text: "7.d5 -- White closes the center.", autoAdvance: 800 },

    {
      type: 'instruction',
      fen: FEN.sam_after_d5,
      text: "Nh5! A key idea in the Samisch. The knight goes to h5 aiming for f4, where it's a monster. White's f3 pawn means the knight can't be kicked by g4.",
    },
    {
      type: 'play-move',
      fen: FEN.sam_after_d5,
      correctMove: 'Nh5',
      prompt: "The knight eyes f4!",
      hint: "Nh5 -- head for the f4 outpost.",
      correctFeedback: "Nh5! The knight is heading to f4 where it's untouchable. White played f3 to support e4, but it also created a permanent weakness on f4. Beautiful.",
      wrongFeedback: "Play Nh5 -- aim for the f4 outpost.",
      highlightSquares: ['f6', 'h5'],
      postMoveArrow: ['h5', 'f4'],
    },

    // === ACT 3: PUNISH -- 6.Bg5? ===

    {
      type: 'instruction',
      fen: FEN.sam_after_OO,
      text: "What if White plays 6.Bg5 instead of Be3? Same punishment as before -- chase it!",
    },

    { type: 'instruction', fen: FEN.samp_after_Bg5, text: "6.Bg5? -- you know what to do.", autoAdvance: 800 },

    {
      type: 'play-move',
      fen: FEN.samp_after_Bg5,
      correctMove: 'h6',
      prompt: "Challenge the bishop!",
      hint: "h6 -- kick it.",
      correctFeedback: "h6! Chase the bishop. Same pattern -- h6, then g5.",
      wrongFeedback: "Play h6 -- challenge the bishop.",
      highlightSquares: ['h7', 'h6'],
    },

    // === ACT 4: RECALL ===

    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Recall -- O-O, e5, Nh5.",
      buttonText: "LET'S GO",
    },

    { type: 'instruction', fen: FEN.sam_after_f3, text: "5.f3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.sam_after_f3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    { type: 'instruction', fen: FEN.sam_after_Be3, text: "6.Be3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.sam_after_Be3,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },
    { type: 'instruction', fen: FEN.sam_after_d5, text: "7.d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.sam_after_d5,
      correctMove: 'Nh5',
      prompt: "Your move.",
      hint: "Nh5.",
      correctFeedback: "Nh5.",
      wrongFeedback: "Nh5.",
    },
  ],
}

// =====================================================================
// LEVEL TEST: Play through the full main line
// =====================================================================

export const KI_TEST_1: OpeningLesson = {
  id: 'ki-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Prove you know the King's Indian. Play the full main line -- no hints this time.",
      buttonText: "BEGIN TEST",
    },

    // 1.d4
    { type: 'instruction', fen: FEN.after_d4, text: "1.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },
    // 2.c4
    { type: 'instruction', fen: FEN.after_c4, text: "2.c4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'g6',
      prompt: "Your move.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
    },
    // 3.Nc3
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
    // 4.e4
    { type: 'instruction', fen: FEN.after_e4, text: "4.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },
    // 5.Nf3
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    // 6.Be2
    { type: 'instruction', fen: FEN.after_Be2, text: "6.Be2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },
    // 7.O-O
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
    // 8.d5
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: "Ne7.",
      correctFeedback: "Ne7.",
      wrongFeedback: "Ne7.",
    },
    // 9.Ne1
    { type: 'instruction', fen: FEN.after_Ne1, text: "9.Ne1.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ne1,
      correctMove: 'Nd7',
      prompt: "Your move.",
      hint: "Nd7.",
      correctFeedback: "Nd7.",
      wrongFeedback: "Nd7.",
    },
    // 10.f3
    { type: 'instruction', fen: FEN.after_f3, text: "10.f3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_f3,
      correctMove: 'f5',
      prompt: "Your move.",
      hint: "f5.",
      correctFeedback: "f5.",
      wrongFeedback: "f5.",
    },
    // 11.Be3
    { type: 'instruction', fen: FEN.after_Be3, text: "11.Be3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'f4',
      prompt: "Your move.",
      hint: "f4.",
      correctFeedback: "f4.",
      wrongFeedback: "f4.",
    },
    // 12.Bf2
    { type: 'instruction', fen: FEN.after_Bf2, text: "12.Bf2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bf2,
      correctMove: 'g5',
      prompt: "Your move.",
      hint: "g5.",
      correctFeedback: "g5! Perfect. You know the King's Indian inside and out.",
      wrongFeedback: "g5.",
    },
  ],
}

// =====================================================================
// LOOKUP
// =====================================================================

const KINGS_INDIAN_LESSONS: Record<string, OpeningLesson> = {
  'ki-1': KI_LESSON_1,
  'ki-2': KI_LESSON_2,
  'ki-punish-bg5': KI_PUNISH_BG5,
  'ki-punish-dxe5': KI_PUNISH_DXE5,
  'ki-3': KI_LESSON_3,
  'ki-4': KI_LESSON_4,
  'ki-classical-1': KI_CLASSICAL_1,
  'ki-four-pawns-1': KI_FOUR_PAWNS_1,
  'ki-samisch-1': KI_SAMISCH_1,
  'ki-test-1': KI_TEST_1,
}

export function getKingsIndianLesson(id: string): OpeningLesson | undefined {
  return KINGS_INDIAN_LESSONS[id]
}
