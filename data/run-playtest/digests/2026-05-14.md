# Rookie's Run — Morning Digest

**Date:** 2026-05-14
**Sweep:** 200 trials × 110 levels × 3 tiers · **Ablation:** 120 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 78%** (range 0%–100%), **T4 90%**, **T5 95%**. No ability acts as a major crutch yet — bots don't lean on any one ability.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| bishops-path/0 | 100% | 100% | 100% | trivial | — | 5.6 |
| bishops-path/1 | 100% | 100% | 100% | trivial | — | 4.2 |
| bishops-path/2 | 100% | 100% | 100% | trivial | — | 5.3 |
| bishops-path/3 | 100% | 100% | 100% | trivial | — | 5.3 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 4.2 |
| bishops-path/5 | 100% | 100% | 100% | trivial | — | 4.2 |
| bishops-path/6 | 100% | 100% | 100% | trivial | — | 3.4 |
| bishops-path/7 | 100% | 100% | 100% | trivial | — | 3.5 |
| bishops-path/8 | 49% | 100% | 100% | fun-hard | bishop | 6.6 |
| bishops-path/9 | 37% | 100% | 100% | normal | queen | 3.2 |
| boss-gauntlet/0 | 100% | 100% | 100% | trivial | — | 3.9 |
| boss-gauntlet/1 | 100% | 100% | 100% | trivial | — | 3.3 |
| boss-gauntlet/2 | 100% | 100% | 100% | trivial | — | 5.0 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 5.0 |
| boss-gauntlet/4 | 100% | 100% | 100% | trivial | — | 3.2 |
| boss-gauntlet/5 | 100% | 100% | 100% | trivial | — | 3.6 |
| boss-gauntlet/6 | 100% | 100% | 100% | trivial | — | 3.1 |
| boss-gauntlet/7 | 100% | 100% | 100% | trivial | — | 3.0 |
| boss-gauntlet/8 | 72% | 100% | 100% | normal | queen | 2.5 |
| boss-gauntlet/9 | 11% | 100% | 100% | tactical (T5 only) | queen | 2.0 |
| crossfire/0 | 100% | 100% | 100% | trivial | — | 2.9 |
| crossfire/1 | 100% | 100% | 100% | trivial | — | 3.2 |
| crossfire/2 | 86% | 100% | 100% | trivial | bishop | 3.4 |
| crossfire/3 | 27% | 100% | 100% | normal | bishop | 3.5 |
| crossfire/4 | 62% | 100% | 100% | fun-hard | bishop | 3.1 |
| crossfire/5 | 52% | 94% | 100% | fun-hard | bishop | 5.4 |
| crossfire/6 | 40% | 100% | 100% | normal | knight | 7.7 |
| crossfire/7 | 100% | 100% | 100% | trivial | — | 3.2 |
| crossfire/8 | 19% | 5% | 91% | punishing | bishop | 3.5 |
| crossfire/9 | 42% | 100% | 100% | fun-hard | bishop | 2.0 |
| daily/0 | 100% | 100% | 100% | trivial | pawn | 8.5 |
| daily/1 | 95% | 100% | 100% | trivial | pawn | 7.8 |
| daily/2 | 100% | 100% | 100% | trivial | — | 6.5 |
| daily/3 | 100% | 100% | 100% | trivial | — | 4.2 |
| daily/4 | 100% | 100% | 100% | trivial | — | 4.0 |
| daily/5 | 96% | 100% | 100% | trivial | pawn | 5.4 |
| daily/6 | 100% | 100% | 100% | trivial | — | 4.0 |
| daily/7 | 100% | 100% | 100% | trivial | — | 5.2 |
| daily/8 | 90% | 100% | 100% | trivial | queen | 5.2 |
| daily/9 | 87% | 100% | 100% | trivial | queen | 3.2 |
| hazard-maze/0 | 100% | 100% | 100% | trivial | — | 6.4 |
| hazard-maze/1 | 100% | 100% | 100% | trivial | — | 4.1 |
| hazard-maze/2 | 86% | 100% | 100% | trivial | knight | 4.9 |
| hazard-maze/3 | 97% | 100% | 100% | trivial | pawn | 5.9 |
| hazard-maze/4 | 100% | 100% | 100% | trivial | — | 4.0 |
| hazard-maze/5 | 100% | 100% | 100% | trivial | — | 4.5 |
| hazard-maze/6 | 92% | 100% | 100% | trivial | knight | 6.5 |
| hazard-maze/7 | 100% | 100% | 100% | trivial | — | 2.8 |
| hazard-maze/8 | 53% | 100% | 100% | fun-hard | queen | 6.0 |
| hazard-maze/9 | 30% | 42% | 100% | punishing | queen | 6.6 |
| hornets-nest/0 | 100% | 100% | 100% | trivial | — | 3.9 |
| hornets-nest/1 | 100% | 100% | 100% | trivial | — | 3.4 |
| hornets-nest/2 | 100% | 100% | 100% | trivial | — | 2.0 |
| hornets-nest/3 | 34% | 100% | 100% | normal | knight | 5.1 |
| hornets-nest/4 | 54% | 97% | 100% | fun-hard | knight | 7.3 |
| hornets-nest/5 | 27% | 53% | 100% | punishing | knight | 6.5 |
| hornets-nest/6 | 100% | 100% | 100% | trivial | knight | 3.8 |
| hornets-nest/7 | 51% | 100% | 100% | fun-hard | knight | 4.3 |
| hornets-nest/8 | 99% | 100% | 100% | trivial | knight | 2.8 |
| hornets-nest/9 | 87% | 100% | 100% | trivial | knight | 3.6 |
| iron-curtain/0 | 100% | 100% | 100% | trivial | — | 3.3 |
| iron-curtain/1 | 98% | 100% | 100% | trivial | knight | 3.9 |
| iron-curtain/2 | 97% | 100% | 100% | trivial | knight | 4.5 |
| iron-curtain/3 | 84% | 100% | 100% | normal | knight | 4.6 |
| iron-curtain/4 | 57% | 100% | 100% | fun-hard | queen | 4.3 |
| iron-curtain/5 | 62% | 100% | 100% | fun-hard | queen | 3.5 |
| iron-curtain/6 | 86% | 100% | 100% | trivial | queen | 4.2 |
| iron-curtain/7 | 57% | 100% | 100% | fun-hard | queen | 3.0 |
| iron-curtain/8 | 29% | 48% | 100% | punishing | queen | 5.4 |
| iron-curtain/9 | 3% | 19% | 25% | broken (T5 still struggles) | queen | 6.5 |
| knight-academy/0 | 100% | 100% | 100% | trivial | pawn | 8.3 |
| knight-academy/1 | 100% | 100% | 100% | trivial | — | 4.2 |
| knight-academy/2 | 100% | 100% | 100% | trivial | — | 4.5 |
| knight-academy/3 | 100% | 100% | 100% | trivial | — | 4.7 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 2.2 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 3.0 |
| knight-academy/6 | 100% | 100% | 100% | trivial | — | 3.6 |
| knight-academy/7 | 92% | 100% | 100% | trivial | knight | 2.9 |
| knight-academy/8 | 100% | 100% | 100% | trivial | — | 3.4 |
| knight-academy/9 | 24% | 33% | 100% | punishing | knight | 5.3 |
| royal-court/0 | 100% | 100% | 100% | trivial | — | 3.2 |
| royal-court/1 | 100% | 100% | 100% | trivial | — | 3.2 |
| royal-court/2 | 58% | 100% | 100% | fun-hard | queen | 4.0 |
| royal-court/3 | 100% | 100% | 100% | trivial | — | 3.4 |
| royal-court/4 | 72% | 100% | 100% | normal | queen | 7.2 |
| royal-court/5 | 76% | 100% | 100% | normal | queen | 5.6 |
| royal-court/6 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 1.3 |
| royal-court/7 | 3% | 55% | 100% | tactical (T5 only) | queen | 6.2 |
| royal-court/8 | 41% | 100% | 100% | fun-hard | queen | 3.0 |
| royal-court/9 | 0% | 1% | 1% | broken (T5 still struggles) | queen | 4.3 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 5.7 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 4.7 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 4.0 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 5.5 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 4.8 |
| speed-demon/5 | 100% | 100% | 100% | trivial | — | 4.7 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 2.7 |
| speed-demon/7 | 100% | 100% | 100% | trivial | — | 4.6 |
| speed-demon/8 | 95% | 100% | 100% | trivial | bishop | 2.8 |
| speed-demon/9 | 87% | 100% | 100% | trivial | queen | 3.0 |
| the-gauntlet/0 | 99% | 100% | 100% | trivial | knight | 3.0 |
| the-gauntlet/1 | 100% | 100% | 100% | trivial | — | 3.3 |
| the-gauntlet/2 | 5% | 98% | 100% | tactical (T5 only) | pawn | 3.8 |
| the-gauntlet/3 | 77% | 100% | 100% | normal | bishop | 4.5 |
| the-gauntlet/4 | 18% | 11% | 18% | broken (T5 still struggles) | queen | 5.1 |
| the-gauntlet/5 | 98% | 96% | 100% | trivial | knight | 3.7 |
| the-gauntlet/6 | 25% | 26% | 100% | punishing | queen | 7.4 |
| the-gauntlet/7 | 1% | 21% | 77% | punishing | knight | 5.5 |
| the-gauntlet/8 | 26% | 3% | 5% | broken (T5 still struggles) | queen | 5.2 |
| the-gauntlet/9 | 4% | 1% | 9% | broken (T5 still struggles) | queen | 7.9 |

