// Slav Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Main line: 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.Bg5 h6 6.Bh4 dxc4
//            7.e4 g5 8.Bg3 b5 9.Be2 Bb7 10.O-O Nbd7 11.Ne5 Bg7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 3:                              sl-test-1 (col 0)
//   Row 2:   sl-dev-e3 (col -1)     sl-3 (col 0)
//   Row 1:                              sl-2 (col 0)        sl-dev-Nc3 (col 1)
//   Row 0:                              sl-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SLAV_DEFENSE: OpeningTree = {
  id: 'slav',
  name: 'Slav Defense',
  slug: 'slav',
  description: 'Solid and flexible — grab the c4 pawn and strike with g5 in the Anti-Moscow Gambit.',
  color: '#E67E22',
  colorDark: '#CA6F1E',
  completionOrder: [
    'sl-1', 'sl-2', 'sl-dev-e3', 'sl-3', 'sl-dev-Nc3',
    'sl-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sl-1',
      name: 'The Setup',
      moves: ['3.Nf3 Nf6', '4.Nc3 e6', '5.Bg5 h6'],
      description: 'Develop the knight, prepare the Semi-Slav with e6, and challenge the bishop with h6.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sl-2',
      name: 'The Gambit',
      moves: ['6.Bh4 dxc4', '7.e4 g5', '8.Bg3 b5'],
      description: 'Grab the c4 pawn and push g5 to lock in the extra material.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sl-1',
      unlockedBy: 'sl-1',
      side: 'black',
    },
    {
      id: 'sl-3',
      name: 'Development',
      moves: ['9.Be2 Bb7', '10.O-O Nbd7', '11.Ne5 Bg7'],
      description: 'Develop the bishop to b7, bring out the knight, and fianchetto on g7.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sl-2',
      unlockedBy: 'sl-dev-e3',
      side: 'black',
    },

    // === DEVIATION: 4.e3 instead of 4.Nc3 (col -1, row 2) ===
    {
      id: 'sl-dev-e3',
      name: 'Dev 4.e3',
      moves: ['4.e3 Bf5', '5.Nc3 e6', '6.Nh4 Bg6'],
      description: 'White plays a quiet e3 — develop the bishop to f5 before it gets locked in.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'sl-2',
      unlockedBy: 'sl-2',
      side: 'black',
    },

    // === DEVIATION: 3.Nc3 instead of 3.Nf3 (col 1, row 1) ===
    {
      id: 'sl-dev-Nc3',
      name: 'Dev 3.Nc3',
      moves: ['3.Nc3 Nf6', '4.e3 e6', '5.Nf3 Nbd7'],
      description: 'White develops the knight to c3 first — enter the Meran setup with Nf6, e6, and Nbd7.',
      type: 'deviation',
      row: 1,
      col: 1,
      lineFrom: 'sl-1',
      unlockedBy: 'sl-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'sl-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Slav Defense — play the main line and handle every deviation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'sl-3',
      unlockedBy: 'sl-dev-Nc3',
      side: 'black',
    },
  ],
}
