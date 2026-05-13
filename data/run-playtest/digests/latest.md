# Rookie's Run — Morning Digest

**Date:** 2026-05-13
**Sweep:** 150 trials × 110 levels × 3 tiers · **Ablation:** 80 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 68%** (range 0%–100%), **T4 88%**, **T5 94%**. No ability acts as a major crutch yet — bots don't lean on any one ability.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| bishops-path/0 | 100% | 100% | 100% | trivial | — | 5.2 |
| bishops-path/1 | 99% | 100% | 100% | trivial | — | 4.2 |
| bishops-path/2 | 100% | 100% | 100% | trivial | — | 5.6 |
| bishops-path/3 | 99% | 100% | 100% | trivial | — | 5.2 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 4.5 |
| bishops-path/5 | 99% | 100% | 100% | trivial | — | 4.2 |
| bishops-path/6 | 98% | 100% | 100% | trivial | — | 3.4 |
| bishops-path/7 | 79% | 100% | 100% | normal | — | 3.8 |
| bishops-path/8 | 43% | 100% | 100% | fun-hard | — | 6.6 |
| bishops-path/9 | 6% | 100% | 100% | tactical (T5 only) | — | 3.1 |
| boss-gauntlet/0 | 100% | 100% | 100% | trivial | — | 3.7 |
| boss-gauntlet/1 | 64% | 100% | 100% | fun-hard | — | 3.3 |
| boss-gauntlet/2 | 95% | 100% | 100% | trivial | — | 4.9 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 4.7 |
| boss-gauntlet/4 | 92% | 100% | 100% | trivial | — | 3.2 |
| boss-gauntlet/5 | 82% | 100% | 100% | normal | — | 3.2 |
| boss-gauntlet/6 | 75% | 100% | 100% | normal | queen | 3.1 |
| boss-gauntlet/7 | 52% | 100% | 100% | fun-hard | queen | 2.9 |
| boss-gauntlet/8 | 57% | 100% | 100% | fun-hard | — | 2.5 |
| boss-gauntlet/9 | 0% | 100% | 100% | tactical (T5 only) | knight | 2.0 |
| crossfire/0 | 99% | 100% | 100% | trivial | — | 2.9 |
| crossfire/1 | 99% | 100% | 100% | trivial | — | 3.2 |
| crossfire/2 | 77% | 88% | 100% | normal | — | 4.6 |
| crossfire/3 | 29% | 99% | 100% | normal | knight | 7.2 |
| crossfire/4 | 31% | 100% | 100% | normal | bishop | 3.1 |
| crossfire/5 | 51% | 85% | 100% | fun-hard | pawn | 5.9 |
| crossfire/6 | 24% | 100% | 100% | normal | — | 7.9 |
| crossfire/7 | 97% | 100% | 100% | trivial | — | 3.2 |
| crossfire/8 | 5% | 4% | 50% | punishing | bishop | 3.7 |
| crossfire/9 | 1% | 100% | 100% | tactical (T5 only) | — | 2.0 |
| daily/0 | 91% | 100% | 100% | trivial | — | 9.6 |
| daily/1 | 78% | 100% | 100% | normal | — | 13.0 |
| daily/2 | 100% | 100% | 100% | trivial | — | 6.4 |
| daily/3 | 69% | 100% | 100% | fun-hard | knight | 4.3 |
| daily/4 | 98% | 100% | 100% | trivial | bishop | 4.1 |
| daily/5 | 95% | 100% | 100% | trivial | — | 5.6 |
| daily/6 | 100% | 100% | 100% | trivial | — | 4.1 |
| daily/7 | 100% | 100% | 100% | trivial | — | 5.8 |
| daily/8 | 78% | 100% | 100% | normal | pawn | 5.3 |
| daily/9 | 89% | 100% | 99% | trivial | knight | 3.2 |
| hazard-maze/0 | 100% | 100% | 100% | trivial | — | 6.7 |
| hazard-maze/1 | 98% | 100% | 100% | trivial | knight | 4.3 |
| hazard-maze/2 | 86% | 100% | 100% | trivial | knight | 6.3 |
| hazard-maze/3 | 99% | 100% | 100% | trivial | — | 5.1 |
| hazard-maze/4 | 75% | 100% | 100% | normal | — | 4.0 |
| hazard-maze/5 | 79% | 100% | 100% | normal | — | 5.0 |
| hazard-maze/6 | 95% | 100% | 100% | trivial | — | 7.8 |
| hazard-maze/7 | 74% | 100% | 100% | normal | — | 2.8 |
| hazard-maze/8 | 31% | 100% | 100% | normal | — | 5.8 |
| hazard-maze/9 | 19% | 19% | 66% | punishing | queen | 6.4 |
| hornets-nest/0 | 99% | 100% | 100% | trivial | — | 3.9 |
| hornets-nest/1 | 99% | 100% | 100% | trivial | — | 3.3 |
| hornets-nest/2 | 73% | 100% | 100% | normal | bishop | 2.0 |
| hornets-nest/3 | 27% | 54% | 100% | punishing | — | 6.9 |
| hornets-nest/4 | 54% | 73% | 100% | fun-hard | knight | 7.4 |
| hornets-nest/5 | 45% | 57% | 100% | fun-hard | — | 9.2 |
| hornets-nest/6 | 93% | 100% | 100% | trivial | — | 3.9 |
| hornets-nest/7 | 21% | 99% | 100% | normal | queen | 4.4 |
| hornets-nest/8 | 29% | 100% | 100% | normal | knight | 2.7 |
| hornets-nest/9 | 52% | 100% | 100% | fun-hard | knight | 3.7 |
| iron-curtain/0 | 100% | 100% | 100% | trivial | — | 3.3 |
| iron-curtain/1 | 93% | 100% | 100% | trivial | — | 4.0 |
| iron-curtain/2 | 90% | 100% | 100% | trivial | — | 4.6 |
| iron-curtain/3 | 83% | 100% | 100% | normal | — | 9.5 |
| iron-curtain/4 | 35% | 97% | 100% | normal | bishop | 5.8 |
| iron-curtain/5 | 50% | 75% | 100% | fun-hard | knight | 7.5 |
| iron-curtain/6 | 73% | 97% | 93% | normal | queen | 5.9 |
| iron-curtain/7 | 55% | 100% | 100% | fun-hard | bishop | 3.0 |
| iron-curtain/8 | 14% | 49% | 77% | punishing | knight | 6.3 |
| iron-curtain/9 | 4% | 19% | 70% | punishing | pawn | 6.2 |
| knight-academy/0 | 89% | 100% | 100% | trivial | — | 11.1 |
| knight-academy/1 | 98% | 100% | 100% | trivial | — | 4.3 |
| knight-academy/2 | 99% | 100% | 100% | trivial | — | 4.6 |
| knight-academy/3 | 99% | 100% | 100% | trivial | — | 4.6 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 2.2 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 2.9 |
| knight-academy/6 | 99% | 100% | 100% | trivial | — | 3.6 |
| knight-academy/7 | 68% | 100% | 100% | fun-hard | — | 2.9 |
| knight-academy/8 | 3% | 100% | 100% | tactical (T5 only) | — | 3.4 |
| knight-academy/9 | 41% | 32% | 100% | fun-hard | knight | 6.4 |
| royal-court/0 | 100% | 100% | 100% | trivial | — | 3.2 |
| royal-court/1 | 95% | 100% | 100% | trivial | — | 3.3 |
| royal-court/2 | 45% | 100% | 100% | fun-hard | — | 6.0 |
| royal-court/3 | 55% | 100% | 100% | fun-hard | — | 3.5 |
| royal-court/4 | 40% | 100% | 100% | normal | pawn | 5.0 |
| royal-court/5 | 84% | 100% | 100% | normal | knight | 5.6 |
| royal-court/6 | 0% | 0% | 0% | broken (T5 still struggles) | — | 1.3 |
| royal-court/7 | 1% | 36% | 100% | tactical (T5 only) | queen | 5.4 |
| royal-court/8 | 43% | 100% | 100% | fun-hard | — | 3.0 |
| royal-court/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 4.1 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 5.8 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 4.6 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 4.0 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 5.4 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 4.8 |
| speed-demon/5 | 99% | 100% | 100% | trivial | — | 4.7 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 2.7 |
| speed-demon/7 | 95% | 100% | 100% | trivial | — | 4.6 |
| speed-demon/8 | 72% | 100% | 100% | normal | bishop | 2.8 |
| speed-demon/9 | 77% | 100% | 100% | normal | — | 3.0 |
| the-gauntlet/0 | 86% | 100% | 100% | trivial | — | 3.0 |
| the-gauntlet/1 | 99% | 100% | 100% | trivial | — | 3.3 |
| the-gauntlet/2 | 9% | 42% | 100% | tactical (T5 only) | bishop | 4.2 |
| the-gauntlet/3 | 59% | 41% | 100% | fun-hard | knight | 5.3 |
| the-gauntlet/4 | 1% | 8% | 15% | broken (T5 still struggles) | knight | 4.8 |
| the-gauntlet/5 | 50% | 19% | 100% | fun-hard | queen | 7.5 |
| the-gauntlet/6 | 23% | 44% | 100% | punishing | queen | 4.6 |
| the-gauntlet/7 | 1% | 92% | 67% | normal | bishop | 8.3 |
| the-gauntlet/8 | 22% | 6% | 15% | broken (T5 still struggles) | queen | 5.9 |
| the-gauntlet/9 | 1% | 0% | 17% | broken (T5 still struggles) | queen | 7.0 |

