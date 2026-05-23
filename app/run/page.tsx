'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
import { RunSummaryModal } from '@/components/run/RunSummaryModal';
import { computeStats, readHistory, recordRun } from '@/lib/run/history';
import { AbilityRack } from '@/components/run/AbilityRack';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { RunIntroModal } from '@/components/run/RunIntroModal';
import { RulesInline } from '@/components/run/RulesInline';
import { TempoHelpModal } from '@/components/run/TempoHelpModal';
import { RunPickerModal } from '@/components/run/RunPickerModal';
import { RookiesRunLogo } from '@/components/run/RookiesRunLogo';
import { StcRunLogo } from '@/components/run/StcRunLogo';
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
  convertTargets as computeConvertTargets,
  type AbilityId,
  type AbilityOfferOption,
} from '@/lib/run/abilities';
import { applyRookieMove, stepAllyTurn, stepDroneTurn, stepEnemyTurn } from '@/lib/run/engine';
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
import { getRunIdForDate, getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { buildShareString } from '@/lib/run/share';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, Coord, RunPuzzle } from '@/lib/run/types';

/**
 * Rookie's Run — Sprint 3.
 *
 * 10-level single daily run. Capturing pieces grants tempo; filling the tempo
 * meter offers 3 ability choices (new ability or upgrade). Abilities are
 * permanent for the run and live in the rack below the board.
 */

function readUrlParams(): { runId: string; startLevelIndex: number; date: string } {
  if (typeof window === 'undefined') {
    return { runId: '', startLevelIndex: 0, date: '' };
  }
  const params = new URLSearchParams(window.location.search);
  const runId = params.get('run') ?? '';
  const dateParam = params.get('date') ?? '';
  const date = isValidDate(dateParam) ? dateParam : '';
  const levelStr = params.get('level');
  let startLevelIndex = 0;
  if (levelStr) {
    const n = parseInt(levelStr, 10);
    if (!Number.isNaN(n) && n >= 1) startLevelIndex = n - 1;
  }
  return { runId, startLevelIndex, date };
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
  return { state: puzzleToBoardState(puzzle, { runId }), puzzle };
}

