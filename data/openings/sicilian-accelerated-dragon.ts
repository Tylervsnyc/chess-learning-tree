// Sicilian Accelerated Dragon Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black in the Sicilian Accelerated Dragon.
// Identity: 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6
// Main line (Maroczy Bind): 5.c4 Nf6 6.Nc3 d6 7.Be2 Nxd4 8.Qxd4 Bg7
//            9.Be3 O-O 10.Qd2 Be6 11.Rc1 Qa5 12.f3 Rfc8
//            13.b3 a6 14.Na4 Qxd2+ 15.Kxd2 Nd7 16.g4 f5
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 4:                             sa-test-1 (col 0)
//   Row 3:  sa-dev-Nd5 (col -1)   sa-4 (col 0)
//   Row 2:                             sa-3 (col 0)
//   Row 1:                             sa-2 (col 0)
//   Row 0:                             sa-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_ACCELERATED_DRAGON: OpeningTree = {
  id: 'sicilian-accelerated-dragon',
  name: 'Sicilian Accelerated Dragon',
  slug: 'sicilian-accelerated-dragon',
  description: 'The Maroczy Bind — fianchetto, develop, and squeeze White\'s center.',
  color: '#27AE60',
  colorDark: '#229954',
  completionOrder: [
    'sa-1', 'sa-2', 'sa-3', 'sa-4', 'sa-dev-Nd5', 'sa-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sa-1',
      name: 'The Maroczy Bind',
      moves: ['5.c4 Nf6', '6.Nc3 d6', '7.Be2 Nxd4'],
      description: 'White clamps down with c4. Develop the knight, push d6, and trade on d4.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sa-2',
      name: 'Fianchetto & Castle',
      moves: ['8.Qxd4 Bg7', '9.Be3 O-O', '10.Qd2 Be6'],
      description: 'Fianchetto the bishop, castle kingside, and develop the last minor piece.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sa-1',
      unlockedBy: 'sa-1',
      side: 'black',
    },
    {
      id: 'sa-3',
      name: 'Queenside Expansion',
      moves: ['11.Rc1 Qa5', '12.f3 Rfc8', '13.b3 a6'],
      description: 'Activate the queen, double rooks on the c-file, and prepare queenside play.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sa-2',
      unlockedBy: 'sa-2',
      side: 'black',
    },
    {
      id: 'sa-4',
      name: 'The Endgame Transition',
      moves: ['14.Na4 Qxd2+', '15.Kxd2 Nd7', '16.g4 f5'],
      description: 'Trade queens, reroute the knight, and challenge White\'s pawn center with f5.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sa-3',
      unlockedBy: 'sa-3',
      side: 'black',
    },

    // === DEVIATION: 14.Nd5 (instead of 14.Na4) ===
    {
      id: 'sa-dev-Nd5',
      name: 'Dev 14.Nd5',
      moves: ['14.Nd5 Qxd2+', '15.Kxd2 Nxd5', '16.cxd5 Bd7'],
      description: 'White jumps Nd5 — trade queens, capture the knight, and retreat the bishop.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'sa-4',
      unlockedBy: 'sa-4',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sa-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Accelerated Dragon main line and handle the Nd5 deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sa-4',
      unlockedBy: 'sa-dev-Nd5',
      side: 'black',
    },
  ],
}
