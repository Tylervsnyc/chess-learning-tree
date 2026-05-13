/**
 * Rookie's Run — Ability progression system.
 *
 * 10 abilities, each 5 tiers. Tempo fills → player picks new ability or
 * upgrades an owned one. Abilities are permanent for the run.
 *
 * Tier shape: T1-T3 scale power, T4 doubles uses or adds a twist, T5 is
 * the permanent / unlimited payoff.
 */

import { TEMPO_MAX } from './scoring';
import { toSquare } from './types';
import type { BoardState, Coord, EnemyPiece, PieceType, RookieForm } from './types';

export type AbilityId =
  | 'bishop-step'
  | 'knight-hop'
  | 'queen-pulse'
  | 'pawn-charge'
  | 'freeze-ray'
  | 'detonate'
  | 'phase-step'
  | 'leap'
  | 'surge'
  | 'aegis'
  | 'queenkiller'
  // -------------------------------------------------------------------------
  // Candidate batch (2026-05-13) — 20 new IDs queued for impact measurement.
  // Mix of gap-fillers (hazards, tempo, info, minor-piece removal, defence)
  // and experimental shapes (board reshape, mass freeze, copy-form).
  // -------------------------------------------------------------------------
  | 'bedrock'
  | 'sinkhole'
  | 'rally'
  | 'quickstep'
  | 'smoke'
  | 'beeline'
  | 'slayer'
  | 'sapper'
  | 'decoy'
  | 'mirror'
  | 'foresight'
  | 'bulwark'
  | 'skip'
  | 'bait'
  | 'magnet'
  | 'pushback'
  | 'mimic'
  | 'recall'
  | 'tempo-vault'
  | 'tide'
  | 'tremor';

export type AbilityTier = 1 | 2 | 3 | 4 | 5;

/**
 * - movement: tap card, then tap a board square (legal moves shown).
 * - targeted: tap card, then tap any enemy / any square depending on ability.
 * - transform: tap card → Rookie morphs into another piece for N turns.
 * - instant:   tap card → resolves with a follow-up target tap (e.g. swap).
 * - passive:   no tap — auto-fires (currently unused).
 */
export type AbilityActivation =
  | 'movement'
  | 'targeted'
  | 'transform'
  | 'instant'
  | 'passive';

export interface OwnedAbility {
  id: AbilityId;
  tier: AbilityTier;
  mutations: string[];
  /** Remaining uses this level. -1 means unlimited. */
  usesLeftThisLevel: number;
}

export interface AbilityDef {
  id: AbilityId;
  name: string;
  activation: AbilityActivation;
  /** Short type-line for the card text (e.g. "Transform · Movement"). */
  typeLine: string;
  /** Short flavour for the offer screen. */
  description: string;
}

export const ABILITY_DEFS: Record<AbilityId, AbilityDef> = {
  'bishop-step': {
    id: 'bishop-step',
    name: 'Bishop Step',
    activation: 'transform',
    typeLine: 'Transform · Movement',
    description: 'Become a bishop for a few turns.',
  },
  'knight-hop': {
    id: 'knight-hop',
    name: 'Knight Hop',
    activation: 'transform',
    typeLine: 'Transform · Movement',
    description: 'Become a knight for a few turns.',
  },
  'queen-pulse': {
    id: 'queen-pulse',
    name: 'Queen Pulse',
    activation: 'transform',
    typeLine: 'Transform · Movement',
    description: 'Become a queen for a few turns.',
  },
  'pawn-charge': {
    id: 'pawn-charge',
    name: 'Pawn Charge',
    activation: 'movement',
    typeLine: 'Movement · Tactical',
    description: 'Surge forward like a pawn.',
  },
  'freeze-ray': {
    id: 'freeze-ray',
    name: 'Freeze Ray',
    activation: 'targeted',
    typeLine: 'Targeted · Control',
    description: 'Lock an enemy in place.',
  },
  detonate: {
    id: 'detonate',
    name: 'Detonate',
    activation: 'targeted',
    typeLine: 'Targeted · Tactical',
    description: 'Blow a hole in the board.',
  },
  'phase-step': {
    id: 'phase-step',
    name: 'Phase Step',
    activation: 'movement',
    typeLine: 'Movement · Tactical',
    description: 'Walk through pieces.',
  },
  leap: {
    id: 'leap',
    name: 'Leap',
    activation: 'movement',
    typeLine: 'Movement · Leap',
    description: 'Jump over pieces to an empty square.',
  },
  surge: {
    id: 'surge',
    name: 'Surge',
    activation: 'instant',
    typeLine: 'Instant · Tempo',
    description: 'Take an extra move this turn.',
  },
  aegis: {
    id: 'aegis',
    name: 'Aegis',
    activation: 'instant',
    typeLine: 'Instant · Shield',
    description: 'Tap to raise a shield. Blocks the next capture.',
  },
  queenkiller: {
    id: 'queenkiller',
    name: 'Queenkiller',
    activation: 'targeted',
    typeLine: 'Targeted · Tactical',
    description: 'Take a queen anywhere on the board.',
  },
  // ---------------------------------------------------------------------------
  // Candidate batch — terse, principle-driven descriptions only.
  // ---------------------------------------------------------------------------
  bedrock: {
    id: 'bedrock',
    name: 'Bedrock',
    activation: 'targeted',
    typeLine: 'Targeted · Terrain',
    description: 'Crack a hazard out of the board.',
  },
  sinkhole: {
    id: 'sinkhole',
    name: 'Sinkhole',
    activation: 'targeted',
    typeLine: 'Targeted · Terrain',
    description: 'Open a hazard. Pieces on it die.',
  },
  rally: {
    id: 'rally',
    name: 'Rally',
    activation: 'instant',
    typeLine: 'Instant · Tempo',
    description: 'Fill the tempo bar.',
  },
  quickstep: {
    id: 'quickstep',
    name: 'Quickstep',
    activation: 'instant',
    typeLine: 'Instant · Tempo',
    description: 'One free move this turn.',
  },
  smoke: {
    id: 'smoke',
    name: 'Smoke',
    activation: 'instant',
    typeLine: 'Instant · Control',
    description: 'Enemies on your rank lose sight.',
  },
  beeline: {
    id: 'beeline',
    name: 'Beeline',
    activation: 'instant',
    typeLine: 'Instant · Movement',
    description: 'If your file is clear, fly to rank 8.',
  },
  slayer: {
    id: 'slayer',
    name: 'Slayer',
    activation: 'targeted',
    typeLine: 'Targeted · Tactical',
    description: 'Take a knight or bishop.',
  },
  sapper: {
    id: 'sapper',
    name: 'Sapper',
    activation: 'targeted',
    typeLine: 'Targeted · Tactical',
    description: 'Clear every pawn on a file.',
  },
  decoy: {
    id: 'decoy',
    name: 'Decoy',
    activation: 'targeted',
    typeLine: 'Targeted · Shield',
    description: 'A false Rookie pulls enemy fire.',
  },
  mirror: {
    id: 'mirror',
    name: 'Mirror',
    activation: 'instant',
    typeLine: 'Instant · Shield',
    description: 'Next attacker dies, not Rookie.',
  },
  foresight: {
    id: 'foresight',
    name: 'Foresight',
    activation: 'instant',
    typeLine: 'Instant · Shield',
    description: 'Auto-block if a capture is coming.',
  },
  bulwark: {
    id: 'bulwark',
    name: 'Bulwark',
    activation: 'instant',
    typeLine: 'Instant · Shield',
    description: 'Stacking shield charges.',
  },
  skip: {
    id: 'skip',
    name: 'Skip',
    activation: 'instant',
    typeLine: 'Instant · Tempo',
    description: 'Pass the turn. Let them come.',
  },
  bait: {
    id: 'bait',
    name: 'Bait',
    activation: 'targeted',
    typeLine: 'Targeted · Control',
    description: 'Freeze the board around one enemy.',
  },
  magnet: {
    id: 'magnet',
    name: 'Magnet',
    activation: 'targeted',
    typeLine: 'Targeted · Control',
    description: 'Drag an enemy toward you.',
  },
  pushback: {
    id: 'pushback',
    name: 'Pushback',
    activation: 'targeted',
    typeLine: 'Targeted · Control',
    description: 'Shove an enemy away.',
  },
  mimic: {
    id: 'mimic',
    name: 'Mimic',
    activation: 'targeted',
    typeLine: 'Targeted · Movement',
    description: 'Move like an enemy piece.',
  },
  recall: {
    id: 'recall',
    name: 'Recall',
    activation: 'instant',
    typeLine: 'Instant · Movement',
    description: 'Snap back to rank 1.',
  },
  'tempo-vault': {
    id: 'tempo-vault',
    name: 'Tempo Vault',
    activation: 'targeted',
    typeLine: 'Targeted · Tempo',
    description: 'Take any piece for tempo.',
  },
  tide: {
    id: 'tide',
    name: 'Tide',
    activation: 'instant',
    typeLine: 'Instant · Control',
    description: 'Push the front rank away.',
  },
  tremor: {
    id: 'tremor',
    name: 'Tremor',
    activation: 'instant',
    typeLine: 'Instant · Control',
    description: 'Shake the ground — pieces near you stagger back.',
  },
};

export const ALL_ABILITY_IDS: AbilityId[] = Object.keys(
  ABILITY_DEFS,
) as AbilityId[];

/** Hard cap on how many abilities Rookie can own in a single run. */
export const MAX_OWNED_ABILITIES = 3;

