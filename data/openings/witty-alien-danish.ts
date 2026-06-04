// Witty Alien — Danish Gambit Opening Tree Data
// Witty_Alien's two-pawn gambit in the open game — sacrifice TWO pawns for a
// raking bishop battery on b2+c4 aimed straight at f7 and g7.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Moves here need NOT be #1 in the masters database — this is a trick/attack weapon
// in the Witty_Alien section. Source of truth: Witty_Alien's real chess.com games,
// last 3 months (2026). Danish Gambit = his highest-scoring weapon: 213 games after
// 1.e4 e5 2.d4 exd4, 80% win rate overall, 96% in the fully-accepted main line.
// We lean INTO the brilliant-attack energy. Be honest where Black has a sound equalizer.
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 e5 2.d4 exd4 3.c3! dxc3 4.Bc4! cxb2 5.Bxb2 Nf6
//            6.Nc3 Nc6 7.Nge2 d6 8.O-O Be7 9.Qb3 Qd7 10.Rad1 O-O
//            11.Nd5 Nxd5 12.Bxd5+ Kh8 13.e5 dxe5 14.Bxe5
//
// LESSON CHUNKING RULE: EVERY main lesson teaches EXACTLY 3 white moves.
// Puzzle steps count as "moves" of content.
//
// GRID LAYOUT (9 nodes):
//   Row 6:   wd-test-1 (col 0)
//   Row 5:   wd-5 (col 0)
//   Row 4:   wd-4 (col 0)
//   Row 3:   wd-3 (col 0)              wd-dev-Nc6 (col -1)
//   Row 2:   wd-2 (col 0)              wd-dev-Nxc3 (col -1)
//   Row 1:   wd-1 (col 0)              wd-dev-d5 (col -1)
//
// Deviations:
//   wd-dev-d5    — 3...d5! counter-gambit (sound equalizer — honest)
//   wd-dev-Nxc3  — 4.Nxc3 one-pawn Danish (21 games, 76%)
//   wd-dev-Nc6   — 3...Nc6 decline (44 games, 84%)
//
// All `unlockedBy: null`. All lines horizontal or vertical only.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_DANISH: OpeningTree = {
  id: 'witty-alien-danish',
  name: 'Danish Gambit',
  slug: 'witty-alien-danish',
  description: "Witty_Alien's highest-scoring weapon — sacrifice two pawns for a raking bishop battery on c4+b2, aimed straight at f7. 96% win rate in the fully-accepted main line.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wd-1',
    'wd-2',
    'wd-3',
    'wd-dev-Nc6',
    'wd-dev-Nxc3',
    'wd-dev-d5',
    'wd-4',
    'wd-5',
    'wd-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'wd-1',
      name: 'The Gambit',
      moves: ['1.e4 e5', '2.d4 exd4', '3.c3!'],
      description: 'Open with e4, claim the center with d4, then offer a free pawn with c3. If Black takes, you offer a SECOND pawn on b2.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wd-2',
      name: 'The Bishop Battery',
      moves: ['3...dxc3', '4.Bc4! cxb2', '5.Bxb2'],
      description: 'Two pawns sacrificed — now both bishops rake the board on c4 and b2, aimed at f7 and the long diagonal. 96% win rate when Black accepts.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'wd-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wd-3',
      name: 'Castle & Pressure',
      moves: ['5...Nf6 6.Nc3 Nc6', '7.Nge2 d6 8.O-O Be7', '9.Qb3'],
      description: 'Develop both knights, castle, then unleash Qb3 — hitting f7 with the queen AND the c4 bishop at once. Black scrambles to defend.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wd-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wd-4',
      name: 'Rook Up, Fork Fires',
      moves: ['9...Qd7 10.Rad1 O-O', '11.Nd5 Nxd5', '12.Bxd5+'],
      description: 'Rook piles on the open d-file, then Nd5 forks the f6 knight and the e7 bishop. After Nxd5, Bxd5+ check forces the king to h8.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wd-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wd-5',
      name: 'The e5 Breakthrough',
      moves: ['12...Kh8 13.e5 dxe5', '14.Bxe5', '(puzzle: find the winning continuation)'],
      description: 'King tucked on h8, you blast open the center with e5. After dxe5 Bxe5, two raking bishops, rooks on open files, and the queen pointing at f7 — the attack is overwhelming.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'wd-4',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS (col -1) ===
    {
      id: 'wd-dev-d5',
      name: 'If d5! (sound)',
      moves: ['3...d5!', '4.exd5 Qxd5', '5.cxd4 Qxd4', '6.Nc3 Qd6', '7.Nf3'],
      description: "Black's best response — the Capablanca counter-gambit. Honest: this equalizes. The wild bishop battery is gone. White is fine with a small edge; the brilliant attack is not happening.",
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'wd-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wd-dev-Nxc3',
      name: 'Safer: 4.Nxc3',
      moves: ['3...dxc3', '4.Nxc3 (one-pawn Danish)', 'Nc6 5.Bc4 Nf6', '6.Nge2'],
      description: 'One-pawn Danish — recapture with the knight instead of Bc4. You keep one pawn, lose the bishop battery. 21 games, 76% win rate. Safer, less brilliant.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'wd-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wd-dev-Nc6',
      name: 'If Nc6 (decline)',
      moves: ['3...Nc6', '4.Bc4! dxc3', '5.Nxc3 Nf6', '6.Nge2'],
      description: 'Black declines the second pawn — plays Nc6 instead. Keep the gambit tension with 4.Bc4! Often they still take on c3. 44 games, 84%.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wd-3',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wd-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Danish Gambit — main line and every deviation.',
      type: 'test',
      row: 6,
      col: 0,
      lineFrom: 'wd-5',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
