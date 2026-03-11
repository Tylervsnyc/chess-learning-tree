import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// ITALIAN GAME LESSONS (it-1 through it-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6
//            6.O-O O-O 7.Re1 a5 8.h3 h6 9.Nbd2 Be6
//            10.Bb5 Qb8 11.Nf1 Qa7 12.Be3
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:   'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:   'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bc4:   'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_Bc5:   'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  after_c3:    'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4',
  after_Nf6:   'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5',
  after_d3:    'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R b KQkq - 0 5',
  after_d6:    'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6',
  after_OO_w:  'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b kq - 1 6',
  after_OO_b:  'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7',
  after_Re1:   'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 b - - 3 7',
  after_a5:    'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8',
  after_h3:    'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 b - - 0 8',
  after_h6:    'r1bq1rk1/1pp2pp1/2np1n1p/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 w - - 0 9',
  after_Nbd2:  'r1bq1rk1/1pp2pp1/2np1n1p/p1b1p3/2B1P3/2PP1N1P/PP1N1PP1/R1BQR1K1 b - - 1 9',
  after_Be6:   'r2q1rk1/1pp2pp1/2npbn1p/p1b1p3/2B1P3/2PP1N1P/PP1N1PP1/R1BQR1K1 w - - 2 10',
  after_Bb5:   'r2q1rk1/1pp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP1N1PP1/R1BQR1K1 b - - 3 10',
  after_Qb8:   'rq3rk1/1pp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP1N1PP1/R1BQR1K1 w - - 4 11',
  after_Nf1:   'rq3rk1/1pp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP3PP1/R1BQRNK1 b - - 5 11',
  after_Qa7:   'r4rk1/qpp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP3PP1/R1BQRNK1 w - - 6 12',
  after_Be3:   'r4rk1/qpp2pp1/2npbn1p/pBb1p3/4P3/2PPBN1P/PP3PP1/R2QRNK1 b - - 7 12',

  // Deviation: 3...Be7 4.d4 d6 5.dxe5 dxe5 6.Qxd8+ Bxd8 7.Nc3
  dev_after_Be7:    'r1bqk1nr/ppppbppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  dev_after_d4:     'r1bqk1nr/ppppbppp/2n5/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
  dev_after_d6:     'r1bqk1nr/ppp1bppp/2np4/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  dev_after_dxe5:   'r1bqk1nr/ppp1bppp/2np4/4P3/2B1P3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 5',
  dev_after_dxe5_b: 'r1bqk1nr/ppp1bppp/2n5/4p3/2B1P3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 6',
  dev_after_Qxd8:   'r1bQk1nr/ppp1bppp/2n5/4p3/2B1P3/5N2/PPP2PPP/RNB1K2R b KQkq - 0 6',
  dev_after_Bxd8:   'r1bbk1nr/ppp2ppp/2n5/4p3/2B1P3/5N2/PPP2PPP/RNB1K2R w KQkq - 0 7',
  dev_after_Nc3:    'r1bbk1nr/ppp2ppp/2n5/4p3/2B1P3/2N2N2/PPP2PPP/R1B1K2R b KQkq - 1 7',
}


