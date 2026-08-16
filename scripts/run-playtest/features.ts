/**
 * Extract a numeric feature vector for each level. These features are
 * candidate explanatory variables for win-rate regression.
 *
 * Definitions:
 *   - pieceCount:        total enemy pieces
 *   - pawnCount, knightCount, bishopCount, queenCount: per-type counts
 *   - density:           pieceCount / 56 (squares Rookie can theoretically traverse, ranks 2-8)
 *   - openFiles:         files with NO enemy pawn on ranks 2-7 (the "Iron Curtain" inverse)
 *   - defendedPieces:    enemies whose square is attacked by at least one other enemy
 *   - pawnChainLen:      longest diagonal pawn chain (each pawn defends the next)
 *   - hazardCount:       puzzle.hazards length
 *   - hazardsInApproach: hazards in ranks 2-7
 *   - moveLimit:         puzzle.moveLimit ?? Infinity (we cap at 30 for stat purposes)
 *   - moveLimitTightness: moveLimit / minLegalDistance (how tight the budget feels)
 *   - enemiesPerTurn:    puzzle.enemiesPerTurn ?? 1
 *   - allowedFormsCount: number of forms (1 = rook only, 2 = +knight or +bishop, etc.)
 *   - threatDensity:     unique squares attacked by enemies in starting position
 *   - approachWidth:     files in {start.file - 2 .. start.file + 2} where rookie can advance one rank without being captured
 *   - chokePointCount:   ranks (between start.rank and 8) where ≤ 1 safe file is reachable
 *   - minLegalDistance:  rough estimate of shortest-path distance to rank 8 (BFS over rook moves only)
 */

import type { RunPuzzle } from '../../lib/run/types';
import type { EnemyPiece, Coord } from '../../lib/run/types';
import { toSquare } from '../../lib/run/types';

export interface LevelFeatures {
  levelId: string;
  runId: string;
  levelIndex: number;
  level: number;
  pieceCount: number;
  pawnCount: number;
  knightCount: number;
  bishopCount: number;
  queenCount: number;
  density: number;
  openFiles: number;
  defendedPieces: number;
  pawnChainLen: number;
  hazardCount: number;
  hazardsInApproach: number;
  moveLimit: number;            // 30 if null
  moveLimitTightness: number;   // 99 if null
  enemiesPerTurn: number;
  allowedFormsCount: number;
  threatDensity: number;
  approachWidth: number;
  chokePointCount: number;
  minLegalDistance: number;
}

