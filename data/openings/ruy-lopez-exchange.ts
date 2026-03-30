// Ruy Lopez: Exchange Variation — Level 1
// After 3...a6 4.Bxc6, White trades the bishop for the knight immediately.
// WHITE OPENING: User learns to exploit the doubled c-pawns in a simplified position.
//
// Main line: 4...dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5 8.Nb3 Qxd1
//            9.Rxd1 Bg4 10.f3 Be6 11.Be3 b6 12.Nc3
//
// GRID LAYOUT:
//   Row 5: rle-test-1 (col 0)
//   Row 4: rle-dev-Bd7 (col -1)
//   Row 3:                         rle-4 (col 0)
//   Row 2: rle-dev-Qf6 (col -1)   rle-3 (col 0)
//   Row 1:                         rle-2 (col 0)
//   Row 0:                         rle-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const RUY_LOPEZ_EXCHANGE: OpeningTree = {
  id: 'ruy-lopez-exchange',
  name: 'Exchange Variation',
  slug: 'ruy-lopez-exchange',
  description: 'Trade the bishop early and grind with better pawns.',
  color: '#E74C3C',
  colorDark: '#C0392B',
  completionOrder: [
    'rle-1', 'rle-2', 'rle-dev-Qf6',
    'rle-3', 'rle-4', 'rle-dev-Bd7',
    'rle-test-1',
  ],
  nodes: [

    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'rle-1',
      name: 'The Ruy Lopez',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bb5'],
      description: 'Open with e4, develop the knight, and pin with the bishop.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'rle-2',
      name: 'The Exchange',
      moves: ['3...a6 4.Bxc6', '4...dxc6 5.O-O f6', '6.d4'],
      description: 'Capture on c6, castle, and push d4 to open the center.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'rle-1',
      unlockedBy: 'rle-1',
      side: 'white',
    },
    {
      id: 'rle-3',
      name: 'Simplify & Control',
      moves: ['6...exd4 7.Nxd4', '7...c5 8.Nb3', '8...Qxd1 9.Rxd1'],
      description: 'Recapture, retreat the knight, and win the d-file.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'rle-2',
      unlockedBy: 'rle-dev-Qf6',
      side: 'white',
    },
    {
      id: 'rle-4',
      name: 'The Endgame Setup',
      moves: ['9...Bg4 10.f3', '10...Be6 11.Be3', '11...b6 12.Nc3'],
      description: 'Kick the bishop, develop, and bring out the knight.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'rle-3',
      unlockedBy: 'rle-3',
      side: 'white',
    },

    // === MINOR VARIATIONS ===
    {
      id: 'rle-dev-Qf6',
      name: 'If 5...Qf6',
      moves: ['5...Qf6', '6.d4 Bg5 Nxd4'],
      description: 'Black brings the queen out early. Punish with d4 and Bg5.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'rle-2',
      unlockedBy: 'rle-2',
      side: 'white',
    },
    {
      id: 'rle-dev-Bd7',
      name: 'If 9...Bd7',
      moves: ['9...Bd7', '10.Bf4 Nc3 Rxd8+'],
      description: 'Black develops quietly. Seize the initiative with Bf4 and dominate the d-file.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'rle-4',
      unlockedBy: 'rle-4',
      side: 'white',
    },

    // === LEVEL TEST ===
    {
      id: 'rle-test-1',
      name: 'Level Test',
      moves: [],
      description: 'Prove you know the Exchange Variation from start to finish.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'rle-4',
      unlockedBy: 'rle-dev-Bd7',
      side: 'white',
    },
  ],
}
