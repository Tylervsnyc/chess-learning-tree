// Sicilian Kan/Paulsen Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Bd3 Bc5
//            6.Nb3 Be7 7.Qg4 g6 8.Qe2 d6 9.O-O Nd7 10.Nc3 Qc7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (4 nodes):
//   Row 2:                             sk-test-1 (col 0)
//   Row 1:  sk-dev-OO (col -1)    sk-2 (col 0)
//   Row 0:                             sk-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_KAN: OpeningTree = {
  id: 'sicilian-kan',
  name: 'Sicilian Kan',
  slug: 'sicilian-kan',
  description: 'A flexible Sicilian where ...a6 keeps all options open. Subtle and tricky.',
  color: '#1ABC9C',
  colorDark: '#16A085',
  completionOrder: [
    'sk-1', 'sk-2', 'sk-dev-OO', 'sk-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sk-1',
      name: 'Bishop Maneuver',
      moves: ['5.Bd3 Bc5', '6.Nb3 Be7', '7.Qg4 g6'],
      description: 'Develop the bishop to c5, retreat to e7, and answer the queen attack with g6.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sk-2',
      name: 'Solid Setup',
      moves: ['8.Qe2 d6', '9.O-O Nd7', '10.Nc3 Qc7'],
      description: 'Build a solid center with d6, develop the knight, and activate the queen.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sk-1',
      unlockedBy: 'sk-1',
      side: 'black',
    },

    // === DEVIATION: 7.O-O (instead of 7.Qg4) ===
    {
      id: 'sk-dev-OO',
      name: 'Dev 7.O-O',
      moves: ['7.O-O d6', '8.c4 Nf6', '9.Nc3 b6'],
      description: 'White castles early instead of playing Qg4 — set up with d6, Nf6, and b6.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'sk-2',
      unlockedBy: 'sk-2',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sk-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sicilian Kan — play the full main line and handle the deviation.',
      type: 'test',
      row: 2,
      col: 0,
      lineFrom: 'sk-2',
      unlockedBy: 'sk-dev-OO',
      side: 'black',
    },
  ],
}
