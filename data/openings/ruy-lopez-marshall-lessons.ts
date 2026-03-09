import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// RUY LOPEZ: MARSHALL ATTACK — Level 2 (Predict/Reveal)
//
// After 7...O-O: 8.c3 d5 9.exd5 Nxd5 10.Nxe5 Nxe5
// 11.Rxe5 c6 12.d4 Bd6 13.Re1 Qh4 14.g3 Qh3
// 15.Be3 Bg4 16.Qd3 Rae8 17.Nd2 Re6 18.a4 Qh5 19.axb5
//
// All FENs computed by chess.js. Never hand-written.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 7...O-O)
  identity:     'r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w - - 2 8',

  // Main line
  after_c3:     'r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b - - 0 8',
  after_d5:     'r1bq1rk1/2p1bppp/p1n2n2/1p1pp3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 0 9',
  after_exd5:   'r1bq1rk1/2p1bppp/p1n2n2/1p1Pp3/8/1BP2N2/PP1P1PPP/RNBQR1K1 b - - 0 9',
  after_Nxd5:   'r1bq1rk1/2p1bppp/p1n5/1p1np3/8/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 0 10',
  after_Nxe5:   'r1bq1rk1/2p1bppp/p1n5/1p1nN3/8/1BP5/PP1P1PPP/RNBQR1K1 b - - 0 10',
  after_Nxe5_b: 'r1bq1rk1/2p1bppp/p7/1p1nn3/8/1BP5/PP1P1PPP/RNBQR1K1 w - - 0 11',
  after_Rxe5:   'r1bq1rk1/2p1bppp/p7/1p1nR3/8/1BP5/PP1P1PPP/RNBQ2K1 b - - 0 11',
  after_c6:     'r1bq1rk1/4bppp/p1p5/1p1nR3/8/1BP5/PP1P1PPP/RNBQ2K1 w - - 0 12',
  after_d4:     'r1bq1rk1/4bppp/p1p5/1p1nR3/3P4/1BP5/PP3PPP/RNBQ2K1 b - - 0 12',
  after_Bd6:    'r1bq1rk1/5ppp/p1pb4/1p1nR3/3P4/1BP5/PP3PPP/RNBQ2K1 w - - 1 13',
  after_Re1:    'r1bq1rk1/5ppp/p1pb4/1p1n4/3P4/1BP5/PP3PPP/RNBQR1K1 b - - 2 13',
  after_Qh4:    'r1b2rk1/5ppp/p1pb4/1p1n4/3P3q/1BP5/PP3PPP/RNBQR1K1 w - - 3 14',
  after_g3:     'r1b2rk1/5ppp/p1pb4/1p1n4/3P3q/1BP3P1/PP3P1P/RNBQR1K1 b - - 0 14',
  after_Qh3:    'r1b2rk1/5ppp/p1pb4/1p1n4/3P4/1BP3Pq/PP3P1P/RNBQR1K1 w - - 1 15',
  after_Be3:    'r1b2rk1/5ppp/p1pb4/1p1n4/3P4/1BP1B1Pq/PP3P1P/RN1QR1K1 b - - 2 15',
  after_Bg4:    'r4rk1/5ppp/p1pb4/1p1n4/3P2b1/1BP1B1Pq/PP3P1P/RN1QR1K1 w - - 3 16',
  after_Qd3:    'r4rk1/5ppp/p1pb4/1p1n4/3P2b1/1BPQB1Pq/PP3P1P/RN2R1K1 b - - 4 16',
  after_Rae8:   '4rrk1/5ppp/p1pb4/1p1n4/3P2b1/1BPQB1Pq/PP3P1P/RN2R1K1 w - - 5 17',
  after_Nd2:    '4rrk1/5ppp/p1pb4/1p1n4/3P2b1/1BPQB1Pq/PP1N1P1P/R3R1K1 b - - 6 17',
  after_Re6:    '5rk1/5ppp/p1pbr3/1p1n4/3P2b1/1BPQB1Pq/PP1N1P1P/R3R1K1 w - - 7 18',
  after_a4:     '5rk1/5ppp/p1pbr3/1p1n4/P2P2b1/1BPQB1Pq/1P1N1P1P/R3R1K1 b - - 0 18',
  after_Qh5:    '5rk1/5ppp/p1pbr3/1p1n3q/P2P2b1/1BPQB1P1/1P1N1P1P/R3R1K1 w - - 1 19',
  after_axb5:   '5rk1/5ppp/p1pbr3/1P1n3q/3P2b1/1BPQB1P1/1P1N1P1P/R3R1K1 b - - 0 19',

  // Deviation: 16...f5
  dev_f5:       'r4rk1/6pp/p1pb4/1p1n1p2/3P2b1/1BPQB1Pq/PP3P1P/RN2R1K1 w - - 0 17',
  dev_f5_f4:    'r4rk1/6pp/p1pb4/1p1n1p2/3P1Pb1/1BPQB1Pq/PP5P/RN2R1K1 b - - 0 17',
  dev_f5_Kh8:   'r4r1k/6pp/p1pb4/1p1n1p2/3P1Pb1/1BPQB1Pq/PP5P/RN2R1K1 w - - 1 18',
  dev_f5_Bxd5:  'r4r1k/6pp/p1pb4/1p1B1p2/3P1Pb1/2PQB1Pq/PP5P/RN2R1K1 b - - 0 18',
  dev_f5_cxd5:  'r4r1k/6pp/p2b4/1p1p1p2/3P1Pb1/2PQB1Pq/PP5P/RN2R1K1 w - - 0 19',
  dev_f5_Nd2:   'r4r1k/6pp/p2b4/1p1p1p2/3P1Pb1/2PQB1Pq/PP1N3P/R3R1K1 b - - 1 19',
}

