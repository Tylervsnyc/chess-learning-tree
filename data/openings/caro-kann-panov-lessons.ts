import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// CARO-KANN PANOV-BOTVINNIK ATTACK LESSONS (ckp-1 through ckp-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4
//            7.cxd5 Nxd5 8.Bd2 Nc6 9.Bd3 O-O 10.O-O Be7 11.a3 Bf6
//            12.Qc2 g6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:         'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:         'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:         'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:         'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_exd5:       'rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  after_cxd5:       'rnbqkbnr/pp2pppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4',
  after_c4:         'rnbqkbnr/pp2pppp/8/3p4/2PP4/8/PP3PPP/RNBQKBNR b KQkq - 0 4',
  after_Nf6:        'rnbqkb1r/pp2pppp/5n2/3p4/2PP4/8/PP3PPP/RNBQKBNR w KQkq - 1 5',
  after_Nc3:        'rnbqkb1r/pp2pppp/5n2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR b KQkq - 2 5',
  after_e6:         'rnbqkb1r/pp3ppp/4pn2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR w KQkq - 0 6',
  after_Nf3:        'rnbqkb1r/pp3ppp/4pn2/3p4/2PP4/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 6',
  after_Bb4:        'rnbqk2r/pp3ppp/4pn2/3p4/1bPP4/2N2N2/PP3PPP/R1BQKB1R w KQkq - 2 7',
  after_cxd5_w:     'rnbqk2r/pp3ppp/4pn2/3P4/1b1P4/2N2N2/PP3PPP/R1BQKB1R b KQkq - 0 7',
  after_Nxd5:       'rnbqk2r/pp3ppp/4p3/3n4/1b1P4/2N2N2/PP3PPP/R1BQKB1R w KQkq - 0 8',
  after_Bd2:        'rnbqk2r/pp3ppp/4p3/3n4/1b1P4/2N2N2/PP1B1PPP/R2QKB1R b KQkq - 1 8',
  after_Nc6:        'r1bqk2r/pp3ppp/2n1p3/3n4/1b1P4/2N2N2/PP1B1PPP/R2QKB1R w KQkq - 2 9',
  after_Bd3:        'r1bqk2r/pp3ppp/2n1p3/3n4/1b1P4/2NB1N2/PP1B1PPP/R2QK2R b KQkq - 3 9',
  after_OO_black:   'r1bq1rk1/pp3ppp/2n1p3/3n4/1b1P4/2NB1N2/PP1B1PPP/R2QK2R w KQ - 4 10',
  after_OO_white:   'r1bq1rk1/pp3ppp/2n1p3/3n4/1b1P4/2NB1N2/PP1B1PPP/R2Q1RK1 b - - 5 10',
  after_Be7:        'r1bq1rk1/pp2bppp/2n1p3/3n4/3P4/2NB1N2/PP1B1PPP/R2Q1RK1 w - - 6 11',
  after_a3:         'r1bq1rk1/pp2bppp/2n1p3/3n4/3P4/P1NB1N2/1P1B1PPP/R2Q1RK1 b - - 0 11',
  after_Bf6:        'r1bq1rk1/pp3ppp/2n1pb2/3n4/3P4/P1NB1N2/1P1B1PPP/R2Q1RK1 w - - 1 12',
  after_Qc2:        'r1bq1rk1/pp3ppp/2n1pb2/3n4/3P4/P1NB1N2/1PQB1PPP/R4RK1 b - - 2 12',
  after_g6:         'r1bq1rk1/pp3p1p/2n1pbp1/3n4/3P4/P1NB1N2/1PQB1PPP/R4RK1 w - - 0 13',

  // Deviation: 6.c5 Be7 7.Nf3 O-O 8.Bd3 b6
  dev_c5_branch:    'rnbqkb1r/pp3ppp/4pn2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR w KQkq - 0 6',
  dev_c5_after_c5:  'rnbqkb1r/pp3ppp/4pn2/2Pp4/3P4/2N5/PP3PPP/R1BQKBNR b KQkq - 0 6',
  dev_c5_after_Be7: 'rnbqk2r/pp2bppp/4pn2/2Pp4/3P4/2N5/PP3PPP/R1BQKBNR w KQkq - 1 7',
  dev_c5_after_Nf3: 'rnbqk2r/pp2bppp/4pn2/2Pp4/3P4/2N2N2/PP3PPP/R1BQKB1R b KQkq - 2 7',
  dev_c5_after_OO:  'rnbq1rk1/pp2bppp/4pn2/2Pp4/3P4/2N2N2/PP3PPP/R1BQKB1R w KQ - 3 8',
  dev_c5_after_Bd3: 'rnbq1rk1/pp2bppp/4pn2/2Pp4/3P4/2NB1N2/PP3PPP/R1BQK2R b KQ - 4 8',
  dev_c5_after_b6:  'rnbq1rk1/p3bppp/1p2pn2/2Pp4/3P4/2NB1N2/PP3PPP/R1BQK2R w KQ - 0 9',
}


