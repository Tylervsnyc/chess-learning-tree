import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// FRENCH TARRASCH LESSONS (ft-1 through ft-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line:
// 1.e4 e6 2.d4 d5 3.Nd2 c5
// 4.exd5 Qxd5 5.Ngf3 cxd4 6.Bc4 Qd6
// 7.O-O Nf6 8.Nb3 Nc6 9.Nbxd4 Nxd4
// 10.Nxd4 a6 11.Re1 Qc7 12.Bb3 Bd6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:       'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e6:       'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:       'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:       'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_Nd2:      'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3',
  after_c5:       'rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4',

  // Main lesson 2: 4.exd5 Qxd5 5.Ngf3 cxd4 6.Bc4 Qd6
  after_exd5:     'rnbqkbnr/pp3ppp/4p3/2pP4/3P4/8/PPPN1PPP/R1BQKBNR b KQkq - 0 4',
  after_Qxd5:     'rnb1kbnr/pp3ppp/4p3/2pq4/3P4/8/PPPN1PPP/R1BQKBNR w KQkq - 0 5',
  after_Ngf3:     'rnb1kbnr/pp3ppp/4p3/2pq4/3P4/5N2/PPPN1PPP/R1BQKB1R b KQkq - 1 5',
  after_cxd4:     'rnb1kbnr/pp3ppp/4p3/3q4/3p4/5N2/PPPN1PPP/R1BQKB1R w KQkq - 0 6',
  after_Bc4:      'rnb1kbnr/pp3ppp/4p3/3q4/2Bp4/5N2/PPPN1PPP/R1BQK2R b KQkq - 1 6',
  after_Qd6:      'rnb1kbnr/pp3ppp/3qp3/8/2Bp4/5N2/PPPN1PPP/R1BQK2R w KQkq - 2 7',

  // Main lesson 3: 7.O-O Nf6 8.Nb3 Nc6 9.Nbxd4 Nxd4
  after_OO:       'rnb1kbnr/pp3ppp/3qp3/8/2Bp4/5N2/PPPN1PPP/R1BQ1RK1 b kq - 3 7',
  after_Nf6:      'rnb1kb1r/pp3ppp/3qpn2/8/2Bp4/5N2/PPPN1PPP/R1BQ1RK1 w kq - 4 8',
  after_Nb3:      'rnb1kb1r/pp3ppp/3qpn2/8/2Bp4/1N3N2/PPP2PPP/R1BQ1RK1 b kq - 5 8',
  after_Nc6:      'r1b1kb1r/pp3ppp/2nqpn2/8/2Bp4/1N3N2/PPP2PPP/R1BQ1RK1 w kq - 6 9',
  after_Nbxd4:    'r1b1kb1r/pp3ppp/2nqpn2/8/2BN4/5N2/PPP2PPP/R1BQ1RK1 b kq - 0 9',
  after_Nxd4:     'r1b1kb1r/pp3ppp/3qpn2/8/2Bn4/5N2/PPP2PPP/R1BQ1RK1 w kq - 0 10',

  // Main lesson 4: 10.Nxd4 a6 11.Re1 Qc7 12.Bb3 Bd6
  after_Nxd4_w:   'r1b1kb1r/pp3ppp/3qpn2/8/2BN4/8/PPP2PPP/R1BQ1RK1 b kq - 0 10',
  after_a6:       'r1b1kb1r/1p3ppp/p2qpn2/8/2BN4/8/PPP2PPP/R1BQ1RK1 w kq - 0 11',
  after_Re1:      'r1b1kb1r/1p3ppp/p2qpn2/8/2BN4/8/PPP2PPP/R1BQR1K1 b kq - 1 11',
  after_Qc7:      'r1b1kb1r/1pq2ppp/p3pn2/8/2BN4/8/PPP2PPP/R1BQR1K1 w kq - 2 12',
  after_Bb3:      'r1b1kb1r/1pq2ppp/p3pn2/8/3N4/1B6/PPP2PPP/R1BQR1K1 b kq - 3 12',
  after_Bd6:      'r1b1k2r/1pq2ppp/p2bpn2/8/3N4/1B6/PPP2PPP/R1BQR1K1 w kq - 4 13',

  // Deviation: 5.dxc5 (instead of 5.Ngf3)
  dev_dxc5_after_dxc5:  'rnb1kbnr/pp3ppp/4p3/2Pq4/8/8/PPPN1PPP/R1BQKBNR b KQkq - 0 5',
  dev_dxc5_after_Bxc5:  'rnb1k1nr/pp3ppp/4p3/2bq4/8/8/PPPN1PPP/R1BQKBNR w KQkq - 0 6',
  dev_dxc5_after_Ngf3:  'rnb1k1nr/pp3ppp/4p3/2bq4/8/5N2/PPPN1PPP/R1BQKB1R b KQkq - 1 6',
  dev_dxc5_after_Nf6:   'rnb1k2r/pp3ppp/4pn2/2bq4/8/5N2/PPPN1PPP/R1BQKB1R w KQkq - 2 7',
  dev_dxc5_after_Bc4:   'rnb1k2r/pp3ppp/4pn2/2bq4/2B5/5N2/PPPN1PPP/R1BQK2R b KQkq - 3 7',
  dev_dxc5_after_Qc6:   'rnb1k2r/pp3ppp/2q1pn2/2b5/2B5/5N2/PPPN1PPP/R1BQK2R w KQkq - 4 8',

  // Deviation: 7.Qe2 (instead of 7.O-O)
  dev_Qe2_after_Qe2:    'rnb1kbnr/pp3ppp/3qp3/8/2Bp4/5N2/PPPNQPPP/R1B1K2R b KQkq - 3 7',
  dev_Qe2_after_Nf6:    'rnb1kb1r/pp3ppp/3qpn2/8/2Bp4/5N2/PPPNQPPP/R1B1K2R w KQkq - 4 8',
  dev_Qe2_after_Nb3:    'rnb1kb1r/pp3ppp/3qpn2/8/2Bp4/1N3N2/PPP1QPPP/R1B1K2R b KQkq - 5 8',
  dev_Qe2_after_Nc6:    'r1b1kb1r/pp3ppp/2nqpn2/8/2Bp4/1N3N2/PPP1QPPP/R1B1K2R w KQkq - 6 9',
  dev_Qe2_after_Bg5:    'r1b1kb1r/pp3ppp/2nqpn2/6B1/2Bp4/1N3N2/PPP1QPPP/R3K2R b KQkq - 7 9',
  dev_Qe2_after_a6:     'r1b1kb1r/1p3ppp/p1nqpn2/6B1/2Bp4/1N3N2/PPP1QPPP/R3K2R w KQkq - 0 10',

  // Deviation: 11.c3 (instead of 11.Re1)
  dev_c3_after_c3:      'r1b1kb1r/1p3ppp/p2qpn2/8/2BN4/2P5/PP3PPP/R1BQ1RK1 b kq - 0 11',
  dev_c3_after_Qc7:     'r1b1kb1r/1pq2ppp/p3pn2/8/2BN4/2P5/PP3PPP/R1BQ1RK1 w kq - 1 12',
  dev_c3_after_Qe2:     'r1b1kb1r/1pq2ppp/p3pn2/8/2BN4/2P5/PP2QPPP/R1B2RK1 b kq - 2 12',
  dev_c3_after_Bd6:     'r1b1k2r/1pq2ppp/p2bpn2/8/2BN4/2P5/PP2QPPP/R1B2RK1 w kq - 3 13',
  dev_c3_after_h3:      'r1b1k2r/1pq2ppp/p2bpn2/8/2BN4/2P4P/PP2QPP1/R1B2RK1 b kq - 0 13',
  dev_c3_after_OO:      'r1b2rk1/1pq2ppp/p2bpn2/8/2BN4/2P4P/PP2QPP1/R1B2RK1 w - - 1 14',
}


