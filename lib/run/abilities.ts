/**
 * Rookie's Run — Ability progression system.
 *
 * 12 shipped abilities, each 5 tiers. Tempo fills → player picks new ability
 * or upgrades an owned one. Abilities are permanent for the run.
 *
 * Tier shape: T1-T3 scale power, T4 doubles uses or adds a twist, T5 is
 * the permanent / unlimited payoff.
 */

import { boulderAt, enemyNoGo, rookieLegalMoves } from './movement';
import { getRunById } from './runs';
import { mulberry32 } from './seed';
import { TEMPO_MAX, TEMPO_REWARD } from './scoring';
import { toSquare } from './types';
import type {
  AllyPiece,
  BoardState,
  Coord,
  Drone,
  EnemyPiece,
  PieceType,
  RookieForm,
} from './types';

export type AbilityId =
  | 'bishop-step'
  | 'knight-hop'
  | 'queen-pulse'
  | 'become-king'
  | 'freeze-ray'
  | 'poison-dart'
  | 'rabies-dart'
  | 'convert'
  | 'drones'
  | 'squad'
  | 'surge'
  | 'aegis'
  | 'decoy'
  // Experimental (bot-tested only — never offered to players; see
  // EXPERIMENTAL_ABILITY_IDS). Promote by removing from that list + adding
  // card art/FX.
  | 'detonate'
  | 'yank'
  | 'phalanx'
  // Experimental BOARD-EDITING abilities (bot-tested only) — they add
  // terrain (smoke clouds / boulders) rather than acting on pieces.
  | 'smoke'
  | 'boulder';

export type AbilityTier = 1 | 2 | 3 | 4 | 5;

/**
 * - movement: tap card, then tap a board square (legal moves shown).
 * - targeted: tap card, then tap any enemy / any square depending on ability.
 * - transform: tap card → Rookie morphs into another piece for N turns.
 * - instant:   tap card → resolves immediately (Surge / Aegis).
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
  'become-king': {
    id: 'become-king',
    name: 'Become King',
    activation: 'transform',
    typeLine: 'Transform · Royal',
    description: 'Become an impervious king. Nothing can capture you.',
  },
  'freeze-ray': {
    id: 'freeze-ray',
    name: 'Freeze Ray',
    activation: 'targeted',
    typeLine: 'Targeted · Control',
    description: 'Freeze an enemy you can see.',
  },
  'poison-dart': {
    id: 'poison-dart',
    name: 'Poison Dart',
    activation: 'targeted',
    typeLine: 'Targeted · Bow',
    description: 'Poison an enemy you can see. It dies in a few turns.',
  },
  'rabies-dart': {
    id: 'rabies-dart',
    name: 'Rabies Dart',
    activation: 'targeted',
    typeLine: 'Targeted · Bow',
    description: 'Drive an enemy mad. It attacks the nearest piece.',
  },
  convert: {
    id: 'convert',
    name: 'Convert',
    activation: 'targeted',
    typeLine: 'Targeted · Defect',
    description: 'Flip an enemy onto your team.',
  },
  drones: {
    id: 'drones',
    name: 'Drones',
    activation: 'instant',
    typeLine: 'Instant · Swarm',
    description: 'Launch mini-Rookies that capture in fixed directions.',
  },
  squad: {
    id: 'squad',
    name: 'Squad',
    activation: 'passive',
    typeLine: 'Passive · Spawn',
    description: 'Allies spawn each level. They march and capture.',
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
  decoy: {
    id: 'decoy',
    name: 'Decoy',
    activation: 'targeted',
    typeLine: 'Targeted · Trick',
    description: 'Mark an enemy. Its teammates will attack it.',
  },
  detonate: {
    id: 'detonate',
    name: 'Detonate',
    activation: 'instant',
    typeLine: 'Instant · Blast',
    description: 'Destroy enemies next to Rookie.',
  },
  yank: {
    id: 'yank',
    name: 'Grapple',
    activation: 'targeted',
    typeLine: 'Targeted · Pull',
    description: 'Drag an enemy you can see next to Rookie, briefly frozen.',
  },
  phalanx: {
    id: 'phalanx',
    name: 'Phalanx',
    activation: 'instant',
    typeLine: 'Instant · Bodyguards',
    description: 'Summon pawn allies around Rookie.',
  },
  smoke: {
    id: 'smoke',
    name: 'Smoke',
    activation: 'instant',
    typeLine: 'Instant · Cloud',
    description: 'Puff a cloud around Rookie. Enemies cannot see through it.',
  },
  boulder: {
    id: 'boulder',
    name: 'Boulder',
    activation: 'targeted',
    typeLine: 'Targeted · Rock',
    description: 'Drop a rock near Rookie. It blocks everyone for the level.',
  },
};

export const ALL_ABILITY_IDS: AbilityId[] = Object.keys(
  ABILITY_DEFS,
) as AbilityId[];

/**
 * Prototype abilities under bot-driven power testing. Fully playable by the
 * ENGINE (so playtest sims can seed them via preownedAbilities), but excluded
 * from the offer pool so real players never see them — they have no card art
 * or FX yet. Promote one by removing it from this list and adding its UI.
 */
export const EXPERIMENTAL_ABILITY_IDS: readonly AbilityId[] = [
  'detonate',
  'yank',
  'phalanx',
  // Board-editing (terrain) abilities. `smoke` was promoted to the offer
  // pool 2026-08-18 (power test T4×12: 19.2/30.0/37.5pp at T1/T3/T5, above
  // freeze-ray at every tier). `boulder` stays bot-only: T1 8.3 / T3 11.7pp
  // is below the weakest shipped ability by more than the 5pp band.
  // Suggested next buff: T3 range 3 + 3 rocks + crush PAWNS from T3 (move
  // the T4 pawn-crush down a tier), then retest.
  'boulder',
];

/**
 * The abilities real players can be OFFERED. Playtest scripts (digest.ts,
 * ablation.ts, etc.) iterate this list too.
 */
export const SHIPPED_ABILITY_IDS: AbilityId[] = ALL_ABILITY_IDS.filter(
  (id) => !EXPERIMENTAL_ABILITY_IDS.includes(id),
);

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
    case 'become-king':
      // 1/2/2/3/3 — each tier adds +1 turn OR +1 use, never both.
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 2;
      if (tier === 4) return 3;
      return 3;
    case 'freeze-ray':
      if (tier === 3 || tier === 4) return 2;
      return 1;
    case 'poison-dart':
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 2;
      if (tier === 4) return 3;
      return 2;
    case 'rabies-dart':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 2;
    case 'convert':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 2;
    case 'drones':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 2;
    case 'squad':
      // Passive — no per-activation uses.
      return -1;
    case 'detonate':
      if (tier <= 2) return 1;
      return 2;
    case 'yank':
      if (tier <= 2) return 1;
      return 2;
    case 'phalanx':
      if (tier <= 2) return 1;
      return 2;
    case 'smoke':
      // Uses per level: 1/1/2/2/3.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return 3;
    case 'boulder':
      // Uses = rocks per level: 2/2/3/3/4.
      if (tier <= 2) return 2;
      if (tier <= 4) return 3;
      return 4;
    case 'surge':
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 1;
      return 2;
    case 'aegis':
      if (tier === 1) return 1;
      if (tier === 2 || tier === 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'decoy':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 1;
  }
}

/** Transform form a transform-ability grants. */
export function formForAbility(id: AbilityId): RookieForm | null {
  if (id === 'bishop-step') return 'bishop';
  if (id === 'knight-hop') return 'knight';
  if (id === 'queen-pulse') return 'queen';
  if (id === 'become-king') return 'king';
  return null;
}

/** Duration (in Rookie moves) for a transform ability at a given tier. */
export function transformDurationForTier(
  id: AbilityId,
  tier: AbilityTier,
): number {
  if (tier === 5) return 999;
  if (id === 'bishop-step' || id === 'knight-hop') {
    if (tier === 1) return 1;
    if (tier === 2) return 2;
    return 3;
  }
  if (id === 'queen-pulse') {
    if (tier === 1) return 1;
    if (tier === 2 || tier === 3) return 2;
    return 3;
  }
  if (id === 'become-king') {
    // Counts ENEMY turns of invulnerability — decrement happens at end of
    // enemy turn (see endTurn in pawn-ai.ts), not at end of Rookie's move
    // like the movement transforms. So "N turns" = N protected enemy turns.
    // 1/1/2/2/3 — paired with uses 1/2/2/3/3 for a gradual curve.
    if (tier === 1) return 1;
    if (tier === 2) return 1;
    if (tier === 3) return 2;
    if (tier === 4) return 2;
    return 3;
  }
  return 0;
}

