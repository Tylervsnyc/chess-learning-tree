// English Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.g3 d5 5.cxd5 Nxd5 6.Bg2 Nb6
//            7.O-O Be7 8.a3 O-O 9.b4 Be6 10.Rb1 f6
//            11.d3 a5 12.b5 Nd4 13.Nd2 Qc8
//
// 3 White moves per lesson.
//
// GRID LAYOUT (8 nodes):
//   Row 5:                             en-test-2 (col 0)
//   Row 4:                             en-4 (col 0)
//   Row 3:                             en-test-1 (col 0)
//   Row 2:  en-dev-Bb4 (col -1)   en-3 (col 0)   en-dev-Bc5 (col 1)
//   Row 1:                             en-2 (col 0)
//   Row 0:                             en-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const ENGLISH_OPENING: OpeningTree = {
  id: 'english',
  name: 'English Opening',
  slug: 'english',
  description: 'The flexible 1.c4 — control the center from the flank with a kingside fianchetto.',
  color: '#2ECC71',
  colorDark: '#27AE60',
  completionOrder: [
    'en-1', 'en-2', 'en-dev-Bb4', 'en-dev-Bc5', 'en-3', 'en-test-1',
    'en-4', 'en-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'en-1',
      name: 'The Fianchetto Setup',
      moves: ['2.Nc3 Nf6', '3.Nf3 Nc6', '4.g3 d5'],
      description: 'Develop both knights and prepare the kingside fianchetto with g3.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'en-2',
      name: 'Central Exchange',
      moves: ['5.cxd5 Nxd5', '6.Bg2 Nb6', '7.O-O Be7'],
      description: 'Capture the d5 pawn, fianchetto the bishop, and castle kingside.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'en-1',
      unlockedBy: 'en-1',
      side: 'white',
    },
    {
      id: 'en-3',
      name: 'Queenside Expansion',
      moves: ['8.a3 O-O', '9.b4 Be6', '10.Rb1 f6'],
      description: 'Expand on the queenside with a3, b4, and activate the rook.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'en-2',
      unlockedBy: 'en-dev-Bc5',
      side: 'white',
    },

    // === DEVIATION: 4...Bb4 (instead of 4...d5) ===
    {
      id: 'en-dev-Bb4',
      name: 'Dev 4...Bb4',
      moves: ['5.Bg2 O-O', '6.O-O e4', '7.Ng5'],
      description: 'Black pins the knight with Bb4 — fianchetto, castle, and counter the e4 push.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'en-3',
      unlockedBy: 'en-2',
      side: 'white',
    },

    // === DEVIATION: 6...Bc5 (instead of 6...Nb6) ===
    {
      id: 'en-dev-Bc5',
      name: 'Dev 6...Bc5',
      moves: ['7.O-O O-O', '8.d3 h6', '9.Nxd5'],
      description: 'Black develops the bishop actively to c5 — castle, play d3, and simplify with Nxd5.',
      type: 'deviation',
      row: 2,
      col: 1,
      lineFrom: 'en-3',
      unlockedBy: 'en-dev-Bb4',
      side: 'white',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'en-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the English Opening — play the full main line and handle the deviations.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'en-3',
      unlockedBy: 'en-3',
      side: 'white',
    },

    // === LEVEL 2 MAIN LINE ===
    {
      id: 'en-4',
      name: 'The Middlegame Plan',
      moves: ['11.d3 a5', '12.b5 Nd4', '13.Nd2 Qc8'],
      description: 'Solidify the center with d3, push b5 to lock the queenside, and reroute the knight.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'en-test-1',
      unlockedBy: 'en-test-1',
      side: 'white',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'en-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full English middlegame — from the opening through the queenside plan.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'en-4',
      unlockedBy: 'en-4',
      side: 'white',
    },
  ],
}
