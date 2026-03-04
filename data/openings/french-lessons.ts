import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// FRENCH DEFENSE LESSONS (fr-1 through fr-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line (Burn Variation): 1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 dxe4 5.Nxe4 Be7 6.Nxf6+ Bxf6 7.Bxf6 Qxf6 8.Nf3 O-O 9.Qd3 c5 10.O-O-O Nc6
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e6: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4: 'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5: 'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3: 'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_Nf6: 'rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4',
  after_Bg5: 'rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4',
  // Burn Variation (fr-2): 4...dxe4 5.Nxe4 Be7 6.Nxf6+ Bxf6 7.Bxf6 Qxf6
  after_dxe4: 'rnbqkb1r/ppp2ppp/4pn2/6B1/3Pp3/2N5/PPP2PPP/R2QKBNR w KQkq - 0 5',
  after_Nxe4: 'rnbqkb1r/ppp2ppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR b KQkq - 0 5',
  after_burn_Be7: 'rnbqk2r/ppp1bppp/4pn2/6B1/3PN3/8/PPP2PPP/R2QKBNR w KQkq - 1 6',
  after_Nxf6p: 'rnbqk2r/ppp1bppp/4pN2/6B1/3P4/8/PPP2PPP/R2QKBNR b KQkq - 0 6',
  after_burn_Bxf6: 'rnbqk2r/ppp2ppp/4pb2/6B1/3P4/8/PPP2PPP/R2QKBNR w KQkq - 0 7',
  after_Bxf6xf6: 'rnbqk2r/ppp2ppp/4pB2/8/3P4/8/PPP2PPP/R2QKBNR b KQkq - 0 7',
  after_Qxf6: 'rnb1k2r/ppp2ppp/4pq2/8/3P4/8/PPP2PPP/R2QKBNR w KQkq - 0 8',

  // Burn fr-2 punish: 5.f3? exf3! 6.Nxf3 Bb4+
  burn_p_after_f3: 'rnbqkb1r/ppp2ppp/4pn2/6B1/3Pp3/2N2P2/PPP3PP/R2QKBNR b KQkq - 0 5',
  burn_p_after_exf3: 'rnbqkb1r/ppp2ppp/4pn2/6B1/3P4/2N2p2/PPP3PP/R2QKBNR w KQkq - 0 6',
  burn_p_after_Nxf3: 'rnbqkb1r/ppp2ppp/4pn2/6B1/3P4/2N2N2/PPP3PP/R2QKB1R b KQkq - 0 6',
  burn_p_after_Bb4: 'rnbqk2r/ppp2ppp/4pn2/6B1/1b1P4/2N2N2/PPP3PP/R2QKB1R w KQkq - 1 7',

  // Burn fr-3: 8.Nf3 O-O 9.Qd3 c5 10.O-O-O Nc6
  burn_after_Nf3: 'rnb1k2r/ppp2ppp/4pq2/8/3P4/5N2/PPP2PPP/R2QKB1R b KQkq - 1 8',
  burn_after_OO: 'rnb2rk1/ppp2ppp/4pq2/8/3P4/5N2/PPP2PPP/R2QKB1R w KQ - 2 9',
  burn_after_Qd3: 'rnb2rk1/ppp2ppp/4pq2/8/3P4/3Q1N2/PPP2PPP/R3KB1R b KQ - 3 9',
  burn_after_c5: 'rnb2rk1/pp3ppp/4pq2/2p5/3P4/3Q1N2/PPP2PPP/R3KB1R w KQ - 0 10',
  burn_after_OOO: 'rnb2rk1/pp3ppp/4pq2/2p5/3P4/3Q1N2/PPP2PPP/2KR1B1R b - - 1 10',
  burn_after_Nc6: 'r1b2rk1/pp3ppp/2n1pq2/2p5/3P4/3Q1N2/PPP2PPP/2KR1B1R w - - 2 11',

  // Burn fr-3 punish: 9.Be2? c5! (passive, Black gets ideal center break early)
  burn_p3_after_Be2: 'rnb2rk1/ppp2ppp/4pq2/8/3P4/5N2/PPP1BPPP/R2QK2R b KQ - 3 9',
  burn_p3_after_c5: 'rnb2rk1/pp3ppp/4pq2/2p5/3P4/5N2/PPP1BPPP/R2QK2R w KQ - 0 10',
  burn_p3_after_OO: 'rnb2rk1/pp3ppp/4pq2/2p5/3P4/5N2/PPP1BPPP/R2Q1RK1 b - - 1 10',
  burn_p3_after_Nc6: 'r1b2rk1/pp3ppp/2n1pq2/2p5/3P4/5N2/PPP1BPPP/R2Q1RK1 w - - 2 11',

  // Burn fr-4: 11.dxc5 Rfd8 12.Qe2 e5 13.Kb1 Qf5
  burn_after_dxc5: 'r1b2rk1/pp3ppp/2n1pq2/2P5/8/3Q1N2/PPP2PPP/2KR1B1R b - - 0 11',
  burn_after_Rfd8: 'r1br2k1/pp3ppp/2n1pq2/2P5/8/3Q1N2/PPP2PPP/2KR1B1R w - - 1 12',
  burn_after_Qe2: 'r1br2k1/pp3ppp/2n1pq2/2P5/8/5N2/PPP1QPPP/2KR1B1R b - - 2 12',
  burn_after_e5: 'r1br2k1/pp3ppp/2n2q2/2P1p3/8/5N2/PPP1QPPP/2KR1B1R w - - 0 13',
  burn_after_Kb1: 'r1br2k1/pp3ppp/2n2q2/2P1p3/8/5N2/PPP1QPPP/1K1R1B1R b - - 1 13',
  burn_after_Qf5: 'r1br2k1/pp3ppp/2n5/2P1pq2/8/5N2/PPP1QPPP/1K1R1B1R w - - 2 14',

  // fr-4 punish: 11.Nf3-d2? (passive) Rfd8! 12.Nb3 e5! (Black dominates)
  burn_p4_after_Nd2: 'r1b2rk1/pp3ppp/2n1pq2/2p5/3P4/3Q4/PPPN1PPP/2KR1B1R b - - 3 11',
  burn_p4_after_Rfd8: 'r1br2k1/pp3ppp/2n1pq2/2p5/3P4/3Q4/PPPN1PPP/2KR1B1R w - - 4 12',
  burn_p4_after_Nb3: 'r1br2k1/pp3ppp/2n1pq2/2p5/3P4/1N1Q4/PPP2PPP/2KR1B1R b - - 5 12',
  burn_p4_after_e5: 'r1br2k1/pp3ppp/2n2q2/2p1p3/3P4/1N1Q4/PPP2PPP/2KR1B1R w - - 0 13',

  // Punish 3.e5? line
  pe5_after_e5: 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  pe5_after_c5: 'rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4',
  pe5_after_c3: 'rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4',
  pe5_after_Nc6: 'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR w KQkq - 1 5',
  pe5_after_Nf3: 'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5',
  pe5_after_Qb6: 'r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 3 6',

  // Punish 3.Bd3? line
  fr2p_after_Bd3: 'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/3B4/PPP2PPP/RNBQK1NR b KQkq - 1 3',
  fr2p_after_dxe4: 'rnbqkbnr/ppp2ppp/4p3/8/3Pp3/3B4/PPP2PPP/RNBQK1NR w KQkq - 0 4',
  fr2p_after_Bxe4: 'rnbqkbnr/ppp2ppp/4p3/8/3PB3/8/PPP2PPP/RNBQK1NR b KQkq - 0 4',
  fr2p_after_Nf6: 'rnbqkb1r/ppp2ppp/4pn2/8/3PB3/8/PPP2PPP/RNBQK1NR w KQkq - 1 5',

  // fr-1 punish: 2.e5?
  fr1p_after_e5: 'rnbqkbnr/pppp1ppp/4p3/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2',
  fr1p_after_d5: 'rnbqkbnr/ppp2ppp/4p3/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3',
  fr1p_after_d4: 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  fr1p_after_c5: 'rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4',

  // fr-3 punish: 5.Bd3?
  fr3p_after_Bd3: 'rnbqk2r/ppp1bppp/4pn2/3p2B1/3PP3/2NB4/PPP2PPP/R2QK1NR b KQkq - 5 5',
  fr3p_after_dxe4: 'rnbqk2r/ppp1bppp/4pn2/6B1/3Pp3/2NB4/PPP2PPP/R2QK1NR w KQkq - 0 6',
  fr3p_after_Bxe4: 'rnbqk2r/ppp1bppp/4pn2/6B1/3PB3/2N5/PPP2PPP/R2QK1NR b KQkq - 0 6',
  fr3p_after_Nxe4: 'rnbqk2r/ppp1bppp/4p3/6B1/3Pn3/2N5/PPP2PPP/R2QK1NR w KQkq - 0 7',

  // fr-4 punish: 7.Bd3?
  fr4p_after_Bd3: 'rnb1k2r/pppnqppp/4p3/3pP3/3P4/2NB4/PPP2PPP/R2QK1NR b KQkq - 1 7',
  fr4p_after_c5: 'rnb1k2r/pp1nqppp/4p3/2ppP3/3P4/2NB4/PPP2PPP/R2QK1NR w KQkq - 0 8',
  fr4p_after_Nf3: 'rnb1k2r/pp1nqppp/4p3/2ppP3/3P4/2NB1N2/PPP2PPP/R2QK2R b KQkq - 1 8',
  fr4p_after_Nc6: 'r1b1k2r/pp1nqppp/2n1p3/2ppP3/3P4/2NB1N2/PPP2PPP/R2QK2R w KQkq - 2 9',

  // Tarrasch (3.Nd2) line
  tar_after_Nd2: 'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3',
  tar_after_c5: 'rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4',
  tar_after_exd5: 'rnbqkbnr/pp3ppp/4p3/2pP4/3P4/8/PPPN1PPP/R1BQKBNR b KQkq - 0 4',
  tar_after_exd5_b: 'rnbqkbnr/pp3ppp/8/2pp4/3P4/8/PPPN1PPP/R1BQKBNR w KQkq - 0 5',
  tar_after_Ngf3: 'rnbqkbnr/pp3ppp/8/2pp4/3P4/5N2/PPPN1PPP/R1BQKB1R b KQkq - 1 5',
  tar_after_Nc6: 'r1bqkbnr/pp3ppp/2n5/2pp4/3P4/5N2/PPPN1PPP/R1BQKB1R w KQkq - 2 6',

  // Winawer (3...Bb4) line
  win_after_Bb4: 'rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4',
  win_after_e5: 'rnbqk1nr/ppp2ppp/4p3/3pP3/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  win_after_c5: 'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
  win_after_a3: 'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/P1N5/1PP2PPP/R1BQKBNR b KQkq - 0 5',
  win_after_Bxc3: 'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1b5/1PP2PPP/R1BQKBNR w KQkq - 0 6',
  win_after_bxc3: 'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq - 0 6',
  win_after_Ne7: 'rnbqk2r/pp2nppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR w KQkq - 1 7',

  // Winawer 2 line (continuation after Ne7)
  win2_after_Qg4: 'rnbqk2r/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR b KQkq - 2 7',
  win2_after_OO: 'rnbq1rk1/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR w KQ - 3 8',
  win2_after_Bd3: 'rnbq1rk1/pp2nppp/4p3/2ppP3/3P2Q1/P1PB4/2P2PPP/R1B1K1NR b KQ - 4 8',
  win2_after_Nbc6: 'r1bq1rk1/pp2nppp/2n1p3/2ppP3/3P2Q1/P1PB4/2P2PPP/R1B1K1NR w KQ - 5 9',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The French Wall
