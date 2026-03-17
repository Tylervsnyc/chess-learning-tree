import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// CARO-KANN DEFENSE: ADVANCED VARIATION — Predict/Reveal
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7
//            6.O-O Ne7 7.Nbd2 h6 8.Nb3 g5 9.a4 Bg7
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:    'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_e5:    'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  after_Bf5:   'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4',
  after_Nf3:   'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4',
  after_e6:    'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5',
  after_Be2:   'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq - 1 5',
  after_Nd7:   'r2qkbnr/pp1n1ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R w KQkq - 2 6',
  after_OO:    'r2qkbnr/pp1n1ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 b kq - 3 6',
  after_Ne7:   'r2qkb1r/pp1nnppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 w kq - 4 7',
  after_Nbd2:  'r2qkb1r/pp1nnppp/2p1p3/3pPb2/3P4/5N2/PPPNBPPP/R1BQ1RK1 b kq - 5 7',
  after_h6:    'r2qkb1r/pp1nnpp1/2p1p2p/3pPb2/3P4/5N2/PPPNBPPP/R1BQ1RK1 w kq - 0 8',
  after_Nb3:   'r2qkb1r/pp1nnpp1/2p1p2p/3pPb2/3P4/1N3N2/PPP1BPPP/R1BQ1RK1 b kq - 1 8',
  after_g5:    'r2qkb1r/pp1nnp2/2p1p2p/3pPbp1/3P4/1N3N2/PPP1BPPP/R1BQ1RK1 w kq - 0 9',
  after_a4:    'r2qkb1r/pp1nnp2/2p1p2p/3pPbp1/P2P4/1N3N2/1PP1BPPP/R1BQ1RK1 b kq - 0 9',
  after_Bg7:   'r2qk2r/pp1nnpb1/2p1p2p/3pPbp1/P2P4/1N3N2/1PP1BPPP/R1BQ1RK1 w kq - 1 10',

  // Deviation 1: 3.Nc3 (Classical) — branches after 1.e4 c6 2.d4 d5
  // Black's 3 moves: dxe4, Bf5, Bg6
  dev1_after_Nc3:  'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3',
  dev1_after_dxe4: 'rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  dev1_after_Nxe4: 'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  dev1_after_Bf5:  'rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',
  dev1_after_Ng3:  'rn1qkbnr/pp2pppp/2p5/5b2/3P4/6N1/PPP2PPP/R1BQKBNR b KQkq - 2 5',
  dev1_after_Bg6:  'rn1qkbnr/pp2pppp/2p3b1/8/3P4/6N1/PPP2PPP/R1BQKBNR w KQkq - 3 6',
  dev1_after_h4:   'rn1qkbnr/pp2pppp/2p3b1/8/3P3P/6N1/PPP2PP1/R1BQKBNR b KQkq - 0 6',
  dev1_after_h6:   'rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/6N1/PPP2PP1/R1BQKBNR w KQkq - 0 7',

  // L2 Main line: continues from 9...Bg7
  after_h4:    'r2qk2r/pp1nnpb1/2p1p2p/3pPbp1/P2P3P/1N3N2/1PP1BPP1/R1BQ1RK1 b kq - 0 10',
  after_Ng6:   'r2qk2r/pp1n1pb1/2p1p1np/3pPbp1/P2P3P/1N3N2/1PP1BPP1/R1BQ1RK1 w kq - 1 11',
  after_Be3:   'r2qk2r/pp1n1pb1/2p1p1np/3pPbp1/P2P3P/1N2BN2/1PP1BPP1/R2Q1RK1 b kq - 2 11',
  after_Qe7:   'r3k2r/pp1nqpb1/2p1p1np/3pPbp1/P2P3P/1N2BN2/1PP1BPP1/R2Q1RK1 w kq - 3 12',
  after_Nfd2:  'r3k2r/pp1nqpb1/2p1p1np/3pPbp1/P2P3P/1N2B3/1PPNBPP1/R2Q1RK1 b kq - 4 12',
  after_OOO:   '2kr3r/pp1nqpb1/2p1p1np/3pPbp1/P2P3P/1N2B3/1PPNBPP1/R2Q1RK1 w - - 5 13',
  after_c4:    '2kr3r/pp1nqpb1/2p1p1np/3pPbp1/P1PP3P/1N2B3/1P1NBPP1/R2Q1RK1 b - - 0 13',
  after_Nf4:   '2kr3r/pp1nqpb1/2p1p2p/3pPbp1/P1PP1n1P/1N2B3/1P1NBPP1/R2Q1RK1 w - - 1 14',
  after_Bf3:   '2kr3r/pp1nqpb1/2p1p2p/3pPbp1/P1PP1n1P/1N2BB2/1P1N1PP1/R2Q1RK1 b - - 2 14',
  after_dxc4:  '2kr3r/pp1nqpb1/2p1p2p/4Pbp1/P1pP1n1P/1N2BB2/1P1N1PP1/R2Q1RK1 w - - 0 15',
  after_Nxc4:  '2kr3r/pp1nqpb1/2p1p2p/4Pbp1/P1NP1n1P/1N2BB2/1P3PP1/R2Q1RK1 b - - 0 15',
  after_Nd5:   '2kr3r/pp1nqpb1/2p1p2p/3nPbp1/P1NP3P/1N2BB2/1P3PP1/R2Q1RK1 w - - 1 16',

  // Deviation 3: 10.Bd3 — branches after 9...Bg7
  // Black's 3 moves: Bxd3, Nf5, O-O
  dev3_after_Bd3:  'r2qk2r/pp1nnpb1/2p1p2p/3pPbp1/P2P4/1N1B1N2/1PP2PPP/R1BQ1RK1 b kq - 2 10',
  dev3_after_Bxd3: 'r2qk2r/pp1nnpb1/2p1p2p/3pP1p1/P2P4/1N1b1N2/1PP2PPP/R1BQ1RK1 w kq - 0 11',
  dev3_after_Qxd3: 'r2qk2r/pp1nnpb1/2p1p2p/3pP1p1/P2P4/1N1Q1N2/1PP2PPP/R1B2RK1 b kq - 0 11',
  dev3_after_Nf5:  'r2qk2r/pp1n1pb1/2p1p2p/3pPnp1/P2P4/1N1Q1N2/1PP2PPP/R1B2RK1 w kq - 1 12',
  dev3_after_Qe2:  'r2qk2r/pp1n1pb1/2p1p2p/3pPnp1/P2P4/1N3N2/1PP1QPPP/R1B2RK1 b kq - 2 12',
  dev3_after_OO:   'r2q1rk1/pp1n1pb1/2p1p2p/3pPnp1/P2P4/1N3N2/1PP1QPPP/R1B2RK1 w - - 3 13',

  // Deviation 2: 7.Nh4 — branches after 1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7
  // Black's 3 moves: Qb6, Nxf5, Be7
  dev2_after_Nh4:  'r2qkb1r/pp1nnppp/2p1p3/3pPb2/3P3N/8/PPP1BPPP/RNBQ1RK1 b kq - 5 7',
  dev2_after_Qb6:  'r3kb1r/pp1nnppp/1qp1p3/3pPb2/3P3N/8/PPP1BPPP/RNBQ1RK1 w kq - 6 8',
  dev2_after_Nxf5: 'r3kb1r/pp1nnppp/1qp1p3/3pPN2/3P4/8/PPP1BPPP/RNBQ1RK1 b kq - 0 8',
  dev2_after_Nxf5b:'r3kb1r/pp1n1ppp/1qp1p3/3pPn2/3P4/8/PPP1BPPP/RNBQ1RK1 w kq - 0 9',
  dev2_after_c3:   'r3kb1r/pp1n1ppp/1qp1p3/3pPn2/3P4/2P5/PP2BPPP/RNBQ1RK1 b kq - 0 9',
  dev2_after_Be7:  'r3k2r/pp1nbppp/1qp1p3/3pPn2/3P4/2P5/PP2BPPP/RNBQ1RK1 w kq - 1 10',
}

