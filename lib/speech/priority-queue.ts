// Priority queue engine for Rookie's speech system.
// Hades-style dialogue queue: every line has preconditions and a priority score.
// Pool of possible lines, scored and filtered per context. Once said, drained for the game.

import { type Beat, type EvalMood } from '@/lib/speech/beat-sheet';
import { renderLine } from '@/lib/speech/sanitize';
export type { Beat, EvalMood };
export type GameEvent = 'capture' | 'check' | 'checkmate' | 'castle' | 'blunder' | 'great_move' | 'stalemate' | 'capture_sequence' | 'resign' | 'mood_change' | 'alarm' | 'none';

export type Tone = 'polite' | 'baseline' | 'spicy';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type BreadcrumbType = 'daily' | 'opening' | 'lesson' | 'play';

export interface LineConditions {
  /** Which beats this line is valid for. May be empty for category-only (touchpoint) lines. */
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
  /** Personality tone gating (wired via CHE-290) */
  tone?: Tone;
  /** Restrict to a specific time-of-day bucket */
  timeOfDay?: TimeOfDay;
  /** Restrict to specific days (0=Sun..6=Sat). Empty/undefined = any */
  dayOfWeek?: number[];
  /** Restrict to specific breadcrumb origin */
  breadcrumbType?: BreadcrumbType;
}

export interface SpeechLine {
  id: string;
  text: string; // may contain {name}, {piece} placeholders. Use [SFX] to mark sound effect insertion point.
  /** Game-context conditions. Required for gameplay quips, omit for touchpoint content (greetings, errors, etc). */
  conditions?: LineConditions;
  /** Non-game content category. Format: 'type' or 'type:subtype' (e.g. 'greeting:morning', 'error', 'transition:learn'). */
  category?: string;
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
  /** Score from a completed daily/lesson activity */
  score?: number;
  /** Total possible score from a completed daily/lesson activity */
  total?: number;
  /** Name of the opening the user just finished */
  openingName?: string;
  /** Name of the lesson the user just finished */
  lessonName?: string;
  /** Net material swing from a capture sequence (positive = player gained) */
  materialSwing?: number;
  /** Number of captures in a capture sequence */
  captureCount?: number;
  /** Personality tone gate */
  tone?: Tone;
  /** Current time-of-day bucket */
  timeOfDay?: TimeOfDay;
  /** Current day-of-week (0=Sun..6=Sat) */
  dayOfWeek?: number;
  /** Most recent breadcrumb type (where the user just came from) */
  breadcrumbType?: BreadcrumbType;
  /** Talkativeness level (1-5) — controls rolling window throttle */
  talkativenessLevel?: number;
}

export interface QueueState {
  /** Lines used this game -- drained, can't repeat */
  usedThisGame: Set<string>;
  /** Lines used in recent games -- lower priority but not blocked */
  usedRecently: Set<string>;
  /** Move numbers when quips were spoken — for rolling window limit */
  quipMoves: number[];
}

/** Default rolling window limits (talkativeness level 3 = baseline) */
const WINDOW_MAX_QUIPS = 2;
const WINDOW_SIZE = 16;

/** Talkativeness level → rolling window config (1=silent, 5=nonstop) */
export function windowForTalkativeness(level: number): { size: number; max: number } {
  switch (level) {
    case 1: return { size: 30, max: 1 };
    case 2: return { size: 16, max: 1 };
    case 4: return { size: 16, max: 3 };
    case 5: return { size: 16, max: 4 };
    case 3:
    default: return { size: WINDOW_SIZE, max: WINDOW_MAX_QUIPS };
  }
}

/** Talkativeness level → min moves between in-game event quips */
export function cooldownForTalkativeness(level: number): number {
  switch (level) {
    case 1: return 20;
    case 2: return 12;
    case 4: return 5;
    case 5: return 2;
    case 3:
    default: return 8;
  }
}
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
export function isAtLimit(state: QueueState, moveNumber?: number, talkativenessLevel?: number): boolean {
  if (moveNumber === undefined) return false;
  const { size, max } = windowForTalkativeness(talkativenessLevel ?? 1);
  const windowStart = moveNumber - size;
  const quipsInWindow = state.quipMoves.filter((m) => m > windowStart).length;
  return quipsInWindow >= max;
}

