import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// ITALIAN GAME LESSONS (it-1 through it-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4
//            6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:   'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:   'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bc4:   'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',

  // Giuoco Piano: 3...Bc5 4.c3 Nf6 5.d4
  gp_after_Bc5: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  gp_after_c3:  'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4',
  gp_after_Nf6: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5',
  gp_after_d4:  'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 5',

  // Center Fork: 5...exd4 6.cxd4 Bb4+ 7.Bd2
  cf_after_exd4: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6',
  cf_after_cxd4: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6',
  cf_after_Bb4:  'r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7',
  cf_after_Bd2:  'r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP1B1PPP/RN1QK2R b KQkq - 2 7',

  // The Attack: 7...Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O
  att_after_Bxd2: 'r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1b1PPP/RN1QK2R w KQkq - 0 8',
  att_after_Nbxd2:'r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R b KQkq - 0 8',
  att_after_d5:   'r1bqk2r/ppp2ppp/2n2n2/3p4/2BPP3/5N2/PP1N1PPP/R2QK2R w KQkq - 0 9',
  att_after_exd5: 'r1bqk2r/ppp2ppp/2n2n2/3P4/2BP4/5N2/PP1N1PPP/R2QK2R b KQkq - 0 9',
  att_after_Nxd5: 'r1bqk2r/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2QK2R w KQkq - 0 10',
  att_after_OO:   'r1bqk2r/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2Q1RK1 b kq - 1 10',

  // Punish f6: 1.e4 e5 2.Nf3 f6?? 3.Nxe5! fxe5 4.Qh5+ g6 5.Qxe5+
  pf_after_f6:   'rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  pf_after_Nxe5: 'rnbqkbnr/pppp2pp/5p2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  pf_after_fxe5: 'rnbqkbnr/pppp2pp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
  pf_after_Qh5:  'rnbqkbnr/pppp2pp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KB1R b KQkq - 1 4',
  pf_after_g6:   'rnbqkbnr/pppp3p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KB1R w KQkq - 0 5',
  pf_after_Qxe5: 'rnbqkbnr/pppp3p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KB1R b KQkq - 0 5',
  pf_after_Qe7:  'rnb1kbnr/ppppq2p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KB1R w KQkq - 1 6',
  pf_after_Qxh8: 'rnb1kbnQ/ppppq2p/6p1/8/4P3/8/PPPP1PPP/RNB1KB1R b KQq - 0 6',

  // Fried Liver: 3...Nf6 4.Ng5 d5 5.exd5 Nxd5?? 6.Nxf7!
  fl_after_Nf6:  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  fl_after_Ng5:  'r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4',
  fl_after_d5:   'r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  fl_after_exd5: 'r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5',
  fl_after_Nxd5: 'r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6',
  fl_after_Nxf7: 'r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 6',

  // Fried Liver Cont: 6...Kxf7 7.Qf3+ Ke6 8.Nc3
  fl2_after_Kxf7: 'r1bq1b1r/ppp2kpp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R w KQ - 0 7',
  fl2_after_Qf3:  'r1bq1b1r/ppp2kpp/2n5/3np3/2B5/5Q2/PPPP1PPP/RNB1K2R b KQ - 1 7',
  fl2_after_Ke6:  'r1bq1b1r/ppp3pp/2n1k3/3np3/2B5/5Q2/PPPP1PPP/RNB1K2R w KQ - 2 8',
  fl2_after_Nc3:  'r1bq1b1r/ppp3pp/2n1k3/3np3/2B5/2N2Q2/PPPP1PPP/R1B1K2R b KQ - 3 8',

  // Evans Gambit: 3...Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4
  eg_after_b4:   'r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4',
  eg_after_Bxb4: 'r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 0 5',
  eg_after_c3:   'r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2R b KQkq - 0 5',
  eg_after_Ba5:  'r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq - 1 6',
  eg_after_d4:   'r1bqk1nr/pppp1ppp/2n5/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2R b KQkq - 0 6',

  // Two Knights: 3...Nf6 4.d4 exd4 5.O-O
  tk_after_d4:   'r1bqkb1r/pppp1ppp/2n2n2/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
  tk_after_exd4: 'r1bqkb1r/pppp1ppp/2n2n2/8/2BpP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  tk_after_OO:   'r1bqkb1r/pppp1ppp/2n2n2/8/2BpP3/5N2/PPP2PPP/RNBQ1RK1 b kq - 1 5',

  // ─── PUNISH POSITIONS ───

  // it-1 punish: After 3.Bc4, Black plays 3...d6? (slow) → 4.d4! exd4 5.Nxd4
  p1_after_d6:   'r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  p1_after_d4:   'r1bqkbnr/ppp2ppp/2np4/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
  p1_after_exd4: 'r1bqkbnr/ppp2ppp/2np4/8/2BpP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  p1_after_Nxd4: 'r1bqkbnr/ppp2ppp/2np4/8/2BNP3/8/PPP2PPP/RNBQK2R b KQkq - 0 5',

  // it-2 punish: After 4.c3, Black plays 4...d6? → 5.d4 exd4 6.cxd4
  p2_after_d6:   'r1bqk1nr/ppp2ppp/2np4/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 5',
  p2_after_d4:   'r1bqk1nr/ppp2ppp/2np4/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 5',
  p2_after_exd4: 'r1bqk1nr/ppp2ppp/2np4/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6',
  p2_after_cxd4: 'r1bqk1nr/ppp2ppp/2np4/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6',

  // it-3 punish: After 6.cxd4, Black plays 6...d5? → 7.exd5 Nxd5 8.O-O
  p3_after_d5:   'r1bqk2r/ppp2ppp/2n2n2/2bp4/2BPP3/5N2/PP3PPP/RNBQK2R w KQkq - 0 7',
  p3_after_exd5: 'r1bqk2r/ppp2ppp/2n2n2/2bP4/2BP4/5N2/PP3PPP/RNBQK2R b KQkq - 0 7',
  p3_after_Nxd5: 'r1bqk2r/ppp2ppp/2n5/2bn4/2BP4/5N2/PP3PPP/RNBQK2R w KQkq - 0 8',
  p3_after_OO:   'r1bqk2r/ppp2ppp/2n5/2bn4/2BP4/5N2/PP3PPP/RNBQ1RK1 b kq - 1 8',

  // it-4 punish: After 8.Nbxd2, Black plays 8...O-O? → 9.e5!
  p4_after_OO:   'r1bq1rk1/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R w KQ - 1 9',
  p4_after_e5:   'r1bq1rk1/pppp1ppp/2n2n2/4P3/2BP4/5N2/PP1N1PPP/R2QK2R b KQ - 0 9',

  // Evans punish: After 5.c3, Black plays 5...Bc5? → 6.d4 exd4 7.cxd4
  ep_after_Bc5:  'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq - 1 6',
  ep_after_d4:   'r1bqk1nr/pppp1ppp/2n5/2b1p3/2BPP3/2P2N2/P4PPP/RNBQK2R b KQkq - 0 6',
  ep_after_exd4: 'r1bqk1nr/pppp1ppp/2n5/2b5/2BpP3/2P2N2/P4PPP/RNBQK2R w KQkq - 0 7',
  ep_after_cxd4: 'r1bqk1nr/pppp1ppp/2n5/2b5/2BPP3/5N2/P4PPP/RNBQK2R b KQkq - 0 7',

  // Two Knights punish: After 5.O-O, Black plays 5...Bc5? → 6.Nxd4!
  tkp_after_Bc5:  'r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/5N2/PPP2PPP/RNBQ1RK1 w kq - 2 6',
  tkp_after_Nxd4: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BNP3/8/PPP2PPP/RNBQ1RK1 b kq - 0 6',

  // Fried-1 punish: After 5.exd5, Black plays 5...Na5? → 6.Bb5+ c6 7.dxc6
  fp_after_Na5:  'r1bqkb1r/ppp2ppp/5n2/n2Pp1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 1 6',
  fp_after_Bb5:  'r1bqkb1r/ppp2ppp/5n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R b KQkq - 2 6',
  fp_after_c6:   'r1bqkb1r/pp3ppp/2p2n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R w KQkq - 0 7',
  fp_after_dxc6: 'r1bqkb1r/pp3ppp/2P2n2/nB2p1N1/8/8/PPPP1PPP/RNBQK2R b KQkq - 0 7',

  // Fried-2 punish: After 8.Nc3, Black plays 8...Nce7? → 9.d4!
  fp2_after_Nce7: 'r1bq1b1r/ppp1n1pp/4k3/3np3/2B5/2N2Q2/PPPP1PPP/R1B1K2R w KQ - 4 9',
  fp2_after_d4:   'r1bq1b1r/ppp1n1pp/4k3/3np3/2BP4/2N2Q2/PPP2PPP/R1B1K2R b KQ - 0 9',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Italian Setup
