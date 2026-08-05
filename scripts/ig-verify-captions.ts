/**
 * Does the caption tell the truth about the puzzle on screen?
 *
 *   npx tsx scripts/ig-verify-captions.ts          # check every reel on disk
 *   npx tsx scripts/ig-verify-captions.ts --queue  # also check the live Blob queue
 *
 * Hooks are picked by THEME, so a wrong theme means a caption that lies — the
 * worst failure this pipeline can ship ("Checkmate in 2!" over a mate in 3).
 * Everything checked here is decided by chess.js from the actual FEN + solution,
 * never by trusting the pool's label.
 *
 * Verified per reel:
 *   - mateIn1/2/3 hook  → the solution really is mate in exactly that many
 *   - any mate hook     → the final position really is checkmate
 *   - backRankMate hook → mate delivered on the mated king's back rank
 *   - smotheredMate     → mated by a knight with every flight square self-blocked
 *   - other themes      → the claimed theme is present in the puzzle's Lichess themes
 *   - rating line       → matches the pool's rating for that puzzle
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import { Chess } from 'chess.js';
import { discoverReels } from '../lib/ig-reels';
import { loadQueue } from '../lib/ig-queue';
import { THEME_HOOKS, DIFFICULT_HOOKS } from '../lib/ig-captions';

interface PoolPuzzle {
  puzzleId: string; fen: string; moves: string;
  rating: number; theme: string; allThemes: string[];
}

const POOL: Record<string, PoolPuzzle> = {};
for (const f of ['data/video-puzzle-pool.json', 'data/video-puzzle-pool-hard.json']) {
  if (!fs.existsSync(f)) continue;
  for (const p of JSON.parse(fs.readFileSync(f, 'utf8')).puzzles ?? []) POOL[p.puzzleId] = p;
}

const norm = (s: string) => s.replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/** hook text → the theme whose pool it came from. */
const HOOK_THEME: Record<string, string> = {};
for (const [theme, hooks] of Object.entries(THEME_HOOKS)) {
  for (const h of hooks) HOOK_THEME[norm(h)] = theme;
}
const DIFFICULT_HOOK_SET = new Set(DIFFICULT_HOOKS.map(norm));

interface Facts {
  playerMoves: number;
  isMate: boolean;
  mateIn: number | null;     // player moves to deliver mate, if it ends in mate
  mateRank: string | null;   // rank the mated king stands on
  matedBy: string | null;    // piece type that delivered mate
  smothered: boolean;
  allThemes: string[];
  rating: number;
}

/** Replay the puzzle and read the truth off the board. */
function analyse(p: PoolPuzzle): Facts | null {
  const raw = p.moves.split(' ');
  const board = new Chess(p.fen);
  const play = (uci: string) => board.move({
    from: uci.slice(0, 2), to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  });

  try { play(raw[0]); } catch { return null; }   // opponent's setup move

  const solution = raw.slice(1);
  let playerMoves = 0;
  for (const [i, uci] of solution.entries()) {
    try { play(uci); } catch { return null; }
    if (i % 2 === 0) playerMoves++;              // even index = the solver's move
  }

  const isMate = board.isCheckmate();
  const mated = board.turn();                    // side to move is the mated side
  let mateRank: string | null = null;
  let matedBy: string | null = null;
  let smothered = false;

  if (isMate) {
    for (const sq of board.board().flat()) {
      if (sq && sq.type === 'k' && sq.color === mated) mateRank = sq.square[1];
    }
    const last = board.history({ verbose: true }).at(-1);
    matedBy = last?.piece ?? null;

    // Smothered: knight mate where every square around the king is occupied by
    // the mated side's own pieces.
    if (matedBy === 'n' && mateRank) {
      const kingSq = board.board().flat().find(s => s && s.type === 'k' && s.color === mated)!.square;
      const file = kingSq.charCodeAt(0), rank = Number(kingSq[1]);
      let blocked = 0, total = 0;
      for (const df of [-1, 0, 1]) for (const dr of [-1, 0, 1]) {
        if (!df && !dr) continue;
        const f = String.fromCharCode(file + df), r = rank + dr;
        if (f < 'a' || f > 'h' || r < 1 || r > 8) continue;
        total++;
        const occ = board.get(`${f}${r}` as never) as { color: string } | undefined;
        if (occ && occ.color === mated) blocked++;
      }
      smothered = total > 0 && blocked === total;
    }
  }

  return {
    playerMoves,
    isMate,
    mateIn: isMate ? playerMoves : null,
    mateRank,
    matedBy,
    smothered,
    allThemes: p.allThemes ?? [],
    rating: p.rating,
  };
}

