// Caro-Kann Smyslov Variation Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6
//            7.N1f3 Bd6 8.Qe2 h6 9.Ne4 Nxe4 10.Qxe4 Qc7 11.O-O b6
//            12.Qg4 Kf8
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 5:  cks-test-1 (col 0)
//   Row 4:  cks-4 (col 0)
//   Row 3:  cks-dev-Qe2 (col -1)
//   Row 2:  cks-3 (col 0)              cks-dev-Bc4 (col 1)
//   Row 1:  cks-2 (col 0)  cks-dev-Bd3 (col -1)
//   Row 0:  cks-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const CARO_KANN_SMYSLOV: OpeningTree = {
  id: 'caro-kann-smyslov',
  name: 'Caro-Kann: Smyslov Variation',
  slug: 'caro-kann-smyslov',
  description: 'The knight-first defense — Black plays Nd7 instead of Bf5, keeping the center flexible and preparing a queenside knight tour.',
  color: '#2FCBEF',
  colorDark: '#20A8D0',
  completionOrder: [
    'cks-1', 'cks-2', 'cks-dev-Bd3', 'cks-dev-Bc4',
    'cks-3', 'cks-dev-Qe2', 'cks-4', 'cks-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'cks-1',
      name: 'The Smyslov Setup',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Start the Caro-Kann — c6, d5, then capture the e4 pawn.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'cks-2',
      name: 'Knight to d7',
      moves: ['4.Nxe4 Nd7', '5.Ng5 Ngf6', '6.Bd3 e6'],
      description: 'Play Nd7 instead of Bf5 — the Smyslov way. Develop toward the center and defend against Ng5.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'cks-1',
      unlockedBy: 'cks-1',
      side: 'black',
    },
    {
      id: 'cks-3',
      name: 'Bishop Out',
      moves: ['7.N1f3 Bd6', '8.Qe2 h6', '9.Ne4 Nxe4'],
      description: 'Develop the bishop to d6, kick the knight with h6, then trade knights on e4.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'cks-2',
      unlockedBy: 'cks-dev-Bc4',
      side: 'black',
    },
    {
      id: 'cks-4',
      name: 'King Steps Up',
      moves: ['10.Qxe4 Qc7', '11.O-O b6', '12.Qg4 Kf8'],
      description: "After the exchange, Qc7 protects, b6 prepares the bishop, and Kf8 sidesteps White's queen threats.",
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'cks-3',
      unlockedBy: 'cks-dev-Qe2',
      side: 'black',
    },

    // === DEVIATION: 5.Bd3 (col -1, row 1) ===
    {
      id: 'cks-dev-Bd3',
      name: 'If 5.Bd3',
      moves: ['5.Bd3 Ngf6', '6.Ng5 e6', '7.N1f3 Bd6'],
      description: 'White develops the bishop early — play Ngf6, hold e6, then put the bishop on d6.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'cks-2',
      unlockedBy: 'cks-2',
      side: 'black',
    },

    // === DEVIATION: 6.Bc4 (col 1, row 2) ===
    {
      id: 'cks-dev-Bc4',
      name: 'If 6.Bc4',
      moves: ['6.Bc4 e6', '7.Qe2 Nb6', '8.Bd3 h6'],
      description: 'White aims the bishop at f7 — close the diagonal with e6, kick the bishop back with Nb6, then chase the knight with h6.',
      type: 'deviation',
      row: 2,
      col: 1,
      lineFrom: 'cks-2',
      unlockedBy: 'cks-dev-Bd3',
      side: 'black',
    },

    // === DEVIATION: 7.Qe2 (col -1, row 3) ===
    {
      id: 'cks-dev-Qe2',
      name: 'If 7.Qe2',
      moves: ['7.Qe2 Bd6', '8.N1f3 h6', '9.Ne4 Nxe4'],
      description: 'White brings the queen out early — same plan, just Qe2 before N1f3. Develop normally.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'cks-3',
      unlockedBy: 'cks-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'cks-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Smyslov — play the full line and handle every sideline.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'cks-4',
      unlockedBy: 'cks-4',
      side: 'black',
    },
  ],
}
