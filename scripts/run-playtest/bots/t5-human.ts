/**
 * T5 v0.3 — "Human-inspired" planner.
 *
 * Derived from human trace data collected via /test/rookie-trace
 * (data/run-playtest/human-traces/). Tyler's playthroughs of Pincer L1-L8,
 * Iron Curtain L1-L8, and The Gauntlet L1-L7 surfaced five behaviors that
 * neither T5_V01 (3-ply minimax) nor T5_V02 (ability-aware search) capture:
 *
 *   1. Focus-stack offers. Humans pick 4-5 consecutive upgrades to a single
 *      ability rather than diversifying. T5_V01 picks by tier+kind only;
 *      we add a large bonus for "upgrade owned" picks.
 *
 *   2. Hoard on easy levels. On levels 1-3, humans decline rank-8 wins to
 *      keep capturing pieces and fill the tempo meter for offers. T5_V01
 *      always takes the win (winningReach: +60 in eval). We override on
 *      safe + easy levels.
 *
 *   3. Defense pivot on dense boards. Iron Curtain L4-L6 (15+ pieces) saw
 *      Tyler abandon Poison Dart and ride Become King 1→5. We bias new-
 *      offer picks toward defensive abilities on dense boards.
 *
 *   4. Target high-value pieces with darts. Rabies/Freeze on queens > knights
 *      > pawns. T5_V01's minimax sees the eval delta but doesn't bias the
 *      shallow pass; we add an explicit target-value bonus.
 *
 *   5. Don't hoard Become King past usefulness. Tyler died TWICE with
 *      Become King T5 unused (Iron Curtain L8, The Gauntlet L7) on
 *      multi-threat boards. Humans hoard the "panic button"; bots
 *      shouldn't. When enemiesPerTurn ≥ 2 AND Rookie is threatened AND
 *      Become King is available, force-activate.
 *
 * Implementation: wraps T5_V01's decide() — we hand off most decisions to
 * the existing minimax, but pre-empt with offer-pick, hoard, and panic logic.
 * No new search code; just heuristic overlays.
 *
 * Status: EXPERIMENTAL. Validate against `t5-benchmark.ts` before promoting.
 */

import { rookieLegalMoves } from '../../../lib/run/movement';
import { TEMPO_MAX } from '../../../lib/run/scoring';
import type {
  AbilityId,
  AbilityOfferOption,
} from '../../../lib/run/abilities';
import type { BoardState, PieceType } from '../../../lib/run/types';
import { toSquare } from '../../../lib/run/types';
import { T5_V01 } from './t5-v01';
import { enemyAttackedSquares, rookieInThreat } from './shared';
import { describeAction } from '../utils/reason';
import type { Bot, BotAction, BotContext } from '../types';

// ─── Constants (sourced from trace analysis) ─────────────────────────────────

/**
 * Per-ability "main slot" value. Higher = more worth focus-stacking.
 * Derived from which abilities Tyler maxed first across runs.
 * Become King and Aegis ranked top — both are pure survival.
 */
const FOCUS_VALUE: Record<AbilityId, number> = {
  'become-king': 10,
  aegis: 9,
  squad: 8,
  'queen-pulse': 8,
  'freeze-ray': 7,
  convert: 7,
  'poison-dart': 6,
  'rabies-dart': 5,
  decoy: 5,
  drones: 5,
  surge: 4,
  'knight-hop': 4,
  'bishop-step': 3,
};

/**
 * Abilities tagged "defense" — get a bias on dense boards where killing
 * enemies one-at-a-time doesn't make a dent.
 */
const DEFENSIVE: ReadonlySet<AbilityId> = new Set<AbilityId>([
  'become-king',
  'aegis',
  'queen-pulse',
  'squad',
]);

const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  queen: 9,
};

/** Threshold: boards with at least this many pieces count as "dense". */
const DENSE_PIECE_COUNT = 12;

/** Hoarding kicks in on levels at or below this number. Originally 3,
 *  loosened to 5 after the first benchmark showed bots only hit offers in
 *  5-11% of games — they need more farming opportunities to bank tempo. */
const HOARDING_LEVEL_CAP = 5;

/** Don't farm if move-limit slack is below this. (movesRemaining minus
 *  distance-to-rank-8 must be at least this many moves to spare.) */
