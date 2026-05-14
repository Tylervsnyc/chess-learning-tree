# Rookie's Run Playtest System — Evening Status Update

**Date:** 2026-05-13 (evening, after day 2 of work)
**Author:** Claude working with Tyler
**Last morning report:** [playtest-status-2026-05-13.md](playtest-status-2026-05-13.md)
**Linear project:** [Rookie's Run Playtest System](https://linear.app/chesspathapp/project/rookies-run-playtest-system-02df85b27f07)

---

## TL;DR — what shipped today

1. **Run-level simulator** — plays a full 10-level run end-to-end, carrying tempo + abilities between levels. The right test for cross-level meta-strategy.
2. **Ability-impact harness** — force-seed each ability at T3 across a 10-level run, measure end-of-run levels reached. Replaces the misleading per-level ablation as the canonical ability ranking.
3. **22 new candidate abilities** (Queenkiller, Tremor, 20 from the lab). Tested across 7 hard runs. **Mirror tied Detonate at #1** (+4.66 avg, 7/7 hard runs solo-completed). 6 of top 10 are NEW. All candidates **gated from real-player offers** (icons pending).
4. **Hazard ablation experiment** — Tyler's hypothesis tested across all 11 runs. Hazards hurt players in 10 of 11 (avg +11.2pp without them). Tyler's intuition was right on 10 specific levels though — those use hazards as strategic walls.
5. **Bot eval rewrite** — open-file mandate, capture-aware. Bots play smarter.
6. **Strategy bible** — documents principles for level analysis. Already paying off (annotation system uses it).
7. **50 new candidate levels** — running overnight via the nightly routine. Generator script in development.

---

## Today's measurements

### Ability ranking — top 10 of 32

(Force-seeded at T3, full 10-level runs, 5-8 trials × 7 hard runs)

| Rank | Ability | Avg Δ levels | 100% runs | NEW? |
|---|---|---:|:-:|:-:|
| 1 | **Detonate** | +4.66 | 7/7 | |
| 2 | **Mirror** | +4.66 | 7/7 | ★ |
| 3 | **Tempo Vault** | +4.26 | 4/7 | ★ |
| 4 | **Aegis** | +4.20 | 6/7 | |
| 5 | Bait | +3.57 | 1/7 | ★ |
| 6 | Quickstep | +3.06 | 1/7 | ★ |
| 7 | Slayer | +2.91 | 1/7 | ★ |
| 8 | Decoy | +2.57 | 2/7 | ★ |
| 9 | Queen Pulse | +2.46 | 1/7 | |
| 10 | Phase Step | +2.43 | 3/7 | |

**Bottom 5 (NET NEGATIVE — actively hurt T3 win rate):**
- Magnet (−2.54), Pushback (−2.17), Rally (−1.17), Bedrock (−0.63), Recall (−0.54)

Full table at [data/run-playtest/ability-impact/SUMMARY_2026-05-13.md](../data/run-playtest/ability-impact/SUMMARY_2026-05-13.md).

### Hazard ablation — verdict by run

| Run | Mean Δ (without − with) |
|---|---:|
| Bishops Path | **+25.8pp** |
| Hazard Maze | **+16.3pp** |
| Crossfire | +14.6pp |
| Knight Academy | +12.5pp |
| Boss Gauntlet | +11.1pp |
| Iron Curtain | +10.8pp |
| Royal Court | +9.2pp |
| Hornets Nest | +7.5pp |
| Daily Climb | +6.7pp |
| The Gauntlet | +5.9pp |
| Speed Demon | +2.7pp (neutral) |

**10 of 11 runs: hazards hurt players.** Tyler's hypothesis ("hazards make levels easier because they block enemies too") is mostly wrong — but he was right on 10 specific levels (~14% of all hazard placements) where hazards genuinely block enemy attack lines.

**Template levels for strategic hazards**: `hornets-nest/8` (−43pp), `iron-curtain/7` (−20pp).

**Audit candidates** (hazards just block Rookie, no strategic purpose):
- `hazard-maze/9` (+80pp), `hazard-maze/8` (+57pp) — the run NAMED after hazards is doing it wrong
- `bishops-path/9` (+73pp)
- `crossfire/6` (+63pp), `hornets-nest/5` (+57pp)

Full report at [data/run-playtest/experiments/hazards_SUMMARY_2026-05-13.md](../data/run-playtest/experiments/hazards_SUMMARY_2026-05-13.md).

### Tyler's playtest

Tyler played Iron Curtain (the run he flagged as canonical "fun-hard"). His observation: "fun, maaaybe a touch too easy at later levels." Cross-referencing with the hazard data — iron-curtain/8 and /9 hazards aren't doing their job (the hazards are in player paths, not enemy paths). To make those late levels harder, replicate the iron-curtain/7 hazard placement template.

---

## What's running overnight

### Cloud routine: `rookies-run-nightly-playtest` (4am EDT daily)

Runs the trimmed nightly pipeline: sweep + ablation + features + regression + hypothesis loop + run-level ability impact + digest. Produces tomorrow's digest at `data/run-playtest/digests/2026-05-14.md`.

### Local generator: 50 new candidate levels

A generator script is being built right now (background agent). When committed and pushed, the cloud routine will run it as part of tomorrow's 4am pipeline. Output: 50 candidate levels at `data/run-playtest/candidate-levels/2026-05-14/`, each with:
- Piece configuration (paste-ready into `runs.ts`)
- Tier curve (T3, T4)
- Fun-hard score
- ASCII board diagram
- Design intent

Tomorrow morning: review the top 20, promote favorites.

---

## Current ability roster

### Shipped (10 — real players see these)

bishop-step, knight-hop, queen-pulse, pawn-charge, freeze-ray, detonate, phase-step, leap, surge, aegis

### Candidates (22 — playtest-only, gated)

queenkiller, bedrock, sinkhole, rally, quickstep, smoke, beeline, slayer, sapper, decoy, **mirror**, foresight, bulwark, skip, bait, magnet, pushback, mimic, recall, **tempo-vault**, tide, tremor

### Recommended promotion order

Based on ability-impact data:
1. **Mirror** (rank #2) — tied with Detonate, defensive auto-counter
2. **Tempo Vault** (rank #3) — validates stop-short-for-tempo meta-strategy
3. **Bait** (rank #5) — strong tactical defense

Each requires: icon designed + UX polish + removal from `CANDIDATE_ABILITY_IDS` in `lib/run/abilities.ts`.

---

## System architecture (refreshed)

```
scripts/run-playtest/
├── simulate.ts          one game per puzzle
├── simulate-run.ts      full 10-level run (cross-level carry)
├── sweep.ts             level × tier × N trials
├── ablation.ts          remove each ability, re-sweep
├── forced-take.ts       force-accept / force-skip each ability
├── combos.ts            pair-combo matrix
├── features.ts          per-level feature extraction
├── correlations.ts      univariate Pearson r per feature
├── regression.ts        multivariate ridge regression + held-out R²
├── hypothesis-queue.ts  predict + test counterfactuals
├── experiment.ts        run one hypothesis
├── experiment-log.ts    append-only journal
├── model-version.ts     versioned models, earned upgrades
├── hazard-experiment.ts NEW: hazard ablation
├── discover-strat.ts    NEW: winning pattern discovery
├── generate-levels.ts   NEW (in progress): 50-level generator
├── trace.ts             single-game decision log
├── render-replay.ts     trace → MP4
├── promote.ts           candidate → live levels
├── digest.ts            morning digest writer
├── nightly.ts           top-level orchestrator
└── bots/
    ├── t3.ts            1-ply principled (Casual)
    ├── t4.ts            2-ply minimax (Sharp)
    ├── t5.ts            3-ply minimax (Expert v0.1)
    ├── t5-v01.ts        frozen v0.1 (v0.2 failed acceptance)
    ├── apply.ts         BotAction → engine
    └── shared.ts        eval primitives, candidate enumeration
```

---

## What's still pending

1. **T5 v0.2 ability-aware planner** — second attempt. v0.1 doesn't meaningfully outperform T4 (only 5.5pp avg gap).
2. **`pawn-ai.ts` non-determinism** — `Math.random()` calls add ~5pp noise floor. Threading an explicit RNG would tighten everything.
3. **RemoteTrigger update API** — blocked all session. Routine prompt updates require new session retry.
4. **Icons for candidate abilities** — Tyler's design work; 22 candidates need icons before any promotion.
5. **`/admin/run-stats` rich dashboard** — Cowork work.
6. **Real-player telemetry instrumentation** — waits on production traffic.
7. **Audit retirement candidates** (run-level): `hazard-maze/8`, `hazard-maze/9`, `bishops-path/9`, `crossfire/6` — the worst over-hazarded levels.

---

## Commits today (newest first)

| SHA | Message |
|---|---|
| `4212d70` | hazard ablation across all 11 runs |
| `735e2a0` | URGENT: gate candidate abilities from real-player offers |
| `cf48941` | Tremor — self-centered AoE pushback |
| `68a021e` | 20 new abilities tested — Mirror ties Detonate at #1 |
| `a52ca5a` | 20 new candidate abilities — engine + bot wiring |
| `0137944` | ability-impact in nightly + summary across 7 hard runs |
| `5b31508` | run-level simulator + ability impact harness |
| `7ebbb7f` | strategy bible — stop-short tempo principle |
| `983bcee` | capture-to-open analysis + strategy bible updates |
| `d45f407` | strategy bible + position annotations |
| `90434dc` | eval rewrite (open-file mandate) + strategy discovery |
| `804da5a` | ability lab — 10 candidates refreshed against real data |
| `796c009` | ship Queenkiller — first candidate ability |
| `fbd73f2` | fix simulate failMode classifier |
| `b3a9417` | trim nightly defaults + 2026-05-13 digest |
| `d9ac786` | master plan, agent roster, ranking baked into digest |

16 commits today. ~3000+ lines added.

---

## Tomorrow morning, you'll have

- Today's 2026-05-13 digest (already on main)
- **Tomorrow's 2026-05-14 digest** at ~4:50am — fresh sweep + ablation + run-level ability impact
- **50 candidate levels** in `data/run-playtest/candidate-levels/2026-05-14/` — review the top 20, promote what you like
- This status report for cold-start context
