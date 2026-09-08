/**
 * Calibrate the Legendary-move thresholds against real games.
 *
 * The question this answers: what fraction of games contain at least one
 * Legendary move, under a given set of thresholds? Tyler wants ~1 in 4.
 *
 * Two phases so the expensive part happens once:
 *
 *   --fetch   Pull real play-rookie games, run Stockfish over every position
 *             (depth 10 — the depth /play evaluates at live), and cache the
 *             raw quantities each Legendary gate tests. Slow.
 *   --sweep   Load the cache and score candidate threshold sets. Instant.
 *
 * The cached quantities come from the app's own functions (winning-chance
 * sigmoid, sacrificeNetLoss), so a sweep is real arithmetic on real games,
 * not a re-implementation of the rule.
 *
 * Usage:
 *   npx tsx scripts/calibrate-legendary.ts --fetch [--games=60] [--depth=10]
 *   npx tsx scripts/calibrate-legendary.ts --sweep
 *
 * Needs a `stockfish` binary on PATH (brew install stockfish).
 */

import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Chess } from 'chess.js';
import dotenv from 'dotenv';
import { evalToWinningChances, sacrificeNetLoss } from '../lib/game-eval';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const POOL_SIZE = 8;

function argOf(name: string): string | undefined {
  return process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
}
const CACHE = argOf('cache') ?? 'data/test/legendary-calibration.json';

// ─── Stockfish pool ──────────────────────────────────────────────────────────
// One long-lived process per slot: spawning stockfish per position costs more
// than the search itself at depth 10.

interface Evaled { cp: number | null; mate: number | null }

class Engine {
  private sf: ChildProcessWithoutNullStreams;
  private buf = '';
  private pending: ((e: Evaled) => void) | null = null;
  private cp: number | null = null;
  private mate: number | null = null;
  private flip = 1;

  constructor() {
    this.sf = spawn('stockfish', [], { stdio: ['pipe', 'pipe', 'pipe'] });
    this.sf.stdout.on('data', (d: Buffer) => this.onData(d.toString()));
    this.sf.stdin.write('uci\n');
  }

  private onData(chunk: string) {
    this.buf += chunk;
    const lines = this.buf.split('\n');
    this.buf = lines.pop() ?? '';
    for (const l of lines) {
      if (l.startsWith('info') && l.includes(' pv ')) {
        const m = l.match(/score (cp|mate) (-?\d+)/);
        if (m) {
          if (m[1] === 'cp') { this.cp = Number(m[2]) * this.flip; this.mate = null; }
          else { this.mate = Number(m[2]) * this.flip; this.cp = null; }
        }
      }
      if (l.startsWith('bestmove')) {
        const done = this.pending;
        this.pending = null;
        done?.({ cp: this.cp, mate: this.mate });
      }
    }
  }

  evaluate(fen: string, depth: number): Promise<Evaled> {
    return new Promise(resolve => {
      // Stockfish scores from the side-to-move's view; we want white's.
      this.flip = (fen.split(' ')[1] || 'w') === 'b' ? -1 : 1;
      this.cp = null;
      this.mate = null;
      this.pending = resolve;
      this.sf.stdin.write(`position fen ${fen}\ngo depth ${depth}\n`);
    });
  }

  kill() { this.sf.kill(); }
}

/** Run `jobs` across a pool, preserving order. */
async function pooled<T, R>(items: T[], run: (item: T, e: Engine) => Promise<R>): Promise<R[]> {
  const engines = Array.from({ length: POOL_SIZE }, () => new Engine());
  const out = new Array<R>(items.length);
  let next = 0;
  let done = 0;
  await Promise.all(engines.map(async engine => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await run(items[i], engine);
      done++;
      if (done % 25 === 0 || done === items.length) {
        process.stderr.write(`\r  ${done}/${items.length} positions`);
      }
    }
  }));
  process.stderr.write('\n');
  engines.forEach(e => e.kill());
  return out;
}

// ─── DB ──────────────────────────────────────────────────────────────────────

