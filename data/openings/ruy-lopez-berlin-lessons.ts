import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// RUY LOPEZ: BERLIN DEFENSE — Level 1 (Predict/Reveal)
//
// Identity: 1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6
// Main line: 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5
//            8.Qxd8+ Kxd8 9.Nc3 Ke8 10.h3 h5 11.Bf4 Be7 12.Rad1
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Starting position
  start:          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  // Identity moves (1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6)
  after_e4:       'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:       'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bb5:      'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_Nf6:      'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',

  // Lesson 1: O-O, Nxe4, d4, Nd6, Bxc6
  after_OO:       'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4',
  after_Nxe4:     'r1bqkb1r/pppp1ppp/2n5/1B2p3/4n3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 5',
  after_d4:       'r1bqkb1r/pppp1ppp/2n5/1B2p3/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
  after_Nd6:      'r1bqkb1r/pppp1ppp/2nn4/1B2p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 6',
  after_Bxc6:     'r1bqkb1r/pppp1ppp/2Bn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 6',

  // Lesson 2: dxc6, dxe5, Nf5, Qxd8+, Kxd8, Nc3
  after_dxc6:     'r1bqkb1r/ppp2ppp/2pn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 7',
  after_dxe5:     'r1bqkb1r/ppp2ppp/2pn4/4P3/8/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 7',
  after_Nf5:      'r1bqkb1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 8',
  after_Qxd8:     'r1bQkb1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 b kq - 0 8',
  after_Kxd8:     'r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9',
  after_Nc3:      'r1bk1b1r/ppp2ppp/2p5/4Pn2/8/2N2N2/PPP2PPP/R1B2RK1 b - - 1 9',

  // Lesson 3: Ke8, h3, h5, Bf4
  after_Ke8:      'r1b1kb1r/ppp2ppp/2p5/4Pn2/8/2N2N2/PPP2PPP/R1B2RK1 w - - 2 10',
  after_h3:       'r1b1kb1r/ppp2ppp/2p5/4Pn2/8/2N2N1P/PPP2PP1/R1B2RK1 b - - 0 10',
  after_h5:       'r1b1kb1r/ppp2pp1/2p5/4Pn1p/8/2N2N1P/PPP2PP1/R1B2RK1 w - - 0 11',
  after_Bf4:      'r1b1kb1r/ppp2pp1/2p5/4Pn1p/5B2/2N2N1P/PPP2PP1/R4RK1 b - - 1 11',

  // Lesson 4: Be7, Rad1
  after_Be7:      'r1b1k2r/ppp1bpp1/2p5/4Pn1p/5B2/2N2N1P/PPP2PP1/R4RK1 w - - 2 12',
  after_Rad1:     'r1b1k2r/ppp1bpp1/2p5/4Pn1p/5B2/2N2N1P/PPP2PP1/3R1RK1 b - - 3 12',

  // Deviation: 4...Bc5 (instead of Nxe4)
  dev_Bc5:        'r1bqk2r/pppp1ppp/2n2n2/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 6 5',
  dev_Bc5_c3:     'r1bqk2r/pppp1ppp/2n2n2/1Bb1p3/4P3/2P2N2/PP1P1PPP/RNBQ1RK1 b kq - 0 5',
  dev_Bc5_OO:     'r1bq1rk1/pppp1ppp/2n2n2/1Bb1p3/4P3/2P2N2/PP1P1PPP/RNBQ1RK1 w - - 1 6',
  dev_Bc5_d4:     'r1bq1rk1/pppp1ppp/2n2n2/1Bb1p3/3PP3/2P2N2/PP3PPP/RNBQ1RK1 b - - 0 6',
  dev_Bc5_Bb6:    'r1bq1rk1/pppp1ppp/1bn2n2/1B2p3/3PP3/2P2N2/PP3PPP/RNBQ1RK1 w - - 1 7',
  dev_Bc5_Bg5:    'r1bq1rk1/pppp1ppp/1bn2n2/1B2p1B1/3PP3/2P2N2/PP3PPP/RN1Q1RK1 b - - 2 7',

  // Deviation: 5...Be7 (instead of Nd6)
  dev_Be7:        'r1bqk2r/ppppbppp/2n5/1B2p3/3Pn3/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 6',
  dev_Be7_Qe2:    'r1bqk2r/ppppbppp/2n5/1B2p3/3Pn3/5N2/PPP1QPPP/RNB2RK1 b kq - 2 6',
  dev_Be7_Nd6:    'r1bqk2r/ppppbppp/2nn4/1B2p3/3P4/5N2/PPP1QPPP/RNB2RK1 w kq - 3 7',
  dev_Be7_Bxc6:   'r1bqk2r/ppppbppp/2Bn4/4p3/3P4/5N2/PPP1QPPP/RNB2RK1 b kq - 0 7',
  dev_Be7_bxc6:   'r1bqk2r/p1ppbppp/2pn4/4p3/3P4/5N2/PPP1QPPP/RNB2RK1 w kq - 0 8',
  dev_Be7_dxe5:   'r1bqk2r/p1ppbppp/2pn4/4P3/8/5N2/PPP1QPPP/RNB2RK1 b kq - 0 8',

  // Deviation: 9...h6 (instead of Ke8)
  dev_h6:         'r1bk1b1r/ppp2pp1/2p4p/4Pn2/8/2N2N2/PPP2PPP/R1B2RK1 w - - 0 10',
  dev_h6_h3:      'r1bk1b1r/ppp2pp1/2p4p/4Pn2/8/2N2N1P/PPP2PP1/R1B2RK1 b - - 0 10',
  dev_h6_Bd7:     'r2k1b1r/pppb1pp1/2p4p/4Pn2/8/2N2N1P/PPP2PP1/R1B2RK1 w - - 1 11',
  dev_h6_b3:      'r2k1b1r/pppb1pp1/2p4p/4Pn2/8/1PN2N1P/P1P2PP1/R1B2RK1 b - - 0 11',
  dev_h6_Kc8:     'r1k2b1r/pppb1pp1/2p4p/4Pn2/8/1PN2N1P/P1P2PP1/R1B2RK1 w - - 1 12',
  dev_h6_Bb2:     'r1k2b1r/pppb1pp1/2p4p/4Pn2/8/1PN2N1P/PBP2PP1/R4RK1 b - - 2 12',
}

