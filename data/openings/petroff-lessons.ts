import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// PETROFF DEFENSE LESSONS (pt-1 through pt-test-1)
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Identity: 1.e4 e5 2.Nf3 Nf6
// Main line: 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3 Nc6 7.O-O Be7
//            8.c4 Nb4 9.Be2 O-O 10.Nc3 Bf5 11.a3 Nxc3
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Identity position (after 1.e4 e5 2.Nf3 Nf6)
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:         'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:         'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:        'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nf6:        'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',

  // Main line positions
  after_Nxe5:       'rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
  after_d6:         'rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
  after_Nf3_back:   'rnbqkb1r/ppp2ppp/3p1n2/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 4',
  after_Nxe4:       'rnbqkb1r/ppp2ppp/3p4/8/4n3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 5',
  after_d4:         'rnbqkb1r/ppp2ppp/3p4/8/3Pn3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 5',
  after_d5:         'rnbqkb1r/ppp2ppp/8/3p4/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 6',
  after_Bd3:        'rnbqkb1r/ppp2ppp/8/3p4/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 6',
  after_Nc6:        'r1bqkb1r/ppp2ppp/2n5/3p4/3Pn3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 2 7',
  after_OO_w:       'r1bqkb1r/ppp2ppp/2n5/3p4/3Pn3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 3 7',
  after_Be7:        'r1bqk2r/ppp1bppp/2n5/3p4/3Pn3/3B1N2/PPP2PPP/RNBQ1RK1 w kq - 4 8',
  after_c4:         'r1bqk2r/ppp1bppp/2n5/3p4/2PPn3/3B1N2/PP3PPP/RNBQ1RK1 b kq - 0 8',
  after_Nb4:        'r1bqk2r/ppp1bppp/8/3p4/1nPPn3/3B1N2/PP3PPP/RNBQ1RK1 w kq - 1 9',
  after_Be2:        'r1bqk2r/ppp1bppp/8/3p4/1nPPn3/5N2/PP2BPPP/RNBQ1RK1 b kq - 2 9',
  after_OO_b:       'r1bq1rk1/ppp1bppp/8/3p4/1nPPn3/5N2/PP2BPPP/RNBQ1RK1 w - - 3 10',
  after_Nc3:        'r1bq1rk1/ppp1bppp/8/3p4/1nPPn3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 4 10',
  after_Bf5:        'r2q1rk1/ppp1bppp/8/3p1b2/1nPPn3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 5 11',
  after_a3:         'r2q1rk1/ppp1bppp/8/3p1b2/1nPPn3/P1N2N2/1P2BPPP/R1BQ1RK1 b - - 0 11',
  after_Nxc3:       'r2q1rk1/ppp1bppp/8/3p1b2/1nPP4/P1n2N2/1P2BPPP/R1BQ1RK1 w - - 0 12',

  // Deviation: 3.d4 Nxe4 4.Bd3 d5 5.Nxe5 Nd7
  dev_d4:           'rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3',
  dev_d4_Nxe4:      'rnbqkb1r/pppp1ppp/8/4p3/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  dev_d4_Bd3:       'rnbqkb1r/pppp1ppp/8/4p3/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4',
  dev_d4_d5:        'rnbqkb1r/ppp2ppp/8/3pp3/3Pn3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  dev_d4_Nxe5:      'rnbqkb1r/ppp2ppp/8/3pN3/3Pn3/3B4/PPP2PPP/RNBQK2R b KQkq - 0 5',
  dev_d4_Nd7:       'r1bqkb1r/pppn1ppp/8/3pN3/3Pn3/3B4/PPP2PPP/RNBQK2R w KQkq - 1 6',

  // Deviation: 5.Nc3 Nxc3 6.dxc3 Be7 7.Be3 O-O
  dev_nc3:          'rnbqkb1r/ppp2ppp/3p4/8/4n3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 5',
  dev_nc3_Nxc3:     'rnbqkb1r/ppp2ppp/3p4/8/8/2n2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 6',
  dev_nc3_dxc3:     'rnbqkb1r/ppp2ppp/3p4/8/8/2P2N2/PPP2PPP/R1BQKB1R b KQkq - 0 6',
  dev_nc3_Be7:      'rnbqk2r/ppp1bppp/3p4/8/8/2P2N2/PPP2PPP/R1BQKB1R w KQkq - 1 7',
  dev_nc3_Be3:      'rnbqk2r/ppp1bppp/3p4/8/8/2P1BN2/PPP2PPP/R2QKB1R b KQkq - 2 7',
  dev_nc3_OO:       'rnbq1rk1/ppp1bppp/3p4/8/8/2P1BN2/PPP2PPP/R2QKB1R w KQ - 3 8',
}


