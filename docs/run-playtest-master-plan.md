# Rookie's Run — Playtest System Master Plan

**One sentence:** Build a self-improving research system that makes Rookie's Run never run out of fun-hard daily levels, surfaces what makes abilities great, and proves itself smarter every night.

**Linear project:** [Rookie's Run Playtest System](https://linear.app/chesspathapp/project/rookies-run-playtest-system-02df85b27f07)
**Live watch page:** `/admin/playtest-live`
**Nightly routine:** [trig_01K7Bb5SjZDPJ4VjErxrMuM7](https://claude.ai/code/routines/trig_01K7Bb5SjZDPJ4VjErxrMuM7)

---

## The three pillars

### Pillar 1 — Unlimited fun-hard levels

The end state: never hand-design a daily level again. Mutator pipeline generates candidates at target difficulty, you swipe to approve, the model predicts difficulty before any sim runs.

### Pillar 2 — Great abilities & combinations

The end state: a measured catalogue of every ability's impact, every pair's synergy, and a designer-agent that proposes new abilities filling gaps in the current pool.

### Pillar 3 — Total understanding

The end state: every game logged with reasoning, every decision replayable in browser, every digest narrated with research-style commentary that accumulates institutional memory.

---

## Status by layer

Legend: ✅ shipped · 🟡 in progress · 🔲 next · 🕐 later

### Pillar 1 — Unlimited fun-hard levels

| ID | Layer | Status | Notes |
|---|---|---|---|
| L1.1 | Headless harness + T3/T4/T5 bots | ✅ | 1-ply, 2-ply minimax, 3-ply minimax. Smoke-tested. |
| L1.2 | Univariate factor model (Pearson r) | ✅ | 19 features, per-tier r + top/bottom quartile means. |
| L1.3 | Multivariate regression with held-out R² | 🟡 | Ridge regression, 20% held-out per tier, coefficients in plain English. |
| L1.4 | Hypothesis loop + experiment log + versioned model | 🟡 | Append-only experiments.jsonl, new model version only published if it beats prior on held-out. |
| L1.5 | Parallel mutator (10 agents/night) | 🔲 | Each hill-climbs from a different seed level. |
| L1.6 | Candidate review queue (phone-swipeable) | 🔲 | Mobile UI for promoting candidate levels into `lib/run/runs.ts`. |
| L1.7 | Real-player calibration | 🕐 | Requires production telemetry. Fits "humanness" to T3/T4 bot params. |

### Pillar 2 — Great abilities & combinations

| ID | Layer | Status | Notes |
|---|---|---|---|
| L2.1 | Ablation matrix (each ability removed) | ✅ | Tagged op/trash/expert-only/trap/normal. |
| L2.2 | Forced-take analysis | 🟡 | Force-accept vs force-skip per ability. |
| L2.3 | T5 v0.2 ability-aware planner | 🟡 | Surge planning, Aegis timing, transform lookahead. Must beat v0.1 on benchmark to ship. |
| L2.4 | Pair-combo matrix (10×10) | 🟡 | Every (A,B) pair seeded together. Synergy = combo delta − sum of solo deltas. |
| L2.5 | Triple-combo discovery | 🔲 | Top-K (A,B,C) sets that produce emergent strategies. |
| L2.6 | Ability designer agent | 🔲 | Proposes 5 new abilities/night, filling gaps. Auto-tested by L2.1/L2.2/L2.4. |
| L2.7 | Auto-PR balance changes | 🕐 | After 3 consecutive OP flags, opens a PR with proposed nerf + data. |

### Pillar 3 — Total understanding

| ID | Layer | Status | Notes |
|---|---|---|---|
| L3.1 | Morning digest (mechanical) | ✅ | Tables, correlations, ablation matrix, fail modes. |
| L3.2 | Watch page (mobile-friendly) | ✅ | `/admin/playtest-live` polls GitHub directly. |
| L3.3 | Narrative commentary (Claude-as-researcher) | 🔲 | Reads digest + prior digests + experiment log → writes commentary. |
| L3.4 | Decision trace (every action with reasoning) | 🟡 | Optional `recordTrace=true` mode in simulate.ts. |
| L3.5 | Replay viewer | 🟡 | `/admin/playtest-replay/[runId]/[level]/[tier]/[trial]`. |
| L3.6 | Rich dashboard | 🕐 | Cowork work — charts, sortable level table, swipeable candidates. |
| L3.7 | Production telemetry instrumentation | 🕐 | Real player actions → analytics → digest. Requires Pillar 1.7 prereq. |

---

## Cross-cutting infrastructure

### Specialized agents (6 to create)

Each lives in `.claude/agents/<name>.md`. Self-contained, file-bounded, invokable from any session or routine.

| Agent | Owns | Triggered by |
|---|---|---|
| `digest-narrator` | Writes commentary on each digest | After each nightly run commits |
| `hypothesis-loop` | Forms + tests hypotheses | Part of nightly pipeline |
| `mutator-explorer` | Hill-climbs new levels (10 in parallel) | Dedicated nightly routine |
| `ability-designer` | Proposes new abilities | Weekly routine |
| `regression-watcher` | Catches balance regressions | On every push to main |
| `replay-curator` | Picks most informative games per night | After nightly digest |

### Remote routines (5 to operate)

| Routine | Schedule | Action |
|---|---|---|
| `rookies-run-nightly-playtest` | 4am EDT daily | ✅ Already live. Full sweep + ablation + digest. |
| `rookies-run-narrative-overlay` | After nightly commits | 🔲 Dispatches digest-narrator. |
| `rookies-run-hypothesis-tester` | 5am EDT daily | 🔲 Runs the experiment queue (Phase 4 part 2). |
| `rookies-run-parallel-mutator` | 6am EDT daily | 🔲 Spawns 10 mutator-explorer instances. |
| `rookies-run-regression-on-push` | On every main push | 🔲 Fast sweep (50 trials) to flag balance regressions. |

---

## How the system improves itself

Five compounding mechanisms (see prior conversation for details):

1. **Append-only experiment log** — `data/run-playtest/experiments.jsonl`. System's permanent memory.
2. **Held-out test set per night** — 20% of experiments score the current model. Held-out R² is the "smartness score." Cannot overfit our way to confidence.
3. **Versioned model with earned upgrades** — `data/run-playtest/models/model-vN.json`. New version only published if it beats prior on held-out test.
4. **Drift detection** — levels where the model predicts X but reality stays at Y for 3+ nights get flagged as open mysteries; queued as priority hypothesis targets.
5. **Weekly lessons-learned memoir** — every Sunday, an agent reads the full log + all prior digests, writes `data/run-playtest/lessons/YYYY-WW.md`. Next week's narrator reads ALL prior lessons. Wisdom accumulates.

### Trajectory metrics (in every Friday digest)

- **Predictive accuracy**: held-out R² week over week. Should rise then plateau.
- **Bot strength**: Elo-equivalent of T5 against a fixed challenge battery. Each T5 upgrade must beat prior on this battery before shipping.

If both metrics plateau for 4 weeks → bot-only research has saturated → bring in real-player calibration (L1.7) and start a fresh learning curve grounded in actual humans.

---

## Honest caveats

1. **Bot-Rookie's-Run ≠ Human-Rookie's-Run.** Every digest will be explicit: "the model says X about bot-rookie. Confidence that this transfers to humans: medium." Until real player data flows, we can't close that gap.
2. **T5 quality is load-bearing.** If a level shows up as "broken (T5 still struggles)," it might be that T5 isn't strong enough yet, not that the level is broken. v0.2 planner is the first response. MCTS / iterative deepening could come later.
3. **A perfect difficulty model can't replace taste.** The system tells you "level X is 47% T3." It doesn't tell you whether players enjoyed it. Curation by your gut remains in the loop.
4. **Cost is a real signal.** Heavy combo sweeps + multiple parallel routines cost real tokens. Plan permits ambitious use but we monitor.

---

## Tonight's ship list (May 12 → May 13 morning)

In progress right now via 5 parallel background agents:

- [x] L1.1 Headless harness + 3 bots
- [x] L1.2 Univariate model
- [x] L2.1 Ablation
- [x] L3.1 Morning digest
- [x] L3.2 Watch page
- [ ] L1.3 Multivariate regression
- [ ] L1.4 Hypothesis loop + experiment log + versioned model
- [ ] L2.2 Forced-take
- [ ] L2.3 T5 v0.2 + benchmark
- [ ] L2.4 Pair-combo matrix
- [ ] L3.4 Decision trace
- [ ] L3.5 Replay viewer

Plus: master plan doc (this file), 6 agent definitions, 4 additional remote routines drafted.

By morning: first real digest from the manual run + scheduled 4am digest + everything above merged to main.

---

## What ships next week

- L1.5 Parallel mutator (depends on hypothesis loop being solid)
- L1.6 Candidate review queue (mobile UI; some Cowork work)
- L2.5 Triple-combo discovery
- L2.6 Ability designer agent
- L3.3 Narrative commentary (depends on multiple nights of digests to read)
- L3.6 Rich dashboard (Cowork)

## What ships when production data flows

- L1.7 Real-player calibration
- L2.7 Auto-PR balance changes
- L3.7 Production telemetry instrumentation
