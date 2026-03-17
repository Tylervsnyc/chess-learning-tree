import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN SVESHNIKOV LESSONS (sv-1 through sv-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5
// Main line: 6.Ndb5 d6 7.Bg5 a6 8.Na3 b5 9.Nd5 Be7 10.Bxf6 Bxf6
//            11.c3 O-O 12.Nc2 Bg5 13.a4 bxa4 14.Rxa4 a5
//            15.Bc4 Rb8 16.b3 Kh8 17.Nce3 g6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 5...e5)
  after_e5:        'r1bqkb1r/pp1p1ppp/2n2n2/4p3/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',

  // Lesson 1: d6, a6, b5
  after_Ndb5:      'r1bqkb1r/pp1p1ppp/2n2n2/1N2p3/4P3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 6',
  after_d6:        'r1bqkb1r/pp3ppp/2np1n2/1N2p3/4P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 7',
  after_Bg5:       'r1bqkb1r/pp3ppp/2np1n2/1N2p1B1/4P3/2N5/PPP2PPP/R2QKB1R b KQkq - 1 7',
  after_a6:        'r1bqkb1r/1p3ppp/p1np1n2/1N2p1B1/4P3/2N5/PPP2PPP/R2QKB1R w KQkq - 0 8',
  after_Na3:       'r1bqkb1r/1p3ppp/p1np1n2/4p1B1/4P3/N1N5/PPP2PPP/R2QKB1R b KQkq - 1 8',
  after_b5:        'r1bqkb1r/5ppp/p1np1n2/1p2p1B1/4P3/N1N5/PPP2PPP/R2QKB1R w KQkq - 0 9',

  // Lesson 2: Be7, Bxf6, O-O
  after_Nd5:       'r1bqkb1r/5ppp/p1np1n2/1p1Np1B1/4P3/N7/PPP2PPP/R2QKB1R b KQkq - 1 9',
  after_Be7:       'r1bqk2r/4bppp/p1np1n2/1p1Np1B1/4P3/N7/PPP2PPP/R2QKB1R w KQkq - 2 10',
  after_Bxf6w:     'r1bqk2r/4bppp/p1np1B2/1p1Np3/4P3/N7/PPP2PPP/R2QKB1R b KQkq - 0 10',
  after_Bxf6b:     'r1bqk2r/5ppp/p1np1b2/1p1Np3/4P3/N7/PPP2PPP/R2QKB1R w KQkq - 0 11',
  after_c3:        'r1bqk2r/5ppp/p1np1b2/1p1Np3/4P3/N1P5/PP3PPP/R2QKB1R b KQkq - 0 11',
  after_OO:        'r1bq1rk1/5ppp/p1np1b2/1p1Np3/4P3/N1P5/PP3PPP/R2QKB1R w KQ - 1 12',

  // Lesson 3: Bg5, bxa4, a5
  after_Nc2:       'r1bq1rk1/5ppp/p1np1b2/1p1Np3/4P3/2P5/PPN2PPP/R2QKB1R b KQ - 2 12',
  after_Bg5_move:  'r1bq1rk1/5ppp/p1np4/1p1Np1b1/4P3/2P5/PPN2PPP/R2QKB1R w KQ - 3 13',
  after_a4:        'r1bq1rk1/5ppp/p1np4/1p1Np1b1/P3P3/2P5/1PN2PPP/R2QKB1R b KQ - 0 13',
  after_bxa4:      'r1bq1rk1/5ppp/p1np4/3Np1b1/p3P3/2P5/1PN2PPP/R2QKB1R w KQ - 0 14',
  after_Rxa4:      'r1bq1rk1/5ppp/p1np4/3Np1b1/R3P3/2P5/1PN2PPP/3QKB1R b K - 0 14',
  after_a5:        'r1bq1rk1/5ppp/2np4/p2Np1b1/R3P3/2P5/1PN2PPP/3QKB1R w K - 0 15',

  // Lesson 4: Rb8, Kh8, g6
  after_Bc4:       'r1bq1rk1/5ppp/2np4/p2Np1b1/R1B1P3/2P5/1PN2PPP/3QK2R b K - 1 15',
  after_Rb8:       '1rbq1rk1/5ppp/2np4/p2Np1b1/R1B1P3/2P5/1PN2PPP/3QK2R w K - 2 16',
  after_b3:        '1rbq1rk1/5ppp/2np4/p2Np1b1/R1B1P3/1PP5/2N2PPP/3QK2R b K - 0 16',
  after_Kh8:       '1rbq1r1k/5ppp/2np4/p2Np1b1/R1B1P3/1PP5/2N2PPP/3QK2R w K - 1 17',
  after_Nce3:      '1rbq1r1k/5ppp/2np4/p2Np1b1/R1B1P3/1PP1N3/5PPP/3QK2R b K - 2 17',
  after_g6:        '1rbq1r1k/5p1p/2np2p1/p2Np1b1/R1B1P3/1PP1N3/5PPP/3QK2R w K - 0 18',

  // ═══════════════════════════════════════════════════════════
  // LEVEL 2 — Main line continues from 17...g6
  // 18.O-O f5 19.exf5 Bxf5 20.Nxf5 Rxf5
  // 21.Bd3 Rf8 22.Qg4 Nd4 23.cxd4 exd4
  // ═══════════════════════════════════════════════════════════

  // sv-5: The f5 Break (f5, Bxf5, Rxf5)
  after_OO_18:     '1rbq1r1k/5p1p/2np2p1/p2Np1b1/R1B1P3/1PP1N3/5PPP/3Q1RK1 b - - 1 18',
  after_f5:        '1rbq1r1k/7p/2np2p1/p2Nppb1/R1B1P3/1PP1N3/5PPP/3Q1RK1 w - - 0 19',
  after_exf5:      '1rbq1r1k/7p/2np2p1/p2NpPb1/R1B5/1PP1N3/5PPP/3Q1RK1 b - - 0 19',
  after_Bxf5_b:    '1r1q1r1k/7p/2np2p1/p2Npbb1/R1B5/1PP1N3/5PPP/3Q1RK1 w - - 0 20',
  after_Nxf5_w:    '1r1q1r1k/7p/2np2p1/p2NpNb1/R1B5/1PP5/5PPP/3Q1RK1 b - - 0 20',
  after_Rxf5:      '1r1q3k/7p/2np2p1/p2Nprb1/R1B5/1PP5/5PPP/3Q1RK1 w - - 0 21',

  // sv-6: The Counterattack (Rf8, Nd4, exd4)
  after_Bd3_21:    '1r1q3k/7p/2np2p1/p2Nprb1/R7/1PPB4/5PPP/3Q1RK1 b - - 1 21',
  after_Rf8:       '1r1q1r1k/7p/2np2p1/p2Np1b1/R7/1PPB4/5PPP/3Q1RK1 w - - 2 22',
  after_Qg4:       '1r1q1r1k/7p/2np2p1/p2Np1b1/R5Q1/1PPB4/5PPP/5RK1 b - - 3 22',
  after_Nd4:       '1r1q1r1k/7p/3p2p1/p2Np1b1/R2n2Q1/1PPB4/5PPP/5RK1 w - - 4 23',
  after_cxd4:      '1r1q1r1k/7p/3p2p1/p2Np1b1/R2P2Q1/1P1B4/5PPP/5RK1 b - - 0 23',
  after_exd4_23:   '1r1q1r1k/7p/3p2p1/p2N2b1/R2p2Q1/1P1B4/5PPP/5RK1 w - - 0 24',

  // Deviation: 19.Nxf5 (instead of 19.exf5) — after 18...f5
  dev_after_Nxf5:  '1rbq1r1k/7p/2np2p1/p2NpNb1/R1B1P3/1PP5/5PPP/3Q1RK1 b - - 0 19',
  dev_after_gxf5:  '1rbq1r1k/7p/2np4/p2Nppb1/R1B1P3/1PP5/5PPP/3Q1RK1 w - - 0 20',
  dev_after_exf5:  '1rbq1r1k/7p/2np4/p2NpPb1/R1B5/1PP5/5PPP/3Q1RK1 b - - 0 20',
  dev_after_Bxf5:  '1r1q1r1k/7p/2np4/p2Npbb1/R1B5/1PP5/5PPP/3Q1RK1 w - - 0 21',
  dev_after_Bd3:   '1r1q1r1k/7p/2np4/p2Npbb1/R7/1PPB4/5PPP/3Q1RK1 b - - 1 21',
  dev_after_Bxd3:  '1r1q1r1k/7p/2np4/p2Np1b1/R7/1PPb4/5PPP/3Q1RK1 w - - 0 22',
  dev_after_Qxd3:  '1r1q1r1k/7p/2np4/p2Np1b1/R7/1PPQ4/5PPP/5RK1 b - - 0 22',

  // Deviation: 11.c4 (instead of 11.c3)
  dev_after_c4:    'r1bqk2r/5ppp/p1np1b2/1p1Np3/2P1P3/N7/PP3PPP/R2QKB1R b KQkq - 0 11',
  dev_after_b4:    'r1bqk2r/5ppp/p1np1b2/3Np3/1pP1P3/N7/PP3PPP/R2QKB1R w KQkq - 0 12',
  dev_after_Nc2:   'r1bqk2r/5ppp/p1np1b2/3Np3/1pP1P3/8/PPN2PPP/R2QKB1R b KQkq - 1 12',
  dev_after_a5:    'r1bqk2r/5ppp/2np1b2/p2Np3/1pP1P3/8/PPN2PPP/R2QKB1R w KQkq - 0 13',
  dev_after_g3:    'r1bqk2r/5ppp/2np1b2/p2Np3/1pP1P3/6P1/PPN2P1P/R2QKB1R b KQkq - 0 13',
  dev_after_OO:    'r1bq1rk1/5ppp/2np1b2/p2Np3/1pP1P3/6P1/PPN2P1P/R2QKB1R w KQ - 1 14',
}


