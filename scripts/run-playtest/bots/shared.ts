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
import { abilityLegalMoves } from '../../../lib/run/abilities';
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
  // This is the rook-can-fly principle: an open file from rank 2 is more
  // valuable than being on rank 7 of a blocked file.
  let openPathCount = 0;
  let rookieFileIsOpen = false;
  for (let f = 1; f <= 8; f++) {
    let clear = true;
    for (let r = state.rookie.rank + 1; r <= 7; r++) {
      if (state.pieces.some((p) => p.file === f && p.rank === r)) {
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

  // Tempo + abilities — latent power. Owning matters; "has uses" is small
  // so bots happily spend charges instead of hoarding them.
  score += (state.tempo / TEMPO_MAX) * 4;
  for (const a of state.abilities) {
    score += 3 + a.tier;
    if (a.usesLeftThisLevel > 0 || a.usesLeftThisLevel === -1) score += 0.5;
  }
  if (state.shieldUp) score += 6;
  if (state.bonusMovesLeft > 0) score += state.bonusMovesLeft * 5;

  // Material penalty by chess piece value — removing a queen is worth ~7
  // points to the bot instead of the prior 0.4 (any piece equal). Makes
  // Queenkiller / Detonate / Freeze attractive when they clear blockers.
  for (const p of state.pieces) score -= PIECE_VALUE[p.type] * 0.8;

  return score;
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
      if (state.form === 'rook') {
        out.push({ kind: 'activate-ability', abilityId: owned.id });
      }
      return out;
    case 'pawn-charge':
    case 'phase-step':
    case 'leap': {
      const legals = abilityLegalMoves(state, owned.id);
      for (const target of legals) {
        out.push({ kind: 'ability-target', abilityId: owned.id, target });
      }
      return out;
    }
    case 'freeze-ray': {
      // Target any enemy.
      for (const p of state.pieces) {
        if (state.frozenSquares.includes(toSquare({ file: p.file, rank: p.rank })))
          continue;
        out.push({
          kind: 'ability-target',
          abilityId: 'freeze-ray',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'detonate': {
      // Pick the highest-value square within reach (king-adjacency).
      for (const p of state.pieces) {
        out.push({
          kind: 'ability-target',
          abilityId: 'detonate',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'queenkiller': {
      // Only queens are legal targets — keeps the candidate set tight so the
      // eval search doesn't waste cycles on non-queens that the engine would
      // reject anyway.
      for (const p of state.pieces) {
        if (p.type !== 'queen') continue;
        out.push({
          kind: 'ability-target',
          abilityId: 'queenkiller',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    // -------------------------------------------------------------------------
    // Candidate batch — bot wiring. Instant abilities collapse to a single
    // activate-ability action. Targeted abilities enumerate every plausible
    // target so the bot's eval can pick the highest-impact cast.
    // -------------------------------------------------------------------------
    case 'rally':
    case 'quickstep':
    case 'smoke':
    case 'beeline':
    case 'mirror':
    case 'foresight':
    case 'bulwark':
    case 'skip':
    case 'decoy':
    case 'recall':
    case 'tide':
      out.push({ kind: 'activate-ability', abilityId: owned.id });
      return out;
    case 'bedrock': {
      // Target a hazard square — skip if no hazards exist.
      for (const h of state.hazards) {
        out.push({
          kind: 'ability-target',
          abilityId: 'bedrock',
          target: { file: h.file, rank: h.rank },
        });
      }
      // T5 wipes all hazards in one cast — bot just needs one candidate.
      if (out.length === 0 && state.hazards.length === 0) return out;
      return out;
    }
    case 'sinkhole': {
      // Target ANY square (empty or, on T4+, occupied). Limit the search to
      // ranks 2-7 because rank-1/rank-8 hazards rarely change outcomes and
      // explode the candidate count.
      const isT4Plus = owned.tier >= 4;
      for (let f = 1; f <= 8; f++) {
        for (let r = 2; r <= 7; r++) {
          if (f === state.rookie.file && r === state.rookie.rank) continue;
          if (state.hazards.some((h) => h.file === f && h.rank === r)) continue;
          const piece = state.pieces.some((p) => p.file === f && p.rank === r);
          if (piece && !isT4Plus) continue;
          out.push({
            kind: 'ability-target',
            abilityId: 'sinkhole',
            target: { file: f, rank: r },
          });
        }
      }
      return out;
    }
    case 'slayer': {
      // Only knights and bishops are valid targets.
      for (const p of state.pieces) {
        if (p.type !== 'knight' && p.type !== 'bishop') continue;
        out.push({
          kind: 'ability-target',
          abilityId: 'slayer',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'sapper': {
      // Target any pawn — the handler resolves which pawns get wiped based on
      // tier and target file.
      for (const p of state.pieces) {
        if (p.type !== 'pawn') continue;
        out.push({
          kind: 'ability-target',
          abilityId: 'sapper',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'bait': {
      // Pick one enemy to KEEP active — the rest get frozen.
      for (const p of state.pieces) {
        out.push({
          kind: 'ability-target',
          abilityId: 'bait',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'magnet':
    case 'pushback': {
      // Target any enemy; the handler walks it along the Rookie-axis.
      for (const p of state.pieces) {
        out.push({
          kind: 'ability-target',
          abilityId: owned.id,
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'mimic': {
      // Only knight/bishop/queen targets — pawns can't become a Rookie form.
      for (const p of state.pieces) {
        if (p.type === 'pawn') continue;
        out.push({
          kind: 'ability-target',
          abilityId: 'mimic',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'tempo-vault': {
      // Any piece is a legal trade.
      for (const p of state.pieces) {
        out.push({
          kind: 'ability-target',
          abilityId: 'tempo-vault',
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
