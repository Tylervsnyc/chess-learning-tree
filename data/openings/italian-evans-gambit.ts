// Italian Game: Evans Gambit — Level 1
// After 3...Bc5, White sacrifices a pawn with 4.b4 for rapid development and central control.
// WHITE OPENING: User learns to play the Evans Gambit attack.
//
// Main line: 4...Bxb4 5.c3 Ba5 6.d4 d6 7.Qb3 Qd7 8.O-O Bb6 9.Nbd2
//
// GRID LAYOUT:
//   Row 4: ieg-test-1 (col 0)
//   Row 3: ieg-dev-Bd6 (col -1)
//   Row 2:                         ieg-3 (col 0)
//   Row 1: ieg-dev-Bb6 (col -1)   ieg-2 (col 0)
//   Row 0:                         ieg-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const ITALIAN_EVANS_GAMBIT: OpeningTree = {
  id: 'italian-evans-gambit',
  name: 'Evans Gambit',
  slug: 'italian-evans-gambit',
  description: 'Sacrifice a pawn with 4.b4 for rapid development and a powerful center.',
  color: '#58CC02',
  colorDark: '#3FA802',
  completionOrder: [
    'ieg-1', 'ieg-2', 'ieg-dev-Bb6',
    'ieg-3', 'ieg-dev-Bd6',
    'ieg-test-1',
  ],
  nodes: [

    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ieg-1',
      name: 'The Gambit',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bc4'],
      description: 'Open with e4, develop the knight and bishop toward the center.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'ieg-2',
      name: 'Seize the Center',
      moves: ['4...Bxb4', '5.c3 Ba5', '6.d4'],
      description: 'After Black takes the pawn, play c3 and d4 to build a powerful center.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ieg-1',
      unlockedBy: 'ieg-1',
      side: 'white',
    },
    {
      id: 'ieg-3',
      name: 'Develop and Castle',
      moves: ['6...d6', '7.Qb3 Qd7', '8.O-O Bb6', '9.Nbd2'],
      description: 'Bring the queen to b3, castle, and develop the knight.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ieg-2',
      unlockedBy: 'ieg-dev-Bb6',
      side: 'white',
    },

    // === MINOR VARIATIONS ===
    {
      id: 'ieg-dev-Bb6',
      name: 'If 4...Bb6',
      moves: ['4...Bb6', '5.a4'],
      description: 'Black declines the gambit. Push a4 and develop with Nc3.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ieg-2',
      unlockedBy: 'ieg-2',
      side: 'white',
    },
    {
      id: 'ieg-dev-Bd6',
      name: 'If 5...Bd6',
      moves: ['5...Bd6', '6.d4'],
      description: 'Black retreats to d6 instead of a5. Push d4 and castle.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'ieg-3',
      unlockedBy: 'ieg-3',
      side: 'white',
    },

    // === LEVEL TEST ===
    {
      id: 'ieg-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Evans Gambit from memory.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'ieg-3',
      unlockedBy: 'ieg-dev-Bd6',
      side: 'white',
    },
  ],
}
