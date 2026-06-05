/**
 * Per-ability strategic evaluation.
 *
 * Pure additive bonus applied on top of `evalState(postState)` when a bot
 * is scoring an ability candidate. Captures the strategic *intent* of each
 * ability — what it unlocks / removes / threatens — rather than relying on
 * the positional eval to back-derive it from board geometry.
 *
 * Tier-aware scaling (passed in by the caller):
 *   T3 Casual  → 0.3  (sees a fraction of the bonus — uses abilities but suboptimally)
 *   T4 Sharp   → 0.7
 *   T5 Expert  → 1.0
 *
 * All functions take `state` (pre-action) so we measure the marginal value
 * the ability provides at this decision point.
 */

import {
  ABILITY_DEFS,
  type AbilityId,
  convertEligibleTypes,
  formForAbility,
  type OwnedAbility,
  transformDurationForTier,
} from '../../../lib/run/abilities';
import { rookieLegalMoves } from '../../../lib/run/movement';
import type {
  BoardState,
  Coord,
  EnemyPiece,
  PieceType,
} from '../../../lib/run/types';
import { toSquare } from '../../../lib/run/types';
import {
  enemyAttackedSquares,
  evalState,
  rookieInThreat,
} from './shared';
import type { TierId } from '../types';
import type { BotAction } from '../types';

const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  queen: 9,
};

export function strategicScale(tier: TierId): number {
  if (tier === 'T3') return 0.3;
  if (tier === 'T4') return 0.7;
  return 1.0;
}

/**
 * Strategic bonus to add to the regular eval when scoring a bot ability
 * candidate. Returns 0 for non-ability actions or for abilities not owned.
 *
 * Pure: never mutates state.
 */
export function strategicBonus(
  state: BoardState,
  action: BotAction,
  tier: TierId,
): number {
  if (action.kind !== 'activate-ability' && action.kind !== 'ability-target') {
    return 0;
  }
  const owned = state.abilities.find((a) => a.id === action.abilityId);
  if (!owned) return 0;
  const scale = strategicScale(tier);
  const raw = rawBonus(state, action, owned);
  return raw * scale;
}

