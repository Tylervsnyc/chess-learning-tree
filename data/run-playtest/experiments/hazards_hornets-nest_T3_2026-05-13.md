# Hazard Ablation Experiment

**Run filter:** `hornets-nest` · **Trials per cell:** 30 · **Bot:** T3

Tyler's hypothesis: hazards make levels EASIER because they block enemies too.
Test: same level with hazards vs same level with hazards removed. Δ = (without − with).

| Level | Hazards | Win (with) | Win (without) | Δ |
|---|---:|---:|---:|---:|
| hornets-nest/2 | 2 | 100% | 100% | 0pp |
| hornets-nest/3 | 2 | 23% | 27% | +3pp |
| hornets-nest/4 | 4 | 63% | 87% | +23pp |
| hornets-nest/5 | 4 | 17% | 73% | +57pp |
| hornets-nest/6 | 4 | 100% | 100% | 0pp |
| hornets-nest/7 | 4 | 50% | 70% | +20pp |
| hornets-nest/8 | 4 | 100% | 57% | -43pp |
| hornets-nest/9 | 6 | 83% | 83% | 0pp |

**Mean Δ:** +7.5pp

**Verdict:** hazards HURT players (removing them helped — conventional wisdom)

If Δ is positive, removing hazards helped players → hazards were obstacles (conventional wisdom). If Δ is negative, removing hazards hurt players → hazards were helping rookie by blocking enemies (Tyler's hypothesis). Near zero = effects cancel out.