import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN TAIMANOV LESSONS (st-1 through st-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6
// Main line: 5.Nc3 Qc7 6.Be3 a6 7.Qd2 Nf6 8.O-O-O Bb4
//            9.f3 Ne5 10.Nb3 b5 11.Qe1 Be7 12.f4 Ng6
//            13.e5 Ng4 14.Ne4 O-O 15.Bc5 Bb7 16.h3 Nh6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity moves (1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6)
  start:           'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_Nc6:       'r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',

  // Main line
  after_Nc3:       'r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  after_Qc7:       'r1b1kbnr/ppqp1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 3 6',
  after_Be3:       'r1b1kbnr/ppqp1ppp/2n1p3/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 4 6',
  after_a6:        'r1b1kbnr/1pqp1ppp/p1n1p3/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7',
  after_Qd2:       'r1b1kbnr/1pqp1ppp/p1n1p3/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R b KQkq - 1 7',
  after_Nf6:       'r1b1kb1r/1pqp1ppp/p1n1pn2/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R w KQkq - 2 8',
  after_OOO:       'r1b1kb1r/1pqp1ppp/p1n1pn2/8/3NP3/2N1B3/PPPQ1PPP/2KR1B1R b kq - 3 8',
  after_Bb4:       'r1b1k2r/1pqp1ppp/p1n1pn2/8/1b1NP3/2N1B3/PPPQ1PPP/2KR1B1R w kq - 4 9',
  after_f3:        'r1b1k2r/1pqp1ppp/p1n1pn2/8/1b1NP3/2N1BP2/PPPQ2PP/2KR1B1R b kq - 0 9',
  after_Ne5:       'r1b1k2r/1pqp1ppp/p3pn2/4n3/1b1NP3/2N1BP2/PPPQ2PP/2KR1B1R w kq - 1 10',
  after_Nb3:       'r1b1k2r/1pqp1ppp/p3pn2/4n3/1b2P3/1NN1BP2/PPPQ2PP/2KR1B1R b kq - 2 10',
  after_b5:        'r1b1k2r/2qp1ppp/p3pn2/1p2n3/1b2P3/1NN1BP2/PPPQ2PP/2KR1B1R w kq - 0 11',
  after_Qe1:       'r1b1k2r/2qp1ppp/p3pn2/1p2n3/1b2P3/1NN1BP2/PPP3PP/2KRQB1R b kq - 1 11',
  after_Be7:       'r1b1k2r/2qpbppp/p3pn2/1p2n3/4P3/1NN1BP2/PPP3PP/2KRQB1R w kq - 2 12',
  after_f4:        'r1b1k2r/2qpbppp/p3pn2/1p2n3/4PP2/1NN1B3/PPP3PP/2KRQB1R b kq - 0 12',
  after_Ng6:       'r1b1k2r/2qpbppp/p3pnn1/1p6/4PP2/1NN1B3/PPP3PP/2KRQB1R w kq - 1 13',
  after_e5:        'r1b1k2r/2qpbppp/p3pnn1/1p2P3/5P2/1NN1B3/PPP3PP/2KRQB1R b kq - 0 13',
  after_Ng4:       'r1b1k2r/2qpbppp/p3p1n1/1p2P3/5Pn1/1NN1B3/PPP3PP/2KRQB1R w kq - 1 14',
  after_Ne4:       'r1b1k2r/2qpbppp/p3p1n1/1p2P3/4NPn1/1N2B3/PPP3PP/2KRQB1R b kq - 2 14',
  after_OO:        'r1b2rk1/2qpbppp/p3p1n1/1p2P3/4NPn1/1N2B3/PPP3PP/2KRQB1R w - - 3 15',
  after_Bc5:       'r1b2rk1/2qpbppp/p3p1n1/1pB1P3/4NPn1/1N6/PPP3PP/2KRQB1R b - - 4 15',
  after_Bb7:       'r4rk1/1bqpbppp/p3p1n1/1pB1P3/4NPn1/1N6/PPP3PP/2KRQB1R w - - 5 16',
  after_h3:        'r4rk1/1bqpbppp/p3p1n1/1pB1P3/4NPn1/1N5P/PPP3P1/2KRQB1R b - - 0 16',
  after_Nh6:       'r4rk1/1bqpbppp/p3p1nn/1pB1P3/4NP2/1N5P/PPP3P1/2KRQB1R w - - 1 17',

  // Deviation: 7.Bd3 (instead of 7.Qd2)
  dev_Bd3_after_Bd3:  'r1b1kbnr/1pqp1ppp/p1n1p3/8/3NP3/2NBB3/PPP2PPP/R2QK2R b KQkq - 1 7',
  dev_Bd3_after_Nf6:  'r1b1kb1r/1pqp1ppp/p1n1pn2/8/3NP3/2NBB3/PPP2PPP/R2QK2R w KQkq - 2 8',
  dev_Bd3_after_OO:   'r1b1kb1r/1pqp1ppp/p1n1pn2/8/3NP3/2NBB3/PPP2PPP/R2Q1RK1 b kq - 3 8',
  dev_Bd3_after_Ne5:  'r1b1kb1r/1pqp1ppp/p3pn2/4n3/3NP3/2NBB3/PPP2PPP/R2Q1RK1 w kq - 4 9',
  dev_Bd3_after_h3:   'r1b1kb1r/1pqp1ppp/p3pn2/4n3/3NP3/2NBB2P/PPP2PP1/R2Q1RK1 b kq - 0 9',
  dev_Bd3_after_Bc5:  'r1b1k2r/1pqp1ppp/p3pn2/2b1n3/3NP3/2NBB2P/PPP2PP1/R2Q1RK1 w kq - 1 10',

  // Deviation: 7.Qf3 (instead of 7.Qd2)
  dev_Qf3_after_Qf3:  'r1b1kbnr/1pqp1ppp/p1n1p3/8/3NP3/2N1BQ2/PPP2PPP/R3KB1R b KQkq - 1 7',
  dev_Qf3_after_Nf6:  'r1b1kb1r/1pqp1ppp/p1n1pn2/8/3NP3/2N1BQ2/PPP2PPP/R3KB1R w KQkq - 2 8',
  dev_Qf3_after_OOO:  'r1b1kb1r/1pqp1ppp/p1n1pn2/8/3NP3/2N1BQ2/PPP2PPP/2KR1B1R b kq - 3 8',
  dev_Qf3_after_Ne5:  'r1b1kb1r/1pqp1ppp/p3pn2/4n3/3NP3/2N1BQ2/PPP2PPP/2KR1B1R w kq - 4 9',
  dev_Qf3_after_Qg3:  'r1b1kb1r/1pqp1ppp/p3pn2/4n3/3NP3/2N1B1Q1/PPP2PPP/2KR1B1R b kq - 5 9',
  dev_Qf3_after_b5:   'r1b1kb1r/2qp1ppp/p3pn2/1p2n3/3NP3/2N1B1Q1/PPP2PPP/2KR1B1R w kq - 0 10',
}


