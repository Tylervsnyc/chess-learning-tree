// Scandinavian Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5
//            7.Bd2 e6 8.Nd5 Qd8 9.Nxf6+ gxf6
//            10.Bb3 Nd7 11.Qe2 Qc7 12.Nh4 Bg6
//
// GRID LAYOUT (8 nodes):
//   Row 5:                     s-test-1 (col 0)
//   Row 4:                     s-4 (col 0)
//   Row 3:  s-dev-Ne5 (-1)    s-3 (col 0)
//   Row 2:  s-dev-Bd2 (-1)    s-2 (col 0)
//   Row 1:  s-dev-Bc4 (-1)
//   Row 0:                     s-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SCANDINAVIAN_DEFENSE: OpeningTree = {
  id: 'scandinavian',
  name: 'Scandinavian Defense',
  slug: 'scandinavian',
  description: 'The queen strikes early — grab the d5 pawn back with the queen, then develop with tempo.',
  color: '#3B82F6',
  colorDark: '#2563EB',
  completionOrder: [
    's-1', 's-2', 's-dev-Bc4', 's-dev-Bd2',
    's-3', 's-dev-Ne5', 's-4', 's-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 's-1',
      name: 'Queen Strikes',
      moves: ['1.e4 d5', '2.exd5 Qxd5', '3.Nc3 Qa5'],
      description: 'Challenge the center with d5, recapture with the queen, and retreat to the safe a5 square.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 's-2',
      name: 'Develop & Fortify',
      moves: ['4.d4 Nf6', '5.Nf3 c6', '6.Bc4 Bf5'],
      description: 'Develop the knight to f6, secure the center with c6, and activate the bishop on f5.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 's-1',
      unlockedBy: 's-1',
      side: 'black',
    },
    {
      id: 's-3',
      name: 'The Knight Sacrifice',
      moves: ['7.Bd2 e6', '8.Nd5 Qd8', '9.Nxf6+ gxf6'],
      description: 'Solidify with e6, retreat the queen, and recapture on f6 to open the g-file.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 's-2',
      unlockedBy: 's-dev-Bd2',
      side: 'black',
    },
    {
      id: 's-4',
      name: 'Regroup & Attack',
      moves: ['10.Bb3 Nd7', '11.Qe2 Qc7', '12.Nh4 Bg6'],
      description: 'Develop the knight, activate the queen on c7, and tuck the bishop safely on g6.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 's-3',
      unlockedBy: 's-dev-Ne5',
      side: 'black',
    },

    // === DEVIATION: 4.Bc4 (instead of 4.d4, col -1) ===
    {
      id: 's-dev-Bc4',
      name: 'Dev 4.Bc4',
      moves: ['4.Bc4 Nf6', '5.d3 c6', '6.Bd2 Qc7'],
      description: 'White develops the bishop early — develop, secure the center, and reposition the queen.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 's-1',
      unlockedBy: 's-2',
      side: 'black',
    },

    // === DEVIATION: 5.Bd2 (instead of 5.Nf3, col -1) ===
    {
      id: 's-dev-Bd2',
      name: 'Dev 5.Bd2',
      moves: ['5.Bd2 c6', '6.Bc4 Bf5', '7.Nd5 Qd8'],
      description: 'White plays Bd2 early — shore up the center, develop the bishop, and retreat the queen.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 's-2',
      unlockedBy: 's-dev-Bc4',
      side: 'black',
    },

    // === DEVIATION: 7.Ne5 (instead of 7.Bd2, col -1) ===
    {
      id: 's-dev-Ne5',
      name: 'Dev 7.Ne5',
      moves: ['7.Ne5 e6', '8.g4 Bg6', '9.h4 Nbd7'],
      description: 'White pushes the knight forward — play e6, relocate the bishop, and develop the knight.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 's-3',
      unlockedBy: 's-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 's-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Scandinavian — play the main line from memory and handle every sideline.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 's-4',
      unlockedBy: 's-4',
      side: 'black',
    },
  ],
}
