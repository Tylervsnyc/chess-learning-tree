import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// FRENCH DEFENSE LESSONS (fr-1 through fr-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7 7.f4 O-O 8.Nf3 c5 9.dxc5 Nc6 10.Qd2 Qxc5 11.O-O-O f6 12.exf6 Nxf6
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
  after_Be7: 'rnbqk2r/ppp1bppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR w KQkq - 4 5',
  after_e5: 'rnbqk2r/ppp1bppp/4pn2/3pP1B1/3P4/2N5/PPP2PPP/R2QKBNR b KQkq - 0 5',
  after_Nfd7: 'rnbqk2r/pppnbppp/4p3/3pP1B1/3P4/2N5/PPP2PPP/R2QKBNR w KQkq - 1 6',
  after_Bxe7: 'rnbqk2r/pppnBppp/4p3/3pP3/3P4/2N5/PPP2PPP/R2QKBNR b KQkq - 0 6',
  after_Qxe7: 'rnb1k2r/pppnqppp/4p3/3pP3/3P4/2N5/PPP2PPP/R2QKBNR w KQkq - 0 7',
  after_f4: 'rnb1k2r/pppnqppp/4p3/3pP3/3P1P2/2N5/PPP3PP/R2QKBNR b KQkq - 0 7',
  after_OO: 'rnb2rk1/pppnqppp/4p3/3pP3/3P1P2/2N5/PPP3PP/R2QKBNR w KQ - 1 8',
  after_Nf3: 'rnb2rk1/pppnqppp/4p3/3pP3/3P1P2/2N2N2/PPP3PP/R2QKB1R b KQ - 2 8',
  after_c5: 'rnb2rk1/pp1nqppp/4p3/2ppP3/3P1P2/2N2N2/PPP3PP/R2QKB1R w KQ - 0 9',
  after_dxc5: 'rnb2rk1/pp1nqppp/4p3/2PpP3/5P2/2N2N2/PPP3PP/R2QKB1R b KQ - 0 9',
  after_Nc6: 'r1b2rk1/pp1nqppp/2n1p3/2PpP3/5P2/2N2N2/PPP3PP/R2QKB1R w KQ - 1 10',
  after_Qd2: 'r1b2rk1/pp1nqppp/2n1p3/2PpP3/5P2/2N2N2/PPPQ2PP/R3KB1R b KQ - 2 10',
  after_Qxc5: 'r1b2rk1/pp1n1ppp/2n1p3/2qpP3/5P2/2N2N2/PPPQ2PP/R3KB1R w KQ - 0 11',
  after_OOO: 'r1b2rk1/pp1n1ppp/2n1p3/2qpP3/5P2/2N2N2/PPPQ2PP/2KR1B1R b - - 1 11',
  after_f6: 'r1b2rk1/pp1n2pp/2n1pp2/2qpP3/5P2/2N2N2/PPPQ2PP/2KR1B1R w - - 0 12',
  after_exf6: 'r1b2rk1/pp1n2pp/2n1pP2/2qp4/5P2/2N2N2/PPPQ2PP/2KR1B1R b - - 0 12',
  after_Nxf6: 'r1b2rk1/pp4pp/2n1pn2/2qp4/5P2/2N2N2/PPPQ2PP/2KR1B1R w - - 0 13',

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
// LESSON 2: Pin & Resolve
// Teaches: 4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7
// Recap: e6, d5, Nf6
// ═══════════════════════════════════════════════════════════

