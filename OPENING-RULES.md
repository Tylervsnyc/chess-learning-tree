# Opening Lesson Rules

Everything an agent needs to build opening lessons. No need to read RULES.md.

---

## Hard Rule #0

**Every move we teach must be #1 in the Lichess masters database.** Only the opponent deviates (in punish lessons). Verify via:
```
https://lichess.org/api/cloud-eval?fen={URL_ENCODED_FEN}&multiPv=3
```

---

## Lesson Structure

- **3 new moves per lesson** (half-moves, not full moves). Not 2, not 5.
- **6 interactive steps minimum** per lesson (play-move, quiz, or puzzle). No slideshows.
- **10 lessons per tree** (Level 1, Level 2, or standalone variation).
- Every lesson except the first starts with a **recap** section (replay previous moves with `isRecap: true`).
- Punish lessons can be lighter on new content but must hit the 6-step minimum through recap.

### Lesson Flow

1. **Intro instruction** — one sentence, what this lesson covers
2. **Recap** — replay prior moves (auto-advance, play-through mode)
3. **Teach** — instruction explains the move, then play-move for user to execute
4. **Punish section** (optional) — show one opponent mistake and the refutation

### Step Types

| Type | When | Key fields |
|------|------|------------|
| `instruction` | Coach explains, opponent moves | `fen`, `text`, `autoAdvance: 800` for opponent moves |
| `play-move` | User plays a move | `fen`, `correctMove`, `prompt`, `hint`, `correctFeedback`, `wrongFeedback` |
| `quiz` | Multiple choice | `fen`, `question`, `options`, `correctIndex`, `explanation` |
| `puzzle` | Multi-move sequence | `fen`, `solutionMoves`, `playerColor`, `prompt`, `hint` |

### Play-Through Auto-Advance

If the NEXT step after a `play-move` is an `instruction` with `autoAdvance`, the current move is in play-through mode — no "Correct!" popup, just move sound and auto-advance after 400ms. Teaching sections (next step is NOT auto-advance) show the popup with feedback.

---

## Side Rules

- **WHITE opening** (user plays White): White moves = `play-move`, Black moves = `instruction` with `autoAdvance: 800`
- **BLACK opening** (user plays Black): Black moves = `play-move`, White moves = `instruction` with `autoAdvance: 800`
- `defaultOrientation` matches the side the user plays

---

## Tree Structure

Each tree has ~10 nodes:
- **4-5 main line nodes** (col 0, the trunk)
- **2-3 punish nodes** (col -1, opponent mistakes to exploit)
- **1-2 branch nodes** (col 1, important variations)
- **1 test node** at the top

### Tree Engine Rules

- Fixed grid: `row`/`col` are explicit, never computed. Row 0 = bottom.
- `lineFrom` = **visual line** connection (what you see on screen)
- `unlockedBy` = **unlock logic** (follows `completionOrder` exactly — each node unlocked by the previous one)
- These are DIFFERENT concepts. `lineFrom` can differ from `unlockedBy`.
- One current lesson at all times. `completionOrder` is the single unlock chain.
- All lines are horizontal or vertical. No diagonals.

### Node Types

| Type | Purpose |
|------|---------|
| `main` | Core line moves |
| `punish` | Opponent plays badly, user exploits |
| `branch` | Important variation off the main line |
| `test` | Full recall test at end of level |

---

## FEN Rules

**Never hand-write FENs.** All FENs must be computed by chess.js from the move sequence. The generator script handles this automatically.

Common FEN bugs from hand-writing:
- Wrong castling rights after castling
- Missing en passant square after pawn push
- Wrong half-move clock
- Pieces on wrong squares after captures

---

## Writing Style Guide

### Tone
- Conversational, confident, encouraging. Like a coach who respects the student.
- Short sentences. No jargon dumps.
- Playful but not corny.

### Accuracy Rules

**Don't exaggerate positions.** This is the #1 content quality issue.

- Use Lichess eval to calibrate language:
  - **±0.0 to ±0.3** → "equal," "solid," "good developing move"
  - **±0.3 to ±0.7** → "slight edge," "a little better," "puts pressure"
  - **±0.7 to ±1.5** → "clear advantage," "strong position," "serious trouble"
  - **±1.5+** → "winning," "decisive," "crushing"
