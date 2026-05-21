/**
 * Bot evaluation primitives. Shared across T3 / T4 / T5.
 *
 * Evaluation philosophy: higher = better for Rookie. We score from Rookie's
 * perspective. The game is solved when she reaches rank 8; losing states
 * (status === 'lost') get a very negative score.
 *
 * Components of the eval:
 *   - distance-to-rank-8 (closer is better)
 *   - safety (avoid squares attacked by enemies)
 *   - material captured (sunk tempo)
 *   - move budget remaining (slack)
 *   - tempo + abilities owned (potential power)
 *   - ability uses remaining (latent reactive power)
 */

import type { AbilityId, OwnedAbility } from '../../../lib/run/abilities';
import { abilityLegalMoves, visibleEnemySquares } from '../../../lib/run/abilities';
import { rookieLegalMoves, enemyAt } from '../../../lib/run/movement';
import { TEMPO_MAX } from '../../../lib/run/scoring';
import type {
  BoardState,
  Coord,
  EnemyPiece,
  PieceType,
} from '../../../lib/run/types';
import { toSquare } from '../../../lib/run/types';

const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  queen: 9,
};

/**
 * Squares attacked by enemies *as the board stands right now*. Cheap-ish — we
 * iterate pieces and project their attack patterns. Used by safety scoring.
 *
 * Frozen enemies don't attack (they skip their turn).
 */
export function enemyAttackedSquares(state: BoardState): Set<string> {
  const out = new Set<string>();
  const frozen = new Set(state.frozenSquares);
  for (const p of state.pieces) {
    const sq = toSquare({ file: p.file, rank: p.rank });
    if (frozen.has(sq)) continue;
    addAttacksForPiece(state, p, out);
  }
  // Become-King impervious: while Rookie is in king form she cannot be
  // captured. Treat her square as un-attackable so safety scoring stops
  // discounting it and bots stop "wasting tempo" on capture-of-Rookie moves
  // that will simply bounce.
  if (state.form === 'king') {
    out.delete(toSquare(state.rookie));
  }
  return out;
}

