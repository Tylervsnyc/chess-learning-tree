/**
 * Morning digest writer — markdown summary of the previous night's sweep.
 *
 * Structure:
 *   1. Headline (one-line TL;DR)
 *   2. Difficulty map (per-level tier curves)
 *   3. Hardest / easiest levels
 *   4. Fail-mode breakdown
 *   5. Ability power matrix (from ablation)
 *   6. Level factor findings (from correlations)
 *   7. Methodology + caveats
 */

import { ABILITY_DEFS } from '../../lib/run/abilities';
import type { AbilityId } from '../../lib/run/abilities';
import type { LevelFeatures } from './features';
import type { FeatureCorrelation } from './correlations';
import type { AblationResult, LevelTierStats, TierId } from './types';

export interface DigestInput {
  date: string;                     // YYYY-MM-DD
  trialsPerCell: number;
  ablationTrials: number;
  baselineStats: LevelTierStats[];
  ablation: AblationResult[];
  features: LevelFeatures[];
  correlations: FeatureCorrelation[];
  caveats: string[];
}

export function renderDigest(input: DigestInput): string {
  const lines: string[] = [];
  lines.push(`# Rookie's Run — Morning Digest`);
  lines.push(``);
  lines.push(`**Date:** ${input.date}`);
  lines.push(
    `**Sweep:** ${input.trialsPerCell} trials × ${countLevels(input.baselineStats)} levels × 3 tiers · **Ablation:** ${input.ablationTrials} trials × 10 abilities`,
  );
  lines.push(``);

  // ─── 1. Headline ────────────────────────────────────────────────────────
  lines.push(`## TL;DR`);
  lines.push(``);
  lines.push(renderHeadline(input));
  lines.push(``);

  // ─── 2. Difficulty map ──────────────────────────────────────────────────
  lines.push(`## Difficulty Map`);
  lines.push(``);
  lines.push(`Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.`);
  lines.push(``);
  lines.push(`| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |`);
  lines.push(`|---|---:|---:|---:|---|---|---:|`);
  for (const row of buildDifficultyRows(input.baselineStats)) {
    lines.push(row);
  }
  lines.push(``);

  // ─── 3. Hardest / easiest at each tier ──────────────────────────────────
  lines.push(`## Outliers`);
  lines.push(``);
  for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
    const tierStats = input.baselineStats.filter((s) => s.tier === tier);
    const hard = [...tierStats].sort((a, b) => a.winRate - b.winRate).slice(0, 3);
    const easy = [...tierStats].sort((a, b) => b.winRate - a.winRate).slice(0, 3);
    lines.push(`**${tier} hardest:** ${hard.map(fmtLvlRate).join(' · ')}`);
    lines.push(``);
    lines.push(`**${tier} easiest:** ${easy.map(fmtLvlRate).join(' · ')}`);
    lines.push(``);
  }

  // ─── 4. Fail-mode breakdown ─────────────────────────────────────────────
  lines.push(`## Fail Modes`);
  lines.push(``);
  lines.push(`What kills each tier when they lose?`);
  lines.push(``);
  lines.push(`| Tier | Captured | Move-limit | Dead-end |`);
  lines.push(`|---|---:|---:|---:|`);
  for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
    const tierStats = input.baselineStats.filter((s) => s.tier === tier);
    const cap = mean(tierStats.map((s) => s.capturedRate));
    const ml = mean(tierStats.map((s) => s.moveLimitRate));
    const de = mean(tierStats.map((s) => s.deadEndRate));
    lines.push(
      `| ${tier} | ${pct(cap)} | ${pct(ml)} | ${pct(de)} |`,
    );
  }
  lines.push(``);

  // ─── 5. Ability power matrix ────────────────────────────────────────────
  lines.push(`## Ability Power Matrix (ablation)`);
  lines.push(``);
  lines.push(`Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).`);
  lines.push(``);
  lines.push(`| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |`);
  lines.push(`|---|---:|---:|---:|---|`);
  for (const row of buildAbilityRows(input.ablation)) {
    lines.push(row);
  }
  lines.push(``);

  // ─── 6. Level factor findings ───────────────────────────────────────────
  lines.push(`## Level Factor Findings`);
  lines.push(``);
  lines.push(`Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.`);
  lines.push(``);
  for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
    const tierCorrs = input.correlations
      .filter((c) => c.tier === tier)
      .slice(0, 8);
    if (tierCorrs.length === 0) continue;
    lines.push(`**${tier}**`);
    lines.push(``);
    lines.push(`| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |`);
    lines.push(`|---|---:|---:|---:|`);
    for (const c of tierCorrs) {
      lines.push(
        `| ${c.feature} | ${c.pearson.toFixed(2)} | ${pct(c.meanWhenHigh)} | ${pct(c.meanWhenLow)} |`,
      );
    }
    lines.push(``);
  }

  // ─── 7. Methodology + caveats ───────────────────────────────────────────
  lines.push(`## Methodology`);
  lines.push(``);
  lines.push(`- **T3 Casual** — 1-ply lookahead, "don't blunder, advance, take free captures." Mild move-selection noise.`);
  lines.push(`- **T4 Sharp** — 2-ply minimax over the same eval. Lower noise.`);
  lines.push(`- **T5 Expert v0.1** — 3-ply minimax, deterministic argmax. Same eval as T4 (ability-aware planner is a future upgrade).`);
  lines.push(`- All bots take offers reactively and tap Aegis when threatened. Most other abilities are enumerated as concrete candidate moves and scored by eval. Bots do NOT plan multi-step ability combos.`);
  lines.push(`- Rookie starts on file 4 (d1) for every sim — date-independent for stable comparisons.`);
  lines.push('- Seeds are deterministic per `levelId__tier__trial`.');
  lines.push(``);
  if (input.caveats.length > 0) {
    lines.push(`### Caveats`);
    lines.push(``);
    for (const c of input.caveats) lines.push(`- ${c}`);
    lines.push(``);
  }

  return lines.join('\n');
}

