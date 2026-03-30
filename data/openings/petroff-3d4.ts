// Petroff Defense — 3.d4 Variation Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.e4 e5 2.Nf3 Nf6 3.d4
// Main line: 3...Nxe4 4.Bd3 d5 5.Nxe5 Nd7 6.Nxd7 Bxd7
//            7.O-O Bd6 8.c4 c6 9.cxd5 cxd5
//            10.Nc3 Nxc3 11.bxc3 O-O 12.Qh5 g6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (7 nodes):
//   Row 5:                              p3-test-1 (col 0)
//   Row 4:                              p3-4 (col 0)
//   Row 3:                              p3-3 (col 0)
//   Row 2:   p3-dev-dxe5-4 (col -1)    p3-2 (col 0)    p3-dev-dxe5-5 (col 1)
//   Row 1:                              p3-1 (col 0)
//   Row 0:   (empty — no deviations from lesson 1)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PETROFF_3D4: OpeningTree = {
  id: 'petroff-3d4',
  name: 'Petroff: 3.d4 Variation',
  slug: 'petroff-3d4',
  description: 'When White plays 3.d4, grab the free pawn with Nxe4 and build a rock-solid center.',
  color: '#3498DB',
  colorDark: '#2980B9',
  completionOrder: [
    'p3-1', 'p3-2', 'p3-dev-dxe5-4', 'p3-dev-dxe5-5',
    'p3-3', 'p3-4', 'p3-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'p3-1',
      name: 'Grab the Pawn',
      moves: ['1.e4 e5', '2.Nf3 Nf6', '3.d4 Nxe4'],
      description: 'The Petroff begins — mirror White\'s knight, then grab the free e4 pawn.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'p3-2',
      name: 'Solid Center',
      moves: ['4.Bd3 d5', '5.Nxe5 Nd7', '6.Nxd7 Bxd7'],
      description: 'Plant a pawn on d5 and develop smoothly with Nd7 and Bxd7.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'p3-1',
      unlockedBy: 'p3-1',
      side: 'black',
    },
    {
      id: 'p3-3',
      name: 'Develop and Fortify',
      moves: ['7.O-O Bd6', '8.c4 c6', '9.cxd5 cxd5'],
      description: 'Develop the bishop to d6 and set up a solid pawn chain with c6.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'p3-2',
      unlockedBy: 'p3-dev-dxe5-5',
      side: 'black',
    },
    {
      id: 'p3-4',
      name: 'Trade and Castle',
      moves: ['10.Nc3 Nxc3', '11.bxc3 O-O', '12.Qh5 g6'],
      description: 'Exchange the knights, castle to safety, and deflect the queen with g6.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'p3-3',
      unlockedBy: 'p3-3',
      side: 'black',
    },

    // === DEVIATIONS ===
    {
      id: 'p3-dev-dxe5-4',
      name: 'After 4.dxe5',
      moves: ['4.dxe5 d5', '5.Nbd2 Nxd2', '6.Bxd2 Be7'],
      description: 'When White pushes dxe5 instead of Bd3, play d5 and develop smoothly.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'p3-2',
      unlockedBy: 'p3-2',
      side: 'black',
    },
    {
      id: 'p3-dev-dxe5-5',
      name: 'After 5.dxe5',
      moves: ['5.dxe5 Nc5', '6.Be2 Be7', '7.O-O O-O'],
      description: 'When White pushes dxe5 after Bd3, hop the knight to c5 and develop.',
      type: 'deviation',
      row: 2,
      col: 1,
      lineFrom: 'p3-2',
      unlockedBy: 'p3-dev-dxe5-4',
      side: 'black',
    },

    // === LEVEL TEST ===
    {
      id: 'p3-test-1',
      name: 'Level Test',
      moves: [],
      description: 'Prove you know the 3.d4 Petroff — main line and both deviations.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'p3-4',
      unlockedBy: 'p3-4',
      side: 'black',
    },
  ],
}