## Outliers

**T3 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/7 (1%)

**T3 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T4 hardest:** royal-court/6 (0%) · royal-court/9 (1%) · the-gauntlet/9 (1%)

**T4 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T5 hardest:** royal-court/6 (0%) · royal-court/9 (1%) · the-gauntlet/8 (5%)

**T5 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 53% | 0% | 0% |
| T4 | 16% | 0% | 0% |
| T5 | 7% | 0% | 0% |

## Ability Impact (run-level)

Each ability force-seeded at T3 for every level of a 10-level run on **the-gauntlet**. Bot = T3 Casual. Compared to a no-ability baseline. **Mean levels** = how far through the run that ability gets the bot. **Full-run rate** = % of trials that completed all 10 levels.

**Baseline (no preowned ability)**: mean **2.00** levels (median 2) · full-run rate 0%.

| Rank | Ability | Mean levels | Δ vs baseline | Full-run rate |
|---|---|---:|---:|---:|
| 1 | Detonate | 10.00 | +8.00 | 100% |
| 2 | Aegis | 6.80 | +4.80 | 60% |
| 3 | Decoy | 6.60 | +4.60 | 0% |
| 4 | Mirror | 6.60 | +4.60 | 40% |
| 5 | Quickstep | 6.40 | +4.40 | 20% |
| 6 | Queen Pulse | 5.60 | +3.60 | 0% |
| 7 | Bait | 5.60 | +3.60 | 20% |
| 8 | Slayer | 5.20 | +3.20 | 20% |
| 9 | Mimic | 5.00 | +3.00 | 0% |
| 10 | Surge | 4.80 | +2.80 | 0% |
| 11 | Queenkiller | 4.40 | +2.40 | 20% |
| 12 | Phase Step | 4.00 | +2.00 | 20% |
| 13 | Tremor | 4.00 | +2.00 | 0% |
| 14 | Sapper | 3.60 | +1.60 | 0% |
| 15 | Bedrock | 3.40 | +1.40 | 0% |
| 16 | Pawn Charge | 3.00 | +1.00 | 0% |
| 17 | Bulwark | 3.00 | +1.00 | 0% |
| 18 | Recall | 3.00 | +1.00 | 0% |
| 19 | Knight Hop | 2.80 | +0.80 | 0% |
| 20 | Bishop Step | 2.60 | +0.60 | 0% |
| 21 | Leap | 2.00 | 0.00 | 0% |
| 22 | Sinkhole | 2.00 | 0.00 | 0% |
| 23 | Rally | 2.00 | 0.00 | 0% |
| 24 | Magnet | 2.00 | 0.00 | 0% |
| 25 | Tempo Vault | 2.00 | 0.00 | 0% |
| 26 | Tide | 2.00 | 0.00 | 0% |
| 27 | Smoke | 1.80 | -0.20 | 0% |
| 28 | Freeze Ray | 1.60 | -0.40 | 0% |
| 29 | Beeline | 1.60 | -0.40 | 0% |
| 30 | Skip | 1.60 | -0.40 | 0% |
| 31 | Foresight | 1.20 | -0.80 | 0% |
| 32 | Pushback | 1.20 | -0.80 | 0% |

