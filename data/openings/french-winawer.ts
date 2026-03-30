// French Winawer Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black in the French Winawer.
// Main line: 1.e4 e6 2.d4 d5 3.Nc3 Bb4
//            4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
//            7.Qg4 O-O 8.Bd3 Nbc6 9.Qh5 Ng6
//            10.Nf3 Qc7 11.Be3 c4 12.Bxg6 fxg6
//
// GRID LAYOUT (8 nodes):
//   Row 5:                                fw-test-1 (col 0)
//   Row 4:                                fw-4 (col 0)
//   Row 3:   fw-dev-Nf3 (col -1)     fw-3 (col 0)
//   Row 2:   fw-dev-Bd2 (col -1)     fw-2 (col 0)
//   Row 1:   fw-dev-exd5 (col -1)
//   Row 0:                            fw-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const FRENCH_WINAWER: OpeningTree = {
  id: 'french-winawer',
  name: 'French Winawer',
  slug: 'french-winawer',
  description: 'Pin the knight with Bb4 and fight for the center — sharp, strategic, and full of counterplay.',
  color: '#F59E0B',
  colorDark: '#D97706',
  completionOrder: [
    'fw-1', 'fw-2', 'fw-dev-exd5', 'fw-dev-Bd2',
    'fw-3', 'fw-dev-Nf3', 'fw-4', 'fw-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'fw-1',
      name: 'The Winawer Pin',
      moves: ['1.e4 e6', '2.d4 d5', '3.Nc3 Bb4'],
      description: 'Play e6, d5, and pin the knight with Bb4 — the Winawer Variation.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'fw-2',
      name: 'Into the Storm',
      moves: ['4.e5 c5', '5.a3 Bxc3+', '6.bxc3 Ne7'],
      description: 'Strike back with c5, exchange the bishop, and develop the knight.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'fw-1',
      unlockedBy: 'fw-1',
      side: 'black',
    },
    {
      id: 'fw-3',
      name: 'The Queen Attack',
      moves: ['7.Qg4 O-O', '8.Bd3 Nbc6', '9.Qh5 Ng6'],
      description: 'Castle into the queen attack and reroute the knight to defend.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'fw-2',
      unlockedBy: 'fw-dev-Bd2',
      side: 'black',
    },
    {
      id: 'fw-4',
      name: 'Counterplay',
      moves: ['10.Nf3 Qc7', '11.Be3 c4', '12.Bxg6 fxg6'],
      description: 'Activate the queen, push c4 to lock the bishop, and recapture on g6.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'fw-3',
      unlockedBy: 'fw-dev-Nf3',
      side: 'black',
    },

    // === DEVIATIONS ===
    {
      id: 'fw-dev-exd5',
      name: 'Dev 4.exd5',
      moves: ['4.exd5 exd5', '5.Bd3 Nc6', '6.a3 Bxc3+'],
      description: 'White captures on d5 early — recapture and develop naturally.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'fw-2',
      unlockedBy: 'fw-2',
      side: 'black',
    },
    {
      id: 'fw-dev-Bd2',
      name: 'Dev 5.Bd2',
      moves: ['5.Bd2 Ne7', '6.Nb5 Bxd2+', '7.Qxd2 O-O'],
      description: 'White tries Bd2 — develop the knight and trade bishops.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'fw-2',
      unlockedBy: 'fw-dev-exd5',
      side: 'black',
    },
    {
      id: 'fw-dev-Nf3',
      name: 'Dev 7.Nf3',
      moves: ['7.Nf3 Bd7', '8.a4 Qa5', '9.Bd2 Nbc6'],
      description: 'White develops the knight instead of Qg4 — play Bd7 and activate the queen.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'fw-3',
      unlockedBy: 'fw-3',
      side: 'black',
    },

    // === LEVEL TEST ===
    {
      id: 'fw-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the French Winawer — main line and all deviations.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'fw-4',
      unlockedBy: 'fw-4',
      side: 'black',
    },
  ] as OpeningNode[],
}
