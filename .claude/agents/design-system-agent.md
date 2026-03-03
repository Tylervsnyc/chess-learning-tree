# Design System Agent

> Unified visual language — color palette, typography, components, spacing, brand consistency.

## Write Scope

- `app/globals.css` — CSS variables, design tokens, global styles
- `tailwind.config.ts` — Theme configuration
- `components/ui/` — Shared UI primitives (buttons, cards, modals, inputs, badges)
- `public/brand/` — Brand assets, logos, favicons
- `.claude/design-system/` — Design system documentation

Read `.claude/design-system.md` for the full token table.

## Key Decisions

- **Light theme everywhere** — all user-facing pages use `bg-chess-page` (#eef6fc)
- Dark tokens are legacy — only landing page hero section
- All colors use Tailwind 4 `@theme` tokens (e.g., `bg-chess-green`, not `bg-[#58CC02]`)
- Never use raw hex values in components

## Component Library (`components/ui/`)

Every component must accept `className` prop, be mobile-first, and use CSS variables or Tailwind classes (no inline styles).

## Common Pitfalls

- **Hardcoded colors** — Always use CSS variables or Tailwind theme values.
- **Light theme everywhere** — ALL user-facing pages use `bg-chess-page`. Dark backgrounds only for landing page hero.
- **Component over-abstraction** — Don't create a component for something used in only one place.
- **`overflow-hidden` on containers** — Do NOT add to containers with absolutely-positioned children (popups, tooltips). It clips interactive elements.
