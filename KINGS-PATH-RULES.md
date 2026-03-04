# KINGS-PATH-RULES.md - The King's Path

**Source of truth for The King's Path feature. When in doubt, this document is correct.**

A daily fog-of-war puzzle game where players guide a white King through a fog-covered chess board to reach a Golden Rook. Enemy chess pieces (black) hide in the fog. As the King explores, the fog lifts and enemy pieces are revealed. Players must use their chess knowledge of how pieces attack to find the safe path.

**Tagline:** "Guide your King through the fog. Reach the Golden Rook."

---

## Table of Contents

1. [Game Concept](#1-game-concept)
2. [Core Rules](#2-core-rules)
3. [Piece Behavior](#3-piece-behavior)
4. [Difficulty Scaling](#4-difficulty-scaling)
5. [Satisfying Puzzle Patterns](#5-satisfying-puzzle-patterns)
6. [Level Design Rules](#6-level-design-rules)
7. [Level Validation](#7-level-validation)
8. [Visual Design](#8-visual-design)
9. [Sound Design](#9-sound-design)
10. [Share Card](#10-share-card)
11. [Current Files](#11-current-files)
12. [Future Work](#12-future-work)

---

## 1. Game Concept

"The King's Path" is a minesweeper-meets-chess fog-of-war game. It is a NEW GAME that uses chess as its language (like Wordle uses English).

### Why It Works

- **Teaches chess organically** -- you learn bishops are scary on diagonals because you got burned by one.
- **Same puzzle for everyone** = shared social experience (the Wordle formula).
- **Minesweeper-level addictiveness** with chess piece logic replacing number clues.
- **The share card** (a dark board with a golden illuminated path) is visually unique -- unlike anything in anyone's group chat.

---

## 2. Core Rules

### Board and Setup

- **Variable board size:** Scales by day of week (Monday = small, Sunday = large). See [Section 4](#4-difficulty-scaling).
- **King (white)** starts in the bottom-left corner (col 0, max row).
- **Golden Rook (target)** is in the top-right corner (max col, row 0).
- **Enemy pieces (black)** -- knights, bishops, rooks -- are placed on the board, hidden in fog.
- **Player has 3 lives** (shown as hearts).

### The #1 Rule: NO GUESSING

**A player should NEVER have to guess.** Every move should be deducible from visible information. This is enforced by the following rules:

- Only **REVEALED** (currently visible) enemy pieces can hurt you.
- Hidden pieces in fog are harmless until revealed.
- Exploration is always safe -- the danger comes from ignoring threats you can already see.
- If you lose a life, it is because you missed an attack pattern from a piece you could see.

This is the single most important design constraint. Every level, every piece placement, every mechanic follows from this rule.

### Movement

- Tap/click an adjacent square (8 directions, like a chess king) to move the King.
- King cannot move to squares occupied by enemy pieces.
- Valid moves are shown as small dots on the board.

### Fog and Reveal

- **Reveal radius: 2** (Chebyshev distance -- all squares within 2 steps in any direction, including diagonals).
- When the King moves to a new square, all squares within the reveal radius become **permanently visible**.
- Previously revealed squares stay revealed. Fog only lifts, never returns.
- The Golden Rook target is **ALWAYS visible** through the fog as a golden beacon (reduced opacity, pulsing glow).

### Attack and Damage

- When a player moves to a square attacked by a **CURRENTLY VISIBLE** enemy piece: lose 1 life.
  - The attacking piece is highlighted (the player should have seen it).
  - Board shakes, error sound plays.
- When a player moves to a square and **REVEALS a new enemy piece**: safe, no damage, but that piece is now dangerous for future moves.
- **0 lives = game over.**

Important: The attack check happens BEFORE the move reveals new squares. This enforces the no-guessing rule -- you can only be punished for threats you already knew about.

### Win Condition

- King reaches the Golden Rook square.
- The target square must NOT be attacked by any enemy piece (visible or hidden). This is a level design constraint, not a runtime rule.

### Scoring

- **Moves taken** (fewer = better).
- **Lives remaining** (more = better).
- Score messages:
  - 3/3 lives: "Perfect -- Zero mistakes!"
  - 2/3 lives: "Great path -- barely scratched!"
  - 1/3 lives: "Made it through -- just barely!"

---

## 3. Piece Behavior

All pieces follow standard chess attack rules. The key mechanic is **blocking** -- sliding pieces (bishops, rooks) have their attacks cut short when another piece sits on their line.

### Knight (black)

- Attacks in L-shapes: 2 squares in one direction + 1 square perpendicular (or vice versa).
- **Cannot be blocked** by other pieces. Knights jump.
- Creates scattered, hard-to-predict threat zones.
- All 8 possible L-shape offsets: `(+1,+2), (+1,-2), (-1,+2), (-1,-2), (+2,+1), (+2,-1), (-2,+1), (-2,-1)`.

### Bishop (black)

- Attacks along **diagonals** (any distance, all 4 diagonal directions).
- **CAN be blocked** by other pieces on the diagonal. The attack ray stops at the first piece it hits.
- Key mechanic: **Bishop Gate** -- another piece on a bishop's diagonal cuts its attack short, creating safe squares beyond the blocker.

### Rook (black)

- Attacks along **ranks (rows) and files (columns)** in straight lines (any distance, all 4 orthogonal directions).
- **CAN be blocked** by other pieces on the line. The attack ray stops at the first piece it hits.
- Key mechanic: **Rook Tunnel** -- another piece on the rook's row/column blocks its attack, creating a gap the player can pass through.

### King (white -- the player)

- Moves one square in any direction (8 directions: orthogonal + diagonal).
- This is the player's piece.

### Golden Rook (target)

- Does **NOT attack** -- it is the goal, not a threat.
- Always visible through fog (pulses with golden glow).
- Placed at the top-right corner of the board.

### Blocking Rules (Critical for Level Design)

Blocking only applies to **sliding pieces** (bishop, rook). When a piece sits on a sliding piece's attack line:

1. The sliding piece attacks all squares **up to and including** the blocking piece's square.
2. Squares **beyond** the blocker on that line are safe from the sliding piece.
3. The blocker itself may create its own attack zone (e.g., a knight blocking a rook still attacks its L-shaped squares).
4. Only enemy pieces block each other. The King does NOT block attack lines.

---

## 4. Difficulty Scaling (Monday to Sunday)

Like the NYT crossword: Monday is quick, Sunday is an event.

| Day | Board Size | Enemies | Pieces Used | Time Estimate |
|-----|-----------|---------|-------------|---------------|
| Monday | 5x5 | 2-3 | Knights, bishops | 1-2 min |
| Tuesday | 5x5 | 3-4 | Knights, bishops | 2-3 min |
| Wednesday | 6x6 | 4 | Knights, bishops | 3-4 min |
| Thursday | 6x6 | 4-5 | Knights, bishops, rook | 3-5 min |
| Friday | 7x7 | 5 | Knights, bishops, rooks | 5-7 min |
| Saturday | 7x7 | 5-6 | All piece types | 5-8 min |
| Sunday | 8x8+ | 6-7 | All piece types, multiple rooks | 8-15 min |

Special events could go larger -- up to 19x19 (like a Go board).

### Difficulty Levers

- **Board size** -- larger boards = longer paths, more exploration.
- **Enemy count** -- more enemies = more threats to track.
- **Piece types** -- knights are unpredictable, bishops create diagonal walls, rooks create orthogonal walls.
- **Blocker density** -- more blockers = more "aha" moments from finding safe corridors.
- **Path complexity** -- solution path with more turns and backtracking = harder.

---

## 5. Satisfying Puzzle Patterns

These are the design patterns that make levels feel clever. Every level should use at least 1-2 of these.

### Pattern 1: The Rook Tunnel

A rook controls an entire rank/file, seeming to create an impassable wall. But another piece sits on that line, BLOCKING the rook's sliding attack. Squares beyond the blocker are safe. The player discovers the gap and sneaks through.

**Why it's satisfying:** The wall looks impossible until you notice the blocker. Classic "aha" moment.

### Pattern 2: The Bishop Gate

A bishop's diagonal is cut short by another piece sitting on it. The squares beyond the blocker are safe. Creates a narrow corridor through otherwise dangerous territory.

**Why it's satisfying:** Diagonals are tricky for new players -- finding the gate teaches diagonal awareness.

### Pattern 3: The Impossible Corridor

Multiple pieces' attack zones overlap, and it LOOKS like every square is covered. But because pieces block each other's sliding rays, there's exactly one safe square to thread through. The most satisfying "aha" moment.

**Why it's satisfying:** Maximum tension ("there's no way through") followed by maximum reward ("wait... that square is safe!").

### Pattern 4: The Discovery

The player explores one direction and reveals a piece. That piece happens to block ANOTHER piece's attack line elsewhere on the board. Now a previously dangerous area becomes safe. The player backtracks to use the newly opened route.

**Why it's satisfying:** The player's own exploration changes the board state. Feels like outsmarting the puzzle.

### Pattern 5: The Knight Shield

A knight sits on a rook or bishop's attack line, blocking it. Knights themselves only attack L-shaped squares, so the knight creates a "safe zone" on the line it blocks while only threatening specific nearby squares.

**Why it's satisfying:** Knights feel random until you realize they're helping you by sitting on a dangerous line.

### Pattern 6: The Fork in the Fog

Two paths seem viable. One leads deeper into danger (more pieces revealed = more threats). The other has a piece blocking another piece, making it the safe route. The player must explore to discover which is which.

**Why it's satisfying:** The fog mechanic shines -- you're rewarded for cautious exploration.

---

## 6. Level Design Rules

### Mandatory Constraints

These MUST be true for every level. The validator checks all of them.

1. **King's starting square** must NOT be attacked by any initially-visible enemy piece.
2. **Target square** must NOT be attacked by ANY enemy piece (visible or hidden).
3. **Target square** must NOT be occupied by any piece.
4. **No two pieces** on the same square.
5. Every level MUST be **solvable** (verified by BFS validator -- see [Section 7](#7-level-validation)).
6. There must always exist a path where the player **never needs to guess**.

### Design Principles

- **Pieces MUST block each other.** Without blockers, rooks and bishops create impassable barriers on small boards. Blocking is the core mechanic that makes levels solvable and interesting.
- **Rooks need blockers on BOTH their row and column** to be passable on boards under 8x8. A rook with no blockers controls an entire row AND column -- that's too much territory.
- **Spread enemies across the board** -- don't cluster them all in one area. Players should encounter threats throughout their journey.
- **The solution path should have turns** -- straight diagonal paths from bottom-left to top-right are boring. Force the player to navigate, backtrack, or take indirect routes.
- **Place at least one enemy near the start** so the player immediately encounters a threat and learns the mechanic.
- **Place at least one enemy near the target** so the final approach is tense.

### King and Target Positions

- King always starts at `(0, size-1)` -- bottom-left corner.
- Target (Golden Rook) is always at `(size-1, 0)` -- top-right corner.
- This creates a natural diagonal journey across the board.

### Board Coordinate System

- `(col, row)` where col is x (left to right, 0-indexed) and row is y (top to bottom, 0-indexed).
- Row 0 is the TOP of the board. Row `size-1` is the BOTTOM.
- So King at `(0, size-1)` = bottom-left, target at `(size-1, 0)` = top-right.

---

## 7. Level Validation

A BFS validator function exists in the codebase (`validateLevel()` in `app/test-kings-path/page.tsx`) that:

### What It Checks

1. **Pre-checks:**
   - No two enemies on the same square.
   - King doesn't start on an enemy square.
   - Target isn't occupied by an enemy.
   - Target isn't attacked by ANY piece (visible or hidden).
   - King's start isn't attacked by initially-visible enemies.

2. **BFS search:**
   - State = `(col, row, revealedEnemyBitmask)`.
   - Uses enemy bitmask for efficient state tracking: `2^N` enemy visibility states x board squares.
   - Simulates the "only visible pieces attack" rule correctly.
   - Tracks which enemies are revealed based on visited positions and reveal radius.
   - Only considers moves to squares NOT attacked by currently-visible enemies.
   - Confirms a safe path exists from King to target.
   - Reports optimal path length and which enemies were encountered.

### Validator Interface

```typescript
interface ValidatorResult {
  solvable: boolean;
  path: [number, number][] | null;
  reason?: string;
  pathLength?: number;
  enemiesEncountered?: string[];
}
```

### Level Definition Interface

```typescript
interface LevelDef {
  name: string;          // Day of week or level name
  subtitle: string;      // Thematic subtitle
  size: number;          // Board dimension (NxN)
  king: [number, number];    // Starting position [col, row]
  target: [number, number];  // Target position [col, row]
  enemies: Enemy[];          // Array of enemy pieces
  revealRadius: number;      // Chebyshev reveal distance (always 2)
}

interface Enemy {
  type: 'knight' | 'bishop' | 'rook';
  col: number;
  row: number;
}
```

### Validation Rule

**Every level MUST pass validation before shipping.** The validator runs automatically when a level is loaded in the test page and logs results to the console.

---

## 8. Visual Design

### Board Colors

| Element | Light Square | Dark Square |
|---------|-------------|------------|
| Fog (unrevealed) | `#2a3a4a` | `#1e2e3e` |
| Revealed (standard chess) | `#edeed1` | `#779952` |

- **Fog squares** have a subtle inner border: `inset 0 0 0 1px rgba(255,255,255,0.04)` for grid visibility in fog.
- **Transition:** `background-color 0.4s ease-out` when fog lifts (smooth reveal animation).
- **Path trail:** Subtle gold overlay `rgba(255, 215, 0, 0.15)` on visited revealed squares.
- **Hit flash:** `#ef4444` (red) when the player steps on an attacked square.

### Pieces

- All pieces use SVGs from the **Lichess piece set** (same as the main app chess board).
- Source: raw SVG strings rendered via `dangerouslySetInnerHTML` (currently inlined in test page, production should use `lib/share/piece-svgs.ts`).
- Piece size: `sqPx * 0.75` (75% of square size).

| Piece | Color | Extra Styling |
|-------|-------|--------------|
| Enemy pieces (knight, bishop, rook) | Black SVGs | `drop-shadow(0 1px 2px rgba(0,0,0,0.3))` |
| King (player) | White SVG | Golden glow: `drop-shadow(0 0 6px rgba(255,215,0,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.3))` |
| Golden Rook (target) | White SVG | Gold CSS filter: `sepia(1) saturate(5) hue-rotate(10deg) brightness(1.1)` + pulse animation |

- Golden Rook in fog: opacity 0.7, larger glow `drop-shadow(0 0 12px rgba(255,215,0,0.5))`.
- Golden Rook revealed: opacity 1, tighter glow `drop-shadow(0 0 8px rgba(255,215,0,0.7))`.

### Valid Move Indicators

- **Empty squares:** Dots at `sqPx * 0.22` diameter.
  - On revealed squares: `rgba(0,0,0,0.18)`.
  - On fog squares: `rgba(255,255,255,0.15)`.
- **Target square (when reachable):** Golden ring border `rgba(255,215,0,0.5)` with 2px width.

### UI Layout

- **Page background:** `bg-chess-page` (#eef6fc) -- matches the rest of the app.
- **Max width:** `max-w-lg mx-auto w-full` -- matches app containment rules.
- **Header row 1:** "THE KING'S PATH" gradient pill (amber-500 to yellow-400 to amber-500) + hearts (lives).
- **Header row 2:** Level name + subtitle + move counter.
- **Board:** Centered, with rounded corners (`rounded-lg`), overflow hidden, box shadow (`shadow-xl`).
- **Piece legend:** Below board, shows currently visible enemy pieces with icons and labels.
- **Controls:** Reset and Menu buttons below the legend.
- **Square size calculation:** `Math.floor(Math.min(64, (340 - 4) / level.size))` -- ensures board fits on mobile screens.

### Animations

```css
/* Board shake on life loss */
@keyframes kp-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(2px); }
}

/* Golden rook beacon pulse */
@keyframes kp-gold-pulse {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(255,215,0,0.4)); }
  50% { filter: drop-shadow(0 0 14px rgba(255,215,0,0.9)); }
}

/* Enemy piece pop-in on reveal */
@keyframes kp-piece-appear {
  from { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  to { transform: scale(1); opacity: 1; }
}
```

- `kp-shake`: 0.4s ease-out, horizontal shake +/-5px.
- `kp-gold-pulse`: 2s infinite, drop-shadow oscillates between 6px and 14px.
- `kp-piece-appear`: 0.4s, scale 0 to 1.15 (overshoot) to 1.

### Game Phase Screens

#### Menu Screen
- Title with gradient pill.
- "How to Play" card with icons explaining mechanics.
- Level selection cards showing name, subtitle, board size, and enemy count.

#### Won Screen
- Large golden rook icon with glow.
- "PATH FOUND!" heading.
- Stats: move count + lives remaining (hearts).
- Score message based on lives remaining.
- "Next Level" button (green, chess-green) + "Replay" button.
- "Back to menu" link.

#### Lost Screen
- King icon (no glow).
- "PATH BLOCKED" heading.
- "Try Again" button (green) + "Back to menu" link.

---

## 9. Sound Design

All sounds are from the existing app sound system (`lib/sounds.ts`).

| Event | Sound | Function |
|-------|-------|----------|
| Safe move | Move + ascending tone | `playMoveSound()` + `playCorrectSound(moveIndex)` |
| Life loss | Duolingo "womp womp" | `playErrorSound()` |
| Win | C Major arpeggio | `playCelebrationSound()` |
| First interaction | Audio warmup | `warmupAudio()` |

- `playCorrectSound(moveIndex)` produces an ascending chromatic scale as the player makes more moves -- each move sounds slightly higher.
- Audio warmup is called on the first user interaction (starting a game) to unlock the browser audio context.

### Future Sound Ideas (Not Yet Built)

- Fog reveal sound (soft whoosh as tiles become visible).
- Piece discovery sound (tense chord when a new enemy is revealed).
- Heartbeat sound at 1 life remaining.

---

## 10. Share Card

The share card is the viral loop mechanism. The concept is unique and eye-catching.

### Visual Concept

A dark board with a glowing golden path snaking through it. Each player's path is different. The visual is unlike anything in anyone's group chat -- immediately recognizable.

### Required Elements

- The board (fog + revealed areas showing the contrast).
- The golden path the player took (glowing trail).
- Lives remaining (hearts).
- Move count.
- "chesspath.app" branding.

### Design Status

Details TBD. The share card should follow the same server-side OG image approach used by Daily Rook (`app/api/og/daily-challenge/route.tsx`).

---

## 11. Current Files

| File | Purpose |
|------|---------|
| `app/test-kings-path/page.tsx` | Playable demo with all game logic, UI, and 4 hand-crafted levels |
| `KINGS-PATH-RULES.md` | THIS document -- source of truth for the feature |

### Existing Hand-Crafted Levels (in test page)

All levels BFS-validated as solvable with zero guessing required.

| Level | Name | Board | Enemies | Key Pattern | Optimal Path |
|-------|------|-------|---------|-------------|-------------|
| 1 | Monday -- "First Steps" | 5x5 | 2 knights | Intro — learn knight avoidance | 6 moves |
| 2 | Wednesday -- "The Bishop Gate" | 6x6 | 1 bishop + 3 knights | Bishop's NE diagonal blocked by knight — (3,1) and (4,0) become safe, the only approach to target | 7 moves |
| 3 | Saturday -- "The Rook Tunnel" | 7x7 | 1 rook + 2 knights + 2 bishops | Rook controls row 3, knight blocks rightward attack — (6,3) is the tunnel through the wall | 9 moves |
| 4 | Sunday -- "The Gauntlet" | 8x8 | 1 rook + 1 knight + 3 bishops | Bishop blocks left column forcing right-side routing. Rook creates row 4 + col 4 cross. Knight blocks rook row right — (7,4) is the tunnel. Player MUST use the tunnel to win. | 11 moves |

---

## 12. Future Work

Unchecked items are not yet built.

### Core Game
- [ ] Algorithmic puzzle generator (constraint satisfaction + BFS validation)
- [ ] Daily puzzle seeded by date (same puzzle for everyone, like Wordle)
- [ ] Monday-to-Sunday difficulty ramp using automated generation

### Social and Growth
- [ ] Share card generation (server-side OG image, dark board + golden path)
- [ ] Leaderboard (fewest moves, most lives)
- [ ] Streak integration with existing streak system

### Polish
- [ ] Sound design specific to King's Path (fog reveal, piece discovery)
- [ ] Attack line visualization (show attacked squares when tapping a revealed piece)
- [ ] Tutorial/onboarding for first-time players
- [ ] Undo move feature (costs a life? or free with ad?)

### Infrastructure
- [ ] Database table for results storage
- [ ] API route for daily puzzle delivery
- [ ] Move piece SVGs to shared `lib/share/piece-svgs.ts` (avoid duplication with main chess board)
- [ ] Extract game logic from test page into reusable hook (`useKingsPath`)
- [ ] Production page at `/kings-path` (not `/test-kings-path`)

---

## Appendix A: Attack Calculation Reference

The `attackedBy()` function calculates which squares a given enemy attacks, taking blocking into account.

```
For knights:
  - Check all 8 L-shaped offsets
  - No blocking -- all valid squares within board bounds are attacked

For bishops:
  - Slide along 4 diagonal directions: (+1,+1), (+1,-1), (-1,+1), (-1,-1)
  - For each direction, extend ray one square at a time
  - Stop at board edge OR when hitting another enemy piece (that square IS attacked, squares beyond are NOT)

For rooks:
  - Slide along 4 orthogonal directions: (0,+1), (0,-1), (+1,0), (-1,0)
  - Same sliding/blocking rules as bishop
```

### Reveal Radius Calculation

Chebyshev distance (chess "king distance"): all squares where `max(|col_diff|, |row_diff|) <= radius`.

With radius 2, this reveals a 5x5 area centered on the King (clipped to board boundaries).

## Appendix B: State Space Complexity

The BFS validator explores states of the form `(col, row, enemyVisibilityBitmask)`.

- Board positions: `N x N` (where N is board size)
- Enemy visibility states: `2^E` (where E is number of enemies)
- Total state space: `N^2 * 2^E`

For the Sunday level (8x8, 6 enemies): `64 * 64 = 4,096` possible states. This is very tractable for BFS.

For theoretical maximums (19x19, 15 enemies): `361 * 32,768 = 11,829,248` states. Still feasible but would need optimization.

---

*This document is the source of truth for The King's Path. When in doubt, this document is correct.*
