# Rookie's Run — Morning Digest

**Date:** 2026-08-15
**Sweep:** 20 trials × 325 levels × 3 tiers · **Ablation:** 10 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 65%** (range 0%–100%), **T4 68%**, **T5 71%**. Biggest crutches: **Knight Hop**.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| abilities-v2/0 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 199.6 |
| abilities-v2/1 | 30% | 30% | 35% | broken (T5 still struggles) | — | 146.1 |
| abilities-v2/2 | 80% | 65% | 70% | normal | — | 83.4 |
| abilities-v2/3 | 100% | 100% | 100% | trivial | — | 8.6 |
| abilities-v2/4 | 60% | 60% | 80% | normal | bishop | 4.3 |
| abilities-v2/5 | 95% | 100% | 100% | trivial | bishop | 6.6 |
| abilities-v2/6 | 60% | 60% | 65% | normal | queen | 3.6 |
| abilities-v2/7 | 95% | 95% | 100% | trivial | bishop | 4.8 |
| abilities-v2/8 | 30% | 50% | 55% | normal | queen | 5.7 |
| abilities-v2/9 | 10% | 10% | 25% | broken (T5 still struggles) | queen | 3.6 |
| abilities-x/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.6 |
| abilities-x/1 | 55% | 30% | 60% | normal | — | 144.5 |
| abilities-x/2 | 50% | 75% | 65% | normal | — | 65.3 |
| abilities-x/3 | 35% | 60% | 50% | normal | — | 89.1 |
| abilities-x/4 | 95% | 100% | 100% | trivial | pawn | 9.1 |
| bishops-cathedral/0 | 100% | 100% | 100% | trivial | — | 6.4 |
| bishops-cathedral/1 | 100% | 100% | 100% | trivial | — | 7.7 |
| bishops-cathedral/2 | 60% | 50% | 80% | normal | bishop | 3.8 |
| bishops-cathedral/3 | 85% | 90% | 75% | normal | pawn | 6.5 |
| bishops-cathedral/4 | 50% | 45% | 45% | normal | bishop | 3.5 |
| bishops-cathedral/5 | 85% | 100% | 100% | normal | queen | 6.2 |
| bishops-cathedral/6 | 45% | 60% | 90% | normal | bishop | 5.2 |
| bishops-cathedral/7 | 40% | 75% | 60% | normal | bishop | 4.7 |
| bishops-cathedral/8 | 25% | 40% | 20% | broken (T5 still struggles) | bishop | 3.5 |
| bishops-cathedral/9 | 25% | 40% | 15% | broken (T5 still struggles) | bishop | 3.3 |
| bishops-path/0 | 15% | 20% | 25% | broken (T5 still struggles) | — | 168.0 |
| bishops-path/1 | 50% | 50% | 55% | normal | — | 111.0 |
| bishops-path/2 | 30% | 50% | 70% | normal | — | 109.4 |
| bishops-path/3 | 45% | 55% | 50% | normal | — | 101.9 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 12.4 |
| bishops-path/5 | 100% | 100% | 100% | trivial | — | 12.0 |
| bishops-path/6 | 100% | 100% | 100% | trivial | — | 9.3 |
| bishops-path/7 | 100% | 100% | 100% | trivial | — | 6.3 |
| bishops-path/8 | 100% | 100% | 100% | trivial | — | 5.4 |
| bishops-path/9 | 95% | 100% | 100% | trivial | pawn | 4.8 |
| boss-gauntlet/0 | 60% | 75% | 65% | normal | — | 59.5 |
| boss-gauntlet/1 | 55% | 75% | 95% | fun-hard | — | 60.7 |
| boss-gauntlet/2 | 100% | 100% | 100% | trivial | — | 10.2 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 13.2 |
| boss-gauntlet/4 | 100% | 100% | 100% | trivial | — | 10.3 |
| boss-gauntlet/5 | 100% | 100% | 100% | trivial | — | 8.9 |
| boss-gauntlet/6 | 100% | 100% | 100% | trivial | — | 5.3 |
| boss-gauntlet/7 | 100% | 100% | 100% | trivial | — | 4.0 |
| boss-gauntlet/8 | 100% | 100% | 100% | trivial | — | 5.5 |
| boss-gauntlet/9 | 100% | 100% | 100% | trivial | — | 2.2 |
| cavalry-charge/0 | 100% | 100% | 100% | trivial | — | 8.6 |
| cavalry-charge/1 | 100% | 100% | 100% | trivial | — | 8.6 |
| cavalry-charge/2 | 100% | 95% | 100% | trivial | knight | 5.9 |
| cavalry-charge/3 | 70% | 100% | 100% | normal | knight | 5.8 |
| cavalry-charge/4 | 65% | 80% | 65% | normal | knight | 3.0 |
| cavalry-charge/5 | 95% | 95% | 100% | trivial | knight | 4.7 |
| cavalry-charge/6 | 15% | 25% | 25% | broken (T5 still struggles) | knight | 2.2 |
| cavalry-charge/7 | 5% | 0% | 5% | broken (T5 still struggles) | knight | 1.4 |
| cavalry-charge/8 | 40% | 60% | 45% | normal | knight | 2.6 |
| cavalry-charge/9 | 5% | 0% | 5% | broken (T5 still struggles) | knight | 1.4 |
| crossfire/0 | 85% | 90% | 100% | normal | — | 36.0 |
| crossfire/1 | 100% | 95% | 95% | trivial | — | 23.9 |
| crossfire/2 | 100% | 95% | 90% | trivial | — | 18.6 |
| crossfire/3 | 95% | 100% | 100% | trivial | bishop | 4.0 |
| crossfire/4 | 100% | 100% | 100% | trivial | — | 4.5 |
| crossfire/5 | 100% | 100% | 100% | trivial | — | 5.7 |
| crossfire/6 | 85% | 95% | 100% | normal | bishop | 5.0 |
| crossfire/7 | 100% | 100% | 100% | trivial | — | 3.5 |
| crossfire/8 | 45% | 65% | 75% | normal | pawn | 4.1 |
| crossfire/9 | 100% | 100% | 100% | trivial | — | 2.0 |
| crossroads/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| crossroads/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| crossroads/2 | 35% | 25% | 20% | broken (T5 still struggles) | — | 155.6 |
| crossroads/3 | 30% | 60% | 55% | normal | — | 89.3 |
| crossroads/4 | 95% | 95% | 100% | trivial | — | 18.6 |
| crossroads/5 | 80% | 80% | 95% | normal | knight | 4.4 |
| crossroads/6 | 65% | 65% | 70% | normal | knight | 4.0 |
| crossroads/7 | 35% | 60% | 75% | normal | knight | 4.5 |
| crossroads/8 | 0% | 15% | 5% | broken (T5 still struggles) | queen | 4.5 |
| crossroads/9 | 5% | 5% | 10% | broken (T5 still struggles) | knight | 2.8 |
| daily/0 | 30% | 40% | 20% | broken (T5 still struggles) | — | 134.7 |
| daily/1 | 90% | 95% | 80% | trivial | pawn | 40.9 |
| daily/2 | 20% | 30% | 40% | punishing | — | 155.7 |
| daily/3 | 45% | 45% | 55% | normal | — | 118.5 |
| daily/4 | 70% | 85% | 100% | normal | queen | 44.0 |
| daily/5 | 100% | 100% | 100% | trivial | — | 11.9 |
| daily/6 | 60% | 70% | 50% | normal | — | 70.8 |
| daily/7 | 100% | 100% | 100% | trivial | — | 7.8 |
| daily/8 | 100% | 100% | 100% | trivial | — | 4.5 |
| daily/9 | 100% | 100% | 100% | trivial | — | 5.1 |
| diagonal-web/0 | 100% | 100% | 100% | trivial | — | 7.9 |
| diagonal-web/1 | 100% | 100% | 100% | trivial | — | 5.7 |
| diagonal-web/2 | 95% | 90% | 95% | trivial | bishop | 7.4 |
| diagonal-web/3 | 85% | 85% | 85% | normal | bishop | 5.0 |
| diagonal-web/4 | 100% | 100% | 100% | trivial | — | 7.0 |
| diagonal-web/5 | 100% | 100% | 95% | trivial | — | 5.6 |
| diagonal-web/6 | 90% | 90% | 100% | trivial | bishop | 4.0 |
| diagonal-web/7 | 100% | 100% | 100% | trivial | — | 4.7 |
| diagonal-web/8 | 55% | 45% | 50% | normal | bishop | 2.0 |
| diagonal-web/9 | 55% | 35% | 75% | normal | bishop | 1.9 |
| endgame-assault/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| endgame-assault/1 | 10% | 0% | 0% | broken (T5 still struggles) | — | 199.3 |
| endgame-assault/2 | 45% | 45% | 30% | broken (T5 still struggles) | — | 121.6 |
| endgame-assault/3 | 85% | 100% | 100% | normal | — | 19.1 |
| endgame-assault/4 | 100% | 100% | 100% | trivial | — | 13.0 |
| endgame-assault/5 | 100% | 100% | 100% | trivial | — | 11.7 |
| endgame-assault/6 | 10% | 0% | 15% | broken (T5 still struggles) | bishop | 4.7 |
| endgame-assault/7 | 0% | 0% | 5% | broken (T5 still struggles) | queen | 3.8 |
| endgame-assault/8 | 0% | 0% | 5% | broken (T5 still struggles) | pawn | 1.8 |
| endgame-assault/9 | 0% | 0% | 0% | broken (T5 still struggles) | pawn | 2.3 |
| hazard-maze/0 | 10% | 10% | 5% | broken (T5 still struggles) | — | 181.1 |
| hazard-maze/1 | 55% | 70% | 80% | normal | — | 76.8 |
| hazard-maze/2 | 100% | 100% | 100% | trivial | — | 7.5 |
| hazard-maze/3 | 95% | 85% | 80% | trivial | — | 39.7 |
| hazard-maze/4 | 100% | 100% | 100% | trivial | — | 8.8 |
| hazard-maze/5 | 100% | 100% | 100% | trivial | — | 8.8 |
| hazard-maze/6 | 100% | 100% | 100% | trivial | — | 6.3 |
| hazard-maze/7 | 100% | 100% | 90% | trivial | — | 4.2 |
| hazard-maze/8 | 100% | 100% | 100% | trivial | — | 4.5 |
| hazard-maze/9 | 95% | 100% | 100% | trivial | queen | 6.0 |
| hornets-nest/0 | 85% | 65% | 85% | normal | — | 82.8 |
| hornets-nest/1 | 100% | 100% | 100% | trivial | — | 8.8 |
| hornets-nest/2 | 100% | 100% | 100% | trivial | — | 6.0 |
| hornets-nest/3 | 100% | 100% | 100% | trivial | — | 9.7 |
| hornets-nest/4 | 100% | 100% | 100% | trivial | — | 6.3 |
| hornets-nest/5 | 95% | 100% | 100% | trivial | bishop | 4.8 |
| hornets-nest/6 | 100% | 100% | 100% | trivial | — | 3.6 |
| hornets-nest/7 | 100% | 100% | 100% | trivial | — | 5.3 |
| hornets-nest/8 | 100% | 100% | 100% | trivial | — | 4.4 |
| hornets-nest/9 | 100% | 100% | 100% | trivial | — | 4.5 |
| hourglass/0 | 95% | 100% | 100% | trivial | bishop | 7.8 |
| hourglass/1 | 100% | 100% | 100% | trivial | — | 7.6 |
| hourglass/2 | 95% | 100% | 100% | trivial | bishop | 6.5 |
| hourglass/3 | 85% | 75% | 85% | normal | bishop | 5.5 |
| hourglass/4 | 95% | 95% | 95% | trivial | knight | 5.2 |
| hourglass/5 | 100% | 100% | 100% | trivial | — | 6.7 |
| hourglass/6 | 60% | 80% | 75% | normal | bishop | 4.1 |
| hourglass/7 | 65% | 75% | 65% | normal | bishop | 3.9 |
| hourglass/8 | 40% | 45% | 45% | normal | bishop | 5.6 |
| hourglass/9 | 10% | 20% | 15% | broken (T5 still struggles) | queen | 2.5 |
| iron-curtain/0 | 75% | 75% | 80% | normal | — | 66.1 |
| iron-curtain/1 | 100% | 90% | 100% | trivial | — | 31.3 |
| iron-curtain/2 | 90% | 100% | 100% | trivial | — | 9.1 |
| iron-curtain/3 | 100% | 100% | 100% | trivial | — | 7.9 |
| iron-curtain/4 | 90% | 100% | 100% | trivial | pawn | 6.8 |
| iron-curtain/5 | 100% | 100% | 100% | trivial | — | 4.5 |
| iron-curtain/6 | 90% | 100% | 100% | trivial | knight | 6.3 |
| iron-curtain/7 | 95% | 95% | 95% | trivial | bishop | 4.7 |
| iron-curtain/8 | 70% | 90% | 95% | normal | bishop | 4.3 |
| iron-curtain/9 | 70% | 90% | 95% | normal | pawn | 4.7 |
| iron-veil/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| iron-veil/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.2 |
| iron-veil/2 | 10% | 30% | 20% | broken (T5 still struggles) | knight | 147.0 |
| iron-veil/3 | 80% | 75% | 90% | normal | — | 65.5 |
| iron-veil/4 | 100% | 100% | 100% | trivial | — | 11.6 |
| iron-veil/5 | 35% | 55% | 55% | normal | pawn | 5.3 |
| iron-veil/6 | 30% | 30% | 35% | broken (T5 still struggles) | knight | 3.6 |
| iron-veil/7 | 15% | 25% | 45% | punishing | knight | 3.8 |
| iron-veil/8 | 25% | 35% | 35% | broken (T5 still struggles) | knight | 3.6 |
| iron-veil/9 | 20% | 40% | 50% | punishing | bishop | 3.4 |
| knight-academy/0 | 35% | 60% | 80% | normal | — | 95.5 |
| knight-academy/1 | 70% | 65% | 75% | normal | — | 82.3 |
| knight-academy/2 | 50% | 65% | 65% | normal | — | 83.9 |
| knight-academy/3 | 100% | 100% | 100% | trivial | — | 13.0 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 12.2 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 12.3 |
| knight-academy/6 | 100% | 100% | 100% | trivial | — | 9.3 |
| knight-academy/7 | 100% | 100% | 100% | trivial | — | 6.5 |
| knight-academy/8 | 100% | 100% | 100% | trivial | — | 4.3 |
| knight-academy/9 | 95% | 100% | 100% | trivial | knight | 5.0 |
| pawn-tsunami/0 | 100% | 100% | 100% | trivial | — | 10.9 |
| pawn-tsunami/1 | 100% | 100% | 100% | trivial | — | 11.8 |
| pawn-tsunami/2 | 95% | 100% | 100% | trivial | knight | 11.2 |
| pawn-tsunami/3 | 100% | 100% | 100% | trivial | — | 10.4 |
| pawn-tsunami/4 | 5% | 35% | 25% | broken (T5 still struggles) | queen | 5.2 |
| pawn-tsunami/5 | 45% | 90% | 95% | fun-hard | pawn | 9.3 |
| pawn-tsunami/6 | 0% | 0% | 5% | broken (T5 still struggles) | bishop | 2.5 |
| pawn-tsunami/7 | 0% | 0% | 10% | broken (T5 still struggles) | queen | 2.6 |
| pawn-tsunami/8 | 25% | 55% | 50% | punishing | queen | 5.6 |
| pawn-tsunami/9 | 5% | 20% | 10% | broken (T5 still struggles) | queen | 3.8 |
| pincer/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| pincer/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.3 |
| pincer/2 | 50% | 65% | 70% | normal | — | 77.9 |
| pincer/3 | 90% | 90% | 95% | trivial | — | 29.5 |
| pincer/4 | 65% | 80% | 90% | normal | pawn | 5.0 |
| pincer/5 | 90% | 85% | 100% | trivial | pawn | 4.3 |
| pincer/6 | 50% | 70% | 70% | normal | pawn | 3.3 |
| pincer/7 | 10% | 45% | 35% | broken (T5 still struggles) | pawn | 4.2 |
| pincer/8 | 0% | 15% | 20% | broken (T5 still struggles) | knight | 3.5 |
| pincer/9 | 5% | 0% | 15% | broken (T5 still struggles) | knight | 2.5 |
| royal-court/0 | 95% | 95% | 90% | trivial | — | 15.1 |
| royal-court/1 | 100% | 100% | 95% | trivial | — | 4.5 |
| royal-court/2 | 70% | 70% | 80% | normal | queen | 6.5 |
| royal-court/3 | 75% | 50% | 75% | normal | queen | 4.3 |
| royal-court/4 | 75% | 40% | 65% | normal | queen | 2.1 |
| royal-court/5 | 85% | 95% | 100% | normal | queen | 5.9 |
| royal-court/6 | 20% | 15% | 20% | broken (T5 still struggles) | queen | 1.4 |
| royal-court/7 | 20% | 30% | 50% | punishing | queen | 2.6 |
| royal-court/8 | 0% | 20% | 0% | broken (T5 still struggles) | queen | 2.2 |
| royal-court/9 | 10% | 15% | 10% | broken (T5 still struggles) | queen | 2.8 |
| royal-procession/0 | 100% | 100% | 100% | trivial | — | 5.5 |
| royal-procession/1 | 95% | 100% | 100% | trivial | queen | 6.8 |
| royal-procession/2 | 100% | 95% | 85% | trivial | bishop | 5.1 |
| royal-procession/3 | 65% | 75% | 70% | normal | bishop | 5.2 |
| royal-procession/4 | 70% | 70% | 95% | normal | queen | 5.5 |
| royal-procession/5 | 45% | 35% | 75% | normal | queen | 3.4 |
| royal-procession/6 | 35% | 35% | 50% | normal | queen | 3.5 |
| royal-procession/7 | 85% | 55% | 75% | normal | queen | 4.4 |
| royal-procession/8 | 25% | 25% | 40% | punishing | queen | 2.5 |
| royal-procession/9 | 15% | 0% | 5% | broken (T5 still struggles) | queen | 2.0 |
| royal-standoff/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| royal-standoff/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| royal-standoff/2 | 25% | 10% | 25% | broken (T5 still struggles) | — | 181.6 |
| royal-standoff/3 | 20% | 45% | 55% | punishing | — | 125.8 |
| royal-standoff/4 | 95% | 95% | 100% | trivial | queen | 22.9 |
| royal-standoff/5 | 100% | 100% | 100% | trivial | — | 15.3 |
| royal-standoff/6 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 4.2 |
| royal-standoff/7 | 0% | 5% | 5% | broken (T5 still struggles) | knight | 4.0 |
| royal-standoff/8 | 0% | 0% | 0% | broken (T5 still struggles) | pawn | 1.9 |
| royal-standoff/9 | 0% | 0% | 0% | broken (T5 still struggles) | pawn | 2.0 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 9.0 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 10.0 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 10.8 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 10.3 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 10.6 |
| speed-demon/5 | 100% | 100% | 100% | trivial | — | 10.9 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 8.7 |
| speed-demon/7 | 100% | 100% | 100% | trivial | — | 8.8 |
| speed-demon/8 | 100% | 100% | 100% | trivial | — | 5.6 |
| speed-demon/9 | 90% | 100% | 100% | trivial | queen | 6.2 |
| stc-bishop/0 | 100% | 100% | 100% | trivial | — | 7.0 |
| stc-bishop/1 | 100% | 100% | 100% | trivial | — | 8.2 |
| stc-bishop/2 | 95% | 95% | 100% | trivial | — | 15.2 |
| stc-king/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-king/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-king/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-knight/0 | 100% | 100% | 100% | trivial | — | 4.0 |
| stc-knight/1 | 100% | 100% | 100% | trivial | — | 4.0 |
| stc-knight/2 | 100% | 100% | 100% | trivial | — | 4.1 |
| stc-pawn/0 | 100% | 100% | 100% | trivial | — | 7.0 |
| stc-pawn/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 1.0 |
| stc-pawn/2 | 0% | 0% | 0% | broken (T5 still struggles) | pawn | 1.0 |
| stc-queen/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-queen/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-queen/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.9 |
| stone-citadel/0 | 0% | 0% | 5% | broken (T5 still struggles) | — | 200.0 |
| stone-citadel/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stone-citadel/2 | 45% | 50% | 40% | normal | — | 108.5 |
| stone-citadel/3 | 90% | 95% | 75% | trivial | — | 29.9 |
| stone-citadel/4 | 95% | 95% | 100% | trivial | queen | 10.2 |
| stone-citadel/5 | 30% | 60% | 75% | normal | queen | 8.1 |
| stone-citadel/6 | 25% | 25% | 60% | punishing | queen | 4.8 |
| stone-citadel/7 | 10% | 5% | 50% | punishing | bishop | 3.0 |
| stone-citadel/8 | 30% | 25% | 40% | normal | queen | 3.8 |
| stone-citadel/9 | 15% | 15% | 40% | punishing | knight | 3.0 |
| surrounded/0 | 100% | 100% | 100% | trivial | — | 9.9 |
| surrounded/1 | 100% | 100% | 100% | trivial | — | 8.4 |
| surrounded/2 | 100% | 100% | 100% | trivial | — | 7.2 |
| surrounded/3 | 100% | 100% | 100% | trivial | — | 3.5 |
| surrounded/4 | 100% | 100% | 100% | trivial | — | 5.5 |
| surrounded/5 | 100% | 100% | 100% | trivial | — | 5.0 |
| surrounded/6 | 100% | 100% | 100% | trivial | — | 11.8 |
| surrounded/7 | 100% | 100% | 100% | trivial | — | 3.3 |
| surrounded/8 | 75% | 85% | 75% | normal | queen | 3.5 |
| surrounded/9 | 15% | 15% | 15% | broken (T5 still struggles) | knight | 1.4 |
| switchback/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| switchback/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| switchback/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| switchback/3 | 100% | 100% | 100% | trivial | — | 14.9 |
| switchback/4 | 100% | 100% | 100% | trivial | — | 14.1 |
| switchback/5 | 100% | 100% | 100% | trivial | — | 11.9 |
| switchback/6 | 100% | 100% | 100% | trivial | — | 5.5 |
| switchback/7 | 100% | 100% | 100% | trivial | — | 4.8 |
| switchback/8 | 100% | 100% | 100% | trivial | — | 4.8 |
| switchback/9 | 100% | 95% | 100% | trivial | knight | 4.5 |
| the-bridge/0 | 40% | 45% | 45% | normal | — | 117.7 |
| the-bridge/1 | 45% | 40% | 50% | normal | — | 124.2 |
| the-bridge/2 | 95% | 85% | 100% | trivial | — | 40.5 |
| the-bridge/3 | 85% | 90% | 100% | normal | — | 35.9 |
| the-bridge/4 | 75% | 90% | 95% | normal | knight | 10.6 |
| the-bridge/5 | 85% | 95% | 100% | normal | knight | 8.3 |
| the-bridge/6 | 30% | 40% | 40% | normal | knight | 4.0 |
| the-bridge/7 | 60% | 55% | 75% | normal | queen | 3.7 |
| the-bridge/8 | 20% | 40% | 35% | broken (T5 still struggles) | knight | 4.0 |
| the-bridge/9 | 60% | 65% | 85% | normal | knight | 4.6 |
| the-gauntlet/0 | 90% | 100% | 90% | trivial | — | 8.5 |
| the-gauntlet/1 | 100% | 95% | 95% | trivial | bishop | 8.2 |
| the-gauntlet/2 | 100% | 100% | 100% | trivial | — | 3.9 |
| the-gauntlet/3 | 100% | 100% | 100% | trivial | — | 6.3 |
| the-gauntlet/4 | 60% | 80% | 45% | normal | knight | 4.5 |
| the-gauntlet/5 | 90% | 90% | 100% | trivial | knight | 5.2 |
| the-gauntlet/6 | 35% | 55% | 60% | normal | knight | 3.5 |
| the-gauntlet/7 | 35% | 65% | 80% | normal | knight | 4.7 |
| the-gauntlet/8 | 0% | 15% | 25% | broken (T5 still struggles) | knight | 2.6 |
| the-gauntlet/9 | 35% | 25% | 45% | normal | knight | 2.9 |
| the-plus/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-plus/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.8 |
| the-plus/2 | 5% | 20% | 10% | broken (T5 still struggles) | — | 164.6 |
| the-plus/3 | 40% | 45% | 65% | normal | — | 117.0 |
| the-plus/4 | 100% | 100% | 100% | trivial | — | 5.4 |
| the-plus/5 | 100% | 100% | 100% | trivial | — | 8.6 |
| the-plus/6 | 100% | 100% | 100% | trivial | — | 8.0 |
| the-plus/7 | 90% | 100% | 100% | trivial | queen | 6.3 |
| the-plus/8 | 100% | 100% | 100% | trivial | — | 3.0 |
| the-plus/9 | 95% | 100% | 100% | trivial | bishop | 4.2 |
| the-x/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-x/1 | 5% | 20% | 15% | broken (T5 still struggles) | — | 162.9 |
| the-x/2 | 45% | 25% | 55% | normal | — | 154.4 |
| the-x/3 | 60% | 50% | 50% | normal | — | 111.4 |
| the-x/4 | 80% | 85% | 85% | normal | — | 38.4 |
| the-x/5 | 100% | 100% | 100% | trivial | — | 7.8 |
| the-x/6 | 100% | 100% | 100% | trivial | — | 8.8 |
| the-x/7 | 90% | 100% | 100% | trivial | pawn | 6.8 |
| the-x/8 | 45% | 40% | 65% | normal | queen | 6.0 |
| the-x/9 | 5% | 35% | 50% | punishing | pawn | 4.3 |
| throne-room/0 | 100% | 100% | 100% | trivial | — | 8.8 |
| throne-room/1 | 100% | 100% | 100% | trivial | — | 8.3 |
| throne-room/2 | 65% | 45% | 65% | normal | queen | 2.9 |
| throne-room/3 | 100% | 100% | 100% | trivial | — | 3.6 |
| throne-room/4 | 100% | 100% | 100% | trivial | — | 4.1 |
| throne-room/5 | 100% | 100% | 100% | trivial | — | 4.1 |
| throne-room/6 | 95% | 90% | 95% | trivial | queen | 2.4 |
| throne-room/7 | 100% | 100% | 100% | trivial | — | 4.5 |
| throne-room/8 | 100% | 100% | 100% | trivial | — | 3.6 |
| throne-room/9 | 100% | 100% | 100% | trivial | — | 3.5 |
| trial-run/0 | 100% | 100% | 100% | trivial | — | 16.0 |
| trial-run/1 | 90% | 100% | 100% | trivial | queen | 11.3 |
| trial-run/2 | 100% | 100% | 100% | trivial | — | 16.0 |
| trial-run/3 | 100% | 100% | 100% | trivial | — | 17.0 |
| trial-run/4 | 55% | 70% | 90% | normal | knight | 10.6 |

