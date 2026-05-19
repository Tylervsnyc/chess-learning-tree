import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — ALIEN GAMBIT LESSONS (wa-1 through wa-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// Built from Witty_Alien's real chess.com games (Jun–Nov 2024, 423 Alien Gambit
// games). Voice leans INTO the meme — "the sacrifice that drags the king out,"
// "don't-boo-spam-the-brilliant-emote moment," etc. Frequency data is the
// honesty anchor: when Witty's win rate drops, say so.
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// ⚠️  CHUNKING RULE: EVERY lesson teaches EXACTLY 3 white moves.
// Puzzle steps count as a "move" of content.
//
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Ng5 h6
//            6.Nxf7!! Kxf7 7.Nf3 Nbd7 8.Bd3 e6 9.O-O Bd6
//            10.Re1 Re8 11.Ne5+ Bxe5 12.dxe5 Nd5 13.Qh5+
//            Kg8 14.Bxh6!! gxh6 15.Qg6+ Kh8 16.Qh7#
//
// FENs computed with chess.js from move sequences (verified via scripts/_tmp-alien-fens.mjs).
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:     'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:     'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:     'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:     'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/RNBQKBNR b KQkq - 1 3',
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

  // === ALT MATING NET — 15…Kf8 16.Qxh6+ Ke7 17.Qg7# ===
  alt_after_Kf8:    'r1bqrk2/pp1n4/2p1p1Qp/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 2 16',
  alt_after_Qxh6:   'r1bqrk2/pp1n4/2p1p2Q/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 0 16',
  alt_after_Ke7:    'r1bqr3/pp1nk3/2p1p2Q/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 1 17',
  alt_after_Qg7:    'r1bqr3/pp1nk1Q1/2p1p3/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 2 17',

  // === DEVIATION c5 — 7…c5 8.d5 Kg8 9.c4 Nbd7 10.Bd3 e6 ===
  c5_after_c5:    'rnbq1b1r/pp2pkp1/5n1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8',
  c5_after_d5:    'rnbq1b1r/pp2pkp1/5n1p/2pP4/8/5N2/PPP2PPP/R1BQKB1R b KQ - 0 8',
  c5_after_Kg8:   'rnbq1bkr/pp2p1p1/5n1p/2pP4/8/5N2/PPP2PPP/R1BQKB1R w KQ - 1 9',
  c5_after_c4:    'rnbq1bkr/pp2p1p1/5n1p/2pP4/2P5/5N2/PP3PPP/R1BQKB1R b KQ - 0 9',
  c5_after_Nbd7:  'r1bq1bkr/pp1np1p1/5n1p/2pP4/2P5/5N2/PP3PPP/R1BQKB1R w KQ - 1 10',
  c5_after_Bd3:   'r1bq1bkr/pp1np1p1/5n1p/2pP4/2P5/3B1N2/PP3PPP/R1BQK2R b KQ - 2 10',
  c5_after_e6:    'r1bq1bkr/pp1n2p1/4pn1p/2pP4/2P5/3B1N2/PP3PPP/R1BQK2R w KQ - 0 11',

  // === DEVIATION Bf5 — 7…Bf5 8.Ne5+ Kg8 9.Bc4+ e6 10.g4 b5 ===
  bf5_after_Bf5:    'rn1q1b1r/pp2pkp1/2p2n1p/5b2/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  bf5_after_Ne5:    'rn1q1b1r/pp2pkp1/2p2n1p/4Nb2/3P4/8/PPP2PPP/R1BQKB1R b KQ - 3 8',
  bf5_after_Kg8:    'rn1q1bkr/pp2p1p1/2p2n1p/4Nb2/3P4/8/PPP2PPP/R1BQKB1R w KQ - 4 9',
  bf5_after_Bc4:    'rn1q1bkr/pp2p1p1/2p2n1p/4Nb2/2BP4/8/PPP2PPP/R1BQK2R b KQ - 5 9',
  bf5_after_e6:     'rn1q1bkr/pp4p1/2p1pn1p/4Nb2/2BP4/8/PPP2PPP/R1BQK2R w KQ - 0 10',
  bf5_after_g4:     'rn1q1bkr/pp4p1/2p1pn1p/4Nb2/2BP2P1/8/PPP2P1P/R1BQK2R b KQ - 0 10',
  bf5_after_b5:     'rn1q1bkr/p5p1/2p1pn1p/1p2Nb2/2BP2P1/8/PPP2P1P/R1BQK2R w KQ - 0 11',

  // === DEVIATION e6 — 7…e6 8.Bd3 Bd6 9.O-O Rf8 10.Re1 Kg8 ===
  e6_after_e6:     'rnbq1b1r/pp3kp1/2p1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8',
  e6_after_Bd3:    'rnbq1b1r/pp3kp1/2p1pn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 1 8',
  e6_after_Bd6:    'rnbq3r/pp3kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 2 9',
  e6_after_OO:     'rnbq3r/pp3kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b - - 3 9',
  e6_after_Rf8:    'rnbq1r2/pp3kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w - - 4 10',
  e6_after_Re1:    'rnbq1r2/pp3kp1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 b - - 5 10',
  e6_after_Kg8:    'rnbq1rk1/pp4p1/2pbpn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 w - - 6 11',

  // === DEVIATION Be6 — 7…Be6 8.Bd3 Nbd7 9.O-O Kg8 10.Re1 Bf7 ===
  Be6_after_Be6:   'rn1q1b1r/pp2pkp1/2p1bn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  Be6_after_Bd3:   'rn1q1b1r/pp2pkp1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 3 8',
  Be6_after_Nbd7:  'r2q1b1r/pp1npkp1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 9',
  Be6_after_OO:    'r2q1b1r/pp1npkp1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b - - 5 9',
  Be6_after_Kg8:   'r2q1bkr/pp1np1p1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w - - 6 10',
  Be6_after_Re1:   'r2q1bkr/pp1np1p1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 b - - 7 10',
  Be6_after_Bf7:   'r2q1bkr/pp1npbp1/2p2n1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 w - - 8 11',

  // === DEVIATION Kg8 — 7…Kg8 8.Bd3 Be6 9.O-O Nbd7 10.Re1 Bf7 ===
  Kg8_after_Kg8:   'rnbq1bkr/pp2p1p1/2p2n1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  Kg8_after_Bd3:   'rnbq1bkr/pp2p1p1/2p2n1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 3 8',
  Kg8_after_Be6:   'rn1q1bkr/pp2p1p1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 9',
  Kg8_after_OO:    'rn1q1bkr/pp2p1p1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b - - 5 9',
  Kg8_after_Nbd7:  'r2q1bkr/pp1np1p1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w - - 6 10',
  Kg8_after_Re1:   'r2q1bkr/pp1np1p1/2p1bn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 b - - 7 10',
  Kg8_after_Bf7:   'r2q1bkr/pp1npbp1/2p2n1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 w - - 8 11',

  // === DEVIATION Bg4 — 7…Bg4 8.Ne5+ Kg8 9.Bc4+ e6 10.Nxg4 Nxg4 ===
  bg4_after_Bg4:    'rn1q1b1r/pp2pkp1/2p2n1p/8/3P2b1/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  bg4_after_Ne5:    'rn1q1b1r/pp2pkp1/2p2n1p/4N3/3P2b1/8/PPP2PPP/R1BQKB1R b KQ - 3 8',
  bg4_after_Kg8:    'rn1q1bkr/pp2p1p1/2p2n1p/4N3/3P2b1/8/PPP2PPP/R1BQKB1R w KQ - 4 9',
  bg4_after_Bc4:    'rn1q1bkr/pp2p1p1/2p2n1p/4N3/2BP2b1/8/PPP2PPP/R1BQK2R b KQ - 5 9',
  bg4_after_e6:     'rn1q1bkr/pp4p1/2p1pn1p/4N3/2BP2b1/8/PPP2PPP/R1BQK2R w KQ - 0 10',
  bg4_after_Nxg4:   'rn1q1bkr/pp4p1/2p1pn1p/8/2BP2N1/8/PPP2PPP/R1BQK2R b KQ - 0 10',
  bg4_after_NxNg4:  'rn1q1bkr/pp4p1/2p1p2p/8/2BP2n1/8/PPP2PPP/R1BQK2R w KQ - 0 11',
}


