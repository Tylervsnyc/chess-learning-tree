// Pirc Defense — 150 Attack Variation
// Standalone tree for the 150 Attack (4.Be3) line
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 c6 5.Qd2 b5 6.Bd3 Nbd7
//            7.Nf3 e5 8.O-O Bg7 9.Bh6 O-O
//
// GRID LAYOUT (5 nodes):
//   Row 3:  p1a-test-1 (col 0)
//   Row 2:  p1a-3 (col 0)
//   Row 1:  p1a-dev-f3 (col -1)  p1a-2 (col 0)
//   Row 0:  p1a-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PIRC_150_ATTACK: OpeningTree = {
  id: 'pirc-150-attack',
  name: '150 Attack',
  slug: 'pirc-150-attack',
  description: 'The 150 Attack — White develops the bishop to e3 and queen to d2. Expand on the queenside with c6 and b5, then strike back with e5.',
  color: '#14B89A',
  colorDark: '#0E8F7A',
  completionOrder: [
    'p1a-1', 'p1a-2', 'p1a-dev-f3', 'p1a-3', 'p1a-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'p1a-1',
      name: 'The Pirc Setup',
      moves: ['1.e4 d6', '2.d4 Nf6', '3.Nc3 g6'],
      description: 'The Pirc foundation — d6, Nf6, g6. White will play Be3 for the 150 Attack.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'p1a-2',
      name: 'Queenside Expansion',
      moves: ['4.Be3 c6', '5.Qd2 b5', '6.Bd3 Nbd7'],
      description: 'White sets up Be3 + Qd2. Respond with c6, expand with b5, and develop the knight to d7.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'p1a-1',
      unlockedBy: 'p1a-1',
      side: 'black',
    },
    {
      id: 'p1a-3',
      name: 'Central Strike',
      moves: ['7.Nf3 e5', '8.O-O Bg7', '9.Bh6 O-O'],
      description: 'Strike the center with e5, fianchetto the bishop, and castle to safety.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'p1a-2',
      unlockedBy: 'p1a-dev-f3',
      side: 'black',
    },
    // === DEVIATIONS ===
    {
      id: 'p1a-dev-f3',
      name: 'After 5.f3',
      moves: ['5.f3 b5', '6.Qd2 Nbd7', '7.g4 Nb6'],
      description: 'White plays f3 instead of Qd2 — a more aggressive pawn push. Expand on the queenside and reroute the knight.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'p1a-2',
      unlockedBy: 'p1a-2',
      side: 'black',
    },
    // === LEVEL TEST ===
    {
      id: 'p1a-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the 150 Attack — main line and deviations, no hints.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'p1a-3',
      unlockedBy: 'p1a-3',
      side: 'black',
    },
  ],
}
