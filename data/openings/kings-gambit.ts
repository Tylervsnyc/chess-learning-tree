// King's Gambit Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.e4 e5 2.f4 exf4 3.Nf3 g5 4.h4 g4 5.Ne5 Nf6 6.d4 Nc6 7.Bc4
//            Ne7 8.Be2 Ng6 9.Bxf4 Bxf4 10.Bxg4
//
// 3 White moves per lesson.
//
// GRID LAYOUT (10 lessons):
//   Row 4:                              kg-test-1 (col 0)
//   Row 3:   kg-4 (col 0)              kg-cunningham-1 (col 1)
//   Row 2:   kg-punish-g5 (col -1)     kg-3 (col 0)
//   Row 1:   kg-punish-bc5 (col -1)    kg-2 (col 0)   kg-fischer-1 (col 1)
//   Row 0:                              kg-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const KINGS_GAMBIT: OpeningTree = {
  id: 'kings-gambit',
  name: "King's Gambit",
  slug: 'kings-gambit',
  description: 'The most aggressive opening — sacrifice the f-pawn to rip open the center and attack.',
  color: '#E03030',
  colorDark: '#B02020',
  completionOrder: [
    'kg-1', 'kg-2', 'kg-punish-bc5', 'kg-punish-g5',
    'kg-3', 'kg-fischer-1', 'kg-4', 'kg-cunningham-1',
    'kg-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'kg-1',
      name: 'The Gambit',
      moves: ['1.e4 e5', '2.f4 exf4', '3.Nf3'],
      description: 'Sacrifice the f-pawn and develop with tempo — the King\'s Gambit is born.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'kg-2',
      name: 'Counter the Pawn',
      moves: ['3...g5', '4.h4 g4', '5.Ne5'],
      description: 'Black grabs space with g5 — strike with h4, and when g4 chases the knight, leap to e5.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'kg-1',
      unlockedBy: 'kg-1',
      side: 'white',
    },
    {
      id: 'kg-3',
      name: 'The Retreat',
      moves: ['5...g4', '6.Ng1 Bh6', '7.Nc3'],
      description: 'The knight retreats to regroup — Nc3 develops and prepares the counterattack.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'kg-2',
      unlockedBy: 'kg-punish-g5',
      side: 'white',
    },
    {
      id: 'kg-4',
      name: 'Win It Back',
      moves: ['7...Ne7', '8.Be2 Ng6', '9.Bxf4'],
      description: 'Develop the bishop, then recapture the gambit pawn — the position is yours.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'kg-3',
      unlockedBy: 'kg-fischer-1',
      side: 'white',
    },

    // === PUNISH: 2...Bc5? (declining, col -1, row 0) ===
    {
      id: 'kg-punish-bc5',
      name: 'Punish 2...Bc5?',
      moves: ['2...Bc5?', '3.fxe5'],
      description: 'Black declines the gambit with Bc5 — take the free pawn!',
      type: 'punish',
      row: 0,
      col: -1,
      lineFrom: 'kg-1',
      unlockedBy: 'kg-2',
      side: 'white',
    },

    // === PUNISH: 3...g5? (early push, col -1, row 1) ===
    {
      id: 'kg-punish-g5',
      name: 'Punish 3...g5?',
      moves: ['3...g5?', '4.h4 g4', '5.Ne5'],
      description: 'Black pushes g5 too early — challenge with h4 and leap to e5!',
      type: 'punish',
      row: 1,
      col: -1,
      lineFrom: 'kg-punish-bc5',
      unlockedBy: 'kg-punish-bc5',
      side: 'white',
    },

    // === BRANCH: Fischer Defense (col 1, row 1) ===
    {
      id: 'kg-fischer-1',
      name: 'Fischer Defense',
      moves: ['3...d5', '4.exd5 Nf6', '5.c4'],
      description: 'Fischer\'s counter-gambit — Black strikes the center with d5, but c4 grabs space and keeps the extra pawn.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'kg-2',
      unlockedBy: 'kg-3',
      side: 'white',
    },

    // === BRANCH: Cunningham Defense (col 1, row 3) ===
    {
      id: 'kg-cunningham-1',
      name: 'Cunningham',
      moves: ['3...Be7', '4.Bc4 Bh4+', '5.Kf1'],
      description: 'The tricky Cunningham — Black checks with the bishop, but White stays calm with Kf1.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'kg-4',
      unlockedBy: 'kg-4',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'kg-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the King\'s Gambit — play the main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'kg-4',
      unlockedBy: 'kg-cunningham-1',
      side: 'white',
    },
  ],
}
