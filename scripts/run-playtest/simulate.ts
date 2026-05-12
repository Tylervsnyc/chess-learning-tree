/**
 * Run one game: (puzzle, bot, seed) → Outcome.
 *
 * The simulation loop drives the engine's state machine: offer screens,
 * rookie actions, enemy turns. It records statistics (captures, abilities
 * offered/taken/used, near-death turns) as it goes.
 */

import { applyDismissOffer, applyOfferPick } from '../../lib/run/abilities';
import { puzzleToBoardState } from '../../lib/run/seed';
import type { BoardState, PieceType, RunPuzzle } from '../../lib/run/types';
import type { AbilityId } from '../../lib/run/abilities';
import { applyBotAction } from './bots/apply';
import { settleEnemyTurns } from './bots/t3';
import { rookieInThreat, inferCapturer } from './bots/shared';
import { rngFromString } from './utils/rng';
import type { Bot, BotContext, Outcome } from './types';

const MAX_TURNS = 400;

export interface SimulateOpts {
  puzzle: RunPuzzle;
  bot: Bot;
  seed: string;
  excludedAbilities?: ReadonlySet<AbilityId>;
}

export function simulateGame(opts: SimulateOpts): Omit<
  Outcome,
  'levelId' | 'runId' | 'levelIndex' | 'tier' | 'trial' | 'seed'
> & { seed: number } {
  const rng = rngFromString(opts.seed);
  const seedHash = Math.floor(rng() * 2 ** 31);
  // Re-derive a fresh RNG for the bot (otherwise we consumed one tick).
  const botRng = rngFromString(opts.seed + ':bot');
  const ctx: BotContext = {
    excludedAbilities: opts.excludedAbilities ?? new Set(),
    rng: botRng,
  };

  let state: BoardState = puzzleToBoardState(opts.puzzle);
  let prevState = state;

  let abilitiesOffered = 0;
  const abilitiesTaken: AbilityId[] = [];
  const abilitiesUsed: AbilityId[] = [];
  let nearDeathTurns = 0;

  let lastAbilityCount = countAbilityUseFootprint(state);
  let lastOfferSeen: BoardState['pendingOffer'] = null;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    if (state.status !== 'playing') break;

    if (state.pendingOffer) {
      if (state.pendingOffer !== lastOfferSeen) {
        abilitiesOffered++;
        lastOfferSeen = state.pendingOffer;
      }
      const action = opts.bot.decide(state, ctx);
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
      state = settleEnemyTurns(state);
      continue;
    }

    // Rookie's turn — track if she's in threat before deciding.
    if (rookieInThreat(state)) nearDeathTurns++;

    const action = opts.bot.decide(state, ctx);
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
