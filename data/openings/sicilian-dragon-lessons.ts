import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN DRAGON LESSONS (sd-1 through sd-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line (Yugoslav Attack):
// 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6
// 6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.O-O-O d5
// 10.exd5 Nxd5 11.Nxc6 bxc6 12.Bd4 e5
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
  after_g6:    'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
  after_Be3:   'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6',
  after_Bg7:   'rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7',
  after_f3:    'rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7',
  after_OO:    'rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ - 1 8',
  after_Qd2:   'rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ - 2 8',
  after_Nc6:   'r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9',
  after_OOO:   'r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9',
  after_d5:    'r1bq1rk1/pp2ppbp/2n2np1/3p4/3NP3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 10',
  after_exd5:  'r1bq1rk1/pp2ppbp/2n2np1/3P4/3N4/2N1BP2/PPPQ2PP/2KR1B1R b - - 0 10',
  after_Nxd5:  'r1bq1rk1/pp2ppbp/2n3p1/3n4/3N4/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 11',
  after_Nxc6:  'r1bq1rk1/pp2ppbp/2N3p1/3n4/8/2N1BP2/PPPQ2PP/2KR1B1R b - - 0 11',
  after_bxc6:  'r1bq1rk1/p3ppbp/2p3p1/3n4/8/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 12',
  after_Bd4:   'r1bq1rk1/p3ppbp/2p3p1/3n4/3B4/2N2P2/PPPQ2PP/2KR1B1R b - - 1 12',
  after_e5:    'r1bq1rk1/p4pbp/2p3p1/3np3/3B4/2N2P2/PPPQ2PP/2KR1B1R w - - 0 13',

  // Deviation: 6.Be2 (instead of 6.Be3)
  devBe2_after_Be2:  'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 1 6',
  devBe2_after_Bg7:  'rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq - 2 7',
  devBe2_after_OO_w: 'rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 b kq - 3 7',
  devBe2_after_OO_b: 'rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w - - 4 8',
  devBe2_after_Bg5:  'rnbq1rk1/pp2ppbp/3p1np1/6B1/3NP3/2N5/PPP1BPPP/R2Q1RK1 b - - 5 8',
  devBe2_after_Nc6:  'r1bq1rk1/pp2ppbp/2np1np1/6B1/3NP3/2N5/PPP1BPPP/R2Q1RK1 w - - 6 9',

  // Deviation: 9.g4 (instead of 9.O-O-O)
  devG4_after_g4:    'r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9',
  devG4_after_Be6:   'r2q1rk1/pp2ppbp/2npbnp1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R w KQ - 1 10',
  devG4_after_Nxe6:  'r2q1rk1/pp2ppbp/2npNnp1/8/4P1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 10',
  devG4_after_fxe6:  'r2q1rk1/pp2p1bp/2nppnp1/8/4P1P1/2N1BP2/PPPQ3P/R3KB1R w KQ - 0 11',
  devG4_after_OOO:   'r2q1rk1/pp2p1bp/2nppnp1/8/4P1P1/2N1BP2/PPPQ3P/2KR1B1R b - - 1 11',
  devG4_after_Ne5:   'r2q1rk1/pp2p1bp/3ppnp1/4n3/4P1P1/2N1BP2/PPPQ3P/2KR1B1R w - - 2 12',

  // Deviation: 10.Qe1 (instead of 10.exd5)
  devQe1_after_Qe1:  'r1bq1rk1/pp2ppbp/2n2np1/3p4/3NP3/2N1BP2/PPP3PP/2KRQB1R b - - 1 10',
  devQe1_after_e5:   'r1bq1rk1/pp3pbp/2n2np1/3pp3/3NP3/2N1BP2/PPP3PP/2KRQB1R w - - 0 11',
  devQe1_after_Nxc6: 'r1bq1rk1/pp3pbp/2N2np1/3pp3/4P3/2N1BP2/PPP3PP/2KRQB1R b - - 0 11',
  devQe1_after_bxc6: 'r1bq1rk1/p4pbp/2p2np1/3pp3/4P3/2N1BP2/PPP3PP/2KRQB1R w - - 0 12',
  devQe1_after_exd5: 'r1bq1rk1/p4pbp/2p2np1/3Pp3/8/2N1BP2/PPP3PP/2KRQB1R b - - 0 12',
  devQe1_after_Nxd5: 'r1bq1rk1/p4pbp/2p3p1/3np3/8/2N1BP2/PPP3PP/2KRQB1R w - - 0 13',
}


