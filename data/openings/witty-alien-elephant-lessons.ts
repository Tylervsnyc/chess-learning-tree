import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — ELEPHANT GAMBIT LESSONS (we-1 through we-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// Built from Witty_Alien's real chess.com games (2026, 1,024 Elephant Gambit
// games, 74% win rate). Voice leans INTO the meme — "the gambit where you
// ignore the pawn and kick the knight instead." Frequency data is the honesty
// anchor: when Witty's win rate drops (3.Nxe5 = 67%), say so.
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// ⚠️  CHUNKING RULE: EVERY main lesson teaches EXACTLY 3 black moves.
//
// Main line: 1.e4 e5 2.Nf3 d5! (Elephant Gambit) 3.exd5 e4! (Paulsen Countergambit)
//            4.Qe2 Nf6 5.d3 Qxd5! 6.Nbd2 Be7 7.dxe4 Nxe4 8.Nxe4 O-O
//            9.Nc3 Nc6 10.Qd3 Re8 11.Be2 Bg4 12.O-O Qe6
//            13.h3 Bh5 14.Nd5 Qd6 15.Nxe7+ Rxe7
//
// FENs computed with chess.js from move sequences (verified via scripts/_gen-elephant-fens.mjs).
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:           'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:        'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:       'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_d5:        'rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',   // 2...d5!
  after_exd5:      'rnbqkbnr/ppp2ppp/8/3Pp3/8/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 3',     // 3.exd5
  after_e4b:       'rnbqkbnr/ppp2ppp/8/3P4/4p3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4',   // 3...e4!
  after_Qe2:       'rnbqkbnr/ppp2ppp/8/3P4/4p3/5N2/PPPPQPPP/RNB1KB1R b KQkq - 1 4',   // 4.Qe2
  after_Nf6:       'rnbqkb1r/ppp2ppp/5n2/3P4/4p3/5N2/PPPPQPPP/RNB1KB1R w KQkq - 2 5', // 4...Nf6
  after_d3:        'rnbqkb1r/ppp2ppp/5n2/3P4/4p3/3P1N2/PPP1QPPP/RNB1KB1R b KQkq - 0 5', // 5.d3
  after_Qxd5:      'rnb1kb1r/ppp2ppp/5n2/3q4/4p3/3P1N2/PPP1QPPP/RNB1KB1R w KQkq - 0 6', // 5...Qxd5!
  after_Nbd2:      'rnb1kb1r/ppp2ppp/5n2/3q4/4p3/3P1N2/PPPNQPPP/R1B1KB1R b KQkq - 1 6', // 6.Nbd2
  after_Be7:       'rnb1k2r/ppp1bppp/5n2/3q4/4p3/3P1N2/PPPNQPPP/R1B1KB1R w KQkq - 2 7', // 6...Be7
  after_dxe4:      'rnb1k2r/ppp1bppp/5n2/3q4/4P3/5N2/PPPNQPPP/R1B1KB1R b KQkq - 0 7', // 7.dxe4
  after_Nxe4:      'rnb1k2r/ppp1bppp/8/3q4/4n3/5N2/PPPNQPPP/R1B1KB1R w KQkq - 0 8',  // 7...Nxe4
  after_NxNe4:     'rnb1k2r/ppp1bppp/8/3q4/4N3/5N2/PPP1QPPP/R1B1KB1R b KQkq - 0 8',  // 8.Nxe4
  after_OO:        'rnb2rk1/ppp1bppp/8/3q4/4N3/5N2/PPP1QPPP/R1B1KB1R w KQ - 1 9',    // 8...O-O
  after_Nc3:       'rnb2rk1/ppp1bppp/8/3q4/8/2N2N2/PPP1QPPP/R1B1KB1R b KQ - 2 9',    // 9.Nc3
  after_Nc6:       'r1b2rk1/ppp1bppp/2n5/3q4/8/2N2N2/PPP1QPPP/R1B1KB1R w KQ - 3 10', // 9...Nc6
  // we-4 positions
  after_Qd3:       'r1b2rk1/ppp1bppp/2n5/3q4/8/2NQ1N2/PPP2PPP/R1B1KB1R b KQ - 4 10', // 10.Qd3
  after_Re8:       'r1b1r1k1/ppp1bppp/2n5/3q4/8/2NQ1N2/PPP2PPP/R1B1KB1R w KQ - 5 11', // 10...Re8
  after_Be2:       'r1b1r1k1/ppp1bppp/2n5/3q4/8/2NQ1N2/PPP1BPPP/R1B1K2R b KQ - 6 11', // 11.Be2
  after_Bg4:       'r3r1k1/ppp1bppp/2n5/3q4/6b1/2NQ1N2/PPP1BPPP/R1B1K2R w KQ - 7 12', // 11...Bg4
  after_w_OO:      'r3r1k1/ppp1bppp/2n5/3q4/6b1/2NQ1N2/PPP1BPPP/R1B2RK1 b - - 8 12',  // 12.O-O
  after_Qe6:       'r3r1k1/ppp1bppp/2n1q3/8/6b1/2NQ1N2/PPP1BPPP/R1B2RK1 w - - 9 13', // 12...Qe6
  // we-5 positions
  after_h3:        'r3r1k1/ppp1bppp/2n1q3/8/6b1/2NQ1N1P/PPP1BPP1/R1B2RK1 b - - 0 13', // 13.h3
  after_Bh5:       'r3r1k1/ppp1bppp/2n1q3/7b/8/2NQ1N1P/PPP1BPP1/R1B2RK1 w - - 1 14', // 13...Bh5
  after_Nd5:       'r3r1k1/ppp1bppp/2n1q3/3N3b/8/3Q1N1P/PPP1BPP1/R1B2RK1 b - - 2 14', // 14.Nd5
  after_Qd6:       'r3r1k1/ppp1bppp/2nq4/3N3b/8/3Q1N1P/PPP1BPP1/R1B2RK1 w - - 3 15', // 14...Qd6
  after_Nxe7:      'r3r1k1/ppp1Nppp/2nq4/7b/8/3Q1N1P/PPP1BPP1/R1B2RK1 b - - 0 15',  // 15.Nxe7+
  after_Rxe7:      'r5k1/ppp1rppp/2nq4/7b/8/3Q1N1P/PPP1BPP1/R1B2RK1 w - - 0 16',    // 15...Rxe7

  // === DEVIATION 1: 5.Nc3 (instead of 5.d3) — 121 games, 69% ===
  dev1_Nc3:        'rnbqkb1r/ppp2ppp/5n2/3P4/4p3/2N2N2/PPPPQPPP/R1B1KB1R b KQkq - 3 5',
  dev1_Be7:        'rnbqk2r/ppp1bppp/5n2/3P4/4p3/2N2N2/PPPPQPPP/R1B1KB1R w KQkq - 4 6',
  dev1_Nxe4:       'rnbqk2r/ppp1bppp/5n2/3P4/4N3/5N2/PPPPQPPP/R1B1KB1R b KQkq - 0 6',
  dev1_NxNe4:      'rnbqk2r/ppp1bppp/8/3P4/4n3/5N2/PPPPQPPP/R1B1KB1R w KQkq - 0 7',
  dev1_d3:         'rnbqk2r/ppp1bppp/8/3P4/4n3/3P1N2/PPP1QPPP/R1B1KB1R b KQkq - 0 7',
  dev1_Nf6b:       'rnbqk2r/ppp1bppp/5n2/3P4/8/3P1N2/PPP1QPPP/R1B1KB1R w KQkq - 1 8',
  dev1_Bf4:        'rnbqk2r/ppp1bppp/5n2/3P4/5B2/3P1N2/PPP1QPPP/R3KB1R b KQkq - 2 8',
  dev1_OO:         'rnbq1rk1/ppp1bppp/5n2/3P4/5B2/3P1N2/PPP1QPPP/R3KB1R w KQ - 3 9',

  // === DEVIATION 2: 4.Nd4 (instead of 4.Qe2) — 108 games, 76% ===
  dev2_Nd4:        'rnbqkbnr/ppp2ppp/8/3P4/3Np3/8/PPPP1PPP/RNBQKB1R b KQkq - 1 4',
  dev2_Qxd5:       'rnb1kbnr/ppp2ppp/8/3q4/3Np3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 5',
  dev2_Nb3:        'rnb1kbnr/ppp2ppp/8/3q4/4p3/1N6/PPPP1PPP/RNBQKB1R b KQkq - 1 5',
  dev2_Bc5:        'rnb1k1nr/ppp2ppp/8/2bq4/4p3/1N6/PPPP1PPP/RNBQKB1R w KQkq - 2 6',
  dev2_Nc3:        'rnb1k1nr/ppp2ppp/8/2bq4/4p3/1NN5/PPPP1PPP/R1BQKB1R b KQkq - 3 6',
  dev2_Nf6:        'rnb1k2r/ppp2ppp/5n2/2bq4/4p3/1NN5/PPPP1PPP/R1BQKB1R w KQkq - 4 7',
  dev2_d3:         'rnb1k2r/ppp2ppp/5n2/2bq4/4p3/1NNP4/PPP2PPP/R1BQKB1R b KQkq - 0 7',
  dev2_OO:         'rnb2rk1/ppp2ppp/5n2/2bq4/4p3/1NNP4/PPP2PPP/R1BQKB1R w KQ - 1 8',

  // === DEVIATION 3: 3.Nxe5 (White grabs e5 — critical test) — 67% ===
  dev3_Nxe5:       'rnbqkbnr/ppp2ppp/8/3pN3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  dev3_Nf6:        'rnbqkb1r/ppp2ppp/5n2/3pN3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 1 4',
  dev3_Nc3:        'rnbqkb1r/ppp2ppp/5n2/3pN3/4P3/2N5/PPPP1PPP/R1BQKB1R b KQkq - 2 4',
  dev3_Bd6:        'rnbqk2r/ppp2ppp/3b1n2/3pN3/4P3/2N5/PPPP1PPP/R1BQKB1R w KQkq - 3 5',
  dev3_d4:         'rnbqk2r/ppp2ppp/3b1n2/3pN3/3PP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 5',
  dev3_OO:         'rnbq1rk1/ppp2ppp/3b1n2/3pN3/3PP3/2N5/PPP2PPP/R1BQKB1R w KQ - 1 6',
  dev3_Be2:        'rnbq1rk1/ppp2ppp/3b1n2/3pN3/3PP3/2N5/PPP1BPPP/R1BQK2R b KQ - 2 6',
  dev3_Re8:        'rnbqr1k1/ppp2ppp/3b1n2/3pN3/3PP3/2N5/PPP1BPPP/R1BQK2R w KQ - 3 7',
}


