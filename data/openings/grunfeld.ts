// Grünfeld Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.d4.
// Main line: 1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3
//            6.bxc3 Bg7 7.Bc4 c5 8.Ne2 Nc6 9.Be3 O-O 10.O-O Bg4
//            11.f3 Na5 12.Bd3 cxd4 13.cxd4 Be6 14.d5 Bxa1
//            15.Qxa1 f6 16.Bh6 Re8 17.Kh1 Rc8 18.Nf4 Bd7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 6:                             gr-test-2 (col 0)
//   Row 5:                             gr-5 (col 0)
//   Row 4:                             gr-4 (col 0)
//   Row 3:                             gr-test-1 (col 0)
//   Row 2:  gr-dev-Be3 (col -1)   gr-3 (col 0)
//   Row 1:                             gr-2 (col 0)
//   Row 0:                             gr-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const GRUNFELD_DEFENSE: OpeningTree = {
  id: 'grunfeld',
  name: 'Grünfeld Defense',
  slug: 'grunfeld',
  description: 'Sacrifice the center, then destroy it. A hypermodern classic.',
  color: '#9B59B6',
  colorDark: '#7D3C98',
  completionOrder: [
    'gr-1', 'gr-2', 'gr-3', 'gr-dev-Be3', 'gr-test-1',
    'gr-4', 'gr-5', 'gr-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'gr-1',
      name: 'The Exchange',
      moves: ['4.cxd5 Nxd5', '5.e4 Nxc3', '6.bxc3 Bg7'],
      description: 'White takes on d5, pushes e4, and you recapture with a knight exchange before fianchettoing.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'gr-2',
      name: 'Pressuring the Center',
      moves: ['7.Bc4 c5', '8.Ne2 Nc6', '9.Be3 O-O'],
      description: 'Strike the center with c5, develop the knight, and castle to safety.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'gr-1',
      unlockedBy: 'gr-1',
      side: 'black',
    },
    {
      id: 'gr-3',
      name: 'Queenside Play',
      moves: ['10.O-O Bg4', '11.f3 Na5', '12.Bd3 cxd4'],
      description: 'Pin the knight, reroute to a5, and open the center with cxd4.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'gr-2',
      unlockedBy: 'gr-2',
      side: 'black',
    },

    // === DEVIATION: 7.Be3 (instead of 7.Bc4) ===
    {
      id: 'gr-dev-Be3',
      name: 'Dev 7.Be3',
      moves: ['7.Be3 c5', '8.Qd2 Qa5', '9.Rc1 cxd4'],
      description: 'White develops the bishop to e3 — strike the center, activate the queen, and trade pawns.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'gr-3',
      unlockedBy: 'gr-3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'gr-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Grünfeld — play the full main line and handle the deviation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'gr-3',
      unlockedBy: 'gr-dev-Be3',
      side: 'black',
    },

    // === LEVEL 2 MAIN LINE ===
    {
      id: 'gr-4',
      name: 'The Exchange Sacrifice',
      moves: ['13.cxd4 Be6', '14.d5 Bxa1', '15.Qxa1 f6'],
      description: 'Sacrifice the exchange — give up a rook for White\'s bishop and seize the long diagonal.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'gr-test-1',
      unlockedBy: 'gr-test-1',
      side: 'black',
    },
    {
      id: 'gr-5',
      name: 'Regrouping',
      moves: ['16.Bh6 Re8', '17.Kh1 Rc8', '18.Nf4 Bd7'],
      description: 'Tuck the rooks into safety and reposition the bishop — set up for the counterstrike.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'gr-4',
      unlockedBy: 'gr-4',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'gr-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Grünfeld — main line through the exchange sacrifice and regrouping.',
      type: 'test',
      row: 6,
      col: 0,
      lineFrom: 'gr-5',
      unlockedBy: 'gr-5',
      side: 'black',
    },
  ],
}
