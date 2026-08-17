/**
 * MCTS-rollouts bot. For each legal candidate action, play N forward rollouts
 * to terminal (or depth cap) and pick the action with the most wins.
 *
 * Rollouts use a fast, weighted-random rollout policy over top-K candidates
 * scored by a stripped-down eval (rank, threat, material). The full evalState
 * is too slow for hundreds of rollouts × ~40 depth.
 *
 * Why this exists: hand-coded evals kept missing things (e.g. Surge looking
 * weak because the bonus-move continuation was modeled wrong). MCTS just
 * plays forward — if Surge wins games, it shows up in the rollout wins.
 */

import {
  applyDismissOffer,
  applyOfferPick,
  formForAbility,
} from '../../../lib/run/abilities';
import type { AbilityId } from '../../../lib/run/abilities';
import { rookieLegalMoves } from '../../../lib/run/movement';
import { mulberry32 } from '../../../lib/run/seed';
import type { BoardState } from '../../../lib/run/types';
import { toSquare } from '../../../lib/run/types';
import { applyBotAction } from './apply';
import { strategicBonus } from './ability-eval';
import { type ActionCandidate, legalCandidates } from './shared';
import { settleEnemyTurns } from './t3';
import { describeAction } from '../utils/reason';
import { hashString } from '../utils/rng';
import type { Bot, BotAction, BotContext, BotDecision } from '../types';

const MAX_ROLLOUT_DEPTH = 40;
const ROLLOUT_TOPK = 3;

interface MctsOpts {
  name: string;
  rolloutCount: number;
  /** Which tier id to expose. */
  id: 'T3' | 'T4' | 'T5';
}

export function createMctsBot(opts: MctsOpts): Bot {
  let decisionIndex = 0;
  const decide = (state: BoardState, ctx: BotContext): BotAction => {
    return decideMcts(state, ctx, opts, decisionIndex++).action;
  };
  return {
    id: opts.id,
    decide,
    decideWithReasoning(state, ctx) {
      return decideMcts(state, ctx, opts, decisionIndex++);
    },
  };
}

function decideMcts(
  state: BoardState,
  ctx: BotContext,
  opts: MctsOpts,
  decisionIdx: number,
): BotDecision {
  // Offer screens — pick the best option using a quick simulated comparison.
  // (Rollouts after the pick happen naturally on subsequent decisions.)
  if (state.pendingOffer) {
    return decideOffer(state, ctx);
  }

  const candidates = legalCandidates(state, ctx.excludedAbilities);
  if (candidates.length === 0) {
    return {
      action: { kind: 'move', target: { ...state.rookie } },
      reasoning: 'no legal moves',
    };
  }
  if (candidates.length === 1) {
    const action = candidateToAction(candidates[0]);
    return { action, reasoning: describeAction(state, action) };
  }

  // Seed a fresh RNG per decision for reproducible rollout sampling.
  const seedStr = `${opts.id}:${decisionIdx}:${state.moveCount}:${state.rookie.file},${state.rookie.rank}`;
  const rng = mulberry32(hashString(seedStr));

  const wins = new Array(candidates.length).fill(0);
  const scoreSum = new Array(candidates.length).fill(0);
  const perCand = Math.max(1, Math.floor(opts.rolloutCount / candidates.length));

  for (let ci = 0; ci < candidates.length; ci++) {
    const action = candidateToAction(candidates[ci]);
    const after = applyBotAction(state, action);
    if (after === state) {
      wins[ci] = -1; // illegal
      continue;
    }
    for (let r = 0; r < perCand; r++) {
      const result = playout(after, rng, opts.id);
      if (result.win) wins[ci] += 1;
      scoreSum[ci] += result.score;
    }
    // Strategic prior (ability-eval): abilities with delayed/positional payoff
    // (convert, squad, decoy, poison) look flat to short rollouts — the prior
    // breaks ties toward the strategically right cast. Scaled by perCand so it
    // stays comparable to the summed playout scores.
    scoreSum[ci] += strategicBonus(state, action, opts.id) * perCand;
  }

  let bestIdx = 0;
  let bestWins = -2;
  let bestTie = -Infinity;
  for (let i = 0; i < candidates.length; i++) {
    if (wins[i] > bestWins || (wins[i] === bestWins && scoreSum[i] > bestTie)) {
      bestIdx = i;
      bestWins = wins[i];
      bestTie = scoreSum[i];
    }
  }

  const chosen = candidates[bestIdx];
  const action = candidateToAction(chosen);
  const wr = bestWins < 0 ? 0 : bestWins / perCand;
  return {
    action,
    reasoning: `${describeAction(state, action)} — MCTS ${bestWins}/${perCand} (${(wr * 100).toFixed(0)}% rollout win)`,
    evalScore: wr,
    candidatesConsidered: candidates.length,
  };
}

