// London System vs King's Indian Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White in the London vs King's Indian.
// Main line: 1.d4 Nf6 2.Bf4 g6 3.Nf3 Bg7 4.e3 O-O 5.Be2 d6 6.h3 c5
//            7.c3 b6 8.O-O Bb7 9.Nbd2
//
// GRID LAYOUT (7 nodes):
//   Row 5:                              lvki-test-1 (col 0)
//   Row 4:                              lvki-3 (col 0)
//   Row 3:   lvki-dev-b6 (col -1)       lvki-3 branch point
//   Row 2:   lvki-dev-c5 (col -1)       lvki-2 (col 0)
//   Row 1:                              lvki-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const LONDON_VS_KINGS_INDIAN: OpeningTree = {
  id: 'london-vs-kings-indian',
  name: 'London vs King\'s Indian',
  slug: 'london-vs-kings-indian',
  description: 'Handle the King\'s Indian fianchetto setup with the solid London structure.',
  color: '#9060D8',
  colorDark: '#7040B0',
  completionOrder: [
    'lvki-1', 'lvki-2', 'lvki-dev-c5',
    'lvki-3', 'lvki-dev-b6',
    'lvki-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'lvki-1',
      name: 'The London Setup',
      moves: ['1.d4 Nf6', '2.Bf4 g6', '3.Nf3'],
      description: 'Start the London with d4, Bf4, and Nf3 against the King\'s Indian.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'lvki-2',
      name: 'Building the Pyramid',
      moves: ['3...Bg7 4.e3', '4...O-O 5.Be2', '5...d6 6.h3'],
      description: 'Complete the London pyramid with e3, Be2, and h3.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'lvki-1',
      unlockedBy: 'lvki-1',
      side: 'white',
    },
    {
      id: 'lvki-3',
      name: 'Queenside Development',
      moves: ['6...c5 7.c3', '7...b6 8.O-O', '8...Bb7 9.Nbd2'],
      description: 'Lock the center, castle, and develop the last knight.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'lvki-2',
      unlockedBy: 'lvki-dev-c5',
      side: 'white',
    },

    // === DEVIATION: 4...c5 (instead of 4...O-O) ===
    {
      id: 'lvki-dev-c5',
      name: 'Dev 4...c5',
      moves: ['4...c5 5.c3', '5...b6 6.Nbd2', '6...Bb7 7.Be2'],
      description: 'Black pushes c5 before castling — lock the center and develop.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'lvki-2',
      unlockedBy: 'lvki-2',
      side: 'white',
    },

    // === DEVIATION: 6...b6 (instead of 6...c5) ===
    {
      id: 'lvki-dev-b6',
      name: 'Dev 6...b6',
      moves: ['6...b6 7.O-O', '7...Bb7 8.a4', '8...a6 9.Nbd2'],
      description: 'Black fianchettoes the queenside bishop early — castle and claim space.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'lvki-3',
      unlockedBy: 'lvki-3',
      side: 'white',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'lvki-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full London vs King\'s Indian main line and handle every deviation.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'lvki-3',
      unlockedBy: 'lvki-dev-b6',
      side: 'white',
    },
  ],
}
