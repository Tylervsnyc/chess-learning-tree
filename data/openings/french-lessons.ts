import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// FRENCH DEFENSE LESSONS (fr-1 through fr-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line (Winawer): 1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
//                      7.Qg4 O-O 8.Bd3 Nbc6 9.Qh5 Ng6
//                      10.Nf3 Qc7 11.Be3 c4 12.Bxg6 fxg6
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e6:    'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:    'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:   'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_Bb4:   'rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4',
  after_e5:    'rnbqk1nr/ppp2ppp/4p3/3pP3/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_c5:    'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
  after_a3:    'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/P1N5/1PP2PPP/R1BQKBNR b KQkq - 0 5',
  after_Bxc3:  'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1b5/1PP2PPP/R1BQKBNR w KQkq - 0 6',
  after_bxc3:  'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq - 0 6',
  after_Ne7:   'rnbqk2r/pp2nppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR w KQkq - 1 7',
  after_Qg4:   'rnbqk2r/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR b KQkq - 2 7',
  after_OO:    'rnbq1rk1/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR w KQ - 3 8',
  after_Bd3:   'rnbq1rk1/pp2nppp/4p3/2ppP3/3P2Q1/P1PB4/2P2PPP/R1B1K1NR b KQ - 4 8',
  after_Nbc6:  'r1bq1rk1/pp2nppp/2n1p3/2ppP3/3P2Q1/P1PB4/2P2PPP/R1B1K1NR w KQ - 5 9',
  after_Qh5:   'r1bq1rk1/pp2nppp/2n1p3/2ppP2Q/3P4/P1PB4/2P2PPP/R1B1K1NR b KQ - 6 9',
  after_Ng6:   'r1bq1rk1/pp3ppp/2n1p1n1/2ppP2Q/3P4/P1PB4/2P2PPP/R1B1K1NR w KQ - 7 10',
  after_Nf3:   'r1bq1rk1/pp3ppp/2n1p1n1/2ppP2Q/3P4/P1PB1N2/2P2PPP/R1B1K2R b KQ - 8 10',
  after_Qc7:   'r1b2rk1/ppq2ppp/2n1p1n1/2ppP2Q/3P4/P1PB1N2/2P2PPP/R1B1K2R w KQ - 9 11',
  after_Be3:   'r1b2rk1/ppq2ppp/2n1p1n1/2ppP2Q/3P4/P1PBBN2/2P2PPP/R3K2R b KQ - 10 11',
  after_c4:    'r1b2rk1/ppq2ppp/2n1p1n1/3pP2Q/2pP4/P1PBBN2/2P2PPP/R3K2R w KQ - 0 12',
  after_Bxg6:  'r1b2rk1/ppq2ppp/2n1p1B1/3pP2Q/2pP4/P1P1BN2/2P2PPP/R3K2R b KQ - 0 12',
  after_fxg6:  'r1b2rk1/ppq3pp/2n1p1p1/3pP2Q/2pP4/P1P1BN2/2P2PPP/R3K2R w KQ - 0 13',

  // Deviation: 4.exd5 (Exchange Variation)
  dev_exd5_after_exd5w: 'rnbqk1nr/ppp2ppp/4p3/3P4/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  dev_exd5_after_exd5b: 'rnbqk1nr/ppp2ppp/8/3p4/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
  dev_exd5_after_Bd3:   'rnbqk1nr/ppp2ppp/8/3p4/1b1P4/2NB4/PPP2PPP/R1BQK1NR b KQkq - 1 5',
  dev_exd5_after_Nc6:   'r1bqk1nr/ppp2ppp/2n5/3p4/1b1P4/2NB4/PPP2PPP/R1BQK1NR w KQkq - 2 6',
  dev_exd5_after_a3:    'r1bqk1nr/ppp2ppp/2n5/3p4/1b1P4/P1NB4/1PP2PPP/R1BQK1NR b KQkq - 0 6',
  dev_exd5_after_Bxc3:  'r1bqk1nr/ppp2ppp/2n5/3p4/3P4/P1bB4/1PP2PPP/R1BQK1NR w KQkq - 0 7',
  dev_exd5_after_bxc3:  'r1bqk1nr/ppp2ppp/2n5/3p4/3P4/P1PB4/2P2PPP/R1BQK1NR b KQkq - 0 7',
  dev_exd5_after_Nge7:  'r1bqk2r/ppp1nppp/2n5/3p4/3P4/P1PB4/2P2PPP/R1BQK1NR w KQkq - 1 8',

  // Deviation: 7.Nf3 (instead of 7.Qg4)
  dev_Nf3_after_Nf3:    'rnbqk2r/pp2nppp/4p3/2ppP3/3P4/P1P2N2/2P2PPP/R1BQKB1R b KQkq - 2 7',
  dev_Nf3_after_Bd7:    'rn1qk2r/pp1bnppp/4p3/2ppP3/3P4/P1P2N2/2P2PPP/R1BQKB1R w KQkq - 3 8',
  dev_Nf3_after_a4:     'rn1qk2r/pp1bnppp/4p3/2ppP3/P2P4/2P2N2/2P2PPP/R1BQKB1R b KQkq - 0 8',
  dev_Nf3_after_Qa5:    'rn2k2r/pp1bnppp/4p3/q1ppP3/P2P4/2P2N2/2P2PPP/R1BQKB1R w KQkq - 1 9',
  dev_Nf3_after_Bd2:    'rn2k2r/pp1bnppp/4p3/q1ppP3/P2P4/2P2N2/2PB1PPP/R2QKB1R b KQkq - 2 9',
  dev_Nf3_after_Nbc6:   'r3k2r/pp1bnppp/2n1p3/q1ppP3/P2P4/2P2N2/2PB1PPP/R2QKB1R w KQkq - 3 10',
}


