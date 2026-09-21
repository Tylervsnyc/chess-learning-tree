'use client';

import { useState, useCallback, useRef } from 'react';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { PositionEval, GameAnalysis, GRADE_DEPTH } from '@/lib/game-eval';
import { MoveRecord } from '@/lib/game-session';
import { gradeGame } from '@/lib/review/grade';

export interface PostGameAnalysisState {
  /** What the review board shows: the instant (live-eval) analysis until the
   *  graded pass lands, then the graded one. */
  analysis: GameAnalysis | null;
  /** The game's GRADES — set only by the graded pass. This is what gets saved
   *  and what the finish-screen tiles show, so the number never changes. */
  graded: GameAnalysis | null;
  isAnalyzing: boolean;
  progress: number; // 0-100
  error: string | null;
}

/**
 * Post-game analysis hook.
 *
 * `setInstantAnalysis()` — the evals collected during play (depth 10). Instant;
 *   drives the review board until the graded pass lands. Never grades.
 * `analyze()` — the graded pass: every position at GRADE_DEPTH through the one
 *   grading pipeline (lib/review/grade). Its result is the game's grades.
 */
export function usePostGameAnalysis() {
  const [state, setState] = useState<PostGameAnalysisState>({
    analysis: null,
    graded: null,
    isAnalyzing: false,
    progress: 0,
    error: null,
  });
  const cancelledRef = useRef(false);

  /** Instant: set analysis from evals already collected during the game */
  const setInstantAnalysis = useCallback((analysis: GameAnalysis) => {
    setState(prev => ({ ...prev, analysis, error: null }));
  }, []);

  /** Graded pass: every position at GRADE_DEPTH → the game's grades. */
  const analyze = useCallback(async (
    moves: MoveRecord[],
    playerColor: 'white' | 'black',
    opts: { startFen?: string; playerLevel?: number | null } = {},
  ): Promise<{ analysis: GameAnalysis; evals: PositionEval[] } | null> => {
    if (moves.length === 0) return null;
    const { startFen } = opts;

    cancelledRef.current = false;
    setState(prev => ({ ...prev, graded: null, isAnalyzing: true, progress: 0, error: null }));

    try {
      await stockfish.init();

      const fens: string[] = [
        startFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      ];
      for (const move of moves) fens.push(move.fenAfter);

      const evals: PositionEval[] = [];
      for (let i = 0; i < fens.length; i++) {
        if (cancelledRef.current) return null;

        const result = await stockfish.getFullEval(fens[i], GRADE_DEPTH);
        // A null result here is either a cancel (checked next) or a dead
        // engine — record the hole; grading marks the move 'unknown'.
        evals.push({
          cp: result?.cp ?? null,
          mate: result?.mate ?? null,
          bestMove: result?.bestMove ?? null,
          bestLine: result?.bestLine ?? [],
          depth: GRADE_DEPTH,
        });

        setState(prev => ({ ...prev, progress: Math.round(((i + 1) / fens.length) * 100) }));
      }

      if (cancelledRef.current) return null;

      const moveInfos = moves.map(m => ({ san: m.san, movedBy: m.movedBy, moveNumber: m.moveNumber, fenAfter: m.fenAfter }));
      const analysis = gradeGame(evals, moveInfos, playerColor, { startFen, playerLevel: opts.playerLevel });

      setState({ analysis, graded: analysis, isAnalyzing: false, progress: 100, error: null });
      return { analysis, evals };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setState(prev => ({ ...prev, isAnalyzing: false, error: message }));
      return null;
    }
  }, []);

  /** Abandon the graded pass (new game / leaving). Nothing half-graded is kept. */
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState(prev => ({ ...prev, graded: null, isAnalyzing: false }));
  }, []);

  return {
    ...state,
    setInstantAnalysis,
    analyze,
    cancel,
  };
}
