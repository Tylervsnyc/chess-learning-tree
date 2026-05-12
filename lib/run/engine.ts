/**
 * Engine — applies a Rookie move, then runs enemy AI, then checks win/lose.
 *
 * Public surface:
 *   applyRookieMove(state, target)        → new BoardState
 *   applyTempoTransform(state, form)      → new BoardState
 *
 *   - Captures grant tempo (capped at TEMPO_MAX).
 *   - After each Rookie move, formMovesLeft decrements; when it hits 0 the
 *     form reverts to 'rook'.
 *   - moveLimit (if set) ends the run when exceeded.
 */

import {
  FORM_DURATION,
  isLegalRookieMove,
  rookieLegalMoves,
  transformCost,
} from './movement';
import { CARD_DEFS, HAND_SIZE, rollDraw, type CardId } from './cards';
import { stepEnemyTurn } from './pawn-ai';
import { TEMPO_MAX, TEMPO_REWARD } from './scoring';
import { toSquare } from './types';
import type { BoardState, Coord, RookieForm } from './types';

function removeCard(hand: CardId[], slotIndex: number): CardId[] {
  const out = hand.slice();
  out.splice(slotIndex, 1);
  return out;
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
  // Only captures can trigger a draw — prevents spurious draws on plain
  // moves when tempo is already at MAX (e.g. after a level-clear bonus).
  const filled =
    tempoGain > 0 && rawTempo >= TEMPO_MAX && state.pendingDraw === null;
  // When the meter fills, freeze it at MAX visually and queue a draw offer.
  // Tempo resets to 0 after the player picks a card.
  const nextTempo = filled ? TEMPO_MAX : Math.min(TEMPO_MAX, rawTempo);
  const nextPendingDraw = filled ? rollDraw(2) : state.pendingDraw;

  // Form bookkeeping — decrement, revert to rook when expired.
  const movesLeftAfter = state.form === 'rook' ? 0 : state.formMovesLeft - 1;
  const nextForm: RookieForm = movesLeftAfter <= 0 ? 'rook' : state.form;
  const nextFormMovesLeft = nextForm === 'rook' ? 0 : movesLeftAfter;

  const nextMoveCount = state.moveCount + 1;

  const afterMove: BoardState = {
    ...state,
    rookie: { ...target },
    pieces,
    turn: 'enemy',
    moveCount: nextMoveCount,
    captures: captured ? [...state.captures, captured.type] : state.captures,
    tempo: nextTempo,
    pendingDraw: nextPendingDraw,
    form: nextForm,
    formMovesLeft: nextFormMovesLeft,
  };

  // Win check — reaching rank 8 wins the level. The winning move's own
  // capture reward is discarded; instead, beating a level grants a flat +2
  // tempo bonus (capped at MAX). No card draw is triggered here even if
  // the bonus tops out the meter — the next capture will fire that.
  if (target.rank === 8) {
    return {
      ...afterMove,
      status: 'won',
      turn: 'rookie',
      tempo: Math.min(TEMPO_MAX, state.tempo + 2),
      pendingDraw: state.pendingDraw,
    };
  }

  // Move-limit loss check — over budget = run ends.
  if (afterMove.moveLimit !== null && nextMoveCount >= afterMove.moveLimit) {
    // Allow the player to use the LAST move (so >= rather than >). If they
    // didn't win on this move, they're out of moves → lost.
    return { ...afterMove, status: 'lost', turn: 'rookie' };
  }

  // Hand off to enemy. UI ticks `stepEnemyTurn` so each enemy move animates
  // separately — no more mystery "rook disappeared" mid-batch.
  return { ...afterMove, enemyMovedSquares: [] };
}

/** Re-export the single-step enemy advance for the UI. */
export { stepEnemyTurn };

/**
 * Transform Rookie into a new form. Costs tempo; no-op if insufficient tempo,
 * if not Rookie's turn, or if the form isn't allowed by the level.
 *
 * Transforming does NOT consume a move — it's a free action on Rookie's turn.
 * Transforming into the SAME form refreshes the timer.
 */
export function applyTempoTransform(
  state: BoardState,
  form: RookieForm,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (form === 'rook') return state; // can't manually revert; auto only
  const cost = transformCost(form);
  if (state.tempo < cost) return state;
  return {
    ...state,
    tempo: state.tempo - cost,
    form,
    formMovesLeft: FORM_DURATION,
  };
}

/** Re-export helpers for the renderer. */
export { rookieLegalMoves };

