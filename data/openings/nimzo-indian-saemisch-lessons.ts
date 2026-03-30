import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// NIMZO-INDIAN SAEMISCH LESSONS (nis-1 through nis-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Ne2
// Main line: 5...d5 6.a3 Be7 7.cxd5 exd5
//            8.Nf4 c6 9.Bd3 Re8 10.O-O Nbd7
//            11.f3 Nf8 12.Bc2 Ne6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:     'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6:    'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_c4:     'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_e6:     'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:    'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  after_Bb4:    'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
  after_e3:     'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR b KQkq - 0 4',
  after_OO:     'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQ - 1 5',
  after_Ne2:    'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP2NPPP/R1BQKB1R b KQ - 2 5',

  // Lesson 2: 5...d5 6.a3 Be7 7.cxd5 exd5
  after_d5:     'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2N1P3/PP2NPPP/R1BQKB1R w KQ - 0 6',
  after_a3:     'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/P1N1P3/1P2NPPP/R1BQKB1R b KQ - 0 6',
  after_Be7:    'rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/P1N1P3/1P2NPPP/R1BQKB1R w KQ - 1 7',
  after_cxd5:   'rnbq1rk1/ppp1bppp/4pn2/3P4/3P4/P1N1P3/1P2NPPP/R1BQKB1R b KQ - 0 7',
  after_exd5:   'rnbq1rk1/ppp1bppp/5n2/3p4/3P4/P1N1P3/1P2NPPP/R1BQKB1R w KQ - 0 8',

  // Lesson 3: 8.Nf4 c6 9.Bd3 Re8 10.O-O Nbd7
  after_Nf4:    'rnbq1rk1/ppp1bppp/5n2/3p4/3P1N2/P1N1P3/1P3PPP/R1BQKB1R b KQ - 1 8',
  after_c6:     'rnbq1rk1/pp2bppp/2p2n2/3p4/3P1N2/P1N1P3/1P3PPP/R1BQKB1R w KQ - 0 9',
  after_Bd3:    'rnbq1rk1/pp2bppp/2p2n2/3p4/3P1N2/P1NBP3/1P3PPP/R1BQK2R b KQ - 1 9',
  after_Re8:    'rnbqr1k1/pp2bppp/2p2n2/3p4/3P1N2/P1NBP3/1P3PPP/R1BQK2R w KQ - 2 10',
  after_OO2:    'rnbqr1k1/pp2bppp/2p2n2/3p4/3P1N2/P1NBP3/1P3PPP/R1BQ1RK1 b - - 3 10',
  after_Nbd7:   'r1bqr1k1/pp1nbppp/2p2n2/3p4/3P1N2/P1NBP3/1P3PPP/R1BQ1RK1 w - - 4 11',

  // Lesson 4: 11.f3 Nf8 12.Bc2 Ne6 13.e4 dxe4
  after_f3:     'r1bqr1k1/pp1nbppp/2p2n2/3p4/3P1N2/P1NBPP2/1P4PP/R1BQ1RK1 b - - 0 11',
  after_Nf8:    'r1bqrnk1/pp2bppp/2p2n2/3p4/3P1N2/P1NBPP2/1P4PP/R1BQ1RK1 w - - 1 12',
  after_Bc2:    'r1bqrnk1/pp2bppp/2p2n2/3p4/3P1N2/P1N1PP2/1PB3PP/R1BQ1RK1 b - - 2 12',
  after_Ne6:    'r1bqr1k1/pp2bppp/2p1nn2/3p4/3P1N2/P1N1PP2/1PB3PP/R1BQ1RK1 w - - 3 13',
  after_e4:     'r1bqr1k1/pp2bppp/2p1nn2/3p4/3PPN2/P1N2P2/1PB3PP/R1BQ1RK1 b - - 0 13',
  after_dxe4:   'r1bqr1k1/pp2bppp/2p1nn2/8/3PpN2/P1N2P2/1PB3PP/R1BQ1RK1 w - - 0 14',

  // Deviation 2: 7.Nf4 instead of 7.cxd5
  dev2_after_Nf4:   'rnbq1rk1/ppp1bppp/4pn2/3p4/2PP1N2/P1N1P3/1P3PPP/R1BQKB1R b KQ - 2 7',
  dev2_after_c6:    'rnbq1rk1/pp2bppp/2p1pn2/3p4/2PP1N2/P1N1P3/1P3PPP/R1BQKB1R w KQ - 0 8',
  dev2_after_Bd3:   'rnbq1rk1/pp2bppp/2p1pn2/3p4/2PP1N2/P1NBP3/1P3PPP/R1BQK2R b KQ - 1 8',
  dev2_after_Nbd7:  'r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP1N2/P1NBP3/1P3PPP/R1BQK2R w KQ - 2 9',
  dev2_after_cxd5:  'r1bq1rk1/pp1nbppp/2p1pn2/3P4/3P1N2/P1NBP3/1P3PPP/R1BQK2R b KQ - 0 9',
  dev2_after_exd5:  'r1bq1rk1/pp1nbppp/2p2n2/3p4/3P1N2/P1NBP3/1P3PPP/R1BQK2R w KQ - 0 10',

  // Deviation 3: 8.b4 instead of 8.Nf4
  dev3_after_b4:    'rnbq1rk1/ppp1bppp/5n2/3p4/1P1P4/P1N1P3/4NPPP/R1BQKB1R b KQ - 0 8',
  dev3_after_c6:    'rnbq1rk1/pp2bppp/2p2n2/3p4/1P1P4/P1N1P3/4NPPP/R1BQKB1R w KQ - 0 9',
  dev3_after_Ng3:   'rnbq1rk1/pp2bppp/2p2n2/3p4/1P1P4/P1N1P1N1/5PPP/R1BQKB1R b KQ - 1 9',
  dev3_after_Re8:   'rnbqr1k1/pp2bppp/2p2n2/3p4/1P1P4/P1N1P1N1/5PPP/R1BQKB1R w KQ - 2 10',
  dev3_after_Bd3:   'rnbqr1k1/pp2bppp/2p2n2/3p4/1P1P4/P1NBP1N1/5PPP/R1BQK2R b KQ - 3 10',
  dev3_after_Nbd7:  'r1bqr1k1/pp1nbppp/2p2n2/3p4/1P1P4/P1NBP1N1/5PPP/R1BQK2R w KQ - 4 11',
}


