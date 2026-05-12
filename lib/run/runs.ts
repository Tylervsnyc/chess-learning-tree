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

import { DAILY_LEVELS } from './daily-levels';
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
  blurb: "Knight moves from level 1. Ten levels of L-shaped chaos.",
  levels: [
    make(
      1,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(1, 6), pawn(3, 6), pawn(5, 6), pawn(7, 6),
        knight(4, 7),
      ],
      { allowedForms: ['knight'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(7, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(2, 6), pawn(4, 6), pawn(8, 6),
        knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
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
      { allowedForms: ['knight'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 5), knight(5, 5), knight(7, 5),
        pawn(4, 6), pawn(8, 6),
        pawn(3, 7), pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 6), knight(5, 6), knight(8, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        knight(2, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 6), bishop(5, 6), knight(8, 6),
        knight(4, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(2, 4), knight(5, 4), knight(8, 4),
        knight(3, 6), knight(6, 6),
        queen(4, 8), knight(5, 7), knight(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 4, rank: 5 },
          { file: 5, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 7 }, { file: 8, rank: 7 },
        ],
      },
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
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 5), pawn(4, 5), pawn(7, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(5, 7),
      ],
      { allowedForms: ['bishop'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(7, 3),
        bishop(4, 5), bishop(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        pawn(4, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        bishop(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(4, 6), pawn(7, 6),
        bishop(5, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
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
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2, moveLimit: 14 },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(3, 5), bishop(6, 5),
        knight(2, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        bishop(4, 7), bishop(6, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 4), knight(6, 4),
        bishop(2, 6), bishop(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        bishop(3, 5), knight(5, 5), bishop(7, 5),
        bishop(2, 6), bishop(6, 6),
        bishop(4, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3),
        bishop(3, 4), bishop(6, 4),
        knight(2, 6), bishop(5, 6), knight(8, 6),
        queen(4, 8), bishop(6, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 4, rank: 5 },
          { file: 5, rank: 5 }, { file: 8, rank: 5 },
        ],
      },
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
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        pawn(1, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(3, 7), pawn(6, 7),
      ],
      { moveLimit: 9 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(7, 3),
        pawn(2, 5), pawn(5, 5), pawn(8, 5),
        knight(4, 6), pawn(7, 6),
        pawn(3, 7),
      ],
      { allowedForms: ['knight'], moveLimit: 10, enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(4, 5), knight(6, 5),
        pawn(3, 6), pawn(7, 6),
        bishop(5, 7), pawn(2, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 11, enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), knight(5, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 11, enemiesPerTurn: 2 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(4, 6), pawn(8, 6),
        knight(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 11, enemiesPerTurn: 2 },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        pawn(4, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 12,
        enemiesPerTurn: 2,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 4), knight(6, 4),
        knight(2, 6), bishop(7, 6),
        pawn(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 12,
        enemiesPerTurn: 3,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(4, 5), bishop(5, 5),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 13,
        enemiesPerTurn: 3,
        hazards: [
          { file: 4, rank: 4 }, { file: 5, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3),
        knight(3, 5), bishop(6, 5),
        knight(2, 6), bishop(7, 6),
        queen(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 13,
        enemiesPerTurn: 3,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), bishop(7, 6),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 14,
        enemiesPerTurn: 3,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 4, rank: 7 }, { file: 5, rank: 7 },
        ],
      },
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
      [
        pawn(2, 3), pawn(6, 3),
        pawn(2, 4), pawn(6, 4),
        pawn(3, 6), pawn(7, 6),
        pawn(4, 7), pawn(5, 7),
      ],
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
        knight(4, 6), pawn(8, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
        allowedForms: ['knight'],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(5, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), knight(6, 5),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
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
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(7, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        knight(2, 6), bishop(7, 6),
        pawn(4, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 2, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 3, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        knight(2, 6), bishop(5, 6), knight(8, 6),
        queen(4, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 7 }, { file: 7, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 5), bishop(5, 5), knight(7, 5),
        bishop(3, 7), bishop(6, 7),
        queen(5, 6),
      ],
      {
        hazards: [
          { file: 4, rank: 4 }, { file: 5, rank: 4 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), bishop(7, 6),
        queen(4, 8), queen(5, 8),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
          { file: 3, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
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
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(4, 5), bishop(6, 5),
        queen(4, 6), pawn(7, 6),
        pawn(3, 7), pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), queen(6, 6),
        pawn(4, 7), pawn(7, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 5), knight(6, 5),
        queen(5, 6), pawn(7, 6),
        pawn(2, 7), pawn(6, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2, moveLimit: 16 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(4, 7), pawn(2, 7), pawn(7, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(4, 7), queen(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 16,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        queen(5, 6),
        bishop(2, 7), knight(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(2, 6), queen(7, 6),
        bishop(4, 7), knight(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 4 }, { file: 5, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        bishop(3, 4), knight(6, 4),
        queen(4, 6), queen(7, 6),
        knight(2, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 6 }, { file: 6, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(2, 6), queen(5, 6), queen(8, 6),
        bishop(4, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), queen(5, 6), bishop(7, 6),
        queen(3, 8), queen(4, 8), queen(5, 8), queen(6, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 20,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 7 }, { file: 8, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 7 — Iron Curtain: layered pawn fortresses, knight from L1.
//
// Difficulty knobs vs. existing runs:
//   - More pieces per level (14→19, vs ~10→14 in older runs).
//   - 3 enemies/turn by L3, 4/turn on L9-L10.
//   - Defended pawn chains: capturing one pawn drops you into another's attack.

const RUN_IRON_CURTAIN: RunDef = {
  id: 'iron-curtain',
  name: 'Iron Curtain',
  blurb: 'Layered pawn walls. Every gap is a trap.',
  levels: [
    make(
      1,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        knight(4, 7), knight(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(3, 6), knight(6, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(4, 6), knight(5, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
        bishop(3, 7),
      ],
      {
        allowedForms: ['knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        pawn(1, 4), pawn(3, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), bishop(6, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
        bishop(4, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        pawn(2, 7), pawn(4, 7), pawn(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 6), knight(5, 6), bishop(7, 6),
        pawn(2, 7), pawn(4, 7), pawn(6, 7),
        bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 6), bishop(6, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
        knight(4, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(2, 6), knight(5, 6), bishop(7, 6),
        knight(3, 7), bishop(5, 7), knight(6, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(2, 6), bishop(4, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 7 }, { file: 7, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 8 — Crossfire: bishops placed so long diagonals already cross Rookie's
// path. Many squares are "covered without anyone needing to move."

const RUN_CROSSFIRE: RunDef = {
  id: 'crossfire',
  name: 'Crossfire',
  blurb: "Bishops on every long diagonal. Stay off the X.",
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 5), bishop(8, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(3, 7), bishop(6, 7),
        pawn(4, 7), pawn(5, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(2, 5), bishop(7, 5),
        pawn(4, 6), pawn(6, 6),
        bishop(3, 7), bishop(5, 7), bishop(6, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        bishop(1, 4), bishop(8, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(2, 7), bishop(4, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        bishop(2, 4), bishop(7, 4),
        knight(4, 5), knight(5, 5),
        bishop(3, 7), bishop(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 5), bishop(8, 5),
        bishop(3, 6), bishop(6, 6),
        bishop(2, 7), bishop(5, 7), bishop(7, 7),
        knight(4, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(2, 4), bishop(7, 4),
        knight(4, 5), knight(5, 5),
        bishop(3, 6), bishop(6, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(1, 4), bishop(4, 4), bishop(5, 4), bishop(8, 4),
        knight(3, 6), knight(6, 6),
        bishop(2, 7), bishop(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(2, 4), bishop(7, 4),
        bishop(1, 5), bishop(8, 5),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        bishop(4, 7), bishop(6, 7),
        queen(5, 8),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 4), bishop(8, 4),
        bishop(3, 5), bishop(6, 5),
        bishop(2, 6), bishop(7, 6),
        bishop(3, 7), knight(5, 7), bishop(6, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        bishop(2, 4), bishop(7, 4),
        bishop(1, 5), bishop(8, 5),
        bishop(3, 6), bishop(6, 6),
        knight(4, 7), knight(5, 7),
        queen(3, 8), queen(6, 8),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 7 }, { file: 5, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 9 — Hornet's Nest: knights placed at fork distance from rookie's likely
// landing squares. Every step lands within an L of something.

const RUN_HORNETS_NEST: RunDef = {
  id: 'hornets-nest',
  name: "Hornet's Nest",
  blurb: 'Every square is forked by a knight. Move like you mean it.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 5), knight(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        knight(4, 7), knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        knight(2, 5), knight(4, 5), knight(7, 5),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), knight(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 6), knight(5, 6), knight(8, 6),
        pawn(4, 7), pawn(5, 7),
      ],
      {
        allowedForms: ['knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        pawn(2, 6), pawn(6, 6),
        knight(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 4), knight(5, 4), knight(8, 4),
        knight(3, 6), knight(6, 6),
        pawn(4, 7), pawn(5, 7),
        bishop(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 5), knight(7, 5),
        knight(3, 6), knight(6, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 4), knight(4, 4), knight(5, 4), knight(6, 4),
        pawn(2, 6), pawn(7, 6),
        knight(3, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 5), knight(4, 5), knight(5, 5), knight(7, 5),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), knight(5, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), knight(5, 4), knight(7, 4),
        knight(2, 6), knight(5, 6), knight(8, 6),
        bishop(3, 7), bishop(6, 7),
        queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        knight(2, 4), knight(4, 4), knight(5, 4), knight(7, 4),
        knight(3, 6), knight(6, 6),
        bishop(2, 7), knight(4, 7), knight(5, 7), bishop(7, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 10 — Royal Court: queens behind pawn shields. Take the pawn → queen
// recaptures. Forces patient setup over greedy grabs.

const RUN_ROYAL_COURT: RunDef = {
  id: 'royal-court',
  name: 'Royal Court',
  blurb: 'Queens behind every pawn. Greedy grabs end in tears.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        queen(2, 4), queen(8, 4),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        queen(3, 4), queen(7, 4),
        pawn(4, 6), pawn(6, 6),
        knight(3, 7), bishop(5, 7), knight(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        queen(4, 4), queen(5, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(3, 7), knight(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        queen(2, 4), queen(7, 4),
        knight(4, 5), bishop(5, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        queen(2, 4), queen(5, 4), queen(8, 4),
        knight(3, 6), bishop(6, 6),
        pawn(4, 7), pawn(5, 7),
        bishop(3, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        queen(3, 4), queen(6, 4),
        knight(2, 5), bishop(7, 5),
        pawn(4, 6), pawn(5, 6),
        bishop(4, 7), knight(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        queen(2, 4), queen(4, 4), queen(6, 4), queen(8, 4),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 16,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        queen(1, 4), queen(4, 4), queen(5, 4), queen(8, 4),
        knight(3, 6), bishop(6, 6),
        bishop(2, 7), knight(4, 7), knight(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        queen(2, 4), queen(4, 4), queen(5, 4), queen(7, 4),
        bishop(3, 6), knight(6, 6),
        bishop(3, 7), knight(5, 7), bishop(6, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(8, 3),
        queen(3, 4), queen(4, 4), queen(5, 4), queen(6, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 22,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 11 — The Gauntlet: every difficulty knob turned up. Mixed pieces,
// 4 enemies/turn from L4, queen barricade finale. The hardest run.

const RUN_GAUNTLET: RunDef = {
  id: 'the-gauntlet',
  name: 'The Gauntlet',
  blurb: 'Everything at once. Four enemies move every turn. Good luck.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(7, 6),
        bishop(4, 7), knight(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        bishop(2, 4), knight(7, 4),
        knight(4, 5), bishop(5, 5),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 4), knight(4, 4), knight(5, 4), bishop(8, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), bishop(5, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        bishop(2, 4), knight(3, 4), knight(6, 4), bishop(7, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), bishop(5, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 16,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        bishop(2, 5), knight(7, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), knight(5, 7),
        queen(3, 8), queen(6, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 4), bishop(4, 4), bishop(5, 4), knight(7, 4),
        knight(3, 6), bishop(6, 6),
        bishop(4, 7), knight(5, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 4), knight(6, 4),
        bishop(2, 5), bishop(7, 5),
        knight(4, 6), bishop(5, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(2, 4), knight(4, 4), knight(5, 4), bishop(7, 4),
        knight(3, 6), bishop(6, 6),
        bishop(2, 7), knight(4, 7), knight(5, 7), bishop(7, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        bishop(1, 4), knight(3, 4), knight(6, 4), bishop(8, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), bishop(6, 7),
        queen(3, 8), queen(4, 8), queen(5, 8), queen(6, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(8, 3),
        bishop(2, 4), knight(4, 4), knight(5, 4), bishop(7, 4),
        knight(2, 6), bishop(4, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(4, 7), knight(5, 7), bishop(6, 7),
        queen(2, 8), queen(4, 8), queen(5, 8), queen(7, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 24,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 4, rank: 7 }, { file: 5, rank: 7 },
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
  RUN_IRON_CURTAIN,
  RUN_CROSSFIRE,
  RUN_HORNETS_NEST,
  RUN_ROYAL_COURT,
  RUN_GAUNTLET,
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
