import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SICILIAN CLASSICAL LESSONS (sc-1 through sc-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Identity moves: 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6
// Main line: 6.Bg5 e6 7.Qd2 a6 8.O-O-O Bd7 9.f4 b5 10.Bxf6 gxf6
//            11.Kb1 Qb6 12.Nxc6 Bxc6 13.f5 b4 14.Ne2 e5
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 5...d6)
  start:                 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d6:              'r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',

  // Lesson 1: e6, a6, Bd7
  after_Bg5:             'r1bqkb1r/pp2pppp/2np1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq - 1 6',
  after_e6:              'r1bqkb1r/pp3ppp/2nppn2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R w KQkq - 0 7',
  after_Qd2:             'r1bqkb1r/pp3ppp/2nppn2/6B1/3NP3/2N5/PPPQ1PPP/R3KB1R b KQkq - 1 7',
  after_a6:              'r1bqkb1r/1p3ppp/p1nppn2/6B1/3NP3/2N5/PPPQ1PPP/R3KB1R w KQkq - 0 8',
  after_OOO:             'r1bqkb1r/1p3ppp/p1nppn2/6B1/3NP3/2N5/PPPQ1PPP/2KR1B1R b kq - 1 8',
  after_Bd7:             'r2qkb1r/1p1b1ppp/p1nppn2/6B1/3NP3/2N5/PPPQ1PPP/2KR1B1R w kq - 2 9',

  // Lesson 2: b5, gxf6, Qb6
  after_f4:              'r2qkb1r/1p1b1ppp/p1nppn2/6B1/3NPP2/2N5/PPPQ2PP/2KR1B1R b kq - 0 9',
  after_b5:              'r2qkb1r/3b1ppp/p1nppn2/1p4B1/3NPP2/2N5/PPPQ2PP/2KR1B1R w kq - 0 10',
  after_Bxf6:            'r2qkb1r/3b1ppp/p1nppB2/1p6/3NPP2/2N5/PPPQ2PP/2KR1B1R b kq - 0 10',
  after_gxf6:            'r2qkb1r/3b1p1p/p1nppp2/1p6/3NPP2/2N5/PPPQ2PP/2KR1B1R w kq - 0 11',
  after_Kb1:             'r2qkb1r/3b1p1p/p1nppp2/1p6/3NPP2/2N5/PPPQ2PP/1K1R1B1R b kq - 1 11',
  after_Qb6:             'r3kb1r/3b1p1p/pqnppp2/1p6/3NPP2/2N5/PPPQ2PP/1K1R1B1R w kq - 2 12',

  // Lesson 3: Bxc6, b4, e5
  after_Nxc6:            'r3kb1r/3b1p1p/pqNppp2/1p6/4PP2/2N5/PPPQ2PP/1K1R1B1R b kq - 0 12',
  after_Bxc6:            'r3kb1r/5p1p/pqbppp2/1p6/4PP2/2N5/PPPQ2PP/1K1R1B1R w kq - 0 13',
  after_f5:              'r3kb1r/5p1p/pqbppp2/1p3P2/4P3/2N5/PPPQ2PP/1K1R1B1R b kq - 0 13',
  after_b4:              'r3kb1r/5p1p/pqbppp2/5P2/1p2P3/2N5/PPPQ2PP/1K1R1B1R w kq - 0 14',
  after_Ne2:             'r3kb1r/5p1p/pqbppp2/5P2/1p2P3/8/PPPQN1PP/1K1R1B1R b kq - 1 14',
  after_e5:              'r3kb1r/5p1p/pqbp1p2/4pP2/1p2P3/8/PPPQN1PP/1K1R1B1R w kq - 0 15',

  // Deviation: 9.f3 (instead of 9.f4) — Be7, h6, h5
  dev_after_f3:          'r2qkb1r/1p1b1ppp/p1nppn2/6B1/3NP3/2N2P2/PPPQ2PP/2KR1B1R b kq - 0 9',
  dev_after_Be7:         'r2qk2r/1p1bbppp/p1nppn2/6B1/3NP3/2N2P2/PPPQ2PP/2KR1B1R w kq - 1 10',
  dev_after_h4:          'r2qk2r/1p1bbppp/p1nppn2/6B1/3NP2P/2N2P2/PPPQ2P1/2KR1B1R b kq - 0 10',
  dev_after_h6:          'r2qk2r/1p1bbpp1/p1nppn1p/6B1/3NP2P/2N2P2/PPPQ2P1/2KR1B1R w kq - 0 11',
  dev_after_Be3:         'r2qk2r/1p1bbpp1/p1nppn1p/8/3NP2P/2N1BP2/PPPQ2P1/2KR1B1R b kq - 1 11',
  dev_after_h5:          'r2qk2r/1p1bbpp1/p1nppn2/7p/3NP2P/2N1BP2/PPPQ2P1/2KR1B1R w kq - 0 12',
}