// Teaches: 1.e4 e6 2.d4 d5 3.Nc3 Nf6
// BLACK opening — user plays Black moves, White auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const FR_LESSON_1: OpeningLesson = {
  id: 'fr-1',
  title: 'The French Wall',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: No recap (first lesson of the opening)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1.e4 e6 2.d4 d5 3.Nc3 Nf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the French Defense — one of the most solid and strategic responses to 1.e4. You build a fortress with e6 and d5, then fight for the center.",
    },

    // --- White plays 1.e4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },

    // --- Black plays 1...e6 ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Play e6 — the French move. It looks quiet, but it prepares d5 on the very next turn. You're setting a trap.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "Start the French Defense.",
      hint: "Push your e-pawn one square. Prepare d5.",
      correctFeedback: "e6! The French is on. Next move: d5 to challenge White's center.",
      wrongFeedback: "In the French Defense, Black plays e6 — preparing d5.",
      highlightSquares: ['e7', 'e6'],
    },

    // --- White plays 2.d4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4 — White grabs the full center. But you're ready for this.",
      autoAdvance: 800,
    },

    // --- Black plays 2...d5 ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Play d5! This is the whole point. You challenge White's e4 pawn directly. The French is a fight for the center.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge the center — hit e4 head-on.",
      hint: "Push your d-pawn two squares. Attack e4.",
      correctFeedback: "d5! Now White has a decision to make. The center is contested.",
      wrongFeedback: "Play d5 — strike at the heart of White's center.",
      highlightSquares: ['d7', 'd5'],
      postMoveArrow: ['d5', 'e4'],
    },

    // --- White plays 3.Nc3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3 — White defends e4 with the knight. The most common response.",
      autoAdvance: 800,
    },

    // --- Black plays 3...Nf6 ---
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Play Nf6 — attack e4 again! This is the Classical French. You pile pressure on White's center pawn.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nf6',
      prompt: "Attack e4 a second time.",
      hint: "Knight to f6 — put more pressure on e4.",
      correctFeedback: "Nf6! Two pieces attacking e4, one defending. White must make a decision.",
      wrongFeedback: "Play Nf6 — attack the e4 pawn with your knight.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 2.e5? (too eager)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "What if White gets greedy after 1...e6? Imagine White pushes 2.e5 immediately — trying to grab space. Can you punish it?",
    },

    // 2.e5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr1p_after_e5,
      text: "2.e5? White advances too early without supporting the pawn.",
      autoAdvance: 800,
    },

    // 2...d5 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr1p_after_e5,
      correctMove: 'd5',
      prompt: "White overextended. Challenge it!",
      hint: "Push d5 — the e5 pawn has no support.",
      correctFeedback: "d5! The e5 pawn is now a target. White advanced without backup.",
      wrongFeedback: "Play d5 — attack the overextended e5 pawn.",
      highlightSquares: ['d7', 'd5'],
      postMoveArrow: ['d5', 'e5'],
    },

    // 3.d4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr1p_after_d4,
      text: "3.d4 — White tries to support e5.",
      autoAdvance: 800,
    },

    // 3...c5 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr1p_after_d4,
      correctMove: 'c5',
      prompt: "Attack the base of the pawn chain!",
      hint: "Push c5 — hit d4, the foundation of White's center.",
      correctFeedback: "c5! You're attacking d4 — the base of the chain. White's center is crumbling. That's the punishment for pushing e5 too early.",
      wrongFeedback: "Play c5 — attack d4, the base of White's pawn chain.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay e6, d5, Nf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three Black moves of the French.",
      buttonText: "LET'S GO",
    },

    // 1.e4
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    // Recall: e6
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "Your move.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
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
    // Recall: Nf6
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: The Burn Variation
// Teaches: 4.Bg5 dxe4 5.Nxe4 Be7 6.Nxf6+ Bxf6 7.Bxf6 Qxf6
// Recap: e6, d5, Nf6
// ═══════════════════════════════════════════════════════════

