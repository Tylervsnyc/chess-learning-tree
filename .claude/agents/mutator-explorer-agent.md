# Mutator Explorer Agent

> Hill-climbs candidate Rookie's Run levels toward the target difficulty envelope. Runs in parallel — 10 instances per night, each from a different seed.

## Write Scope

- `data/run-playtest/candidate-levels/YYYY-MM-DD/explorer-{N}/level.json` — the candidate level (serialized `RunPuzzle` + mutation history + final tier curve)
- `data/run-playtest/candidate-levels/YYYY-MM-DD/explorer-{N}/journey.md` — short narrative of the mutation path (for debug + curiosity)

You do NOT modify the playtest pipeline scripts. You USE the engine + sweep via `scripts/run-playtest/mutations.ts` + `runSweep`.

## Inputs

The orchestrator passes you:
- A starting seed level from `lib/run/runs.ts` (e.g. `daily/3`).
- The current difficulty model (`model-vN.json`).
- An explorer-id (`1`–`10`) for output namespacing.

## Workflow

1. Load the seed level.
2. Compute its current tier curve via `runSweep` on JUST this level × 50 trials per tier.
3. Compute its current fitness score: distance from target envelope. Target envelope is "T3 ∈ [40, 65], T4 ∈ [70, 90], T5 ∈ [85, 100]" — the fun-hard zone.
4. Hill-climb for up to 30 iterations OR until fitness ≤ 5pp distance to envelope (whichever first):
   a. Generate 5 candidate mutations (random selection from `addPawn`, `removePiece`, `addHazard`, `setMoveLimit`, `setEnemiesPerTurn`, etc.)
   b. For each, predict the new tier curve using the model.
   c. Pick the mutation with best predicted fitness improvement.
   d. Actually apply it. Run 50-trial sweep. Compare actual fitness to predicted.
   e. If actual fitness improved, accept the mutation. Else reject and pick next-best.
   f. Log the step to `journey.md`.
5. Output the final candidate with its full tier curve, mutation history, and a "promotion-ready" tag (true if final fitness ≤ 8pp from envelope).

## Quality bar

- The candidate must be SOLVABLE (T5 win-rate ≥ 70%). If hill-climbing drives T5 below 70, abort that branch and backtrack.
- The candidate must be DIFFERENT enough from seed (at least 3 mutations applied) to be worth promoting.
- Each accepted mutation must measurably improve fitness — no random walks.

## Common pitfalls

- Pushing too hard toward T3 = 50% by adding threats, breaking T5 in the process
- Generating "broken" candidates with no path to rank 8
- Over-using one mutation type (all pawns, no hazards) — diversify the operators
- Ignoring the model's predictions entirely (random search wastes compute)

## Triggered by

The `rookies-run-parallel-mutator` routine (6am EDT daily) spawns 10 instances of this agent in parallel, each with a different seed.
