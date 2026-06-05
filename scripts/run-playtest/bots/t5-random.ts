/**
 * T5 Random-pick — control bot for ability-strategy comparison.
 *
 * Uses T5_V01's full minimax for moves and ability-target decisions, but
 * picks offers uniformly at random (still respecting forced-accept /
 * forced-skip / excluded from the BotContext, since the ablation harness
 * relies on those).
 *
 * Purpose: lower-bound control. If T5_V03 (human-inspired focus-stack) and
 * T5_RANDOM win at similar rates, then focus-stacking doesn't matter and
 * any picking strategy is fine. If T5_V03 substantially beats RANDOM and
 * RANDOM beats V01's tier+kind heuristic, then offer strategy matters but
 * V01's specific rule is just bad.
 */

import type { BoardState } from '../../../lib/run/types';
import { T5_V01 } from './t5-v01';
import { describeAction } from '../utils/reason';
import type { Bot, BotAction, BotContext } from '../types';

export const T5_RANDOM: Bot = {
  id: 'T5',
  decide(state, ctx) {
    if (state.pendingOffer) {
      return pickOfferRandom(state, ctx);
    }
    return T5_V01.decide(state, ctx);
  },
  decideWithReasoning(state, ctx) {
    const action = this.decide(state, ctx);
    return {
      action,
      reasoning: `${describeAction(state, action)} — T5 random-pick`,
    };
  },
};

function pickOfferRandom(state: BoardState, ctx: BotContext): BotAction {
  const offer = state.pendingOffer;
  if (!offer) return { kind: 'dismiss-offer' };

  // Honor forcedAcceptIds first.
  for (let i = 0; i < offer.length; i++) {
    if (ctx.forcedAcceptIds.has(offer[i].id)) {
      return { kind: 'pick-offer', optionIndex: i as 0 | 1 };
    }
  }
  const eligible: (0 | 1)[] = [];
  offer.forEach((opt, i) => {
    if (ctx.excludedAbilities.has(opt.id)) return;
    if (ctx.forcedSkipIds.has(opt.id)) return;
    eligible.push(i as 0 | 1);
  });
  if (eligible.length === 0) return { kind: 'dismiss-offer' };
  const idx = eligible[Math.floor(ctx.rng() * eligible.length)];
  return { kind: 'pick-offer', optionIndex: idx };
}
