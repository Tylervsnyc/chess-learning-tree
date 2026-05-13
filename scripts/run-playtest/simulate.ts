/**
 * Run one game: (puzzle, bot, seed) → Outcome.
 *
 * The simulation loop drives the engine's state machine: offer screens,
 * rookie actions, enemy turns. It records statistics (captures, abilities
 * offered/taken/used, near-death turns) as it goes.
 */

import {
  applyDismissOffer,
  applyOfferPick,
  refreshAbilityUses,
} from '../../lib/run/abilities';
import { puzzleToBoardState } from '../../lib/run/seed';
import type { BoardState, PieceType, RunPuzzle } from '../../lib/run/types';
import type { AbilityId, OwnedAbility } from '../../lib/run/abilities';
import { applyBotAction } from './bots/apply';
import { settleEnemyTurns } from './bots/t3';
import { rookieInThreat, inferCapturer } from './bots/shared';
import { rngFromString } from './utils/rng';
import { serializeBoard } from './utils/serialize';
import { synthesizeReason } from './utils/reason';
import type {
  Bot,
  BotAction,
  BotContext,
  BotDecision,
  DecisionLogEntry,
  Outcome,
} from './types';

const MAX_TURNS = 400;

export interface SimulateOpts {
  puzzle: RunPuzzle;
  bot: Bot;
  seed: string;
  excludedAbilities?: ReadonlySet<AbilityId>;
  /**
   * Force the bot to accept these abilities whenever offered. Used by the
   * forced-take and combo analyses to measure "if you took X, how would it
   * play out?" without changing anything else about the bot.
   */
  forcedAcceptIds?: ReadonlySet<AbilityId>;
  /** Force the bot to refuse these abilities whenever offered. */
  forcedSkipIds?: ReadonlySet<AbilityId>;
  /**
   * Pre-owned abilities seeded at game start. Combos use this to inject a
   * specific (A, B) pair as if Rookie had owned them from level 1. We layer
   * on top of whatever the puzzle's own starting state was — existing wins
   * by id (so we never clobber a higher-tier ability with a forced T1 copy).
   */
  preownedAbilities?: ReadonlyArray<OwnedAbility>;
  /**
   * When true, the simulator records a per-decision trace and returns it
   * inside the outcome. Off by default — opt-in because the trace adds
   * ~2-5KB per game and serializes a board snapshot on every Rookie action.
   */
  recordTrace?: boolean;
}

export type SimulateResult = Omit<
  Outcome,
  'levelId' | 'runId' | 'levelIndex' | 'tier' | 'trial' | 'seed'
> & {
  seed: number;
  /** Final BoardState — used by the trace tool; sweep callers strip it. */
  finalState: BoardState;
};

