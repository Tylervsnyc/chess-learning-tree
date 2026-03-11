// London System Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.d4 d5 2.Bf4 Nf6 3.e3 c5 4.c3 Nc6 5.Nd2 Bf5 6.Ngf3 Qb6
//            7.Nh4 Bd7 8.Qb3 c4 9.Qc2 Nh5 10.Bg3 Nxg3 11.hxg3
//
// 3 White moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 3:                              ln-test-1 (col 0)
//   Row 2:   ln-dev-e6-qb6 (col -1)    ln-3 (col 0)
//   Row 1:   ln-dev-e6 (col -1)         ln-2 (col 0)
//   Row 0:                              ln-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const LONDON_SYSTEM: OpeningTree = {
  id: 'london',
  name: 'London System',
  slug: 'london',
  description: 'The solid system — develop your bishop to f4, build a fortress, then attack.',
  color: '#6366F1',
  colorDark: '#4F46E5',
  completionOrder: [
    'ln-1', 'ln-2', 'ln-dev-e6', 'ln-3', 'ln-dev-e6-qb6', 'ln-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ln-1',
      name: 'The London Setup',
      moves: ['3.e3 c5', '4.c3 Nc6', '5.Nd2'],
      description: 'Build the London pyramid — pawns on c3, d4, e3 with a knight behind them.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'ln-2',
      name: 'The Knight Dance',
      moves: ['5...Bf5', '6.Ngf3 Qb6', '7.Nh4'],
      description: 'Develop both knights and leap to h4, targeting Black\'s bishop.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ln-1',
      unlockedBy: 'ln-1',
      side: 'white',
    },
    {
      id: 'ln-3',
      name: 'The Recapture',
      moves: ['7...Bd7', '8.Qb3 c4', '9.Qc2 Nh5', '10.Bg3 Nxg3', '11.hxg3'],
      description: 'Reposition the queen, retreat the bishop, and recapture with the h-pawn.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ln-2',
      unlockedBy: 'ln-dev-e6',
      side: 'white',
    },

    // === DEVIATION: 3...e6 instead of 3...c5 (28%) ===
    {
      id: 'ln-dev-e6',
      name: 'Dev 3...e6',
      moves: ['3...e6', '4.Nf3 c5', '5.c3 Nc6', '6.Nbd2'],
      description: 'Black plays e6 instead of c5 — develop the knight first, then build the same pyramid.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ln-1',
      unlockedBy: 'ln-2',
      side: 'white',
    },

    // === DEVIATION: 6...e6 instead of 6...Qb6 (44%) ===
    {
      id: 'ln-dev-e6-qb6',
      name: 'Dev 6...e6',
      moves: ['6...e6', '7.Qb3 Qb6', '8.Qxb6 axb6', '9.Nh4'],
      description: 'Black plays e6 instead of Qb6 — seize the initiative with Qb3, trade queens, and attack the bishop.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'ln-dev-e6',
      unlockedBy: 'ln-3',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ln-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the London — play the main line and handle every deviation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'ln-3',
      unlockedBy: 'ln-dev-e6-qb6',
      side: 'white',
    },
  ],
}
