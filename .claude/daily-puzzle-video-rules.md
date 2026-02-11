# Daily Puzzle Video Rules

Rules for the Instagram Reel / daily puzzle video content. **Read this FIRST** before touching `app/test-daily-video/page.tsx`.

---

## Layout Rules (NON-NEGOTIABLE)

1. **Chess board is ALWAYS dead center vertically AND horizontally.** Calculate: `top = (FRAME_H - BOARD_SIZE) / 2`. The board sits at the exact center of the frame. It NEVER moves between stages.

2. **Nothing animates over the chess board.** No overlays, no countdown numbers, no confetti, no text on top of the board. The board is sacred — clean and clear at all times. Confetti/effects go in bottom zone ONLY.

3. **Light background, DARK text.** The reel uses `bg-chess-page` (light blue). ALL text must be dark and clearly readable. Use `text-chess-text` (#2A3C45) for primary text and `text-chess-text-muted` (#6b7c8a) for secondary. NO light/white text anywhere.

4. **Three zones** — Top (above board), Board (exact center), Bottom (below board). The top and bottom zones are equal height: `(FRAME_H - BOARD_SIZE) / 2`. Content changes between stages but the board NEVER shifts.

5. **9:16 aspect ratio** — Instagram Reel format.

---

## Logo Rules
- Use `AnimatedLogo` component with `autoPlay={true}`, `theme="light"` (dark text)
- Logo should be **BIG and centered** at the top of every frame — it's the brand anchor
- Use numeric `size` prop that fills most of the frame width (e.g., `size={0.5}` = 260px wide for a 270px frame)
- The logo animates its rook blocks in on load
- **Logo is rendered in ReelLayout, NOT in individual stages.** Stages only control the text below it.
- **Logo uses ABSOLUTE positioning** (`absolute left-1/2 -translate-x-1/2`, `top: 8px`). It is pixel-pinned and CANNOT be pushed by sibling content. No flexbox, no justify-center — absolute only.
- The text area below the logo is also absolute-positioned (`top: 8 + LOGO_H` to `bottom: 0`), centered with flex.
- **Logo must look identical in all stages.** Do NOT use `autoPlay` or `animateLogo` — the logo appears instantly and consistently everywhere.

---

## Stage Sequence

### Stage 1: Initial
- **Top:** Animated Chess Path logo (big, centered) + "Daily Puzzle" + "{Color} to play" + "Find the best move!"
- **Board:** Starting puzzle position (after opponent's setup move applied)
- **Bottom:** "Chess Path — Shortest path to chess improvement"

### Stage 2: Countdown
- **Top:** Logo + "Can you see it?"
- **Board:** Same starting position (unchanged)
- **Bottom:** "Solution in 3" → "Solution in 2" → "Solution in 1" → "GO!" + "Tap to pause" + footer tagline
- **Format:** The countdown text MUST say "Solution in {N}", NOT just the number

### Stage 3: Animation (Solution)
- **Top:** Logo + "Solution" + "Watch closely!"
- **Board:** Moves animate slowly one by one (pieces slide — ONLY animation allowed on the board)
- **Bottom:** Algebraic notation builds move by move + footer tagline

### Stage 4: Finish (Celebration)
- **Top:** Logo + "Daily Puzzle" + "Checkmate!" + rating info
- **Board:** Final position after all moves
- **Bottom:** Fun celebration effect (confetti — ONLY in bottom zone, NOT over board) + CTA "Play daily puzzles free" + footer tagline

---

## Bottom Copy (every stage)
**"Chess Path"** (bold, dark) + **"Shortest path to chess improvement"** (muted)

---

## Chess Board Rules (from RULES.md)
- Lichess puzzles: `moves[0]` is opponent's setup move. Apply it first, then player solves from `moves[1]`.
- Board colors: dark `#779952`, light `#edeed1`
- **Board goes edge-to-edge** — fills the full frame width (`BOARD_SIZE = FRAME_W`). No side gaps, no rounded corners on the board itself
- Board has a subtle shadow for depth
- Orientation matches player color

## Notation Rules
- Algebraic notation in the solution stage should be **small and subtle** (9px) — it's supplementary, not the focus
- Notation appears in a lightly shaded container below the board

---

## Test Page
- Located at `app/test-daily-video/page.tsx`
- Shows all 4 stages side by side in phone-frame mockups
- Each frame has a "Watch again" button to replay that stage's animations
- Uses a sample puzzle (mateIn3, Ttdum, 829 ELO)

---

## Resolved Issues
- ~~Board must be vertically centered~~ — DONE: board is dead center, zones are equal (105px each)
- ~~Logo needs to be bigger~~ — DONE: fills frame width at size={0.5}
- ~~All text must be visibly dark~~ — DONE: uses chess-text tokens
- ~~Logo inconsistency across stages~~ — DONE: shrink-0 on logo wrapper
- ~~Board had side gaps~~ — DONE: BOARD_SIZE = FRAME_W, edge-to-edge
- ~~Countdown just showed numbers~~ — DONE: "Solution in 3/2/1" format
- ~~Logo shifts between stages~~ — DONE: logo rendered once in ReelLayout, not per-stage