export interface AbilityBlurb {
  /** Plain-English effect: "Move diagonally for 1 turn." */
  what: string;
  /** How to activate it: "Tap card, then tap a diagonal square." */
  how: string;
  /** Use limit per level in plain words, or "" for unlimited. */
  limit: string;
}

const HOW: Record<AbilityId, string> = {
  'bishop-step': 'Tap card, then tap a diagonal square.',
  'knight-hop': 'Tap card, then tap a knight square.',
  'queen-pulse': 'Tap card, then tap any square.',
  'become-king': 'Tap card, then tap a king-move square.',
  'freeze-ray': 'Tap card, then tap an enemy you can see.',
  'poison-dart': 'Tap card, then tap an enemy you can see.',
  'rabies-dart': 'Tap card, then tap an enemy you can see.',
  convert: 'Tap card, then tap an eligible enemy.',
  drones: 'Tap card. Drones launch in fixed directions.',
  squad: 'Passive — allies spawn each level.',
  surge: 'Tap card. You get an extra move.',
  aegis: 'Tap card. Shield stays up until used.',
  decoy: 'Tap card, then tap an enemy.',
  detonate: 'Tap card. Enemies next to Rookie are destroyed.',
  yank: 'Tap card, then tap an enemy you can see.',
  phalanx: 'Tap card. Pawn allies spawn around Rookie.',
  smoke: 'Tap card. A cloud puffs around Rookie.',
  boulder: 'Tap card, then tap an empty square near Rookie.',
};

function limitText(id: AbilityId, tier: AbilityTier): string {
  const n = maxUsesForTier(id, tier);
  if (n < 0) return '';
  if (n === 1) return '1 use per level';
  return `${n} uses per level`;
}

export function blurbDetailForTier(
  id: AbilityId,
  tier: AbilityTier,
): AbilityBlurb {
  const how = HOW[id];
  const limit = limitText(id, tier);
  const what = whatForTier(id, tier);
  return { what, how, limit };
}

function whatForTier(id: AbilityId, tier: AbilityTier): string {
  switch (id) {
    case 'bishop-step':
      if (tier === 5) return 'Move diagonally for the rest of the level.';
      if (tier >= 3) return 'Move diagonally for 3 turns.';
      if (tier === 2) return 'Move diagonally for 2 turns.';
      return 'Move diagonally for 1 turn.';
    case 'knight-hop':
      if (tier === 5) return 'Move in L-shapes for the rest of the level.';
      if (tier >= 3) return 'Move in L-shapes for 3 turns.';
      if (tier === 2) return 'Move in L-shapes for 2 turns.';
      return 'Move in L-shapes for 1 turn.';
    case 'queen-pulse':
      if (tier === 5) return 'Move any direction for the rest of the level.';
      if (tier === 4) return 'Move any direction for 3 turns.';
      if (tier >= 2) return 'Move any direction for 2 turns.';
      return 'Move any direction for 1 turn.';
    case 'become-king':
      if (tier === 5) return 'Become a king for 3 turns. Nothing can capture you.';
      if (tier === 4) return 'Become a king for 2 turns. Nothing can capture you.';
      if (tier === 3) return 'Become a king for 2 turns. Nothing can capture you.';
      if (tier === 2) return 'Become a king for 1 turn. Nothing can capture you.';
      return 'Become a king for 1 turn. Nothing can capture you.';
    case 'freeze-ray':
      if (tier === 5) return 'Freeze an enemy. It never moves again.';
      if (tier === 4) return 'Freeze an enemy in place for 3 turns.';
      if (tier >= 2) return 'Freeze an enemy in place for 2 turns.';
      return 'Freeze an enemy in place for 1 turn.';
    case 'poison-dart':
      if (tier === 5) return 'Poison an enemy. It dies next turn.';
      if (tier >= 3) return 'Poison an enemy. It dies in 2 turns.';
      return 'Poison an enemy. It dies in 3 turns.';
    case 'rabies-dart':
      if (tier === 5)
        return 'Drive an enemy mad for 5 turns. It attacks its own side.';
      if (tier === 4)
        return 'Drive an enemy mad for 3 turns. It attacks its own side.';
      if (tier >= 2)
        return 'Drive an enemy mad for 2 turns. It attacks its own side.';
      return 'Drive an enemy mad for 1 turn. It attacks its own side.';
    case 'convert':
      if (tier === 5) return 'Flip any enemy (except king) onto your team.';
      if (tier === 4) return 'Flip any enemy rook, queen, knight, bishop, or pawn.';
      if (tier === 3) return 'Flip an enemy rook or queen onto your team.';
      if (tier === 2) return 'Flip an enemy knight or bishop onto your team.';
      return 'Flip an enemy pawn onto your team.';
    case 'drones':
      if (tier === 5) return 'Launch 6 drones (3 front, sides, back).';
      if (tier === 4) return 'Launch drones front, sides, and back.';
      if (tier === 3) return 'Launch drones front, left, and right.';
      if (tier === 2) return 'Launch drones front and left.';
      return 'Launch a drone forward.';
    case 'squad':
      if (tier === 5) return '7 allies: 3 pawns (front), knight, bishop, 3 more pawns (rank+2).';
      if (tier === 4) return '5 allies: 3 pawns (front), knight, bishop.';
      if (tier === 3) return '4 allies: 3 pawns + a knight.';
      if (tier === 2) return '3 pawns in front of Rookie.';
      return '1 pawn in front of Rookie.';
    case 'surge':
      if (tier === 5) return 'Take 3 extra moves this turn.';
      if (tier >= 3) return 'Take 2 extra moves this turn.';
      return 'Take 1 extra move this turn.';
    case 'aegis':
      if (tier === 5) return 'Raise a permanent shield. Attackers die.';
      if (tier === 3) return 'Raise a shield. The next attacker is stunned.';
      return 'Raise a shield. It blocks the next attack on you.';
    case 'decoy':
      if (tier === 5) return 'Mark an enemy. Its team will keep attacking it.';
      if (tier === 4)
        return 'Mark an enemy for 3 turns. Whoever captures it freezes.';
      if (tier >= 2) return 'Mark an enemy for 2 turns. Its team will attack it.';
      return 'Mark an enemy for 1 turn. Its team will attack it.';
    case 'detonate':
      if (tier >= 4) return 'Destroy every enemy within 2 squares of Rookie.';
      if (tier === 3) return 'Destroy every enemy next to Rookie.';
      if (tier === 2) return 'Destroy pawns, knights and bishops next to Rookie.';
      return 'Destroy pawns next to Rookie.';
    case 'yank':
      if (tier >= 4)
        return 'Drag any enemy you can see next to Rookie. It stays frozen 2 turns.';
      if (tier === 3)
        return 'Drag any enemy you can see next to Rookie, frozen 1 turn.';
      if (tier === 2)
        return 'Drag a pawn, knight or bishop you can see next to Rookie, frozen 1 turn.';
      return 'Drag a pawn you can see next to Rookie, frozen 1 turn.';
    case 'phalanx':
      if (tier === 5) return 'Summon 4 pawn allies around Rookie.';
      if (tier === 4) return 'Summon 3 pawn allies around Rookie.';
      if (tier >= 2) return 'Summon 2 pawn allies around Rookie.';
      return 'Summon a pawn ally in front of Rookie.';
    case 'smoke':
      if (tier === 5) return 'A 5×5 cloud hides Rookie for 4 enemy turns.';
      if (tier === 4) return 'A 5×5 cloud hides Rookie for 3 enemy turns.';
      if (tier === 3) return 'A 3×3 cloud hides Rookie for 3 enemy turns.';
      if (tier === 2) return 'A 3×3 cloud hides Rookie for 2 enemy turns.';
      return 'A 3×3 cloud hides Rookie for 1 enemy turn.';
    case 'boulder':
      if (tier === 5)
        return 'Drop a rock within 3 squares — even onto an enemy, crushing it. Blocks everyone.';
      if (tier === 4)
        return 'Drop a rock within 3 squares — even onto a pawn, crushing it. Blocks everyone.';
      if (tier >= 3) return 'Drop a rock on an empty square within 3. Blocks everyone.';
      return 'Drop a rock on an empty square within 2. Blocks everyone.';
  }
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
    case 'become-king':
      if (tier === 5) return 'King for rest of level.';
      if (tier === 4) return 'King for 3 turns. 2/level.';
      if (tier === 3) return 'King for 2 turns. 2/level.';
      if (tier === 2) return 'King for 2 turns. 1/level.';
      return 'King for 1 turn. 1/level.';
    case 'freeze-ray':
      if (tier === 5) return 'Permanent freeze. 1/level.';
      if (tier === 4) return 'Freeze 3 turns. 2/level.';
      if (tier === 3) return 'Freeze 2 turns. 2/level.';
      if (tier === 2) return 'Freeze 2 turns. 1/level.';
      return 'Freeze 1 turn. 1/level.';
    case 'poison-dart':
      if (tier === 5) return 'Poison: dies next turn. 2/level.';
      if (tier === 4) return 'Poison: dies in 2 turns. 3/level.';
      if (tier === 3) return 'Poison: dies in 2 turns. 2/level.';
      if (tier === 2) return 'Poison: dies in 3 turns. 2/level.';
      return 'Poison: dies in 3 turns. 1/level.';
    case 'rabies-dart':
      if (tier === 5) return 'Rabid 5 turns. 2/level.';
      if (tier === 4) return 'Rabid 3 turns. 2/level.';
      if (tier === 3) return 'Rabid 2 turns. 2/level.';
      if (tier === 2) return 'Rabid 2 turns. 1/level.';
      return 'Rabid 1 turn. 1/level.';
    case 'convert':
      if (tier === 5) return 'Flip any non-king. 2/level.';
      if (tier === 4) return 'Flip pawn/minor/major. 2/level.';
      if (tier === 3) return 'Flip rook/queen. 2/level.';
      if (tier === 2) return 'Flip knight/bishop. 1/level.';
      return 'Flip an enemy pawn. 1/level.';
    case 'drones':
      if (tier === 5) return '6 drones (3 front + sides + back). 2/level.';
      if (tier === 4) return '4 drones (front, sides, back). 2/level.';
      if (tier === 3) return '3 drones (front + sides). 2/level.';
      if (tier === 2) return '2 drones (front, left). 1/level.';
      return '1 drone (front). 1/level.';
    case 'squad':
      if (tier === 5) return 'Passive: 7 allies / level.';
      if (tier === 4) return 'Passive: 5 allies / level.';
      if (tier === 3) return 'Passive: 4 allies / level.';
      if (tier === 2) return 'Passive: 3 allies / level.';
      return 'Passive: 1 ally / level.';
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
    case 'decoy':
      if (tier === 5) return 'Mark stays until captured. 1/level.';
      if (tier === 4) return 'Mark 3 turns. Capturers freeze. 2/level.';
      if (tier === 3) return 'Mark for 2 turns. 2/level.';
      if (tier === 2) return 'Mark for 2 turns. 1/level.';
      return 'Mark an enemy for 1 turn. 1/level.';
    case 'detonate':
      if (tier >= 4) return 'Blast radius 2. 2/level.';
      if (tier === 3) return 'Blast all adjacent. 2/level.';
      if (tier === 2) return 'Blast adjacent P/N/B. 1/level.';
      return 'Blast adjacent pawns. 1/level.';
    case 'yank':
      if (tier >= 4) return 'Pull any enemy in. Frozen 2 turns. 2/level.';
      if (tier === 3) return 'Pull any enemy in. 2/level.';
      if (tier === 2) return 'Pull a P/N/B in. 1/level.';
      return 'Pull a pawn in. 1/level.';
    case 'phalanx':
      if (tier === 5) return '4 pawn allies. 2/level.';
      if (tier === 4) return '3 pawn allies. 2/level.';
      if (tier === 3) return '2 pawn allies. 2/level.';
      if (tier === 2) return '2 pawn allies. 1/level.';
      return '1 pawn ally. 1/level.';
    case 'smoke':
      if (tier === 5) return '5×5 cloud, 4 turns. 3/level.';
      if (tier === 4) return '5×5 cloud, 3 turns. 2/level.';
      if (tier === 3) return '3×3 cloud, 3 turns. 2/level.';
      if (tier === 2) return '3×3 cloud, 2 turns. 1/level.';
      return '3×3 cloud, 1 turn. 1/level.';
    case 'boulder':
      if (tier === 5) return 'Range 3, crushes enemies. 4 rocks/level.';
      if (tier === 4) return 'Range 3, crushes pawns. 3 rocks/level.';
      if (tier === 3) return 'Range 3. 3 rocks/level.';
      if (tier === 2) return 'Range 2. 2 rocks/level.';
      return 'Range 2. 2 rocks/level.';
  }
}

