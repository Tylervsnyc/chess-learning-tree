// Sicilian Classical Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black in the Sicilian Classical.
// Identity moves: 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6
// Main line (Richter-Rauzer): 6.Bg5 e6 7.Qd2 a6 8.O-O-O Bd7
//   9.f4 b5 10.Bxf6 gxf6 11.Kb1 Qb6 12.Nxc6 Bxc6 13.f5 b4 14.Ne2 e5
//   15.Ng3 Be7 16.Bd3 Qc7 17.Qf2 O-O-O
//   18.Nh5 Kb8 19.Nxf6 Bxf6 20.c3 d5
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (10 nodes):
//   Row 6:                             sc-test-2 (col 0)
//   Row 5:  sc-dev-c3 (col -1)    sc-5 (col 0)
//   Row 4:                             sc-4 (col 0)
//   Row 3:                             sc-test-1 (col 0)
//   Row 2:  sc-dev-f3 (col -1)    sc-3 (col 0)
//   Row 1:                             sc-2 (col 0)
//   Row 0:                             sc-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_CLASSICAL: OpeningTree = {
  id: 'sicilian-classical',
  name: 'Sicilian Classical',
  slug: 'sicilian-classical',
  description: 'The Richter-Rauzer — sharp, double-edged, and full of fireworks.',
  color: '#9B59B6',
  colorDark: '#8E44AD',
  completionOrder: [
    'sc-1', 'sc-2', 'sc-3', 'sc-dev-f3', 'sc-test-1',
    'sc-4', 'sc-5', 'sc-dev-c3', 'sc-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sc-1',
      name: 'The Richter-Rauzer',
      moves: ['6.Bg5 e6', '7.Qd2 a6', '8.O-O-O Bd7'],
      description: 'White pins your knight and brings out the queen. You play e6, a6, and develop the bishop.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sc-2',
      name: 'Queenside Expansion',
      moves: ['9.f4 b5', '10.Bxf6 gxf6', '11.Kb1 Qb6'],
      description: 'Push b5 to expand, accept the doubled pawns, and activate the queen on b6.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sc-1',
      unlockedBy: 'sc-1',
      side: 'black',
    },
    {
      id: 'sc-3',
      name: 'Central Counterplay',
      moves: ['12.Nxc6 Bxc6', '13.f5 b4', '14.Ne2 e5'],
      description: 'Recapture on c6, push b4 to kick the knight, and lock the center with e5.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-2',
      side: 'black',
    },

    // === DEVIATION: 9.f3 (instead of 9.f4) ===
    {
      id: 'sc-dev-f3',
      name: 'Dev 9.f3',
      moves: ['9.f3 Be7', '10.h4 h6', '11.Be3 h5'],
      description: 'White plays f3 instead of f4 — develop the bishop, challenge the h-pawn, and lock the kingside.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'sc-3',
      unlockedBy: 'sc-3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sc-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sicilian Classical — play the full main line and handle the deviation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'sc-3',
      unlockedBy: 'sc-dev-f3',
      side: 'black',
    },

    // === LEVEL 2 MAIN LINE ===
    {
      id: 'sc-4',
      name: 'Knight Maneuvers',
      moves: ['15.Ng3 Be7', '16.Bd3 Qc7', '17.Qf2 O-O-O'],
      description: 'White repositions the knight. You develop the bishop, redirect the queen, and castle queenside.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'sc-test-1',
      unlockedBy: 'sc-test-1',
      side: 'black',
    },
    {
      id: 'sc-5',
      name: 'The Central Break',
      moves: ['18.Nh5 Kb8', '19.Nxf6 Bxf6', '20.c3 d5'],
      description: 'Tuck the king to safety, recapture the knight, and break through with d5.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'sc-4',
      unlockedBy: 'sc-4',
      side: 'black',
    },

    // === DEVIATION: 15.c3 (instead of 15.Ng3) ===
    {
      id: 'sc-dev-c3',
      name: 'Dev 15.c3',
      moves: ['15.c3 bxc3', '16.Nxc3 Be7', '17.Bd3 Qc7'],
      description: 'White challenges the b4 pawn immediately. You trade, develop, and redirect the queen.',
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'sc-5',
      unlockedBy: 'sc-5',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'sc-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Sicilian Classical middlegame — main line and the c3 deviation.',
      type: 'test',
      row: 6,
      col: 0,
      lineFrom: 'sc-5',
      unlockedBy: 'sc-dev-c3',
      side: 'black',
    },
  ],
}
