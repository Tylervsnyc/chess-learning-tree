// Caro-Kann Defense Opening Tree Data (Classical Variation)
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6
//            7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6 11.Bd2 Ngf6
//            12.O-O-O Be7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 5:  ck-test-1 (col 0)
//   Row 4:  ck-4 (col 0)
//   Row 3:  ck-dev-h5 (col -1)
//   Row 2:  ck-3 (col 0)              ck-dev-Nf3 (col 1)
//   Row 1:  ck-2 (col 0)  ck-dev-Nc5 (col -1)
//   Row 0:  ck-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const CARO_KANN: OpeningTree = {
  id: 'caro-kann',
  name: 'Caro-Kann Defense',
  slug: 'caro-kann',
  description: 'The solid defense — Black plays c6 and d5, then develops the bishop before playing e6.',
  color: '#2FCBEF',
  colorDark: '#20A8D0',
  completionOrder: [
    'ck-1', 'ck-2', 'ck-dev-Nc5', 'ck-dev-Nf3',
    'ck-3', 'ck-dev-h5', 'ck-4', 'ck-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ck-1',
      name: 'The Caro-Kann Wall',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Set up the Caro-Kann — c6, d5, then capture the e4 pawn when White develops the knight.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ck-2',
      name: 'Bishop First',
      moves: ['4.Nxe4 Bf5', '5.Ng3 Bg6', '6.h4 h6'],
      description: 'Get the bishop out to f5 before playing e6 — the whole point of the Caro-Kann.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ck-1',
      unlockedBy: 'ck-1',
      side: 'black',
    },
    {
      id: 'ck-3',
      name: 'The Bishop Trade',
      moves: ['7.Nf3 Nd7', '8.h5 Bh7', '9.Bd3 Bxd3'],
      description: 'Develop the knight, tuck the bishop to safety, then trade it off on d3.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-dev-Nf3',
      side: 'black',
    },
    {
      id: 'ck-4',
      name: 'Completing Development',
      moves: ['10.Qxd3 e6', '11.Bd2 Ngf6', '12.O-O-O Be7'],
      description: 'Lock down the center with e6, bring out the knight and bishop, prepare to castle.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'ck-3',
      unlockedBy: 'ck-dev-h5',
      side: 'black',
    },

    // === DEVIATION: 5.Nc5 (col -1, row 1) ===
    {
      id: 'ck-dev-Nc5',
      name: 'If 5.Nc5',
      moves: ['5.Nc5 b6', '6.Nb3 e6', '7.Nf3 Bd6'],
      description: 'White tries Nc5 to pressure b7 — kick it back with b6 and develop normally.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-2',
      side: 'black',
    },

    // === DEVIATION: 6.Nf3 (col 1, row 2) ===
    {
      id: 'ck-dev-Nf3',
      name: 'If 6.Nf3',
      moves: ['6.Nf3 Nd7', '7.h4 h6', '8.h5 Bh7'],
      description: 'White develops the knight before pushing h4 — same plan, slightly different move order.',
      type: 'deviation',
      row: 2,
      col: 1,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-dev-Nc5',
      side: 'black',
    },

    // === DEVIATION: 7.h5 (col -1, row 3) ===
    {
      id: 'ck-dev-h5',
      name: 'If 7.h5',
      moves: ['7.h5 Bh7', '8.Nf3 Nd7', '9.Bd3 Bxd3'],
      description: 'White pushes h5 early — tuck the bishop to h7 and develop the knight.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'ck-3',
      unlockedBy: 'ck-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ck-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Caro-Kann Classical — play the full line and handle every sideline.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'ck-4',
      unlockedBy: 'ck-4',
      side: 'black',
    },
  ],
}
