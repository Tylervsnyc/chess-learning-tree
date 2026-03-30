// Ruy Lopez: Berlin Defense — Level 1
// After 3...Nf6, White castles and enters the famous "Berlin Wall" endgame.
// WHITE OPENING: User learns to play for a small edge in the Berlin endgame.
//
// Main line: 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5
//            8.Qxd8+ Kxd8 9.Nc3 Ke8 10.h3 h5 11.Bf4 Be7 12.Rad1
//
// GRID LAYOUT:
//   Row 5: rlb-test-1 (col 0)
//   Row 4: rlb-dev-h6 (col -1)
//   Row 3:                        rlb-3 (col 0)
//   Row 2: rlb-dev-Be7 (col -1)
//   Row 1: rlb-dev-Bc5 (col -1)  rlb-2 (col 0)
//   Row 0:                        rlb-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const RUY_LOPEZ_BERLIN: OpeningTree = {
  id: 'ruy-lopez-berlin',
  name: 'Berlin Defense',
  slug: 'ruy-lopez-berlin',
  description: 'The Berlin Wall endgame. Trade queens early and grind out a small edge.',
  color: '#FF9600',
  colorDark: '#CC7800',
  completionOrder: [
    'rlb-1', 'rlb-2', 'rlb-dev-Bc5',
    'rlb-3', 'rlb-dev-Be7', 'rlb-dev-h6',
    'rlb-test-1',
  ],
  nodes: [

    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'rlb-1',
      name: 'Castle Into It',
      moves: ['4.O-O Nxe4', '5.d4 Nd6', '6.Bxc6'],
      description: 'Castle, push d4, and trade the bishop for the knight on c6.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'rlb-2',
      name: 'The Berlin Wall',
      moves: ['6...dxc6', '7.dxe5 Nf5', '8.Qxd8+ Kxd8', '9.Nc3'],
      description: 'Win a pawn on e5, trade queens, and develop the knight.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'rlb-1',
      unlockedBy: 'rlb-1',
      side: 'white',
    },
    {
      id: 'rlb-3',
      name: 'The Endgame Plan',
      moves: ['9...Ke8', '10.h3 h5', '11.Bf4 Be7', '12.Rad1'],
      description: 'Prevent Bg4, develop the bishop, and seize the d-file.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'rlb-2',
      unlockedBy: 'rlb-dev-Bc5',
      side: 'white',
    },

    // === MINOR VARIATIONS ===
    {
      id: 'rlb-dev-Bc5',
      name: 'If 4...Bc5',
      moves: ['4...Bc5', '5.c3'],
      description: 'Black develops the bishop instead of grabbing e4. Play c3 and expand.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'rlb-2',
      unlockedBy: 'rlb-2',
      side: 'white',
    },
    {
      id: 'rlb-dev-Be7',
      name: 'If 5...Be7',
      moves: ['5...Be7', '6.Qe2'],
      description: 'Black plays Be7 instead of Nd6. Switch to Qe2 and keep pressure.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'rlb-3',
      unlockedBy: 'rlb-3',
      side: 'white',
    },
    {
      id: 'rlb-dev-h6',
      name: 'If 9...h6',
      moves: ['9...h6', '10.h3'],
      description: 'Black plays h6 instead of Ke8. Respond with h3 and b3-Bb2.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'rlb-3',
      unlockedBy: 'rlb-dev-Be7',
      side: 'white',
    },

    // === LEVEL TEST ===
    {
      id: 'rlb-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Berlin Defense from memory.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'rlb-3',
      unlockedBy: 'rlb-dev-h6',
      side: 'white',
    },
  ],
}
