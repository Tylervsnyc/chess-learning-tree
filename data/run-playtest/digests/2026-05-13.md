# Rookie's Run — Morning Digest

**Date:** 2026-05-13
**Sweep:** 150 trials × 110 levels × 3 tiers · **Ablation:** 80 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 68%** (range 0%–100%), **T4 89%**, **T5 94%**. No ability acts as a major crutch yet — bots don't lean on any one ability.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| bishops-path/0 | 100% | 100% | 100% | trivial | — | 5.3 |
| bishops-path/1 | 99% | 100% | 100% | trivial | knight | 4.1 |
| bishops-path/2 | 100% | 100% | 100% | trivial | — | 5.5 |
| bishops-path/3 | 100% | 100% | 100% | trivial | — | 5.1 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 4.4 |
| bishops-path/5 | 98% | 100% | 100% | trivial | bishop | 3.7 |
| bishops-path/6 | 98% | 100% | 100% | trivial | queen | 3.4 |
| bishops-path/7 | 81% | 100% | 100% | normal | bishop | 3.8 |
| bishops-path/8 | 47% | 100% | 100% | fun-hard | bishop | 6.7 |
| bishops-path/9 | 6% | 100% | 100% | tactical (T5 only) | queen | 3.1 |
| boss-gauntlet/0 | 100% | 100% | 100% | trivial | — | 3.8 |
| boss-gauntlet/1 | 64% | 100% | 100% | fun-hard | bishop | 3.3 |
| boss-gauntlet/2 | 95% | 100% | 100% | trivial | pawn | 4.9 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 4.7 |
| boss-gauntlet/4 | 92% | 100% | 100% | trivial | queen | 3.2 |
| boss-gauntlet/5 | 99% | 100% | 100% | trivial | queen | 4.3 |
| boss-gauntlet/6 | 76% | 100% | 100% | normal | queen | 3.1 |
| boss-gauntlet/7 | 55% | 100% | 100% | fun-hard | queen | 2.9 |
| boss-gauntlet/8 | 57% | 100% | 100% | fun-hard | queen | 2.5 |
| boss-gauntlet/9 | 0% | 100% | 100% | tactical (T5 only) | queen | 2.0 |
| crossfire/0 | 99% | 100% | 100% | trivial | bishop | 2.9 |
| crossfire/1 | 99% | 100% | 100% | trivial | bishop | 3.2 |
| crossfire/2 | 81% | 89% | 100% | normal | bishop | 4.6 |
| crossfire/3 | 27% | 98% | 100% | normal | bishop | 7.1 |
| crossfire/4 | 35% | 100% | 100% | normal | bishop | 3.1 |
| crossfire/5 | 47% | 92% | 100% | fun-hard | bishop | 6.7 |
| crossfire/6 | 25% | 99% | 100% | normal | knight | 7.9 |
| crossfire/7 | 97% | 100% | 100% | trivial | knight | 3.2 |
| crossfire/8 | 7% | 6% | 53% | punishing | bishop | 3.6 |
| crossfire/9 | 1% | 100% | 100% | tactical (T5 only) | bishop | 2.0 |
| daily/0 | 91% | 100% | 100% | trivial | pawn | 10.1 |
| daily/1 | 83% | 100% | 100% | normal | pawn | 13.7 |
| daily/2 | 100% | 100% | 100% | trivial | — | 6.1 |
| daily/3 | 71% | 100% | 100% | normal | knight | 4.3 |
| daily/4 | 98% | 100% | 100% | trivial | queen | 4.2 |
| daily/5 | 93% | 100% | 100% | trivial | knight | 5.3 |
| daily/6 | 100% | 100% | 100% | trivial | — | 4.0 |
| daily/7 | 100% | 100% | 100% | trivial | — | 5.4 |
| daily/8 | 79% | 100% | 100% | normal | bishop | 5.0 |
| daily/9 | 89% | 100% | 98% | trivial | queen | 3.2 |
| hazard-maze/0 | 100% | 100% | 100% | trivial | — | 7.1 |
| hazard-maze/1 | 99% | 100% | 100% | trivial | knight | 4.3 |
| hazard-maze/2 | 83% | 100% | 100% | normal | pawn | 6.2 |
| hazard-maze/3 | 99% | 100% | 100% | trivial | pawn | 5.1 |
| hazard-maze/4 | 71% | 100% | 100% | normal | pawn | 4.0 |
| hazard-maze/5 | 62% | 100% | 100% | fun-hard | knight | 5.0 |
| hazard-maze/6 | 92% | 100% | 100% | trivial | knight | 7.8 |
| hazard-maze/7 | 73% | 100% | 100% | normal | queen | 2.8 |
| hazard-maze/8 | 33% | 100% | 100% | normal | queen | 5.8 |
| hazard-maze/9 | 22% | 25% | 59% | punishing | queen | 6.3 |
| hornets-nest/0 | 99% | 100% | 100% | trivial | knight | 3.9 |
| hornets-nest/1 | 99% | 100% | 100% | trivial | knight | 3.3 |
| hornets-nest/2 | 73% | 100% | 100% | normal | knight | 2.0 |
| hornets-nest/3 | 27% | 58% | 100% | punishing | knight | 6.9 |
| hornets-nest/4 | 55% | 70% | 100% | fun-hard | knight | 7.5 |
| hornets-nest/5 | 7% | 80% | 100% | tactical (T5 only) | knight | 8.8 |
| hornets-nest/6 | 94% | 100% | 100% | trivial | knight | 3.9 |
| hornets-nest/7 | 18% | 99% | 100% | normal | pawn | 4.4 |
| hornets-nest/8 | 29% | 100% | 100% | normal | knight | 2.7 |
| hornets-nest/9 | 55% | 100% | 100% | fun-hard | knight | 3.7 |
| iron-curtain/0 | 100% | 100% | 100% | trivial | — | 3.2 |
| iron-curtain/1 | 95% | 100% | 100% | trivial | knight | 4.0 |
| iron-curtain/2 | 91% | 100% | 100% | trivial | knight | 4.5 |
| iron-curtain/3 | 85% | 100% | 100% | normal | knight | 9.5 |
| iron-curtain/4 | 39% | 96% | 100% | normal | queen | 6.2 |
| iron-curtain/5 | 27% | 96% | 100% | normal | knight | 7.7 |
| iron-curtain/6 | 73% | 91% | 91% | normal | queen | 5.9 |
| iron-curtain/7 | 57% | 100% | 100% | fun-hard | queen | 3.0 |
| iron-curtain/8 | 13% | 41% | 77% | punishing | queen | 5.8 |
| iron-curtain/9 | 1% | 21% | 58% | punishing | queen | 5.6 |
| knight-academy/0 | 87% | 100% | 100% | trivial | knight | 10.4 |
| knight-academy/1 | 98% | 100% | 100% | trivial | pawn | 4.2 |
| knight-academy/2 | 99% | 100% | 100% | trivial | knight | 4.5 |
| knight-academy/3 | 99% | 100% | 100% | trivial | knight | 4.6 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 2.2 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 2.9 |
| knight-academy/6 | 99% | 100% | 100% | trivial | queen | 3.6 |
| knight-academy/7 | 69% | 100% | 100% | fun-hard | knight | 2.9 |
| knight-academy/8 | 5% | 100% | 100% | tactical (T5 only) | knight | 3.4 |
| knight-academy/9 | 42% | 35% | 100% | fun-hard | knight | 6.5 |
| royal-court/0 | 100% | 100% | 100% | trivial | — | 3.2 |
| royal-court/1 | 95% | 100% | 100% | trivial | queen | 3.3 |
| royal-court/2 | 45% | 100% | 100% | fun-hard | queen | 6.0 |
| royal-court/3 | 55% | 100% | 100% | fun-hard | queen | 3.5 |
| royal-court/4 | 40% | 100% | 100% | normal | queen | 5.0 |
| royal-court/5 | 69% | 100% | 100% | fun-hard | queen | 5.7 |
| royal-court/6 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 1.3 |
| royal-court/7 | 5% | 35% | 100% | tactical (T5 only) | queen | 6.0 |
| royal-court/8 | 43% | 100% | 100% | fun-hard | queen | 3.0 |
| royal-court/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 4.1 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 5.6 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 4.6 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 4.0 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 5.5 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 4.8 |
| speed-demon/5 | 100% | 100% | 100% | trivial | — | 4.4 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 2.7 |
| speed-demon/7 | 96% | 100% | 100% | trivial | queen | 4.7 |
| speed-demon/8 | 73% | 100% | 100% | normal | bishop | 2.8 |
| speed-demon/9 | 71% | 100% | 100% | normal | queen | 2.9 |
| the-gauntlet/0 | 85% | 100% | 100% | normal | knight | 3.0 |
| the-gauntlet/1 | 100% | 100% | 100% | trivial | — | 3.3 |
| the-gauntlet/2 | 8% | 42% | 100% | tactical (T5 only) | bishop | 4.2 |
| the-gauntlet/3 | 59% | 40% | 100% | fun-hard | knight | 5.2 |
| the-gauntlet/4 | 1% | 12% | 26% | broken (T5 still struggles) | knight | 4.9 |
| the-gauntlet/5 | 98% | 95% | 100% | trivial | knight | 6.5 |
| the-gauntlet/6 | 23% | 44% | 100% | punishing | knight | 4.6 |
| the-gauntlet/7 | 0% | 92% | 69% | normal | knight | 8.6 |
| the-gauntlet/8 | 23% | 7% | 20% | broken (T5 still struggles) | queen | 6.0 |
| the-gauntlet/9 | 2% | 1% | 13% | broken (T5 still struggles) | queen | 6.9 |

