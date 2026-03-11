import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// LONDON SYSTEM LESSONS — Predict/Reveal format
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.d4 d5 2.Bf4 Nf6 3.e3 c5 4.c3 Nc6 5.Nd2 Bf5 6.Ngf3 Qb6
//            7.Nh4 Bd7 8.Qb3 c4 9.Qc2 Nh5 10.Bg3 Nxg3 11.hxg3
//
// Identity moves: 1.d4 d5 2.Bf4 Nf6 3.e3
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity positions
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:         'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_d5:         'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  after_Bf4:        'rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2',
  after_Nf6:        'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3',
  after_e3:         'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq - 0 3',

  // Lesson 1: e3, c3, Nd2
  after_c5:         'rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4',
  after_c3:         'rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR b KQkq - 0 4',
  after_Nc6:        'r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR w KQkq - 1 5',
  after_Nd2:        'r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP1N1PPP/R2QKBNR b KQkq - 2 5',

  // Lesson 2: Ngf3, Nh4, Qb3
  after_Bf5:        'r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1P3/PP1N1PPP/R2QKBNR w KQkq - 3 6',
  after_Ngf3:       'r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 4 6',
  after_Qb6:        'r3kb1r/pp2pppp/1qn2n2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 5 7',
  after_Nh4:        'r3kb1r/pp2pppp/1qn2n2/2pp1b2/3P1B1N/2P1P3/PP1N1PPP/R2QKB1R b KQkq - 6 7',
  after_Bd7:        'r3kb1r/pp1bpppp/1qn2n2/2pp4/3P1B1N/2P1P3/PP1N1PPP/R2QKB1R w KQkq - 7 8',
  after_Qb3:        'r3kb1r/pp1bpppp/1qn2n2/2pp4/3P1B1N/1QP1P3/PP1N1PPP/R3KB1R b KQkq - 8 8',

  // Lesson 3: Qc2, Bg3, hxg3
  after_c4:         'r3kb1r/pp1bpppp/1qn2n2/3p4/2pP1B1N/1QP1P3/PP1N1PPP/R3KB1R w KQkq - 0 9',
  after_Qc2:        'r3kb1r/pp1bpppp/1qn2n2/3p4/2pP1B1N/2P1P3/PPQN1PPP/R3KB1R b KQkq - 1 9',
  after_Nh5:        'r3kb1r/pp1bpppp/1qn5/3p3n/2pP1B1N/2P1P3/PPQN1PPP/R3KB1R w KQkq - 2 10',
  after_Bg3:        'r3kb1r/pp1bpppp/1qn5/3p3n/2pP3N/2P1P1B1/PPQN1PPP/R3KB1R b KQkq - 3 10',
  after_Nxg3:       'r3kb1r/pp1bpppp/1qn5/3p4/2pP3N/2P1P1n1/PPQN1PPP/R3KB1R w KQkq - 0 11',
  after_hxg3:       'r3kb1r/pp1bpppp/1qn5/3p4/2pP3N/2P1P1P1/PPQN1PP1/R3KB1R b KQkq - 0 11',

  // Deviation 1: 3...e6 instead of 3...c5 (28%)
  // After identity (d4 d5 Bf4 Nf6 e3), Black plays e6 instead of c5
  // White's 3 moves: Nf3, c3, Nbd2
  dev1_after_e6:    'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4',
  dev1_after_Nf3:   'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R b KQkq - 1 4',
  dev1_after_c5:    'rnbqkb1r/pp3ppp/4pn2/2pp4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 5',
  dev1_after_c3:    'rnbqkb1r/pp3ppp/4pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R b KQkq - 0 5',
  dev1_after_Nc6:   'r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R w KQkq - 1 6',
  dev1_after_Nbd2:  'r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 2 6',

  // Deviation 2: 6...e6 instead of 6...Qb6 (44%)
  // After main line through Ngf3, Black plays e6 instead of Qb6
  // White's 3 moves: Qb3, Qxb6, Nh4
  dev2_after_e6:    'r2qkb1r/pp3ppp/2n1pn2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 0 7',
  dev2_after_Qb3:   'r2qkb1r/pp3ppp/2n1pn2/2pp1b2/3P1B2/1QP1PN2/PP1N1PPP/R3KB1R b KQkq - 1 7',
  dev2_after_Qb6:   'r3kb1r/pp3ppp/1qn1pn2/2pp1b2/3P1B2/1QP1PN2/PP1N1PPP/R3KB1R w KQkq - 2 8',
  dev2_after_Qxb6:  'r3kb1r/pp3ppp/1Qn1pn2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R3KB1R b KQkq - 0 8',
  dev2_after_axb6:  'r3kb1r/1p3ppp/1pn1pn2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R3KB1R w KQkq - 0 9',
  dev2_after_Nh4:   'r3kb1r/1p3ppp/1pn1pn2/2pp1b2/3P1B1N/2P1P3/PP1N1PPP/R3KB1R b KQkq - 1 9',
}


