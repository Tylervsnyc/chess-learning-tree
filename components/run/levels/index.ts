/**
 * Rookie's Run — 10-level run.
 *
 * Each builder takes Rookie's starting coord (always rank 1, file 2..7 from
 * the daily seed) and returns a fully-formed RunPuzzle.
 *
 * Difficulty curve:
 *   L1  Pawn maze (tutorial)             — rook only
 *   L2  Denser pawn maze                  — rook only
 *   L3  Capture-required pawn wall        — rook only
 *   L4  Enemy knights + KNIGHT unlocks    — knight only
 *   L5  Tight board with knights          — knight only
 *   L6  Move-limit introduced (14)        — knight only
 *   L7  Enemy bishops + BISHOP unlocks    — knight + bishop
 *   L8  Hazard squares appear             — knight + bishop
 *   L9  Hazards + move-limit (16)         — knight + bishop
 *   L10 Boss queen + hazards + limit (18) — knight + bishop
 */

import { buildLevel1 } from './level-1';
import type {
  Coord,
  EnemyPiece,
  PieceType,
  RookieForm,
  RunPuzzle,
} from '@/lib/run/types';

function pawn(file: number, rank: number): EnemyPiece {
  return { type: 'pawn', color: 'black', file, rank };
}
function knight(file: number, rank: number): EnemyPiece {
  return { type: 'knight', color: 'black', file, rank };
}
function bishop(file: number, rank: number): EnemyPiece {
  return { type: 'bishop', color: 'black', file, rank };
}
function queen(file: number, rank: number): EnemyPiece {
  return { type: 'queen', color: 'black', file, rank };
}

function build(
  level: number,
  rookieStart: Coord,
  pieces: EnemyPiece[],
  opts: {
    hazards?: Coord[];
    moveLimit?: number;
    allowedForms?: RookieForm[];
    enemiesPerTurn?: number;
  } = {},
): RunPuzzle {
  return {
    level,
    rookieStart,
    pieces,
    hazards: opts.hazards,
    moveLimit: opts.moveLimit,
    allowedForms: opts.allowedForms,
    enemiesPerTurn: opts.enemiesPerTurn,
  };
}

// L2 — denser pawn maze. Adds a rank-4 stagger and rank-7 cap.
export function buildLevel2(rookieStart: Coord): RunPuzzle {
  return build(2, rookieStart, [
    // front wall rank 3
    pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
    // mid stagger rank 4
    pawn(2, 4), pawn(6, 4),
    // mid wall rank 5
    pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
    // back wall rank 6
    pawn(1, 6), pawn(3, 6), pawn(5, 6), pawn(7, 6),
    // rank-7 cap (two pawns)
    pawn(4, 7), pawn(5, 7),
  ]);
}

// L3 — full rank-5 wall (capture required) + sparse rank-7.
export function buildLevel3(rookieStart: Coord): RunPuzzle {
  return build(3, rookieStart, [
    // light front wall — easy to dodge
    pawn(2, 3), pawn(5, 3), pawn(7, 3),
    // FULL rank-5 wall — must capture at least one to pass
    pawn(1, 5), pawn(2, 5), pawn(3, 5), pawn(4, 5),
    pawn(5, 5), pawn(6, 5), pawn(7, 5), pawn(8, 5),
    // rank-7 sparse pickets
    pawn(2, 7), pawn(4, 7), pawn(6, 7),
  ]);
}

// L4 — KNIGHT unlocks. Two enemy knights guard the middle.
export function buildLevel4(rookieStart: Coord): RunPuzzle {
  return build(
    4,
    rookieStart,
    [
      pawn(1, 3), pawn(4, 3), pawn(7, 3),
      knight(3, 5), knight(6, 5),
      pawn(2, 6), pawn(5, 6), pawn(8, 6),
      pawn(4, 7),
    ],
    { allowedForms: ['knight'], enemiesPerTurn: 2 },
  );
}

