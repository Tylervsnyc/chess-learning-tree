/**
 * Enemy AI for Rookie's Run.
 *
 * One enemy acts per turn — keeps the animation legible. Priority is global
 * across all enemies:
 *   1. Any piece that can capture Rookie this turn does so (tiebreak: piece
 *      value descending → leftmost → lowest).
 *   2. Otherwise the "most threatening" piece advances:
 *      - Pawns: lowest rank, leftmost (closest to rank 1).
 *      - Sliders/knights/queen: closest piece to Rookie steps toward her.
 *   3. If no one can act, the turn passes back to Rookie.
 *
 * Enemy pieces never step onto hazard squares either.
 */

import { enemyAt } from './movement';
import { toSquare } from './types';
import type { BoardState, Coord, EnemyPiece, PieceType } from './types';

const BLACK_FORWARD = -1;

const ROOK_DIRS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const BISHOP_DIRS: ReadonlyArray<[number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const QUEEN_DIRS: ReadonlyArray<[number, number]> = [...ROOK_DIRS, ...BISHOP_DIRS];
const KNIGHT_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

const PIECE_THREAT: Record<PieceType, number> = {
  queen: 4,
  bishop: 2,
  knight: 2,
  pawn: 1,
};

function inBounds(c: Coord): boolean {
  return c.file >= 1 && c.file <= 8 && c.rank >= 1 && c.rank <= 8;
}

function isHazard(hazards: Coord[], at: Coord): boolean {
  return hazards.some((h) => h.file === at.file && h.rank === at.rank);
}

/**
 * "Ghost blockers" — squares vacated by enemies earlier in this same turn.
 * Subsequent enemies treat them as still occupied so the player can plan
 * threats from the board they saw at the start of the turn (no piece can
 * slide through, jump onto, or advance into a square another enemy just left).
 */
function vacatedSet(state: BoardState): Set<string> {
  const out = new Set<string>();
  for (const sq of state.enemyVacatedSquares ?? []) {
    const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const rank = parseInt(sq[1], 10);
    out.add(`${file},${rank}`);
  }
  return out;
}

function isVacated(vacated: ReadonlySet<string>, at: Coord): boolean {
  return vacated.has(`${at.file},${at.rank}`);
}

/** All squares this piece could move to (or capture on) given the board. */
function pieceLegalMoves(piece: EnemyPiece, state: BoardState): Coord[] {
  const vacated = vacatedSet(state);
  switch (piece.type) {
    case 'pawn': {
      // Advances one rank (no two-square open; no captures from advancing).
      const target: Coord = { file: piece.file, rank: piece.rank + BLACK_FORWARD };
      const out: Coord[] = [];
      if (
        inBounds(target) &&
        !isHazard(state.hazards, target) &&
        !enemyAt(state.pieces, target) &&
        !isVacated(vacated, target) &&
        !(state.rookie.file === target.file && state.rookie.rank === target.rank)
      ) {
        out.push(target);
      }
      // Diagonal captures of Rookie.
      for (const df of [-1, 1]) {
        const cap: Coord = { file: piece.file + df, rank: piece.rank + BLACK_FORWARD };
        if (
          inBounds(cap) &&
          !isHazard(state.hazards, cap) &&
          state.rookie.file === cap.file &&
          state.rookie.rank === cap.rank
        ) {
          out.push(cap);
        }
      }
      return out;
    }
    case 'knight': {
      const out: Coord[] = [];
      for (const [df, dr] of KNIGHT_DELTAS) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + dr };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue; // ghost blocker
        const blocker = enemyAt(state.pieces, c);
        if (blocker && blocker !== piece) continue; // can't land on friendly
        out.push(c);
      }
      return out;
    }
    case 'bishop':
    case 'queen': {
      const dirs = piece.type === 'queen' ? QUEEN_DIRS : BISHOP_DIRS;
      return slidingMoves(piece, state, dirs, vacated);
    }
  }
}

function slidingMoves(
  piece: EnemyPiece,
  state: BoardState,
  dirs: ReadonlyArray<[number, number]>,
  vacated: ReadonlySet<string> = new Set(),
): Coord[] {
  const out: Coord[] = [];
  for (const [df, dr] of dirs) {
    let f = piece.file + df;
    let r = piece.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const c: Coord = { file: f, rank: r };
      if (isHazard(state.hazards, c)) break;
      if (isVacated(vacated, c)) break; // ghost blocker — stop before
      const blocker = enemyAt(state.pieces, c);
      const isRookie = state.rookie.file === f && state.rookie.rank === r;
      if (blocker && blocker !== piece) break; // friendly blocker — stop before
      if (isRookie) {
        out.push(c);
        break; // capture and stop
      }
      out.push(c);
      f += df;
      r += dr;
    }
  }
  return out;
}

