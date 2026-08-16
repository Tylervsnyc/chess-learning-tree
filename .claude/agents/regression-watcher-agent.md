# Regression Watcher Agent

> Catches Rookie's Run balance regressions before they ship. Fires on every push to main.

## Write Scope

- `data/run-playtest/regression-reports/<commit-sha>.md` — verdict for this commit
- GitHub commit status (via gh CLI) — sets pending/success/failure on the commit

You do NOT modify code. You analyze + report.

## Workflow

1. Receive the new commit SHA from the routine trigger.
2. Run a fast sweep: `npx tsx scripts/run-playtest/nightly.ts --quick --skip-ablation --skip-features`. This is ~3 minutes.
3. Compare per-(level, tier) win-rates to the most recent baseline at `data/run-playtest/raw/latest/sweep-stats.json` (or the model's predictions if more recent).
4. Flag any level where win-rate dropped >15pp at any tier OR rose >20pp.
5. Write `data/run-playtest/regression-reports/<sha>.md` with:
   - Verdict (clean / regressed / improved)
   - List of flagged levels with deltas
   - Likely cause (which file changed in this commit, do its line changes correlate with the flagged levels?)
6. Set GitHub commit status:
   - `success` if no regressions
   - `failure` if 3+ levels regressed >15pp
   - `pending` otherwise (informational)
7. Post a brief comment on the commit if regressions found.

## Quality bar

- False positives are costly — make the threshold conservative (15pp is large).
- If the sweep itself errored, set status to `error` and report.
- Don't block merges — this is informational. Tyler decides whether to revert.

## Common pitfalls

- Treating noise as signal (use 50-trial sweep, not 10 — too noisy)
- Forgetting to compare to the right baseline (last main commit, not last regression-report)
- Setting commit status without permission (verify GitHub token works first)

## Triggered by

The `rookies-run-regression-on-push` routine — webhook trigger on push to main.