## Outliers

**T3 hardest:** boss-gauntlet/9 (0%) · royal-court/6 (0%) · royal-court/9 (0%)

**T3 easiest:** bishops-path/0 (100%) · bishops-path/2 (100%) · bishops-path/4 (100%)

**T4 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/9 (0%)

**T4 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

**T5 hardest:** royal-court/6 (0%) · royal-court/9 (0%) · the-gauntlet/4 (15%)

**T5 easiest:** bishops-path/0 (100%) · bishops-path/1 (100%) · bishops-path/2 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 3% | 2% | 78% |
| T4 | 1% | 0% | 23% |
| T5 | 1% | 0% | 10% |

## Current Abilities Ranked

Power score weights absolute deltas by tier (T3=2.0, T4=1.5, T5=1.0) — abilities that help beginners rank higher. **Character** is a one-line interpretation of the curve.

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Queen Pulse | 1.9 | 0pp | +1pp | 0pp | Quiet — negligible impact |
| 2 | Freeze Ray | 1.5 | -1pp | 0pp | 0pp | Quiet — negligible impact |
| 3 | Leap | 1.3 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 4 | Knight Hop | 1.2 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 5 | Pawn Charge | 1.1 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 6 | Bishop Step | 1.1 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 7 | Surge | 0.8 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 8 | Phase Step | 0.7 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 9 | Aegis | 0.6 | 0pp | 0pp | 0pp | Quiet — negligible impact |
| 10 | Detonate | 0.4 | 0pp | 0pp | 0pp | Quiet — negligible impact |

