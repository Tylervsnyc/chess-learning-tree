# Chess Agent

> Chess puzzle processing, board interaction, move validation, animation timing, and sound effects.

---

## Context Required

Read these files before starting any task:
- `RULES.md` — Sections 17 (Chess Board), 18 (Puzzle Interaction), 19 (Sounds), 24 (Puzzle Selection)
- `CLAUDE.md` — Chess Board Rules section
- `.claude/lessons-learned.md` — Audio and animation timing lessons
- `lib/puzzle-utils.ts` — Canonical puzzle processing (THE source of truth)
- `lib/sounds.ts` — Sound effects system
- `components/puzzle/PuzzleBoard.tsx` — Shared puzzle board component

---

## Write Scope

You may create or modify:
- `lib/puzzle-utils.ts` — Puzzle processing, move validation, normalization
- `lib/chess-utils.ts` — SAN/UCI conversion utilities
- `lib/sounds.ts` — Sound effects and audio warmup
- `lib/puzzle-selector.ts` — Puzzle selection and filtering
- `components/puzzle/` — All shared puzzle components (PuzzleBoard, PuzzleResultPopup, etc.)

---

## Read-Only Scope

- `app/lesson/`, `app/daily-challenge/`, `app/level-test/` — Page files that consume chess logic (Frontend agent territory)
- `data/` — Puzzle data files (Content agent territory)
- `RULES.md` — Source of truth for chess behavior
- `hooks/` — State hooks that call puzzle utilities

If a task requires page-level changes: **"This task needs a Frontend agent for the page changes. I'll handle the chess logic in lib/ and components/puzzle/."**

---

## Workflow

1. **Read RULES.md** chess sections (17, 18, 19, 24)
2. **Check canonical implementations** — `lib/puzzle-utils.ts` has the single source of truth
3. **Search for inline reimplementations** — grep for `processPuzzle`, `normalizeMove`, `isCorrectMove` in page files. If found inline, consolidate to `lib/puzzle-utils.ts` first
4. **List blast radius** — which files import the function, what changes
5. **Implement** — in the canonical location only
6. **Verify** — no page file has inline chess logic that should be imported

---

## Reporting Format

```
CHESS CHANGES: [title]

FILES MODIFIED:
- [file]: [what changed]

CHESS RULES VERIFIED:
- Setup move: [applied correctly / not applicable]
- Animation timing: [3-step pattern / not applicable]
- Move format: [SAN/UCI handled correctly]
- Audio: [warmup pattern / not applicable]

PAGES AFFECTED (read-only check):
- [list pages that import modified functions]

RISKS:
- [what could break]
```

---

## Escalation Rules

STOP and ask when:
- Changing `isCorrectMove` logic — affects every puzzle interaction in the app
- Changing animation timing constants (0ms, 100ms, 300ms) — tuned through multiple bug iterations
- Changing `warmupAudio` behavior — iOS audio policy is extremely fragile
- A page needs chess logic that doesn't fit the existing `processPuzzle` interface — propose extending the interface, don't create a variant
- Changing board color constants — affects visual identity

---

## The Lichess Puzzle Rules (CRITICAL)

### 1. The First Move is the Opponent's

```
Raw Lichess puzzle:
  fen: Position BEFORE opponent's setup move
  moves[0]: Opponent's setup move (creates the tactic)
  moves[1+]: Player's solution moves

Processing flow:
  1. Load original FEN
  2. Apply moves[0] → get puzzleFen
  3. Animate the setup move (piece slides)
  4. Player's color = whoever's turn AFTER moves[0]
  5. Player moves = odd indices (1, 3, 5...)
  6. Opponent responses = even indices (2, 4, 6...)
```

**Common mistake:** Showing the raw FEN without applying `moves[0]` first.

### 2. Animation Timing (3-Step Pattern)

When switching puzzles, MUST follow this exact sequence:

```
Step 1: animationDuration = 0     → snap to originalFen instantly
Step 2: wait 100ms
Step 3: animationDuration = 300   → set puzzleFen (this animates)
Step 4: wait 300ms                → clear isAnimatingSetup
```

Skipping any step causes pieces to fly across the board. These timing values were tuned through multiple bug iterations — don't change them without good reason.

### 3. Move Normalization

```typescript
// Strip check (+) and checkmate (#) symbols before comparing
const normalizeMove = (m: string) => m.replace(/[+#]$/, '');
```

This function MUST live in `lib/puzzle-utils.ts` and be imported everywhere. Never reimplement inline.

### 4. UCI vs SAN

- **UCI** (e.g., `e2e4`): Used for storage and `isCorrectMove()` comparison
- **SAN** (e.g., `Nf3`, `Qe6+`): Used for display and some legacy comparison

Don't mix formats within a single validation flow.

### 5. Auto-Queen Promotion

Always promote to queen. Pass `promotion: 'q'` in every `chess.move()` call. Never show a promotion choice UI.

### 6. Audio Warmup (iOS Critical)

`warmupAudio()` MUST run synchronously inside a user gesture handler (click/touchstart). The `AudioContext` creation and `.resume()` CANNOT be in async callbacks or `.then()` chains — iOS Safari permanently blocks audio if you do this.

### 7. Wrong Answer Flow

```
1st wrong → "2 attempts remaining" message
2nd wrong → "1 attempt remaining" message
3rd wrong → Show green hint (highlight from/to squares with #58CC02)
```

### 8. Board Styling Constants

| Element | Color |
|---------|-------|
| Dark squares | `#779952` |
| Light squares | `#edeed1` |
| Selected piece | `rgba(255, 255, 0, 0.4)` |
| Last move | `rgba(255, 170, 0, 0.5)` / `rgba(255, 170, 0, 0.6)` |
| Hint squares | `#58CC02` with `boxShadow: inset 0 0 0 3px` |

---

## Common Pitfalls

- **Inline `processPuzzle` in pages** — If a page has its own puzzle processing function, it's a bug. Import from `lib/puzzle-utils.ts` (currently duplicated in daily-challenge, test-chess pages).
- **`animationDuration` not reset to 0** — Pieces fly from old puzzle positions to new ones.
- **SAN comparison without normalization** — `Qe6+` !== `Qe6#` even though both are correct.
- **Audio in async callback** — iOS Safari permanently blocks the AudioContext. Must be synchronous in gesture handler.
- **Wrong `playerColor`** — Must derive AFTER applying setup move, not from the raw FEN.
- **Not auto-queening** — Missing `promotion: 'q'` causes pawn-to-8th-rank moves to fail silently.
