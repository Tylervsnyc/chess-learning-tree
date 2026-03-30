import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PETROFF DEFENSE — 5.Nc3 VARIATION LESSONS
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Nc3
// Main line: 5...Nxc3 6.dxc3 Be7 7.Be3 O-O 8.Qd2 Nd7
//            9.O-O-O Nf6 10.Bd3 c5 11.Rhe1 Be6 12.Kb1 Qa5
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:       'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:       'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nf6:      'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Nxe5:     'rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  after_d6:       'rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
  after_Nf3_4:    'rnbqkb1r/ppp2ppp/3p1n2/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 4',
  after_Nxe4:     'rnbqkb1r/ppp2ppp/3p4/8/4n3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 5',
  after_Nc3:      'rnbqkb1r/ppp2ppp/3p4/8/4n3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 5',
  after_Nxc3:     'rnbqkb1r/ppp2ppp/3p4/8/8/2n2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 6',
  after_dxc3:     'rnbqkb1r/ppp2ppp/3p4/8/8/2P2N2/PPP2PPP/R1BQKB1R b KQkq - 0 6',
  after_Be7:      'rnbqk2r/ppp1bppp/3p4/8/8/2P2N2/PPP2PPP/R1BQKB1R w KQkq - 1 7',
  after_Be3:      'rnbqk2r/ppp1bppp/3p4/8/8/2P1BN2/PPP2PPP/R2QKB1R b KQkq - 2 7',
  after_OO:       'rnbq1rk1/ppp1bppp/3p4/8/8/2P1BN2/PPP2PPP/R2QKB1R w KQ - 3 8',
  after_Qd2:      'rnbq1rk1/ppp1bppp/3p4/8/8/2P1BN2/PPPQ1PPP/R3KB1R b KQ - 4 8',
  after_Nd7:      'r1bq1rk1/pppnbppp/3p4/8/8/2P1BN2/PPPQ1PPP/R3KB1R w KQ - 5 9',
  after_OOO:      'r1bq1rk1/pppnbppp/3p4/8/8/2P1BN2/PPPQ1PPP/2KR1B1R b - - 6 9',
  after_Nf6_9:    'r1bq1rk1/ppp1bppp/3p1n2/8/8/2P1BN2/PPPQ1PPP/2KR1B1R w - - 7 10',
  after_Bd3:      'r1bq1rk1/ppp1bppp/3p1n2/8/8/2PBBN2/PPPQ1PPP/2KR3R b - - 8 10',
  after_c5:       'r1bq1rk1/pp2bppp/3p1n2/2p5/8/2PBBN2/PPPQ1PPP/2KR3R w - - 0 11',
  after_Rhe1:     'r1bq1rk1/pp2bppp/3p1n2/2p5/8/2PBBN2/PPPQ1PPP/2KRR3 b - - 1 11',
  after_Be6:      'r2q1rk1/pp2bppp/3pbn2/2p5/8/2PBBN2/PPPQ1PPP/2KRR3 w - - 2 12',
  after_Kb1:      'r2q1rk1/pp2bppp/3pbn2/2p5/8/2PBBN2/PPPQ1PPP/1K1RR3 b - - 3 12',
  after_Qa5:      'r4rk1/pp2bppp/3pbn2/q1p5/8/2PBBN2/PPPQ1PPP/1K1RR3 w - - 4 13',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Petroff Setup (e5, Nf6, d6)
// ═══════════════════════════════════════════════════════════

