// French Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7 7.f4 O-O 8.Nf3 c5 9.dxc5 Nc6 10.Qd2 Qxc5 11.O-O-O f6 12.exf6 Nxf6
//
// GRID LAYOUT (10 nodes):
//   Row 4:                              fr-test-1 (col 0)
//   Row 3:    fr-4 (col 0)                             fr-winawer-2 (col 1)
//   Row 2:    fr-3 (col 0)                             fr-winawer-1 (col 1)
//   Row 1:    fr-punish-bd3 (col -1)    fr-2 (col 0)   fr-tarrasch-1 (col 1)
//   Row 0:    fr-punish-e5 (col -1)     fr-1 (col 0)
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
    'fr-1', 'fr-2', 'fr-punish-e5', 'fr-punish-bd3',
    'fr-3', 'fr-tarrasch-1', 'fr-4', 'fr-winawer-1',
    'fr-winawer-2', 'fr-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'fr-1',
      name: 'The French Wall',
      moves: ['1.e4 e6', '2.d4 d5', '3.Nc3 Nf6'],
      description: 'Learn the French move order — e6, d5, Nf6. Build a solid wall in the center.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'fr-2',
      name: 'Pin & Resolve',
      moves: ['4.Bg5 Be7', '5.e5 Nfd7', '6.Bxe7 Qxe7'],
      description: 'Handle the Bg5 pin — play Be7, then retreat the knight after e5.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'fr-1',
      unlockedBy: 'fr-1',
      side: 'black',
    },
    {
      id: 'fr-3',
      name: 'Castle & Counter',
      moves: ['7.f4 O-O', '8.Nf3 c5', '9.dxc5 Nc6'],
      description: 'Castle to safety, then strike the center with c5! Open the position.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'fr-2',
      unlockedBy: 'fr-punish-bd3',
      side: 'black',
    },
    {
      id: 'fr-4',
      name: 'Break Through',
      moves: ['10.Qd2 Qxc5', '11.O-O-O f6', '12.exf6 Nxf6'],
      description: 'Win the pawn back, then smash through with f6 — open the position for your pieces.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'fr-3',
      unlockedBy: 'fr-tarrasch-1',
      side: 'black',
    },

    // === PUNISH: 3.e5? (too early advance, col -1) ===
    {
      id: 'fr-punish-e5',
      name: 'Punish 3.e5?',
      moves: ['3.e5? c5!', '4.c3 Nc6'],
      description: 'White pushes e5 too early — attack the center immediately with c5!',
      type: 'punish',
      row: 0,
      col: -1,
      lineFrom: 'fr-1',
      unlockedBy: 'fr-2',
      side: 'black',
    },

    // === PUNISH: 3.Bd3? (passive, col -1) ===
    {
      id: 'fr-punish-bd3',
      name: 'Punish 3.Bd3?',
      moves: ['3.Bd3? dxe4!', '4.Bxe4 Nf6'],
      description: 'White plays passively — win the center pawn and develop with tempo!',
      type: 'punish',
      row: 1,
      col: -1,
      lineFrom: 'fr-punish-e5',
      unlockedBy: 'fr-punish-e5',
      side: 'black',
    },

    // === TARRASCH (3.Nd2 branch, col 1) ===
    {
      id: 'fr-tarrasch-1',
      name: 'The Tarrasch',
      moves: ['3.Nd2 c5', '4.exd5 exd5', '5.Ngf3 Nc6'],
      description: 'The Tarrasch variation — White plays Nd2 instead of Nc3. Strike with c5!',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'fr-2',
      unlockedBy: 'fr-3',
      side: 'black',
    },

    // === WINAWER 1 (3...Bb4 branch, col 1) ===
    {
      id: 'fr-winawer-1',
      name: 'The Winawer',
      moves: ['3...Bb4', '4.e5 c5', '5.a3 Bxc3+'],
      description: 'The Winawer — pin the knight with Bb4, then sacrifice the bishop for a pawn storm.',
      type: 'branch',
      row: 2,
      col: 1,
      lineFrom: 'fr-tarrasch-1',
      unlockedBy: 'fr-4',
      side: 'black',
    },

    // === WINAWER 2 (continuation, col 1) ===
    {
      id: 'fr-winawer-2',
      name: 'Winawer Plans',
      moves: ['6.bxc3 Ne7', '7.Qg4 O-O', '8.Bd3 Nbc6'],
      description: 'Complete the Winawer setup — develop Ne7, castle, and bring the queenside knight into the fight.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'fr-winawer-1',
      unlockedBy: 'fr-winawer-1',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'fr-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the French — play the full Classical variation and handle every sideline.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'fr-4',
      unlockedBy: 'fr-winawer-2',
      side: 'black',
    },
  ],
}