/** Substitute placeholders in line text */
export function substitutePlaceholders(text: string, context: QueueContext): string {
  const withPieces = text
    .replace(/\{piece\}/g, context.capturedPiece ?? 'piece')
    .replace(/\{swing\}/g, String(Math.abs(context.materialSwing ?? 0)))
    .replace(/\{captures\}/g, String(context.captureCount ?? 0))
    .replace(/\{score\}/g, String(context.score ?? 0))
    .replace(/\{total\}/g, String(context.total ?? 0))
    .replace(/\{openingName\}/g, context.openingName ?? '')
    .replace(/\{lessonName\}/g, context.lessonName ?? '');
  return renderLine(withPieces, context.playerName);
}

/** Check if a single line's conditions match the current context */
function matchesConditions(line: SpeechLine, context: QueueContext): boolean {
  // Category-only lines (greetings, errors, etc) never match game context
  if (!line.conditions) return false;
  const c = line.conditions;

  // Beat must match. Empty beats = category-only line, never matches game context.
  if (!c.beats || c.beats.length === 0) return false;
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

  // Tone filter (personality gauge, CHE-290)
  if (c.tone && context.tone && c.tone !== context.tone) return false;

  // Time-of-day filter
  if (c.timeOfDay && context.timeOfDay && c.timeOfDay !== context.timeOfDay) return false;

  // Day-of-week filter
  if (c.dayOfWeek && c.dayOfWeek.length > 0 && context.dayOfWeek !== undefined && !c.dayOfWeek.includes(context.dayOfWeek)) {
    return false;
  }

  // Breadcrumb filter
  if (c.breadcrumbType && context.breadcrumbType && c.breadcrumbType !== context.breadcrumbType) return false;

  return true;
}

/** Score a valid line in context */
function scoreLine(line: SpeechLine, context: QueueContext, state: QueueState): number {
  let score = line.priority;

  const c = line.conditions;

  // Bonus for specific event match (not 'none')
  if (
    c?.events &&
    c.events.length > 0 &&
    context.event !== 'none' &&
    c.events.includes(context.event)
  ) {
    score += EVENT_MATCH_BONUS;
  }

  // Bonus for matching active thread
  if (c?.threadId && c.threadId === context.activeThreadId) {
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
  if (!isUnlimitedBeat && isAtLimit(state, context.moveNumber, context.talkativenessLevel)) return null;

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

/**
 * Select a random line by category from a pool.
 * Uses the same dedup ring as game quips (usedRecently).
 * Category supports prefix matching: 'greeting' matches 'greeting:morning', 'greeting:evening', etc.
 *
 * `substitutions` allows contextual placeholder values ({score}, {total}, {openingName}, {lessonName}).
 */
export function selectByCategory(
  pool: SpeechLine[],
  category: string,
  state?: QueueState,
  playerName?: string,
  substitutions?: Partial<QueueContext>,
): { line: SpeechLine; text: string } | null {
  const tone = substitutions?.tone;
  const toneOk = (line: SpeechLine): boolean => {
    const t = line.conditions?.tone;
    return !t || !tone || t === tone;
  };
  const matching = pool.filter((line) => {
    if (!line.category) return false;
    if (line.category !== category && !line.category.startsWith(category + ':')) return false;
    if (state?.usedRecently.has(line.id)) return false;
    if (!toneOk(line)) return false;
    return true;
  });

  const render = (text: string): string => {
    if (substitutions) {
      const ctx: QueueContext = {
        beat: 'opening',
        evalMood: 'even',
        event: 'none',
        movedBy: 'rookie',
        moveNumber: 0,
        activeThreadId: null,
        playerName: playerName ?? '',
        ...substitutions,
      };
      return substitutePlaceholders(text, ctx);
    }
    return renderLine(text, playerName);
  };

  if (matching.length === 0) {
    // Fall back to recently used if pool exhausted
    const fallback = pool.filter(
      (line) =>
        (line.category === category || line.category?.startsWith(category + ':')) &&
        toneOk(line),
    );
    if (fallback.length === 0) return null;
    const pick = fallback[Math.floor(Math.random() * fallback.length)];
    return { line: pick, text: render(pick.text) };
  }

  const pick = matching[Math.floor(Math.random() * matching.length)];
  if (state) state.usedRecently.add(pick.id);
  return { line: pick, text: render(pick.text) };
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
