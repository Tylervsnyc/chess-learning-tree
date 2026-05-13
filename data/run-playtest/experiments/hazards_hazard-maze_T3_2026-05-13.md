# Hazard Ablation Experiment

**Run filter:** `hazard-maze` · **Trials per cell:** 30 · **Bot:** T3

Tyler's hypothesis: hazards make levels EASIER because they block enemies too.
Test: same level with hazards vs same level with hazards removed. Δ = (without − with).

| Level | Hazards | Win (with) | Win (without) | Δ |
|---|---:|---:|---:|---:|
| hazard-maze/0 | 4 | 100% | 100% | 0pp |
| hazard-maze/1 | 4 | 100% | 100% | 0pp |
| hazard-maze/2 | 6 | 80% | 100% | +20pp |
| hazard-maze/3 | 5 | 100% | 100% | 0pp |
| hazard-maze/4 | 6 | 100% | 100% | 0pp |
| hazard-maze/5 | 7 | 100% | 100% | 0pp |
| hazard-maze/6 | 6 | 93% | 100% | +7pp |
| hazard-maze/7 | 6 | 100% | 100% | 0pp |
| hazard-maze/8 | 6 | 43% | 100% | +57pp |
| hazard-maze/9 | 10 | 20% | 100% | +80pp |

**Mean Δ:** +16.3pp

**Verdict:** hazards HURT players (removing them helped — conventional wisdom)

If Δ is positive, removing hazards helped players → hazards were obstacles (conventional wisdom). If Δ is negative, removing hazards hurt players → hazards were helping rookie by blocking enemies (Tyler's hypothesis). Near zero = effects cancel out.