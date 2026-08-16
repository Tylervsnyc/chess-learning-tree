# Rookie's Run — Morning Digest

**Date:** 2026-07-09
**Sweep:** 3 trials × 320 levels × 3 tiers · **Ablation:** 0 trials × 10 abilities

## TL;DR

Sweep complete. **T3 mean win-rate 57%** (range 0%–100%), **T4 61%**, **T5 65%**. No ability acts as a major crutch yet — bots don't lean on any one ability.

## Difficulty Map

Win % per tier across all current levels. The "shape" of each row tells you the level's character — a steep T3→T5 climb means tactical, a flat row at high values means easy, a flat row at low values means broken.

| Level | T3 | T4 | T5 | Shape | Top killer | Mean moves (T4) |
|---|---:|---:|---:|---|---|---:|
| abilities-v2/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| abilities-v2/1 | 33% | 0% | 67% | normal | — | 199.7 |
| abilities-v2/2 | 33% | 100% | 33% | broken (T5 still struggles) | — | 20.7 |
| abilities-v2/3 | 100% | 100% | 100% | trivial | — | 12.3 |
| abilities-v2/4 | 67% | 67% | 100% | fun-hard | bishop | 7.7 |
| abilities-v2/5 | 100% | 100% | 100% | trivial | — | 4.7 |
| abilities-v2/6 | 67% | 67% | 100% | fun-hard | bishop | 5.0 |
| abilities-v2/7 | 67% | 100% | 100% | fun-hard | bishop | 3.3 |
| abilities-v2/8 | 0% | 0% | 33% | broken (T5 still struggles) | knight | 2.7 |
| abilities-v2/9 | 0% | 33% | 0% | broken (T5 still struggles) | knight | 2.3 |
| bishops-cathedral/0 | 67% | 100% | 100% | fun-hard | bishop | 8.3 |
| bishops-cathedral/1 | 100% | 67% | 100% | trivial | knight | 6.3 |
| bishops-cathedral/2 | 100% | 67% | 100% | trivial | bishop | 5.7 |
| bishops-cathedral/3 | 67% | 33% | 100% | fun-hard | pawn | 2.3 |
| bishops-cathedral/4 | 0% | 33% | 33% | broken (T5 still struggles) | bishop | 2.0 |
| bishops-cathedral/5 | 67% | 100% | 100% | fun-hard | queen | 5.7 |
| bishops-cathedral/6 | 33% | 67% | 100% | normal | bishop | 3.7 |
| bishops-cathedral/7 | 33% | 33% | 100% | normal | bishop | 3.7 |
| bishops-cathedral/8 | 33% | 0% | 33% | broken (T5 still struggles) | bishop | 1.3 |
| bishops-cathedral/9 | 33% | 0% | 0% | broken (T5 still struggles) | bishop | 1.7 |
| bishops-path/0 | 33% | 67% | 0% | broken (T5 still struggles) | — | 89.3 |
| bishops-path/1 | 33% | 67% | 100% | normal | — | 77.7 |
| bishops-path/2 | 67% | 33% | 67% | normal | — | 137.3 |
| bishops-path/3 | 100% | 100% | 100% | trivial | — | 22.7 |
| bishops-path/4 | 100% | 100% | 100% | trivial | — | 10.3 |
| bishops-path/5 | 100% | 100% | 100% | trivial | — | 14.0 |
| bishops-path/6 | 100% | 100% | 100% | trivial | — | 6.7 |
| bishops-path/7 | 100% | 100% | 100% | trivial | — | 10.0 |
| bishops-path/8 | 100% | 100% | 100% | trivial | — | 6.3 |
| bishops-path/9 | 100% | 100% | 100% | trivial | — | 4.0 |
| boss-gauntlet/0 | 33% | 33% | 67% | normal | — | 141.7 |
| boss-gauntlet/1 | 33% | 100% | 100% | normal | — | 9.3 |
| boss-gauntlet/2 | 100% | 100% | 100% | trivial | — | 12.3 |
| boss-gauntlet/3 | 100% | 100% | 100% | trivial | — | 12.7 |
| boss-gauntlet/4 | 100% | 100% | 100% | trivial | — | 7.3 |
| boss-gauntlet/5 | 100% | 100% | 100% | trivial | — | 11.7 |
| boss-gauntlet/6 | 100% | 100% | 100% | trivial | — | 6.0 |
| boss-gauntlet/7 | 100% | 100% | 100% | trivial | — | 2.0 |
| boss-gauntlet/8 | 100% | 100% | 33% | broken (T5 still struggles) | — | 4.0 |
| boss-gauntlet/9 | 100% | 100% | 100% | trivial | — | 2.0 |
| cavalry-charge/0 | 100% | 100% | 100% | trivial | — | 8.0 |
| cavalry-charge/1 | 100% | 100% | 100% | trivial | — | 7.0 |
| cavalry-charge/2 | 100% | 100% | 100% | trivial | — | 5.3 |
| cavalry-charge/3 | 100% | 100% | 100% | trivial | — | 4.3 |
| cavalry-charge/4 | 67% | 100% | 100% | fun-hard | knight | 2.0 |
| cavalry-charge/5 | 100% | 100% | 100% | trivial | — | 3.3 |
| cavalry-charge/6 | 33% | 33% | 33% | broken (T5 still struggles) | knight | 3.3 |
| cavalry-charge/7 | 0% | 67% | 33% | broken (T5 still struggles) | knight | 4.3 |
| cavalry-charge/8 | 67% | 100% | 33% | broken (T5 still struggles) | knight | 2.7 |
| cavalry-charge/9 | 33% | 0% | 100% | normal | knight | 1.3 |
| crossfire/0 | 67% | 67% | 100% | fun-hard | — | 84.0 |
| crossfire/1 | 100% | 100% | 100% | trivial | — | 21.0 |
| crossfire/2 | 100% | 100% | 100% | trivial | — | 6.0 |
| crossfire/3 | 67% | 100% | 100% | fun-hard | knight | 7.0 |
| crossfire/4 | 100% | 100% | 100% | trivial | — | 7.0 |
| crossfire/5 | 100% | 100% | 100% | trivial | — | 5.3 |
| crossfire/6 | 33% | 67% | 100% | normal | bishop | 7.7 |
| crossfire/7 | 100% | 100% | 100% | trivial | — | 3.7 |
| crossfire/8 | 0% | 33% | 0% | broken (T5 still struggles) | bishop | 1.7 |
| crossfire/9 | 100% | 100% | 100% | trivial | — | 2.0 |
| crossroads/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| crossroads/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| crossroads/2 | 33% | 0% | 33% | broken (T5 still struggles) | — | 200.0 |
| crossroads/3 | 0% | 33% | 67% | punishing | — | 135.0 |
| crossroads/4 | 100% | 100% | 100% | trivial | — | 3.0 |
| crossroads/5 | 100% | 100% | 100% | trivial | — | 4.0 |
| crossroads/6 | 100% | 67% | 100% | trivial | knight | 5.3 |
| crossroads/7 | 33% | 100% | 33% | broken (T5 still struggles) | knight | 7.3 |
| crossroads/8 | 0% | 0% | 33% | broken (T5 still struggles) | knight | 2.3 |
| crossroads/9 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.3 |
| daily/0 | 0% | 33% | 33% | broken (T5 still struggles) | — | 146.7 |
| daily/1 | 100% | 100% | 100% | trivial | — | 28.7 |
| daily/2 | 67% | 67% | 67% | normal | — | 120.7 |
| daily/3 | 67% | 33% | 33% | broken (T5 still struggles) | — | 137.0 |
| daily/4 | 100% | 67% | 100% | trivial | — | 82.0 |
| daily/5 | 100% | 100% | 100% | trivial | — | 11.0 |
| daily/6 | 33% | 33% | 67% | normal | — | 146.0 |
| daily/7 | 100% | 67% | 67% | trivial | — | 71.7 |
| daily/8 | 100% | 100% | 100% | trivial | — | 16.0 |
| daily/9 | 100% | 100% | 100% | trivial | — | 8.3 |
| diagonal-web/0 | 100% | 100% | 100% | trivial | — | 7.3 |
| diagonal-web/1 | 100% | 100% | 100% | trivial | — | 8.0 |
| diagonal-web/2 | 100% | 100% | 100% | trivial | — | 7.0 |
| diagonal-web/3 | 67% | 67% | 100% | fun-hard | bishop | 3.0 |
| diagonal-web/4 | 100% | 100% | 100% | trivial | — | 9.7 |
| diagonal-web/5 | 100% | 100% | 100% | trivial | — | 7.7 |
| diagonal-web/6 | 100% | 100% | 100% | trivial | — | 5.3 |
| diagonal-web/7 | 100% | 100% | 100% | trivial | — | 5.7 |
| diagonal-web/8 | 67% | 33% | 67% | normal | bishop | 1.7 |
| diagonal-web/9 | 67% | 67% | 67% | normal | bishop | 2.7 |
| endgame-assault/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| endgame-assault/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| endgame-assault/2 | 33% | 0% | 33% | broken (T5 still struggles) | — | 199.7 |
| endgame-assault/3 | 100% | 100% | 100% | trivial | — | 7.3 |
| endgame-assault/4 | 100% | 100% | 100% | trivial | — | 7.0 |
| endgame-assault/5 | 100% | 100% | 100% | trivial | — | 6.3 |
| endgame-assault/6 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 4.7 |
| endgame-assault/7 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 4.0 |
| endgame-assault/8 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.3 |
| endgame-assault/9 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.0 |
| hazard-maze/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| hazard-maze/1 | 33% | 33% | 100% | normal | — | 135.7 |
| hazard-maze/2 | 100% | 67% | 100% | trivial | — | 73.3 |
| hazard-maze/3 | 100% | 33% | 33% | broken (T5 still struggles) | — | 138.3 |
| hazard-maze/4 | 100% | 100% | 100% | trivial | — | 13.7 |
| hazard-maze/5 | 100% | 100% | 100% | trivial | — | 14.0 |
| hazard-maze/6 | 100% | 100% | 100% | trivial | — | 8.0 |
| hazard-maze/7 | 100% | 100% | 100% | trivial | — | 3.7 |
| hazard-maze/8 | 100% | 100% | 100% | trivial | — | 7.0 |
| hazard-maze/9 | 33% | 100% | 100% | normal | knight | 7.0 |
| hornets-nest/0 | 67% | 100% | 67% | normal | — | 7.7 |
| hornets-nest/1 | 100% | 100% | 100% | trivial | — | 9.3 |
| hornets-nest/2 | 100% | 100% | 100% | trivial | — | 2.7 |
| hornets-nest/3 | 100% | 100% | 100% | trivial | — | 7.7 |
| hornets-nest/4 | 100% | 100% | 100% | trivial | — | 6.7 |
| hornets-nest/5 | 100% | 100% | 100% | trivial | — | 8.3 |
| hornets-nest/6 | 100% | 100% | 100% | trivial | — | 7.3 |
| hornets-nest/7 | 100% | 100% | 100% | trivial | — | 8.0 |
| hornets-nest/8 | 100% | 100% | 100% | trivial | — | 3.3 |
| hornets-nest/9 | 100% | 100% | 100% | trivial | — | 5.3 |
| hourglass/0 | 100% | 100% | 100% | trivial | — | 10.0 |
| hourglass/1 | 100% | 100% | 100% | trivial | — | 7.0 |
| hourglass/2 | 100% | 100% | 100% | trivial | — | 5.7 |
| hourglass/3 | 67% | 100% | 100% | fun-hard | queen | 4.3 |
| hourglass/4 | 100% | 67% | 100% | trivial | knight | 3.3 |
| hourglass/5 | 100% | 100% | 100% | trivial | — | 6.0 |
| hourglass/6 | 67% | 100% | 67% | normal | knight | 3.3 |
| hourglass/7 | 33% | 100% | 67% | normal | knight | 4.0 |
| hourglass/8 | 0% | 0% | 33% | broken (T5 still struggles) | knight | 2.0 |
| hourglass/9 | 0% | 33% | 33% | broken (T5 still struggles) | bishop | 3.0 |
| iron-curtain/0 | 100% | 100% | 100% | trivial | — | 22.0 |
| iron-curtain/1 | 100% | 100% | 100% | trivial | — | 9.0 |
| iron-curtain/2 | 100% | 100% | 100% | trivial | — | 5.0 |
| iron-curtain/3 | 100% | 100% | 100% | trivial | — | 9.3 |
| iron-curtain/4 | 33% | 67% | 100% | normal | queen | 8.7 |
| iron-curtain/5 | 100% | 100% | 100% | trivial | — | 6.0 |
| iron-curtain/6 | 100% | 100% | 100% | trivial | — | 5.0 |
| iron-curtain/7 | 100% | 100% | 100% | trivial | — | 3.7 |
| iron-curtain/8 | 0% | 33% | 67% | punishing | knight | 4.0 |
| iron-curtain/9 | 0% | 33% | 67% | punishing | knight | 3.7 |
| iron-veil/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| iron-veil/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| iron-veil/2 | 67% | 0% | 67% | normal | — | 199.7 |
| iron-veil/3 | 100% | 100% | 67% | trivial | — | 13.7 |
| iron-veil/4 | 67% | 100% | 100% | fun-hard | queen | 11.7 |
| iron-veil/5 | 33% | 0% | 100% | normal | knight | 3.0 |
| iron-veil/6 | 33% | 0% | 0% | broken (T5 still struggles) | queen | 3.0 |
| iron-veil/7 | 0% | 0% | 0% | broken (T5 still struggles) | bishop | 3.3 |
| iron-veil/8 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.7 |
| iron-veil/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 2.0 |
| knight-academy/0 | 33% | 67% | 100% | normal | — | 85.3 |
| knight-academy/1 | 67% | 67% | 100% | fun-hard | — | 72.3 |
| knight-academy/2 | 100% | 67% | 67% | trivial | — | 70.7 |
| knight-academy/3 | 100% | 100% | 100% | trivial | — | 13.3 |
| knight-academy/4 | 100% | 100% | 100% | trivial | — | 9.7 |
| knight-academy/5 | 100% | 100% | 100% | trivial | — | 8.3 |
| knight-academy/6 | 100% | 100% | 100% | trivial | — | 5.3 |
| knight-academy/7 | 100% | 100% | 100% | trivial | — | 8.7 |
| knight-academy/8 | 100% | 100% | 100% | trivial | — | 6.3 |
| knight-academy/9 | 100% | 100% | 100% | trivial | — | 6.7 |
| pawn-tsunami/0 | 100% | 100% | 100% | trivial | — | 11.0 |
| pawn-tsunami/1 | 100% | 100% | 100% | trivial | — | 12.0 |
| pawn-tsunami/2 | 100% | 100% | 100% | trivial | — | 11.3 |
| pawn-tsunami/3 | 67% | 100% | 100% | fun-hard | bishop | 10.0 |
| pawn-tsunami/4 | 0% | 33% | 33% | broken (T5 still struggles) | knight | 4.3 |
| pawn-tsunami/5 | 33% | 67% | 67% | normal | queen | 7.3 |
| pawn-tsunami/6 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 2.7 |
| pawn-tsunami/7 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.3 |
| pawn-tsunami/8 | 67% | 33% | 33% | broken (T5 still struggles) | bishop | 3.7 |
| pawn-tsunami/9 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 3.0 |
| pincer/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| pincer/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| pincer/2 | 0% | 100% | 100% | tactical (T5 only) | — | 3.3 |
| pincer/3 | 100% | 100% | 100% | trivial | — | 3.7 |
| pincer/4 | 33% | 67% | 100% | normal | queen | 4.0 |
| pincer/5 | 100% | 100% | 100% | trivial | — | 3.3 |
| pincer/6 | 33% | 67% | 100% | normal | bishop | 4.3 |
| pincer/7 | 0% | 67% | 100% | tactical (T5 only) | knight | 5.3 |
| pincer/8 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 3.0 |
| pincer/9 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 3.0 |
| royal-court/0 | 100% | 100% | 100% | trivial | — | 4.7 |
| royal-court/1 | 100% | 100% | 100% | trivial | — | 3.0 |
| royal-court/2 | 100% | 33% | 67% | trivial | queen | 2.3 |
| royal-court/3 | 67% | 100% | 33% | broken (T5 still struggles) | queen | 2.7 |
| royal-court/4 | 67% | 33% | 100% | fun-hard | queen | 2.7 |
| royal-court/5 | 67% | 100% | 100% | fun-hard | queen | 6.7 |
| royal-court/6 | 0% | 67% | 33% | broken (T5 still struggles) | queen | 3.0 |
| royal-court/7 | 0% | 33% | 0% | broken (T5 still struggles) | queen | 2.7 |
| royal-court/8 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 1.7 |
| royal-court/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 2.3 |
| royal-procession/0 | 67% | 100% | 100% | fun-hard | queen | 3.3 |
| royal-procession/1 | 100% | 100% | 100% | trivial | — | 8.7 |
| royal-procession/2 | 100% | 67% | 67% | trivial | knight | 6.0 |
| royal-procession/3 | 0% | 100% | 100% | tactical (T5 only) | bishop | 6.7 |
| royal-procession/4 | 100% | 67% | 67% | trivial | queen | 3.3 |
| royal-procession/5 | 100% | 67% | 100% | trivial | queen | 3.3 |
| royal-procession/6 | 33% | 67% | 67% | normal | queen | 3.0 |
| royal-procession/7 | 100% | 67% | 100% | trivial | knight | 5.0 |
| royal-procession/8 | 33% | 33% | 33% | broken (T5 still struggles) | queen | 3.7 |
| royal-procession/9 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 1.7 |
| royal-standoff/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| royal-standoff/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| royal-standoff/2 | 67% | 33% | 0% | broken (T5 still struggles) | — | 137.7 |
| royal-standoff/3 | 100% | 33% | 0% | broken (T5 still struggles) | — | 159.3 |
| royal-standoff/4 | 100% | 100% | 100% | trivial | — | 6.7 |
| royal-standoff/5 | 100% | 100% | 100% | trivial | — | 6.7 |
| royal-standoff/6 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 3.3 |
| royal-standoff/7 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 4.0 |
| royal-standoff/8 | 0% | 0% | 0% | broken (T5 still struggles) | bishop | 2.7 |
| royal-standoff/9 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.7 |
| speed-demon/0 | 100% | 100% | 100% | trivial | — | 9.0 |
| speed-demon/1 | 100% | 100% | 100% | trivial | — | 9.3 |
| speed-demon/2 | 100% | 100% | 100% | trivial | — | 11.0 |
| speed-demon/3 | 100% | 100% | 100% | trivial | — | 10.3 |
| speed-demon/4 | 100% | 100% | 100% | trivial | — | 8.7 |
| speed-demon/5 | 100% | 100% | 100% | trivial | — | 10.3 |
| speed-demon/6 | 100% | 100% | 100% | trivial | — | 8.7 |
| speed-demon/7 | 100% | 100% | 100% | trivial | — | 10.3 |
| speed-demon/8 | 100% | 100% | 100% | trivial | — | 7.7 |
| speed-demon/9 | 100% | 100% | 100% | trivial | — | 5.0 |
| stc-bishop/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-bishop/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-bishop/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-king/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-king/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-king/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-knight/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-knight/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-knight/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-pawn/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-pawn/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-pawn/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-queen/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-queen/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stc-queen/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stone-citadel/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stone-citadel/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| stone-citadel/2 | 0% | 33% | 67% | punishing | — | 139.3 |
| stone-citadel/3 | 67% | 100% | 100% | fun-hard | — | 33.7 |
| stone-citadel/4 | 100% | 100% | 100% | trivial | — | 11.3 |
| stone-citadel/5 | 33% | 100% | 33% | broken (T5 still struggles) | knight | 9.7 |
| stone-citadel/6 | 33% | 33% | 0% | broken (T5 still struggles) | knight | 3.3 |
| stone-citadel/7 | 0% | 33% | 0% | broken (T5 still struggles) | knight | 4.7 |
| stone-citadel/8 | 33% | 0% | 0% | broken (T5 still struggles) | knight | 3.3 |
| stone-citadel/9 | 0% | 0% | 0% | broken (T5 still struggles) | bishop | 2.0 |
| surrounded/0 | 100% | 100% | 100% | trivial | — | 10.0 |
| surrounded/1 | 100% | 100% | 100% | trivial | — | 8.0 |
| surrounded/2 | 100% | 100% | 100% | trivial | — | 9.0 |
| surrounded/3 | 100% | 100% | 100% | trivial | — | 8.3 |
| surrounded/4 | 100% | 100% | 100% | trivial | — | 4.7 |
| surrounded/5 | 100% | 100% | 100% | trivial | — | 4.3 |
| surrounded/6 | 100% | 100% | 100% | trivial | — | 9.0 |
| surrounded/7 | 100% | 100% | 100% | trivial | — | 2.7 |
| surrounded/8 | 33% | 67% | 100% | normal | queen | 3.0 |
| surrounded/9 | 0% | 33% | 0% | broken (T5 still struggles) | knight | 2.7 |
| switchback/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| switchback/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| switchback/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| switchback/3 | 100% | 100% | 100% | trivial | — | 16.0 |
| switchback/4 | 100% | 100% | 100% | trivial | — | 16.0 |
| switchback/5 | 100% | 100% | 100% | trivial | — | 13.0 |
| switchback/6 | 100% | 100% | 100% | trivial | — | 15.0 |
| switchback/7 | 33% | 100% | 100% | normal | knight | 12.3 |
| switchback/8 | 67% | 67% | 67% | normal | knight | 5.3 |
| switchback/9 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 3.0 |
| the-bridge/0 | 33% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-bridge/1 | 0% | 33% | 33% | broken (T5 still struggles) | — | 137.3 |
| the-bridge/2 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-bridge/3 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.0 |
| the-bridge/4 | 33% | 100% | 100% | normal | knight | 8.7 |
| the-bridge/5 | 67% | 67% | 100% | fun-hard | knight | 10.7 |
| the-bridge/6 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 3.0 |
| the-bridge/7 | 0% | 0% | 0% | broken (T5 still struggles) | queen | 3.0 |
| the-bridge/8 | 0% | 0% | 33% | broken (T5 still struggles) | knight | 2.7 |
| the-bridge/9 | 33% | 0% | 0% | broken (T5 still struggles) | knight | 2.7 |
| the-gauntlet/0 | 100% | 100% | 100% | trivial | — | 12.0 |
| the-gauntlet/1 | 100% | 67% | 100% | trivial | — | 68.7 |
| the-gauntlet/2 | 67% | 100% | 100% | fun-hard | knight | 5.3 |
| the-gauntlet/3 | 100% | 100% | 100% | trivial | — | 6.0 |
| the-gauntlet/4 | 67% | 33% | 33% | broken (T5 still struggles) | bishop | 4.0 |
| the-gauntlet/5 | 67% | 100% | 100% | fun-hard | knight | 5.3 |
| the-gauntlet/6 | 0% | 67% | 33% | broken (T5 still struggles) | knight | 4.7 |
| the-gauntlet/7 | 33% | 0% | 100% | normal | knight | 2.0 |
| the-gauntlet/8 | 0% | 0% | 33% | broken (T5 still struggles) | knight | 2.7 |
| the-gauntlet/9 | 0% | 33% | 33% | broken (T5 still struggles) | knight | 2.7 |
| the-plus/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-plus/1 | 0% | 0% | 33% | broken (T5 still struggles) | — | 200.0 |
| the-plus/2 | 0% | 0% | 33% | broken (T5 still struggles) | — | 200.0 |
| the-plus/3 | 33% | 33% | 67% | normal | — | 137.3 |
| the-plus/4 | 33% | 0% | 33% | broken (T5 still struggles) | — | 200.0 |
| the-plus/5 | 100% | 100% | 100% | trivial | — | 13.7 |
| the-plus/6 | 100% | 100% | 100% | trivial | — | 9.0 |
| the-plus/7 | 100% | 100% | 100% | trivial | — | 6.3 |
| the-plus/8 | 100% | 100% | 100% | trivial | — | 5.7 |
| the-plus/9 | 33% | 33% | 100% | normal | knight | 6.0 |
| the-x/0 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-x/1 | 0% | 0% | 0% | broken (T5 still struggles) | — | 200.0 |
| the-x/2 | 33% | 100% | 33% | broken (T5 still struggles) | — | 21.0 |
| the-x/3 | 0% | 0% | 0% | broken (T5 still struggles) | — | 199.3 |
| the-x/4 | 0% | 0% | 0% | broken (T5 still struggles) | bishop | 3.0 |
| the-x/5 | 0% | 100% | 100% | tactical (T5 only) | knight | 12.3 |
| the-x/6 | 0% | 33% | 0% | broken (T5 still struggles) | bishop | 6.3 |
| the-x/7 | 0% | 0% | 0% | broken (T5 still struggles) | bishop | 2.7 |
| the-x/8 | 0% | 0% | 0% | broken (T5 still struggles) | knight | 2.3 |
| the-x/9 | 0% | 0% | 33% | broken (T5 still struggles) | knight | 2.3 |
| throne-room/0 | 100% | 100% | 100% | trivial | — | 9.0 |
| throne-room/1 | 100% | 100% | 100% | trivial | — | 7.3 |
| throne-room/2 | 33% | 100% | 67% | normal | queen | 6.0 |
| throne-room/3 | 100% | 100% | 100% | trivial | — | 5.0 |
| throne-room/4 | 100% | 100% | 100% | trivial | — | 7.0 |
| throne-room/5 | 67% | 100% | 100% | fun-hard | queen | 3.7 |
| throne-room/6 | 67% | 100% | 67% | normal | queen | 3.3 |
| throne-room/7 | 100% | 100% | 100% | trivial | — | 3.3 |
| throne-room/8 | 100% | 100% | 100% | trivial | — | 4.7 |
| throne-room/9 | 100% | 100% | 100% | trivial | — | 3.0 |
| trial-run/0 | 100% | 100% | 100% | trivial | — | 16.0 |
| trial-run/1 | 100% | 100% | 100% | trivial | — | 14.3 |
| trial-run/2 | 100% | 100% | 100% | trivial | — | 16.0 |
| trial-run/3 | 100% | 100% | 100% | trivial | — | 18.0 |
| trial-run/4 | 67% | 100% | 100% | fun-hard | knight | 14.0 |

