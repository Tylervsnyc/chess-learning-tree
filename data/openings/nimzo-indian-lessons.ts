import type { OpeningLesson } from '@/types/opening-lesson'

// ===============================================================
// NIMZO-INDIAN DEFENSE LESSONS (ni-1 through ni-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Identity: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4
// Main line: 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 Bxc3
//            9.bxc3 Qc7 10.cxd5 exd5 11.a4 Re8 12.Ba3 c4 13.Bc2
// ===============================================================

const FEN = {
  // Identity positions (before lesson 1)
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:         'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6:        'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_c4:         'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  after_e6:         'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
  after_Nc3:        'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
  after_Bb4:        'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',

  // Lesson 1: 4.e3 O-O 5.Bd3 d5 6.Nf3 c5
  after_e3:         'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR b KQkq - 0 4',
  after_OO:         'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQ - 1 5',
  after_Bd3:        'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2NBP3/PP3PPP/R1BQK1NR b KQ - 2 5',
  after_d5:         'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2NBP3/PP3PPP/R1BQK1NR w KQ - 0 6',
  after_Nf3:        'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2NBPN2/PP3PPP/R1BQK2R b KQ - 1 6',
  after_c5:         'rnbq1rk1/pp3ppp/4pn2/2pp4/1bPP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7',

  // Lesson 2: 7.O-O Nc6 8.a3 Bxc3 9.bxc3 Qc7
  after_OO_w:       'rnbq1rk1/pp3ppp/4pn2/2pp4/1bPP4/2NBPN2/PP3PPP/R1BQ1RK1 b - - 1 7',
  after_Nc6:        'r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 2 8',
  after_a3:         'r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/P1NBPN2/1P3PPP/R1BQ1RK1 b - - 0 8',
  after_Bxc3:       'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/P1bBPN2/1P3PPP/R1BQ1RK1 w - - 0 9',
  after_bxc3:       'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/P1PBPN2/5PPP/R1BQ1RK1 b - - 0 9',
  after_Qc7:        'r1b2rk1/ppq2ppp/2n1pn2/2pp4/2PP4/P1PBPN2/5PPP/R1BQ1RK1 w - - 1 10',

  // Lesson 3: 10.cxd5 exd5 11.a4 Re8 12.Ba3 c4
  after_cxd5:       'r1b2rk1/ppq2ppp/2n1pn2/2pP4/3P4/P1PBPN2/5PPP/R1BQ1RK1 b - - 0 10',
  after_exd5:       'r1b2rk1/ppq2ppp/2n2n2/2pp4/3P4/P1PBPN2/5PPP/R1BQ1RK1 w - - 0 11',
  after_a4:         'r1b2rk1/ppq2ppp/2n2n2/2pp4/P2P4/2PBPN2/5PPP/R1BQ1RK1 b - - 0 11',
  after_Re8:        'r1b1r1k1/ppq2ppp/2n2n2/2pp4/P2P4/2PBPN2/5PPP/R1BQ1RK1 w - - 1 12',
  after_Ba3:        'r1b1r1k1/ppq2ppp/2n2n2/2pp4/P2P4/B1PBPN2/5PPP/R2Q1RK1 b - - 2 12',
  after_c4_b:       'r1b1r1k1/ppq2ppp/2n2n2/3p4/P1pP4/B1PBPN2/5PPP/R2Q1RK1 w - - 0 13',

  // ═══════════════════════════════════════════════════════════
  // LEVEL 2 — Deviations from the main line
  // ═══════════════════════════════════════════════════════════

  // Deviation: 4.f3 (instead of 4.e3) — after identity (3...Bb4)
  dev_f3_after_f3:       'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N2P2/PP2P1PP/R1BQKBNR b KQkq - 0 4',
  dev_f3_after_d5:       'rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2P2/PP2P1PP/R1BQKBNR w KQkq - 0 5',
  dev_f3_after_a3:       'rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/P1N2P2/1P2P1PP/R1BQKBNR b KQkq - 0 5',
  dev_f3_after_Bxc3:     'rnbqk2r/ppp2ppp/4pn2/3p4/2PP4/P1b2P2/1P2P1PP/R1BQKBNR w KQkq - 0 6',
  dev_f3_after_bxc3:     'rnbqk2r/ppp2ppp/4pn2/3p4/2PP4/P1P2P2/4P1PP/R1BQKBNR b KQkq - 0 6',
  dev_f3_after_c5:       'rnbqk2r/pp3ppp/4pn2/2pp4/2PP4/P1P2P2/4P1PP/R1BQKBNR w KQkq - 0 7',

  // Deviation: 5.Bd2 (instead of 5.Bd3) — after 4.e3 O-O
  dev_Bd2_after_Bd2:     'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP1B1PPP/R2QKBNR b KQ - 2 5',
  dev_Bd2_after_d5:      'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2N1P3/PP1B1PPP/R2QKBNR w KQ - 0 6',
  dev_Bd2_after_Nf3:     'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R b KQ - 1 6',
  dev_Bd2_after_b6:      'rnbq1rk1/p1p2ppp/1p2pn2/3p4/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 7',
  dev_Bd2_after_cxd5:    'rnbq1rk1/p1p2ppp/1p2pn2/3P4/1b1P4/2N1PN2/PP1B1PPP/R2QKB1R b KQ - 0 7',
  dev_Bd2_after_exd5:    'rnbq1rk1/p1p2ppp/1p3n2/3p4/1b1P4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 8',

  // Deviation: 6.a3 (instead of 6.Nf3) — after 4.e3 O-O 5.Bd3 d5
  dev_a3_after_a3:       'rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/P1NBP3/1P3PPP/R1BQK1NR b KQ - 0 6',
  dev_a3_after_Bxc3:     'rnbq1rk1/ppp2ppp/4pn2/3p4/2PP4/P1bBP3/1P3PPP/R1BQK1NR w KQ - 0 7',
  dev_a3_after_bxc3:     'rnbq1rk1/ppp2ppp/4pn2/3p4/2PP4/P1PBP3/5PPP/R1BQK1NR b KQ - 0 7',
  dev_a3_after_dxc4:     'rnbq1rk1/ppp2ppp/4pn2/8/2pP4/P1PBP3/5PPP/R1BQK1NR w KQ - 0 8',
  dev_a3_after_Bxc4:     'rnbq1rk1/ppp2ppp/4pn2/8/2BP4/P1P1P3/5PPP/R1BQK1NR b KQ - 0 8',
  dev_a3_after_c5:       'rnbq1rk1/pp3ppp/4pn2/2p5/2BP4/P1P1P3/5PPP/R1BQK1NR w KQ - 0 9',
}