## Current Abilities Ranked (ablation, secondary view)

Power score weights absolute deltas by tier (T3=2.0, T4=1.5, T5=1.0) — abilities that help beginners rank higher. **Character** is a one-line interpretation of the curve.

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Queen Pulse | 1.6 | 0pp | +1pp | 0pp | Quiet — negligible impact |
| 2 | Bishop Step | 0.9 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 3 | Leap | 0.9 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 4 | Aegis | 0.7 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 5 | Pawn Charge | 0.4 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 6 | Detonate | 0.3 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 7 | Phase Step | 0.3 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 8 | Surge | 0.3 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 9 | Knight Hop | 0.3 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 10 | Freeze Ray | 0.2 | 0pp | 0pp | 0pp | Quiet — negligible impact |

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|
| Bishop Step | 0pp | 0pp | 0pp | trash — no effect |
| Aegis | 0pp | 0pp | 0pp | trash — no effect |
| Leap | 0pp | 0pp | 0pp | trash — no effect |
| Pawn Charge | 0pp | 0pp | 0pp | trash — no effect |
| Phase Step | 0pp | 0pp | 0pp | trash — no effect |
| Detonate | 0pp | 0pp | 0pp | trash — no effect |
| Surge | 0pp | 0pp | 0pp | trash — no effect |
| Knight Hop | 0pp | 0pp | 0pp | trash — no effect |
| Freeze Ray | 0pp | 0pp | 0pp | trash — no effect |
| Queen Pulse | 0pp | +1pp | 0pp | trash — no effect |

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.66 | 45% | 99% |
| threatDensity | -0.62 | 50% | 99% |
| chokePointCount | -0.61 | 49% | 99% |
| queenCount | -0.60 | 51% | 97% |
| enemiesPerTurn | -0.59 | 49% | 100% |
| pieceCount | -0.58 | 47% | 95% |
| density | -0.58 | 47% | 95% |
| hazardCount | -0.56 | 55% | 100% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.57 | 66% | 100% |
| queenCount | -0.55 | 67% | 100% |
| pieceCount | -0.55 | 66% | 98% |
| density | -0.55 | 66% | 98% |
| chokePointCount | -0.49 | 68% | 100% |
| minLegalDistance | -0.48 | 62% | 100% |
| enemiesPerTurn | -0.48 | 66% | 100% |
| threatDensity | -0.45 | 69% | 100% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| queenCount | -0.56 | 79% | 100% |
| defendedPieces | -0.53 | 79% | 100% |
| pieceCount | -0.52 | 79% | 100% |
| density | -0.52 | 79% | 100% |
| chokePointCount | -0.44 | 81% | 100% |
| enemiesPerTurn | -0.36 | 79% | 100% |
| minLegalDistance | -0.36 | 79% | 100% |
| threatDensity | -0.35 | 81% | 100% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.63 · hold-out R² 0.61 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| pawnCount | +9.3pp | each std-dev of pawnCount changes T3 win-rate by +9.3pp |
| openFiles | +8.5pp | each std-dev of openFiles changes T3 win-rate by +8.5pp |
| defendedPieces | -7.8pp | each std-dev of defendedPieces changes T3 win-rate by -7.8pp |
| bishopCount | -7.7pp | each std-dev of bishopCount changes T3 win-rate by -7.7pp |
| queenCount | -7.5pp | each std-dev of queenCount changes T3 win-rate by -7.5pp |

