// Caro-Kann Defense Opening Tree Data (Advanced Variation)
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7
//            7.Nbd2 h6 8.Nb3 g5 9.a4 Bg7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 3:                           ck-test-1 (col 0)
//   Row 2:    ck-3 (col 0)                          ck-dev-nh4 (col 1)
//   Row 1:    ck-2 (col 0)          ck-dev-nc3 (col -1)
//   Row 0:    ck-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const CARO_KANN: OpeningTree = {
  id: 'caro-kann',
  name: 'Caro-Kann Defense',
  slug: 'caro-kann',
  description: 'The solid defense — Black plays c6 and d5, then develops the bishop before playing e6.',
  color: '#FF9600',
  colorDark: '#D97706',
  completionOrder: [
    'ck-1', 'ck-2', 'ck-dev-nc3',
    'ck-3', 'ck-dev-nh4', 'ck-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ck-1',
      name: 'The Caro-Kann Wall',
      moves: ['1.e4 c6', '2.d4 d5', '3.e5 Bf5'],
      description: 'Set up the Caro-Kann — c6, d5, then get the bishop out before it gets locked in.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ck-2',
      name: 'Developing Behind the Wall',
      moves: ['4.Nf3 e6', '5.Be2 Nd7', '6.O-O Ne7'],
      description: 'Develop your pieces behind the pawn wall — e6, Nd7, Ne7.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ck-1',
      unlockedBy: 'ck-1',
      side: 'black',
    },
    {
      id: 'ck-3',
      name: 'The Kingside Expansion',
      moves: ['7.Nbd2 h6', '8.Nb3 g5', '9.a4 Bg7'],
      description: 'Expand on the kingside — h6 and g5 grab space, then fianchetto the bishop.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-dev-nc3',
      side: 'black',
    },

    // === DEVIATION: 3.Nc3 (Classical — col -1, row 1) ===
    {
      id: 'ck-dev-nc3',
      name: 'If 3.Nc3',
      moves: ['3.Nc3 dxe4', '4.Nxe4 Bf5', '5.Ng3 Bg6'],
      description: 'White plays 3.Nc3 instead of 3.e5 — capture on e4 and develop the bishop.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ck-1',
      unlockedBy: 'ck-2',
      side: 'black',
    },

    // === DEVIATION: 7.Nh4 (col 1, row 2) ===
    {
      id: 'ck-dev-nh4',
      name: 'If 7.Nh4',
      moves: ['7.Nh4 Qb6', '8.Nxf5 Nxf5', '9.c3 Be7'],
      description: 'White tries to trade off your bishop with Nh4 — counter with Qb6 and keep developing.',
      type: 'deviation',
      row: 2,
      col: 1,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ck-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Caro-Kann Advanced — play the full line and handle every sideline.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'ck-3',
      unlockedBy: 'ck-dev-nh4',
      side: 'black',
    },
  ],
}
