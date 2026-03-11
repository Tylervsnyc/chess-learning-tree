// Scotch Game Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Bb4 6.Nxc6 bxc6
//            7.Bd3 d5 8.exd5 cxd5 9.O-O O-O 10.Bg5 c6 11.Qf3
//
// 3 White moves per lesson.
//
// GRID LAYOUT (9 lessons):
//   Row 4:                              sc-test-1 (col 0)
//   Row 3:   sc-4 (col 0)              sc-steinitz-1 (col 1)
//   Row 2:   sc-dev-bc5 (col -1)    sc-3 (col 0)
//   Row 1:   sc-dev-d5 (col -1)     sc-2 (col 0)    sc-schmidt-1 (col 1)
//   Row 0:                              sc-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SCOTCH_GAME: OpeningTree = {
  id: 'scotch',
  name: 'Scotch Game',
  slug: 'scotch',
  description: 'Open the center with d4 and seize the initiative from move 3.',
  color: '#FFC800',
  colorDark: '#CC9E00',
  completionOrder: [
    'sc-1', 'sc-2', 'sc-dev-d5', 'sc-dev-bc5',
    'sc-3', 'sc-schmidt-1', 'sc-4', 'sc-steinitz-1',
    'sc-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sc-1',
      name: 'The Scotch Strike',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.d4 exd4', '4.Nxd4'],
      description: 'Open the center immediately with d4 — take back with the knight and dominate.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'sc-2',
      name: 'Four Knights',
      moves: ['4...Nf6', '5.Nc3 Bb4', '6.Nxc6'],
      description: 'Develop Nc3, then trade on c6 to damage Black\'s pawn structure.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sc-1',
      unlockedBy: 'sc-1',
      side: 'white',
    },
    {
      id: 'sc-3',
      name: 'Castle Up',
      moves: ['6...bxc6', '7.Bd3 d5', '8.exd5 cxd5', '9.O-O'],
      description: 'Develop the bishop, open the center, and castle — a textbook Scotch setup.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-dev-bc5',
      side: 'white',
    },
    {
      id: 'sc-4',
      name: 'Pin & Pressure',
      moves: ['9...O-O', '10.Bg5 c6', '11.Qf3'],
      description: 'Pin the knight with Bg5 and bring the queen to f3 — pressure on d5 and the kingside.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sc-3',
      unlockedBy: 'sc-schmidt-1',
      side: 'white',
    },

    // === PUNISH: 3...d5? (premature counter, col -1, row 0) ===
    {
      id: 'sc-dev-d5',
      name: 'Dev 3...d5?',
      moves: ['3...d5?', '4.exd5 Qxd5', '5.Nc3'],
      description: 'Black counter-gambits too early — win the pawn and develop with tempo on the queen.',
      type: 'deviation',
      row: 0,
      col: -1,
      lineFrom: 'sc-1',
      unlockedBy: 'sc-2',
      side: 'white',
    },

    // === PUNISH: 4...Bc5? (slow development, col -1, row 1) ===
    {
      id: 'sc-dev-bc5',
      name: 'Dev 4...Bc5?',
      moves: ['4...Bc5?', '5.Be3'],
      description: 'Black develops the bishop but hangs a tempo — Be3 challenges with development.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'sc-dev-d5',
      unlockedBy: 'sc-dev-d5',
      side: 'white',
    },

    // === BRANCH: Schmidt Variation (col 1, row 1) ===
    {
      id: 'sc-schmidt-1',
      name: 'Schmidt 4...d5',
      moves: ['4...d5', '5.exd5 Qxd5', '6.Nb5'],
      description: 'Black strikes the center with d5 — take, then jump Nb5 attacking c7.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-3',
      side: 'white',
    },

    // === BRANCH: Steinitz Variation (col 1, row 3) ===
    {
      id: 'sc-steinitz-1',
      name: 'Steinitz 4...Qh4',
      moves: ['4...Qh4', '5.Nc3'],
      description: 'Black brings the queen out early to h4 — develop calmly with Nc3.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'sc-4',
      unlockedBy: 'sc-4',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'sc-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Scotch — play the main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sc-4',
      unlockedBy: 'sc-steinitz-1',
      side: 'white',
    },
  ],
}
