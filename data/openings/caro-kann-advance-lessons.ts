import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// CARO-KANN ADVANCE VARIATION LESSONS (cka-1 through cka-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7
//            6.O-O Ne7 7.Nbd2 h6 8.Nb3 g5 9.a4 Bg7
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  // After each main-line move
  after_e4:    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_c6:    'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_d4:    'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2',
  after_d5:    'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3',
  after_e5:    'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  after_Bf5:   'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4',
  after_Nf3:   'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4',
  after_e6:    'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5',
  after_Be2:   'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq - 1 5',
  after_Nd7:   'r2qkbnr/pp1n1ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R w KQkq - 2 6',
  after_OO:    'r2qkbnr/pp1n1ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 b kq - 3 6',
  after_Ne7:   'r2qkb1r/pp1nnppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 w kq - 4 7',
  after_Nbd2:  'r2qkb1r/pp1nnppp/2p1p3/3pPb2/3P4/5N2/PPPNBPPP/R1BQ1RK1 b kq - 5 7',
  after_h6:    'r2qkb1r/pp1nnpp1/2p1p2p/3pPb2/3P4/5N2/PPPNBPPP/R1BQ1RK1 w kq - 0 8',
  after_Nb3:   'r2qkb1r/pp1nnpp1/2p1p2p/3pPb2/3P4/1N3N2/PPP1BPPP/R1BQ1RK1 b kq - 1 8',
  after_g5:    'r2qkb1r/pp1nnp2/2p1p2p/3pPbp1/3P4/1N3N2/PPP1BPPP/R1BQ1RK1 w kq - 0 9',
  after_a4:    'r2qkb1r/pp1nnp2/2p1p2p/3pPbp1/P2P4/1N3N2/1PP1BPPP/R1BQ1RK1 b kq - 0 9',
  after_Bg7:   'r2qk2r/pp1nnpb1/2p1p2p/3pPbp1/P2P4/1N3N2/1PP1BPPP/R1BQ1RK1 w kq - 1 10',

  // Deviation: 4.Nc3 e6 5.g4 Bg6 6.Nge2 c5
  dev_Nc3_after_Nc3:  'rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 4',
  dev_Nc3_after_e6:   'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
  dev_Nc3_after_g4:   'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P2P1/2N5/PPP2P1P/R1BQKBNR b KQkq - 0 5',
  dev_Nc3_after_Bg6:  'rn1qkbnr/pp3ppp/2p1p1b1/3pP3/3P2P1/2N5/PPP2P1P/R1BQKBNR w KQkq - 1 6',
  dev_Nc3_after_Nge2: 'rn1qkbnr/pp3ppp/2p1p1b1/3pP3/3P2P1/2N5/PPP1NP1P/R1BQKB1R b KQkq - 2 6',
  dev_Nc3_after_c5:   'rn1qkbnr/pp3ppp/4p1b1/2ppP3/3P2P1/2N5/PPP1NP1P/R1BQKB1R w KQkq - 0 7',
}


// ═══════════════════════════════════════════════════════════
// cka-1: BISHOP BEFORE THE WALL (1.e4 c6 2.d4 d5 3.e5 Bf5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const CKA_1: OpeningLesson = {
  id: 'cka-1',
  title: 'Bishop Before the Wall',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The Caro-Kann Advance — White pushes e5 early to grab space. Your job: get the light-squared bishop out to f5 before playing e6 traps it forever.",
    },

    // ── PREDICT/REVEAL 1: c6 ──
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
      correctMove: 'c6',
      prompt: "White opened with e4. Start the Caro-Kann.",
      hint: 'Push the c-pawn one square — you want to challenge the center with d5 next move.',
      correctFeedback: 'c6 sets up d5, preparing to fight for the center on your own terms.',
      wrongFeedback: 'The Caro-Kann starts with c6 — prepare d5 first.',
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "c6 prepares d5 — a solid foundation for the center battle.",
      arrow: ['c7', 'c6'],
    },

    // ── PREDICT/REVEAL 2: d5 ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "White plays d4, building a strong center.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "White has a big pawn center. How do you challenge it?",
      hint: 'Push your d-pawn two squares to challenge e4 directly.',
      correctFeedback: 'd5 directly challenges White\'s e4 pawn — the point of c6.',
      wrongFeedback: 'Play d5 to strike at the center — that\'s what c6 was preparing.',
    },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "d5 attacks the e4 pawn — now White has to decide how to handle the tension.",
      arrow: ['d7', 'd5'],
    },

    // ── PREDICT/REVEAL 3: Bf5 ──
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White plays e5 — the Advance Variation. The center is closed.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Bf5',
      prompt: "White just closed the center with e5. Where does the bishop go?",
      hint: 'Get the light-squared bishop out now — once you play e6, it will be locked in permanently.',
      correctFeedback: 'Bf5 gets the bishop active before e6 closes the diagonal forever.',
      wrongFeedback: 'The bishop needs to escape before e6 — Bf5 is the key Caro-Kann move.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Bf5 is the whole point of the Caro-Kann — the bishop is out in the open where it belongs, not locked behind pawns.",
      arrow: ['c8', 'f5'],
    },

    // ── RECALL ──
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
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: "Your move.",
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White plays e5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Bf5',
      prompt: "Your move.",
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "The bishop is out — now build your solid pawn structure in the next lesson.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cka-2: SOLID SETUP (4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7)
// ═══════════════════════════════════════════════════════════

