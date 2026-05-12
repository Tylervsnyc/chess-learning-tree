/**
 * Apply a BotAction to a BoardState by calling the appropriate engine fn.
 *
 * This is the bridge between the bot's logical "I want to do X" and the
 * engine's primitives (`applyRookieMove`, `applyAbilityActivate`, etc.).
 *
 * For ability-target actions we collapse the two engine steps (activate →
 * targeted-move) into a single call so the bot's decision is atomic.
 *
 * Returned state may still be on Rookie's turn if Surge was activated (no
 * turn handoff) or if an instant ability was tapped — callers should loop.
 */

import {
  applyAbilityActivate,
  applyAbilityMove,
  applyAbilityTargeted,
} from '../../../lib/run/abilities';
import { applyRookieMove } from '../../../lib/run/engine';
import { ABILITY_DEFS } from '../../../lib/run/abilities';
import type { BoardState } from '../../../lib/run/types';
import type { BotAction } from '../types';

export function applyBotAction(state: BoardState, action: BotAction): BoardState {
  switch (action.kind) {
    case 'move':
      return applyRookieMove(state, action.target);

    case 'activate-ability':
      return applyAbilityActivate(state, action.abilityId);

    case 'ability-target': {
      const activated = applyAbilityActivate(state, action.abilityId);
      if (!activated.activeAbility) {
        // Activation rejected (no uses, no ownership, etc.). Return state untouched.
        return state;
      }
      const def = ABILITY_DEFS[action.abilityId];
      if (def.activation === 'movement') {
        return applyAbilityMove(activated, action.abilityId, action.target);
      }
      if (def.activation === 'targeted') {
        return applyAbilityTargeted(activated, action.abilityId, action.target);
      }
      return activated;
    }

    case 'pick-offer':
    case 'dismiss-offer':
      // These are handled separately by the simulate loop, not via applyBotAction.
      return state;
  }
}
