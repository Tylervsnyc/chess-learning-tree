// King's Indian Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.d4.
// Main line: 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5
//            7.O-O Nc6 8.d5 Ne7 9.b4 Nh5 10.Re1 f5 11.Ng5 Nf6 12.Bf3 c6
//
// 3 Black moves per lesson.
//
// GRID LAYOUT (12 lessons):
//   Row 8:                              ki-test-2 (col 0)
//   Row 7:                ki-7 (col 0)
//   Row 6:                ki-6 (col 0)
//   Row 5:   ki-dev-Bb2 (col -1)    ki-5 (col 0)
//   Row 4:                              ki-test-1 (col 0)
//   Row 3:                ki-4 (col 0)
//   Row 2:   ki-dev-Be3 (col -1)    ki-3 (col 0)
//   Row 1:   ki-dev-h3 (col -1)     ki-2 (col 0)
//   Row 0:                           ki-1 (col 0)
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
    'ki-1', 'ki-2', 'ki-dev-h3',
    'ki-3', 'ki-dev-Be3', 'ki-4',
    'ki-test-1',
    'ki-5', 'ki-dev-Bb2', 'ki-6',
    'ki-7', 'ki-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ki-1',
      name: 'The Setup',
      moves: ['1.d4 Nf6', '2.c4 g6', '3.Nc3 Bg7'],
      description: 'The King\'s Indian setup — Nf6, g6, Bg7. Build the fianchetto before striking.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ki-2',
      name: 'The Center Strike',
      moves: ['4.e4 d6', '5.Nf3 O-O', '6.Be2 e5'],
      description: 'Let White build a big center, castle, then strike with e5 — the King\'s Indian way.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'ki-1',
      unlockedBy: 'ki-1',
      side: 'black',
    },
    {
      id: 'ki-3',
      name: 'The Reroute',
      moves: ['7.O-O Nc6', '8.d5 Ne7', '9.b4 Nh5'],
      description: 'White closes the center — reroute your knights toward the kingside attack.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ki-2',
      unlockedBy: 'ki-dev-h3',
      side: 'black',
    },
    {
      id: 'ki-4',
      name: 'The Attack',
      moves: ['10.Re1 f5', '11.Ng5 Nf6', '12.Bf3 c6'],
      description: 'Launch f5, bring the knight back, and undermine d5 with c6.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'ki-3',
      unlockedBy: 'ki-dev-Be3',
      side: 'black',
    },

    // === DEVIATION: 5.h3 (instead of 5.Nf3) ===
    {
      id: 'ki-dev-h3',
      name: 'Dev 5.h3',
      moves: ['5.h3 O-O', '6.Be3 e5', '7.d5 Na6'],
      description: 'White plays h3 instead of Nf3 — castle, strike the center, and reroute the knight.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ki-2',
      unlockedBy: 'ki-2',
      side: 'black',
    },

    // === DEVIATION: 7.Be3 (instead of 7.O-O) ===
    {
      id: 'ki-dev-Be3',
      name: 'Dev 7.Be3',
      moves: ['7.Be3 Ng4', '8.Bg5 f6', '9.Bh4 g5'],
      description: 'White develops the bishop to e3 — attack it with Ng4 and chase it across the board.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'ki-3',
      unlockedBy: 'ki-3',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'ki-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the King\'s Indian — play the full main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'ki-4',
      unlockedBy: 'ki-4',
      side: 'black',
    },

    // === LEVEL 2: MAIN LINE (13.Be3 h6 ... 22.Bb3 Rf5) ===
    {
      id: 'ki-5',
      name: 'Forcing Trades',
      moves: ['13.Be3 h6', '14.Ne6 Bxe6', '15.dxe6 fxe4'],
      description: 'White tries to invade with the knight — trade it off and win material in the center.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'ki-test-1',
      unlockedBy: 'ki-test-1',
      side: 'black',
    },
    {
      id: 'ki-6',
      name: 'Recapturing',
      moves: ['16.Nxe4 Nxe4', '17.Bxe4 d5', '18.cxd5 cxd5'],
      description: 'Clear the center with precise trades, then break through with d5.',
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'ki-5',
      unlockedBy: 'ki-dev-Bb2',
      side: 'black',
    },
    {
      id: 'ki-7',
      name: 'The Counterattack',
      moves: ['19.Bc2 b6', '20.Qg4 e4', '21.Rad1 Qc7'],
      description: 'Secure the queenside, push the e-pawn forward, and centralize your queen.',
      type: 'main',
      row: 7,
      col: 0,
      lineFrom: 'ki-6',
      unlockedBy: 'ki-6',
      side: 'black',
    },

    // === DEVIATION: 13.Bb2 (instead of 13.Be3) ===
    {
      id: 'ki-dev-Bb2',
      name: 'Dev 13.Bb2',
      moves: ['13.Bb2 h6', '14.Ne6 Bxe6', '15.dxe6 fxe4'],
      description: 'White fianchettoes the bishop instead of Be3 — same idea, trade off the invading knight.',
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'ki-5',
      unlockedBy: 'ki-5',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'ki-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Level 2 continuation and handle the Bb2 deviation.',
      type: 'test',
      row: 8,
      col: 0,
      lineFrom: 'ki-7',
      unlockedBy: 'ki-7',
      side: 'black',
    },
  ],
}