export function extractFeatures(
  levelId: string,
  runId: string,
  levelIndex: number,
  puzzle: RunPuzzle,
): LevelFeatures {
  const pieceCount = puzzle.pieces.length;
  const pawnCount = puzzle.pieces.filter((p) => p.type === 'pawn').length;
  const knightCount = puzzle.pieces.filter((p) => p.type === 'knight').length;
  const bishopCount = puzzle.pieces.filter((p) => p.type === 'bishop').length;
  const queenCount = puzzle.pieces.filter((p) => p.type === 'queen').length;
  const density = pieceCount / 56;

  // openFiles — files (1..8) with no enemy pawn on ranks 2..7.
  let openFiles = 0;
  for (let f = 1; f <= 8; f++) {
    let blocked = false;
    for (const p of puzzle.pieces) {
      if (p.type === 'pawn' && p.file === f && p.rank >= 2 && p.rank <= 7) {
        blocked = true;
        break;
      }
    }
    if (!blocked) openFiles++;
  }

  // defendedPieces — enemy occupies a square attacked by another enemy.
  const allAttacks = attackedSquaresFor(puzzle.pieces);
  let defendedPieces = 0;
  for (const p of puzzle.pieces) {
    const sq = toSquare({ file: p.file, rank: p.rank });
    // an enemy's own square should be checked against attacks NOT counting itself
    const without = allAttacks.get(sq) ?? new Set<EnemyPiece>();
    if ([...without].some((a) => a !== p)) defendedPieces++;
  }

  // pawnChainLen — longest defended diagonal pawn chain.
  const pawnChainLen = longestPawnChain(puzzle.pieces);

  const hazardCount = puzzle.hazards?.length ?? 0;
  const hazardsInApproach =
    puzzle.hazards?.filter((h) => h.rank >= 2 && h.rank <= 7).length ?? 0;

  const moveLimit = puzzle.moveLimit ?? 30;
  const minLegalDistance = roughDistanceToRank8(puzzle);
  const moveLimitTightness =
    puzzle.moveLimit !== undefined && minLegalDistance > 0
      ? puzzle.moveLimit / minLegalDistance
      : 99;

  const enemiesPerTurn = puzzle.enemiesPerTurn ?? 1;
  const allowedFormsCount = puzzle.allowedForms?.length ?? 1;

  // threatDensity — unique squares attacked by enemies.
  const allAttackedSquares = new Set<string>();
  for (const set of allAttacks.values()) {
    if (set.size > 0) allAttackedSquares.add(setKey(set));
  }
  // The above is wrong — we want unique squares. Rebuild correctly:
  const threatDensity = uniqueAttackedSquares(puzzle.pieces).size;

  const approachWidth = countApproachWidth(puzzle);
  const chokePointCount = countChokePoints(puzzle);

  return {
    levelId,
    runId,
    levelIndex,
    level: puzzle.level,
    pieceCount,
    pawnCount,
    knightCount,
    bishopCount,
    queenCount,
    density,
    openFiles,
    defendedPieces,
    pawnChainLen,
    hazardCount,
    hazardsInApproach,
    moveLimit,
    moveLimitTightness,
    enemiesPerTurn,
    allowedFormsCount,
    threatDensity,
    approachWidth,
    chokePointCount,
    minLegalDistance,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers.

function attackedSquaresFor(
  pieces: EnemyPiece[],
): Map<string, Set<EnemyPiece>> {
  const out = new Map<string, Set<EnemyPiece>>();
  const add = (sq: string, p: EnemyPiece): void => {
    const cur = out.get(sq) ?? new Set<EnemyPiece>();
    cur.add(p);
    out.set(sq, cur);
  };
  for (const p of pieces) {
    for (const sq of attackedByPiece(p, pieces)) add(sq, p);
  }
  return out;
}

function uniqueAttackedSquares(pieces: EnemyPiece[]): Set<string> {
  const out = new Set<string>();
  for (const p of pieces) {
    for (const sq of attackedByPiece(p, pieces)) out.add(sq);
  }
  return out;
}

function attackedByPiece(p: EnemyPiece, all: EnemyPiece[]): string[] {
  const out: string[] = [];
  const inBounds = (f: number, r: number): boolean =>
    f >= 1 && f <= 8 && r >= 1 && r <= 8;
  const blocked = (f: number, r: number): boolean =>
    all.some((q) => q !== p && q.file === f && q.rank === r);
  switch (p.type) {
    case 'pawn':
      for (const df of [-1, 1]) {
        const f = p.file + df;
        const r = p.rank - 1; // black pawn attacks toward rank 1
        if (inBounds(f, r)) out.push(toSquare({ file: f, rank: r }));
      }
      return out;
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
        const f = p.file + df;
        const r = p.rank + dr;
        if (inBounds(f, r)) out.push(toSquare({ file: f, rank: r }));
      }
      return out;
    case 'bishop':
      slide(p, out, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      return out;
    case 'queen':
      slide(p, out, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      return out;
  }
  function slide(
    pp: EnemyPiece,
    sink: string[],
    dirs: ReadonlyArray<readonly [number, number]>,
  ): void {
    for (const [df, dr] of dirs) {
      let f = pp.file + df;
      let r = pp.rank + dr;
      while (inBounds(f, r)) {
        sink.push(toSquare({ file: f, rank: r }));
        if (blocked(f, r)) break;
        f += df;
        r += dr;
      }
    }
  }
}

function longestPawnChain(pieces: EnemyPiece[]): number {
  // A pawn chain: a black pawn defends a pawn on the diagonal toward rank 1.
  // Equivalently: pawn at (f, r) defends (f±1, r-1). Find longest connected
  // chain through the "defends" relation.
  const pawns = pieces.filter((p) => p.type === 'pawn');
  if (pawns.length === 0) return 0;
  const has = (f: number, r: number): boolean =>
    pawns.some((p) => p.file === f && p.rank === r);
  let best = 1;
  for (const p of pawns) {
    // count chain extending forward (away from rank 1).
    let len = 1;
    let cur = p;
    while (true) {
      let nextPawn: EnemyPiece | null = null;
      for (const df of [-1, 1]) {
        const f = cur.file + df;
        const r = cur.rank + 1;
        if (has(f, r)) {
          nextPawn = { type: 'pawn', color: 'black', file: f, rank: r };
          break;
        }
      }
      if (!nextPawn) break;
      len++;
      cur = nextPawn;
      if (len > 8) break; // safety
    }
    if (len > best) best = len;
  }
  return best;
}

function roughDistanceToRank8(puzzle: RunPuzzle): number {
  // Conservative BFS over rook-style moves, ignoring captures (assume rookie
  // must slide to empty squares). Used as a rough lower bound; if BFS finds
  // no path, return 8 - rookieStart.rank as a fallback.
  const start = puzzle.rookieStart;
  const occupied = new Set<string>(
    puzzle.pieces.map((p) => toSquare({ file: p.file, rank: p.rank })),
  );
  const hazards = new Set<string>(
    (puzzle.hazards ?? []).map((h) => toSquare(h)),
  );
  const visited = new Set<string>([toSquare(start)]);
  let frontier: Coord[] = [start];
  let dist = 0;
  while (frontier.length > 0 && dist < 64) {
    const next: Coord[] = [];
    for (const cur of frontier) {
      if (cur.rank === 8) return dist;
      for (const [df, dr] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        let f = cur.file + df;
        let r = cur.rank + dr;
        while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
          const sq = toSquare({ file: f, rank: r });
          if (hazards.has(sq)) break;
          if (occupied.has(sq)) {
            // can capture by landing — treat as reachable
            if (!visited.has(sq)) {
              visited.add(sq);
              next.push({ file: f, rank: r });
            }
            break;
          }
          if (!visited.has(sq)) {
            visited.add(sq);
            next.push({ file: f, rank: r });
          }
          f += df;
          r += dr;
        }
      }
    }
    frontier = next;
    dist++;
  }
  return Math.max(8 - start.rank, 1);
}

function countApproachWidth(puzzle: RunPuzzle): number {
  // From rookie's start file, count adjacent files (within ±2) where the next
  // rank up is reachable without being attacked.
  const start = puzzle.rookieStart;
  const attacks = uniqueAttackedSquares(puzzle.pieces);
  const hazards = new Set<string>(
    (puzzle.hazards ?? []).map((h) => toSquare(h)),
  );
  let safe = 0;
  for (let df = -2; df <= 2; df++) {
    const f = start.file + df;
    const r = start.rank + 1;
    if (f < 1 || f > 8 || r > 8) continue;
    const sq = toSquare({ file: f, rank: r });
    if (hazards.has(sq)) continue;
    if (attacks.has(sq)) continue;
    safe++;
  }
  return safe;
}

function countChokePoints(puzzle: RunPuzzle): number {
  const start = puzzle.rookieStart;
  const attacks = uniqueAttackedSquares(puzzle.pieces);
  const hazards = new Set<string>(
    (puzzle.hazards ?? []).map((h) => toSquare(h)),
  );
  let chokes = 0;
  for (let r = start.rank + 1; r <= 8; r++) {
    let safeFiles = 0;
    for (let f = 1; f <= 8; f++) {
      const sq = toSquare({ file: f, rank: r });
      if (hazards.has(sq)) continue;
      if (attacks.has(sq)) continue;
      safeFiles++;
    }
    if (safeFiles <= 1) chokes++;
  }
  return chokes;
}

function setKey(s: Set<EnemyPiece>): string {
  // Stable identity for a set of pieces — used only to dedupe internally.
  return [...s].map((p) => `${p.file}-${p.rank}-${p.type}`).sort().join('|');
}
