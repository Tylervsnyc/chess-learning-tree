/**
 * Audit every FEN literal in the Chess Path Classics comps against
 * machine-replayed lines. A FEN that can't be produced by replaying a
 * verified line is a hand-typed mistake (see: the vanished b6 pawn, ep. 3).
 *
 * Run before EVERY Classics render: npx tsx scripts/audit-classics-fens.ts
 * When adding an episode: add its comp file + replay lines below.
 */
import { Chess } from 'chess.js';
import * as fs from 'fs';

const whitelist = new Set<string>();
const add = (fen: string) => whitelist.add(fen.split(' ')[0]);
const replay = (start: string, moves: string[]) => {
  const c = new Chess(start);
  add(start);
  for (const m of moves) {
    if (!c.move(m)) throw new Error(`illegal ${m} at ${c.fen()}`);
    add(c.fen());
  }
};

// No. 1 — Saavedra (1895)
const SAAV = '8/8/1KP5/3r4/8/8/8/k7 w - - 0 1';
replay(SAAV, ['c7', 'Rd6+', 'Kc5', 'Rd1', 'c8=Q', 'Rc1+']);
replay(SAAV, ['c7', 'Rd6+', 'Kb7', 'Rd7']);
replay(SAAV, ['c7', 'Rd6+', 'Kb5', 'Rd5+', 'Kb4', 'Rd4+', 'Kb3', 'Rd3+', 'Kc2', 'Rd4', 'c8=Q', 'Rc4+', 'Qxc4']);
replay(SAAV, ['c7', 'Rd6+', 'Kb5', 'Rd5+', 'Kb4', 'Rd4+', 'Kb3', 'Rd3+', 'Kc2', 'Rd4', 'c8=R', 'Ra4', 'Kb3']);

// No. 2 — Gurvich zugzwang (1959)
const ZUG = '3kr3/5R2/7p/p4K1B/P7/7P/8/8 w - - 0 1';
replay(ZUG, ['Rc7', 'Kxc7', 'Bxe8']);
replay(ZUG, ['Rc7', 'Rg8', 'Rb7', 'Rg5+', 'Kf4', 'Rxh5']);
replay(ZUG, ['Rc7', 'Rg8', 'Rc4', 'Rg5+', 'Ke6', 'Rxh5', 'h4', 'Ke8', 'Rc8+']);

