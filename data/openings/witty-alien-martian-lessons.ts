import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — MARTIAN GAMBIT LESSONS (wam-1 through wam-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// 6.Ne6 is unsound — but when Black plays the naive fxe6??, it's mate in 2.
// Voice leans INTO the meme — "the Martian sacrifice," "the 4-move mate,"
// "Witty's cousin to the Alien Gambit."
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 h6
//            6.Ne6! fxe6?? 7.Qh5+ g6 8.Qxg6#
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:    'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:   'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_dxe4:  'rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Nxe4:  'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Nd7:   'r1bqkbnr/pp1npppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng5:   'r1bqkbnr/pp1npppp/2p5/6N1/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_h6:    'r1bqkbnr/pp1nppp1/2p4p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  after_Ne6:   'r1bqkbnr/pp1nppp1/2p1N2p/8/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 1 6',
  after_fxe6:  'r1bqkbnr/pp1np1p1/2p1p2p/8/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 7',
  after_Qh5:   'r1bqkbnr/pp1np1p1/2p1p2p/7Q/3P4/8/PPP2PPP/R1B1KBNR b KQkq - 1 7',
  after_g6:    'r1bqkbnr/pp1np3/2p1p1pp/7Q/3P4/8/PPP2PPP/R1B1KBNR w KQkq - 0 8',
  after_Qxg6:  'r1bqkbnr/pp1np3/2p1p1Qp/8/3P4/8/PPP2PPP/R1B1KBNR b KQkq - 0 8',

  // === DEVIATION Qa5+ — 6…Qa5+ 7.Bd2 fxe6 ===
  qa5_after_Qa5:  'r1b1kbnr/pp1nppp1/2p1N2p/q7/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 2 7',
  qa5_after_Bd2:  'r1b1kbnr/pp1nppp1/2p1N2p/q7/3P4/8/PPPB1PPP/R2QKBNR b KQkq - 3 7',
  qa5_after_fxe6: 'r1b1kbnr/pp1np1p1/2p1p2p/q7/3P4/8/PPPB1PPP/R2QKBNR w KQkq - 0 8',

  // === DEVIATION Qb6 — 6…Qb6 7.Nxf8 Nxf8 ===
  qb6_after_Qb6:   'r1b1kbnr/pp1nppp1/1qp1N2p/8/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 2 7',
  qb6_after_Nxf8:  'r1b1kNnr/pp1nppp1/1qp4p/8/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 0 7',
  qb6_after_Nxf8b: 'r1b1knnr/pp2ppp1/1qp4p/8/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 8',

  // === DEVIATION Ngf6 — 5…Ngf6 6.Bd3 (no sac) ===
  ngf6_after_Ngf6: 'r1bqkb1r/pp1npppp/2p2n2/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  ngf6_after_Bd3:  'r1bqkb1r/pp1npppp/2p2n2/6N1/3P4/3B4/PPP2PPP/R1BQK1NR b KQkq - 4 6',
}


// ═══════════════════════════════════════════════════════════
// wam-1: THE DETOUR (1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5)
// First lesson — no recap.
// Teaches: e4, d4, Nc3, Nxe4, Ng5 (5 white moves)
// ═══════════════════════════════════════════════════════════

