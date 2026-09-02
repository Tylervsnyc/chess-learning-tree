/**
 * Post-workout mistake report (Chess Boxing) — experiment, runs locally.
 *
 *   npx tsx scripts/workout-report.ts --user=tyler@tylervsnyc.com [--session=<id>] [--slack] [--no-llm]
 *
 * For one workout session it:
 *   1. pulls the misses (workout_sessions.missed_puzzles) + the user's theme
 *      profile (user_skill via getSkillProfile)
 *   2. runs native Stockfish (MultiPV) at every solver decision point of each
 *      missed puzzle → the only-move, the tempting losing alternatives, and
 *      where in the line the trap is. If the client recorded `playedMove`
 *      (newer rows), the report says what the played move actually did.
 *   3. asks Claude for one Rookie line per miss + a one-line diagnosis
 *   4. builds a 10-puzzle Fix-It set (lib/workout/fixit-recipe.ts)
 *   5. writes data/workout-reports/<sessionId>.{md,json}; --slack posts the md.
 *
 * Needs: .env.local (Supabase service role, ANTHROPIC_API_KEY, SLACK_WEBHOOK_URL)
 * and a `stockfish` binary on PATH (brew install stockfish).
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { Chess } from 'chess.js';
import { getSkillProfile, type ThemeSkill } from '@/lib/skill-profile';
import { buildFixitRecipe, fillFixitRecipe, type FixitPick } from '@/lib/workout/fixit-recipe';
import { loadPuzzleFile, listAvailableThemes } from '@/lib/puzzle-file-loader';
import { levelForRating } from '@/lib/workout/fixit-recipe';
import { ROOKIE_REPORT_SYSTEM, ROOKIE_REPORT_MODEL } from '@/lib/workout/report-voice';

// ─── args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const argOf = (k: string) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const USER = argOf('user');
const SESSION = argOf('session');
const WANT_SLACK = args.includes('--slack');
const USE_LLM = !args.includes('--no-llm');
const DEPTH = Number(argOf('depth') ?? 18);

if (!USER && !SESSION) {
  console.error('usage: --user=<email> [--session=<id>] [--slack] [--no-llm]');
  process.exit(1);
}

// ─── DB ──────────────────────────────────────────────────────────────────────

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

interface MissedPuzzle {
  id?: string;
  puzzleId?: string;
  fen: string;
  moves: string[] | string;
  rating?: number;
  themes?: string[];
  playedMove?: string | null;
  failedAtMove?: number | null;
  timeMs?: number | null;
}

interface SessionRow {
  id: string;
  user_id: string;
  created_at: string;
  duration_minutes: number | null;
  points: number;
  correct_count: number;
  wrong_count: number;
  missed_puzzles: MissedPuzzle[] | null;
}

// ─── Stockfish ───────────────────────────────────────────────────────────────

interface PvLine { rank: number; uci: string; san: string; cp: number | null; mate: number | null }

function runStockfish(fen: string, multipv: number, depth: number): Promise<PvLine[]> {
  return new Promise((resolve, reject) => {
    const sf = spawn('stockfish', [], { stdio: ['pipe', 'pipe', 'pipe'] });
    let buf = '';
    const latest = new Map<number, PvLine>();
    const chess = new Chess(fen);
    sf.on('error', reject);
    sf.stdout.on('data', (d: Buffer) => {
      buf += d.toString();
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('info') && line.includes(' pv ')) {
          const m = line.match(/multipv (\d+) score (cp|mate) (-?\d+).* pv (\S+)/);
          if (!m) continue;
          const rank = Number(m[1]);
          const uci = m[4];
          let san = uci;
          try {
            const c = new Chess(chess.fen());
            san = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] as 'q' | undefined })?.san ?? uci;
          } catch { /* keep uci */ }
          latest.set(rank, {
            rank,
            uci,
            san,
            cp: m[2] === 'cp' ? Number(m[3]) : null,
            mate: m[2] === 'mate' ? Number(m[3]) : null,
          });
        }
        if (line.startsWith('bestmove')) {
          sf.kill();
          resolve([...latest.values()].sort((a, b) => a.rank - b.rank));
        }
      }
    });
    sf.stdin.write(`uci\nsetoption name MultiPV value ${multipv}\nposition fen ${fen}\ngo depth ${depth}\n`);
  });
}