// ═══════════════════════════════════════════════════════════
// fr-1: THE FRENCH WALL (1.e4 e6 2.d4 d5 3.Nc3 Bb4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const FR_1: OpeningLesson = {
  id: 'fr-1',
  title: 'The French Wall',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The French Defense — you build a solid wall, then patiently break through. Let's learn the setup.",
    },

    // ── PREDICT/REVEAL 1: e6 ──
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
      correctMove: 'e6',
      prompt: "What's your first move?",
      hint: 'Build the wall — push the e-pawn one square.',
      correctFeedback: 'e6 builds a solid wall and prepares d5 next.',
      wrongFeedback: 'Play e6 — the foundation of the French.',
      postMoveArrow: ['e6', 'd5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 is the wall. It supports d5 and keeps your position rock-solid. Patience is power.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: d5 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White pushes d4, building a big center.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "White has two pawns in the center. How do you fight back?",
      hint: 'Challenge the center directly with a pawn.',
      correctFeedback: 'd5 immediately challenges White\'s e4 pawn. No waiting around.',
      wrongFeedback: 'Play d5 — strike at the center.',
      postMoveArrow: ['d5', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 hits e4 head-on. White has to decide — trade, push, or defend. You've forced the issue.",
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 3: Bb4 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White develops the knight to c3, defending e4.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: "White's knight defends e4. How do you keep the pressure on?",
      hint: 'Pin the knight to the king with your bishop.',
      correctFeedback: "Bb4! The Winawer — you pin the knight and threaten to remove e4's defender.",
      wrongFeedback: 'Play Bb4 — pin the knight that defends e4.',
      postMoveArrow: ['b4', 'c3'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Bb4 is the Winawer Variation. The pin on the knight puts real pressure on White's center.",
      arrow: ['f8', 'b4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play the whole setup from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: 'd4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: 'Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "That's the French Winawer — e6, d5, Bb4. The wall is built and the knight is pinned. Time to fight.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// fr-2: THE WINAWER STRIKE (4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7)
// ═══════════════════════════════════════════════════════════

const FR_2: OpeningLesson = {
  id: 'fr-2',
  title: 'The Winawer Strike',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "White pushes e5, gaining space. Your mission: undermine the pawn chain from the base and wreck White's structure.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me the French Wall.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: 'd4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: 'Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },

    // ── PREDICT/REVEAL 1: c5 ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White pushes e5, grabbing space and locking the center.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'c5',
      prompt: "White has a pawn chain on d4-e5. How do you attack it?",
      hint: 'Attack the base of the chain — the d4 pawn.',
      correctFeedback: "c5! You attack the base of the pawn chain. This is the key French idea.",
      wrongFeedback: 'Play c5 — undermine the d4 pawn from below.',
      postMoveArrow: ['c5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 attacks d4, the base of White's pawn chain. In the French, you always attack the chain from the bottom.",
      arrow: ['c7', 'c5'],
    },

    // ── PREDICT/REVEAL 2: Bxc3+ ──
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: "White plays a3, forcing a decision about your bishop.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3+',
      prompt: "Your bishop is under attack. What do you do?",
      hint: 'Take the knight — double their pawns.',
      correctFeedback: "Bxc3+! You trade the bishop for the knight and saddle White with ugly doubled c-pawns.",
      wrongFeedback: 'Play Bxc3+ — wreck their pawn structure.',
      postMoveArrow: ['c3', 'e1'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxc3,
      text: "White must recapture with the b-pawn. Those doubled c-pawns will be a permanent weakness.",
      arrow: ['b4', 'c3'],
    },

    // ── PREDICT/REVEAL 3: Ne7 ──
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: "White recaptures bxc3. The doubled pawns are locked in.",
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Ne7',
      prompt: "Time to develop a knight. Where does it go?",
      hint: 'The knight goes to e7 — heading for the kingside.',
      correctFeedback: "Ne7! The knight reroutes toward g6 or f5, supporting the kingside.",
      wrongFeedback: 'Play Ne7 — it will reroute to the kingside later.',
      postMoveArrow: ['e7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Ne7 keeps options open — the knight can go to g6, f5, or even c6. A flexible development move.",
      arrow: ['g8', 'e7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Play all three Winawer moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3+',
      prompt: 'Your move.',
      hint: 'Bxc3+.',
      correctFeedback: 'Bxc3+.',
      wrongFeedback: 'Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Ne7',
      prompt: 'Your move.',
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "c5, Bxc3+, Ne7. You've attacked the chain, wrecked the structure, and developed. The French is rolling.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// fr-3: CASTLE & DEVELOP (7.Qg4 O-O 8.Bd3 Nbc6 9.Qh5 Ng6)
// ═══════════════════════════════════════════════════════════

const FR_3: OpeningLesson = {
  id: 'fr-3',
  title: 'Castle & Develop',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "White brings out the queen early, aiming at g7. You need to castle fast and finish development.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Quick review — play the Winawer Strike.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3+',
      prompt: 'Your move.',
      hint: 'Bxc3+.',
      correctFeedback: 'Bxc3+.',
      wrongFeedback: 'Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Ne7',
      prompt: 'Your move.',
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },

    // ── PREDICT/REVEAL 1: O-O ──
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: "White plays Qg4, eyeing g7 and putting pressure on the kingside.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qg4,
      correctMove: 'O-O',
      prompt: "White's queen is staring at g7. What's the priority?",
      hint: 'Get your king safe — castle now.',
      correctFeedback: "Castle! Your king escapes to safety and the rook comes to f8.",
      wrongFeedback: 'Castle kingside — safety first.',
      postMoveArrow: ['f8', 'f2'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Castling dodges the queen's threats. The g7 pawn is defended by the king, and the rook on f8 is ready for action.",
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 2: Nbc6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White develops the bishop to d3, aiming at the kingside.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nbc6',
      prompt: "You're safely castled. Time to develop — which piece?",
      hint: 'Bring the queenside knight into the game.',
      correctFeedback: "Nbc6 develops the last minor piece and puts more pressure on d4.",
      wrongFeedback: 'Play Nbc6 — develop and target d4.',
      postMoveArrow: ['c6', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbc6,
      text: "The knight on c6 adds pressure to d4 and e5. All your minor pieces are in the fight now.",
      arrow: ['b8', 'c6'],
    },

    // ── PREDICT/REVEAL 3: Ng6 ──
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: "White relocates the queen to h5, increasing kingside pressure.",
      autoAdvance: 800,
      highlightSquares: ['g4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qh5,
      correctMove: 'Ng6',
      prompt: "White's queen is on h5. How do you bolster the kingside?",
      hint: 'Reroute the e7 knight toward the kingside.',
      correctFeedback: "Ng6! The knight defends from g6 and can jump to f4 or h4 later.",
      wrongFeedback: 'Play Ng6 — reroute the knight to defend and counterattack.',
      postMoveArrow: ['g6', 'f4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng6,
      text: "Ng6 is a multi-purpose move. It defends the kingside and eyes f4, a powerful outpost.",
      arrow: ['e7', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Play all three development moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: 'Qg4.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qg4,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nbc6',
      prompt: 'Your move.',
      hint: 'Nbc6.',
      correctFeedback: 'Nbc6.',
      wrongFeedback: 'Nbc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: 'Qh5.',
      autoAdvance: 800,
      highlightSquares: ['g4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qh5,
      correctMove: 'Ng6',
      prompt: 'Your move.',
      hint: 'Ng6.',
      correctFeedback: 'Ng6.',
      wrongFeedback: 'Ng6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng6,
      text: "O-O, Nbc6, Ng6. You're castled, developed, and the kingside is covered. Time to squeeze.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// fr-4: THE SQUEEZE (10.Nf3 Qc7 11.Be3 c4 12.Bxg6 fxg6)
// ═══════════════════════════════════════════════════════════

const FR_4: OpeningLesson = {
  id: 'fr-4',
  title: 'The Squeeze',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng6,
      text: "You're fully developed. Now it's time to squeeze White — connect the rooks, lock the queenside, and prepare a break.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Prove you remember the development plan.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: 'Qg4.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qg4,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nbc6',
      prompt: 'Your move.',
      hint: 'Nbc6.',
      correctFeedback: 'Nbc6.',
      wrongFeedback: 'Nbc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: 'Qh5.',
      autoAdvance: 800,
      highlightSquares: ['g4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qh5,
      correctMove: 'Ng6',
      prompt: 'Your move.',
      hint: 'Ng6.',
      correctFeedback: 'Ng6.',
      wrongFeedback: 'Ng6.',
    },

    // ── PREDICT/REVEAL 1: Qc7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White develops the knight to f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Qc7',
      prompt: "Your pieces are developed. How do you connect the rooks?",
      hint: 'Move the queen — clear the back rank and eye the c-file.',
      correctFeedback: "Qc7 connects the rooks and eyes the c-file. Quiet but powerful.",
      wrongFeedback: 'Play Qc7 — connect the rooks and watch the c-file.',
      postMoveArrow: ['c7', 'c3'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Qc7 is a classic French move. The queen connects the rooks and puts pressure down the c-file toward c3.",
      arrow: ['d8', 'c7'],
    },

    // ── PREDICT/REVEAL 2: c4 ──
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "White develops the bishop to e3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c4',
      prompt: "How do you lock down the queenside and cramp White?",
      hint: 'Push the c-pawn forward — shut down White\'s bishop.',
      correctFeedback: "c4! This locks the queenside and shuts the Bd3 out of the game.",
      wrongFeedback: 'Play c4 — cramp White and kill the bishop\'s diagonal.',
      postMoveArrow: ['c4', 'd3'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "c4 is a positional clamp. The Bd3 is blocked, the queenside is locked, and White is running out of ideas.",
      arrow: ['c5', 'c4'],
    },

    // ── PREDICT/REVEAL 3: fxg6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bxg6,
      text: "White captures Bxg6, trying to open lines toward your king.",
      autoAdvance: 800,
      highlightSquares: ['d3', 'g6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bxg6,
      correctMove: 'fxg6',
      prompt: "White just took on g6. How do you recapture?",
      hint: 'Take with the f-pawn — open the f-file for your rook.',
      correctFeedback: "fxg6! The f-file is now open for your rook. Counterplay is coming.",
      wrongFeedback: 'Take fxg6 — open the f-file for your rook.',
      postMoveArrow: ['f8', 'f2'],
    },
    {
      type: 'instruction',
      fen: FEN.after_fxg6,
      text: "Taking with the f-pawn opens the f-file. Your rook will become a monster on f8.",
      arrow: ['f7', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ng6,
      text: "All three squeeze moves from memory. Go.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: 'Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c4',
      prompt: 'Your move.',
      hint: 'c4.',
      correctFeedback: 'c4.',
      wrongFeedback: 'c4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxg6,
      text: 'Bxg6.',
      autoAdvance: 800,
      highlightSquares: ['d3', 'g6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bxg6,
      correctMove: 'fxg6',
      prompt: 'Your move.',
      hint: 'fxg6.',
      correctFeedback: 'fxg6.',
      wrongFeedback: 'fxg6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_fxg6,
      text: "Qc7, c4, fxg6. The squeeze is complete — White is cramped and you have the open f-file. That's the French.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// fr-dev-exd5: DEVIATION — White plays 4.exd5 (Exchange Variation)
// Teaches: exd5, Nc6, Nge7
// ═══════════════════════════════════════════════════════════

const FR_DEV_EXD5: OpeningLesson = {
  id: 'fr-dev-exd5',
  title: 'Dev 4.exd5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Sometimes White trades pawns with 4.exd5 instead of pushing e5. The Exchange Variation is calm, but you still get a good game.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me the French Wall first.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: 'e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: 'd4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: 'Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_exd5w,
      text: "White plays 4.exd5 instead of 4.e5. The Exchange Variation — simpler but you still get active play.",
      highlightSquares: ['e4', 'd5'],
    },

    // ── PREDICT/REVEAL 1: exd5 ──
    {
      type: 'play-move',
      fen: FEN.dev_exd5_after_exd5w,
      correctMove: 'exd5',
      prompt: "White captured your d5 pawn. How do you recapture?",
      hint: 'Take back with the e-pawn.',
      correctFeedback: "exd5 recaptures and opens the e-file for your pieces.",
      wrongFeedback: 'Take exd5 — recapture the pawn.',
      postMoveArrow: ['d5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_exd5b,
      text: "exd5 gives you a symmetrical center. The e-file is half-open now — your rook will love it later.",
      arrow: ['e6', 'd5'],
    },

    // ── PREDICT/REVEAL 2: Nc6 ──
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Bd3,
      text: "White develops the bishop to d3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_exd5_after_Bd3,
      correctMove: 'Nc6',
      prompt: "How do you continue developing?",
      hint: 'Bring the queenside knight out.',
      correctFeedback: "Nc6 develops naturally and pressures d4.",
      wrongFeedback: 'Play Nc6 — develop and target d4.',
      postMoveArrow: ['c6', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Nc6,
      text: "Nc6 puts immediate pressure on d4. White's center is under attack.",
      arrow: ['b8', 'c6'],
    },

    // ── INTERMEDIATE: a3 forces Bxc3+, bxc3 (auto-advance) ──
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_a3,
      text: "White plays a3, kicking your bishop.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Bxc3,
      text: "Bxc3+ — same idea as the main line.",
      autoAdvance: 800,
      highlightSquares: ['b4', 'c3'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_bxc3,
      text: "bxc3. White's pawns are doubled again.",
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },

    // ── PREDICT/REVEAL 3: Nge7 ──
    {
      type: 'play-move',
      fen: FEN.dev_exd5_after_bxc3,
      correctMove: 'Nge7',
      prompt: "Time for the other knight. Where does it go?",
      hint: 'Develop it to e7 — flexible and solid.',
      correctFeedback: "Nge7! A solid development square. The knight can go to g6 or f5 next.",
      wrongFeedback: 'Play Nge7 — keep things flexible.',
      postMoveArrow: ['e7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Nge7,
      text: "Nge7 completes your development. You have a solid position with active pieces and those doubled c-pawns to target.",
      arrow: ['g8', 'e7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_exd5w,
      text: "White played exd5. Show me the response.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_exd5_after_exd5w,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_exd5_after_Bd3,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Bxc3,
      text: 'Bxc3+.',
      autoAdvance: 800,
      highlightSquares: ['b4', 'c3'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_exd5_after_bxc3,
      correctMove: 'Nge7',
      prompt: 'Your move.',
      hint: 'Nge7.',
      correctFeedback: 'Nge7.',
      wrongFeedback: 'Nge7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_exd5_after_Nge7,
      text: "exd5, Nc6, Nge7. The Exchange Variation is tame, but you still have a solid game with those doubled pawns to exploit.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// fr-dev-Nf3: DEVIATION — White plays 7.Nf3 (instead of 7.Qg4)
// Teaches: Bd7, Qa5, Nbc6
// ═══════════════════════════════════════════════════════════

const FR_DEV_NF3: OpeningLesson = {
  id: 'fr-dev-Nf3',
  title: 'Dev 7.Nf3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Sometimes White plays 7.Nf3 instead of Qg4 — a quieter approach. You develop calmly and activate the queen.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Show me the Winawer Strike.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3+',
      prompt: 'Your move.',
      hint: 'Bxc3+.',
      correctFeedback: 'Bxc3+.',
      wrongFeedback: 'Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Ne7',
      prompt: 'Your move.',
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf3,
      text: "White plays 7.Nf3 instead of the aggressive Qg4. A solid approach — you develop quietly.",
      highlightSquares: ['g1', 'f3'],
    },

    // ── PREDICT/REVEAL 1: Bd7 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Nf3,
      correctMove: 'Bd7',
      prompt: "No immediate threats. How do you continue developing?",
      hint: 'Develop the bishop — it needs to get off the back rank.',
      correctFeedback: "Bd7 develops the last minor piece and connects the rooks.",
      wrongFeedback: 'Play Bd7 — finish development.',
      postMoveArrow: ['d7', 'a4'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Bd7,
      text: "Bd7 is solid and flexible. The bishop can support Qa5 or swing to c6 later.",
      arrow: ['c8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: Qa5 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_a4,
      text: "White pushes a4, grabbing queenside space.",
      autoAdvance: 800,
      highlightSquares: ['a3', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_a4,
      correctMove: 'Qa5',
      prompt: "White is expanding on the queenside. Where does your queen go?",
      hint: 'Activate the queen — target the weak c3 pawn.',
      correctFeedback: "Qa5! The queen is active and puts pressure on the vulnerable c3 pawn.",
      wrongFeedback: 'Play Qa5 — target the doubled c-pawns.',
      postMoveArrow: ['a5', 'c3'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Qa5,
      text: "Qa5 attacks c3 and keeps White honest. Those doubled pawns are a real target now.",
      arrow: ['d8', 'a5'],
    },

    // ── PREDICT/REVEAL 3: Nbc6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Bd2,
      text: "White plays Bd2, defending c3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Bd2,
      correctMove: 'Nbc6',
      prompt: "White defended c3. How do you keep developing?",
      hint: 'Bring the queenside knight into the game.',
      correctFeedback: "Nbc6 develops the last piece and increases pressure on d4 and e5.",
      wrongFeedback: 'Play Nbc6 — develop and pressure the center.',
      postMoveArrow: ['c6', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nbc6,
      text: "All pieces are developed. You have pressure on c3, d4, and e5 — White is stretched thin.",
      arrow: ['b8', 'c6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf3,
      text: "White played Nf3. Show me the plan.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Nf3,
      correctMove: 'Bd7',
      prompt: 'Your move.',
      hint: 'Bd7.',
      correctFeedback: 'Bd7.',
      wrongFeedback: 'Bd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_a4,
      text: 'a4.',
      autoAdvance: 800,
      highlightSquares: ['a3', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_a4,
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Bd2,
      text: 'Bd2.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Bd2,
      correctMove: 'Nbc6',
      prompt: 'Your move.',
      hint: 'Nbc6.',
      correctFeedback: 'Nbc6.',
      wrongFeedback: 'Nbc6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nbc6,
      text: "Bd7, Qa5, Nbc6. Against the quiet Nf3, you develop smoothly and target those doubled pawns.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// fr-test-1: LEVEL 1 TEST
// Tests main line + both deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const FR_TEST_1: OpeningLesson = {
  id: 'fr-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the full French Winawer from memory. Main line first, then deviations.",
    },
    // Lesson 1: e6, d5, Bb4
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    // Lesson 2: c5, Bxc3+, Ne7
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    // Lesson 3: O-O, Nbc6, Ng6
    { type: 'instruction', fen: FEN.after_Qg4, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },
    { type: 'instruction', fen: FEN.after_Qh5, text: 'Qh5.', autoAdvance: 800, highlightSquares: ['g4', 'h5'] },
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },

    // Lesson 4: Qc7, c4, fxg6
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_Bxg6, text: 'Bxg6.', autoAdvance: 800, highlightSquares: ['d3', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bxg6, correctMove: 'fxg6', prompt: 'Your move.', hint: 'fxg6.', correctFeedback: 'fxg6.', wrongFeedback: 'fxg6.' },

    // ── DEVIATION 1: 4.exd5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Main line done. Now handle the deviations.",
    },
    { type: 'instruction', fen: FEN.dev_exd5_after_exd5w, text: "White plays 4.exd5.", autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_exd5w, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_Bd3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_a3, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'instruction', fen: FEN.dev_exd5_after_Bxc3, text: 'Bxc3+.', autoAdvance: 800, highlightSquares: ['b4', 'c3'] },
    { type: 'instruction', fen: FEN.dev_exd5_after_bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_bxc3, correctMove: 'Nge7', prompt: 'Your move.', hint: 'Nge7.', correctFeedback: 'Nge7.', wrongFeedback: 'Nge7.' },

    // ── DEVIATION 2: 7.Nf3 ──
    { type: 'instruction', fen: FEN.dev_Nf3_after_Nf3, text: "White plays 7.Nf3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Nf3, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_a4, text: 'a4.', autoAdvance: 800, highlightSquares: ['a3', 'a4'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_a4, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Bd2, text: 'Bd2.', autoAdvance: 800, highlightSquares: ['c1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Bd2, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const FRENCH_LESSONS: Record<string, OpeningLesson> = {
  'fr-1': FR_1,
  'fr-2': FR_2,
  'fr-3': FR_3,
  'fr-4': FR_4,
  'fr-dev-exd5': FR_DEV_EXD5,
  'fr-dev-Nf3': FR_DEV_NF3,
  'fr-test-1': FR_TEST_1,
}

export function getFrenchLesson(id: string): OpeningLesson | undefined {
  return FRENCH_LESSONS[id]
}
