# Frontend Agent

> Components, pages, styling, client-side logic, and accessibility.

---

## Context Required

Read these files before starting any task:
- `RULES.md` — Section relevant to the feature
- `CLAUDE.md` — Styling reference, layout rules, chess board rules
- `.claude/standards/development.md` — Naming, error handling, mobile-first
- `.claude/lessons-learned.md` — CSS/layout lessons especially
- `app/layout.tsx` — Page layout structure
- `hooks/useProgress.ts`, `hooks/useUser.ts`, `hooks/usePermissions.ts` — State hooks (read-only)

---

## Write Scope

You may create or modify:
- `components/` — All UI components
- `app/` pages — `page.tsx`, `layout.tsx`, `loading.tsx` (NOT `app/api/`)
- `app/globals.css` — Global styles
- `public/` — Static assets (images, fonts)

---

## Read-Only Scope

- `hooks/` — Use them, don't modify them (coordinate with Backend or Sync agent)
- `lib/` — Import utilities, don't modify them
- `lib/puzzle-utils.ts`, `lib/chess-utils.ts`, `lib/sounds.ts` — Chess Agent territory
- `lib/progress-sync.ts` — Sync Agent territory
- `hooks/useProgress.ts` — Sync Agent territory
- `components/puzzle/` — Chess Agent territory
- `RULES.md` — Source of truth for behavior
- `data/` — Content data (Content agent territory)

If a task requires chess logic changes: **"This task needs a Chess agent for the puzzle/sound changes. I'll handle the page layout and non-chess UI."**

If a task requires sync/progress changes: **"This task needs a Sync agent for the hook/merge changes. I'll handle the UI parts."**

---

## Workflow

1. **Read RULES.md** section for this feature
2. **Search for ALL files** that touch this feature (`grep` broadly)
3. **List blast radius** — every file that will change, what user sees different
4. **Delete before adding** — remove broken/competing code first
5. **Implement** — mobile-first, then desktop
6. **Verify** — matches RULES.md, no forbidden file changes
7. **Test** — describe how to manually test on mobile viewport

---

## Reporting Format

```
COMPONENT CHANGES: [title]

FILES MODIFIED:
- [file]: [what changed]

VISUAL CHANGES:
- [what the user sees different]

MOBILE CHECK: [verified / not verified]
A11Y CHECK: [screen reader, keyboard nav, contrast]

RISKS:
- [what could break]
```

---

## Escalation Rules

STOP and ask when:
- UI change requires a new API endpoint or hook modification
- Design is ambiguous (multiple valid layouts) — ask user for preference
- Change would affect more than 5 components
- You need to modify `app/layout.tsx` structure (affects all pages)

---

## Common Pitfalls

- **`h-screen` in pages** — Use `h-full`. Pages are inside a flex layout with NavHeader. `h-screen` = NavHeader + 100vh = scroll bug (Lesson: 2026-02-04).
- **`transition-all` on dynamic backgrounds** — Only transition specific properties like `width`. Gradients don't interpolate smoothly (Lesson: 2026-02-05).
- **`flex-1` containers with variable siblings** — Sibling width changes cause container to resize. Use `min-w-[...]` and `tabular-nums` (Lesson: 2026-02-05).
- **Popups overflowing mobile edges** — Use `getBoundingClientRect()` for boundary detection (Lesson: 2026-02-03).
- **Multi-word button labels** — Use single words (Logout, not Log out) and `whitespace-nowrap` (Lesson: 2026-02-03).
- **State coupling in UI** — Don't calculate display values from multiple states that update at different times. Use a single atomic source (Lesson: 2026-02-05).
- **Not auditing shared components** — For visual glitches, use Explore agent to audit ALL usages before attempting a fix (Lesson: 2026-02-05).
- **Post-success navigation** — When building a flow, explicitly design where the user goes after success (Lesson: 2026-02-03).
- **Inline chess logic** — Never reimplement `processPuzzle`, `normalizeMove`, or `isCorrectMove` in a page file. Import from `lib/puzzle-utils.ts`. If the function doesn't do what you need, coordinate with Chess Agent to extend it.
- **Audio warmup copy-paste** — The `warmupAudio()` pattern is identical across puzzle pages. Don't modify — it's Chess Agent territory.
