import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// GRÜNFELD DEFENSE LESSONS (gr-1 through gr-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3
//            6.bxc3 Bg7 7.Bc4 c5 8.Ne2 Nc6 9.Be3 O-O 10.O-O Bg4
//            11.f3 Na5 12.Bd3 cxd4 13.cxd4 Be6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity moves (1.d4 Nf6 2.c4 g6 3.Nc3 d5)
  start:           'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:        'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6:       'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_c4:        'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_g6:        'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:       'rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  after_d5:        'rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4',

  // Main line from move 4
  after_cxd5:      'rnbqkb1r/ppp1pp1p/5np1/3P4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 4',
  after_Nxd5:      'rnbqkb1r/ppp1pp1p/6p1/3n4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5',
  after_e4:        'rnbqkb1r/ppp1pp1p/6p1/3n4/3PP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 5',
  after_Nxc3:      'rnbqkb1r/ppp1pp1p/6p1/8/3PP3/2n5/PP3PPP/R1BQKBNR w KQkq - 0 6',
  after_bxc3:      'rnbqkb1r/ppp1pp1p/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR b KQkq - 0 6',
  after_Bg7:       'rnbqk2r/ppp1ppbp/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR w KQkq - 1 7',
  after_Bc4:       'rnbqk2r/ppp1ppbp/6p1/8/2BPP3/2P5/P4PPP/R1BQK1NR b KQkq - 2 7',
  after_c5:        'rnbqk2r/pp2ppbp/6p1/2p5/2BPP3/2P5/P4PPP/R1BQK1NR w KQkq - 0 8',
  after_Ne2:       'rnbqk2r/pp2ppbp/6p1/2p5/2BPP3/2P5/P3NPPP/R1BQK2R b KQkq - 1 8',
  after_Nc6:       'r1bqk2r/pp2ppbp/2n3p1/2p5/2BPP3/2P5/P3NPPP/R1BQK2R w KQkq - 2 9',
  after_Be3:       'r1bqk2r/pp2ppbp/2n3p1/2p5/2BPP3/2P1B3/P3NPPP/R2QK2R b KQkq - 3 9',
  after_OO:        'r1bq1rk1/pp2ppbp/2n3p1/2p5/2BPP3/2P1B3/P3NPPP/R2QK2R w KQ - 4 10',
  after_OO_w:      'r1bq1rk1/pp2ppbp/2n3p1/2p5/2BPP3/2P1B3/P3NPPP/R2Q1RK1 b - - 5 10',
  after_Bg4:       'r2q1rk1/pp2ppbp/2n3p1/2p5/2BPP1b1/2P1B3/P3NPPP/R2Q1RK1 w - - 6 11',
  after_f3:        'r2q1rk1/pp2ppbp/2n3p1/2p5/2BPP1b1/2P1BP2/P3N1PP/R2Q1RK1 b - - 0 11',
  after_Na5:       'r2q1rk1/pp2ppbp/6p1/n1p5/2BPP1b1/2P1BP2/P3N1PP/R2Q1RK1 w - - 1 12',
  after_Bd3:       'r2q1rk1/pp2ppbp/6p1/n1p5/3PP1b1/2PBBP2/P3N1PP/R2Q1RK1 b - - 2 12',
  after_cxd4:      'r2q1rk1/pp2ppbp/6p1/n7/3pP1b1/2PBBP2/P3N1PP/R2Q1RK1 w - - 0 13',
  after_cxd4_w:    'r2q1rk1/pp2ppbp/6p1/n7/3PP1b1/3BBP2/P3N1PP/R2Q1RK1 b - - 0 13',
  after_Be6:       'r2q1rk1/pp2ppbp/4b1p1/n7/3PP3/3BBP2/P3N1PP/R2Q1RK1 w - - 1 14',

  // Deviation: 7.Be3 (instead of 7.Bc4)
  dev_after_Be3:   'rnbqk2r/ppp1ppbp/6p1/8/3PP3/2P1B3/P4PPP/R2QKBNR b KQkq - 2 7',
  dev_after_c5:    'rnbqk2r/pp2ppbp/6p1/2p5/3PP3/2P1B3/P4PPP/R2QKBNR w KQkq - 0 8',
  dev_after_Qd2:   'rnbqk2r/pp2ppbp/6p1/2p5/3PP3/2P1B3/P2Q1PPP/R3KBNR b KQkq - 1 8',
  dev_after_Qa5:   'rnb1k2r/pp2ppbp/6p1/q1p5/3PP3/2P1B3/P2Q1PPP/R3KBNR w KQkq - 2 9',
  dev_after_Rc1:   'rnb1k2r/pp2ppbp/6p1/q1p5/3PP3/2P1B3/P2Q1PPP/2R1KBNR b Kkq - 3 9',
  dev_after_cxd4:  'rnb1k2r/pp2ppbp/6p1/q7/3pP3/2P1B3/P2Q1PPP/2R1KBNR w Kkq - 0 10',
  dev_after_cxd4_w:'rnb1k2r/pp2ppbp/6p1/q7/3PP3/4B3/P2Q1PPP/2R1KBNR b Kkq - 0 10',
  dev_after_Qxd2:  'rnb1k2r/pp2ppbp/6p1/8/3PP3/4B3/P2q1PPP/2R1KBNR w Kkq - 0 11',
}


