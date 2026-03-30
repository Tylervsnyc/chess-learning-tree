import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// LONDON VS ...c5 LESSONS (lvc-1 through lvc-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line:
// 1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Nf6 5.Nd2 Bf5 6.Ngf3
// Qb6 7.Nh4 Bd7 8.Qb3 c4 9.Qc2 Nh5 10.Bg3 Nxg3 11.hxg3
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_d5:    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
  after_Bf4:   'rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2',
  after_c5:    'rnbqkbnr/pp2pppp/8/2pp4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3',
  after_e3:    'rnbqkbnr/pp2pppp/8/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq - 0 3',
  after_Nc6:   'r1bqkbnr/pp2pppp/2n5/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 1 4',
  after_c3:    'r1bqkbnr/pp2pppp/2n5/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR b KQkq - 0 4',
  after_Nf6:   'r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR w KQkq - 1 5',
  after_Nd2:   'r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP1N1PPP/R2QKBNR b KQkq - 2 5',
  after_Bf5:   'r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1P3/PP1N1PPP/R2QKBNR w KQkq - 3 6',
  after_Ngf3:  'r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 4 6',
  after_Qb6:   'r3kb1r/pp2pppp/1qn2n2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 5 7',
  after_Nh4:   'r3kb1r/pp2pppp/1qn2n2/2pp1b2/3P1B1N/2P1P3/PP1N1PPP/R2QKB1R b KQkq - 6 7',
  after_Bd7:   'r3kb1r/pp1bpppp/1qn2n2/2pp4/3P1B1N/2P1P3/PP1N1PPP/R2QKB1R w KQkq - 7 8',
  after_Qb3:   'r3kb1r/pp1bpppp/1qn2n2/2pp4/3P1B1N/1QP1P3/PP1N1PPP/R3KB1R b KQkq - 8 8',
  after_c4:    'r3kb1r/pp1bpppp/1qn2n2/3p4/2pP1B1N/1QP1P3/PP1N1PPP/R3KB1R w KQkq - 0 9',
  after_Qc2:   'r3kb1r/pp1bpppp/1qn2n2/3p4/2pP1B1N/2P1P3/PPQN1PPP/R3KB1R b KQkq - 1 9',
  after_Nh5:   'r3kb1r/pp1bpppp/1qn5/3p3n/2pP1B1N/2P1P3/PPQN1PPP/R3KB1R w KQkq - 2 10',
  after_Bg3:   'r3kb1r/pp1bpppp/1qn5/3p3n/2pP3N/2P1P1B1/PPQN1PPP/R3KB1R b KQkq - 3 10',
  after_Nxg3:  'r3kb1r/pp1bpppp/1qn5/3p4/2pP3N/2P1P1n1/PPQN1PPP/R3KB1R w KQkq - 0 11',
  after_hxg3:  'r3kb1r/pp1bpppp/1qn5/3p4/2pP3N/2P1P1P1/PPQN1PP1/R3KB1R b KQkq - 0 11',

  // Deviation: 3...Nf6 (instead of 3...Nc6)
  devNf6_after_Nf6:   'rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 1 4',
  devNf6_after_c3:    'rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR b KQkq - 0 4',
  devNf6_after_Nc6:   'r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR w KQkq - 1 5',
  devNf6_after_Nd2:   'r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP1N1PPP/R2QKBNR b KQkq - 2 5',
  devNf6_after_Bf5:   'r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1P3/PP1N1PPP/R2QKBNR w KQkq - 3 6',
  devNf6_after_Ngf3:  'r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 4 6',

  // Deviation: 5...cxd4 (instead of 5...Bf5)
  devCxd4_after_cxd4: 'r1bqkb1r/pp2pppp/2n2n2/3p4/3p1B2/2P1P3/PP1N1PPP/R2QKBNR w KQkq - 0 6',
  devCxd4_after_exd4: 'r1bqkb1r/pp2pppp/2n2n2/3p4/3P1B2/2P5/PP1N1PPP/R2QKBNR b KQkq - 0 6',
  devCxd4_after_Bf5:  'r2qkb1r/pp2pppp/2n2n2/3p1b2/3P1B2/2P5/PP1N1PPP/R2QKBNR w KQkq - 1 7',
  devCxd4_after_Ngf3: 'r2qkb1r/pp2pppp/2n2n2/3p1b2/3P1B2/2P2N2/PP1N1PPP/R2QKB1R b KQkq - 2 7',
  devCxd4_after_e6:   'r2qkb1r/pp3ppp/2n1pn2/3p1b2/3P1B2/2P2N2/PP1N1PPP/R2QKB1R w KQkq - 0 8',
  devCxd4_after_Qb3:  'r2qkb1r/pp3ppp/2n1pn2/3p1b2/3P1B2/1QP2N2/PP1N1PPP/R3KB1R b KQkq - 1 8',
}


