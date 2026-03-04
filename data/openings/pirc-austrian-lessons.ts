import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PIRC AUSTRIAN ATTACK LESSONS (pa-1 through pa-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Nc6 7.O-O e5 8.d5 Nd4 9.fxe5 dxe5
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d6:    'rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_Nf6:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3',
  after_Nc3:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3',
  after_g6:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  after_f4:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4',
  after_Bg7:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 1 5',
  after_Nf3:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 2 5',
  after_OO_b:  'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R w KQ - 3 6',
  after_Bd3:   'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R b KQ - 4 6',
  after_Nc6:   'r1bq1rk1/ppp1ppbp/2np1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQK2R w KQ - 5 7',
  after_OO_w:  'r1bq1rk1/ppp1ppbp/2np1np1/8/3PPP2/2NB1N2/PPP3PP/R1BQ1RK1 b - - 6 7',
  after_e5:    'r1bq1rk1/ppp2pbp/2np1np1/4p3/3PPP2/2NB1N2/PPP3PP/R1BQ1RK1 w - - 0 8',
  after_d5:    'r1bq1rk1/ppp2pbp/2np1np1/3Pp3/4PP2/2NB1N2/PPP3PP/R1BQ1RK1 b - - 0 8',
  after_Nd4:   'r1bq1rk1/ppp2pbp/3p1np1/3Pp3/3nPP2/2NB1N2/PPP3PP/R1BQ1RK1 w - - 1 9',
  after_fxe5:  'r1bq1rk1/ppp2pbp/3p1np1/3PP3/3nP3/2NB1N2/PPP3PP/R1BQ1RK1 b - - 0 9',
  after_dxe5:  'r1bq1rk1/ppp2pbp/5np1/3Pp3/3nP3/2NB1N2/PPP3PP/R1BQ1RK1 w - - 0 10',
  after_Bg5:   'r1bq1rk1/ppp2pbp/5np1/3Pp1B1/3nP3/2NB1N2/PPP3PP/R2Q1RK1 b - - 1 10',
  after_c6:    'r1bq1rk1/pp3pbp/2p2np1/3Pp1B1/3nP3/2NB1N2/PPP3PP/R2Q1RK1 w - - 0 11',
  after_dxc6:  'r1bq1rk1/pp3pbp/2P2np1/4p1B1/3nP3/2NB1N2/PPP3PP/R2Q1RK1 b - - 0 11',
  after_bxc6:  'r1bq1rk1/p4pbp/2p2np1/4p1B1/3nP3/2NB1N2/PPP3PP/R2Q1RK1 w - - 0 12',

  // Punish: Lesson 1 — 3.Bd3? (forgets to defend e4)
  p1_after_Bd3:  'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/3B4/PPP2PPP/RNBQK1NR b KQkq - 2 3',

  // Punish: 7.e5?! (White overextends before castling)
  punish_e5_after_e5:   'r1bq1rk1/ppp1ppbp/2np1np1/4P3/3P1P2/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 7',
  punish_e5_after_dxe5: 'r1bq1rk1/ppp1ppbp/2n2np1/4p3/3P1P2/2NB1N2/PPP3PP/R1BQK2R w KQ - 0 8',
  punish_e5_after_fxe5: 'r1bq1rk1/ppp1ppbp/2n2np1/4P3/3P4/2NB1N2/PPP3PP/R1BQK2R b KQ - 0 8',
  punish_e5_after_Nd5:  'r1bq1rk1/ppp1ppbp/2n3p1/3nP3/3P4/2NB1N2/PPP3PP/R1BQK2R w KQ - 1 9',

  // Punish: 8.fxe5? (wrong recapture — should be d5)
  punish_fxe5_after_fxe5: 'r1bq1rk1/ppp2pbp/2np1np1/4P3/3PP3/2NB1N2/PPP3PP/R1BQ1RK1 b - - 0 8',
  punish_fxe5_after_dxe5: 'r1bq1rk1/ppp2pbp/2n2np1/4p3/3PP3/2NB1N2/PPP3PP/R1BQ1RK1 w - - 0 9',
  punish_fxe5_after_d5:   'r1bq1rk1/ppp2pbp/2n2np1/3Pp3/4P3/2NB1N2/PPP3PP/R1BQ1RK1 b - - 0 9',
  punish_fxe5_after_Nd4:  'r1bq1rk1/ppp2pbp/5np1/3Pp3/3nP3/2NB1N2/PPP3PP/R1BQ1RK1 w - - 1 10',

  // Punish: 8.Nxe5? (White grabs e5 with the knight)
  punish_Nxe5_after_Nxe5_w: 'r1bq1rk1/ppp2pbp/2np1np1/4N3/3PPP2/2NB4/PPP3PP/R1BQ1RK1 b - - 0 8',
  punish_Nxe5_after_Nxe5_b: 'r1bq1rk1/ppp2pbp/3p1np1/4n3/3PPP2/2NB4/PPP3PP/R1BQ1RK1 w - - 0 9',
  punish_Nxe5_after_fxe5:   'r1bq1rk1/ppp2pbp/3p1np1/4P3/3PP3/2NB4/PPP3PP/R1BQ1RK1 b - - 0 9',
  punish_Nxe5_after_Nd7:    'r1bq1rk1/pppn1pbp/3p2p1/4P3/3PP3/2NB4/PPP3PP/R1BQ1RK1 w - - 1 10',
}

