// Caro-Kann Panov-Botvinnik Attack Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against the Panov.
// Main line: 1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4
//            7.cxd5 Nxd5 8.Bd2 Nc6 9.Bd3 O-O 10.O-O Be7 11.a3 Bf6
//            12.Qc2 g6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 4:  ckp-test-1 (col 0)
//   Row 3:  ckp-4 (col 0)
//   Row 2:  ckp-3 (col 0)
//   Row 1:  ckp-2 (col 0)  ckp-dev-c5 (col -1)
//   Row 0:  ckp-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const CARO_KANN_PANOV: OpeningTree = {
  id: 'caro-kann-panov',
  name: 'Caro-Kann Panov',
  slug: 'caro-kann-panov',
  description: 'The Panov-Botvinnik Attack — White plays c4 after the exchange on d5, creating an IQP structure. Black develops actively with Nf6, e6, and Bb4.',
  color: '#2FCBEF',
  colorDark: '#20A8D0',
  completionOrder: [
    'ckp-1', 'ckp-2', 'ckp-dev-c5', 'ckp-3', 'ckp-4', 'ckp-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ckp-1',
      name: 'The Panov Exchange',
      moves: ['1.e4 c6', '2.d4 d5', '3.exd5 cxd5'],
      description: 'Set up the Caro-Kann and allow the Panov exchange — c6, d5, then recapture on d5 to enter the IQP structure.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ckp-2',
      name: 'Active Development',
      moves: ['4.c4 Nf6', '5.Nc3 e6', '6.Nf3 Bb4'],
      description: 'Develop the knight to f6, close the center with e6, then pin the c3 knight with Bb4.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ckp-1',
      unlockedBy: 'ckp-1',
      side: 'black',
    },
    {
      id: 'ckp-3',
      name: 'Centralizing the Knight',
      moves: ['7.cxd5 Nxd5', '8.Bd2 Nc6', '9.Bd3 O-O'],
      description: 'Capture on d5 with the knight, bring out the second knight, then castle kingside to safety.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ckp-2',
      unlockedBy: 'ckp-dev-c5',
      side: 'black',
    },
    {
      id: 'ckp-4',
      name: 'Bishop Maneuver',
      moves: ['10.O-O Be7', '11.a3 Bf6', '12.Qc2 g6'],
      description: 'Retreat the bishop to avoid a3, then re-develop it actively to f6, and meet Qc2 with g6.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'ckp-3',
      unlockedBy: 'ckp-3',
      side: 'black',
    },

    // === DEVIATION: 6.c5 (col -1, row 1) ===
    {
      id: 'ckp-dev-c5',
      name: 'If 6.c5',
      moves: ['6.c5 Be7', '7.Nf3 O-O', '8.Bd3 b6'],
      description: 'White grabs space with c5 instead of developing — Black develops the bishop, castles, then challenges with b6.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ckp-2',
      unlockedBy: 'ckp-2',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ckp-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Caro-Kann Panov — play the full line and handle the c5 sideline.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'ckp-4',
      unlockedBy: 'ckp-4',
      side: 'black',
    },
  ],
}