// ===============================================================
// ni-1: THE PIN (4.e3 O-O 5.Bd3 d5 6.Nf3 c5)
// First lesson -- no recap. Predict/Reveal + Recall.
// ===============================================================

const NI_1: OpeningLesson = {
  id: 'ni-1',
  title: 'The Pin',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Welcome to the Nimzo-Indian Defense. Your bishop on b4 pins White's knight to the king -- now it's time to build on that pressure.",
    },

    // -- PREDICT/REVEAL 1: 4.e3 O-O --
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'White plays e3, blocking in the dark-squared bishop to shore up the center.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'What would you play here?',
      hint: 'Get your king to safety first.',
      correctFeedback: 'Castling gets your king safe and connects your rooks.',
      wrongFeedback: 'Tuck the king away before fighting for the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Castling kingside. Your king is safe on g8, and the f8-rook is ready to join the fight.",
      arrow: ['e8', 'g8'],
    },

    // -- PREDICT/REVEAL 2: 5.Bd3 d5 --
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'White develops the bishop to d3, eyeing the h7 pawn and preparing to castle.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: 'Your turn -- find the right move.',
      hint: 'Strike the center with your d-pawn.',
      correctFeedback: 'd5 challenges White\'s c4 pawn head-on and grabs central space.',
      wrongFeedback: 'Push d5 to fight for control of the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 stakes a claim in the center. White's c4 pawn is now under pressure, and your pieces have room to develop.",
      arrow: ['d7', 'd5'],
    },

    // -- PREDICT/REVEAL 3: 6.Nf3 c5 --
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'White develops the knight to f3, adding another defender to d4 and e5.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: 'Time to attack the center. What do you play?',
      hint: 'Hit the d4 pawn with your c-pawn.',
      correctFeedback: 'c5 attacks d4 and opens lines for your queen and bishop.',
      wrongFeedback: 'Play c5 to challenge White\'s d4 pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 puts immediate pressure on d4. White's center is under fire from both d5 and c5.",
      arrow: ['c7', 'c5'],
    },

    // -- RECALL --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Now play all three moves from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'e3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },

    // -- OUTRO --
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Solid start. You've castled, claimed the center, and put White's d4 pawn under siege.",
    },
  ],
}