export interface AbilityOfferOption {
  kind: 'new' | 'upgrade';
  id: AbilityId;
  tier: AbilityTier;
  description: AbilityBlurb;
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
 *  - All returned options are distinct.
 */
export function rollOffer(state: BoardState, rng: () => number): AbilityOffer {
  const owned = new Map(state.abilities.map((a) => [a.id, a]));
  const ownedCount = owned.size;
  const atCap = ownedCount >= MAX_OWNED_ABILITIES;

  // Per-run allowlist (e.g. abilities-v2 test run). When set, restrict both
  // new offers AND upgrade offers to listed ids.
  const runAllowed = state.runId
    ? (() => {
        try {
          const r = getRunById(state.runId);
          return r.allowedAbilities ? new Set(r.allowedAbilities as string[]) : null;
        } catch {
          return null;
        }
      })()
    : null;

  // A run with an EXPLICIT allowlist may name experimental abilities (that's
  // how they get human-playtested, e.g. /run?run=abilities-x). Runs without an
  // allowlist — every normal run — only ever offer SHIPPED abilities.
  const offerPool = runAllowed ? ALL_ABILITY_IDS : SHIPPED_ABILITY_IDS;
  const newPool: AbilityOfferOption[] = offerPool.filter(
    (id) => !owned.has(id) && (!runAllowed || runAllowed.has(id)),
  ).map((id) => ({
    kind: 'new',
    id,
    tier: 1,
    description: blurbDetailForTier(id, 1),
  }));

  const upgradePool: AbilityOfferOption[] = [...owned.values()]
    .filter((a) => a.tier < 5 && (!runAllowed || runAllowed.has(a.id)))
    .map((a) => {
      const next = (a.tier + 1) as AbilityTier;
      return {
        kind: 'upgrade',
        id: a.id,
        tier: next,
        description: blurbDetailForTier(a.id, next),
      };
    });

  const pickOne = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(rng() * arr.length)];
  };
  const without = <T,>(arr: T[], match: (x: T) => boolean): T[] =>
    arr.filter((x) => !match(x));

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

  if (upgradePool.length > 0 && newPool.length > 0) {
    const up = pickOne(upgradePool);
    const nw = pickOne(newPool);
    if (up) offer.push(up);
    if (nw) offer.push(nw);
    return offer;
  }

  const fallback = newPool.length > 0 ? newPool : upgradePool;
  const a = pickOne(fallback);
  if (a) offer.push(a);
  const b = pickOne(without(fallback, (x) => x.id === a?.id));
  if (b) offer.push(b);
  return offer;
}

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
  // Squad is a passive — its payoff lands at the START of the next level
  // (seed.ts reads the owned tier and spawns the roster). Picking or upgrading
  // mid-level does NOT spawn a fresh squad on top of the current board; that
  // gave a confusing burst of pieces and let the player double-dip by picking
  // squad after killing existing allies.
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
// Legal-move computation (for movement-style abilities only).
// ---------------------------------------------------------------------------

// (inBounds/isHazard/enemyAt removed with leap/phase-step.)

