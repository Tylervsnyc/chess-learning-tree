import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — ALIEN GAMBIT LESSONS (wa-1 through wa-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// 6.Nxf7 is unsound but scores 60% White over 150k+ Lichess games.
// Voice should lean INTO the meme — "the sacrifice that drags the king out,"
// "don't-boo-spam-the-brilliant-emote moment," etc.
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Ng5 h6
//            6.Nxf7!! Kxf7 7.Nf3 Nbd7 8.Bd3 e6 9.O-O Bd6
//            10.Re1 Re8 11.Ne5+ Bxe5 12.dxe5 Nd5 13.Qh5+
//            Kg8 14.Bxh6!! gxh6 15.Qg6+ Kh8 16.Qh7#
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
  after_Nf6:    'rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng5:    'rnbqkb1r/pp2pppp/2p2n2/6N1/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_h6:     'rnbqkb1r/pp2ppp1/2p2n1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  after_Nxf7:   'rnbqkb1r/pp2pNp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 0 6',
  after_Kxf7:   'rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7',
  after_Nf3:    'rnbq1b1r/pp2pkp1/2p2n1p/8/3P4/5N2/PPP2PPP/R1BQKB1R b KQ - 1 7',
  after_Nbd7:   'r1bq1b1r/pp1npkp1/2p2n1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  after_Bd3:    'r1bq1b1r/pp1npkp1/2p2n1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 3 8',
  after_e6:     'r1bq1b1r/pp1n1kp1/2p1pn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 0 9',
  after_OO:     'r1bq1b1r/pp1n1kp1/2p1pn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b - - 1 9',
  after_Bd6:    'r1bq3r/pp1n1kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w - - 2 10',
  after_Re1:    'r1bq3r/pp1n1kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 b - - 3 10',
  after_Re8:    'r1bqr3/pp1n1kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 w - - 4 11',
  after_Ne5:    'r1bqr3/pp1n1kp1/2pbpn1p/4N3/3P4/3B4/PPP2PPP/R1BQR1K1 b - - 5 11',
  after_Bxe5:   'r1bqr3/pp1n1kp1/2p1pn1p/4b3/3P4/3B4/PPP2PPP/R1BQR1K1 w - - 0 12',
  after_dxe5:   'r1bqr3/pp1n1kp1/2p1pn1p/4P3/8/3B4/PPP2PPP/R1BQR1K1 b - - 0 12',
  after_Nd5:    'r1bqr3/pp1n1kp1/2p1p2p/3nP3/8/3B4/PPP2PPP/R1BQR1K1 w - - 1 13',
  after_Qh5:    'r1bqr3/pp1n1kp1/2p1p2p/3nP2Q/8/3B4/PPP2PPP/R1B1R1K1 b - - 2 13',
  after_Kg8:    'r1bqr1k1/pp1n2p1/2p1p2p/3nP2Q/8/3B4/PPP2PPP/R1B1R1K1 w - - 3 14',
  after_Bxh6:   'r1bqr1k1/pp1n2p1/2p1p2B/3nP2Q/8/3B4/PPP2PPP/R3R1K1 b - - 0 14',
  after_gxh6:   'r1bqr1k1/pp1n4/2p1p2p/3nP2Q/8/3B4/PPP2PPP/R3R1K1 w - - 0 15',
  after_Qg6:    'r1bqr1k1/pp1n4/2p1p1Qp/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 1 15',
  after_Kh8:    'r1bqr2k/pp1n4/2p1p1Qp/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 2 16',
  after_Qh7:    'r1bqr2k/pp1n3Q/2p1p2p/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 3 16',

  // === DEVIATION Bg4 — 7…Bg4 8.Ne5+ Ke8 9.Nxg4 ===
  bg4_after_Bg4:  'rn1q1b1r/pp2pkp1/2p2n1p/8/3P2b1/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  bg4_after_Ne5:  'rn1q1b1r/pp2pkp1/2p2n1p/4N3/3P2b1/8/PPP2PPP/R1BQKB1R b KQ - 3 8',
  bg4_after_Ke8:  'rn1qkb1r/pp2p1p1/2p2n1p/4N3/3P2b1/8/PPP2PPP/R1BQKB1R w KQ - 4 9',
  bg4_after_Nxg4: 'rn1qkb1r/pp2p1p1/2p2n1p/8/3P2N1/8/PPP2PPP/R1BQKB1R b KQ - 0 9',

  // === DEVIATION Bf5 — 7…Bf5 8.Ne5+ Kg8 9.Bc4+ e6 10.g4 Be4 11.Bxe6+ Kh7 12.g5 Bxh1?? 13.g6# ===
  bf5_after_Bf5:    'rn1q1b1r/pp2pkp1/2p2n1p/5b2/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  bf5_after_Ne5:    'rn1q1b1r/pp2pkp1/2p2n1p/4Nb2/3P4/8/PPP2PPP/R1BQKB1R b KQ - 3 8',
  bf5_after_Kg8:    'rn1q1bkr/pp2p1p1/2p2n1p/4Nb2/3P4/8/PPP2PPP/R1BQKB1R w KQ - 4 9',
  bf5_after_Bc4:    'rn1q1bkr/pp2p1p1/2p2n1p/4Nb2/2BP4/8/PPP2PPP/R1BQK2R b KQ - 5 9',
  bf5_after_e6:     'rn1q1bkr/pp4p1/2p1pn1p/4Nb2/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10',
  bf5_after_g4:     'rn1q1bkr/pp4p1/2p1pn1p/4Nb2/2BP2P1/8/PPP2P1P/R1BQK2R b KQ - 0 10',
  bf5_after_Be4:    'rn1q1bkr/pp4p1/2p1pn1p/4N3/2BPb1P1/8/PPP2P1P/R1BQK2R w KQ - 1 11',
  bf5_after_Bxe6:   'rn1q1bkr/pp4p1/2p1Bn1p/4N3/3Pb1P1/8/PPP2P1P/R1BQK2R b KQ - 0 11',
  bf5_after_Kh7:    'rn1q1b1r/pp4pk/2p1Bn1p/4N3/3Pb1P1/8/PPP2P1P/R1BQK2R w KQ - 1 12',
  bf5_after_g5:     'rn1q1b1r/pp4pk/2p1Bn1p/4N1P1/3Pb3/8/PPP2P1P/R1BQK2R b KQ - 0 12',
  bf5_after_Bxh1:   'rn1q1b1r/pp4pk/2p1Bn1p/4N1P1/3P4/8/PPP2P1P/R1BQK2b w Q - 0 13',
  bf5_after_g6:     'rn1q1b1r/pp4pk/2p1BnPp/4N3/3P4/8/PPP2P1P/R1BQK2b b Q - 0 13',

  // === DEVIATION c5 — 7…c5 8.c3 Nc6 9.Bd3 ===
  c5_after_c5:    'rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8',
  c5_after_c3:    'rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/2P2N2/PP3PPP/R1BQKB1R b KQ - 0 8',
  c5_after_Nc6:   'r1bq1b1r/pp2pkp1/2n2n1p/2p5/3P4/2P2N2/PP3PPP/R1BQKB1R w KQ - 1 9',
  c5_after_Bd3:   'r1bq1b1r/pp2pkp1/2n2n1p/2p5/3P4/2PB1N2/PP3PPP/R1BQK2R b KQ - 2 9',

  // === ALT MATING NET — 15…Kf8 16.Qxh6+ Ke7 17.Qg7# ===
  alt_after_Kf8:    'r1bqrk2/pp1n4/2p1p1Qp/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 2 16',
  alt_after_Qxh6:   'r1bqrk2/pp1n4/2p1p2Q/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 0 16',
  alt_after_Ke7:    'r1bqr3/pp1nk3/2p1p2Q/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 1 17',
  alt_after_Qg7:    'r1bqr3/pp1nk1Q1/2p1p3/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 2 17',
}