interface Problem { id: string; where: string; claim: string; truth: string }

function checkCaption(id: string, where: string, caption: string): Problem[] {
  const puzzle = POOL[id];
  if (!puzzle) return [];                        // not from a pool (e.g. --from-daily)
  const facts = analyse(puzzle);
  if (!facts) return [{ id, where, claim: 'n/a', truth: 'could not replay the solution' }];

  const firstLine = caption.split('\n').find(l => l.trim() !== '') ?? '';
  const hook = norm(firstLine);
  const problems: Problem[] = [];

  // Rating line must match the pool.
  const ratingLine = caption.match(/Rating:\s*(\d+)/);
  if (ratingLine && Number(ratingLine[1]) !== facts.rating) {
    problems.push({ id, where, claim: `Rating: ${ratingLine[1]}`, truth: `actual rating ${facts.rating}` });
  }

  // Difficult hooks make no claim about the puzzle — nothing to falsify.
  if (DIFFICULT_HOOK_SET.has(hook)) return problems;

  const claimed = HOOK_THEME[hook];
  if (!claimed) {
    problems.push({ id, where, claim: firstLine, truth: 'hook is not in any current pool' });
    return problems;
  }

  const mateClaim = { mateIn1: 1, mateIn2: 2, mateIn3: 3 }[claimed];
  if (mateClaim !== undefined) {
    if (!facts.isMate) {
      problems.push({ id, where, claim: firstLine, truth: `solution does NOT end in checkmate (${facts.playerMoves} player moves)` });
    } else if (facts.mateIn !== mateClaim) {
      problems.push({ id, where, claim: firstLine, truth: `it is mate in ${facts.mateIn}, not ${mateClaim}` });
    }
    return problems;
  }

  if (claimed === 'backRankMate') {
    if (!facts.isMate) {
      problems.push({ id, where, claim: firstLine, truth: 'solution does NOT end in checkmate' });
    } else if (facts.mateRank !== '1' && facts.mateRank !== '8') {
      problems.push({ id, where, claim: firstLine, truth: `king is mated on rank ${facts.mateRank}, not a back rank` });
    }
    return problems;
  }

  if (claimed === 'smotheredMate') {
    if (!facts.isMate) {
      problems.push({ id, where, claim: firstLine, truth: 'solution does NOT end in checkmate' });
    } else if (!facts.smothered) {
      problems.push({
        id, where, claim: firstLine,
        truth: `not a smothered mate (mated by ${facts.matedBy ?? '?'}, king not fully self-blocked)`,
      });
    }
    return problems;
  }

  if (claimed !== 'generic' && !facts.allThemes.includes(claimed)) {
    problems.push({ id, where, claim: firstLine, truth: `puzzle themes are [${facts.allThemes.join(', ')}] — no "${claimed}"` });
  }
  return problems;
}

async function main() {
  const problems: Problem[] = [];
  let checked = 0, unknown = 0;

  for (const r of discoverReels()) {
    if (!r.caption.trim()) continue;
    if (!POOL[r.puzzleId]) { unknown++; continue; }
    checked++;
    problems.push(...checkCaption(r.puzzleId, `disk ${r.date}`, r.caption));
  }

  if (process.argv.includes('--queue')) {
    for (const item of await loadQueue()) {
      if (!item.puzzleId || !POOL[item.puzzleId]) continue;
      checked++;
      problems.push(...checkCaption(item.puzzleId, `queue ${item.date}${item.posted ? ' (posted)' : ''}`, item.caption));
    }
  }

  console.log(`Checked ${checked} captions against the real position. ${unknown} reels not in any pool (skipped).\n`);

  if (!problems.length) {
    console.log('✓ Every caption claim matches the puzzle it shows.');
    return;
  }

  console.log(`✗ ${problems.length} caption(s) claim something the position does not support:\n`);
  for (const p of problems) {
    console.log(`  ${p.where}  ${p.id}`);
    console.log(`     says:  ${p.claim}`);
    console.log(`     truth: ${p.truth}\n`);
  }
  process.exitCode = 1;
}

main().catch(e => { console.error(e); process.exit(1); });
