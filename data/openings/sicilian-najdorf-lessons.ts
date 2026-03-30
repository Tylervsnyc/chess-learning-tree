import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN NAJDORF LESSONS (sn-1 through sn-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line (English Attack):
// 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6
// 6.Be3 e5 7.Nb3 Be6 8.f3 h5 9.Nd5 Bxd5
// 10.exd5 Nbd7 11.Qd2 g6 12.Be2 Bg7
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c5:    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:   'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_d6:    'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  after_d4:    'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3',
  after_cxd4:  'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  after_Nxd4:  'rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  after_Nf6:   'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  after_Nc3:   'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  after_a6:    'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  after_Be3:   'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6',
  after_e5:    'rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7',
  after_Nb3:   'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R b KQkq - 1 7',
  after_Be6:   'rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq - 2 8',
  after_f3:    'rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R b KQkq - 0 8',
  after_h5:    'rn1qkb1r/1p3pp1/p2pbn2/4p2p/4P3/1NN1BP2/PPP3PP/R2QKB1R w KQkq - 0 9',
  after_Nd5:   'rn1qkb1r/1p3pp1/p2pbn2/3Np2p/4P3/1N2BP2/PPP3PP/R2QKB1R b KQkq - 1 9',
  after_Bxd5:  'rn1qkb1r/1p3pp1/p2p1n2/3bp2p/4P3/1N2BP2/PPP3PP/R2QKB1R w KQkq - 0 10',
  after_exd5:  'rn1qkb1r/1p3pp1/p2p1n2/3Pp2p/8/1N2BP2/PPP3PP/R2QKB1R b KQkq - 0 10',
  after_Nbd7:  'r2qkb1r/1p1n1pp1/p2p1n2/3Pp2p/8/1N2BP2/PPP3PP/R2QKB1R w KQkq - 1 11',
  after_Qd2:   'r2qkb1r/1p1n1pp1/p2p1n2/3Pp2p/8/1N2BP2/PPPQ2PP/R3KB1R b KQkq - 2 11',
  after_g6:    'r2qkb1r/1p1n1p2/p2p1np1/3Pp2p/8/1N2BP2/PPPQ2PP/R3KB1R w KQkq - 0 12',
  after_Be2:   'r2qkb1r/1p1n1p2/p2p1np1/3Pp2p/8/1N2BP2/PPPQB1PP/R3K2R b KQkq - 1 12',
  after_Bg7:   'r2qk2r/1p1n1pb1/p2p1np1/3Pp2p/8/1N2BP2/PPPQB1PP/R3K2R w KQkq - 2 13',

  // Deviation: 6.Be2 (instead of 6.Be3)
  devBe2_after_Be2:    'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 1 6',
  devBe2_after_e5:     'rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq - 0 7',
  devBe2_after_Nb3:    'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQK2R b KQkq - 1 7',
  devBe2_after_Be7:    'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQK2R w KQkq - 2 8',
  devBe2_after_OO_w:   'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQ1RK1 b kq - 3 8',
  devBe2_after_OO_b:   'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQ1RK1 w - - 4 9',
  devBe2_after_Be3:    'rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 b - - 5 9',
  devBe2_after_Be6:    'rn1q1rk1/1p2bppp/p2pbn2/4p3/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 6 10',

  // Deviation: 7.Nf3 (instead of 7.Nb3) — after 6.Be3 e5
  devNf3_after_Nf3:    'rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/2N1BN2/PPP2PPP/R2QKB1R b KQkq - 1 7',
  devNf3_after_Be7:    'rnbqk2r/1p2bppp/p2p1n2/4p3/4P3/2N1BN2/PPP2PPP/R2QKB1R w KQkq - 2 8',
  devNf3_after_Bc4:    'rnbqk2r/1p2bppp/p2p1n2/4p3/2B1P3/2N1BN2/PPP2PPP/R2QK2R b KQkq - 3 8',
  devNf3_after_OO:     'rnbq1rk1/1p2bppp/p2p1n2/4p3/2B1P3/2N1BN2/PPP2PPP/R2QK2R w KQ - 4 9',
  devNf3_after_OO_w:   'rnbq1rk1/1p2bppp/p2p1n2/4p3/2B1P3/2N1BN2/PPP2PPP/R2Q1RK1 b - - 5 9',
  devNf3_after_Be6:    'rn1q1rk1/1p2bppp/p2pbn2/4p3/2B1P3/2N1BN2/PPP2PPP/R2Q1RK1 w - - 6 10',

  // Deviation: 8.Qd2 (instead of 8.f3) — after 6.Be3 e5 7.Nb3 Be6
  devQd2_after_Qd2:    'rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPPQ1PPP/R3KB1R b KQkq - 3 8',
  devQd2_after_Nbd7:   'r2qkb1r/1p1n1ppp/p2pbn2/4p3/4P3/1NN1B3/PPPQ1PPP/R3KB1R w KQkq - 4 9',
  devQd2_after_f3:     'r2qkb1r/1p1n1ppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R b KQkq - 0 9',
  devQd2_after_b5:     'r2qkb1r/3n1ppp/p2pbn2/1p2p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R w KQkq - 0 10',
  devQd2_after_OOO:    'r2qkb1r/3n1ppp/p2pbn2/1p2p3/4P3/1NN1BP2/PPPQ2PP/2KR1B1R b kq - 1 10',
  devQd2_after_Be7:    'r2qk2r/3nbppp/p2pbn2/1p2p3/4P3/1NN1BP2/PPPQ2PP/2KR1B1R w kq - 2 11',
}


