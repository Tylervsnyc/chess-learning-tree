# Build Opening

Build a single opening level end-to-end. Masters-first pipeline: download data, plan lessons, write content, assemble, wire up.

## Input

Command: $ARGUMENTS

Format: `<slug> L<level> <side> "<identity moves>"`
Example: `ruy-lopez L1 white "1.e4 e5 2.Nf3 Nc6 3.Bb5"`

If no arguments, ask for them.

---

## Pipeline

### Step 1 — Download Masters Data

Check if `data/opening-builds/{slug}-L{level}/masters.json` exists.

**If missing**, run:
```bash
npx tsx scripts/openings/download-masters.ts \
  --slug {slug} --level {level} --side {side} \
  --moves "{identityMoves}"
```

This fetches the full move tree from the Lichess masters database. Takes ~2 min and ~500 API calls. Requires `LICHESS_TOKEN` in `.env.local`.

**If it exists**, skip — data is already downloaded.

**Pre-downloaded data**: Masters data for all 10 existing openings (L1) has been batch-downloaded. Check `data/opening-builds/{slug}-L1/masters.json` before running the download script — it's probably already there.

### Step 2 — Generate Plan

Check if `data/opening-builds/{slug}-L{level}/plan.json` exists.

**If missing**, run:
```bash
npx tsx scripts/openings/prep-from-masters.ts \
  --slug {slug} --level {level} --main-lessons 4 --preview
```

