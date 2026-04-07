import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// CARO-KANN DEFENSE LESSONS (ck-1 through ck-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6
//            6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6
//            11.Bd2 Ngf6 12.O-O-O Be7
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:     'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:     'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:     'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:     'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_dxe4:   'rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Nxe4:   'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Bf5:    'rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng3:    'rn1qkbnr/pp2pppp/2p5/5b2/3P4/6N1/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_Bg6:    'rn1qkbnr/pp2pppp/2p3b1/8/3P4/6N1/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  after_h4:     'rn1qkbnr/pp2pppp/2p3b1/8/3P3P/6N1/PPP2PP1/R1BQKBNR b KQkq - 0 6',
  after_h6:     'rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/6N1/PPP2PP1/R1BQKBNR w KQkq - 0 7',
  after_Nf3:    'rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R b KQkq - 1 7',
  after_Nd7:    'r2qkbnr/pp1nppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R w KQkq - 2 8',
  after_h5:     'r2qkbnr/pp1nppp1/2p3bp/7P/3P4/5NN1/PPP2PP1/R1BQKB1R b KQkq - 0 8',
  after_Bh7:    'r2qkbnr/pp1npppb/2p4p/7P/3P4/5NN1/PPP2PP1/R1BQKB1R w KQkq - 1 9',
  after_Bd3:    'r2qkbnr/pp1npppb/2p4p/7P/3P4/3B1NN1/PPP2PP1/R1BQK2R b KQkq - 2 9',
  after_Bxd3:   'r2qkbnr/pp1nppp1/2p4p/7P/3P4/3b1NN1/PPP2PP1/R1BQK2R w KQkq - 0 10',
  after_Qxd3:   'r2qkbnr/pp1nppp1/2p4p/7P/3P4/3Q1NN1/PPP2PP1/R1B1K2R b KQkq - 0 10',
  after_e6:     'r2qkbnr/pp1n1pp1/2p1p2p/7P/3P4/3Q1NN1/PPP2PP1/R1B1K2R w KQkq - 0 11',
  after_Bd2:    'r2qkbnr/pp1n1pp1/2p1p2p/7P/3P4/3Q1NN1/PPPB1PP1/R3K2R b KQkq - 1 11',
  after_Ngf6:   'r2qkb1r/pp1n1pp1/2p1pn1p/7P/3P4/3Q1NN1/PPPB1PP1/R3K2R w KQkq - 2 12',
  after_OOO:    'r2qkb1r/pp1n1pp1/2p1pn1p/7P/3P4/3Q1NN1/PPPB1PP1/2KR3R b kq - 3 12',
  after_Be7:    'r2qk2r/pp1nbpp1/2p1pn1p/7P/3P4/3Q1NN1/PPPB1PP1/2KR3R w kq - 4 13',

  // Deviation: 5.Nc5 b6 6.Nb3 e6 7.Nf3 Bd6
  dev_Nc5_after_Nc5:  'rn1qkbnr/pp2pppp/2p5/2N2b2/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  dev_Nc5_after_b6:   'rn1qkbnr/p3pppp/1pp5/2N2b2/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  dev_Nc5_after_Nb3:  'rn1qkbnr/p3pppp/1pp5/5b2/3P4/1N6/PPP2PPP/R1BQKBNR b KQkq - 1 6',
  dev_Nc5_after_e6:   'rn1qkbnr/p4ppp/1pp1p3/5b2/3P4/1N6/PPP2PPP/R1BQKBNR w KQkq - 0 7',
  dev_Nc5_after_Nf3:  'rn1qkbnr/p4ppp/1pp1p3/5b2/3P4/1N3N2/PPP2PPP/R1BQKB1R b KQkq - 1 7',
  dev_Nc5_after_Bd6:  'rn1qk1nr/p4ppp/1ppbp3/5b2/3P4/1N3N2/PPP2PPP/R1BQKB1R w KQkq - 2 8',

  // Deviation: 6.Nf3 Nd7 7.h4 h6 8.h5 Bh7 (after 5.Ng3 Bg6)
  dev_Nf3_after_Nf3:  'rn1qkbnr/pp2pppp/2p3b1/8/3P4/5NN1/PPP2PPP/R1BQKB1R b KQkq - 4 6',
  dev_Nf3_after_Nd7:  'r2qkbnr/pp1npppp/2p3b1/8/3P4/5NN1/PPP2PPP/R1BQKB1R w KQkq - 5 7',
  dev_Nf3_after_h4:   'r2qkbnr/pp1npppp/2p3b1/8/3P3P/5NN1/PPP2PP1/R1BQKB1R b KQkq - 0 7',
  dev_Nf3_after_h6:   'r2qkbnr/pp1nppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R w KQkq - 0 8',
  dev_Nf3_after_h5:   'r2qkbnr/pp1nppp1/2p3bp/7P/3P4/5NN1/PPP2PP1/R1BQKB1R b KQkq - 0 8',
  dev_Nf3_after_Bh7:  'r2qkbnr/pp1npppb/2p4p/7P/3P4/5NN1/PPP2PP1/R1BQKB1R w KQkq - 1 9',

  // Deviation: 7.h5 Bh7 8.Nf3 Nd7 9.Bd3 Bxd3 (after 6.h4 h6)
  dev_h5_after_h5:    'rn1qkbnr/pp2ppp1/2p3bp/7P/3P4/6N1/PPP2PP1/R1BQKBNR b KQkq - 0 7',
  dev_h5_after_Bh7:   'rn1qkbnr/pp2pppb/2p4p/7P/3P4/6N1/PPP2PP1/R1BQKBNR w KQkq - 1 8',
  dev_h5_after_Nf3:   'rn1qkbnr/pp2pppb/2p4p/7P/3P4/5NN1/PPP2PP1/R1BQKB1R b KQkq - 2 8',
  dev_h5_after_Nd7:   'r2qkbnr/pp1npppb/2p4p/7P/3P4/5NN1/PPP2PP1/R1BQKB1R w KQkq - 3 9',
  dev_h5_after_Bd3:   'r2qkbnr/pp1npppb/2p4p/7P/3P4/3B1NN1/PPP2PP1/R1BQK2R b KQkq - 4 9',
  dev_h5_after_Bxd3:  'r2qkbnr/pp1nppp1/2p4p/7P/3P4/3b1NN1/PPP2PP1/R1BQK2R w KQkq - 0 10',
}