// ═══════════════════════════════════════════════════════════
// sn-1: The Najdorf Move (c5, d6, cxd4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SN_1: OpeningLesson = {
  id: 'sn-1',
  title: 'The Najdorf Move',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Sicilian Najdorf starts with the same Open Sicilian moves — c5, d6, and cxd4. Let's learn the move order." },

    // White plays 1.e4
    { type: 'instruction', fen: FEN.start, text: 'White opens with e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 1: c5
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'What is the Sicilian move?', hint: 'Fight for d4 with a pawn from c7.', correctFeedback: 'c5 fights for the d4 square without blocking your other pieces.', wrongFeedback: 'Play c5 — the signature Sicilian move.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'c5 challenges the center from the side. It keeps the d-file open for your queen and avoids symmetry.', arrow: ['c7', 'c5'] },

    // White plays 2.Nf3
    { type: 'instruction', fen: FEN.after_c5, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 2: d6
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'How do you support c5 and prepare development?', hint: 'A solid pawn move that supports c5 and opens the bishop diagonal.', correctFeedback: 'd6 supports the c5 pawn and keeps your position flexible.', wrongFeedback: 'Play d6 — it supports c5 and opens lines for your bishop.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 is the solid foundation of the Sicilian. It supports c5 and keeps your options open for later.', arrow: ['d7', 'd6'] },

    // White plays 3.d4
    { type: 'instruction', fen: FEN.after_d6, text: 'White pushes d4, challenging your c5 pawn.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 3: cxd4
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'White pushed d4. What do you do?', hint: 'Capture on d4 to open the c-file.', correctFeedback: 'cxd4 opens the c-file, which becomes a key attacking lane for Black.', wrongFeedback: 'Take on d4 — cxd4 opens the c-file for your rook.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'cxd4 creates the Open Sicilian. The c-file is now open for your rook, and White has to spend a move recapturing.', arrow: ['c5', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    { type: 'instruction', fen: FEN.after_cxd4, text: "c5, d6, cxd4 — the Open Sicilian. The c-file is yours." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-2: The a6 Idea (Nf6, a6, e5)
// ═══════════════════════════════════════════════════════════

const SN_2: OpeningLesson = {
  id: 'sn-2',
  title: 'The a6 Idea',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_cxd4, text: "Now you'll play the Najdorf signature moves — Nf6, the famous a6, and the central push e5." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // White plays 4.Nxd4
    { type: 'instruction', fen: FEN.after_cxd4, text: 'White recaptures with Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Time to develop. Where does the knight go?', hint: 'Develop the kingside knight to its most natural square.', correctFeedback: 'Nf6 develops with tempo, attacking the e4 pawn.', wrongFeedback: 'Play Nf6 — it develops and puts pressure on e4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 develops the knight and attacks e4. White needs to defend it.', arrow: ['g8', 'f6'] },

    // White plays 5.Nc3
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White defends e4 with Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 2: a6
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'This is the Najdorf move. What do you play?', hint: 'A small pawn move that controls the b5 square.', correctFeedback: 'a6 is the Najdorf. It stops Bb5 and prepares a future b5 push.', wrongFeedback: 'Play a6 — the move that defines the Najdorf Variation.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6 looks quiet but does a lot. It stops Bb5 pins, prepares b5 expansion, and keeps your position flexible.', arrow: ['a7', 'a6'] },

    // White plays 6.Be3
    { type: 'instruction', fen: FEN.after_a6, text: 'White develops the bishop to e3, preparing the English Attack.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 3: e5
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'White developed the bishop. How do you fight for the center?', hint: 'Push a center pawn to challenge White\'s knight.', correctFeedback: 'e5 grabs space and forces the knight on d4 to move.', wrongFeedback: 'Play e5 — push the center pawn and attack the knight.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5 grabs central space and forces the d4 knight to retreat. This is the main plan in the Najdorf.', arrow: ['e7', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_cxd4, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    { type: 'instruction', fen: FEN.after_e5, text: "Nf6, a6, e5 — the Najdorf is set. You've got space and the knight is retreating." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-dev-Be2: White plays 6.Be2 instead of 6.Be3
// ═══════════════════════════════════════════════════════════

const SN_DEV_BE2: OpeningLesson = {
  id: 'sn-dev-Be2',
  title: 'Dev 6.Be2',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "Sometimes White plays 6.Be2 instead of 6.Be3 — a quieter approach. Your plan stays the same: push e5 and develop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_cxd4, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays Be2 instead of Be3 — developing the bishop more quietly.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 1: e5
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'e5', prompt: 'White chose Be2. What do you play?', hint: 'Your plan stays the same — grab the center.', correctFeedback: 'e5 is still the right move. The center push works against Be2 too.', wrongFeedback: 'Play e5 — the plan doesn\'t change.' },
    { type: 'instruction', fen: FEN.devBe2_after_e5, text: 'e5 works just as well against Be2. You still grab central space and force the knight to retreat.', arrow: ['e7', 'e5'] },

    // White plays 7.Nb3
    { type: 'instruction', fen: FEN.devBe2_after_e5, text: 'White retreats the knight to b3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },

    // PREDICT 2: Be7
    { type: 'play-move', fen: FEN.devBe2_after_Nb3, correctMove: 'Be7', prompt: 'The knight retreated. How do you develop?', hint: 'Develop the bishop to prepare castling.', correctFeedback: 'Be7 develops the bishop and prepares to castle kingside.', wrongFeedback: 'Play Be7 — develop and prepare to castle.' },
    { type: 'instruction', fen: FEN.devBe2_after_Be7, text: 'Be7 is natural development. The bishop is safe and you can castle on the next move.', arrow: ['f8', 'e7'] },

    // White plays 8.O-O
    { type: 'instruction', fen: FEN.devBe2_after_Be7, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'White castled. Your turn.', hint: 'Castle kingside — get your king safe.', correctFeedback: 'O-O gets the king to safety and connects the rooks.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.devBe2_after_OO_b, text: 'Both sides have castled. Your position is solid with the e5 pawn controlling the center.', arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.devBe2_after_Be2, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.devBe2_after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.devBe2_after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.devBe2_after_Be7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.devBe2_after_OO_b, text: "Against 6.Be2 — e5, Be7, O-O. Same plan, different bishop square." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-3: Bishop and Pawn Storm (Be6, h5, Bxd5)
// ═══════════════════════════════════════════════════════════

const SN_3: OpeningLesson = {
  id: 'sn-3',
  title: 'Bishop and Pawn Storm',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_e5, text: "White is setting up the English Attack with f3 and Qd2. You'll develop the bishop, push h5 to slow White's kingside attack, and trade on d5." },

    // RECAP
    { type: 'instruction', fen: FEN.after_cxd4, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // White plays 7.Nb3
    { type: 'instruction', fen: FEN.after_e5, text: 'White retreats the knight to b3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },

    // PREDICT 1: Be6
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'The knight retreated. Time to develop a piece. Where?', hint: 'Develop the bishop to a strong central diagonal.', correctFeedback: 'Be6 develops the bishop to a great square, controlling d5 and eyeing the queenside.', wrongFeedback: 'Play Be6 — the bishop belongs on this strong diagonal.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Be6 is a key developing move. The bishop controls d5 and supports future queenside play.', arrow: ['c8', 'e6'] },

    // White plays 8.f3
    { type: 'instruction', fen: FEN.after_Be6, text: 'White plays f3, preparing a kingside pawn storm with g4.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: h5
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h5', prompt: 'White is preparing g4. How do you slow that down?', hint: 'Push a pawn to discourage White\'s g4 advance.', correctFeedback: 'h5 stops g4 in its tracks, slowing White\'s kingside attack before it starts.', wrongFeedback: 'Play h5 — it prevents White from pushing g4.' },
    { type: 'instruction', fen: FEN.after_h5, text: 'h5 is a clever preventive move. By controlling g4, you take the teeth out of White\'s planned pawn storm.', arrow: ['h7', 'h5'] },

    // White plays 9.Nd5
    { type: 'instruction', fen: FEN.after_h5, text: 'White jumps the knight to d5, a powerful outpost.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },

    // PREDICT 3: Bxd5
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Bxd5', prompt: 'White planted a knight on d5. What do you do?', hint: 'Trade the bishop for the knight — remove it from d5.', correctFeedback: 'Bxd5 eliminates the powerful knight. White has to recapture with the pawn.', wrongFeedback: 'Capture on d5 — Bxd5 removes the knight.' },
    { type: 'instruction', fen: FEN.after_Bxd5, text: 'Bxd5 trades the bishop for the strong knight. White will recapture with exd5, but your position stays solid.', arrow: ['e6', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e5, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h5', prompt: 'Your move.', hint: 'h5.', correctFeedback: 'h5.', wrongFeedback: 'h5.' },
    { type: 'instruction', fen: FEN.after_h5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Bxd5', prompt: 'Your move.', hint: 'Bxd5.', correctFeedback: 'Bxd5.', wrongFeedback: 'Bxd5.' },

    { type: 'instruction', fen: FEN.after_Bxd5, text: "Be6, h5, Bxd5 — you've developed, stopped the pawn storm, and traded off the knight." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-dev-Nf3: White plays 7.Nf3 instead of 7.Nb3
// ═══════════════════════════════════════════════════════════

const SN_DEV_NF3: OpeningLesson = {
  id: 'sn-dev-Nf3',
  title: 'Dev 7.Nf3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_e5, text: "Sometimes White retreats the knight to f3 instead of b3. You'll develop the bishop, castle, and activate the light-squared bishop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_cxd4, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_e5, text: 'White retreats the knight to f3 instead of b3.', autoAdvance: 800, highlightSquares: ['d4', 'f3'] },

    // PREDICT 1: Be7
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Be7', prompt: 'White went Nf3. How do you develop?', hint: 'Develop the bishop to prepare castling.', correctFeedback: 'Be7 develops naturally and prepares to castle kingside.', wrongFeedback: 'Play Be7 — develop and get ready to castle.' },
    { type: 'instruction', fen: FEN.devNf3_after_Be7, text: 'Be7 is smooth development. You are one move away from castling.', arrow: ['f8', 'e7'] },

    // White plays 8.Bc4
    { type: 'instruction', fen: FEN.devNf3_after_Be7, text: 'White develops the bishop to c4, eyeing f7.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.devNf3_after_Bc4, correctMove: 'O-O', prompt: 'White developed the bishop. What\'s your priority?', hint: 'Get your king to safety.', correctFeedback: 'O-O gets the king safe before the position opens up.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.devNf3_after_OO, text: 'Castling first is important. Your king is safe and the rook is connected.', arrow: ['e8', 'g8'] },

    // White plays 9.O-O
    { type: 'instruction', fen: FEN.devNf3_after_OO, text: 'White castles too.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 3: Be6
    { type: 'play-move', fen: FEN.devNf3_after_OO_w, correctMove: 'Be6', prompt: 'Both sides castled. How do you develop?', hint: 'Activate the light-squared bishop.', correctFeedback: 'Be6 develops the bishop and challenges White\'s c4 bishop.', wrongFeedback: 'Play Be6 — activate the bishop and challenge c4.' },
    { type: 'instruction', fen: FEN.devNf3_after_Be6, text: 'Be6 challenges the c4 bishop directly. White will likely retreat it, and you\'ve gained time.', arrow: ['c8', 'e6'] },

    // RECALL
    { type: 'instruction', fen: FEN.devNf3_after_Nf3, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.devNf3_after_Be7, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.devNf3_after_Bc4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devNf3_after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devNf3_after_OO_w, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    { type: 'instruction', fen: FEN.devNf3_after_Be6, text: "Against 7.Nf3 — Be7, O-O, Be6. Develop calmly and challenge their bishop." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-4: The Najdorf Middlegame (Nbd7, g6, Bg7)
// ═══════════════════════════════════════════════════════════

const SN_4: OpeningLesson = {
  id: 'sn-4',
  title: 'The Najdorf Middlegame',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bxd5, text: "After the trade on d5, White recaptures with the pawn. You'll regroup the knight, fianchetto the bishop, and get ready to castle." },

    // RECAP
    { type: 'instruction', fen: FEN.after_cxd4, text: "Run through the full line first." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h5', prompt: 'Your move.', hint: 'h5.', correctFeedback: 'h5.', wrongFeedback: 'h5.' },
    { type: 'instruction', fen: FEN.after_h5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Bxd5', prompt: 'Your move.', hint: 'Bxd5.', correctFeedback: 'Bxd5.', wrongFeedback: 'Bxd5.' },

    // White plays 10.exd5
    { type: 'instruction', fen: FEN.after_Bxd5, text: 'White recaptures with exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },

    // PREDICT 1: Nbd7
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nbd7', prompt: 'White took on d5. How do you develop the queenside knight?', hint: 'Bring the knight out to support your position.', correctFeedback: 'Nbd7 develops the knight to a flexible square where it supports e5 and can go to c5 or f8.', wrongFeedback: 'Play Nbd7 — the knight supports e5 and has options.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7 is the best square for this knight. It supports the e5 pawn and can jump to c5 or f8 later.', arrow: ['b8', 'd7'] },

    // White plays 11.Qd2
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'White centralizes the queen on d2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 2: g6
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'g6', prompt: 'White brought the queen to d2. What do you prepare?', hint: 'Prepare to fianchetto the dark-squared bishop.', correctFeedback: 'g6 prepares Bg7, placing the bishop on the long diagonal.', wrongFeedback: 'Play g6 — prepare the fianchetto on g7.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'g6 sets up the fianchetto. The bishop on g7 will control the long diagonal and support the e5 pawn.', arrow: ['g7', 'g6'] },

    // White plays 12.Be2
    { type: 'instruction', fen: FEN.after_g6, text: 'White develops the bishop to e2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 3: Bg7
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bg7', prompt: 'Complete the fianchetto.', hint: 'Put the bishop on the long diagonal.', correctFeedback: 'Bg7 completes the fianchetto. The bishop controls the a1-h8 diagonal.', wrongFeedback: 'Play Bg7 — the bishop belongs on the long diagonal.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Bg7 is a powerful placement. The bishop eyes the long diagonal and supports your central pawn chain.', arrow: ['f8', 'g7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bxd5, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Bxd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    { type: 'instruction', fen: FEN.after_Bg7, text: "Nbd7, g6, Bg7 — you're ready to castle and fight in the middlegame." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-dev-Qd2: White plays 8.Qd2 instead of 8.f3
// ═══════════════════════════════════════════════════════════

const SN_DEV_QD2: OpeningLesson = {
  id: 'sn-dev-Qd2',
  title: 'Dev 8.Qd2',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Be6, text: "Sometimes White plays 8.Qd2 instead of 8.f3, developing the queen early. You'll regroup the knight, push b5, and develop the bishop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_cxd4, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Be6, text: 'White plays Qd2 instead of f3, centralizing the queen early.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 1: Nbd7
    { type: 'play-move', fen: FEN.devQd2_after_Qd2, correctMove: 'Nbd7', prompt: 'White brought the queen to d2. How do you develop?', hint: 'Develop the queenside knight to a flexible square.', correctFeedback: 'Nbd7 develops the knight and supports the e5 pawn.', wrongFeedback: 'Play Nbd7 — develop the knight and support e5.' },
    { type: 'instruction', fen: FEN.devQd2_after_Nbd7, text: 'Nbd7 is the right spot. The knight supports e5 and can reroute to c5 later for queenside pressure.', arrow: ['b8', 'd7'] },

    // White plays 9.f3
    { type: 'instruction', fen: FEN.devQd2_after_Nbd7, text: 'White plays f3, reinforcing the center.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: b5
    { type: 'play-move', fen: FEN.devQd2_after_f3, correctMove: 'b5', prompt: 'White played f3. How do you expand on the queenside?', hint: 'Push the b-pawn to grab space — remember a6 prepared this.', correctFeedback: 'b5 expands on the queenside. This is what a6 was preparing all along.', wrongFeedback: 'Play b5 — grab queenside space. That is why you played a6.' },
    { type: 'instruction', fen: FEN.devQd2_after_b5, text: 'b5 seizes queenside space. The a6 pawn supported this push, and now you threaten b4 to kick the knight.', arrow: ['b7', 'b5'] },

    // White plays 10.O-O-O
    { type: 'instruction', fen: FEN.devQd2_after_b5, text: 'White castles queenside.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },

    // PREDICT 3: Be7
    { type: 'play-move', fen: FEN.devQd2_after_OOO, correctMove: 'Be7', prompt: 'White castled queenside. What do you develop next?', hint: 'Develop the dark-squared bishop to prepare castling.', correctFeedback: 'Be7 develops the bishop and prepares to castle kingside — opposite-side castling.', wrongFeedback: 'Play Be7 — develop and prepare to castle.' },
    { type: 'instruction', fen: FEN.devQd2_after_Be7, text: 'Be7 finishes development. You can castle kingside next, setting up an opposite-side castling battle.', arrow: ['f8', 'e7'] },

    // RECALL
    { type: 'instruction', fen: FEN.devQd2_after_Qd2, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devQd2_after_Qd2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.devQd2_after_Nbd7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.devQd2_after_f3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.devQd2_after_b5, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.devQd2_after_OOO, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },

    { type: 'instruction', fen: FEN.devQd2_after_Be7, text: "Against 8.Qd2 — Nbd7, b5, Be7. Queenside expansion and smooth development." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sn-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const SN_TEST_1: OpeningLesson = {
  id: 'sn-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE RECALL (all 12 Black moves) ===
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'h5', prompt: 'Your move.', hint: 'h5.', correctFeedback: 'h5.', wrongFeedback: 'h5.' },
    { type: 'instruction', fen: FEN.after_h5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Bxd5', prompt: 'Your move.', hint: 'Bxd5.', correctFeedback: 'Bxd5.', wrongFeedback: 'Bxd5.' },
    { type: 'instruction', fen: FEN.after_Bxd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // === DEVIATION: 6.Be2 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_a6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.devBe2_after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.devBe2_after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.devBe2_after_Be7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // === DEVIATION: 7.Nf3 ===
    // Replay to deviation point (after 6.Be3 e5)
    { type: 'instruction', fen: FEN.after_a6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_e5, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['d4', 'f3'] },
    { type: 'play-move', fen: FEN.devNf3_after_Nf3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.devNf3_after_Be7, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.devNf3_after_Bc4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devNf3_after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devNf3_after_OO_w, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    // === DEVIATION: 8.Qd2 ===
    // Replay to deviation point (after 7.Nb3 Be6)
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_Be6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.devQd2_after_Qd2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.devQd2_after_Nbd7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.devQd2_after_f3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.devQd2_after_b5, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.devQd2_after_OOO, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getSicilianNajdorfLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'sn-1': return SN_1
    case 'sn-2': return SN_2
    case 'sn-dev-Be2': return SN_DEV_BE2
    case 'sn-3': return SN_3
    case 'sn-dev-Nf3': return SN_DEV_NF3
    case 'sn-4': return SN_4
    case 'sn-dev-Qd2': return SN_DEV_QD2
    case 'sn-test-1': return SN_TEST_1
    default: return undefined
  }
}