// ─── helpers ────────────────────────────────────────────────────────────────

function countLevels(stats: LevelTierStats[]): number {
  return new Set(stats.map((s) => s.levelId)).size;
}

function renderHeadline(input: DigestInput): string {
  const tierMeans: Record<TierId, number> = { T3: 0, T4: 0, T5: 0 };
  for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
    const arr = input.baselineStats.filter((s) => s.tier === tier);
    tierMeans[tier] = mean(arr.map((s) => s.winRate));
  }
  const opAbilities = topAblations(input.ablation, -8);
  const trapAbilities = topAblations(input.ablation, +5).filter(
    (r) => r.tier === 'T3',
  );
  const opNames = opAbilities.slice(0, 3).map((r) => ABILITY_DEFS[r.ability].name);
  const trapNames = trapAbilities.slice(0, 2).map((r) => ABILITY_DEFS[r.ability].name);

  const t3Range = describeRange(
    input.baselineStats.filter((s) => s.tier === 'T3').map((s) => s.winRate),
  );

  return [
    `Sweep complete. **T3 mean win-rate ${pct(tierMeans.T3)}** (range ${t3Range}), **T4 ${pct(tierMeans.T4)}**, **T5 ${pct(tierMeans.T5)}**.`,
    opNames.length
      ? `Biggest crutches: **${opNames.join(', ')}**.`
      : 'No ability acts as a major crutch yet — bots don\'t lean on any one ability.',
    trapNames.length
      ? `Apparent trap picks at T3: **${trapNames.join(', ')}**.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function describeRange(rates: number[]): string {
  if (rates.length === 0) return '?';
  const lo = Math.min(...rates);
  const hi = Math.max(...rates);
  return `${pct(lo)}–${pct(hi)}`;
}

function buildDifficultyRows(stats: LevelTierStats[]): string[] {
  // Group by levelId.
  const byLevel = new Map<string, Record<TierId, LevelTierStats>>();
  for (const s of stats) {
    const cur = byLevel.get(s.levelId) ?? ({} as Record<TierId, LevelTierStats>);
    cur[s.tier] = s;
    byLevel.set(s.levelId, cur);
  }
  const rows: string[] = [];
  const sorted = [...byLevel.entries()].sort(([a], [b]) => a.localeCompare(b));
  for (const [levelId, row] of sorted) {
    const t3 = row.T3?.winRate ?? 0;
    const t4 = row.T4?.winRate ?? 0;
    const t5 = row.T5?.winRate ?? 0;
    const shape = shapeIcon(t3, t4, t5);
    const topKiller = row.T4?.topKiller ?? row.T3?.topKiller ?? '—';
    const meanMoves = row.T4?.meanMoves.toFixed(1) ?? '—';
    rows.push(
      `| ${levelId} | ${pct(t3)} | ${pct(t4)} | ${pct(t5)} | ${shape} | ${topKiller} | ${meanMoves} |`,
    );
  }
  return rows;
}

function shapeIcon(t3: number, t4: number, t5: number): string {
  // Heuristic emoji-style labels (text-only because Tyler doesn't like emoji).
  if (t5 < 0.4) return 'broken (T5 still struggles)';
  if (t3 > 0.85) return 'trivial';
  if (t3 < 0.15 && t5 > 0.85) return 'tactical (T5 only)';
  if (t3 > 0.4 && t3 < 0.7 && t5 > 0.9) return 'fun-hard';
  if (t3 < 0.3 && t4 < 0.6) return 'punishing';
  return 'normal';
}

function buildAbilityRows(results: AblationResult[]): string[] {
  const byAbility = new Map<AbilityId, AblationResult[]>();
  for (const r of results) {
    const arr = byAbility.get(r.ability) ?? [];
    arr.push(r);
    byAbility.set(r.ability, arr);
  }
  const rows: string[] = [];
  const entries = [...byAbility.entries()].sort((a, b) => {
    const score = (arr: AblationResult[]): number =>
      Math.min(...arr.map((r) => r.deltaPp));
    return score(a[1]) - score(b[1]); // most-negative first
  });
  for (const [id, arr] of entries) {
    const t3 = arr.find((r) => r.tier === 'T3')?.deltaPp ?? 0;
    const t4 = arr.find((r) => r.tier === 'T4')?.deltaPp ?? 0;
    const t5 = arr.find((r) => r.tier === 'T5')?.deltaPp ?? 0;
    const tag = tagFor(t3, t4, t5);
    rows.push(
      `| ${ABILITY_DEFS[id].name} | ${pp(t3)} | ${pp(t4)} | ${pp(t5)} | ${tag} |`,
    );
  }
  return rows;
}

function tagFor(t3: number, t4: number, t5: number): string {
  const minDelta = Math.min(t3, t4, t5);
  if (minDelta < -15) return 'OP — major crutch';
  if (Math.abs(t3) < 2 && Math.abs(t4) < 2 && Math.abs(t5) < 2) return 'trash — no effect';
  if (t5 < -5 && Math.abs(t3) < 2) return 'expert-only';
  if (t3 > 5) return 'trap — hurts T3';
  return 'normal';
}

function topAblations(results: AblationResult[], threshold: number): AblationResult[] {
  if (threshold < 0) {
    return results.filter((r) => r.deltaPp < threshold).sort((a, b) => a.deltaPp - b.deltaPp);
  }
  return results.filter((r) => r.deltaPp > threshold).sort((a, b) => b.deltaPp - a.deltaPp);
}

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

function pp(x: number): string {
  const v = Math.round(x);
  return v > 0 ? `+${v}pp` : `${v}pp`;
}

function fmtLvlRate(s: LevelTierStats): string {
  return `${s.levelId} (${pct(s.winRate)})`;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
}