/**
 * Resolve a card draw: the player picked `picked` from `state.pendingDraw`.
 * The card slots into the hand (if there's room) and tempo resets to 0.
 * If the hand is full, the draw stays pending until the player discards or
 * plays a card.
 */
export function applyCardPick(state: BoardState, picked: CardId): BoardState {
  if (!state.pendingDraw || !state.pendingDraw.includes(picked)) return state;
  if (state.hand.length >= HAND_SIZE) return state;
  return {
    ...state,
    hand: [...state.hand, picked],
    pendingDraw: null,
    tempo: 0,
  };
}

/**
 * Dismiss a pending draw without taking a card (used when the hand is full
 * and the player can't pick). Tempo resets to 0.
 */
export function applyDismissDraw(state: BoardState): BoardState {
  if (!state.pendingDraw) return state;
  return { ...state, pendingDraw: null, tempo: 0 };
}

/** Discard a card from the hand without playing it. */
export function applyDiscard(state: BoardState, slotIndex: number): BoardState {
  if (slotIndex < 0 || slotIndex >= state.hand.length) return state;
  const hand = state.hand.slice();
  hand.splice(slotIndex, 1);
  return { ...state, hand };
}

/**
 * Play a card from the hand. For instant ("none" target) cards this resolves
 * immediately. Targeted cards (enemy/square) are not yet implemented and
 * return state unchanged.
 */
export function applyCardPlay(state: BoardState, slotIndex: number): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  const cardId = state.hand[slotIndex];
  if (!cardId) return state;
  const def = CARD_DEFS[cardId];
  if (def.target !== 'none') return state; // targeting UI not built yet

  let next: BoardState = state;
  switch (cardId) {
    case 'move-bishop':
      next = { ...state, form: 'bishop', formMovesLeft: 2 };
      break;
    case 'move-knight':
      next = { ...state, form: 'knight', formMovesLeft: 2 };
      break;
    case 'queen-mode':
      next = { ...state, form: 'queen', formMovesLeft: 1 };
      break;
    default:
      return state;
  }

  return { ...next, hand: removeCard(next.hand, slotIndex) };
}

/**
 * Bomb — destroy every enemy in a 3×3 area centered on `center`. The card
 * is consumed regardless of whether it actually hits anything; turn does
 * not pass to the enemy.
 */
export function applyBomb(
  state: BoardState,
  slotIndex: number,
  center: Coord,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (state.hand[slotIndex] !== 'bomb') return state;
  const pieces = state.pieces.filter(
    (p) => Math.abs(p.file - center.file) > 1 || Math.abs(p.rank - center.rank) > 1,
  );
  return { ...state, pieces, hand: removeCard(state.hand, slotIndex) };
}

/**
 * Freeze — mark the enemy on `target` as frozen. Returns the state
 * unchanged if no enemy is there. Frozen pieces are skipped on the next
 * enemy turn, then thawed automatically.
 */
export function applyFreeze(
  state: BoardState,
  slotIndex: number,
  target: Coord,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (state.hand[slotIndex] !== 'freeze') return state;
  const hit = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (!hit) return state;
  const sq = toSquare(target);
  if (state.frozenSquares.includes(sq)) return state;
  return {
    ...state,
    frozenSquares: [...state.frozenSquares, sq],
    hand: removeCard(state.hand, slotIndex),
  };
}

/**
 * Telekinesis — relocate one enemy to an empty square. `from` must have an
 * enemy on it, `to` must be empty (no enemy, not Rookie, not a hazard, and
 * in bounds).
 */
export function applyTelekinesis(
  state: BoardState,
  slotIndex: number,
  from: Coord,
  to: Coord,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (state.hand[slotIndex] !== 'telekinesis') return state;
  if (to.file < 1 || to.file > 8 || to.rank < 1 || to.rank > 8) return state;
  const mover = state.pieces.find(
    (p) => p.file === from.file && p.rank === from.rank,
  );
  if (!mover) return state;
  if (state.rookie.file === to.file && state.rookie.rank === to.rank) return state;
  if (state.pieces.some((p) => p.file === to.file && p.rank === to.rank)) return state;
  if (state.hazards.some((h) => h.file === to.file && h.rank === to.rank)) return state;
  const pieces = state.pieces.map((p) =>
    p === mover ? { ...p, file: to.file, rank: to.rank } : { ...p },
  );
  return { ...state, pieces, hand: removeCard(state.hand, slotIndex) };
}
