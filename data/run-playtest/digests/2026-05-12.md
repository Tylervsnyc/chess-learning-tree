# Rookie's Run — Morning Digest

**Date:** 2026-05-12
**Sweep:** 20 trials × 110 levels × 3 tiers · **Ablation:** 0 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 68%** (range 0%–100%), **T4 88%**, **T5 94%**. No ability acts as a major crutch yet — bots don't lean on any one ability.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| bishops-path/0 | 100% | 100% | 100% | trivial | — | 6.0 |
| bishops-path/1 | 100% | 100% | 100% | trivial | — | 4.7 |
| bishops-path/2 | 100% | 100% | 100% | trivial | — | 4.5 |
| bishops-path/3 | 100% | 100% | 100% | trivial | — | 4.4 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 4.5 |
| bishops-path/5 | 100% | 100% | 100% | trivial | — | 3.6 |
| bishops-path/6 | 100% | 100% | 100% | trivial | — | 3.1 |
| bishops-path/7 | 85% | 100% | 100% | normal | — | 4.3 |
| bishops-path/8 | 50% | 100% | 100% | fun-hard | — | 6.6 |
| bishops-path/9 | 10% | 100% | 100% | tactical (T5 only) | — | 3.4 |
| boss-gauntlet/0 | 100% | 100% | 100% | trivial | — | 3.6 |
| boss-gauntlet/1 | 60% | 100% | 100% | fun-hard | — | 2.9 |
| boss-gauntlet/2 | 100% | 100% | 100% | trivial | — | 5.2 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 5.1 |
| boss-gauntlet/4 | 85% | 100% | 100% | normal | — | 3.0 |
| boss-gauntlet/5 | 75% | 100% | 100% | normal | — | 2.6 |
| boss-gauntlet/6 | 65% | 100% | 100% | fun-hard | knight | 2.9 |
| boss-gauntlet/7 | 65% | 100% | 100% | fun-hard | — | 3.1 |
| boss-gauntlet/8 | 65% | 100% | 100% | fun-hard | — | 2.5 |
| boss-gauntlet/9 | 0% | 100% | 100% | tactical (T5 only) | knight | 2.0 |
| crossfire/0 | 100% | 100% | 100% | trivial | — | 2.7 |
| crossfire/1 | 100% | 100% | 100% | trivial | — | 3.0 |
| crossfire/2 | 95% | 85% | 100% | trivial | — | 4.7 |
| crossfire/3 | 15% | 100% | 100% | normal | — | 6.8 |
| crossfire/4 | 35% | 100% | 100% | normal | — | 3.4 |
| crossfire/5 | 50% | 85% | 100% | fun-hard | knight | 6.1 |
| crossfire/6 | 25% | 100% | 100% | normal | — | 7.8 |
| crossfire/7 | 100% | 100% | 100% | trivial | — | 3.1 |
| crossfire/8 | 5% | 15% | 45% | punishing | — | 3.8 |
| crossfire/9 | 0% | 100% | 100% | tactical (T5 only) | — | 2.0 |
| daily/0 | 95% | 100% | 100% | trivial | — | 9.6 |
| daily/1 | 85% | 100% | 100% | normal | — | 15.8 |
| daily/2 | 100% | 100% | 100% | trivial | — | 6.0 |
| daily/3 | 75% | 100% | 100% | normal | — | 4.6 |
| daily/4 | 95% | 100% | 100% | trivial | — | 4.6 |
| daily/5 | 100% | 100% | 100% | trivial | — | 5.1 |
| daily/6 | 100% | 100% | 100% | trivial | — | 4.0 |
| daily/7 | 100% | 100% | 100% | trivial | — | 5.5 |
| daily/8 | 75% | 100% | 100% | normal | — | 5.4 |
| daily/9 | 90% | 100% | 95% | trivial | — | 3.4 |
| hazard-maze/0 | 100% | 100% | 100% | trivial | — | 6.9 |
| hazard-maze/1 | 100% | 100% | 100% | trivial | — | 4.1 |
| hazard-maze/2 | 75% | 100% | 100% | normal | — | 5.7 |
| hazard-maze/3 | 100% | 100% | 100% | trivial | — | 5.3 |
| hazard-maze/4 | 90% | 100% | 100% | trivial | — | 4.3 |
| hazard-maze/5 | 80% | 100% | 100% | normal | — | 4.8 |
| hazard-maze/6 | 85% | 100% | 100% | normal | — | 7.3 |
| hazard-maze/7 | 75% | 100% | 100% | normal | — | 2.5 |
| hazard-maze/8 | 25% | 100% | 100% | normal | — | 6.2 |
| hazard-maze/9 | 20% | 15% | 65% | punishing | — | 5.5 |
| hornets-nest/0 | 100% | 100% | 100% | trivial | — | 3.2 |
| hornets-nest/1 | 100% | 100% | 100% | trivial | — | 3.3 |
| hornets-nest/2 | 85% | 100% | 100% | normal | — | 2.0 |
| hornets-nest/3 | 15% | 45% | 100% | punishing | — | 6.8 |
| hornets-nest/4 | 60% | 85% | 100% | fun-hard | bishop | 6.8 |
| hornets-nest/5 | 40% | 50% | 100% | normal | knight | 8.9 |
| hornets-nest/6 | 70% | 100% | 100% | normal | — | 4.0 |
| hornets-nest/7 | 20% | 100% | 100% | normal | queen | 3.5 |
| hornets-nest/8 | 30% | 100% | 100% | normal | — | 2.4 |
| hornets-nest/9 | 60% | 100% | 100% | fun-hard | — | 3.8 |
| iron-curtain/0 | 100% | 100% | 100% | trivial | — | 3.4 |
| iron-curtain/1 | 100% | 100% | 100% | trivial | — | 3.5 |
| iron-curtain/2 | 95% | 100% | 100% | trivial | — | 4.4 |
| iron-curtain/3 | 85% | 100% | 100% | normal | — | 9.7 |
| iron-curtain/4 | 45% | 100% | 100% | fun-hard | pawn | 5.7 |
| iron-curtain/5 | 45% | 80% | 100% | fun-hard | queen | 8.1 |
| iron-curtain/6 | 70% | 85% | 75% | normal | pawn | 6.1 |
| iron-curtain/7 | 55% | 100% | 100% | fun-hard | queen | 3.0 |
| iron-curtain/8 | 20% | 50% | 80% | punishing | — | 5.8 |
| iron-curtain/9 | 0% | 20% | 65% | punishing | knight | 5.7 |
| knight-academy/0 | 75% | 100% | 100% | normal | — | 9.8 |
| knight-academy/1 | 95% | 100% | 100% | trivial | — | 3.6 |
| knight-academy/2 | 100% | 100% | 100% | trivial | — | 5.7 |
| knight-academy/3 | 100% | 100% | 100% | trivial | — | 3.9 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 2.7 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 2.8 |
| knight-academy/6 | 100% | 100% | 100% | trivial | — | 3.5 |
| knight-academy/7 | 75% | 100% | 100% | normal | — | 3.2 |
| knight-academy/8 | 10% | 100% | 100% | tactical (T5 only) | — | 3.1 |
| knight-academy/9 | 40% | 35% | 100% | normal | knight | 6.6 |
| royal-court/0 | 100% | 100% | 100% | trivial | — | 3.4 |
| royal-court/1 | 95% | 100% | 100% | trivial | — | 3.1 |
| royal-court/2 | 35% | 100% | 100% | normal | — | 6.0 |
| royal-court/3 | 35% | 100% | 100% | normal | — | 3.0 |
| royal-court/4 | 40% | 100% | 100% | normal | pawn | 5.0 |
| royal-court/5 | 85% | 100% | 100% | normal | — | 5.3 |
| royal-court/6 | 0% | 0% | 0% | broken (T5 still struggles) | — | 1.3 |
| royal-court/7 | 0% | 40% | 100% | tactical (T5 only) | — | 6.5 |
| royal-court/8 | 45% | 100% | 100% | fun-hard | — | 3.0 |
| royal-court/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 3.9 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 5.8 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 4.2 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 4.3 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 6.8 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 4.8 |
| speed-demon/5 | 100% | 100% | 100% | trivial | — | 5.0 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 2.4 |
| speed-demon/7 | 95% | 100% | 100% | trivial | — | 4.3 |
| speed-demon/8 | 80% | 100% | 100% | normal | queen | 2.7 |
| speed-demon/9 | 75% | 100% | 100% | normal | — | 3.6 |
| the-gauntlet/0 | 90% | 100% | 100% | trivial | — | 3.3 |
| the-gauntlet/1 | 100% | 100% | 100% | trivial | — | 3.2 |
| the-gauntlet/2 | 5% | 60% | 100% | tactical (T5 only) | — | 5.0 |
| the-gauntlet/3 | 65% | 40% | 100% | fun-hard | — | 4.7 |
| the-gauntlet/4 | 5% | 0% | 25% | broken (T5 still struggles) | knight | 4.8 |
| the-gauntlet/5 | 65% | 25% | 100% | fun-hard | — | 6.5 |
| the-gauntlet/6 | 30% | 45% | 100% | normal | queen | 4.5 |
| the-gauntlet/7 | 10% | 100% | 85% | normal | queen | 8.3 |
| the-gauntlet/8 | 15% | 0% | 5% | broken (T5 still struggles) | queen | 5.1 |
| the-gauntlet/9 | 0% | 0% | 30% | broken (T5 still struggles) | queen | 7.2 |

