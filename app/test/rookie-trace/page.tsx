'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { AbilityRack } from '@/components/run/AbilityRack';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { TempoBar } from '@/components/run/TempoBar';
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
import { applyRookieMove, rookieLegalMoves, stepEnemyTurn } from '@/lib/run/engine';
import { getRunById } from '@/lib/run/runs';
import { puzzleForDate, puzzleToBoardState, todayISO } from '@/lib/run/seed';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, Coord, RunPuzzle } from '@/lib/run/types';

// Default level for trace collection: the last level of the most recently
// authored non-tutorial run (Pincer, added 2026-05-15). STC runs are
// excluded because they suppress ability offers.
const DEFAULT_RUN = 'pincer';
const DEFAULT_LEVEL = 1;

interface CompactState {
  rookie: Coord;
  pieces: BoardState['pieces'];
  hazards: BoardState['hazards'];
  turn: BoardState['turn'];
  status: BoardState['status'];
  moveCount: number;
  captures: BoardState['captures'];
  tempo: number;
  form: BoardState['form'];
  formMovesLeft: number;
  moveLimit: number | null;
  enemiesPerTurn: number;
  abilities: BoardState['abilities'];
  pendingOffer: BoardState['pendingOffer'];
  shieldUp: boolean;
  bonusMovesLeft: number;
  frozenSquares: string[];
  frozenTurnsLeft: Record<string, number>;
  poisonedSquares: string[];
  poisonedTurnsLeft: Record<string, number>;
  rabidSquares: string[];
  rabidTurnsLeft: Record<string, number>;
  decoyTarget: string | null;
  decoyTurnsLeft: number;
}

function compact(s: BoardState): CompactState {
  return {
    rookie: s.rookie,
    pieces: s.pieces,
    hazards: s.hazards,
    turn: s.turn,
    status: s.status,
    moveCount: s.moveCount,
    captures: s.captures,
    tempo: s.tempo,
    form: s.form,
    formMovesLeft: s.formMovesLeft,
    moveLimit: s.moveLimit,
    enemiesPerTurn: s.enemiesPerTurn,
    abilities: s.abilities,
    pendingOffer: s.pendingOffer,
    shieldUp: s.shieldUp,
    bonusMovesLeft: s.bonusMovesLeft,
    frozenSquares: s.frozenSquares,
    frozenTurnsLeft: s.frozenTurnsLeft,
    poisonedSquares: s.poisonedSquares,
    poisonedTurnsLeft: s.poisonedTurnsLeft,
    rabidSquares: s.rabidSquares,
    rabidTurnsLeft: s.rabidTurnsLeft,
    decoyTarget: s.decoyTarget,
    decoyTurnsLeft: s.decoyTurnsLeft,
  };
}

type ActionRecord =
  | { kind: 'move'; from: string; to: string }
  | { kind: 'ability'; id: AbilityId; tier: number; activation: string; to?: string }
  | { kind: 'offer-pick'; option: AbilityOfferOption }
  | { kind: 'offer-skip' }
  | { kind: 'level-clear'; level: number; nextLevel: number | null }
  | { kind: 'level-lost'; level: number };

interface TraceEntry {
  step: number;
  level: number;
  tMs: number;
  decisionMs: number;
  action: ActionRecord;
  legalMoves: string[];
  abilityOptionsAtDecision: { id: AbilityId; tier: number; usesLeft: number | null }[];
  preState: CompactState;
  postState: CompactState;
  enemyTurns: { state: CompactState }[];
}

interface TraceDoc {
  meta: {
    runId: string;
    startLevel: number;
    finalLevel: number;
    levelsCleared: number;
    totalLevels: number;
    puzzles: { level: number; puzzle: RunPuzzle }[];
    startedAt: string;
    finishedAt: string | null;
    outcome: 'in-progress' | 'lost' | 'run-complete';
    totalMoves: number;
    totalCaptures: number;
    schemaVersion: 2;
  };
  initialState: CompactState;
  entries: TraceEntry[];
}

