'use client';

/**
 * MissReplay — one missed puzzle on a board, told in three beats:
 *
 *   yours   → board at the miss, RED arrow on what you played (soft error beat)
 *   playing → GREEN arrow on the right move, then the rest of the solution
 *             auto-plays (300ms a move, green arrow on each solver move,
 *             move/capture sound per move, the correct chime on the last one)
 *   done    → eval chips (yours vs. right) + Rookie's one-liner
 *
 * Read-only board. No playedMove (older sessions) → we skip "yours" and lead
 * with "here's the answer".
 *
 * Styled for the Chess Boxing dark shell (white text on #131a2e). Layout is a
 * column whose board never shrinks; when the parent gives it a fixed height
 * (the report page's no-scroll window) everything BELOW the board scrolls.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
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

type Phase = 'yours' | 'playing' | 'done';
type Arrow = { startSquare: string; endSquare: string; color: string };
type Step = { fen: string; arrow: Arrow | null; captured: boolean; sound: 'move' | 'capture' | 'correct' | 'mate' };

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

/** The sound helpers don't all check the global toggle themselves. */
function sfx(fn: () => unknown) {
  if (!isSoundEnabled()) return;
  try {
    void fn();
  } catch {
    /* audio is never load-bearing */
  }
}

export function MissReplay({ analysis, line, lineLoading }: Props) {
  const hasPlayed = !!analysis.playedUci;
  const [phase, setPhase] = useState<Phase>(hasPlayed ? 'yours' : 'playing');
  const [started, setStarted] = useState(false);
  const [fen, setFen] = useState(analysis.fenAtMiss);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const timersRef = useRef<number[]>([]);
  // Which analysis already got its "wrong one" beat — once per miss, not per render.
  const errorBeatRef = useRef<MissAnalysis | null>(null);

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
    if (hasPlayed && errorBeatRef.current !== analysis) {
      errorBeatRef.current = analysis;
      sfx(playErrorSound);
      vibrateOnError();
    }
    return clearTimers;
  }, [analysis, hasPlayed, clearTimers]);

  const play = useCallback(() => {
    clearTimers();
    sfx(playButtonClick);
    setStarted(true);
    setPhase('playing');
    setFen(analysis.fenAtMiss);

    const chess = new Chess(analysis.fenAtMiss);
    const steps: Step[] = [];
    for (let i = analysis.failedAtMove; i < analysis.solutionMoves.length; i++) {
      const uci = analysis.solutionMoves[i];
      let captured = false;
      try {
        const mv = chess.move(parseUciMove(uci));
        captured = !!mv?.captured;
      } catch {
        break;
      }
      const isSolver = (i - analysis.failedAtMove) % 2 === 0;
      steps.push({
        fen: chess.fen(),
        arrow: isSolver ? { startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: ARROW_GREEN } : null,
        captured,
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

    // Beat 1: green arrow on the right move, board still at the miss.
    setArrows([{ startSquare: analysis.correctUci.slice(0, 2), endSquare: analysis.correctUci.slice(2, 4), color: ARROW_GREEN }]);

    steps.forEach((step, idx) => {
      const t = window.setTimeout(() => {
        setFen(step.fen);
        setArrows(step.arrow ? [step.arrow] : []);
        if (step.sound === 'mate') sfx(() => playCelebrationSound());
        else if (step.sound === 'correct') sfx(() => playCorrectSound(0, 0));
        else if (step.sound === 'capture') sfx(playCaptureSound);
        else sfx(playMoveSound);
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

        {showButton && (
          <button
            onClick={play}
            className="w-full min-h-[44px] rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-lg py-3.5 shadow-[0_4px_0_0_#3d8c01] active:translate-y-[2px] active:shadow-none transition"
          >
            Show me
          </button>
        )}

        {phase === 'done' && (
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

            <button
              onClick={play}
              className="self-center min-h-[44px] px-4 text-sm font-bold text-white/70 hover:text-white underline underline-offset-2"
            >
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
