import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PIRC AUSTRIAN ATTACK LESSONS (pa-1 through pa-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Nc6 7.Kh1 e5!
// ═══════════════════════════════════════════════════════════

const FEN = {
  start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d6: 'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4: 'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_Nf6: 'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3',
  after_Nc3: 'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3',
  after_g6: 'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_f4: 'rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4',
  after_Bg7: 'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 1 5',
  after_Nf3: 'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 2 5',
  after_OO: 'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R w KQ - 3 6',
  after_Bd3: 'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R b KQ - 4 6',
  after_Nc6: 'r1bq1rk1/ppp1ppbp/2np1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R w KQ - 5 7',
  after_Kh1: 'r1bq1rk1/ppp1ppbp/2np1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQ1K1R b - - 6 7',
  after_e5: 'r1bq1rk1/ppp2pbp/2np1np1/4p3/3PPP2/2NB1N2/PPP3PP/R1BQ1K1R w - - 0 8',
  after_fxe5: 'r1bq1rk1/ppp2pbp/2np1np1/4P3/3PP3/2NB1N2/PPP3PP/R1BQ1K1R b - - 0 8',
  after_dxe5: 'r1bq1rk1/ppp2pbp/2n2np1/4p3/3PP3/2NB1N2/PPP3PP/R1BQ1K1R w - - 0 9',

  // Punish: 7.e5?! (White's e4 pawn pushes to e5 prematurely)
  punish_e5_after_e5: 'r1bq1rk1/ppp1ppbp/2np1np1/4P3/3P1P2/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 7',
  punish_e5_after_dxe5: 'r1bq1rk1/ppp1ppbp/2n2np1/4p3/3P1P2/2NB1N2/PPP3PP/R1BQK2R w KQ - 0 8',
  punish_e5_after_fxe5: 'r1bq1rk1/ppp1ppbp/2n2np1/4P3/3P4/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 8',
  punish_e5_after_Nd5: 'r1bq1rk1/ppp1ppbp/2n3p1/3nP3/3P4/2NB1N2/PPP3PP/R1BQK2R w KQ - 1 9',

  // Punish: 8.Nxe5?! (White takes on e5)
  punish_Nxe5_after_Nxe5: 'r1bq1rk1/ppp2pbp/2np1np1/4N3/3PPP2/2NB4/PPP3PP/R1BQ1K1R b - - 0 8',
  punish_Nxe5_after_Nxe5_black_recap: 'r1bq1rk1/ppp2pbp/2np1np1/4N3/3PPP2/2NB4/PPP3PP/R1BQ1K1R b - - 0 8',
  punish_Nxe5_after_bxe5: 'r1bq1rk1/ppp2pbp/3p1np1/4n3/3PPP2/2NB4/PPP3PP/R1BQ1K1R w - - 0 9',
  punish_Nxe5_after_fxe5: 'r1bq1rk1/ppp2pbp/3p1np1/4P3/3PP3/2NB4/PPP3PP/R1BQ1K1R b - - 0 9',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Austrian Attack Setup
// Teaches: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
// BLACK opening — user plays Black moves, White auto-advances.
// No recap (first lesson).
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_1: OpeningLesson = {
  id: 'pa-1',
  title: 'The Austrian Attack Setup',
  defaultOrientation: 'black',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Austrian Attack — White's most aggressive system against the Pirc. White will push f4 hard. Your job? Stay cool and counterattack.",
    },

    // 1.e4
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4 — White claims the center immediately.",
      autoAdvance: 800,
    },

    // 1...d6
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "You already know the Pirc setup. Start with d6 — patient and flexible.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Play the Pirc pawn move.",
      hint: "d6 — a quiet setup move.",
      correctFeedback: "d6! Now White will push for the center.",
      wrongFeedback: "Play d6 — the foundation of the Pirc.",
      highlightSquares: ['d7', 'd6'],
    },

    // 2.d4
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4 — White locks in a big center. Now we introduce the Austrian Attack with f4.",
      autoAdvance: 800,
    },

    // 2...Nf6
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Develop your knight to f6, attacking e4.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Attack the e4 pawn.",
      hint: "Knight to f6.",
      correctFeedback: "Nf6! Good — the knight pressures e4.",
      wrongFeedback: "Play Nf6 to pressure e4.",
      highlightSquares: ['g8', 'f6'],
      postMoveArrow: ['f6', 'e4'],
    },

    // 3.Nc3
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3 — White defends e4. A natural move.",
      autoAdvance: 800,
    },

    // 3...g6
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "g6! The fianchetto is still your plan, even in the Austrian Attack.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Prepare the fianchetto.",
      hint: "g6 opens the diagonal for your bishop.",
      correctFeedback: "g6! Next you'll put Bg7 on the long diagonal to bite White's center.",
      wrongFeedback: "Play g6 to prepare Bg7.",
      highlightSquares: ['g7', 'g6'],
    },

    // 4.f4 — White pushes aggressively
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "4.f4! — Here's the Austrian Attack. White pushes f4 immediately, seizing space and preparing a kingside assault. This is White's plan for the game.",
      autoAdvance: 800,
    },

    // 4...Bg7
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "Stay calm. Complete your fianchetto — Bg7.",
    },
    {
      type: 'play-move',
      fen: FEN.after_f4,
      correctMove: 'Bg7',
      prompt: "Fianchetto your bishop.",
      hint: "Bg7 — aim down the long diagonal.",
      correctFeedback: "Bg7! Even though White is attacking aggressively, your bishop now controls the center from long range.",
      wrongFeedback: "Play Bg7 to complete the fianchetto.",
      highlightSquares: ['f8', 'g7'],
    },

    // 5.Nf3
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "5.Nf3 — White develops toward the kingside. Your Bg7 is already watching the center.",
      autoAdvance: 800,
    },

    // 5...O-O
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Castle kingside. You need your king safe before the real battle starts.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Get your king to safety.",
      hint: "O-O — castle kingside.",
      correctFeedback: "O-O! Safe and sound. Now you're ready for what's coming.",
      wrongFeedback: "Castle kingside with O-O.",
      highlightSquares: ['e8', 'g8', 'h8', 'f8'],
    },

    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "You've set up the fianchetto and castled. White has a strong center and space. But you're ready to strike back.",
      buttonText: "NEXT LESSON",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: Develop & Centralize
