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
import type { RegressionReport } from './regression';
import type { Experiment } from './experiment-log';
import { byDate, readAll as readAllExperiments } from './experiment-log';
import type { Hypothesis } from './hypothesis-queue';
import type { PublishResult } from './model-version';
import { describeMutation } from './mutations';
import type { AblationResult, LevelTierStats, TierId } from './types';

export interface DigestInput {
  date: string;                     // YYYY-MM-DD
  trialsPerCell: number;
  ablationTrials: number;
  baselineStats: LevelTierStats[];
  ablation: AblationResult[];
  features: LevelFeatures[];
  correlations: FeatureCorrelation[];
  regression?: RegressionReport;
  /** Hypotheses that were SCHEDULED for tonight (may include some that ran). */
  hypothesesPlanned?: Hypothesis[];
  /** Experiments that actually ran tonight (1 per hypothesis above). */
  hypothesisResults?: Experiment[];
  /** Outcome of proposeNewVersion — drives the "model trajectory" line. */
  publishResult?: PublishResult | null;
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

  // ─── 5. Current Abilities Ranked ────────────────────────────────────────
  // WHY ranked first, matrix second: a power_score (T3-weighted |delta|)
  // gives Tyler the "what matters" view at a glance. The raw matrix below
  // is the audit trail.
  if (input.ablation.length > 0) {
    lines.push(`## Current Abilities Ranked`);
    lines.push(``);
    lines.push(
      `Power score weights absolute deltas by tier (T3=2.0, T4=1.5, T5=1.0) — abilities that help beginners rank higher. **Character** is a one-line interpretation of the curve.`,
    );
    lines.push(``);
    lines.push(`| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |`);
    lines.push(`|---|---|---:|---:|---:|---:|---|`);
    for (const row of buildRankingRows(input.ablation)) {
      lines.push(row);
    }
    lines.push(``);
  }

  // ─── 5b. Ability power matrix ───────────────────────────────────────────
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

  // ─── 5b. Forced-take analysis ───────────────────────────────────────────
  // WHY: ablation removes the ability from the offer pool entirely. This
  // panel leaves the pool alone but forces the bot's *pick* — telling us
  // whether low usage is rational ("they skip because it's bad") or a
  // blind-spot ("they skip but it would have helped").
  if (input.forcedTake && input.forcedTake.length > 0) {
    lines.push(`## Forced-Take Analysis`);
    lines.push(``);
    lines.push(`Force the bot to accept (or refuse) each ability whenever offered. Accept Δ > 0 = forcing the pick helped (bot was leaving value on the table). Skip Δ > 0 = forcing the skip helped (bot was hurting itself by taking it).`);
    lines.push(``);
    lines.push(`| Ability | Accept ΔT3 | Accept ΔT4 | Accept ΔT5 | Skip ΔT3 | Skip ΔT4 | Skip ΔT5 |`);
    lines.push(`|---|---:|---:|---:|---:|---:|---:|`);
    for (const row of buildForcedTakeRows(input.forcedTake)) {
      lines.push(row);
    }
    lines.push(``);
  }

  // ─── 5c. Top combos ─────────────────────────────────────────────────────
  if (input.combos && input.combos.length > 0) {
    lines.push(`## Top Combos`);
    lines.push(``);
    const sampleNote = input.comboSampledLevels?.length
      ? ` (sampled across ${input.comboSampledLevels.length} levels)`
      : '';
    lines.push(`Pair-combo synergy: pre-own (A, B) at T1 from level 1 and compare to the sum of solo (A) and solo (B) deltas${sampleNote}.`);
    lines.push(`Positive synergy = the pair over-performs the sum of its parts. Negative = redundant or the abilities step on each other.`);
    lines.push(``);
    for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
      const tierCombos = input.combos.filter((c) => c.tier === tier);
      if (tierCombos.length === 0) continue;
      const sorted = [...tierCombos].sort((a, b) => b.synergyPp - a.synergyPp);
      const top = sorted.slice(0, 5);
      const bottom = [...sorted].reverse().slice(0, 3);
      lines.push(`**${tier} — top synergies**`);
      lines.push(``);
      lines.push(`| Pair | Pair Δ | Solo A Δ | Solo B Δ | Synergy Δ |`);
      lines.push(`|---|---:|---:|---:|---:|`);
      for (const c of top) lines.push(fmtComboRow(c));
      lines.push(``);
      lines.push(`**${tier} — anti-synergies**`);
      lines.push(``);
      lines.push(`| Pair | Pair Δ | Solo A Δ | Solo B Δ | Synergy Δ |`);
      lines.push(`|---|---:|---:|---:|---:|`);
      for (const c of bottom) lines.push(fmtComboRow(c));
      lines.push(``);
    }
  }

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

  // ─── 6b. Multivariate model ─────────────────────────────────────────────
  // Sits right after the univariate Pearson view so a reader can compare
  // "what correlates" vs "what survives when controlling for everything
  // else."
  if (input.regression && input.regression.tiers.length > 0) {
    lines.push(`## Multivariate Difficulty Model`);
    lines.push(``);
    lines.push(
      `Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.`,
    );
    lines.push(``);
    for (const t of input.regression.tiers) {
      lines.push(`**${t.tier}** — train R² ${fmtR2(t.trainR2)} · hold-out R² ${fmtR2(t.holdoutR2)} (n=${t.samples}, train=${t.trainSize}, hold-out=${t.holdoutSize})`);
      lines.push(``);
      lines.push(`| Feature | Std coef | Effect |`);
      lines.push(`|---|---:|---|`);
      for (const f of t.top5) {
        lines.push(
          `| ${f.feature} | ${fmtPp(f.stdCoef)} | ${narrate(f, t.tier)} |`,
        );
      }
      lines.push(``);
    }
  }

  // ─── 6c. Hypothesis Ledger ──────────────────────────────────────────────
  // The system's running scorecard: what did we predict, what did we
  // measure, how is the model doing across the rolling window.
  lines.push(...renderHypothesisLedger(input));

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

