# Hazard Ablation — Cross-Run Summary

**Date:** 2026-05-13
**Method:** for each level with hazards, run T3 × 30 trials with the hazards present, then again with the same puzzle's hazards removed. Δ = (without − with). **Positive Δ = removing hazards helped → hazards were obstacles. Negative Δ = removing hazards hurt → hazards were strategic walls.**

## Verdict by run

| Run | Mean Δ | Verdict |
|---|---:|---|
| Bishops Path | **+25.8pp** | hazards HURT players (strong) |
| Hazard Maze | **+16.3pp** | hazards HURT (the run named after them!) |
| Crossfire | +14.6pp | hazards HURT |
| Knight Academy | +12.5pp | hazards HURT |
| Boss Gauntlet | +11.1pp | hazards HURT |
| Iron Curtain | +10.8pp | hazards HURT |
| Royal Court | +9.2pp | hazards HURT |
| Hornets Nest | +7.5pp | hazards HURT |
| Daily Climb | +6.7pp | hazards HURT |
| The Gauntlet | +5.9pp | hazards HURT |
| Speed Demon | +2.7pp | NEUTRAL |

**Overall**: 10 of 11 runs show hazards hurt players. Average effect across the entire pool: **+11.2pp** when hazards are removed.

**Your hypothesis is mostly wrong** — but with important per-level exceptions documented below.

## Where YOUR hypothesis WAS right — hazards help Rookie

Per-level cases where removing hazards HURT (negative Δ). These are designer-aligned hazards — they block an enemy attack line more than they block Rookie.

| Level | Hazards | Win (with) | Win (without) | Δ |
|---|---:|---:|---:|---:|
| **hornets-nest/8** | 4 | **100%** | **57%** | **−43pp** ⭐ |
| **iron-curtain/7** | 4 | 53% | 33% | **−20pp** |
| **crossfire/5** | 4 | 53% | 40% | −13pp |
| **royal-court/8** | 4 | 50% | 37% | −13pp |
| **the-gauntlet/3** | 4 | 80% | 67% | −13pp |
| **crossfire/3** | 2 | 37% | 30% | −7pp |
| **boss-gauntlet/4** | 2 | 100% | 93% | −7pp |
| **iron-curtain/2** | 2 | 100% | 97% | −3pp |
| **crossfire/8** | 4 | 10% | 7% | −3pp |
| **the-gauntlet/9** | 8 | 3% | 0% | −3pp |

**10 levels (out of ~70 with hazards) demonstrate hazards-as-strategic-walls.** When the designer placed a hazard in an enemy attack line, removing it hurts. The biggest example: `hornets-nest/8` drops from 100% to 57% just by removing hazards — those 4 hazards are essential to the level working.

## Where YOUR hypothesis was MOST wrong — hazards mostly block Rookie

The 5 biggest "hazards hurt player" cases:

| Level | Hazards | Win (with) | Win (without) | Δ |
|---|---:|---:|---:|---:|
| **hazard-maze/9** | 10 | 20% | 100% | **+80pp** |
| **bishops-path/9** | 4 | 27% | 100% | **+73pp** |
| **crossfire/6** | 4 | 37% | 100% | **+63pp** |
| **hornets-nest/5** | 4 | 17% | 73% | **+57pp** |
| **hazard-maze/8** | 6 | 43% | 100% | **+57pp** |

These are levels where the hazard placement constrains Rookie's path much more than enemy paths. Removing them trivializes the puzzle.

## Design principles emerging

1. **Default assumption is correct**: most hazards are obstacles for Rookie. They make levels harder.
2. **Targeted hazards CAN be strategic walls**: when a hazard sits in an enemy's primary attack line (especially queen sightlines or knight L-jumps), removing it gives the enemy access to attack rookie. ~14% of hazard placements achieve this.
3. **`hazard-maze` may be poorly named**: the run is "hazards as the central mechanic" but the data shows hazards mostly just block Rookie. Levels 8 and 9 are the worst offenders.
4. **`bishops-path/9` is particularly punishing**: bishop diagonals + hazards combine to constrain Rookie to almost no winning paths. Removing hazards turns it into a 100% win.
5. **`hornets-nest/8` is the cleanest example of "good hazards"**: the 4 hazards block knight L-jumps that would otherwise capture Rookie. Without them, the level breaks (100% → 57%).

## What this implies for level design

When you ADD hazards, ask yourself: "is this hazard blocking an enemy attack line, or am I just narrowing the player's path?" If you can't trace a specific enemy attack the hazard prevents, you're almost certainly making the level harder for the player, not adding strategy.

**Audit candidates** — levels where hazards just block Rookie with no strategic purpose:
- hazard-maze/8 (+57pp), hazard-maze/9 (+80pp): consider redesigning
- bishops-path/9 (+73pp): probably over-hazarded
- crossfire/6 (+63pp): consider removing some hazards

**Levels to study for principles** — hazards genuinely helping Rookie:
- hornets-nest/8: hazards block knight forks
- iron-curtain/7: 4 hazards critical to the design

## Tyler's playtest connection

You felt Iron Curtain "maaaybe a touch too easy at later levels." The data shows:
- iron-curtain/2-6 are all "hazards hurt players" — the hazards aren't doing their job there
- **iron-curtain/7** has a -20pp delta — hazards critical, well-designed
- iron-curtain/8-9 hazards are slightly hurting (+0pp / +33pp)

If you want those late levels harder, **consider redesigning the hazard placements to block specific enemy attack lines** instead of just being in the way. iron-curtain/7's hazard placement is the template — find what makes those 4 hazards strategic and replicate.