## Outliers

**T3 hardest:** abilities-v2/0 (0%) · abilities-x/0 (0%) · crossroads/0 (0%)

**T3 easiest:** abilities-v2/3 (100%) · bishops-cathedral/0 (100%) · bishops-cathedral/1 (100%)

**T4 hardest:** abilities-v2/0 (0%) · abilities-x/0 (0%) · cavalry-charge/7 (0%)

**T4 easiest:** abilities-v2/3 (100%) · abilities-v2/5 (100%) · abilities-x/4 (100%)

**T5 hardest:** abilities-v2/0 (0%) · abilities-x/0 (0%) · crossroads/0 (0%)

**T5 easiest:** abilities-v2/3 (100%) · abilities-v2/5 (100%) · abilities-v2/7 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 39% | 0% | 24% |
| T4 | 33% | 0% | 25% |
| T5 | 30% | 0% | 24% |

## Ability Impact (run-level)

Each ability force-seeded at T3 for every level of a 10-level run on **the-gauntlet**. Bot = T3 Casual. Compared to a no-ability baseline. **Mean levels** = how far through the run that ability gets the bot. **Full-run rate** = % of trials that completed all 10 levels.

**Baseline (no preowned ability)**: mean **4.80** levels (median 6) · full-run rate 0%.

| Rank | Ability | Mean levels | Δ vs baseline | Full-run rate |
|---|---|---:|---:|---:|
| 1 | Surge | 10.00 | +5.20 | 100% |
| 2 | Queen Pulse | 9.20 | +4.40 | 40% |
| 3 | Decoy | 8.20 | +3.40 | 60% |
| 4 | Grapple | 8.20 | +3.40 | 80% |
| 5 | Become King | 8.00 | +3.20 | 60% |
| 6 | Phalanx | 8.00 | +3.20 | 40% |
| 7 | Squad | 7.80 | +3.00 | 60% |
| 8 | Bishop Step | 7.40 | +2.60 | 20% |
| 9 | Aegis | 6.20 | +1.40 | 60% |
| 10 | Detonate | 6.20 | +1.40 | 60% |
| 11 | Knight Hop | 6.00 | +1.20 | 20% |
| 12 | Freeze Ray | 5.80 | +1.00 | 40% |
| 13 | Rabies Dart | 2.60 | -2.20 | 20% |
| 14 | Convert | 2.60 | -2.20 | 20% |
| 15 | Poison Dart | 2.20 | -2.60 | 20% |
| 16 | Drones | 0.00 | -4.80 | 0% |

