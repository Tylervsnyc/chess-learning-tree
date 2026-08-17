#!/usr/bin/env -S npx tsx
/**
 * Summon-persistence experiment — should summoned allies persist between
 * levels of a run, and if so, how?
 *
 * Plays FULL runs (all levels, carrying tempo/abilities like simulate-run.ts)
 * with the summon ability pre-owned at a fixed tier, under several
 * persistence rules, and reports levels-completed / full-run-rate / per-level
 * win% against a no-ability baseline.
 *
 * Variants:
 *   baseline          — no summon ability
 *   squad-respawn     — CURRENT Squad: fresh full roster spawns every level,
 *                       survivors from last level are discarded
 *   squad-once        — roster spawns ONCE (level 1); survivors carry over,
 *                       re-placed around Rookie; nothing new ever spawns
 *   squad-topup       — survivors carry; each level refills back UP TO the
 *                       roster size (missing slots respawn)
 *   squad-snowball    — survivors carry AND a full new roster spawns on top
 *                       (army grows every level)
 *   phalanx-ephemeral — CURRENT Phalanx (instant pawns; die at level end)
 *   phalanx-persist   — Phalanx pawns that survive the level carry over
 *
 *   npx tsx scripts/run-playtest/summon-persistence-test.ts [trials=12] [tier=T4] [abilityTier=3] [runs=iron-curtain,the-gauntlet,...]
 *
 * Output: table on stdout + JSON at data/run-playtest/raw/summon-persistence.json
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { maxUsesForTier, type AbilityId, type AbilityTier, type OwnedAbility } from '../../lib/run/abilities';
import { getRunById } from '../../lib/run/runs';
import type { AllyPiece, BoardState, Coord } from '../../lib/run/types';
import { simulateGame } from './simulate';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import type { Bot, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

type Variant =
  | 'baseline'
  | 'squad-respawn'
  | 'squad-once'
  | 'squad-topup'
  | 'squad-snowball'
  | 'phalanx-ephemeral'
  | 'phalanx-persist';

const VARIANTS: Variant[] = [
  'baseline',
  'squad-respawn',
  'squad-once',
  'squad-topup',
  'squad-snowball',
  'phalanx-ephemeral',
  'phalanx-persist',
];

function abilityFor(v: Variant): AbilityId | null {
  if (v.startsWith('squad')) return 'squad';
  if (v.startsWith('phalanx')) return 'phalanx';
  return null;
}

function makeOwned(id: AbilityId, tier: AbilityTier): OwnedAbility {
  return { id, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id, tier) };
}

/** Re-place carried allies around the new Rookie start, keeping relative offsets when free. */
function replaceAllies(state: BoardState, carried: AllyPiece[], prevRookie: Coord): AllyPiece[] {
  const taken = new Set<string>();
  const key = (f: number, r: number) => `${f},${r}`;
  for (const p of state.pieces) taken.add(key(p.file, p.rank));
  for (const h of state.hazards) taken.add(key(h.file, h.rank));
  for (const a of state.allies) taken.add(key(a.file, a.rank));
  taken.add(key(state.rookie.file, state.rookie.rank));
  const out: AllyPiece[] = [];
  let nextId = Date.now() * 1000;
  for (const a of carried) {
    const df = a.file - prevRookie.file;
    const dr = a.rank - prevRookie.rank;
    let best: Coord | null = null;
    const want = { file: state.rookie.file + df, rank: state.rookie.rank + dr };
    // Search outward from the wanted square (Chebyshev rings), never on rank > 4
    // so carried allies don't teleport into the enemy formation.
    for (let ring = 0; ring <= 7 && !best; ring++) {
      for (let f = want.file - ring; f <= want.file + ring && !best; f++) {
        for (let r = want.rank - ring; r <= want.rank + ring; r++) {
          if (Math.max(Math.abs(f - want.file), Math.abs(r - want.rank)) !== ring) continue;
          if (f < 1 || f > 8 || r < 1 || r > 4) continue;
          if (taken.has(key(f, r))) continue;
          best = { file: f, rank: r };
          break;
        }
      }
    }
    if (!best) continue;
    taken.add(key(best.file, best.rank));
    out.push({ ...a, id: nextId++, file: best.file, rank: best.rank });
  }
  return out;
}

interface RunResult {
  levelsCompleted: number;
  perLevelWin: boolean[];
  alliesAtStart: number[];
}

