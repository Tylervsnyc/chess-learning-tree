import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SLAV DEFENSE LESSONS (sl-1 through sl-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs computed and validated with chess.js.
// Main line: 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.Bg5 h6
//            6.Bh4 dxc4 7.e4 g5 8.Bg3 b5 9.Be2 Bb7 10.O-O Nbd7 11.Ne5 Bg7
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity positions
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:         'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_d5:         'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  after_c4:         'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_c6:         'rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',

  // Main line
  after_Nf3:        'rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3',
  after_Nf6:        'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4',
  after_Nc3:        'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4',
  after_e6:         'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5',
  after_Bg5:        'rnbqkb1r/pp3ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 5',
  after_h6:         'rnbqkb1r/pp3pp1/2p1pn1p/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R w KQkq - 0 6',
  after_Bh4:        'rnbqkb1r/pp3pp1/2p1pn1p/3p4/2PP3B/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 6',
  after_dxc4:       'rnbqkb1r/pp3pp1/2p1pn1p/8/2pP3B/2N2N2/PP2PPPP/R2QKB1R w KQkq - 0 7',
  after_e4:         'rnbqkb1r/pp3pp1/2p1pn1p/8/2pPP2B/2N2N2/PP3PPP/R2QKB1R b KQkq - 0 7',
  after_g5:         'rnbqkb1r/pp3p2/2p1pn1p/6p1/2pPP2B/2N2N2/PP3PPP/R2QKB1R w KQkq - 0 8',
  after_Bg3:        'rnbqkb1r/pp3p2/2p1pn1p/6p1/2pPP3/2N2NB1/PP3PPP/R2QKB1R b KQkq - 1 8',
  after_b5:         'rnbqkb1r/p4p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP3PPP/R2QKB1R w KQkq - 0 9',
  after_Be2:        'rnbqkb1r/p4p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2QK2R b KQkq - 1 9',
  after_Bb7:        'rn1qkb1r/pb3p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2QK2R w KQkq - 2 10',
  after_OO:         'rn1qkb1r/pb3p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2Q1RK1 b kq - 3 10',
  after_Nbd7:       'r2qkb1r/pb1n1p2/2p1pn1p/1p4p1/2pPP3/2N2NB1/PP2BPPP/R2Q1RK1 w kq - 4 11',
  after_Ne5:        'r2qkb1r/pb1n1p2/2p1pn1p/1p2N1p1/2pPP3/2N3B1/PP2BPPP/R2Q1RK1 b kq - 5 11',
  after_Bg7:        'r2qk2r/pb1n1pb1/2p1pn1p/1p2N1p1/2pPP3/2N3B1/PP2BPPP/R2Q1RK1 w kq - 6 12',

  // Deviation: 4.e3 (instead of 4.Nc3) — after 3.Nf3 Nf6
  dev_e3_after_e3:     'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R b KQkq - 0 4',
  dev_e3_after_Bf5:    'rn1qkb1r/pp2pppp/2p2n2/3p1b2/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5',
  dev_e3_after_Nc3:    'rn1qkb1r/pp2pppp/2p2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq - 2 5',
  dev_e3_after_e6:     'rn1qkb1r/pp3ppp/2p1pn2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6',
  dev_e3_after_Nh4:    'rn1qkb1r/pp3ppp/2p1pn2/3p1b2/2PP3N/2N1P3/PP3PPP/R1BQKB1R b KQkq - 1 6',
  dev_e3_after_Bg6:    'rn1qkb1r/pp3ppp/2p1pnb1/3p4/2PP3N/2N1P3/PP3PPP/R1BQKB1R w KQkq - 2 7',
  dev_e3_after_Nxg6:   'rn1qkb1r/pp3ppp/2p1pnN1/3p4/2PP4/2N1P3/PP3PPP/R1BQKB1R b KQkq - 0 7',
  dev_e3_after_hxg6:   'rn1qkb1r/pp3pp1/2p1pnp1/3p4/2PP4/2N1P3/PP3PPP/R1BQKB1R w KQkq - 0 8',

  // Deviation: 3.Nc3 (instead of 3.Nf3) — after 1.d4 d5 2.c4 c6
  dev_Nc3_after_Nc3:   'rnbqkbnr/pp2pppp/2p5/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  dev_Nc3_after_Nf6:   'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
  dev_Nc3_after_e3:    'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N1P3/PP3PPP/R1BQKBNR b KQkq - 0 4',
  dev_Nc3_after_e6:    'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 5',
  dev_Nc3_after_Nf3:   'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq - 1 5',
  dev_Nc3_after_Nbd7:  'r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 2 6',

  // ═══════════════════════════════════════════════════════════
  // LEVEL 2 — Main line continues from 11...Bg7
  // 12.Nxd7 Nxd7 13.Bd6 a6 14.a4 b4 15.Bxb4 Qb6 16.Ba3 Qxd4
  // 17.Qc2 c5 18.Rad1 Qe5 19.Bxc4 Qc7 20.Ne2 Be5
  // ═══════════════════════════════════════════════════════════

  // sl-4: Recapture (12...Nxd7, 13...a6, 14...b4)
  after_Nxd7_w:       'r2qk2r/pb1N1pb1/2p1pn1p/1p4p1/2pPP3/2N3B1/PP2BPPP/R2Q1RK1 b kq - 0 12',
  after_Nxd7_b:       'r2qk2r/pb1n1pb1/2p1p2p/1p4p1/2pPP3/2N3B1/PP2BPPP/R2Q1RK1 w kq - 0 13',
  after_Bd6:          'r2qk2r/pb1n1pb1/2pBp2p/1p4p1/2pPP3/2N5/PP2BPPP/R2Q1RK1 b kq - 1 13',
  after_a6:           'r2qk2r/1b1n1pb1/p1pBp2p/1p4p1/2pPP3/2N5/PP2BPPP/R2Q1RK1 w kq - 0 14',
  after_a4:           'r2qk2r/1b1n1pb1/p1pBp2p/1p4p1/P1pPP3/2N5/1P2BPPP/R2Q1RK1 b kq - 0 14',
  after_b4:           'r2qk2r/1b1n1pb1/p1pBp2p/6p1/PppPP3/2N5/1P2BPPP/R2Q1RK1 w kq - 0 15',

  // sl-5: Queen Activity (15...Qb6, 16...Qxd4, 17...c5)
  after_Bxb4:         'r2qk2r/1b1n1pb1/p1p1p2p/6p1/PBpPP3/2N5/1P2BPPP/R2Q1RK1 b kq - 0 15',
  after_Qb6:          'r3k2r/1b1n1pb1/pqp1p2p/6p1/PBpPP3/2N5/1P2BPPP/R2Q1RK1 w kq - 1 16',
  after_Ba3:          'r3k2r/1b1n1pb1/pqp1p2p/6p1/P1pPP3/B1N5/1P2BPPP/R2Q1RK1 b kq - 2 16',
  after_Qxd4:         'r3k2r/1b1n1pb1/p1p1p2p/6p1/P1pqP3/B1N5/1P2BPPP/R2Q1RK1 w kq - 0 17',
  after_Qc2:          'r3k2r/1b1n1pb1/p1p1p2p/6p1/P1pqP3/B1N5/1PQ1BPPP/R4RK1 b kq - 1 17',
  after_c5:           'r3k2r/1b1n1pb1/p3p2p/2p3p1/P1pqP3/B1N5/1PQ1BPPP/R4RK1 w kq - 0 18',

  // sl-6: Consolidation (18...Qe5, 19...Qc7, 20...Be5)
  after_Rad1:         'r3k2r/1b1n1pb1/p3p2p/2p3p1/P1pqP3/B1N5/1PQ1BPPP/3R1RK1 b kq - 1 18',
  after_Qe5:          'r3k2r/1b1n1pb1/p3p2p/2p1q1p1/P1p1P3/B1N5/1PQ1BPPP/3R1RK1 w kq - 2 19',
  after_Bxc4:         'r3k2r/1b1n1pb1/p3p2p/2p1q1p1/P1B1P3/B1N5/1PQ2PPP/3R1RK1 b kq - 0 19',
  after_Qc7:          'r3k2r/1bqn1pb1/p3p2p/2p3p1/P1B1P3/B1N5/1PQ2PPP/3R1RK1 w kq - 1 20',
  after_Ne2:          'r3k2r/1bqn1pb1/p3p2p/2p3p1/P1B1P3/B7/1PQ1NPPP/3R1RK1 b kq - 2 20',
  after_Be5:          'r3k2r/1bqn1p2/p3p2p/2p1b1p1/P1B1P3/B7/1PQ1NPPP/3R1RK1 w kq - 3 21',

  // Deviation: 4.Qc2 (instead of 4.Nc3) — after 3.Nf3 Nf6
  dev_Qc2_after_Qc2:   'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PPQ1PPPP/RNB1KB1R b KQkq - 3 4',
  dev_Qc2_after_dxc4:  'rnbqkb1r/pp2pppp/2p2n2/8/2pP4/5N2/PPQ1PPPP/RNB1KB1R w KQkq - 0 5',
  dev_Qc2_after_Qxc4:  'rnbqkb1r/pp2pppp/2p2n2/8/2QP4/5N2/PP2PPPP/RNB1KB1R b KQkq - 0 5',
  dev_Qc2_after_Bf5:   'rn1qkb1r/pp2pppp/2p2n2/5b2/2QP4/5N2/PP2PPPP/RNB1KB1R w KQkq - 1 6',
  dev_Qc2_after_g3:    'rn1qkb1r/pp2pppp/2p2n2/5b2/2QP4/5NP1/PP2PP1P/RNB1KB1R b KQkq - 0 6',
  dev_Qc2_after_e6:    'rn1qkb1r/pp3ppp/2p1pn2/5b2/2QP4/5NP1/PP2PP1P/RNB1KB1R w KQkq - 0 7',

  // Deviation: 5.cxd5 (instead of 5.Bg5) — after 4.Nc3 e6
  dev_cxd5_after_cxd5:  'rnbqkb1r/pp3ppp/2p1pn2/3P4/3P4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 5',
  dev_cxd5_after_exd5:  'rnbqkb1r/pp3ppp/2p2n2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 6',
  dev_cxd5_after_Bg5:   'rnbqkb1r/pp3ppp/2p2n2/3p2B1/3P4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 6',
  dev_cxd5_after_Be7:   'rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N2N2/PP2PPPP/R2QKB1R w KQkq - 2 7',
  dev_cxd5_after_Qc2:   'rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N2N2/PPQ1PPPP/R3KB1R b KQkq - 3 7',
  dev_cxd5_after_g6:    'rnbqk2r/pp2bp1p/2p2np1/3p2B1/3P4/2N2N2/PPQ1PPPP/R3KB1R w KQkq - 0 8',

  // Deviation: 9.h4 (instead of 9.Be2) — after 8...b5
  dev_h4_after_h4:    'rnbqkb1r/p4p2/2p1pn1p/1p4p1/2pPP2P/2N2NB1/PP3PP1/R2QKB1R b KQkq - 0 9',
  dev_h4_after_g4:    'rnbqkb1r/p4p2/2p1pn1p/1p6/2pPP1pP/2N2NB1/PP3PP1/R2QKB1R w KQkq - 0 10',
  dev_h4_after_Ne5:   'rnbqkb1r/p4p2/2p1pn1p/1p2N3/2pPP1pP/2N3B1/PP3PP1/R2QKB1R b KQkq - 1 10',
  dev_h4_after_Nbd7:  'r1bqkb1r/p2n1p2/2p1pn1p/1p2N3/2pPP1pP/2N3B1/PP3PP1/R2QKB1R w KQkq - 2 11',
  dev_h4_after_Be2:   'r1bqkb1r/p2n1p2/2p1pn1p/1p2N3/2pPP1pP/2N3B1/PP2BPP1/R2QK2R b KQkq - 3 11',
  dev_h4_after_Bb7:   'r2qkb1r/pb1n1p2/2p1pn1p/1p2N3/2pPP1pP/2N3B1/PP2BPP1/R2QK2R w KQkq - 4 12',
}


