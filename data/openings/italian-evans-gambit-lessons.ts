import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// ITALIAN GAME: EVANS GAMBIT — Level 1 (Predict/Reveal)
//
// Identity: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4
// Main line: 4...Bxb4 5.c3 Ba5 6.d4 d6 7.Qb3 Qd7 8.O-O Bb6 9.Nbd2
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Starting position
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  // Identity moves (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4)
  after_e4:         'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:         'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:        'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:        'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bc4:        'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_Bc5:        'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  after_b4:         'r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4',

  // Lesson 2: Bxb4, c3, Ba5, d4
  after_Bxb4:       'r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 0 5',
  after_c3:         'r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2R b KQkq - 0 5',
  after_Ba5:        'r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq - 1 6',
  after_d4:         'r1bqk1nr/pppp1ppp/2n5/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2R b KQkq - 0 6',

  // Lesson 3: d6, Qb3, Qd7, O-O, Bb6, Nbd2
  after_d6:         'r1bqk1nr/ppp2ppp/2np4/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2R w KQkq - 0 7',
  after_Qb3:        'r1bqk1nr/ppp2ppp/2np4/b3p3/2BPP3/1QP2N2/P4PPP/RNB1K2R b KQkq - 1 7',
  after_Qd7:        'r1b1k1nr/pppq1ppp/2np4/b3p3/2BPP3/1QP2N2/P4PPP/RNB1K2R w KQkq - 2 8',
  after_OO:         'r1b1k1nr/pppq1ppp/2np4/b3p3/2BPP3/1QP2N2/P4PPP/RNB2RK1 b kq - 3 8',
  after_Bb6:        'r1b1k1nr/pppq1ppp/1bnp4/4p3/2BPP3/1QP2N2/P4PPP/RNB2RK1 w kq - 4 9',
  after_Nbd2:       'r1b1k1nr/pppq1ppp/1bnp4/4p3/2BPP3/1QP2N2/P2N1PPP/R1B2RK1 b kq - 5 9',

  // Deviation: 4...Bb6 (instead of Bxb4)
  dev_Bb6:          'r1bqk1nr/pppp1ppp/1bn5/4p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 1 5',
  dev_Bb6_a4:       'r1bqk1nr/pppp1ppp/1bn5/4p3/PPB1P3/5N2/2PP1PPP/RNBQK2R b KQkq - 0 5',
  dev_Bb6_a6:       'r1bqk1nr/1ppp1ppp/pbn5/4p3/PPB1P3/5N2/2PP1PPP/RNBQK2R w KQkq - 0 6',
  dev_Bb6_Nc3:      'r1bqk1nr/1ppp1ppp/pbn5/4p3/PPB1P3/2N2N2/2PP1PPP/R1BQK2R b KQkq - 1 6',
  dev_Bb6_Nf6:      'r1bqk2r/1ppp1ppp/pbn2n2/4p3/PPB1P3/2N2N2/2PP1PPP/R1BQK2R w KQkq - 2 7',
  dev_Bb6_d3:       'r1bqk2r/1ppp1ppp/pbn2n2/4p3/PPB1P3/2NP1N2/2P2PPP/R1BQK2R b KQkq - 0 7',

  // Deviation: 5...Bd6 (instead of Ba5)
  dev_Bd6:          'r1bqk1nr/pppp1ppp/2nb4/4p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq - 1 6',
  dev_Bd6_d4:       'r1bqk1nr/pppp1ppp/2nb4/4p3/2BPP3/2P2N2/P4PPP/RNBQK2R b KQkq - 0 6',
  dev_Bd6_Nf6:      'r1bqk2r/pppp1ppp/2nb1n2/4p3/2BPP3/2P2N2/P4PPP/RNBQK2R w KQkq - 1 7',
  dev_Bd6_OO:       'r1bqk2r/pppp1ppp/2nb1n2/4p3/2BPP3/2P2N2/P4PPP/RNBQ1RK1 b kq - 2 7',
  dev_Bd6_OO_b:     'r1bq1rk1/pppp1ppp/2nb1n2/4p3/2BPP3/2P2N2/P4PPP/RNBQ1RK1 w - - 3 8',
  dev_Bd6_Re1:      'r1bq1rk1/pppp1ppp/2nb1n2/4p3/2BPP3/2P2N2/P4PPP/RNBQR1K1 b - - 4 8',
}

