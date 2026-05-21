/**
 * T4 — Sharp.
 *
 * 2-ply minimax with the same eval as T3 but applied recursively. Rookie
 * maximizes; the enemy responds (deterministically — engine picks one move per
 * turn). At depth-2 the bot sees: "if I play move X, opponent plays Y, then I
 * play Z" — so it can spot 2-move tactical sequences.
 *
 * Plus: smarter ability use.
 *   - Aegis when threatened next turn
 *   - Surge when there's a sequential winning line (captures or rank-8 reach)
 *   - Transforms when transformed move set yields strictly better score
 *   - All movement/targeted abilities are enumerated as candidates and scored
 *     just like regular moves
 */

import type { BoardState } from '../../../lib/run/types';
import { softmaxSample } from '../utils/rng';
import { applyBotAction } from './apply';
import {
  evalState,
  legalCandidates,
  rookieCanBeCapturedThisTurn,
  valueOfOffer,
} from './shared';
import { describeAction } from '../utils/reason';
import type { Bot, BotAction, BotContext, BotDecision } from '../types';
import { settleEnemyTurns } from './t3';

export const T4: Bot = {
  id: 'T4',
  decide(state, ctx) {
    return decideT4(state, ctx).action;
  },
  decideWithReasoning(state, ctx) {
    return decideT4(state, ctx);
  },
};

function decideT4(state: BoardState, ctx: BotContext): BotDecision {
  if (state.pendingOffer) {
    const action = pickOfferSharp(state, ctx);
    return { action, reasoning: describeAction(state, action) };
  }

  if (rookieCanBeCapturedThisTurn(state) && hasUsableAegis(state, ctx)) {
    return {
      action: { kind: 'activate-ability', abilityId: 'aegis' },
      reasoning: 'rookie is in threat — reactive Aegis',
    };
  }

  const candidates = legalCandidates(state, ctx.excludedAbilities);
  if (candidates.length === 0) {
    return {
      action: { kind: 'move', target: { ...state.rookie } },
      reasoning: 'no legal moves — stuck (dead-end)',
    };
  }

  const scores = candidates.map((c) => searchDepth(state, c, /* depth */ 2));
  const idx = softmaxSample(scores, 1.5, ctx.rng); // sharper than T3, mild noise
  const chosen = candidates[idx];
  const action = candidateToAction(chosen);
  return {
    action,
    reasoning: `${describeAction(state, action)} — 2-ply best of ${candidates.length} (eval ${scores[idx].toFixed(1)})`,
    evalScore: scores[idx],
    candidatesConsidered: candidates.length,
  };
}

export function searchDepth(
  state: BoardState,
  candidate: ReturnType<typeof legalCandidates>[number],
  depth: number,
): number {
  const action = candidateToAction(candidate);
  const after = applyBotAction(state, action);
  if (after === state) return -10_000;
  const settled = settleEnemyTurns(after);
  if (depth <= 1 || settled.status !== 'playing') return evalState(settled);

  // Recurse: pick rookie's best next move, score that.
  const nextCands = legalCandidates(settled, new Set());
  if (nextCands.length === 0) return evalState(settled);
  let best = -Infinity;
  for (const nc of nextCands) {
    const s = searchDepth(settled, nc, depth - 1);
    if (s > best) best = s;
  }
  return best;
}

function candidateToAction(c: ReturnType<typeof legalCandidates>[number]): BotAction {
  if (c.kind === 'move') return { kind: 'move', target: c.target! };
  if (c.kind === 'activate-ability')
    return { kind: 'activate-ability', abilityId: c.abilityId! };
  return { kind: 'ability-target', abilityId: c.abilityId!, target: c.target! };
}

function hasUsableAegis(state: BoardState, ctx: BotContext): boolean {
  if (ctx.excludedAbilities.has('aegis')) return false;
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return false;
  if (state.shieldUp) return false;
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return false;
  return true;
}

function pickOfferSharp(state: BoardState, ctx: BotContext): BotAction {
  const offer = state.pendingOffer!;
  // forcedAcceptIds wins over normal scoring — see T3 for rationale.
  for (let i = 0; i < offer.length; i++) {
    if (ctx.forcedAcceptIds.has(offer[i].id)) {
      return { kind: 'pick-offer', optionIndex: i as 0 | 1 };
    }
  }
  // Board-aware: each option scored by what it would do on THIS board.
  let bestIdx = -1;
  let bestScore = -Infinity;
  offer.forEach((opt, i) => {
    if (ctx.excludedAbilities.has(opt.id)) return;
    if (ctx.forcedSkipIds.has(opt.id)) return;
    const v = valueOfOffer(state, opt.id, opt.tier, opt.kind);
    if (v > bestScore) {
      bestScore = v;
      bestIdx = i;
    }
  });
  if (bestIdx === -1) return { kind: 'dismiss-offer' };
  return { kind: 'pick-offer', optionIndex: bestIdx as 0 | 1 };
}
