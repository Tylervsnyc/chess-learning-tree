import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PIRC 150 ATTACK LESSONS (p1a-1 through p1a-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 c6 5.Qd2 b5 6.Bd3 Nbd7
//            7.Nf3 e5 8.O-O Bg7 9.Bh6 O-O
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  // After each main-line move
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d6:    'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_Nf6:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3',
  after_Nc3:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3',
  after_g6:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_Be3:   'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq - 1 4',
  after_c6:    'rnbqkb1r/pp2pp1p/2pp1np1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR w KQkq - 0 5',
  after_Qd2:   'rnbqkb1r/pp2pp1p/2pp1np1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq - 1 5',
  after_b5:    'rnbqkb1r/p3pp1p/2pp1np1/1p6/3PP3/2N1B3/PPPQ1PPP/R3KBNR w KQkq - 0 6',
  after_Bd3:   'rnbqkb1r/p3pp1p/2pp1np1/1p6/3PP3/2NBB3/PPPQ1PPP/R3K1NR b KQkq - 1 6',
  after_Nbd7:  'r1bqkb1r/p2npp1p/2pp1np1/1p6/3PP3/2NBB3/PPPQ1PPP/R3K1NR w KQkq - 2 7',
  after_Nf3:   'r1bqkb1r/p2npp1p/2pp1np1/1p6/3PP3/2NBBN2/PPPQ1PPP/R3K2R b KQkq - 3 7',
  after_e5:    'r1bqkb1r/p2n1p1p/2pp1np1/1p2p3/3PP3/2NBBN2/PPPQ1PPP/R3K2R w KQkq - 0 8',
  after_OO_w:  'r1bqkb1r/p2n1p1p/2pp1np1/1p2p3/3PP3/2NBBN2/PPPQ1PPP/R4RK1 b kq - 1 8',
  after_Bg7:   'r1bqk2r/p2n1pbp/2pp1np1/1p2p3/3PP3/2NBBN2/PPPQ1PPP/R4RK1 w kq - 2 9',
  after_Bh6:   'r1bqk2r/p2n1pbp/2pp1npB/1p2p3/3PP3/2NB1N2/PPPQ1PPP/R4RK1 b kq - 3 9',
  after_OO_b:  'r1bq1rk1/p2n1pbp/2pp1npB/1p2p3/3PP3/2NB1N2/PPPQ1PPP/R4RK1 w - - 4 10',

  // Deviation: 5.f3 b5 6.Qd2 Nbd7 7.g4 Nb6
  dev_f3_after_f3:    'rnbqkb1r/pp2pp1p/2pp1np1/8/3PP3/2N1BP2/PPP3PP/R2QKBNR b KQkq - 0 5',
  dev_f3_after_b5:    'rnbqkb1r/p3pp1p/2pp1np1/1p6/3PP3/2N1BP2/PPP3PP/R2QKBNR w KQkq - 0 6',
  dev_f3_after_Qd2:   'rnbqkb1r/p3pp1p/2pp1np1/1p6/3PP3/2N1BP2/PPPQ2PP/R3KBNR b KQkq - 1 6',
  dev_f3_after_Nbd7:  'r1bqkb1r/p2npp1p/2pp1np1/1p6/3PP3/2N1BP2/PPPQ2PP/R3KBNR w KQkq - 2 7',
  dev_f3_after_g4:    'r1bqkb1r/p2npp1p/2pp1np1/1p6/3PP1P1/2N1BP2/PPPQ3P/R3KBNR b KQkq - 0 7',
  dev_f3_after_Nb6:   'r1bqkb1r/p3pp1p/1npp1np1/1p6/3PP1P1/2N1BP2/PPPQ3P/R3KBNR w KQkq - 1 8',
}