/** Run a single rollout to terminal / depth cap. Returns win flag + tiebreaker score. */
function playout(
  start: BoardState,
  rng: () => number,
  tier: MctsOpts['id'],
): { win: boolean; score: number } {
  let state = start;
  let depth = 0;
  // Settle any enemy turns left over from the seeding action.
  state = settleEnemyTurns(state);

  while (state.status === 'playing' && depth < MAX_ROLLOUT_DEPTH) {
    if (state.pendingOffer) {
      // Score each option with the same offerUsefulness the root decision
      // uses — random offer picks build incoherent loadouts and poison the
      // win estimate on ability-dependent levels.
      const offer = state.pendingOffer;
      if (offer.length > 0) {
        let bestIdx = 0;
        let bestScore = -Infinity;
        for (let i = 0; i < offer.length; i++) {
          const s = offerUsefulness(state, offer[i]);
          if (s > bestScore) {
            bestScore = s;
            bestIdx = i;
          }
        }
        state = applyOfferPick(state, offer[bestIdx]);
      } else {
        state = applyDismissOffer(state);
      }
      continue;
    }

    if (state.turn === 'enemy') {
      state = settleEnemyTurns(state);
      continue;
    }

    // Rookie's turn — pick action by weighted-random over top-K.
    const cands = legalCandidates(state, EMPTY_SET);
    if (cands.length === 0) break;
    const pick = pickRolloutAction(state, cands, rng, tier);
    const action = candidateToAction(pick);
    const next = applyBotAction(state, action);
    if (next === state) break;
    state = next;
    depth++;
  }

  // Settle any final enemy turns to get terminal status.
  if (state.status === 'playing' && state.turn === 'enemy') {
    state = settleEnemyTurns(state);
  }

  if (state.status === 'won') return { win: true, score: 100 };
  if (state.status === 'lost') return { win: false, score: -100 };
  // Depth-capped without resolution. Treat as half-win if rookie is alive
  // and near the goal, else loss. Returns a useful tiebreaker score.
  const score = fastScore(state);
  // Don't count timeouts as wins — long stalls = bad. But use score as tiebreak.
  return { win: false, score };
}

const EMPTY_SET = new Set<never>() as ReadonlySet<never>;

/**
 * Lightweight rollout policy: score candidates with a fast inline eval and
 * weighted-random sample from the top-K. Captures explore ability use too
 * since `legalCandidates` returns abilities as candidates.
 */
