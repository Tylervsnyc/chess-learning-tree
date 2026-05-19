// Witty Alien — Alien Gambit (main line) Opening Tree Data
// Bulgarian streamer Witty_Alien's signature knight sacrifice vs the Caro-Kann.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon.
// We use Witty_Alien's actual chess.com games (Jun-Nov 2024, 423 Alien Gambit
// games) as the source of truth — what real Black opponents play, and how Witty
// responds. Lean INTO the "trick weapon" framing — this is a streamer's
// sacrifice, not master theory.
//
// Sources: research/witty-alien-real-play-analysis.md (frequencies, win rates)
//          /tmp/witty/2024-*.pgn (raw game data)
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Ng5 h6
//            6.Nxf7!! Kxf7 7.Nf3 Nbd7 8.Bd3 e6 9.O-O Bd6
//            10.Re1 Re8 11.Ne5+ Bxe5 12.dxe5 Nd5 13.Qh5+
//            Kg8 14.Bxh6!! gxh6 15.Qg6+ Kh8 16.Qh7#
//
// LESSON CHUNKING RULE (Tyler-explicit):
// EVERY lesson teaches EXACTLY 3 white moves. Puzzle steps count as "moves" of
// content. No 2-move or 1-move main lessons. Ever.
//
// GRID LAYOUT (13 lessons):
//   Row 7:   wa-test-1 (col 0)
//   Row 6:   wa-6 (col 0)
//   Row 5:   wa-5 (col 0)              wa-dev-Be6 (col -1)
//   Row 4:   wa-4 (col 0)              wa-dev-Bg4 (col -1)
//   Row 3:   wa-3 (col 0)              wa-dev-Kg8 (col -1)
//   Row 2:   wa-2 (col 0)              wa-dev-e6  (col -1)
//   Row 1:   wa-1 (col 0)              wa-dev-Bf5 (col -1)
//   Row 0:                              wa-dev-c5  (col -1)
//
// Actually, simpler grid: main column col 0, deviations laid out col +1 or -1
// based on real-game frequency (c5 = most common, gets first slot).
//
// Black's 7th move (after 7.Nf3, real chess.com data):
//   - 7…c5    (23%)  — wa-dev-c5    — 86% win rate
//   - 7…Bf5   (20%)  — wa-dev-Bf5   — 73%
//   - 7…e6    (20%)  — wa-dev-e6    — 85% (often transposes to main line)
//   - 7…Nbd7  (13%)  — taught in MAIN LINE (the brilliancy path)
//   - 7…Be6   (7%)   — wa-dev-Be6   — 53% (toughest defense, honest tone)
//   - 7…Kg8   (6%)   — wa-dev-Kg8   — 80% (manual castle)
//   - 7…Bg4   (3%)   — wa-dev-Bg4   — 87% (pin attempt — bad)
//
// All `unlockedBy: null` (Tyler-approved sandbox — every lesson always available).
// All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN: OpeningTree = {
  id: 'witty-alien',
  name: 'Alien Gambit',
  slug: 'witty-alien',
  description: "Witty_Alien's trick weapon vs the Caro-Kann — sacrifice the knight on f7, drag the king out, attack. Now built from his real chess.com games.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wa-1', 'wa-2', 'wa-3', 'wa-4', 'wa-5', 'wa-6',
    'wa-dev-c5',
    'wa-dev-Bf5',
    'wa-dev-e6',
    'wa-dev-Be6',
    'wa-dev-Kg8',
    'wa-dev-Bg4',
    'wa-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'wa-1',
      name: 'The Setup',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Enter the Caro-Kann main line. Knight to c3 invites Black to capture.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-2',
      name: 'The Sacrifice',
      moves: ['4.Nxe4 Nf6', '5.Ng5 h6', '6.Nxf7!! Kxf7'],
      description: 'Recapture, jump to g5, then the signature sacrifice. Witty_Alien wins 80% of these.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'wa-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-3',
      name: 'Universal Setup',
      moves: ['7.Nf3 Nbd7', '8.Bd3 e6', '9.O-O Bd6'],
      description: "The attacking pattern — Nf3 / Bd3 / O-O. Black has multiple 7th moves (Nbd7, e6, Bd6) but your plan is the same.",
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'wa-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-4',
      name: 'Open the f-file',
      moves: ['10.Re1 Re8', '11.Ne5+ Bxe5', '12.dxe5 Nd5'],
      description: 'Rook on e1, knight check with the SECOND sacrifice. Recapture with the pawn — file opens.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-5',
      name: 'The Bxh6 Brilliancy',
      moves: ['13.Qh5+ Kg8', '14.Bxh6!! gxh6', '15.Qg6+ → mate'],
      description: "The don't-boo-spam-the-brilliant-emote moment. Queen check, bishop sacrifice, mating net.",
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wa-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-6',
      name: 'The Mate Net',
      moves: ['16.Qh7# (main)', '15…Kf8 16.Qxh6+', '17.Qg7# (alt)'],
      description: 'The mate, plus the alternate mating net if Black runs the king to f8 instead. Whichever way Black runs, the queen catches it.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'wa-5',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS (col -1 / +1) — all branch from wa-3 (after 7.Nf3) ===
    // Most common deviation (23% of real Witty games) — visually adjacent to wa-3
    {
      id: 'wa-dev-c5',
      name: 'If c5',
      moves: ['7…c5', '8.d5! Kg8', '9.c4 Nbd7', '10.Bd3 e6'],
      description: "The most common deviation — 23% of real games. Push d5, lock the queenside with c4, develop.",
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-Bf5',
      name: 'If Bf5',
      moves: ['7…Bf5', '8.Ne5+ Kg8', '9.Bc4+ e6', '10.g4 (chase the bishop)'],
      description: '20% of real games. Knight check, bishop check, then g4 chases the bishop on f5 across the board.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-e6',
      name: 'If e6',
      moves: ['7…e6', '8.Bd3 Bd6', '9.O-O Rf8', '10.Re1'],
      description: 'Also 20%. Often transposes back into the main line ideas — same Bd3 / O-O / Re1 plan.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-Be6',
      name: 'If Be6',
      moves: ['7…Be6', '8.Bd3 Nbd7', '9.O-O Kg8', '10.Re1'],
      description: "Black's toughest defense. Win rate drops to 53%. Develop carefully — same plan, but be honest about it.",
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-Kg8',
      name: 'If Kg8',
      moves: ['7…Kg8', '8.Bd3 Be6', '9.O-O Nbd7', '10.Re1'],
      description: "Black tries to manually castle. Stick to the universal plan — Bd3 / O-O / Re1.",
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-Bg4',
      name: 'If Bg4',
      moves: ['7…Bg4', '8.Ne5+ Kg8', '9.Bc4+ e6', '10.Nxg4 (free bishop)'],
      description: 'The pin attempt — bad. 87% win rate over 15 games. Knight check forces Kg8, then Bc4+ and the bishop on g4 just hangs.',
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wa-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Alien Gambit — main line and every deviation.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'wa-6',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
