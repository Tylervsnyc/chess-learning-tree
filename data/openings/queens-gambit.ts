// Queen's Gambit Declined Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.d4.
// Identity: 1.d4 d5 2.c4 e6 3.Nc3 Nf6
// Main line: 4.cxd5 exd5 5.Bg5 c6 6.e3 Be7 7.Bd3 Nbd7
//            8.Qc2 O-O 9.Nge2 Re8 10.O-O Nf8 11.f3 Be6
//            12.Rad1 Rc8
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (4 nodes):
//   Row 3: qg-test-1 (col 0)
//   Row 2: qg-3 (col 0)
//   Row 1: qg-2 (col 0)
//   Row 0: qg-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const QUEENS_GAMBIT_DECLINED: OpeningTree = {
  id: 'queens-gambit',
  name: "Queen's Gambit Declined",
  slug: 'queens-gambit',
  description: 'The most principled response to 1.d4. Solid, strategic, timeless.',
  color: '#FF6B8B',
  colorDark: '#D85070',
  completionOrder: [
    'qg-1', 'qg-2', 'qg-3', 'qg-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'qg-1',
      name: 'The Exchange',
      moves: ['4.cxd5 exd5', '5.Bg5 c6', '6.e3 Be7'],
      description: 'White exchanges on d5, pins your knight, and you hold the center.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'qg-2',
      name: 'Completing Development',
      moves: ['7.Bd3 Nbd7', '8.Qc2 O-O', '9.Nge2 Re8'],
      description: 'Develop the knight, castle to safety, and activate the rook.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'qg-1',
      unlockedBy: 'qg-1',
      side: 'black',
    },
    {
      id: 'qg-3',
      name: 'The Karlsbad Maneuver',
      moves: ['10.O-O Nf8', '11.f3 Be6', '12.Rad1 Rc8'],
      description: 'Reroute the knight to e6, develop the bishop, and prepare queenside play.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'qg-2',
      unlockedBy: 'qg-2',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'qg-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: "Play the full Queen's Gambit Declined from memory.",
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'qg-3',
      unlockedBy: 'qg-3',
      side: 'black',
    },
  ],
}
