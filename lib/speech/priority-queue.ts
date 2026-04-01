// Priority queue engine for Rookie's speech system.
// Hades-style dialogue queue: every line has preconditions and a priority score.
// Pool of possible lines, scored and filtered per context. Once said, drained for the game.

import { type Beat, type EvalMood } from '@/lib/speech/beat-sheet';
export type { Beat, EvalMood };
export type GameEvent = 'capture' | 'check' | 'checkmate' | 'castle' | 'blunder' | 'great_move' | 'stalemate' | 'capture_sequence' | 'resign' | 'mood_change' | 'none';

export interface LineConditions {
  /** Which beats this line is valid for */
  beats: Beat[];
  /** Which eval moods this line is valid for (empty = any) */
  evalMoods?: EvalMood[];
  /** Which game events trigger this line (empty = any) */
  events?: GameEvent[];
  /** Is this a thread line? If so, which thread id */
  threadId?: string;
  /** Who just moved? */
  movedBy?: 'player' | 'rookie';
  /** Which piece was moved (e.g. 'queen', 'knight') */
  movedPiece?: string;
  /** Which color the player is playing */
  playerColor?: 'white' | 'black';
  /** Minimum move number */
  minMove?: number;
  /** Maximum move number */
  maxMove?: number;
}

export interface SpeechLine {
  id: string;
  text: string; // may contain {name}, {piece} placeholders. Use [SFX] to mark sound effect insertion point.
  conditions: LineConditions;
  /** Base priority (higher = more likely to be selected). 1-100 scale. */
  priority: number;
  /** Source: 'authored' (template) or 'generated' (Claude API) */
  source: 'authored' | 'generated';
  /** Optional sound effect config. Plays at [SFX] marker in text. */
  sfx?: {
    /** Filename in /rookie-sfx/ (e.g. 'train-horn.mp3') */
    file: string;
    /** How long to play the SFX in ms. Clips the audio at this point. */
    duration?: number;
    /** ms to overlap with END of previous speech (SFX starts before TTS finishes). 0 = wait for speech to end. */
    overlap?: number;
    /** ms to wait AFTER speech ends before starting SFX (ignored if overlap > 0). */
    delay?: number;
    /** ms to wait after SFX ends before starting part 2 speech. */
    pauseAfter?: number;
  };
}

export interface QueueContext {
  beat: Beat;
  evalMood: EvalMood;
  event: GameEvent;
  movedBy: 'player' | 'rookie';
  moveNumber: number;
  activeThreadId: string | null;
  playerName: string;
  playerColor?: 'white' | 'black';
  capturedPiece?: string; // 'pawn', 'knight', etc.
  movedPiece?: string; // 'pawn', 'knight', etc.
  /** Net material swing from a capture sequence (positive = player gained) */
  materialSwing?: number;
  /** Number of captures in a capture sequence */
  captureCount?: number;
}

export interface QueueState {
  /** Lines used this game -- drained, can't repeat */
  usedThisGame: Set<string>;
  /** Lines used in recent games -- lower priority but not blocked */
  usedRecently: Set<string>;
  /** Move numbers when quips were spoken — for rolling window limit */
  quipMoves: number[];
}

/** Max quips allowed within a rolling WINDOW_SIZE-move window */
const WINDOW_MAX_QUIPS = 4;
const WINDOW_SIZE = 10;
const RECENTLY_USED_PENALTY = -30;
const EVENT_MATCH_BONUS = 20;
const THREAD_MATCH_BONUS = 10;
const DEFAULT_GENERATED_PRIORITY = 90;

/** Beats that don't count toward the quip limit */
const UNLIMITED_BEATS = new Set<Beat>(['game_end', 'post_game']);

/** Create initial queue state */
export function createQueueState(): QueueState {
  return {
    usedThisGame: new Set(),
    usedRecently: new Set(),
    quipMoves: [],
  };
}

/** Check if we've hit the rolling window limit for a given move number */
export function isAtLimit(state: QueueState, moveNumber?: number): boolean {
  if (moveNumber === undefined) return false;
  const windowStart = moveNumber - WINDOW_SIZE;
  const quipsInWindow = state.quipMoves.filter((m) => m > windowStart).length;
  return quipsInWindow >= WINDOW_MAX_QUIPS;
}

/** Substitute placeholders in line text */
export function substitutePlaceholders(text: string, context: QueueContext): string {
  return text
    .replace(/\{name\}/g, context.playerName)
    .replace(/\{piece\}/g, context.capturedPiece ?? 'piece')
    .replace(/\{swing\}/g, String(Math.abs(context.materialSwing ?? 0)))
    .replace(/\{captures\}/g, String(context.captureCount ?? 0));
}