function pickRolloutAction(
  state: BoardState,
  cands: ActionCandidate[],
  rng: () => number,
  tier: MctsOpts['id'],
): ActionCandidate {
  if (cands.length === 1) return cands[0];

  // Score each by quick "post-action" fast eval. Skip enemy settlement here —
  // expensive — use pre-settle delta as a proxy. This is intentional: speed
  // matters more than precision for rollouts.
  // "Stuck rook" detector: a rook walled in by hazards (the X, Knight's
  // Academy, etc.) has no legal move that gains rank. Shuffling sideways
  // forever is a dead-end — the ONLY progress is to transform into an allowed
  // form that can cross the diagonal. Without this nudge the rollout policy
  // sees a transform as just-another-move and never explores the path that
  // actually wins, so the sweep false-flags these levels as unbeatable.
  const stuckRook = isStuckRook(state);

  const scored: { c: ActionCandidate; s: number }[] = [];
  for (const c of cands) {
    const action = candidateToAction(c);
    const after = applyBotAction(state, action);
    if (after === state) continue;
    let s = fastScore(after);
    const isAbilityCast =
      c.kind === 'activate-ability' || c.kind === 'ability-target';
    // Encourage occasional ability casts so rollouts explore ability use.
    if (isAbilityCast) {
      // Per-ability strategic scoring (tier-scaled) — the reason a convert,
      // decoy, or poison cast can look better than a null move to a rollout
      // that will never see its delayed payoff.
      s += strategicBonus(state, action, tier);
      s += rng(); // small jitter — exploration on near-ties
      // A transform that gives the new form an advancing move when the rook
      // had none is the key out of the trap — make rollouts take it.
      if (
        c.kind === 'activate-ability' &&
        formForAbility(c.abilityId!) !== null &&
        stuckRook &&
        bestReachRank(after) > state.rookie.rank
      ) {
        s += 80;
      }
    }
    scored.push({ c, s });
  }
  if (scored.length === 0) return cands[0];

  scored.sort((a, b) => b.s - a.s);
  const top = scored.slice(0, Math.min(ROLLOUT_TOPK, scored.length));
  // Softmax-ish: weight by exp((s - max) / T), T = 8 (broad).
  const max = top[0].s;
  const T = 8;
  const weights = top.map((t) => Math.exp((t.s - max) / T));
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = rng() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return top[i].c;
  }
  return top[top.length - 1].c;
}

/** Highest rank Rookie can reach in one move with her current form. */
function bestReachRank(state: BoardState): number {
  let best = state.rookie.rank;
  for (const m of rookieLegalMoves(state)) {
    if (m.rank > best) best = m.rank;
  }
  return best;
}

/**
 * True when Rookie is a rook that has no straight-line path to the goal on a
 * hazard-walled map — either she can't gain a rank right now, OR no file is
 * vertically clear to rank 8. On the X / Knight's Academy maps this is the
 * signal that she must transform to make progress instead of shuffling along
 * a rank forever (which depth-capped rollouts can't tell apart from progress).
 */
function isStuckRook(state: BoardState): boolean {
  if (state.form !== 'rook') return false;
  if (state.hazards.length < 4) return false;
  // Walled in right now — can't even gain a rank.
  if (bestReachRank(state) <= state.rookie.rank) return true;
  // Or: no file offers a clear vertical run to rank 8 from her current rank,
  // so advancing as a rook just leads into the wall. Transform instead.
  for (let f = 1; f <= 8; f++) {
    let clear = true;
    for (let r = state.rookie.rank + 1; r <= 8; r++) {
      if (state.hazards.some((h) => h.file === f && h.rank === r)) {
        clear = false;
        break;
      }
    }
    if (clear) return false; // a clean rook path exists — not stuck
  }
  return true;
}

/**
 * Fast state eval — rank, threat, material, status. Intentionally cheap.
 * No legal-move enumeration, no attack-map computation. Used inside rollouts
 * where speed matters more than accuracy.
 */
function fastScore(state: BoardState): number {
  if (state.status === 'won') return 10_000;
  if (state.status === 'lost') return -10_000;
  let s = state.rookie.rank * 6; // advance toward goal
  // Cheap threat proxy: is any enemy pawn one diagonal step from rookie?
  // Skip pricey slide-attack projection in rollouts.
  const rf = state.rookie.file;
  const rr = state.rookie.rank;
  if (state.form !== 'king') {
    for (const p of state.pieces) {
      const df = Math.abs(p.file - rf);
      const dr = p.rank - rr;
      if (p.type === 'pawn' && df === 1 && dr === 1) {
        s -= 20;
        break;
      }
      // Knight check — single jump
      if (p.type === 'knight') {
        const adf = Math.abs(p.file - rf);
        const adr = Math.abs(p.rank - rr);
        if ((adf === 1 && adr === 2) || (adf === 2 && adr === 1)) {
          s -= 18;
          break;
        }
      }
    }
  }
  // Material on board (penalty — clearing pieces = good).
  s -= state.pieces.length * 0.8;
  // Tempo / abilities (latent power).
  s += state.tempo * 0.3;
  s += state.abilities.length * 1.5;
  if (state.shieldUp) s += 4;
  if (state.bonusMovesLeft > 0) s += state.bonusMovesLeft * 4;
  if (state.moveLimit !== null) {
    const slack = state.moveLimit - state.moveCount;
    if (slack <= 0) return -10_000;
    s += Math.min(slack, 6);
  }
  // Reach-aware advancement signal. Rather than only checking for a winning
  // slide near the top, reward how far up the board the current form can move
  // RIGHT NOW. This is what separates a bishop that can cross the X (reaches
  // rank 8) from a rook trapped on the same square (reaches nothing) — without
  // it, a transform that opens the path looks identical to standing still.
  const reach = bestReachRank(state);
  if (reach === 8) {
    s += 40;
  } else if (reach > rr) {
    s += (reach - rr) * 2;
  } else if (state.form === 'rook' && state.hazards.length >= 4) {
    // A walled-in rook that can't gain a rank is going nowhere — discourage
    // lingering in that state so rollouts favor transforming out of it.
    s -= 12;
  }
  return s;
}