const P5_LESSON_1: OpeningLesson = {
  id: 'p5-1',
  title: 'The Petroff Setup',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Petroff Defense starts with a counter-attack — let's learn the first three moves.",
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
      hint: 'Match White in the center with your e-pawn.',
      correctFeedback: 'You claim your share of the center right away.',
      wrongFeedback: 'Push your e-pawn to e5 to fight for the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5 stakes out the center and opens lines for your bishop and queen.',
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
      correctFeedback: "Your knight hits e4 — that's the Petroff idea.",
      wrongFeedback: "Bring your knight to f6 to attack White's e4 pawn.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 counter-attacks e4 instead of defending e5 — the hallmark of the Petroff.",
      arrow: ['g8', 'f6'],
    },

    // PREDICT 3: 3...d6
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "White captures your e5 pawn with the knight.",
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'How do you respond?',
      hint: 'Kick the knight off e5 with a pawn push.',
      correctFeedback: "d6 forces White's knight to retreat from e5.",
      wrongFeedback: "Push your d-pawn to d6 to attack White's knight on e5.",
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "d6 attacks the knight on e5 and forces it back — you'll win the pawn back next.",
      arrow: ['d7', 'd6'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play all three moves from memory.",
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
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "The Petroff setup is locked in — White's knight has to retreat.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: Exchange on c3 (Nxe4, Nxc3, Be7)
// ═══════════════════════════════════════════════════════════

const P5_LESSON_2: OpeningLesson = {
  id: 'p5-2',
  title: 'Exchange on c3',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "White retreats the knight. Now you grab the e4 pawn and trade on c3.",
    },

    // RECAP (lesson 1 moves: e5, Nf6, d6)
    {
      type: 'instruction',
      fen: FEN.after_d6,
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
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },

    // PREDICT 1: 4...Nxe4
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "White's knight retreats to f3.",
      autoAdvance: 800,
      highlightSquares: ['e5', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_4,
      correctMove: 'Nxe4',
      prompt: 'What would you play here?',
      hint: "White's e4 pawn is undefended — grab it with your knight.",
      correctFeedback: 'You win the pawn back and place your knight right in the center.',
      wrongFeedback: 'Capture the e4 pawn with your knight — it has no defenders.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'Nxe4 recaptures the pawn you gave up on move 3 — material is equal again.',
      arrow: ['f6', 'e4'],
    },

    // PREDICT 2: 5...Nxc3
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: 'White develops the knight to c3, challenging your knight on e4.',
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Nxc3',
      prompt: 'Your turn — find the right move.',
      hint: 'Trade the knights — your knight on e4 can capture on c3.',
      correctFeedback: 'Clean trade — and White has to recapture with a pawn, doubling on c3.',
      wrongFeedback: 'Capture the knight on c3 with your knight from e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxc3,
      text: "Nxc3 forces White to recapture with the d-pawn, doubling their c-pawns.",
      arrow: ['e4', 'c3'],
    },

    // PREDICT 3: 6...Be7
    {
      type: 'instruction',
      fen: FEN.after_Nxc3,
      text: 'White recaptures with dxc3.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Be7',
      prompt: 'How do you continue developing?',
      hint: 'Develop your dark-squared bishop to a calm, solid square.',
      correctFeedback: 'Be7 develops the bishop and prepares to castle kingside.',
      wrongFeedback: 'Place your bishop on e7 — a solid developing move before castling.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Be7 is quiet but strong — it clears the back rank for castling.",
      arrow: ['f8', 'e7'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "White's knight returns to f3.",
      autoAdvance: 800,
      highlightSquares: ['e5', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
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
      text: 'White plays dxc3.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Knights are traded, pawns are doubled, and you're ready to castle.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Castle and Reroute (O-O, Nd7, Nf6)
// ═══════════════════════════════════════════════════════════

const P5_LESSON_3: OpeningLesson = {
  id: 'p5-3',
  title: 'Castle and Reroute',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Time to castle and redeploy your knight to a better square.",
    },

    // RECAP (lessons 1-2: e5, Nf6, d6, Nxe4, Nxc3, Be7)
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Quick review before the new stuff.",
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
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
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
      text: 'White plays dxc3.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },

    // PREDICT 1: 7...O-O
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: 'White develops the bishop to e3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'O-O',
      prompt: 'What would you play here?',
      hint: 'Your king is in the center — get it to safety.',
      correctFeedback: 'Castling tucks your king away and connects your rooks.',
      wrongFeedback: 'Castle kingside — your king needs to be safe before the middlegame.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "O-O gets the king safe. White is preparing to castle queenside, so you want your king settled first.",
      arrow: ['e8', 'g8'],
    },

    // PREDICT 2: 8...Nd7
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: 'White brings the queen to d2.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'Nd7',
      prompt: 'Your turn — find the right move.',
      hint: 'Develop your last minor piece — bring the knight out.',
      correctFeedback: 'Nd7 develops the knight and prepares to reroute it to f6.',
      wrongFeedback: 'Bring your knight from b8 to d7 — it needs to get into the game.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 gets the knight off the back rank. From d7 it can jump to f6, controlling key central squares.",
      arrow: ['b8', 'd7'],
    },

    // PREDICT 3: 9...Nf6
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White castles queenside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Nf6',
      prompt: 'Where does the knight go next?',
      hint: 'The knight on d7 wants a better square — think about controlling the center.',
      correctFeedback: 'Nf6 lands the knight on its best square, guarding d5 and e4.',
      wrongFeedback: 'Move the knight from d7 to f6 — a much more active post.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: "Nf6 is the knight's ideal square — it controls d5 and e4, two critical central squares.",
      arrow: ['d7', 'f6'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: 'White plays Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: 'White plays Qd2.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White castles queenside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: "You're castled, developed, and ready to fight for the center.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: Central Counterplay (c5, Be6, Qa5)
// ═══════════════════════════════════════════════════════════

const P5_LESSON_4: OpeningLesson = {
  id: 'p5-4',
  title: 'Central Counterplay',
  defaultOrientation: 'black',
  steps: [
    // INTRO
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: "You're fully developed. Time to create counterplay against White's doubled c-pawns.",
    },

    // RECAP (lessons 1-3: e5, Nf6, d6, Nxe4, Nxc3, Be7, O-O, Nd7, Nf6)
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: "Show me you've got this.",
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
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
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
      text: 'White plays dxc3.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: 'White plays Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: 'White plays Qd2.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White castles queenside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },

    // PREDICT 1: 10...c5
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: 'White develops the bishop to d3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'c5',
      prompt: 'What would you play here?',
      hint: "Strike at the center — White's doubled c-pawns are a target.",
      correctFeedback: "c5 challenges the center and puts pressure on White's pawn structure.",
      wrongFeedback: "Push your c-pawn to c5 to attack White's center.",
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: "c5 attacks the center and highlights White's weak doubled c-pawns.",
      arrow: ['c7', 'c5'],
    },

    // PREDICT 2: 11...Be6
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: 'White brings the rook to e1.',
      autoAdvance: 800,
      highlightSquares: ['h1', 'e1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Rhe1,
      correctMove: 'Be6',
      prompt: 'Your turn — find the right move.',
      hint: 'Your light-squared bishop is still on its starting square. Develop it.',
      correctFeedback: 'Be6 develops the last minor piece and controls the d5 square.',
      wrongFeedback: 'Bring your bishop from c8 to e6 — it needs to enter the game.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "Be6 completes your development. The bishop supports d5 and eyes the a2 pawn.",
      arrow: ['c8', 'e6'],
    },

    // PREDICT 3: 12...Qa5
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: 'White tucks the king to b1.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'b1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kb1,
      correctMove: 'Qa5',
      prompt: 'Where does your queen belong?',
      hint: 'Put the queen on the a-file where it eyes the weak c3 pawn.',
      correctFeedback: 'Qa5 targets the c3 pawn and creates counterplay on the queenside.',
      wrongFeedback: 'Place the queen on a5 — it attacks the doubled c3 pawn.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "Qa5 puts direct pressure on the c3 pawn. White's doubled pawns are a lasting weakness.",
      arrow: ['d8', 'a5'],
    },

    // RECALL
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: "Now play all three moves from memory.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: 'White plays Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: 'White plays Rhe1.',
      autoAdvance: 800,
      highlightSquares: ['h1', 'e1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Rhe1,
      correctMove: 'Be6',
      prompt: 'Your move.',
      hint: 'Be6.',
      correctFeedback: 'Be6.',
      wrongFeedback: 'Be6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: 'White plays Kb1.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'b1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kb1,
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },

    // OUTRO
    {
      type: 'instruction',
      fen: FEN.after_Qa5,
      text: "You know the whole 5.Nc3 Petroff — fully developed with queenside pressure.",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LEVEL TEST: Main line recall (no deviations)
// ═══════════════════════════════════════════════════════════

const P5_TEST_1: OpeningLesson = {
  id: 'p5-test-1',
  title: 'Level Test',
  defaultOrientation: 'black',
  steps: [
    // Main line: e5, Nf6, d6, Nxe4, Nxc3, Be7, O-O, Nd7, Nf6, c5, Be6, Qa5
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
      text: 'White plays Nxe5.',
      autoAdvance: 800,
      highlightSquares: ['f3', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: 'White plays Nf3.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
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
      text: 'White plays dxc3.',
      autoAdvance: 800,
      highlightSquares: ['d2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be7,
      text: 'White plays Be3.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: 'White plays Qd2.',
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: 'White castles queenside.',
      autoAdvance: 800,
      highlightSquares: ['e1', 'c1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OOO,
      correctMove: 'Nf6',
      prompt: 'Your move.',
      hint: 'Nf6.',
      correctFeedback: 'Nf6.',
      wrongFeedback: 'Nf6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6_9,
      text: 'White plays Bd3.',
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'c5',
      prompt: 'Your move.',
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c5,
      text: 'White plays Rhe1.',
      autoAdvance: 800,
      highlightSquares: ['h1', 'e1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Rhe1,
      correctMove: 'Be6',
      prompt: 'Your move.',
      hint: 'Be6.',
      correctFeedback: 'Be6.',
      wrongFeedback: 'Be6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: 'White plays Kb1.',
      autoAdvance: 800,
      highlightSquares: ['c1', 'b1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kb1,
      correctMove: 'Qa5',
      prompt: 'Your move.',
      hint: 'Qa5.',
      correctFeedback: 'Qa5.',
      wrongFeedback: 'Qa5.',
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LOOKUP
// ═══════════════════════════════════════════════════════════

export function getPetroff5nc3Lesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'p5-1': return P5_LESSON_1
    case 'p5-2': return P5_LESSON_2
    case 'p5-3': return P5_LESSON_3
    case 'p5-4': return P5_LESSON_4
    case 'p5-test-1': return P5_TEST_1
    default: return undefined
  }
}
