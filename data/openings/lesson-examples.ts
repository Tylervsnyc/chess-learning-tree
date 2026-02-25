// ═══════════════════════════════════════════════════════════
// MINIMAL LESSON EXAMPLES — Reference for the Openings Curriculum Agent
//
// One example per lesson type. Agents read THIS instead of full lesson files.
// Real lessons live in {opening}-lessons.ts files.
// ═══════════════════════════════════════════════════════════

import type { OpeningLesson } from '@/types/opening-lesson'

// ─────────────────────────────────────────────────────────
// FEN DICTIONARY — Pre-compute ALL FENs at the top of the file.
// Use chess.js to generate them. Never guess.
// Branch deviation FENs from the LAST COMMON POSITION (before the mistake).
// ─────────────────────────────────────────────────────────

const FEN = {
  // Main line positions (computed from 1.e4 e5 2.Nf3 Nc6 3.Bb5 ...)
  start:      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4:   'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  after_e5:   'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  after_Nf3:  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  after_Nc6:  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
  after_Bb5:  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  // ... add all FENs needed for this lesson

  // Deviation FENs — branched from last common position
  // Example: After 2.Nf3, opponent plays f6 instead of Nc6
  punish_after_f6:   'rnbqkbnr/pppp1p1p/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
  punish_after_fxe5: 'rnbqkbnr/pppp1p1p/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
}

// ═══════════════════════════════════════════════════════════
// EXAMPLE 1: TEACHING LESSON
//
// 4-act structure: Recap → Teach → Punish opponent's mistake → Recall
// Target: 15-20 steps, 2-4 new moves
// ═══════════════════════════════════════════════════════════

export const EXAMPLE_TEACHING: OpeningLesson = {
  id: 'rl-1',                          // matches node id in tree
  title: 'The Opening Moves',
  defaultOrientation: 'white',         // never flip mid-lesson
  steps: [

    // ── ACT 1: RECAP (skip for first lesson of an opening) ──
    // User replays all previous moves to reach the starting position.
    // User's moves = play-move, opponent responses = instruction with autoAdvance: 800

    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Start with the king pawn.',
      hint: 'e2 to e4.',
      correctFeedback: 'e4!',
      wrongFeedback: 'Push the king pawn two squares.',
      highlightSquares: ['e2', 'e4'],  // REQUIRED in teach — guide arrow
    },
    { type: 'instruction', fen: FEN.after_e5, text: 'e5.', autoAdvance: 800 },

    // ── ACT 2: TEACH (2-4 new moves with commentary) ──
    // Every play-move MUST have highlightSquares (the guide arrow).
    // Opponent moves = instruction with autoAdvance: 800
    // Explain the WHY, not just the move name.

    {
      type: 'instruction',
      fen: FEN.after_e5,
      text: "Black mirrors your move. Now you need a piece that attacks e5.",
      highlightSquares: ['e5'],
    },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: "Develop a piece that attacks e5.",
      hint: "Your knight can reach f3 — and from there it hits e5.",
      correctFeedback: "Nf3! The knight develops AND attacks e5. Two jobs, one move.",  // specific feedback
      wrongFeedback: "Which piece can develop while threatening the e5 pawn?",
      highlightSquares: ['g1', 'f3'],  // guide arrow: from → to
      postMoveArrow: ['f3', 'e5'],     // optional: show what the move attacks
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: 'Nc6 — defending the pawn.', autoAdvance: 800 },

    {
      type: 'play-move',
      fen: FEN.after_Nc6,
      correctMove: 'Bb5',
      prompt: "Pin the defender. Your bishop can reach a powerful square.",
      hint: "Bb5 puts pressure on the knight that's guarding e5.",
      correctFeedback: "Bb5! The Ruy Lopez. Your bishop pins the knight to the king — if it moves, e5 falls.",
      wrongFeedback: "Look at the knight on c6. What piece can pressure it from a distance?",
      highlightSquares: ['f1', 'b5'],
    },

    // ── ACT 3: PUNISH THE OPPONENT'S MISTAKE ──
    // The OPPONENT makes a realistic amateur mistake. User finds the punishment.
    // Use auto-advance instructions for intermediate opponent moves (no teleporting).
    // Validate the entire sequence with chess.js — check for pins, illegal moves.

    {
      type: 'instruction',
      fen: FEN.after_Bb5,
      text: "After Bb5, a beginner might panic and try to defend e5 with their f-pawn.",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "f6?? It defends e5, but it weakens the king's diagonal. Find the punishment.",
      autoAdvance: 1500,               // show the mistake, then user acts
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f6,
      correctMove: 'Nxe5',
      prompt: "The pawn on f6 weakened the king. Sacrifice!",
      hint: "Take on e5 — even though f6 defends it. The diagonal opens.",
      correctFeedback: "Nxe5! The knight sacrifice rips open the f-file.",
      wrongFeedback: "Don't be afraid — take the pawn. The sacrifice wins material.",
      highlightSquares: ['f3', 'e5'],
    },
    // auto-advance for opponent's recapture (no teleporting!)
    { type: 'instruction', fen: FEN.punish_after_fxe5, text: 'fxe5.', autoAdvance: 800 },

    // ── ACT 4: RECALL (user replays their moves from teach section) ──
    // ZERO guidance — pure memory test.
    // prompt: always "Your move."
    // hint: just the move notation (e.g. "e4.")
    // correctFeedback: just the move notation
    // wrongFeedback: just the move notation
    // NO highlightSquares, NO arrows, NO descriptive text
    // Opponent moves = instruction with autoAdvance: 800

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
      correctMove: 'Bb5',
      prompt: 'Your move.',
      hint: 'Bb5.',
      correctFeedback: 'Bb5.',
      wrongFeedback: 'Bb5.',
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// EXAMPLE 2: PUNISH LESSON
//
// Teaches how to exploit a common opponent mistake.
// Structure: Setup (show the mistake) → Teach (the punishment) → Recall
// No recap act — starts from the position where the mistake happens.
// ═══════════════════════════════════════════════════════════

