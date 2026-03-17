// French Defense Opening Tree Data (Winawer Variation)
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line (Winawer): 1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7
//                      7.Qg4 O-O 8.Bd3 Nbc6 9.Qh5 Ng6
//                      10.Nf3 Qc7 11.Be3 c4 12.Bxg6 fxg6
//                      13.O-O Bd7 14.Qg4 Rf5 15.Rab1 Raf8
//                      16.h3 h5 17.Qg3 Nxe5 18.Nxe5 Qxe5
//
// GRID LAYOUT (11 nodes):
//   Row 8:                     fr-test-2 (col 0)
//   Row 7:                     fr-6 (col 0)
//   Row 6:  fr-dev-Bd2 (-1)
//   Row 5:                     fr-5 (col 0)
//   Row 4:                     fr-test-1 (col 0)
//   Row 3:                     fr-4 (col 0)
//   Row 2:  fr-dev-Nf3 (-1)   fr-3 (col 0)
//   Row 1:  fr-dev-exd5 (-1)  fr-2 (col 0)
//   Row 0:                     fr-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const FRENCH_DEFENSE: OpeningTree = {
  id: 'french',
  name: 'French Defense',
  slug: 'french',
  description: 'The solid fortress — Black builds a wall with e6 and fights for the center with d5.',
  color: '#F59E0B',
  colorDark: '#D97706',
  completionOrder: [
    'fr-1', 'fr-2', 'fr-dev-exd5',
    'fr-3', 'fr-dev-Nf3', 'fr-4', 'fr-test-1',
    'fr-5', 'fr-dev-Bd2', 'fr-6', 'fr-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'fr-1',
      name: 'The French Wall',
      moves: ['1.e4 e6', '2.d4 d5', '3.Nc3 Bb4'],
      description: 'Build the wall with e6, challenge the center with d5, and pin the knight with Bb4.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'fr-2',
      name: 'The Winawer Strike',
      moves: ['4.e5 c5', '5.a3 Bxc3+', '6.bxc3 Ne7'],
      description: 'Undermine d4 with c5, double White\'s pawns with Bxc3+, and reroute the knight with Ne7.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'fr-1',
      unlockedBy: 'fr-1',
      side: 'black',
    },
    {
      id: 'fr-3',
      name: 'Castle & Develop',
      moves: ['7.Qg4 O-O', '8.Bd3 Nbc6', '9.Qh5 Ng6'],
      description: 'Castle before White\'s Qg4 gets dangerous, develop the queenside knight, and reroute Ne7 to g6.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'fr-2',
      unlockedBy: 'fr-dev-exd5',
      side: 'black',
    },
    {
      id: 'fr-4',
      name: 'The Squeeze',
      moves: ['10.Nf3 Qc7', '11.Be3 c4', '12.Bxg6 fxg6'],
      description: 'Connect rooks with Qc7, lock down the queenside with c4, and open the f-file with fxg6.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'fr-3',
      unlockedBy: 'fr-dev-Nf3',
      side: 'black',
    },

    // === DEVIATION: 4.exd5 (Exchange Variation, col -1) ===
    {
      id: 'fr-dev-exd5',
      name: 'Dev 4.exd5',
      moves: ['4.exd5 exd5', '5.Bd3 Nc6', '7...Nge7'],
      description: 'White trades pawns with exd5 — recapture, develop, and prepare Nge7.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'fr-1',
      unlockedBy: 'fr-2',
      side: 'black',
    },

    // === DEVIATION: 7.Nf3 (instead of 7.Qg4, col -1) ===
    {
      id: 'fr-dev-Nf3',
      name: 'Dev 7.Nf3',
      moves: ['7.Nf3 Bd7', '8.a4 Qa5', '9.Bd2 Nbc6'],
      description: 'White plays Nf3 instead of Qg4 — develop the bishop, activate the queen, and bring out the knight.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'fr-2',
      unlockedBy: 'fr-3',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'fr-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the French Winawer — play the main line from memory and handle every sideline.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'fr-4',
      unlockedBy: 'fr-4',
      side: 'black',
    },

    // === LEVEL 2 MAIN LINE ===
    {
      id: 'fr-5',
      name: 'The f-File',
      moves: ['13.O-O Bd7', '14.Qg4 Rf5', '15.Rab1 Raf8'],
      description: 'Develop the bishop, seize the open f-file, and double rooks for maximum pressure.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'fr-test-1',
      unlockedBy: 'fr-test-1',
      side: 'black',
    },
    {
      id: 'fr-6',
      name: 'The Breakthrough',
      moves: ['16.h3 h5', '17.Qg3 Nxe5', '18.Nxe5 Qxe5'],
      description: 'Push h5 to fix the kingside, then break through with Nxe5 to win the central pawn.',
      type: 'main',
      row: 7,
      col: 0,
      lineFrom: 'fr-5',
      unlockedBy: 'fr-dev-Bd2',
      side: 'black',
    },

    // === LEVEL 2 DEVIATION: 5.Bd2 instead of 5.a3 (col -1) ===
    {
      id: 'fr-dev-Bd2',
      name: 'Dev 5.Bd2',
      moves: ['5.Bd2 Ne7', '6.Nb5 Bxd2+', '7.Qxd2 O-O'],
      description: 'White plays Bd2 instead of a3 — trade bishops, castle quickly, and stay solid.',
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'fr-5',
      unlockedBy: 'fr-5',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'fr-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full French middlegame — main line and the Bd2 deviation.',
      type: 'test',
      row: 8,
      col: 0,
      lineFrom: 'fr-6',
      unlockedBy: 'fr-6',
      side: 'black',
    },
  ],
}
