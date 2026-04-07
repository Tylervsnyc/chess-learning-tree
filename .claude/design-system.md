# Chess Path Design System

A reference guide for anyone (human or AI) building features for Chess Path. Follow these rules and the app will stay visually consistent.

---

## Theme: Light & Friendly

Chess Path uses a **light theme** across all pages. No dark backgrounds on user-facing screens. The vibe is approachable, clean, and Duolingo-inspired — not intimidating chess-club energy.

---

## Color Tokens

Every color in the app should come from these tokens (defined in `globals.css` under `@theme`). Never use raw hex values in components.

### Page Structure
| Token | Value | Use For |
|-------|-------|---------|
| `chess-page` | `#eef6fc` | Page backgrounds (the soft blue) |
| `chess-surface` | `#ffffff` | Cards, modals, input fields |

### Text
| Token | Value | Use For |
|-------|-------|---------|
| `chess-text` | `#2A3C45` | Headings, primary body text |
| `chess-text-muted` | `#6b7c8a` | Secondary text, descriptions |
| `chess-text-faint` | `#94a3b8` | Hints, placeholders, captions |

### Brand Colors
| Token | Value | Use For |
|-------|-------|---------|
| `chess-green` | `#58CC02` | Primary actions (buttons, progress, success) |
| `chess-green-dark` | `#46A302` | Hover states on green buttons |
| `chess-blue` | `#1CB0F6` | Links, secondary actions, info |
| `chess-blue-dark` | `#1899D6` | Hover states on blue elements |
| `chess-gold` | `#FFD700` | Premium features, rewards, streaks |
| `chess-gold-dark` | `#B8860B` | Hover/accent on gold elements |
| `chess-orange` | `#FF9500` | Warnings, attention-grabbing callouts |
| `chess-red` | `#FF4B4B` | Errors, wrong answers, destructive actions |
| `chess-purple` | `#CE82FF` | Achievements, special content |

### Feedback Colors
| Token | Value | Use For |
|-------|-------|---------|
| `chess-correct-bg` | `#D7FFB8` | Correct answer background (puzzle result) |
| `chess-wrong-bg` | `#FFDFE0` | Wrong answer background (puzzle result) |
| `chess-hint-bg` | `#FFF3CD` | Tutorial hint card background |
| `chess-hint-title` | `#7A6200` | Tutorial hint title text |
| `chess-hint-text` | `#8B7000` | Tutorial hint body text |
| `chess-red-shadow` | `#CC3939` | Red button 3D shadow |
| `chess-disabled` | `#c5d4de` | Empty/disabled icons (hearts, stars) |

### Utility
| Token | Value | Use For |
|-------|-------|---------|
| `chess-gray` | `#4B4B4B` | Disabled states, dividers |
| `chess-gray-light` | `#6B6B6B` | Secondary disabled text |

### Dark Theme Tokens
| Token | Value | Use For |
|-------|-------|---------|
| `chess-bg` | `#131F24` | Dark page backgrounds (error pages, lesson complete) |
| `chess-bg-deep` | `#0D1A1F` | Darker card backgrounds inside dark modals |
| `chess-bg-light` | `#1A2C35` | Dark modal cards, dark theme containers |
| `chess-text-light` | `#A3B8C2` | Muted text on dark backgrounds (popups, modals) |

---

## How to Use Tokens in Tailwind

```tsx
// Backgrounds
<div className="bg-chess-page">        // page wrapper
<div className="bg-chess-surface">     // card or container

// Text
<h1 className="text-chess-text">       // heading
<p className="text-chess-text-muted">  // description
<span className="text-chess-text-faint"> // hint

// Buttons
<button className="bg-chess-green text-white hover:bg-chess-green-dark">
<button className="bg-chess-blue text-white hover:bg-chess-blue-dark">

// Borders
<div className="border border-slate-200">  // light borders are fine
<div className="border-chess-green">        // colored borders

// Shadows (use Tailwind defaults, not hex shadows)
<div className="shadow-sm">   // subtle
<div className="shadow-md">   // cards
```

---

## Node / Tree Visualizations

When building tree or graph visualizations (opening trees, skill trees, etc.):
- **Minimum 90px horizontal gap** between node columns
- **Minimum 80px vertical spread** between sibling nodes
- Nodes must have clear breathing room — never pack them tight. If it looks cramped, increase spacing.
- Use `overflow-x-auto` on the container so wide trees scroll horizontally

---

## Lesson Icons

**Rule: No two consecutive lessons may show the same icon.** If tag-matching would repeat, the icon auto-bumps to the next in the cycle.

8 icons available: `queen`, `rook`, `bishop`, `knight`, `pawn`, `star`, `lightning`, `shield`

Tag → icon mapping (in `app/learn/page.tsx`):
- Chess pieces: mate patterns → queen, forks → knight, pins/skewers → bishop, hanging/trapped → rook, pawn themes → pawn
- Non-chess: attacks/crushing → lightning, defense/quiet → shield, tricky tactics → star, mixed practice → star

---

## Typography

### Fonts
| Font | Variable | Use For |
|------|----------|---------|
| Playfair Display | `--font-display` | Landing page hero headings only |
| DM Sans | `--font-body` | Everything else (body, buttons, UI) |
| Nunito | (imported) | Lesson content, friendly weight |

### Scale
- Page titles: `text-xl font-black` or `text-2xl font-bold`
- Section headings: `text-lg font-bold`
- Body text: `text-sm` or `text-base`
- Captions/hints: `text-xs text-chess-text-faint`
- Keep it compact on mobile — users are on phones

---

## Spacing & Layout

### Mobile-First
All layouts are mobile-first. Chess Path is primarily a phone app.

