import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// WITTY ALIEN — SCANDINAVIAN GAMBIT LESSONS (was-1 through was-test-1)
//
// ⚠️  RULES EXCEPTION: This is a trick weapon, NOT master theory.
// Built from Witty_Alien's real chess.com games (2026, 60 Scandinavian Gambit
// games, 75% win rate — small sample, honest about it in the lessons).
// Voice leans INTO the meme — pawn-down gambit, speed and initiative.
//
// BLACK OPENING: User plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// CHUNKING RULE: Every main lesson teaches EXACTLY 3 of Black's moves.
//
// Main line: 1.e4 d5 2.exd5 c6! 3.dxc6 Nxc6 4.Nf3 e5 5.Bc4 Bc5
//            6.O-O Qb6 7.Bb3 Nf6 8.d3 Bg4 9.Nc3 O-O-O
//
// FENs computed with chess.js (verified via scripts/_gen-scandi-fens.mjs).
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:             'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:          'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_d5:          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_exd5:        'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2',
  after_c6:          'rnbqkbnr/pp2pppp/2p5/3P4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3',
  after_dxc6:        'rnbqkbnr/pp2pppp/2P5/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3',
  after_Nxc6:        'r1bqkbnr/pp2pppp/2n5/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 4',
  after_Nf3:         'r1bqkbnr/pp2pppp/2n5/8/8/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 4',
  after_e5:          'r1bqkbnr/pp3ppp/2n5/4p3/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 5',
  after_Bc4:         'r1bqkbnr/pp3ppp/2n5/4p3/2B5/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 5',
  after_Bc5:         'r1bqk1nr/pp3ppp/2n5/2b1p3/2B5/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 6',
  after_OO:          'r1bqk1nr/pp3ppp/2n5/2b1p3/2B5/5N2/PPPP1PPP/RNBQ1RK1 b kq - 3 6',
  after_Qb6:         'r1b1k1nr/pp3ppp/1qn5/2b1p3/2B5/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 7',
  after_Bb3:         'r1b1k1nr/pp3ppp/1qn5/2b1p3/8/1B3N2/PPPP1PPP/RNBQ1RK1 b kq - 5 7',
  after_Nf6:         'r1b1k2r/pp3ppp/1qn2n2/2b1p3/8/1B3N2/PPPP1PPP/RNBQ1RK1 w kq - 6 8',
  after_d3:          'r1b1k2r/pp3ppp/1qn2n2/2b1p3/8/1B1P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 8',
  after_Bg4:         'r3k2r/pp3ppp/1qn2n2/2b1p3/6b1/1B1P1N2/PPP2PPP/RNBQ1RK1 w kq - 1 9',
  after_Nc3:         'r3k2r/pp3ppp/1qn2n2/2b1p3/6b1/1BNP1N2/PPP2PPP/R1BQ1RK1 b kq - 2 9',
  after_OOO:         '2kr3r/pp3ppp/1qn2n2/2b1p3/6b1/1BNP1N2/PPP2PPP/R1BQ1RK1 w - - 3 10',
  after_Be3:         '2kr3r/pp3ppp/1qn2n2/2b1p3/6b1/1BNPBN2/PPP2PPP/R2Q1RK1 b - - 4 10',

  // === DEVIATION: 3.d4 cxd5 ===
  dev_d4_after_d4:   'rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  dev_d4_after_cxd5: 'rnbqkbnr/pp2pppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4',
  dev_d4_after_Nf3:  'rnbqkbnr/pp2pppp/8/3p4/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4',
  dev_d4_after_Nc6:  'r1bqkbnr/pp2pppp/2n5/3p4/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 2 5',

  // === DEVIATION: 2.Nc3 d4! 3.Nce2 e5 ===
  dev_Nc3_after_Nc3: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2',
  dev_Nc3_after_d4:  'rnbqkbnr/ppp1pppp/8/8/3pP3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3',
  dev_Nc3_after_Nce2:'rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPPNPPP/R1BQKBNR b KQkq - 1 3',
  dev_Nc3_after_e5:  'rnbqkbnr/ppp2ppp/8/4p3/3pP3/8/PPPPNPPP/R1BQKBNR w KQkq - 0 4',
}


// ═══════════════════════════════════════════════════════════
// was-1: THE PAWN OFFER (1.e4 d5 2.exd5 c6! 3.dxc6 Nxc6)
// First lesson — no recap.
// Black's 3 moves: d5, c6!, Nxc6
// ═══════════════════════════════════════════════════════════