## Current Abilities Ranked (ablation, secondary view)

Power score weights absolute deltas by tier (T3=2.0, T4=1.5, T5=1.0) — abilities that help beginners rank higher. **Character** is a one-line interpretation of the curve.

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Knight Hop | 33.6 | -7pp | -7pp | -8pp | Expert tool |
| 2 | Bishop Step | 10.0 | -2pp | -2pp | -3pp | Quiet — negligible impact |
| 3 | Become King | 3.5 | +1pp | +1pp | -1pp | Quiet — negligible impact |
| 4 | Aegis | 2.8 | -1pp | 0pp | 0pp | Quiet — negligible impact |
| 5 | Poison Dart | 2.8 | +1pp | 0pp | 0pp | Quiet — negligible impact |
| 6 | Surge | 2.4 | +1pp | 0pp | -1pp | Quiet — negligible impact |
| 7 | Decoy | 2.1 | 0pp | +1pp | 0pp | Quiet — negligible impact |
| 8 | Freeze Ray | 2.1 | +1pp | +1pp | 0pp | Quiet — negligible impact |
| 9 | Squad | 1.9 | 0pp | +1pp | 0pp | Quiet — negligible impact |
| 10 | Queen Pulse | 1.7 | -1pp | 0pp | 0pp | Quiet — negligible impact |
| 11 | Rabies Dart | 1.5 | 0pp | +1pp | 0pp | Quiet — negligible impact |
| 12 | Convert | 1.0 | 0pp | 0pp | -1pp | Quiet — negligible impact |
| 13 | Drones | 1.0 | 0pp | 0pp | 0pp | Quiet — negligible impact |

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|
| Knight Hop | -7pp | -7pp | -8pp | normal |
| Bishop Step | -2pp | -2pp | -3pp | normal |
| Aegis | -1pp | 0pp | 0pp | trash — no effect |
| Surge | +1pp | 0pp | -1pp | trash — no effect |
| Queen Pulse | -1pp | 0pp | 0pp | trash — no effect |
| Convert | 0pp | 0pp | -1pp | trash — no effect |
| Become King | +1pp | +1pp | -1pp | trash — no effect |
| Decoy | 0pp | +1pp | 0pp | trash — no effect |
| Drones | 0pp | 0pp | 0pp | trash — no effect |
| Rabies Dart | 0pp | +1pp | 0pp | trash — no effect |
| Poison Dart | +1pp | 0pp | 0pp | trash — no effect |
| Freeze Ray | +1pp | +1pp | 0pp | trash — no effect |
| Squad | 0pp | +1pp | 0pp | trash — no effect |

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| moveLimit | -0.34 | 49% | 80% |
| moveLimitTightness | -0.28 | 49% | 61% |
| pawnCount | -0.24 | 52% | 66% |
| defendedPieces | -0.23 | 39% | 53% |
| pawnChainLen | -0.22 | 47% | 85% |
| pieceCount | -0.21 | 44% | 56% |
| density | -0.21 | 44% | 56% |
| threatDensity | 0.18 | 54% | 43% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| moveLimit | -0.35 | 50% | 83% |
| moveLimitTightness | -0.30 | 50% | 68% |
| threatDensity | 0.21 | 57% | 45% |
| pawnCount | -0.20 | 58% | 67% |
| approachWidth | -0.20 | 54% | 66% |
| defendedPieces | -0.17 | 46% | 54% |
| enemiesPerTurn | 0.17 | 68% | 48% |
| pawnChainLen | -0.16 | 52% | 86% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| moveLimit | -0.36 | 51% | 84% |
| moveLimitTightness | -0.32 | 51% | 71% |
| threatDensity | 0.25 | 63% | 46% |
| approachWidth | -0.22 | 56% | 71% |
| enemiesPerTurn | 0.18 | 70% | 49% |
| pawnCount | -0.17 | 63% | 68% |
| allowedFormsCount | 0.17 | 65% | 73% |
| pawnChainLen | -0.16 | 57% | 87% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.51 · hold-out R² 0.43 (n=325, train=260, hold-out=65)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +34.8pp | each std-dev of threatDensity changes T3 win-rate by +34.8pp |
| hazardsInApproach | +23.2pp | each std-dev of hazardsInApproach changes T3 win-rate by +23.2pp |
| hazardCount | -18.7pp | each std-dev of hazardCount changes T3 win-rate by -18.7pp |
| moveLimitTightness | -16.7pp | each std-dev of moveLimitTightness changes T3 win-rate by -16.7pp |
| chokePointCount | -15.5pp | each std-dev of chokePointCount changes T3 win-rate by -15.5pp |

