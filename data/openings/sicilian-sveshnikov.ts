// Sicilian Sveshnikov Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Identity: 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5
// Main line: 6.Ndb5 d6 7.Bg5 a6 8.Na3 b5 9.Nd5 Be7 10.Bxf6 Bxf6
//            11.c3 O-O 12.Nc2 Bg5 13.a4 bxa4 14.Rxa4 a5
//            15.Bc4 Rb8 16.b3 Kh8 17.Nce3 g6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (6 nodes):
//   Row 4:                             sv-test-1 (col 0)
//   Row 3:                             sv-4 (col 0)
//   Row 2:  sv-dev-c4 (col -1)    sv-3 (col 0)
//   Row 1:                             sv-2 (col 0)
//   Row 0:                             sv-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_SVESHNIKOV: OpeningTree = {
  id: 'sicilian-sveshnikov',
  name: 'Sicilian Sveshnikov',
  slug: 'sicilian-sveshnikov',
  description: 'Fight for the center with e5 and let the tactics fly. An aggressive Sicilian for Black.',
  color: '#E67E22',
  colorDark: '#D35400',
  completionOrder: [
    'sv-1', 'sv-2', 'sv-3', 'sv-dev-c4', 'sv-4', 'sv-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sv-1',
      name: 'The Sveshnikov Setup',
      moves: ['6.Ndb5 d6', '7.Bg5 a6', '8.Na3 b5'],
      description: 'White jumps the knight to b5 and pins your knight. You fight back with a6 and b5.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sv-2',
      name: 'The Bishop Trade',
      moves: ['9.Nd5 Be7', '10.Bxf6 Bxf6', '11.c3 O-O'],
      description: 'White centralizes the knight and trades bishops. You develop and castle.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sv-1',
      unlockedBy: 'sv-1',
      side: 'black',
    },
    {
      id: 'sv-3',
      name: 'Pawn Storm',
      moves: ['12.Nc2 Bg5', '13.a4 bxa4', '14.Rxa4 a5'],
      description: 'Trade the dark-squared bishop, grab space, and lock down the queenside.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sv-2',
      unlockedBy: 'sv-2',
      side: 'black',
    },
    {
      id: 'sv-4',
      name: 'Kingside Prep',
      moves: ['15.Bc4 Rb8', '16.b3 Kh8', '17.Nce3 g6'],
      description: 'Activate the rook, tuck the king, and prepare f5.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sv-3',
      unlockedBy: 'sv-dev-c4',
      side: 'black',
    },

    // === DEVIATION: 11.c4 (instead of 11.c3) ===
    {
      id: 'sv-dev-c4',
      name: 'Dev 11.c4',
      moves: ['11.c4 b4', '12.Nc2 a5', '13.g3 O-O'],
      description: 'White pushes c4 to grab queenside space. You advance on the queenside and castle.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'sv-3',
      unlockedBy: 'sv-3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sv-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sveshnikov — play the full main line and handle the deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sv-4',
      unlockedBy: 'sv-4',
      side: 'black',
    },
  ],
}
