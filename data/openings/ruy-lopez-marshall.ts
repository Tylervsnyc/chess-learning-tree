// Ruy Lopez: Marshall Attack — Level 2
// After 7...O-O, Black unleashes the Marshall Gambit with d5.
// WHITE OPENING: User learns to accept and handle the Marshall.
//
// Main line: 8.c3 d5 9.exd5 Nxd5 10.Nxe5 Nxe5 11.Rxe5 c6
//            12.d4 Bd6 13.Re1 Qh4 14.g3 Qh3 15.Be3 Bg4
//            16.Qd3 Rae8 17.Nd2 Re6 18.a4 Qh5 19.axb5
//
// GRID LAYOUT:
//   Row 4: rlm-test-1 (col 0)
//   Row 3: rlm-4 (col 0)       rlm-dev-f5 (col -1)
//   Row 2: rlm-3 (col 0)
//   Row 1: rlm-2 (col 0)
//   Row 0: rlm-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const RUY_LOPEZ_MARSHALL: OpeningTree = {
  id: 'ruy-lopez-marshall',
  name: 'Marshall Attack',
  slug: 'ruy-lopez-marshall',
  description: 'Black sacrifices pawns for a fierce kingside attack. Learn how to survive and win.',
  color: '#FF9600',
  colorDark: '#CC7800',
  completionOrder: [
    'rlm-1', 'rlm-2', 'rlm-3', 'rlm-4', 'rlm-dev-f5', 'rlm-test-1',
  ],
  nodes: [

    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'rlm-1',
      name: 'Accept the Gambit',
      moves: ['8.c3 d5', '9.exd5 Nxd5', '10.Nxe5'],
      description: 'Black sacrifices a pawn with d5. Accept the gambit and win material.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'rlm-2',
      name: 'Seize the Center',
      moves: ['10...Nxe5', '11.Rxe5 c6', '12.d4 Bd6', '13.Re1'],
      description: 'Recapture, build the center, and retreat the rook to safety.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'rlm-1',
      unlockedBy: 'rlm-1',
      side: 'white',
    },
    {
      id: 'rlm-3',
      name: 'Survive the Attack',
      moves: ['13...Qh4', '14.g3 Qh3', '15.Be3 Bg4', '16.Qd3'],
      description: "Black's queen comes hunting. Defend calmly and develop.",
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'rlm-2',
      unlockedBy: 'rlm-2',
      side: 'white',
    },
    {
      id: 'rlm-4',
      name: 'Counterplay',
      moves: ['16...Rae8', '17.Nd2 Re6', '18.a4 Qh5', '19.axb5'],
      description: 'Finish development and launch your own queenside attack.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'rlm-3',
      unlockedBy: 'rlm-3',
      side: 'white',
    },

    // === MINOR VARIATIONS ===
    {
      id: 'rlm-dev-f5',
      name: 'If 16...f5',
      moves: ['16...f5', '17.f4'],
      description: 'Black pushes f5 instead of Rae8. Lock the kingside and simplify.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'rlm-4',
      unlockedBy: 'rlm-4',
      side: 'white',
    },

    // === LEVEL TEST ===
    {
      id: 'rlm-test-1',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Marshall Attack defense from memory.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'rlm-4',
      unlockedBy: 'rlm-dev-f5',
      side: 'white',
    },
  ],
}