**T4** — train R² 0.46 · hold-out R² 0.46 (n=325, train=260, hold-out=65)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +31.1pp | each std-dev of threatDensity changes T4 win-rate by +31.1pp |
| hazardsInApproach | +24.3pp | each std-dev of hazardsInApproach changes T4 win-rate by +24.3pp |
| hazardCount | -23.0pp | each std-dev of hazardCount changes T4 win-rate by -23.0pp |
| moveLimitTightness | -18.5pp | each std-dev of moveLimitTightness changes T4 win-rate by -18.5pp |
| chokePointCount | -16.7pp | each std-dev of chokePointCount changes T4 win-rate by -16.7pp |

**T5** — train R² 0.49 · hold-out R² 0.35 (n=325, train=260, hold-out=65)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +32.9pp | each std-dev of threatDensity changes T5 win-rate by +32.9pp |
| hazardsInApproach | +29.8pp | each std-dev of hazardsInApproach changes T5 win-rate by +29.8pp |
| hazardCount | -27.0pp | each std-dev of hazardCount changes T5 win-rate by -27.0pp |
| chokePointCount | -17.4pp | each std-dev of chokePointCount changes T5 win-rate by -17.4pp |
| moveLimitTightness | -16.2pp | each std-dev of moveLimitTightness changes T5 win-rate by -16.2pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (0 experiments)**

