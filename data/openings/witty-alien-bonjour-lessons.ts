import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — BONJOUR VARIATION LESSONS (wab-1 through wab-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// 6.Nxf7 in the French is unsound but scores ~53% White over 15,000+
// Lichess games (per Chess_In_Fire study). Even less sound than the
// Caro-Kann original by engine eval — lean INTO the meme.
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 e6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6
//            6.Nxf7!! Kxf7 7.Nf3 Nbd7 8.Bd3 Bd6 9.O-O Re8
//            10.Re1 Kg8 11.Ne5 Bxe5 12.dxe5 Nd5 13.Qg4 Kh8
//            14.Bxh6!! gxh6 15.Qg6 Nf8 16.Qxh6+ Kg8 17.Re4 Kf7
//            18.Rg4 Ng6 19.Qxg6+ Ke7 20.Qg7#
//
// Key differences vs the Caro-Kann Alien Gambit:
//   - e6 already played → Black's light-squared bishop is locked in (good for us)
//   - c4 diagonal blocked by e6 (no Bc4+ trick)
//   - Black often manually castles before the Bxe5 trade — so the queen
//     swings to Qg4 (not Qh5+) and the king lands on h8 (not g8)
//   - Bxh6 brilliancy still works, but mating sequence is longer
//
// Sources (verified):
//   - https://lichess.org/study/HdOBd71d (AquaBlaze47, Bonjour chapter)
//   - https://lichess.org/study/4w4FSB7u (Chess_In_Fire, 9 French gamebook chapters)
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:     'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e6:     'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:     'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:     'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nd2:    'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3',
  after_dxe4:   'rnbqkbnr/ppp2ppp/4p3/8/3Pp3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4',
  after_Nxe4:   'rnbqkbnr/ppp2ppp/4p3/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_Nf6:    'rnbqkb1r/ppp2ppp/4pn2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  after_Ng5:    'rnbqkb1r/ppp2ppp/4pn2/6N1/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  after_h6:     'rnbqkb1r/ppp2pp1/4pn1p/6N1/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 6',
  after_Nxf7:   'rnbqkb1r/ppp2Np1/4pn1p/8/3P4/8/PPP2PPP/R1BQKBNR b KQkq - 0 6',
  after_Kxf7:   'rnbq1b1r/ppp2kp1/4pn1p/8/3P4/8/PPP2PPP/R1BQKBNR w KQ - 0 7',
  after_Nf3:    'rnbq1b1r/ppp2kp1/4pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R b KQ - 1 7',
  after_Nbd7:   'r1bq1b1r/pppn1kp1/4pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  after_Bd3:    'r1bq1b1r/pppn1kp1/4pn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 3 8',
  after_Bd6:    'r1bq3r/pppn1kp1/3bpn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQ - 4 9',
  after_OO:     'r1bq3r/pppn1kp1/3bpn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b - - 5 9',
  after_Re8:    'r1bqr3/pppn1kp1/3bpn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w - - 6 10',
  after_Re1:    'r1bqr3/pppn1kp1/3bpn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 b - - 7 10',
  after_Kg8:    'r1bqr1k1/pppn2p1/3bpn1p/8/3P4/3B1N2/PPP2PPP/R1BQR1K1 w - - 8 11',
  after_Ne5:    'r1bqr1k1/pppn2p1/3bpn1p/4N3/3P4/3B4/PPP2PPP/R1BQR1K1 b - - 9 11',
  after_Bxe5:   'r1bqr1k1/pppn2p1/4pn1p/4b3/3P4/3B4/PPP2PPP/R1BQR1K1 w - - 0 12',
  after_dxe5:   'r1bqr1k1/pppn2p1/4pn1p/4P3/8/3B4/PPP2PPP/R1BQR1K1 b - - 0 12',
  after_Nd5:    'r1bqr1k1/pppn2p1/4p2p/3nP3/8/3B4/PPP2PPP/R1BQR1K1 w - - 1 13',
  after_Qg4:    'r1bqr1k1/pppn2p1/4p2p/3nP3/6Q1/3B4/PPP2PPP/R1B1R1K1 b - - 2 13',
  after_Kh8:    'r1bqr2k/pppn2p1/4p2p/3nP3/6Q1/3B4/PPP2PPP/R1B1R1K1 w - - 3 14',
  after_Bxh6:   'r1bqr2k/pppn2p1/4p2B/3nP3/6Q1/3B4/PPP2PPP/R3R1K1 b - - 0 14',
  after_gxh6:   'r1bqr2k/pppn4/4p2p/3nP3/6Q1/3B4/PPP2PPP/R3R1K1 w - - 0 15',
  after_Qg6:    'r1bqr2k/pppn4/4p1Qp/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 1 15',
  after_Nf8:    'r1bqrn1k/ppp5/4p1Qp/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 2 16',
  after_Qxh6:   'r1bqrn1k/ppp5/4p2Q/3nP3/8/3B4/PPP2PPP/R3R1K1 b - - 0 16',
  after_Kg8b:   'r1bqrnk1/ppp5/4p2Q/3nP3/8/3B4/PPP2PPP/R3R1K1 w - - 1 17',
  after_Re4:    'r1bqrnk1/ppp5/4p2Q/3nP3/4R3/3B4/PPP2PPP/R5K1 b - - 2 17',
  after_Kf7:    'r1bqrn2/ppp2k2/4p2Q/3nP3/4R3/3B4/PPP2PPP/R5K1 w - - 3 18',
  after_Rg4:    'r1bqrn2/ppp2k2/4p2Q/3nP3/6R1/3B4/PPP2PPP/R5K1 b - - 4 18',
  after_Ng6:    'r1bqr3/ppp2k2/4p1nQ/3nP3/6R1/3B4/PPP2PPP/R5K1 w - - 5 19',
  after_Qxg6:   'r1bqr3/ppp2k2/4p1Q1/3nP3/6R1/3B4/PPP2PPP/R5K1 b - - 0 19',
  after_Ke7:    'r1bqr3/ppp1k3/4p1Q1/3nP3/6R1/3B4/PPP2PPP/R5K1 w - - 1 20',
  after_Qg7:    'r1bqr3/ppp1k1Q1/4p3/3nP3/6R1/3B4/PPP2PPP/R5K1 b - - 2 20',

  // === DEVIATION Nc6 — 7…Nc6 8.Bd3 Nxd4?? 9.Nxd4 Qxd4?? 10.Bg6+!! Kxg6 11.Qxd4 ===
  nc6_after_Nc6:    'r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 2 8',
  nc6_after_Bd3:    'r1bq1b1r/ppp2kp1/2n1pn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQ - 3 8',
  nc6_after_Nxd4:   'r1bq1b1r/ppp2kp1/4pn1p/8/3n4/3B1N2/PPP2PPP/R1BQK2R w KQ - 0 9',
  nc6_after_NxNd4:  'r1bq1b1r/ppp2kp1/4pn1p/8/3N4/3B4/PPP2PPP/R1BQK2R b KQ - 0 9',
  nc6_after_Qxd4:   'r1b2b1r/ppp2kp1/4pn1p/8/3q4/3B4/PPP2PPP/R1BQK2R w KQ - 0 10',
  nc6_after_Bg6:    'r1b2b1r/ppp2kp1/4pnBp/8/3q4/8/PPP2PPP/R1BQK2R b KQ - 1 10',
  nc6_after_Kxg6:   'r1b2b1r/ppp3p1/4pnkp/8/3q4/8/PPP2PPP/R1BQK2R w KQ - 0 11',
  nc6_after_QxQd4:  'r1b2b1r/ppp3p1/4pnkp/8/3Q4/8/PPP2PPP/R1B1K2R b KQ - 0 11',

  // === DEVIATION c5 — 7…c5 8.Ne5+ Kg8 9.Bd3 ===
  c5_after_c5:      'rnbq1b1r/pp3kp1/4pn1p/2p5/3P4/5N2/PPP2PPP/R1BQKB1R w KQ - 0 8',
  c5_after_Ne5:     'rnbq1b1r/pp3kp1/4pn1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R b KQ - 1 8',
  c5_after_Kg8:     'rnbq1bkr/pp4p1/4pn1p/2p1N3/3P4/8/PPP2PPP/R1BQKB1R w KQ - 2 9',
  c5_after_Bd3:     'rnbq1bkr/pp4p1/4pn1p/2p1N3/3P4/3B4/PPP2PPP/R1BQK2R b KQ - 3 9',
}