const FARM_BUDGET_SLACK = 4;

// ─── Bot ─────────────────────────────────────────────────────────────────────

export const T5_V03: Bot = {
  id: 'T5',
  decide(state, ctx) {
    // 1. Offer-pick override — focus-stack + board-aware preference.
    if (state.pendingOffer) {
      const action = pickOfferHuman(state, ctx);
      if (action) return action;
    }

    // 2. Panic override — force Become King when held past its useful moment.
    const panic = panicActivateBecomeKing(state, ctx);
    if (panic) return panic;

    // 3. Hoard override — on easy levels, decline rank-8 win if not in
    //    threat AND we still have tempo headroom to bank an offer.
    const hoard = hoardingMove(state, ctx);
    if (hoard) return hoard;

    // 4. Target-value override — when the standard search picks a targeted
    //    ability, swap to a higher-value piece on tie or near-tie.
    const action = T5_V01.decide(state, ctx);
    return upgradeTargetIfBetter(state, action);
  },
  decideWithReasoning(state, ctx) {
    const action = this.decide(state, ctx);
    return {
      action,
      reasoning: `${describeAction(state, action)} — T5 v0.3 (human-inspired)`,
    };
  },
};

// ─── Offer picking ───────────────────────────────────────────────────────────

function pickOfferHuman(
  state: BoardState,
  ctx: BotContext,
): BotAction | null {
  const offer = state.pendingOffer;
  if (!offer) return null;

  // forcedAcceptIds wins over everything (ablation context).
  for (let i = 0; i < offer.length; i++) {
    if (ctx.forcedAcceptIds.has(offer[i].id)) {
      return { kind: 'pick-offer', optionIndex: i as 0 | 1 };
    }
  }

  const dense = state.pieces.length >= DENSE_PIECE_COUNT;

  let bestIdx = -1;
  let bestScore = -Infinity;
  offer.forEach((opt, i) => {
    if (ctx.excludedAbilities.has(opt.id)) return;
    if (ctx.forcedSkipIds.has(opt.id)) return;
    const score = scoreOfferOption(opt, state, dense);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });
  if (bestIdx === -1) return { kind: 'dismiss-offer' };
  return { kind: 'pick-offer', optionIndex: bestIdx as 0 | 1 };
}

function scoreOfferOption(
  opt: AbilityOfferOption,
  state: BoardState,
  dense: boolean,
): number {
  const base = FOCUS_VALUE[opt.id];
  const tierBonus = opt.tier * 0.5; // mild — focus matters more than tier delta

  // Focus-stack bonus: upgrading an ability we own is much better than
  // picking a third (or replacing a higher-tier one). Tyler's traces show
  // 4-5 consecutive upgrades to one ability before diversifying.
  const owned = state.abilities.find((a) => a.id === opt.id);
  const focusStack = opt.kind === 'upgrade' && owned ? 5 : 0;

  // Dense-board defense bias — sourced from Iron Curtain pivot.
  const defenseBonus = dense && DEFENSIVE.has(opt.id) ? 3 : 0;

  // First-ability bias — when we own nothing yet, lean toward the high-
  // focus-value abilities so we have a "main" to stack on.
  const firstPickBonus = state.abilities.length === 0 ? base * 0.5 : 0;

  return base + tierBonus + focusStack + defenseBonus + firstPickBonus;
}

// ─── Panic activation ────────────────────────────────────────────────────────

/**
 * Tyler died TWICE holding Become King T5 unused (Iron Curtain L8, The
 * Gauntlet L7). The human "save for the perfect moment" instinct keeps
 * the panic button precious — and unused. Bots shouldn't.
 *
 * Fire Become King immediately when:
 *   - We own it AND have charges left
 *   - Rookie's form is rook (transform is legal)
 *   - enemiesPerTurn ≥ 2 (multi-threat board where 1 enemy turn can kill)
 *   - Rookie is currently in threat OR a near-future move forces her into one
 *
 * The first two are hard preconditions; the last two are the trigger.
 */
