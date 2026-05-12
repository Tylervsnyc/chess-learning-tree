# Rookie's Run — Remote Routine Inventory

The routines that operate the playtest system. Each is a remote agent scheduled via the Claude Code `RemoteTrigger` API. They run independently in Anthropic's cloud — no local machine required.

## Live routines

### `rookies-run-nightly-playtest` ✅
- **ID:** `trig_01K7Bb5SjZDPJ4VjErxrMuM7`
- **Schedule:** `0 8 * * *` (daily 4am EDT / 8am UTC)
- **Action:** Full sweep + ablation + features + regression + hypothesis loop + digest
- **Commits:** `data/run-playtest/digests/YYYY-MM-DD.md` + raw outputs

## Drafts — to create after agents land

### `rookies-run-narrative-overlay`
- **Schedule:** N/A — fires reactively when nightly commits a new digest. Implement as an `on-push` webhook trigger or a `0 9 * * *` cron (1 hour after nightly).
- **Dispatches:** `digest-narrator-agent`
- **Prompt skeleton:**
  > You are the digest narrator. Read `.claude/agents/digest-narrator-agent.md` for your role.
  >
  > Today's digest is at `data/run-playtest/digests/$(date +%Y-%m-%d).md`. Read it, plus the last 7 days' digests, plus `data/run-playtest/experiments.jsonl`, plus prior weekly lessons. Write 200–400 words of commentary, append under `## Narrative Commentary` to today's digest. Commit + push.
  >
  > If it's Sunday, also write the weekly memoir at `data/run-playtest/lessons/$(date +%Y-%V).md` reflecting on the week's evolving beliefs.

### `rookies-run-hypothesis-tester`
- **Schedule:** `0 9 * * *` (5am EDT / 9am UTC — 1 hour after baseline)
- **Dispatches:** `hypothesis-loop-agent`
- **Prompt skeleton:**
  > You run the nightly hypothesis loop. Read `.claude/agents/hypothesis-loop-agent.md` for your role.
  >
  > Pull main. Generate 4-8 hypotheses based on the most recent digest + experiment log + model. Run each via `npx tsx scripts/run-playtest/experiment.ts <hypothesis-json>`. Append outcomes to `experiments.jsonl`. Refit regression. Propose new model version — only publish if held-out R² beats prior on ≥2 of 3 tiers. Update `hypothesis-queue.json` for tomorrow. Commit + push.

### `rookies-run-parallel-mutator`
- **Schedule:** `0 10 * * *` (6am EDT / 10am UTC)
- **Dispatches:** 10 parallel `mutator-explorer-agent` instances
- **Prompt skeleton:** (orchestrator)
  > You orchestrate parallel level mutation. Spawn 10 mutator-explorer-agent instances in background, each with a different seed level from `lib/run/runs.ts`. Wait for all to complete (~30 min). Consolidate their outputs into `data/run-playtest/candidate-levels/$(date +%Y-%m-%d)/summary.md` ranked by fitness-distance-to-envelope. Commit + push.

### `rookies-run-regression-on-push`
- **Schedule:** Webhook (on every push to main), OR fallback `0 */1 * * *` (hourly during work hours)
- **Dispatches:** `regression-watcher-agent`
- **Prompt skeleton:**
  > A new commit landed on main. Read `.claude/agents/regression-watcher-agent.md` for your role.
  >
  > Pull main. Run fast sweep (`--quick --skip-ablation --skip-features`). Compare to last clean baseline. Flag levels where win-rate drifted >15pp. Write `data/run-playtest/regression-reports/<sha>.md`. Set GitHub commit status accordingly. Comment on commit if regressions found. Commit + push the report.

### `rookies-run-weekly-ability-design`
- **Schedule:** `0 11 * * 0` (Sunday 7am EDT)
- **Dispatches:** `ability-designer-agent`
- **Prompt skeleton:**
  > Weekly ability design pass. Read `.claude/agents/ability-designer-agent.md` for your role.
  >
  > Analyze the past week's ablation + combo matrices. Identify gaps in the current ability space. Propose 5 candidate abilities. Write design docs + JSONs to `data/run-playtest/candidate-abilities/$(date +%Y-%V)/`. Rank in `summary.md`. Commit + push.

### `rookies-run-replay-curate`
- **Schedule:** `0 9 * * *` (5am EDT, same time as hypothesis loop — runs in parallel)
- **Dispatches:** `replay-curator-agent`
- **Prompt skeleton:**
  > Curate informative replays from last night's sweep. Read `.claude/agents/replay-curator-agent.md` for your role.
  >
  > Read `data/run-playtest/raw/$(date +%Y-%m-%d)/sweep.json`. Pick 5-8 informative games. Generate traces via `npx tsx scripts/run-playtest/trace.ts ...`. Write `data/run-playtest/curated-replays/$(date +%Y-%m-%d).md`. Commit + push.

## How they compose

Each routine writes to a deterministic file location and commits. Routines downstream pull the latest commit before running, so they always see the most recent upstream work.

Daily timeline (all EDT):
- 4:00am — `rookies-run-nightly-playtest` (sweep + ablation + features + digest) — 40 min
- 5:00am — `rookies-run-hypothesis-tester` — 20 min
- 5:00am — `rookies-run-replay-curate` — 10 min (parallel with hypothesis tester)
- 6:00am — `rookies-run-parallel-mutator` (10 instances) — 30 min
- 9:00am — `rookies-run-narrative-overlay` (after morning quiet) — 5 min
- Sunday 7:00am — `rookies-run-weekly-ability-design`
- Anytime — `rookies-run-regression-on-push` on commits to main

By 9am EDT every day, the morning digest at `data/run-playtest/digests/latest.md` is fully assembled with:
1. Mechanical tables (from nightly)
2. Hypothesis ledger (from hypothesis-tester)
3. Curated replays section (from replay-curate)
4. Candidate levels section (from parallel-mutator)
5. Narrative commentary (from narrative-overlay)

Tyler wakes up, opens `/admin/playtest-live` on his phone, gets the full story in 2 minutes.
