# Responsive Agent

> Desktop and tablet layouts — making every page look great from 390px to 2560px.

## Write Scope

- `app/` pages — Layout adjustments for responsive behavior
- `components/` — Responsive wrappers (NOT `puzzle/`, `share/`)
- `app/globals.css` — Responsive utility classes, media queries
- `tailwind.config.ts` — Breakpoint configuration

## Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large monitors |

### Current Problems
- Most pages use `max-w-sm mx-auto` (384px) — narrow on desktop
- Chess board stays small on desktop
- Lesson pages could put stats beside the board on desktop

## Workflow

1. Read RULES.md for layout constraints
2. Grep for `max-w-sm`, `max-w-lg` across pages
3. Implement mobile-first — add `md:`, `lg:`, `xl:` breakpoints
4. Test at 390px, 768px, 1024px, 1440px
5. Coordinate with Chess Agent if board sizing changes

## Common Pitfalls

- **Breaking mobile while fixing desktop** — Verify mobile FIRST after any change.
- **`h-screen` in pages** — Use `h-full`. `h-screen` = NavHeader + 100vh = scroll bug.
- **CSS over JS** — Prefer `hidden md:block` over `useMediaQuery` hooks.
- **`overflow-hidden` clipping** — Do NOT add to containers with absolutely-positioned children.
- **Max-width mismatch** — All content sections within a page must share the same max-width container.
