// Nimzo-Indian Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4
// Main line: 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 Qc7
//            10.cxd5 exd5 11.a4 Re8 12.Ba3 c4 13.Bc2
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (4 nodes):
//   Row 3:   ni-test-1 (col 0)
//   Row 2:   ni-3 (col 0)
//   Row 1:   ni-2 (col 0)
//   Row 0:   ni-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const NIMZO_INDIAN: OpeningTree = {
  id: 'nimzo-indian',
  name: 'Nimzo-Indian Defense',
  slug: 'nimzo-indian',
  description: 'Pin the knight, trade the bishop, and fight for the center. A rock-solid weapon against 1.d4.',
  color: '#8E44AD',
  colorDark: '#6C3483',
  completionOrder: [
    'ni-1', 'ni-2', 'ni-3', 'ni-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ni-1',
      name: 'The Pin',
      moves: ['4.e3 O-O', '5.Bd3 d5', '6.Nf3 c5'],
      description: 'Castle quickly, strike the center with d5, and challenge White\'s pawn chain with c5.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ni-2',
      name: 'The Exchange',
      moves: ['7...Nc6', '8...Bxc3', '9...Qc7'],
      description: 'Develop the knight, trade the bishop for the knight, and centralize the queen.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ni-1',
      unlockedBy: 'ni-1',
      side: 'black',
    },
    {
      id: 'ni-3',
      name: 'Activating Pieces',
      moves: ['10...exd5', '11...Re8', '12...c4'],
      description: 'Recapture in the center, activate the rook, and lock down the queenside with c4.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ni-2',
      unlockedBy: 'ni-2',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ni-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Nimzo-Indian — play the full main line from memory.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'ni-3',
      unlockedBy: 'ni-3',
      side: 'black',
    },
  ],
}
