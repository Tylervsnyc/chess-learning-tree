/**
 * Helpers to synthesize a short "why" string from a bot's chosen action.
 * Used when a bot doesn't implement `decideWithReasoning` directly, or as a
 * supplement to the bot's own reason.
 *
 * Pure functions — no I/O, no engine side-effects.
 */

import { ABILITY_DEFS } from '../../../lib/run/abilities';
import { toSquare } from '../../../lib/run/types';
import type { BoardState } from '../../../lib/run/types';
import type { BotAction } from '../types';

/**
 * Synthesize a reason given (state-before, action, optional candidate count).
 * The viewer renders this so it should read naturally: short sentence-ish.
 */
export function synthesizeReason(
  state: BoardState,
  action: BotAction,
  opts: { candidatesConsidered?: number; evalScore?: number } = {},
): string {
  const parts: string[] = [describeAction(state, action)];

  if (opts.candidatesConsidered && opts.candidatesConsidered > 1) {
    parts.push(`(best of ${opts.candidatesConsidered})`);
  }

  return parts.join(' ');
}

/** Action → human-readable phrase like "moved to d4, capturing pawn". */
export function describeAction(state: BoardState, action: BotAction): string {
  switch (action.kind) {
    case 'pick-offer': {
      const opt = state.pendingOffer?.[action.optionIndex];
      if (!opt) return 'picked offer slot';
      const name = ABILITY_DEFS[opt.id]?.name ?? opt.id;
      return `accepted ${opt.kind === 'new' ? 'new' : 'upgrade:'} ${name} (T${opt.tier})`;
    }
    case 'dismiss-offer':
      return 'dismissed offer';
    case 'move': {
      const sq = toSquare(action.target);
      const captured = state.pieces.find(
        (p) =>
          p.file === action.target.file && p.rank === action.target.rank,
      );
      const from = toSquare(state.rookie);
      const rankDelta = action.target.rank - state.rookie.rank;
      const advanceTag =
        rankDelta > 0
          ? rankDelta === 1
            ? 'advances 1 rank'
            : `advances ${rankDelta} ranks`
          : rankDelta < 0
            ? 'retreats'
            : 'sidesteps';
      if (captured) {
        return `${from} → ${sq}, captures ${captured.type}; ${advanceTag}`;
      }
      return `${from} → ${sq}; ${advanceTag}`;
    }
    case 'activate-ability': {
      const name = ABILITY_DEFS[action.abilityId]?.name ?? action.abilityId;
      return `activated ${name}`;
    }
    case 'ability-target': {
      const name = ABILITY_DEFS[action.abilityId]?.name ?? action.abilityId;
      const sq = toSquare(action.target);
      const targetPiece = state.pieces.find(
        (p) =>
          p.file === action.target.file && p.rank === action.target.rank,
      );
      if (targetPiece) {
        return `${name} on ${sq} (${targetPiece.type})`;
      }
      return `${name} to ${sq}`;
    }
  }
}
