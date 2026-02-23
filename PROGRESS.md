# PROGRESS.md — Session Memory

> **Purpose:** Bridges context between Claude sessions. Read this at the start of every session. Update it at the end.

---

## Last Updated

**2026-02-23** — CHE-45 direct checkout shipped

---

## Active Work

### CHE-43 · Quip Engine v3 (In Progress)
- ShuffleBag class done (`lib/shuffle-bag.ts`)
- ~2,100 new context category quips written across all 114 sections
- 4 call sites in lesson page switched to new `getQuip()`
- **Not yet pushed** — needs final testing and merge

### CHE-37 · Shareable Assets (In Progress)
- Design finalized: rainbow gradient border, matte rook, confetti
- HTML mockup done (`share-card-preview.html`)
- Implementation pending

### CHE-26 · Daily Rook Fix (In Review)
- Two fixes deployed: event timing fix (`1d6756f`), validation fix (`e211763`)
- Needs verification that production is working correctly

---

## Recently Completed

### CHE-45 · Direct Checkout from Paywall (Done — Feb 23)
- Logged-in free users now go straight to Stripe from `LessonLimitModal` (skips `/pricing` page)
- Dynamic price fetched from `/api/pricing-experiment`, $4.99 fallback
- `checkout_started` event now has `trigger: 'daily_limit'` for attribution
- Commit `121c288`, pushed to main

### CHE-46 · Matte Logo Rebrand (Done — Feb 20)
- Replaced flat rook blocks with matte gradient + inset shadow across entire app
- Sub-tasks all done: SVGs (CHE-54), PNGs (CHE-55), OG images (CHE-52), Remotion videos (CHE-51), progress animation (CHE-50), email templates (CHE-53), reference assets (CHE-56), design system docs (CHE-57)

### CHE-61 · Opening Lesson Tree Template (Done — Feb 20)
- Designed curriculum structure for opening lessons using Ruy Lopez
- Main trunk (move-by-move), branch lessons, "Punish Mistakes" lesson type

---

## Backlog Priorities

### High Priority
- **CHE-67** — Auto queen promotion breaks underpromotion lesson (Bug)
- **CHE-64** — DAG-based lesson unlock system for openings
- **CHE-63** — Opening tree UI with invisible unlock system
- **CHE-62** — Ruy Lopez lesson data from tree template
- **CHE-58** — Breathing effect on header rook
- **CHE-59** — Rook assembly animation → new matte colors
- **CHE-60** — Celebration screen rook → new matte colors

### Medium Priority
- **CHE-65** — Opening Level Test system
- **CHE-66** — Apply tree template to second opening (Italian/Sicilian)

---

## Key Context for Next Session

- **Matte gradient is the new standard** — all rook blocks use `linear-gradient(to bottom, lighten 18%→12%→base→darken 12%)` + inset shadows. Documented in design-system.md and RULES.md §42.
- **Opening lessons are a new paradigm** — tree/DAG structure, not linear levels. Template exists at `data/openings/sample-lesson-tree-template.md`.
- **Quip Engine v3 is close** — local code done, just needs push and testing. Don't re-implement.
- **Pricing funnel fix shipped (CHE-45)** — direct checkout from paywall modal. Monitor PostHog for `checkout_started` with `trigger: daily_limit` to measure improvement.

---

## Session Log

| Date | What We Did | Key Decisions |
|------|-------------|---------------|
| 2026-02-23 | Created PROGRESS.md, Linear task template, work-task command | Adopted Hypeflo workflow patterns for session continuity |
| 2026-02-23 | CHE-45: Direct checkout from paywall modal | Skip /pricing for logged-in users, $4.99 fallback, trigger attribution |
