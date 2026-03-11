// Sicilian Alapin Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4 c5 2.c3.
// Main line: 1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6 6.cxd4 d6
//            7.Bc4 Nb6 8.Bb5 dxe5 9.Nxe5 Bd7 10.Nxd7 Qxd7
//            11.Nc3 e6 12.O-O Be7 13.Qg4 O-O
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 4:                             sl-test-1 (col 0)
//   Row 3:  sl-dev-Bb3 (col -1)   sl-4 (col 0)
//   Row 2:                             sl-3 (col 0)
//   Row 1:                             sl-2 (col 0)
//   Row 0:                             sl-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_ALAPIN: OpeningTree = {
  id: 'sicilian-alapin',
  name: 'Sicilian Alapin',
  slug: 'sicilian-alapin',
  description: 'White sidesteps the Open Sicilian with 2.c3. Fight back with Nf6 and take over the center.',
  color: '#95A5A6',
  colorDark: '#7F8C8D',
  completionOrder: [
    'sl-1', 'sl-2', 'sl-3', 'sl-4', 'sl-dev-Bb3', 'sl-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sl-1',
      name: 'Counter the Alapin',
      moves: ['2...Nf6 3.e5 Nd5', '4.d4 cxd4'],
      description: 'Challenge the center immediately — develop, retreat, and capture.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sl-2',
      name: 'Building Pressure',
      moves: ['5.Nf3 Nc6', '6.cxd4 d6', '7.Bc4 Nb6'],
      description: 'Develop the knight, prepare to dissolve the center, and force the bishop to move.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sl-1',
      unlockedBy: 'sl-1',
      side: 'black',
    },
    {
      id: 'sl-3',
      name: 'Dissolving the Center',
      moves: ['8.Bb5 dxe5', '9.Nxe5 Bd7', '10.Nxd7 Qxd7'],
      description: 'Capture the e5 pawn, develop the bishop to trade, and recapture with the queen.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sl-2',
      unlockedBy: 'sl-2',
      side: 'black',
    },
    {
      id: 'sl-4',
      name: 'Completing Development',
      moves: ['11.Nc3 e6', '12.O-O Be7', '13.Qg4 O-O'],
      description: 'Solidify with e6, develop the bishop, and castle to safety.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sl-3',
      unlockedBy: 'sl-3',
      side: 'black',
    },

    // === DEVIATION: 8.Bb3 (instead of 8.Bb5) ===
    {
      id: 'sl-dev-Bb3',
      name: 'Dev 8.Bb3',
      moves: ['8.Bb3 dxe5', '9.d5 Na5', '10.Nc3 Nxb3'],
      description: 'White keeps the bishop on b3 — capture the pawn, reroute the knight, and win the bishop pair.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'sl-4',
      unlockedBy: 'sl-4',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sl-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sicilian Alapin — play the full main line and handle the deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sl-4',
      unlockedBy: 'sl-dev-Bb3',
      side: 'black',
    },
  ],
}