// ═══════════════════════════════════════════════════════════
// st-1: The Taimanov Setup (Qc7, a6, Nf6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const ST_1: OpeningLesson = {
  id: 'st-1',
  title: 'The Taimanov Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nc6, text: "The Sicilian Taimanov begins after 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6. You'll set up a flexible position with the queen, grab queenside space, and develop the knight." },

    // White plays 5.Nc3
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 1: Qc7
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Where should the queen go to stay flexible and control key squares?', hint: 'The queen goes to c7, where it eyes the c-file and supports a future b5 or d5 push.', correctFeedback: 'Qc7 is the signature Taimanov move. The queen controls c7, supports ...b5 or ...d5, and stays out of danger.', wrongFeedback: 'Play Qc7 — the queen belongs on c7 in the Taimanov.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7 is the heart of the Taimanov. The queen eyes the c-file and keeps your options open for both queenside and central play.', arrow: ['d8', 'c7'] },

    // White plays 6.Be3
    { type: 'instruction', fen: FEN.after_Qc7, text: 'White develops the bishop to e3, supporting the d4 knight.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 2: a6
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'How do you prepare queenside expansion?', hint: 'A small pawn move that prepares ...b5 and takes away the b5 square from White\'s pieces.', correctFeedback: 'a6 prepares b5 and denies the b5 square to White\'s knight or bishop.', wrongFeedback: 'Play a6 — it prepares b5 and controls the b5 square.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6 is a key preparatory move. It stops Nb5 tricks and sets up a future b5 push to grab queenside space.', arrow: ['a7', 'a6'] },

    // White plays 7.Qd2
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays Qd2, connecting the rooks and preparing to castle queenside.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 3: Nf6
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nf6', prompt: 'Time to develop another piece. Where does the knight belong?', hint: 'The natural developing square for the kingside knight.', correctFeedback: 'Nf6 develops the knight to its best square, hitting e4 and preparing to jump into the game.', wrongFeedback: 'Develop the knight to f6 — it attacks e4 and gets into the action.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 develops naturally and pressures e4. Your pieces are getting active fast.', arrow: ['g8', 'f6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nc6, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },

    { type: 'instruction', fen: FEN.after_Nf6, text: "Qc7, a6, Nf6 — the Taimanov setup is in place. You've got a flexible position with queenside expansion ready to go." },
  ],
}