// ═══════════════════════════════════════════════════════════
// it-1: THE ITALIAN SETUP (1.e4 e5 2.Nf3 Nc6 3.Bc4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const IT_1: OpeningLesson = {
  id: 'it-1',
  title: 'The Italian Setup',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Italian Game — classic chess. You develop fast, aim at f7, and set up a strong center. Let's go.",
    },

    // ── PREDICT/REVEAL 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Open the game. What's your first move?",
      hint: 'Push the king pawn two squares.',
      correctFeedback: 'e4 controls the center and opens lines for your bishop and queen.',
      wrongFeedback: 'Play e4 — grab the center.',
      postMoveArrow: [['e4', 'd5'], ['e4', 'f5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "e4 is the starting point of the Italian. You control d5 and f5, and your bishop is free.",
      arrow: ['e2', 'e4'],
    },

    // ── PREDICT/REVEAL 2: Nf3 ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Black matches you with e5.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Black played e5. Develop a piece and attack it.",
      hint: 'Bring the knight out — it attacks e5.',
      correctFeedback: 'Nf3 develops with tempo, attacking the e5 pawn immediately.',
      wrongFeedback: 'Play Nf3 — develop and attack e5.',
      postMoveArrow: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Nf3 develops the knight and puts pressure on e5. Black has to defend.",
      arrow: ['g1', 'f3'],
    },

    // ── PREDICT/REVEAL 3: Bc4 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Black defends with Nc6.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: "Your knight is out. Now develop the bishop — where does it belong?",
      hint: "Aim the bishop at Black's weakest point: f7.",
      correctFeedback: "Bc4! The bishop stares down f7 — the weakest square in Black's position.",
      wrongFeedback: 'Play Bc4 — point the bishop at f7.',
      postMoveArrow: ['c4', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Bc4 is the Italian move. The bishop aims at f7, which is only defended by the king. Dangerous.",
      arrow: ['f1', 'c4'],
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
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: 'Nc6.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "That's the Italian setup — e4, Nf3, Bc4. Two pieces out, bishop aimed at f7. Now we build.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// it-2: GIUOCO PIANO (3...Bc5 4.c3 Nf6 5.d3 d6 6.O-O)
// Teaches: c3, d3, O-O
// ═══════════════════════════════════════════════════════════

const IT_2: OpeningLesson = {
  id: 'it-2',
  title: 'Giuoco Piano',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Black mirrors you with Bc5. Time to build a fortress in the center and castle to safety.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me the Italian setup first.",
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
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: 'Nc6.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },

    // ── PREDICT/REVEAL 1: c3 ──
    {
      type: 'instruction',
      fen: FEN.after_Bc5,
      text: "Black develops Bc5, mirroring your Italian bishop.",
      autoAdvance: 800,
      highlightSquares: ['f8', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc5,
      correctMove: 'c3',
      prompt: "You need to prepare d4 to control the center. How?",
      hint: 'Support d4 with a pawn move.',
      correctFeedback: 'c3 prepares the powerful d4 push. Slow and steady wins the center.',
      wrongFeedback: 'Play c3 — it supports d4 later.',
      postMoveArrow: ['c3', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "c3 is the Giuoco Piano move. It prepares d4 with full pawn support. Quiet but strong.",
      arrow: ['c2', 'c3'],
    },

    // ── PREDICT/REVEAL 2: d3 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Black develops the knight to f6.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'd3',
      prompt: "You want a solid center. What pawn move keeps things flexible?",
      hint: 'Push d3 — solid and supports e4.',
      correctFeedback: 'd3 supports e4 and opens the diagonal for your bishop on c1.',
      wrongFeedback: 'Play d3 — solid center, bishop gets free.',
      postMoveArrow: ['d3', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d3,
      text: "d3 is modern and solid. It holds e4, frees the c1 bishop, and keeps your options open.",
      arrow: ['d2', 'd3'],
    },

    // ── PREDICT/REVEAL 3: O-O ──
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Black plays d6, supporting the center.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'O-O',
      prompt: "Your pieces are developed. What should you do before the fight starts?",
      hint: 'Get your king to safety.',
      correctFeedback: "Castle! King is safe on g1, and the rook comes to f1 where it's useful.",
      wrongFeedback: 'Castle kingside — safety first.',
      postMoveArrow: ['f1', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "Castling tucks the king away and activates the rook. You're fully developed and ready.",
      arrow: ['e1', 'g1'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Prove you remember the Giuoco Piano moves.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc5,
      text: 'Bc5.',
      autoAdvance: 800,
      highlightSquares: ['f8', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc5,
      correctMove: 'c3',
      prompt: 'Your move.',
      hint: 'c3.',
      correctFeedback: 'c3.',
      wrongFeedback: 'c3.',
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
      correctMove: 'd3',
      prompt: 'Your move.',
      hint: 'd3.',
      correctFeedback: 'd3.',
      wrongFeedback: 'd3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: 'd6.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "c3, d3, O-O. Solid center, king is safe. The Giuoco Piano is all about patience.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// it-3: THE BUILDUP (7.Re1 a5 8.h3 h6 9.Nbd2)
// Teaches: Re1, h3, Nbd2
// ═══════════════════════════════════════════════════════════

const IT_3: OpeningLesson = {
  id: 'it-3',
  title: 'The Buildup',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Both sides are castled. Now you quietly improve your pieces before any big action.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Quick review — play the Giuoco Piano moves.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Bc5,
      text: 'Bc5.',
      autoAdvance: 800,
      highlightSquares: ['f8', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc5,
      correctMove: 'c3',
      prompt: 'Your move.',
      hint: 'c3.',
      correctFeedback: 'c3.',
      wrongFeedback: 'c3.',
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
      correctMove: 'd3',
      prompt: 'Your move.',
      hint: 'd3.',
      correctFeedback: 'd3.',
      wrongFeedback: 'd3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: 'd6.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── PREDICT/REVEAL 1: Re1 ──
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Black castles too.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'Re1',
      prompt: "Both kings are safe. Where does the rook belong?",
      hint: 'Put the rook on a central file — it supports e4.',
      correctFeedback: "Re1 reinforces e4 and puts the rook on the open e-file. It'll be powerful later.",
      wrongFeedback: 'Play Re1 — the rook belongs on the e-file.',
      postMoveArrow: ['e1', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Re1,
      text: "Re1 is a natural move. The rook supports e4 and eyes the e-file. Always useful.",
      arrow: ['f1', 'e1'],
    },

    // ── PREDICT/REVEAL 2: h3 ──
    {
      type: 'instruction',
      fen: FEN.after_a5,
      text: "Black plays a5, expanding on the queenside.",
      autoAdvance: 800,
      highlightSquares: ['a7', 'a5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a5,
      correctMove: 'h3',
      prompt: "Black is pushing on the queenside. What useful prophylactic move prevents Bg4?",
      hint: 'A small pawn move to stop the pin on your knight.',
      correctFeedback: "h3 prevents Bg4, which would pin your knight to the queen. Small move, big impact.",
      wrongFeedback: 'Play h3 — stop the Bg4 pin before it happens.',
      postMoveArrow: ['h3', 'g4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_h3,
      text: "h3 is prophylaxis. It prevents Bg4 forever and gives your king a luft. Grandmasters love this move.",
      arrow: ['h2', 'h3'],
    },

    // ── PREDICT/REVEAL 3: Nbd2 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Black plays h6, mirroring your prophylaxis.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nbd2',
      prompt: "Your last undeveloped piece is the b1 knight. Where does it go?",
      hint: 'Develop it to d2 — it supports e4 and can reroute to f1.',
      correctFeedback: "Nbd2 develops the last piece. From d2 the knight can go to f1, then g3 or e3.",
      wrongFeedback: 'Play Nbd2 — get every piece in the game.',
      postMoveArrow: ['d2', 'f1'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "Nbd2 completes your development. The knight supports e4 and can reroute to f1-g3 for a kingside buildup.",
      arrow: ['b1', 'd2'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Play all three buildup moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'Re1',
      prompt: 'Your move.',
      hint: 'Re1.',
      correctFeedback: 'Re1.',
      wrongFeedback: 'Re1.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a5,
      text: 'a5.',
      autoAdvance: 800,
      highlightSquares: ['a7', 'a5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a5,
      correctMove: 'h3',
      prompt: 'Your move.',
      hint: 'h3.',
      correctFeedback: 'h3.',
      wrongFeedback: 'h3.',
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
      correctMove: 'Nbd2',
      prompt: 'Your move.',
      hint: 'Nbd2.',
      correctFeedback: 'Nbd2.',
      wrongFeedback: 'Nbd2.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "Re1, h3, Nbd2. Every piece is developed and your position is rock solid. Time to form a plan.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// it-4: THE PLAN (10.Bb5 Qb8 11.Nf1 Qa7 12.Be3)
// Teaches: Bb5, Nf1, Be3
// ═══════════════════════════════════════════════════════════

const IT_4: OpeningLesson = {
  id: 'it-4',
  title: 'The Plan',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "All your pieces are out. Now regroup — relocate the bishop and reroute the knight for action.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Let's replay the buildup.",
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'Re1',
      prompt: 'Your move.',
      hint: 'Re1.',
      correctFeedback: 'Re1.',
      wrongFeedback: 'Re1.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a5,
      text: 'a5.',
      autoAdvance: 800,
      highlightSquares: ['a7', 'a5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a5,
      correctMove: 'h3',
      prompt: 'Your move.',
      hint: 'h3.',
      correctFeedback: 'h3.',
      wrongFeedback: 'h3.',
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
      correctMove: 'Nbd2',
      prompt: 'Your move.',
      hint: 'Nbd2.',
      correctFeedback: 'Nbd2.',
      wrongFeedback: 'Nbd2.',
    },

    // ── PREDICT/REVEAL 1: Bb5 ──
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "Black develops the bishop to e6, challenging your Bc4.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be6,
      correctMove: 'Bb5',
      prompt: "Black's bishop challenges yours on c4. Where does the bishop relocate?",
      hint: 'Step the bishop to b5 — it stays active and eyes c6.',
      correctFeedback: "Bb5 sidesteps the exchange and keeps the bishop active. It pins Nc6 to the king.",
      wrongFeedback: 'Play Bb5 — relocate and stay active.',
      postMoveArrow: ['b5', 'c6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb5,
      text: "Bb5 avoids the trade and puts pressure on Nc6. The bishop found a better diagonal.",
      arrow: ['c4', 'b5'],
    },

    // ── PREDICT/REVEAL 2: Nf1 ──
    {
      type: 'instruction',
      fen: FEN.after_Qb8,
      text: "Black plays Qb8, preparing to reposition the queen.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'b8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qb8,
      correctMove: 'Nf1',
      prompt: "Your knight on d2 needs a better post. Where does it reroute?",
      hint: 'The knight heads to f1, then g3 or e3.',
      correctFeedback: "Nf1! The knight is heading to g3 or e3 — both are excellent squares.",
      wrongFeedback: 'Play Nf1 — reroute the knight toward the kingside.',
      postMoveArrow: ['f1', 'g3'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf1,
      text: "Nf1 is a classic Italian maneuver. The knight clears d2 and will jump to g3 or e3 next.",
      arrow: ['d2', 'f1'],
    },

    // ── PREDICT/REVEAL 3: Be3 ──
    {
      type: 'instruction',
      fen: FEN.after_Qa7,
      text: "Black repositions the queen to a7.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'a7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qa7,
      correctMove: 'Be3',
      prompt: "Your dark-squared bishop is still on c1. Where does it go?",
      hint: 'Develop it to e3 — it controls d4 and eyes the kingside.',
      correctFeedback: "Be3 develops the last inactive piece. It controls d4 and supports a potential d4 push.",
      wrongFeedback: 'Play Be3 — activate the last piece.',
      postMoveArrow: ['e3', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "Be3 completes the regrouping. Every piece is on an ideal square. You're ready for anything.",
      arrow: ['c1', 'e3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "Play all three regrouping moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: 'Be6.',
      autoAdvance: 800,
      highlightSquares: ['c8', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be6,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qb8,
      text: 'Qb8.',
      autoAdvance: 800,
      highlightSquares: ['d8', 'b8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qb8,
      correctMove: 'Nf1',
      prompt: 'Your move.',
      hint: 'Nf1.',
      correctFeedback: 'Nf1.',
      wrongFeedback: 'Nf1.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qa7,
      text: 'Qa7.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'a7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qa7,
      correctMove: 'Be3',
      prompt: 'Your move.',
      hint: 'Be3.',
      correctFeedback: 'Be3.',
      wrongFeedback: 'Be3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "Bb5, Nf1, Be3. Every piece regrouped to its best square. That's the full Italian plan.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// it-dev-Be7: DEVIATION — Black plays 3...Be7 (instead of 3...Bc5)
// Teaches: d4, dxe5, Nc3 (with Qxd8+ as auto-advance intermediate)
// ═══════════════════════════════════════════════════════════

const IT_DEV_BE7: OpeningLesson = {
  id: 'it-dev-Be7',
  title: 'If Be7',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Sometimes Black plays the passive Be7 instead of Bc5. You punish it by grabbing the center and simplifying.",
    },

    // ── RECAP (replay moves up to deviation point: e4, Nf3, Bc4) ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "First, the Italian setup.",
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
      fen: FEN.after_e5,
      text: 'e5.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: 'Nc6.',
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_after_Be7,
      text: "Black plays 3...Be7 instead of Bc5. A passive move — the bishop blocks nothing and doesn't fight for the center.",
      highlightSquares: ['f8', 'e7'],
    },

    // ── PREDICT/REVEAL 1: d4 ──
    {
      type: 'play-move',
      fen: FEN.dev_after_Be7,
      correctMove: 'd4',
      prompt: "Black's bishop is passive on e7. How do you seize the center?",
      hint: 'Push d4 — grab space while Black is slow.',
      correctFeedback: "d4! With the bishop on e7 instead of c5, there's nothing stopping you from dominating the center.",
      wrongFeedback: 'Play d4 — take over the center.',
      postMoveArrow: [['d4', 'e5'], ['d4', 'c5']],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_d4,
      text: "d4 gives you a massive center. Black's Be7 doesn't pressure d4 like Bc5 would.",
      arrow: ['d2', 'd4'],
    },

    // ── PREDICT/REVEAL 2: dxe5 ──
    {
      type: 'instruction',
      fen: FEN.dev_after_d6,
      text: "Black plays d6, defending e5.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_after_d6,
      correctMove: 'dxe5',
      prompt: "Black defended e5 with d6. How do you open the position?",
      hint: 'Capture on e5 — open lines while you have better development.',
      correctFeedback: "dxe5 opens the d-file and forces Black to recapture, leading to a queen trade.",
      wrongFeedback: 'Play dxe5 — open the position in your favor.',
      postMoveArrow: ['e5', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_dxe5,
      text: "dxe5 opens things up. After Black recaptures, the queens come off and you have a better endgame.",
      arrow: ['d4', 'e5'],
    },

    // ── Auto-advance intermediate moves: ...dxe5, Qxd8+, ...Bxd8 ──
    {
      type: 'instruction',
      fen: FEN.dev_after_dxe5_b,
      text: 'dxe5.',
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_Qxd8,
      text: "Qxd8+ — the queens come off the board. This is forced.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd8'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_Bxd8,
      text: 'Bxd8.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'd8'],
    },

    // ── PREDICT/REVEAL 3: Nc3 ──
    {
      type: 'play-move',
      fen: FEN.dev_after_Bxd8,
      correctMove: 'Nc3',
      prompt: "The queens are off. How do you develop with an advantage?",
      hint: 'Develop the knight — control the center.',
      correctFeedback: "Nc3 develops with tempo. You have better pieces, more space, and Black's bishop is stuck on d8.",
      wrongFeedback: 'Play Nc3 — develop and dominate.',
      postMoveArrow: ['c3', 'd5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_Nc3,
      text: "Nc3 gives you a dream position. Full development, strong center, and Black's bishop is miserable on d8.",
      arrow: ['b1', 'c3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_after_Be7,
      text: "Black played Be7. Show me the punishment.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_after_Be7,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_d6,
      text: 'd6.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_after_d6,
      correctMove: 'dxe5',
      prompt: 'Your move.',
      hint: 'dxe5.',
      correctFeedback: 'dxe5.',
      wrongFeedback: 'dxe5.',
    },
    // Auto-advance: ...dxe5, Qxd8+, ...Bxd8
    {
      type: 'instruction',
      fen: FEN.dev_after_dxe5_b,
      text: 'dxe5.',
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_Qxd8,
      text: 'Qxd8+.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd8'],
    },
    {
      type: 'instruction',
      fen: FEN.dev_after_Bxd8,
      text: 'Bxd8.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'd8'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_after_Bxd8,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_after_Nc3,
      text: "d4, dxe5, Nc3. When Black plays the passive Be7, you grab the center and simplify into a winning endgame.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// it-test-1: LEVEL 1 TEST
// Tests main line + deviation. Zero guidance.
// ═══════════════════════════════════════════════════════════

const IT_TEST_1: OpeningLesson = {
  id: 'it-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the full Italian Game from memory. Main line first, then the deviation.",
    },
    // Lesson 1: e4, Nf3, Bc4
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // Lesson 2: c3, d3, O-O
    { type: 'instruction', fen: FEN.after_Bc5, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // Lesson 3: Re1, h3, Nbd2
    { type: 'instruction', fen: FEN.after_OO_b, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_a5, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // Lesson 4: Bb5, Nf1, Be3
    { type: 'instruction', fen: FEN.after_Be6, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },
    { type: 'instruction', fen: FEN.after_Qb8, text: 'Qb8.', autoAdvance: 800, highlightSquares: ['d8', 'b8'] },
    { type: 'play-move', fen: FEN.after_Qb8, correctMove: 'Nf1', prompt: 'Your move.', hint: 'Nf1.', correctFeedback: 'Nf1.', wrongFeedback: 'Nf1.' },
    { type: 'instruction', fen: FEN.after_Qa7, text: 'Qa7.', autoAdvance: 800, highlightSquares: ['b8', 'a7'] },
    { type: 'play-move', fen: FEN.after_Qa7, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },

    // ── DEVIATION: 3...Be7 ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Main line done. Now handle the deviation.",
    },
    { type: 'instruction', fen: FEN.dev_after_Be7, text: 'Black plays 3...Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.dev_after_Be7, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_after_d6, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.dev_after_d6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.dev_after_dxe5_b, text: 'dxe5.', autoAdvance: 800, highlightSquares: ['d6', 'e5'] },
    { type: 'instruction', fen: FEN.dev_after_Qxd8, text: 'Qxd8+.', autoAdvance: 800, highlightSquares: ['d1', 'd8'] },
    { type: 'instruction', fen: FEN.dev_after_Bxd8, text: 'Bxd8.', autoAdvance: 800, highlightSquares: ['e7', 'd8'] },
    { type: 'play-move', fen: FEN.dev_after_Bxd8, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const ITALIAN_LESSONS: Record<string, OpeningLesson> = {
  'it-1': IT_1,
  'it-2': IT_2,
  'it-3': IT_3,
  'it-4': IT_4,
  'it-dev-Be7': IT_DEV_BE7,
  'it-test-1': IT_TEST_1,
}

export function getItalianLesson(id: string): OpeningLesson | undefined {
  return ITALIAN_LESSONS[id]
}
