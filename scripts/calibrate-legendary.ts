/**
 * Calibrate the Legendary-move gates against real games, PER ROOKIE LEVEL.
 *
 * The question: at each level (game_sessions.rookie_difficulty), what share of
 * games contain at least one Legendary move for the player? Tyler's target:
 * ~1 in 4 at EVERY level — so the gates scale: weaker players get tolerance,
 * stronger players need near-perfect sacrifices.
 *
 * Two phases so the expensive part happens once:
 *
 *   --fetch   Pull every real play-rookie game (>= 20 plies), evaluate every
 *             position with the app's OWN WASM engine (scripts/lib/wasm-stockfish)
 *             at GRADE_DEPTH, and cache the evals. Slow (minutes).
 *   --sweep   Load the cache, grade each game with the real pipeline
 *             (lib/review/grade.ts: analyzeGameMoves + book pass), and score a
 *             lenient→strict ladder of gate sets per level. Picks, per level,
 *             the rung closest to 25% — never looser than a lower level's.
 *
 * Book moves are never Legendary: the book pass runs BEFORE counting.
 *
 * Usage:
 *   npx tsx scripts/calibrate-legendary.ts --fetch [--pool=8]
 *   npx tsx scripts/calibrate-legendary.ts --sweep
 *   npx tsx scripts/calibrate-legendary.ts --verify   # rates under the SHIPPED rules
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import dotenv from 'dotenv';
import {
  GRADE_DEPTH,
  cpLossForMover,
  legendaryFacts,
  legendaryRulesForLevel,
  passesLegendary,
  type LegendaryFacts,
  type LegendaryRules,
  type PositionEval,
} from '../lib/game-eval';
import { gradeGame } from '../lib/review/grade';
import { evaluateAll } from './lib/wasm-stockfish';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const TARGET = 25;

function argOf(name: string): string | undefined {
  return process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
}
// Big (every eval of every game) — kept out of git in node_modules/.cache.
const CACHE = argOf('cache') ?? 'node_modules/.cache/legendary-calibration.json';

// ─── DB ──────────────────────────────────────────────────────────────────────

async function rest<T>(path: string, range?: string): Promise<T> {
  const headers: Record<string, string> = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };
  if (range) headers.Range = range;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** PostgREST caps responses at 1000 rows — page with Range until a short page. */
async function restAll<T>(path: string): Promise<T[]> {
  const PAGE = 1000;
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const page = await rest<T[]>(path, `${from}-${from + PAGE - 1}`);
    out.push(...page);
    if (page.length < PAGE) return out;
  }
}

interface SessionRow { id: string; user_id: string; player_color: string | null; rookie_difficulty: number | null; started_at: string }
interface MoveRow { session_id: string; move_number: number; moved_by: string; move_san: string; fen_after: string }

interface CachedMove { san: string; movedBy: 'player' | 'rookie'; fenAfter: string }
interface CachedGame {
  sessionId: string;
  userId: string;
  level: number;
  playerColor: 'white' | 'black';
  moves: CachedMove[];
  evals: PositionEval[];
}

async function fetchPhase(pool: number) {
  const sessions = await restAll<SessionRow>(
    'game_sessions?select=id,user_id,player_color,rookie_difficulty,started_at' +
    '&session_type=eq.play-rookie&total_moves=gte.20&order=started_at.desc',
  );
  console.log(`${sessions.length} games`);

  const bySession = new Map<string, MoveRow[]>();
  // Chunk the IN() list — a few hundred uuids per request keeps the URL sane.
  for (let i = 0; i < sessions.length; i += 100) {
    const ids = sessions.slice(i, i + 100).map(s => s.id).join(',');
    const rows = await restAll<MoveRow>(
      `session_moves?select=session_id,move_number,moved_by,move_san,fen_after` +
      `&session_id=in.(${ids})&move_san=not.is.null&order=session_id.asc,move_number.asc`,
    );
    for (const m of rows) {
      const arr = bySession.get(m.session_id) ?? [];
      arr.push(m);
      bySession.set(m.session_id, arr);
    }
  }

  const games: Omit<CachedGame, 'evals'>[] = [];
  for (const s of sessions) {
    const rows = bySession.get(s.id);
    if (!rows?.length) continue;
    // Same rule as PastGameReview: truncate at the first malformed row.
    const moves: CachedMove[] = [];
    for (const r of rows) {
      if (!r.move_san || !r.fen_after) break;
      moves.push({ san: r.move_san, movedBy: r.moved_by === 'rookie' ? 'rookie' : 'player', fenAfter: r.fen_after });
    }
    if (moves.length < 20) continue;
    games.push({
      sessionId: s.id,
      userId: s.user_id,
      level: Math.max(1, Math.min(10, s.rookie_difficulty ?? 1)),
      playerColor: s.player_color === 'black' ? 'black' : 'white',
      moves,
    });
  }

  const fens: string[] = [];
  const offsets: number[] = [];
  for (const g of games) {
    offsets.push(fens.length);
    fens.push(START_FEN, ...g.moves.map(m => m.fenAfter));
  }
  console.log(`evaluating ${fens.length} positions at depth ${GRADE_DEPTH} (WASM, pool ${pool})…`);
  const t0 = Date.now();
  const evals = await evaluateAll(fens, GRADE_DEPTH, pool, (done, total) => {
    if (done % 200 === 0 || done === total) {
      const rate = done / ((Date.now() - t0) / 1000);
      process.stderr.write(`\r  ${done}/${total}  ${rate.toFixed(0)}/s  eta ${((total - done) / rate).toFixed(0)}s   `);
    }
  });
  process.stderr.write('\n');

  const out: CachedGame[] = games.map((g, i) => ({
    ...g,
    evals: evals.slice(offsets[i], offsets[i] + g.moves.length + 1),
  }));
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify({ depth: GRADE_DEPTH, engine: 'stockfish-18.js (wasm)', games: out }));
  console.log(`cached ${out.length} games → ${CACHE}`);
}