function playRun(
  runId: string,
  variant: Variant,
  abilityTier: AbilityTier,
  bot: Bot,
  seed: string,
  rookieStart: Coord,
): RunResult {
  const run = getRunById(runId);
  const ability = abilityFor(variant);
  let carryTempo: number | undefined;
  let carryAbilities: OwnedAbility[] | undefined;
  let carryPendingOffer: BoardState['pendingOffer'] | undefined;
  let carriedAllies: AllyPiece[] = [];
  let prevRookie: Coord = rookieStart;
  const perLevelWin: boolean[] = [];
  const alliesAtStart: number[] = [];
  let levelsCompleted = 0;

  for (let i = 0; i < run.levels.length; i++) {
    const puzzle = run.levels[i](rookieStart);
    const preowned = ability ? [makeOwned(ability, abilityTier)] : undefined;
    const isFirst = i === 0;

    const allyOverride = (s: BoardState): AllyPiece[] => {
      const spawned = s.allies; // engine's fresh Squad roster (empty for phalanx/baseline)
      const carried = replaceAllies({ ...s, allies: [] }, carriedAllies, prevRookie);
      switch (variant) {
        case 'baseline':
        case 'squad-respawn':
        case 'phalanx-ephemeral':
          return spawned;
        case 'squad-once':
          return isFirst ? spawned : carried;
        case 'squad-topup': {
          if (isFirst) return spawned;
          const need = Math.max(0, spawned.length - carried.length);
          const occ = new Set(carried.map((a) => `${a.file},${a.rank}`));
          const fill = spawned.filter((a) => !occ.has(`${a.file},${a.rank}`)).slice(0, need);
          return [...carried, ...fill];
        }
        case 'squad-snowball': {
          const occ = new Set(carried.map((a) => `${a.file},${a.rank}`));
          return [...carried, ...spawned.filter((a) => !occ.has(`${a.file},${a.rank}`))];
        }
        case 'phalanx-persist':
          return carried;
      }
    };

    const r = simulateGame({
      puzzle,
      runId: run.id,
      bot,
      seed: `${seed}__L${i}`,
      carryTempo,
      // Level 1: seed via carryAbilities so the engine spawns the Squad roster
      // (preownedAbilities is layered AFTER seeding and would miss the spawn).
      carryAbilities: carryAbilities ?? preowned,
      carryPendingOffer,
      preownedAbilities: preowned,
      allyOverride,
    });
    // count allies at start = what allyOverride produced; approximate via re-run of override on a fake? Simpler: record survivors later.
    alliesAtStart.push(-1);
    perLevelWin.push(r.win);
    if (!r.win) break;
    levelsCompleted++;
    carryTempo = r.finalState.tempo;
    carryAbilities = r.finalState.abilities;
    carryPendingOffer = r.finalState.pendingOffer;
    prevRookie = r.finalState.rookie;
    // Only summoned (source 'squad') allies persist; converts are a different ability.
    carriedAllies = r.finalState.allies.filter((a) => a.source === 'squad');
  }
  return { levelsCompleted, perLevelWin, alliesAtStart };
}

function main() {
  const trials = parseInt(process.argv[2] ?? '12', 10);
  const botTier = (process.argv[3] ?? 'T4') as TierId;
  const abilityTier = parseInt(process.argv[4] ?? '3', 10) as AbilityTier;
  const runIds = (process.argv[5] ?? 'iron-curtain,the-gauntlet,cavalry-charge,pawn-tsunami').split(',');
  const bot = BOTS[botTier];
  const rookieStart = { file: 4, rank: 1 };

  const results: Record<string, Record<Variant, { levels: number[]; perLevel: number[][] }>> = {};
  for (const runId of runIds) {
    const numLevels = getRunById(runId).levels.length;
    results[runId] = {} as never;
    for (const v of VARIANTS) {
      const levels: number[] = [];
      const perLevel: number[][] = Array.from({ length: numLevels }, () => []);
      for (let t = 0; t < trials; t++) {
        const r = playRun(runId, v, abilityTier, bot, `summon__${runId}__${v}__${t}`, rookieStart);
        levels.push(r.levelsCompleted);
        r.perLevelWin.forEach((w, i) => perLevel[i].push(w ? 1 : 0));
      }
      results[runId][v] = { levels, perLevel };
      const mean = levels.reduce((a, b) => a + b, 0) / levels.length;
      const full = levels.filter((l) => l === numLevels).length / levels.length;
      console.log(`${runId.padEnd(16)} ${v.padEnd(18)} meanLevels=${mean.toFixed(2)}  fullRun=${(full * 100).toFixed(0)}%`);
    }
  }

  // Summary table
  console.log('\n=== SUMMARY (mean levels completed / full-run %) ===');
  const header = ['variant'.padEnd(18), ...runIds.map((r) => r.slice(0, 12).padEnd(14)), 'AVG'].join('');
  console.log(header);
  const summary: Record<string, unknown> = {};
  for (const v of VARIANTS) {
    let sumMean = 0;
    const cells: string[] = [];
    for (const runId of runIds) {
      const numLevels = getRunById(runId).levels.length;
      const ls = results[runId][v].levels;
      const mean = ls.reduce((a, b) => a + b, 0) / ls.length;
      const full = ls.filter((l) => l === numLevels).length / ls.length;
      sumMean += mean;
      cells.push(`${mean.toFixed(1)}/${(full * 100).toFixed(0)}%`.padEnd(14));
    }
    console.log(`${v.padEnd(18)}${cells.join('')}${(sumMean / runIds.length).toFixed(2)}`);
    summary[v] = { avgMeanLevels: sumMean / runIds.length };
  }

  const outDir = join(process.cwd(), 'data/run-playtest/raw');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'summon-persistence.json'),
    JSON.stringify({ trials, botTier, abilityTier, runIds, results, summary }, null, 2),
  );
}

main();
