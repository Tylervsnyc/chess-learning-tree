'use client';

/**
 * MissReplay — one missed puzzle on a board, stepped through by hand:
 *
 *   yours   → board at the miss, RED arrow on what you played (soft error beat)
 *   answer  → GREEN arrow on the right move, board still at the miss
 *   step k  → "Next move" advances the solution ONE move at a time (green
 *             arrow on each solver move, move/capture sound per move, the
 *             correct chime on the last one). "Previous move" walks back.
 *   done    → eval chips (yours vs. right) + Rookie's one-liner
 *
 * The line never auto-plays — 300ms a move was too fast to follow, so the
 * user taps through it at their own pace (2026-09-03).
 *
 * Read-only board. No playedMove (older sessions) → we skip "yours" and lead
 * with "here's the answer".
 *
 * Styled for the Chess Boxing dark shell (white text on #131a2e). Layout is a
 * column whose board never shrinks; when the parent gives it a fixed height
 * (the report page's no-scroll window) everything BELOW the board scrolls.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { ARROW_GREEN, ARROW_RED } from '@/lib/review/review-core';
import { badgeSquareStyle } from '@/lib/review/move-badges';
import { parseUciMove } from '@/lib/puzzle-utils';
import {
  isSoundEnabled,
  playButtonClick,
  playCaptureSound,
  playCelebrationSound,
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  vibrateOnError,
} from '@/lib/sounds';
import type { MissAnalysis } from '@/hooks/useMissAnalysis';

type Arrow = { startSquare: string; endSquare: string; color: string };
type Step = { fen: string; san: string; arrow: Arrow | null; sound: 'move' | 'capture' | 'correct' | 'mate' };

const MOVE_MS = 300;

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

/** The sound helpers don't all check the global toggle themselves. */
function sfx(fn: () => unknown) {
  if (!isSoundEnabled()) return;
  try {
    void fn();
  } catch {
    /* audio is never load-bearing */
  }
}

/** The rest of the solution from the miss onward, one board state per move. */
function buildSteps(analysis: MissAnalysis): Step[] {
  const chess = new Chess(analysis.fenAtMiss);
  const steps: Step[] = [];
  for (let i = analysis.failedAtMove; i < analysis.solutionMoves.length; i++) {
    const uci = analysis.solutionMoves[i];
    let san = uci;
    let captured = false;
    try {
      const mv = chess.move(parseUciMove(uci));
      captured = !!mv?.captured;
      san = mv?.san ?? uci;
    } catch {
      break;
    }
    const isSolver = (i - analysis.failedAtMove) % 2 === 0;
    steps.push({
      fen: chess.fen(),
      san,
      arrow: isSolver ? { startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: ARROW_GREEN } : null,
      sound: captured ? 'capture' : 'move',
    });
  }
  // The last solver move gets the "correct" chime (or the celebration on mate).
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].arrow) {
      steps[i].sound = chess.isCheckmate() && i === steps.length - 1 ? 'mate' : 'correct';
      break;
    }
  }
  return steps;
}

function playStepSound(step: Step) {
  if (step.sound === 'mate') sfx(() => playCelebrationSound());
  else if (step.sound === 'correct') sfx(() => playCorrectSound(0, 0));
  else if (step.sound === 'capture') sfx(playCaptureSound);
  else sfx(playMoveSound);
}

