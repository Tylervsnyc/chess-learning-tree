// Sicilian Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5
//            7.Nb3 Be7 8.Qd2 O-O 9.O-O-O b5 10.f3 Bb7 11.Kb1 Nbd7 12.g4 Rc8
//
// GRID LAYOUT (10 lessons):
//   Row 4:                              sc-test-1 (col 0)
//   Row 3:    sc-4 (col 0)                             sc-classical-1 (col 1)
//   Row 2:    sc-3 (col 0)                             sc-dragon-2 (col 1)
//   Row 1:    sc-punish-bc4 (col -1)    sc-2 (col 0)   sc-dragon-1 (col 1)
//   Row 0:    sc-punish-qd4 (col -1)    sc-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_DEFENSE: OpeningTree = {
  id: 'sicilian',
  name: 'Sicilian Defense',
  slug: 'sicilian',
  description: 'The fighting defense — Black meets 1.e4 with asymmetric counterplay.',
  color: '#FF4B4B',
  colorDark: '#CC3C3C',
  completionOrder: [
    'sc-1', 'sc-2', 'sc-punish-qd4', 'sc-punish-bc4',
    'sc-3', 'sc-dragon-1', 'sc-4', 'sc-dragon-2',
    'sc-classical-1', 'sc-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sc-1',
      name: 'The Sicilian Move',
      moves: ['1.e4 c5', '2.Nf3 d6', '3.d4 cxd4'],
      description: 'Learn the Sicilian move order — c5, d6, cxd4. Fight for the d4 square.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sc-2',
      name: 'The Najdorf',
      moves: ['4.Nxd4 Nf6', '5.Nc3 a6', '6.Be3 e5'],
      description: 'The legendary Najdorf — a6 keeps options open, e5 grabs the center.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sc-1',
      unlockedBy: 'sc-1',
      side: 'black',
    },
    {
      id: 'sc-3',
      name: 'Castle & Attack',
      moves: ['7.Nb3 Be7', '8.Qd2 O-O', '9.O-O-O b5'],
      description: 'Castle kingside, then launch b5! Opposite-side castling means war.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-punish-bc4',
      side: 'black',
    },
    {
      id: 'sc-4',
      name: 'Complete the Setup',
      moves: ['10.f3 Bb7', '11.Kb1 Nbd7', '12.g4 Rc8'],
      description: 'Finish development — bishop on b7, knight on d7, rook on the c-file.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sc-3',
      unlockedBy: 'sc-dragon-1',
      side: 'black',
    },

    // === PUNISH: Qxd4? (same row as sc-1, col -1) ===
    {
      id: 'sc-punish-qd4',
      name: 'Punish Qxd4?',
      moves: ['2.d4 cxd4', '3.Qxd4? Nc6!'],
      description: 'White recaptures with the queen — develop with tempo and punish!',
      type: 'punish',
      row: 0,
      col: -1,
      lineFrom: 'sc-1',
      unlockedBy: 'sc-2',
      side: 'black',
    },

    // === PUNISH: 2.Bc4?! (same row as sc-2, col -1) ===
    {
      id: 'sc-punish-bc4',
      name: 'Punish 2.Bc4?',
      moves: ['2.Bc4?! e6!', '3.Nc3 d5!'],
      description: 'White plays an Italian-style bishop — block the diagonal and seize the center!',
      type: 'punish',
      row: 1,
      col: -1,
      lineFrom: 'sc-punish-qd4',
      unlockedBy: 'sc-punish-qd4',
      side: 'black',
    },

    // === DRAGON (same row as sc-2, col 1) ===
    {
      id: 'sc-dragon-1',
      name: 'The Dragon',
      moves: ['5...g6', '6.Be3 Bg7', '7.f3 O-O'],
      description: 'The Dragon variation — fianchetto the bishop and breathe fire down the long diagonal.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-3',
      side: 'black',
    },

    // === DRAGON 2 (same col as sc-dragon-1, col 1) ===
    {
      id: 'sc-dragon-2',
      name: 'Dragon Plans',
      moves: ['8.Qd2 Nc6', '9.Bc4 Bd7', '10.O-O-O Rc8'],
      description: 'Complete the Dragon setup — own the c-file and prepare the counterattack.',
      type: 'branch',
      row: 2,
      col: 1,
      lineFrom: 'sc-dragon-1',
      unlockedBy: 'sc-4',
      side: 'black',
    },

    // === CLASSICAL (same row as sc-4, col 1) ===
    {
      id: 'sc-classical-1',
      name: 'The Classical',
      moves: ['4...Nc6', '5.Nc3 Nf6', '6.Be2 e5'],
      description: 'The Classical Sicilian — both knights out, then strike the center with e5.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'sc-4',
      unlockedBy: 'sc-dragon-2',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'sc-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Sicilian — play the full Najdorf and handle every variation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sc-4',
      unlockedBy: 'sc-classical-1',
      side: 'black',
    },
  ],
}
