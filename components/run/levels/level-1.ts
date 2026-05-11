/**
 * Rookie's Run — Level 1.
 *
 * A pawn maze Rookie must navigate from rank 1 to rank 8.
 * Sprint 1 design goals:
 *   - Dense enough that a one-move win is IMPOSSIBLE from any starting file
 *     b–g (i.e. every column has at least one pawn between rank 2 and 7).
 *   - Several valid paths so the puzzle has interest.
 *   - Far enough away from rank 1 that Rookie isn't immediately threatened
 *     by a diagonal capture on turn 1.
 */

import type { Coord, EnemyPiece, RunPuzzle } from '@/lib/run/types';

/**
 * Pawn layout — a "broken wall" pattern.
 *
 *   8 . . . . . . . .
 *   7 . . . . . . . .
 *   6 P . P . P . P .   ← back wall (rank 6)
 *   5 . P . P . P . P   ← mid wall (rank 5)
 *   4 . . . . . . . .
 *   3 P . P . P . P .   ← front wall (rank 3)
 *   2 . . . . . . . .
 *   1 . . . R . . . .   ← Rookie spawns here (file varies by seed)
 *     a b c d e f g h
 *
 * Every file a–h has at least one pawn between rank 3 and 6 → no
 * straight-shot win from rank 1 in a single move. Plenty of side-step
 * options because the front wall (rank 3) is sparse.
 */
const LEVEL_1_PAWNS: ReadonlyArray<{ file: number; rank: number }> = [
  // Front wall — rank 3, files a/c/e/g (1,3,5,7)
  { file: 1, rank: 3 },
  { file: 3, rank: 3 },
  { file: 5, rank: 3 },
  { file: 7, rank: 3 },
  // Mid wall — rank 5, files b/d/f/h (2,4,6,8)
  { file: 2, rank: 5 },
  { file: 4, rank: 5 },
  { file: 6, rank: 5 },
  { file: 8, rank: 5 },
  // Back wall — rank 6, files a/c/e/g (1,3,5,7)
  { file: 1, rank: 6 },
  { file: 3, rank: 6 },
  { file: 5, rank: 6 },
  { file: 7, rank: 6 },
];

function pawnsForLevel1(): EnemyPiece[] {
  return LEVEL_1_PAWNS.map((p) => ({
    type: 'pawn',
    color: 'black',
    file: p.file,
    rank: p.rank,
  }));
}

/** Build Level 1 with Rookie at the given starting square. */
export function buildLevel1(rookieStart: Coord): RunPuzzle {
  return {
    level: 1,
    rookieStart,
    pieces: pawnsForLevel1(),
  };
}
