import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// KING'S GAMBIT LESSONS (kg-1 through kg-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 e5 2.f4 exf4 3.Nf3 d6 4.d4 g5 5.h4 g4 6.Ng1 Bh6 7.Nc3 Ne7
//            8.Be2 Ng6 9.Bxf4 Bxf4 10.Bxg4
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:         'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:         'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_f4:         'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2',
  after_exf4:       'rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3',
  after_Nf3:        'rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq - 1 3',
  after_d6:         'rnbqkbnr/ppp2ppp/3p4/8/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq - 0 4',
  after_d4:         'rnbqkbnr/ppp2ppp/3p4/8/3PPp2/5N2/PPP3PP/RNBQKB1R b KQkq - 0 4',
  after_g5:         'rnbqkbnr/ppp2p1p/3p4/6p1/3PPp2/5N2/PPP3PP/RNBQKB1R w KQkq - 0 5',
  after_h4:         'rnbqkbnr/ppp2p1p/3p4/6p1/3PPp1P/5N2/PPP3P1/RNBQKB1R b KQkq - 0 5',
  after_g4:         'rnbqkbnr/ppp2p1p/3p4/8/3PPppP/5N2/PPP3P1/RNBQKB1R w KQkq - 0 6',
  after_Ng1:        'rnbqkbnr/ppp2p1p/3p4/8/3PPppP/8/PPP3P1/RNBQKBNR b KQkq - 1 6',
  after_Bh6:        'rnbqk1nr/ppp2p1p/3p3b/8/3PPppP/8/PPP3P1/RNBQKBNR w KQkq - 2 7',
  after_Nc3:        'rnbqk1nr/ppp2p1p/3p3b/8/3PPppP/2N5/PPP3P1/R1BQKBNR b KQkq - 3 7',
  after_Ne7:        'rnbqk2r/ppp1np1p/3p3b/8/3PPppP/2N5/PPP3P1/R1BQKBNR w KQkq - 4 8',
  after_Be2:        'rnbqk2r/ppp1np1p/3p3b/8/3PPppP/2N5/PPP1B1P1/R1BQK1NR b KQkq - 5 8',
  after_Ng6:        'rnbqk2r/ppp2p1p/3p2nb/8/3PPppP/2N5/PPP1B1P1/R1BQK1NR w KQkq - 6 9',
  after_Bxf4_w:     'rnbqk2r/ppp2p1p/3p2nb/8/3PPBpP/2N5/PPP1B1P1/R2QK1NR b KQkq - 0 9',
  after_Bxf4_b:     'rnbqk2r/ppp2p1p/3p2n1/8/3PPbpP/2N5/PPP1B1P1/R2QK1NR w KQkq - 0 10',
  after_Bxg4:       'rnbqk2r/ppp2p1p/3p2n1/8/3PPbBP/2N5/PPP3P1/R2QK1NR b KQkq - 0 10',

  // Punish: 2...Bc5? (declining the gambit)
  punish_after_Bc5:  'rnbqk1nr/pppp1ppp/8/2b1p3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 1 3',
  punish_after_fxe5: 'rnbqk1nr/pppp1ppp/8/2b1P3/4P3/8/PPPP2PP/RNBQKBNR b KQkq - 0 3',

  // Punish: 3...g5? (premature push)
  punish_after_g5_early: 'rnbqkbnr/pppp1p1p/8/6p1/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq - 0 4',
  punish_after_h4_early: 'rnbqkbnr/pppp1p1p/8/6p1/4Pp1P/5N2/PPPP2P1/RNBQKB1R b KQkq - 0 4',
  punish_after_g4_early: 'rnbqkbnr/pppp1p1p/8/8/4PppP/5N2/PPPP2P1/RNBQKB1R w KQkq - 0 5',
  punish_after_Ne5:      'rnbqkbnr/pppp1p1p/8/4N3/4PppP/8/PPPP2P1/RNBQKB1R b KQkq - 1 5',

  // Branch: Fischer Defense (3...d5)
  fischer_after_d5:   'rnbqkbnr/ppp2ppp/8/3p4/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq - 0 4',
  fischer_after_exd5: 'rnbqkbnr/ppp2ppp/8/3P4/5p2/5N2/PPPP2PP/RNBQKB1R b KQkq - 0 4',
  fischer_after_Nf6:  'rnbqkb1r/ppp2ppp/5n2/3P4/5p2/5N2/PPPP2PP/RNBQKB1R w KQkq - 1 5',
  fischer_after_Bb5:  'rnbqkb1r/ppp2ppp/5n2/1B1P4/5p2/5N2/PPPP2PP/RNBQK2R b KQkq - 2 5',

  // Branch: Cunningham Defense (3...Be7)
  cunningham_after_Be7: 'rnbqk1nr/ppppbppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq - 2 4',
  cunningham_after_Bc4: 'rnbqk1nr/ppppbppp/8/8/2B1Pp2/5N2/PPPP2PP/RNBQK2R b KQkq - 3 4',
  cunningham_after_Bh4: 'rnbqk1nr/pppp1ppp/8/8/2B1Pp1b/5N2/PPPP2PP/RNBQK2R w KQkq - 4 5',
  cunningham_after_Kf1: 'rnbqk1nr/pppp1ppp/8/8/2B1Pp1b/5N2/PPPP2PP/RNBQ1K1R b kq - 5 5',
}


