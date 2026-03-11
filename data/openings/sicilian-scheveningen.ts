// Sicilian Scheveningen Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Identity: 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6
// Main line (Be2 Classical):
//   6.Be2 Be7 7.O-O O-O 8.f4 Nc6 9.Be3 e5 10.Nb3 exf4 11.Bxf4 Be6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (4 nodes):
//   Row 2:                             ss-test-1 (col 0)
//   Row 1:  ss-dev-f4 (col -1)    ss-2 (col 0)
//   Row 0:                             ss-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_SCHEVENINGEN: OpeningTree = {
  id: 'sicilian-scheveningen',
  name: 'Sicilian Scheveningen',
  slug: 'sicilian-scheveningen',
  description: 'A flexible Sicilian setup with ...e6 — solid, dynamic, and full of counterplay.',
  color: '#F39C12',
  colorDark: '#E67E22',
  completionOrder: [
    'ss-1', 'ss-2', 'ss-dev-f4', 'ss-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ss-1',
      name: 'The Classical Setup',
      moves: ['6.Be2 Be7', '7.O-O O-O', '8.f4 Nc6'],
      description: 'Develop the bishop, castle kingside, and bring the knight into the game.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ss-2',
      name: 'The Central Break',
      moves: ['9.Be3 e5', '10.Nb3 exf4', '11.Bxf4 Be6'],
      description: 'Strike the center with e5, trade pawns, and develop the bishop.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ss-1',
      unlockedBy: 'ss-1',
      side: 'black',
    },

    // === DEVIATION: 6.f4 (instead of 6.Be2) ===
    {
      id: 'ss-dev-f4',
      name: 'Dev 6.f4',
      moves: ['6.f4 a6', '7.Qf3 Qb6', '8.Nb3 Qc7'],
      description: 'White plays f4 early — respond with a6 and activate the queen.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ss-2',
      unlockedBy: 'ss-2',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'ss-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Scheveningen — play the full main line and handle the deviation.',
      type: 'test',
      row: 2,
      col: 0,
      lineFrom: 'ss-2',
      unlockedBy: 'ss-dev-f4',
      side: 'black',
    },
  ],
}
