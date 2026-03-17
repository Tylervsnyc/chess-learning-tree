import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN ALAPIN LESSONS (sl-1 through sl-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 c5 2.c3
// Main line: 2...Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6 6.cxd4 d6
//            7.Bc4 Nb6 8.Bb5 dxe5 9.Nxe5 Bd7 10.Nxd7 Qxd7
//            11.Nc3 e6 12.O-O Be7 13.Qg4 O-O
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 1.e4 c5 2.c3)
  start:           'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_c3:        'rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 2',

  // Main line
  after_Nf6:       'rnbqkb1r/pp1ppppp/5n2/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq - 1 3',
  after_e5:        'rnbqkb1r/pp1ppppp/5n2/2p1P3/8/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 3',
  after_Nd5:       'rnbqkb1r/pp1ppppp/8/2pnP3/8/2P5/PP1P1PPP/RNBQKBNR w KQkq - 1 4',
  after_d4:        'rnbqkb1r/pp1ppppp/8/2pnP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4',
  after_cxd4:      'rnbqkb1r/pp1ppppp/8/3nP3/3p4/2P5/PP3PPP/RNBQKBNR w KQkq - 0 5',
  after_Nf3:       'rnbqkb1r/pp1ppppp/8/3nP3/3p4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 5',
  after_Nc6:       'r1bqkb1r/pp1ppppp/2n5/3nP3/3p4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 2 6',
  after_cxd4_w:    'r1bqkb1r/pp1ppppp/2n5/3nP3/3P4/5N2/PP3PPP/RNBQKB1R b KQkq - 0 6',
  after_d6:        'r1bqkb1r/pp2pppp/2np4/3nP3/3P4/5N2/PP3PPP/RNBQKB1R w KQkq - 0 7',
  after_Bc4:       'r1bqkb1r/pp2pppp/2np4/3nP3/2BP4/5N2/PP3PPP/RNBQK2R b KQkq - 1 7',
  after_Nb6:       'r1bqkb1r/pp2pppp/1nnp4/4P3/2BP4/5N2/PP3PPP/RNBQK2R w KQkq - 2 8',
  after_Bb5:       'r1bqkb1r/pp2pppp/1nnp4/1B2P3/3P4/5N2/PP3PPP/RNBQK2R b KQkq - 3 8',
  after_dxe5:      'r1bqkb1r/pp2pppp/1nn5/1B2p3/3P4/5N2/PP3PPP/RNBQK2R w KQkq - 0 9',
  after_Nxe5:      'r1bqkb1r/pp2pppp/1nn5/1B2N3/3P4/8/PP3PPP/RNBQK2R b KQkq - 0 9',
  after_Bd7:       'r2qkb1r/pp1bpppp/1nn5/1B2N3/3P4/8/PP3PPP/RNBQK2R w KQkq - 1 10',
  after_Nxd7:      'r2qkb1r/pp1Npppp/1nn5/1B6/3P4/8/PP3PPP/RNBQK2R b KQkq - 0 10',
  after_Qxd7:      'r3kb1r/pp1qpppp/1nn5/1B6/3P4/8/PP3PPP/RNBQK2R w KQkq - 0 11',
  after_Nc3:       'r3kb1r/pp1qpppp/1nn5/1B6/3P4/2N5/PP3PPP/R1BQK2R b KQkq - 1 11',
  after_e6:        'r3kb1r/pp1q1ppp/1nn1p3/1B6/3P4/2N5/PP3PPP/R1BQK2R w KQkq - 0 12',
  after_OO_w:      'r3kb1r/pp1q1ppp/1nn1p3/1B6/3P4/2N5/PP3PPP/R1BQ1RK1 b kq - 1 12',
  after_Be7:       'r3k2r/pp1qbppp/1nn1p3/1B6/3P4/2N5/PP3PPP/R1BQ1RK1 w kq - 2 13',
  after_Qg4:       'r3k2r/pp1qbppp/1nn1p3/1B6/3P2Q1/2N5/PP3PPP/R1B2RK1 b kq - 3 13',
  after_OO:        'r4rk1/pp1qbppp/1nn1p3/1B6/3P2Q1/2N5/PP3PPP/R1B2RK1 w - - 4 14',

  // Level 2 main line (after 13...O-O)
  after_Bxc6:      'r4rk1/pp1qbppp/1nB1p3/8/3P2Q1/2N5/PP3PPP/R1B2RK1 b - - 0 14',
  after_bxc6:      'r4rk1/p2qbppp/1np1p3/8/3P2Q1/2N5/PP3PPP/R1B2RK1 w - - 0 15',
  after_Bh6:       'r4rk1/p2qbppp/1np1p2B/8/3P2Q1/2N5/PP3PPP/R4RK1 b - - 1 15',
  after_Bf6:       'r4rk1/p2q1ppp/1np1pb1B/8/3P2Q1/2N5/PP3PPP/R4RK1 w - - 2 16',
  after_Rfd1:      'r4rk1/p2q1ppp/1np1pb1B/8/3P2Q1/2N5/PP3PPP/R2R2K1 b - - 3 16',
  after_Kh8:       'r4r1k/p2q1ppp/1np1pb1B/8/3P2Q1/2N5/PP3PPP/R2R2K1 w - - 4 17',

  // Deviation: 5.Qxd4 (instead of 5.Nf3) — after 4...cxd4
  dev_Qxd4_after_Qxd4: 'rnbqkb1r/pp1ppppp/8/3nP3/3Q4/2P5/PP3PPP/RNB1KBNR b KQkq - 0 5',
  dev_Qxd4_after_e6:   'rnbqkb1r/pp1p1ppp/4p3/3nP3/3Q4/2P5/PP3PPP/RNB1KBNR w KQkq - 0 6',
  dev_Qxd4_after_Nf3:  'rnbqkb1r/pp1p1ppp/4p3/3nP3/3Q4/2P2N2/PP3PPP/RNB1KB1R b KQkq - 1 6',
  dev_Qxd4_after_Nc6:  'r1bqkb1r/pp1p1ppp/2n1p3/3nP3/3Q4/2P2N2/PP3PPP/RNB1KB1R w KQkq - 2 7',
  dev_Qxd4_after_Qe4:  'r1bqkb1r/pp1p1ppp/2n1p3/3nP3/4Q3/2P2N2/PP3PPP/RNB1KB1R b KQkq - 3 7',
  dev_Qxd4_after_f5:   'r1bqkb1r/pp1p2pp/2n1p3/3nPp2/4Q3/2P2N2/PP3PPP/RNB1KB1R w KQkq f6 0 8',

  // Deviation: 4.Bc4 (instead of 4.d4) — after 3...Nd5
  dev_Bc4_after_Bc4:   'rnbqkb1r/pp1ppppp/8/2pnP3/2B5/2P5/PP1P1PPP/RNBQK1NR b KQkq - 2 4',
  dev_Bc4_after_Nb6:   'rnbqkb1r/pp1ppppp/1n6/2p1P3/2B5/2P5/PP1P1PPP/RNBQK1NR w KQkq - 3 5',
  dev_Bc4_after_Bb3:   'rnbqkb1r/pp1ppppp/1n6/2p1P3/8/1BP5/PP1P1PPP/RNBQK1NR b KQkq - 4 5',
  dev_Bc4_after_c4:    'rnbqkb1r/pp1ppppp/1n6/4P3/2p5/1BP5/PP1P1PPP/RNBQK1NR w KQkq - 0 6',
  dev_Bc4_after_Bc2:   'rnbqkb1r/pp1ppppp/1n6/4P3/2p5/2P5/PPBP1PPP/RNBQK1NR b KQkq - 1 6',
  dev_Bc4_after_Nc6:   'r1bqkb1r/pp1ppppp/1nn5/4P3/2p5/2P5/PPBP1PPP/RNBQK1NR w KQkq - 2 7',

  // Deviation: 8.Bb3 (instead of 8.Bb5)
  dev_after_Bb3:   'r1bqkb1r/pp2pppp/1nnp4/4P3/3P4/1B3N2/PP3PPP/RNBQK2R b KQkq - 3 8',
  dev_after_dxe5:  'r1bqkb1r/pp2pppp/1nn5/4p3/3P4/1B3N2/PP3PPP/RNBQK2R w KQkq - 0 9',
  dev_after_d5:    'r1bqkb1r/pp2pppp/1nn5/3Pp3/8/1B3N2/PP3PPP/RNBQK2R b KQkq - 0 9',
  dev_after_Na5:   'r1bqkb1r/pp2pppp/1n6/n2Pp3/8/1B3N2/PP3PPP/RNBQK2R w KQkq - 1 10',
  dev_after_Nc3:   'r1bqkb1r/pp2pppp/1n6/n2Pp3/8/1BN2N2/PP3PPP/R1BQK2R b KQkq - 2 10',
  dev_after_Nxb3:  'r1bqkb1r/pp2pppp/1n6/3Pp3/8/1nN2N2/PP3PPP/R1BQK2R w KQkq - 0 11',
  dev_after_axb3:  'r1bqkb1r/pp2pppp/1n6/3Pp3/8/1PN2N2/1P3PPP/R1BQK2R b KQkq - 0 11',
}