// ===============================================================
// ni-2: THE EXCHANGE (7.O-O Nc6 8.a3 Bxc3 9.bxc3 Qc7)
// ===============================================================

const NI_2: OpeningLesson = {
  id: 'ni-2',
  title: 'The Exchange',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "White is about to castle and kick your bishop. Time to develop, trade smartly, and seize control of the dark squares.",
    },

    // -- RECAP --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Show me you've got this.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'e3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },

    // -- PREDICT/REVEAL 1: 7.O-O Nc6 --
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: 'White castles kingside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: 'Develop a piece toward the center.',
      hint: 'Bring the knight out to add pressure on d4.',
      correctFeedback: 'Nc6 develops the knight and adds a third attacker on d4.',
      wrongFeedback: 'Play Nc6 to develop and put more pressure on d4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "The knight on c6 reinforces c5 and attacks d4. White's center is under heavy pressure.",
      arrow: ['b8', 'c6'],
    },

    // -- PREDICT/REVEAL 2: 8.a3 Bxc3 --
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'White plays a3, asking your bishop a question -- stay or go?',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3',
      prompt: 'Your bishop is challenged. What do you do?',
      hint: 'Trade the bishop for the knight on c3.',
      correctFeedback: 'Bxc3 trades the bishop for the knight and doubles White\'s c-pawns.',
      wrongFeedback: 'Capture the knight on c3 -- it damages White\'s pawn structure.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxc3,
      text: "You gave up the bishop pair, but White now has doubled c-pawns. Those pawns are a long-term weakness.",
      arrow: ['b4', 'c3'],
    },

    // -- White auto-recapture: 9.bxc3 --
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3 -- White recaptures, but the doubled c-pawns are stuck.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },

    // -- PREDICT/REVEAL 3: 9...Qc7 --
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Qc7',
      prompt: 'Where should the queen go?',
      hint: 'Centralize the queen on a square that eyes both the kingside and queenside.',
      correctFeedback: 'Qc7 puts the queen on a powerful central square, eyeing h2 and supporting c5.',
      wrongFeedback: 'Play Qc7 -- the queen controls key squares from there.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "The queen on c7 is perfectly placed. It supports c5, eyes the h2 pawn, and stays out of danger.",
      arrow: ['d8', 'c7'],
    },

    // -- RECALL --
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "Now replay all three moves from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3',
      prompt: 'Your move.',
      hint: 'Bxc3.',
      correctFeedback: 'Bxc3.',
      wrongFeedback: 'Bxc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },

    // -- OUTRO --
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "The exchange is complete. You've doubled White's pawns and your pieces are well-placed.",
    },
  ],
}


// ===============================================================
// ni-3: ACTIVATING PIECES (10.cxd5 exd5 11.a4 Re8 12.Ba3 c4)
// ===============================================================

