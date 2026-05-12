'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
import {
  RunSummaryModal,
  scoreForLevel,
  type LevelResult,
} from '@/components/run/RunSummaryModal';
import { AbilityRack } from '@/components/run/AbilityRack';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { RunIntroModal } from '@/components/run/RunIntroModal';
import { RunPickerModal } from '@/components/run/RunPickerModal';
import { TempoBar } from '@/components/run/TempoBar';
import { trackEvent } from '@/lib/analytics/posthog';
import {
  playCaptureSound,
  playCardDrawSound,
  playCardPlaySound,
  playLevelClearSound,
  playMoveSound,
  warmupAudio,
} from '@/lib/sounds';
import {
  ABILITY_DEFS,
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityMove,
  applyAbilityTargeted,
  applyDismissOffer,
  applyOfferPick,
  type AbilityId,
  type AbilityOfferOption,
} from '@/lib/run/abilities';
import { applyRookieMove, stepEnemyTurn } from '@/lib/run/engine';
import {
  DEFAULT_RUN_ID,
  getNextRunId,
  getRunById,
  RUNS,
} from '@/lib/run/runs';
import {
  puzzleForDate,
  puzzleToBoardState,
  todayISO,
  totalLevelsForRun,
} from '@/lib/run/seed';
import { computeScore } from '@/lib/run/scoring';
import { buildShareString } from '@/lib/run/share';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, Coord, PieceType, RunPuzzle } from '@/lib/run/types';

/**
 * Rookie's Run — Sprint 3.
 *
 * 10-level single daily run. Capturing pieces grants tempo; filling the tempo
 * meter offers 3 ability choices (new ability or upgrade). Abilities are
 * permanent for the run and live in the rack below the board.
 */

function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function readUrlParams(): { runId: string; startLevelIndex: number } {
  if (typeof window === 'undefined') {
    return { runId: '', startLevelIndex: 0 };
  }
  const params = new URLSearchParams(window.location.search);
  const runId = params.get('run') ?? '';
  const levelStr = params.get('level');
  let startLevelIndex = 0;
  if (levelStr) {
    const n = parseInt(levelStr, 10);
    if (!Number.isNaN(n) && n >= 1) startLevelIndex = n - 1;
  }
  return { runId, startLevelIndex };
}

function readSavedRunId(): string {
  if (typeof window === 'undefined') return DEFAULT_RUN_ID;
  return localStorage.getItem('rookies-run-current') ?? DEFAULT_RUN_ID;
}

interface RunMeta {
  iso: string;
  runId: string;
  startLevelIndex: number;
}

function freshRun(
  iso: string,
  runId: string,
  startLevelIndex: number,
): { state: BoardState; puzzle: RunPuzzle } {
  const puzzle = puzzleForDate(iso, startLevelIndex, runId);
  return { state: puzzleToBoardState(puzzle), puzzle };
}

