# Opening Detail Page Design Rules

Rules for `/openings/[slug]` detail pages and related opening sub-pages.

---

## 3D Floating Header Card

All opening pages that represent a single opening use a **sticky 3D floating card** header — matching the level header pattern from `/learn`.

### Structure
- **Back button** sits above the card (not inside it)
- **3D depth layers**: two offset background divs behind the main card
  - Layer 1: `translate(8px, 8px)`, opacity 0.25
  - Layer 2: `translate(4px, 4px)`, opacity 0.45
  - Both use `opening.color` as background
- **Main card**: `rounded-2xl`, `border-2`, gradient background from `colorDark → color → colorLight`
- **Sticky**: `sticky top-2 z-40` so it floats at the top on scroll

### Mini Board Preview
- 140x140px `ChessPathBoard` inside the card (left side)
- **No rounded corners** on the board (`borderRadius: '0px'`)
- **No dragging**, no animations, no notation
- Board oriented to match `opening.side` (white or black)
- **Last move highlighted** in orange:
  - `from` square: `rgba(255, 170, 0, 0.5)`
  - `to` square: `rgba(255, 170, 0, 0.6)`
- FEN computed from `opening.moves` in the registry using `chess.js`

### Copy (right side of board)
- Opening name: `text-[20px] font-[900] text-white`
- Moves pill: dark frosted pill (`rgba(0,0,0,0.2)`), mono font `text-[10px] text-white/80`
- Description: `text-[12px] text-white/80` — must be readable, no low-opacity text

### Pages using this pattern
- `/openings/[slug]` — full card with board + copy
- `/openings/[slug]/tree` — compact version (just back arrow + title, no board)

### Pages NOT using this pattern
- `/openings` hub — uses tabs, not an opening-specific header
- `/openings/[slug]/[lessonId]` — gameplay page, has its own puzzle UI
- `/openings/[slug]/[lessonId]/share` — OG image page

---

## Color System

Every opening in the registry defines three colors:
- `color` — primary
- `colorDark` — dark accent (borders, shadows, gradients)
- `colorLight` — light accent (gradient highlights)

All opening page gradients use: `linear-gradient(135deg, colorDark 0%, color 40%, colorLight 100%)`

---

## Key Files
- `app/openings/[slug]/page.tsx` — detail page with 3D header + board
- `app/openings/[slug]/tree/page.tsx` — tree page with compact 3D header
- `data/openings/registry.ts` — opening metadata, colors, moves
- `components/puzzle/ChessPathBoard.tsx` — board wrapper (always use this, never raw Chessboard)
