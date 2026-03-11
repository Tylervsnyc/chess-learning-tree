// King's Indian Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.d4.
// Main line: 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5
//            7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7 10.f3 f5 11.Be3 f4 12.Bf2 g5
//
// GRID LAYOUT (10 lessons):
//   Row 4:                              ki-test-1 (col 0)
//   Row 3:    ki-4 (col 0)                              ki-samisch-1 (col 1)
//   Row 2:    ki-3 (col 0)                              ki-four-pawns-1 (col 1)
//   Row 1:    ki-dev-bg5 (col -1)    ki-2 (col 0)    ki-classical-1 (col 1)
//   Row 0:    ki-dev-dxe5 (col -1)   ki-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const KINGS_INDIAN: OpeningTree = {
  id: 'kings-indian',
  name: "King's Indian Defense",
  slug: 'kings-indian',
  description: 'Let White build the center, then blow it up. The ultimate counterattack.',
  color: '#1CB0F6',
  colorDark: '#1490D0',
  completionOrder: [
    'ki-1', 'ki-2', 'ki-dev-bg5', 'ki-dev-dxe5',
    'ki-3', 'ki-classical-1', 'ki-4', 'ki-four-pawns-1',
    'ki-samisch-1', 'ki-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ki-1',
      name: 'The Setup',
      moves: ['1.d4 Nf6', '2.c4 g6', '3.Nc3 Bg7'],
      description: 'The King\'s Indian setup -- Nf6, g6, Bg7. Build the fianchetto before striking.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ki-2',
      name: 'The Center Fight',
      moves: ['4.e4 d6', '5.Nf3 O-O', '6.Be2 e5'],
      description: 'Let White build a big center, castle, then strike with e5 -- the King\'s Indian way.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ki-1',
      unlockedBy: 'ki-1',
      side: 'black',
    },
    {
      id: 'ki-3',
      name: 'The Pawn Storm',
      moves: ['7.O-O Nc6', '8.d5 Ne7', '9.Ne1 Nd7'],
      description: 'White closes the center with d5 -- reroute your pieces for the kingside attack.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ki-2',
      unlockedBy: 'ki-dev-dxe5',
      side: 'black',
    },
    {
      id: 'ki-4',
      name: 'Launch the Attack',
      moves: ['10.f3 f5', '11.Be3 f4', '12.Bf2 g5'],
      description: 'f5, f4, g5! The classic King\'s Indian pawn storm crashes into White\'s king.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'ki-3',
      unlockedBy: 'ki-classical-1',
      side: 'black',
    },

    // === PUNISH: 5.Bg5? (premature pin, col -1, row 0) ===
    {
      id: 'ki-dev-bg5',
      name: 'Dev 5.Bg5?',
      moves: ['5.Bg5? h6', '6.Bh4 g5', '7.Bg3 Nh5'],
      description: 'White pins your knight too early -- chase the bishop and take the dark squares!',
      type: 'deviation',
      row: 0,
      col: -1,
      lineFrom: 'ki-1',
      unlockedBy: 'ki-2',
      side: 'black',
    },

    // === PUNISH: 7.dxe5? (releases tension, col -1, row 1) ===
    {
      id: 'ki-dev-dxe5',
      name: 'Dev dxe5?',
      moves: ['7.dxe5? dxe5'],
      description: 'White trades in the center too early -- you get a great position with free development.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ki-dev-bg5',
      unlockedBy: 'ki-dev-bg5',
      side: 'black',
    },

    // === CLASSICAL VARIATION (col 1, row 1) ===
    {
      id: 'ki-classical-1',
      name: 'The Classical',
      moves: ['5.Nf3 O-O', '6.Be2 e5', '7.O-O Nc6'],
      description: 'The Classical KID -- White develops normally. You build the standard attacking setup.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'ki-2',
      unlockedBy: 'ki-3',
      side: 'black',
    },

    // === FOUR PAWNS ATTACK (col 1, row 2) ===
    {
      id: 'ki-four-pawns-1',
      name: 'Four Pawns Attack',
      moves: ['5.f4 c5', '6.d5 O-O'],
      description: 'White pushes f4 for a monster center -- strike back with c5 and play for counterplay.',
      type: 'branch',
      row: 2,
      col: 1,
      lineFrom: 'ki-classical-1',
      unlockedBy: 'ki-4',
      side: 'black',
    },

    // === SAMISCH (col 1, row 3) ===
    {
      id: 'ki-samisch-1',
      name: 'The Samisch',
      moves: ['5.f3 O-O', '6.Be3 e5', '7.d5 Nh5'],
      description: 'The Samisch -- White plays f3 to support e4. Castle and strike with e5 and Nh5.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'ki-four-pawns-1',
      unlockedBy: 'ki-four-pawns-1',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'ki-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the King\'s Indian -- play the full main line and handle every variation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'ki-4',
      unlockedBy: 'ki-samisch-1',
      side: 'black',
    },
  ],
}
