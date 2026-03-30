// Sicilian Najdorf Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black in the Sicilian Najdorf.
// Main line (English Attack): 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6
//            6.Be3 e5 7.Nb3 Be6 8.f3 h5 9.Nd5 Bxd5
//            10.exd5 Nbd7 11.Qd2 g6 12.Be2 Bg7
//
// GRID LAYOUT (8 nodes):
//   Row 5:                            sn-test-1 (col 0)
//   Row 4:                            sn-4 (col 0)
//   Row 3:   sn-dev-Qd2 (col -1)     sn-3 (col 0)
//   Row 2:   sn-dev-Nf3 (col -1)     sn-2 (col 0)    (deviations stay at row of main lesson they branch from — WRONG, they branch from lesson 3 so both at row 2/3)
//   Row 1:   sn-dev-Be2 (col -1)     sn-2 (col 0)
//   Row 0:                            sn-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_NAJDORF: OpeningTree = {
  id: 'sicilian-najdorf',
  name: 'Sicilian Najdorf',
  slug: 'sicilian-najdorf',
  description: 'The Najdorf — a6 followed by e5, the most popular Sicilian.',
  color: '#E74C3C',
  colorDark: '#C0392B',
  completionOrder: [
    'sn-1', 'sn-2', 'sn-dev-Be2',
    'sn-3', 'sn-dev-Nf3', 'sn-4', 'sn-dev-Qd2',
    'sn-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sn-1',
      name: 'The Najdorf Move',
      moves: ['1.e4 c5', '2.Nf3 d6', '3.d4 cxd4'],
      description: 'The Sicilian move order — c5, d6, and cxd4 to open the c-file.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sn-2',
      name: 'The a6 Idea',
      moves: ['4.Nxd4 Nf6', '5.Nc3 a6', '6.Be3 e5'],
      description: 'Play a6 — the Najdorf signature — then push e5 to challenge the center.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sn-1',
      unlockedBy: 'sn-1',
      side: 'black',
    },
    {
      id: 'sn-3',
      name: 'Bishop and Pawn Storm',
      moves: ['7.Nb3 Be6', '8.f3 h5', '9.Nd5 Bxd5'],
      description: 'Develop the bishop, push h5 to slow White\'s kingside, and trade on d5.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sn-2',
      unlockedBy: 'sn-dev-Be2',
      side: 'black',
    },
    {
      id: 'sn-4',
      name: 'The Najdorf Middlegame',
      moves: ['10.exd5 Nbd7', '11.Qd2 g6', '12.Be2 Bg7'],
      description: 'Regroup the knight, fianchetto the bishop, and prepare to castle.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sn-3',
      unlockedBy: 'sn-dev-Nf3',
      side: 'black',
    },

    // === DEVIATION: 6.Be2 (instead of 6.Be3) ===
    {
      id: 'sn-dev-Be2',
      name: 'Dev 6.Be2',
      moves: ['6.Be2 e5', '7.Nb3 Be7', '8.O-O O-O'],
      description: 'White plays Be2 instead of Be3 — push e5, develop, and castle.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'sn-2',
      unlockedBy: 'sn-2',
      side: 'black',
    },

    // === DEVIATION: 7.Nf3 (instead of 7.Nb3) ===
    {
      id: 'sn-dev-Nf3',
      name: 'Dev 7.Nf3',
      moves: ['7.Nf3 Be7', '8.Bc4 O-O', '9.O-O Be6'],
      description: 'White retreats to f3 — develop calmly, castle, and activate the bishop.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'sn-3',
      unlockedBy: 'sn-3',
      side: 'black',
    },

    // === DEVIATION: 8.Qd2 (instead of 8.f3) ===
    {
      id: 'sn-dev-Qd2',
      name: 'Dev 8.Qd2',
      moves: ['8.Qd2 Nbd7', '9.f3 b5', '10.O-O-O Be7'],
      description: 'White develops the queen early — regroup the knight, push b5, and develop.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'sn-4',
      unlockedBy: 'sn-4',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sn-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Najdorf main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sn-4',
      unlockedBy: 'sn-dev-Qd2',
      side: 'black',
    },
  ],
}