function rawBonus(
  state: BoardState,
  action: BotAction,
  owned: OwnedAbility,
): number {
  const id = owned.id;
  const target =
    action.kind === 'ability-target' ? action.target : undefined;

  switch (id) {
    case 'surge':
      return surgeBonus(state, owned);
    case 'aegis':
      return aegisBonus(state);
    case 'become-king':
      return becomeKingBonus(state, owned);
    case 'freeze-ray':
      return target ? freezeBonus(state, target) : 0;
    case 'poison-dart':
      return target ? poisonBonus(state, target, owned) : 0;
    case 'rabies-dart':
      return target ? rabiesBonus(state, target) : 0;
    case 'convert':
      return target ? convertBonus(state, target, owned) : 0;
    case 'drones':
      return dronesBonus(state, owned);
    case 'squad':
      return 0; // passive — never appears as a candidate
    case 'knight-hop':
    case 'bishop-step':
    case 'queen-pulse':
      return transformBonus(state, owned);
    case 'decoy':
      return target ? decoyBonus(state, target) : 0;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Surge — bonus = (best 2-move gain) − (best 1-move gain) on Rookie's current
// turn. Pure, no recursion: enumerate first move, then enumerate second move
// from the resulting state, scoring with evalState only (positional).
// ---------------------------------------------------------------------------

function surgeBonus(state: BoardState, owned: OwnedAbility): number {
  // Approximate: enumerate Rookie's legal moves, simulate the move (no enemy
  // turn), then enumerate again. Compare best-of-2 vs best-of-1 against the
  // baseline (no move).
  const baseline = evalState(state);
  const m1 = bestRookieMoveScore(state) - baseline;
  const m2 = bestTwoMoveScore(state) - baseline;
  const unlocked = Math.max(0, m2 - m1);
  // Surge with 3 free moves at T5 is strictly better than +1 — scale by bonus count.
  const extra = owned.tier <= 2 ? 1 : owned.tier <= 4 ? 2 : 3;
  return unlocked * Math.max(1, extra * 0.6);
}

function bestRookieMoveScore(state: BoardState): number {
  const moves = rookieLegalMoves(state);
  if (moves.length === 0) return evalState(state);
  let best = -Infinity;
  for (const m of moves) {
    const after = simulateRookieStep(state, m);
    const s = evalState(after);
    if (s > best) best = s;
  }
  return best;
}

function bestTwoMoveScore(state: BoardState): number {
  const moves = rookieLegalMoves(state);
  if (moves.length === 0) return evalState(state);
  let best = -Infinity;
  for (const m of moves) {
    const after = simulateRookieStep(state, m);
    const moves2 = rookieLegalMoves(after);
    if (moves2.length === 0) {
      const s = evalState(after);
      if (s > best) best = s;
      continue;
    }
    for (const m2 of moves2) {
      const after2 = simulateRookieStep(after, m2);
      const s = evalState(after2);
      if (s > best) best = s;
    }
  }
  return best;
}

/**
 * Simulate Rookie stepping to `target` without invoking enemy turn or full
 * engine. Captures enemy on landing square. Pure; for surge lookahead only.
 */
function simulateRookieStep(state: BoardState, target: Coord): BoardState {
  const captured = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  const pieces = captured
    ? state.pieces.filter((p) => p !== captured)
    : state.pieces;
  return {
    ...state,
    rookie: { ...target },
    pieces,
    status: target.rank === 8 ? 'won' : state.status,
  };
}

// ---------------------------------------------------------------------------
// Aegis — banks a shield. Big if Rookie is in threat now, small otherwise.
// ---------------------------------------------------------------------------

function aegisBonus(state: BoardState): number {
  if (state.shieldUp) return 0;
  return rookieInThreat(state) ? 25 : 5;
}

// ---------------------------------------------------------------------------
// Become King — value = turns_of_invuln × threat_density on Rookie's reach.
// ---------------------------------------------------------------------------

function becomeKingBonus(state: BoardState, owned: OwnedAbility): number {
  if (state.form !== 'rook') return 0;
  const turns = transformDurationForTier('become-king', owned.tier);
  const attacked = enemyAttackedSquares(state);
  const reach = rookieLegalMoves(state);
  if (reach.length === 0) return 0;
  let threatened = 0;
  for (const m of reach) {
    if (attacked.has(toSquare(m))) threatened++;
  }
  const density = threatened / reach.length;
  // 1 threatened square × 1 turn ≈ +6; surrounded × 3 turns ≈ +18+.
  return turns * density * 12 + (rookieInThreat(state) ? 8 : 0);
}

// ---------------------------------------------------------------------------
// Freeze Ray — disable an attacker / blocker.
// ---------------------------------------------------------------------------

function freezeBonus(state: BoardState, target: Coord): number {
  const piece = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (!piece) return 0;
  return PIECE_VALUE[piece.type] * threatWeight(state, piece);
}

// ---------------------------------------------------------------------------
// Poison Dart — like freeze but discounted: enemy may move first / capture
// something before dying.
// ---------------------------------------------------------------------------

function poisonBonus(
  state: BoardState,
  target: Coord,
  owned: OwnedAbility,
): number {
  const piece = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (!piece) return 0;
  // Discount by time-to-die: T5 = 1 turn → near full value, T1/T2 = 3 turns.
  const tier = owned.tier;
  const ttd = tier === 5 ? 1 : tier >= 3 ? 2 : 3;
  const delayFactor = 1 - (ttd - 1) * 0.15; // 1 / 0.85 / 0.70
  return PIECE_VALUE[piece.type] * threatWeight(state, piece) * 0.9 * delayFactor;
}

// ---------------------------------------------------------------------------
// Rabies Dart — target attacks its allies. Bonus = expected enemy material
// the rabid target can capture next turn.
// ---------------------------------------------------------------------------

function rabiesBonus(state: BoardState, target: Coord): number {
  const piece = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (!piece) return 0;
  // Compute squares the rabid piece attacks, sum value of enemies on those squares.
  const attacks = pieceAttackSquares(state, piece);
  let total = 0;
  for (const sq of attacks) {
    const victim = state.pieces.find(
      (p) => p !== piece && toSquare({ file: p.file, rank: p.rank }) === sq,
    );
    if (victim) total += PIECE_VALUE[victim.type];
  }
  // Plus a small bonus for removing the rabid piece from Rookie-attacking duty.
  const selfRemove = threatWeight(state, piece) * PIECE_VALUE[piece.type] * 0.3;
  return Math.min(total * 2, 25) + selfRemove;
}

// ---------------------------------------------------------------------------
// Convert — gain piece on our side, enemy loses it.
// ---------------------------------------------------------------------------

function convertBonus(
  state: BoardState,
  target: Coord,
  owned: OwnedAbility,
): number {
  const piece = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (!piece) return 0;
  const eligible = convertEligibleTypes(owned.tier);
  if (!eligible.has(piece.type as 'pawn' | 'knight' | 'bishop' | 'queen')) {
    return 0;
  }
  const v = PIECE_VALUE[piece.type];
  // Strong: we gain a piece AND deprive them. ~2× material swing.
  // Higher if target is on our forward path or attacks rookie.
  const inPath = piece.file === state.rookie.file && piece.rank > state.rookie.rank;
  const pathMult = inPath ? 1.6 : 1.0;
  const threatMult = 1 + threatWeight(state, piece) * 0.5;
  return v * 2.5 * pathMult * threatMult;
}

// ---------------------------------------------------------------------------
// Drones — simulate fixed launch directions; sum enemy values in fire lanes.
// Drones move N/S/E/W rook-style from Rookie's square. Cap at first enemy hit.
// ---------------------------------------------------------------------------

function dronesBonus(state: BoardState, owned: OwnedAbility): number {
  const count = droneCountForTier(owned.tier);
  // Drones pick a random direction and slide. We approximate by computing the
  // best enemy reachable in any of the 4 rook directions and assuming we get
  // `min(count, lanes_with_enemies)` of them.
  const dirs: Array<[number, number]> = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];
  const laneVictims: number[] = [];
  for (const [df, dr] of dirs) {
    let f = state.rookie.file + df;
    let r = state.rookie.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const e = state.pieces.find((p) => p.file === f && p.rank === r);
      if (e) {
        laneVictims.push(PIECE_VALUE[e.type]);
        break;
      }
      f += df;
      r += dr;
    }
  }
  laneVictims.sort((a, b) => b - a);
  let total = 0;
  for (let i = 0; i < Math.min(count, laneVictims.length); i++) {
    total += laneVictims[i];
  }
  // Each captured piece nets ~2× value (removed blocker + tempo).
  return total * 2;
}

