/**
 * Finds a legal perpetual-chase cycle for the locker board animation:
 * black bishop + knight chase a white king forever, every black move a
 * CHECK, every white reply a legal escape, position repeating -> loop.
 *
 * Constraints (drawn-board window): the full folded half-board, files a..h,
 * ranks 1..4 — minus the squares whose sprite would stand behind the Enemy's
 * Tears bottle (h1..h3, front-right corner).
 * Black king parked on a8 (needed for legality, never rendered).
 * A checking piece must never be capturable: not adjacent to the king,
 * or defended by the other black piece.
 *
 * Output: data/locker-chase.json — the cycle as a list of plies.
 * Run: npx tsx scripts/design-locker-chase.ts
 */
import { Chess } from 'chess.js';
import { writeFileSync } from 'fs';

// full 8 files x 4 ranks (a board folded in half). The bottle stands in
// front of the board's front-right corner, so pieces never park there.
const FILES = 'abcdefgh';
const RANKS = [1, 2, 3, 4];
const OCCLUDED = new Set(['h1', 'h2', 'h3']);
const SQUARES: string[] = [];
for (const f of FILES) for (const r of RANKS) {
  const sq = `${f}${r}`;
  if (!OCCLUDED.has(sq)) SQUARES.push(sq);
}
const IN_WINDOW = new Set(SQUARES);

type State = { k: string; b: string; n: string; turn: 'b' | 'w' };
const key = (s: State) => `${s.k}|${s.b}|${s.n}|${s.turn}`;

function fen(s: State): string {
  // build an 8x8 board: white K, black B/N, black K on a8
  const board: (string | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  const put = (sq: string, piece: string) => {
    const file = sq.charCodeAt(0) - 97;
    const rank = Number(sq[1]) - 1;
    board[7 - rank][file] = piece;
  };
  put('a8', 'k');
  put(s.k, 'K');
  put(s.b, 'b');
  put(s.n, 'n');
  const rows = board.map((row) => {
    let out = '';
    let empty = 0;
    for (const c of row) {
      if (!c) { empty++; continue; }
      if (empty) { out += empty; empty = 0; }
      out += c;
    }
    if (empty) out += empty;
    return out;
  });
  return `${rows.join('/')} ${s.turn} - - 0 1`;
}

function tryLoad(s: State): Chess | null {
  try {
    const c = new Chess(fen(s));
    return c;
  } catch {
    return null;
  }
}

const adj = (a: string, b: string) =>
  Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) <= 1 && Math.abs(Number(a[1]) - Number(b[1])) <= 1 && a !== b;

// black edges: checking moves only, checker safe from capture
function blackMoves(s: State): { to: State; ply: { piece: 'b' | 'n'; from: string; to: string } }[] {
  const c = tryLoad(s);
  if (!c) return [];
  const out: { to: State; ply: { piece: 'b' | 'n'; from: string; to: string } }[] = [];
  for (const m of c.moves({ verbose: true })) {
    if (m.color !== 'b' || (m.piece !== 'b' && m.piece !== 'n')) continue;
    if (!IN_WINDOW.has(m.to)) continue;
    if (m.captured) continue;
    const c2 = new Chess(fen(s));
    c2.move(m.san);
    if (!c2.inCheck()) continue; // must be check
    if (c2.isCheckmate()) continue; // must be escapable
    const next: State = {
      k: s.k,
      b: m.piece === 'b' ? m.to : s.b,
      n: m.piece === 'n' ? m.to : s.n,
      turn: 'w',
    };
    // checker not capturable: not adjacent to K, or defended by the partner
    const checker = m.to;
    if (adj(checker, s.k)) {
      const partner = m.piece === 'b' ? next.n : next.b;
      const c3 = tryLoad({ ...next, turn: 'b' });
      if (!c3) continue;
      const defended = c3
        .moves({ verbose: true })
        .some((mm) => mm.from === partner && mm.to === checker);
      if (!defended) continue;
    }
    out.push({ to: next, ply: { piece: m.piece, from: m.from, to: m.to } });
  }
  return out;
}