## Outliers

**T3 hardest:** boss-gauntlet/9 (0%) · royal-court/6 (0%) · royal-court/9 (0%)

**T3 easiest:** bishops-path/0 (100%) · bishops-path/2 (100%) · bishops-path/3 (100%)

**T4 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/9 (1%)

**T4 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T5 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/9 (13%)

**T5 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 78% | 2% | 0% |
| T4 | 24% | 0% | 0% |
| T5 | 11% | 0% | 0% |

## Current Abilities Ranked

Power score weights absolute deltas by tier (T3=2.0, T4=1.5, T5=1.0) — abilities that help beginners rank higher. **Character** is a one-line interpretation of the curve.

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Phase Step | 1.4 | -1pp | 0pp | 0pp | Quiet — negligible impact |
| 2 | Queen Pulse | 1.4 | -1pp | 0pp | 0pp | Quiet — negligible impact |
| 3 | Detonate | 1.3 | -1pp | 0pp | 0pp | Quiet — negligible impact |
| 4 | Surge | 1.1 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 5 | Knight Hop | 1.1 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 6 | Aegis | 0.9 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 7 | Leap | 0.8 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 8 | Pawn Charge | 0.7 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 9 | Queenkiller | 0.7 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 10 | Freeze Ray | 0.6 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 11 | Bishop Step | 0.6 | 0pp | 0pp | 0pp | Quiet — negligible impact |

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|
| Queen Pulse | -1pp | 0pp | 0pp | trash — no effect |
| Detonate | -1pp | 0pp | 0pp | trash — no effect |
| Phase Step | -1pp | 0pp | 0pp | trash — no effect |
| Surge | 0pp | 0pp | 0pp | trash — no effect |
| Aegis | 0pp | 0pp | 0pp | trash — no effect |
| Knight Hop | 0pp | 0pp | 0pp | trash — no effect |
| Queenkiller | 0pp | 0pp | 0pp | trash — no effect |
| Leap | 0pp | 0pp | 0pp | trash — no effect |
| Pawn Charge | 0pp | 0pp | 0pp | trash — no effect |
| Bishop Step | 0pp | 0pp | 0pp | trash — no effect |
| Freeze Ray | 0pp | 0pp | 0pp | trash — no effect |

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| threatDensity | -0.67 | 36% | 94% |
| defendedPieces | -0.66 | 33% | 93% |
| enemiesPerTurn | -0.65 | 36% | 97% |
| chokePointCount | -0.64 | 35% | 94% |
| hazardCount | -0.62 | 46% | 95% |
| hazardsInApproach | -0.62 | 46% | 95% |
| queenCount | -0.57 | 39% | 89% |
| pieceCount | -0.54 | 35% | 86% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.56 | 65% | 100% |
| queenCount | -0.53 | 69% | 100% |
| pieceCount | -0.53 | 64% | 97% |
| density | -0.53 | 64% | 97% |
| chokePointCount | -0.49 | 71% | 100% |
| enemiesPerTurn | -0.48 | 64% | 100% |
| threatDensity | -0.43 | 71% | 100% |
| hazardCount | -0.42 | 71% | 100% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| queenCount | -0.58 | 79% | 100% |
| defendedPieces | -0.54 | 78% | 100% |
| pieceCount | -0.52 | 78% | 98% |
| density | -0.52 | 78% | 98% |
| chokePointCount | -0.47 | 81% | 100% |
| minLegalDistance | -0.40 | 77% | 100% |
| enemiesPerTurn | -0.39 | 78% | 100% |
| threatDensity | -0.39 | 79% | 100% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.67 · hold-out R² 0.55 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| approachWidth | -7.1pp | each std-dev of approachWidth changes T3 win-rate by -7.1pp |
| moveLimit | +6.8pp | each std-dev of moveLimit changes T3 win-rate by +6.8pp |
| moveLimitTightness | -6.1pp | each std-dev of moveLimitTightness changes T3 win-rate by -6.1pp |
| queenCount | -5.8pp | each std-dev of queenCount changes T3 win-rate by -5.8pp |
| minLegalDistance | -5.4pp | each std-dev of minLegalDistance changes T3 win-rate by -5.4pp |

