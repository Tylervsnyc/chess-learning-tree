# Test Screen Agent

> Build comparison/test pages so Tyler can visually evaluate design variants side by side.

---

## Context Required

Read these files before starting any task:
- `.claude/design-system.md` — Color tokens, typography, spacing, component patterns
- `.claude/lessons-learned.md` — Scroll bugs, mobile-first rules
- `app/globals.css` — Body has `overflow: hidden`, pages must provide own scroll container

---

## Write Scope

You may create or modify:
- `app/test-*/page.tsx` — Test/comparison pages only

---

## Read-Only Scope

You may read (but not modify):
- Any component in `components/` — to understand what real components to import
- `lib/puzzle-utils.ts` — Board colors, chess helpers
- `RULES.md` — Any section relevant to the feature being tested
- `.claude/design-system.md` — Tokens and patterns

---

## Hard Rules

### Scroll
- **Body has `overflow: hidden`.** Every test page MUST use `h-full overflow-y-auto` on its root wrapper — NOT `min-h-screen`.
- Add `pb-24` for bottom padding so content isn't hidden behind sticky footers.
- Never use `overflow-hidden` on the page wrapper.

### Real Components
- **Use `ChessPathBoard`** from `@/components/puzzle/ChessPathBoard` — NEVER import `Chessboard` from `react-chessboard` directly. ChessPathBoard pre-applies our board colors and styling automatically.
- Use actual design tokens from the design system — never hardcode hex values for UI elements.
- Use the real `NavHeader`, design tokens, and other app components when relevant.

### Layout
- Mobile-first: `max-w-md mx-auto` for centering.
- Each design variant in a tappable card with clear label (A, B, C...) and name.
- Show a "CURRENT" badge on the existing design for comparison.
- Show a "PICK" badge on the selected variant.
- Sticky footer showing the current selection.

### Board Setup
- Pick a clear, realistic chess position that demonstrates the feature well.
- Orient the board from the relevant player's perspective.
- Use `squareStyles` prop for all square highlighting — this is how the real app does it.
- All highlight styles must be pure CSS (backgroundColor, boxShadow, background gradients) — no DOM overlays on the board.

### Page Structure Template
```tsx
'use client';

import { useState } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';

// FEN for the demo position
const DEMO_FEN = '...';

type Design = {
  name: string;
  tag: string;
  getStyles: () => Record<string, React.CSSProperties>;
};

const designs: Design[] = [
  // Always include current design first with tag 'CURRENT'
  { name: 'Current — ...', tag: 'CURRENT', getStyles: () => ({}) },
  // Then A, B, C, etc.
];

export default function TestPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-chess-page px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Title + description */}
        {/* Design cards with real Chessboard */}
        {/* Sticky selection footer */}
      </div>
    </div>
  );
}
```

---

## Quality Checklist

Before declaring done:
1. Page scrolls on mobile (h-full overflow-y-auto, NOT min-h-screen)
2. Real chess pieces render (react-chessboard, not Unicode)
3. All variants use squareStyles only (no DOM overlays on board squares)
4. CURRENT design shown first for comparison
5. Design tokens used for all UI chrome (cards, text, badges)
6. At least the number of variants Tyler requested
7. Page compiles — verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/test-{name}` before opening browser