export const FR_LESSON_2: OpeningLesson = {
  id: 'fr-2',
  title: 'Pin & Resolve',
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
    // ACT 2: TEACH (4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Now White pins your knight with Bg5. This is the Classical French — the most testing line. Don't panic.",
    },

    // --- White plays 4.Bg5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Bg5,
      text: "4.Bg5 — the pin. Your knight on f6 is pinned to the queen.",
      autoAdvance: 800,
    },

    // --- Black plays 4...Be7 ---
    {
      type: 'instruction',
      fen: FEN.after_Bg5,
      text: "Play Be7 — break the pin calmly. The bishop defends f6 and prepares castling.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'Be7',
      prompt: "Break the pin.",
      hint: "Bishop to e7 — block the pin and prepare castling.",
      correctFeedback: "Be7! The pin is broken. Your knight is free again.",
      wrongFeedback: "Play Be7 to break the pin on your knight.",
      highlightSquares: ['f8', 'e7'],
    },

    // --- White plays 5.e5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "5.e5 — White pushes forward, kicking your knight. This is the critical moment of the Classical French.",
      autoAdvance: 800,
    },

    // --- Black plays 5...Nfd7 ---
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Retreat the knight to d7. It looks passive, but from d7 it supports c5 — your key counterattack move later.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nfd7',
      prompt: "The knight must retreat. Where?",
      hint: "Knight back to d7 — it stays active and supports c5.",
      correctFeedback: "Nfd7! The knight retreats but stays useful. It'll support the c5 break.",
      wrongFeedback: "Retreat the f6 knight to d7 — it supports the coming c5 push.",
      highlightSquares: ['f6', 'd7'],
    },

    // --- White plays 6.Bxe7 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Bxe7,
      text: "6.Bxe7 — White trades the bishop. Now recapture.",
      autoAdvance: 800,
    },

    // --- Black plays 6...Qxe7 ---
    {
      type: 'instruction',
      fen: FEN.after_Bxe7,
      text: "Take back with the queen! Qxe7 puts your queen on a useful square and keeps your pawn structure intact.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bxe7,
      correctMove: 'Qxe7',
      prompt: "Recapture — keep the structure clean.",
      hint: "Queen takes on e7.",
      correctFeedback: "Qxe7! Clean recapture. Your queen is active and you're ready to castle.",
      wrongFeedback: "Take back with the queen — Qxe7.",
      highlightSquares: ['d8', 'e7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 5.Bd3? (passive)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "What if White plays passively instead of e5? Imagine 5.Bd3 — can you take advantage?",
    },

    // 5.Bd3? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr3p_after_Bd3,
      text: "5.Bd3? Passive. White blocks in their own d-pawn.",
      autoAdvance: 800,
    },

    // 5...dxe4 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr3p_after_Bd3,
      correctMove: 'dxe4',
      prompt: "White wasted a tempo. Win the center!",
      hint: "Take the e4 pawn — dxe4.",
      correctFeedback: "dxe4! You win a center pawn. White's bishop must waste time recapturing.",
      wrongFeedback: "Take on e4 — capture the pawn while the bishop blocks White's position.",
      highlightSquares: ['d5', 'e4'],
    },

    // 6.Bxe4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr3p_after_Bxe4,
      text: "6.Bxe4 — forced.",
      autoAdvance: 800,
    },

    // 6...Nxe4 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr3p_after_Bxe4,
      correctMove: 'Nxe4',
      prompt: "Take the bishop!",
      hint: "Knight captures on e4.",
      correctFeedback: "Nxe4! You won a bishop for a knight AND destroyed White's center. That's the cost of playing passively against the French.",
      wrongFeedback: "Capture the bishop with Nxe4.",
      highlightSquares: ['f6', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay Be7, Nfd7, Qxe7)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Let's run it back. Play the three Black moves from this lesson.",
      buttonText: "LET'S GO",
    },

    // 4.Bg5
    { type: 'instruction', fen: FEN.after_Bg5, text: "4.Bg5.", autoAdvance: 800 },
    // Recall: Be7
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'Be7',
      prompt: "Your move.",
      hint: "Be7.",
      correctFeedback: "Be7.",
      wrongFeedback: "Be7.",
    },
    // 5.e5
    { type: 'instruction', fen: FEN.after_e5, text: "5.e5.", autoAdvance: 800 },
    // Recall: Nfd7
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nfd7',
      prompt: "Your move.",
      hint: "Nfd7.",
      correctFeedback: "Nfd7.",
      wrongFeedback: "Nfd7.",
    },
    // 6.Bxe7
    { type: 'instruction', fen: FEN.after_Bxe7, text: "6.Bxe7.", autoAdvance: 800 },
    // Recall: Qxe7
    {
      type: 'play-move',
      fen: FEN.after_Bxe7,
      correctMove: 'Qxe7',
      prompt: "Your move.",
      hint: "Qxe7.",
      correctFeedback: "Qxe7.",
      wrongFeedback: "Qxe7.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Castle & Counter
// Teaches: 7.f4 O-O 8.Nf3 c5 9.dxc5 Nc6
// Recap: Be7, Nfd7, Qxe7
// ═══════════════════════════════════════════════════════════

export const FR_LESSON_3: OpeningLesson = {
  id: 'fr-3',
  title: 'Castle & Counter',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (Be7, Nfd7, Qxe7)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Quick recap — play the moves from last lesson.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: "4.Bg5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'Be7',
      prompt: "Break the pin.",
      hint: "Be7.",
      correctFeedback: "Be7.",
      wrongFeedback: "Be7.",
      highlightSquares: ['f8', 'e7'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: "5.e5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nfd7',
      prompt: "Retreat.",
      hint: "Nfd7.",
      correctFeedback: "Nfd7.",
      wrongFeedback: "Nfd7.",
      highlightSquares: ['f6', 'd7'],
    },
    { type: 'instruction', fen: FEN.after_Bxe7, text: "6.Bxe7.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bxe7,
      correctMove: 'Qxe7',
      prompt: "Recapture.",
      hint: "Qxe7.",
      correctFeedback: "Qxe7.",
      wrongFeedback: "Qxe7.",
      highlightSquares: ['d8', 'e7'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (7.f4 O-O 8.Nf3 c5 9.dxc5 Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxe7,
      text: "White's pawn on e5 gives them space, but it's also a target. Your plan: castle, then break with c5!",
    },

    // --- White plays 7.f4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "7.f4 — White supports e5. But the king is now exposed.",
      autoAdvance: 800,
    },

    // --- Black plays 7...O-O ---
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "Castle! Get your king to safety. White pushed f4, weakening their own king position.",
    },
    {
      type: 'play-move',
      fen: FEN.after_f4,
      correctMove: 'O-O',
      prompt: "King safety first.",
      hint: "Castle kingside.",
      correctFeedback: "O-O! Your king is safe. Now prepare the counterattack.",
      wrongFeedback: "Castle — get your king to safety.",
      highlightSquares: ['e8', 'g8'],
    },

    // --- White plays 8.Nf3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "8.Nf3 — White develops the last minor piece.",
      autoAdvance: 800,
    },

    // --- Black plays 8...c5 ---
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Play c5! This is the key move in the French. Attack d4 — the base of White's pawn chain. If d4 falls, e5 falls too.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: "Attack the base of the pawn chain!",
      hint: "Push c5 — strike at d4.",
      correctFeedback: "c5! The classic French break. You're undermining White's entire center.",
      wrongFeedback: "Play c5 — attack d4, the base of the pawn chain.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // --- White plays 9.dxc5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_dxc5,
      text: "9.dxc5 — White captures. The d4 pawn is gone!",
      autoAdvance: 800,
    },

    // --- Black plays 9...Nc6 ---
    {
      type: 'instruction',
      fen: FEN.after_dxc5,
      text: "Develop the knight to c6. It attacks e5 and keeps the pressure on White's center.",
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
      correctMove: 'Nc6',
      prompt: "Develop with a purpose.",
      hint: "Knight to c6 — attack e5.",
      correctFeedback: "Nc6! Attacking e5. White's center is under siege.",
      wrongFeedback: "Play Nc6 — develop and attack e5.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'e5'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 7.Bd3? (should play f4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxe7,
      text: "What if White plays passively with 7.Bd3 instead of f4? You can seize the initiative.",
    },

    // 7.Bd3? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr4p_after_Bd3,
      text: "7.Bd3? Slow. White doesn't support e5 with f4.",
      autoAdvance: 800,
    },

    // 7...c5 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr4p_after_Bd3,
      correctMove: 'c5',
      prompt: "White was too slow. Attack now!",
      hint: "Push c5 — hit d4 immediately.",
      correctFeedback: "c5! Without f4, White can't hold the center. The d4 pawn is under fire.",
      wrongFeedback: "Play c5 — attack d4 while White is slow.",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    // 8.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.fr4p_after_Nf3,
      text: "8.Nf3 — trying to catch up on development.",
      autoAdvance: 800,
    },

    // 8...Nc6 (user plays)
    {
      type: 'play-move',
      fen: FEN.fr4p_after_Nf3,
      correctMove: 'Nc6',
      prompt: "Develop and pile on.",
      hint: "Knight to c6 — increase the pressure.",
      correctFeedback: "Nc6! You're fully developed while White's king is still in the center. That's the cost of playing Bd3 too early.",
      wrongFeedback: "Develop Nc6 — pile on the pressure.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (replay O-O, c5, Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Qxe7,
      text: "Run it back. Play the three Black moves.",
      buttonText: "LET'S GO",
    },

    // 7.f4
    { type: 'instruction', fen: FEN.after_f4, text: "7.f4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_f4,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    // 8.Nf3
    { type: 'instruction', fen: FEN.after_Nf3, text: "8.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    // 9.dxc5
    { type: 'instruction', fen: FEN.after_dxc5, text: "9.dxc5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
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
// Teaches: 10.Qd2 Qxc5 11.O-O-O f6 12.exf6 Nxf6
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
      fen: FEN.after_Qxe7,
      text: "Quick recap — play the moves from last lesson.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_f4, text: "7.f4.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_f4,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
      highlightSquares: ['e8', 'g8'],
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: "8.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: "The break.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },
    { type: 'instruction', fen: FEN.after_dxc5, text: "9.dxc5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
      correctMove: 'Nc6',
      prompt: "Develop.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (10.Qd2 Qxc5 11.O-O-O f6 12.exf6 Nxf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "You've broken through the center. Now it's time to win back the pawn and open the position for your pieces.",
    },

    // --- White plays 10.Qd2 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "10.Qd2 — White prepares to castle queenside.",
      autoAdvance: 800,
    },

    // --- Black plays 10...Qxc5 ---
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "Take the c5 pawn with your queen! You win back the material and centralize.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'Qxc5',
      prompt: "Win back the pawn.",
      hint: "Queen captures on c5.",
      correctFeedback: "Qxc5! Material is equal and your queen is perfectly placed.",
      wrongFeedback: "Take the pawn — Qxc5.",
      highlightSquares: ['e7', 'c5'],
    },

    // --- White plays 11.O-O-O (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "11.O-O-O — opposite-side castling! This means both sides will attack the other's king.",
      autoAdvance: 800,
    },

    // --- Black plays 11...f6 ---
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "Play f6! This is the killing blow. You challenge e5 — White's last central outpost. When it falls, your pieces flood the center.",
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'f6',
      prompt: "Smash through! Challenge the e5 pawn.",
      hint: "Push f6 — break down White's last central pawn.",
      correctFeedback: "f6! The final break. White's e5 pawn is doomed.",
      wrongFeedback: "Play f6 — challenge the e5 pawn.",
      highlightSquares: ['f7', 'f6'],
      postMoveArrow: ['f6', 'e5'],
    },

    // --- White plays 12.exf6 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_exf6,
      text: "12.exf6 — White captures. Now recapture and dominate.",
      autoAdvance: 800,
    },

    // --- Black plays 12...Nxf6 ---
    {
      type: 'instruction',
      fen: FEN.after_exf6,
      text: "Recapture with the knight! Nxf6 develops your knight to a strong central square. The position is wide open and you're fully developed.",
    },
    {
      type: 'play-move',
      fen: FEN.after_exf6,
      correctMove: 'Nxf6',
      prompt: "Recapture and complete the setup.",
      hint: "Knight takes on f6.",
      correctFeedback: "Nxf6! The French Defense is complete. You have a beautiful position — fully developed, open lines, active pieces. White has to be careful.",
      wrongFeedback: "Take back with the knight — Nxf6.",
      highlightSquares: ['d7', 'f6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: RECALL (replay Qxc5, f6, Nxf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "One more time. Play the three finishing moves.",
      buttonText: "LET'S GO",
    },

    // 10.Qd2
    { type: 'instruction', fen: FEN.after_Qd2, text: "10.Qd2.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'Qxc5',
      prompt: "Your move.",
      hint: "Qxc5.",
      correctFeedback: "Qxc5.",
      wrongFeedback: "Qxc5.",
    },
    // 11.O-O-O
    { type: 'instruction', fen: FEN.after_OOO, text: "11.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'f6',
      prompt: "Your move.",
      hint: "f6.",
      correctFeedback: "f6.",
      wrongFeedback: "f6.",
    },
    // 12.exf6
    { type: 'instruction', fen: FEN.after_exf6, text: "12.exf6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exf6,
      correctMove: 'Nxf6',
      prompt: "Your move.",
      hint: "Nxf6.",
      correctFeedback: "Nxf6.",
      wrongFeedback: "Nxf6.",
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
    // PART 1: Full Classical main line (12 moves, no hand-holding)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Level 1 Test. Play the full French Classical from memory. Then handle the variations.",
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

    // Move 4: Be7
    { type: 'instruction', fen: FEN.after_Bg5, text: "4.Bg5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bg5, correctMove: 'Be7',
      prompt: "Your move.", hint: "Be7.", correctFeedback: "Be7.", wrongFeedback: "Be7.",
    },

    // Move 5: Nfd7
    { type: 'instruction', fen: FEN.after_e5, text: "5.e5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e5, correctMove: 'Nfd7',
      prompt: "Your move.", hint: "Nfd7.", correctFeedback: "Nfd7.", wrongFeedback: "Nfd7.",
    },

    // Move 6: Qxe7
    { type: 'instruction', fen: FEN.after_Bxe7, text: "6.Bxe7.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bxe7, correctMove: 'Qxe7',
      prompt: "Your move.", hint: "Qxe7.", correctFeedback: "Qxe7.", wrongFeedback: "Qxe7.",
    },

    // Move 7: O-O
    { type: 'instruction', fen: FEN.after_f4, text: "7.f4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_f4, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },

    // Move 8: c5
    { type: 'instruction', fen: FEN.after_Nf3, text: "8.Nf3.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf3, correctMove: 'c5',
      prompt: "Your move.", hint: "c5.", correctFeedback: "c5.", wrongFeedback: "c5.",
    },

    // Move 9: Nc6
    { type: 'instruction', fen: FEN.after_dxc5, text: "9.dxc5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_dxc5, correctMove: 'Nc6',
      prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.",
    },

    // Move 10: Qxc5
    { type: 'instruction', fen: FEN.after_Qd2, text: "10.Qd2.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Qxc5',
      prompt: "Your move.", hint: "Qxc5.", correctFeedback: "Qxc5.", wrongFeedback: "Qxc5.",
    },

    // Move 11: f6
    { type: 'instruction', fen: FEN.after_OOO, text: "11.O-O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_OOO, correctMove: 'f6',
      prompt: "Your move.", hint: "f6.", correctFeedback: "f6.", wrongFeedback: "f6.",
    },

    // Move 12: Nxf6
    { type: 'instruction', fen: FEN.after_exf6, text: "12.exf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_exf6, correctMove: 'Nxf6',
      prompt: "Your move.", hint: "Nxf6.", correctFeedback: "Nxf6.", wrongFeedback: "Nxf6.",
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

export const FRENCH_LESSONS: OpeningLesson[] = [
  FR_LESSON_1,
  FR_LESSON_2,
  FR_PUNISH_E5,
  FR_PUNISH_BD3,
  FR_LESSON_3,
  FR_TARRASCH_1,
  FR_LESSON_4,
  FR_WINAWER_1,
  FR_WINAWER_2,
  FR_TEST_1,
]

export function getFrenchLesson(id: string): OpeningLesson | undefined {
  return FRENCH_LESSONS.find(l => l.id === id)
}
