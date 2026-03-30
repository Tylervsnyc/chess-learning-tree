import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// ITALIAN TWO KNIGHTS DEFENSE LESSONS (itk-1 through itk-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line:
// 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Bc5 5.c3 d6 6.O-O
// O-O 7.Re1 a5 8.h3 h6 9.Nbd2 Be6 10.Bb5 Qb8 11.Nf1 Qa7 12.Be3
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:         'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:     'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:     'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bc4:     'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_Nf6:     'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  after_d3:      'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
  after_Bc5:     'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5',
  after_c3:      'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R b KQkq - 0 5',
  after_d6:      'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6',
  after_OO_w:    'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b kq - 1 6',
  after_OO_b:    'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7',
  after_Re1:     'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 b - - 3 7',
  after_a5:      'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8',
  after_h3:      'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 b - - 0 8',
  after_h6:      'r1bq1rk1/1pp2pp1/2np1n1p/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 w - - 0 9',
  after_Nbd2:    'r1bq1rk1/1pp2pp1/2np1n1p/p1b1p3/2B1P3/2PP1N1P/PP1N1PP1/R1BQR1K1 b - - 1 9',
  after_Be6:     'r2q1rk1/1pp2pp1/2npbn1p/p1b1p3/2B1P3/2PP1N1P/PP1N1PP1/R1BQR1K1 w - - 2 10',
  after_Bb5:     'r2q1rk1/1pp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP1N1PP1/R1BQR1K1 b - - 3 10',
  after_Qb8:     'rq3rk1/1pp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP1N1PP1/R1BQR1K1 w - - 4 11',
  after_Nf1:     'rq3rk1/1pp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP3PP1/R1BQRNK1 b - - 5 11',
  after_Qa7:     'r4rk1/qpp2pp1/2npbn1p/pBb1p3/4P3/2PP1N1P/PP3PP1/R1BQRNK1 w - - 6 12',
  after_Be3:     'r4rk1/qpp2pp1/2npbn1p/pBb1p3/4P3/2PPBN1P/PP3PP1/R2QRNK1 b - - 7 12',

  // Deviation: 4...h6 (instead of 4...Bc5)
  devH6_after_h6:   'r1bqkb1r/pppp1pp1/2n2n1p/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  devH6_after_OO:   'r1bqkb1r/pppp1pp1/2n2n1p/4p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5',
  devH6_after_d6:   'r1bqkb1r/ppp2pp1/2np1n1p/4p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 6',
  devH6_after_c3:   'r1bqkb1r/ppp2pp1/2np1n1p/4p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b kq - 0 6',
  devH6_after_g6:   'r1bqkb1r/ppp2p2/2np1npp/4p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w kq - 0 7',
  devH6_after_d4:   'r1bqkb1r/ppp2p2/2np1npp/4p3/2BPP3/2P2N2/PP3PPP/RNBQ1RK1 b kq - 0 7',

  // Deviation: 5...O-O (instead of 5...d6)
  devOO_after_OO_b: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQ - 1 6',
  devOO_after_OO_w: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b - - 2 6',
  devOO_after_d6:   'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 7',
  devOO_after_Re1:  'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 b - - 1 7',
  devOO_after_a5:   'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8',
  devOO_after_h3:   'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 b - - 0 8',

  // Deviation: 6...a5 (instead of 6...O-O)
  devA5_after_a5:   'r1bqk2r/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w kq - 0 7',
  devA5_after_Re1:  'r1bqk2r/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 b kq - 1 7',
  devA5_after_OO_b: 'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 2 8',
  devA5_after_h3:   'r1bq1rk1/1pp2ppp/2np1n2/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 b - - 0 8',
  devA5_after_h6:   'r1bq1rk1/1pp2pp1/2np1n1p/p1b1p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1 w - - 0 9',
  devA5_after_Nbd2: 'r1bq1rk1/1pp2pp1/2np1n1p/p1b1p3/2B1P3/2PP1N1P/PP1N1PP1/R1BQR1K1 b - - 1 9',
}