// ═══════════════════════════════════════════════════════════
// ck-1: The Caro-Kann Wall (c6, d5, Bf5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const CK_LESSON_1: OpeningLesson = {
  id: 'ck-1',
  title: 'The Caro-Kann Wall',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.start, text: "The Caro-Kann is one of the most solid defenses against 1.e4. You'll build a wall with c6 and d5, then sneak the bishop out before locking it in." },

    // White plays 1.e4
    { type: 'instruction', fen: FEN.after_e4, text: "White plays e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 1: c6
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: "Start the Caro-Kann. What pawn do you push?", hint: "Push the c-pawn one square — it prepares d5.", correctFeedback: "c6 prepares d5 with pawn support.", wrongFeedback: "Play c6 — it supports d5 on the next move.", postMoveArrow: ['c6', 'd5'] },
    { type: 'instruction', fen: FEN.after_c6, text: "c6 doesn't look flashy, but it's the foundation. The c6 pawn supports d5 so you can challenge White's center safely.", arrow: ['c7', 'c6'] },

    // White plays 2.d4
    { type: 'instruction', fen: FEN.after_d4, text: "White plays d4, building a big center.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 2: d5
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: "Now challenge White's center. What's the move?", hint: "Push d5 — the whole point of c6.", correctFeedback: "d5 challenges e4 head-on, backed by the c6 pawn.", wrongFeedback: "Play d5 — challenge e4 while it's supported by c6.", postMoveArrow: ['d5', 'e4'] },
    { type: 'instruction', fen: FEN.after_d5, text: "d5 hits e4 directly. White has to decide what to do about the tension — and in this line, they push e5.", arrow: ['d7', 'd5'] },

    // White plays 3.e5
    { type: 'instruction', fen: FEN.after_e5, text: "White advances e5, gaining space.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },

    // PREDICT 3: Bf5
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: "The e-pawn advanced. Your light-squared bishop could get trapped behind your pawns. What do you do?", hint: "Develop the bishop to f5 before playing e6.", correctFeedback: "Bf5 gets the bishop out while it can still escape.", wrongFeedback: "Play Bf5 — once you play e6, this bishop is stuck forever.", postMoveArrow: ['f5', 'b1'] },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Bf5 is the key idea of the Caro-Kann. You develop the light-squared bishop BEFORE playing e6. In many e4 openings, this bishop gets stuck — not here.", arrow: ['c8', 'f5'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Time to prove it. Play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_e5, text: "e5.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Bf5, text: "c6, d5, Bf5 — the Caro-Kann wall is built and your bishop is free." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-2: Developing Behind the Wall (e6, Nd7, Ne7)
// ═══════════════════════════════════════════════════════════

