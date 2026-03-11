// Pirc Defense — Austrian Attack (4.f4)
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Na6 7.O-O c5 8.d5 Bg4 9.Bc4 Nc7 10.h3 Bxf3
//
// Identity moves: 1.e4 d6
//
// GRID LAYOUT (6 nodes):
//   Row 3:                      pi-test-1 (col 0)
//   Row 2:  pi-dev-e5 (col -1)   pi-3 (col 0)
//   Row 1:  pi-dev-Be3 (col -1)  pi-2 (col 0)
//   Row 0:                      pi-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PIRC_DEFENSE: OpeningTree = {
  id: 'pirc-defense',
  name: 'Pirc Defense',
  slug: 'pirc-defense',
  description: 'A hypermodern defense — let White build a big center, then tear it apart with the Austrian Attack.',
  color: '#EC4899',
  colorDark: '#DB2777',
  completionOrder: [
    'pi-1', 'pi-2', 'pi-dev-Be3', 'pi-dev-e5', 'pi-3', 'pi-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'pi-1',
      name: 'The Pirc Setup',
      moves: ['2.d4 Nf6', '3.Nc3 g6', '4.f4 Bg7'],
      description: 'The Pirc move order — Nf6, g6, Bg7. Let White build a center, then prepare to strike.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'pi-2',
      name: 'Castle & Develop',
      moves: ['5.Nf3 O-O', '6.Bd3 Na6', '7.O-O c5'],
      description: 'Castle safely, develop the knight to a6, and strike at the center with c5.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'pi-1',
      unlockedBy: 'pi-1',
      side: 'black',
    },
    {
      id: 'pi-3',
      name: 'The Counterattack',
      moves: ['8.d5 Bg4', '9.Bc4 Nc7', '10.h3 Bxf3'],
      description: 'Pin the knight, reroute yours, then trade off the bishop on your terms.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'pi-2',
      unlockedBy: 'pi-dev-e5',
      side: 'black',
    },

    // === DEVIATION: White plays Be3 instead of Bd3 (14%) ===
    {
      id: 'pi-dev-Be3',
      name: 'If 6.Be3',
      moves: ['6.Be3 Na6', '7.Bd3 c5', '8.d5 Bg4'],
      description: 'White develops the bishop to e3 first. Same plan — Na6, c5, Bg4.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'pi-2',
      unlockedBy: 'pi-2',
      side: 'black',
    },

    // === DEVIATION: White plays e5 instead of O-O (10%) ===
    {
      id: 'pi-dev-e5',
      name: 'If 7.e5',
      moves: ['7.e5 dxe5', '8.fxe5 Nd7', '9.O-O c5'],
      description: 'White pushes e5 aggressively. Take it, retreat the knight, and counter with c5.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'pi-2',
      unlockedBy: 'pi-dev-Be3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'pi-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Pirc Defense — play the full line and handle every variation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'pi-3',
      unlockedBy: 'pi-3',
      side: 'black',
    },
  ],
}
