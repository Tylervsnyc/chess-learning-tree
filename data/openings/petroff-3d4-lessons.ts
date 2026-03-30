import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PETROFF DEFENSE — 3.d4 VARIATION LESSONS
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 e5 2.Nf3 Nf6 3.d4
// Main line: 3...Nxe4 4.Bd3 d5 5.Nxe5 Nd7 6.Nxd7 Bxd7
//            7.O-O Bd6 8.c4 c6 9.cxd5 cxd5
//            10.Nc3 Nxc3 11.bxc3 O-O 12.Qh5 g6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:         'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:     'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nf6:     'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_d4:      'rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3',
  after_Nxe4:    'rnbqkb1r/pppp1ppp/8/4p3/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  after_Bd3:     'rnbqkb1r/pppp1ppp/8/4p3/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4',
  after_d5:      'rnbqkb1r/ppp2ppp/8/3pp3/3Pn3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  after_Nxe5:    'rnbqkb1r/ppp2ppp/8/3pN3/3Pn3/3B4/PPP2PPP/RNBQK2R b KQkq - 0 5',
  after_Nd7:     'r1bqkb1r/pppn1ppp/8/3pN3/3Pn3/3B4/PPP2PPP/RNBQK2R w KQkq - 1 6',
  after_Nxd7:    'r1bqkb1r/pppN1ppp/8/3p4/3Pn3/3B4/PPP2PPP/RNBQK2R b KQkq - 0 6',
  after_Bxd7:    'r2qkb1r/pppb1ppp/8/3p4/3Pn3/3B4/PPP2PPP/RNBQK2R w KQkq - 0 7',
  after_OO_w:    'r2qkb1r/pppb1ppp/8/3p4/3Pn3/3B4/PPP2PPP/RNBQ1RK1 b kq - 1 7',
  after_Bd6:     'r2qk2r/pppb1ppp/3b4/3p4/3Pn3/3B4/PPP2PPP/RNBQ1RK1 w kq - 2 8',
  after_c4:      'r2qk2r/pppb1ppp/3b4/3p4/2PPn3/3B4/PP3PPP/RNBQ1RK1 b kq - 0 8',
  after_c6:      'r2qk2r/pp1b1ppp/2pb4/3p4/2PPn3/3B4/PP3PPP/RNBQ1RK1 w kq - 0 9',
  after_cxd5_w:  'r2qk2r/pp1b1ppp/2pb4/3P4/3Pn3/3B4/PP3PPP/RNBQ1RK1 b kq - 0 9',
  after_cxd5_b:  'r2qk2r/pp1b1ppp/3b4/3p4/3Pn3/3B4/PP3PPP/RNBQ1RK1 w kq - 0 10',
  after_Nc3:     'r2qk2r/pp1b1ppp/3b4/3p4/3Pn3/2NB4/PP3PPP/R1BQ1RK1 b kq - 1 10',
  after_Nxc3:    'r2qk2r/pp1b1ppp/3b4/3p4/3P4/2nB4/PP3PPP/R1BQ1RK1 w kq - 0 11',
  after_bxc3:    'r2qk2r/pp1b1ppp/3b4/3p4/3P4/2PB4/P4PPP/R1BQ1RK1 b kq - 0 11',
  after_OO_b:    'r2q1rk1/pp1b1ppp/3b4/3p4/3P4/2PB4/P4PPP/R1BQ1RK1 w - - 1 12',
  after_Qh5:     'r2q1rk1/pp1b1ppp/3b4/3p3Q/3P4/2PB4/P4PPP/R1B2RK1 b - - 2 12',
  after_g6:      'r2q1rk1/pp1b1p1p/3b2p1/3p3Q/3P4/2PB4/P4PPP/R1B2RK1 w - - 0 13',

  // Deviation: 4.dxe5 (instead of 4.Bd3)
  dev4dxe5_after_dxe5:  'rnbqkb1r/pppp1ppp/8/4P3/4n3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  dev4dxe5_after_d5:    'rnbqkb1r/ppp2ppp/8/3pP3/4n3/5N2/PPP2PPP/RNBQKB1R w KQkq d6 0 5',
  dev4dxe5_after_Nbd2:  'rnbqkb1r/ppp2ppp/8/3pP3/4n3/5N2/PPPN1PPP/R1BQKB1R b KQkq - 1 5',
  dev4dxe5_after_Nxd2:  'rnbqkb1r/ppp2ppp/8/3pP3/8/5N2/PPPn1PPP/R1BQKB1R w KQkq - 0 6',
  dev4dxe5_after_Bxd2:  'rnbqkb1r/ppp2ppp/8/3pP3/8/5N2/PPPB1PPP/R2QKB1R b KQkq - 0 6',
  dev4dxe5_after_Be7:   'rnbqk2r/ppp1bppp/8/3pP3/8/5N2/PPPB1PPP/R2QKB1R w KQkq - 1 7',

  // Deviation: 5.dxe5 (instead of 5.Nxe5)
  dev5dxe5_after_dxe5:  'rnbqkb1r/ppp2ppp/8/3pP3/4n3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 0 5',
  dev5dxe5_after_Nc5:   'rnbqkb1r/ppp2ppp/8/2npP3/8/3B1N2/PPP2PPP/RNBQK2R w KQkq - 1 6',
  dev5dxe5_after_Be2:   'rnbqkb1r/ppp2ppp/8/2npP3/8/5N2/PPP1BPPP/RNBQK2R b KQkq - 2 6',
  dev5dxe5_after_Be7:   'rnbqk2r/ppp1bppp/8/2npP3/8/5N2/PPP1BPPP/RNBQK2R w KQkq - 3 7',
  dev5dxe5_after_OO_w:  'rnbqk2r/ppp1bppp/8/2npP3/8/5N2/PPP1BPPP/RNBQ1RK1 b kq - 4 7',
  dev5dxe5_after_OO_b:  'rnbq1rk1/ppp1bppp/8/2npP3/8/5N2/PPP1BPPP/RNBQ1RK1 w - - 5 8',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: Grab the Pawn (e5, Nf6, Nxe4)
