import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// LONDON SYSTEM LESSONS (ln-1 through ln-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.Bg3 O-O
//            8.Bd3 b6 9.O-O Bb7 10.Ne5 Qc7 11.Re1 Rad8 12.Qe2 Ne7
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_d5:    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  after_Bf4:   'rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2',
  after_Nf6:   'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3',
  after_e3:    'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq - 0 3',
  after_e6:    'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4',
  after_Nf3:   'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R b KQkq - 1 4',
  after_c5:    'rnbqkb1r/pp3ppp/4pn2/2pp4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 5',
  after_c3:    'rnbqkb1r/pp3ppp/4pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R b KQkq - 0 5',
  after_Nc6:   'r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R w KQkq - 1 6',
  after_Nbd2:  'r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 2 6',
  after_Bd6:   'r1bqk2r/pp3ppp/2nbpn2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 3 7',
  after_Bg3:   'r1bqk2r/pp3ppp/2nbpn2/2pp4/3P4/2P1PNB1/PP1N1PPP/R2QKB1R b KQkq - 4 7',
  after_OO:    'r1bq1rk1/pp3ppp/2nbpn2/2pp4/3P4/2P1PNB1/PP1N1PPP/R2QKB1R w KQ - 5 8',
  after_Bd3:   'r1bq1rk1/pp3ppp/2nbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R b KQ - 6 8',
  after_b6:    'r1bq1rk1/p4ppp/1pnbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R w KQ - 0 9',
  after_OO_w:  'r1bq1rk1/p4ppp/1pnbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2Q1RK1 b - - 1 9',
  after_Bb7:   'r2q1rk1/pb3ppp/1pnbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2Q1RK1 w - - 2 10',
  after_Ne5:   'r2q1rk1/pb3ppp/1pnbpn2/2ppN3/3P4/2PBP1B1/PP1N1PPP/R2Q1RK1 b - - 3 10',
  after_Qc7:   'r4rk1/pbq2ppp/1pnbpn2/2ppN3/3P4/2PBP1B1/PP1N1PPP/R2Q1RK1 w - - 4 11',
  after_Re1:   'r4rk1/pbq2ppp/1pnbpn2/2ppN3/3P4/2PBP1B1/PP1N1PPP/R2QR1K1 b - - 5 11',
  after_Rad8:  '3r1rk1/pbq2ppp/1pnbpn2/2ppN3/3P4/2PBP1B1/PP1N1PPP/R2QR1K1 w - - 6 12',
  after_Qe2:   '3r1rk1/pbq2ppp/1pnbpn2/2ppN3/3P4/2PBP1B1/PP1NQPPP/R3R1K1 b - - 7 12',
  after_Ne7:   '3r1rk1/pbq1nppp/1p1bpn2/2ppN3/3P4/2PBP1B1/PP1NQPPP/R3R1K1 w - - 8 13',

  // Punish e5: 1.d4 e5? 2.dxe5 d6 3.exd6 Bxd6 4.Nf3
  pe_after_e5:    'rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  pe_after_dxe5:  'rnbqkbnr/pppp1ppp/8/4P3/8/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2',
  pe_after_d6:    'rnbqkbnr/ppp2ppp/3p4/4P3/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 3',
  pe_after_exd6:  'rnbqkbnr/ppp2ppp/3P4/8/8/8/PPP1PPPP/RNBQKBNR b KQkq - 0 3',
  pe_after_Bxd6:  'rnbqk1nr/ppp2ppp/3b4/8/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 4',
  pe_after_Nf3:   'rnbqk1nr/ppp2ppp/3b4/8/8/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 4',

  // Punish c5: 1.d4 d5 2.Bf4 c5? 3.e3 cxd4 4.exd4
  pc_after_c5:    'rnbqkbnr/pp2pppp/8/2pp4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3',
  pc_after_e3:    'rnbqkbnr/pp2pppp/8/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq - 0 3',
  pc_after_cxd4:  'rnbqkbnr/pp2pppp/8/3p4/3p1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4',
  pc_after_exd4:  'rnbqkbnr/pp2pppp/8/3p4/3P1B2/8/PPP2PPP/RN1QKBNR b KQkq - 0 4',

  // Jobava: 2.Bf4 Nf6 3.Nc3 e6 4.e3
  jb_after_Nc3:   'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR b KQkq - 3 3',
  jb_after_e6:    'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4',
  jb_after_e3:    'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR b KQkq - 0 4',

  // Anti-Bf5: 3.e3 Bf5 4.c4! dxc4 5.Bxc4
  ab_after_Bf5:   'rn1qkb1r/ppp1pppp/5n2/3p1b2/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 1 4',
  ab_after_c4:    'rn1qkb1r/ppp1pppp/5n2/3p1b2/2PP1B2/4P3/PP3PPP/RN1QKBNR b KQkq - 0 4',
  ab_after_dxc4:  'rn1qkb1r/ppp1pppp/5n2/5b2/2pP1B2/4P3/PP3PPP/RN1QKBNR w KQkq - 0 5',
  ab_after_Bxc4:  'rn1qkb1r/ppp1pppp/5n2/5b2/2BP1B2/4P3/PP3PPP/RN1QK1NR b KQkq - 0 5',

  // Bd6 challenge: 4.Nf3 Bd6 5.Bxd6 Qxd6 6.Bd3
  bd_after_Bd6:   'rnbqk2r/ppp2ppp/3bpn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 2 5',
  bd_after_Bxd6:  'rnbqk2r/ppp2ppp/3Bpn2/3p4/3P4/4PN2/PPP2PPP/RN1QKB1R b KQkq - 0 5',
  bd_after_Qxd6:  'rnb1k2r/ppp2ppp/3qpn2/3p4/3P4/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 6',
  bd_after_Bd3:   'rnb1k2r/ppp2ppp/3qpn2/3p4/3P4/3BPN2/PPP2PPP/RN1QK2R b KQkq - 1 6',

  // ─── PUNISH POSITIONS ───

  // ln-1 punish: After 2.Bf4, Black plays 2...Bf5? (mirror attempt) → 3.c4!
  p1_after_Bf5:   'rn1qkbnr/ppp1pppp/8/3p1b2/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3',
  p1_after_c4:    'rn1qkbnr/ppp1pppp/8/3p1b2/2PP1B2/8/PP2PPPP/RN1QKBNR b KQkq - 0 3',

  // ln-2 punish: After 4.Nf3, Black plays 4...Bd6?! (premature) → 5.Bg3!
  p2_after_Bd6:   'rnbqk2r/ppp2ppp/3bpn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 2 5',
  p2_after_Bg3:   'rnbqk2r/ppp2ppp/3bpn2/3p4/3P4/4PNB1/PPP2PPP/RN1QKB1R b KQkq - 3 5',

  // ln-3 punish: After 6.Nbd2, Black plays 6...cxd4?! (releases tension) → 7.exd4!
  p3_after_cxd4:  'r1bqkb1r/pp3ppp/2n1pn2/3p4/3p1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 0 7',
  p3_after_exd4:  'r1bqkb1r/pp3ppp/2n1pn2/3p4/3P1B2/2P2N2/PP1N1PPP/R2QKB1R b KQkq - 0 7',

  // ln-4 punish: After 8.Bd3, Black plays 8...Re8? (slow) → 9.Ne5!
  p4_after_Re8:   'r1bqr1k1/pp3ppp/2nbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R w KQ - 7 9',
  p4_after_Ne5:   'r1bqr1k1/pp3ppp/2nbpn2/2ppN3/3P4/2PBP1B1/PP1N1PPP/R2QK2R b KQ - 8 9',

  // Jobava punish: After 3.Nc3, Black plays 3...c5? → 4.e3
  jp_after_c5:    'rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 0 4',
  jp_after_e3:    'rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2N1P3/PPP2PPP/R2QKBNR b KQkq - 0 4',

  // Anti-Bf5 punish: After 5.Bxc4, Black plays 5...e6? → 6.Nc3!
  ap_after_e6:    'rn1qkb1r/ppp2ppp/4pn2/5b2/2BP1B2/4P3/PP3PPP/RN1QK1NR w KQkq - 0 6',
  ap_after_Nc3:   'rn1qkb1r/ppp2ppp/4pn2/5b2/2BP1B2/2N1P3/PP3PPP/R2QK1NR b KQkq - 1 6',

  // Bd6 challenge punish: After 6.Bd3, Black plays 6...O-O? → 7.c4!
  bp_after_OO:    'rnb2rk1/ppp2ppp/3qpn2/3p4/3P4/3BPN2/PPP2PPP/RN1QK2R w KQ - 2 7',
  bp_after_c4:    'rnb2rk1/ppp2ppp/3qpn2/3p4/2PP4/3BPN2/PP3PPP/RN1QK2R b KQ - 0 7',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The London Setup
