#!/usr/bin/env -S npx tsx
/**
 * Strategy discovery — run a hard level N times with trace recording,
 * separate wins from losses, surface what winners do that losers don't.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/discover-strat.ts <levelId> [trials] [tiers]
 *
 * Examples:
 *   npx tsx scripts/run-playtest/discover-strat.ts iron-curtain/9 100
 *   npx tsx scripts/run-playtest/discover-strat.ts the-gauntlet/9 100 T4,T5
 *
 * Output: markdown report at data/run-playtest/strats/<levelId>_<date>.md
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import { puzzleToBoardState } from '../../lib/run/seed';
import { enemyAttackedSquares } from './bots/shared';
import { toSquare, fromSquare } from '../../lib/run/types';
import type { Coord, EnemyPiece, RunPuzzle } from '../../lib/run/types';
import type { Bot, BotAction, TierId } from './types';
import type { AbilityId } from '../../lib/run/abilities';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

interface TrialRecord {
  trial: number;
  tier: TierId;
  win: boolean;
  movesUsed: number;
  failMode: string;
  abilitiesTaken: AbilityId[];
  abilitiesUsed: AbilityId[];
  // Squares Rookie occupied turn-by-turn — derived from action list applied
  // to puzzle.rookieStart. For analysis we keep the per-turn destination.
  moveSequence: string[];
  // Per-turn action kind: 'move' | 'activate-ability' | 'ability-target'
  actionKinds: string[];
}

interface Analysis {
  tier: TierId;
  trials: number;
  wins: number;
  losses: number;
  winRate: number;
  meanMovesWin: number;
  meanMovesLoss: number;
  // First-move popularity. Squares where Rookie went on turn 0, win % per square.
  firstMoves: { square: string; total: number; winRate: number }[];
  // Ability use patterns in winning trials: which abilities, by turn.
  abilityUsesByTurnInWins: { abilityId: AbilityId; turns: number[] }[];
  abilityUsesInWins: { abilityId: AbilityId; share: number }[];
  abilityUsesInLosses: { abilityId: AbilityId; share: number }[];
  // Top 2-move sequences in wins (what winners do early).
  topOpenings: { sequence: string; count: number; winRate: number }[];
}

// ─── Position explanation (the "why" layer) ────────────────────────────────
// These helpers turn raw squares into chess reasoning. See
// .claude/run-strategy-bible.md for the principles they encode.

/** Files with no enemy or hazard between fromRank+1 and rank 7 (inclusive). */
function openFilesFromRank(puzzle: RunPuzzle, fromRank: number): number[] {
  const open: number[] = [];
  for (let f = 1; f <= 8; f++) {
    let clear = true;
    for (let r = fromRank + 1; r <= 7; r++) {
      if (puzzle.pieces.some((p) => p.file === f && p.rank === r)) {
        clear = false;
        break;
      }
      if (puzzle.hazards?.some((h) => h.file === f && h.rank === r)) {
        clear = false;
        break;
      }
    }
    if (clear) open.push(f);
  }
  return open;
}

/** Convert a file number to the chess letter (1 → 'a', 8 → 'h'). */
function fileLetter(file: number): string {
  return String.fromCharCode('a'.charCodeAt(0) + file - 1);
}

/** True if Rookie can reach (target) from (start) via a single rook slide
 *  (same rank, same file) without enemies/hazards in between (the slide
 *  stops at the first blocker — capturable squares are reachable). */
function rookReachable(puzzle: RunPuzzle, start: Coord, target: Coord): boolean {
  if (start.file === target.file && start.rank === target.rank) return true;
  if (start.file !== target.file && start.rank !== target.rank) return false;
  // Same rank — check intermediate files
  if (start.rank === target.rank) {
    const lo = Math.min(start.file, target.file);
    const hi = Math.max(start.file, target.file);
    for (let f = lo + 1; f < hi; f++) {
      if (puzzle.pieces.some((p) => p.file === f && p.rank === start.rank)) return false;
      if (puzzle.hazards?.some((h) => h.file === f && h.rank === start.rank)) return false;
    }
    return true;
  }
  // Same file — check intermediate ranks
  const lo = Math.min(start.rank, target.rank);
  const hi = Math.max(start.rank, target.rank);
  for (let r = lo + 1; r < hi; r++) {
    if (puzzle.pieces.some((p) => p.file === start.file && p.rank === r)) return false;
    if (puzzle.hazards?.some((h) => h.file === start.file && h.rank === r)) return false;
  }
  return true;
}