const NI_3: OpeningLesson = {
  id: 'ni-3',
  title: 'Activating Pieces',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "White is going to open the center. Recapture, activate the rook, and lock the queenside down.",
    },

    // -- RECAP --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Prove you know these moves!",
    },
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'e3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3',
      prompt: 'Your move.',
      hint: 'Bxc3.',
      correctFeedback: 'Bxc3.',
      wrongFeedback: 'Bxc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },

    // -- PREDICT/REVEAL 1: 10.cxd5 exd5 --
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: 'White captures cxd5, opening the center.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'exd5',
      prompt: 'Recapture in the center.',
      hint: 'Take back with the e-pawn to keep a strong center.',
      correctFeedback: 'exd5 keeps a solid pawn on d5 and opens the e-file for your rook.',
      wrongFeedback: 'Recapture with exd5 to maintain your central pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "Taking with the e-pawn opens the e-file. Your rook on f8 can swing to e8 to take advantage.",
      arrow: ['e6', 'd5'],
    },

    // -- PREDICT/REVEAL 2: 11.a4 Re8 --
    {
      type: 'instruction',
      fen: FEN.after_a4,
      text: 'White plays a4, grabbing queenside space.',
      autoAdvance: 800,
      highlightSquares: ['a3', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'Re8',
      prompt: 'The e-file is open. Put a piece on it.',
      hint: 'Swing the rook to the open e-file.',
      correctFeedback: 'Re8 puts the rook on the open file, aiming straight at White\'s e3 pawn.',
      wrongFeedback: 'Play Re8 to activate your rook on the e-file.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Re8,
      text: "The rook on e8 creates pressure down the e-file. White's e3 pawn is a target.",
      arrow: ['f8', 'e8'],
    },

    // -- PREDICT/REVEAL 3: 12.Ba3 c4 --
    {
      type: 'instruction',
      fen: FEN.after_Ba3,
      text: 'White develops the bishop to a3, trying to target your dark squares.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ba3,
      correctMove: 'c4',
      prompt: 'Lock down the queenside. What do you push?',
      hint: 'Advance the c-pawn to clamp down on White\'s pieces.',
      correctFeedback: 'c4 locks the queenside and cramps White\'s bishop on d3.',
      wrongFeedback: 'Push c4 to restrict White\'s bishop and fix the pawn structure.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c4_b,
      text: "c4 is a key move. It locks the queenside pawns, traps the d3 bishop, and gives you a stable space advantage.",
      arrow: ['c5', 'c4'],
    },

    // -- RECALL --
    {
      type: 'instruction',
      fen: FEN.after_Qc7,
      text: "Replay the three new moves from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: 'cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a4,
      text: 'a4.',
      autoAdvance: 800,
      highlightSquares: ['a3', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'Re8',
      prompt: 'Your move.',
      hint: 'Re8.',
      correctFeedback: 'Re8.',
      wrongFeedback: 'Re8.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ba3,
      text: 'Ba3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ba3,
      correctMove: 'c4',
      prompt: 'Your move.',
      hint: 'c4.',
      correctFeedback: 'c4.',
      wrongFeedback: 'c4.',
    },

    // -- OUTRO --
    {
      type: 'instruction',
      fen: FEN.after_c4_b,
      text: "All 9 moves complete. You've built a fortress -- White's pieces are cramped and your position is rock solid.",
    },
  ],
}


// ===============================================================
// ni-test-1: LEVEL 1 TEST
// ===============================================================

const NI_TEST_1: OpeningLesson = {
  id: 'ni-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Time to prove you know the Nimzo-Indian. Play the full main line from memory.",
    },

    // Move 1: 4.e3 O-O
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'e3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // Move 2: 5.Bd3 d5
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },

    // Move 3: 6.Nf3 c5
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },

    // Move 4: 7.O-O Nc6
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: 'O-O.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },

    // Move 5: 8.a3 Bxc3
    {
      type: 'instruction',
      fen: FEN.after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Bxc3',
      prompt: 'Your move.',
      hint: 'Bxc3.',
      correctFeedback: 'Bxc3.',
      wrongFeedback: 'Bxc3.',
    },

    // Auto: 9.bxc3
    {
      type: 'instruction',
      fen: FEN.after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },

    // Move 6: 9...Qc7
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'Qc7',
      prompt: 'Your move.',
      hint: 'Qc7.',
      correctFeedback: 'Qc7.',
      wrongFeedback: 'Qc7.',
    },

    // Move 7: 10.cxd5 exd5
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: 'cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },

    // Move 8: 11.a4 Re8
    {
      type: 'instruction',
      fen: FEN.after_a4,
      text: 'a4.',
      autoAdvance: 800,
      highlightSquares: ['a3', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'Re8',
      prompt: 'Your move.',
      hint: 'Re8.',
      correctFeedback: 'Re8.',
      wrongFeedback: 'Re8.',
    },

    // Move 9: 12.Ba3 c4
    {
      type: 'instruction',
      fen: FEN.after_Ba3,
      text: 'Ba3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ba3,
      correctMove: 'c4',
      prompt: 'Your move.',
      hint: 'c4.',
      correctFeedback: 'c4.',
      wrongFeedback: 'c4.',
    },
  ],
}