function readParams(): { runId: string; level: number } {
  if (typeof window === 'undefined') return { runId: DEFAULT_RUN, level: DEFAULT_LEVEL };
  const p = new URLSearchParams(window.location.search);
  const runId = p.get('run') || DEFAULT_RUN;
  const lvl = parseInt(p.get('level') || `${DEFAULT_LEVEL}`, 10);
  return {
    runId,
    level: Number.isFinite(lvl) && lvl >= 1 ? lvl : DEFAULT_LEVEL,
  };
}

function freshGame(runId: string, level: number): { state: BoardState; puzzle: RunPuzzle } {
  const iso = todayISO();
  const puzzle = puzzleForDate(iso, level - 1, runId);
  return { state: puzzleToBoardState(puzzle, { runId }), puzzle };
}

export default function RookieTracePage() {
  const [params, setParams] = useState(() => ({ runId: DEFAULT_RUN, level: DEFAULT_LEVEL }));
  const [game, setGame] = useState(() => freshGame(DEFAULT_RUN, DEFAULT_LEVEL));
  const [state, setState] = useState(game.state);
  const [levelIndex, setLevelIndex] = useState(DEFAULT_LEVEL - 1);
  const [puzzles, setPuzzles] = useState<{ level: number; puzzle: RunPuzzle }[]>(() => [
    { level: DEFAULT_LEVEL, puzzle: game.puzzle },
  ]);
  const [runOutcome, setRunOutcome] = useState<'in-progress' | 'lost' | 'run-complete'>('in-progress');
  const [transitioning, setTransitioning] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [glitching, setGlitching] = useState(false);
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string>('');

  const runDef = getRunById(params.runId);
  const totalLevels = runDef.levels.length;

  // Sync URL params on mount.
  useEffect(() => {
    const p = readParams();
    if (p.runId !== params.runId || p.level !== params.level) {
      setParams(p);
      const g = freshGame(p.runId, p.level);
      setGame(g);
      setState(g.state);
      setLevelIndex(p.level - 1);
      setPuzzles([{ level: p.level, puzzle: g.puzzle }]);
      setRunOutcome('in-progress');
      setTrace([]);
      setStartedAt(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimeRef = useRef<number | null>(null);
  const lastActionTimeRef = useRef<number | null>(null);
  const stepCounterRef = useRef(0);
  const lastTraceEntryRef = useRef<TraceEntry | null>(null);
  const savedOnceRef = useRef(false);
  const levelIndexRef = useRef(levelIndex);
  useEffect(() => { levelIndexRef.current = levelIndex; }, [levelIndex]);

  const resetTimers = useCallback(() => {
    startTimeRef.current = null;
    lastActionTimeRef.current = null;
    stepCounterRef.current = 0;
    lastTraceEntryRef.current = null;
  }, []);

  const resetGame = useCallback(() => {
    const g = freshGame(params.runId, params.level);
    setGame(g);
    setState(g.state);
    setLevelIndex(params.level - 1);
    setPuzzles([{ level: params.level, puzzle: g.puzzle }]);
    setRunOutcome('in-progress');
    setTransitioning(false);
    setSelectedSquare(null);
    setTrace([]);
    setStartedAt(null);
    setSaveMsg('');
    savedOnceRef.current = false;
    resetTimers();
  }, [params.runId, params.level, resetTimers]);

  // Enemy turn auto-step (every 360ms like the real page) — and attach each
  // resulting state to the most recent trace entry's enemyTurns chain.
  useEffect(() => {
    if (state.turn !== 'enemy' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => {
        if (s.turn !== 'enemy' || s.status !== 'playing') return s;
        const next = stepEnemyTurn(s);
        if (next !== s && lastTraceEntryRef.current) {
          lastTraceEntryRef.current.enemyTurns.push({ state: compact(next) });
        }
        return next;
      });
    }, 360);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.enemyMovedSquares.length]);

  useEffect(() => {
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), 440);
    return () => clearTimeout(t);
  }, [state.form]);

  const recordAction = useCallback(
    (
      pre: BoardState,
      post: BoardState,
      action: ActionRecord,
    ) => {
      const now = performance.now();
      if (startTimeRef.current == null) {
        startTimeRef.current = now;
        setStartedAt(new Date().toISOString());
      }
      const lastT = lastActionTimeRef.current ?? now;
      const tMs = Math.round(now - startTimeRef.current);
      const decisionMs = Math.round(now - lastT);
      lastActionTimeRef.current = now;
      stepCounterRef.current += 1;

      const legal = rookieLegalMoves(pre).map(toSquare);

      const entry: TraceEntry = {
        step: stepCounterRef.current,
        level: levelIndexRef.current + 1,
        tMs,
        decisionMs,
        action,
        legalMoves: legal,
        abilityOptionsAtDecision: pre.abilities.map((a) => ({
          id: a.id,
          tier: a.tier,
          usesLeft: a.usesLeftThisLevel,
        })),
        preState: compact(pre),
        postState: compact(post),
        enemyTurns: [],
      };
      lastTraceEntryRef.current = entry;
      setTrace((tr) => [...tr, entry]);
    },
    [],
  );

  const onActivateAbility = useCallback(
    (id: AbilityId) => {
      if (state.activeAbility?.id === id) {
        setState((s) => applyAbilityCancel(s));
        return;
      }
      const pre = state;
      const next = applyAbilityActivate(state, id);
      if (next === state) return;
      setSelectedSquare(null);
      setState(next);

      // Instant / transform: resolution happens inside applyAbilityActivate.
      // We detect "resolved on activate" by activeAbility staying null.
      if (next.activeAbility === null) {
        const def = ABILITY_DEFS[id];
        const tier = pre.abilities.find((a) => a.id === id)?.tier ?? 0;
        recordAction(pre, next, {
          kind: 'ability',
          id,
          tier,
          activation: def.activation,
        });
      }
    },
    [state, recordAction],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      if (state.status !== 'playing' || state.turn !== 'rookie') return;

      if (state.activeAbility) {
        const coord = fromSquare(square);
        const def = ABILITY_DEFS[state.activeAbility.id];

        if (square === toSquare(state.rookie)) {
          setState((s) => applyAbilityCancel(s));
          return;
        }

        if (def.activation === 'movement') {
          const pre = state;
          const id = state.activeAbility.id;
          const tier = state.abilities.find((a) => a.id === id)?.tier ?? 0;
          const next = applyAbilityMove(state, id, coord);
          if (next !== state) {
            setState(next);
            recordAction(pre, next, { kind: 'ability', id, tier, activation: def.activation, to: square });
          }
          return;
        }

        const pre = state;
        const id = state.activeAbility.id;
        const tier = state.abilities.find((a) => a.id === id)?.tier ?? 0;
        const next = applyAbilityTargeted(state, id, coord);
        if (next !== state) {
          setState(next);
          recordAction(pre, next, { kind: 'ability', id, tier, activation: def.activation, to: square });
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
      const pre = state;
      const next = applyRookieMove(state, target);
      if (next !== state) {
        setState(next);
        recordAction(pre, next, { kind: 'move', from: rookieSquare, to: square });
      }
      setSelectedSquare(null);
    },
    [state, selectedSquare, recordAction],
  );

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      if (state.status !== 'playing' || state.turn !== 'rookie') return false;
      if (state.activeAbility) return false;
      const target = fromSquare(targetSquare);
      const pre = state;
      const next = applyRookieMove(state, target);
      if (next === state) return false;
      setState(next);
      recordAction(pre, next, { kind: 'move', from: sourceSquare, to: targetSquare });
      setSelectedSquare(null);
      return true;
    },
    [state, recordAction],
  );

  const onOfferPick = useCallback(
    (option: AbilityOfferOption) => {
      const pre = state;
      const next = applyOfferPick(state, option);
      if (next !== state) {
        setState(next);
        recordAction(pre, next, { kind: 'offer-pick', option });
      }
    },
    [state, recordAction],
  );

  const onOfferSkip = useCallback(() => {
    const pre = state;
    const next = applyDismissOffer(state);
    if (next !== state) {
      setState(next);
      recordAction(pre, next, { kind: 'offer-skip' });
    }
  }, [state, recordAction]);

  const legalAbilityMoves: Coord[] | undefined = useMemo(() => {
    if (!state.activeAbility) return undefined;
    if (state.activeAbility.step !== 'pick-square') return undefined;
    return abilityLegalMoves(state, state.activeAbility.id);
  }, [state]);

  const activeAbilityTier = useMemo(() => {
    if (!state.activeAbility) return undefined;
    return state.abilities.find((a) => a.id === state.activeAbility!.id)?.tier;
  }, [state.activeAbility, state.abilities]);

  const buildDoc = useCallback((): TraceDoc => {
    const levelsCleared = trace.filter((e) => e.action.kind === 'level-clear').length;
    return {
      meta: {
        runId: params.runId,
        startLevel: params.level,
        finalLevel: levelIndex + 1,
        levelsCleared,
        totalLevels,
        puzzles,
        startedAt: startedAt ?? new Date().toISOString(),
        finishedAt: runOutcome === 'in-progress' ? null : new Date().toISOString(),
        outcome: runOutcome,
        totalMoves: trace.filter((e) => e.action.kind === 'move' || (e.action.kind === 'ability' && e.action.activation === 'movement')).length,
        totalCaptures: state.captures.length,
        schemaVersion: 2,
      },
      initialState: compact(game.state),
      entries: trace,
    };
  }, [params, game, startedAt, runOutcome, state, trace, levelIndex, totalLevels, puzzles]);

  const downloadJson = useCallback(() => {
    const doc = buildDoc();
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${params.runId}-L${params.level}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [buildDoc, params]);

  const saveToDisk = useCallback(async () => {
    setSaveMsg('Saving…');
    try {
      const res = await fetch('/api/run-trace', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(buildDoc()),
      });
      const j = await res.json();
      if (j.ok) setSaveMsg(`Saved → ${j.path}`);
      else setSaveMsg(`Error: ${j.error ?? 'unknown'}`);
    } catch (err) {
      setSaveMsg(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [buildDoc]);

  // Push a synthetic trace entry without consuming a "step" slot.
  const pushSynthetic = useCallback(
    (action: ActionRecord, snapshot: BoardState) => {
      const now = performance.now();
      const t0 = startTimeRef.current ?? now;
      const last = lastActionTimeRef.current ?? now;
      const entry: TraceEntry = {
        step: stepCounterRef.current,
        level: levelIndexRef.current + 1,
        tMs: Math.round(now - t0),
        decisionMs: Math.round(now - last),
        action,
        legalMoves: [],
        abilityOptionsAtDecision: [],
        preState: compact(snapshot),
        postState: compact(snapshot),
        enemyTurns: [],
      };
      lastTraceEntryRef.current = entry;
      setTrace((tr) => [...tr, entry]);
    },
    [],
  );

  // Level-clear auto-advance & run-end detection.
  const transitionGuardRef = useRef(false);
  useEffect(() => {
    if (state.status === 'won' && !transitionGuardRef.current) {
      transitionGuardRef.current = true;
      const curLevel = levelIndexRef.current + 1;
      const isFinal = levelIndex >= totalLevels - 1;
      pushSynthetic(
        { kind: 'level-clear', level: curLevel, nextLevel: isFinal ? null : curLevel + 1 },
        state,
      );

      if (isFinal) {
        setRunOutcome('run-complete');
        transitionGuardRef.current = false;
        return;
      }

      // Brief pause to show the cleared board, then load the next level
      // carrying tempo + abilities + any pending offer.
      setTransitioning(true);
      const t = setTimeout(() => {
        const nextIdx = levelIndex + 1;
        const nextPuzzle = puzzleForDate(todayISO(), nextIdx, params.runId);
        const nextState = puzzleToBoardState(nextPuzzle, {
          abilities: state.abilities,
          tempo: state.tempo,
          pendingOffer: state.pendingOffer,
          runId: params.runId,
        });
        setLevelIndex(nextIdx);
        setPuzzles((p) => [...p, { level: nextIdx + 1, puzzle: nextPuzzle }]);
        setState(nextState);
        setSelectedSquare(null);
        setTransitioning(false);
        transitionGuardRef.current = false;
      }, 900);
      return () => clearTimeout(t);
    }
    if (state.status === 'lost' && !transitionGuardRef.current) {
      transitionGuardRef.current = true;
      pushSynthetic({ kind: 'level-lost', level: levelIndexRef.current + 1 }, state);
      setRunOutcome('lost');
    }
  }, [state, levelIndex, totalLevels, params.runId, pushSynthetic]);

  useEffect(() => {
    if (runOutcome === 'in-progress') return;
    if (savedOnceRef.current) return;
    savedOnceRef.current = true;
    void saveToDisk();
  }, [runOutcome, saveToDisk]);

  return (
    <div className="min-h-dvh overflow-auto bg-chess-page text-chess-text">
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">
        <header className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-chess-text-muted">
              Trace Mode
            </div>
            <h1 className="text-xl font-black">{runDef.name} · Level {levelIndex + 1}/{totalLevels}</h1>
          </div>
          <div className="text-right text-xs text-chess-text-muted">
            <div>Step {trace.length}</div>
            <div>
              {runOutcome === 'in-progress'
                ? transitioning
                  ? 'Level cleared…'
                  : state.status
                : runOutcome === 'run-complete'
                  ? 'Run complete!'
                  : 'Run lost'}
            </div>
          </div>
        </header>

        <p className="text-xs text-chess-text-muted leading-relaxed">
          Every move and ability use is recorded with full state + decision time.
          Trace auto-saves on win/loss, or use the buttons below.
        </p>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-chess-text-muted">Moves {state.moveCount}{state.moveLimit ? `/${state.moveLimit}` : ''}</span>
          <span className="text-chess-text-muted">Captures {state.captures.length}</span>
          <span className="text-chess-text-muted">Tempo {state.tempo}</span>
        </div>

        <TempoBar tempo={state.tempo} form={state.form} formMovesLeft={state.formMovesLeft} />

        <div className="aspect-square w-full">
          <RunBoard
            state={state}
            selectedSquare={selectedSquare}
            glitching={glitching}
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

        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={resetGame}
            className="px-3 py-2 rounded-lg bg-chess-surface border border-chess-text/15 text-sm font-semibold"
          >
            Reset
          </button>
          <button
            onClick={downloadJson}
            className="px-3 py-2 rounded-lg bg-chess-surface border border-chess-text/15 text-sm font-semibold"
          >
            Download JSON
          </button>
          <button
            onClick={saveToDisk}
            className="px-3 py-2 rounded-lg bg-amber-500 text-black text-sm font-bold"
          >
            Save to disk
          </button>
          {saveMsg && (
            <span className="text-xs text-chess-text-muted self-center">{saveMsg}</span>
          )}
        </div>

        <details className="text-xs text-chess-text-muted">
          <summary className="cursor-pointer">Trace preview ({trace.length} entries)</summary>
          <ol className="mt-2 space-y-1 font-mono text-[10px] leading-tight">
            {trace.map((e, i) => (
              <li key={`${e.step}-${i}`}>
                #{e.step} +{e.decisionMs}ms ·{' '}
                {e.action.kind === 'move'
                  ? `move ${e.action.from}→${e.action.to}`
                  : e.action.kind === 'ability'
                    ? `ability ${e.action.id}${e.action.to ? ` @${e.action.to}` : ''}`
                    : e.action.kind === 'offer-pick'
                      ? `offer-pick ${e.action.option.id}`
                      : 'offer-skip'}
                {e.enemyTurns.length > 0 && ` · ${e.enemyTurns.length} enemy turn(s)`}
              </li>
            ))}
          </ol>
        </details>

        {state.pendingOffer && state.status === 'playing' && (
          <AbilityOfferModal
            offer={state.pendingOffer}
            onPick={onOfferPick}
            onSkip={onOfferSkip}
          />
        )}
      </div>
    </div>
  );
}
