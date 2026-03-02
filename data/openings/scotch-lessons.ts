import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// SCOTCH GAME LESSONS (sc-1 through sc-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// FENs pre-computed and validated with chess.js.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Bb4 6.Nxc6 bxc6
//            7.Bd3 d5 8.exd5 cxd5 9.O-O O-O 10.Bg5 c6 11.Qf3
// ═══════════════════════════════════════════════════════════

const FEN = {
  // Main line positions
  start:            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:         'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:         'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:        'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:        'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_d4:         'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3',
  after_exd4:       'r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  after_Nxd4:       'r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  after_Nf6:        'r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  after_Nc3:        'r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
  after_Bb4:        'r1bqk2r/pppp1ppp/2n2n2/8/1b1NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 3 6',
  after_Nxc6:       'r1bqk2r/pppp1ppp/2N2n2/8/1b2P3/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 6',
  after_bxc6:       'r1bqk2r/p1pp1ppp/2p2n2/8/1b2P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 7',
  after_Bd3:        'r1bqk2r/p1pp1ppp/2p2n2/8/1b2P3/2NB4/PPP2PPP/R1BQK2R b KQkq - 1 7',
  after_d5:         'r1bqk2r/p1p2ppp/2p2n2/3p4/1b2P3/2NB4/PPP2PPP/R1BQK2R w KQkq - 0 8',
  after_exd5:       'r1bqk2r/p1p2ppp/2p2n2/3P4/1b6/2NB4/PPP2PPP/R1BQK2R b KQkq - 0 8',
  after_cxd5:       'r1bqk2r/p1p2ppp/5n2/3p4/1b6/2NB4/PPP2PPP/R1BQK2R w KQkq - 0 9',
  after_OO:         'r1bqk2r/p1p2ppp/5n2/3p4/1b6/2NB4/PPP2PPP/R1BQ1RK1 b kq - 1 9',
  after_OO_b:       'r1bq1rk1/p1p2ppp/5n2/3p4/1b6/2NB4/PPP2PPP/R1BQ1RK1 w - - 2 10',
  after_Bg5:        'r1bq1rk1/p1p2ppp/5n2/3p2B1/1b6/2NB4/PPP2PPP/R2Q1RK1 b - - 3 10',
  after_c6:         'r1bq1rk1/p4ppp/2p2n2/3p2B1/1b6/2NB4/PPP2PPP/R2Q1RK1 w - - 0 11',
  after_Qf3:        'r1bq1rk1/p4ppp/2p2n2/3p2B1/1b6/2NB1Q2/PPP2PPP/R4RK1 b - - 1 11',

  // Punish: 3...d5? (premature counter-gambit)
  punish_after_d5:    'r1bqkbnr/ppp2ppp/2n5/3pp3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
  punish_after_exd5:  'r1bqkbnr/ppp2ppp/2n5/3Pp3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 4',
  punish_after_Qxd5:  'r1b1kbnr/ppp2ppp/2n5/3qp3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5',
  punish_after_Nc3:   'r1b1kbnr/ppp2ppp/2n5/3qp3/3P4/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 1 5',

  // Punish: 4...Bc5? (slow bishop move)
  punish_after_Bc5:   'r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  punish_after_Be3:   'r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R b KQkq - 2 5',

  // Branch: Schmidt Variation (4...d5)
  schmidt_after_d5:   'r1bqkbnr/ppp2ppp/2n5/3p4/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5',
  schmidt_after_exd5: 'r1bqkbnr/ppp2ppp/2n5/3P4/3N4/8/PPP2PPP/RNBQKB1R b KQkq - 0 5',
  schmidt_after_Qxd5: 'r1b1kbnr/ppp2ppp/2n5/3q4/3N4/8/PPP2PPP/RNBQKB1R w KQkq - 0 6',
  schmidt_after_Nb5:  'r1b1kbnr/ppp2ppp/2n5/1N1q4/8/8/PPP2PPP/RNBQKB1R b KQkq - 1 6',

  // Branch: Steinitz Variation (4...Qh4)
  steinitz_after_Qh4: 'r1b1kbnr/pppp1ppp/2n5/8/3NP2q/8/PPP2PPP/RNBQKB1R w KQkq - 1 5',
  steinitz_after_Nc3: 'r1b1kbnr/pppp1ppp/2n5/8/3NP2q/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5',
}


