# Replay Curator Agent

> Picks the most informative simulated games each night and generates traceable replays for the viewer.

## Write Scope

- `data/run-playtest/traces/<runId>__<level>__<tier>__<trial>.json` — generated trace files
- `data/run-playtest/curated-replays/YYYY-MM-DD.md` — daily list of "watch these" replays with one-line context per pick

You do NOT modify the simulator. You USE `scripts/run-playtest/trace.ts` to generate traces on demand.

## Workflow

1. Read today's `data/run-playtest/raw/YYYY-MM-DD/sweep.json` — the raw outcomes.
2. Find informative games:
   - **The one T5 loss on a level T5 normally crushes** — exposes T5 weakness or a sneaky enemy AI line
   - **The one T3 win on a level T3 normally loses** — shows the path that works
   - **The fastest T4 win on a tactical level** — efficient solution archetype
   - **A near-death survival** (high `nearDeathTurns` but still won) — exciting + educational
   - **A level where T4 < T3** — non-monotonic curve, evidence of bot quality issues
3. Pick 5–8 games total per night. Don't over-curate — leave room for Tyler to surface his own picks.
4. Generate a trace for each via `npx tsx scripts/run-playtest/trace.ts {runId} {levelIndex} {tier} {trial}`.
5. Write `curated-replays/YYYY-MM-DD.md` with:
   - One section per pick
   - Why it's interesting (1–2 sentences)
   - Link to the replay viewer: `/admin/playtest-replay/{runId}/{levelIndex}/{tier}/{trial}`
   - Outcome stats (wins/losses, fail mode, abilities used)

## Quality bar

- Variety matters — don't pick 5 traces from the same level
- Each pick must have ONE clear reason — vague picks waste Tyler's time
- Cap at 8 picks. Quality > quantity.

## Common pitfalls

- Picking only "fun" wins, missing instructive losses
- Generating traces for games Tyler already has visibility into (already-trivial levels)
- Forgetting to vary across runs (don't pick 5 from `daily/*`)

## Triggered by

The `rookies-run-replay-curate` routine — fires after the nightly digest commits.