export function abilityLegalMoves(
  state: BoardState,
  abilityId: AbilityId,
): Coord[] {
  // v2: no movement abilities remain; convert/drones use other UI paths.
  // Boulder is the one square-targeting ability: highlight its legal drops.
  if (abilityId === 'boulder') {
    const owned = state.abilities.find((a) => a.id === 'boulder');
    return owned ? boulderTargets(state, owned.tier) : [];
  }
  return [];
}

/**
 * Convert targeting: which enemy piece types are eligible at this tier.
 * King is never targetable.
 */
export function convertEligibleTypes(tier: AbilityTier): Set<'pawn' | 'knight' | 'bishop' | 'queen'> {
  if (tier === 1) return new Set(['pawn']);
  if (tier === 2) return new Set(['pawn', 'knight', 'bishop']);
  return new Set(['pawn', 'knight', 'bishop', 'queen']);
}

/** Enemy squares the active Convert ability can target. */
export function convertTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'convert');
  if (!owned) return [];
  const elig = convertEligibleTypes(owned.tier);
  return state.pieces
    .filter((p) => elig.has(p.type as 'pawn' | 'knight' | 'bishop' | 'queen'))
    .map((p) => ({ file: p.file, rank: p.rank }));
}

// ---------------------------------------------------------------------------
// Experimental abilities (bot-tested, not player-offered): Detonate, Grapple
// (yank), Phalanx. See EXPERIMENTAL_ABILITY_IDS.
// ---------------------------------------------------------------------------

/** Blast radius (Chebyshev) for Detonate at a tier. */
export function detonateRadius(tier: AbilityTier): number {
  return tier >= 4 ? 2 : 1;
}

/** Which enemy types Detonate destroys at a tier. */
export function detonateEligibleTypes(tier: AbilityTier): Set<PieceType> {
  if (tier === 1) return new Set<PieceType>(['pawn']);
  if (tier === 2) return new Set<PieceType>(['pawn', 'knight', 'bishop']);
  return new Set<PieceType>(['pawn', 'knight', 'bishop', 'queen']);
}

/** Enemies Detonate would destroy right now (bot candidate check). */
export function detonateVictims(state: BoardState, tier: AbilityTier): EnemyPiece[] {
  const r = detonateRadius(tier);
  const elig = detonateEligibleTypes(tier);
  return state.pieces.filter(
    (p) =>
      elig.has(p.type) &&
      Math.max(Math.abs(p.file - state.rookie.file), Math.abs(p.rank - state.rookie.rank)) <= r,
  );
}

function applyDetonate(state: BoardState, tier: AbilityTier): BoardState {
  const victims = detonateVictims(state, tier);
  if (victims.length === 0) return state;
  let statusOverlay: Partial<BoardState> = {};
  let acc: BoardState = state;
  for (const v of victims) {
    const overlay = clearStatusOnSquare(acc, toSquare(v));
    statusOverlay = { ...statusOverlay, ...overlay };
    acc = { ...acc, ...overlay };
  }
  const victimSet = new Set(victims);
  let tempo = state.tempo;
  for (const v of victims) {
    tempo = Math.min(TEMPO_MAX, tempo + (TEMPO_REWARD[v.type] ?? 0));
  }
  return {
    ...state,
    ...statusOverlay,
    pieces: state.pieces.filter((p) => !victimSet.has(p)),
    captures: [...state.captures, ...victims.map((v) => v.type)],
    tempo,
    abilities: decrementUse(state.abilities, 'detonate'),
    cancellableActivation: undefined,
    activeAbility: null,
  };
}

/** Which enemy types Grapple can pull at a tier. */
export function yankEligibleTypes(tier: AbilityTier): Set<PieceType> {
  if (tier === 1) return new Set<PieceType>(['pawn']);
  if (tier === 2) return new Set<PieceType>(['pawn', 'knight', 'bishop']);
  return new Set<PieceType>(['pawn', 'knight', 'bishop', 'queen']);
}

/**
 * Empty square adjacent to Rookie where a yanked enemy lands — the free
 * adjacent square closest to the enemy's current position (deterministic).
 * Null when Rookie is fully boxed in.
 */
export function yankDestination(state: BoardState, from: Coord): Coord | null {
  let best: Coord | null = null;
  let bestDist = Infinity;
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;
      const file = state.rookie.file + df;
      const rank = state.rookie.rank + dr;
      if (file < 1 || file > 8 || rank < 1 || rank > 8) continue;
      if (state.pieces.some((p) => p.file === file && p.rank === rank)) continue;
      if (state.allies.some((a) => a.file === file && a.rank === rank)) continue;
      if (state.hazards.some((h) => h.file === file && h.rank === rank)) continue;
      if (boulderAt(state, { file, rank })) continue;
      const dist = Math.max(Math.abs(file - from.file), Math.abs(rank - from.rank));
      if (dist < bestDist) {
        bestDist = dist;
        best = { file, rank };
      }
    }
  }
  return best;
}

/** How many pawn allies Phalanx summons at a tier. */
export function phalanxCount(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier <= 3) return 2;
  if (tier === 4) return 3;
  return 4;
}

/**
 * Squares Phalanx would fill right now — front first, then flanks, then rear,
 * empty squares only. Exported so bots can check "would this do anything."
 */
export function phalanxSpawnSquares(state: BoardState, tier: AbilityTier): Coord[] {
  const want = phalanxCount(tier);
  const offsets: Array<[number, number]> = [
    [0, 1], [-1, 1], [1, 1], [-1, 0], [1, 0], [0, -1],
  ];
  const out: Coord[] = [];
  for (const [df, dr] of offsets) {
    if (out.length >= want) break;
    const file = state.rookie.file + df;
    const rank = state.rookie.rank + dr;
    if (file < 1 || file > 8 || rank < 1 || rank > 8) continue;
    if (state.pieces.some((p) => p.file === file && p.rank === rank)) continue;
    if (state.allies.some((a) => a.file === file && a.rank === rank)) continue;
    if (state.hazards.some((h) => h.file === file && h.rank === rank)) continue;
    if (boulderAt(state, { file, rank })) continue;
    out.push({ file, rank });
  }
  return out;
}

function applyPhalanx(state: BoardState, tier: AbilityTier): BoardState {
  const squares = phalanxSpawnSquares(state, tier);
  if (squares.length === 0) return state;
  const spawned: AllyPiece[] = squares.map((c, i) => ({
    id: Date.now() * 1000 + i,
    type: 'pawn' as PieceType,
    file: c.file,
    rank: c.rank,
    source: 'squad' as const,
  }));
  return {
    ...state,
    allies: [...state.allies, ...spawned],
    abilities: decrementUse(state.abilities, 'phalanx'),
    cancellableActivation: undefined,
    activeAbility: null,
  };
}

// ---------------------------------------------------------------------------
// Experimental BOARD-EDITING abilities: Smoke, Boulder. These add terrain
// to BoardState (`smoke`, `boulders`) instead of acting on pieces. Enemy
// movement treats both as no-go squares (`enemyNoGo` in movement.ts);
// boulders additionally block Rookie, allies and drones.
// ---------------------------------------------------------------------------

/** Chebyshev radius of the Smoke cloud: T1-T3 = 1 (3×3), T4/T5 = 2 (5×5). */
export function smokeRadius(tier: AbilityTier): number {
  if (tier <= 3) return 1;
  return 2;
}

/** Enemy turns a Smoke cloud lasts: T1 = 1, T2 = 2, T3/T4 = 3, T5 = 4. */
export function smokeTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 2) return 2;
  if (tier <= 4) return 3;
  return 4;
}

/** Squares a Smoke cast would cover right now (centered on Rookie, clipped to the board). */
export function smokeSquares(state: BoardState, tier: AbilityTier): Coord[] {
  const r = smokeRadius(tier);
  const out: Coord[] = [];
  for (let df = -r; df <= r; df++) {
    for (let dr = -r; dr <= r; dr++) {
      const file = state.rookie.file + df;
      const rank = state.rookie.rank + dr;
      if (file < 1 || file > 8 || rank < 1 || rank > 8) continue;
      out.push({ file, rank });
    }
  }
  return out;
}

