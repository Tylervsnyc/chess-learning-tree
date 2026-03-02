// Italian Game Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2
//            7...Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O
//
// GRID LAYOUT (10 lessons):
//   Row 4:                              it-test-1 (col 0)
//   Row 3:   it-4 (col 0)              it-fried-2 (col 1)
//   Row 2:   it-evans-1 (col -1)       it-3 (col 0)
//   Row 1:   it-two-knights (col -1)   it-2 (col 0)
//   Row 0:   it-punish-f6 (col -1)     it-1 (col 0)          it-fried-1 (col 1)
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
    'it-1', 'it-2', 'it-punish-f6', 'it-fried-1', 'it-3',
    'it-two-knights', 'it-fried-2', 'it-4', 'it-evans-1', 'it-test-1',
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
      moves: ['3...Bc5', '4.c3 Nf6', '5.d4'],
      description: 'Prepare the powerful d4 center push.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'it-1',
      unlockedBy: 'it-1',
      side: 'white',
    },
    {
      id: 'it-3',
      name: 'The Center Fork',
      moves: ['5...exd4', '6.cxd4 Bb4+', '7.Bd2'],
      description: 'Handle the check and maintain your powerful center.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'it-2',
      unlockedBy: 'it-fried-1',
      side: 'white',
    },
    {
      id: 'it-4',
      name: 'The Attack',
      moves: ['7...Bxd2+', '8.Nbxd2 d5', '9.exd5 Nxd5', '10.O-O'],
      description: 'Castle and develop — your center gives you a great game.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'it-3',
      unlockedBy: 'it-fried-2',
      side: 'white',
    },

    // === PUNISH: 2...f6?? (same row as it-1, col -1) ===
    {
      id: 'it-punish-f6',
      name: 'Punishing f6',
      moves: ['2...f6??', '3.Nxe5! fxe5', '4.Qh5+ g6', '5.Qxe5+'],
      description: 'Black defends e5 with f6 — sacrifice the knight, win the rook.',
      type: 'punish',
      row: 0,
      col: -1,
      lineFrom: 'it-1',
      unlockedBy: 'it-2',
      side: 'white',
    },

    // === FRIED LIVER (same row as it-1, col 1) ===
    {
      id: 'it-fried-1',
      name: 'The Fried Liver',
      moves: ['3...Nf6', '4.Ng5 d5', '5.exd5 Nxd5??', '6.Nxf7!'],
      description: 'The crowd-pleaser — sacrifice the knight on f7 for a devastating attack.',
      type: 'branch',
      row: 0,
      col: 1,
      lineFrom: 'it-1',
      unlockedBy: 'it-punish-f6',
      side: 'white',
    },

    // === FRIED LIVER CONT (same col as it-fried-1, col 1) ===
    {
      id: 'it-fried-2',
      name: 'Fried Liver Cont.',
      moves: ['6...Kxf7', '7.Qf3+ Ke6', '8.Nc3'],
      description: 'Continue the attack — the king walks into the open.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'it-fried-1',
      unlockedBy: 'it-two-knights',
      side: 'white',
    },

    // === TWO KNIGHTS (same row as it-2, col -1) ===
    {
      id: 'it-two-knights',
      name: 'Two Knights',
      moves: ['3...Nf6', '4.d4 exd4', '5.O-O'],
      description: 'Aggressive center play — sacrifice a pawn for rapid development.',
      type: 'branch',
      row: 1,
      col: -1,
      lineFrom: 'it-2',
      unlockedBy: 'it-3',
      side: 'white',
    },

    // === EVANS GAMBIT (same row as it-3, col -1) ===
    {
      id: 'it-evans-1',
      name: 'Evans Gambit',
      moves: ['3...Bc5', '4.b4!? Bxb4', '5.c3'],
      description: 'Sacrifice a pawn for rapid development and a powerful center.',
      type: 'branch',
      row: 2,
      col: -1,
      lineFrom: 'it-3',
      unlockedBy: 'it-4',
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
      unlockedBy: 'it-evans-1',
      side: 'white',
    },
  ],
}
