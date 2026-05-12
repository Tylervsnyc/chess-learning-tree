/**
 * Shared types for the headless playtest harness.
 */

import type { AbilityId } from '../../lib/run/abilities';
import type {
  BoardState,
  Coord,
  GameStatus,
  PieceType,
  RookieForm,
  Turn,
} from '../../lib/run/types';

export type TierId = 'T3' | 'T4' | 'T5';

export type FailMode = 'won' | 'captured' | 'move-limit' | 'dead-end';

/** What a bot decides to do on its turn. */
export type BotAction =
  | { kind: 'pick-offer'; optionIndex: 0 | 1 }
  | { kind: 'dismiss-offer' }
  | { kind: 'move'; target: Coord }
  | { kind: 'activate-ability'; abilityId: AbilityId }
  | { kind: 'ability-target'; abilityId: AbilityId; target: Coord };

/** Constraints passed to bots — used by ablation / forced-take to bias choices. */
export interface BotContext {
  /** Ability IDs the bot should refuse to accept from offer screens. */
  excludedAbilities: ReadonlySet<AbilityId>;
  /**
   * Forced-take analysis: when an offer contains one of these IDs, the bot
   * MUST pick it (overrides its normal preference). Used to measure the
   * counterfactual win-rate of "if you took this, how would you do?".
   */
  forcedAcceptIds: ReadonlySet<AbilityId>;
  /**
   * Forced-take analysis: when an offer contains one of these IDs, the bot
   * MUST refuse it (dismiss if the only option, else pick the other slot).
   * Disambiguates "owns but never uses" from "actively avoided."
   */
  forcedSkipIds: ReadonlySet<AbilityId>;
  /** Optional RNG for tie-breaking; bots may ignore. */
  rng: () => number;
}

/**
 * Richer bot output, used only when the simulator runs with `recordTrace`.
 * Bots can synthesize a one-line "why" + the eval score they computed for the
 * chosen action. Backward-compatible: `Bot.decide()` still returns just an
 * action; the optional `decideWithReasoning()` adds the extras.
 */
export interface BotDecision {
  action: BotAction;
  /** Short human-readable rationale (e.g. "best of 5; advances 1 rank"). */
  reasoning?: string;
  /** Eval score for the chosen action (higher = better for Rookie). */
  evalScore?: number;
  /** How many candidate actions the bot considered. */
  candidatesConsidered?: number;
}

export interface Bot {
  readonly id: TierId;
  decide(state: BoardState, ctx: BotContext): BotAction;
  /**
   * Optional richer decision pathway. Called by the simulator when running
   * with `recordTrace`. Bots that don't implement it fall back to `decide`
   * + a synthesized reason from the action shape.
   */
  decideWithReasoning?(state: BoardState, ctx: BotContext): BotDecision;
}

/**
 * Minimal serializable board snapshot — small enough to ship many turns in
 * one trace JSON. Keeps only the bits the replay viewer renders + that the
 * reader needs to grok the bot's situation. Transient FX/intermediates from
 * the live engine state are dropped on purpose.
 */
export interface SerializedBoard {
  rookie: Coord;
  pieces: { type: PieceType; file: number; rank: number }[];
  hazards: Coord[];
  frozenSquares: string[];
  shieldUp: boolean;
  form: RookieForm;
  formMovesLeft: number;
  tempo: number;
  moveCount: number;
  moveLimit: number | null;
  bonusMovesLeft: number;
  abilities: { id: AbilityId; tier: number; usesLeftThisLevel: number }[];
  pendingOffer:
    | { id: AbilityId; tier: number; kind: 'new' | 'upgrade' }[]
    | null;
  turn: Turn;
  status: GameStatus;
}

/**
 * One entry per Rookie decision (move / activation / offer choice). Enemy
 * turns between Rookie actions aren't recorded — they're implied by the
 * next entry's board state.
 */
export interface DecisionLogEntry {
  /** 0-based index across Rookie actions in the game. */
  turn: number;
  /** Engine's Rookie move counter at decision time (counts only moves). */
  moveCount: number;
  /** Board snapshot Rookie saw when deciding. */
  beforeBoard: SerializedBoard;
  /** What she did. */
  action: BotAction;
  /** Synthesized or bot-supplied "why" string. */
  reason: string;
  /** Eval score from the bot's search (undefined if not provided). */
  evalScore?: number;
}

/** Full trace produced by `scripts/run-playtest/trace.ts`. */
export interface DecisionTrace {
  runId: string;
  level: number;          // 1-based puzzle.level
  levelIndex: number;     // 0-based within run
  levelId: string;
  tier: TierId;
  trial: number;
  seed: string;
  generatedAt: string;    // ISO timestamp
  outcome: Outcome;
  decisionLog: DecisionLogEntry[];
  /** Final board state so the viewer can render "and here's where she ended". */
  finalBoard: SerializedBoard;
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
  /**
   * Only populated when `simulateGame` is called with `recordTrace: true`.
   * Existing sweep / ablation / combo callers leave this undefined.
   */
  decisionLog?: DecisionLogEntry[];
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

/**
 * Forced-take result. For each (ability, tier), we measure two scenarios:
 *  - forceAccept: every offer that contains the ability is taken → does it help?
 *  - forceSkip:   every offer that contains the ability is dismissed → did skipping hurt?
 * Compared against the same tier-averaged baseline win-rate the ablation uses.
 */
export interface ForcedTakeResult {
  ability: AbilityId;
  tier: TierId;
  baselineWinRate: number;
  forceAcceptWinRate: number;
  forceSkipWinRate: number;
  /** (forceAccept - baseline) * 100. Positive = forcing pick helped. */
  acceptDeltaPp: number;
  /** (forceSkip - baseline) * 100. Positive = skipping helped. */
  skipDeltaPp: number;
}

/**
 * Combo result. We pre-own (A, B) at T1 from level 1 and measure win-rate
 * vs baseline on the same sampled level set. Solo deltas measure the
 * marginal effect of pre-owning just A (or just B) on the same sample.
 * synergy = pairDelta - soloA - soloB: positive = the pair beats the sum of
 * its parts (true combo), negative = redundant or anti-synergistic.
 */
export interface ComboResult {
  abilityA: AbilityId;
  abilityB: AbilityId;
  tier: TierId;
  baselineWinRate: number;
  pairWinRate: number;
  pairDeltaPp: number;
  soloADeltaPp: number;
  soloBDeltaPp: number;
  /** synergyPp = pairDeltaPp - soloADeltaPp - soloBDeltaPp. */
  synergyPp: number;
}