// ===============================================================
// ni-dev-f3: DEVIATION 4.f3 (instead of 4.e3)
// After identity (3...Bb4), White plays 4.f3 instead of 4.e3
// Black responds: 4...d5, 5...Bxc3+, 6...c5
// ===============================================================

const NI_DEV_F3: OpeningLesson = {
  id: 'ni-dev-f3',
  title: 'If f3',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Sometimes White goes aggressive with 4.f3 instead of the quiet 4.e3. Don't panic -- strike the center, trade the bishop, and fight for d4.",
    },

    // -- DEVIATION SETUP --
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_f3,
      text: 'White plays 4.f3 instead of 4.e3. This is the Saemisch Variation -- White wants a big pawn center.',
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },

    // -- PREDICT/REVEAL 1: 4...d5 --
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_f3,
      correctMove: 'd5',
      prompt: 'White played f3 -- an aggressive move. How do you respond?',
      hint: 'Strike the center before White builds a big pawn wall.',
      correctFeedback: 'd5! Challenging the center immediately. White wasted a tempo on f3 instead of developing.',
      wrongFeedback: 'Play d5 to fight for the center.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_d5,
      text: "d5 hits the c4 pawn head-on. White spent a move on f3 instead of developing, so you're ahead in the fight for the center.",
      arrow: ['d7', 'd5'],
    },

    // -- PREDICT/REVEAL 2: 5.a3 Bxc3+ --
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_a3,
      text: 'White plays a3, kicking the bishop.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_a3,
      correctMove: 'Bxc3+',
      prompt: 'Your bishop is challenged. What do you do?',
      hint: 'Trade the bishop for the knight -- and give check while you do it.',
      correctFeedback: 'Bxc3+! You trade the bishop, double the pawns, AND give check. Triple threat.',
      wrongFeedback: 'Capture the knight with Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Bxc3,
      text: "Bxc3+ gives check and forces White to recapture with the b-pawn. The doubled c-pawns are a permanent weakness.",
      arrow: ['b4', 'c3'],
    },

    // -- White auto-recapture: bxc3 --
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_bxc3,
      text: 'bxc3 -- White recaptures, doubling the c-pawns.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },

    // -- PREDICT/REVEAL 3: 6...c5 --
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_bxc3,
      correctMove: 'c5',
      prompt: 'White has weak doubled pawns. How do you attack them?',
      hint: 'Hit d4 with your c-pawn.',
      correctFeedback: "c5! Attacking d4 and putting even more pressure on White's shattered pawn structure.",
      wrongFeedback: 'Push c5 to attack the center.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_c5,
      text: "c5 tears into White's center. The doubled c-pawns and the weakened king position give you a great game.",
      arrow: ['c7', 'c5'],
    },

    // -- RECALL --
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_f3,
      text: "White played 4.f3. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_f3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_a3,
      text: 'a3.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_a3,
      correctMove: 'Bxc3+',
      prompt: 'Your move.',
      hint: 'Bxc3+.',
      correctFeedback: 'Bxc3+.',
      wrongFeedback: 'Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_bxc3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },

    // -- OUTRO --
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_c5,
      text: "When White plays 4.f3, you strike the center with d5, trade the bishop with check, and attack with c5. White's position is already shaky.",
    },
  ],
}


