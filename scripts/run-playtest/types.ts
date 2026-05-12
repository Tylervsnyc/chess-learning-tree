/**
 * Shared types for the headless playtest harness.
 */

import type { AbilityId } from '../../lib/run/abilities';
import type { BoardState, Coord, PieceType } from '../../lib/run/types';

export type TierId = 'T3' | 'T4' | 'T5';

export type FailMode = 'won' | 'captured' | 'move-limit' | 'dead-end';

/** What a bot decides to do on its turn. */
export type BotAction =
  | { kind: 'pick-offer'; optionIndex: 0 | 1 }
  | { kind: 'dismiss-offer' }
  | { kind: 'move'; target: Coord }
  | { kind: 'activate-ability'; abilityId: AbilityId }
  | { kind: 'ability-target'; abilityId: AbilityId; target: Coord };

/** Constraints passed to bots — used by ablation to filter out abilities. */
export interface BotContext {
  /** Ability IDs the bot should refuse to accept from offer screens. */
  excludedAbilities: ReadonlySet<AbilityId>;
  /** Optional RNG for tie-breaking; bots may ignore. */
  rng: () => number;
}

export interface Bot {
  readonly id: TierId;
  decide(state: BoardState, ctx: BotContext): BotAction;
}

/** The full record produced by one sim. */
export interface Outcome {
  levelId: string;        // e.g. "daily/0", "boss-gauntlet/3"
  runId: string;
  levelIndex: number;     // 0-based within the run
  level: number;          // 1-based puzzle.level (== levelIndex + 1)
  tier: TierId;
  trial: number;
  seed: number;
  win: boolean;
  movesUsed: number;
  failMode: FailMode;
  capturedBy?: PieceType;
  captures: PieceType[];
  abilitiesOffered: number;       // count of offers presented
  abilitiesTaken: AbilityId[];
  abilitiesUsed: AbilityId[];     // each tap counted once
  nearDeathTurns: number;         // rookie was capture-targeted but survived
  excludedAbilities: AbilityId[]; // empty in baseline; set in ablation
}

/** Aggregated stats per (level, tier). */
export interface LevelTierStats {
  levelId: string;
  runId: string;
  levelIndex: number;
  level: number;
  tier: TierId;
  trials: number;
  wins: number;
  winRate: number;          // 0..1
  meanMoves: number;
  capturedRate: number;     // share of fails by capture
  moveLimitRate: number;    // share of fails by move-limit
  deadEndRate: number;      // share of fails by dead-end
  topKiller: PieceType | null;
  meanAbilitiesTaken: number;
  meanAbilitiesUsed: number;
}

/** Summary of how removing an ability affects difficulty. */
export interface AblationResult {
  ability: AbilityId;
  tier: TierId;
  baselineWinRate: number;
  ablatedWinRate: number;
  deltaPp: number;          // (ablated - baseline) * 100  — negative = ability helps players
  perLevel: { levelId: string; deltaPp: number }[];
}
