// Nimzo-Indian Classical (4.Qc2) Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2
// Main line: 4...O-O 5.a3 Bxc3+ 6.Qxc3 b6
//            7.Bg5 Bb7 8.f3 h6 9.Bh4 d5
//            10.e3 Nbd7 11.cxd5 Nxd5 12.Bxd8 Nxc3
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 5:                            nic-test-1 (col 0)
//   Row 4:   nic-dev-Nf3 (col -1)     nic-4 (col 0)
//   Row 3:                            nic-3 (col 0)
//   Row 2:   nic-dev-e4 (col -1)      nic-2 (col 0)
//   Row 1:                            nic-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const NIMZO_INDIAN_CLASSICAL: OpeningTree = {
  id: 'nimzo-indian-classical',
  name: 'Nimzo-Indian Classical',
  slug: 'nimzo-indian-classical',
  description: 'White plays 4.Qc2 to avoid doubled pawns. Castle, trade the bishop, and develop with b6 and Bb7.',
  color: '#8E44AD',
  colorDark: '#6C3483',
  completionOrder: [
    'nic-1', 'nic-2', 'nic-dev-e4',
    'nic-3', 'nic-4', 'nic-dev-Nf3',
    'nic-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'nic-1',
      name: 'The Classical Nimzo',
      moves: ['1...Nf6', '2...e6', '3...Bb4'],
      description: 'Develop the knight, prepare the pin, and plant the bishop on b4.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'nic-2',
      name: 'The Exchange',
      moves: ['4...O-O', '5...Bxc3+', '6...b6'],
      description: 'Castle, trade the bishop for doubled pawns, and prepare the fianchetto.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'nic-1',
      unlockedBy: 'nic-1',
      side: 'black',
    },
    {
      id: 'nic-3',
      name: 'The Fianchetto',
      moves: ['7...Bb7', '8...h6', '9...d5'],
      description: 'Fianchetto the bishop, kick the pin, and strike the center.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'nic-2',
      unlockedBy: 'nic-dev-e4',
      side: 'black',
    },
    {
      id: 'nic-4',
      name: 'The Deep Line',
      moves: ['10...Nbd7', '11...Nxd5', '12...Nxc3'],
      description: 'Develop the knight, recapture on d5, and win material with the queen trap.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'nic-3',
      unlockedBy: 'nic-3',
      side: 'black',
    },

    // === DEVIATIONS ===
    {
      id: 'nic-dev-e4',
      name: 'Dev 5.e4',
      moves: ['5...d5', '6...Ne4', '7...c5'],
      description: 'When White pushes e4, counter in the center with d5 and undermine with c5.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'nic-2',
      unlockedBy: 'nic-2',
      side: 'black',
    },
    {
      id: 'nic-dev-Nf3',
      name: 'Dev 7.Nf3',
      moves: ['7...Bb7', '8...d6', '9...Nbd7'],
      description: 'When White plays Nf3 instead of Bg5, develop solidly with Bb7, d6, and Nbd7.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'nic-4',
      unlockedBy: 'nic-4',
      side: 'black',
    },

    // === LEVEL TEST ===
    {
      id: 'nic-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Classical Nimzo-Indian.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'nic-4',
      unlockedBy: 'nic-dev-Nf3',
      side: 'black',
    },
  ],
}