- If a position is equal, say it's equal. Don't pretend a move is "devastating" when the eval says +0.2.
- "Good developing move" not "devastating blow"
- "Puts pressure on d4" not "destroys White's center"
- "Slight edge" not "winning position"

### Move Descriptions

Every description must be **true for the actual position on the board**:
- If you say "attacks e4" — there must actually be an attack on e4
- If you say "controls the diagonal" — the diagonal must actually be open
- If you say "weak square" — explain why it's weak (no pawn can defend it)
- Reference actual squares and pieces, not generic chess platitudes

### Feedback Text

| Field | Length | Tone | Example |
|-------|--------|------|---------|
| `prompt` | 5-10 words | Direct instruction | "Develop your knight toward the center." |
| `hint` | 1 sentence | Points to the answer | "Your knight can go to f6, where it eyes e4." |
| `correctFeedback` | 1-2 sentences | Celebrates + explains WHY | "Nf6! Attacks the e4 pawn. White has to decide how to defend." |
| `wrongFeedback` | 1 sentence | Redirects without shaming | "Develop your knight to f6 — it puts pressure on e4." |

### Banned Patterns
- "Devastating," "crushing," "obliterating" for positions under ±1.0
- Generic chess platitudes without referencing actual squares
- "This is a famous move" / "Grandmasters love this" — teach the why, not the appeal to authority
- Violence/death language (see RULES.md §26 banned words)

---

## Lesson Creation Process

### Step 1: Get Moves from Lichess

Query Lichess cloud eval for each position in the line. Record:
- The #1 move (this is what we teach)
- The eval (this calibrates our language)
- Alternative moves (potential branch/variation content)
- Bad opponent moves (potential punish content — look for moves eval'd ±1.0+ worse than #1)

### Step 2: Break Into 3-Move Lessons

Take the full main line and split into chunks of 3 half-moves each. Each chunk = one lesson. Name the lesson after the key idea in those 3 moves.

### Step 3: Compute FENs

Use chess.js to apply each move and record the resulting FEN. Never write a FEN by hand. The generator script does this automatically.

### Step 4: Generate Lesson Steps

For each lesson, the generator builds:
1. Intro instruction step
2. Recap steps (replay previous lessons' moves in play-through mode)
3. Teaching steps for each new move:
   - Instruction explaining the move (reference actual position)
   - Play-move step for user to execute
4. Opponent auto-advance steps between user moves

### Step 5: Find Punish Moves

From the Lichess data, find 2-3 positions where a common opponent mistake (played often in lower-rated games but eval'd badly) can be punished. Each punish lesson teaches the refutation.

### Step 6: Find Variations

From the Lichess data, find 1-2 important alternative lines where the opponent plays a different (but reasonable) move. Each variation lesson teaches the user's best response.

### Step 7: Validate

Run the FEN validator to confirm every position matches the move sequence. Verify every taught move is Lichess #1.

---

## Key Files

| File | Purpose |
|------|---------|
| `data/openings/{slug}.ts` | Tree data (nodes, grid, completion order) |
| `data/openings/{slug}-lessons.ts` | Lesson steps (FENs, moves, text) |
| `data/openings/registry.ts` | Master registry (slug, name, colors, hasData) |
| `lib/opening-trees.ts` | Tree lookup map |
| `app/openings/[slug]/[lessonId]/page.tsx` | Shared lesson player |
| `types/opening-lesson.ts` | TypeScript types for all step types |

### Adding a New Opening

1. Create `data/openings/{slug}.ts` — tree with ~10 nodes
2. Create `data/openings/{slug}-lessons.ts` — all lesson data
3. Add to `lib/opening-trees.ts` (import + TREE_LOOKUP entry)
4. Add `get{Name}Lesson` import to `app/openings/[slug]/[lessonId]/page.tsx`
5. Update `data/openings/registry.ts` (set `hasData: true`)
6. Create test page at `app/test/{slug}/page.tsx`
7. Run `npm run check`