// ═══════════════════════════════════════════════════════════
// st-2: Pinning and Expanding (Bb4, Ne5, b5)
// ═══════════════════════════════════════════════════════════

const ST_2: OpeningLesson = {
  id: 'st-2',
  title: 'Pinning and Expanding',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nf6, text: "White castles queenside. You'll pin the knight, jump to a central outpost, and expand on the queenside." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nc6, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },

    // White plays 8.O-O-O
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White castles queenside, getting the king to safety and the rook to d1.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },

    // PREDICT 1: Bb4
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bb4', prompt: 'White just castled queenside. How do you create pressure on the knight?', hint: 'Develop the bishop to pin the c3 knight against the king.', correctFeedback: 'Bb4 pins the knight on c3 to the king on c1. That pin creates real pressure.', wrongFeedback: 'Play Bb4 — pin the knight on c3 to the king.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4 pins the c3 knight to the king. White has to be careful about how they deal with this pin.', arrow: ['f8', 'b4'] },

    // White plays 9.f3
    { type: 'instruction', fen: FEN.after_Bb4, text: 'White pushes f3, reinforcing the e4 pawn and preparing to break the pin.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: Ne5
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Ne5', prompt: 'The knight on c6 can jump to a stronger square. Where?', hint: 'A central square where the knight eyes d3 and f3.', correctFeedback: 'Ne5 puts the knight on a powerful central outpost, eyeing d3 and keeping the pressure on.', wrongFeedback: 'Jump the knight to e5 — it controls key central squares from there.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5 is a strong centralizing move. The knight eyes d3 next to the White king and keeps the position tense.', arrow: ['c6', 'e5'] },

    // White plays 10.Nb3
    { type: 'instruction', fen: FEN.after_Ne5, text: 'White retreats the knight to b3, stepping out of trouble.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },

    // PREDICT 3: b5
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'b5', prompt: 'How do you grab more queenside space?', hint: 'Push the b-pawn to expand and open lines toward the White king.', correctFeedback: 'b5 expands on the queenside, creating threats toward the White king on c1.', wrongFeedback: 'Push b5 — expand on the queenside where the White king lives.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'b5 grabs queenside space and opens attacking possibilities. With the king on c1, this expansion is dangerous for White.', arrow: ['b7', 'b5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nf6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },

    { type: 'instruction', fen: FEN.after_b5, text: "Bb4, Ne5, b5 — you've pinned, centralized, and launched a queenside attack. The pressure on White is real." },
  ],
}


