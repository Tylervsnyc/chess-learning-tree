// Caro-Kann Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6
//            7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6 11.Bf4 Ngf6 12.O-O-O Be7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (10 nodes):
//   Row 4:                              ck-test-1 (col 0)
//   Row 3:    ck-4 (col 0)                             ck-twoknight-1 (col 1)
//   Row 2:    ck-exchange-1 (col -1)    ck-3 (col 0)   ck-advance-1 (col 1)
//   Row 1:    ck-dev-nf3 (col -1)    ck-2 (col 0)
//   Row 0:    ck-dev-e5 (col -1)     ck-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const CARO_KANN: OpeningTree = {
  id: 'caro-kann',
  name: 'Caro-Kann Defense',
  slug: 'caro-kann',
  description: 'The solid defense — Black plays c6 and d5, developing the bishop before locking it in.',
  color: '#10B981',
  colorDark: '#059669',
  completionOrder: [
    'ck-1', 'ck-2', 'ck-dev-nf3', 'ck-dev-e5',
    'ck-3', 'ck-advance-1', 'ck-4', 'ck-exchange-1',
    'ck-twoknight-1', 'ck-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ck-1',
      name: 'The Caro-Kann',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Learn the Caro-Kann move order — c6 prepares d5, then capture on e4.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ck-2',
      name: 'Bishop Out First',
      moves: ['4.Nxe4 Bf5', '5.Ng3 Bg6', '6.h4 h6'],
      description: 'The whole point of the Caro-Kann — get the bishop out BEFORE playing e6.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ck-1',
      unlockedBy: 'ck-1',
      side: 'black',
    },
    {
      id: 'ck-3',
      name: 'The Retreat',
      moves: ['7.Nf3 Nd7', '8.h5 Bh7', '9.Bd3 Bxd3'],
      description: 'Retreat the bishop to safety when White pushes h5 — then trade it off cleanly.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-dev-e5',
      side: 'black',
    },
    {
      id: 'ck-4',
      name: 'Complete the Setup',
      moves: ['10.Qxd3 e6', '11.Bf4 Ngf6', '12.O-O-O Be7'],
      description: 'Finish development — e6, Ngf6, Be7. A rock-solid position with no weaknesses.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'ck-3',
      unlockedBy: 'ck-advance-1',
      side: 'black',
    },

    // === PUNISH: 2.Nf3?! (wrong move order, col -1, row 0) ===
    {
      id: 'ck-dev-nf3',
      name: 'Dev 2.Nf3?',
      moves: ['2.Nf3?! d5', '3.exd5 cxd5'],
      description: 'White plays Nf3 instead of d4 — grab the ideal pawn center with cxd5!',
      type: 'deviation',
      row: 0,
      col: -1,
      lineFrom: 'ck-1',
      unlockedBy: 'ck-2',
      side: 'black',
    },

    // === PUNISH: 3.e5? (premature advance, col -1, row 1) ===
    {
      id: 'ck-dev-e5',
      name: 'Dev 3.e5?',
      moves: ['3.e5? Bf5', '4.Nf3 e6'],
      description: 'White pushes e5 too early — develop your bishop to its dream square before e6!',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ck-dev-nf3',
      unlockedBy: 'ck-dev-nf3',
      side: 'black',
    },

    // === ADVANCE VARIATION (3.e5 branch, col 1, row 2) ===
    {
      id: 'ck-advance-1',
      name: 'The Advance',
      moves: ['5.Be2 c5', '6.O-O Nc6'],
      description: 'The Advance variation — after 3.e5, strike back with c5 to undermine White\'s center.',
      type: 'branch',
      row: 2,
      col: 1,
      lineFrom: 'ck-2',
      unlockedBy: 'ck-3',
      side: 'black',
    },

    // === EXCHANGE VARIATION (3.exd5 cxd5, col -1, row 2) ===
    {
      id: 'ck-exchange-1',
      name: 'The Exchange',
      moves: ['3.exd5 cxd5', '4.Bd3 Nc6', '5.c3 Nf6'],
      description: 'The Exchange variation — White simplifies the center. Develop freely and equalize.',
      type: 'branch',
      row: 2,
      col: -1,
      lineFrom: 'ck-3',
      unlockedBy: 'ck-4',
      side: 'black',
    },

    // === TWO KNIGHTS (4...Nf6 branch, col 1, row 3) ===
    {
      id: 'ck-twoknight-1',
      name: 'Two Knights',
      moves: ['4...Nf6', '5.Nxf6+ exf6', '6.Bc4 Bd6'],
      description: 'The Two Knights variation — accept the doubled pawns, get the open e-file and bishop pair.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'ck-4',
      unlockedBy: 'ck-exchange-1',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ck-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Caro-Kann — play the full Classical variation and handle every sideline.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'ck-4',
      unlockedBy: 'ck-twoknight-1',
      side: 'black',
    },
  ],
}
