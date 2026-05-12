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
import type { BoardState, Coord, EnemyPiece, RookieForm } from './types';

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
  | 'aegis';

export type AbilityTier = 1 | 2 | 3 | 4 | 5;

/**
 * - movement: tap card, then tap a board square (legal moves shown).
 * - targeted: tap card, then tap any enemy / any square depending on ability.
 * - transform: tap card → Rookie morphs into another piece for N turns.
 * - instant:   tap card → resolves with a follow-up target tap (e.g. swap).
 * - passive:   no tap — auto-fires (Aegis).
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
    activation: 'passive',
    typeLine: 'Passive · Shield',
    description: 'Block the next capture.',
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
      if (tier === 5) return 'Permanent — attackers die instead.';
      if (tier === 4) return 'Block next 3 captures.';
      if (tier === 3) return 'Block 2 + stun attacker 1 turn.';
      if (tier === 2) return 'Block next 2 captures.';
      return 'Block next capture once.';
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

  let step: 'pick-square' | 'pick-enemy' = 'pick-square';
  if (def.activation === 'targeted') {
    step = abilityId === 'detonate' ? 'pick-square' : 'pick-enemy';
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
      lastAbilityFx: {
        kind: 'freeze-ray',
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
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return null;
  if (owned.usesLeftThisLevel === 0 && owned.tier !== 5) return null;

  let pieces = state.pieces;
  let captures = state.captures;
  if (owned.tier === 5) {
    // Attacker dies instead of capturing.
    pieces = pieces.filter((p) => p !== attacker);
    captures = [...captures, attacker.type];
  } else {
    // Just block the capture — attacker stays.
  }

  // T3: stun the attacker for 1 turn (freeze its square).
  let frozenSquares = state.frozenSquares;
  let frozenTurnsLeft = state.frozenTurnsLeft;
  if (owned.tier === 3) {
    const sq = toSquare({ file: attacker.file, rank: attacker.rank });
    if (!frozenSquares.includes(sq)) frozenSquares = [...frozenSquares, sq];
    frozenTurnsLeft = { ...frozenTurnsLeft, [sq]: 2 }; // 2 = stays through this turn end + next
  }

  return {
    ...state,
    pieces,
    captures,
    frozenSquares,
    frozenTurnsLeft,
    abilities:
      owned.tier === 5 ? state.abilities : decrementUse(state.abilities, 'aegis'),
  };
}

/** Reset every owned ability's per-level uses (called at level transitions). */
export function refreshAbilityUses(abilities: OwnedAbility[]): OwnedAbility[] {
  return abilities.map((a) => ({
    ...a,
    usesLeftThisLevel: maxUsesForTier(a.id, a.tier),
  }));
}