## Outliers

**T3 hardest:** abilities-v2/0 (0%) · abilities-v2/8 (0%) · abilities-v2/9 (0%)

**T3 easiest:** abilities-v2/3 (100%) · abilities-v2/5 (100%) · bishops-cathedral/1 (100%)

**T4 hardest:** abilities-v2/0 (0%) · abilities-v2/1 (0%) · abilities-v2/8 (0%)

**T4 easiest:** abilities-v2/2 (100%) · abilities-v2/3 (100%) · abilities-v2/5 (100%)

**T5 hardest:** abilities-v2/0 (0%) · abilities-v2/9 (0%) · bishops-cathedral/9 (0%)

**T5 easiest:** abilities-v2/3 (100%) · abilities-v2/4 (100%) · abilities-v2/5 (100%)

## Fail Modes

What kills each tier when they lose?

| Tier | Captured | Move-limit | Dead-end |
|---|---:|---:|---:|
| T3 | 34% | 0% | 22% |
| T4 | 28% | 0% | 22% |
| T5 | 23% | 0% | 21% |

## Ability Power Matrix (ablation)

Delta in win % when each ability is removed from the offer pool. Negative = removing it hurt players (ability was a crutch). Positive = removing it helped players (trap pick).

| Ability | ΔT3 | ΔT4 | ΔT5 | Tag |
|---|---:|---:|---:|---|