export default function RookiesRunPage() {
  const meta: RunMeta = useMemo(() => {
    const url = readUrlParams();
    const tz = typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      : 'UTC';
    const iso = url.date || (typeof window !== 'undefined' ? getTodayInTZ(tz) : todayISO());
    // Date-locked deep links (e.g. /run/[date] → /run?date=...&run=...) always
    // win. Otherwise: explicit ?run= → localStorage → today's daily rotation.
    const dailyRunForDate = getRunIdForDate(iso);
    let runId: string;
    if (url.date) {
      runId = url.runId && RUNS.some((r) => r.id === url.runId) ? url.runId : dailyRunForDate;
    } else {
      runId = url.runId || readSavedRunId();
      // Surface separation: a bare /run with no ?run= must never resolve to an
      // STC run from a stale localStorage entry — STC lives behind /run/stc only.
      if (!url.runId && runId.startsWith('stc-')) {
        runId = dailyRunForDate;
      }
      if (
        !url.runId &&
        typeof window !== 'undefined' &&
        !localStorage.getItem('rookies-run-current')
      ) {
        runId = dailyRunForDate;
      }
    }
    const validRunId = RUNS.some((r) => r.id === runId) ? runId : dailyRunForDate;
    if (typeof window !== 'undefined' && !url.date) {
      localStorage.setItem('rookies-run-current', validRunId);
    }
    const maxLevel = totalLevelsForRun(validRunId) - 1;
    const startLevelIndex = Math.min(url.startLevelIndex, maxLevel);
    return { iso, runId: validRunId, startLevelIndex };
  }, []);

  const runDef = useMemo(() => getRunById(meta.runId), [meta.runId]);
  const totalLevels = runDef.levels.length;
  const isStc = meta.runId.startsWith('stc-');

  const [levelIndex, setLevelIndex] = useState(meta.startLevelIndex);
  const initial = useMemo(
    () => freshRun(meta.iso, meta.runId, meta.startLevelIndex),
    [meta.iso, meta.runId, meta.startLevelIndex],
  );
  const [state, setState] = useState<BoardState>(initial.state);
  const [puzzle, setPuzzle] = useState<RunPuzzle>(initial.puzzle);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  // Per-ability cast VFX — phase-step ghost / leap arc /
  // freeze-ray beam / poison or rabies dart. Cleared after the matching anim ends.
  type AbilityFx = NonNullable<BoardState['lastAbilityFx']>;
  const [abilityFx, setAbilityFx] = useState<AbilityFx | null>(null);
  const lastAbilityFxIdRef = useRef<number | null>(null);

  // Aegis intercept VFX — attacker lunges at Rookie then bounces back, plus a
  // light-blue shield ripple at Rookie's square. Cleared after the anim ends.
  const [aegisFx, setAegisFx] = useState<
    { attackerSquare: string; rookieSquare: string; id: number } | null
  >(null);
  const lastAegisIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastAegisIntercept;
    if (!sig) return;
    if (lastAegisIdRef.current === sig.id) return;
    lastAegisIdRef.current = sig.id;
    setAegisFx({ ...sig });
  }, [state.lastAegisIntercept]);
  useEffect(() => {
    if (!aegisFx) return;
    const t = setTimeout(() => setAegisFx(null), 720);
    return () => clearTimeout(t);
  }, [aegisFx]);

  // Become-King impervious bounce VFX — distinct gold/royal-themed.
  const [imperviousFx, setImperviousFx] = useState<
    { attackerSquare: string; rookieSquare: string; id: number } | null
  >(null);
  const lastImperviousIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastImperviousBounce;
    if (!sig) return;
    if (lastImperviousIdRef.current === sig.id) return;
    lastImperviousIdRef.current = sig.id;
    setImperviousFx({ ...sig });
  }, [state.lastImperviousBounce]);
  useEffect(() => {
    if (!imperviousFx) return;
    const t = setTimeout(() => setImperviousFx(null), 700);
    return () => clearTimeout(t);
  }, [imperviousFx]);

  useEffect(() => {
    const sig = state.lastAbilityFx;
    if (!sig) return;
    if (lastAbilityFxIdRef.current === sig.id) return;
    lastAbilityFxIdRef.current = sig.id;
    setAbilityFx({ ...sig });
  }, [state.lastAbilityFx]);
  useEffect(() => {
    if (!abilityFx) return;
    const durations: Record<AbilityFx['kind'], number> = {
      'freeze-ray': 700,
      'poison-dart': 900,
      'rabies-dart': 900,
      convert: 500,
      drones: 800,
    };
    const t = setTimeout(() => setAbilityFx(null), durations[abilityFx.kind]);
    return () => clearTimeout(t);
  }, [abilityFx]);

  // Poison-death VFX — green bubbles drowning each piece whose poison timer
  // ticked to 0 this enemy turn.
  type PoisonDeathFx = NonNullable<BoardState['lastPoisonDeath']>;
  const [poisonDeathFx, setPoisonDeathFx] = useState<PoisonDeathFx | null>(null);
  const lastPoisonDeathIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastPoisonDeath;
    if (!sig) return;
    if (lastPoisonDeathIdRef.current === sig.id) return;
    lastPoisonDeathIdRef.current = sig.id;
    setPoisonDeathFx({ ...sig });
  }, [state.lastPoisonDeath]);
  useEffect(() => {
    if (!poisonDeathFx) return;
    const t = setTimeout(() => setPoisonDeathFx(null), 1100);
    return () => clearTimeout(t);
  }, [poisonDeathFx]);

  // Enemy-on-enemy capture VFX — overlay slide of the attacker sprite from
  // its origin square to the victim's square. Triggered by rabid friendly fire.
  type EnemyCaptureFx = NonNullable<BoardState['lastEnemyCaptureFx']>;
  const [enemyCaptureFx, setEnemyCaptureFx] = useState<EnemyCaptureFx | null>(null);
  const lastEnemyCaptureIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastEnemyCaptureFx;
    if (!sig) return;
    if (lastEnemyCaptureIdRef.current === sig.id) return;
    lastEnemyCaptureIdRef.current = sig.id;
    setEnemyCaptureFx({ ...sig });
  }, [state.lastEnemyCaptureFx]);
  useEffect(() => {
    if (!enemyCaptureFx) return;
    const t = setTimeout(() => setEnemyCaptureFx(null), 320);
    return () => clearTimeout(t);
  }, [enemyCaptureFx]);

  const [levelsCleared, setLevelsCleared] = useState(0);

  // ─────────────────────────────────────────────────────────────────────────
  // Recorder — captures every Rookie / ally / drone / enemy event so we can
  // replay sessions for bot training. POSTed to /api/run-trace on run end.
  // ─────────────────────────────────────────────────────────────────────────
  const traceEventsRef = useRef<Array<Record<string, unknown>>>([]);
  const traceStartRef = useRef<number>(Date.now());
  const tracePostedRef = useRef(false);
  const recordEvent = useCallback(
    (ev: Record<string, unknown>) => {
      traceEventsRef.current.push({ t: Date.now() - traceStartRef.current, ...ev });
    },
    [],
  );

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

  // Show the MTG-style intro card once per (run date), keyed by ISO.
  // Past-day links (vault) get the intro too the first time they're opened.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `rookies-run-intro-seen:${meta.iso}`;
    if (!localStorage.getItem(key)) {
      setShowIntro(true);
    }
  }, [meta.iso]);

  const dismissIntro = useCallback(() => {
    ensureAudioWarm();
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rookies-run-intro-seen:${meta.iso}`, '1');
    }
    setShowIntro(false);
    trackEvent('run_intro_dismissed', { iso: meta.iso });
  }, [meta.iso, ensureAudioWarm]);

  const [showTempoHelp, setShowTempoHelp] = useState(false);
  const openTempoHelp = useCallback(() => {
    ensureAudioWarm();
    setShowTempoHelp(true);
    trackEvent('run_tempo_help_opened', { iso: meta.iso });
  }, [meta.iso, ensureAudioWarm]);
  const closeTempoHelp = useCallback(() => setShowTempoHelp(false), []);

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

  // Ally phase — tick one ally at a time so each move animates.
  useEffect(() => {
    if (state.turn !== 'allies' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'allies' && s.status === 'playing' ? stepAllyTurn(s) : s));
    }, 420);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.allyTurnIndex]);

  // Drone phase — tick all live drones in parallel until the swarm finishes.
  useEffect(() => {
    if (state.turn !== 'drones' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'drones' && s.status === 'playing' ? stepDroneTurn(s) : s));
    }, 220);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.drones]);

  // ─────────────────────────────────────────────────────────────────────────
  // Recorder watchers — dedupe-aware ticks for ally / drone / enemy phases.
  // ─────────────────────────────────────────────────────────────────────────
  const lastDroneKeyRef = useRef<string>('');
  useEffect(() => {
    if (state.turn !== 'drones') return;
    const key = `${state.level}|${state.drones.map((d) => `${d.id}:${d.file},${d.rank},${d.alive ? 1 : 0},${d.steps}`).join(';')}`;
    if (key === lastDroneKeyRef.current) return;
    lastDroneKeyRef.current = key;
    recordEvent({
      kind: 'drone-tick',
      level: state.level,
      drones: state.drones.map((d) => ({ id: d.id, file: d.file, rank: d.rank, alive: d.alive, steps: d.steps })),
      enemyCount: state.pieces.length,
    });
  }, [state.turn, state.level, state.drones, state.pieces.length, recordEvent]);

  const lastAllyKeyRef = useRef<string>('');
  useEffect(() => {
    if (state.turn !== 'allies') return;
    const key = `${state.level}|${state.allyTurnIndex}|${state.allies.map((a) => `${a.id}:${a.file},${a.rank},${a.type}`).join(';')}`;
    if (key === lastAllyKeyRef.current) return;
    lastAllyKeyRef.current = key;
    recordEvent({
      kind: 'ally-tick',
      level: state.level,
      index: state.allyTurnIndex,
      allies: state.allies.map((a) => ({ id: a.id, file: a.file, rank: a.rank, type: a.type, source: a.source })),
      enemyCount: state.pieces.length,
    });
  }, [state.turn, state.level, state.allyTurnIndex, state.allies, state.pieces.length, recordEvent]);

  const lastEnemyTickLenRef = useRef<number>(0);
  useEffect(() => {
    if (state.turn !== 'enemy') {
      lastEnemyTickLenRef.current = 0;
      return;
    }
    const len = state.enemyMovedSquares.length;
    if (len <= lastEnemyTickLenRef.current) return;
    lastEnemyTickLenRef.current = len;
    recordEvent({
      kind: 'enemy-tick',
      level: state.level,
      movedToSq: state.enemyMovedSquares[len - 1],
      rookie: toSquare(state.rookie),
      enemyCount: state.pieces.length,
      allyCount: state.allies.length,
    });
  }, [state.turn, state.enemyMovedSquares, state.level, state.rookie, state.pieces.length, state.allies.length, recordEvent]);

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

    setLevelsCleared((n) => n + 1);

    trackEvent('run_level_cleared', {
      iso: meta.iso,
      level: levelIndex + 1,
      moves: state.moveCount,
      captures: state.captures.length,
      tempo: state.tempo,
    });

    if (levelIndex >= totalLevels - 1) {
      setRunComplete(true);
      trackEvent('run_completed', { iso: meta.iso, run: meta.runId });
      // Record completion for streak (auth-only on the server; silent for anon).
      // Only record when this is the actual daily for that date — not, e.g.,
      // an STC run or a hand-picked non-daily run via ?run=.
      if (!isStc && meta.runId === getRunIdForDate(meta.iso)) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        fetch('/api/run/complete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            runId: meta.runId,
            runDate: meta.iso,
            levelsCleared: totalLevels,
            tz,
          }),
        }).catch(() => {});
      }
    } else {
      setShowLevelCleared(true);
    }
  }, [state.status, state.moveCount, state.captures, state.tempo, levelIndex, showLevelCleared, runComplete, meta.iso, meta.runId, totalLevels]);

  const trackedLossRef = useRef(false);
  useEffect(() => {
    if (state.status !== 'lost') return;
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

  // Convert: while the ability is in pick-enemy mode, ring every eligible
  // enemy so the player can see which pieces are legal targets.
  const convertTargets = useMemo(() => {
    if (state.activeAbility?.id !== 'convert') return undefined;
    return computeConvertTargets(state);
  }, [state]);

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
        recordEvent({
          kind: 'ability-activate',
          level: state.level,
          ability: id,
          rookie: toSquare(state.rookie),
          enemyCount: state.pieces.length,
          allyCount: state.allies.length,
          droneCount: next.drones.length,
          turnAfter: next.turn,
        });
        setSelectedSquare(null);
        setState(next);
      }
    },
    [state, ensureAudioWarm, recordEvent],
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
            recordEvent({
              kind: 'ability-move',
              level: state.level,
              ability: state.activeAbility.id,
              target: square,
            });
            setState(next);
            playCardPlaySound();
          }
          return;
        }

        // Targeted (freeze ray / poison dart / rabies dart / decoy / convert).
        const next = applyAbilityTargeted(state, state.activeAbility.id, coord);
        if (next !== state) {
          recordEvent({
            kind: 'ability-target',
            level: state.level,
            ability: state.activeAbility.id,
            target: square,
            enemyCount: state.pieces.length,
            allyCount: state.allies.length,
          });
          setState(next);
          playCardPlaySound();
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
      const next = applyRookieMove(state, target);
      if (next !== state) {
        const grew = next.captures.length > state.captures.length;
        recordEvent({
          kind: 'rookie-move',
          level: state.level,
          from: toSquare(state.rookie),
          to: square,
          form: state.form,
          captured: grew ? next.captures[next.captures.length - 1] : null,
          tempo: next.tempo,
          enemyCount: next.pieces.length,
          allyCount: next.allies.length,
        });
        setState(next);
      }
      setSelectedSquare(null);
    },
    [state, selectedSquare, meta.iso, levelIndex, ensureAudioWarm, recordEvent],
  );

  const onPieceDrop = useCallback(
    (_sourceSquare: string, targetSquare: string) => {
      ensureAudioWarm();
      if (state.status !== 'playing' || state.turn !== 'rookie') return false;
      if (state.activeAbility) return false;
      const target = fromSquare(targetSquare);
      const next = applyRookieMove(state, target);
      if (next === state) return false;
      const grew = next.captures.length > state.captures.length;
      recordEvent({
        kind: 'rookie-move',
        level: state.level,
        from: toSquare(state.rookie),
        to: targetSquare,
        form: state.form,
        captured: grew ? next.captures[next.captures.length - 1] : null,
        tempo: next.tempo,
        enemyCount: next.pieces.length,
        allyCount: next.allies.length,
      });
      setState(next);
      setSelectedSquare(null);
      return true;
    },
    [state, ensureAudioWarm, recordEvent],
  );

  const onOfferPick = useCallback(
    (option: AbilityOfferOption) => {
      const next = applyOfferPick(state, option);
      if (next !== state) {
        recordEvent({
          kind: 'offer-pick',
          level: state.level,
          option: { kind: option.kind, id: option.id, tier: option.tier },
          choices: state.pendingOffer?.map((o) => ({ kind: o.kind, id: o.id, tier: o.tier })),
        });
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
    [state, meta.iso, levelIndex, recordEvent],
  );

  const onOfferSkip = useCallback(() => {
    const next = applyDismissOffer(state);
    if (next !== state) {
      recordEvent({
        kind: 'offer-skip',
        level: state.level,
        choices: state.pendingOffer?.map((o) => ({ kind: o.kind, id: o.id, tier: o.tier })),
      });
      setState(next);
      trackEvent('run_offer_skipped', {
        iso: meta.iso,
        level: levelIndex + 1,
      });
    }
  }, [state, meta.iso, levelIndex, recordEvent]);

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
        runId: meta.runId,
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
    setSelectedSquare(null);
    setLevelsCleared(0);
    setDying(false);
    setDeathSettled(false);
    setShowLevelCleared(false);
    setRunComplete(false);
    trackedStartRef.current = false;
    trackedLossRef.current = false;
    runRecordedRef.current = false;
    tracePostedRef.current = false;
    traceEventsRef.current = [];
    traceStartRef.current = Date.now();
    trackEvent('run_replayed', { iso: meta.iso, run: meta.runId });
  }, [meta.iso, meta.runId, meta.startLevelIndex]);

  const goToNextRun = useCallback(() => {
    // STC and regular runs are separate cycles — never advance across the line.
    let nextRunId: string;
    if (meta.runId.startsWith('stc-')) {
      const stcOrder = ['stc-king', 'stc-bishop', 'stc-pawn', 'stc-knight', 'stc-queen'];
      const i = stcOrder.indexOf(meta.runId);
      nextRunId = stcOrder[(i + 1) % stcOrder.length];
    } else {
      // Walk the regular cycle, skipping any STC entry that sneaks in.
      let candidate = getNextRunId(meta.runId);
      let guard = 0;
      while (candidate.startsWith('stc-') && guard++ < 50) {
        candidate = getNextRunId(candidate);
      }
      nextRunId = candidate;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('rookies-run-current', nextRunId);
      trackEvent('run_advanced', { from: meta.runId, to: nextRunId });
      // Navigate explicitly so STC runs land back inside the STC surface.
      // A bare /run with no ?run= would kick STC runs back to DEFAULT_RUN_ID.
      window.location.href = `/run?run=${encodeURIComponent(nextRunId)}`;
      return;
    }
    trackEvent('run_advanced', { from: meta.runId, to: nextRunId });
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
        trackEvent('run_picked', { from: meta.runId, to: runId });
        // Always navigate to /run?run=<id>. /run/stc redirects to stc-king,
        // so staying on that pathname would clobber the picked run.
        window.location.href = `/run?run=${encodeURIComponent(runId)}`;
        return;
      }
      trackEvent('run_picked', { from: meta.runId, to: runId });
    },
    [meta.runId],
  );

  const levelReached = runComplete
    ? totalLevels
    : state.status === 'lost'
      ? levelIndex + 1
      : Math.max(1, levelsCleared);

  // Run-end recorder POST — fires once when the run finishes (won or lost).
  useEffect(() => {
    if (tracePostedRef.current) return;
    if (!runComplete && state.status !== 'lost') return;
    tracePostedRef.current = true;
    if (state.status === 'lost') {
      recordEvent({
        kind: 'death',
        level: state.level,
        rookie: toSquare(state.rookie),
        turn: state.turn,
        pieces: state.pieces.map((p) => ({ type: p.type, sq: toSquare(p) })),
        allies: state.allies.map((a) => ({ id: a.id, type: a.type, sq: toSquare(a) })),
        drones: state.drones.map((d) => ({ id: d.id, file: d.file, rank: d.rank, alive: d.alive, steps: d.steps })),
        moveCount: state.moveCount,
        captures: state.captures,
      });
    }
    const body = {
      meta: {
        runId: meta.runId,
        iso: meta.iso,
        level: state.level,
        totalLevels,
        outcome: runComplete ? 'won' : 'lost',
        startedAt: new Date(traceStartRef.current).toISOString(),
      },
      events: traceEventsRef.current,
    };
    fetch('/api/run-trace', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  }, [runComplete, state, meta.runId, meta.iso, totalLevels, recordEvent]);

  // Record the finished run once, then read history for stats.
  const runRecordedRef = useRef(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  useEffect(() => {
    if (runRecordedRef.current) return;
    const finished = runComplete || (state.status === 'lost' && deathSettled);
    if (!finished) return;
    runRecordedRef.current = true;
    recordRun({
      iso: meta.iso,
      runId: meta.runId,
      levelReached,
      totalLevels,
      completed: runComplete,
    });
    setHistoryVersion((v) => v + 1);
  }, [runComplete, state.status, deathSettled, meta.iso, meta.runId, levelReached, totalLevels]);

  const stats = useMemo(() => computeStats(readHistory()), [historyVersion]);

  const shareString = buildShareString({
    iso: meta.iso,
    levelReached,
    totalLevels,
    completed: runComplete,
    currentStreak: stats.currentStreak,
  });

  void puzzle;

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md mx-auto w-full px-4 pt-1.5 pb-3 flex flex-col gap-2">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setShowRunPicker(true)}
              className="text-left active:opacity-70 transition-opacity shrink-0"
              aria-label="Switch run"
            >
              {isStc ? <StcRunLogo scale={0.45} /> : <RookiesRunLogo scale={0.45} />}
            </button>
            <RulesInline />
          </div>

          <div className="bg-chess-surface rounded-lg px-3 py-1.5 shadow-sm inline-flex items-center gap-1.5 leading-none shrink-0">
            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
              Lvl
            </span>
            <span className="text-sm font-black text-chess-text tabular-nums">
              {levelIndex + 1}
              <span className="text-chess-text-faint">/{totalLevels}</span>
            </span>
          </div>
        </header>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TempoBar
              tempo={state.tempo}
              form={state.form}
              formMovesLeft={state.formMovesLeft}
            />
          </div>
          <button
            type="button"
            onClick={openTempoHelp}
            aria-label="How tempo works"
            className="w-7 h-7 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted text-xs font-black transition-all shrink-0"
          >
            ?
          </button>
        </div>

        <div className="w-full">
          <RunBoard
            key={`level-${levelIndex}-${state.level}`}
            state={state}
            selectedSquare={selectedSquare}
            dying={dying}
            glitching={glitching}
            aegisFx={aegisFx}
            imperviousFx={imperviousFx}
            abilityFx={abilityFx}
            poisonDeathFx={poisonDeathFx}
            enemyCaptureFx={enemyCaptureFx}
            legalAbilityMoves={legalAbilityMoves}
            abilityTier={activeAbilityTier}
            convertTargets={convertTargets}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
            vanillaPieces={isStc}
          />
        </div>

        <AbilityRack
          abilities={state.abilities}
          activeId={state.activeAbility?.id ?? null}
          onActivate={onActivateAbility}
        />

        {state.abilities.some((a) => a.id === 'squad') && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-wide uppercase text-fuchsia-700 dark:text-fuchsia-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
            Passive: Squad
          </div>
        )}

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

      {!isStc && state.pendingOffer && state.status === 'playing' && !showIntro && (
        <AbilityOfferModal
          offer={state.pendingOffer}
          onPick={onOfferPick}
          onSkip={onOfferSkip}
        />
      )}

      {showIntro && (
        <RunIntroModal
          onClose={dismissIntro}
          tagline={isStc ? 'Powered by the Story Time Chess method' : undefined}
        />
      )}

      {showTempoHelp && <TempoHelpModal onClose={closeTempoHelp} />}

      {showRunPicker && (
        <RunPickerModal
          currentRunId={meta.runId}
          onPick={switchRun}
          onClose={() => setShowRunPicker(false)}
          filter={
            isStc
              ? (id: string) => id.startsWith('stc-')
              : (id: string) => !id.startsWith('stc-')
          }
          logo={isStc ? <StcRunLogo scale={0.5} /> : undefined}
          caption={isStc ? 'Five pieces, five mini-runs' : undefined}
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
          levelReached={levelReached}
          completed={runComplete}
          stats={stats}
          shareString={shareString}
          onReplay={resetRun}
          nextRunName={getRunById(
            isStc
              ? (['stc-king', 'stc-bishop', 'stc-pawn', 'stc-knight', 'stc-queen'][
                  (['stc-king', 'stc-bishop', 'stc-pawn', 'stc-knight', 'stc-queen'].indexOf(
                    meta.runId,
                  ) +
                    1) %
                    5
                ] ?? meta.runId)
              : getNextRunId(meta.runId),
          ).name}
          onNextRun={goToNextRun}
        />
      )}
    </div>
  );
}
