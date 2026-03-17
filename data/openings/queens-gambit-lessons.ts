import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// QUEEN'S GAMBIT DECLINED LESSONS (qg-1 through qg-test-2)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.d4 d5 2.c4 e6 3.Nc3 Nf6
// Main line: 4.cxd5 exd5 5.Bg5 c6 6.e3 Be7 7.Bd3 Nbd7
//            8.Qc2 O-O 9.Nge2 Re8 10.O-O Nf8 11.f3 Be6
//            12.Rad1 Rc8
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 1.d4 d5 2.c4 e6 3.Nc3 Nf6)
  identity:      'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',

  // Main line
  after_cxd5:    'rnbqkb1r/ppp2ppp/4pn2/3P4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 4',
  after_exd5:    'rnbqkb1r/ppp2ppp/5n2/3p4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5',
  after_Bg5:     'rnbqkb1r/ppp2ppp/5n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNR b KQkq - 1 5',
  after_c6:      'rnbqkb1r/pp3ppp/2p2n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNR w KQkq - 0 6',
  after_e3:      'rnbqkb1r/pp3ppp/2p2n2/3p2B1/3P4/2N1P3/PP3PPP/R2QKBNR b KQkq - 0 6',
  after_Be7:     'rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N1P3/PP3PPP/R2QKBNR w KQkq - 1 7',
  after_Bd3:     'rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2NBP3/PP3PPP/R2QK1NR b KQkq - 2 7',
  after_Nbd7:    'r1bqk2r/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PP3PPP/R2QK1NR w KQkq - 3 8',
  after_Qc2:     'r1bqk2r/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ2PPP/R3K1NR b KQkq - 4 8',
  after_OO:      'r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ2PPP/R3K1NR w KQ - 5 9',
  after_Nge2:    'r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R3K2R b KQ - 6 9',
  after_Re8:     'r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R3K2R w KQ - 7 10',
  after_OO_w:    'r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R4RK1 b - - 8 10',
  after_Nf8:     'r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R4RK1 w - - 9 11',
  after_f3:      'r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPP2/PPQ1N1PP/R4RK1 b - - 0 11',
  after_Be6:     'r2qrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/R4RK1 w - - 1 12',
  after_Rad1:    'r2qrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/3R1RK1 b - - 2 12',
  after_Rc8:     '2rqrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/3R1RK1 w - - 3 13',

  // Deviation: 4.Bf4 (instead of 4.cxd5) — after identity
  dev_Bf4_after_Bf4:   'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4',
  dev_Bf4_after_Be7:   'rnbqk2r/ppp1bppp/4pn2/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5',
  dev_Bf4_after_e3:    'rnbqk2r/ppp1bppp/4pn2/3p4/2PP1B2/2N1P3/PP3PPP/R2QKBNR b KQkq - 0 5',
  dev_Bf4_after_OO:    'rnbq1rk1/ppp1bppp/4pn2/3p4/2PP1B2/2N1P3/PP3PPP/R2QKBNR w KQ - 1 6',
  dev_Bf4_after_Nf3:   'rnbq1rk1/ppp1bppp/4pn2/3p4/2PP1B2/2N1PN2/PP3PPP/R2QKB1R b KQ - 2 6',
  dev_Bf4_after_Nbd7:  'r1bq1rk1/pppnbppp/4pn2/3p4/2PP1B2/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7',

  // Deviation: 5.Bf4 (instead of 5.Bg5) — after 4.cxd5 exd5
  dev_5Bf4_after_Bf4:  'rnbqkb1r/ppp2ppp/5n2/3p4/3P1B2/2N5/PP2PPPP/R2QKBNR b KQkq - 1 5',
  dev_5Bf4_after_Bd6:  'rnbqk2r/ppp2ppp/3b1n2/3p4/3P1B2/2N5/PP2PPPP/R2QKBNR w KQkq - 2 6',
  dev_5Bf4_after_Bxd6: 'rnbqk2r/ppp2ppp/3B1n2/3p4/3P4/2N5/PP2PPPP/R2QKBNR b KQkq - 0 6',
  dev_5Bf4_after_Qxd6: 'rnb1k2r/ppp2ppp/3q1n2/3p4/3P4/2N5/PP2PPPP/R2QKBNR w KQkq - 0 7',
  dev_5Bf4_after_e3:   'rnb1k2r/ppp2ppp/3q1n2/3p4/3P4/2N1P3/PP3PPP/R2QKBNR b KQkq - 0 7',
  dev_5Bf4_after_OO:   'rnb2rk1/ppp2ppp/3q1n2/3p4/3P4/2N1P3/PP3PPP/R2QKBNR w KQ - 1 8',

  // Deviation: 8.Nf3 (instead of 8.Qc2) — after 7.Bd3 Nbd7
  dev_Nf3_after_Nf3:   'r1bqk2r/pp1nbppp/2p2n2/3p2B1/3P4/2NBPN2/PP3PPP/R2QK2R b KQkq - 4 8',
  dev_Nf3_after_OO:    'r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBPN2/PP3PPP/R2QK2R w KQ - 5 9',
  dev_Nf3_after_Qc2:   'r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R3K2R b KQ - 6 9',
  dev_Nf3_after_Re8:   'r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R3K2R w KQ - 7 10',
  dev_Nf3_after_OO_w:  'r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 b - - 8 10',
  dev_Nf3_after_Nf8:   'r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 w - - 9 11',
}