/**
 * How useful an offered ability is *to this board*. Locked-form runs (the X,
 * Knight's Academy, etc.) wall off the rook with hazards — the only way through
 * is a transform that matches an allowed form. So we weight the offer by
 * whether picking it unlocks movement Rookie can't otherwise make, not just by
 * raw tier. Without this the bot would happily bank Surge while sitting trapped
 * behind a hazard diagonal, never taking the bishop-step that actually wins.
 */
function offerUsefulness(state: BoardState, opt: { id: AbilityId; kind: 'new' | 'upgrade'; tier: number }): number {
  let s = 3 + opt.tier + (opt.kind === 'new' ? 1 : 0);

  // Transform abilities. If the board has hazards (a walled/locked-form map)
  // and Rookie is currently a rook with few/no safe advancing moves, a
  // matching transform is the key that opens the level — weight it massively.
  const form = formForAbility(opt.id);
  if (form && form !== 'rook') {
    const hazardWalled = state.hazards.length >= 4;
    s += 6; // a movement key is broadly valuable on themed maps
    if (hazardWalled) s += 12; // ...and decisive when the map is walled
  }
  // Surge / Aegis are always handy but shouldn't outrank the one transform
  // that unwalls the board, so keep their bump modest.
  if (opt.id === 'surge' || opt.id === 'aegis') s += 2;
  // v2 set (convert/squad/drones): board-presence abilities whose value
  // scales with enemy density. Without a bump here squad-gated levels
  // false-flag — bots would never draft the ability the level is built on.
  if (opt.id === 'squad' || opt.id === 'drones' || opt.id === 'convert') {
    s += Math.min(6, state.pieces.length * 0.5);
  }
  return s;
}

function decideOffer(state: BoardState, ctx: BotContext): BotDecision {
  const offer = state.pendingOffer!;
  for (let i = 0; i < offer.length; i++) {
    if (ctx.forcedAcceptIds.has(offer[i].id)) {
      const a: BotAction = { kind: 'pick-offer', optionIndex: i as 0 | 1 };
      return { action: a, reasoning: 'forced-accept' };
    }
  }
  let bestIdx = -1;
  let bestScore = -Infinity;
  offer.forEach((opt, i) => {
    if (ctx.excludedAbilities.has(opt.id)) return;
    if (ctx.forcedSkipIds.has(opt.id)) return;
    const s = offerUsefulness(state, opt);
    if (s > bestScore) {
      bestScore = s;
      bestIdx = i;
    }
  });
  if (bestIdx === -1) {
    return {
      action: { kind: 'dismiss-offer' },
      reasoning: 'no eligible offer',
    };
  }
  const action: BotAction = { kind: 'pick-offer', optionIndex: bestIdx as 0 | 1 };
  return { action, reasoning: describeAction(state, action) };
}

function candidateToAction(c: ActionCandidate): BotAction {
  if (c.kind === 'move') return { kind: 'move', target: c.target! };
  if (c.kind === 'activate-ability')
    return { kind: 'activate-ability', abilityId: c.abilityId! };
  return { kind: 'ability-target', abilityId: c.abilityId!, target: c.target! };
}

// Silence unused-import linting in case rookieLegalMoves isn't referenced
// in a future tweak.
void toSquare;