// Teaches: 1.d4 d5 2.Bf4 Nf6 3.e3
// WHITE opening — user plays White moves, Black auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const LN_LESSON_1: OpeningLesson = {
  id: 'ln-1',
  title: 'The London Setup',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: No recap (first lesson of the opening)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1.d4 d5 2.Bf4 Nf6 3.e3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the London System — a rock-solid opening for White. You'll build a fortress in the center and develop your bishop before it gets locked in.",
    },

    // --- Move 1: d4 ---
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'd4',
      prompt: 'Take the center with a pawn!',
      hint: 'Push the d-pawn two squares forward.',
      correctFeedback: "d4 — you claim the center. This pawn controls c5 and e5.",
      wrongFeedback: "In the London, we start with d4.",
      highlightSquares: ['d2', 'd4'],
    },

    // --- 1...d5 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "1...d5 — Black mirrors you. A solid response.",
      autoAdvance: 800,
    },

    // --- Move 2: Bf4 ---
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Now for the signature London move. Get your bishop out to f4 BEFORE playing e3. If you play e3 first, this bishop gets trapped behind your own pawns.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Bf4',
      prompt: "Develop the bishop before it gets locked in!",
      hint: "Put your dark-squared bishop on f4 — the London trademark.",
      correctFeedback: "Bf4! The London bishop. It's out, it's active, and it controls key dark squares.",
      wrongFeedback: "Place your bishop on f4 — that's the whole point of the London.",
      highlightSquares: ['c1', 'f4'],
    },

    // --- 2...Nf6 (auto-advance) ---
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "2...Nf6 — Black develops a knight. A natural move.",
      autoAdvance: 800,
    },

    // --- Move 3: e3 ---
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Now play e3. It supports d4 and opens a diagonal for your light-squared bishop. The order matters — bishop first, THEN e3.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'e3',
      prompt: "Lock in the center support.",
      hint: "Push the e-pawn one square — support d4 and prepare Bd3.",
      correctFeedback: "e3! The London triangle is complete — d4, Bf4, e3. You have a solid center and an active bishop.",
      wrongFeedback: "Play e3 to support d4 and free the light-squared bishop.",
      highlightSquares: ['e2', 'e3'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — Black plays 2...Bf5? (mirror attempt)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bf4,
      text: "What if Black tries to copy you? After 2.Bf4, imagine Black plays 2...Bf5 — mirroring your bishop. Can you punish it?",
    },

    // 2...Bf5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p1_after_Bf5,
      text: "2...Bf5? The mirror looks logical, but Black's bishop is exposed here.",
      autoAdvance: 800,
    },

    // 3.c4! (user punishes)
    {
      type: 'play-move',
      fen: FEN.p1_after_Bf5,
      correctMove: 'c4',
      prompt: "The bishop is out early — challenge the center!",
      hint: "Push c4 — attack Black's d5 pawn while the bishop is misplaced.",
      correctFeedback: "c4! You're attacking d5 and the bishop on f5 has nowhere good to go. Black's mirror strategy backfired.",
      wrongFeedback: "Push c4 to attack d5 while the bishop is awkwardly placed.",
      highlightSquares: ['c2', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL (user replays White moves)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's run it back. Play the three White moves of the London setup.",
      buttonText: "LET'S GO",
    },

    // Recall: 1.d4
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'd4',
      prompt: "Your move.",
      hint: "d4.",
      correctFeedback: "d4.",
      wrongFeedback: "d4.",
    },
    // 1...d5
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "1...d5.",
      autoAdvance: 800,
    },
    // Recall: 2.Bf4
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Bf4',
      prompt: "Your move.",
      hint: "Bf4.",
      correctFeedback: "Bf4.",
      wrongFeedback: "Bf4.",
    },
    // 2...Nf6
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "2...Nf6.",
      autoAdvance: 800,
    },
    // Recall: 3.e3
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'e3',
      prompt: "Your move.",
      hint: "e3.",
      correctFeedback: "e3.",
      wrongFeedback: "e3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: The Pyramid
