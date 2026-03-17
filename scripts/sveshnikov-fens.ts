import { Chess } from 'chess.js';

function trace(moves: string[]) {
  const c = new Chess();
  const results: any[] = [];
  for (const m of moves) {
    const mv = c.move(m);
    if (!mv) { console.error('INVALID:', m); process.exit(1); }
    results.push({ san: mv.san, from: mv.from, to: mv.to, fen: c.fen() });
  }
  return results;
}

const main = trace(['e4','c5','Nf3','Nc6','d4','cxd4','Nxd4','Nf6','Nc3','e5','Ndb5','d6','Bg5','a6','Na3','b5','Nd5','Be7','Bxf6','Bxf6','c3','O-O','Nc2','Bg5']);
console.log('=== MAIN LINE ===');
main.forEach((m,i) => console.log('m'+(i+1)+' '+m.san+': '+m.fen+' | '+m.from+'->'+m.to));

// Dev 1: 7.Nd5
const c2 = new Chess();
['e4','c5','Nf3','Nc6','d4','cxd4','Nxd4','Nf6','Nc3','e5','Ndb5','d6'].forEach(m => c2.move(m));
console.log('\n=== DEV 7.Nd5 ===');
for (const m of ['Nd5','Nxd5','exd5','Nb8','a4','Be7']) { const mv = c2.move(m)!; console.log(m+': '+c2.fen()+' | '+mv.from+'->'+mv.to); }

// Dev 2: 8.Bxf6
const c3 = new Chess();
['e4','c5','Nf3','Nc6','d4','cxd4','Nxd4','Nf6','Nc3','e5','Ndb5','d6','Bg5','a6'].forEach(m => c3.move(m));
console.log('\n=== DEV 8.Bxf6 ===');
for (const m of ['Bxf6','gxf6','Na3','b5','Nd5','f5']) { const mv = c3.move(m)!; console.log(m+': '+c3.fen()+' | '+mv.from+'->'+mv.to); }

// Dev 3: 10.Nxe7
const c4 = new Chess();
['e4','c5','Nf3','Nc6','d4','cxd4','Nxd4','Nf6','Nc3','e5','Ndb5','d6','Bg5','a6','Na3','b5','Nd5','Be7'].forEach(m => c4.move(m));
console.log('\n=== DEV 10.Nxe7 ===');
for (const m of ['Nxe7','Nxe7','Bxf6','gxf6','c4','Bb7']) { const mv = c4.move(m)!; console.log(m+': '+c4.fen()+' | '+mv.from+'->'+mv.to); }