const WAS_1: OpeningLesson = {
  id: 'was-1',
  title: 'The Pawn Offer',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Scandinavian Gambit — Witty_Alien's trick weapon as Black. He played it 60 times in 2026 and won 75% of them. Small sample, so take the number with a grain of salt. But the idea works.",
    },
    {
      type: 'instruction',
      fen: FEN.start,
      text: "The deal: you sacrifice the c6 pawn. You get a development lead, open b- and d-files, and an active position. You are genuinely a pawn down. The bet is speed.",
    },

    // ── WHITE e4 ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "White opens with e4.",
      autoAdvance: 800,
      highlightSquares: ['e2', 'e4'],
    },

    // ── BLACK MOVE 1: d5 ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Your first move: challenge the center immediately.",
      highlightSquares: ['d7', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e4,
      correctMove: 'd5',
      prompt: "Hit the center right away.",
      hint: 'Push the d-pawn two squares.',
      correctFeedback: "d5! Challenge the center. White almost always takes — 2.exd5.",
      wrongFeedback: 'Play d5 — attack the e4 pawn straight away.',
    },

    // ── WHITE exd5 ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "exd5. White takes. They have a passed d5 pawn. Now the gambit offer.",
      autoAdvance: 800,
      highlightSquares: ['e4', 'd5'],
    },

    // ── BLACK MOVE 2: c6! ──
    {
      type: 'instruction',
      fen: FEN.after_exd5,
      text: "The signature move: c6. Not the standard 2...Qxd5 recapture. You're offering to let White take a SECOND pawn.",
      highlightSquares: ['c7', 'c6', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_exd5,
      correctMove: 'c6',
      prompt: "The gambit offer. Push c6.",
      hint: 'c6 — attack the d5 pawn and offer another pawn.',
      correctFeedback: "c6! White can take a free pawn on c6. Most do — the trap is set.",
      wrongFeedback: 'Play c6 — attack d5 and set the gambit offer.',
      postMoveArrow: ['c6', 'd5'],
    },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "White accepts — dxc6. They grabbed two pawns. You're a pawn down. Now the knight recaptures and development begins.",
    },

    // ── WHITE dxc6 ──
    {
      type: 'instruction',
      fen: FEN.after_dxc6,
      text: "dxc6. White took the free pawn. Now your knight recaptures — and you're already ahead in development.",
      autoAdvance: 800,
      highlightSquares: ['d5', 'c6'],
    },

    // ── BLACK MOVE 3: Nxc6 ──
    {
      type: 'play-move',
      fen: FEN.after_dxc6,
      correctMove: 'Nxc6',
      prompt: "Recapture with the knight.",
      hint: 'Knight from b8 takes c6.',
      correctFeedback: "Nxc6! Knight developed, c-file open, d-file open. White has two extra pawns and zero piece activity. You have one pawn less and a big development lead.",
      wrongFeedback: 'Play Nxc6 — develop and recapture at the same time.',
      postMoveArrow: ['c6', 'd4'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Nxc6,
      text: "Position after 3...Nxc6: Black is a pawn down, but the b-file and d-file are wide open for the rooks and queen. Next lesson: rapid development.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Run the gambit offer from move one.",
      buttonText: "LET'S GO",
    },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_dxc6, text: 'dxc6.', autoAdvance: 800, highlightSquares: ['d5', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc6,
      text: "d5, c6!, Nxc6. Pawn offered, pawn taken, knight developed. Next: flood the board with pieces.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// was-2: RAPID DEVELOPMENT (4.Nf3 e5, 5.Bc4 Bc5, 6.O-O Qb6)
// Black's 3 moves: e5, Bc5, Qb6
// ═══════════════════════════════════════════════════════════

const WAS_2: OpeningLesson = {
  id: 'was-2',
  title: 'Rapid Development',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc6,
      text: "You're a pawn down. The compensation is speed. In the next three moves you're going to stake the center, aim a bishop at f2, and threaten the White bishop — all while White is still setting up.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Quick replay to the gambit.",
    },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_dxc6, text: 'dxc6.', autoAdvance: 800, highlightSquares: ['d5', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },

    // ── WHITE Nf3 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "White plays Nf3 — developing and guarding d4.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },

    // ── BLACK MOVE 1: e5 ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "You need center pawns AND active pieces. Start with a pawn in the center.",
      highlightSquares: ['e7', 'e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf3,
      correctMove: 'e5',
      prompt: "Stake the center. Push e5.",
      hint: 'e5 — grab the center and open the bishop.',
      correctFeedback: "e5! Big center pawn, opens the diagonal for the dark-square bishop. White responds Bc4 — aiming at f7.",
      wrongFeedback: 'Play e5 — grab the center.',
      postMoveArrow: ['e5', 'd4'],
    },

    // ── WHITE Bc4 ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Bc4 — White aims the bishop at f7. You know what's better than defending f7? Aiming your bishop right back.",
      autoAdvance: 800,
      highlightSquares: ['f1', 'c4'],
    },

    // ── BLACK MOVE 2: Bc5 ──
    {
      type: 'instruction',
      fen: FEN.after_Bc4,
      text: "Your bishop goes to c5 — eyes f2, mirrors White's threat, and you're fully developed on the kingside.",
      highlightSquares: ['f8', 'c5', 'f2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bc4,
      correctMove: 'Bc5',
      prompt: "Mirror the threat. Aim your bishop at f2.",
      hint: 'Bishop from f8 to c5.',
      correctFeedback: "Bc5! Bishop vs bishop, both aiming at the enemy f-pawn. Classic gambit energy.",
      wrongFeedback: 'Play Bc5 — aim at f2.',
      postMoveArrow: ['c5', 'f2'],
    },

    // ── WHITE O-O ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "White castles — king tucked away, Bc4 protected by the rook on f1.",
      autoAdvance: 800,
      highlightSquares: ['e1', 'g1'],
    },

    // ── BLACK MOVE 3: Qb6 ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "The queen comes out with tempo — Qb6 hits both the b2 pawn and the Bc4. White has to react.",
      highlightSquares: ['d8', 'b6', 'c4', 'b2'],
    },
    {
      type: 'play-move',
      fen: FEN.after_OO,
      correctMove: 'Qb6',
      prompt: "Queen out with threats. Where?",
      hint: 'Queen to b6 — attacks the Bc4 AND the b2 pawn.',
      correctFeedback: "Qb6! Two threats at once. White usually retreats Bb3 to defend both. Your queen is active and threatening.",
      wrongFeedback: 'Play Qb6 — hit the bishop and b2 at once.',
      postMoveArrow: ['b6', 'b2'],
    },
    {
      type: 'instruction',
      fen: FEN.after_Qb6,
      text: "Qb6: three pieces developed, center pawn on e5, queen active, pawn on b2 under threat. White has to deal with this. Next lesson: complete development and castle queenside.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc6,
      text: "From move 4 — run the development.",
    },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qb6,
      text: "e5, Bc5, Qb6. Three moves, three threats. Pawn down, but you've made White react to you. Next: pin the knight and castle long.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// was-3: CASTLE LONG (7.Bb3 Nf6, 8.d3 Bg4, 9.Nc3 O-O-O)
