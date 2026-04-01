/**
 * useRookieMood — Unified mood system for Rookie.
 *
 * Priority order (eval is king):
 *   1. Eval-based baseline — Stockfish cp → pawn units → mood zone (PRIMARY)
 *   2. Event modifiers — check, checkmate, stalemate (CONTEXTUAL, not override)
 *   3. Narrative nudges — 6-layer engine mood at turning points (TERTIARY)
 *
 * Events are resolved against the eval baseline:
 *   - Terminal events (checkmate, stalemate) always override (game is ending)
 *   - Check while losing badly → base mood stays (Rookie is too stressed)
 *   - Check while equal/winning → smug or surprised
 *
 * Hold system: source-specific decay instead of universal 4-move hold.
 *   - Eval: 2 moves (overridden by zone change or terminal events)
 *   - Event: 1 move (eval reasserts quickly)
 *   - Narrative: 2 moves (overridden by zone change or terminal events)
 *
 * @see CHE-155 https://linear.app/chesspathapp/issue/CHE-155
 */

import { useRef, useCallback, useState } from 'react';
import type { RookieMood, AlarmVariant } from '@/lib/rookie-os/types';
import {
  evalToRookieMood,
  getEvalMood,
  getEvalZone,
  getRookiePawns,
  EVAL_ZONES,
  type EvalMoodResult,
  type EvalMood,
} from '@/lib/eval-zones';
import { evalToWinPercent, winPercentForColor } from '@/lib/game-eval';

// ════════════════════════════════
// CONSTANTS
// ════════════════════════════════

/** How many moves each mood source holds before it can be overwritten */
const HOLD_MOVES = {
  eval: 2,
  event: 1,
  narrative: 2,
} as const;

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface MoodUpdate {
  mood: RookieMood;
  reason: string;
  source: 'eval' | 'event' | 'narrative';
  applied: boolean;
  rookieWinPercent: number;
  rookiePawns: number;
  isSwing: boolean;
}

type MoodSource = 'eval' | 'event' | 'narrative';
type GameEvent = 'check' | 'checkmate' | 'stalemate' | 'draw' | 'none';

// ════════════════════════════════
// CONTEXTUAL EVENT RESOLUTION
// ════════════════════════════════

/**
 * Resolve what mood an event produces given the current eval baseline.
 * Returns null if the event should be ignored (base mood stays).
 */
function resolveEventMood(
  event: GameEvent,
  movedBy: 'player' | 'rookie',
  rookiePawns: number,
): { mood: RookieMood; reason: string } | null {
  // Terminal events always override — game is ending
  if (event === 'checkmate') {
    const rookieLost = movedBy === 'player';
    return {
      mood: rookieLost ? 'angry' : 'smug',
      reason: rookieLost ? 'Got checkmated' : 'Delivered checkmate',
    };
  }
  if (event === 'stalemate' || event === 'draw') {
    return {
      mood: 'nervous',
      reason: event === 'stalemate' ? 'Stalemate' : 'Draw',
    };
  }

  // Check — contextual based on eval
  if (event === 'check') {
    // Rookie is losing badly — too stressed to feel smug about a check
    if (rookiePawns < -EVAL_ZONES.ADVANTAGE) {
      return null; // base mood stays
    }
    // Rookie is slightly losing — brief surprise
    if (rookiePawns < -EVAL_ZONES.SLIGHT) {
      return {
        mood: 'surprised',
        reason: movedBy === 'player' ? 'Player checked while Rookie is down' : 'Desperate check',
      };
    }
    // Rookie is equal or winning
    return {
      mood: movedBy === 'player' ? 'surprised' : 'smug',
      reason: movedBy === 'player' ? 'Player checked Rookie' : 'Rookie gave check',
    };
  }

  return null;
}

// ════════════════════════════════
// HOOK
// ════════════════════════════════

