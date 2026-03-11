import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// QUEEN'S GAMBIT DECLINED LESSONS (qg-1 through qg-test-1)
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
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const QGD_LESSONS: Record<string, OpeningLesson> = {
  'qg-1': QG_1,
  'qg-2': QG_2,
  'qg-3': QG_3,
  'qg-test-1': QG_TEST_1,
}

export function getQueensGambitLesson(id: string): OpeningLesson | undefined {
  return QGD_LESSONS[id]
}