// ═══════════════════════════════════════════════════════════
// rlm-1: Accept the Gambit (c3, exd5, Nxe5)
// ═══════════════════════════════════════════════════════════

const RLM_LESSON_1: OpeningLesson = {
  id: 'rlm-1',
  title: 'Accept the Gambit',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.identity, text: "Sometimes after castling, Black plays the Marshall Attack — a famous pawn sacrifice. Here's how to handle it." },

    // PREDICT 1: c3
    { type: 'play-move', fen: FEN.identity, correctMove: 'c3', prompt: "You know Black wants to play d5. What preparatory move should you make?", hint: 'Support the center with a pawn — prepare for the d5 push.', correctFeedback: 'c3 supports d4 and prepares for the coming storm.', wrongFeedback: 'Play c3 to build central support before Black strikes.' },
    { type: 'instruction', fen: FEN.after_c3, text: "c3 is a calm, multi-purpose move. It supports a future d4 and gives the bishop a retreat to c2.", arrow: ['c2', 'c3'] },

    // Black plays d5
    { type: 'instruction', fen: FEN.after_c3, text: "Black plays d5 — the Marshall Gambit begins.", autoAdvance: 800, highlightSquares: ['d7', 'd5'] },

    // PREDICT 2: exd5
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'exd5', prompt: "Black offers a pawn. Do you take it?", hint: 'Accept the gambit — capture on d5.', correctFeedback: "exd5 accepts the gambit. Black will recapture, but the center opens up.", wrongFeedback: 'Take the pawn on d5 — declining gives Black a free center.' },
    { type: 'instruction', fen: FEN.after_exd5, text: "exd5 accepts the gambit. Black recaptures next, so material stays equal for now.", arrow: ['e4', 'd5'] },

    // Black plays Nxd5
    { type: 'instruction', fen: FEN.after_exd5, text: "Black recaptures with the knight.", autoAdvance: 800, highlightSquares: ['f6', 'd5'] },

    // PREDICT 3: Nxe5
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Nxe5', prompt: "The e5 pawn is undefended. What do you play?", hint: 'Grab the second pawn with the knight.', correctFeedback: "Nxe5 wins a pawn — the e5 pawn was undefended.", wrongFeedback: 'Capture the e5 pawn with your knight.' },
    { type: 'instruction', fen: FEN.after_Nxe5, text: "Nxe5 grabs a free pawn. You're up one, but Black gets very active pieces in return.", arrow: ['f3', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.identity, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.identity, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Nxe5', prompt: 'Your move.', hint: 'Nxe5.', correctFeedback: 'Nxe5.', wrongFeedback: 'Nxe5.' },

    { type: 'instruction', fen: FEN.after_Nxe5, text: "c3, exd5, Nxe5 — you accepted the Marshall Gambit and won a pawn." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlm-2: Seize the Center (Rxe5, d4, Re1)
// ═══════════════════════════════════════════════════════════

const RLM_LESSON_2: OpeningLesson = {
  id: 'rlm-2',
  title: 'Seize the Center',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nxe5, text: "Black recaptures on e5 and starts building an attack. You'll recapture, build the center, and retreat safely." },

    // RECAP
    { type: 'instruction', fen: FEN.identity, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.identity, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Nxe5', prompt: 'Your move.', hint: 'Nxe5.', correctFeedback: 'Nxe5.', wrongFeedback: 'Nxe5.' },

    // Black plays 10...Nxe5
    { type: 'instruction', fen: FEN.after_Nxe5, text: "Black recaptures: Nxe5.", autoAdvance: 800, highlightSquares: ['c6', 'e5'] },

    // PREDICT 1: Rxe5
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Rxe5', prompt: "Recapture the knight. Which piece takes?", hint: 'The rook on e1 takes.', correctFeedback: "Rxe5 recaptures and your rook controls the open e-file.", wrongFeedback: 'Take back with the rook on e1.' },
    { type: 'instruction', fen: FEN.after_Rxe5, text: "Rxe5 puts the rook on a powerful central square, controlling the open e-file.", arrow: ['e1', 'e5'] },

    // Black plays c6
    { type: 'instruction', fen: FEN.after_Rxe5, text: "Black plays c6, supporting the d5 knight.", autoAdvance: 800, highlightSquares: ['c7', 'c6'] },

    // PREDICT 2: d4
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: "Time to build a strong center. What do you play?", hint: 'Push d4 — claim the center.', correctFeedback: "d4 builds a strong center and opens lines for your bishop.", wrongFeedback: 'Push d4 to establish central control.' },
    { type: 'instruction', fen: FEN.after_d4, text: "d4 creates a powerful pawn center. Your bishop on b3 now eyes f7 through the open diagonal.", arrow: ['d2', 'd4'] },

    // Black plays Bd6
    { type: 'instruction', fen: FEN.after_d4, text: "Black plays Bd6, pointing the bishop at your kingside.", autoAdvance: 800, highlightSquares: ['e7', 'd6'] },

    // PREDICT 3: Re1
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Re1', prompt: "Your rook is exposed on e5. Where should it retreat?", hint: 'Back to e1 — safe and still on the open file.', correctFeedback: "Re1 retreats to safety while keeping the e-file.", wrongFeedback: 'Retreat the rook to e1 — stay on the open file.' },
    { type: 'instruction', fen: FEN.after_Re1, text: "Re1 keeps the rook on the e-file. Black's attack is coming, but your position is solid.", arrow: ['e5', 'e1'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nxe5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['c6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Rxe5', prompt: 'Your move.', hint: 'Rxe5.', correctFeedback: 'Rxe5.', wrongFeedback: 'Rxe5.' },
    { type: 'instruction', fen: FEN.after_Rxe5, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['e7', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    { type: 'instruction', fen: FEN.after_Re1, text: "Rxe5, d4, Re1 — recapture, build the center, retreat. You're ready for the attack." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlm-3: Survive the Attack (g3, Be3, Qd3)
// ═══════════════════════════════════════════════════════════

const RLM_LESSON_3: OpeningLesson = {
  id: 'rlm-3',
  title: 'Survive the Attack',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Re1, text: "Black's queen is about to launch a kingside attack. Stay calm — every defensive move has a purpose." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Nxe5, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['c6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Rxe5', prompt: 'Your move.', hint: 'Rxe5.', correctFeedback: 'Rxe5.', wrongFeedback: 'Rxe5.' },
    { type: 'instruction', fen: FEN.after_Rxe5, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['e7', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },

    // Black plays Qh4
    { type: 'instruction', fen: FEN.after_Re1, text: "Black plays Qh4 — the queen attacks your kingside.", autoAdvance: 800, highlightSquares: ['d8', 'h4'] },

    // PREDICT 1: g3
    { type: 'play-move', fen: FEN.after_Qh4, correctMove: 'g3', prompt: "The queen is eyeing h2. How do you defend?", hint: 'Push g3 to block the queen.', correctFeedback: "g3 deflects the queen away from h2.", wrongFeedback: 'Push g3 to kick the queen away from h2.' },
    { type: 'instruction', fen: FEN.after_g3, text: "g3 is the only good move. It blocks the queen's attack on h2 and weakens nothing important.", arrow: ['g2', 'g3'] },

    // Black plays Qh3
    { type: 'instruction', fen: FEN.after_g3, text: "Black relocates the queen to h3, threatening Bg4.", autoAdvance: 800, highlightSquares: ['h4', 'h3'] },

    // PREDICT 2: Be3
    { type: 'play-move', fen: FEN.after_Qh3, correctMove: 'Be3', prompt: "You need to develop and defend. Where does the bishop go?", hint: 'Develop the c1 bishop — it needs to join the game.', correctFeedback: "Be3 develops the last minor piece and supports d4.", wrongFeedback: 'Develop the bishop to e3 — it defends d4 and joins the fight.' },
    { type: 'instruction', fen: FEN.after_Be3, text: "Be3 develops your last minor piece. It supports d4 and prepares to reroute if needed.", arrow: ['c1', 'e3'] },

    // Black plays Bg4
    { type: 'instruction', fen: FEN.after_Be3, text: "Black develops the bishop to g4, adding pressure.", autoAdvance: 800, highlightSquares: ['c8', 'g4'] },

    // PREDICT 3: Qd3
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'Qd3', prompt: "Your queen needs an active square. Where does it go?", hint: 'Move the queen to d3 — it supports the center and eyes the kingside.', correctFeedback: "Qd3 centralizes the queen and supports the d4 pawn.", wrongFeedback: 'Place the queen on d3 — central and flexible.' },
    { type: 'instruction', fen: FEN.after_Qd3, text: "Qd3 puts the queen on a strong central square. It defends d4, eyes h7, and can swing to the kingside if needed.", arrow: ['d1', 'd3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Re1, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Re1, text: 'Qh4.', autoAdvance: 800, highlightSquares: ['d8', 'h4'] },
    { type: 'play-move', fen: FEN.after_Qh4, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'Qh3.', autoAdvance: 800, highlightSquares: ['h4', 'h3'] },
    { type: 'play-move', fen: FEN.after_Qh3, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'Qd3', prompt: 'Your move.', hint: 'Qd3.', correctFeedback: 'Qd3.', wrongFeedback: 'Qd3.' },

    { type: 'instruction', fen: FEN.after_Qd3, text: "g3, Be3, Qd3 — you survived the queen attack and developed every piece." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlm-4: Counterplay (Nd2, a4, axb5)
// ═══════════════════════════════════════════════════════════

const RLM_LESSON_4: OpeningLesson = {
  id: 'rlm-4',
  title: 'Counterplay',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Qd3, text: "You've defended the attack. Now it's time to develop your last piece and start your own counterplay." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Re1, text: "Let's see what you're made of." },
    { type: 'instruction', fen: FEN.after_Re1, text: 'Qh4.', autoAdvance: 800, highlightSquares: ['d8', 'h4'] },
    { type: 'play-move', fen: FEN.after_Qh4, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'Qh3.', autoAdvance: 800, highlightSquares: ['h4', 'h3'] },
    { type: 'play-move', fen: FEN.after_Qh3, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'Qd3', prompt: 'Your move.', hint: 'Qd3.', correctFeedback: 'Qd3.', wrongFeedback: 'Qd3.' },

    // Black plays Rae8
    { type: 'instruction', fen: FEN.after_Qd3, text: "Black doubles rooks on the e-file.", autoAdvance: 800, highlightSquares: ['a8', 'e8'] },

    // PREDICT 1: Nd2
    { type: 'play-move', fen: FEN.after_Rae8, correctMove: 'Nd2', prompt: "You have one piece left to develop. Where does it go?", hint: 'The b1 knight goes to d2.', correctFeedback: "Nd2 develops the last piece and supports e4.", wrongFeedback: 'Develop the knight to d2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: "Nd2 completes development. The knight can reroute to f1 or f3 depending on what's needed.", arrow: ['b1', 'd2'] },

    // Black plays Re6
    { type: 'instruction', fen: FEN.after_Nd2, text: "Black swings the rook to e6, eyeing the kingside.", autoAdvance: 800, highlightSquares: ['e8', 'e6'] },

    // PREDICT 2: a4
    { type: 'play-move', fen: FEN.after_Re6, correctMove: 'a4', prompt: "Black's queenside pawns are overextended. How do you attack them?", hint: 'Push a4 to undermine the b5 pawn.', correctFeedback: "a4 starts your counterattack on the queenside.", wrongFeedback: 'Push a4 to attack the b5 pawn.' },
    { type: 'instruction', fen: FEN.after_a4, text: "a4 targets the b5 pawn. While Black attacks your king, you attack the queenside.", arrow: ['a2', 'a4'] },

    // Black plays Qh5
    { type: 'instruction', fen: FEN.after_a4, text: "Black repositions the queen to h5.", autoAdvance: 800, highlightSquares: ['h3', 'h5'] },

    // PREDICT 3: axb5
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'axb5', prompt: "Keep pushing on the queenside. What comes next?", hint: 'Capture on b5 to open the a-file.', correctFeedback: "axb5 opens the a-file after Black recaptures.", wrongFeedback: 'Take on b5 — Black recaptures but you open the a-file.' },
    { type: 'instruction', fen: FEN.after_axb5, text: "axb5 forces axb5 in return, opening the a-file for your rook. Queenside pressure begins.", arrow: ['a4', 'b5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qd3, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Qd3, text: 'Rae8.', autoAdvance: 800, highlightSquares: ['a8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Rae8, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Re6.', autoAdvance: 800, highlightSquares: ['e8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Re6, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'Qh5.', autoAdvance: 800, highlightSquares: ['h3', 'h5'] },
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'axb5', prompt: 'Your move.', hint: 'axb5.', correctFeedback: 'axb5.', wrongFeedback: 'axb5.' },

    { type: 'instruction', fen: FEN.after_axb5, text: "Nd2, a4, axb5 — develop, attack the queenside, win material. The Marshall is under control." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlm-dev-f5: After 16...f5 (f4, Bxd5, Nd2)
// ═══════════════════════════════════════════════════════════

const RLM_DEV_F5: OpeningLesson = {
  id: 'rlm-dev-f5',
  title: 'If 16...f5',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Qd3, text: "Instead of Rae8, Black sometimes pushes f5 — trying to open the f-file. Here's how to shut it down." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Re1, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Re1, text: 'Qh4.', autoAdvance: 800, highlightSquares: ['d8', 'h4'] },
    { type: 'play-move', fen: FEN.after_Qh4, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'Qh3.', autoAdvance: 800, highlightSquares: ['h4', 'h3'] },
    { type: 'play-move', fen: FEN.after_Qh3, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'Qd3', prompt: 'Your move.', hint: 'Qd3.', correctFeedback: 'Qd3.', wrongFeedback: 'Qd3.' },

    // DEVIATION: 16...f5
    { type: 'instruction', fen: FEN.after_Qd3, text: "Black plays f5 instead of Rae8 — pushing for a kingside attack.", autoAdvance: 800, highlightSquares: ['f7', 'f5'] },

    // PREDICT 1: f4
    { type: 'play-move', fen: FEN.dev_f5, correctMove: 'f4', prompt: "Black pushed f5. How do you stop the f-pawn from advancing further?", hint: 'Block the f-pawn with f4.', correctFeedback: "f4 locks the kingside and stops Black's pawn storm.", wrongFeedback: 'Push f4 to block the f-pawn.' },
    { type: 'instruction', fen: FEN.dev_f5_f4, text: "f4 seals the kingside. Black's f5 pawn is stuck and the attack stalls.", arrow: ['f2', 'f4'] },

    // Black plays Kh8
    { type: 'instruction', fen: FEN.dev_f5_f4, text: "Black tucks the king to h8.", autoAdvance: 800, highlightSquares: ['g8', 'h8'] },

    // PREDICT 2: Bxd5
    { type: 'play-move', fen: FEN.dev_f5_Kh8, correctMove: 'Bxd5', prompt: "The d5 knight is a strong piece. How do you remove it?", hint: 'Capture the knight with your bishop.', correctFeedback: "Bxd5 eliminates Black's best piece.", wrongFeedback: 'Take the knight on d5 with the bishop.' },
    { type: 'instruction', fen: FEN.dev_f5_Bxd5, text: "Bxd5 trades your bishop for the powerful knight. Black's attack loses its main support.", arrow: ['b3', 'd5'] },

    // Black plays cxd5
    { type: 'instruction', fen: FEN.dev_f5_Bxd5, text: "Black recaptures: cxd5.", autoAdvance: 800, highlightSquares: ['c6', 'd5'] },

    // PREDICT 3: Nd2
    { type: 'play-move', fen: FEN.dev_f5_cxd5, correctMove: 'Nd2', prompt: "Develop your last piece. Where does the knight go?", hint: 'The b1 knight goes to d2.', correctFeedback: "Nd2 develops and can reroute to f3 or f1.", wrongFeedback: 'Develop the knight to d2.' },
    { type: 'instruction', fen: FEN.dev_f5_Nd2, text: "Nd2 finishes development. The knight heads to f3 next, and the kingside is locked up.", arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.dev_f5, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.dev_f5, correctMove: 'f4', prompt: 'Your move.', hint: 'f4.', correctFeedback: 'f4.', wrongFeedback: 'f4.' },
    { type: 'instruction', fen: FEN.dev_f5_f4, text: 'Kh8.', autoAdvance: 800, highlightSquares: ['g8', 'h8'] },
    { type: 'play-move', fen: FEN.dev_f5_Kh8, correctMove: 'Bxd5', prompt: 'Your move.', hint: 'Bxd5.', correctFeedback: 'Bxd5.', wrongFeedback: 'Bxd5.' },
    { type: 'instruction', fen: FEN.dev_f5_Bxd5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c6', 'd5'] },
    { type: 'play-move', fen: FEN.dev_f5_cxd5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    { type: 'instruction', fen: FEN.dev_f5_Nd2, text: "Against 16...f5: f4, Bxd5, Nd2. Lock the kingside, trade the knight, develop." },
  ],
}

// ═══════════════════════════════════════════════════════════
// rlm-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const RLM_TEST_1: OpeningLesson = {
  id: 'rlm-test-1',
  title: 'Level 2 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE (12 White moves) ===
    { type: 'play-move', fen: FEN.identity, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nxd5, correctMove: 'Nxe5', prompt: 'Your move.', hint: 'Nxe5.', correctFeedback: 'Nxe5.', wrongFeedback: 'Nxe5.' },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['c6', 'e5'] },
    { type: 'play-move', fen: FEN.after_Nxe5_b, correctMove: 'Rxe5', prompt: 'Your move.', hint: 'Rxe5.', correctFeedback: 'Rxe5.', wrongFeedback: 'Rxe5.' },
    { type: 'instruction', fen: FEN.after_Rxe5, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['e7', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'Re1', prompt: 'Your move.', hint: 'Re1.', correctFeedback: 'Re1.', wrongFeedback: 'Re1.' },
    { type: 'instruction', fen: FEN.after_Re1, text: 'Qh4.', autoAdvance: 800, highlightSquares: ['d8', 'h4'] },
    { type: 'play-move', fen: FEN.after_Qh4, correctMove: 'g3', prompt: 'Your move.', hint: 'g3.', correctFeedback: 'g3.', wrongFeedback: 'g3.' },
    { type: 'instruction', fen: FEN.after_g3, text: 'Qh3.', autoAdvance: 800, highlightSquares: ['h4', 'h3'] },
    { type: 'play-move', fen: FEN.after_Qh3, correctMove: 'Be3', prompt: 'Your move.', hint: 'Be3.', correctFeedback: 'Be3.', wrongFeedback: 'Be3.' },
    { type: 'instruction', fen: FEN.after_Be3, text: 'Bg4.', autoAdvance: 800, highlightSquares: ['c8', 'g4'] },
    { type: 'play-move', fen: FEN.after_Bg4, correctMove: 'Qd3', prompt: 'Your move.', hint: 'Qd3.', correctFeedback: 'Qd3.', wrongFeedback: 'Qd3.' },
    { type: 'instruction', fen: FEN.after_Qd3, text: 'Rae8.', autoAdvance: 800, highlightSquares: ['a8', 'e8'] },
    { type: 'play-move', fen: FEN.after_Rae8, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Re6.', autoAdvance: 800, highlightSquares: ['e8', 'e6'] },
    { type: 'play-move', fen: FEN.after_Re6, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'Qh5.', autoAdvance: 800, highlightSquares: ['h3', 'h5'] },
    { type: 'play-move', fen: FEN.after_Qh5, correctMove: 'axb5', prompt: 'Your move.', hint: 'axb5.', correctFeedback: 'axb5.', wrongFeedback: 'axb5.' },

    // === DEVIATION TEST: 16...f5 ===
    { type: 'instruction', fen: FEN.after_Qd3, text: 'But wait — Black plays f5 instead.', autoAdvance: 800, highlightSquares: ['f7', 'f5'] },
    { type: 'play-move', fen: FEN.dev_f5, correctMove: 'f4', prompt: 'Your move.', hint: 'f4.', correctFeedback: 'f4.', wrongFeedback: 'f4.' },
    { type: 'instruction', fen: FEN.dev_f5_f4, text: 'Kh8.', autoAdvance: 800, highlightSquares: ['g8', 'h8'] },
    { type: 'play-move', fen: FEN.dev_f5_Kh8, correctMove: 'Bxd5', prompt: 'Your move.', hint: 'Bxd5.', correctFeedback: 'Bxd5.', wrongFeedback: 'Bxd5.' },
    { type: 'instruction', fen: FEN.dev_f5_Bxd5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c6', 'd5'] },
    { type: 'play-move', fen: FEN.dev_f5_cxd5, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const RLM_LESSONS: Record<string, OpeningLesson> = {
  'rlm-1': RLM_LESSON_1,
  'rlm-2': RLM_LESSON_2,
  'rlm-3': RLM_LESSON_3,
  'rlm-4': RLM_LESSON_4,
  'rlm-dev-f5': RLM_DEV_F5,
  'rlm-test-1': RLM_TEST_1,
}

export function getRuyLopezMarshallLesson(id: string): OpeningLesson | undefined {
  return RLM_LESSONS[id]
}
