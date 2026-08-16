/**
 * Sweep — runs `(every level) × (every tier) × N trials`.
 *
 * Output: array of Outcome records. Aggregation lives in `aggregate.ts`.
 *
 * Usage (standalone):
 *   npx tsx scripts/run-playtest/sweep.ts [trials]
 */

import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import { maxUsesForTier } from '../../lib/run/abilities';
import type {
  AbilityId,
  AbilityTier,
  OwnedAbility,
} from '../../lib/run/abilities';
import type { RookieForm, RunPuzzle } from '../../lib/run/types';
import type { Bot, Outcome, TierId } from './types';

/**
 * Which transform ability grants a given form. Inverse of formForAbility,
 * limited to the forms that locked-form/hazard-walled levels actually require.
 */
const ABILITY_FOR_FORM: Partial<Record<RookieForm, AbilityId>> = {
  bishop: 'bishop-step',
  knight: 'knight-hop',
  queen: 'queen-pulse',
};

/**
 * Realistic carried-ability loadout for a level played at its true depth.
 *
 * Themed runs (the X, Knight's Academy, Bishop's Path…) wall the rook in with
 * hazards and tell the player — via the level's `allowedForms` — which piece
 * they're meant to become. A human reaches level 8 of the X having picked
 * bishop-step around level 3 and upgraded it along the way; they do NOT arrive
 * with zero abilities. Testing those levels cold made the sweep cry wolf
 * (0%/unbeatable) on levels a human clears by chaining a transform.
 *
 * So for any hazard-walled level whose `allowedForms` names a non-rook form,
 * we seed the matching transform at a tier scaled to the level number — the
 * same organic upgrade pacing simulate-run uses (T1 by L2, +1 every 2 levels).
 * This is faithful: it's the exact ability state the player carries in, and it
 * runs through the real engine. Plain (non-walled) levels get nothing, so the
 * daily run is unaffected.
 */
export function themedLoadoutFor(puzzle: RunPuzzle): OwnedAbility[] {
  const hazardWalled = (puzzle.hazards?.length ?? 0) >= 4;
  if (!hazardWalled) return [];
  const forms = puzzle.allowedForms ?? [];
  const nonRook = forms.find((f) => f !== 'rook');
  if (!nonRook) return [];
  const id = ABILITY_FOR_FORM[nonRook];
  if (!id) return [];
  // T1 at L1-2, T2 at L3-4, T3 at L5-6, T4 at L7-8, T5 at L9-10.
  const tier = Math.min(5, Math.floor((puzzle.level - 1) / 2) + 1) as AbilityTier;
  return [
    {
      id,
      tier,
      mutations: [],
      usesLeftThisLevel: maxUsesForTier(id, tier),
    },
  ];
}

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

export interface SweepOpts {
  trials: number;
  tiers?: TierId[];
  excludedAbilities?: ReadonlySet<AbilityId>;
  /** Forced-take: bots must accept these whenever offered. */
  forcedAcceptIds?: ReadonlySet<AbilityId>;
  /** Forced-take: bots must dismiss these whenever offered. */
  forcedSkipIds?: ReadonlySet<AbilityId>;
  /** Combo: pre-own these abilities at game start (per level). */
  preownedAbilities?: ReadonlyArray<OwnedAbility>;
  /**
   * When true (default), hazard-walled themed levels are seeded with the
   * transform a real player would have carried to that depth (see
   * themedLoadoutFor). Set false to test levels cold (the old behavior) — used
   * by analyses that need a pristine zero-ability baseline.
   */
  themedLoadout?: boolean;
  /** Optional filter — only levels matching this id substring. */
  levelFilter?: string;
  /** Progress callback (line-by-line). */
  onProgress?: (line: string) => void;
}

export function runSweep(opts: SweepOpts): Outcome[] {
  const catalog = buildLevelCatalog().filter((e) =>
    opts.levelFilter ? e.levelId.includes(opts.levelFilter) : true,
  );
  const tiers: TierId[] = opts.tiers ?? ['T3', 'T4', 'T5'];
  const useThemedLoadout = opts.themedLoadout ?? true;
  const results: Outcome[] = [];

  let done = 0;
  const total = catalog.length * tiers.length * opts.trials;

  for (const entry of catalog) {
    // Realistic carried-ability loadout for this level's depth (themed runs
    // only). Merged with any explicit preownedAbilities — explicit wins on id
    // collision because simulateGame dedupes existing-first.
    const themed = useThemedLoadout ? themedLoadoutFor(entry.puzzle) : [];
    const preowned: OwnedAbility[] | undefined =
      opts.preownedAbilities || themed.length > 0
        ? [...(opts.preownedAbilities ?? []), ...themed]
        : undefined;
    for (const tier of tiers) {
      const bot = BOTS[tier];
      for (let trial = 0; trial < opts.trials; trial++) {
        const seed = `${entry.levelId}__${tier}__${trial}`;
        const r = simulateGame({
          puzzle: entry.puzzle,
          bot,
          seed,
          excludedAbilities: opts.excludedAbilities,
          forcedAcceptIds: opts.forcedAcceptIds,
          forcedSkipIds: opts.forcedSkipIds,
          preownedAbilities: preowned,
        });
        // Strip `finalState` so we don't bloat raw outcome JSONs with the
        // entire end-of-game BoardState — only the trace CLI needs it.
        const { finalState: _final, ...outcome } = r;
        void _final;
        results.push({
          ...outcome,
          levelId: entry.levelId,
          runId: entry.runId,
          levelIndex: entry.levelIndex,
          level: entry.puzzle.level,
          tier,
          trial,
        });
        done++;
        if (opts.onProgress && done % 50 === 0) {
          opts.onProgress(
            `[sweep] ${done}/${total} (${entry.levelId} ${tier} t${trial})`,
          );
        }
      }
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI entry.

function main(): void {
  const trialsArg = process.argv[2];
  const trials = trialsArg ? parseInt(trialsArg, 10) : 50;
  if (Number.isNaN(trials) || trials < 1) {
    console.error('Usage: npx tsx scripts/run-playtest/sweep.ts [trials]');
    process.exit(1);
  }

  console.log(`[sweep] running ${trials} trials per (level, tier)`);
  const t0 = Date.now();
  const results = runSweep({ trials, onProgress: (s) => console.log(s) });
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[sweep] done in ${dt}s, ${results.length} outcomes`);

  // Quick summary print so smoke tests are legible without writing a digest.
  const byKey = new Map<string, Outcome[]>();
  for (const r of results) {
    const key = `${r.levelId}|${r.tier}`;
    const arr = byKey.get(key) ?? [];
    arr.push(r);
    byKey.set(key, arr);
  }
  const lines: string[] = [];
  for (const [key, arr] of byKey) {
    const wins = arr.filter((a) => a.win).length;
    lines.push(`${key}\t${wins}/${arr.length}\t${((wins / arr.length) * 100).toFixed(0)}%`);
  }
  lines.sort();
  console.log('\nLevel\\Tier  Wins  WinRate');
  for (const l of lines) console.log(l);
}

if (require.main === module) {
  main();
}
