# Rookie's Run — Morning Digest

**Date:** 2026-05-13
**Sweep:** 20 trials × 110 levels × 3 tiers · **Ablation:** 10 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 77%** (range 0%–100%), **T4 90%**, **T5 95%**. No ability acts as a major crutch yet — bots don't lean on any one ability.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| bishops-path/0 | 100% | 100% | 100% | trivial | — | 6.0 |
| bishops-path/1 | 100% | 100% | 100% | trivial | — | 4.6 |
| bishops-path/2 | 100% | 100% | 100% | trivial | — | 4.0 |
| bishops-path/3 | 100% | 100% | 100% | trivial | — | 4.5 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 4.4 |
| bishops-path/5 | 100% | 100% | 100% | trivial | — | 3.7 |
| bishops-path/6 | 100% | 100% | 100% | trivial | — | 3.1 |
| bishops-path/7 | 100% | 100% | 100% | trivial | — | 4.3 |
| bishops-path/8 | 45% | 100% | 100% | fun-hard | bishop | 6.5 |
| bishops-path/9 | 35% | 100% | 100% | normal | queen | 3.4 |
| boss-gauntlet/0 | 100% | 100% | 100% | trivial | — | 3.8 |
| boss-gauntlet/1 | 100% | 100% | 100% | trivial | — | 2.9 |
| boss-gauntlet/2 | 100% | 100% | 100% | trivial | — | 5.2 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 5.1 |
| boss-gauntlet/4 | 100% | 100% | 100% | trivial | — | 3.0 |
| boss-gauntlet/5 | 100% | 100% | 100% | trivial | — | 3.9 |
| boss-gauntlet/6 | 100% | 100% | 100% | trivial | — | 2.9 |
| boss-gauntlet/7 | 100% | 100% | 100% | trivial | — | 3.1 |
| boss-gauntlet/8 | 85% | 100% | 100% | normal | queen | 2.5 |
| boss-gauntlet/9 | 20% | 100% | 100% | normal | queen | 2.0 |
| crossfire/0 | 100% | 100% | 100% | trivial | — | 2.7 |
| crossfire/1 | 100% | 100% | 100% | trivial | — | 3.0 |
| crossfire/2 | 90% | 100% | 100% | trivial | bishop | 3.4 |
| crossfire/3 | 15% | 100% | 100% | normal | bishop | 3.7 |
| crossfire/4 | 55% | 100% | 100% | fun-hard | bishop | 3.4 |
| crossfire/5 | 45% | 100% | 100% | fun-hard | bishop | 5.5 |
| crossfire/6 | 30% | 100% | 100% | normal | bishop | 7.8 |
| crossfire/7 | 100% | 100% | 100% | trivial | — | 3.1 |
| crossfire/8 | 20% | 0% | 90% | punishing | bishop | 3.4 |
| crossfire/9 | 25% | 100% | 100% | normal | queen | 2.0 |
| daily/0 | 100% | 100% | 100% | trivial | — | 7.7 |
| daily/1 | 95% | 100% | 100% | trivial | pawn | 7.8 |
| daily/2 | 100% | 100% | 100% | trivial | — | 7.4 |
| daily/3 | 100% | 100% | 100% | trivial | — | 4.5 |
| daily/4 | 100% | 100% | 100% | trivial | — | 4.4 |
| daily/5 | 95% | 100% | 100% | trivial | knight | 5.0 |
| daily/6 | 100% | 100% | 100% | trivial | — | 4.2 |
| daily/7 | 100% | 100% | 100% | trivial | — | 5.5 |
| daily/8 | 100% | 100% | 100% | trivial | — | 5.3 |
| daily/9 | 100% | 100% | 100% | trivial | — | 3.3 |
| hazard-maze/0 | 100% | 100% | 100% | trivial | — | 6.6 |
| hazard-maze/1 | 100% | 100% | 100% | trivial | — | 4.2 |
| hazard-maze/2 | 80% | 100% | 100% | normal | pawn | 4.7 |
| hazard-maze/3 | 100% | 100% | 100% | trivial | — | 6.5 |
| hazard-maze/4 | 100% | 100% | 100% | trivial | — | 4.2 |
| hazard-maze/5 | 100% | 100% | 100% | trivial | — | 4.5 |
| hazard-maze/6 | 95% | 100% | 100% | trivial | queen | 6.5 |
| hazard-maze/7 | 100% | 100% | 100% | trivial | — | 2.5 |
| hazard-maze/8 | 55% | 100% | 100% | fun-hard | queen | 6.0 |
| hazard-maze/9 | 30% | 50% | 100% | normal | queen | 7.8 |
| hornets-nest/0 | 100% | 100% | 100% | trivial | — | 3.2 |
| hornets-nest/1 | 100% | 100% | 100% | trivial | — | 3.5 |
| hornets-nest/2 | 100% | 100% | 100% | trivial | — | 2.0 |
| hornets-nest/3 | 25% | 100% | 100% | normal | knight | 4.9 |
| hornets-nest/4 | 65% | 90% | 100% | fun-hard | queen | 7.0 |
| hornets-nest/5 | 35% | 65% | 100% | normal | knight | 7.4 |
| hornets-nest/6 | 100% | 100% | 100% | trivial | — | 3.9 |
| hornets-nest/7 | 40% | 100% | 100% | normal | knight | 3.5 |
| hornets-nest/8 | 100% | 100% | 100% | trivial | — | 2.4 |
| hornets-nest/9 | 90% | 100% | 100% | trivial | pawn | 3.6 |
| iron-curtain/0 | 100% | 100% | 100% | trivial | — | 3.4 |
| iron-curtain/1 | 100% | 100% | 100% | trivial | — | 4.0 |
| iron-curtain/2 | 100% | 100% | 100% | trivial | — | 4.3 |
| iron-curtain/3 | 85% | 100% | 100% | normal | knight | 4.4 |
| iron-curtain/4 | 85% | 100% | 100% | normal | queen | 3.9 |
| iron-curtain/5 | 30% | 100% | 100% | normal | queen | 3.5 |
| iron-curtain/6 | 80% | 100% | 100% | normal | queen | 4.0 |
| iron-curtain/7 | 45% | 100% | 100% | fun-hard | queen | 3.0 |
| iron-curtain/8 | 35% | 35% | 100% | normal | queen | 5.2 |
| iron-curtain/9 | 10% | 35% | 20% | broken (T5 still struggles) | queen | 7.7 |
| knight-academy/0 | 100% | 100% | 100% | trivial | — | 8.0 |
| knight-academy/1 | 100% | 100% | 100% | trivial | — | 3.6 |
| knight-academy/2 | 100% | 100% | 100% | trivial | — | 5.5 |
| knight-academy/3 | 100% | 100% | 100% | trivial | — | 3.8 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 2.6 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 3.2 |
| knight-academy/6 | 100% | 100% | 100% | trivial | — | 3.5 |
| knight-academy/7 | 85% | 100% | 100% | normal | knight | 3.3 |
| knight-academy/8 | 100% | 100% | 100% | trivial | — | 3.1 |
| knight-academy/9 | 5% | 30% | 100% | tactical (T5 only) | queen | 5.0 |
| royal-court/0 | 100% | 100% | 100% | trivial | — | 3.4 |
| royal-court/1 | 100% | 100% | 100% | trivial | — | 3.1 |
| royal-court/2 | 60% | 100% | 100% | fun-hard | queen | 4.0 |
| royal-court/3 | 100% | 100% | 100% | trivial | — | 3.0 |
| royal-court/4 | 75% | 100% | 100% | normal | queen | 7.4 |
| royal-court/5 | 60% | 100% | 100% | fun-hard | queen | 5.7 |
| royal-court/6 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 1.3 |
| royal-court/7 | 0% | 80% | 100% | tactical (T5 only) | queen | 7.3 |
| royal-court/8 | 45% | 100% | 100% | fun-hard | queen | 3.0 |
| royal-court/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 4.0 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 5.8 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 4.6 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 4.3 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 6.5 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 4.8 |
| speed-demon/5 | 100% | 100% | 100% | trivial | — | 4.0 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 2.3 |
| speed-demon/7 | 100% | 100% | 100% | trivial | — | 3.9 |
| speed-demon/8 | 100% | 100% | 100% | trivial | — | 2.7 |
| speed-demon/9 | 85% | 100% | 100% | normal | queen | 3.5 |
| the-gauntlet/0 | 100% | 100% | 100% | trivial | — | 3.3 |
| the-gauntlet/1 | 100% | 100% | 100% | trivial | — | 3.2 |
| the-gauntlet/2 | 0% | 100% | 100% | tactical (T5 only) | queen | 3.8 |
| the-gauntlet/3 | 75% | 100% | 100% | normal | bishop | 4.5 |
| the-gauntlet/4 | 10% | 5% | 15% | broken (T5 still struggles) | queen | 4.8 |
| the-gauntlet/5 | 100% | 95% | 100% | trivial | knight | 3.6 |
| the-gauntlet/6 | 30% | 15% | 100% | normal | queen | 7.0 |
| the-gauntlet/7 | 5% | 10% | 80% | punishing | knight | 5.2 |
| the-gauntlet/8 | 15% | 5% | 20% | broken (T5 still struggles) | queen | 4.5 |
| the-gauntlet/9 | 10% | 0% | 15% | broken (T5 still struggles) | queen | 7.8 |