// No. 3 — the sacrifice cascade
const CHO = '8/2pq4/bp6/p7/k1N1BK1R/3P4/PP6/8 w - - 0 1';
replay(CHO, ['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'b4+', 'axb4', 'Rc4+', 'Bxc4', 'd4#']);
replay(CHO, ['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'd4+', 'Kc4', 'd5+', 'Kc5', 'dxc6', 'Kxc6']);

// No. 4 — The Immortal Game (1851): full game, reel opens after 17.Nd5
const IMM = 'rnb1k1nr/p2p1ppp/5q2/1pbN1N1P/4PBP1/3P1Q2/PPP5/R4KR1 b kq - 4 17';
replay(IMM, ['Qxb2', 'Bd6', 'Bxg1', 'e5', 'Qxa1+', 'Ke2', 'Na6', 'Nxg7+', 'Kd8', 'Qf6+', 'Nxf6', 'Be7#']);

// No. 5 — Marshall's Golden Queen (1912): lead-in context + 23...Qg3!! + the three refutations
const MAR22 = '5rk1/pp4pp/4p2r/4R1Q1/3n4/2q4B/P1P2PPP/5RK1 b - - 6 22'; // after 22.Qg5
replay(MAR22, ['Rxh3', 'Rc5', 'Qg3']);
const MARQ = '5rk1/pp4pp/4p3/2R3Q1/3n4/2q4r/P1P2PPP/5RK1 b - - 1 23'; // after 23.Rc5
replay(MARQ, ['Qg3', 'hxg3', 'Ne2#']);
replay(MARQ, ['Qg3', 'fxg3', 'Ne2+', 'Kh1', 'Rxf1#']);
replay(MARQ, ['Qg3', 'Qxg3', 'Ne2+', 'Kh1', 'Nxg3+', 'Kg1', 'Nxf1']);

// Smothered Mate (Philidor's Legacy pattern demo)
const SMO = '5r1k/6pp/8/3Q2N1/8/8/8/6K1 w - - 0 1';
replay(SMO, ['Nf7+', 'Kg8', 'Nh6+', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#']);

// No. 6 — Légal's Mate (1750): reel opens after 3...Bg4 (the pin)
const LEG = 'rn1qkbnr/ppp2ppp/3p4/4p3/2B1P1b1/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4';
replay(LEG, ['Nc3', 'g6', 'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#']);
replay(LEG, ['Nc3', 'g6', 'Nxe5', 'dxe5', 'Qxg4']); // the declined branch

// No. 7 — The Game of the Century (1956): reel opens at 16.Bc5 (attacking the
// b6 queen), Fischer ignores it (16...Rfe8+ 17.Kf1), the queen offer 17...Be6,
// then the windmill Ne2+/Nxd4+/Ne2+/Nc3+, ending at 23...axb6.
const CEN = 'r4rk1/pp2Bpbp/1qp3p1/8/2BP2b1/Q1n2N2/P4PPP/3RK2R w K - 0 16';
replay(CEN, ['Bc5', 'Rfe8+', 'Kf1', 'Be6', 'Bxb6', 'Bxc4+', 'Kg1', 'Ne2+', 'Kf1', 'Nxd4+', 'Kg1', 'Ne2+', 'Kf1', 'Nc3+', 'Kg1', 'axb6']);

// No. 7 PART 2 — the finish: consolidation (24-34) + the mating-net king hunt
// (35...Bc5+ ... 41...Rc2#). Reel opens after 23...axb6.
const CEN2 = 'r3r1k1/1p3pbp/1pp3p1/8/2b5/Q1n2N2/P4PPP/3R2KR w - - 0 24';
replay(CEN2, [
  'Qb4', 'Ra4', 'Qxb6', 'Nxd1', 'h3', 'Rxa2', 'Kh2', 'Nxf2', 'Re1', 'Rxe1',
  'Qd8+', 'Bf8', 'Nxe1', 'Bd5', 'Nf3', 'Ne4', 'Qb8', 'b5', 'h4', 'h5',
  'Ne5', 'Kg7', 'Kg1', 'Bc5+', 'Kf1', 'Ng3+', 'Ke1', 'Bb4+', 'Kd1', 'Bb3+',
  'Kc1', 'Ne2+', 'Kb1', 'Nc3+', 'Kc1', 'Rc2#',
]);

// No. 8 — Pawns of Destiny: two connected passed pawns (a7 + h6) beat a rook
// by a full-board king walk. Verified tablebase-perfect (Lichess 5-piece TB).
const PWN = '8/8/P6P/8/8/8/1r6/K1k5 w - - 0 1'; // Ka1, Pa6, Ph6 vs Kc1, Rb2
replay(PWN, [
  'a7', 'Rb1+', 'Ka2', 'Rb2+', 'Ka3', 'Kb1', 'h7', 'Ra2+', 'Kb3', 'Rb2+',
  'Ka4', 'Ra2+', 'Kb5', 'Rb2+', 'Kc6', 'Rc2+', 'Kd7', 'Rd2+', 'Ke7', 'Re2+',
  'Kf7', 'Rf2+', 'Kg6', 'Rg2+', 'Kh5', 'Ra2', 'Kg4', 'Ra4+', 'Kf3', 'Ra3+',
  'Ke2', 'Ra2+', 'Ke1', 'Rxa7', 'h8=Q',
]);
// the a8=Q?? skewer refutation, shown after 6...Kb1
replay('8/P7/7P/8/8/K7/1r6/1k6 w - - 0 4', ['a8=Q', 'Ra2+']);
// the center-blunder demo shown live: from the check position (after 5...Rb2+)
// White strays with Kc3??, Black checks Rc2+, king runs Kd3, rook swings to the
// back rank Rc8 and rakes both queening squares — verified draw.
replay('8/P6P/8/8/8/1K6/1r6/1k6 w - - 3 6', ['Kc3', 'Rc2+', 'Kd3', 'Rc8']);

// No. 10 — King & Rook Checkmate (modeled on GothamChess). Stockfish-perfect
// line; star = the BACKWARDS waiting move Rf1 (Rf8+ hangs the rook, Kxf8 draw).
replay('8/8/5k2/R7/5K2/8/8/8 w - - 0 1', [
  'Re5', 'Kg6', 'Rf5', 'Kh6', 'Rf6+', 'Kg7', 'Kg5', 'Kh7', 'Rf7+', 'Kh8',
  'Kg6', 'Kg8', 'Rf1', 'Kh8', 'Rf8#',
]);
replay('6k1/5R2/6K1/8/8/8/8/8 w - - 0 1', ['Rf8+', 'Kxf8']); // the premature-check trap

// No. 11 — The Two Knights (source: @pietrocheckmate "Knightmare.").
// Black to move and win vs a queening pawn; verified by verify-knightmare.ts.
const KNM = 'K7/PN3k2/4n3/8/2n5/8/8/8 b - - 0 1';
replay(KNM, ['Nc7+', 'Kb8', 'Na6+', 'Ka8', 'Nb6#']); // corner demo
replay(KNM, ['Nc7+', 'Kb8', 'Na6+', 'Kc8', 'Ke8', 'a8=Q', 'Nb6#']); // queen demo
replay(KNM, ['Nc7+', 'Kb8', 'Na6+', 'Kc8', 'Ke8', 'a8=N', 'Ke7', 'Nc7', 'Nb6#']); // zugzwang demo 1
replay(KNM, ['Nc7+', 'Kb8', 'Na6+', 'Kc8', 'Ke8', 'a8=N', 'Ke7', 'Nc5', 'Nd6#']); // zugzwang demo 2

// No. 12 — Hikaru's Queen Sacrifice (PotapovaM–Nakamura, chess.com 2026-07-23,
// game 179133472429; verified by verify-hikaru-trap.ts). Reel opens at 20...Rc8.
const HIK = '2rq1rk1/5ppp/5n2/p2bN3/1bB2P2/8/1P3BPP/R2Q1RK1 w - - 3 21';
replay(HIK, ['Ba6', 'Rc7', 'Bb6', 'Rc2', 'Bxd8', 'Bc5+', 'Rf2', 'Rxf2', 'Bxf6', 'Rxb2+', 'Kf1', 'Bxg2+', 'Ke1', 'Bf2#']);
replay(HIK, ['Ba6', 'Rc7', 'Bb6', 'Rc2', 'Qxc2', 'Qxb6+']); // the poisoned rook
replay(HIK, ['Ba6', 'Rc7', 'Bb6', 'Rc2', 'Bxd8', 'Rxg2+', 'Kh1', 'Rd2+', 'Nf3']); // the refuted grab
replay(HIK, ['Ba6', 'Rc7', 'Bb6', 'Rc2', 'Bxd8', 'Bc5+', 'Kh1', 'Bxg2#']); // corner-mate demo 1
replay(HIK, ['Ba6', 'Rc7', 'Bb6', 'Rc2', 'Bxd8', 'Bc5+', 'Rf2', 'Rxf2', 'Bxf6', 'Rxb2+', 'Kh1', 'Bxg2#']); // corner-mate demo 2

const COMPS = [
  'remotion/SaavedraReel.tsx',
  'remotion/ZugzwangReel.tsx',
  'remotion/ChosenOneReel.tsx',
  'remotion/ImmortalReel.tsx',
  'remotion/MarshallReel.tsx',
  'remotion/SmotheredReel.tsx',
  'remotion/LegalReel.tsx',
  'remotion/CenturyReel.tsx',
  'remotion/CenturyReel2.tsx',
  'remotion/PawnsDestinyReel.tsx',
  'remotion/KingRookReel.tsx',
  'remotion/KnightmareReel.tsx',
  'remotion/HikaruTrapReel.tsx',
];

let bad = 0;
for (const f of COMPS) {
  const src = fs.readFileSync(f, 'utf8');
  const fens = [...src.matchAll(/fen: '([^']+)'/g)].map((m) => m[1]);
  const consts = [...src.matchAll(/= '((?:[rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+ [wb][^']*)'/g)].map((m) => m[1]);
  for (const fen of [...fens, ...consts]) {
    if (!whitelist.has(fen.split(' ')[0])) {
      console.log('BAD FEN', f, fen);
      bad++;
    }
  }
  console.log(`${f}: ${fens.length + consts.length} fens checked`);
}
if (bad > 0) {
  console.error(`\n${bad} unverifiable FEN(s) — fix before rendering.`);
  process.exit(1);
}
console.log('\nALL FENS VERIFIED');