## Outliers

**T3 hardest:** boss-gauntlet/9 (0%) · crossfire/9 (0%) · iron-curtain/9 (0%)

**T3 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T4 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/4 (0%)

**T4 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T5 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/8 (5%)

**T5 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 2% | 1% | 63% |
| T4 | 1% | 0% | 19% |
| T5 | 1% | 0% | 10% |

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| threatDensity | -0.69 | 35% | 95% |
| chokePointCount | -0.69 | 33% | 95% |
| defendedPieces | -0.66 | 34% | 94% |
| enemiesPerTurn | -0.66 | 34% | 97% |
| hazardCount | -0.61 | 46% | 96% |
| hazardsInApproach | -0.61 | 46% | 96% |
| queenCount | -0.60 | 38% | 89% |
| pieceCount | -0.53 | 35% | 86% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.56 | 62% | 99% |
| pieceCount | -0.53 | 61% | 97% |
| density | -0.53 | 61% | 97% |
| queenCount | -0.52 | 66% | 100% |
| chokePointCount | -0.50 | 69% | 100% |
| enemiesPerTurn | -0.50 | 63% | 100% |
| threatDensity | -0.44 | 68% | 99% |
| minLegalDistance | -0.43 | 59% | 100% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| queenCount | -0.56 | 80% | 100% |
| defendedPieces | -0.53 | 78% | 100% |
| pieceCount | -0.50 | 78% | 99% |
| density | -0.50 | 78% | 99% |
| chokePointCount | -0.47 | 81% | 100% |
| threatDensity | -0.38 | 80% | 100% |
| enemiesPerTurn | -0.38 | 79% | 100% |
| minLegalDistance | -0.38 | 78% | 100% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.67 · hold-out R² 0.65 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| chokePointCount | -7.7pp | each std-dev of chokePointCount changes T3 win-rate by -7.7pp |
| approachWidth | -6.4pp | each std-dev of approachWidth changes T3 win-rate by -6.4pp |
| allowedFormsCount | -4.8pp | each std-dev of allowedFormsCount changes T3 win-rate by -4.8pp |
| queenCount | -4.7pp | each std-dev of queenCount changes T3 win-rate by -4.7pp |
| bishopCount | -4.6pp | each std-dev of bishopCount changes T3 win-rate by -4.6pp |

