/**
 * T5 — Expert.
 *
 * Live export: v0.1 (3-ply minimax, see `t5-v01.ts`).
 *
 * v0.2 (ability-aware planner) is implemented below as `T5_V02` but is
 * gated EXPERIMENTAL — does not meet acceptance bar.
 *
 *   Benchmark (100 trials × 110 levels, deterministic seeds):
 *     v0.2 overall: 94.2%
 *     v0.1 overall: 94.2%
 *     Regressed levels (>10pp drop, acceptance threshold):
 *       - iron-curtain/9  Δ -22.0pp  (53/100 vs 75/100)
 *       - the-gauntlet/9  Δ -12.0pp  ( 7/100 vs 19/100)
 *
 *   Re-run: `npx tsx scripts/run-playtest/bots/t5-benchmark.ts`
 *   Output: `data/run-playtest/raw/t5-benchmark.json`
 *
 * Hypothesis on the regression: in tightly-constrained late-run levels with
 * limited bonus moves, the ability-chain continuation can spend a Surge or
 * transform charge on a follow-up that scores marginally better by the eval
 * but burns a critical defensive option. The eval doesn't fully account for
 * "this ability is my last out" pressure.
 *
 * Next iteration ideas (not yet implemented):
 *   - Discount the score gain from chain-burning a finite-use ability
 *     proportional to 1/usesLeftThisLevel.
 *   - Add a "preserve last Aegis charge for terminal threat" heuristic.
 *   - Re-test with DEEP_BRANCH_K=10 or 12 to see if the branching cap is
 *     the culprit rather than the chain modeling.
 *
 * Until v0.3 lands, `T5` re-exports `T5_V01` so the live behaviour matches
 * the prior implementation exactly. The v0.2 logic stays in this file for
 * inspection and so `t5-benchmark.ts` can re-run the comparison cleanly.
 *
 * v0.2 description (preserved for reference):
 *   1. Surge planning — Surge keeps turn=rookie (bonus moves queue), so
 *      the search continues on the same rookie turn without decrementing
 *      depth. Surge is modeled as a free extra ply.
 *   2. Aegis foresight — Aegis is a free action; the search evaluates
 *      `aegis → best_move` vs `best_move` and picks whichever scores
 *      higher. The reactive tap is preserved as a fast-path safety net.
 *   3. Transform planning — bishop-step / knight-hop / queen-pulse keep
 *      turn=rookie; same continuation mechanism scores the best move in
 *      the new form before yielding.
 *   4. Continuation cap — any rookie "turn" can chain at most
 *      CONTINUATION_LIMIT free actions before yielding.
 */

import type { AbilityId } from '../../../lib/run/abilities';
import type { BoardState } from '../../../lib/run/types';
import { applyBotAction } from './apply';
import {
  type ActionCandidate,
  evalState,
  legalCandidates,
  rookieCanBeCapturedThisTurn,
} from './shared';
import { settleEnemyTurns } from './t3';
import { T5_V01 } from './t5-v01';
import { describeAction } from '../utils/reason';
import type { Bot, BotAction, BotContext } from '../types';

const DEEP_BRANCH_K = 8;
/** Hard cap on consecutive free-action chains within a single rookie "turn"
 *  (Aegis → Transform → Surge → move would be 3 free actions + a move). */
const CONTINUATION_LIMIT = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Live export — currently v0.1 per acceptance rule (see file header).
//
// We wrap T5_V01 here (instead of just re-exporting it) so the trace harness
// gets a `decideWithReasoning` hook without editing the frozen v0.1 file. The
// reasoning is synthesized from the chosen action shape — T5_V01 doesn't
// expose its internal eval scores, but the action + state delta is enough for
// the viewer to make sense of each turn.
export const T5: Bot = {
  id: 'T5',
  decide: T5_V01.decide.bind(T5_V01),
  decideWithReasoning(state, ctx) {
    const action = T5_V01.decide(state, ctx);
    return {
      action,
      reasoning: `${describeAction(state, action)} — T5 v0.1 3-ply argmax`,
    };
  },
};

