/**
 * Bake a REAL game out of the DB into a static file the post-game test page
 * can replay instantly.
 *
 * Why bake: the in-browser review runs Stockfish over every position, which
 * takes ~a minute for a long game. The test page exists to look at the popup's
 * animations over and over, so the analysis runs ONCE here and the page loads
 * with real numbers.
 *
 * It uses the SAME grading functions the app uses (analyzeGameMoves +
 * applyBookMoves), so the counts match what the player actually saw.
 *
 * Usage:
 *   npx tsx scripts/bake-postgame-game.ts --session=<uuid> [--depth=18]
 *   npx tsx scripts/bake-postgame-game.ts --list          # Tyler's games with legendary moves
 *
 * Needs a `stockfish` binary on PATH (brew install stockfish).
 */

import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import dotenv from 'dotenv';
import { analyzeGameMoves, type PositionEval } from '../lib/game-eval';
import { applyBookMoves } from '../lib/review/book-moves';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** Tyler's three accounts — see the project memory note on this. */
const TYLER_IDS = [
  'e52d08d3-c76f-4eba-bacd-91ff050a4019', // tyler@learnthroughstories.com (web)
  '3990eeb1-6c54-49b2-a0a7-07a7af41b5b6', // tyler@tylervsnyc.com (Los_tiki)
  '5452a511-e19d-4191-855b-62a47e86b3b4', // steve.roark72@gmail.com (Tylervsnyc)
];

function argOf(name: string): string | undefined {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  return hit?.split('=')[1];
}

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

// ─── Stockfish (single PV, white's-perspective scores) ───────────────────────

interface Evaled { cp: number | null; mate: number | null; bestMove: string | null; bestLine: string[] }