## Outliers

**T3 hardest:** royal-court/6 (0%) · royal-court/7 (0%) · royal-court/9 (0%)

**T3 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T4 hardest:** crossfire/8 (0%) · royal-court/6 (0%) · royal-court/9 (0%)

**T4 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T5 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/4 (15%)

**T5 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 42% | 0% | 0% |
| T4 | 15% | 0% | 0% |
| T5 | 7% | 0% | 0% |

## Ability Impact (run-level)

Each ability force-seeded at T3 for every level of a 10-level run on **the-gauntlet**. Bot = T3 Casual. Compared to a no-ability baseline. **Mean levels** = how far through the run that ability gets the bot. **Full-run rate** = % of trials that completed all 10 levels.

**Baseline (no preowned ability)**: mean **2.00** levels (median 2) · full-run rate 0%.

| Rank | Ability | Mean levels | Δ vs baseline | Full-run rate |
|---|---|---:|---:|---:|
| 1 | Detonate | 10.00 | +8.00 | 100% |
| 2 | Aegis | 6.80 | +4.80 | 60% |
| 3 | Surge | 4.80 | +2.80 | 0% |
| 4 | Queen Pulse | 4.20 | +2.20 | 0% |
| 5 | Phase Step | 3.60 | +1.60 | 20% |
| 6 | Pawn Charge | 3.00 | +1.00 | 0% |
| 7 | Knight Hop | 2.80 | +0.80 | 0% |
| 8 | Bishop Step | 2.60 | +0.60 | 0% |
| 9 | Queenkiller | 2.40 | +0.40 | 0% |
| 10 | Leap | 2.00 | 0.00 | 0% |
| 11 | Freeze Ray | 1.60 | -0.40 | 0% |

