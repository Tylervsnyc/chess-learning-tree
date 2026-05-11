'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
import {
  RunSummaryModal,
  scoreForLevel,
  type LevelResult,
} from '@/components/run/RunSummaryModal';
import { CardDrawModal } from '@/components/run/CardDrawModal';
import { CardHand } from '@/components/run/CardHand';
import { RunIntroModal } from '@/components/run/RunIntroModal';
import { TempoBar } from '@/components/run/TempoBar';
import { TOTAL_LEVELS } from '@/components/run/levels';
import { trackEvent } from '@/lib/analytics/posthog';
import type { CardId } from '@/lib/run/cards';
import {
  applyCardPick,
  applyCardPlay,
  applyDismissDraw,
  applyRookieMove,
  stepEnemyTurn,
} from '@/lib/run/engine';
import {
  puzzleForDate,
  puzzleToBoardState,
  todayISO,
} from '@/lib/run/seed';
import { computeScore } from '@/lib/run/scoring';
import { buildShareString } from '@/lib/run/share';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, PieceType, RunPuzzle } from '@/lib/run/types';

/**
 * Rookie's Run — Sprint 2.
 *
 * 10-level single daily run with the Tempo system. Capturing pieces grants
 * tempo; spend tempo to transform Rookie into a Knight or Bishop temporarily.
 * Die at any level → run ends. Beat all 10 → run complete.
 */

function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function readLevelOverride(): number {
  if (typeof window === 'undefined') return 0;
  const p = new URLSearchParams(window.location.search).get('level');
  if (!p) return 0;
  const n = parseInt(p, 10);
  if (Number.isNaN(n) || n < 1 || n > TOTAL_LEVELS) return 0;
  return n - 1;
}

interface RunMeta {
  iso: string;
  startLevelIndex: number;
}

function freshRun(iso: string, startLevelIndex: number): {
  state: BoardState;
  puzzle: RunPuzzle;
} {
  const puzzle = puzzleForDate(iso, startLevelIndex);
  return { state: puzzleToBoardState(puzzle), puzzle };
}