// white edges: king escapes (no captures, stay in window)
function whiteMoves(s: State): { to: State; ply: { piece: 'k'; from: string; to: string } }[] {
  const c = tryLoad(s);
  if (!c) return [];
  const out: { to: State; ply: { piece: 'k'; from: string; to: string } }[] = [];
  for (const m of c.moves({ verbose: true })) {
    if (m.piece !== 'k' || m.color !== 'w') continue;
    if (!IN_WINDOW.has(m.to)) continue;
    if (m.captured) continue;
    out.push({ to: { ...s, k: m.to, turn: 'b' }, ply: { piece: 'k', from: m.from, to: m.to } });
  }
  return out;
}

// ─── cycle search: iterative DFS with on-stack detection ───
type Edge = { to: State; ply: { piece: string; from: string; to: string } };
const edgeCache = new Map<string, Edge[]>();
function edges(s: State): Edge[] {
  const k = key(s);
  const hit = edgeCache.get(k);
  if (hit) return hit;
  const e = s.turn === 'b' ? blackMoves(s) : whiteMoves(s);
  edgeCache.set(k, e);
  return e;
}

function findCycles(maxSeeds: number, maxDepth: number): { plies: Edge['ply'][]; kingSquares: number }[] {
  const found: { plies: Edge['ply'][]; kingSquares: number }[] = [];
  let seeds = 0;
  outer: for (const k of SQUARES) {
    for (const b of SQUARES) {
      if (b === k) continue;
      for (const n of SQUARES) {
        if (n === k || n === b) continue;
        const seed: State = { k, b, n, turn: 'b' };
        if (edges(seed).length === 0) continue;
        if (++seeds > maxSeeds) break outer;
        // DFS from seed looking for a path back to seed
        const stack: { s: State; ei: number; path: Edge['ply'][] }[] = [{ s: seed, ei: 0, path: [] }];
        const onPath = new Set<string>([key(seed)]);
        while (stack.length) {
          const top = stack[stack.length - 1];
          const es = edges(top.s);
          if (top.ei >= es.length || top.path.length >= maxDepth) {
            onPath.delete(key(top.s));
            stack.pop();
            continue;
          }
          const e = es[top.ei++];
          const ek = key(e.to);
          if (ek === key(seed) && top.path.length >= 7) {
            const plies = [...top.path, e.ply];
            const kingSquares = new Set(plies.filter((p) => p.piece === 'k').map((p) => p.to)).size;
            found.push({ plies, kingSquares });
            if (found.length >= 200) return found;
            continue;
          }
          if (onPath.has(ek)) continue;
          onPath.add(ek);
          stack.push({ s: e.to, ei: 0, path: [...top.path, e.ply] });
        }
      }
    }
  }
  return found;
}

let cycles = findCycles(4000, 20);
if (cycles.length === 0) {
  console.error('No pure-check cycles found — relax constraints.');
  process.exit(1);
}
// prefer: most distinct king squares, then widest roam across the 8 files
// (the whole point of the folded half-board), then longest
const fileSpread = (c: { plies: { to: string }[] }) =>
  new Set(c.plies.map((p) => p.to[0])).size;
// both black pieces must take part — the renderer seeds each piece's start
// square from its first ply, and a frozen bishop reads as a prop, not a chase
const active = cycles.filter(
  (c) => c.plies.some((p) => p.piece === 'b') && c.plies.some((p) => p.piece === 'n'),
);
if (active.length) cycles = active;
cycles.sort(
  (a, b) =>
    b.kingSquares - a.kingSquares ||
    fileSpread(b) - fileSpread(a) ||
    b.plies.length - a.plies.length,
);
const best = cycles[0];
console.log(`file spread: ${fileSpread(best)} of 8`);
console.log(`found ${cycles.length} cycles; best: ${best.plies.length} plies, king visits ${best.kingSquares} squares`);
console.log(best.plies.map((p) => `${p.piece}${p.from}-${p.to}`).join(' '));
writeFileSync('data/locker-chase.json', JSON.stringify(best.plies, null, 2));
console.log('wrote data/locker-chase.json');