// ═══════════════════════════════════════════════════════════
// we-1: THE ELEPHANT GAMBIT (1.e4 e5 2.Nf3 d5! 3.exd5 e4!)
// First lesson — no recap.
// Teaches 3 black moves: e5, d5!, e4!
// ═══════════════════════════════════════════════════════════

const WE_1: OpeningLesson = {
  id: 'we-1',
  title: 'The Elephant Gambit',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Elephant Gambit — Witty_Alien's #1 weapon as Black. He plays it in 74% of his games against 1.e4. Wins 74% of those. The idea: offer a pawn, ignore it, and kick the knight.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "It starts with the most natural response to 1.e4 — and then one wild move that nobody expects.",
    },

    // ── TEACH 1: e5 ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White opens 1.e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: "Open symmetrically — stake your own center.",
      hint: 'Pawn from e7 to e5.',
      correctFeedback: 'e5. Classic response. Now White will develop the knight.',
      wrongFeedback: 'Play e5 — mirror the center pawn.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "2.Nf3 — White develops the knight and attacks your e5 pawn.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },

    // ── TEACH 2: d5! ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Here's where most players play Nc6 or Nf6. Witty ignores that and plays something completely different.",
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'd5',
      prompt: "Counter in the center — push the d-pawn to d5.",
      hint: 'Pawn from d7 to d5.',
      correctFeedback: "d5! The Elephant Gambit. You're offering your d-pawn. White almost always takes it.",
      wrongFeedback: 'Play d5 — the Elephant Gambit starts here.',
      postMoveArrow: ['d5', 'e4'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "3.exd5 — White takes the pawn. Now comes the real point.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },

    // ── TEACH 3: e4! ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "Most players would try to recapture the d5 pawn — Qxd5, Nxd5. Witty does neither. He ignores the pawn completely.",
      highlightSquares: ['d5', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'e4',
      prompt: "Don't recapture. PUSH. e5 pawn forward to e4.",
      hint: 'Pawn from e5 to e4 — attack the Nf3.',
      correctFeedback: "e4! The Paulsen Countergambit — the whole idea. You give up a pawn to kick the knight and keep the initiative. Witty plays this in 501 of 503 games when White takes on d5.",
      wrongFeedback: "Play e4 — don't recapture, attack the knight!",
      postMoveArrow: ['e4', 'f3'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_e4b,
      text: "The knight must move. White's most common response is 4.Qe2 — trying to pin the e4 pawn to the king. That's next lesson.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play the gambit from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
      orientation: 'black',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
      orientation: 'black',
    },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
      orientation: 'black',
    },
    { type: 'instruction', fen: FEN.after_e4b, text: "4.Qe2 is White's main try. Next lesson.", autoAdvance: 800 },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e4b,
      text: "e5, d5, e4 — three moves, one idea: ignore the captured pawn and seize tempo. The Elephant is on the board.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-2: THE POINT (4.Qe2 Nf6 5.d3 Qxd5! 6.Nbd2 Be7)
// Teaches 3 black moves: Nf6, Qxd5!, Be7
// The Paulsen Countergambit — queen grabs d5, pins Qe2 to e1 king.
// ═══════════════════════════════════════════════════════════

const WE_2: OpeningLesson = {
  id: 'we-2',
  title: 'The Point',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e4b,
      text: "4.Qe2 — White pins your e4 pawn. Looks awkward for you. It's not. White is down a tempo and the Qe2 will be annoying to defend.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick recap to the position.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Qe2, text: '4.Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },

    // ── TEACH 1: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "Develop with tempo — Nf6 attacks the e4 pawn again AND develops your knight.",
      highlightSquares: ['g8', 'f6', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qe2,
      correctMove: 'Nf6',
      prompt: "Develop the knight — hit the e4 tension.",
      hint: 'Knight from g8 to f6.',
      correctFeedback: "Nf6! Development and pressure. White plays 5.d3 to try to dissolve your e4 pawn.",
      wrongFeedback: 'Play Nf6 — develop and attack e4.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_d3,
      text: "5.d3 — White opens the diagonal to trade off the e4 pawn. Here's where you get your pawn back.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd3'],
    },

    // ── TEACH 2: Qxd5! ──
    {
      type: 'instruction',
      fen: FEN.after_d3,
      text: "The d5 pawn is sitting there unguarded. Your queen can take it — AND it lands on d5 staring right at the Qe2.",
      highlightSquares: ['d5', 'e2'],
      arrow: ['d8', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d3,
      correctMove: 'Qxd5',
      prompt: "Snatch the d5 pawn with the queen. Centralize.",
      hint: 'Queen takes d5.',
      correctFeedback: "Qxd5! Pawn back, queen centralized, e-file pressure on Qe2. Witty plays this in 126 of 130 games when White plays 5.d3. Win rate: 76%.",
      wrongFeedback: 'Take with the queen — Qxd5.',
      postMoveArrow: ['d5', 'e2'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "6.Nbd2 — White develops. The queen on d5 isn't directly attacking anything critical, but it's already causing White headaches.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },

    // ── TEACH 3: Be7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "Just develop. Be7 prepares castling and gets your pieces off the back rank. You can't grab more material right now — so improve your position.",
      highlightSquares: ['f8', 'e7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'Be7',
      prompt: "Develop the bishop and prepare to castle.",
      hint: 'Bishop from f8 to e7.',
      correctFeedback: "Be7! Solid development. White will trade the e4 pawn with dxe4 next, and you recapture with the knight.",
      wrongFeedback: 'Play Be7 — develop and get ready to castle.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "7.dxe4 — White trades off the pawn. Your turn to recapture.",
      autoAdvance: 800,
      highlightSquares: ['d3', 'e4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Qe2,
      text: "From 4.Qe2 — play Nf6, Qxd5, Be7.",
    },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_d3, text: 'd3.', autoAdvance: 800, highlightSquares: ['d2', 'd3'] },
    { type: 'play-move', fen: FEN.after_d3, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d3', 'e4'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Nf6, Qxd5, Be7 — pawn back, queen centralized, bishop developed, castling next. The Elephant is winning material back and the position.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-3: RECAPTURE AND CASTLE (7.dxe4 Nxe4 8.Nxe4 O-O 9.Nc3 Nc6)
// Teaches 3 black moves: Nxe4, O-O, Nc6
// ═══════════════════════════════════════════════════════════

const WE_3: OpeningLesson = {
  id: 'we-3',
  title: 'Recapture and Castle',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "White just took your e4 pawn. Recapture with the knight, then White trades, then you castle and finish your development. Three clean moves.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_d3, text: 'd3.', autoAdvance: 800, highlightSquares: ['d2', 'd3'] },
    { type: 'play-move', fen: FEN.after_d3, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d3', 'e4'] },

    // ── TEACH 1: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: "Recapture the e4 pawn — knight takes.",
      hint: 'Knight from f6 takes e4.',
      correctFeedback: "Nxe4! Knight in the center. White will trade it off with Nxe4.",
      wrongFeedback: 'Take with the knight — Nxe4.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_NxNe4,
      text: "8.Nxe4 — White trades off your central knight. Now castle — your king belongs on g8.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'e4'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_NxNe4,
      correctMove: 'O-O',
      prompt: "Castle kingside.",
      hint: 'Castle O-O — king to g8, rook to f8.',
      correctFeedback: "O-O! King safe on g8. Now White plays Nc3 and your last development move is Nc6.",
      wrongFeedback: 'Castle O-O — get the king safe.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "9.Nc3 — White develops. Your turn to finish the queenside.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },

    // ── TEACH 3: Nc6 ──
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nc6',
      prompt: "Develop the queenside knight.",
      hint: 'Knight from b8 to c6.',
      correctFeedback: "Nc6! Both knights developed, both bishops developed, castled, queen centralized. Black has the easier game from here. Roughly equal by evaluation — but White's Qe2 is awkward and you know all the ideas.",
      wrongFeedback: 'Play Nc6 — develop the last major piece.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Fully developed, king safe, queen on d5 pressing the e-file. This is the dream Elephant Gambit position. Next: pile on with Re8.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "From dxe4 — Nxe4, O-O, Nc6.",
    },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_NxNe4, text: 'Nxe4.', autoAdvance: 800, highlightSquares: ['d2', 'e4'] },
    { type: 'play-move', fen: FEN.after_NxNe4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Nxe4, O-O, Nc6. Development complete. The Elephant Gambit structure is ready. Time to press.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-4: PILE ON THE E-FILE (10.Qd3 Re8 11.Be2 Bg4 12.O-O Qe6)
// Teaches 3 black moves: Re8, Bg4, Qe6
// ═══════════════════════════════════════════════════════════

const WE_4: OpeningLesson = {
  id: 'we-4',
  title: 'Pile on the e-file',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "You're fully developed. Now execute the Elephant Gambit's key idea: pile everything on the e-file. The rook goes to e8, the bishop pins the Nf3, and the queen relocates.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to the position.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_d3, text: 'd3.', autoAdvance: 800, highlightSquares: ['d2', 'd3'] },
    { type: 'play-move', fen: FEN.after_d3, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d3', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_NxNe4, text: 'Nxe4.', autoAdvance: 800, highlightSquares: ['d2', 'e4'] },
    { type: 'play-move', fen: FEN.after_NxNe4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Qd3, text: '10.Qd3 — White gets the queen off the e-file pin.', autoAdvance: 800, highlightSquares: ['e2', 'd3'] },

    // ── TEACH 1: Re8 ──
    {
      type: 'instruction',
      fen: FEN.after_Qd3,
      text: "Your rook on f8 has nowhere useful to go... except e8. Stack the rook on the half-open e-file. That's the whole Elephant Gambit.",
      highlightSquares: ['f8', 'e8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd3,
      correctMove: 'Re8',
      prompt: "Rook to e8 — pile on the e-file.",
      hint: 'Rook from f8 to e8.',
      correctFeedback: "Re8! Now the e-file has real pressure. White's king is still in the center — that matters.",
      wrongFeedback: 'Play Re8 — the rook belongs on e8.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "11.Be2 — White finally develops the f1 bishop, preparing castling. Give them a harder problem.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },

    // ── TEACH 2: Bg4 ──
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "Pin the Nf3! Your c8 bishop can jump to g4 and nail the knight to the king. No more Nf3 tricks.",
      highlightSquares: ['c8', 'g4', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bg4',
      prompt: "Pin the knight on f3.",
      hint: 'Bishop from c8 to g4 — pins Nf3.',
      correctFeedback: "Bg4! The knight is pinned to White's queen. White has to deal with this before they can do anything active.",
      wrongFeedback: 'Play Bg4 — pin the Nf3.',
      postMoveArrow: ['g4', 'f3'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_w_OO,
      text: "12.O-O — White castles. Now reposition the queen to a more active square.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },

    // ── TEACH 3: Qe6 ──
    {
      type: 'instruction',
      fen: FEN.after_w_OO,
      text: "The queen on d5 has done its job. Move it to e6 — keeps e-file pressure, eyes the h3 square, and frees the d-file.",
      highlightSquares: ['d5', 'e6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_w_OO,
      correctMove: 'Qe6',
      prompt: "Queen to e6 — press the e-file.",
      hint: 'Queen from d5 to e6.',
      correctFeedback: "Qe6! Queen on the semi-open e-file with rook backing it up. White has real problems with the Bg4 pin and Re8 pressure.",
      wrongFeedback: 'Play Qe6 — keep the e-file pressure.',
      orientation: 'black',
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Qd3,
      text: "Re8, Bg4, Qe6.",
    },
    { type: 'play-move', fen: FEN.after_Qd3, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_w_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_w_OO, correctMove: 'Qe6', prompt: 'Your move.', hint: 'Qe6.', correctFeedback: 'Qe6.', wrongFeedback: 'Qe6.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qe6,
      text: "Re8, Bg4, Qe6. The full Elephant Gambit battery is up. Next: White kicks the bishop, and you regroup to keep pressing.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-5: KEEP THE PRESSURE (13.h3 Bh5 14.Nd5 Qd6 15.Nxe7+ Rxe7)
// Teaches 3 black moves: Bh5, Qd6, Rxe7
// Roughly equal — honest tone. White has material; Black has the easier plan.
// ═══════════════════════════════════════════════════════════

const WE_5: OpeningLesson = {
  id: 'we-5',
  title: 'Keep the Pressure',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qe6,
      text: "Honest moment: this is roughly equal by engine evaluation. But equal doesn't mean the same for both sides — White has to navigate the pin, the e-file pressure, and uncoordinated pieces. You just have to keep pieces active.",
    },

    // ── TEACH 1: Bh5 ──
    {
      type: 'instruction',
      fen: FEN.after_h3,
      text: "13.h3 — White kicks your bishop off g4. Don't panic. Retreat to h5 — the pin is maintained from a diagonal.",
      autoAdvance: 800,
      highlightSquares: ['h2', 'h3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h3,
      correctMove: 'Bh5',
      prompt: "Retreat the bishop — keep the pressure.",
      hint: 'Bishop from g4 to h5.',
      correctFeedback: "Bh5. Still on the g6-h5 diagonal, still watching f3. White hasn't solved anything.",
      wrongFeedback: 'Play Bh5 — retreat but keep the pressure.',
      orientation: 'black',
    },

    // ── TEACH 2: Qd6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5,
      text: "14.Nd5 — White's knight invades. Your queen on e6 is attacked. Step back to d6 — keeps queens connected and covers c7.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nd5,
      correctMove: 'Qd6',
      prompt: "Queen steps back to d6.",
      hint: 'Queen from e6 to d6.',
      correctFeedback: "Qd6. Queen retreats but covers important squares. Now White can trade off their knight.",
      wrongFeedback: 'Play Qd6 — step the queen back.',
      orientation: 'black',
    },

    // ── TEACH 3: Rxe7 ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe7,
      text: "15.Nxe7+ — White trades the knight for your bishop. Take with the rook! You keep the open e-file and activate the rook.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe7,
      correctMove: 'Rxe7',
      prompt: "Take back with the rook.",
      hint: 'Rook from e8 takes e7.',
      correctFeedback: "Rxe7! Rook activated on the e-file, pawn structure is fine. Black is a pawn down overall but has the easier, more active position. Witty converts these regularly — the human side is harder to play than the computer says.",
      wrongFeedback: 'Take with the rook — Rxe7.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.after_Rxe7,
      text: "Black is a pawn down by material count, but has the rook on e7, the bishop on h5, and active play everywhere. In Witty's bullet games, this converts well. In slower games, it's a real fight — and you know the ideas.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h3,
      text: "Bh5, Qd6, Rxe7.",
    },
    { type: 'instruction', fen: FEN.after_h3, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Bh5', prompt: 'Your move.', hint: 'Bh5.', correctFeedback: 'Bh5.', wrongFeedback: 'Bh5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Qd6', prompt: 'Your move.', hint: 'Qd6.', correctFeedback: 'Qd6.', wrongFeedback: 'Qd6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nxe7, text: 'Nxe7+.', autoAdvance: 800, highlightSquares: ['d5', 'e7'] },
    { type: 'play-move', fen: FEN.after_Nxe7, correctMove: 'Rxe7', prompt: 'Your move.', hint: 'Rxe7.', correctFeedback: 'Rxe7.', wrongFeedback: 'Rxe7.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Rxe7,
      text: "That's the full Elephant Gambit main line — from 1...e5 to an active, fighting position. Now learn the deviations: 4.Nd4, 5.Nc3, and the critical 3.Nxe5.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-dev-Nd4: DEVIATION — 4.Nd4 Qxd5 5.Nb3 Bc5 6.Nc3 Nf6
// White retreats to Nd4 instead of 4.Qe2 — 108 games, 76%
// Teaches 3 black moves: Qxd5, Bc5, Nf6
// ═══════════════════════════════════════════════════════════

const WE_DEV_ND4: OpeningLesson = {
  id: 'we-dev-Nd4',
  title: 'If 4.Nd4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e4b,
      text: "Instead of 4.Qe2, some White players retreat the knight to d4. That's actually worse — the knight is passive there. You get the pawn back immediately.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to e4!",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev2_Nd4, text: '4.Nd4 — knight to d4 instead of Qe2.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },

    // ── TEACH 1: Qxd5 ──
    {
      type: 'instruction',
      fen: FEN.dev2_Nd4,
      text: "The d5 pawn is hanging and the Nd4 is also loose. Take back immediately — queen to d5 hits the knight.",
      highlightSquares: ['d8', 'd5', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev2_Nd4,
      correctMove: 'Qxd5',
      prompt: "Grab d5 with the queen — hit the knight.",
      hint: 'Queen takes d5, attacking Nd4.',
      correctFeedback: "Qxd5! Queen back on d5, attacking the awkward Nd4. White retreats the knight and you're already better.",
      wrongFeedback: 'Take d5 — Qxd5.',
      postMoveArrow: ['d5', 'd4'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev2_Nb3,
      text: "5.Nb3 — the knight backs off. Now develop with purpose.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'b3'],
    },

    // ── TEACH 2: Bc5 ──
    {
      type: 'instruction',
      fen: FEN.dev2_Nb3,
      text: "Develop the bishop to c5 — it attacks the Nb3 indirectly via b4, and prepares O-O.",
      highlightSquares: ['f8', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev2_Nb3,
      correctMove: 'Bc5',
      prompt: "Bishop to c5 — develop and prepare to castle.",
      hint: 'Bishop from f8 to c5.',
      correctFeedback: "Bc5! Development, castling prep, and the bishop eyes the queenside. White has to continue developing.",
      wrongFeedback: 'Play Bc5 — develop the bishop.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev2_Nc3,
      text: "6.Nc3 — White develops. Finish your development.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },

    // ── TEACH 3: Nf6 ──
    {
      type: 'play-move',
      fen: FEN.dev2_Nc3,
      correctMove: 'Nf6',
      prompt: "Develop the knight.",
      hint: 'Knight from g8 to f6.',
      correctFeedback: "Nf6! Knight developed, attacks the e4 push ideas. Black is fully comfortable here. 76% win rate in Witty's real games.",
      wrongFeedback: 'Play Nf6 — develop and attack.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev2_d3,
      text: "After 7.d3, Black castles and the position is basically a free game — all your pieces are active and White's knight is on the rim at b3. Comfortable play.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev2_Nd4,
      text: "If 4.Nd4: Qxd5, Bc5, Nf6.",
    },
    { type: 'play-move', fen: FEN.dev2_Nd4, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev2_Nb3, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.dev2_Nb3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev2_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev2_Nc3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev2_Nf6,
      text: "4.Nd4? No problem. Qxd5, Bc5, Nf6 — you're developed and comfortable. Castle and play chess.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-dev-Nc3: DEVIATION — 5.Nc3 Be7 6.Nxe4 Nxe4 7.d3 Nf6
// White defends d5 pawn with Nc3 — 121 games, 69% (slightly trickier)
// Teaches 3 black moves: Be7, Nxe4, Nf6
// ═══════════════════════════════════════════════════════════

const WE_DEV_NC3: OpeningLesson = {
  id: 'we-dev-Nc3',
  title: 'If 5.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "After 4.Qe2 Nf6, White sometimes plays 5.Nc3 instead of 5.d3. They're defending the d5 pawn so you can't take it yet. Answer: just develop Be7 and castle.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay to Nf6.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev1_Nc3, text: '5.Nc3 — White defends d5. You can\'t take it yet. Just develop.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // ── TEACH 1: Be7 ──
    {
      type: 'instruction',
      fen: FEN.dev1_Nc3,
      text: "You can't grab d5 (it's defended by Nc3). No problem — just develop Be7 and prepare to castle. Patience.",
      highlightSquares: ['f8', 'e7'],
    },
    {
      type: 'play-move',
      fen: FEN.dev1_Nc3,
      correctMove: 'Be7',
      prompt: "Develop the bishop and prepare castling.",
      hint: 'Bishop from f8 to e7.',
      correctFeedback: "Be7. Solid. White will probably take your e4 pawn next — and you take back with the knight.",
      wrongFeedback: 'Play Be7 — develop and prepare to castle.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev1_Nxe4,
      text: "6.Nxe4 — White dissolves your e4 pawn. Take back with the knight.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e4'],
    },

    // ── TEACH 2: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.dev1_Nxe4,
      correctMove: 'Nxe4',
      prompt: "Recapture with the knight.",
      hint: 'Knight from f6 takes e4.',
      correctFeedback: "Nxe4! Knight in the center. Now the key: Qe2 is pinned to the king — White can't play Qxe4 without losing the queen. So White must kick your knight with d3.",
      wrongFeedback: 'Take with the knight — Nxe4.',
      postMoveArrow: ['e4', 'e2'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev1_d3,
      text: "7.d3 — White kicks the knight. Retreat to f6. The pin idea is the reason this deviation is trickier — White had to play d3, losing tempo.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd3'],
    },

    // ── TEACH 3: Nf6 ──
    {
      type: 'play-move',
      fen: FEN.dev1_d3,
      correctMove: 'Nf6',
      prompt: "Retreat the knight safely.",
      hint: 'Knight from e4 to f6.',
      correctFeedback: "Nf6. Knight safely back, development complete. Castle next and you have a fine position. 69% win rate — lower than the main line because this is slightly trickier, but still comfortable.",
      wrongFeedback: 'Play Nf6 — retreat safely.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev1_Bf4,
      text: "After 8.Bf4, Black castles and plays normal chess. White's d5 pawn is still theirs, but your pieces are active and the position is fine.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev1_Nc3,
      text: "If 5.Nc3: Be7, Nxe4, Nf6.",
    },
    { type: 'play-move', fen: FEN.dev1_Nc3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev1_Nxe4, text: 'Nxe4.', autoAdvance: 800, highlightSquares: ['c3', 'e4'] },
    { type: 'play-move', fen: FEN.dev1_Nxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev1_d3, text: 'd3.', autoAdvance: 800, highlightSquares: ['d2', 'd3'] },
    { type: 'play-move', fen: FEN.dev1_d3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev1_Nf6b,
      text: "5.Nc3 is trickier but totally playable. Be7, Nxe4, Nf6 — then castle. You know the drill.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-dev-Nxe5: DEVIATION — 3.Nxe5 Nf6! 4.Nc3 Bd6 5.d4 O-O
// White grabs e5 instead of exd5 — the critical test. 67% win rate.
// HONEST: Black is a pawn down. This works in bullet. In slower chess, it's a real fight.
// Teaches 3 black moves: Nf6!, Bd6, O-O
// ═══════════════════════════════════════════════════════════

const WE_DEV_NXES: OpeningLesson = {
  id: 'we-dev-Nxe5',
  title: 'If 3.Nxe5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Honest warning: this is the critical test. Instead of 3.exd5, White just takes the e5 pawn directly with 3.Nxe5. Black is genuinely a pawn down. Witty's win rate here is 67% — his lowest in the Elephant. It works in bullet on fast development. In longer games, it's a real fight.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap to d5.",
    },
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev3_Nxe5, text: '3.Nxe5! — White just takes the pawn. Critical test.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },

    // ── TEACH 1: Nf6! ──
    {
      type: 'instruction',
      fen: FEN.dev3_Nxe5,
      text: "Don't panic. Develop Nf6 — attack the e4 pawn AND develop. Witty plays this in 192 of 194 games. The idea: fast development creates compensation for the pawn.",
      highlightSquares: ['g8', 'f6', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev3_Nxe5,
      correctMove: 'Nf6',
      prompt: "Develop Nf6 — hit the e4 pawn.",
      hint: 'Knight from g8 to f6.',
      correctFeedback: "Nf6! Development and pressure on e4. White has to defend and can't advance easily.",
      wrongFeedback: 'Play Nf6 — develop and attack e4.',
      postMoveArrow: ['f6', 'e4'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev3_Nc3,
      text: "4.Nc3 — White defends e4. Now: develop the bishop to d6, directly hitting the Ne5.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },

    // ── TEACH 2: Bd6 ──
    {
      type: 'instruction',
      fen: FEN.dev3_Nc3,
      text: "Bd6 — the bishop targets the Ne5 and dares White to defend it. If the knight moves, d5 falls and you equalize completely.",
      highlightSquares: ['f8', 'd6', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev3_Nc3,
      correctMove: 'Bd6',
      prompt: "Bishop to d6 — attack the Ne5.",
      hint: 'Bishop from f8 to d6, aiming at Ne5.',
      correctFeedback: "Bd6! The bishop threatens to win the Ne5 or force it to move. White plays d4 to support the knight.",
      wrongFeedback: 'Play Bd6 — attack the Ne5.',
      postMoveArrow: ['d6', 'e5'],
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev3_d4,
      text: "5.d4 — White reinforces the Ne5. Don't take it yet — castle first.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },

    // ── TEACH 3: O-O ──
    {
      type: 'instruction',
      fen: FEN.dev3_d4,
      text: "Castle. Get the king safe, activate the rook on e8 next. The rook on e8 will pin the Ne5 against the king — that's the whole compensation plan.",
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'play-move',
      fen: FEN.dev3_d4,
      correctMove: 'O-O',
      prompt: "Castle kingside.",
      hint: 'Castle O-O.',
      correctFeedback: "O-O! King safe, rook heading to e8. After Be2 from White, play Re8 to pin the Ne5. Black is a pawn down but has real activity. In bullet, this converts often. In slower time controls, be honest — you're fighting for compensation.",
      wrongFeedback: 'Castle O-O — get the king safe first.',
      orientation: 'black',
    },
    {
      type: 'instruction',
      fen: FEN.dev3_Re8,
      text: "After 6.Be2 Re8 — the pin on Ne5 is real. White can't move the knight without losing it. Black has full compensation for the pawn.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev3_Nxe5,
      text: "If 3.Nxe5: Nf6!, Bd6, O-O.",
    },
    { type: 'play-move', fen: FEN.dev3_Nxe5, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev3_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev3_Nc3, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev3_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.dev3_d4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev3_OO,
      text: "3.Nxe5 is the real test. Black is a pawn down. Nf6, Bd6, O-O then Re8 — fast development is your only compensation. Witty wins 67% of these. In bullet. Don't play this in classical and expect it to be easy.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// we-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const WE_TEST_1: OpeningLesson = {
  id: 'we-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Test time. Play the Elephant Gambit — main line plus deviations. No hints.",
      buttonText: "LET'S GO",
    },

    // Main line from memory
    { type: 'instruction', fen: FEN.after_e4, text: '1.e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nf3, text: '2.Nf3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_exd5, text: '3.exd5.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Qe2, text: '4.Qe2.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_d3, text: '5.d3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d3, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: '6.Nbd2.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_dxe4, text: '7.dxe4.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_NxNe4, text: '8.Nxe4.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_NxNe4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.', orientation: 'black' },
    { type: 'instruction', fen: FEN.after_Nc3, text: '9.Nc3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.', orientation: 'black' },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Main line complete. Now test the deviations.",
    },

    // Deviation: 4.Nd4
    {
      type: 'instruction',
      fen: FEN.after_e4b,
      text: "What if White plays 4.Nd4?",
    },
    { type: 'instruction', fen: FEN.dev2_Nd4, text: '4.Nd4.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev2_Nd4, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev2_Nb3, text: '5.Nb3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev2_Nb3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev2_Nc3, text: '6.Nc3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev2_Nc3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },

    // Deviation: 5.Nc3
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "What if White plays 5.Nc3 instead of 5.d3?",
    },
    { type: 'instruction', fen: FEN.dev1_Nc3, text: '5.Nc3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev1_Nc3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev1_Nxe4, text: '6.Nxe4.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev1_Nxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev1_d3, text: '7.d3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev1_d3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },

    // Deviation: 3.Nxe5
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "What if White plays 3.Nxe5? (Hardest line — be honest with yourself.)",
    },
    { type: 'instruction', fen: FEN.dev3_Nxe5, text: '3.Nxe5.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev3_Nxe5, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev3_Nc3, text: '4.Nc3.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev3_Nc3, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.', orientation: 'black' },
    { type: 'instruction', fen: FEN.dev3_d4, text: '5.d4.', autoAdvance: 800 },
    { type: 'play-move', fen: FEN.dev3_d4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.', orientation: 'black' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev3_OO,
      text: "Level 1 complete. The full Elephant Gambit is in your head — main line, two standard deviations, and the critical 3.Nxe5. Go play it.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const WITTY_ALIEN_ELEPHANT_LESSONS: Record<string, OpeningLesson> = {
  'we-1':          WE_1,
  'we-2':          WE_2,
  'we-3':          WE_3,
  'we-4':          WE_4,
  'we-5':          WE_5,
  'we-dev-Nd4':    WE_DEV_ND4,
  'we-dev-Nc3':    WE_DEV_NC3,
  'we-dev-Nxe5':   WE_DEV_NXES,
  'we-test-1':     WE_TEST_1,
}

export function getWittyAlienElephantLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_ELEPHANT_LESSONS[id]
}