_No experiments ran — see caveats._

**Rolling 7d:** confirmed: 6 · falsified: 7 · inconclusive: 4

## Ability Power Report

Every ability pre-owned at T1/T3/T5 on a fixed 10-level panel (T4, 4 trials/cell), measured as win-rate lift vs owning nothing. Experimental abilities are bot-only until promoted.

### T1 leaderboard

| # | Ability | | Δ win% |
|--:|---|---|--:|
| 1 | aegis |  | 40.0pp |
| 2 | surge |  | 27.5pp |
| 3 | decoy |  | 27.5pp |
| 4 | rabies-dart |  | 25.0pp |
| 5 | queen-pulse |  | 20.0pp |
| 6 | drones |  | 20.0pp |
| 7 | bishop-step |  | 15.0pp |
| 8 | freeze-ray |  | 12.5pp |
| 9 | detonate | **NEW** | 12.5pp |
| 10 | phalanx | **NEW** | 12.5pp |
| 11 | become-king |  | 10.0pp |
| 12 | yank | **NEW** | 10.0pp |
| 13 | convert |  | 7.5pp |
| 14 | squad |  | 5.0pp |
| 15 | knight-hop |  | 0.0pp |
| 16 | poison-dart |  | 0.0pp |

### T3 leaderboard

| # | Ability | | Δ win% |
|--:|---|---|--:|
| 1 | rabies-dart |  | 40.0pp |
| 2 | drones |  | 40.0pp |
| 3 | surge |  | 40.0pp |
| 4 | aegis |  | 40.0pp |
| 5 | decoy |  | 37.5pp |
| 6 | detonate | **NEW** | 37.5pp |
| 7 | yank | **NEW** | 37.5pp |
| 8 | convert |  | 32.5pp |
| 9 | freeze-ray |  | 22.5pp |
| 10 | phalanx | **NEW** | 22.5pp |
| 11 | become-king |  | 20.0pp |
| 12 | poison-dart |  | 20.0pp |
| 13 | queen-pulse |  | 15.0pp |
| 14 | bishop-step |  | 7.5pp |
| 15 | knight-hop |  | 2.5pp |
| 16 | squad |  | -25.0pp |

