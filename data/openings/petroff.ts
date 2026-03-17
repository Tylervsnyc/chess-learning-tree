// Petroff Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.e4 e5 2.Nf3 Nf6
// Main line: 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3 Nc6 7.O-O Be7 8.c4 Nb4
//            9.Be2 O-O 10.Nc3 Bf5 11.a3 Nxc3
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (10 nodes):
//   Row 7:                              pt-test-2 (col 0)
//   Row 6:                              pt-5 (col 0)
//   Row 5:   pt-dev-Bf4 (col -1)
//   Row 4:                              pt-4 (col 0)
//   Row 3:                              pt-test-1 (col 0)
//   Row 2:   pt-dev-nc3 (col -1)    pt-3 (col 0)
//   Row 1:                              pt-2 (col 0)     pt-dev-d4 (col 1)
//   Row 0:                              pt-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PETROFF_DEFENSE: OpeningTree = {
  id: 'petroff',
  name: 'Petroff Defense',
  slug: 'petroff',
  description: 'The symmetrical counterattack — mirror White\'s knight, then win back the pawn with a powerful center.',
  color: '#3498DB',
  colorDark: '#2980B9',
  completionOrder: [
    'pt-1', 'pt-2', 'pt-dev-d4',
    'pt-3', 'pt-dev-nc3',
    'pt-test-1',
    'pt-4', 'pt-5', 'pt-dev-Bf4',
    'pt-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'pt-1',
      name: 'The Counterattack',
      moves: ['3.Nxe5 d6', '4.Nf3 Nxe4', '5.d4 d5'],
      description: 'White takes your pawn — but you win it back with a strong center.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'pt-2',
      name: 'Development',
      moves: ['6.Bd3 Nc6', '7.O-O Be7', '8.c4 Nb4'],
      description: 'Develop your pieces and jump the knight to b4, attacking White\'s bishop.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'pt-1',
      unlockedBy: 'pt-1',
      side: 'black',
    },
    {
      id: 'pt-3',
      name: 'Completing the Setup',
      moves: ['9.Be2 O-O', '10.Nc3 Bf5', '11.a3 Nxc3'],
      description: 'Castle safely, develop the bishop, and simplify with a favorable exchange.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'pt-2',
      unlockedBy: 'pt-dev-d4',
      side: 'black',
    },

    // === DEVIATION: 3.d4 (col 1, row 1) ===
    {
      id: 'pt-dev-d4',
      name: 'Dev 3.d4',
      moves: ['3.d4 Nxe4', '4.Bd3 d5', '5.Nxe5 Nd7'],
      description: 'White plays d4 instead of Nxe5 — grab the e4 pawn and build a solid center.',
      type: 'deviation',
      row: 1,
      col: 1,
      lineFrom: 'pt-2',
      unlockedBy: 'pt-2',
      side: 'black',
    },

    // === DEVIATION: 5.Nc3 (col -1, row 2) ===
    {
      id: 'pt-dev-nc3',
      name: 'Dev 5.Nc3',
      moves: ['5.Nc3 Nxc3', '6.dxc3 Be7', '7.Be3 O-O'],
      description: 'White develops the knight early — exchange, develop, and castle safely.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'pt-3',
      unlockedBy: 'pt-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'pt-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Petroff Defense — play the main line and handle every deviation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'pt-3',
      unlockedBy: 'pt-dev-nc3',
      side: 'black',
    },

    // === LEVEL 2 MAIN LINE ===
    {
      id: 'pt-4',
      name: 'Simplification',
      moves: ['12.bxc3 Nc6', '13.Re1 Bg4', '14.c5 Bxf3'],
      description: 'Retreat the knight, pin the bishop, and trade down into a clean position.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'pt-test-1',
      unlockedBy: 'pt-test-1',
      side: 'black',
    },
    {
      id: 'pt-5',
      name: 'Queenside Pressure',
      moves: ['15.Bxf3 Bf6', '16.Rb1 Rb8', '17.Be2 Na5'],
      description: 'Reposition your bishop, seize the b-file, and plant the knight on a5.',
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'pt-4',
      unlockedBy: 'pt-dev-Bf4',
      side: 'black',
    },

    // === DEVIATION: 13.Bf4 instead of 13.Re1 (col -1) ===
    {
      id: 'pt-dev-Bf4',
      name: 'Dev 13.Bf4',
      moves: ['13.Bf4 Bg4', '14.Nd2 Bxe2', '15.Qxe2 Na5'],
      description: 'White develops the bishop to f4 — trade pieces and target the c4 pawn.',
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'pt-4',
      unlockedBy: 'pt-4',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'pt-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Petroff middlegame — main line and the Bf4 deviation.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'pt-5',
      unlockedBy: 'pt-5',
      side: 'black',
    },
  ],
}