function evalFen(fen: string, depth: number): Promise<Evaled> {
  return new Promise((resolve, reject) => {
    const sf = spawn('stockfish', [], { stdio: ['pipe', 'pipe', 'pipe'] });
    // Stockfish scores from the side-to-move's view; game-eval wants white's.
    const flip = (fen.split(' ')[1] || 'w') === 'b' ? -1 : 1;
    let buf = '';
    let cp: number | null = null;
    let mate: number | null = null;
    let line: string[] = [];
    sf.on('error', reject);
    sf.stdout.on('data', (d: Buffer) => {
      buf += d.toString();
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const l of lines) {
        if (l.startsWith('info') && l.includes(' pv ')) {
          const score = l.match(/score (cp|mate) (-?\d+)/);
          if (score) {
            if (score[1] === 'cp') { cp = Number(score[2]) * flip; mate = null; }
            else { mate = Number(score[2]) * flip; cp = null; }
          }
          const pv = l.match(/ pv (.+)$/);
          if (pv) line = pv[1].trim().split(/\s+/);
        }
        if (l.startsWith('bestmove')) {
          const raw = l.split(' ')[1];
          sf.kill();
          resolve({ cp, mate, bestMove: raw && raw !== '(none)' ? raw : null, bestLine: line });
        }
      }
    });
    sf.stdin.write(`uci\nposition fen ${fen}\ngo depth ${depth}\n`);
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

interface SessionRow {
  id: string; user_id: string; result: string | null; result_method: string | null;
  player_color: string | null; total_moves: number | null;
  brilliant_moves: number | null; great_moves: number | null;
  rookie_difficulty: number | null; started_at: string;
}
interface MoveRow { move_number: number; moved_by: string; move_san: string; fen_after: string }

async function list() {
  const rows = await rest<SessionRow[]>(
    `game_sessions?select=id,user_id,result,result_method,player_color,total_moves,brilliant_moves,great_moves,rookie_difficulty,started_at` +
    `&user_id=in.(${TYLER_IDS.join(',')})&brilliant_moves=gt.0&order=started_at.desc&limit=25`,
  );
  for (const r of rows) {
    console.log(
      `${r.id}  ${r.started_at.slice(0, 10)}  ${(r.result ?? '?').padEnd(5)} by ${(r.result_method ?? '?').padEnd(12)}` +
      `  ${r.total_moves} moves  ${r.brilliant_moves} legendary / ${r.great_moves} great  (${r.player_color})`,
    );
  }
}

async function bake(sessionId: string, depth: number) {
  const [session] = await rest<SessionRow[]>(
    `game_sessions?select=id,user_id,result,result_method,player_color,total_moves,brilliant_moves,great_moves,rookie_difficulty,started_at&id=eq.${sessionId}`,
  );
  if (!session) throw new Error(`no session ${sessionId}`);

  const moves = await rest<MoveRow[]>(
    `session_moves?select=move_number,moved_by,move_san,fen_after&session_id=eq.${sessionId}&order=move_number.asc`,
  );
  if (!moves.length) throw new Error('session has no moves');

  const playerColor = (session.player_color === 'black' ? 'black' : 'white') as 'white' | 'black';
  console.log(`${moves.length} moves, ${playerColor}, stored: ${session.brilliant_moves} legendary / ${session.great_moves} great`);
  console.log(`evaluating ${moves.length + 1} positions at depth ${depth}…`);

  const fens = [START_FEN, ...moves.map(m => m.fen_after)];
  const evals: PositionEval[] = [];
  for (let i = 0; i < fens.length; i++) {
    const r = await evalFen(fens[i], depth);
    evals.push({ ...r, depth });
    process.stderr.write(`\r  ${i + 1}/${fens.length}`);
  }
  process.stderr.write('\n');

  const moveInfos = moves.map(m => ({
    san: m.move_san,
    movedBy: m.moved_by as 'player' | 'rookie',
    moveNumber: m.move_number,
    fenAfter: m.fen_after,
  }));
  const analysis = applyBookMoves(
    analyzeGameMoves(evals, moveInfos, playerColor, START_FEN),
    moves.map(m => m.move_san),
    playerColor,
  );

  console.log(
    `graded: ${analysis.brilliantMoves} legendary · ${analysis.greatMoves} great · ` +
    `${analysis.inaccuracies} inacc · ${analysis.mistakes} mistake · ${analysis.blunders} blunder · ` +
    `${Math.round(analysis.playerAccuracy)}% accuracy`,
  );

  const legendary = analysis.moves
    .filter(m => m.movedBy === 'player' && m.classification === 'brilliant')
    .map(m => ({ moveNumber: m.moveNumber, san: m.san }));
  if (!legendary.length) {
    console.warn('WARNING: deep analysis found no legendary move in this game.');
  } else {
    console.log(`legendary: ${legendary.map(m => `#${m.moveNumber} ${m.san}`).join(', ')}`);
  }

  const outcome = session.result === 'win' ? 'win'
    : session.result === 'draw' ? 'draw'
    : session.result_method === 'resignation' && session.result === 'loss' ? 'loss'
    : 'loss';

  const out = `// GENERATED by scripts/bake-postgame-game.ts — do not hand-edit.
// A real Play Rookie game, graded at Stockfish depth ${depth} by the same
// functions the app uses (analyzeGameMoves + applyBookMoves).
//
// Session ${session.id} · ${session.started_at.slice(0, 10)}

import type { MoveStats } from '@/components/shared/ActivityComplete'

export const REAL_GAME = {
  sessionId: ${JSON.stringify(session.id)},
  playedOn: ${JSON.stringify(session.started_at.slice(0, 10))},
  playerColor: ${JSON.stringify(playerColor)},
  outcome: ${JSON.stringify(outcome)} as 'win' | 'loss' | 'draw' | 'resign',
  resultMethod: ${JSON.stringify(session.result_method)},
  rookieDifficulty: ${session.rookie_difficulty ?? 'null'},
  totalMoves: ${moves.length},
  accuracy: ${Math.round(analysis.playerAccuracy)},
  depth: ${depth},
  /** The legendary move(s) the engine found, for the page's caption. */
  legendary: ${JSON.stringify(legendary)},
  openingMoves: ${JSON.stringify(moves.slice(0, 8).map(m => m.move_san))},
} as const

export const REAL_GAME_STATS: MoveStats = {
  legendary: ${analysis.brilliantMoves},
  great: ${analysis.greatMoves},
}
`;
  writeFileSync('data/test/postgame-real-game.ts', out);
  console.log('wrote data/test/postgame-real-game.ts');
}

/** Grade a batch of sessions under the CURRENT rule without writing anything. */
async function scan(ids: string[], depth: number) {
  for (const id of ids) {
    const [session] = await rest<SessionRow[]>(
      `game_sessions?select=id,user_id,result,result_method,player_color,total_moves,brilliant_moves,great_moves,rookie_difficulty,started_at&id=eq.${id}`,
    );
    const moves = await rest<MoveRow[]>(
      `session_moves?select=move_number,moved_by,move_san,fen_after&session_id=eq.${id}&order=move_number.asc`,
    );
    if (!session || !moves.length) { console.log(`${id}  (no moves)`); continue; }
    const playerColor = (session.player_color === 'black' ? 'black' : 'white') as 'white' | 'black';
    const fens = [START_FEN, ...moves.map(m => m.fen_after)];
    const evals: PositionEval[] = [];
    for (const f of fens) evals.push({ ...(await evalFen(f, depth)), depth });
    const a = applyBookMoves(
      analyzeGameMoves(evals, moves.map(m => ({ san: m.move_san, movedBy: m.moved_by as 'player' | 'rookie', moveNumber: m.move_number, fenAfter: m.fen_after })), playerColor, START_FEN),
      moves.map(m => m.move_san),
      playerColor,
    );
    console.log(
      `${id}  ${session.started_at.slice(0, 10)}  stored ${session.brilliant_moves}L/${session.great_moves}G` +
      `  ->  now ${a.brilliantMoves}L/${a.greatMoves}G ${a.inaccuracies}?! ${a.mistakes}? ${a.blunders}??  ${Math.round(a.playerAccuracy)}%`,
    );
  }
}

const scanArg = argOf('scan');
const sessionArg = argOf('session');
if (scanArg) {
  scan(scanArg.split(','), Number(argOf('depth') ?? 10)).catch(e => { console.error(e); process.exit(1); });
} else if (process.argv.includes('--list') || !sessionArg) {
  list().catch(e => { console.error(e); process.exit(1); });
} else {
  bake(sessionArg, Number(argOf('depth') ?? 18)).catch(e => { console.error(e); process.exit(1); });
}