/** Find enemies currently attacking a square (using the same compute as the
 *  bot eval — handles pawn/knight/bishop/queen). */
function attackersOf(puzzle: RunPuzzle, sq: Coord): EnemyPiece[] {
  const state = puzzleToBoardState(puzzle);
  const attacked = enemyAttackedSquares(state);
  if (!attacked.has(toSquare(sq))) return [];
  // Re-iterate pieces and check membership per piece. Reuses the eval's
  // attack-set logic via individual-piece projection (simpler than re-running
  // for each).
  const out: EnemyPiece[] = [];
  for (const p of state.pieces) {
    const single: typeof state = { ...state, pieces: [p] };
    if (enemyAttackedSquares(single).has(toSquare(sq))) out.push(p);
  }
  return out;
}

/** Find the first enemy piece on `file` between `fromRank` (exclusive) and
 *  rank 8 inclusive. Returns the piece + the file's open status after capture. */
function captureToOpen(
  puzzle: RunPuzzle,
  file: number,
  fromRank: number,
): { piece: EnemyPiece; defended: boolean; fileOpenAfter: boolean } | null {
  let blocker: EnemyPiece | undefined;
  for (let r = fromRank + 1; r <= 8; r++) {
    // Hazards permanently block the file.
    if (puzzle.hazards?.some((h) => h.file === file && h.rank === r)) return null;
    const p = puzzle.pieces.find((q) => q.file === file && q.rank === r);
    if (p) {
      blocker = p;
      break;
    }
  }
  if (!blocker) return null; // file already clear

  // Check if any OTHER enemy attacks the blocker's square — that's the
  // "defended" test. Build a state without the blocker and see if remaining
  // pieces attack the now-empty square.
  const withoutBlocker: RunPuzzle = {
    ...puzzle,
    pieces: puzzle.pieces.filter((p) => p !== blocker),
  };
  const stateNoBlocker = puzzleToBoardState(withoutBlocker);
  const defended = enemyAttackedSquares(stateNoBlocker).has(
    toSquare({ file: blocker.file, rank: blocker.rank }),
  );

  // After the capture, would the file be open from the blocker's rank to 8?
  const fileOpenAfter = openFilesFromRank(withoutBlocker, blocker.rank).includes(file);

  return { piece: blocker, defended, fileOpenAfter };
}

/** A short string describing why a starting square is good or bad. */
function explainSquare(puzzle: RunPuzzle, sq: Coord): string {
  const attackers = attackersOf(puzzle, sq);
  const openFiles = openFilesFromRank(puzzle, sq.rank);
  const onOpenFile = openFiles.includes(sq.file);
  // Open files reachable along the current rank via a rook slide.
  const reachableOpen = openFiles.filter((f) =>
    rookReachable(puzzle, sq, { file: f, rank: sq.rank }),
  );
  const parts: string[] = [];

  if (attackers.length === 0) parts.push('safe (no current attackers)');
  else {
    const names = attackers
      .slice(0, 3)
      .map((a) => `${a.type} ${fileLetter(a.file)}${a.rank}`)
      .join(', ');
    parts.push(`attacked by ${names}`);
  }

  if (onOpenFile) {
    parts.push(`ON open winning file ${fileLetter(sq.file)}`);
  } else if (reachableOpen.length > 0) {
    parts.push(
      `${reachableOpen.length} open file${reachableOpen.length === 1 ? '' : 's'} (${reachableOpen.map(fileLetter).join(',')}) reachable along rank ${sq.rank}`,
    );
  } else {
    parts.push(`no immediate open files from rank ${sq.rank}`);
  }

  // Capture-to-open: even when no file is currently open, capturing an
  // undefended blocker can unlock one. Scan files reachable along rank.
  const captureUnlocks: string[] = [];
  for (let f = 1; f <= 8; f++) {
    if (!rookReachable(puzzle, sq, { file: f, rank: sq.rank })) continue;
    if (reachableOpen.includes(f)) continue; // already open, skip
    const cap = captureToOpen(puzzle, f, sq.rank);
    if (cap && !cap.defended && cap.fileOpenAfter) {
      captureUnlocks.push(
        `take ${cap.piece.type} ${fileLetter(cap.piece.file)}${cap.piece.rank} (undef) → ${fileLetter(f)} opens`,
      );
    }
  }
  if (captureUnlocks.length > 0) {
    parts.push(`unlocks: ${captureUnlocks.slice(0, 3).join(', ')}`);
  }

  return parts.join('; ');
}