// ═══════════════════════════════════════════════════════════
// rlb-1: Castle Into It (O-O, d4, Bxc6)
// ═══════════════════════════════════════════════════════════

const RLB_LESSON_1: OpeningLesson = {
  id: 'rlb-1',
  title: 'Castle Into It',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nf6, text: "Black plays 3...Nf6, the Berlin Defense. Instead of retreating the bishop, you castle and let Black take the e4 pawn. It's a trap — you'll win it back with interest." },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: "Black attacks your e4 pawn. What's your move?", hint: 'Get your king to safety — you can afford to lose the pawn.', correctFeedback: 'Castling! You dare Black to take e4. Bold and best.', wrongFeedback: 'Castle kingside — let Black take the pawn, you have a plan.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O looks like you're ignoring the threat, but after Black takes on e4, you'll strike back with d4.", arrow: ['e1', 'g1'] },

    // Black plays Nxe4
    { type: 'instruction', fen: FEN.after_OO, text: "Black grabs the pawn with the knight.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },

    // PREDICT 2: d4
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: "Black took your pawn. How do you fight back?", hint: 'Push a center pawn to attack the knight and open lines.', correctFeedback: "d4 attacks the center and forces Black's knight to move.", wrongFeedback: 'Push d4 — attack the center and pressure the knight.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4 opens the center and attacks the knight on e4. Black's knight has to retreat to d6.", arrow: ['d2', 'd4'] },

    // Black plays Nd6
    { type: 'instruction', fen: FEN.after_d4, text: "The knight retreats to d6.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },

    // PREDICT 3: Bxc6
    { type: 'play-move', fen: FEN.after_Nd6, correctMove: 'Bxc6', prompt: "Your bishop on b5 is doing important work. Find the right exchange.", hint: 'Trade the bishop for the knight on c6 — damage Black\'s pawn structure.', correctFeedback: 'Bxc6 doubles Black\'s pawns and weakens their structure.', wrongFeedback: 'Capture the knight on c6 with your bishop.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Bxc6 gives up the bishop pair, but Black gets doubled c-pawns. That pawn weakness lasts the whole game.", arrow: ['b5', 'c6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nf6, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black takes on e4.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: "Knight retreats to d6.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Bxc6, text: "You've got the Berlin Defense started — castled, opened the center, and damaged Black's pawns." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlb-2: The Berlin Wall (dxe5, Qxd8+, Nc3)
// ═══════════════════════════════════════════════════════════

const RLB_LESSON_2: OpeningLesson = {
  id: 'rlb-2',
  title: 'The Berlin Wall',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures on c6 and you enter the famous Berlin endgame — queens come off the board early." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nf6, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black takes on e4.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: "Knight to d6.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },

    // Black plays dxc6
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures with the d-pawn.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },

    // PREDICT 1: dxe5
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'dxe5', prompt: "The e5 pawn is unprotected now. What do you play?", hint: 'Grab the free pawn in the center.', correctFeedback: 'dxe5 wins a pawn — the center is yours.', wrongFeedback: 'Take the e5 pawn with your d-pawn.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: "dxe5 wins a clean pawn. Black's knight hops to f5 next, eyeing the center.", arrow: ['d4', 'e5'] },

    // Black plays Nf5
    { type: 'instruction', fen: FEN.after_dxe5, text: "The knight jumps to f5.", autoAdvance: 800, highlightSquares: ['d6', 'f5'] },

    // PREDICT 2: Qxd8+
    { type: 'play-move', fen: FEN.after_Nf5, correctMove: 'Qxd8+', prompt: "Time for the signature Berlin move. Find the queen trade.", hint: 'Take the queen — it comes with check.', correctFeedback: "Qxd8+! The Berlin endgame begins.", wrongFeedback: 'Capture the queen on d8 — it gives check too.' },
    { type: 'instruction', fen: FEN.after_Qxd8, text: "Qxd8+ forces the king to take. No more queens — this is an endgame now, and your extra pawn matters.", arrow: ['d1', 'd8'] },

    // Black plays Kxd8
    { type: 'instruction', fen: FEN.after_Qxd8, text: "The king recaptures on d8.", autoAdvance: 800, highlightSquares: ['e8', 'd8'] },

    // PREDICT 3: Nc3
    { type: 'play-move', fen: FEN.after_Kxd8, correctMove: 'Nc3', prompt: "You're up a pawn in an endgame. What's the natural developing move?", hint: 'Bring the last minor piece into the game.', correctFeedback: 'Nc3 develops with tempo — the knight eyes d5 and e4.', wrongFeedback: 'Develop the knight to c3 — it belongs in the center.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: "Nc3 finishes development of your knights. Both are centralized and ready to work.", arrow: ['b1', 'c3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_dxc6, text: "Now recall all three moves." },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: "Knight to f5.", autoAdvance: 800, highlightSquares: ['d6', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nf5, correctMove: 'Qxd8+', prompt: 'Your move.', hint: 'Qxd8+.', correctFeedback: 'Qxd8+.', wrongFeedback: 'Qxd8+.' },
    { type: 'instruction', fen: FEN.after_Qxd8, text: "King takes.", autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    { type: 'play-move', fen: FEN.after_Kxd8, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nc3, text: "The Berlin Wall is up. You're a pawn ahead with both knights developed." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlb-3: The Endgame Plan (h3, Bf4, Rad1)
// ═══════════════════════════════════════════════════════════

const RLB_LESSON_3: OpeningLesson = {
  id: 'rlb-3',
  title: 'The Endgame Plan',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nc3, text: "Black's king heads back to e8 for safety. Now you need a plan — control the center and develop your last pieces." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nf6, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black takes on e4.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: "Knight retreats.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: "Knight to f5.", autoAdvance: 800, highlightSquares: ['d6', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nf5, correctMove: 'Qxd8+', prompt: 'Your move.', hint: 'Qxd8+.', correctFeedback: 'Qxd8+.', wrongFeedback: 'Qxd8+.' },
    { type: 'instruction', fen: FEN.after_Qxd8, text: "King takes.", autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    { type: 'play-move', fen: FEN.after_Kxd8, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },

    // Black plays Ke8
    { type: 'instruction', fen: FEN.after_Nc3, text: "The king walks back to e8.", autoAdvance: 800, highlightSquares: ['d8', 'e8'] },

    // PREDICT 1: h3
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'h3', prompt: "The position is calm. What useful waiting move should you play?", hint: "Stop Black's bishop from coming to g4 where it would pin your knight.", correctFeedback: 'h3 prevents Bg4 and gives your king a safe escape square.', wrongFeedback: 'Play h3 — it stops the bishop from pinning your knight on f3.' },
    { type: 'instruction', fen: FEN.after_h3, text: "h3 is a quiet but important move. It stops Bg4 and prepares to develop your bishop without worrying about pins.", arrow: ['h2', 'h3'] },

    // Black plays h5
    { type: 'instruction', fen: FEN.after_h3, text: "Black plays h5, claiming space on the kingside.", autoAdvance: 800, highlightSquares: ['h7', 'h5'] },

    // PREDICT 2: Bf4
    { type: 'play-move', fen: FEN.after_h5, correctMove: 'Bf4', prompt: "Time to develop your last minor piece. Where does the bishop belong?", hint: 'The bishop wants to support the e5 pawn from the diagonal.', correctFeedback: 'Bf4 develops the bishop and supports the e5 pawn.', wrongFeedback: 'Develop the bishop to f4 — it guards e5 from there.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: "Bf4 is the perfect square. The bishop defends e5 and aims at the whole b8-h2 diagonal.", arrow: ['c1', 'f4'] },

    // Black plays Be7
    { type: 'instruction', fen: FEN.after_Bf4, text: "Black develops the bishop to e7.", autoAdvance: 800, highlightSquares: ['f8', 'e7'] },

    // PREDICT 3: Rad1
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Rad1', prompt: "One rook is still on a1. Where should it go?", hint: 'The d-file is open — put a rook on it.', correctFeedback: 'Rad1 seizes the open d-file. Your development is complete.', wrongFeedback: 'Place the rook on the open d-file with Rad1.' },
    { type: 'instruction', fen: FEN.after_Rad1, text: "Rad1 completes your development. You have the open d-file, a strong pawn on e5, and active pieces everywhere.", arrow: ['a1', 'd1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ke8, text: "One more time — play all three from memory." },
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: "Black plays h5.", autoAdvance: 800, highlightSquares: ['h7', 'h5'] },
    { type: 'play-move', fen: FEN.after_h5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: "Bishop to e7.", autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Rad1', prompt: 'Your move.', hint: 'Rad1.', correctFeedback: 'Rad1.', wrongFeedback: 'Rad1.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Rad1, text: "You've learned the complete Berlin endgame setup. Every piece is active and your pawn on e5 gives you a lasting edge." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlb-dev-Bc5: If 4...Bc5 (instead of Nxe4)
// Teaches c3, d4, Bg5 (3 white moves)
// ═══════════════════════════════════════════════════════════

const RLB_DEV_BC5: OpeningLesson = {
  id: 'rlb-dev-Bc5',
  title: 'If 4...Bc5',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "Sometimes after you castle, Black plays Bc5 instead of grabbing the e4 pawn. Here's how to respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nf6, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_OO, text: "Black plays Bc5 instead of Nxe4.", autoAdvance: 800, highlightSquares: ['f8', 'c5'] },

    // PREDICT 1: c3
    { type: 'play-move', fen: FEN.dev_Bc5, correctMove: 'c3', prompt: "Black developed the bishop. How do you prepare to expand in the center?", hint: 'Support a d4 push with a pawn move.', correctFeedback: 'c3 prepares d4 with full pawn support.', wrongFeedback: 'Play c3 to prepare d4.' },
    { type: 'instruction', fen: FEN.dev_Bc5_c3, text: "c3 prepares d4 with solid pawn support. The center is about to open in your favor.", arrow: ['c2', 'c3'] },

    // Black plays O-O
    { type: 'instruction', fen: FEN.dev_Bc5_c3, text: "Black castles.", autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 2: d4
    { type: 'play-move', fen: FEN.dev_Bc5_OO, correctMove: 'd4', prompt: "Your preparation is done. What central push follows?", hint: 'Push the d-pawn — c3 is supporting it.', correctFeedback: "d4 seizes the center. Black's bishop has to retreat.", wrongFeedback: 'Push d4 — you prepared it with c3.' },
    { type: 'instruction', fen: FEN.dev_Bc5_d4, text: "d4 opens the center with a strong pawn duo on d4 and e4. The bishop on c5 is now under pressure.", arrow: ['d2', 'd4'] },

    // Black plays Bb6
    { type: 'instruction', fen: FEN.dev_Bc5_d4, text: "The bishop retreats to b6.", autoAdvance: 800, highlightSquares: ['c5', 'b6'] },

    // PREDICT 3: Bg5
    { type: 'play-move', fen: FEN.dev_Bc5_Bb6, correctMove: 'Bg5', prompt: "You control the center. Now pin a piece to increase pressure.", hint: 'Put your bishop on the square that pins the knight to the queen.', correctFeedback: 'Bg5 pins the knight on f6 to the queen. Pressure builds.', wrongFeedback: 'Play Bg5 to pin the knight on f6.' },
    { type: 'instruction', fen: FEN.dev_Bc5_Bg5, text: "Bg5 pins the f6 knight to the queen. Combined with your center pawns, you have a commanding position.", arrow: ['c1', 'g5'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Bc5, text: "Now play all three responses from memory." },
    { type: 'play-move', fen: FEN.dev_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.dev_Bc5_c3, text: "Black castles.", autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev_Bc5_OO, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Bc5_d4, text: "Bishop retreats.", autoAdvance: 800, highlightSquares: ['c5', 'b6'] },
    { type: 'play-move', fen: FEN.dev_Bc5_Bb6, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_Bc5_Bg5, text: "When Black plays Bc5, you build the center with c3 and d4, then pin with Bg5. Simple and strong." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlb-dev-Be7: If 5...Be7 (instead of Nd6)
// Teaches Qe2, Bxc6, dxe5 (3 white moves)
// ═══════════════════════════════════════════════════════════

const RLB_DEV_BE7: OpeningLesson = {
  id: 'rlb-dev-Be7',
  title: 'If 5...Be7',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_d4, text: "After 5.d4, Black sometimes plays Be7 instead of the usual Nd6. The plan changes — you use the queen early." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nf6, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black takes on e4.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_d4, text: "Black plays Be7 instead of Nd6.", autoAdvance: 800, highlightSquares: ['f8', 'e7'] },

    // PREDICT 1: Qe2
    { type: 'play-move', fen: FEN.dev_Be7, correctMove: 'Qe2', prompt: "The knight is still on e4. How do you put pressure on it?", hint: 'Attack the knight with your queen — which square targets e4?', correctFeedback: 'Qe2 attacks the knight on e4 and prepares to recapture.', wrongFeedback: 'Play Qe2 — it hits the knight on e4.' },
    { type: 'instruction', fen: FEN.dev_Be7_Qe2, text: "Qe2 puts direct pressure on the knight. Black's knight has to retreat to d6 now.", arrow: ['d1', 'e2'] },

    // Black plays Nd6
    { type: 'instruction', fen: FEN.dev_Be7_Qe2, text: "The knight retreats to d6.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },

    // PREDICT 2: Bxc6
    { type: 'play-move', fen: FEN.dev_Be7_Nd6, correctMove: 'Bxc6', prompt: "Same idea as the main line — what exchange damages Black's structure?", hint: 'Trade the bishop for the knight on c6.', correctFeedback: 'Bxc6 doubles the pawns just like in the main line.', wrongFeedback: 'Capture the knight on c6 with your bishop.' },
    { type: 'instruction', fen: FEN.dev_Be7_Bxc6, text: "Bxc6 again damages the pawn structure. This time Black takes with the b-pawn.", arrow: ['b5', 'c6'] },

    // Black plays bxc6
    { type: 'instruction', fen: FEN.dev_Be7_Bxc6, text: "Black recaptures with the b-pawn.", autoAdvance: 800, highlightSquares: ['b7', 'c6'] },

    // PREDICT 3: dxe5
    { type: 'play-move', fen: FEN.dev_Be7_bxc6, correctMove: 'dxe5', prompt: "The e5 pawn is loose again. What do you take?", hint: 'Grab the free pawn.', correctFeedback: 'dxe5 wins the pawn. You have an extra pawn and active pieces.', wrongFeedback: 'Take the e5 pawn with dxe5.' },
    { type: 'instruction', fen: FEN.dev_Be7_dxe5, text: "dxe5 wins a clean pawn. With the queen on e2, you're well-placed to exploit the open center.", arrow: ['d4', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Be7, text: "Play the three responses from memory." },
    { type: 'play-move', fen: FEN.dev_Be7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.dev_Be7_Qe2, text: "Knight retreats.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.dev_Be7_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.dev_Be7_Bxc6, text: "Black takes with the b-pawn.", autoAdvance: 800, highlightSquares: ['b7', 'c6'] },
    { type: 'play-move', fen: FEN.dev_Be7_bxc6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_Be7_dxe5, text: "When Black plays Be7, switch to Qe2 and the rest follows the same idea — trade, grab the pawn, and play the endgame." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlb-dev-h6: If 9...h6 (instead of Ke8)
// Teaches h3, b3, Bb2 (3 white moves)
// ═══════════════════════════════════════════════════════════

const RLB_DEV_H6: OpeningLesson = {
  id: 'rlb-dev-h6',
  title: 'If 9...h6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nc3, text: "After 9.Nc3, Black sometimes plays h6 instead of Ke8. They want to prevent Bg5. Your plan adjusts — go for a fianchetto." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nf6, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black takes on e4.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: "Knight retreats.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: "Knight to f5.", autoAdvance: 800, highlightSquares: ['d6', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nf5, correctMove: 'Qxd8+', prompt: 'Your move.', hint: 'Qxd8+.', correctFeedback: 'Qxd8+.', wrongFeedback: 'Qxd8+.' },
    { type: 'instruction', fen: FEN.after_Qxd8, text: "King takes.", autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    { type: 'play-move', fen: FEN.after_Kxd8, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Nc3, text: "Black plays h6 instead of Ke8.", autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // PREDICT 1: h3
    { type: 'play-move', fen: FEN.dev_h6, correctMove: 'h3', prompt: "Black played h6 to prevent Bg5. What useful move do you play?", hint: 'Mirror Black\'s idea — stop their bishop from coming to g4.', correctFeedback: 'h3 prevents Bg4 and keeps your structure flexible.', wrongFeedback: 'Play h3 — it stops the bishop from pinning your knight.' },
    { type: 'instruction', fen: FEN.dev_h6_h3, text: "h3 is still the right move here. It prevents Bg4 and keeps all your options open.", arrow: ['h2', 'h3'] },

    // Black plays Bd7
    { type: 'instruction', fen: FEN.dev_h6_h3, text: "Black develops the bishop to d7.", autoAdvance: 800, highlightSquares: ['c8', 'd7'] },

    // PREDICT 2: b3
    { type: 'play-move', fen: FEN.dev_h6_Bd7, correctMove: 'b3', prompt: "Since Bg5 is prevented, where should your bishop go instead?", hint: 'Prepare a fianchetto — the long diagonal is open.', correctFeedback: 'b3 prepares Bb2, aiming the bishop at the long diagonal.', wrongFeedback: 'Play b3 to prepare the bishop fianchetto to b2.' },
    { type: 'instruction', fen: FEN.dev_h6_b3, text: "b3 prepares Bb2. The long diagonal a1-h8 is open and your bishop will be powerful there.", arrow: ['b2', 'b3'] },

    // Black plays Kc8
    { type: 'instruction', fen: FEN.dev_h6_b3, text: "The king tucks away to c8.", autoAdvance: 800, highlightSquares: ['d8', 'c8'] },

    // PREDICT 3: Bb2
    { type: 'play-move', fen: FEN.dev_h6_Kc8, correctMove: 'Bb2', prompt: "Complete the fianchetto. Where does the bishop go?", hint: 'Put the bishop on the long diagonal.', correctFeedback: 'Bb2 completes the fianchetto — the bishop controls the long diagonal.', wrongFeedback: 'Place the bishop on b2.' },
    { type: 'instruction', fen: FEN.dev_h6_Bb2, text: "Bb2 is a great post. The bishop rakes the long diagonal and supports the e5 pawn from a distance.", arrow: ['c1', 'b2'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_h6, text: "Recall the three moves." },
    { type: 'play-move', fen: FEN.dev_h6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.dev_h6_h3, text: "Bishop to d7.", autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.dev_h6_Bd7, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },
    { type: 'instruction', fen: FEN.dev_h6_b3, text: "King to c8.", autoAdvance: 800, highlightSquares: ['d8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_h6_Kc8, correctMove: 'Bb2', prompt: 'Your move.', hint: 'Bb2.', correctFeedback: 'Bb2.', wrongFeedback: 'Bb2.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_h6_Bb2, text: "When Black plays h6, switch to the fianchetto plan with b3 and Bb2. Different setup, same strong position." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlb-test-1: Level Test
// Main line + all deviations, pure recall
// ═══════════════════════════════════════════════════════════

const RLB_TEST: OpeningLesson = {
  id: 'rlb-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE ===
    // Lesson 1 moves
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black takes on e4.", autoAdvance: 800, highlightSquares: ['f6', 'e4'] },
    { type: 'play-move', fen: FEN.after_Nxe4, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: "Knight to d6.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },

    // Lesson 2 moves
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: "Knight to f5.", autoAdvance: 800, highlightSquares: ['d6', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nf5, correctMove: 'Qxd8+', prompt: 'Your move.', hint: 'Qxd8+.', correctFeedback: 'Qxd8+.', wrongFeedback: 'Qxd8+.' },
    { type: 'instruction', fen: FEN.after_Qxd8, text: "King takes.", autoAdvance: 800, highlightSquares: ['e8', 'd8'] },
    { type: 'play-move', fen: FEN.after_Kxd8, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },

    // Lesson 3 moves
    { type: 'instruction', fen: FEN.after_Nc3, text: "King to e8.", autoAdvance: 800, highlightSquares: ['d8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: "Black plays h5.", autoAdvance: 800, highlightSquares: ['h7', 'h5'] },
    { type: 'play-move', fen: FEN.after_h5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: "Bishop to e7.", autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Rad1', prompt: 'Your move.', hint: 'Rad1.', correctFeedback: 'Rad1.', wrongFeedback: 'Rad1.' },

    // === DEVIATION: 4...Bc5 ===
    { type: 'instruction', fen: FEN.after_OO, text: "Now: Black plays Bc5 instead.", autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.dev_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.dev_Bc5_c3, text: "Black castles.", autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev_Bc5_OO, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Bc5_d4, text: "Bishop to b6.", autoAdvance: 800, highlightSquares: ['c5', 'b6'] },
    { type: 'play-move', fen: FEN.dev_Bc5_Bb6, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },

    // === DEVIATION: 5...Be7 ===
    { type: 'instruction', fen: FEN.after_d4, text: "Now: Black plays Be7 instead of Nd6.", autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.dev_Be7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.dev_Be7_Qe2, text: "Knight retreats.", autoAdvance: 800, highlightSquares: ['e4', 'd6'] },
    { type: 'play-move', fen: FEN.dev_Be7_Nd6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.dev_Be7_Bxc6, text: "Black takes with the b-pawn.", autoAdvance: 800, highlightSquares: ['b7', 'c6'] },
    { type: 'play-move', fen: FEN.dev_Be7_bxc6, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },

    // === DEVIATION: 9...h6 ===
    { type: 'instruction', fen: FEN.after_Nc3, text: "Now: Black plays h6 instead of Ke8.", autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.dev_h6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.dev_h6_h3, text: "Bishop to d7.", autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.dev_h6_Bd7, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },
    { type: 'instruction', fen: FEN.dev_h6_b3, text: "King to c8.", autoAdvance: 800, highlightSquares: ['d8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_h6_Kc8, correctMove: 'Bb2', prompt: 'Your move.', hint: 'Bb2.', correctFeedback: 'Bb2.', wrongFeedback: 'Bb2.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// Lookup
// ═══════════════════════════════════════════════════════════

export function getRuyLopezBerlinLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'rlb-1': return RLB_LESSON_1
    case 'rlb-2': return RLB_LESSON_2
    case 'rlb-3': return RLB_LESSON_3
    case 'rlb-dev-Bc5': return RLB_DEV_BC5
    case 'rlb-dev-Be7': return RLB_DEV_BE7
    case 'rlb-dev-h6': return RLB_DEV_H6
    case 'rlb-test-1': return RLB_TEST
    default: return undefined
  }
}