// Teaches: 3...e6 4.Nf3 c5 5.c3
// Recap: 1.d4 d5 2.Bf4 Nf6 3.e3
// ═══════════════════════════════════════════════════════════

export const LN_LESSON_2: OpeningLesson = {
  id: 'ln-2',
  title: 'The Pyramid',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.d4 d5 2.Bf4 Nf6 3.e3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the London setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'd4',
      prompt: "Control the center.",
      hint: "The d-pawn.",
      correctFeedback: "d4.",
      wrongFeedback: "Start with d4.",
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Bf4',
      prompt: "The London bishop.",
      hint: "Bishop to f4.",
      correctFeedback: "Bf4.",
      wrongFeedback: "Bishop to f4.",
      highlightSquares: ['c1', 'f4'],
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'e3',
      prompt: "Complete the triangle.",
      hint: "e3.",
      correctFeedback: "e3.",
      wrongFeedback: "e3.",
      highlightSquares: ['e2', 'e3'],
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...e6 4.Nf3 c5 5.c3)
    // ═══════════════════════════════════════════

    // 3...e6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "3...e6 — Black strengthens the center and prepares to develop the bishop.",
      autoAdvance: 800,
    },

    // 4.Nf3
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Time to develop the knight. Nf3 is perfect — it supports d4, eyes e5, and prepares castling.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e6,
      correctMove: 'Nf3',
      prompt: "Develop a piece that supports the center.",
      hint: "Knight to f3 — it does everything.",
      correctFeedback: "Nf3! It supports d4, attacks e5, and you're one step closer to castling.",
      wrongFeedback: "Develop the knight to f3.",
      highlightSquares: ['g1', 'f3'],
    },

    // 4...c5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "4...c5 — Black challenges your d4 pawn. Don't worry — you have a plan.",
      autoAdvance: 800,
    },

    // 5.c3
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Play c3! This builds the London Pyramid — pawns on c3, d4, and e3. Your center is rock-solid.",
    },
    {
      type: 'play-move',
      fen: FEN.after_c5,
      correctMove: 'c3',
      prompt: "Build the pyramid — reinforce d4.",
      hint: "c3 gives d4 extra support.",
      correctFeedback: "c3! The London Pyramid. Pawns on c3-d4-e3. Black can push and prod, but this center isn't going anywhere.",
      wrongFeedback: "Play c3 to support d4.",
      highlightSquares: ['c2', 'c3'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — Black plays 4...Bd6?! (premature bishop attack)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Sometimes Black tries 4...Bd6, attacking your bishop immediately. But it's too early. Show them why.",
    },

    // 4...Bd6?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p2_after_Bd6,
      text: "4...Bd6?! Black wants to trade your good bishop. But you simply retreat — and the bishop stays active.",
      autoAdvance: 800,
    },

    // 5.Bg3! (user retreats)
    {
      type: 'play-move',
      fen: FEN.p2_after_Bd6,
      correctMove: 'Bg3',
      prompt: "Don't trade — retreat the bishop!",
      hint: "Bg3 keeps the bishop alive on the long diagonal.",
      correctFeedback: "Bg3! The bishop is safe and still controls dark squares. Black wasted a tempo — you didn't.",
      wrongFeedback: "Retreat to g3 — keep the bishop active.",
      highlightSquares: ['f4', 'g3'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: "Your turn. Play the next three White moves from the London.",
      buttonText: "LET'S GO",
    },

    // Recall: 4.Nf3
    { type: 'instruction', fen: FEN.after_e6, text: "3...e6.", autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e6,
      correctMove: 'Nf3',
      prompt: "Your move.",
      hint: "Nf3.",
      correctFeedback: "Nf3.",
      wrongFeedback: "Nf3.",
    },
    // 4...c5
    { type: 'instruction', fen: FEN.after_c5, text: "4...c5.", autoAdvance: 800 },
    // Recall: 5.c3
    {
      type: 'play-move',
      fen: FEN.after_c5,
      correctMove: 'c3',
      prompt: "Your move.",
      hint: "c3.",
      correctFeedback: "c3.",
      wrongFeedback: "c3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Punish 1...e5?
// Teaches: 1.d4 e5? 2.dxe5 d6 3.exd6 Bxd6 4.Nf3
// ═══════════════════════════════════════════════════════════

export const LN_PUNISH_E5: OpeningLesson = {
  id: 'ln-punish-e5',
  title: 'Punish 1...e5?',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.d4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "You play 1.d4. But instead of 1...d5, Black tries something weird...",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'd4',
      prompt: "Start with d4.",
      hint: "The d-pawn.",
      correctFeedback: "d4.",
      wrongFeedback: "d4.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (1...e5? 2.dxe5 d6 3.exd6 Bxd6 4.Nf3)
    // ═══════════════════════════════════════════

    // 1...e5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe_after_e5,
      text: "1...e5?! The Englund Gambit — Black gives away a pawn for... nothing much. Take it!",
      autoAdvance: 800,
    },

    // 2.dxe5
    {
      type: 'play-move',
      fen: FEN.pe_after_e5,
      correctMove: 'dxe5',
      prompt: "They're offering a free pawn. Take it!",
      hint: "Capture on e5 with your d-pawn.",
      correctFeedback: "dxe5! A free pawn. Black has no real compensation.",
      wrongFeedback: "Take the pawn — dxe5.",
      highlightSquares: ['d4', 'e5'],
    },

    // 2...d6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe_after_d6,
      text: "2...d6 — Black tries to win the pawn back.",
      autoAdvance: 800,
    },

    // 3.exd6
    {
      type: 'play-move',
      fen: FEN.pe_after_d6,
      correctMove: 'exd6',
      prompt: "Keep the advantage — trade pawns.",
      hint: "Capture on d6.",
      correctFeedback: "exd6! You're still up material in development.",
      wrongFeedback: "Take on d6.",
      highlightSquares: ['e5', 'd6'],
    },

    // 3...Bxd6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pe_after_Bxd6,
      text: "3...Bxd6 — Black recaptures. The pawn count is even, but you're way ahead in development plans.",
      autoAdvance: 800,
    },

    // 4.Nf3
    {
      type: 'play-move',
      fen: FEN.pe_after_Bxd6,
      correctMove: 'Nf3',
      prompt: "Develop with tempo — the bishop is in your crosshairs.",
      hint: "Knight to f3 develops and eyes key squares.",
      correctFeedback: "Nf3! You're developing naturally while Black has wasted time. The London setup continues — Bf4, e3, and you're cruising.",
      wrongFeedback: "Develop the knight to f3.",
      highlightSquares: ['g1', 'f3'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Play the punish line from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.pe_after_e5, text: "1...e5?", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe_after_e5, correctMove: 'dxe5',
      prompt: "Your move.", hint: "dxe5.", correctFeedback: "dxe5.", wrongFeedback: "dxe5.",
    },
    { type: 'instruction', fen: FEN.pe_after_d6, text: "2...d6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe_after_d6, correctMove: 'exd6',
      prompt: "Your move.", hint: "exd6.", correctFeedback: "exd6.", wrongFeedback: "exd6.",
    },
    { type: 'instruction', fen: FEN.pe_after_Bxd6, text: "3...Bxd6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pe_after_Bxd6, correctMove: 'Nf3',
      prompt: "Your move.", hint: "Nf3.", correctFeedback: "Nf3.", wrongFeedback: "Nf3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Punish 2...c5?
// Teaches: 2...c5? 3.e3 cxd4 4.exd4
// ═══════════════════════════════════════════════════════════

export const LN_PUNISH_C5: OpeningLesson = {
  id: 'ln-punish-c5',
  title: 'Punish 2...c5?',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.d4 d5 2.Bf4)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the London setup — but Black will try to disrupt you early.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Start.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "The London bishop.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (2...c5? 3.e3 cxd4 4.exd4)
    // ═══════════════════════════════════════════

    // 2...c5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pc_after_c5,
      text: "2...c5?! Black challenges d4 immediately. But your bishop is already developed — you can handle this easily.",
      autoAdvance: 800,
    },

    // 3.e3
    {
      type: 'play-move',
      fen: FEN.pc_after_c5,
      correctMove: 'e3',
      prompt: "Stay calm — support d4.",
      hint: "e3 holds the center together.",
      correctFeedback: "e3! You calmly reinforce d4. If Black takes, you recapture with a great center.",
      wrongFeedback: "Play e3 to support d4.",
      highlightSquares: ['e2', 'e3'],
    },

    // 3...cxd4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.pc_after_cxd4,
      text: "3...cxd4 — Black trades off the tension.",
      autoAdvance: 800,
    },

    // 4.exd4
    {
      type: 'play-move',
      fen: FEN.pc_after_cxd4,
      correctMove: 'exd4',
      prompt: "Recapture and own the center!",
      hint: "Take back with the e-pawn.",
      correctFeedback: "exd4! You have a beautiful broad center with d4 and your bishop already on f4. Black gained nothing from the early c5.",
      wrongFeedback: "Recapture with exd4.",
      highlightSquares: ['e3', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bf4,
      text: "From memory — handle 2...c5.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.pc_after_c5, text: "2...c5?", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pc_after_c5, correctMove: 'e3',
      prompt: "Your move.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },
    { type: 'instruction', fen: FEN.pc_after_cxd4, text: "3...cxd4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.pc_after_cxd4, correctMove: 'exd4',
      prompt: "Your move.", hint: "exd4.", correctFeedback: "exd4.", wrongFeedback: "exd4.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: The Retreat
// Teaches: 5...Nc6 6.Nbd2 Bd6 7.Bg3
// Recap: 1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3
// ═══════════════════════════════════════════════════════════

export const LN_LESSON_3: OpeningLesson = {
  id: 'ln-3',
  title: 'The Retreat',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap — play the London through the pyramid.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Start.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "The London bishop.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3',
      prompt: "The triangle.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },
    { type: 'instruction', fen: FEN.after_e6, text: "3...e6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e6, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.", wrongFeedback: "Nf3.",
    },
    { type: 'instruction', fen: FEN.after_c5, text: "4...c5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_c5, correctMove: 'c3',
      prompt: "The pyramid.", hint: "c3.", correctFeedback: "c3.", wrongFeedback: "c3.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (5...Nc6 6.Nbd2 Bd6 7.Bg3)
    // ═══════════════════════════════════════════

    // 5...Nc6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "5...Nc6 — Black develops a knight and adds more pressure to d4.",
      autoAdvance: 800,
    },

    // 6.Nbd2
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Develop your other knight to d2. It supports e4, connects your pieces, and keeps the c-file clear.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Nbd2',
      prompt: "Bring the queenside knight into the game.",
      hint: "Knight to d2 — supports the center from behind.",
      correctFeedback: "Nbd2! A flexible square. The knight can reroute to e5 or support e4 later.",
      wrongFeedback: "Develop the knight to d2.",
      highlightSquares: ['b1', 'd2'],
    },

    // 6...Bd6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "6...Bd6 — Black challenges your London bishop directly. This is the critical moment.",
      autoAdvance: 800,
    },

    // 7.Bg3
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Don't panic. Retreat to g3. The bishop stays alive and still controls the h2-b8 diagonal. Let Black waste time chasing it.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'Bg3',
      prompt: "Black challenges your bishop — keep it safe!",
      hint: "Retreat to g3. The bishop lives to fight another day.",
      correctFeedback: "Bg3! The bishop retreats but stays powerful. Black's Bd6 isn't threatening anything now.",
      wrongFeedback: "Bg3 — keep the bishop alive on the diagonal.",
      highlightSquares: ['f4', 'g3'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 6...cxd4?! (releases tension)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "Sometimes after 6.Nbd2, Black plays 6...cxd4 — releasing the central tension. But this helps you!",
    },

    // 6...cxd4?! (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p3_after_cxd4,
      text: "6...cxd4?! Black trades, but now your e-pawn can take — giving you an ideal pawn center.",
      autoAdvance: 800,
    },

    // 7.exd4!
    {
      type: 'play-move',
      fen: FEN.p3_after_cxd4,
      correctMove: 'exd4',
      prompt: "Recapture and build a monster center!",
      hint: "Take back with the e-pawn.",
      correctFeedback: "exd4! Beautiful. You now have pawns on c3 and d4 with the bishop already on f4. Black helped you build the perfect center.",
      wrongFeedback: "Recapture with exd4.",
      highlightSquares: ['e3', 'd4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Play the next three White moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "5...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nbd2',
      prompt: "Your move.", hint: "Nbd2.", correctFeedback: "Nbd2.", wrongFeedback: "Nbd2.",
    },
    { type: 'instruction', fen: FEN.after_Bd6, text: "6...Bd6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Bg3',
      prompt: "Your move.", hint: "Bg3.", correctFeedback: "Bg3.", wrongFeedback: "Bg3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Jobava London
// Teaches: 3.Nc3 e6 4.e3
// Branch from after 2.Bf4 Nf6
// ═══════════════════════════════════════════════════════════

export const LN_JOBAVA_1: OpeningLesson = {
  id: 'ln-jobava-1',
  title: 'Jobava London',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.d4 d5 2.Bf4 Nf6)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap — play to the point where the Jobava diverges.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Start.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "The London bishop.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3.Nc3 e6 4.e3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Instead of 3.e3, try the Jobava London — play 3.Nc3! It's more aggressive. The knight goes to c3 first, keeping e4 in your plans.",
    },

    // 3.Nc3
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Nc3',
      prompt: "Go aggressive — knight to c3!",
      hint: "Nc3 instead of e3 — the Jobava way.",
      correctFeedback: "Nc3! The Jobava London. The knight supports e4 and you keep more tension in the position.",
      wrongFeedback: "Play Nc3 for the Jobava setup.",
      highlightSquares: ['b1', 'c3'],
    },

    // 3...e6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.jb_after_e6,
      text: "3...e6 — Black continues solidly.",
      autoAdvance: 800,
    },

    // 4.e3
    {
      type: 'play-move',
      fen: FEN.jb_after_e6,
      correctMove: 'e3',
      prompt: "Now support the center.",
      hint: "e3 completes the setup.",
      correctFeedback: "e3! You have the London bishop on f4, a knight on c3 eyeing e4, and a solid center. More dynamic than the standard London.",
      wrongFeedback: "Play e3 to solidify.",
      highlightSquares: ['e2', 'e3'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 3...c5? after Nc3
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.jb_after_Nc3,
      text: "After 3.Nc3, what if Black immediately plays 3...c5? It looks active, but you stay calm.",
    },

    // 3...c5? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.jp_after_c5,
      text: "3...c5? Black pushes before developing. You simply play e3 — the center holds.",
      autoAdvance: 800,
    },

    // 4.e3
    {
      type: 'play-move',
      fen: FEN.jp_after_c5,
      correctMove: 'e3',
      prompt: "Stay solid.",
      hint: "e3 keeps everything together.",
      correctFeedback: "e3! Your center is rock-solid. Black's c5 achieves nothing — you'll develop smoothly while they figure out their plan.",
      wrongFeedback: "Play e3.",
      highlightSquares: ['e2', 'e3'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Play the Jobava from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nc3',
      prompt: "Your move.", hint: "Nc3.", correctFeedback: "Nc3.", wrongFeedback: "Nc3.",
    },
    { type: 'instruction', fen: FEN.jb_after_e6, text: "3...e6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.jb_after_e6, correctMove: 'e3',
      prompt: "Your move.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: The Outpost
// Teaches: 7...O-O 8.Bd3 b6 9.O-O
// Recap: ...through 7.Bg3
// ═══════════════════════════════════════════════════════════

export const LN_LESSON_4: OpeningLesson = {
  id: 'ln-4',
  title: 'The Outpost',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Full recap — play the London through the retreat.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Start.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "Bishop first.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3',
      prompt: "Triangle.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },
    { type: 'instruction', fen: FEN.after_e6, text: "3...e6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e6, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.", wrongFeedback: "Nf3.",
    },
    { type: 'instruction', fen: FEN.after_c5, text: "4...c5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_c5, correctMove: 'c3',
      prompt: "Pyramid.", hint: "c3.", correctFeedback: "c3.", wrongFeedback: "c3.",
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "5...Nc6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nbd2',
      prompt: "Queenside knight.", hint: "Nbd2.", correctFeedback: "Nbd2.", wrongFeedback: "Nbd2.",
    },
    { type: 'instruction', fen: FEN.after_Bd6, text: "6...Bd6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Bg3',
      prompt: "The retreat.", hint: "Bg3.", correctFeedback: "Bg3.", wrongFeedback: "Bg3.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (7...O-O 8.Bd3 b6 9.O-O)
    // ═══════════════════════════════════════════

    // 7...O-O (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "7...O-O — Black castles. Smart. Now it's time to complete your setup.",
      autoAdvance: 800,
    },

    // 8.Bd3
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Develop the light-squared bishop to d3. It eyes the kingside and prepares castling.",
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Bd3',
      prompt: "Put the bishop on its best diagonal.",
      hint: "Bishop to d3 — aims at the kingside.",
      correctFeedback: "Bd3! The bishop points toward h7. Combined with Ne5 later, this is dangerous.",
      wrongFeedback: "Bishop to d3.",
      highlightSquares: ['f1', 'd3'],
      postMoveArrow: ['d3', 'h7'],
    },

    // 8...b6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.after_b6,
      text: "8...b6 — Black prepares to develop the bishop to b7.",
      autoAdvance: 800,
    },

    // 9.O-O
    {
      type: 'instruction',
      fen: FEN.after_b6,
      text: "Time to castle! Get your king safe and connect your rooks. The London setup is nearly complete.",
    },
    {
      type: 'play-move',
      fen: FEN.after_b6,
      correctMove: 'O-O',
      prompt: "Castle and get your king safe!",
      hint: "Castle kingside.",
      correctFeedback: "O-O! King is safe, rooks are connected. Next: Ne5 — the London dream outpost.",
      wrongFeedback: "Castle — O-O.",
      highlightSquares: ['e1', 'g1'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 8...Re8? (slow, misses the point)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "After 8.Bd3, what if Black plays 8...Re8 — a slow rook move? You can seize the outpost immediately.",
    },

    // 8...Re8? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.p4_after_Re8,
      text: "8...Re8? Too slow. The rook isn't doing anything useful on e8.",
      autoAdvance: 800,
    },

    // 9.Ne5!
    {
      type: 'play-move',
      fen: FEN.p4_after_Re8,
      correctMove: 'Ne5',
      prompt: "Jump to the outpost!",
      hint: "Ne5 — the London dream square.",
      correctFeedback: "Ne5! The knight lands on the perfect outpost. It can't be challenged by a pawn and it dominates the center.",
      wrongFeedback: "Plant the knight on e5.",
      highlightSquares: ['f3', 'e5'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Bg3,
      text: "Play the final three White moves.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_OO, text: "7...O-O.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_OO, correctMove: 'Bd3',
      prompt: "Your move.", hint: "Bd3.", correctFeedback: "Bd3.", wrongFeedback: "Bd3.",
    },
    { type: 'instruction', fen: FEN.after_b6, text: "8...b6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_b6, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Anti-...Bf5
// Teaches: 3...Bf5 4.c4! dxc4 5.Bxc4
// Branch from after 2.Bf4 Nf6 3.e3
// ═══════════════════════════════════════════════════════════

export const LN_ANTI_BF5: OpeningLesson = {
  id: 'ln-anti-bf5',
  title: 'Anti-...Bf5',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (1.d4 d5 2.Bf4 Nf6 3.e3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap the London setup — then Black tries to mirror your bishop.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Start.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "Bishop first.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3',
      prompt: "Triangle.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (3...Bf5 4.c4! dxc4 5.Bxc4)
    // ═══════════════════════════════════════════

    // 3...Bf5 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ab_after_Bf5,
      text: "3...Bf5 — Black mirrors you! Their bishop comes out to f5, just like yours went to f4. But you have a strong reply.",
      autoAdvance: 800,
    },

    // 4.c4!
    {
      type: 'instruction',
      fen: FEN.ab_after_Bf5,
      text: "Strike with c4! Attack the d5 pawn while Black's bishop is committed. This challenges the whole center.",
    },
    {
      type: 'play-move',
      fen: FEN.ab_after_Bf5,
      correctMove: 'c4',
      prompt: "Challenge the center — Black's bishop is offside!",
      hint: "c4 attacks d5 while the bishop is misplaced on f5.",
      correctFeedback: "c4! Attacking d5 with tempo. Black's Bf5 isn't helping defend the center.",
      wrongFeedback: "Play c4 to challenge d5.",
      highlightSquares: ['c2', 'c4'],
    },

    // 4...dxc4 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ab_after_dxc4,
      text: "4...dxc4 — Black takes. Now recapture with the bishop!",
      autoAdvance: 800,
    },

    // 5.Bxc4
    {
      type: 'play-move',
      fen: FEN.ab_after_dxc4,
      correctMove: 'Bxc4',
      prompt: "Recapture and develop at the same time!",
      hint: "Bishop takes c4 — you develop while recapturing.",
      correctFeedback: "Bxc4! You developed a bishop AND recaptured the pawn. Meanwhile Black's Bf5 isn't doing much. You're ahead in development.",
      wrongFeedback: "Bxc4 — develop and recapture.",
      highlightSquares: ['f1', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 5...e6? after Bxc4
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.ab_after_Bxc4,
      text: "After 5.Bxc4, what if Black plays 5...e6? It looks safe, but you can seize more space.",
    },

    // 5...e6? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.ap_after_e6,
      text: "5...e6? Passive. Black locks in the bishop on f5.",
      autoAdvance: 800,
    },

    // 6.Nc3!
    {
      type: 'play-move',
      fen: FEN.ap_after_e6,
      correctMove: 'Nc3',
      prompt: "Keep developing with tempo!",
      hint: "Nc3 develops and eyes d5.",
      correctFeedback: "Nc3! You're fully developed with an active center. The bishop on f5 is running out of good squares.",
      wrongFeedback: "Play Nc3 — develop with purpose.",
      highlightSquares: ['b1', 'c3'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: "Play the anti-Bf5 from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.ab_after_Bf5, text: "3...Bf5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.ab_after_Bf5, correctMove: 'c4',
      prompt: "Your move.", hint: "c4.", correctFeedback: "c4.", wrongFeedback: "c4.",
    },
    { type: 'instruction', fen: FEN.ab_after_dxc4, text: "4...dxc4.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.ab_after_dxc4, correctMove: 'Bxc4',
      prompt: "Your move.", hint: "Bxc4.", correctFeedback: "Bxc4.", wrongFeedback: "Bxc4.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Bd6 Challenge
// Teaches: 4...Bd6 5.Bxd6 Qxd6 6.Bd3
// Branch from after 4.Nf3
// ═══════════════════════════════════════════════════════════

export const LN_BD6_1: OpeningLesson = {
  id: 'ln-bd6-1',
  title: 'Bd6 Challenge',
  defaultOrientation: 'white',
  steps: [

    // ═══════════════════════════════════════════
    // ACT 1: RECAP (through 4.Nf3)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap — play to the point where Black challenges your bishop.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Start.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "London bishop.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3',
      prompt: "Triangle.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },
    { type: 'instruction', fen: FEN.after_e6, text: "3...e6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.after_e6, correctMove: 'Nf3',
      prompt: "Develop.", hint: "Nf3.", correctFeedback: "Nf3.", wrongFeedback: "Nf3.",
    },

    // ═══════════════════════════════════════════
    // ACT 2: TEACH (4...Bd6 5.Bxd6 Qxd6 6.Bd3)
    // ═══════════════════════════════════════════

    // 4...Bd6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.bd_after_Bd6,
      text: "4...Bd6 — Black puts the bishop right on f4's doorstep, forcing a decision. Here, we trade.",
      autoAdvance: 800,
    },

    // 5.Bxd6
    {
      type: 'instruction',
      fen: FEN.bd_after_Bd6,
      text: "Trade bishops. After Bxd6, Black recaptures with the queen — but the queen on d6 can become a target later.",
    },
    {
      type: 'play-move',
      fen: FEN.bd_after_Bd6,
      correctMove: 'Bxd6',
      prompt: "Trade the bishops.",
      hint: "Capture on d6.",
      correctFeedback: "Bxd6! The trade is fine here. Black's queen will be slightly misplaced on d6.",
      wrongFeedback: "Take on d6.",
      highlightSquares: ['f4', 'd6'],
    },

    // 5...Qxd6 (auto-advance)
    {
      type: 'instruction',
      fen: FEN.bd_after_Qxd6,
      text: "5...Qxd6 — The queen recaptures. It's active but exposed on d6.",
      autoAdvance: 800,
    },

    // 6.Bd3
    {
      type: 'play-move',
      fen: FEN.bd_after_Qxd6,
      correctMove: 'Bd3',
      prompt: "Develop the light-squared bishop.",
      hint: "Bd3 aims at the kingside.",
      correctFeedback: "Bd3! Without the dark-squared bishops on the board, your light-squared bishop becomes even more important. It eyes h7 and supports a future e4 push.",
      wrongFeedback: "Bishop to d3.",
      highlightSquares: ['f1', 'd3'],
      postMoveArrow: ['d3', 'h7'],
    },

    // ═══════════════════════════════════════════
    // ACT 3: PUNISH — 6...O-O? (castles into c4 break)
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.bd_after_Bd3,
      text: "After 6.Bd3, if Black castles immediately with 6...O-O, you can seize the center.",
    },

    // 6...O-O? (auto-advance)
    {
      type: 'instruction',
      fen: FEN.bp_after_OO,
      text: "6...O-O? Safe but passive. Black hasn't challenged your center at all.",
      autoAdvance: 800,
    },

    // 7.c4!
    {
      type: 'play-move',
      fen: FEN.bp_after_OO,
      correctMove: 'c4',
      prompt: "Strike the center while Black is passive!",
      hint: "c4 challenges d5 with tempo.",
      correctFeedback: "c4! Attacking d5 immediately. You're grabbing space while Black has been too slow.",
      wrongFeedback: "Play c4 — challenge the center.",
      highlightSquares: ['c2', 'c4'],
    },

    // ═══════════════════════════════════════════
    // ACT 4: RECALL
    // ═══════════════════════════════════════════

    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Play the Bd6 line from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.bd_after_Bd6, text: "4...Bd6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.bd_after_Bd6, correctMove: 'Bxd6',
      prompt: "Your move.", hint: "Bxd6.", correctFeedback: "Bxd6.", wrongFeedback: "Bxd6.",
    },
    { type: 'instruction', fen: FEN.bd_after_Qxd6, text: "5...Qxd6.", autoAdvance: 800 },
    {
      type: 'play-move', fen: FEN.bd_after_Qxd6, correctMove: 'Bd3',
      prompt: "Your move.", hint: "Bd3.", correctFeedback: "Bd3.", wrongFeedback: "Bd3.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON: Level 1 Test
// Tests all main line moves + key deviations.
// ═══════════════════════════════════════════════════════════

export const LN_TEST_1: OpeningLesson = {
  id: 'ln-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [

    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test — play the full London System main line. No hints this time.",
      buttonText: "LET'S GO",
    },

    // Move 1: d4
    {
      type: 'play-move', fen: FEN.start, correctMove: 'd4',
      prompt: "Your move.", hint: "d4.", correctFeedback: "d4.", wrongFeedback: "d4.",
    },
    // 1...d5
    { type: 'instruction', fen: FEN.after_d5, text: "1...d5.", autoAdvance: 800 },

    // Move 2: Bf4
    {
      type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4',
      prompt: "Your move.", hint: "Bf4.", correctFeedback: "Bf4.", wrongFeedback: "Bf4.",
    },
    // 2...Nf6
    { type: 'instruction', fen: FEN.after_Nf6, text: "2...Nf6.", autoAdvance: 800 },

    // Move 3: e3
    {
      type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3',
      prompt: "Your move.", hint: "e3.", correctFeedback: "e3.", wrongFeedback: "e3.",
    },
    // 3...e6
    { type: 'instruction', fen: FEN.after_e6, text: "3...e6.", autoAdvance: 800 },

    // Move 4: Nf3
    {
      type: 'play-move', fen: FEN.after_e6, correctMove: 'Nf3',
      prompt: "Your move.", hint: "Nf3.", correctFeedback: "Nf3.", wrongFeedback: "Nf3.",
    },
    // 4...c5
    { type: 'instruction', fen: FEN.after_c5, text: "4...c5.", autoAdvance: 800 },

    // Move 5: c3
    {
      type: 'play-move', fen: FEN.after_c5, correctMove: 'c3',
      prompt: "Your move.", hint: "c3.", correctFeedback: "c3.", wrongFeedback: "c3.",
    },
    // 5...Nc6
    { type: 'instruction', fen: FEN.after_Nc6, text: "5...Nc6.", autoAdvance: 800 },

    // Move 6: Nbd2
    {
      type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nbd2',
      prompt: "Your move.", hint: "Nbd2.", correctFeedback: "Nbd2.", wrongFeedback: "Nbd2.",
    },
    // 6...Bd6
    { type: 'instruction', fen: FEN.after_Bd6, text: "6...Bd6.", autoAdvance: 800 },

    // Move 7: Bg3
    {
      type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Bg3',
      prompt: "Your move.", hint: "Bg3.", correctFeedback: "Bg3.", wrongFeedback: "Bg3.",
    },
    // 7...O-O
    { type: 'instruction', fen: FEN.after_OO, text: "7...O-O.", autoAdvance: 800 },

    // Move 8: Bd3
    {
      type: 'play-move', fen: FEN.after_OO, correctMove: 'Bd3',
      prompt: "Your move.", hint: "Bd3.", correctFeedback: "Bd3.", wrongFeedback: "Bd3.",
    },
    // 8...b6
    { type: 'instruction', fen: FEN.after_b6, text: "8...b6.", autoAdvance: 800 },

    // Move 9: O-O
    {
      type: 'play-move', fen: FEN.after_b6, correctMove: 'O-O',
      prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

export const LONDON_LESSONS: OpeningLesson[] = [
  LN_LESSON_1,
  LN_LESSON_2,
  LN_PUNISH_E5,
  LN_PUNISH_C5,
  LN_LESSON_3,
  LN_JOBAVA_1,
  LN_LESSON_4,
  LN_ANTI_BF5,
  LN_BD6_1,
  LN_TEST_1,
]

export function getLondonLesson(id: string): OpeningLesson | undefined {
  return LONDON_LESSONS.find(l => l.id === id)
}
