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

const COMPS = [
  'remotion/SaavedraReel.tsx',
  'remotion/ZugzwangReel.tsx',
  'remotion/ChosenOneReel.tsx',
  'remotion/ImmortalReel.tsx',
  'remotion/MarshallReel.tsx',
  'remotion/SmotheredReel.tsx',
  'remotion/LegalReel.tsx',
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