// ═══════════════════════════════════════════════════════════
// kg-1: THE GAMBIT (1.e4 e5 2.f4 exf4 3.Nf3)
// First lesson — no recap. Teach + Punish + Recall.
// ═══════════════════════════════════════════════════════════

const KG_1: OpeningLesson = {
  id: 'kg-1',
  title: 'The Gambit',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 2: TEACH ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the King's Gambit — the most aggressive opening in chess. You're going to sacrifice a pawn for a devastating attack.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start with the king pawn.',
      hint: 'e2 to e4.',
      correctFeedback: "e4! Control the center and open lines for your bishop and queen.",
      wrongFeedback: 'Push the king pawn two squares.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5 — Black mirrors your move.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Now here's the gambit. You're going to offer your f-pawn. If Black takes it, you get open lines and fast development.",
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'f4',
      prompt: 'Offer the gambit pawn.',
      hint: "f2 to f4 — sacrifice a pawn to rip open the center.",
      correctFeedback: "f4! The King's Gambit. You're offering a pawn, but the f-file and diagonals will open up for your attack.",
      wrongFeedback: "Play f4 — offer the pawn. The attack is worth it.",
      highlightSquares: ['f2', 'f4'],
    },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4 — Black takes the bait.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_exf4,
      text: "Black grabbed the pawn. Now develop your knight and attack the f4 pawn.",
    },
    {
      type: 'play-move',
      fen: FEN.after_exf4,
      correctMove: 'Nf3',
      prompt: 'Develop with a threat.',
      hint: "Nf3 — develop the knight and eye f4 and d4.",
      correctFeedback: "Nf3! You develop with tempo — the knight eyes f4 and controls key central squares.",
      wrongFeedback: "Bring the knight to f3 — it develops and pressures f4.",
      highlightSquares: ['g1', 'f3'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "After Nf3, beginners sometimes try to hold the f4 pawn with g5. But that's a mistake this early — without d6 first, you can punish immediately.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_g5_early,
      text: "3...g5? It looks like it defends f4, but the kingside is wide open.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_g5_early,
      correctMove: 'h4',
      prompt: 'Challenge the g5 pawn immediately.',
      hint: "h4 — attack the overextended pawn.",
      correctFeedback: "h4! You attack g5 right away. Black has to push g4, and then your knight leaps in.",
      wrongFeedback: "Play h4 to challenge Black's pawn chain.",
      highlightSquares: ['h2', 'h4'],
    },
    { type: 'instruction', fen: FEN.punish_after_g4_early, text: 'g4 — the pawn pushes your knight.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_g4_early,
      correctMove: 'Ne5',
      prompt: 'Jump into the outpost!',
      hint: "Ne5 — a powerful centralized knight.",
      correctFeedback: "Ne5! The knight dominates from e5. It attacks f7 and can't be easily kicked.",
      wrongFeedback: "Jump the knight to e5 — it's a dream square.",
      highlightSquares: ['f3', 'e5'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Now play it from memory.",
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
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'f4',
      prompt: 'Your move.',
      hint: 'f4.',
      correctFeedback: 'f4.',
      wrongFeedback: 'f4.',
    },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exf4,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-2: SEIZE THE CENTER (3...d6 4.d4 g5 5.h4)
// ═══════════════════════════════════════════════════════════

const KG_2: OpeningLesson = {
  id: 'kg-2',
  title: 'Seize the Center',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 1: RECAP ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start the King\'s Gambit.',
      hint: 'e4.',
      correctFeedback: 'e4!',
      wrongFeedback: 'e4.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'f4',
      prompt: 'Offer the gambit.',
      hint: 'f4.',
      correctFeedback: 'f4!',
      wrongFeedback: 'f4.',
      highlightSquares: ['f2', 'f4'],
    },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exf4,
      correctMove: 'Nf3',
      prompt: 'Develop with tempo.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Nf3.',
      highlightSquares: ['g1', 'f3'],
    },

    // ── ACT 2: TEACH ──
    { type: 'instruction', fen: FEN.after_d6, text: 'd6 — Black solidifies the center and prepares to hold the f4 pawn.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_d6,
      text: "Black played d6, preparing ...g5 to hold the pawn. You need to seize the center before Black settles in.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'd4',
      prompt: 'Claim the center with your other pawn.',
      hint: "d4 — two pawns in the center is powerful.",
      correctFeedback: "d4! Two center pawns. You're building a classical pawn center while Black defends a flank pawn.",
      wrongFeedback: "Push d4 — claim the center.",
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_g5, text: 'g5 — Black defends the f4 pawn.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_g5,
      text: "Black pushes g5 to protect f4. Time to challenge that pawn chain from the flank.",
    },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'h4',
      prompt: "Attack Black's pawn chain.",
      hint: "h4 — undermine g5.",
      correctFeedback: "h4! You challenge g5 immediately. If Black pushes g4, your knight retreats but you've opened the h-file.",
      wrongFeedback: "Play h4 to undermine the g5 pawn.",
      highlightSquares: ['h2', 'h4'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "Sometimes Black refuses the gambit by developing instead of taking on f4.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "2...Bc5? Black declines the gambit — but leaves e5 hanging.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'fxe5',
      prompt: "Black left e5 undefended. Grab it!",
      hint: "fxe5 — win the pawn for free.",
      correctFeedback: "fxe5! You win a pawn. Black declined the gambit but got nothing in return.",
      wrongFeedback: "Take on e5 — it's free.",
      highlightSquares: ['f4', 'e5'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Your turn — play the next three moves from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.after_g5, text: 'g5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'h4',
      prompt: 'Your move.',
      hint: 'h4.',
      correctFeedback: 'h4.',
      wrongFeedback: 'h4.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-punish-bc5: PUNISH 2...Bc5? (Declining the Gambit)
// ═══════════════════════════════════════════════════════════

const KG_PUNISH_BC5: OpeningLesson = {
  id: 'kg-punish-bc5',
  title: 'Punish 2...Bc5?',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "You played f4 — the King's Gambit. But what if Black doesn't take?",
      arrow: ['f4', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "2...Bc5? Black develops the bishop instead of taking. Looks natural — but there's a problem.",
      highlightSquares: ['e5'],
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'fxe5',
      prompt: 'The e5 pawn is undefended. Take it!',
      hint: 'fxe5 — win a free pawn.',
      correctFeedback: "fxe5! Black declined the gambit but left e5 hanging. You're up a pawn with a great center.",
      wrongFeedback: 'Take on e5 — the pawn is free.',
      highlightSquares: ['f4', 'e5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "Black played Bc5. Punish it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'fxe5',
      prompt: 'Your move.',
      hint: 'fxe5.',
      correctFeedback: 'fxe5.',
      wrongFeedback: 'fxe5.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-punish-g5: PUNISH 3...g5? (Premature g5)
// ═══════════════════════════════════════════════════════════

const KG_PUNISH_G5: OpeningLesson = {
  id: 'kg-punish-g5',
  title: 'Punish 3...g5?',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "After 3.Nf3, Black wants to hold the f4 pawn. The correct way is d6 first — but some players rush g5 immediately.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_g5_early,
      text: "3...g5?? Too aggressive, too fast. Black skipped d6 and the kingside is overextended.",
      highlightSquares: ['g5', 'f4'],
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.punish_after_g5_early,
      correctMove: 'h4',
      prompt: 'Challenge the pawn chain.',
      hint: 'h4 — attack g5 before Black can consolidate.',
      correctFeedback: "h4! You immediately challenge g5. Black must push g4, losing the pawn chain.",
      wrongFeedback: 'Play h4 to attack the overextended pawn.',
      highlightSquares: ['h2', 'h4'],
    },
    { type: 'instruction', fen: FEN.punish_after_g4_early, text: 'g4 — the pawn chases your knight.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_g4_early,
      correctMove: 'Ne5',
      prompt: 'Your knight has a dream square. Jump in!',
      hint: "Ne5 — centralized and powerful.",
      correctFeedback: "Ne5! The knight is untouchable on e5. It attacks f7 and dominates the position.",
      wrongFeedback: 'Leap to e5 — the knight controls the board from there.',
      highlightSquares: ['f3', 'e5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.punish_after_g5_early,
      text: "Black pushed g5 too early. Punish it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_g5_early,
      correctMove: 'h4',
      prompt: 'Your move.',
      hint: 'h4.',
      correctFeedback: 'h4.',
      wrongFeedback: 'h4.',
    },
    { type: 'instruction', fen: FEN.punish_after_g4_early, text: 'g4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_g4_early,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-3: THE RETREAT (5...g4 6.Ng1 Bh6 7.Nc3)
// ═══════════════════════════════════════════════════════════

const KG_3: OpeningLesson = {
  id: 'kg-3',
  title: 'The Retreat',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 1: RECAP ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start the gambit.',
      hint: 'e4.',
      correctFeedback: 'e4!',
      wrongFeedback: 'e4.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'f4',
      prompt: 'The gambit.',
      hint: 'f4.',
      correctFeedback: 'f4!',
      wrongFeedback: 'f4.',
      highlightSquares: ['f2', 'f4'],
    },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exf4,
      correctMove: 'Nf3',
      prompt: 'Develop.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Nf3.',
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'd4',
      prompt: 'Claim the center.',
      hint: 'd4.',
      correctFeedback: 'd4!',
      wrongFeedback: 'd4.',
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_g5, text: 'g5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'h4',
      prompt: 'Challenge g5.',
      hint: 'h4.',
      correctFeedback: 'h4!',
      wrongFeedback: 'h4.',
      highlightSquares: ['h2', 'h4'],
    },

    // ── ACT 2: TEACH ──
    { type: 'instruction', fen: FEN.after_g4, text: 'g4 — Black chases your knight away.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_g4,
      text: "Your knight is attacked by g4. The bold move: retreat it all the way back to g1. Trust the plan — you'll redeploy through c3.",
    },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'Ng1',
      prompt: "Retreat the knight. Trust the plan.",
      hint: "Ng1 — it looks strange, but Nc3 is coming next.",
      correctFeedback: "Ng1! It looks bizarre, but the knight will come back stronger via c3. Meanwhile, Black's kingside pawns are overextended.",
      wrongFeedback: 'Retreat to g1 — the knight will redeploy through c3.',
      highlightSquares: ['f3', 'g1'],
    },
    { type: 'instruction', fen: FEN.after_Bh6, text: 'Bh6 — Black develops the bishop to the only open diagonal.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_Bh6,
      text: "Now bring the knight out to c3 — it controls d5 and e4, and prepares piece play.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'Nc3',
      prompt: "Redeploy the knight.",
      hint: "Nc3 — develop toward the center.",
      correctFeedback: "Nc3! The knight is back in the game, controlling d5 and supporting the e4 pawn.",
      wrongFeedback: 'Bring the knight to c3.',
      highlightSquares: ['b1', 'c3'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "What if Black counter-gambits with 3...d5? This is the Fischer Defense — let's see how to handle it.",
    },
    {
      type: 'instruction',
      fen: FEN.fischer_after_d5,
      text: "3...d5 — Black strikes the center immediately. Take the pawn!",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.fischer_after_d5,
      correctMove: 'exd5',
      prompt: "Take the pawn — you're up material.",
      hint: "exd5 — accept the gift.",
      correctFeedback: "exd5! You're now up a pawn. Black will develop with Nf6, but you have Bb5+ with tempo.",
      wrongFeedback: "Capture on d5.",
      highlightSquares: ['e4', 'd5'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_h4,
      text: "Play the next moves from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_g4, text: 'g4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'Ng1',
      prompt: 'Your move.',
      hint: 'Ng1.',
      correctFeedback: 'Ng1.',
      wrongFeedback: 'Ng1.',
    },
    { type: 'instruction', fen: FEN.after_Bh6, text: 'Bh6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-fischer-1: FISCHER DEFENSE (3...d5 4.exd5 Nf6 5.Bb5+)
// ═══════════════════════════════════════════════════════════

const KG_FISCHER_1: OpeningLesson = {
  id: 'kg-fischer-1',
  title: 'Fischer Defense',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "After 3.Nf3, Bobby Fischer's favorite response was 3...d5 — a bold counter-gambit striking the center.",
    },
    {
      type: 'instruction',
      fen: FEN.fischer_after_d5,
      text: "3...d5! Black gives back the pawn to fight for the center. You should take it.",
      autoAdvance: 1200,
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.fischer_after_d5,
      correctMove: 'exd5',
      prompt: 'Accept the counter-sacrifice.',
      hint: "exd5 — take the pawn.",
      correctFeedback: "exd5! You're up a pawn. Black will develop quickly, but you have a strong response ready.",
      wrongFeedback: 'Capture on d5.',
      highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.fischer_after_Nf6, text: 'Nf6 — Black develops and attacks the d5 pawn.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.fischer_after_Nf6,
      text: "Black develops the knight attacking d5. Don't defend the pawn — develop with check instead!",
    },
    {
      type: 'play-move',
      fen: FEN.fischer_after_Nf6,
      correctMove: 'Bb5+',
      prompt: "Develop with check — tempo is everything.",
      hint: "Bb5+ — check the king and disrupt Black's plan.",
      correctFeedback: "Bb5+! Check forces Black to deal with the bishop before recapturing on d5. You keep the initiative.",
      wrongFeedback: 'Play Bb5 with check — develop and gain tempo.',
      highlightSquares: ['f1', 'b5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.fischer_after_d5,
      text: "Black played d5. Handle the Fischer Defense.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.fischer_after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.fischer_after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fischer_after_Nf6,
      correctMove: 'Bb5+',
      prompt: 'Your move.',
      hint: 'Bb5+.',
      correctFeedback: 'Bb5+.',
      wrongFeedback: 'Bb5+.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-4: WIN IT BACK (7...Ne7 8.Be2 Ng6 9.Bxf4)
// ═══════════════════════════════════════════════════════════

const KG_4: OpeningLesson = {
  id: 'kg-4',
  title: 'Win It Back',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 1: RECAP ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start.',
      hint: 'e4.',
      correctFeedback: 'e4!',
      wrongFeedback: 'e4.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'f4',
      prompt: 'The gambit.',
      hint: 'f4.',
      correctFeedback: 'f4!',
      wrongFeedback: 'f4.',
      highlightSquares: ['f2', 'f4'],
    },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exf4,
      correctMove: 'Nf3',
      prompt: 'Develop.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Nf3.',
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'd4',
      prompt: 'Center.',
      hint: 'd4.',
      correctFeedback: 'd4!',
      wrongFeedback: 'd4.',
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_g5, text: 'g5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'h4',
      prompt: 'Challenge.',
      hint: 'h4.',
      correctFeedback: 'h4!',
      wrongFeedback: 'h4.',
      highlightSquares: ['h2', 'h4'],
    },
    { type: 'instruction', fen: FEN.after_g4, text: 'g4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'Ng1',
      prompt: 'Retreat.',
      hint: 'Ng1.',
      correctFeedback: 'Ng1!',
      wrongFeedback: 'Ng1.',
      highlightSquares: ['f3', 'g1'],
    },
    { type: 'instruction', fen: FEN.after_Bh6, text: 'Bh6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'Nc3',
      prompt: 'Redeploy.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3!',
      wrongFeedback: 'Nc3.',
      highlightSquares: ['b1', 'c3'],
    },

    // ── ACT 2: TEACH ──
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Ne7 — Black develops the knight toward g6.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Time to develop your light-squared bishop. Be2 eyes the g4 pawn and prepares castling.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Ne7,
      correctMove: 'Be2',
      prompt: "Develop the bishop — target the weak g4 pawn.",
      hint: "Be2 — it puts pressure on g4 and prepares castling.",
      correctFeedback: "Be2! The bishop eyes g4. Once Black moves the knight, you'll win back your pawn.",
      wrongFeedback: "Play Be2 — develop and target g4.",
      highlightSquares: ['f1', 'e2'],
    },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Ng6 — the knight settles on g6.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_Ng6,
      text: "Now the f4 bishop is undefended by the knight. Time to recapture your gambit pawn!",
      highlightSquares: ['f4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ng6,
      correctMove: 'Bxf4',
      prompt: "Win back the gambit pawn!",
      hint: "Bxf4 — recapture and develop.",
      correctFeedback: "Bxf4! You win back the pawn AND develop your bishop to an active square. The gambit has paid off.",
      wrongFeedback: "Take on f4 — your bishop belongs there.",
      highlightSquares: ['c1', 'f4'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "What if Black plays Be7 instead? The Cunningham Defense — a tricky try.",
    },
    {
      type: 'instruction',
      fen: FEN.cunningham_after_Be7,
      text: "3...Be7 — Black eyes the h4 square for a check. Don't panic — develop your bishop first.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Be7,
      correctMove: 'Bc4',
      prompt: "Develop your bishop — aim at f7.",
      hint: "Bc4 — the bishop targets the weak f7 pawn.",
      correctFeedback: "Bc4! You develop toward f7. If Black checks with Bh4+, you simply play Kf1.",
      wrongFeedback: "Play Bc4 — target f7.",
      highlightSquares: ['f1', 'c4'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Play the last three moves from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Ne7.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ne7,
      correctMove: 'Be2',
      prompt: 'Your move.',
      hint: 'Be2.',
      correctFeedback: 'Be2.',
      wrongFeedback: 'Be2.',
    },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Ng6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ng6,
      correctMove: 'Bxf4',
      prompt: 'Your move.',
      hint: 'Bxf4.',
      correctFeedback: 'Bxf4.',
      wrongFeedback: 'Bxf4.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-cunningham-1: CUNNINGHAM DEFENSE (3...Be7 4.Bc4 Bh4+ 5.Kf1)
// ═══════════════════════════════════════════════════════════

const KG_CUNNINGHAM_1: OpeningLesson = {
  id: 'kg-cunningham-1',
  title: 'Cunningham Defense',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Instead of d6 or g5, Black plays 3...Be7 — preparing a check on h4. This is the Cunningham Defense.",
    },
    {
      type: 'instruction',
      fen: FEN.cunningham_after_Be7,
      text: "3...Be7 — the bishop is heading for h4 to check your king. Stay calm and develop.",
      autoAdvance: 1200,
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Be7,
      correctMove: 'Bc4',
      prompt: "Develop your bishop — aim at the weak f7 square.",
      hint: "Bc4 — attack f7 before Black can check.",
      correctFeedback: "Bc4! You target f7 — the weakest point in Black's position. If the check comes, you're ready.",
      wrongFeedback: "Play Bc4 — develop and attack f7.",
      highlightSquares: ['f1', 'c4'],
    },
    { type: 'instruction', fen: FEN.cunningham_after_Bh4, text: 'Bh4+ — Black checks the king!', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.cunningham_after_Bh4,
      text: "Don't block with g3 — that weakens your king. Simply step aside with Kf1. You'll castle later by hand if needed.",
    },
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Bh4,
      correctMove: 'Kf1',
      prompt: "Move the king — stay safe and keep your structure.",
      hint: "Kf1 — step aside. Your king is safe on f1.",
      correctFeedback: "Kf1! You lose castling rights, but your king is perfectly safe on f1. Your pieces are more developed and you're attacking f7.",
      wrongFeedback: "Play Kf1 — the king is fine there.",
      highlightSquares: ['e1', 'f1'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.cunningham_after_Be7,
      text: "Black played Be7. Handle the Cunningham.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Be7,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.cunningham_after_Bh4, text: 'Bh4+.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Bh4,
      correctMove: 'Kf1',
      prompt: 'Your move.',
      hint: 'Kf1.',
      correctFeedback: 'Kf1.',
      wrongFeedback: 'Kf1.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// kg-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const KG_TEST_1: OpeningLesson = {
  id: 'kg-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time to prove you know the King's Gambit. Play the full main line from memory.",
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
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'f4',
      prompt: 'Your move.',
      hint: 'f4.',
      correctFeedback: 'f4.',
      wrongFeedback: 'f4.',
    },
    { type: 'instruction', fen: FEN.after_exf4, text: 'exf4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exf4,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    { type: 'instruction', fen: FEN.after_d6, text: 'd6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.after_g5, text: 'g5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g5,
      correctMove: 'h4',
      prompt: 'Your move.',
      hint: 'h4.',
      correctFeedback: 'h4.',
      wrongFeedback: 'h4.',
    },
    { type: 'instruction', fen: FEN.after_g4, text: 'g4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_g4,
      correctMove: 'Ng1',
      prompt: 'Your move.',
      hint: 'Ng1.',
      correctFeedback: 'Ng1.',
      wrongFeedback: 'Ng1.',
    },
    { type: 'instruction', fen: FEN.after_Bh6, text: 'Bh6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bh6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    { type: 'instruction', fen: FEN.after_Ne7, text: 'Ne7.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ne7,
      correctMove: 'Be2',
      prompt: 'Your move.',
      hint: 'Be2.',
      correctFeedback: 'Be2.',
      wrongFeedback: 'Be2.',
    },
    { type: 'instruction', fen: FEN.after_Ng6, text: 'Ng6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Ng6,
      correctMove: 'Bxf4',
      prompt: 'Your move.',
      hint: 'Bxf4.',
      correctFeedback: 'Bxf4.',
      wrongFeedback: 'Bxf4.',
    },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_f4,
      text: "Main line done. Now handle the deviations.",
    },
    // Deviation 1: 2...Bc5?
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "Black plays 2...Bc5. You know what to do.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'fxe5',
      prompt: 'Your move.',
      hint: 'fxe5.',
      correctFeedback: 'fxe5.',
      wrongFeedback: 'fxe5.',
    },
    // Deviation 2: 3...g5? early
    {
      type: 'instruction',
      fen: FEN.punish_after_g5_early,
      text: "Black plays 3...g5 without d6 first.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_g5_early,
      correctMove: 'h4',
      prompt: 'Your move.',
      hint: 'h4.',
      correctFeedback: 'h4.',
      wrongFeedback: 'h4.',
    },
    { type: 'instruction', fen: FEN.punish_after_g4_early, text: 'g4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_g4_early,
      correctMove: 'Ne5',
      prompt: 'Your move.',
      hint: 'Ne5.',
      correctFeedback: 'Ne5.',
      wrongFeedback: 'Ne5.',
    },
    // Deviation 3: Fischer 3...d5
    {
      type: 'instruction',
      fen: FEN.fischer_after_d5,
      text: "Black plays 3...d5. The Fischer Defense.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.fischer_after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.fischer_after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.fischer_after_Nf6,
      correctMove: 'Bb5+',
      prompt: 'Your move.',
      hint: 'Bb5+.',
      correctFeedback: 'Bb5+.',
      wrongFeedback: 'Bb5+.',
    },
    // Deviation 4: Cunningham 3...Be7
    {
      type: 'instruction',
      fen: FEN.cunningham_after_Be7,
      text: "Black plays 3...Be7. The Cunningham.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Be7,
      correctMove: 'Bc4',
      prompt: 'Your move.',
      hint: 'Bc4.',
      correctFeedback: 'Bc4.',
      wrongFeedback: 'Bc4.',
    },
    { type: 'instruction', fen: FEN.cunningham_after_Bh4, text: 'Bh4+.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.cunningham_after_Bh4,
      correctMove: 'Kf1',
      prompt: 'Your move.',
      hint: 'Kf1.',
      correctFeedback: 'Kf1.',
      wrongFeedback: 'Kf1.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const KINGS_GAMBIT_LESSONS: Record<string, OpeningLesson> = {
  'kg-1': KG_1,
  'kg-2': KG_2,
  'kg-punish-bc5': KG_PUNISH_BC5,
  'kg-punish-g5': KG_PUNISH_G5,
  'kg-3': KG_3,
  'kg-fischer-1': KG_FISCHER_1,
  'kg-4': KG_4,
  'kg-cunningham-1': KG_CUNNINGHAM_1,
  'kg-test-1': KG_TEST_1,
}

export function getKingsGambitLesson(id: string): OpeningLesson | undefined {
  return KINGS_GAMBIT_LESSONS[id]
}