// ═══════════════════════════════════════════════════════════
// nis-1: The Saemisch Setup (Nf6, e6, Bb4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const NIS_1: OpeningLesson = {
  id: 'nis-1',
  title: 'The Saemisch Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Nimzo-Indian begins with a knight, a pawn, and a bishop pin. You'll learn the three identity moves that define this defense." },

    // White plays 1.d4
    { type: 'instruction', fen: FEN.start, text: 'White opens with d4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'White played d4. How do you respond?', hint: 'Develop the knight to its most natural square.', correctFeedback: 'Nf6 develops the knight and fights for the center.', wrongFeedback: 'Play Nf6 — bring the knight toward the center.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 is the Indian Defense move. The knight controls d5 and e4 while keeping your pawn structure flexible.', arrow: ['g8', 'f6'] },

    // White plays 2.c4
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White grabs more space with c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // PREDICT 2: e6
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'White expanded in the center. What do you play?', hint: 'Support a future d5 push and free the dark-squared bishop.', correctFeedback: 'e6 prepares d5 and opens the diagonal for your bishop.', wrongFeedback: 'Play e6 — it supports d5 and lets the bishop come out.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6 is flexible. It prepares d5 and clears the f8-a3 diagonal for the bishop to come to b4.', arrow: ['e7', 'e6'] },

    // White plays 3.Nc3
    { type: 'instruction', fen: FEN.after_e6, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 3: Bb4
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'White just developed the knight. Time for the signature Nimzo move.', hint: 'Pin the knight on c3 with your bishop.', correctFeedback: 'Bb4 pins the knight — the heart of the Nimzo-Indian.', wrongFeedback: 'Play Bb4 — pin the knight on c3.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: "Bb4 is the Nimzo-Indian. The bishop pins the c3 knight, and you're threatening to double White's pawns with Bxc3.", arrow: ['f8', 'b4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: 'Now play all three moves from memory.' },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    { type: 'instruction', fen: FEN.after_Bb4, text: "Nf6, e6, Bb4 — the Nimzo-Indian is on the board. Next you'll see how to handle White's Saemisch setup." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nis-2: Center Strike (d5, Be7, exd5)
// Identity continues: 4.e3 O-O 5.Ne2
// User learns: 5...d5, 6...Be7, 7...exd5
// ═══════════════════════════════════════════════════════════

const NIS_2: OpeningLesson = {
  id: 'nis-2',
  title: 'Center Strike',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb4, text: "White plays the Saemisch variation with e3 and Ne2. You'll learn to strike the center and reposition your bishop." },

    // RECAP: Nf6, e6, Bb4
    { type: 'instruction', fen: FEN.after_Bb4, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },

    // White plays 4.e3, 4...O-O, 5.Ne2 (identity setup — auto-advance)
    { type: 'instruction', fen: FEN.after_Bb4, text: 'White plays e3, shoring up the center.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'You castle kingside.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'White develops the knight to e2 — the Saemisch move.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },

    // PREDICT 1: d5
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: "White's knight is on e2. What's your plan?", hint: 'Strike the center with your d-pawn.', correctFeedback: 'd5 challenges White in the center immediately.', wrongFeedback: 'Play d5 — challenge the center before White gets too comfortable.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5 attacks the c4 pawn and fights for central control. White has to deal with the tension.', arrow: ['d7', 'd5'] },

    // White plays 6.a3
    { type: 'instruction', fen: FEN.after_d5, text: 'White plays a3, asking the bishop where it wants to go.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },

    // PREDICT 2: Be7
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: "White kicked your bishop. Where does it go?", hint: 'Retreat to a safe, active square on the e-file.', correctFeedback: 'Be7 keeps the bishop useful on the kingside diagonal.', wrongFeedback: 'Play Be7 — retreat to a solid square where the bishop stays active.' },
    { type: 'instruction', fen: FEN.after_Be7, text: "Be7 is the most popular retreat. The bishop guards the kingside and doesn't block any pieces.", arrow: ['b4', 'e7'] },

    // White plays 7.cxd5
    { type: 'instruction', fen: FEN.after_Be7, text: 'White captures on d5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // PREDICT 3: exd5
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'White took your d-pawn. How do you recapture?', hint: 'Take back with the e-pawn to keep a pawn in the center.', correctFeedback: 'exd5 recaptures and maintains a strong central pawn.', wrongFeedback: 'Play exd5 — recapture to keep your pawn in the center.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5 gives you a solid pawn on d5. The position is symmetrical and balanced.', arrow: ['e6', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ne2, text: 'Now play all three new moves from memory.' },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    { type: 'instruction', fen: FEN.after_exd5, text: "d5, Be7, exd5 — you've struck the center, saved the bishop, and kept a strong pawn on d5." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nis-3: Solid Development (c6, Re8, Nbd7)
// ═══════════════════════════════════════════════════════════

const NIS_3: OpeningLesson = {
  id: 'nis-3',
  title: 'Solid Development',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_exd5, text: "White jumps the knight to f4 and develops the bishop. You'll solidify the center and get your pieces active." },

    // RECAP
    { type: 'instruction', fen: FEN.after_exd5, text: 'Prove you know these moves!' },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    // White plays 8.Nf4
    { type: 'instruction', fen: FEN.after_exd5, text: 'White jumps the knight to f4, eyeing d5 and the kingside.', autoAdvance: 800, highlightSquares: ['e2', 'f4'] },

    // PREDICT 1: c6
    { type: 'play-move', fen: FEN.after_Nf4, correctMove: 'c6', prompt: "The knight landed on f4. How do you shore up the center?", hint: 'Support the d5 pawn with a pawn move.', correctFeedback: 'c6 locks down the d5 pawn so the knight on f4 has no target.', wrongFeedback: 'Play c6 — reinforce d5 so the knight has nothing to attack.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6 is rock-solid. The d5 pawn is now fully protected, and the c6 pawn controls b5 and d5.', arrow: ['c7', 'c6'] },

    // White plays 9.Bd3
    { type: 'instruction', fen: FEN.after_c6, text: 'White develops the bishop to d3, pointing at the kingside.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 2: Re8
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Re8', prompt: "White's bishop is aiming at your king. What do you do?", hint: 'Activate the rook along the open e-file.', correctFeedback: 'Re8 activates the rook on the half-open e-file.', wrongFeedback: 'Play Re8 — put the rook on the e-file where it has scope.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'Re8 puts the rook on the e-file. It eyes the e3 pawn and supports a future e-file break.', arrow: ['f8', 'e8'] },

    // White plays 10.O-O
    { type: 'instruction', fen: FEN.after_Re8, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 3: Nbd7
    { type: 'play-move', fen: FEN.after_OO2, correctMove: 'Nbd7', prompt: 'White just castled. Time to finish development.', hint: 'Develop the last minor piece — the queenside knight.', correctFeedback: 'Nbd7 develops the knight and keeps options open for a later c5 or rerouting.', wrongFeedback: 'Play Nbd7 — get the last knight into the game.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Nbd7 completes minor piece development. The knight can go to b6, f8, or support a c5 break later.', arrow: ['b8', 'd7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_exd5, text: 'Now replay these three moves from memory.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Nf4.', autoAdvance: 800, highlightSquares: ['e2', 'f4'] },
    { type: 'play-move', fen: FEN.after_Nf4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    { type: 'instruction', fen: FEN.after_Nbd7, text: "c6, Re8, Nbd7 — the center is locked down and all your pieces are developed. Solid as a rock." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nis-dev-Nf4: Deviation — 7.Nf4 instead of 7.cxd5
// After 6...Be7, White plays Nf4 instead of cxd5.
// Black responds: c6, Nbd7, exd5 (3 moves)
// ═══════════════════════════════════════════════════════════

const NIS_DEV_NF4: OpeningLesson = {
  id: 'nis-dev-Nf4',
  title: 'Dev 7.Nf4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Be7, text: "Sometimes White jumps the knight to f4 before exchanging pawns. Here's how to handle it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Be7, text: 'Show me you\'ve got this.' },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Be7, text: 'White plays Nf4 instead of cxd5 — jumping the knight before exchanging.', autoAdvance: 800, highlightSquares: ['e2', 'f4'] },

    // PREDICT 1: c6
    { type: 'play-move', fen: FEN.dev2_after_Nf4, correctMove: 'c6', prompt: "The knight jumped to f4 without exchanging first. What do you play?", hint: 'Protect d5 before White gets a chance to grab it.', correctFeedback: 'c6 defends d5 against the knight and keeps the center solid.', wrongFeedback: 'Play c6 — your d5 pawn needs protection from the f4 knight.' },
    { type: 'instruction', fen: FEN.dev2_after_c6, text: 'c6 reinforces d5. Even without the pawn exchange, your center stays strong.', arrow: ['c7', 'c6'] },

    // White plays Bd3
    { type: 'instruction', fen: FEN.dev2_after_c6, text: 'White develops the bishop to d3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 2: Nbd7
    { type: 'play-move', fen: FEN.dev2_after_Bd3, correctMove: 'Nbd7', prompt: 'White developed the bishop. How do you continue?', hint: 'Bring the last minor piece into the game.', correctFeedback: 'Nbd7 develops the knight and prepares to reroute it.', wrongFeedback: 'Play Nbd7 — finish your development.' },
    { type: 'instruction', fen: FEN.dev2_after_Nbd7, text: 'Nbd7 is natural development. The knight supports the center and can go to b6 or f8 later.', arrow: ['b8', 'd7'] },

    // White plays cxd5
    { type: 'instruction', fen: FEN.dev2_after_Nbd7, text: 'Now White exchanges on d5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // PREDICT 3: exd5
    { type: 'play-move', fen: FEN.dev2_after_cxd5, correctMove: 'exd5', prompt: 'White took on d5. How do you recapture?', hint: 'Take back with the e-pawn.', correctFeedback: 'exd5 keeps the pawn in the center.', wrongFeedback: 'Play exd5 — recapture to maintain your central pawn.' },
    { type: 'instruction', fen: FEN.dev2_after_exd5, text: 'exd5 gives you the same solid structure. Whether White takes early or late, you respond the same way.', arrow: ['e6', 'd5'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev2_after_Nf4, text: 'Replay your three responses from memory.' },
    { type: 'play-move', fen: FEN.dev2_after_Nf4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.dev2_after_c6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev2_after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.dev2_after_Nbd7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.dev2_after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    { type: 'instruction', fen: FEN.dev2_after_exd5, text: "When White plays Nf4 early, just stay solid — c6, Nbd7, and recapture on d5. Same plan, different move order." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nis-dev-b4: Deviation — 8.b4 instead of 8.Nf4
// After 7...exd5, White plays b4 instead of Nf4.
// Black responds: c6, Re8, Nbd7 (3 moves)
// ═══════════════════════════════════════════════════════════

const NIS_DEV_B4: OpeningLesson = {
  id: 'nis-dev-b4',
  title: 'Dev 8.b4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_exd5, text: "Sometimes White expands on the queenside with b4 instead of Nf4. Here's how to stay solid." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_exd5, text: 'Quick review before the new stuff.' },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_exd5, text: 'White plays b4 instead of Nf4 — grabbing space on the queenside.', autoAdvance: 800, highlightSquares: ['b2', 'b4'] },

    // PREDICT 1: c6
    { type: 'play-move', fen: FEN.dev3_after_b4, correctMove: 'c6', prompt: 'White pushed b4. How do you respond?', hint: 'Protect d5 and prevent White from expanding further.', correctFeedback: 'c6 secures the center — the d5 pawn is now rock-solid.', wrongFeedback: 'Play c6 — lock down d5 before worrying about the queenside.' },
    { type: 'instruction', fen: FEN.dev3_after_c6, text: "c6 keeps your center intact. White's b4 gains space but doesn't threaten anything if d5 is defended.", arrow: ['c7', 'c6'] },

    // White plays Ng3
    { type: 'instruction', fen: FEN.dev3_after_c6, text: 'White reroutes the knight to g3.', autoAdvance: 800, highlightSquares: ['e2', 'g3'] },

    // PREDICT 2: Re8
    { type: 'play-move', fen: FEN.dev3_after_Ng3, correctMove: 'Re8', prompt: 'The knight went to g3. What do you play?', hint: 'Get the rook active on the open file.', correctFeedback: 'Re8 activates the rook on the e-file.', wrongFeedback: 'Play Re8 — the e-file is your best file for the rook.' },
    { type: 'instruction', fen: FEN.dev3_after_Re8, text: 'Re8 puts pressure down the e-file. The e3 pawn could become a target later.', arrow: ['f8', 'e8'] },

    // White plays Bd3
    { type: 'instruction', fen: FEN.dev3_after_Re8, text: 'White develops the bishop to d3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 3: Nbd7
    { type: 'play-move', fen: FEN.dev3_after_Bd3, correctMove: 'Nbd7', prompt: "White's bishop is on d3. How do you continue?", hint: 'Develop the last knight.', correctFeedback: 'Nbd7 completes development — all your pieces are in the game.', wrongFeedback: 'Play Nbd7 — bring the last piece out.' },
    { type: 'instruction', fen: FEN.dev3_after_Nbd7, text: 'Nbd7 finishes development. You have a solid, well-coordinated position with no weaknesses.', arrow: ['b8', 'd7'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev3_after_b4, text: 'Play all three responses from memory.' },
    { type: 'play-move', fen: FEN.dev3_after_b4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.dev3_after_c6, text: 'Ng3.', autoAdvance: 800, highlightSquares: ['e2', 'g3'] },
    { type: 'play-move', fen: FEN.dev3_after_Ng3, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.dev3_after_Re8, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev3_after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    { type: 'instruction', fen: FEN.dev3_after_Nbd7, text: "Against b4, just stay calm — c6, Re8, Nbd7. Solid development beats queenside expansion." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nis-4: Knight Maneuver (Nf8, Ne6, dxe4)
// ═══════════════════════════════════════════════════════════

const NIS_4: OpeningLesson = {
  id: 'nis-4',
  title: 'Knight Maneuver',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nbd7, text: "White pushes f3 and retreats the bishop. You'll reroute the knight to e6 and then strike in the center." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nbd7, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Nf4.', autoAdvance: 800, highlightSquares: ['e2', 'f4'] },
    { type: 'play-move', fen: FEN.after_Nf4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },

    // White plays 11.f3
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'White pushes f3, supporting the center and preparing to expand.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 1: Nf8
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Nf8', prompt: 'White played f3. Where does your knight go?', hint: 'Start rerouting the d7 knight — it has a better square.', correctFeedback: 'Nf8 starts the classic knight maneuver toward e6.', wrongFeedback: 'Play Nf8 — reroute the knight to a stronger outpost.' },
    { type: 'instruction', fen: FEN.after_Nf8, text: 'Nf8 looks like a retreat, but the knight is heading for e6 — a much better square where it controls d4 and f4.', arrow: ['d7', 'f8'] },

    // White plays 12.Bc2
    { type: 'instruction', fen: FEN.after_Nf8, text: 'White retreats the bishop to c2, clearing d3.', autoAdvance: 800, highlightSquares: ['d3', 'c2'] },

    // PREDICT 2: Ne6
    { type: 'play-move', fen: FEN.after_Bc2, correctMove: 'Ne6', prompt: "The bishop moved. Where does the knight land?", hint: 'Jump the knight to the outpost you prepared.', correctFeedback: 'Ne6 reaches the ideal square — controlling d4 and pressuring f4.', wrongFeedback: 'Play Ne6 — that powerful central outpost.' },
    { type: 'instruction', fen: FEN.after_Ne6, text: 'Ne6 is the payoff. The knight controls d4 and attacks the f4 knight. This is a classic Nimzo maneuver.', arrow: ['f8', 'e6'] },

    // White plays 13.e4
    { type: 'instruction', fen: FEN.after_Ne6, text: 'White pushes e4, challenging your center.', autoAdvance: 800, highlightSquares: ['e3', 'e4'] },

    // PREDICT 3: dxe4
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'dxe4', prompt: 'White pushed e4 into your d5 pawn. How do you respond?', hint: 'Capture the pawn and open lines for your pieces.', correctFeedback: 'dxe4 captures and opens the position for your well-placed knight.', wrongFeedback: 'Play dxe4 — take the pawn while your knight is perfectly placed on e6.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4 opens the position at the right moment. Your knight on e6 and rook on e8 are perfectly placed for the open game.', arrow: ['d5', 'e4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'Replay these three moves from memory.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Nf8', prompt: 'Your move.', hint: 'Nf8.', correctFeedback: 'Nf8.', wrongFeedback: 'Nf8.' },
    { type: 'instruction', fen: FEN.after_Nf8, text: 'Bc2.', autoAdvance: 800, highlightSquares: ['d3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Bc2, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_Ne6, text: 'e4.', autoAdvance: 800, highlightSquares: ['e3', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'dxe4', prompt: 'Your move.', hint: 'dxe4.', correctFeedback: 'dxe4.', wrongFeedback: 'dxe4.' },

    { type: 'instruction', fen: FEN.after_dxe4, text: "Nf8, Ne6, dxe4 — the knight maneuver followed by the central break. You've mastered the Saemisch." },
  ],
}


// ═══════════════════════════════════════════════════════════
// nis-test-1: Level Test
// Tests both main line and deviation responses.
// All play-move with zero guidance.
// ═══════════════════════════════════════════════════════════

const NIS_TEST_1: OpeningLesson = {
  id: 'nis-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE ===
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Nf4.', autoAdvance: 800, highlightSquares: ['e2', 'f4'] },
    { type: 'play-move', fen: FEN.after_Nf4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.after_Re8, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO2, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Nbd7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.after_f3, correctMove: 'Nf8', prompt: 'Your move.', hint: 'Nf8.', correctFeedback: 'Nf8.', wrongFeedback: 'Nf8.' },
    { type: 'instruction', fen: FEN.after_Nf8, text: 'Bc2.', autoAdvance: 800, highlightSquares: ['d3', 'c2'] },
    { type: 'play-move', fen: FEN.after_Bc2, correctMove: 'Ne6', prompt: 'Your move.', hint: 'Ne6.', correctFeedback: 'Ne6.', wrongFeedback: 'Ne6.' },
    { type: 'instruction', fen: FEN.after_Ne6, text: 'e4.', autoAdvance: 800, highlightSquares: ['e3', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'dxe4', prompt: 'Your move.', hint: 'dxe4.', correctFeedback: 'dxe4.', wrongFeedback: 'dxe4.' },

    // === DEVIATION: 7.Nf4 instead of 7.cxd5 ===
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Nf4.', autoAdvance: 800, highlightSquares: ['e2', 'f4'] },
    { type: 'play-move', fen: FEN.dev2_after_Nf4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.dev2_after_c6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev2_after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.dev2_after_Nbd7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.dev2_after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    // === DEVIATION: 8.b4 instead of 8.Nf4 ===
    { type: 'instruction', fen: FEN.start, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Bb4', prompt: 'Your move.', hint: 'Bb4.', correctFeedback: 'Bb4.', wrongFeedback: 'Bb4.' },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['g1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'b4.', autoAdvance: 800, highlightSquares: ['b2', 'b4'] },
    { type: 'play-move', fen: FEN.dev3_after_b4, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.dev3_after_c6, text: 'Ng3.', autoAdvance: 800, highlightSquares: ['e2', 'g3'] },
    { type: 'play-move', fen: FEN.dev3_after_Ng3, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.dev3_after_Re8, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.dev3_after_Bd3, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// Lookup function
// ═══════════════════════════════════════════════════════════

export function getNimzoIndianSaemischLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'nis-1': return NIS_1
    case 'nis-2': return NIS_2
    case 'nis-3': return NIS_3
    case 'nis-dev-Nf4': return NIS_DEV_NF4
    case 'nis-dev-b4': return NIS_DEV_B4
    case 'nis-4': return NIS_4
    case 'nis-test-1': return NIS_TEST_1
    default: return undefined
  }
}