/** Max uses per level for a given ability/tier. -1 = unlimited. */
export function maxUsesForTier(id: AbilityId, tier: AbilityTier): number {
  switch (id) {
    case 'bishop-step':
    case 'knight-hop':
      // T1/T2/T3 = 1, T4 = 2, T5 = 1 (one transform → rest of level)
      if (tier <= 3) return 1;
      if (tier === 4) return 2;
      return 1;
    case 'queen-pulse':
      // T1/T2 = 1, T3/T4 = 2, T5 = 1
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return 1;
    case 'pawn-charge':
      if (tier === 1) return 2;
      return 3;
    case 'freeze-ray':
      if (tier === 3) return 2;
      return 1;
    case 'detonate':
      if (tier <= 2) return 1;
      return 2;
    case 'phase-step':
      return 1;
    case 'leap':
      if (tier <= 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 3;
    case 'surge':
      // T1: 1/level, T2: 2/level, T3: 1/level, T4: 2/level, T5: 2/level
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 1;
      return 2;
    case 'aegis':
      // Charges = passive blocks remaining. T5 = unlimited.
      if (tier === 1) return 1;
      if (tier === 2 || tier === 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'queenkiller':
      // Queens are top-killer at every tier per the multivariate model.
      // T1-T2 single capture, T3 two casts, T4 doubles use + adjacent pawns,
      // T5 doubles use + 3x3 blast around the queen.
      if (tier === 1 || tier === 2) return 1;
      return 2;
    // -------------------------------------------------------------------------
    // Candidate batch — most follow a 1-1-2-2-(unlimited|big) progression.
    // Pattern is intentionally simple so impact differences come from
    // mechanic SHAPE rather than tier curves.
    // -------------------------------------------------------------------------
    case 'bedrock':
    case 'sinkhole':
      // Terrain edits — sparse by design. T5 lifts the cap to clear runs of
      // hazard-heavy levels.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'rally':
      // Tempo refund cadence. T5 = unlimited to test "infinite offers" ceiling.
      if (tier === 1) return 1;
      if (tier <= 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'quickstep':
      // Mini-Surge — single bonus move, generous uses to feel like a "free tap."
      if (tier === 1) return 2;
      if (tier <= 3) return 3;
      return -1;
    case 'smoke':
      // Selective freeze (Rookie's rank). Tighter than Bait so different shape.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'beeline':
      // Conditional teleport — feels free when it triggers, otherwise a no-op.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'slayer':
      // Minor-piece killer. Same shape as Queenkiller — queens are rarer than
      // minors, so we don't grant strictly more uses than Queenkiller.
      if (tier <= 2) return 1;
      return 2;
    case 'sapper':
      // Whole-file pawn wipe — strong, so kept on the conservative cadence.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'decoy':
      // Defensive misdirection. T5 = unlimited as a permanent ghost.
      if (tier === 1) return 1;
      if (tier <= 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'mirror':
      // Auto-retaliation shield. Similar uses to Aegis but each charge kills.
      if (tier === 1) return 1;
      if (tier <= 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'foresight':
      // Conditional Aegis — costs a use even on no-op casts on purpose so the
      // bot must judge timing. T5 = unlimited to test the auto-pilot ceiling.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'bulwark':
      // Stacking shield — front-loaded uses so it feels different from Aegis.
      if (tier === 1) return 2;
      if (tier === 2) return 3;
      if (tier === 3) return 3;
      if (tier === 4) return 4;
      return -1;
    case 'skip':
      // Pass-turn — handy for baiting and freeze waits. Cheap uses.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'bait':
      // Mass-freeze with a hole. Stronger than freeze-ray so use cap is tighter.
      if (tier <= 2) return 1;
      return 2;
    case 'magnet':
    case 'pushback':
      // Board reshape — give bots room to plan a sequence.
      if (tier === 1) return 1;
      if (tier <= 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'mimic':
      // One-shot piece-copy. Niche so generous uses don't break the curve.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'recall':
      // Escape hatch — sparse uses since it eats a Rookie move.
      if (tier <= 3) return 1;
      if (tier === 4) return 2;
      return -1;
    case 'tempo-vault':
      // Trade material for tempo. Single use most tiers, T5 unlimited.
      if (tier <= 3) return 1;
      if (tier === 4) return 2;
      return -1;
    case 'tide':
      // Battlefield-clear instant. Strong AOE so capped per level.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'tremor':
      // Self-centered AoE pushback. Generous uses because each fire is
      // local (radius 1 at T1) — bot can fire often without trivialising.
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 2;
      if (tier === 4) return 3;
      return 4;
  }
}

/** Transform form a transform-ability grants. */
export function formForAbility(id: AbilityId): RookieForm | null {
  if (id === 'bishop-step') return 'bishop';
  if (id === 'knight-hop') return 'knight';
  if (id === 'queen-pulse') return 'queen';
  return null;
}

/** Duration (in Rookie moves) for a transform ability at a given tier. */
export function transformDurationForTier(
  id: AbilityId,
  tier: AbilityTier,
): number {
  if (tier === 5) return 999; // "rest of level"
  if (id === 'bishop-step' || id === 'knight-hop') {
    if (tier === 1) return 1;
    if (tier === 2) return 2;
    return 3; // T3 + T4
  }
  if (id === 'queen-pulse') {
    if (tier === 1) return 1;
    if (tier === 2 || tier === 3) return 2;
    return 3; // T4
  }
  return 0;
}

export function blurbForTier(id: AbilityId, tier: AbilityTier): string {
  switch (id) {
    case 'bishop-step':
      if (tier === 5) return 'Bishop for rest of level.';
      if (tier === 4) return 'Bishop for 3 turns. 2/level.';
      if (tier === 3) return 'Bishop for 3 turns. 1/level.';
      if (tier === 2) return 'Bishop for 2 turns. 1/level.';
      return 'Bishop for 1 turn. 1/level.';
    case 'knight-hop':
      if (tier === 5) return 'Knight for rest of level.';
      if (tier === 4) return 'Knight for 3 turns. 2/level.';
      if (tier === 3) return 'Knight for 3 turns. 1/level.';
      if (tier === 2) return 'Knight for 2 turns. 1/level.';
      return 'Knight for 1 turn. 1/level.';
    case 'queen-pulse':
      if (tier === 5) return 'Queen for rest of level.';
      if (tier === 4) return 'Queen for 3 turns. 2/level.';
      if (tier === 3) return 'Queen for 2 turns. 2/level.';
      if (tier === 2) return 'Queen for 2 turns. 1/level.';
      return 'Queen for 1 turn. 1/level.';
    case 'pawn-charge':
      if (tier === 5) return 'Charge full column, capturing all. 3/level.';
      if (tier === 4) return 'Up to 3 ranks, plows pawns. 3/level.';
      if (tier === 3) return 'Up to 2 ranks forward. 3/level.';
      if (tier === 2) return '1 rank forward, diag capture. 3/level.';
      return '1 rank forward, diag capture. 2/level.';
    case 'freeze-ray':
      if (tier === 5) return 'Permanent freeze. 1/level.';
      if (tier === 4) return 'Freeze enemy + neighbours 2 turns. 1/level.';
      if (tier === 3) return 'Freeze 2 turns. 2/level.';
      if (tier === 2) return 'Freeze 2 turns. 1/level.';
      return 'Freeze 1 turn. 1/level.';
    case 'detonate':
      if (tier === 5) return '5×5 blast. Screenshake. 2/level.';
      if (tier === 4) return '3×3 blast. +1 tempo per kill. 2/level.';
      if (tier === 3) return '3×3 blast. 2/level.';
      if (tier === 2) return '3×3 blast. 1/level.';
      return '1-square blast. 1/level.';
    case 'phase-step':
      if (tier === 5) return 'Teleport anywhere empty.';
      if (tier === 4) return 'Any line, through everything.';
      if (tier === 3) return '3 sq any dir, through 1 piece.';
      if (tier === 2) return '2 sq any dir, through 1 piece.';
      return '1 sq any dir, through 1 piece.';
    case 'leap':
      if (tier === 5) return 'Jump 2-6 sq any of 8 dirs. 3/level.';
      if (tier === 4) return 'Jump 2-4 sq any cardinal. 2/level.';
      if (tier === 3) return 'Jump 2-4 sq forward. 2/level.';
      if (tier === 2) return 'Jump 2 or 3 sq forward. 1/level.';
      return 'Jump exactly 2 sq forward. 1/level.';
    case 'surge':
      if (tier === 5) return '+3 extra moves this turn. 2/level.';
      if (tier === 4) return '+2 extra moves this turn. 2/level.';
      if (tier === 3) return '+2 extra moves this turn. 1/level.';
      if (tier === 2) return '+1 extra move this turn. 2/level.';
      return '+1 extra move this turn. 1/level.';
    case 'aegis':
      if (tier === 5) return 'Tap: permanent shield. Attackers die.';
      if (tier === 4) return 'Tap: shield. 3 raises/level.';
      if (tier === 3) return 'Tap: shield + stuns attacker. 2/level.';
      if (tier === 2) return 'Tap: shield. 2 raises/level.';
      return 'Tap: shield blocks next capture. 1/level.';
    case 'queenkiller':
      if (tier === 5) return 'Take a queen + 3×3 blast. 2/level.';
      if (tier === 4) return 'Take a queen + adjacent pawns. 2/level.';
      if (tier === 3) return 'Take a queen. 2/level.';
      if (tier === 2) return 'Take a queen. +2 tempo. 1/level.';
      return 'Take a queen. 1/level.';
    case 'bedrock':
      if (tier === 5) return 'Wipe every hazard. Unlimited.';
      if (tier === 4) return 'Clear 1 hazard. 2/level.';
      if (tier === 3) return 'Clear 1 hazard. 2/level.';
      if (tier === 2) return 'Clear 1 hazard. 1/level.';
      return 'Clear 1 hazard. 1/level.';
    case 'sinkhole':
      if (tier === 5) return 'Hazard on any square. Unlimited.';
      if (tier === 4) return 'Hazard + kill piece on it. 2/level.';
      if (tier === 3) return 'Hazard on empty square. 2/level.';
      if (tier === 2) return 'Hazard on empty square. 1/level.';
      return 'Hazard on empty square. 1/level.';
    case 'rally':
      if (tier === 5) return 'Fill tempo. Unlimited.';
      if (tier === 4) return '+8 tempo. 3/level.';
      if (tier === 3) return '+6 tempo. 2/level.';
      if (tier === 2) return '+5 tempo. 2/level.';
      return '+4 tempo. 1/level.';
    case 'quickstep':
      if (tier === 5) return '+1 free move. Unlimited.';
      if (tier === 4) return '+1 free move. 3/level.';
      if (tier === 3) return '+1 free move. 3/level.';
      if (tier === 2) return '+1 free move. 3/level.';
      return '+1 free move. 2/level.';
    case 'smoke':
      if (tier === 5) return 'Smoke your rank, 3 turns.';
      if (tier === 4) return 'Smoke your rank, 2 turns. 2/level.';
      if (tier === 3) return 'Smoke your rank, 2 turns. 2/level.';
      if (tier === 2) return 'Smoke your rank, 1 turn. 1/level.';
      return 'Smoke your rank, 1 turn. 1/level.';
    case 'beeline':
      if (tier === 5) return 'Open file? Rank 8. Unlimited.';
      if (tier === 4) return 'Open file? Fly to rank 8. 2/level.';
      if (tier === 3) return 'Open file? Fly to rank 7+. 2/level.';
      if (tier === 2) return 'Open file? Fly +4 ranks. 1/level.';
      return 'Open file? Fly +3 ranks. 1/level.';
    case 'slayer':
      if (tier === 5) return 'Take any minor + adjacent. 2/level.';
      if (tier === 4) return 'Take any minor + pawn splash. 2/level.';
      if (tier === 3) return 'Take a knight/bishop. 2/level.';
      if (tier === 2) return 'Take a knight/bishop. +1 tempo. 1/level.';
      return 'Take a knight/bishop. 1/level.';
    case 'sapper':
      if (tier === 5) return 'Wipe pawns on file + neighbours.';
      if (tier === 4) return 'Wipe pawns on file. 2/level.';
      if (tier === 3) return 'Wipe pawns on file. 2/level.';
      if (tier === 2) return 'Wipe pawns ahead on file. 1/level.';
      return 'Wipe nearest pawn on file. 1/level.';
    case 'decoy':
      if (tier === 5) return 'Permanent decoy. Unlimited.';
      if (tier === 4) return 'Decoy lasts 2 turns. 3/level.';
      if (tier === 3) return 'Decoy lasts 2 turns. 2/level.';
      if (tier === 2) return 'Decoy lasts 1 turn. 2/level.';
      return 'Decoy lasts 1 turn. 1/level.';
    case 'mirror':
      if (tier === 5) return 'Attackers always die. Unlimited.';
      if (tier === 4) return 'Attacker dies. 3/level.';
      if (tier === 3) return 'Attacker dies. 2/level.';
      if (tier === 2) return 'Attacker dies. +1 tempo. 2/level.';
      return 'Attacker dies. 1/level.';
    case 'foresight':
      if (tier === 5) return 'Auto-block forever.';
      if (tier === 4) return 'Auto-block, +1 free move. 2/level.';
      if (tier === 3) return 'Auto-block next capture. 2/level.';
      if (tier === 2) return 'Auto-block next capture. 1/level.';
      return 'Auto-block next capture. 1/level.';
    case 'bulwark':
      if (tier === 5) return 'Stacked shield, unlimited.';
      if (tier === 4) return '4 charges. Each blocks 1 hit.';
      if (tier === 3) return '3 charges + stuns attacker.';
      if (tier === 2) return '3 charges. Block & live.';
      return '2 charges. Block & live.';
    case 'skip':
      if (tier === 5) return 'Pass turn. Unlimited.';
      if (tier === 4) return 'Pass + 1 tempo. 2/level.';
      if (tier === 3) return 'Pass turn. 2/level.';
      if (tier === 2) return 'Pass turn. 1/level.';
      return 'Pass turn. 1/level.';
    case 'bait':
      if (tier === 5) return 'Freeze board, 3 turns. 2/level.';
      if (tier === 4) return 'Freeze board, 2 turns. 2/level.';
      if (tier === 3) return 'Freeze others, 2 turns. 2/level.';
      if (tier === 2) return 'Freeze others, 1 turn. 1/level.';
      return 'Freeze others, 1 turn. 1/level.';
    case 'magnet':
      if (tier === 5) return 'Drag 3 sq. Unlimited.';
      if (tier === 4) return 'Drag 3 sq toward you. 3/level.';
      if (tier === 3) return 'Drag 2 sq toward you. 2/level.';
      if (tier === 2) return 'Drag 2 sq toward you. 2/level.';
      return 'Drag 1 sq toward you. 1/level.';
    case 'pushback':
      if (tier === 5) return 'Push 3 sq. Unlimited.';
      if (tier === 4) return 'Push 3 sq away. 3/level.';
      if (tier === 3) return 'Push 2 sq away. 2/level.';
      if (tier === 2) return 'Push 2 sq away. 2/level.';
      return 'Push 1 sq away. 1/level.';
    case 'mimic':
      if (tier === 5) return 'Copy a piece, rest of level.';
      if (tier === 4) return 'Copy a piece, 3 turns. 2/level.';
      if (tier === 3) return 'Copy a piece, 2 turns. 2/level.';
      if (tier === 2) return 'Copy a piece, 2 turns. 1/level.';
      return 'Copy a piece, 1 turn. 1/level.';
    case 'recall':
      if (tier === 5) return 'Snap to rank 1. Unlimited.';
      if (tier === 4) return 'Snap to rank 1. 2/level.';
      if (tier === 3) return 'Snap to rank 1. 1/level.';
      if (tier === 2) return 'Snap to rank 1. 1/level.';
      return 'Snap to rank 1. 1/level.';
    case 'tempo-vault':
      if (tier === 5) return 'Take any piece. +4 tempo.';
      if (tier === 4) return 'Take any piece. +3 tempo. 2/level.';
      if (tier === 3) return 'Take any piece. +3 tempo.';
      if (tier === 2) return 'Take any piece. +2 tempo.';
      return 'Take any piece. +2 tempo.';
    case 'tide':
      if (tier === 5) return 'Whole board surges +1. 2/level.';
      if (tier === 4) return 'Push 2 ranks forward. 2/level.';
      if (tier === 3) return 'Push the nearest rank +1. 2/level.';
      if (tier === 2) return 'Push the nearest rank +1. 1/level.';
      return 'Push pieces above Rookie +1. 1/level.';
    case 'tremor':
      if (tier === 5) return 'All within 2 sq stagger back 2. 4/level.';
      if (tier === 4) return 'All within 2 sq stagger back 1. 3/level.';
      if (tier === 3) return 'All adjacent enemies back 1. 2/level.';
      if (tier === 2) return 'All adjacent enemies back 1. 2/level.';
      return 'Nearest adjacent enemy back 1. 1/level.';
  }
}

export interface AbilityOfferOption {
  kind: 'new' | 'upgrade';
  id: AbilityId;
  tier: AbilityTier;
  description: string;
}

export type AbilityOffer = AbilityOfferOption[];

/**
 * Make an offer slate of up to 2 choices. Deterministic via the passed RNG.
 *
 * Rules:
 *  - If the player owns fewer than MAX_OWNED_ABILITIES, mix "new" and "upgrade"
 *    candidates.
 *  - Once the player has hit the cap, ONLY upgrades for owned abilities are
 *    eligible — no new-ability offers.
 *  - If every owned ability is already at T5, returns an empty array — callers
 *    (engine, seed) should treat that as "skip the offer, refund tempo".
 *  - All returned options are distinct (the candidate pool itself contains no
 *    duplicates — each ability appears at most once as either 'new' or 'upgrade').
 */
export function rollOffer(state: BoardState, rng: () => number): AbilityOffer {
  const owned = new Map(state.abilities.map((a) => [a.id, a]));
  const ownedCount = owned.size;
  const atCap = ownedCount >= MAX_OWNED_ABILITIES;

  const newPool: AbilityOfferOption[] = ALL_ABILITY_IDS.filter(
    (id) => !owned.has(id),
  ).map((id) => ({
    kind: 'new',
    id,
    tier: 1,
    description: blurbForTier(id, 1),
  }));

  const upgradePool: AbilityOfferOption[] = [...owned.values()]
    .filter((a) => a.tier < 5)
    .map((a) => {
      const next = (a.tier + 1) as AbilityTier;
      return {
        kind: 'upgrade',
        id: a.id,
        tier: next,
        description: blurbForTier(a.id, next),
      };
    });

  const pickOne = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(rng() * arr.length)];
  };
  const without = <T,>(arr: T[], match: (x: T) => boolean): T[] =>
    arr.filter((x) => !match(x));

  // Composition rules:
  //   owned == 0                          -> [new, new]
  //   owned >= 1 && !atCap && upgradeable -> [new, upgrade]
  //   owned >= 1 && !atCap && all maxed   -> [new, new]
  //   atCap && upgradeable                -> [upgrade, upgrade]
  //   atCap && all maxed                  -> []  (caller treats as exhausted)
  // Fallbacks (defensive): if a pool is empty when the rule wants from it,
  // fall back to the other pool.
  const offer: AbilityOfferOption[] = [];

  if (atCap) {
    if (upgradePool.length === 0) return [];
    const a = pickOne(upgradePool);
    if (a) offer.push(a);
    const b = pickOne(without(upgradePool, (x) => x.id === a?.id));
    if (b) offer.push(b);
    return offer;
  }

  if (ownedCount === 0) {
    const a = pickOne(newPool);
    if (a) offer.push(a);
    const b = pickOne(without(newPool, (x) => x.id === a?.id));
    if (b) offer.push(b);
    return offer;
  }

  // owned >= 1 && !atCap
  if (upgradePool.length > 0 && newPool.length > 0) {
    const up = pickOne(upgradePool);
    const nw = pickOne(newPool);
    if (up) offer.push(up);
    if (nw) offer.push(nw);
    return offer;
  }

  // All owned are maxed (or no news available) — fill from whichever has stock.
  const fallback = newPool.length > 0 ? newPool : upgradePool;
  const a = pickOne(fallback);
  if (a) offer.push(a);
  const b = pickOne(without(fallback, (x) => x.id === a?.id));
  if (b) offer.push(b);
  return offer;
}

/**
 * True if the offer pool is empty — the player owns 3 maxed abilities. The
 * engine should award a small tempo blessing instead of opening a modal.
 */
export function offerIsExhausted(state: BoardState): boolean {
  if (state.abilities.length < MAX_OWNED_ABILITIES) return false;
  return state.abilities.every((a) => a.tier === 5);
}

export function applyOfferPick(
  state: BoardState,
  option: AbilityOfferOption,
): BoardState {
  if (!state.pendingOffer) return state;
  let abilities = state.abilities;
  if (option.kind === 'new') {
    if (abilities.some((a) => a.id === option.id)) return state;
    if (abilities.length >= MAX_OWNED_ABILITIES) return state;
    abilities = [
      ...abilities,
      {
        id: option.id,
        tier: 1,
        mutations: [],
        usesLeftThisLevel: maxUsesForTier(option.id, 1),
      },
    ];
  } else {
    abilities = abilities.map((a) => {
      if (a.id !== option.id) return a;
      const newTier = option.tier;
      return {
        ...a,
        tier: newTier,
        usesLeftThisLevel: maxUsesForTier(a.id, newTier),
      };
    });
  }
  return { ...state, abilities, pendingOffer: null, tempo: 0 };
}

export function applyDismissOffer(state: BoardState): BoardState {
  if (!state.pendingOffer) return state;
  return {
    ...state,
    pendingOffer: null,
    tempo: Math.floor(TEMPO_MAX / 2),
  };
}

// ---------------------------------------------------------------------------
// Legal-move computation.
// ---------------------------------------------------------------------------

function inBounds(c: Coord): boolean {
  return c.file >= 1 && c.file <= 8 && c.rank >= 1 && c.rank <= 8;
}

function isHazard(state: BoardState, c: Coord): boolean {
  return state.hazards.some((h) => h.file === c.file && h.rank === c.rank);
}

function enemyAt(state: BoardState, c: Coord): EnemyPiece | undefined {
  return state.pieces.find((p) => p.file === c.file && p.rank === c.rank);
}

function pawnChargeMoves(state: BoardState, tier: AbilityTier): Coord[] {
  const out: Coord[] = [];
  const { rookie } = state;
  // Diagonal captures (T1-T4; T5 only captures in column).
  if (tier < 5) {
    for (const df of [-1, 1]) {
      const c = { file: rookie.file + df, rank: rookie.rank + 1 };
      if (inBounds(c) && !isHazard(state, c) && enemyAt(state, c)) out.push(c);
    }
  }
  const maxRanks = tier === 1 || tier === 2 ? 1 : tier === 3 ? 2 : tier === 4 ? 3 : 7;
  for (let d = 1; d <= maxRanks; d++) {
    const c = { file: rookie.file, rank: rookie.rank + d };
    if (!inBounds(c)) break;
    if (isHazard(state, c)) break;
    const piece = enemyAt(state, c);
    if (piece) {
      // T4 plows pawns; T5 plows everything.
      if (tier === 4 && piece.type === 'pawn') {
        out.push(c);
        continue;
      }
      if (tier === 5) {
        out.push(c);
        continue;
      }
      // T1-T3 can land on a piece in front only as a forward capture? No — pawn
      // doesn't capture forward. Stop the ray.
      break;
    }
    out.push(c);
  }
  return out;
}

function phaseStepMoves(state: BoardState, tier: AbilityTier): Coord[] {
  const out: Coord[] = [];
  const { rookie } = state;
  if (tier === 5) {
    // Teleport anywhere empty (no hazards, no piece).
    for (let f = 1; f <= 8; f++) {
      for (let r = 1; r <= 8; r++) {
        if (f === rookie.file && r === rookie.rank) continue;
        const c = { file: f, rank: r };
        if (isHazard(state, c)) continue;
        if (enemyAt(state, c)) continue;
        out.push(c);
      }
    }
    return out;
  }
  const maxDist = tier === 4 ? 8 : tier;
  const phaseThrough = tier === 4 ? Infinity : 1;
  const DIRS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ] as const;
  for (const [df, dr] of DIRS) {
    let phased = 0;
    let f = rookie.file + df;
    let r = rookie.rank + dr;
    for (let d = 1; d <= maxDist; d++, f += df, r += dr) {
      const c = { file: f, rank: r };
      if (!inBounds(c)) break;
      if (isHazard(state, c)) break;
      const piece = enemyAt(state, c);
      if (piece) {
        phased++;
        if (phased > phaseThrough) break;
        // The phased-through square: can land on it (capturing), but the ability
        // is meant to "pass through" — we'll only allow landing on the FINAL
        // square. For simplicity, allow either: include this as a legal land.
        out.push(c);
        continue;
      }
      out.push(c);
    }
  }
  return out;
}

/**
 * Leap — jump over pieces, land on an empty square.
 *
 * Direction convention matches Pawn Charge: "forward" = increasing rank (Rookie
 * starts on rank 1, enemy back rank is 8).
 *
 *  T1: 2 sq forward
 *  T2: 2-3 sq forward
 *  T3: 2-4 sq forward
 *  T4: 2-4 sq, 4 cardinal directions
 *  T5: 2-6 sq, all 8 directions
 */
function leapMoves(state: BoardState, tier: AbilityTier): Coord[] {
  const FORWARD: ReadonlyArray<readonly [number, number]> = [[0, 1]];
  const CARDINALS: ReadonlyArray<readonly [number, number]> = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const ALL_DIRS: ReadonlyArray<readonly [number, number]> = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  let dirs: ReadonlyArray<readonly [number, number]>;
  let distances: number[];
  if (tier === 1) {
    dirs = FORWARD;
    distances = [2];
  } else if (tier === 2) {
    dirs = FORWARD;
    distances = [2, 3];
  } else if (tier === 3) {
    dirs = FORWARD;
    distances = [2, 3, 4];
  } else if (tier === 4) {
    dirs = CARDINALS;
    distances = [2, 3, 4];
  } else {
    dirs = ALL_DIRS;
    distances = [2, 3, 4, 5, 6];
  }

  const out: Coord[] = [];
  const { rookie } = state;
  for (const [df, dr] of dirs) {
    for (const d of distances) {
      const c = { file: rookie.file + df * d, rank: rookie.rank + dr * d };
      if (!inBounds(c)) continue;
      if (isHazard(state, c)) continue;
      if (enemyAt(state, c)) continue; // must land on empty square
      out.push(c);
    }
  }
  return out;
}

export function abilityLegalMoves(
  state: BoardState,
  abilityId: AbilityId,
): Coord[] {
  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return [];
  if (abilityId === 'pawn-charge') return pawnChargeMoves(state, owned.tier);
  if (abilityId === 'phase-step') return phaseStepMoves(state, owned.tier);
  if (abilityId === 'leap') return leapMoves(state, owned.tier);
  return [];
}

// ---------------------------------------------------------------------------
// Activation.
// ---------------------------------------------------------------------------

export function applyAbilityActivate(
  state: BoardState,
  abilityId: AbilityId,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (state.pendingOffer) return state;

  // Cancel-by-retap for instant abilities (transforms / Surge). If the most
  // recent instant cast was this same ability AND nothing has consumed it
  // yet, restore the pre-cast snapshot (refunds the use).
  if (state.cancellableActivation?.abilityId === abilityId) {
    const snap = state.cancellableActivation.snapshot;
    return {
      ...state,
      form: snap.form,
      formMovesLeft: snap.formMovesLeft,
      bonusMovesLeft: snap.bonusMovesLeft,
      abilities: snap.abilities,
      shieldUp: snap.shieldUp,
      cancellableActivation: undefined,
      activeAbility: null,
    };
  }

  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const def = ABILITY_DEFS[abilityId];

  // Transform abilities resolve immediately — no targeting.
  if (def.activation === 'transform') {
    return applyTransform(state, abilityId);
  }
  // Passive abilities can't be tapped.
  if (def.activation === 'passive') return state;
  // Surge — instant, no target. Queues bonus moves and stays Rookie's turn.
  if (abilityId === 'surge') {
    return applySurge(state);
  }
  // Aegis — instant, no target. Raises a shield that absorbs the next capture.
  if (abilityId === 'aegis') {
    return applyAegis(state);
  }

  // Candidate-batch instants. Each is a small board edit and a use-decrement.
  // They share the cancellable-activation snapshot pattern with Surge/Aegis so
  // re-tapping the card before any side effect refunds the use.
  if (abilityId === 'rally') return applyRally(state, owned.tier);
  if (abilityId === 'quickstep') return applyQuickstep(state, owned.tier);
  if (abilityId === 'smoke') return applySmoke(state, owned.tier);
  if (abilityId === 'beeline') return applyBeeline(state, owned.tier);
  if (abilityId === 'mirror') return applyMirror(state);
  if (abilityId === 'foresight') return applyForesight(state);
  if (abilityId === 'bulwark') return applyBulwark(state);
  if (abilityId === 'skip') return applySkip(state);
  if (abilityId === 'decoy') return applyDecoy(state, owned.tier);
  if (abilityId === 'recall') return applyRecall(state);
  if (abilityId === 'tide') return applyTide(state, owned.tier);
  if (abilityId === 'tremor') return applyTremor(state, owned.tier);

  // Targeted abilities (and any movement abilities) fall through to "wait for
  // a follow-up tap." Sinkhole picks an empty square; bedrock picks a hazard
  // square; the rest pick an enemy.
  let step: 'pick-square' | 'pick-enemy' = 'pick-square';
  if (def.activation === 'targeted') {
    const pickSquare =
      abilityId === 'detonate' ||
      abilityId === 'bedrock' ||
      abilityId === 'sinkhole';
    step = pickSquare ? 'pick-square' : 'pick-enemy';
  }
  return { ...state, activeAbility: { id: abilityId, step } };
}

export function applyAbilityCancel(state: BoardState): BoardState {
  if (!state.activeAbility) return state;
  return { ...state, activeAbility: null };
}

function decrementUse(
  abilities: OwnedAbility[],
  id: AbilityId,
): OwnedAbility[] {
  return abilities.map((a) =>
    a.id === id
      ? {
          ...a,
          usesLeftThisLevel:
            a.usesLeftThisLevel < 0
              ? -1
              : Math.max(0, a.usesLeftThisLevel - 1),
        }
      : a,
  );
}

/** Transform Rookie immediately — bishop/knight/queen for N turns. */
function applyTransform(state: BoardState, abilityId: AbilityId): BoardState {
  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;
  const form = formForAbility(abilityId);
  if (!form) return state;
  const duration = transformDurationForTier(abilityId, owned.tier);
  return {
    ...state,
    form,
    formMovesLeft: duration,
    abilities: decrementUse(state.abilities, abilityId),
    activeAbility: null,
    cancellableActivation: {
      abilityId,
      snapshot: {
        form: state.form,
        formMovesLeft: state.formMovesLeft,
        bonusMovesLeft: state.bonusMovesLeft,
        abilities: state.abilities,
        shieldUp: state.shieldUp,
      },
    },
  };
}

/** Aegis — instant, raises a shield. Decrements 1 use unless already up
 *  (re-tapping while raised is a no-op so charges aren't wasted). T5 owners
 *  never decrement — their shield is permanent once raised. */
function applyAegis(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return state;
  if (state.shieldUp) return state; // shield already raised — don't double-spend
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return state;
  const nextAbilities =
    owned.tier === 5 ? state.abilities : decrementUse(state.abilities, 'aegis');
  return {
    ...state,
    shieldUp: true,
    abilities: nextAbilities,
    activeAbility: null,
    cancellableActivation: {
      abilityId: 'aegis',
      snapshot: {
        form: state.form,
        formMovesLeft: state.formMovesLeft,
        bonusMovesLeft: state.bonusMovesLeft,
        abilities: state.abilities,
        shieldUp: state.shieldUp,
      },
    },
  };
}

/** Bonus moves Surge grants per activation, by tier. */
function surgeBonusForTier(tier: AbilityTier): number {
  if (tier <= 2) return 1;
  if (tier <= 4) return 2;
  return 3;
}

/** Surge — instant, queues N bonus Rookie moves (no enemy turn between them). */
function applySurge(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'surge');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const bonus = surgeBonusForTier(owned.tier);
  return {
    ...state,
    bonusMovesLeft: state.bonusMovesLeft + bonus,
    abilities: decrementUse(state.abilities, 'surge'),
    activeAbility: null,
    cancellableActivation: {
      abilityId: 'surge',
      snapshot: {
        form: state.form,
        formMovesLeft: state.formMovesLeft,
        bonusMovesLeft: state.bonusMovesLeft,
        abilities: state.abilities,
        shieldUp: state.shieldUp,
      },
    },
  };
}

/**
 * Apply a movement-style ability (target square). Counts as a Rookie move
 * and passes turn to enemy.
 */
export function applyAbilityMove(
  state: BoardState,
  abilityId: AbilityId,
  target: Coord,
): BoardState {
  if (!state.activeAbility || state.activeAbility.id !== abilityId) return state;
  const legals = abilityLegalMoves(state, abilityId);
  if (!legals.some((m) => m.file === target.file && m.rank === target.rank)) {
    return state;
  }

  const owned = state.abilities.find((a) => a.id === abilityId)!;
  let pieces = state.pieces;
  const captures = [...state.captures];

  // Pawn Charge T4/T5 plow: kill every piece between start and target in the
  // same file (rookie.file === target.file).
  if (abilityId === 'pawn-charge' && state.rookie.file === target.file) {
    const lo = Math.min(state.rookie.rank, target.rank);
    const hi = Math.max(state.rookie.rank, target.rank);
    const plowed = pieces.filter(
      (p) => p.file === target.file && p.rank > lo && p.rank <= hi,
    );
    for (const k of plowed) captures.push(k.type);
    pieces = pieces.filter((p) => !plowed.includes(p));
  } else {
    // Capture if an enemy sits on the target.
    const captured = pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (captured) captures.push(captured.type);
    pieces = pieces.filter(
      (p) => !(p.file === target.file && p.rank === target.rank),
    );
  }

  const nextMoveCount = state.moveCount + 1;
  const abilities = decrementUse(state.abilities, abilityId);
  void owned;

  // Surge bonus-move bookkeeping: if any are queued, consume one and keep
  // control with Rookie instead of handing off to the enemy.
  const hasBonus = state.bonusMovesLeft > 0;
  const nextTurn: BoardState['turn'] = hasBonus ? 'rookie' : 'enemy';
  const nextBonus = hasBonus ? state.bonusMovesLeft - 1 : state.bonusMovesLeft;

  const fxKind: 'pawn-charge' | 'phase-step' | 'leap' | null =
    abilityId === 'pawn-charge'
      ? 'pawn-charge'
      : abilityId === 'phase-step'
        ? 'phase-step'
        : abilityId === 'leap'
          ? 'leap'
          : null;

  const afterMove: BoardState = {
    ...state,
    rookie: { ...target },
    pieces,
    captures,
    abilities,
    activeAbility: null,
    moveCount: nextMoveCount,
    bonusMovesLeft: nextBonus,
    turn: nextTurn,
    cancellableActivation: undefined,
    lastAbilityFx: fxKind
      ? {
          kind: fxKind,
          from: toSquare(state.rookie),
          to: toSquare(target),
          id: Date.now() + Math.random(),
        }
      : state.lastAbilityFx,
  };

  if (target.rank === 8) {
    return { ...afterMove, status: 'won', turn: 'rookie' };
  }
  if (afterMove.moveLimit !== null && nextMoveCount >= afterMove.moveLimit) {
    return { ...afterMove, status: 'lost', turn: 'rookie' };
  }
  return { ...afterMove, enemyMovedSquares: [], enemyVacatedSquares: [] };
}

/**
 * Apply a targeted/instant ability. Free action (does NOT advance the turn)
 * unless it's a Castle Swap that moves Rookie — that DOES advance the turn.
 */
export function applyAbilityTargeted(
  state: BoardState,
  abilityId: AbilityId,
  target: Coord,
): BoardState {
  if (!state.activeAbility || state.activeAbility.id !== abilityId) return state;
  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;

  if (abilityId === 'detonate') {
    const r = detonateRadius(owned.tier);
    const killed = state.pieces.filter(
      (p) =>
        Math.abs(p.file - target.file) <= r &&
        Math.abs(p.rank - target.rank) <= r,
    );
    const pieces = state.pieces.filter((p) => !killed.includes(p));
    const tempoRefund = owned.tier === 4 ? killed.length : 0;
    const captures = [...state.captures, ...killed.map((k) => k.type)];
    return {
      ...state,
      pieces,
      captures,
      tempo: Math.min(TEMPO_MAX, state.tempo + tempoRefund),
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'detonate',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'freeze-ray') {
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const turns = freezeTurns(owned.tier);
    const targets: Coord[] = [target];
    if (owned.tier === 4) {
      for (const p of state.pieces) {
        if (p === hit) continue;
        if (
          Math.abs(p.file - target.file) <= 1 &&
          Math.abs(p.rank - target.rank) <= 1
        ) {
          targets.push({ file: p.file, rank: p.rank });
        }
      }
    }
    const frozenSquares = [...state.frozenSquares];
    const frozenTurnsLeft = { ...state.frozenTurnsLeft };
    for (const t of targets) {
      const sq = toSquare(t);
      if (!frozenSquares.includes(sq)) frozenSquares.push(sq);
      frozenTurnsLeft[sq] = turns;
    }
    return {
      ...state,
      frozenSquares,
      frozenTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'freeze-ray',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'queenkiller') {
    // Must target a queen. Higher tiers add a radius effect (T4 pawns only,
    // T5 full 3x3 blast) and T2+ grants a small tempo refund on cast.
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit || hit.type !== 'queen') return state;

    let killed: EnemyPiece[] = [hit];
    if (owned.tier >= 4) {
      for (const p of state.pieces) {
        if (p === hit) continue;
        const inRadius =
          Math.abs(p.file - target.file) <= 1 &&
          Math.abs(p.rank - target.rank) <= 1;
        if (!inRadius) continue;
        // T4 only kills pawns in the splash. T5 kills everything in radius.
        if (owned.tier === 5 || p.type === 'pawn') killed.push(p);
      }
    }
    const pieces = state.pieces.filter((p) => !killed.includes(p));
    const captures = [...state.captures, ...killed.map((k) => k.type)];
    const tempoBonus = owned.tier >= 2 ? 2 : 0;
    return {
      ...state,
      pieces,
      captures,
      tempo: Math.min(TEMPO_MAX, state.tempo + tempoBonus),
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'detonate',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  // -------------------------------------------------------------------------
  // Candidate batch — targeted handlers. Each one mirrors an existing pattern
  // (Detonate / Freeze / Queenkiller / Pawn-Charge) where possible.
  // -------------------------------------------------------------------------
  if (abilityId === 'bedrock') {
    // Remove the hazard under `target`. T5 wipes every hazard regardless.
    if (owned.tier === 5) {
      if (state.hazards.length === 0) return state;
      return {
        ...state,
        hazards: [],
        abilities: decrementUse(state.abilities, abilityId),
        activeAbility: null,
        cancellableActivation: undefined,
      };
    }
    const isHazard = state.hazards.some(
      (h) => h.file === target.file && h.rank === target.rank,
    );
    if (!isHazard) return state;
    return {
      ...state,
      hazards: state.hazards.filter(
        (h) => !(h.file === target.file && h.rank === target.rank),
      ),
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
    };
  }

  if (abilityId === 'sinkhole') {
    // Convert any non-Rookie square into a hazard. T4 also kills the piece
    // on it; lower tiers only allow empty squares so the cast can't be wasted.
    if (target.file === state.rookie.file && target.rank === state.rookie.rank)
      return state;
    const onSquare = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (onSquare && owned.tier < 4) return state;
    if (state.hazards.some((h) => h.file === target.file && h.rank === target.rank))
      return state;
    let pieces = state.pieces;
    let captures = state.captures;
    if (onSquare) {
      pieces = pieces.filter((p) => p !== onSquare);
      captures = [...captures, onSquare.type];
    }
    return {
      ...state,
      pieces,
      captures,
      hazards: [...state.hazards, { file: target.file, rank: target.rank }],
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
    };
  }

  if (abilityId === 'slayer') {
    // Minor-piece killer. Mirrors Queenkiller — bot path is identical, only
    // the legal-target predicate differs. T5 also clears adjacent enemies.
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit || (hit.type !== 'knight' && hit.type !== 'bishop')) return state;
    let killed: EnemyPiece[] = [hit];
    if (owned.tier === 4) {
      for (const p of state.pieces) {
        if (p === hit) continue;
        if (p.type !== 'pawn') continue;
        if (
          Math.abs(p.file - target.file) <= 1 &&
          Math.abs(p.rank - target.rank) <= 1
        )
          killed.push(p);
      }
    } else if (owned.tier === 5) {
      for (const p of state.pieces) {
        if (p === hit) continue;
        if (
          Math.abs(p.file - target.file) <= 1 &&
          Math.abs(p.rank - target.rank) <= 1
        )
          killed.push(p);
      }
    }
    const pieces = state.pieces.filter((p) => !killed.includes(p));
    const captures = [...state.captures, ...killed.map((k) => k.type)];
    const tempoBonus = owned.tier === 2 ? 1 : 0;
    return {
      ...state,
      pieces,
      captures,
      tempo: Math.min(TEMPO_MAX, state.tempo + tempoBonus),
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'detonate',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'sapper') {
    // Wipe pawns on the target's file. T1 only nearest pawn; T2 only pawns
    // ahead of Rookie (rank > rookie.rank); T3+ entire file; T5 spills to
    // both adjacent files so a 3-wide wall snaps.
    const candidates = state.pieces.filter((p) => p.type === 'pawn');
    const filesToWipe: number[] =
      owned.tier === 5
        ? [target.file - 1, target.file, target.file + 1].filter(
            (f) => f >= 1 && f <= 8,
          )
        : [target.file];
    let pool = candidates.filter((p) => filesToWipe.includes(p.file));
    if (owned.tier === 1) {
      // Pick the single pawn on the target file nearest Rookie's rank.
      pool = pool
        .slice()
        .sort(
          (a, b) =>
            Math.abs(a.rank - state.rookie.rank) -
            Math.abs(b.rank - state.rookie.rank),
        )
        .slice(0, 1);
    } else if (owned.tier === 2) {
      pool = pool.filter((p) => p.rank > state.rookie.rank);
    }
    if (pool.length === 0) return state;
    const pieces = state.pieces.filter((p) => !pool.includes(p));
    const captures = [...state.captures, ...pool.map((k) => k.type)];
    return {
      ...state,
      pieces,
      captures,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'detonate',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'bait') {
    // Freeze every OTHER enemy except the targeted one. Lets Rookie focus on
    // dealing with one threat at a time.
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const turns =
      owned.tier === 1 || owned.tier === 2
        ? 1
        : owned.tier === 5
          ? 3
          : 2;
    const frozenSquares = [...state.frozenSquares];
    const frozenTurnsLeft = { ...state.frozenTurnsLeft };
    for (const p of state.pieces) {
      if (p === hit) continue;
      const sq = toSquare({ file: p.file, rank: p.rank });
      if (!frozenSquares.includes(sq)) frozenSquares.push(sq);
      frozenTurnsLeft[sq] = turns;
    }
    return {
      ...state,
      frozenSquares,
      frozenTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'freeze-ray',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'magnet' || abilityId === 'pushback') {
    // Reshape the board by dragging or shoving the targeted enemy along the
    // axis between it and Rookie. Distance scales by tier; if the path is
    // blocked, the push stops short. Magnet ends on the square BEFORE Rookie
    // so the enemy doesn't capture her by being yanked onto her square.
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const distByTier = (t: AbilityTier): number => {
      if (t === 1) return 1;
      if (t === 2 || t === 3) return 2;
      return 3;
    };
    const dist = distByTier(owned.tier);
    const df = Math.sign(state.rookie.file - hit.file);
    const dr = Math.sign(state.rookie.rank - hit.rank);
    // Pure cardinal/diagonal axis. If Rookie is exactly aligned on file or rank
    // we still want a meaningful pull; if neither aligns we shrug and bail.
    if (df === 0 && dr === 0) return state;
    const sign = abilityId === 'magnet' ? 1 : -1;
    let f = hit.file;
    let r = hit.rank;
    let landed = false;
    for (let step = 1; step <= dist; step++) {
      const nf = f + df * sign;
      const nr = r + dr * sign;
      if (nf < 1 || nf > 8 || nr < 1 || nr > 8) break;
      if (nf === state.rookie.file && nr === state.rookie.rank) break;
      if (state.hazards.some((h) => h.file === nf && h.rank === nr)) break;
      if (
        state.pieces.some(
          (p) => p !== hit && p.file === nf && p.rank === nr,
        )
      )
        break;
      f = nf;
      r = nr;
      landed = true;
    }
    if (!landed) return state;
    const pieces = state.pieces.map((p) =>
      p === hit ? { ...p, file: f, rank: r } : p,
    );
    return {
      ...state,
      pieces,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
    };
  }

  if (abilityId === 'mimic') {
    // Copy the target enemy's piece type as Rookie's form. Only knight /
    // bishop / queen are valid forms — pawn targets are rejected so the bot
    // can't softlock by mimicking an immobile piece.
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    if (hit.type !== 'knight' && hit.type !== 'bishop' && hit.type !== 'queen')
      return state;
    const duration =
      owned.tier === 5
        ? 999
        : owned.tier === 1
          ? 1
          : owned.tier === 2 || owned.tier === 3
            ? 2
            : 3;
    return {
      ...state,
      form: hit.type as RookieForm,
      formMovesLeft: duration,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: {
        abilityId,
        snapshot: {
          form: state.form,
          formMovesLeft: state.formMovesLeft,
          bonusMovesLeft: state.bonusMovesLeft,
          abilities: state.abilities,
          shieldUp: state.shieldUp,
        },
      },
    };
  }

  if (abilityId === 'tempo-vault') {
    // Trade material for tempo. Any piece type works — the bot picks based on
    // tempo-gain vs board-impact.
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const gain =
      owned.tier === 1 || owned.tier === 2
        ? 2
        : owned.tier === 3 || owned.tier === 4
          ? 3
          : 4;
    return {
      ...state,
      pieces: state.pieces.filter((p) => p !== hit),
      captures: [...state.captures, hit.type],
      tempo: Math.min(TEMPO_MAX, state.tempo + gain),
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'detonate',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  return state;
}

function detonateRadius(tier: AbilityTier): number {
  if (tier === 1) return 0;
  if (tier === 5) return 2;
  return 1;
}

function freezeTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 5) return 99;
  return 2;
}

/**
 * Aegis intercept: if there's an Aegis charge available, consumes 1 charge
 * and either blocks the capture (kills the attacker on T5, or just stops
 * the capture). T3 also stuns the attacker for 1 turn. Returns null if Aegis
 * doesn't fire (no charges, no aegis owned).
 *
 * Called by enemy-turn resolution BEFORE the capture lands.
 */
export function tryAegisIntercept(
  state: BoardState,
  attacker: EnemyPiece,
): BoardState | null {
  if (!state.shieldUp) return null;
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return null;

  let pieces = state.pieces;
  let captures = state.captures;
  if (owned.tier === 5) {
    // Attacker dies instead of capturing.
    pieces = pieces.filter((p) => p !== attacker);
    captures = [...captures, attacker.type];
  }

  // T3: stun the attacker for 1 turn (freeze its square).
  let frozenSquares = state.frozenSquares;
  let frozenTurnsLeft = state.frozenTurnsLeft;
  if (owned.tier === 3) {
    const sq = toSquare({ file: attacker.file, rank: attacker.rank });
    if (!frozenSquares.includes(sq)) frozenSquares = [...frozenSquares, sq];
    frozenTurnsLeft = { ...frozenTurnsLeft, [sq]: 2 };
  }

  // T5: shield stays up permanently. Lower tiers: shield consumed by this hit
  // (charges were already decremented when the player raised the shield).
  const shieldUp = owned.tier === 5;

  return {
    ...state,
    pieces,
    captures,
    frozenSquares,
    frozenTurnsLeft,
    shieldUp,
  };
}

/** Reset every owned ability's per-level uses (called at level transitions). */
export function refreshAbilityUses(abilities: OwnedAbility[]): OwnedAbility[] {
  return abilities.map((a) => ({
    ...a,
    usesLeftThisLevel: maxUsesForTier(a.id, a.tier),
  }));
}

// ---------------------------------------------------------------------------
// Candidate batch — instant handlers. Each follows the Aegis/Surge pattern:
// snapshot pre-cast state for cancel-by-retap, decrement uses, and either
// modify board state directly or flip the turn flag.
// ---------------------------------------------------------------------------

/** Build the snapshot object for cancel-by-retap. Centralised so every new
 *  instant captures the same fields without copy/paste. */
function snapshotForCancel(state: BoardState): NonNullable<
  BoardState['cancellableActivation']
>['snapshot'] {
  return {
    form: state.form,
    formMovesLeft: state.formMovesLeft,
    bonusMovesLeft: state.bonusMovesLeft,
    abilities: state.abilities,
    shieldUp: state.shieldUp,
  };
}

/** Rally — refund tempo. T5 floods the meter; lower tiers add a fixed bump. */
function applyRally(state: BoardState, tier: AbilityTier): BoardState {
  const refund =
    tier === 1 ? 4 : tier === 2 ? 5 : tier === 3 ? 6 : tier === 4 ? 8 : TEMPO_MAX;
  const owned = state.abilities.find((a) => a.id === 'rally');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  return {
    ...state,
    tempo: Math.min(TEMPO_MAX, state.tempo + refund),
    abilities: decrementUse(state.abilities, 'rally'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'rally', snapshot: snapshotForCancel(state) },
  };
}

/** Quickstep — gentler Surge. Always +1 bonus move regardless of tier; only
 *  the use cadence scales. T5 = unlimited charges. */
function applyQuickstep(state: BoardState, tier: AbilityTier): BoardState {
  void tier; // The effect is constant; tier only changes uses (handled elsewhere).
  const owned = state.abilities.find((a) => a.id === 'quickstep');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  return {
    ...state,
    bonusMovesLeft: state.bonusMovesLeft + 1,
    abilities: decrementUse(state.abilities, 'quickstep'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'quickstep', snapshot: snapshotForCancel(state) },
  };
}

/** Smoke — freeze every enemy on Rookie's current rank for N turns. */
function applySmoke(state: BoardState, tier: AbilityTier): BoardState {
  const owned = state.abilities.find((a) => a.id === 'smoke');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const turns = tier === 1 || tier === 2 ? 1 : tier === 5 ? 3 : 2;
  const targets = state.pieces.filter((p) => p.rank === state.rookie.rank);
  if (targets.length === 0) return state; // wasted cast — refund by no-op
  const frozenSquares = [...state.frozenSquares];
  const frozenTurnsLeft = { ...state.frozenTurnsLeft };
  for (const p of targets) {
    const sq = toSquare({ file: p.file, rank: p.rank });
    if (!frozenSquares.includes(sq)) frozenSquares.push(sq);
    frozenTurnsLeft[sq] = turns;
  }
  return {
    ...state,
    frozenSquares,
    frozenTurnsLeft,
    abilities: decrementUse(state.abilities, 'smoke'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'smoke', snapshot: snapshotForCancel(state) },
  };
}

/** Beeline — if Rookie's file is clear to rank 8, teleport her there and win.
 *  Otherwise tries to advance up to N ranks on the same file (depending on
 *  tier) before stopping at the first occupant. Counts as a Rookie move. */
function applyBeeline(state: BoardState, tier: AbilityTier): BoardState {
  const owned = state.abilities.find((a) => a.id === 'beeline');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  // Determine reach: T1=3 ranks, T2=4, T3=5, T4=6, T5=7 — T5 always reaches 8.
  const reach = tier === 1 ? 3 : tier === 2 ? 4 : tier === 3 ? 5 : tier === 4 ? 6 : 7;
  let target = state.rookie.rank;
  for (let d = 1; d <= reach; d++) {
    const r = state.rookie.rank + d;
    if (r > 8) break;
    const occ = state.pieces.find((p) => p.file === state.rookie.file && p.rank === r);
    if (occ) break;
    if (state.hazards.some((h) => h.file === state.rookie.file && h.rank === r))
      break;
    target = r;
  }
  if (target === state.rookie.rank) return state; // nothing to do, refund cast
  const nextMoveCount = state.moveCount + 1;
  const abilities = decrementUse(state.abilities, 'beeline');
  const won = target === 8;
  return {
    ...state,
    rookie: { file: state.rookie.file, rank: target },
    abilities,
    activeAbility: null,
    moveCount: nextMoveCount,
    turn: won ? 'rookie' : state.bonusMovesLeft > 0 ? 'rookie' : 'enemy',
    bonusMovesLeft:
      won ? state.bonusMovesLeft : Math.max(0, state.bonusMovesLeft - (state.bonusMovesLeft > 0 ? 1 : 0)),
    status: won ? 'won' : state.status,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'leap',
      from: toSquare(state.rookie),
      to: toSquare({ file: state.rookie.file, rank: target }),
      id: Date.now() + Math.random(),
    },
  };
}

/** Mirror — raise a one-shot retaliation flag. Mirror always kills the
 *  attacker; T2 even pays a tempo bounty back. T5 keeps the flag up so every
 *  attacker dies until the level ends. */
function applyMirror(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'mirror');
  if (!owned) return state;
  if (state.mirrorUp) return state;
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return state;
  const nextAbilities =
    owned.tier === 5 ? state.abilities : decrementUse(state.abilities, 'mirror');
  return {
    ...state,
    mirrorUp: true,
    abilities: nextAbilities,
    activeAbility: null,
    cancellableActivation: { abilityId: 'mirror', snapshot: snapshotForCancel(state) },
  };
}

/** Foresight — auto-raise Aegis-style shield IF Rookie is currently in any
 *  enemy attack set. Otherwise the cast still spends a use but no shield —
 *  this is deliberate so the bot has to read threats. */
function applyForesight(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'foresight');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  // Threat detection inline to keep this file self-contained — same logic as
  // bots' enemyAttackedSquares but only for Rookie's square.
  const threatened = squareAttackedByAnyEnemy(state, state.rookie);
  let shieldUp = state.shieldUp;
  let bonusMovesLeft = state.bonusMovesLeft;
  if (threatened) {
    shieldUp = true;
    // T4 grants an extra bonus move on a successful Foresight read — the
    // "predicted and side-stepped" combo.
    if (owned.tier === 4) bonusMovesLeft += 1;
  }
  return {
    ...state,
    shieldUp,
    bonusMovesLeft,
    abilities: decrementUse(state.abilities, 'foresight'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'foresight', snapshot: snapshotForCancel(state) },
  };
}

/** Bulwark — shared shieldUp pool with Aegis but cheaper to stack early. The
 *  charges live in the ability's own `usesLeftThisLevel`. */
function applyBulwark(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'bulwark');
  if (!owned) return state;
  if (state.shieldUp) return state;
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return state;
  const nextAbilities =
    owned.tier === 5 ? state.abilities : decrementUse(state.abilities, 'bulwark');
  return {
    ...state,
    shieldUp: true,
    abilities: nextAbilities,
    activeAbility: null,
    cancellableActivation: { abilityId: 'bulwark', snapshot: snapshotForCancel(state) },
  };
}

/** Skip — pass the turn back to the enemy without moving. Counts as a Rookie
 *  move so it ticks the move limit; useful for baiting freezes or burning an
 *  enemy turn while a defended chain dissolves. */
function applySkip(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'skip');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const nextMoveCount = state.moveCount + 1;
  const tempoBonus = owned.tier === 4 ? 1 : 0;
  const next: BoardState = {
    ...state,
    moveCount: nextMoveCount,
    abilities: decrementUse(state.abilities, 'skip'),
    activeAbility: null,
    tempo: Math.min(TEMPO_MAX, state.tempo + tempoBonus),
    turn: 'enemy',
    cancellableActivation: undefined,
    enemyMovedSquares: [],
    enemyVacatedSquares: [],
  };
  if (next.moveLimit !== null && nextMoveCount >= next.moveLimit) {
    return { ...next, status: 'lost', turn: 'rookie' };
  }
  return next;
}

/** Decoy — queue a "skip the next enemy turn" token. pawn-ai drains it. */
function applyDecoy(state: BoardState, tier: AbilityTier): BoardState {
  const owned = state.abilities.find((a) => a.id === 'decoy');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const add = tier === 1 || tier === 2 ? 1 : tier === 5 ? 99 : 2;
  return {
    ...state,
    skipEnemyTurns: (state.skipEnemyTurns ?? 0) + add,
    abilities: decrementUse(state.abilities, 'decoy'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'decoy', snapshot: snapshotForCancel(state) },
  };
}

/** Recall — teleport Rookie to (file, 1). Counts as a Rookie move; doesn't
 *  capture. Useful for escape when she's hemmed in on a high rank. */
function applyRecall(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'recall');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  if (state.rookie.rank === 1) return state; // already on rank 1 — refund cast
  // If rank-1 same-file is blocked by a piece, no-op; if a hazard, no-op.
  const dest = { file: state.rookie.file, rank: 1 };
  if (state.pieces.some((p) => p.file === dest.file && p.rank === dest.rank))
    return state;
  if (state.hazards.some((h) => h.file === dest.file && h.rank === dest.rank))
    return state;
  const nextMoveCount = state.moveCount + 1;
  const hasBonus = state.bonusMovesLeft > 0;
  const next: BoardState = {
    ...state,
    rookie: dest,
    moveCount: nextMoveCount,
    abilities: decrementUse(state.abilities, 'recall'),
    activeAbility: null,
    turn: hasBonus ? 'rookie' : 'enemy',
    bonusMovesLeft: hasBonus ? state.bonusMovesLeft - 1 : state.bonusMovesLeft,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'phase-step',
      from: toSquare(state.rookie),
      to: toSquare(dest),
      id: Date.now() + Math.random(),
    },
  };
  if (next.moveLimit !== null && nextMoveCount >= next.moveLimit) {
    return { ...next, status: 'lost', turn: 'rookie' };
  }
  return next;
}

