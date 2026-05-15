# Build Rookie's Run Level

Author, playtest, and iterate Rookie's Run levels until they hit their target difficulty band.

## Input

Command: $ARGUMENTS

Forms accepted:
- `new <run-name>` — design a full 10-level run from scratch with progression curve.
- `level <run-name> L<n>` — design one specific level.
- `iterate <run-name>` — re-test current levels in `lib/run/runs.ts`, identify off-band levels, propose changes.
- `experiment <hypothesis>` — try a pattern (e.g. "rank-6 pawn row + escalating rank-7 pieces") across 10 levels.

If no arguments, ask which.

---

## Required reading (read these first, in order)

1. **`.claude/run-level-design.md`** — design philosophy, anti-patterns, difficulty rubric, authoring checklist. **Source of truth.**
2. **`.claude/run-strategy-bible.md`** — why positions are hard (open files, defended chains, queen sightlines).
3. **`RULES.md §49`** — engine rules. Read by section index — `offset: 2660, limit: 90`. Don't read the whole file.

Skip these on iteration #2+ within the same session — they're in context.

---

## Pipeline

### Step 1 — Plan the run/level

Before writing any code, produce a written plan:

- **Theme** — one-sentence concept (e.g. "the rank-7 cordon").
- **10-level silhouette** — sketch each level's primary strategic question in 8 words. Verify no duplicates.
- **Difficulty curve** — target T3/T4/T5 win % per level, mapped to the rubric in `run-level-design.md`.
- **Capstone (L10) plan** — what makes it impossible without abilities.

Show the plan to Tyler before authoring. Don't write level code until he greenlights.

### Step 2 — Author levels

Add to `lib/run/runs.ts` (named runs) or extend `lib/run/daily-levels.ts` (Daily Climb).

- Follow `RunDef` / `RunPuzzle` types in `lib/run/types.ts`.
- `allowedForms` per level — Daily Climb pattern: rook L1–3, knight L4+, bishop L7+.
- Every enemy must be capturable on a realistic line (anti-pattern check).
- Move limit optional; use sparingly — it's a felt-pressure dial, not a difficulty crutch.

### Step 3 — Sweep

```bash
npx tsx scripts/run-playtest/sweep.ts
```

Reads all current runs, plays each level × tier × trials, writes `data/run-playtest/raw/<date>/sweep.json` and digest.

### Step 4 — Compare to rubric

Open `data/run-playtest/digests/latest.md`. For each level in the new run:

- Is T3/T4/T5 win % inside the target band from `run-level-design.md`?
- Is the fail-mode histogram **mixed** (good) or single-mode (bad — one-dimensional)?

### Step 5 — Ablation (required for L10)

```bash
npx tsx scripts/run-playtest/ablation.ts
```

For the capstone level: confirm T5-no-abilities win % ≤ 10. If higher, the level is solvable without abilities — redesign.

### Step 6 — Iterate

For each off-band level:

- **Too easy at T3** → add a defender, close an open file, tighten move limit.
- **Too hard at T5** → open one file, remove a defender, add an extra rank-1 escape.
- **Same fail-mode every trial** → the level is one-dimensional; introduce a second threat axis.

Re-run sweep. Repeat until all 10 levels are in band.

### Step 7 — Authoring checklist

Run through the checklist at the bottom of `run-level-design.md`:

1. Silhouette test
2. Primary-question test
3. Captureability
4. No-ability run
5. Ability necessity (L10)
6. Sweep in-band
7. Digest fail-modes mixed

If any fails, return to Step 6.

### Step 8 — Commit

When all checks pass, commit with:

```
Rookie's Run: add <run-name> run (10 levels, calibrated)
```

Update `RULES.md §49` only if shipping new mechanics (new ability, new hazard, etc.) — not for new levels alone.

---

## Loop/schedule mode

When invoked under `/loop` or `/schedule`:

- Each iteration: pick one off-band level from the latest digest, propose one targeted change, sweep, log delta.
- Append a one-line entry to `data/run-playtest/level-design-log.md` each iteration: `YYYY-MM-DD HH:MM — <run> L<n>: <change> → T3 X%→Y%, T4 X%→Y%, T5 X%→Y%`.
- Stop when all levels in-band OR after the user-specified budget.
- Never commit autonomously without a passing full checklist.

---

## When to update `run-level-design.md`

After every iteration session, if you learned something:

- New anti-pattern → add it with the offending level as example.
- New working pattern → add it with the level that proved it.
- Rubric needed adjustment → update the table with a dated note.

The doc is the persistent memory across sessions — keep it sharp.