async function rest<T>(path: string, range?: string): Promise<T> {
  const headers: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  };
  if (range) headers.Range = range;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

/**
 * PostgREST caps a response at max-rows (1000 here) regardless of `limit`, so
 * a plain query silently returns a truncated game set. Page with Range until
 * a short page comes back.
 */
async function restAll<T>(path: string): Promise<T[]> {
  const PAGE = 1000;
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const page = await rest<T[]>(path, `${from}-${from + PAGE - 1}`);
    out.push(...page);
    if (page.length < PAGE) return out;
  }
}

interface SessionRow { id: string; user_id: string; player_color: string | null; result: string | null; total_moves: number | null; started_at: string }
interface MoveRow { session_id: string; move_number: number; moved_by: string; move_san: string; fen_after: string }

// ─── Cached per-move facts ───────────────────────────────────────────────────
// Everything the five Legendary gates test, as raw numbers.

interface MoveFacts {
  san: string;
  /** Win% the mover gave up vs the engine's best (positive = lost ground). */
  delta: number;
  wpBefore: number;
  wpAfter: number;
  /** Material the worst-case reply leaves the mover down. null = no captures. */
  sacLoss: number | null;
  /** Only one legal move — never Legendary. */
  forced: boolean;
  /** Plain recapture on the square the opponent just took on. */
  recapture: boolean;
  /** Position before the move was already mate-for-the-mover. */
  mateForMover: boolean;
  /** No trustworthy eval for this move — ungradable. */
  ungradable: boolean;
}
interface GameFacts { sessionId: string; userId: string; playedOn: string; playerColor: string; moves: MoveFacts[] }

function wpFor(cp: number | null, mate: number | null, moverIsWhite: boolean): number {
  const white = (evalToWinningChances(cp, mate) + 1) / 2 * 100;
  return moverIsWhite ? white : 100 - white;
}

