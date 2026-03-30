import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// NIMZO-INDIAN CLASSICAL LESSONS (nic-1 through nic-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2
// Main line: 4...O-O 5.a3 Bxc3+ 6.Qxc3 b6
//            7.Bg5 Bb7 8.f3 h6 9.Bh4 d5
//            10.e3 Nbd7 11.cxd5 Nxd5 12.Bxd8 Nxc3
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:     'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6:    'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_c4:     'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_e6:     'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:    'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  after_Bb4:    'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',

  // Lesson 2: 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6
  after_Qc2:    'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b KQkq - 3 4',
  after_OO:     'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR w KQ - 4 5',
  after_a3:     'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/P1N5/1PQ1PPPP/R1B1KBNR b KQ - 0 5',
  after_Bxc3:   'rnbq1rk1/pppp1ppp/4pn2/8/2PP4/P1b5/1PQ1PPPP/R1B1KBNR w KQ - 0 6',
  after_Qxc3:   'rnbq1rk1/pppp1ppp/4pn2/8/2PP4/P1Q5/1P2PPPP/R1B1KBNR b KQ - 0 6',
  after_b6:     'rnbq1rk1/p1pp1ppp/1p2pn2/8/2PP4/P1Q5/1P2PPPP/R1B1KBNR w KQ - 0 7',

  // Lesson 3: 7.Bg5 Bb7 8.f3 h6 9.Bh4 d5
  after_Bg5:    'rnbq1rk1/p1pp1ppp/1p2pn2/6B1/2PP4/P1Q5/1P2PPPP/R3KBNR b KQ - 1 7',
  after_Bb7:    'rn1q1rk1/pbpp1ppp/1p2pn2/6B1/2PP4/P1Q5/1P2PPPP/R3KBNR w KQ - 2 8',
  after_f3:     'rn1q1rk1/pbpp1ppp/1p2pn2/6B1/2PP4/P1Q2P2/1P2P1PP/R3KBNR b KQ - 0 8',
  after_h6:     'rn1q1rk1/pbpp1pp1/1p2pn1p/6B1/2PP4/P1Q2P2/1P2P1PP/R3KBNR w KQ - 0 9',
  after_Bh4:    'rn1q1rk1/pbpp1pp1/1p2pn1p/8/2PP3B/P1Q2P2/1P2P1PP/R3KBNR b KQ - 1 9',
  after_d5:     'rn1q1rk1/pbp2pp1/1p2pn1p/3p4/2PP3B/P1Q2P2/1P2P1PP/R3KBNR w KQ - 0 10',

  // Lesson 4: 10.e3 Nbd7 11.cxd5 Nxd5 12.Bxd8 Nxc3
  after_e3:     'rn1q1rk1/pbp2pp1/1p2pn1p/3p4/2PP3B/P1Q1PP2/1P4PP/R3KBNR b KQ - 0 10',
  after_Nbd7:   'r2q1rk1/pbpn1pp1/1p2pn1p/3p4/2PP3B/P1Q1PP2/1P4PP/R3KBNR w KQ - 1 11',
  after_cxd5:   'r2q1rk1/pbpn1pp1/1p2pn1p/3P4/3P3B/P1Q1PP2/1P4PP/R3KBNR b KQ - 0 11',
  after_Nxd5:   'r2q1rk1/pbpn1pp1/1p2p2p/3n4/3P3B/P1Q1PP2/1P4PP/R3KBNR w KQ - 0 12',
  after_Bxd8:   'r2B1rk1/pbpn1pp1/1p2p2p/3n4/3P4/P1Q1PP2/1P4PP/R3KBNR b KQ - 0 12',
  after_Nxc3:   'r2B1rk1/pbpn1pp1/1p2p2p/8/3P4/P1n1PP2/1P4PP/R3KBNR w KQ - 0 13',

  // Deviation: 5.e4 instead of 5.a3
  devE4_after_e4:   'rnbq1rk1/pppp1ppp/4pn2/8/1bPPP3/2N5/PPQ2PPP/R1B1KBNR b KQ - 0 5',
  devE4_after_d5:   'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPPP3/2N5/PPQ2PPP/R1B1KBNR w KQ - 0 6',
  devE4_after_e5:   'rnbq1rk1/ppp2ppp/4pn2/3pP3/1bPP4/2N5/PPQ2PPP/R1B1KBNR b KQ - 0 6',
  devE4_after_Ne4:  'rnbq1rk1/ppp2ppp/4p3/3pP3/1bPPn3/2N5/PPQ2PPP/R1B1KBNR w KQ - 1 7',
  devE4_after_Bd3:  'rnbq1rk1/ppp2ppp/4p3/3pP3/1bPPn3/2NB4/PPQ2PPP/R1B1K1NR b KQ - 2 7',
  devE4_after_c5:   'rnbq1rk1/pp3ppp/4p3/2ppP3/1bPPn3/2NB4/PPQ2PPP/R1B1K1NR w KQ - 0 8',

  // Deviation: 7.Nf3 instead of 7.Bg5
  devNf3_after_Nf3:  'rnbq1rk1/p1pp1ppp/1p2pn2/8/2PP4/P1Q2N2/1P2PPPP/R1B1KB1R b KQ - 1 7',
  devNf3_after_Bb7:  'rn1q1rk1/pbpp1ppp/1p2pn2/8/2PP4/P1Q2N2/1P2PPPP/R1B1KB1R w KQ - 2 8',
  devNf3_after_e3:   'rn1q1rk1/pbpp1ppp/1p2pn2/8/2PP4/P1Q1PN2/1P3PPP/R1B1KB1R b KQ - 0 8',
  devNf3_after_d6:   'rn1q1rk1/pbp2ppp/1p1ppn2/8/2PP4/P1Q1PN2/1P3PPP/R1B1KB1R w KQ - 0 9',
  devNf3_after_Be2:  'rn1q1rk1/pbp2ppp/1p1ppn2/8/2PP4/P1Q1PN2/1P2BPPP/R1B1K2R b KQ - 1 9',
  devNf3_after_Nbd7: 'r2q1rk1/pbpn1ppp/1p1ppn2/8/2PP4/P1Q1PN2/1P2BPPP/R1B1K2R w KQ - 2 10',
}


