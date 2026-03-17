// Shared types for the opening lesson build pipeline

export interface PrepPosition {
  fen: string
  moveSan: string
  moveNumber: number
  /** 'white' | 'black' — who just moved */
  mover: 'white' | 'black'
  eval: {
    /** Centipawns from white's perspective, null if Lichess 404 */
    cp: number | null
    /** Top 3 moves from Lichess cloud eval */
    topMoves: { san: string; cp: number }[]
  } | null
  /** Opponent positions where a common alternative exists in masters DB */
  deviationCandidates: { move: string; masterGames: number; ourBestResponse: string }[]
}

export interface LessonPlanItem {
  nodeId: string
  type: 'main' | 'deviation' | 'branch' | 'test'
  /** Human-readable name (max 15 chars) */
  name?: string
  /** Moves taught in this lesson (SAN) */
  newMoves: string[]
  /** FEN positions relevant to this lesson */
  positions: PrepPosition[]
  /** For deviation: the alternative move the opponent plays */
  deviationMove?: string
  /** For deviation: our best response from masters DB */
  ourResponse?: string[]
}

export interface PrepData {
  meta: {
    slug: string
    level: number
    side: 'white' | 'black'
    mainLine: string
    generatedAt: string
  }
  positions: PrepPosition[]
  lessonPlan: LessonPlanItem[]
}

/** Shape of individual lesson JSON output from write-lessons */
export interface LessonJson {
  id: string
  title: string
  defaultOrientation: 'white' | 'black'
  steps: LessonStepJson[]
}

export type LessonStepJson =
  | { type: 'instruction'; fen: string; text: string; autoAdvance?: number; highlightSquares?: string[]; arrow?: [string, string] }
  | { type: 'play-move'; fen: string; correctMove: string; prompt: string; hint: string; correctFeedback: string; wrongFeedback: string; highlightSquares?: string[]; acceptMoves?: string[] }
  | { type: 'quiz'; fen: string; question: string; options: string[]; correctIndex: number; explanation: string }