/** A short string describing why a 2-move opening might work. */
function explainOpening(puzzle: RunPuzzle, first: string, second: string): string {
  const firstC = fromSquare(first);
  const secondC = fromSquare(second);
  const openFromSecond = openFilesFromRank(puzzle, secondC.rank);
  const onOpenAfterMove = openFromSecond.includes(secondC.file);
  const secondAttackers = attackersOf(puzzle, secondC);
  const parts: string[] = [];

  if (firstC.rank === secondC.rank) {
    parts.push(`rank-${firstC.rank} sidestep`);
  } else if (firstC.file === secondC.file) {
    parts.push(`climb file ${fileLetter(firstC.file)} +${secondC.rank - firstC.rank}`);
  }

  if (onOpenAfterMove) {
    parts.push(`lands on open winning file ${fileLetter(secondC.file)}`);
  }
  if (secondAttackers.length > 0) {
    parts.push(`${secondAttackers.length} attacker${secondAttackers.length === 1 ? '' : 's'} on ${second}`);
  }
  return parts.join('; ') || '—';
}

function parseArgs(): { levelId: string; trials: number; tiers: TierId[] } {
  const levelId = process.argv[2];
  if (!levelId) {
    console.error('Usage: discover-strat.ts <levelId> [trials=100] [tiers=T3,T4,T5]');
    process.exit(1);
  }
  const trials = parseInt(process.argv[3] ?? '100', 10);
  const tiersArg = process.argv[4] ?? 'T3,T4,T5';
  const tiers = tiersArg.split(',').map((t) => t.trim()) as TierId[];
  return { levelId, trials, tiers };
}

function actionDestination(action: BotAction, prev: string): string {
  if (action.kind === 'move') return toSquare(action.target);
  if (action.kind === 'ability-target') return toSquare(action.target);
  return prev; // free actions (activate without target) keep position
}

