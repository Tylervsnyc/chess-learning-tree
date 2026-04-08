// Queen's Gambit Accepted Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.d4 d5 2.c4.
// Identity: 1.d4 d5 2.c4 dxc4
// Main line: 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6
//            7.dxc5 Bxc5 8.Qxd8+ Kxd8 9.Be2 Ke7
//            10.Nbd2 Bd7 11.b3 Bb5 12.Nc4 Nbd7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 5:                              qga-test-1 (col 0)
//   Row 4:                              qga-4 (col 0)
//   Row 3:   qga-dev-7Qe2 (col -1)    qga-3 (col 0)
//   Row 2:                              qga-2 (col 0)        qga-dev-Nc3 (col 1)
//   Row 1:                                                    qga-dev-6Qe2 (col 1)
//   Row 0:                              qga-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const QUEENS_GAMBIT_ACCEPTED: OpeningTree = {
  id: 'queens-gambit-accepted',
  name: "Queen's Gambit Accepted",
  slug: 'queens-gambit-accepted',
  description: 'Accept the gambit pawn and fight for equality with active piece play.',
  color: '#FF6B8B',
  colorDark: '#D85070',
  completionOrder: [
    'qga-1', 'qga-2', 'qga-dev-Nc3', 'qga-dev-6Qe2',
    'qga-3', 'qga-dev-7Qe2', 'qga-4', 'qga-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'qga-1',
      name: 'Accept & Develop',
      moves: ['1.d4 d5', '2.c4 dxc4', '3.Nf3 Nf6'],
      description: 'Accept the gambit pawn and develop the knight to f6.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'qga-2',
      name: 'Return & Expand',
      moves: ['4.e3 e6', '5.Bxc4 c5', '6.O-O a6'],
      description: 'Return the pawn with e6, strike the center with c5, and prepare with a6.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'qga-1',
      unlockedBy: 'qga-1',
      side: 'black',
    },
    {
      id: 'qga-3',
      name: 'The Endgame',
      moves: ['7.dxc5 Bxc5', '8.Qxd8+ Kxd8', '9.Be2 Ke7'],
      description: 'Recapture on c5, handle the queen trade, and centralize the king.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'qga-2',
      unlockedBy: 'qga-dev-6Qe2',
      side: 'black',
    },
    {
      id: 'qga-4',
      name: 'The Bishop Pair',
      moves: ['10.Nbd2 Bd7', '11.b3 Bb5', '12.Nc4 Nbd7'],
      description: 'Develop the bishop, activate it on b5, and complete development with Nbd7.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'qga-3',
      unlockedBy: 'qga-dev-7Qe2',
      side: 'black',
    },

    // === DEVIATION: 4.Nc3 instead of 4.e3 (col 1, row 2) ===
    {
      id: 'qga-dev-Nc3',
      name: 'Dev 4.Nc3',
      moves: ['4.Nc3 a6', '5.e4 b5', '6.e5 Nd5'],
      description: 'White plays Nc3 and pushes e4 — counter with a6, b5, and Nd5.',
      type: 'deviation',
      row: 2,
      col: 1,
      lineFrom: 'qga-2',
      unlockedBy: 'qga-2',
      side: 'black',
    },

    // === DEVIATION: 6.Qe2 instead of 6.O-O (col 1, row 1) ===
    {
      id: 'qga-dev-6Qe2',
      name: 'Dev 6.Qe2',
      moves: ['6.Qe2 a6', '7.dxc5 Bxc5', '8.O-O Nc6'],
      description: 'White plays Qe2 instead of castling — develop naturally with a6, Bxc5, and Nc6.',
      type: 'deviation',
      row: 1,
      col: 1,
      lineFrom: 'qga-1',
      unlockedBy: 'qga-dev-Nc3',
      side: 'black',
    },

    // === DEVIATION: 7.Qe2 instead of 7.dxc5 (col -1, row 3) ===
    {
      id: 'qga-dev-7Qe2',
      name: 'Dev 7.Qe2',
      moves: ['7.Qe2 b5', '8.Bb3 Bb7', '9.Rd1 Nbd7'],
      description: 'White plays Qe2 instead of dxc5 — expand with b5, fianchetto the bishop, and develop.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'qga-3',
      unlockedBy: 'qga-3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'qga-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the QGA — play the main line and handle every deviation.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'qga-4',
      unlockedBy: 'qga-4',
      side: 'black',
    },
  ],
}
