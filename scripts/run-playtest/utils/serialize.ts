/**
 * Convert a live `BoardState` into the lean `SerializedBoard` we ship inside
 * a decision-trace JSON file. The live state carries a lot of transient
 * engine fields (lastAbilityFx, enemyMovedSquares, cancellableActivation,
 * etc.) that a static viewer doesn't need — we keep only the bits required
 * to render the board + the bot's situation.
 *
 * Pure function; deep-copies arrays/objects so the trace can't be mutated by
 * later sim steps.
 */

import type { BoardState } from '../../../lib/run/types';
import type { SerializedBoard } from '../types';

export function serializeBoard(state: BoardState): SerializedBoard {
  return {
    rookie: { ...state.rookie },
    pieces: state.pieces.map((p) => ({
      type: p.type,
      file: p.file,
      rank: p.rank,
    })),
    hazards: state.hazards.map((h) => ({ ...h })),
    frozenSquares: [...state.frozenSquares],
    shieldUp: state.shieldUp,
    form: state.form,
    formMovesLeft: state.formMovesLeft,
    tempo: state.tempo,
    moveCount: state.moveCount,
    moveLimit: state.moveLimit,
    bonusMovesLeft: state.bonusMovesLeft,
    abilities: state.abilities.map((a) => ({
      id: a.id,
      tier: a.tier,
      usesLeftThisLevel: a.usesLeftThisLevel,
    })),
    pendingOffer:
      state.pendingOffer === null
        ? null
        : state.pendingOffer.map((o) => ({
            id: o.id,
            tier: o.tier,
            kind: o.kind,
          })),
    turn: state.turn,
    status: state.status,
  };
}
