/**
 * Engine — applies a Rookie move, then runs enemy AI, then checks win/lose.
 *
 * Public surface:
 *   applyRookieMove(state, target)        → new BoardState
 *
 *   - Captures grant tempo (capped at TEMPO_MAX).
 *   - When tempo fills, an ability offer is rolled (see lib/run/abilities).
 *   - moveLimit (if set) ends the run when exceeded.
 */

import {
  isLegalRookieMove,
  rookieLegalMoves,
} from './movement';
import { offerIsExhausted, rollOffer } from './abilities';
import { stepEnemyTurn } from './pawn-ai';
import { mulberry32 } from './seed';
import { TEMPO_MAX, TEMPO_REWARD } from './scoring';
import type { BoardState, Coord, RookieForm } from './types';

function pushHistory(
  history: BoardState['history'],
  entry: BoardState['history'][number],
): BoardState['history'] {
  const next = [...history, entry];
  if (next.length > 2) next.shift();
  return next;
}

function offerRngFor(state: BoardState): () => number {
  // Deterministic per (level, moveCount) so replaying the same daily run
  // produces the same offers.
  const seed =
    (state.level * 7919 + state.moveCount * 31 + state.captures.length) >>> 0;
  return mulberry32(seed);
}

export function applyRookieMove(state: BoardState, target: Coord): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (!isLegalRookieMove(state, target)) return state;

  // Capture handling.
  const captured = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  const pieces = state.pieces.filter(
    (p) => !(p.file === target.file && p.rank === target.rank),
  );

  const tempoGain = captured ? TEMPO_REWARD[captured.type] ?? 0 : 0;
  const rawTempo = state.tempo + tempoGain;
  // Only captures can trigger an offer — prevents spurious offers on plain
  // moves when tempo is already at MAX.
  const filled =
    tempoGain > 0 && rawTempo >= TEMPO_MAX && state.pendingOffer === null;
  // When the meter fills, freeze it at MAX visually and queue the offer.
  const nextTempo = filled ? TEMPO_MAX : Math.min(TEMPO_MAX, rawTempo);

  // Form bookkeeping — decrement, revert to rook when expired.
  const movesLeftAfter = state.form === 'rook' ? 0 : state.formMovesLeft - 1;
  const nextForm: RookieForm = movesLeftAfter <= 0 ? 'rook' : state.form;
  const nextFormMovesLeft = nextForm === 'rook' ? 0 : movesLeftAfter;

  const nextMoveCount = state.moveCount + 1;
  const nextHistory = pushHistory(state.history, {
    rookie: { ...state.rookie },
    enemyPieces: state.pieces.map((p) => ({ ...p })),
  });

  const afterMove: BoardState = {
    ...state,
    rookie: { ...target },
    pieces,
    turn: 'enemy',
    moveCount: nextMoveCount,
    captures: captured ? [...state.captures, captured.type] : state.captures,
    tempo: nextTempo,
    form: nextForm,
    formMovesLeft: nextFormMovesLeft,
    history: nextHistory,
  };

  // When the meter fills, roll an offer — unless every ability is maxed, in
  // which case we just keep the tempo (as a small "blessing") and skip the modal.
  let nextPendingOffer = state.pendingOffer;
  let postOfferTempo = nextTempo;
  if (filled) {
    if (offerIsExhausted(afterMove)) {
      nextPendingOffer = null;
      // Keep tempo full as a visible "blessed" state.
      postOfferTempo = TEMPO_MAX;
    } else {
      const rolled = rollOffer(afterMove, offerRngFor(afterMove));
      nextPendingOffer = rolled.length > 0 ? rolled : null;
      if (rolled.length === 0) postOfferTempo = TEMPO_MAX;
    }
  }
  const withOffer: BoardState = {
    ...afterMove,
    tempo: postOfferTempo,
    pendingOffer: nextPendingOffer,
  };

  // Win check — reaching rank 8 wins the level. Apply a flat +2 tempo bonus
  // (capped) and queue an offer if the bonus fills the meter.
  if (target.rank === 8) {
    const winTempoRaw = state.tempo + 2;
    const winTempo = Math.min(TEMPO_MAX, winTempoRaw);
    let winPendingOffer = state.pendingOffer ?? null;
    if (filled) {
      winPendingOffer = nextPendingOffer;
    } else if (winPendingOffer === null && winTempoRaw >= TEMPO_MAX) {
      if (!offerIsExhausted(afterMove)) {
        const rolled = rollOffer(afterMove, offerRngFor(afterMove));
        winPendingOffer = rolled.length > 0 ? rolled : null;
      }
    }
    return {
      ...withOffer,
      status: 'won',
      turn: 'rookie',
      tempo: winPendingOffer ? TEMPO_MAX : winTempo,
      pendingOffer: winPendingOffer,
    };
  }

  // Move-limit loss check — over budget = run ends.
  if (afterMove.moveLimit !== null && nextMoveCount >= afterMove.moveLimit) {
    return { ...withOffer, status: 'lost', turn: 'rookie' };
  }

  // Hand off to enemy. UI ticks `stepEnemyTurn` so each enemy move animates
  // separately — no more mystery "rook disappeared" mid-batch.
  return { ...withOffer, enemyMovedSquares: [], enemyVacatedSquares: [] };
}

/** Re-export the single-step enemy advance for the UI. */
export { stepEnemyTurn };

/** Re-export helpers for the renderer. */
export { rookieLegalMoves };
// Keep RookieForm imported for downstream re-exports / typing parity.
export type { RookieForm };

export {
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityMove,
  applyAbilityTargeted,
  applyOfferPick,
  applyDismissOffer,
  abilityLegalMoves,
} from './abilities';
