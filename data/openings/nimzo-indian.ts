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
// GRID LAYOUT (8 nodes):
//   Row 7:   ni-test-2 (col 0)
//   Row 6:   ni-dev-a3 (col -1)
//   Row 5:   ni-dev-Bd2 (col 1)
//   Row 4:   ni-dev-f3 (col -1)
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
    'ni-dev-f3', 'ni-dev-Bd2', 'ni-dev-a3', 'ni-test-2',
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

    // === LEVEL 2 DEVIATIONS ===
    {
      id: 'ni-dev-f3',
      name: 'If f3',
      moves: ['4.f3 d5', '5.a3 Bxc3+', '6.bxc3 c5'],
      description: 'White plays the aggressive 4.f3 — strike the center, trade the bishop, and challenge the pawns.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'ni-test-1',
      unlockedBy: 'ni-test-1',
      side: 'black',
    },
    {
      id: 'ni-dev-Bd2',
      name: 'If Bd2',
      moves: ['5.Bd2 d5', '6.Nf3 b6', '7.cxd5 exd5'],
      description: 'White plays 5.Bd2 instead of Bd3 — grab the center and prepare queenside development.',
      type: 'deviation',
      row: 5,
      col: 1,
      lineFrom: 'ni-test-1',
      unlockedBy: 'ni-dev-f3',
      side: 'black',
    },
    {
      id: 'ni-dev-a3',
      name: 'If a3',
      moves: ['6.a3 Bxc3+', '7.bxc3 dxc4', '8.Bxc4 c5'],
      description: 'White plays 6.a3 early — trade the bishop, grab the c4 pawn, and attack the center.',
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'ni-test-1',
      unlockedBy: 'ni-dev-Bd2',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'ni-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Nimzo-Indian — main line and all three deviations.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'ni-dev-a3',
      unlockedBy: 'ni-dev-a3',
      side: 'black',
    },
  ],
}