// ═══════════════════════════════════════════════════════════
// LESSON 1: The Austrian Setup
// Teaches: d6, Nf6, g6 | Punish: 3.Bd3? Nxe4
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_1: OpeningLesson = {
  id: 'pa-1',
  title: 'The Austrian Setup',
  defaultOrientation: 'black',
  steps: [
    // ACT 2: TEACH (first lesson — no recap)
    { type: 'instruction', fen: FEN.start, text: "Welcome to the Austrian Attack — White's most aggressive system against the Pirc. White pushes f4 to seize space. Your job? Stay cool and counterattack.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_e4, text: "Start with d6 — the Pirc pawn move. Patient and flexible." },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "The Pirc opening move.", hint: "Push the d-pawn two squares.", correctFeedback: "d6! Patient and flexible.", wrongFeedback: "Play d6 — the Pirc pawn move.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_d4, text: "Develop your knight to f6 — it attacks the e4 pawn right away." },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Develop and attack.", hint: "Knight to f6 hits e4.", correctFeedback: "Nf6! Attacking e4 right away.", wrongFeedback: "Develop your knight to f6 — it attacks e4.", highlightSquares: ['g8', 'f6'], postMoveArrow: ['f6', 'e4'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_Nc3, text: "g6 — prepare the fianchetto. Your bishop will watch the center from g7." },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Set up the fianchetto.", hint: "Push g6.", correctFeedback: "g6! Your bishop will control the long diagonal.", wrongFeedback: "Play g6 — prepare the fianchetto.", highlightSquares: ['g7', 'g6'] },

    // ACT 3: PUNISH — 3.Bd3? Nxe4
    { type: 'instruction', fen: FEN.after_Nf6, text: "What if White develops carelessly? After 2.d4 Nf6, imagine White plays 3.Bd3 — forgetting to defend e4." },
    { type: 'instruction', fen: FEN.p1_after_Bd3, text: "3.Bd3? The bishop develops but nobody is guarding e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.p1_after_Bd3, correctMove: 'Nxe4', prompt: "White left e4 undefended!", hint: "Your knight can capture the e4 pawn.", correctFeedback: "Nxe4! Free pawn. White forgot to defend e4 — that's the punishment for 3.Bd3.", wrongFeedback: "Capture the e4 pawn with Nxe4.", highlightSquares: ['f6', 'e4'] },

    // ACT 4: RECALL
    { type: 'instruction', fen: FEN.start, text: "Let's run it back. Play the three Pirc moves.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Your move.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Your move.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 2: Fianchetto & Castle
// Teaches: Bg7, O-O
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_2: OpeningLesson = {
  id: 'pa-2',
  title: 'Fianchetto & Castle',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play the Austrian Attack.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.", highlightSquares: ['g7', 'g6'] },

    // ACT 2: TEACH
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack! White pushes f4 to seize space and threaten a kingside push.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_f4, text: "Complete your fianchetto with Bg7 — the bishop watches the center from the long diagonal." },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Place the bishop on the long diagonal.", hint: "Bg7.", correctFeedback: "Bg7! Your fianchetto is complete.", wrongFeedback: "Play Bg7 — the bishop controls the center.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3 — White develops toward the kingside.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_Nf3, text: "Castle kingside. Your king needs to be safe before the battle starts." },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Tuck your king away.", hint: "O-O.", correctFeedback: "O-O! You're castled and ready.", wrongFeedback: "Castle kingside with O-O.", highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_OO_b, text: "You've fianchettoed and castled. White has a big center — but you're ready to fight back." },

    // ACT 4: RECALL
    { type: 'instruction', fen: FEN.start, text: "Full recall — play all five Black moves.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Your move.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Your move.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Your move.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH: e5?! (White overextends before castling)
// After: d6, Nf6, g6, Bg7, O-O, Nc6 → 7.e5?! dxe5 8.fxe5 Nd5
// ═══════════════════════════════════════════════════════════

export const PA_PUNISH_E5: OpeningLesson = {
  id: 'pa-punish-e5',
  title: 'Punish e5?!',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play through the Austrian setup to Nc6.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.", highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.", highlightSquares: ['b8', 'c6'] },

    // ACT 2: TEACH PUNISH
    { type: 'instruction', fen: FEN.after_Nc6, text: "White hasn't castled yet. If they push 7.e5 here — before securing the king — that's a mistake." },
    { type: 'instruction', fen: FEN.punish_e5_after_e5, text: "7.e5?! — White overextends. The pawn pushes forward but the king is still exposed.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.punish_e5_after_e5, text: "Take immediately — dxe5. The pawn was overextended." },
    { type: 'play-move', fen: FEN.punish_e5_after_e5, correctMove: 'dxe5', prompt: "Capture the overextended pawn.", hint: "dxe5 — take White's pawn.", correctFeedback: "dxe5! White's e5 pawn was too ambitious.", wrongFeedback: "Capture on e5 with dxe5.", highlightSquares: ['d6', 'e5'] },
    { type: 'instruction', fen: FEN.punish_e5_after_fxe5, text: "8.fxe5 — White recaptures. Now centralize your knight.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.punish_e5_after_fxe5, text: "Nd5! The knight sits on a dominant square, attacking Bd3." },
    { type: 'play-move', fen: FEN.punish_e5_after_fxe5, correctMove: 'Nd5', prompt: "Centralize your knight aggressively.", hint: "Nd5 — a dominating square.", correctFeedback: "Nd5! Your knight dominates the center. White's premature e5 backfired.", wrongFeedback: "Play Nd5 — centralize your knight.", highlightSquares: ['f6', 'd5'], postMoveArrow: ['d5', 'd3'] },
    { type: 'instruction', fen: FEN.punish_e5_after_Nd5, text: "If White overextends with e5 before castling, take with dxe5, then Nd5. White's position is uncomfortable." },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 3: Develop & Castle
// Teaches: Nc6
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_3: OpeningLesson = {
  id: 'pa-3',
  title: 'Develop & Castle',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play the Austrian setup.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.", highlightSquares: ['e8', 'g8'] },

    // ACT 2: TEACH
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3 — White develops the bishop, supporting f4 and eyeing the kingside.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_Bd3, text: "Develop your knight to c6. It's centralized and eyes the critical e5 square." },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: "Centralize the knight.",
      hint: "Nc6 — a natural developing move.",
      correctFeedback: "Nc6! Centralized and ready to support the counterattack.",
      wrongFeedback: "Play Nc6 — develop toward the center.",
      highlightSquares: ['b8', 'c6'],
    },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O — White castles. Both sides are developed. Now you're ready to strike.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_OO_w, text: "White has a strong center — e4, d4, f4. You have Bg7 and Nc6. The moment for your key counterattack is coming." },

    // ACT 4: RECALL
    { type: 'instruction', fen: FEN.start, text: "Full recall — play all six Black moves.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Your move.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Your move.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Your move.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 4: Strike with e5!
// Teaches: e5, Nd4
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_4: OpeningLesson = {
  id: 'pa-4',
  title: 'Strike with e5!',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play the Austrian setup to Nc6.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.", highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.", highlightSquares: ['b8', 'c6'] },

    // ACT 2: TEACH
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O — White castles. The center is locked with e4, d4, f4. Time for the key counterattack.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_OO_w, text: "The critical moment. Strike with e5! This challenges White's pawn trio and opens the position." },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Strike at White's center!", hint: "e5 — the key counterattack.", correctFeedback: "e5! You've challenged White's center. The position is about to change.", wrongFeedback: "Play e5 — the counterattack move.", highlightSquares: ['e7', 'e5'], postMoveArrow: ['e5', 'f4'] },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5 — White advances instead of trading. Your Nc6 must move.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_d5, text: "Nd4! Your knight leaps to a fantastic outpost. It attacks Nf3 and can't be easily challenged." },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Jump to the powerful central square.", hint: "Nd4 — a strong central outpost.", correctFeedback: "Nd4! The knight dominates d4 and pressures f3. Active, well-placed pieces.", wrongFeedback: "Play Nd4 — centralize the knight.", highlightSquares: ['c6', 'd4'], postMoveArrow: ['d4', 'f3'] },
    { type: 'instruction', fen: FEN.after_Nd4, text: "White has space, but your Nd4 is excellent. Both sides have chances — this is sharp chess." },

    // ACT 4: RECALL
    { type: 'instruction', fen: FEN.start, text: "Full recall — play all eight Black moves.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Your move.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Your move.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Your move.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Your move.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Your move.", hint: "Nd4.", correctFeedback: "Nd4.", wrongFeedback: "Nd4." },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH: fxe5? (wrong recapture after 7...e5)
// After: d6...e5 → 8.fxe5? dxe5 9.d5 Nd4
// ═══════════════════════════════════════════════════════════

export const PA_PUNISH_FXES5: OpeningLesson = {
  id: 'pa-punish-fxe5',
  title: 'Punish fxe5?',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play through to e5.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Center!", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },

    // ACT 2: TEACH PUNISH
    { type: 'instruction', fen: FEN.after_e5, text: "White's best reply is 8.d5. But what if they capture with the f-pawn instead?" },
    { type: 'instruction', fen: FEN.punish_fxe5_after_fxe5, text: "8.fxe5? — White recaptures with the f-pawn. This is less accurate than d5.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.punish_fxe5_after_fxe5, text: "Take back with dxe5. Simple and strong." },
    { type: 'play-move', fen: FEN.punish_fxe5_after_fxe5, correctMove: 'dxe5', prompt: "Recapture on e5.", hint: "dxe5.", correctFeedback: "dxe5! The center is open. Your Bg7 and Nc6 are active.", wrongFeedback: "Capture on e5 with dxe5.", highlightSquares: ['d6', 'e5'] },
    { type: 'instruction', fen: FEN.punish_fxe5_after_d5, text: "9.d5 — White pushes to gain space. Your knight must jump.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.punish_fxe5_after_d5, text: "Nd4! Same idea as the main line. The knight attacks Nf3 from d4." },
    { type: 'play-move', fen: FEN.punish_fxe5_after_d5, correctMove: 'Nd4', prompt: "Jump to the outpost.", hint: "Nd4 — the strong central square.", correctFeedback: "Nd4! Whether White plays d5 or fxe5 first, you always end up with the knight on d4.", wrongFeedback: "Play Nd4 — the central outpost.", highlightSquares: ['c6', 'd4'], postMoveArrow: ['d4', 'f3'] },
    { type: 'instruction', fen: FEN.punish_fxe5_after_Nd4, text: "After 8.fxe5? dxe5 9.d5 Nd4, your pieces are active. White's f-pawn recapture gave you easy play." },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 5: The Central Fork
// Teaches: dxe5
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_5: OpeningLesson = {
  id: 'pa-5',
  title: 'The Central Fork',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play the full Austrian Attack to Nd4.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.", highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.", highlightSquares: ['b8', 'c6'] },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Center!", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5.", highlightSquares: ['e7', 'e5'] },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Outpost.", hint: "Nd4.", correctFeedback: "Nd4.", wrongFeedback: "Nd4.", highlightSquares: ['c6', 'd4'] },

    // ACT 2: TEACH
    { type: 'instruction', fen: FEN.after_Nd4, text: "Your Nd4 is on a powerful square. White's best is to clear the center with fxe5." },
    { type: 'instruction', fen: FEN.after_fxe5, text: "9.fxe5 — White opens the f-file and challenges your e5 pawn.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_fxe5, text: "Take back with dxe5. You recapture and maintain your strong knight on d4." },
    {
      type: 'play-move',
      fen: FEN.after_fxe5,
      correctMove: 'dxe5',
      prompt: "Recapture on e5.",
      hint: "dxe5 — take back the pawn.",
      correctFeedback: "dxe5! Your pawn on e5 and knight on d4 give you active, coordinated pieces.",
      wrongFeedback: "Capture on e5 with dxe5.",
      highlightSquares: ['d6', 'e5'],
    },
    { type: 'instruction', fen: FEN.after_dxe5, text: "After 9.fxe5 dxe5: your Nd4 is a star, e5 is solid, and Bg7 covers the long diagonal. White has a passed d-pawn, but you have active play." },

    // ACT 4: RECALL
    { type: 'instruction', fen: FEN.start, text: "Full recall — play all nine Black moves.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Your move.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Your move.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Your move.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Your move.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Your move.", hint: "Nd4.", correctFeedback: "Nd4.", wrongFeedback: "Nd4." },
    { type: 'instruction', fen: FEN.after_fxe5, text: "9.fxe5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_fxe5, correctMove: 'dxe5', prompt: "Your move.", hint: "dxe5.", correctFeedback: "dxe5.", wrongFeedback: "dxe5." },
  ],
}

// ═══════════════════════════════════════════════════════════
// PUNISH: Nxe5? (White grabs e5 with knight)
// After: d6...e5 → 8.Nxe5? Nxe5 9.fxe5 Nd7
// ═══════════════════════════════════════════════════════════

export const PA_PUNISH_NXE5: OpeningLesson = {
  id: 'pa-punish-Nxe5',
  title: 'Punish Nxe5?',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play through to e5.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O.", highlightSquares: ['e8', 'g8'] },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6.", highlightSquares: ['b8', 'c6'] },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Center!", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5.", highlightSquares: ['e7', 'e5'] },

    // ACT 2: TEACH PUNISH
    { type: 'instruction', fen: FEN.after_e5, text: "After 7...e5, what if White gets greedy and captures with the knight?" },
    { type: 'instruction', fen: FEN.punish_Nxe5_after_Nxe5_w, text: "8.Nxe5? — White grabs the pawn with the knight. Looks active but gives you a free trade.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.punish_Nxe5_after_Nxe5_w, text: "Simply take back — Nxe5. Trade off White's well-placed knight." },
    {
      type: 'play-move',
      fen: FEN.punish_Nxe5_after_Nxe5_w,
      correctMove: 'Nxe5',
      prompt: "Take the knight!",
      hint: "Nxe5 — trade knights.",
      correctFeedback: "Nxe5! White traded a developed knight for a pawn. Easy play ahead.",
      wrongFeedback: "Capture the knight with Nxe5.",
      highlightSquares: ['c6', 'e5'],
    },
    { type: 'instruction', fen: FEN.punish_Nxe5_after_fxe5, text: "9.fxe5 — White recaptures with the f-pawn. The pawn on e5 is exposed.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.punish_Nxe5_after_fxe5, text: "Reroute with Nd7. From d7 the knight can go to c5 or support the e5 push." },
    {
      type: 'play-move',
      fen: FEN.punish_Nxe5_after_fxe5,
      correctMove: 'Nd7',
      prompt: "Reroute your knight.",
      hint: "Nd7 — the knight finds a better home.",
      correctFeedback: "Nd7! The knight reorganizes. White's pawn on e5 is a target.",
      wrongFeedback: "Play Nd7 to reroute the knight.",
      highlightSquares: ['f6', 'd7'],
    },
    { type: 'instruction', fen: FEN.punish_Nxe5_after_Nd7, text: "If White plays Nxe5, trade knights and reroute with Nd7. White gets no advantage from the grab." },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 6: Open Lines
// Teaches: c6, bxc6
// ═══════════════════════════════════════════════════════════

export const PA_LESSON_6: OpeningLesson = {
  id: 'pa-6',
  title: 'Open Lines',
  defaultOrientation: 'black',
  steps: [
    // ACT 1: RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick recap — play the full Austrian Attack to dxe5.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Attack e4.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Center!", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Outpost.", hint: "Nd4.", correctFeedback: "Nd4.", wrongFeedback: "Nd4." },
    { type: 'instruction', fen: FEN.after_fxe5, text: "9.fxe5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_fxe5, correctMove: 'dxe5', prompt: "Recapture.", hint: "dxe5.", correctFeedback: "dxe5.", wrongFeedback: "dxe5." },

    // ACT 2: TEACH
    { type: 'instruction', fen: FEN.after_dxe5, text: "After 9...dxe5, White continues with 10.Bg5 — pinning your Nf6 to the queen.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_Bg5, text: "10.Bg5 — White pins the Nf6. Time to challenge the pawn chain.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_Bg5, text: "c6! Challenge the d5 pawn. You're not afraid of the pin — you have counterplay." },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: "Challenge White's d5 pawn.", hint: "c6 — strike at the pawn chain.", correctFeedback: "c6! You challenge d5. White must decide how to handle it.", wrongFeedback: "Play c6 to challenge the d5 pawn.", highlightSquares: ['c7', 'c6'], postMoveArrow: ['c6', 'd5'] },
    { type: 'instruction', fen: FEN.after_dxc6, text: "11.dxc6 — White captures, opening the position.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN.after_dxc6, text: "Recapture with bxc6. You open the b-file for your rook and keep a solid structure." },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'bxc6', prompt: "Recapture — open the b-file.", hint: "bxc6 — recapture with the pawn.", correctFeedback: "bxc6! Open b-file, active pieces, solid position.", wrongFeedback: "Recapture with bxc6.", highlightSquares: ['b7', 'c6'] },
    { type: 'instruction', fen: FEN.after_bxc6, text: "After 10.Bg5 c6 11.dxc6 bxc6, your position is active. The b-file is open, Nd4 is strong, and Bg7 controls the diagonal." },

    // ACT 4: RECALL
    { type: 'instruction', fen: FEN.start, text: "Full recall — play all eleven Black moves.", buttonText: "LET'S GO" },
    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Your move.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },
    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Your move.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },
    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Your move.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },
    { type: 'instruction', fen: FEN.after_f4, text: "4.f4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Your move.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },
    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Your move.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },
    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Your move.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },
    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Your move.", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },
    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Your move.", hint: "Nd4.", correctFeedback: "Nd4.", wrongFeedback: "Nd4." },
    { type: 'instruction', fen: FEN.after_fxe5, text: "9.fxe5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_fxe5, correctMove: 'dxe5', prompt: "Your move.", hint: "dxe5.", correctFeedback: "dxe5.", wrongFeedback: "dxe5." },
    { type: 'instruction', fen: FEN.after_Bg5, text: "10.Bg5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: "Your move.", hint: "c6.", correctFeedback: "c6.", wrongFeedback: "c6." },
    { type: 'instruction', fen: FEN.after_dxc6, text: "11.dxc6.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'bxc6', prompt: "Your move.", hint: "bxc6.", correctFeedback: "bxc6.", wrongFeedback: "bxc6." },
  ],
}

// ═══════════════════════════════════════════════════════════
// TEST: Austrian Attack Full Test
// Main line (11 moves) + all 3 punish variations
// ═══════════════════════════════════════════════════════════

export const PA_TEST_1: OpeningLesson = {
  id: 'pa-test-1',
  title: 'Austrian Test',
  defaultOrientation: 'black',
  steps: [
    // SECTION 1: MAIN LINE (11 moves)
    { type: 'instruction', fen: FEN.start, text: "Final test — play the entire Austrian Attack. No hand-holding.", buttonText: "START TEST" },

    { type: 'instruction', fen: FEN.after_e4, text: "1.e4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd6', prompt: "Pirc setup.", hint: "d6.", correctFeedback: "d6.", wrongFeedback: "d6." },

    { type: 'instruction', fen: FEN.after_d4, text: "2.d4.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d4, correctMove: 'Nf6', prompt: "Develop.", hint: "Nf6.", correctFeedback: "Nf6.", wrongFeedback: "Nf6." },

    { type: 'instruction', fen: FEN.after_Nc3, text: "3.Nc3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'g6', prompt: "Fianchetto.", hint: "g6.", correctFeedback: "g6.", wrongFeedback: "g6." },

    { type: 'instruction', fen: FEN.after_f4, text: "4.f4 — the Austrian Attack.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Bg7', prompt: "Long diagonal.", hint: "Bg7.", correctFeedback: "Bg7.", wrongFeedback: "Bg7." },

    { type: 'instruction', fen: FEN.after_Nf3, text: "5.Nf3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'O-O', prompt: "Castle.", hint: "O-O.", correctFeedback: "O-O.", wrongFeedback: "O-O." },

    { type: 'instruction', fen: FEN.after_Bd3, text: "6.Bd3.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Nc6', prompt: "Develop.", hint: "Nc6.", correctFeedback: "Nc6.", wrongFeedback: "Nc6." },

    { type: 'instruction', fen: FEN.after_OO_w, text: "7.O-O.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'e5', prompt: "Strike!", hint: "e5.", correctFeedback: "e5.", wrongFeedback: "e5." },

    { type: 'instruction', fen: FEN.after_d5, text: "8.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nd4', prompt: "Outpost.", hint: "Nd4.", correctFeedback: "Nd4.", wrongFeedback: "Nd4." },

    { type: 'instruction', fen: FEN.after_fxe5, text: "9.fxe5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_fxe5, correctMove: 'dxe5', prompt: "Recapture.", hint: "dxe5.", correctFeedback: "dxe5.", wrongFeedback: "dxe5." },

    { type: 'instruction', fen: FEN.after_Bg5, text: "10.Bg5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'c6', prompt: "Challenge.", hint: "c6.", correctFeedback: "c6.", wrongFeedback: "c6." },

    { type: 'instruction', fen: FEN.after_dxc6, text: "11.dxc6.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'bxc6', prompt: "Open file.", hint: "bxc6.", correctFeedback: "bxc6.", wrongFeedback: "bxc6." },

    // SECTION 2: PUNISH e5?!
    { type: 'instruction', fen: FEN.after_Nc6, text: "Now handle the punish positions. White plays e5 prematurely." },

    { type: 'instruction', fen: FEN.punish_e5_after_e5, text: "7.e5?!", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.punish_e5_after_e5, correctMove: 'dxe5', prompt: "Punish.", hint: "dxe5.", correctFeedback: "dxe5!", wrongFeedback: "dxe5." },

    { type: 'instruction', fen: FEN.punish_e5_after_fxe5, text: "8.fxe5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.punish_e5_after_fxe5, correctMove: 'Nd5', prompt: "Centralize.", hint: "Nd5.", correctFeedback: "Nd5!", wrongFeedback: "Nd5." },

    // SECTION 3: PUNISH fxe5?
    { type: 'instruction', fen: FEN.after_e5, text: "White captures with the wrong pawn." },

    { type: 'instruction', fen: FEN.punish_fxe5_after_fxe5, text: "8.fxe5?", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.punish_fxe5_after_fxe5, correctMove: 'dxe5', prompt: "Recapture.", hint: "dxe5.", correctFeedback: "dxe5!", wrongFeedback: "dxe5." },

    { type: 'instruction', fen: FEN.punish_fxe5_after_d5, text: "9.d5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.punish_fxe5_after_d5, correctMove: 'Nd4', prompt: "Outpost.", hint: "Nd4.", correctFeedback: "Nd4!", wrongFeedback: "Nd4." },

    // SECTION 4: PUNISH Nxe5?
    { type: 'instruction', fen: FEN.after_e5, text: "White grabs with the knight." },

    { type: 'instruction', fen: FEN.punish_Nxe5_after_Nxe5_w, text: "8.Nxe5?", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.punish_Nxe5_after_Nxe5_w, correctMove: 'Nxe5', prompt: "Trade.", hint: "Nxe5.", correctFeedback: "Nxe5!", wrongFeedback: "Nxe5." },

    { type: 'instruction', fen: FEN.punish_Nxe5_after_fxe5, text: "9.fxe5.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN.punish_Nxe5_after_fxe5, correctMove: 'Nd7', prompt: "Reroute.", hint: "Nd7.", correctFeedback: "Nd7!", wrongFeedback: "Nd7." },

    // FINAL
    { type: 'instruction', fen: FEN.punish_Nxe5_after_Nd7, text: "You've mastered the Austrian Attack — main line and all three punish variations. Well done.", buttonText: "DONE" },
  ],
}

// ═══════════════════════════════════════════════════════════
// LEVEL 2 — Austrian Attack (6.e5 line)
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O
//            6.e5 Nfd7 7.Be2 c5 8.Be3 cxd4 9.Nxd4 Nc6
// ═══════════════════════════════════════════════════════════

const FEN_L2 = {
  // ─── SHARED (from L1) ───
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d4:    'rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_Nc3:   'rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3',
  after_f4:    'rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4',
  after_Nf3:   'rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq - 2 5',

  // ─── pa-8: Survive the Storm ───
  after_OO_b:  'rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R w KQ - 3 6',
  after_e5_w:  'rnbq1rk1/ppp1ppbp/3p1np1/4P3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQ - 0 6',
  after_Nfd7:  'rnbq1rk1/pppnppbp/3p2p1/4P3/3P1P2/2N2N2/PPP3PP/R1BQKB1R w KQ - 1 7',

  // ─── pa-9: Counter ...c5! ───
  after_Be2:   'rnbq1rk1/pppnppbp/3p2p1/4P3/3P1P2/2N2N2/PPP1B1PP/R1BQK2R b KQ - 2 7',
  after_c5:    'rnbq1rk1/pp1nppbp/3p2p1/2p1P3/3P1P2/2N2N2/PPP1B1PP/R1BQK2R w KQ - 0 8',
  after_Be3:   'rnbq1rk1/pp1nppbp/3p2p1/2p1P3/3P1P2/2N1BN2/PPP1B1PP/R2QK2R b KQ - 1 8',
  after_cxd4:  'rnbq1rk1/pp1nppbp/3p2p1/4P3/3p1P2/2N1BN2/PPP1B1PP/R2QK2R w KQ - 0 9',
  after_Nxd4:  'rnbq1rk1/pp1nppbp/3p2p1/4P3/3N1P2/2N1B3/PPP1B1PP/R2QK2R b KQ - 0 9',
  after_Nc6_9: 'r1bq1rk1/pp1nppbp/2np2p1/4P3/3N1P2/2N1B3/PPP1B1PP/R2QK2R w KQ - 1 10',

  // ─── pa-var-7: 2...g6 Early ───
  v7_after_g6:    'rnbqkbnr/ppp1pp1p/3p2p1/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  v7_after_c4:    'rnbqkbnr/ppp1pp1p/3p2p1/8/2PPP3/8/PP3PPP/RNBQKBNR b KQkq - 0 3',
  v7_after_Bg7:   'rnbqk1nr/ppp1ppbp/3p2p1/8/2PPP3/8/PP3PPP/RNBQKBNR w KQkq - 1 4',
  v7_after_Nc3:   'rnbqk1nr/ppp1ppbp/3p2p1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 2 4',
  v7_after_Nf6:   'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 3 5',
  v7_after_h3:    'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N4P/PP3PP1/R1BQKBNR b KQkq - 0 5',
  v7_after_Nbd7:  'r1bqk2r/pppnppbp/3p1np1/8/2PPP3/2N4P/PP3PP1/R1BQKBNR w KQkq - 1 6',

  // ─── pa-var-8: Caro Setup ───
  v8_after_c6:    'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  v8_after_d4:    'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  v8_after_d5:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  v8_after_Nd2:   'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3',
  v8_after_dxe4:  'rnbqkbnr/pp2pppp/2p5/8/3Pn3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4',
  v8_after_Nxe4:  'rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4',
  v8_after_Bf5:   'rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5',

  // ─── pa-var-9: 2...e5 Counter ───
  v9_after_e5:    'rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  v9_after_Nf3:   'rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 3',
  v9_after_exd4:  'rnbqkbnr/ppp2ppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  v9_after_Nxd4:  'rnbqkbnr/ppp2ppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  v9_after_Be7:   'rnbqk1nr/ppp1bppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  v9_after_Nc3:   'rnbqk1nr/ppp1bppp/3p4/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  v9_after_Nf6:   'rnbqk2r/ppp1bppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 3 6',

  // ─── pa-var-10: Sicilian Twist ───
  v10_after_c5:    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  v10_after_Nf3:   'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  v10_after_d6:    'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  v10_after_Nc3:   'rnbqkbnr/pp2pppp/3p4/2p5/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 3',
  v10_after_a6:    'rnbqkbnr/1p2pppp/p2p4/2p5/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4',
  v10_after_d4:    'rnbqkbnr/1p2pppp/p2p4/2p5/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 0 4',
  v10_after_cxd4:  'rnbqkbnr/1p2pppp/p2p4/8/3pP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 5',

  // ─── pa-var-11: Solid ...e6 ───
  v11_after_e6:    'rnbqkb1r/ppp2ppp/3ppn2/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
  v11_after_Nf3:   'rnbqkb1r/ppp2ppp/3ppn2/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 1 4',
  v11_after_Nbd7:  'r1bqkb1r/pppn1ppp/3ppn2/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 2 5',
  v11_after_Be2:   'r1bqkb1r/pppn1ppp/3ppn2/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R b KQkq - 3 5',
  v11_after_a6:    'r1bqkb1r/1ppn1ppp/p2ppn2/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 6',
  v11_after_a4:    'r1bqkb1r/1ppn1ppp/p2ppn2/8/P2PP3/2N2N2/1PP1BPPP/R1BQK2R b KQkq - 0 6',
  v11_after_Be7:   'r1bqk2r/1ppnbppp/p2ppn2/8/P2PP3/2N2N2/1PP1BPPP/R1BQK2R w KQkq - 1 7',

  // ─── pa-var-12: 3...Nc6 Active ───
  v12_after_Nc6:   'r1bqkb1r/ppp1pp1p/2np1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 1 5',
  v12_after_Be2:   'r1bqkb1r/ppp1pp1p/2np1np1/8/3PPP2/2N5/PPP1B1PP/R1BQK1NR b KQkq - 2 5',
  v12_after_Bg7:   'r1bqk2r/ppp1ppbp/2np1np1/8/3PPP2/2N5/PPP1B1PP/R1BQK1NR w KQkq - 3 6',
  v12_after_Nf3:   'r1bqk2r/ppp1ppbp/2np1np1/8/3PPP2/2N2N2/PPP1B1PP/R1BQK2R b KQkq - 4 6',
  v12_after_d5:    'r1bqk2r/ppp1ppbp/2n2np1/3pP3/3P1P2/2N2N2/PPP1B1PP/R1BQK2R w KQkq - 0 7',
  v12_after_e5_w:  'r1bqk2r/ppp1ppbp/2n2np1/3pP3/3P1P2/2N2N2/PPP1B1PP/R1BQK2R b KQkq - 0 7',
  v12_after_Ne4:   'r1bqk2r/ppp1ppbp/2n3p1/3pP3/3PnP2/2N2N2/PPP1B1PP/R1BQK2R w KQkq - 1 8',
}

// ═══════════════════════════════════════════════════════════
// LESSON 7: Pirc Foundations (L2)
// ═══════════════════════════════════════════════════════════

const PA_LESSON_7: OpeningLesson = {
  id: 'pa-7',
  title: 'Pirc Foundations',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_e4, text: "Welcome to the Pirc Defense! You'll let White build a big center, then tear it apart from the flanks. The plan: d6, Nf6, g6 — fianchetto your dark-squared bishop." },
    { type: 'play-move', fen: FEN_L2.after_e4, correctMove: 'd6', prompt: "Start with d6 — hold back and prepare.", hint: "Push the d-pawn one square.", correctFeedback: "d6! You signal the Pirc. White has the center for now.", wrongFeedback: "In the Pirc, we start with d6 — a flexible, hypermodern move.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN_L2.after_d4, text: "2.d4 — White grabs more space.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.after_d4, correctMove: 'Nf6', prompt: "Develop a knight and attack e4!", hint: "Knight to f6 — it eyes the center.", correctFeedback: "Nf6! Your knight pressures e4 immediately.", wrongFeedback: "Play Nf6 — develop and attack White's e4 pawn.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN_L2.after_Nc3, text: "3.Nc3 — White defends e4.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN_L2.after_Nc3, text: "Now g6 — prepare to fianchetto your bishop to g7. From there it'll be a monster on the long diagonal." },
    { type: 'play-move', fen: FEN_L2.after_Nc3, correctMove: 'g6', prompt: "Prepare the fianchetto!", hint: "Push g6 to make room for your bishop on g7.", correctFeedback: "g6! The fianchetto is coming. Your bishop will dominate the long diagonal.", wrongFeedback: "Play g6 — it's the heart of the Pirc setup.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN_L2.after_f4, text: "The Pirc foundation is set — d6, Nf6, g6. White has a big center, but you're about to undermine it!" },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 8: Survive the Storm (L2)
// ═══════════════════════════════════════════════════════════

const PA_LESSON_8: OpeningLesson = {
  id: 'pa-8',
  title: 'Survive the Storm',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_f4, text: "White plays f4 — the Austrian Attack! Aggressive, but don't panic. Fianchetto, castle, and prepare to strike back." },
    { type: 'play-move', fen: FEN_L2.after_f4, correctMove: 'Bg7', prompt: "Complete the fianchetto!", hint: "Bishop to g7 — the dragon bishop.", correctFeedback: "Bg7! Your bishop is a beast on the long diagonal, aiming at White's center.", wrongFeedback: "Play Bg7 — get that bishop to its ideal square.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN_L2.after_Nf3, text: "5.Nf3 — White develops naturally.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.after_Nf3, correctMove: 'O-O', prompt: "Get your king safe!", hint: "Castle kingside.", correctFeedback: "Castled! Your king is safe and your rook is connected.", wrongFeedback: "Castle now — king safety first, then counterattack." },
    { type: 'instruction', fen: FEN_L2.after_e5_w, text: "6.e5 — here comes the storm! White advances aggressively.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN_L2.after_e5_w, text: "Don't panic — retreat the knight. Nfd7 keeps it active and prepares ...c5 to strike back." },
    { type: 'play-move', fen: FEN_L2.after_e5_w, correctMove: 'Nfd7', prompt: "Retreat the knight — regroup!", hint: "The knight on f6 is attacked. Move it to d7.", correctFeedback: "Nfd7! Smart retreat. The knight supports a future ...c5 counterattack.", wrongFeedback: "Play Nfd7 — retreat to d7 and prepare ...c5.", highlightSquares: ['f6', 'd7'] },
    { type: 'instruction', fen: FEN_L2.after_Nfd7, text: "You've survived the Austrian storm. The knight is safe on d7, the bishop dominates g7, and ...c5 is coming next!" },
  ],
}

// ═══════════════════════════════════════════════════════════
// LESSON 9: Counter ...c5! (L2)
// ═══════════════════════════════════════════════════════════

const PA_LESSON_9: OpeningLesson = {
  id: 'pa-9',
  title: 'Counter ...c5!',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_Be2, text: "White plays Be2, preparing to castle. Time for the key counterattack — ...c5! Strike at White's d4 pawn." },
    { type: 'play-move', fen: FEN_L2.after_Be2, correctMove: 'c5', prompt: "Strike back at the center!", hint: "Push c5 — attack White's d4 pawn.", correctFeedback: "c5! The counterattack begins. White's center is under pressure.", wrongFeedback: "Play c5 — it's the key break in the Austrian Attack.", highlightSquares: ['c7', 'c5'] },
    { type: 'instruction', fen: FEN_L2.after_Be3, text: "8.Be3 — White defends d4.", autoAdvance: 800 },
    { type: 'instruction', fen: FEN_L2.after_Be3, text: "Capture on d4 — open the position and activate your pieces." },
    { type: 'play-move', fen: FEN_L2.after_Be3, correctMove: 'cxd4', prompt: "Take the pawn!", hint: "Capture on d4 with your c-pawn.", correctFeedback: "cxd4! The center opens up and your pieces come alive.", wrongFeedback: "Capture cxd4 — open the center while you can.", highlightSquares: ['c5', 'd4'] },
    { type: 'instruction', fen: FEN_L2.after_Nxd4, text: "9.Nxd4 — White recaptures with the knight.", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.after_Nxd4, correctMove: 'Nc6', prompt: "Develop and challenge the knight!", hint: "Nc6 — attack the knight on d4.", correctFeedback: "Nc6! Your knight develops with tempo, attacking d4. Excellent counterplay!", wrongFeedback: "Play Nc6 — develop with tempo by attacking the knight.", highlightSquares: ['b8', 'c6'] },
    { type: 'instruction', fen: FEN_L2.after_Nc6_9, text: "Brilliant! You've survived the Austrian Attack and struck back. Your pieces are active, the center is open, and you have full counterplay." },
  ],
}

// ═══════════════════════════════════════════════════════════
// VARIATION 7: 2...g6 Early (L2)
// ═══════════════════════════════════════════════════════════

const PA_VAR_7: OpeningLesson = {
  id: 'pa-var-7',
  title: '2...g6 Early',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_d4, text: "A flexible move order — play g6 before Nf6. This commits less early." },
    { type: 'play-move', fen: FEN_L2.after_d4, correctMove: 'g6', prompt: "Play the flexible fianchetto move.", hint: "Push the g-pawn one square to prepare Bg7.", correctFeedback: "Nice! g6 keeps your options open before committing the knight.", wrongFeedback: "Try g6 — fianchetto first, knight later.", highlightSquares: ['g7', 'g6'] },
    { type: 'instruction', fen: FEN_L2.v7_after_c4, text: "3.c4", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v7_after_c4, correctMove: 'Bg7', prompt: "Develop your dark-squared bishop.", hint: "The bishop belongs on g7, controlling the long diagonal.", correctFeedback: "Perfect! The bishop on g7 is a powerhouse on the long diagonal.", wrongFeedback: "Develop the bishop to g7 — complete the fianchetto.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN_L2.v7_after_Nc3, text: "4.Nc3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v7_after_Nc3, correctMove: 'Nf6', prompt: "Bring out a knight to attack the center.", hint: "The king's knight targets e4.", correctFeedback: "Great! Nf6 puts pressure on White's e4 pawn.", wrongFeedback: "Develop Nf6 — the knight eyes the e4 pawn.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN_L2.v7_after_h3, text: "5.h3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v7_after_h3, correctMove: 'Nbd7', prompt: "Develop the other knight.", hint: "The queen's knight goes to d7, supporting e5 and c5 breaks.", correctFeedback: "Excellent! Nbd7 supports both ...e5 and ...c5 pawn breaks.", wrongFeedback: "Play Nbd7 — the knight supports future central breaks.", highlightSquares: ['b8', 'd7'] },
    { type: 'instruction', fen: FEN_L2.v7_after_Nbd7, text: "Solid setup! You've kept maximum flexibility." },
  ],
}

// ═══════════════════════════════════════════════════════════
// VARIATION 8: Caro Setup (L2)
// ═══════════════════════════════════════════════════════════

const PA_VAR_8: OpeningLesson = {
  id: 'pa-var-8',
  title: 'Caro Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_e4, text: "A Caro-Kann approach! Play c6 and d5 for a solid center." },
    { type: 'play-move', fen: FEN_L2.after_e4, correctMove: 'c6', prompt: "Start with the Caro-Kann move.", hint: "Push the c-pawn one square to prepare d5.", correctFeedback: "Solid! c6 prepares a strong d5 push.", wrongFeedback: "Play c6 — it sets up d5 next move.", highlightSquares: ['c7', 'c6'] },
    { type: 'instruction', fen: FEN_L2.v8_after_d4, text: "2.d4", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v8_after_d4, correctMove: 'd5', prompt: "Challenge the center directly.", hint: "Push d5 — your c6 pawn supports it.", correctFeedback: "That's the idea! d5 strikes at White's e4 pawn with full support.", wrongFeedback: "Play d5 — it's the whole point of c6.", highlightSquares: ['d7', 'd5'] },
    { type: 'instruction', fen: FEN_L2.v8_after_Nd2, text: "3.Nd2", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v8_after_Nd2, correctMove: 'dxe4', prompt: "Capture the e4 pawn.", hint: "Take on e4 — White's knight will recapture, but you'll develop your bishop next.", correctFeedback: "Good exchange! You'll get your bishop out with tempo.", wrongFeedback: "Capture dxe4 — it opens lines for your bishop.", highlightSquares: ['d5', 'e4'] },
    { type: 'instruction', fen: FEN_L2.v8_after_Nxe4, text: "4.Nxe4", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v8_after_Nxe4, correctMove: 'Bf5', prompt: "Develop your light-squared bishop actively.", hint: "The bishop goes to f5 — outside the pawn chain!", correctFeedback: "Beautiful! The bishop is active on f5, outside the pawn chain.", wrongFeedback: "Play Bf5 — get the bishop out before closing it in with e6.", highlightSquares: ['c8', 'f5'] },
    { type: 'instruction', fen: FEN_L2.v8_after_Bf5, text: "A rock-solid Caro-Kann structure! Your bishop is active on f5 and your center is secure." },
  ],
}

// ═══════════════════════════════════════════════════════════
// VARIATION 9: 2...e5 Counter (L2)
// ═══════════════════════════════════════════════════════════

const PA_VAR_9: OpeningLesson = {
  id: 'pa-var-9',
  title: '2...e5 Counter',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_d4, text: "Challenge the center immediately with e5!" },
    { type: 'play-move', fen: FEN_L2.after_d4, correctMove: 'e5', prompt: "Strike at White's d4 pawn.", hint: "Push e5 to challenge the center head-on.", correctFeedback: "Bold! e5 fights for central space immediately.", wrongFeedback: "Play e5 — challenge White's center directly.", highlightSquares: ['e7', 'e5'] },
    { type: 'instruction', fen: FEN_L2.v9_after_Nf3, text: "3.Nf3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v9_after_Nf3, correctMove: 'exd4', prompt: "Capture the d4 pawn.", hint: "Take on d4 — open the position while White's pieces are still developing.", correctFeedback: "Good trade! You've opened the center on your terms.", wrongFeedback: "Capture exd4 — exchange in the center now.", highlightSquares: ['e5', 'd4'] },
    { type: 'instruction', fen: FEN_L2.v9_after_Nxd4, text: "4.Nxd4", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v9_after_Nxd4, correctMove: 'Be7', prompt: "Develop a piece and prepare to castle.", hint: "The bishop to e7 is quiet but solid — kingside castling comes next.", correctFeedback: "Smooth development! Be7 prepares quick castling.", wrongFeedback: "Play Be7 — develop toward castling.", highlightSquares: ['f8', 'e7'] },
    { type: 'instruction', fen: FEN_L2.v9_after_Nc3, text: "5.Nc3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v9_after_Nc3, correctMove: 'Nf6', prompt: "Bring out the knight and attack e4.", hint: "Nf6 develops and pressures the e4 pawn.", correctFeedback: "The knight is perfectly placed on f6, eyeing e4.", wrongFeedback: "Play Nf6 — develop and put pressure on e4.", highlightSquares: ['g8', 'f6'] },
    { type: 'instruction', fen: FEN_L2.v9_after_Nf6, text: "You've reached a Philidor-like position with active development." },
  ],
}

// ═══════════════════════════════════════════════════════════
// VARIATION 10: Sicilian Twist (L2)
// ═══════════════════════════════════════════════════════════

const PA_VAR_10: OpeningLesson = {
  id: 'pa-var-10',
  title: 'Sicilian Twist',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_e4, text: "The Sicilian Defense! A fighting weapon against 1.e4." },
    { type: 'play-move', fen: FEN_L2.after_e4, correctMove: 'c5', prompt: "Play the Sicilian move.", hint: "Push c5 — fight for the center asymmetrically.", correctFeedback: "The Sicilian! Black's most popular and combative reply to 1.e4.", wrongFeedback: "Play c5 — the Sicilian Defense.", highlightSquares: ['c7', 'c5'] },
    { type: 'instruction', fen: FEN_L2.v10_after_Nf3, text: "2.Nf3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v10_after_Nf3, correctMove: 'd6', prompt: "Support your center and prepare development.", hint: "d6 controls e5 and opens a path for the dark-squared bishop.", correctFeedback: "Solid! d6 holds the center and prepares piece development.", wrongFeedback: "Play d6 — control e5 and prepare your bishops.", highlightSquares: ['d7', 'd6'] },
    { type: 'instruction', fen: FEN_L2.v10_after_Nc3, text: "3.Nc3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v10_after_Nc3, correctMove: 'a6', prompt: "A key prophylactic move.", hint: "a6 prevents Bb5 and prepares queenside expansion with b5.", correctFeedback: "The Najdorf move! a6 is one of the most important moves in chess theory.", wrongFeedback: "Play a6 — prevent Bb5 and prepare b5.", highlightSquares: ['a7', 'a6'] },
    { type: 'instruction', fen: FEN_L2.v10_after_d4, text: "4.d4", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v10_after_d4, correctMove: 'cxd4', prompt: "Capture the d4 pawn.", hint: "Take on d4 — open the c-file for your rook later.", correctFeedback: "The c-file is open! Your rook will love it.", wrongFeedback: "Capture cxd4 — open the c-file for counterplay.", highlightSquares: ['c5', 'd4'] },
    { type: 'instruction', fen: FEN_L2.v10_after_cxd4, text: "The Najdorf setup! a6 prepares b5 expansion and you've opened the c-file." },
  ],
}

// ═══════════════════════════════════════════════════════════
// VARIATION 11: Solid ...e6 (L2)
// ═══════════════════════════════════════════════════════════

const PA_VAR_11: OpeningLesson = {
  id: 'pa-var-11',
  title: 'Solid ...e6',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_Nc3, text: "A solid French-like setup with e6. Less flashy but very reliable." },
    { type: 'play-move', fen: FEN_L2.after_Nc3, correctMove: 'e6', prompt: "Set up a solid pawn structure.", hint: "e6 creates a strong pawn chain and keeps things solid.", correctFeedback: "Rock solid! e6 gives you a reliable, flexible structure.", wrongFeedback: "Play e6 — build a sturdy pawn chain.", highlightSquares: ['e7', 'e6'] },
    { type: 'instruction', fen: FEN_L2.v11_after_Nf3, text: "4.Nf3", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v11_after_Nf3, correctMove: 'Nbd7', prompt: "Develop the queen's knight.", hint: "Nbd7 supports the e5 and c5 pawn breaks.", correctFeedback: "Flexible! Nbd7 keeps both central breaks available.", wrongFeedback: "Play Nbd7 — it supports both ...e5 and ...c5.", highlightSquares: ['b8', 'd7'] },
    { type: 'instruction', fen: FEN_L2.v11_after_Be2, text: "5.Be2", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v11_after_Be2, correctMove: 'a6', prompt: "A useful prophylactic move.", hint: "a6 prevents Bb5 ideas and prepares queenside expansion.", correctFeedback: "Smart! a6 stops any Bb5 tricks and sets up b5 later.", wrongFeedback: "Play a6 — prevent Bb5 and prepare b5.", highlightSquares: ['a7', 'a6'] },
    { type: 'instruction', fen: FEN_L2.v11_after_a4, text: "6.a4", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v11_after_a4, correctMove: 'Be7', prompt: "Develop the bishop and prepare castling.", hint: "Be7 is calm and solid — castle next.", correctFeedback: "Smooth! Be7 completes development and you're ready to castle.", wrongFeedback: "Play Be7 — get the bishop out and prepare to castle.", highlightSquares: ['f8', 'e7'] },
    { type: 'instruction', fen: FEN_L2.v11_after_Be7, text: "A Scheveningen-like setup! Flexible and ready for ...b6, ...Bb7, or ...c5." },
  ],
}

// ═══════════════════════════════════════════════════════════
// VARIATION 12: 3...Nc6 Active (L2)
// ═══════════════════════════════════════════════════════════

const PA_VAR_12: OpeningLesson = {
  id: 'pa-var-12',
  title: '3...Nc6 Active',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN_L2.after_f4, text: "Develop Nc6 early — more active, challenging White's center directly." },
    { type: 'play-move', fen: FEN_L2.after_f4, correctMove: 'Nc6', prompt: "Develop the knight actively.", hint: "Nc6 eyes the d4 pawn and develops with purpose.", correctFeedback: "Active development! The knight pressures d4.", wrongFeedback: "Play Nc6 — put pressure on White's center.", highlightSquares: ['b8', 'c6'] },
    { type: 'instruction', fen: FEN_L2.v12_after_Be2, text: "5.Be2", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v12_after_Be2, correctMove: 'Bg7', prompt: "Complete the fianchetto.", hint: "The bishop belongs on g7 — it's the heart of the Pirc.", correctFeedback: "The dragon bishop! g7 is its natural home.", wrongFeedback: "Play Bg7 — complete the fianchetto.", highlightSquares: ['f8', 'g7'] },
    { type: 'instruction', fen: FEN_L2.v12_after_Nf3, text: "6.Nf3", autoAdvance: 800 },
    { type: 'instruction', fen: FEN_L2.v12_after_Nf3, text: "Time for the central break — d5 challenges White's center head-on!" },
    { type: 'play-move', fen: FEN_L2.v12_after_Nf3, correctMove: 'd5', prompt: "Strike in the center!", hint: "d5 breaks open the center when White is overextended.", correctFeedback: "The central break! d5 challenges White's entire setup.", wrongFeedback: "Play d5 — now is the time to break in the center.", highlightSquares: ['d6', 'd5'] },
    { type: 'instruction', fen: FEN_L2.v12_after_e5_w, text: "7.e5 — White advances", autoAdvance: 800 },
    { type: 'play-move', fen: FEN_L2.v12_after_e5_w, correctMove: 'Ne4', prompt: "Jump into the outpost!", hint: "The knight leaps to e4 — a powerful central square.", correctFeedback: "Dominant! The knight on e4 is untouchable and powerful.", wrongFeedback: "Play Ne4 — the knight lands on a perfect outpost.", highlightSquares: ['f6', 'e4'] },
    { type: 'instruction', fen: FEN_L2.v12_after_Ne4, text: "The knight lands on e4 — a powerful outpost! Active and aggressive." },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

const PIRC_AUSTRIAN_LESSONS: Record<string, OpeningLesson> = {
  // L1
  'pa-1': PA_LESSON_1,
  'pa-2': PA_LESSON_2,
  'pa-punish-e5': PA_PUNISH_E5,
  'pa-3': PA_LESSON_3,
  'pa-4': PA_LESSON_4,
  'pa-punish-fxe5': PA_PUNISH_FXES5,
  'pa-5': PA_LESSON_5,
  'pa-punish-Nxe5': PA_PUNISH_NXE5,
  'pa-6': PA_LESSON_6,
  'pa-test-1': PA_TEST_1,
  // L2
  'pa-7': PA_LESSON_7,
  'pa-8': PA_LESSON_8,
  'pa-9': PA_LESSON_9,
  'pa-var-7': PA_VAR_7,
  'pa-var-8': PA_VAR_8,
  'pa-var-9': PA_VAR_9,
  'pa-var-10': PA_VAR_10,
  'pa-var-11': PA_VAR_11,
  'pa-var-12': PA_VAR_12,
}

export function getPircAustrianLesson(id: string): OpeningLesson | undefined {
  return PIRC_AUSTRIAN_LESSONS[id]
}
