/**
 * useRookieMood — Unified mood system for Rookie.
 *
 * Three mood sources, one output:
 *   1. Eval-based baseline — Stockfish eval → win% → mood zone (calm default)
 *   2. Event overrides — check, checkmate, stalemate (high-priority, temporary)
 *   3. Narrative overrides — 6-layer engine mood at turning points
 *
 * Hold logic: mood holds for HOLD_MOVES moves before the baseline can change it.
 * High-priority events (checkmate, check, stalemate) bypass the hold.
 *
 * @see CHE-155 https://linear.app/chesspathapp/issue/CHE-155
 */

import { useRef, useCallback, useState } from 'react';
import type { RookieMood, AlarmVariant } from '@/lib/rookie-os/types';
import { evalToRookieMood, type EvalMoodResult } from '@/lib/rookie-mood-eval';
import { getEvalMood, type EvalMood } from '@/lib/speech/beat-sheet';

// ════════════════════════════════
// CONSTANTS
// ════════════════════════════════

/** How many moves a mood holds before eval-based baseline can overwrite it */
const HOLD_MOVES = 4;

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface MoodUpdate {
  mood: RookieMood;
  reason: string;
  source: 'eval' | 'event' | 'narrative';
  applied: boolean;
  rookieWinPercent: number;
  isSwing: boolean;
}

type GameEvent = 'check' | 'checkmate' | 'stalemate' | 'draw' | 'none';

// ════════════════════════════════
// HOOK
// ════════════════════════════════

export function useRookieMood(playerColor: 'white' | 'black') {
  const [mood, setMood] = useState<RookieMood>('neutral');
  const [alarmVariant, setAlarmVariant] = useState<AlarmVariant | null>(null);

  // Internal state
  const prevMoodRef = useRef<RookieMood>('neutral');
  const moodSetAtMoveRef = useRef(0);
  const prevRookieWpRef = useRef<number | undefined>(undefined);
  const prevEvalMoodRef = useRef<EvalMood>('even');
  const moveNumRef = useRef(0);

  /**
   * Apply a mood change. Handles the hold logic and state updates.
   * Returns whether the mood was actually applied.
   */
  const applyMood = useCallback((
    newMood: RookieMood,
    isHighPriority: boolean,
  ): boolean => {
    const movesSinceChange = moveNumRef.current - moodSetAtMoveRef.current;

    // Hold logic: non-high-priority changes are blocked during hold period
    if (!isHighPriority && newMood !== prevMoodRef.current && movesSinceChange < HOLD_MOVES) {
      return false;
    }

    // No-op if same mood
    if (newMood === prevMoodRef.current) return false;

    setMood(newMood);
    prevMoodRef.current = newMood;
    moodSetAtMoveRef.current = moveNumRef.current;
    return true;
  }, []);

  /**
   * Process a Stockfish eval update. Call after every position eval.
   * Returns the mood result (even if not applied due to hold).
   */
  const onEval = useCallback((
    cp: number | null,
    mate: number | null,
    currentMoveNum: number,
  ): MoodUpdate => {
    moveNumRef.current = currentMoveNum;
    const rookieColor = playerColor === 'white' ? 'black' : 'white';
    const prevWp = prevRookieWpRef.current;

    const result = evalToRookieMood(cp, mate, rookieColor, prevWp);
    prevRookieWpRef.current = result.rookieWinPercent;

    const applied = applyMood(result.mood, false);

    // Update alarm variant — sticky until mood leaves alarm territory
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
      isSwing: result.isSwing,
    };
  }, [playerColor, applyMood]);

  /**
   * Process a game event (check, checkmate, stalemate).
   * High-priority events bypass the hold timer.
   */
  const onGameEvent = useCallback((
    event: GameEvent,
    movedBy: 'player' | 'rookie',
    currentMoveNum: number,
  ): MoodUpdate | null => {
    moveNumRef.current = currentMoveNum;

    let newMood: RookieMood = 'neutral';
    let isHighPriority = false;
    let reason = '';

    switch (event) {
      case 'checkmate': {
        // Who lost? The side whose turn it is (they're in checkmate)
        const rookieLost = (movedBy === 'player'); // player just checkmated Rookie
        newMood = rookieLost ? 'angry' : 'smug';
        isHighPriority = true;
        reason = rookieLost ? 'Got checkmated' : 'Delivered checkmate';
        break;
      }
      case 'stalemate':
      case 'draw':
        newMood = 'nervous';
        isHighPriority = true;
        reason = event === 'stalemate' ? 'Stalemate' : 'Draw';
        break;
      case 'check':
        newMood = movedBy === 'player' ? 'surprised' : 'smug';
        isHighPriority = true;
        reason = movedBy === 'player' ? 'Player checked Rookie' : 'Rookie gave check';
        break;
      case 'none':
        return null;
    }

    const applied = applyMood(newMood, isHighPriority);
    if (!applied) return null;

    return {
      mood: newMood,
      reason,
      source: 'event',
      applied: true,
      rookieWinPercent: prevRookieWpRef.current ?? 50,
      isSwing: false,
    };
  }, [applyMood]);

  /**
   * Process a mood from the narrative engine.
   * Narrative mood changes are high-priority (the engine sees full context).
   */
  const onNarrativeMood = useCallback((
    narrativeMood: RookieMood,
    moodChanged: boolean,
    currentMoveNum: number,
  ): boolean => {
    if (!moodChanged) return false;
    moveNumRef.current = currentMoveNum;
    return applyMood(narrativeMood, true);
  }, [applyMood]);

  /**
   * Check if the eval mood zone changed (even/winning/losing/desperate).
   * Used by the speech system for mood-change quip triggers.
   */
  const checkEvalMoodZone = useCallback((rookieWinPercent: number): boolean => {
    const newZone = getEvalMood(rookieWinPercent);
    if (newZone !== prevEvalMoodRef.current) {
      prevEvalMoodRef.current = newZone;
      return true;
    }
    return false;
  }, []);

  /** Get current Rookie win% (for speech system and other consumers) */
  const getRookieWinPercent = useCallback((): number => {
    return prevRookieWpRef.current ?? 50;
  }, []);

  /** Get previous Rookie win% (for swing detection) */
  const getPrevRookieWinPercent = useCallback((): number | undefined => {
    return prevRookieWpRef.current;
  }, []);

  /** Reset for new game */
  const reset = useCallback(() => {
    setMood('neutral');
    setAlarmVariant(null);
    prevMoodRef.current = 'neutral';
    moodSetAtMoveRef.current = 0;
    prevRookieWpRef.current = undefined;
    prevEvalMoodRef.current = 'even';
    moveNumRef.current = 0;
  }, []);

  return {
    /** Current mood (reactive state — triggers re-renders) */
    mood,
    /** Active alarm animation variant (null when not in alarm territory) */
    alarmVariant,
    /** Process Stockfish eval → baseline mood */
    onEval,
    /** Process game events (check, checkmate, etc.) → override mood */
    onGameEvent,
    /** Process narrative engine mood → override mood */
    onNarrativeMood,
    /** Check if eval mood zone changed (for speech triggers) */
    checkEvalMoodZone,
    /** Get current Rookie win% */
    getRookieWinPercent,
    /** Get previous Rookie win% */
    getPrevRookieWinPercent,
    /** Reset for new game */
    reset,
  };
}
