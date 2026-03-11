import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SCOTCH GAME LESSONS — v2 (Predict/Reveal format)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6
//            6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6 9.b3 g6 10.f4 d6 11.Qf2 Nf6 12.Be2
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Lesson 1: Nxd4, Nxc6, e5
  after_exd4:       'r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  after_Nxd4:       'r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  after_Nf6:        'r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  after_Nxc6:       'r1bqkb1r/pppp1ppp/2N2n2/8/4P3/8/PPP2PPP/RNBQKB1R b KQkq - 0 5',
  after_bxc6:       'r1bqkb1r/p1pp1ppp/2p2n2/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 6',
  after_e5_push:    'r1bqkb1r/p1pp1ppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R b KQkq - 0 6',

  // Lesson 2: Qe2, c4, b3
  after_Qe7:        'r1b1kb1r/p1ppqppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R w KQkq - 1 7',
  after_Qe2:        'r1b1kb1r/p1ppqppp/2p2n2/4P3/8/8/PPP1QPPP/RNB1KB1R b KQkq - 2 7',
  after_Nd5:        'r1b1kb1r/p1ppqppp/2p5/3nP3/8/8/PPP1QPPP/RNB1KB1R w KQkq - 3 8',
  after_c4:         'r1b1kb1r/p1ppqppp/2p5/3nP3/2P5/8/PP2QPPP/RNB1KB1R b KQkq - 0 8',
  after_Ba6:        'r3kb1r/p1ppqppp/b1p5/3nP3/2P5/8/PP2QPPP/RNB1KB1R w KQkq - 1 9',
  after_b3:         'r3kb1r/p1ppqppp/b1p5/3nP3/2P5/1P6/P3QPPP/RNB1KB1R b KQkq - 0 9',

  // Lesson 3: f4, Qf2, Be2
  after_g6:         'r3kb1r/p1ppqp1p/b1p3p1/3nP3/2P5/1P6/P3QPPP/RNB1KB1R w KQkq - 0 10',
  after_f4:         'r3kb1r/p1ppqp1p/b1p3p1/3nP3/2P2P2/1P6/P3Q1PP/RNB1KB1R b KQkq - 0 10',
  after_d6:         'r3kb1r/p1p1qp1p/b1pp2p1/3nP3/2P2P2/1P6/P3Q1PP/RNB1KB1R w KQkq - 0 11',
  after_Qf2:        'r3kb1r/p1p1qp1p/b1pp2p1/3nP3/2P2P2/1P6/P4QPP/RNB1KB1R b KQkq - 1 11',
  after_Nf6_late:   'r3kb1r/p1p1qp1p/b1pp1np1/4P3/2P2P2/1P6/P4QPP/RNB1KB1R w KQkq - 2 12',
  after_Be2:        'r3kb1r/p1p1qp1p/b1pp1np1/4P3/2P2P2/1P6/P3BQPP/RNB1K2R b KQkq - 3 12',

  // Deviation: 8...Nb6 (instead of 8...Ba6)
  dev_nb6_after_Nb6:  'r1b1kb1r/p1ppqppp/1np5/4P3/2P5/8/PP2QPPP/RNB1KB1R w KQkq - 1 9',
  dev_nb6_after_Nc3:  'r1b1kb1r/p1ppqppp/1np5/4P3/2P5/2N5/PP2QPPP/R1B1KB1R b KQkq - 2 9',
  dev_nb6_after_Qe6:  'r1b1kb1r/p1pp1ppp/1np1q3/4P3/2P5/2N5/PP2QPPP/R1B1KB1R w KQkq - 3 10',
  dev_nb6_after_Qe4:  'r1b1kb1r/p1pp1ppp/1np1q3/4P3/2P1Q3/2N5/PP3PPP/R1B1KB1R b KQkq - 4 10',
  dev_nb6_after_g6:   'r1b1kb1r/p1pp1p1p/1np1q1p1/4P3/2P1Q3/2N5/PP3PPP/R1B1KB1R w KQkq - 0 11',
  dev_nb6_after_Bd3:  'r1b1kb1r/p1pp1p1p/1np1q1p1/4P3/2P1Q3/2NB4/PP3PPP/R1B1K2R b KQkq - 1 11',

  // Deviation: 9...O-O-O (instead of 9...g6)
  dev_ooo_after_OOO:  '2kr1b1r/p1ppqppp/b1p5/3nP3/2P5/1P6/P3QPPP/RNB1KB1R w KQ - 1 10',
  dev_ooo_after_g3:   '2kr1b1r/p1ppqppp/b1p5/3nP3/2P5/1P4P1/P3QP1P/RNB1KB1R b KQ - 0 10',
  dev_ooo_after_g5:   '2kr1b1r/p1ppqp1p/b1p5/3nP1p1/2P5/1P4P1/P3QP1P/RNB1KB1R w KQ - 0 11',
  dev_ooo_after_Bb2:  '2kr1b1r/p1ppqp1p/b1p5/3nP1p1/2P5/1P4P1/PB2QP1P/RN2KB1R b KQ - 1 11',
  dev_ooo_after_Bg7:  '2kr3r/p1ppqpbp/b1p5/3nP1p1/2P5/1P4P1/PB2QP1P/RN2KB1R w KQ - 2 12',
  dev_ooo_after_Nd2:  '2kr3r/p1ppqpbp/b1p5/3nP1p1/2P5/1P4P1/PB1NQP1P/R3KB1R b KQ - 3 12',
}


