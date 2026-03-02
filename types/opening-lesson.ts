// Types for interactive opening lessons (chat-style teaching flow)

import type { Square } from 'chess.js'

// ═══════════════════════════════════════════
// STEP TYPES
// ═══════════════════════════════════════════

/** Coach explains something — board shows a position, user taps Continue */
export interface InstructionStep {
  type: 'instruction'
  fen: string
  text: string
  /** Optional squares to highlight (e.g., key squares in the position) */
  highlightSquares?: Square[]
  /** Optional arrow [from, to] to draw on the board */
  arrow?: [Square, Square]
  /** Override board orientation for this step (used in rl-4 for flipping) */
  orientation?: 'white' | 'black'
  /** Auto-advance after this many ms (no Continue button). Use for opponent moves. */
  autoAdvance?: number
  /** Custom button text (default: "CONTINUE") */
  buttonText?: string
}

/** User must play the correct move on the board */
export interface PlayMoveStep {
  type: 'play-move'
  fen: string
  /** The correct move in SAN (e.g., "e4", "Nf3", "Bb5") */
  correctMove: string
  /** Coach prompt shown before the move (e.g., "Play 1.e4!") */
  prompt: string
  /** Hint shown after 2 wrong attempts */
  hint: string
  /** Feedback when correct */
  correctFeedback: string
  /** Feedback when wrong */
  wrongFeedback: string
  /** Additional moves that are also accepted as correct (e.g., multiple good responses) */
  acceptMoves?: string[]
  /** Override board orientation */
  orientation?: 'white' | 'black'
  /** Squares to highlight as guidance BEFORE the user moves (e.g., [from, to]) */
  highlightSquares?: Square[]
  /** Arrow shown on the board AFTER a correct move (e.g., to show what the move attacks) */
  postMoveArrow?: [Square, Square]
}

/** Multiple choice quiz inline in the chat */
export interface QuizStep {
  type: 'quiz'
  fen: string
  question: string
  options: string[]
  correctIndex: number
  /** Explanation shown after answering (right or wrong) */
  explanation: string
  /** Override board orientation */
  orientation?: 'white' | 'black'
}

/** Multi-move puzzle — user plays a sequence of moves */
export interface PuzzleStep {
  type: 'puzzle'
  fen: string
  /** Solution moves in SAN, alternating player/opponent */
  solutionMoves: string[]
  playerColor: 'white' | 'black'
  /** Coach prompt (e.g., "Find the best continuation!") */
  prompt: string
  /** Hint after 2 wrong attempts */
  hint: string
  correctFeedback: string
  /** Override board orientation */
  orientation?: 'white' | 'black'
}

export type LessonStep = InstructionStep | PlayMoveStep | QuizStep | PuzzleStep

// ═══════════════════════════════════════════
// LESSON CONTAINER
// ═══════════════════════════════════════════

export interface OpeningLesson {
  /** Matches the node id from the opening tree (e.g., "rl-1") */
  id: string
  /** Lesson title (e.g., "The Opening Moves") */
  title: string
  /** Default board orientation */
  defaultOrientation: 'white' | 'black'
  /** Ordered list of steps */
  steps: LessonStep[]
}
