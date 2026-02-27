// London System Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.Bg3 O-O
//            8.Bd3 b6 9.O-O Bb7 10.Ne5 Qc7 11.Re1 Rad8 12.Qe2 Ne7
//
// 3 White moves per lesson.
//
// GRID LAYOUT (10 lessons):
//   Row 4:                              ln-test-1 (col 0)
//   Row 3:   ln-4 (col 0)              ln-bd6-1 (col 1)
//   Row 2:   ln-anti-bf5 (col -1)      ln-3 (col 0)
//   Row 1:   ln-punish-c5 (col -1)     ln-2 (col 0)   ln-jobava-1 (col 1)
//   Row 0:   ln-punish-e5 (col -1)     ln-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const LONDON_SYSTEM: OpeningTree = {
  id: 'london',
  name: 'London System',
  slug: 'london',
  description: 'The solid system — develop your bishop to f4, build a fortress, then attack.',
  color: '#A560E8',
  colorDark: '#8448BA',
  completionOrder: [
    'ln-1', 'ln-2', 'ln-punish-e5', 'ln-punish-c5',
    'ln-3', 'ln-jobava-1', 'ln-4', 'ln-anti-bf5',
    'ln-bd6-1', 'ln-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ln-1',
      name: 'The London Setup',
      moves: ['1.d4 d5', '2.Bf4 Nf6', '3.e3'],
      description: 'Open with d4 and immediately develop the dark-squared bishop to f4.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'ln-2',
      name: 'The Pyramid',
      moves: ['3...e6', '4.Nf3 c5', '5.c3'],
      description: 'Build the London pyramid — pawns on c3, d4, e3 create an unbreakable center.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ln-1',
      unlockedBy: 'ln-1',
      side: 'white',
    },
    {
      id: 'ln-3',
      name: 'The Retreat',
      moves: ['5...Nc6', '6.Nbd2 Bd6', '7.Bg3'],
      description: 'When Black challenges your bishop, retreat to g3 — it stays active on the diagonal.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ln-2',
      unlockedBy: 'ln-punish-c5',
      side: 'white',
    },
    {
      id: 'ln-4',
      name: 'The Outpost',
      moves: ['7...O-O', '8.Bd3 b6', '9.O-O'],
      description: 'Develop the bishop to d3, castle, and prepare Ne5 — the London dream square.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'ln-3',
      unlockedBy: 'ln-jobava-1',
      side: 'white',
    },

    // === PUNISH: 1...e5? (Englund Gambit, col -1, row 0) ===
    {
      id: 'ln-punish-e5',
      name: 'Punish 1...e5?',
      moves: ['1...e5?', '2.dxe5 d6', '3.exd6 Bxd6', '4.Nf3'],
      description: 'Black gambits a pawn with 1...e5 — take it and develop with tempo.',
      type: 'punish',
      row: 0,
      col: -1,
      lineFrom: 'ln-1',
      unlockedBy: 'ln-2',
      side: 'white',
    },

    // === PUNISH: 2...c5? (premature queenside, col -1, row 1) ===
    {
      id: 'ln-punish-c5',
      name: 'Punish 2...c5?',
      moves: ['2...c5?', '3.e3 cxd4', '4.exd4'],
      description: 'Black challenges d4 too early — trade and enjoy a great center with your bishop already developed.',
      type: 'punish',
      row: 1,
      col: -1,
      lineFrom: 'ln-punish-e5',
      unlockedBy: 'ln-punish-e5',
      side: 'white',
    },

    // === BRANCH: Jobava London (col 1, row 1) ===
    {
      id: 'ln-jobava-1',
      name: 'Jobava London',
      moves: ['3.Nc3 e6', '4.e3'],
      description: 'The aggressive Jobava — develop the knight to c3 before e3 for more dynamic play.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'ln-2',
      unlockedBy: 'ln-3',
      side: 'white',
    },

    // === BRANCH: Anti-...Bf5 (col -1, row 2) ===
    {
      id: 'ln-anti-bf5',
      name: 'Anti-...Bf5',
      moves: ['3...Bf5', '4.c4! dxc4', '5.Bxc4'],
      description: 'Black mirrors your bishop development — strike with c4 to seize the center.',
      type: 'branch',
      row: 2,
      col: -1,
      lineFrom: 'ln-3',
      unlockedBy: 'ln-4',
      side: 'white',
    },

    // === BRANCH: Bd6 Challenge (col 1, row 3) ===
    {
      id: 'ln-bd6-1',
      name: 'Bd6 Challenge',
      moves: ['4...Bd6', '5.Bxd6 Qxd6', '6.Bd3'],
      description: 'Black attacks your bishop with Bd6 — trade it off and keep developing smoothly.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'ln-4',
      unlockedBy: 'ln-anti-bf5',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ln-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the London — play the main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'ln-4',
      unlockedBy: 'ln-bd6-1',
      side: 'white',
    },
  ],
}