export function useRookieMood(playerColor: 'white' | 'black') {
  const [mood, setMood] = useState<RookieMood>('neutral');
  const [alarmVariant, setAlarmVariant] = useState<AlarmVariant | null>(null);

  // Internal state
  const prevMoodRef = useRef<RookieMood>('neutral');
  const moodSourceRef = useRef<MoodSource>('eval');
  const moodSetAtMoveRef = useRef(0);
  const prevRookiePawnsRef = useRef<number | undefined>(undefined);
  const prevEvalMoodRef = useRef<EvalMood>('even');
  const prevEvalZoneRef = useRef<string>('equal');
  const moveNumRef = useRef(0);
  /** Current rookiePawns — available for event resolution */
  const rookiePawnsRef = useRef(0);

  /**
   * Apply a mood change with source-specific hold logic.
   * Returns whether the mood was actually applied.
   */
  const applyMood = useCallback((
    newMood: RookieMood,
    source: MoodSource,
    forceOverride: boolean = false,
  ): boolean => {
    const movesSinceChange = moveNumRef.current - moodSetAtMoveRef.current;
    const currentHold = HOLD_MOVES[moodSourceRef.current];

    // Force override (terminal events, zone changes) bypasses hold
    if (!forceOverride && newMood !== prevMoodRef.current && movesSinceChange < currentHold) {
      return false;
    }

    // No-op if same mood
    if (newMood === prevMoodRef.current) return false;

    setMood(newMood);
    prevMoodRef.current = newMood;
    moodSourceRef.current = source;
    moodSetAtMoveRef.current = moveNumRef.current;
    return true;
  }, []);

  /**
   * Process a Stockfish eval update. Call after every position eval.
   * Eval is the PRIMARY mood driver — flows through fastest.
   */
  const onEval = useCallback((
    cp: number | null,
    mate: number | null,
    currentMoveNum: number,
  ): MoodUpdate => {
    moveNumRef.current = currentMoveNum;
    const rookieColor = playerColor === 'white' ? 'black' : 'white';
    const prevPawns = prevRookiePawnsRef.current;

    // Compute win% for downstream consumers (eval bar, analysis)
    const whiteWp = evalToWinPercent(cp, mate);

    const result = evalToRookieMood(cp, mate, rookieColor, prevPawns, whiteWp);
    prevRookiePawnsRef.current = result.rookiePawns;
    rookiePawnsRef.current = result.rookiePawns;

    // Check if eval zone changed — zone changes force through hold
    const newZone = getEvalZone(result.rookiePawns).zone;
    const zoneChanged = newZone !== prevEvalZoneRef.current;
    prevEvalZoneRef.current = newZone;

    // Eval is primary — zone changes and swings force override
    const forceOverride = zoneChanged || result.isSwing;
    const applied = applyMood(result.mood, 'eval', forceOverride);

    // Update alarm variant
    if (result.alarmVariant) {
      setAlarmVariant(result.alarmVariant);
    } else if (applied) {
      setAlarmVariant(null);
    }

    return {
      mood: result.mood,
      reason: result.reason,
      source: 'eval',
      applied,
      rookieWinPercent: result.rookieWinPercent,
      rookiePawns: result.rookiePawns,
      isSwing: result.isSwing,
    };
  }, [playerColor, applyMood]);

  /**
   * Process a game event (check, checkmate, stalemate).
   * Events are CONTEXTUAL — resolved against the eval baseline.
   * Terminal events force override. Non-terminal events respect game state.
   */
  const onGameEvent = useCallback((
    event: GameEvent,
    movedBy: 'player' | 'rookie',
    currentMoveNum: number,
  ): MoodUpdate | null => {
    moveNumRef.current = currentMoveNum;

    const resolved = resolveEventMood(event, movedBy, rookiePawnsRef.current);
    if (!resolved) return null; // event suppressed by eval context

    const isTerminal = event === 'checkmate' || event === 'stalemate' || event === 'draw';
    const applied = applyMood(resolved.mood, 'event', isTerminal);
    if (!applied) return null;

    return {
      mood: resolved.mood,
      reason: resolved.reason,
      source: 'event',
      applied: true,
      rookieWinPercent: winPercentForColor(
        evalToWinPercent(null, null),
        playerColor === 'white' ? 'black' : 'white',
      ),
      rookiePawns: rookiePawnsRef.current,
      isSwing: false,
    };
  }, [applyMood, playerColor]);

  /**
   * Process a mood from the narrative engine.
   * Narrative is TERTIARY — can nudge but shouldn't contradict game state.
   */
  const onNarrativeMood = useCallback((
    narrativeMood: RookieMood,
    moodChanged: boolean,
    currentMoveNum: number,
  ): boolean => {
    if (!moodChanged) return false;
    moveNumRef.current = currentMoveNum;
    return applyMood(narrativeMood, 'narrative', false);
  }, [applyMood]);

  /**
   * Check if the eval mood zone changed (even/winning/losing/desperate).
   * Used by the speech system for mood-change quip triggers.
   * Now uses pawn-based zones from eval-zones OSOT.
   */
  const checkEvalMoodZone = useCallback((rookiePawns: number): boolean => {
    const newZone = getEvalMood(rookiePawns);
    if (newZone !== prevEvalMoodRef.current) {
      prevEvalMoodRef.current = newZone;
      return true;
    }
    return false;
  }, []);

  /** Get current Rookie pawn eval */
  const getRookiePawns = useCallback((): number => {
    return rookiePawnsRef.current;
  }, []);

  /** Get current Rookie win% (for downstream consumers that still need it) */
  const getRookieWinPercent = useCallback((): number => {
    // Approximate from pawns — used for logging/display, not mood decisions
    const cp = rookiePawnsRef.current * 100;
    const rookieColor = playerColor === 'white' ? 'black' as const : 'white' as const;
    const whiteWp = evalToWinPercent(rookieColor === 'white' ? cp : -cp, null);
    return winPercentForColor(whiteWp, rookieColor);
  }, [playerColor]);

  /** Get previous Rookie pawn eval (for swing detection) */
  const getPrevRookiePawns = useCallback((): number | undefined => {
    return prevRookiePawnsRef.current;
  }, []);

  /** Reset for new game */
  const reset = useCallback(() => {
    setMood('neutral');
    setAlarmVariant(null);
    prevMoodRef.current = 'neutral';
    moodSourceRef.current = 'eval';
    moodSetAtMoveRef.current = 0;
    prevRookiePawnsRef.current = undefined;
    prevEvalMoodRef.current = 'even';
    prevEvalZoneRef.current = 'equal';
    moveNumRef.current = 0;
    rookiePawnsRef.current = 0;
  }, []);

  return {
    /** Current mood (reactive state — triggers re-renders) */
    mood,
    /** Active alarm animation variant (null when not in alarm territory) */
    alarmVariant,
    /** Process Stockfish eval → baseline mood (PRIMARY) */
    onEval,
    /** Process game events contextually against eval (SECONDARY) */
    onGameEvent,
    /** Process narrative engine mood (TERTIARY) */
    onNarrativeMood,
    /** Check if eval mood zone changed (for speech triggers) */
    checkEvalMoodZone,
    /** Get current Rookie pawn eval */
    getRookiePawns,
    /** Get current Rookie win% (for downstream compat) */
    getRookieWinPercent,
    /** Get previous Rookie pawn eval */
    getPrevRookiePawns,
    /** Reset for new game */
    reset,
  };
}
