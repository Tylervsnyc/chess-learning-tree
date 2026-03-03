# Chess Agent

> Chess puzzle processing, board interaction, move validation, animation timing, and sound effects.

## Write Scope

- `lib/puzzle-utils.ts` — Puzzle processing, move validation, normalization
- `lib/sounds.ts` — Sound effects and audio warmup
- `lib/puzzle-selector.ts` — Puzzle selection and filtering
- `components/puzzle/` — All shared puzzle components

## Workflow

1. Read RULES.md chess sections (§17, §18, §19, §24)
2. Check canonical implementations in `lib/puzzle-utils.ts`
3. Search for inline reimplementations — grep for `processPuzzle`, `normalizeMove`, `isCorrectMove` in page files. Consolidate first.
4. Implement in the canonical location only

## The Lichess Puzzle Rules (CRITICAL)

### 1. The First Move is the Opponent's
```
Raw puzzle: fen = position BEFORE opponent's setup move
  moves[0] = opponent's setup move (creates the tactic)
  moves[1+] = player's solution moves

Processing: Load FEN → apply moves[0] → get puzzleFen
  Player's color = whoever's turn AFTER moves[0]
  Player moves = odd indices (1, 3, 5...)
```

### 2. Animation Timing (3-Step Pattern)
```
Step 1: animationDuration = 0     → snap to originalFen
Step 2: wait 100ms
Step 3: animationDuration = 300   → set puzzleFen (animates)
Step 4: wait 300ms                → clear isAnimatingSetup
```
These values were tuned through multiple bug iterations — don't change them.

### 3. Move Normalization
Strip check (+) and checkmate (#) symbols before comparing. This function MUST live in `lib/puzzle-utils.ts`.

### 4. UCI vs SAN
- **UCI** (`e2e4`): Storage and `isCorrectMove()` comparison
- **SAN** (`Nf3`, `Qe6+`): Display. Don't mix formats.

### 5. Auto-Queen Promotion
Always `promotion: 'q'`. Never show a promotion choice UI.

### 6. Audio Warmup (iOS Critical)
`warmupAudio()` MUST run synchronously inside a user gesture handler. iOS Safari permanently blocks audio if in async callbacks.

### 7. Wrong Answer Flow
```
1st wrong → "2 attempts remaining"
2nd wrong → "1 attempt remaining"
3rd wrong → Show green hint (#58CC02 on from/to squares)
```

### 8. Board Styling
Dark: `#779952`, Light: `#edeed1`, Selected: `rgba(255,255,0,0.4)`, Hint: `#58CC02`

## Common Pitfalls

- **Inline `processPuzzle` in pages** — If a page has its own puzzle processing, it's a bug. Import from `lib/puzzle-utils.ts`.
- **`animationDuration` not reset to 0** — Pieces fly from old positions.
- **SAN comparison without normalization** — `Qe6+` !== `Qe6#` even though both are correct.
- **Audio in async callback** — iOS permanently blocks the AudioContext.
- **Wrong `playerColor`** — Must derive AFTER applying setup move, not from raw FEN.
- **Not auto-queening** — Missing `promotion: 'q'` causes pawn moves to fail silently.
