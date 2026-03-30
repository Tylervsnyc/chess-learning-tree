// Nimzo-Indian Saemisch (5.Ne2) Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Ne2
// Main line: 5...d5 6.a3 Be7 7.cxd5 exd5
//            8.Nf4 c6 9.Bd3 Re8 10.O-O Nbd7
//            11.f3 Nf8 12.Bc2 Ne6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 5:                            nis-test-1 (col 0)
//   Row 4:   nis-dev-b4 (col -1)      nis-4 (col 0)
//   Row 3:   nis-dev-Nf4 (col -1)     nis-3 (col 0)
//   Row 2:                            nis-2 (col 0)
//   Row 1:                            nis-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const NIMZO_INDIAN_SAEMISCH: OpeningTree = {
  id: 'nimzo-indian-saemisch',
  name: 'Nimzo-Indian Saemisch',
  slug: 'nimzo-indian-saemisch',
  description: 'White plays 5.Ne2 to keep the knight flexible. Strike the center with d5, retreat the bishop, and build a solid position.',
  color: '#8E44AD',
  colorDark: '#6C3483',
  completionOrder: [
    'nis-1', 'nis-2',
    'nis-3', 'nis-dev-Nf4', 'nis-dev-b4',
    'nis-4',
    'nis-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'nis-1',
      name: 'The Saemisch Setup',
      moves: ['1...Nf6', '2...e6', '3...Bb4'],
      description: 'Develop the knight, prepare the pin, and plant the bishop on b4.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'nis-2',
      name: 'Center Strike',
      moves: ['5...d5', '6...Be7', '7...exd5'],
      description: 'Strike the center with d5, retreat the bishop to e7, and recapture on d5.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'nis-1',
      unlockedBy: 'nis-1',
      side: 'black',
    },
    {
      id: 'nis-3',
      name: 'Solid Development',
      moves: ['8...c6', '9...Re8', '10...Nbd7'],
      description: 'Shore up the center with c6, activate the rook, and develop the knight.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'nis-2',
      unlockedBy: 'nis-2',
      side: 'black',
    },
    {
      id: 'nis-4',
      name: 'Knight Maneuver',
      moves: ['11...Nf8', '12...Ne6', '13...dxe4'],
      description: 'Reroute the knight via f8 to the powerful e6 outpost, then capture in the center.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'nis-3',
      unlockedBy: 'nis-dev-b4',
      side: 'black',
    },

    // === DEVIATIONS ===
    {
      id: 'nis-dev-Nf4',
      name: 'Dev 7.Nf4',
      moves: ['7...c6', '8...Nbd7', '9...exd5'],
      description: 'When White jumps the knight to f4 early, play c6, develop, and recapture on d5.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'nis-3',
      unlockedBy: 'nis-3',
      side: 'black',
    },
    {
      id: 'nis-dev-b4',
      name: 'Dev 8.b4',
      moves: ['8...c6', '9...Re8', '10...Nbd7'],
      description: 'When White expands with b4, stay solid with c6, Re8, and Nbd7.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'nis-4',
      unlockedBy: 'nis-dev-Nf4',
      side: 'black',
    },

    // === LEVEL TEST ===
    {
      id: 'nis-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Nimzo-Indian Saemisch.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'nis-4',
      unlockedBy: 'nis-4',
      side: 'black',
    },
  ],
}