// ═══════════════════════════════════════════════════════════
// wa-1: THE SETUP (1.e4 c6 2.d4 d5 3.Nc3 dxe4)
// First lesson — no recap.
// Teaches: e4, d4, Nc3
// ═══════════════════════════════════════════════════════════

const WA_1: OpeningLesson = {
  id: 'wa-1',
  title: 'The Setup',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Alien Gambit — Witty_Alien's trick weapon vs the Caro-Kann. You're going to sacrifice a knight on f7 and drag Black's king into the open.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "First, you need to bait Black into the position. That starts with one move you already know.",
    },

    // ── TEACH 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Open the game and stake the center.",
      hint: 'Push the king pawn two squares.',
      correctFeedback: 'e4 — the only way in. The Alien Gambit only works against the Caro-Kann.',
      wrongFeedback: 'Play e4 — you need 1.e4 for the Caro-Kann to even happen.',
      postMoveArrow: [['e4', 'd5'], ['e4', 'f5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Black almost always responds to 1.e4 with e5 or c5. But Caro-Kann players play c6 — that's the door to the Alien Gambit.",
      arrow: ['e2', 'e4'],
    },

    // ── TEACH 2: d4 ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Black plays c6 — the Caro-Kann. They're prepping d5 to challenge your e4 pawn.",
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'd4',
      prompt: "Build a two-pawn center before Black contests it.",
      hint: 'Push d2 to d4 — claim the whole center.',
      correctFeedback: 'd4! Two-pawn center. Black has to react.',
      wrongFeedback: 'Play d4 — grab the center while you can.',
      postMoveArrow: [['e4', 'd5'], ['d4', 'e5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Two pawns abreast on d4 and e4 — the Caro-Kann main line. Black is going to hit e4 with d5.",
      arrow: ['d2', 'd4'],
    },

    // ── TEACH 3: Nc3 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "And there it is. Black plays d5, attacking your e4 pawn.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: "Defend e4 by developing a piece. Where does the knight go?",
      hint: 'Bring the b1 knight to c3 — it defends e4.',
      correctFeedback: "Nc3! Develops AND defends e4. Now Black has a choice: capture, push, or trade.",
      wrongFeedback: 'Play Nc3 — develop and defend e4 in one move.',
      postMoveArrow: ['c3', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Nc3 looks innocent. It's not. You're luring Black into capturing on e4 — that's where the sacrifice starts.",
      arrow: ['b1', 'c3'],
    },

    // ── BLACK CAPTURES ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Black takes — dxe4. They think they've won a pawn. They have not.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "The trap is set. Next lesson: we recapture and start hunting the king.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play the whole setup from memory.",
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

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "e4, d4, Nc3 — the Caro-Kann main line. Black bit. Now the fun starts.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-2: BAIT THE KNIGHT (4.Nxe4 Nf6 5.Ng5 h6)
// Teaches: Nxe4, Ng5
// ═══════════════════════════════════════════════════════════

const WA_2: OpeningLesson = {
  id: 'wa-2',
  title: 'Bait the Knight',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Black thinks they've won a pawn. You're about to send a knight on a one-way trip to f7.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay of the setup.",
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

    // ── TEACH 1: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: "Win the pawn back. How?",
      hint: 'Capture on e4 with the knight.',
      correctFeedback: "Nxe4 — knight in the center, pointed at g5 and f6. Looking suspicious yet?",
      wrongFeedback: 'Take with the knight: Nxe4.',
      postMoveArrow: [['e4', 'g5'], ['e4', 'f6']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Nxe4 sets up the jump. Your knight is one hop from g5 — and g5 attacks f7.",
      arrow: ['e4', 'g5'],
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Black develops Nf6, attacking your knight. They want to trade and simplify.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 2: Ng5 ──
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Ng5',
      prompt: "Don't trade — jump in. Where does the knight go to attack f7?",
      hint: 'Hop the knight to g5. It attacks f7.',
      correctFeedback: "Ng5! Your knight ignores the attack and threatens f7. f7 is only defended by the king.",
      wrongFeedback: 'Play Ng5 — go for f7, not the trade.',
      postMoveArrow: ['g5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ng5,
      text: "Ng5 looks weird — you just moved the same knight twice and ignored Nf6's attack. That's the bait. Black almost always plays h6 to kick the knight away.",
      arrow: ['g5', 'f7'],
    },

    // ── BLACK h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "And there it is. h6 — 'shoo, knight, you can't stay.' Black is about to find out the knight isn't leaving.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Black has played h6 in this exact position over 300,000 times. White wins 56% of those games. Why? You'll see next lesson.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Show me the bait — Nxe4 and Ng5.",
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
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
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

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Nxe4, Ng5 — the bait is set. Black thinks they're kicking your knight. They are wrong.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-3: THE SACRIFICE (6.Nxf7!! Kxf7 7.Nf3)
// Teaches: Nxf7, Nf3
// THE signature move of the gambit.
// ═══════════════════════════════════════════════════════════

const WA_3: OpeningLesson = {
  id: 'wa-3',
  title: 'The Sacrifice',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "This is it. The move that makes the Alien Gambit. Take a breath.",
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
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
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

    // ── TEACH 1: Nxf7!! THE SACRIFICE ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Black just played h6. The knight is attacked. Most players retreat. You're not most players.",
      highlightSquares: ['g5', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: "Don't retreat. SACRIFICE. Take f7.",
      hint: 'Capture on f7 with the knight. Yes, the king takes it back. That is the point.',
      correctFeedback: "Nxf7!! The Alien Gambit. You gave up a knight to drag the king into the open. 60% White winrate over 150,000 Lichess games.",
      wrongFeedback: 'Play Nxf7 — the whole gambit IS this move. Trust it.',
      postMoveArrow: ['f7', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf7,
      text: "Black has to take — Kxf7. If they refuse, you're up a pawn for free with the king already exposed.",
      arrow: ['e8', 'f7'],
    },

    // ── BLACK Kxf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Kxf7. The king is on f7 — no pawn cover, no castling rights, no friends.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },

    // ── TEACH 2: Nf3 ──
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: "Develop your other knight. Where does it belong?",
      hint: 'Bring the g1 knight to f3 — heading for e5.',
      correctFeedback: "Nf3 — develops and prepares Ne5+, hitting the exposed king again.",
      wrongFeedback: 'Play Nf3 — get the other knight into the attack.',
      postMoveArrow: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Nf3 is patient. You're down a piece but you have two pawns, the bishop pair, and a king on f7 with no defenders. Pieces will join the attack one by one.",
      arrow: ['g1', 'f3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The sacrifice — your turn.",
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: 'Kxf7.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Nxf7, Nf3. You sacrificed a knight and developed another one. The king is on f7. Time to crank up the heat.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-4: LOAD THE DIAGONAL (7…Nbd7 8.Bd3 e6 9.O-O)
// Teaches: Bd3, O-O
// Black plays Nbd7 (most common). Bd3 aims at h7. Castle.
// ═══════════════════════════════════════════════════════════

const WA_4: OpeningLesson = {
  id: 'wa-4',
  title: 'Load the Diagonal',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black's most common move here is Nbd7 — defending e5 so you can't check there. No problem. You'll attack on a different diagonal.",
    },

    // ── BLACK Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Black plays Nbd7. The knight defends e5 — that blocks the Ne5+ check idea.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.after_Nbd7,
      correctMove: 'Bd3',
      prompt: "Develop the bishop on a diagonal that aims at the king. Where?",
      hint: 'Bishop to d3 — it points right at h7.',
      correctFeedback: "Bd3! The bishop aims at h7. Black's king is on f7, but h7 is going to matter later.",
      wrongFeedback: 'Play Bd3 — the bishop wants the b1-h7 diagonal.',
      postMoveArrow: ['d3', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "Bd3 loads the diagonal. From d3 the bishop sees all the way to h7. Combined with the queen, this becomes lethal.",
      arrow: ['d3', 'h7'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Black plays e6, opening a path for the king to scurry back home.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_e6,
      correctMove: 'O-O',
      prompt: "Get your king safe and your rook on f1 — into the f-file.",
      hint: 'Castle kingside.',
      correctFeedback: "O-O. Your king is safe, your rook lands on f1, and Black's king is still wandering in the middle.",
      wrongFeedback: "Castle kingside — get your king safe and the rook to f1.",
      postMoveArrow: ['f1', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Castled. Compare the two kings: yours is tucked in the corner. Black's is on f7 with the rook on h8 doing nothing.",
      arrow: ['e1', 'g1'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Show me the development plan.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: 'Nbd7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nbd7,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: 'e6.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Bd3, O-O. Bishop aimed at h7, king tucked away, rook on f1. The attack is about to come together.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-5: OPEN THE F-FILE (9…Bd6 10.Re1 Re8 11.Ne5+)
// Teaches: Re1, Ne5+
// Black develops Bd6 (blocking your bishop's view down to f8).
// Re1 builds pressure. Ne5+ is a critical check.
// ═══════════════════════════════════════════════════════════

const WA_5: OpeningLesson = {
  id: 'wa-5',
  title: 'Open the f-file',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Black is going to try to scramble pieces in front of the king. You're going to keep adding attackers.",
    },

    // ── BLACK Bd6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Black plays Bd6, blocking your bishop's view of h7 and preparing to plug the f-file with Re8.",
      autoAdvance: 800,
      highlightSquares: ['f8', 'd6'],
    },

    // ── TEACH 1: Re1 ──
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'Re1',
      prompt: "Move the rook to a file that pressures e6.",
      hint: 'Rook to e1.',
      correctFeedback: "Re1 piles up on the e-file. Black's e6 pawn is now a target.",
      wrongFeedback: 'Play Re1 — get the rook on the e-file.',
      postMoveArrow: ['e1', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Re1,
      text: "Re1 stacks pressure on e6. Combined with Bd3 hitting h7 and Nf3 ready to jump, you have three attackers ready.",
      arrow: ['e1', 'e6'],
    },

    // ── BLACK Re8 ──
    {
      type: 'instruction',
      fen: FEN.after_Re8,
      text: "Black plays Re8, defending e6 and trying to consolidate.",
      autoAdvance: 800,
      highlightSquares: ['h8', 'e8'],
    },

    // ── TEACH 2: Ne5+ ──
    {
      type: 'play-move',
      fen: FEN.after_Re8,
      correctMove: 'Ne5+',
      prompt: "Knight jump time. Where does it go with check?",
      hint: 'Ne5+ — jump in with check on the king.',
      correctFeedback: "Ne5+! Check. Black has to deal with this — and the knight on e5 also opens the queen's path to h5.",
      wrongFeedback: 'Play Ne5+ — the check forces Black to react.',
      postMoveArrow: ['e5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Ne5+ does two things at once: checks the king AND clears the d1-h5 diagonal for your queen. Black's options are all bad.",
      arrow: ['e5', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Pile it on.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: 'Bd6.',
      autoAdvance: 800,
      highlightSquares: ['f8', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'Re1',
      prompt: 'Your move.',
      hint: 'Re1.',
      correctFeedback: 'Re1.',
      wrongFeedback: 'Re1.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Re8,
      text: 'Re8.',
      autoAdvance: 800,
      highlightSquares: ['h8', 'e8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Re8,
      correctMove: 'Ne5+',
      prompt: 'Your move.',
      hint: 'Ne5+.',
      correctFeedback: 'Ne5+.',
      wrongFeedback: 'Ne5+.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Re1, Ne5+. Every piece is attacking. Black has to make a tough decision — and humans usually pick wrong.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-6: WIN THE TEMPO (11…Bxe5 12.dxe5 Nd5 13.Qh5+)
// Teaches: dxe5, Qh5+
// Black takes the knight (the natural human move), you recapture and bring the queen.
// ═══════════════════════════════════════════════════════════

const WA_6: OpeningLesson = {
  id: 'wa-6',
  title: 'Win the Tempo',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Black has to break the check. The engine says Kg8 is best — sacrifice the knight on f6 — but no human will find it. Almost everyone plays Bxe5.",
    },

    // ── BLACK Bxe5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: "Bxe5. Black trades the bishop to kill your knight. Eval jumps to +1.8 for you.",
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },

    // ── TEACH 1: dxe5 ──
    {
      type: 'play-move',
      fen: FEN.after_Bxe5,
      correctMove: 'dxe5',
      prompt: "Recapture with the pawn. Which one?",
      hint: 'Pawn d4 takes e5.',
      correctFeedback: "dxe5! The pawn lands on e5 — attacking Black's knight on f6 AND closing the diagonal for Black's defense.",
      wrongFeedback: 'Play dxe5 — recapture with the d-pawn.',
      postMoveArrow: ['e5', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe5,
      text: "dxe5 attacks the Nf6. Black has to move the knight — and wherever it goes, the h5 square is undefended.",
      arrow: ['e5', 'f6'],
    },

    // ── BLACK Nd5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "Black plays Nd5, jumping to a central square. The knight is safe — but h5 is now wide open for your queen.",
      autoAdvance: 800,
      highlightSquares: ['f6', 'd5'],
    },

    // ── TEACH 2: Qh5+ ──
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qh5+',
      prompt: "The queen joins the attack with check. Where?",
      hint: 'Queen to h5, check.',
      correctFeedback: "Qh5+! Check. The queen joins, and now Black's king has nowhere good to go.",
      wrongFeedback: 'Play Qh5+ — bring the queen with check.',
      postMoveArrow: ['h5', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: "Qh5+ forces the king to g8. And once the king is on g8, the next move is the brilliancy.",
      arrow: ['h5', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Run it back.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: 'Bxe5.',
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bxe5,
      correctMove: 'dxe5',
      prompt: 'Your move.',
      hint: 'dxe5.',
      correctFeedback: 'dxe5.',
      wrongFeedback: 'dxe5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: 'Nd5.',
      autoAdvance: 800,
      highlightSquares: ['f6', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
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
      text: "dxe5, Qh5+. Queen on h5, knight on e5, rook on e1, bishop on d3 — every piece is ready to swing. Next lesson: the punchline.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-7: THE Bxh6 BRILLIANCY (13…Kg8 14.Bxh6!! gxh6 15.Qg6+ → mate)
// Teaches: Bxh6, then a PUZZLE for the mating sequence
// 15.Qg6+ Kh8 16.Qh7#
// ═══════════════════════════════════════════════════════════

const WA_7: OpeningLesson = {
  id: 'wa-7',
  title: 'The Bxh6 Brilliancy',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qh5,
      text: "Black's king has one square — g8. Then comes a move that, if you find it in a real game, will get spammed with the brilliant move emote. Don't boo. Just enjoy it.",
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Kg8. The king runs to the corner, blocked by Black's own pieces.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 1: Bxh6!! ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Look at the h6 pawn. It's defending the g7 pawn, which is defending the king. What if you just… take it?",
      highlightSquares: ['h6', 'g7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kg8,
      correctMove: 'Bxh6',
      prompt: "Sacrifice the bishop on h6.",
      hint: 'Bishop takes h6 — yes, the g7 pawn recaptures. That is the point.',
      correctFeedback: "Bxh6!! The bishop sacrifice. If gxh6, the king has no pawn cover and your queen is one square away from mate.",
      wrongFeedback: 'Play Bxh6 — sacrifice the bishop to crack open g7.',
      postMoveArrow: ['h6', 'g7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxh6,
      text: "Bxh6!! Black's choice: take with the pawn (mate in 2) or refuse (lose a piece anyway). Played in over 900 Lichess games.",
      arrow: ['h6', 'g7'],
    },

    // ── BLACK gxh6 ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "gxh6. Black takes. The g-file is now open and the king has no pawn shield.",
      autoAdvance: 800,
      highlightSquares: ['g7', 'h6'],
    },

    // ── PUZZLE: 15.Qg6+ Kh8 16.Qh7# ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "Mating net time. Find it — checks and a finish. You drive the sequence.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_gxh6,
      solutionMoves: ['Qg6+', 'Kh8', 'Qh7#'],
      playerColor: 'white',
      prompt: "Mate in 2. Find the checks.",
      hint: "Queen swings to g6 with check. Black has only one square: h8. Then deliver the killing blow on h7.",
      correctFeedback: "Qg6+ Kh8 Qh7# — mate. The Bxh6 brilliancy converted.",
    },

    // ── ALT MATING PATH (15…Kf8) ──
    {
      type: 'instruction',
      fen: FEN.after_Qg6,
      text: "Other path: what if Black plays 15…Kf8 instead of Kh8? Same idea — the queen hunts the king.",
      highlightSquares: ['g8', 'f8'],
    },
    {
      type: 'instruction',
      fen: FEN.alt_after_Kf8,
      text: "Kf8. Now the king runs sideways instead of into the corner.",
      autoAdvance: 800,
    },
    {
      type: 'puzzle',
      fen: FEN.alt_after_Kf8,
      solutionMoves: ['Qxh6+', 'Ke7', 'Qg7#'],
      playerColor: 'white',
      prompt: "Mate in 2 — Black's king has nowhere safe.",
      hint: "Take the h6 pawn with check, the king goes to e7 (Kg8?? Qh7# is the same idea), then Qg7 is mate.",
      correctFeedback: "Qxh6+ Ke7 Qg7# — both mating nets in your pocket.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.alt_after_Qg7,
      text: "Bxh6!! followed by a forced mate. Whichever way the king runs, the queen catches it. That's the Alien Gambit at full power.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-Bg4: DEVIATION — 7…Bg4 instead of Nbd7
// 8.Ne5+ Ke8 9.Nxg4 — wins the bishop (+3.9 eval)
// ═══════════════════════════════════════════════════════════

const WA_DEV_BG4: OpeningLesson = {
  id: 'wa-dev-Bg4',
  title: 'If Bg4',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Sometimes Black plays Bg4 instead of Nbd7 — trying to pin your Nf3 to the queen. Bad idea.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay the moves to the sacrifice.",
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
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
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
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: 'Kxf7.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Bg4,
      text: "Black plays 7…Bg4 — trying to pin your Nf3 against the queen on d1. They think they've stopped your attack.",
      highlightSquares: ['c8', 'g4'],
    },

    // ── TEACH 1: Ne5+ ──
    {
      type: 'play-move',
      fen: FEN.bg4_after_Bg4,
      correctMove: 'Ne5+',
      prompt: "Ignore the pin. Where can the knight go with check?",
      hint: 'Knight to e5, check. Bg4 doesn\'t actually defend e5 — and the bishop is hanging once you check.',
      correctFeedback: "Ne5+! The pin is fake. You check the king AND attack the bishop on g4 at the same time.",
      wrongFeedback: 'Play Ne5+ — the knight goes anyway. It checks and attacks Bg4.',
      postMoveArrow: ['e5', 'g4'],
    },
    {
      type: 'instruction',
      fen: FEN.bg4_after_Ne5,
      text: "Ne5+ does two jobs: checks the king and attacks Bg4. Black has to move the king — and the bishop falls.",
      arrow: ['e5', 'g4'],
    },

    // ── BLACK Ke8 ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Ke8,
      text: "Black's only sensible response is Ke8 — getting out of check. The bishop on g4 is now defenseless.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e8'],
    },

    // ── TEACH 2: Nxg4 ──
    {
      type: 'play-move',
      fen: FEN.bg4_after_Ke8,
      correctMove: 'Nxg4',
      prompt: "Take the free bishop.",
      hint: 'Knight takes g4.',
      correctFeedback: "Nxg4! You win the bishop. Eval is around +3.9 — you've gone from down a piece to up a piece.",
      wrongFeedback: 'Play Nxg4 — take the bishop, it\'s free.',
    },
    {
      type: 'instruction',
      fen: FEN.bg4_after_Nxg4,
      text: "Material check: you gave up a knight, won back a bishop and a couple of pawns. The pin attempt cost Black a piece.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Bg4,
      text: "Black played Bg4. Punish it.",
    },
    {
      type: 'play-move',
      fen: FEN.bg4_after_Bg4,
      correctMove: 'Ne5+',
      prompt: 'Your move.',
      hint: 'Ne5+.',
      correctFeedback: 'Ne5+.',
      wrongFeedback: 'Ne5+.',
    },
    {
      type: 'instruction',
      fen: FEN.bg4_after_Ke8,
      text: 'Ke8.',
      autoAdvance: 800,
      highlightSquares: ['f7', 'e8'],
    },
    {
      type: 'play-move',
      fen: FEN.bg4_after_Ke8,
      correctMove: 'Nxg4',
      prompt: 'Your move.',
      hint: 'Nxg4.',
      correctFeedback: 'Nxg4.',
      wrongFeedback: 'Nxg4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Nxg4,
      text: "Ne5+, Nxg4. Pin? What pin. You ignored it and grabbed a bishop.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-Bf5: DEVIATION — 7…Bf5
// 8.Ne5+ Kg8 9.Bc4+ e6 10.g4! Be4 11.Bxe6+ Kh7 12.g5 Bxh1?? 13.g6#
// Pawn mate.
// ═══════════════════════════════════════════════════════════

const WA_DEV_BF5: OpeningLesson = {
  id: 'wa-dev-Bf5',
  title: 'If Bf5',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays Bf5 — just developing the bishop. Your job: chase it across the board with a pawn storm that ends in a pawn mate.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay to the deviation point.",
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
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
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
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: 'Kxf7.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },

    // ── DEVIATION ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Bf5,
      text: "Black plays 7…Bf5 — developing the bishop. Time to start the chase.",
      highlightSquares: ['c8', 'f5'],
    },

    // ── TEACH 1: Ne5+ ──
    {
      type: 'play-move',
      fen: FEN.bf5_after_Bf5,
      correctMove: 'Ne5+',
      prompt: "Same plan as Bg4 — jump in with check.",
      hint: 'Ne5+.',
      correctFeedback: "Ne5+! The knight check forces the king to move.",
      wrongFeedback: 'Play Ne5+ — check the king.',
    },
    {
      type: 'instruction',
      fen: FEN.bf5_after_Ne5,
      text: "Ne5+ — the king has to move. Kg8 is the most common (9,500+ games).",
      arrow: ['e5', 'f7'],
    },

    // ── BLACK Kg8 + TEACH 2: Bc4+ ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Kg8,
      text: "Kg8. The king runs to the corner.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_Kg8,
      correctMove: 'Bc4+',
      prompt: "Add another check. Where does the bishop go?",
      hint: 'Bishop to c4, check.',
      correctFeedback: "Bc4+! The bishop joins with a second check on the a2-g8 diagonal.",
      wrongFeedback: 'Play Bc4+ — bishop check forces another defense.',
      postMoveArrow: ['c4', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.bf5_after_Bc4,
      text: "Bc4+ — Black has to block with e6 (the most common move, 4,500+ games).",
      arrow: ['c4', 'g8'],
    },

    // ── BLACK e6 + TEACH 3: g4! ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_e6,
      text: "Black blocks with e6, also defending Bf5.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_e6,
      correctMove: 'g4',
      prompt: "Now the chase. Push the g-pawn to kick the bishop.",
      hint: 'Push g2 to g4 — attack the bishop on f5.',
      correctFeedback: "g4! Played in 7,500+ games, 75% White winrate. The pawn drives the bishop AWAY from defending e6.",
      wrongFeedback: 'Play g4 — kick the bishop off the defense of e6.',
      postMoveArrow: ['g4', 'f5'],
    },
    {
      type: 'instruction',
      fen: FEN.bf5_after_g4,
      text: "g4 attacks Bf5. Black usually plays Be4 (looks active, isn't).",
      arrow: ['g4', 'f5'],
    },

    // ── BLACK Be4 + TEACH 4: Bxe6+ ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Be4,
      text: "Be4 — Black moves the bishop and abandons the defense of e6.",
      autoAdvance: 800,
      highlightSquares: ['f5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_Be4,
      correctMove: 'Bxe6+',
      prompt: "Take the e6 pawn with check.",
      hint: 'Bishop takes e6, check.',
      correctFeedback: "Bxe6+! A free pawn AND a check. Black's king is in deep trouble.",
      wrongFeedback: 'Play Bxe6+ — capture with check.',
      postMoveArrow: ['e6', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.bf5_after_Bxe6,
      text: "Bxe6+ — Black has to move the king. Kh7 is the most common run.",
    },

    // ── BLACK Kh7 + TEACH 5: g5 ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Kh7,
      text: "Kh7 — the king hides in the corner.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'h7'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_Kh7,
      correctMove: 'g5',
      prompt: "Keep pushing. Where does the pawn go?",
      hint: 'g4 to g5 — keep advancing toward h6.',
      correctFeedback: "g5! 78% White winrate in 450+ games. The pawn is heading to g6 — pawn mate incoming.",
      wrongFeedback: 'Play g5 — keep pushing toward the king.',
      postMoveArrow: ['g5', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.bf5_after_g5,
      text: "g5 sets up g6#. Black often greedily grabs the rook with Bxh1 — that's mate next move.",
    },

    // ── BLACK Bxh1?? + TEACH 6: g6# ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Bxh1,
      text: "Bxh1?? Black grabs the rook. Big mistake.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'h1'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_Bxh1,
      correctMove: 'g6#',
      prompt: "Pawn checkmate. Where does it land?",
      hint: 'Push g5 to g6. Check the king — and look at the escape squares.',
      correctFeedback: "g6#! A pawn checkmate. h6 is covered by the pawn, h8 is covered by Be6, g7 is covered by g6 itself. Black is mated by a pawn.",
      wrongFeedback: 'Play g6# — pawn checkmate.',
    },
    {
      type: 'instruction',
      fen: FEN.bf5_after_g6,
      text: "g6 — checkmate by a pawn. From a single bishop developing move (Bf5) to a pawn mate in 6 moves.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_g6,
      text: "Ne5+, Bc4+, g4, Bxe6+, g5, g6#. A six-move chase that ends in the most embarrassing mate in chess: a pawn.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-c5: DEVIATION — 7…c5 (the actual refutation)
// 8.c3 Nc6 9.Bd3 — give back the piece, equal but practical chances
// ═══════════════════════════════════════════════════════════

const WA_DEV_C5: OpeningLesson = {
  id: 'wa-dev-c5',
  title: 'If c5',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Time for the hard truth. If Black plays 7…c5, that's the actual refutation. Engine evaluation drops to roughly equal. You need to play smart, not flashy.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay to the deviation point.",
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
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
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
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: 'Kxf7.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },

    // ── DEVIATION ──
    {
      type: 'instruction',
      fen: FEN.c5_after_c5,
      text: "Black plays 7…c5 — striking at your d4 pawn. This is the engine's recommendation. It gives back the gambit and makes you justify the sacrifice.",
      highlightSquares: ['c7', 'c5'],
    },

    // ── TEACH 1: c3 ──
    {
      type: 'play-move',
      fen: FEN.c5_after_c5,
      correctMove: 'c3',
      prompt: "Defend d4. How?",
      hint: 'Pawn to c3 — solidify d4.',
      correctFeedback: "c3 defends d4. You're not chasing mate anymore — you're playing a real position where you're slightly worse but Black has to find good moves to convert.",
      wrongFeedback: 'Play c3 — solidify your center.',
    },
    {
      type: 'instruction',
      fen: FEN.c5_after_c3,
      text: "c3 holds d4. The position is roughly equal — eval around 0.0. The Alien Gambit isn't winning here, but you still have practical chances if Black slips.",
      arrow: ['c2', 'c3'],
    },

    // ── BLACK Nc6 + TEACH 2: Bd3 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Nc6,
      text: "Black develops Nc6 — putting more pressure on d4.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.c5_after_Nc6,
      correctMove: 'Bd3',
      prompt: "Keep developing. Where does the bishop go?",
      hint: 'Bishop to d3 — same diagonal idea, aiming at h7.',
      correctFeedback: "Bd3 — develop and keep pressure on the kingside. The position is equal, but Black's king is still on f7. One mistake and you're back in business.",
      wrongFeedback: 'Play Bd3 — keep developing toward the kingside.',
      postMoveArrow: ['d3', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.c5_after_Bd3,
      text: "Bd3 keeps the attack threatening. Eval ~0.0 — but you're playing for tricks, not winning the game. Be honest: you'd rather Black play h6 next, not c5.",
      arrow: ['d3', 'h7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.c5_after_c5,
      text: "Black played c5. Play it cool.",
    },
    {
      type: 'play-move',
      fen: FEN.c5_after_c5,
      correctMove: 'c3',
      prompt: 'Your move.',
      hint: 'c3.',
      correctFeedback: 'c3.',
      wrongFeedback: 'c3.',
    },
    {
      type: 'instruction',
      fen: FEN.c5_after_Nc6,
      text: 'Nc6.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.c5_after_Nc6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Bd3,
      text: "c3, Bd3. When Black plays the best move (c5), you don't get the brilliancy. You get an equal middlegame with the king on f7 — still playable, still tricky.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-test-1: LEVEL 1 TEST
// Tests main line + all 3 deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const WA_TEST_1: OpeningLesson = {
  id: 'wa-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the full Alien Gambit — main line and every deviation from memory.",
    },

    // ── MAIN LINE ──
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nbd7, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['f8', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'Re8.', autoAdvance: 800, highlightSquares: ['h8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Re8, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.after_Bxe5, text: 'Bxe5.', autoAdvance: 800, highlightSquares: ['d6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Bxe5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Qh5+', prompt: 'Your move.', hint: 'Qh5+.', correctFeedback: 'Qh5+.', wrongFeedback: 'Qh5+.' },
    { type: 'instruction', fen: FEN.after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.after_Kg8, correctMove: 'Bxh6', prompt: 'Your move.', hint: 'Bxh6.', correctFeedback: 'Bxh6.', wrongFeedback: 'Bxh6.' },
    { type: 'instruction', fen: FEN.after_gxh6, text: 'gxh6.', autoAdvance: 800, highlightSquares: ['g7', 'h6'] },
    {
      type: 'puzzle',
      fen: FEN.after_gxh6,
      solutionMoves: ['Qg6+', 'Kh8', 'Qh7#'],
      playerColor: 'white',
      prompt: "Mate in 2.",
      hint: 'Qg6+ Kh8 Qh7#.',
      correctFeedback: 'Mating net complete.',
    },

    // ── DEV 1: Bg4 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 1: Black plays Bg4.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.bg4_after_Bg4, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.bg4_after_Bg4, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.bg4_after_Ke8, text: 'Ke8.', autoAdvance: 800, highlightSquares: ['f7', 'e8'] },
    { type: 'play-move', fen: FEN.bg4_after_Ke8, correctMove: 'Nxg4', prompt: 'Your move.', hint: 'Nxg4.', correctFeedback: 'Nxg4.', wrongFeedback: 'Nxg4.' },

    // ── DEV 2: Bf5 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 2: Black plays Bf5.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.bf5_after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.bf5_after_Bf5, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.bf5_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.bf5_after_Kg8, correctMove: 'Bc4+', prompt: 'Your move.', hint: 'Bc4+.', correctFeedback: 'Bc4+.', wrongFeedback: 'Bc4+.' },
    { type: 'instruction', fen: FEN.bf5_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.bf5_after_e6, correctMove: 'g4', prompt: 'Your move.', hint: 'g4.', correctFeedback: 'g4.', wrongFeedback: 'g4.' },
    { type: 'instruction', fen: FEN.bf5_after_Be4, text: 'Be4.', autoAdvance: 800, highlightSquares: ['f5', 'e4'] },
    { type: 'play-move', fen: FEN.bf5_after_Be4, correctMove: 'Bxe6+', prompt: 'Your move.', hint: 'Bxe6+.', correctFeedback: 'Bxe6+.', wrongFeedback: 'Bxe6+.' },
    { type: 'instruction', fen: FEN.bf5_after_Kh7, text: 'Kh7.', autoAdvance: 800, highlightSquares: ['g8', 'h7'] },
    { type: 'play-move', fen: FEN.bf5_after_Kh7, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5.', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.bf5_after_Bxh1, text: 'Bxh1??', autoAdvance: 800, highlightSquares: ['e4', 'h1'] },
    { type: 'play-move', fen: FEN.bf5_after_Bxh1, correctMove: 'g6#', prompt: 'Your move.', hint: 'g6#.', correctFeedback: 'g6# — pawn mate.', wrongFeedback: 'g6#.' },

    // ── DEV 3: c5 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 3: Black plays c5 — the refutation.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.c5_after_c5, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.c5_after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.c5_after_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.c5_after_Nc6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Bd3,
      text: "Test complete. You know the Alien Gambit — main line, three deviations, and the brilliancy. Time to spam this in blitz.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const WITTY_ALIEN_LESSONS: Record<string, OpeningLesson> = {
  'wa-1': WA_1,
  'wa-2': WA_2,
  'wa-3': WA_3,
  'wa-4': WA_4,
  'wa-5': WA_5,
  'wa-6': WA_6,
  'wa-7': WA_7,
  'wa-dev-Bg4': WA_DEV_BG4,
  'wa-dev-Bf5': WA_DEV_BF5,
  'wa-dev-c5': WA_DEV_C5,
  'wa-test-1': WA_TEST_1,
}

export function getWittyAlienLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_LESSONS[id]
}