// Teaches: 1.e4 e5 2.Nf3 Nc6 3.Bc4
// WHITE opening — user plays White moves, Black auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const IT_LESSON_1: OpeningLesson = {
  id: 'it-1',
  title: 'The Italian Setup',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: No recap (first lesson of the opening)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1.e4 e5 2.Nf3 Nc6 3.Bc4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Italian Game — one of the oldest and most aggressive openings in chess. You'll develop your pieces fast and aim right at Black's weakest point: f7.",
    },

    // --- Move 1: e4 ---
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Grab the center with a pawn!',
      hint: 'Push the e-pawn two squares forward.',
      correctFeedback: "e4 — your pawn controls d5 and f5. The center is yours.",
      wrongFeedback: "We want a pawn in the center — try the e-pawn.",
      highlightSquares: ['e2', 'e4'],
    },

    // --- 1...e5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "1...e5 — Black mirrors you. Both sides have a pawn in the center.",
      autoAdvance: 800,
    },

    // --- Move 2: Nf3 ---
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Now develop your knight and attack Black's e5 pawn at the same time. That's efficiency.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop a piece that attacks the center.",
      hint: "Your knight can go to f3, where it attacks the e5 pawn.",
      correctFeedback: "Nf3! Developing and attacking — the knight eyes e5 and d4.",
      wrongFeedback: "Develop your knight to f3 — it attacks the e5 pawn.",
      highlightSquares: ['g1', 'f3'],
      postMoveArrow: ['f3', 'e5'],
    },

    // --- 2...Nc6 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "2...Nc6 — Black defends the e5 pawn with the knight.",
      autoAdvance: 800,
    },

    // --- Move 3: Bc4 ---
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Now for the key Italian move. Put your bishop on c4, aiming straight at f7 — the weakest point in Black's position.",
      highlightSquares: ['f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: "Target Black's f7 weakness!",
      hint: "Put your bishop on c4 — it looks right at f7.",
      correctFeedback: "Bc4! The Italian Bishop. It stares down f7, the only square defended only by Black's king.",
      wrongFeedback: "Place your bishop on c4 to aim at f7.",
      highlightSquares: ['f1', 'c4'],
      postMoveArrow: ['c4', 'f7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — Black plays 3...d6? (too passive)
    // After 3.Bc4, Black plays 3...d6 instead of developing.
    // White punishes with 4.d4! blowing open the center.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Black makes a mistake here. Instead of developing a piece, they play 3...d6 — passive and slow. Can you punish it?",
    },

    // 3...d6? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p1_after_d6,
      text: "3...d6? It defends e5, but Black's not developing any pieces.",
      autoAdvance: 800,
    },

    // 4.d4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.p1_after_d6,
      correctMove: 'd4',
      prompt: "Black is behind in development. Strike the center!",
      hint: "Push d4 — challenge their pawn while you're ahead in development.",
      correctFeedback: "d4! You're cracking open the center while Black hasn't developed a single piece. That's the punishment for being passive.",
      wrongFeedback: "Push d4 — open the center while you're ahead in development.",
      highlightSquares: ['d2', 'd4'],
    },

    // 4...exd4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p1_after_exd4,
      text: "4...exd4.",
      autoAdvance: 800,
    },

    // 5.Nxd4 (user recaptures)
    {
      type: 'play-move',
      fen: FEN.p1_after_exd4,
      correctMove: 'Nxd4',
      prompt: "Recapture!",
      hint: "Take back with the knight.",
      correctFeedback: "Nxd4! You have a knight in the center, your bishop eyes f7, and Black has nothing developed. Huge lead.",
      wrongFeedback: "Recapture on d4 with the knight.",
      highlightSquares: ['f3', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (user replays White moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three White moves of the Italian setup.",
      buttonText: "LET'S GO",
    },

    // Recall: 1.e4
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Your move.",
      hint: "e4.",
      correctFeedback: "e4.",
      wrongFeedback: "e4.",
    },
    // 1...e5
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "1...e5.",
      autoAdvance: 800,
    },
    // Recall: 2.Nf3
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Your move.",
      hint: "Nf3.",
      correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.",
    },
    // 2...Nc6
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "2...Nc6.",
      autoAdvance: 800,
    },
    // Recall: 3.Bc4
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: "Your move.",
      hint: "Bc4.",
      correctFeedback: "Bc4.",
      wrongFeedback: "Bc4.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: Giuoco Piano
// Teaches: 3...Bc5 4.c3 Nf6 5.d4
// Recap: 1.e4 e5 2.Nf3 Nc6 3.Bc4
// ═══════════════════════════════════════════════════════════