// ═══════════════════════════════════════════════════════════
// st-3: Retreating and Regrouping (Be7, Ng6, Ng4)
// ═══════════════════════════════════════════════════════════

const ST_3: OpeningLesson = {
  id: 'st-3',
  title: 'Retreating and Regrouping',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_b5, text: "White repositions the queen. You'll retreat the bishop, reroute a knight, and find a sharp jump into enemy territory." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nc6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },

    // White plays 11.Qe1
    { type: 'instruction', fen: FEN.after_b5, text: 'White repositions the queen to e1, clearing d2 and aiming at the kingside.', autoAdvance: 800, highlightSquares: ['d2', 'e1'] },

    // PREDICT 1: Be7
    { type: 'play-move', fen: FEN.after_Qe1, correctMove: 'Be7', prompt: 'The bishop on b4 has done its job. Where should it go now?', hint: 'Retreat the bishop to a safer square where it still has scope.', correctFeedback: 'Be7 retreats the bishop to a safe square. The pin is over but the bishop still covers useful diagonals.', wrongFeedback: 'Pull the bishop back to e7 — it has done its job on b4.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7 is a practical retreat. The bishop is safe and well-placed. Now the knight on e5 needs to find its next move.', arrow: ['b4', 'e7'] },

    // White plays 12.f4
    { type: 'instruction', fen: FEN.after_Be7, text: 'White pushes f4, kicking the knight on e5 and grabbing space.', autoAdvance: 800, highlightSquares: ['f3', 'f4'] },

    // PREDICT 2: Ng6
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Ng6', prompt: 'The knight is being kicked from e5. Where does it go?', hint: 'The knight can reroute to g6, keeping an eye on the f4 and e5 squares.', correctFeedback: 'Ng6 hops to a good square where it watches f4 and e5. The knight is still very active.', wrongFeedback: 'Jump to g6 — the knight stays active and targets f4 and e5.' },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Ng6 keeps the knight in the game. It eyes f4 and e5, and White has to think about what happens after a future e5 push.', arrow: ['e5', 'g6'] },

    // White plays 13.e5
    { type: 'instruction', fen: FEN.after_Ng6, text: 'White pushes e5, chasing the f6 knight and grabbing central space.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },

    // PREDICT 3: Ng4
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Ng4', prompt: 'Your f6 knight is attacked by the e5 pawn. Where does it jump?', hint: 'Jump the knight to g4, targeting the e3 bishop.', correctFeedback: 'Ng4 attacks the bishop on e3 and creates tactical threats. A sharp move.', wrongFeedback: 'Jump to g4 — the knight attacks the e3 bishop and creates threats.' },
    { type: 'instruction', fen: FEN.after_Ng4, text: 'Ng4 is aggressive. The knight hits the e3 bishop and could jump to e3 or f2 in some lines. White has to be precise.', arrow: ['f6', 'g4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_b5, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_b5, text: 'Qe1.', autoAdvance: 800, highlightSquares: ['d2', 'e1'] },
    { type: 'play-move', fen: FEN.after_Qe1, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'f4.', autoAdvance: 800, highlightSquares: ['f3', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Ng4', prompt: 'Your move.', hint: 'Ng4.', correctFeedback: 'Ng4.', wrongFeedback: 'Ng4.' },

    { type: 'instruction', fen: FEN.after_Ng4, text: "Be7, Ng6, Ng4 — you've regrouped and launched a sharp counterattack. The knights are causing problems everywhere." },
  ],
}


// ═══════════════════════════════════════════════════════════
// st-4: Castling and Completing (O-O, Bb7, Nh6)
// ═══════════════════════════════════════════════════════════

const ST_4: OpeningLesson = {
  id: 'st-4',
  title: 'Castling and Completing',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Ng4, text: "White centralizes the knight. You'll castle, fianchetto the bishop, and reposition your knight to finish the opening." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nc6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Qe1.', autoAdvance: 800, highlightSquares: ['d2', 'e1'] },
    { type: 'play-move', fen: FEN.after_Qe1, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'f4.', autoAdvance: 800, highlightSquares: ['f3', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Ng4', prompt: 'Your move.', hint: 'Ng4.', correctFeedback: 'Ng4.', wrongFeedback: 'Ng4.' },

    // White plays 14.Ne4
    { type: 'instruction', fen: FEN.after_Ng4, text: 'White jumps the knight to e4, centralizing with power.', autoAdvance: 800, highlightSquares: ['c3', 'e4'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.after_Ne4, correctMove: 'O-O', prompt: 'Your king is still in the center. What should you do?', hint: 'Get the king to safety by castling.', correctFeedback: 'O-O tucks the king away and connects the rooks. Safety first.', wrongFeedback: 'Castle kingside — the king needs to be safe.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O gets the king out of the center. The rooks are connected and the king is safe behind the pawns.', arrow: ['e8', 'g8'] },

    // White plays 15.Bc5
    { type: 'instruction', fen: FEN.after_OO, text: 'White plays Bc5, trading the dark-squared bishops.', autoAdvance: 800, highlightSquares: ['e3', 'c5'] },

    // PREDICT 2: Bb7
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'Bb7', prompt: 'How do you activate the light-squared bishop?', hint: 'Develop it to the long diagonal where it targets e4 and beyond.', correctFeedback: 'Bb7 puts the bishop on the long diagonal, hitting e4 and g2.', wrongFeedback: 'Play Bb7 — the bishop belongs on the long diagonal.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'Bb7 fianchettoes the bishop on the long diagonal. It pressures e4 and g2, creating long-term threats.', arrow: ['c8', 'b7'] },

    // White plays 16.h3
    { type: 'instruction', fen: FEN.after_Bb7, text: 'White pushes h3, asking the knight on g4 where it wants to go.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },

    // PREDICT 3: Nh6
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Nh6', prompt: 'The knight on g4 is asked to move. Where does it retreat?', hint: 'The knight can go to h6, keeping options open on the kingside.', correctFeedback: 'Nh6 retreats the knight to a safe square. It can reroute to f5 later.', wrongFeedback: 'Retreat to h6 — the knight stays flexible and can head to f5.' },
    { type: 'instruction', fen: FEN.after_Nh6, text: 'Nh6 keeps the knight active. From h6 it can jump to f5, a perfect outpost in many Taimanov positions.', arrow: ['g4', 'h6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ng4, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Ng4, text: 'Ne4.', autoAdvance: 800, highlightSquares: ['c3', 'e4'] },
    { type: 'play-move', fen: FEN.after_Ne4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['e3', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Nh6', prompt: 'Your move.', hint: 'Nh6.', correctFeedback: 'Nh6.', wrongFeedback: 'Nh6.' },

    { type: 'instruction', fen: FEN.after_Nh6, text: "O-O, Bb7, Nh6 — you've completed the Taimanov setup. Castled, developed, and ready for the middlegame." },
  ],
}


// ═══════════════════════════════════════════════════════════
// st-dev-Bd3: Deviation (7.Bd3 instead of 7.Qd2)
// Black plays: Nf6, Ne5, Bc5
// ═══════════════════════════════════════════════════════════

const ST_DEV_BD3: OpeningLesson = {
  id: 'st-dev-Bd3',
  title: 'Dev 7.Bd3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "Sometimes White plays Bd3 instead of Qd2. It's a quieter approach — here's how you respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nc6, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays Bd3 instead of Qd2 — developing the bishop before deciding where the queen goes.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.dev_Bd3_after_Bd3, correctMove: 'Nf6', prompt: 'White developed the bishop. How do you continue development?', hint: 'The kingside knight still belongs on f6.', correctFeedback: 'Nf6 is the natural developing move, hitting e4 and getting the knight into the game.', wrongFeedback: 'Develop the knight to f6 — same idea as the main line.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Nf6, text: 'Nf6 develops naturally. Against Bd3, the plan is the same — get pieces out and prepare central counterplay.', arrow: ['g8', 'f6'] },

    // White plays 8.O-O
    { type: 'instruction', fen: FEN.dev_Bd3_after_Nf6, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 2: Ne5
    { type: 'play-move', fen: FEN.dev_Bd3_after_OO, correctMove: 'Ne5', prompt: 'How do you take advantage of the bishop on d3?', hint: 'Jump the knight to a central square that also threatens the bishop.', correctFeedback: 'Ne5 centralizes the knight and eyes the d3 bishop. It also controls key squares.', wrongFeedback: 'Jump to e5 — it centralizes the knight and threatens the d3 bishop.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Ne5, text: 'Ne5 is strong here. The knight controls the center and puts pressure on the d3 bishop. White has to figure out how to keep it safe.', arrow: ['c6', 'e5'] },

    // White plays 9.h3
    { type: 'instruction', fen: FEN.dev_Bd3_after_Ne5, text: 'White plays h3, preventing any future ...Bg4 ideas.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },

    // PREDICT 3: Bc5
    { type: 'play-move', fen: FEN.dev_Bd3_after_h3, correctMove: 'Bc5', prompt: 'How do you develop the bishop to its most active square?', hint: 'Put the bishop where it targets the d4 knight and the f2 square.', correctFeedback: 'Bc5 develops the bishop actively, targeting d4 and putting pressure on the kingside.', wrongFeedback: 'Play Bc5 — the bishop targets d4 and f2 from this diagonal.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Bc5, text: 'Bc5 is a great developing move. The bishop aims at d4 and f2, creating tactical tension. You have a comfortable position.', arrow: ['f8', 'c5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_a6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_Bd3_after_Bd3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Nf6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_Bd3_after_OO, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Ne5, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.dev_Bd3_after_h3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },

    { type: 'instruction', fen: FEN.dev_Bd3_after_Bc5, text: "Nf6, Ne5, Bc5 — against 7.Bd3, you develop naturally and put pressure on White's center. Same ideas, different move order." },
  ],
}


// ═══════════════════════════════════════════════════════════
// st-dev-Qf3: Deviation (7.Qf3 instead of 7.Qd2)
// Black plays: Nf6, Ne5, b5
// ═══════════════════════════════════════════════════════════

const ST_DEV_QF3: OpeningLesson = {
  id: 'st-dev-Qf3',
  title: 'Dev 7.Qf3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "Sometimes White puts the queen on f3, aiming at the kingside. Here's how you handle it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nc6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays Qf3 instead of Qd2 — the queen aims at f3, supporting e4 and eyeing the kingside.', autoAdvance: 800, highlightSquares: ['d1', 'f3'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.dev_Qf3_after_Qf3, correctMove: 'Nf6', prompt: 'The queen is on f3. How do you develop?', hint: 'Same knight development as the main line.', correctFeedback: 'Nf6 develops the knight and challenges the queen\'s control of the center.', wrongFeedback: 'Develop the knight to f6 — same plan regardless of where the queen sits.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_Nf6, text: 'Nf6 is correct against Qf3 too. The knight develops naturally and the queen on f3 is actually a bit awkwardly placed.', arrow: ['g8', 'f6'] },

    // White plays 8.O-O-O
    { type: 'instruction', fen: FEN.dev_Qf3_after_Nf6, text: 'White castles queenside.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },

    // PREDICT 2: Ne5
    { type: 'play-move', fen: FEN.dev_Qf3_after_OOO, correctMove: 'Ne5', prompt: 'How do you harass the queen and centralize at the same time?', hint: 'Jump the knight toward the center, threatening the queen on f3.', correctFeedback: 'Ne5 centralizes powerfully and threatens to jump to f3 or d3, both embarrassing for White.', wrongFeedback: 'Play Ne5 — it eyes f3 where the queen sits.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_Ne5, text: 'Ne5 is particularly strong against Qf3. The knight eyes f3, and the queen will have to move again. White is losing time.', arrow: ['c6', 'e5'] },

    // White plays 9.Qg3
    { type: 'instruction', fen: FEN.dev_Qf3_after_Ne5, text: 'White retreats the queen to g3, getting out of the knight\'s way.', autoAdvance: 800, highlightSquares: ['f3', 'g3'] },

    // PREDICT 3: b5
    { type: 'play-move', fen: FEN.dev_Qf3_after_Qg3, correctMove: 'b5', prompt: 'The queen retreated. How do you continue your queenside plan?', hint: 'Expand on the queenside with the b-pawn.', correctFeedback: 'b5 expands on the queenside, just like in the main line. The White king on c1 makes this dangerous.', wrongFeedback: 'Push b5 — attack on the queenside where the king is.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_b5, text: 'b5 is the natural follow-up. You are expanding toward the White king while White wasted a tempo moving the queen twice.', arrow: ['b7', 'b5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_a6, text: 'Qf3.', autoAdvance: 800, highlightSquares: ['d1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Qf3_after_Qf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_Nf6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.dev_Qf3_after_OOO, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_Ne5, text: 'Qg3.', autoAdvance: 800, highlightSquares: ['f3', 'g3'] },
    { type: 'play-move', fen: FEN.dev_Qf3_after_Qg3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },

    { type: 'instruction', fen: FEN.dev_Qf3_after_b5, text: "Nf6, Ne5, b5 — against 7.Qf3, you develop, centralize, and expand. White wasted time and you're ahead in the queenside race." },
  ],
}


// ═══════════════════════════════════════════════════════════
// st-test-1: Level Test (main line + deviations)
// ═══════════════════════════════════════════════════════════

const ST_TEST_1: OpeningLesson = {
  id: 'st-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (12 Black moves) ===
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Qe1.', autoAdvance: 800, highlightSquares: ['d2', 'e1'] },
    { type: 'play-move', fen: FEN.after_Qe1, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'f4.', autoAdvance: 800, highlightSquares: ['f3', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Ng4', prompt: 'Your move.', hint: 'Ng4.', correctFeedback: 'Ng4.', wrongFeedback: 'Ng4.' },
    { type: 'instruction', fen: FEN.after_Ng4, text: 'Ne4.', autoAdvance: 800, highlightSquares: ['c3', 'e4'] },
    { type: 'play-move', fen: FEN.after_Ne4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['e3', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.after_h3, correctMove: 'Nh6', prompt: 'Your move.', hint: 'Nh6.', correctFeedback: 'Nh6.', wrongFeedback: 'Nh6.' },

    // === DEVIATION TEST: 7.Bd3 ===
    { type: 'instruction', fen: FEN.after_a6, text: 'Now White plays Bd3 instead.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev_Bd3_after_Bd3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Nf6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_Bd3_after_OO, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.dev_Bd3_after_Ne5, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.dev_Bd3_after_h3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },

    // === DEVIATION TEST: 7.Qf3 ===
    { type: 'instruction', fen: FEN.after_a6, text: 'Now White plays Qf3 instead.', autoAdvance: 800, highlightSquares: ['d1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Qf3_after_Qf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_Nf6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.dev_Qf3_after_OOO, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },
    { type: 'instruction', fen: FEN.dev_Qf3_after_Ne5, text: 'Qg3.', autoAdvance: 800, highlightSquares: ['f3', 'g3'] },
    { type: 'play-move', fen: FEN.dev_Qf3_after_Qg3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SICILIAN_TAIMANOV_LESSONS: Record<string, OpeningLesson> = {
  'st-1': ST_1,
  'st-2': ST_2,
  'st-3': ST_3,
  'st-4': ST_4,
  'st-dev-Bd3': ST_DEV_BD3,
  'st-dev-Qf3': ST_DEV_QF3,
  'st-test-1': ST_TEST_1,
}

export function getSicilianTaimanovLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_TAIMANOV_LESSONS[id]
}