// ═══════════════════════════════════════════════════════════
// sc-1: THE SCOTCH STRIKE (1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4)
// First lesson — no recap. Teach + Punish + Recall.
// ═══════════════════════════════════════════════════════════

const SC_1: OpeningLesson = {
  id: 'sc-1',
  title: 'The Scotch Strike',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 2: TEACH ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Welcome to the Scotch Game — you're going to blow the center wide open on move 3.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start with the king pawn.',
      hint: 'e2 to e4.',
      correctFeedback: "e4! Control the center and open lines for your pieces.",
      wrongFeedback: 'Push the king pawn two squares.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5 — Black mirrors your move.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Develop the knight toward the center.',
      hint: "Nf3 — attack e5 and develop.",
      correctFeedback: "Nf3! The knight attacks e5 and prepares the Scotch's signature move.",
      wrongFeedback: "Bring the knight to f3 — it develops and attacks e5.",
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 — Black defends e5.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_Nc6,
      text: "Now the key move. Instead of Bc4 or Bb5, you strike the center immediately with d4. This is what makes the Scotch special.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'd4',
      prompt: 'Open the center right now.',
      hint: "d4 — challenge e5 immediately.",
      correctFeedback: "d4! The Scotch Game. You open the center before Black can settle in.",
      wrongFeedback: "Play d4 — open the center immediately.",
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4 — Black captures.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'Nxd4',
      prompt: 'Recapture with the knight.',
      hint: "Nxd4 — centralize the knight.",
      correctFeedback: "Nxd4! Your knight is powerfully placed in the center, attacking c6 and controlling key squares.",
      wrongFeedback: "Take back with the knight — Nxd4.",
      highlightSquares: ['f3', 'd4'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Sometimes Black tries to counter in the center with 3...d5 instead of taking on d4. It looks active, but it backfires.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_d5,
      text: "3...d5? Black opens the center too — but the queen will be exposed.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_d5,
      correctMove: 'exd5',
      prompt: 'Take the pawn — the queen must recapture.',
      hint: "exd5 — win a pawn and force Black's queen out.",
      correctFeedback: "exd5! Black must recapture with the queen, and you'll develop with tempo hitting it.",
      wrongFeedback: "Capture on d5 — Black's queen has to come out early.",
      highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.punish_after_Qxd5, text: 'Qxd5 — the queen is in the center, exposed.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_Qxd5,
      correctMove: 'Nc3',
      prompt: 'Develop with tempo — attack the queen!',
      hint: "Nc3 — develop and force the queen to move again.",
      correctFeedback: "Nc3! You develop a piece AND attack the queen. Black is already on the back foot.",
      wrongFeedback: "Play Nc3 — gain time by attacking the queen.",
      highlightSquares: ['b1', 'c3'],
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
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'Nxd4',
      prompt: 'Your move.',
      hint: 'Nxd4.',
      correctFeedback: 'Nxd4.',
      wrongFeedback: 'Nxd4.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-2: FOUR KNIGHTS (4...Nf6 5.Nc3 Bb4 6.Nxc6)
// ═══════════════════════════════════════════════════════════

const SC_2: OpeningLesson = {
  id: 'sc-2',
  title: 'Four Knights',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 1: RECAP ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start the Scotch.',
      hint: 'e4.',
      correctFeedback: 'e4!',
      wrongFeedback: 'e4.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Develop.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Nf3.',
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'd4',
      prompt: 'Open the center.',
      hint: 'd4.',
      correctFeedback: 'd4!',
      wrongFeedback: 'd4.',
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'Nxd4',
      prompt: 'Recapture.',
      hint: 'Nxd4.',
      correctFeedback: 'Nxd4!',
      wrongFeedback: 'Nxd4.',
      highlightSquares: ['f3', 'd4'],
    },

    // ── ACT 2: TEACH ──
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6 — Black develops and attacks your e4 pawn.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_Nf6,
      text: "Black attacks e4. Defend it by developing your second knight.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Nc3',
      prompt: 'Defend e4 and develop.',
      hint: "Nc3 — protect the pawn and control d5.",
      correctFeedback: "Nc3! You defend e4, control d5, and both knights are in the game.",
      wrongFeedback: "Play Nc3 — defend e4 and develop.",
      highlightSquares: ['b1', 'c3'],
    },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4 — Black pins your c3 knight.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_Bb4,
      text: "Black pins your knight to the king. Time to trade on c6 and wreck Black's pawn structure.",
    },
    {
      type: 'play-move',
      fen: FEN.after_Bb4,
      correctMove: 'Nxc6',
      prompt: "Trade the knight — damage Black's pawns.",
      hint: "Nxc6 — Black must recapture and double the c-pawns.",
      correctFeedback: "Nxc6! Black must take back with the b-pawn, creating doubled c-pawns. That's a long-term weakness.",
      wrongFeedback: "Take on c6 — wreck the pawn structure.",
      highlightSquares: ['d4', 'c6'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "What if Black develops the bishop to c5 instead of Nf6? It looks natural, but you have a strong reply.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "4...Bc5? The bishop looks active, but it's targeting a well-defended knight.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'Be3',
      prompt: "Challenge the bishop and develop.",
      hint: "Be3 — develop with a direct challenge to the bishop.",
      correctFeedback: "Be3! You develop your bishop and force a decision. If Black trades, your pawn recaptures toward the center.",
      wrongFeedback: "Play Be3 — challenge the bishop and develop.",
      highlightSquares: ['c1', 'e3'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "Your turn — play the next moves from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bb4,
      correctMove: 'Nxc6',
      prompt: 'Your move.',
      hint: 'Nxc6.',
      correctFeedback: 'Nxc6.',
      wrongFeedback: 'Nxc6.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-punish-d5: PUNISH 3...d5? (Premature Counter-Gambit)
// ═══════════════════════════════════════════════════════════

const SC_PUNISH_D5: OpeningLesson = {
  id: 'sc-punish-d5',
  title: 'Punish 3...d5?',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "You played 3.d4, opening the center. But instead of capturing, Black tries 3...d5 — a premature counter-gambit.",
      arrow: ['d4', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_d5,
      text: "3...d5? It looks bold, but the queen will be forced into the open.",
      highlightSquares: ['d5'],
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.punish_after_d5,
      correctMove: 'exd5',
      prompt: 'Take the pawn — force the queen out.',
      hint: 'exd5 — win the pawn.',
      correctFeedback: "exd5! Black's only good recapture is Qxd5, putting the queen in the center where you can attack it.",
      wrongFeedback: 'Capture on d5.',
      highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.punish_after_Qxd5, text: 'Qxd5 — the queen is exposed.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_Qxd5,
      correctMove: 'Nc3',
      prompt: 'Develop and attack the queen!',
      hint: "Nc3 — tempo on the queen.",
      correctFeedback: "Nc3! You develop with tempo. The queen must retreat, and you're ahead in development.",
      wrongFeedback: "Play Nc3 — gain time by attacking the queen.",
      highlightSquares: ['b1', 'c3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.punish_after_d5,
      text: "Black played 3...d5. Punish it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.punish_after_Qxd5, text: 'Qxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_Qxd5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-punish-bc5: PUNISH 4...Bc5? (Slow Bishop Move)
// ═══════════════════════════════════════════════════════════

const SC_PUNISH_BC5: OpeningLesson = {
  id: 'sc-punish-bc5',
  title: 'Punish 4...Bc5?',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "After 4.Nxd4, Black can develop the bishop to c5. It looks natural, but it's not the best.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "4...Bc5? The bishop stares at a well-defended knight. You can challenge it immediately.",
      highlightSquares: ['c5', 'd4'],
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'Be3',
      prompt: 'Challenge the bishop and develop.',
      hint: 'Be3 — threaten to trade on favorable terms.',
      correctFeedback: "Be3! You develop and challenge the bishop. If Black trades, your pawn strengthens the center.",
      wrongFeedback: 'Play Be3 — develop with a challenge.',
      highlightSquares: ['c1', 'e3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "Black played Bc5. Challenge it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'Be3',
      prompt: 'Your move.',
      hint: 'Be3.',
      correctFeedback: 'Be3.',
      wrongFeedback: 'Be3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-3: CASTLE UP (6...bxc6 7.Bd3 d5 8.exd5 cxd5 9.O-O)
// ═══════════════════════════════════════════════════════════

const SC_3: OpeningLesson = {
  id: 'sc-3',
  title: 'Castle Up',
  defaultOrientation: 'white',
  steps: [
    // ── ACT 1: RECAP ──
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start the Scotch.',
      hint: 'e4.',
      correctFeedback: 'e4!',
      wrongFeedback: 'e4.',
      highlightSquares: ['e2', 'e4'],
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Develop.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Nf3.',
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'd4',
      prompt: 'Open the center.',
      hint: 'd4.',
      correctFeedback: 'd4!',
      wrongFeedback: 'd4.',
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'Nxd4',
      prompt: 'Recapture.',
      hint: 'Nxd4.',
      correctFeedback: 'Nxd4!',
      wrongFeedback: 'Nxd4.',
      highlightSquares: ['f3', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Nc3',
      prompt: 'Defend e4.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3!',
      wrongFeedback: 'Nc3.',
      highlightSquares: ['b1', 'c3'],
    },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bb4,
      correctMove: 'Nxc6',
      prompt: 'Trade.',
      hint: 'Nxc6.',
      correctFeedback: 'Nxc6!',
      wrongFeedback: 'Nxc6.',
      highlightSquares: ['d4', 'c6'],
    },

    // ── ACT 2: TEACH ──
    { type: 'instruction', fen: FEN.after_bxc6, text: 'bxc6 — Black recaptures with doubled c-pawns.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_bxc6,
      text: "Black has doubled c-pawns. Now develop your bishop to d3 — it controls key squares and eyes the kingside.",
    },
    {
      type: 'play-move',
      fen: FEN.after_bxc6,
      correctMove: 'Bd3',
      prompt: 'Develop the bishop toward the kingside.',
      hint: "Bd3 — active development, eyes h7.",
      correctFeedback: "Bd3! The bishop aims at h7 and prepares castling. A perfect developing move.",
      wrongFeedback: "Play Bd3 — develop and prepare to castle.",
      highlightSquares: ['f1', 'd3'],
    },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5 — Black challenges the center.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_d5,
      text: "Black strikes with d5. Take it — the center opens in your favor.",
    },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'exd5',
      prompt: 'Capture and open the center.',
      hint: "exd5 — open lines for your pieces.",
      correctFeedback: "exd5! The center opens and your pieces are better developed to exploit it.",
      wrongFeedback: "Take on d5.",
      highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'cxd5 — Black recaptures, fixing the isolated d-pawn.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_cxd5,
      text: "Black has an isolated d-pawn on d5 — a target for your pieces. Now castle and get your king safe.",
    },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'O-O',
      prompt: 'Castle — get your king safe and connect your rooks.',
      hint: "O-O — castle kingside.",
      correctFeedback: "O-O! King is safe, rooks are connected, and you're targeting the isolated d5 pawn. Textbook Scotch.",
      wrongFeedback: "Castle kingside — O-O.",
      highlightSquares: ['e1', 'g1'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "What if Black plays 4...d5 instead of Nf6? This is the Schmidt Variation.",
    },
    {
      type: 'instruction',
      fen: FEN.schmidt_after_d5,
      text: "4...d5 — Black strikes the center. Take it!",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.schmidt_after_d5,
      correctMove: 'exd5',
      prompt: "Take the pawn.",
      hint: "exd5 — accept the pawn.",
      correctFeedback: "exd5! Black recaptures with the queen, and you have a strong move ready.",
      wrongFeedback: "Capture on d5.",
      highlightSquares: ['e4', 'd5'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_Nxc6,
      text: "Play the next three moves from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'bxc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_bxc6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'cxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-schmidt-1: SCHMIDT VARIATION (4...d5 5.exd5 Qxd5 6.Nb5)
// ═══════════════════════════════════════════════════════════

const SC_SCHMIDT_1: OpeningLesson = {
  id: 'sc-schmidt-1',
  title: 'Schmidt Variation',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "After 4.Nxd4, Black can try 4...d5 — the Schmidt Variation. The center opens and the queen comes out.",
    },
    {
      type: 'instruction',
      fen: FEN.schmidt_after_d5,
      text: "4...d5 — Black challenges the e4 pawn directly.",
      autoAdvance: 1200,
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.schmidt_after_d5,
      correctMove: 'exd5',
      prompt: 'Take the pawn — the queen has to recapture.',
      hint: "exd5 — win a pawn and lure out the queen.",
      correctFeedback: "exd5! Black must take with the queen, and then you have a powerful jump.",
      wrongFeedback: "Capture on d5.",
      highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.schmidt_after_Qxd5, text: 'Qxd5 — the queen is in the center.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.schmidt_after_Qxd5,
      text: "The queen is exposed on d5. Jump your knight to b5 — it attacks c7 and threatens to fork.",
    },
    {
      type: 'play-move',
      fen: FEN.schmidt_after_Qxd5,
      correctMove: 'Nb5',
      prompt: "Jump! Attack c7.",
      hint: "Nb5 — threaten Nc7+ forking king and rook.",
      correctFeedback: "Nb5! You threaten Nc7+, forking the king and rook. Black is in serious trouble.",
      wrongFeedback: "Jump to b5 — threaten the c7 fork.",
      highlightSquares: ['d4', 'b5'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.schmidt_after_d5,
      text: "Black played d5. Handle the Schmidt.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.schmidt_after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.schmidt_after_Qxd5, text: 'Qxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.schmidt_after_Qxd5,
      correctMove: 'Nb5',
      prompt: 'Your move.',
      hint: 'Nb5.',
      correctFeedback: 'Nb5.',
      wrongFeedback: 'Nb5.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-4: PIN & PRESSURE (9...O-O 10.Bg5 c6 11.Qf3)
// ═══════════════════════════════════════════════════════════

const SC_4: OpeningLesson = {
  id: 'sc-4',
  title: 'Pin & Pressure',
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
      correctMove: 'Nf3',
      prompt: 'Develop.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Nf3.',
      highlightSquares: ['g1', 'f3'],
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'd4',
      prompt: 'Open the center.',
      hint: 'd4.',
      correctFeedback: 'd4!',
      wrongFeedback: 'd4.',
      highlightSquares: ['d2', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'Nxd4',
      prompt: 'Recapture.',
      hint: 'Nxd4.',
      correctFeedback: 'Nxd4!',
      wrongFeedback: 'Nxd4.',
      highlightSquares: ['f3', 'd4'],
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Nc3',
      prompt: 'Defend.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3!',
      wrongFeedback: 'Nc3.',
      highlightSquares: ['b1', 'c3'],
    },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bb4,
      correctMove: 'Nxc6',
      prompt: 'Trade.',
      hint: 'Nxc6.',
      correctFeedback: 'Nxc6!',
      wrongFeedback: 'Nxc6.',
      highlightSquares: ['d4', 'c6'],
    },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'bxc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_bxc6,
      correctMove: 'Bd3',
      prompt: 'Develop.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3!',
      wrongFeedback: 'Bd3.',
      highlightSquares: ['f1', 'd3'],
    },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'exd5',
      prompt: 'Capture.',
      hint: 'exd5.',
      correctFeedback: 'exd5!',
      wrongFeedback: 'exd5.',
      highlightSquares: ['e4', 'd5'],
    },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'cxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'O-O',
      prompt: 'Castle.',
      hint: 'O-O.',
      correctFeedback: 'O-O!',
      wrongFeedback: 'O-O.',
      highlightSquares: ['e1', 'g1'],
    },

    // ── ACT 2: TEACH ──
    { type: 'instruction', fen: FEN.after_OO_b, text: 'O-O — Black castles too.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_OO_b,
      text: "Both kings are safe. Now pin the knight to the queen with your bishop.",
    },
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'Bg5',
      prompt: "Pin the knight!",
      hint: "Bg5 — pin Nf6 to the queen.",
      correctFeedback: "Bg5! The knight is pinned to the queen. Black can't move it without losing the queen.",
      wrongFeedback: "Play Bg5 — pin the knight.",
      highlightSquares: ['c1', 'g5'],
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6 — Black reinforces d5.', autoAdvance: 800 },
    {
      type: 'instruction',
      fen: FEN.after_c6,
      text: "Black shores up d5. Bring the queen to f3 — it adds pressure to the pin and eyes the kingside.",
    },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Qf3',
      prompt: "Pile on the pin — add the queen.",
      hint: "Qf3 — pressure on f6 and the kingside.",
      correctFeedback: "Qf3! The queen reinforces the pin on f6 and eyes the kingside. Black is under real pressure.",
      wrongFeedback: "Play Qf3 — add pressure to the pin.",
      highlightSquares: ['d1', 'f3'],
    },

    // ── ACT 3: PUNISH ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "What if Black brings the queen out early with 4...Qh4? This is the Steinitz Variation.",
    },
    {
      type: 'instruction',
      fen: FEN.steinitz_after_Qh4,
      text: "4...Qh4?! The queen is out early, attacking e4. Don't panic — develop normally.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.steinitz_after_Qh4,
      correctMove: 'Nc3',
      prompt: "Defend e4 and develop — don't chase the queen.",
      hint: "Nc3 — protect e4 and develop naturally.",
      correctFeedback: "Nc3! You defend e4 and develop. The queen on h4 is actually misplaced — it'll have to retreat eventually.",
      wrongFeedback: "Play Nc3 — calm development is best.",
      highlightSquares: ['b1', 'c3'],
    },

    // ── ACT 4: RECALL ──
    {
      type: 'instruction',
      fen: FEN.after_OO,
      text: "Play the last three moves from memory.",
      buttonText: "LET'S GO",
    },
    { type: 'instruction', fen: FEN.after_OO_b, text: 'O-O.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'Bg5',
      prompt: 'Your move.',
      hint: 'Bg5.',
      correctFeedback: 'Bg5.',
      wrongFeedback: 'Bg5.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Qf3',
      prompt: 'Your move.',
      hint: 'Qf3.',
      correctFeedback: 'Qf3.',
      wrongFeedback: 'Qf3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-steinitz-1: STEINITZ VARIATION (4...Qh4 5.Nc3)
// ═══════════════════════════════════════════════════════════

const SC_STEINITZ_1: OpeningLesson = {
  id: 'sc-steinitz-1',
  title: 'Steinitz Variation',
  defaultOrientation: 'white',
  steps: [
    // ── SETUP ──
    {
      type: 'instruction',
      fen: FEN.after_Nxd4,
      text: "After 4.Nxd4, some players try 4...Qh4 — bringing the queen out to attack e4. It's aggressive but premature.",
    },
    {
      type: 'instruction',
      fen: FEN.steinitz_after_Qh4,
      text: "4...Qh4?! The queen attacks e4, but it's exposed in the center. Keep calm.",
      autoAdvance: 1200,
    },

    // ── TEACH ──
    {
      type: 'play-move',
      fen: FEN.steinitz_after_Qh4,
      correctMove: 'Nc3',
      prompt: 'Defend e4 with development — ignore the queen.',
      hint: "Nc3 — protect e4, don't chase the queen.",
      correctFeedback: "Nc3! You defend e4 naturally. The queen is out of place on h4 and will have to retreat, wasting time.",
      wrongFeedback: "Play Nc3 — develop and defend. The queen will regret coming out early.",
      highlightSquares: ['b1', 'c3'],
    },

    // ── RECALL ──
    {
      type: 'instruction',
      fen: FEN.steinitz_after_Qh4,
      text: "Black played Qh4. Handle the Steinitz.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.steinitz_after_Qh4,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// sc-test-1: LEVEL 1 TEST
// ═══════════════════════════════════════════════════════════

const SC_TEST_1: OpeningLesson = {
  id: 'sc-test-1',
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [
    // ── PART 1: MAIN LINE RECALL ──
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time to prove you know the Scotch. Play the full main line from memory.",
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
      correctMove: 'Nf3',
      prompt: 'Your move.',
      hint: 'Nf3.',
      correctFeedback: 'Nf3.',
      wrongFeedback: 'Nf3.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'd4',
      prompt: 'Your move.',
      hint: 'd4.',
      correctFeedback: 'd4.',
      wrongFeedback: 'd4.',
    },
    { type: 'instruction', fen: FEN.after_exd4, text: 'exd4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_exd4,
      correctMove: 'Nxd4',
      prompt: 'Your move.',
      hint: 'Nxd4.',
      correctFeedback: 'Nxd4.',
      wrongFeedback: 'Nxd4.',
    },
    { type: 'instruction', fen: FEN.after_Nf6, text: 'Nf6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Nf6,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    { type: 'instruction', fen: FEN.after_Bb4, text: 'Bb4.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_Bb4,
      correctMove: 'Nxc6',
      prompt: 'Your move.',
      hint: 'Nxc6.',
      correctFeedback: 'Nxc6.',
      wrongFeedback: 'Nxc6.',
    },
    { type: 'instruction', fen: FEN.after_bxc6, text: 'bxc6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_bxc6,
      correctMove: 'Bd3',
      prompt: 'Your move.',
      hint: 'Bd3.',
      correctFeedback: 'Bd3.',
      wrongFeedback: 'Bd3.',
    },
    { type: 'instruction', fen: FEN.after_d5, text: 'd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.after_cxd5, text: 'cxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_cxd5,
      correctMove: 'O-O',
      prompt: 'Your move.',
      hint: 'O-O.',
      correctFeedback: 'O-O.',
      wrongFeedback: 'O-O.',
    },
    { type: 'instruction', fen: FEN.after_OO_b, text: 'O-O.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_OO_b,
      correctMove: 'Bg5',
      prompt: 'Your move.',
      hint: 'Bg5.',
      correctFeedback: 'Bg5.',
      wrongFeedback: 'Bg5.',
    },
    { type: 'instruction', fen: FEN.after_c6, text: 'c6.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_c6,
      correctMove: 'Qf3',
      prompt: 'Your move.',
      hint: 'Qf3.',
      correctFeedback: 'Qf3.',
      wrongFeedback: 'Qf3.',
    },

    // ── PART 2: DEVIATION HANDLING ──
    {
      type: 'instruction',
      fen: FEN.after_d4,
      text: "Main line done. Now handle the deviations.",
    },
    // Deviation 1: 3...d5?
    {
      type: 'instruction',
      fen: FEN.punish_after_d5,
      text: "Black plays 3...d5. You know what to do.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.punish_after_Qxd5, text: 'Qxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.punish_after_Qxd5,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
    // Deviation 2: 4...Bc5?
    {
      type: 'instruction',
      fen: FEN.punish_after_Bc5,
      text: "Black plays 4...Bc5.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_Bc5,
      correctMove: 'Be3',
      prompt: 'Your move.',
      hint: 'Be3.',
      correctFeedback: 'Be3.',
      wrongFeedback: 'Be3.',
    },
    // Deviation 3: Schmidt 4...d5
    {
      type: 'instruction',
      fen: FEN.schmidt_after_d5,
      text: "Black plays 4...d5. The Schmidt Variation.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.schmidt_after_d5,
      correctMove: 'exd5',
      prompt: 'Your move.',
      hint: 'exd5.',
      correctFeedback: 'exd5.',
      wrongFeedback: 'exd5.',
    },
    { type: 'instruction', fen: FEN.schmidt_after_Qxd5, text: 'Qxd5.', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.schmidt_after_Qxd5,
      correctMove: 'Nb5',
      prompt: 'Your move.',
      hint: 'Nb5.',
      correctFeedback: 'Nb5.',
      wrongFeedback: 'Nb5.',
    },
    // Deviation 4: Steinitz 4...Qh4
    {
      type: 'instruction',
      fen: FEN.steinitz_after_Qh4,
      text: "Black plays 4...Qh4. The Steinitz.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.steinitz_after_Qh4,
      correctMove: 'Nc3',
      prompt: 'Your move.',
      hint: 'Nc3.',
      correctFeedback: 'Nc3.',
      wrongFeedback: 'Nc3.',
    },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

const SCOTCH_LESSONS: Record<string, OpeningLesson> = {
  'sc-1': SC_1,
  'sc-2': SC_2,
  'sc-punish-d5': SC_PUNISH_D5,
  'sc-punish-bc5': SC_PUNISH_BC5,
  'sc-3': SC_3,
  'sc-schmidt-1': SC_SCHMIDT_1,
  'sc-4': SC_4,
  'sc-steinitz-1': SC_STEINITZ_1,
  'sc-test-1': SC_TEST_1,
}

export function getScotchLesson(id: string): OpeningLesson | undefined {
  return SCOTCH_LESSONS[id]
}
