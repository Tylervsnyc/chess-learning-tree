# Hazard Ablation Experiment

**Run filter:** `bishops-path` · **Trials per cell:** 30 · **Bot:** T3

Tyler's hypothesis: hazards make levels EASIER because they block enemies too.
Test: same level with hazards vs same level with hazards removed. Δ = (without − with).

| Level | Hazards | Win (with) | Win (without) | Δ |
|---|---:|---:|---:|---:|
| bishops-path/6 | 2 | 100% | 100% | 0pp |
| bishops-path/7 | 4 | 100% | 100% | 0pp |
| bishops-path/8 | 4 | 63% | 93% | +30pp |
| bishops-path/9 | 4 | 27% | 100% | +73pp |

**Mean Δ:** +25.8pp

**Verdict:** hazards HURT players (removing them helped — conventional wisdom)

If Δ is positive, removing hazards helped players → hazards were obstacles (conventional wisdom). If Δ is negative, removing hazards hurt players → hazards were helping rookie by blocking enemies (Tyler's hypothesis). Near zero = effects cancel out.