const WAM_1: OpeningLesson = {
  id: 'wam-1',
  title: 'The Detour',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Martian Gambit — the Alien Gambit's weirder cousin. Same Caro-Kann setup, different sacrifice: the knight lands on e6 instead of f7.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "This whole gambit only happens if Black plays Nd7 (instead of Nf6) on move 4. So step one: get to that position.",
    },

    // ── TEACH 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Open the game.",
      hint: 'Push the king pawn two squares.',
      correctFeedback: "e4. Same start as the Alien Gambit — you need 1.e4 for the Caro-Kann to even happen.",
      wrongFeedback: 'Play e4 — same start as the main Alien Gambit.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Black plays c6 — the Caro-Kann. They're prepping d5 to challenge your e4 pawn.",
      arrow: ['e2', 'e4'],
    },

    // ── TEACH 2: d4 ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 — the Caro-Kann. Black wants to hit e4 with d5 next.",
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: "Build a two-pawn center.",
      hint: 'Push d2 to d4.',
      correctFeedback: "d4. Two pawns abreast. Black has to react.",
      wrongFeedback: 'Play d4 — grab the whole center.',
    },

    // ── TEACH 3: Nc3 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "And there it is — d5 attacks e4.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: "Defend e4 by developing a knight.",
      hint: 'Knight to c3 — defends e4 and develops.',
      correctFeedback: "Nc3 — same setup as the Alien Gambit. Now Black decides how to handle the tension on e4.",
      wrongFeedback: 'Play Nc3 — develop and defend e4 at once.',
      postMoveArrow: ['c3', 'e4'],
    },

    // ── BLACK dxe4, TEACH 4: Nxe4 ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Black takes — dxe4.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: "Recapture with the knight.",
      hint: 'Knight takes e4.',
      correctFeedback: "Nxe4. Knight in the center, eyes on g5 and f6 — same as the Alien Gambit.",
      wrongFeedback: 'Play Nxe4 — take with the knight.',
    },

    // ── BLACK Nd7 — THE DIVERGENCE ──
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Here's where it diverges. In the Alien Gambit, Black plays Nf6 here. In the Martian, Black plays Nd7 — developing the queenside knight first.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 looks safer than Nf6 — it doesn't attack your knight. But it leaves a square wide open: e6.",
      highlightSquares: ['e6'],
    },

    // ── TEACH 5: Ng5 ──
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: "Same plan as the Alien Gambit — jump to g5 and threaten f7.",
      hint: 'Knight to g5 — attacks f7.',
      correctFeedback: "Ng5! The knight threatens f7. Black almost always plays h6 to kick it — and that's exactly what you want.",
      wrongFeedback: 'Play Ng5 — same setup as the Alien Gambit, head for f7.',
      postMoveArrow: ['g5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Knight on g5, eyes on f7. With Black's knight on d7 (not f6), f7 is only defended by the king. Bait set.",
      arrow: ['g5', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Run it back from the start.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7 — the Martian trigger.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Setup complete. Black played Nd7, you played Ng5. Now you're one h6 away from the sacrifice.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-2: THE Ne6 SACRIFICE (5…h6 6.Ne6!)
// Teaches: Ne6 (the signature move)
// ═══════════════════════════════════════════════════════════

const WAM_2: OpeningLesson = {
  id: 'wam-2',
  title: 'The Ne6 Sacrifice',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Black plays h6 to shoo the knight. The Alien Gambit goes to f7 here. The Martian goes somewhere else.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },

    // ── BLACK h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 — Black says 'shoo, knight.' Same setup as the Alien Gambit. Different escape route.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Look at e6. The knight's knight on d7 doesn't defend it, and the c8 bishop doesn't defend it either. f7 is the only defender.",
      highlightSquares: ['e6'],
    },

    // ── TEACH 1: Ne6!! ──
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: "Sacrifice the knight on e6 — not f7. Where?",
      hint: 'Knight to e6 — attacks the queen on d8.',
      correctFeedback: "Ne6! The Martian sacrifice. Your knight attacks Black's queen AND offers itself to fxe6. If Black takes, it's mate in 2.",
      wrongFeedback: "Play Ne6 — the Martian Gambit goes to e6, not f7. Trust it.",
      postMoveArrow: [['e6', 'd8'], ['f7', 'e6']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Ne6 does two things: attacks the queen on d8, and dares Black to take with fxe6. Most Black players take — and that's the trap.",
      highlightSquares: ['e6', 'd8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The Martian sacrifice — your turn.",
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: 'Your move.',
      hint: 'Ne6.',
      correctFeedback: 'Ne6.',
      wrongFeedback: 'Ne6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Ne6 — sitting there like bait. Black has three real options: take with the pawn (mate in 2), check with Qa5+, or move the queen. We'll handle all three.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-3: THE TRAP SPRINGS (6…fxe6?? 7.Qh5+)
// Teaches: Qh5+
// Black takes the knight — now we go for mate.
// ═══════════════════════════════════════════════════════════

const WAM_3: OpeningLesson = {
  id: 'wam-3',
  title: 'The Trap Springs',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Most Black players see a free knight and grab it. They don't see the queen check coming next.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the sacrifice.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: 'Your move.',
      hint: 'Ne6.',
      correctFeedback: 'Ne6.',
      wrongFeedback: 'Ne6.',
    },

    // ── BLACK fxe6?? ──
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: "fxe6 — Black grabs the knight. Looks like a free piece. It is not.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: "Look at what just happened: the f7 pawn moved off. Now the e8 king has nothing on the f-file in front of it. And the e8–h5 diagonal? Wide open.",
      highlightSquares: ['e8', 'h5'],
    },

    // ── TEACH 1: Qh5+ ──
    {
      type: 'play-move',
      fen: FEN.after_fxe6,
      correctMove: 'Qh5+',
      prompt: "Bring the queen with check. Where?",
      hint: 'Queen to h5 — check on the e8–h5 diagonal.',
      correctFeedback: "Qh5+! The queen swings out with check. Black can't block with anything — the only legal move is g6.",
      wrongFeedback: 'Play Qh5+ — bring the queen down the open diagonal with check.',
      postMoveArrow: ['h5', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: "Qh5+ — only one legal response for Black. The g7 pawn blocks the check by going to g6. Then it's curtains.",
      arrow: ['h5', 'e8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Black takes the knight. Spring the trap.",
    },
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: 'fxe6.',
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_fxe6,
      correctMove: 'Qh5+',
      prompt: 'Your move.',
      hint: 'Qh5+.',
      correctFeedback: 'Qh5+.',
      wrongFeedback: 'Qh5+.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: "Qh5+ — Black has exactly one legal move. Next lesson: the finish.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-4: 4-MOVE MATE (7…g6 8.Qxg6#)
// Teaches: Qxg6# — uses PUZZLE step for the mating sequence
// ═══════════════════════════════════════════════════════════

const WAM_4: OpeningLesson = {
  id: 'wam-4',
  title: '4-Move Mate',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: "Black has exactly one legal move to escape check: g6. Then the queen takes — and it's mate. From move 1 to mate in 8 plies.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay first.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: 'Your move.',
      hint: 'Ne6.',
      correctFeedback: 'Ne6.',
      wrongFeedback: 'Ne6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: 'fxe6.',
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },

    // ── PUZZLE: Qh5+ g6 Qxg6# ──
    {
      type: 'instruction',
      fen: FEN.after_fxe6,
      text: "Mate in 2. You drive the whole sequence — queen check, then the killing blow.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_fxe6,
      solutionMoves: ['Qh5+', 'g6', 'Qxg6#'],
      playerColor: 'white',
      prompt: "Mate in 2. Find the queen check, then the finish.",
      hint: "Qh5+ forces g6 (the only legal block). Then queen takes the g6 pawn — supported by the h5 queen with no defenders.",
      correctFeedback: "Qh5+ g6 Qxg6# — the 4-move mate. From the opening moves to a finished game in 8 plies.",
    },

    // ── EXPLANATION ──
    {
      type: 'instruction',
      fen: FEN.after_Qxg6,
      text: "Look at the mate: the queen on g6 attacks the king on e8 along the rank? No — through the king's escape squares. The king can't take (queen defended by no one — wait, that's the magic).",
      highlightSquares: ['g6', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxg6,
      text: "Actually look closer: Qxg6 is mate because the queen attacks e8 along the e8–h5 diagonal — through f7 (empty), g6 (queen). Kxg6 is illegal — the king on e8 can't reach g6.",
      highlightSquares: ['e8', 'f7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxg6,
      text: "The king escape squares — d8, e7, f8 — all blocked or attacked. Qg6 + the open e-file = no way out.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qxg6,
      text: "That's the Martian Gambit at full power: Ne6 lures the pawn, Qh5+ forces g6, Qxg6# ends the game. Eight half-moves total.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-Ngf6: DEVIATION — 5…Ngf6 (no h6 yet)
// 6.Bd3 — develop, no sac, keep tension
// ═══════════════════════════════════════════════════════════

const WAM_DEV_NGF6: OpeningLesson = {
  id: 'wam-dev-Ngf6',
  title: 'If Ngf6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Sometimes Black plays Ngf6 instead of h6 — developing the knight to defend f7 with the bishop's help. No h6, no Ne6 sac.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },

    // ── DEVIATION: Black plays Ngf6 instead of h6 ──
    {
      type: 'instruction',
      fen: FEN.ngf6_after_Ngf6,
      text: "Ngf6 — Black develops the kingside knight without pushing h6. The Ne6 sac doesn't work here, because Black's queen on d8 is now protected by the Nf6 (sort of) and f7 has more defenders.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.ngf6_after_Ngf6,
      text: "Don't force the sacrifice. Just develop — that's the rule when your trap doesn't fire.",
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.ngf6_after_Ngf6,
      correctMove: 'Bd3',
      prompt: "Develop the bishop on a good diagonal.",
      hint: 'Bishop to d3 — aims at h7.',
      correctFeedback: "Bd3 — develop the bishop on the b1–h7 diagonal. Position is roughly equal, but you have a normal Caro-Kann position with attacking chances.",
      wrongFeedback: 'Play Bd3 — keep developing, the trap is off.',
      postMoveArrow: ['d3', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.ngf6_after_Bd3,
      text: "Bd3 — eval is around equal. You've abandoned the trick weapon and you're playing a normal Caro-Kann. That's fine. Black still has to find moves to handle Ng5.",
      arrow: ['d3', 'h7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.ngf6_after_Ngf6,
      text: "Black played Ngf6. Just develop.",
    },
    {
      type: 'play-move',
      fen: FEN.ngf6_after_Ngf6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.ngf6_after_Bd3,
      text: "Bd3 — no sacrifice, no mating net. When Black doesn't play h6, you don't get the Martian. You get a normal Caro-Kann.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-Qa5: DEVIATION — 6…Qa5+ (the real refutation)
// 7.Bd2 fxe6 — be honest, White is materially worse here
// ═══════════════════════════════════════════════════════════

const WAM_DEV_QA5: OpeningLesson = {
  id: 'wam-dev-Qa5',
  title: 'If Qa5+',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Time for the hard truth: Qa5+ is Black's best response to Ne6. It checks your king AND moves the queen out of the knight's attack. You don't get the mating net — but you still need to know what to do.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the sacrifice.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: 'Your move.',
      hint: 'Ne6.',
      correctFeedback: 'Ne6.',
      wrongFeedback: 'Ne6.',
    },

    // ── DEVIATION ──
    {
      type: 'instruction',
      fen: FEN.qa5_after_Qa5,
      text: "Qa5+ — Black checks your king AND saves the queen in one move. This is the refutation of the Martian.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'a5'],
    },
    {
      type: 'instruction',
      fen: FEN.qa5_after_Qa5,
      text: "You have to block the check. Best option: a developing block — Bd2.",
    },

    // ── TEACH 1: Bd2 ──
    {
      type: 'play-move',
      fen: FEN.qa5_after_Qa5,
      correctMove: 'Bd2',
      prompt: "Block the check with a piece that also develops.",
      hint: 'Bishop to d2 — blocks the check and develops.',
      correctFeedback: "Bd2 — blocks the check, develops the bishop. Black's next move will almost always be fxe6 (capturing the knight).",
      wrongFeedback: 'Play Bd2 — block with the bishop, both jobs at once.',
    },
    {
      type: 'instruction',
      fen: FEN.qa5_after_Bd2,
      text: "Bd2 holds the check. Now Black takes the knight on e6.",
    },

    // ── BLACK fxe6 — the honest assessment ──
    {
      type: 'instruction',
      fen: FEN.qa5_after_fxe6,
      text: "fxe6. The knight is gone. You're down a piece and the attack is over.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.qa5_after_fxe6,
      text: "Honest evaluation: this position is roughly -2 for White. The Martian Gambit doesn't work against Qa5+. The good news? Most opponents under 2000 won't find this defense.",
    },
    {
      type: 'instruction',
      fen: FEN.qa5_after_fxe6,
      text: "If you reach this position, play it like a regular down-a-piece game: develop, look for tactical chances, and hope Black slips. The Martian is a trick weapon — not every trick works.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Black plays the best defense. Handle it.",
    },
    {
      type: 'instruction',
      fen: FEN.qa5_after_Qa5,
      text: 'Qa5+.',
      autoAdvance: 800,
      highlightSquares: ['d8', 'a5'],
    },
    {
      type: 'play-move',
      fen: FEN.qa5_after_Qa5,
      correctMove: 'Bd2',
      prompt: 'Your move.',
      hint: 'Bd2.',
      correctFeedback: 'Bd2.',
      wrongFeedback: 'Bd2.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.qa5_after_fxe6,
      text: "Bd2 — the only response when Black finds Qa5+. The gambit doesn't always land. Knowing when to fold is part of playing a trick weapon.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-dev-Qb6: DEVIATION — 6…Qb6
// 7.Nxf8 Nxf8 — knight for bishop, equal material
// ═══════════════════════════════════════════════════════════

const WAM_DEV_QB6: OpeningLesson = {
  id: 'wam-dev-Qb6',
  title: 'If Qb6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Sometimes Black plays Qb6 — moving the queen but not giving check. You can't sit there with a hanging knight, so grab something on the way out.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the sacrifice.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd7,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Ne6',
      prompt: 'Your move.',
      hint: 'Ne6.',
      correctFeedback: 'Ne6.',
      wrongFeedback: 'Ne6.',
    },

    // ── DEVIATION ──
    {
      type: 'instruction',
      fen: FEN.qb6_after_Qb6,
      text: "Qb6 — Black moves the queen out of attack without checking you. Your knight on e6 is still hanging.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'b6'],
    },
    {
      type: 'instruction',
      fen: FEN.qb6_after_Qb6,
      text: "Don't let Black just capture for free. The knight on e6 attacks the bishop on f8 — take it.",
      highlightSquares: ['e6', 'f8'],
    },

    // ── TEACH 1: Nxf8 ──
    {
      type: 'play-move',
      fen: FEN.qb6_after_Qb6,
      correctMove: 'Nxf8',
      prompt: "Save the knight by capturing. Where?",
      hint: 'Knight takes the bishop on f8.',
      correctFeedback: "Nxf8! The knight grabs the bishop on its way out. Black has to recapture, and you've traded knight for bishop — material is equal.",
      wrongFeedback: 'Play Nxf8 — take the bishop, save your material.',
      postMoveArrow: ['e6', 'f8'],
    },
    {
      type: 'instruction',
      fen: FEN.qb6_after_Nxf8,
      text: "Nxf8 — Black has to take back. Nxf8 with the d7 knight is most natural.",
    },

    // ── BLACK Nxf8 ──
    {
      type: 'instruction',
      fen: FEN.qb6_after_Nxf8b,
      text: "Nxf8 — Black recaptures with the knight. Material count: you traded knight for bishop. You're equal in material with a slightly disrupted Black king position.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'f8'],
    },
    {
      type: 'instruction',
      fen: FEN.qb6_after_Nxf8b,
      text: "Eval is roughly equal. The Martian didn't land the mate — but you didn't lose material either. Play on from a normal position.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne6,
      text: "Black plays Qb6. Grab the bishop.",
    },
    {
      type: 'instruction',
      fen: FEN.qb6_after_Qb6,
      text: 'Qb6.',
      autoAdvance: 800,
      highlightSquares: ['d8', 'b6'],
    },
    {
      type: 'play-move',
      fen: FEN.qb6_after_Qb6,
      correctMove: 'Nxf8',
      prompt: 'Your move.',
      hint: 'Nxf8.',
      correctFeedback: 'Nxf8.',
      wrongFeedback: 'Nxf8.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.qb6_after_Nxf8b,
      text: "Nxf8 — when Black avoids the trap with Qb6, you trade pieces and live to fight another day.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wam-test-1: LEVEL 1 TEST
// Tests main line + all 3 deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const WAM_TEST_1: OpeningLesson = {
  id: 'wam-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the full Martian Gambit — the 4-move mate and every deviation, from memory.",
    },

    // ── MAIN LINE ──
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nd7, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_fxe6, text: 'fxe6.', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    {
      type: 'puzzle',
      fen: FEN.after_fxe6,
      solutionMoves: ['Qh5+', 'g6', 'Qxg6#'],
      playerColor: 'white',
      prompt: "Mate in 2.",
      hint: 'Qh5+ g6 Qxg6#.',
      correctFeedback: "4-move mate complete.",
    },

    // ── DEV 1: Ngf6 ──
    { type: 'instruction', fen: FEN.after_Ng5, text: "Deviation 1: Black plays Ngf6 (no h6).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.ngf6_after_Ngf6, text: 'Ngf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.ngf6_after_Ngf6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    // ── DEV 2: Qa5+ ──
    { type: 'instruction', fen: FEN.after_Ne6, text: "Deviation 2: Black plays Qa5+ (the refutation).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.qa5_after_Qa5, text: 'Qa5+.', autoAdvance: 800, highlightSquares: ['d8', 'a5'] },
    { type: 'play-move', fen: FEN.qa5_after_Qa5, correctMove: 'Bd2', prompt: 'Your move.', hint: 'Bd2.', correctFeedback: 'Bd2.', wrongFeedback: 'Bd2.' },

    // ── DEV 3: Qb6 ──
    { type: 'instruction', fen: FEN.after_Ne6, text: "Deviation 3: Black plays Qb6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.qb6_after_Qb6, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.qb6_after_Qb6, correctMove: 'Nxf8', prompt: 'Your move.', hint: 'Nxf8.', correctFeedback: 'Nxf8.', wrongFeedback: 'Nxf8.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.qb6_after_Nxf8,
      text: "Test complete. The 4-move mate, the Ngf6 sidestep, the Qa5+ honest fold, and the Qb6 piece trade — all in your pocket.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const WITTY_ALIEN_MARTIAN_LESSONS: Record<string, OpeningLesson> = {
  'wam-1': WAM_1,
  'wam-2': WAM_2,
  'wam-3': WAM_3,
  'wam-4': WAM_4,
  'wam-dev-Ngf6': WAM_DEV_NGF6,
  'wam-dev-Qa5': WAM_DEV_QA5,
  'wam-dev-Qb6': WAM_DEV_QB6,
  'wam-test-1': WAM_TEST_1,
}

export function getWittyAlienMartianLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_MARTIAN_LESSONS[id]
}