Review the preview output. Confirm:
- 4 main lessons covering 12 half-moves of theory
- Deviations classified as major (≥ 20%) or minor (< 20%)
- 2-4 minor variations selected (none from lesson 1's moves)
- **Each minor variation must have enough continuation moves to teach 3 of our moves.** If a deviation only has 1-2 response moves for our side, SKIP it and pick the next best one.
- Major variations listed in roadmap for future builds

If the preview looks good, run again without `--preview` to save.

**If it exists**, read it and continue.

### Step 3 — Enrich Plan with Position Data

For each lesson in plan.json, use chess.js to compute:
- FEN before and after each move
- The `from` and `to` squares of each move (for highlighting opponent moves)
- Whether it's a capture, check, or developing move
- What piece is on which square (for feedback text accuracy)

This is mechanical — no LLM needed. Write a quick enrichment pass inline using chess.js.

Store the enriched data in memory for Step 4. Don't write a file.

### Step 4 — Write Lessons

For each lesson (main + minor variations), write the lesson JSON following the **Predict/Reveal** format.

**HARD RULE: Every lesson teaches exactly 3 moves for the user's color.** No exceptions. Main lessons, deviation lessons, all of them. If a deviation line is thin, teach deeper into the continuation.

#### Lesson Flow — Main Lessons

```
1. INTRO INSTRUCTION
   - 1 sentence: what this lesson covers
   - FEN: position at start of this lesson

2. RECAP (skip for lesson 1)
   - Fun intro line. Vary it across lessons:
     "Let's see what you remember!"
     "Prove you know these moves!"
     "Quick review before the new stuff."
     "Show me you've got this."
   - Replay previous lessons' moves
   - Our moves: play-move with prompt "Your move.", hint = just SAN
   - Opponent moves: instruction with autoAdvance: 800, highlightSquares: [from, to] of their move

3. PREDICT/REVEAL x3 (for each new move)
   a. Opponent's preceding move (if any):
      - instruction with autoAdvance: 800
      - text: "Black plays [move]." or "[Piece] to [square]."
      - highlightSquares: [from, to] of opponent's move

   b. PREDICT — play-move step:
      - prompt: vary it ("What would you play here?", "Your turn — find the right move.", etc.)
      - hint: 1 sentence nudge toward the answer (shown after 1st wrong guess)
      - correctFeedback: 1 sentence — what the move does in plain English
      - wrongFeedback: 1 sentence — redirect toward the right idea
      - NO highlightSquares — the GuideArrow UI draws blue arrows between highlighted squares, giving away the answer
      - NO arrows — don't give away the answer
      - After 2nd wrong guess, the correct move is revealed (UI handles this)

   c. REVEAL — instruction step (shown after correct guess or reveal):
      - text: 1-2 sentences explaining WHY this move. Reference actual squares/pieces.
      - arrow: [from, to] showing the move that was just played
      - Use enriched position data to ensure accuracy

4. RECALL
   - Replay all 3 new moves with ZERO guidance:
     - prompt: "Your move."
     - hint: just the SAN (e.g., "Nf3.")
     - correctFeedback: just the SAN
     - wrongFeedback: just the SAN
     - NO highlightSquares, NO arrows
   - Opponent moves between our moves: instruction with autoAdvance: 800

5. OUTRO INSTRUCTION
   - 1 sentence wrap-up
```

#### Lesson Flow — Minor Variations (Deviations)

**Must teach exactly 3 of our moves, same as main lessons.**

```
1. INTRO INSTRUCTION
   - "Sometimes Black plays [X] instead of [Y]. Here's how to respond."
   - FEN: position just before the deviation

2. RECAP to deviation point
   - Same fun intro text as main lessons, varied
   - Same format (our moves = play-move, opponent = autoAdvance with highlightSquares)

3. DEVIATION SETUP
   - instruction: "Black plays [deviation move] instead of [main line move]."
   - autoAdvance: 800
   - highlightSquares: [from, to] of the deviation move

4. PREDICT/REVEAL x3 (our response moves — exactly 3)
   - Same format as main lesson predict/reveal
   - Predict: clean board, only opponent's last move highlighted
   - Reveal: arrow showing our move + explanation
   - Focus feedback on WHY this response works against the deviation
   - If the deviation data only has 1-2 response moves, teach deeper into the continuation

5. RECALL
   - Same zero-guidance format

6. OUTRO
```

#### Lesson Flow — Level Test

```
- Test BOTH the main line AND deviation responses
- Structure: main line recall first, then each deviation scenario
- For deviations: replay to the branch point, play the deviation move, user responds
- All play-move steps with ZERO guidance (same as recall)
- Opponent moves auto-advance with highlightSquares: [from, to]
- No instructions, no explanations, pure recall test
```

#### Writing Rules

- **FENs**: compute with chess.js from the move sequence. NEVER hand-write.
- **Feedback tone**: beginner-friendly, 1 sentence, reference actual squares/pieces
- **Never say**: "crushing", "winning", "devastating" — it's all roughly equal opening theory
- **Never say**: generic platitudes without referencing the board
- **Accuracy check**: if you mention a square or piece in feedback, verify it's true in the FEN
- **No board flips**: one orientation for the entire lesson (matches `side`)
- **No quiz steps**: only instruction and play-move
- **Step count**: 15-25 steps per lesson (enough to be interactive, not exhausting)
- **Predict steps**: NO arrows, NO highlightSquares at all. The GuideArrow UI renders blue arrows between any highlightSquares on play-move steps, which gives away the answer. The UI automatically carries opponent highlights from the previous auto-advance step onto the board during play-move.
- **Reveal steps**: arrow [from, to] showing the move + explanation text.
- **Opponent auto-advance**: ALWAYS include highlightSquares [from, to] so the user sees what moved. These highlights persist on the board during the next play-move step so the user can see Black's last move while guessing/remembering.

### Step 5 — Write Tree File

Generate `data/openings/{slug}.ts` with:

```typescript
import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const {CONST_NAME}: OpeningTree = {
  id: '{slug}',
  name: '{Opening Name}',
  slug: '{slug}',
  description: '...',
  color: '{color}',
  colorDark: '{colorDark}',
  completionOrder: [...],
  nodes: [...]
}
```

**Grid layout rules:**
- Main lessons: col 0, rows 0-3
- Minor variations: col -1, row matches the main lesson they branch from
- BUT: no deviations branch from lesson 1 (row 0)
- Level test: col 0, row = max row + 1
- `lineFrom`: deviations connect to the main node they branch from
- `unlockedBy`: follows completionOrder (each node unlocked by previous)
- `completionOrder`: main lessons first, then deviations interleaved after the main lesson they branch from, test last

**Completion order pattern:**
```
main-1, main-2, [deviations from main-2], main-3, [deviations from main-3], main-4, [deviations from main-4], test
```

### Step 6 — Write Lessons File

Generate `data/openings/{slug}-lessons.ts` with:

```typescript
import type { OpeningLesson } from '@/types/opening-lesson'

const FEN = {
  start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  after_e4: '...',
  // ... all positions
}

// Each lesson as a const
const {PREFIX}_LESSON_1: OpeningLesson = { ... }

// Lookup function
export function get{PascalName}Lesson(id: string): OpeningLesson | null {
  switch (id) {
    case '{prefix}-1': return {PREFIX}_LESSON_1
    // ...
    default: return null
  }
}
```

### Step 7 — Wire Up

**For new openings only** (no existing data files):

1. `lib/opening-trees.ts` — add import + TREE_LOOKUP entry
2. `app/openings/[slug]/[lessonId]/page.tsx` — add import + lookup entry
3. `data/openings/registry.ts` — set `hasData: true`

### Step 8 — Validate

Run `npm run check`. Fix any type errors or lint issues.

### Step 9 — Report

Print summary:
```
BUILD COMPLETE: {slug} Level {level}
═══════════════════════════════════
  Main lessons:    4 (12 half-moves)
  Minor variations: N
  Level test:      1
  Total nodes:     N

  Files created/modified:
    data/openings/{slug}.ts
    data/openings/{slug}-lessons.ts

  Major variations (build these next):
    - {variation}: {games} games ({percentage}%)
    - ...
```

---

## Key Principles

1. **Masters data is the source of truth.** Every move comes from masters.json. The LLM writes explanations, not moves.
2. **Predict/Reveal is the format.** No separate teach section. The prediction IS the teaching.
3. **No punish sections.** Deviations are valid theory, not mistakes to punish.
4. **Every lesson teaches exactly 3 moves for the user's color.** No exceptions.
5. **Predict = clean board.** No arrows or highlights showing the answer. Only highlight opponent's last move for context.
6. **Reveal = arrow + explanation.** After correct guess or reveal, show the move with an arrow and explain why.
7. **Beginner-friendly feedback.** 1 sentence, plain English, reference actual board state.
8. **2 wrong guesses then reveal.** UI handles the reveal — just structure the steps correctly.
9. **Recall = zero guidance.** "Your move." + move notation only.
10. **Level test includes deviations.** Test the main line AND deviation responses.
11. **Accuracy > creativity.** Every square and piece referenced in feedback must be verifiable from the FEN.
12. **Skip thin deviations.** Only pick deviations where we have at least 3 response moves for our side.
