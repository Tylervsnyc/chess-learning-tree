'use client';

import { useState, useCallback, useRef } from 'react';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import {
  PositionEval,
  analyzeGameMoves,
  GameAnalysis,
} from '@/lib/game-eval';
import { MoveRecord } from '@/lib/game-session';

export interface PostGameAnalysisState {
  analysis: GameAnalysis | null;
  isAnalyzing: boolean;
  progress: number; // 0-100
  error: string | null;
}

const DEEP_ANALYSIS_DEPTH = 18;

/**
 * Post-game analysis hook.
 *
 * Primary path: `setInstantAnalysis()` — uses evals collected during play. Instant.
 * Deep path: `analyze()` — re-evaluates every position at depth 18. Slow, for future use.
 */
export function usePostGameAnalysis() {
  const [state, setState] = useState<PostGameAnalysisState>({
    analysis: null,
    isAnalyzing: false,
    progress: 0,
    error: null,
  });
  const cancelledRef = useRef(false);

  /** Instant: set analysis from evals already collected during the game */
  const setInstantAnalysis = useCallback((analysis: GameAnalysis) => {
    setState({
      analysis,
      isAnalyzing: false,
      progress: 100,
      error: null,
    });
  }, []);

  /** Deep: re-analyze all positions at high depth (for future premium use) */
  const analyze = useCallback(async (
    moves: MoveRecord[],
    playerColor: 'white' | 'black',
    startFen?: string,
  ): Promise<GameAnalysis | null> => {
    if (moves.length === 0) return null;

    cancelledRef.current = false;
    setState(prev => ({ ...prev, isAnalyzing: true, progress: 0, error: null }));

    try {
      await stockfish.init();

      const fens: string[] = [
        startFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      ];
      for (const move of moves) fens.push(move.fenAfter);

      const evals: PositionEval[] = [];
      for (let i = 0; i < fens.length; i++) {
        if (cancelledRef.current) return null;

        const result = await stockfish.getFullEval(fens[i], DEEP_ANALYSIS_DEPTH);
        evals.push({
          cp: result?.cp ?? null,
          mate: result?.mate ?? null,
          bestMove: result?.bestMove ?? null,
          bestLine: [],
          depth: DEEP_ANALYSIS_DEPTH,
        });

        setState(prev => ({ ...prev, progress: Math.round(((i + 1) / fens.length) * 100) }));
      }

      if (cancelledRef.current) return null;

      const moveInfos = moves.map((m, i) => ({
        san: m.san,
        movedBy: m.movedBy,
        moveNumber: m.moveNumber,
        fenBefore: fens[i], // fens[i] = position before move i
      }));
      const analysis = analyzeGameMoves(evals, moveInfos, playerColor);

      setState({ analysis, isAnalyzing: false, progress: 100, error: null });
      return analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setState(prev => ({ ...prev, isAnalyzing: false, error: message }));
      return null;
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState(prev => ({ ...prev, isAnalyzing: false }));
  }, []);

  return {
    ...state,
    setInstantAnalysis,
    analyze,
    cancel,
  };
}
