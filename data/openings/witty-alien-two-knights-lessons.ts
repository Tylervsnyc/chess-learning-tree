import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — TWO KNIGHTS TRAP LESSONS (watk-1 through watk-test-1)
//
// ⚠️  RULES EXCEPTION: Same trick-weapon framing as the main Alien Gambit tree.
// 6.Nxf7 is unsound but the Bg6# trap is celebrated — Hikaru beat an FM with it.
// Lean INTO the celebrity hook.
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.Nc3 d5 3.Nf3 dxe4 4.Nxe4 Nf6 5.Neg5 h6
//            6.Nxf7!! Kxf7 7.Ne5+ Ke8 8.Bd3 Be6 9.Bg6+ Bf7 10.Bxf7#
//
// FENs computed with chess.js from move sequences. Mate verified legal.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:     'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:     'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nc3:    'rnbqkbnr/pp1ppppp/2p5/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2',
  after_d5:     'rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3',
  after_Nf3:    'rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 3',
  after_dxe4:   'rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4',
  after_Nxe4:   'rnbqkbnr/pp2pppp/2p5/8/4N3/5N2/PPPP1PPP/R1BQKB1R b KQkq - 0 4',
  after_Nf6:    'rnbqkb1r/pp2pppp/2p2n2/8/4N3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5',
  after_Neg5:   'rnbqkb1r/pp2pppp/2p2n2/6N1/8/5N2/PPPP1PPP/R1BQKB1R b KQkq - 2 5',
  after_h6:     'rnbqkb1r/pp2ppp1/2p2n1p/6N1/8/5N2/PPPP1PPP/R1BQKB1R w KQkq - 0 6',
  after_Nxf7:   'rnbqkb1r/pp2pNp1/2p2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R b KQkq - 0 6',
  after_Kxf7:   'rnbq1b1r/pp2pkp1/2p2n1p/8/8/5N2/PPPP1PPP/R1BQKB1R w KQ - 0 7',
  after_Ne5:    'rnbq1b1r/pp2pkp1/2p2n1p/4N3/8/8/PPPP1PPP/R1BQKB1R b KQ - 1 7',
  after_Ke8:    'rnbqkb1r/pp2p1p1/2p2n1p/4N3/8/8/PPPP1PPP/R1BQKB1R w KQ - 2 8',
  after_Bd3:    'rnbqkb1r/pp2p1p1/2p2n1p/4N3/8/3B4/PPPP1PPP/R1BQK2R b KQ - 3 8',
  after_Be6:    'rn1qkb1r/pp2p1p1/2p1bn1p/4N3/8/3B4/PPPP1PPP/R1BQK2R w KQ - 4 9',
  after_Bg6:    'rn1qkb1r/pp2p1p1/2p1bnBp/4N3/8/8/PPPP1PPP/R1BQK2R b KQ - 5 9',
  after_Bf7:    'rn1qkb1r/pp2pbp1/2p2nBp/4N3/8/8/PPPP1PPP/R1BQK2R w KQ - 6 10',
  after_Bxf7:   'rn1qkb1r/pp2pBp1/2p2n1p/4N3/8/8/PPPP1PPP/R1BQK2R b KQ - 0 10',

  // === Bc4 mistake demo — 8.Bc4?? Qd4! (eval flips to -1.3)
  bc4_after_Bc4: 'rnbqkb1r/pp2p1p1/2p2n1p/4N3/2B5/8/PPPP1PPP/R1BQK2R b KQ - 3 8',
  bc4_after_Qd4: 'rnb1kb1r/pp2p1p1/2p2n1p/4N3/2Bq4/8/PPPP1PPP/R1BQK2R w KQ - 4 9',

  // === DEVIATION Kg8 — 7…Kg8 8.Bc4+ e6 9.d4
  kg8_after_Kg8:  'rnbq1bkr/pp2p1p1/2p2n1p/4N3/8/8/PPPP1PPP/R1BQKB1R w KQ - 2 8',
  kg8_after_Bc4:  'rnbq1bkr/pp2p1p1/2p2n1p/4N3/2B5/8/PPPP1PPP/R1BQK2R b KQ - 3 8',
  kg8_after_e6:   'rnbq1bkr/pp4p1/2p1pn1p/4N3/2B5/8/PPPP1PPP/R1BQK2R w KQ - 0 9',
  kg8_after_d4:   'rnbq1bkr/pp4p1/2p1pn1p/4N3/2BP4/8/PPP2PPP/R1BQK2R b KQ - 0 9',

  // === DEVIATION Ke6 — 7…Ke6?? 8.d4!
  ke6_after_Ke6:  'rnbq1b1r/pp2p1p1/2p1kn1p/4N3/8/8/PPPP1PPP/R1BQKB1R w KQ - 2 8',
  ke6_after_d4:   'rnbq1b1r/pp2p1p1/2p1kn1p/4N3/3P4/8/PPP2PPP/R1BQKB1R b KQ - 0 8',
}


