/**
 * T3 — Casual.
 *
 * Plays like a thoughtful beginner. 1-ply lookahead only.
 *   - Won't blunder into a square that gets captured next enemy turn (with rare lapses)
 *   - Prefers advancing toward rank 8
 *   - Takes free captures
 *   - Reflexively raises Aegis when in immediate threat
 *   - Takes whatever offer is presented (preferring `new` over `upgrade` because variety)
 *   - Uses transforms when the transformed legal-move set includes a winning rank-8 reach
 */

import { stepEnemyTurn } from '../../../lib/run/pawn-ai';
import type { BoardState } from '../../../lib/run/types';
import { softmaxSample } from '../utils/rng';
import { applyBotAction } from './apply';
import {
  evalState,
  legalCandidates,
  rookieCanBeCapturedThisTurn,
} from './shared';
import type { Bot, BotAction, BotContext } from '../types';

export const T3: Bot = {
  id: 'T3',
  decide(state, ctx) {
    // Offer screen — pick first non-excluded option, else dismiss.
    if (state.pendingOffer) {
      return pickOfferCasual(state, ctx);
    }

    // Reactive Aegis tap — raise shield if rookie is threatened right now AND
    // we own aegis with charges.
    if (rookieCanBeCapturedThisTurn(state) && hasUsableAegis(state, ctx)) {
      return { kind: 'activate-ability', abilityId: 'aegis' };
    }

    const candidates = legalCandidates(state, ctx.excludedAbilities);
    if (candidates.length === 0) {
      // Dead-end: no legal moves. Engine will detect lost state on enemy turn.
      return { kind: 'move', target: { ...state.rookie } };
    }

    // 1-ply lookahead. For each candidate, simulate the resulting state +
    // one enemy turn cycle, then score.
    const scores = candidates.map((c) => scoreCandidate(state, c));
    const idx = softmaxSample(scores, 4, ctx.rng); // mild noise — casual lapses
    const chosen = candidates[idx];
    return candidateToAction(chosen);
  },
};

function scoreCandidate(
  state: BoardState,
  candidate: ReturnType<typeof legalCandidates>[number],
): number {
  const action = candidateToAction(candidate);
  const after = applyBotAction(state, action);
  if (after === state) return -10_000;
  const settled = settleEnemyTurns(after);
  return evalState(settled);
}

function candidateToAction(c: ReturnType<typeof legalCandidates>[number]): BotAction {
  if (c.kind === 'move') return { kind: 'move', target: c.target! };
  if (c.kind === 'activate-ability')
    return { kind: 'activate-ability', abilityId: c.abilityId! };
  return { kind: 'ability-target', abilityId: c.abilityId!, target: c.target! };
}

/**
 * Resolve enemy turns until control returns to Rookie (or game ends). This
 * is what makes 1-ply meaningful: we see the enemy's response to our move.
 */
export function settleEnemyTurns(state: BoardState): BoardState {
  let s = state;
  let guard = 0;
  while (s.status === 'playing' && s.turn === 'enemy' && guard < 64) {
    const next = stepEnemyTurn(s);
    if (next === s) break; // engine signaled no further enemy action this turn
    s = next;
    guard++;
  }
  return s;
}

function hasUsableAegis(state: BoardState, ctx: BotContext): boolean {
  if (ctx.excludedAbilities.has('aegis')) return false;
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return false;
  if (state.shieldUp) return false;
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return false;
  return true;
}

function pickOfferCasual(state: BoardState, ctx: BotContext): BotAction {
  const offer = state.pendingOffer!;
  const eligible: { idx: 0 | 1 }[] = [];
  offer.forEach((opt, i) => {
    if (ctx.excludedAbilities.has(opt.id)) return;
    eligible.push({ idx: i as 0 | 1 });
  });
  if (eligible.length === 0) return { kind: 'dismiss-offer' };
  // Casual preference: take whichever is offered first that isn't excluded.
  return { kind: 'pick-offer', optionIndex: eligible[0].idx };
}