// ═══════════════════════════════════════════════════════════
// sl-1: Counter the Alapin (Nf6, Nd5, cxd4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SL_1: OpeningLesson = {
  id: 'sl-1',
  title: 'Counter the Alapin',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_c3, text: "White plays 2.c3, the Alapin Variation. Instead of entering the Open Sicilian, White wants to build a big pawn center with d4. You'll fight back immediately." },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'White wants to play d4. How do you fight for the center right away?', hint: 'Develop the knight to attack the e4 pawn.', correctFeedback: 'Nf6 attacks e4, forcing White to make a decision about the pawn.', wrongFeedback: 'Develop the knight to f6 — it puts pressure on e4 immediately.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 is the most popular response. The knight attacks e4, and White almost always pushes e5 to keep the pawn.', arrow: ['g8', 'f6'] },

    // White plays 3.e5
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White pushes e5, attacking your knight.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },

    // PREDICT 2: Nd5
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your knight is under attack. Where does it go?', hint: 'The knight retreats to d5 — a strong central square.', correctFeedback: 'Nd5 places the knight on a powerful central outpost.', wrongFeedback: 'Retreat to d5 — the knight is well-placed in the center.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Nd5 is solid. The knight sits in the center and can jump to useful squares later. White will usually push d4 next.', arrow: ['f6', 'd5'] },

    // White plays 4.d4
    { type: 'instruction', fen: FEN.after_Nd5, text: 'White pushes d4, challenging your c5 pawn and claiming the center.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 3: cxd4
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'White pushed d4. How do you respond?', hint: 'Capture the pawn on d4 — open the position.', correctFeedback: 'cxd4 opens the center. White will have to decide how to recapture.', wrongFeedback: 'Take on d4 — open up the position while the center is fluid.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: "cxd4 gives White an isolated pawn decision. White usually recaptures with Nf3 first, then cxd4, keeping the center flexible.", arrow: ['c5', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_c3, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    { type: 'instruction', fen: FEN.after_cxd4, text: "Nf6, Nd5, cxd4 — you've challenged the Alapin head-on. The center is open and the fight is on." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-2: Building Pressure (Nc6, d6, Nb6)
// ═══════════════════════════════════════════════════════════

const SL_2: OpeningLesson = {
  id: 'sl-2',
  title: 'Building Pressure',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_cxd4, text: "White develops the knight. You'll bring out your own knight, prepare to dissolve the center, and force White's bishop to move." },

    // RECAP
    { type: 'instruction', fen: FEN.after_c3, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // White plays 5.Nf3
    { type: 'instruction', fen: FEN.after_cxd4, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 1: Nc6
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'How do you develop while keeping pressure on the center?', hint: 'Bring the queenside knight out — it eyes d4 and e5.', correctFeedback: 'Nc6 develops the knight and keeps pressure on both d4 and e5.', wrongFeedback: 'Play Nc6 — develop the knight toward the center.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 is natural development. The knight pressures d4 and e5, and prepares to recapture if needed.', arrow: ['b8', 'c6'] },

    // White plays 6.cxd4
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White recaptures cxd4, forming a central pawn duo.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },

    // PREDICT 2: d6
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'White has a strong center with d4 and e5. How do you undermine it?', hint: 'Push the d-pawn to challenge e5.', correctFeedback: 'd6 challenges the e5 pawn and opens the position up.', wrongFeedback: 'Play d6 — put pressure on the e5 pawn.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 targets the e5 pawn directly. White needs to decide how to handle the tension in the center.', arrow: ['d7', 'd6'] },

    // White plays 7.Bc4
    { type: 'instruction', fen: FEN.after_d6, text: 'White develops the bishop to c4, aiming at your knight on d5.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 3: Nb6
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: "The bishop is staring at your knight. What's the best retreat?", hint: 'Move the knight to b6 — it attacks the bishop right back.', correctFeedback: 'Nb6 retreats the knight while hitting the bishop on c4, forcing it to move.', wrongFeedback: 'Play Nb6 — retreat the knight and attack the bishop.' },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Nb6 is a key move. The knight leaves d5 but attacks the bishop on c4, gaining a tempo.', arrow: ['d5', 'b6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_cxd4, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },

    { type: 'instruction', fen: FEN.after_Nb6, text: "Nc6, d6, Nb6 — you've developed, challenged the center, and forced the bishop to retreat." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-3: Dissolving the Center (dxe5, Bd7, Qxd7)
// ═══════════════════════════════════════════════════════════

const SL_3: OpeningLesson = {
  id: 'sl-3',
  title: 'Dissolving the Center',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nb6, text: "White pins the knight with Bb5. You'll capture the e5 pawn, develop the bishop, and trade off the knight." },

    // RECAP
    { type: 'instruction', fen: FEN.after_c3, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },

    // White plays 8.Bb5
    { type: 'instruction', fen: FEN.after_Nb6, text: 'White plays Bb5, pinning the knight on c6 against the king.', autoAdvance: 800, highlightSquares: ['c4', 'b5'] },

    // PREDICT 1: dxe5
    { type: 'play-move', fen: FEN.after_Bb5, correctMove: 'dxe5', prompt: 'The bishop moved to b5. Now what about that e5 pawn?', hint: 'Capture the e5 pawn — it is no longer as well defended.', correctFeedback: 'dxe5 wins the e5 pawn and opens the center.', wrongFeedback: 'Take on e5 — grab the pawn while the bishop is on b5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: 'dxe5 captures the center pawn. White will recapture with the knight, but you have a plan to neutralize it.', arrow: ['d6', 'e5'] },

    // White plays 9.Nxe5
    { type: 'instruction', fen: FEN.after_dxe5, text: 'White recaptures Nxe5, putting the knight on a strong central square.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },

    // PREDICT 2: Bd7
    { type: 'play-move', fen: FEN.after_Nxe5, correctMove: 'Bd7', prompt: 'The knight is strong on e5. How do you start undermining it?', hint: 'Develop the bishop to d7 — it connects to b5 and threatens a trade.', correctFeedback: 'Bd7 develops the bishop and prepares to trade off the strong knight.', wrongFeedback: 'Play Bd7 — develop the bishop toward the action.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Bd7 develops the last minor piece and invites a trade. White will likely take on d7, eliminating the knight from e5.', arrow: ['c8', 'd7'] },

    // White plays 10.Nxd7
    { type: 'instruction', fen: FEN.after_Bd7, text: 'White trades Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },

    // PREDICT 3: Qxd7
    { type: 'play-move', fen: FEN.after_Nxd7, correctMove: 'Qxd7', prompt: 'White took on d7. How do you recapture?', hint: 'Take back with the queen — centralize it.', correctFeedback: 'Qxd7 recaptures and places the queen on a central, active square.', wrongFeedback: 'Recapture with the queen — Qxd7.' },
    { type: 'instruction', fen: FEN.after_Qxd7, text: 'Qxd7 keeps the queen active in the center. The position is equal and your pieces have good squares.', arrow: ['d8', 'd7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nb6, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Bb5.', autoAdvance: 800, highlightSquares: ['c4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Bb5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7, correctMove: 'Qxd7', prompt: 'Your move.', hint: 'Qxd7.', correctFeedback: 'Qxd7.', wrongFeedback: 'Qxd7.' },

    { type: 'instruction', fen: FEN.after_Qxd7, text: "dxe5, Bd7, Qxd7 — you've dissolved White's center and traded off the strong knight. The position is balanced." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-4: Completing Development (e6, Be7, O-O)
// ═══════════════════════════════════════════════════════════

const SL_4: OpeningLesson = {
  id: 'sl-4',
  title: 'Completing Development',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Qxd7, text: "You're almost fully developed. Solidify the center, develop the last piece, and castle to safety." },

    // RECAP
    { type: 'instruction', fen: FEN.after_c3, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Bb5.', autoAdvance: 800, highlightSquares: ['c4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Bb5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7, correctMove: 'Qxd7', prompt: 'Your move.', hint: 'Qxd7.', correctFeedback: 'Qxd7.', wrongFeedback: 'Qxd7.' },

    // White plays 11.Nc3
    { type: 'instruction', fen: FEN.after_Qxd7, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 1: e6
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'How do you solidify your position and prepare to develop the bishop?', hint: 'Push the e-pawn to support the center and open the diagonal for the bishop.', correctFeedback: 'e6 supports the center and opens the f8-a3 diagonal for the bishop.', wrongFeedback: 'Play e6 — solid and prepares bishop development.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6 is a calm, solid move. It secures the center and lets the dark-squared bishop develop to e7.', arrow: ['e7', 'e6'] },

    // White plays 12.O-O
    { type: 'instruction', fen: FEN.after_e6, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 2: Be7
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Be7', prompt: 'Time to develop the last piece. Where does the bishop go?', hint: 'The bishop goes to e7 — a natural, solid square.', correctFeedback: 'Be7 develops the bishop and prepares castling.', wrongFeedback: 'Play Be7 — develop the bishop and get ready to castle.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7 completes your minor piece development. One more move and your king will be safe.', arrow: ['f8', 'e7'] },

    // White plays 13.Qg4
    { type: 'instruction', fen: FEN.after_Be7, text: 'White plays Qg4, putting pressure on g7 and eyeing the kingside.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: "White's queen is active. What should you do?", hint: 'Castle — get the king to safety.', correctFeedback: 'O-O tucks the king away and connects the rooks.', wrongFeedback: 'Castle kingside — safety first.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O completes your development. The king is safe and the rooks are connected. You're in great shape.", arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qxd7, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Qxd7, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.after_OO, text: "e6, Be7, O-O — development is complete. You've handled the Alapin and reached a solid, equal position." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-Bb3: Deviation (8.Bb3 instead of 8.Bb5)
// Black plays: dxe5, Na5, Nxb3
// ═══════════════════════════════════════════════════════════

const SL_DEV_BB3: OpeningLesson = {
  id: 'sl-dev-Bb3',
  title: 'Dev 8.Bb3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nb6, text: "Sometimes White retreats the bishop to b3 instead of playing Bb5. The plan changes — you'll grab the e5 pawn, reroute a knight, and win the bishop pair." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_c3, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Nb6, text: 'White retreats the bishop to b3 instead of Bb5 — a quieter approach.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },

    // PREDICT 1: dxe5
    { type: 'play-move', fen: FEN.dev_after_Bb3, correctMove: 'dxe5', prompt: 'The bishop retreated. The e5 pawn is still there — what do you do?', hint: 'Capture the e5 pawn — same idea as the main line.', correctFeedback: 'dxe5 grabs the e5 pawn. White will push d5 to compensate.', wrongFeedback: 'Take on e5 — win the center pawn.' },
    { type: 'instruction', fen: FEN.dev_after_dxe5, text: 'dxe5 picks up the center pawn. White typically pushes d5 to gain space and counterplay.', arrow: ['d6', 'e5'] },

    // White plays 9.d5
    { type: 'instruction', fen: FEN.dev_after_dxe5, text: 'White pushes d5, gaining space and attacking your knight.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },

    // PREDICT 2: Na5
    { type: 'play-move', fen: FEN.dev_after_d5, correctMove: 'Na5', prompt: 'The pawn is coming at your knight. Where does it jump to?', hint: 'Jump to a5 — target the bishop on b3.', correctFeedback: 'Na5 dodges the pawn and attacks the bishop on b3.', wrongFeedback: 'Play Na5 — the knight attacks the bishop.' },
    { type: 'instruction', fen: FEN.dev_after_Na5, text: 'Na5 is a great move. The knight attacks the bishop on b3 and prepares to capture it, winning the bishop pair.', arrow: ['c6', 'a5'] },

    // White plays 10.Nc3
    { type: 'instruction', fen: FEN.dev_after_Na5, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 3: Nxb3
    { type: 'play-move', fen: FEN.dev_after_Nc3, correctMove: 'Nxb3', prompt: 'The bishop is undefended on b3. What do you play?', hint: 'Capture the bishop — win the bishop pair.', correctFeedback: 'Nxb3 wins the bishop. After axb3, you have the bishop pair and a good position.', wrongFeedback: 'Take the bishop — Nxb3.' },
    { type: 'instruction', fen: FEN.dev_after_Nxb3, text: 'Nxb3 captures the bishop. White recaptures with axb3, but you have the bishop pair and the a-file is open.', arrow: ['a5', 'b3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nb6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.dev_after_Bb3, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.dev_after_dxe5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_after_d5, correctMove: 'Na5', prompt: 'Your move.', hint: 'Na5.', correctFeedback: 'Na5.', wrongFeedback: 'Na5.' },
    { type: 'instruction', fen: FEN.dev_after_Na5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev_after_Nc3, correctMove: 'Nxb3', prompt: 'Your move.', hint: 'Nxb3.', correctFeedback: 'Nxb3.', wrongFeedback: 'Nxb3.' },

    { type: 'instruction', fen: FEN.dev_after_Nxb3, text: "dxe5, Na5, Nxb3 — against 8.Bb3, you grab the pawn, attack the bishop, and win the bishop pair." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const SL_TEST_1: OpeningLesson = {
  id: 'sl-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (12 Black moves) ===
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Bb5.', autoAdvance: 800, highlightSquares: ['c4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Bb5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7, correctMove: 'Qxd7', prompt: 'Your move.', hint: 'Qxd7.', correctFeedback: 'Qxd7.', wrongFeedback: 'Qxd7.' },
    { type: 'instruction', fen: FEN.after_Qxd7, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // === DEVIATION TEST: 8.Bb3 ===
    // Replay to deviation point (after Nb6), then White plays Bb3
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Now White plays Bb3 instead.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.dev_after_Bb3, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.dev_after_dxe5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_after_d5, correctMove: 'Na5', prompt: 'Your move.', hint: 'Na5.', correctFeedback: 'Na5.', wrongFeedback: 'Na5.' },
    { type: 'instruction', fen: FEN.dev_after_Na5, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev_after_Nc3, correctMove: 'Nxb3', prompt: 'Your move.', hint: 'Nxb3.', correctFeedback: 'Nxb3.', wrongFeedback: 'Nxb3.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-5: Trading Bishops (bxc6, Bf6, Kh8)
// First L2 lesson — recap all L1 moves.
// ═══════════════════════════════════════════════════════════

const SL_5: OpeningLesson = {
  id: 'sl-5',
  title: 'Trading Bishops',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "White trades the bishop for your knight on c6. You'll recapture, dodge a kingside attack, and reposition your king." },

    // RECAP (all L1 moves: 2...Nf6 through 13...O-O)
    { type: 'instruction', fen: FEN.after_c3, text: "Run through the full line first." },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5!', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4!', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6!', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6!', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6!', wrongFeedback: 'Nb6.' },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Bb5.', autoAdvance: 800, highlightSquares: ['c4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Bb5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5!', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7!', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7, correctMove: 'Qxd7', prompt: 'Your move.', hint: 'Qxd7.', correctFeedback: 'Qxd7!', wrongFeedback: 'Qxd7.' },
    { type: 'instruction', fen: FEN.after_Qxd7, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6!', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7!', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O!', wrongFeedback: 'O-O.' },

    // White plays 14.Bxc6
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'White trades the bishop for your knight with Bxc6.', autoAdvance: 800, highlightSquares: ['b5', 'c6'] },

    // PREDICT 1: bxc6
    { type: 'play-move', fen: FEN.after_Bxc6, correctMove: 'bxc6', prompt: 'White captured your knight. How do you recapture?', hint: 'Take back with the b-pawn — open the b-file for your rook.', correctFeedback: 'bxc6 recaptures and opens the b-file for your rook.', wrongFeedback: 'Recapture with bxc6.' },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'bxc6 opens the b-file. Your rook on a8 will have an open line, and the doubled c-pawns are fine — they control key central squares.', arrow: ['b7', 'c6'] },

    // White plays 15.Bh6
    { type: 'instruction', fen: FEN.after_bxc6, text: 'White plays Bh6, attacking g7 and threatening your king.', autoAdvance: 800, highlightSquares: ['c1', 'h6'] },

    // PREDICT 2: Bf6
    { type: 'play-move', fen: FEN.after_Bh6, correctMove: 'Bf6', prompt: 'White is threatening g7. How do you defend?', hint: 'Move the bishop to f6 — it guards g7 and stays active.', correctFeedback: 'Bf6 defends g7 while keeping the bishop active on the a1-h8 diagonal.', wrongFeedback: 'Play Bf6 — defend g7 and keep the bishop active.' },
    { type: 'instruction', fen: FEN.after_Bf6, text: 'Bf6 is a strong defensive move. The bishop guards g7 and controls the long diagonal. White has no immediate threats.', arrow: ['e7', 'f6'] },

    // White plays 16.Rfd1
    { type: 'instruction', fen: FEN.after_Bf6, text: 'White centralizes the rook with Rfd1.', autoAdvance: 800, highlightSquares: ['f1', 'd1'] },

    // PREDICT 3: Kh8
    { type: 'play-move', fen: FEN.after_Rfd1, correctMove: 'Kh8', prompt: 'White is building pressure. How do you improve your position?', hint: 'Step the king off the g-file — remove any back-rank tricks.', correctFeedback: 'Kh8 sidesteps any tactics along the g-file and keeps your king safe.', wrongFeedback: 'Play Kh8 — tuck the king into the corner.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Kh8 is a prophylactic move. The king steps off the dangerous g-file, avoiding any discovered attacks or queen-plus-bishop tricks.', arrow: ['g8', 'h8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_OO, text: "Three new moves. Play them back." },
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'Bxc6.', autoAdvance: 800, highlightSquares: ['b5', 'c6'] },
    { type: 'play-move', fen: FEN.after_Bxc6, correctMove: 'bxc6', prompt: 'Your move.', hint: 'bxc6.', correctFeedback: 'bxc6.', wrongFeedback: 'bxc6.' },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'Bh6.', autoAdvance: 800, highlightSquares: ['c1', 'h6'] },
    { type: 'play-move', fen: FEN.after_Bh6, correctMove: 'Bf6', prompt: 'Your move.', hint: 'Bf6.', correctFeedback: 'Bf6.', wrongFeedback: 'Bf6.' },
    { type: 'instruction', fen: FEN.after_Bf6, text: 'Rfd1.', autoAdvance: 800, highlightSquares: ['f1', 'd1'] },
    { type: 'play-move', fen: FEN.after_Rfd1, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },

    { type: 'instruction', fen: FEN.after_Kh8, text: "bxc6, Bf6, Kh8 — you've traded bishops, defended the kingside, and tucked the king away safely." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-Qxd4: Deviation (5.Qxd4 instead of 5.Nf3)
// Black plays: e6, Nc6, f5
// ═══════════════════════════════════════════════════════════

const SL_DEV_QXDD: OpeningLesson = {
  id: 'sl-dev-Qxd4',
  title: 'Dev 5.Qxd4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_cxd4, text: "Sometimes White recaptures with the queen instead of developing the knight. The queen is exposed in the center — you'll develop with tempo and seize space." },

    // RECAP to deviation point (after 4...cxd4)
    { type: 'instruction', fen: FEN.after_c3, text: "Quick review first." },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_cxd4, text: 'White takes back with the queen instead of developing — Qxd4.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },

    // PREDICT 1: e6
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Qxd4, correctMove: 'e6', prompt: "White's queen is in the center. How do you develop while opening lines?", hint: 'Play e6 — solid development that opens the diagonal for your bishop.', correctFeedback: 'e6 develops solidly and opens the dark-squared bishop diagonal.', wrongFeedback: 'Play e6 — develop and open lines.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_e6, text: "e6 is calm and strong. You're developing while the queen sits exposed in the center.", arrow: ['e7', 'e6'] },

    // White plays 6.Nf3
    { type: 'instruction', fen: FEN.dev_Qxd4_after_e6, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 2: Nc6
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Nf3, correctMove: 'Nc6', prompt: "White developed a knight. How do you attack the exposed queen?", hint: 'Develop the knight to c6 — it attacks the queen.', correctFeedback: 'Nc6 develops with tempo, attacking the queen and forcing it to move again.', wrongFeedback: 'Play Nc6 — develop and hit the queen.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_Nc6, text: 'Nc6 hits the queen and gains a tempo. White has to waste another move retreating.', arrow: ['b8', 'c6'] },

    // White plays 7.Qe4
    { type: 'instruction', fen: FEN.dev_Qxd4_after_Nc6, text: 'The queen retreats to e4, staying active.', autoAdvance: 800, highlightSquares: ['d4', 'e4'] },

    // PREDICT 3: f5
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Qe4, correctMove: 'f5', prompt: "The queen is on e4. How do you chase it away and grab space?", hint: 'Push f5 — attack the queen and grab kingside space.', correctFeedback: 'f5 kicks the queen out and claims kingside space. Excellent.', wrongFeedback: 'Play f5 — push the queen back and seize space.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_f5, text: "f5 is aggressive. The queen must retreat again, and you've gained space on the kingside. Black has a great position.", arrow: ['f7', 'f5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_cxd4, text: "White played 5.Qxd4. Handle it from memory." },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Qxd4.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Qxd4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_e6, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_Nc6, text: 'Qe4.', autoAdvance: 800, highlightSquares: ['d4', 'e4'] },
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Qe4, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },

    { type: 'instruction', fen: FEN.dev_Qxd4_after_f5, text: "e6, Nc6, f5 — against 5.Qxd4, you develop with tempo and push the queen around." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-Bc4: Deviation (4.Bc4 instead of 4.d4)
// Black plays: Nb6, c4, Nc6
// ═══════════════════════════════════════════════════════════

const SL_DEV_BC4: OpeningLesson = {
  id: 'sl-dev-Bc4',
  title: 'Dev 4.Bc4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nd5, text: "Sometimes White develops the bishop to c4 instead of pushing d4. You'll attack it, push it back, and grab queenside space." },

    // RECAP to deviation point (after 3...Nd5)
    { type: 'instruction', fen: FEN.after_c3, text: "Start from the top." },
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Nd5, text: 'White develops the bishop to c4 instead of pushing d4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 1: Nb6
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bc4, correctMove: 'Nb6', prompt: 'The bishop is eyeing your knight. Where does the knight go?', hint: 'Jump to b6 — attack the bishop right back.', correctFeedback: 'Nb6 retreats the knight and attacks the bishop, gaining a tempo.', wrongFeedback: 'Play Nb6 — retreat and attack the bishop.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_Nb6, text: 'Nb6 is the standard response. You hit the bishop and force it to retreat.', arrow: ['d5', 'b6'] },

    // White plays 5.Bb3
    { type: 'instruction', fen: FEN.dev_Bc4_after_Nb6, text: 'The bishop retreats to b3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },

    // PREDICT 2: c4
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bb3, correctMove: 'c4', prompt: 'The bishop retreated to b3. How do you chase it even further?', hint: 'Push c4 — trap the bishop on the rim.', correctFeedback: 'c4 pushes the bishop back again and grabs queenside space.', wrongFeedback: 'Play c4 — keep pushing the bishop back.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_c4, text: 'c4 is strong. The bishop is pushed to the c2 square where it does very little, and you control queenside space.', arrow: ['c5', 'c4'] },

    // White plays 6.Bc2
    { type: 'instruction', fen: FEN.dev_Bc4_after_c4, text: 'The bishop retreats all the way to c2.', autoAdvance: 800, highlightSquares: ['b3', 'c2'] },

    // PREDICT 3: Nc6
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bc2, correctMove: 'Nc6', prompt: 'The bishop is buried on c2. How do you continue developing?', hint: 'Bring the knight out to c6 — natural development.', correctFeedback: 'Nc6 develops the knight to a great square, pressuring d4 and e5.', wrongFeedback: 'Play Nc6 — develop toward the center.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_Nc6, text: "Nc6 is natural development. You're well ahead in development and White's bishop is doing nothing on c2.", arrow: ['b8', 'c6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nd5, text: "White played 4.Bc4. Handle it from memory." },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_Nb6, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bb3, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_c4, text: 'Bc2.', autoAdvance: 800, highlightSquares: ['b3', 'c2'] },
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bc2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },

    { type: 'instruction', fen: FEN.dev_Bc4_after_Nc6, text: "Nb6, c4, Nc6 — against 4.Bc4, you chase the bishop across the board and develop with a great position." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-test-2: Level 2 Test (main line + deviations)
// ═══════════════════════════════════════════════════════════

const SL_TEST_2: OpeningLesson = {
  id: 'sl-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (all 15 Black moves: Nf6 through Kh8) ===
    { type: 'play-move', fen: FEN.after_c3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'e5.', autoAdvance: 800, highlightSquares: ['e4', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c3', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4_w, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },
    { type: 'instruction', fen: FEN.after_Nb6, text: 'Bb5.', autoAdvance: 800, highlightSquares: ['c4', 'b5'] },
    { type: 'play-move', fen: FEN.after_Bb5, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7, correctMove: 'Qxd7', prompt: 'Your move.', hint: 'Qxd7.', correctFeedback: 'Qxd7.', wrongFeedback: 'Qxd7.' },
    { type: 'instruction', fen: FEN.after_Qxd7, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    // L2 continuation
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'Bxc6.', autoAdvance: 800, highlightSquares: ['b5', 'c6'] },
    { type: 'play-move', fen: FEN.after_Bxc6, correctMove: 'bxc6', prompt: 'Your move.', hint: 'bxc6.', correctFeedback: 'bxc6.', wrongFeedback: 'bxc6.' },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'Bh6.', autoAdvance: 800, highlightSquares: ['c1', 'h6'] },
    { type: 'play-move', fen: FEN.after_Bh6, correctMove: 'Bf6', prompt: 'Your move.', hint: 'Bf6.', correctFeedback: 'Bf6.', wrongFeedback: 'Bf6.' },
    { type: 'instruction', fen: FEN.after_Bf6, text: 'Rfd1.', autoAdvance: 800, highlightSquares: ['f1', 'd1'] },
    { type: 'play-move', fen: FEN.after_Rfd1, correctMove: 'Kh8', prompt: 'Your move.', hint: 'Kh8.', correctFeedback: 'Kh8.', wrongFeedback: 'Kh8.' },

    // === DEVIATION TEST: 5.Qxd4 ===
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Now White plays Qxd4 instead.', autoAdvance: 800, highlightSquares: ['d1', 'd4'] },
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Qxd4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_e6, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Nf3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_Qxd4_after_Nc6, text: 'Qe4.', autoAdvance: 800, highlightSquares: ['d4', 'e4'] },
    { type: 'play-move', fen: FEN.dev_Qxd4_after_Qe4, correctMove: 'f5', prompt: 'Your move.', hint: 'f5.', correctFeedback: 'f5.', wrongFeedback: 'f5.' },

    // === DEVIATION TEST: 4.Bc4 ===
    { type: 'instruction', fen: FEN.after_Nd5, text: 'Now White plays Bc4 instead of d4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bc4, correctMove: 'Nb6', prompt: 'Your move.', hint: 'Nb6.', correctFeedback: 'Nb6.', wrongFeedback: 'Nb6.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_Nb6, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bb3, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.dev_Bc4_after_c4, text: 'Bc2.', autoAdvance: 800, highlightSquares: ['b3', 'c2'] },
    { type: 'play-move', fen: FEN.dev_Bc4_after_Bc2, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SICILIAN_ALAPIN_LESSONS: Record<string, OpeningLesson> = {
  'sl-1': SL_1,
  'sl-2': SL_2,
  'sl-3': SL_3,
  'sl-4': SL_4,
  'sl-dev-Bb3': SL_DEV_BB3,
  'sl-test-1': SL_TEST_1,
  'sl-5': SL_5,
  'sl-dev-Qxd4': SL_DEV_QXDD,
  'sl-dev-Bc4': SL_DEV_BC4,
  'sl-test-2': SL_TEST_2,
}

export function getSicilianAlapinLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_ALAPIN_LESSONS[id]
}
