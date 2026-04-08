import type { OpeningLesson } from '@/types/opening-lesson'

// ═══════════════════════════════════════════════════════════
// LONDON VS KING'S INDIAN LESSONS (lvki-1 through lvki-test-1)
//
// WHITE OPENING: User plays as White. White moves = play-move.
// Black moves = instruction with autoAdvance: 800.
//
// Main line:
// 1.d4 Nf6 2.Bf4 g6 3.Nf3 Bg7 4.e3 O-O 5.Be2 d6 6.h3
// c5 7.c3 b6 8.O-O Bb7 9.Nbd2
//
// FENs computed with chess.js from move sequences.
// ═══════════════════════════════════════════════════════════

const FEN = {
  start:       'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_d4:    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  after_Nf6:   'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
  after_Bf4:   'rnbqkb1r/pppppppp/5n2/8/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 2 2',
  after_g6:    'rnbqkb1r/pppppp1p/5np1/8/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3',
  after_Nf3:   'rnbqkb1r/pppppp1p/5np1/8/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3',
  after_Bg7:   'rnbqk2r/ppppppbp/5np1/8/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 2 4',
  after_e3:    'rnbqk2r/ppppppbp/5np1/8/3P1B2/4PN2/PPP2PPP/RN1QKB1R b KQkq - 0 4',
  after_OO:    'rnbq1rk1/ppppppbp/5np1/8/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQ - 1 5',
  after_Be2:   'rnbq1rk1/ppppppbp/5np1/8/3P1B2/4PN2/PPP1BPPP/RN1QK2R b KQ - 2 5',
  after_d6:    'rnbq1rk1/ppp1ppbp/3p1np1/8/3P1B2/4PN2/PPP1BPPP/RN1QK2R w KQ - 0 6',
  after_h3:    'rnbq1rk1/ppp1ppbp/3p1np1/8/3P1B2/4PN1P/PPP1BPP1/RN1QK2R b KQ - 0 6',
  after_c5:    'rnbq1rk1/pp2ppbp/3p1np1/2p5/3P1B2/4PN1P/PPP1BPP1/RN1QK2R w KQ - 0 7',
  after_c3:    'rnbq1rk1/pp2ppbp/3p1np1/2p5/3P1B2/2P1PN1P/PP2BPP1/RN1QK2R b KQ - 0 7',
  after_b6:    'rnbq1rk1/p3ppbp/1p1p1np1/2p5/3P1B2/2P1PN1P/PP2BPP1/RN1QK2R w KQ - 0 8',
  after_OO_w:  'rnbq1rk1/p3ppbp/1p1p1np1/2p5/3P1B2/2P1PN1P/PP2BPP1/RN1Q1RK1 b - - 1 8',
  after_Bb7:   'rn1q1rk1/pb2ppbp/1p1p1np1/2p5/3P1B2/2P1PN1P/PP2BPP1/RN1Q1RK1 w - - 2 9',
  after_Nbd2:  'rn1q1rk1/pb2ppbp/1p1p1np1/2p5/3P1B2/2P1PN1P/PP1NBPP1/R2Q1RK1 b - - 3 9',

  // Deviation: 4...c5 (instead of 4...O-O)
  devC5_after_c5:   'rnbqk2r/pp1pppbp/5np1/2p5/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 5',
  devC5_after_c3:   'rnbqk2r/pp1pppbp/5np1/2p5/3P1B2/2P1PN2/PP3PPP/RN1QKB1R b KQkq - 0 5',
  devC5_after_b6:   'rnbqk2r/p2pppbp/1p3np1/2p5/3P1B2/2P1PN2/PP3PPP/RN1QKB1R w KQkq - 0 6',
  devC5_after_Nbd2: 'rnbqk2r/p2pppbp/1p3np1/2p5/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 1 6',
  devC5_after_Bb7:  'rn1qk2r/pb1pppbp/1p3np1/2p5/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 2 7',
  devC5_after_Be2:  'rn1qk2r/pb1pppbp/1p3np1/2p5/3P1B2/2P1PN2/PP1NBPPP/R2QK2R b KQkq - 3 7',

  // Deviation: 6...b6 (instead of 6...c5)
  devB6_after_b6:   'rnbq1rk1/p1p1ppbp/1p1p1np1/8/3P1B2/4PN1P/PPP1BPP1/RN1QK2R w KQ - 0 7',
  devB6_after_OO:   'rnbq1rk1/p1p1ppbp/1p1p1np1/8/3P1B2/4PN1P/PPP1BPP1/RN1Q1RK1 b - - 1 7',
  devB6_after_Bb7:  'rn1q1rk1/pbp1ppbp/1p1p1np1/8/3P1B2/4PN1P/PPP1BPP1/RN1Q1RK1 w - - 2 8',
  devB6_after_a4:   'rn1q1rk1/pbp1ppbp/1p1p1np1/8/P2P1B2/4PN1P/1PP1BPP1/RN1Q1RK1 b - - 0 8',
  devB6_after_a6:   'rn1q1rk1/1bp1ppbp/pp1p1np1/8/P2P1B2/4PN1P/1PP1BPP1/RN1Q1RK1 w - - 0 9',
  devB6_after_Nbd2: 'rn1q1rk1/1bp1ppbp/pp1p1np1/8/P2P1B2/4PN1P/1PPNBPP1/R2Q1RK1 b - - 1 9',
}