function canCapture(piece: EnemyPiece, state: BoardState): boolean {
  return pieceLegalMoves(piece, state).some(
    (m) => m.file === state.rookie.file && m.rank === state.rookie.rank,
  );
}

function chebyshev(a: Coord, b: Coord): number {
  return Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));
}

/** Pick the single best move for `piece` that gets it closer to Rookie. */
function approachMove(piece: EnemyPiece, state: BoardState): Coord | null {
  const moves = pieceLegalMoves(piece, state);
  if (moves.length === 0) return null;
  const cur = chebyshev({ file: piece.file, rank: piece.rank }, state.rookie);
  let best: Coord | null = null;
  let bestDist = Infinity;
  for (const m of moves) {
    const d = chebyshev(m, state.rookie);
    if (d < bestDist || (d === bestDist && best && (m.file < best.file || (m.file === best.file && m.rank < best.rank)))) {
      bestDist = d;
      best = m;
    }
  }
  // Only move if it gets us strictly closer to Rookie.
  if (best && bestDist < cur) return best;
  return null;
}

function coordKey(c: { file: number; rank: number }): string {
  return `${c.file},${c.rank}`;
}

/** Pick the enemy that will act, and the move they'll make. */
function chooseEnemyAction(
  state: BoardState,
  excludeSquares: ReadonlySet<string> = new Set(),
): { mover: EnemyPiece; target: Coord; isCapture: boolean } | null {
  // Frozen squares are treated as if those pieces have already moved.
  const frozen = new Set(
    state.frozenSquares
      .map((sq) => {
        const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        const rank = parseInt(sq[1], 10);
        return `${file},${rank}`;
      }),
  );
  const isExcluded = (p: EnemyPiece) =>
    excludeSquares.has(coordKey(p)) || frozen.has(coordKey(p));
  // 1) Capture priority.
  const capturers = state.pieces
    .filter((p) => !isExcluded(p) && canCapture(p, state))
    .sort((a, b) => {
      const ta = PIECE_THREAT[a.type] ?? 0;
      const tb = PIECE_THREAT[b.type] ?? 0;
      if (ta !== tb) return tb - ta;
      if (a.file !== b.file) return a.file - b.file;
      return a.rank - b.rank;
    });
  if (capturers.length > 0) {
    return { mover: capturers[0], target: { ...state.rookie }, isCapture: true };
  }

  // 2) Movers: pawns advance toward rank 1; others approach Rookie.
  const vacated = vacatedSet(state);
  type Candidate = { mover: EnemyPiece; target: Coord; priority: number };
  const candidates: Candidate[] = [];
  for (const p of state.pieces) {
    if (isExcluded(p)) continue;
    if (p.type === 'pawn') {
      const target: Coord = { file: p.file, rank: p.rank + BLACK_FORWARD };
      if (
        inBounds(target) &&
        !isHazard(state.hazards, target) &&
        !enemyAt(state.pieces, target) &&
        !isVacated(vacated, target) &&
        !(state.rookie.file === target.file && state.rookie.rank === target.rank)
      ) {
        // Lower rank = higher priority (closer to rank 1 = bigger threat).
        candidates.push({ mover: p, target, priority: -p.rank });
      }
    } else {
      const target = approachMove(p, state);
      if (target) {
        // Closer to Rookie = higher priority (negative chebyshev).
        candidates.push({
          mover: p,
          target,
          priority: -chebyshev(target, state.rookie) + 0.5, // non-pawns slightly favored
        });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.mover.file !== b.mover.file) return a.mover.file - b.mover.file;
    return a.mover.rank - b.mover.rank;
  });
  return { mover: candidates[0].mover, target: candidates[0].target, isCapture: false };
}

/** Pawn promotion pool by level. Levels 1-4 → B/N, levels 5+ → B/N/Q. */
function promotionPool(level: number): PieceType[] {
  return level >= 5 ? ['bishop', 'knight', 'queen'] : ['bishop', 'knight'];
}

