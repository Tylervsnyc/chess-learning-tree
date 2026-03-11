import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SLAV DEFENSE LESSONS (sl-1 through sl-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs computed and validated with chess.js.
// Main line: 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.Bg5 h6
//            6.Bh4 dxc4 7.e4 g5 8.Bg3 b5 9.Be2 Bb7 10.O-O Nbd7 11.Ne5 Bg7
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity positions
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:         'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_d5:         'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  after_c4:         'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_c6:         'rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',

  // Main line
  after_Nf3:        'rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3',
  after_Nf6:        'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4',
  after_Nc3:        'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4',
  after_e6:         'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5',
  after_Bg5:        'rnbqkb1r/pp3ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 5',
  after_h6:         'rnbqkb1r/pp3pp1/2p1pn1p/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R w KQkq - 0 6',
  after_Bh4:        'rnbqkb1r/pp3pp1/2p1pn1p/3p4/2PP3B/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 6',
  after_dxc4:       'rnbqkb1r/pp3pp1/2p1pn1p/8/2pP3B/2N2N2/PP2PPPP/R2QKB1R w KQkq - 0 7',
  after_e4:         'rnbqkb1r/pp3pp1/2p1pn1p/8/2pPP2B/2N2N2/PP3PPP/R2QKB1R b KQkq - 0 7',
  after_g5:         'rnbqkb1r/pp3p2/2p1pn1p/6p1/2pPP2B/2N2N2/PP3PPP/R2QKB1R w KQkq - 0 8',
  after_Bg3:        'rnbqkb1r/pp3p2/2p1pn1p/6p1/2pPP3/2N2NB1/PP3PPP/R2QKB1R b KQkq - 1 8',
  after_b5:         'rnbqkb1r/p4p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP3PPP/R2QKB1R w KQkq - 0 9',
  after_Be2:        'rnbqkb1r/p4p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2QK2R b KQkq - 1 9',
  after_Bb7:        'rn1qkb1r/pb3p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2QK2R w KQkq - 2 10',
  after_OO:         'rn1qkb1r/pb3p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2Q1RK1 b kq - 3 10',
  after_Nbd7:       'r2qkb1r/pb1n1p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2Q1RK1 w kq - 4 11',
  after_Ne5:        'r2qkb1r/pb1n1p2/2p1pn1p/1p2N1p1/2pPP3/2N3B1/PP2BPPP/R2Q1RK1 b kq - 5 11',
  after_Bg7:        'r2qk2r/pb1n1pb1/2p1pn1p/1p2N1p1/2pPP3/2N3B1/PP2BPPP/R2Q1RK1 w kq - 6 12',

  // Deviation: 4.e3 (instead of 4.Nc3) — after 3.Nf3 Nf6
  dev_e3_after_e3:     'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R b KQkq - 0 4',
  dev_e3_after_Bf5:    'rn1qkb1r/pp2pppp/2p2n2/3p1b2/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5',
  dev_e3_after_Nc3:    'rn1qkb1r/pp2pppp/2p2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq - 2 5',
  dev_e3_after_e6:     'rn1qkb1r/pp3ppp/2p1pn2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6',
  dev_e3_after_Nh4:    'rn1qkb1r/pp3ppp/2p1pn2/3p1b2/2PP3N/2N1P3/PP3PPP/R1BQKB1R b KQkq - 1 6',
  dev_e3_after_Bg6:    'rn1qkb1r/pp3ppp/2p1pnb1/3p4/2PP3N/2N1P3/PP3PPP/R1BQKB1R w KQkq - 2 7',
  dev_e3_after_Nxg6:   'rn1qkb1r/pp3ppp/2p1pnN1/3p4/2PP4/2N1P3/PP3PPP/R1BQKB1R b KQkq - 0 7',
  dev_e3_after_hxg6:   'rn1qkb1r/pp3pp1/2p1pnp1/3p4/2PP4/2N1P3/PP3PPP/R1BQKB1R w KQkq - 0 8',

  // Deviation: 3.Nc3 (instead of 3.Nf3) — after 1.d4 d5 2.c4 c6
  dev_Nc3_after_Nc3:   'rnbqkbnr/pp2pppp/2p5/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  dev_Nc3_after_Nf6:   'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
  dev_Nc3_after_e3:    'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N1P3/PP3PPP/R1BQKBNR b KQkq - 0 4',
  dev_Nc3_after_e6:    'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 5',
  dev_Nc3_after_Nf3:   'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq - 1 5',
  dev_Nc3_after_Nbd7:  'r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 2 6',
}