// ═══════════════════════════════════════════════════════════
// pt-1: THE COUNTERATTACK (3...d6, 4...Nxe4, 5...d5)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const PT_1: OpeningLesson = {
  id: 'pt-1',
  title: 'The Counterattack',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Welcome to the Petroff Defense. White just played Nf3, and you mirrored with Nf6 — now White takes your e5 pawn. Time to win it back.",
    },

    // ── OPPONENT: 3.Nxe5 ──
    { type: 'instruction', fen: FEN.after_Nxe5, text: "White captures your e5 pawn with the knight.", autoAdvance: 800, highlightSquares: ['f3', 'e5'] },

    // ── PREDICT 1: d6 ──
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: "White took your pawn. How do you kick the knight away?",
      hint: 'Push a pawn to attack the knight on e5.',
      correctFeedback: "d6 forces the knight to retreat. You'll win back the e4 pawn next.",
      wrongFeedback: 'Play d6 to attack the knight on e5.',
    },
    { type: 'instruction', fen: FEN.after_d6, text: "d6 attacks the knight and opens the diagonal for your bishop. The knight must retreat.", arrow: ['d7', 'd6'] },

    // ── OPPONENT: 4.Nf3 ──
    { type: 'instruction', fen: FEN.after_Nf3_back, text: "The knight retreats to f3.", autoAdvance: 800, highlightSquares: ['e5', 'f3'] },

    // ── PREDICT 2: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.after_Nf3_back,
      correctMove: 'Nxe4',
      prompt: "The e4 pawn is undefended. What do you play?",
      hint: 'Capture the e4 pawn with your knight.',
      correctFeedback: "Nxe4 wins back the pawn. Material is equal again.",
      wrongFeedback: 'Take the e4 pawn with your knight.',
    },
    { type: 'instruction', fen: FEN.after_Nxe4, text: "Nxe4 recaptures the pawn. You're equal on material with a strong knight in the center.", arrow: ['f6', 'e4'] },

    // ── OPPONENT: 5.d4 ──
    { type: 'instruction', fen: FEN.after_d4, text: "White pushes d4 to claim the center.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // ── PREDICT 3: d5 ──
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: "White is building a pawn center. How do you respond?",
      hint: 'Match White in the center with your d-pawn.',
      correctFeedback: "d5 plants a strong pawn in the center. Your position is rock solid.",
      wrongFeedback: 'Push d5 to claim your share of the center.',
    },
    { type: 'instruction', fen: FEN.after_d5, text: "d5 gives you a symmetric pawn center. The Petroff is known for this solid, equal structure.", arrow: ['d6', 'd5'] },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Now play it from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    { type: 'instruction', fen: FEN.after_Nf3_back, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['e5', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_back,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },

    // ── OUTRO ──
    { type: 'instruction', fen: FEN.after_d5, text: "d6, Nxe4, d5 — the Petroff counterattack. You won back the pawn and built a solid center." },
  ],
}


// ═══════════════════════════════════════════════════════════
// pt-2: DEVELOPMENT (6...Nc6, 7...Be7, 8...Nb4)
// ═══════════════════════════════════════════════════════════

