// Sicilian Taimanov Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Identity moves: 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6
// Main line: 5.Nc3 Qc7 6.Be3 a6 7.Qd2 Nf6 8.O-O-O Bb4
//            9.f3 Ne5 10.Nb3 b5 11.Qe1 Be7 12.f4 Ng6
//            13.e5 Ng4 14.Ne4 O-O 15.Bc5 Bb7 16.h3 Nh6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (11 nodes):
//   Row 8:                             st-test-2 (col 0)
//   Row 7:                                                    st-dev-Be2 (col 1)
//   Row 6:  st-dev-g3 (col -1)
//   Row 5:                             st-dev-Nb5 (col 0)
//   Row 4:                             st-test-1 (col 0)
//   Row 3:  st-dev-Qf3 (col -1)  st-4 (col 0)
//   Row 2:  st-dev-Bd3 (col -1)  st-3 (col 0)
//   Row 1:                             st-2 (col 0)
//   Row 0:                             st-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_TAIMANOV: OpeningTree = {
  id: 'sicilian-taimanov',
  name: 'Sicilian Taimanov',
  slug: 'sicilian-taimanov',
  description: 'A flexible Sicilian with ...Nc6 and ...e6. Control the center, then counterattack.',
  color: '#3498DB',
  colorDark: '#2980B9',
  completionOrder: [
    'st-1', 'st-2', 'st-dev-Bd3', 'st-3', 'st-dev-Qf3', 'st-4', 'st-test-1',
    'st-dev-Nb5', 'st-dev-g3', 'st-dev-Be2', 'st-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'st-1',
      name: 'The Taimanov Setup',
      moves: ['5.Nc3 Qc7', '6.Be3 a6', '7.Qd2 Nf6'],
      description: 'Centralize the queen, grab space with a6, and develop the knight.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'st-2',
      name: 'Pinning and Expanding',
      moves: ['8.O-O-O Bb4', '9.f3 Ne5', '10.Nb3 b5'],
      description: 'Pin the knight, jump to e5, and expand on the queenside with b5.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'st-1',
      unlockedBy: 'st-1',
      side: 'black',
    },
    {
      id: 'st-3',
      name: 'Retreating and Regrouping',
      moves: ['11.Qe1 Be7', '12.f4 Ng6', '13.e5 Ng4'],
      description: 'Retreat the bishop, reroute the knight to g6, and jump into g4.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'st-2',
      unlockedBy: 'st-2',
      side: 'black',
    },
    {
      id: 'st-4',
      name: 'Castling and Completing',
      moves: ['14.Ne4 O-O', '15.Bc5 Bb7', '16.h3 Nh6'],
      description: 'Castle to safety, develop the bishop to b7, and retreat the knight.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'st-3',
      unlockedBy: 'st-3',
      side: 'black',
    },

    // === DEVIATION: 7.Bd3 (instead of 7.Qd2) ===
    {
      id: 'st-dev-Bd3',
      name: 'Dev 7.Bd3',
      moves: ['7.Bd3 Nf6', '8.O-O Ne5', '9.h3 Bc5'],
      description: 'White develops the bishop to d3 — develop the knight, jump to e5, and target d4 with Bc5.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'st-2',
      unlockedBy: 'st-2',
      side: 'black',
    },

    // === DEVIATION: 7.Qf3 (instead of 7.Qd2) ===
    {
      id: 'st-dev-Qf3',
      name: 'Dev 7.Qf3',
      moves: ['7.Qf3 Nf6', '8.O-O-O Ne5', '9.Qg3 b5'],
      description: 'White puts the queen on f3 — develop, jump to e5, and expand with b5.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'st-3',
      unlockedBy: 'st-dev-Bd3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'st-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sicilian Taimanov — play the full main line and handle the deviations.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'st-4',
      unlockedBy: 'st-dev-Qf3',
      side: 'black',
    },

    // === LEVEL 2 DEVIATIONS ===
    {
      id: 'st-dev-Nb5',
      name: 'Dev 5.Nb5',
      moves: ['5.Nb5 d6', '6.c4 Nf6', '7.N1c3 a6'],
      description: 'White jumps the knight to b5 early — block with d6, develop, and push a6 to chase it away.',
      type: 'deviation',
      row: 5,
      col: 0,
      lineFrom: 'st-test-1',
      unlockedBy: 'st-test-1',
      side: 'black',
    },
    {
      id: 'st-dev-g3',
      name: 'Dev 6.g3',
      moves: ['6.g3 a6', '7.Bg2 Nf6', '8.O-O Nxd4'],
      description: 'White fianchettoes with g3 — grab space with a6, develop the knight, and trade on d4.',
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'st-dev-Nb5',
      unlockedBy: 'st-dev-Nb5',
      side: 'black',
    },
    {
      id: 'st-dev-Be2',
      name: 'Dev 7.Be2',
      moves: ['7.Be2 Nf6', '8.O-O Bb4', '9.Na4 Be7'],
      description: 'White develops the bishop to e2 — play Nf6, pin with Bb4, then retreat to Be7.',
      type: 'deviation',
      row: 7,
      col: 1,
      lineFrom: 'st-dev-Nb5',
      unlockedBy: 'st-dev-g3',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'st-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Handle all the Level 2 deviations — 5.Nb5, 6.g3, and 7.Be2.',
      type: 'test',
      row: 8,
      col: 0,
      lineFrom: 'st-dev-Nb5',
      unlockedBy: 'st-dev-Be2',
      side: 'black',
    },
  ],
}
