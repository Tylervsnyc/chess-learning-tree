/**
 * useGameSession — hook for tracking puzzle sessions (lessons + Daily Rook).
 *
 * Drop into any puzzle page to capture rich data for Rookie's coaching.
 * Handles session lifecycle, puzzle recording, and async DB writes.
 *
 * Usage:
 *   const { recordPuzzleResult, endSession, sessionRef } = useGameSession('lesson', userId);
 *   // On each puzzle complete:
 *   recordPuzzleResult({ puzzleId, theme, rating, correct, firstAttemptSan, retryCount, timeMs });
 *   // On session end:
 *   const summary = await endSession();
 */

'use client';

import { useRef, useCallback } from 'react';
import { GameSession, PuzzleMoveRecord, SessionSummary } from '@/lib/game-session';

type SessionType = 'lesson' | 'daily-rook';

interface PuzzleResult {
  puzzleId: string;
  puzzleTheme: string;
  puzzleRating: number;
  correct: boolean;
  firstAttemptSan: string | null;
  retryCount: number;
  timeMs: number;
  fenAfter?: string;
}

export function useGameSession(type: SessionType, userId: string | null | undefined) {
  const sessionRef = useRef<GameSession | null>(null);
  const puzzleCountRef = useRef(0);

  /** Start a new session (call when lesson/daily-rook begins) */
  const startSession = useCallback(() => {
    if (!userId) return;
    sessionRef.current = new GameSession(type, userId);
    puzzleCountRef.current = 0;
  }, [type, userId]);

  /** Record a puzzle result within the session */
  const recordPuzzleResult = useCallback((result: PuzzleResult) => {
    const session = sessionRef.current;
    if (!session) return;

    puzzleCountRef.current++;

    const record: PuzzleMoveRecord = {
      moveNumber: puzzleCountRef.current,
      puzzleId: result.puzzleId,
      puzzleTheme: result.puzzleTheme,
      puzzleRating: result.puzzleRating,
      correct: result.correct,
      firstAttemptSan: result.firstAttemptSan,
      retryCount: result.retryCount,
      timeToMoveMs: result.timeMs,
      fenAfter: result.fenAfter,
    };

    session.recordPuzzle(record);
  }, []);

  /** End the session and write to DB. Returns summary or null. */
  const endSession = useCallback(async (): Promise<SessionSummary | null> => {
    const session = sessionRef.current;
    if (!session) return null;

    const summary = await session.end();
    sessionRef.current = null;
    return summary;
  }, []);

  return {
    startSession,
    recordPuzzleResult,
    endSession,
    sessionRef,
  };
}