// ═══════════════════════════════════════════════════════════

const P3_LESSON_1: OpeningLesson = {
  id: 'p3-1',
  title: 'Grab the Pawn',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.start,
      text: "White plays 3.d4 in the Petroff — let's learn how to grab a free pawn and start the fight.",
    },

    // PREDICT 1: 1...e5
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White opens with e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'What would you play here?',
      hint: 'Match White in the center — push your e-pawn two squares.',
      correctFeedback: 'You stake a claim in the center right away.',
      wrongFeedback: 'Try pushing your e-pawn to e5 to match White in the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "e5 mirrors White's pawn and fights for the center immediately.",
      arrow: ['e7', 'e5'],
    },

    // PREDICT 2: 2...Nf6
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White develops the knight to f3, attacking your e5 pawn.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your turn — find the right move.',
      hint: "Counter-attack White's e4 pawn with your knight.",
      correctFeedback: "You hit White's e4 pawn right back — that's the Petroff idea.",
      wrongFeedback: "Bring your knight to f6 to attack White's e4 pawn.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 is the Petroff Defense — instead of defending e5, you counter-attack White's e4 pawn.",
      arrow: ['g8', 'f6'],
    },

    // PREDICT 3: 3...Nxe4
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White pushes d4, challenging the center and attacking your e5 pawn.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: "White left e4 undefended — what do you do?",
      hint: 'Your knight on f6 can grab the free pawn on e4.',
      correctFeedback: 'Free pawn! Your knight takes on e4 while e5 is still safe.',
      wrongFeedback: 'Capture the free pawn on e4 with your knight.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Nxe4 wins a pawn. White can't take your e5 pawn yet because the d4 pawn is still blocked.",
      arrow: ['f6', 'e4'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'Now play all three moves from memory.',
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Nice — you've grabbed the e4 pawn. Now it's time to build a solid center.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: Solid Center (d5, Nd7, Bxd7)
// ═══════════════════════════════════════════════════════════

const P3_LESSON_2: OpeningLesson = {
  id: 'p3-2',
  title: 'Solid Center',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Your knight is on e4 with an extra pawn. Let's build a strong center and develop smoothly.",
    },

    // RECAP
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Let's see what you remember!",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // PREDICT 1: 4...d5
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White develops the bishop to d3, targeting your knight on e4.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'd5',
      prompt: "White's bishop is staring at your knight. What's the plan?",
      hint: 'Push a pawn to support your knight and claim the center.',
      correctFeedback: 'd5 supports your knight and grabs central space.',
      wrongFeedback: 'Push d5 to support the knight on e4 and control the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5 gives your knight a safe base and builds a strong pawn center.',
      arrow: ['d7', 'd5'],
    },

    // PREDICT 2: 5...Nd7
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "White's knight jumps to e5 — a strong outpost in your territory.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'Nd7',
      prompt: "White's knight is on e5. How do you challenge it?",
      hint: 'Bring your other knight out to attack the intruder.',
      correctFeedback: "Nd7 challenges White's knight and prepares to trade it off.",
      wrongFeedback: 'Develop Nd7 to challenge the knight sitting on e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'Nd7 attacks the e5 knight. White will usually trade, which helps you develop.',
      arrow: ['b8', 'd7'],
    },

    // PREDICT 3: 6...Bxd7
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White trades knights — Nxd7.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd7,
      correctMove: 'Bxd7',
      prompt: 'How do you recapture on d7?',
      hint: 'Take back with the piece that develops — your bishop.',
      correctFeedback: 'Bxd7 develops the bishop while recapturing.',
      wrongFeedback: 'Recapture with the bishop — Bxd7 develops a piece for free.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: 'Bxd7 recaptures and develops your light-squared bishop in one move.',
      arrow: ['c8', 'd7'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'Now play all three moves from memory.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays Bd3.',
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
      fen: FEN.after_d5,
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White plays Nxd7.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd7,
      correctMove: 'Bxd7',
      prompt: 'Your move.',
      hint: 'Bxd7.',
      correctFeedback: 'Bxd7.',
      wrongFeedback: 'Bxd7.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: "Solid — you've built a strong center and developed your bishop. Time to get your king safe.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// DEVIATION: After 4.dxe5 (instead of 4.Bd3)
// Black plays: d5, Nxd2, Be7
// ═══════════════════════════════════════════════════════════

const P3_DEV_DXE5_4: OpeningLesson = {
  id: 'p3-dev-dxe5-4',
  title: 'After 4.dxe5',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Sometimes White plays 4.dxe5 instead of 4.Bd3. Here's how to handle it.",
    },

    // RECAP to deviation point
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Prove you know these moves!",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // DEVIATION SETUP
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays dxe5 instead of Bd3 — pushing the pawn forward.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'e5'],
    },

    // PREDICT 1: 4...d5
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_dxe5,
      correctMove: 'd5',
      prompt: "White pushed dxe5. What's your best response?",
      hint: 'Secure your knight with a central pawn push.',
      correctFeedback: 'd5 supports your knight on e4 and grabs the center.',
      wrongFeedback: 'Push d5 to support your knight and claim central space.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_d5,
      text: "d5 is the key move — your knight on e4 is safe and you've built a strong center.",
      arrow: ['d7', 'd5'],
    },

    // PREDICT 2: 5...Nxd2
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_d5,
      text: 'White plays Nbd2, challenging your knight on e4.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_Nbd2,
      correctMove: 'Nxd2',
      prompt: "White's knight is on d2. What do you do?",
      hint: 'Trade off the knights — your knight captures on d2.',
      correctFeedback: 'Nxd2 simplifies the position and keeps things equal.',
      wrongFeedback: 'Capture the knight on d2 with Nxd2.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_Nxd2,
      text: 'Trading knights simplifies the game — exactly what you want with your solid d5 pawn.',
      arrow: ['e4', 'd2'],
    },

    // PREDICT 3: 6...Be7
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_Nxd2,
      text: 'White recaptures with the bishop — Bxd2.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_Bxd2,
      correctMove: 'Be7',
      prompt: "Time to develop. Where does the bishop go?",
      hint: 'Put the bishop on a safe, natural square — e7 is solid.',
      correctFeedback: 'Be7 develops the bishop and prepares to castle kingside.',
      wrongFeedback: 'Play Be7 to develop and prepare castling.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_Be7,
      text: "Be7 is simple and effective — your bishop is developed and you're ready to castle.",
      arrow: ['f8', 'e7'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'Now play all three moves from memory.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays dxe5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_dxe5,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_d5,
      text: 'White plays Nbd2.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_Nbd2,
      correctMove: 'Nxd2',
      prompt: 'Your move.',
      hint: 'Nxd2.',
      correctFeedback: 'Nxd2.',
      wrongFeedback: 'Nxd2.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_Nxd2,
      text: 'White plays Bxd2.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_Bxd2,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_Be7,
      text: "Good — against 4.dxe5 you stay solid with d5 and develop naturally. No problems at all.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// DEVIATION: After 5.dxe5 (instead of 5.Nxe5)
// Black plays: Nc5, Be7, O-O
// ═══════════════════════════════════════════════════════════

const P3_DEV_DXE5_5: OpeningLesson = {
  id: 'p3-dev-dxe5-5',
  title: 'After 5.dxe5',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "After 4.Bd3 d5, White sometimes plays 5.dxe5 instead of 5.Nxe5. Let's see how to respond.",
    },

    // RECAP to deviation point
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'Quick review before the new stuff.',
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays Bd3.',
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

    // DEVIATION SETUP
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'White plays dxe5 instead of Nxe5 — pushing the pawn forward.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'e5'],
    },

    // PREDICT 1: 5...Nc5
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_dxe5,
      correctMove: 'Nc5',
      prompt: "White pushed dxe5. Where does your knight go now?",
      hint: "Your knight needs a new square — hop to c5, attacking White's bishop.",
      correctFeedback: "Nc5 attacks White's bishop on d3 and finds a great square.",
      wrongFeedback: "Move the knight to c5 where it attacks White's bishop on d3.",
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Nc5,
      text: "Nc5 is the star move — your knight attacks the d3 bishop and sits on a strong outpost.",
      arrow: ['e4', 'c5'],
    },

    // PREDICT 2: 6...Be7
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Nc5,
      text: "White retreats the bishop to e2, away from your knight's attack.",
      autoAdvance: 800,
      highlightSquares: ['d3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_Be2,
      correctMove: 'Be7',
      prompt: 'How do you continue developing?',
      hint: 'Develop the bishop to prepare for castling.',
      correctFeedback: 'Be7 develops smoothly and prepares to castle kingside.',
      wrongFeedback: 'Play Be7 to develop the bishop and get ready to castle.',
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Be7,
      text: "Be7 is natural and solid — you're one move away from castling.",
      arrow: ['f8', 'e7'],
    },

    // PREDICT 3: 7...O-O
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Be7,
      text: 'White castles kingside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_OO_w,
      correctMove: 'O-O',
      prompt: 'White just castled. What should you do?',
      hint: 'Get your king to safety too!',
      correctFeedback: "Castled! Your king is safe and your rook joins the fight.",
      wrongFeedback: 'Castle kingside to get your king to safety.',
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_OO_b,
      text: "Both sides have castled. You're fully developed with a solid position — well played.",
      arrow: ['e8', 'g8'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'Now play all three moves from memory.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'White plays dxe5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_dxe5,
      correctMove: 'Nc5',
      prompt: 'Your move.',
      hint: 'Nc5.',
      correctFeedback: 'Nc5.',
      wrongFeedback: 'Nc5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Nc5,
      text: 'White plays Be2.',
      autoAdvance: 800,
      highlightSquares: ['d3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_Be2,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Be7,
      text: 'White castles.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_OO_w,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_OO_b,
      text: "Against 5.dxe5, your knight hops to c5 and you develop comfortably. Easy equality.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Develop and Fortify (Bd6, c6, cxd5)
// ═══════════════════════════════════════════════════════════

const P3_LESSON_3: OpeningLesson = {
  id: 'p3-3',
  title: 'Develop and Fortify',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: "Your bishop is on d7 and your knight is still on e4. Let's develop the dark-squared bishop and shore up the center.",
    },

    // RECAP
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'Show me you\'ve got this.',
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays Bd3.',
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
      fen: FEN.after_d5,
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White plays Nxd7.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd7,
      correctMove: 'Bxd7',
      prompt: 'Your move.',
      hint: 'Bxd7.',
      correctFeedback: 'Bxd7.',
      wrongFeedback: 'Bxd7.',
    },

    // PREDICT 1: 7...Bd6
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: 'White castles kingside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bd6',
      prompt: 'Time to develop your last minor piece. Where should it go?',
      hint: 'Put the bishop on an active diagonal — d6 controls key squares.',
      correctFeedback: 'Bd6 is a strong diagonal. The bishop eyes the kingside.',
      wrongFeedback: 'Develop the bishop to d6 where it controls the a3-f8 diagonal.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: 'Bd6 develops your last minor piece and points toward the kingside.',
      arrow: ['f8', 'd6'],
    },

    // PREDICT 2: 8...c6
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: 'White pushes c4, attacking your d5 pawn.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'c6',
      prompt: "White is attacking your d5 pawn. How do you defend it?",
      hint: 'Support d5 with a pawn from c7.',
      correctFeedback: 'c6 reinforces your d5 pawn — the center holds firm.',
      wrongFeedback: 'Play c6 to shore up the d5 pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6 creates a sturdy pawn chain. Your center is rock-solid.',
      arrow: ['c7', 'c6'],
    },

    // PREDICT 3: 9...cxd5
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'White captures — cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'cxd5',
      prompt: 'White just took on d5. How do you recapture?',
      hint: 'Take back with the c-pawn to keep your center intact.',
      correctFeedback: 'cxd5 keeps a strong pawn in the center.',
      wrongFeedback: 'Recapture with cxd5 to maintain your central pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: 'cxd5 keeps your central pawn on d5. The position is solid and balanced.',
      arrow: ['c6', 'd5'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: 'Now play all three moves from memory.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: 'White castles.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: 'White plays c4.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'White plays cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: "All your pieces are developed and the center is locked down. Almost there!",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: Trade and Castle (Nxc3, O-O, g6)
// ═══════════════════════════════════════════════════════════

const P3_LESSON_4: OpeningLesson = {
  id: 'p3-4',
  title: 'Trade and Castle',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: "The center pawns are set. Let's trade the knights, castle, and handle White's queen attack.",
    },

    // RECAP
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'Quick review before the new stuff.',
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays Bd3.',
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
      fen: FEN.after_d5,
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White plays Nxd7.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd7,
      correctMove: 'Bxd7',
      prompt: 'Your move.',
      hint: 'Bxd7.',
      correctFeedback: 'Bxd7.',
      wrongFeedback: 'Bxd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: 'White castles.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: 'White plays c4.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'White plays cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },

    // PREDICT 1: 10...Nxc3
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: 'White develops the knight to c3, attacking your knight on e4.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nxc3',
      prompt: "White's knight just arrived on c3. What do you do?",
      hint: 'Your knight on e4 can trade — capture on c3.',
      correctFeedback: "Nxc3 trades the knights and damages White's pawn structure.",
      wrongFeedback: 'Capture the knight on c3 — Nxc3 is the best move.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxc3,
      text: "Nxc3 forces White to recapture with the b-pawn, creating doubled pawns on the c-file.",
      arrow: ['e4', 'c3'],
    },

    // PREDICT 2: 11...O-O
    {
      type: 'instruction',
      fen: FEN.after_Nxc3,
      text: 'White recaptures — bxc3, doubling the c-pawns.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'O-O',
      prompt: 'All your pieces are out. What now?',
      hint: 'Time to get the king to safety.',
      correctFeedback: 'Castled! Your king is safe and your rook enters the game.',
      wrongFeedback: 'Castle kingside — your king needs to be safe before the middlegame.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "O-O completes your development. Your king is tucked away safely behind the pawns.",
      arrow: ['e8', 'g8'],
    },

    // PREDICT 3: 12...g6
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: 'White brings the queen to h5, threatening near your king.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qh5,
      correctMove: 'g6',
      prompt: "White's queen is on h5. How do you handle it?",
      hint: 'Push a pawn to kick the queen away from h5.',
      correctFeedback: "g6 deflects the queen — she'll have to move.",
      wrongFeedback: 'Play g6 to drive the queen off h5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "g6 forces the queen to retreat. White's queen sortie was a waste of time.",
      arrow: ['g7', 'g6'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: 'Now play all three moves from memory.',
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: 'White plays Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nxc3',
      prompt: 'Your move.',
      hint: 'Nxc3.',
      correctFeedback: 'Nxc3.',
      wrongFeedback: 'Nxc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxc3,
      text: 'White plays bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: 'White plays Qh5.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qh5,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "You've mastered the full 3.d4 Petroff main line. White's queen attack fizzled and you're standing strong.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LEVEL TEST
// ═══════════════════════════════════════════════════════════

const P3_TEST_1: OpeningLesson = {
  id: 'p3-test-1',
  title: 'Level Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE RECALL ===
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'White plays e4.',
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'e5',
      prompt: 'Your move.',
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'White plays d4.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays Bd3.',
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
      fen: FEN.after_d5,
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White plays Nxd7.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'd7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxd7,
      correctMove: 'Bxd7',
      prompt: 'Your move.',
      hint: 'Bxd7.',
      correctFeedback: 'Bxd7.',
      wrongFeedback: 'Bxd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bxd7,
      text: 'White castles.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bd6',
      prompt: 'Your move.',
      hint: 'Bd6.',
      correctFeedback: 'Bd6.',
      wrongFeedback: 'Bd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd6,
      text: 'White plays c4.',
      autoAdvance: 800,
      highlightSquares: ['c2', 'c4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'c6',
      prompt: 'Your move.',
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'White plays cxd5.',
      autoAdvance: 800,
      highlightSquares: ['c4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5_w,
      correctMove: 'cxd5',
      prompt: 'Your move.',
      hint: 'cxd5.',
      correctFeedback: 'cxd5.',
      wrongFeedback: 'cxd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_cxd5_b,
      text: 'White plays Nc3.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nxc3',
      prompt: 'Your move.',
      hint: 'Nxc3.',
      correctFeedback: 'Nxc3.',
      wrongFeedback: 'Nxc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxc3,
      text: 'White plays bxc3.',
      autoAdvance: 800,
      highlightSquares: ['b2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: 'White plays Qh5.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'h5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qh5,
      correctMove: 'g6',
      prompt: 'Your move.',
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },

    // === DEVIATION 1: 4.dxe5 ===
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White plays dxe5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_dxe5,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_d5,
      text: 'White plays Nbd2.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_Nbd2,
      correctMove: 'Nxd2',
      prompt: 'Your move.',
      hint: 'Nxd2.',
      correctFeedback: 'Nxd2.',
      wrongFeedback: 'Nxd2.',
    },
    {
      type: 'instruction',
      fen: FEN.dev4dxe5_after_Nxd2,
      text: 'White plays Bxd2.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev4dxe5_after_Bxd2,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },

    // === DEVIATION 2: 5.dxe5 ===
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'White plays dxe5.',
      autoAdvance: 800,
      highlightSquares: ['d4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_dxe5,
      correctMove: 'Nc5',
      prompt: 'Your move.',
      hint: 'Nc5.',
      correctFeedback: 'Nc5.',
      wrongFeedback: 'Nc5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Nc5,
      text: 'White plays Be2.',
      autoAdvance: 800,
      highlightSquares: ['d3', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_Be2,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev5dxe5_after_Be7,
      text: 'White castles.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.dev5dxe5_after_OO_w,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LOOKUP
// ═══════════════════════════════════════════════════════════

export function getPetroff3d4Lesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'p3-1': return P3_LESSON_1
    case 'p3-2': return P3_LESSON_2
    case 'p3-dev-dxe5-4': return P3_DEV_DXE5_4
    case 'p3-dev-dxe5-5': return P3_DEV_DXE5_5
    case 'p3-3': return P3_LESSON_3
    case 'p3-4': return P3_LESSON_4
    case 'p3-test-1': return P3_TEST_1
    default: return undefined
  }
}