/** Eval from the side-to-move's view as a short string. */
function evalStr(l: { cp: number | null; mate: number | null }): string {
  if (l.mate != null) return l.mate > 0 ? `mate in ${l.mate}` : `gets mated in ${-l.mate}`;
  const p = (l.cp ?? 0) / 100;
  return `${p > 0 ? '+' : ''}${p.toFixed(1)}`;
}

function swing(best: PvLine, alt: PvLine): number {
  const v = (l: PvLine) => (l.mate != null ? (l.mate > 0 ? 10000 - l.mate : -10000 - l.mate) : l.cp ?? 0);
  return (v(best) - v(alt)) / 100;
}

// ─── Miss analysis ───────────────────────────────────────────────────────────

interface DecisionPoint {
  moveNo: number; // 1-based solver move number
  fen: string;
  solutionSan: string;
  best: PvLine;
  temptations: PvLine[]; // losing alternatives, most tempting (highest eval) first
  onlyMove: boolean;
}

interface MissAnalysis {
  puzzleId: string;
  rating: number;
  themes: string[];
  url: string;
  solverColor: 'White' | 'Black';
  solutionSan: string[];
  points: DecisionPoint[];
  trapAt: number; // solver move number where alternatives are most tempting / where they failed
  played?: { san: string; uci: string; at: number; eval: string; swing: number } | null;
}

async function analyseMiss(m: MissedPuzzle): Promise<MissAnalysis> {
  const moves = Array.isArray(m.moves) ? m.moves : String(m.moves).split(' ');
  const g = new Chess(m.fen);
  g.move(moves[0]); // Lichess: moves[0] is the opponent's setup move
  const solverColor = g.turn() === 'w' ? 'White' : 'Black';
  const solutionSan: string[] = [];
  const walk = new Chess(g.fen());
  for (const mv of moves.slice(1)) solutionSan.push(walk.move(mv).san);

  const points: DecisionPoint[] = [];
  const cur = new Chess(g.fen());
  let played: MissAnalysis['played'] = null;
  for (let i = 1; i < moves.length; i += 2) {
    const moveNo = (i + 1) / 2;
    const fen = cur.fen();
    const lines = await runStockfish(fen, 5, DEPTH);
    const best = lines[0];
    const temptations = lines.slice(1).filter((l) => swing(best, l) >= 1.0);
    const solIdx = i - 1;
    if (m.playedMove && m.failedAtMove === solIdx) {
      const c = new Chess(fen);
      let san = m.playedMove;
      let ev = '?';
      let sw = 0;
      try { san = c.move({ from: m.playedMove.slice(0, 2), to: m.playedMove.slice(2, 4), promotion: m.playedMove[4] as 'q' | undefined })?.san ?? san; } catch { /* keep */ }
      const l = lines.find((x) => x.uci === m.playedMove);
      if (l) { ev = evalStr(l); sw = swing(best, l); }
      else {
        // Not in the top 5 — evaluate it directly by playing it and asking for the reply.
        try {
          const after = new Chess(fen); after.move(m.playedMove);
          const reply = await runStockfish(after.fen(), 1, DEPTH);
          const r = reply[0];
          const flipped: PvLine = { rank: 9, uci: m.playedMove, san, cp: r.cp != null ? -r.cp : null, mate: r.mate != null ? -r.mate : null };
          ev = evalStr(flipped); sw = swing(best, flipped);
        } catch { /* ignore */ }
      }
      played = { san, uci: m.playedMove, at: moveNo, eval: ev, swing: sw };
    }
    points.push({ moveNo, fen, solutionSan: solutionSan[i - 1], best, temptations, onlyMove: temptations.length === lines.length - 1 });
    cur.move(moves[i]);
    if (i + 1 < moves.length) cur.move(moves[i + 1]);
  }
  // Trap = where the user actually failed when the client recorded it (rows
  // from 2026-09-01 on); otherwise move 1 — the puzzle's defining decision.
  const trapAt = played?.at ?? 1;

  const id = m.puzzleId || m.id || '?';
  return {
    puzzleId: id,
    rating: m.rating ?? 0,
    themes: m.themes ?? lookupThemes(id, m.rating),
    url: `https://lichess.org/training/${id}`,
    solverColor,
    solutionSan,
    points,
    trapAt,
    played,
  };
}