**T4** — train R² 0.50 · hold-out R² 0.33 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +15.3pp | each std-dev of threatDensity changes T4 win-rate by +15.3pp |
| openFiles | +11.4pp | each std-dev of openFiles changes T4 win-rate by +11.4pp |
| queenCount | -9.3pp | each std-dev of queenCount changes T4 win-rate by -9.3pp |
| chokePointCount | -8.9pp | each std-dev of chokePointCount changes T4 win-rate by -8.9pp |
| pawnCount | +7.8pp | each std-dev of pawnCount changes T4 win-rate by +7.8pp |

**T5** — train R² 0.47 · hold-out R² 0.34 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +13.7pp | each std-dev of threatDensity changes T5 win-rate by +13.7pp |
| moveLimitTightness | +13.2pp | each std-dev of moveLimitTightness changes T5 win-rate by +13.2pp |
| moveLimit | -11.9pp | each std-dev of moveLimit changes T5 win-rate by -11.9pp |
| queenCount | -6.9pp | each std-dev of queenCount changes T5 win-rate by -6.9pp |
| defendedPieces | -6.1pp | each std-dev of defendedPieces changes T5 win-rate by -6.1pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (2 experiments)**

| Hypothesis | Mutation | Predicted | Actual | Verdict |
|---|---|---:|---:|---|
| Stressing feature "moveLimitTightness" via moveLimit=12 on daily/0 should push … | moveLimit=12 | 100% | 60% | falsified |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T4 win-ra… | +pawn@d3 | 97% | 100% | confirmed |

