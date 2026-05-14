'use client';

/**
 * /test/decoy-tryout — forced Decoy round.
 *
 * Hand-built scenario where Decoy is the headline play:
 *   Rookie on c1 is threatened by a black knight on a2 (knight a2 → c1).
 *   A black queen sits on a8 with clean line down the a-file.
 *   Mark the knight → next enemy turn, the queen captures her own knight.
 *
 * Rookie comes pre-equipped with Decoy at T3 (2 turns / 2 uses).
 */

import { useCallback, useEffect, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { AbilityRack } from '@/components/run/AbilityRack';
import {
  ABILITY_DEFS,
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityTargeted,
  maxUsesForTier,
  type AbilityId,
} from '@/lib/run/abilities';
import { applyRookieMove, stepEnemyTurn } from '@/lib/run/engine';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState } from '@/lib/run/types';

function buildInitialState(): BoardState {
  return {
    rookie: { file: 3, rank: 1 }, // c1
    pieces: [
      { type: 'knight', color: 'black', file: 1, rank: 2 }, // a2 — threatens c1
      { type: 'queen', color: 'black', file: 1, rank: 8 }, // a8 — capturer
      { type: 'pawn', color: 'black', file: 4, rank: 3 }, // d3
      { type: 'bishop', color: 'black', file: 8, rank: 6 }, // h6
      { type: 'pawn', color: 'black', file: 6, rank: 5 }, // f5
    ],
    hazards: [],
    turn: 'rookie',
    status: 'playing',
    moveCount: 0,
    captures: [],
    tempo: 0,
    form: 'rook',
    formMovesLeft: 0,
    moveLimit: null,
    enemiesPerTurn: 1,
    enemyMovedSquares: [],
    enemyVacatedSquares: [],
    frozenSquares: [],
    frozenTurnsLeft: {},
    decoyTarget: null,
    decoyTurnsLeft: 0,
    abilities: [
      {
        id: 'decoy',
        tier: 3,
        mutations: [],
        usesLeftThisLevel: maxUsesForTier('decoy', 3),
      },
    ],
    pendingOffer: null,
    activeAbility: null,
    level: 1,
    bonusMovesLeft: 0,
    shieldUp: false,
  };
}

export default function DecoyTryoutPage() {
  const [state, setState] = useState<BoardState>(buildInitialState);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Enemy auto-step on enemy turns.
  useEffect(() => {
    if (state.turn !== 'enemy' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) =>
        s.turn === 'enemy' && s.status === 'playing' ? stepEnemyTurn(s) : s,
      );
    }, 380);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.enemyMovedSquares.length]);

  const onActivate = useCallback((id: AbilityId) => {
    setState((s) => applyAbilityActivate(s, id));
    setSelectedSquare(null);
  }, []);

  const onSquareClick = useCallback(
    (square: string) => {
      if (state.status !== 'playing' || state.turn !== 'rookie') return;

      // Ability targeting.
      if (state.activeAbility) {
        if (square === toSquare(state.rookie)) {
          setState((s) => applyAbilityCancel(s));
          return;
        }
        const coord = fromSquare(square);
        const def = ABILITY_DEFS[state.activeAbility.id];
        if (def.activation === 'targeted') {
          setState((s) =>
            applyAbilityTargeted(s, s.activeAbility!.id, coord),
          );
        }
        return;
      }

      const rookieSquare = toSquare(state.rookie);
      if (square === rookieSquare) {
        setSelectedSquare((cur) => (cur === square ? null : square));
        return;
      }
      if (!selectedSquare) return;

      setState((s) => applyRookieMove(s, fromSquare(square)));
      setSelectedSquare(null);
    },
    [state, selectedSquare],
  );

  const onPieceDrop = useCallback(
    (_from: string, to: string) => {
      if (state.status !== 'playing' || state.turn !== 'rookie') return false;
      if (state.activeAbility) return false;
      const next = applyRookieMove(state, fromSquare(to));
      if (next === state) return false;
      setState(next);
      setSelectedSquare(null);
      return true;
    },
    [state],
  );

  const reset = useCallback(() => {
    setState(buildInitialState());
    setSelectedSquare(null);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-auto bg-[#0d1424] text-white">
      <div className="max-w-md mx-auto p-4">
        <header className="mb-3">
          <h1 className="text-xl font-black tracking-tight">Decoy tryout</h1>
          <p className="text-xs text-white/70 mt-1 leading-snug">
            The knight on a2 will take Rookie next turn. Tap the{' '}
            <b>jester-mask card</b>, then tap the knight. Watch the queen on a8
            charge down to capture her own piece.
          </p>
        </header>

        <RunBoard
          state={state}
          selectedSquare={selectedSquare}
          onSquareClick={onSquareClick}
          onPieceDrop={onPieceDrop}
        />

        <div className="mt-3">
          <AbilityRack
            abilities={state.abilities}
            activeId={state.activeAbility?.id ?? null}
            onActivate={onActivate}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <div>
            <div>Turn: <b className="text-white">{state.turn}</b></div>
            <div>Status: <b className="text-white">{state.status}</b></div>
            {state.decoyTarget ? (
              <div>
                Decoy:{' '}
                <b className="text-fuchsia-300">
                  {state.decoyTarget} · {state.decoyTurnsLeft} turns left
                </b>
              </div>
            ) : null}
            <div>Captures: {state.captures.join(', ') || '—'}</div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