## Level Factor Findings

Top correlations (Pearson) between each level feature and win-rate, per tier. Positive = more of this feature → players win more.

**T3**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| moveLimit | -0.35 | 35% | 78% |
| minLegalDistance | -0.28 | 29% | 67% |
| moveLimitTightness | -0.27 | 35% | 47% |
| hazardCount | -0.22 | 40% | 75% |
| hazardsInApproach | -0.21 | 40% | 75% |
| threatDensity | 0.21 | 46% | 33% |
| enemiesPerTurn | 0.18 | 60% | 40% |
| chokePointCount | -0.16 | 38% | 53% |

**T4**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| moveLimit | -0.41 | 34% | 84% |
| moveLimitTightness | -0.35 | 34% | 57% |
| threatDensity | 0.27 | 51% | 32% |
| minLegalDistance | -0.22 | 39% | 68% |
| enemiesPerTurn | 0.21 | 65% | 39% |
| approachWidth | -0.19 | 47% | 58% |
| hazardCount | -0.18 | 46% | 78% |
| hazardsInApproach | -0.17 | 46% | 78% |

**T5**

| Feature | r | Mean win (top 25%) | Mean win (bottom 25%) |
|---|---:|---:|---:|
| moveLimit | -0.39 | 39% | 86% |
| moveLimitTightness | -0.32 | 39% | 62% |
| threatDensity | 0.28 | 55% | 36% |
| enemiesPerTurn | 0.24 | 71% | 41% |
| minLegalDistance | -0.21 | 44% | 71% |
| approachWidth | -0.20 | 51% | 59% |
| hazardCount | -0.17 | 51% | 80% |
| hazardsInApproach | -0.16 | 51% | 80% |