// ═══════════════════════════════════════════════════════════
// sv-1: The Sveshnikov Setup (d6, a6, b5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SV_1: OpeningLesson = {
  id: 'sv-1',
  title: 'The Sveshnikov Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_e5, text: "After 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5, you've played the Sveshnikov. White is about to jump a knight into your position — here's how you handle it." },

    // White plays 6.Ndb5
    { type: 'instruction', fen: FEN.after_e5, text: 'White plays Ndb5, attacking d6 and threatening Nd6+.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },

    // PREDICT 1: d6
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'The knight is threatening to land on d6. How do you stop it?', hint: 'Push the d-pawn to block the knight from d6.', correctFeedback: 'd6 blocks the knight and holds the center. Simple and necessary.', wrongFeedback: 'Push d6 — it blocks the knight from landing on d6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 stops the knight invasion. Yes, the d6 pawn is a bit backward, but your active pieces will compensate.', arrow: ['d7', 'd6'] },

    // White plays 7.Bg5
    { type: 'instruction', fen: FEN.after_d6, text: 'White pins your knight on f6 with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },

    // PREDICT 2: a6
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: "You're pinned on f6 and the knight on b5 is still annoying. What do you play?", hint: 'Kick the knight on b5 — push the a-pawn.', correctFeedback: 'a6 forces the knight to retreat. Now White has to figure out where to put it.', wrongFeedback: 'Play a6 — the knight on b5 has to move.' },
    { type: 'instruction', fen: FEN.after_a6, text: "a6 is a key Sveshnikov move. The knight on b5 can't stay, and retreating it costs White time.", arrow: ['a7', 'a6'] },

    // White plays 8.Na3
    { type: 'instruction', fen: FEN.after_a6, text: 'White retreats the knight to a3. It looks awkward on the rim, but it has plans to reroute.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },

    // PREDICT 3: b5
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: "The knight retreated to the edge. How do you take advantage?", hint: 'Expand on the queenside and restrict the Na3.', correctFeedback: 'b5 grabs queenside space and keeps the knight on a3 sidelined.', wrongFeedback: 'Push b5 — grab space and keep the Na3 stuck on the rim.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'b5 is aggressive. You restrict the Na3 and prepare to expand further. The Sveshnikov is all about this kind of active play.', arrow: ['b7', 'b5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e5, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },

    { type: 'instruction', fen: FEN.after_b5, text: "d6, a6, b5 — you've neutralized White's knight jump and grabbed queenside space. The Sveshnikov is rolling." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-2: The Bishop Trade (Be7, Bxf6, O-O)
// ═══════════════════════════════════════════════════════════

const SV_2: OpeningLesson = {
  id: 'sv-2',
  title: 'The Bishop Trade',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_b5, text: "White centralizes with Nd5 and trades your dark-squared bishop. You'll develop calmly and castle." },

    // RECAP
    { type: 'instruction', fen: FEN.after_e5, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },

    // White plays 9.Nd5
    { type: 'instruction', fen: FEN.after_b5, text: 'White plays Nd5, placing the knight on a powerful central outpost.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },

    // PREDICT 1: Be7
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'White has a strong knight on d5. How do you develop your bishop?', hint: 'Put the bishop on e7 where it defends and prepares to trade.', correctFeedback: 'Be7 develops the bishop and prepares for the upcoming bishop trade on f6.', wrongFeedback: 'Play Be7 — it develops the bishop and gets ready for the trade.' },
    { type: 'instruction', fen: FEN.after_Be7, text: "Be7 is the standard response. The bishop is developed, and you're ready for whatever White does with the Bg5.", arrow: ['f8', 'e7'] },

    // White plays 10.Bxf6
    { type: 'instruction', fen: FEN.after_Be7, text: 'White trades Bxf6, giving up the bishop pair but damaging your pawn structure.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },

    // PREDICT 2: Bxf6
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'White captured your knight. How do you recapture?', hint: 'Take back with the bishop to keep a strong piece on f6.', correctFeedback: 'Bxf6 recaptures and gives you a strong bishop aiming at the center.', wrongFeedback: 'Recapture with the bishop — Bxf6 keeps a powerful piece on the board.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'Bxf6 is correct. Yes, you have doubled f-pawns, but your bishop on f6 is a strong piece controlling the dark squares.', arrow: ['e7', 'f6'] },

    // White plays 11.c3
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'White plays c3, preparing to build a pawn center with d4 later.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your bishop is developed. What should you do now?', hint: 'Get the king to safety.', correctFeedback: 'Castles! Your king is safe and the rook connects to the center.', wrongFeedback: 'Castle kingside — get the king safe before the middlegame begins.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O completes your development. The king is tucked away and you're ready to fight for the initiative.", arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_b5, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.after_OO, text: "Be7, Bxf6, O-O — you've traded bishops, kept a strong piece on f6, and castled safely." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-3: Pawn Storm (Bg5, bxa4, a5)
// ═══════════════════════════════════════════════════════════

const SV_3: OpeningLesson = {
  id: 'sv-3',
  title: 'Pawn Storm',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "White reroutes the knight. You'll trade your dark-squared bishop, exchange pawns, and lock down the a-file." },

    // RECAP
    { type: 'instruction', fen: FEN.after_e5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // White plays 12.Nc2
    { type: 'instruction', fen: FEN.after_OO, text: 'White reroutes the knight from a3 to c2, heading toward e3.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },

    // PREDICT 1: Bg5
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your bishop on f6 is strong, but there is an even better plan. What do you play?', hint: 'The bishop can go to g5 to trade it off or provoke weaknesses.', correctFeedback: 'Bg5 repositions the bishop. If White trades it, the dark squares around the king are weakened.', wrongFeedback: 'Play Bg5 — the bishop is heading for a trade or a better diagonal.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: "Bg5 is a typical Sveshnikov move. You're ready to trade the bishop or use it to create dark-square pressure.", arrow: ['f6', 'g5'] },

    // White plays 13.a4
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'White strikes at your queenside with a4, trying to undermine b5.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },

    // PREDICT 2: bxa4
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'White is attacking your b5 pawn. What do you do?', hint: 'Capture on a4 — you want to trade pawns and open the a-file for your rook.', correctFeedback: 'bxa4 trades the pawn and opens the a-file. Your rook will use it.', wrongFeedback: 'Take on a4 — exchange the pawn and prepare to use the open file.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'bxa4 opens the a-file. After White recaptures, you can fight for control of it.', arrow: ['b5', 'a4'] },

    // White plays 14.Rxa4
    { type: 'instruction', fen: FEN.after_bxa4, text: 'White recaptures Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },

    // PREDICT 3: a5
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'The a-file is open. How do you use your a-pawn?', hint: 'Push a5 to restrict White and control the a-file.', correctFeedback: 'a5 fixes the pawn structure and gives your rook a target on the a-file.', wrongFeedback: 'Push a5 — it restricts White on the queenside and prepares Ra8.' },
    { type: 'instruction', fen: FEN.after_a5, text: "a5 is a strong positional move. White's rook on a4 has to retreat and you control the queenside.", arrow: ['a6', 'a5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_OO, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'Your move.', hint: 'bxa4.', correctFeedback: 'bxa4.', wrongFeedback: 'bxa4.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },

    { type: 'instruction', fen: FEN.after_a5, text: "Bg5, bxa4, a5 — you've traded the bishop, opened the a-file, and locked down the queenside." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-4: Kingside Prep (Rb8, Kh8, g6)
// ═══════════════════════════════════════════════════════════

const SV_4: OpeningLesson = {
  id: 'sv-4',
  title: 'Kingside Prep',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a5, text: "White develops the bishop. You'll activate the rook, tuck the king away, and prepare the f5 break." },

    // RECAP
    { type: 'instruction', fen: FEN.after_e5, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'Your move.', hint: 'bxa4.', correctFeedback: 'bxa4.', wrongFeedback: 'bxa4.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },

    // White plays 15.Bc4
    { type: 'instruction', fen: FEN.after_a5, text: 'White develops the bishop to c4, targeting f7.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 1: Rb8
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Rb8', prompt: 'How do you activate your rook?', hint: 'The b-file is open — put the rook on it.', correctFeedback: 'Rb8 activates the rook on the semi-open b-file and pressures b2.', wrongFeedback: 'Play Rb8 — the rook belongs on the open b-file.' },
    { type: 'instruction', fen: FEN.after_Rb8, text: 'Rb8 puts the rook on an active file. The b2 pawn could become a target later.', arrow: ['a8', 'b8'] },

    // White plays 16.b3
    { type: 'instruction', fen: FEN.after_Rb8, text: 'White plays b3, defending the b2 pawn.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },

    // PREDICT 2: Kh8
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'Kh8', prompt: "You're preparing a big pawn push. What quiet move helps?", hint: 'Step the king off the g-file so g6 and f5 are safe.', correctFeedback: 'Kh8 tucks the king into the corner, clearing g8 for the rook and preparing g6 and f5.', wrongFeedback: 'Play Kh8 — move the king off the diagonal so you can push g6 and f5.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Kh8 is a prophylactic move. The king steps off the a2-g8 diagonal and off the g-file, making g6 and f5 safe to play.', arrow: ['g8', 'h8'] },

    // White plays 17.Nce3
    { type: 'instruction', fen: FEN.after_Kh8, text: 'White reroutes the knight to e3, reinforcing the center.', autoAdvance: 800, highlightSquares: ['c2', 'e3'] },

    // PREDICT 3: g6
    { type: 'play-move', fen: FEN.after_Nce3, correctMove: 'g6', prompt: "You need to prepare the f5 break. What's the next step?", hint: 'Push g6 to support a future f5 advance.', correctFeedback: 'g6 prepares f5, the key break in the Sveshnikov. The kingside attack is coming.', wrongFeedback: 'Play g6 — it supports f5, the most important pawn break in this opening.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'g6 sets up the f5 break. Once f5 comes, the center opens and your pieces spring to life.', arrow: ['g7', 'g6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_a5, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Rb8', prompt: 'Your move.', hint: 'Rb8.', correctFeedback: 'Rb8.', wrongFeedback: 'Rb8.' },
    { type: 'instruction', fen: FEN.after_Rb8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Nce3.', autoAdvance: 800, highlightSquares: ['c2', 'e3'] },
    { type: 'play-move', fen: FEN.after_Nce3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    { type: 'instruction', fen: FEN.after_g6, text: "Rb8, Kh8, g6 — you've activated the rook, tucked the king away, and prepared the f5 pawn break. The Sveshnikov is fully loaded." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-dev-c4: Deviation (11.c4 instead of 11.c3)
// Black plays: b4, a5, O-O
// ═══════════════════════════════════════════════════════════

const SV_DEV_C4: OpeningLesson = {
  id: 'sv-dev-c4',
  title: 'Dev 11.c4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bxf6b, text: "Sometimes White plays c4 instead of c3, grabbing more queenside space. Here's how you respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_e5, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'White plays c4 instead of c3 — grabbing more space on the queenside.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // PREDICT 1: b4
    { type: 'play-move', fen: FEN.dev_after_c4, correctMove: 'b4', prompt: 'White pushed c4 into your pawn. How do you respond?', hint: 'Advance the b-pawn to attack the knight on a3.', correctFeedback: 'b4 gains space and attacks the Na3, forcing it to retreat.', wrongFeedback: 'Push b4 — it gains space and kicks the Na3.' },
    { type: 'instruction', fen: FEN.dev_after_b4, text: 'b4 is the right reaction. You advance with tempo since the Na3 is trapped and must retreat.', arrow: ['b5', 'b4'] },

    // White plays 12.Nc2
    { type: 'instruction', fen: FEN.dev_after_b4, text: 'White retreats Nc2, the only good square for the knight.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },

    // PREDICT 2: a5
    { type: 'play-move', fen: FEN.dev_after_Nc2, correctMove: 'a5', prompt: 'The knight retreated. How do you continue expanding on the queenside?', hint: 'Push the a-pawn to secure space and prepare a rook lift.', correctFeedback: 'a5 grabs more queenside space. Your pawns on a5 and b4 give you a nice queenside clamp.', wrongFeedback: 'Play a5 — keep expanding on the queenside.' },
    { type: 'instruction', fen: FEN.dev_after_a5, text: 'a5 secures your queenside space advantage. The pawns on a5 and b4 restrict White and create outposts for your pieces.', arrow: ['a6', 'a5'] },

    // White plays 13.g3
    { type: 'instruction', fen: FEN.dev_after_a5, text: 'White plays g3, preparing to fianchetto the bishop.', autoAdvance: 800, highlightSquares: ['g2', 'g3'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.dev_after_g3, correctMove: 'O-O', prompt: "You've expanded on the queenside. What's the priority now?", hint: 'Get the king safe before the middlegame battle.', correctFeedback: 'O-O castles to safety. Your queenside is strong and the king is secure.', wrongFeedback: 'Castle kingside — your king needs to be safe.' },
    { type: 'instruction', fen: FEN.dev_after_OO, text: "O-O completes development. Against c4, you've secured a strong queenside and a safe king.", arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bxf6b, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.dev_after_c4, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.dev_after_b4, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.dev_after_Nc2, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.dev_after_a5, text: 'g3.', autoAdvance: 800, highlightSquares: ['g2', 'g3'] },
    { type: 'play-move', fen: FEN.dev_after_g3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.dev_after_OO, text: "b4, a5, O-O — against 11.c4, you expand on the queenside and castle safely. Same fighting spirit, different move order." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const SV_TEST_1: OpeningLesson = {
  id: 'sv-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (12 Black moves) ===
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'Your move.', hint: 'bxa4.', correctFeedback: 'bxa4.', wrongFeedback: 'bxa4.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.after_a5, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Rb8', prompt: 'Your move.', hint: 'Rb8.', correctFeedback: 'Rb8.', wrongFeedback: 'Rb8.' },
    { type: 'instruction', fen: FEN.after_Rb8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Nce3.', autoAdvance: 800, highlightSquares: ['c2', 'e3'] },
    { type: 'play-move', fen: FEN.after_Nce3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    // === DEVIATION TEST: 11.c4 ===
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'Now White plays c4 instead.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.dev_after_c4, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.dev_after_b4, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.dev_after_Nc2, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.dev_after_a5, text: 'g3.', autoAdvance: 800, highlightSquares: ['g2', 'g3'] },
    { type: 'play-move', fen: FEN.dev_after_g3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-5: The f5 Break (f5, Bxf5, Rxf5)
// First L2 lesson — recap all L1 moves.
// ═══════════════════════════════════════════════════════════

const SV_5: OpeningLesson = {
  id: 'sv-5',
  title: 'The f5 Break',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_g6, text: "Everything you've built — the queenside, the king tuck, g6 — it all leads to this: the f5 pawn break. Time to blow the position open." },

    // RECAP (all L1 moves: d6 through g6)
    { type: 'instruction', fen: FEN.after_e5, text: "Run through the full line first." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'Your move.', hint: 'bxa4.', correctFeedback: 'bxa4.', wrongFeedback: 'bxa4.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.after_a5, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Rb8', prompt: 'Your move.', hint: 'Rb8.', correctFeedback: 'Rb8.', wrongFeedback: 'Rb8.' },
    { type: 'instruction', fen: FEN.after_Rb8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Nce3.', autoAdvance: 800, highlightSquares: ['c2', 'e3'] },
    { type: 'play-move', fen: FEN.after_Nce3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    // White plays 18.O-O
    { type: 'instruction', fen: FEN.after_g6, text: 'White castles. The king is safe, but now the position opens up.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 1: f5
    { type: 'play-move', fen: FEN.after_OO_18, correctMove: 'f5', prompt: 'You prepared g6 for exactly this moment. What is the key pawn break?', hint: 'Push f5 — crack open the center and attack.', correctFeedback: 'f5! The signature Sveshnikov break. The center is about to explode.', wrongFeedback: 'Push f5 — this is the whole point of g6 and Kh8.' },
    { type: 'instruction', fen: FEN.after_f5, text: 'f5 is the move the entire opening has been building toward. It challenges White\'s e4 pawn and opens lines for your pieces.', arrow: ['f7', 'f5'] },

    // White plays 19.exf5
    { type: 'instruction', fen: FEN.after_f5, text: 'White captures exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },

    // PREDICT 2: Bxf5
    { type: 'play-move', fen: FEN.after_exf5, correctMove: 'Bxf5', prompt: 'White took on f5. How do you recapture?', hint: 'Take back with the bishop — develop with tempo.', correctFeedback: 'Bxf5 recaptures and develops the bishop to an active square.', wrongFeedback: 'Take with the bishop — Bxf5 activates it while recapturing.' },
    { type: 'instruction', fen: FEN.after_Bxf5_b, text: 'Bxf5 is correct. The bishop joins the attack and White has to deal with it.', arrow: ['c8', 'f5'] },

    // White plays 20.Nxf5
    { type: 'instruction', fen: FEN.after_Bxf5_b, text: 'White takes your bishop with Nxf5.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },

    // PREDICT 3: Rxf5
    { type: 'play-move', fen: FEN.after_Nxf5_w, correctMove: 'Rxf5', prompt: 'White captured your bishop. How do you recapture?', hint: 'Take with the rook — it lands on an active square.', correctFeedback: 'Rxf5! The rook is powerfully placed on f5, pressuring the position.', wrongFeedback: 'Recapture with the rook — Rxf5 puts it on an active file.' },
    { type: 'instruction', fen: FEN.after_Rxf5, text: 'Rxf5 gives you an active rook in the heart of the position. The f5 break delivered exactly what you wanted — open lines and piece activity.', arrow: ['f8', 'f5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_g6, text: "Three moves from memory. You know these." },
    { type: 'instruction', fen: FEN.after_g6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_18, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },
    { type: 'instruction', fen: FEN.after_f5, text: 'exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },
    { type: 'play-move', fen: FEN.after_exf5, correctMove: 'Bxf5', prompt: 'Your move.', hint: 'Bxf5.', correctFeedback: 'Bxf5.', wrongFeedback: 'Bxf5.' },
    { type: 'instruction', fen: FEN.after_Bxf5_b, text: 'Nxf5.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nxf5_w, correctMove: 'Rxf5', prompt: 'Your move.', hint: 'Rxf5.', correctFeedback: 'Rxf5.', wrongFeedback: 'Rxf5.' },

    { type: 'instruction', fen: FEN.after_Rxf5, text: "f5, Bxf5, Rxf5 — the pawn break you spent the whole opening preparing. Your rook is active and the position is wide open." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-6: The Counterattack (Rf8, Nd4, exd4)
// ═══════════════════════════════════════════════════════════

const SV_6: OpeningLesson = {
  id: 'sv-6',
  title: 'The Counterattack',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Rxf5, text: "White retreats the bishop and brings the queen into the game. You'll sacrifice a knight to rip the center apart." },

    // RECAP (all L1 + sv-5)
    { type: 'instruction', fen: FEN.after_e5, text: "Full line from the top." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'Your move.', hint: 'bxa4.', correctFeedback: 'bxa4.', wrongFeedback: 'bxa4.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.after_a5, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Rb8', prompt: 'Your move.', hint: 'Rb8.', correctFeedback: 'Rb8.', wrongFeedback: 'Rb8.' },
    { type: 'instruction', fen: FEN.after_Rb8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Nce3.', autoAdvance: 800, highlightSquares: ['c2', 'e3'] },
    { type: 'play-move', fen: FEN.after_Nce3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    // sv-5 recap
    { type: 'instruction', fen: FEN.after_g6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_18, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },
    { type: 'instruction', fen: FEN.after_f5, text: 'exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },
    { type: 'play-move', fen: FEN.after_exf5, correctMove: 'Bxf5', prompt: 'Your move.', hint: 'Bxf5.', correctFeedback: 'Bxf5.', wrongFeedback: 'Bxf5.' },
    { type: 'instruction', fen: FEN.after_Bxf5_b, text: 'Nxf5.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nxf5_w, correctMove: 'Rxf5', prompt: 'Your move.', hint: 'Rxf5.', correctFeedback: 'Rxf5.', wrongFeedback: 'Rxf5.' },

    // White plays 21.Bd3
    { type: 'instruction', fen: FEN.after_Rxf5, text: 'White retreats the bishop to d3, challenging your rook on f5.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },

    // PREDICT 1: Rf8
    { type: 'play-move', fen: FEN.after_Bd3_21, correctMove: 'Rf8', prompt: 'The bishop attacks your rook. Where does the rook retreat to?', hint: 'Pull back to f8 — you want the rook on the open file.', correctFeedback: 'Rf8 retreats to the open file. The rook stays active and the f-file is yours.', wrongFeedback: 'Play Rf8 — the rook retreats to the open file.' },
    { type: 'instruction', fen: FEN.after_Rf8, text: 'Rf8 keeps the rook active on the f-file. You control the open file and your pieces are well placed.', arrow: ['f5', 'f8'] },

    // White plays 22.Qg4
    { type: 'instruction', fen: FEN.after_Rf8, text: 'White brings the queen to g4, eyeing the kingside.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },

    // PREDICT 2: Nd4
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'Nd4', prompt: 'White is getting active. How do you fight back in the center?', hint: 'Jump the knight to d4 — sacrifice it to blow open the center.', correctFeedback: 'Nd4! A powerful sacrifice. If White takes, the center opens up in your favor.', wrongFeedback: 'Play Nd4 — sacrifice the knight to rip the center apart.' },
    { type: 'instruction', fen: FEN.after_Nd4, text: 'Nd4 is a classic Sveshnikov sacrifice. The knight lands on the best possible square, and if White takes, the e-pawn becomes a monster.', arrow: ['c6', 'd4'] },

    // White plays 23.cxd4
    { type: 'instruction', fen: FEN.after_Nd4, text: 'White takes the knight with cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },

    // PREDICT 3: exd4
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'exd4', prompt: 'White captured your knight. How do you recapture?', hint: 'Take with the e-pawn — it opens the e-file and creates a passed pawn.', correctFeedback: 'exd4! The center is ripped open. Your d4 pawn is a powerful passed pawn and the e-file is open for your rook.', wrongFeedback: 'Recapture with exd4 — open the center and create a passed pawn.' },
    { type: 'instruction', fen: FEN.after_exd4_23, text: 'exd4 gives you a passed d-pawn and opens the e-file. This is the Sveshnikov at its best — dynamic compensation everywhere.', arrow: ['e5', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Rxf5, text: "Prove you know the counterattack." },
    { type: 'instruction', fen: FEN.after_Rxf5, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3_21, correctMove: 'Rf8', prompt: 'Your move.', hint: 'Rf8.', correctFeedback: 'Rf8.', wrongFeedback: 'Rf8.' },
    { type: 'instruction', fen: FEN.after_Rf8, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'Nd4', prompt: 'Your move.', hint: 'Nd4.', correctFeedback: 'Nd4.', wrongFeedback: 'Nd4.' },
    { type: 'instruction', fen: FEN.after_Nd4, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'exd4', prompt: 'Your move.', hint: 'exd4.', correctFeedback: 'exd4.', wrongFeedback: 'exd4.' },

    { type: 'instruction', fen: FEN.after_exd4_23, text: "Rf8, Nd4, exd4 — you sacrificed the knight and tore the center wide open. A passed pawn on d4 and open files everywhere. The Sveshnikov strikes." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-dev-Nxf5: Deviation (19.Nxf5 instead of 19.exf5)
// Black plays: gxf5, Bxf5, Bxd3
// ═══════════════════════════════════════════════════════════

const SV_DEV_NXF5: OpeningLesson = {
  id: 'sv-dev-Nxf5',
  title: 'Dev 19.Nxf5',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_f5, text: "Sometimes White captures with the knight first instead of the pawn. The ideas are similar, but the move order changes." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_e5, text: "Let's get to the position." },
    { type: 'instruction', fen: FEN.after_e5, text: 'Ndb5.', autoAdvance: 800, highlightSquares: ['d4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Ndb5, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na3.', autoAdvance: 800, highlightSquares: ['b5', 'a3'] },
    { type: 'play-move', fen: FEN.after_Na3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6w, correctMove: 'Bxf6', prompt: 'Your move.', hint: 'Bxf6.', correctFeedback: 'Bxf6.', wrongFeedback: 'Bxf6.' },
    { type: 'instruction', fen: FEN.after_Bxf6b, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nc2.', autoAdvance: 800, highlightSquares: ['a3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Nc2, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.after_Bg5_move, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'bxa4', prompt: 'Your move.', hint: 'bxa4.', correctFeedback: 'bxa4.', wrongFeedback: 'bxa4.' },
    { type: 'instruction', fen: FEN.after_bxa4, text: 'Rxa4.', autoAdvance: 800, highlightSquares: ['a1', 'a4'] },
    { type: 'play-move', fen: FEN.after_Rxa4, correctMove: 'a5', prompt: 'Your move.', hint: 'a5.', correctFeedback: 'a5.', wrongFeedback: 'a5.' },
    { type: 'instruction', fen: FEN.after_a5, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Rb8', prompt: 'Your move.', hint: 'Rb8.', correctFeedback: 'Rb8.', wrongFeedback: 'Rb8.' },
    { type: 'instruction', fen: FEN.after_Rb8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Nce3.', autoAdvance: 800, highlightSquares: ['c2', 'e3'] },
    { type: 'play-move', fen: FEN.after_Nce3, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_18, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_f5, text: 'White takes with the knight first — Nxf5 instead of exf5.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },

    // PREDICT 1: gxf5
    { type: 'play-move', fen: FEN.dev_after_Nxf5, correctMove: 'gxf5', prompt: 'White took with the knight. How do you recapture?', hint: 'Take with the g-pawn to open the g-file.', correctFeedback: 'gxf5! Recapturing with the g-pawn opens the g-file for your rook later.', wrongFeedback: 'Take with gxf5 — it opens the g-file for your rook.' },
    { type: 'instruction', fen: FEN.dev_after_gxf5, text: 'gxf5 opens the g-file. This gives you different attacking chances compared to the main line.', arrow: ['g6', 'f5'] },

    // White plays 20.exf5
    { type: 'instruction', fen: FEN.dev_after_gxf5, text: 'White recaptures exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },

    // PREDICT 2: Bxf5
    { type: 'play-move', fen: FEN.dev_after_exf5, correctMove: 'Bxf5', prompt: 'White took on f5. How do you recapture?', hint: 'Develop the bishop while recapturing.', correctFeedback: 'Bxf5 develops the bishop to an active diagonal. Same idea as the main line.', wrongFeedback: 'Take with the bishop — Bxf5 develops and recaptures in one move.' },
    { type: 'instruction', fen: FEN.dev_after_Bxf5, text: 'Bxf5 is the natural recapture. The bishop is active and you have open lines everywhere.', arrow: ['c8', 'f5'] },

    // White plays 21.Bd3
    { type: 'instruction', fen: FEN.dev_after_Bxf5, text: 'White challenges your bishop with Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },

    // PREDICT 3: Bxd3
    { type: 'play-move', fen: FEN.dev_after_Bd3, correctMove: 'Bxd3', prompt: 'White puts a bishop on d3, attacking yours. What do you play?', hint: 'Trade bishops — your position is better without them.', correctFeedback: 'Bxd3 trades bishops cleanly. White has to recapture and your position remains strong.', wrongFeedback: 'Trade with Bxd3 — simplify while keeping your advantage.' },
    { type: 'instruction', fen: FEN.dev_after_Bxd3, text: 'Bxd3 trades off the bishops. After Qxd3, your position is excellent with the open g-file and active pieces.', arrow: ['f5', 'd3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_f5, text: "Run through the deviation." },
    { type: 'instruction', fen: FEN.after_f5, text: 'Nxf5.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },
    { type: 'play-move', fen: FEN.dev_after_Nxf5, correctMove: 'gxf5', prompt: 'Your move.', hint: 'gxf5.', correctFeedback: 'gxf5.', wrongFeedback: 'gxf5.' },
    { type: 'instruction', fen: FEN.dev_after_gxf5, text: 'exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },
    { type: 'play-move', fen: FEN.dev_after_exf5, correctMove: 'Bxf5', prompt: 'Your move.', hint: 'Bxf5.', correctFeedback: 'Bxf5.', wrongFeedback: 'Bxf5.' },
    { type: 'instruction', fen: FEN.dev_after_Bxf5, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },
    { type: 'play-move', fen: FEN.dev_after_Bd3, correctMove: 'Bxd3', prompt: 'Your move.', hint: 'Bxd3.', correctFeedback: 'Bxd3.', wrongFeedback: 'Bxd3.' },

    { type: 'instruction', fen: FEN.dev_after_Bxd3, text: "gxf5, Bxf5, Bxd3 — against 19.Nxf5, you recapture differently but end up in a strong position with an open g-file. Same fighting spirit." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sv-test-2: Level 2 Test (L2 main line + Nxf5 deviation)
// ═══════════════════════════════════════════════════════════

const SV_TEST_2: OpeningLesson = {
  id: 'sv-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // === L2 MAIN LINE (sv-5 + sv-6: 6 Black moves) ===
    { type: 'instruction', fen: FEN.after_g6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_18, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },
    { type: 'instruction', fen: FEN.after_f5, text: 'exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },
    { type: 'play-move', fen: FEN.after_exf5, correctMove: 'Bxf5', prompt: 'Your move.', hint: 'Bxf5.', correctFeedback: 'Bxf5.', wrongFeedback: 'Bxf5.' },
    { type: 'instruction', fen: FEN.after_Bxf5_b, text: 'Nxf5.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },
    { type: 'play-move', fen: FEN.after_Nxf5_w, correctMove: 'Rxf5', prompt: 'Your move.', hint: 'Rxf5.', correctFeedback: 'Rxf5.', wrongFeedback: 'Rxf5.' },
    { type: 'instruction', fen: FEN.after_Rxf5, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3_21, correctMove: 'Rf8', prompt: 'Your move.', hint: 'Rf8.', correctFeedback: 'Rf8.', wrongFeedback: 'Rf8.' },
    { type: 'instruction', fen: FEN.after_Rf8, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'Nd4', prompt: 'Your move.', hint: 'Nd4.', correctFeedback: 'Nd4.', wrongFeedback: 'Nd4.' },
    { type: 'instruction', fen: FEN.after_Nd4, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'exd4', prompt: 'Your move.', hint: 'exd4.', correctFeedback: 'exd4.', wrongFeedback: 'exd4.' },

    // === DEVIATION TEST: 19.Nxf5 ===
    { type: 'instruction', fen: FEN.after_f5, text: 'Now White plays Nxf5 instead.', autoAdvance: 800, highlightSquares: ['e3', 'f5'] },
    { type: 'play-move', fen: FEN.dev_after_Nxf5, correctMove: 'gxf5', prompt: 'Your move.', hint: 'gxf5.', correctFeedback: 'gxf5.', wrongFeedback: 'gxf5.' },
    { type: 'instruction', fen: FEN.dev_after_gxf5, text: 'exf5.', autoAdvance: 800, highlightSquares: ['e4', 'f5'] },
    { type: 'play-move', fen: FEN.dev_after_exf5, correctMove: 'Bxf5', prompt: 'Your move.', hint: 'Bxf5.', correctFeedback: 'Bxf5.', wrongFeedback: 'Bxf5.' },
    { type: 'instruction', fen: FEN.dev_after_Bxf5, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },
    { type: 'play-move', fen: FEN.dev_after_Bd3, correctMove: 'Bxd3', prompt: 'Your move.', hint: 'Bxd3.', correctFeedback: 'Bxd3.', wrongFeedback: 'Bxd3.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SVESHNIKOV_LESSONS: Record<string, OpeningLesson> = {
  'sv-1': SV_1,
  'sv-2': SV_2,
  'sv-3': SV_3,
  'sv-4': SV_4,
  'sv-dev-c4': SV_DEV_C4,
  'sv-test-1': SV_TEST_1,
  'sv-5': SV_5,
  'sv-6': SV_6,
  'sv-dev-Nxf5': SV_DEV_NXF5,
  'sv-test-2': SV_TEST_2,
}

export function getSicilianSveshnikovLesson(id: string): OpeningLesson | undefined {
  return SVESHNIKOV_LESSONS[id]
}