- Page padding: `px-4` on mobile, wider on tablet+
- Card padding: `px-4 py-3` or `px-5 py-4`
- Gaps between elements: `gap-2` to `gap-4` (keep tight on mobile)
- Use `max-w-lg mx-auto` to center content on larger screens

### Full-Screen Pages
For pages that should fill the screen (pricing, welcome):
```tsx
<div className="h-[calc(100dvh-45px)]">  // subtract nav header height
  <div className="flex-1 flex flex-col">
    {/* content */}
    <div className="mt-auto">
      {/* footer/CTA pushed to bottom */}
    </div>
  </div>
</div>
```

### Responsive Breakpoints
- Mobile: default (no prefix)
- Tablet: `sm:` (640px)
- Desktop: `md:` (768px)
- Use `scale-[0.85] sm:scale-100` for elements that need to shrink on small phones

---

## Shared Components

### ActionButton (`components/ui/ActionButton.tsx`)
The Duolingo-style 3D button. Use this for ALL primary/secondary actions.
```tsx
import { ActionButton } from '@/components/ui/ActionButton';

<ActionButton color="green" size="lg" fullWidth>Start Learning</ActionButton>
<ActionButton color="blue" size="md">Continue</ActionButton>
<ActionButton color="white" size="sm">Skip</ActionButton>
<ActionButton color="red" size="md">Delete</ActionButton>
<ActionButton color="gold" size="lg" fullWidth>Go Premium</ActionButton>
```
Colors: `green` | `blue` | `gold` | `red` | `white`. Sizes: `sm` | `md` | `lg`. Auto-plays click sound.

### PageLayout (`components/ui/PageLayout.tsx`)
Full-height centered page container. Use for loading, error, setup screens.
```tsx
import { PageLayout } from '@/components/ui/PageLayout';

<PageLayout>
  <BreathingRook size="lg" />
  <h1>Loading...</h1>
</PageLayout>

<PageLayout align="top" scroll>
  {/* long scrollable content */}
</PageLayout>
```

### RookieBubble (`components/ui/RookieBubble.tsx`)
Rookie rook + speech bubble with caret. Use anywhere Rookie speaks.
```tsx
import { RookieBubble } from '@/components/ui/RookieBubble';

// Horizontal (rook left, bubble right)
<RookieBubble mood="happy">Nice fork!</RookieBubble>

// Vertical (rook above, bubble below)
<RookieBubble mood="defeated" direction="up" centered>
  Well. That happened.
</RookieBubble>
```

### Ghost buttons (inline, no component needed)
```tsx
className="text-chess-text-muted hover:text-chess-text font-semibold text-sm transition-colors"
```

### Cards
```tsx
className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4"
```

### Inputs
```tsx
className="w-full px-4 py-3 rounded-xl border border-slate-200
           bg-chess-surface text-chess-text placeholder:text-chess-text-faint
           focus:outline-none focus:ring-2 focus:ring-chess-green"
```

---

## Do's and Don'ts

**DO:**
- Use tokens for every color
- Keep pages compact and mobile-friendly
- Use `chess-green` as the primary action color
- Use `rounded-xl` or `rounded-2xl` for cards and buttons
- Test on mobile first

**DON'T:**
- Use raw hex values (`bg-[#131F24]`) — use tokens
- Use dark backgrounds on user-facing pages
- Use `text-white` on light backgrounds
- Add horizontal scroll on mobile
- Use more than 2-3 colors on any single page
- Use Tailwind's default grays (`bg-gray-*`) for primary colors — use tokens

---

## Matte Block Style

Every rook block in Chess Path uses a **matte 3D** rendering style — a vertical gradient + inset shadows that give each block a polished, tactile look.

### Formula

```
background: linear-gradient(to bottom,
  lighten(color, 18%) 0%,
  lighten(color, 12%) 20%,
  color 40%,
  darken(color, 12%) 100%
)

boxShadow:
  inset 0 0.75px 0 darken(color, 6%),
  inset 0 -0.75px 0 lighten(color, 6%),
  0 0.5px 0 rgba(0,0,0,0.25),
  0 0 0 0.5px rgba(0,0,0,0.15)
```

### Utility Functions

Import from `lib/daily-rook-blocks.ts`:

```ts
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

// Usage
style={{
  background: getMatteBackground(block.color),
  boxShadow: getMatteBoxShadow(block.color, blockSize / 14),
}}
```

- `getMatteBackground(color)` — returns the CSS gradient string
- `getMatteBoxShadow(color, scale?)` — returns the CSS shadow string. Scale adjusts shadow size proportionally (base = 14px blocks, so pass `blockSize / 14`)

### When to Apply

- **Always** on rook blocks in React components (AnimatedLogo, BreathingRook, DailyRookDisplay, RookProgressAnimation)
- **Always** on rook blocks in OG image routes (Satori supports linear-gradient + boxShadow)
- **SVG assets**: Use `<linearGradient>` defs per block color (no inset shadows — gradient-only is fine at small sizes)
- **Email templates**: Use gradient with flat-color fallback (`backgroundColor` for Outlook)
- **Remotion videos**: Import utilities or duplicate inline (Remotion bundles separately)

### Scale Behavior

Shadow values scale linearly with block size:
- 6px blocks (BreathingRook xs): scale = 0.43
- 10px blocks (email): scale = 0.71
- 14px blocks (base): scale = 1.0
- 28px blocks (OG default): scale = 2.0
- 74px blocks (OG daily-challenge): scale = 5.3

---

## File Reference

- Tokens defined in: `app/globals.css` (under `@theme`)
- Matte utilities: `lib/daily-rook-blocks.ts`
- Animated logo: `components/brand/AnimatedLogo.tsx`
- Nav header: `components/layout/NavHeader.tsx`
- This guide: `.claude/design-system.md`
