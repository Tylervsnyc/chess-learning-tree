// Witty Alien — Martian Gambit (variation tree) Opening Data
// The Bf5 sister to the Alien Gambit. TWO knight sacrifices: first Ne6, then Nxf7.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon.
// The Martian Gambit is a long, theatrical attacking line with two knight sacs.
// We use OneAndOnly's Lichess study annotations as the source of truth.
// Lean INTO the "trick weapon" framing — this is a streamer's double sacrifice,
// not master theory.
//
// Source: research/alien-gambit-oneandonly.pgn — "Martian gambit" chapter
//         research/alien-gambit-ishaan.pgn — Trap 7 (Bf5 sideline when no h6)
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5
//            5.Ng5 Bg6 6.N1f3 h6 7.Ne6!! fxe6
//            8.Ne5 Bf7 9.Bc4 Nd7 10.Nxf7! Kxf7
//            11.Qg4 Qa5+ 12.Bd2 Qc7
//            13.Bxe6+ Ke8 14.Qg6+ Kd8
//            15.O-O Ngf6 16.Rfe1 a5 17.c4 c5
//            18.dxc5 Nxc5 19.Rad1!! Nxe6 20.Bxa5+ Kc8
//            21.Bxc7 Nxc7 22.Qf5+ (winning)
//
// The "Martian" signature: two knight sacrifices. The first knight lands on e6
// (luring fxe6, opening the f-file and locking Black's bishop on f7 in a coffin).
// The second knight lands on f7 (dragging the king to the center). Then the
// queen, bishop, and rooks pile on for a winning attack.
//
// LESSON CHUNKING RULE (Tyler-approved):
// EVERY main-line lesson teaches EXACTLY 3 white moves. 7 main lessons × 3 = 21
// white moves, plus 1 puzzle move (22.Qf5+) at the end of wam-7 = 22 total. No
// 2-move or 1-move main lessons. Ever.
//
// GRID LAYOUT (10 lessons):
//   Row 7:   wam-test-1 (col 0)
//   Row 6:   wam-7 (col 0)
//   Row 5:   wam-6 (col 0)
//   Row 4:   wam-5 (col 0)              wam-dev-decline (col -1)
//   Row 3:   wam-4 (col 0)              wam-dev-no-h6 (col -1)
//   Row 2:   wam-3 (col 0)
//   Row 1:   wam-2 (col 0)
//   Row 0:   wam-1 (col 0)
//
// Deviations:
//   wam-dev-no-h6  — after 6.N1f3, Black plays 6…e6 instead of h6 → 7.Ne5! 8.Bd3 9.Qxd3
//   wam-dev-decline — after 7.Ne6, Black plays 7…Qa5+ to decline → 8.Bd2 9.Qxd2 10.Bd3
//
// All unlockedBy are null (Tyler-approved sandbox — every lesson always available).
// All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_MARTIAN: OpeningTree = {
  id: 'witty-alien-martian',
  name: 'Martian Gambit',
  slug: 'witty-alien-martian',
  description: "Witty's double-knight sacrifice vs the Caro-Kann 4…Bf5. First Ne6, then Nxf7 — drag the king out and pile on.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wam-1',
    'wam-2',
    'wam-3',
    'wam-dev-no-h6',
    'wam-4',
    'wam-5',
    'wam-dev-decline',
    'wam-6',
    'wam-7',
    'wam-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'wam-1',
      name: 'The Setup',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Enter the Caro-Kann main line. Knight to c3 invites Black to capture on e4 — and they do.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-2',
      name: "Black's Bishop Move",
      moves: ['4.Nxe4 Bf5', '5.Ng5 Bg6', '6.N1f3 h6'],
      description: "Recapture on e4. Black plays the Bf5 main line — bishop out first, not Nf6. The Martian only fires against Bf5. Both knights development, then Black kicks with h6.",
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'wam-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-3',
      name: 'Two Knights In',
      moves: ['7.Ne6!! fxe6', '8.Ne5 Bf7', '9.Bc4 Nd7'],
      description: "The first sacrifice — knight jumps onto e6 to attack the queen. Black takes. Second knight crashes into e5 attacking the bishop, which retreats to its coffin on f7. Bishop joins on c4, pinning f7.",
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'wam-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-4',
      name: 'The Second Sacrifice',
      moves: ['10.Nxf7! Kxf7', '11.Qg4 Qa5+', '12.Bd2 Qc7'],
      description: 'Sacrifice the second knight on f7 — king dragged to the center. Queen swings to g4 eyeing g7, Black checks with Qa5+, you block with Bd2 (also developing), Black retreats with Qc7.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wam-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-5',
      name: 'Crack the King',
      moves: ['13.Bxe6+ Ke8', '14.Qg6+ Kd8', '15.O-O Ngf6'],
      description: 'Bishop crashes in with check, king flees to e8, queen check forces it to d8. Castle into the attack — both rooks ready. Black develops Ngf6 to defend.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wam-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-6',
      name: 'Pile On',
      moves: ['16.Rfe1 a5', '17.c4 c5', '18.dxc5 Nxc5'],
      description: 'Rook to e1 piles on the e-file. Push c4 to challenge the center, Black breaks with c5 — you trade pawns and Black recaptures with the knight.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'wam-5',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-7',
      name: 'Mate the King',
      moves: ['19.Rad1!! Nxe6', '20.Bxa5+ Kc8', '21.Bxc7 Nxc7', '22.Qf5+ → winning'],
      description: "Other rook joins on d1 — quiet move, total domination. Pick off the a5 pawn with check, then take the queen on c7. Final puzzle: Qf5+ wins more material no matter how Black moves.",
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'wam-6',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS (col -1) ===
    {
      id: 'wam-dev-no-h6',
      name: 'If e6 (no h6)',
      moves: ['7.Ne5! Nf6', '8.Bd3 Bxd3', '9.Qxd3'],
      description: "Black skips h6 and plays e6 instead — trying to control e5 first. You get there anyway with Ne5, both knights fork f7. Black develops, you challenge the bishop with Bd3, recapture with the queen. Roughly equal — the sac doesn't fire but you have a clean position.",
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wam-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-dev-decline',
      name: 'If Qa5+ (decline)',
      moves: ['8.Bd2 Qxd2+', '9.Qxd2 fxe6', '10.Bd3'],
      description: "Black smells the trap and declines with Qa5+ — both saving the queen AND giving check. Block with Bd2, queens get traded, Black grabs the knight on e6, and you finish development with Bd3. You've lost the gambit but you have a playable position.",
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'wam-5',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wam-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Martian Gambit — both knight sacrifices, the king hunt, and every deviation.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'wam-7',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