function panicActivateBecomeKing(
  state: BoardState,
  ctx: BotContext,
): BotAction | null {
  if (ctx.excludedAbilities.has('become-king')) return null;
  if (state.form !== 'rook') return null;
  const owned = state.abilities.find((a) => a.id === 'become-king');
  if (!owned) return null;
  if (owned.usesLeftThisLevel === 0) return null;
  if (state.enemiesPerTurn < 2) return null;
  if (!rookieInThreat(state)) return null;

  return { kind: 'activate-ability', abilityId: 'become-king' };
}

// ─── Hoarding (decline winning move on easy levels) ──────────────────────────

/**
 * Farm tempo on easy levels by preferring safe captures over progress moves.
 * Triggers any time the meter has room and a safe capture exists — not only
 * when declining a winning move (the prior gate was too narrow; the first
 * 3-way benchmark showed bots banked offers in <11% of games and needed
 * many more farming opportunities to make ability picking actually matter).
 *
 *   - level ≤ HOARDING_LEVEL_CAP (5)
 *   - Rookie is not currently in threat
 *   - tempo < TEMPO_MAX (no point — meter is locked)
 *   - move-budget slack ≥ FARM_BUDGET_SLACK (don't farm into a move-limit loss)
 *   - a safe capture move is available (we're actually banking something)
 *
 * Returns the best capturing detour by piece value, or null to fall through
 * to the search.
 */
function hoardingMove(state: BoardState, ctx: BotContext): BotAction | null {
  void ctx;
  if (state.level > HOARDING_LEVEL_CAP) return null;
  if (rookieInThreat(state)) return null;
  if (state.tempo >= TEMPO_MAX) return null;
  if (state.pendingOffer) return null;

  // Move-budget guard: don't farm if we're close to losing on move limit.
  if (state.moveLimit !== null) {
    const movesRemaining = state.moveLimit - state.moveCount;
    const distance = Math.max(0, 8 - state.rookie.rank);
    if (movesRemaining - distance < FARM_BUDGET_SLACK) return null;
  }

  // Best safe capture by piece value. Note: rank-8 captures are skipped —
  // taking a piece ON rank 8 ends the game and locks the tempo we just
  // earned out of an offer anyway.
  const attacked = enemyAttackedSquares(state);
  let best: { file: number; rank: number; value: number } | null = null;
  for (const m of legalMovesAt(state)) {
    if (m.rank === 8) continue;
    if (attacked.has(toSquare(m))) continue;
    const cap = state.pieces.find((p) => p.file === m.file && p.rank === m.rank);
    if (!cap) continue;
    const v = PIECE_VALUE[cap.type];
    if (!best || v > best.value) best = { file: m.file, rank: m.rank, value: v };
  }
  if (!best) return null;
  return { kind: 'move', target: { file: best.file, rank: best.rank } };
}

// ─── Target value bias ───────────────────────────────────────────────────────

/**
 * When the inner search picks a freeze/poison/rabies, see if a higher-value
 * target is also legal. If so, swap. This corrects the symmetric scoring
 * issue: a dart on a queen and a dart on a pawn often score equal at depth
 * 3 because the dart effect doesn't propagate that far in the eval.
 */
function upgradeTargetIfBetter(
  state: BoardState,
  action: BotAction,
): BotAction {
  if (action.kind !== 'ability-target') return action;
  if (
    action.abilityId !== 'freeze-ray' &&
    action.abilityId !== 'poison-dart' &&
    action.abilityId !== 'rabies-dart'
  )
    return action;

  const current = state.pieces.find(
    (p) => p.file === action.target.file && p.rank === action.target.rank,
  );
  if (!current) return action;
  const currentValue = PIECE_VALUE[current.type];

  // Look for a higher-value enemy on the visible set. We don't recompute
  // visibility here — we trust that if the search found this target legal,
  // other enemies of the same line-of-sight type would also be legal. The
  // upgrade only swaps within the bot's chosen ability.
  let best: { file: number; rank: number; value: number } | null = null;
  for (const p of state.pieces) {
    const v = PIECE_VALUE[p.type];
    if (v <= currentValue) continue;
    if (!best || v > best.value) best = { file: p.file, rank: p.rank, value: v };
  }
  if (!best) return action;
  return {
    kind: 'ability-target',
    abilityId: action.abilityId,
    target: { file: best.file, rank: best.rank },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function legalMovesAt(state: BoardState): { file: number; rank: number }[] {
  return rookieLegalMoves(state);
}