export function MissReplay({ analysis, line, lineLoading }: Props) {
  const hasPlayed = !!analysis.playedUci;
  const steps = useMemo(() => buildSteps(analysis), [analysis]);
  // null = intro (your move / "we didn't catch it"); 0 = answer arrow on the
  // miss position; k = after solution move k has been played.
  const [idx, setIdx] = useState<number | null>(null);
  // Which analysis already got its "wrong one" beat — once per miss, not per render.
  const errorBeatRef = useRef<MissAnalysis | null>(null);

  // Reset when the analysis changes (Next → new miss).
  useEffect(() => {
    setIdx(null);
    if (hasPlayed && errorBeatRef.current !== analysis) {
      errorBeatRef.current = analysis;
      sfx(playErrorSound);
      vibrateOnError();
    }
  }, [analysis, hasPlayed]);

  const done = idx !== null && idx >= steps.length;
  const answerArrow: Arrow = {
    startSquare: analysis.correctUci.slice(0, 2),
    endSquare: analysis.correctUci.slice(2, 4),
    color: ARROW_GREEN,
  };

  const fen = idx === null || idx === 0 ? analysis.fenAtMiss : steps[idx - 1].fen;
  const arrows: Arrow[] = (() => {
    if (idx === null) {
      return hasPlayed && analysis.playedUci
        ? [{ startSquare: analysis.playedUci.slice(0, 2), endSquare: analysis.playedUci.slice(2, 4), color: ARROW_RED }]
        : [];
    }
    if (idx === 0) return [answerArrow];
    const a = steps[idx - 1].arrow;
    return a ? [a] : [];
  })();

  const start = useCallback(() => {
    sfx(playButtonClick);
    setIdx(0);
  }, []);

  const nextMove = useCallback(() => {
    const n = (idx ?? 0) + 1;
    if (n > steps.length) return;
    playStepSound(steps[n - 1]);
    setIdx(n);
  }, [idx, steps]);

  const prevMove = useCallback(() => {
    if (idx === null || idx <= 0) return;
    sfx(playMoveSound);
    setIdx(idx - 1);
  }, [idx]);

  const playedTo = analysis.playedUci?.slice(2, 4);
  const squareStyles = idx === null && playedTo ? { [playedTo]: badgeSquareStyle('blunder') } : undefined;

  const caption = (() => {
    if (idx === null) {
      return hasPlayed
        ? `You played ${analysis.playedSan ?? analysis.playedUci}`
        : 'We didn’t catch your move on this one — here’s the answer.';
    }
    if (idx === 0) return `The move was ${analysis.correctSan}`;
    const step = steps[idx - 1];
    return step.arrow ? step.san : `Then ${step.san}`;
  })();

  return (
    <div className="flex flex-col gap-3 min-h-0 flex-1">
      {/* Board: capped by width AND height so the caption, button and Rookie
          card stay on a 360×640 phone without scrolling. Never shrinks. */}
      <div className="w-full max-w-[min(100vw-32px,44vh)] md:max-w-[min(520px,55vh)] aspect-square mx-auto shrink-0">
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

      {/* Everything under the board scrolls if the window is too short. */}
      <div className="flex flex-col gap-3 min-h-0 flex-1 overflow-y-auto ring-scroll">
        <p className="text-center text-sm font-bold text-white min-h-[20px]">{caption}</p>

        {idx === null && (
          <button
            onClick={start}
            className="w-full min-h-[44px] rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-lg py-3.5 shadow-[0_4px_0_0_#3d8c01] active:translate-y-[2px] active:shadow-none transition"
          >
            Show me
          </button>
        )}

        {idx !== null && !done && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevMove}
              disabled={idx === 0}
              aria-label="Previous move"
              className="min-h-[44px] min-w-[44px] rounded-2xl bg-white/10 border border-white/15 text-white font-black text-lg disabled:opacity-30 transition"
            >
              ‹
            </button>
            <button
              onClick={nextMove}
              className="flex-1 min-h-[44px] rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-lg py-3.5 shadow-[0_4px_0_0_#3d8c01] active:translate-y-[2px] active:shadow-none transition"
            >
              {steps.length === 0 ? 'Got it' : `Next move (${idx}/${steps.length})`}
            </button>
          </div>
        )}

        {done && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              {hasPlayed && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 text-chess-red px-3 py-1.5 text-sm font-black tabular-nums">
                  {analysis.playedSan ?? analysis.playedUci} → {fmtEval(analysis.evalPlayed, analysis.matePlayed)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 text-chess-green px-3 py-1.5 text-sm font-black tabular-nums">
                {analysis.correctSan} → {fmtEval(analysis.evalCorrect, analysis.mateCorrect)}
              </span>
            </div>

            <div className="rounded-2xl bg-white/[0.07] border border-white/15 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-white/50 mb-1">Rookie</p>
              {line ? (
                <p className="text-sm text-white leading-snug">{line}</p>
              ) : lineLoading ? (
                <div className="space-y-1.5" aria-label="Rookie is looking…">
                  <div className="h-3 rounded bg-white/10 animate-pulse w-11/12" />
                  <div className="h-3 rounded bg-white/10 animate-pulse w-2/3" />
                </div>
              ) : (
                <p className="text-sm text-white/60">Rookie is speechless on this one.</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4">
              {steps.length > 0 && (
                <button
                  onClick={prevMove}
                  className="min-h-[44px] px-4 text-sm font-bold text-white/70 hover:text-white underline underline-offset-2"
                >
                  ‹ Previous move
                </button>
              )}
              <button
                onClick={start}
                className="min-h-[44px] px-4 text-sm font-bold text-white/70 hover:text-white underline underline-offset-2"
              >
                Replay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
