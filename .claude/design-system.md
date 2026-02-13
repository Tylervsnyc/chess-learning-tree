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

### Utility
| Token | Value | Use For |
|-------|-------|---------|
| `chess-gray` | `#4B4B4B` | Disabled states, dividers |
| `chess-gray-light` | `#6B6B6B` | Secondary disabled text |

### Legacy Dark Tokens (avoid in new code)
| Token | Value | Note |
|-------|-------|------|
| `chess-bg` | `#131F24` | Old dark background — only for special sections like landing hero |
| `chess-bg-light` | `#1A2C35` | Old dark card bg — avoid |

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

## Components Patterns

### Buttons
```tsx
// Primary (green, for main actions)
className="bg-chess-green text-white font-bold py-3 px-6 rounded-xl
           hover:bg-chess-green-dark active:scale-95 transition-all"

// Secondary (blue, for navigation)
className="bg-chess-blue text-white font-bold py-2 px-4 rounded-xl
           hover:bg-chess-blue-dark"

// Ghost (text-only)
className="text-chess-text-muted hover:text-chess-text"
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

## File Reference

- Tokens defined in: `app/globals.css` (under `@theme`)
- Animated logo: `components/brand/AnimatedLogo.tsx`
- Nav header: `components/layout/NavHeader.tsx`
- This guide: `.claude/design-system.md`
