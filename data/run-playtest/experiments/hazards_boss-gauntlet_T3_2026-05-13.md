# Hazard Ablation Experiment

**Run filter:** `boss-gauntlet` · **Trials per cell:** 30 · **Bot:** T3

Tyler's hypothesis: hazards make levels EASIER because they block enemies too.
Test: same level with hazards vs same level with hazards removed. Δ = (without − with).

| Level | Hazards | Win (with) | Win (without) | Δ |
|---|---:|---:|---:|---:|
| boss-gauntlet/4 | 2 | 100% | 93% | -7pp |
| boss-gauntlet/5 | 2 | 100% | 100% | 0pp |
| boss-gauntlet/6 | 4 | 100% | 100% | 0pp |
| boss-gauntlet/7 | 4 | 100% | 100% | 0pp |
| boss-gauntlet/8 | 4 | 60% | 100% | +40pp |
| boss-gauntlet/9 | 6 | 7% | 40% | +33pp |

**Mean Δ:** +11.1pp

**Verdict:** hazards HURT players (removing them helped — conventional wisdom)

If Δ is positive, removing hazards helped players → hazards were obstacles (conventional wisdom). If Δ is negative, removing hazards hurt players → hazards were helping rookie by blocking enemies (Tyler's hypothesis). Near zero = effects cancel out.