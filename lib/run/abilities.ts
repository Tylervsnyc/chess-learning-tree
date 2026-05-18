/**
 * Rookie's Run — Ability progression system.
 *
 * 12 shipped abilities, each 5 tiers. Tempo fills → player picks new ability
 * or upgrades an owned one. Abilities are permanent for the run.
 *
 * Tier shape: T1-T3 scale power, T4 doubles uses or adds a twist, T5 is
 * the permanent / unlimited payoff.
 */

import { rookieLegalMoves } from './movement';
import { TEMPO_MAX } from './scoring';
import { toSquare } from './types';
import type { BoardState, Coord, EnemyPiece, RookieForm } from './types';

export type AbilityId =
  | 'bishop-step'
  | 'knight-hop'
  | 'queen-pulse'
  | 'become-king'
  | 'freeze-ray'
  | 'poison-dart'
  | 'rabies-dart'
  | 'phase-step'
  | 'leap'
  | 'surge'
  | 'aegis'
  | 'decoy';

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
  decoy: {
    id: 'decoy',
    name: 'Decoy',
    activation: 'targeted',
    typeLine: 'Targeted · Trick',
    description: 'Mark an enemy. Its teammates will attack it.',
  },
};

export const ALL_ABILITY_IDS: AbilityId[] = Object.keys(
  ABILITY_DEFS,
) as AbilityId[];

/**
 * Back-compat alias kept so playtest scripts (digest.ts, simulate.ts, etc.)
 * don't break. Now identical to ALL_ABILITY_IDS — every ability in this file
 * is shipped to real players.
 */
export const SHIPPED_ABILITY_IDS: AbilityId[] = ALL_ABILITY_IDS;

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
      if (tier === 4) return 2;
      return 1;
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
    case 'phase-step':
      return 1;
    case 'leap':
      if (tier <= 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 3;
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
    if (tier === 1) return 1;
    if (tier === 2 || tier === 3) return 2;
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
  'phase-step': 'Tap card, then tap a square past a piece.',
  leap: 'Tap card, then tap a forward jump square.',
  surge: 'Tap card. You get an extra move.',
  aegis: 'Tap card. Shield stays up until used.',
  decoy: 'Tap card, then tap an enemy.',
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
      if (tier === 5)
        return 'Become a king. Nothing can capture you for the rest of the level.';
      if (tier === 4) return 'Become a king for 3 turns. Nothing can capture you.';
      if (tier >= 2) return 'Become a king for 2 turns. Nothing can capture you.';
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
    case 'phase-step':
      if (tier === 5) return 'Teleport to any empty square.';
      if (tier === 4) return 'Walk through everything in a straight line.';
      if (tier === 3) return 'Walk through 1 piece, up to 3 squares.';
      if (tier === 2) return 'Walk through 1 piece, up to 2 squares.';
      return 'Walk through 1 piece, 1 square.';
    case 'leap':
      if (tier === 5) return 'Jump 2 to 6 squares in any direction.';
      if (tier === 4) return 'Jump 2 to 4 squares up, down, left, or right.';
      if (tier === 3) return 'Jump 2 to 4 squares forward.';
      if (tier === 2) return 'Jump 2 or 3 squares forward.';
      return 'Jump exactly 2 squares forward.';
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
      if (tier === 3) return 'King for 2 turns. 1/level.';
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
    case 'decoy':
      if (tier === 5) return 'Mark stays until captured. 1/level.';
      if (tier === 4) return 'Mark 3 turns. Capturers freeze. 2/level.';
      if (tier === 3) return 'Mark for 2 turns. 2/level.';
      if (tier === 2) return 'Mark for 2 turns. 1/level.';
      return 'Mark an enemy for 1 turn. 1/level.';
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

  const newPool: AbilityOfferOption[] = ALL_ABILITY_IDS.filter(
    (id) => !owned.has(id),
  ).map((id) => ({
    kind: 'new',
    id,
    tier: 1,
    description: blurbDetailForTier(id, 1),
  }));

  const upgradePool: AbilityOfferOption[] = [...owned.values()]
    .filter((a) => a.tier < 5)
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

function inBounds(c: Coord): boolean {
  return c.file >= 1 && c.file <= 8 && c.rank >= 1 && c.rank <= 8;
}

function isHazard(state: BoardState, c: Coord): boolean {
  return state.hazards.some((h) => h.file === c.file && h.rank === c.rank);
}

function enemyAt(state: BoardState, c: Coord): EnemyPiece | undefined {
  return state.pieces.find((p) => p.file === c.file && p.rank === c.rank);
}

function phaseStepMoves(state: BoardState, tier: AbilityTier): Coord[] {
  const out: Coord[] = [];
  const { rookie } = state;
  if (tier === 5) {
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
        out.push(c);
        continue;
      }
      out.push(c);
    }
  }
  return out;
}

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
      if (enemyAt(state, c)) continue;
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

  // All targeted abilities (freeze ray, poison dart, rabies dart, decoy)
  // pick an enemy as their second tap.
  let step: 'pick-square' | 'pick-enemy' = 'pick-square';
  if (def.activation === 'targeted') step = 'pick-enemy';
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

  const fxKind: 'phase-step' | 'leap' | null =
    abilityId === 'phase-step'
      ? 'phase-step'
      : abilityId === 'leap'
        ? 'leap'
        : null;

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