// ═══════════════════════════════════════════════════════════
// p1a-1: THE PIRC SETUP (1.e4 d6 2.d4 Nf6 3.Nc3 g6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const P1A_1: OpeningLesson = {
  id: 'p1a-1',
  title: 'The Pirc Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The 150 Attack — White develops Be3 and Qd2 for a quiet but dangerous setup. You'll build the Pirc triangle: d6, Nf6, g6.",
    },

    // ── PREDICT/REVEAL 1: d6 ──
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
      correctMove: 'd6',
      prompt: "White opens with e4. Start the Pirc Defense.",
      hint: 'Push d6 — you want a flexible pawn structure, not a direct fight yet.',
      correctFeedback: 'd6 keeps things flexible — develop pieces before committing pawns.',
      wrongFeedback: 'The Pirc starts with d6 — a patient, flexible setup.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "d6 opens the diagonal for your dark-squared bishop and keeps the center flexible.",
      arrow: ['d7', 'd6'],
    },

    // ── PREDICT/REVEAL 2: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4, grabbing more space in the center.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "White has two pawns in the center. How do you put pressure on e4?",
      hint: 'Develop a knight to attack the e4 pawn.',
      correctFeedback: 'Nf6 develops with tempo, putting pressure on e4.',
      wrongFeedback: 'Play Nf6 — develop the knight and hit e4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6 attacks e4 and develops a piece — the Pirc strategy is to develop first, fight later.",
      arrow: ['g8', 'f6'],
    },

    // ── PREDICT/REVEAL 3: g6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "White plays Nc3, defending e4.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "White defended e4. Time to prepare the fianchetto.",
      hint: 'Push the g-pawn one square — you want the bishop on the long diagonal.',
      correctFeedback: 'g6 prepares Bg7, placing the bishop on the powerful long diagonal.',
      wrongFeedback: 'Play g6 — prepare to fianchetto the bishop to g7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "g6 completes the Pirc triangle — d6, Nf6, g6. The bishop will go to g7 where it controls the whole long diagonal.",
      arrow: ['g7', 'g6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Show me you've got this.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'Nf6',
      prompt: "Your move.",
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
      correctMove: 'g6',
      prompt: "Your move.",
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "The Pirc triangle is set. Next, you'll learn how to handle White's 150 Attack setup.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// p1a-2: QUEENSIDE EXPANSION (4.Be3 c6 5.Qd2 b5 6.Bd3 Nbd7)
// ═══════════════════════════════════════════════════════════

const P1A_2: OpeningLesson = {
  id: 'p1a-2',
  title: 'Queenside Expansion',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_g6,
      text: "White sets up the 150 Attack with Be3 and Qd2. Your plan: expand on the queenside with c6 and b5.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Quick review before the new stuff.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'Nf6',
      prompt: "Your move.",
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
      correctMove: 'g6',
      prompt: "Your move.",
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },

    // ── PREDICT/REVEAL 1: c6 ──
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "White plays Be3 — the 150 Attack. The bishop eyes the kingside.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c6',
      prompt: "White developed the bishop to e3. What's your plan?",
      hint: 'Support the center and prepare to push b5 — start with c6.',
      correctFeedback: 'c6 solidifies d5 and prepares the queenside expansion with b5.',
      wrongFeedback: 'Play c6 — it supports d5 and sets up b5 next.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 makes d5 rock-solid and sets up b5 — your queenside counterplay starts here.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 2: b5 ──
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "White plays Qd2, connecting the queen with Be3 and eyeing the kingside.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'b5',
      prompt: "White lined up the queen and bishop. How do you create counterplay?",
      hint: 'Push b5 — grab space on the queenside while White focuses on the kingside.',
      correctFeedback: 'b5 grabs queenside space and prepares to develop the knight to d7.',
      wrongFeedback: 'Play b5 — expand on the queenside before White attacks.',
    },
    {
      type: 'instruction',
      fen: FEN.after_b5,
      text: "b5 claims queenside territory. While White plans a kingside attack, you build counterplay on the other side of the board.",
      arrow: ['b7', 'b5'],
    },

    // ── PREDICT/REVEAL 3: Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "White develops the bishop to d3, eyeing the kingside.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'd3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nbd7',
      prompt: "White's pieces are aiming at your king. What's a good developing move?",
      hint: 'Develop the queenside knight — it supports e5 and keeps options open.',
      correctFeedback: 'Nbd7 develops the knight and prepares the central break with e5.',
      wrongFeedback: 'Play Nbd7 — the knight supports e5 and connects your pieces.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Nbd7 develops the last minor piece. From d7, the knight supports e5 and can reroute to b6 or f8 if needed.",
      arrow: ['b8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "Prove you know these moves!",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "White plays Qd2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'b5',
      prompt: "Your move.",
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
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
      correctMove: 'Nbd7',
      prompt: "Your move.",
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Your queenside expansion is complete. Next, you'll learn how to strike in the center with e5.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// p1a-dev-f3: AFTER 5.f3 (deviation from lesson 2)
// White plays f3 instead of Qd2 — a more aggressive approach.
// Teaches: b5, Nbd7, Nb6 (3 black moves)
// ═══════════════════════════════════════════════════════════

const P1A_DEV_F3: OpeningLesson = {
  id: 'p1a-dev-f3',
  title: 'After 5.f3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Sometimes White plays f3 instead of Qd2 — supporting e4 and preparing a kingside pawn storm. Here's how to respond.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Let's see what you remember!",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'Nf6',
      prompt: "Your move.",
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
      correctMove: 'g6',
      prompt: "Your move.",
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "White plays Be3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_f3,
      text: "White plays f3 instead of Qd2 — bolstering e4 and preparing g4.",
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },

    // ── PREDICT/REVEAL 1: b5 ──
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_f3,
      correctMove: 'b5',
      prompt: "White played f3. How do you continue your queenside plan?",
      hint: 'Same idea as the main line — push b5 for queenside space.',
      correctFeedback: 'b5 continues the queenside expansion. Your plan stays the same even after f3.',
      wrongFeedback: 'Play b5 — the queenside expansion works regardless of White\'s kingside plans.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_b5,
      text: "b5 shows confidence — while White prepares a pawn storm, you expand on the other wing.",
      arrow: ['b7', 'b5'],
    },

    // ── PREDICT/REVEAL 2: Nbd7 ──
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Qd2,
      text: "White plays Qd2, connecting the queen and bishop.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_Qd2,
      correctMove: 'Nbd7',
      prompt: "White set up the queen. What's your developing move?",
      hint: 'Develop the knight from b8 — it supports the center and keeps options open.',
      correctFeedback: 'Nbd7 develops the knight toward the center and prepares Nb6.',
      wrongFeedback: 'Play Nbd7 — develop the knight and prepare to reroute it.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Nbd7,
      text: "Nbd7 develops naturally. From d7, the knight can jump to b6 to pressure d5 and a4.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 3: Nb6 ──
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_g4,
      text: "White pushes g4 — the kingside pawn storm begins.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_g4,
      correctMove: 'Nb6',
      prompt: "White is storming the kingside with g4. How do you create counterplay?",
      hint: 'Reroute the knight to a more active square — it can pressure d5 and a4 from b6.',
      correctFeedback: 'Nb6 activates the knight on the queenside, targeting d5 and a4.',
      wrongFeedback: 'Play Nb6 — reroute the knight to create queenside pressure.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Nb6,
      text: "Nb6 is a key rerouting move. The knight pressures d5 and eyes a4, giving you active counterplay while White pushes pawns.",
      arrow: ['d7', 'b6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_f3,
      text: "Show me you've got the f3 line down.",
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_f3,
      correctMove: 'b5',
      prompt: "Your move.",
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Qd2,
      text: "White plays Qd2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_Qd2,
      correctMove: 'Nbd7',
      prompt: "Your move.",
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_g4,
      text: "White plays g4.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_g4,
      correctMove: 'Nb6',
      prompt: "Your move.",
      hint: 'Nb6.',
      correctFeedback: 'Nb6.',
      wrongFeedback: 'Nb6.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Nb6,
      text: "Now you know how to handle f3 — same queenside plan, reroute the knight to b6.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// p1a-3: CENTRAL STRIKE (7.Nf3 e5 8.O-O Bg7 9.Bh6 O-O)
// ═══════════════════════════════════════════════════════════

const P1A_3: OpeningLesson = {
  id: 'p1a-3',
  title: 'Central Strike',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd7,
      text: "Time to strike in the center with e5, fianchetto the bishop, and castle to safety.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Let's run through the moves so far.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'Nf6',
      prompt: "Your move.",
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
      correctMove: 'g6',
      prompt: "Your move.",
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "White plays Be3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "White plays Qd2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'b5',
      prompt: "Your move.",
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
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
      correctMove: 'Nbd7',
      prompt: "Your move.",
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },

    // ── PREDICT/REVEAL 1: e5 ──
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
      correctMove: 'e5',
      prompt: "White developed the last knight. Time to fight for the center.",
      hint: 'Strike in the center — challenge that d4 pawn.',
      correctFeedback: 'e5 challenges the d4 pawn and opens lines for your pieces.',
      wrongFeedback: 'Play e5 — it\'s time to fight back in the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "e5 is the key central break in the Pirc. It challenges d4 and gives your pieces room to breathe.",
      arrow: ['e7', 'e5'],
    },

    // ── PREDICT/REVEAL 2: Bg7 ──
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "White castles kingside.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bg7',
      prompt: "White castled. Where does your dark-squared bishop belong?",
      hint: 'Complete the fianchetto — the bishop belongs on the long diagonal.',
      correctFeedback: 'Bg7 completes the fianchetto. The bishop controls the long a1-h8 diagonal.',
      wrongFeedback: 'Play Bg7 — fianchetto the bishop to its best diagonal.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Bg7 is the soul of the Pirc. From g7, the bishop controls the long diagonal and supports e5.",
      arrow: ['f8', 'g7'],
    },

    // ── PREDICT/REVEAL 3: O-O ──
    {
      type: 'instruction',
      fen: FEN.after_Bh6,
      text: "White plays Bh6, trying to trade off your powerful dark-squared bishop.",
      autoAdvance: 800,
      highlightSquares: ['e3', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'O-O',
      prompt: "White is targeting your bishop on g7. What should you do?",
      hint: 'Get your king to safety — castle kingside.',
      correctFeedback: 'O-O gets the king safe and connects the rooks. Don\'t worry about the bishop trade.',
      wrongFeedback: 'Castle kingside — your king needs safety, and the rooks need to connect.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Castling completes your development. Even if White trades on g7, your king is safe and your rook activates on f8.",
      arrow: ['e8', 'g8'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Now play the three new moves from memory.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'e5',
      prompt: "Your move.",
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bh6,
      text: "White plays Bh6.",
      autoAdvance: 800,
      highlightSquares: ['e3', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "You've got the full 150 Attack repertoire — queenside expansion, central strike, and safe castling.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// p1a-test-1: LEVEL TEST
// Tests main line + f3 deviation
// ═══════════════════════════════════════════════════════════

const P1A_TEST_1: OpeningLesson = {
  id: 'p1a-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── MAIN LINE ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Main line — no hints this time.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Your move.",
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
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
      correctMove: 'Nf6',
      prompt: "Your move.",
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
      correctMove: 'g6',
      prompt: "Your move.",
      hint: 'g6.',
      correctFeedback: 'g6.',
      wrongFeedback: 'g6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be3,
      text: "White plays Be3.",
      autoAdvance: 800,
      highlightSquares: ['c1', 'e3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be3,
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Qd2,
      text: "White plays Qd2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qd2,
      correctMove: 'b5',
      prompt: "Your move.",
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
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
      correctMove: 'Nbd7',
      prompt: "Your move.",
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
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
      correctMove: 'e5',
      prompt: "Your move.",
      hint: 'e5.',
      correctFeedback: 'e5.',
      wrongFeedback: 'e5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO_w,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bh6,
      text: "White plays Bh6.",
      autoAdvance: 800,
      highlightSquares: ['e3', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'O-O',
      prompt: "Your move.",
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── DEVIATION: f3 LINE ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Now the f3 variation.",
      autoAdvance: 800,
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_f3,
      text: "White plays f3.",
      autoAdvance: 800,
      highlightSquares: ['f2', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_f3,
      correctMove: 'b5',
      prompt: "Your move.",
      hint: 'b5.',
      correctFeedback: 'b5.',
      wrongFeedback: 'b5.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_Qd2,
      text: "White plays Qd2.",
      autoAdvance: 800,
      highlightSquares: ['d1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_Qd2,
      correctMove: 'Nbd7',
      prompt: "Your move.",
      hint: 'Nbd7.',
      correctFeedback: 'Nbd7.',
      wrongFeedback: 'Nbd7.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_f3_after_g4,
      text: "White plays g4.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_f3_after_g4,
      correctMove: 'Nb6',
      prompt: "Your move.",
      hint: 'Nb6.',
      correctFeedback: 'Nb6.',
      wrongFeedback: 'Nb6.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getPirc150AttackLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'p1a-1': return P1A_1
    case 'p1a-2': return P1A_2
    case 'p1a-dev-f3': return P1A_DEV_F3
    case 'p1a-3': return P1A_3
    case 'p1a-test-1': return P1A_TEST_1
    default: return undefined
  }
}
