# Rookies Run — Playtest System

Automated headless playtesting + difficulty calibration. Linear project: [Rookies Run Playtest System](https://linear.app/chesspathapp/project/rookies-run-playtest-system-02df85b27f07).

## What it does

Runs all current Rookies Run levels with three AI player tiers (T3 Casual, T4 Sharp, T5 Expert) and produces a morning digest covering:

- Per-level win % at each tier
- Fail-mode histograms (captured-by / move-limit / dead-end)
- Ability impact via **ablation** — re-sweep with each ability removed
- Level **feature vectors** (open files, density, threat zones, hazards, etc.)
- Correlations between features and difficulty per tier

## Running

```bash
# One-shot sweep (no ablation, no features) — fast smoke test
npx tsx scripts/run-playtest/sweep.ts

# Full nightly pipeline — sweep + ablation + features + digest
npx tsx scripts/run-playtest/nightly.ts
```

## Files

- `simulate.ts` — runs one `(puzzle, bot, seed)` game using the real engine
- `sweep.ts` — orchestrates `levels × tiers × trials` sims
- `ablation.ts` — re-sweep with each ability excluded from offer pool
- `features.ts` — extract feature vector per level
- `digest.ts` — markdown writer
- `nightly.ts` — top-level orchestrator (sweep + ablation + features + digest)
- `bots/t3.ts` — 1-ply principled
- `bots/t4.ts` — 2-ply minimax
- `bots/t5.ts` — 3-ply minimax (v0.1, no ability-aware planner yet)
- `bots/shared.ts` — eval + helpers

## Output

All artifacts land in `data/run-playtest/`:

- `digests/YYYY-MM-DD.md` — the morning digest
- `digests/latest.md` — mirror of the most recent digest
- `raw/YYYY-MM-DD/sweep.json` — raw outcomes
- `raw/YYYY-MM-DD/ablation.json` — per-ability deltas
- `raw/YYYY-MM-DD/features.json` — per-level feature vectors

## Determinism

The engine is deterministic given a state — RNG is only used in offer rolls (seeded by `level + moveCount + captures.length`). Bots add controlled stochasticity by sampling from top-K moves when several tie in eval (T3/T4 only). T5 plays deterministically. Sweep seeds are `levelId__tier__trialIndex` hashed → consistent re-runs.