export default function RookiesRunPage() {
  const meta: RunMeta = useMemo(() => {
    const url = readUrlParams();
    const runId = url.runId || readSavedRunId();
    const validRunId = RUNS.some((r) => r.id === runId) ? runId : DEFAULT_RUN_ID;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rookies-run-current', validRunId);
    }
    const maxLevel = totalLevelsForRun(validRunId) - 1;
    const startLevelIndex = Math.min(url.startLevelIndex, maxLevel);
    return { iso: todayISO(), runId: validRunId, startLevelIndex };
  }, []);

  const runDef = useMemo(() => getRunById(meta.runId), [meta.runId]);
  const totalLevels = runDef.levels.length;

  const [levelIndex, setLevelIndex] = useState(meta.startLevelIndex);
  const initial = useMemo(
    () => freshRun(meta.iso, meta.runId, meta.startLevelIndex),
    [meta.iso, meta.runId, meta.startLevelIndex],
  );
  const [state, setState] = useState<BoardState>(initial.state);
  const [puzzle, setPuzzle] = useState<RunPuzzle>(initial.puzzle);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  // Transient bomb VFX — set when detonate resolves, cleared after the anim runs.
  const [bombFx, setBombFx] = useState<{ file: number; rank: number; id: number } | null>(null);
  useEffect(() => {
    if (!bombFx) return;
    const t = setTimeout(() => setBombFx(null), 650);
    return () => clearTimeout(t);
  }, [bombFx]);
  // Detonate T5 — screenshake the board container briefly.
  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    if (!shaking) return;
    const t = setTimeout(() => setShaking(false), 420);
    return () => clearTimeout(t);
  }, [shaking]);

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

  const audioWarmedRef = useRef(false);
  const ensureAudioWarm = useCallback(() => {
    if (audioWarmedRef.current) return;
    audioWarmedRef.current = true;
    warmupAudio();
  }, []);

  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('rookies-run-intro-seen')) {
      setShowIntro(true);
      trackEvent('run_intro_shown', { iso: meta.iso });
    }
  }, [meta.iso]);

  const dismissIntro = useCallback(() => {
    ensureAudioWarm();
    if (typeof window !== 'undefined') {
      localStorage.setItem('rookies-run-intro-seen', '1');
    }
    setShowIntro(false);
    trackEvent('run_intro_dismissed', { iso: meta.iso });
  }, [meta.iso, ensureAudioWarm]);

  const openIntro = useCallback(() => {
    setShowIntro(true);
    trackEvent('run_intro_reopened', { iso: meta.iso });
  }, [meta.iso]);

  const trackedStartRef = useRef(false);
  useEffect(() => {
    if (trackedStartRef.current || state.moveCount === 0) return;
    trackedStartRef.current = true;
    trackEvent('run_started', { iso: meta.iso, level: levelIndex + 1 });
  }, [state.moveCount, meta.iso, levelIndex]);

  useEffect(() => {
    if (prevFormRef.current === state.form) return;
    prevFormRef.current = state.form;
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), 440);
    return () => clearTimeout(t);
  }, [state.form]);

  useEffect(() => {
    if (state.turn !== 'enemy' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'enemy' && s.status === 'playing' ? stepEnemyTurn(s) : s));
    }, 360);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.enemyMovedSquares.length]);

  useEffect(() => {
    if (state.status !== 'lost') return;
    setDying(true);
    const t = setTimeout(() => setDeathSettled(true), 1200);
    return () => clearTimeout(t);
  }, [state.status]);

  const lastRookieMoveRef = useRef(0);
  const lastRookieCapCountRef = useRef(0);
  const lastEnemyMoveRef = useRef(0);
  useEffect(() => {
    if (state.moveCount > lastRookieMoveRef.current) {
      const wasCapture = state.captures.length > lastRookieCapCountRef.current;
      if (wasCapture) {
        void playCaptureSound();
      } else if (state.status !== 'lost') {
        void playMoveSound();
      }
      lastRookieMoveRef.current = state.moveCount;
      lastRookieCapCountRef.current = state.captures.length;
    }
  }, [state.moveCount, state.captures.length, state.status]);

  useEffect(() => {
    lastRookieMoveRef.current = 0;
    lastRookieCapCountRef.current = 0;
    lastEnemyMoveRef.current = 0;
  }, [levelIndex]);

  useEffect(() => {
    const len = state.enemyMovedSquares.length;
    if (len > lastEnemyMoveRef.current) {
      if (state.status === 'playing') void playMoveSound();
    }
    lastEnemyMoveRef.current = len;
  }, [state.enemyMovedSquares.length, state.status]);

  useEffect(() => {
    if (state.status !== 'won') return;
    playLevelClearSound(levelIndex);
  }, [state.status, levelIndex]);

  // Offer-arrival sfx (reuse card-draw chime).
  const prevPendingOfferRef = useRef<BoardState['pendingOffer']>(null);
  useEffect(() => {
    if (state.pendingOffer && !prevPendingOfferRef.current) {
      playCardDrawSound();
    }
    prevPendingOfferRef.current = state.pendingOffer;
  }, [state.pendingOffer]);

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

    if (levelIndex >= totalLevels - 1) {
      setRunComplete(true);
      trackEvent('run_completed', {
        iso: meta.iso,
        run: meta.runId,
        score: levelScore,
      });
    } else {
      setShowLevelCleared(true);
    }
  }, [state.status, state.moveCount, state.captures, state.tempo, levelIndex, showLevelCleared, runComplete, meta.iso, meta.runId, totalLevels]);

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

  useEffect(() => {
    if (runComplete || state.status === 'lost') return;
    if (startTime === null) return;
    const tick = () => setElapsed(Date.now() - startTime);
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [runComplete, state.status, startTime]);

  useEffect(() => {
    if ((runComplete || state.status === 'lost') && finalElapsed === null && startTime !== null) {
      setFinalElapsed(Date.now() - startTime);
    }
  }, [runComplete, state.status, finalElapsed, startTime]);

  // Ability legal-move highlights (for movement abilities).
  const legalAbilityMoves: Coord[] | undefined = useMemo(() => {
    if (!state.activeAbility) return undefined;
    if (state.activeAbility.step !== 'pick-square') return undefined;
    return abilityLegalMoves(state, state.activeAbility.id);
  }, [state]);

  const activeAbilityTier = useMemo(() => {
    if (!state.activeAbility) return undefined;
    return state.abilities.find((a) => a.id === state.activeAbility!.id)?.tier;
  }, [state.activeAbility, state.abilities]);

  const onActivateAbility = useCallback(
    (id: AbilityId) => {
      ensureAudioWarm();
      // Tapping the same card again cancels.
      if (state.activeAbility?.id === id) {
        setState((s) => applyAbilityCancel(s));
        return;
      }
      const next = applyAbilityActivate(state, id);
      if (next !== state) {
        setSelectedSquare(null);
        setState(next);
      }
    },
    [state, ensureAudioWarm],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      ensureAudioWarm();
      if (state.status !== 'playing' || state.turn !== 'rookie') return;

      // Ability resolution mode.
      if (state.activeAbility) {
        const coord = fromSquare(square);
        const def = ABILITY_DEFS[state.activeAbility.id];

        // Cancel by tapping Rookie's own square.
        if (square === toSquare(state.rookie)) {
          setState((s) => applyAbilityCancel(s));
          return;
        }

        if (def.activation === 'movement') {
          const next = applyAbilityMove(state, state.activeAbility.id, coord);
          if (next !== state) {
            if (startTime === null) {
              setStartTime(Date.now());
              setElapsed(0);
            }
            setState(next);
            playCardPlaySound();
          }
          return;
        }

        // Targeted (freeze / detonate).
        const next = applyAbilityTargeted(state, state.activeAbility.id, coord);
        if (next !== state) {
          setState(next);
          playCardPlaySound();
          if (state.activeAbility.id === 'detonate') {
            setBombFx({ ...coord, id: Date.now() });
            const tier = state.abilities.find((a) => a.id === 'detonate')?.tier;
            if (tier === 5) setShaking(true);
          }
          trackEvent('run_ability_used', {
            iso: meta.iso,
            level: levelIndex + 1,
            ability: state.activeAbility.id,
          });
        }
        return;
      }

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
    [state, selectedSquare, startTime, meta.iso, levelIndex, ensureAudioWarm],
  );

  const onPieceDrop = useCallback(
    (_sourceSquare: string, targetSquare: string) => {
      ensureAudioWarm();
      if (state.status !== 'playing' || state.turn !== 'rookie') return false;
      if (state.activeAbility) return false;
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
    [state, startTime, ensureAudioWarm],
  );

  const onOfferPick = useCallback(
    (option: AbilityOfferOption) => {
      const next = applyOfferPick(state, option);
      if (next !== state) {
        setState(next);
        trackEvent('run_offer_picked', {
          iso: meta.iso,
          level: levelIndex + 1,
          kind: option.kind,
          ability: option.id,
          tier: option.tier,
        });
      }
    },
    [state, meta.iso, levelIndex],
  );

  const onOfferSkip = useCallback(() => {
    const next = applyDismissOffer(state);
    if (next !== state) {
      setState(next);
      trackEvent('run_offer_skipped', {
        iso: meta.iso,
        level: levelIndex + 1,
      });
    }
  }, [state, meta.iso, levelIndex]);

  const goToNextLevel = useCallback(() => {
    const nextIdx = levelIndex + 1;
    const nextPuzzle = puzzleForDate(meta.iso, nextIdx, meta.runId);
    setLevelIndex(nextIdx);
    setPuzzle(nextPuzzle);
    setState(
      puzzleToBoardState(nextPuzzle, {
        abilities: state.abilities,
        tempo: state.tempo,
        pendingOffer: state.pendingOffer,
      }),
    );
    setSelectedSquare(null);
    setShowLevelCleared(false);
  }, [levelIndex, meta.iso, meta.runId, state.abilities, state.tempo, state.pendingOffer]);

  const resetRun = useCallback(() => {
    const fresh = freshRun(meta.iso, meta.runId, meta.startLevelIndex);
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
    trackEvent('run_replayed', { iso: meta.iso, run: meta.runId });
  }, [meta.iso, meta.runId, meta.startLevelIndex]);

  const goToNextRun = useCallback(() => {
    const nextRunId = getNextRunId(meta.runId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rookies-run-current', nextRunId);
      const url = new URL(window.location.href);
      url.searchParams.delete('run');
      url.searchParams.delete('level');
      window.history.replaceState({}, '', url.toString());
    }
    trackEvent('run_advanced', { from: meta.runId, to: nextRunId });
    if (typeof window !== 'undefined') window.location.reload();
  }, [meta.runId]);

  const [showRunPicker, setShowRunPicker] = useState(false);

  const switchRun = useCallback(
    (runId: string) => {
      if (runId === meta.runId) {
        setShowRunPicker(false);
        return;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('rookies-run-current', runId);
        const url = new URL(window.location.href);
        url.searchParams.delete('run');
        url.searchParams.delete('level');
        window.history.replaceState({}, '', url.toString());
      }
      trackEvent('run_picked', { from: meta.runId, to: runId });
      if (typeof window !== 'undefined') window.location.reload();
    },
    [meta.runId],
  );

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
  void puzzle;

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md mx-auto w-full px-4 py-4 flex flex-col gap-3">
        <header className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowRunPicker(true)}
            className="text-left flex-1 min-w-0 active:opacity-70 transition-opacity"
            aria-label="Switch run"
          >
            <h1 className="text-xl font-black text-chess-text leading-tight inline-flex items-center gap-1">
              {runDef.name}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-chess-text-faint">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </h1>
            <p className="text-[11px] text-chess-text-muted leading-tight tabular-nums">
              Seed {meta.iso} · Level {levelIndex + 1}/{totalLevels}
            </p>
          </button>
          <button
            type="button"
            onClick={openIntro}
            aria-label="How to play"
            className="w-7 h-7 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted text-xs font-black transition-all shrink-0"
          >
            ?
          </button>
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

        <div className={`w-full ${shaking ? 'run-screenshake' : ''}`}>
          <style>{`
            @keyframes runScreenshake {
              0%, 100% { transform: translate(0, 0); }
              10% { transform: translate(-4px, 2px); }
              20% { transform: translate(5px, -3px); }
              30% { transform: translate(-3px, 4px); }
              40% { transform: translate(4px, 2px); }
              50% { transform: translate(-2px, -3px); }
              60% { transform: translate(3px, 3px); }
              70% { transform: translate(-2px, 1px); }
              80% { transform: translate(2px, -1px); }
              90% { transform: translate(-1px, 0); }
            }
            .run-screenshake { animation: runScreenshake 420ms ease-out; }
          `}</style>
          <RunBoard
            state={state}
            selectedSquare={selectedSquare}
            dying={dying}
            glitching={glitching}
            bombFx={bombFx}
            legalAbilityMoves={legalAbilityMoves}
            abilityTier={activeAbilityTier}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
          />
        </div>

        <AbilityRack
          abilities={state.abilities}
          activeId={state.activeAbility?.id ?? null}
          onActivate={onActivateAbility}
        />

        {state.status === 'playing' && state.activeAbility && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-500/15 border border-indigo-400/40 px-3 py-2">
            <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex-1 leading-tight">
              {ABILITY_DEFS[state.activeAbility.id].name}:{' '}
              {state.activeAbility.step === 'pick-enemy'
                ? 'tap an enemy'
                : ABILITY_DEFS[state.activeAbility.id].activation === 'targeted'
                  ? 'tap any square'
                  : 'tap a highlighted square'}
            </span>
            <button
              type="button"
              onClick={() => setState((s) => applyAbilityCancel(s))}
              className="px-2 py-1 rounded bg-chess-text/10 text-chess-text text-[11px] font-bold active:scale-95"
            >
              Cancel
            </button>
          </div>
        )}

        {state.status === 'playing' && !state.activeAbility && (
          <p className="text-center text-sm text-chess-text-muted">
            Tap Rookie to see her moves.
          </p>
        )}
      </div>

      {state.pendingOffer && state.status === 'playing' && !showIntro && (
        <AbilityOfferModal
          offer={state.pendingOffer}
          onPick={onOfferPick}
          onSkip={onOfferSkip}
        />
      )}

      {showIntro && <RunIntroModal onClose={dismissIntro} />}

      {showRunPicker && (
        <RunPickerModal
          currentRunId={meta.runId}
          onPick={switchRun}
          onClose={() => setShowRunPicker(false)}
        />
      )}

      {showLevelCleared && (
        <LevelClearedModal
          level={levelIndex + 1}
          totalLevels={totalLevels}
          tempo={state.tempo}
          onNext={goToNextLevel}
        />
      )}

      {((state.status === 'lost' && deathSettled) || runComplete) && (
        <RunSummaryModal
          iso={meta.iso}
          totalLevels={totalLevels}
          levelsCleared={levelsCleared}
          totalMoves={totalDisplayMoves}
          totalScore={score.total}
          elapsedSeconds={score.seconds}
          levelResults={levelResults}
          shareString={shareString}
          completed={runComplete}
          onReplay={resetRun}
          nextRunName={getRunById(getNextRunId(meta.runId)).name}
          onNextRun={goToNextRun}
        />
      )}
    </div>
  );
}