**T4** — train R² 0.50 · hold-out R² 0.47 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +13.9pp | each std-dev of threatDensity changes T4 win-rate by +13.9pp |
| queenCount | -12.4pp | each std-dev of queenCount changes T4 win-rate by -12.4pp |
| pawnCount | +9.3pp | each std-dev of pawnCount changes T4 win-rate by +9.3pp |
| defendedPieces | -6.0pp | each std-dev of defendedPieces changes T4 win-rate by -6.0pp |
| knightCount | -5.5pp | each std-dev of knightCount changes T4 win-rate by -5.5pp |

**T5** — train R² 0.47 · hold-out R² 0.36 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +16.8pp | each std-dev of threatDensity changes T5 win-rate by +16.8pp |
| queenCount | -7.9pp | each std-dev of queenCount changes T5 win-rate by -7.9pp |
| moveLimitTightness | +7.0pp | each std-dev of moveLimitTightness changes T5 win-rate by +7.0pp |
| defendedPieces | -6.9pp | each std-dev of defendedPieces changes T5 win-rate by -6.9pp |
| moveLimit | -6.6pp | each std-dev of moveLimit changes T5 win-rate by -6.6pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (3 experiments)**

| Hypothesis | Mutation | Predicted | Actual | Verdict |
|---|---|---:|---:|---|
| Stressing feature "moveLimitTightness" via moveLimit=12 on daily/0 should push … | moveLimit=12 | 100% | 90% | inconclusive |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T4 win-ra… | +pawn@d3 | 97% | 100% | confirmed |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T5 win-ra… | +pawn@d3 | 93% | 100% | inconclusive |

**Rolling 7d:** confirmed: 5 · falsified: 3 · inconclusive: 7

**Model trajectory:** kept v1 (prior v1). Only beat prior on 1/3 tiers (need ≥2). T3: 0.62→0.61 (Δ-0.00) · T4: 0.35→0.47 (Δ+0.12) · T5: 0.40→0.36 (Δ-0.04)

| Tier | Prior R² | New R² | Δ |
|---|---:|---:|---:|
| T3 | 0.62 | 0.61 | -0.00 |
| T4 | 0.35 | 0.47 | +0.12 |
| T5 | 0.40 | 0.36 | -0.04 |

**Open mysteries (largest unexplained gap):**

- `daily/0` T3: predicted 100%, actual 90% (Δ-10pp)
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
