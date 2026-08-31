'use client';

/**
 * useGameReview — post-game review data for surfaces that did NOT collect
 * evals during play (e.g. the Chess Boxing bout, which never runs the eval
 * bar mid-fight).
 *
 * start() evaluates every position with Stockfish, classifies the moves
 * (lib/game-eval — the same math /play uses), extracts eval-based key
 * moments, then fetches Claude coach commentary from /api/coach-review.
 * All of it lands incrementally, so <GameReview> can open mid-analysis and
 * fill in as data arrives — exactly like /play's review does with coachReady.
 *
 * /play itself keeps its live-eval path (instant analysis from evals gathered
 * during the game) — this hook is for everyone who doesn't have that.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import {
  analyzeGameMoves,
  extractKeyMoments,
  type GameAnalysis,
  type KeyMoment,
  type PositionEval,
} from '@/lib/game-eval';
import {
  fetchCoachReview,
  START_FEN,
  type ReviewMove,
} from '@/lib/review/review-core';
import { applyBookMoves } from '@/lib/review/book-moves';

/** Depth per position. /play's live evals run 10, its deep pass 18 — 14 is
 * the middle ground: close to deep quality, fast enough to finish while the
 * result card is still on screen. */
const REVIEW_DEPTH = 14;

export interface GameReviewData {
  analysis: GameAnalysis | null;
  isAnalyzing: boolean;
  /** 0-100 across the eval pass. */
  progress: number;
  /** Blunder/mistake moments only — same filter as /play's review. */
  keyMoments: KeyMoment[];
  /** One eval per position: [start, after move 1, after move 2, ...]. */
  positionEvals: PositionEval[];
  coachReady: boolean;
  coachMoves: Record<string, string>;
  coachSummary: string | null;
  coachTakeaway: string | null;
}

export interface StartGameReviewArgs {
  moves: ReviewMove[];
  playerColor: 'white' | 'black';
  playerElo: number;
  result: 'win' | 'loss' | 'draw';
  playerName?: string;
  startFen?: string;
}

const EMPTY: GameReviewData = {
  analysis: null,
  isAnalyzing: false,
  progress: 0,
  keyMoments: [],
  positionEvals: [],
  coachReady: false,
  coachMoves: {},
  coachSummary: null,
  coachTakeaway: null,
};

export function useGameReview(): GameReviewData & {
  /** Kick off the full pipeline. Idempotent until reset() — safe in effects. */
  start: (args: StartGameReviewArgs) => void;
  /** Cancel any in-flight work and clear all data (call on rematch). */
  reset: () => void;
} {
  const [data, setData] = useState<GameReviewData>(EMPTY);
  const startedRef = useRef(false);
  // Monotonic run token: bumping it orphans any in-flight analysis loop.
  // A plain boolean breaks under StrictMode's dev double-mount — the first
  // mount's cleanup would cancel forever while startedRef blocked a restart.
  const runIdRef = useRef(0);

  const reset = useCallback(() => {
    runIdRef.current++;
    startedRef.current = false;
    setData(EMPTY);
  }, []);

  // Cancel in-flight analysis when the owning page unmounts — and clear
  // startedRef so a StrictMode remount (or back-navigation) can start fresh.
  useEffect(() => {
    return () => {
      runIdRef.current++;
      startedRef.current = false;
    };
  }, []);

  const start = useCallback((args: StartGameReviewArgs) => {
    if (startedRef.current || args.moves.length === 0) return;
    startedRef.current = true;
    const runId = ++runIdRef.current;
    const cancelled = () => runIdRef.current !== runId;
    setData({ ...EMPTY, isAnalyzing: true });

    (async () => {
      try {
        await stockfish.init();

        const startFen = args.startFen ?? START_FEN;
        const fens = [startFen, ...args.moves.map((m) => m.fenAfter)];
        const evals: PositionEval[] = [];
        for (let i = 0; i < fens.length; i++) {
          if (cancelled()) return;
          const result = await stockfish.getFullEval(fens[i], REVIEW_DEPTH);
          evals.push({
            cp: result?.cp ?? null,
            mate: result?.mate ?? null,
            bestMove: result?.bestMove ?? null,
            bestLine: [],
            depth: REVIEW_DEPTH,
          });
          const progress = Math.round(((i + 1) / fens.length) * 100);
          if (!cancelled()) setData((prev) => ({ ...prev, progress }));
        }
        if (cancelled()) return;

        const moveInfos = args.moves.map((m) => ({
          san: m.san,
          movedBy: m.movedBy,
          moveNumber: m.moveNumber,
          fenAfter: m.fenAfter,
        }));
        const analysis = applyBookMoves(
          analyzeGameMoves(evals, moveInfos, args.playerColor, startFen),
          args.moves.map((m) => m.san),
          args.playerColor,
        );
        // Same filter as /play: only blunder/mistake moments drive the review.
        const keyMoments = extractKeyMoments(analysis, args.moves, args.playerName)
          .filter((m) => m.type !== 'best-move' && m.type !== 'turning-point');

        setData((prev) => ({
          ...prev,
          analysis,
          keyMoments,
          positionEvals: evals,
          isAnalyzing: false,
          progress: 100,
        }));

        // Claude commentary — non-blocking garnish, review works without it.
        const review = await fetchCoachReview({
          analysis,
          evals,
          moves: args.moves,
          playerColor: args.playerColor,
          playerElo: args.playerElo,
          result: args.result,
          startFen,
        });
        if (cancelled() || !review) return;
        setData((prev) => ({
          ...prev,
          coachMoves: review.moves,
          coachSummary: review.summary,
          coachTakeaway: review.takeaway,
          coachReady: true,
        }));
      } catch (err) {
        console.error('[useGameReview] analysis failed:', err);
        setData((prev) => ({ ...prev, isAnalyzing: false }));
      }
    })();
  }, []);

  return { ...data, start, reset };
}
