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
    'pi-5', 'pi-6', 'pi-punish-Nd5', 'pi-7',
    'pi-8', 'pi-classical-2', 'pi-test-2',
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
      moves: ['7.Be3 cxd4', '8.Nxd4 Nc6', '9.Nb3 Be6'],
      description: 'Trade the center pawn immediately with cxd4, then develop your knight and bishop actively.',
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
      moves: ['9.Nb3 Be6', '10.f4 Na5'],
      description: 'Develop your bishop actively after Nb3, then reroute your knight toward the c4 outpost.',
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

    // === LEVEL 2 (rows 5+) ===
    // Extends from pi-4 after 9.Nb3 Be6, continues with 10.f4 Rc8 11.Kh1 Na5 12.Bd3 Rc7

    // MAIN LINE: 10.f4, 11.Kh1, 12.Bd3
    {
      id: 'pi-5',
      name: 'Prophylactic Push',
      moves: ['10.f4 Rc8', '11.Kh1'],
      description: 'White pushes f4 to control the center. Black activates the rook. White tucks the king away prophylactically.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'pi-4',
      unlockedBy: 'pi-test-1',
      side: 'black',
    },

    // MAIN LINE: 12.Bd3 and beyond
    {
      id: 'pi-6',
      name: 'Center Play',
      moves: ['12.Bd3 Rc7', '13.e5 dxe5', '14.fxe5'],
      description: 'Consolidate with Bd3, then White pushes e5. Trading pawns, the position opens up.',
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'pi-5',
      unlockedBy: 'pi-5',
      side: 'black',
    },

    // PUNISH: After pi-4, White plays 10.Nd5? premature centralization
    {
      id: 'pi-punish-Nd5',
      name: 'Punish Nd5?',
      moves: ['10.Nd5? Bxd5', '11.exd5 Rc8!'],
      description: 'White jumps the knight to d5 too early. Black trades it off and activates the rook with a strong position.',
      type: 'punish',
      row: 5,
      col: -1,
      lineFrom: 'pi-4',
      unlockedBy: 'pi-6',
      side: 'black',
    },

    // MAIN LINE: Knight continues with Na5 → Nc4
    {
      id: 'pi-7',
      name: 'Knight Outpost',
      moves: ['14...Nd7', '15.Nxc6! bxc6', '16.Bxc6 Rc6'],
      description: 'After center trading, Black regroups the knight. White trades and invades on c6 — but Black has active rooks.',
      type: 'main',
      row: 7,
      col: 0,
      lineFrom: 'pi-6',
      unlockedBy: 'pi-punish-Nd5',
      side: 'black',
    },

    // Alternative branch: Classical development (similar to Level 1's pi-classical-1)
    {
      id: 'pi-8',
      name: 'Solid Continuation',
      moves: ['14...Nd7', '15.Be2 Nc4'],
      description: 'If White doesn\'t push immediately, Black has time to reroute the knight to c4 — a strong outpost.',
      type: 'branch',
      row: 6,
      col: 1,
      lineFrom: 'pi-6',
      unlockedBy: 'pi-7',
      side: 'black',
    },

    // Classical variation: More solid, less forcing
    {
      id: 'pi-classical-2',
      name: 'Classical Depth',
      moves: ['15...Nxe5', '16.Qe2 Nf7'],
      description: 'Black captures on e5 and reggroups, maintaining the fianchetto structure and piece coordination.',
      type: 'branch',
      row: 7,
      col: 1,
      lineFrom: 'pi-8',
      unlockedBy: 'pi-8',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'pi-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Master the Pirc middlegame — navigate after 10.f4 and handle all the critical positions.',
      type: 'test',
      row: 8,
      col: 0,
      lineFrom: 'pi-7',
      unlockedBy: 'pi-classical-2',
      side: 'black',
    },
  ],
}
