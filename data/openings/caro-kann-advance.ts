// Caro-Kann Advance Variation Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 3.e5.
// Main line: 1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 Nd7 6.O-O Ne7
//            7.Nbd2 h6 8.Nb3 g5 9.a4 Bg7
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (5 nodes):
//   Row 3:  cka-test-1 (col 0)
//   Row 2:  cka-3 (col 0)
//   Row 1:  cka-dev-Nc3 (col -1)  cka-2 (col 0)
//   Row 0:  cka-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const CARO_KANN_ADVANCE: OpeningTree = {
  id: 'caro-kann-advance',
  name: 'Caro-Kann Advance',
  slug: 'caro-kann-advance',
  description: 'The Advance Variation — White closes the center early. Get the bishop out to f5 before it gets locked in, then expand on the kingside.',
  color: '#2FCBEF',
  colorDark: '#20A8D0',
  completionOrder: [
    'cka-1', 'cka-2', 'cka-dev-Nc3', 'cka-3', 'cka-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'cka-1',
      name: 'Bishop Before the Wall',
      moves: ['1.e4 c6', '2.d4 d5', '3.e5 Bf5'],
      description: 'White closes the center — get the light-squared bishop out to f5 before playing e6 locks it in.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'cka-2',
      name: 'Solid Setup',
      moves: ['4.Nf3 e6', '5.Be2 Nd7', '6.O-O Ne7'],
      description: 'Support the d5 pawn with e6, develop the knight to d7, and follow up with Ne7 to prepare kingside action.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'cka-1',
      unlockedBy: 'cka-1',
      side: 'black',
    },
    {
      id: 'cka-3',
      name: 'Kingside Push',
      moves: ['7.Nbd2 h6', '8.Nb3 g5', '9.a4 Bg7'],
      description: 'Stake out kingside space with h6 and g5, then fianchetto the bishop to g7 to control the long diagonal.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'cka-2',
      unlockedBy: 'cka-dev-Nc3',
      side: 'black',
    },

    // === DEVIATION: 4.Nc3 (col -1, row 1) ===
    {
      id: 'cka-dev-Nc3',
      name: 'If 4.Nc3',
      moves: ['4.Nc3 e6', '5.g4 Bg6', '6.Nge2 c5'],
      description: 'White tries Nc3 instead of Nf3 and often follows with the aggressive g4. Retreat the bishop to g6, then strike back with c5.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'cka-2',
      unlockedBy: 'cka-2',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'cka-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Caro-Kann Advance — play the full main line and handle the Nc3 sideline.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'cka-3',
      unlockedBy: 'cka-3',
      side: 'black',
    },
  ],
}