const PT_2: OpeningLesson = {
  id: 'pt-2',
  title: 'Development',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "You've won back the pawn and built a solid center. Now it's time to develop your pieces.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Let's see what you remember!",
    },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    { type: 'instruction', fen: FEN.after_Nf3_back, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['e5', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_back,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },

    // ── OPPONENT: 6.Bd3 ──
    { type: 'instruction', fen: FEN.after_Bd3, text: "White develops the bishop to d3, eyeing your knight on e4.", autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // ── PREDICT 1: Nc6 ──
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: "Time to develop a piece. Where does the knight belong?",
      hint: 'Develop the queenside knight to a natural square.',
      correctFeedback: "Nc6 develops the knight to its best square, controlling d4 and e5.",
      wrongFeedback: 'Bring the knight to c6 — it controls key central squares.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: "Nc6 develops naturally and puts pressure on d4. The knight also supports a future Be7.", arrow: ['b8', 'c6'] },

    // ── OPPONENT: 7.O-O ──
    { type: 'instruction', fen: FEN.after_OO_w, text: "White castles kingside.", autoAdvance: 800, highlightSquares: ['e1', 'g1'] },

    // ── PREDICT 2: Be7 ──
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Be7',
      prompt: "White just castled. How do you prepare to castle too?",
      hint: 'Develop the bishop to clear the way for castling.',
      correctFeedback: "Be7 develops the bishop and prepares kingside castling.",
      wrongFeedback: 'Play Be7 to develop and prepare to castle.',
    },
    { type: 'instruction', fen: FEN.after_Be7, text: "Be7 is a quiet but strong move. The bishop develops, and you're one move from castling.", arrow: ['f8', 'e7'] },

    // ── OPPONENT: 8.c4 ──
    { type: 'instruction', fen: FEN.after_c4, text: "White attacks your d5 pawn with c4.", autoAdvance: 800, highlightSquares: ['c2', 'c4'] },

    // ── PREDICT 3: Nb4 ──
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nb4',
      prompt: "White is pushing in the center. Find an active move for your knight.",
      hint: 'Jump the knight to attack the bishop on d3.',
      correctFeedback: "Nb4 attacks the Bd3 and forces White to deal with the threat.",
      wrongFeedback: 'Play Nb4 — the knight leaps forward to attack White\'s bishop.',
    },
    { type: 'instruction', fen: FEN.after_Nb4, text: "Nb4 is a key move. The knight attacks the bishop on d3, and White will have to retreat it.", arrow: ['c6', 'b4'] },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Prove you know these moves!",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nb4',
      prompt: 'Your move.',
      hint: 'Nb4.',
      correctFeedback: 'Nb4.',
      wrongFeedback: 'Nb4.',
    },

    // ── OUTRO ──
    { type: 'instruction', fen: FEN.after_Nb4, text: "Nc6, Be7, Nb4 — your pieces are active and White's bishop is under fire." },
  ],
}


// ═══════════════════════════════════════════════════════════
// pt-3: COMPLETING THE SETUP (9...O-O, 10...Bf5, 11...Nxc3)
// ═══════════════════════════════════════════════════════════