/** Tide — push enemies above Rookie one rank toward rank 8. T1: just the rank
 *  directly above Rookie. T3+: the rank closest to Rookie that has pieces.
 *  T4: also lifts the rank above that. T5: every piece on the board surges.
 *  Pieces pushed off rank 8 are destroyed (added to captures). */
function applyTide(state: BoardState, tier: AbilityTier): BoardState {
  const owned = state.abilities.find((a) => a.id === 'tide');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  let ranksToPush: number[];
  if (tier === 5) {
    // Every rank above Rookie.
    ranksToPush = [];
    for (let r = state.rookie.rank + 1; r <= 8; r++) ranksToPush.push(r);
  } else if (tier === 4) {
    // Two nearest ranks containing pieces, from low to high (so they bubble up).
    const occupiedAbove = Array.from(
      new Set(state.pieces.filter((p) => p.rank > state.rookie.rank).map((p) => p.rank)),
    ).sort((a, b) => a - b);
    ranksToPush = occupiedAbove.slice(0, 2);
  } else if (tier === 3) {
    const occupiedAbove = Array.from(
      new Set(state.pieces.filter((p) => p.rank > state.rookie.rank).map((p) => p.rank)),
    ).sort((a, b) => a - b);
    ranksToPush = occupiedAbove.slice(0, 1);
  } else if (tier === 2) {
    ranksToPush = [state.rookie.rank + 1];
  } else {
    ranksToPush = [state.rookie.rank + 1];
  }

  if (ranksToPush.length === 0) return state;

  let pieces = state.pieces.slice();
  let captures = state.captures.slice();
  // Process highest ranks first so pieces can bubble up without colliding
  // with the destination of a lower-rank push.
  for (const r of ranksToPush.slice().sort((a, b) => b - a)) {
    const movers = pieces.filter((p) => p.rank === r);
    for (const m of movers) {
      const dest = { file: m.file, rank: r + 1 };
      if (dest.rank > 8) {
        pieces = pieces.filter((p) => p !== m);
        captures.push(m.type);
        continue;
      }
      if (state.hazards.some((h) => h.file === dest.file && h.rank === dest.rank))
        continue; // blocked, stays put
      if (pieces.some((p) => p !== m && p.file === dest.file && p.rank === dest.rank))
        continue;
      pieces = pieces.map((p) => (p === m ? { ...p, rank: dest.rank } : p));
    }
  }
  return {
    ...state,
    pieces,
    captures,
    abilities: decrementUse(state.abilities, 'tide'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'tide', snapshot: snapshotForCancel(state) },
  };
}

