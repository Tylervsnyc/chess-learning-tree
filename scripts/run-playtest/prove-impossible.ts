/** Exhaustive BFS: can ANY move sequence beat a level? (small levels only) */
import { RUNS } from '../../lib/run/runs';
import { puzzleToBoardState } from '../../lib/run/seed';
import { rookieLegalMoves } from '../../lib/run/movement';
import { applyRookieMove } from '../../lib/run/engine';
import { settleEnemyTurns } from './bots/t3';
import type { BoardState } from '../../lib/run/types';

const runId = process.argv[2] ?? 'the-x';
const levelIdx = parseInt(process.argv[3] ?? '0', 10);
const run = RUNS.find((r) => r.id === runId)!;
const puzzle = run.levels[levelIdx]({ file: 4, rank: 1 });
const start = puzzleToBoardState(puzzle, { runId });

const key = (s: BoardState) =>
  `${s.rookie.file},${s.rookie.rank}|${s.form}|${s.pieces.map((p) => `${p.type}${p.file},${p.rank}`).sort().join(';')}|t${s.tempo}|o${s.pendingOffer ? 1 : 0}`;

const seen = new Set<string>();
let frontier: BoardState[] = [start];
let won = false;
let depth = 0;
outer: while (frontier.length > 0 && depth < 60) {
  const next: BoardState[] = [];
  for (const s of frontier) {
    for (const m of rookieLegalMoves(s)) {
      let after = applyRookieMove(s, m);
      if (after === s) continue;
      if (after.status === 'won') { won = true; break outer; }
      // Auto-dismiss any offer (max tempo path check is separate)
      after = settleEnemyTurns(after);
      if (after.status !== 'playing') continue;
      const k = key(after);
      if (seen.has(k)) continue;
      seen.add(k);
      next.push(after);
    }
  }
  frontier = next;
  depth++;
}
console.log(`${runId}/${levelIdx}: ${won ? 'WINNABLE' : `PROVED UNWINNABLE (explored ${seen.size} states to depth ${depth}, offers dismissed)`}`);
console.log(`max tempo available on board: ${start.pieces.length} piece(s) = ${start.pieces.reduce((a, p) => a + ({pawn:1,knight:2,bishop:2,queen:4} as any)[p.type], 0)} tempo (offer needs 8)`);