// ─── Sweep ───────────────────────────────────────────────────────────────────

/** Per player move: the gate facts, plus whether the pipeline allows Legendary at all. */
interface Candidate { facts: LegendaryFacts; eligible: boolean }
interface GradedGame { level: number; userId: string; candidates: Candidate[]; shipped: number }

/**
 * Grading 550 games is ~3 min (the sacrifice scan is chess.js move-gen per
 * move), so the graded facts are cached next to the evals. --regrade after
 * changing lib/game-eval or lib/review/book-moves.
 */
const FACTS_CACHE = CACHE.replace(/\.json$/, '') + '.facts.json';

function loadGraded(): GradedGame[] {
  if (!existsSync(CACHE)) throw new Error(`no cache at ${CACHE} — run --fetch first`);
  if (!process.argv.includes('--regrade') && existsSync(FACTS_CACHE)) {
    return JSON.parse(readFileSync(FACTS_CACHE, 'utf8')) as GradedGame[];
  }
  const { games } = JSON.parse(readFileSync(CACHE, 'utf8')) as { games: CachedGame[] };
  const graded = games.map(g => {
    const moves = g.moves.map((m, i) => ({ ...m, moveNumber: i + 1 }));
    // The real pipeline, at this game's level — book pass included.
    const analysis = gradeGame(g.evals, moves, g.playerColor, { playerLevel: g.level });
    const candidates: Candidate[] = [];
    analysis.moves.forEach((m, i) => {
      if (m.movedBy !== 'player') return;
      // Legendary can only replace an eval-graded, non-book, non-mating move.
      const eligible = !['book', 'unknown', 'checkmate', 'forced'].includes(m.classification);
      const fenBefore = i > 0 ? g.moves[i - 1].fenAfter : START_FEN;
      const facts = legendaryFacts({
        fenBefore,
        fenAfter: g.moves[i].fenAfter,
        san: m.san,
        winPercentDelta: m.winPercentDelta,
        winPercentBefore: m.winPercentBefore,
        winPercentAfter: m.winPercentAfter,
        evalBefore: { mate: m.evalBefore.mate },
        prevSan: i > 0 ? g.moves[i - 1].san : null,
        playedEngineBest: m.bestMoveSan !== null && m.bestMoveSan === m.san,
        cpLoss: cpLossForMover(m.evalBefore, m.evalAfter, g.playerColor), // player moves only
      });
      if (facts) candidates.push({ facts, eligible });
    });
    return { level: g.level, userId: g.userId, candidates, shipped: analysis.brilliantMoves };
  });
  writeFileSync(FACTS_CACHE, JSON.stringify(graded));
  return graded;
}

function rate(games: GradedGame[], rules: LegendaryRules) {
  let withOne = 0;
  let total = 0;
  for (const g of games) {
    const n = g.candidates.filter(c => c.eligible && passesLegendary(c.facts, rules)).length;
    total += n;
    if (n > 0) withOne++;
  }
  return { pct: games.length ? (withOne / games.length) * 100 : 0, withOne, perGame: games.length ? total / games.length : 0 };
}

/**
 * The SKILL axis, fixed by level: how close to the engine's move a sacrifice
 * must be. A beginner's sac only has to be near-best; at the top of the
 * ladder it has to BE the engine's move.
 */
const SKILL_BY_LEVEL: Record<number, Pick<LegendaryRules, 'maxDelta' | 'maxCpLoss' | 'requireEngineBest' | 'minSac'>> = {
  1: { maxDelta: 4.9, maxCpLoss: 150, requireEngineBest: false, minSac: 2 },
  2: { maxDelta: 4.9, maxCpLoss: 135, requireEngineBest: false, minSac: 2 },
  3: { maxDelta: 4.9, maxCpLoss: 120, requireEngineBest: false, minSac: 2 },
  4: { maxDelta: 4.9, maxCpLoss: 105, requireEngineBest: false, minSac: 2 },
  5: { maxDelta: 4.9, maxCpLoss: 90, requireEngineBest: false, minSac: 2 },
  6: { maxDelta: 4.9, maxCpLoss: 80, requireEngineBest: false, minSac: 2 },
  7: { maxDelta: 4.9, maxCpLoss: 70, requireEngineBest: false, minSac: 2 },
  8: { maxDelta: 4.9, maxCpLoss: 60, requireEngineBest: false, minSac: 2 },
  9: { maxDelta: 4.9, maxCpLoss: 50, requireEngineBest: false, minSac: 2 },
  10: { maxDelta: 4.9, maxCpLoss: 40, requireEngineBest: false, minSac: 2 },
};