/**
 * Tremor — self-centered AoE pushback. Shake the ground; enemies near Rookie
 * stagger directly away from her by N squares. Differs from Pushback
 * (targeted single-enemy) and Tide (rank-based wave) by being self-centered
 * and radial. Tier scaling:
 *   T1: nearest adjacent enemy back 1
 *   T2: all radius-1 enemies back 1
 *   T3: all radius-1 enemies back 1 (more uses)
 *   T4: all radius-2 enemies back 1
 *   T5: all radius-2 enemies back 2
 *
 * Push direction = unit vector from Rookie toward the piece, snapped to the
 * 8 compass directions. If destination is off-board, the piece is destroyed
 * (counted as a capture). If blocked by another piece or hazard, the
 * piece stays put.
 */
function applyTremor(state: BoardState, tier: AbilityTier): BoardState {
  const owned = state.abilities.find((a) => a.id === 'tremor');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;

  const radius = tier >= 4 ? 2 : 1;
  const shoveDistance = tier === 5 ? 2 : 1;

  // Find enemies in radius.
  const inRange = state.pieces.filter((p) => {
    const df = Math.abs(p.file - state.rookie.file);
    const dr = Math.abs(p.rank - state.rookie.rank);
    if (df === 0 && dr === 0) return false;
    return df <= radius && dr <= radius;
  });

  // T1 narrows to the single closest. Ties broken by chess-priority order:
  // pieces with higher value first (queen > minor > pawn), then leftmost.
  const VALUE: Record<PieceType, number> = { queen: 4, knight: 3, bishop: 2, pawn: 1 };
  let movers = inRange;
  if (tier === 1) {
    inRange.sort((a, b) => {
      const da =
        Math.max(Math.abs(a.file - state.rookie.file), Math.abs(a.rank - state.rookie.rank));
      const db =
        Math.max(Math.abs(b.file - state.rookie.file), Math.abs(b.rank - state.rookie.rank));
      if (da !== db) return da - db;
      if (VALUE[b.type] !== VALUE[a.type]) return VALUE[b.type] - VALUE[a.type];
      return a.file - b.file;
    });
    movers = inRange.slice(0, 1);
  }

  if (movers.length === 0) return state;

  let pieces = state.pieces.slice();
  const captures = state.captures.slice();

  // Compute push direction (unit vector away from Rookie). Snap to 8 dirs.
  const sign = (n: number): number => (n === 0 ? 0 : n > 0 ? 1 : -1);

  for (const m of movers) {
    const df = sign(m.file - state.rookie.file);
    const dr = sign(m.rank - state.rookie.rank);
    if (df === 0 && dr === 0) continue;
    const destF = m.file + df * shoveDistance;
    const destR = m.rank + dr * shoveDistance;
    // Off-board → destroyed.
    if (destF < 1 || destF > 8 || destR < 1 || destR > 8) {
      pieces = pieces.filter((p) => p !== m);
      captures.push(m.type);
      continue;
    }
    // Hazard → blocked (stays put).
    if (state.hazards.some((h) => h.file === destF && h.rank === destR)) continue;
    // Collision with another piece → blocked.
    if (pieces.some((p) => p !== m && p.file === destF && p.rank === destR)) continue;
    // Collision with Rookie (shouldn't happen since we pushed AWAY) → blocked.
    if (state.rookie.file === destF && state.rookie.rank === destR) continue;
    pieces = pieces.map((p) => (p === m ? { ...p, file: destF, rank: destR } : p));
  }

  return {
    ...state,
    pieces,
    captures,
    abilities: decrementUse(state.abilities, 'tremor'),
    activeAbility: null,
    cancellableActivation: { abilityId: 'tremor', snapshot: snapshotForCancel(state) },
  };
}

