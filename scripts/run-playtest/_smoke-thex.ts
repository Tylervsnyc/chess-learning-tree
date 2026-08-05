// Throwaway smoke test: the-x only, OLD (cold, no abilities) vs NEW (ability-aware
// + themed carried loadout). Confirms the new loop's efficacy on the levels that
// false-flagged as 0%. Run: npx tsx scripts/run-playtest/_smoke-thex.ts [trials]
import { runSweep } from './sweep';
import type { Outcome } from './types';

const trials = process.argv[2] ? parseInt(process.argv[2], 10) : 15;

function winPct(rows: Outcome[], levelId: string, tier: string): string {
  const r = rows.filter((o) => o.levelId === levelId && o.tier === tier);
  if (!r.length) return '  -  ';
  const w = r.filter((o) => o.win).length;
  return `${Math.round((w / r.length) * 100)}%`.padStart(4);
}

function table(label: string, rows: Outcome[]) {
  const levels = [...new Set(rows.map((o) => o.levelId))].sort();
  console.log(`\n=== ${label} (n=${trials}/cell) ===`);
  console.log('level'.padEnd(12), 'T3   T4   T5');
  for (const lvl of levels) {
    console.log(
      lvl.padEnd(12),
      winPct(rows, lvl, 'T3'),
      winPct(rows, lvl, 'T4'),
      winPct(rows, lvl, 'T5'),
    );
  }
}

console.log(`the-x A/B — ${trials} trials per (level,tier)`);
const cold = runSweep({ trials, levelFilter: 'the-x', themedLoadout: false });
const aware = runSweep({ trials, levelFilter: 'the-x', themedLoadout: true });
table('OLD: cold, bots ignore abilities', cold);
table('NEW: ability-aware + carried loadout', aware);