/**
 * The SITUATION axis, fitted per level: which positions a sac may start from
 * (maxWpBefore — not already won) and must land in (minWpAfter — not lost).
 * The data says why these move with level: against a weak Rookie the player
 * is usually ahead (the "already winning" cap binds), against a strong one
 * usually behind (the "still okay after" floor binds).
 */
const WP_BEFORE_GRID = [85, 88, 90, 92, 94, 95, 96];
const WP_AFTER_GRID = [50, 45, 40, 35, 30, 25, 20, 15, 10];

const fmt = (r: LegendaryRules) =>
  `cpLoss<=${r.maxCpLoss} delta<=${r.maxDelta} wpB<${r.maxWpBefore} after>=${r.minWpAfter} sac>=${r.minSac}${r.requireEngineBest ? ' top-move' : ''}`;

function byLevel(games: GradedGame[]) {
  const m = new Map<number, GradedGame[]>();
  for (const g of games) m.set(g.level, [...(m.get(g.level) ?? []), g]);
  return [...m.entries()].sort((a, b) => a[0] - b[0]);
}

const MIN_GAMES = 25;

function sweepPhase() {
  const games = loadGraded();
  console.log(`${games.length} games · depth ${GRADE_DEPTH} · book moves excluded\n`);
  const levels = byLevel(games);

  const loosest = (lvl: number): LegendaryRules => ({ ...SKILL_BY_LEVEL[lvl], maxWpBefore: 92, minWpAfter: 35 });
  console.log('WHICH GATE BINDS (wpB<92 after>=35 at each level\'s skill gate; one gate removed):');
  const variants: [string, (r: LegendaryRules) => LegendaryRules][] = [
    ['as is             ', r => r],
    ['no wpBefore gate  ', r => ({ ...r, maxWpBefore: 101 })],
    ['no wpAfter gate   ', r => ({ ...r, minWpAfter: 0 })],
    ['cpLoss <= 150     ', r => ({ ...r, maxCpLoss: 150 })],
  ];
  for (const [label, f] of variants) {
    console.log(`  ${label}` + levels.map(([l, gs]) => `  L${l} ${rate(gs, f(loosest(l))).pct.toFixed(0).padStart(3)}%`).join(''));
  }

  console.log(`\nFIT per level (skill gate fixed; closest to ${TARGET}%, ties → the stricter pair):`);
  for (const [lvl, gs] of levels) {
    const skill = SKILL_BY_LEVEL[lvl];
    let best: { rules: LegendaryRules; pct: number; withOne: number; perGame: number } | null = null;
    // Grid walked strict → loose, so on a tie the stricter pair wins.
    for (const after of WP_AFTER_GRID) {
      for (const cap of WP_BEFORE_GRID) {
        const rules = { ...skill, maxWpBefore: cap, minWpAfter: after };
        const r = rate(gs, rules);
        if (!best || Math.abs(r.pct - TARGET) < Math.abs(best.pct - TARGET)) best = { rules, ...r };
      }
    }
    const thin = gs.length < MIN_GAMES ? `   <-- only ${gs.length} games (${new Set(gs.map(g => g.userId)).size} user): too few, extend the trend` : '';
    console.log(`  L${String(lvl).padEnd(2)} n=${String(gs.length).padEnd(4)} ${best!.pct.toFixed(0).padStart(3)}% (${best!.withOne}/${gs.length})  ${fmt(best!.rules)}${thin}`);
  }
}

function verifyPhase() {
  const games = loadGraded();
  console.log(`SHIPPED RULES (legendaryRulesForLevel) — real pipeline, book pass included, depth ${GRADE_DEPTH}\n`);
  console.log('  level  games  users  with>=1   rate   per game   rules');
  let all = 0;
  let allWith = 0;
  for (const [lvl, gs] of byLevel(games)) {
    const withOne = gs.filter(g => g.shipped > 0).length;
    const per = gs.reduce((n, g) => n + g.shipped, 0) / gs.length;
    const users = new Set(gs.map(g => g.userId)).size;
    all += gs.length;
    allWith += withOne;
    console.log(`  L${String(lvl).padEnd(5)} ${String(gs.length).padStart(5)}  ${String(users).padStart(5)}  ${String(withOne).padStart(7)}  ${((withOne / gs.length) * 100).toFixed(0).padStart(4)}%   ${per.toFixed(2).padStart(7)}   ${fmt(legendaryRulesForLevel(lvl))}`);
  }
  console.log(`  all    ${String(all).padStart(5)}         ${String(allWith).padStart(7)}  ${((allWith / all) * 100).toFixed(0).padStart(4)}%`);
}

if (process.argv.includes('--sweep')) sweepPhase();
else if (process.argv.includes('--verify')) verifyPhase();
else fetchPhase(Number(argOf('pool') ?? 8)).catch(e => { console.error(e); process.exit(1); });