// ═══════════════════════════════════════════════════════════
// ckp-1: THE PANOV EXCHANGE (1.e4 c6 2.d4 d5 3.exd5 cxd5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const CKP_1: OpeningLesson = {
  id: 'ckp-1',
  title: 'The Panov Exchange',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Caro-Kann Panov — White will exchange on d5 and push c4, creating an IQP structure. You'll play c6, d5, and recapture to enter the fight.",
    },

    // ── PREDICT/REVEAL 1: c6 ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White opens with e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: "White played e4. Start the Caro-Kann.",
      hint: 'Push the c-pawn one square to prepare d5.',
      correctFeedback: 'c6 prepares d5 — you want to challenge the center next move.',
      wrongFeedback: 'Play c6 — it sets up d5 on the next move.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 looks quiet but it has a clear plan: next move you'll push d5 and challenge White's center directly.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 2: d5 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4, claiming more center space.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "Now strike the center. What do you play?",
      hint: 'Push the d-pawn two squares to attack e4.',
      correctFeedback: 'd5 challenges e4 directly — White has to deal with the tension.',
      wrongFeedback: 'Play d5 — put pressure on White\'s center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 hits e4 head-on. In the Panov, White will exchange on d5 with the e-pawn.",
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 3: cxd5 ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5, exchanging pawns.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: "White exchanged on d5. How do you recapture?",
      hint: 'Take back with the c-pawn to keep a pawn in the center.',
      correctFeedback: 'cxd5 keeps a pawn in the center and opens the c-file.',
      wrongFeedback: 'Recapture with the c-pawn — cxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: "After cxd5, White will play c4 to attack your d5 pawn — that creates the IQP (isolated queen's pawn) structure that defines this opening.",
      arrow: ['c6', 'd5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: "The Panov structure is set. Next you'll learn how to develop actively with Nf6, e6, and Bb4.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ckp-2: ACTIVE DEVELOPMENT (4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4)
// ═══════════════════════════════════════════════════════════

const CKP_2: OpeningLesson = {
  id: 'ckp-2',
  title: 'Active Development',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: "White will play c4, attacking your d5 pawn. Your job: develop quickly with Nf6, close the center with e6, then pin the c3 knight with Bb4.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's see what you remember!",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },

    // ── PREDICT/REVEAL 1: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4, attacking your d5 pawn.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nf6',
      prompt: "White attacked d5. Develop a piece.",
      hint: 'Bring out the kingside knight — it defends d5 and develops at the same time.',
      correctFeedback: 'Nf6 develops the knight and adds another defender to d5.',
      wrongFeedback: 'Play Nf6 — develop the knight and protect d5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 develops actively. The knight pressures d5 and prepares to castle kingside.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 2: e6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3, adding more pressure to d5.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: "White doubled up on d5 with Nc3. Solidify your pawn.",
      hint: 'Play e6 to give the d5 pawn a solid base.',
      correctFeedback: 'e6 protects d5 and opens the diagonal for your f8 bishop.',
      wrongFeedback: 'Play e6 — support the d5 pawn and free your bishop.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 defends d5 and opens the f8-b4 diagonal — setting up the next move.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 3: Bb4 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White develops the knight to f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bb4',
      prompt: "White played Nf3. Use the diagonal you just opened.",
      hint: 'The bishop can go to b4, pinning the c3 knight.',
      correctFeedback: 'Bb4 pins the c3 knight and develops the bishop to an active square.',
      wrongFeedback: 'Play Bb4 — pin the knight on c3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Bb4 pins the c3 knight against the king. White can't use that knight to support d4 without losing the pin.",
      arrow: ['f8', 'b4'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Solid setup — Nf6, e6, and Bb4 in place. Next White will trade on d5 and you'll recapture with the knight to centralize it.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ckp-dev-c5: IF 6.c5 (Be7, O-O, b6)
// Deviation from lesson 2, branches after 5.Nc3 e6
// ═══════════════════════════════════════════════════════════

const CKP_DEV_C5: OpeningLesson = {
  id: 'ckp-dev-c5',
  title: 'If 6.c5',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_c5_branch,
      text: "Sometimes White plays c5 instead of Nf3, grabbing space on the queenside. Black responds by developing the bishop, castling quickly, then challenging the c5 pawn with b6.",
    },

    // ── RECAP to branch point ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Prove you know these moves!",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_c5,
      text: "White plays c5 instead of Nf3, grabbing space on the queenside.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'c5'],
    },

    // ── PREDICT/REVEAL 1: Be7 ──
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_c5,
      correctMove: 'Be7',
      prompt: "White grabbed space with c5. Where does the bishop go?",
      hint: 'Develop the bishop to a safe square — it can\'t go to b4 here.',
      correctFeedback: 'Be7 develops the bishop safely and prepares to castle.',
      wrongFeedback: 'Play Be7 — develop and prepare to castle.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Be7,
      text: "Be7 tucks the bishop to safety. With the pawn on c5 instead of c4, the b4 square isn't available, so Be7 is the right home.",
      arrow: ['f8', 'e7'],
    },

    // ── PREDICT/REVEAL 2: O-O ──
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Nf3,
      text: "White develops the knight to f3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_Nf3,
      correctMove: 'O-O',
      prompt: "White played Nf3. Get your king safe.",
      hint: 'Castle kingside — your king belongs behind the pawns.',
      correctFeedback: 'O-O castles the king to safety and connects the rooks.',
      wrongFeedback: 'Castle — O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_OO,
      text: "Castled. Now the king is safe and you can start challenging White's space advantage on the queenside.",
      arrow: ['e8', 'g8'],
    },

    // ── PREDICT/REVEAL 3: b6 ──
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Bd3,
      text: "White develops the bishop to d3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_Bd3,
      correctMove: 'b6',
      prompt: "White played Bd3. How do you challenge the c5 pawn?",
      hint: 'Attack the c5 pawn from the side.',
      correctFeedback: 'b6 attacks the c5 pawn directly and frees the queenside.',
      wrongFeedback: 'Play b6 — challenge the c5 pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_b6,
      text: "b6 puts pressure on c5. If White defends with b4, you'll play a5 to undermine the pawn chain.",
      arrow: ['b7', 'b6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_c5,
      text: "Now play all three responses from memory.",
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_c5,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_Nf3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_Bd3,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_b6,
      text: "Be7, O-O, b6 — develop, castle, then challenge the space grab. Now continue with the main line.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ckp-3: CENTRALIZING THE KNIGHT (7.cxd5 Nxd5 8.Bd2 Nc6 9.Bd3 O-O)
// ═══════════════════════════════════════════════════════════

const CKP_3: OpeningLesson = {
  id: 'ckp-3',
  title: 'Centralizing the Knight',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "White will trade on d5. You'll recapture with the knight to centralize it powerfully, then bring out the other knight and castle to safety.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Show me you've got this.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },

    // ── PREDICT/REVEAL 1: Nxd5 ──
    {
      type: 'instruction',
      fen: FEN.after_cxd5_w,
      text: "White plays cxd5, releasing the tension.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'Nxd5',
      prompt: "White traded on d5. How do you recapture?",
      hint: 'Recapture with the knight to place it on a strong central square.',
      correctFeedback: 'Nxd5 places the knight on a powerful central square at d5.',
      wrongFeedback: 'Recapture with the knight — Nxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxd5,
      text: "The knight on d5 is a dominant piece — it sits in the center and can't be easily attacked by White's pawns.",
      arrow: ['f6', 'd5'],
    },

    // ── PREDICT/REVEAL 2: Nc6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2, preparing to develop.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'Nc6',
      prompt: "White developed the bishop. Bring out your other knight.",
      hint: 'Develop the queenside knight to c6, supporting the d5 knight.',
      correctFeedback: 'Nc6 develops the second knight and supports the d5 knight.',
      wrongFeedback: 'Play Nc6 — develop and support d5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Nc6 develops actively. Both knights are centralized and working together.",
      arrow: ['b8', 'c6'],
    },

    // ── PREDICT/REVEAL 3: O-O ──
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White develops the bishop to d3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'O-O',
      prompt: "White played Bd3. Time to get your king safe.",
      hint: 'Castle kingside.',
      correctFeedback: 'O-O castles the king to safety and activates the rook.',
      wrongFeedback: 'Castle — O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_black,
      text: "Castled. Your king is safe and your pieces are well-placed. White will castle next.",
      arrow: ['e8', 'g8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5_w,
      text: "White plays cxd5.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'Nxd5',
      prompt: 'Your move.',
      hint: 'Nxd5.',
      correctFeedback: 'Nxd5.',
      wrongFeedback: 'Nxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO_black,
      text: "Two strong knights, a bishop pin, and a castled king. Next lesson: the bishop maneuver that makes this system tick.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ckp-4: BISHOP MANEUVER (10.O-O Be7 11.a3 Bf6 12.Qc2 g6)
// ═══════════════════════════════════════════════════════════

const CKP_4: OpeningLesson = {
  id: 'ckp-4',
  title: 'Bishop Maneuver',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO_black,
      text: "White will castle and then play a3 to chase the Bb4 bishop. You'll retreat to e7, then re-develop to f6 — an active square where it pressures the center.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick review before the new stuff.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5_w,
      text: "White plays cxd5.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'Nxd5',
      prompt: 'Your move.',
      hint: 'Nxd5.',
      correctFeedback: 'Nxd5.',
      wrongFeedback: 'Nxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── PREDICT/REVEAL 1: Be7 ──
    {
      type: 'instruction',
      fen: FEN.after_OO_white,
      text: "White castles kingside.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_white,
      correctMove: 'Be7',
      prompt: "White castled. What does the bishop do?",
      hint: 'Retreat the bishop to e7 — a3 is coming to chase it.',
      correctFeedback: 'Be7 anticipates White\'s a3 and keeps the bishop on a useful diagonal.',
      wrongFeedback: 'Play Be7 — the bishop retreats before White plays a3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Be7 sidesteps the coming a3. The bishop keeps an eye on the f6 square where it will go next.",
      arrow: ['b4', 'e7'],
    },

    // ── PREDICT/REVEAL 2: Bf6 ──
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: "White plays a3, as expected.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bf6',
      prompt: "White played a3. Now re-develop the bishop actively.",
      hint: 'The bishop goes to f6 where it puts pressure on the d4 pawn.',
      correctFeedback: 'Bf6 re-develops the bishop actively, eyeing the d4 pawn.',
      wrongFeedback: 'Play Bf6 — the bishop belongs on f6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bf6,
      text: "Bf6 is the key maneuver — the bishop went to b4, retreated to e7 to avoid a3, and now re-emerges to f6 where it pressures d4.",
      arrow: ['e7', 'f6'],
    },

    // ── PREDICT/REVEAL 3: g6 ──
    {
      type: 'instruction',
      fen: FEN.after_Qc2,
      text: "White plays Qc2, targeting the h7 pawn and preparing to advance in the center.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'c2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qc2,
      correctMove: 'g6',
      prompt: "White played Qc2. Defend and give the king more room.",
      hint: 'Play g6 to protect h7 and give the king an escape square.',
      correctFeedback: 'g6 defends h7 against the queen and prepares a flexible kingside.',
      wrongFeedback: 'Play g6 — protect h7 from the queen.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "g6 protects h7 and solidifies the kingside. The full setup is complete — Black has active pieces and a solid structure.",
      arrow: ['g7', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_OO_black,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_white,
      text: "White plays O-O.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_white,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: "White plays a3.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bf6',
      prompt: 'Your move.',
      hint: 'Bf6.',
      correctFeedback: 'Bf6.',
      wrongFeedback: 'Bf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc2,
      text: "White plays Qc2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'c2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qc2,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "The full Panov-Botvinnik main line is in your hands. Take the level test when you're ready.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// ckp-test-1: LEVEL TEST
// Tests main line + c5 deviation
// ═══════════════════════════════════════════════════════════

const CKP_TEST_1: OpeningLesson = {
  id: 'ckp-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "White plays e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "White plays exd5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4,
      text: "White plays c4.",
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Bb4',
      prompt: 'Your move.',
      hint: 'Bb4.',
      correctFeedback: 'Bb4.',
      wrongFeedback: 'Bb4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5_w,
      text: "White plays cxd5.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'Nxd5',
      prompt: 'Your move.',
      hint: 'Nxd5.',
      correctFeedback: 'Nxd5.',
      wrongFeedback: 'Nxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd2,
      text: "White plays Bd2.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd2,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_white,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_white,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: "White plays a3.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bf6',
      prompt: 'Your move.',
      hint: 'Bf6.',
      correctFeedback: 'Bf6.',
      wrongFeedback: 'Bf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc2,
      text: "White plays Qc2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'c2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qc2,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },

    // ── c5 DEVIATION SCENARIO ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3 again.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'e6',
      prompt: 'Your move.',
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_c5,
      text: "This time White plays c5.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'c5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_c5,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Nf3,
      text: "White plays Nf3.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_Nf3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_c5_after_Bd3,
      text: "White plays Bd3.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_c5_after_Bd3,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP
// ═══════════════════════════════════════════════════════════

export function getCaroKannPanovLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'ckp-1': return CKP_1
    case 'ckp-2': return CKP_2
    case 'ckp-dev-c5': return CKP_DEV_C5
    case 'ckp-3': return CKP_3
    case 'ckp-4': return CKP_4
    case 'ckp-test-1': return CKP_TEST_1
    default: return undefined
  }
}
