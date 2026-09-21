/**
 * Backfill: re-grade stored play-rookie games with the CURRENT rules and
 * rewrite their saved grades.
 *
 * Every position is evaluated with the app's own WASM engine
 * (scripts/lib/wasm-stockfish) at GRADE_DEPTH, graded through the one
 * pipeline (lib/review/grade: level-scaled Legendary gates + book pass), and
 * compared with what the row holds today.
 *
 * DRY-RUN by default: prints old → new per game, writes nothing.
 * --apply writes brilliant_moves / great_moves (+ move_grades once
 * supabase/migrations/2026-09-21-move-grades.sql has run) and recomputes the
 * owner's lifetime totals from their games.
 *
 * Usage:
 *   npx tsx scripts/backfill-move-grades.ts --user=<uuid>          # dry run, one player
 *   npx tsx scripts/backfill-move-grades.ts --game=<uuid>          # dry run, one game
 *   npx tsx scripts/backfill-move-grades.ts --all [--limit=N]      # dry run, everyone
 *   ...add --apply to write. [--pool=8] engine processes.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GRADE_DEPTH } from '../lib/game-eval';
import { gradeGame, toStoredGrades } from '../lib/review/grade';
import { countGrades, writeGameGrades } from '../lib/review/grades-store';
import { evaluateAll } from './lib/wasm-stockfish';

dotenv.config({ path: '.env.local' });

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const argOf = (n: string) => process.argv.find(a => a.startsWith(`--${n}=`))?.split('=')[1];
const APPLY = process.argv.includes('--apply');

interface GameRow {
  id: string;
  user_id: string;
  started_at: string;
  player_color: string | null;
  rookie_difficulty: number | null;
  brilliant_moves: number | null;
  great_moves: number | null;
}

async function main() {
  const user = argOf('user');
  const game = argOf('game');
  if (!user && !game && !process.argv.includes('--all')) {
    console.error('pass --user=<uuid>, --game=<uuid>, or --all');
    process.exit(1);
  }
  const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let q = service
    .from('game_sessions')
    .select('id, user_id, started_at, player_color, rookie_difficulty, brilliant_moves, great_moves')
    .eq('session_type', 'play-rookie')
    .gt('total_moves', 1)
    .order('started_at', { ascending: false });
  if (user) q = q.eq('user_id', user);
  if (game) q = q.eq('id', game);
  q = q.limit(Number(argOf('limit') ?? 1000));
  const { data: games, error } = await q;
  if (error) throw error;
  const rows = (games ?? []) as GameRow[];
  console.log(`${rows.length} game(s) · depth ${GRADE_DEPTH} · ${APPLY ? 'APPLY — writing' : 'DRY RUN — nothing written'}\n`);

  // Moves for every game, then one pooled engine pass over every position.
  type Mv = { san: string; movedBy: 'player' | 'rookie'; moveNumber: number; fenAfter: string };
  const movesBy = new Map<string, Mv[]>();
  for (const g of rows) {
    const { data: mv, error: mErr } = await service
      .from('session_moves')
      .select('move_number, moved_by, move_san, fen_after')
      .eq('session_id', g.id)
      .not('move_san', 'is', null)
      .order('move_number', { ascending: true });
    if (mErr) throw mErr;
    const moves: Mv[] = [];
    // Same rule as /review: stop at the first malformed row.
    for (const [i, m] of (mv ?? []).entries()) {
      if (!m.move_san || !m.fen_after) break;
      moves.push({ san: m.move_san, movedBy: m.moved_by === 'rookie' ? 'rookie' : 'player', moveNumber: m.move_number ?? i + 1, fenAfter: m.fen_after });
    }
    movesBy.set(g.id, moves);
  }

  const fens: string[] = [];
  const offset = new Map<string, number>();
  for (const g of rows) {
    offset.set(g.id, fens.length);
    fens.push(START_FEN, ...movesBy.get(g.id)!.map(m => m.fenAfter));
  }
  const evals = await evaluateAll(fens, GRADE_DEPTH, Number(argOf('pool') ?? 8), (d, t) => {
    if (d % 100 === 0 || d === t) process.stderr.write(`\r  ${d}/${t} positions`);
  });
  process.stderr.write('\n\n');

  console.log('  game      date        lvl  plies   legendary      great');
  let changed = 0;
  let written = 0;
  for (const g of rows) {
    const moves = movesBy.get(g.id)!;
    if (moves.length < 2) continue;
    const start = offset.get(g.id)!;
    const gEvals = evals.slice(start, start + moves.length + 1);
    const color = g.player_color === 'black' ? 'black' : 'white';
    const analysis = gradeGame(gEvals, moves, color, { playerLevel: g.rookie_difficulty });
    const stored = toStoredGrades(analysis, g.rookie_difficulty);
    const { brilliant, great } = countGrades(stored, moves.map(m => m.movedBy));
    const oldB = g.brilliant_moves ?? 0;
    const oldG = g.great_moves ?? 0;
    const diff = oldB !== brilliant || oldG !== great;
    if (diff) changed++;
    const where = analysis.moves
      .map((m, i) => (m.classification === 'brilliant' && m.movedBy === 'player' ? `${Math.floor(i / 2) + 1}${i % 2 ? '...' : '.'}${m.san}` : null))
      .filter(Boolean)
      .join(' ');
    console.log(
      `  ${g.id.slice(0, 8)}  ${g.started_at.slice(0, 10)}  L${String(g.rookie_difficulty ?? '?').padEnd(2)} ${String(moves.length).padStart(5)}   ` +
      `${String(oldB).padStart(3)} -> ${String(brilliant).padEnd(4)}  ${String(oldG).padStart(3)} -> ${String(great).padEnd(4)}` +
      `${diff ? ' *' : '  '} ${where}`,
    );

    // Refuse to save a grading with holes (engine failure) — same rule as /play.
    const complete = gEvals.every(e => e.cp !== null || e.mate !== null);
    if (APPLY && complete) {
      const r = await writeGameGrades(service, {
        sessionId: g.id, userId: g.user_id, grades: stored, movedBy: moves.map(m => m.movedBy), onlyIfUngraded: false,
      });
      if (r.written) written++;
    } else if (APPLY) {
      console.log('    ^ skipped: incomplete evals');
    }
  }
  console.log(`\n${changed}/${rows.length} game(s) change.${APPLY ? ` ${written} written.` : ' Re-run with --apply to write.'}`);
}

main().catch(e => { console.error(e); process.exit(1); });
