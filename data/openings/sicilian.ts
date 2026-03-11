// Sicilian Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line (Najdorf): 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6
//            6.Be3 e5 7.Nb3 Be6 8.f3 h5 9.Nd5 Bxd5 10.exd5 Nbd7
//            11.Qd2 g6 12.Be2 Bg7
// L2 continuation: 13.Ne2 Ne8 14.f4 a5 15.f5 a4 16.Nbd4 exd4 17.Nxd4 b3
//            18.Kb1 bxc2+ 19.Nxc2
//
// GRID LAYOUT (11 lessons):
//   Row 7:                                si-test-2 (col 0)
//   Row 6:   si-dev-fxe6 (col -1)     si-6 (col 0)
//   Row 5:                             si-5 (col 0)
//   Row 4:                             si-test-1 (col 0)
//   Row 3:                si-4 (col 0)
//   Row 2:   si-dev-Nf3 (col -1)    si-3 (col 0)
//   Row 1:   si-dev-Be2 (col -1)    si-2 (col 0)
//   Row 0:                           si-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_DEFENSE: OpeningTree = {
  id: 'sicilian',
  name: 'Sicilian Defense',
  slug: 'sicilian',
  description: "The Sicilian Najdorf — Black's sharpest weapon against 1.e4.",
  color: '#FF4B4B',
  colorDark: '#CC3C3C',
  completionOrder: [
    'si-1', 'si-2', 'si-dev-Be2',
    'si-3', 'si-dev-Nf3', 'si-4',
    'si-test-1',
    'si-5', 'si-6', 'si-dev-fxe6',
    'si-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'si-1',
      name: 'The Sicilian Move',
      moves: ['1.e4 c5', '2.Nf3 d6', '3.d4 cxd4'],
      description: 'The Sicilian move order — c5, d6, cxd4. Fight for the center on your terms.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'si-2',
      name: 'The Najdorf',
      moves: ['4.Nxd4 Nf6', '5.Nc3 a6', '6.Be3 e5'],
      description: 'The legendary Najdorf — a6 keeps options open, e5 grabs the center.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'si-1',
      unlockedBy: 'si-1',
      side: 'black',
    },
    {
      id: 'si-3',
      name: 'The Bishop Trade',
      moves: ['7.Nb3 Be6', '8.f3 h5', '9.Nd5 Bxd5'],
      description: 'Develop the bishop, push h5 aggressively, then trade on d5 to wreck White\'s pawns.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'si-2',
      unlockedBy: 'si-dev-Be2',
      side: 'black',
    },
    {
      id: 'si-4',
      name: 'Complete the Setup',
      moves: ['10.exd5 Nbd7', '11.Qd2 g6', '12.Be2 Bg7'],
      description: 'Finish development — knight on d7, fianchetto the bishop, and prepare to attack.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'si-3',
      unlockedBy: 'si-dev-Nf3',
      side: 'black',
    },

    // === DEVIATION: 6.Be2 (instead of 6.Be3) ===
    {
      id: 'si-dev-Be2',
      name: 'Dev 6.Be2',
      moves: ['6.Be2 e5', '7.Nb3 Be7', '8.O-O O-O'],
      description: 'White plays Be2 instead of Be3 — grab the center with e5 and develop smoothly.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'si-2',
      unlockedBy: 'si-2',
      side: 'black',
    },

    // === DEVIATION: 7.Nf3 (instead of 7.Nb3) ===
    {
      id: 'si-dev-Nf3',
      name: 'Dev 7.Nf3',
      moves: ['7.Nf3 Be7', '8.Bc4 O-O', '9.O-O Be6'],
      description: 'White retreats to f3 and plays Bc4 — develop calmly and prepare to challenge the bishop.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'si-3',
      unlockedBy: 'si-3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'si-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sicilian Najdorf — play the full main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'si-4',
      unlockedBy: 'si-4',
      side: 'black',
    },

    // === LEVEL 2: MAIN LINE (center trunk, col 0) ===
    {
      id: 'si-5',
      name: 'The Counterattack',
      moves: ['13.Ne2 Ne8', '14.f4 a5', '15.f5 a4'],
      description: 'Retreat the knight to safety, then launch the a-pawn counterattack while White pushes on the kingside.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'si-test-1',
      unlockedBy: 'si-test-1',
      side: 'black',
    },
    {
      id: 'si-6',
      name: 'Breaking Through',
      moves: ['16.Nbd4 exd4', '17.Nxd4 b3', '18.Kb1 bxc2+'],
      description: 'Trade off the knight, push b3 into White\'s camp, and crack open the queenside with bxc2+.',
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'si-5',
      unlockedBy: 'si-5',
      side: 'black',
    },

    // === DEVIATION: 16.fxe6 (instead of 16.Nbd4) ===
    {
      id: 'si-dev-fxe6',
      name: 'Dev 16.fxe6',
      moves: ['16.fxe6 axb3', '17.cxb3 fxe6', '18.Bh3 Rxa2'],
      description: 'White captures on e6 — grab the b3 pawn, recapture, and invade on the a-file.',
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'si-6',
      unlockedBy: 'si-6',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'si-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Level 2 continuation and handle the fxe6 deviation.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'si-6',
      unlockedBy: 'si-dev-fxe6',
      side: 'black',
    },
  ],
}
