'use client';

/**
 * MissReplay — one missed puzzle on a board, told in three beats:
 *
 *   yours   → board at the miss, RED arrow on what you played
 *   playing → GREEN arrow on the right move, then the rest of the solution
 *             auto-plays (300ms a move, green arrow on each solver move)
 *   done    → eval chips (yours vs. right) + Rookie's one-liner
 *
 * Read-only board. No playedMove (older sessions) → we skip "yours" and lead
 * with "here's the answer".
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { ARROW_GREEN, ARROW_RED } from '@/lib/review/review-core';
import { badgeSquareStyle } from '@/lib/review/move-badges';
import { parseUciMove } from '@/lib/puzzle-utils';
import type { MissAnalysis } from '@/hooks/useMissAnalysis';

type Phase = 'yours' | 'playing' | 'done';
type Arrow = { startSquare: string; endSquare: string; color: string };

const MOVE_MS = 300;
/** Pause after the green arrow lands before the line starts running. */
const LEAD_IN_MS = 700;

interface Props {
  analysis: MissAnalysis;
  line?: string;
  lineLoading: boolean;
}

function fmtEval(pawns: number | null, mate: number | null): string {
  if (mate !== null) return mate > 0 ? `mate in ${Math.abs(mate)}` : `mated in ${Math.abs(mate)}`;
  if (pawns === null) return '—';
  const sign = pawns > 0 ? '+' : pawns < 0 ? '−' : '';
  return `${sign}${Math.abs(pawns).toFixed(1)}`;
}

export function MissReplay({ analysis, line, lineLoading }: Props) {
  const hasPlayed = !!analysis.playedUci;
  const [phase, setPhase] = useState<Phase>(hasPlayed ? 'yours' : 'playing');
  const [started, setStarted] = useState(false);
  const [fen, setFen] = useState(analysis.fenAtMiss);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  // Reset when the analysis changes (Next → new miss).
  useEffect(() => {
    clearTimers();
    setPhase(hasPlayed ? 'yours' : 'playing');
    setStarted(false);
    setFen(analysis.fenAtMiss);
    setArrows(
      hasPlayed && analysis.playedUci
        ? [{ startSquare: analysis.playedUci.slice(0, 2), endSquare: analysis.playedUci.slice(2, 4), color: ARROW_RED }]
        : [],
    );
    return clearTimers;
  }, [analysis, hasPlayed, clearTimers]);

  const play = useCallback(() => {
    clearTimers();
    setStarted(true);
    setPhase('playing');
    setFen(analysis.fenAtMiss);

    const chess = new Chess(analysis.fenAtMiss);
    const steps: { fen: string; arrow: Arrow | null }[] = [];
    for (let i = analysis.failedAtMove; i < analysis.solutionMoves.length; i++) {
      const uci = analysis.solutionMoves[i];
      try {
        chess.move(parseUciMove(uci));
      } catch {
        break;
      }
      const isSolver = (i - analysis.failedAtMove) % 2 === 0;
      steps.push({
        fen: chess.fen(),
        arrow: isSolver ? { startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: ARROW_GREEN } : null,
      });
    }

    // Beat 1: green arrow on the right move, board still at the miss.
    setArrows([{ startSquare: analysis.correctUci.slice(0, 2), endSquare: analysis.correctUci.slice(2, 4), color: ARROW_GREEN }]);

    steps.forEach((step, idx) => {
      const t = window.setTimeout(() => {
        setFen(step.fen);
        setArrows(step.arrow ? [step.arrow] : []);
      }, LEAD_IN_MS + idx * MOVE_MS);
      timersRef.current.push(t);
    });
    const tDone = window.setTimeout(() => setPhase('done'), LEAD_IN_MS + steps.length * MOVE_MS + 200);
    timersRef.current.push(tDone);
  }, [analysis, clearTimers]);

  const playedTo = analysis.playedUci?.slice(2, 4);
  const squareStyles =
    phase === 'yours' && playedTo ? { [playedTo]: badgeSquareStyle('blunder') } : undefined;

  const caption = (() => {
    if (phase === 'yours') return `You played ${analysis.playedSan ?? analysis.playedUci}`;
    if (!hasPlayed && !started) return 'We didn’t catch your move on this one — here’s the answer.';
    if (phase === 'playing') return `The move was ${analysis.correctSan}`;
    return `The move was ${analysis.correctSan}`;
  })();

  const showButton = phase === 'yours' || (!hasPlayed && !started);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full max-w-[min(100vw-32px,420px)] md:max-w-[520px] aspect-square mx-auto">
        <ChessPathBoard
          options={{
            position: fen,
            boardOrientation: analysis.playerColor,
            allowDragging: false,
            animationDurationInMs: MOVE_MS,
            ...(arrows.length > 0 ? { arrows } : {}),
            ...(squareStyles ? { squareStyles } : {}),
          }}
        />
      </div>

      <p className="text-center text-sm font-bold text-chess-text min-h-[20px]">{caption}</p>

      {showButton && (
        <button
          onClick={play}
          className="w-full min-h-[44px] rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-lg py-3.5 shadow-sm transition"
        >
          Show me
        </button>
      )}

      {phase === 'done' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {hasPlayed && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-chess-wrong-bg text-chess-red px-3 py-1.5 text-sm font-black tabular-nums">
                {analysis.playedSan ?? analysis.playedUci} → {fmtEval(analysis.evalPlayed, analysis.matePlayed)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-chess-correct-bg text-chess-green-dark px-3 py-1.5 text-sm font-black tabular-nums">
              {analysis.correctSan} → {fmtEval(analysis.evalCorrect, analysis.mateCorrect)}
            </span>
          </div>

          <div className="rounded-2xl bg-chess-surface border border-slate-200 px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-wide text-chess-text-faint mb-1">Rookie</p>
            {line ? (
              <p className="text-sm text-chess-text leading-snug">{line}</p>
            ) : lineLoading ? (
              <div className="space-y-1.5" aria-label="Rookie is looking…">
                <div className="h-3 rounded bg-slate-100 animate-pulse w-11/12" />
                <div className="h-3 rounded bg-slate-100 animate-pulse w-2/3" />
              </div>
            ) : (
              <p className="text-sm text-chess-text-muted">Rookie is speechless on this one.</p>
            )}
          </div>

          <button
            onClick={play}
            className="self-center min-h-[44px] px-4 text-sm font-bold text-chess-blue hover:text-chess-blue-dark underline underline-offset-2"
          >
            Replay
          </button>
        </div>
      )}
    </div>
  );
}
