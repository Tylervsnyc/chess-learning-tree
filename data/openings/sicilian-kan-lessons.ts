import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN KAN/PAULSEN LESSONS (sk-1 through sk-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6
// Main line: 5.Bd3 Bc5 6.Nb3 Be7 7.Qg4 g6 8.Qe2 d6
//            9.O-O Nd7 10.Nc3 Qc7
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6)
  after_a6: 'rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5',

  // Main line from move 5
  after_Bd3: 'rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/3B4/PPP2PPP/RNBQK2R b KQkq - 1 5',
  after_Bc5: 'rnbqk1nr/1p1p1ppp/p3p3/2b5/3NP3/3B4/PPP2PPP/RNBQK2R w KQkq - 2 6',
  after_Nb3: 'rnbqk1nr/1p1p1ppp/p3p3/2b5/4P3/1N1B4/PPP2PPP/RNBQK2R b KQkq - 3 6',
  after_Be7: 'rnbqk1nr/1p1pbppp/p3p3/8/4P3/1N1B4/PPP2PPP/RNBQK2R w KQkq - 4 7',
  after_Qg4: 'rnbqk1nr/1p1pbppp/p3p3/8/4P1Q1/1N1B4/PPP2PPP/RNB1K2R b KQkq - 5 7',
  after_g6: 'rnbqk1nr/1p1pbp1p/p3p1p1/8/4P1Q1/1N1B4/PPP2PPP/RNB1K2R w KQkq - 0 8',

  // Lesson 2 main line
  after_Qe2: 'rnbqk1nr/1p1pbp1p/p3p1p1/8/4P3/1N1B4/PPP1QPPP/RNB1K2R b KQkq - 1 8',
  after_d6: 'rnbqk1nr/1p2bp1p/p2pp1p1/8/4P3/1N1B4/PPP1QPPP/RNB1K2R w KQkq - 0 9',
  after_OO: 'rnbqk1nr/1p2bp1p/p2pp1p1/8/4P3/1N1B4/PPP1QPPP/RNB2RK1 b kq - 1 9',
  after_Nd7: 'r1bqk1nr/1p1nbp1p/p2pp1p1/8/4P3/1N1B4/PPP1QPPP/RNB2RK1 w kq - 2 10',
  after_Nc3: 'r1bqk1nr/1p1nbp1p/p2pp1p1/8/4P3/1NNB4/PPP1QPPP/R1B2RK1 b kq - 3 10',
  after_Qc7: 'r1b1k1nr/1pqnbp1p/p2pp1p1/8/4P3/1NNB4/PPP1QPPP/R1B2RK1 w kq - 4 11',

  // Deviation: 7.O-O (instead of 7.Qg4)
  dev_after_OO: 'rnbqk1nr/1p1pbppp/p3p3/8/4P3/1N1B4/PPP2PPP/RNBQ1RK1 b kq - 5 7',
  dev_after_d6: 'rnbqk1nr/1p2bppp/p2pp3/8/4P3/1N1B4/PPP2PPP/RNBQ1RK1 w kq - 0 8',
  dev_after_c4: 'rnbqk1nr/1p2bppp/p2pp3/8/2P1P3/1N1B4/PP3PPP/RNBQ1RK1 b kq - 0 8',
  dev_after_Nf6: 'rnbqk2r/1p2bppp/p2ppn2/8/2P1P3/1N1B4/PP3PPP/RNBQ1RK1 w kq - 1 9',
  dev_after_Nc3: 'rnbqk2r/1p2bppp/p2ppn2/8/2P1P3/1NNB4/PP3PPP/R1BQ1RK1 b kq - 2 9',
  dev_after_b6: 'rnbqk2r/4bppp/pp1ppn2/8/2P1P3/1NNB4/PP3PPP/R1BQ1RK1 w kq - 0 10',
}