/**
 * Per-ability power ranking. Score weights |Δwin-rate| by tier:
 * T3=2.0 (beginners are the audience), T4=1.5, T5=1.0. Sort descending.
 *
 * Character labels are interpretive — same archetypes used by the standalone
 * ability-lab one-shot agent so the two views stay consistent.
 */
function buildRankingRows(results: AblationResult[]): string[] {
  const byAbility = new Map<AbilityId, AblationResult[]>();
  for (const r of results) {
    const arr = byAbility.get(r.ability) ?? [];
    arr.push(r);
    byAbility.set(r.ability, arr);
  }
  const scored = [...byAbility.entries()].map(([id, arr]) => {
    const t3 = arr.find((r) => r.tier === 'T3')?.deltaPp ?? 0;
    const t4 = arr.find((r) => r.tier === 'T4')?.deltaPp ?? 0;
    const t5 = arr.find((r) => r.tier === 'T5')?.deltaPp ?? 0;
    const power = 2.0 * Math.abs(t3) + 1.5 * Math.abs(t4) + 1.0 * Math.abs(t5);
    return { id, t3, t4, t5, power };
  });
  scored.sort((a, b) => b.power - a.power);

  return scored.map((s, i) => {
    const character = characterFor(s.t3, s.t4, s.t5);
    return `| ${i + 1} | ${ABILITY_DEFS[s.id].name} | ${s.power.toFixed(1)} | ${pp(s.t3)} | ${pp(s.t4)} | ${pp(s.t5)} | ${character} |`;
  });
}