/** Older rows don't carry themes — find the puzzle in clean-puzzles-v2 by id. */
function lookupThemes(id: string, rating?: number): string[] {
  const levels = rating ? [levelForRating(rating)] : [1, 2, 3, 4, 5, 6, 7, 8];
  for (const lvl of levels) {
    for (const theme of listAvailableThemes(lvl)) {
      const hit = loadPuzzleFile(lvl, theme)?.puzzles.find((p) => p.puzzleId === id);
      if (hit) return hit.allThemes;
    }
  }
  return [];
}

// ─── Claude ──────────────────────────────────────────────────────────────────

interface Commentary { perMiss: string[]; diagnosis: string; fixitIntro: string }

async function askRookie(misses: MissAnalysis[], profile: ThemeSkill[], trend: string): Promise<Commentary> {
  const client = new Anthropic();
  const missText = misses
    .map((m, i) => {
      const trap = m.points.find((p) => p.moveNo === m.trapAt)!;
      const temps = trap.temptations.slice(0, 2).map((t) => `${t.san} (${evalStr(t)})`).join(', ');
      const playedLine = m.played ? `Player actually played ${m.played.san} at move ${m.played.at} (${m.played.eval}).` : 'Player\'s actual move not recorded.';
      const later = m.points.filter((p) => p.moveNo !== m.trapAt && p.onlyMove && p.moveNo > 1).map((p) => `move ${p.moveNo} ${p.solutionSan} is also an only-move (alternatives: ${p.temptations.slice(0, 2).map((t) => `${t.san} ${evalStr(t)}`).join(', ')})`).join('; ');
      return `${i + 1}. Puzzle ${m.puzzleId} (${m.rating}, themes: ${m.themes.join(' ')}), ${m.solverColor} to move. Solution: ${m.solutionSan.join(' ')}. The key decision is move ${m.trapAt}: the answer ${trap.solutionSan} (${evalStr(trap.best)}) vs the tempting ${temps || 'nothing close'}. ${later ? later + '. ' : ''}${playedLine}`;
    })
    .join('\n');
  const weak = profile
    .filter((t) => t.attempts >= 5)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)
    .map((t) => `${t.theme} ${Math.round(t.accuracy * 100)}% of ${t.attempts}`)
    .join('; ');

  const prompt = `Today's misses:\n${missText}\n\nTheme accuracy (worst first): ${weak}\nRecent trend: ${trend}\n\nReturn JSON only: {"perMiss": [one line per miss, in order — say what the tempting/played move was TRYING to do and why the answer beats it], "diagnosis": "one sentence naming the single habit behind these misses", "fixitIntro": "one sentence introducing the 10-puzzle Fix-It set built to train that habit"}`;

  const res = await client.messages.create({
    model: ROOKIE_REPORT_MODEL,
    max_tokens: 2000,
    system: ROOKIE_REPORT_SYSTEM,
    output_config: { effort: 'medium' },
    messages: [{ role: 'user', content: prompt }],
  });
  const text = res.content.find((b) => b.type === 'text')?.text ?? '{}';
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  try {
    const parsed = JSON.parse(json) as Partial<Commentary>;
    return {
      perMiss: Array.isArray(parsed.perMiss) ? parsed.perMiss : [],
      diagnosis: parsed.diagnosis ?? '',
      fixitIntro: parsed.fixitIntro ?? '',
    };
  } catch {
    return { perMiss: [], diagnosis: text.trim(), fixitIntro: '' };
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
}