## Multivariate Difficulty Model

Ridge regression (λ=0.1) on standardized features. Coefficients say "moving this feature up by one standard deviation shifts win-rate by N pp, holding the other 18 features fixed." Hold-out R² uses a deterministic 20% of levels per tier so the number is comparable night-over-night.

**T3** — train R² 0.56 · hold-out R² 0.29 (n=320, train=256, hold-out=64)

| Feature | Std coef | Effect |
|---|---:|---|
| hazardCount | -64.9pp | each std-dev of hazardCount changes T3 win-rate by -64.9pp |
| hazardsInApproach | +64.9pp | each std-dev of hazardsInApproach changes T3 win-rate by +64.9pp |
| threatDensity | +43.0pp | each std-dev of threatDensity changes T3 win-rate by +43.0pp |
| defendedPieces | -21.0pp | each std-dev of defendedPieces changes T3 win-rate by -21.0pp |
| openFiles | -16.0pp | each std-dev of openFiles changes T3 win-rate by -16.0pp |

**T4** — train R² 0.59 · hold-out R² 0.37 (n=320, train=256, hold-out=64)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +41.8pp | each std-dev of threatDensity changes T4 win-rate by +41.8pp |
| hazardsInApproach | +40.6pp | each std-dev of hazardsInApproach changes T4 win-rate by +40.6pp |
| hazardCount | -39.5pp | each std-dev of hazardCount changes T4 win-rate by -39.5pp |
| defendedPieces | -21.8pp | each std-dev of defendedPieces changes T4 win-rate by -21.8pp |
| chokePointCount | -21.1pp | each std-dev of chokePointCount changes T4 win-rate by -21.1pp |