export const EXAMPLE_PUNISH: OpeningLesson = {
  id: 'rl-punish-f6',                  // format: {prefix}-punish-{mistake}
  title: 'Punishing f6',
  defaultOrientation: 'white',
  steps: [

    // ── SETUP: Show the mistake ──
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "After 2.Nf3, beginners sometimes defend e5 with f6. It looks logical — but it's a blunder.",
      arrow: ['f3', 'e5'],
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "2...f6?? Weakens the e8-h5 diagonal. The king is exposed.",
      highlightSquares: ['e8', 'f7', 'g6', 'h5'],
    },

    // ── TEACH: The punishment line ──
    // Each user move = play-move with highlightSquares
    // Each opponent response = instruction with autoAdvance (no teleporting)
    {
      type: 'play-move',
      fen: FEN.punish_after_f6,
      correctMove: 'Nxe5',
      prompt: "Sacrifice the knight — the f-file opens.",
      hint: "Take on e5. Black captures, but the diagonal is exposed.",
      correctFeedback: "Nxe5! Knight sacrifice, but the king's cover is gone.",
      wrongFeedback: "Take the pawn. The sacrifice opens deadly lines.",
      highlightSquares: ['f3', 'e5'],
    },
    { type: 'instruction', fen: FEN.punish_after_fxe5, text: 'fxe5 — Black takes the bait.', autoAdvance: 800 },
    // ... more punishment moves (Qh5+, g6, Qxe5+ forking king + rook)

    // ── RECALL: Replay the punishment ──
    // Same rules as ACT 4: zero guidance, just move notation
    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "Your turn. Black played f6 — punish it.",
      buttonText: "LET'S GO",
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f6,
      correctMove: 'Nxe5',
      prompt: 'Your move.',
      hint: 'Nxe5.',
      correctFeedback: 'Nxe5.',
      wrongFeedback: 'Nxe5.',
    },
    { type: 'instruction', fen: FEN.punish_after_fxe5, text: 'fxe5.', autoAdvance: 800 },
    // ... recall continues for remaining punishment moves
  ],
}

// ═══════════════════════════════════════════════════════════
// EXAMPLE 3: LEVEL TEST
//
// Tests retention of ALL lessons in this level. No real hints.
// Structure: Main line recall → Deviation handling (2-3 scenarios)
// Hints are playful/unhelpful: "You're on your own!", "No hints this time!"
// NO highlightSquares anywhere in tests.
// ═══════════════════════════════════════════════════════════

export const EXAMPLE_TEST: OpeningLesson = {
  id: 'rl-test-1',                     // format: {prefix}-test-{level}
  title: 'Level 1 Test',
  defaultOrientation: 'white',
  steps: [

    // ── PART 1: MAIN LINE RECALL ──
    // User plays ALL their moves from the full main line, from memory.
    // Opponent moves = instruction with autoAdvance: 800
    {
      type: 'instruction',
      fen: FEN.start,
      text: "Time to prove you know the Ruy Lopez. Play the full main line from memory.",
    },
    {
      type: 'play-move',
      fen: FEN.start,
      correctMove: 'e4',
      prompt: 'Your move.',
      hint: "This is a test. I can't help you.",        // unhelpful hint!
      correctFeedback: 'e4!',
      wrongFeedback: 'Not quite. Try again.',
      // NO highlightSquares in tests
    },
    { type: 'instruction', fen: FEN.after_e5, text: '1...e5', autoAdvance: 800 },
    {
      type: 'play-move',
      fen: FEN.after_e5,
      correctMove: 'Nf3',
      prompt: 'Keep going.',
      hint: "You're on your own!",                       // playful, unhelpful
      correctFeedback: 'Nf3!',
      wrongFeedback: 'Think back to the lesson.',
    },
    { type: 'instruction', fen: FEN.after_Nc6, text: '2...Nc6', autoAdvance: 800 },
    // ... continues for all main line moves

    // ── PART 2: DEVIATION HANDLING ──
    // Test the user's ability to handle off-script play.
    // Show the opponent's mistake, user must find the punishment.
    {
      type: 'instruction',
      fen: FEN.after_Nf3,
      text: "Main line done. Now — what if Black goes off-script?",
    },
    {
      type: 'instruction',
      fen: FEN.punish_after_f6,
      text: "Black plays f6. You know what to do.",
      autoAdvance: 1200,
    },
    {
      type: 'play-move',
      fen: FEN.punish_after_f6,
      correctMove: 'Nxe5',
      prompt: 'Punish.',
      hint: "No hints this time!",                       // test mode!
      correctFeedback: 'Nxe5! You remembered.',
      wrongFeedback: 'What did we learn about f6?',
    },
    // ... more deviation scenarios from other punish lessons
  ],
}