// ═══════════════════════════════════════════════════════════
// sl-1: THE SETUP (3.Nf3 Nf6, 4.Nc3 e6, 5.Bg5 h6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SL_1: OpeningLesson = {
  id: 'sl-1',
  title: 'The Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Welcome to the Slav Defense. You've played 1...d5 and 2...c6 — now it's time to develop your pieces and enter the Semi-Slav.",
    },

    // ── PREDICT/REVEAL 1: 3.Nf3 Nf6 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'White just developed a knight. How should you respond?',
      hint: 'Mirror the development — bring your knight to a natural square.',
      correctFeedback: 'Nf6! Your knight develops to its best square, controlling d5 and e4.',
      wrongFeedback: 'Develop your knight to f6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6 develops the knight to its ideal square, defending d5 and attacking e4.',
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: 4.Nc3 e6 ──
    { type: 'instruction', fen: FEN.after_Nc3, text: 'White brings out the other knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'White is building pressure on d5. How do you reinforce your center?',
      hint: 'Support d5 with a pawn move that also opens a diagonal for your bishop.',
      correctFeedback: 'e6! This enters the Semi-Slav — d5 is rock-solid and your dark-squared bishop can develop.',
      wrongFeedback: 'Play e6 to reinforce d5 and enter the Semi-Slav.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: 'e6 locks down d5 and opens the f8-a3 diagonal for your bishop. This is the Semi-Slav structure.',
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: 5.Bg5 h6 ──
    { type: 'instruction', fen: FEN.after_Bg5, text: 'White pins your knight with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: "White's bishop is pinning your knight. What do you do about it?",
      hint: 'Ask the bishop a question — force it to make a decision.',
      correctFeedback: 'h6! You challenge the bishop immediately. It must retreat or commit to the pin.',
      wrongFeedback: 'Play h6 to challenge the bishop on g5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 forces White's bishop to decide. If it retreats to h4, you'll grab the c4 pawn next — that's the Anti-Moscow Gambit.",
      arrow: ['h7', 'h6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Now play it from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The Semi-Slav is set up. Next lesson: grab the c4 pawn and launch the Anti-Moscow Gambit.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-2: THE GAMBIT (6.Bh4 dxc4, 7.e4 g5, 8.Bg3 b5)
// ═══════════════════════════════════════════════════════════

const SL_2: OpeningLesson = {
  id: 'sl-2',
  title: 'The Gambit',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The bishop retreated to h4. Time to grab the c4 pawn and launch the Anti-Moscow Gambit.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Quick review before the new stuff.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6!',
      wrongFeedback: 'h6.',
    },

    // ── PREDICT/REVEAL 1: 6.Bh4 dxc4 ──
    { type: 'instruction', fen: FEN.after_Bh4, text: 'The bishop retreats to h4, maintaining the pin.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: "The bishop moved. What's your chance here?",
      hint: "There's a free pawn on c4 — grab it while White is busy with the bishop.",
      correctFeedback: "dxc4! You grab the pawn. White can't easily recapture, and you're up material.",
      wrongFeedback: 'Capture the pawn on c4 with dxc4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxc4,
      text: "dxc4 grabs a pawn. White will push e4 to seize the center, but you'll strike back with g5.",
      arrow: ['d5', 'c4'],
    },

    // ── PREDICT/REVEAL 2: 7.e4 g5 ──
    { type: 'instruction', fen: FEN.after_e4, text: 'White pushes e4, taking the center.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: "White grabbed the center with e4. How do you fight back?",
      hint: 'Attack the bishop on h4 — push the g-pawn to chase it away.',
      correctFeedback: "g5! This is the Anti-Moscow Gambit. You attack the bishop and gain space on the kingside.",
      wrongFeedback: 'Push g5 to attack the bishop and gain kingside space.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g5,
      text: "g5 attacks the bishop and grabs space. The bishop has to retreat to g3, and you'll expand with b5 next.",
      arrow: ['g7', 'g5'],
    },

    // ── PREDICT/REVEAL 3: 8.Bg3 b5 ──
    { type: 'instruction', fen: FEN.after_Bg3, text: 'The bishop retreats to g3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: "The bishop is pushed back. Now protect your extra pawn.",
      hint: 'Defend the c4 pawn with b5 — and gain queenside space.',
      correctFeedback: "b5! You protect the c4 pawn and gain queenside space. The extra pawn is secure.",
      wrongFeedback: 'Play b5 to defend c4 and expand on the queenside.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "b5 defends the c4 pawn and opens the b7 diagonal for your bishop. You're up a pawn with active play.",
      arrow: ['b7', 'b5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Show me you've got this.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "The Anti-Moscow Gambit is rolling. Next up: develop your pieces and consolidate the advantage.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-3: DEVELOPMENT (9.Be2 Bb7, 10.O-O Nbd7, 11.Ne5 Bg7)
// ═══════════════════════════════════════════════════════════

const SL_3: OpeningLesson = {
  id: 'sl-3',
  title: 'Development',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "You're up a pawn with an active position. Time to develop your remaining pieces.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Prove you know these moves!",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6!',
      wrongFeedback: 'h6.',
    },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5!',
      wrongFeedback: 'g5.',
    },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5!',
      wrongFeedback: 'b5.',
    },

    // ── PREDICT/REVEAL 1: 9.Be2 Bb7 ──
    { type: 'instruction', fen: FEN.after_Be2, text: 'White develops the bishop to e2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bb7',
      prompt: "White is developing. Where does your light-squared bishop belong?",
      hint: "Put it on the long diagonal where it's a monster.",
      correctFeedback: "Bb7! The bishop fires down the a8-h1 diagonal, putting pressure on e4.",
      wrongFeedback: 'Develop the bishop to b7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb7,
      text: 'Bb7 activates the bishop on the long diagonal. It pressures e4 and supports a future c5 break.',
      arrow: ['c8', 'b7'],
    },

    // ── PREDICT/REVEAL 2: 10.O-O Nbd7 ──
    { type: 'instruction', fen: FEN.after_OO, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Nbd7',
      prompt: 'White has castled. How do you continue developing?',
      hint: 'Bring your other knight into the game — it supports both e5 and c5 ideas.',
      correctFeedback: "Nbd7! The knight develops naturally, supporting c5 and e5 breaks.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: 'Nbd7 is flexible. The knight supports a future c5 push and can reroute to better squares.',
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 3: 11.Ne5 Bg7 ──
    { type: 'instruction', fen: FEN.after_Ne5, text: 'White plants the knight on e5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne5,
      correctMove: 'Bg7',
      prompt: "White's knight jumped to e5. How do you continue development?",
      hint: 'Fianchetto the dark-squared bishop — it controls the long diagonal.',
      correctFeedback: "Bg7! The bishop fianchettoes to g7, controlling the long diagonal and supporting kingside defense.",
      wrongFeedback: 'Fianchetto with Bg7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Bg7 completes the fianchetto. The bishop guards the kingside and eyes White's center. Your position is solid.",
      arrow: ['f8', 'g7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "Now from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bb7',
      prompt: 'Your move.',
      hint: 'Bb7.',
      correctFeedback: 'Bb7.',
      wrongFeedback: 'Bb7.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne5,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The Slav main line is complete. You know the full Anti-Moscow Gambit setup.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-e3: DEVIATION 4.e3 (instead of 4.Nc3)
// After 3.Nf3 Nf6, White plays 4.e3 instead of 4.Nc3
// Black responds: 4...Bf5, 5...e6, 6...Bg6
// ═══════════════════════════════════════════════════════════

const SL_DEV_E3: OpeningLesson = {
  id: 'sl-dev-e3',
  title: 'Dev 4.e3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Sometimes White plays 4.e3 instead of 4.Nc3. This is quieter — and it gives you a chance to develop your bishop to f5 before it gets locked behind the e6 pawn.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Let's see what you remember!",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_e3_after_e3, text: 'White plays 4.e3 instead of 4.Nc3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },

    // ── PREDICT/REVEAL 1: 4...Bf5 ──
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_e3,
      correctMove: 'Bf5',
      prompt: "White played e3 — a quiet move. What's your best response?",
      hint: "Develop the light-squared bishop NOW, before e6 blocks it in.",
      correctFeedback: "Bf5! This is the key idea. Get the bishop out before playing e6.",
      wrongFeedback: 'Play Bf5 to develop the bishop before it gets locked in.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_Bf5,
      text: "Bf5 is the whole point. In the main line with 4.Nc3, you play e6 first and the bishop stays stuck. Here, it gets out early.",
      arrow: ['c8', 'f5'],
    },

    // ── PREDICT/REVEAL 2: 5.Nc3 e6 ──
    { type: 'instruction', fen: FEN.dev_e3_after_Nc3, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nc3,
      correctMove: 'e6',
      prompt: 'Your bishop is safely on f5. Now what?',
      hint: 'Reinforce the center — the same move as the main line, but with your bishop already out.',
      correctFeedback: "e6! Now you have the best of both worlds — solid center and an active bishop.",
      wrongFeedback: 'Play e6 to reinforce d5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_e6,
      text: "e6 gives you the classic Semi-Slav pawn structure, but with your bishop already active on f5. A great version for Black.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: 6.Nh4 Bg6 ──
    { type: 'instruction', fen: FEN.dev_e3_after_Nh4, text: 'White attacks your bishop with Nh4.', autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nh4,
      correctMove: 'Bg6',
      prompt: "The knight is attacking your bishop. Where should it go?",
      hint: 'Retreat to g6 — the bishop stays active and the knight is offside on h4.',
      correctFeedback: "Bg6! The bishop retreats but stays active. White's knight is stuck on the rim on h4.",
      wrongFeedback: 'Retreat the bishop to g6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_Bg6,
      text: "Bg6 keeps the bishop active. White will likely trade with Nxg6, opening the h-file for your rook. You're doing great.",
      arrow: ['f5', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_e3,
      text: "White played 4.e3. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_e3,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nh4, text: 'Nh4.', autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nh4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_Bg6,
      text: "When White plays 4.e3, you get the bishop out to f5 first. That's the key difference.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-Nc3: DEVIATION 3.Nc3 (instead of 3.Nf3)
// After 1.d4 d5 2.c4 c6, White plays 3.Nc3 instead of 3.Nf3
// Black responds: 3...Nf6, 4...e6, 5...Nbd7 (Meran setup)
// ═══════════════════════════════════════════════════════════

const SL_DEV_NC3: OpeningLesson = {
  id: 'sl-dev-Nc3',
  title: 'Dev 3.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Sometimes White plays 3.Nc3 instead of 3.Nf3. The plan is the same — develop naturally and enter the Meran setup.",
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nc3, text: 'White plays 3.Nc3 instead of 3.Nf3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // ── PREDICT/REVEAL 1: 3...Nf6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'Nf6',
      prompt: "White developed to c3 first. What's your response?",
      hint: 'Same idea as the main line — develop your knight.',
      correctFeedback: 'Nf6! Same natural development. The knight goes to f6 regardless of which knight White develops first.',
      wrongFeedback: 'Develop the knight to f6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nf6,
      text: 'Nf6 is the right response no matter what order White develops the knights.',
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: 4.e3 e6 ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_e3, text: 'White plays e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e3,
      correctMove: 'e6',
      prompt: 'White solidified the center with e3. What do you play?',
      hint: 'Reinforce d5 and open a line for your dark-squared bishop.',
      correctFeedback: "e6! Solid center support. You're heading into a classical Meran structure.",
      wrongFeedback: 'Play e6 to support d5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_e6,
      text: 'e6 enters the Meran structure. The plan is Nbd7, Bd6, and eventually break with dxc4 and c5.',
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: 5.Nf3 Nbd7 ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nf3, text: 'White develops the other knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nf3,
      correctMove: 'Nbd7',
      prompt: "White's development is nearly complete. How do you keep up?",
      hint: 'Develop your queenside knight to a flexible square.',
      correctFeedback: "Nbd7! The knight goes to d7 where it supports both c5 and e5 breaks.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nbd7,
      text: "Nbd7 is the Meran move. From d7, the knight supports c5 and can reroute to b6 or f8. You're in a standard position.",
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "White played 3.Nc3. Show me the Meran setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nf3,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nbd7,
      text: "When White plays 3.Nc3 first, you end up in the same solid Meran structure. No surprises.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const SL_TEST_1: OpeningLesson = {
  id: 'sl-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Time to prove you know the Slav Defense. Play the full main line from memory.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bb7',
      prompt: 'Your move.',
      hint: 'Bb7.',
      correctFeedback: 'Bb7.',
      wrongFeedback: 'Bb7.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne5,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Main line done. Now handle the deviations.",
    },

    // Deviation 1: 4.e3
    { type: 'instruction', fen: FEN.dev_e3_after_e3, text: "White plays 4.e3 instead of 4.Nc3.", autoAdvance: 1200, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_e3,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nh4, text: 'Nh4.', autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nh4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // Deviation 2: 3.Nc3
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nc3, text: "White plays 3.Nc3 instead of 3.Nf3.", autoAdvance: 1200, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nf3,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SLAV_LESSONS: Record<string, OpeningLesson> = {
  'sl-1': SL_1,
  'sl-2': SL_2,
  'sl-3': SL_3,
  'sl-dev-e3': SL_DEV_E3,
  'sl-dev-Nc3': SL_DEV_NC3,
  'sl-test-1': SL_TEST_1,
}

export function getSlavLesson(id: string): OpeningLesson | undefined {
  return SLAV_LESSONS[id]
}
