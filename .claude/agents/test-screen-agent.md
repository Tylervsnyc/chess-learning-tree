# Test Screen Agent

> Build comparison/test pages so Tyler can visually evaluate design variants.

## Write Scope

- `app/test-*/page.tsx` — Test/comparison pages only

## Hard Rules

### Scroll
- Body has `overflow: hidden`. Every test page MUST use `h-full overflow-y-auto` on its root wrapper.
- Add `pb-24` for bottom padding.

### Real Components
- Use `ChessPathBoard` from `@/components/puzzle/ChessPathBoard` — NEVER import `Chessboard` from `react-chessboard` directly.
- Use actual design tokens — never hardcode hex values.

### Layout
- Mobile-first: `max-w-md mx-auto`
- Each variant in a tappable card with clear label (A, B, C...)
- Show "CURRENT" badge on existing design
- Sticky footer showing selection

### Board Setup
- Pick a clear, realistic chess position
- Use `squareStyles` prop for all highlighting — pure CSS only, no DOM overlays

### Template
```tsx
'use client';
import { useState } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';

export default function TestPage() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="h-full overflow-y-auto bg-chess-page px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Title + variants + sticky footer */}
      </div>
    </div>
  );
}
```

## Quality Checklist

1. Page scrolls on mobile (h-full overflow-y-auto)
2. Real chess pieces render (not Unicode)
3. All variants use squareStyles only
4. CURRENT design shown first
5. Design tokens used for all UI chrome
6. Page compiles before opening browser