**T4** — train R² 0.50 · hold-out R² 0.35 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +13.0pp | each std-dev of threatDensity changes T4 win-rate by +13.0pp |
| openFiles | +12.1pp | each std-dev of openFiles changes T4 win-rate by +12.1pp |
| queenCount | -11.3pp | each std-dev of queenCount changes T4 win-rate by -11.3pp |
| pawnCount | +7.6pp | each std-dev of pawnCount changes T4 win-rate by +7.6pp |
| defendedPieces | -7.3pp | each std-dev of defendedPieces changes T4 win-rate by -7.3pp |

**T5** — train R² 0.49 · hold-out R² 0.39 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +13.0pp | each std-dev of threatDensity changes T5 win-rate by +13.0pp |
| moveLimitTightness | +11.0pp | each std-dev of moveLimitTightness changes T5 win-rate by +11.0pp |
| moveLimit | -10.1pp | each std-dev of moveLimit changes T5 win-rate by -10.1pp |
| queenCount | -7.7pp | each std-dev of queenCount changes T5 win-rate by -7.7pp |
| defendedPieces | -4.7pp | each std-dev of defendedPieces changes T5 win-rate by -4.7pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (3 experiments)**

| Hypothesis | Mutation | Predicted | Actual | Verdict |
|---|---|---:|---:|---|
| Stressing feature "moveLimitTightness" via moveLimit=12 on daily/0 should push … | moveLimit=12 | 100% | 35% | falsified |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T4 win-ra… | +pawn@d3 | 97% | 100% | confirmed |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T5 win-ra… | +pawn@d3 | 93% | 100% | inconclusive |

**Rolling 7d:** confirmed: 3 · falsified: 3 · inconclusive: 2

**Model trajectory:** kept v1 (prior v1). Only beat prior on 1/3 tiers (need ≥2). T3: 0.62→0.55 (Δ-0.07) · T4: 0.35→0.35 (Δ+0.00) · T5: 0.40→0.39 (Δ-0.01)

| Tier | Prior R² | New R² | Δ |
|---|---:|---:|---:|
| T3 | 0.62 | 0.55 | -0.07 |
| T4 | 0.35 | 0.35 | +0.00 |
| T5 | 0.40 | 0.39 | -0.01 |

**Open mysteries (largest unexplained gap):**

- `daily/0` T3: predicted 100%, actual 35% (Δ-65pp)
- `daily/0` T5: predicted 93%, actual 100% (Δ+7pp)
- `daily/0` T4: predicted 97%, actual 100% (Δ+3pp)

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