// ═══════════════════════════════════════════════════════════
// sd-1: The Sicilian Move (c5, d6, cxd4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SD_1: OpeningLesson = {
  id: 'sd-1',
  title: 'The Sicilian Move',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Sicilian Defense starts with 1...c5 — fighting for the center without mirroring White. You'll learn the classic Dragon move order." },

    // White plays 1.e4
    { type: 'instruction', fen: FEN.start, text: 'White opens with e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 1: c5
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'What is the Sicilian move?', hint: 'Fight for d4 with a pawn from c7.', correctFeedback: 'c5 fights for the d4 square without blocking your other pieces.', wrongFeedback: 'Play c5 — the signature Sicilian move.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'c5 fights for the center from the side. Unlike e5, it keeps the d-file open for your queen and avoids symmetry.', arrow: ['c7', 'c5'] },

    // White plays 2.Nf3
    { type: 'instruction', fen: FEN.after_c5, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 2: d6
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'How do you support your c5 pawn and prepare development?', hint: 'A solid pawn move that supports c5 and opens the bishop diagonal.', correctFeedback: 'd6 supports the c5 pawn and prepares to develop pieces.', wrongFeedback: 'Play d6 — it supports c5 and opens lines for your bishop.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 is the solid foundation. It supports c5 and clears the way for the bishop to go to g7 later.', arrow: ['d7', 'd6'] },

    // White plays 3.d4
    { type: 'instruction', fen: FEN.after_d6, text: 'White pushes d4, challenging your c5 pawn.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 3: cxd4
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'White pushed d4. What do you do?', hint: 'Capture on d4 — open the c-file for your rook.', correctFeedback: 'cxd4 opens the c-file, which becomes a key attacking lane for Black.', wrongFeedback: 'Take on d4 — cxd4 opens the c-file for your rook.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'cxd4 is the Open Sicilian. The c-file is now open for your rook, and White has to spend a tempo recapturing.', arrow: ['c5', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    { type: 'instruction', fen: FEN.after_cxd4, text: "c5, d6, cxd4 — the Sicilian is open. The c-file is yours." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-2: Enter the Dragon (Nf6, g6, Bg7)
// ═══════════════════════════════════════════════════════════

const SD_2: OpeningLesson = {
  id: 'sd-2',
  title: 'Enter the Dragon',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_cxd4, text: "Now you'll set up the Dragon formation — knight to f6, g6, and the powerful bishop fianchetto." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // White plays 4.Nxd4
    { type: 'instruction', fen: FEN.after_cxd4, text: 'White recaptures Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Time to develop. Where does the knight go?', hint: 'Develop the kingside knight to its most natural square.', correctFeedback: 'Nf6 develops with tempo, attacking the e4 pawn.', wrongFeedback: 'Play Nf6 — it develops and puts pressure on e4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 develops the knight to its best square and attacks e4. White has to defend.', arrow: ['g8', 'f6'] },

    // White plays 5.Nc3
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White defends e4 with Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 2: g6
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'This is the Dragon move. What do you play?', hint: 'Prepare to fianchetto the bishop on g7.', correctFeedback: 'g6 prepares the Dragon bishop on g7, aiming at the long diagonal.', wrongFeedback: 'Play g6 — set up the fianchetto that gives the Dragon its fire.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'g6 is the defining move of the Dragon. The bishop will go to g7, controlling the long diagonal from a1 to h8.', arrow: ['g7', 'g6'] },

    // White plays 6.Be3
    { type: 'instruction', fen: FEN.after_g6, text: 'White develops the bishop to e3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 3: Bg7
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Bg7', prompt: 'Complete the fianchetto.', hint: 'Put the bishop on the long diagonal.', correctFeedback: 'Bg7 completes the fianchetto — the Dragon bishop controls the whole diagonal.', wrongFeedback: 'Play Bg7 — the Dragon bishop belongs on the long diagonal.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Bg7 is the Dragon bishop. It stares down the a1-h8 diagonal and will be a monster once the center opens.', arrow: ['f8', 'g7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_cxd4, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    { type: 'instruction', fen: FEN.after_Bg7, text: "Nf6, g6, Bg7 — the Dragon is alive. Your bishop is breathing fire down the long diagonal." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-dev-Be2: White plays 6.Be2 instead of 6.Be3
// ═══════════════════════════════════════════════════════════

const SD_DEV_BE2: OpeningLesson = {
  id: 'sd-dev-Be2',
  title: 'Dev 6.Be2',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_g6, text: "Sometimes White plays 6.Be2 instead of 6.Be3 — a quieter approach. Here's how to develop smoothly." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_cxd4, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_g6, text: 'White plays Be2 instead of Be3 — a more cautious development.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 1: Bg7
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'Bg7', prompt: 'White chose Be2. What do you play?', hint: 'Your plan stays the same — fianchetto.', correctFeedback: 'Bg7 — the Dragon setup is the same regardless of where White puts the bishop.', wrongFeedback: 'Play Bg7 — finish the fianchetto.' },
    { type: 'instruction', fen: FEN.devBe2_after_Bg7, text: 'Bg7 completes the fianchetto. Your plan doesn\'t change — the Dragon bishop still controls the long diagonal.', arrow: ['f8', 'g7'] },

    // White plays 7.O-O
    { type: 'instruction', fen: FEN.devBe2_after_Bg7, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'White castled. Your turn to get safe.', hint: 'Castle kingside too — your king belongs behind the fianchetto.', correctFeedback: 'O-O tucks the king safely behind the g7 bishop and connects the rooks.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.devBe2_after_OO_b, text: 'Both sides castled kingside. Your king is safe behind the fianchetto pawns and the Dragon bishop.', arrow: ['e8', 'g8'] },

    // White plays 8.Bg5
    { type: 'instruction', fen: FEN.devBe2_after_OO_b, text: 'White pins your knight with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },

    // PREDICT 3: Nc6
    { type: 'play-move', fen: FEN.devBe2_after_Bg5, correctMove: 'Nc6', prompt: 'White pinned your knight. How do you continue developing?', hint: 'Develop the other knight and put pressure on d4.', correctFeedback: 'Nc6 develops the knight and challenges White\'s centralized knight on d4.', wrongFeedback: 'Develop the knight — Nc6 pressures d4.' },
    { type: 'instruction', fen: FEN.devBe2_after_Nc6, text: 'Nc6 develops with pressure on d4. The pin on f6 is annoying but not dangerous — you can break it later with h6.', arrow: ['b8', 'c6'] },

    // RECALL
    { type: 'instruction', fen: FEN.devBe2_after_Be2, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.devBe2_after_Bg7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devBe2_after_OO_b, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.devBe2_after_Bg5, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },

    { type: 'instruction', fen: FEN.devBe2_after_Nc6, text: "Bg7, O-O, Nc6 — against 6.Be2 you develop naturally. The Dragon setup works against everything." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-3: The Yugoslav Attack (O-O, Nc6, d5)
// ═══════════════════════════════════════════════════════════

const SD_3: OpeningLesson = {
  id: 'sd-3',
  title: 'The Yugoslav Attack',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bg7, text: "White is setting up the Yugoslav Attack — the most aggressive plan against the Dragon. You'll castle, develop, and strike with d5." },

    // RECAP
    { type: 'instruction', fen: FEN.after_cxd4, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // White plays 7.f3
    { type: 'instruction', fen: FEN.after_Bg7, text: 'White plays f3, reinforcing e4 and preparing Qd2 with O-O-O.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'White is preparing to castle queenside. What should you do first?', hint: 'Get your king to safety before the attack comes.', correctFeedback: 'O-O gets your king safe behind the fianchetto before White launches a kingside attack.', wrongFeedback: 'Castle now — O-O. Get safe before the storm.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Castling is urgent. White is about to castle queenside and throw pawns at your king — you need to be ready.', arrow: ['e8', 'g8'] },

    // White plays 8.Qd2
    { type: 'instruction', fen: FEN.after_OO, text: 'White plays Qd2, connecting the rooks and preparing O-O-O.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 2: Nc6
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'How do you continue development?', hint: 'Develop the last minor piece and pressure d4.', correctFeedback: 'Nc6 develops the knight and pressures the d4 knight.', wrongFeedback: 'Play Nc6 — develop and pressure the center.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 puts pressure on d4. If White trades knights, your bishop on g7 will open up even more.', arrow: ['b8', 'c6'] },

    // White plays 9.O-O-O
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White castles queenside. The opposite-side castling battle begins.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },

    // PREDICT 3: d5
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'd5', prompt: 'Both sides have castled on opposite wings. What is your central strike?', hint: 'Push the d-pawn to blow open the center before White can attack.', correctFeedback: 'd5 strikes at the center and opens lines for your pieces before White can storm the kingside.', wrongFeedback: 'Play d5 — the central break that opens the position.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5 is the key break. It challenges White\'s center and opens the position for your pieces, especially the g7 bishop.', arrow: ['d6', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bg7, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    { type: 'instruction', fen: FEN.after_d5, text: "O-O, Nc6, d5 — the Yugoslav Attack is on. Both sides have castled on opposite wings and it's a race." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-dev-g4: White plays 9.g4 instead of 9.O-O-O
// ═══════════════════════════════════════════════════════════

const SD_DEV_G4: OpeningLesson = {
  id: 'sd-dev-g4',
  title: 'Dev 9.g4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nc6, text: "Sometimes White pushes g4 instead of castling queenside — an aggressive pawn storm. Here's how to respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bg7, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White pushes g4 instead of castling — starting an early kingside attack.', autoAdvance: 800, highlightSquares: ['g2', 'g4'] },

    // PREDICT 1: Be6
    { type: 'play-move', fen: FEN.devG4_after_g4, correctMove: 'Be6', prompt: 'White pushed g4. How do you respond?', hint: 'Develop your bishop and challenge the d4 knight.', correctFeedback: 'Be6 develops the bishop and puts pressure on the d4 knight.', wrongFeedback: 'Play Be6 — develop and target the d4 knight.' },
    { type: 'instruction', fen: FEN.devG4_after_Be6, text: 'Be6 forces White to make a decision about the d4 knight. If the knight moves, your bishop controls key central squares.', arrow: ['c8', 'e6'] },

    // White plays 10.Nxe6
    { type: 'instruction', fen: FEN.devG4_after_Be6, text: 'White captures Nxe6, trading the knight for your bishop.', autoAdvance: 800, highlightSquares: ['d4', 'e6'] },

    // PREDICT 2: fxe6
    { type: 'play-move', fen: FEN.devG4_after_Nxe6, correctMove: 'fxe6', prompt: 'White took your bishop. How do you recapture?', hint: 'Take back with the f-pawn to open the f-file for your rook.', correctFeedback: 'fxe6 opens the f-file for your rook, giving you active counterplay.', wrongFeedback: 'Recapture with fxe6 — open the f-file for your rook.' },
    { type: 'instruction', fen: FEN.devG4_after_fxe6, text: 'fxe6 opens the f-file. Your rook on f8 now has a semi-open file aimed straight at White\'s position.', arrow: ['f7', 'e6'] },

    // White plays 11.O-O-O
    { type: 'instruction', fen: FEN.devG4_after_fxe6, text: 'White castles queenside.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },

    // PREDICT 3: Ne5
    { type: 'play-move', fen: FEN.devG4_after_OOO, correctMove: 'Ne5', prompt: 'White castled. Where does your knight jump?', hint: 'Centralize a knight on a powerful outpost.', correctFeedback: 'Ne5 centralizes the knight on a dominant square, blocking White\'s e-pawn ideas.', wrongFeedback: 'Jump to e5 — a powerful central outpost.' },
    { type: 'instruction', fen: FEN.devG4_after_Ne5, text: 'Ne5 is a rock on e5. The knight controls key squares and can\'t be kicked by a pawn. Your position is solid.', arrow: ['c6', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.devG4_after_g4, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devG4_after_g4, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.devG4_after_Be6, text: 'Nxe6.', autoAdvance: 800, highlightSquares: ['d4', 'e6'] },
    { type: 'play-move', fen: FEN.devG4_after_Nxe6, correctMove: 'fxe6', prompt: 'Your move.', hint: 'fxe6.', correctFeedback: 'fxe6.', wrongFeedback: 'fxe6.' },
    { type: 'instruction', fen: FEN.devG4_after_fxe6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.devG4_after_OOO, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },

    { type: 'instruction', fen: FEN.devG4_after_Ne5, text: "Be6, fxe6, Ne5 — against g4 you stay active with open lines and a powerful centralized knight." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-4: The Central Break (Nxd5, bxc6, e5)
// ═══════════════════════════════════════════════════════════

const SD_4: OpeningLesson = {
  id: 'sd-4',
  title: 'The Central Break',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_d5, text: "After d5, the center explodes. You'll recapture, open lines, and push e5 to activate the Dragon bishop." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bg7, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    // White plays 10.exd5
    { type: 'instruction', fen: FEN.after_d5, text: 'White captures exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },

    // PREDICT 1: Nxd5
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nxd5', prompt: 'White took your pawn. How do you recapture?', hint: 'Recapture with the knight — centralize it.', correctFeedback: 'Nxd5 puts the knight on a powerful central square.', wrongFeedback: 'Recapture with the knight — Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Nxd5 puts the knight on a powerful central square, controlling key squares like e3, f4, and b4.', arrow: ['f6', 'd5'] },

    // White plays 11.Nxc6
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'White trades knights with Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },

    // PREDICT 2: bxc6
    { type: 'play-move', fen: FEN.after_Nxc6, correctMove: 'bxc6', prompt: 'White took your knight on c6. How do you recapture?', hint: 'Take with the b-pawn to open the b-file for your rook.', correctFeedback: 'bxc6 opens the b-file, giving your rook a direct line toward White\'s king on c1.', wrongFeedback: 'Take with the b-pawn — bxc6 opens the b-file.' },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'bxc6 opens the b-file. Your rook on a8 can swing to b8, targeting White\'s king on the queenside.', arrow: ['b7', 'c6'] },

    // White plays 12.Bd4
    { type: 'instruction', fen: FEN.after_bxc6, text: 'White plays Bd4, challenging your Dragon bishop.', autoAdvance: 800, highlightSquares: ['e3', 'd4'] },

    // PREDICT 3: e5
    { type: 'play-move', fen: FEN.after_Bd4, correctMove: 'e5', prompt: 'White moved the bishop to d4 to block your Dragon bishop. How do you respond?', hint: 'Push a pawn to kick the bishop and unleash your g7 bishop.', correctFeedback: 'e5 kicks the bishop from d4 and opens the long diagonal for your Dragon bishop on g7.', wrongFeedback: 'Push e5 — kick the bishop and free your Dragon bishop.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5 is the key move. The bishop on d4 must retreat, and your Dragon bishop on g7 is now a monster on the long diagonal.', arrow: ['e7', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d5, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_d5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nxc6, correctMove: 'bxc6', prompt: 'Your move.', hint: 'bxc6.', correctFeedback: 'bxc6.', wrongFeedback: 'bxc6.' },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'Bd4.', autoAdvance: 800, highlightSquares: ['e3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Bd4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    { type: 'instruction', fen: FEN.after_e5, text: "Nxd5, bxc6, e5 — the central break is complete. Your Dragon bishop is unleashed and the b-file is open for the attack." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-dev-Qe1: White plays 10.Qe1 instead of 10.exd5
// ═══════════════════════════════════════════════════════════

const SD_DEV_QE1: OpeningLesson = {
  id: 'sd-dev-Qe1',
  title: 'Dev 10.Qe1',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_d5, text: "Sometimes White plays Qe1 instead of taking on d5 — repositioning the queen. Here's how to punish the slow move." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bg7, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_d5, text: 'White plays Qe1 instead of taking on d5 — trying to reroute the queen.', autoAdvance: 800, highlightSquares: ['d2', 'e1'] },

    // PREDICT 1: e5
    { type: 'play-move', fen: FEN.devQe1_after_Qe1, correctMove: 'e5', prompt: 'White moved the queen to e1. How do you seize space?', hint: 'Push a central pawn to grab more territory.', correctFeedback: 'e5 grabs space in the center and restricts White\'s knight on d4.', wrongFeedback: 'Push e5 — grab the center while White wastes time.' },
    { type: 'instruction', fen: FEN.devQe1_after_e5, text: 'e5 grabs central space and attacks the d4 knight. White\'s queen move gave you a free tempo to expand.', arrow: ['e7', 'e5'] },

    // White plays 11.Nxc6
    { type: 'instruction', fen: FEN.devQe1_after_e5, text: 'White trades Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },

    // PREDICT 2: bxc6
    { type: 'play-move', fen: FEN.devQe1_after_Nxc6, correctMove: 'bxc6', prompt: 'White took your knight. How do you recapture?', hint: 'Same idea as the main line — open the b-file.', correctFeedback: 'bxc6 opens the b-file for your rook to target White\'s king.', wrongFeedback: 'Take with the b-pawn — bxc6.' },
    { type: 'instruction', fen: FEN.devQe1_after_bxc6, text: 'bxc6 again opens the b-file. Your rook will come to b8 with devastating pressure against White\'s queenside.', arrow: ['b7', 'c6'] },

    // White plays 12.exd5
    { type: 'instruction', fen: FEN.devQe1_after_bxc6, text: 'White finally captures exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },

    // PREDICT 3: Nxd5
    { type: 'play-move', fen: FEN.devQe1_after_exd5, correctMove: 'Nxd5', prompt: 'White took on d5. Recapture.', hint: 'Centralize the knight.', correctFeedback: 'Nxd5 centralizes the knight on a dominant square in the center.', wrongFeedback: 'Recapture with the knight — Nxd5.' },
    { type: 'instruction', fen: FEN.devQe1_after_Nxd5, text: 'Nxd5 leaves your knight dominating the center. You have more space, the open b-file, and the Dragon bishop — a great position.', arrow: ['f6', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.devQe1_after_Qe1, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devQe1_after_Qe1, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.devQe1_after_e5, text: 'Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },
    { type: 'play-move', fen: FEN.devQe1_after_Nxc6, correctMove: 'bxc6', prompt: 'Your move.', hint: 'bxc6.', correctFeedback: 'bxc6.', wrongFeedback: 'bxc6.' },
    { type: 'instruction', fen: FEN.devQe1_after_bxc6, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.devQe1_after_exd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },

    { type: 'instruction', fen: FEN.devQe1_after_Nxd5, text: "e5, bxc6, Nxd5 — against Qe1 you grab even more space. The Dragon bishop and open b-file do the rest." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sd-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const SD_TEST_1: OpeningLesson = {
  id: 'sd-test-1',
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
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nxc6, correctMove: 'bxc6', prompt: 'Your move.', hint: 'bxc6.', correctFeedback: 'bxc6.', wrongFeedback: 'bxc6.' },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'Bd4.', autoAdvance: 800, highlightSquares: ['e3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Bd4, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // === DEVIATION: 6.Be2 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_g6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.devBe2_after_Be2, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.devBe2_after_Bg7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.devBe2_after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devBe2_after_OO_b, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.devBe2_after_Bg5, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },

    // === DEVIATION: 9.g4 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_Bg7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_Nc6, text: 'g4.', autoAdvance: 800, highlightSquares: ['g2', 'g4'] },
    { type: 'play-move', fen: FEN.devG4_after_g4, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.devG4_after_Be6, text: 'Nxe6.', autoAdvance: 800, highlightSquares: ['d4', 'e6'] },
    { type: 'play-move', fen: FEN.devG4_after_Nxe6, correctMove: 'fxe6', prompt: 'Your move.', hint: 'fxe6.', correctFeedback: 'fxe6.', wrongFeedback: 'fxe6.' },
    { type: 'instruction', fen: FEN.devG4_after_fxe6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.devG4_after_OOO, correctMove: 'Ne5', prompt: 'Your move.', hint: 'Ne5.', correctFeedback: 'Ne5.', wrongFeedback: 'Ne5.' },

    // === DEVIATION: 10.Qe1 ===
    // Replay to deviation point
    { type: 'instruction', fen: FEN.after_Nc6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_d5, text: 'Qe1.', autoAdvance: 800, highlightSquares: ['d2', 'e1'] },
    { type: 'play-move', fen: FEN.devQe1_after_Qe1, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.devQe1_after_e5, text: 'Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },
    { type: 'play-move', fen: FEN.devQe1_after_Nxc6, correctMove: 'bxc6', prompt: 'Your move.', hint: 'bxc6.', correctFeedback: 'bxc6.', wrongFeedback: 'bxc6.' },
    { type: 'instruction', fen: FEN.devQe1_after_bxc6, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.devQe1_after_exd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getSicilianDragonLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'sd-1': return SD_1
    case 'sd-2': return SD_2
    case 'sd-dev-Be2': return SD_DEV_BE2
    case 'sd-3': return SD_3
    case 'sd-dev-g4': return SD_DEV_G4
    case 'sd-4': return SD_4
    case 'sd-dev-Qe1': return SD_DEV_QE1
    case 'sd-test-1': return SD_TEST_1
    default: return undefined
  }
}