function applySmoke(state: BoardState, tier: AbilityTier): BoardState {
  const turnsLeft = smokeTurns(tier);
  const fresh = smokeSquares(state, tier).map((c) => ({ ...c, turnsLeft }));
  // Merge with any existing cloud — a square keeps the LONGER remaining life.
  const merged = [...(state.smoke ?? [])];
  for (const c of fresh) {
    const i = merged.findIndex((m) => m.file === c.file && m.rank === c.rank);
    if (i < 0) merged.push(c);
    else if (merged[i].turnsLeft < c.turnsLeft) merged[i] = c;
  }
  return {
    ...state,
    smoke: merged,
    abilities: decrementUse(state.abilities, 'smoke'),
    cancellableActivation: undefined,
    activeAbility: null,
  };
}

/** Chebyshev drop range for Boulder: T1/T2 = 2, T3-T5 = 3. */
export function boulderRange(tier: AbilityTier): number {
  if (tier <= 2) return 2;
  return 3;
}

/**
 * Whether a Boulder at this tier may be dropped ON an enemy of this type,
 * crushing it. T4 crushes pawns only; T5 crushes anything.
 */
export function boulderCanCrush(tier: AbilityTier, pieceType?: PieceType): boolean {
  if (tier >= 5) return true;
  if (tier === 4) return pieceType === undefined || pieceType === 'pawn';
  return false;
}

/**
 * Legal Boulder targets right now: squares within range of Rookie that are
 * empty (no enemy, ally, hazard, existing boulder, not Rookie's own square).
 * At T4 pawn-occupied and at T5 any enemy-occupied squares in range are ALSO
 * legal (crush).
 */
export function boulderTargets(state: BoardState, tier: AbilityTier): Coord[] {
  const r = boulderRange(tier);
  const out: Coord[] = [];
  for (let df = -r; df <= r; df++) {
    for (let dr = -r; dr <= r; dr++) {
      if (df === 0 && dr === 0) continue;
      const file = state.rookie.file + df;
      const rank = state.rookie.rank + dr;
      if (file < 1 || file > 8 || rank < 1 || rank > 8) continue;
      const c = { file, rank };
      if (boulderAt(state, c)) continue;
      if (state.hazards.some((h) => h.file === file && h.rank === rank)) continue;
      if (state.allies.some((a) => a.file === file && a.rank === rank)) continue;
      const enemy = state.pieces.find((p) => p.file === file && p.rank === rank);
      if (enemy && !boulderCanCrush(tier, enemy.type)) continue;
      out.push(c);
    }
  }
  return out;
}

function applyBoulder(state: BoardState, tier: AbilityTier, target: Coord): BoardState {
  if (!boulderTargets(state, tier).some((c) => c.file === target.file && c.rank === target.rank)) {
    return state;
  }
  const crushed = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  // Crushing an enemy banks it as a Rookie capture (tempo + share), like Detonate.
  const cleared = crushed ? clearStatusOnSquare(state, toSquare(target)) : {};
  return {
    ...state,
    ...cleared,
    pieces: crushed ? state.pieces.filter((p) => p !== crushed) : state.pieces,
    captures: crushed ? [...state.captures, crushed.type] : state.captures,
    tempo: crushed
      ? Math.min(TEMPO_MAX, state.tempo + (TEMPO_REWARD[crushed.type] ?? 0))
      : state.tempo,
    boulders: [...(state.boulders ?? []), { file: target.file, rank: target.rank }],
    abilities: decrementUse(state.abilities, 'boulder'),
    cancellableActivation: undefined,
    activeAbility: null,
  };
}

/** Directions each Drones tier launches in. dx/dy from Rookie's perspective. */
function droneDirs(tier: AbilityTier): Array<[number, number]> {
  // dr = +1 means "toward rank 8" (forward).
  const FRONT: [number, number] = [0, 1];
  const LEFT: [number, number] = [-1, 0];
  const RIGHT: [number, number] = [1, 0];
  const BACK: [number, number] = [0, -1];
  if (tier === 1) return [FRONT];
  if (tier === 2) return [FRONT, LEFT];
  if (tier === 3) return [FRONT, LEFT, RIGHT];
  if (tier === 4) return [FRONT, LEFT, RIGHT, BACK];
  return [FRONT, FRONT, FRONT, LEFT, RIGHT, BACK];
}

// firstEnemyAlongRay inlined in applyDrones for clarity.

// ---------------------------------------------------------------------------
// Activation.
// ---------------------------------------------------------------------------