// ═══════════════════════════════════════════════════════════
// wa-1: THE SETUP (1.e4 c6 2.d4 d5 3.Nc3 dxe4)
// First lesson — no recap.
// Teaches 3 white moves: e4, d4, Nc3
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
      text: "Welcome to the Alien Gambit — Witty_Alien's trick weapon vs the Caro-Kann. Sacrifice a knight on f7, drag the king out, attack. Witty wins 80% of these in real games.",
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
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Black almost always responds to 1.e4 with e5 or c5. Caro-Kann players play c6 — that's your door in.",
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
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Two pawns abreast on d4 and e4 — the Caro-Kann main line. Black will hit e4 with d5.",
      arrow: ['d2', 'd4'],
    },

    // ── TEACH 3: Nc3 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "And there it is. d5 attacks your e4 pawn.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nc3',
      prompt: "Defend e4 by developing a piece.",
      hint: 'Bring the b1 knight to c3 — it defends e4.',
      correctFeedback: "Nc3! Develops AND defends e4. Now Black has a choice: capture, push, or trade.",
      wrongFeedback: 'Play Nc3 — develop and defend e4 in one move.',
      postMoveArrow: ['c3', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Nc3 looks innocent. It's not — you're luring Black into capturing on e4. That's where the trap begins.",
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
      text: "The trap is set. Next lesson: recapture, set up the sacrifice, fire.",
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
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Setup complete. Black grabbed the e4 pawn. Next lesson: the sacrifice fires.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-2: THE SACRIFICE (4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7!! Kxf7)
// Teaches 3 white moves: Nxe4, Ng5, Nxf7!!
// THE signature sacrifice. Witty wins 80% over 451 real games.
// ═══════════════════════════════════════════════════════════

const WA_2: OpeningLesson = {
  id: 'wa-2',
  title: 'The Sacrifice',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Time for the signature move. Three moves from now, you'll sacrifice a whole knight on f7. In Witty_Alien's real games, this gambit wins 80% of the time.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },

    // ── TEACH 1: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Recapture with the knight.',
      hint: 'Knight takes e4.',
      correctFeedback: "Nxe4. Knight in the center, eyeing g5 and f6. The trap is loaded.",
      wrongFeedback: 'Play Nxe4 — take with the knight.',
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 — Black attacks your knight. Looks like you have to retreat. You don't.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 2: Ng5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Instead of retreating, jump FORWARD. Knight to g5 — heading straight for f7.",
      highlightSquares: ['e4', 'g5', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Ng5',
      prompt: "Knight forward — toward f7.",
      hint: 'Knight to g5.',
      correctFeedback: "Ng5! The knight ignores Nf6 and threatens f7 directly. Black usually plays h6 here — they think they're kicking the knight away.",
      wrongFeedback: 'Play Ng5 — go forward, not back.',
      postMoveArrow: ['g5', 'f7'],
    },

    // ── BLACK h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 — Black says 'shoo, knight.' 62% of real Witty opponents play this. They walked into it.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },

    // ── TEACH 3: Nxf7!! ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The signature move. Don't retreat. SACRIFICE.",
      highlightSquares: ['g5', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: "Sacrifice the knight on f7.",
      hint: 'Knight takes f7 — yes, the king takes back. That is the point.',
      correctFeedback: "Nxf7!! The Alien Gambit fires. Knight for two pawns and a king dragged into the open. Witty plays this in 99% of his real games when he gets here.",
      wrongFeedback: 'Play Nxf7 — sacrifice the knight, drag the king out.',
      postMoveArrow: ['f7', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf7,
      text: "Black almost has to take — refusing the gambit just loses material with no compensation.",
      arrow: ['f7', 'e8'],
    },

    // ── BLACK Kxf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Kxf7 — king forced out. It's now on f7, no pawn cover, in the middle of the board. Exactly what you wanted.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Run the sacrifice from move 4.",
    },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "King on f7. Material: down a knight for two pawns. But the king is exposed. Next: the universal attacking setup.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-3: UNIVERSAL SETUP (7.Nf3 Nbd7 8.Bd3 e6 9.O-O Bd6)
// Teaches 3 white moves: Nf3, Bd3, O-O
// The "universal attacking pattern" — same plan vs multiple Black 7th moves.
// ═══════════════════════════════════════════════════════════

const WA_3: OpeningLesson = {
  id: 'wa-3',
  title: 'Universal Setup',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Here's the key idea: Black has SEVEN different 7th moves in real games. But your plan is the same. Nf3, Bd3, O-O — develop and castle.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Black might play Nbd7, e6, Bd6, Be6, Kg8 — doesn't matter. You're aiming the bishop at h7 and getting your king safe. The brilliancy comes later.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the sacrifice.",
    },
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

    // ── TEACH 1: Nf3 ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Bring the other knight out — Nf3. Develop with tempo, control e5.",
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: "Develop the kingside knight.",
      hint: 'Knight from g1 to f3.',
      correctFeedback: "Nf3! Witty plays this in 96% of his real games. Quiet development — the attack comes later.",
      wrongFeedback: 'Play Nf3 — develop, control e5.',
    },

    // ── BLACK Nbd7 (most common path in main line) ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Nbd7 — Black develops too. In real games, Black plays Nbd7 (13%), but might also play c5, Bf5, e6, Be6, or Kg8. Your plan doesn't change.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: Bd3 ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Aim the light-square bishop straight at h7 — Bd3. This bishop is going to matter in 7 moves.",
      highlightSquares: ['f1', 'd3', 'h7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nbd7,
      correctMove: 'Bd3',
      prompt: "Aim the bishop at h7.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3! Bishop on the b1-h7 diagonal. Witty plays this in 100% of Nbd7 games — and Bd3 against almost every other Black 7th move too.",
      wrongFeedback: 'Play Bd3 — aim at h7.',
      postMoveArrow: ['d3', 'h7'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 — Black closes the b1-h7 diagonal at e6, prepping Bd6. Sensible.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 3: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_e6,
      correctMove: 'O-O',
      prompt: "Castle. Get the king safe, activate the rook.",
      hint: 'Castle kingside.',
      correctFeedback: "O-O. King safe, rook on f1 ready to swing. Now the attack can start.",
      wrongFeedback: 'Play O-O — castle into the attack.',
    },

    // ── BLACK Bd6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Bd6 — Black develops the dark-square bishop, blocking your future Re1. You'll deal with it next lesson.",
      autoAdvance: 800,
      highlightSquares: ['f8', 'd6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Run the universal setup from Kxf7.",
    },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nbd7, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['f8', 'd6'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Nf3, Bd3, O-O. Same plan regardless of Black's exact reply. Next: open the f-file and the SECOND sacrifice.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-4: OPEN THE F-FILE (10.Re1 Re8 11.Ne5+ Bxe5 12.dxe5 Nd5)
// Teaches 3 white moves: Re1, Ne5+, dxe5
// ═══════════════════════════════════════════════════════════

const WA_4: OpeningLesson = {
  id: 'wa-4',
  title: 'Open the f-file',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Bd6 blocks your e-file rook — but only for a moment. Time to swing the rook to e1 and fire the SECOND knight into e5.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the setup.",
    },
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

    // ── TEACH 1: Re1 ──
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'Re1',
      prompt: "Swing the rook to e1.",
      hint: 'Rook from f1 to e1.',
      correctFeedback: "Re1! Rook pressures the e-file behind Black's e6 pawn. Black will probably play Re8 to contest.",
      wrongFeedback: 'Play Re1 — pile on the e-file.',
    },

    // ── BLACK Re8 ──
    {
      type: 'instruction',
      fen: FEN.after_Re8,
      text: "Re8 — Black contests the e-file. Looks fine. It's not — your knight is about to jump in with check.",
      autoAdvance: 800,
      highlightSquares: ['h8', 'e8'],
    },

    // ── TEACH 2: Ne5+ ──
    {
      type: 'instruction',
      fen: FEN.after_Re8,
      text: "The second sacrifice. Jump Ne5+ — check, and threatens the bishop on d6 AND the c6 pawn.",
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Re8,
      correctMove: 'Ne5+',
      prompt: "Knight to e5 with check.",
      hint: 'Knight from f3 to e5.',
      correctFeedback: "Ne5+! Check on the king, attacking Bd6. Black's only useful reply is Bxe5 — taking the knight.",
      wrongFeedback: 'Play Ne5+ — check, multiple threats.',
      postMoveArrow: ['e5', 'f7'],
    },

    // ── BLACK Bxe5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: "Bxe5 — Black takes the knight. Forced — every alternative loses material. Now you recapture with the pawn.",
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },

    // ── TEACH 3: dxe5 ──
    {
      type: 'play-move',
      fen: FEN.after_Bxe5,
      correctMove: 'dxe5',
      prompt: "Take with the d-pawn.",
      hint: 'd-pawn takes e5.',
      correctFeedback: "dxe5! Pawn on e5 attacks the f6 knight, the d-file opens, and your queen has air. Black must move the knight.",
      wrongFeedback: 'Play dxe5 — recapture with the pawn.',
      postMoveArrow: ['e5', 'f6'],
    },

    // ── BLACK Nd5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "Nd5 — Black jumps the knight to safety. Now your queen has a free shot at h5 — and the king on f7 has no defenders.",
      autoAdvance: 800,
      highlightSquares: ['f6', 'd5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "From Bd6 — Re1, Ne5+, dxe5.",
    },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'Re8.', autoAdvance: 800, highlightSquares: ['h8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Re8, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.after_Bxe5, text: 'Bxe5.', autoAdvance: 800, highlightSquares: ['d6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Bxe5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "f-file open, e5 pawn cramping Black, knight on d5. Next: the brilliancy.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-5: THE BXH6 BRILLIANCY (13.Qh5+ Kg8 14.Bxh6!! gxh6 → puzzle for 15.Qg6+ Kh8 16.Qh7#)
// Teaches 3 white moves: Qh5+, Bxh6!!, Qg6+ (delivered via puzzle)
// ═══════════════════════════════════════════════════════════

const WA_5: OpeningLesson = {
  id: 'wa-5',
  title: 'The Bxh6 Brilliancy',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "The brilliancy time. Queen check forces Black's king to the corner — then comes the move that'll get spammed with the brilliant emote. Don't boo. Just enjoy it.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the open f-file.",
    },
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

    // ── TEACH 1: Qh5+ ──
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qh5+',
      prompt: "Queen check — chase the king to the corner.",
      hint: 'Queen to h5, check.',
      correctFeedback: "Qh5+! Black's king has one square — g8.",
      wrongFeedback: 'Play Qh5+ — queen swing with check.',
      postMoveArrow: ['h5', 'f7'],
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Kg8. King in the corner, blocked by Black's own pieces.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 2: Bxh6!! ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Look at h6 — that pawn defends g7. What if you just… take it?",
      highlightSquares: ['h6', 'g7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kg8,
      correctMove: 'Bxh6',
      prompt: "Sacrifice the bishop on h6.",
      hint: 'Bishop takes h6 — gxh6 is exactly what you want.',
      correctFeedback: "Bxh6!! The brilliancy. If Black takes with gxh6, the king has no pawn shield and the queen is one move from mate.",
      wrongFeedback: 'Play Bxh6 — crack open the king.',
      postMoveArrow: ['h6', 'g7'],
    },

    // ── BLACK gxh6 ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "gxh6. Black takes. The g-file is open, h-pawn doubled, king naked.",
      autoAdvance: 800,
      highlightSquares: ['g7', 'h6'],
    },

    // ── TEACH 3 (as PUZZLE): Qg6+ Kh8 Qh7# ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "Mate in 2. Find it — checks all the way.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_gxh6,
      solutionMoves: ['Qg6+', 'Kh8', 'Qh7#'],
      playerColor: 'white',
      prompt: "Mate in 2.",
      hint: "Queen to g6 with check. Black's king has one square: h8. Then drop the queen on h7.",
      correctFeedback: "Qg6+ Kh8 Qh7# — checkmate. The Bxh6 brilliancy converted.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qh7,
      text: "Qh7# — the king is mated, pinned by the bishop on d3. Two sacrifices, full mating net. Next lesson: what if Black runs to f8 instead of h8?",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-6: THE MATE NET (full Qh7# main path + alt 15…Kf8 16.Qxh6+ Ke7 17.Qg7#)
// Treats puzzles as "3 white moves" of content per the rebuild spec.
// Main path puzzle: Qg6+, Kh8, Qh7#
// Alt path puzzle: Qxh6+, Ke7, Qg7#
// ═══════════════════════════════════════════════════════════

const WA_6: OpeningLesson = {
  id: 'wa-6',
  title: 'The Mate Net',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "You've already seen Qg6+ Kh8 Qh7#. But what if Black plays Kf8 instead of Kh8? Same idea, different mate. The queen catches the king either way.",
    },

    // ── RECAP (light — to the brilliancy position) ──
    {
      type: 'instruction',
      fen: FEN.after_Bxh6,
      text: "Quick recap — you played Bxh6, Black recaptured gxh6.",
    },
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "gxh6 — king open, time for the queen.",
      autoAdvance: 800,
    },

    // ── TEACH 1 (PUZZLE): main path Qg6+ Kh8 Qh7# ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "Main path first. Find the mate.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_gxh6,
      solutionMoves: ['Qg6+', 'Kh8', 'Qh7#'],
      playerColor: 'white',
      prompt: "Mate in 2 — main path.",
      hint: "Qg6+ forces Kh8 (only legal move). Then Qh7#.",
      correctFeedback: "Qg6+ Kh8 Qh7#. Main mate locked in.",
    },

    // ── BRIDGE: show alt path setup ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "Now the alt path. After Qg6+, what if Black plays Kf8 instead of Kh8?",
      highlightSquares: ['g8', 'f8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg6,
      text: "You play Qg6+, but instead of Kh8 →",
      autoAdvance: 800,
      arrow: ['g6', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.alt_after_Kf8,
      text: "Black plays Kf8. King runs sideways. Now find the mate.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f8'],
    },

    // ── TEACH 2 + 3 (PUZZLE): alt path Qxh6+ Ke7 Qg7# ──
    {
      type: 'puzzle',
      fen: FEN.alt_after_Kf8,
      solutionMoves: ['Qxh6+', 'Ke7', 'Qg7#'],
      playerColor: 'white',
      prompt: "Mate in 2 — alt path.",
      hint: "Take the h6 pawn with check. King goes to e7 (Kg8?? Qh7# is the same idea). Then Qg7#.",
      correctFeedback: "Qxh6+ Ke7 Qg7#. Both mate nets in your pocket — whichever way Black runs.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.alt_after_Qg7,
      text: "Two mating nets covered. Bxh6!! works no matter where Black's king runs. That's the Alien Gambit at full power.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-c5: DEVIATION — 7…c5 (most common in real games — 23%)
// Witty plays 8.d5 (54%), then c4 and Bd3.
// Teaches 3 white moves: d5, c4, Bd3
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
      text: "Black plays 7…c5 in 23% of real Witty_Alien games — the most common response. They're trying to hit d4 and free their pieces. Here's how Witty handles it.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to 7.Nf3.",
    },
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

    // ── BLACK c5 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_c5,
      text: "c5 — Black hits d4. The most common Witty response is to push past with d5, locking the pawn down.",
      autoAdvance: 800,
      highlightSquares: ['c6', 'c5'],
    },

    // ── TEACH 1: d5 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_c5,
      text: "Push d5! — the pawn marches forward, shutting down Black's c-pawn and clamping the center.",
      highlightSquares: ['d4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.c5_after_c5,
      correctMove: 'd5',
      prompt: "Push the d-pawn past.",
      hint: 'Pawn from d4 to d5.',
      correctFeedback: "d5! Witty plays this in 54% of real c5 games. The pawn freezes Black's queenside.",
      wrongFeedback: 'Play d5 — push past, lock the center.',
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Kg8,
      text: "Kg8 — Black's most common reply, getting the king safe in the corner.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 2: c4 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Kg8,
      text: "Now lock the queenside completely. c4 — your pawns form a wall on c4 and d5.",
      highlightSquares: ['c2', 'c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.c5_after_Kg8,
      correctMove: 'c4',
      prompt: "Build the pawn wall.",
      hint: 'Pawn c2 to c4.',
      correctFeedback: "c4! Witty plays c4 in 8 of 10 games after d5 Kg8. The queenside is frozen. Now develop the bishop.",
      wrongFeedback: 'Play c4 — lock the queenside.',
    },

    // ── BLACK Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Nbd7,
      text: "Nbd7 — Black develops the knight. Time to bring the bishop out.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 3: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.c5_after_Nbd7,
      correctMove: 'Bd3',
      prompt: "Aim the bishop at h7.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3 — same plan as the main line. Aim at h7, castle next move. Win rate here is 86%.",
      wrongFeedback: 'Play Bd3 — same universal plan.',
      postMoveArrow: ['d3', 'h7'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_e6,
      text: "e6 — Black challenges your d5 pawn. You have a strong, locked-up position with a knight, bishop, and king attack lined up.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays c5. d5, c4, Bd3 — the pawn squeeze.",
    },
    { type: 'instruction', fen: FEN.c5_after_c5, text: 'c5.', autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.c5_after_c5, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.c5_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.c5_after_Kg8, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.c5_after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.c5_after_Nbd7, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.c5_after_e6,
      text: "d5, c4, Bd3 — the squeeze. 23% of real opponents play c5, and Witty wins 86% of the time here.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-Bf5: DEVIATION — 7…Bf5 (20% of real games)
// Witty plays 8.Ne5+ (89%) Kg8 9.Bc4+ e6 10.g4 (chasing the bishop)
// Teaches 3 white moves: Ne5+, Bc4+, g4
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
      text: "Black plays 7…Bf5 in 20% of real games — developing the bishop out before locking it in. Witty answers with a knight check and then a pawn storm.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to 7.Nf3.",
    },
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

    // ── BLACK Bf5 ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Bf5,
      text: "Bf5 — Black develops the bishop. The bishop hits the c2-h7 diagonal, looking active. You're about to chase it.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'f5'],
    },

    // ── TEACH 1: Ne5+ ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Bf5,
      text: "Ne5+ — knight jumps to e5 with check. Forces the king to move.",
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_Bf5,
      correctMove: 'Ne5+',
      prompt: "Knight check on e5.",
      hint: 'Knight from f3 to e5.',
      correctFeedback: "Ne5+! Witty plays this in 89% of real Bf5 games. The king has to move — Kg8 is most common.",
      wrongFeedback: 'Play Ne5+ — knight check.',
      postMoveArrow: ['e5', 'f7'],
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Kg8,
      text: "Kg8 — king runs to the corner. Manual castle attempt.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 2: Bc4+ ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_Kg8,
      text: "Bc4+ — bishop check on the a2-g8 diagonal. Forces Black to block with e6.",
      highlightSquares: ['f1', 'c4', 'g8'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_Kg8,
      correctMove: 'Bc4+',
      prompt: "Bishop check on c4.",
      hint: 'Bishop to c4.',
      correctFeedback: "Bc4+! Forces Black to block. e6 is basically the only move.",
      wrongFeedback: 'Play Bc4+ — keep the king under pressure.',
      postMoveArrow: ['c4', 'g8'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_e6,
      text: "e6 — Black blocks the check. Now your bishop on c4 is staring at e6, and the bishop on f5 is exposed.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 3: g4 ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_e6,
      text: "Now the chase. Push g4! — attacks the bishop on f5. In 48 of 51 real games at this position, Witty plays g4.",
      highlightSquares: ['g2', 'g4', 'f5'],
    },
    {
      type: 'play-move',
      fen: FEN.bf5_after_e6,
      correctMove: 'g4',
      prompt: "Pawn storm — chase the bishop with g4.",
      hint: 'Push the g-pawn two squares.',
      correctFeedback: "g4! Chases the bishop, opens the g-file for future attack. Witty plays this 94% of the time here.",
      wrongFeedback: 'Play g4 — pawn attack on the bishop.',
      postMoveArrow: ['g4', 'f5'],
    },

    // ── BLACK b5 ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_b5,
      text: "b5 — Black counterattacks your bishop on c4. The position gets sharp — but you have a king attack going while Black has just a bishop poke.",
      autoAdvance: 800,
      highlightSquares: ['b7', 'b5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays Bf5. Ne5+, Bc4+, g4 — chase the bishop.",
    },
    { type: 'instruction', fen: FEN.bf5_after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.bf5_after_Bf5, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.bf5_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.bf5_after_Kg8, correctMove: 'Bc4+', prompt: 'Your move.', hint: 'Bc4+.', correctFeedback: 'Bc4+.', wrongFeedback: 'Bc4+.' },
    { type: 'instruction', fen: FEN.bf5_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.bf5_after_e6, correctMove: 'g4', prompt: 'Your move.', hint: 'g4.', correctFeedback: 'g4.', wrongFeedback: 'g4.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.bf5_after_b5,
      text: "Ne5+, Bc4+, g4 — the Bf5 chase. Win rate here is 73% across 88 real Witty games.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-e6: DEVIATION — 7…e6 (20% of real games)
// Witty plays 8.Bd3 (91%) Bd6 9.O-O Rf8 10.Re1 — transposes to main line ideas.
// Teaches 3 white moves: Bd3, O-O, Re1
// ═══════════════════════════════════════════════════════════

const WA_DEV_E6: OpeningLesson = {
  id: 'wa-dev-e6',
  title: 'If e6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays 7…e6 in 20% of real games. This often transposes back into the main line — same Bd3 / O-O / Re1 plan, same brilliancy target.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to 7.Nf3.",
    },
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

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.e6_after_e6,
      text: "e6 — Black blocks the b1-h7 diagonal early. Looks defensive. Your plan doesn't change.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.e6_after_e6,
      correctMove: 'Bd3',
      prompt: "Same plan — aim the bishop at h7.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3! Witty plays this in 91% of real e6 games. Pointing at h7 anyway — Black can't keep the diagonal closed forever.",
      wrongFeedback: 'Play Bd3 — universal plan, same as main line.',
      postMoveArrow: ['d3', 'h7'],
    },

    // ── BLACK Bd6 ──
    {
      type: 'instruction',
      fen: FEN.e6_after_Bd6,
      text: "Bd6 — Black mirrors your bishop. Now the position looks just like the main line with one extra Black move.",
      autoAdvance: 800,
      highlightSquares: ['f8', 'd6'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.e6_after_Bd6,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: 'O-O.',
      correctFeedback: "O-O. Same as the main line — get the king safe, activate the rook.",
      wrongFeedback: 'Play O-O — castle, normal plan.',
    },

    // ── BLACK Rf8 ──
    {
      type: 'instruction',
      fen: FEN.e6_after_Rf8,
      text: "Rf8 — Black defends the f-file. Common at this position — they want their king on g8 next.",
      autoAdvance: 800,
      highlightSquares: ['h8', 'f8'],
    },

    // ── TEACH 3: Re1 ──
    {
      type: 'play-move',
      fen: FEN.e6_after_Rf8,
      correctMove: 'Re1',
      prompt: "Pile on the e-file.",
      hint: 'Rook from f1 to e1.',
      correctFeedback: "Re1! Same idea as the main line — rook on e1, ready for Ne5+ next. This is the transposition.",
      wrongFeedback: 'Play Re1 — same plan, same file.',
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.e6_after_Kg8,
      text: "Kg8 — Black manually castles. From here you have the same attacking ideas as the main line. Ne5+ is one move away.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays e6. Same plan — Bd3, O-O, Re1.",
    },
    { type: 'instruction', fen: FEN.e6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.e6_after_e6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.e6_after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['f8', 'd6'] },
    { type: 'play-move', fen: FEN.e6_after_Bd6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.e6_after_Rf8, text: 'Rf8.', autoAdvance: 800, highlightSquares: ['h8', 'f8'] },
    { type: 'play-move', fen: FEN.e6_after_Rf8, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.e6_after_Kg8,
      text: "e6 just delays things. You're back in main-line territory with Bd3 / O-O / Re1. Win rate: 85% across 87 real Witty games.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-Be6: DEVIATION — 7…Be6 (7%, lowest win rate at 53%)
// Witty plays 8.Bd3 (97%) Nbd7 9.O-O Kg8 10.Re1 — same plan, but tougher.
// Teaches 3 white moves: Bd3, O-O, Re1
// HONEST TONE — 53% win rate means this is the hardest defense.
// ═══════════════════════════════════════════════════════════

const WA_DEV_BE6: OpeningLesson = {
  id: 'wa-dev-Be6',
  title: 'If Be6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Honest moment: Black plays 7…Be6 in only 7% of real games — but win rate drops to 53%. This is the toughest defense Black has. Stay patient.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Why is it hard? The bishop on e6 covers c4, blocks future Bc4 ideas, and defends f7's surroundings. You can still play your plan — just don't expect a quick knockout.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to 7.Nf3.",
    },
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

    // ── BLACK Be6 ──
    {
      type: 'instruction',
      fen: FEN.Be6_after_Be6,
      text: "Be6 — Black plants the bishop on a strong square, defending f7 and covering c4. This is the toughest defense.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'e6'],
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.Be6_after_Be6,
      correctMove: 'Bd3',
      prompt: "Same plan — aim at h7.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3 — Witty plays this in 97% of real Be6 games. Develop, aim at h7, stay patient.",
      wrongFeedback: 'Play Bd3 — same universal plan, just slower.',
      postMoveArrow: ['d3', 'h7'],
    },

    // ── BLACK Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.Be6_after_Nbd7,
      text: "Nbd7 — Black develops the knight. Solid.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.Be6_after_Nbd7,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: 'O-O.',
      correctFeedback: "O-O. King safe. You're going to need patience — the brilliancy probably isn't coming this game.",
      wrongFeedback: 'Play O-O — castle, settle in for a longer game.',
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.Be6_after_Kg8,
      text: "Kg8 — Black gets the king safe.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 3: Re1 ──
    {
      type: 'play-move',
      fen: FEN.Be6_after_Kg8,
      correctMove: 'Re1',
      prompt: "Pile on the e-file.",
      hint: 'Rook to e1.',
      correctFeedback: "Re1. Slow, normal development. Win rate is 53% — you'll have to outplay them later. The gambit didn't break this one open.",
      wrongFeedback: 'Play Re1 — keep developing.',
    },

    // ── BLACK Bf7 ──
    {
      type: 'instruction',
      fen: FEN.Be6_after_Bf7,
      text: "Bf7 — Black tucks the bishop back. Honest assessment: position is roughly equal, you're down material, the king is safe-ish. Fight on.",
      autoAdvance: 800,
      highlightSquares: ['e6', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays Be6. Same plan — Bd3, O-O, Re1.",
    },
    { type: 'instruction', fen: FEN.Be6_after_Be6, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.Be6_after_Be6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.Be6_after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.Be6_after_Nbd7, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.Be6_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.Be6_after_Kg8, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.Be6_after_Bf7,
      text: "Be6 is the hard one — 53% win rate. The plan is still Bd3 / O-O / Re1, but the brilliancy probably won't fire. Trick weapons don't always work — that's the deal.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-Kg8: DEVIATION — 7…Kg8 (6%, manual castle)
// Witty plays 8.Bd3 (92%) Be6 9.O-O Nbd7 10.Re1 Bf7
// Teaches 3 white moves: Bd3, O-O, Re1
// ═══════════════════════════════════════════════════════════

const WA_DEV_KG8: OpeningLesson = {
  id: 'wa-dev-Kg8',
  title: 'If Kg8',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays 7…Kg8 in 6% of real games — trying to manually castle and tuck the king away. You stick to the universal plan: Bd3 / O-O / Re1.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to 7.Nf3.",
    },
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

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.Kg8_after_Kg8,
      text: "Kg8 — Black manually walks the king to safety. Fine — your plan doesn't care.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.Kg8_after_Kg8,
      correctMove: 'Bd3',
      prompt: "Same plan — aim at h7.",
      hint: 'Bishop to d3.',
      correctFeedback: "Bd3. Witty plays this in 92% of real Kg8 games. The bishop diagonal matters more than where the king is.",
      wrongFeedback: 'Play Bd3 — same universal plan.',
      postMoveArrow: ['d3', 'h7'],
    },

    // ── BLACK Be6 ──
    {
      type: 'instruction',
      fen: FEN.Kg8_after_Be6,
      text: "Be6 — Black develops the bishop. They're stabilizing the position.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'e6'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.Kg8_after_Be6,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: 'O-O.',
      correctFeedback: "O-O. King safe, rook on f1.",
      wrongFeedback: 'Play O-O — castle, normal plan.',
    },

    // ── BLACK Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.Kg8_after_Nbd7,
      text: "Nbd7 — Black develops the knight.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'd7'],
    },

    // ── TEACH 3: Re1 ──
    {
      type: 'play-move',
      fen: FEN.Kg8_after_Nbd7,
      correctMove: 'Re1',
      prompt: "Rook to e1.",
      hint: 'Rook from f1 to e1.',
      correctFeedback: "Re1. Same plan, every time. 80% win rate across 25 real games at this position.",
      wrongFeedback: 'Play Re1 — pile on the e-file.',
    },

    // ── BLACK Bf7 ──
    {
      type: 'instruction',
      fen: FEN.Kg8_after_Bf7,
      text: "Bf7 — Black retreats the bishop to defend. You have a normal attacking position now with Ne5+ ideas one move away.",
      autoAdvance: 800,
      highlightSquares: ['e6', 'f7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays Kg8. Same plan — Bd3, O-O, Re1.",
    },
    { type: 'instruction', fen: FEN.Kg8_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.Kg8_after_Kg8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.Kg8_after_Be6, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.Kg8_after_Be6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.Kg8_after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    { type: 'play-move', fen: FEN.Kg8_after_Nbd7, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.Kg8_after_Bf7,
      text: "Manual castle, same response. Bd3 / O-O / Re1 — every time. 80% win rate.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-dev-Bg4: DEVIATION — 7…Bg4 (3%, pin attempt)
// Witty plays 8.Ne5+ (100%) Kg8 9.Bc4+ e6 10.Nxg4 — wins the bishop.
// Teaches 3 white moves: Ne5+, Bc4+, Nxg4
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
      text: "Black plays 7…Bg4 in 3% of real games, trying to pin your knight. Bad idea. Witty plays Ne5+ (100% consistency) and the pin breaks immediately.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to 7.Nf3.",
    },
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

    // ── BLACK Bg4 ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Bg4,
      text: "Bg4 — Black pins the knight to the queen. Looks scary, isn't.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'g4'],
    },

    // ── TEACH 1: Ne5+ ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Bg4,
      text: "Break the pin with check. Ne5+ — knight moves WITH check, attacking the king. The pin doesn't matter because Black has to deal with the check first.",
      highlightSquares: ['f3', 'e5', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.bg4_after_Bg4,
      correctMove: 'Ne5+',
      prompt: "Knight check on e5.",
      hint: 'Knight from f3 to e5 — check.',
      correctFeedback: "Ne5+! 100% of real Witty games. The pin is broken — Black has to move the king or block.",
      wrongFeedback: 'Play Ne5+ — break the pin WITH check.',
      postMoveArrow: ['e5', 'f7'],
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Kg8,
      text: "Kg8 — Black runs the king to the corner. Most common reply (12 of 15 games).",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 2: Bc4+ ──
    {
      type: 'play-move',
      fen: FEN.bg4_after_Kg8,
      correctMove: 'Bc4+',
      prompt: "Bishop check.",
      hint: 'Bishop to c4 — check on the a2-g8 diagonal.',
      correctFeedback: "Bc4+! Witty plays Bc4+ in 10 of 12 games here. Forces e6 to block — and now the bishop on g4 is just hanging.",
      wrongFeedback: 'Play Bc4+ — keep the king busy.',
      postMoveArrow: ['c4', 'g8'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_e6,
      text: "e6 — Black blocks the check. The bishop on g4 has no support, no defender. Free piece.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 3: Nxg4 ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_e6,
      text: "Take the bishop. Nxg4 — knight grabs the loose piece.",
      highlightSquares: ['e5', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.bg4_after_e6,
      correctMove: 'Nxg4',
      prompt: "Win the bishop.",
      hint: 'Knight takes g4.',
      correctFeedback: "Nxg4! Won the bishop. The pin attempt backfired completely. Win rate at this deviation: 87%.",
      wrongFeedback: 'Play Nxg4 — take the loose bishop.',
    },

    // ── BLACK Nxg4 ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Nxg4,
      text: "Nxg4 — Black's f6 knight recaptures. You've won the bishop pair AND the king is still stuck on g8 with no real defense.",
      autoAdvance: 800,
      highlightSquares: ['f6', 'g4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black plays Bg4. Ne5+, Bc4+, Nxg4 — pin breaks, bishop falls.",
    },
    { type: 'instruction', fen: FEN.bg4_after_Bg4, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.bg4_after_Bg4, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.bg4_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.bg4_after_Kg8, correctMove: 'Bc4+', prompt: 'Your move.', hint: 'Bc4+.', correctFeedback: 'Bc4+.', wrongFeedback: 'Bc4+.' },
    { type: 'instruction', fen: FEN.bg4_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.bg4_after_e6, correctMove: 'Nxg4', prompt: 'Your move.', hint: 'Nxg4.', correctFeedback: 'Nxg4.', wrongFeedback: 'Nxg4.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_NxNg4,
      text: "Pin attempt punished. 87% win rate across 15 real Witty games. Ne5+, Bc4+, Nxg4 — every time.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wa-test-1: LEVEL 1 TEST
// Tests main line + all 6 deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const WA_TEST_1: OpeningLesson = {
  id: 'wa-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the full Alien Gambit — main line, brilliancy, and every deviation. From memory.",
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
    { type: 'play-move', fen: FEN.after_Kg8, correctMove: 'Bxh6', prompt: 'Your move.', hint: 'Bxh6.', correctFeedback: 'Bxh6 — the brilliancy.', wrongFeedback: 'Bxh6.' },
    { type: 'instruction', fen: FEN.after_gxh6, text: 'gxh6 — find the mate.', autoAdvance: 800, highlightSquares: ['g7', 'h6'] },
    {
      type: 'puzzle',
      fen: FEN.after_gxh6,
      solutionMoves: ['Qg6+', 'Kh8', 'Qh7#'],
      playerColor: 'white',
      prompt: "Mate in 2.",
      hint: 'Qg6+ Kh8 Qh7#.',
      correctFeedback: 'Mate. Main line locked in.',
    },

    // ── DEVIATIONS ──
    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 1: 7…c5 (most common).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.c5_after_c5, text: 'c5.', autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.c5_after_c5, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 2: 7…Bf5.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.bf5_after_Bf5, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.bf5_after_Bf5, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },

    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 3: 7…e6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.e6_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.e6_after_e6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 4: 7…Be6 (tough defense).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.Be6_after_Be6, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.Be6_after_Be6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 5: 7…Kg8.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.Kg8_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.Kg8_after_Kg8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 6: 7…Bg4.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.bg4_after_Bg4, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.bg4_after_Bg4, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.bg4_after_Ne5,
      text: "Test complete. Main line, brilliancy, 6 deviations covering 92% of real Witty_Alien opponents. The Alien Gambit, in your pocket.",
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
  'wa-dev-c5': WA_DEV_C5,
  'wa-dev-Bf5': WA_DEV_BF5,
  'wa-dev-e6': WA_DEV_E6,
  'wa-dev-Be6': WA_DEV_BE6,
  'wa-dev-Kg8': WA_DEV_KG8,
  'wa-dev-Bg4': WA_DEV_BG4,
  'wa-test-1': WA_TEST_1,
}

export function getWittyAlienLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_LESSONS[id]
}