// ═══════════════════════════════════════════════════════════
// ck-1: THE CARO-KANN WALL (1.e4 c6 2.d4 d5 3.Nc3 dxe4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const CK_1: OpeningLesson = {
  id: 'ck-1',
  title: 'The Caro-Kann Wall',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Caro-Kann Defense — solid, reliable, and one of the best responses to 1.e4. You'll build a wall in the center and develop your bishop before it gets locked in.",
    },

    // ── PREDICT/REVEAL 1: c6 ──
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
      correctMove: 'c6',
      prompt: "White played e4. Start the Caro-Kann.",
      hint: 'Push the c-pawn one square to prepare d5.',
      correctFeedback: 'c6 prepares d5 — you want to challenge the center next move.',
      wrongFeedback: "Play c6 — it sets up d5 on the next move.",
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 looks quiet, but it has a clear purpose: next move you'll push d5 and challenge White's e4 pawn directly.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 2: d5 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4, claiming more center space.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Now strike the center. What do you play?",
      hint: 'Push the d-pawn two squares — attack e4.',
      correctFeedback: 'd5 hits e4 directly. White has to deal with the tension.',
      wrongFeedback: "Play d5 — challenge White's e4 pawn.",
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 attacks e4 head-on. White can't ignore it — the center is contested.",
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 3: dxe4 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White defends e4 with Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'dxe4',
      prompt: "White defended with Nc3. Take the pawn.",
      hint: 'Capture on e4 with the d-pawn.',
      correctFeedback: 'dxe4 wins the pawn and forces White to recapture with the knight.',
      wrongFeedback: 'Take on e4 — capture the pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "You captured on e4. White will take back with the knight, and then you'll get your bishop out before playing e6. That's the key idea.",
      arrow: ['d5', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play all three moves from memory.",
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "The foundation is set. Next you'll learn the most important idea in the Caro-Kann — getting the bishop out early.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-2: BISHOP FIRST (4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6)
// ═══════════════════════════════════════════════════════════

const CK_2: OpeningLesson = {
  id: 'ck-2',
  title: 'Bishop First',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "The whole point of the Caro-Kann: get your bishop out to f5 before playing e6. Once e6 goes in, the bishop is stuck behind your own pawns.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick review — show me the setup moves.",
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },

    // ── PREDICT/REVEAL 1: Bf5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White recaptures with Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: "White took back on e4. Develop a piece — which one needs to get out now?",
      hint: 'The light-squared bishop needs to escape before e6 locks it in.',
      correctFeedback: 'Bf5 develops the bishop and attacks the knight on e4.',
      wrongFeedback: "Play Bf5 — get the bishop out while you still can.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Bf5 is the signature move of the Caro-Kann. The bishop is active on f5, hitting the e4 knight. If you played e6 first, this bishop would be trapped behind your own pawns forever.",
      arrow: ['c8', 'f5'],
    },

    // ── PREDICT/REVEAL 2: Bg6 ──
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White retreats the knight to g3, attacking your bishop.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: "The knight attacks your bishop. Where does it go?",
      hint: 'Step the bishop back one square — stay on the diagonal.',
      correctFeedback: 'Bg6 keeps the bishop active and safe from the knight.',
      wrongFeedback: "Play Bg6 — retreat the bishop to a safe square.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "Bg6 is the standard retreat. The bishop is still active on the h7-b1 diagonal, and the knight on g3 isn't threatening anything yet.",
      arrow: ['f5', 'g6'],
    },

    // ── PREDICT/REVEAL 3: h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "White pushes h4, threatening h5 to trap your bishop.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: "White's h-pawn is coming. How do you deal with it?",
      hint: 'Stop h5 by controlling that square with your own pawn.',
      correctFeedback: 'h6 stops h5, keeping your bishop safe on g6.',
      wrongFeedback: "Play h6 — prevent White from pushing h5.",
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 is a must. It prevents h5, which would chase your bishop into a bad spot. Now your bishop stays safe on g6 for the time being.",
      arrow: ['h7', 'h6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Prove you've got this. Play all three new moves.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White plays Ng3.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Bishop out, bishop safe. That's the Caro-Kann blueprint. Next you'll learn the middlegame plan.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-dev-Nc5: IF 5.Nc5 (b6, e6, Bd6)
// White tries Nc5 instead of Ng3.
// ═══════════════════════════════════════════════════════════

const CK_DEV_NC5: OpeningLesson = {
  id: 'ck-dev-Nc5',
  title: 'If 5.Nc5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Sometimes White plays Nc5 instead of retreating the knight. It looks aggressive — the knight is heading for b7. Here's how you deal with it.",
    },

    // ── RECAP to branch point ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's get to the branch point first.",
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nc5,
      text: "White plays Nc5 instead of Ng3 — the knight jumps forward, eyeing b7.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'c5'],
    },

    // ── PREDICT/REVEAL 1: b6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nc5,
      correctMove: 'b6',
      prompt: "The knight is on c5, threatening your b7 pawn. Chase it away.",
      hint: 'Push b6 to kick the knight back.',
      correctFeedback: 'b6 forces the knight to retreat — it has no good square to stay.',
      wrongFeedback: "Play b6 — kick the knight off c5.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_b6,
      text: "b6 attacks the knight. It has to go back — Nb3 is the only reasonable retreat.",
      arrow: ['b7', 'b6'],
    },

    // ── PREDICT/REVEAL 2: e6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nb3,
      text: "White retreats the knight to b3.",
      autoAdvance: 800,
      highlightSquares: ['c5', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nb3,
      correctMove: 'e6',
      prompt: "The knight retreated. Time to solidify your center.",
      hint: 'Play e6 to lock down the d5 square.',
      correctFeedback: 'e6 secures the center and prepares to develop the dark-squared bishop.',
      wrongFeedback: "Play e6 — strengthen your center.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_e6,
      text: "e6 makes the pawn structure rock-solid. Your bishop is already out on f5, so e6 doesn't trap anything. Now you can develop the dark-squared bishop.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: Bd6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nf3,
      text: "White develops with Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nf3,
      correctMove: 'Bd6',
      prompt: "White developed a knight. Bring out your bishop.",
      hint: 'Put the bishop on d6 — it controls key central squares.',
      correctFeedback: 'Bd6 is a great square for the bishop — it eyes the kingside and controls e5.',
      wrongFeedback: "Play Bd6 — develop the bishop actively.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Bd6,
      text: "Bd6 develops with purpose. The bishop aims toward h2 and controls the e5 square. You're fully developed and ready to castle.",
      arrow: ['f8', 'd6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Now play all three responses from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nc5,
      text: "White plays Nc5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nc5,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nb3,
      text: "White plays Nb3.",
      autoAdvance: 800,
      highlightSquares: ['c5', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nb3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nf3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Bd6,
      text: "Nc5 looks scary but b6 shuts it down. Kick, solidify, develop — you're better already.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-dev-Nf3: IF 6.Nf3 (Nd7, h6, Bh7)
// White plays Nf3 before h4 — different move order, same ideas.
// ═══════════════════════════════════════════════════════════

const CK_DEV_NF3: OpeningLesson = {
  id: 'ck-dev-Nf3',
  title: 'If 6.Nf3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "Sometimes White plays Nf3 before h4. The move order is different but your plan stays the same — develop the knight and deal with the h-pawn push.",
    },

    // ── RECAP to branch point ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me the first five moves.",
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White plays Ng3.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf3,
      text: "White plays Nf3 instead of h4 — developing the knight first.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },

    // ── PREDICT/REVEAL 1: Nd7 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Nf3,
      correctMove: 'Nd7',
      prompt: "White developed Nf3. Start bringing out your pieces.",
      hint: 'Develop the knight to d7 — it keeps options open.',
      correctFeedback: 'Nd7 develops a piece and keeps the f6 square free for the other knight.',
      wrongFeedback: "Play Nd7 — develop toward the center.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nd7,
      text: "Nd7 is the standard development. The knight heads for f6 later, and d7 doesn't block your other pieces.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: h6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h4,
      text: "Now White pushes h4, threatening h5.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_h4,
      correctMove: 'h6',
      prompt: "The h-pawn is coming. Stop it.",
      hint: 'Play h6 to prevent h5.',
      correctFeedback: 'h6 stops h5, same as the main line. Your bishop stays safe.',
      wrongFeedback: "Play h6 — prevent h5 from trapping your bishop.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h6,
      text: "h6 does the same job here as in the main line — it prevents h5 from chasing your bishop.",
      arrow: ['h7', 'h6'],
    },

    // ── PREDICT/REVEAL 3: Bh7 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h5,
      text: "White pushes h5 anyway, attacking your bishop.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_h5,
      correctMove: 'Bh7',
      prompt: "h5 attacks the bishop. Where does it go?",
      hint: 'Tuck the bishop to h7 — it stays on the diagonal.',
      correctFeedback: 'Bh7 keeps the bishop safe. It still controls the b1-h7 diagonal.',
      wrongFeedback: "Play Bh7 — retreat to safety.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Bh7,
      text: "Bh7 is where the bishop lives for the rest of the game. It's safe and still useful — especially when White's bishop comes to d3 later and you can trade.",
      arrow: ['g6', 'h7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bg6,
      text: "Play all three moves again.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Nf3,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Bh7,
      text: "Same plan, slightly different order. Whether White plays Nf3 or h4 first, you know what to do.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-3: THE BISHOP TRADE (7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3)
// ═══════════════════════════════════════════════════════════

const CK_3: OpeningLesson = {
  id: 'ck-3',
  title: 'The Bishop Trade',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Now the middlegame begins. You'll develop the knight, deal with h5, and trade off bishops on d3.",
    },

    // ── RECAP ──
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White plays Ng3.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── PREDICT/REVEAL 1: Nd7 ──
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
      correctMove: 'Nd7',
      prompt: "White brought out the knight. Time to develop yours.",
      hint: 'Develop the knight to d7 — flexible and solid.',
      correctFeedback: 'Nd7 develops toward the center. The knight can go to f6 or e5 later.',
      wrongFeedback: "Play Nd7 — develop toward the center.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 is the standard square. It doesn't block anything, and the knight can reroute to f6 once the bishop situation is resolved.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: Bh7 ──
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "White pushes h5, attacking the bishop on g6.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h5,
      correctMove: 'Bh7',
      prompt: "The pawn attacks your bishop. Retreat it.",
      hint: 'Tuck the bishop to h7 — it stays on the diagonal.',
      correctFeedback: 'Bh7 is safe. The bishop will trade off soon when White plays Bd3.',
      wrongFeedback: "Play Bh7 — the bishop retreats to safety.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bh7,
      text: "Bh7 looks passive, but it's actually perfect. White will play Bd3 next, and you'll trade bishops — simplifying the position in your favor.",
      arrow: ['g6', 'h7'],
    },

    // ── PREDICT/REVEAL 3: Bxd3 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3, offering the bishop trade.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Bxd3',
      prompt: "White put a bishop on d3, right in your line of fire. Take it.",
      hint: 'Capture the bishop on d3.',
      correctFeedback: "Bxd3 trades off the bishops. White has to recapture with the queen, which isn't ideal for them.",
      wrongFeedback: "Take on d3 — trade the bishops.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxd3,
      text: "Bxd3 is the natural trade. White must recapture with the queen, putting it on d3 where it's a bit awkward. You've simplified and your position is solid.",
      arrow: ['h7', 'd3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Show me all three new moves.",
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
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Bxd3',
      prompt: 'Your move.',
      hint: 'Bxd3.',
      correctFeedback: 'Bxd3.',
      wrongFeedback: 'Bxd3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd3,
      text: "The bishop's journey is complete — out to f5, back to g6, tucked to h7, traded on d3. Clean and efficient.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-dev-h5: IF 7.h5 (Bh7, Nd7, Bxd3)
// White pushes h5 before Nf3 — slightly different order.
// ═══════════════════════════════════════════════════════════

const CK_DEV_H5: OpeningLesson = {
  id: 'ck-dev-h5',
  title: 'If 7.h5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "What if White pushes h5 immediately instead of playing Nf3? Your bishop gets chased, but you still follow the same plan.",
    },

    // ── RECAP to branch point ──
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White plays Ng3.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_h5,
      text: "White pushes h5 instead of Nf3 — going after your bishop right away.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },

    // ── PREDICT/REVEAL 1: Bh7 ──
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_h5,
      correctMove: 'Bh7',
      prompt: "h5 attacks the bishop. Where does it retreat?",
      hint: 'Tuck the bishop to h7.',
      correctFeedback: 'Bh7 keeps the bishop safe on the diagonal.',
      wrongFeedback: "Play Bh7 — retreat the bishop.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Bh7,
      text: "Same retreat as always. The bishop on h7 will trade off when White plays Bd3 — you know this pattern.",
      arrow: ['g6', 'h7'],
    },

    // ── PREDICT/REVEAL 2: Nd7 ──
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Nf3,
      text: "Now White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_Nf3,
      correctMove: 'Nd7',
      prompt: "White developed the knight. Your turn to develop.",
      hint: 'Bring the knight to d7.',
      correctFeedback: 'Nd7 develops with the same plan — knight to d7, then f6 later.',
      wrongFeedback: "Play Nd7 — develop the knight.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Nd7,
      text: "Nd7 follows the standard plan. The move order was different, but you end up in the same kind of position.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 3: Bxd3 ──
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Bd3,
      text: "White plays Bd3, offering the trade.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_Bd3,
      correctMove: 'Bxd3',
      prompt: "The bishop landed on d3. What do you do?",
      hint: 'Take the bishop on d3.',
      correctFeedback: 'Bxd3 trades off the light-squared bishops, just like the main line.',
      wrongFeedback: "Capture on d3 — trade the bishops.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Bxd3,
      text: "Same result — bishops traded, White recaptures with the queen. Whether h5 came before or after Nf3, the position is essentially the same.",
      arrow: ['h7', 'd3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Play all three responses.",
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_Nf3,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_Bd3,
      correctMove: 'Bxd3',
      prompt: 'Your move.',
      hint: 'Bxd3.',
      correctFeedback: 'Bxd3.',
      wrongFeedback: 'Bxd3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Bxd3,
      text: "Whether h5 comes early or late, you handle it the same way. The Caro-Kann is wonderfully predictable.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-4: COMPLETING DEVELOPMENT (10.Qxd3 e6 11.Bd2 Ngf6 12.O-O-O Be7)
// ═══════════════════════════════════════════════════════════

const CK_4: OpeningLesson = {
  id: 'ck-4',
  title: 'Completing Development',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd3,
      text: "The bishops are off the board. Now it's time to lock down the center, develop your remaining pieces, and get ready to castle.",
    },

    // ── RECAP ──
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White plays Ng3.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
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
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Bxd3',
      prompt: 'Your move.',
      hint: 'Bxd3.',
      correctFeedback: 'Bxd3.',
      wrongFeedback: 'Bxd3.',
    },

    // ── PREDICT/REVEAL 1: e6 ──
    {
      type: 'instruction',
      fen: FEN.after_Qxd3,
      text: "White recaptures with Qxd3.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxd3,
      correctMove: 'e6',
      prompt: "The queen is on d3. Secure your center.",
      hint: 'Play e6 to lock down the light squares.',
      correctFeedback: 'e6 solidifies the center and prepares to develop the bishop and castle.',
      wrongFeedback: "Play e6 — secure the center.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Now you can play e6 safely — the light-squared bishop is already traded off, so e6 doesn't trap anything. The center is rock-solid.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: Ngf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White develops the bishop to d2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'Ngf6',
      prompt: "White developed. Bring out your last minor piece.",
      hint: 'The knight on g8 needs to come out — f6 is the natural square.',
      correctFeedback: "Ngf6 develops the last knight. Both knights are active and you're almost ready to castle.",
      wrongFeedback: "Play Ngf6 — develop the knight to its best square.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Ngf6,
      text: "Ngf6 completes the knight development. Both knights are on solid central squares, and the bishop just needs to come out before you can castle.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 3: Be7 ──
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "White castles queenside with O-O-O.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Be7',
      prompt: "White castled queenside. Develop your last piece.",
      hint: 'Put the bishop on e7 — it clears the way for castling.',
      correctFeedback: 'Be7 develops the bishop and prepares to castle kingside.',
      wrongFeedback: "Play Be7 — develop and prepare to castle.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Be7 is solid and practical. You can castle kingside next move. White went queenside, you go kingside — opposite sides, which means both sides will attack.",
      arrow: ['f8', 'e7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd3,
      text: "Play the final three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxd3,
      text: "White plays Qxd3.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
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
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "White plays O-O-O.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "You know the full Caro-Kann Classical setup: 12 moves of theory, solid as a rock. Castle next move and you're ready for the middlegame.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ck-test-1: LEVEL 1 TEST
// Main line recall + all deviation responses.
// ═══════════════════════════════════════════════════════════

const CK_TEST_1: OpeningLesson = {
  id: 'ck-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE RECALL (12 Black moves) ──
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
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
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
      correctMove: 'dxe4',
      prompt: 'Your move.',
      hint: 'dxe4.',
      correctFeedback: 'dxe4.',
      wrongFeedback: 'dxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "White plays Nxe4.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe4,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng3,
      text: "White plays Ng3.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'g3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng3,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
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
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Bxd3',
      prompt: 'Your move.',
      hint: 'Bxd3.',
      correctFeedback: 'Bxd3.',
      wrongFeedback: 'Bxd3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxd3,
      text: "White plays Qxd3.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qxd3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
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
      correctMove: 'Ngf6',
      prompt: 'Your move.',
      hint: 'Ngf6.',
      correctFeedback: 'Ngf6.',
      wrongFeedback: 'Ngf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "White plays O-O-O.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },

    // ── DEVIATION TEST: 5.Nc5 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nc5,
      text: "White plays Nc5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nc5,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nb3,
      text: "White plays Nb3.",
      autoAdvance: 800,
      highlightSquares: ['c5', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nb3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc5_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc5_after_Nf3,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },

    // ── DEVIATION TEST: 6.Nf3 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Nf3,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h4,
      text: "White plays h4.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_h4,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },

    // ── DEVIATION TEST: 7.h5 ──
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_h5,
      text: "White plays h5.",
      autoAdvance: 800,
      highlightSquares: ['h4', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_h5,
      correctMove: 'Bh7',
      prompt: 'Your move.',
      hint: 'Bh7.',
      correctFeedback: 'Bh7.',
      wrongFeedback: 'Bh7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_Nf3,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h5_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_h5_after_Bd3,
      correctMove: 'Bxd3',
      prompt: 'Your move.',
      hint: 'Bxd3.',
      correctFeedback: 'Bxd3.',
      wrongFeedback: 'Bxd3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP
// ═══════════════════════════════════════════════════════════

export function getCaroKannLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'ck-1': return CK_1
    case 'ck-2': return CK_2
    case 'ck-dev-Nc5': return CK_DEV_NC5
    case 'ck-dev-Nf3': return CK_DEV_NF3
    case 'ck-3': return CK_3
    case 'ck-dev-h5': return CK_DEV_H5
    case 'ck-4': return CK_4
    case 'ck-test-1': return CK_TEST_1
    default: return undefined
  }
}