const PT_3: OpeningLesson = {
  id: 'pt-3',
  title: 'Completing the Setup',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nb4,
      text: "Your knight is attacking White's bishop. Time to complete your development and get your king to safety.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Quick review before the new stuff.",
    },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    { type: 'instruction', fen: FEN.after_Nf3_back, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['e5', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_back,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nb4',
      prompt: 'Your move.',
      hint: 'Nb4.',
      correctFeedback: 'Nb4.',
      wrongFeedback: 'Nb4.',
    },

    // ── OPPONENT: 9.Be2 ──
    { type: 'instruction', fen: FEN.after_Be2, text: "White retreats the bishop to e2, away from your knight's attack.", autoAdvance: 800, highlightSquares: ['d3', 'e2'] },

    // ── PREDICT 1: O-O ──
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: "The bishop retreated. What's the most important thing to do now?",
      hint: 'Get your king to safety.',
      correctFeedback: "Castles. Your king is safe and your rook connects to the center.",
      wrongFeedback: 'Castle kingside — king safety is the priority.',
    },
    { type: 'instruction', fen: FEN.after_OO_b, text: "O-O tucks the king away safely and activates the rook. Solid development.", arrow: ['e8', 'g8'] },

    // ── OPPONENT: 10.Nc3 ──
    { type: 'instruction', fen: FEN.after_Nc3, text: "White develops the knight to c3, attacking your knight on e4.", autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // ── PREDICT 2: Bf5 ──
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bf5',
      prompt: "Your knight is under pressure. Develop your last minor piece first.",
      hint: 'Develop the light-squared bishop to an active diagonal.',
      correctFeedback: "Bf5 develops the bishop to a strong diagonal and frees the back rank.",
      wrongFeedback: 'Play Bf5 — develop the bishop before dealing with the knight.',
    },
    { type: 'instruction', fen: FEN.after_Bf5, text: "Bf5 is a key Petroff move. The bishop is active on the a2-g8 diagonal and controls important light squares.", arrow: ['c8', 'f5'] },

    // ── OPPONENT: 11.a3 ──
    { type: 'instruction', fen: FEN.after_a3, text: "White plays a3, kicking your knight on b4.", autoAdvance: 800, highlightSquares: ['a2', 'a3'] },

    // ── PREDICT 3: Nxc3 ──
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Nxc3',
      prompt: "Your knight on b4 is under attack. Find the best way to use it.",
      hint: 'The knight on e4 can capture on c3, damaging White\'s structure.',
      correctFeedback: "Nxc3 exchanges your centralized knight and damages White's pawn structure after bxc3.",
      wrongFeedback: 'Play Nxc3 — trade the knight and wreck White\'s pawns.',
    },
    { type: 'instruction', fen: FEN.after_Nxc3, text: "Nxc3 forces bxc3, giving White doubled pawns on the c-file. A typical Petroff trade that favors Black.", arrow: ['e4', 'c3'] },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nb4,
      text: "Show me you've got this.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['d3', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    { type: 'instruction', fen: FEN.after_a3, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Nxc3',
      prompt: 'Your move.',
      hint: 'Nxc3.',
      correctFeedback: 'Nxc3.',
      wrongFeedback: 'Nxc3.',
    },

    // ── OUTRO ──
    { type: 'instruction', fen: FEN.after_Nxc3, text: "O-O, Bf5, Nxc3 — you completed the Petroff setup. Solid position with a slight structural edge." },
  ],
}


// ═══════════════════════════════════════════════════════════
// pt-dev-d4: DEVIATION 3.d4 (3...Nxe4, 4...d5, 5...Nd7)
// ═══════════════════════════════════════════════════════════

