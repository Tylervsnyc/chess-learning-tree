# Build Openings

Autonomous opening lesson build pipeline. Reads `data/build-queue.json`, dispatches parallel agents to build opening lessons, wires up new openings, and updates the queue.

## Input

Command: $ARGUMENTS

- A number (e.g. `3`) — build next N pending items (default: 3)
- `status` — print queue state and exit
- `retry` — re-run all `failed` items

## Workflow

### STATUS subcommand

If `$ARGUMENTS` is `status`:
1. Read `data/build-queue.json`
2. Count items by status: pending, building, needs-review, completed, failed
3. Print a summary table, then list the next 5 pending items with their names, slugs, and priorities
4. **Stop here — do nothing else.**

### RETRY subcommand

If `$ARGUMENTS` is `retry`:
1. Read `data/build-queue.json`
2. Find all items with `status: "failed"`
3. Reset them to `status: "pending"`, clear `error`, `startedAt`, `completedAt`, `durationSeconds`
4. Write the updated queue back
5. Print how many items were reset
6. **Stop here — do nothing else.**

---

### BUILD workflow (number or default)

Parse `$ARGUMENTS` as a number N (default 3 if empty or not a number).

#### Step 1 — Read queue, pick items, classify

1. Read `data/build-queue.json`
2. Filter to `status: "pending"`, sort by `priority` (ascending = higher priority first), then by array position
3. Take up to N items, **deduplicating by slug** — never pick two items with the same slug (they write to the same files). If an item's slug is already selected, skip it and take the next different-slug item.
4. For each selected item, classify:
   - **Existing opening**: `data/openings/{slug}.ts` exists
   - **New opening**: no data file for this slug yet
5. **Prereq check** for items with `extendsFrom`:
   - If the slug has NO data file AND the item has `extendsFrom`, it's missing a prerequisite level. Mark the item as `status: "failed"`, `error: "Missing prerequisite — no data files for slug '{slug}'"`. Remove from the batch.
   - If the slug HAS a data file, check whether `extendsFrom` node ID actually exists in that file's tree data. Read `data/openings/{slug}.ts` and grep for the node ID. If not found, mark failed with `error: "extendsFrom node '{nodeId}' not found in {slug} tree"`. Remove from batch.

#### Step 2 — Mark as "building"

Update `data/build-queue.json`:
- Set `status: "building"` and `startedAt` (ISO timestamp) on each selected item
- Write the file back

#### Step 3 — Dispatch parallel agents

Dispatch ONE Task agent per item, ALL in parallel (`subagent_type: "general-purpose"`, `model: "sonnet"`).

Use ultra-concise ONE-SENTENCE prompts per the zero-overhead rule in MEMORY.md:

**For existing opening, Level 2/3:**
```
Read .claude/agents/openings-curriculum-agent.md. TASK: Build {name} Level {level}. {SIDE}. Main line: {mainLine}. Extend {slug} tree from node {extendsFrom}. Follow data/openings/{slug}-lessons.ts patterns. Add 10 new nodes. npm run check when done.
```

**For existing opening, Variation:**
```
Read .claude/agents/openings-curriculum-agent.md. TASK: Build {name} variation. {SIDE}. Main line: {mainLine}. Add to existing {slug} tree as a branch from Level 1. Follow data/openings/{slug}-lessons.ts patterns. 3 moves/lesson, 10 nodes. npm run check when done.
```

**For new opening (no data files yet):**
```
Read .claude/agents/openings-curriculum-agent.md. TASK: Build {name}. {SIDE}. Main line: {mainLine}. Follow london patterns. 3 moves/lesson, 10 nodes. Create data/openings/{slug}.ts and data/openings/{slug}-lessons.ts. npm run check when done.
```

Where:
- `{SIDE}` = item.side uppercased (e.g. "WHITE" or "BLACK")
- `{name}`, `{level}`, `{mainLine}`, `{slug}`, `{extendsFrom}` from the item

#### Step 4 — Collect results and wire up new openings

After ALL agents return, for each item:

**If the agent succeeded** (no error):

For **NEW openings only** (slug didn't have data files before):
1. Grep the new `data/openings/{slug}.ts` for the `export const` name (e.g. `SCOTCH_GAME`)
2. Grep the new `data/openings/{slug}-lessons.ts` for the `export function get` name (e.g. `getScotchLesson`)
3. Add import + entry to `lib/opening-trees.ts`:
   - Add `import { CONST_NAME } from '@/data/openings/{slug}'` after the last import
   - Add `'{slug}': CONST_NAME,` to the TREE_LOOKUP object
4. Add import + entry to `app/openings/[slug]/[lessonId]/page.tsx`:
   - Add `import { getFuncName } from '@/data/openings/{slug}-lessons'` after the last lesson import
   - Add `'{slug}': getFuncName,` to the lookups object
5. Update `data/openings/registry.ts`: set `hasData: true` for the matching slug entry

**For ALL successful items:**
- Mark `status: "needs-review"`, set `completedAt` (ISO), calculate `durationSeconds` from `startedAt`

**If the agent failed:**
- Mark `status: "failed"`, set `error` with a brief description of what went wrong

#### Step 5 — Final verification

Run `npm run check` on the full project.
- If it fails, try to fix obvious issues (missing imports, type errors)
- If it still fails, note which items might be causing issues

#### Step 6 — Write queue and print summary

1. Write the updated `data/build-queue.json`
2. Print a summary table:

```
BUILD COMPLETE
══════════════════════════════════════════
  Item                        Status     Duration
  ─────────────────────────── ────────── ────────
  Italian Game Level 2        success    45s
  Pirc Defense Level 2        success    52s
  Scotch Game Level 2         FAILED     --
══════════════════════════════════════════
  Passed: 2 / 3
  Queue remaining: 39 pending
```

## Rules

- **Never build two items with the same slug in parallel.** They write to the same files.
- **One sentence prompts.** Per MEMORY.md zero-overhead rule. DO NOT read files for agents, design grids, compute FENs, or write long prompts.
- **Don't pre-read agent files.** The agent reads its own instructions.
- **Prereq check is mandatory.** Don't waste tokens on items that will fail.
- **New opening wiring happens AFTER agents return**, not inside the agent.
- **Always write the queue back** even if everything fails — status tracking matters.