/** Check if a single line's conditions match the current context */
function matchesConditions(line: SpeechLine, context: QueueContext): boolean {
  const c = line.conditions;

  // Beat must match
  if (!c.beats.includes(context.beat)) return false;

  // Eval mood filter (empty = any)
  if (c.evalMoods && c.evalMoods.length > 0 && !c.evalMoods.includes(context.evalMood)) {
    return false;
  }

  // Event filter (empty = any)
  if (c.events && c.events.length > 0 && !c.events.includes(context.event)) {
    return false;
  }

  // movedBy filter
  if (c.movedBy && c.movedBy !== context.movedBy) return false;

  // playerColor filter
  if (c.playerColor && c.playerColor !== context.playerColor) return false;

  // Moved piece filter
  if (c.movedPiece && c.movedPiece !== context.movedPiece) return false;

  // Move number range
  if (c.minMove !== undefined && context.moveNumber < c.minMove) return false;
  if (c.maxMove !== undefined && context.moveNumber > c.maxMove) return false;

  // Thread filter: if line requires a thread, it must be active
  if (c.threadId && c.threadId !== context.activeThreadId) return false;

  return true;
}

/** Score a valid line in context */
function scoreLine(line: SpeechLine, context: QueueContext, state: QueueState): number {
  let score = line.priority;

  // Bonus for specific event match (not 'none')
  if (
    line.conditions.events &&
    line.conditions.events.length > 0 &&
    context.event !== 'none' &&
    line.conditions.events.includes(context.event)
  ) {
    score += EVENT_MATCH_BONUS;
  }

  // Bonus for matching active thread
  if (line.conditions.threadId && line.conditions.threadId === context.activeThreadId) {
    score += THREAD_MATCH_BONUS;
  }

  // Penalty for recently used (cross-game)
  if (state.usedRecently.has(line.id)) {
    score += RECENTLY_USED_PENALTY;
  }

  return score;
}

/**
 * Score and select the best line from the pool.
 * Returns null if no valid lines or quip limit reached.
 * Automatically drains the selected line.
 */
export function selectLine(
  pool: SpeechLine[],
  context: QueueContext,
  state: QueueState,
): { line: SpeechLine; text: string; templateText: string } | null {
  const isUnlimitedBeat = UNLIMITED_BEATS.has(context.beat);

  // Check rolling window limit (game_end and post_game bypass it)
  if (!isUnlimitedBeat && isAtLimit(state, context.moveNumber)) return null;

  // Filter: conditions match AND not drained this game
  const allMatching = pool.filter(
    (line) => !state.usedThisGame.has(line.id) && matchesConditions(line, context),
  );

  if (allMatching.length === 0) return null;

  // Prefer fresh lines over recently-used ones. Only fall back to recent if no fresh exist.
  const fresh = allMatching.filter((line) => !state.usedRecently.has(line.id));
  const candidates = fresh.length > 0 ? fresh : allMatching;

  // Score each candidate
  const scored = candidates.map((line) => ({
    line,
    score: scoreLine(line, context, state),
  }));

  // Find max score
  const maxScore = Math.max(...scored.map((s) => s.score));

  // Collect ties
  const tied = scored.filter((s) => s.score === maxScore);

  // Random tiebreak
  const winner = tied[Math.floor(Math.random() * tied.length)];

  // Drain: mark as used this game
  state.usedThisGame.add(winner.line.id);

  // Record move number for rolling window (only for limited beats)
  if (!isUnlimitedBeat && context.moveNumber !== undefined) {
    state.quipMoves.push(context.moveNumber);
  }

  const text = substitutePlaceholders(winner.line.text, context);

  return { line: winner.line, text, templateText: winner.line.text };
}

/** Add a dynamically generated line (from Claude) to the pool */
export function createGeneratedLine(
  text: string,
  beat: Beat,
  priority: number = DEFAULT_GENERATED_PRIORITY,
): SpeechLine {
  return {
    id: `gen_${beat}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text,
    conditions: { beats: [beat] },
    priority,
    source: 'generated',
  };
}

/** Transfer usedThisGame to usedRecently for cross-game memory */
export function endGame(state: QueueState): QueueState {
  const usedRecently = new Set(state.usedRecently);
  state.usedThisGame.forEach((id) => {
    usedRecently.add(id);
  });

  return {
    usedThisGame: new Set(),
    usedRecently,
    quipMoves: [],
  };
}
