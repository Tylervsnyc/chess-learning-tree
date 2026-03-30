import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// FRENCH WINAWER LESSONS (fw-1 through fw-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line:
// 1.e4 e6 2.d4 d5 3.Nc3 Bb4
// 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
// 7.Qg4 O-O 8.Bd3 Nbc6 9.Qh5 Ng6
// 10.Nf3 Qc7 11.Be3 c4 12.Bxg6 fxg6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e6:    'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:    'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:   'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  after_Bb4:   'rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4',

  // Main lesson 2: 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
  after_e5:    'rnbqk1nr/ppp2ppp/4p3/3pP3/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  after_c5:    'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
  after_a3:    'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/P1N5/1PP2PPP/R1BQKBNR b KQkq - 0 5',
  after_Bxc3:  'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1b5/1PP2PPP/R1BQKBNR w KQkq - 0 6',
  after_bxc3:  'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq - 0 6',
  after_Ne7:   'rnbqk2r/pp2nppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR w KQkq - 1 7',

  // Main lesson 3: 7.Qg4 O-O 8.Bd3 Nbc6 9.Qh5 Ng6
  after_Qg4:   'rnbqk2r/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR b KQkq - 2 7',
  after_OO:    'rnbq1rk1/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR w KQ - 3 8',
  after_Bd3:   'rnbq1rk1/pp2nppp/4p3/2ppP3/3P2Q1/P1PB4/2P2PPP/R1B1K1NR b KQ - 4 8',
  after_Nbc6:  'r1bq1rk1/pp2nppp/2n1p3/2ppP3/3P2Q1/P1PB4/2P2PPP/R1B1K1NR w KQ - 5 9',
  after_Qh5:   'r1bq1rk1/pp2nppp/2n1p3/2ppP2Q/3P4/P1PB4/2P2PPP/R1B1K1NR b KQ - 6 9',
  after_Ng6:   'r1bq1rk1/pp3ppp/2n1p1n1/2ppP2Q/3P4/P1PB4/2P2PPP/R1B1K1NR w KQ - 7 10',

  // Main lesson 4: 10.Nf3 Qc7 11.Be3 c4 12.Bxg6 fxg6
  after_Nf3:   'r1bq1rk1/pp3ppp/2n1p1n1/2ppP2Q/3P4/P1PB1N2/2P2PPP/R1B1K2R b KQ - 8 10',
  after_Qc7:   'r1b2rk1/ppq2ppp/2n1p1n1/2ppP2Q/3P4/P1PB1N2/2P2PPP/R1B1K2R w KQ - 9 11',
  after_Be3:   'r1b2rk1/ppq2ppp/2n1p1n1/2ppP2Q/3P4/P1PBBN2/2P2PPP/R3K2R b KQ - 10 11',
  after_c4:    'r1b2rk1/ppq2ppp/2n1p1n1/3pP2Q/2pP4/P1PBBN2/2P2PPP/R3K2R w KQ - 0 12',
  after_Bxg6:  'r1b2rk1/ppq2ppp/2n1p1B1/3pP2Q/2pP4/P1P1BN2/2P2PPP/R3K2R b KQ - 0 12',
  after_fxg6:  'r1b2rk1/ppq3pp/2n1p1p1/3pP2Q/2pP4/P1P1BN2/2P2PPP/R3K2R w KQ - 0 13',

  // Deviation: 4.exd5 (instead of 4.e5)
  dev_exd5_after_exd5:   'rnbqk1nr/ppp2ppp/4p3/3P4/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  dev_exd5_after_exd5_b: 'rnbqk1nr/ppp2ppp/8/3p4/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
  dev_exd5_after_Bd3:    'rnbqk1nr/ppp2ppp/8/3p4/1b1P4/2NB4/PPP2PPP/R1BQK1NR b KQkq - 1 5',
  dev_exd5_after_Nc6:    'r1bqk1nr/ppp2ppp/2n5/3p4/1b1P4/2NB4/PPP2PPP/R1BQK1NR w KQkq - 2 6',
  dev_exd5_after_a3:     'r1bqk1nr/ppp2ppp/2n5/3p4/1b1P4/P1NB4/1PP2PPP/R1BQK1NR b KQkq - 0 6',
  dev_exd5_after_Bxc3:   'r1bqk1nr/ppp2ppp/2n5/3p4/3P4/P1bB4/1PP2PPP/R1BQK1NR w KQkq - 0 7',
  dev_exd5_after_bxc3:   'r1bqk1nr/ppp2ppp/2n5/3p4/3P4/P1PB4/2P2PPP/R1BQK1NR b KQkq - 0 7',
  dev_exd5_after_Nge7:   'r1bqk2r/ppp1nppp/2n5/3p4/3P4/P1PB4/2P2PPP/R1BQK1NR w KQkq - 1 8',

  // Deviation: 5.Bd2 (instead of 5.a3)
  dev_Bd2_after_Bd2:   'rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/2N5/PPPB1PPP/R2QKBNR b KQkq - 1 5',
  dev_Bd2_after_Ne7:   'rnbqk2r/pp2nppp/4p3/2ppP3/1b1P4/2N5/PPPB1PPP/R2QKBNR w KQkq - 2 6',
  dev_Bd2_after_Nb5:   'rnbqk2r/pp2nppp/4p3/1NppP3/1b1P4/8/PPPB1PPP/R2QKBNR b KQkq - 3 6',
  dev_Bd2_after_Bxd2:  'rnbqk2r/pp2nppp/4p3/1NppP3/3P4/8/PPPb1PPP/R2QKBNR w KQkq - 0 7',
  dev_Bd2_after_Qxd2:  'rnbqk2r/pp2nppp/4p3/1NppP3/3P4/8/PPPQ1PPP/R3KBNR b KQkq - 0 7',
  dev_Bd2_after_OO:    'rnbq1rk1/pp2nppp/4p3/1NppP3/3P4/8/PPPQ1PPP/R3KBNR w KQ - 1 8',

  // Deviation: 7.Nf3 (instead of 7.Qg4)
  dev_Nf3_after_Nf3:   'rnbqk2r/pp2nppp/4p3/2ppP3/3P4/P1P2N2/2P2PPP/R1BQKB1R b KQkq - 2 7',
  dev_Nf3_after_Bd7:   'rn1qk2r/pp1bnppp/4p3/2ppP3/3P4/P1P2N2/2P2PPP/R1BQKB1R w KQkq - 3 8',
  dev_Nf3_after_a4:    'rn1qk2r/pp1bnppp/4p3/2ppP3/P2P4/2P2N2/2P2PPP/R1BQKB1R b KQkq - 0 8',
  dev_Nf3_after_Qa5:   'rn2k2r/pp1bnppp/4p3/q1ppP3/P2P4/2P2N2/2P2PPP/R1BQKB1R w KQkq - 1 9',
  dev_Nf3_after_Bd2:   'rn2k2r/pp1bnppp/4p3/q1ppP3/P2P4/2P2N2/2PB1PPP/R2QKB1R b KQkq - 2 9',
  dev_Nf3_after_Nbc6:  'r3k2r/pp1bnppp/2n1p3/q1ppP3/P2P4/2P2N2/2PB1PPP/R2QKB1R w KQkq - 3 10',
}


