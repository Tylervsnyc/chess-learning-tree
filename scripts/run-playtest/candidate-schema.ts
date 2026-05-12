/**
 * Shared schema for candidate level / ability JSON files produced by the
 * mutator-explorer and ability-designer agents.
 *
 * WHY this lives outside `types.ts`: candidates are an INPUT to the promotion
 * pipeline, not an output of a sim run. Keeping them separate avoids polluting
 * the bot/decision-trace types with promotion-layer concerns.
 *
 * Both shapes are deliberately permissive: agents may add extra fields for
 * their own bookkeeping (e.g. journey, novelty scores) and we ignore them.
 */

import type { RunPuzzle } from '../../lib/run/types';
import type {
  AbilityActivation,
  AbilityId,
  AbilityTier,
} from '../../lib/run/abilities';
import type { LevelMutation } from './mutations';

/** Win-rate (0..1) per simulated tier for a candidate level. */
export interface CandidateTierCurve {
  T3: number;
  T4: number;
  T5: number;
}

/**
 * Candidate level file shape — what mutator-explorer-agent writes to
 * `data/run-playtest/candidate-levels/YYYY-MM-DD/explorer-N/level.json`.
 *
 * Anything else is allowed but ignored by the promoter.
 */
export interface CandidateLevel {
  candidate: true;
  /** Original level this candidate descended from, for debug attribution. */
  seedLevelId?: string;
  /** The serialized RunPuzzle (sans rookieStart — supplied at build time). */
  puzzle: Omit<RunPuzzle, 'rookieStart'>;
  /** Ordered list of mutations applied from seed → candidate. */
  mutations: LevelMutation[];
  /** Tier-curve report from the final sweep (50 trials per tier). */
  tierCurve: CandidateTierCurve;
  /** Fitness distance from target envelope in percentage points. */
  fitnessDistance?: number;
  /** Optional fitness label ("promotion-ready", "fun-hard", etc.). */
  fitnessLabel?: string;
  /** Free-form notes from the explorer agent. */
  notes?: string;
}

/** Tier-blurbs map. Either inline (preferred) or generated from a function. */
export type CandidateAbilityBlurbs = Record<AbilityTier, string>;

/**
 * Candidate ability file shape — what ability-designer-agent writes to
 * `data/run-playtest/candidate-abilities/YYYY-WW/<id>.json`.
 *
 * Mirrors AbilityDef + adds: candidate flag, blurbs, gap/pitch, optional
 * mechanics hint.
 */
export interface CandidateAbility {
  candidate: true;
  id: string;
  name: string;
  activation: AbilityActivation;
  typeLine: string;
  description: string;
  /** 5-tier progression — keys are "1".."5" or numeric. */
  blurbs: CandidateAbilityBlurbs;
  /** The gap this fills (per ability-designer-agent workflow). */
  gapAddressed?: string;
  /** Single-sentence pitch. */
  pitch?: string;
  /**
   * Mechanics hint — REQUIRED to promote. Without it the engine can't
   * implement the ability, so the promoter blocks at safety check.
   */
  mechanics?: {
    kind: string;
    params?: Record<string, unknown>;
  };
  /** Predicted ablation deltas etc. — ignored by promoter. */
  expectedImpact?: Record<string, unknown>;
}

/** Type guard for incoming JSON. */
export function isCandidateLevel(x: unknown): x is CandidateLevel {
  if (!x || typeof x !== 'object') return false;
  const c = x as Record<string, unknown>;
  return (
    c.candidate === true &&
    typeof c.puzzle === 'object' &&
    c.puzzle !== null &&
    Array.isArray(c.mutations) &&
    typeof c.tierCurve === 'object' &&
    c.tierCurve !== null
  );
}

export function isCandidateAbility(x: unknown): x is CandidateAbility {
  if (!x || typeof x !== 'object') return false;
  const c = x as Record<string, unknown>;
  return (
    c.candidate === true &&
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.activation === 'string' &&
    typeof c.blurbs === 'object' &&
    c.blurbs !== null
  );
}

/** Re-export so callers can `import { AbilityId, AbilityTier }` from here. */
export type { AbilityId, AbilityTier };
