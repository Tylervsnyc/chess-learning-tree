import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// RUY LOPEZ LESSONS — v2 (Predict/Reveal format)
//
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7
//            6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Na5 10.Bc2 c5
//            11.d4 Qc7 12.Nbd2
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:   'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:   'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bb5:  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  after_a6:   'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  after_Ba4:  'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4',
  after_Nf6:  'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 5',
  after_OO_w: 'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 3 5',
  after_Be7:  'r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6',
  after_Re1:  'r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 b kq - 5 6',
  after_b5:   'r1bqk2r/2ppbppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq - 0 7',
  after_Bb3:  'r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 b kq - 1 7',
  after_d6:   'r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w kq - 0 8',
  after_c3:   'r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b kq - 0 8',
  after_OO_b: 'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 1 9',
  after_h3:   'r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 b - - 0 9',
  after_Na5:  'r1bq1rk1/2p1bppp/p2p1n2/np2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w - - 1 10',
  after_Bc2:  'r1bq1rk1/2p1bppp/p2p1n2/np2p3/4P3/2P2N1P/PPBP1PP1/RNBQR1K1 b - - 2 10',
  after_c5:   'r1bq1rk1/4bppp/p2p1n2/npp1p3/4P3/2P2N1P/PPBP1PP1/RNBQR1K1 w - - 0 11',
  after_d4:   'r1bq1rk1/4bppp/p2p1n2/npp1p3/3PP3/2P2N1P/PPB2PP1/RNBQR1K1 b - - 0 11',
  after_Qc7:  'r1b2rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N1P/PPB2PP1/RNBQR1K1 w - - 1 12',
  after_Nbd2: 'r1b2rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N1P/PPBN1PP1/R1BQR1K1 b - - 2 12',

  // Deviation: 3...f5 (Schliemann)
  dev_f5:       'r1bqkbnr/pppp2pp/2n5/1B2pp2/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  dev_f5_Nc3:   'r1bqkbnr/pppp2pp/2n5/1B2pp2/4P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 1 4',
  dev_f5_fxe4:  'r1bqkbnr/pppp2pp/2n5/1B2p3/4p3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
  dev_f5_Nxe4:  'r1bqkbnr/pppp2pp/2n5/1B2p3/4N3/5N2/PPPP1PPP/R1BQK2R b KQkq - 0 5',
  dev_f5_Nf6:   'r1bqkb1r/pppp2pp/2n2n2/1B2p3/4N3/5N2/PPPP1PPP/R1BQK2R w KQkq - 1 6',
  dev_f5_Nxf6:  'r1bqkb1r/pppp2pp/2n2N2/1B2p3/8/5N2/PPPP1PPP/R1BQK2R b KQkq - 0 6',
  dev_f5_Qxf6:  'r1b1kb1r/pppp2pp/2n2q2/1B2p3/8/5N2/PPPP1PPP/R1BQK2R w KQkq - 0 7',
  dev_f5_Qe2:   'r1b1kb1r/pppp2pp/2n2q2/1B2p3/8/5N2/PPPPQPPP/R1B1K2R b KQkq - 1 7',

  // Deviation: 4...d6 (Steinitz Deferred)
  dev_d6:       'r1bqkbnr/1pp2ppp/p1np4/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
  dev_d6_OO:    'r1bqkbnr/1pp2ppp/p1np4/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 5',
  dev_d6_Bd7:   'r2qkbnr/1ppb1ppp/p1np4/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 2 6',
  dev_d6_c3:    'r2qkbnr/1ppb1ppp/p1np4/4p3/B3P3/2P2N2/PP1P1PPP/RNBQ1RK1 b kq - 0 6',
  dev_d6_g6:    'r2qkbnr/1ppb1p1p/p1np2p1/4p3/B3P3/2P2N2/PP1P1PPP/RNBQ1RK1 w kq - 0 7',
  dev_d6_d4:    'r2qkbnr/1ppb1p1p/p1np2p1/4p3/B2PP3/2P2N2/PP3PPP/RNBQ1RK1 b kq - 0 7',

  // Deviation: 5...b5 (Early b5)
  dev_b5:       'r1bqkb1r/2pp1ppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 6',
  dev_b5_Bb3:   'r1bqkb1r/2pp1ppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 b kq - 1 6',
  dev_b5_Bc5:   'r1bqk2r/2pp1ppp/p1n2n2/1pb1p3/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 w kq - 2 7',
  dev_b5_a4:    'r1bqk2r/2pp1ppp/p1n2n2/1pb1p3/P3P3/1B3N2/1PPP1PPP/RNBQ1RK1 b kq - 0 7',
  dev_b5_Rb8:   '1rbqk2r/2pp1ppp/p1n2n2/1pb1p3/P3P3/1B3N2/1PPP1PPP/RNBQ1RK1 w k - 1 8',
  dev_b5_c3:    '1rbqk2r/2pp1ppp/p1n2n2/1pb1p3/P3P3/1BP2N2/1P1P1PPP/RNBQ1RK1 b k - 0 8',

  // ═══════════════════════════════════════════════════════════
  // L2 FENs — after 12.Nbd2
  // ═══════════════════════════════════════════════════════════
  after_cxd4:     'r1b2rk1/2q1bppp/p2p1n2/np2p3/3pP3/2P2N1P/PPBN1PP1/R1BQR1K1 w - - 0 13',
  after_cxd4_w:   'r1b2rk1/2q1bppp/p2p1n2/np2p3/3PP3/5N1P/PPBN1PP1/R1BQR1K1 b - - 0 13',
  after_Nc6_l2:   'r1b2rk1/2q1bppp/p1np1n2/1p2p3/3PP3/5N1P/PPBN1PP1/R1BQR1K1 w - - 1 14',
  after_Nb3:      'r1b2rk1/2q1bppp/p1np1n2/1p2p3/3PP3/1N3N1P/PPB2PP1/R1BQR1K1 b - - 2 14',
  after_a5_l2:    'r1b2rk1/2q1bppp/2np1n2/pp2p3/3PP3/1N3N1P/PPB2PP1/R1BQR1K1 w - - 0 15',
  after_Be3:      'r1b2rk1/2q1bppp/2np1n2/pp2p3/3PP3/1N2BN1P/PPB2PP1/R2QR1K1 b - - 1 15',
  after_a4_l2:    'r1b2rk1/2q1bppp/2np1n2/1p2p3/p2PP3/1N2BN1P/PPB2PP1/R2QR1K1 w - - 0 16',
  after_Nbd2_l2:  'r1b2rk1/2q1bppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBN1PP1/R2QR1K1 b - - 1 16',
  after_Bd7:      'r4rk1/2qbbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBN1PP1/R2QR1K1 w - - 2 17',
  after_Rc1:      'r4rk1/2qbbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBN1PP1/2RQR1K1 b - - 3 17',
  after_Qb7:      'r4rk1/1q1bbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBN1PP1/2RQR1K1 w - - 4 18',
  after_Qe2:      'r4rk1/1q1bbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBNQPP1/2R1R1K1 b - - 5 18',
  after_Rfe8:     'r3r1k1/1q1bbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBNQPP1/2R1R1K1 w - - 6 19',
  after_Bd3:      'r3r1k1/1q1bbppp/2np1n2/1p2p3/p2PP3/3BBN1P/PP1NQPP1/2R1R1K1 b - - 7 19',
  after_Rab8:     '1r2r1k1/1q1bbppp/2np1n2/1p2p3/p2PP3/3BBN1P/PP1NQPP1/2R1R1K1 w - - 8 20',
  after_dxe5_l2:  '1r2r1k1/1q1bbppp/2np1n2/1p2P3/p3P3/3BBN1P/PP1NQPP1/2R1R1K1 b - - 0 20',
  after_Nxe5_b:   '1r2r1k1/1q1bbppp/3p1n2/1p2n3/p3P3/3BBN1P/PP1NQPP1/2R1R1K1 w - - 0 21',
  after_Nxe5_w:   '1r2r1k1/1q1bbppp/3p1n2/1p2N3/p3P3/3BB2P/PP1NQPP1/2R1R1K1 b - - 0 21',

  // L2 Deviation: 13...Bb7
  dev_Bb7:        'r4rk1/1bq1bppp/p2p1n2/np2p3/3PP3/5N1P/PPBN1PP1/R1BQR1K1 w - - 1 14',
  dev_Bb7_d5:     'r4rk1/1bq1bppp/p2p1n2/np1Pp3/4P3/5N1P/PPBN1PP1/R1BQR1K1 b - - 0 14',
  dev_Bb7_Rac8:   '2r2rk1/1bq1bppp/p2p1n2/np1Pp3/4P3/5N1P/PPBN1PP1/R1BQR1K1 w - - 1 15',
  dev_Bb7_Bd3:    '2r2rk1/1bq1bppp/p2p1n2/np1Pp3/4P3/3B1N1P/PP1N1PP1/R1BQR1K1 b - - 2 15',
  dev_Bb7_Nd7:    '2r2rk1/1bqnbppp/p2p4/np1Pp3/4P3/3B1N1P/PP1N1PP1/R1BQR1K1 w - - 3 16',
  dev_Bb7_Nf1:    '2r2rk1/1bqnbppp/p2p4/np1Pp3/4P3/3B1N1P/PP3PP1/R1BQRNK1 b - - 4 16',

  // Deviation: 9...Re8
  dev_Re8:      'r1bqr1k1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w - - 1 10',
  dev_Re8_d4:   'r1bqr1k1/2p1bppp/p1np1n2/1p2p3/3PP3/1BP2N1P/PP3PP1/RNBQR1K1 b - - 0 10',
  dev_Re8_Bb7:  'r2qr1k1/1bp1bppp/p1np1n2/1p2p3/3PP3/1BP2N1P/PP3PP1/RNBQR1K1 w - - 1 11',
  dev_Re8_Nbd2: 'r2qr1k1/1bp1bppp/p1np1n2/1p2p3/3PP3/1BP2N1P/PP1N1PP1/R1BQR1K1 b - - 2 11',
  dev_Re8_Bf8:  'r2qrbk1/1bp2ppp/p1np1n2/1p2p3/3PP3/1BP2N1P/PP1N1PP1/R1BQR1K1 w - - 3 12',
  dev_Re8_a4:   'r2qrbk1/1bp2ppp/p1np1n2/1p2p3/P2PP3/1BP2N1P/1P1N1PP1/R1BQR1K1 b - - 0 12',
}

