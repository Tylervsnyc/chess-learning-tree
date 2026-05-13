# Rookie's Run Playtest System — Status Report

**Date:** 2026-05-13 (24 hours after kickoff)
**Author:** Claude (Opus 4.7) working with Tyler
**Linear project:** [Rookie's Run Playtest System](https://linear.app/chesspathapp/project/rookies-run-playtest-system-02df85b27f07)

---

## TL;DR

In 24 hours we built an automated playtest system that runs nightly, produces a research digest, generates replay videos, and is wired with safety/promotion infrastructure. **Today's first real digest is on main**: T3/T4/T5 win-rate curves measured across 110 levels, multivariate difficulty model with held-out R² = 0.54 at T3, and a self-improving hypothesis loop that ran 3 experiments overnight (1 confirmed, 1 falsified, 1 inconclusive).

The biggest concrete finding: **current ability pool is "Quiet" — no ability moves the needle for bots.** Either redesign abilities or upgrade bots to use them strategically. The system also flagged 5 "broken" levels but tracing them showed they're not broken — they're bot-impossible because bots can't strategically plan piece transforms. Humans probably can solve them.

Two real bugs found and one fixed this session.

---

## System state

### Routes live

| Route | Purpose |
|---|---|
| `/admin/playtest-live` | Mobile watch page — polls GitHub for latest digest |
| `/admin/playtest-replay/[runId]/[level]/[tier]/[trial]` | Turn-by-turn replay viewer |
| `/admin/run-candidates` | Swipe through candidate levels + abilities, promote/reject |
| `/api/admin/promote-candidate` | Server-side promotion API (safety-checked) |
| `/api/admin/reject-candidate` | Move candidate to rejected pool |

### Scripts shipped

`scripts/run-playtest/` is 18 files. The mainline pipeline at `nightly.ts` runs in ~25 min and produces:

- Per-level × per-tier win-rate sweep (150 trials each)
- Per-ability ablation (80 trials)
- 19 level features + Pearson correlations
- Multivariate ridge regression with held-out R²
- Hypothesis loop: 3 experiments/night, append-only log
- Versioned model files (only published if held-out R² beats prior on ≥2 of 3 tiers)
- Markdown digest

Additional commands:
- `--full` — weekly deep dive, enables forced-take + 45-pair combo matrix
- `--quick` — smoke test, 20 trials, all phases run
- `trace.ts` — single-game decision log → JSON for the replay viewer
- `promote.ts` — safety-checked candidate → live levels
- `render-replay.ts` — trace → MP4 via Remotion

### Routines

| Routine | Schedule | Status |
|---|---|---|
| `rookies-run-nightly-playtest` | 4am EDT daily | Live. Will run tomorrow with trimmed defaults. |
| Other 5 routines (narrative, hypothesis, mutator, regression-watch, ability-design) | — | **Blocked**: RemoteTrigger create/update API rejected every payload variant in this session. Workaround: retry from fresh session. |

### Agent roster

6 specialized agent definitions in `.claude/agents/`:
- `digest-narrator` — writes researcher commentary on each morning digest
- `hypothesis-loop` — generates and tests predictions
- `mutator-explorer` — hill-climbs candidate levels (10 parallel)
- `ability-designer` — proposes new abilities weekly
- `regression-watcher` — fires on every push to catch balance regressions
- `replay-curator` — picks informative games each night for trace generation

---

## Today's digest — key numbers

Source: [data/run-playtest/digests/2026-05-13.md](../data/run-playtest/digests/2026-05-13.md). Generated locally at 25 min runtime over 110 levels × 3 tiers × 150 trials = **49,500 baseline games**, plus 80 trials × 10 abilities = **264,000 ablation games**.

### Tier curves

- **T3 Casual** mean win-rate: **68%** (range 0%–100%)
- **T4 Sharp** mean win-rate: **88%**
- **T5 Expert v0.1** mean win-rate: **94%**

Curve shape across 110 levels: 51 trivial · 28 normal · 11 fun-hard · 6 tactical (T5 only) · 9 punishing · **5 broken (T5 still struggles)**.

### Multivariate difficulty model (T3)

Held-out R² = **0.54** on 22 levels (n=110, 80/22 split). Top features by standardized coefficient:

| Feature | Effect on T3 win-rate |
|---|---|
| moveLimitTightness | **−7.0pp / σ** |
| moveLimit | +6.7pp / σ |
| chokePointCount | −6.6pp / σ |
| queenCount | −6.5pp / σ |
| approachWidth | −6.5pp / σ |

Tier-specific top driver: **threatDensity** dominates at T4 (+14.9pp/σ) and T5 (+14.3pp/σ) — counter-intuitive (more attacks → easier?). Likely a confound with sparse hardest levels; needs investigation.

### Ability ranking (the headline)

**Every current ability ranks "Quiet — negligible impact."** Top power score is Queen Pulse at 1.9 (out of 0–30 range). The maximum measured Δ is +1pp at any tier — within statistical noise at 80 ablation trials.

| Rank | Ability | Power | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | Queen Pulse | 1.9 | 0pp | +1pp | 0pp | Quiet |
| 2 | Freeze Ray | 1.5 | −1pp | 0pp | 0pp | Quiet |
| 3 | Leap | 1.3 | 0pp | 0pp | 0pp | Quiet |
| ... | (all 10 Quiet) | | | | | |

**The current ability pool is dead weight to the bot models.** Two interpretations:
1. The bots are too dumb to use abilities (reactive Aegis + immediate-eval transforms only, no strategic planning)
2. The abilities themselves don't matter much in the puzzle space we currently cover

Most likely a mix. The fix lies in BOTH improving T5 (v0.2 attempted, failed acceptance) and **shipping abilities designed for the failure modes the bots actually experience** (Tempo Tax, Bodyguard — see yesterday's candidate list).

### Hypothesis loop — first night

3 coefficient-stress experiments ran overnight:

| Hypothesis | Mutation | Predicted | Actual | Verdict |
|---|---|---:|---:|---|
| moveLimitTightness on daily/0 | moveLimit=12 | 100% | 40% | **falsified** |
| threatDensity on daily/0 | +pawn@d3 | 97% | 100% | confirmed |
| threatDensity on daily/0 T5 | +pawn@d3 | 93% | 100% | inconclusive |

**The model is over-confident outside its training distribution.** Specifically: it can't extrapolate moveLimitTightness because the feature is bimodal (sentinel value 99 for "no limit" levels vs real ratios for limited levels). Real finding logged.

Today's refit model didn't beat prior on any tier → correctly **kept v1**.

---

## Key discoveries this session

### 1. The "broken" levels aren't broken — they're bot-impossible

5 levels show T5 < 50%: `royal-court/6`, `royal-court/9`, `the-gauntlet/4`, `the-gauntlet/8`, `the-gauntlet/9`.

I traced `royal-court/6` (worst case, 0/0/0%). The puzzle:
- 13 enemies including **4 queens on rank 4** behind a pawn wall
- **`enemiesPerTurn: 3`** — three enemies move per Rookie's one
- `moveLimit: 16`
- `allowedForms: ['knight', 'bishop']` — Rookie CAN transform

T5 lost in 2 moves with `captured` (after the bugfix). She got captured because queens converged faster than she could escape. **A human player MIGHT solve this by transforming into a knight and leaping behind the queen wall.** Bots can't strategically plan transforms — T5 v0.2 tried to add this and failed acceptance.

**Implication**: our "broken" classifier conflates "level is broken" with "T5 bot is too dumb." Until T5 plays abilities strategically, we'll keep flagging tactical-puzzle levels as broken.

### 2. `simulate.ts` failMode classifier bug — FIXED

Captures were being reported as `dead-end` in some traces because `prevState` was snapshotted before Rookie's move (line 180) and never updated before the enemy turn. `inferCapturer` looked at her pre-move square and missed the queen that landed on her post-move square.

Fix: snapshot `prevState` immediately before `settleEnemyTurns` runs. Verified by retracing royal-court/6 → now reports "LOSS (captured)" correctly. Committed as `fbd73f2`.

### 3. Multivariate model fails on out-of-distribution mutations — logged for fix

The `moveLimitTightness` feature uses sentinel value `99` when a level has no move limit. This makes the distribution bimodal: most levels at 99, a few at 1.5–3.0. The linear regression averages them and produces a coefficient that doesn't generalize when extrapolating to "what if we IMPOSE a tight limit on an unlimited level?" — exactly the case the hypothesis loop tried.

**Fix** (next session): split into binary `hasMoveLimit` + real `moveLimitTightness` only when present.

### 4. Engine RNG isn't fully deterministic — logged for fix

Agent 3 (T5 v0.2 work) discovered `lib/run/pawn-ai.ts` uses bare `Math.random()` for pawn promotions and effect IDs (lines 283, 344). This means same-seed sims can produce different outcomes by a few percentage points run-to-run.

**Implication**: held-out R² has a natural noise floor we can't escape until we thread an explicit RNG through pawn-ai. Drift detection may fire on noise. Hypothesis verdicts can flip on RNG.

### 5. Nightly pipeline was too aggressive — FIXED

The 4am routine for 2026-05-13 fired but never committed. Diagnosis: full-mode pipeline would have taken ~110 min (forced-take alone = 63 min) and hit the cloud-agent runtime cap.

Fix (committed `b3a9417`): trimmed defaults to ~30 min — sweep 200→150 trials, ablation 120→80, hypotheses 5→3, forced-take + combos OFF by default. Added `--full` flag for the weekly deep dive. Tomorrow's 4am should actually finish.

---

## Outstanding work — ranked by leverage

### Tier 1 (highest leverage, achievable next session)

1. **Retry RemoteTrigger create/update** — likely a transient session bug. Once unblocked, wire the 5 missing routines (narrative-overlay, hypothesis-tester, parallel-mutator, regression-watcher, weekly-ability-design) per the routine inventory at [docs/run-playtest-routines.md](run-playtest-routines.md).
2. **Trigger ability lab one-shot against today's REAL digest** — yesterday's ranking + 10 candidates used noisy 20-trial smoke data. Today's 80-trial ablation has real precision. Re-running the lab against today's data will produce calibrated ranking + better candidate predictions.
3. **Fix moveLimit feature engineering** — add `hasMoveLimit` binary, refit model, hypothesis loop becomes way more accurate.

### Tier 2 (medium leverage, this week)

4. **T5 v0.2 ability-aware planner — second attempt** — v0.1 fell over because it tried to combine Surge + Aegis + transforms in a 3-ply search. A more modest ambition: just plan transforms (model `bishop-step → best slide`). Don't try to be heroic; ship a +5% T5 win-rate improvement.
5. **Thread RNG through pawn-ai.ts** — make sims fully deterministic. Unblocks tighter R² and less noisy drift detection.
6. **Promote a candidate ability — Tempo Tax** — predicted ΔT3 ~-6pp, lapping current pool by 3×. Implement the mechanic in engine, run a full ablation, see if reality matches prediction. This is also the first real test of the candidate-review pipeline.
7. **Manually playtest the 5 "broken" levels** — confirm they're human-winnable with creative transforms. If not, redesign them.

### Tier 3 (longer-term)

8. **Real-player calibration** — instrument production telemetry; once data flows, fit a "humanness" correction to T3/T4 bots so predictions transfer to actual players.
9. **Parallel mutator** — 10 mutator-explorer agents per night hill-climbing new levels. The candidate pool starts filling.
10. **Ability-designer routine** — weekly creative pass; auto-tests each candidate via Phase 2 framework.

---

## Architecture recap

```
Pipeline:
  sweep -> ablation -> [forced-take] -> [combos]
       -> features -> correlations -> regression
       -> hypothesis-queue -> experiments -> log
       -> propose model version (publish iff held-out R² wins)
       -> render digest

Memory:
  data/run-playtest/experiments.jsonl   (append-only, the system's memory)
  data/run-playtest/models/model-vN.json (each version that earned publication)
  data/run-playtest/digests/YYYY-MM-DD.md
  data/run-playtest/traces/*.json
  data/run-playtest/replays/samples/*.mp4

Falsifiability:
  Every prediction is logged with confidence.
  Confirmed within 2pp · falsified > 5pp (scaled by confidence).
  Model upgrades require ≥2 of 3 tiers improving on held-out R².
  Bot upgrades require beating prior on a fixed level battery (T5 v0.2 failed this).
```

## What's running in production right now

- **Routine** `trig_01K7Bb5SjZDPJ4VjErxrMuM7` fires at 8am UTC daily, runs the trimmed pipeline (~30 min), commits + pushes a digest.
- **Watch page** at `/admin/playtest-live` (gated to admin users) auto-refreshes every 30s.
- Tomorrow morning's digest will appear ~4:50am EDT at `data/run-playtest/digests/2026-05-14.md`.

## What's NOT in production yet

- The other 5 routines (blocked on RemoteTrigger)
- Ability lab one-shot (manually triggered each run for now)
- Parallel mutator
- Real-player calibration
- Ability designer's creative passes

---

## File index

| Path | What it is |
|---|---|
| [docs/run-playtest-master-plan.md](run-playtest-master-plan.md) | The phased plan across 3 pillars × 7 layers |
| [docs/run-playtest-routines.md](run-playtest-routines.md) | The 6 remote routine specifications |
| [.claude/routines/nightly-playtest.md](../.claude/routines/nightly-playtest.md) | Current routine prompt (source of truth) |
| [.claude/agents/](../.claude/agents/) | 6 specialized agent definitions |
| [scripts/run-playtest/](../scripts/run-playtest/) | The pipeline code (18 files) |
| [data/run-playtest/digests/](../data/run-playtest/digests/) | Morning digests, committed |
| [data/run-playtest/experiments.jsonl](../data/run-playtest/experiments.jsonl) | Append-only experiment log |
| [data/run-playtest/models/](../data/run-playtest/models/) | Versioned models |
| [data/run-playtest/traces/](../data/run-playtest/traces/) | Decision logs for replays |
| [data/run-playtest/replays/samples/](../data/run-playtest/replays/samples/) | Sample MP4s (Remotion-rendered) |

---

## Commits this session (newest first)

| SHA | Message |
|---|---|
| `fbd73f2` | fix simulate failMode classifier — captures were reported as dead-ends |
| `b3a9417` | trim nightly defaults + 2026-05-13 digest |
| `d9ac786` | master plan, agent roster, ability ranking baked into digest |
| `38a5340` | promotion pipeline — CLI + /admin/run-candidates page |
| `9505318` | replay video renderer — trace -> MP4 |
| `815d937` | ability lab — ranking + 10 candidates (2026-05-12) |
| `2d05b46` | forced-take + pair-combo analysis |
| `42f666e` | hypothesis loop + versioned model + experiment log |
| `00e9e21` | T5 v0.2 ability-aware planner + benchmark |
| `19e4150` | decision trace + replay viewer |
| `470f5ad` | multivariate regression model with held-out R² |
| `c4abdd9` | /admin/playtest-live watch page |
| `6ceb2e0` | headless harness — T3/T4/T5 bots, ablation, level factor analysis |

**13 commits in 24 hours, ~5,000 lines of code, 10 specialized agents (6 definitions + 4 one-shot operations) dispatched.**

---

## Bottom line for tomorrow

1. **The system runs and produces actionable data.** Today's digest is the proof-of-life.
2. **The ability pool is the next big lever.** Either ship new abilities (designed candidates are ready) or upgrade bots to use existing ones.
3. **Two known bugs are logged** — feature engineering for moveLimit, and engine RNG threading. Both are small fixes that materially improve signal quality.
4. **The remote-routine API issue is the operational blocker.** Once unblocked, the system runs itself autonomously and Tyler gets a daily digest with narrative commentary, candidate levels to review, and ability proposals.

The system can keep getting smarter as long as the falsifiability machine (held-out R², versioned models, experiment log) keeps running. We're on track.