// ===============================================================
// ni-dev-Bd2: DEVIATION 5.Bd2 (instead of 5.Bd3)
// After 4.e3 O-O, White plays 5.Bd2 instead of 5.Bd3
// Black responds: 5...d5, 6...b6, 7...exd5
// ===============================================================

const NI_DEV_BD2: OpeningLesson = {
  id: 'ni-dev-Bd2',
  title: 'If Bd2',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White sometimes plays 5.Bd2 instead of 5.Bd3 -- a sneaky move that avoids the pin but develops passively. Grab the center and prepare queenside fianchetto.",
    },

    // -- RECAP to deviation point --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Quick recap first.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'e3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // -- DEVIATION SETUP --
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bd2,
      text: 'White plays 5.Bd2 instead of 5.Bd3. The bishop is passive here, but it breaks the pin on the knight.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },

    // -- PREDICT/REVEAL 1: 5...d5 --
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bd2,
      correctMove: 'd5',
      prompt: 'White played Bd2. How do you respond?',
      hint: 'Same idea -- claim the center with your d-pawn.',
      correctFeedback: "d5! Same plan as the main line. The center is yours.",
      wrongFeedback: 'Play d5 to stake a claim in the center.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_d5,
      text: "d5 works here just like in the main line. White's bishop is passively placed on d2, so you're doing well.",
      arrow: ['d7', 'd5'],
    },

    // -- PREDICT/REVEAL 2: 6.Nf3 b6 --
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Nf3,
      text: 'White develops the knight to f3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Nf3,
      correctMove: 'b6',
      prompt: 'What should you prepare on the queenside?',
      hint: 'Prepare to fianchetto the bishop with b6.',
      correctFeedback: 'b6! Preparing Bb7 to put the bishop on a powerful diagonal.',
      wrongFeedback: 'Play b6 to prepare the bishop fianchetto.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_b6,
      text: "b6 prepares Bb7, putting the bishop on the long diagonal where it eyes the center and the kingside.",
      arrow: ['b7', 'b6'],
    },

    // -- PREDICT/REVEAL 3: 7.cxd5 exd5 --
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_cxd5,
      text: 'White captures cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_cxd5,
      correctMove: 'exd5',
      prompt: 'How do you recapture?',
      hint: 'Take back with the e-pawn to keep a solid center.',
      correctFeedback: 'exd5! A solid pawn on d5 and the e-file opens for your rook.',
      wrongFeedback: 'Recapture with exd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_exd5,
      text: "exd5 keeps your center solid. Next you'll play Bb7, and your pieces will be beautifully coordinated.",
      arrow: ['e6', 'd5'],
    },

    // -- RECALL --
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Bd2,
      text: "White played 5.Bd2. Show me the plan.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Bd2,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_Nf3,
      text: 'Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_Nf3,
      correctMove: 'b6',
      prompt: 'Your move.',
      hint: 'b6.',
      correctFeedback: 'b6.',
      wrongFeedback: 'b6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_cxd5,
      text: 'cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Bd2_after_cxd5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },

    // -- OUTRO --
    {
      type: 'instruction',
      fen: FEN.dev_Bd2_after_exd5,
      text: "Against 5.Bd2, you play d5, prepare the queenside fianchetto with b6, and keep a rock-solid center. Simple and effective.",
    },
  ],
}


// ===============================================================
// ni-dev-a3: DEVIATION 6.a3 (instead of 6.Nf3)
// After 4.e3 O-O 5.Bd3 d5, White plays 6.a3 instead of 6.Nf3
// Black responds: 6...Bxc3+, 7...dxc4, 8...c5
// ===============================================================