async function fetchPhase(gameCount: number, depth: number) {
  const sessions = await rest<SessionRow[]>(
    `game_sessions?select=id,user_id,player_color,result,total_moves,started_at` +
    `&session_type=eq.play-rookie&total_moves=gte.20&order=started_at.desc&limit=${gameCount}`,
  );
  console.log(`${sessions.length} games`);

  // One batched moves query, then group — 60 round trips is slower than 1.
  const ids = sessions.map(s => s.id).join(',');
  const allMoves = await restAll<MoveRow>(
    `session_moves?select=session_id,move_number,moved_by,move_san,fen_after&session_id=in.(${ids})&order=session_id.asc,move_number.asc`,
  );
  console.log(`${allMoves.length} moves`);
  const bySession = new Map<string, MoveRow[]>();
  for (const m of allMoves) {
    if (!m.fen_after) continue;
    const arr = bySession.get(m.session_id) ?? [];
    arr.push(m);
    bySession.set(m.session_id, arr);
  }

  // Flatten every position across every game into one job list for the pool.
  type Job = { sessionId: string; index: number; fen: string };
  const jobs: Job[] = [];
  for (const s of sessions) {
    const moves = bySession.get(s.id);
    if (!moves?.length) continue;
    const fens = [START_FEN, ...moves.map(m => m.fen_after)];
    fens.forEach((fen, index) => jobs.push({ sessionId: s.id, index, fen }));
  }
  console.log(`evaluating ${jobs.length} positions at depth ${depth} across ${POOL_SIZE} engines…`);

  const results = await pooled(jobs, (job, engine) => engine.evaluate(job.fen, depth));
  const evalsBySession = new Map<string, Evaled[]>();
  jobs.forEach((job, i) => {
    const arr = evalsBySession.get(job.sessionId) ?? [];
    arr[job.index] = results[i];
    evalsBySession.set(job.sessionId, arr);
  });

  // Turn evals into the per-move facts the gates test.
  const games: GameFacts[] = [];
  for (const s of sessions) {
    const moves = bySession.get(s.id);
    const evals = evalsBySession.get(s.id);
    if (!moves?.length || !evals) continue;
    const playerColor = s.player_color === 'black' ? 'black' : 'white';
    const facts: MoveFacts[] = [];

    for (let i = 0; i < moves.length; i++) {
      const m = moves[i];
      if (m.moved_by !== 'player') continue;              // only the player's moves
      if (m.move_san.endsWith('#')) continue;             // mating move isn't graded
      const fenBefore = i > 0 ? moves[i - 1].fen_after : START_FEN;
      const fenAfter = m.fen_after;
      const before = evals[i];
      const after = evals[i + 1];
      const moverIsWhite = (fenBefore.split(' ')[1] || 'w') === 'w';

      const ungradable =
        !before || !after ||
        (before.cp === null && before.mate === null) ||
        (after.cp === null && after.mate === null);

      const wpBefore = ungradable ? 0 : wpFor(before.cp, before.mate, moverIsWhite);
      // After the move it's the opponent's turn, so their win% flips to ours.
      const wpAfter = ungradable ? 0 : wpFor(after.cp, after.mate, moverIsWhite);

      let forced = false;
      try { forced = new Chess(fenBefore).moves().length <= 1; } catch { forced = true; }

      const prevSan = i > 0 ? moves[i - 1].move_san : null;
      const sq = (san: string) => san.match(/([a-h][1-8])(?:=?[QRBN])?[+#]?$/)?.[1] ?? null;
      const recapture = !!prevSan && prevSan.includes('x') && m.move_san.includes('x') &&
        sq(prevSan) !== null && sq(prevSan) === sq(m.move_san);

      const mateForMover = !ungradable && before!.mate != null && (before!.mate > 0) === moverIsWhite;

      facts.push({
        san: m.move_san,
        delta: Math.max(0, wpBefore - wpAfter),
        wpBefore,
        wpAfter,
        sacLoss: sacrificeNetLoss(fenBefore, fenAfter),
        forced,
        recapture,
        mateForMover,
        ungradable,
      });
    }

    games.push({
      sessionId: s.id,
      userId: s.user_id,
      playedOn: s.started_at.slice(0, 10),
      playerColor,
      moves: facts,
    });
  }

  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify({ depth, games }, null, 0));
  console.log(`cached ${games.length} games → ${CACHE}`);
}

// ─── Sweep ───────────────────────────────────────────────────────────────────

interface Thresholds { maxDelta: number; maxWpBefore: number; minWpAfter: number; minSac: number }

function isLegendary(m: MoveFacts, t: Thresholds): boolean {
  if (m.ungradable) return false;
  if (m.delta > t.maxDelta) return false;
  if (m.wpBefore >= t.maxWpBefore) return false;
  if (m.mateForMover) return false;
  if (m.wpAfter < t.minWpAfter) return false;
  if (m.forced) return false;
  if (m.recapture) return false;
  return m.sacLoss !== null && m.sacLoss >= t.minSac;
}

function score(games: GameFacts[], t: Thresholds) {
  let gamesWith = 0;
  let total = 0;
  for (const g of games) {
    const n = g.moves.filter(m => isLegendary(m, t)).length;
    total += n;
    if (n > 0) gamesWith++;
  }
  return {
    pct: (gamesWith / games.length) * 100,
    gamesWith,
    perGame: total / games.length,
    total,
  };
}

function sweepPhase() {
  if (!existsSync(CACHE)) throw new Error(`no cache at ${CACHE} — run --fetch first`);
  const { depth, games } = JSON.parse(readFileSync(CACHE, 'utf8')) as { depth: number; games: GameFacts[] };
  const playerMoves = games.reduce((n, g) => n + g.moves.length, 0);
  console.log(`${games.length} games · ${playerMoves} graded player moves · depth ${depth}\n`);

  const CURRENT: Thresholds = { maxDelta: 2, maxWpBefore: 80, minWpAfter: 50, minSac: 2 };

  // Which gate is doing the rejecting? Relax exactly one at a time.
  console.log('WHICH GATE BINDS (relax one gate at a time, from current):');
  const single: [string, Thresholds][] = [
    ['current                      ', CURRENT],
    ['sacrifice >=1 (allow a pawn) ', { ...CURRENT, minSac: 1 }],
    ['near-best <=5% (from 2%)     ', { ...CURRENT, maxDelta: 5 }],
    ['not-crushing <90 (from 80)   ', { ...CURRENT, maxWpBefore: 90 }],
    ['stays-ok >=35 (from 50)      ', { ...CURRENT, minWpAfter: 35 }],
  ];
  for (const [label, t] of single) {
    const r = score(games, t);
    console.log(`  ${label}  ${r.pct.toFixed(0).padStart(3)}% of games  (${r.gamesWith}/${games.length})  ${r.perGame.toFixed(2)}/game`);
  }

  // Candidate combinations, loosest gate first.
  console.log('\nCANDIDATES (target: ~25% of games):');
  // delta stays <= 5: INACCURACY_THRESHOLD is 5, so a looser gate would let a
  // move be graded Legendary AND an inaccuracy. sac stays >= 2: the sac-size
  // histogram below shows dropping to 1 buys ~one move across 60 games, so
  // there's no rate to gain by cheapening what "sacrifice" means.
  const candidates: [string, Thresholds][] = [
    ['current  (delta2 wpB80 after50 sac2)', { maxDelta: 2, maxWpBefore: 80, minWpAfter: 50, minSac: 2 }],
    ['H  delta5 wpB80 after50 sac2        ', { maxDelta: 5, maxWpBefore: 80, minWpAfter: 50, minSac: 2 }],
    ['I  delta5 wpB90 after50 sac2        ', { maxDelta: 5, maxWpBefore: 90, minWpAfter: 50, minSac: 2 }],
    ['J  delta5 wpB90 after45 sac2        ', { maxDelta: 5, maxWpBefore: 90, minWpAfter: 45, minSac: 2 }],
    ['K  delta5 wpB90 after40 sac2        ', { maxDelta: 5, maxWpBefore: 90, minWpAfter: 40, minSac: 2 }],
    ['L  delta5 wpB95 after40 sac2        ', { maxDelta: 5, maxWpBefore: 95, minWpAfter: 40, minSac: 2 }],
    ['M  delta5 wpB95 after50 sac2        ', { maxDelta: 5, maxWpBefore: 95, minWpAfter: 50, minSac: 2 }],
    ['N  delta3 wpB90 after50 sac2        ', { maxDelta: 3, maxWpBefore: 90, minWpAfter: 50, minSac: 2 }],
    ['O  delta5 wpB92 after45 sac2        ', { maxDelta: 5, maxWpBefore: 92, minWpAfter: 45, minSac: 2 }],
  ];

  for (const [label, t] of candidates) {
    const r = score(games, t);
    const flag = r.pct >= 20 && r.pct <= 30 ? '  <-- ~1 in 4' : '';
    console.log(`  ${label}  ${r.pct.toFixed(0).padStart(3)}% of games  (${r.gamesWith}/${games.length})  ${r.perGame.toFixed(2)}/game${flag}`);
  }

  // How often a move that clears every OTHER gate is blocked only by the sac size.
  console.log('\nSACRIFICE SIZE of moves that pass every other gate:');
  const buckets = new Map<number, number>();
  for (const g of games) {
    for (const m of g.moves) {
      const t: Thresholds = { maxDelta: 5, maxWpBefore: 90, minWpAfter: 40, minSac: -999 };
      if (!isLegendary(m, t)) continue;
      const k = Math.min(5, Math.max(0, Math.floor(m.sacLoss ?? 0)));
      buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
  }
  for (const k of [...buckets.keys()].sort((a, b) => a - b)) {
    console.log(`  gives up ${k === 5 ? '5+' : k}  ${'#'.repeat(Math.min(60, buckets.get(k)!))} ${buckets.get(k)}`);
  }
}

if (process.argv.includes('--sweep')) {
  sweepPhase();
} else {
  fetchPhase(Number(argOf('games') ?? 60), Number(argOf('depth') ?? 10))
    .catch(e => { console.error(e); process.exit(1); });
}
