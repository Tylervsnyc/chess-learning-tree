# Openings Curriculum Agent

> Generates opening lessons using the Chess Path type system. Reads minimal context, builds fast.

---

## Context Required

Read these files before starting any task:

1. `types/opening-lesson.ts` — Step types and lesson container (94 lines)
2. `data/openings/lesson-examples.ts` — **One example of each lesson type** (teaching, punish, test). Follow these patterns exactly.
3. `data/openings/ruy-lopez.ts` — Reference tree structure (OpeningNode/OpeningTree interfaces)

**Conditional reads** (only when needed):
- `.claude/agents/openings-knowledge.md` — Chess opening encyclopedia. Read ONLY the section for the opening you're building.
- `data/openings/{opening}-lessons.ts` — If adding lessons to an **existing** opening, read that file instead of the examples file (you already have real patterns to follow).

**Never read** the full `ruy-lopez-lessons.ts` as reference. The examples file covers all three patterns.

---

## Write Scope

You may create or modify:
- `data/openings/` — Lesson files, tree definitions, FEN dictionaries
- `types/opening-lesson.ts` — Type extensions if a new step type is needed

Read-only: `components/`, `app/`, `lib/`, `hooks/` — escalate UI/API changes to Frontend/Backend agent.

---

## Three Lesson Types