// ═══════════════════════════════════════════════════════════
// ft-1: The Tarrasch Setup (e6, d5, c5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const FT_1: OpeningLesson = {
  id: 'ft-1',
  title: 'The Tarrasch Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "In the Tarrasch Variation, White plays 3.Nd2 instead of 3.Nc3. You'll respond with the classic French plan: e6, d5, and then c5 to hit the center." },

    // White plays 1.e4
    { type: 'instruction', fen: FEN.start, text: 'White opens with e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },

    // PREDICT 1: e6
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'How does the French Defense start?', hint: 'A solid pawn to e6 — it guards d5 for next move.', correctFeedback: 'e6 prepares to challenge the center with d5.', wrongFeedback: 'Play e6 — the French Defense starts here.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6 is the French Defense. It guards d5 so you can challenge White\'s center on the next move.', arrow: ['e7', 'e6'] },

    // White plays 2.d4
    { type: 'instruction', fen: FEN.after_e6, text: 'White pushes d4, building a big center.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // PREDICT 2: d5
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'White controls the center. How do you fight back?', hint: 'Challenge the e4 pawn directly with your d-pawn.', correctFeedback: 'd5 challenges the e4 pawn and fights for the center.', wrongFeedback: 'Play d5 — fight for the center.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5 hits the e4 pawn head-on. White has to decide what to do with the tension.', arrow: ['d7', 'd5'] },

    // White plays 3.Nd2
    { type: 'instruction', fen: FEN.after_d5, text: 'White plays Nd2 — the Tarrasch Variation. The knight defends e4 from d2 instead of c3.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },

    // PREDICT 3: c5
    { type: 'play-move', fen: FEN.after_Nd2, correctMove: 'c5', prompt: 'White defended e4 with Nd2. What\'s your next move?', hint: 'Attack the d4 pawn — strike at the base of the center.', correctFeedback: 'c5 attacks the d4 pawn and opens up the position.', wrongFeedback: 'Play c5 — attack the d4 pawn.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'c5 is the key counter-strike. It attacks d4 and starts to break open the center, just like in most French Defense lines.', arrow: ['c7', 'c5'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nd2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    { type: 'instruction', fen: FEN.after_c5, text: "e6, d5, c5 — the French Tarrasch is on the board. You've challenged White's center from both sides." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-2: Queen to the Center (Qxd5, cxd4, Qd6)
// ═══════════════════════════════════════════════════════════

const FT_2: OpeningLesson = {
  id: 'ft-2',
  title: 'Queen to the Center',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_c5, text: "White captures on d5. You'll recapture with the queen, break the center open with cxd4, and dodge the bishop with Qd6." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nd2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // White plays 4.exd5
    { type: 'instruction', fen: FEN.after_c5, text: 'White captures exd5, trading in the center.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },

    // PREDICT 1: Qxd5
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Qxd5', prompt: 'White took your d5 pawn. How do you recapture?', hint: 'Take back with the queen — it belongs in the center here.', correctFeedback: 'Qxd5 recaptures and puts the queen on a strong central square.', wrongFeedback: 'Recapture with the queen — Qxd5.' },
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'Qxd5 is the main line. The queen is centralized and active, and recapturing with the e-pawn would leave you with an isolated pawn.', arrow: ['d8', 'd5'] },

    // White plays 5.Ngf3
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 2: cxd4
    { type: 'play-move', fen: FEN.after_Ngf3, correctMove: 'cxd4', prompt: 'White developed a knight. What pawn capture opens the position?', hint: 'Take the d4 pawn — open the center while your queen is active.', correctFeedback: 'cxd4 opens the center and removes White\'s last central pawn.', wrongFeedback: 'Play cxd4 — break open the center.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'cxd4 opens the position. White\'s center is gone, and the d4 pawn will need to be recaptured — giving you time to develop.', arrow: ['c5', 'd4'] },

    // White plays 6.Bc4
    { type: 'instruction', fen: FEN.after_cxd4, text: 'White develops the bishop to c4, targeting d5 and your queen.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 3: Qd6
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Qd6', prompt: 'The bishop is eyeing your queen on d5. Where does the queen go?', hint: 'Move the queen to d6 — safe and still centralized.', correctFeedback: 'Qd6 sidesteps the bishop while keeping the queen active.', wrongFeedback: 'Play Qd6 — get out of the bishop\'s line.' },
    { type: 'instruction', fen: FEN.after_Qd6, text: 'Qd6 is the best square. The queen stays central, avoids the c4 bishop, and keeps an eye on the d-file.', arrow: ['d5', 'd6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_c5, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_c5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.' },
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'Ngf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Ngf3, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Qd6', prompt: 'Your move.', hint: 'Qd6.', correctFeedback: 'Qd6.', wrongFeedback: 'Qd6.' },

    { type: 'instruction', fen: FEN.after_Qd6, text: "Qxd5, cxd4, Qd6 — you recaptured cleanly, opened the center, and dodged the bishop. Solid play." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-dev-dc5: White plays 5.dxc5 instead of 5.Ngf3
// ═══════════════════════════════════════════════════════════

const FT_DEV_DC5: OpeningLesson = {
  id: 'ft-dev-dc5',
  title: 'Dev 5.dxc5',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Qxd5, text: "Sometimes White captures on c5 with the d-pawn instead of developing the knight. You'll take back with the bishop and develop naturally." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nd2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'White plays dxc5 instead of Ngf3, grabbing the c5 pawn.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },

    // PREDICT 1: Bxc5
    { type: 'play-move', fen: FEN.dev_dxc5_after_dxc5, correctMove: 'Bxc5', prompt: 'White took on c5. How do you recapture?', hint: 'Take back with the bishop — it develops to a strong diagonal.', correctFeedback: 'Bxc5 develops the bishop to a great diagonal while recapturing the pawn.', wrongFeedback: 'Play Bxc5 — develop the bishop and win back the pawn.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Bxc5, text: 'Bxc5 is natural. The bishop sits on a strong diagonal aiming at f2, and you\'ve developed a piece while recapturing.', arrow: ['f8', 'c5'] },

    // White plays 6.Ngf3
    { type: 'instruction', fen: FEN.dev_dxc5_after_Bxc5, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },

    // PREDICT 2: Nf6
    { type: 'play-move', fen: FEN.dev_dxc5_after_Ngf3, correctMove: 'Nf6', prompt: 'White developed a knight. How do you continue?', hint: 'Develop the kingside knight to f6.', correctFeedback: 'Nf6 develops the knight to its natural square and prepares to castle.', wrongFeedback: 'Play Nf6 — develop and get ready to castle.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Nf6, text: 'Nf6 develops with tempo potential. The knight eyes d5 and e4, and castling is just one move away.', arrow: ['g8', 'f6'] },

    // White plays 7.Bc4
    { type: 'instruction', fen: FEN.dev_dxc5_after_Nf6, text: 'White develops the bishop to c4, targeting d5.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },

    // PREDICT 3: Qc6
    { type: 'play-move', fen: FEN.dev_dxc5_after_Bc4, correctMove: 'Qc6', prompt: 'The bishop eyes d5 and your queen. Where should the queen go?', hint: 'Move the queen to c6 — safe and keeping pressure on the center.', correctFeedback: 'Qc6 relocates the queen to a safe square while eyeing the c-file.', wrongFeedback: 'Play Qc6 — reposition the queen.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Qc6, text: 'Qc6 sidesteps the bishop and eyes both the c-file and the long diagonal. You\'re well developed with a solid position.', arrow: ['d5', 'c6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qxd5, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    { type: 'play-move', fen: FEN.dev_dxc5_after_dxc5, correctMove: 'Bxc5', prompt: 'Your move.', hint: 'Bxc5.', correctFeedback: 'Bxc5.', wrongFeedback: 'Bxc5.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Bxc5, text: 'Ngf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_dxc5_after_Ngf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Nf6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.dev_dxc5_after_Bc4, correctMove: 'Qc6', prompt: 'Your move.', hint: 'Qc6.', correctFeedback: 'Qc6.', wrongFeedback: 'Qc6.' },

    { type: 'instruction', fen: FEN.dev_dxc5_after_Qc6, text: "Bxc5, Nf6, Qc6 — you developed the bishop, the knight, and repositioned the queen. Well handled." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-3: Knights and Exchanges (Nf6, Nc6, Nxd4)
// ═══════════════════════════════════════════════════════════

const FT_3: OpeningLesson = {
  id: 'ft-3',
  title: 'Knights and Exchanges',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Qd6, text: "White castles and develops. You'll bring out both knights, win back the d4 pawn, and simplify into a comfortable position." },

    // RECAP
    { type: 'instruction', fen: FEN.after_c5, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_c5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.' },
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'Ngf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Ngf3, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Qd6', prompt: 'Your move.', hint: 'Qd6.', correctFeedback: 'Qd6.', wrongFeedback: 'Qd6.' },

    // White plays 7.O-O
    { type: 'instruction', fen: FEN.after_Qd6, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nf6', prompt: 'White has castled. Time to develop — where does the knight go?', hint: 'The kingside knight belongs on f6.', correctFeedback: 'Nf6 develops the knight to its best square and prepares castling.', wrongFeedback: 'Play Nf6 — develop the knight.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 is natural and strong. The knight controls d5 and e4, and you\'re one step from castling.', arrow: ['g8', 'f6'] },

    // White plays 8.Nb3
    { type: 'instruction', fen: FEN.after_Nf6, text: 'White reroutes the knight to b3, targeting the d4 pawn.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },

    // PREDICT 2: Nc6
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Nc6', prompt: 'White\'s knight eyes d4. How do you defend and develop?', hint: 'Develop the other knight — it defends d4 and fights for the center.', correctFeedback: 'Nc6 defends the d4 pawn and develops the last minor piece.', wrongFeedback: 'Play Nc6 — defend d4 and develop.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 does double duty: it defends the d4 pawn and puts pressure on e5. Both knights are in the game now.', arrow: ['b8', 'c6'] },

    // White plays 9.Nbxd4
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White captures Nbxd4, taking the pawn.', autoAdvance: 800, highlightSquares: ['b3', 'd4'] },

    // PREDICT 3: Nxd4
    { type: 'play-move', fen: FEN.after_Nbxd4, correctMove: 'Nxd4', prompt: 'White captured on d4. How do you respond?', hint: 'Recapture with the knight — trade pieces and keep the position balanced.', correctFeedback: 'Nxd4 recaptures and keeps the position equal.', wrongFeedback: 'Recapture with the knight — Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4 trades a pair of knights. The position is opening up and you\'ll have easy development from here.', arrow: ['c6', 'd4'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qd6, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Qd6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nbxd4.', autoAdvance: 800, highlightSquares: ['b3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nbxd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },

    { type: 'instruction', fen: FEN.after_Nxd4, text: "Nf6, Nc6, Nxd4 — both knights developed, the pawn recaptured, and you've simplified into a comfortable middlegame." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-dev-Qe2: White plays 7.Qe2 instead of 7.O-O
// ═══════════════════════════════════════════════════════════

const FT_DEV_QE2: OpeningLesson = {
  id: 'ft-dev-Qe2',
  title: 'Dev 7.Qe2',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Qd6, text: "Sometimes White plays Qe2 instead of castling. You'll develop the knight, bring out the other one, and prepare queenside expansion with a6." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_c5, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_c5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.' },
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'Ngf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Ngf3, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Qd6', prompt: 'Your move.', hint: 'Qd6.', correctFeedback: 'Qd6.', wrongFeedback: 'Qd6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Qd6, text: 'White plays Qe2 instead of castling, keeping the king in the center for now.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },

    // PREDICT 1: Nf6
    { type: 'play-move', fen: FEN.dev_Qe2_after_Qe2, correctMove: 'Nf6', prompt: 'White played Qe2. How do you continue developing?', hint: 'Develop the kingside knight to its natural square.', correctFeedback: 'Nf6 develops naturally and prepares to castle.', wrongFeedback: 'Play Nf6 — develop the knight.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nf6, text: 'Nf6 is the right plan regardless of White\'s queen placement. The knight controls key central squares.', arrow: ['g8', 'f6'] },

    // White plays 8.Nb3
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nf6, text: 'White plays Nb3, targeting the d4 pawn.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },

    // PREDICT 2: Nc6
    { type: 'play-move', fen: FEN.dev_Qe2_after_Nb3, correctMove: 'Nc6', prompt: 'White\'s knight is heading for d4. How do you respond?', hint: 'Develop the other knight and defend d4.', correctFeedback: 'Nc6 develops and defends the d4 pawn.', wrongFeedback: 'Play Nc6 — defend d4 and develop.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nc6, text: 'Nc6 mirrors the main line plan — defend d4 and keep developing. Simple chess.', arrow: ['b8', 'c6'] },

    // White plays 9.Bg5
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nc6, text: 'White pins the knight with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },

    // PREDICT 3: a6
    { type: 'play-move', fen: FEN.dev_Qe2_after_Bg5, correctMove: 'a6', prompt: 'White pinned your knight. What useful move prepares queenside expansion?', hint: 'A quiet pawn move that prepares b5 and keeps options open.', correctFeedback: 'a6 prepares b5 to push the bishop off the c4-f7 diagonal.', wrongFeedback: 'Play a6 — prepare b5 and expand on the queenside.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_a6, text: 'a6 prepares b5, which will kick the bishop from c4 and give you queenside space. The pin on f6 isn\'t dangerous yet.', arrow: ['a7', 'a6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qd6, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Qd6, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.dev_Qe2_after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nf6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.dev_Qe2_after_Nb3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nc6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.dev_Qe2_after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    { type: 'instruction', fen: FEN.dev_Qe2_after_a6, text: "Nf6, Nc6, a6 — you developed naturally and prepared b5 to expand. The Qe2 line holds no surprises for you." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-4: Solid Development (a6, Qc7, Bd6)
// ═══════════════════════════════════════════════════════════

const FT_4: OpeningLesson = {
  id: 'ft-4',
  title: 'Solid Development',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nxd4, text: "White recaptures on d4 and starts placing pieces. You'll play a6 to prepare queenside expansion, move the queen to c7, and develop the bishop to d6." },

    // RECAP
    { type: 'instruction', fen: FEN.after_Qd6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Qd6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nbxd4.', autoAdvance: 800, highlightSquares: ['b3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nbxd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },

    // White plays 10.Nxd4
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'White recaptures Nxd4 with the remaining knight.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },

    // PREDICT 1: a6
    { type: 'play-move', fen: FEN.after_Nxd4_w, correctMove: 'a6', prompt: 'The position is simplified. What quiet move improves your position?', hint: 'A small pawn move that prevents Nb5 and prepares queenside development.', correctFeedback: 'a6 prevents Nb5 and prepares to develop the queenside.', wrongFeedback: 'Play a6 — prevent Nb5 and prepare queenside play.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6 is a key positional move. It stops the knight from jumping to b5 and prepares b5 to expand on the queenside.', arrow: ['a7', 'a6'] },

    // White plays 11.Re1
    { type: 'instruction', fen: FEN.after_a6, text: 'White centralizes the rook on e1.', autoAdvance: 800, highlightSquares: ['f1', 'e1'] },

    // PREDICT 2: Qc7
    { type: 'play-move', fen: FEN.after_Re1, correctMove: 'Qc7', prompt: 'White activated the rook. Where should your queen go?', hint: 'Move the queen off the d-file and onto the c-file.', correctFeedback: 'Qc7 gets the queen off the open d-file and eyes the c-file.', wrongFeedback: 'Play Qc7 — move the queen to safety on the c-file.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7 steps off the d-file (where White\'s rook is staring) and onto the c-file. The queen also supports a future bishop development.', arrow: ['d6', 'c7'] },

    // White plays 12.Bb3
    { type: 'instruction', fen: FEN.after_Qc7, text: 'White retreats the bishop to b3, keeping it on the diagonal.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },

    // PREDICT 3: Bd6
    { type: 'play-move', fen: FEN.after_Bb3, correctMove: 'Bd6', prompt: 'Time to develop the bishop. Where does it go?', hint: 'The bishop goes to d6, aiming at the kingside.', correctFeedback: 'Bd6 develops the bishop to a strong diagonal pointing at h2.', wrongFeedback: 'Play Bd6 — develop the bishop toward the kingside.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6 is the natural square. The bishop aims at h2 and controls key squares. You\'re almost fully developed.', arrow: ['f8', 'd6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nxd4, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4_w, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Re1.', autoAdvance: 800, highlightSquares: ['f1', 'e1'] },
    { type: 'play-move', fen: FEN.after_Re1, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Bb3, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.' },

    { type: 'instruction', fen: FEN.after_Bd6, text: "a6, Qc7, Bd6 — you secured the queenside, repositioned the queen, and developed the bishop. The French Tarrasch is complete." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-dev-c3: White plays 11.c3 instead of 11.Re1
// ═══════════════════════════════════════════════════════════

const FT_DEV_C3: OpeningLesson = {
  id: 'ft-dev-c3',
  title: 'Dev 11.c3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "Sometimes White plays c3 instead of Re1 to reinforce the center. You'll move the queen to c7, develop the bishop, and castle safely." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_Qd6, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_Qd6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nbxd4.', autoAdvance: 800, highlightSquares: ['b3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nbxd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4_w, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_a6, text: 'White plays c3 instead of Re1, reinforcing the d4 knight.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },

    // PREDICT 1: Qc7
    { type: 'play-move', fen: FEN.dev_c3_after_c3, correctMove: 'Qc7', prompt: 'White supported the knight with c3. What\'s a good move?', hint: 'Move the queen off the d-file to the c-file.', correctFeedback: 'Qc7 relocates the queen to a safe and active square.', wrongFeedback: 'Play Qc7 — get the queen to safety.' },
    { type: 'instruction', fen: FEN.dev_c3_after_Qc7, text: 'Qc7 gets the queen off the open d-file. Same idea as the main line — a safe, active square.', arrow: ['d6', 'c7'] },

    // White plays 12.Qe2
    { type: 'instruction', fen: FEN.dev_c3_after_Qc7, text: 'White plays Qe2, centralizing the queen.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },

    // PREDICT 2: Bd6
    { type: 'play-move', fen: FEN.dev_c3_after_Qe2, correctMove: 'Bd6', prompt: 'White centralized the queen. How do you develop?', hint: 'Develop the bishop toward the kingside.', correctFeedback: 'Bd6 develops the bishop to an active diagonal.', wrongFeedback: 'Play Bd6 — develop the bishop.' },
    { type: 'instruction', fen: FEN.dev_c3_after_Bd6, text: 'Bd6 aims the bishop at h2 and prepares to castle. You\'re almost fully developed.', arrow: ['f8', 'd6'] },

    // White plays 13.h3
    { type: 'instruction', fen: FEN.dev_c3_after_Bd6, text: 'White plays h3, preventing Bg4 pins.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },

    // PREDICT 3: O-O
    { type: 'play-move', fen: FEN.dev_c3_after_h3, correctMove: 'O-O', prompt: 'The position is calm. What\'s the right move?', hint: 'Get your king to safety.', correctFeedback: 'O-O castles and connects the rooks.', wrongFeedback: 'Castle — O-O. Get the king safe.' },
    { type: 'instruction', fen: FEN.dev_c3_after_OO, text: 'O-O completes development. Your king is safe, the rooks are connected, and you have a solid position with no weaknesses.', arrow: ['e8', 'g8'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_a6, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.dev_c3_after_c3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.dev_c3_after_Qc7, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.dev_c3_after_Qe2, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.' },
    { type: 'instruction', fen: FEN.dev_c3_after_Bd6, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.dev_c3_after_h3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },

    { type: 'instruction', fen: FEN.dev_c3_after_OO, text: "Qc7, Bd6, O-O — same solid plan regardless of White's move order. You're fully developed with a healthy position." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ft-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const FT_TEST_1: OpeningLesson = {
  id: 'ft-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE RECALL (all 12 Black moves) ===
    { type: 'instruction', fen: FEN.start, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'Nd2.', autoAdvance: 800, highlightSquares: ['b1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Nd2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_c5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'Qxd5', prompt: 'Your move.', hint: 'Qxd5.', correctFeedback: 'Qxd5.', wrongFeedback: 'Qxd5.' },
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'Ngf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Ngf3, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.after_cxd4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Qd6', prompt: 'Your move.', hint: 'Qd6.', correctFeedback: 'Qd6.', wrongFeedback: 'Qd6.' },
    { type: 'instruction', fen: FEN.after_Qd6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nbxd4.', autoAdvance: 800, highlightSquares: ['b3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nbxd4, correctMove: 'Nxd4', prompt: 'Your move.', hint: 'Nxd4.', correctFeedback: 'Nxd4.', wrongFeedback: 'Nxd4.' },
    { type: 'instruction', fen: FEN.after_Nxd4, text: 'Nxd4.', autoAdvance: 800, highlightSquares: ['f3', 'd4'] },
    { type: 'play-move', fen: FEN.after_Nxd4_w, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'Re1.', autoAdvance: 800, highlightSquares: ['f1', 'e1'] },
    { type: 'play-move', fen: FEN.after_Re1, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Bb3, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.' },

    // === DEVIATION: 5.dxc5 ===
    // Replay to deviation point (after 4.exd5 Qxd5)
    { type: 'instruction', fen: FEN.after_Qxd5, text: 'dxc5.', autoAdvance: 800, highlightSquares: ['d4', 'c5'] },
    { type: 'play-move', fen: FEN.dev_dxc5_after_dxc5, correctMove: 'Bxc5', prompt: 'Your move.', hint: 'Bxc5.', correctFeedback: 'Bxc5.', wrongFeedback: 'Bxc5.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Bxc5, text: 'Ngf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_dxc5_after_Ngf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_dxc5_after_Nf6, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.dev_dxc5_after_Bc4, correctMove: 'Qc6', prompt: 'Your move.', hint: 'Qc6.', correctFeedback: 'Qc6.', wrongFeedback: 'Qc6.' },

    // === DEVIATION: 7.Qe2 ===
    // Replay to deviation point (after 6...Qd6)
    { type: 'instruction', fen: FEN.after_Qd6, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.dev_Qe2_after_Qe2, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nf6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d2', 'b3'] },
    { type: 'play-move', fen: FEN.dev_Qe2_after_Nb3, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.dev_Qe2_after_Nc6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.dev_Qe2_after_Bg5, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },

    // === DEVIATION: 11.c3 ===
    // Replay to deviation point (after 10...a6)
    { type: 'instruction', fen: FEN.after_a6, text: 'c3.', autoAdvance: 800, highlightSquares: ['c2', 'c3'] },
    { type: 'play-move', fen: FEN.dev_c3_after_c3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.dev_c3_after_Qc7, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['d1', 'e2'] },
    { type: 'play-move', fen: FEN.dev_c3_after_Qe2, correctMove: 'Bd6', prompt: 'Your move.', hint: 'Bd6.', correctFeedback: 'Bd6.', wrongFeedback: 'Bd6.' },
    { type: 'instruction', fen: FEN.dev_c3_after_Bd6, text: 'h3.', autoAdvance: 800, highlightSquares: ['h2', 'h3'] },
    { type: 'play-move', fen: FEN.dev_c3_after_h3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// Lookup function
// ═══════════════════════════════════════════════════════════

export function getFrenchTarraschLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'ft-1': return FT_1
    case 'ft-2': return FT_2
    case 'ft-dev-dc5': return FT_DEV_DC5
    case 'ft-3': return FT_3
    case 'ft-dev-Qe2': return FT_DEV_QE2
    case 'ft-4': return FT_4
    case 'ft-dev-c3': return FT_DEV_C3
    case 'ft-test-1': return FT_TEST_1
    default: return undefined
  }
}
