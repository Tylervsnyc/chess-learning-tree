import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — DANISH GAMBIT LESSONS (wd-1 through wd-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick/attack weapon, NOT master theory.
// Source: Witty_Alien's real chess.com games (2026, last 3 months).
// Danish Gambit = his highest-scoring weapon: 213 games after 1.e4 e5 2.d4 exd4,
// 80% overall, 96% in the fully-accepted main line.
// Voice leans INTO the attack energy. When Black has a sound equalizer, say so.
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// ⚠️  CHUNKING RULE: EVERY main lesson teaches EXACTLY 3 white moves.
// Puzzle steps count as "moves" of content.
//
// Main line: 1.e4 e5 2.d4 exd4 3.c3! dxc3 4.Bc4! cxb2 5.Bxb2 Nf6
//            6.Nc3 Nc6 7.Nge2 d6 8.O-O Be7 9.Qb3 Qd7 10.Rad1 O-O
//            11.Nd5 Nxd5 12.Bxd5+ Kh8 13.e5 dxe5 14.Bxe5
//
// FENs computed with chess.js from move sequences (verified via scripts/_gen-danish-fens.mjs).
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:               'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:            'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:            'rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_exd4:          'rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_c3:            'rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq - 0 3',
  after_dxc3:          'rnbqkbnr/pppp1ppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w KQkq - 0 4',
  after_Bc4:           'rnbqkbnr/pppp1ppp/8/8/2B1P3/2p5/PP3PPP/RNBQK1NR b KQkq - 1 4',
  after_cxb2:          'rnbqkbnr/pppp1ppp/8/8/2B1P3/8/Pp3PPP/RNBQK1NR w KQkq - 0 5',
  after_Bxb2:          'rnbqkbnr/pppp1ppp/8/8/2B1P3/8/PB3PPP/RN1QK1NR b KQkq - 0 5',
  after_Bxb2_Nf6:      'rnbqkb1r/pppp1ppp/5n2/8/2B1P3/8/PB3PPP/RN1QK1NR w KQkq - 1 6',
  after_Nc3:           'rnbqkb1r/pppp1ppp/5n2/8/2B1P3/2N5/PB3PPP/R2QK1NR b KQkq - 2 6',
  after_Nc3_Nc6:       'r1bqkb1r/pppp1ppp/2n2n2/8/2B1P3/2N5/PB3PPP/R2QK1NR w KQkq - 3 7',
  after_Nge2:          'r1bqkb1r/pppp1ppp/2n2n2/8/2B1P3/2N5/PB2NPPP/R2QK2R b KQkq - 4 7',
  after_Nge2_d6:       'r1bqkb1r/ppp2ppp/2np1n2/8/2B1P3/2N5/PB2NPPP/R2QK2R w KQkq - 0 8',
  after_OO:            'r1bqkb1r/ppp2ppp/2np1n2/8/2B1P3/2N5/PB2NPPP/R2Q1RK1 b kq - 1 8',
  after_OO_Be7:        'r1bqk2r/ppp1bppp/2np1n2/8/2B1P3/2N5/PB2NPPP/R2Q1RK1 w kq - 2 9',
  after_Qb3:           'r1bqk2r/ppp1bppp/2np1n2/8/2B1P3/1QN5/PB2NPPP/R4RK1 b kq - 3 9',
  after_Qb3_Qd7:       'r1b1k2r/pppqbppp/2np1n2/8/2B1P3/1QN5/PB2NPPP/R4RK1 w kq - 4 10',
  after_Rad1:          'r1b1k2r/pppqbppp/2np1n2/8/2B1P3/1QN5/PB2NPPP/3R1RK1 b kq - 5 10',
  after_Rad1_OO_black: 'r1b2rk1/pppqbppp/2np1n2/8/2B1P3/1QN5/PB2NPPP/3R1RK1 w - - 6 11',
  after_Nd5:           'r1b2rk1/pppqbppp/2np1n2/3N4/2B1P3/1Q6/PB2NPPP/3R1RK1 b - - 7 11',
  after_Nd5_Nxd5:      'r1b2rk1/pppqbppp/2np4/3n4/2B1P3/1Q6/PB2NPPP/3R1RK1 w - - 0 12',
  after_Bxd5_check:    'r1b2rk1/pppqbppp/2np4/3B4/4P3/1Q6/PB2NPPP/3R1RK1 b - - 0 12',
  after_Kh8:           'r1b2r1k/pppqbppp/2np4/3B4/4P3/1Q6/PB2NPPP/3R1RK1 w - - 1 13',
  after_e5push:        'r1b2r1k/pppqbppp/2np4/3BP3/8/1Q6/PB2NPPP/3R1RK1 b - - 0 13',
  after_e5push_dxe5:   'r1b2r1k/pppqbppp/2n5/3Bp3/8/1Q6/PB2NPPP/3R1RK1 w - - 0 14',
  after_Bxe5:          'r1b2r1k/pppqbppp/2n5/3BB3/8/1Q6/P3NPPP/3R1RK1 b - - 0 14',
  after_Bxe5_Nxe5:     'r1b2r1k/pppqbppp/8/3Bn3/8/1Q6/P3NPPP/3R1RK1 w - - 0 15',

  // === DEVIATION d5! counter-gambit ===
  cg_d5:      'rnbqkbnr/ppp2ppp/8/3p4/3pP3/2P5/PP3PPP/RNBQKBNR w KQkq - 0 4',
  cg_exd5:    'rnbqkbnr/ppp2ppp/8/3P4/3p4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4',
  cg_Qxd5:    'rnb1kbnr/ppp2ppp/8/3q4/3p4/2P5/PP3PPP/RNBQKBNR w KQkq - 0 5',
  cg_cxd4:    'rnb1kbnr/ppp2ppp/8/3q4/3P4/8/PP3PPP/RNBQKBNR b KQkq - 0 5',
  cg_Qxd4:    'rnb1kbnr/ppp2ppp/8/8/3q4/8/PP3PPP/RNBQKBNR w KQkq - 0 6',
  cg_Nc3:     'rnb1kbnr/ppp2ppp/8/8/3q4/2N5/PP3PPP/R1BQKBNR b KQkq - 1 6',
  cg_Qd6:     'rnb1kbnr/ppp2ppp/3q4/8/8/2N5/PP3PPP/R1BQKBNR w KQkq - 2 7',
  cg_Nf3:     'rnb1kbnr/ppp2ppp/3q4/8/8/2N2N2/PP3PPP/R1BQKB1R b KQkq - 3 7',

  // === DEVIATION Nc6 decline ===
  dec_Nc6:    'r1bqkbnr/pppp1ppp/2n5/8/3pP3/2P5/PP3PPP/RNBQKBNR w KQkq - 1 4',
  dec_Bc4:    'r1bqkbnr/pppp1ppp/2n5/8/2BpP3/2P5/PP3PPP/RNBQK1NR b KQkq - 2 4',
  dec_dxc3:   'r1bqkbnr/pppp1ppp/2n5/8/2B1P3/2p5/PP3PPP/RNBQK1NR w KQkq - 0 5',
  dec_Nxc3:   'r1bqkbnr/pppp1ppp/2n5/8/2B1P3/2N5/PP3PPP/R1BQK1NR b KQkq - 0 5',
  dec_Nf6:    'r1bqkb1r/pppp1ppp/2n2n2/8/2B1P3/2N5/PP3PPP/R1BQK1NR w KQkq - 1 6',
  dec_Nge2:   'r1bqkb1r/pppp1ppp/2n2n2/8/2B1P3/2N5/PP2NPPP/R1BQK2R b KQkq - 2 6',

  // === DEVIATION one-pawn Danish (4.Nxc3) ===
  op_Nxc3:    'rnbqkbnr/pppp1ppp/8/8/4P3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4',
  op_Nc6:     'r1bqkbnr/pppp1ppp/2n5/8/4P3/2N5/PP3PPP/R1BQKBNR w KQkq - 1 5',
  op_Bc4:     'r1bqkbnr/pppp1ppp/2n5/8/2B1P3/2N5/PP3PPP/R1BQK1NR b KQkq - 2 5',
  op_Nf6:     'r1bqkb1r/pppp1ppp/2n2n2/8/2B1P3/2N5/PP3PPP/R1BQK1NR w KQkq - 3 6',
  op_Nge2:    'r1bqkb1r/pppp1ppp/2n2n2/8/2B1P3/2N5/PP2NPPP/R1BQK2R b KQkq - 4 6',
}