// L5 — tight board, two knights, pawns hug Rookie.
export function buildLevel5(rookieStart: Coord): RunPuzzle {
  return build(
    5,
    rookieStart,
    [
      pawn(2, 3), pawn(4, 3), pawn(6, 3),
      pawn(3, 4), pawn(5, 4),
      knight(4, 5), knight(5, 6),
      pawn(1, 6), pawn(7, 6),
      pawn(3, 7), pawn(6, 7),
    ],
    { allowedForms: ['knight'], enemiesPerTurn: 2 },
  );
}

// L6 — move-limit (14). Open-ish board, but you can't dawdle.
export function buildLevel6(rookieStart: Coord): RunPuzzle {
  return build(
    6,
    rookieStart,
    [
      pawn(2, 3), pawn(5, 3), pawn(8, 3),
      knight(4, 4),
      pawn(1, 5), pawn(3, 5), pawn(6, 5), pawn(8, 5),
      pawn(2, 6), pawn(5, 6), pawn(7, 6),
      pawn(4, 7),
    ],
    { moveLimit: 14, allowedForms: ['knight'], enemiesPerTurn: 2 },
  );
}

// L7 — BISHOP unlocks. Enemy bishops control diagonals.
export function buildLevel7(rookieStart: Coord): RunPuzzle {
  return build(
    7,
    rookieStart,
    [
      pawn(1, 3), pawn(4, 3), pawn(7, 3),
      bishop(3, 5), bishop(6, 5),
      pawn(2, 6), pawn(5, 6), pawn(8, 6),
      pawn(4, 7), pawn(5, 7),
    ],
    { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
  );
}

// L8 — hazards appear. No-go squares carve a corridor.
export function buildLevel8(rookieStart: Coord): RunPuzzle {
  const hazards: Coord[] = [
    { file: 1, rank: 4 }, { file: 8, rank: 4 },
    { file: 3, rank: 4 }, { file: 6, rank: 4 },
    { file: 4, rank: 6 }, { file: 5, rank: 6 },
  ];
  return build(
    8,
    rookieStart,
    [
      pawn(2, 3), pawn(5, 3), pawn(7, 3),
      knight(4, 5), bishop(5, 5),
      pawn(2, 7), pawn(6, 7),
    ],
    { hazards, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
  );
}

// L9 — hazards + move-limit. Compound pressure.
export function buildLevel9(rookieStart: Coord): RunPuzzle {
  const hazards: Coord[] = [
    { file: 1, rank: 5 }, { file: 8, rank: 5 },
    { file: 3, rank: 6 }, { file: 6, rank: 6 },
    { file: 4, rank: 4 }, { file: 5, rank: 4 },
  ];
  return build(
    9,
    rookieStart,
    [
      pawn(2, 3), pawn(4, 3), pawn(6, 3),
      knight(3, 5), bishop(6, 5),
      pawn(2, 6), pawn(5, 6), pawn(7, 6),
      pawn(4, 7),
    ],
    { hazards, moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 },
  );
}

// L10 — BOSS. Queen hunts you, hazards + move-limit.
export function buildLevel10(rookieStart: Coord): RunPuzzle {
  const hazards: Coord[] = [
    { file: 1, rank: 4 }, { file: 8, rank: 4 },
    { file: 1, rank: 6 }, { file: 8, rank: 6 },
    { file: 4, rank: 5 }, { file: 5, rank: 5 },
  ];
  return build(
    10,
    rookieStart,
    [
      pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(7, 3),
      knight(3, 6), bishop(6, 6),
      queen(4, 8),
      pawn(2, 7), pawn(7, 7),
    ],
    { hazards, moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 },
  );
}

export type LevelBuilder = (rookieStart: Coord) => RunPuzzle;

export const LEVEL_BUILDERS: ReadonlyArray<LevelBuilder> = [
  buildLevel1,
  buildLevel2,
  buildLevel3,
  buildLevel4,
  buildLevel5,
  buildLevel6,
  buildLevel7,
  buildLevel8,
  buildLevel9,
  buildLevel10,
];

export const TOTAL_LEVELS = LEVEL_BUILDERS.length;

export function buildLevel(levelIndex: number, rookieStart: Coord): RunPuzzle {
  const builder = LEVEL_BUILDERS[levelIndex];
  if (!builder) throw new Error(`No level builder for index ${levelIndex}`);
  return builder(rookieStart);
}

export type { PieceType };