const NI_DEV_A3: OpeningLesson = {
  id: 'ni-dev-a3',
  title: 'If a3',
  defaultOrientation: 'black',
  steps: [
    // -- INTRO --
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "White sometimes kicks the bishop with 6.a3 right away, before developing the knight. Trade it off, grab the c4 pawn, and counterattack.",
    },

    // -- RECAP to deviation point --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Let's see what you remember.",
    },
    {
      type: 'instruction',
      fen: FEN.after_e3,
      text: 'e3.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: 'Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },

    // -- DEVIATION SETUP --
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_a3,
      text: 'White plays 6.a3 instead of 6.Nf3, forcing the bishop decision immediately.',
      autoAdvance: 800,
      highlightSquares: ['a2', 'a3'],
    },

    // -- PREDICT/REVEAL 1: 6...Bxc3+ --
    {
      type: 'play-move',
      fen: FEN.dev_a3_after_a3,
      correctMove: 'Bxc3+',
      prompt: 'White is kicking your bishop. What do you do?',
      hint: 'Trade the bishop for the knight -- with check.',
      correctFeedback: 'Bxc3+! Trade it off and give check. The doubled pawns are a lasting weakness for White.',
      wrongFeedback: 'Capture the knight with Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_Bxc3,
      text: "Bxc3+ gives check and forces bxc3. Same idea as the main line -- doubled c-pawns are permanent damage.",
      arrow: ['b4', 'c3'],
    },

    // -- White auto-recapture: bxc3 --
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_bxc3,
      text: 'bxc3 -- the pawns are doubled.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },

    // -- PREDICT/REVEAL 2: 7...dxc4 --
    {
      type: 'play-move',
      fen: FEN.dev_a3_after_bxc3,
      correctMove: 'dxc4',
      prompt: "White's pawns are a mess. How do you exploit it?",
      hint: 'Grab the c4 pawn -- it opens lines and wins material.',
      correctFeedback: 'dxc4! You win the c4 pawn and open the position. White is struggling.',
      wrongFeedback: 'Capture with dxc4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_dxc4,
      text: "dxc4 wins a pawn and opens the d-file. White has to spend a tempo recapturing.",
      arrow: ['d5', 'c4'],
    },

    // -- White recaptures: Bxc4 --
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_Bxc4,
      text: 'Bxc4 -- White takes back the pawn.',
      autoAdvance: 800,
      highlightSquares: ['d3', 'c4'],
    },

    // -- PREDICT/REVEAL 3: 8...c5 --
    {
      type: 'play-move',
      fen: FEN.dev_a3_after_Bxc4,
      correctMove: 'c5',
      prompt: 'Now attack the center. What do you push?',
      hint: 'Hit the d4 pawn with c5.',
      correctFeedback: "c5! Attacking d4 directly. White's center is crumbling.",
      wrongFeedback: 'Push c5 to attack d4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_c5,
      text: "c5 puts d4 under fire. White has doubled c-pawns, a weakened center, and you're fully developed. Great position.",
      arrow: ['c7', 'c5'],
    },

    // -- RECALL --
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_a3,
      text: "White played 6.a3 early. Handle it from memory.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_a3_after_a3,
      correctMove: 'Bxc3+',
      prompt: 'Your move.',
      hint: 'Bxc3+.',
      correctFeedback: 'Bxc3+.',
      wrongFeedback: 'Bxc3+.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_bxc3,
      text: 'bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_a3_after_bxc3,
      correctMove: 'dxc4',
      prompt: 'Your move.',
      hint: 'dxc4.',
      correctFeedback: 'dxc4.',
      wrongFeedback: 'dxc4.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_Bxc4,
      text: 'Bxc4.',
      autoAdvance: 800,
      highlightSquares: ['d3', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_a3_after_Bxc4,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },

    // -- OUTRO --
    {
      type: 'instruction',
      fen: FEN.dev_a3_after_c5,
      text: "When White plays 6.a3 early, you trade the bishop, grab the c4 pawn, and attack d4 with c5. Clean and effective.",
    },
  ],
}


// ===============================================================
// ni-test-2: LEVEL 2 TEST
// Main line recall + all 3 deviations
// ===============================================================