// ═══════════════════════════════════════════════════════════
// itk-1: The Italian Setup (e4, Nf3, Bc4)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const ITK_1: OpeningLesson = {
  id: 'itk-1',
  title: 'The Italian Setup',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Italian Game starts with three natural developing moves. You'll open the center, develop the knight, and aim the bishop at Black's weakest point." },

    // PREDICT 1: e4
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Start the game. What is the best opening move?', hint: 'Grab the center with your e-pawn.', correctFeedback: 'e4 controls the center and opens lines for your bishop and queen.', wrongFeedback: 'Play e4 — claim the center.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4 is the most popular opening move. It controls d5 and f5, and frees both the queen and the bishop.', arrow: ['e2', 'e4'] },

    // Black plays 1...e5
    { type: 'instruction', fen: FEN.after_e4, text: 'Black mirrors you with e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },

    // PREDICT 2: Nf3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'How do you develop and attack at the same time?', hint: 'Develop the knight toward the center — it attacks the e5 pawn.', correctFeedback: 'Nf3 develops the knight and puts pressure on the e5 pawn.', wrongFeedback: 'Play Nf3 — develop and attack e5.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3 does two things at once: develops the knight and attacks the e5 pawn. Black needs to defend.', arrow: ['g1', 'f3'] },

    // Black plays 2...Nc6
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Black defends e5 with Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: Bc4
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Where does the bishop go in the Italian Game?', hint: 'Aim the bishop at the f7 square — the weakest point in Black\'s position.', correctFeedback: 'Bc4 targets f7, the square only defended by the king.', wrongFeedback: 'Play Bc4 — aim at Black\'s f7 weakness.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Bc4 is the Italian Game. The bishop stares at f7, the weakest square in Black\'s camp because only the king defends it.', arrow: ['f1', 'c4'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    { type: 'instruction', fen: FEN.after_Bc4, text: "e4, Nf3, Bc4 — the Italian Game. Your pieces are developed and your bishop is aimed right at f7." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-2: The Two Knights Response (d3, c3, O-O)
// ═══════════════════════════════════════════════════════════

const ITK_2: OpeningLesson = {
  id: 'itk-2',
  title: 'The Two Knights Response',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Bc4, text: "Black plays Nf6, counterattacking your e4 pawn. You'll learn how to build a solid center with d3, c3, and then castle." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },

    // Black plays 3...Nf6
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Black plays Nf6, attacking your e4 pawn. This is the Two Knights Defense.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 1: d3
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Black is attacking e4. How do you defend it?', hint: 'Support the e4 pawn with a solid pawn move.', correctFeedback: 'd3 defends e4 and opens a path for the bishop on c1.', wrongFeedback: 'Play d3 — it defends e4 and opens the c1 bishop diagonal.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'd3 is the modern, solid choice. It defends e4 and lets the dark-squared bishop develop later.', arrow: ['d2', 'd3'] },

    // Black plays 4...Bc5
    { type: 'instruction', fen: FEN.after_d3, text: 'Black develops the bishop to c5, mirroring your Italian bishop.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'How do you prepare to control the center?', hint: 'A pawn move that prepares d4 later.', correctFeedback: 'c3 prepares a future d4 push and gives your queen a retreat square.', wrongFeedback: 'Play c3 — it prepares d4 and supports your center.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'c3 prepares d4, which would give you a strong pawn center. Black needs to decide how to respond.', arrow: ['c2', 'c3'] },

    // Black plays 5...d6
    { type: 'instruction', fen: FEN.after_c3, text: 'Black plays d6, solidifying the center.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your pieces are developed. What is the next priority?', hint: 'Get your king to safety.', correctFeedback: 'Castling gets your king safe and connects the rooks.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O is always a priority once your pieces are developed. Your king is safe and the rook is ready to enter the game.', arrow: ['e1', 'g1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bc4, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.after_OO_w, text: "d3, c3, O-O — you've built a solid center and castled safely. The Two Knights is under control." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-dev-h6: Black plays 4...h6 instead of 4...Bc5
// ═══════════════════════════════════════════════════════════

const ITK_DEV_H6: OpeningLesson = {
  id: 'itk-dev-h6',
  title: 'Dev 4...h6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_d3, text: "Sometimes Black plays 4...h6 instead of developing the bishop. It's a slow move — here's how to take advantage." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_d3, text: 'Black plays h6 instead of Bc5 — a waiting move that prevents Bg5.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.devH6_after_h6, correctMove: 'O-O', prompt: 'Black played a slow move. What do you do?', hint: 'Black wasted a tempo — get your king safe.', correctFeedback: 'O-O gets your king to safety while Black has spent time on h6 instead of developing.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.devH6_after_OO, text: 'Castling is perfect here. Black played h6 instead of developing, so you\'re ahead in development.', arrow: ['e1', 'g1'] },

    // Black plays 5...d6
    { type: 'instruction', fen: FEN.devH6_after_OO, text: 'Black plays d6, solidifying the center.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.devH6_after_d6, correctMove: 'c3', prompt: 'How do you prepare to expand in the center?', hint: 'Same idea as the main line — prepare d4.', correctFeedback: 'c3 prepares d4, just like in the main line. Your plan stays the same.', wrongFeedback: 'Play c3 — prepare the d4 push.' },
    { type: 'instruction', fen: FEN.devH6_after_c3, text: 'c3 prepares d4. Black\'s h6 hasn\'t changed your plan at all — you\'re still building toward a strong center.', arrow: ['c2', 'c3'] },

    // Black plays 6...g6
    { type: 'instruction', fen: FEN.devH6_after_c3, text: 'Black plays g6, preparing to fianchetto the bishop.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },

    // PREDICT 3: d4
    { type: 'play-move', fen: FEN.devH6_after_g6, correctMove: 'd4', prompt: 'Black is slow with development. Time to strike the center.', hint: 'Push the d-pawn forward — claim the center.', correctFeedback: 'd4 opens up the position while Black\'s bishop is still on f8.', wrongFeedback: 'Play d4 — seize the center while Black is underdeveloped.' },
    { type: 'instruction', fen: FEN.devH6_after_d4, text: 'd4 is strong here. You have a big pawn center and Black is struggling to catch up in development.', arrow: ['d3', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.devH6_after_h6, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devH6_after_h6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devH6_after_OO, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.devH6_after_d6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.devH6_after_c3, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.devH6_after_g6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    { type: 'instruction', fen: FEN.devH6_after_d4, text: "O-O, c3, d4 — when Black wastes time with h6, you get to build a commanding center." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-dev-O-O: Black plays 5...O-O instead of 5...d6
// ═══════════════════════════════════════════════════════════

const ITK_DEV_OO: OpeningLesson = {
  id: 'itk-dev-O-O',
  title: 'Dev 5...O-O',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_c3, text: "Sometimes Black castles immediately with 5...O-O instead of playing d6 first. Your response is natural — castle too, then develop." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_c3, text: 'Black castles immediately instead of playing d6.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.devOO_after_OO_b, correctMove: 'O-O', prompt: 'Black castled early. What do you do?', hint: 'Follow suit — get your king safe too.', correctFeedback: 'O-O matches Black\'s castling and connects your rooks.', wrongFeedback: 'Castle kingside — O-O.' },
    { type: 'instruction', fen: FEN.devOO_after_OO_w, text: 'Both sides castled. Now it\'s time to activate your pieces in the middlegame.', arrow: ['e1', 'g1'] },

    // Black plays 6...d6
    { type: 'instruction', fen: FEN.devOO_after_OO_w, text: 'Black plays d6, solidifying the center.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 2: Re1
    { type: 'play-move', fen: FEN.devOO_after_d6, correctMove: 'Re1', prompt: 'How do you activate the rook?', hint: 'Put the rook on the open file behind your e4 pawn.', correctFeedback: 'Re1 supports the e4 pawn and puts the rook on a central file.', wrongFeedback: 'Play Re1 — activate the rook on the e-file.' },
    { type: 'instruction', fen: FEN.devOO_after_Re1, text: 'Re1 is a standard move. The rook supports e4 and eyes the center from behind the pawn.', arrow: ['f1', 'e1'] },

    // Black plays 7...a5
    { type: 'instruction', fen: FEN.devOO_after_Re1, text: 'Black plays a5, grabbing space on the queenside.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },

    // PREDICT 3: h3
    { type: 'play-move', fen: FEN.devOO_after_a5, correctMove: 'h3', prompt: 'How do you prevent Black from pinning your knight?', hint: 'A small pawn move that stops Bg4.', correctFeedback: 'h3 prevents Bg4, which would pin your f3 knight to the queen.', wrongFeedback: 'Play h3 — stop Black from pinning your knight with Bg4.' },
    { type: 'instruction', fen: FEN.devOO_after_h3, text: 'h3 is a useful prophylactic move. It stops Bg4 for good and gives your king a little breathing room.', arrow: ['h2', 'h3'] },

    // RECALL
    { type: 'instruction', fen: FEN.devOO_after_OO_b, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devOO_after_OO_b, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devOO_after_OO_w, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.devOO_after_d6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.devOO_after_Re1, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.devOO_after_a5, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    { type: 'instruction', fen: FEN.devOO_after_h3, text: "O-O, Re1, h3 — even when Black castles early, your plan stays smooth. Develop naturally and control the center." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-3: Building the Position (Re1, h3, Nbd2)
// ═══════════════════════════════════════════════════════════

const ITK_3: OpeningLesson = {
  id: 'itk-3',
  title: 'Building the Position',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_OO_w, text: "Both sides have castled. Now you'll activate the rook, prevent a pin, and develop the knight to d2." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // Black plays 6...O-O
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Black castles kingside too.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 1: Re1
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'Re1', prompt: 'How do you activate the rook?', hint: 'Put the rook behind the e4 pawn.', correctFeedback: 'Re1 places the rook on the central e-file, supporting e4.', wrongFeedback: 'Play Re1 — activate the rook on the e-file.' },
    { type: 'instruction', fen: FEN.after_Re1, text: 'Re1 is a natural developing move. The rook supports the e4 pawn and controls the open file.', arrow: ['f1', 'e1'] },

    // Black plays 7...a5
    { type: 'instruction', fen: FEN.after_Re1, text: 'Black plays a5, expanding on the queenside.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },

    // PREDICT 2: h3
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'h3', prompt: 'What useful prophylactic move prevents a pin?', hint: 'Stop Black from playing Bg4.', correctFeedback: 'h3 prevents Bg4, keeping your knight free on f3.', wrongFeedback: 'Play h3 — it stops the annoying Bg4 pin.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'h3 is a small but important move. It permanently prevents Bg4 and gives your king an escape square.', arrow: ['h2', 'h3'] },

    // Black plays 8...h6
    { type: 'instruction', fen: FEN.after_h3, text: 'Black mirrors with h6, preventing Bg5.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nbd2', prompt: 'Time to develop the last minor piece. Where does the knight go?', hint: 'Develop the knight to d2 — it can go to f1 later.', correctFeedback: 'Nbd2 develops the knight and prepares to reroute it to f1 and e3 or g3.', wrongFeedback: 'Play Nbd2 — develop the knight with a future plan.' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2 is a key maneuver. The knight aims for f1 and then e3 or g3, where it supports the center.', arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_OO_b, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re1, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    { type: 'instruction', fen: FEN.after_Nbd2, text: "Re1, h3, Nbd2 — your pieces are all in the game. Now it's time to start regrouping." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-dev-a5: Black plays 6...a5 instead of 6...O-O
// ═══════════════════════════════════════════════════════════

const ITK_DEV_A5: OpeningLesson = {
  id: 'itk-dev-a5',
  title: 'Dev 6...a5',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_OO_w, text: "Sometimes Black plays 6...a5 instead of castling, grabbing space on the queenside. Your plan stays the same — develop and control the center." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Black plays a5 instead of castling, expanding on the queenside.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },

    // PREDICT 1: Re1
    { type: 'play-move', fen: FEN.devA5_after_a5, correctMove: 'Re1', prompt: 'Black is expanding on the queenside. How do you continue?', hint: 'Activate the rook — same plan as the main line.', correctFeedback: 'Re1 develops the rook to the center. Your plan doesn\'t change because of a5.', wrongFeedback: 'Play Re1 — activate the rook on the e-file.' },
    { type: 'instruction', fen: FEN.devA5_after_Re1, text: 'Re1 is the right move regardless of whether Black has played a5 or O-O. The rook belongs on the e-file.', arrow: ['f1', 'e1'] },

    // Black plays 7...O-O
    { type: 'instruction', fen: FEN.devA5_after_Re1, text: 'Black castles now.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 2: h3
    { type: 'play-move', fen: FEN.devA5_after_OO_b, correctMove: 'h3', prompt: 'What important prophylactic move do you play?', hint: 'Prevent Bg4.', correctFeedback: 'h3 prevents the annoying Bg4 pin, keeping your knight free.', wrongFeedback: 'Play h3 — stop Black from pinning your knight.' },
    { type: 'instruction', fen: FEN.devA5_after_h3, text: 'h3 is the same useful move. It prevents Bg4 and gives your king a little breathing room on h2.', arrow: ['h2', 'h3'] },

    // Black plays 8...h6
    { type: 'instruction', fen: FEN.devA5_after_h3, text: 'Black plays h6, stopping Bg5.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.devA5_after_h6, correctMove: 'Nbd2', prompt: 'How do you develop the last knight?', hint: 'To d2 — heading for f1 and then g3 or e3.', correctFeedback: 'Nbd2 develops the knight with a clear plan to reroute to f1.', wrongFeedback: 'Play Nbd2 — the knight is heading for f1.' },
    { type: 'instruction', fen: FEN.devA5_after_Nbd2, text: 'Nbd2 is the same plan as the main line. The knight heads to f1 and then to a better square. Black\'s a5 didn\'t change anything.', arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.devA5_after_a5, text: "Now play all three from memory." },
    { type: 'play-move', fen: FEN.devA5_after_a5, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.devA5_after_Re1, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.devA5_after_OO_b, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.devA5_after_h3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.devA5_after_h6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    { type: 'instruction', fen: FEN.devA5_after_Nbd2, text: "Re1, h3, Nbd2 — Black's a5 didn't change your plan at all. Just keep developing." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-4: Regrouping the Pieces (Bb5, Nf1, Be3)
// ═══════════════════════════════════════════════════════════

const ITK_4: OpeningLesson = {
  id: 'itk-4',
  title: 'Regrouping the Pieces',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Your pieces are all developed. Now it's time to regroup — reposition the bishop, reroute the knight, and develop the last piece." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re1, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // Black plays 9...Be6
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Black develops the bishop to e6, eyeing your c4 bishop.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },

    // PREDICT 1: Bb5
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Bb5', prompt: 'Black is threatening to exchange your bishop. Where does it go?', hint: 'Move the bishop to a more active square on the b5 diagonal.', correctFeedback: 'Bb5 sidesteps the exchange and puts the bishop on an active diagonal, eyeing the c6 knight.', wrongFeedback: 'Play Bb5 — reposition the bishop to a better diagonal.' },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'Bb5 is a regrouping move. The bishop avoids the exchange and eyes the c6 knight from a strong outpost.', arrow: ['c4', 'b5'] },

    // Black plays 10...Qb8
    { type: 'instruction', fen: FEN.after_Bb5, text: 'Black plays Qb8, preparing to go to a7 or b7.', autoAdvance: 800, highlightSquares: ['d8', 'b8'] },

    // PREDICT 2: Nf1
    { type: 'play-move', fen: FEN.after_Qb8, correctMove: 'Nf1', prompt: 'How do you improve the knight on d2?', hint: 'Reroute the knight — it\'s heading to e3 or g3.', correctFeedback: 'Nf1 reroutes the knight toward e3 or g3, where it\'s much more active.', wrongFeedback: 'Play Nf1 — the knight is heading to a better square.' },
    { type: 'instruction', fen: FEN.after_Nf1, text: 'Nf1 is a classic Italian maneuver. The knight will jump to e3 (supporting d5) or g3 (attacking the kingside).', arrow: ['d2', 'f1'] },

    // Black plays 11...Qa7
    { type: 'instruction', fen: FEN.after_Nf1, text: 'Black repositions the queen to a7.', autoAdvance: 800, highlightSquares: ['b8', 'a7'] },

    // PREDICT 3: Be3
    { type: 'play-move', fen: FEN.after_Qa7, correctMove: 'Be3', prompt: 'One piece left to develop. Where does it go?', hint: 'Develop the dark-squared bishop to an active square.', correctFeedback: 'Be3 develops the last piece and eyes the c5 bishop, potentially offering a trade.', wrongFeedback: 'Play Be3 — develop the last minor piece.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Be3 completes development. Every piece is active, and you\'re ready for middlegame play.', arrow: ['c1', 'e3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'Qb8.', autoAdvance: 800, highlightSquares: ['d8', 'b8'] },
    { type: 'play-move', fen: FEN.after_Qb8, correctMove: 'Nf1', prompt: 'Your move.', hint: 'Nf1.', correctFeedback: 'Nf1.', wrongFeedback: 'Nf1.' },
    { type: 'instruction', fen: FEN.after_Nf1, text: 'Qa7.', autoAdvance: 800, highlightSquares: ['b8', 'a7'] },
    { type: 'play-move', fen: FEN.after_Qa7, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },

    { type: 'instruction', fen: FEN.after_Be3, text: "Bb5, Nf1, Be3 — every piece is active and you're fully developed. The Italian Two Knights is complete." },
  ],
}


// ═══════════════════════════════════════════════════════════
// itk-test-1: Level Test
// Pure recall — main line + all deviations.
// ═══════════════════════════════════════════════════════════

const ITK_TEST_1: OpeningLesson = {
  id: 'itk-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "Play the full Two Knights main line and handle every deviation. No hints this time." },

    // === MAIN LINE (12 White moves) ===
    // Move 1: e4
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    // Move 2: Nf3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    // Move 3: Bc4
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    // Move 4: d3
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'd3', prompt: 'Your move.', hint: 'd3.', correctFeedback: 'd3.', wrongFeedback: 'd3.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    // Move 5: c3
    { type: 'play-move', fen: FEN.after_Bc5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    // Move 6: O-O
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    // Move 7: Re1
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re1, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    // Move 8: h3
    { type: 'play-move', fen: FEN.after_a5, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    // Move 9: Nbd2
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Be6.', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    // Move 10: Bb5
    { type: 'play-move', fen: FEN.after_Be6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'Qb8.', autoAdvance: 800, highlightSquares: ['d8', 'b8'] },
    // Move 11: Nf1
    { type: 'play-move', fen: FEN.after_Qb8, correctMove: 'Nf1', prompt: 'Your move.', hint: 'Nf1.', correctFeedback: 'Nf1.', wrongFeedback: 'Nf1.' },
    { type: 'instruction', fen: FEN.after_Nf1, text: 'Qa7.', autoAdvance: 800, highlightSquares: ['b8', 'a7'] },
    // Move 12: Be3
    { type: 'play-move', fen: FEN.after_Qa7, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },

    // === DEVIATION: 4...h6 ===
    { type: 'instruction', fen: FEN.after_d3, text: 'Now Black plays h6 instead.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.devH6_after_h6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devH6_after_OO, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.devH6_after_d6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.devH6_after_c3, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.devH6_after_g6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // === DEVIATION: 5...O-O ===
    { type: 'instruction', fen: FEN.after_c3, text: 'Now Black castles early instead of d6.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.devOO_after_OO_b, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devOO_after_OO_w, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.devOO_after_d6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.devOO_after_Re1, text: 'a5.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.devOO_after_a5, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    // === DEVIATION: 6...a5 ===
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Now Black plays a5 instead of castling.', autoAdvance: 800, highlightSquares: ['a7', 'a5'] },
    { type: 'play-move', fen: FEN.devA5_after_a5, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.devA5_after_Re1, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.devA5_after_OO_b, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.devA5_after_h3, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.devA5_after_h6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    { type: 'instruction', fen: FEN.after_Be3, text: "You know the Two Knights inside and out. Every main line move, every deviation." },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getItalianTwoKnightsLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'itk-1': return ITK_1
    case 'itk-2': return ITK_2
    case 'itk-dev-h6': return ITK_DEV_H6
    case 'itk-dev-O-O': return ITK_DEV_OO
    case 'itk-3': return ITK_3
    case 'itk-dev-a5': return ITK_DEV_A5
    case 'itk-4': return ITK_4
    case 'itk-test-1': return ITK_TEST_1
    default: return undefined
  }
}