export function applyAbilityActivate(
  state: BoardState,
  abilityId: AbilityId,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (state.pendingOffer) return state;

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

  if (def.activation === 'transform') {
    return applyTransform(state, abilityId);
  }
  if (def.activation === 'passive') return state;
  if (abilityId === 'surge') {
    return applySurge(state);
  }
  if (abilityId === 'aegis') {
    return applyAegis(state);
  }
  if (abilityId === 'drones') {
    return applyDrones(state);
  }
  if (abilityId === 'detonate') {
    return applyDetonate(state, owned.tier);
  }
  if (abilityId === 'phalanx') {
    return applyPhalanx(state, owned.tier);
  }
  if (abilityId === 'smoke') {
    return applySmoke(state, owned.tier);
  }

  // All targeted abilities (freeze ray, poison dart, rabies dart, decoy)
  // pick an enemy as their second tap.
  let step: 'pick-square' | 'pick-enemy' = 'pick-square';
  if (def.activation === 'targeted') step = 'pick-enemy';
  if (abilityId === 'boulder') step = 'pick-square'; // targets a square, not a piece
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

function applyAegis(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return state;
  if (state.shieldUp) return state;
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

function surgeBonusForTier(tier: AbilityTier): number {
  if (tier <= 2) return 1;
  if (tier <= 4) return 2;
  return 3;
}

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

  let pieces = state.pieces;
  const captures = [...state.captures];
  const killedSquares: string[] = [];

  const captured = pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (captured) {
    captures.push(captured.type);
    killedSquares.push(toSquare(captured));
  }
  pieces = pieces.filter(
    (p) => !(p.file === target.file && p.rank === target.rank),
  );

  // Strip status markers from any piece that died this resolve.
  let statusOverlay: ReturnType<typeof clearStatusOnSquare> | null = null;
  let working: BoardState = state;
  for (const sq of killedSquares) {
    statusOverlay = clearStatusOnSquare(working, sq);
    working = { ...working, ...statusOverlay };
  }

  const nextMoveCount = state.moveCount + 1;
  const abilities = decrementUse(state.abilities, abilityId);

  const hasBonus = state.bonusMovesLeft > 0;
  const nextTurn: BoardState['turn'] = hasBonus ? 'rookie' : 'enemy';
  const nextBonus = hasBonus ? state.bonusMovesLeft - 1 : state.bonusMovesLeft;

  // No movement-style abilities remain in v2 — fx unchanged.
  const fxKind: null = null;

  const afterMove: BoardState = {
    ...state,
    ...(statusOverlay ?? {}),
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

export function applyAbilityTargeted(
  state: BoardState,
  abilityId: AbilityId,
  target: Coord,
): BoardState {
  if (!state.activeAbility || state.activeAbility.id !== abilityId) return state;
  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;

  if (abilityId === 'decoy') {
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const turns = decoyTurns(owned.tier);
    return {
      ...state,
      decoyTarget: toSquare(target),
      decoyTurnsLeft: turns,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
    };
  }

  if (abilityId === 'freeze-ray') {
    if (!isVisibleEnemy(state, target)) return state;
    const sq = toSquare(target);
    const turns = freezeTurns(owned.tier);
    const frozenSquares = state.frozenSquares.includes(sq)
      ? state.frozenSquares
      : [...state.frozenSquares, sq];
    const frozenTurnsLeft = { ...state.frozenTurnsLeft, [sq]: turns };
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

  if (abilityId === 'poison-dart') {
    if (!isVisibleEnemy(state, target)) return state;
    const sq = toSquare(target);
    const turns = poisonTurns(owned.tier);
    const poisonedSquares = state.poisonedSquares.includes(sq)
      ? state.poisonedSquares
      : [...state.poisonedSquares, sq];
    const poisonedTurnsLeft = { ...state.poisonedTurnsLeft, [sq]: turns };
    return {
      ...state,
      poisonedSquares,
      poisonedTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'poison-dart',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'convert') {
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const elig = convertEligibleTypes(owned.tier);
    if (!elig.has(hit.type as 'pawn' | 'knight' | 'bishop' | 'queen')) return state;
    const sq = toSquare(target);
    const cleared = clearStatusOnSquare(state, sq);
    return {
      ...state,
      ...cleared,
      pieces: state.pieces.filter((p) => p !== hit),
      allies: [
        ...state.allies,
        { id: Date.now() + Math.random(), type: hit.type, file: hit.file, rank: hit.rank, source: 'convert' },
      ],
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'convert',
        from: toSquare(state.rookie),
        to: sq,
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'yank') {
    // Grapple: drag a visible, tier-eligible enemy onto an empty square
    // adjacent to Rookie and freeze it briefly (so it can't immediately bite).
    if (!isVisibleEnemy(state, target)) return state;
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    if (!yankEligibleTypes(owned.tier).has(hit.type)) return state;
    const dest = yankDestination(state, target);
    if (!dest) return state; // no free adjacent square — no-op
    const oldSq = toSquare(target);
    const cleared = clearStatusOnSquare(state, oldSq);
    const destSq = toSquare(dest);
    const freezeFor = owned.tier >= 4 ? 2 : 1;
    const base = { ...state, ...cleared };
    return {
      ...base,
      pieces: state.pieces.map((p) =>
        p === hit ? { ...p, file: dest.file, rank: dest.rank } : p,
      ),
      frozenSquares: base.frozenSquares.includes(destSq)
        ? base.frozenSquares
        : [...base.frozenSquares, destSq],
      frozenTurnsLeft: { ...base.frozenTurnsLeft, [destSq]: freezeFor },
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
    };
  }

  if (abilityId === 'boulder') {
    return applyBoulder(state, owned.tier, target);
  }

  if (abilityId === 'rabies-dart') {
    if (!isVisibleEnemy(state, target)) return state;
    const sq = toSquare(target);
    const turns = rabiesTurns(owned.tier);
    const rabidSquares = state.rabidSquares.includes(sq)
      ? state.rabidSquares
      : [...state.rabidSquares, sq];
    const rabidTurnsLeft = { ...state.rabidTurnsLeft, [sq]: turns };
    return {
      ...state,
      rabidSquares,
      rabidTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'rabies-dart',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  return state;
}

/**
 * Dart-style abilities (freeze ray, poison dart, rabies dart) can target ANY
 * enemy piece on the board — no line-of-sight restriction.
 */
export function visibleEnemySquares(state: BoardState): Coord[] {
  return state.pieces.map((p) => ({ file: p.file, rank: p.rank }));
}

function isVisibleEnemy(state: BoardState, target: Coord): boolean {
  return state.pieces.some(
    (p) => p.file === target.file && p.rank === target.rank,
  );
}

function freezeTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 4) return 3;
  if (tier === 5) return 99;
  return 2;
}

function poisonTurns(tier: AbilityTier): number {
  if (tier === 1 || tier === 2) return 3;
  if (tier === 3 || tier === 4) return 2;
  return 1;
}

function rabiesTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 2 || tier === 3) return 2;
  if (tier === 4) return 3;
  return 5;
}

function decoyTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 2 || tier === 3) return 2;
  if (tier === 4) return 3;
  return 99;
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
    pieces = pieces.filter((p) => p !== attacker);
    captures = [...captures, attacker.type];
  }

  let frozenSquares = state.frozenSquares;
  let frozenTurnsLeft = state.frozenTurnsLeft;
  if (owned.tier === 3) {
    const sq = toSquare({ file: attacker.file, rank: attacker.rank });
    if (!frozenSquares.includes(sq)) frozenSquares = [...frozenSquares, sq];
    frozenTurnsLeft = { ...frozenTurnsLeft, [sq]: 2 };
  }

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
// Status-marker helpers — square-keyed maps for poison, rabies, freeze.
// Used when pieces move (markers follow) and when pieces die (markers clear).
// ---------------------------------------------------------------------------

export function clearStatusOnSquare(
  state: BoardState,
  sq: string,
): Pick<
  BoardState,
  | 'poisonedSquares'
  | 'poisonedTurnsLeft'
  | 'rabidSquares'
  | 'rabidTurnsLeft'
  | 'frozenSquares'
  | 'frozenTurnsLeft'
> {
  const poisonedSquares = state.poisonedSquares.includes(sq)
    ? state.poisonedSquares.filter((s) => s !== sq)
    : state.poisonedSquares;
  const poisonedTurnsLeft = state.poisonedSquares.includes(sq)
    ? Object.fromEntries(
        Object.entries(state.poisonedTurnsLeft).filter(([k]) => k !== sq),
      )
    : state.poisonedTurnsLeft;
  const rabidSquares = state.rabidSquares.includes(sq)
    ? state.rabidSquares.filter((s) => s !== sq)
    : state.rabidSquares;
  const rabidTurnsLeft = state.rabidSquares.includes(sq)
    ? Object.fromEntries(
        Object.entries(state.rabidTurnsLeft).filter(([k]) => k !== sq),
      )
    : state.rabidTurnsLeft;
  const frozenSquares = state.frozenSquares.includes(sq)
    ? state.frozenSquares.filter((s) => s !== sq)
    : state.frozenSquares;
  const frozenTurnsLeft = state.frozenSquares.includes(sq)
    ? Object.fromEntries(
        Object.entries(state.frozenTurnsLeft).filter(([k]) => k !== sq),
      )
    : state.frozenTurnsLeft;
  return {
    poisonedSquares,
    poisonedTurnsLeft,
    rabidSquares,
    rabidTurnsLeft,
    frozenSquares,
    frozenTurnsLeft,
  };
}

// ---------------------------------------------------------------------------
// Drones — spawns N mini-Rookies that wander the board randomly. Each drone
// vanishes when it lands on an enemy (= capture). UI-driven: stepDroneTurn
// advances every live drone one square per tick.
// ---------------------------------------------------------------------------

/** Hard cap so a drone never wanders forever on a sparse board. */
export const DRONE_MAX_STEPS = 8;

/** Drones move like rooks — N/S/E/W only. */
const DRONE_4_DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
];

function droneCountForTier(tier: AbilityTier): number {
  // Scale drones with tier. T1=1 → T5=6.
  switch (tier) {
    case 1: return 1;
    case 2: return 2;
    case 3: return 3;
    case 4: return 4;
    case 5: return 6;
    default: return 1;
  }
}

function applyDrones(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'drones');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const count = droneCountForTier(owned.tier);
  const now = Date.now();
  const drones: Drone[] = Array.from({ length: count }, (_, i) => ({
    id: now + i,
    file: state.rookie.file,
    rank: state.rookie.rank,
    alive: true,
    steps: 0,
  }));
  return {
    ...state,
    drones,
    turn: 'drones',
    abilities: decrementUse(state.abilities, 'drones'),
    activeAbility: null,
    cancellableActivation: undefined,
  };
}

/**
 * Advance every live drone one random step. Drones that land on an enemy
 * capture it and die. Drones that hit the step cap die unfed. When all
 * drones are dead, the phase ends and turn flips to 'enemy'.
 */