const NI_TEST_2: OpeningLesson = {
  id: 'ni-test-2',
  title: 'Level 2 Test',
  defaultOrientation: 'black',
  steps: [
    // -- PART 1: MAIN LINE RECALL --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Time to prove you know everything. Play the full main line, then handle every deviation.",
    },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3.', autoAdvance: 800, highlightSquares: ['e2', 'e3'] },
    { type: 'play-move', fen: FEN.after_e3, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_a3, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.after_a3, correctMove: 'Bxc3', prompt: 'Your move.', hint: 'Bxc3.', correctFeedback: 'Bxc3.', wrongFeedback: 'Bxc3.' },
    { type: 'instruction', fen: FEN.after_bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.after_bxc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.after_a4, text: 'a4.', autoAdvance: 800, highlightSquares: ['a3', 'a4'] },
    { type: 'play-move', fen: FEN.after_a4, correctMove: 'Re8', prompt: 'Your move.', hint: 'Re8.', correctFeedback: 'Re8.', wrongFeedback: 'Re8.' },
    { type: 'instruction', fen: FEN.after_Ba3, text: 'Ba3.', autoAdvance: 800, highlightSquares: ['c1', 'a3'] },
    { type: 'play-move', fen: FEN.after_Ba3, correctMove: 'c4', prompt: 'Your move.', hint: 'c4.', correctFeedback: 'c4.', wrongFeedback: 'c4.' },

    // -- PART 2: DEVIATION HANDLING --
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Main line done. Now handle the deviations.",
    },

    // Deviation 1: 4.f3
    { type: 'instruction', fen: FEN.dev_f3_after_f3, text: 'White plays 4.f3 instead of 4.e3.', autoAdvance: 1200, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.dev_f3_after_f3, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.dev_f3_after_a3, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.dev_f3_after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.dev_f3_after_bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.dev_f3_after_bxc3, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },

    // Deviation 2: 5.Bd2
    { type: 'instruction', fen: FEN.dev_Bd2_after_Bd2, text: 'White plays 5.Bd2 instead of 5.Bd3.', autoAdvance: 1200, highlightSquares: ['c1', 'd2'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Bd2, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_Nf3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },
    { type: 'instruction', fen: FEN.dev_Bd2_after_cxd5, text: 'cxd5.', autoAdvance: 800, highlightSquares: ['c4', 'd5'] },
    { type: 'play-move', fen: FEN.dev_Bd2_after_cxd5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5.', wrongFeedback: 'exd5.' },

    // Deviation 3: 6.a3
    { type: 'instruction', fen: FEN.dev_a3_after_a3, text: 'White plays 6.a3 instead of 6.Nf3.', autoAdvance: 1200, highlightSquares: ['a2', 'a3'] },
    { type: 'play-move', fen: FEN.dev_a3_after_a3, correctMove: 'Bxc3+', prompt: 'Your move.', hint: 'Bxc3+.', correctFeedback: 'Bxc3+.', wrongFeedback: 'Bxc3+.' },
    { type: 'instruction', fen: FEN.dev_a3_after_bxc3, text: 'bxc3.', autoAdvance: 800, highlightSquares: ['b2', 'c3'] },
    { type: 'play-move', fen: FEN.dev_a3_after_bxc3, correctMove: 'dxc4', prompt: 'Your move.', hint: 'dxc4.', correctFeedback: 'dxc4.', wrongFeedback: 'dxc4.' },
    { type: 'instruction', fen: FEN.dev_a3_after_Bxc4, text: 'Bxc4.', autoAdvance: 800, highlightSquares: ['d3', 'c4'] },
    { type: 'play-move', fen: FEN.dev_a3_after_Bxc4, correctMove: 'c5', prompt: 'Your move.', hint: 'c5.', correctFeedback: 'c5.', wrongFeedback: 'c5.' },
  ],
}


// ===============================================================
// LESSON LOOKUP
// ===============================================================

const NIMZO_INDIAN_LESSONS: Record<string, OpeningLesson> = {
  'ni-1': NI_1,
  'ni-2': NI_2,
  'ni-3': NI_3,
  'ni-test-1': NI_TEST_1,
  'ni-dev-f3': NI_DEV_F3,
  'ni-dev-Bd2': NI_DEV_BD2,
  'ni-dev-a3': NI_DEV_A3,
  'ni-test-2': NI_TEST_2,
}

export function getNimzoIndianLesson(id: string): OpeningLesson | undefined {
  return NIMZO_INDIAN_LESSONS[id]
}
