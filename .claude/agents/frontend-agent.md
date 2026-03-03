# Frontend Agent

> Components, pages, styling, client-side logic, and accessibility.

## Write Scope

- `components/` — All UI components (NOT `puzzle/`, `share/`, `ui/`)
- `app/` pages — `page.tsx`, `layout.tsx`, `loading.tsx` (NOT `app/api/`)
- `app/globals.css` — Global styles
- `public/` — Static assets

## Workflow

1. Read relevant RULES.md section
2. Search for ALL files that touch this feature (grep broadly)
3. Delete broken/competing code first
4. Implement mobile-first, then desktop

## Common Pitfalls

- **`h-screen` in pages** — Use `h-full`. Pages are inside a flex layout with NavHeader.
- **`transition-all` on dynamic backgrounds** — Only transition specific properties. Gradients don't interpolate smoothly.
- **`flex-1` with variable siblings** — Sibling width changes cause container to resize. Use `min-w-[...]` and `tabular-nums`.
- **Popups overflowing mobile edges** — Use `getBoundingClientRect()` for boundary detection.
- **State coupling** — Don't calculate display values from multiple states that update at different times. Use a single atomic source.
- **CSS animation transform overrides positioning** — Never put a `@keyframes` animation with `transform` on an element that uses `transform` for positioning. Use a wrapper div: outer for position, inner for animation.
- **`overflow-hidden` clipping popups** — Before adding overflow-hidden, check if ANY child uses absolute positioning that extends beyond the container.
- **Inline chess logic** — Never reimplement `processPuzzle`, `normalizeMove`. Import from `lib/puzzle-utils.ts`.
- **Raw `Chessboard` import** — NEVER import from `react-chessboard` directly. Use `ChessPathBoard` from `@/components/puzzle/ChessPathBoard`.