**T5** — train R² 0.59 · hold-out R² 0.48 (n=320, train=256, hold-out=64)

| Feature | Std coef | Effect |
|---|---:|---|
| threatDensity | +41.9pp | each std-dev of threatDensity changes T5 win-rate by +41.9pp |
| hazardsInApproach | +31.5pp | each std-dev of hazardsInApproach changes T5 win-rate by +31.5pp |
| hazardCount | -27.5pp | each std-dev of hazardCount changes T5 win-rate by -27.5pp |
| chokePointCount | -23.3pp | each std-dev of chokePointCount changes T5 win-rate by -23.3pp |
| defendedPieces | -22.2pp | each std-dev of defendedPieces changes T5 win-rate by -22.2pp |

## Hypothesis Ledger

The system's running scorecard. We pre-commit predictions, then measure. "Confirmed" = within 2pp · "Falsified" = off by more than 5pp (both scaled by confidence). The log is append-only at `data/run-playtest/experiments.jsonl`.

**Last night (0 experiments)**

_No experiments ran — see caveats._

**Rolling 7d:** confirmed: 6 · falsified: 7 · inconclusive: 4

## Methodology

- **T3 Casual** — 1-ply lookahead, "don't blunder, advance, take free captures." Mild move-selection noise.
- **T4 Sharp** — 2-ply minimax over the same eval. Lower noise.
- **T5 Expert v0.1** — 3-ply minimax, deterministic argmax. Same eval as T4 (ability-aware planner is a future upgrade).
- All bots take offers reactively and tap Aegis when threatened. Most other abilities are enumerated as concrete candidate moves and scored by eval. Bots do NOT plan multi-step ability combos.
- Rookie starts on file 4 (d1) for every sim — date-independent for stable comparisons.
- Seeds are deterministic per `levelId__tier__trial`.

### Caveats

- Ablation skipped this run (--skip-ablation).
- Ability impact skipped this run.
