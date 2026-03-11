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
// EXPORT ALL LESSONS
// ═══════════════════════════════════════════════════════════

const CARO_KANN_LESSONS: Record<string, OpeningLesson> = {
  'ck-1': CK_LESSON_1,
  'ck-2': CK_LESSON_2,
  'ck-3': CK_LESSON_3,
  'ck-dev-nc3': CK_DEV_NC3,
  'ck-dev-nh4': CK_DEV_NH4,
  'ck-test-1': CK_TEST_1,
}

export function getCaroKannLesson(id: string): OpeningLesson | undefined {
  return CARO_KANN_LESSONS[id]
}