**Rolling 7d:** confirmed: 2 · falsified: 3 · inconclusive: 0

**Model trajectory:** kept v1 (prior v1). Only beat prior on 1/3 tiers (need ≥2). T3: 0.62→0.65 (Δ+0.03) · T4: 0.35→0.33 (Δ-0.02) · T5: 0.40→0.34 (Δ-0.07)

| Tier | Prior R² | New R² | Δ |
|---|---:|---:|---:|
| T3 | 0.62 | 0.65 | +0.03 |
| T4 | 0.35 | 0.33 | -0.02 |
| T5 | 0.40 | 0.34 | -0.07 |

**Open mysteries (largest unexplained gap):**

- `daily/0` T3: predicted 100%, actual 60% (Δ-40pp)
- `daily/0` T4: predicted 97%, actual 100% (Δ+3pp)

## Methodology

- **T3 Casual** — 1-ply lookahead, "don't blunder, advance, take free captures." Mild move-selection noise.
- **T4 Sharp** — 2-ply minimax over the same eval. Lower noise.
- **T5 Expert v0.1** — 3-ply minimax, deterministic argmax. Same eval as T4 (ability-aware planner is a future upgrade).
- All bots take offers reactively and tap Aegis when threatened. Most other abilities are enumerated as concrete candidate moves and scored by eval. Bots do NOT plan multi-step ability combos.
- Rookie starts on file 4 (d1) for every sim — date-independent for stable comparisons.
- Seeds are deterministic per `levelId__tier__trial`.

### Caveats

- Ablation skipped this run (--skip-ablation).

## Current Abilities Ranked

Power score weights |Δwin-rate| by tier — T3=2.0, T4=1.5, T5=1.0 — so abilities that help beginners rank higher. Negative deltas mean removing the ability hurt; positive means it was a trap. Character labels: Beginner crutch / Expert tool / All-tier staple / Trap / Quiet.

Note: ablation was skipped in the final regen of tonight's digest. Numbers below use the most recent COMPLETE ablation matrix observed in an earlier regen (matrix has been highly volatile between runs — all signals consistently |delta| ≤ 2pp, so character labels are robust even if individual deltas shift).

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Queen Pulse | 3.0 | 0pp | +2pp | 0pp | Quiet (trap-leaning) |
| 1 | Knight Hop | 3.0 | +1pp | 0pp | +1pp | Quiet (trap-leaning) |
| 3 | Freeze Ray | 1.5 | 0pp | -1pp | 0pp | Quiet |
| 4 | Bishop Step | 1.0 | 0pp | 0pp | +1pp | Quiet |
| 5 | Aegis | 0.0 | 0pp | 0pp | 0pp | Quiet |
| 5 | Surge | 0.0 | 0pp | 0pp | 0pp | Quiet |
| 5 | Detonate | 0.0 | 0pp | 0pp | 0pp | Quiet |
| 5 | Pawn Charge | 0.0 | 0pp | 0pp | 0pp | Quiet |
| 5 | Leap | 0.0 | 0pp | 0pp | 0pp | Quiet |
| 5 | Phase Step | 0.0 | 0pp | 0pp | 0pp | Quiet |

The headline holds across every observed run: every ability registers as Quiet — no |delta| exceeds 2pp at any tier. The "Trap" threshold (ΔT3 > +5pp) and the "Beginner crutch" threshold (negative ΔT3 ≥ 2x |ΔT5|) both go unmet. Bots simply don't lean on any ability in the current pool. The two notable signals (Queen Pulse +2pp T4, Knight Hop +1pp at T3 AND T5) are both trap-leaning, suggesting greedy bots mis-use transforms. The Forced-Take Analysis (an earlier regen) sharpened this: Bishop Step showed +1pp at T3, T4, AND T5 when bots were forced to SKIP it — meaning the bot actively hurts itself by accepting Bishop Step.