// ═══════════════════════════════════════════════════════════
// wd-1: THE GAMBIT (1.e4 e5 2.d4 exd4 3.c3!)
// First lesson — no recap.
// Teaches 3 white moves: e4, d4, c3
// ═══════════════════════════════════════════════════════════

const WD_1: OpeningLesson = {
  id: 'wd-1',
  title: 'The Gambit',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Danish Gambit. Witty_Alien's highest-scoring weapon: 213 games, 80% win rate overall, 96% in the main accepted line. The idea: sacrifice TWO pawns for a bishop battery that rips straight through f7.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Three moves to load the trap. Let's go.",
    },

    // ── TEACH 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Open the game.',
      hint: 'King pawn to e4.',
      correctFeedback: 'e4. Open game — Black almost always answers e5.',
      wrongFeedback: 'Play e4 — you need an open game for this gambit.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: 'e5 — open game. Now grab the center.',
      autoAdvance: 800,
      highlightSquares: ['e7', 'e5'],
    },

    // ── TEACH 2: d4 ──
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'd4',
      prompt: 'Stake the center with a second pawn.',
      hint: 'd2 to d4.',
      correctFeedback: 'd4! Challenge the e5 pawn. Black almost always takes.',
      wrongFeedback: 'Play d4 — attack the center.',
    },
    {
      type: 'instruction',
      fen: FEN.after_exd4,
      text: 'exd4 — Black takes. A free pawn. Now comes the trap.',
      autoAdvance: 800,
      highlightSquares: ['e5', 'd4'],
    },

    // ── TEACH 3: c3! ──
    {
      type: 'instruction',
      fen: FEN.after_exd4,
      text: "Most players recapture. You don't. You offer ANOTHER pawn — c3! Witty calls this the \"from the Moon\" move. Why would you give up two pawns?",
      highlightSquares: ['c2', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'c3',
      prompt: 'Offer a second pawn — the Danish Gambit.',
      hint: 'c2 to c3.',
      correctFeedback: "c3! Now Black has a decision: take and trigger the bishop battery, or decline. In 169 of Witty's games, Black took. 96% win rate followed.",
      wrongFeedback: 'Play c3 — offer the second pawn. That is the whole idea.',
      postMoveArrow: ['c3', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "c3 is on the board. Black has a free pawn to take — and if they take that too, you get the most dangerous bishop battery in amateur chess. Next lesson: what happens when Black accepts.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: 'Three moves. Play them from memory.',
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: 'e4.',
      correctFeedback: 'e4.',
      wrongFeedback: 'e4.',
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'c3',
      prompt: 'Your move.',
      hint: 'c3.',
      correctFeedback: 'c3.',
      wrongFeedback: 'c3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Gambit offered. Next: Black takes twice and you build the bishop battery that makes this opening dangerous.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-2: THE BISHOP BATTERY (3...dxc3 4.Bc4! cxb2 5.Bxb2 Nf6 6.Nc3)
// Teaches 3 white moves: Bc4, Bxb2, Nc3
// The whole point of the Danish Gambit — two bishops raking c4+b2.
// ═══════════════════════════════════════════════════════════

const WD_2: OpeningLesson = {
  id: 'wd-2',
  title: 'The Bishop Battery',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Black took the first pawn. Now they take the second. When they do, you build what Witty calls the battery — two bishops on c4 and b2, firing down open diagonals straight at f7 and the kingside.",
    },

    // ── RECAP ──
    { type: 'instruction', fen: FEN.start, text: 'Quick recap.' },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_dxc3, text: 'dxc3 — Black takes the second pawn too.', autoAdvance: 800, highlightSquares: ['d4', 'c3'] },

    // ── TEACH 1: Bc4! ──
    {
      type: 'instruction',
      fen: FEN.after_dxc3,
      text: "Black has two pawns. You have something better — an open c4 square and a bishop ready to aim at f7. Don't recapture. Develop.",
      highlightSquares: ['f1', 'c4', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Bc4',
      prompt: 'Develop the bishop — aim at f7.',
      hint: 'Bishop from f1 to c4.',
      correctFeedback: "Bc4! The c4 bishop targets f7 directly. Black can take on b2 now — and that is what you WANT.",
      wrongFeedback: 'Play Bc4 — develop and threaten f7.',
      postMoveArrow: ['c4', 'f7'],
    },

    // ── BLACK cxb2 ──
    {
      type: 'instruction',
      fen: FEN.after_cxb2,
      text: "cxb2 — Black grabs another pawn. They now have two extra pawns. The b2 pawn is attacking a1. You are not even slightly worried.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'b2'],
    },

    // ── TEACH 2: Bxb2 ──
    {
      type: 'instruction',
      fen: FEN.after_cxb2,
      text: "Take the b2 pawn with the bishop — not to win it back, but to put a second bishop on the long diagonal pointing at g7 and the kingside.",
      highlightSquares: ['c1', 'b2', 'g7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_cxb2,
      correctMove: 'Bxb2',
      prompt: 'Take b2 with the bishop.',
      hint: 'Bishop from c1 to b2.',
      correctFeedback: "Bxb2! The battery is loaded. Bishop on c4 fires at f7. Bishop on b2 fires down the long diagonal at g7. Black's king is about to have a very bad time.",
      wrongFeedback: 'Play Bxb2 — build the battery.',
      postMoveArrow: ['b2', 'g7'],
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bxb2_Nf6,
      text: "Nf6 — Black develops and attacks e4. Natural chess. Now complete your own development.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 3: Nc3 ──
    {
      type: 'play-move',
      fen: FEN.after_Bxb2_Nf6,
      correctMove: 'Nc3',
      prompt: 'Develop the knight, defend e4.',
      hint: 'Knight from b1 to c3.',
      correctFeedback: "Nc3! Knight defends e4 and controls key central squares. Two bishops active, knight developed — you are already better than the material count suggests.",
      wrongFeedback: 'Play Nc3 — develop and defend e4.',
    },

    // ── BLACK Nc6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3_Nc6,
      text: "Nc6 — Black mirrors you with their own knight. Both sides developing. Next: you castle and unleash the queen.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_dxc3,
      text: 'From the accepted position — build the battery.',
    },
    { type: 'play-move', fen: FEN.after_dxc3, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_cxb2, text: 'cxb2.', autoAdvance: 800, highlightSquares: ['c3', 'b2'] },
    { type: 'play-move', fen: FEN.after_cxb2, correctMove: 'Bxb2', prompt: 'Your move.', hint: 'Bxb2.', correctFeedback: 'Bxb2.', wrongFeedback: 'Bxb2.' },
    { type: 'instruction', fen: FEN.after_Bxb2_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxb2_Nf6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3_Nc6,
      text: "Battery built, knight out. Two pawns down — but two raking bishops aimed at the kingside. Next: castle and bring out the queen.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-3: CASTLE & PRESSURE (7.Nge2 d6 8.O-O Be7 9.Qb3)
// Teaches 3 white moves: Nge2, O-O, Qb3
// ═══════════════════════════════════════════════════════════

const WD_3: OpeningLesson = {
  id: 'wd-3',
  title: 'Castle and Pressure',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3_Nc6,
      text: "Bishops loaded, knight out. Now the attack setup: Nge2 (keeps the g-file open and prepares O-O), castle, then Qb3 — a queen move that hits f7 AND b7 at once.",
    },

    // ── RECAP ──
    { type: 'instruction', fen: FEN.start, text: 'Quick recap to the battery.' },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_dxc3, text: 'dxc3.', autoAdvance: 800, highlightSquares: ['d4', 'c3'] },
    { type: 'play-move', fen: FEN.after_dxc3, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_cxb2, text: 'cxb2.', autoAdvance: 800, highlightSquares: ['c3', 'b2'] },
    { type: 'play-move', fen: FEN.after_cxb2, correctMove: 'Bxb2', prompt: 'Your move.', hint: 'Bxb2.', correctFeedback: 'Bxb2.', wrongFeedback: 'Bxb2.' },
    { type: 'instruction', fen: FEN.after_Bxb2_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxb2_Nf6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },

    // ── TEACH 1: Nge2 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3_Nc6,
      text: "Bring the kingside knight to e2 — not f3. Nf3 would block the b2 bishop's diagonal. Ne2 keeps every diagonal open.",
      highlightSquares: ['g1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3_Nc6,
      correctMove: 'Nge2',
      prompt: 'Knight to e2 — keep the b2 diagonal clear.',
      hint: 'Knight from g1 to e2.',
      correctFeedback: "Nge2! Not Nf3 — that would block the b2 bishop. Nge2 keeps both bishops firing.",
      wrongFeedback: 'Play Nge2 — not Nf3, which would block the b2 bishop.',
    },

    // ── BLACK d6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nge2_d6,
      text: "d6 — Black supports the e5 pawn and prepares to develop the bishop. Solid. Castle now.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd6'],
    },

    // ── TEACH 2: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_Nge2_d6,
      correctMove: 'O-O',
      prompt: 'Castle. Get the king safe and the rook active.',
      hint: 'Castle kingside.',
      correctFeedback: "O-O! King safe, rook on f1. Black will develop Be7 — and then you fire the queen.",
      wrongFeedback: 'Play O-O — castle first.',
    },

    // ── BLACK Be7 ──
    {
      type: 'instruction',
      fen: FEN.after_OO_Be7,
      text: "Be7 — Black develops sensibly, preparing to castle. Now comes the move that makes this whole setup dangerous.",
      autoAdvance: 800,
      highlightSquares: ['f8', 'e7'],
    },

    // ── TEACH 3: Qb3 ──
    {
      type: 'instruction',
      fen: FEN.after_OO_Be7,
      text: "Qb3 — the queen hits f7 (alongside the c4 bishop) AND b7. Two threats at once. Black usually has to defend with Qd7.",
      highlightSquares: ['d1', 'b3', 'f7', 'b7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_Be7,
      correctMove: 'Qb3',
      prompt: 'Queen to b3 — double the pressure on f7.',
      hint: 'Queen from d1 to b3.',
      correctFeedback: "Qb3! Queen joins the c4 bishop attacking f7, AND threatens the b7 pawn. Black has to defend carefully.",
      wrongFeedback: 'Play Qb3 — double-attack f7.',
      postMoveArrow: ['b3', 'f7'],
    },

    // ── BLACK Qd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Qb3_Qd7,
      text: "Qd7 — Black defends f7 and eyes the b2 bishop. Smart. But you have more pressure to add.",
      autoAdvance: 800,
      highlightSquares: ['d8', 'd7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3_Nc6,
      text: 'From Nc6 — Nge2, O-O, Qb3.',
    },
    { type: 'play-move', fen: FEN.after_Nc3_Nc6, correctMove: 'Nge2', prompt: 'Your move.', hint: 'Nge2.', correctFeedback: 'Nge2.', wrongFeedback: 'Nge2.' },
    { type: 'instruction', fen: FEN.after_Nge2_d6, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nge2_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_Be7, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_OO_Be7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3_Qd7, text: 'Qd7.', autoAdvance: 800, highlightSquares: ['d8', 'd7'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qb3_Qd7,
      text: "Nge2, O-O, Qb3 — the pressure is on. Next: pile the rook onto the d-file and fire the Nd5 fork.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-4: ROOK UP, FORK FIRES (10.Rad1 O-O 11.Nd5 Nxd5 12.Bxd5+)
// Teaches 3 white moves: Rad1, Nd5, Bxd5+
// ═══════════════════════════════════════════════════════════

const WD_4: OpeningLesson = {
  id: 'wd-4',
  title: 'Rook Up, Fork Fires',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qb3_Qd7,
      text: "Black defended f7 with Qd7. Now: swing the a-rook to d1 to pile on the d-file — then the Nd5 fork removes Black's best defender and gives check.",
    },

    // ── RECAP ──
    { type: 'instruction', fen: FEN.start, text: 'Quick recap.' },
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_dxc3, text: 'dxc3.', autoAdvance: 800, highlightSquares: ['d4', 'c3'] },
    { type: 'play-move', fen: FEN.after_dxc3, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_cxb2, text: 'cxb2.', autoAdvance: 800, highlightSquares: ['c3', 'b2'] },
    { type: 'play-move', fen: FEN.after_cxb2, correctMove: 'Bxb2', prompt: 'Your move.', hint: 'Bxb2.', correctFeedback: 'Bxb2.', wrongFeedback: 'Bxb2.' },
    { type: 'instruction', fen: FEN.after_Bxb2_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxb2_Nf6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc3_Nc6, correctMove: 'Nge2', prompt: 'Your move.', hint: 'Nge2.', correctFeedback: 'Nge2.', wrongFeedback: 'Nge2.' },
    { type: 'instruction', fen: FEN.after_Nge2_d6, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nge2_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_Be7, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_OO_Be7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3_Qd7, text: 'Qd7.', autoAdvance: 800, highlightSquares: ['d8', 'd7'] },

    // ── TEACH 1: Rad1 ──
    {
      type: 'instruction',
      fen: FEN.after_Qb3_Qd7,
      text: "The a-rook is sitting idle. Swing it to d1 — pile pressure on the d-file and threaten to support a future d5 knight jump.",
      highlightSquares: ['a1', 'd1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Qb3_Qd7,
      correctMove: 'Rad1',
      prompt: 'Swing the a-rook to d1.',
      hint: 'Rook from a1 to d1.',
      correctFeedback: "Rad1! The d-file is loaded. Black is running out of easy moves.",
      wrongFeedback: 'Play Rad1 — activate the a-rook.',
    },

    // ── BLACK O-O ──
    {
      type: 'instruction',
      fen: FEN.after_Rad1_OO_black,
      text: "O-O — Black castles to safety. Now you launch the fork.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'g8'],
    },

    // ── TEACH 2: Nd5! fork ──
    {
      type: 'instruction',
      fen: FEN.after_Rad1_OO_black,
      text: "Nd5 — the knight jumps into d5, attacking both the f6 knight AND the e7 bishop at once. Black has to give up the knight.",
      highlightSquares: ['e2', 'd5', 'f6', 'e7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Rad1_OO_black,
      correctMove: 'Nd5',
      prompt: 'Fork with the knight.',
      hint: 'Knight from e2 to d5.',
      correctFeedback: "Nd5! Fork — attacks Nf6 and Be7 simultaneously. Black almost always takes the knight to resolve it.",
      wrongFeedback: 'Play Nd5 — the fork wins material.',
      postMoveArrow: [['d5', 'f6'], ['d5', 'e7']],
    },

    // ── BLACK Nxd5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nd5_Nxd5,
      text: "Nxd5 — Black takes the knight. Now recapture with the bishop — and give check.",
      autoAdvance: 800,
      highlightSquares: ['f6', 'd5'],
    },

    // ── TEACH 3: Bxd5+ ──
    {
      type: 'play-move',
      fen: FEN.after_Nd5_Nxd5,
      correctMove: 'Bxd5+',
      prompt: 'Take back with the bishop — with check.',
      hint: 'Bishop from c4 takes d5, check.',
      correctFeedback: "Bxd5+! Check on the king. Black's king has to run — usually to h8. Now e5 breaks the center open.",
      wrongFeedback: 'Play Bxd5+ — recapture and check.',
      postMoveArrow: ['d5', 'g8'],
    },

    // ── BLACK Kh8 ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "Kh8 — king runs to the corner. The d5 bishop is raking. Next lesson: e5 breaks the center.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'h8'],
    },

    // ── RECALL ──
    { type: 'instruction', fen: FEN.after_Qb3_Qd7, text: 'From Qd7 — Rad1, Nd5, Bxd5+.' },
    { type: 'play-move', fen: FEN.after_Qb3_Qd7, correctMove: 'Rad1', prompt: 'Your move.', hint: 'Rad1.', correctFeedback: 'Rad1.', wrongFeedback: 'Rad1.' },
    { type: 'instruction', fen: FEN.after_Rad1_OO_black, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_Rad1_OO_black, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5_Nxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5_Nxd5, correctMove: 'Bxd5+', prompt: 'Your move.', hint: 'Bxd5+.', correctFeedback: 'Bxd5+.', wrongFeedback: 'Bxd5+.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Kh8.', autoAdvance: 800, highlightSquares: ['g8', 'h8'] },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "King on h8, two raking bishops, rooks on open files. You sacrificed two pawns — and the position is overwhelming. Last lesson: blow the center open with e5.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-5: THE e5 BREAKTHROUGH (13.e5 dxe5 14.Bxe5 + puzzle)
// Teaches 3 white moves: e5, Bxe5 (responding to dxe5), puzzle finish
// ═══════════════════════════════════════════════════════════

const WD_5: OpeningLesson = {
  id: 'wd-5',
  title: 'The e5 Breakthrough',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "King on h8, two bishops raking the board, rooks stacked. Time to blast the center open. e5 — attack the remaining knight and open every line at once.",
    },

    // ── RECAP (abbreviated) ──
    {
      type: 'instruction',
      fen: FEN.after_Bxd5_check,
      text: "You played Bxd5+ — Black's king ran to h8.",
    },
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "King on h8. Now you break the center.",
      autoAdvance: 800,
    },

    // ── TEACH 1: e5! ──
    {
      type: 'instruction',
      fen: FEN.after_Kh8,
      text: "e5 — the pawn advances, attacking the d6 pawn and every piece behind it. If Black takes, the bishop recaptures and both bishops are now dominating.",
      highlightSquares: ['e4', 'e5', 'd6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kh8,
      correctMove: 'e5',
      prompt: 'Blast the center open.',
      hint: 'Pawn from e4 to e5.',
      correctFeedback: "e5! The center cracks. Black is going to be in trouble whichever way they respond.",
      wrongFeedback: 'Play e5 — break the center.',
      postMoveArrow: ['e5', 'd6'],
    },

    // ── BLACK dxe5 ──
    {
      type: 'instruction',
      fen: FEN.after_e5push_dxe5,
      text: "dxe5 — Black takes, opening the d-file. Your d5 bishop is now unblocked and the b2 bishop is live. Recapture.",
      autoAdvance: 800,
      highlightSquares: ['d6', 'e5'],
    },

    // ── TEACH 2: Bxe5 ──
    {
      type: 'play-move',
      fen: FEN.after_e5push_dxe5,
      correctMove: 'Bxe5',
      prompt: 'Recapture with the bishop.',
      hint: 'Bishop from d5 takes e5.',
      correctFeedback: "Bxe5! Now you have two bishops dominating open diagonals, rooks on open files, and the queen trained on f7. The position is nearly winning.",
      wrongFeedback: 'Play Bxe5 — recapture and keep the pressure.',
      postMoveArrow: [['e5', 'f6'], ['b2', 'g7']],
    },

    // ── BLACK Nxe5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: "Nxe5 — Black takes the bishop. Fine. Your d-file rook and b3 queen are now lined up on the d7 queen.",
      autoAdvance: 800,
      highlightSquares: ['c6', 'e5'],
    },

    // ── PUZZLE: Bxf7! Rxf7 Rxd7 — win the queen ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5_Nxe5,
      text: "From here, find the forcing sequence that wins the Black queen. Two moves.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_Bxe5_Nxe5,
      solutionMoves: ['Bxf7', 'Rxf7', 'Rxd7'],
      playerColor: 'white',
      prompt: 'Win the queen.',
      hint: 'The d5 bishop can crash into f7. After Black recaptures, the d1 rook takes the queen on d7.',
      correctFeedback: "Bxf7! Rxf7 Rxd7 — you win the queen. The bishop battery does the work: sacrifice on f7, recapture on f7, rook takes d7. Two pawns ahead and a dominant position. That is why Witty plays this.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: "That is the Danish Gambit. Two pawns sacrificed — a bishop battery that wins the queen. Witty_Alien wins 96% of these in his real games. Now learn what happens when Black fights back.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-dev-d5: DEVIATION d5! (Black's counter-gambit — the sound equalizer)
// Honest: this is Black's best move. It equalizes. Say so.
// Teaches: exd5, cxd4, Nc3 (3 white moves)
// ═══════════════════════════════════════════════════════════

const WD_DEV_D5: OpeningLesson = {
  id: 'wd-dev-d5',
  title: 'If d5! — The Counter',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Sometimes Black plays d5 instead of taking on c3 — the counter-gambit. Honest warning: this is Black's best response. It equalizes. The wild bishop battery is gone. You are fine; the brilliant attack is not happening.",
    },
    {
      type: 'instruction',
      fen: FEN.cg_d5,
      text: "d5 — Black hits back in the center, offering their own pawn. Capablanca recommended this. It works.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },

    // ── TEACH 1: exd5 ──
    {
      type: 'instruction',
      fen: FEN.cg_d5,
      text: "Take on d5. Simplest and best — capture the pawn, open the position, and aim to rebuild a center later.",
      highlightSquares: ['e4', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.cg_d5,
      correctMove: 'exd5',
      prompt: 'Take on d5.',
      hint: 'e-pawn takes d5.',
      correctFeedback: "exd5. Now Black recaptures with the queen, then takes the c3 pawn to give it right back.",
      wrongFeedback: 'Play exd5 — capture the d5 pawn.',
    },

    // ── BLACK Qxd5, then cxd4 ──
    {
      type: 'instruction',
      fen: FEN.cg_Qxd5,
      text: "Qxd5 — queen recaptures. Now you have c3 still on the board — but also d4 available.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'd5'],
    },

    // ── TEACH 2: cxd4 ──
    {
      type: 'play-move',
      fen: FEN.cg_Qxd5,
      correctMove: 'cxd4',
      prompt: 'Recapture on d4.',
      hint: 'c3 pawn takes d4.',
      correctFeedback: "cxd4. Now Black takes on d4 with the queen — and you develop with Nc3 to chase the queen.",
      wrongFeedback: 'Play cxd4 — recapture.',
    },

    // ── BLACK Qxd4 ──
    {
      type: 'instruction',
      fen: FEN.cg_Qxd4,
      text: "Qxd4 — queen grabs the pawn. It is in the center, exposed. Kick it out.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'd4'],
    },

    // ── TEACH 3: Nc3 ──
    {
      type: 'play-move',
      fen: FEN.cg_Qxd4,
      correctMove: 'Nc3',
      prompt: 'Develop and chase the queen.',
      hint: 'Knight from b1 to c3.',
      correctFeedback: "Nc3! Develops with tempo — the queen must move. Black plays Qd6, you follow with Nf3, develop normally. You are fine here — equal, open game, good play ahead.",
      wrongFeedback: 'Play Nc3 — develop and attack the queen.',
      postMoveArrow: ['c3', 'd4'],
    },

    // ── BLACK Qd6, then show plan ──
    {
      type: 'instruction',
      fen: FEN.cg_Qd6,
      text: "Qd6 — queen retreats to safety.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'd6'],
    },
    {
      type: 'instruction',
      fen: FEN.cg_Nf3,
      text: "Nf3 — you continue developing. Both sides have solid positions. No raking bishop battery here, but you are not worse. When Black plays the best move, sometimes you just play good chess.",
      highlightSquares: ['g1', 'f3'],
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-dev-Nxc3: DEVIATION one-pawn Danish (4.Nxc3 instead of 4.Bc4)
// Teaches: Nxc3, Bc4, Nge2 (3 white moves)
// ═══════════════════════════════════════════════════════════

const WD_DEV_NXC3: OpeningLesson = {
  id: 'wd-dev-Nxc3',
  title: 'Safer: One-Pawn Danish',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_dxc3,
      text: "Instead of Bc4 — the two-pawn gambit — you can play Nxc3 right here. One pawn sacrificed, knight developed, solid position. 21 games in Witty's database, 76% win rate. Safer, less spectacular.",
    },

    // ── TEACH 1: Nxc3 ──
    {
      type: 'play-move',
      fen: FEN.after_dxc3,
      correctMove: 'Nxc3',
      prompt: 'Recapture with the knight — one-pawn Danish.',
      hint: 'Knight from b1 takes c3.',
      correctFeedback: "Nxc3! You get the pawn back, develop a piece, and keep a solid center. No wild bishop battery — but a healthy position with good piece activity.",
      wrongFeedback: 'Play Nxc3 — the safer alternative.',
    },

    // ── BLACK Nc6 ──
    {
      type: 'instruction',
      fen: FEN.op_Nc6,
      text: "Nc6 — Black develops naturally.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },

    // ── TEACH 2: Bc4 ──
    {
      type: 'play-move',
      fen: FEN.op_Nc6,
      correctMove: 'Bc4',
      prompt: 'Develop the bishop to c4.',
      hint: 'Bishop from f1 to c4.',
      correctFeedback: "Bc4! Even in the one-pawn line, the c4 bishop targets f7. You only have one bishop attacking, not two — but it is still active and threatening.",
      wrongFeedback: 'Play Bc4 — develop the bishop.',
      postMoveArrow: ['c4', 'f7'],
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.op_Nf6,
      text: "Nf6 — Black develops and attacks e4.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 3: Nge2 ──
    {
      type: 'play-move',
      fen: FEN.op_Nf6,
      correctMove: 'Nge2',
      prompt: 'Develop the kingside knight to e2.',
      hint: 'Knight from g1 to e2.',
      correctFeedback: "Nge2! Same as the main line — keep Nf3 off the board so the bishop diagonal stays clear. Castle next and play solid chess. 76% win rate; not as brilliant, but reliable.",
      wrongFeedback: 'Play Nge2 — keep the diagonal clear.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.op_Nge2,
      text: "One pawn sacrificed, both knights and the c4 bishop active. Castle next, develop the queen, play normal good moves. Witty wins 76% from here — solid enough.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-dev-Nc6: DEVIATION Nc6 decline (3...Nc6 instead of dxc3)
// Teaches: Bc4!, Nxc3, Nge2 (3 white moves — Bc4 after Nc6 keeps tension)
// ═══════════════════════════════════════════════════════════

const WD_DEV_NC6: OpeningLesson = {
  id: 'wd-dev-Nc6',
  title: 'If Nc6 — Decline Refused',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Sometimes Black plays Nc6 instead of taking the c3 pawn — trying to decline the gambit gracefully. The key: play Bc4! anyway and keep the gambit tension alive. 44 games in Witty's database, 84% win rate.",
    },

    // ── BLACK Nc6 ──
    {
      type: 'instruction',
      fen: FEN.dec_Nc6,
      text: "Nc6 — development over greed. But the c3 pawn is still there, and so is the gambit.",
      autoAdvance: 800,
      highlightSquares: ['b8', 'c6'],
    },

    // ── TEACH 1: Bc4! ──
    {
      type: 'instruction',
      fen: FEN.dec_Nc6,
      text: "Play Bc4 anyway. The gambit is still on. If Black takes c3 now, you get Nxc3 and have a normal position. If they don't, you keep developing with the c4 bishop already active.",
      highlightSquares: ['f1', 'c4', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.dec_Nc6,
      correctMove: 'Bc4',
      prompt: 'Play Bc4 — keep the gambit tension.',
      hint: 'Bishop from f1 to c4.',
      correctFeedback: "Bc4! Black still has the c3 pawn as an option. Often they take it — and now you just play Nxc3 and get a solid position.",
      wrongFeedback: 'Play Bc4 — keep the gambit alive.',
      postMoveArrow: ['c4', 'f7'],
    },

    // ── BLACK dxc3 ──
    {
      type: 'instruction',
      fen: FEN.dec_dxc3,
      text: "dxc3 — Black takes after all. Good. Now recapture with the knight.",
      autoAdvance: 800,
      highlightSquares: ['d4', 'c3'],
    },

    // ── TEACH 2: Nxc3 ──
    {
      type: 'play-move',
      fen: FEN.dec_dxc3,
      correctMove: 'Nxc3',
      prompt: 'Recapture with the knight.',
      hint: 'Knight from b1 takes c3.',
      correctFeedback: "Nxc3! You have a great position — c4 bishop active, both center pawns gone, open game. Similar to the one-pawn Danish but you're a bit more developed.",
      wrongFeedback: 'Play Nxc3 — recapture.',
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.dec_Nf6,
      text: "Nf6 — Black develops.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 3: Nge2 ──
    {
      type: 'play-move',
      fen: FEN.dec_Nf6,
      correctMove: 'Nge2',
      prompt: 'Complete development with Nge2.',
      hint: 'Knight from g1 to e2.',
      correctFeedback: "Nge2! Same plan as always — keep the kingside clear, castle next, then pile on with the queen. Black's Nc6 detour cost them tempo. 84% win rate — this line is very good for White.",
      wrongFeedback: 'Play Nge2 — develop and prepare to castle.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dec_Nge2,
      text: "Bc4, Nxc3, Nge2 — the plan is the same. Castle, activate the queen, and attack. Black's Nc6 delay only helped you.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// wd-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const WD_TEST_1: OpeningLesson = {
  id: 'wd-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Danish Gambit test. Play the full main line from memory — then handle every deviation. No hints.",
      buttonText: "LET'S GO",
    },

    // ── MAIN LINE ──
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800, highlightSquares: ['e7', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800, highlightSquares: ['e5', 'd4'] },
    { type: 'play-move', fen: FEN.after_exd4, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_dxc3, text: 'dxc3.', autoAdvance: 800, highlightSquares: ['d4', 'c3'] },
    { type: 'play-move', fen: FEN.after_dxc3, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4.', correctFeedback: 'Bc4.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.after_cxb2, text: 'cxb2.', autoAdvance: 800, highlightSquares: ['c3', 'b2'] },
    { type: 'play-move', fen: FEN.after_cxb2, correctMove: 'Bxb2', prompt: 'Your move.', hint: 'Bxb2.', correctFeedback: 'Bxb2.', wrongFeedback: 'Bxb2.' },
    { type: 'instruction', fen: FEN.after_Bxb2_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Bxb2_Nf6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_Nc3_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.after_Nc3_Nc6, correctMove: 'Nge2', prompt: 'Your move.', hint: 'Nge2.', correctFeedback: 'Nge2.', wrongFeedback: 'Nge2.' },
    { type: 'instruction', fen: FEN.after_Nge2_d6, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_Nge2_d6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_Be7, text: 'Be7.', autoAdvance: 800, highlightSquares: ['f8', 'e7'] },
    { type: 'play-move', fen: FEN.after_OO_Be7, correctMove: 'Qb3', prompt: 'Your move.', hint: 'Qb3.', correctFeedback: 'Qb3.', wrongFeedback: 'Qb3.' },
    { type: 'instruction', fen: FEN.after_Qb3_Qd7, text: 'Qd7.', autoAdvance: 800, highlightSquares: ['d8', 'd7'] },
    { type: 'play-move', fen: FEN.after_Qb3_Qd7, correctMove: 'Rad1', prompt: 'Your move.', hint: 'Rad1.', correctFeedback: 'Rad1.', wrongFeedback: 'Rad1.' },
    { type: 'instruction', fen: FEN.after_Rad1_OO_black, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_Rad1_OO_black, correctMove: 'Nd5', prompt: 'Your move.', hint: 'Nd5.', correctFeedback: 'Nd5.', wrongFeedback: 'Nd5.' },
    { type: 'instruction', fen: FEN.after_Nd5_Nxd5, text: 'Nxd5.', autoAdvance: 800, highlightSquares: ['f6', 'd5'] },
    { type: 'play-move', fen: FEN.after_Nd5_Nxd5, correctMove: 'Bxd5+', prompt: 'Your move.', hint: 'Bxd5+.', correctFeedback: 'Bxd5+.', wrongFeedback: 'Bxd5+.' },
    { type: 'instruction', fen: FEN.after_Kh8, text: 'Kh8.', autoAdvance: 800, highlightSquares: ['g8', 'h8'] },
    { type: 'play-move', fen: FEN.after_Kh8, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_e5push_dxe5, text: 'dxe5.', autoAdvance: 800, highlightSquares: ['d6', 'e5'] },
    { type: 'play-move', fen: FEN.after_e5push_dxe5, correctMove: 'Bxe5', prompt: 'Your move.', hint: 'Bxe5.', correctFeedback: 'Bxe5.', wrongFeedback: 'Bxe5.' },

    // ── BRIDGE: deviation tests ──
    {
      type: 'instruction',
      fen: FEN.after_Bxe5,
      text: "Main line done. Now test the deviations.",
      buttonText: 'CONTINUE',
    },

    // ── DEVIATION d5! ──
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Black plays d5! instead of taking. Find the right response.",
    },
    { type: 'instruction', fen: FEN.cg_d5, text: 'd5!', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.cg_d5, correctMove: 'exd5', prompt: 'Your move.', hint: 'exd5.', correctFeedback: 'exd5 — take the pawn.', wrongFeedback: 'exd5.' },
    { type: 'instruction', fen: FEN.cg_Qxd5, text: 'Qxd5.', autoAdvance: 800, highlightSquares: ['d5', 'd5'] },
    { type: 'play-move', fen: FEN.cg_Qxd5, correctMove: 'cxd4', prompt: 'Your move.', hint: 'cxd4.', correctFeedback: 'cxd4.', wrongFeedback: 'cxd4.' },
    { type: 'instruction', fen: FEN.cg_Qxd4, text: 'Qxd4.', autoAdvance: 800, highlightSquares: ['d4', 'd4'] },
    { type: 'play-move', fen: FEN.cg_Qxd4, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3 — develop and chase the queen.', wrongFeedback: 'Nc3.' },

    // ── DEVIATION Nc6 decline ──
    {
      type: 'instruction',
      fen: FEN.after_c3,
      text: "Black plays Nc6 — tries to decline. What do you play?",
    },
    { type: 'instruction', fen: FEN.dec_Nc6, text: 'Nc6.', autoAdvance: 800, highlightSquares: ['b8', 'c6'] },
    { type: 'play-move', fen: FEN.dec_Nc6, correctMove: 'Bc4', prompt: 'Your move.', hint: 'Bc4 — keep the gambit tension.', correctFeedback: 'Bc4 — gambit stays on.', wrongFeedback: 'Bc4.' },
    { type: 'instruction', fen: FEN.dec_dxc3, text: 'dxc3.', autoAdvance: 800, highlightSquares: ['d4', 'c3'] },
    { type: 'play-move', fen: FEN.dec_dxc3, correctMove: 'Nxc3', prompt: 'Your move.', hint: 'Nxc3.', correctFeedback: 'Nxc3.', wrongFeedback: 'Nxc3.' },
    { type: 'instruction', fen: FEN.dec_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.dec_Nf6, correctMove: 'Nge2', prompt: 'Your move.', hint: 'Nge2.', correctFeedback: 'Nge2.', wrongFeedback: 'Nge2.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dec_Nge2,
      text: "Danish Gambit complete. Two pawns, two bishops, 96% win rate in the main line. You know why Witty calls it his best weapon.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP MAP
// ═══════════════════════════════════════════════════════════

const LESSONS: Record<string, OpeningLesson> = {
  'wd-1':          WD_1,
  'wd-2':          WD_2,
  'wd-3':          WD_3,
  'wd-4':          WD_4,
  'wd-5':          WD_5,
  'wd-dev-d5':     WD_DEV_D5,
  'wd-dev-Nxc3':   WD_DEV_NXC3,
  'wd-dev-Nc6':    WD_DEV_NC6,
  'wd-test-1':     WD_TEST_1,
}

export function getWittyAlienDanishLesson(id: string): OpeningLesson | undefined {
  return LESSONS[id]
}