// ═══════════════════════════════════════════════════════════
// sk-1: Bishop Maneuver (Bc5, Be7, g6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SK_1: OpeningLesson = {
  id: 'sk-1',
  title: 'Bishop Maneuver',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_a6, text: "The Sicilian Kan starts after 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6. The little pawn move ...a6 keeps your options open — now you'll develop the bishop." },

    // White plays 5.Bd3
    { type: 'instruction', fen: FEN.after_a6, text: 'White develops the bishop to d3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // PREDICT 1: Bc5
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bc5', prompt: 'White developed a bishop. Where does yours belong?', hint: 'Put the bishop on c5 — it targets the knight on d4.', correctFeedback: 'Bc5 develops with tempo, putting pressure on the d4 knight.', wrongFeedback: 'Develop to c5 — your bishop attacks the knight on d4.' },
    { type: 'instruction', fen: FEN.after_Bc5, text: 'Bc5 is the most popular move. The bishop immediately pressures the d4 knight, forcing White to deal with it.', arrow: ['f8', 'c5'] },

    // White plays 6.Nb3
    { type: 'instruction', fen: FEN.after_Bc5, text: 'White retreats the knight to b3, escaping the attack.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },

    // PREDICT 2: Be7
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: 'The knight moved away. What do you do with your bishop now?', hint: 'Retreat the bishop to e7 — it served its purpose on c5.', correctFeedback: 'Be7 tucks the bishop to a safe square. It did its job pushing the knight off d4.', wrongFeedback: 'Pull the bishop back to e7 — it forced the knight away, mission accomplished.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7 looks quiet, but the bishop maneuver Bc5-Be7 cost White a tempo with the knight. The knight on b3 is less active than on d4.', arrow: ['c5', 'e7'] },

    // White plays 7.Qg4
    { type: 'instruction', fen: FEN.after_Be7, text: 'White brings the queen to g4, attacking g7.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },

    // PREDICT 3: g6
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'g6', prompt: 'The queen is eyeing g7. How do you defend?', hint: 'Push g6 to block the queen from targeting g7.', correctFeedback: 'g6 calmly blocks the queen. The pawn wall holds and your kingside stays solid.', wrongFeedback: 'Play g6 — it blocks the queen and keeps your position solid.' },
    { type: 'instruction', fen: FEN.after_g6, text: "g6 is the standard response. The queen on g4 has no good targets now — White will have to retreat it.", arrow: ['g7', 'g6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_a6, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_a6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_Bc5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    { type: 'instruction', fen: FEN.after_g6, text: "Bc5, Be7, g6 — you forced the knight off d4, tucked the bishop away, and shut down the queen. The Kan is all about these little tricks." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sk-2: Solid Setup (d6, Nd7, Qc7)
// ═══════════════════════════════════════════════════════════

const SK_2: OpeningLesson = {
  id: 'sk-2',
  title: 'Solid Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_g6, text: "The queen retreats. Now you'll build a solid formation with d6, develop the knight, and activate your queen." },

    // RECAP
    { type: 'instruction', fen: FEN.after_a6, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_a6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_Bc5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },

    // White plays 8.Qe2
    { type: 'instruction', fen: FEN.after_g6, text: 'White retreats the queen to e2.', autoAdvance: 800, highlightSquares: ['g4', 'e2'] },

    // PREDICT 1: d6
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'd6', prompt: 'The queen pulled back. How do you strengthen your center?', hint: 'Play d6 to support e5 and give the bishop on c8 room.', correctFeedback: 'd6 builds a solid pawn center and opens the diagonal for your light-squared bishop.', wrongFeedback: 'Play d6 — it supports the center and frees the bishop on c8.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 is the natural follow-up. It controls e5, supports a future ...Nd7, and the bishop on c8 now has a way out.', arrow: ['d7', 'd6'] },

    // White plays 9.O-O
    { type: 'instruction', fen: FEN.after_d6, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 2: Nd7
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nd7', prompt: 'How do you develop the knight without blocking the bishop?', hint: 'Nd7 develops toward e5 or c5 without blocking the c8 bishop.', correctFeedback: 'Nd7 develops the knight flexibly — it can go to e5, c5, or f6 later.', wrongFeedback: 'Bring the knight to d7 — it keeps all your options open.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nd7 is the Kan way. The knight stays flexible — it can jump to e5 for a central outpost or c5 to pressure the b3 knight.', arrow: ['b8', 'd7'] },

    // White plays 10.Nc3
    { type: 'instruction', fen: FEN.after_Nd7, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 3: Qc7
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Time to activate a major piece. Where does the queen go?', hint: 'Qc7 activates the queen and connects the rooks.', correctFeedback: 'Qc7 gets the queen active on the c-file and prepares to connect your rooks.', wrongFeedback: 'Play Qc7 — the queen is active there and helps coordinate your pieces.' },
    { type: 'instruction', fen: FEN.after_Qc7, text: 'Qc7 is a multi-purpose move. The queen eyes the c-file, supports a future ...b5 push, and keeps an eye on the kingside.', arrow: ['d8', 'c7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_g6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_g6, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['g4', 'e2'] },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },

    { type: 'instruction', fen: FEN.after_Qc7, text: "d6, Nd7, Qc7 — you've built a rock-solid setup. Your pieces are flexible and ready for anything." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sk-dev-OO: Deviation (7.O-O instead of 7.Qg4)
// Black plays: d6, Nf6, b6
// ═══════════════════════════════════════════════════════════

const SK_DEV_OO: OpeningLesson = {
  id: 'sk-dev-OO',
  title: 'Dev 7.O-O',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Be7, text: "Sometimes White castles immediately instead of playing Qg4. The plan changes — here's how you respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_a6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_a6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_Bc5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Be7, text: 'White castles kingside instead of playing Qg4 — a quieter approach.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 1: d6
    { type: 'play-move', fen: FEN.dev_after_OO, correctMove: 'd6', prompt: 'White castled early. How do you set up your center?', hint: 'Play d6 to control e5 and free the light-squared bishop.', correctFeedback: 'd6 builds a solid center. Without the queen on g4, you can develop more calmly.', wrongFeedback: 'Play d6 — build a solid center first.' },
    { type: 'instruction', fen: FEN.dev_after_d6, text: "d6 is natural here. You don't need to worry about g6 since there's no queen on g4. Just build solidly.", arrow: ['d7', 'd6'] },

    // White plays 8.c4
    { type: 'instruction', fen: FEN.dev_after_d6, text: 'White pushes c4, grabbing space in the center.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // PREDICT 2: Nf6
    { type: 'play-move', fen: FEN.dev_after_c4, correctMove: 'Nf6', prompt: 'White expanded in the center. How do you develop?', hint: 'Bring the knight to f6 — it controls d5 and e4.', correctFeedback: 'Nf6 develops the knight to its ideal square, contesting d5 and eyeing e4.', wrongFeedback: 'Play Nf6 — the knight belongs on this central square.' },
    { type: 'instruction', fen: FEN.dev_after_Nf6, text: 'Nf6 is the top choice. The knight fights for d5 and keeps pressure on e4. A natural developing move.', arrow: ['g8', 'f6'] },

    // White plays 9.Nc3
    { type: 'instruction', fen: FEN.dev_after_Nf6, text: 'White develops the knight to c3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // PREDICT 3: b6
    { type: 'play-move', fen: FEN.dev_after_Nc3, correctMove: 'b6', prompt: 'Both knights are out. What is your next plan?', hint: 'Prepare to fianchetto the bishop with b6.', correctFeedback: 'b6 prepares Bb7, getting the bishop to a powerful diagonal aimed at e4.', wrongFeedback: 'Play b6 — fianchetto the bishop to b7 where it targets e4.' },
    { type: 'instruction', fen: FEN.dev_after_b6, text: 'b6 prepares ...Bb7 next. The bishop will sit on the long diagonal, pressuring e4 and supporting central play.', arrow: ['b7', 'b6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Be7, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Be7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_after_OO, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.dev_after_d6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.dev_after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev_after_Nc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },

    { type: 'instruction', fen: FEN.dev_after_b6, text: "d6, Nf6, b6 — against the quiet 7.O-O, you build solidly and prepare the bishop fianchetto. Simple and effective." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sk-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const SK_TEST_1: OpeningLesson = {
  id: 'sk-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (6 Black moves) ===
    { type: 'instruction', fen: FEN.after_a6, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    { type: 'play-move', fen: FEN.after_Bd3, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_Bc5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Qg4.', autoAdvance: 800, highlightSquares: ['d1', 'g4'] },
    { type: 'play-move', fen: FEN.after_Qg4, correctMove: 'g6', prompt: 'Your move.', hint: 'g6.', correctFeedback: 'g6.', wrongFeedback: 'g6.' },
    { type: 'instruction', fen: FEN.after_g6, text: 'Qe2.', autoAdvance: 800, highlightSquares: ['g4', 'e2'] },
    { type: 'play-move', fen: FEN.after_Qe2, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.after_d6, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Nd7', prompt: 'Your move.', hint: 'Nd7.', correctFeedback: 'Nd7.', wrongFeedback: 'Nd7.' },
    { type: 'instruction', fen: FEN.after_Nd7, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },

    // === DEVIATION TEST: 7.O-O ===
    { type: 'instruction', fen: FEN.after_Be7, text: 'Now White castles instead.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.dev_after_OO, correctMove: 'd6', prompt: 'Your move.', hint: 'd6.', correctFeedback: 'd6.', wrongFeedback: 'd6.' },
    { type: 'instruction', fen: FEN.dev_after_d6, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    { type: 'play-move', fen: FEN.dev_after_c4, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.dev_after_Nf6, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.dev_after_Nc3, correctMove: 'b6', prompt: 'Your move.', hint: 'b6.', correctFeedback: 'b6.', wrongFeedback: 'b6.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SICILIAN_KAN_LESSONS: Record<string, OpeningLesson> = {
  'sk-1': SK_1,
  'sk-2': SK_2,
  'sk-dev-OO': SK_DEV_OO,
  'sk-test-1': SK_TEST_1,
}

export function getSicilianKanLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_KAN_LESSONS[id]
}