const PT_DEV_D4: OpeningLesson = {
  id: 'pt-dev-d4',
  title: 'Dev 3.d4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Sometimes White plays 3.d4 instead of 3.Nxe5. The e4 pawn is left undefended — take advantage.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Prove you know these moves!",
    },

    // ── DEVIATION: 3.d4 ──
    { type: 'instruction', fen: FEN.dev_d4, text: "White plays 3.d4 instead of 3.Nxe5. The e4 pawn is hanging.", autoAdvance: 800, highlightSquares: ['d2', 'd4'] },

    // ── PREDICT 1: Nxe4 ──
    {
      type: 'play-move',
      fen: FEN.dev_d4,
      correctMove: 'Nxe4',
      prompt: "White left a pawn undefended. Grab it.",
      hint: 'The e4 pawn is free — take it with the knight.',
      correctFeedback: "Nxe4 wins a pawn. White pushed d4 but forgot about e4.",
      wrongFeedback: 'Capture the e4 pawn with your knight — it\'s free.',
    },
    { type: 'instruction', fen: FEN.dev_d4_Nxe4, text: "Nxe4 grabs the pawn. Your knight is strong in the center and you're up material.", arrow: ['f6', 'e4'] },

    // ── OPPONENT: 4.Bd3 ──
    { type: 'instruction', fen: FEN.dev_d4_Bd3, text: "White develops the bishop to d3, targeting your knight.", autoAdvance: 800, highlightSquares: ['f1', 'd3'] },

    // ── PREDICT 2: d5 ──
    {
      type: 'play-move',
      fen: FEN.dev_d4_Bd3,
      correctMove: 'd5',
      prompt: "White is eyeing your knight. Secure your position in the center.",
      hint: 'Push d5 to support the knight and claim the center.',
      correctFeedback: "d5 builds a strong center and supports the knight on e4.",
      wrongFeedback: 'Play d5 to secure the center and support your knight.',
    },
    { type: 'instruction', fen: FEN.dev_d4_d5, text: "d5 gives you a powerful pawn center. The knight on e4 is rock solid.", arrow: ['d7', 'd5'] },

    // ── OPPONENT: 5.Nxe5 ──
    { type: 'instruction', fen: FEN.dev_d4_Nxe5, text: "White takes your e5 pawn with the knight.", autoAdvance: 800, highlightSquares: ['f3', 'e5'] },

    // ── PREDICT 3: Nd7 ──
    {
      type: 'play-move',
      fen: FEN.dev_d4_Nxe5,
      correctMove: 'Nd7',
      prompt: "White's knight is on e5. How do you challenge it?",
      hint: 'Develop the queenside knight to attack e5.',
      correctFeedback: "Nd7 attacks the knight on e5 and develops a new piece.",
      wrongFeedback: 'Play Nd7 to develop and challenge the e5 knight.',
    },
    { type: 'instruction', fen: FEN.dev_d4_Nd7, text: "Nd7 forces White to deal with the e5 knight. After the exchange, you'll have a comfortable position with the extra central pawn.", arrow: ['b8', 'd7'] },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_d4,
      text: "White played d4. Handle the deviation.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.dev_d4_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    {
      type: 'play-move',
      fen: FEN.dev_d4_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.dev_d4_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev_d4_Nxe5,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },

    // ── OUTRO ──
    { type: 'instruction', fen: FEN.dev_d4_Nd7, text: "Nxe4, d5, Nd7 — you handled the 3.d4 deviation and came out with a strong center." },
  ],
}


// ═══════════════════════════════════════════════════════════
// pt-dev-nc3: DEVIATION 5.Nc3 (5...Nxc3, 6...Be7, 7...O-O)
// ═══════════════════════════════════════════════════════════