// ═══════════════════════════════════════════════════════════
// nic-1: The Classical Nimzo (Nf6, e6, Bb4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const NIC_1: OpeningLesson = {
  id: 'nic-1',
  title: 'The Classical Nimzo',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Nimzo-Indian starts with a knight move, a pawn move, and a bold bishop pin. You'll learn the identity moves of this rock-solid defense." },

    // White plays 1.d4
    { type: 'instruction', fen: FEN.start, text: 'White opens with d4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'White played d4. How do you respond?', hint: 'Develop the knight to its most natural square.', correctFeedback: 'Nf6 develops the knight and controls the center.', wrongFeedback: 'Play Nf6 — develop the knight toward the center.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 is the Indian Defense move. It develops the knight and keeps your pawn structure flexible.', arrow: ['g8', 'f6'] },

    // White plays 2.c4
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White grabs more space with c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // PREDICT 2: e6
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'White expanded in the center. What do you play?', hint: 'Support a future d5 push and open the dark-squared bishop.', correctFeedback: 'e6 prepares d5 and frees the bishop on f8.', wrongFeedback: 'Play e6 — it supports d5 and opens the bishop diagonal.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6 is flexible. It prepares d5 and lets the dark-squared bishop come out to b4.', arrow: ['e7', 'e6'] },

    // White plays 3.Nc3
    { type: 'instruction', fen: FEN.after_e6, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 3: Bb4
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'White just developed the knight. Time for the signature Nimzo move.', hint: 'Pin the knight on c3 with your bishop.', correctFeedback: 'Bb4 pins the knight to the king — the heart of the Nimzo-Indian.', wrongFeedback: 'Play Bb4 — pin the knight on c3.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4 is the Nimzo-Indian. The bishop pins the c3 knight, and Black threatens to double White\'s pawns with Bxc3.', arrow: ['f8', 'b4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    { type: 'instruction', fen: FEN.after_Bb4, text: "Nf6, e6, Bb4 — the Nimzo-Indian is on the board. That bishop pin is your main weapon." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nic-2: The Exchange (O-O, Bxc3+, b6)
// ═══════════════════════════════════════════════════════════

const NIC_2: OpeningLesson = {
  id: 'nic-2',
  title: 'The Exchange',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb4, text: "White plays 4.Qc2 to avoid doubled pawns. You'll castle, trade the bishop, and prepare the fianchetto with b6." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    // White plays 4.Qc2
    { type: 'instruction', fen: FEN.after_Bb4, text: 'White plays Qc2, protecting c3 so the queen can recapture if you trade.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'White defended the knight with the queen. What do you do?', hint: 'Get your king to safety first.', correctFeedback: 'O-O tucks the king away and connects the rooks.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Castling early is always a good idea. Your king is safe and your rook is ready to join the fight.', arrow: ['e8', 'g8'] },

    // White plays 5.a3
    { type: 'instruction', fen: FEN.after_OO, text: 'White plays a3, asking the bishop what it wants to do.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },

    // PREDICT 2: Bxc3+
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'White is kicking your bishop. What do you play?', hint: 'Trade the bishop for the knight — that was the plan all along.', correctFeedback: 'Bxc3+ trades the bishop and the queen must recapture, giving White doubled pawns on c.', wrongFeedback: 'Play Bxc3+ — trade the bishop and make White recapture.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Bxc3+ forces the queen to recapture. White avoids doubled pawns but the queen is now on c3 instead of the center.', arrow: ['b4', 'c3'] },

    // White plays 6.Qxc3
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'White recaptures with the queen.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },

    // PREDICT 3: b6
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'The queen recaptured. How do you develop next?', hint: 'Prepare to fianchetto the bishop to b7.', correctFeedback: 'b6 prepares Bb7, putting the bishop on the long diagonal.', wrongFeedback: 'Play b6 — prepare the fianchetto to b7.' },
    { type: 'instruction', fen: FEN.after_b6, text: 'b6 prepares the bishop fianchetto. The bishop will go to b7, controlling the long diagonal and pressuring e4.', arrow: ['b7', 'b6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bb4, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Qxc3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },

    { type: 'instruction', fen: FEN.after_b6, text: "O-O, Bxc3+, b6 — you traded the bishop on your terms and set up the fianchetto." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nic-dev-e4: White plays 5.e4 instead of 5.a3
// ═══════════════════════════════════════════════════════════

const NIC_DEV_E4: OpeningLesson = {
  id: 'nic-dev-e4',
  title: 'Dev 5.e4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "Sometimes White skips a3 and pushes e4 for a big center. Here's how to fight back." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bb4, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_OO, text: 'White plays e4 instead of a3 — grabbing the center immediately.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 1: d5
    { type: 'play-move', fen: FEN.devE4_after_e4, correctMove: 'd5', prompt: 'White pushed e4. How do you challenge the center?', hint: 'Strike back in the center with a pawn push.', correctFeedback: 'd5 challenges White\'s center head-on.', wrongFeedback: 'Play d5 — fight for the center immediately.' },
    { type: 'instruction', fen: FEN.devE4_after_d5, text: 'd5 hits the c4 and e4 pawns at once. White can\'t hold the full center.', arrow: ['d7', 'd5'] },

    // White plays 6.e5
    { type: 'instruction', fen: FEN.devE4_after_d5, text: 'White pushes e5, chasing your knight.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },

    // PREDICT 2: Ne4
    { type: 'play-move', fen: FEN.devE4_after_e5, correctMove: 'Ne4', prompt: 'Your knight is under attack. Where does it go?', hint: 'Jump to a powerful central outpost.', correctFeedback: 'Ne4 plants the knight on a strong square, attacking c3.', wrongFeedback: 'Play Ne4 — centralize the knight and attack the c3 knight.' },
    { type: 'instruction', fen: FEN.devE4_after_Ne4, text: 'Ne4 is a strong outpost. The knight attacks the c3 knight and can\'t easily be kicked away.', arrow: ['f6', 'e4'] },

    // White plays 7.Bd3
    { type: 'instruction', fen: FEN.devE4_after_Ne4, text: 'White develops the bishop to d3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 3: c5
    { type: 'play-move', fen: FEN.devE4_after_Bd3, correctMove: 'c5', prompt: 'White developed the bishop. How do you undermine the center?', hint: 'Attack the d4 pawn from the side.', correctFeedback: 'c5 undermines the d4 pawn and opens lines on the queenside.', wrongFeedback: 'Play c5 — attack the base of White\'s pawn chain.' },
    { type: 'instruction', fen: FEN.devE4_after_c5, text: 'c5 attacks the d4 pawn. White\'s center is starting to look shaky.', arrow: ['c7', 'c5'] },

    // RECALL
    { type: 'instruction', fen: FEN.devE4_after_e4, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devE4_after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.devE4_after_d5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.devE4_after_e5, correctMove: 'Ne4', prompt: 'Your move.', hint: 'Ne4.', correctFeedback: 'Ne4.', wrongFeedback: 'Ne4.' },
    { type: 'instruction', fen: FEN.devE4_after_Ne4, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.devE4_after_Bd3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    { type: 'instruction', fen: FEN.devE4_after_c5, text: "d5, Ne4, c5 — against 5.e4 you fight back in the center and undermine White's pawn chain." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nic-3: The Fianchetto (Bb7, h6, d5)
// ═══════════════════════════════════════════════════════════

const NIC_3: OpeningLesson = {
  id: 'nic-3',
  title: 'The Fianchetto',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_b6, text: "Time to complete the fianchetto, deal with White's bishop pin, and stake your claim in the center." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bb4, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Qxc3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },

    // White plays 7.Bg5
    { type: 'instruction', fen: FEN.after_b6, text: 'White develops the bishop to g5, pinning your knight to the queen.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },

    // PREDICT 1: Bb7
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'Bb7', prompt: 'White pinned your knight. How do you continue?', hint: 'Complete the fianchetto you prepared with b6.', correctFeedback: 'Bb7 develops the bishop to the long diagonal, pressuring e4 and g2.', wrongFeedback: 'Play Bb7 — the whole point of b6 was this fianchetto.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'Bb7 completes the fianchetto. The bishop controls the long diagonal and puts pressure on e4.', arrow: ['c8', 'b7'] },

    // White plays 8.f3
    { type: 'instruction', fen: FEN.after_Bb7, text: 'White plays f3, reinforcing the center and preparing e4.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: h6
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h6', prompt: 'White played f3. What is a useful move here?', hint: 'Ask the bishop on g5 what it wants to do.', correctFeedback: 'h6 challenges the bishop on g5 — it must retreat or trade.', wrongFeedback: 'Play h6 — challenge the bishop and gain space on the kingside.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6 forces the bishop to make a decision. It will retreat to h4, where it\'s less active.', arrow: ['h7', 'h6'] },

    // White plays 9.Bh4
    { type: 'instruction', fen: FEN.after_h6, text: 'The bishop retreats to h4, maintaining the pin.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },

    // PREDICT 3: d5
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'd5', prompt: 'The bishop retreated. Time for your central strike.', hint: 'Push the d-pawn to challenge White\'s center.', correctFeedback: 'd5 strikes at the center, challenging the c4 pawn.', wrongFeedback: 'Play d5 — claim your share of the center.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5 is the key central break. It challenges c4 and activates your pieces. The bishop on b7 now has a clear view.', arrow: ['d7', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_b6, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_b6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    { type: 'instruction', fen: FEN.after_d5, text: "Bb7, h6, d5 — the fianchetto is complete, the bishop is pushed back, and your center is strong." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nic-4: The Deep Line (Nbd7, Nxd5, Nxc3)
// ═══════════════════════════════════════════════════════════

const NIC_4: OpeningLesson = {
  id: 'nic-4',
  title: 'The Deep Line',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_d5, text: "The position gets sharp. You'll develop the knight, recapture cleverly, and win material with a tactical sequence." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bb4, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Qxc3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },
    { type: 'instruction', fen: FEN.after_b6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    // White plays 10.e3
    { type: 'instruction', fen: FEN.after_d5, text: 'White plays e3, solidifying the center.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },

    // PREDICT 1: Nbd7
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Nbd7', prompt: 'White played e3. How do you develop?', hint: 'Develop your last minor piece.', correctFeedback: 'Nbd7 develops the knight and supports a future e5 or c5 break.', wrongFeedback: 'Play Nbd7 — bring the knight into the game.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7 completes development. The knight supports c5 or e5 breaks and keeps options open.', arrow: ['b8', 'd7'] },

    // White plays 11.cxd5
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'White captures cxd5, opening the position.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // PREDICT 2: Nxd5
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'White captured on d5. How do you recapture?', hint: 'Recapture with the knight to a strong central square.', correctFeedback: 'Nxd5 puts the knight on a strong outpost and sets up a tactical idea.', wrongFeedback: 'Play Nxd5 — the knight is powerful in the center.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Nxd5 centralizes the knight beautifully. It also sets up a sneaky tactical idea involving the bishop on h4.', arrow: ['f6', 'd5'] },

    // White plays 12.Bxd8
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'White takes the queen with Bxd8!', autoAdvance: 800, highlightSquares: ['h4', 'd8'] },

    // PREDICT 3: Nxc3
    { type: 'play-move', fen: FEN.after_Bxd8, correctMove: 'Nxc3', prompt: 'White took your queen! But you have a plan. What is it?', hint: 'The knight on d5 can fork the king and rook.', correctFeedback: 'Nxc3 wins the queen on c3 back, and you still have two minor pieces for the queen after Bxd8.', wrongFeedback: 'Play Nxc3 — capture the queen right back.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'Nxc3 takes the queen. The resulting position is balanced — Black has a knight and bishop for the queen plus a strong pawn structure.', arrow: ['d5', 'c3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d5, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_d5, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Bxd8.', autoAdvance: 800, highlightSquares: ['h4', 'd8'] },
    { type: 'play-move', fen: FEN.after_Bxd8, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },

    { type: 'instruction', fen: FEN.after_Nxc3, text: "Nbd7, Nxd5, Nxc3 — you traded queens but kept the balance. That's deep Nimzo-Indian theory." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nic-dev-Nf3: White plays 7.Nf3 instead of 7.Bg5
// ═══════════════════════════════════════════════════════════

const NIC_DEV_NF3: OpeningLesson = {
  id: 'nic-dev-Nf3',
  title: 'Dev 7.Nf3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_b6, text: "Sometimes White plays 7.Nf3 instead of 7.Bg5 — a quieter setup. Here's how to develop solidly." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bb4, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Qxc3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_b6, text: 'White plays Nf3 instead of Bg5 — developing the knight quietly.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 1: Bb7
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Bb7', prompt: 'White developed the knight. How do you continue?', hint: 'Complete the fianchetto you prepared with b6.', correctFeedback: 'Bb7 develops the bishop to the long diagonal, just like in the main line.', wrongFeedback: 'Play Bb7 — the fianchetto plan is the same.' },
    { type: 'instruction', fen: FEN.devNf3_after_Bb7, text: 'Bb7 completes the fianchetto. Whether White plays Bg5 or Nf3, your bishop belongs on b7.', arrow: ['c8', 'b7'] },

    // White plays 8.e3
    { type: 'instruction', fen: FEN.devNf3_after_Bb7, text: 'White plays e3, a solid developing move.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },

    // PREDICT 2: d6
    { type: 'play-move', fen: FEN.devNf3_after_e3, correctMove: 'd6', prompt: 'White played e3. What is a solid developing move?', hint: 'Prepare a flexible setup with d6.', correctFeedback: 'd6 keeps the position solid and prepares Nbd7.', wrongFeedback: 'Play d6 — a flexible, solid choice.' },
    { type: 'instruction', fen: FEN.devNf3_after_d6, text: 'd6 is a flexible choice. It doesn\'t commit to d5 yet and prepares to develop the knight to d7.', arrow: ['d7', 'd6'] },

    // White plays 9.Be2
    { type: 'instruction', fen: FEN.devNf3_after_d6, text: 'White develops the bishop to e2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 3: Nbd7
    { type: 'play-move', fen: FEN.devNf3_after_Be2, correctMove: 'Nbd7', prompt: 'White developed the bishop. Complete your development.', hint: 'Develop the last minor piece.', correctFeedback: 'Nbd7 develops the knight and supports a future e5 or c5 break.', wrongFeedback: 'Play Nbd7 — bring the last piece into play.' },
    { type: 'instruction', fen: FEN.devNf3_after_Nbd7, text: 'Nbd7 finishes development. From here you can play Ne4, c5, or e5 depending on what White does.', arrow: ['b8', 'd7'] },

    // RECALL
    { type: 'instruction', fen: FEN.devNf3_after_Nf3, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.devNf3_after_Bb7, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.devNf3_after_e3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.devNf3_after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.devNf3_after_Be2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    { type: 'instruction', fen: FEN.devNf3_after_Nbd7, text: "Bb7, d6, Nbd7 — against Nf3 you develop naturally. The Nimzo-Indian setup works against everything." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nic-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const NIC_TEST_1: OpeningLesson = {
  id: 'nic-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE RECALL (all 12 Black moves) ===
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Qxc3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },
    { type: 'instruction', fen: FEN.after_b6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_Bb7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Bxd8.', autoAdvance: 800, highlightSquares: ['h4', 'd8'] },
    { type: 'play-move', fen: FEN.after_Bxd8, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },

    // === DEVIATION: 5.e4 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_OO, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.devE4_after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.devE4_after_d5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.devE4_after_e5, correctMove: 'Ne4', prompt: 'Your move.', hint: 'Ne4.', correctFeedback: 'Ne4.', wrongFeedback: 'Ne4.' },
    { type: 'instruction', fen: FEN.devE4_after_Ne4, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.devE4_after_Bd3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // === DEVIATION: 7.Nf3 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_OO, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.after_Bxc3, text: 'Qxc3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_Qxc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_b6, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.devNf3_after_Bb7, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.devNf3_after_e3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.devNf3_after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.devNf3_after_Be2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP
// ═══════════════════════════════════════════════════════════

export function getNimzoIndianClassicalLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'nic-1': return NIC_1
    case 'nic-2': return NIC_2
    case 'nic-dev-e4': return NIC_DEV_E4
    case 'nic-3': return NIC_3
    case 'nic-4': return NIC_4
    case 'nic-dev-Nf3': return NIC_DEV_NF3
    case 'nic-test-1': return NIC_TEST_1
    default: return undefined
  }
}