## Current Abilities Ranked (ablation, secondary view)

Power score weights absolute deltas by tier (T3=2.0, T4=1.5, T5=1.0) — abilities that help beginners rank higher. **Character** is a one-line interpretation of the curve.

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Bishop Step | 2.6 | -1pp | 0pp | +1pp | Quiet — negligible impact |
| 2 | Leap | 2.6 | -1pp | -1pp | 0pp | Quiet — negligible impact |
| 3 | Pawn Charge | 2.3 | +1pp | +1pp | 0pp | Quiet — negligible impact |
| 4 | Freeze Ray | 2.3 | -1pp | -1pp | 0pp | Quiet — negligible impact |
| 5 | Detonate | 1.8 | 0pp | 0pp | +1pp | Quiet — negligible impact |
| 6 | Knight Hop | 1.8 | +1pp | 0pp | +1pp | Quiet — negligible impact |
| 7 | Phase Step | 1.8 | -1pp | 0pp | +1pp | Quiet — negligible impact |
| 8 | Aegis | 1.4 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 9 | Queenkiller | 1.2 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 10 | Queen Pulse | 0.9 | 0pp | +1pp | 0pp | Quiet — negligible impact |
| 11 | Surge | 0.8 | 0pp | 0pp | 0pp | Quiet — negligible impact |

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|
| Bishop Step | -1pp | 0pp | +1pp | trash — no effect |
| Freeze Ray | -1pp | -1pp | 0pp | trash — no effect |
| Leap | -1pp | -1pp | 0pp | trash — no effect |
| Phase Step | -1pp | 0pp | +1pp | trash — no effect |
| Surge | 0pp | 0pp | 0pp | trash — no effect |
| Aegis | 0pp | 0pp | 0pp | trash — no effect |
| Detonate | 0pp | 0pp | +1pp | trash — no effect |
| Queen Pulse | 0pp | +1pp | 0pp | trash — no effect |
| Queenkiller | 0pp | 0pp | 0pp | trash — no effect |
| Knight Hop | +1pp | 0pp | +1pp | trash — no effect |
| Pawn Charge | +1pp | +1pp | 0pp | trash — no effect |

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.65 | 44% | 100% |
| threatDensity | -0.61 | 50% | 99% |
| chokePointCount | -0.60 | 47% | 99% |
| pieceCount | -0.58 | 46% | 95% |
| density | -0.58 | 46% | 95% |
| enemiesPerTurn | -0.57 | 48% | 100% |
| queenCount | -0.56 | 51% | 97% |
| hazardCount | -0.54 | 55% | 100% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.56 | 66% | 100% |
| pieceCount | -0.54 | 66% | 98% |
| density | -0.54 | 66% | 98% |
| queenCount | -0.53 | 68% | 100% |
| chokePointCount | -0.49 | 68% | 100% |
| enemiesPerTurn | -0.48 | 66% | 100% |
| minLegalDistance | -0.48 | 63% | 100% |
| threatDensity | -0.43 | 69% | 100% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| queenCount | -0.55 | 80% | 100% |
| defendedPieces | -0.52 | 79% | 100% |
| pieceCount | -0.51 | 79% | 100% |
| density | -0.51 | 79% | 100% |
| chokePointCount | -0.44 | 82% | 100% |
| enemiesPerTurn | -0.36 | 79% | 100% |
| minLegalDistance | -0.35 | 79% | 100% |
| threatDensity | -0.35 | 82% | 100% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.61 · hold-out R² 0.61 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| openFiles | +12.5pp | each std-dev of openFiles changes T3 win-rate by +12.5pp |
| pawnCount | +10.6pp | each std-dev of pawnCount changes T3 win-rate by +10.6pp |
| chokePointCount | -10.5pp | each std-dev of chokePointCount changes T3 win-rate by -10.5pp |
| bishopCount | -9.8pp | each std-dev of bishopCount changes T3 win-rate by -9.8pp |
| enemiesPerTurn | +9.6pp | each std-dev of enemiesPerTurn changes T3 win-rate by +9.6pp |