function droneCountForTier(tier: number): number {
  if (tier === 5) return 6;
  if (tier === 4) return 4;
  if (tier === 3) return 3;
  if (tier === 2) return 2;
  return 1;
}

// ---------------------------------------------------------------------------
// Transforms — Knight Hop / Bishop Step / Queen Pulse / Become King movement.
// Bonus = goal-distance reduction reachable as the new form within duration.
// ---------------------------------------------------------------------------

function transformBonus(state: BoardState, owned: OwnedAbility): number {
  if (state.form !== 'rook') return 0;
  const form = formForAbility(owned.id);
  if (!form || form === 'king') return 0;
  const duration = transformDurationForTier(owned.id, owned.tier);
  const synthetic: BoardState = { ...state, form, formMovesLeft: duration };
  const moves = rookieLegalMoves(synthetic);
  if (moves.length === 0) return 0;
  // Best rank reachable in 1 transformed move. (Approximation — bishop step
  // changes diagonal access, queen pulse adds both, knight hops over walls.)
  let bestRank = state.rookie.rank;
  const attacked = enemyAttackedSquares(state);
  for (const m of moves) {
    if (attacked.has(toSquare(m))) continue;
    if (m.rank > bestRank) bestRank = m.rank;
  }
  const reduction = bestRank - state.rookie.rank;
  // Direct rank-8 reach is huge.
  const wins = moves.some(
    (m) => m.rank === 8 && !attacked.has(toSquare(m)),
  );
  if (wins) return 60;
  // Also: count enemies newly reachable (captures the rook couldn't get to).
  let newCaptures = 0;
  const rookMoves = new Set(rookieLegalMoves(state).map(toSquare));
  for (const m of moves) {
    const sq = toSquare(m);
    if (rookMoves.has(sq)) continue;
    const e = state.pieces.find((p) => p.file === m.file && p.rank === m.rank);
    if (e && !attacked.has(sq)) newCaptures += PIECE_VALUE[e.type];
  }
  return reduction * 5 + newCaptures * 2;
}

