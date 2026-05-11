/**
 * Run variants — themed sequences of levels.
 *
 * The original 10-level "Daily Climb" is run #1. The 5 new variants below
 * are shorter (5 levels each) focused challenges meant for fast playtesting.
 *
 * Players progress through the runs sequentially; on completing one, the
 * RunSummaryModal offers a "Next Run" button that advances the current
 * run id in localStorage and reloads with the next variant.
 */

import { LEVEL_BUILDERS as DAILY_LEVELS } from '@/components/run/levels';
import type { Coord, EnemyPiece, RookieForm, RunPuzzle } from './types';

export type LevelBuilder = (rookieStart: Coord) => RunPuzzle;

export interface RunDef {
  id: string;
  name: string;
  blurb: string;
  levels: ReadonlyArray<LevelBuilder>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact builders shared across themed runs.

const pawn = (file: number, rank: number): EnemyPiece => ({
  type: 'pawn',
  color: 'black',
  file,
  rank,
});
const knight = (file: number, rank: number): EnemyPiece => ({
  type: 'knight',
  color: 'black',
  file,
  rank,
});
const bishop = (file: number, rank: number): EnemyPiece => ({
  type: 'bishop',
  color: 'black',
  file,
  rank,
});
const queen = (file: number, rank: number): EnemyPiece => ({
  type: 'queen',
  color: 'black',
  file,
  rank,
});

function make(
  level: number,
  pieces: EnemyPiece[],
  opts: {
    hazards?: Coord[];
    moveLimit?: number;
    allowedForms?: RookieForm[];
    enemiesPerTurn?: number;
  } = {},
): LevelBuilder {
  return (rookieStart) => ({
    level,
    rookieStart,
    pieces: pieces.map((p) => ({ ...p })),
    hazards: opts.hazards?.map((h) => ({ ...h })),
    moveLimit: opts.moveLimit,
    allowedForms: opts.allowedForms,
    enemiesPerTurn: opts.enemiesPerTurn,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Run 1 — Daily Climb (the original 10-level run).

const RUN_DAILY: RunDef = {
  id: 'daily',
  name: 'Daily Climb',
  blurb: 'The original 10-level run. Rookie → Knight → Bishop → Boss Queen.',
  levels: DAILY_LEVELS,
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 2 — Knight Academy: knight transforms from level 1.

const RUN_KNIGHT_ACADEMY: RunDef = {
  id: 'knight-academy',
  name: "Knight's Academy",
  blurb: "Knight moves from level 1. Five levels of L-shaped chaos.",
  levels: [
    make(
      1,
      [pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3), pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5)],
      { allowedForms: ['knight'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5),
        pawn(2, 6), pawn(5, 6), pawn(7, 6),
      ],
      { allowedForms: ['knight'] },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(4, 6), pawn(8, 6),
        pawn(4, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3),
        knight(3, 4), knight(6, 4),
        pawn(1, 6), pawn(4, 6), pawn(7, 6),
        knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2, moveLimit: 14 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(3, 7), pawn(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2, moveLimit: 16 },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 3 — Bishop's Path: diagonals from level 1.

const RUN_BISHOPS_PATH: RunDef = {
  id: 'bishops-path',
  name: "Bishop's Path",
  blurb: 'Bishop moves unlocked from the start. Slide across the diagonals.',
  levels: [
    make(
      1,
      [pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(1, 5), pawn(4, 5), pawn(7, 5)],
      { allowedForms: ['bishop'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(4, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
      ],
      { allowedForms: ['bishop'] },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        bishop(3, 5), bishop(6, 5),
        pawn(4, 6), pawn(7, 6),
        pawn(5, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3),
        bishop(3, 4), bishop(6, 4),
        pawn(1, 6), pawn(5, 6), pawn(8, 6),
        bishop(4, 7),
      ],
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        bishop(3, 5), bishop(5, 5), bishop(7, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2, moveLimit: 16 },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 4 — Speed Demon: every level is a tight move limit.

const RUN_SPEED_DEMON: RunDef = {
  id: 'speed-demon',
  name: 'Speed Demon',
  blurb: "Tight move limits on every level. Don't waste a single step.",
  levels: [
    make(
      1,
      [pawn(2, 4), pawn(5, 4), pawn(7, 4), pawn(3, 6), pawn(6, 6)],
      { moveLimit: 9 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        pawn(2, 5), pawn(5, 5), pawn(8, 5),
        pawn(3, 7),
      ],
      { moveLimit: 11 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(4, 5), knight(6, 5),
        pawn(3, 6), pawn(7, 6),
      ],
      { allowedForms: ['knight'], moveLimit: 12, enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), knight(5, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 13, enemiesPerTurn: 2 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(4, 6), pawn(8, 6),
        queen(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 14, enemiesPerTurn: 2 },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 5 — Hazard Maze: no-go squares everywhere.

const RUN_HAZARD_MAZE: RunDef = {
  id: 'hazard-maze',
  name: 'Hazard Maze',
  blurb: 'Black squares cannot be touched. Thread the needle.',
  levels: [
    make(
      1,
      [pawn(2, 4), pawn(6, 4), pawn(3, 6), pawn(7, 6)],
      {
        hazards: [
          { file: 4, rank: 3 }, { file: 5, rank: 3 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        pawn(3, 5), pawn(6, 5),
        pawn(2, 7), pawn(7, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(4, 5),
        pawn(3, 6), pawn(6, 6),
        pawn(5, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight'],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), knight(6, 5),
        pawn(2, 7), pawn(5, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 3, rank: 6 }, { file: 6, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        queen(4, 8),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 7, rank: 4 },
          { file: 2, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 16,
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 6 — Boss Gauntlet: queens, big pieces, multiple enemies per turn.

const RUN_BOSS_GAUNTLET: RunDef = {
  id: 'boss-gauntlet',
  name: 'Boss Gauntlet',
  blurb: 'A queen on every floor. Bring the heavy artillery.',
  levels: [
    make(
      1,
      [pawn(2, 3), pawn(5, 3), pawn(7, 3), queen(4, 6)],
      { allowedForms: ['knight', 'bishop'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), queen(6, 6),
        pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 5), queen(6, 5),
        pawn(4, 6), pawn(7, 6),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(4, 7), queen(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
      },
    ),
    make(
      5,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), bishop(7, 6),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Public registry.

export const RUNS: ReadonlyArray<RunDef> = [
  RUN_DAILY,
  RUN_KNIGHT_ACADEMY,
  RUN_BISHOPS_PATH,
  RUN_SPEED_DEMON,
  RUN_HAZARD_MAZE,
  RUN_BOSS_GAUNTLET,
];

export const DEFAULT_RUN_ID = RUNS[0].id;

export function getRunById(id: string): RunDef {
  return RUNS.find((r) => r.id === id) ?? RUNS[0];
}

export function getRunIndex(id: string): number {
  const i = RUNS.findIndex((r) => r.id === id);
  return i < 0 ? 0 : i;
}

export function getNextRunId(id: string): string {
  const i = getRunIndex(id);
  return RUNS[(i + 1) % RUNS.length].id;
}