export default function RookiesRunPage() {
  const meta: RunMeta = useMemo(() => {
    return { iso: todayISO(), startLevelIndex: readLevelOverride() };
  }, []);

  const [levelIndex, setLevelIndex] = useState(meta.startLevelIndex);
  const initial = useMemo(
    () => freshRun(meta.iso, meta.startLevelIndex),
    [meta.iso, meta.startLevelIndex],
  );
  const [state, setState] = useState<BoardState>(initial.state);
  const [puzzle, setPuzzle] = useState<RunPuzzle>(initial.puzzle);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finalElapsed, setFinalElapsed] = useState<number | null>(null);

  // Accumulated totals across the run.
  const [totalMoves, setTotalMoves] = useState(0);
  const [totalCaptures, setTotalCaptures] = useState<PieceType[]>([]);
  const [levelsCleared, setLevelsCleared] = useState(0);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);

  // Phase flags.
  const [dying, setDying] = useState(false);
  const [deathSettled, setDeathSettled] = useState(false);
  const [showLevelCleared, setShowLevelCleared] = useState(false);
  const [runComplete, setRunComplete] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const prevFormRef = useRef(state.form);

  // Intro modal — shown once per device, re-openable via the "?" button.
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('rookies-run-intro-seen')) {
      setShowIntro(true);
      trackEvent('run_intro_shown', { iso: meta.iso });
    }
  }, [meta.iso]);

  const dismissIntro = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rookies-run-intro-seen', '1');
    }
    setShowIntro(false);
    trackEvent('run_intro_dismissed', { iso: meta.iso });
  }, [meta.iso]);

  const openIntro = useCallback(() => {
    setShowIntro(true);
    trackEvent('run_intro_reopened', { iso: meta.iso });
  }, [meta.iso]);

  // Track run start (first move).
  const trackedStartRef = useRef(false);
  useEffect(() => {
    if (trackedStartRef.current || state.moveCount === 0) return;
    trackedStartRef.current = true;
    trackEvent('run_started', { iso: meta.iso, level: levelIndex + 1 });
  }, [state.moveCount, meta.iso, levelIndex]);

  // Glitch on every form change (manual transform + auto-revert).
  useEffect(() => {
    if (prevFormRef.current === state.form) return;
    prevFormRef.current = state.form;
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), 440);
    return () => clearTimeout(t);
  }, [state.form]);

  // Staged enemy turn: one piece moves at a time so you can SEE who acted.
  // Tick every ~360ms while it's the enemy's turn.
  useEffect(() => {
    if (state.turn !== 'enemy' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'enemy' && s.status === 'playing' ? stepEnemyTurn(s) : s));
    }, 360);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.enemyMovedSquares.length]);

  // Death animation gate.
  // NOTE: Only depends on state.status — including `dying`/`deathSettled` in
  // the dep array causes setDying(true) below to re-fire this effect, whose
  // cleanup then clears the 1.2s timeout before it can flip deathSettled,
  // and the RunSummaryModal never mounts.
  useEffect(() => {
    if (state.status !== 'lost') return;
    setDying(true);
    const t = setTimeout(() => setDeathSettled(true), 1200);
    return () => clearTimeout(t);
  }, [state.status]);

  // Win-of-level handler: bank moves/captures, show level-cleared overlay or
  // finalize the run.
  useEffect(() => {
    if (state.status !== 'won' || showLevelCleared || runComplete) return;

    const levelScore = scoreForLevel(state.moveCount, state.captures);
    setLevelResults((rs) => [
      ...rs,
      {
        level: levelIndex + 1,
        cleared: true,
        moves: state.moveCount,
        captures: state.captures,
        score: levelScore,
      },
    ]);
    setTotalMoves((m) => m + state.moveCount);
    setTotalCaptures((cs) => [...cs, ...state.captures]);
    setLevelsCleared((n) => n + 1);

    trackEvent('run_level_cleared', {
      iso: meta.iso,
      level: levelIndex + 1,
      moves: state.moveCount,
      captures: state.captures.length,
      score: levelScore,
      tempo: state.tempo,
    });

    if (levelIndex >= TOTAL_LEVELS - 1) {
      setRunComplete(true);
      trackEvent('run_completed', {
        iso: meta.iso,
        score: levelScore,
      });
    } else {
      setShowLevelCleared(true);
    }
  }, [state.status, state.moveCount, state.captures, state.tempo, levelIndex, showLevelCleared, runComplete, meta.iso]);

  // Loss handler: record the failed level once.
  const trackedLossRef = useRef(false);
  useEffect(() => {
    if (state.status !== 'lost') return;
    setLevelResults((rs) => {
      if (rs.some((r) => r.level === levelIndex + 1)) return rs;
      return [
        ...rs,
        {
          level: levelIndex + 1,
          cleared: false,
          moves: state.moveCount,
          captures: state.captures,
          score: 0,
        },
      ];
    });
    if (!trackedLossRef.current) {
      trackedLossRef.current = true;
      trackEvent('run_level_lost', {
        iso: meta.iso,
        level: levelIndex + 1,
        moves: state.moveCount,
        captures: state.captures.length,
      });
    }
  }, [state.status, state.moveCount, state.captures, levelIndex, meta.iso]);

  // Timer tick.
  useEffect(() => {
    if (runComplete || state.status === 'lost') return;
    if (startTime === null) return;
    const tick = () => setElapsed(Date.now() - startTime);
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [runComplete, state.status, startTime]);

  // Freeze the clock when the run ends.
  useEffect(() => {
    if ((runComplete || state.status === 'lost') && finalElapsed === null && startTime !== null) {
      setFinalElapsed(Date.now() - startTime);
    }
  }, [runComplete, state.status, finalElapsed, startTime]);

  const onSquareClick = useCallback(
    (square: string) => {
      if (state.status !== 'playing' || state.turn !== 'rookie') return;
      const rookieSquare = toSquare(state.rookie);

      if (square === rookieSquare) {
        setSelectedSquare((cur) => (cur === square ? null : square));
        return;
      }
      if (!selectedSquare) return;

      const target = fromSquare(square);
      if (startTime === null) {
        setStartTime(Date.now());
        setElapsed(0);
      }
      const next = applyRookieMove(state, target);
      if (next !== state) {
        setState(next);
      }
      setSelectedSquare(null);
    },
    [state, selectedSquare, startTime],
  );

  const onPieceDrop = useCallback(
    (_sourceSquare: string, targetSquare: string) => {
      if (state.status !== 'playing' || state.turn !== 'rookie') return false;
      const target = fromSquare(targetSquare);
      const next = applyRookieMove(state, target);
      if (next === state) return false;
      if (startTime === null) {
        setStartTime(Date.now());
        setElapsed(0);
      }
      setState(next);
      setSelectedSquare(null);
      return true;
    },
    [state, startTime],
  );

  const onCardPick = useCallback(
    (cardId: CardId) => {
      const next = applyCardPick(state, cardId);
      if (next !== state) {
        setState(next);
        trackEvent('run_card_drawn', {
          iso: meta.iso,
          level: levelIndex + 1,
          card: cardId,
        });
      }
    },
    [state, meta.iso, levelIndex],
  );

  const onDismissDraw = useCallback(() => {
    const next = applyDismissDraw(state);
    if (next !== state) {
      setState(next);
      trackEvent('run_draw_dismissed', {
        iso: meta.iso,
        level: levelIndex + 1,
        reason: 'hand_full',
      });
    }
  }, [state, meta.iso, levelIndex]);

  const onCardPlay = useCallback(
    (slotIndex: number) => {
      const cardId = state.hand[slotIndex];
      const next = applyCardPlay(state, slotIndex);
      if (next !== state) {
        setState(next);
        trackEvent('run_card_played', {
          iso: meta.iso,
          level: levelIndex + 1,
          card: cardId,
        });
      }
    },
    [state, meta.iso, levelIndex],
  );

  const goToNextLevel = useCallback(() => {
    const nextIdx = levelIndex + 1;
    const nextPuzzle = puzzleForDate(meta.iso, nextIdx);
    setLevelIndex(nextIdx);
    setPuzzle(nextPuzzle);
    // Cards and remaining tempo both carry across levels.
    setState(
      puzzleToBoardState(nextPuzzle, { hand: state.hand, tempo: state.tempo }),
    );
    setSelectedSquare(null);
    setShowLevelCleared(false);
  }, [levelIndex, meta.iso, state.hand, state.tempo]);

  const resetRun = useCallback(() => {
    const fresh = freshRun(meta.iso, meta.startLevelIndex);
    setLevelIndex(meta.startLevelIndex);
    setPuzzle(fresh.puzzle);
    setState(fresh.state);
    setStartTime(null);
    setElapsed(0);
    setFinalElapsed(null);
    setSelectedSquare(null);
    setTotalMoves(0);
    setTotalCaptures([]);
    setLevelsCleared(0);
    setLevelResults([]);
    setDying(false);
    setDeathSettled(false);
    setShowLevelCleared(false);
    setRunComplete(false);
    trackedStartRef.current = false;
    trackedLossRef.current = false;
    trackEvent('run_replayed', { iso: meta.iso });
  }, [meta.iso, meta.startLevelIndex]);

  const displayElapsed = finalElapsed ?? elapsed;
  const score = useMemo(() => {
    const inProgressMoves = state.status === 'playing' ? state.moveCount : 0;
    const inProgressCaptures = state.status === 'playing' ? state.captures : [];
    return computeScore({
      moves: totalMoves + inProgressMoves,
      captures: [...totalCaptures, ...inProgressCaptures],
      elapsedMs: displayElapsed,
      levelsCleared,
      tempoRemaining: state.tempo,
    });
  }, [totalMoves, totalCaptures, state.status, state.moveCount, state.captures, state.tempo, displayElapsed, levelsCleared]);

  const inProgressMoves = state.status === 'playing' ? state.moveCount : 0;

  const shareString = buildShareString({
    iso: meta.iso,
    moves: totalMoves + inProgressMoves,
    elapsedMs: displayElapsed,
    score: runComplete ? score.total : undefined,
  });

  const totalDisplayMoves = totalMoves + inProgressMoves;
  const moveLimit = state.moveLimit;

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md mx-auto w-full px-4 py-4 flex flex-col gap-3">
        <header className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-black text-chess-text">Rookie&apos;s Run</h1>
            <p className="text-xs text-chess-text-muted">
              Level {levelIndex + 1} of {TOTAL_LEVELS} · climb to rank 8.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-chess-text-faint tabular-nums">{meta.iso}</div>
            <button
              type="button"
              onClick={openIntro}
              aria-label="How to play"
              className="w-6 h-6 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted text-xs font-black transition-all"
            >
              ?
            </button>
          </div>
        </header>

        <div className="flex gap-2">
          <div className="flex-1 bg-chess-surface rounded-lg px-2.5 py-1 shadow-sm">
            <div className="text-[9px] uppercase tracking-wide text-chess-text-faint leading-tight">
              {moveLimit !== null ? `Moves / ${moveLimit}` : 'Moves'}
            </div>
            <div className="text-lg font-black text-chess-text tabular-nums leading-tight">
              {state.moveCount}
            </div>
          </div>
          <div className="flex-1 bg-chess-surface rounded-lg px-2.5 py-1 shadow-sm">
            <div className="text-[9px] uppercase tracking-wide text-chess-text-faint leading-tight">
              Time
            </div>
            <div className="text-lg font-black text-chess-text tabular-nums leading-tight">
              {formatElapsed(displayElapsed)}
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-950/40 rounded-lg px-2.5 py-1 shadow-sm">
            <div className="text-[9px] uppercase tracking-wide text-chess-text-faint leading-tight">
              Score
            </div>
            <div className="text-lg font-black text-chess-text tabular-nums leading-tight">
              {score.total.toLocaleString()}
            </div>
          </div>
        </div>

        <TempoBar tempo={state.tempo} form={state.form} formMovesLeft={state.formMovesLeft} />

        <div className="w-full">
          <RunBoard
            state={state}
            selectedSquare={selectedSquare}
            dying={dying}
            glitching={glitching}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
          />
        </div>

        <CardHand hand={state.hand} onPlay={onCardPlay} />

        {state.status === 'playing' && (
          <p className="text-center text-sm text-chess-text-muted">
            Tap Rookie to see her moves.
          </p>
        )}
      </div>

      {state.pendingDraw && state.status === 'playing' && !showIntro && (
        <CardDrawModal
          options={state.pendingDraw}
          handFull={state.hand.length >= 2}
          onPick={onCardPick}
          onDismiss={onDismissDraw}
        />
      )}

      {showIntro && <RunIntroModal onClose={dismissIntro} />}

      {showLevelCleared && (
        <LevelClearedModal
          level={levelIndex + 1}
          totalLevels={TOTAL_LEVELS}
          tempo={state.tempo}
          onNext={goToNextLevel}
        />
      )}

      {((state.status === 'lost' && deathSettled) || runComplete) && (
        <RunSummaryModal
          iso={meta.iso}
          totalLevels={TOTAL_LEVELS}
          levelsCleared={levelsCleared}
          totalMoves={totalDisplayMoves}
          totalScore={score.total}
          elapsedSeconds={score.seconds}
          levelResults={levelResults}
          shareString={shareString}
          completed={runComplete}
          onReplay={resetRun}
        />
      )}
    </div>
  );
}