// ═══════════════════════════════════════════════════════════
// ieg-1: The Gambit (e4, Nf3, Bc4)
// ═══════════════════════════════════════════════════════════

const IEG_LESSON_1: OpeningLesson = {
  id: 'ieg-1',
  title: 'The Gambit',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Evans Gambit starts like the Italian Game — develop fast, then offer a pawn on b4 for a lead in development." },

    // PREDICT 1: e4
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: "Start the game. What's your first move?", hint: 'Open with the king pawn — two squares forward.', correctFeedback: 'e4 controls the center and opens lines for your bishop and queen.', wrongFeedback: 'Play e4 to control the center.' },
    { type: 'instruction', fen: FEN.after_e4, text: "e4 grabs central space and frees your bishop and queen.", arrow: ['e2', 'e4'] },

    // Black plays e5
    { type: 'instruction', fen: FEN.after_e4, text: "Black mirrors you with e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },

    // PREDICT 2: Nf3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: "Black played e5. Develop a piece that attacks their pawn.", hint: 'The knight can attack e5 from f3.', correctFeedback: 'Nf3 develops the knight and puts pressure on e5.', wrongFeedback: 'Bring the knight to f3 — it attacks the e5 pawn.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Nf3 develops and attacks e5. Black will need to defend.", arrow: ['g1', 'f3'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black defends with Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: Bc4
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: "Your turn to develop another piece. Where does the bishop go?", hint: 'Put the bishop on the diagonal aiming at f7.', correctFeedback: 'Bc4 points the bishop at f7, the weakest square near Black\'s king.', wrongFeedback: 'Play Bc4 — aim the bishop at f7.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: "Bc4 targets f7, the most vulnerable square in Black's camp. This is the Italian Game.", arrow: ['f1', 'c4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: "Black plays e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black plays Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Bc4, text: "The Italian Game setup is complete. Next up: the pawn sacrifice that makes this the Evans Gambit." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ieg-2: Seize the Center (c3, d4 — after Bxb4, Ba5)
// User's 3 white moves: b4, c3, d4
// ═══════════════════════════════════════════════════════════

const IEG_LESSON_2: OpeningLesson = {
  id: 'ieg-2',
  title: 'Seize the Center',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Bc5, text: "Black develops the bishop to c5. Now it's time for the Evans Gambit — sacrifice a pawn for fast development and a strong center." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: "Black plays e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black plays Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // Black plays Bc5
    { type: 'instruction', fen: FEN.after_Bc4, text: "Black plays Bc5.", autoAdvance: 800, highlightSquares: ['f8', 'c5'] },

    // PREDICT 1: b4
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'b4', prompt: "Black's bishop is on c5. How do you attack it and gain time?", hint: 'Offer a pawn on the queenside to chase the bishop away.', correctFeedback: 'b4! The Evans Gambit — sacrifice a pawn to gain tempo on the bishop.', wrongFeedback: 'Push b4 — offer the pawn to drive the bishop away.' },
    { type: 'instruction', fen: FEN.after_b4, text: "b4 offers a pawn. If Black takes, you gain time to build a huge center with c3 and d4.", arrow: ['b2', 'b4'] },

    // Black plays Bxb4
    { type: 'instruction', fen: FEN.after_b4, text: "Black takes the pawn.", autoAdvance: 800, highlightSquares: ['c5', 'b4'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'c3', prompt: "Black captured your pawn. How do you gain more time while preparing d4?", hint: 'Attack the bishop with a pawn and set up a d4 push.', correctFeedback: 'c3 attacks the bishop and prepares d4 — two gains for one move.', wrongFeedback: 'Play c3 — attack the bishop and prepare d4.' },
    { type: 'instruction', fen: FEN.after_c3, text: "c3 hits the bishop and prepares d4. Black has to move the bishop again — you're gaining time.", arrow: ['c2', 'c3'] },

    // Black plays Ba5
    { type: 'instruction', fen: FEN.after_c3, text: "The bishop retreats to a5.", autoAdvance: 800, highlightSquares: ['b4', 'a5'] },

    // PREDICT 3: d4
    { type: 'play-move', fen: FEN.after_Ba5, correctMove: 'd4', prompt: "Your preparation is done. Seize the center.", hint: 'Push the d-pawn two squares — c3 supports it.', correctFeedback: 'd4 builds a strong pawn center. This is why you sacrificed the pawn.', wrongFeedback: 'Push d4 — you prepared it with c3.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4 gives you two pawns in the center. Your pieces are developed, Black's bishop is offside on a5. The gambit is paying off.", arrow: ['d2', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bc5, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: "Black takes on b4.", autoAdvance: 800, highlightSquares: ['c5', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: "Bishop goes to a5.", autoAdvance: 800, highlightSquares: ['b4', 'a5'] },
    { type: 'play-move', fen: FEN.after_Ba5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_d4, text: "You've got the Evans Gambit center. A pawn down, but way ahead in development." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ieg-3: Develop and Castle (Qb3, O-O, Nbd2)
// ═══════════════════════════════════════════════════════════

const IEG_LESSON_3: OpeningLesson = {
  id: 'ieg-3',
  title: 'Develop and Castle',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_d4, text: "You've built the center. Now it's time to develop the queen, castle, and bring the last knight into the game." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bc5, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: "Black takes.", autoAdvance: 800, highlightSquares: ['c5', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: "Bishop retreats to a5.", autoAdvance: 800, highlightSquares: ['b4', 'a5'] },
    { type: 'play-move', fen: FEN.after_Ba5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // Black plays d6
    { type: 'instruction', fen: FEN.after_d4, text: "Black plays d6, defending e5 and opening a line for the bishop.", autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 1: Qb3
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'Qb3', prompt: "You need to develop your queen to an active square. Where does it go?", hint: 'Put the queen where it attacks f7 and supports the center.', correctFeedback: 'Qb3 eyes f7 and puts pressure on the b-file. Active and dangerous.', wrongFeedback: 'Play Qb3 — it targets f7 and the b-file.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: "Qb3 puts pressure on f7 and along the b-file. Black needs to be careful.", arrow: ['d1', 'b3'] },

    // Black plays Qd7
    { type: 'instruction', fen: FEN.after_Qb3, text: "Black blocks with Qd7, defending f7.", autoAdvance: 800, highlightSquares: ['d8', 'd7'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_Qd7, correctMove: 'O-O', prompt: "Your king is still in the center. Time to fix that.", hint: 'Castle kingside to get your king safe and connect your rooks.', correctFeedback: 'Castling gets the king safe and brings the rook toward the center.', wrongFeedback: 'Castle kingside — king safety first.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O puts the king on g1 and activates the f1 rook. Your development is nearly complete.", arrow: ['e1', 'g1'] },

    // Black plays Bb6
    { type: 'instruction', fen: FEN.after_OO, text: "The bishop retreats to b6.", autoAdvance: 800, highlightSquares: ['a5', 'b6'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.after_Bb6, correctMove: 'Nbd2', prompt: "One piece left undeveloped. Where does the knight go?", hint: 'Bring the queenside knight into the game — d2 keeps options open.', correctFeedback: 'Nbd2 develops the last piece. The knight can go to b3 or f1 next.', wrongFeedback: 'Play Nbd2 — develop the last minor piece.' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Nbd2 completes your development. The knight can reroute to b3, f1, or e3 depending on what Black does.", arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d6, text: "Play all three new moves from memory." },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: "Black plays Qd7.", autoAdvance: 800, highlightSquares: ['d8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Qd7, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Bishop to b6.", autoAdvance: 800, highlightSquares: ['a5', 'b6'] },
    { type: 'play-move', fen: FEN.after_Bb6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nbd2, text: "The Evans Gambit is fully set up. You've got a pawn center, developed pieces, and a safe king. Time to play." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ieg-dev-Bb6: If 4...Bb6 (instead of Bxb4)
// Black declines the gambit. Teaches a4, Nc3, d3 (3 white moves)
// ═══════════════════════════════════════════════════════════

const IEG_DEV_BB6: OpeningLesson = {
  id: 'ieg-dev-Bb6',
  title: 'If 4...Bb6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_b4, text: "Sometimes Black declines the gambit and moves the bishop to b6 instead of taking on b4. Here's how to keep the pressure on." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bc5, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_b4, text: "Black plays Bb6 instead of taking the pawn.", autoAdvance: 800, highlightSquares: ['c5', 'b6'] },

    // PREDICT 1: a4
    { type: 'play-move', fen: FEN.dev_Bb6, correctMove: 'a4', prompt: "Black declined your gambit. How do you keep pushing on the queenside?", hint: 'Advance the a-pawn to threaten a5, trapping the bishop.', correctFeedback: 'a4 threatens a5, which would trap the bishop on b6.', wrongFeedback: 'Play a4 — threaten to push a5 and trap the bishop.' },
    { type: 'instruction', fen: FEN.dev_Bb6_a4, text: "a4 threatens a5. If the bishop stays on b6, it could get trapped after a5.", arrow: ['a2', 'a4'] },

    // Black plays a6
    { type: 'instruction', fen: FEN.dev_Bb6_a4, text: "Black stops a5 with a6.", autoAdvance: 800, highlightSquares: ['a7', 'a6'] },

    // PREDICT 2: Nc3
    { type: 'play-move', fen: FEN.dev_Bb6_a6, correctMove: 'Nc3', prompt: "Black stopped your a5 idea. Time to develop — where does the knight go?", hint: 'Develop the queenside knight to its best square.', correctFeedback: 'Nc3 develops the knight and supports a future d4 push.', wrongFeedback: 'Play Nc3 — develop and support the center.' },
    { type: 'instruction', fen: FEN.dev_Bb6_Nc3, text: "Nc3 develops the knight to a natural square. It supports d4 and controls d5.", arrow: ['b1', 'c3'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.dev_Bb6_Nc3, text: "Black develops with Nf6.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 3: d3
    { type: 'play-move', fen: FEN.dev_Bb6_Nf6, correctMove: 'd3', prompt: "Keep building your position. Support the center and free your bishop.", hint: 'A quiet pawn move that supports e4 and opens the c1 bishop.', correctFeedback: 'd3 supports e4 and opens a path for your dark-squared bishop.', wrongFeedback: 'Play d3 — solid development, opening the diagonal for your bishop.' },
    { type: 'instruction', fen: FEN.dev_Bb6_d3, text: "d3 keeps the center solid and opens the c1-h6 diagonal for your bishop. From here you can castle and play for a slow buildup.", arrow: ['d2', 'd3'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Bb6, text: "Play all three responses from memory." },
    { type: 'play-move', fen: FEN.dev_Bb6, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.dev_Bb6_a4, text: "Black plays a6.", autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.dev_Bb6_a6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_Bb6_Nc3, text: "Black plays Nf6.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_Bb6_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_Bb6_d3, text: "When Black declines the gambit with Bb6, push a4, develop with Nc3, and support the center with d3. You keep a solid position." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ieg-dev-Bd6: If 5...Bd6 (instead of Ba5)
// After Bxb4 c3, Black plays Bd6 instead of Ba5.
// Teaches d4, O-O, Re1 (3 white moves)
// ═══════════════════════════════════════════════════════════

const IEG_DEV_BD6: OpeningLesson = {
  id: 'ieg-dev-Bd6',
  title: 'If 5...Bd6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_c3, text: "After 5.c3, Black sometimes retreats the bishop to d6 instead of a5. The plan stays similar — push d4 and develop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bc5, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: "Black takes on b4.", autoAdvance: 800, highlightSquares: ['c5', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_c3, text: "Black plays Bd6 instead of Ba5.", autoAdvance: 800, highlightSquares: ['b4', 'd6'] },

    // PREDICT 1: d4
    { type: 'play-move', fen: FEN.dev_Bd6, correctMove: 'd4', prompt: "The bishop went to d6. What central push do you play?", hint: 'Same idea — push the d-pawn while c3 supports it.', correctFeedback: 'd4 strikes the center. Same plan whether the bishop is on a5 or d6.', wrongFeedback: 'Push d4 — the center is your goal.' },
    { type: 'instruction', fen: FEN.dev_Bd6_d4, text: "d4 opens the center. The bishop on d6 blocks Black's d-pawn, so Black is a bit cramped.", arrow: ['d2', 'd4'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.dev_Bd6_d4, text: "Black develops the knight to f6.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.dev_Bd6_Nf6, correctMove: 'O-O', prompt: "Get your king to safety.", hint: 'Castle kingside.', correctFeedback: 'Castling gets your king safe and connects the rooks.', wrongFeedback: 'Castle kingside — king safety comes first.' },
    { type: 'instruction', fen: FEN.dev_Bd6_OO, text: "O-O tucks the king away and brings the rook toward the center.", arrow: ['e1', 'g1'] },

    // Black plays O-O
    { type: 'instruction', fen: FEN.dev_Bd6_OO, text: "Black castles too.", autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 3: Re1
    { type: 'play-move', fen: FEN.dev_Bd6_OO_b, correctMove: 'Re1', prompt: "Both sides have castled. How do you add pressure to the center?", hint: 'Put your rook on the open file behind your e4 pawn.', correctFeedback: 'Re1 supports the e4 pawn and controls the e-file.', wrongFeedback: 'Play Re1 — support e4 and seize the e-file.' },
    { type: 'instruction', fen: FEN.dev_Bd6_Re1, text: "Re1 supports e4 and puts the rook on the half-open e-file. You have a strong center and active pieces.", arrow: ['f1', 'e1'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Bd6, text: "Play all three responses from memory." },
    { type: 'play-move', fen: FEN.dev_Bd6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Bd6_d4, text: "Black plays Nf6.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_Bd6_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_Bd6_OO, text: "Black castles.", autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev_Bd6_OO_b, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_Bd6_Re1, text: "When Black retreats to d6, push d4, castle, and plant your rook on e1. Solid and active." },
  ],
}

// ═══════════════════════════════════════════════════════════
// ieg-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const IEG_TEST: OpeningLesson = {
  id: 'ieg-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE ===
    // Lesson 1 moves
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: "Black plays e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black plays Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // Lesson 2 moves
    { type: 'instruction', fen: FEN.after_Bc4, text: "Black plays Bc5.", autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: "Black takes on b4.", autoAdvance: 800, highlightSquares: ['c5', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: "Bishop to a5.", autoAdvance: 800, highlightSquares: ['b4', 'a5'] },
    { type: 'play-move', fen: FEN.after_Ba5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // Lesson 3 moves
    { type: 'instruction', fen: FEN.after_d4, text: "Black plays d6.", autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: "Black plays Qd7.", autoAdvance: 800, highlightSquares: ['d8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Qd7, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Bishop to b6.", autoAdvance: 800, highlightSquares: ['a5', 'b6'] },
    { type: 'play-move', fen: FEN.after_Bb6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // === DEVIATION: 4...Bb6 ===
    { type: 'instruction', fen: FEN.after_b4, text: "Now: Black plays Bb6 instead.", autoAdvance: 800, highlightSquares: ['c5', 'b6'] },
    { type: 'play-move', fen: FEN.dev_Bb6, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.dev_Bb6_a4, text: "Black plays a6.", autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.dev_Bb6_a6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_Bb6_Nc3, text: "Black plays Nf6.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_Bb6_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },

    // === DEVIATION: 5...Bd6 ===
    { type: 'instruction', fen: FEN.after_c3, text: "Now: Black plays Bd6 instead of Ba5.", autoAdvance: 800, highlightSquares: ['b4', 'd6'] },
    { type: 'play-move', fen: FEN.dev_Bd6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Bd6_d4, text: "Black plays Nf6.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_Bd6_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_Bd6_OO, text: "Black castles.", autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.dev_Bd6_OO_b, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// Lookup
// ═══════════════════════════════════════════════════════════

export function getItalianEvansGambitLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'ieg-1': return IEG_LESSON_1
    case 'ieg-2': return IEG_LESSON_2
    case 'ieg-3': return IEG_LESSON_3
    case 'ieg-dev-Bb6': return IEG_DEV_BB6
    case 'ieg-dev-Bd6': return IEG_DEV_BD6
    case 'ieg-test-1': return IEG_TEST
    default: return undefined
  }
}