export function stepDroneTurn(state: BoardState): BoardState {
  if (state.turn !== 'drones' || state.status !== 'playing') return state;
  const liveCount = state.drones.filter((d) => d.alive).length;
  if (liveCount === 0) {
    // Drones are a free action — return control to Rookie when the swarm
    // finishes (Tyler: activating drones must not cost a turn / let black
    // move). If a real Rookie move follows it'll hand off to allies/enemy
    // normally.
    return {
      ...state,
      drones: [],
      turn: 'rookie',
    };
  }
  let pieces = state.pieces;
  let captures = state.captures;
  let tempo = state.tempo;
  let statusAccum: BoardState = state;
  const nextDrones = state.drones.map((d) => {
    if (!d.alive) return d;
    if (d.steps >= DRONE_MAX_STEPS) return { ...d, alive: false };
    // Pick a direction biased toward enemies: scan all 4 rays from the drone,
    // find which ones contain an enemy, and prefer the ray with the CLOSEST
    // enemy. If no ray has an enemy, fall back to a uniformly random valid
    // direction so the drone keeps moving instead of stalling.
    // RNG is seeded per-drone-tick so playtest stays deterministic.
    const validDirs = DRONE_4_DIRS.filter(
      ([df, dr]) =>
        d.file + df >= 1 && d.file + df <= 8 && d.rank + dr >= 1 && d.rank + dr <= 8,
    );
    if (validDirs.length === 0) return { ...d, alive: false };
    const rng = mulberry32(
      (state.level * 7919 + state.moveCount * 31 + Number(d.id) * 13 + d.steps * 5) >>> 0,
    );
    // For each valid direction, find distance to nearest enemy along the ray
    // (Infinity if none). Smallest distance wins; ties broken by RNG.
    const rayScans = validDirs.map(([df, dr]) => {
      let f = d.file + df;
      let r = d.rank + dr;
      let dist = 1;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        if (pieces.some((p) => p.file === f && p.rank === r)) {
          return { dir: [df, dr] as [number, number], dist };
        }
        f += df;
        r += dr;
        dist += 1;
      }
      return { dir: [df, dr] as [number, number], dist: Infinity };
    });
    const withEnemy = rayScans.filter((s) => s.dist !== Infinity);
    let chosen: [number, number];
    if (withEnemy.length > 0) {
      const minDist = Math.min(...withEnemy.map((s) => s.dist));
      const closest = withEnemy.filter((s) => s.dist === minDist);
      chosen = closest[Math.floor(rng() * closest.length)].dir;
    } else {
      chosen = validDirs[Math.floor(rng() * validDirs.length)];
    }
    let nf = d.file;
    let nr = d.rank;
    let captured: EnemyPiece | null = null;
    let f = d.file + chosen[0];
    let r = d.rank + chosen[1];
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      if (boulderAt(state, { file: f, rank: r })) break; // drones can't pass a boulder
      const enemy = pieces.find((p) => p.file === f && p.rank === r);
      if (enemy) {
        captured = enemy;
        nf = f;
        nr = r;
        break;
      }
      nf = f;
      nr = r;
      f += chosen[0];
      r += chosen[1];
    }
    if (captured) {
      const sq = toSquare(captured);
      const overlay = clearStatusOnSquare(statusAccum, sq);
      statusAccum = { ...statusAccum, ...overlay };
      pieces = pieces.filter((p) => p !== captured);
      captures = [...captures, captured.type];
      tempo = Math.min(TEMPO_MAX, tempo + (TEMPO_REWARD[captured.type] ?? 0));
      return { ...d, file: nf, rank: nr, alive: false, steps: d.steps + 1 };
    }
    return { ...d, file: nf, rank: nr, steps: d.steps + 1 };
  });
  return {
    ...state,
    ...statusAccum,
    drones: nextDrones,
    pieces,
    captures,
    tempo,
  };
}

// ---------------------------------------------------------------------------
// Squad — passive. Spawns rainbow allies at level start. Scales with the
// `level` field on BoardState (1..N).
// ---------------------------------------------------------------------------

/**
 * Compute the squad roster for a given level / rookie start square. Doesn't
 * collide with enemies — squares that would overlap are simply skipped.
 */
/**
 * Squad roster scales with the ABILITY's tier (T1 → T5), not the run level.
 * Squad is now an offerable passive: Rookie owns it after picking it from a
 * tempo offer; upgrading promotes her roster.
 */
export function squadSpawnFor(
  tier: AbilityTier,
  rookie: Coord,
  pieces: EnemyPiece[],
  hazards: Coord[],
): AllyPiece[] {
  const out: AllyPiece[] = [];
  const taken = (file: number, rank: number): boolean => {
    if (file < 1 || file > 8 || rank < 1 || rank > 8) return true;
    if (rookie.file === file && rookie.rank === rank) return true;
    if (pieces.some((p) => p.file === file && p.rank === rank)) return true;
    if (hazards.some((h) => h.file === file && h.rank === rank)) return true;
    if (out.some((a) => a.file === file && a.rank === rank)) return true;
    return false;
  };
  // Try a list of preferred files in order; spawn at the first that's free.
  // Lets us mirror to the other side when Rookie is on an edge file so squad
  // size stays consistent at the a/h-files.
  const tryAdd = (type: PieceType, files: number[], rank: number): void => {
    for (const f of files) {
      if (!taken(f, rank)) {
        out.push({ id: Date.now() * 1000 + out.length, type, file: f, rank, source: 'squad' });
        return;
      }
    }
  };
  // Everything spawns in front of Rookie (rank+1 or rank+2) so her east/west
  // axes stay open and she always has a legal first move.
  const front = rookie.rank + 1;
  const front2 = rookie.rank + 2;
  const t = Math.max(1, tier);
  // T1: center pawn in front. Fallback to adjacent files if blocked.
  if (t >= 1) {
    tryAdd('pawn', [rookie.file, rookie.file - 1, rookie.file + 1], front);
  }
  // T2: flanking pawns. Each falls back to the next valid file outward.
  if (t >= 2) {
    tryAdd('pawn', [rookie.file - 1, rookie.file + 2, rookie.file - 2], front);
    tryAdd('pawn', [rookie.file + 1, rookie.file - 2, rookie.file + 2], front);
  }
  // T3: knight, prefers two left of Rookie, mirrors right if off-board.
  if (t >= 3) {
    tryAdd('knight', [rookie.file - 2, rookie.file + 2, rookie.file - 3, rookie.file + 3], front);
  }
  // T4: bishop, mirrors of knight.
  if (t >= 4) {
    tryAdd('bishop', [rookie.file + 2, rookie.file - 2, rookie.file + 3, rookie.file - 3], front);
  }
  // T5: three pawns on rank+2.
  if (t >= 5) {
    tryAdd('pawn', [rookie.file, rookie.file - 1, rookie.file + 1], front2);
    tryAdd('pawn', [rookie.file - 2, rookie.file - 1, rookie.file + 2, rookie.file + 1], front2);
    tryAdd('pawn', [rookie.file + 2, rookie.file + 1, rookie.file - 2, rookie.file - 1], front2);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Ally movement — runs between Rookie's move and the enemy turn.
// Each ally tries to capture, otherwise pushes toward rank 8.
// ---------------------------------------------------------------------------

const ALLY_KNIGHT_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1],
];
const ALLY_BISHOP_DIRS: ReadonlyArray<[number, number]> = [
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];
const ALLY_ROOK_DIRS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
const ALLY_QUEEN_DIRS: ReadonlyArray<[number, number]> = [
  ...ALLY_ROOK_DIRS, ...ALLY_BISHOP_DIRS,
];

function allyOccupied(state: BoardState, file: number, rank: number, self: AllyPiece): boolean {
  if (state.rookie.file === file && state.rookie.rank === rank) return true;
  if (state.allies.some((a) => a !== self && a.file === file && a.rank === rank)) return true;
  return false;
}

function allyInBounds(f: number, r: number): boolean {
  return f >= 1 && f <= 8 && r >= 1 && r <= 8;
}

function allyIsHazard(state: BoardState, f: number, r: number): boolean {
  // Boulders block allies too (smoke does not — allies see through it).
  return (
    state.hazards.some((h) => h.file === f && h.rank === r) ||
    boulderAt(state, { file: f, rank: r })
  );
}