const PT_DEV_NC3: OpeningLesson = {
  id: 'pt-dev-nc3',
  title: 'Dev 5.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxe4,
      text: "Sometimes after 4...Nxe4, White plays 5.Nc3 instead of 5.d4. Here's how to respond.",
    },

    // ── RECAP to deviation point ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Show me you've got this.",
    },
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    { type: 'instruction', fen: FEN.after_Nf3_back, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['e5', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_back,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },

    // ── DEVIATION: 5.Nc3 ──
    { type: 'instruction', fen: FEN.dev_nc3, text: "White plays 5.Nc3 instead of 5.d4, attacking your knight on e4.", autoAdvance: 800, highlightSquares: ['b1', 'c3'] },

    // ── PREDICT 1: Nxc3 ──
    {
      type: 'play-move',
      fen: FEN.dev_nc3,
      correctMove: 'Nxc3',
      prompt: "White attacks your knight. What's the best exchange?",
      hint: 'Trade knights — capture on c3.',
      correctFeedback: "Nxc3 trades knights and damages White's pawn structure after dxc3.",
      wrongFeedback: 'Capture on c3 — trade the knights and wreck White\'s pawns.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_Nxc3, text: "Nxc3 forces dxc3, giving White doubled c-pawns. A classic Petroff exchange.", arrow: ['e4', 'c3'] },

    // ── OPPONENT: 6.dxc3 ──
    { type: 'instruction', fen: FEN.dev_nc3_dxc3, text: "White recaptures with the d-pawn. Notice the doubled c-pawns.", autoAdvance: 800, highlightSquares: ['d2', 'c3'] },

    // ── PREDICT 2: Be7 ──
    {
      type: 'play-move',
      fen: FEN.dev_nc3_dxc3,
      correctMove: 'Be7',
      prompt: "Now develop a piece and prepare to castle.",
      hint: 'Develop the bishop to clear the back rank.',
      correctFeedback: "Be7 develops the bishop and prepares kingside castling.",
      wrongFeedback: 'Play Be7 to develop and prepare castling.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_Be7, text: "Be7 is a natural developing move. You're one step from castling.", arrow: ['f8', 'e7'] },

    // ── OPPONENT: 7.Be3 ──
    { type: 'instruction', fen: FEN.dev_nc3_Be3, text: "White develops the bishop to e3.", autoAdvance: 800, highlightSquares: ['c1', 'e3'] },

    // ── PREDICT 3: O-O ──
    {
      type: 'play-move',
      fen: FEN.dev_nc3_Be3,
      correctMove: 'O-O',
      prompt: "Everything is set up. Finish your development.",
      hint: 'Castle to get your king safe.',
      correctFeedback: "Castles. Your king is safe and you have a solid position with the better pawn structure.",
      wrongFeedback: 'Castle kingside — complete your development.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_OO, text: "O-O completes your development. You have the better pawn structure thanks to White's doubled c-pawns.", arrow: ['e8', 'g8'] },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.dev_nc3,
      text: "White played Nc3. Handle the deviation.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.dev_nc3,
      correctMove: 'Nxc3',
      prompt: 'Your move.',
      hint: 'Nxc3.',
      correctFeedback: 'Nxc3.',
      wrongFeedback: 'Nxc3.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_dxc3, text: 'dxc3.', autoAdvance: 800, highlightSquares: ['d2', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_nc3_dxc3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_Be3, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_nc3_Be3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },

    // ── OUTRO ──
    { type: 'instruction', fen: FEN.dev_nc3_OO, text: "Nxc3, Be7, O-O — you handled the 5.Nc3 deviation with clean development and a structural edge." },
  ],
}


// ═══════════════════════════════════════════════════════════
// pt-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const PT_TEST_1: OpeningLesson = {
  id: 'pt-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Time to prove you know the Petroff. Play the full main line from memory.",
    },
    // Lesson 1: d6, Nxe4, d5
    { type: 'instruction', fen: FEN.after_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.after_Nxe5,
      correctMove: 'd6',
      prompt: 'Your move.',
      hint: 'd6.',
      correctFeedback: 'd6.',
      wrongFeedback: 'd6.',
    },
    { type: 'instruction', fen: FEN.after_Nf3_back, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['e5', 'f3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nf3_back,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4.', autoAdvance: 800, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.after_d4,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    // Lesson 2: Nc6, Be7, Nb4
    { type: 'instruction', fen: FEN.after_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    {
      type: 'play-move',
      fen: FEN.after_Bd3,
      correctMove: 'Nc6',
      prompt: 'Your move.',
      hint: 'Nc6.',
      correctFeedback: 'Nc6.',
      wrongFeedback: 'Nc6.',
    },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    {
      type: 'play-move',
      fen: FEN.after_OO_w,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    { type: 'instruction', fen: FEN.after_c4, text: 'c4.', autoAdvance: 800, highlightSquares: ['c2', 'c4'] },
    {
      type: 'play-move',
      fen: FEN.after_c4,
      correctMove: 'Nb4',
      prompt: 'Your move.',
      hint: 'Nb4.',
      correctFeedback: 'Nb4.',
      wrongFeedback: 'Nb4.',
    },
    // Lesson 3: O-O, Bf5, Nxc3
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2.', autoAdvance: 800, highlightSquares: ['d3', 'e2'] },
    {
      type: 'play-move',
      fen: FEN.after_Be2,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'Bf5',
      prompt: 'Your move.',
      hint: 'Bf5.',
      correctFeedback: 'Bf5.',
      wrongFeedback: 'Bf5.',
    },
    { type: 'instruction', fen: FEN.after_a3, text: 'a3.', autoAdvance: 800, highlightSquares: ['a2', 'a3'] },
    {
      type: 'play-move',
      fen: FEN.after_a3,
      correctMove: 'Nxc3',
      prompt: 'Your move.',
      hint: 'Nxc3.',
      correctFeedback: 'Nxc3.',
      wrongFeedback: 'Nxc3.',
    },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Main line done. Now handle the deviations.",
    },

    // Deviation 1: 3.d4
    { type: 'instruction', fen: FEN.dev_d4, text: "White plays 3.d4 instead of Nxe5.", autoAdvance: 1200, highlightSquares: ['d2', 'd4'] },
    {
      type: 'play-move',
      fen: FEN.dev_d4,
      correctMove: 'Nxe4',
      prompt: 'Your move.',
      hint: 'Nxe4.',
      correctFeedback: 'Nxe4.',
      wrongFeedback: 'Nxe4.',
    },
    { type: 'instruction', fen: FEN.dev_d4_Bd3, text: 'Bd3.', autoAdvance: 800, highlightSquares: ['f1', 'd3'] },
    {
      type: 'play-move',
      fen: FEN.dev_d4_Bd3,
      correctMove: 'd5',
      prompt: 'Your move.',
      hint: 'd5.',
      correctFeedback: 'd5.',
      wrongFeedback: 'd5.',
    },
    { type: 'instruction', fen: FEN.dev_d4_Nxe5, text: 'Nxe5.', autoAdvance: 800, highlightSquares: ['f3', 'e5'] },
    {
      type: 'play-move',
      fen: FEN.dev_d4_Nxe5,
      correctMove: 'Nd7',
      prompt: 'Your move.',
      hint: 'Nd7.',
      correctFeedback: 'Nd7.',
      wrongFeedback: 'Nd7.',
    },

    // Deviation 2: 5.Nc3
    { type: 'instruction', fen: FEN.dev_nc3, text: "White plays 5.Nc3 instead of d4.", autoAdvance: 1200, highlightSquares: ['b1', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_nc3,
      correctMove: 'Nxc3',
      prompt: 'Your move.',
      hint: 'Nxc3.',
      correctFeedback: 'Nxc3.',
      wrongFeedback: 'Nxc3.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_dxc3, text: 'dxc3.', autoAdvance: 800, highlightSquares: ['d2', 'c3'] },
    {
      type: 'play-move',
      fen: FEN.dev_nc3_dxc3,
      correctMove: 'Be7',
      prompt: 'Your move.',
      hint: 'Be7.',
      correctFeedback: 'Be7.',
      wrongFeedback: 'Be7.',
    },
    { type: 'instruction', fen: FEN.dev_nc3_Be3, text: 'Be3.', autoAdvance: 800, highlightSquares: ['c1', 'e3'] },
    {
      type: 'play-move',
      fen: FEN.dev_nc3_Be3,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const PETROFF_LESSONS: Record<string, OpeningLesson> = {
  'pt-1': PT_1,
  'pt-2': PT_2,
  'pt-3': PT_3,
  'pt-dev-d4': PT_DEV_D4,
  'pt-dev-nc3': PT_DEV_NC3,
  'pt-test-1': PT_TEST_1,
}

export function getPetroffLesson(id: string): OpeningLesson | undefined {
  return PETROFF_LESSONS[id]
}