// ═══════════════════════════════════════════════════════════
// sl-1: THE SETUP (3.Nf3 Nf6, 4.Nc3 e6, 5.Bg5 h6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SL_1: OpeningLesson = {
  id: 'sl-1',
  title: 'The Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Welcome to the Slav Defense. You've played 1...d5 and 2...c6 — now it's time to develop your pieces and enter the Semi-Slav.",
    },

    // ── PREDICT/REVEAL 1: 3.Nf3 Nf6 ──
    { type: 'instruction', fen: FEN.after_Nf3, text: 'White develops the knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'White just developed a knight. How should you respond?',
      hint: 'Mirror the development — bring your knight to a natural square.',
      correctFeedback: 'Nf6! Your knight develops to its best square, controlling d5 and e4.',
      wrongFeedback: 'Develop your knight to f6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6 develops the knight to its ideal square, defending d5 and attacking e4.',
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: 4.Nc3 e6 ──
    { type: 'instruction', fen: FEN.after_Nc3, text: 'White brings out the other knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'White is building pressure on d5. How do you reinforce your center?',
      hint: 'Support d5 with a pawn move that also opens a diagonal for your bishop.',
      correctFeedback: 'e6! This enters the Semi-Slav — d5 is rock-solid and your dark-squared bishop can develop.',
      wrongFeedback: 'Play e6 to reinforce d5 and enter the Semi-Slav.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: 'e6 locks down d5 and opens the f8-a3 diagonal for your bishop. This is the Semi-Slav structure.',
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: 5.Bg5 h6 ──
    { type: 'instruction', fen: FEN.after_Bg5, text: 'White pins your knight with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: "White's bishop is pinning your knight. What do you do about it?",
      hint: 'Ask the bishop a question — force it to make a decision.',
      correctFeedback: 'h6! You challenge the bishop immediately. It must retreat or commit to the pin.',
      wrongFeedback: 'Play h6 to challenge the bishop on g5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 forces White's bishop to decide. If it retreats to h4, you'll grab the c4 pawn next — that's the Anti-Moscow Gambit.",
      arrow: ['h7', 'h6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Now play it from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The Semi-Slav is set up. Next lesson: grab the c4 pawn and launch the Anti-Moscow Gambit.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-2: THE GAMBIT (6.Bh4 dxc4, 7.e4 g5, 8.Bg3 b5)
// ═══════════════════════════════════════════════════════════

const SL_2: OpeningLesson = {
  id: 'sl-2',
  title: 'The Gambit',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "The bishop retreated to h4. Time to grab the c4 pawn and launch the Anti-Moscow Gambit.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Quick review before the new stuff.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6!',
      wrongFeedback: 'h6.',
    },

    // ── PREDICT/REVEAL 1: 6.Bh4 dxc4 ──
    { type: 'instruction', fen: FEN.after_Bh4, text: 'The bishop retreats to h4, maintaining the pin.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: "The bishop moved. What's your chance here?",
      hint: "There's a free pawn on c4 — grab it while White is busy with the bishop.",
      correctFeedback: "dxc4! You grab the pawn. White can't easily recapture, and you're up material.",
      wrongFeedback: 'Capture the pawn on c4 with dxc4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxc4,
      text: "dxc4 grabs a pawn. White will push e4 to seize the center, but you'll strike back with g5.",
      arrow: ['d5', 'c4'],
    },

    // ── PREDICT/REVEAL 2: 7.e4 g5 ──
    { type: 'instruction', fen: FEN.after_e4, text: 'White pushes e4, taking the center.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: "White grabbed the center with e4. How do you fight back?",
      hint: 'Attack the bishop on h4 — push the g-pawn to chase it away.',
      correctFeedback: "g5! This is the Anti-Moscow Gambit. You attack the bishop and gain space on the kingside.",
      wrongFeedback: 'Push g5 to attack the bishop and gain kingside space.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g5,
      text: "g5 attacks the bishop and grabs space. The bishop has to retreat to g3, and you'll expand with b5 next.",
      arrow: ['g7', 'g5'],
    },

    // ── PREDICT/REVEAL 3: 8.Bg3 b5 ──
    { type: 'instruction', fen: FEN.after_Bg3, text: 'The bishop retreats to g3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: "The bishop is pushed back. Now protect your extra pawn.",
      hint: 'Defend the c4 pawn with b5 — and gain queenside space.',
      correctFeedback: "b5! You protect the c4 pawn and gain queenside space. The extra pawn is secure.",
      wrongFeedback: 'Play b5 to defend c4 and expand on the queenside.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "b5 defends the c4 pawn and opens the b7 diagonal for your bishop. You're up a pawn with active play.",
      arrow: ['b7', 'b5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "Show me you've got this.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "The Anti-Moscow Gambit is rolling. Next up: develop your pieces and consolidate the advantage.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-3: DEVELOPMENT (9.Be2 Bb7, 10.O-O Nbd7, 11.Ne5 Bg7)
// ═══════════════════════════════════════════════════════════

const SL_3: OpeningLesson = {
  id: 'sl-3',
  title: 'Development',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "You're up a pawn with an active position. Time to develop your remaining pieces.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Prove you know these moves!",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6!',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6!',
      wrongFeedback: 'h6.',
    },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4!',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5!',
      wrongFeedback: 'g5.',
    },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5!',
      wrongFeedback: 'b5.',
    },

    // ── PREDICT/REVEAL 1: 9.Be2 Bb7 ──
    { type: 'instruction', fen: FEN.after_Be2, text: 'White develops the bishop to e2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bb7',
      prompt: "White is developing. Where does your light-squared bishop belong?",
      hint: "Put it on the long diagonal where it's a monster.",
      correctFeedback: "Bb7! The bishop fires down the a8-h1 diagonal, putting pressure on e4.",
      wrongFeedback: 'Develop the bishop to b7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb7,
      text: 'Bb7 activates the bishop on the long diagonal. It pressures e4 and supports a future c5 break.',
      arrow: ['c8', 'b7'],
    },

    // ── PREDICT/REVEAL 2: 10.O-O Nbd7 ──
    { type: 'instruction', fen: FEN.after_OO, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Nbd7',
      prompt: 'White has castled. How do you continue developing?',
      hint: 'Bring your other knight into the game — it supports both e5 and c5 ideas.',
      correctFeedback: "Nbd7! The knight develops naturally, supporting c5 and e5 breaks.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: 'Nbd7 is flexible. The knight supports a future c5 push and can reroute to better squares.',
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 3: 11.Ne5 Bg7 ──
    { type: 'instruction', fen: FEN.after_Ne5, text: 'White plants the knight on e5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne5,
      correctMove: 'Bg7',
      prompt: "White's knight jumped to e5. How do you continue development?",
      hint: 'Fianchetto the dark-squared bishop — it controls the long diagonal.',
      correctFeedback: "Bg7! The bishop fianchettoes to g7, controlling the long diagonal and supporting kingside defense.",
      wrongFeedback: 'Fianchetto with Bg7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Bg7 completes the fianchetto. The bishop guards the kingside and eyes White's center. Your position is solid.",
      arrow: ['f8', 'g7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "Now from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bb7',
      prompt: 'Your move.',
      hint: 'Bb7.',
      correctFeedback: 'Bb7.',
      wrongFeedback: 'Bb7.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne5,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The Slav main line is complete. You know the full Anti-Moscow Gambit setup.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-e3: DEVIATION 4.e3 (instead of 4.Nc3)
// After 3.Nf3 Nf6, White plays 4.e3 instead of 4.Nc3
// Black responds: 4...Bf5, 5...e6, 6...Bg6
// ═══════════════════════════════════════════════════════════

const SL_DEV_E3: OpeningLesson = {
  id: 'sl-dev-e3',
  title: 'Dev 4.e3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Sometimes White plays 4.e3 instead of 4.Nc3. This is quieter — and it gives you a chance to develop your bishop to f5 before it gets locked behind the e6 pawn.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Let's see what you remember!",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6!',
      wrongFeedback: 'Nf6.',
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_e3_after_e3, text: 'White plays 4.e3 instead of 4.Nc3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },

    // ── PREDICT/REVEAL 1: 4...Bf5 ──
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_e3,
      correctMove: 'Bf5',
      prompt: "White played e3 — a quiet move. What's your best response?",
      hint: "Develop the light-squared bishop NOW, before e6 blocks it in.",
      correctFeedback: "Bf5! This is the key idea. Get the bishop out before playing e6.",
      wrongFeedback: 'Play Bf5 to develop the bishop before it gets locked in.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_Bf5,
      text: "Bf5 is the whole point. In the main line with 4.Nc3, you play e6 first and the bishop stays stuck. Here, it gets out early.",
      arrow: ['c8', 'f5'],
    },

    // ── PREDICT/REVEAL 2: 5.Nc3 e6 ──
    { type: 'instruction', fen: FEN.dev_e3_after_Nc3, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nc3,
      correctMove: 'e6',
      prompt: 'Your bishop is safely on f5. Now what?',
      hint: 'Reinforce the center — the same move as the main line, but with your bishop already out.',
      correctFeedback: "e6! Now you have the best of both worlds — solid center and an active bishop.",
      wrongFeedback: 'Play e6 to reinforce d5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_e6,
      text: "e6 gives you the classic Semi-Slav pawn structure, but with your bishop already active on f5. A great version for Black.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: 6.Nh4 Bg6 ──
    { type: 'instruction', fen: FEN.dev_e3_after_Nh4, text: 'White attacks your bishop with Nh4.', autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nh4,
      correctMove: 'Bg6',
      prompt: "The knight is attacking your bishop. Where should it go?",
      hint: 'Retreat to g6 — the bishop stays active and the knight is offside on h4.',
      correctFeedback: "Bg6! The bishop retreats but stays active. White's knight is stuck on the rim on h4.",
      wrongFeedback: 'Retreat the bishop to g6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_Bg6,
      text: "Bg6 keeps the bishop active. White will likely trade with Nxg6, opening the h-file for your rook. You're doing great.",
      arrow: ['f5', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_e3,
      text: "White played 4.e3. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_e3,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nh4, text: 'Nh4.', autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nh4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_e3_after_Bg6,
      text: "When White plays 4.e3, you get the bishop out to f5 first. That's the key difference.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-Nc3: DEVIATION 3.Nc3 (instead of 3.Nf3)
// After 1.d4 d5 2.c4 c6, White plays 3.Nc3 instead of 3.Nf3
// Black responds: 3...Nf6, 4...e6, 5...Nbd7 (Meran setup)
// ═══════════════════════════════════════════════════════════

const SL_DEV_NC3: OpeningLesson = {
  id: 'sl-dev-Nc3',
  title: 'Dev 3.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Sometimes White plays 3.Nc3 instead of 3.Nf3. The plan is the same — develop naturally and enter the Meran setup.",
    },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nc3, text: 'White plays 3.Nc3 instead of 3.Nf3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // ── PREDICT/REVEAL 1: 3...Nf6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'Nf6',
      prompt: "White developed to c3 first. What's your response?",
      hint: 'Same idea as the main line — develop your knight.',
      correctFeedback: 'Nf6! Same natural development. The knight goes to f6 regardless of which knight White develops first.',
      wrongFeedback: 'Develop the knight to f6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nf6,
      text: 'Nf6 is the right response no matter what order White develops the knights.',
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: 4.e3 e6 ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_e3, text: 'White plays e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e3,
      correctMove: 'e6',
      prompt: 'White solidified the center with e3. What do you play?',
      hint: 'Reinforce d5 and open a line for your dark-squared bishop.',
      correctFeedback: "e6! Solid center support. You're heading into a classical Meran structure.",
      wrongFeedback: 'Play e6 to support d5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_e6,
      text: 'e6 enters the Meran structure. The plan is Nbd7, Bd6, and eventually break with dxc4 and c5.',
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: 5.Nf3 Nbd7 ──
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nf3, text: 'White develops the other knight to f3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nf3,
      correctMove: 'Nbd7',
      prompt: "White's development is nearly complete. How do you keep up?",
      hint: 'Develop your queenside knight to a flexible square.',
      correctFeedback: "Nbd7! The knight goes to d7 where it supports both c5 and e5 breaks.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nbd7,
      text: "Nbd7 is the Meran move. From d7, the knight supports c5 and can reroute to b6 or f8. You're in a standard position.",
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "White played 3.Nc3. Show me the Meran setup.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nf3,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nbd7,
      text: "When White plays 3.Nc3 first, you end up in the same solid Meran structure. No surprises.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const SL_TEST_1: OpeningLesson = {
  id: 'sl-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Time to prove you know the Slav Defense. Play the full main line from memory.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg5,
      correctMove: 'h6',
      prompt: 'Your move.',
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bh4,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'g5',
      prompt: 'Your move.',
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bg3,
      correctMove: 'b5',
      prompt: 'Your move.',
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Bb7',
      prompt: 'Your move.',
      hint: 'Bb7.',
      correctFeedback: 'Bb7.',
      wrongFeedback: 'Bb7.',
    },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne5,
      correctMove: 'Bg7',
      prompt: 'Your move.',
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Main line done. Now handle the deviations.",
    },

    // Deviation 1: 4.e3
    { type: 'instruction', fen: FEN.dev_e3_after_e3, text: "White plays 4.e3 instead of 4.Nc3.", autoAdvance: 1200, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_e3,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_e3_after_Nh4, text: 'Nh4.', autoAdvance: 800, highlightSquares: ['f3', 'h4'] },
    {
      type: 'play-move',
      fen: FEN.dev_e3_after_Nh4,
      correctMove: 'Bg6',
      prompt: 'Your move.',
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },

    // Deviation 2: 3.Nc3
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nc3, text: "White plays 3.Nc3 instead of 3.Nf3.", autoAdvance: 1200, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_e3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nf3,
      correctMove: 'Nbd7',
      prompt: 'Your move.',
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-4: THE RECAPTURE (12.Nxd7 Nxd7, 13.Bd6 a6, 14.a4 b4)
// First L2 lesson — recap all L1 moves.
// ═══════════════════════════════════════════════════════════

const SL_4: OpeningLesson = {
  id: 'sl-4',
  title: 'The Recapture',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "White trades knights with Nxd7. Time to recapture, expand on the queenside, and seize space.",
    },

    // ── RECAP (all L1 moves: 3.Nf3 Nf6 through 11.Ne5 Bg7) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Run through the full line first.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6!', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6!', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4!', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5!', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    { type: 'play-move', fen: FEN.after_Bg3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5!', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7!', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7!', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Ne5, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7!', wrongFeedback: 'Bg7.' },

    // ── PREDICT/REVEAL 1: 12.Nxd7 Nxd7 ──
    { type: 'instruction', fen: FEN.after_Nxd7_w, text: 'White trades knights with Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    {
      type: 'play-move',
      fen: FEN.after_Nxd7_w,
      correctMove: 'Nxd7',
      prompt: 'White captured your knight. How do you recapture?',
      hint: 'Take back with the other knight.',
      correctFeedback: 'Nxd7! You recapture and keep control of the center.',
      wrongFeedback: 'Recapture with Nxd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxd7_b,
      text: 'Nxd7 recaptures cleanly. Your knight sits well on d7, supporting future breaks.',
      arrow: ['f6', 'd7'],
    },

    // ── PREDICT/REVEAL 2: 13.Bd6 a6 ──
    { type: 'instruction', fen: FEN.after_Bd6, text: 'White plants the bishop on d6, blocking your development.', autoAdvance: 800, highlightSquares: ['g3', 'd6'] },
    {
      type: 'play-move',
      fen: FEN.after_Bd6,
      correctMove: 'a6',
      prompt: "White's bishop landed on d6. How do you prepare to push forward?",
      hint: 'Prepare b4 — start with a6 to support the advance.',
      correctFeedback: 'a6! Preparing b4 to kick things into gear on the queenside.',
      wrongFeedback: 'Play a6 to prepare the b4 push.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a6,
      text: "a6 prepares b4 and gives your king a potential escape square. Queenside expansion is coming.",
      arrow: ['a7', 'a6'],
    },

    // ── PREDICT/REVEAL 3: 14.a4 b4 ──
    { type: 'instruction', fen: FEN.after_a4, text: 'White plays a4, trying to lock down the queenside.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'b4',
      prompt: "White pushed a4 to clamp down. How do you break through?",
      hint: 'Push b4 — advance past the blockade.',
      correctFeedback: "b4! You push past White's attempt to lock things down. The queenside is opening up.",
      wrongFeedback: 'Push b4 to advance on the queenside.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "b4 breaks through on the queenside. White's knight on c3 is under pressure and your position is active.",
      arrow: ['b5', 'b4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Three new moves. Play them back.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nxd7_w, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7_w, correctMove: 'Nxd7', prompt: 'Your move.', hint: 'Nxd7.', correctFeedback: 'Nxd7.', wrongFeedback: 'Nxd7.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['g3', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "The queenside is opening up. Next: activate your queen and grab the d4 pawn.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-5: QUEEN ACTIVITY (15.Bxb4 Qb6, 16.Ba3 Qxd4, 17.Qc2 c5)
// ═══════════════════════════════════════════════════════════

const SL_5: OpeningLesson = {
  id: 'sl-5',
  title: 'Queen Activity',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "White captures on b4. Your queen enters the game with force — winning the d4 pawn and breaking with c5.",
    },

    // ── RECAP (all L1 + sl-4) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "From the top. You know the drill.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6!', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6!', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4!', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5!', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    { type: 'play-move', fen: FEN.after_Bg3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5!', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7!', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7!', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Ne5, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7!', wrongFeedback: 'Bg7.' },
    // sl-4 recap
    { type: 'instruction', fen: FEN.after_Nxd7_w, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7_w, correctMove: 'Nxd7', prompt: 'Your move.', hint: 'Nxd7.', correctFeedback: 'Nxd7!', wrongFeedback: 'Nxd7.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['g3', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6!', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4!', wrongFeedback: 'b4.' },

    // ── PREDICT/REVEAL 1: 15.Bxb4 Qb6 ──
    { type: 'instruction', fen: FEN.after_Bxb4, text: 'White captures on b4 with the bishop.', autoAdvance: 800, highlightSquares: ['d6', 'b4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxb4,
      correctMove: 'Qb6',
      prompt: "White took on b4. How does your queen enter the game?",
      hint: 'Bring the queen to b6 — it attacks b4 and pressures the queenside.',
      correctFeedback: 'Qb6! The queen attacks the bishop and puts pressure on b2. Active and aggressive.',
      wrongFeedback: 'Play Qb6 to activate the queen.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qb6,
      text: "Qb6 attacks the bishop on b4 and puts pressure down the b-file. The queen is in the game.",
      arrow: ['d8', 'b6'],
    },

    // ── PREDICT/REVEAL 2: 16.Ba3 Qxd4 ──
    { type: 'instruction', fen: FEN.after_Ba3, text: 'The bishop retreats to a3.', autoAdvance: 800, highlightSquares: ['b4', 'a3'] },
    {
      type: 'play-move',
      fen: FEN.after_Ba3,
      correctMove: 'Qxd4',
      prompt: "The bishop retreated. What's hanging?",
      hint: 'The d4 pawn is undefended — grab it with the queen.',
      correctFeedback: "Qxd4! You win the d4 pawn. The center collapses in your favor.",
      wrongFeedback: 'Capture the d4 pawn with Qxd4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qxd4,
      text: "Qxd4 wins a central pawn. Your queen is powerfully placed in the center of the board.",
      arrow: ['b6', 'd4'],
    },

    // ── PREDICT/REVEAL 3: 17.Qc2 c5 ──
    { type: 'instruction', fen: FEN.after_Qc2, text: 'White plays Qc2, eyeing the c-file.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    {
      type: 'play-move',
      fen: FEN.after_Qc2,
      correctMove: 'c5',
      prompt: "White is reorganizing. How do you stake your claim in the center?",
      hint: 'Push c5 — establish a strong pawn center.',
      correctFeedback: "c5! A powerful center break. Your pawns control d4 and support the queen's position.",
      wrongFeedback: 'Push c5 to control the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 establishes a strong pawn duo. You control the center and your pieces have room to breathe.",
      arrow: ['c6', 'c5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_b4,
      text: "Your turn to drive. Play all three.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Bxb4, text: 'Bxb4.', autoAdvance: 800, highlightSquares: ['d6', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.after_Ba3, text: 'Ba3.', autoAdvance: 800, highlightSquares: ['b4', 'a3'] },
    { type: 'play-move', fen: FEN.after_Ba3, correctMove: 'Qxd4', prompt: 'Your move.', hint: 'Qxd4.', correctFeedback: 'Qxd4.', wrongFeedback: 'Qxd4.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Queen activated, d4 pawn captured, center secured with c5. Next: consolidate your advantage.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-6: CONSOLIDATION (18.Rad1 Qe5, 19.Bxc4 Qc7, 20.Ne2 Be5)
// ═══════════════════════════════════════════════════════════

const SL_6: OpeningLesson = {
  id: 'sl-6',
  title: 'Consolidation',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "White brings a rook to d1. You need to reposition your queen and centralize your bishop to lock things down.",
    },

    // ── RECAP (all L1 + sl-4 + sl-5) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "One more time through the whole line.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6!', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6!', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4!', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5!', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    { type: 'play-move', fen: FEN.after_Bg3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5!', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7!', wrongFeedback: 'Bb7.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7!', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.after_Ne5, correctMove: 'Bg7', prompt: 'Your move.', hint: 'Bg7.', correctFeedback: 'Bg7!', wrongFeedback: 'Bg7.' },
    // sl-4 recap
    { type: 'instruction', fen: FEN.after_Nxd7_w, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7_w, correctMove: 'Nxd7', prompt: 'Your move.', hint: 'Nxd7.', correctFeedback: 'Nxd7!', wrongFeedback: 'Nxd7.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['g3', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6!', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4!', wrongFeedback: 'b4.' },
    // sl-5 recap
    { type: 'instruction', fen: FEN.after_Bxb4, text: 'Bxb4.', autoAdvance: 800, highlightSquares: ['d6', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6!', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.after_Ba3, text: 'Ba3.', autoAdvance: 800, highlightSquares: ['b4', 'a3'] },
    { type: 'play-move', fen: FEN.after_Ba3, correctMove: 'Qxd4', prompt: 'Your move.', hint: 'Qxd4.', correctFeedback: 'Qxd4!', wrongFeedback: 'Qxd4.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5!', wrongFeedback: 'c5.' },

    // ── PREDICT/REVEAL 1: 18.Rad1 Qe5 ──
    { type: 'instruction', fen: FEN.after_Rad1, text: 'White brings the rook to d1, putting pressure on your queen.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },
    {
      type: 'play-move',
      fen: FEN.after_Rad1,
      correctMove: 'Qe5',
      prompt: "The rook attacks your queen. Where does she go?",
      hint: 'Move the queen to e5 — central, active, and safe.',
      correctFeedback: "Qe5! The queen stays in the center, controlling key squares and staying out of danger.",
      wrongFeedback: 'Move the queen to e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qe5,
      text: "Qe5 is the perfect retreat. The queen stays centralized and controls both sides of the board.",
      arrow: ['d4', 'e5'],
    },

    // ── PREDICT/REVEAL 2: 19.Bxc4 Qc7 ──
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'White captures the c4 pawn with the bishop.', autoAdvance: 800, highlightSquares: ['e2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_Bxc4,
      correctMove: 'Qc7',
      prompt: "White took on c4. Where should your queen reposition?",
      hint: 'Move to c7 — connect the rooks and keep control of the c-file.',
      correctFeedback: "Qc7! The queen slides to c7, keeping the c-file and preparing to connect the rooks.",
      wrongFeedback: 'Play Qc7 to control the c-file.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Qc7 keeps the queen active and prepares to connect the rooks. Clean, efficient chess.",
      arrow: ['e5', 'c7'],
    },

    // ── PREDICT/REVEAL 3: 20.Ne2 Be5 ──
    { type: 'instruction', fen: FEN.after_Ne2, text: 'White reroutes the knight to e2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Ne2,
      correctMove: 'Be5',
      prompt: "White moved the knight. How do you improve your bishop?",
      hint: 'Centralize the bishop — bring it to e5 where it dominates.',
      correctFeedback: "Be5! The bishop lands on a dominant central square. It controls the long diagonal and supports your position.",
      wrongFeedback: 'Play Be5 to centralize the bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be5,
      text: "Be5 is a powerful centralizing move. The bishop radiates influence across the board. Your position is excellent.",
      arrow: ['g7', 'e5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Last three moves. Lock them in.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Rad1, text: 'Rad1.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },
    { type: 'play-move', fen: FEN.after_Rad1, correctMove: 'Qe5', prompt: 'Your move.', hint: 'Qe5.', correctFeedback: 'Qe5.', wrongFeedback: 'Qe5.' },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['e2', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bxc4, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Ne2, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'Be5', prompt: 'Your move.', hint: 'Be5.', correctFeedback: 'Be5.', wrongFeedback: 'Be5.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Be5,
      text: "Position consolidated. Queen active, bishop centralized, pieces coordinated. The Anti-Moscow Gambit is complete.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-Qc2: DEVIATION 4.Qc2 (instead of 4.Nc3)
// After 3.Nf3 Nf6, White plays 4.Qc2 instead of 4.Nc3
// Black responds: 4...dxc4, 5...Bf5, 6...e6
// ═══════════════════════════════════════════════════════════

const SL_DEV_QC2: OpeningLesson = {
  id: 'sl-dev-Qc2',
  title: 'Dev 4.Qc2',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Sometimes White plays 4.Qc2 instead of 4.Nc3. The queen targets c4, but you can grab the pawn and develop your bishop actively.",
    },

    // ── RECAP to deviation point (3.Nf3 Nf6 = 1 recap pair) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Quick refresher on the first move.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_Qc2_after_Qc2, text: 'White plays 4.Qc2 instead of 4.Nc3.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },

    // ── PREDICT/REVEAL 1: 4...dxc4 ──
    {
      type: 'play-move',
      fen: FEN.dev_Qc2_after_Qc2,
      correctMove: 'dxc4',
      prompt: "White played Qc2. The queen eyes c4 — what do you do?",
      hint: 'Grab the c4 pawn before the queen recaptures easily.',
      correctFeedback: "dxc4! Take the pawn. White will recapture with the queen, but you'll develop with tempo.",
      wrongFeedback: 'Capture on c4 with dxc4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Qc2_after_dxc4,
      text: "dxc4 grabs the pawn. White recaptures with Qxc4, but you develop the bishop with tempo next.",
      arrow: ['d5', 'c4'],
    },

    // ── PREDICT/REVEAL 2: 5.Qxc4 Bf5 ──
    { type: 'instruction', fen: FEN.dev_Qc2_after_Qxc4, text: 'White recaptures with the queen.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.dev_Qc2_after_Qxc4,
      correctMove: 'Bf5',
      prompt: "The queen is on c4. How do you develop with initiative?",
      hint: "Get the light-squared bishop out to f5 before playing e6.",
      correctFeedback: "Bf5! The bishop develops to an active square before e6 locks it in. Same idea as the 4.e3 deviation.",
      wrongFeedback: 'Develop the bishop to f5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Qc2_after_Bf5,
      text: "Bf5 develops the bishop to its best diagonal. The key idea: get it out BEFORE playing e6.",
      arrow: ['c8', 'f5'],
    },

    // ── PREDICT/REVEAL 3: 6.g3 e6 ──
    { type: 'instruction', fen: FEN.dev_Qc2_after_g3, text: 'White fianchettoes with g3.', autoAdvance: 800, highlightSquares: ['g2', 'g3'] },
    {
      type: 'play-move',
      fen: FEN.dev_Qc2_after_g3,
      correctMove: 'e6',
      prompt: "White is setting up. How do you solidify your center?",
      hint: 'Reinforce d5 with the familiar e6.',
      correctFeedback: "e6! Solid center, and your bishop is already active on f5. Perfect setup.",
      wrongFeedback: 'Play e6 to solidify the center.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Qc2_after_e6,
      text: "e6 completes the structure. You have a solid center, an active bishop, and a comfortable position.",
      arrow: ['e7', 'e6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Qc2_after_Qc2,
      text: "White played 4.Qc2. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.dev_Qc2_after_Qc2, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4.', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.dev_Qc2_after_Qxc4, text: 'Qxc4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.dev_Qc2_after_Qxc4, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.dev_Qc2_after_g3, text: 'g3.', autoAdvance: 800, highlightSquares: ['g2', 'g3'] },
    { type: 'play-move', fen: FEN.dev_Qc2_after_g3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Qc2_after_e6,
      text: "Against 4.Qc2, grab the pawn, develop the bishop to f5, then play e6. Simple and strong.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-cxd5: DEVIATION 5.cxd5 (instead of 5.Bg5)
// After 4.Nc3 e6, White plays 5.cxd5 instead of 5.Bg5
// Black responds: 5...exd5, 6...Be7, 7...g6
// ═══════════════════════════════════════════════════════════

const SL_DEV_CXD5: OpeningLesson = {
  id: 'sl-dev-cxd5',
  title: 'Dev 5.cxd5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "White exchanges pawns with 5.cxd5 instead of 5.Bg5. The position simplifies, but you still have a solid plan.",
    },

    // ── RECAP to deviation point (3.Nf3 Nf6 4.Nc3 e6 = 2 recap pairs) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Back to the beginning for a quick review.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6!', wrongFeedback: 'e6.' },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_cxd5_after_cxd5, text: 'White plays 5.cxd5 instead of 5.Bg5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },

    // ── PREDICT/REVEAL 1: 5...exd5 ──
    {
      type: 'play-move',
      fen: FEN.dev_cxd5_after_cxd5,
      correctMove: 'exd5',
      prompt: "White exchanged on d5. How do you recapture?",
      hint: 'Take back with the e-pawn to keep a strong pawn center.',
      correctFeedback: "exd5! You recapture and maintain a solid central pawn on d5.",
      wrongFeedback: 'Recapture with exd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_cxd5_after_exd5,
      text: "exd5 keeps your center solid. The position is symmetrical but you have clear development plans.",
      arrow: ['e6', 'd5'],
    },

    // ── PREDICT/REVEAL 2: 6.Bg5 Be7 ──
    { type: 'instruction', fen: FEN.dev_cxd5_after_Bg5, text: 'White pins the knight with Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    {
      type: 'play-move',
      fen: FEN.dev_cxd5_after_Bg5,
      correctMove: 'Be7',
      prompt: "White pinned your knight. How do you handle it?",
      hint: 'Develop the bishop to e7 to break the pin.',
      correctFeedback: "Be7! Developing the bishop and breaking the pin. Clean and natural.",
      wrongFeedback: 'Play Be7 to develop and break the pin.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_cxd5_after_Be7,
      text: "Be7 breaks the pin on the knight and develops a piece. Simple, effective chess.",
      arrow: ['f8', 'e7'],
    },

    // ── PREDICT/REVEAL 3: 7.Qc2 g6 ──
    { type: 'instruction', fen: FEN.dev_cxd5_after_Qc2, text: 'White plays Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    {
      type: 'play-move',
      fen: FEN.dev_cxd5_after_Qc2,
      correctMove: 'g6',
      prompt: "White repositioned the queen. What subtle move improves your position?",
      hint: 'Prepare to fianchetto — g6 sets up Bf5 via f5 or prepares kingside castling.',
      correctFeedback: "g6! Preparing Bf5 and keeping your position flexible. A sophisticated choice.",
      wrongFeedback: 'Play g6 to prepare Bf5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_cxd5_after_g6,
      text: "g6 prepares Bf5, which develops the bishop to an active diagonal. Your position is solid and flexible.",
      arrow: ['g7', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_cxd5_after_cxd5,
      text: "White exchanged on d5. Show me the response.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.dev_cxd5_after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.dev_cxd5_after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.dev_cxd5_after_Bg5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.dev_cxd5_after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.dev_cxd5_after_Qc2, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_cxd5_after_g6,
      text: "Against 5.cxd5, recapture with exd5, develop Be7, and prepare Bf5 with g6. Solid and reliable.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-dev-h4: DEVIATION 9.h4 (instead of 9.Be2)
// After 8...b5, White plays 9.h4 instead of 9.Be2
// Black responds: 9...g4, 10...Nbd7, 11...Bb7
// ═══════════════════════════════════════════════════════════

const SL_DEV_H4: OpeningLesson = {
  id: 'sl-dev-h4',
  title: 'Dev 9.h4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "White attacks your kingside with 9.h4 instead of developing with Be2. Push past with g4 and keep developing.",
    },

    // ── RECAP to deviation point (3.Nf3 Nf6 through 8.Bg3 b5 = 6 recap pairs) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Let's replay to the branch point.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6!', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6!', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6!', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.after_Bh4, text: 'Bh4.', autoAdvance: 800, highlightSquares: ['g5', 'h4'] },
    { type: 'play-move', fen: FEN.after_Bh4, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4!', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.after_e4, text: 'e4.', autoAdvance: 800, highlightSquares: ['e2', 'e4'] },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'g5', prompt: 'Your move.', hint: 'g5.', correctFeedback: 'g5!', wrongFeedback: 'g5.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3.', autoAdvance: 800, highlightSquares: ['h4', 'g3'] },
    { type: 'play-move', fen: FEN.after_Bg3, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5!', wrongFeedback: 'b5.' },

    // ── DEVIATION SETUP ──
    { type: 'instruction', fen: FEN.dev_h4_after_h4, text: 'White plays 9.h4, attacking your kingside pawns.', autoAdvance: 800, highlightSquares: ['h2', 'h4'] },

    // ── PREDICT/REVEAL 1: 9...g4 ──
    {
      type: 'play-move',
      fen: FEN.dev_h4_after_h4,
      correctMove: 'g4',
      prompt: "White pushed h4 to attack your g5 pawn. How do you respond?",
      hint: 'Push past! g4 advances the pawn and chases the knight.',
      correctFeedback: "g4! Push forward. The pawn advances with tempo, kicking the knight from f3.",
      wrongFeedback: 'Push g4 to advance with tempo.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h4_after_g4,
      text: "g4 pushes past the h4 pawn and attacks the f3 knight. Aggressive and principled.",
      arrow: ['g5', 'g4'],
    },

    // ── PREDICT/REVEAL 2: 10.Ne5 Nbd7 ──
    { type: 'instruction', fen: FEN.dev_h4_after_Ne5, text: 'The knight jumps to e5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev_h4_after_Ne5,
      correctMove: 'Nbd7',
      prompt: "White's knight is on e5. How do you develop?",
      hint: 'Bring the queenside knight out to d7 — challenge the e5 knight.',
      correctFeedback: "Nbd7! Developing naturally and challenging the strong e5 knight.",
      wrongFeedback: 'Develop the knight to d7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h4_after_Nbd7,
      text: "Nbd7 develops the knight and challenges White's outpost on e5. Solid play.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 3: 11.Be2 Bb7 ──
    { type: 'instruction', fen: FEN.dev_h4_after_Be2, text: 'White develops the bishop to e2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.dev_h4_after_Be2,
      correctMove: 'Bb7',
      prompt: "White is developing. Where does your bishop go?",
      hint: 'Fianchetto to b7 — same as the main line.',
      correctFeedback: "Bb7! The bishop fires down the long diagonal. Familiar territory.",
      wrongFeedback: 'Develop the bishop to b7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_h4_after_Bb7,
      text: "Bb7 activates the bishop on the long diagonal. Despite White's h4 aggression, you're well developed and solid.",
      arrow: ['c8', 'b7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_h4_after_h4,
      text: "White pushed h4. Show me the plan.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.dev_h4_after_h4, correctMove: 'g4', prompt: 'Your move.', hint: 'g4.', correctFeedback: 'g4.', wrongFeedback: 'g4.' },
    { type: 'instruction', fen: FEN.dev_h4_after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.dev_h4_after_Ne5, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.dev_h4_after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.dev_h4_after_Be2, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_h4_after_Bb7,
      text: "Against 9.h4, push g4 and keep developing. The kingside attack backfires when you play confidently.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sl-test-2: LEVEL 2 TEST
// Tests: L2 main line (sl-4 + sl-5 + sl-6) and all 3 L2 deviations
// ═══════════════════════════════════════════════════════════

const SL_TEST_2: OpeningLesson = {
  id: 'sl-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // ── PART 1: L2 MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Level 2 test. Play the full middlegame from memory — all nine L2 moves.",
    },

    // sl-4 moves
    { type: 'instruction', fen: FEN.after_Nxd7_w, text: 'Nxd7.', autoAdvance: 800, highlightSquares: ['e5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Nxd7_w, correctMove: 'Nxd7', prompt: 'Your move.', hint: 'Nxd7.', correctFeedback: 'Nxd7.', wrongFeedback: 'Nxd7.' },
    { type: 'instruction', fen: FEN.after_Bd6, text: 'Bd6.', autoAdvance: 800, highlightSquares: ['g3', 'd6'] },
    { type: 'play-move', fen: FEN.after_Bd6, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'a4.', autoAdvance: 800, highlightSquares: ['a2', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },

    // sl-5 moves
    { type: 'instruction', fen: FEN.after_Bxb4, text: 'Bxb4.', autoAdvance: 800, highlightSquares: ['d6', 'b4'] },
    { type: 'play-move', fen: FEN.after_Bxb4, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.after_Ba3, text: 'Ba3.', autoAdvance: 800, highlightSquares: ['b4', 'a3'] },
    { type: 'play-move', fen: FEN.after_Ba3, correctMove: 'Qxd4', prompt: 'Your move.', hint: 'Qxd4.', correctFeedback: 'Qxd4.', wrongFeedback: 'Qxd4.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.after_Qc2, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // sl-6 moves
    { type: 'instruction', fen: FEN.after_Rad1, text: 'Rad1.', autoAdvance: 800, highlightSquares: ['a1', 'd1'] },
    { type: 'play-move', fen: FEN.after_Rad1, correctMove: 'Qe5', prompt: 'Your move.', hint: 'Qe5.', correctFeedback: 'Qe5.', wrongFeedback: 'Qe5.' },
    { type: 'instruction', fen: FEN.after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['e2', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bxc4, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_Ne2, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'Be5', prompt: 'Your move.', hint: 'Be5.', correctFeedback: 'Be5.', wrongFeedback: 'Be5.' },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Main line done. Now handle the deviations.",
    },

    // Deviation 1: 4.Qc2
    { type: 'instruction', fen: FEN.dev_Qc2_after_Qc2, text: "White plays 4.Qc2 instead of 4.Nc3.", autoAdvance: 1200, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.dev_Qc2_after_Qc2, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4.', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.dev_Qc2_after_Qxc4, text: 'Qxc4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.dev_Qc2_after_Qxc4, correctMove: 'Bf5', prompt: 'Your move.', hint: 'Bf5.', correctFeedback: 'Bf5.', wrongFeedback: 'Bf5.' },
    { type: 'instruction', fen: FEN.dev_Qc2_after_g3, text: 'g3.', autoAdvance: 800, highlightSquares: ['g2', 'g3'] },
    { type: 'play-move', fen: FEN.dev_Qc2_after_g3, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },

    // Deviation 2: 5.cxd5
    { type: 'instruction', fen: FEN.dev_cxd5_after_cxd5, text: "White plays 5.cxd5 instead of 5.Bg5.", autoAdvance: 1200, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_cxd5_after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.dev_cxd5_after_Bg5, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.dev_cxd5_after_Bg5, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.dev_cxd5_after_Qc2, text: 'Qc2.', autoAdvance: 800, highlightSquares: ['d1', 'c2'] },
    { type: 'play-move', fen: FEN.dev_cxd5_after_Qc2, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    // Deviation 3: 9.h4
    { type: 'instruction', fen: FEN.dev_h4_after_h4, text: "White plays 9.h4 instead of 9.Be2.", autoAdvance: 1200, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.dev_h4_after_h4, correctMove: 'g4', prompt: 'Your move.', hint: 'g4.', correctFeedback: 'g4.', wrongFeedback: 'g4.' },
    { type: 'instruction', fen: FEN.dev_h4_after_Ne5, text: 'Ne5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    { type: 'play-move', fen: FEN.dev_h4_after_Ne5, correctMove: 'Nbd7', prompt: 'Your move.', hint: 'Nbd7.', correctFeedback: 'Nbd7.', wrongFeedback: 'Nbd7.' },
    { type: 'instruction', fen: FEN.dev_h4_after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.dev_h4_after_Be2, correctMove: 'Bb7', prompt: 'Your move.', hint: 'Bb7.', correctFeedback: 'Bb7.', wrongFeedback: 'Bb7.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SLAV_LESSONS: Record<string, OpeningLesson> = {
  'sl-1': SL_1,
  'sl-2': SL_2,
  'sl-3': SL_3,
  'sl-dev-e3': SL_DEV_E3,
  'sl-dev-Nc3': SL_DEV_NC3,
  'sl-test-1': SL_TEST_1,
  'sl-4': SL_4,
  'sl-5': SL_5,
  'sl-6': SL_6,
  'sl-dev-Qc2': SL_DEV_QC2,
  'sl-dev-cxd5': SL_DEV_CXD5,
  'sl-dev-h4': SL_DEV_H4,
  'sl-test-2': SL_TEST_2,
}

export function getSlavLesson(id: string): OpeningLesson | undefined {
  return SLAV_LESSONS[id]
}