function addAttacksForPiece(
  state: BoardState,
  piece: EnemyPiece,
  out: Set<string>,
): void {
  switch (piece.type) {
    case 'pawn':
      // Black pawns attack diagonally toward rank 1.
      for (const df of [-1, 1]) {
        const f = piece.file + df;
        const r = piece.rank - 1;
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        out.add(toSquare({ file: f, rank: r }));
      }
      return;
    case 'knight':
      for (const [df, dr] of [
        [1, 2],
        [2, 1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [2, -1],
        [-1, -2],
        [-2, -1],
      ] as const) {
        const f = piece.file + df;
        const r = piece.rank + dr;
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        out.add(toSquare({ file: f, rank: r }));
      }
      return;
    case 'bishop':
      addSlideAttacks(state, piece, out, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      return;
    case 'queen':
      addSlideAttacks(state, piece, out, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      return;
  }
}

function addSlideAttacks(
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
      // Slide stops at any occupant (own piece or rookie).
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

/** True if any enemy currently threatens Rookie's square. */
export function rookieInThreat(state: BoardState): boolean {
  const attacked = enemyAttackedSquares(state);
  return attacked.has(toSquare(state.rookie));
}

/** True if any enemy can capture Rookie at the given target square (post-move). */
export function squareUnderAttack(state: BoardState, target: Coord): boolean {
  const attacked = enemyAttackedSquares(state);
  return attacked.has(toSquare(target));
}

/** Distance-to-rank-8 in Rookie moves (rough — assumes she can walk in a line). */
export function distanceToGoal(state: BoardState): number {
  return Math.max(0, 8 - state.rookie.rank);
}

const LOST_SCORE = -10_000;
const WON_SCORE = 10_000;

export function evalState(state: BoardState): number {
  if (state.status === 'lost') return LOST_SCORE;
  if (state.status === 'won') return WON_SCORE;

  let score = 0;

  // Rank position is a small signal — a rook on rank 5 isn't meaningfully
  // closer to winning than a rook on rank 2 if both have clear paths up.
  // The dominant signal is OPEN PATHS, not raw rank. Keep this tiny so the
  // bot doesn't waste turns inching forward when a winning slide exists.
  score += state.rookie.rank * 2;

  // Squares I can safely occupy (legal moves not attacked).
  const attacked = enemyAttackedSquares(state);
  const legal = rookieLegalMoves(state);
  let safeMoves = 0;
  let advancingSafe = 0;
  let winningReach = 0;
  for (const m of legal) {
    if (!attacked.has(toSquare(m))) {
      safeMoves++;
      if (m.rank > state.rookie.rank) advancingSafe++;
      // Rookie reaches rank 8 RIGHT NOW with a safe slide. Game over,
      // huge bonus so this dominates every other consideration.
      if (m.rank === 8) winningReach++;
    }
  }
  score += Math.min(safeMoves, 6) * 1.5;
  score += advancingSafe * 2.5;
  if (winningReach > 0) score += 60;

  // OPEN PATH MANDATE — for each file, count whether rookie could reach
  // rank 8 on that file with a clear vertical path. A "clear" file means
  // no enemy and no hazard between rookie's current rank and rank 7
  // (inclusive). Rank 8 itself can be empty or capturable.
  //
  // Frozen / poisoned (about to die) pieces are treated as walkable: Rookie
  // can step in and capture them (frozen can't fight back, poisoned will
  // die soon anyway). This is what makes a Freeze or Poison on a blocker
  // visibly open a path in the eval.
  const frozen = new Set(state.frozenSquares);
  const poisoned = new Set(state.poisonedSquares);
  let openPathCount = 0;
  let rookieFileIsOpen = false;
  for (let f = 1; f <= 8; f++) {
    let clear = true;
    for (let r = state.rookie.rank + 1; r <= 7; r++) {
      const sq = toSquare({ file: f, rank: r });
      const blocker = state.pieces.find((p) => p.file === f && p.rank === r);
      if (blocker && !frozen.has(sq) && !poisoned.has(sq)) {
        clear = false;
        break;
      }
      if (state.hazards.some((h) => h.file === f && h.rank === r)) {
        clear = false;
        break;
      }
    }
    if (clear) {
      openPathCount++;
      if (f === state.rookie.file) rookieFileIsOpen = true;
    }
  }
  score += openPathCount * 5;
  // Being ON an open winning file right now is even better than just having
  // such a file exist — it means rookie is one slide from rank 8 (or a
  // close-to-rank-8 square that wins on the followup).
  if (rookieFileIsOpen) score += 20;

  // Penalize standing in a threatened square.
  if (attacked.has(toSquare(state.rookie))) score -= 25;

  // Move budget slack — if a move limit exists, prefer keeping room.
  if (state.moveLimit !== null) {
    const slack = state.moveLimit - state.moveCount;
    if (slack <= 0) return LOST_SCORE;
    score += Math.min(slack, 8) * 1.5;
  }

  // Tempo + abilities — latent power. Tempo is a flat board credit.
  // Ability value is BOARD-AWARE (see latentAbilityValue) so the eval can
  // detect "I own Freeze Ray AND there's a queen blocking me" vs "I own
  // Freeze Ray and the board is benign." Without this the ablation
  // flatlines: removing any ability changes the latent score by the same
  // tier-based constant and the bot makes the same choices.
  score += (state.tempo / TEMPO_MAX) * 4;
  score += latentAbilityValue(state);
  if (state.shieldUp) score += 6;
  if (state.bonusMovesLeft > 0) score += state.bonusMovesLeft * 5;

  // Material penalty by chess piece value, discounted by status. Frozen
  // pieces don't attack and can be captured for free; poisoned will die
  // soon; rabid pieces may capture their own teammates. All three are
  // "softly removed" from the threat picture.
  for (const p of state.pieces) {
    const sq = toSquare({ file: p.file, rank: p.rank });
    let mult = 0.8;
    if (frozen.has(sq)) mult = 0.16;
    else if (poisoned.has(sq)) mult = 0.32;
    else if (state.rabidSquares.includes(sq)) mult = 0.48;
    score -= PIECE_VALUE[p.type] * mult;
  }

  return score;
}

/**
 * Board-aware latent value of currently-owned abilities.
 *
 * Replaces the prior flat `+3 + tier` per owned ability — that constant
 * made the eval insensitive to whether the ability was actually useful on
 * this board, which is why the nightly ablation kept flatlining at 0pp.
 *
 * For each owned ability we ask: "if I activated you on the best legal
 * target right now, roughly how much would the board improve?" Cheap
 * O(#enemies) heuristics per ability — no recursion, no applyBotAction.
 *
 * Exhausted-but-owned abilities still get a token credit (0.5) so two
 * states that differ only by "what's in the ability slot" still order
 * stably and the offer-picker has a small prior on existence.
 */
export function latentAbilityValue(state: BoardState): number {
  let total = 0;
  for (const a of state.abilities) {
    total += abilityHeuristic(state, a.id, a.tier, a.usesLeftThisLevel);
  }
  return total;
}

/** Per-ability "what's it worth right now" heuristic. Tier scales potency. */
export function abilityHeuristic(
  state: BoardState,
  id: AbilityId,
  tier: number,
  usesLeftThisLevel: number,
): number {
  // Unlimited (-1) and >0 = usable. 0 = exhausted, small fixed credit.
  const usable = usesLeftThisLevel !== 0;
  if (!usable) return 0.5;

  const tierMult = 1 + tier * 0.25; // T1=1.25, T5=2.25
  const threatened = rookieInThreat(state);

  switch (id) {
    case 'aegis':
      // Defensive — high when needed, low when safe.
      return (threatened ? 12 : 2) * tierMult;
    case 'surge':
      // Bonus moves: universally useful, especially with progress to make.
      return (4 + Math.max(0, 8 - state.rookie.rank) * 0.5) * tierMult;
    case 'freeze-ray':
    case 'poison-dart':
    case 'rabies-dart':
      // Value scales with the heaviest visible enemy (the thing we'd zap).
      // Big bonus if a heavy piece is on Rookie's file (likely blocker).
      return targetedEnemyValue(state) * tierMult;
    case 'decoy':
      return (threatened ? 6 : 2) * tierMult;
    case 'phase-step':
    case 'leap':
      // Worth more when blockers stand between Rookie and rank 8.
      return blockerCountAhead(state) * 2 * tierMult;
    case 'bishop-step':
    case 'knight-hop':
    case 'queen-pulse':
      // Transforms get value from distance-to-go + presence of mobility need.
      return (2 + Math.max(0, 8 - state.rookie.rank) * 0.5) * tierMult;
    case 'become-king':
      return (threatened ? 10 : 3) * tierMult;
    default:
      // Safe default for any ability not customized above. Beats the flat
      // 3+tier prior modestly but stays board-agnostic.
      return 2 * tierMult;
  }
}

function targetedEnemyValue(state: BoardState): number {
  const seen = visibleEnemySquares(state);
  let best = 0;
  for (const c of seen) {
    const enemy = state.pieces.find((p) => p.file === c.file && p.rank === c.rank);
    if (!enemy) continue;
    let v = PIECE_VALUE[enemy.type];
    // Same-file enemy is a more attractive zap (clears the path).
    if (enemy.file === state.rookie.file) v *= 1.5;
    if (v > best) best = v;
  }
  return best * 0.8;
}

function blockerCountAhead(state: BoardState): number {
  let n = 0;
  for (const p of state.pieces) {
    if (p.rank > state.rookie.rank && p.rank <= 7) n++;
  }
  return Math.min(n, 4);
}

/**
 * Heuristic: can any enemy capture Rookie next enemy turn? Conservative —
 * doesn't account for ghost-blockers or enemy pick-priority, just "is rookie's
 * current square in the attack-set."
 */
export function rookieCanBeCapturedThisTurn(state: BoardState): boolean {
  return rookieInThreat(state);
}

/**
 * Enumerate all legal Rookie *actions* (regular moves + valid ability
 * activations) from the current state. Each action is annotated with what
 * follow-up (if any) the activation needs.
 *
 * Returned action shapes are bot-friendly — they map 1:1 to BotAction.
 *
 * Excluded abilities (from ablation context) are filtered out. Targeted/
 * movement abilities are expanded into one entry per legal target so the bot
 * can score each concrete result rather than just "tap the card."
 */
export interface ActionCandidate {
  kind: 'move' | 'activate-ability' | 'ability-target';
  abilityId?: AbilityId;
  target?: Coord;
}

export function legalCandidates(
  state: BoardState,
  excluded: ReadonlySet<AbilityId>,
): ActionCandidate[] {
  const out: ActionCandidate[] = [];
  if (state.status !== 'playing' || state.turn !== 'rookie') return out;
  if (state.pendingOffer) return out;
  if (state.activeAbility) return out; // caller handles follow-up separately

  for (const m of rookieLegalMoves(state)) {
    out.push({ kind: 'move', target: m });
  }

  for (const owned of state.abilities) {
    if (excluded.has(owned.id)) continue;
    if (owned.usesLeftThisLevel === 0) continue;
    out.push(...candidatesForAbility(state, owned));
  }

  return out;
}

function candidatesForAbility(
  state: BoardState,
  owned: OwnedAbility,
): ActionCandidate[] {
  const out: ActionCandidate[] = [];
  switch (owned.id) {
    case 'aegis':
      if (!state.shieldUp) out.push({ kind: 'activate-ability', abilityId: 'aegis' });
      return out;
    case 'surge':
      out.push({ kind: 'activate-ability', abilityId: 'surge' });
      return out;
    case 'bishop-step':
    case 'knight-hop':
    case 'queen-pulse':
    case 'become-king':
      if (state.form === 'rook') {
        out.push({ kind: 'activate-ability', abilityId: owned.id });
      }
      return out;
    case 'phase-step':
    case 'leap': {
      const legals = abilityLegalMoves(state, owned.id);
      for (const target of legals) {
        out.push({ kind: 'ability-target', abilityId: owned.id, target });
      }
      return out;
    }
    case 'freeze-ray':
    case 'poison-dart':
    case 'rabies-dart': {
      // Line-of-sight dart abilities. Only enemies on a square Rookie's
      // current form can SEE are legal targets — the engine rejects others
      // anyway, so the bot doesn't need to enumerate them.
      const seen = visibleEnemySquares(state);
      for (const c of seen) {
        const sq = toSquare(c);
        if (
          owned.id === 'freeze-ray' &&
          state.frozenSquares.includes(sq)
        )
          continue;
        if (
          owned.id === 'poison-dart' &&
          state.poisonedSquares.includes(sq)
        )
          continue;
        if (
          owned.id === 'rabies-dart' &&
          state.rabidSquares.includes(sq)
        )
          continue;
        out.push({
          kind: 'ability-target',
          abilityId: owned.id,
          target: { file: c.file, rank: c.rank },
        });
      }
      return out;
    }
    case 'decoy': {
      // Target any enemy.
      for (const p of state.pieces) {
        out.push({
          kind: 'ability-target',
          abilityId: 'decoy',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
  }
  return out;
}

/** Identify which enemy piece *did* capture Rookie, given a state where rookie is gone. */
export function inferCapturer(prev: BoardState, next: BoardState): PieceType | undefined {
  // The capturer is the enemy that now occupies Rookie's previous square.
  for (const p of next.pieces) {
    if (p.file === prev.rookie.file && p.rank === prev.rookie.rank) return p.type;
  }
  return undefined;
}

/** Sum of material remaining on the board. Used as a tiebreaker / signal. */
export function materialOnBoard(pieces: EnemyPiece[]): number {
  return pieces.reduce((sum, p) => sum + (PIECE_VALUE[p.type] ?? 0), 0);
}

/**
 * Score an offer slot by how useful that ability would be on THIS board.
 *
 * Pre-spike: bots used a static `3 + tier + (new ? 1 : 0)` — the offer pick
 * was board-blind. Now we synthesize an owned-with-one-charge view and run
 * the same `abilityHeuristic` the eval uses, so e.g. a Freeze Ray offer
 * facing a queen on Rookie's file outscores the same offer on an empty
 * board. A small tier prior keeps T5 upgrades preferred at ties.
 */
export function valueOfOffer(
  state: BoardState,
  id: AbilityId,
  tier: number,
  kind: 'new' | 'upgrade',
): number {
  const latent = abilityHeuristic(state, id, tier, 1);
  // Tiny static prior so high-tier offers still beat low-tier ties on a
  // benign board, and "new" beats "upgrade" all-else-equal.
  return latent + tier * 0.5 + (kind === 'new' ? 0.5 : 0);
}