// ═══════════════════════════════════════════════════════════
// fw-1: The Winawer Pin (e6, d5, Bb4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const FW_1: OpeningLesson = {
  id: 'fw-1',
  title: 'The Winawer Pin',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The French Winawer starts with 1...e6, 2...d5, and then pins the knight with Bb4. You'll learn the sharpest line against 3.Nc3." },

    // White plays 1.e4
    { type: 'instruction', fen: FEN.start, text: 'White opens with e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 1: e6
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'How does the French Defense begin?', hint: 'A solid pawn to e6 — sets up d5 next.', correctFeedback: 'e6 prepares to challenge the center with d5 on the next move.', wrongFeedback: 'Play e6 — the French Defense starts here.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6 is solid and strategic. It guards d5 so you can challenge White\'s center next move.', arrow: ['e7', 'e6'] },

    // White plays 2.d4
    { type: 'instruction', fen: FEN.after_e6, text: 'White pushes d4, claiming the center.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 2: d5
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'White controls the center. How do you fight back?', hint: 'Challenge the e4 pawn directly.', correctFeedback: 'd5 challenges the e4 pawn and stakes your claim in the center.', wrongFeedback: 'Play d5 — fight for the center.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5 hits the e4 pawn head-on. White has to make a decision about the center tension.', arrow: ['d7', 'd5'] },

    // White plays 3.Nc3
    { type: 'instruction', fen: FEN.after_d5, text: 'White defends e4 with the knight.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 3: Bb4
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'White defended e4 with the knight. How do you keep the pressure on?', hint: 'Pin the knight that\'s defending e4.', correctFeedback: 'Bb4 pins the knight to the king — the Winawer Variation.', wrongFeedback: 'Play Bb4 — pin the knight that defends e4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4 pins the c3 knight to the king. If the knight moves, the e4 pawn falls. This is the Winawer — sharp and combative.', arrow: ['f8', 'b4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    { type: 'instruction', fen: FEN.after_Bb4, text: "e6, d5, Bb4 — the Winawer is on the board. That pin is going to cause White some headaches." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-2: Into the Storm (c5, Bxc3+, Ne7)
// ═══════════════════════════════════════════════════════════

const FW_2: OpeningLesson = {
  id: 'fw-2',
  title: 'Into the Storm',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb4, text: "White pushes e5 to gain space. You'll fight back with c5, trade the bishop, and develop the knight to e7." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    // White plays 4.e5
    { type: 'instruction', fen: FEN.after_Bb4, text: 'White pushes e5, gaining space and locking the center.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },

    // PREDICT 1: c5
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'White grabbed space with e5. How do you fight back?', hint: 'Attack the d4 pawn — the base of White\'s pawn chain.', correctFeedback: 'c5 attacks the base of White\'s pawn chain on d4.', wrongFeedback: 'Play c5 — strike at the base of the pawn chain.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'c5 attacks d4 — the foundation of White\'s center. In the French, you always attack the base of the pawn chain.', arrow: ['c7', 'c5'] },

    // White plays 5.a3
    { type: 'instruction', fen: FEN.after_c5, text: 'White plays a3, asking the bishop what it wants to do.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },

    // PREDICT 2: Bxc3+
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'White asks the bishop to decide. What do you play?', hint: 'Take the knight — you planned this trade all along.', correctFeedback: 'Bxc3+ trades the bishop for the knight and doubles White\'s pawns.', wrongFeedback: 'Take the knight — Bxc3+ gives check and doubles the pawns.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Bxc3+ doubles White\'s c-pawns. You gave up the bishop pair, but White\'s pawn structure is permanently damaged.', arrow: ['b4', 'c3'] },

    // White recaptures bxc3
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'White recaptures bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },

    // PREDICT 3: Ne7
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Ne7', prompt: 'Time to develop. Where does the knight go?', hint: 'The knight goes to e7, not f6 — e7 keeps options open and avoids blocking the f-pawn.', correctFeedback: 'Ne7 develops the knight without blocking the f-pawn, keeping options to reroute to g6.', wrongFeedback: 'Play Ne7 — it keeps the f-pawn free and the knight can reroute later.' },
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Ne7 is the key move in the Winawer. The knight stays flexible — it can go to g6 to defend, or to f5 to attack.', arrow: ['g8', 'e7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bb4, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    { type: 'instruction', fen: FEN.after_Ne7, text: "c5, Bxc3+, Ne7 — you've traded the bishop for a knight, doubled White's pawns, and kept your knight flexible." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-dev-exd5: White plays 4.exd5 instead of 4.e5
// ═══════════════════════════════════════════════════════════

const FW_DEV_EXD5: OpeningLesson = {
  id: 'fw-dev-exd5',
  title: 'Dev 4.exd5',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb4, text: "Sometimes White captures 4.exd5 instead of pushing e5. The position opens up — here's how to develop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Bb4, text: 'White captures exd5 instead of pushing e5 — the Exchange Variation.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },

    // PREDICT 1: exd5
    { type: 'play-move', fen: FEN.dev_exd5_after_exd5, correctMove: 'exd5', prompt: 'White took on d5. How do you recapture?', hint: 'Take back with the e-pawn to open the e-file.', correctFeedback: 'exd5 recaptures and opens the e-file for your rook later.', wrongFeedback: 'Recapture with exd5 — open the e-file.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_exd5_b, text: 'exd5 opens the position. Your bishop on b4 is still pinning the knight, and the e-file will be useful.', arrow: ['e6', 'd5'] },

    // White plays 5.Bd3
    { type: 'instruction', fen: FEN.dev_exd5_after_exd5_b, text: 'White develops the bishop to d3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 2: Nc6
    { type: 'play-move', fen: FEN.dev_exd5_after_Bd3, correctMove: 'Nc6', prompt: 'How do you continue developing?', hint: 'Develop the knight and pressure d4.', correctFeedback: 'Nc6 develops the knight and puts pressure on the d4 pawn.', wrongFeedback: 'Play Nc6 — develop and target d4.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_Nc6, text: 'Nc6 develops naturally and pressures d4. The pin on c3 is still annoying for White.', arrow: ['b8', 'c6'] },

    // White plays 6.a3
    { type: 'instruction', fen: FEN.dev_exd5_after_Nc6, text: 'White plays a3, asking the bishop to decide.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },

    // PREDICT 3: Bxc3+
    { type: 'play-move', fen: FEN.dev_exd5_after_a3, correctMove: 'Bxc3+', prompt: 'White asks about the bishop again. What do you play?', hint: 'Trade the bishop for the knight, just like in the main line.', correctFeedback: 'Bxc3+ trades and doubles the pawns — same idea as the main line.', wrongFeedback: 'Play Bxc3+ — double the pawns.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_Bxc3, text: 'Bxc3+ doubles White\'s pawns again. In the exchange line, your pieces develop quickly and the doubled pawns are a lasting weakness.', arrow: ['b4', 'c3'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_exd5_after_exd5, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.dev_exd5_after_exd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_exd5_b, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_Bd3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_Nc6, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },

    { type: 'instruction', fen: FEN.dev_exd5_after_Bxc3, text: "exd5, Nc6, Bxc3+ — against the exchange, you develop quickly and double the pawns. Simple and effective." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-dev-Bd2: White plays 5.Bd2 instead of 5.a3
// ═══════════════════════════════════════════════════════════

const FW_DEV_BD2: OpeningLesson = {
  id: 'fw-dev-Bd2',
  title: 'Dev 5.Bd2',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_c5, text: "Sometimes White plays 5.Bd2 instead of 5.a3 — protecting the knight differently. Here's how to handle it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_c5, text: 'White plays Bd2 instead of a3 — defending the knight while developing.', autoAdvance: 800, highlightSquares: ['c1', 'd2'] },

    // PREDICT 1: Ne7
    { type: 'play-move', fen: FEN.dev_Bd2_after_Bd2, correctMove: 'Ne7', prompt: 'White played Bd2. How do you develop?', hint: 'Develop the knight — same as the main line.', correctFeedback: 'Ne7 develops the knight flexibly, keeping the f-pawn free.', wrongFeedback: 'Play Ne7 — develop the knight to its best square.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Ne7, text: 'Ne7 stays flexible. The knight can go to g6 or f5 depending on what White does next.', arrow: ['g8', 'e7'] },

    // White plays 6.Nb5
    { type: 'instruction', fen: FEN.dev_Bd2_after_Ne7, text: 'White jumps the knight to b5, eyeing c7 and d6.', autoAdvance: 800, highlightSquares: ['c3', 'b5'] },

    // PREDICT 2: Bxd2+
    { type: 'play-move', fen: FEN.dev_Bd2_after_Nb5, correctMove: 'Bxd2+', prompt: 'White\'s knight jumped to b5. How do you respond?', hint: 'Trade the bishop for the d2 bishop before it causes trouble.', correctFeedback: 'Bxd2+ trades bishops and forces White to recapture, wasting tempo.', wrongFeedback: 'Play Bxd2+ — trade the bishop with check.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Bxd2, text: 'Bxd2+ trades the bishop and forces the queen to recapture, losing some coordination.', arrow: ['b4', 'd2'] },

    // White recaptures Qxd2
    { type: 'instruction', fen: FEN.dev_Bd2_after_Bxd2, text: 'White recaptures Qxd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.dev_Bd2_after_Qxd2, correctMove: 'O-O', prompt: 'How do you get your king to safety?', hint: 'Castle kingside — tuck the king away.', correctFeedback: 'O-O gets the king safe and connects the rooks.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_OO, text: 'O-O is safe and natural. The knight on b5 looks aggressive but doesn\'t have a great follow-up — you\'re well developed.', arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Bd2_after_Bd2, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Bd2, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Ne7, text: 'Nb5.', autoAdvance: 800, highlightSquares: ['c3', 'b5'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Nb5, correctMove: 'Bxd2+', prompt: 'Your move.', hint: 'Bxd2+.', correctFeedback: 'Bxd2+.', wrongFeedback: 'Bxd2+.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Bxd2, text: 'Qxd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Qxd2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.dev_Bd2_after_OO, text: "Ne7, Bxd2+, O-O — against 5.Bd2 you develop smoothly and castle quickly. Nothing to worry about." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-3: The Queen Attack (O-O, Nbc6, Ng6)
// ═══════════════════════════════════════════════════════════

const FW_3: OpeningLesson = {
  id: 'fw-3',
  title: 'The Queen Attack',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Ne7, text: "White brings the queen to g4, attacking g7. You'll castle into it, develop, and reroute the knight to g6 for defense." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bb4, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    // White plays 7.Qg4
    { type: 'instruction', fen: FEN.after_Ne7, text: 'White swings the queen to g4, attacking g7.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'The queen is attacking g7. What do you play?', hint: 'Castle — the rook defends f7 and your king is safe behind the pawns.', correctFeedback: 'O-O castles into the attack, but the king is perfectly safe. The g7 pawn is now protected.', wrongFeedback: 'Castle kingside — O-O. It looks scary but the king is safe.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Castling into the queen attack is the brave and correct move. The g7 pawn is defended, and your rook activates on f8.', arrow: ['e8', 'g8'] },

    // White plays 8.Bd3
    { type: 'instruction', fen: FEN.after_OO, text: 'White develops the bishop to d3, eyeing the kingside.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 2: Nbc6
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbc6', prompt: 'How do you continue developing?', hint: 'Develop the other knight and put pressure on d4 and e5.', correctFeedback: 'Nbc6 develops the knight and targets both d4 and e5.', wrongFeedback: 'Play Nbc6 — develop and pressure the center.' },
    { type: 'instruction', fen: FEN.after_Nbc6, text: 'Nbc6 puts pressure on d4 and e5. The knight also supports a future queenside counterattack.', arrow: ['b8', 'c6'] },

    // White plays 9.Qh5
    { type: 'instruction', fen: FEN.after_Nbc6, text: 'White shifts the queen to h5, increasing kingside pressure.', autoAdvance: 800, highlightSquares: ['g4', 'h5'] },

    // PREDICT 3: Ng6
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'Ng6', prompt: 'The queen moved to h5. How do you defend?', hint: 'Reroute the knight from e7 to defend the kingside.', correctFeedback: 'Ng6 reroutes the knight to defend f8 and h8, keeping the kingside solid.', wrongFeedback: 'Play Ng6 — the knight defends from g6.' },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Ng6 is a key defensive move. The knight protects f8 and h8, and it\'s ready to jump to f4 or e5 later.', arrow: ['e7', 'g6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ne7, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },
    { type: 'instruction', fen: FEN.after_Nbc6, text: 'Qh5.', autoAdvance: 800, highlightSquares: ['g4', 'h5'] },
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },

    { type: 'instruction', fen: FEN.after_Ng6, text: "O-O, Nbc6, Ng6 — you castled into the attack and defended perfectly. The queen on h5 looks scary but isn't doing much." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-dev-Nf3: White plays 7.Nf3 instead of 7.Qg4
// ═══════════════════════════════════════════════════════════

const FW_DEV_NF3: OpeningLesson = {
  id: 'fw-dev-Nf3',
  title: 'Dev 7.Nf3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Ne7, text: "Sometimes White develops the knight to f3 instead of Qg4 — a calmer approach. Here's how to get active on the queenside." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bb4, text: "Let's make sure you've got the basics down." },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Ne7, text: 'White develops Nf3 instead of the aggressive Qg4.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 1: Bd7
    { type: 'play-move', fen: FEN.dev_Nf3_after_Nf3, correctMove: 'Bd7', prompt: 'White chose a quieter setup with Nf3. How do you develop?', hint: 'Develop the bishop — it was stuck behind the pawns.', correctFeedback: 'Bd7 develops the last minor piece and connects the rooks.', wrongFeedback: 'Play Bd7 — develop the bishop.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Bd7, text: 'Bd7 develops naturally. The bishop supports a future Qa5 and prepares to castle queenside or kingside.', arrow: ['c8', 'd7'] },

    // White plays 8.a4
    { type: 'instruction', fen: FEN.dev_Nf3_after_Bd7, text: 'White pushes a4, grabbing queenside space.', autoAdvance: 800, highlightSquares: ['a3', 'a4'] },

    // PREDICT 2: Qa5
    { type: 'play-move', fen: FEN.dev_Nf3_after_a4, correctMove: 'Qa5', prompt: 'White pushed a4. How do you create queenside pressure?', hint: 'Activate the queen on the queenside, targeting the c3 pawn.', correctFeedback: 'Qa5 targets the weak c3 pawn and creates queenside pressure.', wrongFeedback: 'Play Qa5 — target the doubled c3 pawn.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qa5, text: 'Qa5 pressures the c3 pawn and keeps White tied down. The doubled pawns are a real target.', arrow: ['d8', 'a5'] },

    // White plays 9.Bd2
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qa5, text: 'White develops Bd2, defending c3.', autoAdvance: 800, highlightSquares: ['c1', 'd2'] },

    // PREDICT 3: Nbc6
    { type: 'play-move', fen: FEN.dev_Nf3_after_Bd2, correctMove: 'Nbc6', prompt: 'How do you keep developing?', hint: 'Bring the knight out — pressure d4 and e5.', correctFeedback: 'Nbc6 develops the last piece and increases central pressure.', wrongFeedback: 'Play Nbc6 — develop and pressure the center.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Nbc6, text: 'Nbc6 completes development and pressures d4 and e5. You\'re fully mobilized while White is still sorting out the doubled pawns.', arrow: ['b8', 'c6'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Nf3_after_Nf3, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Nf3, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Bd7, text: 'a4.', autoAdvance: 800, highlightSquares: ['a3', 'a4'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_a4, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qa5, text: 'Bd2.', autoAdvance: 800, highlightSquares: ['c1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Bd2, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },

    { type: 'instruction', fen: FEN.dev_Nf3_after_Nbc6, text: "Bd7, Qa5, Nbc6 — against the quiet Nf3 you go for queenside pressure. Those doubled pawns won't fix themselves." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-4: Counterplay (Qc7, c4, fxg6)
// ═══════════════════════════════════════════════════════════

const FW_4: OpeningLesson = {
  id: 'fw-4',
  title: 'Counterplay',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Ng6, text: "White develops the knight and bishop. You'll activate the queen, push c4 to cramp White, and recapture on g6 to open the f-file." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Ne7, text: "Run through the line first." },
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },
    { type: 'instruction', fen: FEN.after_Nbc6, text: 'Qh5.', autoAdvance: 800, highlightSquares: ['g4', 'h5'] },
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },

    // White plays 10.Nf3
    { type: 'instruction', fen: FEN.after_Ng6, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 1: Qc7
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Qc7', prompt: 'How do you activate the queen?', hint: 'The queen goes to c7, eyeing the c-file and supporting c4.', correctFeedback: 'Qc7 activates the queen and prepares the c4 push.', wrongFeedback: 'Play Qc7 — activate the queen and prepare c4.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7 is a multi-purpose move. The queen eyes the c-file, supports c4, and puts indirect pressure on e5.', arrow: ['d8', 'c7'] },

    // White plays 11.Be3
    { type: 'instruction', fen: FEN.after_Qc7, text: 'White develops the bishop to e3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 2: c4
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'c4', prompt: 'Time to advance. What pawn push locks down the queenside?', hint: 'Push the c-pawn to c4, trapping the d3 bishop.', correctFeedback: 'c4 locks the d3 bishop out of the game — it has no good retreat.', wrongFeedback: 'Play c4 — trap the bishop on d3.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4 is a strong positional move. The bishop on d3 is now stuck — it can\'t retreat to c2 because of the pawn on c4.', arrow: ['c5', 'c4'] },

    // White plays 12.Bxg6
    { type: 'instruction', fen: FEN.after_c4, text: 'White captures Bxg6, trading the trapped bishop.', autoAdvance: 800, highlightSquares: ['d3', 'g6'] },

    // PREDICT 3: fxg6
    { type: 'play-move', fen: FEN.after_Bxg6, correctMove: 'fxg6', prompt: 'White traded the bishop. How do you recapture?', hint: 'Take with the f-pawn — open the f-file for your rook.', correctFeedback: 'fxg6 opens the f-file for the rook, creating attacking chances.', wrongFeedback: 'Recapture fxg6 — the f-file is a powerful weapon.' },
    { type: 'instruction', fen: FEN.after_fxg6, text: 'fxg6 opens the f-file. Your rook on f8 is now staring down the file, and the doubled g-pawns are not a weakness — they control key squares.', arrow: ['f7', 'g6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ng6, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'Bxg6.', autoAdvance: 800, highlightSquares: ['d3', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bxg6, correctMove: 'fxg6', prompt: 'Your move.', hint: 'fxg6.', correctFeedback: 'fxg6.', wrongFeedback: 'fxg6.' },

    { type: 'instruction', fen: FEN.after_fxg6, text: "Qc7, c4, fxg6 — you've activated the queen, trapped the bishop, and opened the f-file. The Winawer is in full swing." },
  ],
}


// ═══════════════════════════════════════════════════════════
// fw-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const FW_TEST_1: OpeningLesson = {
  id: 'fw-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE RECALL (all 12 Black moves) ===
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },
    { type: 'instruction', fen: FEN.after_Nbc6, text: 'Qh5.', autoAdvance: 800, highlightSquares: ['g4', 'h5'] },
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'Bxg6.', autoAdvance: 800, highlightSquares: ['d3', 'g6'] },
    { type: 'play-move', fen: FEN.after_Bxg6, correctMove: 'fxg6', prompt: 'Your move.', hint: 'fxg6.', correctFeedback: 'fxg6.', wrongFeedback: 'fxg6.' },

    // === DEVIATION: 4.exd5 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_Bb4, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_exd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_exd5_b, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_Bd3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_exd5_after_Nc6, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.dev_exd5_after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },

    // === DEVIATION: 5.Bd2 ===
    // Replay to deviation point (after 4.e5 c5)
    { type: 'instruction', fen: FEN.after_c5, text: 'Bd2.', autoAdvance: 800, highlightSquares: ['c1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Bd2, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Ne7, text: 'Nb5.', autoAdvance: 800, highlightSquares: ['c3', 'b5'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Nb5, correctMove: 'Bxd2+', prompt: 'Your move.', hint: 'Bxd2+.', correctFeedback: 'Bxd2+.', wrongFeedback: 'Bxd2+.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Bxd2, text: 'Qxd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Qxd2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // === DEVIATION: 7.Nf3 ===
    // Replay to deviation point (after 6...Ne7)
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Nf3, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Bd7, text: 'a4.', autoAdvance: 800, highlightSquares: ['a3', 'a4'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_a4, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qa5, text: 'Bd2.', autoAdvance: 800, highlightSquares: ['c1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Bd2, correctMove: 'Nbc6', prompt: 'Your move.', hint: 'Nbc6.', correctFeedback: 'Nbc6.', wrongFeedback: 'Nbc6.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// Lookup function
// ═══════════════════════════════════════════════════════════

export function getFrenchWinawerLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'fw-1': return FW_1
    case 'fw-2': return FW_2
    case 'fw-dev-exd5': return FW_DEV_EXD5
    case 'fw-dev-Bd2': return FW_DEV_BD2
    case 'fw-3': return FW_3
    case 'fw-dev-Nf3': return FW_DEV_NF3
    case 'fw-4': return FW_4
    case 'fw-test-1': return FW_TEST_1
    default: return undefined
  }
}
