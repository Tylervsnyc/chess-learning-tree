import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN ACCELERATED DRAGON LESSONS (sa-1 through sa-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6
// Main line (Maroczy Bind): 5.c4 Nf6 6.Nc3 d6 7.Be2 Nxd4
//   8.Qxd4 Bg7 9.Be3 O-O 10.Qd2 Be6 11.Rc1 Qa5 12.f3 Rfc8
//   13.b3 a6 14.Na4 Qxd2+ 15.Kxd2 Nd7 16.g4 f5
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity (1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6)
  start:           'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_g6:        'r1bqkbnr/pp1ppp1p/2n3p1/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5',

  // Lesson 1: Nf6, d6, Nxd4
  after_c4:        'r1bqkbnr/pp1ppp1p/2n3p1/8/2PNP3/8/PP3PPP/RNBQKB1R b KQkq - 0 5',
  after_Nf6:       'r1bqkb1r/pp1ppp1p/2n2np1/8/2PNP3/8/PP3PPP/RNBQKB1R w KQkq - 1 6',
  after_Nc3:       'r1bqkb1r/pp1ppp1p/2n2np1/8/2PNP3/2N5/PP3PPP/R1BQKB1R b KQkq - 2 6',
  after_d6:        'r1bqkb1r/pp2pp1p/2np1np1/8/2PNP3/2N5/PP3PPP/R1BQKB1R w KQkq - 0 7',
  after_Be2:       'r1bqkb1r/pp2pp1p/2np1np1/8/2PNP3/2N5/PP2BPPP/R1BQK2R b KQkq - 1 7',
  after_Nxd4:      'r1bqkb1r/pp2pp1p/3p1np1/8/2PnP3/2N5/PP2BPPP/R1BQK2R w KQkq - 0 8',

  // Lesson 2: Bg7, O-O, Be6
  after_Qxd4:      'r1bqkb1r/pp2pp1p/3p1np1/8/2PQP3/2N5/PP2BPPP/R1B1K2R b KQkq - 0 8',
  after_Bg7:       'r1bqk2r/pp2ppbp/3p1np1/8/2PQP3/2N5/PP2BPPP/R1B1K2R w KQkq - 1 9',
  after_Be3:       'r1bqk2r/pp2ppbp/3p1np1/8/2PQP3/2N1B3/PP2BPPP/R3K2R b KQkq - 2 9',
  after_OO:        'r1bq1rk1/pp2ppbp/3p1np1/8/2PQP3/2N1B3/PP2BPPP/R3K2R w KQ - 3 10',
  after_Qd2:       'r1bq1rk1/pp2ppbp/3p1np1/8/2P1P3/2N1B3/PP1QBPPP/R3K2R b KQ - 4 10',
  after_Be6:       'r2q1rk1/pp2ppbp/3pbnp1/8/2P1P3/2N1B3/PP1QBPPP/R3K2R w KQ - 5 11',

  // Lesson 3: Qa5, Rfc8, a6
  after_Rc1:       'r2q1rk1/pp2ppbp/3pbnp1/8/2P1P3/2N1B3/PP1QBPPP/2R1K2R b K - 6 11',
  after_Qa5:       'r4rk1/pp2ppbp/3pbnp1/q7/2P1P3/2N1B3/PP1QBPPP/2R1K2R w K - 7 12',
  after_f3:        'r4rk1/pp2ppbp/3pbnp1/q7/2P1P3/2N1BP2/PP1QB1PP/2R1K2R b K - 0 12',
  after_Rfc8:      'r1r3k1/pp2ppbp/3pbnp1/q7/2P1P3/2N1BP2/PP1QB1PP/2R1K2R w K - 1 13',
  after_b3:        'r1r3k1/pp2ppbp/3pbnp1/q7/2P1P3/1PN1BP2/P2QB1PP/2R1K2R b K - 0 13',
  after_a6:        'r1r3k1/1p2ppbp/p2pbnp1/q7/2P1P3/1PN1BP2/P2QB1PP/2R1K2R w K - 0 14',

  // Lesson 4: Qxd2+, Nd7, f5
  after_Na4:       'r1r3k1/1p2ppbp/p2pbnp1/q7/N1P1P3/1P2BP2/P2QB1PP/2R1K2R b K - 1 14',
  after_Qxd2:      'r1r3k1/1p2ppbp/p2pbnp1/8/N1P1P3/1P2BP2/P2qB1PP/2R1K2R w K - 0 15',
  after_Kxd2:      'r1r3k1/1p2ppbp/p2pbnp1/8/N1P1P3/1P2BP2/P2KB1PP/2R4R b - - 0 15',
  after_Nd7:       'r1r3k1/1p1nppbp/p2pb1p1/8/N1P1P3/1P2BP2/P2KB1PP/2R4R w - - 1 16',
  after_g4:        'r1r3k1/1p1nppbp/p2pb1p1/8/N1P1P1P1/1P2BP2/P2KB2P/2R4R b - - 0 16',
  after_f5:        'r1r3k1/1p1np1bp/p2pb1p1/5p2/N1P1P1P1/1P2BP2/P2KB2P/2R4R w - - 0 17',

  // Deviation: 14.Nd5 (instead of 14.Na4)
  dev_after_Nd5:   'r1r3k1/1p2ppbp/p2pbnp1/q2N4/2P1P3/1P2BP2/P2QB1PP/2R1K2R b K - 1 14',
  dev_after_Qxd2:  'r1r3k1/1p2ppbp/p2pbnp1/3N4/2P1P3/1P2BP2/P2qB1PP/2R1K2R w K - 0 15',
  dev_after_Kxd2:  'r1r3k1/1p2ppbp/p2pbnp1/3N4/2P1P3/1P2BP2/P2KB1PP/2R4R b - - 0 15',
  dev_after_Nxd5:  'r1r3k1/1p2ppbp/p2pb1p1/3n4/2P1P3/1P2BP2/P2KB1PP/2R4R w - - 0 16',
  dev_after_cxd5:  'r1r3k1/1p2ppbp/p2pb1p1/3P4/4P3/1P2BP2/P2KB1PP/2R4R b - - 0 16',
  dev_after_Bd7:   'r1r3k1/1p1bppbp/p2p2p1/3P4/4P3/1P2BP2/P2KB1PP/2R4R w - - 1 17',
}