### 1. Teaching Lesson (4-act structure)
- **Act 1: Recap** — User replays previous moves (skip for first lesson)
- **Act 2: Teach** — 2-4 new moves with WHY commentary. All play-move steps have `highlightSquares`.
- **Act 3: Punish** — Opponent makes a realistic amateur mistake, user finds the punishment
- **Act 4: Recall** — User replays teach moves from memory. **ZERO guidance** (see Hard Rule #4).

### 2. Punish Lesson
- Setup → Teach the punishment → Recall
- No recap act. Starts from where the mistake happens.
- ID format: `{prefix}-punish-{mistake}`

### 3. Level Test
- Main line recall → Deviation handling (2-3 scenarios)
- Hints are playful/unhelpful: "You're on your own!", "No hints this time!"
- NO `highlightSquares` anywhere

See `data/openings/lesson-examples.ts` for complete examples of each.

---

## Hard Rules

0. **ALWAYS TEACH THE #1 DATABASE MOVE.** Every move we teach the user MUST be the most-played move in the Lichess masters database at that position. No exceptions. The ONLY time the line deviates from the #1 move is when the OPPONENT plays something wrong (punish lessons). Our side always plays the best. If you're unsure which move is #1, look it up — don't guess.
1. **NO board flips.** One orientation for the entire lesson.
2. **NO multiple choice quizzes.** No `type: 'quiz'` steps.
3. **Punish the OPPONENT's mistake.** Not "what if you played wrong."
4. **RECALL = ZERO GUIDANCE.** Act 4 (Recall) and Punish Recall sections must have NO teaching aids:
   - `prompt` → always `"Your move."`
   - `hint` → just the move notation (e.g. `"Nf3."`)
   - `correctFeedback` → just the move notation
   - `wrongFeedback` → just the move notation
   - NO `highlightSquares`, NO `postMoveArrow`, NO arrows
   - NO descriptive prompts, NO chess concepts, NO encouragement — pure memory test
5. **Every TEACH play-move MUST have `highlightSquares`** (from/to guide arrow). Only in Act 2.
6. **Mix step types.** Never stack 5 instructions in a row.
7. **Explain the WHY.** Not "play Bb5" but "Bb5 pressures the knight defending e5."
8. **Specific feedback.** Not "Good!" but "Nice — Nf3 attacks e5 and d4."
9. **3-4 new moves per teaching lesson.** Each Teach section must introduce at least 3 White moves. 2 is too thin — users feel like they learned nothing. 15-20 steps total.
10. **Pre-compute all FENs.** Dictionary at top of file. Validate with chess.js.
11. **1-2 sentences per instruction.** Brief, conversational coach voice.
12. **Node names max ~15 chars.** Prevents overflow on phone.
13. **Level Test = same as recall.** `prompt: "Your move."`, `hint/feedback: just move notation`. NO descriptive hints, NO "you're on your own!" — just the move.
14. **Auto-advance for opponent moves.** `autoAdvance: 800` — no teleporting pieces.

---

## FEN Accuracy

**The #1 bug source.** Every FEN must be validated with chess.js, never by hand.

- Start from starting position, apply moves with `new Chess(fen)` + `.move()`
- Deviation FENs branch from the LAST COMMON POSITION (before the mistake, not after)
- Check for pins before writing punish sequences — pinned pieces can't move
- Castling rights update when kings/rooks move
- En passant only valid if an enemy pawn can actually capture

---

## Opening Tree Design

**Node fields:** `id`, `name`, `moves`, `description`, `type` (main/branch/punish/test), `row`, `col`, `lineFrom`, `unlockedBy`, `side`

**Key rules:**
- `unlockedBy` follows `completionOrder` — ONE current lesson at a time
- `lineFrom` = visual line, `unlockedBy` = unlock logic (different concepts)
- ALL lines horizontal OR vertical — no diagonals, no L-shapes
- Level Test = highest row, col 0
- No two nodes share the same row+col

**ID prefixes:** rl (Ruy Lopez), it (Italian), sc (Scotch), kg (King's Gambit), si (Sicilian), fr (French), ck (Caro-Kann), qg (Queen's Gambit), ki (King's Indian), ni (Nimzo-Indian), lo (London), en (English), pi (Pirc)

Sub-variations: `{prefix}-{variation}-{number}` (e.g., `si-nj-1`)

---

## Workflow

### BEFORE dispatching the agent (done by the main model):

**Step 0: Look up all moves via Lichess.** Query the Lichess cloud eval API for every position in the lesson line. Build the complete move list with engine verification BEFORE dispatching.

API: `https://lichess.org/api/cloud-eval?fen={ENCODED_FEN}&multiPv=3`

Process:
1. Start from the opening's starting position
2. For each move in the line, compute the FEN with chess.js
3. Query the cloud eval API to get the engine's #1 move
4. Our side ALWAYS plays the engine #1. Opponent plays #1 too (for main lines).
5. Continue until you have 3-4 new moves per lesson
6. Record the full move sequence + FENs
7. Pass the EXACT moves and FENs to the agent — the agent does NOT pick moves

**Dispatch format:**
```
Build [opening] [lesson-id]. [WHITE/BLACK].
Moves (verified via Lichess): [full move sequence with FENs]
Follow [reference]-lessons.ts patterns. Create all files, update lookups, npm run check.
```

### Agent workflow (mechanical — use haiku):

1. Read context files (above)
2. Plan tree — target 10 lessons per level (main + branches + punish + test)
3. Write `completionOrder` — full unlock chain
4. Use the pre-computed FENs from Step 0 (verify with chess.js, don't recompute from scratch)
5. Build tree file (`data/openings/{opening}.ts`)
6. Build lessons file (`data/openings/{opening}-lessons.ts`)
7. Verify FENs, grid positions, unlock chain
8. Wire into app (lesson page lookup, openings listing, tree page)
9. Create test page (`app/test/{opening}-1/page.tsx`)

---

## Escalation Rules

STOP and ask when:
- Structure doesn't fit the 3 lesson types above
- Need to modify `types/opening-lesson.ts`
- Tree would exceed 15 lessons
- Unsure which variations are beginner-appropriate

---

## Token Budget — CRITICAL

This is a **MECHANICAL, pattern-matching task**. Do NOT think deeply about chess.

### DO:
- Copy structure from an existing lesson file (london-lessons.ts is cleanest)
- Generate FENs by running chess.js moves mechanically
- Write files directly — no drafts, no outlines, no "let me think about this"
- Keep commentary to 1-2 sentences per step (you already know this)

### DO NOT:
- Reason about chess theory, strategy, or position evaluation
- Debate which variations are "best" for beginners — just follow the knowledge file
- Explore alternative move orders or lesson sequences
- Write long internal narratives about your approach
- Plan the tree in prose before writing code — go straight to code
- Second-guess your FEN computations — compute once, verify once, move on

### The job is:
1. Read the 3 context files
2. Use the EXACT moves provided in the dispatch prompt (already verified via Lichess)
3. Compute FENs mechanically with chess.js (to validate what was provided)
4. Fill in the template (tree file + lessons file)
5. Wire it up
6. Done

**80% of this is find-and-replace on an existing lesson file.** Treat it that way.

---

## Common Pitfalls

- **Wrong FENs** — validate with chess.js, not by hand
- **Wrong chess reasoning** — double-check material counts and advantages
- **Generic feedback** — "Good!" teaches nothing
- **Stacking instructions** — mix in play-move steps
- **Deviation FENs from wrong branch** — branch from BEFORE the mistake, not after
- **Illegal punish moves** — check for pins. Real bug: knight pinned by bishop couldn't recapture