**T4** — train R² 0.48 · hold-out R² 0.44 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +16.0pp | each std-dev of threatDensity changes T4 win-rate by +16.0pp |
| queenCount | -11.1pp | each std-dev of queenCount changes T4 win-rate by -11.1pp |
| pawnCount | +8.3pp | each std-dev of pawnCount changes T4 win-rate by +8.3pp |
| defendedPieces | -6.2pp | each std-dev of defendedPieces changes T4 win-rate by -6.2pp |
| chokePointCount | -5.0pp | each std-dev of chokePointCount changes T4 win-rate by -5.0pp |

**T5** — train R² 0.46 · hold-out R² 0.33 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +15.7pp | each std-dev of threatDensity changes T5 win-rate by +15.7pp |
| moveLimitTightness | +7.9pp | each std-dev of moveLimitTightness changes T5 win-rate by +7.9pp |
| moveLimit | -7.4pp | each std-dev of moveLimit changes T5 win-rate by -7.4pp |
| queenCount | -7.3pp | each std-dev of queenCount changes T5 win-rate by -7.3pp |
| defendedPieces | -6.3pp | each std-dev of defendedPieces changes T5 win-rate by -6.3pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (1 experiments)**

| Hypothesis | Mutation | Predicted | Actual | Verdict |
|---|---|---:|---:|---|
| Stressing feature "moveLimitTightness" via moveLimit=12 on daily/0 should push … | moveLimit=12 | 100% | 90% | inconclusive |

**Rolling 7d:** confirmed: 3 · falsified: 3 · inconclusive: 3

**Model trajectory:** kept v1 (prior v1). Only beat prior on 1/3 tiers (need ≥2). T3: 0.62→0.61 (Δ-0.01) · T4: 0.35→0.44 (Δ+0.09) · T5: 0.40→0.33 (Δ-0.07)

| Tier | Prior R² | New R² | Δ |
|---|---:|---:|---:|
| T3 | 0.62 | 0.61 | -0.01 |
| T4 | 0.35 | 0.44 | +0.09 |
| T5 | 0.40 | 0.33 | -0.07 |

**Open mysteries (largest unexplained gap):**

- `daily/0` T3: predicted 100%, actual 90% (Δ-10pp)

## Methodology

- **T3 Casual** — 1-ply lookahead, "don't blunder, advance, take free captures." Mild move-selection noise.
- **T4 Sharp** — 2-ply minimax over the same eval. Lower noise.
- **T5 Expert v0.1** — 3-ply minimax, deterministic argmax. Same eval as T4 (ability-aware planner is a future upgrade).
- All bots take offers reactively and tap Aegis when threatened. Most other abilities are enumerated as concrete candidate moves and scored by eval. Bots do NOT plan multi-step ability combos.
- Rookie starts on file 4 (d1) for every sim — date-independent for stable comparisons.
- Seeds are deterministic per `levelId__tier__trial`.

### Caveats

- Forced-take skipped this run.
- Pair-combos skipped this run.
