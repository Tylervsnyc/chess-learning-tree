import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN SCHEVENINGEN LESSONS (ss-1 through ss-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity: 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6
// Main line (Be2 Classical):
//   6.Be2 Be7 7.O-O O-O 8.f4 Nc6 9.Be3 e5 10.Nb3 exf4 11.Bxf4 Be6
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 5...e6, White to move)
  after_identity:  'rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',

  // Main line
  after_Be2:       'rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 1 6',
  after_Be7:       'rnbqk2r/pp2bppp/3ppn2/8/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq - 2 7',
  after_OO_w:      'rnbqk2r/pp2bppp/3ppn2/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 b kq - 3 7',
  after_OO:        'rnbq1rk1/pp2bppp/3ppn2/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w - - 4 8',
  after_f4:        'rnbq1rk1/pp2bppp/3ppn2/8/3NPP2/2N5/PPP1B1PP/R1BQ1RK1 b - - 0 8',
  after_Nc6:       'r1bq1rk1/pp2bppp/2nppn2/8/3NPP2/2N5/PPP1B1PP/R1BQ1RK1 w - - 1 9',
  after_Be3:       'r1bq1rk1/pp2bppp/2nppn2/8/3NPP2/2N1B3/PPP1B1PP/R2Q1RK1 b - - 2 9',
  after_e5:        'r1bq1rk1/pp2bppp/2np1n2/4p3/3NPP2/2N1B3/PPP1B1PP/R2Q1RK1 w - - 0 10',
  after_Nb3:       'r1bq1rk1/pp2bppp/2np1n2/4p3/4PP2/1NN1B3/PPP1B1PP/R2Q1RK1 b - - 1 10',
  after_exf4:      'r1bq1rk1/pp2bppp/2np1n2/8/4Pp2/1NN1B3/PPP1B1PP/R2Q1RK1 w - - 0 11',
  after_Bxf4:      'r1bq1rk1/pp2bppp/2np1n2/8/4PB2/1NN5/PPP1B1PP/R2Q1RK1 b - - 0 11',
  after_Be6:       'r2q1rk1/pp2bppp/2npbn2/8/4PB2/1NN5/PPP1B1PP/R2Q1RK1 w - - 1 12',

  // Deviation: 6.f4 (instead of 6.Be2)
  dev_after_f4:    'rnbqkb1r/pp3ppp/3ppn2/8/3NPP2/2N5/PPP3PP/R1BQKB1R b KQkq - 0 6',
  dev_after_a6:    'rnbqkb1r/1p3ppp/p2ppn2/8/3NPP2/2N5/PPP3PP/R1BQKB1R w KQkq - 0 7',
  dev_after_Qf3:   'rnbqkb1r/1p3ppp/p2ppn2/8/3NPP2/2N2Q2/PPP3PP/R1B1KB1R b KQkq - 1 7',
  dev_after_Qb6:   'rnb1kb1r/1p3ppp/pq1ppn2/8/3NPP2/2N2Q2/PPP3PP/R1B1KB1R w KQkq - 2 8',
  dev_after_Nb3:   'rnb1kb1r/1p3ppp/pq1ppn2/8/4PP2/1NN2Q2/PPP3PP/R1B1KB1R b KQkq - 3 8',
  dev_after_Qc7:   'rnb1kb1r/1pq2ppp/p2ppn2/8/4PP2/1NN2Q2/PPP3PP/R1B1KB1R w KQkq - 4 9',
}