// ═══════════════════════════════════════════════════════════
// sa-1: The Maroczy Bind (Nf6, d6, Nxd4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SA_1: OpeningLesson = {
  id: 'sa-1',
  title: 'The Maroczy Bind',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_g6, text: "After 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6, White clamps the center with c4. You'll develop the knight, support with d6, and trade on d4." },

    // White plays 5.c4
    { type: 'instruction', fen: FEN.after_g6, text: 'White plays c4, setting up the Maroczy Bind.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf6', prompt: 'White has locked down the center with c4. How do you develop?', hint: 'Bring out the knight to its most natural square.', correctFeedback: 'Nf6 develops the knight and attacks the e4 pawn.', wrongFeedback: 'Develop the knight to f6 — it hits e4 right away.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 is the most natural developing move. The knight pressures e4 and prepares to trade on d4.', arrow: ['g8', 'f6'] },

    // White plays 6.Nc3
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White develops Nc3, defending e4 and adding control to the center.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 2: d6
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'd6', prompt: 'How do you prepare the bishop fianchetto and support your position?', hint: 'A solid pawn move that opens the diagonal for the bishop.', correctFeedback: 'd6 supports the knight and opens the c8-h3 diagonal for your bishop later.', wrongFeedback: 'Push d6 — it solidifies the center and prepares development.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 is flexible and solid. It protects e5, supports the knight, and keeps your options open for the dark-squared bishop.', arrow: ['d7', 'd6'] },

    // White plays 7.Be2
    { type: 'instruction', fen: FEN.after_d6, text: 'White develops the bishop to e2, a calm approach.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 3: Nxd4
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nxd4', prompt: 'The knight on d4 is a powerful piece. What do you do about it?', hint: 'Trade it off — remove White\'s best-placed piece.', correctFeedback: 'Nxd4 eliminates White\'s strong centralized knight. White has to recapture with the queen.', wrongFeedback: 'Capture the knight on d4 — take out White\'s strongest piece.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4 forces White to recapture with the queen, which can be a target later. You\'ve traded off White\'s most active piece.', arrow: ['c6', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_g6, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_g6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },

    { type: 'instruction', fen: FEN.after_Nxd4, text: "Nf6, d6, Nxd4 — you've developed, supported the center, and traded off White's best piece. The Maroczy Bind is on." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sa-2: Fianchetto & Castle (Bg7, O-O, Be6)
// ═══════════════════════════════════════════════════════════

const SA_2: OpeningLesson = {
  id: 'sa-2',
  title: 'Fianchetto & Castle',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nxd4, text: "White recaptures with the queen. You'll fianchetto the dark-squared bishop, castle, and develop the last minor piece." },

    // RECAP
    { type: 'instruction', fen: FEN.after_g6, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_g6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },

    // White plays 8.Qxd4
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'White recaptures Qxd4, putting the queen in the center.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },

    // PREDICT 1: Bg7
    { type: 'play-move', fen: FEN.after_Qxd4, correctMove: 'Bg7', prompt: "Where does the dark-squared bishop belong in the Dragon setup?", hint: 'Fianchetto it — the long diagonal is calling.', correctFeedback: 'Bg7 completes the fianchetto. The bishop aims at the center and the queenside along the long diagonal.', wrongFeedback: 'Put the bishop on g7 — it controls the long diagonal from a1 to h8.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: "Bg7 is the signature Dragon move. The bishop on the long diagonal pressures d4 and b2, and will be a key piece in the middlegame.", arrow: ['f8', 'g7'] },

    // White plays 9.Be3
    { type: 'instruction', fen: FEN.after_Bg7, text: 'White develops Be3, supporting the center and connecting the pieces.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your bishop is developed. What comes next?', hint: 'Get the king to safety.', correctFeedback: 'Castles! The king is safe on g8 and the rook joins the action.', wrongFeedback: 'Castle kingside — your king needs to be tucked away.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O gets the king safe and activates the rook. Now you're ready to fight for the center.", arrow: ['e8', 'g8'] },

    // White plays 10.Qd2
    { type: 'instruction', fen: FEN.after_OO, text: 'White retreats Qd2, connecting the rooks and clearing d4.', autoAdvance: 800, highlightSquares: ['d4', 'd2'] },

    // PREDICT 3: Be6
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Be6', prompt: 'One piece is still undeveloped. Where does it go?', hint: 'The light-squared bishop targets the c4 pawn.', correctFeedback: 'Be6 develops the last minor piece and puts pressure on the c4 pawn.', wrongFeedback: 'Develop the bishop to e6 — it eyes the c4 pawn.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Be6 is the ideal square. The bishop pressures c4 and supports a future d5 or Qa5 push. All your pieces are in play now.', arrow: ['c8', 'e6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Qxd4.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },
    { type: 'play-move', fen: FEN.after_Qxd4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d4', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    { type: 'instruction', fen: FEN.after_Be6, text: "Bg7, O-O, Be6 — you've fianchettoed, castled, and completed development. Time to fight for the queenside." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sa-3: Queenside Expansion (Qa5, Rfc8, a6)
// ═══════════════════════════════════════════════════════════

const SA_3: OpeningLesson = {
  id: 'sa-3',
  title: 'Queenside Expansion',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Be6, text: "White activates the rook. You'll start queenside operations with the queen, double on the c-file, and prepare a6." },

    // RECAP
    { type: 'instruction', fen: FEN.after_g6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_g6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Qxd4.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },
    { type: 'play-move', fen: FEN.after_Qxd4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d4', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    // White plays 11.Rc1
    { type: 'instruction', fen: FEN.after_Be6, text: 'White plays Rc1, putting the rook on the open c-file.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },

    // PREDICT 1: Qa5
    { type: 'play-move', fen: FEN.after_Rc1, correctMove: 'Qa5', prompt: 'White is building on the c-file. How do you create counterplay?', hint: 'Activate the queen to an aggressive square.', correctFeedback: 'Qa5 activates the queen, creating threats along the 5th rank and eyeing the a2 pawn.', wrongFeedback: 'Bring the queen to a5 — it creates pressure on White\'s queenside.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'Qa5 is a multi-purpose move. The queen is active, pins the c3 knight to the queen on d2, and eyes a2 if White gets careless.', arrow: ['d8', 'a5'] },

    // White plays 12.f3
    { type: 'instruction', fen: FEN.after_Qa5, text: 'White pushes f3, bolstering e4 and preparing a future kingside advance.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: Rfc8
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Rfc8', prompt: 'White is building up. How do you contest the c-file?', hint: 'Put a rook on the c-file to challenge White\'s rook.', correctFeedback: 'Rfc8 contests the c-file. The rook stares right at the c4 pawn, a permanent target.', wrongFeedback: 'Put the f8 rook on c8 — fight for control of the c-file.' },
    { type: 'instruction', fen: FEN.after_Rfc8, text: 'Rfc8 doubles your pressure on c4. The c-file is the main battleground in the Maroczy Bind and you want to own it.', arrow: ['f8', 'c8'] },

    // White plays 13.b3
    { type: 'instruction', fen: FEN.after_Rfc8, text: 'White plays b3, reinforcing the c4 pawn.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },

    // PREDICT 3: a6
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'a6', prompt: 'How do you prepare further queenside expansion?', hint: 'A quiet but important pawn move that prepares b5.', correctFeedback: 'a6 prepares b5, which would blast open the queenside and undermine the c4 pawn.', wrongFeedback: 'Play a6 — it prepares the b5 break to crack open the queenside.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6 looks quiet but it threatens b5, the key break. If Black gets b5 in, the c4 pawn becomes a target and the position opens up.', arrow: ['a7', 'a6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Be6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Rc1.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },
    { type: 'play-move', fen: FEN.after_Rc1, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Rfc8', prompt: 'Your move.', hint: 'Rfc8.', correctFeedback: 'Rfc8.', wrongFeedback: 'Rfc8.' },
    { type: 'instruction', fen: FEN.after_Rfc8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    { type: 'instruction', fen: FEN.after_a6, text: "Qa5, Rfc8, a6 — the queen is active, rooks contest the c-file, and b5 is ready to break things open." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sa-4: The Endgame Transition (Qxd2+, Nd7, f5)
// ═══════════════════════════════════════════════════════════

const SA_4: OpeningLesson = {
  id: 'sa-4',
  title: 'The Endgame Transition',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "White reroutes the knight to a4. You'll trade queens, reposition the knight, and challenge the center with f5." },

    // RECAP
    { type: 'instruction', fen: FEN.after_g6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_g6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Qxd4.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },
    { type: 'play-move', fen: FEN.after_Qxd4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d4', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Rc1.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },
    { type: 'play-move', fen: FEN.after_Rc1, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Rfc8', prompt: 'Your move.', hint: 'Rfc8.', correctFeedback: 'Rfc8.', wrongFeedback: 'Rfc8.' },
    { type: 'instruction', fen: FEN.after_Rfc8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // White plays 14.Na4
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays Na4, attacking your queen and rerouting toward c5.', autoAdvance: 800, highlightSquares: ['c3', 'a4'] },

    // PREDICT 1: Qxd2+
    { type: 'play-move', fen: FEN.after_Na4, correctMove: 'Qxd2+', prompt: 'Your queen is attacked. How do you handle this?', hint: 'Trade queens — the endgame favors Black in this structure.', correctFeedback: 'Qxd2+ trades queens with check. In the endgame, your bishop on g7 and active rooks give you great chances.', wrongFeedback: 'Take the queen with Qxd2+ — the resulting endgame is comfortable for Black.' },
    { type: 'instruction', fen: FEN.after_Qxd2, text: 'Qxd2+ simplifies into an endgame where Black has excellent play. The bishop on g7 is powerful and the rooks are already active.', arrow: ['a5', 'd2'] },

    // White plays 15.Kxd2
    { type: 'instruction', fen: FEN.after_Qxd2, text: 'White recaptures Kxd2. The king is slightly exposed in the center.', autoAdvance: 800, highlightSquares: ['e1', 'd2'] },

    // PREDICT 2: Nd7
    { type: 'play-move', fen: FEN.after_Kxd2, correctMove: 'Nd7', prompt: 'The queens are off. How do you reposition the knight for the endgame?', hint: 'The knight needs to get to a better square — reroute it via d7.', correctFeedback: 'Nd7 reroutes the knight toward c5 or e5, where it will be a powerhouse.', wrongFeedback: 'Play Nd7 — the knight is heading for c5 or e5.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7 is a typical regrouping move. The knight clears f6 and heads toward c5 (attacking b3 and e4) or e5 where it dominates.', arrow: ['f6', 'd7'] },

    // White plays 16.g4
    { type: 'instruction', fen: FEN.after_Nd7, text: 'White pushes g4, trying to grab space on the kingside.', autoAdvance: 800, highlightSquares: ['g2', 'g4'] },

    // PREDICT 3: f5
    { type: 'play-move', fen: FEN.after_g4, correctMove: 'f5', prompt: 'White is expanding on the kingside. How do you fight back?', hint: 'Strike in the center before White gets too much space.', correctFeedback: 'f5 challenges White\'s center and opens lines for your rooks and bishop.', wrongFeedback: 'Push f5 — hit back in the center before White takes over the kingside.' },
    { type: 'instruction', fen: FEN.after_f5, text: 'f5 is a thematic counter-strike. It challenges the e4 pawn and opens the f-file for your rook. Black has a fully playable position.', arrow: ['f7', 'f5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na4.', autoAdvance: 800, highlightSquares: ['c3', 'a4'] },
    { type: 'play-move', fen: FEN.after_Na4, correctMove: 'Qxd2+', prompt: 'Your move.', hint: 'Qxd2+.', correctFeedback: 'Qxd2+.', wrongFeedback: 'Qxd2+.' },
    { type: 'instruction', fen: FEN.after_Qxd2, text: 'Kxd2.', autoAdvance: 800, highlightSquares: ['e1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Kxd2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'g4.', autoAdvance: 800, highlightSquares: ['g2', 'g4'] },
    { type: 'play-move', fen: FEN.after_g4, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },

    { type: 'instruction', fen: FEN.after_f5, text: "Qxd2+, Nd7, f5 — queens are off, the knight is rerouting, and you've struck back in the center. That's the full Maroczy Bind for Black." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sa-dev-Nd5: Deviation (14.Nd5 instead of 14.Na4)
// Black plays: Qxd2+, Nxd5, Bd7
// ═══════════════════════════════════════════════════════════

const SA_DEV_ND5: OpeningLesson = {
  id: 'sa-dev-Nd5',
  title: 'Dev 14.Nd5',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "Sometimes White jumps the knight to d5 instead of a4. It looks scary, but you handle it calmly." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Be6, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Rc1.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },
    { type: 'play-move', fen: FEN.after_Rc1, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Rfc8', prompt: 'Your move.', hint: 'Rfc8.', correctFeedback: 'Rfc8.', wrongFeedback: 'Rfc8.' },
    { type: 'instruction', fen: FEN.after_Rfc8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays Nd5 instead of Na4 — the knight jumps to the center, attacking the queen.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },

    // PREDICT 1: Qxd2+
    { type: 'play-move', fen: FEN.dev_after_Nd5, correctMove: 'Qxd2+', prompt: 'The knight is on d5 attacking your queen. What do you do?', hint: 'Same idea as the main line — trade queens with check.', correctFeedback: 'Qxd2+ trades queens with check. The knight on d5 looks strong, but you can deal with it.', wrongFeedback: 'Take the queen — Qxd2+ with check forces the king to recapture.' },
    { type: 'instruction', fen: FEN.dev_after_Qxd2, text: 'Qxd2+ forces the king to recapture. Now you can deal with the knight on d5 directly.', arrow: ['a5', 'd2'] },

    // White plays 15.Kxd2
    { type: 'instruction', fen: FEN.dev_after_Qxd2, text: 'White recaptures Kxd2.', autoAdvance: 800, highlightSquares: ['e1', 'd2'] },

    // PREDICT 2: Nxd5
    { type: 'play-move', fen: FEN.dev_after_Kxd2, correctMove: 'Nxd5', prompt: 'The knight on d5 is strong. How do you deal with it?', hint: 'Capture it — your knight takes on d5.', correctFeedback: 'Nxd5 eliminates the powerful knight. White has to recapture with the c-pawn.', wrongFeedback: 'Take the knight with Nxd5 — remove it before it causes problems.' },
    { type: 'instruction', fen: FEN.dev_after_Nxd5, text: 'Nxd5 clears out the knight. After cxd5, the bishop on e6 will retreat, and the position is balanced.', arrow: ['f6', 'd5'] },

    // White plays 16.cxd5
    { type: 'instruction', fen: FEN.dev_after_Nxd5, text: 'White recaptures cxd5, attacking your bishop on e6.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // PREDICT 3: Bd7
    { type: 'play-move', fen: FEN.dev_after_cxd5, correctMove: 'Bd7', prompt: 'Your bishop is attacked by the pawn. Where does it go?', hint: 'Retreat to d7 where it stays active.', correctFeedback: 'Bd7 retreats the bishop to a safe square where it still controls useful diagonals.', wrongFeedback: 'Pull the bishop back to d7 — it stays active from there.' },
    { type: 'instruction', fen: FEN.dev_after_Bd7, text: 'Bd7 keeps the bishop safe and flexible. The position is roughly equal — White has a space advantage but your pieces are well-placed.', arrow: ['e6', 'd7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_a6, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.dev_after_Nd5, correctMove: 'Qxd2+', prompt: 'Your move.', hint: 'Qxd2+.', correctFeedback: 'Qxd2+.', wrongFeedback: 'Qxd2+.' },
    { type: 'instruction', fen: FEN.dev_after_Qxd2, text: 'Kxd2.', autoAdvance: 800, highlightSquares: ['e1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_after_Kxd2, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.dev_after_Nxd5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_after_cxd5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },

    { type: 'instruction', fen: FEN.dev_after_Bd7, text: "Qxd2+, Nxd5, Bd7 — against the Nd5 jump, you trade queens, capture the knight, and keep a solid position." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sa-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const SA_TEST_1: OpeningLesson = {
  id: 'sa-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (12 Black moves) ===
    { type: 'instruction', fen: FEN.after_g6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Qxd4.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },
    { type: 'play-move', fen: FEN.after_Qxd4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d4', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Rc1.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },
    { type: 'play-move', fen: FEN.after_Rc1, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.after_Qa5, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Rfc8', prompt: 'Your move.', hint: 'Rfc8.', correctFeedback: 'Rfc8.', wrongFeedback: 'Rfc8.' },
    { type: 'instruction', fen: FEN.after_Rfc8, text: 'b3.', autoAdvance: 800, highlightSquares: ['b2', 'b3'] },
    { type: 'play-move', fen: FEN.after_b3, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Na4.', autoAdvance: 800, highlightSquares: ['c3', 'a4'] },
    { type: 'play-move', fen: FEN.after_Na4, correctMove: 'Qxd2+', prompt: 'Your move.', hint: 'Qxd2+.', correctFeedback: 'Qxd2+.', wrongFeedback: 'Qxd2+.' },
    { type: 'instruction', fen: FEN.after_Qxd2, text: 'Kxd2.', autoAdvance: 800, highlightSquares: ['e1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Kxd2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'g4.', autoAdvance: 800, highlightSquares: ['g2', 'g4'] },
    { type: 'play-move', fen: FEN.after_g4, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },

    // === DEVIATION TEST: 14.Nd5 ===
    { type: 'instruction', fen: FEN.after_a6, text: 'Now White plays Nd5 instead.', autoAdvance: 800, highlightSquares: ['c3', 'd5'] },
    { type: 'play-move', fen: FEN.dev_after_Nd5, correctMove: 'Qxd2+', prompt: 'Your move.', hint: 'Qxd2+.', correctFeedback: 'Qxd2+.', wrongFeedback: 'Qxd2+.' },
    { type: 'instruction', fen: FEN.dev_after_Qxd2, text: 'Kxd2.', autoAdvance: 800, highlightSquares: ['e1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_after_Kxd2, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.dev_after_Nxd5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_after_cxd5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SICILIAN_ACCELERATED_DRAGON_LESSONS: Record<string, OpeningLesson> = {
  'sa-1': SA_1,
  'sa-2': SA_2,
  'sa-3': SA_3,
  'sa-4': SA_4,
  'sa-dev-Nd5': SA_DEV_ND5,
  'sa-test-1': SA_TEST_1,
}

export function getSicilianAcceleratedDragonLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_ACCELERATED_DRAGON_LESSONS[id]
}