// ═══════════════════════════════════════════════════════════
// watk-1: DIFFERENT MOVE ORDER (1.e4 c6 2.Nc3 d5 3.Nf3)
// First lesson — no recap.
// Teaches: e4, Nc3, Nf3
// ═══════════════════════════════════════════════════════════

const WATK_1: OpeningLesson = {
  id: 'watk-1',
  title: 'Different Move Order',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Two Knights Trap — same Caro-Kann, but you skip d4 and develop both knights first. Why? Because Hikaru Nakamura beat an FM with the mate at the end of this line.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The setup looks innocent. The trap snaps shut in 10 moves.",
    },

    // ── TEACH 1: e4 ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: "Open with the king pawn.",
      hint: 'Push e2 to e4.',
      correctFeedback: 'e4 — same start as the main Alien Gambit. You need Black to play c6.',
      wrongFeedback: 'Play e4 — Caro-Kann starts with 1.e4.',
      postMoveArrow: [['e4', 'd5'], ['e4', 'f5']],
    },
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Standard. Black plays c6 for the Caro-Kann.",
      arrow: ['e2', 'e4'],
    },

    // ── TEACH 2: Nc3 (NOT d4) ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Black plays c6 — Caro-Kann territory. Here's where the Two Knights line splits off.",
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: "Skip d4. Develop a knight to attack the center instead.",
      hint: 'Bring the b1 knight to c3 — it eyes both d5 and e4.',
      correctFeedback: "Nc3! Different from the main Alien Gambit (which plays d4 first). You're going straight to development.",
      wrongFeedback: 'Play Nc3 — this is the Two Knights move order. No d4 yet.',
      postMoveArrow: ['c3', 'e4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Nc3 defends e4 with a piece, not a pawn. Black usually plays d5 next, hitting e4 anyway.",
      arrow: ['b1', 'c3'],
    },

    // ── TEACH 3: Nf3 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Black plays d5 — attacking e4. Same as the main Alien line, just with a knight on c3 instead of a pawn on d4.",
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: "Develop the other knight before Black captures on e4.",
      hint: 'Bring the g1 knight to f3 — controls e5 and prepares the kingside.',
      correctFeedback: "Nf3! Two knights out, both pointing at the center. That's why this is called the Two Knights line.",
      wrongFeedback: "Play Nf3 — develop the other knight.",
      postMoveArrow: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Both knights developed. Black has to capture on e4 now — and the trap is loading.",
      arrow: ['g1', 'f3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Play it from the start.",
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
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "e4, Nc3, Nf3 — two knights, no pawns past the second rank. Different setup, same plan: take Black's king on a walk.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-2: SAME IDEA (3…dxe4 4.Nxe4 Nf6)
// Teaches: Nxe4 (Black recaps with knight, Black plays Nf6)
// We only teach 1 White move this lesson (Nxe4) — but that's fine,
// the recall fills out the 6-step minimum.
// ═══════════════════════════════════════════════════════════

const WATK_2: OpeningLesson = {
  id: 'watk-2',
  title: 'Same Idea',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Black has the same options as before — capture on e4. The Caro-Kann player almost always takes.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Quick replay first.",
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
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },

    // ── BLACK dxe4 ──
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: "Black takes — dxe4. They expect you to recapture with the knight, just like the main line.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },

    // ── TEACH: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: "Win the pawn back with the knight on c3.",
      hint: 'Knight on c3 takes e4.',
      correctFeedback: "Nxe4 — the knight is now in the center, pointing at g5 and f6. Sound familiar?",
      wrongFeedback: 'Capture with the knight: Nxe4.',
      postMoveArrow: [['e4', 'g5'], ['e4', 'f6']],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Knight on e4. Black almost always plays Nf6, attacking your knight and trying to trade.",
      arrow: ['e4', 'g5'],
    },

    // ── BLACK Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nf6. Black wants the trade — but you have two knights and they only have one defender. You don't trade. You jump.",
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Nxe4, Nf6. The position looks identical to the main Alien Gambit — except no pawn on d4. That detail matters in a minute.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-3: THE JUMP (5.Neg5 h6 6.Nxf7!)
// Teaches: Neg5, Nxf7
// CRITICAL: Neg5 (the e-knight, not the f-knight) — chess.js needs disambiguation
// ═══════════════════════════════════════════════════════════

