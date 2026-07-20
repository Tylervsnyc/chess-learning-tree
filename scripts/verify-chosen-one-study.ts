/**
 * Verify the sacrifice-cascade study from pietrocheckmate reel DZOMdBnIPuQ
 * (Chess Path Classics No. 3 source). Emits every FEN for the comp.
 *
 * Main line: 1.Nxb6+ cxb6 2.Bc6+ Qxc6 3.Ke5+ Kb5 4.a4+ Kc5 5.b4+ axb4
 *            6.Rc4+ Bxc4 7.d4#
 * Rejected:  5.d4+? Kc4 6.d5+ K~ 7.dxc6 wins the queen but is a fortress draw.
 */
import { Chess } from 'chess.js';

const START = '8/2pq4/bp6/p7/k1N1BK1R/3P4/PP6/8 w - - 0 1';

function play(fen: string, moves: string[], label: string): string[] {
  const c = new Chess(fen);
  const out: string[] = [];
  for (const m of moves) {
    const mv = c.move(m);
    if (!mv) throw new Error(`${label}: illegal ${m} at ${c.fen()}`);
    out.push(`${m} → ${c.fen()}`);
  }
  console.log(`OK ${label}: ${moves.join(' ')}`);
  return out;
}

const MAIN = ['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'b4+', 'axb4', 'Rc4+', 'Bxc4', 'd4#'];
const fens = play(START, MAIN, 'main');

// Checkmate?
const end = new Chess(fens[fens.length - 1].split(' → ')[1]);
console.log('7.d4# checkmate:', end.isCheckmate());

// Only-move checks: enumerate Black's replies at each forced point
const checkpoints: [string[], string][] = [
  [['Nxb6+'], 'after 1.Nxb6+'],
  [['Nxb6+', 'cxb6', 'Bc6+'], 'after 2.Bc6+'],
  [['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+'], 'after 3.Ke5+'],
  [['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+'], 'after 4.a4+'],
  [['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'b4+'], 'after 5.b4+'],
  [['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'b4+', 'axb4', 'Rc4+'], 'after 6.Rc4+'],
];
for (const [moves, label] of checkpoints) {
  const c = new Chess(START);
  moves.forEach((m) => c.move(m));
  console.log(`${label}: ${c.moves().join(', ')}`);
}

// Rejected line: 5.d4+ Kc4 6.d5+ (discovered, forks the queen) then dxc6
play(START, ['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'd4+', 'Kc4', 'd5+', 'Kc5', 'dxc6'], 'rejected d4 line');

console.log('\nFEN dump:');
console.log('start', START);
fens.forEach((f) => console.log(f));
const rj = new Chess(START);
const rjs: string[] = [];
['Nxb6+', 'cxb6', 'Bc6+', 'Qxc6', 'Ke5+', 'Kb5', 'a4+', 'Kc5', 'd4+', 'Kc4', 'd5+', 'Kc5', 'dxc6'].forEach((m) => {
  rj.move(m);
  rjs.push(`${m} → ${rj.fen()}`);
});
rjs.slice(8).forEach((f) => console.log('R:', f));