const CK_LESSON_2: OpeningLesson = {
  id: 'ck-2',
  title: 'Developing Behind the Wall',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Bf5, text: "Your bishop is out. Now you'll develop the rest of your pieces behind the pawn wall — knights to d7 and e7, locked and loaded." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Show me you've got the first three moves down." },
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_e5, text: "e5.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },

    // White plays 4.Nf3
    { type: 'instruction', fen: FEN.after_Bf5, text: "White develops the knight to f3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 1: e6
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e6', prompt: "Your bishop is safe on f5. Now what pawn move solidifies your center?", hint: "Play e6 to lock down the d5 pawn.", correctFeedback: "e6 supports d5 and creates a solid pawn chain.", wrongFeedback: "Play e6 — your bishop is already out, so now you can safely close the diagonal.", postMoveArrow: ['e6', 'd5'] },
    { type: 'instruction', fen: FEN.after_e6, text: "e6 locks in the pawn chain. Normally this would trap the bishop, but you already got it out on the last move.", arrow: ['e7', 'e6'] },

    // White plays 5.Be2
    { type: 'instruction', fen: FEN.after_Be2, text: "White develops the bishop to e2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 2: Nd7
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nd7', prompt: "Time to develop a knight. Where does it go?", hint: "The knight goes to d7 — it can reroute to f8 or support e5 later.", correctFeedback: "Nd7 develops behind the pawn wall, keeping options open.", wrongFeedback: "Play Nd7 — it develops without blocking the c-file or the bishop.", postMoveArrow: ['d7', 'f8'] },
    { type: 'instruction', fen: FEN.after_Nd7, text: "Nd7 is flexible — the knight can go to f8, b6, or support a future c5 break.", arrow: ['b8', 'd7'] },

    // White plays 6.O-O
    { type: 'instruction', fen: FEN.after_OO, text: "White castles kingside.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 3: Ne7
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Ne7', prompt: "Your second knight needs to develop. Where should it go?", hint: "Ne7 — the knight heads for g6 or f5 later.", correctFeedback: "Ne7 develops the knight to a flexible square.", wrongFeedback: "Play Ne7 — from here the knight can jump to g6 or f5.", postMoveArrow: ['e7', 'g6'] },
    { type: 'instruction', fen: FEN.after_Ne7, text: "Ne7 keeps the knight out of the way and aims for g6 or f5. Both knights are developed behind the wall.", arrow: ['g8', 'e7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bf5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Nf3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Be2, text: "Be2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Ne7, text: "e6, Nd7, Ne7 — all your pieces are developed behind the wall, ready for the kingside expansion." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-3: The Kingside Expansion (h6, g5, Bg7)
// ═══════════════════════════════════════════════════════════

const CK_LESSON_3: OpeningLesson = {
  id: 'ck-3',
  title: 'The Kingside Expansion',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Ne7, text: "Your pieces are set up. Now it's time to expand on the kingside with h6, g5, and Bg7 — grabbing space and fianchettoing the dark-squared bishop." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_e5, text: "e5.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Nf3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Be2, text: "Be2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    // White plays 7.Nbd2
    { type: 'instruction', fen: FEN.after_Ne7, text: "White develops the knight to d2.", autoAdvance: 800, highlightSquares: ['b1', 'd2'] },

    // PREDICT 1: h6
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'h6', prompt: "You want to expand on the kingside. What preparatory move do you make?", hint: "Push h6 — it prepares g5.", correctFeedback: "h6 prepares the g5 push without allowing Ng5 tricks.", wrongFeedback: "Play h6 — it secures the g5 advance.", postMoveArrow: ['h6', 'g5'] },
    { type: 'instruction', fen: FEN.after_h6, text: "h6 is a useful waiting move that prepares g5. It also takes away the g5 square from White's pieces.", arrow: ['h7', 'h6'] },

    // White plays 8.Nb3
    { type: 'instruction', fen: FEN.after_Nb3, text: "White reroutes the knight to b3.", autoAdvance: 800, highlightSquares: ['d2', 'b3'] },

    // PREDICT 2: g5
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'g5', prompt: "The kingside is ready. What aggressive pawn push do you play?", hint: "Push g5 — grab space on the kingside.", correctFeedback: "g5 grabs space and prepares to fianchetto the bishop.", wrongFeedback: "Play g5 — it's time to expand.", postMoveArrow: ['g5', 'g4'] },
    { type: 'instruction', fen: FEN.after_g5, text: "g5 is a bold move. You're grabbing kingside space and creating a home for the dark-squared bishop on g7.", arrow: ['g7', 'g5'] },

    // White plays 9.a4
    { type: 'instruction', fen: FEN.after_a4, text: "White expands on the queenside with a4.", autoAdvance: 800, highlightSquares: ['a2', 'a4'] },

    // PREDICT 3: Bg7
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'Bg7', prompt: "Your dark-squared bishop needs a good diagonal. Where does it go?", hint: "Fianchetto — put the bishop on g7.", correctFeedback: "Bg7 fianchettoes the bishop on the long diagonal.", wrongFeedback: "Play Bg7 — the bishop belongs on the long diagonal.", postMoveArrow: ['g7', 'c3'] },
    { type: 'instruction', fen: FEN.after_Bg7, text: "Bg7 puts the bishop on the long diagonal, aiming at White's center. It also supports a future f6 break to challenge e5.", arrow: ['f8', 'g7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ne7, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Ne7, text: "Nbd2.", autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Nb3.", autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5.', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_a4, text: "a4.", autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Bg7, text: "h6, g5, Bg7 — the kingside expansion is complete. Your bishop is fianchettoed and you're ready to fight." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-dev-nc3: If 3.Nc3 (Classical — dxe4, Bf5, Bg6)
// Deviation: White plays 3.Nc3 instead of 3.e5
// ═══════════════════════════════════════════════════════════

const CK_DEV_NC3: OpeningLesson = {
  id: 'ck-dev-nc3',
  title: 'If 3.Nc3',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_d5, text: "Sometimes White plays 3.Nc3 instead of 3.e5. This is the Classical Caro-Kann. You'll capture, develop the bishop, and retreat it to safety." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_d5, text: "White plays Nc3 instead of e5 — the Classical Caro-Kann.", autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 1: dxe4
    { type: 'play-move', fen: FEN.dev1_after_Nc3, correctMove: 'dxe4', prompt: "White defended e4 with the knight. How do you respond?", hint: "Capture on e4 — trade the pawn.", correctFeedback: "dxe4 captures the central pawn. White will recapture with the knight.", wrongFeedback: "Take on e4 — exchange pawns in the center.", postMoveArrow: ['e4', 'c4'] },
    { type: 'instruction', fen: FEN.dev1_after_dxe4, text: "dxe4 opens the position. White recaptures with the knight, and now you have a clear plan.", arrow: ['d5', 'e4'] },

    // White plays Nxe4
    { type: 'instruction', fen: FEN.dev1_after_dxe4, text: "White recaptures: Nxe4.", autoAdvance: 800, highlightSquares: ['c3', 'e4'] },

    // PREDICT 2: Bf5
    { type: 'play-move', fen: FEN.dev1_after_Nxe4, correctMove: 'Bf5', prompt: "The knight is on e4. How do you attack it and develop at the same time?", hint: "Develop the bishop to f5 — hit the knight.", correctFeedback: "Bf5 attacks the knight on e4 and develops the bishop.", wrongFeedback: "Play Bf5 — attack the knight and get the bishop active.", postMoveArrow: ['f5', 'e4'] },
    { type: 'instruction', fen: FEN.dev1_after_Bf5, text: "Bf5 is the signature Caro-Kann move. The bishop attacks the knight and gets outside the pawn chain — same idea as the Advanced Variation.", arrow: ['c8', 'f5'] },

    // White plays Ng3
    { type: 'instruction', fen: FEN.dev1_after_Bf5, text: "White retreats the knight: Ng3.", autoAdvance: 800, highlightSquares: ['e4', 'g3'] },

    // PREDICT 3: Bg6
    { type: 'play-move', fen: FEN.dev1_after_Ng3, correctMove: 'Bg6', prompt: "The knight is chasing your bishop. Where does it retreat?", hint: "Bg6 — step back and stay on the diagonal.", correctFeedback: "Bg6 keeps the bishop active on the long diagonal.", wrongFeedback: "Play Bg6 — retreat to a safe square that stays on the h7-b1 diagonal.", postMoveArrow: ['g6', 'b1'] },
    { type: 'instruction', fen: FEN.dev1_after_Bg6, text: "Bg6 retreats the bishop to a safe square. It still eyes b1 and will be hard for White to dislodge.", arrow: ['f5', 'g6'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev1_after_Nc3, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev1_after_Nc3, correctMove: 'dxe4', prompt: 'Your move.', hint: 'dxe4.', correctFeedback: 'dxe4.', wrongFeedback: 'dxe4.' },
    { type: 'instruction', fen: FEN.dev1_after_dxe4, text: "Nxe4.", autoAdvance: 800, highlightSquares: ['c3', 'e4'] },
    { type: 'play-move', fen: FEN.dev1_after_Nxe4, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.dev1_after_Bf5, text: "Ng3.", autoAdvance: 800, highlightSquares: ['e4', 'g3'] },
    { type: 'play-move', fen: FEN.dev1_after_Ng3, correctMove: 'Bg6', prompt: 'Your move.', hint: 'Bg6.', correctFeedback: 'Bg6.', wrongFeedback: 'Bg6.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev1_after_Bg6, text: "Against 3.Nc3: dxe4, Bf5, Bg6. Same idea as always — get the bishop out and keep it safe." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-dev-nh4: If 7.Nh4 (Qb6, Nxf5, Be7)
// Deviation: White plays 7.Nh4 instead of 7.Nbd2
// ═══════════════════════════════════════════════════════════

const CK_DEV_NH4: OpeningLesson = {
  id: 'ck-dev-nh4',
  title: 'If 7.Nh4',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Ne7, text: "Sometimes White jumps Nh4, trying to trade off your good bishop. You'll counter with Qb6, recapture on f5, and keep developing." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_e5, text: "e5.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Nf3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Be2, text: "Be2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Ne7, text: "White plays Nh4 instead of Nbd2 — targeting your bishop on f5.", autoAdvance: 800, highlightSquares: ['f3', 'h4'] },

    // PREDICT 1: Qb6
    { type: 'play-move', fen: FEN.dev2_after_Nh4, correctMove: 'Qb6', prompt: "White's knight is threatening your bishop. How do you create a counter-threat?", hint: "Bring the queen to b6 — it attacks the d4 pawn.", correctFeedback: "Qb6 puts pressure on d4 while White is busy with the knight.", wrongFeedback: "Play Qb6 — attack d4 and make White think twice about Nxf5.", postMoveArrow: ['b6', 'd4'] },
    { type: 'instruction', fen: FEN.dev2_after_Qb6, text: "Qb6 attacks d4 and b2. White can take the bishop, but you'll recapture with the knight and the queen is already active.", arrow: ['d8', 'b6'] },

    // White plays Nxf5
    { type: 'instruction', fen: FEN.dev2_after_Qb6, text: "White captures: Nxf5.", autoAdvance: 800, highlightSquares: ['h4', 'f5'] },

    // PREDICT 2: Nxf5
    { type: 'play-move', fen: FEN.dev2_after_Nxf5, correctMove: 'Nxf5', prompt: "White took your bishop. Recapture.", hint: "Take back with the knight on e7.", correctFeedback: "Nxf5 recaptures and puts the knight on a strong central square.", wrongFeedback: "Recapture on f5 with the knight.", postMoveArrow: ['f5', 'd4'] },
    { type: 'instruction', fen: FEN.dev2_after_Nxf5b, text: "Nxf5 gives you a nicely placed knight. It eyes d4 and can't be easily challenged.", arrow: ['e7', 'f5'] },

    // White plays c3
    { type: 'instruction', fen: FEN.dev2_after_Nxf5b, text: "White shores up d4 with c3.", autoAdvance: 800, highlightSquares: ['c2', 'c3'] },

    // PREDICT 3: Be7
    { type: 'play-move', fen: FEN.dev2_after_c3, correctMove: 'Be7', prompt: "Keep developing. Where does the dark-squared bishop go?", hint: "Be7 — develop the bishop and prepare to castle.", correctFeedback: "Be7 develops the last minor piece and prepares castling.", wrongFeedback: "Play Be7 — develop and get ready to castle.", postMoveArrow: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.dev2_after_Be7, text: "Be7 completes minor piece development. You can castle next move and have a solid position.", arrow: ['f8', 'e7'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev2_after_Nh4, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.dev2_after_Nh4, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.dev2_after_Qb6, text: "Nxf5.", autoAdvance: 800, highlightSquares: ['h4', 'f5'] },
    { type: 'play-move', fen: FEN.dev2_after_Nxf5, correctMove: 'Nxf5', prompt: 'Your move.', hint: 'Nxf5.', correctFeedback: 'Nxf5.', wrongFeedback: 'Nxf5.' },
    { type: 'instruction', fen: FEN.dev2_after_Nxf5b, text: "c3.", autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.dev2_after_c3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev2_after_Be7, text: "Against 7.Nh4: Qb6, Nxf5, Be7. Counter-attack, recapture, and keep developing." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-test-1: Level Test (main line + deviations)
// ═══════════════════════════════════════════════════════════

const CK_TEST_1: OpeningLesson = {
  id: 'ck-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (9 Black moves) ===
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_e5, text: "e5.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Nf3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Be2, text: "Be2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },
    { type: 'instruction', fen: FEN.after_Ne7, text: "Nbd2.", autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Nb3.", autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5.', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_a4, text: "a4.", autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // === DEVIATION TEST: 3.Nc3 ===
    { type: 'instruction', fen: FEN.after_d5, text: "But wait — White plays Nc3 instead.", autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev1_after_Nc3, correctMove: 'dxe4', prompt: 'Your move.', hint: 'dxe4.', correctFeedback: 'dxe4.', wrongFeedback: 'dxe4.' },
    { type: 'instruction', fen: FEN.dev1_after_dxe4, text: "Nxe4.", autoAdvance: 800, highlightSquares: ['c3', 'e4'] },
    { type: 'play-move', fen: FEN.dev1_after_Nxe4, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.dev1_after_Bf5, text: "Ng3.", autoAdvance: 800, highlightSquares: ['e4', 'g3'] },
    { type: 'play-move', fen: FEN.dev1_after_Ng3, correctMove: 'Bg6', prompt: 'Your move.', hint: 'Bg6.', correctFeedback: 'Bg6.', wrongFeedback: 'Bg6.' },

    // === DEVIATION TEST: 7.Nh4 ===
    { type: 'instruction', fen: FEN.after_Ne7, text: "Now White plays Nh4 instead.", autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    { type: 'play-move', fen: FEN.dev2_after_Nh4, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.dev2_after_Qb6, text: "Nxf5.", autoAdvance: 800, highlightSquares: ['h4', 'f5'] },
    { type: 'play-move', fen: FEN.dev2_after_Nxf5, correctMove: 'Nxf5', prompt: 'Your move.', hint: 'Nxf5.', correctFeedback: 'Nxf5.', wrongFeedback: 'Nxf5.' },
    { type: 'instruction', fen: FEN.dev2_after_Nxf5b, text: "c3.", autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.dev2_after_c3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-4: Queenside Castle (Ng6, Qe7, O-O-O)
// ═══════════════════════════════════════════════════════════

const CK_LESSON_4: OpeningLesson = {
  id: 'ck-4',
  title: 'Queenside Castle',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Bg7, text: "Your pieces are developed and the kingside is expanded. Now it's time to improve the knight, connect the rooks, and castle queenside to safety." },

    // RECAP (all 9 previous Black moves)
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_e4, text: "e4.", autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_e5, text: "e5.", autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Nf3.", autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Be2, text: "Be2.", autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Ne7', prompt: 'Your move.', hint: 'Ne7.', correctFeedback: 'Ne7.', wrongFeedback: 'Ne7.' },
    { type: 'instruction', fen: FEN.after_Ne7, text: "Nbd2.", autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nbd2, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Nb3.", autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5.', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_a4, text: "a4.", autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7.', wrongFeedback: 'Bg7.' },

    // White plays 10.h4
    { type: 'instruction', fen: FEN.after_Bg7, text: "White challenges your kingside with h4.", autoAdvance: 800, highlightSquares: ['h2', 'h4'] },

    // PREDICT 1: Ng6
    { type: 'play-move', fen: FEN.after_h4, correctMove: 'Ng6', prompt: "White is pushing h4 at your g5 pawn. How do you defend it and improve a piece?", hint: "Move the knight from e7 to g6 — it defends g5 and eyes f4.", correctFeedback: "Ng6 defends the g5 pawn and brings the knight to a more active square.", wrongFeedback: "Play Ng6 — the knight defends g5 and aims for the f4 outpost." },
    { type: 'instruction', fen: FEN.after_Ng6, text: "Ng6 does double duty — it defends g5 and the knight now eyes the f4 square, which will be important later.", arrow: ['e7', 'g6'] },

    // White plays 11.Be3
    { type: 'instruction', fen: FEN.after_Be3, text: "White develops the bishop to e3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 2: Qe7
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Qe7', prompt: "You need to connect your rooks and prepare to castle. Where does the queen go?", hint: "Qe7 — it connects the rooks and prepares queenside castling.", correctFeedback: "Qe7 connects the rooks and clears the back rank for queenside castling.", wrongFeedback: "Play Qe7 — the queen connects the rooks and enables O-O-O." },
    { type: 'instruction', fen: FEN.after_Qe7, text: "Qe7 is a quiet but essential move. It links the rooks and prepares to castle queenside, where your king will be safe behind the pawns.", arrow: ['d8', 'e7'] },

    // White plays 12.Nfd2
    { type: 'instruction', fen: FEN.after_Nfd2, text: "White reroutes the knight: Nfd2.", autoAdvance: 800, highlightSquares: ['f3', 'd2'] },

    // PREDICT 3: O-O-O
    { type: 'play-move', fen: FEN.after_Nfd2, correctMove: 'O-O-O', prompt: "Your rooks are connected and the queenside is safe. What's the move?", hint: "Castle queenside — your king goes to safety and the rook activates.", correctFeedback: "O-O-O tucks the king away on the queenside and activates the rook.", wrongFeedback: "Castle queenside — O-O-O gets the king safe and the rook into the game." },
    { type: 'instruction', fen: FEN.after_OOO, text: "O-O-O is the payoff. Your king is safe on the queenside while your kingside pawns and pieces are free to attack.", arrow: ['e8', 'c8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bg7, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Bg7, text: "h4.", autoAdvance: 800, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.after_h4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Be3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Qe7', prompt: 'Your move.', hint: 'Qe7.', correctFeedback: 'Qe7.', wrongFeedback: 'Qe7.' },
    { type: 'instruction', fen: FEN.after_Nfd2, text: "Nfd2.", autoAdvance: 800, highlightSquares: ['f3', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nfd2, correctMove: 'O-O-O', prompt: 'Your move.', hint: 'O-O-O.', correctFeedback: 'O-O-O.', wrongFeedback: 'O-O-O.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_OOO, text: "Ng6, Qe7, O-O-O — your king is tucked away and the attack is ready to roll." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-5: The Knight Raid (Nf4, dxc4, Nd5)
// ═══════════════════════════════════════════════════════════

const CK_LESSON_5: OpeningLesson = {
  id: 'ck-5',
  title: 'The Knight Raid',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_OOO, text: "You've castled queenside. Now you'll use your knights aggressively — jump into f4, grab the c4 pawn, and plant a knight on d5." },

    // RECAP (ck-4 moves only — L1 moves are tested, just recap L2)
    { type: 'instruction', fen: FEN.after_Bg7, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bg7, text: "h4.", autoAdvance: 800, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.after_h4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Be3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Qe7', prompt: 'Your move.', hint: 'Qe7.', correctFeedback: 'Qe7.', wrongFeedback: 'Qe7.' },
    { type: 'instruction', fen: FEN.after_Nfd2, text: "Nfd2.", autoAdvance: 800, highlightSquares: ['f3', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nfd2, correctMove: 'O-O-O', prompt: 'Your move.', hint: 'O-O-O.', correctFeedback: 'O-O-O.', wrongFeedback: 'O-O-O.' },

    // White plays 13.c4
    { type: 'instruction', fen: FEN.after_OOO, text: "White strikes in the center with c4.", autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // PREDICT 1: Nf4
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf4', prompt: "White pushed c4. You have a knight on g6 that can jump to a powerful square. Where?", hint: "Jump the knight to f4 — it lands on a protected outpost.", correctFeedback: "Nf4 lands on a strong outpost, attacking the e2 bishop and eyeing d3.", wrongFeedback: "Play Nf4 — the knight jumps to a dominant square where it can't be kicked by pawns." },
    { type: 'instruction', fen: FEN.after_Nf4, text: "Nf4 is a dream square. The knight attacks the bishop on e2 and can't be pushed away by White's pawns. The g5 pawn protects it.", arrow: ['g6', 'f4'] },

    // White plays 14.Bf3
    { type: 'instruction', fen: FEN.after_Bf3, text: "White moves the bishop to f3.", autoAdvance: 800, highlightSquares: ['e2', 'f3'] },

    // PREDICT 2: dxc4
    { type: 'play-move', fen: FEN.after_Bf3, correctMove: 'dxc4', prompt: "White's bishop moved away. There's a free pawn to grab. What capture?", hint: "Take on c4 — grab the pawn.", correctFeedback: "dxc4 wins a pawn and opens lines toward White's king.", wrongFeedback: "Play dxc4 — capture the c4 pawn while you can." },
    { type: 'instruction', fen: FEN.after_dxc4, text: "dxc4 wins the pawn. White will recapture with the knight, but you'll get a centralized knight in return.", arrow: ['d5', 'c4'] },

    // White plays 15.Nxc4
    { type: 'instruction', fen: FEN.after_Nxc4, text: "White recaptures: Nxc4.", autoAdvance: 800, highlightSquares: ['b3', 'c4'] },

    // PREDICT 3: Nd5
    { type: 'play-move', fen: FEN.after_Nxc4, correctMove: 'Nd5', prompt: "Your knight on f4 can jump to the best square on the board. Where?", hint: "Nd5 — centralize the knight where it dominates.", correctFeedback: "Nd5 puts the knight on the most powerful central square.", wrongFeedback: "Play Nd5 — the knight belongs in the center, controlling everything." },
    { type: 'instruction', fen: FEN.after_Nd5, text: "Nd5 is a monster. The knight sits in the center, protected by e6 and c6, attacking e3 and threatening to come to f4 again. You have a great position.", arrow: ['f4', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_OOO, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_OOO, text: "c4.", autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf4', prompt: 'Your move.', hint: 'Nf4.', correctFeedback: 'Nf4.', wrongFeedback: 'Nf4.' },
    { type: 'instruction', fen: FEN.after_Bf3, text: "Bf3.", autoAdvance: 800, highlightSquares: ['e2', 'f3'] },
    { type: 'play-move', fen: FEN.after_Bf3, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4.', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.after_Nxc4, text: "Nxc4.", autoAdvance: 800, highlightSquares: ['b3', 'c4'] },
    { type: 'play-move', fen: FEN.after_Nxc4, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nd5, text: "Nf4, dxc4, Nd5 — the knight raid is complete. You have a centralized knight and a fantastic position." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-dev-bd3: If 10.Bd3 (Bxd3, Nf5, O-O)
// Deviation: White plays 10.Bd3 instead of 10.h4
// ═══════════════════════════════════════════════════════════

const CK_DEV_BD3: OpeningLesson = {
  id: 'ck-dev-bd3',
  title: 'If 10.Bd3',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Bg7, text: "Sometimes White plays Bd3, offering to trade bishops. You'll take the trade, improve your knight, and castle kingside instead." },

    // RECAP to deviation point (ck-4 moves lead here, but deviation is from 9...Bg7 so just recap L2 start)
    { type: 'instruction', fen: FEN.after_Bg7, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Bg7, text: "h4.", autoAdvance: 800, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.after_h4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Be3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Qe7', prompt: 'Your move.', hint: 'Qe7.', correctFeedback: 'Qe7.', wrongFeedback: 'Qe7.' },
    { type: 'instruction', fen: FEN.after_Nfd2, text: "Nfd2.", autoAdvance: 800, highlightSquares: ['f3', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nfd2, correctMove: 'O-O-O', prompt: 'Your move.', hint: 'O-O-O.', correctFeedback: 'O-O-O.', wrongFeedback: 'O-O-O.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Bg7, text: "White plays Bd3 instead of h4 — offering to trade your bishop.", autoAdvance: 800, highlightSquares: ['e2', 'd3'] },

    // PREDICT 1: Bxd3
    { type: 'play-move', fen: FEN.dev3_after_Bd3, correctMove: 'Bxd3', prompt: "White put the bishop on d3, challenging yours on f5. How do you respond?", hint: "Take the bishop — Bxd3.", correctFeedback: "Bxd3 trades bishops. You already got good use out of the light-squared bishop.", wrongFeedback: "Play Bxd3 — trading is fine since your bishop already did its job." },
    { type: 'instruction', fen: FEN.dev3_after_Bxd3, text: "Bxd3 is the clean answer. Your bishop already secured the f5 square and now the trade opens the d-file for your future use.", arrow: ['f5', 'd3'] },

    // White plays Qxd3
    { type: 'instruction', fen: FEN.dev3_after_Bxd3, text: "White recaptures: Qxd3.", autoAdvance: 800, highlightSquares: ['d1', 'd3'] },

    // PREDICT 2: Nf5
    { type: 'play-move', fen: FEN.dev3_after_Qxd3, correctMove: 'Nf5', prompt: "The bishop is gone and the f5 square is open. Which knight jumps there?", hint: "Nf5 — the knight takes over the bishop's old square.", correctFeedback: "Nf5 plants the knight on a strong central square, replacing the bishop.", wrongFeedback: "Play Nf5 — the knight takes over the outpost your bishop just left." },
    { type: 'instruction', fen: FEN.dev3_after_Nf5, text: "Nf5 is perfect. The knight replaces the bishop on the same strong square, and from f5 it pressures d4 and e3.", arrow: ['e7', 'f5'] },

    // White plays Qe2
    { type: 'instruction', fen: FEN.dev3_after_Nf5, text: "White retreats the queen: Qe2.", autoAdvance: 800, highlightSquares: ['d3', 'e2'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.dev3_after_Qe2, correctMove: 'O-O', prompt: "Your position is solid. What's the natural way to complete development?", hint: "Castle kingside — the king goes to safety.", correctFeedback: "O-O castles kingside. With the dark-squared bishop on g7, your king is well-protected.", wrongFeedback: "Play O-O — castle kingside and complete your development." },
    { type: 'instruction', fen: FEN.dev3_after_OO, text: "O-O gets the king safe. Without White's light-squared bishop, your kingside is solid and the knight on f5 keeps things under control.", arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev3_after_Bd3, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.dev3_after_Bd3, correctMove: 'Bxd3', prompt: 'Your move.', hint: 'Bxd3.', correctFeedback: 'Bxd3.', wrongFeedback: 'Bxd3.' },
    { type: 'instruction', fen: FEN.dev3_after_Bxd3, text: "Qxd3.", autoAdvance: 800, highlightSquares: ['d1', 'd3'] },
    { type: 'play-move', fen: FEN.dev3_after_Qxd3, correctMove: 'Nf5', prompt: 'Your move.', hint: 'Nf5.', correctFeedback: 'Nf5.', wrongFeedback: 'Nf5.' },
    { type: 'instruction', fen: FEN.dev3_after_Nf5, text: "Qe2.", autoAdvance: 800, highlightSquares: ['d3', 'e2'] },
    { type: 'play-move', fen: FEN.dev3_after_Qe2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev3_after_OO, text: "Against 10.Bd3: Bxd3, Nf5, O-O. Trade the bishop, improve the knight, and castle safely." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ck-test-2: Level 2 Test (main line + Bd3 deviation)
// ═══════════════════════════════════════════════════════════

const CK_TEST_2: OpeningLesson = {
  id: 'ck-test-2',
  title: 'Lvl 2 Test',
  defaultOrientation: 'black',
  steps: [
    // === L2 MAIN LINE (6 Black moves: Ng6, Qe7, O-O-O, Nf4, dxc4, Nd5) ===
    { type: 'instruction', fen: FEN.after_Bg7, text: "h4.", autoAdvance: 800, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.after_h4, correctMove: 'Ng6', prompt: 'Your move.', hint: 'Ng6.', correctFeedback: 'Ng6.', wrongFeedback: 'Ng6.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Be3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'Qe7', prompt: 'Your move.', hint: 'Qe7.', correctFeedback: 'Qe7.', wrongFeedback: 'Qe7.' },
    { type: 'instruction', fen: FEN.after_Nfd2, text: "Nfd2.", autoAdvance: 800, highlightSquares: ['f3', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nfd2, correctMove: 'O-O-O', prompt: 'Your move.', hint: 'O-O-O.', correctFeedback: 'O-O-O.', wrongFeedback: 'O-O-O.' },
    { type: 'instruction', fen: FEN.after_OOO, text: "c4.", autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Nf4', prompt: 'Your move.', hint: 'Nf4.', correctFeedback: 'Nf4.', wrongFeedback: 'Nf4.' },
    { type: 'instruction', fen: FEN.after_Bf3, text: "Bf3.", autoAdvance: 800, highlightSquares: ['e2', 'f3'] },
    { type: 'play-move', fen: FEN.after_Bf3, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4.', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.after_Nxc4, text: "Nxc4.", autoAdvance: 800, highlightSquares: ['b3', 'c4'] },
    { type: 'play-move', fen: FEN.after_Nxc4, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },

    // === DEVIATION TEST: 10.Bd3 ===
    { type: 'instruction', fen: FEN.after_Bg7, text: "But wait — White plays Bd3 instead.", autoAdvance: 800, highlightSquares: ['e2', 'd3'] },
    { type: 'play-move', fen: FEN.dev3_after_Bd3, correctMove: 'Bxd3', prompt: 'Your move.', hint: 'Bxd3.', correctFeedback: 'Bxd3.', wrongFeedback: 'Bxd3.' },
    { type: 'instruction', fen: FEN.dev3_after_Bxd3, text: "Qxd3.", autoAdvance: 800, highlightSquares: ['d1', 'd3'] },
    { type: 'play-move', fen: FEN.dev3_after_Qxd3, correctMove: 'Nf5', prompt: 'Your move.', hint: 'Nf5.', correctFeedback: 'Nf5.', wrongFeedback: 'Nf5.' },
    { type: 'instruction', fen: FEN.dev3_after_Nf5, text: "Qe2.", autoAdvance: 800, highlightSquares: ['d3', 'e2'] },
    { type: 'play-move', fen: FEN.dev3_after_Qe2, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

const CARO_KANN_LESSONS: Record<string, OpeningLesson> = {
  'ck-1': CK_LESSON_1,
  'ck-2': CK_LESSON_2,
  'ck-3': CK_LESSON_3,
  'ck-dev-nc3': CK_DEV_NC3,
  'ck-dev-nh4': CK_DEV_NH4,
  'ck-test-1': CK_TEST_1,
  'ck-4': CK_LESSON_4,
  'ck-5': CK_LESSON_5,
  'ck-dev-bd3': CK_DEV_BD3,
  'ck-test-2': CK_TEST_2,
}

export function getCaroKannLesson(id: string): OpeningLesson | undefined {
  return CARO_KANN_LESSONS[id]
}