/** Apply a single chosen action to the state, returning the new state. */
function applyAction(
  state: BoardState,
  action: { mover: EnemyPiece; target: Coord; isCapture: boolean },
): BoardState {
  const { mover, target, isCapture } = action;
  const newPieces = state.pieces.map((p) => {
    if (p !== mover) return { ...p };
    const moved: EnemyPiece = { ...p, file: target.file, rank: target.rank };
    // Pawn promotion: reaches Rookie's home rank.
    if (moved.type === 'pawn' && target.rank === 1) {
      const pool = promotionPool(state.level);
      moved.type = pool[Math.floor(Math.random() * pool.length)];
    }
    return moved;
  });
  if (isCapture) {
    return { ...state, pieces: newPieces, status: 'lost' };
  }
  return { ...state, pieces: newPieces };
}

/**
 * Advance the enemy turn by ONE piece. Returns the new state.
 *
 * - If no piece can act, or the budget is spent, sets turn back to 'rookie'
 *   and clears enemyMovedSquares.
 * - If a capture happens, sets status='lost' and turn='rookie'.
 * - Otherwise leaves turn='enemy' so the caller can step again.
 */
export function stepEnemyTurn(state: BoardState): BoardState {
  if (state.status !== 'playing' || state.turn !== 'enemy') return state;
  const budget = Math.max(1, state.enemiesPerTurn ?? 1);
  const exclude = new Set(state.enemyMovedSquares);

  const endTurn = (s: BoardState): BoardState => {
    // Decrement freeze counters; drop entries that have run out.
    const nextFrozenTurnsLeft: Record<string, number> = {};
    const nextFrozenSquares: string[] = [];
    for (const sq of s.frozenSquares) {
      const left = (s.frozenTurnsLeft[sq] ?? 1) - 1;
      if (left > 0) {
        nextFrozenSquares.push(sq);
        nextFrozenTurnsLeft[sq] = left;
      }
    }
    return {
      ...s,
      turn: 'rookie',
      enemyMovedSquares: [],
      enemyVacatedSquares: [],
      frozenSquares: nextFrozenSquares,
      frozenTurnsLeft: nextFrozenTurnsLeft,
    };
  };

  if (state.enemyMovedSquares.length >= budget) return endTurn(state);

  const action = chooseEnemyAction(state, exclude);
  if (!action) return endTurn(state);

  const originSquare = toSquare({ file: action.mover.file, rank: action.mover.rank });
  const after = applyAction(state, action);
  if (after.status === 'lost') return endTurn(after);

  const nextMoved = [...state.enemyMovedSquares, coordKey(action.target)];
  const nextVacated = [...(state.enemyVacatedSquares ?? []), originSquare];
  if (nextMoved.length >= budget) return endTurn(after);
  return {
    ...after,
    turn: 'enemy',
    enemyMovedSquares: nextMoved,
    enemyVacatedSquares: nextVacated,
  };
}

/**
 * Back-compat: bulk-run the entire enemy turn (used by tests or one-shot).
 * Prefer `stepEnemyTurn` from the UI so each move animates.
 */
export function runEnemyTurn(state: BoardState): BoardState {
  let cur = state;
  // Safety: cap at enemiesPerTurn iterations.
  const cap = Math.max(1, state.enemiesPerTurn ?? 1);
  for (let i = 0; i <= cap; i++) {
    if (cur.turn !== 'enemy' || cur.status !== 'playing') break;
    cur = stepEnemyTurn(cur);
  }
  return cur;
}

export { enemyAt };

/**
 * Returns the enemies that will act on the NEXT enemy turn (up to budget),
 * in order. Used to telegraph threats with a wiggle.
 */
export function nextEnemyMovers(state: BoardState): EnemyPiece[] {
  const budget = Math.max(1, state.enemiesPerTurn ?? 1);
  const remaining = budget - state.enemyMovedSquares.length;
  if (remaining <= 0) return [];

  let cur: BoardState = { ...state, turn: 'enemy' };
  const movers: EnemyPiece[] = [];

  for (let i = 0; i < remaining; i++) {
    const exclude = new Set(cur.enemyMovedSquares);
    const action = chooseEnemyAction(cur, exclude);
    if (!action) break;
    movers.push(action.mover);
    const originSquare = toSquare({ file: action.mover.file, rank: action.mover.rank });
    const after = applyAction(cur, action);
    if (after.status === 'lost') break;
    cur = {
      ...after,
      enemyMovedSquares: [...cur.enemyMovedSquares, coordKey(action.target)],
      enemyVacatedSquares: [...(cur.enemyVacatedSquares ?? []), originSquare],
    };
  }
  return movers;
}

/** Back-compat single-mover (returns first upcoming mover or null). */
export function nextEnemyMover(state: BoardState): EnemyPiece | null {
  return nextEnemyMovers(state)[0] ?? null;
}