// ═══════════════════════════════════════════════════════════
// gr-1: The Exchange (Nxd5, Nxc3, Bg7)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const GR_1: OpeningLesson = {
  id: 'gr-1',
  title: 'The Exchange',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_d5, text: "The Grunfeld Defense starts after 1.d4 Nf6 2.c4 g6 3.Nc3 d5. You've offered White the center — now you'll fight to destroy it." },

    // White plays 4.cxd5
    { type: 'instruction', fen: FEN.after_d5, text: 'White captures cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // PREDICT 1: Nxd5
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'White took your pawn. How do you recapture?', hint: 'Your knight on f6 can take back on d5.', correctFeedback: 'Nxd5 recaptures and centralizes your knight on a strong square.', wrongFeedback: 'Take back with the knight — Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'Nxd5 puts your knight right in the center. White will want to kick it with e4.', arrow: ['f6', 'd5'] },

    // White plays 5.e4
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'White pushes e4, attacking your knight and grabbing the center.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 2: Nxc3
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'Nxc3', prompt: 'Your knight is attacked. What do you do?', hint: 'Trade it for the knight on c3 — you get to damage White\'s pawn structure.', correctFeedback: 'Nxc3 trades the knight and forces White to recapture with the b-pawn, creating doubled pawns.', wrongFeedback: 'Capture on c3 — Nxc3 damages White\'s pawn structure.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'Nxc3 is the key idea. White has to take back with the b-pawn, doubling pawns on the c-file.', arrow: ['d5', 'c3'] },

    // White plays 6.bxc3
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'White recaptures bxc3. The pawns are doubled, but White has a big center.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },

    // PREDICT 3: Bg7
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Bg7', prompt: 'Time to develop. Where does the dark-squared bishop belong?', hint: 'Fianchetto — put the bishop on g7 where it targets the center.', correctFeedback: 'Bg7 fianchettoes the bishop, aiming straight at the d4 pawn and the long diagonal.', wrongFeedback: 'Fianchetto the bishop to g7 — it will pressure d4 from the diagonal.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Bg7 is the heart of the Grunfeld. The bishop on g7 stares down the long diagonal at d4, and will become a monster.', arrow: ['f8', 'g7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d5, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_d5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    { type: 'instruction', fen: FEN.after_Bg7, text: "Nxd5, Nxc3, Bg7 — the Exchange Variation. You gave White the center, but your bishop on g7 is ready to tear it apart." },
  ],
}


// ═══════════════════════════════════════════════════════════
// gr-2: Pressuring the Center (c5, Nc6, O-O)
// ═══════════════════════════════════════════════════════════

const GR_2: OpeningLesson = {
  id: 'gr-2',
  title: 'Pressuring the Center',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bg7, text: "White develops the bishop to c4. You'll strike the center with c5, develop the knight, and castle." },

    // RECAP
    { type: 'instruction', fen: FEN.after_d5, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_d5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // White plays 7.Bc4
    { type: 'instruction', fen: FEN.after_Bg7, text: 'White plays Bc4, developing the bishop toward your kingside.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 1: c5
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'c5', prompt: "White has a big pawn center. How do you challenge it?", hint: 'Push the c-pawn to attack the d4 pawn.', correctFeedback: 'c5 immediately challenges the d4 pawn. Combined with the Bg7, the pressure on d4 is real.', wrongFeedback: 'Strike the center with c5 — attack that d4 pawn.' },
    { type: 'instruction', fen: FEN.after_c5, text: "c5 is the classic Grunfeld move. Your bishop on g7 and the c5 pawn both target d4, White's most important pawn.", arrow: ['c7', 'c5'] },

    // White plays 8.Ne2
    { type: 'instruction', fen: FEN.after_c5, text: 'White develops the knight to e2, defending d4 without blocking the bishop.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },

    // PREDICT 2: Nc6
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'Nc6', prompt: 'How do you add more pressure to the center?', hint: 'Develop the knight toward d4.', correctFeedback: 'Nc6 develops the knight and adds a third attacker to d4.', wrongFeedback: 'Bring the knight to c6 — more pressure on d4.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 develops naturally and hits d4 a third time. The bishop on g7, the c5 pawn, and now the knight are all pressuring White\'s center.', arrow: ['b8', 'c6'] },

    // White plays 9.Be3
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White plays Be3, defending d4 and developing.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your pieces are developed. What should you do now?', hint: 'Get your king to safety.', correctFeedback: 'Castles! Your king is safe and the rook joins the fight on the f-file.', wrongFeedback: 'Castle kingside — your king needs to be safe before the real action starts.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O completes your development. The king is tucked away and the rook is ready. Now it's time to start the real pressure.", arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bg7, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.after_OO, text: "c5, Nc6, O-O — you've developed everything and the pressure on White's center is building." },
  ],
}


