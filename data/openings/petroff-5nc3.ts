// Petroff Defense — 5.Nc3 Variation Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Nc3
// Main line: 5...Nxc3 6.dxc3 Be7 7.Be3 O-O 8.Qd2 Nd7
//            9.O-O-O Nf6 10.Bd3 c5 11.Rhe1 Be6 12.Kb1 Qa5
//
// 3 Black moves per lesson.
// 0 deviations — just 4 main lessons + level test.
//
// GRID LAYOUT (5 nodes):
//   Row 4:   p5-test-1 (col 0)
//   Row 3:   p5-4 (col 0)
//   Row 2:   p5-3 (col 0)
//   Row 1:   p5-2 (col 0)
//   Row 0:   p5-1 (col 0)
//
// ALL lines are purely vertical. No deviations.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PETROFF_5NC3: OpeningTree = {
  id: 'petroff-5nc3',
  name: 'Petroff: 5.Nc3 Variation',
  slug: 'petroff-5nc3',
  description: 'When White plays 5.Nc3, exchange the knights and develop smoothly with Be7 and O-O.',
  color: '#3498DB',
  colorDark: '#2980B9',
  completionOrder: [
    'p5-1', 'p5-2', 'p5-3', 'p5-4', 'p5-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'p5-1',
      name: 'The Petroff Setup',
      moves: ['1.e4 e5', '2.Nf3 Nf6', '3.Nxe5 d6'],
      description: 'Mirror White in the center and kick the knight back with d6.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'p5-2',
      name: 'Exchange on c3',
      moves: ['4.Nf3 Nxe4', '5.Nc3 Nxc3', '6.dxc3 Be7'],
      description: 'Grab the e4 pawn, trade the knights, and develop the bishop.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'p5-1',
      unlockedBy: 'p5-1',
      side: 'black',
    },
    {
      id: 'p5-3',
      name: 'Castle and Reroute',
      moves: ['7.Be3 O-O', '8.Qd2 Nd7', '9.O-O-O Nf6'],
      description: 'Castle to safety, develop the knight via d7, and reroute it to f6.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'p5-2',
      unlockedBy: 'p5-2',
      side: 'black',
    },
    {
      id: 'p5-4',
      name: 'Central Counterplay',
      moves: ['10.Bd3 c5', '11.Rhe1 Be6', '12.Kb1 Qa5'],
      description: 'Strike with c5, develop the bishop, and activate the queen.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'p5-3',
      unlockedBy: 'p5-3',
      side: 'black',
    },

    // === LEVEL TEST ===
    {
      id: 'p5-test-1',
      name: 'Level Test',
      moves: [],
      description: 'Prove you know the 5.Nc3 Petroff from start to finish.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'p5-4',
      unlockedBy: 'p5-4',
      side: 'black',
    },
  ],
}
