// Italian Game Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O
//            7.Re1 a5 8.h3 h6 9.Nbd2 Be6 10.Bb5 Qb8 11.Nf1 Qa7 12.Be3
//
// GRID LAYOUT (6 lessons):
//   Row 4:   it-test-1 (col 0)
//   Row 3:   it-4 (col 0)
//   Row 2:   it-3 (col 0)
//   Row 1:   it-2 (col 0)        it-dev-Be7 (col -1)
//   Row 0:   it-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const ITALIAN_GAME: OpeningTree = {
  id: 'italian',
  name: 'Italian Game',
  slug: 'italian',
  description: 'The Giuoco Piano — open center, piece activity, and tactical fireworks.',
  color: '#58CC02',
  colorDark: '#46A302',
  completionOrder: [
    'it-1', 'it-2', 'it-dev-Be7', 'it-3', 'it-4', 'it-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'it-1',
      name: 'The Italian Setup',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bc4'],
      description: 'Develop your pieces and aim at the f7 weak point.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'it-2',
      name: 'Giuoco Piano',
      moves: ['3...Bc5', '4.c3 Nf6', '5.d3 d6', '6.O-O'],
      description: 'Build a solid center and castle early.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'it-1',
      unlockedBy: 'it-1',
      side: 'white',
    },
    {
      id: 'it-3',
      name: 'The Buildup',
      moves: ['6...O-O', '7.Re1 a5', '8.h3 h6', '9.Nbd2'],
      description: 'Strengthen your position with quiet, improving moves.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'it-2',
      unlockedBy: 'it-dev-Be7',
      side: 'white',
    },
    {
      id: 'it-4',
      name: 'The Plan',
      moves: ['9...Be6', '10.Bb5 Qb8', '11.Nf1 Qa7', '12.Be3'],
      description: 'Regroup your pieces and prepare for action.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'it-3',
      unlockedBy: 'it-3',
      side: 'white',
    },

    // === DEVIATION: 3...Be7 (col -1) ===
    {
      id: 'it-dev-Be7',
      name: 'If Be7',
      moves: ['3...Be7', '4.d4 d6', '5.dxe5 dxe5', '6.Qxd8+ Bxd8', '7.Nc3'],
      description: 'Black plays the passive Be7 — simplify and grab the center.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'it-1',
      unlockedBy: 'it-2',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'it-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Italian Game — play the main line and handle deviations.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'it-4',
      unlockedBy: 'it-4',
      side: 'white',
    },
  ],
}