// ═══════════════════════════════════════════════════════════
// sc-1: THE SCOTCH GAMBIT (Nxd4, Nxc6, e5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SC_LESSON_1: OpeningLesson = {
  id: 'sc-1',
  title: 'The Scotch Gambit',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_exd4, text: "The Scotch Game starts after 1.e4 e5 2.Nf3 Nc6 3.d4 exd4. Black took your pawn — time to take it back and seize the center." },

    // PREDICT 1: Nxd4
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: "Black captured on d4. How do you recapture?", hint: 'Your knight on f3 can take back on d4.', correctFeedback: 'Nxd4 recaptures and puts your knight right in the center.', wrongFeedback: 'Take back with the knight — Nxd4.', postMoveArrow: ['d4', 'c6'] },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4 plants your knight in the center. From d4 it controls key squares and eyes the c6 knight.', arrow: ['f3', 'd4'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Black develops the knight to f6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 2: Nxc6
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nxc6', prompt: "Your knight is being challenged. What's the best trade?", hint: 'Trade on c6 to damage Black\'s pawn structure.', correctFeedback: 'Nxc6 trades knights and doubles Black\'s c-pawns.', wrongFeedback: 'Capture the knight on c6 — it wrecks Black\'s pawns.', postMoveArrow: ['c6', 'c7'] },
    { type: 'instruction', fen: FEN.after_Nxc6, text: 'Nxc6 forces bxc6, giving Black doubled pawns on the c-file. That weakness lasts the whole game.', arrow: ['d4', 'c6'] },

    // Black plays bxc6
    { type: 'instruction', fen: FEN.after_Nxc6, text: 'bxc6 — Black recaptures but the pawns are doubled.', autoAdvance: 800, highlightSquares: ['b7', 'c6'] },

    // PREDICT 3: e5
    { type: 'play-move', fen: FEN.after_bxc6, correctMove: 'e5', prompt: "Black's knight is on f6. How do you attack it?", hint: 'Push your e-pawn forward to chase the knight.', correctFeedback: 'e5 kicks the knight and grabs space in the center.', wrongFeedback: 'Push e5 to attack the knight on f6.', postMoveArrow: ['e5', 'f6'] },
    { type: 'instruction', fen: FEN.after_e5_push, text: 'e5 gains space and forces the knight to move. Black is already under pressure with doubled pawns and a displaced knight.', arrow: ['e4', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_exd4, text: "Now play it from memory." },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },
    { type: 'instruction', fen: FEN.after_Nxc6, text: 'bxc6.', autoAdvance: 800, highlightSquares: ['b7', 'c6'] },
    { type: 'play-move', fen: FEN.after_bxc6, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    { type: 'instruction', fen: FEN.after_e5_push, text: "Nxd4, Nxc6, e5 — that's the Scotch Game. You traded knights, doubled Black's pawns, and grabbed the center." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-2: THE CENTER PUSH (Qe2, c4, b3)
// ═══════════════════════════════════════════════════════════

const SC_LESSON_2: OpeningLesson = {
  id: 'sc-2',
  title: 'The Center Push',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_e5_push, text: "Black's queen comes to e7 to challenge your e5 pawn. You'll meet it with your own queen, then push Black's knight around." },

    // RECAP
    { type: 'instruction', fen: FEN.after_exd4, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },
    { type: 'instruction', fen: FEN.after_Nxc6, text: 'bxc6.', autoAdvance: 800, highlightSquares: ['b7', 'c6'] },
    { type: 'play-move', fen: FEN.after_bxc6, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // Black plays Qe7
    { type: 'instruction', fen: FEN.after_e5_push, text: 'Black plays Qe7, pinning your e5 pawn to your king.', autoAdvance: 800, highlightSquares: ['d8', 'e7'] },

    // PREDICT 1: Qe2
    { type: 'play-move', fen: FEN.after_Qe7, correctMove: 'Qe2', prompt: "Black's queen eyes your e5 pawn. How do you defend it?", hint: 'Mirror Black — bring your queen to e2 to support e5.', correctFeedback: 'Qe2 defends e5 and keeps the queens lined up on the e-file.', wrongFeedback: 'Play Qe2 to defend the e5 pawn.', postMoveArrow: ['e2', 'e5'] },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Qe2 supports e5 and keeps the queens facing each other. Black has to deal with the pawn cramp.', arrow: ['d1', 'e2'] },

    // Black plays Nd5
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Black jumps the knight to d5, a central outpost.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },

    // PREDICT 2: c4
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'c4', prompt: "The knight just landed on d5. How do you kick it?", hint: 'Attack the knight with a pawn from c2.', correctFeedback: 'c4 attacks the knight and claims more space in the center.', wrongFeedback: 'Push c4 to chase the knight off d5.', postMoveArrow: ['c4', 'd5'] },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4 kicks the knight from its central post. Black has to retreat or go sideways.', arrow: ['c2', 'c4'] },

    // Black plays Ba6
    { type: 'instruction', fen: FEN.after_c4, text: 'Black develops the bishop to a6, targeting your c4 pawn.', autoAdvance: 800, highlightSquares: ['c8', 'a6'] },

    // PREDICT 3: b3
    { type: 'play-move', fen: FEN.after_Ba6, correctMove: 'b3', prompt: "Black's bishop is eyeing c4. How do you protect it?", hint: 'Support the c4 pawn with b3.', correctFeedback: 'b3 solidifies the pawn chain and prepares to develop the bishop.', wrongFeedback: 'Play b3 to support c4 and prepare Bb2.', postMoveArrow: ['b3', 'c4'] },
    { type: 'instruction', fen: FEN.after_b3, text: 'b3 shores up c4 and opens the diagonal for your bishop. A solid, patient move.', arrow: ['b2', 'b3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e5_push, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_e5_push, text: 'Qe7.', autoAdvance: 800, highlightSquares: ['d8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Qe7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'Ba6.', autoAdvance: 800, highlightSquares: ['c8', 'a6'] },
    { type: 'play-move', fen: FEN.after_Ba6, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },

    { type: 'instruction', fen: FEN.after_b3, text: "Qe2, c4, b3 — you defended e5, kicked the knight, and locked down the center." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-3: THE BUILDUP (f4, Qf2, Be2)
// ═══════════════════════════════════════════════════════════

const SC_LESSON_3: OpeningLesson = {
  id: 'sc-3',
  title: 'The Buildup',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_b3, text: "Black fianchettoes with g6 and challenges your center with d6. You'll reinforce e5, reposition the queen, and develop the bishop." },

    // RECAP
    { type: 'instruction', fen: FEN.after_e5_push, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_e5_push, text: 'Qe7.', autoAdvance: 800, highlightSquares: ['d8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Qe7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'Ba6.', autoAdvance: 800, highlightSquares: ['c8', 'a6'] },
    { type: 'play-move', fen: FEN.after_Ba6, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },

    // Black plays g6
    { type: 'instruction', fen: FEN.after_b3, text: 'Black plays g6, preparing to fianchetto the bishop.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },

    // PREDICT 1: f4
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'f4', prompt: "Your e5 pawn is the anchor of your position. How do you reinforce it?", hint: 'Support e5 with your f-pawn.', correctFeedback: 'f4 locks down the e5 pawn and controls the dark squares.', wrongFeedback: 'Push f4 to support e5 — keep that pawn strong.', postMoveArrow: ['f4', 'e5'] },
    { type: 'instruction', fen: FEN.after_f4, text: 'f4 makes e5 rock-solid. The pawn chain f4-e5 gives you a space advantage on the kingside.', arrow: ['f2', 'f4'] },

    // Black plays d6
    { type: 'instruction', fen: FEN.after_f4, text: 'Black challenges your center with d6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 2: Qf2
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'Qf2', prompt: "Your queen on e2 is blocking your bishop. Where does it go?", hint: 'Move the queen to f2 — it stays active and clears e2 for the bishop.', correctFeedback: 'Qf2 clears the e2 square for your bishop and keeps the queen active.', wrongFeedback: 'Slide the queen to f2 — it opens up the e2 square.', postMoveArrow: ['f2', 'b6'] },
    { type: 'instruction', fen: FEN.after_Qf2, text: 'Qf2 gets out of the bishop\'s way and watches the b6 square. A multi-purpose move.', arrow: ['e2', 'f2'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.after_Qf2, text: 'Black retreats the knight to f6.', autoAdvance: 800, highlightSquares: ['d5', 'f6'] },

    // PREDICT 3: Be2
    { type: 'play-move', fen: FEN.after_Nf6_late, correctMove: 'Be2', prompt: "Time to develop your bishop. Where does it belong?", hint: 'Put the bishop on e2 — a flexible square that prepares castling.', correctFeedback: 'Be2 develops the bishop and prepares to castle kingside.', wrongFeedback: 'Develop the bishop to e2 — it\'s flexible and prepares O-O.', postMoveArrow: ['e2', 'a6'] },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2 develops the last minor piece and prepares to castle. Your position is solid and well-coordinated.', arrow: ['f1', 'e2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_b3, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_b3, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'f4', prompt: 'Your move.', hint: 'f4.', correctFeedback: 'f4.', wrongFeedback: 'f4.' },
    { type: 'instruction', fen: FEN.after_f4, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'Qf2', prompt: 'Your move.', hint: 'Qf2.', correctFeedback: 'Qf2.', wrongFeedback: 'Qf2.' },
    { type: 'instruction', fen: FEN.after_Qf2, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['d5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6_late, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },

    { type: 'instruction', fen: FEN.after_Be2, text: "f4, Qf2, Be2 — you reinforced the center, repositioned the queen, and finished development. Ready to castle." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-dev-nb6: If 8...Nb6 (instead of 8...Ba6)
// White responds: Nc3, Qe4, Bd3
// ═══════════════════════════════════════════════════════════

const SC_DEV_NB6: OpeningLesson = {
  id: 'sc-dev-nb6',
  title: 'If 8...Nb6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_c4, text: "After c4, Black sometimes retreats the knight to b6 instead of developing the bishop to a6. Here's how to handle it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_e5_push, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_e5_push, text: 'Qe7.', autoAdvance: 800, highlightSquares: ['d8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Qe7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },

    // DEVIATION: 8...Nb6 instead of Ba6
    { type: 'instruction', fen: FEN.after_c4, text: 'Black plays Nb6 instead of Ba6 — retreating the knight to the rim.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },

    // PREDICT 1: Nc3
    { type: 'play-move', fen: FEN.dev_nb6_after_Nb6, correctMove: 'Nc3', prompt: "Black moved the knight to the edge. What's your best developing move?", hint: 'Develop your knight to c3 — it covers e4 and d5.', correctFeedback: 'Nc3 develops and controls key central squares.', wrongFeedback: 'Bring the knight to c3 — it covers the center.', postMoveArrow: ['c3', 'd5'] },
    { type: 'instruction', fen: FEN.dev_nb6_after_Nc3, text: 'Nc3 develops naturally. The knight eyes d5 and e4 while Black\'s knight sits passively on b6.', arrow: ['b1', 'c3'] },

    // Black plays Qe6
    { type: 'instruction', fen: FEN.dev_nb6_after_Nc3, text: 'Black brings the queen to e6, centralizing.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },

    // PREDICT 2: Qe4
    { type: 'play-move', fen: FEN.dev_nb6_after_Qe6, correctMove: 'Qe4', prompt: "Black centralized the queen. How do you match it?", hint: 'Centralize your own queen — Qe4 is powerful here.', correctFeedback: 'Qe4 centralized your queen, pressing the center and eyeing both flanks.', wrongFeedback: 'Play Qe4 — centralize and keep the pressure on.', postMoveArrow: ['e4', 'a8'] },
    { type: 'instruction', fen: FEN.dev_nb6_after_Qe4, text: 'Qe4 puts your queen on a dominant central square. It eyes the queenside and supports e5.', arrow: ['e2', 'e4'] },

    // Black plays g6
    { type: 'instruction', fen: FEN.dev_nb6_after_Qe4, text: 'Black plays g6, preparing to develop the bishop.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },

    // PREDICT 3: Bd3
    { type: 'play-move', fen: FEN.dev_nb6_after_g6, correctMove: 'Bd3', prompt: "Time to develop the bishop. Where does it go?", hint: 'Bd3 is active — it watches the kingside diagonals.', correctFeedback: 'Bd3 develops the bishop toward the kingside with attacking potential.', wrongFeedback: 'Put the bishop on d3 — it aims at the kingside.', postMoveArrow: ['d3', 'h7'] },
    { type: 'instruction', fen: FEN.dev_nb6_after_Bd3, text: 'Bd3 develops with purpose. The bishop aims at h7 and supports future kingside play.', arrow: ['f1', 'd3'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_nb6_after_Nb6, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev_nb6_after_Nb6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_nb6_after_Nc3, text: 'Qe6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.dev_nb6_after_Qe6, correctMove: 'Qe4', prompt: 'Your move.', hint: 'Qe4.', correctFeedback: 'Qe4.', wrongFeedback: 'Qe4.' },
    { type: 'instruction', fen: FEN.dev_nb6_after_Qe4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.dev_nb6_after_g6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    { type: 'instruction', fen: FEN.dev_nb6_after_Bd3, text: "Against 8...Nb6: Nc3, Qe4, Bd3. Develop, centralize the queen, and aim the bishop at the kingside." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-dev-ooo: If 9...O-O-O (instead of 9...g6)
// White responds: g3, Bb2, Nd2
// ═══════════════════════════════════════════════════════════

const SC_DEV_OOO: OpeningLesson = {
  id: 'sc-dev-ooo',
  title: 'If 9...O-O-O',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_b3, text: "Instead of g6, Black sometimes castles queenside right away. The king goes to the other side of the board — here's your plan." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_e5_push, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_e5_push, text: 'Qe7.', autoAdvance: 800, highlightSquares: ['d8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Qe7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'Ba6.', autoAdvance: 800, highlightSquares: ['c8', 'a6'] },
    { type: 'play-move', fen: FEN.after_Ba6, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },

    // DEVIATION: 9...O-O-O
    { type: 'instruction', fen: FEN.after_b3, text: 'Black castles queenside instead of playing g6.', autoAdvance: 800, highlightSquares: ['e8', 'c8'] },

    // PREDICT 1: g3
    { type: 'play-move', fen: FEN.dev_ooo_after_OOO, correctMove: 'g3', prompt: "Black castled queenside. How do you prepare your bishop?", hint: 'Fianchetto with g3 — the bishop will go to g2.', correctFeedback: 'g3 prepares the fianchetto. The bishop on g2 will control the long diagonal.', wrongFeedback: 'Play g3 to set up the fianchetto.', postMoveArrow: ['g3', 'g2'] },
    { type: 'instruction', fen: FEN.dev_ooo_after_g3, text: 'g3 prepares Bg2, aiming the bishop down the long diagonal toward Black\'s queenside.', arrow: ['g2', 'g3'] },

    // Black plays g5
    { type: 'instruction', fen: FEN.dev_ooo_after_g3, text: 'Black pushes g5, grabbing kingside space.', autoAdvance: 800, highlightSquares: ['g7', 'g5'] },

    // PREDICT 2: Bb2
    { type: 'play-move', fen: FEN.dev_ooo_after_g5, correctMove: 'Bb2', prompt: "Your b3 pawn opened a diagonal. Develop the bishop!", hint: 'Bb2 puts the bishop on a strong diagonal.', correctFeedback: 'Bb2 develops to the long diagonal, aiming at Black\'s kingside.', wrongFeedback: 'Play Bb2 — the long diagonal is wide open.', postMoveArrow: ['b2', 'g7'] },
    { type: 'instruction', fen: FEN.dev_ooo_after_Bb2, text: 'Bb2 controls the long diagonal. With Black\'s king on c8, this bishop could become very dangerous.', arrow: ['c1', 'b2'] },

    // Black plays Bg7
    { type: 'instruction', fen: FEN.dev_ooo_after_Bb2, text: 'Black develops the bishop to g7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },

    // PREDICT 3: Nd2
    { type: 'play-move', fen: FEN.dev_ooo_after_Bg7, correctMove: 'Nd2', prompt: "Keep developing. Where does your knight go?", hint: 'Nd2 develops and supports the center.', correctFeedback: 'Nd2 brings the knight into the game and supports e4/f3 squares.', wrongFeedback: 'Develop the knight to d2.', postMoveArrow: ['d2', 'e4'] },
    { type: 'instruction', fen: FEN.dev_ooo_after_Nd2, text: 'Nd2 completes development. The knight can reroute to e4 or f3 depending on what Black does.', arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_ooo_after_OOO, text: "Let's see what you're made of." },
    { type: 'play-move', fen: FEN.dev_ooo_after_OOO, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.dev_ooo_after_g3, text: 'g5.', autoAdvance: 800, highlightSquares: ['g7', 'g5'] },
    { type: 'play-move', fen: FEN.dev_ooo_after_g5, correctMove: 'Bb2', prompt: 'Your move.', hint: 'Bb2.', correctFeedback: 'Bb2.', wrongFeedback: 'Bb2.' },
    { type: 'instruction', fen: FEN.dev_ooo_after_Bb2, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.dev_ooo_after_Bg7, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    { type: 'instruction', fen: FEN.dev_ooo_after_Nd2, text: "Against 9...O-O-O: g3, Bb2, Nd2. Fianchetto, develop the bishop, and bring in the knight." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-test-1: Level Test (main line + deviations)
// ═══════════════════════════════════════════════════════════

const SC_TEST_1: OpeningLesson = {
  id: 'sc-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE (9 White moves) ===
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },
    { type: 'instruction', fen: FEN.after_Nxc6, text: 'bxc6.', autoAdvance: 800, highlightSquares: ['b7', 'c6'] },
    { type: 'play-move', fen: FEN.after_bxc6, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5_push, text: 'Qe7.', autoAdvance: 800, highlightSquares: ['d8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Qe7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Nd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },
    { type: 'instruction', fen: FEN.after_c4, text: 'Ba6.', autoAdvance: 800, highlightSquares: ['c8', 'a6'] },
    { type: 'play-move', fen: FEN.after_Ba6, correctMove: 'b3', prompt: 'Your move.', hint: 'b3.', correctFeedback: 'b3.', wrongFeedback: 'b3.' },
    { type: 'instruction', fen: FEN.after_b3, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'f4', prompt: 'Your move.', hint: 'f4.', correctFeedback: 'f4.', wrongFeedback: 'f4.' },
    { type: 'instruction', fen: FEN.after_f4, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'Qf2', prompt: 'Your move.', hint: 'Qf2.', correctFeedback: 'Qf2.', wrongFeedback: 'Qf2.' },
    { type: 'instruction', fen: FEN.after_Qf2, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['d5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6_late, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },

    // === DEVIATION TEST: 8...Nb6 ===
    { type: 'instruction', fen: FEN.after_c4, text: 'But wait — Black plays Nb6 instead.', autoAdvance: 800, highlightSquares: ['d5', 'b6'] },
    { type: 'play-move', fen: FEN.dev_nb6_after_Nb6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_nb6_after_Nc3, text: 'Qe6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.dev_nb6_after_Qe6, correctMove: 'Qe4', prompt: 'Your move.', hint: 'Qe4.', correctFeedback: 'Qe4.', wrongFeedback: 'Qe4.' },
    { type: 'instruction', fen: FEN.dev_nb6_after_Qe4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.dev_nb6_after_g6, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },

    // === DEVIATION TEST: 9...O-O-O ===
    { type: 'instruction', fen: FEN.after_b3, text: 'Now Black castles queenside instead.', autoAdvance: 800, highlightSquares: ['e8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_ooo_after_OOO, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.dev_ooo_after_g3, text: 'g5.', autoAdvance: 800, highlightSquares: ['g7', 'g5'] },
    { type: 'play-move', fen: FEN.dev_ooo_after_g5, correctMove: 'Bb2', prompt: 'Your move.', hint: 'Bb2.', correctFeedback: 'Bb2.', wrongFeedback: 'Bb2.' },
    { type: 'instruction', fen: FEN.dev_ooo_after_Bb2, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.dev_ooo_after_Bg7, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

export function getScotchLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'sc-1': return SC_LESSON_1
    case 'sc-2': return SC_LESSON_2
    case 'sc-3': return SC_LESSON_3
    case 'sc-dev-nb6': return SC_DEV_NB6
    case 'sc-dev-ooo': return SC_DEV_OOO
    case 'sc-test-1': return SC_TEST_1
    default: return undefined
  }
}