export const IT_LESSON_2: OpeningLesson = {
  id: 'it-2',
  title: 'Giuoco Piano',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 e5 2.Nf3 Nc6 3.Bc4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the Italian setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Control the center.",
      hint: "The e-pawn.",
      correctFeedback: "e4.",
      wrongFeedback: "Start with e4.",
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop and attack.",
      hint: "Knight to f3.",
      correctFeedback: "Nf3.",
      wrongFeedback: "Knight to f3.",
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: "The Italian Bishop.",
      hint: "Target f7.",
      correctFeedback: "Bc4.",
      wrongFeedback: "Bishop to c4.",
      highlightSquares: ['f1', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...Bc5 4.c3 Nf6 5.d4)
    // ═══════════════════════════════════════════

    // 3...Bc5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.gp_after_Bc5,
      text: "3...Bc5 — Black mirrors your bishop development. This is the Giuoco Piano — 'the quiet game.' But it won't stay quiet for long.",
      autoAdvance: 800,
    },

    // 4.c3
    {
      type: 'instruction',
      fen: FEN.gp_after_Bc5,
      text: "Play c3 — a subtle but powerful move. It prepares d4, which will blow the center wide open.",
    },
    {
      type: 'play-move',
      fen: FEN.gp_after_Bc5,
      correctMove: 'c3',
      prompt: "Prepare the d4 push!",
      hint: "c3 supports d4 — it's coming next.",
      correctFeedback: "c3! Looks quiet, but d4 is coming. Black needs to be careful.",
      wrongFeedback: "Play c3 to prepare the powerful d4 push.",
      highlightSquares: ['c2', 'c3'],
    },

    // 4...Nf6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.gp_after_Nf6,
      text: "4...Nf6 — Black develops the knight, attacking your e4 pawn.",
      autoAdvance: 800,
    },

    // 5.d4
    {
      type: 'instruction',
      fen: FEN.gp_after_Nf6,
      text: "Now it's time. Push d4! Your c3 pawn supports it, and you're challenging Black's entire center.",
    },
    {
      type: 'play-move',
      fen: FEN.gp_after_Nf6,
      correctMove: 'd4',
      prompt: "Blow the center open!",
      hint: "Push d4 — your c3 pawn backs it up.",
      correctFeedback: "d4! The center clash. Black has to deal with your two pawns controlling the middle.",
      wrongFeedback: "Push d4 — the whole point of c3.",
      highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — Black plays 4...d6? (too slow)
    // After 4.c3, Black plays 4...d6 instead of Nf6.
    // White gets a dream center with d4.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.gp_after_c3,
      text: "Black makes a mistake — instead of developing, they play 4...d6. Too slow!",
    },
    // 4...d6? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p2_after_d6,
      text: "4...d6? Passive. No new pieces, no pressure.",
      autoAdvance: 800,
    },
    // 5.d4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.p2_after_d6,
      correctMove: 'd4',
      prompt: "They're not developing — seize the center!",
      hint: "d4 attacks the bishop and opens everything up.",
      correctFeedback: "d4! Your pawns dominate the center. Black's bishop on c5 is in trouble and they're behind in development.",
      wrongFeedback: "Push d4 — punish the slow play.",
      highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (user replays White moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Play the two new White moves from this lesson.",
      buttonText: "LET'S GO",
    },
    // 3...Bc5
    { type: 'instruction', fen: FEN.gp_after_Bc5, text: "3...Bc5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.gp_after_Bc5,
      correctMove: 'c3',
      prompt: "Your move.",
      hint: "c3.",
      correctFeedback: "c3.",
      wrongFeedback: "c3.",
    },
    // 4...Nf6
    { type: 'instruction', fen: FEN.gp_after_Nf6, text: "4...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.gp_after_Nf6,
      correctMove: 'd4',
      prompt: "Your move.",
      hint: "d4.",
      correctFeedback: "d4.",
      wrongFeedback: "d4.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Punishing f6
// Teaches: 2...f6?? 3.Nxe5! fxe5 4.Qh5+ g6 5.Qxe5+
// Recap: 1.e4 e5 2.Nf3
// ═══════════════════════════════════════════════════════════

export const IT_PUNISH_F6: OpeningLesson = {
  id: 'it-punish-f6',
  title: 'Punishing f6',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 e5 2.Nf3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the first two moves.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Center pawn.",
      hint: "e4.",
      correctFeedback: "e4.",
      wrongFeedback: "e4.",
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop and attack.",
      hint: "Knight to f3.",
      correctFeedback: "Nf3.",
      wrongFeedback: "Knight to f3.",
      highlightSquares: ['g1', 'f3'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 2...f6?? is a terrible defense
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Now, beginners sometimes defend e5 with 2...f6. It looks natural — but it's a huge blunder. Let's see why.",
    },

    // 2...f6?? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pf_after_f6,
      text: "2...f6?? Looks like it defends e5, but it weakens the king badly.",
      autoAdvance: 800,
    },

    // 3.Nxe5! (user plays the sacrifice)
    {
      type: 'play-move',
      fen: FEN.pf_after_f6,
      correctMove: 'Nxe5',
      prompt: "Sacrifice the knight! Trust the process.",
      hint: "Take the pawn on e5 — even though it looks like giving away your knight.",
      correctFeedback: "Nxe5! A knight sacrifice. Black can take back, but watch what happens...",
      wrongFeedback: "Capture on e5 with the knight — the sacrifice works!",
      highlightSquares: ['f3', 'e5'],
    },

    // 3...fxe5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pf_after_fxe5,
      text: "3...fxe5. Black takes the knight. But now the f-file is wide open...",
      autoAdvance: 800,
    },

    // 4.Qh5+ (user plays the check)
    {
      type: 'play-move',
      fen: FEN.pf_after_fxe5,
      correctMove: 'Qh5+',
      prompt: "Check! The king is exposed.",
      hint: "Queen to h5 — it's check!",
      correctFeedback: "Qh5+! Check! The king has nowhere safe to go.",
      wrongFeedback: "Queen to h5 gives check — the f-file is open.",
      highlightSquares: ['d1', 'h5'],
    },

    // 4...g6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pf_after_g6,
      text: "4...g6 — forced. The only way to block the check.",
      autoAdvance: 800,
    },

    // 5.Qxe5+ (user takes the pawn with check)
    {
      type: 'play-move',
      fen: FEN.pf_after_g6,
      correctMove: 'Qxe5+',
      prompt: "Take the pawn — still check!",
      hint: "Queen takes e5 with check.",
      correctFeedback: "Qxe5+! You won a pawn back with check, and the rook on h8 is next. You gave up a knight (3 points) but you're winning the rook (5 points).",
      wrongFeedback: "Take on e5 with the queen — it's check!",
      highlightSquares: ['h5', 'e5'],
    },

    {
      type: 'instruction',
      fen: FEN.pf_after_Qxe5,
      text: "Black's position is destroyed. The rook on h8 will fall, and you're winning big. That's why 2...f6 is a disaster.",
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pf_after_f6,
      text: "Run it back. When Black plays f6, find the punishment.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.pf_after_f6,
      correctMove: 'Nxe5',
      prompt: "Your move.",
      hint: "Nxe5.",
      correctFeedback: "Nxe5.",
      wrongFeedback: "Nxe5.",
    },
    { type: 'instruction', fen: FEN.pf_after_fxe5, text: "3...fxe5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.pf_after_fxe5,
      correctMove: 'Qh5+',
      prompt: "Your move.",
      hint: "Qh5+.",
      correctFeedback: "Qh5+.",
      wrongFeedback: "Qh5+.",
    },
    { type: 'instruction', fen: FEN.pf_after_g6, text: "4...g6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.pf_after_g6,
      correctMove: 'Qxe5+',
      prompt: "Your move.",
      hint: "Qxe5+.",
      correctFeedback: "Qxe5+.",
      wrongFeedback: "Qxe5+.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: The Fried Liver Attack
// Teaches: 3...Nf6 4.Ng5 d5 5.exd5 Nxd5?? 6.Nxf7!
// Recap: 1.e4 e5 2.Nf3 Nc6 3.Bc4
// ═══════════════════════════════════════════════════════════

export const IT_FRIED_1: OpeningLesson = {
  id: 'it-fried-1',
  title: 'The Fried Liver',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 e5 2.Nf3 Nc6 3.Bc4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap the Italian setup, then we'll learn the Fried Liver — the most famous attack in chess.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Center.",
      hint: "e4.",
      correctFeedback: "e4.",
      wrongFeedback: "e4.",
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop.",
      hint: "Knight to f3.",
      correctFeedback: "Nf3.",
      wrongFeedback: "Knight to f3.",
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: "The Italian Bishop.",
      hint: "Aim at f7.",
      correctFeedback: "Bc4.",
      wrongFeedback: "Bishop to c4.",
      highlightSquares: ['f1', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7!)
    // ═══════════════════════════════════════════

    // 3...Nf6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fl_after_Nf6,
      text: "3...Nf6 — Black develops the knight, attacking your e4 pawn. Time for the Fried Liver!",
      autoAdvance: 800,
    },

    // 4.Ng5!
    {
      type: 'instruction',
      fen: FEN.fl_after_Nf6,
      text: "Play Ng5! The knight attacks f7 alongside your bishop. It's aggressive, but if Black doesn't know the theory, they're in trouble.",
      highlightSquares: ['f7'],
    },
    {
      type: 'play-move',
      fen: FEN.fl_after_Nf6,
      correctMove: 'Ng5',
      prompt: "Double attack on f7!",
      hint: "Knight to g5 — it teams up with the bishop targeting f7.",
      correctFeedback: "Ng5! Two pieces aim at f7. Black must react carefully.",
      wrongFeedback: "Knight to g5 attacks f7 together with the bishop.",
      highlightSquares: ['f3', 'g5'],
    },

    // 4...d5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fl_after_d5,
      text: "4...d5 — the best defense, blocking the bishop. But the drama isn't over.",
      autoAdvance: 800,
    },

    // 5.exd5
    {
      type: 'play-move',
      fen: FEN.fl_after_d5,
      correctMove: 'exd5',
      prompt: "Capture the d-pawn!",
      hint: "Take on d5 with the e-pawn.",
      correctFeedback: "exd5! Now Black has to decide how to recapture. If they play Nxd5, the Fried Liver is on!",
      wrongFeedback: "Capture on d5 with the pawn.",
      highlightSquares: ['e4', 'd5'],
    },

    // 5...Nxd5?? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fl_after_Nxd5,
      text: "5...Nxd5?? A huge mistake! This removes the knight from defending f7. Time to strike!",
      autoAdvance: 800,
    },

    // 6.Nxf7!! (user plays the legendary sacrifice)
    {
      type: 'play-move',
      fen: FEN.fl_after_Nxd5,
      correctMove: 'Nxf7',
      prompt: "THE Fried Liver sacrifice! Take f7!",
      hint: "Knight takes f7 — a legendary sacrifice against the king.",
      correctFeedback: "Nxf7!! The Fried Liver Attack! You sacrifice a knight, but the Black king is completely exposed. The attack is devastating.",
      wrongFeedback: "Take on f7 with the knight — the most famous sacrifice in chess!",
      highlightSquares: ['g5', 'f7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 5...Na5? (wrong recapture)
    // After 5.exd5, Black plays Na5? instead of Nxd5.
    // White punishes with 6.Bb5+ c6 7.dxc6.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.fl_after_exd5,
      text: "Sometimes Black tries 5...Na5 instead, attacking your bishop. But they've made a mistake — can you punish it?",
    },
    // 5...Na5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fp_after_Na5,
      text: "5...Na5? The knight chases the bishop, but leaves Black vulnerable to a check.",
      autoAdvance: 800,
    },
    // 6.Bb5+! (user punishes)
    {
      type: 'play-move',
      fen: FEN.fp_after_Na5,
      correctMove: 'Bb5+',
      prompt: "Find the check!",
      hint: "Your bishop can give check on b5.",
      correctFeedback: "Bb5+! Check! Black has to block with c6, and then your d-pawn eats it with a discovered attack.",
      wrongFeedback: "Bishop to b5 is check!",
      highlightSquares: ['c4', 'b5'],
    },
    // 6...c6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fp_after_c6,
      text: "6...c6 — forced to block.",
      autoAdvance: 800,
    },
    // 7.dxc6! (user plays)
    {
      type: 'play-move',
      fen: FEN.fp_after_c6,
      correctMove: 'dxc6',
      prompt: "Capture and wreck their pawn structure.",
      hint: "Your d5 pawn takes on c6.",
      correctFeedback: "dxc6! You've shattered Black's pawns and are threatening to take on b7. The Na5 is stranded on the edge.",
      wrongFeedback: "Take on c6 with the pawn.",
      highlightSquares: ['d5', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Play the Fried Liver from memory.",
      buttonText: "LET'S GO",
    },
    // 3...Nf6
    { type: 'instruction', fen: FEN.fl_after_Nf6, text: "3...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fl_after_Nf6,
      correctMove: 'Ng5',
      prompt: "Your move.",
      hint: "Ng5.",
      correctFeedback: "Ng5.",
      wrongFeedback: "Ng5.",
    },
    // 4...d5
    { type: 'instruction', fen: FEN.fl_after_d5, text: "4...d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fl_after_d5,
      correctMove: 'exd5',
      prompt: "Your move.",
      hint: "exd5.",
      correctFeedback: "exd5.",
      wrongFeedback: "exd5.",
    },
    // 5...Nxd5??
    { type: 'instruction', fen: FEN.fl_after_Nxd5, text: "5...Nxd5??", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fl_after_Nxd5,
      correctMove: 'Nxf7',
      prompt: "Your move.",
      hint: "Nxf7.",
      correctFeedback: "Nxf7.",
      wrongFeedback: "Nxf7.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 5: The Center Fork
// Teaches: 5...exd4 6.cxd4 Bb4+ 7.Bd2
// Recap: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4
// ═══════════════════════════════════════════════════════════

export const IT_LESSON_3: OpeningLesson = {
  id: 'it-3',
  title: 'The Center Fork',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap the Giuoco Piano moves.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'e4',
      prompt: "Center.", hint: "e4.", correctFeedback: "e4.",
      wrongFeedback: "e4.", highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.", highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4',
      prompt: "Italian Bishop.", hint: "Bc4.", correctFeedback: "Bc4.",
      wrongFeedback: "Bc4.", highlightSquares: ['f1', 'c4'],
    },
    { type: 'instruction', fen: FEN.gp_after_Bc5, text: "3...Bc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Bc5, correctMove: 'c3',
      prompt: "Prepare d4.", hint: "c3.", correctFeedback: "c3.",
      wrongFeedback: "c3.", highlightSquares: ['c2', 'c3'],
    },
    { type: 'instruction', fen: FEN.gp_after_Nf6, text: "4...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Nf6, correctMove: 'd4',
      prompt: "Open the center.", hint: "d4.", correctFeedback: "d4.",
      wrongFeedback: "d4.", highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (5...exd4 6.cxd4 Bb4+ 7.Bd2)
    // ═══════════════════════════════════════════

    // 5...exd4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.cf_after_exd4,
      text: "5...exd4 — Black captures. Don't take with the knight — take with the c-pawn to build a big center.",
      autoAdvance: 800,
    },

    // 6.cxd4
    {
      type: 'play-move',
      fen: FEN.cf_after_exd4,
      correctMove: 'cxd4',
      prompt: "Recapture with the c-pawn!",
      hint: "Take back with the c-pawn, not the knight. You want two pawns in the center.",
      correctFeedback: "cxd4! Two pawns side-by-side on d4 and e4. That's a powerful center.",
      wrongFeedback: "Take with the c-pawn — c takes d4.",
      highlightSquares: ['c3', 'd4'],
    },

    // 6...Bb4+ (auto-advance)
    {
      type: 'instruction',
      fen: FEN.cf_after_Bb4,
      text: "6...Bb4+ — Check! Black checks you, but don't worry. This is expected.",
      autoAdvance: 800,
    },

    // 7.Bd2
    {
      type: 'instruction',
      fen: FEN.cf_after_Bb4,
      text: "Block with the bishop. It's calm and efficient — you'll develop the knight to a great square after Black trades.",
    },
    {
      type: 'play-move',
      fen: FEN.cf_after_Bb4,
      correctMove: 'Bd2',
      prompt: "Block the check!",
      hint: "Develop the bishop to d2 — it blocks the check and develops a piece.",
      correctFeedback: "Bd2! The check is handled, and your center stands strong. If Black trades bishops, your b1 knight gets to develop via d2.",
      wrongFeedback: "Bishop to d2 blocks the check.",
      highlightSquares: ['c1', 'd2'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 6...d5? (premature center counter)
    // After 6.cxd4, Black plays d5? 7.exd5 Nxd5 8.O-O — White castles with tempo
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.cf_after_cxd4,
      text: "Instead of Bb4+, sometimes Black tries 6...d5? — a premature center counter. Let's punish it.",
    },
    // 6...d5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p3_after_d5,
      text: "6...d5? Looks aggressive, but it opens lines for YOUR pieces, not theirs.",
      autoAdvance: 800,
    },
    // 7.exd5 (user captures)
    {
      type: 'play-move',
      fen: FEN.p3_after_d5,
      correctMove: 'exd5',
      prompt: "Take the pawn — open the position!",
      hint: "Capture on d5. You'll get a huge center.",
      correctFeedback: "exd5! You're opening the e-file and your bishop still has the diagonal. Black's in trouble.",
      wrongFeedback: "Take on d5 with the pawn.",
      highlightSquares: ['e4', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.gp_after_d4,
      text: "Play the new moves from this lesson.",
      buttonText: "LET'S GO",
    },
    // 5...exd4
    { type: 'instruction', fen: FEN.cf_after_exd4, text: "5...exd4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.cf_after_exd4,
      correctMove: 'cxd4',
      prompt: "Your move.",
      hint: "cxd4.",
      correctFeedback: "cxd4.",
      wrongFeedback: "cxd4.",
    },
    // 6...Bb4+
    { type: 'instruction', fen: FEN.cf_after_Bb4, text: "6...Bb4+.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.cf_after_Bb4,
      correctMove: 'Bd2',
      prompt: "Your move.",
      hint: "Bd2.",
      correctFeedback: "Bd2.",
      wrongFeedback: "Bd2.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 6: Two Knights
// Teaches: 3...Nf6 4.d4 exd4 5.O-O
// Recap: 1.e4 e5 2.Nf3 Nc6 3.Bc4
// ═══════════════════════════════════════════════════════════

export const IT_TWO_KNIGHTS: OpeningLesson = {
  id: 'it-two-knights',
  title: 'Two Knights',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 e5 2.Nf3 Nc6 3.Bc4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap, then we'll learn an aggressive gambit line.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'e4',
      prompt: "Center.", hint: "e4.", correctFeedback: "e4.",
      wrongFeedback: "e4.", highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.", highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4',
      prompt: "The Italian Bishop.", hint: "Bc4.", correctFeedback: "Bc4.",
      wrongFeedback: "Bc4.", highlightSquares: ['f1', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...Nf6 4.d4 exd4 5.O-O)
    // ═══════════════════════════════════════════

    // 3...Nf6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fl_after_Nf6,
      text: "3...Nf6 — Black develops the knight. Instead of the Fried Liver (Ng5), you can play a gambit: 4.d4!",
      autoAdvance: 800,
    },

    // 4.d4
    {
      type: 'instruction',
      fen: FEN.fl_after_Nf6,
      text: "Push d4 immediately! You're offering a pawn, but you'll castle quickly and have a huge lead in development.",
    },
    {
      type: 'play-move',
      fen: FEN.fl_after_Nf6,
      correctMove: 'd4',
      prompt: "Blow open the center!",
      hint: "d4 — a pawn sacrifice for rapid development.",
      correctFeedback: "d4! If Black captures, you'll castle and have a massive lead in development.",
      wrongFeedback: "Push d4 — sacrifice for development.",
      highlightSquares: ['d2', 'd4'],
    },

    // 4...exd4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tk_after_exd4,
      text: "4...exd4. Black takes the pawn. Now castle — get your king safe and activate the rook.",
      autoAdvance: 800,
    },

    // 5.O-O
    {
      type: 'play-move',
      fen: FEN.tk_after_exd4,
      correctMove: 'O-O',
      prompt: "Castle! Speed over material.",
      hint: "Castle kingside — your rook opens on the e-file.",
      correctFeedback: "O-O! You're a pawn down but fully developed. Your rook is on the open e-file, and Black hasn't castled yet. This is the Two Knights gambit.",
      wrongFeedback: "Castle kingside to develop quickly.",
      highlightSquares: ['e1', 'g1'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 5...Bc5? (slow development)
    // After 5.O-O, Black plays Bc5? instead of keeping the extra pawn.
    // White plays 6.Nxd4! winning back the pawn with tempo.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.tk_after_OO,
      text: "Black sometimes plays 5...Bc5 here, thinking they're developing. But they forgot about the d4 pawn!",
    },
    // 5...Bc5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tkp_after_Bc5,
      text: "5...Bc5? Black develops but the d4 pawn is just hanging now.",
      autoAdvance: 800,
    },
    // 6.Nxd4! (user wins back pawn)
    {
      type: 'play-move',
      fen: FEN.tkp_after_Bc5,
      correctMove: 'Nxd4',
      prompt: "Take back the pawn!",
      hint: "The knight can capture on d4 — the pawn is unprotected.",
      correctFeedback: "Nxd4! Material is equal again, but your knight sits beautifully in the center while you're fully castled. A dream position.",
      wrongFeedback: "Knight takes d4.",
      highlightSquares: ['f3', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Play the Two Knights gambit from memory.",
      buttonText: "LET'S GO",
    },
    // 3...Nf6
    { type: 'instruction', fen: FEN.fl_after_Nf6, text: "3...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_Nf6, correctMove: 'd4',
      prompt: "Your move.", hint: "d4.",
      correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    // 4...exd4
    { type: 'instruction', fen: FEN.tk_after_exd4, text: "4...exd4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.tk_after_exd4, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.",
      correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 7: Fried Liver Continuation
// Teaches: 6...Kxf7 7.Qf3+ Ke6 8.Nc3
// Recap: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7
// ═══════════════════════════════════════════════════════════

export const IT_FRIED_2: OpeningLesson = {
  id: 'it-fried-2',
  title: 'Fried Liver Cont.',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (full Fried Liver setup)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap the Fried Liver attack, then we'll continue the assault.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'e4',
      prompt: "Center.", hint: "e4.", correctFeedback: "e4.",
      wrongFeedback: "e4.", highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.", highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4',
      prompt: "Italian Bishop.", hint: "Bc4.", correctFeedback: "Bc4.",
      wrongFeedback: "Bc4.", highlightSquares: ['f1', 'c4'],
    },
    { type: 'instruction', fen: FEN.fl_after_Nf6, text: "3...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_Nf6, correctMove: 'Ng5',
      prompt: "Attack f7.", hint: "Ng5.", correctFeedback: "Ng5.",
      wrongFeedback: "Ng5.", highlightSquares: ['f3', 'g5'],
    },
    { type: 'instruction', fen: FEN.fl_after_d5, text: "4...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_d5, correctMove: 'exd5',
      prompt: "Capture.", hint: "exd5.", correctFeedback: "exd5.",
      wrongFeedback: "exd5.", highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.fl_after_Nxd5, text: "5...Nxd5??", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_Nxd5, correctMove: 'Nxf7',
      prompt: "The sacrifice!", hint: "Nxf7.", correctFeedback: "Nxf7!!",
      wrongFeedback: "Nxf7.", highlightSquares: ['g5', 'f7'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (6...Kxf7 7.Qf3+ Ke6 8.Nc3)
    // ═══════════════════════════════════════════

    // 6...Kxf7 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fl2_after_Kxf7,
      text: "6...Kxf7 — the king is forced to take. Now the real attack begins.",
      autoAdvance: 800,
    },

    // 7.Qf3+
    {
      type: 'instruction',
      fen: FEN.fl2_after_Kxf7,
      text: "Queen to f3 with check! You're threatening Qxd5 and the king has to keep walking forward.",
    },
    {
      type: 'play-move',
      fen: FEN.fl2_after_Kxf7,
      correctMove: 'Qf3+',
      prompt: "Check the exposed king!",
      hint: "Queen to f3 gives check and threatens the d5 knight.",
      correctFeedback: "Qf3+! Check, and threatening Qxd5. Black's king has to step forward into danger.",
      wrongFeedback: "Queen to f3 — check!",
      highlightSquares: ['d1', 'f3'],
    },

    // 7...Ke6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fl2_after_Ke6,
      text: "7...Ke6 — the king walks to e6! It looks bizarre, but it's the only way to protect the knight on d5.",
      autoAdvance: 800,
    },

    // 8.Nc3
    {
      type: 'instruction',
      fen: FEN.fl2_after_Ke6,
      text: "Develop with Nc3! Attack the d5 knight and bring more pieces into the game. The king on e6 is a sitting duck.",
    },
    {
      type: 'play-move',
      fen: FEN.fl2_after_Ke6,
      correctMove: 'Nc3',
      prompt: "Develop and attack the knight!",
      hint: "Knight to c3 — it attacks d5 and develops another piece.",
      correctFeedback: "Nc3! Every piece aims at the exposed king. White is down a knight but the attack is crushing.",
      wrongFeedback: "Knight to c3 develops with a threat.",
      highlightSquares: ['b1', 'c3'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 8...Nce7? 9.d4!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.fl2_after_Nc3,
      text: "Black tries to protect with 8...Nce7, retreating the knight. But d4 blows everything open!",
    },
    // 8...Nce7? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fp2_after_Nce7,
      text: "8...Nce7? The knight retreats, but the center is ready to explode.",
      autoAdvance: 800,
    },
    // 9.d4! (user plays)
    {
      type: 'play-move',
      fen: FEN.fp2_after_Nce7,
      correctMove: 'd4',
      prompt: "Open the center against the exposed king!",
      hint: "Push d4 — the king on e6 hates open lines.",
      correctFeedback: "d4! Tearing open the center with the king on e6 is devastating. White has a crushing attack.",
      wrongFeedback: "d4 opens everything against the exposed king.",
      highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.fl_after_Nxf7,
      text: "Play the continuation from memory.",
      buttonText: "LET'S GO",
    },
    // 6...Kxf7
    { type: 'instruction', fen: FEN.fl2_after_Kxf7, text: "6...Kxf7.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl2_after_Kxf7, correctMove: 'Qf3+',
      prompt: "Your move.", hint: "Qf3+.",
      correctFeedback: "Qf3+.", wrongFeedback: "Qf3+.",
    },
    // 7...Ke6
    { type: 'instruction', fen: FEN.fl2_after_Ke6, text: "7...Ke6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl2_after_Ke6, correctMove: 'Nc3',
      prompt: "Your move.", hint: "Nc3.",
      correctFeedback: "Nc3.", wrongFeedback: "Nc3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 8: The Attack
// Teaches: 7...Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O
// Recap: full Giuoco Piano through 7.Bd2
// ═══════════════════════════════════════════════════════════

export const IT_LESSON_4: OpeningLesson = {
  id: 'it-4',
  title: 'The Attack',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (through 7.Bd2)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Full recap through the Center Fork, then new moves.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'e4',
      prompt: "Center.", hint: "e4.", correctFeedback: "e4.",
      wrongFeedback: "e4.", highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.", highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4',
      prompt: "Italian.", hint: "Bc4.", correctFeedback: "Bc4.",
      wrongFeedback: "Bc4.", highlightSquares: ['f1', 'c4'],
    },
    { type: 'instruction', fen: FEN.gp_after_Bc5, text: "3...Bc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Bc5, correctMove: 'c3',
      prompt: "Prepare d4.", hint: "c3.", correctFeedback: "c3.",
      wrongFeedback: "c3.", highlightSquares: ['c2', 'c3'],
    },
    { type: 'instruction', fen: FEN.gp_after_Nf6, text: "4...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Nf6, correctMove: 'd4',
      prompt: "Open up.", hint: "d4.", correctFeedback: "d4.",
      wrongFeedback: "d4.", highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.cf_after_exd4, text: "5...exd4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.cf_after_exd4, correctMove: 'cxd4',
      prompt: "Big center.", hint: "c takes.", correctFeedback: "cxd4.",
      wrongFeedback: "cxd4.", highlightSquares: ['c3', 'd4'],
    },
    { type: 'instruction', fen: FEN.cf_after_Bb4, text: "6...Bb4+.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.cf_after_Bb4, correctMove: 'Bd2',
      prompt: "Block.", hint: "Bd2.", correctFeedback: "Bd2.",
      wrongFeedback: "Bd2.", highlightSquares: ['c1', 'd2'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (7...Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O)
    // ═══════════════════════════════════════════

    // 7...Bxd2+ (auto-advance)
    {
      type: 'instruction',
      fen: FEN.att_after_Bxd2,
      text: "7...Bxd2+ — Black trades bishops. Good for us — it opens the b1 knight's path to d2.",
      autoAdvance: 800,
    },

    // 8.Nbxd2
    {
      type: 'play-move',
      fen: FEN.att_after_Bxd2,
      correctMove: 'Nbxd2',
      prompt: "Recapture with the b-knight!",
      hint: "Take with the b1 knight — it develops to a great central square.",
      correctFeedback: "Nbxd2! Your knight is centralized and you're ready to castle. Excellent development.",
      wrongFeedback: "Recapture with the b-knight (Nbxd2).",
      highlightSquares: ['b1', 'd2'],
    },

    // 8...d5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.att_after_d5,
      text: "8...d5 — Black challenges your center. Take it and castle.",
      autoAdvance: 800,
    },

    // 9.exd5
    {
      type: 'play-move',
      fen: FEN.att_after_d5,
      correctMove: 'exd5',
      prompt: "Capture!",
      hint: "Take on d5.",
      correctFeedback: "exd5! Opening the e-file for your future rook.",
      wrongFeedback: "Pawn takes d5.",
      highlightSquares: ['e4', 'd5'],
    },

    // 9...Nxd5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.att_after_Nxd5,
      text: "9...Nxd5. Now castle — your king is safe and the rook activates on f1.",
      autoAdvance: 800,
    },

    // 10.O-O
    {
      type: 'play-move',
      fen: FEN.att_after_Nxd5,
      correctMove: 'O-O',
      prompt: "Castle! Complete the development.",
      hint: "Castle kingside.",
      correctFeedback: "O-O! You're fully developed with a strong d4 pawn. Black's knight on d5 looks big, but your pieces are active. This is a great position for White.",
      wrongFeedback: "Castle!",
      highlightSquares: ['e1', 'g1'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 8...O-O? 9.e5!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.att_after_Nbxd2,
      text: "Sometimes Black castles instead of playing d5. Let's punish the slow approach.",
    },
    // 8...O-O? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p4_after_OO,
      text: "8...O-O? Black castles but hasn't challenged the center. Time to push!",
      autoAdvance: 800,
    },
    // 9.e5! (user pushes)
    {
      type: 'play-move',
      fen: FEN.p4_after_OO,
      correctMove: 'e5',
      prompt: "Push the e-pawn! Attack the knight.",
      hint: "e5 kicks the knight and grabs space.",
      correctFeedback: "e5! The knight on f6 is attacked, and you have a massive space advantage. Your pawns on d4 and e5 control everything.",
      wrongFeedback: "Push e5 — attack the knight and grab space.",
      highlightSquares: ['e4', 'e5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.cf_after_Bd2,
      text: "Play the new moves from this lesson.",
      buttonText: "LET'S GO",
    },
    // 7...Bxd2+
    { type: 'instruction', fen: FEN.att_after_Bxd2, text: "7...Bxd2+.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.att_after_Bxd2, correctMove: 'Nbxd2',
      prompt: "Your move.", hint: "Nbxd2.",
      correctFeedback: "Nbxd2.", wrongFeedback: "Nbxd2.",
    },
    // 8...d5
    { type: 'instruction', fen: FEN.att_after_d5, text: "8...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.att_after_d5, correctMove: 'exd5',
      prompt: "Your move.", hint: "exd5.",
      correctFeedback: "exd5.", wrongFeedback: "exd5.",
    },
    // 9...Nxd5
    { type: 'instruction', fen: FEN.att_after_Nxd5, text: "9...Nxd5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.att_after_Nxd5, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.",
      correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 9: Evans Gambit
// Teaches: 3...Bc5 4.b4!? Bxb4 5.c3 Ba5 6.d4
// Recap: 1.e4 e5 2.Nf3 Nc6 3.Bc4
// ═══════════════════════════════════════════════════════════

export const IT_EVANS_1: OpeningLesson = {
  id: 'it-evans-1',
  title: 'Evans Gambit',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 e5 2.Nf3 Nc6 3.Bc4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap the Italian, then learn the Evans Gambit — a romantic pawn sacrifice.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'e4',
      prompt: "Center.", hint: "e4.", correctFeedback: "e4.",
      wrongFeedback: "e4.", highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.", highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4',
      prompt: "Italian.", hint: "Bc4.", correctFeedback: "Bc4.",
      wrongFeedback: "Bc4.", highlightSquares: ['f1', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4)
    // ═══════════════════════════════════════════

    // 3...Bc5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.gp_after_Bc5,
      text: "3...Bc5 — the Giuoco Piano position. But instead of c3, you're going to play a gambit!",
      autoAdvance: 800,
    },

    // 4.b4!?
    {
      type: 'instruction',
      fen: FEN.gp_after_Bc5,
      text: "Play b4! The Evans Gambit — you sacrifice a pawn to deflect Black's bishop and seize the center with c3 + d4.",
    },
    {
      type: 'play-move',
      fen: FEN.gp_after_Bc5,
      correctMove: 'b4',
      prompt: "Sacrifice the b-pawn!",
      hint: "b4 — offer a pawn to gain time and a huge center.",
      correctFeedback: "b4! The Evans Gambit. Black almost always takes, and you get rapid development in return.",
      wrongFeedback: "Push b4 — the gambit pawn!",
      highlightSquares: ['b2', 'b4'],
    },

    // 4...Bxb4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.eg_after_Bxb4,
      text: "4...Bxb4 — Black takes the pawn. Now play c3 with tempo!",
      autoAdvance: 800,
    },

    // 5.c3
    {
      type: 'play-move',
      fen: FEN.eg_after_Bxb4,
      correctMove: 'c3',
      prompt: "Attack the bishop and prepare d4!",
      hint: "c3 hits the bishop and sets up d4.",
      correctFeedback: "c3! The bishop is under attack and d4 is coming. The pawn sacrifice is already paying dividends.",
      wrongFeedback: "Play c3 to attack the bishop and prepare d4.",
      highlightSquares: ['c2', 'c3'],
    },

    // 5...Ba5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.eg_after_Ba5,
      text: "5...Ba5 — Black retreats to the side. Now unleash d4!",
      autoAdvance: 800,
    },

    // 6.d4
    {
      type: 'play-move',
      fen: FEN.eg_after_Ba5,
      correctMove: 'd4',
      prompt: "Build the ideal center!",
      hint: "d4 — your center is massive.",
      correctFeedback: "d4! You gave up a pawn but look at your position: pawns on c3+d4+e4, active pieces, and Black's bishop is offside on a5. The Evans Gambit in action.",
      wrongFeedback: "Push d4 — two pawns in the center.",
      highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 5...Bc5? (retreats to wrong square)
    // After 5.c3, Black retreats to c5 instead of a5.
    // 6.d4 exd4 7.cxd4 — bishop gets hit AGAIN.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.eg_after_c3,
      text: "Sometimes Black retreats to c5 instead of a5. That's a mistake — the bishop gets attacked by d4!",
    },
    // 5...Bc5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ep_after_Bc5,
      text: "5...Bc5? Right back to the line of fire.",
      autoAdvance: 800,
    },
    // 6.d4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.ep_after_Bc5,
      correctMove: 'd4',
      prompt: "Attack the bishop again!",
      hint: "d4 hits the bishop and opens the center.",
      correctFeedback: "d4! The bishop gets attacked again. Black is wasting time retreating while you build a massive center.",
      wrongFeedback: "d4 attacks the bishop.",
      highlightSquares: ['d2', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Play the Evans Gambit from memory.",
      buttonText: "LET'S GO",
    },
    // 3...Bc5
    { type: 'instruction', fen: FEN.gp_after_Bc5, text: "3...Bc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Bc5, correctMove: 'b4',
      prompt: "Your move.", hint: "b4.",
      correctFeedback: "b4.", wrongFeedback: "b4.",
    },
    // 4...Bxb4
    { type: 'instruction', fen: FEN.eg_after_Bxb4, text: "4...Bxb4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.eg_after_Bxb4, correctMove: 'c3',
      prompt: "Your move.", hint: "c3.",
      correctFeedback: "c3.", wrongFeedback: "c3.",
    },
    // 5...Ba5
    { type: 'instruction', fen: FEN.eg_after_Ba5, text: "5...Ba5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.eg_after_Ba5, correctMove: 'd4',
      prompt: "Your move.", hint: "d4.",
      correctFeedback: "d4.", wrongFeedback: "d4.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 10: Level Test
// Tests all main line moves + key branch moves
// ═══════════════════════════════════════════════════════════

export const IT_TEST_1: OpeningLesson = {
  id: 'it-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time for the Level Test. Play the Italian Game main line, then handle the variations.",
      buttonText: "START TEST",
    },

    // === Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 ===
    {
      type: 'play-move', fen: FEN.start, correctMove: 'e4',
      prompt: "Your move.", hint: "e4.",
      correctFeedback: "e4.", wrongFeedback: "e4.",
    },
    { type: 'instruction', fen: FEN.after_e5, text: "1...e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3',
      prompt: "Your move.", hint: "Nf3.",
      correctFeedback: "Nf3.", wrongFeedback: "Nf3.",
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "2...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4',
      prompt: "Your move.", hint: "Bc4.",
      correctFeedback: "Bc4.", wrongFeedback: "Bc4.",
    },
    { type: 'instruction', fen: FEN.gp_after_Bc5, text: "3...Bc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Bc5, correctMove: 'c3',
      prompt: "Your move.", hint: "c3.",
      correctFeedback: "c3.", wrongFeedback: "c3.",
    },
    { type: 'instruction', fen: FEN.gp_after_Nf6, text: "4...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Nf6, correctMove: 'd4',
      prompt: "Your move.", hint: "d4.",
      correctFeedback: "d4.", wrongFeedback: "d4.",
    },

    // === Center Fork: 5...exd4 6.cxd4 Bb4+ 7.Bd2 ===
    { type: 'instruction', fen: FEN.cf_after_exd4, text: "5...exd4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.cf_after_exd4, correctMove: 'cxd4',
      prompt: "Your move.", hint: "cxd4.",
      correctFeedback: "cxd4.", wrongFeedback: "cxd4.",
    },
    { type: 'instruction', fen: FEN.cf_after_Bb4, text: "6...Bb4+.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.cf_after_Bb4, correctMove: 'Bd2',
      prompt: "Your move.", hint: "Bd2.",
      correctFeedback: "Bd2.", wrongFeedback: "Bd2.",
    },

    // === The Attack: Bxd2+ Nbxd2 d5 exd5 Nxd5 O-O ===
    { type: 'instruction', fen: FEN.att_after_Bxd2, text: "7...Bxd2+.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.att_after_Bxd2, correctMove: 'Nbxd2',
      prompt: "Your move.", hint: "Nbxd2.",
      correctFeedback: "Nbxd2.", wrongFeedback: "Nbxd2.",
    },
    { type: 'instruction', fen: FEN.att_after_d5, text: "8...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.att_after_d5, correctMove: 'exd5',
      prompt: "Your move.", hint: "exd5.",
      correctFeedback: "exd5.", wrongFeedback: "exd5.",
    },
    { type: 'instruction', fen: FEN.att_after_Nxd5, text: "9...Nxd5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.att_after_Nxd5, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.",
      correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },

    // === Fried Liver test: Ng5 exd5 Nxf7 ===
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Now the Fried Liver. Show me what you've got.",
    },
    { type: 'instruction', fen: FEN.fl_after_Nf6, text: "3...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_Nf6, correctMove: 'Ng5',
      prompt: "Your move.", hint: "Ng5.",
      correctFeedback: "Ng5.", wrongFeedback: "Ng5.",
    },
    { type: 'instruction', fen: FEN.fl_after_d5, text: "4...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_d5, correctMove: 'exd5',
      prompt: "Your move.", hint: "exd5.",
      correctFeedback: "exd5.", wrongFeedback: "exd5.",
    },
    { type: 'instruction', fen: FEN.fl_after_Nxd5, text: "5...Nxd5??", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fl_after_Nxd5, correctMove: 'Nxf7',
      prompt: "Your move.", hint: "Nxf7.",
      correctFeedback: "Nxf7.", wrongFeedback: "Nxf7.",
    },

    // === Evans Gambit test ===
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Last one — the Evans Gambit.",
    },
    { type: 'instruction', fen: FEN.gp_after_Bc5, text: "3...Bc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.gp_after_Bc5, correctMove: 'b4',
      prompt: "Your move.", hint: "b4.",
      correctFeedback: "b4.", wrongFeedback: "b4.",
    },
    { type: 'instruction', fen: FEN.eg_after_Bxb4, text: "4...Bxb4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.eg_after_Bxb4, correctMove: 'c3',
      prompt: "Your move.", hint: "c3.",
      correctFeedback: "c3.", wrongFeedback: "c3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

const ITALIAN_LESSONS: Record<string, OpeningLesson> = {
  'it-1': IT_LESSON_1,
  'it-2': IT_LESSON_2,
  'it-punish-f6': IT_PUNISH_F6,
  'it-fried-1': IT_FRIED_1,
  'it-3': IT_LESSON_3,
  'it-two-knights': IT_TWO_KNIGHTS,
  'it-fried-2': IT_FRIED_2,
  'it-4': IT_LESSON_4,
  'it-evans-1': IT_EVANS_1,
  'it-test-1': IT_TEST_1,
}

export function getItalianLesson(id: string): OpeningLesson | undefined {
  return ITALIAN_LESSONS[id]
}
