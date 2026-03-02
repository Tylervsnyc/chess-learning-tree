// Pirc Defense Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black against 1.e4.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c5 (Classical)
//
// GRID LAYOUT (10 lessons):
//   Row 4:                      pi-test-1 (col 0)
//   Row 3:    pi-4 (col 0)          pi-classical-1 (col 1)
//   Row 2:    pi-3 (col 0)          pi-austrian-2 (col 1)
//   Row 1:    pi-punish-Bc4 (col -1)  pi-2 (col 0)    pi-austrian-1 (col 1)
//   Row 0:    pi-punish-f4 (col -1)   pi-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PIRC_DEFENSE: OpeningTree = {
  id: 'pirc-defense',
  name: 'Pirc Defense',
  slug: 'pirc-defense',
  description: 'A hypermodern opening — let White build a big center, then tear it apart.',
  color: '#6366F1',
  colorDark: '#4F46E5',
  completionOrder: [
    'pi-1', 'pi-2', 'pi-punish-f4', 'pi-punish-Bc4',
    'pi-3', 'pi-austrian-1', 'pi-4', 'pi-austrian-2',
    'pi-classical-1', 'pi-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'pi-1',
      name: 'The Pirc Setup',
      moves: ['1.e4 d6', '2.d4 Nf6', '3.Nc3 g6'],
      description: 'Learn the Pirc Defense move order — d6, Nf6, g6. Let White build, then undermine.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'pi-2',
      name: 'The Dragon Bishop',
      moves: ['4.Nf3 Bg7', '5.Be2 O-O'],
      description: 'Complete the fianchetto and castle. Your bishop on g7 is a monster.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'pi-1',
      unlockedBy: 'pi-1',
      side: 'black',
    },
    {
      id: 'pi-3',
      name: 'Strike ...c5!',
      moves: ['6.O-O c5'],
      description: 'Strike at White\'s center with ...c5! The Pirc comes alive.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'pi-2',
      unlockedBy: 'pi-punish-Bc4',
      side: 'black',
    },
    {
      id: 'pi-4',
      name: 'After ...c5',
      moves: ['7.Be3 Nc6', '8.Qd2 e5'],
      description: 'Develop your knight, then break open the center with ...e5!',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'pi-3',
      unlockedBy: 'pi-austrian-1',
      side: 'black',
    },

    // === PUNISH: White overextends with f4+e5 (same row as pi-1, col -1) ===
    {
      id: 'pi-punish-f4',
      name: 'Punish e5?!',
      moves: ['4.f4 Bg7', '5.e5?! dxe5', '6.fxe5 Nd5!'],
      description: 'White pushes too early — exploit the weakened center with Nd5!',
      type: 'punish',
      row: 0,
      col: -1,
      lineFrom: 'pi-1',
      unlockedBy: 'pi-2',
      side: 'black',
    },

    // === PUNISH: White plays Bc4 early (same row as pi-2, col -1) ===
    {
      id: 'pi-punish-Bc4',
      name: 'Punish Bc4?',
      moves: ['5.Bc4? Nxe4!', '6.Nxe4 d5!'],
      description: 'White develops the bishop but leaves e4 unguarded. Fork them!',
      type: 'punish',
      row: 1,
      col: -1,
      lineFrom: 'pi-2',
      unlockedBy: 'pi-punish-f4',
      side: 'black',
    },

    // === AUSTRIAN ATTACK (same row as pi-2, col 1) ===
    {
      id: 'pi-austrian-1',
      name: 'Facing the Austrian',
      moves: ['4.f4 Bg7', '5.Nf3 O-O'],
      description: 'White plays aggressively with f4. Stay calm — fianchetto and castle.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'pi-2',
      unlockedBy: 'pi-3',
      side: 'black',
    },

    // === AUSTRIAN ATTACK DEEPER (same col as pi-austrian-1, col 1) ===
    {
      id: 'pi-austrian-2',
      name: 'Austrian ...c5!',
      moves: ['6.Bd3 c5'],
      description: 'Strike at the Austrian center with ...c5! Same idea, different setup.',
      type: 'branch',
      row: 2,
      col: 1,
      lineFrom: 'pi-austrian-1',
      unlockedBy: 'pi-4',
      side: 'black',
    },

    // === CLASSICAL Be3 (same row as pi-4, col 1) ===
    {
      id: 'pi-classical-1',
      name: 'Classical Be3',
      moves: ['7.Be3 Nc6', '8.d5 Na5'],
      description: 'When White locks the center, reroute your knight to attack from the side.',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'pi-4',
      unlockedBy: 'pi-austrian-2',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'pi-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Pirc Defense — play the full line and handle every variation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'pi-4',
      unlockedBy: 'pi-classical-1',
      side: 'black',
    },
  ],
}