// ═══════════════════════════════════════════════════════════
// rl-1: The Opening Moves (e4, Nf3, Bb5)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_1: OpeningLesson = {
  id: 'rl-1',
  title: 'The Opening Moves',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The Ruy Lopez starts with three moves that control the center and put pressure on Black's knight. Let's learn them." },

    // PREDICT 1: e4
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'What would you play to start?', hint: 'The most popular first move in chess — grab the center.', correctFeedback: 'e4 claims the center and opens lines for your bishop and queen.', wrongFeedback: 'Start by pushing the e-pawn two squares to control the center.', postMoveArrow: ['e4', 'd5'] },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4 controls d5 and f5, and opens the diagonal for your bishop.', arrow: ['e2', 'e4'] },

    // Black plays e5
    { type: 'instruction', fen: FEN.after_e4, text: 'Black mirrors you with e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },

    // PREDICT 2: Nf3
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: "Black's e5 pawn is undefended. How do you attack it?", hint: 'Develop a piece that attacks e5.', correctFeedback: 'Nf3 develops the knight and attacks the e5 pawn right away.', wrongFeedback: 'The knight on g1 can jump to f3, attacking e5 while developing.', postMoveArrow: ['f3', 'e5'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3 does two things at once — develops a piece and puts pressure on e5. Black has to defend.', arrow: ['g1', 'f3'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Black defends with Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 3: Bb5
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Black defended e5 with the knight. How do you keep the pressure on?', hint: 'Your bishop can target the knight that defends e5.', correctFeedback: "Bb5 pins the knight to the king — that's the Ruy Lopez!", wrongFeedback: "Put your bishop on b5 to pressure the knight that's defending e5.", postMoveArrow: ['b5', 'c6'] },
    { type: 'instruction', fen: FEN.after_Bb5, text: "Bb5 is the Ruy Lopez. The bishop eyes the c6 knight, the main defender of e5. This has been played for over 500 years.", arrow: ['f1', 'b5'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Let's see what you're made of. Play all three moves from memory." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },

    { type: 'instruction', fen: FEN.after_Bb5, text: "That's the Ruy Lopez — e4, Nf3, Bb5. One of the most popular openings in chess history." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-2: The Morphy Defense (Ba4, O-O, Re1)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_2: OpeningLesson = {
  id: 'rl-2',
  title: 'The Morphy Defense',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb5, text: "Almost every game continues 3...a6 here — the Morphy Defense. Black asks the bishop to make a decision." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },

    // Black plays a6
    { type: 'instruction', fen: FEN.after_Bb5, text: 'Black plays a6, challenging your bishop.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },

    // PREDICT 1: Ba4
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Ba4', prompt: 'Your bishop is attacked. Where does it go?', hint: 'Retreat along the diagonal — stay active on a4.', correctFeedback: 'Ba4 retreats but stays on the a4-e8 diagonal, keeping pressure on c6.', wrongFeedback: 'Retreat the bishop to a4 to stay on the active diagonal.', postMoveArrow: ['a4', 'c6'] },
    { type: 'instruction', fen: FEN.after_Ba4, text: 'Ba4 keeps the bishop aimed at the knight on c6. Black pushed a pawn but we lost no time.', arrow: ['b5', 'a4'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.after_Ba4, text: "Black develops the knight to f6, attacking your e4 pawn.", autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: "Black is threatening your e4 pawn. What's the best response?", hint: 'Get your king safe — the rook will help defend e4.', correctFeedback: 'Castling gets the king safe and connects the rooks.', wrongFeedback: 'Castle kingside — it solves king safety and pawn defense at once.', postMoveArrow: ['f1', 'e1'] },
    { type: 'instruction', fen: FEN.after_OO_w, text: "O-O is the best move. Even though Nf6 attacks e4, Black can't win it — after Nxe4, we play Re1 and win it back.", arrow: ['e1', 'g1'] },

    // Black plays Be7
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Black develops the bishop to e7, preparing to castle.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },

    // PREDICT 3: Re1
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Re1', prompt: 'Time to activate your rook. Where does it belong?', hint: 'The e-file is semi-open — put your rook there.', correctFeedback: 'Re1 puts the rook on the e-file, backing up the e4 pawn.', wrongFeedback: 'The e-file is where the action is. Put the rook on e1.', postMoveArrow: ['e1', 'e4'] },
    { type: 'instruction', fen: FEN.after_Re1, text: 'Re1 controls the e-file and supports e4. Over 50,000 master games reach this position.', arrow: ['f1', 'e1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bb5, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Ba4', prompt: 'Your move.', hint: 'Ba4.', correctFeedback: 'Ba4.', wrongFeedback: 'Ba4.' },
    { type: 'instruction', fen: FEN.after_Ba4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    { type: 'instruction', fen: FEN.after_Re1, text: "Ba4, O-O, Re1 — the Morphy Defense setup. Your pieces are developed and your king is safe." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-3: Closed Setup (Bb3, c3, h3)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_3: OpeningLesson = {
  id: 'rl-3',
  title: 'The Closed Setup',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Re1, text: "Black pushes b5 and d6 to chase your bishop and shore up the center. You'll tuck the bishop away and prepare d4." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Bb5, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Ba4', prompt: 'Your move.', hint: 'Ba4.', correctFeedback: 'Ba4.', wrongFeedback: 'Ba4.' },
    { type: 'instruction', fen: FEN.after_Ba4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    // Black plays b5
    { type: 'instruction', fen: FEN.after_Re1, text: 'Black pushes b5, chasing your bishop again.', autoAdvance: 800, highlightSquares: ['b7', 'b5'] },

    // PREDICT 1: Bb3
    { type: 'play-move', fen: FEN.after_b5, correctMove: 'Bb3', prompt: 'Your bishop is under attack again. Where does it go?', hint: 'Retreat to b3 — it stays on the a2-g8 diagonal.', correctFeedback: 'Bb3 keeps the bishop on a strong diagonal aimed at f7.', wrongFeedback: 'Retreat the bishop to b3 — it stays active on the a2-g8 diagonal.', postMoveArrow: ['b3', 'f7'] },
    { type: 'instruction', fen: FEN.after_Bb3, text: 'Bb3 puts the bishop on the a2-g8 diagonal, pointing straight at f7 — a key weakness near the king.', arrow: ['a4', 'b3'] },

    // Black plays d6
    { type: 'instruction', fen: FEN.after_Bb3, text: 'Black plays d6, supporting the e5 pawn.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'c3', prompt: "You want to play d4 eventually. What prepares it?", hint: 'Support d4 with a pawn first.', correctFeedback: 'c3 prepares d4, giving your central push extra support.', wrongFeedback: 'Play c3 to prepare the d4 push.', postMoveArrow: ['c3', 'd4'] },
    { type: 'instruction', fen: FEN.after_c3, text: 'c3 prepares d4 and gives the bishop a retreat square on c2 if needed. A patient, solid move.', arrow: ['c2', 'c3'] },

    // Black castles
    { type: 'instruction', fen: FEN.after_c3, text: 'Black castles kingside.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 3: h3
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'h3', prompt: "Both sides have castled. What useful move can you play?", hint: 'Prevent Black from pinning your f3 knight with Bg4.', correctFeedback: "h3 prevents Bg4, which would pin your knight to the queen.", wrongFeedback: "Push h3 to stop Black's bishop from pinning your knight on f3.", postMoveArrow: ['h3', 'g4'] },
    { type: 'instruction', fen: FEN.after_h3, text: "h3 is a luft for the king and stops Bg4. Over 27,000 master games play this exact move here.", arrow: ['h2', 'h3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Re1, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Re1, text: 'b5.', autoAdvance: 800, highlightSquares: ['b7', 'b5'] },
    { type: 'play-move', fen: FEN.after_b5, correctMove: 'Bb3', prompt: 'Your move.', hint: 'Bb3.', correctFeedback: 'Bb3.', wrongFeedback: 'Bb3.' },
    { type: 'instruction', fen: FEN.after_Bb3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    { type: 'instruction', fen: FEN.after_h3, text: "Bb3, c3, h3 — a solid setup. You're ready to push d4 and fight for the center." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-4: The Chigorin (Bc2, d4, Nbd2)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_4: OpeningLesson = {
  id: 'rl-4',
  title: 'The Chigorin',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_h3, text: "Black's knight jumps to a5 to attack your bishop. Time to save it, strike the center, and finish development." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Re1, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Re1, text: 'b5.', autoAdvance: 800, highlightSquares: ['b7', 'b5'] },
    { type: 'play-move', fen: FEN.after_b5, correctMove: 'Bb3', prompt: 'Your move.', hint: 'Bb3.', correctFeedback: 'Bb3.', wrongFeedback: 'Bb3.' },
    { type: 'instruction', fen: FEN.after_Bb3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    // Black plays Na5
    { type: 'instruction', fen: FEN.after_h3, text: "Black plays Na5, attacking your bishop on b3.", autoAdvance: 800, highlightSquares: ['c6', 'a5'] },

    // PREDICT 1: Bc2
    { type: 'play-move', fen: FEN.after_Na5, correctMove: 'Bc2', prompt: "The knight is coming for your bishop. Where do you save it?", hint: "Retreat to c2 — it's safe there and eyes the kingside.", correctFeedback: 'Bc2 saves the bishop and points it toward h7.', wrongFeedback: 'Retreat the bishop to c2, where it aims at the kingside.', postMoveArrow: ['c2', 'h7'] },
    { type: 'instruction', fen: FEN.after_Bc2, text: "Bc2 tucks the bishop safely behind the pawns. From c2, it eyes h7 — a square that becomes important in many attacks.", arrow: ['b3', 'c2'] },

    // Black plays c5
    { type: 'instruction', fen: FEN.after_Bc2, text: "Black plays c5, challenging your center.", autoAdvance: 800, highlightSquares: ['c7', 'c5'] },

    // PREDICT 2: d4
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'd4', prompt: "You've been preparing this move for three turns. Play it!", hint: "Push d4 — that's what c3 was for.", correctFeedback: 'd4 strikes the center. This is the whole point of the Ruy Lopez setup.', wrongFeedback: 'Push d4 — you prepared this with c3.', postMoveArrow: ['d4', 'e5'] },
    { type: 'instruction', fen: FEN.after_d4, text: "d4 opens the center. Your pieces are perfectly placed — bishop on c2, knight on f3, rook on e1. Everything supports this push.", arrow: ['d2', 'd4'] },

    // Black plays Qc7
    { type: 'instruction', fen: FEN.after_d4, text: "Black plays Qc7, connecting the rooks.", autoAdvance: 800, highlightSquares: ['d8', 'c7'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.after_Qc7, correctMove: 'Nbd2', prompt: "You have one piece left to develop. Where does the knight go?", hint: 'The b1 knight develops to d2, supporting e4.', correctFeedback: "Nbd2 develops the last piece and supports e4.", wrongFeedback: 'Develop the knight to d2 — it supports e4 and can reroute to g3.', postMoveArrow: ['d2', 'e4'] },
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Nbd2 completes development. From d2, the knight can go to f1 and then g3, joining a kingside attack.", arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_h3, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_h3, text: 'Na5.', autoAdvance: 800, highlightSquares: ['c6', 'a5'] },
    { type: 'play-move', fen: FEN.after_Na5, correctMove: 'Bc2', prompt: 'Your move.', hint: 'Bc2.', correctFeedback: 'Bc2.', wrongFeedback: 'Bc2.' },
    { type: 'instruction', fen: FEN.after_Bc2, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['d8', 'c7'] },
    { type: 'play-move', fen: FEN.after_Qc7, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    { type: 'instruction', fen: FEN.after_Nbd2, text: "Bc2, d4, Nbd2 — you've completed 12 moves of the Ruy Lopez main line!" },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-dev-f5: After 3...f5 — Schliemann (Nc3, Nxe4, Nxf6+)
// ═══════════════════════════════════════════════════════════

const RL_DEV_F5: OpeningLesson = {
  id: 'rl-dev-f5',
  title: 'If 3...f5',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Bb5, text: "Sometimes Black plays 3...f5 instead of 3...a6. It's aggressive but weakens the kingside. Here's how to handle it." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },

    // DEVIATION: 3...f5
    { type: 'instruction', fen: FEN.after_Bb5, text: "Black plays f5 — the Schliemann Defense. Aggressive, but it weakens the king.", autoAdvance: 800, highlightSquares: ['f7', 'f5'] },

    // PREDICT 1: Nc3
    { type: 'play-move', fen: FEN.dev_f5, correctMove: 'Nc3', prompt: "Black pushed f5. What's your best developing move?", hint: 'Develop the knight to c3, where it eyes e4 and d5.', correctFeedback: 'Nc3 develops and prepares to recapture on e4.', wrongFeedback: 'Develop the knight to c3 — it eyes the e4 square.', postMoveArrow: ['c3', 'e4'] },
    { type: 'instruction', fen: FEN.dev_f5_Nc3, text: 'Nc3 develops naturally. If Black takes on e4, your knight recaptures with a strong central position.', arrow: ['b1', 'c3'] },

    // Black plays fxe4
    { type: 'instruction', fen: FEN.dev_f5_Nc3, text: 'Black takes: fxe4.', autoAdvance: 800, highlightSquares: ['f5', 'e4'] },

    // PREDICT 2: Nxe4
    { type: 'play-move', fen: FEN.dev_f5_fxe4, correctMove: 'Nxe4', prompt: 'Recapture the pawn.', hint: 'Take with the knight — it lands on a great central square.', correctFeedback: 'Nxe4 puts your knight on a powerful central square.', wrongFeedback: 'Recapture with the knight on e4.', postMoveArrow: [['e4', 'd6'], ['e4', 'f6']] },
    { type: 'instruction', fen: FEN.dev_f5_Nxe4, text: 'Nxe4 gives you a dominant knight in the center. Black weakened the kingside for nothing.', arrow: ['c3', 'e4'] },

    // Black plays Nf6
    { type: 'instruction', fen: FEN.dev_f5_Nxe4, text: 'Black develops Nf6, challenging your knight.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 3: Nxf6+
    { type: 'play-move', fen: FEN.dev_f5_Nf6, correctMove: 'Nxf6+', prompt: "Black's knight challenges yours. What do you play?", hint: 'Trade knights — you get a check out of it.', correctFeedback: "Nxf6+ trades knights with check, keeping the initiative.", wrongFeedback: 'Take on f6 with check — you keep the tempo.', postMoveArrow: ['f6', 'e8'] },
    { type: 'instruction', fen: FEN.dev_f5_Nxf6, text: "Nxf6+ forces Black to recapture and you've kept all the momentum. Black's f5 plan backfired.", arrow: ['e4', 'f6'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_f5, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev_f5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_f5_Nc3, text: 'fxe4.', autoAdvance: 800, highlightSquares: ['f5', 'e4'] },
    { type: 'play-move', fen: FEN.dev_f5_fxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.dev_f5_Nxe4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_f5_Nf6, correctMove: 'Nxf6+', prompt: 'Your move.', hint: 'Nxf6+.', correctFeedback: 'Nxf6+.', wrongFeedback: 'Nxf6+.' },

    { type: 'instruction', fen: FEN.dev_f5_Nxf6, text: "Against 3...f5: Nc3, Nxe4, Nxf6+. Develop, recapture, and trade with tempo." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-dev-d6: After 4...d6 — Steinitz Deferred (O-O, c3, d4)
// ═══════════════════════════════════════════════════════════

const RL_DEV_D6: OpeningLesson = {
  id: 'rl-dev-d6',
  title: 'If 4...d6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Ba4, text: "Sometimes after 4.Ba4, Black plays d6 instead of Nf6. It's solid but slow. You keep developing normally." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Ba4', prompt: 'Your move.', hint: 'Ba4.', correctFeedback: 'Ba4.', wrongFeedback: 'Ba4.' },

    // DEVIATION: 4...d6
    { type: 'instruction', fen: FEN.after_Ba4, text: "Black plays d6 instead of Nf6 — the Steinitz Defense. Solid but passive.", autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.dev_d6, correctMove: 'O-O', prompt: "Black played d6. What's your best move?", hint: "When in doubt, castle.", correctFeedback: "O-O gets the king safe. Black is behind in development.", wrongFeedback: "Just castle. You're ahead in development.", postMoveArrow: ['f1', 'e1'] },
    { type: 'instruction', fen: FEN.dev_d6_OO, text: "Castle first, ask questions later. Black still needs to develop the kingside.", arrow: ['e1', 'g1'] },

    // Black plays Bd7
    { type: 'instruction', fen: FEN.dev_d6_OO, text: 'Black develops the bishop to d7.', autoAdvance: 800, highlightSquares: ['c8', 'd7'] },

    // PREDICT 2: c3
    { type: 'play-move', fen: FEN.dev_d6_Bd7, correctMove: 'c3', prompt: "You're ahead in development. What do you prepare?", hint: 'Same idea as the main line — prepare d4.', correctFeedback: 'c3 prepares d4 just like in the main line.', wrongFeedback: 'Play c3 to prepare d4 — same plan as always.', postMoveArrow: ['c3', 'd4'] },
    { type: 'instruction', fen: FEN.dev_d6_c3, text: "c3 prepares the d4 push. The plan doesn't change just because Black played d6 — you still want the center.", arrow: ['c2', 'c3'] },

    // Black plays g6
    { type: 'instruction', fen: FEN.dev_d6_c3, text: 'Black plays g6, preparing to fianchetto the bishop.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },

    // PREDICT 3: d4
    { type: 'play-move', fen: FEN.dev_d6_g6, correctMove: 'd4', prompt: "You prepared it — now play it.", hint: 'Strike the center with d4.', correctFeedback: "d4 opens the center while Black is still setting up.", wrongFeedback: 'Push d4 — Black is too slow to stop it.', postMoveArrow: ['d4', 'e5'] },
    { type: 'instruction', fen: FEN.dev_d6_d4, text: "d4 strikes while Black is still fianchettoing. You have a space advantage and better development.", arrow: ['d2', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_d6, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.dev_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.dev_d6_OO, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.dev_d6_Bd7, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.dev_d6_c3, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.dev_d6_g6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    { type: 'instruction', fen: FEN.dev_d6_d4, text: "Against 4...d6: O-O, c3, d4. Castle, prepare, strike. Same plan — Black just gave you extra time." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-dev-b5: After 5...b5 — Early b5 (Bb3, a4, c3)
// ═══════════════════════════════════════════════════════════

const RL_DEV_B5: OpeningLesson = {
  id: 'rl-dev-b5',
  title: 'If 5...b5',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_OO_w, text: "After castling, Black sometimes plays b5 immediately instead of Be7. They want to chase your bishop and develop aggressively." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Bb5, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Ba4', prompt: 'Your move.', hint: 'Ba4.', correctFeedback: 'Ba4.', wrongFeedback: 'Ba4.' },
    { type: 'instruction', fen: FEN.after_Ba4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    // DEVIATION: 5...b5
    { type: 'instruction', fen: FEN.after_OO_w, text: "Black plays b5, chasing your bishop before developing the kingside.", autoAdvance: 800, highlightSquares: ['b7', 'b5'] },

    // PREDICT 1: Bb3
    { type: 'play-move', fen: FEN.dev_b5, correctMove: 'Bb3', prompt: "Black pushes b5. Where does your bishop go?", hint: 'Retreat to b3 — same idea as the main line.', correctFeedback: 'Bb3 retreats to a safe diagonal, aiming at f7.', wrongFeedback: 'Retreat the bishop to b3.', postMoveArrow: ['b3', 'f7'] },
    { type: 'instruction', fen: FEN.dev_b5_Bb3, text: "Same retreat as the main line. The bishop on b3 aims at f7 and is safe from pawn attacks.", arrow: ['a4', 'b3'] },

    // Black plays Bc5
    { type: 'instruction', fen: FEN.dev_b5_Bb3, text: 'Black develops the bishop actively to c5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },

    // PREDICT 2: a4
    { type: 'play-move', fen: FEN.dev_b5_Bc5, correctMove: 'a4', prompt: "Black's queenside is extended. How do you attack it?", hint: "Strike at the b5 pawn — it's overextended.", correctFeedback: 'a4 attacks the b5 pawn and fights for queenside space.', wrongFeedback: 'Push a4 to undermine the b5 pawn.', postMoveArrow: ['a4', 'b5'] },
    { type: 'instruction', fen: FEN.dev_b5_a4, text: "a4 puts pressure on Black's extended queenside pawns. The b5 pawn is a target.", arrow: ['a2', 'a4'] },

    // Black plays Rb8
    { type: 'instruction', fen: FEN.dev_b5_a4, text: 'Black protects with Rb8.', autoAdvance: 800, highlightSquares: ['a8', 'b8'] },

    // PREDICT 3: c3
    { type: 'play-move', fen: FEN.dev_b5_Rb8, correctMove: 'c3', prompt: "Same plan as always. What do you prepare?", hint: 'Support d4 with c3.', correctFeedback: 'c3 prepares d4 — the plan stays the same no matter what Black does.', wrongFeedback: 'Play c3 to prepare d4.', postMoveArrow: ['c3', 'd4'] },
    { type: 'instruction', fen: FEN.dev_b5_c3, text: "c3 prepares d4. Black pushed queenside pawns but you've got the center under control.", arrow: ['c2', 'c3'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_b5, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev_b5, correctMove: 'Bb3', prompt: 'Your move.', hint: 'Bb3.', correctFeedback: 'Bb3.', wrongFeedback: 'Bb3.' },
    { type: 'instruction', fen: FEN.dev_b5_Bb3, text: 'Bc5.', autoAdvance: 800, highlightSquares: ['f8', 'c5'] },
    { type: 'play-move', fen: FEN.dev_b5_Bc5, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.dev_b5_a4, text: 'Rb8.', autoAdvance: 800, highlightSquares: ['a8', 'b8'] },
    { type: 'play-move', fen: FEN.dev_b5_Rb8, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },

    { type: 'instruction', fen: FEN.dev_b5_c3, text: "Bb3, a4, c3 — retreat the bishop, attack the overextended pawns, prepare d4." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-dev-Re8: After 9...Re8 (d4, Nbd2, a4)
// ═══════════════════════════════════════════════════════════

const RL_DEV_RE8: OpeningLesson = {
  id: 'rl-dev-Re8',
  title: 'If 9...Re8',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_h3, text: "Instead of Na5, Black sometimes plays Re8 — keeping the knight on c6. Without the bishop under attack, you can strike the center immediately." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Re1, text: "Let's see what you're made of." },
    { type: 'instruction', fen: FEN.after_Re1, text: 'b5.', autoAdvance: 800, highlightSquares: ['b7', 'b5'] },
    { type: 'play-move', fen: FEN.after_b5, correctMove: 'Bb3', prompt: 'Your move.', hint: 'Bb3.', correctFeedback: 'Bb3.', wrongFeedback: 'Bb3.' },
    { type: 'instruction', fen: FEN.after_Bb3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    // DEVIATION: 9...Re8
    { type: 'instruction', fen: FEN.after_h3, text: "Black plays Re8 instead of Na5, keeping the knight on c6.", autoAdvance: 800, highlightSquares: ['f8', 'e8'] },

    // PREDICT 1: d4
    { type: 'play-move', fen: FEN.dev_Re8, correctMove: 'd4', prompt: "Black isn't attacking your bishop. What can you play now?", hint: "You've been preparing d4 — nothing's stopping you.", correctFeedback: 'd4 strikes the center immediately.', wrongFeedback: "Push d4 — Black gave you a free move.", postMoveArrow: ['d4', 'e5'] },
    { type: 'instruction', fen: FEN.dev_Re8_d4, text: "d4 is even stronger here because Black spent a move on Re8 instead of attacking your bishop.", arrow: ['d2', 'd4'] },

    // Black plays Bb7
    { type: 'instruction', fen: FEN.dev_Re8_d4, text: 'Black develops the bishop to b7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },

    // PREDICT 2: Nbd2
    { type: 'play-move', fen: FEN.dev_Re8_Bb7, correctMove: 'Nbd2', prompt: "Keep developing. Where does the knight go?", hint: 'The b1 knight goes to d2, supporting e4.', correctFeedback: 'Nbd2 develops and supports the e4 pawn.', wrongFeedback: 'Develop the knight to d2.', postMoveArrow: ['d2', 'e4'] },
    { type: 'instruction', fen: FEN.dev_Re8_Nbd2, text: "Nbd2 supports e4 and the knight can reroute to f1-g3 for a kingside attack.", arrow: ['b1', 'd2'] },

    // Black plays Bf8
    { type: 'instruction', fen: FEN.dev_Re8_Nbd2, text: 'Black retreats the bishop to f8, a common maneuver.', autoAdvance: 800, highlightSquares: ['e7', 'f8'] },

    // PREDICT 3: a4
    { type: 'play-move', fen: FEN.dev_Re8_Bf8, correctMove: 'a4', prompt: "Black's b5 pawn is a target. How do you attack it?", hint: 'Push a4 to undermine the queenside.', correctFeedback: 'a4 attacks the b5 pawn and opens lines on the queenside.', wrongFeedback: 'Push a4 to put pressure on b5.', postMoveArrow: ['a4', 'b5'] },
    { type: 'instruction', fen: FEN.dev_Re8_a4, text: "a4 challenges the b5 pawn. If Black takes, you open the a-file for your rook.", arrow: ['a2', 'a4'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_Re8, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev_Re8, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Re8_d4, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.dev_Re8_Bb7, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.dev_Re8_Nbd2, text: 'Bf8.', autoAdvance: 800, highlightSquares: ['e7', 'f8'] },
    { type: 'play-move', fen: FEN.dev_Re8_Bf8, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },

    { type: 'instruction', fen: FEN.dev_Re8_a4, text: "d4, Nbd2, a4 — strike the center, develop, then attack the queenside." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-test-1: Level Test (main line + deviations)
// ═══════════════════════════════════════════════════════════

const RL_TEST_1: OpeningLesson = {
  id: 'rl-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE (12 White moves) ===
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'Bb5', prompt: 'Your move.', hint: 'Bb5.', correctFeedback: 'Bb5.', wrongFeedback: 'Bb5.' },
    { type: 'instruction', fen: FEN.after_Bb5, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.after_a6, correctMove: 'Ba4', prompt: 'Your move.', hint: 'Ba4.', correctFeedback: 'Ba4.', wrongFeedback: 'Ba4.' },
    { type: 'instruction', fen: FEN.after_Ba4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_Be7, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re1, text: 'b5.', autoAdvance: 800, highlightSquares: ['b7', 'b5'] },
    { type: 'play-move', fen: FEN.after_b5, correctMove: 'Bb3', prompt: 'Your move.', hint: 'Bb3.', correctFeedback: 'Bb3.', wrongFeedback: 'Bb3.' },
    { type: 'instruction', fen: FEN.after_Bb3, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO_b, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'Na5.', autoAdvance: 800, highlightSquares: ['c6', 'a5'] },
    { type: 'play-move', fen: FEN.after_Na5, correctMove: 'Bc2', prompt: 'Your move.', hint: 'Bc2.', correctFeedback: 'Bc2.', wrongFeedback: 'Bc2.' },
    { type: 'instruction', fen: FEN.after_Bc2, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Qc7.', autoAdvance: 800, highlightSquares: ['d8', 'c7'] },
    { type: 'play-move', fen: FEN.after_Qc7, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // === DEVIATION TEST: 3...f5 ===
    { type: 'instruction', fen: FEN.after_Bb5, text: 'But wait — Black plays f5 instead.', autoAdvance: 800, highlightSquares: ['f7', 'f5'] },
    { type: 'play-move', fen: FEN.dev_f5, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.dev_f5_Nc3, text: 'fxe4.', autoAdvance: 800, highlightSquares: ['f5', 'e4'] },
    { type: 'play-move', fen: FEN.dev_f5_fxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.dev_f5_Nxe4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dev_f5_Nf6, correctMove: 'Nxf6+', prompt: 'Your move.', hint: 'Nxf6+.', correctFeedback: 'Nxf6+.', wrongFeedback: 'Nxf6+.' },

    // === DEVIATION TEST: 9...Re8 ===
    { type: 'instruction', fen: FEN.after_h3, text: 'Now Black plays Re8 instead of Na5.', autoAdvance: 800, highlightSquares: ['f8', 'e8'] },
    { type: 'play-move', fen: FEN.dev_Re8, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.dev_Re8_d4, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.dev_Re8_Bb7, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.dev_Re8_Nbd2, text: 'Bf8.', autoAdvance: 800, highlightSquares: ['e7', 'f8'] },
    { type: 'play-move', fen: FEN.dev_Re8_Bf8, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-5: The Recapture (cxd4, Nb3, Be3)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_5: OpeningLesson = {
  id: 'rl-5',
  title: 'The Recapture',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Black captures on d4. You'll recapture, reroute a knight, and develop the bishop to a strong square." },

    // Black plays cxd4
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Black captures cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },

    // PREDICT 1: cxd4
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'cxd4', prompt: "Black just traded pawns. How do you recapture?", hint: 'Take back with the c3 pawn to keep a strong center.', correctFeedback: 'cxd4 recaptures and maintains your central pawn duo on d4 and e4.', wrongFeedback: 'Recapture with the c-pawn — cxd4 keeps a solid center.', postMoveArrow: ['d4', 'e5'] },
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'cxd4 keeps two pawns in the center. The d4-e4 duo controls a lot of key squares.', arrow: ['c3', 'd4'] },

    // Black plays Nc6
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'Black returns the knight to c6, putting pressure on d4.', autoAdvance: 800, highlightSquares: ['a5', 'c6'] },

    // PREDICT 2: Nb3
    { type: 'play-move', fen: FEN.after_Nc6_l2, correctMove: 'Nb3', prompt: "The knight on d2 isn't doing much. Where can it go?", hint: 'Jump the knight to b3, eyeing a5 and d4.', correctFeedback: 'Nb3 reroutes the knight to a much better square, controlling a5 and c5.', wrongFeedback: 'Move the knight to b3 where it watches a5 and supports d4.', postMoveArrow: ['b3', 'a5'] },
    { type: 'instruction', fen: FEN.after_Nb3, text: 'Nb3 is a great reroute. The knight blocks the a-pawn from advancing and eyes the c5 square.', arrow: ['d2', 'b3'] },

    // Black plays a5
    { type: 'instruction', fen: FEN.after_Nb3, text: 'Black pushes a5, gaining space on the queenside.', autoAdvance: 800, highlightSquares: ['a6', 'a5'] },

    // PREDICT 3: Be3
    { type: 'play-move', fen: FEN.after_a5_l2, correctMove: 'Be3', prompt: "Your dark-squared bishop hasn't moved yet. Where does it belong?", hint: 'Develop the bishop to e3, supporting d4.', correctFeedback: 'Be3 develops the last minor piece and shores up the d4 pawn.', wrongFeedback: 'The bishop belongs on e3, protecting d4 and eyeing the a7-g1 diagonal.', postMoveArrow: ['e3', 'd4'] },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Be3 is the natural square — it defends d4 and controls the a7-g1 diagonal. All your pieces are working together now.', arrow: ['c1', 'e3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['a5', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6_l2, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: 'a5.', autoAdvance: 800, highlightSquares: ['a6', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5_l2, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },

    { type: 'instruction', fen: FEN.after_Be3, text: "cxd4, Nb3, Be3 — you've recaptured, rerouted, and developed. The position is solid." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-6: Regrouping (Nbd2, Rc1, Qe2)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_6: OpeningLesson = {
  id: 'rl-6',
  title: 'Regrouping',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Be3, text: "Black pushes a4, chasing your knight again. Time to regroup — bring the knight back, activate a rook, and centralize the queen." },

    // RECAP (L2 moves so far: cxd4, Nb3, Be3)
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['a5', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6_l2, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: 'a5.', autoAdvance: 800, highlightSquares: ['a6', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5_l2, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },

    // Black plays a4
    { type: 'instruction', fen: FEN.after_Be3, text: 'Black pushes a4, attacking your knight on b3.', autoAdvance: 800, highlightSquares: ['a5', 'a4'] },

    // PREDICT 1: Nbd2
    { type: 'play-move', fen: FEN.after_a4_l2, correctMove: 'Nbd2', prompt: "Your knight is under attack. Where does it retreat?", hint: 'Bring the knight back to d2 — it can reroute to f1 later.', correctFeedback: 'Nbd2 retreats the knight to safety. From d2 it can head to f1 and g3.', wrongFeedback: 'Retreat the knight to d2. It can reroute through f1 toward the kingside.', postMoveArrow: ['d2', 'f1'] },
    { type: 'instruction', fen: FEN.after_Nbd2_l2, text: "Nbd2 gets the knight out of danger. The knight has a plan — d2, f1, g3 — heading to the kingside.", arrow: ['b3', 'd2'] },

    // Black plays Bd7
    { type: 'instruction', fen: FEN.after_Nbd2_l2, text: 'Black develops the bishop to d7.', autoAdvance: 800, highlightSquares: ['c8', 'd7'] },

    // PREDICT 2: Rc1
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Rc1', prompt: "Your rook on a1 needs an open file. Where does it go?", hint: 'The c-file is open — put the rook there.', correctFeedback: 'Rc1 puts the rook on the open c-file, adding pressure.', wrongFeedback: 'Swing the rook to c1 — the c-file is wide open after the pawn trade.', postMoveArrow: ['c1', 'c6'] },
    { type: 'instruction', fen: FEN.after_Rc1, text: 'Rc1 seizes the open c-file. The rook eyes the c6 knight and can pressure the whole queenside.', arrow: ['a1', 'c1'] },

    // Black plays Qb7
    { type: 'instruction', fen: FEN.after_Rc1, text: 'Black moves the queen to b7, connecting the rooks.', autoAdvance: 800, highlightSquares: ['c7', 'b7'] },

    // PREDICT 3: Qe2
    { type: 'play-move', fen: FEN.after_Qb7, correctMove: 'Qe2', prompt: "Your queen is still on d1. Where should it go?", hint: 'Centralize the queen on e2, supporting e4 and the bishop.', correctFeedback: 'Qe2 centralizes the queen and supports the e4 pawn.', wrongFeedback: 'Bring the queen to e2 — it supports e4 and connects the rooks.', postMoveArrow: ['e2', 'e4'] },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Qe2 is a multipurpose move — it supports e4, eyes the kingside, and unblocks the rooks.', arrow: ['d1', 'e2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Be3, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Be3, text: 'a4.', autoAdvance: 800, highlightSquares: ['a5', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4_l2, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.after_Nbd2_l2, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Rc1', prompt: 'Your move.', hint: 'Rc1.', correctFeedback: 'Rc1.', wrongFeedback: 'Rc1.' },
    { type: 'instruction', fen: FEN.after_Rc1, text: 'Qb7.', autoAdvance: 800, highlightSquares: ['c7', 'b7'] },
    { type: 'play-move', fen: FEN.after_Qb7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },

    { type: 'instruction', fen: FEN.after_Qe2, text: "Nbd2, Rc1, Qe2 — all your pieces are on perfect squares. You're ready for action." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-dev-Bb7: After 13...Bb7 (d5, Bd3, Nf1)
// ═══════════════════════════════════════════════════════════

const RL_DEV_BB7: OpeningLesson = {
  id: 'rl-dev-Bb7',
  title: 'If 13...Bb7',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_cxd4_w, text: "Sometimes Black plays Bb7 instead of Nc6 after the pawn trade. Here's how to respond — lock the center and reposition." },

    // RECAP to deviation point (L2 moves: cxd4)
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },

    // DEVIATION: 13...Bb7
    { type: 'instruction', fen: FEN.after_cxd4_w, text: "Black plays Bb7 instead of Nc6 — developing the bishop to the long diagonal.", autoAdvance: 800, highlightSquares: ['c8', 'b7'] },

    // PREDICT 1: d5
    { type: 'play-move', fen: FEN.dev_Bb7, correctMove: 'd5', prompt: "Black's bishop points at e4. How do you shut it down?", hint: 'Push d5 to close the center and block the diagonal.', correctFeedback: 'd5 locks the center and shuts down the b7 bishop completely.', wrongFeedback: 'Push d5 — it closes the position and buries the bishop on b7.', postMoveArrow: ['d5', 'c6'] },
    { type: 'instruction', fen: FEN.dev_Bb7_d5, text: "d5 is the key move. The center is locked, and Black's bishop on b7 is staring at your d5 pawn — it's going nowhere.", arrow: ['d4', 'd5'] },

    // Black plays Rac8
    { type: 'instruction', fen: FEN.dev_Bb7_d5, text: 'Black puts a rook on c8, aiming at the c-file.', autoAdvance: 800, highlightSquares: ['a8', 'c8'] },

    // PREDICT 2: Bd3
    { type: 'play-move', fen: FEN.dev_Bb7_Rac8, correctMove: 'Bd3', prompt: "Your bishop on c2 can find a better diagonal. Where?", hint: 'Move the bishop to d3, eyeing the kingside.', correctFeedback: 'Bd3 repositions the bishop toward the kingside, aiming at h7.', wrongFeedback: 'Put the bishop on d3 — it aims at h7 and supports e4.', postMoveArrow: ['d3', 'h7'] },
    { type: 'instruction', fen: FEN.dev_Bb7_Bd3, text: 'Bd3 points the bishop at h7, setting up potential kingside ideas. The bishop is much more active here than c2.', arrow: ['c2', 'd3'] },

    // Black plays Nd7
    { type: 'instruction', fen: FEN.dev_Bb7_Bd3, text: 'Black retreats the knight to d7, looking to reroute it.', autoAdvance: 800, highlightSquares: ['f6', 'd7'] },

    // PREDICT 3: Nf1
    { type: 'play-move', fen: FEN.dev_Bb7_Nd7, correctMove: 'Nf1', prompt: "Your knight on d2 can start the classic maneuver. Where first?", hint: 'The knight heads to f1, then g3 — the classic Ruy Lopez reroute.', correctFeedback: 'Nf1 starts the knight journey toward g3, heading for the kingside.', wrongFeedback: 'Move the knight to f1 — from there it goes to g3, a powerful outpost.', postMoveArrow: ['f1', 'g3'] },
    { type: 'instruction', fen: FEN.dev_Bb7_Nf1, text: 'Nf1 is the famous Ruy Lopez knight maneuver. Next stop: g3, where it controls e4 and eyes f5 and h5.', arrow: ['d2', 'f1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_cxd4_w, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.dev_Bb7, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.dev_Bb7_d5, text: 'Rac8.', autoAdvance: 800, highlightSquares: ['a8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_Bb7_Rac8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.dev_Bb7_Bd3, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['f6', 'd7'] },
    { type: 'play-move', fen: FEN.dev_Bb7_Nd7, correctMove: 'Nf1', prompt: 'Your move.', hint: 'Nf1.', correctFeedback: 'Nf1.', wrongFeedback: 'Nf1.' },

    { type: 'instruction', fen: FEN.dev_Bb7_Nf1, text: "d5, Bd3, Nf1 — you locked the center and started the kingside buildup." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-7: The Buildup (Bd3, dxe5, Nxe5)
// ═══════════════════════════════════════════════════════════

const RL_LESSON_7: OpeningLesson = {
  id: 'rl-7',
  title: 'The Buildup',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Qe2, text: "Both sides reposition their rooks. You'll centralize the bishop, break the tension with dxe5, and win a trade in the center." },

    // RECAP (L2 moves: cxd4, Nb3, Be3, Nbd2, Rc1, Qe2)
    { type: 'instruction', fen: FEN.after_Nbd2, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['a5', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6_l2, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: 'a5.', autoAdvance: 800, highlightSquares: ['a6', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5_l2, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'a4.', autoAdvance: 800, highlightSquares: ['a5', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4_l2, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.after_Nbd2_l2, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Rc1', prompt: 'Your move.', hint: 'Rc1.', correctFeedback: 'Rc1.', wrongFeedback: 'Rc1.' },
    { type: 'instruction', fen: FEN.after_Rc1, text: 'Qb7.', autoAdvance: 800, highlightSquares: ['c7', 'b7'] },
    { type: 'play-move', fen: FEN.after_Qb7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },

    // Black plays Rfe8
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Black puts the rook on e8, reinforcing e5.', autoAdvance: 800, highlightSquares: ['f8', 'e8'] },

    // PREDICT 1: Bd3
    { type: 'play-move', fen: FEN.after_Rfe8, correctMove: 'Bd3', prompt: "Your bishop on c2 can be more active. Where does it go?", hint: 'Move the bishop to d3 — it aims at the kingside.', correctFeedback: 'Bd3 centralizes the bishop and aims it at h7.', wrongFeedback: 'The bishop belongs on d3, where it eyes h7 and supports e4.', postMoveArrow: ['d3', 'h7'] },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Bd3 is the perfect moment to reposition. The bishop aims at h7 and supports the e4 pawn.', arrow: ['c2', 'd3'] },

    // Black plays Rab8
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Black puts the last rook on b8, doubling on the b-file.', autoAdvance: 800, highlightSquares: ['a8', 'b8'] },

    // PREDICT 2: dxe5
    { type: 'play-move', fen: FEN.after_Rab8, correctMove: 'dxe5', prompt: "The tension in the center has been building. Time to resolve it. What do you play?", hint: 'Capture on e5 — break the tension in your favor.', correctFeedback: 'dxe5 opens lines for your pieces while keeping a strong e4 pawn.', wrongFeedback: 'Capture dxe5 — the position opens up in your favor.', postMoveArrow: ['e5', 'd6'] },
    { type: 'instruction', fen: FEN.after_dxe5_l2, text: 'dxe5 breaks the center open. Black has to recapture, and your pieces are better placed for the open position.', arrow: ['d4', 'e5'] },

    // Black plays Nxe5
    { type: 'instruction', fen: FEN.after_dxe5_l2, text: 'Black recaptures with the knight — Nxe5.', autoAdvance: 800, highlightSquares: ['c6', 'e5'] },

    // PREDICT 3: Nxe5
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Nxe5', prompt: "Black's knight just landed on e5. What's the best response?", hint: 'Trade knights — take on e5 with your f3 knight.', correctFeedback: 'Nxe5 trades knights and opens the f-file for your rook.', wrongFeedback: 'Capture the knight on e5. After dxe5, your bishop on d3 is very strong.', postMoveArrow: ['e5', 'd3'] },
    { type: 'instruction', fen: FEN.after_Nxe5_w, text: 'Nxe5 simplifies the position. After Black takes back with dxe5, your bishop on d3 dominates the board.', arrow: ['f3', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qe2, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Rfe8.', autoAdvance: 800, highlightSquares: ['f8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Rfe8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Rab8.', autoAdvance: 800, highlightSquares: ['a8', 'b8'] },
    { type: 'play-move', fen: FEN.after_Rab8, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5_l2, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['c6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Nxe5', prompt: 'Your move.', hint: 'Nxe5.', correctFeedback: 'Nxe5.', wrongFeedback: 'Nxe5.' },

    { type: 'instruction', fen: FEN.after_Nxe5_w, text: "Bd3, dxe5, Nxe5 — you've opened the center and your pieces are perfectly placed. Well done." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rl-test-2: Level 2 Test (main line + Bb7 deviation)
// ═══════════════════════════════════════════════════════════

const RL_TEST_2: OpeningLesson = {
  id: 'rl-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'white',
  steps: [
    // === L2 MAIN LINE (9 White moves) ===
    // Starting from after_Nbd2 (end of L1)
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.after_cxd4, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['a5', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6_l2, correctMove: 'Nb3', prompt: 'Your move.', hint: 'Nb3.', correctFeedback: 'Nb3.', wrongFeedback: 'Nb3.' },
    { type: 'instruction', fen: FEN.after_Nb3, text: 'a5.', autoAdvance: 800, highlightSquares: ['a6', 'a5'] },
    { type: 'play-move', fen: FEN.after_a5_l2, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'a4.', autoAdvance: 800, highlightSquares: ['a5', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4_l2, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.after_Nbd2_l2, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['c8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Rc1', prompt: 'Your move.', hint: 'Rc1.', correctFeedback: 'Rc1.', wrongFeedback: 'Rc1.' },
    { type: 'instruction', fen: FEN.after_Rc1, text: 'Qb7.', autoAdvance: 800, highlightSquares: ['c7', 'b7'] },
    { type: 'play-move', fen: FEN.after_Qb7, correctMove: 'Qe2', prompt: 'Your move.', hint: 'Qe2.', correctFeedback: 'Qe2.', wrongFeedback: 'Qe2.' },
    { type: 'instruction', fen: FEN.after_Qe2, text: 'Rfe8.', autoAdvance: 800, highlightSquares: ['f8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Rfe8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Rab8.', autoAdvance: 800, highlightSquares: ['a8', 'b8'] },
    { type: 'play-move', fen: FEN.after_Rab8, correctMove: 'dxe5', prompt: 'Your move.', hint: 'dxe5.', correctFeedback: 'dxe5.', wrongFeedback: 'dxe5.' },
    { type: 'instruction', fen: FEN.after_dxe5_l2, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['c6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Nxe5', prompt: 'Your move.', hint: 'Nxe5.', correctFeedback: 'Nxe5.', wrongFeedback: 'Nxe5.' },

    // === DEVIATION TEST: 13...Bb7 ===
    { type: 'instruction', fen: FEN.after_cxd4_w, text: 'But wait — Black plays Bb7 instead.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.dev_Bb7, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.dev_Bb7_d5, text: 'Rac8.', autoAdvance: 800, highlightSquares: ['a8', 'c8'] },
    { type: 'play-move', fen: FEN.dev_Bb7_Rac8, correctMove: 'Bd3', prompt: 'Your move.', hint: 'Bd3.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3.' },
    { type: 'instruction', fen: FEN.dev_Bb7_Bd3, text: 'Nd7.', autoAdvance: 800, highlightSquares: ['f6', 'd7'] },
    { type: 'play-move', fen: FEN.dev_Bb7_Nd7, correctMove: 'Nf1', prompt: 'Your move.', hint: 'Nf1.', correctFeedback: 'Nf1.', wrongFeedback: 'Nf1.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const RUY_LOPEZ_LESSONS: Record<string, OpeningLesson> = {
  'rl-1': RL_LESSON_1,
  'rl-2': RL_LESSON_2,
  'rl-3': RL_LESSON_3,
  'rl-4': RL_LESSON_4,
  'rl-dev-f5': RL_DEV_F5,
  'rl-dev-d6': RL_DEV_D6,
  'rl-dev-b5': RL_DEV_B5,
  'rl-dev-Re8': RL_DEV_RE8,
  'rl-test-1': RL_TEST_1,
  'rl-5': RL_LESSON_5,
  'rl-6': RL_LESSON_6,
  'rl-dev-Bb7': RL_DEV_BB7,
  'rl-7': RL_LESSON_7,
  'rl-test-2': RL_TEST_2,
}

export function getRuyLopezLesson(id: string): OpeningLesson | undefined {
  return RUY_LOPEZ_LESSONS[id]
}