function analyze(records: TrialRecord[]): Analysis {
  const tier = records[0].tier;
  const wins = records.filter((r) => r.win);
  const losses = records.filter((r) => !r.win);

  // First moves
  const firstMap = new Map<string, { total: number; wins: number }>();
  for (const r of records) {
    const sq = r.moveSequence[0] ?? '(none)';
    const cur = firstMap.get(sq) ?? { total: 0, wins: 0 };
    cur.total++;
    if (r.win) cur.wins++;
    firstMap.set(sq, cur);
  }
  const firstMoves = [...firstMap.entries()]
    .map(([sq, x]) => ({
      square: sq,
      total: x.total,
      winRate: x.total > 0 ? x.wins / x.total : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Ability uses in wins, by ability and by turn
  const useTurnMap = new Map<AbilityId, number[]>();
  const winsByAbility = new Map<AbilityId, number>();
  const lossesByAbility = new Map<AbilityId, number>();
  for (const r of records) {
    const seen = new Set<AbilityId>();
    r.abilitiesUsed.forEach((id) => seen.add(id));
    if (r.win) {
      for (const id of seen) winsByAbility.set(id, (winsByAbility.get(id) ?? 0) + 1);
      for (let t = 0; t < r.actionKinds.length; t++) {
        if (r.actionKinds[t] === 'ability-target' || r.actionKinds[t] === 'activate-ability') {
          // best-effort: associate the ability used with the turn index
          const idForTurn = r.abilitiesUsed[Math.min(t, r.abilitiesUsed.length - 1)];
          if (idForTurn) {
            const arr = useTurnMap.get(idForTurn) ?? [];
            arr.push(t);
            useTurnMap.set(idForTurn, arr);
          }
        }
      }
    } else {
      for (const id of seen) lossesByAbility.set(id, (lossesByAbility.get(id) ?? 0) + 1);
    }
  }
  const abilityUsesInWins = [...winsByAbility.entries()]
    .map(([abilityId, c]) => ({ abilityId, share: c / Math.max(1, wins.length) }))
    .sort((a, b) => b.share - a.share);
  const abilityUsesInLosses = [...lossesByAbility.entries()]
    .map(([abilityId, c]) => ({ abilityId, share: c / Math.max(1, losses.length) }))
    .sort((a, b) => b.share - a.share);
  const abilityUsesByTurnInWins = [...useTurnMap.entries()].map(([abilityId, turns]) => ({
    abilityId,
    turns,
  }));

  // Top 2-move openings (winners only)
  const openingMap = new Map<string, { total: number; wins: number }>();
  for (const r of records) {
    if (r.moveSequence.length < 2) continue;
    const seq = `${r.moveSequence[0]} → ${r.moveSequence[1]}`;
    const cur = openingMap.get(seq) ?? { total: 0, wins: 0 };
    cur.total++;
    if (r.win) cur.wins++;
    openingMap.set(seq, cur);
  }
  const topOpenings = [...openingMap.entries()]
    .map(([sequence, x]) => ({
      sequence,
      count: x.total,
      winRate: x.total > 0 ? x.wins / x.total : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    tier,
    trials: records.length,
    wins: wins.length,
    losses: losses.length,
    winRate: wins.length / Math.max(1, records.length),
    meanMovesWin:
      wins.length > 0
        ? wins.reduce((s, r) => s + r.movesUsed, 0) / wins.length
        : 0,
    meanMovesLoss:
      losses.length > 0
        ? losses.reduce((s, r) => s + r.movesUsed, 0) / losses.length
        : 0,
    firstMoves,
    abilityUsesByTurnInWins,
    abilityUsesInWins,
    abilityUsesInLosses,
    topOpenings,
  };
}

function renderReport(levelId: string, puzzle: RunPuzzle, analyses: Analysis[]): string {
  const lines: string[] = [];
  lines.push(`# Strategy Discovery — ${levelId}`);
  lines.push(``);
  lines.push(`Each tier played the level multiple times with seed-varied bots. We compare what winners did vs losers to surface winning patterns. Each square / opening is annotated with a chess-reasoning "why" derived from the level's piece geometry. See \`.claude/run-strategy-bible.md\` for the principles.`);
  lines.push(``);
  // Board summary
  lines.push(`## Level summary`);
  lines.push(``);
  const pieceCounts = puzzle.pieces.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1;
    return acc;
  }, {});
  const pieceDesc = Object.entries(pieceCounts)
    .map(([t, n]) => `${n} ${t}${n > 1 ? 's' : ''}`)
    .join(' · ');
  lines.push(`- Pieces: ${pieceDesc}`);
  lines.push(`- Rookie start: ${toSquare(puzzle.rookieStart)}`);
  if (puzzle.moveLimit) lines.push(`- Move limit: ${puzzle.moveLimit}`);
  if (puzzle.enemiesPerTurn && puzzle.enemiesPerTurn > 1)
    lines.push(`- Enemies per turn: ${puzzle.enemiesPerTurn}`);
  if (puzzle.allowedForms)
    lines.push(`- Allowed forms: rook + ${puzzle.allowedForms.join(', ')}`);
  if (puzzle.hazards && puzzle.hazards.length > 0)
    lines.push(`- Hazards at: ${puzzle.hazards.map((h) => toSquare(h)).join(', ')}`);
  const openAtStart = openFilesFromRank(puzzle, puzzle.rookieStart.rank);
  lines.push(
    `- Open files from start rank: ${openAtStart.length > 0 ? openAtStart.map(fileLetter).join(', ') : 'NONE — every file has a blocker'}`,
  );
  lines.push(``);
  for (const a of analyses) {
    lines.push(`## ${a.tier}`);
    lines.push(``);
    lines.push(
      `**${a.wins} wins / ${a.losses} losses** (${(a.winRate * 100).toFixed(0)}% win rate over ${a.trials} trials)`,
    );
    lines.push(``);
    if (a.wins > 0) lines.push(`Mean moves in wins: ${a.meanMovesWin.toFixed(1)}`);
    if (a.losses > 0) lines.push(`Mean moves in losses: ${a.meanMovesLoss.toFixed(1)}`);
    lines.push(``);

    // First moves
    lines.push(`### Most common first moves`);
    lines.push(``);
    lines.push(`| First square | Total | Win rate | Why |`);
    lines.push(`|---|---:|---:|---|`);
    for (const fm of a.firstMoves) {
      const why = fm.square === '(none)' ? '—' : explainSquare(puzzle, fromSquare(fm.square));
      lines.push(
        `| ${fm.square} | ${fm.total} | ${(fm.winRate * 100).toFixed(0)}% | ${why} |`,
      );
    }
    lines.push(``);

    // Ability use comparison
    if (a.abilityUsesInWins.length > 0 || a.abilityUsesInLosses.length > 0) {
      lines.push(`### Ability use: winners vs losers`);
      lines.push(``);
      lines.push(`| Ability | Share of wins using it | Share of losses using it | Lift |`);
      lines.push(`|---|---:|---:|---:|`);
      const allIds = new Set<AbilityId>();
      for (const x of a.abilityUsesInWins) allIds.add(x.abilityId);
      for (const x of a.abilityUsesInLosses) allIds.add(x.abilityId);
      for (const id of allIds) {
        const w = a.abilityUsesInWins.find((x) => x.abilityId === id)?.share ?? 0;
        const l = a.abilityUsesInLosses.find((x) => x.abilityId === id)?.share ?? 0;
        const lift = w - l;
        lines.push(
          `| ${id} | ${(w * 100).toFixed(0)}% | ${(l * 100).toFixed(0)}% | ${lift >= 0 ? '+' : ''}${(lift * 100).toFixed(0)}pp |`,
        );
      }
      lines.push(``);
    }

    // Top openings
    if (a.topOpenings.length > 0) {
      lines.push(`### Top 2-move openings`);
      lines.push(``);
      lines.push(`| Sequence | Times | Win rate | Why |`);
      lines.push(`|---|---:|---:|---|`);
      for (const o of a.topOpenings) {
        // sequence is formatted "X → Y"
        const [first, second] = o.sequence.split(' → ');
        const why = first && second ? explainOpening(puzzle, first, second) : '—';
        lines.push(
          `| ${o.sequence} | ${o.count} | ${(o.winRate * 100).toFixed(0)}% | ${why} |`,
        );
      }
      lines.push(``);
    }
  }
  lines.push(`## How to read this`);
  lines.push(``);
  lines.push(`- A first move with high "Win rate" relative to total = a good opening on this level. If 80% of trials starting with c1 won but only 20% starting with f1 won, that's a strong directional signal.`);
  lines.push(`- "Lift" = ability use share in wins minus losses. Positive lift = winners used it more = the ability mattered.`);
  lines.push(`- Top 2-move openings reveal whether wins cluster around a few approaches or are spread out. Concentrated openings mean there's a "right way" to play; spread means many paths work.`);
  return lines.join('\n');
}

async function main(): Promise<void> {
  const { levelId, trials, tiers } = parseArgs();

  const entry = buildLevelCatalog().find((e) => e.levelId === levelId);
  if (!entry) {
    console.error(`No level found with levelId="${levelId}"`);
    process.exit(1);
  }

  const analyses: Analysis[] = [];
  for (const tier of tiers) {
    console.log(`[discover-strat] running ${tier} × ${trials} on ${levelId}`);
    const tierRecords: TrialRecord[] = [];
    for (let i = 0; i < trials; i++) {
      const seed = `${levelId}__${tier}__discover-${i}`;
      const r = simulateGame({
        puzzle: entry.puzzle,
        bot: BOTS[tier],
        seed,
        recordTrace: true,
      });
      // Reconstruct move sequence from decisionLog.
      const moveSequence: string[] = [];
      const actionKinds: string[] = [];
      let prev = toSquare(entry.puzzle.rookieStart);
      for (const entryLog of r.decisionLog ?? []) {
        moveSequence.push(actionDestination(entryLog.action, prev));
        actionKinds.push(entryLog.action.kind);
        prev = moveSequence[moveSequence.length - 1];
      }
      tierRecords.push({
        trial: i,
        tier,
        win: r.win,
        movesUsed: r.movesUsed,
        failMode: r.failMode,
        abilitiesTaken: r.abilitiesTaken,
        abilitiesUsed: r.abilitiesUsed,
        moveSequence,
        actionKinds,
      });
    }
    analyses.push(analyze(tierRecords));
  }

  const date = new Date().toISOString().slice(0, 10);
  const outDir = join(__dirname, '..', '..', 'data', 'run-playtest', 'strats');
  mkdirSync(outDir, { recursive: true });
  const safeId = levelId.replace(/\//g, '__');
  const outPath = join(outDir, `${safeId}_${date}.md`);
  writeFileSync(outPath, renderReport(levelId, entry.puzzle, analyses));
  console.log(`[discover-strat] report written: ${outPath}`);

  // Brief console summary
  for (const a of analyses) {
    console.log(
      `  ${a.tier}: ${a.wins}/${a.trials} wins · top first move ${a.firstMoves[0]?.square ?? '(none)'} · top opening ${a.topOpenings[0]?.sequence ?? '(none)'}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
