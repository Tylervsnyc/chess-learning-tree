/**
 * Verify the chess for Chess Path Classics episodes 4-10 BEFORE any script is
 * written. Every game/pattern is replayed through chess.js; an illegal move
 * throws. Prints the SAN + resulting FEN after each move so beat FENs for the
 * scripts and comps are copy-pasted from output, never hand-typed.
 *
 *   npx tsx scripts/verify-classics-4-10.ts
 */
import { Chess } from 'chess.js';

type Line = { title: string; start?: string; moves: string[]; note?: string };

const EPISODES: Line[] = [
  {
    title: 'Ep4 — The Immortal Game (Anderssen–Kieseritzky, London 1851)',
    moves: [
      'e4', 'e5', 'f4', 'exf4', 'Bc4', 'Qh4+', 'Kf1', 'b5', 'Bxb5', 'Nf6',
      'Nf3', 'Qh6', 'd3', 'Nh5', 'Nh4', 'Qg5', 'Nf5', 'c6', 'g4', 'Nf6',
      'Rg1', 'cxb5', 'h4', 'Qg6', 'h5', 'Qg5', 'Qf3', 'Ng8', 'Bxf4', 'Qf6',
      'Nc3', 'Bc5', 'Nd5', 'Qxb2', 'Bd6', 'Bxg1', 'e5', 'Qxa1+', 'Ke2', 'Na6',
      'Nxg7+', 'Kd8', 'Qf6+', 'Nxf6', 'Be7#',
    ],
    note: 'Final mate was ANNOUNCED; sources say Black resigned before the last moves. Say "and it is mate" not "he played."',
  },
  {
    title: "Ep5 — Marshall's Golden Queen (Levitsky–Marshall, Breslau 1912)",
    moves: [
      'd4', 'e6', 'e4', 'd5', 'Nc3', 'c5', 'Nf3', 'Nc6', 'exd5', 'exd5',
      'Be2', 'Nf6', 'O-O', 'Be7', 'Bg5', 'O-O', 'dxc5', 'Be6', 'Nd4', 'Bxc5',
      'Nxe6', 'fxe6', 'Bg4', 'Qd6', 'Bh3', 'Rae8', 'Qd2', 'Bb4', 'Bxf6', 'Rxf6',
      'Rad1', 'Qc5', 'Qe2', 'Bxc3', 'bxc3', 'Qxc3', 'Rxd5', 'Nd4', 'Qh5', 'Ref8',
      'Re5', 'Rh6', 'Qg5', 'Rxh3', 'Rc5', 'Qg3',
    ],
    note: "Final move 23...Qg3!! — queen en prise to hxg3, fxg3, Qxg3; all lose. White resigned.",
  },
  {
    title: 'Ep6 — The Game of the Century (D.Byrne–Fischer, New York 1956)',
    moves: [
      'Nf3', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'd4', 'O-O', 'Bf4', 'd5',
      'Qb3', 'dxc4', 'Qxc4', 'c6', 'e4', 'Nbd7', 'Rd1', 'Nb6', 'Qc5', 'Bg4',
      'Bg5', 'Na4', 'Qa3', 'Nxc3', 'bxc3', 'Nxe4', 'Bxe7', 'Qb6', 'Bc4', 'Nxc3',
      'Bc5', 'Rfe8+', 'Kf1', 'Be6', 'Bxb6', 'Bxc4+', 'Kg1', 'Ne2+', 'Kf1', 'Nxd4+',
      'Kg1', 'Ne2+', 'Kf1', 'Nc3+', 'Kg1', 'axb6', 'Qb4', 'Ra4', 'Qxb6', 'Nxd1',
      'h3', 'Rxa2', 'Kh2', 'Nxf2', 'Re1', 'Rxe1', 'Qd8+', 'Bf8', 'Nxe1', 'Bd5',
      'Nf3', 'Ne4', 'Qb8', 'b5', 'h4', 'h5', 'Ne5', 'Kg7', 'Kg1', 'Bc5+',
      'Kf1', 'Ng3+', 'Ke1', 'Bb4+', 'Kd1', 'Bb3+', 'Kc1', 'Ne2+', 'Kb1', 'Nc3+',
      'Kc1', 'Rc2#',
    ],
    note: '17...Be6!! is the queen offer; the windmill 19-23 wins rook+2 bishops+pawn. Objectively winning, NOT risky.',
  },
  {
    title: "Ep7 — Kasparov's Immortal (Kasparov–Topalov, Wijk aan Zee 1999)",
    moves: [
      'e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'Qd2', 'c6',
      'f3', 'b5', 'Nge2', 'Nbd7', 'Bh6', 'Bxh6', 'Qxh6', 'Bb7', 'a3', 'e5',
      'O-O-O', 'Qe7', 'Kb1', 'a6', 'Nc1', 'O-O-O', 'Nb3', 'exd4', 'Rxd4', 'c5',
      'Rd1', 'Nb6', 'g3', 'Kb8', 'Na5', 'Ba8', 'Bh3', 'd5', 'Qf4+', 'Ka7',
      'Rhe1', 'd4', 'Nd5', 'Nbxd5', 'exd5', 'Qd6', 'Rxd4', 'cxd4', 'Re7+', 'Kb6',
      'Qxd4+', 'Kxa5', 'b4+', 'Ka4', 'Qc3', 'Qxd5', 'Ra7', 'Bb7', 'Rxb7', 'Qc4',
      'Qxf6', 'Kxa3', 'Qxa6+', 'Kxb4', 'c3+', 'Kxc3', 'Qa1+', 'Kd2', 'Qb2+', 'Kd1',
      'Bf1', 'Rd2', 'Rd7', 'Rxd7', 'Bxc4', 'bxc4', 'Qxh8', 'Rd3', 'Qa8', 'c3',
      'Qa4+', 'Ke1', 'f4', 'f5', 'Kc1', 'Rd2', 'Qa7',
    ],
    note: '24.Rxd4!! starts the hunt; king dragged a7→a5→a4→a3→b4→c3→d2→d1. Black resigned (1-0).',
  },
  {
    title: 'Ep8 — The King March (Ed.Lasker–Thomas, London 1912)',
    moves: [
      'd4', 'e6', 'Nf3', 'f5', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'Bxf6', 'Bxf6',
      'e4', 'fxe4', 'Nxe4', 'b6', 'Ne5', 'O-O', 'Bd3', 'Bb7', 'Qh5', 'Qe7',
      'Qxh7+', 'Kxh7', 'Nxf6+', 'Kh6', 'Neg4+', 'Kg5', 'h4+', 'Kf4', 'g3+', 'Kf3',
      'Be2+', 'Kg2', 'Rh2+', 'Kg1', 'Kd2#',
    ],
    note: 'He played 18.Kd2#. 18.O-O-O# was legal and more spectacular but NOT played — do not claim he castled.',
  },
  {
    title: "Ep9 — The Smothered Mate (Philidor's Legacy, pattern demo)",
    start: '5r1k/6pp/8/3Q2N1/8/8/8/6K1 w - - 0 1',
    moves: ['Nf7+', 'Kg8', 'Nh6+', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'],
    note: 'Constructed clean demo of the 1749 pattern: Nh6+ is the double check; Qg8+ decoys the rook; lone knight mates.',
  },
  {
    title: "Ep6 — Légal's Mate (de Kermur Sire de Légal vs Saint Brie, Paris 1750)",
    moves: [
      'e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6',
      'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#',
    ],
    note: "The pseudo-sacrifice: 4...g6?? lets 5.Nxe5! If Black grabs the queen (5...Bxd1??), 6.Bxf7+ Ke7 7.Nd5# — the king is smothered by its OWN queen (d8), bishop (f8) and pawn (d6). Nd5 covers f6, Ne5 covers d7, Bf7 covers e6/e8.",
  },
  {
    title: "Ep6b — Légal DECLINED (correct: don't take the queen)",
    moves: [
      'e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6',
      'Nxe5', 'dxe5', 'Qxg4',
    ],
    note: 'If Black declines the queen and recaptures the knight (5...dxe5), 6.Qxg4 just wins a clean pawn. Taking the queen is the only move that loses.',
  },
  {
    title: 'Ep10 — The Peruvian Immortal (Canal vs NN, 1934)',
    moves: [
      'e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'c6', 'Nf3', 'Bg4',
      'Bf4', 'e6', 'h3', 'Bxf3', 'Qxf3', 'Bb4', 'Be2', 'Nd7', 'a3', 'O-O-O',
      'axb4', 'Qxa1+', 'Kd2', 'Qxh1', 'Qxc6+', 'bxc6', 'Ba6#',
    ],
    note: 'Queen AND both rooks genuinely captured; lone bishop mates (Boden pattern, Bf4+Ba6). Loser is anonymous (NN).',
  },
];

let failed = 0;
for (const ep of EPISODES) {
  console.log('\n============================================================');
  console.log(ep.title);
  if (ep.note) console.log('NOTE: ' + ep.note);
  console.log('------------------------------------------------------------');
  const c = new Chess(ep.start);
  let moveNo = 1;
  try {
    ep.moves.forEach((m, i) => {
      const white = i % 2 === 0;
      const res = c.move(m);
      if (!res) throw new Error(`illegal ${m}`);
      const num = white ? `${moveNo}.` : `${moveNo}...`;
      if (!white) moveNo++;
      const flags = [];
      if (res.captured) flags.push(`x${res.captured}`);
      if (res.san.includes('#')) flags.push('MATE');
      console.log(
        `${num.padEnd(6)} ${res.san.padEnd(7)} ${flags.join(' ').padEnd(8)} ${c.fen()}`
      );
    });
    const end = c.isCheckmate() ? 'CHECKMATE' : c.isStalemate() ? 'STALEMATE' : c.isGameOver() ? 'GAME OVER' : 'ongoing';
    console.log(`RESULT: ${end}`);
  } catch (e) {
    console.log(`!!! FAILED: ${(e as Error).message}  at FEN ${c.fen()}`);
    failed++;
  }
}
console.log('\n============================================================');
console.log(failed === 0 ? 'ALL 7 REPLAYED CLEAN' : `${failed} EPISODE(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