// ═══════════════════════════════════════════════════════════
// ln-1: THE LONDON SETUP (e3, c3, Nd2)
// First lesson — no recap. Identity + Predict/Reveal + Recall.
// ═══════════════════════════════════════════════════════════

const LN_1: OpeningLesson = {
  id: 'ln-1',
  title: 'The London Setup',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Nf6, text: "The London System starts with d4 and Bf4. Now you'll learn the three moves that build an unbreakable pyramid in the center." },

    // PREDICT 1: e3
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: "Your bishop is developed. How do you solidify the center?", hint: 'Push the e-pawn one square to support d4 and free the light-squared bishop.', correctFeedback: 'e3 supports d4 and opens the diagonal for your light-squared bishop.', wrongFeedback: 'Push e3 to lock in the center and free your bishop.', postMoveArrow: ['e3', 'd4'] },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3 completes the London foundation. The d4 pawn is rock-solid with e3 behind it, and the f1 bishop can now develop.', arrow: ['e2', 'e3'] },

    // Black plays c5
    { type: 'instruction', fen: FEN.after_e3, text: "Black challenges your center with c5.", autoAdvance: 800, highlightSquares: ['c7', 'c5'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: "Black is pushing against your d4 pawn. How do you reinforce it?", hint: 'Support d4 with a pawn from c2.', correctFeedback: 'c3 locks down the d4 pawn and builds the London pyramid.', wrongFeedback: 'Push c3 to support your d4 pawn.', postMoveArrow: ['c3', 'd4'] },
    { type: 'instruction', fen: FEN.after_c3, text: 'c3 creates the London pyramid — pawns on c3, d4, and e3. This structure is very hard for Black to break down.', arrow: ['c2', 'c3'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.after_c3, text: 'Black develops the knight to c6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: Nd2
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nd2', prompt: "Time to develop a knight. Where does it belong?", hint: 'The knight on b1 goes to d2 — it supports the center and keeps lines open.', correctFeedback: 'Nd2 supports e4 and keeps the c-file clear for your queen.', wrongFeedback: 'Develop the knight to d2 — it supports the center from behind.', postMoveArrow: ['d2', 'e4'] },
    { type: 'instruction', fen: FEN.after_Nd2, text: "Nd2 is a London trademark. The knight supports a future e4 push and doesn't block the c-file for your queen.", arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nf6, text: "Now play it from memory." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nd2, text: "e3, c3, Nd2 — the London pyramid is set. Your center is solid and your pieces have room to develop." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ln-2: THE KNIGHT DANCE (Ngf3, Nh4, Qb3)
// ═══════════════════════════════════════════════════════════

const LN_2: OpeningLesson = {
  id: 'ln-2',
  title: 'The Knight Dance',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Nd2, text: "Black develops the bishop and queen. You'll bring out your second knight and leap it to h4 to challenge Black's bishop." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nf6, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    // Black plays Bf5
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Black develops the bishop to f5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },

    // PREDICT 1: Ngf3
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: "Your other knight needs to join the game. Where does it go?", hint: 'Develop the g1 knight to its natural square.', correctFeedback: 'Ngf3 develops the knight toward the center, controlling e5 and d4.', wrongFeedback: 'Bring the knight from g1 to f3 — the classic development square.', postMoveArrow: ['f3', 'e5'] },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Ngf3 completes your knight development. Both knights are active and supporting the center.', arrow: ['g1', 'f3'] },

    // Black plays Qb6
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Black brings the queen to b6, pressuring b2 and d4.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },

    // PREDICT 2: Nh4
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: "Black's bishop on f5 is active. How do you challenge it?", hint: 'Jump the f3 knight to h4 to threaten the bishop.', correctFeedback: "Nh4 attacks the bishop on f5. Black will have to move it or trade.", wrongFeedback: 'Leap the knight to h4 — it targets the f5 bishop directly.', postMoveArrow: ['h4', 'f5'] },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Nh4 forces a decision on the f5 bishop. If it retreats, your knight controls key squares. A typical London idea.', arrow: ['f3', 'h4'] },

    // Black plays Bd7
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Black retreats the bishop to d7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },

    // PREDICT 3: Qb3
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: "Black's queen is on b6. How do you contest it?", hint: 'Bring your queen to b3 — mirror Black and challenge along the b-file.', correctFeedback: 'Qb3 confronts the Black queen and puts pressure on the b7 pawn.', wrongFeedback: 'Play Qb3 to challenge the queen on b6.', postMoveArrow: ['b3', 'b7'] },
    { type: 'instruction', fen: FEN.after_Qb3, text: 'Qb3 challenges the Black queen and eyes the b7 pawn. Black will likely push c4 to escape the tension.', arrow: ['d1', 'b3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nd2, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Qb3, text: "Ngf3, Nh4, Qb3 — the knight dance is complete. You challenged the bishop and activated your queen." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ln-3: THE RECAPTURE (Qc2, Bg3, hxg3)
// ═══════════════════════════════════════════════════════════

const LN_3: OpeningLesson = {
  id: 'ln-3',
  title: 'The Recapture',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Qb3, text: "Black pushes c4 to chase your queen, then attacks your bishop. You'll reposition and recapture to open the h-file." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nf6, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },

    // Black plays c4
    { type: 'instruction', fen: FEN.after_Qb3, text: 'Black pushes c4, chasing your queen.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },

    // PREDICT 1: Qc2
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: "Your queen is under attack. Where does it retreat?", hint: 'The queen retreats to c2 — safe and still active.', correctFeedback: 'Qc2 keeps the queen centralized and ready to support e4 later.', wrongFeedback: 'Retreat the queen to c2 — it stays in the game from there.', postMoveArrow: ['c2', 'h7'] },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Qc2 is a safe retreat. The queen eyes the h7 pawn and supports a future e4 break.', arrow: ['b3', 'c2'] },

    // Black plays Nh5
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Black jumps Nh5, attacking your bishop on f4.', autoAdvance: 800, highlightSquares: ['f6', 'h5'] },

    // PREDICT 2: Bg3
    { type: 'play-move', fen: FEN.after_Nh5, correctMove: 'Bg3', prompt: "Your bishop is threatened by the knight on h5. Where does it go?", hint: 'Retreat the bishop to g3 — it stays active on the diagonal.', correctFeedback: 'Bg3 retreats to safety. If Black takes, you recapture with the h-pawn and open the file.', wrongFeedback: 'Move the bishop to g3 — it stays in the game.', postMoveArrow: ['g3', 'c7'] },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3 is the right retreat. The bishop stays active and if Nxg3, hxg3 opens the h-file for your rook.', arrow: ['f4', 'g3'] },

    // Black plays Nxg3
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Black takes the bishop with Nxg3.', autoAdvance: 800, highlightSquares: ['h5', 'g3'] },

    // PREDICT 3: hxg3
    { type: 'play-move', fen: FEN.after_Nxg3, correctMove: 'hxg3', prompt: "Your bishop was captured. How do you recapture?", hint: 'Take back with the h-pawn to open the h-file.', correctFeedback: 'hxg3 opens the h-file. Your rook will be a monster down that file.', wrongFeedback: 'Recapture with hxg3 to open the h-file for your rook.', postMoveArrow: ['h1', 'h8'] },
    { type: 'instruction', fen: FEN.after_hxg3, text: 'hxg3 opens the h-file. The rook on h1 now has a clear path to attack the Black king.', arrow: ['h2', 'g3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qb3, text: "Now play those three moves from memory." },
    { type: 'instruction', fen: FEN.after_Qb3, text: 'c4.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: 'Your move.', hint: 'Qc2.', correctFeedback: 'Qc2.', wrongFeedback: 'Qc2.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Nh5.', autoAdvance: 800, highlightSquares: ['f6', 'h5'] },
    { type: 'play-move', fen: FEN.after_Nh5, correctMove: 'Bg3', prompt: 'Your move.', hint: 'Bg3.', correctFeedback: 'Bg3.', wrongFeedback: 'Bg3.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Nxg3.', autoAdvance: 800, highlightSquares: ['h5', 'g3'] },
    { type: 'play-move', fen: FEN.after_Nxg3, correctMove: 'hxg3', prompt: 'Your move.', hint: 'hxg3.', correctFeedback: 'hxg3.', wrongFeedback: 'hxg3.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_hxg3, text: "Qc2, Bg3, hxg3 — the recapture opens the h-file and gives you long-term attacking chances." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ln-dev-e6: DEVIATION 3...e6 (instead of 3...c5)
// Branches from lesson 1. White's 3 moves: Nf3, c3, Nbd2
// ═══════════════════════════════════════════════════════════

const LN_DEV_E6: OpeningLesson = {
  id: 'ln-dev-e6',
  title: 'Dev 3...e6',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Nf6, text: "Sometimes Black plays 3...e6 instead of 3...c5. The plan stays the same — develop the knight first, then build the pyramid." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nf6, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_e3, text: 'Black plays e6 instead of c5.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },

    // PREDICT 1: Nf3
    { type: 'play-move', fen: FEN.dev1_after_e6, correctMove: 'Nf3', prompt: "Black played e6. What's a good developing move?", hint: 'Develop the knight to its most natural square.', correctFeedback: 'Nf3 develops toward the center and controls e5. The knight is well-placed here.', wrongFeedback: 'Bring the knight to f3 — always a solid choice in the London.', postMoveArrow: ['f3', 'e5'] },
    { type: 'instruction', fen: FEN.dev1_after_Nf3, text: 'Nf3 is the top masters choice. With e6 blocking the bishop, there is no rush to play c3 first.', arrow: ['g1', 'f3'] },

    // Black plays c5
    { type: 'instruction', fen: FEN.dev1_after_Nf3, text: 'Black pushes c5, challenging your center.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.dev1_after_c5, correctMove: 'c3', prompt: "Black challenges d4 with c5. How do you reinforce?", hint: 'Support d4 with the c-pawn.', correctFeedback: 'c3 builds the familiar London pyramid — even when Black delays c5, the structure is the same.', wrongFeedback: 'Push c3 to support d4 and build the pyramid.', postMoveArrow: ['c3', 'd4'] },
    { type: 'instruction', fen: FEN.dev1_after_c3, text: 'c3 locks in the pyramid. The position is transposing toward the main line — same structure, just a different move order.', arrow: ['c2', 'c3'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.dev1_after_c3, text: 'Black develops the knight to c6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.dev1_after_Nc6, correctMove: 'Nbd2', prompt: "Time for the second knight. Where does it go?", hint: 'The b1 knight goes to d2 — the London signature move.', correctFeedback: 'Nbd2 completes development behind the pyramid. Same setup, different path.', wrongFeedback: 'Develop the knight to d2 to support the center.', postMoveArrow: ['d2', 'e4'] },
    { type: 'instruction', fen: FEN.dev1_after_Nbd2, text: 'Nbd2 is the London trademark. Whether Black plays c5 or e6 first, you always end up with the same solid setup.', arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev1_after_e6, text: "Play it back from memory." },
    { type: 'play-move', fen: FEN.dev1_after_e6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.dev1_after_Nf3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.dev1_after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.dev1_after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.dev1_after_Nc6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev1_after_Nbd2, text: "Whether Black plays e6 or c5 first, you build the same pyramid. That's the beauty of the London." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ln-dev-e6-qb6: DEVIATION 6...e6 (instead of 6...Qb6)
// Branches from lesson 2. White's 3 moves: Qb3, Qxb6, Nh4
// ═══════════════════════════════════════════════════════════

const LN_DEV_E6_QB6: OpeningLesson = {
  id: 'ln-dev-e6-qb6',
  title: 'Dev 6...e6',
  defaultOrientation: 'white',
  steps: [
    // INTRO
    { type: 'instruction', fen: FEN.after_Ngf3, text: "Instead of Qb6, Black sometimes plays 6...e6 — a quiet move. You'll seize the initiative with Qb3, trade queens, and attack the bishop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Nf6, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Black plays e6 instead of Qb6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },

    // PREDICT 1: Qb3
    { type: 'play-move', fen: FEN.dev2_after_e6, correctMove: 'Qb3', prompt: "Black played quietly with e6. How do you take the initiative?", hint: 'Bring the queen to b3 — it pressures b7 and d5.', correctFeedback: 'Qb3 puts immediate pressure on b7 and forces Black to react.', wrongFeedback: 'Play Qb3 to attack the b7 pawn and seize the initiative.', postMoveArrow: ['b3', 'b7'] },
    { type: 'instruction', fen: FEN.dev2_after_Qb3, text: 'Qb3 attacks the b7 pawn. Black will defend with Qb6, but that lets you trade queens on your terms.', arrow: ['d1', 'b3'] },

    // Black plays Qb6
    { type: 'instruction', fen: FEN.dev2_after_Qb3, text: 'Black defends with Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },

    // PREDICT 2: Qxb6
    { type: 'play-move', fen: FEN.dev2_after_Qb6, correctMove: 'Qxb6', prompt: "The queens are facing off. What do you do?", hint: 'Trade queens — you have a better endgame structure.', correctFeedback: 'Qxb6 trades queens. In the endgame, your structure and piece activity give you an edge.', wrongFeedback: 'Take the queen with Qxb6 — the endgame favors you.', postMoveArrow: ['b6', 'a7'] },
    { type: 'instruction', fen: FEN.dev2_after_Qxb6, text: 'Qxb6 simplifies the position. After axb6, Black has doubled b-pawns and you can target the bishop with Nh4.', arrow: ['b3', 'b6'] },

    // Black recaptures axb6
    { type: 'instruction', fen: FEN.dev2_after_Qxb6, text: 'Black recaptures with axb6.', autoAdvance: 800, highlightSquares: ['a7', 'b6'] },

    // PREDICT 3: Nh4
    { type: 'play-move', fen: FEN.dev2_after_axb6, correctMove: 'Nh4', prompt: "Black's bishop on f5 is still active. How do you challenge it?", hint: 'Jump the knight to h4 to attack the bishop.', correctFeedback: 'Nh4 attacks the f5 bishop. Without a queen to defend, Black is in trouble.', wrongFeedback: 'Leap the knight to h4 — target that bishop.', postMoveArrow: ['h4', 'f5'] },
    { type: 'instruction', fen: FEN.dev2_after_Nh4, text: 'Nh4 forces the bishop to retreat or trade. You have a comfortable position with good piece activity.', arrow: ['f3', 'h4'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev2_after_e6, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.dev2_after_e6, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.dev2_after_Qb3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.dev2_after_Qb6, correctMove: 'Qxb6', prompt: 'Your move.', hint: 'Qxb6.', correctFeedback: 'Qxb6.', wrongFeedback: 'Qxb6.' },
    { type: 'instruction', fen: FEN.dev2_after_Qxb6, text: 'axb6.', autoAdvance: 800, highlightSquares: ['a7', 'b6'] },
    { type: 'play-move', fen: FEN.dev2_after_axb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev2_after_Nh4, text: "When Black plays e6 instead of Qb6, you grab the initiative with Qb3 and steer into a favorable endgame." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ln-test-1: LEVEL 1 TEST
// Main line + both deviations, zero guidance.
// ═══════════════════════════════════════════════════════════

const LN_TEST_1: OpeningLesson = {
  id: 'ln-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    { type: 'instruction', fen: FEN.after_Nf6, text: "Time to prove you know the London. Play the full main line from memory." },

    // Lesson 1 moves
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    // Lesson 2 moves
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },

    // Lesson 3 moves
    { type: 'instruction', fen: FEN.after_Qb3, text: 'c4.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: 'Your move.', hint: 'Qc2.', correctFeedback: 'Qc2.', wrongFeedback: 'Qc2.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Nh5.', autoAdvance: 800, highlightSquares: ['f6', 'h5'] },
    { type: 'play-move', fen: FEN.after_Nh5, correctMove: 'Bg3', prompt: 'Your move.', hint: 'Bg3.', correctFeedback: 'Bg3.', wrongFeedback: 'Bg3.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Nxg3.', autoAdvance: 800, highlightSquares: ['h5', 'g3'] },
    { type: 'play-move', fen: FEN.after_Nxg3, correctMove: 'hxg3', prompt: 'Your move.', hint: 'hxg3.', correctFeedback: 'hxg3.', wrongFeedback: 'hxg3.' },

    // ── PART 2: DEVIATION HANDLING ──
    { type: 'instruction', fen: FEN.after_e3, text: "Main line done. Now handle the deviations." },

    // Deviation 1: 3...e6 instead of 3...c5
    { type: 'instruction', fen: FEN.dev1_after_e6, text: "Black plays 3...e6 instead of c5.", autoAdvance: 1200, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.dev1_after_e6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.dev1_after_Nf3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.dev1_after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.dev1_after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.dev1_after_Nc6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // Deviation 2: 6...e6 instead of 6...Qb6
    { type: 'instruction', fen: FEN.dev2_after_e6, text: "Black plays 6...e6 instead of Qb6.", autoAdvance: 1200, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.dev2_after_e6, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.dev2_after_Qb3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.dev2_after_Qb6, correctMove: 'Qxb6', prompt: 'Your move.', hint: 'Qxb6.', correctFeedback: 'Qxb6.', wrongFeedback: 'Qxb6.' },
    { type: 'instruction', fen: FEN.dev2_after_Qxb6, text: 'axb6.', autoAdvance: 800, highlightSquares: ['a7', 'b6'] },
    { type: 'play-move', fen: FEN.dev2_after_axb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const LONDON_LESSONS: Record<string, OpeningLesson> = {
  'ln-1': LN_1,
  'ln-2': LN_2,
  'ln-3': LN_3,
  'ln-dev-e6': LN_DEV_E6,
  'ln-dev-e6-qb6': LN_DEV_E6_QB6,
  'ln-test-1': LN_TEST_1,
}

export function getLondonLesson(id: string): OpeningLesson | undefined {
  return LONDON_LESSONS[id]
}