/** Mirror intercept — sibling to tryAegisIntercept. Called BEFORE Aegis so
 *  the cheaper effect resolves first. Always kills the attacker. */
export function tryMirrorIntercept(
  state: BoardState,
  attacker: EnemyPiece,
): BoardState | null {
  if (!state.mirrorUp) return null;
  const owned = state.abilities.find((a) => a.id === 'mirror');
  if (!owned) return null;
  const pieces = state.pieces.filter((p) => p !== attacker);
  const captures = [...state.captures, attacker.type];
  const tempoBonus = owned.tier === 2 ? 1 : 0;
  // T5 keeps the flag up so every subsequent attacker also dies; lower tiers
  // consume it on this single hit.
  const mirrorUp = owned.tier === 5;
  return {
    ...state,
    pieces,
    captures,
    tempo: Math.min(TEMPO_MAX, state.tempo + tempoBonus),
    mirrorUp,
  };
}

/** Compact threat check used by Foresight — duplicates the attack-projection
 *  in scripts/run-playtest/bots/shared so the engine doesn't need to import
 *  bot code. Only used on cast so the cost is bounded. */
function squareAttackedByAnyEnemy(state: BoardState, square: Coord): boolean {
  for (const p of state.pieces) {
    const sq = toSquare({ file: p.file, rank: p.rank });
    if (state.frozenSquares.includes(sq)) continue;
    if (pieceAttacks(state, p, square)) return true;
  }
  return false;
}

function pieceAttacks(state: BoardState, piece: EnemyPiece, sq: Coord): boolean {
  switch (piece.type) {
    case 'pawn':
      // Black pawns attack diagonally toward rank 1.
      return (
        Math.abs(piece.file - sq.file) === 1 && piece.rank - 1 === sq.rank
      );
    case 'knight': {
      const df = Math.abs(piece.file - sq.file);
      const dr = Math.abs(piece.rank - sq.rank);
      return (df === 1 && dr === 2) || (df === 2 && dr === 1);
    }
    case 'bishop':
      return slideAttacks(state, piece, sq, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
    case 'queen':
      return slideAttacks(state, piece, sq, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
  }
}

function slideAttacks(
  state: BoardState,
  piece: EnemyPiece,
  sq: Coord,
  dirs: ReadonlyArray<readonly [number, number]>,
): boolean {
  for (const [df, dr] of dirs) {
    let f = piece.file + df;
    let r = piece.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      if (f === sq.file && r === sq.rank) return true;
      const blocked =
        state.pieces.some(
          (q) => q !== piece && q.file === f && q.rank === r,
        ) ||
        (state.rookie.file === f && state.rookie.rank === r);
      if (blocked) break;
      f += df;
      r += dr;
    }
  }
  return false;
}