const WATK_3: OpeningLesson = {
  id: 'watk-3',
  title: 'The Jump',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Two knights, one move each. Now you sacrifice the knight on f7 — same as the main Alien Gambit. But here's the trick: which knight jumps?",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Recap.",
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
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },

    // ── TEACH 1: Neg5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "You have two knights that can go to g5 — the one on e4 and the one on f3. Only one is right. The e-knight goes to g5.",
      highlightSquares: ['e4', 'f3', 'g5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Neg5',
      prompt: "Move the e4-knight to g5 (attacking f7).",
      hint: 'Drag the knight on e4 to g5. The notation is Neg5 to disambiguate from the f3 knight.',
      correctFeedback: "Neg5! The e-knight goes to g5 — attacks f7, and keeps the f3 knight where it belongs (heading to e5 in a moment).",
      wrongFeedback: 'Play Neg5 — the knight from e4, not f3. Drag the e4 knight.',
      postMoveArrow: ['g5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Neg5,
      text: "Why the e-knight, not the f-knight? Because Nf3 is going to deliver the next check from e5. Save it for that.",
      arrow: ['g5', 'f7'],
    },

    // ── BLACK h6 ──
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 — Black tries to kick the knight, just like in the main Alien Gambit. They have no idea what's coming.",
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },

    // ── TEACH 2: Nxf7! ──
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: "Sacrifice. You know this move.",
      hint: 'Knight takes f7 — the signature Alien Gambit sacrifice.',
      correctFeedback: "Nxf7!! Same sacrifice, slightly different setup. The king has to take.",
      wrongFeedback: 'Play Nxf7 — sacrifice the knight, drag the king out.',
      postMoveArrow: ['f7', 'e8'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxf7,
      text: "Nxf7. Black has no choice — Kxf7 or lose the rook. You already know what comes next.",
      arrow: ['e8', 'f7'],
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxf7,
      text: "Neg5, Nxf7. Same sacrifice you know — but here the f3 knight is still on the board, ready to swing in with check.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-4: THE CHECK (6…Kxf7 7.Ne5+)
// Teaches: Ne5+
// In the main Alien Gambit you played Nf3 here (slow). Here Nf3 is already
// developed — so Ne5+ comes IMMEDIATELY. No pause.
// ═══════════════════════════════════════════════════════════

const WATK_4: OpeningLesson = {
  id: 'watk-4',
  title: 'The Check',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxf7,
      text: "In the main Alien Gambit, after Kxf7 you played the quiet Nf3 to develop. Here? Your knight is ALREADY on f3. So you skip the quiet move and check immediately.",
    },

    // ── RECAP (shortened — moves 1-6) ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay first.",
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
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Neg5',
      prompt: 'Your move.',
      hint: 'Neg5 (the e-knight).',
      correctFeedback: 'Neg5.',
      wrongFeedback: 'Neg5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },

    // ── BLACK Kxf7 ──
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: "Kxf7. The king walks into the open — exactly where you want it.",
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },

    // ── TEACH: Ne5+ ──
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Ne5+',
      prompt: "Knight jump time. Where does it go with check?",
      hint: 'The f3 knight to e5 — direct check on f7.',
      correctFeedback: "Ne5+! No quiet moves here — straight to check. The king has only three squares: Ke8, Kg8, or the disastrous Ke6.",
      wrongFeedback: 'Play Ne5+ — your f3 knight checks the king right now.',
      postMoveArrow: ['e5', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Ne5+. Black has three king moves. Two are bad. One — Ke8 — walks right into Hikaru's mating net.",
      highlightSquares: ['e8', 'g8', 'e6'],
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Nxf7, Ne5+. The king has to move. Next lesson: the trap.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-5: THE Bg6# TRAP (7…Ke8 8.Bd3 Be6?? 9.Bg6+ Bf7 10.Bxf7#)
// Teaches: Bd3, then a PUZZLE for the mating sequence
// THE Hikaru-vs-FM mate.
// ═══════════════════════════════════════════════════════════

const WATK_5: OpeningLesson = {
  id: 'watk-5',
  title: 'The Bg6# Trap',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Black plays the natural Ke8 — running back toward home. Hikaru Nakamura played this exact position vs an FM and won with mate. You're about to learn that mate.",
    },

    // ── BLACK Ke8 ──
    {
      type: 'instruction',
      fen: FEN.after_Ke8,
      text: "Ke8. The king retreats. Looks safe, right? Nothing's attacking it.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e8'],
    },

    // ── TEACH 1: Bd3 ──
    {
      type: 'instruction',
      fen: FEN.after_Ke8,
      text: "Now you need a quiet bishop move that sets up a brutal threat. The bishop wants the b1-h7 diagonal.",
      highlightSquares: ['d3', 'g6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ke8,
      correctMove: 'Bd3',
      prompt: "Develop the bishop. Where does it aim at the king?",
      hint: 'Bishop to d3 — points right at g6 and h7.',
      correctFeedback: "Bd3! Eval jumps to about +1.0. The threat is Bg6+ — and if Black doesn't see it, mate follows fast.",
      wrongFeedback: 'Play Bd3 — the bishop wants the b1-h7 diagonal to threaten Bg6+.',
      postMoveArrow: ['d3', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "Bd3 looks innocent. It's not. The bishop is one move from g6, where it pins the king against the knight on e5.",
      arrow: ['d3', 'g6'],
    },

    // ── BLACK Be6?? ──
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "Black plays Be6 — trying to block your bishop's diagonal and defend f7. They missed the killer detail.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "Look at Be6 carefully. It blocks the b1-h7 diagonal at e6. But the bishop on g6 isn't blocked — it would attack the king on e8 from the OTHER side. And there's nothing defending h7.",
      highlightSquares: ['e6', 'g6'],
    },

    // ── PUZZLE: 9.Bg6+ Bf7 10.Bxf7# ──
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "Mate in 2. You drive the sequence.",
    },
    {
      type: 'puzzle',
      fen: FEN.after_Be6,
      solutionMoves: ['Bg6+', 'Bf7', 'Bxf7#'],
      playerColor: 'white',
      prompt: "Find the forced mate.",
      hint: "Jump the bishop to g6 — it's a check. Black's only legal move is Bf7 to block. Then take the bishop on f7 — and the king has nowhere to go.",
      correctFeedback: "Bg6+ Bf7 Bxf7# — that's the mate. The king can't take (Ne5 defends f7) and there's no other escape. This is Hikaru's exact game.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxf7,
      text: "Bxf7# — checkmate. The bishop is defended by the knight on e5. The king can't take, can't run, can't block. Hikaru's mating net.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-6: WHY NOT Bc4 (the natural-looking mistake)
// Quick lesson — Bc4 looks fine but loses to Qd4! double attack.
// Bd3 is the only right square.
// ═══════════════════════════════════════════════════════════

const WATK_6: OpeningLesson = {
  id: 'watk-6',
  title: 'Why NOT Bc4',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ke8,
      text: "Warning lesson. When Black plays Ke8, the natural-looking bishop move is Bc4 — pointing right at f7. It's a trap. For YOU.",
    },

    // ── QUIZ: which bishop move? ──
    {
      type: 'quiz',
      fen: FEN.after_Ke8,
      question: "Black just played Ke8. Which bishop move keeps the trap alive?",
      options: ['Bc4 (aiming at f7)', 'Bd3 (aiming at h7)', 'Be2 (safe development)'],
      correctIndex: 1,
      explanation: "Bd3 is the only winning move. Bc4 looks scary but loses to Qd4! Be2 doesn't threaten anything.",
    },

    // ── SHOW THE Bc4 MISTAKE ──
    {
      type: 'instruction',
      fen: FEN.after_Ke8,
      text: "Let's see why Bc4 fails. Watch what happens if you play it.",
      highlightSquares: ['c4', 'f7'],
    },
    {
      type: 'instruction',
      fen: FEN.bc4_after_Bc4,
      text: "Bc4?? aims at f7. Looks great — except Black has a killer reply.",
      autoAdvance: 800,
      highlightSquares: ['c4'],
    },
    {
      type: 'instruction',
      fen: FEN.bc4_after_Qd4,
      text: "Qd4! Double attack — the queen hits your bishop on c4 AND your knight on e5. You lose a piece. Eval flips from about +1.0 (your favor) to -1.3 (Black's favor).",
      highlightSquares: ['d4', 'c4', 'e5'],
    },

    // ── QUIZ: what did Qd4 attack? ──
    {
      type: 'quiz',
      fen: FEN.bc4_after_Qd4,
      question: "Why is Qd4 such a problem after Bc4?",
      options: [
        'It checks your king',
        'It attacks two pieces at once (your bishop and your knight)',
        'It defends Black\'s king',
      ],
      correctIndex: 1,
      explanation: "Qd4 forks the bishop on c4 and the knight on e5. You can only save one. The bishop on d3 (instead of c4) avoids this entirely.",
    },

    // ── THE FIX: Bd3 ──
    {
      type: 'instruction',
      fen: FEN.after_Ke8,
      text: "Back to the real position. Now play the right move — Bd3, not Bc4.",
      highlightSquares: ['d3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Ke8,
      correctMove: 'Bd3',
      prompt: "Right square for the bishop. Not c4.",
      hint: 'Bishop to d3 — same diagonal idea, but no Qd4 fork.',
      correctFeedback: "Bd3! The bishop stays off the d-file, so Qd4 doesn't hit it. The trap is alive.",
      wrongFeedback: 'Play Bd3 — Bc4 loses to Qd4! Bd3 is the only safe square.',
      postMoveArrow: ['d3', 'g6'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Bd3,
      text: "Bd3. Same threat as Bc4 (the g6-square), zero Qd4 problem. Remember: king on e8 = Bd3, not Bc4.",
      arrow: ['d3', 'g6'],
    },

    // ── RECALL THE MATE TO REINFORCE ──
    {
      type: 'instruction',
      fen: FEN.after_Be6,
      text: "And if Black blocks with Be6, you still know the mate. One more time.",
      autoAdvance: 800,
      highlightSquares: ['c8', 'e6'],
    },
    {
      type: 'puzzle',
      fen: FEN.after_Be6,
      solutionMoves: ['Bg6+', 'Bf7', 'Bxf7#'],
      playerColor: 'white',
      prompt: "Finish the trap. Mate in 2.",
      hint: 'Bg6+ Bf7 Bxf7#.',
      correctFeedback: "Mate. Bd3 (not Bc4) + Bg6# = Hikaru's win.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bxf7,
      text: "Bd3 keeps the trap. Bc4 throws the game. One letter different, totally different result.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-dev-Kg8: DEVIATION — 7…Kg8 (the best Black move)
// 8.Bc4+ e6 9.d4 — Black runs to the corner, you check with Bc4 and build d4.
// ═══════════════════════════════════════════════════════════

const WATK_DEV_KG8: OpeningLesson = {
  id: 'watk-dev-Kg8',
  title: 'If Kg8',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "Black's best move after Ne5+ is Kg8 — running to the corner. You can't mate them in 3 anymore, but you can still get a great position.",
    },

    // ── RECAP (compressed) ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay the moves to the check.",
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
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Neg5',
      prompt: 'Your move.',
      hint: 'Neg5.',
      correctFeedback: 'Neg5.',
      wrongFeedback: 'Neg5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: 'Kxf7.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Ne5+',
      prompt: 'Your move.',
      hint: 'Ne5+.',
      correctFeedback: 'Ne5+.',
      wrongFeedback: 'Ne5+.',
    },

    // ── BLACK Kg8 ──
    {
      type: 'instruction',
      fen: FEN.kg8_after_Kg8,
      text: "Kg8 — Black tucks the king into the corner. This is actually the best square. You can't mate quickly, but you can still develop with check.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'g8'],
    },

    // ── TEACH 1: Bc4+ ──
    {
      type: 'play-move',
      fen: FEN.kg8_after_Kg8,
      correctMove: 'Bc4+',
      prompt: "Bishop with check. Where?",
      hint: "Bishop to c4 — checks the king. (Note: Bc4 IS the right move here, because the king is on g8 not e8 — no Qd4 problem.)",
      correctFeedback: "Bc4+! Black has to block with e6. Note: Bc4 works HERE because the king is on g8 — Qd4 isn't a threat when the king isn't on the same diagonal.",
      wrongFeedback: 'Play Bc4+ — bishop to c4 gives check on the a2-g8 diagonal.',
      postMoveArrow: ['c4', 'g8'],
    },
    {
      type: 'instruction',
      fen: FEN.kg8_after_Bc4,
      text: "Bc4+. Black has one good block: e6.",
      arrow: ['c4', 'g8'],
    },

    // ── BLACK e6 ──
    {
      type: 'instruction',
      fen: FEN.kg8_after_e6,
      text: "e6. Black blocks the check and prepares to develop the dark-squared bishop.",
      autoAdvance: 800,
      highlightSquares: ['e7', 'e6'],
    },

    // ── TEACH 2: d4 ──
    {
      type: 'play-move',
      fen: FEN.kg8_after_e6,
      correctMove: 'd4',
      prompt: "Now build the center. Push the d-pawn.",
      hint: 'Push d2 to d4 — claims the center and supports the knight on e5.',
      correctFeedback: "d4! Two-pawn center, knight supported on e5, bishop active on c4. You're down a knight but have a real attack going.",
      wrongFeedback: 'Play d4 — claim the center and support your e5 knight.',
      postMoveArrow: ['d4', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.kg8_after_d4,
      text: "d4. Position is roughly equal in eval (around +0.5) but you have all the practical chances — Black has to find good moves to convert their extra piece.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.kg8_after_d4,
      text: "Kg8 → Bc4+ e6 d4. No mating net, but a tense middlegame with the king on g8 and your pieces all active.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-dev-Ke6: DEVIATION — 7…Ke6?? (the worst king move)
// 8.d4! is the ONLY winning move. The king is stuck in the open.
// ═══════════════════════════════════════════════════════════

const WATK_DEV_KE6: OpeningLesson = {
  id: 'watk-dev-Ke6',
  title: 'If Ke6??',
  defaultOrientation: 'white',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne5,
      text: "If Black panics and plays Ke6 — the worst possible square — the king is fully exposed. There's exactly one winning move.",
    },

    // ── RECAP (compressed — just to the position) ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Replay to the check.",
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
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: 'c6.',
      autoAdvance: 800,
      highlightSquares: ['c7', 'c6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: 'd5.',
      autoAdvance: 800,
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    {
      type: 'instruction',
      fen: FEN.after_dxe4,
      text: 'dxe4.',
      autoAdvance: 800,
      highlightSquares: ['d5', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_dxe4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: 'Nf6.',
      autoAdvance: 800,
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Neg5',
      prompt: 'Your move.',
      hint: 'Neg5.',
      correctFeedback: 'Neg5.',
      wrongFeedback: 'Neg5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: 'h6.',
      autoAdvance: 800,
      highlightSquares: ['h7', 'h6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_h6,
      correctMove: 'Nxf7',
      prompt: 'Your move.',
      hint: 'Nxf7.',
      correctFeedback: 'Nxf7.',
      wrongFeedback: 'Nxf7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Kxf7,
      text: 'Kxf7.',
      autoAdvance: 800,
      highlightSquares: ['e8', 'f7'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Kxf7,
      correctMove: 'Ne5+',
      prompt: 'Your move.',
      hint: 'Ne5+.',
      correctFeedback: 'Ne5+.',
      wrongFeedback: 'Ne5+.',
    },

    // ── BLACK Ke6?? ──
    {
      type: 'instruction',
      fen: FEN.ke6_after_Ke6,
      text: "Ke6?? — the king walks INTO the center. The worst possible square. Eval already at about +5 for you.",
      autoAdvance: 800,
      highlightSquares: ['f7', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.ke6_after_Ke6,
      text: "The king on e6 looks crazy and IS crazy. Your job: open the position so all your pieces can attack it.",
      highlightSquares: ['e6'],
    },

    // ── TEACH: d4! ──
    {
      type: 'play-move',
      fen: FEN.ke6_after_Ke6,
      correctMove: 'd4',
      prompt: "Open the center. Push the d-pawn.",
      hint: 'Push d2 to d4 — opens lines toward the king on e6 and prepares Bc4+.',
      correctFeedback: "d4! The only winning move. The pawn opens the d-file and the c1-bishop's diagonal — every piece points at the king. Eval around +6.",
      wrongFeedback: 'Play d4 — open the center to swarm the exposed king.',
      postMoveArrow: ['d4', 'e6'],
    },
    {
      type: 'instruction',
      fen: FEN.ke6_after_d4,
      text: "d4. The follow-up plan: Bc4+ next, then the king has nowhere to hide. Black is losing in every line.",
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.ke6_after_d4,
      text: "Ke6?? → d4!. The only winning move, but easy to find — open the position and swing the pieces in.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// watk-test-1: LEVEL 1 TEST
// Tests main line (Bg6# mate) + both deviations. Zero guidance.
// ═══════════════════════════════════════════════════════════

const WATK_TEST_1: OpeningLesson = {
  id: 'watk-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Final test. Play the Two Knights Trap from memory — main line, Hikaru's mate, and both king deviations.",
    },

    // ── MAIN LINE ──
    { type: 'play-move', fen: FEN.start, correctMove: 'e4', prompt: 'Your move.', hint: 'e4.', correctFeedback: 'e4.', wrongFeedback: 'e4.' },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800, highlightSquares: ['c7', 'c6'] },
    { type: 'play-move', fen: FEN.after_c6, correctMove: 'Nc3', prompt: 'Your move.', hint: 'Nc3.', correctFeedback: 'Nc3.', wrongFeedback: 'Nc3.' },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800, highlightSquares: ['d7', 'd5'] },
    { type: 'play-move', fen: FEN.after_d5, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_dxe4, text: 'dxe4.', autoAdvance: 800, highlightSquares: ['d5', 'e4'] },
    { type: 'play-move', fen: FEN.after_dxe4, correctMove: 'Nxe4', prompt: 'Your move.', hint: 'Nxe4.', correctFeedback: 'Nxe4.', wrongFeedback: 'Nxe4.' },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Neg5', prompt: 'Your move.', hint: 'Neg5.', correctFeedback: 'Neg5.', wrongFeedback: 'Neg5.' },
    { type: 'instruction', fen: FEN.after_h6, text: 'h6.', autoAdvance: 800, highlightSquares: ['h7', 'h6'] },
    { type: 'play-move', fen: FEN.after_h6, correctMove: 'Nxf7', prompt: 'Your move.', hint: 'Nxf7.', correctFeedback: 'Nxf7.', wrongFeedback: 'Nxf7.' },
    { type: 'instruction', fen: FEN.after_Kxf7, text: 'Kxf7.', autoAdvance: 800, highlightSquares: ['e8', 'f7'] },
    { type: 'play-move', fen: FEN.after_Kxf7, correctMove: 'Ne5+', prompt: 'Your move.', hint: 'Ne5+.', correctFeedback: 'Ne5+.', wrongFeedback: 'Ne5+.' },
    { type: 'instruction', fen: FEN.after_Ke8, text: 'Ke8.', autoAdvance: 800, highlightSquares: ['f7', 'e8'] },
    { type: 'play-move', fen: FEN.after_Ke8, correctMove: 'Bd3', prompt: 'Your move (not Bc4!).', hint: 'Bd3 — not Bc4.', correctFeedback: 'Bd3.', wrongFeedback: 'Bd3. Remember: Bc4 loses to Qd4.' },
    { type: 'instruction', fen: FEN.after_Be6, text: 'Be6??', autoAdvance: 800, highlightSquares: ['c8', 'e6'] },
    {
      type: 'puzzle',
      fen: FEN.after_Be6,
      solutionMoves: ['Bg6+', 'Bf7', 'Bxf7#'],
      playerColor: 'white',
      prompt: "Mate in 2.",
      hint: 'Bg6+ Bf7 Bxf7#.',
      correctFeedback: "Hikaru's mate. Nice.",
    },

    // ── DEV 1: Kg8 ──
    { type: 'instruction', fen: FEN.after_Ne5, text: "Deviation 1: Black plays Kg8 (best move).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.kg8_after_Kg8, text: 'Kg8.', autoAdvance: 800, highlightSquares: ['f7', 'g8'] },
    { type: 'play-move', fen: FEN.kg8_after_Kg8, correctMove: 'Bc4+', prompt: 'Your move.', hint: 'Bc4+.', correctFeedback: 'Bc4+.', wrongFeedback: 'Bc4+.' },
    { type: 'instruction', fen: FEN.kg8_after_e6, text: 'e6.', autoAdvance: 800, highlightSquares: ['e7', 'e6'] },
    { type: 'play-move', fen: FEN.kg8_after_e6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // ── DEV 2: Ke6 ──
    { type: 'instruction', fen: FEN.after_Ne5, text: "Deviation 2: Black plays Ke6?? (worst move).", buttonText: 'NEXT' },
    { type: 'instruction', fen: FEN.ke6_after_Ke6, text: 'Ke6??', autoAdvance: 800, highlightSquares: ['f7', 'e6'] },
    { type: 'play-move', fen: FEN.ke6_after_Ke6, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },

    // ── FINISH ──
    {
      type: 'instruction',
      fen: FEN.ke6_after_d4,
      text: "Test complete. You know the Two Knights Trap — Hikaru's Bg6# mate, the Bc4 mistake to avoid, and what to do when the king runs the other way.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const WITTY_ALIEN_TWO_KNIGHTS_LESSONS: Record<string, OpeningLesson> = {
  'watk-1': WATK_1,
  'watk-2': WATK_2,
  'watk-3': WATK_3,
  'watk-4': WATK_4,
  'watk-5': WATK_5,
  'watk-6': WATK_6,
  'watk-dev-Kg8': WATK_DEV_KG8,
  'watk-dev-Ke6': WATK_DEV_KE6,
  'watk-test-1': WATK_TEST_1,
}

export function getWittyAlienTwoKnightsLesson(id: string): OpeningLesson | undefined {
  return WITTY_ALIEN_TWO_KNIGHTS_LESSONS[id]
}
