import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// RUY LOPEZ: EXCHANGE VARIATION — Level 1 (Predict/Reveal)
//
// Identity: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6
// Main line: 4...dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5 8.Nb3 Qxd1
//            9.Rxd1 Bg4 10.f3 Be6 11.Be3 b6 12.Nc3
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Starting position
  start:          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  // Identity moves (1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6)
  after_e4:       'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:       'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bb5:      'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_a6:       'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  after_Bxc6:     'r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4',

  // Lesson 2: Bxc6, O-O, d4
  after_dxc6:     'r1bqkbnr/1pp2ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  after_OO:       'r1bqkbnr/1pp2ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 5',
  after_f6:       'r1bqkbnr/1pp3pp/p1p2p2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 6',
  after_d4:       'r1bqkbnr/1pp3pp/p1p2p2/4p3/3PP3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 6',

  // Lesson 3: Nxd4, Nb3, Rxd1
  after_exd4:     'r1bqkbnr/1pp3pp/p1p2p2/8/3pP3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 7',
  after_Nxd4:     'r1bqkbnr/1pp3pp/p1p2p2/8/3NP3/8/PPP2PPP/RNBQ1RK1 b kq - 0 7',
  after_c5:       'r1bqkbnr/1pp3pp/p4p2/2p5/3NP3/8/PPP2PPP/RNBQ1RK1 w kq - 0 8',
  after_Nb3:      'r1bqkbnr/1pp3pp/p4p2/2p5/4P3/1N6/PPP2PPP/RNBQ1RK1 b kq - 1 8',
  after_Qxd1:     'r1b1kbnr/1pp3pp/p4p2/2p5/4P3/1N6/PPP2PPP/RNBq1RK1 w kq - 0 9',
  after_Rxd1:     'r1b1kbnr/1pp3pp/p4p2/2p5/4P3/1N6/PPP2PPP/RNBR2K1 b kq - 0 9',

  // Lesson 4: f3, Be3, Nc3
  after_Bg4:      'r3kbnr/1pp3pp/p4p2/2p5/4P1b1/1N6/PPP2PPP/RNBR2K1 w kq - 1 10',
  after_f3:       'r3kbnr/1pp3pp/p4p2/2p5/4P1b1/1N3P2/PPP3PP/RNBR2K1 b kq - 0 10',
  after_Be6:      'r3kbnr/1pp3pp/p3bp2/2p5/4P3/1N3P2/PPP3PP/RNBR2K1 w kq - 1 11',
  after_Be3:      'r3kbnr/1pp3pp/p3bp2/2p5/4P3/1N2BP2/PPP3PP/RN1R2K1 b kq - 2 11',
  after_b6:       'r3kbnr/2p3pp/pp2bp2/2p5/4P3/1N2BP2/PPP3PP/RN1R2K1 w kq - 0 12',
  after_Nc3:      'r3kbnr/2p3pp/pp2bp2/2p5/4P3/1NN1BP2/PPP3PP/R2R2K1 b kq - 1 12',

  // Deviation: 5...Qf6 (instead of f6)
  dev_Qf6:        'r1b1kbnr/1pp2ppp/p1p2q2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 2 6',
  dev_Qf6_d4:     'r1b1kbnr/1pp2ppp/p1p2q2/4p3/3PP3/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 6',
  dev_Qf6_exd4:   'r1b1kbnr/1pp2ppp/p1p2q2/8/3pP3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 7',
  dev_Qf6_Bg5:    'r1b1kbnr/1pp2ppp/p1p2q2/6B1/3pP3/5N2/PPP2PPP/RN1Q1RK1 b kq - 1 7',
  dev_Qf6_Qd6:    'r1b1kbnr/1pp2ppp/p1pq4/6B1/3pP3/5N2/PPP2PPP/RN1Q1RK1 w kq - 2 8',
  dev_Qf6_Nxd4:   'r1b1kbnr/1pp2ppp/p1pq4/6B1/3NP3/8/PPP2PPP/RN1Q1RK1 b kq - 0 8',

  // Deviation: 9...Bd7 (instead of Bg4)
  dev_Bd7:        'r3kbnr/1ppb2pp/p4p2/2p5/4P3/1N6/PPP2PPP/RNBR2K1 w kq - 1 10',
  dev_Bd7_Bf4:    'r3kbnr/1ppb2pp/p4p2/2p5/4PB2/1N6/PPP2PPP/RN1R2K1 b kq - 2 10',
  dev_Bd7_OOO:    '2kr1bnr/1ppb2pp/p4p2/2p5/4PB2/1N6/PPP2PPP/RN1R2K1 w - - 3 11',
  dev_Bd7_Nc3:    '2kr1bnr/1ppb2pp/p4p2/2p5/4PB2/1NN5/PPP2PPP/R2R2K1 b - - 4 11',
  dev_Bd7_Be6:    '2kr1bnr/1pp3pp/p3bp2/2p5/4PB2/1NN5/PPP2PPP/R2R2K1 w - - 5 12',
  dev_Bd7_Rxd8:   '2kR1bnr/1pp3pp/p3bp2/2p5/4PB2/1NN5/PPP2PPP/R5K1 b - - 0 12',
}

