// Witty Alien — Martian Gambit (variation tree) Opening Data
// The 4...Nd7 sister to the Alien Gambit. Instead of Nxf7, the knight sacs on e6.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon.
// The Martian Gambit (6.Ne6!) is unsound, but when Black takes naively with fxe6
// it leads to a 4-move mate (Qh5+ g6 Qxg6#). Lean INTO the "trick weapon" framing.
//
// Source: research/alien-gambit-ishaan.pgn — Trap-3 chapter (CHECKMATE)
//         (OneAndOnly's "Martian gambit" chapter is actually vs 4...Bf5, not 4...Nd7.
//          We treat the 4...Nd7 sequence with 6.Ne6 as the canonical Martian.)
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 h6
//            6.Ne6! fxe6?? 7.Qh5+ g6 8.Qxg6# — 4-move mate
//
// GRID LAYOUT (8 lessons):
//   Row 5:   wam-test-1 (col 0)
//   Row 4:   wam-4 (col 0)
//   Row 3:   wam-3 (col 0)            wam-dev-Qb6 (col -1)
//   Row 2:   wam-2 (col 0)            wam-dev-Qa5 (col -1)
//   Row 1:   wam-1 (col 0)            wam-dev-Ngf6 (col -1)
//
// Deviations (all visually offset to col -1; logical branches from the position after 6.Ne6):
//   wam-dev-Ngf6 — after 5.Ng5, Black plays Ngf6 instead of h6 (no sac at all)
//   wam-dev-Qa5  — after 6.Ne6, Black plays Qa5+ (the real refutation)
//   wam-dev-Qb6  — after 6.Ne6, Black plays Qb6 (equalizing line)
//
// Note: lineFrom values pair each deviation with a different main-line row visually,
// but logically all three Q-defenses happen at the same position (after 6.Ne6).
//
// All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_MARTIAN: OpeningTree = {
  id: 'witty-alien-martian',
  name: 'Martian Gambit',
  slug: 'witty-alien-martian',
  description: "The Alien Gambit's cousin. When Black plays 4…Nd7 instead of Nf6, sacrifice on e6 — and if Black takes, it's a 4-move mate.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wam-1',
    'wam-dev-Ngf6',
    'wam-2',
    'wam-dev-Qa5',
    'wam-3',
    'wam-dev-Qb6',
    'wam-4',
    'wam-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'wam-1',
      name: 'The Detour',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4', '4.Nxe4 Nd7', '5.Ng5'],
      description: "Same Caro-Kann setup as the Alien Gambit — but Black plays Nd7, not Nf6. Different defense, different sacrifice.",
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-2',
      name: 'The Ne6 Sacrifice',
      moves: ['5…h6', '6.Ne6!'],
      description: "Black kicks the knight with h6. You don't retreat — you jump to e6 and offer the knight.",
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'wam-1',
      unlockedBy: 'wam-dev-Ngf6',
      side: 'white',
    },
    {
      id: 'wam-3',
      name: 'The Trap Springs',
      moves: ['6…fxe6??', '7.Qh5+'],
      description: "Most Black players grab the knight with fxe6 — that's the blunder. You give check with the queen and it's mate next move.",
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wam-2',
      unlockedBy: 'wam-dev-Qa5',
      side: 'white',
    },
    {
      id: 'wam-4',
      name: '4-Move Mate',
      moves: ['7…g6', '8.Qxg6#'],
      description: "Black blocks with g6 — and you take it for checkmate. The Martian Gambit's signature finish.",
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wam-3',
      unlockedBy: 'wam-dev-Qb6',
      side: 'white',
    },

    // === DEVIATIONS (col -1) ===
    {
      id: 'wam-dev-Ngf6',
      name: 'If Ngf6',
      moves: ['5…Ngf6', '6.Bd3'],
      description: "Black develops a knight instead of pushing h6. No sacrifice — just develop and stay patient.",
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'wam-1',
      unlockedBy: 'wam-1',
      side: 'white',
    },
    {
      id: 'wam-dev-Qa5',
      name: 'If Qa5+',
      moves: ['6…Qa5+', '7.Bd2'],
      description: "Black's best defense — checks AND saves the queen. Block with Bd2 and accept the gambit didn't land.",
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'wam-2',
      unlockedBy: 'wam-2',
      side: 'white',
    },
    {
      id: 'wam-dev-Qb6',
      name: 'If Qb6',
      moves: ['6…Qb6', '7.Nxf8'],
      description: "Black moves the queen to safety. Grab the bishop on f8 — trade knight for bishop and stay equal.",
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wam-3',
      unlockedBy: 'wam-3',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wam-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Martian Gambit — the 4-move mate plus every Black defense.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'wam-4',
      unlockedBy: 'wam-4',
      side: 'white',
    },
  ],
}