### T5 leaderboard

| # | Ability | | Δ win% |
|--:|---|---|--:|
| 1 | rabies-dart |  | 40.0pp |
| 2 | drones |  | 40.0pp |
| 3 | surge |  | 40.0pp |
| 4 | aegis |  | 40.0pp |
| 5 | detonate | **NEW** | 40.0pp |
| 6 | poison-dart |  | 37.5pp |
| 7 | yank | **NEW** | 37.5pp |
| 8 | convert |  | 32.5pp |
| 9 | decoy |  | 32.5pp |
| 10 | bishop-step |  | 20.0pp |
| 11 | queen-pulse |  | 20.0pp |
| 12 | become-king |  | 20.0pp |
| 13 | freeze-ray |  | 20.0pp |
| 14 | knight-hop |  | 17.5pp |
| 15 | phalanx | **NEW** | 12.5pp |
| 16 | squad |  | 5.0pp |

### New-ability verdicts

- **detonate** — T1 12.5pp → T3 37.5pp → T5 40.0pp · PROMOTE CANDIDATE — top-band lift with a clean tier curve. Needs card art + FX, then ship behind the offer pool.
- **yank** — T1 10.0pp → T3 37.5pp → T5 37.5pp · PROMOTE CANDIDATE — top-band lift with a clean tier curve. Needs card art + FX, then ship behind the offer pool.
- **phalanx** — T1 12.5pp → T3 22.5pp → T5 12.5pp (NOT monotonic) · HOLD — power does not rise with tier. Fix the tier curve, then retest.

## Methodology

- **T3 Casual** — MCTS, 40 rollouts/decision. Noisiest play.
- **T4 Sharp** — MCTS, 80 rollouts/decision.
- **T5 Expert** — MCTS, 160 rollouts/decision.
- Every candidate (moves AND ability casts) is scored by forward rollouts plus a tier-scaled strategic prior (`bots/ability-eval.ts`). `candidatesForAbility` is exhaustive over AbilityId (typechecked), so every shipped ability is castable. Offers — at the root and inside rollouts — are scored by `offerUsefulness`, and per-run `allowedAbilities` restrictions are honored (runId is threaded into the sim).
- Rookie starts on file 4 (d1) for every sim — date-independent for stable comparisons.
- Seeds are deterministic per `levelId__tier__trial`.
