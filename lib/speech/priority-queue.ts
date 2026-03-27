// Priority queue engine for Rookie's speech system.
// Hades-style dialogue queue: every line has preconditions and a priority score.
// Pool of possible lines, scored and filtered per context. Once said, drained for the game.

import { type Beat, type EvalMood } from '@/lib/speech/beat-sheet';
export type { Beat, EvalMood };
export type GameEvent = 'capture' | 'check' | 'checkmate' | 'castle' | 'blunder' | 'great_move' | 'stalemate' | 'capture_sequence' | 'resign' | 'none';

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
  text: string; // may contain {name}, {piece} placeholders
  conditions: LineConditions;
  /** Base priority (higher = more likely to be selected). 1-100 scale. */
  priority: number;
  /** Source: 'authored' (template) or 'generated' (Claude API) */
  source: 'authored' | 'generated';
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
  /** Count of quips spoken this game */
  quipCount: number;
  /** Max quips per game */
  maxQuips: number;
}

const DEFAULT_MAX_QUIPS = 5;
const RECENTLY_USED_PENALTY = -30;
const EVENT_MATCH_BONUS = 20;
const THREAD_MATCH_BONUS = 10;
const DEFAULT_GENERATED_PRIORITY = 90;

/** Beats that don't count toward the quip limit */
const UNLIMITED_BEATS = new Set<Beat>(['game_end', 'post_game']);

/** Create initial queue state */
export function createQueueState(maxQuips: number = DEFAULT_MAX_QUIPS): QueueState {
  return {
    usedThisGame: new Set(),
    usedRecently: new Set(),
    quipCount: 0,
    maxQuips,
  };
}

/** Check if we've hit the quip limit */
export function isAtLimit(state: QueueState): boolean {
  return state.quipCount >= state.maxQuips;
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

  // Check quip limit (game_end and post_game bypass it)
  if (!isUnlimitedBeat && isAtLimit(state)) return null;

  // Filter: conditions match AND not drained this game
  const candidates = pool.filter(
    (line) => !state.usedThisGame.has(line.id) && matchesConditions(line, context),
  );

  if (candidates.length === 0) return null;

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

  // Increment quip count (only for limited beats)
  if (!isUnlimitedBeat) {
    state.quipCount++;
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
    quipCount: 0,
    maxQuips: state.maxQuips,
  };
}