// EXPERIMENTAL — does not meet acceptance bar (regresses iron-curtain/9 by
// 22pp and the-gauntlet/9 by 12pp at 100 trials). Kept here for benchmark +
// future iteration. Do NOT consume from sweep/nightly until acceptance passes.
export const T5_V02: Bot = {
  id: 'T5',
  decide(state, ctx) {
    if (state.pendingOffer) return pickOfferExpert(state, ctx);

    // Reactive safety net: if she's already in threat and Aegis is available,
    // tap it immediately. The deep search would also find this, but the
    // shortcut keeps decisions fast in the common case.
    if (rookieCanBeCapturedThisTurn(state) && hasUsableAegis(state, ctx)) {
      return { kind: 'activate-ability', abilityId: 'aegis' };
    }

    const candidates = legalCandidates(state, ctx.excludedAbilities);
    if (candidates.length === 0) {
      return { kind: 'move', target: { ...state.rookie } };
    }

    // First pass: shallow (1 rookie turn) score on every candidate.
    const shallow = candidates.map((c, i) => ({
      i,
      score: searchCandidate(state, c, 1, ctx.excludedAbilities, 0),
    }));
    shallow.sort((a, b) => b.score - a.score);

    // Deep-search the top-K candidates.
    const topK = shallow.slice(0, Math.min(DEEP_BRANCH_K, shallow.length));
    let bestIdx = topK[0].i;
    let bestScore = -Infinity;
    for (const { i } of topK) {
      const s = searchCandidate(state, candidates[i], 3, ctx.excludedAbilities, 0);
      if (s > bestScore) {
        bestScore = s;
        bestIdx = i;
      }
    }

    return candidateToAction(candidates[bestIdx]);
  },
};

function candidateToAction(c: ActionCandidate): BotAction {
  if (c.kind === 'move') return { kind: 'move', target: c.target! };
  if (c.kind === 'activate-ability')
    return { kind: 'activate-ability', abilityId: c.abilityId! };
  return { kind: 'ability-target', abilityId: c.abilityId!, target: c.target! };
}

/**
 * Score a single candidate. Each call models one rookie *action* (move,
 * activation, or targeted ability). If the resulting state still has
 * `turn === 'rookie'` (free action like Aegis/Surge/transform), we recurse
 * within the same rookie turn — up to CONTINUATION_LIMIT free actions —
 * before yielding to enemy settlement. After settling, if rookie still has
 * turns left in the search budget, we recurse into her next best action.
 *
 * Parameters:
 *   - rookieTurnsRemaining: how many full rookie turns (action → enemy
 *     settlement) we still have budget to explore. 1 = just this action.
 *   - excluded: abilities forbidden by the ablation context.
 *   - chainLen: how many free actions have stacked within the current
 *     rookie turn (prevents pathological recursion).
 */
function searchCandidate(
  state: BoardState,
  candidate: ActionCandidate,
  rookieTurnsRemaining: number,
  excluded: ReadonlySet<AbilityId>,
  chainLen: number,
): number {
  const action = candidateToAction(candidate);
  const after = applyBotAction(state, action);
  if (after === state) return -10_000;

  // Did this action keep control with rookie (free action like Aegis,
  // Surge, or a transform activation)? If so, search the best follow-up
  // within the same rookie turn — without decrementing rookieTurnsRemaining.
  const stillRookie =
    after.status === 'playing' && after.turn === 'rookie' && !after.pendingOffer;
  if (stillRookie && chainLen < CONTINUATION_LIMIT) {
    const followCands = legalCandidates(after, excluded);
    if (followCands.length === 0) return evalState(after);
    let best = -Infinity;
    for (const fc of followCands) {
      const s = searchCandidate(after, fc, rookieTurnsRemaining, excluded, chainLen + 1);
      if (s > best) best = s;
    }
    return best;
  }

  // Otherwise: yield to enemies, then continue the search if budget allows.
  const settled = settleEnemyTurns(after);
  if (rookieTurnsRemaining <= 1 || settled.status !== 'playing') {
    return evalState(settled);
  }
  const nextCands = legalCandidates(settled, excluded);
  if (nextCands.length === 0) return evalState(settled);
  let best = -Infinity;
  for (const nc of nextCands) {
    const s = searchCandidate(settled, nc, rookieTurnsRemaining - 1, excluded, 0);
    if (s > best) best = s;
  }
  return best;
}

function hasUsableAegis(state: BoardState, ctx: BotContext): boolean {
  if (ctx.excludedAbilities.has('aegis')) return false;
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return false;
  if (state.shieldUp) return false;
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return false;
  return true;
}

function pickOfferExpert(state: BoardState, ctx: BotContext): BotAction {
  const offer = state.pendingOffer!;
  // forcedAcceptIds wins over normal scoring — see T3/T4 for rationale.
  for (let i = 0; i < offer.length; i++) {
    if (ctx.forcedAcceptIds.has(offer[i].id)) {
      return { kind: 'pick-offer', optionIndex: i as 0 | 1 };
    }
  }
  let bestIdx = -1;
  let bestScore = -Infinity;
  offer.forEach((opt, i) => {
    if (ctx.excludedAbilities.has(opt.id)) return;
    if (ctx.forcedSkipIds.has(opt.id)) return;
    const synth = 3 + opt.tier + (opt.kind === 'new' ? 1 : 0);
    if (synth > bestScore) {
      bestScore = synth;
      bestIdx = i;
    }
  });
  if (bestIdx === -1) return { kind: 'dismiss-offer' };
  return { kind: 'pick-offer', optionIndex: bestIdx as 0 | 1 };
}
