# Rookie's Run — Nightly Routine Instructions

> This file is the source of truth for what the `rookies-run-nightly-playtest` routine does each night. The routine's prompt is a 1-liner that reads this file. To change behavior, edit this file and push to main.

You are running the Rookie's Run **nightly playtest + ability lab**. Automated routine — work efficiently, no questions, report at the end.

## Part 1: Nightly Playtest (the baseline pipeline)

1. The repo is already cloned. `cd` into it. Verify on main: `git checkout main && git pull origin main`.
2. `npm install --no-audit --no-fund` (skip if `node_modules/` exists).
3. Run the nightly pipeline (~30 min): `npx tsx scripts/run-playtest/nightly.ts`. Defaults are tuned to fit inside cloud-agent runtime caps — sweep 150 trials, ablation 80, hypotheses 3, no forced-take, no combos. On Sundays use `--full` for the weekly deep dive (~90 min) that enables forced-take + combos. Outputs land in `data/run-playtest/digests/` (committed) and `data/run-playtest/raw/` (gitignored).
4. Verify digest exists: `ls data/run-playtest/digests/$(date +%Y-%m-%d).md` should print the file. `head -30` it to confirm the TL;DR rendered.
5. Stage digest files only: `git add data/run-playtest/digests/`. Do NOT stage `data/run-playtest/raw/`.
6. Commit using inline git identity:
   ```
   git -c user.name="Rookie Playtest Bot" -c user.email="playtest@rookies-run.local" commit -m "Rookie's Run: nightly playtest digest $(date +%Y-%m-%d)"
   ```
7. `git push origin main`.

## Part 2: Ability Lab (Tyler specifically asked for this)

**Run this after Part 1 commits successfully.** If Part 1 failed or the digest looks broken, skip Part 2 and report.

Read [`.claude/agents/ability-designer-agent.md`](../.claude/agents/ability-designer-agent.md) for context on the ability-designer role.

### 2.1 — Rank current abilities

Read today's `ablation.json` at `data/run-playtest/raw/$(date +%Y-%m-%d)/ablation.json`. For each of the 10 abilities (`bishop-step`, `knight-hop`, `queen-pulse`, `pawn-charge`, `freeze-ray`, `detonate`, `phase-step`, `leap`, `surge`, `aegis`), compute:

```
power_score = 2.0 * |deltaPp_T3| + 1.5 * |deltaPp_T4| + 1.0 * |deltaPp_T5|
```

Higher weighting on T3 because our main audience is beginners — abilities that help them are more valuable.

Sort descending. Tag each ability with a **Character**:
- **Beginner crutch** — T3 negative delta dominates (T3 |delta| > T5 |delta| by 2x+)
- **Expert tool** — T5 |delta| is largest
- **All-tier staple** — deltas similar across all three tiers
- **Trap** — any positive delta > 5pp at T3 (beginners take it but lose more)
- **Quiet** — all |deltas| < 3pp (negligible impact)

### 2.2 — Design 10 new ability candidates

Each candidate must have:
- **Name** — 1-2 words, evocative, chess-themed. Examples that work: Aegis, Surge, Phase Step, Knight Hop. Avoid: technical jargon ("Tempo Buff +3"), grimdark ("Death Strike"), baby-talk ("Whoopsie").
- **Pitch** — single sentence describing the mechanic.
- **Gap addressed** — reference specific numbers from today's ablation matrix. What category, tier-segment, or game-state is currently underserved?
- **5-tier progression** — T1 weakest → T5 strongest, mirroring existing structure.
- **Predicted impact** — expected ΔT3, ΔT4, ΔT5. Calibrate against the current ranking — use top ability as your strongest benchmark, lowest as weakest. Don't predict more powerful than current #1 without a clear argument.
- **Mechanical distinctness** — must NOT be a reskin of an existing ability ("Bishop Step but for Queen" = reject).

Mix:
- **6 gap-fillers** — directly address gaps identified in the data (category undercoverage, tier-segment gaps, untreated game states)
- **4 experimental** — more speculative, surprising mechanics

After the 10, write 2-3 sentences identifying which 2-3 to **prioritize for implementation** and why.

### 2.3 — Write outputs

Append these two sections to today's digest at `data/run-playtest/digests/$(date +%Y-%m-%d).md`:

```
## Current Abilities Ranked

| Rank | Ability | Power Score | ΔT3 | ΔT4 | ΔT5 | Character |
|---|---|---:|---:|---:|---:|---|
| 1 | ... | ... | ... | ... | ... | ... |
...

[2-3 sentence interpretation of top 3 and bottom 2]

## 10 New Ability Candidates

### 1. {Name} — predicted power: {comparable to X}

**Pitch:** {one sentence}

**Gap addressed:** {specific gap with data reference}

**Tier progression:**
- T1: {weakest}
- T2: ...
- T3: ...
- T4: ...
- T5: ...

**Predicted impact:** ΔT3 ~-{N}pp, ΔT4 ~-{M}pp, ΔT5 ~-{L}pp. Rationale: {1-2 sentences}.

### 2. ...

...

[2-3 sentence summary identifying top 2-3 to prioritize]
```

DO NOT modify content above the appended sections. Also append the same content to `data/run-playtest/digests/latest.md` to keep it in sync.

Also save section 2 (the 10 candidates) alone to `data/run-playtest/ability-lab/$(date +%Y-%m-%d).md` for historical reference.

### 2.4 — Commit ability lab work

```
git add data/run-playtest/digests/ data/run-playtest/ability-lab/
git -c user.name="Ability Lab Bot" -c user.email="ability-lab@rookies-run.local" commit -m "Rookie's Run: ability lab — ranking + 10 candidates $(date +%Y-%m-%d)"
git push origin main
```

## Failure modes — how to handle each

- **`npx tsx` errors in Part 1**: capture stderr (last 100 lines), report it. Do NOT retry. Skip Part 2.
- **Digest looks broken** (empty sections, all 0% across tiers, missing tables): flag as bug. Skip Part 2.
- **`git push` rejected**: `git pull --rebase origin main`, retry push. If still fails, report.
- **Part 2 errors** (missing ablation.json, etc.): report what failed, exit. Do not invent ranking or candidates.

## Report back

- **Part 1**: TL;DR section from digest (verbatim), commit SHA, total runtime.
- **Part 2**: top 3 ranked abilities with power scores, top 2 candidate recommendations, commit SHA.
- Any errors or warnings encountered.

## Style + voice for Part 2

- **Honest about uncertainty** — predicted power is an educated guess. Frame as "expected around -8pp at T3" not "definitely -8pp."
- **Data-grounded** — every gap claim should reference specific numbers from the ablation matrix or correlation table.
- **Rookie's voice** — playful, chess-themed, occasionally hapless. The existing ability names (Aegis, Surge, Phase Step) are the template.

## Background context

Tyler Schwartz is building an automated playtest system for **Rookie's Run** — the daily roguelike inside his chess-learning app. Linear project: "Rookie's Run Playtest System." The pipeline at `scripts/run-playtest/` runs every level with three AI tiers (T3 Casual, T4 Sharp, T5 Expert), tests how each ability affects difficulty (ablation), extracts level feature vectors, and generates a markdown digest. The morning digest is the deliverable — Tyler reads it on his phone via `/admin/playtest-live`. Reliability over ambition — if anything looks off, surface it rather than trying to recover.
