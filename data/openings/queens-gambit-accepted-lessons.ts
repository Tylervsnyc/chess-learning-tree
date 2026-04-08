import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// QUEEN'S GAMBIT ACCEPTED LESSONS (qga-1 through qga-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs computed and validated with chess.js.
// Identity: 1.d4 d5 2.c4 dxc4
// Main line: 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6
//            7.dxc5 Bxc5 8.Qxd8+ Kxd8 9.Be2 Ke7
//            10.Nbd2 Bd7 11.b3 Bb5 12.Nc4 Nbd7
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Starting position
  start:              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  // Identity positions
  after_d4:           'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_d5:           'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  after_c4:           'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_dxc4:         'rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',

  // Main line
  after_Nf3:          'rnbqkbnr/ppp1pppp/8/8/2pP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3',
  after_Nf6:          'rnbqkb1r/ppp1pppp/5n2/8/2pP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4',
  after_e3:           'rnbqkb1r/ppp1pppp/5n2/8/2pP4/4PN2/PP3PPP/RNBQKB1R b KQkq - 0 4',
  after_e6:           'rnbqkb1r/ppp2ppp/4pn2/8/2pP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 0 5',
  after_Bxc4:         'rnbqkb1r/ppp2ppp/4pn2/8/2BP4/4PN2/PP3PPP/RNBQK2R b KQkq - 0 5',
  after_c5:           'rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQK2R w KQkq - 0 6',
  after_OO:           'rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQ1RK1 b kq - 1 6',
  after_a6:           'rnbqkb1r/1p3ppp/p3pn2/2p5/2BP4/4PN2/PP3PPP/RNBQ1RK1 w kq - 0 7',
  after_dxc5:         'rnbqkb1r/1p3ppp/p3pn2/2P5/2B5/4PN2/PP3PPP/RNBQ1RK1 b kq - 0 7',
  after_Bxc5:         'rnbqk2r/1p3ppp/p3pn2/2b5/2B5/4PN2/PP3PPP/RNBQ1RK1 w kq - 0 8',
  after_Qxd8:         'rnbQk2r/1p3ppp/p3pn2/2b5/2B5/4PN2/PP3PPP/RNB2RK1 b kq - 0 8',
  after_Kxd8:         'rnbk3r/1p3ppp/p3pn2/2b5/2B5/4PN2/PP3PPP/RNB2RK1 w - - 0 9',
  after_Be2:          'rnbk3r/1p3ppp/p3pn2/2b5/8/4PN2/PP2BPPP/RNB2RK1 b - - 1 9',
  after_Ke7:          'rnb4r/1p2kppp/p3pn2/2b5/8/4PN2/PP2BPPP/RNB2RK1 w - - 2 10',
  after_Nbd2:         'rnb4r/1p2kppp/p3pn2/2b5/8/4PN2/PP1NBPPP/R1B2RK1 b - - 3 10',
  after_Bd7:          'rn5r/1p1bkppp/p3pn2/2b5/8/4PN2/PP1NBPPP/R1B2RK1 w - - 4 11',
  after_b3:           'rn5r/1p1bkppp/p3pn2/2b5/8/1P2PN2/P2NBPPP/R1B2RK1 b - - 0 11',
  after_Bb5:          'rn5r/1p2kppp/p3pn2/1bb5/8/1P2PN2/P2NBPPP/R1B2RK1 w - - 1 12',
  after_Nc4:          'rn5r/1p2kppp/p3pn2/1bb5/2N5/1P2PN2/P3BPPP/R1B2RK1 b - - 2 12',
  after_Nbd7:         'r6r/1p1nkppp/p3pn2/1bb5/2N5/1P2PN2/P3BPPP/R1B2RK1 w - - 3 13',

  // Deviation: 4.Nc3 (instead of 4.e3) — after 3...Nf6
  dev_Nc3_after_Nc3:  'rnbqkb1r/ppp1pppp/5n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4',
  dev_Nc3_after_a6:   'rnbqkb1r/1pp1pppp/p4n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5',
  dev_Nc3_after_e4:   'rnbqkb1r/1pp1pppp/p4n2/8/2pPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 0 5',
  dev_Nc3_after_b5:   'rnbqkb1r/2p1pppp/p4n2/1p6/2pPP3/2N2N2/PP3PPP/R1BQKB1R w KQkq - 0 6',
  dev_Nc3_after_e5:   'rnbqkb1r/2p1pppp/p4n2/1p2P3/2pP4/2N2N2/PP3PPP/R1BQKB1R b KQkq - 0 6',
  dev_Nc3_after_Nd5:  'rnbqkb1r/2p1pppp/p7/1p1nP3/2pP4/2N2N2/PP3PPP/R1BQKB1R w KQkq - 1 7',

  // Deviation: 6.Qe2 (instead of 6.O-O) — after 5...c5
  dev_6Qe2_after_Qe2: 'rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP2QPPP/RNB1K2R b KQkq - 1 6',
  dev_6Qe2_after_a6:  'rnbqkb1r/1p3ppp/p3pn2/2p5/2BP4/4PN2/PP2QPPP/RNB1K2R w KQkq - 0 7',
  dev_6Qe2_after_dxc5:'rnbqkb1r/1p3ppp/p3pn2/2P5/2B5/4PN2/PP2QPPP/RNB1K2R b KQkq - 0 7',
  dev_6Qe2_after_Bxc5:'rnbqk2r/1p3ppp/p3pn2/2b5/2B5/4PN2/PP2QPPP/RNB1K2R w KQkq - 0 8',
  dev_6Qe2_after_OO:  'rnbqk2r/1p3ppp/p3pn2/2b5/2B5/4PN2/PP2QPPP/RNB2RK1 b kq - 1 8',
  dev_6Qe2_after_Nc6: 'r1bqk2r/1p3ppp/p1n1pn2/2b5/2B5/4PN2/PP2QPPP/RNB2RK1 w kq - 2 9',

  // Deviation: 7.Qe2 (instead of 7.dxc5) — after 6...a6
  dev_7Qe2_after_Qe2: 'rnbqkb1r/1p3ppp/p3pn2/2p5/2BP4/4PN2/PP2QPPP/RNB2RK1 b kq - 1 7',
  dev_7Qe2_after_b5:  'rnbqkb1r/5ppp/p3pn2/1pp5/2BP4/4PN2/PP2QPPP/RNB2RK1 w kq - 0 8',
  dev_7Qe2_after_Bb3: 'rnbqkb1r/5ppp/p3pn2/1pp5/3P4/1B2PN2/PP2QPPP/RNB2RK1 b kq - 1 8',
  dev_7Qe2_after_Bb7: 'rn1qkb1r/1b3ppp/p3pn2/1pp5/3P4/1B2PN2/PP2QPPP/RNB2RK1 w kq - 2 9',
  dev_7Qe2_after_Rd1: 'rn1qkb1r/1b3ppp/p3pn2/1pp5/3P4/1B2PN2/PP2QPPP/RNBR2K1 b kq - 3 9',
  dev_7Qe2_after_Nbd7:'r2qkb1r/1b1n1ppp/p3pn2/1pp5/3P4/1B2PN2/PP2QPPP/RNBR2K1 w kq - 4 10',
}