// ═══════════════════════════════════════════════════════════
// sc-1: The Richter-Rauzer (e6, a6, Bd7)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const SC_1: OpeningLesson = {
  id: 'sc-1',
  title: 'The Richter-Rauzer',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_d6, text: "The Sicilian Classical begins after 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6. White's about to pin your knight — here's how you handle it." },

    // White plays 6.Bg5
    { type: 'instruction', fen: FEN.after_d6, text: 'White plays Bg5, pinning your knight to the queen.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },

    // PREDICT 1: e6
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'e6', prompt: 'Your knight is pinned. How do you break the pin and develop?', hint: 'Push the e-pawn to block the pin and open a diagonal for your bishop.', correctFeedback: 'e6 breaks the pin on the knight and opens the f8-bishop.', wrongFeedback: 'Play e6 — it breaks the pin and lets your bishop develop.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'e6 is the defining move of the Classical. It blocks the pin and prepares to develop the dark-squared bishop.', arrow: ['e7', 'e6'] },

    // White plays 7.Qd2
    { type: 'instruction', fen: FEN.after_e6, text: 'White plays Qd2, connecting the rooks and preparing to castle queenside.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },

    // PREDICT 2: a6
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'a6', prompt: 'White is getting ready to castle long. What useful move can you make?', hint: 'A prophylactic pawn move on the queenside — prepare b5.', correctFeedback: 'a6 prepares the b5 push and takes away the b5 square from White\'s pieces.', wrongFeedback: 'Play a6 — it prepares b5 and keeps White\'s pieces off b5.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'a6 is a flexible move. It prepares b5 to expand on the queenside, which is where the real action happens.', arrow: ['a7', 'a6'] },

    // White plays 8.O-O-O
    { type: 'instruction', fen: FEN.after_a6, text: 'White castles queenside. The position is about to get sharp.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },

    // PREDICT 3: Bd7
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bd7', prompt: 'White just castled queenside. How do you develop your last minor piece?', hint: 'The bishop on c8 needs to come out — d7 connects everything.', correctFeedback: 'Bd7 develops the bishop and connects the rooks. It also supports a future b5 push.', wrongFeedback: 'Play Bd7 — develop the bishop and support the queenside expansion.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Bd7 completes your development on the queenside. The bishop supports b5 and keeps your position flexible.', arrow: ['c8', 'd7'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_d6, text: "Now play all three moves from memory." },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },

    { type: 'instruction', fen: FEN.after_Bd7, text: "e6, a6, Bd7 — the Richter-Rauzer setup. You've broken the pin, prepared queenside expansion, and developed everything." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-2: Queenside Expansion (b5, gxf6, Qb6)
// ═══════════════════════════════════════════════════════════

const SC_2: OpeningLesson = {
  id: 'sc-2',
  title: 'Queenside Expansion',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bd7, text: "White pushes f4 to build a kingside attack. You'll counter with queenside expansion — b5, recapture on f6, and activate the queen." },

    // RECAP
    { type: 'instruction', fen: FEN.after_d6, text: "Quick review before the new stuff." },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },

    // White plays 9.f4
    { type: 'instruction', fen: FEN.after_Bd7, text: 'White pushes f4, starting a kingside attack.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },

    // PREDICT 1: b5
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'b5', prompt: 'White is coming on the kingside. How do you fight back?', hint: 'Push the b-pawn — attack on the opposite wing.', correctFeedback: 'b5 launches your queenside counterattack. While White attacks your king, you attack theirs.', wrongFeedback: 'Play b5 — counter on the queenside where White\'s king lives.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'b5 is the classic queenside counter. Opposite-side castling means both sides race to attack the enemy king.', arrow: ['b7', 'b5'] },

    // White plays 10.Bxf6
    { type: 'instruction', fen: FEN.after_b5, text: 'White captures your knight — Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },

    // PREDICT 2: gxf6
    { type: 'play-move', fen: FEN.after_Bxf6, correctMove: 'gxf6', prompt: 'White took your knight on f6. How do you recapture?', hint: 'Take back with the g-pawn to open the g-file for your rook.', correctFeedback: 'gxf6 opens the g-file. Your rook on g8 will be staring straight at White\'s king.', wrongFeedback: 'Recapture with gxf6 — the open g-file is a weapon.' },
    { type: 'instruction', fen: FEN.after_gxf6, text: 'gxf6 gives you doubled pawns, but the open g-file is worth it. Your rook will put serious pressure on White\'s position.', arrow: ['g7', 'f6'] },

    // White plays 11.Kb1
    { type: 'instruction', fen: FEN.after_gxf6, text: 'White plays Kb1, tucking the king into the corner for safety.', autoAdvance: 800, highlightSquares: ['c1', 'b1'] },

    // PREDICT 3: Qb6
    { type: 'play-move', fen: FEN.after_Kb1, correctMove: 'Qb6', prompt: 'The king retreated. How do you increase the pressure?', hint: 'Activate the queen toward the queenside — b6 targets b2 and the d4 knight.', correctFeedback: 'Qb6 puts the queen on an active square, pressuring b2 and eyeing the d4 knight.', wrongFeedback: 'Play Qb6 — the queen becomes a queenside attacker.' },
    { type: 'instruction', fen: FEN.after_Qb6, text: 'Qb6 is aggressive. The queen targets b2 and the d4 knight, and supports a future b4 push.', arrow: ['d8', 'b6'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bd7, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6, correctMove: 'gxf6', prompt: 'Your move.', hint: 'gxf6.', correctFeedback: 'gxf6.', wrongFeedback: 'gxf6.' },
    { type: 'instruction', fen: FEN.after_gxf6, text: 'Kb1.', autoAdvance: 800, highlightSquares: ['c1', 'b1'] },
    { type: 'play-move', fen: FEN.after_Kb1, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },

    { type: 'instruction', fen: FEN.after_Qb6, text: "b5, gxf6, Qb6 — you've launched the queenside attack and opened the g-file. White's king is feeling the heat." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-3: Central Counterplay (Bxc6, b4, e5)
// ═══════════════════════════════════════════════════════════

const SC_3: OpeningLesson = {
  id: 'sc-3',
  title: 'Central Counterplay',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Qb6, text: "White trades on c6 and pushes f5. You'll recapture, kick the knight with b4, and lock the center with e5." },

    // RECAP
    { type: 'instruction', fen: FEN.after_d6, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6, correctMove: 'gxf6', prompt: 'Your move.', hint: 'gxf6.', correctFeedback: 'gxf6.', wrongFeedback: 'gxf6.' },
    { type: 'instruction', fen: FEN.after_gxf6, text: 'Kb1.', autoAdvance: 800, highlightSquares: ['c1', 'b1'] },
    { type: 'play-move', fen: FEN.after_Kb1, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },

    // White plays 12.Nxc6
    { type: 'instruction', fen: FEN.after_Qb6, text: 'White captures your knight — Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },

    // PREDICT 1: Bxc6
    { type: 'play-move', fen: FEN.after_Nxc6, correctMove: 'Bxc6', prompt: 'White took your knight on c6. How do you recapture?', hint: 'Take back with the bishop — it stays active on c6.', correctFeedback: 'Bxc6 recaptures and keeps the bishop on a strong diagonal, aiming at e4.', wrongFeedback: 'Recapture with Bxc6 — the bishop is powerful on that diagonal.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'Bxc6 keeps your bishop active. It controls the a8-h1 diagonal and puts pressure on e4.', arrow: ['d7', 'c6'] },

    // White plays 13.f5
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'White pushes f5, trying to pry open the kingside.', autoAdvance: 800, highlightSquares: ['f4', 'f5'] },

    // PREDICT 2: b4
    { type: 'play-move', fen: FEN.after_f5, correctMove: 'b4', prompt: 'White is advancing on the kingside. How do you speed up your attack?', hint: 'Push the b-pawn to kick the knight off c3.', correctFeedback: 'b4 attacks the knight on c3. White has to move it, giving you time.', wrongFeedback: 'Push b4 — force the knight to retreat.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'b4 kicks the knight off c3. White has to deal with it, which slows down the kingside attack.', arrow: ['b5', 'b4'] },

    // White plays 14.Ne2
    { type: 'instruction', fen: FEN.after_b4, text: 'White retreats the knight to e2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },

    // PREDICT 3: e5
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'e5', prompt: 'The knight retreated. How do you stabilize the center?', hint: 'Lock the center with a pawn push — block the f5 pawn.', correctFeedback: 'e5 locks the center and stops any f5 breakthrough. Your position is rock-solid.', wrongFeedback: 'Play e5 — lock the center and shut down White\'s kingside plans.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5 seals the center. The f5 pawn is blocked, White\'s attack is stalled, and your queenside pressure continues.', arrow: ['e6', 'e5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qb6, text: "Prove you know these moves!" },
    { type: 'instruction', fen: FEN.after_Qb6, text: 'Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nxc6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'f5.', autoAdvance: 800, highlightSquares: ['f4', 'f5'] },
    { type: 'play-move', fen: FEN.after_f5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    { type: 'instruction', fen: FEN.after_e5, text: "Bxc6, b4, e5 — you've recaptured cleanly, kicked the knight, and locked down the center. That's the Sicilian Classical in full flow." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-dev-f3: Deviation (9.f3 instead of 9.f4)
// Black plays: Be7, h6, h5
// ═══════════════════════════════════════════════════════════

const SC_DEV_F3: OpeningLesson = {
  id: 'sc-dev-f3',
  title: 'Dev 9.f3',
  defaultOrientation: 'black',
  steps: [
    { type: 'instruction', fen: FEN.after_Bd7, text: "Sometimes White plays f3 instead of f4 — a slower approach. You'll develop the bishop, then fight for the h-file." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.after_d6, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Bd7, text: 'White plays f3 instead of f4 — a more cautious approach that supports e4 and prepares to develop slowly.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },

    // PREDICT 1: Be7
    { type: 'play-move', fen: FEN.dev_after_f3, correctMove: 'Be7', prompt: 'White played f3 — no immediate kingside attack. How do you develop?', hint: 'Develop the dark-squared bishop to a natural square.', correctFeedback: 'Be7 develops the bishop and prepares to castle. With f3 instead of f4, there is less urgency for b5.', wrongFeedback: 'Play Be7 — develop naturally and get ready to castle.' },
    { type: 'instruction', fen: FEN.dev_after_Be7, text: 'Be7 is the right response to f3. Since White chose a slower setup, you develop calmly and prepare for the middlegame.', arrow: ['f8', 'e7'] },

    // White plays 10.h4
    { type: 'instruction', fen: FEN.dev_after_Be7, text: 'White pushes h4, starting a kingside pawn advance.', autoAdvance: 800, highlightSquares: ['h2', 'h4'] },

    // PREDICT 2: h6
    { type: 'play-move', fen: FEN.dev_after_h4, correctMove: 'h6', prompt: 'White is pushing pawns on the kingside. How do you respond?', hint: 'Challenge the bishop on g5 — put the question to it.', correctFeedback: 'h6 forces the bishop to make a decision. It also prepares h5 to block the h-pawn advance.', wrongFeedback: 'Play h6 — challenge the bishop and prepare to block with h5.' },
    { type: 'instruction', fen: FEN.dev_after_h6, text: 'h6 puts the question to the Bg5. White usually retreats with Be3, and then you can follow up with h5 to lock the kingside.', arrow: ['h7', 'h6'] },

    // White plays 11.Be3
    { type: 'instruction', fen: FEN.dev_after_h6, text: 'White retreats the bishop to e3.', autoAdvance: 800, highlightSquares: ['g5', 'e3'] },

    // PREDICT 3: h5
    { type: 'play-move', fen: FEN.dev_after_Be3, correctMove: 'h5', prompt: 'The bishop retreated. How do you shut down White\'s kingside expansion?', hint: 'Push the h-pawn forward to block White\'s h-pawn.', correctFeedback: 'h5 locks the kingside pawns. White can\'t break through on the h-file anymore.', wrongFeedback: 'Play h5 — block the h-pawn and shut down the kingside attack.' },
    { type: 'instruction', fen: FEN.dev_after_h5, text: 'h5 is a key move. The kingside is locked, and White\'s h4 pawn becomes a weakness rather than an attacker. You can focus on queenside play.', arrow: ['h6', 'h5'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Bd7, text: "Let's see what you remember!" },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'f3.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.dev_after_f3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.dev_after_Be7, text: 'h4.', autoAdvance: 800, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.dev_after_h4, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.dev_after_h6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['g5', 'e3'] },
    { type: 'play-move', fen: FEN.dev_after_Be3, correctMove: 'h5', prompt: 'Your move.', hint: 'h5.', correctFeedback: 'h5.', wrongFeedback: 'h5.' },

    { type: 'instruction', fen: FEN.dev_after_h5, text: "Be7, h6, h5 — against f3, you develop naturally and lock up the kingside. White's slow approach gives you time to play on the queenside." },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-test-1: Level Test (main line + deviation)
// ═══════════════════════════════════════════════════════════

const SC_TEST_1: OpeningLesson = {
  id: 'sc-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // === MAIN LINE (9 Black moves) ===
    { type: 'instruction', fen: FEN.after_d6, text: 'Bg5.', autoAdvance: 800, highlightSquares: ['c1', 'g5'] },
    { type: 'play-move', fen: FEN.after_Bg5, correctMove: 'e6', prompt: 'Your move.', hint: 'e6.', correctFeedback: 'e6.', wrongFeedback: 'e6.' },
    { type: 'instruction', fen: FEN.after_e6, text: 'Qd2.', autoAdvance: 800, highlightSquares: ['d1', 'd2'] },
    { type: 'play-move', fen: FEN.after_Qd2, correctMove: 'a6', prompt: 'Your move.', hint: 'a6.', correctFeedback: 'a6.', wrongFeedback: 'a6.' },
    { type: 'instruction', fen: FEN.after_a6, text: 'O-O-O.', autoAdvance: 800, highlightSquares: ['e1', 'c1'] },
    { type: 'play-move', fen: FEN.after_OOO, correctMove: 'Bd7', prompt: 'Your move.', hint: 'Bd7.', correctFeedback: 'Bd7.', wrongFeedback: 'Bd7.' },
    { type: 'instruction', fen: FEN.after_Bd7, text: 'f4.', autoAdvance: 800, highlightSquares: ['f2', 'f4'] },
    { type: 'play-move', fen: FEN.after_f4, correctMove: 'b5', prompt: 'Your move.', hint: 'b5.', correctFeedback: 'b5.', wrongFeedback: 'b5.' },
    { type: 'instruction', fen: FEN.after_b5, text: 'Bxf6.', autoAdvance: 800, highlightSquares: ['g5', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxf6, correctMove: 'gxf6', prompt: 'Your move.', hint: 'gxf6.', correctFeedback: 'gxf6.', wrongFeedback: 'gxf6.' },
    { type: 'instruction', fen: FEN.after_gxf6, text: 'Kb1.', autoAdvance: 800, highlightSquares: ['c1', 'b1'] },
    { type: 'play-move', fen: FEN.after_Kb1, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.after_Qb6, text: 'Nxc6.', autoAdvance: 800, highlightSquares: ['d4', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nxc6, correctMove: 'Bxc6', prompt: 'Your move.', hint: 'Bxc6.', correctFeedback: 'Bxc6.', wrongFeedback: 'Bxc6.' },
    { type: 'instruction', fen: FEN.after_Bxc6, text: 'f5.', autoAdvance: 800, highlightSquares: ['f4', 'f5'] },
    { type: 'play-move', fen: FEN.after_f5, correctMove: 'b4', prompt: 'Your move.', hint: 'b4.', correctFeedback: 'b4.', wrongFeedback: 'b4.' },
    { type: 'instruction', fen: FEN.after_b4, text: 'Ne2.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    { type: 'play-move', fen: FEN.after_Ne2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },

    // === DEVIATION TEST: 9.f3 ===
    { type: 'instruction', fen: FEN.after_Bd7, text: 'Now White plays f3 instead.', autoAdvance: 800, highlightSquares: ['f2', 'f3'] },
    { type: 'play-move', fen: FEN.dev_after_f3, correctMove: 'Be7', prompt: 'Your move.', hint: 'Be7.', correctFeedback: 'Be7.', wrongFeedback: 'Be7.' },
    { type: 'instruction', fen: FEN.dev_after_Be7, text: 'h4.', autoAdvance: 800, highlightSquares: ['h2', 'h4'] },
    { type: 'play-move', fen: FEN.dev_after_h4, correctMove: 'h6', prompt: 'Your move.', hint: 'h6.', correctFeedback: 'h6.', wrongFeedback: 'h6.' },
    { type: 'instruction', fen: FEN.dev_after_h6, text: 'Be3.', autoAdvance: 800, highlightSquares: ['g5', 'e3'] },
    { type: 'play-move', fen: FEN.dev_after_Be3, correctMove: 'h5', prompt: 'Your move.', hint: 'h5.', correctFeedback: 'h5.', wrongFeedback: 'h5.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SICILIAN_CLASSICAL_LESSONS: Record<string, OpeningLesson> = {
  'sc-1': SC_1,
  'sc-2': SC_2,
  'sc-3': SC_3,
  'sc-dev-f3': SC_DEV_F3,
  'sc-test-1': SC_TEST_1,
}

export function getSicilianClassicalLesson(id: string): OpeningLesson | undefined {
  return SICILIAN_CLASSICAL_LESSONS[id]
}