function characterFor(t3: number, t4: number, t5: number): string {
  const a3 = Math.abs(t3);
  const a4 = Math.abs(t4);
  const a5 = Math.abs(t5);
  if (t3 > 5) return 'Trap — beginners take it but lose more';
  if (a3 < 3 && a4 < 3 && a5 < 3) return 'Quiet — negligible impact';
  if (a3 >= 2 * a5 && t3 < 0) return 'Beginner crutch';
  if (a5 > a3 && a5 > a4) return 'Expert tool';
  return 'All-tier staple';
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

function buildForcedTakeRows(results: ForcedTakeResult[]): string[] {
  const byAbility = new Map<AbilityId, ForcedTakeResult[]>();
  for (const r of results) {
    const arr = byAbility.get(r.ability) ?? [];
    arr.push(r);
    byAbility.set(r.ability, arr);
  }
  // Sort by most-positive accept delta — the abilities the bot most under-takes.
  const entries = [...byAbility.entries()].sort((a, b) => {
    const score = (arr: ForcedTakeResult[]): number =>
      Math.max(...arr.map((r) => r.acceptDeltaPp));
    return score(b[1]) - score(a[1]);
  });
  const rows: string[] = [];
  for (const [id, arr] of entries) {
    const aT3 = arr.find((r) => r.tier === 'T3')?.acceptDeltaPp ?? 0;
    const aT4 = arr.find((r) => r.tier === 'T4')?.acceptDeltaPp ?? 0;
    const aT5 = arr.find((r) => r.tier === 'T5')?.acceptDeltaPp ?? 0;
    const sT3 = arr.find((r) => r.tier === 'T3')?.skipDeltaPp ?? 0;
    const sT4 = arr.find((r) => r.tier === 'T4')?.skipDeltaPp ?? 0;
    const sT5 = arr.find((r) => r.tier === 'T5')?.skipDeltaPp ?? 0;
    rows.push(
      `| ${ABILITY_DEFS[id].name} | ${pp(aT3)} | ${pp(aT4)} | ${pp(aT5)} | ${pp(sT3)} | ${pp(sT4)} | ${pp(sT5)} |`,
    );
  }
  return rows;
}

function fmtComboRow(c: ComboResult): string {
  const nameA = ABILITY_DEFS[c.abilityA].name;
  const nameB = ABILITY_DEFS[c.abilityB].name;
  return `| ${nameA} + ${nameB} | ${pp(c.pairDeltaPp)} | ${pp(c.soloADeltaPp)} | ${pp(c.soloBDeltaPp)} | ${pp(c.synergyPp)} |`;
}

function fmtLvlRate(s: LevelTierStats): string {
  return `${s.levelId} (${pct(s.winRate)})`;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
}

function fmtR2(x: number): string {
  // Hold-out R² can legitimately be negative when the model generalizes
  // worse than predicting the mean — show the sign so that's visible.
  return x.toFixed(2);
}

function fmtPp(deltaWinRate: number): string {
  // Coefficient is in raw win-rate units; the digest reads in pp.
  const v = deltaWinRate * 100;
  const r = Math.abs(v) < 0.05 ? 0 : Math.round(v * 10) / 10;
  return r > 0 ? `+${r.toFixed(1)}pp` : `${r.toFixed(1)}pp`;
}

function narrate(
  f: { feature: string; stdCoef: number },
  tier: TierId,
): string {
  const v = f.stdCoef * 100;
  const sign = v >= 0 ? '+' : '';
  const r = Math.abs(v) < 0.05 ? 0 : Math.round(v * 10) / 10;
  return `each std-dev of ${f.feature} changes ${tier} win-rate by ${sign}${r.toFixed(1)}pp`;
}

// ─── Hypothesis Ledger ──────────────────────────────────────────────────────

const LEDGER_WINDOW_DAYS = 7;

function renderHypothesisLedger(input: DigestInput): string[] {
  const lines: string[] = [];
  lines.push(`## Hypothesis Ledger`);
  lines.push(``);
  lines.push(
    `The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at \`data/run-playtest/experiments.jsonl\`.`,
  );
  lines.push(``);

  const todays = input.hypothesisResults ?? [];
  lines.push(`**Last night (${todays.length} experiments)**`);
  lines.push(``);
  if (todays.length === 0) {
    lines.push(`_No experiments ran — see caveats._`);
    lines.push(``);
  } else {
    lines.push(`| Hypothesis | Mutation | Predicted | Actual | Verdict |`);
    lines.push(`|---|---|---:|---:|---|`);
    for (const e of todays) {
      const mut = describeMutation(e.mutation);
      lines.push(
        `| ${shorten(e.hypothesis, 80)} | ${mut} | ${pct(e.prediction.winRate)} | ${pct(e.actual.winRate)} | ${e.verdict} |`,
      );
    }
    lines.push(``);
  }

  // Aggregate over the last LEDGER_WINDOW_DAYS nights — covers a full week.
  const window = recentWindow(LEDGER_WINDOW_DAYS);
  const wins = window.filter((e) => e.verdict === 'confirmed').length;
  const fails = window.filter((e) => e.verdict === 'falsified').length;
  const incs = window.filter((e) => e.verdict === 'inconclusive').length;
  lines.push(
    `**Rolling ${LEDGER_WINDOW_DAYS}d:** confirmed: ${wins} · falsified: ${fails} · inconclusive: ${incs}`,
  );
  lines.push(``);

  // Model trajectory.
  if (input.publishResult) {
    const r = input.publishResult;
    const heldOut = r.heldOutR2;
    const prior = r.priorHeldOutR2;
    const verdict = r.published ? 'PUBLISHED' : 'kept';
    lines.push(
      `**Model trajectory:** ${verdict} v${r.version}${r.priorVersion ? ` (prior v${r.priorVersion})` : ''}. ${r.reason}`,
    );
    if (prior) {
      lines.push(``);
      lines.push(`| Tier | Prior R² | New R² | Δ |`);
      lines.push(`|---|---:|---:|---:|`);
      for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
        const p = prior[tier];
        const n = heldOut[tier];
        const d = n - p;
        lines.push(
          `| ${tier} | ${p.toFixed(2)} | ${n.toFixed(2)} | ${d >= 0 ? '+' : ''}${d.toFixed(2)} |`,
        );
      }
    }
    lines.push(``);
  }

  // Open mysteries: top drift-flagged levels from tonight's predictions.
  // We use the falsified experiments to surface levels worth re-investigating.
  const mysteries = topMysteries(todays, 3);
  if (mysteries.length > 0) {
    lines.push(`**Open mysteries (largest unexplained gap):**`);
    lines.push(``);
    for (const m of mysteries) {
      lines.push(
        `- \`${m.levelId}\` ${m.actual.tier}: predicted ${pct(m.prediction.winRate)}, actual ${pct(m.actual.winRate)} (Δ${pp(m.deltaPp)})`,
      );
    }
    lines.push(``);
  }

  return lines;
}

function recentWindow(days: number): Experiment[] {
  // WHY by-date: experiments.jsonl might contain records from many nights;
  // we want a precise "rolling N nights" cut.
  const all = readAllExperiments();
  const byD = byDate();
  void byD;
  const sortedDates = [...new Set(all.map((e) => e.date))].sort();
  const cutoff = sortedDates.slice(-days);
  const cutoffSet = new Set(cutoff);
  return all.filter((e) => cutoffSet.has(e.date));
}

function topMysteries(experiments: Experiment[], n: number): Experiment[] {
  return [...experiments]
    .sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp))
    .slice(0, n);
}

function shorten(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
}
