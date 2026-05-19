// Witty Alien — Martian Gambit (variation tree) Opening Data
// The Bf5 sister to the Alien Gambit. TWO knight sacrifices: first Ne6, then Nxf7.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon.
// The Martian Gambit is a long, theatrical attacking line with two knight sacs.
// Lean INTO the "trick weapon" framing — this is a streamer's double sacrifice,
// not master theory.
//
// Source: Witty_Alien's chess.com archives, June-November 2024 (1,472 White-side
// Caro-Kann games). Every deviation's response is what Witty actually plays in his
// real games — frequencies in the data show below.
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
// white moves, plus 1 puzzle move (22.Qf5+) at the end of wam-7 = 22 total.
// Every deviation lesson ALSO teaches 3 white moves. No exceptions.
//
// GRID LAYOUT (15 lessons):
//   Row 8:   wam-test-1 (col 0)
//   Row 7:   wam-7 (col 0)
//   Row 6:   wam-6 (col 0)
//   Row 5:   wam-5 (col 0)              wam-dev-8-Be4 (col -1)
//   Row 4:   wam-4 (col 0)              wam-dev-8-Bf5 (col -1)
//   Row 3:   wam-3 (col 0)              wam-dev-6-Nd7 (col -1)
//   Row 2:   wam-dev-5-Nf6 (col -2)     wam-dev-6-e6 (col -1)              wam-2 (col 0)
//   Row 1:   wam-dev-5-h6  (col -2)     wam-dev-5-e6 (col -1)              wam-2 redundant
//   Row 0:   wam-1 (col 0)
//
// Deviations (real-play frequencies, June-Nov 2024):
//   wam-dev-5-e6   — After 4…Bf5 5.Ng5, Black plays 5…e6 (16%, 62 games) → 6.N1f3 (98%)
//   wam-dev-5-h6   — After 4…Bf5 5.Ng5, Black plays 5…h6 (8%, 33 games) → 6.Nxf7! (100%, transposes to Alien Gambit)
//   wam-dev-5-Nf6  — After 4…Bf5 5.Ng5, Black plays 5…Nf6 (6%, 24 games) → 6.N1f3 (100%)
//   wam-dev-6-e6   — After 5…Bg6 6.N1f3, Black plays 6…e6 (9%, 22 games) → 7.Ne5 (45%)
//   wam-dev-6-Nd7  — After 5…Bg6 6.N1f3, Black plays 6…Nd7 (7%, 18 games) → 7.Bc4 (78%)
//   wam-dev-8-Bf5  — After 7.Ne6 fxe6 8.Ne5, Black plays 8…Bf5 (40%, 71 games) → 9.Bc4 (58%)
//   wam-dev-8-Be4  — After 7.Ne6 fxe6 8.Ne5, Black plays 8…Be4 (12%, 21 games, 100% Witty wins!) → 9.Bc4 (81%)
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
    'wam-dev-5-e6',
    'wam-dev-5-h6',
    'wam-dev-5-Nf6',
    'wam-3',
    'wam-dev-6-e6',
    'wam-dev-6-Nd7',
    'wam-4',
    'wam-dev-8-Bf5',
    'wam-dev-8-Be4',
    'wam-5',
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

    // === DEVIATIONS — Black's 5th move alternatives (after 4…Bf5 5.Ng5) ===
    {
      id: 'wam-dev-5-e6',
      name: 'If 5…e6',
      moves: ['6.N1f3 Nd7', '7.Nh4 Bg6', '8.Bc4 ...'],
      description: "Black plays e6 first instead of Bg6 (16% of games, 62 games). You play N1f3 anyway — develops and waits for Black to commit. Then Nh4 attacks Black's bishop, and Bc4 lines up on f7.",
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'wam-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-dev-5-h6',
      name: 'If 5…h6 (ALIEN SAC)',
      moves: ['6.Nxf7! Kxf7', '7.Nf3 Nd7', '8.Ne5+ ...'],
      description: "Black plays h6 (8% of games, 33 games) thinking it kicks your knight. You sacrifice on f7 anyway — same as the Alien Gambit. 79% win rate over 33 games. Different opening, same sac.",
      type: 'deviation',
      row: 1,
      col: -2,
      lineFrom: 'wam-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-dev-5-Nf6',
      name: 'If 5…Nf6',
      moves: ['6.N1f3 Nbd7', '7.Bc4 e6', '8.Ne5 ...'],
      description: "Black plays Nf6 (6% of games, 24 games). You develop N1f3, then drop the bishop on c4 aiming at f7, then Ne5 attacks Black's bishop AND covers f7. 88% win rate (21W/3L).",
      type: 'deviation',
      row: 2,
      col: -2,
      lineFrom: 'wam-2',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS — Black's 6th move alternatives (after 5…Bg6 6.N1f3) ===
    {
      id: 'wam-dev-6-e6',
      name: 'If 6…e6',
      moves: ['7.Ne5 Nd7', '8.Nxg6 hxg6', '9.Bc4 ...'],
      description: "Black plays e6 instead of h6 (9% of games, 22 games). You jump to e5 attacking the bishop, capture it on g6 (Black must recapture with the h-pawn opening the h-file), then bring the bishop to c4. 82% win rate.",
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'wam-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-dev-6-Nd7',
      name: 'If 6…Nd7',
      moves: ['7.Bc4 e6', '8.Qe2 Ngf6', '9.O-O ...'],
      description: "Black plays Nd7 instead of h6 (7% of games, 18 games). You drop the bishop on c4 aiming at f7, queen to e2 supporting Ne6 ideas, then castle into the attack. Witty plays Bc4 in 14 of 18 games.",
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wam-3',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS — Black's 8th move alternatives (after 7.Ne6 fxe6 8.Ne5) ===
    {
      id: 'wam-dev-8-Bf5',
      name: 'If 8…Bf5',
      moves: ['9.Bc4 Nd7', '10.Bxe6 Nxe5', '11.Bxf5 ...'],
      description: "Black plays Bf5 instead of the coffin Bf7 (40% of games — almost as common as Bf7!). You play Bc4 attacking e6, grab the e6 pawn with the bishop, and after Black's knight trade, take the f5 bishop too. Two pieces ahead. 81% win rate over 69 games.",
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'wam-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wam-dev-8-Be4',
      name: 'If 8…Be4 (100% wins)',
      moves: ['9.Bc4 Nd7', '10.Qe2 Nxe5', '11.dxe5 ...'],
      description: "Black plays Be4 — a defensive idea (12% of games). Witty has played this 21 times. He's won 21 times. 100% win rate. You play Bc4, then Qe2 supporting Ne5, and when Black trades the knight, you recapture with the pawn keeping the e-file blockade.",
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'wam-3',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wam-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Martian Gambit — both knight sacrifices, the king hunt, and all seven real-play deviations (5…e6, 5…h6, 5…Nf6, 6…e6, 6…Nd7, 8…Bf5, 8…Be4).',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'wam-7',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