function renderReport(
  s: SessionRow,
  misses: MissAnalysis[],
  profile: ThemeSkill[],
  history: SessionRow[],
  c: Commentary,
  fixit: FixitPick[],
): string {
  const L: string[] = [];
  const total = s.correct_count + s.wrong_count;
  L.push(`WORKOUT REPORT — ${fmtDate(s.created_at)}`);
  L.push(`${s.correct_count}/${total} right · ${s.points} pts · ${s.duration_minutes ?? '?'} min`);
  L.push('');

  L.push(`YOUR ${misses.length} MISS${misses.length === 1 ? '' : 'ES'}`);
  misses.forEach((m, i) => {
    const trap = m.points.find((p) => p.moveNo === m.trapAt)!;
    L.push('');
    L.push(`${i + 1}. ${m.puzzleId} (${m.rating}) · ${m.themes.filter((t) => !['short', 'long', 'veryLong', 'crushing', 'advantage', 'master', 'masterVsMaster'].includes(t)).join(', ')}`);
    L.push(`   ${m.solverColor} to play. Answer: ${m.solutionSan.join(' ')}`);
    L.push(`   The trap is move ${m.trapAt}: ${trap.solutionSan} (${evalStr(trap.best)})${trap.onlyMove ? ' — the ONLY move' : ''}`);
    if (m.played) L.push(`   You played ${m.played.san} → ${m.played.eval} (a ${m.played.swing.toFixed(1)}-pawn swing)`);
    else if (trap.temptations.length) L.push(`   Tempting instead: ${trap.temptations.slice(0, 2).map((t) => `${t.san} (${evalStr(t)})`).join(', ')}`);
    const laterOnly = m.points.filter((p) => p.moveNo !== m.trapAt && p.onlyMove && p.moveNo > 1);
    if (laterOnly.length) L.push(`   Also only-moves later: ${laterOnly.map((p) => `move ${p.moveNo} ${p.solutionSan} (${evalStr(p.best)})`).join(', ')}`);
    if (c.perMiss[i]) L.push(`   Rookie: ${c.perMiss[i]}`);
    L.push(`   Replay: ${m.url}`);
  });

  L.push('');
  L.push('WHAT THE MISSES SAY');
  const allMisses = history.flatMap((h) => h.missed_puzzles ?? []);
  const longish = allMisses.filter((m) => (m.themes ?? lookupThemes(m.puzzleId || m.id || '', m.rating)).some((t) => t === 'long' || t === 'veryLong')).length;
  L.push(`- Last ${history.length} workouts: ${allMisses.length} misses, ${longish} of them long lines (3+ moves). ${longish > allMisses.length / 2 ? 'You find move 1 and drift on move 3.' : 'Line length is not the issue.'}`);
  const signal = profile.filter((t) => t.attempts >= 5).sort((a, b) => a.accuracy - b.accuracy);
  const weakest = signal.slice(0, 3);
  const strongest = [...signal].sort((a, b) => b.accuracy - a.accuracy).slice(0, 2);
  if (weakest.length) L.push(`- Weakest themes: ${weakest.map((t) => `${t.theme} ${Math.round(t.accuracy * 100)}% (${t.attempts})`).join(' · ')}`);
  if (strongest.length) L.push(`- Strongest: ${strongest.map((t) => `${t.theme} ${Math.round(t.accuracy * 100)}% (${t.attempts})`).join(' · ')}`);
  const missRatings = misses.map((m) => m.rating).filter(Boolean);
  if (missRatings.length) L.push(`- Miss ratings ${Math.min(...missRatings)}–${Math.max(...missRatings)}: inside your solve band, so these are calculation slips, not unknown ideas.`);
  if (c.diagnosis) L.push(`- Rookie's read: ${c.diagnosis}`);

  L.push('');
  L.push('TREND');
  for (const h of history) {
    const t = h.correct_count + h.wrong_count;
    L.push(`  ${fmtDate(h.created_at).padEnd(16)} ${String(h.correct_count).padStart(2)}/${String(t).padEnd(2)} · ${String(h.points).padStart(4)} pts · ${h.wrong_count} miss${h.wrong_count === 1 ? '' : 'es'}${h.id === s.id ? '  ← this one' : ''}`);
  }

  L.push('');
  L.push('FIX-IT WORKOUT (10)');
  if (c.fixitIntro) L.push(c.fixitIntro);
  let lastLabel = '';
  fixit.forEach((p, i) => {
    if (p.slotLabel !== lastLabel) { L.push(`  ${p.slotLabel}`); L.push(`    (${p.slotReason})`); lastLabel = p.slotLabel; }
    L.push(`   ${String(i + 1).padStart(2)}. ${p.puzzleId} (${p.rating}) https://lichess.org/training/${p.puzzleId}`);
  });
  L.push('');
  L.push(`Play it: https://chesspath.app/workout/fixit   ·   Replay today's misses: https://chesspath.app/workout/report/${s.id}`);
  return L.join('\n');
}