export const FR_LESSON_2: OpeningLesson = {
  id: 'fr-2',
  title: 'The Burn Variation',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (e6, d5, Nf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the French opening moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "The French move.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge the center.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nf6',
      prompt: "Attack e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4.Bg5 dxe4 5.Nxe4 Be7 6.Nxf6+ Bxf6 7.Bxf6 Qxf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "White pins your knight with Bg5. Instead of passively defending, we grab the center immediately.",
    },

    // --- White plays 4.Bg5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Bg5,
      text: "4.Bg5 — the pin. Your answer is aggressive: capture the e4 pawn right now.",
      autoAdvance: 800,
    },

    // --- Black plays 4...dxe4 ---
    {
      type: 'instruction',
      fen: FEN.after_Bg5,
      text: "Play dxe4! The Burn Variation. You grab the center pawn while the bishop is awkwardly placed on g5.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'dxe4',
      prompt: "Grab the center pawn!",
      hint: "dxe4 — capture the e4 pawn.",
      correctFeedback: "dxe4! You've won a pawn. White must react.",
      wrongFeedback: "Capture on e4 — dxe4.",
      highlightSquares: ['d5', 'e4'],
    },

    // --- White plays 5.Nxe4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "5.Nxe4 — White recaptures with the knight, centralizing it. Now develop your bishop.",
      autoAdvance: 800,
    },

    // --- Black plays 5...Be7 ---
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Play Be7! This develops the bishop and prepares castling. It also invites the knight to attack — which you'll use to your advantage.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Be7',
      prompt: "Develop and prepare to castle.",
      hint: "Be7 — develop the bishop.",
      correctFeedback: "Be7! Piece developed, castling ready. The knight on e4 will have to move.",
      wrongFeedback: "Play Be7 to develop and prepare castling.",
      highlightSquares: ['f8', 'e7'],
    },

    // --- White plays 6.Nxf6+ (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nxf6p,
      text: "6.Nxf6+ — White trades the knight for your f6 knight with check. Recapture with the bishop.",
      autoAdvance: 800,
    },

    // --- Black plays 6...Bxf6 ---
    {
      type: 'play-move',
      fen: FEN.after_Nxf6p,
      correctMove: 'Bxf6',
      prompt: "Recapture.",
      hint: "Bxf6 — take the knight.",
      correctFeedback: "Bxf6! You have two bishops. White will take it, but you'll have the queen.",
      wrongFeedback: "Recapture with Bxf6.",
      highlightSquares: ['e7', 'f6'],
    },

    // --- White plays 7.Bxf6 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Bxf6xf6,
      text: "7.Bxf6 — White takes the bishop. Recapture with the queen — it lands on a powerful central square.",
      autoAdvance: 800,
    },

    // --- Black plays 7...Qxf6 ---
    {
      type: 'instruction',
      fen: FEN.after_Bxf6xf6,
      text: "Qxf6! Your queen becomes a monster on f6 — eyeing b2, the kingside, and tying down White's pieces.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bxf6xf6,
      correctMove: 'Qxf6',
      prompt: "Activate the queen.",
      hint: "Qxf6 — queen takes the bishop.",
      correctFeedback: "Qxf6! Active queen, solid pawn structure. The Burn gives Black excellent play.",
      wrongFeedback: "Recapture with Qxf6.",
      highlightSquares: ['d8', 'f6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 5.f3? (bad recapture)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "What if White tries 5.f3? to win back the pawn? This is a mistake — punish it immediately.",
    },

    // 5.f3? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.burn_p_after_f3,
      text: "5.f3? White tries to reclaim e4. But this weakens the king's shelter badly.",
      autoAdvance: 800,
    },

    // 5...exf3! (user plays)
    {
      type: 'play-move',
      fen: FEN.burn_p_after_f3,
      correctMove: 'exf3',
      prompt: "Keep the pawn AND open lines!",
      hint: "exf3 — capture the pawn, open the f-file.",
      correctFeedback: "exf3! You keep the pawn and wreck White's kingside. White must spend time recapturing.",
      wrongFeedback: "Capture — exf3.",
      highlightSquares: ['e4', 'f3'],
    },

    // 6.Nxf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.burn_p_after_Nxf3,
      text: "6.Nxf3 — forced.",
      autoAdvance: 800,
    },

    // 6...Bb4+ (user plays)
    {
      type: 'play-move',
      fen: FEN.burn_p_after_Nxf3,
      correctMove: 'Bb4',
      prompt: "Now pin the knight!",
      hint: "Bb4 — pin the Nc3 to the king.",
      correctFeedback: "Bb4! The Nc3 is pinned and can't move. You're up a pawn with active pieces. White is suffering.",
      wrongFeedback: "Pin with Bb4.",
      highlightSquares: ['f8', 'b4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay dxe4, Be7, Bxf6, Qxf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Let's run it back. Play the four Black moves from this lesson.",
      buttonText: "LET'S GO",
    },

    // 4.Bg5
    { type: 'instruction', fen: FEN.after_Bg5, text: "4.Bg5.", autoAdvance: 800 },
    // Recall: dxe4
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'dxe4',
      prompt: "Your move.",
      hint: "dxe4.",
      correctFeedback: "dxe4.",
      wrongFeedback: "dxe4.",
    },
    // 5.Nxe4
    { type: 'instruction', fen: FEN.after_Nxe4, text: "5.Nxe4.", autoAdvance: 800 },
    // Recall: Be7
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Be7',
      prompt: "Your move.",
      hint: "Be7.",
      correctFeedback: "Be7.",
      wrongFeedback: "Be7.",
    },
    // 6.Nxf6+
    { type: 'instruction', fen: FEN.after_Nxf6p, text: "6.Nxf6+.", autoAdvance: 800 },
    // Recall: Bxf6
    {
      type: 'play-move',
      fen: FEN.after_Nxf6p,
      correctMove: 'Bxf6',
      prompt: "Your move.",
      hint: "Bxf6.",
      correctFeedback: "Bxf6.",
      wrongFeedback: "Bxf6.",
    },
    // 7.Bxf6
    { type: 'instruction', fen: FEN.after_Bxf6xf6, text: "7.Bxf6.", autoAdvance: 800 },
    // Recall: Qxf6
    {
      type: 'play-move',
      fen: FEN.after_Bxf6xf6,
      correctMove: 'Qxf6',
      prompt: "Your move.",
      hint: "Qxf6.",
      correctFeedback: "Qxf6.",
      wrongFeedback: "Qxf6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Castle & Strike
// Teaches: 8.Nf3 O-O 9.Qd3 c5 10.O-O-O Nc6
// Recap: dxe4, Be7, Bxf6, Qxf6
// ═══════════════════════════════════════════════════════════

export const FR_LESSON_3: OpeningLesson = {
  id: 'fr-3',
  title: 'Castle & Strike',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (dxe4, Be7, Bxf6, Qxf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Quick recap — play the Burn Variation moves from last lesson.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: "4.Bg5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'dxe4',
      prompt: "Grab the center.",
      hint: "dxe4.",
      correctFeedback: "dxe4.",
      wrongFeedback: "dxe4.",
      highlightSquares: ['d5', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_Nxe4, text: "5.Nxe4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Be7',
      prompt: "Develop.",
      hint: "Be7.",
      correctFeedback: "Be7.",
      wrongFeedback: "Be7.",
      highlightSquares: ['f8', 'e7'],
    },
    { type: 'instruction', fen: FEN.after_Nxf6p, text: "6.Nxf6+.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nxf6p,
      correctMove: 'Bxf6',
      prompt: "Recapture.",
      hint: "Bxf6.",
      correctFeedback: "Bxf6.",
      wrongFeedback: "Bxf6.",
      highlightSquares: ['e7', 'f6'],
    },
    { type: 'instruction', fen: FEN.after_Bxf6xf6, text: "7.Bxf6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bxf6xf6,
      correctMove: 'Qxf6',
      prompt: "Activate the queen.",
      hint: "Qxf6.",
      correctFeedback: "Qxf6.",
      wrongFeedback: "Qxf6.",
      highlightSquares: ['d8', 'f6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (8.Nf3 O-O 9.Qd3 c5 10.O-O-O Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxf6,
      text: "Your queen is dominant on f6. Now castle quickly and hit the center with c5 — undermine White's last pawn.",
    },

    // --- White plays 8.Nf3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Nf3,
      text: "8.Nf3 — White develops, trying to neutralize your queen.",
      autoAdvance: 800,
    },

    // --- Black plays 8...O-O ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Nf3,
      text: "Castle! Get your king to safety. White will castle queenside — opposite sides means both players attack.",
    },
    {
      type: 'play-move',
      fen: FEN.burn_after_Nf3,
      correctMove: 'O-O',
      prompt: "King safety first.",
      hint: "Castle kingside.",
      correctFeedback: "O-O! King is safe. Now prepare the central strike.",
      wrongFeedback: "Castle — O-O.",
      highlightSquares: ['e8', 'g8'],
    },

    // --- White plays 9.Qd3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Qd3,
      text: "9.Qd3 — White develops the queen, defending the d4 pawn. Time to attack it.",
      autoAdvance: 800,
    },

    // --- Black plays 9...c5 ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Qd3,
      text: "Hit with c5! Attack the d4 pawn. If d4 falls, White has no center left.",
    },
    {
      type: 'play-move',
      fen: FEN.burn_after_Qd3,
      correctMove: 'c5',
      prompt: "Strike the center!",
      hint: "c5 — attack d4.",
      correctFeedback: "c5! The d4 pawn is under fire. White must react.",
      wrongFeedback: "Play c5 — attack d4.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // --- White plays 10.O-O-O (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.burn_after_OOO,
      text: "10.O-O-O — White castles queenside, defending d4 with the rook. Develop the knight with tempo.",
      autoAdvance: 800,
    },

    // --- Black plays 10...Nc6 ---
    {
      type: 'instruction',
      fen: FEN.burn_after_OOO,
      text: "Play Nc6! The knight develops to its best square and piles pressure on d4.",
    },
    {
      type: 'play-move',
      fen: FEN.burn_after_OOO,
      correctMove: 'Nc6',
      prompt: "Develop with pressure.",
      hint: "Nc6 — attack d4.",
      correctFeedback: "Nc6! Two pieces hitting d4. White is under serious pressure.",
      wrongFeedback: "Play Nc6 — develop and attack d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 9.Be2? (passive)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.burn_after_OO,
      text: "What if White plays passively with 9.Be2 instead of Qd3? You can seize the initiative even faster.",
    },

    // 9.Be2? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.burn_p3_after_Be2,
      text: "9.Be2? Passive. White hasn't defended d4 actively.",
      autoAdvance: 800,
    },

    // 9...c5! (user plays)
    {
      type: 'play-move',
      fen: FEN.burn_p3_after_Be2,
      correctMove: 'c5',
      prompt: "Hit d4 now!",
      hint: "c5 — attack d4 while White is slow.",
      correctFeedback: "c5! White is struggling. The d4 pawn can't be held without castling queenside first.",
      wrongFeedback: "Strike with c5.",
      highlightSquares: ['c7', 'c5'],
    },

    // 10.O-O (auto-advance — White castles kingside, wrong side)
    {
      type: 'instruction',
      fen: FEN.burn_p3_after_OO,
      text: "10.O-O — White castles kingside. Now develop the knight and your pieces flood in.",
      autoAdvance: 800,
    },

    // 10...Nc6! (user plays)
    {
      type: 'play-move',
      fen: FEN.burn_p3_after_OO,
      correctMove: 'Nc6',
      prompt: "Pile on.",
      hint: "Nc6 — develop with threats.",
      correctFeedback: "Nc6! Two attackers on d4, queen on f6. White is completely under pressure from passive play.",
      wrongFeedback: "Develop with Nc6.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay O-O, c5, Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxf6,
      text: "Run it back. Play the three Black moves.",
      buttonText: "LET'S GO",
    },

    // 8.Nf3
    { type: 'instruction', fen: FEN.burn_after_Nf3, text: "8.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    // 9.Qd3
    { type: 'instruction', fen: FEN.burn_after_Qd3, text: "9.Qd3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_Qd3,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    // 10.O-O-O
    { type: 'instruction', fen: FEN.burn_after_OOO, text: "10.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_OOO,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: Break Through
// Teaches: 11.dxc5 Rfd8 12.Qe2 e5 13.Kb1 Qf5
// Recap: O-O, c5, Nc6
// ═══════════════════════════════════════════════════════════

export const FR_LESSON_4: OpeningLesson = {
  id: 'fr-4',
  title: 'Break Through',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (O-O, c5, Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxf6,
      text: "Quick recap — play the moves from last lesson.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.burn_after_Nf3, text: "8.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_Nf3,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
      highlightSquares: ['e8', 'g8'],
    },
    { type: 'instruction', fen: FEN.burn_after_Qd3, text: "9.Qd3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_Qd3,
      correctMove: 'c5',
      prompt: "Strike.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },
    { type: 'instruction', fen: FEN.burn_after_OOO, text: "10.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_OOO,
      correctMove: 'Nc6',
      prompt: "Develop.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (11.dxc5 Rfd8 12.Qe2 e5 13.Kb1 Qf5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.burn_after_Nc6,
      text: "White must deal with your c5 threat. When they take it, you spring into action with the rook and e5.",
    },

    // --- White plays 11.dxc5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.burn_after_dxc5,
      text: "11.dxc5 — White captures. Now activate your rook immediately.",
      autoAdvance: 800,
    },

    // --- Black plays 11...Rfd8 ---
    {
      type: 'instruction',
      fen: FEN.burn_after_dxc5,
      text: "Rfd8! The rook joins the attack. It threatens to win the d-file and pressures White's queen.",
    },
    {
      type: 'play-move',
      fen: FEN.burn_after_dxc5,
      correctMove: 'Rfd8',
      prompt: "Activate the rook!",
      hint: "Rfd8 — rook to d8.",
      correctFeedback: "Rfd8! The rook is active. White must deal with the pressure.",
      wrongFeedback: "Play Rfd8 — activate the rook.",
      highlightSquares: ['f8', 'd8'],
    },

    // --- White plays 12.Qe2 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Qe2,
      text: "12.Qe2 — White moves the queen to defend. Now play the key move: push e5!",
      autoAdvance: 800,
    },

    // --- Black plays 12...e5 ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Qe2,
      text: "Push e5! This pawn storms forward, opening the center and threatening to win material.",
    },
    {
      type: 'play-move',
      fen: FEN.burn_after_Qe2,
      correctMove: 'e5',
      prompt: "Open the center!",
      hint: "e5 — push the e-pawn.",
      correctFeedback: "e5! The center blows open. White's king is exposed.",
      wrongFeedback: "Push e5 — open the game.",
      highlightSquares: ['e6', 'e5'],
    },

    // --- White plays 13.Kb1 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Kb1,
      text: "13.Kb1 — White moves the king to safety. Your queen now strikes at f5.",
      autoAdvance: 800,
    },

    // --- Black plays 13...Qf5 ---
    {
      type: 'instruction',
      fen: FEN.burn_after_Kb1,
      text: "Qf5! Your queen attacks the c2 pawn and threatens to invade. White is in serious trouble.",
    },
    {
      type: 'play-move',
      fen: FEN.burn_after_Kb1,
      correctMove: 'Qf5',
      prompt: "Queen to the attack.",
      hint: "Qf5 — threaten c2.",
      correctFeedback: "Qf5! Threatening c2 and e4. The Burn Variation delivers a powerful attack.",
      wrongFeedback: "Play Qf5 — attack c2.",
      highlightSquares: ['f6', 'f5'],
      postMoveArrow: ['f5', 'c2'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 11.Nd2? (passive)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.burn_after_Nc6,
      text: "What if White retreats the knight with 11.Nd2 instead of taking c5? Punish the passivity.",
    },

    // 11.Nd2? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.burn_p4_after_Nd2,
      text: "11.Nd2? Passive retreat. White gives up the initiative.",
      autoAdvance: 800,
    },

    // 11...Rfd8! (user plays)
    {
      type: 'play-move',
      fen: FEN.burn_p4_after_Nd2,
      correctMove: 'Rfd8',
      prompt: "Activate the rook!",
      hint: "Rfd8 — rook to the open file.",
      correctFeedback: "Rfd8! The rook controls d4. White's position is crumbling.",
      wrongFeedback: "Play Rfd8 — activate the rook.",
      highlightSquares: ['f8', 'd8'],
    },

    // 12.Nb3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.burn_p4_after_Nb3,
      text: "12.Nb3 — White tries to reactivate the knight.",
      autoAdvance: 800,
    },

    // 12...e5! (user plays)
    {
      type: 'play-move',
      fen: FEN.burn_p4_after_Nb3,
      correctMove: 'e5',
      prompt: "Crack open the center!",
      hint: "e5 — open the center and attack d4.",
      correctFeedback: "e5! The center explodes in your favor. That's the cost of passive play against the Burn.",
      wrongFeedback: "Play e5 — open the center.",
      highlightSquares: ['e6', 'e5'],
      postMoveArrow: ['e5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay Rfd8, e5, Qf5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.burn_after_Nc6,
      text: "One more time. Play the three finishing moves.",
      buttonText: "LET'S GO",
    },

    // 11.dxc5
    { type: 'instruction', fen: FEN.burn_after_dxc5, text: "11.dxc5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_dxc5,
      correctMove: 'Rfd8',
      prompt: "Your move.",
      hint: "Rfd8.",
      correctFeedback: "Rfd8.",
      wrongFeedback: "Rfd8.",
    },
    // 12.Qe2
    { type: 'instruction', fen: FEN.burn_after_Rfd8, text: "12.Qe2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_Rfd8,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },
    // 13.Kb1
    { type: 'instruction', fen: FEN.burn_after_e5, text: "13.Kb1.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.burn_after_e5,
      correctMove: 'Qf5',
      prompt: "Your move.",
      hint: "Qf5.",
      correctFeedback: "Qf5.",
      wrongFeedback: "Qf5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH LESSON: Punish 3.e5?
// After 1.e4 e6 2.d4 d5, White plays 3.e5? prematurely.
// Black: 3...c5! 4.c3 Nc6
// ═══════════════════════════════════════════════════════════

export const FR_PUNISH_E5: OpeningLesson = {
  id: 'fr-punish-e5',
  title: 'Punish 3.e5?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (e6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "White tries 3.e5 too early. Let's punish it.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "The French move.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 3.e5? c5! 4.c3 Nc6 5.Nf3 Qb6
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Instead of 3.Nc3, White pushes 3.e5 prematurely. The advance is premature because White hasn't developed pieces to support it.",
    },

    // 3.e5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe5_after_e5,
      text: "3.e5? Too soon! White advances without proper support.",
      autoAdvance: 800,
    },

    // 3...c5! (user plays)
    {
      type: 'play-move',
      fen: FEN.pe5_after_e5,
      correctMove: 'c5',
      prompt: "Attack the base of the pawn chain!",
      hint: "Push c5 — hit d4, the foundation.",
      correctFeedback: "c5! You attack d4 immediately. If the d4 pawn falls, e5 becomes weak too.",
      wrongFeedback: "Play c5 — attack d4, the base of the chain.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // 4.c3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe5_after_c3,
      text: "4.c3 — White tries to hold d4, but it's passive.",
      autoAdvance: 800,
    },

    // 4...Nc6 (user plays)
    {
      type: 'play-move',
      fen: FEN.pe5_after_c3,
      correctMove: 'Nc6',
      prompt: "Develop and increase the pressure on d4.",
      hint: "Knight to c6 — pile on d4.",
      correctFeedback: "Nc6! Now both c5 and Nc6 attack d4. White is struggling to hold the center.",
      wrongFeedback: "Develop Nc6 — increase pressure on d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // 5.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe5_after_Nf3,
      text: "5.Nf3 — White develops, but the damage is done.",
      autoAdvance: 800,
    },

    // 5...Qb6 (user plays)
    {
      type: 'play-move',
      fen: FEN.pe5_after_Nf3,
      correctMove: 'Qb6',
      prompt: "Add even more pressure on d4 — and attack b2!",
      hint: "Queen to b6 — triple attack on d4 and hit b2.",
      correctFeedback: "Qb6! Your queen attacks both d4 AND b2. White's position is cracking. That's why 3.e5 is premature.",
      wrongFeedback: "Play Qb6 — attack d4 and b2 simultaneously.",
      highlightSquares: ['d8', 'b6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pe5_after_e5,
      text: "One more time. Punish 3.e5 from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.pe5_after_e5,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.pe5_after_c3, text: "4.c3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.pe5_after_c3,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
    { type: 'instruction', fen: FEN.pe5_after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.pe5_after_Nf3,
      correctMove: 'Qb6',
      prompt: "Your move.",
      hint: "Qb6.",
      correctFeedback: "Qb6.",
      wrongFeedback: "Qb6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH LESSON: Punish 3.Bd3?
// After 1.e4 e6 2.d4 d5, White plays 3.Bd3? (passive).
// Black: 3...dxe4! 4.Bxe4 Nf6
// ═══════════════════════════════════════════════════════════

export const FR_PUNISH_BD3: OpeningLesson = {
  id: 'fr-punish-bd3',
  title: 'Punish 3.Bd3?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (e6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "White plays 3.Bd3 — passive and bad. Let's punish it.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "The French.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 3.Bd3? dxe4! 4.Bxe4 Nf6
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Instead of Nc3, White plays 3.Bd3 — the bishop blocks the d-pawn and achieves nothing useful.",
    },

    // 3.Bd3? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr2p_after_Bd3,
      text: "3.Bd3? The bishop blocks White's own d-pawn. A terrible square.",
      autoAdvance: 800,
    },

    // 3...dxe4! (user plays)
    {
      type: 'play-move',
      fen: FEN.fr2p_after_Bd3,
      correctMove: 'dxe4',
      prompt: "Take the center pawn — White can't recapture well.",
      hint: "Capture dxe4 — force the bishop to waste more time.",
      correctFeedback: "dxe4! White's bishop must now waste another move recapturing.",
      wrongFeedback: "Take dxe4 — force the bishop to move again.",
      highlightSquares: ['d5', 'e4'],
    },

    // 4.Bxe4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr2p_after_Bxe4,
      text: "4.Bxe4 — forced. The bishop moved twice to do nothing.",
      autoAdvance: 800,
    },

    // 4...Nf6 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr2p_after_Bxe4,
      correctMove: 'Nf6',
      prompt: "Develop with tempo — attack the bishop!",
      hint: "Knight to f6 — the bishop has to move AGAIN.",
      correctFeedback: "Nf6! The bishop must retreat a THIRD time. You're developing while White wastes moves. That's the punishment for Bd3.",
      wrongFeedback: "Play Nf6 — attack the bishop and develop.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.fr2p_after_Bd3,
      text: "One more time. Punish Bd3 from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.fr2p_after_Bd3,
      correctMove: 'dxe4',
      prompt: "Your move.",
      hint: "dxe4.",
      correctFeedback: "dxe4.",
      wrongFeedback: "dxe4.",
    },
    { type: 'instruction', fen: FEN.fr2p_after_Bxe4, text: "4.Bxe4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fr2p_after_Bxe4,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BRANCH: The Tarrasch (3.Nd2)
// After 1.e4 e6 2.d4 d5, White plays 3.Nd2 instead of Nc3.
// Black: 3...c5 4.exd5 exd5 5.Ngf3 Nc6
// ═══════════════════════════════════════════════════════════

export const FR_TARRASCH_1: OpeningLesson = {
  id: 'fr-tarrasch-1',
  title: 'The Tarrasch',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (e6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Tarrasch variation — White plays 3.Nd2 instead of 3.Nc3. A different character.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "The French.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 3.Nd2 c5 4.exd5 exd5 5.Ngf3 Nc6
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "White plays 3.Nd2 — the Tarrasch. The knight goes to d2 instead of c3, keeping the c-pawn free. Your response? Strike immediately with c5!",
    },

    // 3.Nd2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tar_after_Nd2,
      text: "3.Nd2 — the Tarrasch. The knight doesn't pressure d5 as strongly from here.",
      autoAdvance: 800,
    },

    // 3...c5 (user plays)
    {
      type: 'play-move',
      fen: FEN.tar_after_Nd2,
      correctMove: 'c5',
      prompt: "Strike the center immediately!",
      hint: "Push c5 — challenge d4 right away.",
      correctFeedback: "c5! Against the Tarrasch, you strike immediately. The knight on d2 can't defend d4 as well as Nc3 defends e4.",
      wrongFeedback: "Play c5 — attack d4 while the knight is on d2.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // 4.exd5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tar_after_exd5,
      text: "4.exd5 — White exchanges in the center.",
      autoAdvance: 800,
    },

    // 4...exd5 (user plays)
    {
      type: 'play-move',
      fen: FEN.tar_after_exd5,
      correctMove: 'exd5',
      prompt: "Recapture — open the e-file for your rook.",
      hint: "Take back with the e-pawn.",
      correctFeedback: "exd5! The center is open. Your e-file rook will be powerful.",
      wrongFeedback: "Recapture with exd5.",
      highlightSquares: ['e6', 'd5'],
    },

    // 5.Ngf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.tar_after_Ngf3,
      text: "5.Ngf3 — White develops.",
      autoAdvance: 800,
    },

    // 5...Nc6 (user plays)
    {
      type: 'play-move',
      fen: FEN.tar_after_Ngf3,
      correctMove: 'Nc6',
      prompt: "Develop and fight for the center.",
      hint: "Knight to c6 — control d4.",
      correctFeedback: "Nc6! You have a great position. Isolated d-pawn? Maybe. But your pieces are active and the center is open. That's the Tarrasch French.",
      wrongFeedback: "Play Nc6 — develop naturally.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.tar_after_Nd2,
      text: "Run it back. Play the Tarrasch response from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.tar_after_Nd2,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.tar_after_exd5, text: "4.exd5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.tar_after_exd5,
      correctMove: 'exd5',
      prompt: "Your move.",
      hint: "exd5.",
      correctFeedback: "exd5.",
      wrongFeedback: "exd5.",
    },
    { type: 'instruction', fen: FEN.tar_after_Ngf3, text: "5.Ngf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.tar_after_Ngf3,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// BRANCH: The Winawer (3...Bb4)
// After 1.e4 e6 2.d4 d5 3.Nc3, Black plays 3...Bb4 instead of Nf6.
// 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
// ═══════════════════════════════════════════════════════════

export const FR_WINAWER_1: OpeningLesson = {
  id: 'fr-winawer-1',
  title: 'The Winawer',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (e6, d5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Winawer — the most aggressive French. You pin the knight with Bb4 and create chaos.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "The French.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "After 3.Nc3, instead of Nf6 (Classical), you can play Bb4 — the Winawer! You pin the knight that defends e4.",
    },

    // 3.Nc3 (auto-advance)
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },

    // 3...Bb4 (user plays)
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: "Pin the knight! The Winawer.",
      hint: "Bishop to b4 — pin the c3 knight.",
      correctFeedback: "Bb4! The Winawer. You're pinning the knight that defends e4. Aggressive and sharp.",
      wrongFeedback: "Play Bb4 — pin the knight on c3.",
      highlightSquares: ['f8', 'b4'],
      postMoveArrow: ['b4', 'c3'],
    },

    // 4.e5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.win_after_e5,
      text: "4.e5 — White pushes forward, ignoring the pin. This creates a tense position.",
      autoAdvance: 800,
    },

    // 4...c5 (user plays)
    {
      type: 'play-move',
      fen: FEN.win_after_e5,
      correctMove: 'c5',
      prompt: "Attack the center — the classic French break.",
      hint: "Push c5 — hit d4.",
      correctFeedback: "c5! Attacking d4 again. The Winawer is all about pressure.",
      wrongFeedback: "Play c5 — challenge d4.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // 5.a3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.win_after_a3,
      text: "5.a3 — White asks the question: what will you do with the bishop?",
      autoAdvance: 800,
    },

    // 5...Bxc3+ (user plays)
    {
      type: 'play-move',
      fen: FEN.win_after_a3,
      correctMove: 'Bxc3+',
      prompt: "Take the knight! Damage White's pawn structure.",
      hint: "Capture on c3 — give check and wreck White's pawns.",
      correctFeedback: "Bxc3+! You sacrifice the bishop pair, but White's pawns are destroyed. The c3 pawn is weak forever.",
      wrongFeedback: "Take on c3 — Bxc3+ with check!",
      highlightSquares: ['b4', 'c3'],
    },

    // 6.bxc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.win_after_bxc3,
      text: "6.bxc3 — White's pawn structure is ruined. Doubled c-pawns, weak squares everywhere.",
      autoAdvance: 800,
    },

    // 6...Ne7 (user plays)
    {
      type: 'instruction',
      fen: FEN.win_after_bxc3,
      text: "Play Ne7 — develop the knight to a flexible square. From e7 it can go to f5 or g6, putting pressure on White's center.",
    },
    {
      type: 'play-move',
      fen: FEN.win_after_bxc3,
      correctMove: 'Ne7',
      prompt: "Develop — the knight heads for f5.",
      hint: "Knight to e7 — it'll go to f5 next.",
      correctFeedback: "Ne7! The knight is heading to f5 where it attacks d4 and e3. White has the bishops, but your pawn structure is superior. That's the Winawer trade.",
      wrongFeedback: "Play Ne7 — it's heading to f5.",
      highlightSquares: ['g8', 'e7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Run it back. Play the Winawer from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: "Your move.",
      hint: "Bb4.",
      correctFeedback: "Bb4.",
      wrongFeedback: "Bb4.",
    },
    { type: 'instruction', fen: FEN.win_after_e5, text: "4.e5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win_after_e5,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.win_after_a3, text: "5.a3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win_after_a3,
      correctMove: 'Bxc3+',
      prompt: "Your move.",
      hint: "Bxc3+.",
      correctFeedback: "Bxc3+.",
      wrongFeedback: "Bxc3+.",
    },
    { type: 'instruction', fen: FEN.win_after_bxc3, text: "6.bxc3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win_after_bxc3,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: "Ne7.",
      correctFeedback: "Ne7.",
      wrongFeedback: "Ne7.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// WINAWER 2: Winawer Plans
// Teaches: 7.Qg4 O-O 8.Bd3 Nbc6
// Recap: 3...Bb4, c5, Bxc3+, Ne7
// ═══════════════════════════════════════════════════════════

export const FR_WINAWER_2: OpeningLesson = {
  id: 'fr-winawer-2',
  title: 'Winawer Plans',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (Bb4, c5, Bxc3+, Ne7)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.win_after_Ne7,
      text: "The Winawer continues — White attacks with Qg4, but you're ready. Castle and develop.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: "The French.",
      hint: "e6.",
      correctFeedback: "e6.",
      wrongFeedback: "e6.",
      highlightSquares: ['e7', 'e6'],
    },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Challenge.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
      highlightSquares: ['d7', 'd5'],
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: "The Winawer.",
      hint: "Bb4.",
      correctFeedback: "Bb4!",
      wrongFeedback: "Bb4.",
      highlightSquares: ['f8', 'b4'],
    },
    { type: 'instruction', fen: FEN.win_after_e5, text: "4.e5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win_after_e5,
      correctMove: 'c5',
      prompt: "Break!",
      hint: "c5.",
      correctFeedback: "c5!",
      wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },
    { type: 'instruction', fen: FEN.win_after_a3, text: "5.a3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win_after_a3,
      correctMove: 'Bxc3+',
      prompt: "Take it.",
      hint: "Bxc3+.",
      correctFeedback: "Bxc3+!",
      wrongFeedback: "Bxc3+.",
      highlightSquares: ['b4', 'c3'],
    },
    { type: 'instruction', fen: FEN.win_after_bxc3, text: "6.bxc3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win_after_bxc3,
      correctMove: 'Ne7',
      prompt: "Develop.",
      hint: "Ne7.",
      correctFeedback: "Ne7!",
      wrongFeedback: "Ne7.",
      highlightSquares: ['g8', 'e7'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — 7.Qg4 O-O 8.Bd3 Nbc6
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.win_after_Ne7,
      text: "Now White plays Qg4, targeting g7. Don't panic — just castle. The king is safe and your knight defends.",
    },

    // 7.Qg4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.win2_after_Qg4,
      text: "7.Qg4 — White eyes g7. Looks scary, but you have the perfect answer.",
      autoAdvance: 800,
    },

    // 7...O-O (user plays)
    {
      type: 'play-move',
      fen: FEN.win2_after_Qg4,
      correctMove: 'O-O',
      prompt: "Castle! Your king is safe and g7 is protected.",
      hint: "Castle kingside — the knight on e7 guards g6.",
      correctFeedback: "O-O! The king is safe. White's queen on g4 looks aggressive but has no real targets. Your structure is solid.",
      wrongFeedback: "Castle kingside — O-O. The king is safe there.",
      highlightSquares: ['e8', 'g8'],
    },

    // 8.Bd3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.win2_after_Bd3,
      text: "8.Bd3 — White develops the bishop, eyeing the kingside. Time to bring your last piece into the fight.",
      autoAdvance: 800,
    },

    // 8...Nbc6 (user plays)
    {
      type: 'instruction',
      fen: FEN.win2_after_Bd3,
      text: "Develop the queenside knight to c6. It attacks d4 and supports the c5 break. This completes your setup.",
    },
    {
      type: 'play-move',
      fen: FEN.win2_after_Bd3,
      correctMove: 'Nbc6',
      prompt: "Last piece — bring the knight into the fight.",
      hint: "Knight from b8 to c6 — it attacks d4.",
      correctFeedback: "Nbc6! Development complete. Your knights target d4, your pawns control the center, and the king is safe. The Winawer setup is done — Black is ready to fight.",
      wrongFeedback: "Play Nbc6 — develop the last piece and attack d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.win_after_Ne7,
      text: "Run it back. Complete the Winawer setup from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.win2_after_Qg4, text: "7.Qg4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win2_after_Qg4,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    { type: 'instruction', fen: FEN.win2_after_Bd3, text: "8.Bd3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.win2_after_Bd3,
      correctMove: 'Nbc6',
      prompt: "Your move.",
      hint: "Nbc6.",
      correctFeedback: "Nbc6.",
      wrongFeedback: "Nbc6.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// TEST: Level 1 Test
// Full main line from memory + variations
// ═══════════════════════════════════════════════════════════

export const FR_TEST_1: OpeningLesson = {
  id: 'fr-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // PART 1: Full Burn Variation main line (10 moves, no hand-holding)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Level 1 Test. Play the full French Burn Variation from memory. Then handle the sidelines.",
      buttonText: "BEGIN",
    },

    // Move 1: e6
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e4, correctMove: 'e6',
      prompt: "Your move.", hint: "e6.", correctFeedback: "e6.", wrongFeedback: "e6.",
    },

    // Move 2: d5
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d4, correctMove: 'd5',
      prompt: "Your move.", hint: "d5.", correctFeedback: "d5.", wrongFeedback: "d5.",
    },

    // Move 3: Nf6
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Nf6',
      prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },

    // Move 4: dxe4 (Burn Variation)
    { type: 'instruction', fen: FEN.after_Bg5, text: "4.Bg5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bg5, correctMove: 'dxe4',
      prompt: "Your move.", hint: "dxe4.", correctFeedback: "dxe4.", wrongFeedback: "dxe4.",
    },

    // Move 5: Be7
    { type: 'instruction', fen: FEN.after_Nxe4, text: "5.Nxe4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'Be7',
      prompt: "Your move.", hint: "Be7.", correctFeedback: "Be7.", wrongFeedback: "Be7.",
    },

    // Move 6: Bxf6
    { type: 'instruction', fen: FEN.after_Nxf6p, text: "6.Nxf6+.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nxf6p, correctMove: 'Bxf6',
      prompt: "Your move.", hint: "Bxf6.", correctFeedback: "Bxf6.", wrongFeedback: "Bxf6.",
    },

    // Move 7: Qxf6
    { type: 'instruction', fen: FEN.after_Bxf6xf6, text: "7.Bxf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bxf6xf6, correctMove: 'Qxf6',
      prompt: "Your move.", hint: "Qxf6.", correctFeedback: "Qxf6.", wrongFeedback: "Qxf6.",
    },

    // Move 8: O-O
    { type: 'instruction', fen: FEN.burn_after_Nf3, text: "8.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.burn_after_Nf3, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },

    // Move 9: c5
    { type: 'instruction', fen: FEN.burn_after_Qd3, text: "9.Qd3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.burn_after_Qd3, correctMove: 'c5',
      prompt: "Your move.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },

    // Move 10: Nc6
    { type: 'instruction', fen: FEN.burn_after_OOO, text: "10.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.burn_after_OOO, correctMove: 'Nc6',
      prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },

    // Move 11: Rfd8
    { type: 'instruction', fen: FEN.burn_after_dxc5, text: "11.dxc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.burn_after_dxc5, correctMove: 'Rfd8',
      prompt: "Your move.", hint: "Rfd8.", correctFeedback: "Rfd8.", wrongFeedback: "Rfd8.",
    },

    // Move 12: e5
    { type: 'instruction', fen: FEN.burn_after_Rfd8, text: "12.Qe2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.burn_after_Rfd8, correctMove: 'e5',
      prompt: "Your move.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5.",
    },

    // Move 13: Qf5
    { type: 'instruction', fen: FEN.burn_after_e5, text: "13.Kb1.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.burn_after_e5, correctMove: 'Qf5',
      prompt: "Your move.", hint: "Qf5.", correctFeedback: "Qf5.", wrongFeedback: "Qf5.",
    },

    // ═══════════════════════════════════════════
    // PART 2: Face 3.e5? and punish
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "White tries a different approach. Handle it.",
    },

    // 3.e5? (auto-advance)
    { type: 'instruction', fen: FEN.pe5_after_e5, text: "3.e5?", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe5_after_e5, correctMove: 'c5',
      prompt: "Your move.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },

    // 4.c3 (auto-advance)
    { type: 'instruction', fen: FEN.pe5_after_c3, text: "4.c3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe5_after_c3, correctMove: 'Nc6',
      prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },

    // ═══════════════════════════════════════════
    // PART 3: Face 3.Bd3? and punish
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "One more variation. White plays passively.",
    },

    // 3.Bd3? (auto-advance)
    { type: 'instruction', fen: FEN.fr2p_after_Bd3, text: "3.Bd3?", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fr2p_after_Bd3, correctMove: 'dxe4',
      prompt: "Your move.", hint: "dxe4.", correctFeedback: "dxe4.", wrongFeedback: "dxe4.",
    },

    // 4.Bxe4 (auto-advance)
    { type: 'instruction', fen: FEN.fr2p_after_Bxe4, text: "4.Bxe4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.fr2p_after_Bxe4, correctMove: 'Nf6',
      prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.",
    },

    // ═══════════════════════════════════════════
    // PART 4: Tarrasch — c5, exd5, Nc6
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Now the Tarrasch. White plays Nd2.",
    },

    // 3.Nd2 (auto-advance)
    { type: 'instruction', fen: FEN.tar_after_Nd2, text: "3.Nd2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.tar_after_Nd2, correctMove: 'c5',
      prompt: "Your move.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.tar_after_exd5, text: "4.exd5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.tar_after_exd5, correctMove: 'exd5',
      prompt: "Your move.", hint: "exd5.", correctFeedback: "exd5.", wrongFeedback: "exd5.",
    },
    { type: 'instruction', fen: FEN.tar_after_Ngf3, text: "5.Ngf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.tar_after_Ngf3, correctMove: 'Nc6',
      prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },

    // ═══════════════════════════════════════════
    // PART 5: Winawer — Bb4, c5, Bxc3+
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Final variation. The Winawer.",
    },

    {
      type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4',
      prompt: "Your move.", hint: "Bb4.", correctFeedback: "Bb4.", wrongFeedback: "Bb4.",
    },
    { type: 'instruction', fen: FEN.win_after_e5, text: "4.e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.win_after_e5, correctMove: 'c5',
      prompt: "Your move.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },
    { type: 'instruction', fen: FEN.win_after_a3, text: "5.a3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.win_after_a3, correctMove: 'Bxc3+',
      prompt: "Your move.", hint: "Bxc3+.", correctFeedback: "Bxc3+.", wrongFeedback: "Bxc3+.",
    },
    { type: 'instruction', fen: FEN.win_after_bxc3, text: "6.bxc3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.win_after_bxc3, correctMove: 'Ne7',
      prompt: "Your move.", hint: "Ne7.", correctFeedback: "Ne7.", wrongFeedback: "Ne7.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

const FRENCH_LESSONS: Record<string, OpeningLesson> = {
  'fr-1': FR_LESSON_1,
  'fr-2': FR_LESSON_2,
  'fr-punish-e5': FR_PUNISH_E5,
  'fr-punish-bd3': FR_PUNISH_BD3,
  'fr-3': FR_LESSON_3,
  'fr-tarrasch-1': FR_TARRASCH_1,
  'fr-4': FR_LESSON_4,
  'fr-winawer-1': FR_WINAWER_1,
  'fr-winawer-2': FR_WINAWER_2,
  'fr-test-1': FR_TEST_1,
}

export function getFrenchLesson(id: string): OpeningLesson | undefined {
  return FRENCH_LESSONS[id]
}