// ═══════════════════════════════════════════════════════════
// ss-1: The Classical Setup (Be7, O-O, Nc6)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SS_1: OpeningLesson = {
  id: 'ss-1',
  title: 'The Classical Setup',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_identity, text: "The Scheveningen starts after 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6. You've built a solid pawn triangle on d6 and e6 — now it's time to develop." },

    // White plays 6.Be2
    { type: 'instruction', fen: FEN.after_identity, text: 'White develops the bishop to e2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },

    // PREDICT 1: Be7
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Be7', prompt: 'White just developed a bishop. How do you develop yours?', hint: 'Put the bishop on e7 — a natural, solid square.', correctFeedback: 'Be7 develops the bishop and prepares to castle kingside.', wrongFeedback: 'Develop the bishop to e7 — it connects with castling.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'Be7 is the classical choice. The bishop is solid on e7, and kingside castling is ready next move.', arrow: ['f8', 'e7'] },

    // White plays 7.O-O
    { type: 'instruction', fen: FEN.after_Be7, text: 'White castles kingside.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'O-O', prompt: 'White just castled. What should you do?', hint: 'Get your king to safety too.', correctFeedback: 'Castles! Your king is safe and the rook is ready on f8.', wrongFeedback: 'Castle kingside — tuck the king away before the middlegame.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'Both sides have castled. The position is balanced and the real fight is about to begin.', arrow: ['e8', 'g8'] },

    // White plays 8.f4
    { type: 'instruction', fen: FEN.after_OO, text: 'White pushes f4, grabbing space and eyeing a kingside attack.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },

    // PREDICT 3: Nc6
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Nc6', prompt: 'White is expanding on the kingside. How do you develop your last minor piece?', hint: 'Bring the knight to c6 — it develops and pressures the d4 knight.', correctFeedback: 'Nc6 develops the knight and puts pressure on the d4 knight.', wrongFeedback: 'Develop the knight to c6 — it challenges the center.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 develops naturally and pressures the d4 knight. White will have to decide where to move it.', arrow: ['b8', 'c6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_identity, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_identity, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },

    { type: 'instruction', fen: FEN.after_Nc6, text: "Be7, O-O, Nc6 — the Classical Scheveningen setup. Solid development, king safe, and ready for the central break." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ss-2: The Central Break (e5, exf4, Be6)
// ═══════════════════════════════════════════════════════════

const SS_2: OpeningLesson = {
  id: 'ss-2',
  title: 'The Central Break',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Nc6, text: "White develops the bishop to e3. You'll break in the center with e5 and free your light-squared bishop." },

    // RECAP
    { type: 'instruction', fen: FEN.after_identity, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_identity, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },

    // White plays 9.Be3
    { type: 'instruction', fen: FEN.after_Nc6, text: 'White plays Be3, developing the last minor piece and defending d4.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // PREDICT 1: e5
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: "White has built a strong center. How do you challenge it?", hint: 'Push the e-pawn forward to attack the f4 pawn and open lines.', correctFeedback: 'e5 strikes at the heart of White\'s center, challenging f4 directly.', wrongFeedback: 'Push e5 — break open the center while your pieces are ready.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5 is the key Scheveningen break. The e6-d6 pawn duo has transformed into an active central presence, attacking f4.', arrow: ['e6', 'e5'] },

    // White plays 10.Nb3
    { type: 'instruction', fen: FEN.after_e5, text: 'White retreats the knight to b3, getting out of the center.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },

    // PREDICT 2: exf4
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'exf4', prompt: 'The knight moved away. How do you continue the central action?', hint: 'Capture the f4 pawn — open lines for your pieces.', correctFeedback: 'exf4 wins the f4 pawn and opens the e-file for your rook.', wrongFeedback: 'Take on f4 — exf4 opens the position in your favor.' },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4 captures the pawn and opens the e-file. Your rook on f8 and bishop on c8 will both benefit from the open lines.', arrow: ['e5', 'f4'] },

    // White plays 11.Bxf4
    { type: 'instruction', fen: FEN.after_exf4, text: 'White recaptures with the bishop, Bxf4.', autoAdvance: 800, highlightSquares: ['e3', 'f4'] },

    // PREDICT 3: Be6
    { type: 'play-move', fen: FEN.after_Bxf4, correctMove: 'Be6', prompt: 'The center is open. How do you develop your last undeveloped piece?', hint: 'The light-squared bishop belongs on e6, where it controls key central squares.', correctFeedback: 'Be6 develops the bishop to its best square, controlling d5 and connecting the rooks.', wrongFeedback: 'Put the bishop on e6 — it activates beautifully now that e6 is free.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Be6 is the natural home for this bishop. It controls d5, supports a future d5 push, and your development is complete.', arrow: ['c8', 'e6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nc6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'exf4', prompt: 'Your move.', hint: 'exf4.', correctFeedback: 'exf4.', wrongFeedback: 'exf4.' },
    { type: 'instruction', fen: FEN.after_exf4, text: 'Bxf4.', autoAdvance: 800, highlightSquares: ['e3', 'f4'] },
    { type: 'play-move', fen: FEN.after_Bxf4, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    { type: 'instruction', fen: FEN.after_Be6, text: "e5, exf4, Be6 — you broke open the center and completed your development. The Scheveningen is fully activated." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ss-dev-f4: Deviation (6.f4 instead of 6.Be2)
// Black plays: a6, Qb6, Qc7
// ═══════════════════════════════════════════════════════════

const SS_DEV_F4: OpeningLesson = {
  id: 'ss-dev-f4',
  title: 'Dev 6.f4',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_identity, text: "Sometimes White skips development and plays f4 immediately. It's aggressive, but you can take advantage of the early queen sortie." },

    // RECAP to deviation point (identity moves — user doesn't replay identity, just the setup context)
    // Since the deviation branches from the identity position (before lesson 1), there are no user moves to recap.
    // Go straight to deviation setup.

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_identity, text: 'White plays f4 instead of Be2 — an aggressive approach aiming for a quick kingside attack.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },

    // PREDICT 1: a6
    { type: 'play-move', fen: FEN.dev_after_f4, correctMove: 'a6', prompt: 'White pushed f4 early. What useful preparatory move can you make?', hint: 'Play a6 — it prepares b5 and takes the b5 square away from White\'s pieces.', correctFeedback: 'a6 is a flexible move that prepares b5 and stops Bb5+.', wrongFeedback: 'Play a6 — it prevents Bb5+ and sets up queenside expansion.' },
    { type: 'instruction', fen: FEN.dev_after_a6, text: 'a6 is a multi-purpose move. It prevents Bb5+ check, prepares b5 for queenside counterplay, and keeps your options open.', arrow: ['a7', 'a6'] },

    // White plays 7.Qf3
    { type: 'instruction', fen: FEN.dev_after_a6, text: 'White plays Qf3, placing the queen on an unusual square to eye the kingside.', autoAdvance: 800, highlightSquares: ['d1', 'f3'] },

    // PREDICT 2: Qb6
    { type: 'play-move', fen: FEN.dev_after_Qf3, correctMove: 'Qb6', prompt: "White's queen came to f3. How do you create counterplay?", hint: 'Activate the queen to b6 — it pressures b2 and the d4 knight.', correctFeedback: 'Qb6 attacks the b2 pawn and puts pressure on the d4 knight.', wrongFeedback: 'Play Qb6 — it targets the b2 pawn and the d4 knight.' },
    { type: 'instruction', fen: FEN.dev_after_Qb6, text: 'Qb6 is a strong reply. The queen attacks b2 and the knight on d4, forcing White to deal with multiple threats.', arrow: ['d8', 'b6'] },

    // White plays 8.Nb3
    { type: 'instruction', fen: FEN.dev_after_Qb6, text: 'White retreats the knight to b3, defending against the queen\'s threats.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },

    // PREDICT 3: Qc7
    { type: 'play-move', fen: FEN.dev_after_Nb3, correctMove: 'Qc7', prompt: 'The knight retreated. Where does the queen go now?', hint: 'Bring the queen back to c7 — it stays active and eyes the c-file.', correctFeedback: 'Qc7 repositions the queen to a flexible square, supporting both the center and kingside.', wrongFeedback: 'Play Qc7 — the queen is well-placed there, supporting d6 and eyeing the c-file.' },
    { type: 'instruction', fen: FEN.dev_after_Qc7, text: 'Qc7 is the perfect square. The queen supports d6, keeps an eye on the c-file, and stays flexible. You forced White to retreat the knight and are ready to develop normally.', arrow: ['b6', 'c7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_identity, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_identity, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.dev_after_f4, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.dev_after_a6, text: 'Qf3.', autoAdvance: 800, highlightSquares: ['d1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_after_Qf3, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.dev_after_Qb6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.dev_after_Nb3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },

    { type: 'instruction', fen: FEN.dev_after_Qc7, text: "a6, Qb6, Qc7 — against 6.f4, you made White waste time and the queen ended up perfectly placed." },
  ],
}


// ═══════════════════════════════════════════════════════════
// ss-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const SS_TEST_1: OpeningLesson = {
  id: 'ss-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (6 Black moves) ===
    { type: 'instruction', fen: FEN.after_identity, text: 'Be2.', autoAdvance: 800, highlightSquares: ['f1', 'e2'] },
    { type: 'play-move', fen: FEN.after_Be2, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.after_Be7, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO_w, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'Nc6', prompt: 'Your move.', hint: 'Nc6.', correctFeedback: 'Nc6.', wrongFeedback: 'Nc6.' },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    { type: 'play-move', fen: FEN.after_Be3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Nb3, correctMove: 'exf4', prompt: 'Your move.', hint: 'exf4.', correctFeedback: 'exf4.', wrongFeedback: 'exf4.' },
    { type: 'instruction', fen: FEN.after_exf4, text: 'Bxf4.', autoAdvance: 800, highlightSquares: ['e3', 'f4'] },
    { type: 'play-move', fen: FEN.after_Bxf4, correctMove: 'Be6', prompt: 'Your move.', hint: 'Be6.', correctFeedback: 'Be6.', wrongFeedback: 'Be6.' },

    // === DEVIATION TEST: 6.f4 ===
    { type: 'instruction', fen: FEN.after_identity, text: 'Now White plays f4 instead.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.dev_after_f4, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.dev_after_a6, text: 'Qf3.', autoAdvance: 800, highlightSquares: ['d1', 'f3'] },
    { type: 'play-move', fen: FEN.dev_after_Qf3, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.dev_after_Qb6, text: 'Nb3.', autoAdvance: 800, highlightSquares: ['d4', 'b3'] },
    { type: 'play-move', fen: FEN.dev_after_Nb3, correctMove: 'Qc7', prompt: 'Your move.', hint: 'Qc7.', correctFeedback: 'Qc7.', wrongFeedback: 'Qc7.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SCHEVENINGEN_LESSONS: Record<string, OpeningLesson> = {
  'ss-1': SS_1,
  'ss-2': SS_2,
  'ss-dev-f4': SS_DEV_F4,
  'ss-test-1': SS_TEST_1,
}

export function getSicilianScheveningenLesson(id: string): OpeningLesson | undefined {
  return SCHEVENINGEN_LESSONS[id]
}