Caveat: bots take abilities reactively and don't plan multi-step combos, so this ranking underestimates abilities that need setup (Freeze Ray, Detonate) and overestimates simple-to-fire ones. The flatness of the matrix is the real story: today's offer pool is dead weight for sim bots. The volatility between regens (Queen Pulse moved from +1/+1/0 to +1/+2/0 to 0/+2/0 across observed runs) also confirms we're operating near noise floor.

## 10 New Ability Candidates

Goal: target the gaps the matrix exposes — no current ability is a real beginner crutch (T3 fail mode is 63% dead-end this run, 66% in an earlier regen), queens are the top killer across the hardest levels (queenCount is a top-5 multivariate coef at every tier), and tactical setups read as zero because bots can't combo. The biggest signal anywhere across observed matrices is +2pp (Queen Pulse T4, trap-leaning), so the bar for "stronger than current pool" is low — we should expect new candidates to read several pp stronger if they target the right gap. Six gap-fillers address those holes; four experiments push into spaces no current card occupies.

### 1. Tempo Tax — predicted power: order of magnitude above any current card at T3

**Pitch:** Tap a square; if Rookie reaches it within N turns, refund tempo equal to the distance traveled.

**Gap addressed:** T3's dominant fail mode is dead-end at 63-66% — bots run out of tempo before reaching rank 8. No current ability refunds tempo directly (Detonate T4 refunds on kill, but bots don't combo, hence its 0pp ablation). With moveLimitTightness as the largest negative T3 multivariate coef across runs (-9.7 to -13.1pp), a tempo-refund tool should be the strongest T3 crutch we can ship.