const CKA_2: OpeningLesson = {
  id: 'cka-2',
  title: 'Solid Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "The bishop is active on f5. Now support the d5 pawn with e6, develop the knight to d7, and follow up with Ne7 to prepare your kingside counterplay.",
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
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: "Your move.",
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White plays e5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Bf5',
      prompt: "Your move.",
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── PREDICT/REVEAL 1: e6 ──
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
      correctMove: 'e6',
      prompt: "White played Nf3. How do you reinforce the d5 pawn?",
      hint: 'Support d5 by advancing the e-pawn one square.',
      correctFeedback: 'e6 gives the d5 pawn extra support and locks in a solid pawn structure.',
      wrongFeedback: 'Play e6 to solidify the center — your d5 pawn needs a friend.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e6,
      text: "e6 shores up d5 and keeps the center stable — the bishop on f5 is well placed with this pawn chain.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: Nd7 ──
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "White develops the bishop to e2.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Nd7',
      prompt: "White played Be2. Which knight move develops and defends?",
      hint: 'The knight to d7 supports both the e5 square and future plans — it also avoids blocking the c8 bishop.',
      correctFeedback: 'Nd7 develops the knight without blocking the bishop on f5, and supports the pawn on d5.',
      wrongFeedback: 'Play Nd7 — it develops the queenside knight without getting in the way of other pieces.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nd7,
      text: "Nd7 is a flexible developing move — the knight is ready to go to f8, b6, or deeper into the position as needed.",
      arrow: ['b8', 'd7'],
    },

    // ── PREDICT/REVEAL 3: Ne7 ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles kingside.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Ne7',
      prompt: "White castled. Where does the g8 knight go?",
      hint: 'The knight heads to e7 to support g6 and keep flexibility for future kingside or center play.',
      correctFeedback: 'Ne7 keeps the f8 bishop free to develop and prepares the kingside expansion with g5 later.',
      wrongFeedback: 'Play Ne7 — it develops the knight while keeping the f8 bishop unblocked.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Ne7 is perfectly placed — both knights are developed, the bishops have routes, and you're ready for the plan in the next lesson.",
      arrow: ['g8', 'e7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Show me you've got this.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'e6',
      prompt: "Your move.",
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "White plays Be2.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Nd7',
      prompt: "Your move.",
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Both knights developed, structure solid — now it's time to grab kingside space.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cka-dev-Nc3: IF 4.Nc3 — e6, Bg6, c5
// Deviation from lesson 2 (after 3.e5 Bf5)
// ═══════════════════════════════════════════════════════════

const CKA_DEV_NC3: OpeningLesson = {
  id: 'cka-dev-Nc3',
  title: 'If 4.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Sometimes White plays Nc3 instead of Nf3, aiming for the aggressive g4 pawn push to attack your bishop. Here's how to handle it.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Prove you know these moves!",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: "Your move.",
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White plays e5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Bf5',
      prompt: "Your move.",
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },

    // ── DEVIATION SETUP ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "White plays Nc3 instead of Nf3 — planning to push g4 and attack the bishop on f5.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },

    // ── PREDICT/REVEAL 1: e6 ──
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'e6',
      prompt: "White played Nc3. How do you solidify your position?",
      hint: 'Support the d5 pawn and close the center — same idea as the main line.',
      correctFeedback: 'e6 supports d5 and keeps your pawn structure solid against the coming g4 push.',
      wrongFeedback: 'Play e6 to shore up your center before White launches the kingside attack.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_e6,
      text: "e6 secures d5 — now White plays g4 to challenge the bishop on f5.",
      arrow: ['e7', 'e6'],
    },

    // ── PREDICT/REVEAL 2: Bg6 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_g4,
      text: "White plays g4, attacking the bishop on f5.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_g4,
      correctMove: 'Bg6',
      prompt: "White attacked your bishop with g4. Where does it go?",
      hint: 'Step the bishop back to g6 — it stays on the same diagonal and keeps the structure intact.',
      correctFeedback: 'Bg6 retreats to safety while keeping the bishop active on the g6-a2 diagonal.',
      wrongFeedback: 'Retreat to Bg6 — the bishop stays useful and gets out of g4\'s way.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Bg6,
      text: "Bg6 is the standard response — the bishop stays on the board and White's g4 didn't accomplish much.",
      arrow: ['f5', 'g6'],
    },

    // ── PREDICT/REVEAL 3: c5 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nge2,
      text: "White develops the knight to e2.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nge2,
      correctMove: 'c5',
      prompt: "White played Nge2. How do you counterattack in the center?",
      hint: 'Strike at White\'s d4 pawn with your c-pawn — open the game before White gets set up.',
      correctFeedback: 'c5 attacks d4 and opens lines for your pieces — the best way to fight back in the center.',
      wrongFeedback: 'Play c5 to attack the d4 pawn and create counterplay before White consolidates.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_c5,
      text: "c5 is the key counterattack — you hit d4 and open the c-file, keeping the game dynamic even though White has pushed g4.",
      arrow: ['c6', 'c5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "Last time through — make these moves your own.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'e6',
      prompt: "Your move.",
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_g4,
      text: "White plays g4.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_g4,
      correctMove: 'Bg6',
      prompt: "Your move.",
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nge2,
      text: "White plays Nge2.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nge2,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_c5,
      text: "Nc3 sideline handled — e6, Bg6, c5 is the solid answer to White's kingside aggression.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cka-3: KINGSIDE PUSH (7.Nbd2 h6 8.Nb3 g5 9.a4 Bg7)
// ═══════════════════════════════════════════════════════════

const CKA_3: OpeningLesson = {
  id: 'cka-3',
  title: 'Kingside Push',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Ne7,
      text: "Both sides are developed. Now Black stakes out kingside space with h6 and g5, then tucks the dark-squared bishop to g7 to control the long diagonal.",
    },

    // ── RECAP ──
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
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: "Your move.",
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White plays e5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Bf5',
      prompt: "Your move.",
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
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
      correctMove: 'e6',
      prompt: "Your move.",
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "White plays Be2.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Nd7',
      prompt: "Your move.",
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },

    // ── PREDICT/REVEAL 1: h6 ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "White develops the knight to d2.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'h6',
      prompt: "White played Nbd2. How do you start the kingside expansion?",
      hint: 'Push the h-pawn one square — this prepares g5 without letting White\'s pieces jump into g5 first.',
      correctFeedback: 'h6 secures the g5 square so you can push g5 safely on the next move.',
      wrongFeedback: 'Play h6 to prepare g5 and claim kingside space.',
    },
    {
      type: 'instruction',
      fen: FEN.after_h6,
      text: "h6 takes away g5 from White's pieces and sets up the g5 push — classic Caro-Kann Advance play.",
      arrow: ['h7', 'h6'],
    },

    // ── PREDICT/REVEAL 2: g5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: "White repositions the knight to b3.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'g5',
      prompt: "White moved the knight to b3. Now launch the kingside push.",
      hint: 'Advance the g-pawn — it grabs space and prepares to fianchetto the bishop on g7.',
      correctFeedback: 'g5 grabs kingside territory and clears g7 for the bishop to fianchetto.',
      wrongFeedback: 'Play g5 to claim kingside space — h6 already made this safe.',
    },
    {
      type: 'instruction',
      fen: FEN.after_g5,
      text: "g5 secures the kingside flank — Black has a space advantage on the right side of the board.",
      arrow: ['g7', 'g5'],
    },

    // ── PREDICT/REVEAL 3: Bg7 ──
    {
      type: 'instruction',
      fen: FEN.after_a4,
      text: "White plays a4, starting queenside counterplay.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'Bg7',
      prompt: "White played a4 on the queenside. Where does the f8 bishop go?",
      hint: 'Fianchetto the bishop to g7 — it controls the long a1-h8 diagonal from behind your pawn chain.',
      correctFeedback: 'Bg7 places the bishop on the long diagonal, putting pressure on White\'s queenside and center.',
      wrongFeedback: 'Play Bg7 to fianchetto the bishop — it becomes very powerful on the g7 square.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "Bg7 completes a powerful setup — the bishop on g7 controls the long diagonal while your pawns command the kingside.",
      arrow: ['f8', 'g7'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "Prove you know these moves!",
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'h6',
      prompt: "Your move.",
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: "White plays Nb3.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'g5',
      prompt: "Your move.",
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a4,
      text: "White plays a4.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Bg7,
      text: "The full Caro-Kann Advance setup — bishop active, pawns in control, ready for the middlegame fight.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// cka-test-1: LEVEL TEST
// Tests main line + Nc3 deviation
// ═══════════════════════════════════════════════════════════

const CKA_TEST_1: OpeningLesson = {
  id: 'cka-test-1',
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
      correctMove: 'c6',
      prompt: "Your move.",
      hint: 'c6.',
      correctFeedback: 'c6.',
      wrongFeedback: 'c6.',
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
      correctMove: 'd5',
      prompt: "Your move.",
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "White plays e5.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Bf5',
      prompt: "Your move.",
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
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
      correctMove: 'e6',
      prompt: "Your move.",
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Be2,
      text: "White plays Be2.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'Nd7',
      prompt: "Your move.",
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Ne7',
      prompt: "Your move.",
      hint: 'Ne7.',
      correctFeedback: 'Ne7.',
      wrongFeedback: 'Ne7.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nbd2,
      text: "White plays Nbd2.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'd2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nbd2,
      correctMove: 'h6',
      prompt: "Your move.",
      hint: 'h6.',
      correctFeedback: 'h6.',
      wrongFeedback: 'h6.',
    },
    {
      type: 'instruction',
      fen: FEN.after_Nb3,
      text: "White plays Nb3.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'b3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nb3,
      correctMove: 'g5',
      prompt: "Your move.",
      hint: 'g5.',
      correctFeedback: 'g5.',
      wrongFeedback: 'g5.',
    },
    {
      type: 'instruction',
      fen: FEN.after_a4,
      text: "White plays a4.",
      autoAdvance: 800,
      highlightSquares: ['a2', 'a4'],
    },
    {
      type: 'play-move',
      fen: FEN.after_a4,
      correctMove: 'Bg7',
      prompt: "Your move.",
      hint: 'Bg7.',
      correctFeedback: 'Bg7.',
      wrongFeedback: 'Bg7.',
    },

    // ── DEVIATION: Nc3 ──
    {
      type: 'instruction',
      fen: FEN.after_Bf5,
      text: "Now the Nc3 sideline — what happens when White plays Nc3 instead of Nf3?",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'e6',
      prompt: "Your move.",
      hint: 'e6.',
      correctFeedback: 'e6.',
      wrongFeedback: 'e6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_g4,
      text: "White plays g4.",
      autoAdvance: 800,
      highlightSquares: ['g2', 'g4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_g4,
      correctMove: 'Bg6',
      prompt: "Your move.",
      hint: 'Bg6.',
      correctFeedback: 'Bg6.',
      wrongFeedback: 'Bg6.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nge2,
      text: "White plays Nge2.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'e2'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nge2,
      correctMove: 'c5',
      prompt: "Your move.",
      hint: 'c5.',
      correctFeedback: 'c5.',
      wrongFeedback: 'c5.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LOOKUP FUNCTION
// ═══════════════════════════════════════════════════════════

export function getCaroKannAdvanceLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'cka-1': return CKA_1
    case 'cka-2': return CKA_2
    case 'cka-dev-Nc3': return CKA_DEV_NC3
    case 'cka-3': return CKA_3
    case 'cka-test-1': return CKA_TEST_1
    default: return undefined
  }
}
