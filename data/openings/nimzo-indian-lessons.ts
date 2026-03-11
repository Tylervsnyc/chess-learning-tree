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
// LESSON LOOKUP
// ===============================================================

const NIMZO_INDIAN_LESSONS: Record<string, OpeningLesson> = {
  'ni-1': NI_1,
  'ni-2': NI_2,
  'ni-3': NI_3,
  'ni-test-1': NI_TEST_1,
}

export function getNimzoIndianLesson(id: string): OpeningLesson | undefined {
  return NIMZO_INDIAN_LESSONS[id]
}