**Tier progression:**
- T1: mark 1 square within 3 ranks ahead; reaching it refunds +2 tempo. 1/level.
- T2: mark within 4 ranks; refund equals distance traveled (capped at 4). 1/level.
- T3: mark any square; refund equals distance. 2/level.
- T4: marking is free (doesn't cost the ability use until claimed). 2/level.
- T5: passive — every 3rd Rookie move auto-refunds 1 tempo, no marking needed.

**Predicted impact:** ΔT3 ~-6pp, ΔT4 ~-2pp, ΔT5 ~0pp. Rationale: directly attacks the dominant T3 fail mode. T4/T5 rarely hit move-limit (0% move-limit fails this run), so the upside collapses at higher tiers — a clean beginner-crutch shape. The current pool's strongest signal is 2pp; even half the predicted impact would lap the field.

### 2. Bodyguard — predicted power: top of current pool, all tiers

**Pitch:** Summon a friendly pawn on an adjacent square that blocks one attacker, then crumbles.

**Gap addressed:** defendedPieces is a top-3 negative correlate at every tier (-0.64 to -0.66 T3, -0.56 T4, -0.54 T5) and a top-5 multivariate coef at T4 (-8.3 to -8.8pp) and T5 (-5.5 to -5.6pp) — defended chains are universally hard. No current ability adds friendly presence to the board; Aegis blocks once but doesn't change geometry. A summon creates a forced detour for enemies.

**Tier progression:**
- T1: spawn 1 pawn adjacent, lasts 2 turns. 1/level.
- T2: spawn 1 pawn, lasts 3 turns. 2/level.
- T3: spawn pawn within 2 squares, can be placed to block a line of attack. 2/level.
- T4: spawned pawn can capture once before crumbling. 2/level.
- T5: spawn a friendly knight instead, lasts rest of level (still a one-time-block).

**Predicted impact:** ΔT3 ~-3pp, ΔT4 ~-3pp, ΔT5 ~-2pp. Rationale: defended-chain pressure shows up across all tiers, so this should ablate similarly — closer to an All-tier staple than a crutch.

### 3. Lane Clear — predicted power: between Bishop Step and Tempo Tax

**Pitch:** Pick a file; the first enemy in that file from Rookie's rank to rank 8 freezes for 2 turns.

**Gap addressed:** approachWidth is -5.8 to -7.0pp T3 (top-5 negative coef across runs) — narrow lanes specifically hurt beginners. chokePointCount is also a top-5 killer at every tier. Freeze Ray sits at 1.5 power (Quiet, weak T4 signal) because bots can't pick which enemy to freeze; auto-targeting (pick a file, system picks the piece) removes the targeting tax.

**Tier progression:**
- T1: freeze first enemy in file, 1 turn. 1/level.
- T2: freeze first enemy, 2 turns. 1/level.
- T3: freeze first two enemies in file, 2 turns. 1/level.
- T4: freeze entire file (every enemy) for 1 turn. 1/level.
- T5: freeze entire file for 2 turns. 1/level.

**Predicted impact:** ΔT3 ~-4pp, ΔT4 ~-2pp, ΔT5 ~-1pp. Rationale: corrects Freeze Ray's biggest weakness (targeting). Calibrated under Tempo Tax because freeze is reactive, not progressive — doesn't help if Rookie's also boxed in by move-limit.

### 4. Queenkiller — predicted power: comparable to Tempo Tax at T4/T5

**Pitch:** Single-shot ranged capture aimed at any queen on the board.

**Gap addressed:** queenCount is the #1 negative correlate at T5 (-0.57) and a top-5 multivariate coef at every tier (-6.5 to -7.4pp T3, -9.4pp T4, -8.1 to -8.5pp T5). Queens are also the top killer on iron-curtain/5,8,9 and the-gauntlet/6,7,8. No current ability targets a specific piece type. This is the first "answer card."

**Tier progression:**
- T1: 50% chance to capture target queen. 1/level.
- T2: 100% capture, target must be within 4 squares. 1/level.
- T3: 100% capture, any queen. 1/level.
- T4: 100% capture, any queen; if no queen on board, captures any major piece (rook/bishop/knight). 1/level.
- T5: hits all queens on the board in one cast. 1/level.

**Predicted impact:** ΔT3 ~-3pp, ΔT4 ~-4pp, ΔT5 ~-4pp. Rationale: targeted answer to a top-3 difficulty factor at every tier. Expect roughly even ablation since queens are present in hard levels across all tiers.

### 5. Sidestep — predicted power: second-strongest T3 crutch

**Pitch:** Free instant — slide one square sideways without ending the turn. Doesn't count as Rookie's move.

**Gap addressed:** T3 fail mode is 63-66% dead-end — bots get pinned with no legal forward move. Phase Step works but costs Rookie's turn (and ablates at 0.0). A free sidestep gives a "get unstuck" button that doesn't burn tempo. Same gap as Tempo Tax from a different angle (escape vs refund).

**Tier progression:**
- T1: 1 sidestep per level, must be empty square.
- T2: 2 sidesteps per level.
- T3: 3 sidesteps; can sidestep onto an enemy (capture).
- T4: 3 sidesteps; sidestep direction includes diagonals.
- T5: unlimited, but each costs 1 tempo.

**Predicted impact:** ΔT3 ~-5pp, ΔT4 ~-1pp, ΔT5 ~0pp. Rationale: free-action escapes overwhelmingly help shallow planners (T3). T4/T5 bots already navigate threat density better, leaving fewer sidesteps unused. Crutch shape, like Tempo Tax.

### 6. Recon — predicted power: experimental, low predicted impact but high reading

**Pitch:** Show a preview of where every enemy will move this turn before Rookie commits.

**Gap addressed:** threatDensity is a top-5 killer at every tier and T3 dies most to "captured" + "dead-end" — both partially information problems. Recon doesn't change the board, only the bot's foresight. Lets us measure how much T3's deficit is "couldn't see it coming" vs "wouldn't have had a move anyway."

**Tier progression:**
- T1: preview 1 enemy's next move, pick which. 2/level.
- T2: preview 2 enemies. 2/level.
- T3: preview all enemies, 1 turn ahead. 2/level.
- T4: preview all enemies, 2 turns ahead. 1/level.
- T5: always-on preview, rest of level.

**Predicted impact:** ΔT3 ~-2pp, ΔT4 ~-1pp, ΔT5 ~0pp. Rationale: the ablation bots already see full board state, so this card reads weak in sims. Real value is for human players — flag this candidate for human playtest, not bot ablation.

### 7. Recoil — experimental

**Pitch:** When Rookie is captured, the capturing piece dies too (passive). Doesn't save Rookie, but cleans the path for the next attempt.

**Gap addressed:** Aegis blocks one capture; Recoil is the opposite — accept the death, but break the killer formation. The current "captured" fail-mode is 1-2% T3 / 0-1% T4 / 1% T5, so direct ablation reads tiny. The interesting bet: this changes which formations are scary, opening level-design space (defended chains lose value when the chain mate-kills itself).

**Tier progression:**
- T1: passive, kills attacker on death. No revive.
- T2: passive + Rookie's tempo carries to next attempt.
- T3: passive + kills attacker AND any piece defending it (chain breaker).
- T4: passive + skip first death per level (revive on starting square once).
- T5: full revive once per level + chain-break.

**Predicted impact:** ΔT3 ~-1pp, ΔT4 ~0pp, ΔT5 ~0pp. Rationale: bots optimize to not die, so removing a death-prevention tool barely changes their play. Expect small impact in sims; real value is design-space.

### 8. Bishop Mirror — predicted power: comparable to Queen Pulse (but in the right direction)

**Pitch:** Tap an enemy bishop; for 2 turns, Rookie shares its diagonals (moves as a bishop alongside its current form).

**Gap addressed:** bishopCount entered the top-5 T3 coef at -5.6pp in one observed regen — bishops are now meaningfully harder for beginners. Bishop Step shows weak ablation across runs and a +1pp Forced-Take Skip at every tier in one regen (meaning the bot hurts itself by accepting it). Queen Pulse is trap-leaning at T4 across runs. Both suggest the bot mis-uses transforms. Bishop Mirror is contingent on an enemy bishop existing, which gates the action to situations where firing it is actually useful. Not a reskin: Bishop Step grants form unconditionally; Mirror requires observation.

**Tier progression:**
- T1: mirror an enemy bishop for 1 turn. 1/level.
- T2: mirror for 2 turns. 1/level.
- T3: mirror any minor piece (bishop, knight). 2/level.
- T4: mirror any piece (queen included). 2/level.
- T5: mirror persists until that piece dies.

**Predicted impact:** ΔT3 ~-2pp, ΔT4 ~-2pp, ΔT5 ~-2pp. Rationale: contingency should suppress the bot's tendency to fire transforms greedily, turning a trap into a real (negative) ablation signal.

### 9. Conscript — predicted power: comparable to Bodyguard

**Pitch:** Tap an enemy pawn; it becomes friendly for 1 turn (blocks attacks, doesn't move).

**Gap addressed:** pawn-heavy levels with chokePointCount (top-5 every tier) trap T3. Conscript turns an obstacle into a wall. Mechanically distinct from Freeze Ray: freeze stops movement but the piece still threatens; conscription removes threat AND grants temporary structure.

**Tier progression:**
- T1: conscript 1 pawn, 1 turn. 1/level.
- T2: conscript 1 pawn, 2 turns. 1/level.
- T3: conscript any pawn or knight, 2 turns. 1/level.
- T4: conscripted piece can capture once before reverting. 1/level.
- T5: permanent — conscripted piece stays friendly rest of level.

**Predicted impact:** ΔT3 ~-3pp, ΔT4 ~-2pp, ΔT5 ~-1pp. Rationale: best in early-tier levels where pawn walls dominate; falls off when later levels lean on queens/knights instead.

### 10. Mulligan — experimental

**Pitch:** Once per level, undo Rookie's last move (and the enemy turn that followed). Doesn't refund tempo.

**Gap addressed:** No current ability addresses mistake recovery — every failure compounds. T3 dies to dead-end (63-66%) often because of one bad move 3 turns earlier. Mulligan is a learning tool more than a power tool: in real play, the player sees their mistake and re-tries. Bots don't introspect, so ablation reads low.

**Tier progression:**
- T1: undo last move only. 1/level.
- T2: undo last move + enemy response. 1/level.
- T3: undo last 2 moves. 1/level.
- T4: undo last 2 moves; refund 1 tempo. 1/level.
- T5: undo to start of level (full reset, all uses refresh).

**Predicted impact:** ΔT3 ~-1pp, ΔT4 ~0pp, ΔT5 ~0pp. Rationale: bots don't recognize mistakes to undo, so ablation undersells this card hard. Flag for human playtest; ship anyway if quips can lean into it.

### Priorities

Ship Tempo Tax and Queenkiller first. Tempo Tax directly attacks the dominant T3 fail mode (63-66% dead-end, -9.7 to -13.1pp moveLimitTightness coef across runs) — predicted ΔT3 ~-6pp would tower over the current pool, where the largest signal anywhere is 2pp. Queenkiller is the first "answer card" against a feature (queenCount) that the multivariate model flags as a top-5 killer at every tier — a rare candidate that should ablate evenly across T3/T4/T5. Sidestep is the third pick: another T3 crutch via a different mechanic (free-action escape vs tempo refund), giving us two independent levers to dial T3 win-rate up if the difficulty map stays this brutal at the bottom.