// ═══════════════════════════════════════════════════════════
// qga-1: ACCEPT & DEVELOP (1.d4 d5, 2.c4 dxc4, 3.Nf3 Nf6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const QGA_1: OpeningLesson = {
  id: 'qga-1',
  title: 'Accept & Develop',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Welcome to the Queen's Gambit Accepted. White offers a pawn with c4 — you're going to take it and develop quickly.",
    },

    // ── PREDICT/REVEAL 1: 1.d4 d5 ──
    { type: 'instruction', fen: FEN.after_d4, text: 'White opens with d4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'White stakes a claim in the center. How do you respond?',
      hint: 'Match White in the center with your own d-pawn.',
      correctFeedback: 'd5! You claim your share of the center right away.',
      wrongFeedback: 'Play d5 to challenge the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5 fights for the center immediately. Now White will offer the c-pawn.',
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 2: 2.c4 dxc4 ──
    { type: 'instruction', fen: FEN.after_c4, text: "White offers a pawn with c4 — the Queen's Gambit.", autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: "White offers the c-pawn. Do you accept?",
      hint: 'Take the pawn! You can give it back later on better terms.',
      correctFeedback: "dxc4! The Queen's Gambit Accepted. You grab the pawn and plan to return it at the right moment.",
      wrongFeedback: 'Capture with dxc4 to accept the gambit.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxc4,
      text: "dxc4 accepts the gambit. You're not trying to keep the pawn forever — the goal is to develop quickly while White spends time recapturing.",
      arrow: ['d5', 'c4'],
    },

    // ── PREDICT/REVEAL 3: 3.Nf3 Nf6 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'White developed a knight. How do you keep up?',
      hint: 'Develop your knight to its most natural square.',
      correctFeedback: 'Nf6! The knight controls the center and prepares for kingside development.',
      wrongFeedback: 'Develop the knight to f6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6 develops naturally, controls d5 and e4, and keeps pace with White.',
      arrow: ['g8', 'f6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play it from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "The gambit is accepted and you're developing fast. Next: return the pawn and strike the center with c5.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-2: RETURN & EXPAND (4.e3 e6, 5.Bxc4 c5, 6.O-O a6)
// ═══════════════════════════════════════════════════════════

const QGA_2: OpeningLesson = {
  id: 'qga-2',
  title: 'Return & Expand',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "White will recapture the c4 pawn. Your plan: open the position with e6 and strike the center with c5.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick review before the new stuff.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5!',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },

    // ── PREDICT/REVEAL 1: 4.e3 e6 ──
    { type: 'instruction', fen: FEN.after_e3, text: 'White plays e3, preparing to recapture the pawn.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'White is getting ready to take back on c4. What do you play?',
      hint: 'Open the diagonal for your dark-squared bishop and solidify the center.',
      correctFeedback: "e6! This opens the bishop's diagonal and gives the c4 pawn back on your terms.",
      wrongFeedback: 'Play e6 to open the bishop diagonal.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 lets White recapture on c4, but now your f8-bishop is free and you're ready to strike with c5.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: 5.Bxc4 c5 ──
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'White recaptures with the bishop on c4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: "White got the pawn back. Now it's your turn to strike.",
      hint: "Challenge White's d4 pawn — attack the center.",
      correctFeedback: "c5! This hits d4 immediately. You're fighting for the center.",
      wrongFeedback: 'Play c5 to attack the d4 pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 attacks d4 and opens the position. This is the key idea of the QGA — you gave back the pawn but now you have active piece play.",
      arrow: ['c7', 'c5'],
    },

    // ── PREDICT/REVEAL 3: 6.O-O a6 ──
    { type: 'instruction', fen: FEN.after_OO, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'a6',
      prompt: "White has castled. What's a useful preparatory move?",
      hint: 'Prevent any Bb5 ideas and prepare b5 if needed.',
      correctFeedback: "a6! A flexible move that prevents Bb5 and keeps your options open.",
      wrongFeedback: 'Play a6 to prevent Bb5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "a6 is a small but important move. It stops Bb5 and prepares b5 to kick the bishop off c4 later.",
      arrow: ['a7', 'a6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Show me you've got this.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "The center is contested and your pieces are ready. Next: handle the pawn exchange and the queen trade.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-3: THE ENDGAME (7.dxc5 Bxc5, 8.Qxd8+ Kxd8, 9.Be2 Ke7)
// ═══════════════════════════════════════════════════════════

const QGA_3: OpeningLesson = {
  id: 'qga-3',
  title: 'The Endgame',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "White trades pawns and then queens. Don't worry — this endgame is comfortable for Black.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Prove you know these moves!",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5!',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5!',
      wrongFeedback: 'c5.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6!',
      wrongFeedback: 'a6.',
    },

    // ── PREDICT/REVEAL 1: 7.dxc5 Bxc5 ──
    { type: 'instruction', fen: FEN.after_dxc5, text: 'White takes on c5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'White captured your c-pawn. How do you recapture?',
      hint: 'Develop a piece while recapturing — the bishop wants to go to c5.',
      correctFeedback: 'Bxc5! You recapture with the bishop, developing it to an active diagonal.',
      wrongFeedback: 'Recapture with Bxc5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxc5,
      text: "Bxc5 develops the bishop to a great diagonal. It eyes f2 and keeps pressure on White's position.",
      arrow: ['f8', 'c5'],
    },

    // ── PREDICT/REVEAL 2: 8.Qxd8+ Kxd8 ──
    { type: 'instruction', fen: FEN.after_Qxd8, text: 'White trades queens with Qxd8+.', autoAdvance: 800, highlightSquares: ['d1', 'd8'] },
    {
      type: 'play-move',
      fen: FEN.after_Qxd8,
      correctMove: 'Kxd8',
      prompt: 'White traded queens. How do you recapture?',
      hint: "Only one way — the king takes.",
      correctFeedback: "Kxd8! Don't be alarmed by the queen trade. This endgame is fine for Black.",
      wrongFeedback: 'Recapture with Kxd8.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxd8,
      text: "Kxd8 is forced. The queen trade might seem scary, but in this position Black's active pieces and bishop pair compensate for the awkward king.",
      arrow: ['e8', 'd8'],
    },

    // ── PREDICT/REVEAL 3: 9.Be2 Ke7 ──
    { type: 'instruction', fen: FEN.after_Be2, text: 'White retreats the bishop to e2.', autoAdvance: 800, highlightSquares: ['c4', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Ke7',
      prompt: "Your king is on d8. Where does it want to go?",
      hint: 'Centralize the king — in the endgame, the king is a strong piece.',
      correctFeedback: 'Ke7! The king centralizes and connects the rooks. In the endgame, an active king is an asset.',
      wrongFeedback: 'Play Ke7 to centralize the king.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ke7,
      text: "Ke7 is the key idea. The king is safe in the center with no queens on the board, and it connects your rooks.",
      arrow: ['d8', 'e7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "Now from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_dxc5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'Your move.',
      hint: 'Bxc5.',
      correctFeedback: 'Bxc5.',
      wrongFeedback: 'Bxc5.',
    },
    { type: 'instruction', fen: FEN.after_Qxd8, text: 'Qxd8+.', autoAdvance: 800, highlightSquares: ['d1', 'd8'] },
    {
      type: 'play-move',
      fen: FEN.after_Qxd8,
      correctMove: 'Kxd8',
      prompt: 'Your move.',
      hint: 'Kxd8.',
      correctFeedback: 'Kxd8.',
      wrongFeedback: 'Kxd8.',
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['c4', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Ke7',
      prompt: 'Your move.',
      hint: 'Ke7.',
      correctFeedback: 'Ke7.',
      wrongFeedback: 'Ke7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ke7,
      text: "Queens are off but your position is great. Next: develop the bishop pair and take control.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-4: THE BISHOP PAIR (10.Nbd2 Bd7, 11.b3 Bb5)
// ═══════════════════════════════════════════════════════════

const QGA_4: OpeningLesson = {
  id: 'qga-4',
  title: 'The Bishop Pair',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ke7,
      text: "Time to activate your last minor pieces. The bishop pair is your main advantage in this endgame.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's see what you remember!",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5!',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5!',
      wrongFeedback: 'c5.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6!',
      wrongFeedback: 'a6.',
    },
    { type: 'instruction', fen: FEN.after_dxc5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'Your move.',
      hint: 'Bxc5.',
      correctFeedback: 'Bxc5!',
      wrongFeedback: 'Bxc5.',
    },
    { type: 'instruction', fen: FEN.after_Qxd8, text: 'Qxd8+.', autoAdvance: 800, highlightSquares: ['d1', 'd8'] },
    {
      type: 'play-move',
      fen: FEN.after_Qxd8,
      correctMove: 'Kxd8',
      prompt: 'Your move.',
      hint: 'Kxd8.',
      correctFeedback: 'Kxd8!',
      wrongFeedback: 'Kxd8.',
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['c4', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Ke7',
      prompt: 'Your move.',
      hint: 'Ke7.',
      correctFeedback: 'Ke7!',
      wrongFeedback: 'Ke7.',
    },

    // ── PREDICT/REVEAL 1: 10.Nbd2 Bd7 ──
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'White develops the knight to d2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'Bd7',
      prompt: "White is developing. Where should your light-squared bishop go?",
      hint: 'Develop the bishop — it needs to get into the game.',
      correctFeedback: "Bd7! The bishop develops and prepares to relocate to a more active square.",
      wrongFeedback: 'Play Bd7 to develop the bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd7,
      text: "Bd7 gets the bishop off the back rank. From d7, it can jump to b5 next move to pin White's knight.",
      arrow: ['c8', 'd7'],
    },

    // ── PREDICT/REVEAL 2: 11.b3 Bb5 ──
    { type: 'instruction', fen: FEN.after_b3, text: 'White plays b3, preparing to develop the bishop.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    {
      type: 'play-move',
      fen: FEN.after_b3,
      correctMove: 'Bb5',
      prompt: "White played b3. Where does your bishop want to go now?",
      hint: "Jump to b5 — the bishop becomes very active there.",
      correctFeedback: "Bb5! The bishop lands on a powerful diagonal, pressuring the e2 bishop.",
      wrongFeedback: 'Play Bb5 to activate the bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb5,
      text: "Bb5 is a strong move. The bishop is active on the a6-f1 diagonal and puts pressure on White's position.",
      arrow: ['d7', 'b5'],
    },

    // ── PREDICT/REVEAL 3: 12.Nc4 Nbd7 ──
    { type: 'instruction', fen: FEN.after_Nc4, text: 'White reroutes the knight to c4.', autoAdvance: 800, highlightSquares: ['d2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc4,
      correctMove: 'Nbd7',
      prompt: "White's knight jumped to c4. How do you continue?",
      hint: 'Develop your last minor piece — the knight belongs in the game.',
      correctFeedback: "Nbd7! The knight develops naturally, supporting e5 and c5 ideas.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Nbd7 completes your development. Both bishops are active, the king is centralized, and the knight supports flexible plans.",
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Ke7,
      text: "Prove it one more time.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'Bd7',
      prompt: 'Your move.',
      hint: 'Bd7.',
      correctFeedback: 'Bd7.',
      wrongFeedback: 'Bd7.',
    },
    { type: 'instruction', fen: FEN.after_b3, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    {
      type: 'play-move',
      fen: FEN.after_b3,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
    { type: 'instruction', fen: FEN.after_Nc4, text: 'Nc4.', autoAdvance: 800, highlightSquares: ['d2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc4,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "You know the full QGA main line. Active bishops, centralized king, complete development. Time to handle the deviations.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-dev-Nc3: DEVIATION 4.Nc3 (instead of 4.e3)
// After 3...Nf6, White plays 4.Nc3 instead of 4.e3
// Black responds: 4...a6, 5...b5, 6...Nd5
// ═══════════════════════════════════════════════════════════

const QGA_DEV_NC3: OpeningLesson = {
  id: 'qga-dev-Nc3',
  title: 'Dev 4.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Sometimes White plays 4.Nc3 instead of 4.e3, going for a more aggressive setup with e4. Here's how to fight back.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me you've got this.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5!',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nc3, text: 'White plays 4.Nc3 instead of 4.e3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // ── PREDICT/REVEAL 1: 4...a6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'a6',
      prompt: "White played Nc3, threatening e4. What's your response?",
      hint: 'Prepare queenside expansion — a6 sets up b5 to hold the extra pawn.',
      correctFeedback: "a6! You prepare b5, keeping the c4 pawn and building queenside play.",
      wrongFeedback: 'Play a6 to prepare b5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_a6,
      text: "a6 prepares b5 to defend the c4 pawn. If White pushes e4, you'll expand on the queenside.",
      arrow: ['a7', 'a6'],
    },

    // ── PREDICT/REVEAL 2: 5.e4 b5 ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_e4, text: 'White pushes e4, seizing the center.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e4,
      correctMove: 'b5',
      prompt: 'White grabbed the center with e4. How do you defend your pawn?',
      hint: 'Push b5 to protect c4 and gain queenside space.',
      correctFeedback: "b5! The c4 pawn is defended and you're expanding on the queenside.",
      wrongFeedback: 'Play b5 to defend c4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_b5,
      text: "b5 defends the extra pawn and grabs space. White has the center but you have material and queenside activity.",
      arrow: ['b7', 'b5'],
    },

    // ── PREDICT/REVEAL 3: 6.e5 Nd5 ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_e5, text: 'White advances with e5, attacking your knight.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e5,
      correctMove: 'Nd5',
      prompt: "Your knight is under attack. Where does it go?",
      hint: 'Jump to the center — there is a powerful outpost available.',
      correctFeedback: "Nd5! The knight lands on a strong central square, attacking the c3 knight.",
      wrongFeedback: 'Jump the knight to d5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nd5,
      text: "Nd5 is a great centralization. The knight attacks c3 and can't easily be kicked. You have the extra pawn and a solid position.",
      arrow: ['f6', 'd5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "White played 4.Nc3. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e4,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e5,
      correctMove: 'Nd5',
      prompt: 'Your move.',
      hint: 'Nd5.',
      correctFeedback: 'Nd5.',
      wrongFeedback: 'Nd5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nd5,
      text: "When White plays 4.Nc3, you hold the pawn with a6 and b5, then centralize the knight on d5. Solid play.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-dev-6Qe2: DEVIATION 6.Qe2 (instead of 6.O-O)
// After 5...c5, White plays 6.Qe2 instead of 6.O-O
// Black responds: 6...a6, 7...Bxc5, 8...Nc6
// ═══════════════════════════════════════════════════════════

const QGA_DEV_6QE2: OpeningLesson = {
  id: 'qga-dev-6Qe2',
  title: 'Dev 6.Qe2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Sometimes White plays 6.Qe2 instead of castling. The plan is similar — develop naturally and keep the pressure on.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Run through the opening first.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5!',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5!',
      wrongFeedback: 'c5.',
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_6Qe2_after_Qe2, text: 'White plays 6.Qe2 instead of castling.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },

    // ── PREDICT/REVEAL 1: 6...a6 ──
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_Qe2,
      correctMove: 'a6',
      prompt: "White delayed castling with Qe2. What do you play?",
      hint: 'Same idea as the main line — prevent Bb5 and stay flexible.',
      correctFeedback: "a6! Same plan, same move. Prevent Bb5 and prepare to develop.",
      wrongFeedback: 'Play a6 to prevent Bb5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_6Qe2_after_a6,
      text: "a6 works here just like in the main line. Whether White castles or plays Qe2, your plan stays the same.",
      arrow: ['a7', 'a6'],
    },

    // ── PREDICT/REVEAL 2: 7.dxc5 Bxc5 ──
    { type: 'instruction', fen: FEN.dev_6Qe2_after_dxc5, text: 'White captures on c5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'White took on c5. How do you recapture?',
      hint: 'Develop a piece while recapturing.',
      correctFeedback: "Bxc5! The bishop develops to an active square, just like the main line.",
      wrongFeedback: 'Recapture with Bxc5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_6Qe2_after_Bxc5,
      text: "Bxc5 develops the bishop to a strong diagonal. With the queen on e2, there's no early queen trade this time.",
      arrow: ['f8', 'c5'],
    },

    // ── PREDICT/REVEAL 3: 8.O-O Nc6 ──
    { type: 'instruction', fen: FEN.dev_6Qe2_after_OO, text: 'White castles.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_OO,
      correctMove: 'Nc6',
      prompt: "White has castled. Time to bring more pieces into the game.",
      hint: 'Develop the knight to a natural square where it controls the center.',
      correctFeedback: "Nc6! The knight develops to c6, controlling d4 and e5. Classic development.",
      wrongFeedback: 'Develop the knight to c6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_6Qe2_after_Nc6,
      text: "Nc6 puts the knight on a great square. It controls the center and prepares to castle. You're fully developed and comfortable.",
      arrow: ['b8', 'c6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_6Qe2_after_Qe2,
      text: "White played 6.Qe2. Play it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_Qe2,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    { type: 'instruction', fen: FEN.dev_6Qe2_after_dxc5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'Your move.',
      hint: 'Bxc5.',
      correctFeedback: 'Bxc5.',
      wrongFeedback: 'Bxc5.',
    },
    { type: 'instruction', fen: FEN.dev_6Qe2_after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_OO,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_6Qe2_after_Nc6,
      text: "Against 6.Qe2, you play the same natural moves. a6, Bxc5, Nc6 — simple and solid.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-dev-7Qe2: DEVIATION 7.Qe2 (instead of 7.dxc5)
// After 6...a6, White plays 7.Qe2 instead of 7.dxc5
// Black responds: 7...b5, 8...Bb7, 9...Nbd7
// ═══════════════════════════════════════════════════════════

const QGA_DEV_7QE2: OpeningLesson = {
  id: 'qga-dev-7Qe2',
  title: 'Dev 7.Qe2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "Sometimes White plays 7.Qe2 instead of trading pawns. Your plan: expand with b5, fianchetto the bishop, and develop the knight.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick review first.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5!',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5!',
      wrongFeedback: 'c5.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6!',
      wrongFeedback: 'a6.',
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Qe2, text: 'White plays 7.Qe2 instead of 7.dxc5.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },

    // ── PREDICT/REVEAL 1: 7...b5 ──
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Qe2,
      correctMove: 'b5',
      prompt: "White played Qe2 instead of taking. What's your plan?",
      hint: 'Kick the bishop off the c4 diagonal and gain queenside space.',
      correctFeedback: "b5! The bishop must retreat and you gain space on the queenside.",
      wrongFeedback: 'Play b5 to kick the bishop and expand.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_7Qe2_after_b5,
      text: "b5 gains space and forces the bishop to retreat. You're taking over the queenside.",
      arrow: ['b7', 'b5'],
    },

    // ── PREDICT/REVEAL 2: 8.Bb3 Bb7 ──
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Bb3, text: 'The bishop retreats to b3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Bb3,
      correctMove: 'Bb7',
      prompt: 'The bishop retreated. How do you continue developing?',
      hint: 'Fianchetto your bishop on the long diagonal.',
      correctFeedback: "Bb7! The bishop fires down the long diagonal, putting pressure on e4 and g2.",
      wrongFeedback: 'Develop the bishop to b7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_7Qe2_after_Bb7,
      text: "Bb7 is a powerful fianchetto. The bishop controls the a8-h1 diagonal and supports your central play.",
      arrow: ['c8', 'b7'],
    },

    // ── PREDICT/REVEAL 3: 9.Rd1 Nbd7 ──
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Rd1, text: 'White plays Rd1, centralizing the rook.', autoAdvance: 800, highlightSquares: ['f1', 'd1'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Rd1,
      correctMove: 'Nbd7',
      prompt: "White centralized the rook. How do you continue?",
      hint: 'Develop your last minor piece — the knight needs to join the game.',
      correctFeedback: "Nbd7! The knight develops naturally, supporting e5 and c5 ideas.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_7Qe2_after_Nbd7,
      text: "Nbd7 completes your development. The knight supports c5 and e5 breaks, and you have a flexible, active position.",
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_7Qe2_after_Qe2,
      text: "White played 7.Qe2. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Qe2,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Bb3, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Bb3,
      correctMove: 'Bb7',
      prompt: 'Your move.',
      hint: 'Bb7.',
      correctFeedback: 'Bb7.',
      wrongFeedback: 'Bb7.',
    },
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Rd1, text: 'Rd1.', autoAdvance: 800, highlightSquares: ['f1', 'd1'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Rd1,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_7Qe2_after_Nbd7,
      text: "Against 7.Qe2, you expand with b5, fianchetto to b7, and develop with Nbd7. A great position for Black.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qga-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const QGA_TEST_1: OpeningLesson = {
  id: 'qga-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time to prove you know the Queen's Gambit Accepted. Play the full main line from memory.",
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    { type: 'instruction', fen: FEN.after_dxc5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'Your move.',
      hint: 'Bxc5.',
      correctFeedback: 'Bxc5.',
      wrongFeedback: 'Bxc5.',
    },
    { type: 'instruction', fen: FEN.after_Qxd8, text: 'Qxd8+.', autoAdvance: 800, highlightSquares: ['d1', 'd8'] },
    {
      type: 'play-move',
      fen: FEN.after_Qxd8,
      correctMove: 'Kxd8',
      prompt: 'Your move.',
      hint: 'Kxd8.',
      correctFeedback: 'Kxd8.',
      wrongFeedback: 'Kxd8.',
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['c4', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Ke7',
      prompt: 'Your move.',
      hint: 'Ke7.',
      correctFeedback: 'Ke7.',
      wrongFeedback: 'Ke7.',
    },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'Bd7',
      prompt: 'Your move.',
      hint: 'Bd7.',
      correctFeedback: 'Bd7.',
      wrongFeedback: 'Bd7.',
    },
    { type: 'instruction', fen: FEN.after_b3, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    {
      type: 'play-move',
      fen: FEN.after_b3,
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
    { type: 'instruction', fen: FEN.after_Nc4, text: 'Nc4.', autoAdvance: 800, highlightSquares: ['d2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc4,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Main line done. Now handle the deviations.",
    },

    // Deviation 1: 4.Nc3
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nc3, text: "White plays 4.Nc3 instead of 4.e3.", autoAdvance: 1200, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e4,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e5,
      correctMove: 'Nd5',
      prompt: 'Your move.',
      hint: 'Nd5.',
      correctFeedback: 'Nd5.',
      wrongFeedback: 'Nd5.',
    },

    // Deviation 2: 6.Qe2
    { type: 'instruction', fen: FEN.dev_6Qe2_after_Qe2, text: "White plays 6.Qe2 instead of 6.O-O.", autoAdvance: 1200, highlightSquares: ['d1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_Qe2,
      correctMove: 'a6',
      prompt: 'Your move.',
      hint: 'a6.',
      correctFeedback: 'a6.',
      wrongFeedback: 'a6.',
    },
    { type: 'instruction', fen: FEN.dev_6Qe2_after_dxc5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_dxc5,
      correctMove: 'Bxc5',
      prompt: 'Your move.',
      hint: 'Bxc5.',
      correctFeedback: 'Bxc5.',
      wrongFeedback: 'Bxc5.',
    },
    { type: 'instruction', fen: FEN.dev_6Qe2_after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.dev_6Qe2_after_OO,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },

    // Deviation 3: 7.Qe2
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Qe2, text: "White plays 7.Qe2 instead of 7.dxc5.", autoAdvance: 1200, highlightSquares: ['d1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Qe2,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Bb3, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Bb3,
      correctMove: 'Bb7',
      prompt: 'Your move.',
      hint: 'Bb7.',
      correctFeedback: 'Bb7.',
      wrongFeedback: 'Bb7.',
    },
    { type: 'instruction', fen: FEN.dev_7Qe2_after_Rd1, text: 'Rd1.', autoAdvance: 800, highlightSquares: ['f1', 'd1'] },
    {
      type: 'play-move',
      fen: FEN.dev_7Qe2_after_Rd1,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const QGA_LESSONS: Record<string, OpeningLesson> = {
  'qga-1': QGA_1,
  'qga-2': QGA_2,
  'qga-3': QGA_3,
  'qga-4': QGA_4,
  'qga-dev-Nc3': QGA_DEV_NC3,
  'qga-dev-6Qe2': QGA_DEV_6QE2,
  'qga-dev-7Qe2': QGA_DEV_7QE2,
  'qga-test-1': QGA_TEST_1,
}

export function getQueensGambitAcceptedLesson(id: string): OpeningLesson | undefined {
  return QGA_LESSONS[id]
}