// Black's 3 moves: Nf6, Bg4, O-O-O
// ═══════════════════════════════════════════════════════════

const WAS_3: OpeningLesson = {
  id: 'was-3',
  title: 'Castle Long',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_Qb6,
      text: "White retreated the bishop to b3 to defend b2. Good — you've forced a concession. Now: develop the last minor piece, pin White's knight, and castle queenside. Rook on d8, queen on b6, fully set for the attack.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Quick replay to the position.",
    },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_dxc6, text: 'dxc6.', autoAdvance: 800, highlightSquares: ['d5', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },

    // ── WHITE Bb3 ──
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "Bb3. White retreats the bishop to save it. Now your last undeveloped minor piece needs a job.",
      autoAdvance: 800,
      highlightSquares: ['c4', 'b3'],
    },

    // ── BLACK MOVE 1: Nf6 ──
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "Develop the last knight — it goes to f6, joining the attack on White's position.",
      highlightSquares: ['g8', 'f6'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Bb3,
      correctMove: 'Nf6',
      prompt: "Develop the last knight.",
      hint: 'Knight from g8 to f6.',
      correctFeedback: "Nf6! All four minor pieces are out. White plays d3 to shore up the center.",
      wrongFeedback: 'Play Nf6 — get the last knight out.',
      postMoveArrow: ['f6', 'd5'],
    },

    // ── WHITE d3 ──
    {
      type: 'instruction',
      fen: FEN.after_d3,
      text: "d3. White solidifies the center. Your next move: pin the Nf3 with the bishop.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd3'],
    },

    // ── BLACK MOVE 2: Bg4 ──
    {
      type: 'instruction',
      fen: FEN.after_d3,
      text: "Bg4 pins the Nf3 against White's queen. White can't easily push e4 or organize — and you can castle queenside now that the c8 bishop has moved.",
      highlightSquares: ['c8', 'g4', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.after_d3,
      correctMove: 'Bg4',
      prompt: "Pin the Nf3.",
      hint: 'Bishop from c8 to g4 — pins the knight against the queen.',
      correctFeedback: "Bg4! The Nf3 is pinned — it can't move without exposing the queen. White develops Nc3, then you castle queenside.",
      wrongFeedback: 'Play Bg4 — pin the knight against the queen.',
      postMoveArrow: ['g4', 'd1'],
    },

    // ── WHITE Nc3 ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Nc3. White develops and tries to untangle. Your king needs a safe home — and the queenside is perfect.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },

    // ── BLACK MOVE 3: O-O-O ──
    {
      type: 'instruction',
      fen: FEN.after_Nc3,
      text: "Castle queenside — rook lands on d8, queen and rooks coordinate across the open files. Your whole army is active.",
      highlightSquares: ['e8', 'c8', 'd8'],
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc3,
      correctMove: 'O-O-O',
      prompt: "Castle queenside.",
      hint: 'Castle queenside — king to c8, rook to d8.',
      correctFeedback: "O-O-O! King safe, rook on d8. Your queen on b6 and rook on d8 own the open files. White needs to watch out for ...d5 ideas and kingside breaks.",
      wrongFeedback: 'Castle queenside: O-O-O.',
      postMoveArrow: ['d8', 'd3'],
    },
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "Fully developed, castled queenside, Bg4 pinning the knight. You are a pawn down. But Witty wins 75% of these in 2026 (small sample). The activity is real.",
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Bb3,
      text: "From Bb3 — Nf6, Bg4, O-O-O.",
    },
    { type: 'play-move', fen: FEN.after_Bb3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'd3.', autoAdvance: 800, highlightSquares: ['d2', 'd3'] },
    { type: 'play-move', fen: FEN.after_d3, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'O-O-O', prompt: 'Your move.', hint: 'O-O-O.', correctFeedback: 'O-O-O.', wrongFeedback: 'O-O-O.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "Nf6, Bg4, O-O-O. The Scandinavian Gambit is set up. Pawn down, fully developed, queen and rook on open files. From here it's your game.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// was-dev-d4: IF WHITE PLAYS 3.d4 (declines the gambit)
// White keeps the pawn: 1.e4 d5 2.exd5 c6 3.d4 cxd5
// Black recaptures — pawn back, equal game.
// ═══════════════════════════════════════════════════════════

const WAS_DEV_D4: OpeningLesson = {
  id: 'was-dev-d4',
  title: 'If 3.d4',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Sometimes White doesn't take on c6. Instead of dxc6, they play 3.d4 — holding the d5 pawn and trying to keep the extra pawn. Fine. You just take it back.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Quick replay to the gambit offer.",
    },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },

    // ── WHITE d4 (the decline) ──
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_d4,
      text: "3.d4 — White declines. They're holding the pawn on d5. No gambit needed: just take it.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },

    // ── BLACK cxd5 ──
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_d4,
      text: "cxd5 — recapture the pawn. Now you're equal, with a healthy pawn structure and easy development ahead.",
      highlightSquares: ['c6', 'd5'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_d4_after_d4,
      correctMove: 'cxd5',
      prompt: "Take the pawn back.",
      hint: 'c6 pawn takes d5.',
      correctFeedback: "cxd5! Pawn back, equal position. No tricks needed — White declined the gambit, so you just play a solid Scandinavian structure.",
      wrongFeedback: 'Play cxd5 — take the pawn back.',
    },
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_cxd5,
      text: "After cxd5, White typically plays Nf3 and you respond Nc6. Comfortable, equal game. No pawn sacrifice needed.",
    },

    // ── WHITE Nf3 / BLACK Nc6 (showing the natural follow-up) ──
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_Nf3,
      text: "White develops Nf3. Now bring your knight out.",
      autoAdvance: 800,
      highlightSquares: ['g1', 'f3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_d4_after_Nf3,
      correctMove: 'Nc6',
      prompt: "Develop your knight.",
      hint: 'Knight from b8 to c6.',
      correctFeedback: "Nc6! Good, solid development. From here it's a normal Scandinavian — comfortable and equal. Witty's tricks are off the menu, but you're not worse.",
      wrongFeedback: 'Play Nc6 — develop naturally.',
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_Nc6,
      text: "If White declines with 3.d4: cxd5, then normal development. No gambit, no drama — just a solid, equal position. Move on.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// was-dev-Nc3: IF WHITE PLAYS 2.Nc3 (skips exd5 entirely)
// 1.e4 d5 2.Nc3 d4! 3.Nce2 e5 — Black grabs space with the d-pawn.
// ═══════════════════════════════════════════════════════════

const WAS_DEV_NC3: OpeningLesson = {
  id: 'was-dev-Nc3',
  title: 'If 2.Nc3',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Sometimes White ignores the d5 pawn and plays 2.Nc3. They're trying to avoid the gambit and defend e4 with a knight. Your response: kick the knight and grab the center.",
    },

    // ── RECAP ──
    {
      type: 'instruction',
      fen: FEN.after_e4,
      text: "Quick replay to move one.",
    },
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },

    // ── WHITE Nc3 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "2.Nc3 — White defends e4 with the knight instead of taking. They're sidestepping the gambit. Push the d-pawn one more square.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },

    // ── BLACK d4! ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "d4! Kick the knight. The pawn advances to d4, pushing the Nc3 out of position. White has to retreat.",
      highlightSquares: ['d5', 'd4', 'c3'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nc3,
      correctMove: 'd4',
      prompt: "Push the pawn and kick the knight.",
      hint: 'd5 to d4 — attack the Nc3.',
      correctFeedback: "d4! The knight on c3 is attacked and has to move. Black gains a big space advantage in the center.",
      wrongFeedback: 'Play d4 — advance and kick the Nc3.',
      postMoveArrow: ['d4', 'c3'],
    },

    // ── WHITE Nce2 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nce2,
      text: "Nce2 — the knight retreats to e2, blocking White's own f1 bishop. White is passive already.",
      autoAdvance: 800,
      highlightSquares: ['c3', 'e2'],
    },

    // ── BLACK e5 ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nce2,
      text: "Grab MORE center. e5 gives you two connected center pawns on d4 and e5 — a commanding space advantage.",
      highlightSquares: ['e7', 'e5', 'd4'],
    },
    {
      type: 'play-move',
      fen: FEN.dev_Nc3_after_Nce2,
      correctMove: 'e5',
      prompt: "Claim more center space.",
      hint: 'e7 to e5 — a big center.',
      correctFeedback: "e5! Two pawns on d4 and e5 — Black has a massive center. Witty plays this in 16 of his real games and wins 62%. From here develop naturally: Nf6, Bc5, O-O.",
      wrongFeedback: 'Play e5 — grab the center.',
      postMoveArrow: ['d4', 'e5'],
    },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_e5,
      text: "If 2.Nc3: d4!, then e5. Black gets a powerful center. White's knight is stuck on e2, blocking the f1 bishop. Develop Nf6, Bc5, and enjoy the position.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// was-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const WAS_TEST_1: OpeningLesson = {
  id: 'was-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'black',
  steps: [
    // ── INTRO ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Full test — main line and both deviations. White will try every response. Show the Scandinavian Gambit from memory.",
      buttonText: "START TEST",
    },

    // ── MAIN LINE: full run ──
    { type: 'play-move', fen: FEN.after_e4, correctMove: 'd5', prompt: 'Your move.', hint: 'd5.', correctFeedback: 'd5.', wrongFeedback: 'd5.' },
    { type: 'instruction', fen: FEN.after_exd5, text: 'exd5.', autoAdvance: 800, highlightSquares: ['e4', 'd5'] },
    { type: 'play-move', fen: FEN.after_exd5, correctMove: 'c6', prompt: 'Your move.', hint: 'c6.', correctFeedback: 'c6.', wrongFeedback: 'c6.' },
    { type: 'instruction', fen: FEN.after_dxc6, text: 'dxc6.', autoAdvance: 800, highlightSquares: ['d5', 'c6'] },
    { type: 'play-move', fen: FEN.after_dxc6, correctMove: 'Nxc6', prompt: 'Your move.', hint: 'Nxc6.', correctFeedback: 'Nxc6.', wrongFeedback: 'Nxc6.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3.', autoAdvance: 800, highlightSquares: ['g1', 'f3'] },
    { type: 'play-move', fen: FEN.after_Nf3, correctMove: 'e5', prompt: 'Your move.', hint: 'e5.', correctFeedback: 'e5.', wrongFeedback: 'e5.' },
    { type: 'instruction', fen: FEN.after_Bc4, text: 'Bc4.', autoAdvance: 800, highlightSquares: ['f1', 'c4'] },
    { type: 'play-move', fen: FEN.after_Bc4, correctMove: 'Bc5', prompt: 'Your move.', hint: 'Bc5.', correctFeedback: 'Bc5.', wrongFeedback: 'Bc5.' },
    { type: 'instruction', fen: FEN.after_OO, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e1', 'g1'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Qb6', prompt: 'Your move.', hint: 'Qb6.', correctFeedback: 'Qb6.', wrongFeedback: 'Qb6.' },
    { type: 'instruction', fen: FEN.after_Bb3, text: 'Bb3.', autoAdvance: 800, highlightSquares: ['c4', 'b3'] },
    { type: 'play-move', fen: FEN.after_Bb3, correctMove: 'Nf6', prompt: 'Your move.', hint: 'Nf6.', correctFeedback: 'Nf6.', wrongFeedback: 'Nf6.' },
    { type: 'instruction', fen: FEN.after_d3, text: 'd3.', autoAdvance: 800, highlightSquares: ['d2', 'd3'] },
    { type: 'play-move', fen: FEN.after_d3, correctMove: 'Bg4', prompt: 'Your move.', hint: 'Bg4.', correctFeedback: 'Bg4.', wrongFeedback: 'Bg4.' },
    { type: 'instruction', fen: FEN.after_Nc3, text: 'Nc3.', autoAdvance: 800, highlightSquares: ['b1', 'c3'] },
    { type: 'play-move', fen: FEN.after_Nc3, correctMove: 'O-O-O', prompt: 'Your move.', hint: 'O-O-O.', correctFeedback: 'O-O-O.', wrongFeedback: 'O-O-O.' },
    {
      type: 'instruction',
      fen: FEN.after_OOO,
      text: "Main line complete. Now: what if White plays 3.d4 instead of 3.dxc6?",
      buttonText: "NEXT",
    },

    // ── DEVIATION: 3.d4 cxd5 ──
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "From this position: White plays 3.d4. What's your response?",
    },
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_d4,
      text: "d4 — White holds the pawn. Your move.",
      autoAdvance: 800,
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'play-move', fen: FEN.dev_d4_after_d4, correctMove: 'cxd5', prompt: 'Your move.', hint: 'cxd5.', correctFeedback: 'cxd5 — pawn back, equal position.', wrongFeedback: 'cxd5 — recapture.' },
    {
      type: 'instruction',
      fen: FEN.dev_d4_after_cxd5,
      text: "cxd5. No gambit needed — just a solid, equal Scandinavian. Now: what if White plays 2.Nc3 instead of 2.exd5?",
      buttonText: "LAST ONE",
    },

    // ── DEVIATION: 2.Nc3 d4! Nce2 e5 ──
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "From move one: White skips 2.exd5 and plays 2.Nc3. What's your counter?",
    },
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_Nc3,
      text: "Nc3 — White defends e4. Your move.",
      autoAdvance: 800,
      highlightSquares: ['b1', 'c3'],
    },
    { type: 'play-move', fen: FEN.dev_Nc3_after_Nc3, correctMove: 'd4', prompt: 'Your move.', hint: 'd4 — kick the knight.', correctFeedback: 'd4! Kick the knight.', wrongFeedback: 'd4 — push and kick.' },
    { type: 'instruction', fen: FEN.dev_Nc3_after_Nce2, text: 'Nce2 — knight retreats.', autoAdvance: 800, highlightSquares: ['c3', 'e2'] },
    { type: 'play-move', fen: FEN.dev_Nc3_after_Nce2, correctMove: 'e5', prompt: 'Your move.', hint: 'e5 — grab the center.', correctFeedback: 'e5! Big center, passive White knight. Done.', wrongFeedback: 'e5 — claim the center.' },

    // ── OUTRO ──
    {
      type: 'instruction',
      fen: FEN.dev_Nc3_after_e5,
      text: "Scandinavian Gambit complete. Main line: d5, c6!, Nxc6, e5, Bc5, Qb6, Nf6, Bg4, O-O-O. If White declines: cxd5. If 2.Nc3: d4!, e5. Witty approved.",
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const LESSONS: Record<string, OpeningLesson> = {
  'was-1':        WAS_1,
  'was-2':        WAS_2,
  'was-3':        WAS_3,
  'was-dev-d4':   WAS_DEV_D4,
  'was-dev-Nc3':  WAS_DEV_NC3,
  'was-test-1':   WAS_TEST_1,
}

export function getWittyAlienScandiLesson(id: string): OpeningLesson | undefined {
  return LESSONS[id]
}