// ═══════════════════════════════════════════════════════════
// lvc-1: The London Structure (d4, Bf4, e3)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const LVC_1: OpeningLesson = {
  id: 'lvc-1',
  title: 'The London Structure',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "The London System starts with d4, Bf4, and e3 — a rock-solid pyramid. Here's how to handle Black's c5 counter-strike." },

    // PREDICT 1: d4
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Start the London. What do you play?', hint: 'Grab the center with the d-pawn.', correctFeedback: 'd4 claims the center and opens lines for your dark-squared bishop.', wrongFeedback: 'Play d4 to start the London.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4 takes the center and gets the bishop ready. This is always move one in the London.', arrow: ['d2', 'd4'] },

    // Black plays 1...d5
    { type: 'instruction', fen: FEN.after_d4, text: 'Black mirrors with d5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },

    // PREDICT 2: Bf4
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'What makes this the London System?', hint: 'Develop the bishop to its signature square before playing e3.', correctFeedback: 'Bf4 is the London move — get the bishop out before locking it in with e3.', wrongFeedback: 'Play Bf4 — the bishop goes out before e3 blocks it in.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'Bf4 is the signature London move. You develop the bishop BEFORE playing e3, which would trap it behind the pawns.', arrow: ['c1', 'f4'] },

    // Black plays 2...c5
    { type: 'instruction', fen: FEN.after_Bf4, text: 'Black strikes back with c5, challenging your d4 pawn.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },

    // PREDICT 3: e3
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Black is pushing c5. How do you reinforce the center?', hint: 'Support d4 with a pawn from e2.', correctFeedback: 'e3 supports d4 and completes the London pyramid structure.', wrongFeedback: 'Play e3 — shore up the d4 pawn.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3 locks in the London pyramid. Your d4 pawn is now firmly supported, and Black\'s c5 push is handled.', arrow: ['e2', 'e3'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },

    { type: 'instruction', fen: FEN.after_e3, text: "d4, Bf4, e3 — the London pyramid is up. Black's c5 push changes nothing." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvc-2: Developing Knights (c3, Nd2, Ngf3)
// ═══════════════════════════════════════════════════════════

const LVC_2: OpeningLesson = {
  id: 'lvc-2',
  title: 'Developing Knights',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_e3, text: "Time to develop the knights. You'll play c3, Nd2, and Ngf3 to build a strong setup behind your pawns." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },

    // Black plays 3...Nc6
    { type: 'instruction', fen: FEN.after_e3, text: 'Black develops the knight to c6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 1: c3
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'How do you strengthen your center?', hint: 'A pawn move that supports d4 and prepares Nd2.', correctFeedback: 'c3 bolsters d4 and clears d2 for the knight.', wrongFeedback: 'Play c3 to support d4 and make room for Nd2.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'c3 gives d4 extra support and reserves the d2 square for the knight. No matter how much Black pushes, your center holds.', arrow: ['c2', 'c3'] },

    // Black plays 4...Nf6
    { type: 'instruction', fen: FEN.after_c3, text: 'Black develops the other knight to f6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 2: Nd2
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Where does the first knight go?', hint: 'Develop to d2 so the g-knight can go to f3.', correctFeedback: 'Nd2 develops the knight and keeps the f3 square open for the other one.', wrongFeedback: 'Play Nd2 — it supports the center and makes room for Ngf3.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Nd2 is the London way. It avoids blocking the f-pawn and keeps f3 free for the other knight.', arrow: ['b1', 'd2'] },

    // Black plays 5...Bf5
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Black develops the bishop to f5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },

    // PREDICT 3: Ngf3
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Time to finish developing. Where does the second knight go?', hint: 'The natural square for the kingside knight.', correctFeedback: 'Ngf3 completes the knight development and prepares to castle.', wrongFeedback: 'Play Ngf3 — develop the second knight to its natural square.' },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Ngf3 finishes development. Both knights are out, and you are ready to castle kingside.', arrow: ['g1', 'f3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e3, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_e3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },

    { type: 'instruction', fen: FEN.after_Ngf3, text: "c3, Nd2, Ngf3 — knights developed, center locked, ready to castle." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvc-dev-Nf6: Black plays 3...Nf6 instead of 3...Nc6
// ═══════════════════════════════════════════════════════════

const LVC_DEV_NF6: OpeningLesson = {
  id: 'lvc-dev-Nf6',
  title: 'Dev 3...Nf6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_e3, text: "Sometimes Black plays 3...Nf6 instead of 3...Nc6. The good news? Your plan doesn't change at all." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_e3, text: 'Black plays Nf6 instead of Nc6 — developing the kingside knight first.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 1: c3
    { type: 'play-move', fen: FEN.devNf6_after_Nf6, correctMove: 'c3', prompt: 'Black played Nf6 first. Does your plan change?', hint: 'Same idea — support d4 with c3.', correctFeedback: 'c3 is still correct. Your plan is the same regardless of Black\'s move order.', wrongFeedback: 'Play c3 — the London plan stays the same.' },
    { type: 'instruction', fen: FEN.devNf6_after_c3, text: 'c3 supports d4 just like before. Whether Black plays Nc6 or Nf6 first, you stick to the plan.', arrow: ['c2', 'c3'] },

    // Black plays 4...Nc6
    { type: 'instruction', fen: FEN.devNf6_after_c3, text: 'Black now develops Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // PREDICT 2: Nd2
    { type: 'play-move', fen: FEN.devNf6_after_Nc6, correctMove: 'Nd2', prompt: 'Both Black knights are out. Continue developing.', hint: 'Same knight development as the main line.', correctFeedback: 'Nd2 keeps the same development plan. The position has transposed.', wrongFeedback: 'Play Nd2 — your setup is identical.' },
    { type: 'instruction', fen: FEN.devNf6_after_Nd2, text: 'Nd2 develops just as planned. The position is now the same as the main line — Black just played the knights in a different order.', arrow: ['b1', 'd2'] },

    // Black plays 5...Bf5
    { type: 'instruction', fen: FEN.devNf6_after_Nd2, text: 'Black develops the bishop to f5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },

    // PREDICT 3: Ngf3
    { type: 'play-move', fen: FEN.devNf6_after_Bf5, correctMove: 'Ngf3', prompt: 'Finish your development.', hint: 'The g-knight goes to its natural square.', correctFeedback: 'Ngf3 completes development. You have reached the exact same position as the main line.', wrongFeedback: 'Play Ngf3 — complete the knight development.' },
    { type: 'instruction', fen: FEN.devNf6_after_Ngf3, text: 'Ngf3 finishes the job. Whether Black played Nc6 or Nf6 first, you end up in the same great position.', arrow: ['g1', 'f3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e3, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_e3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.devNf6_after_Nf6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.devNf6_after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.devNf6_after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.devNf6_after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.devNf6_after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },

    { type: 'instruction', fen: FEN.devNf6_after_Ngf3, text: "Same position, different move order. The London doesn't care which knight Black develops first." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvc-3: The Knight Jump (Nh4, Qb3, Qc2)
// ═══════════════════════════════════════════════════════════

const LVC_3: OpeningLesson = {
  id: 'lvc-3',
  title: 'The Knight Jump',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Ngf3, text: "Now for the fun part. You'll jump the knight to h4 to target Black's bishop, then maneuver the queen." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },

    // Black plays 6...Qb6
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Black brings the queen to b6, eyeing the b2 pawn.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },

    // PREDICT 1: Nh4
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Black\'s queen is on b6. What\'s your plan?', hint: 'Jump the knight to threaten Black\'s bishop on f5.', correctFeedback: 'Nh4 attacks the bishop on f5. Black has to deal with it.', wrongFeedback: 'Play Nh4 — it targets the bishop on f5.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Nh4 puts pressure on the f5 bishop. If Black doesn\'t move it, you can take it and double their pawns.', arrow: ['f3', 'h4'] },

    // Black plays 7...Bd7
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Black retreats the bishop to d7 to avoid the trade.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },

    // PREDICT 2: Qb3
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'The bishop retreated. What now?', hint: 'Bring the queen out to challenge Black\'s queen on b6.', correctFeedback: 'Qb3 offers a queen trade. If Black trades, you recapture toward the center.', wrongFeedback: 'Play Qb3 — confront the queen and target b7.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: 'Qb3 faces off against Black\'s queen. You are also eyeing the b7 pawn, and a queen trade here favors you.', arrow: ['d1', 'b3'] },

    // Black plays 8...c4
    { type: 'instruction', fen: FEN.after_Qb3, text: 'Black pushes c4, attacking your queen.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },

    // PREDICT 3: Qc2
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: 'Your queen is attacked. Where does she go?', hint: 'Retreat to c2 — a safe square that keeps the queen active.', correctFeedback: 'Qc2 retreats the queen to a safe, active square on the c-file.', wrongFeedback: 'Play Qc2 — the queen stays active on the c-file.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Qc2 is the perfect retreat. The queen stays active on the c-file, and Black\'s c4 push has overextended.', arrow: ['b3', 'c2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Ngf3, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: 'c4.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: 'Your move.', hint: 'Qc2.', correctFeedback: 'Qc2.', wrongFeedback: 'Qc2.' },

    { type: 'instruction', fen: FEN.after_Qc2, text: "Nh4, Qb3, Qc2 — you chased the bishop away and the queen is perfectly placed." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvc-dev-cxd4: Black plays 5...cxd4 instead of 5...Bf5
// ═══════════════════════════════════════════════════════════

const LVC_DEV_CXD4: OpeningLesson = {
  id: 'lvc-dev-cxd4',
  title: 'Dev 5...cxd4',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nd2, text: "Sometimes Black captures on d4 with cxd4 instead of developing the bishop. Here's how to recapture and keep developing." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Black captures cxd4 instead of developing the bishop.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },

    // PREDICT 1: exd4
    { type: 'play-move', fen: FEN.devCxd4_after_cxd4, correctMove: 'exd4', prompt: 'Black took on d4. How do you recapture?', hint: 'Take back with the e-pawn to keep a strong center.', correctFeedback: 'exd4 recaptures and maintains your central pawn on d4.', wrongFeedback: 'Play exd4 — recapture with the e-pawn.' },
    { type: 'instruction', fen: FEN.devCxd4_after_exd4, text: 'exd4 recaptures cleanly. You still have a pawn on d4 and your bishop on f4 is active. The center is yours.', arrow: ['e3', 'd4'] },

    // Black plays 6...Bf5
    { type: 'instruction', fen: FEN.devCxd4_after_exd4, text: 'Black develops the bishop to f5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },

    // PREDICT 2: Ngf3
    { type: 'play-move', fen: FEN.devCxd4_after_Bf5, correctMove: 'Ngf3', prompt: 'Black developed the bishop. Continue your plan.', hint: 'Finish developing the kingside knight.', correctFeedback: 'Ngf3 develops naturally and prepares to castle.', wrongFeedback: 'Play Ngf3 — keep developing.' },
    { type: 'instruction', fen: FEN.devCxd4_after_Ngf3, text: 'Ngf3 keeps the development going. You are almost ready to castle and your pieces are all well-placed.', arrow: ['g1', 'f3'] },

    // Black plays 7...e6
    { type: 'instruction', fen: FEN.devCxd4_after_Ngf3, text: 'Black plays e6 to solidify the center.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },

    // PREDICT 3: Qb3
    { type: 'play-move', fen: FEN.devCxd4_after_e6, correctMove: 'Qb3', prompt: 'How do you put pressure on Black\'s position?', hint: 'Bring the queen out to target the b7 pawn and d5.', correctFeedback: 'Qb3 targets both b7 and the d5 pawn. Black has to be careful.', wrongFeedback: 'Play Qb3 — the queen eyes b7 and d5.' },
    { type: 'instruction', fen: FEN.devCxd4_after_Qb3, text: 'Qb3 is strong here. It attacks the b7 pawn and puts indirect pressure on d5. Black\'s position is a bit awkward.', arrow: ['d1', 'b3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nd2, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.devCxd4_after_cxd4, correctMove: 'exd4', prompt: 'Your move.', hint: 'exd4.', correctFeedback: 'exd4.', wrongFeedback: 'exd4.' },
    { type: 'instruction', fen: FEN.devCxd4_after_exd4, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.devCxd4_after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.devCxd4_after_Ngf3, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.devCxd4_after_e6, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },

    { type: 'instruction', fen: FEN.devCxd4_after_Qb3, text: "exd4, Ngf3, Qb3 — Black traded the c-pawn early but you came out with active pieces and pressure." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvc-4: The Bishop Trade (Bg3, hxg3)
// NOTE: Only 2 white moves in the plan (Bg3, hxg3). The skill
// says "exactly 3 moves" but lesson 4 only has 2 remaining
// white moves in the main line. We teach Bg3 and hxg3 as the
// content. The last "move" is hxg3 which completes the line.
// ═══════════════════════════════════════════════════════════

const LVC_4: OpeningLesson = {
  id: 'lvc-4',
  title: 'The Bishop Trade',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Qc2, text: "Black will try to trade off your bishop. You'll learn how to make that trade work in your favor by opening the h-file." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: 'c4.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: 'Your move.', hint: 'Qc2.', correctFeedback: 'Qc2.', wrongFeedback: 'Qc2.' },

    // Black plays 9...Nh5
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Black jumps Nh5, attacking your bishop on f4.', autoAdvance: 800, highlightSquares: ['f6', 'h5'] },

    // PREDICT 1: Bg3
    { type: 'play-move', fen: FEN.after_Nh5, correctMove: 'Bg3', prompt: 'Black is threatening your bishop. Where does it go?', hint: 'Retreat to g3 — let Black come to you.', correctFeedback: 'Bg3 retreats the bishop. If Black trades, you open the h-file.', wrongFeedback: 'Play Bg3 — retreat and set the trap.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Bg3 is calm. You invite the trade because taking on g3 opens the h-file for your rook. That is a long-term advantage.', arrow: ['f4', 'g3'] },

    // Black plays 10...Nxg3
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Black takes the bishop with Nxg3.', autoAdvance: 800, highlightSquares: ['h5', 'g3'] },

    // PREDICT 2: hxg3
    { type: 'play-move', fen: FEN.after_Nxg3, correctMove: 'hxg3', prompt: 'Black took your bishop. How do you recapture?', hint: 'Take with the h-pawn to open the h-file.', correctFeedback: 'hxg3 opens the h-file. Your rook on h1 now has a clear path.', wrongFeedback: 'Play hxg3 — open the h-file for your rook.' },
    { type: 'instruction', fen: FEN.after_hxg3, text: 'hxg3 opens the h-file. Your rook can slide right down it, and Black\'s king will feel the pressure.', arrow: ['h2', 'g3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Qc2, text: "Now play both from memory." },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Nh5.', autoAdvance: 800, highlightSquares: ['f6', 'h5'] },
    { type: 'play-move', fen: FEN.after_Nh5, correctMove: 'Bg3', prompt: 'Your move.', hint: 'Bg3.', correctFeedback: 'Bg3.', wrongFeedback: 'Bg3.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Nxg3.', autoAdvance: 800, highlightSquares: ['h5', 'g3'] },
    { type: 'play-move', fen: FEN.after_Nxg3, correctMove: 'hxg3', prompt: 'Your move.', hint: 'hxg3.', correctFeedback: 'hxg3.', wrongFeedback: 'hxg3.' },

    { type: 'instruction', fen: FEN.after_hxg3, text: "Bg3, hxg3 — the bishop is gone but the h-file is yours. A fair trade in the London." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvc-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const LVC_TEST_1: OpeningLesson = {
  id: 'lvc-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE RECALL (all White moves) ===
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.after_Ngf3, text: 'Qb6.', autoAdvance: 800, highlightSquares: ['d8', 'b6'] },
    { type: 'play-move', fen: FEN.after_Qb6, correctMove: 'Nh4', prompt: 'Your move.', hint: 'Nh4.', correctFeedback: 'Nh4.', wrongFeedback: 'Nh4.' },
    { type: 'instruction', fen: FEN.after_Nh4, text: 'Bd7.', autoAdvance: 800, highlightSquares: ['f5', 'd7'] },
    { type: 'play-move', fen: FEN.after_Bd7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3, text: 'c4.', autoAdvance: 800, highlightSquares: ['c5', 'c4'] },
    { type: 'play-move', fen: FEN.after_c4, correctMove: 'Qc2', prompt: 'Your move.', hint: 'Qc2.', correctFeedback: 'Qc2.', wrongFeedback: 'Qc2.' },
    { type: 'instruction', fen: FEN.after_Qc2, text: 'Nh5.', autoAdvance: 800, highlightSquares: ['f6', 'h5'] },
    { type: 'play-move', fen: FEN.after_Nh5, correctMove: 'Bg3', prompt: 'Your move.', hint: 'Bg3.', correctFeedback: 'Bg3.', wrongFeedback: 'Bg3.' },
    { type: 'instruction', fen: FEN.after_Bg3, text: 'Nxg3.', autoAdvance: 800, highlightSquares: ['h5', 'g3'] },
    { type: 'play-move', fen: FEN.after_Nxg3, correctMove: 'hxg3', prompt: 'Your move.', hint: 'hxg3.', correctFeedback: 'hxg3.', wrongFeedback: 'hxg3.' },

    // === DEVIATION: 3...Nf6 ===
    // Replay to deviation point (after e3)
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_e3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.devNf6_after_Nf6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.devNf6_after_c3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.devNf6_after_Nc6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    { type: 'instruction', fen: FEN.devNf6_after_Nd2, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.devNf6_after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },

    // === DEVIATION: 5...cxd4 ===
    // Replay to deviation point (after Nd2)
    { type: 'instruction', fen: FEN.after_e3, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc6, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Nd2', prompt: 'Your move.', hint: 'Nd2.', correctFeedback: 'Nd2.', wrongFeedback: 'Nd2.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_Nd2, text: 'cxd4.', autoAdvance: 800, highlightSquares: ['c5', 'd4'] },
    { type: 'play-move', fen: FEN.devCxd4_after_cxd4, correctMove: 'exd4', prompt: 'Your move.', hint: 'exd4.', correctFeedback: 'exd4.', wrongFeedback: 'exd4.' },
    { type: 'instruction', fen: FEN.devCxd4_after_exd4, text: 'Bf5.', autoAdvance: 800, highlightSquares: ['c8', 'f5'] },
    { type: 'play-move', fen: FEN.devCxd4_after_Bf5, correctMove: 'Ngf3', prompt: 'Your move.', hint: 'Ngf3.', correctFeedback: 'Ngf3.', wrongFeedback: 'Ngf3.' },
    { type: 'instruction', fen: FEN.devCxd4_after_Ngf3, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.devCxd4_after_e6, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

export function getLondonVsC5Lesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'lvc-1': return LVC_1
    case 'lvc-2': return LVC_2
    case 'lvc-dev-Nf6': return LVC_DEV_NF6
    case 'lvc-3': return LVC_3
    case 'lvc-dev-cxd4': return LVC_DEV_CXD4
    case 'lvc-4': return LVC_4
    case 'lvc-test-1': return LVC_TEST_1
    default: return undefined
  }
}