// ═══════════════════════════════════════════════════════════
// gr-3: Queenside Play (Bg4, Na5, cxd4)
// ═══════════════════════════════════════════════════════════

const GR_3: OpeningLesson = {
  id: 'gr-3',
  title: 'Queenside Play',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "Both sides have castled. Now you'll pin a piece, reroute a knight, and crack open the center." },

    // RECAP
    { type: 'instruction', fen: FEN.after_d5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_d5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // White plays 10.O-O
    { type: 'instruction', fen: FEN.after_OO, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 1: Bg4
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Bg4', prompt: 'How do you create problems for the White knight on e2?', hint: 'Develop your bishop to pin or pressure the knight.', correctFeedback: 'Bg4 develops the bishop to an active square, targeting the e2 knight and controlling f3.', wrongFeedback: 'Put the bishop on g4 — it puts pressure on the knight and controls key squares.' },
    { type: 'instruction', fen: FEN.after_Bg4, text: 'Bg4 is annoying for White. The bishop eyes e2 and makes it hard for White to coordinate. White usually has to push f3 to chase it.', arrow: ['c8', 'g4'] },

    // White plays 11.f3
    { type: 'instruction', fen: FEN.after_Bg4, text: 'White pushes f3, chasing your bishop.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 2: Na5
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Na5', prompt: 'Your bishop will retreat soon. But first, what about the knight?', hint: 'The knight can jump to a5, targeting the bishop on c4.', correctFeedback: 'Na5 attacks the bishop on c4 and prepares to reroute to queenside play.', wrongFeedback: 'Jump the knight to a5 — it attacks the c4 bishop.' },
    { type: 'instruction', fen: FEN.after_Na5, text: 'Na5 forces White to deal with the threat to the c4 bishop. The knight is heading for c4 or b3 eventually.', arrow: ['c6', 'a5'] },

    // White plays 12.Bd3
    { type: 'instruction', fen: FEN.after_Na5, text: 'White retreats the bishop to d3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },

    // PREDICT 3: cxd4
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'cxd4', prompt: 'The bishop retreated. Now how do you open up the center?', hint: 'Capture on d4 to open the position for your bishop on g7.', correctFeedback: 'cxd4 opens the center. Your Bg7 and rooks will have open lines to exploit.', wrongFeedback: 'Take on d4 — open up the position for your pieces.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'cxd4 cracks open the center. After White recaptures, the Bg7 will be staring down an open long diagonal.', arrow: ['c5', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_OO, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },
    { type: 'instruction', fen: FEN.after_Bg4, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Na5', prompt: 'Your move.', hint: 'Na5.', correctFeedback: 'Na5.', wrongFeedback: 'Na5.' },
    { type: 'instruction', fen: FEN.after_Na5, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    { type: 'instruction', fen: FEN.after_cxd4, text: "Bg4, Na5, cxd4 — you've pinned, rerouted, and blown open the center. That's the Grunfeld in action." },
  ],
}


// ═══════════════════════════════════════════════════════════
// gr-dev-Be3: Deviation (7.Be3 instead of 7.Bc4)
// Black plays: c5, Qa5, cxd4
// ═══════════════════════════════════════════════════════════

const GR_DEV_BE3: OpeningLesson = {
  id: 'gr-dev-Be3',
  title: 'Dev 7.Be3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bg7, text: "Sometimes White plays Be3 instead of Bc4. The plan is different — White wants to build slowly. Here's how you respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_d5, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_d5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Bg7, text: 'White plays Be3 instead of Bc4 — a slower, more solid approach.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 1: c5
    { type: 'play-move', fen: FEN.dev_after_Be3, correctMove: 'c5', prompt: 'Same idea as the main line — how do you challenge the center?', hint: 'Attack the d4 pawn with the c-pawn.', correctFeedback: 'c5 works against Be3 too. The d4 pawn is under pressure from both the pawn and the Bg7.', wrongFeedback: 'Push c5 — same plan, attack the center.' },
    { type: 'instruction', fen: FEN.dev_after_c5, text: 'c5 is still the right idea. Your bishop and pawn both target d4 no matter how White develops.', arrow: ['c7', 'c5'] },

    // White plays 8.Qd2
    { type: 'instruction', fen: FEN.dev_after_c5, text: 'White plays Qd2, connecting the rooks and eyeing a queenside castle.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 2: Qa5
    { type: 'play-move', fen: FEN.dev_after_Qd2, correctMove: 'Qa5', prompt: 'White\'s queen is on d2. How do you create counterplay?', hint: 'Activate the queen with a pin on the c3 pawn.', correctFeedback: 'Qa5 puts pressure on c3 and a2, creating immediate queenside threats.', wrongFeedback: 'Play Qa5 — it targets the weak c3 pawn and creates counterplay.' },
    { type: 'instruction', fen: FEN.dev_after_Qa5, text: 'Qa5 is aggressive. The queen eyes c3 and a2, and if White castles queenside the queen is already in position to cause trouble.', arrow: ['d8', 'a5'] },

    // White plays 9.Rc1
    { type: 'instruction', fen: FEN.dev_after_Qa5, text: 'White plays Rc1, defending the c-pawn.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },

    // PREDICT 3: cxd4
    { type: 'play-move', fen: FEN.dev_after_Rc1, correctMove: 'cxd4', prompt: 'The rook defends c3. How do you keep the pressure up?', hint: 'Open the center by capturing on d4.', correctFeedback: 'cxd4 opens the position. After cxd4, you can trade queens and play a comfortable endgame.', wrongFeedback: 'Take on d4 — open things up while the queen is active.' },
    { type: 'instruction', fen: FEN.dev_after_cxd4, text: 'cxd4 opens the center. The position simplifies, but your pieces are well-placed and the doubled c-pawns are gone for White.', arrow: ['c5', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bg7, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.dev_after_Be3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.dev_after_c5, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_after_Qd2, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.dev_after_Qa5, text: 'Rc1.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },
    { type: 'play-move', fen: FEN.dev_after_Rc1, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    { type: 'instruction', fen: FEN.dev_after_cxd4, text: "c5, Qa5, cxd4 — against 7.Be3, you still attack the center and create queenside counterplay." },
  ],
}


// ═══════════════════════════════════════════════════════════
// gr-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const GR_TEST_1: OpeningLesson = {
  id: 'gr-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (9 Black moves) ===
    { type: 'instruction', fen: FEN.after_d5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'Nxd5', prompt: 'Your move.', hint: 'Nxd5.', correctFeedback: 'Nxd5.', wrongFeedback: 'Nxd5.' },
    { type: 'instruction', fen: FEN.after_Nxd5, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },
    { type: 'instruction', fen: FEN.after_Nxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },
    { type: 'instruction', fen: FEN.after_Bg4, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Na5', prompt: 'Your move.', hint: 'Na5.', correctFeedback: 'Na5.', wrongFeedback: 'Na5.' },
    { type: 'instruction', fen: FEN.after_Na5, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['c4', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // === DEVIATION TEST: 7.Be3 ===
    { type: 'instruction', fen: FEN.after_Bg7, text: 'Now White plays Be3 instead.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.dev_after_Be3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.dev_after_c5, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_after_Qd2, correctMove: 'Qa5', prompt: 'Your move.', hint: 'Qa5.', correctFeedback: 'Qa5.', wrongFeedback: 'Qa5.' },
    { type: 'instruction', fen: FEN.dev_after_Qa5, text: 'Rc1.', autoAdvance: 800, highlightSquares: ['a1', 'c1'] },
    { type: 'play-move', fen: FEN.dev_after_Rc1, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const GRUNFELD_LESSONS: Record<string, OpeningLesson> = {
  'gr-1': GR_1,
  'gr-2': GR_2,
  'gr-3': GR_3,
  'gr-dev-Be3': GR_DEV_BE3,
  'gr-test-1': GR_TEST_1,
}

export function getGrunfeldLesson(id: string): OpeningLesson | undefined {
  return GRUNFELD_LESSONS[id]
}