/** Possible (target, capturedEnemy|null) moves for an ally piece. */
function allyMoves(
  state: BoardState,
  ally: AllyPiece,
): Array<{ to: Coord; capture: EnemyPiece | null }> {
  const out: Array<{ to: Coord; capture: EnemyPiece | null }> = [];
  const tryLand = (f: number, r: number): { to: Coord; capture: EnemyPiece | null } | null => {
    if (!allyInBounds(f, r)) return null;
    if (allyIsHazard(state, f, r)) return null;
    if (allyOccupied(state, f, r, ally)) return null;
    const enemy = state.pieces.find((p) => p.file === f && p.rank === r);
    return { to: { file: f, rank: r }, capture: enemy ?? null };
  };
  switch (ally.type) {
    case 'pawn': {
      // Advance forward (toward rank 8) one square if empty.
      const forward = tryLand(ally.file, ally.rank + 1);
      if (forward && !forward.capture) out.push(forward);
      // Diagonal captures.
      for (const df of [-1, 1]) {
        const m = tryLand(ally.file + df, ally.rank + 1);
        if (m && m.capture) out.push(m);
      }
      return out;
    }
    case 'knight': {
      for (const [df, dr] of ALLY_KNIGHT_DELTAS) {
        const m = tryLand(ally.file + df, ally.rank + dr);
        if (m) out.push(m);
      }
      return out;
    }
    case 'bishop':
    case 'queen': {
      const dirs = ally.type === 'queen' ? ALLY_QUEEN_DIRS : ALLY_BISHOP_DIRS;
      for (const [df, dr] of dirs) {
        let f = ally.file + df;
        let r = ally.rank + dr;
        while (allyInBounds(f, r)) {
          if (allyIsHazard(state, f, r)) break;
          if (allyOccupied(state, f, r, ally)) break;
          const enemy = state.pieces.find((p) => p.file === f && p.rank === r);
          out.push({ to: { file: f, rank: r }, capture: enemy ?? null });
          if (enemy) break;
          f += df;
          r += dr;
        }
      }
      return out;
    }
  }
}

/**
 * Heuristic score for an ally choosing a move. Higher is better.
 * - Capture bonus scales with victim value.
 * - Otherwise prefer moves that advance toward rank 8.
 * - Penalty if the resulting square is attacked by any remaining enemy (so the
 *   ally doesn't walk into a free capture).
 */
function allyScoreMove(
  state: BoardState,
  ally: AllyPiece,
  move: { to: Coord; capture: EnemyPiece | null },
): number {
  const VALUE: Record<PieceType, number> = { queen: 9, bishop: 3, knight: 3, pawn: 1 };
  let score = 0;
  if (move.capture) score += 100 + VALUE[move.capture.type] * 10;
  score += move.to.rank * 2; // advance bonus
  // Safety check — count enemies that could capture this square next turn.
  const attacked = squareAttackedByEnemy(state, move.to, ally, move.capture);
  if (attacked) score -= 30;
  return score;
}

/** Cheap "is this square attacked by some enemy?" using direct geometry. */
function squareAttackedByEnemy(
  state: BoardState,
  sq: Coord,
  movingAlly: AllyPiece,
  capturedEnemy: EnemyPiece | null,
): boolean {
  for (const e of state.pieces) {
    if (e === capturedEnemy) continue;
    // Pawn diagonal attacks (enemy moves toward rank 1).
    if (e.type === 'pawn') {
      if (e.rank - 1 === sq.rank && (e.file - 1 === sq.file || e.file + 1 === sq.file)) {
        return true;
      }
      continue;
    }
    if (e.type === 'knight') {
      for (const [df, dr] of ALLY_KNIGHT_DELTAS) {
        if (e.file + df === sq.file && e.rank + dr === sq.rank) return true;
      }
      continue;
    }
    const dirs = e.type === 'queen' ? ALLY_QUEEN_DIRS : ALLY_BISHOP_DIRS;
    if (e.type === 'queen') {
      // queens cover all 8.
    }
    for (const [df, dr] of (e.type === 'bishop' ? ALLY_BISHOP_DIRS : e.type === 'queen' ? ALLY_QUEEN_DIRS : dirs)) {
      let f = e.file + df;
      let r = e.rank + dr;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        // Enemy rays stop before hazards / smoke / boulders.
        if (enemyNoGo(state, { file: f, rank: r })) break;
        if (f === sq.file && r === sq.rank) return true;
        // Stop at any blocker — Rookie, ally (not the moving one) or enemy.
        if (state.rookie.file === f && state.rookie.rank === r) break;
        if (state.allies.some((a) => a !== movingAlly && a.file === f && a.rank === r)) break;
        if (state.pieces.some((p) => p !== e && p.file === f && p.rank === r)) break;
        f += df;
        r += dr;
      }
    }
  }
  return false;
}

/**
 * Advance ONE ally per call. Driven by the UI tick when `turn === 'allies'`
 * so each move animates separately (mirrors `stepEnemyTurn`'s pattern). The
 * ally at index `state.allyTurnIndex` acts, then the index advances. When
 * every ally has had a turn, control passes to the enemy.
 *
 * Captures take precedence; pawns promote to queen on rank 8.
 * Source=convert allies are slightly less consistent (30% random move,
 * 70% best-by-score) so they sometimes walk into trouble.
 */
export function stepAllyTurn(state: BoardState): BoardState {
  if (state.turn !== 'allies' || state.status !== 'playing') return state;
  // No allies, or every ally has moved — hand off to enemy.
  if (state.allyTurnIndex >= state.allies.length) {
    return { ...state, turn: 'enemy', allyTurnIndex: 0 };
  }
  const idx = state.allyTurnIndex;
  const ally = state.allies[idx];
  // Ally either can't move or no longer exists — skip it.
  if (!ally) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  const moves = allyMoves(state, ally);
  if (moves.length === 0) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  let pick: { to: Coord; capture: EnemyPiece | null };
  if (ally.source === 'convert' && Math.random() < 0.3) {
    pick = moves[Math.floor(Math.random() * moves.length)];
  } else {
    let best = moves[0];
    let bestScore = allyScoreMove(state, ally, best);
    for (const m of moves.slice(1)) {
      const s = allyScoreMove(state, ally, m);
      if (s > bestScore) {
        bestScore = s;
        best = m;
      }
    }
    pick = best;
  }
  const nextAllies = state.allies.map((a, i) =>
    i === idx
      ? {
          ...a,
          file: pick.to.file,
          rank: pick.to.rank,
          type: a.type === 'pawn' && pick.to.rank === 8 ? ('queen' as PieceType) : a.type,
        }
      : a,
  );
  let nextPieces = state.pieces;
  let nextCaptures = state.captures;
  let nextTempo = state.tempo;
  let statusClear: ReturnType<typeof clearStatusOnSquare> | null = null;
  if (pick.capture) {
    const sq = toSquare(pick.capture);
    statusClear = clearStatusOnSquare(state, sq);
    nextPieces = nextPieces.filter((p) => p !== pick.capture);
    nextCaptures = [...nextCaptures, pick.capture.type];
    const gain = TEMPO_REWARD[pick.capture.type] ?? 0;
    nextTempo = Math.min(TEMPO_MAX, state.tempo + gain);
  }
  return {
    ...state,
    ...(statusClear ?? {}),
    allies: nextAllies,
    pieces: nextPieces,
    captures: nextCaptures,
    tempo: nextTempo,
    allyTurnIndex: idx + 1,
  };
}

export function relocateStatusMarkers(
  state: BoardState,
  fromSq: string,
  toSq: string,
): Pick<
  BoardState,
  'poisonedSquares' | 'poisonedTurnsLeft' | 'rabidSquares' | 'rabidTurnsLeft'
> {
  let poisonedSquares = state.poisonedSquares;
  let poisonedTurnsLeft = state.poisonedTurnsLeft;
  if (state.poisonedSquares.includes(fromSq)) {
    const turns = state.poisonedTurnsLeft[fromSq];
    poisonedSquares = state.poisonedSquares.filter((s) => s !== fromSq);
    if (!poisonedSquares.includes(toSq))
      poisonedSquares = [...poisonedSquares, toSq];
    poisonedTurnsLeft = { ...state.poisonedTurnsLeft };
    delete poisonedTurnsLeft[fromSq];
    poisonedTurnsLeft[toSq] = turns;
  }
  let rabidSquares = state.rabidSquares;
  let rabidTurnsLeft = state.rabidTurnsLeft;
  if (state.rabidSquares.includes(fromSq)) {
    const turns = state.rabidTurnsLeft[fromSq];
    rabidSquares = state.rabidSquares.filter((s) => s !== fromSq);
    if (!rabidSquares.includes(toSq))
      rabidSquares = [...rabidSquares, toSq];
    rabidTurnsLeft = { ...state.rabidTurnsLeft };
    delete rabidTurnsLeft[fromSq];
    rabidTurnsLeft[toSq] = turns;
  }
  return { poisonedSquares, poisonedTurnsLeft, rabidSquares, rabidTurnsLeft };
}