async function postToSlack(text: string) {
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!hook) { console.warn('[slack] SLACK_WEBHOOK_URL not set — skipping'); return; }
  const res = await fetch(hook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '```' + text.slice(0, 38000) + '```' }),
  });
  console.log(res.ok ? '[slack] posted' : `[slack] failed ${res.status}`);
}

// ─── main ────────────────────────────────────────────────────────────────────

(async () => {
  let session: SessionRow | null = null;
  if (SESSION) {
    const { data } = await sb.from('workout_sessions').select('*').eq('id', SESSION).single();
    session = data as SessionRow | null;
  } else {
    const { data: prof } = await sb.from('profiles').select('id').eq('email', USER!).single();
    if (!prof) { console.error(`no profile for ${USER}`); process.exit(1); }
    const { data } = await sb.from('workout_sessions').select('*').eq('user_id', prof.id).order('created_at', { ascending: false }).limit(1).single();
    session = data as SessionRow | null;
  }
  if (!session) { console.error('no workout session found'); process.exit(1); }

  const { data: hist } = await sb
    .from('workout_sessions')
    .select('*')
    .eq('user_id', session.user_id)
    .lte('created_at', session.created_at)
    .order('created_at', { ascending: false })
    .limit(5);
  const history = ((hist ?? []) as SessionRow[]).reverse();

  const { themes: profile, weakest, userLevel } = await getSkillProfile(sb, session.user_id);

  const missed = session.missed_puzzles ?? [];
  console.error(`session ${session.id}: ${missed.length} misses — running Stockfish depth ${DEPTH}…`);
  const misses: MissAnalysis[] = [];
  for (const m of missed) misses.push(await analyseMiss(m));

  const trend = history.map((h) => `${h.correct_count}/${h.correct_count + h.wrong_count}`).join(' → ');
  const commentary: Commentary = USE_LLM && misses.length
    ? await askRookie(misses, profile, trend)
    : { perMiss: [], diagnosis: '', fixitIntro: '' };

  // Fix-It set: exclude everything the user has seen + today's misses.
  const { data: seen } = await sb.from('workout_seen_puzzles').select('puzzle_id').eq('user_id', session.user_id).limit(5000);
  const exclude = new Set<string>((seen ?? []).map((r: { puzzle_id: string }) => r.puzzle_id));
  for (const m of misses) exclude.add(m.puzzleId);
  const slots = buildFixitRecipe({
    weakest,
    lastMisses: misses.map((m) => ({ puzzleId: m.puzzleId, themes: m.themes, rating: m.rating })),
    userLevel: userLevel ?? undefined,
  });
  const fixit = fillFixitRecipe(slots, exclude);

  const report = renderReport(session, misses, profile, history, commentary, fixit);
  console.log(report);

  const dir = path.join(process.cwd(), 'data', 'workout-reports');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${session.id}.md`), report);
  writeFileSync(
    path.join(dir, `${session.id}.json`),
    JSON.stringify({ sessionId: session.id, userId: session.user_id, generatedAt: new Date().toISOString(), misses, commentary, fixit: fixit.map((p) => ({ puzzleId: p.puzzleId, rating: p.rating, slot: p.slotLabel })) }, null, 2),
  );
  console.error(`wrote data/workout-reports/${session.id}.md`);
  if (WANT_SLACK) await postToSlack(report);
})();