// ═══════════════════════════════════════════════════════════
// rle-1: The Ruy Lopez (e4, Nf3, Bb5)
// ═══════════════════════════════════════════════════════════

const RLE_LESSON_1: OpeningLesson = {
  id: 'rle-1',
  title: 'The Ruy Lopez',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Ruy Lopez Exchange starts with three strong developing moves. You'll control the center and pin Black's knight right away." },

    // PREDICT 1: e4
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: "Open the game. What's the classic first move?", hint: 'Push your king pawn two squares forward.', correctFeedback: 'e4 grabs the center and opens lines for your bishop and queen.', wrongFeedback: 'Play e4 — the king pawn opening.' },
    { type: 'instruction', fen: FEN.after_e4, text: "e4 stakes a claim in the center immediately. Your bishop and queen now have open diagonals.", arrow: ['e2', 'e4'] },

    // Black plays e5
    { type: 'instruction', fen: FEN.after_e4, text: "Black mirrors you with e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },

    // PREDICT 2: Nf3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: "Develop a piece and attack Black's pawn. Find the move.", hint: 'Bring your knight to f3 — it hits the e5 pawn.', correctFeedback: "Nf3 develops the knight and pressures e5.", wrongFeedback: 'Knight to f3 — develop and attack e5.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Nf3 attacks the e5 pawn and develops toward the center. Black usually defends with Nc6.", arrow: ['g1', 'f3'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black defends with the knight.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: Bb5
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: "Pin the defender. Where does the bishop go?", hint: 'Put the bishop on b5 — it targets the knight that guards e5.', correctFeedback: 'Bb5! The Ruy Lopez. Your bishop pins the knight defending e5.', wrongFeedback: 'Bishop to b5 — pressure the knight on c6.' },
    { type: 'instruction', fen: FEN.after_Bb5, text: "Bb5 is the Ruy Lopez. The bishop eyes the knight on c6 that defends e5. Black almost always plays a6 to ask what you plan to do.", arrow: ['f1', 'b5'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: "Black plays e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black plays Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Bb5, text: "That's the Ruy Lopez setup. Next, you'll learn why trading the bishop on c6 is a powerful choice." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rle-2: The Exchange (Bxc6, O-O, d4)
// ═══════════════════════════════════════════════════════════

const RLE_LESSON_2: OpeningLesson = {
  id: 'rle-2',
  title: 'The Exchange',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb5, text: "Black plays a6, challenging your bishop. Instead of retreating, you trade it for the knight — doubling Black's pawns for good." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: "Black plays e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black plays Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },

    // Black plays a6
    { type: 'instruction', fen: FEN.after_Bb5, text: "Black plays a6, asking the bishop what it wants.", autoAdvance: 800, highlightSquares: ['a7', 'a6'] },

    // PREDICT 1: Bxc6
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Bxc6', prompt: "Black challenges your bishop. Time to make a decision — take or retreat?", hint: 'Capture the knight on c6. The doubled pawns are worth it.', correctFeedback: "Bxc6! You give up the bishop pair, but Black's pawn structure is permanently damaged.", wrongFeedback: 'Take the knight on c6 with your bishop.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Bxc6 is the Exchange Variation. Black must recapture, and their doubled c-pawns will be a weakness for the rest of the game.", arrow: ['b5', 'c6'] },

    // Black plays dxc6
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures with the d-pawn.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'O-O', prompt: "You've doubled Black's pawns. What's the best way to continue?", hint: 'Get your king to safety first.', correctFeedback: "O-O! Castling keeps your king safe before opening the center.", wrongFeedback: 'Castle kingside — safety first, then attack.' },
    { type: 'instruction', fen: FEN.after_OO, text: "O-O tucks the king away and connects the rooks. You're ready to push d4 next.", arrow: ['e1', 'g1'] },

    // Black plays f6
    { type: 'instruction', fen: FEN.after_OO, text: "Black plays f6, reinforcing the e5 pawn.", autoAdvance: 800, highlightSquares: ['f7', 'f6'] },

    // PREDICT 3: d4
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd4', prompt: "Black has shored up e5. How do you challenge the center?", hint: 'Push d4 — break through in the center.', correctFeedback: "d4 strikes at the center. Black can't hold e5 forever.", wrongFeedback: 'Push d4 — open the center while you have better development.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4 attacks the e5 pawn. If Black takes, you recapture with the knight and dominate the center.", arrow: ['d2', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black plays f6.", autoAdvance: 800, highlightSquares: ['f7', 'f6'] },
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_d4, text: "You've got the Exchange setup down — doubled Black's pawns, castled, and opened the center." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rle-3: Simplify & Control (Nxd4, Nb3, Rxd1)
// ═══════════════════════════════════════════════════════════

const RLE_LESSON_3: OpeningLesson = {
  id: 'rle-3',
  title: 'Simplify & Control',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_d4, text: "Black takes on d4, and you get to simplify into a comfortable endgame with full control of the d-file." },

    // RECAP
    { type: 'instruction', fen: FEN.after_a6, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black plays f6.", autoAdvance: 800, highlightSquares: ['f7', 'f6'] },
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // Black plays exd4
    { type: 'instruction', fen: FEN.after_d4, text: "Black captures on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },

    // PREDICT 1: Nxd4
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: "Black took your pawn. How do you recapture?", hint: 'Take back with the knight — centralize it.', correctFeedback: "Nxd4! The knight lands on a dominant central square.", wrongFeedback: 'Recapture with the knight on d4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Nxd4 puts your knight on the best square on the board. Black will try to chase it away with c5.", arrow: ['f3', 'd4'] },

    // Black plays c5
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Black pushes c5, attacking your knight.", autoAdvance: 800, highlightSquares: ['c6', 'c5'] },

    // PREDICT 2: Nb3
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'Nb3', prompt: "Your knight is under attack. Where does it retreat?", hint: 'The knight goes to b3 — still watching c5 and d4.', correctFeedback: "Nb3 keeps the knight active, watching the queenside.", wrongFeedback: 'Retreat the knight to b3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Nb3 retreats but stays useful. The knight eyes c5 and d4 from b3. Black usually trades queens next.", arrow: ['d4', 'b3'] },

    // Black plays Qxd1
    { type: 'instruction', fen: FEN.after_Nb3, text: "Black takes your queen.", autoAdvance: 800, highlightSquares: ['d8', 'd1'] },

    // PREDICT 3: Rxd1
    { type: 'play-move', fen: FEN.after_Qxd1, correctMove: 'Rxd1', prompt: "Black just traded queens. How do you recapture?", hint: 'Recapture with the rook — seize the open d-file.', correctFeedback: "Rxd1! You own the only open file on the board.", wrongFeedback: 'Take back with the rook — the d-file is yours.' },
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Rxd1 gives you the open d-file. In this queenless position, your better pawn structure and active rook give you a lasting edge.", arrow: ['f1', 'd1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d4, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Black plays c5.", autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Black takes the queen.", autoAdvance: 800, highlightSquares: ['d8', 'd1'] },
    { type: 'play-move', fen: FEN.after_Qxd1, correctMove: 'Rxd1', prompt: 'Your move.', hint: 'Rxd1.', correctFeedback: 'Rxd1.', wrongFeedback: 'Rxd1.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Queens are off, you own the d-file, and Black's doubled pawns are stuck. This is a great endgame for White." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rle-4: The Endgame Setup (f3, Be3, Nc3)
// ═══════════════════════════════════════════════════════════

const RLE_LESSON_4: OpeningLesson = {
  id: 'rle-4',
  title: 'The Endgame Setup',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Black develops the bishop to g4, pinning your f-pawn. You'll kick it away and finish developing." },

    // RECAP
    { type: 'instruction', fen: FEN.after_d4, text: "Warm up — play the moves you know." },
    { type: 'instruction', fen: FEN.after_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Black plays c5.", autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Black takes the queen.", autoAdvance: 800, highlightSquares: ['d8', 'd1'] },
    { type: 'play-move', fen: FEN.after_Qxd1, correctMove: 'Rxd1', prompt: 'Your move.', hint: 'Rxd1.', correctFeedback: 'Rxd1.', wrongFeedback: 'Rxd1.' },

    // Black plays Bg4
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Black develops the bishop to g4.", autoAdvance: 800, highlightSquares: ['c8', 'g4'] },

    // PREDICT 1: f3
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'f3', prompt: "Black's bishop just arrived on g4. How do you deal with it?", hint: 'Push f3 to kick the bishop away.', correctFeedback: "f3 forces the bishop to retreat. Simple and effective.", wrongFeedback: 'Push f3 — chase the bishop off g4.' },
    { type: 'instruction', fen: FEN.after_f3, text: "f3 attacks the bishop on g4 and takes away any tricks. The bishop has to move.", arrow: ['f2', 'f3'] },

    // Black plays Be6
    { type: 'instruction', fen: FEN.after_f3, text: "The bishop retreats to e6.", autoAdvance: 800, highlightSquares: ['g4', 'e6'] },

    // PREDICT 2: Be3
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Be3', prompt: "Time to develop your last minor piece. Where does the bishop go?", hint: 'Put the bishop on e3 — it pressures c5 and supports d4.', correctFeedback: "Be3 develops and targets the c5 pawn.", wrongFeedback: 'Bishop to e3 — develop and eye the c5 pawn.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Be3 develops your bishop to a great diagonal. It eyes the c5 pawn and controls the center.", arrow: ['c1', 'e3'] },

    // Black plays b6
    { type: 'instruction', fen: FEN.after_Be3, text: "Black plays b6, supporting the c5 pawn.", autoAdvance: 800, highlightSquares: ['b7', 'b6'] },

    // PREDICT 3: Nc3
    { type: 'play-move', fen: FEN.after_b6, correctMove: 'Nc3', prompt: "One piece left to develop. Where does the knight go?", hint: 'Bring the knight to c3 — the natural developing square.', correctFeedback: "Nc3 completes your development. Both knights and both bishops are in play.", wrongFeedback: 'Knight to c3 — finish development.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: "Nc3 finishes your development. All your pieces are active, you control the d-file, and Black's doubled pawns remain a target.", arrow: ['b1', 'c3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Rxd1, text: "One more time — play all three from memory." },
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Black plays Bg4.", autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'f3', prompt: 'Your move.', hint: 'f3.', correctFeedback: 'f3.', wrongFeedback: 'f3.' },
    { type: 'instruction', fen: FEN.after_f3, text: "Bishop retreats to e6.", autoAdvance: 800, highlightSquares: ['g4', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Black plays b6.", autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.after_b6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },

    // OUTRO
    { type: 'instruction', fen: FEN.after_Nc3, text: "You're fully developed with a clear plan. The Exchange Variation is all about patience — your better structure does the work." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rle-dev-Qf6: If 5...Qf6 (instead of f6)
// Black brings the queen out early — punish with d4 and Bg5
// ═══════════════════════════════════════════════════════════

const RLE_DEV_QF6: OpeningLesson = {
  id: 'rle-dev-Qf6',
  title: 'If 5...Qf6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_OO, text: "Sometimes Black brings the queen to f6 instead of playing f6. The queen is exposed there — you can punish it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_a6, text: "Show me you've got the basics." },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_OO, text: "Black plays Qf6 instead of f6.", autoAdvance: 800, highlightSquares: ['d8', 'f6'] },

    // PREDICT 1: d4
    { type: 'play-move', fen: FEN.dev_Qf6, correctMove: 'd4', prompt: "Black's queen is on f6. How do you take advantage of your development?", hint: 'Push d4 — open the center while the queen is misplaced.', correctFeedback: "d4! Open the center while Black's queen is offside.", wrongFeedback: 'Push d4 — strike the center before Black settles.' },
    { type: 'instruction', fen: FEN.dev_Qf6_d4, text: "d4 opens the center. Black's queen on f6 isn't helping defend, and your pieces are ready to pounce.", arrow: ['d2', 'd4'] },

    // Black plays exd4
    { type: 'instruction', fen: FEN.dev_Qf6_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },

    // PREDICT 2: Bg5
    { type: 'play-move', fen: FEN.dev_Qf6_exd4, correctMove: 'Bg5', prompt: "The center is open and Black's queen is on f6. Find the aggressive developing move.", hint: 'Develop the bishop to g5 — attack the queen.', correctFeedback: "Bg5 attacks the queen and develops with tempo!", wrongFeedback: 'Bishop to g5 — hit the queen.' },
    { type: 'instruction', fen: FEN.dev_Qf6_Bg5, text: "Bg5 attacks the queen and gains a tempo. The queen has to move again, wasting time.", arrow: ['c1', 'g5'] },

    // Black plays Qd6
    { type: 'instruction', fen: FEN.dev_Qf6_Bg5, text: "The queen retreats to d6.", autoAdvance: 800, highlightSquares: ['f6', 'd6'] },

    // PREDICT 3: Nxd4
    { type: 'play-move', fen: FEN.dev_Qf6_Qd6, correctMove: 'Nxd4', prompt: "You've gained tempo. Now recapture the pawn.", hint: 'Take back on d4 with the knight.', correctFeedback: "Nxd4 recaptures and centralizes the knight.", wrongFeedback: 'Recapture on d4 with the knight.' },
    { type: 'instruction', fen: FEN.dev_Qf6_Nxd4, text: "Nxd4 puts your knight in the center. You're ahead in development and Black's queen has moved three times already.", arrow: ['f3', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Qf6, text: "Now from memory — what do you play against Qf6?" },
    { type: 'play-move', fen: FEN.dev_Qf6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Qf6_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.dev_Qf6_exd4, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.dev_Qf6_Bg5, text: "Queen retreats to d6.", autoAdvance: 800, highlightSquares: ['f6', 'd6'] },
    { type: 'play-move', fen: FEN.dev_Qf6_Qd6, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_Qf6_Nxd4, text: "When Black brings the queen out early, punish it with d4 and Bg5. You gain time and a great position." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rle-dev-Bd7: If 9...Bd7 (instead of Bg4)
// Black develops quietly — seize the initiative
// ═══════════════════════════════════════════════════════════

const RLE_DEV_BD7: OpeningLesson = {
  id: 'rle-dev-Bd7',
  title: 'If 9...Bd7',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Instead of Bg4, Black sometimes plays Bd7 — a quieter development. You respond with Bf4 and dominate the center." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_d4, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Black plays c5.", autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Black takes the queen.", autoAdvance: 800, highlightSquares: ['d8', 'd1'] },
    { type: 'play-move', fen: FEN.after_Qxd1, correctMove: 'Rxd1', prompt: 'Your move.', hint: 'Rxd1.', correctFeedback: 'Rxd1.', wrongFeedback: 'Rxd1.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Black plays Bd7 instead of Bg4.", autoAdvance: 800, highlightSquares: ['c8', 'd7'] },

    // PREDICT 1: Bf4
    { type: 'play-move', fen: FEN.dev_Bd7, correctMove: 'Bf4', prompt: "Black developed quietly. How do you develop your bishop?", hint: 'Put the bishop on f4 — it controls the center and eyes c7.', correctFeedback: "Bf4 develops with purpose, eyeing the c7 pawn.", wrongFeedback: 'Bishop to f4 — active development.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Bf4, text: "Bf4 is the most active square for the bishop. It pressures c7 and controls the d6 square.", arrow: ['c1', 'f4'] },

    // Black plays O-O-O
    { type: 'instruction', fen: FEN.dev_Bd7_Bf4, text: "Black castles queenside.", autoAdvance: 800, highlightSquares: ['e8', 'c8'] },

    // PREDICT 2: Nc3
    { type: 'play-move', fen: FEN.dev_Bd7_OOO, correctMove: 'Nc3', prompt: "Black has castled. Continue developing — where does the knight go?", hint: 'Bring the knight to c3 — finish your development.', correctFeedback: "Nc3 completes your development. The knight eyes d5.", wrongFeedback: 'Knight to c3 — develop toward the center.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Nc3, text: "Nc3 develops the last piece and the knight targets d5, a powerful outpost.", arrow: ['b1', 'c3'] },

    // Black plays Be6
    { type: 'instruction', fen: FEN.dev_Bd7_Nc3, text: "Black repositions the bishop to e6.", autoAdvance: 800, highlightSquares: ['d7', 'e6'] },

    // PREDICT 3: Rxd8+
    { type: 'play-move', fen: FEN.dev_Bd7_Be6, correctMove: 'Rxd8+', prompt: "You have a rook on d1 and Black's rook is on d8. Find the forcing move.", hint: 'Trade rooks with check — Rxd8+.', correctFeedback: "Rxd8+! Trading rooks with check and simplifying.", wrongFeedback: 'Capture the rook on d8 — it comes with check.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Rxd8, text: "Rxd8+ trades a pair of rooks and forces the king to recapture. You're simplifying into a position where your better structure shines.", arrow: ['d1', 'd8'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Bd7, text: "From memory — what's the plan against Bd7?" },
    { type: 'play-move', fen: FEN.dev_Bd7, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Bf4, text: "Black castles queenside.", autoAdvance: 800, highlightSquares: ['e8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_Bd7_OOO, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Nc3, text: "Bishop to e6.", autoAdvance: 800, highlightSquares: ['d7', 'e6'] },
    { type: 'play-move', fen: FEN.dev_Bd7_Be6, correctMove: 'Rxd8+', prompt: 'Your move.', hint: 'Rxd8+.', correctFeedback: 'Rxd8+.', wrongFeedback: 'Rxd8+.' },

    // OUTRO
    { type: 'instruction', fen: FEN.dev_Bd7_Rxd8, text: "Against Bd7, you develop with Bf4, bring the knight to c3, and simplify with Rxd8+. Clean and effective." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rle-test-1: Level Test
// Main line + all deviations, pure recall
// ═══════════════════════════════════════════════════════════

const RLE_TEST: OpeningLesson = {
  id: 'rle-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE ===
    // Lesson 1 moves
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: "Black plays e5.", autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black plays Nc6.", autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },

    // Lesson 2 moves
    { type: 'instruction', fen: FEN.after_Bb5, text: "Black plays a6.", autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: "Black recaptures.", autoAdvance: 800, highlightSquares: ['d7', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: "Black plays f6.", autoAdvance: 800, highlightSquares: ['f7', 'f6'] },
    { type: 'play-move', fen: FEN.after_f6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // Lesson 3 moves
    { type: 'instruction', fen: FEN.after_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Black plays c5.", autoAdvance: 800, highlightSquares: ['c6', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: "Black takes the queen.", autoAdvance: 800, highlightSquares: ['d8', 'd1'] },
    { type: 'play-move', fen: FEN.after_Qxd1, correctMove: 'Rxd1', prompt: 'Your move.', hint: 'Rxd1.', correctFeedback: 'Rxd1.', wrongFeedback: 'Rxd1.' },

    // Lesson 4 moves
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Black plays Bg4.", autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'f3', prompt: 'Your move.', hint: 'f3.', correctFeedback: 'f3.', wrongFeedback: 'f3.' },
    { type: 'instruction', fen: FEN.after_f3, text: "Bishop to e6.", autoAdvance: 800, highlightSquares: ['g4', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Black plays b6.", autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.after_b6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },

    // === DEVIATION: 5...Qf6 ===
    { type: 'instruction', fen: FEN.after_OO, text: "Now: Black plays Qf6 instead.", autoAdvance: 800, highlightSquares: ['d8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_Qf6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Qf6_d4, text: "Black takes on d4.", autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.dev_Qf6_exd4, correctMove: 'Bg5', prompt: 'Your move.', hint: 'Bg5.', correctFeedback: 'Bg5.', wrongFeedback: 'Bg5.' },
    { type: 'instruction', fen: FEN.dev_Qf6_Bg5, text: "Queen retreats to d6.", autoAdvance: 800, highlightSquares: ['f6', 'd6'] },
    { type: 'play-move', fen: FEN.dev_Qf6_Qd6, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },

    // === DEVIATION: 9...Bd7 ===
    { type: 'instruction', fen: FEN.after_Rxd1, text: "Now: Black plays Bd7 instead of Bg4.", autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.dev_Bd7, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Bf4, text: "Black castles queenside.", autoAdvance: 800, highlightSquares: ['e8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_Bd7_OOO, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_Bd7_Nc3, text: "Bishop to e6.", autoAdvance: 800, highlightSquares: ['d7', 'e6'] },
    { type: 'play-move', fen: FEN.dev_Bd7_Be6, correctMove: 'Rxd8+', prompt: 'Your move.', hint: 'Rxd8+.', correctFeedback: 'Rxd8+.', wrongFeedback: 'Rxd8+.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// Lookup
// ═══════════════════════════════════════════════════════════

export function getRuyLopezExchangeLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'rle-1': return RLE_LESSON_1
    case 'rle-2': return RLE_LESSON_2
    case 'rle-3': return RLE_LESSON_3
    case 'rle-4': return RLE_LESSON_4
    case 'rle-dev-Qf6': return RLE_DEV_QF6
    case 'rle-dev-Bd7': return RLE_DEV_BD7
    case 'rle-test-1': return RLE_TEST
    default: return undefined
  }
}
