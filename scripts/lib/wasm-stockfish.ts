/**
 * The app's OWN engine, in node: public/stockfish/stockfish-18.js (the WASM
 * build the browser runs), driven with exactly the UCI sequence
 * lib/stockfish/stockfish-adapter.ts#getFullEval sends. Grades computed here
 * match what a phone computes for the same game — native `stockfish` uses a
 * different (bigger) net and disagrees by ~100cp in won positions, which is
 * enough to flip Legendary gates. Scripts that grade (calibrate-legendary,
 * backfill-move-grades) use this, never native stockfish.
 */

import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { join } from 'node:path';
import type { PositionEval } from '../../lib/game-eval';

// Scripts run from the repo root (npx tsx scripts/...).
const ENGINE_DIR = join(process.cwd(), 'public', 'stockfish');

export class WasmEngine {
  private sf: ChildProcessWithoutNullStreams;
  private buf = '';
  private pending: ((lines: string[]) => void) | null = null;
  private lines: string[] = [];
  private ready: Promise<void>;

  constructor() {
    this.sf = spawn('node', ['stockfish-18.js'], { cwd: ENGINE_DIR });
    let onReady: () => void = () => {};
    this.ready = new Promise(r => { onReady = r; });
    this.sf.stdout.on('data', (d: Buffer) => {
      this.buf += d.toString();
      const parts = this.buf.split('\n');
      this.buf = parts.pop() ?? '';
      for (const l of parts) {
        if (l === 'uciok') onReady();
        this.lines.push(l);
        if (l.startsWith('bestmove') && this.pending) {
          const done = this.pending;
          this.pending = null;
          const out = this.lines;
          this.lines = [];
          done(out);
        }
      }
    });
    this.sf.stdin.write('uci\n');
  }

  /** Same parse as getFullEval: last non-bound PV-1 score, white's perspective. */
  async evaluate(fen: string, depth: number): Promise<PositionEval> {
    await this.ready;
    this.lines = [];
    const out = await new Promise<string[]>(resolve => {
      this.pending = resolve;
      this.sf.stdin.write(
        'setoption name UCI_LimitStrength value false\n' +
        'setoption name MultiPV value 1\n' +
        'setoption name Skill Level value 20\n' +
        'ucinewgame\n' +
        `position fen ${fen}\n` +
        `go depth ${depth}\n`,
      );
    });
    const flip = (fen.split(' ')[1] || 'w') === 'b' ? -1 : 1;
    let cp: number | null = null;
    let mate: number | null = null;
    for (const l of out) {
      if (!l.startsWith('info') || !l.includes(' score ')) continue;
      const mpv = l.match(/ multipv (\d+)/);
      if (mpv && mpv[1] !== '1') continue;
      if (l.includes(' lowerbound') || l.includes(' upperbound')) continue;
      const m = l.match(/score (cp|mate) (-?\d+)/);
      if (!m) continue;
      if (m[1] === 'cp') { cp = Number(m[2]); mate = null; } else { mate = Number(m[2]); cp = null; }
    }
    const bm = out[out.length - 1]?.split(' ')[1];
    return {
      cp: cp === null ? null : cp * flip,
      mate: mate === null ? null : mate * flip,
      bestMove: bm && bm !== '(none)' ? bm : null,
      bestLine: [],
      depth,
    };
  }

  kill() { this.sf.kill(); }
}

/** Evaluate `fens` across a pool of engines, preserving order. */
export async function evaluateAll(
  fens: string[],
  depth: number,
  poolSize = 8,
  onProgress?: (done: number, total: number) => void,
): Promise<PositionEval[]> {
  const engines = Array.from({ length: Math.min(poolSize, Math.max(1, fens.length)) }, () => new WasmEngine());
  const out = new Array<PositionEval>(fens.length);
  let next = 0;
  let done = 0;
  try {
    await Promise.all(engines.map(async engine => {
      for (;;) {
        const i = next++;
        if (i >= fens.length) return;
        out[i] = await engine.evaluate(fens[i], depth);
        done++;
        onProgress?.(done, fens.length);
      }
    }));
  } finally {
    engines.forEach(e => e.kill());
  }
  return out;
}
