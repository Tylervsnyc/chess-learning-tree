// London System vs ...c5 Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White in the London vs ...c5.
// Main line: 1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Nf6 5.Nd2 Bf5 6.Ngf3
//            Qb6 7.Nh4 Bd7 8.Qb3 c4 9.Qc2 Nh5 10.Bg3 Nxg3 11.hxg3
//
// GRID LAYOUT (7 nodes):
//   Row 5:                            lvc-test-1 (col 0)
//   Row 4:                            lvc-4 (col 0)
//   Row 3:   lvc-dev-cxd4 (col -1)    lvc-3 (col 0)
//   Row 2:   lvc-dev-Nf6 (col -1)     lvc-2 (col 0)
//   Row 1:                            lvc-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const LONDON_VS_C5: OpeningTree = {
  id: 'london-vs-c5',
  name: 'London vs ...c5',
  slug: 'london-vs-c5',
  description: 'Handle Black\'s c5 counter-strike with a solid pawn structure and active pieces.',
  color: '#9060D8',
  colorDark: '#7040B0',
  completionOrder: [
    'lvc-1', 'lvc-2', 'lvc-dev-Nf6',
    'lvc-3', 'lvc-dev-cxd4', 'lvc-4',
    'lvc-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'lvc-1',
      name: 'The London Structure',
      moves: ['1.d4 d5', '2.Bf4 c5', '3.e3'],
      description: 'Set up the London pyramid with d4, Bf4, and e3.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'lvc-2',
      name: 'Developing Knights',
      moves: ['3...Nc6 4.c3', '4...Nf6 5.Nd2', '5...Bf5 6.Ngf3'],
      description: 'Lock the center with c3 and develop both knights.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'lvc-1',
      unlockedBy: 'lvc-1',
      side: 'white',
    },
    {
      id: 'lvc-3',
      name: 'The Knight Jump',
      moves: ['6...Qb6 7.Nh4', '7...Bd7 8.Qb3', '8...c4 9.Qc2'],
      description: 'Jump the knight to h4 and maneuver the queen.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'lvc-2',
      unlockedBy: 'lvc-dev-Nf6',
      side: 'white',
    },
    {
      id: 'lvc-4',
      name: 'The Bishop Trade',
      moves: ['9...Nh5 10.Bg3', '10...Nxg3 11.hxg3'],
      description: 'Retreat the bishop and open the h-file after the trade.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'lvc-3',
      unlockedBy: 'lvc-dev-cxd4',
      side: 'white',
    },

    // === DEVIATION: 3...Nf6 (instead of 3...Nc6) ===
    {
      id: 'lvc-dev-Nf6',
      name: 'Dev 3...Nf6',
      moves: ['3...Nf6 4.c3', '4...Nc6 5.Nd2', '5...Bf5 6.Ngf3'],
      description: 'Black develops the knight to f6 first instead of Nc6 — same plan, different order.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'lvc-2',
      unlockedBy: 'lvc-2',
      side: 'white',
    },

    // === DEVIATION: 5...cxd4 (instead of 5...Bf5) ===
    {
      id: 'lvc-dev-cxd4',
      name: 'Dev 5...cxd4',
      moves: ['5...cxd4 6.exd4', '6...Bf5 7.Ngf3', '7...e6 8.Qb3'],
      description: 'Black captures on d4 early — recapture and develop.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'lvc-3',
      unlockedBy: 'lvc-3',
      side: 'white',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'lvc-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full London vs ...c5 main line and handle every deviation.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'lvc-4',
      unlockedBy: 'lvc-4',
      side: 'white',
    },
  ],
}
