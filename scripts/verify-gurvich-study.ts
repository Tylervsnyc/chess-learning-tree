/** Verify the Gurvich 1959 study line + emit every FEN for the comp. */
import { Chess } from 'chess.js';

const START = '3kr3/5R2/7p/p4K1B/P7/7P/8/8 w - - 0 1';

function play(fen: string, moves: string[], label: string): string[] {
  const c = new Chess(fen);
  const fens: string[] = [];
  for (const m of moves) {
    const mv = c.move(m);
    if (!mv) throw new Error(`${label}: illegal ${m} at ${c.fen()}`);
    fens.push(`${m} → ${c.fen()}`);
  }
  console.log(`OK ${label}: ${moves.join(' ')}`);
  return fens;
}

// Main line to the zugzwang
const main = play(START, ['Rc7', 'Rg8', 'Rc4', 'Rg5+', 'Ke6', 'Rxh5', 'h4'], 'main');

// Branch A: 1...Kxc7?? 2.Bxe8
play(START, ['Rc7', 'Kxc7', 'Bxe8'], 'branch Kxc7');

// Branch B: careless rook move → fork wins the bishop
play(START, ['Rc7', 'Rg8', 'Rb7', 'Rg5+', 'Kf4', 'Rxh5'], 'branch Rb7 fork');

// Zugzwang: enumerate ALL Black legal moves after 4.h4
const z = new Chess(main[main.length - 1].split(' → ')[1]);
console.log('\nAfter 4.h4, Black legal moves:', z.moves().join(', '));

// Claim: every rook move loses the rook immediately (captured for free or by pawn/rook/king)
for (const m of z.moves({ verbose: true })) {
  if (m.piece === 'r') {
    const c2 = new Chess(z.fen());
    c2.move(m.san);
    const recapture = c2.moves({ verbose: true }).find((x) => x.to === m.to && x.captured === 'r');
    console.log(`  rook ${m.san}: recapture = ${recapture ? recapture.san : 'NONE ?!'}`);
  }
}

// Forced finish: 4...Ke8 5.Rc8#
const fin = new Chess(z.fen());
fin.move('Ke8');
const mate = fin.move('Rc8+');
console.log(`\n5.${mate?.san} — checkmate: ${fin.isCheckmate()}`);
console.log('\nFEN dump for the comp:');
console.log('start', START);
main.forEach((f) => console.log(f));
const kx = new Chess(START); kx.move('Rc7'); console.log('afterRc7', kx.fen());
kx.move('Kxc7'); console.log('Kxc7', kx.fen());
kx.move('Bxe8'); console.log('Bxe8', kx.fen());
const rb = new Chess(START); ['Rc7','Rg8','Rb7','Rg5+','Kf4','Rxh5'].forEach(m=>rb.move(m));
const rbc = new Chess(START); const rbs: string[] = []; ['Rc7','Rg8','Rb7','Rg5+','Kf4','Rxh5'].forEach(m=>{rbc.move(m); rbs.push(`${m} → ${rbc.fen()}`)});
rbs.forEach((f)=>console.log('B:', f));
fin.undo(); fin.undo();
console.log('Ke8', (()=>{const c=new Chess(z.fen()); c.move('Ke8'); return c.fen()})());
console.log('Rc8#', (()=>{const c=new Chess(z.fen()); c.move('Ke8'); c.move('Rc8+'); return c.fen()})());