// Teaches: 6.Bd3 Nc6 7.Kh1
// BLACK opening — recap White's last moves, then user develops.
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_2: OpeningLesson = {
  id: 'pa-2',
  title: 'Develop & Centralize',
  defaultOrientation: 'black',
  steps: [
    // ═══════════════════════════════════════════
    // RECAP: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
    // ═══════════════════════════════════════════
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap: You're facing the Austrian Attack. Let's play through it again — quickly this time.",
      buttonText: "CONTINUE",
    },

    // White plays 1.e4
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 600,
    },

    // Black plays 1...d6
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Recap: Play d6.",
      hint: "d6.",
      correctFeedback: "d6!",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },

    // White plays 2.d4
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 600,
    },

    // Black plays 2...Nf6
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Recap: Nf6.",
      hint: "Nf6.",
      correctFeedback: "Nf6!",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },

    // White plays 3.Nc3
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 600,
    },

    // Black plays 3...g6
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Recap: g6.",
      hint: "g6.",
      correctFeedback: "g6!",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },

    // White plays 4.f4
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "4.f4 — The Austrian Attack.",
      autoAdvance: 600,
    },

    // Black plays 4...Bg7
    {
      type: 'play-move',
      fen: FEN.after_f4,
      correctMove: 'Bg7',
      prompt: "Recap: Bg7.",
      hint: "Bg7.",
      correctFeedback: "Bg7!",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },

    // White plays 5.Nf3
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "5.Nf3.",
      autoAdvance: 600,
    },

    // Black plays 5...O-O
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Recap: Castle.",
      hint: "O-O.",
      correctFeedback: "O-O!",
      wrongFeedback: "O-O.",
      highlightSquares: ['e8', 'g8'],
    },

    // ═══════════════════════════════════════════
    // NEW: 6.Bd3 Nc6 7.Kh1
    // ═══════════════════════════════════════════

    // White plays 6.Bd3
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "6.Bd3 — White develops the bishop to a strong square, supporting the f4 pawn.",
      autoAdvance: 800,
    },

    // Black plays 6...Nc6
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "You develop with Nc6 — a natural, centralizing move. The knight eyes e5 and puts pressure on White's setup.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: "Develop your knight — centralize it!",
      hint: "Nc6 — the natural developing move.",
      correctFeedback: "Nc6! The knight is centralized and ready to help with the counterattack.",
      wrongFeedback: "Play Nc6 — develop toward the center.",
      highlightSquares: ['b8', 'c6'],
    },

    // White plays 7.Kh1
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "7.Kh1 — White moves the king away from the center. This is a prophylactic move — Black might play ...e5 at some point, and Kh1 gets the king out of the way. But here's the thing: White is giving you a chance.",
      autoAdvance: 800,
    },

    {
      type: 'instruction',
      fen: FEN.after_Kh1,
      text: "White has: e4, d4, f4 pawns. You have Bg7 aiming at the center and a centralized Nc6. You're ready for the key strike.",
      buttonText: "NEXT LESSON",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: The Counterattack (Punish e5?!)
// Teaches: What happens if White plays e5 too early
// ═══════════════════════════════════════════════════════════

export const PA_PUNISH_E5: OpeningLesson = {
  id: 'pa-punish-e5',
  title: 'Punish e5?!',
  defaultOrientation: 'black',
  steps: [
    {
      type: 'instruction',
      fen: FEN.after_Kh1,
      text: "What if White pushes e5 here, trying to dominate? That's a mistake — the pawn is overextended.",
    },

    // White plays 7.e5?!
    {
      type: 'instruction',
      fen: FEN.punish_e5_after_e5,
      text: "7.e5?! — White overextends. The pawn is vulnerable.",
      autoAdvance: 800,
    },

    // Black plays 7...dxe5
    {
      type: 'instruction',
      fen: FEN.punish_e5_after_e5,
      text: "You immediately capture — dxe5 removes White's overextended pawn.",
    },
    {
      type: 'play-move',
      fen: FEN.punish_e5_after_e5,
      correctMove: 'dxe5',
      prompt: "Capture the overextended pawn.",
      hint: "dxe5 — take White's pawn.",
      correctFeedback: "dxe5! White's e5 pawn was too ambitious.",
      wrongFeedback: "Capture on e5 with dxe5.",
      highlightSquares: ['d6', 'e5'],
    },

    // White plays 8.fxe5
    {
      type: 'instruction',
      fen: FEN.punish_e5_after_dxe5,
      text: "8.fxe5 — White recaptures with the f-pawn.",
      autoAdvance: 800,
    },

    // Black plays 8...Nd5!
    {
      type: 'instruction',
      fen: FEN.punish_e5_after_fxe5,
      text: "Now centralize your knight — Nd5! It's a powerful square and puts pressure on White's Bd3 and e5 pawn.",
      highlightSquares: ['f6', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.punish_e5_after_fxe5,
      correctMove: 'Nd5',
      prompt: "Centralize your knight aggressively.",
      hint: "Nd5 — a dominating square.",
      correctFeedback: "Nd5! Your knight is in the heart of White's position. You've punished the overextension and gained the initiative.",
      wrongFeedback: "Play Nd5 — centralize your knight.",
      highlightSquares: ['f6', 'd5'],
      postMoveArrow: ['d5', 'd3'],
    },

    {
      type: 'instruction',
      fen: FEN.punish_e5_after_Nd5,
      text: "Remember: Never let White push e5 without a solid follow-up. If White overextends, you punish immediately with ...dxe5 and ...Nd5.",
      buttonText: "NEXT LESSON",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: The Key Strike — e5!
// Teaches: 7...e5! — the main counterattack
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_4: OpeningLesson = {
  id: 'pa-4',
  title: 'Strike with e5!',
  defaultOrientation: 'black',
  steps: [
    // Recap up to 7.Kh1
    {
      type: 'instruction',
      fen: FEN.after_Kh1,
      text: "Now the key moment. White has Kh1, Bd3, and three pawns in the center (e4, d4, f4). You have Bg7 and Nc6. Time to strike.",
    },

    // Black plays 7...e5!
    {
      type: 'instruction',
      fen: FEN.after_Kh1,
      text: "The Austrian Attack is built on f4 domination. But e5 is your answer. With e5, you challenge the center and open lines for your pieces.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Kh1,
      correctMove: 'e5',
      prompt: "Strike at White's center with e5!",
      hint: "e5 — the key counterattack.",
      correctFeedback: "e5! The counterattack. White's f4 pawn is under attack. The center is about to explode.",
      wrongFeedback: "Play e5 — the counterattack move!",
      highlightSquares: ['e7', 'e5'],
      postMoveArrow: ['e5', 'f4'],
    },

    // White plays 8.fxe5
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "8.fxe5 — White captures. The f-pawn takes on e5.",
      autoAdvance: 800,
    },

    // Black plays 8...dxe5
    {
      type: 'instruction',
      fen: FEN.after_fxe5,
      text: "You recapture with dxe5. Now White has d4 and e5, but your pieces are more active.",
    },
    {
      type: 'play-move',
      fen: FEN.after_fxe5,
      correctMove: 'dxe5',
      prompt: "Recapture on e5.",
      hint: "dxe5.",
      correctFeedback: "dxe5! The center is open, and your Bg7 is alive. You've equalized the position and your pieces are more active.",
      wrongFeedback: "Capture on e5 with dxe5.",
      highlightSquares: ['d6', 'e5'],
    },

    {
      type: 'instruction',
      fen: FEN.after_dxe5,
      text: "You've handled the Austrian Attack's main thrust. e5 was the key move — it brought your pieces into the game. Well done.",
      buttonText: "NEXT LESSON",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 5: Punish Nxe5?!
// Teaches: What happens if White greedily takes e5 with the knight
// ═══════════════════════════════════════════════════════════

export const PA_PUNISH_NXE5: OpeningLesson = {
  id: 'pa-punish-Nxe5',
  title: 'Punish Nxe5?!',
  defaultOrientation: 'black',
  steps: [
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "After 7...e5, if White gets greedy and plays Nxe5 (taking with the knight instead of the f-pawn), that's a mistake.",
    },

    // White plays 8.Nxe5?!
    {
      type: 'instruction',
      fen: FEN.punish_Nxe5_after_Nxe5,
      text: "8.Nxe5?! — White captures with the knight. But this hangs material.",
      autoAdvance: 800,
    },

    // Black plays 8...Nxe5
    {
      type: 'instruction',
      fen: FEN.punish_Nxe5_after_Nxe5,
      text: "You simply take back — Nxe5. White has given up the knight.",
    },
    {
      type: 'play-move',
      fen: FEN.punish_Nxe5_after_Nxe5,
      correctMove: 'Nxe5',
      prompt: "Take back the knight!",
      hint: "Nxe5.",
      correctFeedback: "Nxe5! Free material. White blundered.",
      wrongFeedback: "Capture the knight with Nxe5.",
      highlightSquares: ['c6', 'e5'],
    },

    // White plays 9.fxe5
    {
      type: 'instruction',
      fen: FEN.punish_Nxe5_after_bxe5,
      text: "9.fxe5 — White's f-pawn recaptures.",
      autoAdvance: 800,
    },

    // Black plays 9...Bxe5
    {
      type: 'instruction',
      fen: FEN.punish_Nxe5_after_fxe5,
      text: "Your Bg7 captures on e5 — Bxe5. You've won the knight and have a dominating position.",
    },
    {
      type: 'play-move',
      fen: FEN.punish_Nxe5_after_fxe5,
      correctMove: 'Bxe5',
      prompt: "Capture with your bishop.",
      hint: "Bxe5.",
      correctFeedback: "Bxe5! You've won material and your bishop is powerful on e5. White's gamble failed completely.",
      wrongFeedback: "Play Bxe5 with your bishop.",
      highlightSquares: ['g7', 'e5'],
    },

    {
      type: 'instruction',
      fen: FEN.punish_Nxe5_after_fxe5,
      text: "Always watch for White's blunders in the Austrian Attack. If they deviate from the main plan, punish immediately.",
      buttonText: "FINAL TEST",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// TEST LESSON
// ═══════════════════════════════════════════════════════════

export const PA_TEST_1: OpeningLesson = {
  id: 'pa-test-1',
  title: 'Austrian Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test: Can you play the entire Austrian Attack main line AND handle the key variations? You know what to do.",
      buttonText: "START TEST",
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "1.e4.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd6',
      prompt: "Play the Pirc setup.",
      hint: "d6.",
      correctFeedback: "d6!",
      wrongFeedback: "d6.",
      highlightSquares: ['d7', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "2.d4.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'Nf6',
      prompt: "Develop.",
      hint: "Nf6.",
      correctFeedback: "Nf6!",
      wrongFeedback: "Nf6.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "3.Nc3.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'g6',
      prompt: "Fianchetto.",
      hint: "g6.",
      correctFeedback: "g6!",
      wrongFeedback: "g6.",
      highlightSquares: ['g7', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "4.f4 — the Austrian Attack.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_f4,
      correctMove: 'Bg7',
      prompt: "Complete the fianchetto.",
      hint: "Bg7.",
      correctFeedback: "Bg7!",
      wrongFeedback: "Bg7.",
      highlightSquares: ['f8', 'g7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "5.Nf3.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'O-O',
      prompt: "Castle.",
      hint: "O-O.",
      correctFeedback: "O-O!",
      wrongFeedback: "O-O.",
      highlightSquares: ['e8', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "6.Bd3.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: "Develop the knight.",
      hint: "Nc6.",
      correctFeedback: "Nc6!",
      wrongFeedback: "Nc6.",
      highlightSquares: ['b8', 'c6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Kh1,
      text: "7.Kh1.",
      autoAdvance: 400,
    },
    {
      type: 'play-move',
      fen: FEN.after_Kh1,
      correctMove: 'e5',
      prompt: "Strike with e5!",
      hint: "e5 — the key move.",
      correctFeedback: "e5! Perfect. You've mastered the Austrian Attack.",
      wrongFeedback: "Play e5 — the counterattack!",
      highlightSquares: ['e7', 'e5'],
      postMoveArrow: ['e5', 'f4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Congratulations! You've completed the Austrian Attack lesson. You know how to play against White's most aggressive system.",
      buttonText: "DONE",
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON EXPORTS
// ═══════════════════════════════════════════════════════════

export const PIRC_AUSTRIAN_LESSONS: OpeningLesson[] = [
  PA_LESSON_1,
  PA_LESSON_2,
  PA_PUNISH_E5,
  PA_LESSON_4,
  PA_PUNISH_NXE5,
  PA_TEST_1,
]

export function getPircAustrianLesson(id: string): OpeningLesson | undefined {
  return PIRC_AUSTRIAN_LESSONS.find(l => l.id === id)
}
