// Italian Two Knights Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White in the Two Knights.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Bc5 5.c3 d6 6.O-O
//            O-O 7.Re1 a5 8.h3 h6 9.Nbd2 Be6 10.Bb5 Qb8 11.Nf1 Qa7 12.Be3
//
// GRID LAYOUT (8 nodes):
//   Row 5:                            itk-test-1 (col 0)
//   Row 4:                            itk-4 (col 0)
//   Row 3:   itk-dev-a5 (col -1)      itk-3 (col 0)
//   Row 2:   itk-dev-O-O (col -1)
//   Row 1:   itk-dev-h6 (col -1)      itk-2 (col 0)
//   Row 0:                            itk-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const ITALIAN_TWO_KNIGHTS: OpeningTree = {
  id: 'italian-two-knights',
  name: 'Italian Two Knights',
  slug: 'italian-two-knights',
  description: 'The Two Knights Defense — Black plays Nf6 to counterattack your center. Stay solid with d3 and build a strong position.',
  color: '#58CC02',
  colorDark: '#3FA802',
  completionOrder: [
    'itk-1', 'itk-2', 'itk-dev-h6', 'itk-dev-O-O',
    'itk-3', 'itk-dev-a5', 'itk-4', 'itk-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'itk-1',
      name: 'The Italian Setup',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bc4'],
      description: 'Open with e4, develop the knight, and aim the bishop at f7.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'itk-2',
      name: 'The Two Knights Response',
      moves: ['3...Nf6 4.d3', '4...Bc5 5.c3', '5...d6 6.O-O'],
      description: 'Black plays Nf6 — respond with d3, c3, and castle safely.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'itk-1',
      unlockedBy: 'itk-1',
      side: 'white',
    },
    {
      id: 'itk-3',
      name: 'Building the Position',
      moves: ['6...O-O 7.Re1', '7...a5 8.h3', '8...h6 9.Nbd2'],
      description: 'Activate the rook, prevent back-rank tricks, and develop the knight.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'itk-2',
      unlockedBy: 'itk-dev-O-O',
      side: 'white',
    },
    {
      id: 'itk-4',
      name: 'Regrouping the Pieces',
      moves: ['9...Be6 10.Bb5', '10...Qb8 11.Nf1', '11...Qa7 12.Be3'],
      description: 'Reposition the bishop, regroup the knight, and develop the last piece.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'itk-3',
      unlockedBy: 'itk-dev-a5',
      side: 'white',
    },

    // === DEVIATION: 4...h6 (instead of 4...Bc5) ===
    {
      id: 'itk-dev-h6',
      name: 'Dev 4...h6',
      moves: ['4...h6 5.O-O', '5...d6 6.c3', '6...g6 7.d4'],
      description: 'Black plays h6 instead of Bc5 — castle, prepare c3, and push d4.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'itk-2',
      unlockedBy: 'itk-2',
      side: 'white',
    },

    // === DEVIATION: 5...O-O (instead of 5...d6) ===
    {
      id: 'itk-dev-O-O',
      name: 'Dev 5...O-O',
      moves: ['5...O-O 6.O-O', '6...d6 7.Re1', '7...a5 8.h3'],
      description: 'Black castles early — castle too, then develop normally.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'itk-2',
      unlockedBy: 'itk-dev-h6',
      side: 'white',
    },

    // === DEVIATION: 6...a5 (instead of 6...O-O) ===
    {
      id: 'itk-dev-a5',
      name: 'Dev 6...a5',
      moves: ['6...a5 7.Re1', '7...O-O 8.h3', '8...h6 9.Nbd2'],
      description: 'Black plays a5 instead of castling — activate the rook and continue development.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'itk-3',
      unlockedBy: 'itk-3',
      side: 'white',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'itk-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Two Knights main line and handle every deviation.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'itk-4',
      unlockedBy: 'itk-4',
      side: 'white',
    },
  ],
}
