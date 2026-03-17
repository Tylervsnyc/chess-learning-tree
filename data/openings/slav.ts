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
//            12.Nxd7 Nxd7 13.Bd6 a6 14.a4 b4 15.Bxb4 Qb6 16.Ba3 Qxd4
//            17.Qc2 c5 18.Rad1 Qe5 19.Bxc4 Qc7 20.Ne2 Be5
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (13 nodes):
//   Row 8:                              sl-test-2 (col 0)
//   Row 7:                              sl-6 (col 0)
//   Row 6:   sl-dev-h4 (col -1)
//   Row 5:                              sl-5 (col 0)        sl-dev-cxd5 (col 1)
//   Row 4:                              sl-4 (col 0)        sl-dev-Qc2 (col 1)
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
    'sl-4', 'sl-dev-Qc2', 'sl-5', 'sl-dev-cxd5', 'sl-6', 'sl-dev-h4',
    'sl-test-2',
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

    // === LEVEL 2 MAIN LINE ===
    {
      id: 'sl-4',
      name: 'The Recapture',
      moves: ['12.Nxd7 Nxd7', '13.Bd6 a6', '14.a4 b4'],
      description: 'Recapture the knight, expand on the queenside, and push b4 to create counterplay.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'sl-test-1',
      unlockedBy: 'sl-test-1',
      side: 'black',
    },
    {
      id: 'sl-5',
      name: 'Queen Activity',
      moves: ['15.Bxb4 Qb6', '16.Ba3 Qxd4', '17.Qc2 c5'],
      description: 'Activate the queen, win the d4 pawn, and break with c5.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'sl-4',
      unlockedBy: 'sl-dev-Qc2',
      side: 'black',
    },
    {
      id: 'sl-6',
      name: 'Consolidation',
      moves: ['18.Rad1 Qe5', '19.Bxc4 Qc7', '20.Ne2 Be5'],
      description: 'Centralize the queen and bishop to consolidate the position.',
      type: 'main',
      row: 7,
      col: 0,
      lineFrom: 'sl-5',
      unlockedBy: 'sl-dev-cxd5',
      side: 'black',
    },

    // === LEVEL 2 DEVIATIONS ===
    {
      id: 'sl-dev-Qc2',
      name: 'Dev 4.Qc2',
      moves: ['4.Qc2 dxc4', '5.Qxc4 Bf5', '6.g3 e6'],
      description: 'White plays 4.Qc2 — grab the pawn and develop the bishop early.',
      type: 'deviation',
      row: 4,
      col: 1,
      lineFrom: 'sl-4',
      unlockedBy: 'sl-4',
      side: 'black',
    },
    {
      id: 'sl-dev-cxd5',
      name: 'Dev 5.cxd5',
      moves: ['5.cxd5 exd5', '6.Bg5 Be7', '7.Qc2 g6'],
      description: 'White exchanges pawns with cxd5 — recapture and develop naturally.',
      type: 'deviation',
      row: 5,
      col: 1,
      lineFrom: 'sl-5',
      unlockedBy: 'sl-5',
      side: 'black',
    },
    {
      id: 'sl-dev-h4',
      name: 'Dev 9.h4',
      moves: ['9.h4 g4', '10.Ne5 Nbd7', '11.Be2 Bb7'],
      description: 'White attacks with h4 — push past and keep developing.',
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'sl-6',
      unlockedBy: 'sl-6',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'sl-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Slav middlegame — main line and all three deviations.',
      type: 'test',
      row: 8,
      col: 0,
      lineFrom: 'sl-6',
      unlockedBy: 'sl-dev-h4',
      side: 'black',
    },
  ],
}