export function simulateGame(opts: SimulateOpts): SimulateResult {
  const rng = rngFromString(opts.seed);
  const seedHash = Math.floor(rng() * 2 ** 31);
  // Re-derive a fresh RNG for the bot (otherwise we consumed one tick).
  const botRng = rngFromString(opts.seed + ':bot');
  const ctx: BotContext = {
    excludedAbilities: opts.excludedAbilities ?? new Set(),
    forcedAcceptIds: opts.forcedAcceptIds ?? new Set(),
    forcedSkipIds: opts.forcedSkipIds ?? new Set(),
    rng: botRng,
  };

  let state: BoardState = puzzleToBoardState(opts.puzzle);
  // Inject pre-owned abilities AFTER puzzleToBoardState so we layer on top of
  // whatever the puzzle's own starting state was. Dedupe by id (existing
  // wins — we don't clobber a higher-tier ability with a forced T1 copy).
  if (opts.preownedAbilities && opts.preownedAbilities.length > 0) {
    const seen = new Set(state.abilities.map((a) => a.id));
    const additions = opts.preownedAbilities.filter((a) => !seen.has(a.id));
    if (additions.length > 0) {
      // refreshAbilityUses keeps `usesLeftThisLevel` in sync with the tier's
      // max — same shape the engine uses at level transitions.
      state = {
        ...state,
        abilities: refreshAbilityUses([...state.abilities, ...additions]),
      };
    }
  }
  let prevState = state;

  let abilitiesOffered = 0;
  const abilitiesTaken: AbilityId[] = [];
  const abilitiesUsed: AbilityId[] = [];
  let nearDeathTurns = 0;

  let lastAbilityCount = countAbilityUseFootprint(state);
  let lastOfferSeen: BoardState['pendingOffer'] = null;

  // Trace accumulator — populated only when opts.recordTrace is on.
  const decisionLog: DecisionLogEntry[] = [];
  let decisionTurn = 0;

  // Centralize the "pick richer or bare decision" branch so the main loop
  // stays one-shape. Tracing prefers decideWithReasoning when the bot
  // implements it (so we capture eval scores + rationale).
  const ask = (s: BoardState): BotDecision => {
    if (opts.recordTrace && opts.bot.decideWithReasoning) {
      return opts.bot.decideWithReasoning(s, ctx);
    }
    return { action: opts.bot.decide(s, ctx) };
  };
  const recordEntry = (
    snapshot: BoardState,
    decision: BotDecision,
  ): void => {
    if (!opts.recordTrace) return;
    const reason =
      decision.reasoning ??
      synthesizeReason(snapshot, decision.action, {
        candidatesConsidered: decision.candidatesConsidered,
        evalScore: decision.evalScore,
      });
    decisionLog.push({
      turn: decisionTurn++,
      moveCount: snapshot.moveCount,
      beforeBoard: serializeBoard(snapshot),
      action: decision.action,
      reason,
      evalScore: decision.evalScore,
    });
  };

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    if (state.status !== 'playing') break;

    if (state.pendingOffer) {
      if (state.pendingOffer !== lastOfferSeen) {
        abilitiesOffered++;
        lastOfferSeen = state.pendingOffer;
      }
      const decision = ask(state);
      const action = decision.action;
      recordEntry(state, decision);
      prevState = state;
      if (action.kind === 'pick-offer') {
        const opt = state.pendingOffer[action.optionIndex];
        if (opt) {
          abilitiesTaken.push(opt.id);
          state = applyOfferPick(state, opt);
        } else {
          state = applyDismissOffer(state);
        }
      } else {
        state = applyDismissOffer(state);
      }
      continue;
    }

    if (state.turn === 'enemy') {
      // Snapshot before the enemy turn so inferCapturer can locate the
      // capturer at Rookie's last square. Without this, prevState stays at
      // Rookie's pre-move square and we miss-classify captures as dead-ends
      // (royal-court/6 was the canonical example).
      prevState = state;
      state = settleEnemyTurns(state);
      continue;
    }

    // Rookie's turn — track if she's in threat before deciding.
    if (rookieInThreat(state)) nearDeathTurns++;

    const decision = ask(state);
    const action: BotAction = decision.action;
    recordEntry(state, decision);
    prevState = state;
    state = applyBotAction(state, action);

    // Detect ability uses by comparing footprint pre/post.
    const newFootprint = countAbilityUseFootprint(state);
    for (const id of Object.keys(newFootprint) as AbilityId[]) {
      const before = lastAbilityCount[id] ?? 0;
      const after = newFootprint[id] ?? 0;
      if (after > before) {
        abilitiesUsed.push(id);
      }
    }
    lastAbilityCount = newFootprint;

    // If applyBotAction returned the same state object, we've hit a no-op —
    // bail out to prevent infinite loop.
    if (state === prevState) break;
  }

  // Final classification.
  let failMode: Outcome['failMode'];
  let capturedBy: PieceType | undefined;
  if (state.status === 'won') {
    failMode = 'won';
  } else if (state.status === 'lost') {
    // Distinguish: did she get captured, or did move-limit expire?
    if (
      state.moveLimit !== null &&
      state.moveCount >= state.moveLimit &&
      // If rookie is still on the board, it's a move-limit loss.
      true
    ) {
      // Capture detection: prev had rookie at X, current state might have an enemy on X.
      const capturer = inferCapturer(prevState, state);
      if (capturer) {
        failMode = 'captured';
        capturedBy = capturer;
      } else {
        failMode = 'move-limit';
      }
    } else {
      const capturer = inferCapturer(prevState, state);
      if (capturer) {
        failMode = 'captured';
        capturedBy = capturer;
      } else {
        failMode = 'dead-end';
      }
    }
  } else {
    // Timed out (MAX_TURNS) without resolution — treat as dead-end.
    failMode = 'dead-end';
  }

  return {
    win: state.status === 'won',
    movesUsed: state.moveCount,
    failMode,
    capturedBy,
    captures: [...state.captures],
    abilitiesOffered,
    abilitiesTaken,
    abilitiesUsed,
    nearDeathTurns,
    excludedAbilities: opts.excludedAbilities ? [...opts.excludedAbilities] : [],
    seed: seedHash,
    decisionLog: opts.recordTrace ? decisionLog : undefined,
    finalState: state,
  };
}

/** Footprint of "uses left" per owned ability — used to detect activations. */
function countAbilityUseFootprint(state: BoardState): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of state.abilities) {
    // We track the number of uses *spent*. Compute as (max - left) using -1
    // sentinel for unlimited.
    if (a.usesLeftThisLevel < 0) {
      out[a.id] = 0; // unlimited — can't tell uses
      continue;
    }
    // We don't have max-uses here without re-importing, but a *delta* in
    // `usesLeftThisLevel` is what we want. So just record left directly and
    // invert in the caller (more uses spent = lower left = higher delta).
    out[a.id] = -a.usesLeftThisLevel; // negate so "more spent" = larger
  }
  return out;
}