// ---------------------------------------------------------------------------
// Decoy — mark enemy; its teammates attack it. Value = sum of teammate values
// that can capture the marked square next turn.
// ---------------------------------------------------------------------------

function decoyBonus(state: BoardState, target: Coord): number {
  const marked = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (!marked) return 0;
  const targetSq = toSquare(target);
  let total = 0;
  for (const p of state.pieces) {
    if (p === marked) continue;
    const attacks = pieceAttackSquares(state, p);
    if (attacks.has(targetSq)) {
      total += PIECE_VALUE[p.type];
    }
  }
  // Bonus if removing the marked piece would clear a Rookie-threat.
  const threatRelief = threatWeight(state, marked) * PIECE_VALUE[marked.type] * 0.5;
  return total * 1.5 + threatRelief;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Weight for "how relevant is this enemy?":
 *   1.0 = attacks Rookie now
 *   0.6 = blocks Rookie's goal-column path (between rookie and rank 8 on her file)
 *   0.3 = otherwise
 */
function threatWeight(state: BoardState, piece: EnemyPiece): number {
  const attacks = pieceAttackSquares(state, piece);
  if (attacks.has(toSquare(state.rookie))) return 1.0;
  if (
    piece.file === state.rookie.file &&
    piece.rank > state.rookie.rank &&
    piece.rank <= 8
  ) {
    return 0.6;
  }
  return 0.3;
}

/**
 * Squares attacked by a single piece. Sliders blocked by other pieces /
 * rookie. Pawns attack diagonally toward rank 1.
 */
function pieceAttackSquares(state: BoardState, piece: EnemyPiece): Set<string> {
  const out = new Set<string>();
  switch (piece.type) {
    case 'pawn':
      for (const df of [-1, 1]) {
        const f = piece.file + df;
        const r = piece.rank - 1;
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        out.add(toSquare({ file: f, rank: r }));
      }
      return out;
    case 'knight':
      for (const [df, dr] of [
        [1, 2], [2, 1], [-1, 2], [-2, 1],
        [1, -2], [2, -1], [-1, -2], [-2, -1],
      ] as const) {
        const f = piece.file + df;
        const r = piece.rank + dr;
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        out.add(toSquare({ file: f, rank: r }));
      }
      return out;
    case 'bishop':
      addSlide(state, piece, out, [
        [1, 1], [1, -1], [-1, 1], [-1, -1],
      ]);
      return out;
    case 'queen':
      addSlide(state, piece, out, [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1],
      ]);
      return out;
  }
}

function addSlide(
  state: BoardState,
  piece: EnemyPiece,
  out: Set<string>,
  dirs: ReadonlyArray<readonly [number, number]>,
): void {
  for (const [df, dr] of dirs) {
    let f = piece.file + df;
    let r = piece.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      out.add(toSquare({ file: f, rank: r }));
      const blockedByEnemy = state.pieces.find(
        (q) => q !== piece && q.file === f && q.rank === r,
      );
      const blockedByRookie =
        state.rookie.file === f && state.rookie.rank === r;
      if (blockedByEnemy || blockedByRookie) break;
      f += df;
      r += dr;
    }
  }
}

// Re-export to ensure ABILITY_DEFS is treated as used by tsc (avoids unused-import warning).
void ABILITY_DEFS;