// ═══════════════════════════════════════════════════════════
// wab-1: BONJOUR, FRANCE (1.e4 e6 2.d4 d5 3.Nd2 dxe4)
// First lesson — no recap.
// Teaches: e4, d4, Nd2
// ═══════════════════════════════════════════════════════════

const WAB_1: OpeningLesson = {
  id: 'wab-1',
  title: 'Bonjour, France',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Bonjour Variation — Witty_Alien's third Alien Gambit. Same Nxf7 sacrifice you already know, but against the French Defense this time.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Caro-Kann player blocked? Try this on the French players. The trap is almost identical.",
    },

    // ── TEACH 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Open the game and stake the center.',
      hint: 'Push the king pawn two squares.',
      correctFeedback: 'e4 — the trigger. Now we wait to see what Black plays.',
      wrongFeedback: 'Play e4 — the gambit only happens after 1.e4.',
      postMoveArrow: [['e4', 'e5'], ['e4', 'c5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Most Black players reply with e5 or c5. French players play e6 — and that opens the door.",
      arrow: ['e2', 'e4'],
    },

    // ── TEACH 2: d4 ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "Black plays e6 — the French Defense. They're prepping d5 to challenge your e4 pawn.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e6,
      correctMove: 'd4',
      prompt: 'Build a two-pawn center before Black contests it.',
      hint: 'Push d2 to d4 — claim the whole center.',
      correctFeedback: 'd4! Two-pawn center. Same idea as the Caro-Kann.',
      wrongFeedback: 'Play d4 — grab the center while you can.',
      postMoveArrow: [['e4', 'd5'], ['d4', 'e5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Two pawns abreast on d4 and e4 — the main French structure. Black's next move is forced: d5.",
      arrow: ['d2', 'd4'],
    },

    // ── TEACH 3: Nd2 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "And there it is. d5 — Black hits your e4 pawn.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nd2',
      prompt: "Defend e4 by developing a piece. Where does the knight go?",
      hint: 'Bring the b1 knight to d2 — it still covers e4, and it is how Witty plays it.',
      correctFeedback: "Nd2! The Tarrasch move order — the exact way Witty_Alien plays it (564 of 565 real games). Same Alien Gambit, one square over.",
      wrongFeedback: 'Play Nd2 — develop, defend e4, and match Witty\'s real move order.',
      postMoveArrow: ['d2', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd2,
      text: "Nd2 invites Black to capture on e4. If they take, we're in the Rubinstein French — and the gambit is on.",
      arrow: ['b1', 'd2'],
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
      text: "Same trap as the Caro-Kann. Next lesson: we recapture and start hunting the king.",
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
      fen: FEN.after_e6,
      text: 'e6.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e6,
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
      correctMove: 'Nd2',
      prompt: 'Your move.',
      hint: 'Nd2.',
      correctFeedback: 'Nd2.',
      wrongFeedback: 'Nd2.',
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
      text: "e4, d4, Nd2 — the Rubinstein French is on the board. Black bit. Now the fun starts.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-2: BAIT THE KNIGHT (4.Nxe4 Nf6 5.Ng5 h6)
// Teaches: Nxe4, Ng5
// ═══════════════════════════════════════════════════════════

const WAB_2: OpeningLesson = {
  id: 'wab-2',
  title: 'Bait the Knight',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Black thinks they've won a pawn. You're about to send a knight on a one-way trip to f7. Same trap, French flavor.",
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
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },

    // ── TEACH 1: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: "Win the pawn back. How?",
      hint: 'Capture on e4 with the knight.',
      correctFeedback: "Nxe4 — knight in the center, one hop from g5. Sound familiar?",
      wrongFeedback: 'Take with the knight: Nxe4.',
      postMoveArrow: [['e4', 'g5'], ['e4', 'f6']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Nxe4 sets up the jump. Same as the Alien Gambit main line.",
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
      text: "Ng5 looks weird — moved the same knight twice, ignored Nf6's attack. That's the bait. Black almost always plays h6.",
      arrow: ['g5', 'f7'],
    },

    // ── BLACK h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "And there it is. h6 — 'shoo, knight.' Black is about to find out the knight isn't leaving.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Same position as the main Alien Gambit, just with e6 instead of c6. Next lesson: the sacrifice.",
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
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Ng5',
      prompt: 'Your move.',
      hint: 'Ng5.',
      correctFeedback: 'Ng5.',
      wrongFeedback: 'Ng5.',
    },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Nxe4, Ng5 — bait set. Black thinks they're kicking your knight. They are wrong.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-3: THE SACRIFICE (6.Nxf7!! Kxf7 7.Nf3)
// Teaches: Nxf7, Nf3
// ═══════════════════════════════════════════════════════════

const WAB_3: OpeningLesson = {
  id: 'wab-3',
  title: 'The Sacrifice',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Same sacrifice you already know. Same f7, same king walk. Take a breath.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay first.",
    },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // ── TEACH 1: Nxf7!! THE SACRIFICE ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Black just played h6. The knight is attacked. You know what to do.",
      highlightSquares: ['g5', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: "Don't retreat. SACRIFICE. Take f7.",
      hint: 'Capture on f7 with the knight. The king takes it back. That is the point.',
      correctFeedback: "Nxf7!! The Bonjour Variation. 53% White winrate over 15,000+ Lichess games.",
      wrongFeedback: 'Play Nxf7 — same sacrifice, French version.',
      postMoveArrow: ['f7', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf7,
      text: "Black has to take — Kxf7. Refusing loses a pawn for nothing.",
      arrow: ['e8', 'f7'],
    },

    // ── BLACK Kxf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Kxf7. The king is on f7 — no pawn cover, no castling, no friends.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Quick note: in the French version, Black's bishop on c8 is locked in by the e6 pawn. That's good for us — they can't easily defend their king.",
      highlightSquares: ['c8', 'e6'],
    },

    // ── TEACH 2: Nf3 ──
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Nf3',
      prompt: "Develop your other knight. Where does it belong?",
      hint: 'Bring the g1 knight to f3 — heading for e5.',
      correctFeedback: "Nf3 — develops and prepares Ne5, hitting the king zone.",
      wrongFeedback: 'Play Nf3 — get the other knight into the attack.',
      postMoveArrow: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Nf3. You're down a piece for two pawns and an exposed king. The Bonjour is even less sound than the main Alien by engine eval — but humans don't play like engines.",
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
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
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
      text: "Nxf7, Nf3. Knight sacrificed, knight developed. King exposed on f7. Time to attack.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-4: MANUAL CASTLE (7…Nbd7 8.Bd3 Bd6 9.O-O Re8 10.Re1 Kg8)
// Teaches: Bd3, O-O, Re1
// Black manually castles by walking the king to g8 via Re8.
// ═══════════════════════════════════════════════════════════

const WAB_4: OpeningLesson = {
  id: 'wab-4',
  title: 'Manual Castle',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "In the Bonjour, Black often manually castles — walking the king from f7 to g8 via Re8. That gives us time to develop everything.",
    },

    // ── BLACK Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Black plays Nbd7. The knight defends e5, blocking our Ne5 plan for now.",
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
      correctFeedback: "Bd3! The bishop aims at h7 along the b1-h7 diagonal. Critical for the attack later.",
      wrongFeedback: 'Play Bd3 — the bishop wants the b1-h7 diagonal.',
      postMoveArrow: ['d3', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "Bd3 loads the diagonal. The bishop sees all the way to h7. Combined with the queen later, this is lethal.",
      arrow: ['d3', 'h7'],
    },

    // ── BLACK Bd6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: "Black plays Bd6 — developing the bishop and blocking your view of h7.",
      autoAdvance: 800,
      highlightSquares: ['f8', 'd6'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'O-O',
      prompt: "Get your king safe and the rook on f1.",
      hint: 'Castle kingside.',
      correctFeedback: "O-O. King in the corner, rook on f1. Black's king is still wandering.",
      wrongFeedback: "Castle kingside — get your king safe and the rook to f1.",
      postMoveArrow: ['f1', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Castled. Compare the two kings: yours is tucked away, theirs is on f7 with the h8 rook doing nothing.",
      arrow: ['e1', 'g1'],
    },

    // ── BLACK Re8 ──
    {
      type: 'instruction',
      fen: FEN.after_Re8,
      text: "Black plays Re8 — clearing the way for the king to scoot to g8. This is the manual castle.",
      autoAdvance: 800,
      highlightSquares: ['h8', 'e8'],
    },

    // ── TEACH 3: Re1 ──
    {
      type: 'play-move',
      fen: FEN.after_Re8,
      correctMove: 'Re1',
      prompt: "Stack on the e-file. Where does the rook go?",
      hint: 'Rook to e1, eyeing e6.',
      correctFeedback: "Re1! Now both rooks face each other on the e-file. The e6 pawn is a target.",
      wrongFeedback: 'Play Re1 — get the rook on the e-file.',
      postMoveArrow: ['e1', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Re1,
      text: "Re1 stacks pressure on the e-file. Black's e6 pawn is loose, and the rook supports any e-file action.",
      arrow: ['e1', 'e6'],
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Kg8 — manual castle complete. Black thinks the king is safe. We're about to prove otherwise.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Show me the development plan.",
    },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7.', autoAdvance: 800, highlightSquares: ['b8', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.after_Nbd7,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['f8', 'd6'] },
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_Re8, text: 'Re8.', autoAdvance: 800, highlightSquares: ['h8', 'e8'] },
    {
      type: 'play-move',
      fen: FEN.after_Re8,
      correctMove: 'Re1',
      prompt: 'Your move.',
      hint: 'Re1.',
      correctFeedback: 'Re1.',
      wrongFeedback: 'Re1.',
    },
    { type: 'instruction', fen: FEN.after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Bd3, O-O, Re1. Bishop loaded, king safe, rook on the e-file. Black got castled but lost a piece doing it — net win for us.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-5: SETUP THE ATTACK (11.Ne5 Bxe5 12.dxe5 Nd5 13.Qg4 Kh8)
// Teaches: Ne5, dxe5, Qg4
// Force the trade, lift the queen to g4 (NOT Qh5+ — king is on g8 not f7).
// Black plays Kh8 to defend h6.
// ═══════════════════════════════════════════════════════════

const WAB_5: OpeningLesson = {
  id: 'wab-5',
  title: 'Setup the Attack',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Black's king on g8 looks safe, but the f8 rook is doing nothing and Black's queenside is asleep. Time to force a trade and bring the queen.",
    },

    // ── TEACH 1: Ne5 ──
    {
      type: 'play-move',
      fen: FEN.after_Kg8,
      correctMove: 'Ne5',
      prompt: "Plant the knight in the middle. Where?",
      hint: 'Knight jumps to e5 — supported by the d4 pawn.',
      correctFeedback: "Ne5! No check this time (king is on g8), but the knight invades and forces a decision.",
      wrongFeedback: 'Play Ne5 — anchor the knight in the center.',
      postMoveArrow: ['e5', 'd7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Ne5 attacks Nd7 and dares Black to trade. Black almost always takes — the engine prefers Nxe5, but Bxe5 is more common.",
      arrow: ['e5', 'd7'],
    },

    // ── BLACK Bxe5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: "Bxe5. Black trades the bishop for your knight. They think they're simplifying. They're not.",
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },

    // ── TEACH 2: dxe5 ──
    {
      type: 'play-move',
      fen: FEN.after_Bxe5,
      correctMove: 'dxe5',
      prompt: "Recapture with the pawn. Which one?",
      hint: 'Pawn d4 takes e5.',
      correctFeedback: "dxe5! The pawn lands on e5, kicking the Nf6 and opening the d-file for your queen.",
      wrongFeedback: 'Play dxe5 — recapture with the d-pawn.',
      postMoveArrow: ['e5', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe5,
      text: "dxe5 hits Nf6. Black has to move it — and wherever it goes, the kingside gets weaker.",
      arrow: ['e5', 'f6'],
    },

    // ── BLACK Nd5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "Black plays Nd5. The knight is central but no longer defending the kingside.",
      autoAdvance: 800,
      highlightSquares: ['f6', 'd5'],
    },

    // ── TEACH 3: Qg4 ──
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qg4',
      prompt: "Queen joins the attack. Where? (Not h5 — king's on g8.)",
      hint: 'Queen to g4 — eyes h4, h5, and the kingside files.',
      correctFeedback: "Qg4! Queen swings out, aiming at the kingside. Note: NOT Qh5+ like the Caro-Kann — king's on g8, not f7, so there's no check.",
      wrongFeedback: 'Play Qg4 — bring the queen to the kingside.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg4,
      text: "Qg4 threatens Bxh6 next. Black's defenders are scattered.",
      arrow: ['g4', 'h6'],
    },

    // ── BLACK Kh8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "Black plays Kh8 — trying to add a defender to h6. The engine prefers Nh7 (undeveloping) for a tougher defense, but Kh8 is most common.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'h8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "Kh8 doesn't save them. Next lesson: the Bxh6 brilliancy — even better than the Caro-Kann version.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8,
      text: "Run it back.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Kg8,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },
    { type: 'instruction', fen: FEN.after_Bxe5, text: 'Bxe5.', autoAdvance: 800, highlightSquares: ['d6', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxe5,
      correctMove: 'dxe5',
      prompt: 'Your move.',
      hint: 'dxe5.',
      correctFeedback: 'dxe5.',
      wrongFeedback: 'dxe5.',
    },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qg4',
      prompt: 'Your move.',
      hint: 'Qg4.',
      correctFeedback: 'Qg4.',
      wrongFeedback: 'Qg4.',
    },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Kh8.', autoAdvance: 800, highlightSquares: ['g8', 'h8'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "Ne5, dxe5, Qg4. Every piece pointing at the king. The brilliancy comes next.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-6: THE Bxh6 BRILLIANCY + MATING SEQUENCE
// 14.Bxh6!! gxh6 15.Qg6 Nf8 16.Qxh6+ Kg8 17.Re4 Kf7 18.Rg4 Ng6 19.Qxg6+ Ke7 20.Qg7#
// Multi-stage puzzle.
// ═══════════════════════════════════════════════════════════

const WAB_6: OpeningLesson = {
  id: 'wab-6',
  title: 'The Bxh6 Brilliancy',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "Black's king on h8. Pawn on h6 defending g7, queen on g4 ready. Time for the move that breaks the kingside open. This brilliancy has only been played a SINGLE time in the entire Lichess database. Be the second.",
    },

    // ── TEACH 1: Bxh6!! ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "Same idea as the Caro-Kann main line: sacrifice the bishop on h6 to crack open the king.",
      highlightSquares: ['h6', 'g7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kh8,
      correctMove: 'Bxh6',
      prompt: "Sacrifice the bishop on h6.",
      hint: 'Bishop takes h6 — yes, the g-pawn recaptures. That is the point.',
      correctFeedback: "Bxh6!! The bishop sacrifice. Whether Black takes or refuses, the kingside collapses.",
      wrongFeedback: 'Play Bxh6 — sacrifice the bishop to open the king.',
      postMoveArrow: ['h6', 'g7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxh6,
      text: "Bxh6!! If gxh6, your queen swings to g6 and the king is doomed. If Black refuses, you're just up a pawn with a crushing attack.",
      arrow: ['h6', 'g7'],
    },

    // ── BLACK gxh6 ──
    {
      type: 'instruction',
      fen: FEN.after_gxh6,
      text: "gxh6. Black takes. The g-file is wide open and the king has no pawn shield.",
      autoAdvance: 800,
      highlightSquares: ['g7', 'h6'],
    },

    // ── TEACH 2: Qg6 ──
    {
      type: 'play-move',
      fen: FEN.after_gxh6,
      correctMove: 'Qg6',
      prompt: "Bring the queen to g6. Threaten mate.",
      hint: 'Qg6 — threatens Qh7# next move.',
      correctFeedback: "Qg6! Threatens Qh7 mate. Black has to plug h7.",
      wrongFeedback: 'Play Qg6 — set up the mate threat.',
      postMoveArrow: ['g6', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qg6,
      text: "Qg6 threatens Qh7#. Black's only defender is the rook — they have to play Nf8 to cover h7.",
      arrow: ['g6', 'h7'],
    },

    // ── BLACK Nf8 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf8,
      text: "Nf8. The knight covers h7. Mate is delayed — but only delayed.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'f8'],
    },

    // ── TEACH 3: Qxh6+ (start of the mating puzzle) ──
    {
      type: 'play-move',
      fen: FEN.after_Nf8,
      correctMove: 'Qxh6+',
      prompt: "Grab the free pawn — with check.",
      hint: 'Queen takes h6, check.',
      correctFeedback: "Qxh6+! Free pawn plus check. King has only one square.",
      wrongFeedback: 'Play Qxh6+ — capture with check.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxh6,
      text: "Qxh6+. King forced to g8 (Kxh6 is illegal — queen is defended? No — actually Black can't take, the king has to move). Only square: Kg8.",
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kg8b,
      text: "Kg8. Now we bring the rook in — rook lift time.",
      autoAdvance: 800,
      highlightSquares: ['h8', 'g8'],
    },

    // ── TEACH 4: Re4 (rook lift) ──
    {
      type: 'play-move',
      fen: FEN.after_Kg8b,
      correctMove: 'Re4',
      prompt: "Lift the rook into the attack. e1 to where?",
      hint: 'Re4 — sideways toward the g-file.',
      correctFeedback: "Re4! Rook lift. Next move it swings to g4 with check.",
      wrongFeedback: 'Play Re4 — the rook lifts up and across.',
      postMoveArrow: ['e4', 'g4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Re4,
      text: "Re4 prepares Rg4+. Black tries to escape with Kf7.",
      arrow: ['e4', 'g4'],
    },

    // ── BLACK Kf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Kf7,
      text: "Kf7. The king runs back to where it started. Doesn't help.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f7'],
    },

    // ── TEACH 5: Rg4 + finish (puzzle) ──
    {
      type: 'instruction',
      fen: FEN.after_Kf7,
      text: "Now find the finish — rook to g4, then mate. Three moves.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_Kf7,
      solutionMoves: ['Rg4', 'Ng6', 'Qxg6+', 'Ke7', 'Qg7#'],
      playerColor: 'white',
      prompt: "Mate in 3. Rg4 then chase the king.",
      hint: "Rg4 attacks the knight. Black blocks with Ng6. Then Qxg6+ and the king has to go to e7. Qg7 is mate.",
      correctFeedback: "Rg4, Qxg6+, Qg7# — mating sequence complete. The Bonjour delivered.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qg7,
      text: "Bxh6, Qg6, Qxh6+, Re4, Rg4, Qxg6+, Qg7#. Seven moves from the bishop sac to checkmate. The Bonjour at full power.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-dev-Nc6: DEVIATION — 7…Nc6 8.Bd3 Nxd4?? 9.Nxd4 Qxd4?? 10.Bg6+!! Kxg6 11.Qxd4
// Black grabs d4, gets deflected by Bg6+, loses the queen.
// ═══════════════════════════════════════════════════════════

const WAB_DEV_NC6: OpeningLesson = {
  id: 'wab-dev-Nc6',
  title: 'If Nc6',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Sometimes Black plays Nc6 instead of Nbd7 — and gets greedy with the d4 pawn. They lose their queen.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the sacrifice.",
    },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Ng5', prompt: 'Your move.', hint: 'Ng5.', correctFeedback: 'Ng5.', wrongFeedback: 'Ng5.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },

    // ── BLACK Nc6 ──
    {
      type: 'instruction',
      fen: FEN.nc6_after_Nc6,
      text: "Black plays Nc6 instead of Nbd7 — hitting your d4 pawn. This has been played in over 100 Lichess games at this position.",
      highlightSquares: ['b8', 'c6'],
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.nc6_after_Nc6,
      correctMove: 'Bd3',
      prompt: "Don't worry about d4. Develop the bishop.",
      hint: 'Bishop to d3 — same plan as the main line.',
      correctFeedback: "Bd3. You're inviting Black to take d4. If they do — they walk into a trap.",
      wrongFeedback: 'Play Bd3 — develop the bishop and dare Black to grab d4.',
      postMoveArrow: ['d3', 'h7'],
    },
    {
      type: 'instruction',
      fen: FEN.nc6_after_Bd3,
      text: "Bd3 looks calm. The bait: if Black plays Nxd4??, you've got a deflection trick.",
      highlightSquares: ['d4', 'c6'],
    },

    // ── BLACK Nxd4?? ──
    {
      type: 'instruction',
      fen: FEN.nc6_after_Nxd4,
      text: "Nxd4?? Greedy. This move has been played in 100+ games and gives White a 58% winrate. Why? You're about to find out.",
      autoAdvance: 800,
      highlightSquares: ['c6', 'd4'],
    },

    // ── TEACH 2: Nxd4 ──
    {
      type: 'play-move',
      fen: FEN.nc6_after_Nxd4,
      correctMove: 'Nxd4',
      prompt: "Trade knights. What captures on d4?",
      hint: 'Your Nf3 takes the knight on d4.',
      correctFeedback: "Nxd4. Even trade. If Black recaptures with the queen — they walk into the trap.",
      wrongFeedback: 'Play Nxd4 — recapture with the knight.',
    },
    {
      type: 'instruction',
      fen: FEN.nc6_after_NxNd4,
      text: "Nxd4. The pin: if Black plays Qxd4 to win the knight, look what happens to the king on f7.",
      highlightSquares: ['d4', 'f7', 'g6'],
    },

    // ── BLACK Qxd4?? ──
    {
      type: 'instruction',
      fen: FEN.nc6_after_Qxd4,
      text: "Qxd4?? Black grabs the knight. They forgot the king is on f7. Find the brilliant move.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'd4'],
    },

    // ── TEACH 3: Bg6+!! ──
    {
      type: 'play-move',
      fen: FEN.nc6_after_Qxd4,
      correctMove: 'Bg6+',
      prompt: "Brilliant deflection. Where does the bishop go?",
      hint: 'Bishop sacrifices on g6, checking the king.',
      correctFeedback: "Bg6+!! The bishop sacrifice. King has to take — and now the queen on d4 is hanging.",
      wrongFeedback: 'Play Bg6+ — sacrifice the bishop to deflect the king from defending the queen.',
      postMoveArrow: ['g6', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.nc6_after_Bg6,
      text: "Bg6+!! Black has to take with the king (the f-pawn is gone — that's the whole point of f7 being open).",
      arrow: ['g6', 'f7'],
    },

    // ── BLACK Kxg6 ──
    {
      type: 'instruction',
      fen: FEN.nc6_after_Kxg6,
      text: "Kxg6. King grabs the bishop. The queen on d4 is now defenseless.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g6'],
    },

    // ── TEACH 4: Qxd4 ──
    {
      type: 'play-move',
      fen: FEN.nc6_after_Kxg6,
      correctMove: 'Qxd4',
      prompt: "Take the queen.",
      hint: 'Your queen captures d4.',
      correctFeedback: "Qxd4! You're up a queen for a bishop. Game over.",
      wrongFeedback: 'Play Qxd4 — grab the queen.',
    },
    {
      type: 'instruction',
      fen: FEN.nc6_after_QxQd4,
      text: "Queen for bishop. From down a knight, you're now up massive material with the king still exposed.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.nc6_after_Nc6,
      text: "Black played Nc6. Punish the queen grab.",
    },
    {
      type: 'play-move',
      fen: FEN.nc6_after_Nc6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },
    { type: 'instruction', fen: FEN.nc6_after_Nxd4, text: 'Nxd4??', autoAdvance: 800, highlightSquares: ['c6', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.nc6_after_Nxd4,
      correctMove: 'Nxd4',
      prompt: 'Your move.',
      hint: 'Nxd4.',
      correctFeedback: 'Nxd4.',
      wrongFeedback: 'Nxd4.',
    },
    { type: 'instruction', fen: FEN.nc6_after_Qxd4, text: 'Qxd4??', autoAdvance: 800, highlightSquares: ['d8', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.nc6_after_Qxd4,
      correctMove: 'Bg6+',
      prompt: 'Your move.',
      hint: 'Bg6+.',
      correctFeedback: 'Bg6+ — the deflection.',
      wrongFeedback: 'Bg6+.',
    },
    { type: 'instruction', fen: FEN.nc6_after_Bg6, text: 'Kxg6.', autoAdvance: 800, highlightSquares: ['f7', 'g6'] },
    {
      type: 'play-move',
      fen: FEN.nc6_after_Kxg6,
      correctMove: 'Qxd4',
      prompt: 'Your move.',
      hint: 'Qxd4.',
      correctFeedback: 'Qxd4 — queen wins.',
      wrongFeedback: 'Qxd4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.nc6_after_QxQd4,
      text: "Bd3, Nxd4, Bg6+, Qxd4. Black got greedy and walked into a queen-winning trick.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-dev-c5: DEVIATION — 7…c5 8.Ne5+ Kg8 9.Bd3
// The actual top engine move. c5 hits d4 and frees the queen.
// We play Ne5+ to tuck the king on g8 and Bd3 to keep developing.
// ═══════════════════════════════════════════════════════════

const WAB_DEV_C5: OpeningLesson = {
  id: 'wab-dev-c5',
  title: 'If c5',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "c5 is the engine's top move — the actual refutation. Black hits d4 and prepares to trade queens. We play for tempo and development.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay to the sacrifice.",
    },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
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
      text: "Black plays 7…c5 — the engine's top move. It attacks d4 and threatens to free the queen with cxd4 followed by Qa5+.",
      highlightSquares: ['c7', 'c5', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.c5_after_c5,
      text: "Honest moment: this is the best move for Black. Engine eval drops to around -1. We're playing for practical chances, not engine perfection.",
    },

    // ── TEACH 1: Ne5+ ──
    {
      type: 'play-move',
      fen: FEN.c5_after_c5,
      correctMove: 'Ne5+',
      prompt: "Check the king first — push it to the corner before they free the queen.",
      hint: 'Knight to e5 with check.',
      correctFeedback: "Ne5+! Check forces Black's king to g8 (away from the queen-freeing tactics).",
      wrongFeedback: 'Play Ne5+ — check the king to gain tempo.',
      postMoveArrow: ['e5', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.c5_after_Ne5,
      text: "Ne5+. Black has to move the king — Kg8 tucks it in the corner.",
      arrow: ['e5', 'f7'],
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Kg8,
      text: "Kg8. King goes to the corner. We keep developing.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 2: Bd3 ──
    {
      type: 'play-move',
      fen: FEN.c5_after_Kg8,
      correctMove: 'Bd3',
      prompt: "Develop. Where does the bishop go?",
      hint: 'Bd3 — same diagonal, same plan.',
      correctFeedback: "Bd3. You're still down material, but you have the bishop pair, an exposed king, and Black hasn't developed anything but pawns.",
      wrongFeedback: 'Play Bd3 — keep developing for the attack.',
    },
    {
      type: 'instruction',
      fen: FEN.c5_after_Bd3,
      text: "Bd3. Eval is around -1, but practical chances are real. Black has to find every defensive move; you just need to keep attacking.",
      arrow: ['d3', 'h7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.c5_after_c5,
      text: "Black played c5. Show the defense.",
    },
    {
      type: 'play-move',
      fen: FEN.c5_after_c5,
      correctMove: 'Ne5+',
      prompt: 'Your move.',
      hint: 'Ne5+.',
      correctFeedback: 'Ne5+.',
      wrongFeedback: 'Ne5+.',
    },
    { type: 'instruction', fen: FEN.c5_after_Ne5, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    {
      type: 'play-move',
      fen: FEN.c5_after_Kg8,
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
      text: "Ne5+, Bd3. c5 is the refutation — but the position is still messy, and Black has to defend perfectly. Play on.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wab-test-1: LEVEL 1 TEST
// Play the full Bonjour main line + both deviations from memory.
// ═══════════════════════════════════════════════════════════

const WAB_TEST_1: OpeningLesson = {
  id: 'wab-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the full Bonjour Variation — main line and both deviations from memory.",
    },

    // ── MAIN LINE ──
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.after_e6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
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
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['f8', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'Re8.', autoAdvance: 800, highlightSquares: ['h8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Re8, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.after_Kg8, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Bxe5, text: 'Bxe5.', autoAdvance: 800, highlightSquares: ['d6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Bxe5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Qg4', prompt: 'Your move.', hint: 'Qg4.', correctFeedback: 'Qg4.', wrongFeedback: 'Qg4.' },
    { type: 'instruction', fen: FEN.after_Qg4, text: 'Kh8.', autoAdvance: 800, highlightSquares: ['g8', 'h8'] },
    { type: 'play-move', fen: FEN.after_Kh8, correctMove: 'Bxh6', prompt: 'Your move.', hint: 'Bxh6.', correctFeedback: 'Bxh6.', wrongFeedback: 'Bxh6.' },
    { type: 'instruction', fen: FEN.after_Bxh6, text: 'gxh6.', autoAdvance: 800, highlightSquares: ['g7', 'h6'] },
    {
      type: 'puzzle',
      fen: FEN.after_gxh6,
      solutionMoves: ['Qg6', 'Nf8', 'Qxh6+', 'Kg8', 'Re4', 'Kf7', 'Rg4', 'Ng6', 'Qxg6+', 'Ke7', 'Qg7#'],
      playerColor: 'white',
      prompt: 'Find the mating sequence.',
      hint: 'Qg6 → Qxh6+ → Re4 → Rg4 → Qxg6+ → Qg7#.',
      correctFeedback: 'Mating sequence complete.',
    },

    // ── DEV 1: Nc6 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 1: Black plays Nc6.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.nc6_after_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.nc6_after_Nc6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.nc6_after_Nxd4, text: 'Nxd4??', autoAdvance: 800, highlightSquares: ['c6', 'd4'] },
    { type: 'play-move', fen: FEN.nc6_after_Nxd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.nc6_after_Qxd4, text: 'Qxd4??', autoAdvance: 800, highlightSquares: ['d8', 'd4'] },
    { type: 'play-move', fen: FEN.nc6_after_Qxd4, correctMove: 'Bg6+', prompt: 'Your move.', hint: 'Bg6+.', correctFeedback: 'Bg6+.', wrongFeedback: 'Bg6+.' },
    { type: 'instruction', fen: FEN.nc6_after_Bg6, text: 'Kxg6.', autoAdvance: 800, highlightSquares: ['f7', 'g6'] },
    { type: 'play-move', fen: FEN.nc6_after_Kxg6, correctMove: 'Qxd4', prompt: 'Your move.', hint: 'Qxd4.', correctFeedback: 'Qxd4 — queen wins.', wrongFeedback: 'Qxd4.' },

    // ── DEV 2: c5 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: "Deviation 2: Black plays c5 — the refutation.", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.c5_after_c5, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.c5_after_c5, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.c5_after_Ne5, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.c5_after_Kg8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.c5_after_Bd3,
      text: "Test complete. You know the Bonjour — main line, two deviations, and the mating sequence. Three Alien Gambits down. Bonjour, mes amis.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const WITTY_ALIEN_BONJOUR_LESSONS: Record<string, OpeningLesson> = {
  'wab-1': WAB_1,
  'wab-2': WAB_2,
  'wab-3': WAB_3,
  'wab-4': WAB_4,
  'wab-5': WAB_5,
  'wab-6': WAB_6,
  'wab-dev-Nc6': WAB_DEV_NC6,
  'wab-dev-c5': WAB_DEV_C5,
  'wab-test-1': WAB_TEST_1,
}

export function getWittyAlienBonjourLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_BONJOUR_LESSONS[id]
}
