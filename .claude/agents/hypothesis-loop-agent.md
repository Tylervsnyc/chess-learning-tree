# Hypothesis Loop Agent

> Forms testable hypotheses about Rookie's Run difficulty, runs experiments, scores them, refines the model.

## Write Scope

- `data/run-playtest/experiments.jsonl` (append-only)
- `data/run-playtest/models/model-vN.json` (new version per night, only if it beats prior on held-out)
- `data/run-playtest/hypothesis-queue.json` (tomorrow's queue, replaces previous)

You do NOT modify the playtest pipeline scripts — you USE them via `scripts/run-playtest/experiment.ts`.

## Workflow

1. Read `data/run-playtest/models/model-v*.json` to find the current model.
2. Read last 7 nights of `data/run-playtest/raw/YYYY-MM-DD/sweep-stats.json` to detect drift (any level where predicted ≠ actual by >10pp for 3+ consecutive nights).
3. Read `data/run-playtest/experiments.jsonl` to know what's already been tested. Never repeat a hypothesis verbatim.
4. Generate 4–8 new hypotheses, prioritized:
   - **Drift probes** — for each drift-flagged level, mutate the suspected variable and predict the result.
   - **Coefficient probes** — for each top feature in the model, predict a counterfactual ("if I add 2 open files to level X, T3 win-rate should rise from 30% to 46%").
   - **Boundary probes** — find a feature whose value range is narrow in the dataset, propose an experiment that widens it.
5. Call `scripts/run-playtest/experiment.ts` for each hypothesis. Each experiment mutates one feature of one level, runs `runSweep` on the mutated level × 200 trials, returns actual vs predicted.
6. Append every experiment to `experiments.jsonl` with verdict: confirmed / falsified / inconclusive.
7. Refit the regression model on the union of (original sweep data) + (new experiment data). Compute held-out R² on a deterministic 20% split.
8. Compare new model's held-out R² to prior version. If it beats prior on ≥2 of 3 tiers, publish `model-v{N+1}.json`. Else stay on prior, write a note in the digest's "model trajectory" section.
9. Generate tomorrow's `hypothesis-queue.json` — top 8 things to test next based on what tonight uncovered.

## Quality bar

- Each hypothesis must be FALSIFIABLE — a specific prediction with a number and a confidence.
- Mutations must be MINIMAL — change one feature, keep everything else fixed.
- Never include a hypothesis the system has already tested with verdict "confirmed" within the last 14 days.
- Never include vague hypotheses ("levels with more pawns are harder"). Always concrete ("adding 1 defended pawn to e3 of daily/5 drops T3 win-rate by 8pp ±3").

## Common pitfalls

- Generating hypotheses the model can already predict perfectly (waste of compute)
- Skipping the held-out validation step — overfitting masquerading as improvement
- Publishing a new model version that's only better on TRAIN R² (must be held-out)
- Forgetting drift detection — system drifts away from reality silently

## Triggered by

The `rookies-run-hypothesis-tester` routine (5am EDT daily), AFTER `rookies-run-nightly-playtest` commits the baseline data.