## 10 New Ability Candidates

First refresh against real (non-smoke-test) data: 150-trial sweep + 80-trial ablation. The picture is now unambiguous — every current ability is Quiet (largest |Δ| anywhere is Queen Pulse T4 +0.88pp, a *trap* signal, not a crutch). Meanwhile T3 win-rate is bimodal: 78% of T3 losses are dead-end (vs 23% T4 / 10% T5), and the multivariate model attributes most of the variance to moveLimitTightness (−7.0pp/σ T3), chokePointCount (−6.6pp T3 / −9.0pp T4), queenCount (−6.5pp T3 / −9.5pp T4 / −7.7pp T5), and approachWidth (−6.5pp T3). Two-thirds of the 10 candidates below target those four factors directly; the remaining four explore mechanic-space the current pool doesn't occupy. Continuity note: three of the strongest gap-fillers from 2026-05-12 (Tempo Tax, Bodyguard, Lane Clear) survive — today's data still validates them, and the bar to beat the pool is even lower than yesterday (largest abs Δ shrank from yesterday's smoke-noise ±1pp to today's stable ~0pp).

### 1. Tempo Tax — gap-filler

**Pitch:** Tap a square; if Rookie reaches it within N turns, refund tempo equal to the distance traveled.

**Gap addressed:** T3's dominant fail mode is dead-end at 78% (up from yesterday's 63-66%). moveLimitTightness is the largest T3 multivariate coefficient at −7.0pp/σ, and the inverse feature moveLimit is the largest *positive* coef at +6.7pp/σ — i.e. raw tempo is exactly what beginners run out of. No current ability refunds tempo directly (Detonate T4 refunds on kill, but bots don't combo — Detonate sits at 0.4 power, bottom of the ranking).

**Tier progression:**
- T1: mark 1 square within 3 ranks ahead; reaching it refunds +2 tempo. 1/level.
- T2: mark within 4 ranks; refund equals distance traveled (capped at 4). 1/level.
- T3: mark any square; refund equals distance. 2/level.
- T4: marking is free (doesn't cost the use until claimed). 2/level.
- T5: passive — every 3rd Rookie move auto-refunds 1 tempo, no marking needed.

**Predicted impact:** ΔT3 ~−7pp, ΔT4 ~−2pp, ΔT5 ~0pp. Rationale: directly attacks the dominant T3 fail mode; T4/T5 hit move-limit at 0% so the tail collapses. Even half the prediction would lap the current pool's strongest signal (0.88pp).

### 2. Queenkiller — gap-filler

**Pitch:** Single-shot ranged capture aimed at any queen on the board.

**Gap addressed:** queenCount is a top-5 multivariate coefficient at *every* tier — −6.5pp T3, −9.5pp T4 (the single largest T4 negative coef), −7.7pp T5 (also the largest). Queens are the top killer on the-gauntlet/5, 6, 8, 9, royal-court/7, royal-court/9, hazard-maze/9, iron-curtain/6 — disproportionately the broken/punishing levels at T4/T5. No current ability targets a piece type. This is the first "answer card."

**Tier progression:**
- T1: 50% chance to capture target queen. 1/level.
- T2: 100% capture, target must be within 4 squares. 1/level.
- T3: 100% capture, any queen. 1/level.
- T4: 100% capture, any queen; if no queen, captures any major piece. 1/level.
- T5: hits all queens on the board in one cast. 1/level.

**Predicted impact:** ΔT3 ~−4pp, ΔT4 ~−5pp, ΔT5 ~−4pp. Rationale: roughly even ablation since queens dominate the broken cluster across all tiers. Calibrated against the multivariate coef magnitudes (queenCount σ ≈ 0.5-0.7 queens per level, so removing a queen is a real fraction of σ).

### 3. Lane Clear — gap-filler

**Pitch:** Pick a file; the first enemy in that file from Rookie's rank to rank 8 freezes for 2 turns.

**Gap addressed:** approachWidth (−6.5pp T3 multivariate) and chokePointCount (−6.6pp T3, −9.0pp T4, −5.0pp T5-adjacent via defendedPieces) — narrow lanes and chokes pin beginners. Freeze Ray sits at 1.5 power (Quiet, +0.11pp T4) because bots can't *pick* which enemy to freeze; auto-targeting by file removes the targeting tax. Mechanically distinct: Freeze Ray is "pick a piece," Lane Clear is "pick a column, system targets."

**Tier progression:**
- T1: freeze first enemy in file, 1 turn. 1/level.
- T2: freeze first enemy, 2 turns. 1/level.
- T3: freeze first two enemies in file, 2 turns. 1/level.
- T4: freeze entire file (every enemy) for 1 turn. 1/level.
- T5: freeze entire file for 2 turns. 1/level.

**Predicted impact:** ΔT3 ~−4pp, ΔT4 ~−2pp, ΔT5 ~−1pp. Rationale: corrects Freeze Ray's targeting weakness directly. Beneath Tempo Tax because freeze is reactive, not progressive — doesn't help when Rookie is also tempo-starved.

### 4. Bodyguard — gap-filler

**Pitch:** Summon a friendly pawn on an adjacent square that blocks one attacker, then crumbles.

**Gap addressed:** defendedPieces is a top-3 negative *correlation* at every tier (T3 r=−0.67, T4 r=−0.57, T5 r=−0.53) and the #5 T5 multivariate coef (−5.0pp/σ). No current ability adds friendly presence to the board — Aegis blocks once but doesn't change geometry. A summon creates a forced detour that bots will actually use as a blocker.

**Tier progression:**
- T1: spawn 1 pawn adjacent, lasts 2 turns. 1/level.
- T2: spawn 1 pawn, lasts 3 turns. 2/level.
- T3: spawn pawn within 2 squares, placed to block a line of attack. 2/level.
- T4: spawned pawn can capture once before crumbling. 2/level.
- T5: spawn a friendly knight instead, lasts rest of level.

**Predicted impact:** ΔT3 ~−3pp, ΔT4 ~−3pp, ΔT5 ~−3pp. Rationale: defended-chain pressure shows up across all tiers, so ablation should be even — All-tier staple, not a crutch shape.

### 5. Sidestep — gap-filler

**Pitch:** Free instant — slide one square sideways without ending the turn. Doesn't count as Rookie's move.

**Gap addressed:** Same gap as Tempo Tax from a different angle: 78% T3 dead-end means Rookie gets pinned with no legal forward move. Phase Step works but costs a turn (ablates at 0.7 power, Quiet). A free sidestep gives a "get unstuck" button that doesn't burn tempo. The narrow-approach levels (boss-gauntlet/9, royal-court/9, iron-curtain/9, the-gauntlet/9 — all sub-10% T3) should respond directly to a sideways escape.

**Tier progression:**
- T1: 1 sidestep per level, must be empty square.
- T2: 2 sidesteps per level.
- T3: 3 sidesteps; can sidestep onto an enemy (capture).
- T4: 3 sidesteps; sidestep direction includes diagonals.
- T5: unlimited, but each costs 1 tempo.

**Predicted impact:** ΔT3 ~−5pp, ΔT4 ~−1pp, ΔT5 ~0pp. Rationale: free-action escapes overwhelmingly help shallow planners (T3); T4/T5 already navigate tightness better. Clean crutch shape — pairs well with Tempo Tax to give two independent T3 levers.

### 6. Wedge — gap-filler

**Pitch:** Tap an enemy pawn; it becomes friendly for 1 turn (blocks attacks for Rookie, doesn't move).

**Gap addressed:** chokePointCount and defendedPieces are top-5 negative correlates at every tier. Conscripting a pawn turns part of the enemy structure into Rookie's wall — flips both features positive in one move. Mechanically distinct from Freeze Ray (freeze stops motion but keeps the threat); Wedge removes threat AND grants temporary structure, which is what defended-chain levels punish hardest.

**Tier progression:**
- T1: convert 1 pawn, 1 turn. 1/level.
- T2: convert 1 pawn, 2 turns. 1/level.
- T3: convert any pawn or knight, 2 turns. 1/level.
- T4: converted piece can capture once before reverting. 1/level.
- T5: permanent — converted piece stays friendly rest of level.

**Predicted impact:** ΔT3 ~−3pp, ΔT4 ~−2pp, ΔT5 ~−1pp. Rationale: best in early-tier pawn-wall levels (iron-curtain at T3 has lowest end at 4-14%). Falls off at higher tiers where queens dominate over pawns.

### 7. Bishop Mirror — experimental

**Pitch:** Tap an enemy bishop; for 2 turns, Rookie shares its diagonals (moves as a bishop in parallel with current form).

**Gap addressed:** Today's data still shows Bishop Step as Quiet (1.1 power, all 0pp) and Queen Pulse as trap-leaning (T4 +0.88pp, with the-gauntlet/5 reading a stunning +69pp when ablated — bots greedily transform into queens and die). Both signals suggest bots mis-time unconditional transforms. Mirror is *contingent* on an enemy bishop existing, which gates the action to states where firing it is actually useful. Not a Bishop Step reskin: Mirror requires observation and doesn't replace Rookie's form.

**Tier progression:**
- T1: mirror an enemy bishop for 1 turn. 1/level.
- T2: mirror for 2 turns. 1/level.
- T3: mirror any minor piece (bishop, knight). 2/level.
- T4: mirror any piece (queen included). 2/level.
- T5: mirror persists until the mirrored piece dies.

**Predicted impact:** ΔT3 ~−2pp, ΔT4 ~−2pp, ΔT5 ~−1pp. Rationale: contingency should suppress the bot's tendency to fire transforms greedily, turning a +0.88pp trap into a real negative ablation. Honest uncertainty: it might still read as trap-leaning if bots over-target queens at T4.

### 8. Recon — experimental

**Pitch:** Show a preview of where every enemy will move this turn before Rookie commits.

**Gap addressed:** threatDensity is a top-5 T3 correlate (r=−0.69) and a top-2 multivariate coef at T4/T5 (positive at +14.9pp / +14.3pp — the model's *biggest* signal, which is counterintuitive and worth probing). T3's "captured" fail mode is only 3% but dead-end is 78% — many of those dead-ends are caused by mis-reading threat lines one move earlier. Recon doesn't change the board, only foresight. Lets us measure how much of the deficit is "couldn't see it coming" vs "wouldn't have had a move."

**Tier progression:**
- T1: preview 1 enemy's next move, pick which. 2/level.
- T2: preview 2 enemies. 2/level.
- T3: preview all enemies, 1 turn ahead. 2/level.
- T4: preview all enemies, 2 turns ahead. 1/level.
- T5: always-on preview, rest of level.

**Predicted impact:** ΔT3 ~−2pp (sim), ΔT4 ~−1pp, ΔT5 ~0pp. Caveat: ablation bots already see full board state, so this card reads weak in sims. Flag for human playtest; bot-only ablation will undersell the human upside.

### 9. Skewer — experimental

**Pitch:** Tap a line through Rookie; if it passes through ≥2 enemies, capture the closest, push the next 1 square back.

**Gap addressed:** chokePointCount (−6.6pp T3, −9.0pp T4) measures "lines packed with pieces." Skewer is the first ability whose value *scales* with chokePointCount — most current abilities are neutral or worse on dense lines. Mechanically distinct from Pawn Charge (single-direction column ray) and Detonate (radial AoE): Skewer is a directional 2-piece transaction that converts a choke into a capture+displacement.

**Tier progression:**
- T1: orthogonal lines only, capture+push 1. 1/level.
- T2: orthogonal + diagonal lines. 1/level.
- T3: capture closest, push next 2 squares. 2/level.
- T4: capture closest, push next 2 + freeze pushed piece 1 turn. 2/level.
- T5: capture all enemies on the line through 4 squares. 1/level.

**Predicted impact:** ΔT3 ~−3pp, ΔT4 ~−3pp, ΔT5 ~−2pp. Rationale: scales with the same feature it's meant to counter. Risk: bots may not see the multi-piece line as valuable since the displaced piece survives; calibration uncertainty pushes the prediction toward the lower bound.

### 10. Sentry — experimental

**Pitch:** Drop a stationary marker on a square; the first enemy that moves onto it dies. Marker is invisible to bots.

**Gap addressed:** Defended chains (defendedPieces correlation −0.67 T3, −0.57 T4) work because enemies *attack* — Sentry inverts the dynamic by punishing movement. The first ability that turns the enemy's own actions against them. The "invisible to bots" wrinkle is the experimental hook: it tests whether reactive abilities (passive denial) read on sims at all, since current passives (Aegis with stunt at T3) score 0.6 power.

**Tier progression:**
- T1: 1 sentry, kills first enemy to enter. 1/level.
- T2: 2 sentries. 1/level.
- T3: 2 sentries; killed piece doesn't reset enemy threat (chain breaks). 1/level.
- T4: 2 sentries; sentry survives one kill, can hit twice. 1/level.
- T5: 3 sentries; sentries persist across levels until used.

**Predicted impact:** ΔT3 ~−2pp, ΔT4 ~−1pp, ΔT5 ~−1pp. Rationale: bots already optimize to avoid attacked squares; making the threat invisible should let Sentry connect. Honest uncertainty: depends heavily on bot scoring of "visible vs invisible threat" — could read weaker or stronger than predicted by a wide margin.

### Priorities

**Ship Tempo Tax and Queenkiller first.** Tempo Tax directly answers the dominant T3 fail mode (78% dead-end) and the largest T3 multivariate coefficient (moveLimitTightness −7.0pp/σ); predicted ΔT3 ~−7pp would be roughly 8× the current pool's strongest absolute signal (Queen Pulse T4 +0.88pp, which is a trap). Queenkiller answers the only feature that is a top-5 multivariate killer at *every* tier (queenCount: −6.5 / −9.5 / −7.7 pp/σ) — and unlike most cards, queens are concrete enough that bot scorers will value the cast correctly, so the sim signal should match human upside instead of underselling it.

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|
| Freeze Ray | -1pp | 0pp | 0pp | trash — no effect |
| Knight Hop | 0pp | 0pp | 0pp | trash — no effect |
| Bishop Step | 0pp | 0pp | 0pp | trash — no effect |
| Leap | 0pp | 0pp | 0pp | trash — no effect |
| Pawn Charge | 0pp | 0pp | 0pp | trash — no effect |
| Queen Pulse | 0pp | +1pp | 0pp | trash — no effect |
| Surge | 0pp | 0pp | 0pp | trash — no effect |
| Aegis | 0pp | 0pp | 0pp | trash — no effect |
| Phase Step | 0pp | 0pp | 0pp | trash — no effect |
| Detonate | 0pp | 0pp | 0pp | trash — no effect |

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| threatDensity | -0.69 | 34% | 94% |
| chokePointCount | -0.69 | 34% | 95% |
| enemiesPerTurn | -0.68 | 35% | 97% |
| defendedPieces | -0.67 | 33% | 92% |
| hazardCount | -0.62 | 45% | 95% |
| hazardsInApproach | -0.62 | 45% | 95% |
| queenCount | -0.60 | 37% | 88% |
| pieceCount | -0.55 | 33% | 86% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| defendedPieces | -0.57 | 62% | 100% |
| pieceCount | -0.54 | 60% | 97% |
| density | -0.54 | 60% | 97% |
| queenCount | -0.52 | 66% | 100% |
| chokePointCount | -0.51 | 68% | 100% |
| enemiesPerTurn | -0.51 | 61% | 100% |
| threatDensity | -0.45 | 67% | 100% |
| hazardCount | -0.43 | 68% | 100% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| queenCount | -0.57 | 79% | 100% |
| defendedPieces | -0.53 | 78% | 100% |
| pieceCount | -0.51 | 78% | 99% |
| density | -0.51 | 78% | 99% |
| chokePointCount | -0.48 | 80% | 100% |
| enemiesPerTurn | -0.39 | 78% | 100% |
| threatDensity | -0.39 | 79% | 100% |
| minLegalDistance | -0.39 | 77% | 100% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.72 · hold-out R² 0.54 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| moveLimitTightness | -7.0pp | each std-dev of moveLimitTightness changes T3 win-rate by -7.0pp |
| moveLimit | +6.7pp | each std-dev of moveLimit changes T3 win-rate by +6.7pp |
| chokePointCount | -6.6pp | each std-dev of chokePointCount changes T3 win-rate by -6.6pp |
| queenCount | -6.5pp | each std-dev of queenCount changes T3 win-rate by -6.5pp |
| approachWidth | -6.5pp | each std-dev of approachWidth changes T3 win-rate by -6.5pp |

**T4** — train R² 0.51 · hold-out R² 0.33 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +14.9pp | each std-dev of threatDensity changes T4 win-rate by +14.9pp |
| openFiles | +11.0pp | each std-dev of openFiles changes T4 win-rate by +11.0pp |
| queenCount | -9.5pp | each std-dev of queenCount changes T4 win-rate by -9.5pp |
| chokePointCount | -9.0pp | each std-dev of chokePointCount changes T4 win-rate by -9.0pp |
| moveLimit | +8.2pp | each std-dev of moveLimit changes T4 win-rate by +8.2pp |

**T5** — train R² 0.48 · hold-out R² 0.37 (n=110, train=88, hold-out=22)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +14.3pp | each std-dev of threatDensity changes T5 win-rate by +14.3pp |
| moveLimitTightness | +10.4pp | each std-dev of moveLimitTightness changes T5 win-rate by +10.4pp |
| moveLimit | -9.6pp | each std-dev of moveLimit changes T5 win-rate by -9.6pp |
| queenCount | -7.7pp | each std-dev of queenCount changes T5 win-rate by -7.7pp |
| defendedPieces | -5.0pp | each std-dev of defendedPieces changes T5 win-rate by -5.0pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (3 experiments)**

| Hypothesis | Mutation | Predicted | Actual | Verdict |
|---|---|---:|---:|---|
| Stressing feature "moveLimitTightness" via moveLimit=12 on daily/0 should push … | moveLimit=12 | 100% | 40% | falsified |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T4 win-ra… | +pawn@d3 | 97% | 100% | confirmed |
| Stressing feature "threatDensity" via +pawn@d3 on daily/0 should push T5 win-ra… | +pawn@d3 | 93% | 100% | inconclusive |

**Rolling 7d:** confirmed: 2 · falsified: 2 · inconclusive: 1

**Model trajectory:** kept v1 (prior v1). Only beat prior on 0/3 tiers (need ≥2). T3: 0.62→0.54 (Δ-0.08) · T4: 0.35→0.33 (Δ-0.02) · T5: 0.40→0.37 (Δ-0.03)

| Tier | Prior R² | New R² | Δ |
|---|---:|---:|---:|
| T3 | 0.62 | 0.54 | -0.08 |
| T4 | 0.35 | 0.33 | -0.02 |
| T5 | 0.40 | 0.37 | -0.03 |

**Open mysteries (largest unexplained gap):**

- `daily/0` T3: predicted 100%, actual 40% (Δ-60pp)
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
