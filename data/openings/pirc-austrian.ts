// Pirc Defense — Austrian Attack Variation
// Standalone tree for the Austrian Attack (4.f4) line
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Nc6 7.Kh1 e5!
//
// GRID LAYOUT (10 lessons):
//   Row 4:                    pa-test-1 (col 0)
//   Row 3:  pa-punish-e5 (col -1)  pa-4 (col 0)    pa-punish-Nxe5 (col 1)
//   Row 2:  pa-punish-e5 (col -1)  pa-3 (col 0)
//   Row 1:                          pa-2 (col 0)
//   Row 0:                          pa-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PIRC_AUSTRIAN: OpeningTree = {
  id: 'pirc-austrian',
  name: 'Austrian Attack',
  slug: 'pirc-austrian',
  description: 'The Austrian Attack — White goes all-in with f4. Learn how to strike back with e5!',
  color: '#EC4D63',
  colorDark: '#D83A52',
  completionOrder: [
    'pa-1', 'pa-2', 'pa-3', 'pa-punish-e5',
    'pa-4', 'pa-punish-Nxe5', 'pa-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'pa-1',
      name: 'The Austrian Setup',
      moves: ['1.e4 d6', '2.d4 Nf6', '3.Nc3 g6'],
      description: 'The Pirc foundation — d6, Nf6, g6. White will respond with aggressive f4.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'pa-2',
      name: 'The Fianchetto & Castle',
      moves: ['4.f4 Bg7', '5.Nf3 O-O'],
      description: 'White pushes f4 aggressively. You fianchetto and castle — stay calm and focused.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'pa-1',
      unlockedBy: 'pa-1',
      side: 'black',
    },
    {
      id: 'pa-3',
      name: 'Face the Bd3',
      moves: ['6.Bd3 Nc6', '7.Kh1'],
      description: 'White develops the bishop to d3 and castles kingside (Kh1). Now prepare the key counterattack.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'pa-2',
      unlockedBy: 'pa-punish-e5',
      side: 'black',
    },
    {
      id: 'pa-4',
      name: 'Strike with e5!',
      moves: ['7...e5!', '8.fxe5 dxe5'],
      description: 'The key moment — strike at the center with e5! White\'s f4 pawn will fall, and you gain space.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'pa-3',
      unlockedBy: 'pa-punish-Nxe5',
      side: 'black',
    },

    // === PUNISH: White plays e5?! prematurely (same row as pa-3, col -1) ===
    {
      id: 'pa-punish-e5',
      name: 'Punish e5?!',
      moves: ['6.Bd3 Nc6', '7.e5?! dxe5', '8.fxe5 Nd5!'],
      description: 'White overextends with e5 before you strike. Centralize your knight with Nd5!',
      type: 'punish',
      row: 2,
      col: -1,
      lineFrom: 'pa-2',
      unlockedBy: 'pa-2',
      side: 'black',
    },

    // === PUNISH: White plays Nxe5?! (captures on e5, same row as pa-4, col 1) ===
    {
      id: 'pa-punish-Nxe5',
      name: 'Punish Nxe5?!',
      moves: ['7...e5!', '8.Nxe5? Nxe5', '9.fxe5 Nh7!'],
      description: 'If White greedily takes e5 with the knight, trade it off and reroute your knight to dominate.',
      type: 'punish',
      row: 3,
      col: 1,
      lineFrom: 'pa-3',
      unlockedBy: 'pa-4',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'pa-test-1',
      name: 'Austrian Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Austrian Attack — play the main line and handle every variation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'pa-4',
      unlockedBy: 'pa-punish-Nxe5',
      side: 'black',
    },
  ],
}
