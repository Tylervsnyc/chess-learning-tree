import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PIRC DEFENSE LESSONS (pi-1 through pi-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c5
// Austrian: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d6:    'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_Nf6:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3',
  after_Nc3:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3',
  after_g6:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Nf3:   'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 1 4',
  after_Bg7:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 2 5',
  after_Be2:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R b KQkq - 3 5',
  after_OO:    'rnbq1rk1/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQ - 4 6',
  after_OO_w:  'rnbq1rk1/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 b - - 5 6',
  after_c5:    'rnbq1rk1/pp2ppbp/3p1np1/2p5/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 7',

  // pi-1 punish: White plays 4.Bc4? (developing aggressively, leaves e4 unprotected)
  // Black punishes with 4...Nxe4! then 5...d5 forking bishop and knight
  pi1_punish_after_Bc4:        'rnbqkb1r/ppp1pp1p/3p1np1/8/2BPP3/2N5/PPP2PPP/R1BQK1NR b KQkq - 1 4',
  pi1_punish_after_Nxe4:       'rnbqkb1r/ppp1pp1p/3p2p1/8/2BPn3/2N5/PPP2PPP/R1BQK1NR w KQkq - 0 5',
  pi1_punish_after_Nxe4_recap: 'rnbqkb1r/ppp1pp1p/3p2p1/8/2BPN3/8/PPP2PPP/R1BQK1NR b KQkq - 0 5',
  pi1_punish_after_d5:         'rnbqkb1r/ppp1pp1p/6p1/3p4/2BPN3/8/PPP2PPP/R1BQK1NR w KQkq - 0 6',

  // pi-2 punish: White plays 6.Bg5? (pin attempt before castling)
  // Black punishes with 6...h6! 7.Bh4 g5! driving the bishop away
  pi2_punish_after_Bg5: 'rnbq1rk1/ppp1ppbp/3p1np1/6B1/3PP3/2N2N2/PPP1BPPP/R2QK2R b KQ - 5 6',
  pi2_punish_after_h6:  'rnbq1rk1/ppp1ppb1/3p1npp/6B1/3PP3/2N2N2/PPP1BPPP/R2QK2R w KQ - 0 7',
  pi2_punish_after_Bh4: 'rnbq1rk1/ppp1ppb1/3p1npp/8/3PP2B/2N2N2/PPP1BPPP/R2QK2R b KQ - 1 7',
  pi2_punish_after_g5:  'rnbq1rk1/ppp1ppb1/3p1n1p/6p1/3PP2B/2N2N2/PPP1BPPP/R2QK2R w KQ - 0 8',

  // Punish: White overextends with f4 + e5 too early
  // Branch from after_g6 (after 3.Nc3 g6): 4.f4 Bg7 5.e5?! dxe5 6.fxe5 Nd5
  punish_after_f4:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4',
  punish_after_Bg7:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 1 5',
  punish_after_e5:    'rnbqk2r/ppp1ppbp/3p1np1/4P3/3P1P2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 5',
  punish_after_dxe5:  'rnbqk2r/ppp1ppbp/5np1/4p3/3P1P2/2N5/PPP3PP/R1BQKBNR w KQkq - 0 6',
  punish_after_fxe5:  'rnbqk2r/ppp1ppbp/5np1/4P3/3P4/2N5/PPP3PP/R1BQKBNR b KQkq - 0 6',
  punish_after_Nd5:   'rnbqk2r/ppp1ppbp/6p1/3nP3/3P4/2N5/PPP3PP/R1BQKBNR w KQkq - 1 7',

  // pi-3 punish: White plays 7.d5? (premature space grab after 6...c5)
  // Black punishes with 7...e6! breaking open the center, then 8...Bxe6
  pi3_punish_after_d5_space: 'rnbq1rk1/pp2ppbp/3p1np1/2pP4/4P3/2N2N2/PPP1BPPP/R1BQ1RK1 b - - 0 7',
  pi3_punish_after_e6:       'rnbq1rk1/pp3pbp/3ppnp1/2pP4/4P3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 8',
  pi3_punish_after_dxe6:     'rnbq1rk1/pp3pbp/3pPnp1/2p5/4P3/2N2N2/PPP1BPPP/R1BQ1RK1 b - - 0 8',
  pi3_punish_after_Bxe6:     'rn1q1rk1/pp3pbp/3pbnp1/2p5/4P3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 9',

  // Austrian Attack: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
  austrian_after_f4:  'rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4',
  austrian_after_Bg7: 'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 1 5',
  austrian_after_Nf3: 'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 2 5',
  austrian_after_OO:  'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R w KQ - 3 6',
  austrian_after_Bd3: 'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R b KQ - 4 6',

  // Austrian punish: After 5.Nf3 O-O 6.e5?! dxe5 7.fxe5 Nd5
  austrian_punish_after_e5:   'rnbq1rk1/ppp1ppbp/3p1np1/4P3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQ - 0 6',
  austrian_punish_after_dxe5: 'rnbq1rk1/ppp1ppbp/5np1/4p3/3P1P2/2N2N2/PPP3PP/R1BQKB1R w KQ - 0 7',
  austrian_punish_after_fxe5: 'rnbq1rk1/ppp1ppbp/5np1/4P3/3P4/2N2N2/PPP3PP/R1BQKB1R b KQ - 0 7',
  austrian_punish_after_Nd5:  'rnbq1rk1/ppp1ppbp/6p1/3nP3/3P4/2N2N2/PPP3PP/R1BQKB1R w KQ - 1 8',

  // ─── pi-punish-Bc4: White plays 5.Bc4? after 4.Nf3 Bg7 ───
  // Branch from after_Bg7: 5.Bc4? Nxe4! 6.Nxe4 d5! (fork)
  punishBc4_after_Bc4:        'rnbqk2r/ppp1ppbp/3p1np1/8/2BPP3/2N2N2/PPP2PPP/R1BQK2R b KQkq - 3 5',
  punishBc4_after_Nxe4:       'rnbqk2r/ppp1ppbp/3p2p1/8/2BPn3/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 6',
  punishBc4_after_Nxe4_recap: 'rnbqk2r/ppp1ppbp/3p2p1/8/2BPN3/5N2/PPP2PPP/R1BQK2R b KQkq - 0 6',
  punishBc4_after_d5:         'rnbqk2r/ppp1ppbp/6p1/3p4/2BPN3/5N2/PPP2PPP/R1BQK2R w KQkq - 0 7',

  // ─── pi-4: After ...c5, main line continues ───
  // From after_c5: 7.Be3 Nc6 8.Qd2 e5
  pi4_after_Be3:  'rnbq1rk1/pp2ppbp/3p1np1/2p5/3PP3/2N1BN2/PPP1BPPP/R2Q1RK1 b - - 1 7',
  pi4_after_Nc6:  'r1bq1rk1/pp2ppbp/2np1np1/2p5/3PP3/2N1BN2/PPP1BPPP/R2Q1RK1 w - - 2 8',
  pi4_after_Qd2:  'r1bq1rk1/pp2ppbp/2np1np1/2p5/3PP3/2N1BN2/PPPQBPPP/R4RK1 b - - 3 8',
  pi4_after_e5:   'r1bq1rk1/pp3pbp/2np1np1/2p1p3/3PP3/2N1BN2/PPPQBPPP/R4RK1 w - - 0 9',
  // pi-4 punish: After 7.Be3 Nc6, White plays 8.d5? Na jumps to d4
  pi4_punish_after_d5:  'r1bq1rk1/pp2ppbp/2np1np1/2pP4/4P3/2N1BN2/PPP1BPPP/R2Q1RK1 b - - 0 8',
  pi4_punish_after_Nd4: 'r1bq1rk1/pp2ppbp/3p1np1/2pP4/3nP3/2N1BN2/PPP1BPPP/R2Q1RK1 w - - 1 9',

  // ─── pi-austrian-2: Austrian deeper — 6.Bd3 c5 ───
  // From austrian_after_OO: 6.Bd3 c5
  austrian2_after_Bd3:  'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R b KQ - 4 6',
  austrian2_after_c5:   'rnbq1rk1/pp2ppbp/3p1np1/2p5/3PPP2/2NB1N2/PPP3PP/R1BQK2R w KQ - 0 7',
  austrian2_after_dxc5: 'rnbq1rk1/pp2ppbp/3p1np1/2P5/4PP2/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 7',
  austrian2_after_dxc5_b: 'rnbq1rk1/pp2ppbp/5np1/2p5/4PP2/2NB1N2/PPP3PP/R1BQK2R w KQ - 0 8',
  // Austrian-2 punish: After 6.Bd3 c5, White plays 7.e5? too early
  austrian2_punish_after_e5:   'rnbq1rk1/pp2ppbp/3p1np1/2p1P3/3P1P2/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 7',
  austrian2_punish_after_dxe5: 'rnbq1rk1/pp2ppbp/5np1/2p1p3/3P1P2/2NB1N2/PPP3PP/R1BQK2R w KQ - 0 8',
  austrian2_punish_after_fxe5: 'rnbq1rk1/pp2ppbp/5np1/2p1P3/3P4/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 8',
  austrian2_punish_after_Ng4:  'rnbq1rk1/pp2ppbp/6p1/2p1P3/3P2n1/2NB1N2/PPP3PP/R1BQK2R w KQ - 1 9',

  // ─── pi-classical-1: Classical Be3 — 7.Be3 Nc6 8.d5 Na5 ───
  // Uses pi4_after_Be3 and pi4_after_Nc6 from above (same position)
  // Teach: 8.d5 Na5 (reroute knight)
  classical1_after_d5:  'r1bq1rk1/pp2ppbp/2np1np1/2pP4/4P3/2N1BN2/PPP1BPPP/R2Q1RK1 b - - 0 8',
  classical1_after_Na5: 'r1bq1rk1/pp2ppbp/3p1np1/n1pP4/4P3/2N1BN2/PPP1BPPP/R2Q1RK1 w - - 1 9',
  // Classical-1 punish: After Be3 Nc6, White plays dxc5? giving up center
  classical1_punish_after_dxc5:   'r1bq1rk1/pp2ppbp/2np1np1/2P5/4P3/2N1BN2/PPP1BPPP/R2Q1RK1 b - - 0 8',
  classical1_punish_after_dxc5_b: 'r1bq1rk1/pp2ppbp/2n2np1/2p5/4P3/2N1BN2/PPP1BPPP/R2Q1RK1 w - - 0 9',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Pirc Setup
// Teaches: 1.e4 d6 2.d4 Nf6 3.Nc3 g6
// BLACK opening — user plays Black moves, White auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const PI_LESSON_1: OpeningLesson = {
  id: 'pi-1',
  title: 'The Pirc Setup',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: No recap (first lesson of the opening)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1.e4 d6 2.d4 Nf6 3.Nc3 g6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Pirc Defense — a sneaky, modern way to play as Black. You let White build the center, then tear it down.",
    },

    // --- White plays 1.e4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },

    // --- Black plays 1...d6 ---
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Most players respond with 1...e5. But in the Pirc, you play 1...d6 — a modest pawn move that says 'go ahead, take the center.'",
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc — play a humble pawn move.",
      hint: "Push your d-pawn one square. Let White have the center for now.",
      correctFeedback: "d6! Quiet but purposeful. You're preparing to develop your knight to f6 next, attacking White's e4 pawn.",
      wrongFeedback: "In the Pirc, Black starts with d6 — a modest pawn move that keeps your options open.",
      highlightSquares: ['d7', 'd6'],
    },

    // --- White plays 2.d4 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4 — White builds a big center with two pawns. That's exactly what we want.",
      autoAdvance: 800,
    },

    // --- Black plays 2...Nf6 ---
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Now develop your knight to f6. It attacks the e4 pawn and starts putting pressure on White's center.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Develop a piece that attacks White's center.",
      hint: "Your knight can go to f6, where it eyes the e4 pawn.",
      correctFeedback: "Nf6! Your knight is aiming right at e4. White has to decide how to defend it.",
      wrongFeedback: "Develop your knight toward the center — f6 attacks the e4 pawn.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // --- White plays 3.Nc3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3 — White defends e4. A natural developing move.",
      autoAdvance: 800,
    },

    // --- Black plays 3...g6 ---
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Here's the key Pirc move: 3...g6. You're preparing to fianchetto your bishop to g7, where it'll become a long-range sniper aimed at White's center.",
      highlightSquares: ['g7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Prepare the fianchetto — make room for your bishop on g7.",
      hint: "Push your g-pawn one square to open the diagonal for your bishop.",
      correctFeedback: "g6! The fianchetto setup. Next you'll put your bishop on g7 — a powerful diagonal that cuts through White's entire center.",
      wrongFeedback: "In the Pirc, we play g6 to prepare Bg7 — the fianchetto.",
      highlightSquares: ['g7', 'g6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 4.Bc4? (aggressive but leaves e4 hanging)
    // After 3.Nc3 g6, White plays 4.Bc4? instead of 4.Nf3.
    // Black punishes with 4...Nxe4! 5.Nxe4 d5 forking bishop and knight.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "White makes a mistake here. Instead of 4.Nf3, they play 4.Bc4 — developing aggressively but forgetting to protect e4. Can you punish it?",
    },

    // 4.Bc4? (auto-advance — White's mistake)
    {
      type: 'instruction',
      fen: FEN.pi1_punish_after_Bc4,
      text: "4.Bc4? The bishop looks active, but nobody's guarding the e4 pawn anymore.",
      autoAdvance: 800,
    },

    // 4...Nxe4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.pi1_punish_after_Bc4,
      correctMove: 'Nxe4',
      prompt: "White left a pawn unprotected. Grab it!",
      hint: "Your knight on f6 can capture the e4 pawn — nothing is defending it.",
      correctFeedback: "Nxe4! Free pawn. The bishop on c4 doesn't protect e4 at all.",
      wrongFeedback: "Look at the e4 pawn — who's defending it? Nobody! Take it with your knight.",
      highlightSquares: ['f6', 'e4'],
    },

    // 5.Nxe4 (auto-advance — White recaptures)
    {
      type: 'instruction',
      fen: FEN.pi1_punish_after_Nxe4_recap,
      text: "5.Nxe4 — White recaptures, but now watch this...",
      autoAdvance: 800,
    },

    // 5...d5! (user plays the fork)
    {
      type: 'play-move',
      fen: FEN.pi1_punish_after_Nxe4_recap,
      correctMove: 'd5',
      prompt: "Hit two pieces at once!",
      hint: "Push d5 — it attacks both the knight on e4 and the bishop on c4.",
      correctFeedback: "d5! A fork — the pawn attacks the knight AND the bishop. White has to lose one of them. You're already winning.",
      wrongFeedback: "Push d5 — it forks the knight on e4 and the bishop on c4!",
      highlightSquares: ['d6', 'd5'],
      postMoveArrow: ['d5', 'c4'],
    },

    {
      type: 'instruction',
      fen: FEN.pi1_punish_after_d5,
      text: "White has to move both pieces, but can only save one. You won a pawn and have a strong center. That's what happens when White gets too aggressive without protecting e4.",
      highlightSquares: ['d5', 'c4', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL (user replays Black moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three Black moves of the Pirc setup.",
      buttonText: "LET'S GO",
    },

    // 1.e4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },

    // 2.d4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },

    // 3.Nc3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Your move.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
    },

  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: The Dragon Bishop
// Teaches: 4.Nf3 Bg7 5.Be2 O-O
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6
// ═══════════════════════════════════════════════════════════

export const PI_LESSON_2: OpeningLesson = {
  id: 'pi-2',
  title: 'The Dragon Bishop',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 d6 2.d4 Nf6 3.Nc3 g6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's pick up where we left off. Play the Pirc setup moves.",
      buttonText: "LET'S GO",
    },
    // 1.e4
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "The modest first move.",
      correctFeedback: "d6.",
      wrongFeedback: "Pirc starts with d6.",
      highlightSquares: ['d7', 'd6'],
    },
    // 2.d4
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Attack the center.",
      hint: "Knight to f6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Knight to f6 attacks e4.",
      highlightSquares: ['g8', 'f6'],
    },
    // 3.Nc3
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Prepare the fianchetto.",
      hint: "g6 opens the diagonal.",
      correctFeedback: "g6 — ready for the bishop.",
      wrongFeedback: "g6 prepares Bg7.",
      highlightSquares: ['g7', 'g6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4.Nf3 Bg7 5.Be2 O-O)
    // ═══════════════════════════════════════════

    // --- White plays 4.Nf3 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3 — White develops naturally. Now it's time for the star of the Pirc.",
      autoAdvance: 800,
    },

    // --- Black plays 4...Bg7 ---
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Put your bishop on g7. This is called a fianchetto — the bishop sits on a long diagonal and becomes incredibly powerful. Some players call this the 'Dragon Bishop' because of the diagonal it controls.",
      highlightSquares: ['g7', 'a1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Unleash the Dragon Bishop!",
      hint: "Place your bishop on g7 — the fianchetto square.",
      correctFeedback: "Bg7! Your bishop is aiming at the entire center from a1 to h8. It's a long-range weapon.",
      wrongFeedback: "Put the bishop on g7 — that's where it becomes a monster.",
      highlightSquares: ['f8', 'g7'],
      postMoveArrow: ['g7', 'a1'],
    },

    // --- White plays 5.Be2 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "5.Be2 — White develops their bishop modestly. A calm Classical setup.",
      autoAdvance: 800,
    },

    // --- Black plays 5...O-O ---
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "Castle now! Your king is safe, your rook activates, and you're ready to start your counterattack.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "Get your king to safety.",
      hint: "Castle kingside — your fianchetto makes it a fortress.",
      correctFeedback: "Castled! Your king is tucked behind the fianchetto — safe and sound. Now you're ready to fight.",
      wrongFeedback: "Castle kingside to get your king safe.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 6.Bg5? (pin attempt before castling)
    // After 5...O-O, White plays 6.Bg5? trying to pin the knight.
    // Black punishes with 6...h6! 7.Bh4 g5! driving the bishop away.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White makes a mistake here. Instead of castling, they play 6.Bg5 — trying to pin your knight. Can you punish it?",
    },

    // 6.Bg5? (auto-advance — White's mistake)
    {
      type: 'instruction',
      fen: FEN.pi2_punish_after_Bg5,
      text: "6.Bg5? It looks natural, but White hasn't castled and the pin is easy to break.",
      autoAdvance: 800,
    },

    // 6...h6! (user punishes)
    {
      type: 'play-move',
      fen: FEN.pi2_punish_after_Bg5,
      correctMove: 'h6',
      prompt: "Kick the bishop! Where should it go?",
      hint: "Push h6 — the bishop on g5 has to make an awkward choice.",
      correctFeedback: "h6! The bishop has nowhere good to go. It's being pushed around.",
      wrongFeedback: "Push h6 — challenge the bishop directly.",
      highlightSquares: ['h7', 'h6'],
    },

    // 7.Bh4 (auto-advance — White retreats)
    {
      type: 'instruction',
      fen: FEN.pi2_punish_after_Bh4,
      text: "7.Bh4 — the only square that keeps the pin. But you're not done yet...",
      autoAdvance: 800,
    },

    // 7...g5! (user plays the winning push)
    {
      type: 'play-move',
      fen: FEN.pi2_punish_after_Bh4,
      correctMove: 'g5',
      prompt: "Keep attacking the bishop!",
      hint: "Push g5 — drive the bishop completely off the board.",
      correctFeedback: "g5! The bishop is driven to a terrible square. White wasted two moves and hasn't castled — you're ahead in development.",
      wrongFeedback: "Push g5 to chase the bishop even further away!",
      highlightSquares: ['g6', 'g5'],
    },

    {
      type: 'instruction',
      fen: FEN.pi2_punish_after_g5,
      text: "White spent two moves on a bishop that got chased away. Meanwhile, you're castled and ready to attack. That's the cost of an early Bg5 — it just gets punished.",
      highlightSquares: ['h4', 'g5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "Play the two new Black moves from this lesson.",
      buttonText: "LET'S GO",
    },
    // 4.Nf3
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
    // 5.Be2
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "5.Be2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Punish the Overextension
// Teaches: When White pushes f4 + e5 too early, Black exploits it
// Branch from after 3.Nc3 g6: 4.f4 Bg7 5.e5?! dxe5 6.fxe5 Nd5
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6
// ═══════════════════════════════════════════════════════════

export const PI_PUNISH_F4: OpeningLesson = {
  id: 'pi-punish-f4',
  title: 'Punish the Overextension',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 d6 2.d4 Nf6 3.Nc3 g6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the Pirc setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "The fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — White overextends
    // 4.f4 Bg7 5.e5?! dxe5 6.fxe5 Nd5!
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "Some White players get aggressive and push f4 — the Austrian Attack. But sometimes they go too far, too fast.",
    },

    // 4.f4 (auto-advance — White's aggressive move)
    {
      type: 'instruction',
      fen: FEN.punish_after_f4,
      text: "4.f4! Aggressive — White wants to push f5 or e5. But we stay calm.",
      autoAdvance: 800,
    },

    // 4...Bg7 (teach move)
    {
      type: 'instruction',
      fen: FEN.punish_after_f4,
      text: "Even though White looks scary, stick to the plan. Fianchetto your bishop — it's even more powerful when White's center is overextended.",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f4,
      correctMove: 'Bg7',
      prompt: "Stay cool. Fianchetto as planned.",
      hint: "Bishop to g7 — your plan doesn't change just because White played f4.",
      correctFeedback: "Bg7! Calm and strong. Your bishop is already eyeing White's d4 pawn through the center.",
      wrongFeedback: "Fianchetto to g7 — same plan regardless of White's f4.",
      highlightSquares: ['f8', 'g7'],
    },

    // 5.e5?! (auto-advance — White's mistake)
    {
      type: 'instruction',
      fen: FEN.punish_after_e5,
      text: "5.e5?! White pushes too early! They haven't developed their pieces, and now the center is cracking open.",
      highlightSquares: ['e5', 'f4'],
      autoAdvance: 1500,
    },

    // 5...dxe5 (user plays the punishing capture)
    {
      type: 'play-move',
      fen: FEN.punish_after_e5,
      correctMove: 'dxe5',
      prompt: "The center is collapsing — capture the overextended pawn!",
      hint: "Take on e5 with your d-pawn. White pushed too fast.",
      correctFeedback: "dxe5! White's center just fell apart. The f4 pawn is now weak and exposed.",
      wrongFeedback: "Capture the e5 pawn — White overextended.",
      highlightSquares: ['d6', 'e5'],
    },

    // 6.fxe5 (auto-advance — White recaptures)
    {
      type: 'instruction',
      fen: FEN.punish_after_fxe5,
      text: "6.fxe5 — White recaptures, but now the f-file is open and White's king is exposed. And your knight has a perfect square...",
      autoAdvance: 800,
    },

    // 6...Nd5! (user plays the star move)
    {
      type: 'play-move',
      fen: FEN.punish_after_fxe5,
      correctMove: 'Nd5',
      prompt: "Your knight has a dream square in the center. Find it!",
      hint: "Your knight can jump to d5 — a powerful central outpost that attacks c3.",
      correctFeedback: "Nd5! A monster knight in the center. It attacks the c3 knight, can't easily be pushed away, and White's center is in ruins.",
      wrongFeedback: "Look for a knight move to the center — d5 is calling.",
      highlightSquares: ['f6', 'd5'],
      postMoveArrow: ['d5', 'c3'],
    },

    {
      type: 'instruction',
      fen: FEN.punish_after_Nd5,
      text: "White pushed too fast and now you have a dominant knight, an open diagonal for your bishop, and White's king is stuck in the center. That's the Pirc at its best — patience rewarded.",
      highlightSquares: ['d5', 'g7'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "Run it back. After White plays f4, find the right responses.",
      buttonText: "LET'S GO",
    },
    // 4.f4
    {
      type: 'instruction',
      fen: FEN.punish_after_f4,
      text: "4.f4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f4,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
    // 5.e5?!
    {
      type: 'instruction',
      fen: FEN.punish_after_e5,
      text: "5.e5?!",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_e5,
      correctMove: 'dxe5',
      prompt: "Your move.",
      hint: "dxe5.",
      correctFeedback: "dxe5.",
      wrongFeedback: "dxe5.",
    },
    // 6.fxe5
    {
      type: 'instruction',
      fen: FEN.punish_after_fxe5,
      text: "6.fxe5.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_fxe5,
      correctMove: 'Nd5',
      prompt: "Your move.",
      hint: "Nd5.",
      correctFeedback: "Nd5.",
      wrongFeedback: "Nd5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: The Counterattack (...c5)
// Teaches: 6.O-O c5 — Black strikes at the center
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O
// ═══════════════════════════════════════════════════════════

export const PI_LESSON_3: OpeningLesson = {
  id: 'pi-3',
  title: 'The Counterattack',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (full line through 5...O-O)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay the full Pirc setup — all five Black moves.",
      buttonText: "LET'S GO",
    },
    // 1.e4
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    // 2.d4
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    // 3.Nc3
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },
    // 4.Nf3
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Dragon Bishop.",
      hint: "Fianchetto.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },
    // 5.Be2
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "5.Be2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: "King safety first.",
      correctFeedback: "Castled.",
      wrongFeedback: "Castle kingside.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (6.O-O c5)
    // ═══════════════════════════════════════════

    // 6.O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "6.O-O — White castles too. Both kings are safe. Now it's time to strike.",
      autoAdvance: 800,
    },

    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "You've been patient — developing pieces, castling safely. Now the Pirc comes alive. It's time to hit White's center with ...c5!",
      highlightSquares: ['c7', 'c5', 'd4'],
    },

    // 6...c5 (user plays the counterattack)
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'c5',
      prompt: "Strike at the center! Attack White's d4 pawn.",
      hint: "Push your c-pawn to c5 — it challenges the d4 pawn directly.",
      correctFeedback: "c5! The counterattack begins. White's d4 pawn is under fire, and your Bg7 is staring right through the center.",
      wrongFeedback: "Push c5 — challenge the d4 pawn!",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "This is the Pirc philosophy: let White build the center, develop your pieces, then hit it with ...c5. If White takes, your bishop on g7 rakes the open diagonal. If White doesn't, you keep pressing.",
      highlightSquares: ['g7', 'c5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 7.d5? (premature space grab)
    // After 6...c5, White responds 7.d5? closing the center.
    // Black punishes with 7...e6! breaking it open, then 8...Bxe6.
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "White makes a mistake here. Instead of keeping the tension, they push 7.d5 trying to grab space. Can you punish it?",
    },

    // 7.d5? (auto-advance — White's mistake)
    {
      type: 'instruction',
      fen: FEN.pi3_punish_after_d5_space,
      text: "7.d5? White closes the center, but this actually gives you a clear target to attack.",
      autoAdvance: 800,
    },

    // 7...e6! (user punishes)
    {
      type: 'play-move',
      fen: FEN.pi3_punish_after_d5_space,
      correctMove: 'e6',
      prompt: "Break open the center! Hit the d5 pawn.",
      hint: "Push e6 — it challenges the d5 pawn and opens lines for your pieces.",
      correctFeedback: "e6! You're cracking the center wide open. White's d5 pawn is falling apart.",
      wrongFeedback: "Push e6 — attack the d5 pawn before White can consolidate.",
      highlightSquares: ['e7', 'e6'],
    },

    // 8.dxe6 (auto-advance — White captures)
    {
      type: 'instruction',
      fen: FEN.pi3_punish_after_dxe6,
      text: "8.dxe6 — White takes, but now you recapture with a piece and get amazing activity.",
      autoAdvance: 800,
    },

    // 8...Bxe6 (user recaptures)
    {
      type: 'play-move',
      fen: FEN.pi3_punish_after_dxe6,
      correctMove: 'Bxe6',
      prompt: "Recapture and develop at the same time.",
      hint: "Your bishop on c8 can take the pawn on e6 — developing with tempo.",
      correctFeedback: "Bxe6! Your bishop is active, the center is open, and your Bg7 is unleashed on the long diagonal. White's d5 push backfired completely.",
      wrongFeedback: "Recapture with the bishop — Bxe6 develops and opens the position.",
      highlightSquares: ['c8', 'e6'],
    },

    {
      type: 'instruction',
      fen: FEN.pi3_punish_after_Bxe6,
      text: "Look at this position — your bishop pair is active, the center is open, and your Bg7 has no pawn blocking its diagonal. White's premature d5 just helped you.",
      highlightSquares: ['e6', 'g7'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "One more time — play the counterattack.",
      buttonText: "LET'S GO",
    },
    // 6.O-O
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "6.O-O.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 5: Facing the Austrian Attack
// Teaches: 4.f4 Bg7 5.Nf3 O-O — the aggressive Austrian
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6
// ═══════════════════════════════════════════════════════════

export const PI_AUSTRIAN_1: OpeningLesson = {
  id: 'pi-austrian-1',
  title: 'Facing the Austrian',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 d6 2.d4 Nf6 3.Nc3 g6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the Pirc setup — then we'll face White's most aggressive weapon.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4.f4 Bg7 5.Nf3 O-O)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "Instead of the calm 4.Nf3, White plays 4.f4 — the Austrian Attack. It's aggressive, threatening e5 and a kingside storm. Don't panic.",
    },

    // 4.f4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian_after_f4,
      text: "4.f4! White means business. Three pawns in the center. But remember — the bigger they build, the harder they fall.",
      autoAdvance: 800,
    },

    // 4...Bg7 (user plays)
    {
      type: 'instruction',
      fen: FEN.austrian_after_f4,
      text: "Your response? The same as always — fianchetto. The f4 push actually makes your bishop even better, because White's kingside is now weaker.",
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_f4,
      correctMove: 'Bg7',
      prompt: "Same plan. Fianchetto.",
      hint: "Bishop to g7. Don't let White's aggression change your plan.",
      correctFeedback: "Bg7! Cool and calm. The more White pushes, the more targets you'll have later.",
      wrongFeedback: "Fianchetto to g7 — your plan is the same against any White setup.",
      highlightSquares: ['f8', 'g7'],
    },

    // 5.Nf3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian_after_Nf3,
      text: "5.Nf3 — White develops the knight. Now it's time to get your king safe before the fireworks start.",
      autoAdvance: 800,
    },

    // 5...O-O (user plays)
    {
      type: 'play-move',
      fen: FEN.austrian_after_Nf3,
      correctMove: 'O-O',
      prompt: "Get your king safe before the storm.",
      hint: "Castle now — you want your king tucked away before White starts pushing.",
      correctFeedback: "Castled! Your king is safe behind the fianchetto. White's f4 push means THEIR king is the one in more danger — the f-file could open later.",
      wrongFeedback: "Castle kingside — king safety is priority #1.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White pushes e5 too early in the Austrian
    // After 5.Nf3 O-O 6.e5?! dxe5 7.fxe5 Nd5
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.austrian_after_OO,
      text: "What if White gets greedy and pushes 6.e5 right away? They haven't even castled! Let's punish it.",
    },

    // 6.e5?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian_punish_after_e5,
      text: "6.e5?! Too early! White pushes without castling or developing the bishop. Time to strike.",
      autoAdvance: 1500,
    },

    // 6...dxe5 (user plays)
    {
      type: 'play-move',
      fen: FEN.austrian_punish_after_e5,
      correctMove: 'dxe5',
      prompt: "The center is cracking — take the pawn!",
      hint: "Capture on e5 with your d-pawn.",
      correctFeedback: "dxe5! White's center collapses and the f4 pawn is hanging.",
      wrongFeedback: "Capture on e5 — the center is falling apart.",
      highlightSquares: ['d6', 'e5'],
    },

    // 7.fxe5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian_punish_after_fxe5,
      text: "7.fxe5 — White recaptures, but the f-file is now wide open and White hasn't castled. Your knight has a perfect square...",
      autoAdvance: 800,
    },

    // 7...Nd5! (user plays)
    {
      type: 'play-move',
      fen: FEN.austrian_punish_after_fxe5,
      correctMove: 'Nd5',
      prompt: "Plant your knight on the dream square.",
      hint: "Nd5 — a dominant central outpost.",
      correctFeedback: "Nd5! The knight is a monster on d5, attacking c3, and White's king is stuck in the center with an open f-file. The Austrian backfired.",
      wrongFeedback: "Nd5 — central domination.",
      highlightSquares: ['f6', 'd5'],
      postMoveArrow: ['d5', 'c3'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "Play the Austrian Defense moves one more time.",
      buttonText: "LET'S GO",
    },
    // 4.f4
    {
      type: 'instruction',
      fen: FEN.austrian_after_f4,
      text: "4.f4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_f4,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
    // 5.Nf3
    {
      type: 'instruction',
      fen: FEN.austrian_after_Nf3,
      text: "5.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Punish Bc4? (pi-punish-Bc4)
// After 4.Nf3 Bg7, White plays 5.Bc4? leaving e4 unguarded.
// Black punishes with 5...Nxe4! 6.Nxe4 d5! forking bishop and knight.
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7
// ═══════════════════════════════════════════════════════════

export const PI_PUNISH_BC4: OpeningLesson = {
  id: 'pi-punish-Bc4',
  title: 'Punish Bc4?',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play through the Pirc to the fianchetto.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Dragon Bishop.",
      hint: "Fianchetto.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH — White plays 5.Bc4? (Nxe4! d5!)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Now White should play 5.Be2 and castle. But some players get greedy with 5.Bc4 — aiming at f7. The problem? They left e4 hanging.",
    },

    // 5.Bc4? (auto-advance — White's mistake)
    {
      type: 'instruction',
      fen: FEN.punishBc4_after_Bc4,
      text: "5.Bc4? The bishop looks aggressive, but count the defenders on e4. The knight on c3 moved to let Bc4 happen — who's left guarding e4?",
      autoAdvance: 800,
    },

    // 5...Nxe4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.punishBc4_after_Bc4,
      correctMove: 'Nxe4',
      prompt: "The e4 pawn is barely protected. Strike!",
      hint: "Your knight on f6 can take the e4 pawn. Count the defenders — only Nc3.",
      correctFeedback: "Nxe4! You grabbed a pawn. The bishop on c4 doesn't help defend e4 at all.",
      wrongFeedback: "Take the e4 pawn with your knight — it's only defended by one piece.",
      highlightSquares: ['f6', 'e4'],
    },

    // 6.Nxe4 (auto-advance — White recaptures)
    {
      type: 'instruction',
      fen: FEN.punishBc4_after_Nxe4_recap,
      text: "6.Nxe4 — White recaptures, but now you have a devastating follow-up.",
      autoAdvance: 800,
    },

    // 6...d5! (user plays the fork)
    {
      type: 'play-move',
      fen: FEN.punishBc4_after_Nxe4_recap,
      correctMove: 'd5',
      prompt: "Attack two pieces at once!",
      hint: "Push d5 — it attacks both the knight on e4 and the bishop on c4.",
      correctFeedback: "d5! A deadly fork. The pawn attacks the knight AND the bishop. White has to lose material.",
      wrongFeedback: "Push d5 — it forks the knight on e4 and the bishop on c4!",
      highlightSquares: ['d6', 'd5'],
      postMoveArrow: ['d5', 'c4'],
    },

    {
      type: 'instruction',
      fen: FEN.punishBc4_after_d5,
      text: "White can only save one piece. Whether the bishop retreats or the knight moves, you win material. That's why 5.Bc4 is a mistake in the Pirc.",
      highlightSquares: ['d5', 'c4', 'e4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — same idea but deeper explanation
    // After Bg7, White plays Bc4 and we show why it fails
    // (Already covered in Act 2 since this IS a punish lesson)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "One more time — White plays Bc4. Punish it!",
      buttonText: "LET'S GO",
    },
    // 5.Bc4?
    {
      type: 'instruction',
      fen: FEN.punishBc4_after_Bc4,
      text: "5.Bc4?",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punishBc4_after_Bc4,
      correctMove: 'Nxe4',
      prompt: "Your move.",
      hint: "Nxe4.",
      correctFeedback: "Nxe4.",
      wrongFeedback: "Nxe4.",
    },
    // 6.Nxe4
    {
      type: 'instruction',
      fen: FEN.punishBc4_after_Nxe4_recap,
      text: "6.Nxe4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punishBc4_after_Nxe4_recap,
      correctMove: 'd5',
      prompt: "Your move.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: After ...c5 (pi-4)
// Teaches: 7.Be3 Nc6 8.Qd2 e5 — develop then break
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c5
// ═══════════════════════════════════════════════════════════

export const PI_LESSON_4: OpeningLesson = {
  id: 'pi-4',
  title: 'After ...c5',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (full line through 6...c5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the full Pirc Classical line through ...c5.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Dragon Bishop.",
      hint: "Fianchetto.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "5.Be2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: "King safety.",
      correctFeedback: "Castled.",
      wrongFeedback: "Castle kingside.",
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "6.O-O.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'c5',
      prompt: "The counterattack.",
      hint: "Strike the center!",
      correctFeedback: "c5!",
      wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (7.Be3 Nc6 8.Qd2 e5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "You've struck at the center with ...c5. Now White develops the bishop to e3, supporting d4. What's your next step? Bring in more pieces!",
    },

    // 7.Be3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pi4_after_Be3,
      text: "7.Be3 — White bolsters the d4 pawn. A solid, common move.",
      autoAdvance: 800,
    },

    // 7...Nc6 (user plays)
    {
      type: 'instruction',
      fen: FEN.pi4_after_Be3,
      text: "Develop your knight to c6. It adds pressure on d4 and controls key central squares.",
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Be3,
      correctMove: 'Nc6',
      prompt: "Add more pressure to the center.",
      hint: "Your knight from b8 can go to c6, attacking d4.",
      correctFeedback: "Nc6! Now d4 is under fire from three pieces — your c5 pawn, Nc6, and Bg7. White has to be careful.",
      wrongFeedback: "Develop your knight to c6 — it pressures d4.",
      highlightSquares: ['b8', 'c6'],
      postMoveArrow: ['c6', 'd4'],
    },

    // 8.Qd2 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pi4_after_Qd2,
      text: "8.Qd2 — White connects the rooks and eyes a future Bh6 trade. But the center is ripe for action.",
      autoAdvance: 800,
    },

    // 8...e5! (user plays the break)
    {
      type: 'instruction',
      fen: FEN.pi4_after_Qd2,
      text: "Now for the big moment — push ...e5! This challenges d4 directly and opens lines for your pieces. The Pirc payoff!",
      highlightSquares: ['e7', 'e5', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Qd2,
      correctMove: 'e5',
      prompt: "Time for the big center break!",
      hint: "Push e5 — blow open the center while your pieces are ready.",
      correctFeedback: "e5! The center explodes. White's d4 pawn is under huge pressure, and your Bg7 is now an absolute monster on the diagonal.",
      wrongFeedback: "Push e5 — the Pirc counterattack reaches full power!",
      highlightSquares: ['e7', 'e5'],
      postMoveArrow: ['g7', 'a1'],
    },

    {
      type: 'instruction',
      fen: FEN.pi4_after_e5,
      text: "This is the dream Pirc position. You let White build the center, developed calmly, and now the center is cracking open in your favor. The bishop on g7 is devastating.",
      highlightSquares: ['g7', 'e5', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays 8.d5? locking the center
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pi4_after_Nc6,
      text: "What if White panics and pushes 8.d5? It looks like it gains space, but it gives your knight a juicy square.",
    },

    // 8.d5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pi4_punish_after_d5,
      text: "8.d5? White closes the center, but your knight on c6 is kicked — and it has a perfect detour.",
      autoAdvance: 800,
    },

    // 8...Nd4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.pi4_punish_after_d5,
      correctMove: 'Nd4',
      prompt: "Your knight got pushed — find the best square!",
      hint: "Instead of retreating, jump forward! Nd4 is a powerful outpost.",
      correctFeedback: "Nd4! A monster knight on d4. It can't be chased by pawns, attacks the e2 bishop, and dominates the center. White's d5 push just made your knight stronger.",
      wrongFeedback: "Jump forward to d4 — your knight becomes a monster there!",
      highlightSquares: ['c6', 'd4'],
      postMoveArrow: ['d4', 'e2'],
    },

    {
      type: 'instruction',
      fen: FEN.pi4_punish_after_Nd4,
      text: "The knight on d4 is untouchable by pawns and attacks White's bishop. White's space grab backfired — you're better here.",
      highlightSquares: ['d4', 'e2'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Run it back — play the two new Black moves.",
      buttonText: "LET'S GO",
    },
    // 7.Be3
    {
      type: 'instruction',
      fen: FEN.pi4_after_Be3,
      text: "7.Be3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Be3,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
    // 8.Qd2
    {
      type: 'instruction',
      fen: FEN.pi4_after_Qd2,
      text: "8.Qd2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Qd2,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Austrian Attack Deeper (pi-austrian-2)
// Teaches: 6.Bd3 c5 — counterattacking the Austrian center
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
// ═══════════════════════════════════════════════════════════

export const PI_AUSTRIAN_2: OpeningLesson = {
  id: 'pi-austrian-2',
  title: 'Austrian ...c5!',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (Austrian line through 5...O-O)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay the Austrian Attack line. You know the drill.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },
    // 4.f4
    {
      type: 'instruction',
      fen: FEN.austrian_after_f4,
      text: "4.f4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_f4,
      correctMove: 'Bg7',
      prompt: "Same plan.",
      hint: "Fianchetto.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },
    // 5.Nf3
    {
      type: 'instruction',
      fen: FEN.austrian_after_Nf3,
      text: "5.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_Nf3,
      correctMove: 'O-O',
      prompt: "King safety.",
      hint: "Castle.",
      correctFeedback: "Castled.",
      wrongFeedback: "Castle kingside.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (6.Bd3 c5)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.austrian_after_OO,
      text: "You're castled against the Austrian. White develops the bishop to d3 — a natural, aggressive square. Now it's time for YOUR aggressive move.",
    },

    // 6.Bd3 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian2_after_Bd3,
      text: "6.Bd3 — White aims the bishop toward your king. But there's a bigger fight in the center.",
      autoAdvance: 800,
    },

    // 6...c5! (user plays)
    {
      type: 'instruction',
      fen: FEN.austrian2_after_Bd3,
      text: "Same counterattack as the Classical — ...c5! It works even better here because White's f4 push weakened the center.",
      highlightSquares: ['c7', 'c5', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.austrian2_after_Bd3,
      correctMove: 'c5',
      prompt: "Strike at the Austrian center!",
      hint: "Push c5 — challenge d4 while White's pieces aren't ready.",
      correctFeedback: "c5! The Austrian center cracks. White's d4 pawn is now attacked, and the f4 push means White can't easily reinforce it.",
      wrongFeedback: "Push c5 — attack the d4 pawn!",
      highlightSquares: ['c7', 'c5'],
      postMoveArrow: ['c5', 'd4'],
    },

    {
      type: 'instruction',
      fen: FEN.austrian2_after_c5,
      text: "If White takes dxc5, you recapture with dxc5 and have an active position with open lines. The same ...c5 break works in both the Classical and Austrian!",
      highlightSquares: ['c5', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays e5? too early
    // After 6.Bd3 c5, White pushes 7.e5? prematurely
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.austrian2_after_c5,
      text: "White gets aggressive and pushes 7.e5?! But you've seen this before — e5 too early is always punishable in the Pirc.",
    },

    // 7.e5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian2_punish_after_e5,
      text: "7.e5?! Same old mistake — pushing without enough support.",
      autoAdvance: 800,
    },

    // 7...dxe5 (user plays)
    {
      type: 'play-move',
      fen: FEN.austrian2_punish_after_e5,
      correctMove: 'dxe5',
      prompt: "Take the overextended pawn!",
      hint: "Capture on e5 — the center collapses.",
      correctFeedback: "dxe5! White's center is falling apart again. And this time the f4 pawn is even weaker.",
      wrongFeedback: "Take on e5 — punish the premature push.",
      highlightSquares: ['d6', 'e5'],
    },

    // 8.fxe5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.austrian2_punish_after_fxe5,
      text: "8.fxe5 — White recaptures, but the f-file is wide open and your knight has options.",
      autoAdvance: 800,
    },

    // 8...Ng4! (user plays — targets e5 and e3)
    {
      type: 'play-move',
      fen: FEN.austrian2_punish_after_fxe5,
      correctMove: 'Ng4',
      prompt: "Your knight can attack the weak e5 pawn. Find the move!",
      hint: "Jump to g4 — it attacks e5 and threatens to come to e3.",
      correctFeedback: "Ng4! Your knight eyes e5 and threatens to invade on e3 or f2. White's aggressive setup backfired — their center is gone and their king is exposed.",
      wrongFeedback: "Jump to g4 — it puts pressure on e5 and threatens nasty forks.",
      highlightSquares: ['f6', 'g4'],
      postMoveArrow: ['g4', 'e5'],
    },

    {
      type: 'instruction',
      fen: FEN.austrian2_punish_after_Ng4,
      text: "White's in trouble. The knight on g4 eyes e5, e3, and f2. The Bg7 rakes the diagonal. When White plays e5 too early in the Austrian, the punishment is severe.",
      highlightSquares: ['g4', 'g7', 'e5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.austrian_after_OO,
      text: "Play the Austrian counterattack one more time.",
      buttonText: "LET'S GO",
    },
    // 6.Bd3
    {
      type: 'instruction',
      fen: FEN.austrian2_after_Bd3,
      text: "6.Bd3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian2_after_Bd3,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Classical Be3 (pi-classical-1)
// Teaches: 7.Be3 Nc6 8.d5 Na5 — knight reroute when center locks
// Recap: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c5
// ═══════════════════════════════════════════════════════════

export const PI_CLASSICAL_1: OpeningLesson = {
  id: 'pi-classical-1',
  title: 'Classical Be3',
  defaultOrientation: 'black',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (full Classical line through ...c5, plus Be3 Nc6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Full recap — play through to the ...c5 counterattack, then the Nc6 development.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Start the Pirc.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Pressure e4.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto prep.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Dragon Bishop.",
      hint: "Fianchetto.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "5.Be2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: "King safety.",
      correctFeedback: "Castled.",
      wrongFeedback: "Castle kingside.",
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "6.O-O.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'c5',
      prompt: "Counterattack.",
      hint: "c5!",
      correctFeedback: "c5!",
      wrongFeedback: "c5.",
      highlightSquares: ['c7', 'c5'],
    },
    // 7.Be3
    {
      type: 'instruction',
      fen: FEN.pi4_after_Be3,
      text: "7.Be3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Be3,
      correctMove: 'Nc6',
      prompt: "Develop and pressure d4.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
      highlightSquares: ['b8', 'c6'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (8.d5 Na5 — knight reroute)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pi4_after_Nc6,
      text: "White wants to lock down the center by pushing d5. It kicks your knight — but in the Pirc, being kicked isn't always bad.",
    },

    // 8.d5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.classical1_after_d5,
      text: "8.d5 — White closes the center and attacks your knight. Where should it go?",
      autoAdvance: 800,
    },

    // 8...Na5 (user plays)
    {
      type: 'instruction',
      fen: FEN.classical1_after_d5,
      text: "The knight goes to a5! It looks weird on the rim, but from a5 it's heading to c4 — one of the best outpost squares in chess. The c4 square attacks b2, d2, and e3.",
      highlightSquares: ['c6', 'a5', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.classical1_after_d5,
      correctMove: 'Na5',
      prompt: "Reroute the knight toward a powerful square.",
      hint: "Go to a5 — it's a stepping stone to c4, one of the best outposts.",
      correctFeedback: "Na5! The knight is heading to c4 via a5. It looks strange on the edge, but c4 will be devastating — attacking b2, d2, and e3.",
      wrongFeedback: "Play Na5 — the knight reroutes through the side to reach c4.",
      highlightSquares: ['c6', 'a5'],
      postMoveArrow: ['a5', 'c4'],
    },

    {
      type: 'instruction',
      fen: FEN.classical1_after_Na5,
      text: "Next move, your knight hops to c4 and becomes a monster. White's d5 push gave you a clear plan — and the Bg7 still controls the long diagonal behind the locked center.",
      highlightSquares: ['a5', 'g7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — White plays dxc5? giving up the center
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pi4_after_Nc6,
      text: "What if White trades with dxc5 instead? That's a mistake — it gives up the center tension and opens lines for YOUR pieces.",
    },

    // 8.dxc5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.classical1_punish_after_dxc5,
      text: "8.dxc5? White gives up the d4 pawn. Now the d-file opens and your pieces feast.",
      autoAdvance: 800,
    },

    // 8...dxc5 (user recaptures)
    {
      type: 'play-move',
      fen: FEN.classical1_punish_after_dxc5,
      correctMove: 'dxc5',
      prompt: "Recapture and open the position.",
      hint: "Take back on c5 with your d-pawn — it opens the d-file.",
      correctFeedback: "dxc5! The d-file is open for your queen, your Bg7 has no pawns blocking it, and your Nc6 is beautifully placed. White gave up the center for nothing.",
      wrongFeedback: "Recapture with dxc5 — open the position!",
      highlightSquares: ['d6', 'c5'],
    },

    {
      type: 'instruction',
      fen: FEN.classical1_punish_after_dxc5_b,
      text: "Look at this position — open d-file, active Bg7, strong Nc6, and White has nothing to show for it. Trading dxc5 was a gift.",
      highlightSquares: ['c6', 'g7'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: BLACK RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.pi4_after_Nc6,
      text: "Run it back — White pushes d5, find the reroute.",
      buttonText: "LET'S GO",
    },
    // 8.d5
    {
      type: 'instruction',
      fen: FEN.classical1_after_d5,
      text: "8.d5.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.classical1_after_d5,
      correctMove: 'Na5',
      prompt: "Your move.",
      hint: "Na5.",
      correctFeedback: "Na5.",
      wrongFeedback: "Na5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 10: Level Test
// Tests all Pirc concepts: setup, fianchetto, counterattack, Austrian, Bc4, Classical
// ═══════════════════════════════════════════════════════════

export const PI_TEST_1: OpeningLesson = {
  id: 'pi-test-1',
  title: 'Pirc Defense — Level Test',
  defaultOrientation: 'black',
  steps: [

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time to prove you know the Pirc Defense. Play the full Classical line, handle variations, and find the reroutes. No hints this time!",
      buttonText: "BRING IT ON",
    },

    // --- Full Classical line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c5 7.Be3 Nc6 8.Qd2 e5 ---

    // 1.e4
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: "d6.",
      correctFeedback: "d6.",
      wrongFeedback: "d6.",
    },
    // 2.d4
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Your move.",
      hint: "Nf6.",
      correctFeedback: "Nf6.",
      wrongFeedback: "Nf6.",
    },
    // 3.Nc3
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Your move.",
      hint: "g6.",
      correctFeedback: "g6.",
      wrongFeedback: "g6.",
    },
    // 4.Nf3
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "4.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
    // 5.Be2
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "5.Be2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },
    // 6.O-O
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "6.O-O.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },
    // 7.Be3
    {
      type: 'instruction',
      fen: FEN.pi4_after_Be3,
      text: "7.Be3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Be3,
      correctMove: 'Nc6',
      prompt: "Your move.",
      hint: "Nc6.",
      correctFeedback: "Nc6.",
      wrongFeedback: "Nc6.",
    },
    // 8.Qd2
    {
      type: 'instruction',
      fen: FEN.pi4_after_Qd2,
      text: "8.Qd2.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.pi4_after_Qd2,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: "e5.",
      correctFeedback: "e5.",
      wrongFeedback: "e5.",
    },

    // --- Classical: d5 Na5 ---
    {
      type: 'instruction',
      fen: FEN.pi4_after_Nc6,
      text: "White locks the center. You know the trick.",
    },
    // 8.d5
    {
      type: 'instruction',
      fen: FEN.classical1_after_d5,
      text: "8.d5.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.classical1_after_d5,
      correctMove: 'Na5',
      prompt: "Your move.",
      hint: "Na5.",
      correctFeedback: "Na5.",
      wrongFeedback: "Na5.",
    },

    // --- Austrian variation ---
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "Now the Austrian. Different setup, same you.",
    },
    // 4.f4
    {
      type: 'instruction',
      fen: FEN.austrian_after_f4,
      text: "4.f4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_f4,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: "Bg7.",
      correctFeedback: "Bg7.",
      wrongFeedback: "Bg7.",
    },
    // 5.Nf3
    {
      type: 'instruction',
      fen: FEN.austrian_after_Nf3,
      text: "5.Nf3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian_after_Nf3,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: "O-O.",
      correctFeedback: "O-O.",
      wrongFeedback: "O-O.",
    },

    // --- Austrian deeper: Bd3 c5 ---
    // 6.Bd3
    {
      type: 'instruction',
      fen: FEN.austrian2_after_Bd3,
      text: "6.Bd3.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.austrian2_after_Bd3,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: "c5.",
      correctFeedback: "c5.",
      wrongFeedback: "c5.",
    },

    // --- Punish: Bc4? ---
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Last one. White makes a mistake. Can you spot it?",
    },
    // 5.Bc4?
    {
      type: 'instruction',
      fen: FEN.punishBc4_after_Bc4,
      text: "5.Bc4?",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punishBc4_after_Bc4,
      correctMove: 'Nxe4',
      prompt: "Your move.",
      hint: "Nxe4.",
      correctFeedback: "Nxe4.",
      wrongFeedback: "Nxe4.",
    },
    // 6.Nxe4
    {
      type: 'instruction',
      fen: FEN.punishBc4_after_Nxe4_recap,
      text: "6.Nxe4.",
      autoAdvance: 800,
    },
    {
      type: 'play-move',
      fen: FEN.punishBc4_after_Nxe4_recap,
      correctMove: 'd5',
      prompt: "Your move.",
      hint: "d5.",
      correctFeedback: "d5.",
      wrongFeedback: "d5.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

export const PIRC_LESSONS: OpeningLesson[] = [
  PI_LESSON_1,
  PI_LESSON_2,
  PI_PUNISH_F4,
  PI_PUNISH_BC4,
  PI_LESSON_3,
  PI_AUSTRIAN_1,
  PI_LESSON_4,
  PI_AUSTRIAN_2,
  PI_CLASSICAL_1,
  PI_TEST_1,
]

export function getPircLesson(id: string): OpeningLesson | undefined {
  return PIRC_LESSONS.find(l => l.id === id)
}