// ═══════════════════════════════════════════════════════════
// lvki-1: The London Setup (d4, Bf4, Nf3)
// First lesson — no recap.
// ═══════════════════════════════════════════════════════════

const LVKI_1: OpeningLesson = {
  id: 'lvki-1',
  title: 'The London Setup',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.start, text: "Against the King's Indian, the London follows the same recipe: d4, Bf4, Nf3. Let's set it up." },

    // PREDICT 1: d4
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Start the London. What do you play?', hint: 'Grab the center with the d-pawn.', correctFeedback: 'd4 claims the center and gets the London rolling.', wrongFeedback: 'Play d4 to start the London.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'd4 takes the center. Every London game starts here.', arrow: ['d2', 'd4'] },

    // Black plays 1...Nf6
    { type: 'instruction', fen: FEN.after_d4, text: 'Black develops the knight to f6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },

    // PREDICT 2: Bf4
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'What makes this the London System?', hint: 'Develop the dark-squared bishop before playing e3.', correctFeedback: 'Bf4 is the signature London move — bishop out before e3 locks it in.', wrongFeedback: 'Play Bf4 — the bishop must come out before e3.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'Bf4 develops the bishop to its best diagonal before e3 closes the door.', arrow: ['c1', 'f4'] },

    // Black plays 2...g6
    { type: 'instruction', fen: FEN.after_Bf4, text: 'Black plays g6, preparing to fianchetto the bishop.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },

    // PREDICT 3: Nf3
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'How do you continue developing?', hint: 'Bring the kingside knight to its natural square.', correctFeedback: 'Nf3 develops the knight and supports d4.', wrongFeedback: 'Play Nf3 — develop the knight and guard d4.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Nf3 develops with tempo and keeps d4 solid. The London skeleton is taking shape.', arrow: ['g1', 'f3'] },

    // RECALL
    { type: 'instruction', fen: FEN.start, text: "Now play all three moves from memory." },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },

    { type: 'instruction', fen: FEN.after_Nf3, text: "d4, Bf4, Nf3 — the London is ready for whatever Black throws at you." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvki-2: Building the Pyramid (e3, Be2, h3)
// ═══════════════════════════════════════════════════════════

const LVKI_2: OpeningLesson = {
  id: 'lvki-2',
  title: 'Building the Pyramid',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_Nf3, text: "Black fianchettoes and castles. Time to build the London pyramid with e3, Be2, and h3." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Let's see what you remember!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },

    // Black plays 3...Bg7
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Black completes the fianchetto with Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },

    // PREDICT 1: e3
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'How do you support d4?', hint: 'Reinforce the center with a pawn from e2.', correctFeedback: 'e3 supports d4 and completes the pawn pyramid.', wrongFeedback: 'Play e3 to shore up d4.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'e3 creates the classic London pyramid. d4 is rock-solid now.', arrow: ['e2', 'e3'] },

    // Black plays 4...O-O
    { type: 'instruction', fen: FEN.after_e3, text: 'Black castles kingside.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },

    // PREDICT 2: Be2
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Be2', prompt: 'Time to develop the light-squared bishop. Where does it go?', hint: 'A quiet square that prepares castling.', correctFeedback: 'Be2 develops the bishop and clears the way to castle.', wrongFeedback: 'Play Be2 — develop and prepare to castle.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'Be2 is modest but effective. The bishop supports the kingside and you can castle next.', arrow: ['f1', 'e2'] },

    // Black plays 5...d6
    { type: 'instruction', fen: FEN.after_Be2, text: 'Black plays d6, supporting the center.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },

    // PREDICT 3: h3
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'h3', prompt: 'What useful move can you make before castling?', hint: 'Prevent Black from pinning your knight with Bg4.', correctFeedback: 'h3 stops Bg4 from pinning the knight on f3.', wrongFeedback: 'Play h3 to prevent the Bg4 pin.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'h3 is a key prophylactic move. Black can never pin your f3 knight with Bg4 now.', arrow: ['h2', 'h3'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_Nf3, text: "Show me you've got this." },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    { type: 'instruction', fen: FEN.after_h3, text: "e3, Be2, h3 — the pyramid is built and Bg4 is off the table." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvki-dev-c5: Deviation — 4...c5 (instead of 4...O-O)
// Black pushes c5 before castling.
// Our 3 moves: c3, Nbd2, Be2
// ═══════════════════════════════════════════════════════════

const LVKI_DEV_C5: OpeningLesson = {
  id: 'lvki-dev-c5',
  title: 'Dev 4...c5',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_e3, text: "Sometimes Black pushes c5 right away instead of castling. Here's how to respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Prove you know these moves!" },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_e3, text: 'Black plays c5 instead of castling, challenging your d4 pawn immediately.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },

    // PREDICT 1: c3
    { type: 'play-move', fen: FEN.devC5_after_c5, correctMove: 'c3', prompt: 'Black is pushing c5 early. How do you reinforce d4?', hint: 'Support d4 with a pawn.', correctFeedback: 'c3 locks down the center. Black can push, but d4 is not going anywhere.', wrongFeedback: 'Play c3 to support the d4 pawn.' },
    { type: 'instruction', fen: FEN.devC5_after_c3, text: 'c3 gives d4 an extra defender. The center stays yours.', arrow: ['c2', 'c3'] },

    // Black plays 5...b6
    { type: 'instruction', fen: FEN.devC5_after_c3, text: 'Black plays b6, planning to fianchetto the queenside bishop.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },

    // PREDICT 2: Nbd2
    { type: 'play-move', fen: FEN.devC5_after_b6, correctMove: 'Nbd2', prompt: 'How do you develop the queenside knight?', hint: 'This knight goes to d2, leaving c3 for the pawn.', correctFeedback: 'Nbd2 develops the knight without blocking the c-pawn.', wrongFeedback: 'Play Nbd2 — the knight belongs on d2 in the London.' },
    { type: 'instruction', fen: FEN.devC5_after_Nbd2, text: 'Nbd2 is the London way. The knight supports e4 later and keeps c3 for the pawn.', arrow: ['b1', 'd2'] },

    // Black plays 6...Bb7
    { type: 'instruction', fen: FEN.devC5_after_Nbd2, text: 'Black completes the fianchetto with Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },

    // PREDICT 3: Be2
    { type: 'play-move', fen: FEN.devC5_after_Bb7, correctMove: 'Be2', prompt: 'Your turn — develop the last minor piece.', hint: 'The light-squared bishop goes to a quiet developing square.', correctFeedback: 'Be2 develops the bishop and prepares castling.', wrongFeedback: 'Play Be2 to develop and prepare to castle.' },
    { type: 'instruction', fen: FEN.devC5_after_Be2, text: 'Be2 completes your development. You can castle kingside next move.', arrow: ['f1', 'e2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_e3, text: "Now play all three responses from memory." },
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.devC5_after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.devC5_after_c3, text: 'b6.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.devC5_after_b6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.devC5_after_Nbd2, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.devC5_after_Bb7, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },

    { type: 'instruction', fen: FEN.devC5_after_Be2, text: "c3, Nbd2, Be2 — even when Black skips castling, you keep building the London structure." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvki-3: Queenside Development (c3, O-O, Nbd2)
// ═══════════════════════════════════════════════════════════

const LVKI_3: OpeningLesson = {
  id: 'lvki-3',
  title: 'Queenside Development',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_h3, text: "Black challenges the center with c5 and develops the queenside. Time to finish your setup with c3, O-O, and Nbd2." },

    // RECAP
    { type: 'instruction', fen: FEN.start, text: "Quick review before the new stuff." },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    // Black plays 6...c5
    { type: 'instruction', fen: FEN.after_h3, text: 'Black plays c5, challenging the center.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },

    // PREDICT 1: c3
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Black is pushing c5. How do you hold the center?', hint: 'Support d4 with a pawn.', correctFeedback: 'c3 reinforces d4. The center stays locked down.', wrongFeedback: 'Play c3 to support d4.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'c3 makes the d4 pawn immovable. Black can push all they want.', arrow: ['c2', 'c3'] },

    // Black plays 7...b6
    { type: 'instruction', fen: FEN.after_c3, text: 'Black plays b6, preparing Bb7.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },

    // PREDICT 2: O-O
    { type: 'play-move', fen: FEN.after_b6, correctMove: 'O-O', prompt: 'What should you do before developing the last knight?', hint: 'Get your king to safety.', correctFeedback: 'O-O tucks the king away and connects the rooks.', wrongFeedback: 'Castle kingside first — king safety comes before the last knight.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Castling connects your rooks and gets the king safe behind the pawn wall.', arrow: ['e1', 'g1'] },

    // Black plays 8...Bb7
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Black develops the bishop to b7, targeting the long diagonal.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.after_Bb7, correctMove: 'Nbd2', prompt: 'One piece left to develop. Where does the knight go?', hint: 'This knight goes to d2, supporting e4 later.', correctFeedback: 'Nbd2 completes your development. The London setup is fully built.', wrongFeedback: 'Play Nbd2 — the knight belongs on d2 in the London.' },
    { type: 'instruction', fen: FEN.after_Nbd2, text: 'Nbd2 finishes your development. From d2, the knight can hop to e4 or support c4 later.', arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_h3, text: "Now play all three from memory." },
    { type: 'instruction', fen: FEN.after_h3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'b6.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.after_b6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.after_Bb7, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    { type: 'instruction', fen: FEN.after_Nbd2, text: "c3, O-O, Nbd2 — the London is fully assembled. You're ready for the middlegame." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvki-dev-b6: Deviation — 6...b6 (instead of 6...c5)
// Black skips c5 and fianchettoes immediately.
// Our 3 moves: O-O, a4, Nbd2
// ═══════════════════════════════════════════════════════════

const LVKI_DEV_B6: OpeningLesson = {
  id: 'lvki-dev-b6',
  title: 'Dev 6...b6',
  defaultOrientation: 'white',
  steps: [
    { type: 'instruction', fen: FEN.after_h3, text: "Sometimes Black plays b6 instead of c5, fianchettoing the queenside bishop right away. Here's how to respond." },

    // RECAP to deviation point
    { type: 'instruction', fen: FEN.start, text: "Show me you've got this." },
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },

    // DEVIATION SETUP
    { type: 'instruction', fen: FEN.after_h3, text: 'Black plays b6 instead of c5, going straight for the queenside bishop fianchetto.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },

    // PREDICT 1: O-O
    { type: 'play-move', fen: FEN.devB6_after_b6, correctMove: 'O-O', prompt: 'Black is developing the queenside. What should you do first?', hint: 'Get your king safe before committing pieces.', correctFeedback: 'O-O gets the king safe. No rush to react to Black\'s plan.', wrongFeedback: 'Castle first — king safety before anything else.' },
    { type: 'instruction', fen: FEN.devB6_after_OO, text: 'Castling keeps things simple. Your king is safe and your rooks are connected.', arrow: ['e1', 'g1'] },

    // Black plays 7...Bb7
    { type: 'instruction', fen: FEN.devB6_after_OO, text: 'Black develops the bishop to b7, aiming at the long diagonal.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },

    // PREDICT 2: a4
    { type: 'play-move', fen: FEN.devB6_after_Bb7, correctMove: 'a4', prompt: 'How do you claim space on the queenside?', hint: 'Push a pawn forward to cramp Black\'s queenside.', correctFeedback: 'a4 grabs queenside space and limits Black\'s b5 expansion.', wrongFeedback: 'Play a4 to claim queenside space.' },
    { type: 'instruction', fen: FEN.devB6_after_a4, text: 'a4 stops Black from expanding with b5 and stakes out queenside territory.', arrow: ['a2', 'a4'] },

    // Black plays 8...a6
    { type: 'instruction', fen: FEN.devB6_after_a4, text: 'Black plays a6, preventing a5 and keeping the queenside flexible.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },

    // PREDICT 3: Nbd2
    { type: 'play-move', fen: FEN.devB6_after_a6, correctMove: 'Nbd2', prompt: 'Complete your development. Where does the knight go?', hint: 'The queenside knight belongs on d2.', correctFeedback: 'Nbd2 finishes development. The knight supports e4 and keeps options open.', wrongFeedback: 'Play Nbd2 — the knight goes to d2 in the London.' },
    { type: 'instruction', fen: FEN.devB6_after_Nbd2, text: 'Nbd2 completes your setup. From d2, the knight can reroute to e4 or c4.', arrow: ['b1', 'd2'] },

    // RECALL
    { type: 'instruction', fen: FEN.after_h3, text: "Now play all three responses from memory." },
    { type: 'instruction', fen: FEN.after_h3, text: 'b6.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.devB6_after_b6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devB6_after_OO, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.devB6_after_Bb7, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.devB6_after_a4, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.devB6_after_a6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    { type: 'instruction', fen: FEN.devB6_after_Nbd2, text: "O-O, a4, Nbd2 — whether Black plays c5 or b6 first, you end up with a solid London setup." },
  ],
}


// ═══════════════════════════════════════════════════════════
// lvki-test-1: Level Test
// ═══════════════════════════════════════════════════════════

const LVKI_TEST_1: OpeningLesson = {
  id: 'lvki-test-1',
  title: 'Lvl 1 Test',
  defaultOrientation: 'white',
  steps: [
    // === MAIN LINE RECALL (all 9 White moves) ===
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    { type: 'instruction', fen: FEN.after_h3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.after_c3, text: 'b6.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.after_b6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.after_OO_w, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.after_Bb7, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },

    // === DEVIATION: 4...c5 ===
    // Replay to deviation point (after e3)
    { type: 'play-move', fen: FEN.start, correctMove: 'd4', prompt: 'Your move.', hint: 'd4.', correctFeedback: 'd4.', wrongFeedback: 'd4.' },
    { type: 'instruction', fen: FEN.after_d4, text: 'Nf6.', autoAdvance: 800, highlightSquares: ['g8', 'f6'] },
    { type: 'play-move', fen: FEN.after_Nf6, correctMove: 'Bf4', prompt: 'Your move.', hint: 'Bf4.', correctFeedback: 'Bf4.', wrongFeedback: 'Bf4.' },
    { type: 'instruction', fen: FEN.after_Bf4, text: 'g6.', autoAdvance: 800, highlightSquares: ['g7', 'g6'] },
    { type: 'play-move', fen: FEN.after_g6, correctMove: 'Nf3', prompt: 'Your move.', hint: 'Nf3.', correctFeedback: 'Nf3.', wrongFeedback: 'Nf3.' },
    { type: 'instruction', fen: FEN.after_Nf3, text: 'Bg7.', autoAdvance: 800, highlightSquares: ['f8', 'g7'] },
    { type: 'play-move', fen: FEN.after_Bg7, correctMove: 'e3', prompt: 'Your move.', hint: 'e3.', correctFeedback: 'e3.', wrongFeedback: 'e3.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_e3, text: 'c5.', autoAdvance: 800, highlightSquares: ['c7', 'c5'] },
    { type: 'play-move', fen: FEN.devC5_after_c5, correctMove: 'c3', prompt: 'Your move.', hint: 'c3.', correctFeedback: 'c3.', wrongFeedback: 'c3.' },
    { type: 'instruction', fen: FEN.devC5_after_c3, text: 'b6.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.devC5_after_b6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
    { type: 'instruction', fen: FEN.devC5_after_Nbd2, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.devC5_after_Bb7, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },

    // === DEVIATION: 6...b6 ===
    // Replay to deviation point (after h3)
    { type: 'instruction', fen: FEN.after_e3, text: 'O-O.', autoAdvance: 800, highlightSquares: ['e8', 'g8'] },
    { type: 'play-move', fen: FEN.after_OO, correctMove: 'Be2', prompt: 'Your move.', hint: 'Be2.', correctFeedback: 'Be2.', wrongFeedback: 'Be2.' },
    { type: 'instruction', fen: FEN.after_Be2, text: 'd6.', autoAdvance: 800, highlightSquares: ['d7', 'd6'] },
    { type: 'play-move', fen: FEN.after_d6, correctMove: 'h3', prompt: 'Your move.', hint: 'h3.', correctFeedback: 'h3.', wrongFeedback: 'h3.' },
    // Deviation move
    { type: 'instruction', fen: FEN.after_h3, text: 'b6.', autoAdvance: 800, highlightSquares: ['b7', 'b6'] },
    { type: 'play-move', fen: FEN.devB6_after_b6, correctMove: 'O-O', prompt: 'Your move.', hint: 'O-O.', correctFeedback: 'O-O.', wrongFeedback: 'O-O.' },
    { type: 'instruction', fen: FEN.devB6_after_OO, text: 'Bb7.', autoAdvance: 800, highlightSquares: ['c8', 'b7'] },
    { type: 'play-move', fen: FEN.devB6_after_Bb7, correctMove: 'a4', prompt: 'Your move.', hint: 'a4.', correctFeedback: 'a4.', wrongFeedback: 'a4.' },
    { type: 'instruction', fen: FEN.devB6_after_a4, text: 'a6.', autoAdvance: 800, highlightSquares: ['a7', 'a6'] },
    { type: 'play-move', fen: FEN.devB6_after_a6, correctMove: 'Nbd2', prompt: 'Your move.', hint: 'Nbd2.', correctFeedback: 'Nbd2.', wrongFeedback: 'Nbd2.' },
  ],
}


// ═══════════════════════════════════════════════════════════
// LESSON LOOKUP
// ═══════════════════════════════════════════════════════════

export function getLondonVsKingsIndianLesson(id: string): OpeningLesson | undefined {
  switch (id) {
    case 'lvki-1': return LVKI_1
    case 'lvki-2': return LVKI_2
    case 'lvki-dev-c5': return LVKI_DEV_C5
    case 'lvki-3': return LVKI_3
    case 'lvki-dev-b6': return LVKI_DEV_B6
    case 'lvki-test-1': return LVKI_TEST_1
    default: return undefined
  }
}