// ═══════════════════════════════════════════════════════════
// qg-1: The Exchange (exd5, c6, Be7)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const QG_1: OpeningLesson = {
  id: 'qg-1',
  title: 'The Exchange',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.identity, text: "After 1.d4 d5 2.c4 e6 3.Nc3 Nf6, White exchanges pawns and pins your knight. You'll hold the center and develop calmly." },

    // White plays 4.cxd5
    { type: 'instruction', fen: FEN.identity, text: 'White captures cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // PREDICT 1: exd5
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'White just took your d5 pawn. How do you recapture?', hint: 'Take back with the e-pawn to keep a solid center.', correctFeedback: 'exd5 recaptures and gives you a strong pawn on d5 controlling the center.', wrongFeedback: 'Recapture with the e-pawn — exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5 keeps a solid pawn structure. Your pawn on d5 controls c4 and e4.', arrow: ['e6', 'd5'] },

    // White plays 5.Bg5
    { type: 'instruction', fen: FEN.after_exd5, text: 'White pins your knight with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },

    // PREDICT 2: c6
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: 'Your knight is pinned. How do you reinforce the center?', hint: 'A pawn move to support d5 from the side.', correctFeedback: 'c6 supports d5 and prepares to develop without worrying about the pin.', wrongFeedback: 'Play c6 to reinforce the d5 pawn.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6 is a classic Carlsbad pawn structure move. Your d5 pawn is now rock-solid.', arrow: ['c7', 'c6'] },

    // White plays 6.e3
    { type: 'instruction', fen: FEN.after_c6, text: 'White plays e3, supporting d4 and opening the diagonal for the bishop.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },

    // PREDICT 3: Be7
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Be7', prompt: 'Time to develop the bishop. Where does it go?', hint: 'Develop to e7 — it breaks the pin on your knight.', correctFeedback: 'Be7 develops the bishop and breaks the pin on the f6 knight.', wrongFeedback: 'Play Be7 to develop and break the pin.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7 neatly breaks the Bg5 pin. Your knight on f6 is free again, and you can castle next.', arrow: ['f8', 'e7'] },

    // RECALL
    { type: 'instruction', fen: FEN.identity, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.identity, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },

    { type: 'instruction', fen: FEN.after_Be7, text: "exd5, c6, Be7 — you've handled the Exchange Variation and are ready to castle." },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-2: Completing Development (Nbd7, O-O, Re8)
// ═══════════════════════════════════════════════════════════

const QG_2: OpeningLesson = {
  id: 'qg-2',
  title: 'Completing Development',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Be7, text: "White develops the bishop and queen. You'll finish developing, castle, and activate the rook." },

    // RECAP
    { type: 'instruction', fen: FEN.identity, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.identity, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },

    // White plays 7.Bd3
    { type: 'instruction', fen: FEN.after_Be7, text: 'White develops the bishop to d3, eyeing the kingside.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 1: Nbd7
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbd7', prompt: 'Where should the queenside knight develop?', hint: 'Develop to d7 — it supports the f6 knight and keeps options open.', correctFeedback: 'Nbd7 develops the knight to a flexible square where it supports f6 and can reroute later.', wrongFeedback: 'Play Nbd7 to develop and support your position.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7 is the standard square. The knight supports f6 and can later go to f8 or b6.', arrow: ['b8', 'd7'] },

    // White plays 8.Qc2
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'White plays Qc2, connecting rooks and adding pressure to the h7 diagonal.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your king is still in the center. What should you do?', hint: 'Castle kingside to get the king to safety.', correctFeedback: 'O-O tucks the king away safely and activates the f8 rook.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Castling gets your king safe. The rook on f8 is now ready to be redeployed.', arrow: ['e8', 'g8'] },

    // White plays 9.Nge2
    { type: 'instruction', fen: FEN.after_OO, text: 'White develops the knight to e2, heading for f4 or g3.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },

    // PREDICT 3: Re8
    { type: 'play-move', fen: FEN.after_Nge2, correctMove: 'Re8', prompt: 'How do you activate the rook?', hint: 'Move the rook to the open e-file.', correctFeedback: 'Re8 puts the rook on the semi-open e-file, adding pressure to e3.', wrongFeedback: 'Play Re8 — the rook belongs on the e-file.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'Re8 activates the rook on the e-file. It puts indirect pressure on the e3 pawn.', arrow: ['f8', 'e8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Be7, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nge2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Nge2, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },

    { type: 'instruction', fen: FEN.after_Re8, text: "Nbd7, O-O, Re8 — you've completed development and your pieces are well coordinated." },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-3: The Karlsbad Maneuver (Nf8, Be6, Rc8)
// ═══════════════════════════════════════════════════════════

const QG_3: OpeningLesson = {
  id: 'qg-3',
  title: 'The Karlsbad Maneuver',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Re8, text: "White castles and builds up. You'll reroute the knight to f8, develop the bishop, and prepare queenside counterplay." },

    // RECAP
    { type: 'instruction', fen: FEN.identity, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.identity, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nge2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Nge2, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },

    // White plays 10.O-O
    { type: 'instruction', fen: FEN.after_Re8, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 1: Nf8
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Nf8', prompt: 'Your knight on d7 needs a better square. Where should it go?', hint: 'Reroute the knight backward to f8 — it can reach e6 or g6 later.', correctFeedback: 'Nf8 is the classic Carlsbad maneuver. The knight heads for e6 or g6 via f8.', wrongFeedback: 'Play Nf8 to reroute the knight to a better post.' },
    { type: 'instruction', fen: FEN.after_Nf8, text: 'Nf8 looks like a retreat, but it is a well-known regrouping. The knight aims for e6 where it will be a powerful piece.', arrow: ['d7', 'f8'] },

    // White plays 11.f3
    { type: 'instruction', fen: FEN.after_Nf8, text: 'White plays f3, supporting e4 and restricting your minor pieces.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: Be6
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Be6', prompt: 'Your bishop on c8 is still undeveloped. Where does it belong?', hint: 'Develop to e6 where it supports d5 and eyes the queenside.', correctFeedback: 'Be6 develops the last minor piece and solidifies control over d5.', wrongFeedback: 'Play Be6 to develop and reinforce d5.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Be6 completes your minor piece development. The bishop supports d5 and can swing to f7 if needed.', arrow: ['c8', 'e6'] },

    // White plays 12.Rad1
    { type: 'instruction', fen: FEN.after_Be6, text: 'White centralizes the rook with Rad1.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },

    // PREDICT 3: Rc8
    { type: 'play-move', fen: FEN.after_Rad1, correctMove: 'Rc8', prompt: 'How do you prepare queenside counterplay?', hint: 'Place the rook on the c-file to support a future c5 break.', correctFeedback: 'Rc8 puts the rook on the semi-open c-file, preparing the c5 pawn break.', wrongFeedback: 'Play Rc8 — the rook supports the c5 break.' },
    { type: 'instruction', fen: FEN.after_Rc8, text: 'Rc8 completes your setup. The rook on c8 prepares the c5 advance, your main source of counterplay.', arrow: ['a8', 'c8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Re8, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Re8, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Nf8', prompt: 'Your move.', hint: 'Nf8.', correctFeedback: 'Nf8.', wrongFeedback: 'Nf8.' },
    { type: 'instruction', fen: FEN.after_Nf8, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Rad1.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },
    { type: 'play-move', fen: FEN.after_Rad1, correctMove: 'Rc8', prompt: 'Your move.', hint: 'Rc8.', correctFeedback: 'Rc8.', wrongFeedback: 'Rc8.' },

    { type: 'instruction', fen: FEN.after_Rc8, text: "Nf8, Be6, Rc8 — you've mastered the Karlsbad maneuver and are ready for queenside play." },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-test-1: Level Test (main line only)
// ═══════════════════════════════════════════════════════════

const QG_TEST_1: OpeningLesson = {
  id: 'qg-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (9 Black moves) ===
    { type: 'instruction', fen: FEN.identity, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Nge2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Nge2, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Nf8', prompt: 'Your move.', hint: 'Nf8.', correctFeedback: 'Nf8.', wrongFeedback: 'Nf8.' },
    { type: 'instruction', fen: FEN.after_Nf8, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Rad1.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },
    { type: 'play-move', fen: FEN.after_Rad1, correctMove: 'Rc8', prompt: 'Your move.', hint: 'Rc8.', correctFeedback: 'Rc8.', wrongFeedback: 'Rc8.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-dev-Bf4: DEVIATION 4.Bf4 (instead of 4.cxd5)
// After identity (3...Nf6), White plays 4.Bf4 instead of 4.cxd5
// Black responds: Be7, O-O, Nbd7
// ═══════════════════════════════════════════════════════════

const QG_DEV_BF4: OpeningLesson = {
  id: 'qg-dev-Bf4',
  title: 'If 4.Bf4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.identity,
      text: "Sometimes White plays 4.Bf4 instead of exchanging pawns. This is a London-style setup. You develop calmly and castle early.",
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_Bf4_after_Bf4, text: 'White plays 4.Bf4 instead of 4.cxd5.', autoAdvance: 800, highlightSquares: ['c1', 'f4'] },

    // ── PREDICT/REVEAL 1: Be7 ──
    {
      type: 'play-move',
      fen: FEN.dev_Bf4_after_Bf4,
      correctMove: 'Be7',
      prompt: 'White developed the bishop to f4. How do you continue?',
      hint: 'Develop the dark-squared bishop to e7 — solid and flexible.',
      correctFeedback: 'Be7 develops naturally. No rush to react to the bishop on f4.',
      wrongFeedback: 'Play Be7 to develop.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bf4_after_Be7,
      text: 'Be7 is the most flexible response. You keep the option to challenge the bishop later with Nh5 or just castle.',
      arrow: ['f8', 'e7'],
    },

    // ── PREDICT/REVEAL 2: O-O ──
    { type: 'instruction', fen: FEN.dev_Bf4_after_e3, text: 'White plays e3, supporting d4.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Bf4_after_e3,
      correctMove: 'O-O',
      prompt: 'Your bishop is developed. What is the priority?',
      hint: 'Get the king to safety — castle kingside.',
      correctFeedback: 'O-O gets your king safe immediately. The position is solid.',
      wrongFeedback: 'Castle kingside with O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bf4_after_OO,
      text: 'Castling early is always good in the QGD. Your king is safe and the rook is activated.',
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 3: Nbd7 ──
    { type: 'instruction', fen: FEN.dev_Bf4_after_Nf3, text: 'White develops the knight with Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Bf4_after_Nf3,
      correctMove: 'Nbd7',
      prompt: 'How do you develop the queenside knight?',
      hint: 'Nbd7 supports the center and keeps your pieces coordinated.',
      correctFeedback: 'Nbd7 develops the last minor piece. From d7, the knight supports e5 and c5 breaks.',
      wrongFeedback: 'Play Nbd7 to complete development.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bf4_after_Nbd7,
      text: 'Nbd7 completes your development. You have a solid, flexible position with plans for c5 or e5.',
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Bf4_after_Bf4,
      text: "White played 4.Bf4. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.dev_Bf4_after_Bf4, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.dev_Bf4_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.dev_Bf4_after_e3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_Bf4_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Bf4_after_Nf3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Bf4_after_Nbd7,
      text: "Against 4.Bf4, just develop naturally: Be7, castle, Nbd7. Simple and solid.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-dev-5Bf4: DEVIATION 5.Bf4 (instead of 5.Bg5)
// After 4.cxd5 exd5, White plays 5.Bf4 instead of 5.Bg5
// Black responds: Bd6, Qxd6, O-O
// ═══════════════════════════════════════════════════════════

const QG_DEV_5BF4: OpeningLesson = {
  id: 'qg-dev-5Bf4',
  title: 'If 5.Bf4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "After the exchange 4.cxd5 exd5, White can play 5.Bf4 instead of the usual Bg5. You challenge the bishop immediately and get a comfortable position.",
    },

    // ── RECAP to deviation point (4.cxd5 exd5 = 1 recap pair) ──
    {
      type: 'instruction',
      fen: FEN.identity,
      text: "First, the familiar exchange.",
    },
    { type: 'instruction', fen: FEN.identity, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_5Bf4_after_Bf4, text: 'White plays 5.Bf4 instead of 5.Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'f4'] },

    // ── PREDICT/REVEAL 1: Bd6 ──
    {
      type: 'play-move',
      fen: FEN.dev_5Bf4_after_Bf4,
      correctMove: 'Bd6',
      prompt: 'White put the bishop on f4. How do you challenge it?',
      hint: 'Develop to d6 and offer a trade — the bishop has nowhere better to go.',
      correctFeedback: 'Bd6 challenges the bishop directly. White will be forced to trade or retreat.',
      wrongFeedback: 'Play Bd6 to challenge the bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_5Bf4_after_Bd6,
      text: 'Bd6 attacks the bishop on f4. After the trade, your queen becomes active on d6.',
      arrow: ['f8', 'd6'],
    },

    // ── PREDICT/REVEAL 2: Qxd6 ──
    { type: 'instruction', fen: FEN.dev_5Bf4_after_Bxd6, text: 'White trades bishops with Bxd6.', autoAdvance: 800, highlightSquares: ['f4', 'd6'] },
    {
      type: 'play-move',
      fen: FEN.dev_5Bf4_after_Bxd6,
      correctMove: 'Qxd6',
      prompt: 'White captured your bishop. How do you recapture?',
      hint: 'Take back with the queen to activate it.',
      correctFeedback: 'Qxd6 recaptures and puts the queen on a strong central square.',
      wrongFeedback: 'Recapture with Qxd6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_5Bf4_after_Qxd6,
      text: 'Qxd6 gives you an active queen in the center. The bishop pair is traded, simplifying the position in your favor.',
      arrow: ['d8', 'd6'],
    },

    // ── PREDICT/REVEAL 3: O-O ──
    { type: 'instruction', fen: FEN.dev_5Bf4_after_e3, text: 'White plays e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_5Bf4_after_e3,
      correctMove: 'O-O',
      prompt: 'Your queen is active and your position is solid. What now?',
      hint: 'Castle to safety while your position is comfortable.',
      correctFeedback: 'O-O completes your development priorities. King is safe, rook is ready.',
      wrongFeedback: 'Castle kingside with O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_5Bf4_after_OO,
      text: 'Castling gives you a very comfortable position. The queen on d6 is well-placed and you can develop the rest naturally.',
      arrow: ['e8', 'g8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_5Bf4_after_Bf4,
      text: "White went 5.Bf4. Play your three moves.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.dev_5Bf4_after_Bf4, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.' },
    { type: 'instruction', fen: FEN.dev_5Bf4_after_Bxd6, text: 'Bxd6.', autoAdvance: 800, highlightSquares: ['f4', 'd6'] },
    { type: 'play-move', fen: FEN.dev_5Bf4_after_Bxd6, correctMove: 'Qxd6', prompt: 'Your move.', hint: 'Qxd6.', correctFeedback: 'Qxd6.', wrongFeedback: 'Qxd6.' },
    { type: 'instruction', fen: FEN.dev_5Bf4_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.dev_5Bf4_after_e3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_5Bf4_after_OO,
      text: "Against 5.Bf4, challenge it with Bd6, recapture with the queen, and castle. You get a clean, equal position.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-dev-Nf3: DEVIATION 8.Nf3 (instead of 8.Qc2)
// After 7.Bd3 Nbd7, White plays 8.Nf3 instead of 8.Qc2
// Black responds: O-O, Re8, Nf8
// ═══════════════════════════════════════════════════════════

const QG_DEV_NF3: OpeningLesson = {
  id: 'qg-dev-Nf3',
  title: 'If 8.Nf3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "White sometimes develops with 8.Nf3 instead of 8.Qc2. Your plan stays the same: castle, activate the rook, reroute the knight.",
    },

    // ── RECAP to deviation point (4.cxd5 exd5 through 7.Bd3 Nbd7 = 4 recap pairs) ──
    {
      type: 'instruction',
      fen: FEN.identity,
      text: "Warm up with the moves you know.",
    },
    { type: 'instruction', fen: FEN.identity, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_Nf3_after_Nf3, text: 'White plays 8.Nf3 instead of 8.Qc2.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // ── PREDICT/REVEAL 1: O-O ──
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Nf3,
      correctMove: 'O-O',
      prompt: 'White developed the knight to f3. What should you do?',
      hint: 'Your king is still in the center. Time to castle.',
      correctFeedback: 'O-O gets the king safe. Same plan as the main line — the move order just shifts.',
      wrongFeedback: 'Castle kingside with O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_OO,
      text: 'O-O is the natural response. Whether White plays Qc2 or Nf3 first, your plan is the same.',
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 2: Re8 ──
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qc2, text: 'White plays Qc2, connecting the rooks.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_Qc2,
      correctMove: 'Re8',
      prompt: 'White played Qc2. How do you activate the rook?',
      hint: 'Put the rook on the e-file where it pressures e3.',
      correctFeedback: 'Re8 puts the rook on the semi-open e-file. Familiar territory.',
      wrongFeedback: 'Play Re8 to activate the rook.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Re8,
      text: 'Re8 on the e-file is the standard plan. The rook adds pressure to e3 and keeps the position active.',
      arrow: ['f8', 'e8'],
    },

    // ── PREDICT/REVEAL 3: Nf8 ──
    { type: 'instruction', fen: FEN.dev_Nf3_after_OO_w, text: 'White castles.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nf3_after_OO_w,
      correctMove: 'Nf8',
      prompt: 'Both sides have castled. What is the next step of the Karlsbad plan?',
      hint: 'Reroute the knight from d7 to f8 heading for e6.',
      correctFeedback: 'Nf8 continues the Karlsbad regrouping. The knight aims for the powerful e6 square.',
      wrongFeedback: 'Play Nf8 to reroute the knight.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf8,
      text: 'Nf8 is the same regrouping as the main line. The knight heads for e6 regardless of whether White played Qc2 or Nf3 first.',
      arrow: ['d7', 'f8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf3,
      text: "White played 8.Nf3 — play the response from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Qc2, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_OO_w, correctMove: 'Nf8', prompt: 'Your move.', hint: 'Nf8.', correctFeedback: 'Nf8.', wrongFeedback: 'Nf8.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nf3_after_Nf8,
      text: "8.Nf3 changes nothing for you. Castle, Re8, Nf8 — the same Karlsbad plan in a slightly different order.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// qg-test-2: Level 2 Test (deviations only)
// ═══════════════════════════════════════════════════════════

const QG_TEST_2: OpeningLesson = {
  id: 'qg-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // ── DEVIATION 1: 4.Bf4 ──
    {
      type: 'instruction',
      fen: FEN.identity,
      text: "Level 2 test. Handle all three deviations from memory.",
    },
    { type: 'instruction', fen: FEN.dev_Bf4_after_Bf4, text: 'White plays 4.Bf4 instead of 4.cxd5.', autoAdvance: 1200, highlightSquares: ['c1', 'f4'] },
    { type: 'play-move', fen: FEN.dev_Bf4_after_Bf4, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.dev_Bf4_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.dev_Bf4_after_e3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_Bf4_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Bf4_after_Nf3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    // ── DEVIATION 2: 5.Bf4 ──
    { type: 'instruction', fen: FEN.dev_5Bf4_after_Bf4, text: 'White plays 5.Bf4 instead of 5.Bg5.', autoAdvance: 1200, highlightSquares: ['c1', 'f4'] },
    { type: 'play-move', fen: FEN.dev_5Bf4_after_Bf4, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.' },
    { type: 'instruction', fen: FEN.dev_5Bf4_after_Bxd6, text: 'Bxd6.', autoAdvance: 800, highlightSquares: ['f4', 'd6'] },
    { type: 'play-move', fen: FEN.dev_5Bf4_after_Bxd6, correctMove: 'Qxd6', prompt: 'Your move.', hint: 'Qxd6.', correctFeedback: 'Qxd6.', wrongFeedback: 'Qxd6.' },
    { type: 'instruction', fen: FEN.dev_5Bf4_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.dev_5Bf4_after_e3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // ── DEVIATION 3: 8.Nf3 ──
    { type: 'instruction', fen: FEN.dev_Nf3_after_Nf3, text: 'White plays 8.Nf3 instead of 8.Qc2.', autoAdvance: 1200, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Nf3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_Qc2, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.dev_Nf3_after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_Nf3_after_OO_w, correctMove: 'Nf8', prompt: 'Your move.', hint: 'Nf8.', correctFeedback: 'Nf8.', wrongFeedback: 'Nf8.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const QGD_LESSONS: Record<string, OpeningLesson> = {
  'qg-1': QG_1,
  'qg-2': QG_2,
  'qg-3': QG_3,
  'qg-test-1': QG_TEST_1,
  'qg-dev-Bf4': QG_DEV_BF4,
  'qg-dev-5Bf4': QG_DEV_5BF4,
  'qg-dev-Nf3': QG_DEV_NF3,
  'qg-test-2': QG_TEST_2,
}

export function getQueensGambitLesson(id: string): OpeningLesson | undefined {
  return QGD_LESSONS[id]
}
