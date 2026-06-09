# RULES.md - The Chess Path Source of Truth

**This document defines how The Chess Path works.** Every behavior, limit, and interaction is documented here. When in doubt, this document is correct.

Last Updated: 2026-02-15

---

## Table of Contents

1. [User Types](#1-user-types)
2. [Lesson Unlocking](#2-lesson-unlocking)
3. [Level Unlocking](#3-level-unlocking)
4. [Navigation After Lesson Complete](#4-navigation-after-lesson-complete)
5. [Scroll Behavior on /](#5-scroll-behavior-on-)
6. [Naming Conventions (Dot Notation)](#6-naming-conventions-dot-notation)
7. [Daily Limits](#7-daily-limits)
8. [Premium & Signup Prompts](#8-premium--signup-prompts)
9. [Admin Users](#9-admin-users)
10. [Data Storage](#10-data-storage)
11. [Streaks](#11-streaks)
12. [The Daily Rook](#12-the-daily-rook)
13. [Leaderboard](#13-leaderboard)
14. [Level Tests](#14-level-tests)
15. [Pages](#15-pages)
16. [Header](#16-header)
17. [Lesson Page](#17-lesson-page)
18. [Puzzle Interaction](#18-puzzle-interaction)
19. [Sounds](#19-sounds)
20. [User ELO](#20-user-elo)
21. [Analytics](#21-analytics)
22. [Feature Flags](#22-feature-flags)
23. [Database Tables](#23-database-tables)
24. [Puzzle Selection](#24-puzzle-selection)
25. [Quip System (v3)](#25-quip-system-v3)
26. [Quip Content Guidelines](#26-quip-content-guidelines)
27. [Lesson/Level/Block Naming](#27-lessonlevelblock-naming)
28. [Intro Messages](#28-intro-messages)
29. [Adding New Levels Checklist](#29-adding-new-levels-checklist)
30. [Work In Progress (WIP)](#30-work-in-progress-wip)
31. [Puzzle Share Feature](#31-puzzle-share-feature)
32. [SEO & Marketing](#32-seo--marketing)
33. [Daily Maintenance Check](#33-daily-maintenance-check)
34. [Failed Payment Recovery](#34-failed-payment-recovery)
35. [Loading Indicator — Breathing Rook](#35-loading-indicator--breathing-rook)
36. [Revenue Dashboard](#36-revenue-dashboard)
37. [Paywall Analytics](#37-paywall-analytics)
38. [Dynamic Pricing](#38-dynamic-pricing)
39. [Ad Placement](#39-ad-placement)
40. [Cron Schedule](#40-cron-schedule)
41. [Admin Dashboard](#41-admin-dashboard)
42. [Design System Compliance](#42-design-system-compliance)
43. [Daily Puzzle Video](#43-daily-puzzle-video)

---

## 1. User Types

There are exactly **four** user types:

| Type | Can Do Lessons | Limit | Progress Storage |
|------|----------------|-------|------------------|
| **Anonymous** | Yes | 4 total, then signup prompt | localStorage only |
| **Free** | Yes | Unlimited until March 1, 2026; then 2/day | localStorage + Supabase |
| **Premium** | Yes | Unlimited | localStorage + Supabase |
| **Admin** | Yes | Unlimited, ALL lessons unlocked | localStorage + Supabase |

### Key Behaviors:
- Anonymous progress transfers to account on signup
- Signup prompt every 4 lessons for anonymous users (dismissible, not blocking)

### How to Check User Type (ONE place only):
```typescript
// In hooks/useUser.ts
const userType = useMemo(() => {
  if (!user) return 'anonymous';
  if (profile?.is_admin) return 'admin';
  if (profile?.subscription_status === 'premium') return 'premium';
  return 'free';
}, [user, profile]);
```

---

## 2. Lesson Unlocking

### The Rules:
1. New users start with **only 1.1.1 unlocked**
2. Completing lesson N unlocks lesson N+1 (sequential within level)
3. Unlocking Level N via test unlocks:
   - ALL lessons in Levels 1 through N-1 (fully open)
   - Only N.1.1 in Level N (then sequential)
4. **Admin: ALL lessons unlocked, always**

### Enforced In (ONE place — client only):
- **Client:** `/hooks/useProgress.ts` → `isLessonUnlocked()`

The server does **NOT** validate unlock order. It only checks that the `lessonId` exists in the curriculum. The client UI prevents users from accessing locked lessons — the server trusts the client and stores the data. This avoids cascading sync failures when earlier lessons are missing from the DB due to failed POSTs.

### Visual States:
| State | Appearance | Click Action |
|-------|------------|--------------|
| Locked | Gray, lock icon | Show "Complete previous lesson" toast |
| Unlocked | Colored (faded), no ring | Navigate to lesson |
| Completed | Gold, checkmark sparkles | Navigate to lesson (replay) |
| Current | Colored, pulsing ring | Navigate to lesson |
| Completed + Current | Gold, checkmark sparkles, pulsing ring | Navigate to lesson (replay) |

**Note:** The pulsing ring always shows on `currentPosition`, even if that lesson is completed. This indicates "you are here" in the curriculum.

### Lesson Icon Selection (priority order):
1. **`pieceFilter`** — If the lesson has an explicit piece filter, use that piece as the icon
2. **`isMixedPractice`** — Mixed practice / review lessons show a star
3. **Pattern-based tag matching** — `getIconForTag()` in `/components/learn/LearnPageContent.tsx` maps `requiredTags` to icons using string patterns (not a hardcoded map), so new tags auto-match:
   - `*Endgame` → the piece in the tag name (e.g. `rookEndgame` → rook)
   - `smotheredMate`, `arabian*`, `hook*`, `*fork*` → knight
   - `*mate*` (generic) → queen
   - `pin`, `skewer`, `xRayAttack` → bishop
   - `*pawn*`, `promotion`, `defensiveMove`, `quietMove` → pawn
   - `crushing`, `*Attack`, `exposedKing`, `doubleCheck` → queen
   - `hangingPiece`, `trappedPiece` → rook
   - `discoveredAttack`, `deflection`, `intermezzo`, `sacrifice`, `attraction`, `clearance`, `interference` → star
4. **Fallback** — Cycle through `['knight', 'queen', 'rook', 'bishop', 'pawn', 'star']` by position index

---

## 3. Level Unlocking

### The Rules:
- **Level 1**: Always unlocked
- **Level N (N > 1)**: Unlocks when EITHER:
  - All lessons in Level N-1 completed, OR
  - User passes Level N Test

### Enforced In (ONE place only):
`/hooks/useProgress.ts` → `isLevelUnlocked()`

### Stored In:
`profiles.unlocked_levels` (array of integers)

---

## 4. Navigation After Lesson Complete

### The Flow:
1. User completes lesson
2. `currentPosition` updates to next lesson (stored in DB)
3. Show completion popup with stats
4. On "Continue" button click → `/`
5. Home page reads `currentPosition` and auto-scrolls to that lesson

### Key Point:
No URL params needed. The `currentPosition` field stored in the database determines where the user lands on `/`.

### Enforced In (ONE place only):
`/components/lesson/LessonCompleteScreen.tsx` → Continue button onClick handler

---

## 5. Scroll Behavior on /

### The Rules:
| Scenario | Behavior |
|----------|----------|
| Section expand/collapse | **NO scrolling. Ever.** Animated toggle with staggered children. |
| Opening `/` | Expand section containing `currentPosition`, scroll to it |

### Section Expand/Collapse Animation:
- Lessons are **always rendered** in the DOM (not conditionally mounted) for height measurement
- Container: `maxHeight` transitions over 500ms, pushing sections below smoothly
- Each lesson puck: bounces in with 75ms stagger delay (spring bezier `0.34, 1.56, 0.64, 1`)
- Collapse: reverse stagger (30ms per child), faster out than in
- `pointer-events: none` + `aria-hidden` when collapsed to prevent interaction and screen reader access
- **Initial render**: skips animation (no transition) so pre-expanded sections appear instantly
- **CSS containment warning**: Do NOT add `overflow-hidden` to containers with absolutely-positioned children (popups, tooltips). It clips interactive elements like Start Lesson buttons.
- **Popup z-index rule**: ALL section wrappers get `position: relative; z-index: 1` (creates stacking context that contains transformed children). The section with an open popup gets `z-index: 10`. Using `z-index: 1` (not `auto`) is critical — `auto` does NOT create a stacking context, so children with `transform` (lesson bubbles, the `scale-[0.85]` flex row) escape and paint above the popup.

### The `currentPosition` Field:
- Stored in `profiles.current_position` (database)
- Represents where the user IS in their journey
- Updated when: lesson completes (→ next lesson), level test passes (→ first lesson of new level)
- Server is source of truth

### Critical:
- **NO FALLBACK BEHAVIOR** - Code must guarantee target exists
- **NO URL PARAMS** - Use `currentPosition` from hook, not URL params
- **WAIT FOR ALL DATA** - Don't expand/scroll until `serverFetched` AND `!userLoading` AND `!isProfileLoading`. The skeleton gate and the scroll effects must use the **same condition** (`dataReady`). If the skeleton is showing, sections aren't in the DOM — scroll would find nothing.
- **NO GLOBAL SCROLL MANAGERS** - Each page owns its own scroll. No ScrollToTop, no `scrollRestoration = 'manual'`. Browser handles scroll restoration naturally. Lesson pages use `overflow-hidden` to prevent scrolling.
- **TWO HOOKS, NOT ONE** - Section expand needs `useLayoutEffect` (before paint), scroll needs `useEffect` (after paint). A single `useEffect` can't do both because `setExpandedSections` triggers a 500ms CSS transition — the scroll fires before the section finishes expanding and gets the wrong position.
- **`serverFetched` must wait for auth** - In `useProgress.ts`, don't set `serverFetched=true` until `userLoading` is false. Otherwise `user=null` (auth still loading) is mistaken for "no user" and the scroll fires with localStorage's default `'1.1.1'`.
- **First expand must be instant** - `hasMeasured` in SectionView must only be set to `true` when `isExpanded` is true. If set on mount (when collapsed), the first expand gets a 500ms transition instead of instant.

### Sticky Headers:
| Element | Position | Z-Index | Behavior |
|---------|----------|---------|----------|
| Nav header | `sticky top-0` | `z-50` | Always visible at top |
| Level header | `sticky top-2` | `z-40` | Sits just below nav header with small gap |

The level header sits just below the nav header with a small gap, keeping both visible and accessible.

### Implementation:
```typescript
// In /components/learn/LearnPageContent.tsx - the ONLY place this happens
// dataReady must match the skeleton gate exactly
const dataReady = serverFetched && !userLoading && !isProfileLoading;

// Phase 1: Expand correct section BEFORE browser paint (no flash)
useLayoutEffect(() => {
  if (!dataReady || !currentPosition) return;
  const sectionId = findSectionForLesson(currentPosition);
  if (sectionId) {
    setExpandedSections({ [sectionId]: true });
  }
}, [dataReady, currentPosition]);

// Phase 2: Scroll AFTER paint (element must be visible for correct position)
useEffect(() => {
  if (!dataReady || !currentPosition) return;
  requestAnimationFrame(() => {
    document.getElementById(`lesson-${currentPosition}`)
      ?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
}, [dataReady, currentPosition]);

// Backup: bfcache restore on mobile
useEffect(() => {
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.getElementById(`lesson-${currentPosition}`)
        ?.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
}, [...]);
```

### Why two hooks (not one):
The section expand MUST happen before browser paint (`useLayoutEffect`) so the element
is at its final position when scroll fires (`useEffect`). A single `useEffect` fires
after paint — `setExpandedSections` inside it triggers a 500ms CSS `maxHeight` transition,
and `scrollIntoView` fires before the transition completes, scrolling to the wrong position.

### The `serverFetched` auth gate:
In `useProgress.ts`, the server fetch effect must check `userLoading`:
```typescript
if (!loaded || userLoading) return;  // Wait for auth to resolve
if (!user) { setServerFetched(true); return; }  // Genuinely no user
setServerFetched(false);  // Reset until fresh data arrives
// ... fetch /api/progress
```
Without `userLoading`, the hook sees `user=null` (auth still loading) and immediately
sets `serverFetched=true` with localStorage's default `currentPosition='1.1.1'`.

### The `hasMeasured` rule:
In SectionView, only set `hasMeasured = true` when `isExpanded` is true:
```typescript
useEffect(() => {
  if (contentRef.current) {
    setContentHeight(contentRef.current.scrollHeight);
    if (isExpanded) { hasMeasured.current = true; }  // NOT on mount when collapsed
  }
}, [isExpanded]);
```
If `hasMeasured` is set on mount (collapsed), the first expand gets `transition: 500ms`
instead of `transition: none`. The scroll fires 16ms later into a still-animating section.

---

## 6. Naming Conventions (Dot Notation)

**All IDs use dot notation for consistency:**

| Thing | Format | Example |
|-------|--------|---------|
| Level | `{level}` | `1`, `2`, `5` |
| Section ID | `{level}.{section}` | `1.3`, `5.12` |
| Lesson ID | `{level}.{section}.{lesson}` | `1.3.2`, `5.12.4` |
| Quip ID | `{level}.{section}.{type}.{number}` | `1.1.g.01`, `2.6.fork.03` |

### Quip Types:
- `g` = general
- `fork`, `pin`, `mateIn1`, `mateIn2`, `skewer`, etc.

### Examples:
- Section `1.3` contains lessons `1.3.1`, `1.3.2`, `1.3.3`, `1.3.4`
- Quip `1.1.g.01` = Level 1, Section 1, General quip #1
- Quip `2.6.fork.03` = Level 2, Section 6, Fork-specific quip #3

---

## 7. Daily Limits

### Current Limits:
| User Type | Limit | Reset |
|-----------|-------|-------|
| Anonymous | 4 total | Never (must sign up) |
| Free | Unlimited until March 15, 2026; then 4 per day | Midnight UTC (after March 15) |
| Premium | Unlimited | N/A |
| Admin | Unlimited | N/A |

### Enforced In:
`/hooks/usePermissions.ts`

### Config:
`/types/permissions.ts` → `LESSON_LIMITS` constant

---

## 8. Premium & Signup Prompts

### Premium Button:
- **Where**: Header, all pages
- **Who sees it**: Non-premium AND non-admin users
- **Links to**: `/pricing`

### Signup Prompt:
- **When**: Every 2 lessons for anonymous users
- **Style**: Dismissible, not blocking
- **Note**: Users can still subscribe even with limits disabled

---

## 9. Admin Users

### The Only Difference from Premium:
**All lessons unlocked** (no sequential requirement)

### How to Set:
Manually in Supabase: `profiles.is_admin = true`

### How to Check:
```typescript
const isAdmin = profile?.is_admin === true;
```

---

## 10. Data Storage

| User Type | Storage | Source of Truth |
|-----------|---------|-----------------|
| Anonymous | localStorage only | localStorage |
| Logged in | localStorage + Supabase | Supabase |

### Sync Behavior:
1. On signup/login: Merge localStorage → Supabase
2. After merge: Supabase wins for all future reads

---

## 11. Streaks

### How to Maintain Streak:
Complete **1 lesson OR 1 Daily Rook** per day

### How Streak Resets:
Miss a full calendar day (UTC) → streak resets to 0

### Display:
- Shown in header on `/` and `/daily-challenge` (currently feature-flagged off)

### Stored In:
```sql
profiles.current_streak       -- Current count
profiles.last_activity_date   -- YYYY-MM-DD format
```

---

## 12. The Daily Rook

> **ARCHIVED 2026-05-18.** Replaced by Rookie's Run (§49) as part of the app's Daily Workout (Play + Path + Run).
> Code lives in `app/_archive/daily-challenge/` — no live route, not in the nav, not in the sitemap. The `daily_challenge_results` table is preserved for historical scores. The rules below stay as reference in case the feature is ever resurrected.

### Header Nav:
`[Play] [Learn ▾] [Run]` (was `[Daily]` while this feature was live — see §16 and §49)

### Core Rules:
| Rule | Value |
|------|-------|
| **Login required** | Anonymous users see a teaser gate screen with signup/login CTAs. Must be logged in to play. |
| Timer | 5 minutes |
| Lives | 3 (3 wrong = out) |
| Puzzles | 22 total |
| Difficulty | Linear: 400 → 2300 ELO, ~100 per step (hidden from user) |
| Correct answer | Advance to next puzzle |
| Wrong answer | Lose a life, advance to next puzzle |
| Same puzzles for all users | Yes (seeded by date) |
| **Once per day** | Users can only play once per day. Returning shows results. |

### How It Works:
- Display shows "Puzzle X / 22" (no ELO shown to users)
- Puzzles get linearly harder behind the scenes
- Each puzzle targets ~100 ELO higher than the last (400, 500, 600, ..., 2300)
- No two consecutive puzzles share the same primary theme
- Goal: How many can you solve in 5 minutes?

### Puzzle Selection (Pre-generated):
```
/api/daily-challenge/puzzles
```
- **Puzzles are pre-generated** in `data/daily-challenge-puzzles.json`
- 90 days of coverage, regenerate with: `npx ts-node scripts/generate-daily-puzzles.ts`
- Uses date-seeded random number generator (same puzzles for everyone)
- 22 rating targets: first 3 are ~400 (confidence builders), then 500 → 2300 in 100-step increments
- Prioritizes tactical themes (forks, pins, mates) over endgames
- Each puzzle comes from a different theme when possible

### Rating Progression:
22 puzzles: first 3 at ~400 (confidence), then 500 → 2300 in 100-step increments. Sources:
| Bracket Folder | Puzzle Centers |
|----------------|---------------|
| 0400-0800 | 400, 400, 400, 500, 600, 700 |
| 0800-1200 | 800, 900, 1000, 1100 |
| 1200-1600 | 1200, 1300, 1400, 1500 |
| 1600-2000 | 1600, 1700, 1800, 1900 |
| 2000-plus | 2000, 2100, 2200, 2300 |

### End Conditions:
- Complete all 22 puzzles, OR
- Timer runs out, OR
- Lose 3 lives

### Once-Per-Day Enforcement:
- On page load, check if user has a result for today (`daily_challenge_results` table)
- If yes → skip to finished screen showing their result + leaderboard
- If no → show ready screen, allow them to play
- "Play Again" button hidden after completion, replaced with "Come back tomorrow!"
- Enforced in: `app/daily-challenge/page.tsx` via `checkTodayCompletion()` useEffect

### On Completion:
1. Show puzzles solved (primary metric)
2. Show time remaining / time taken
3. Show mistakes made
4. Allow puzzle review (step through solution)
5. Show global leaderboard with Top 10 / My Standing toggle

### Design:
| Element | Style |
|---------|-------|
| "THE DAILY ROOK" title | Nunito font, font-black, gradient text (orange→red), in gradient box with orange border |
| Background | `#eef6fc` (light theme) |
| Cards | White with `shadow-sm`, rounded-xl |
| Brand logo | chesspath logo + wordmark above title |
| Board | Fixed size (`max-w-sm`), doesn't shift when UI updates |
| Playing bottom | Side-by-side: rook grid left, stats cards right |

### Ready Screen:
- 5 Minutes on the Clock
- Puzzles Get Harder
- 3 Mistakes and You're Out
- Compete Globally

### Playing Screen:
- **Top half:** Chess board (fixed size, `max-w-sm`) + no scrolling
- **Mobile board sizing:** Board container uses `maxWidth: min(28rem, calc(100dvh - 19rem))` so the full board + rook display fit on small viewports without clipping. On desktop the 28rem cap wins (unchanged); on mobile the viewport calc shrinks the board to fit.
- **Bottom half — side-by-side:** Rook grid (left), stats column (right)
  - Stats column top-to-bottom: "White/Black to move" status → timer (card) → lives/hearts (card)
  - No theme help (?) button — Daily Rook never shows hints
- Opponent's last move highlighted (orange)

### Finished Screen:
- Puzzles solved (big number, primary metric)
- Time and mistakes
- Leaderboard (Top 10 / My Standing toggle)
- Puzzle review section

### Sound:
- Correct: Chromatic ascending scale (G3→D5, 20 notes)
- Each puzzle solved plays the next note in the scale
- Creates satisfying progression without getting shrill

### Timer Implementation:
Uses `Date.now()` with end time reference (not interval accumulation) for accuracy:
```typescript
endTimeRef.current = Date.now() + TOTAL_TIME;
// Timer checks: remaining = endTimeRef.current - Date.now()
```

### Files:
| File | Purpose |
|------|---------|
| `app/daily-challenge/page.tsx` | Main game UI (ready/playing/finished) |
| `components/daily-challenge/DailyRookDisplay.tsx` | Rook grid + stats (side-by-side layout in all modes) |
| `app/api/daily-challenge/puzzles/route.ts` | Returns seeded puzzles for today |
| `app/api/daily-challenge/leaderboard/route.ts` | Returns leaderboard data |

---

## 13. Leaderboard

### Daily Rook Leaderboard:
| Column | Description |
|--------|-------------|
| Rank | Position (1-indexed) |
| Username | `profiles.display_name` (auto-set from email prefix or Google name) |
| Puzzles | `puzzles_completed` count |
| Time | `time_used_ms` formatted as M:SS |

### Display:
- Top 10 by default
- Toggle to see your rank
- Today only (no history)

### Sort Order:
1. Puzzles completed (desc) - more puzzles = higher rank
2. Time used (asc) - faster wins ties

### Implementation:
- **Recording**: `app/daily-challenge/page.tsx` → `recordResult()` upserts to `daily_challenge_results`
- **API**: `app/api/daily-challenge/leaderboard/route.ts` fetches results + profiles separately (no FK join)
- **Display names**: Auto-generated at signup from email prefix (e.g., "tyler" from "tyler@email.com") or Google profile name
- **RLS**: Public read for leaderboard, users can only insert their own results

---

## 14. Level Tests

### Naming Format:
"Level 2 Test", "Level 3 Test", etc. (destination level)

### Rules:
| Rule | Value |
|------|-------|
| Puzzles | 10 |
| Lives | 3 hearts (same style as Daily Rook) |
| Elimination | 3 wrong = out, test ends immediately |
| Retry | Unlimited, immediate |

### Screen Layout (LOCKED):
- **Intro screen**: Content top-aligned (`pt-6`), not vertically centered
  - AnimatedLogo (iconOnly, size 1.5, perpetual glow animation)
  - "Level X Test" heading + subtitle
  - Compact rules card: puzzles count, 3 red hearts for lives, "3 wrong and you're out"
  - Start Test button (must be visible without scrolling on mobile)
  - Back button
- **Gameplay banner**: Left = correct count (green), center = "Puzzle X/10", right = 3 hearts (red→gray as lost)
- **Passed screen**: AnimatedLogo (1.5, perpetual) + score + unlock message
- **Failed screen**: 3 gray empty hearts + "Out of Lives" heading + score
- **No emojis anywhere** in level test screens
- All screens use design system tokens, never raw hex

### On Pass:
1. Level unlocks
2. All previous lessons unlock
3. `currentPosition` set to first lesson of new level
4. Navigate to `/` (auto-scrolls to currentPosition)

### Enforced In:
`/app/level-test/[transition]/page.tsx`

### Stored In:
`profiles.unlocked_levels`

---

## 15. Pages

### Three Pillars (3.0):
1. **Learn** — Lessons (tactics curriculum) + Openings
2. **Play** — Play against Rookie (10-level difficulty system)
3. **Daily** — The Daily Rook (22 timed puzzles)

| Page | Purpose |
|------|---------|
| `/` | Middleware redirect: logged in → `/path`, not logged in → `/welcome` |
| `/welcome` | Welcome funnel — "Play or Learn?" (see §47) |
| `/about` | "How It Works" onboarding |
| `/path` | Main curriculum tree (the front door for authenticated users) |
| `/learn` | Redirect → `/path` (legacy route) |
| `/play` | Play against Rookie — 10-level progression |
| `/openings` | Opening tree browser |
| `/openings/[name]/[lesson]` | Opening lesson player |
| `/lesson/[lessonId]` | Puzzle solving |
| `/level-test/[transition]` | Level unlock tests |
| `/daily-challenge` | The Daily Rook mode |
| `/pricing` | Subscription (behind `MONETIZATION_ENABLED`) |
| `/auth/login` | Login |
| `/auth/signup` | Signup |
| `/admin/*` | Admin tools |

### User Flows:
- **New user (no session)**: `/` → middleware → `/welcome` → "Play or Learn?" → first game or first lesson
- **New user (beginner)**: `/welcome` → "I'm brand new" → `/basics` tutorial
- **Returning user**: `/` → middleware → `/path` → auto-scrolls to `currentPosition`
- **From about**: `/about` → `/` (Begin Learning button)

---

## 16. Header

### Scroll Behavior:
**Header is sticky** - stays fixed at top of viewport when scrolling. This keeps the Run (Rookie's Run) entry point reachable from anywhere in the curriculum.

### Links (left → right):
- **Play** → `/play`
- **Learn ▾** dropdown → `/path` (tactics), `/openings`
- **Run** → `/run` (Rookie's Run — the daily). Blue gradient + shimmer; active when path starts with `/run`.
- **Patron** → `/pricing` (free users only, flag-gated)
- **Sign Up** → `/auth/signup` (guests only)

(Was `[Daily] → /daily-challenge` until 2026-05-18; see §12 archive.)

### Logo Rules:
- **Icon**: Colorful rook made of 22 dots (5 columns × 6 rows)
- **Block style: Matte** — every rook block uses a top-to-bottom gradient + inset shadow for a polished 3D look:
  - Gradient: `linear-gradient(to bottom, lighten(color,18%) 0%, lighten(color,12%) 20%, color 40%, darken(color,12%) 100%)`
  - Shadow: `inset 0 0.75px 0 darken(color,6%), inset 0 -0.75px 0 lighten(color,6%), 0 0.5px 0 rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.15)` (scale shadow values by blockSize/14)
  - Utility functions: `getMatteBackground(color)` and `getMatteBoxShadow(color, scale?)` in `lib/daily-rook-blocks.ts`
  - SVG assets use `<linearGradient>` defs (no inset shadows in SVG — gradient-only is fine)
- **Text**: "chess" in white/dark + "path" with yellow→coral→blue gradient
- **"chess" and "path" must NEVER overlap or touch** - this looks unprofessional
- SVG logos must use inline `<tspan>` elements (not separate `<text>` elements with fixed positions)
- Prefer horizontal logo (`logo-horizontal-*.svg`) over stacked for most uses
- Logo files: `/public/brand/logo-horizontal-*.svg` and `/public/brand/logo-stacked-*.svg`
- Icon colors: Blue (#1CB0F6), Cyan (#2FCBEF), Purple (#A560E8), Green (#58CC02), Yellow (#FFC800), Orange (#FF9600), Coral (#FF6B6B), Red (#FF4B4B)
- "path" gradient: Yellow (#FFC800) → Coral (#FF6B6B) → Blue (#1CB0F6)

### Animated Logo:
- **Component**: `/components/brand/AnimatedLogo.tsx`
- **Animation**: Blocks fade in from center outward (~850ms ripple), then wordmark fades in
- **Breathing animation**: `perpetual` prop — blocks glow (brightness 1→1.35→1) in a ripple pattern from center outward. Rook stays still, colors breathe. Use on `/about` page.
- **Landing page (`/`) MUST use animated logo** - not the static SVG
- **About page (`/about`) uses AnimatedLogo** with `perpetual`, `iconOnly`, centered below "How It Works" heading
- Props: `theme="light"|"dark"`, `size="sm"|"md"|"lg"`, `iconOnly`, `autoPlay`, `perpetual`
- Test page: `/test-animated-logo`

### Layout Centering Rules:
- **Logos and modals should be vertically centered** between the header and the bottom of the viewport (or bottom action button)
- Use flexbox with `justify-center` to center content between fixed elements
- For landing/welcome screens: logo + content should feel balanced in the available space
- Don't let content hug the top - add `flex-1` containers to push content to vertical center
- Pattern: `flex flex-col h-full` → `flex-1 flex items-center justify-center` → content

### Page Scrolling Rules:
- Most pages use `h-full overflow-hidden` (no scrolling)
- **Exceptions that CAN scroll** (use `h-full overflow-auto`):
  - `/` - curriculum tree needs to scroll
  - `/test-*` and `/test/**` pages - test pages often have lots of content, always allow scrolling

### Elements by Location (3.0 Header):

| Element | Where Shown | Links To |
|---------|-------------|----------|
| Logo (BreathingHeaderLogo) | All pages | `/` (always) |
| Play button | All pages | `/play` |
| Learn dropdown | All pages | Opens dropdown: Tactics (`/path`) + Openings (`/openings`) |
| Daily button | All pages | `/daily-challenge` |
| Patron button | Logged in, non-premium (only when `MONETIZATION_ENABLED`) | `/pricing` |

**Removed in 3.0:** Sign Up button (signup earned after first win), standalone Openings button (now in Learn dropdown).

**Logout** lives on the `/about` page — not in the header. Keeps nav clean on mobile.

### Nav Button Styling:

| Button | Color | Style |
|--------|-------|-------|
| Play | Green (`chess-green`) | Solid |
| Learn | Purple (`chess-purple`) | Solid + dropdown chevron |
| Daily | Blue gradient (`#1CB0F6` → `#0d9ee0`) | Shimmer animation |
| Patron | Gold gradient (`#FFD700` → `#FFA500`) | Black text |

**Active state indicator:**
- Active button: solid bottom shadow (darker shade of button color)
- Inactive button: `opacity-70` (slightly faded)

Both buttons stay their color regardless of active state. The shadow + opacity difference indicates which page you're on.

### Enforced In (ONE place only):
`/components/layout/NavHeader.tsx`

---

## 17. Lesson Page

### Puzzle Count:
**6 puzzles per lesson**

### Difficulty Progression:
| Puzzles | ELO |
|---------|-----|
| 1-2 | Base ELO |
| 3-5 | Base + 200 |
| 6 | Base + 300 |

### Wrong Answer Handling:
- Wrong → retry at end of lesson
- Keep retrying until all correct
- Only first attempt counts for score

### Progress Bar:
- Shows puzzles solved (fills when puzzle completed, not when Continue clicked)
- Uses `completedPuzzleCount` state (single source of truth)
- **Critical:** Don't calculate from multiple states that update at different times
- Streak effects: 2+ = warming glow, 4+ = lava effect, 5 = lightning celebration
- Enforced in: `/components/puzzle/ChessProgressBar.tsx`

### X Button Behavior:
- Back to `/`
- **No partial save**

### Completion:
1. `currentPosition` updates to next lesson
2. `LessonCompleteScreen` renders with animated rook celebration, confetti, sound, score, quote
3. Continue button → `/` (always returns to curriculum tree)

### Rook Animations (Lessons Only):
Animated pixel-art rook appears in the result popup for lessons.

**Correct Answers:**
- Rook assembles one stage per correct answer (6 puzzles = 6 stages: Foundation → Body → Neck → Head → Crown Rim → Crown Points)
- One animation style randomly selected per lesson (10 styles: lightning, neon, emp, hologram, grid, hack, fusion, tesla, voltage, ion)
- Previous stages stay visible, new stage animates in

**Wrong Answers:**
- Full rook disassembles with animation
- Different animation style cycles each wrong answer (5 styles: powerDown, shortCircuit, pixelFade, shrink, signalLoss)

**Not Used In:**
- The Daily Rook (separate feature)
- Level Tests (separate feature)

**Enforced In:**
- Animation components: `/components/lesson/RookProgressAnimation.tsx`, `/components/lesson/RookWrongAnimation.tsx`
- Popup integration: `/components/puzzle/PuzzleResultPopup.tsx`
- Lesson state: `/app/lesson/[lessonId]/page.tsx`

**Test Page:** `/test-rook-animations`

### Lesson Complete Screen:
`LessonCompleteScreen` has two modes based on score:

**Pass (4-6 correct) — dark bg, celebration:**
1. **Animated rook** — random celebration animation at 1.6x scale (`RookCelebrationAnimation`)
2. **Confetti** — two bursts from left and right corners (gold for perfect, green/blue otherwise)
3. **Celebration sound** — C Major arpeggio via `playCelebrationSound()`
4. **Score** — `correctCount/6` in green (gold for 6/6) with tier label (Perfect / Great)
5. **Quote** — random funny quote from `/data/celebration-quotes.ts` (300 total, tiered by score)
6. **Continue button** — returns to `/learn` (curriculum tree)

**Fail (0-3 correct) — light bg (`chess-page`), falling apart rook:**
1. **Animated rook** — shows full rook, then plays random disassembly animation (`RookWrongAnimation`)
2. **No confetti, no celebration sound**
3. **Score** — `correctCount/6` in red with "Not Quite" tier label
4. **Quote** — encouraging quote from OKAY_QUOTES pool
5. **Two buttons** — "Try Again" (replays lesson at `/lesson/{id}`) + "Back to Learn" (returns to curriculum)

**Shared across both modes:**
- Premium upsell via `AdSlot` (renders `SelfPromoCard` for free users, nothing for premium)
- Guest signup prompt (if not logged in)

**Animation Styles (6 used randomly):**
| Style | Description |
|-------|-------------|
| `sparkleBurst` | Solid particles burst from each block |
| `wave` | Blocks pop up in sequence (3 waves) |
| `radiate` | Colored rays shoot outward from center |
| `ripple` | Blocks ripple outward from center |
| `cascade` | Blocks light up diagonally with sparks |
| `bloom` | Blocks expand outward then snap back |

**Enforced In (ONE place each):**
- Animation component: `/components/lesson/RookCelebrationAnimation.tsx`
- Lesson complete screen: `/components/lesson/LessonCompleteScreen.tsx`
- Quote data: `/data/celebration-quotes.ts`
- Rendered by: `/app/lesson/[lessonId]/page.tsx` (when `lessonComplete` is true)

### Lesson Complete Screen Design Spec (DETAILED):

**Container:**
- Full height of parent (`h-full`)
- Background: `#131F24` (dark blue-gray)
- Flex column, centered both axes
- Padding: 20px horizontal (`px-5`)
- Overflow hidden
- Max width: `max-w-sm` (384px), centered

**Layout (top to bottom):**

```
┌─────────────────────────────────┐
│                                 │
│         [ANIMATED ROOK]         │  ← 220px fixed height container
│            scale 1.8x           │
│                                 │
├─────────────────────────────────┤
│            5/6                  │  ← Score: 48px (text-5xl), font-black
│         Great Job!              │  ← Tier: 14px, gray-400, uppercase, tracking-wider
├─────────────────────────────────┤
│   "Your opponent rage-quit"     │  ← Quote: 20px (text-xl), italic, white
├─────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐    │
│  │    5     │  │   83%    │    │  ← Stats: 28px (text-2xl), bold
│  │First try │  │ Accuracy │    │  ← Labels: 14px, gray-400
│  └──────────┘  └──────────┘    │  ← Cards: bg-[#1A2C35], rounded-xl, p-4
├─────────────────────────────────┤
│      The Knight's L-Shape       │  ← Lesson name: 14px, gray-500
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │        Continue         │   │  ← Button: py-4, rounded-xl, font-bold, text-lg
│  └─────────────────────────┘   │  ← Color: #58CC02, shadow: 0 4px 0 #3d8c01
├─────────────────────────────────┤
│     [Guest signup prompt]       │  ← Only if isGuest=true
└─────────────────────────────────┘
```

**Colors:**
| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark blue-gray | `#131F24` |
| Card backgrounds | Darker blue-gray | `#1A2C35` |
| Score (normal) | ChessPath green | `#58CC02` |
| Score (perfect 6/6) | Gold | `#FFC800` |
| First try stat | Green | `#58CC02` |
| Accuracy stat | Blue | `#1CB0F6` |
| Accuracy (100%) | Gold | `#FFC800` |
| Continue button | Green | `#58CC02` |
| Button shadow | Dark green | `#3d8c01` |
| Tier label | Gray | `text-gray-400` |
| Quote text | White | `text-white` |
| Lesson name | Gray | `text-gray-500` |

**Spacing (margins/padding):**
| Element | Spacing |
|---------|---------|
| Rook container | Fixed 220px height, flex centered |
| Score section | `mb-3` (12px bottom) |
| Tier label | `mb-1` (4px) below score |
| Quote | `mb-5` (20px bottom) |
| Stats grid | `gap-3` (12px), `mb-5` (20px bottom) |
| Lesson name | `mb-4` (16px bottom) |
| Guest prompt | `mt-4` (16px top) |

**Animation Timing (staggered fadeInUp):**
| Element | Delay |
|---------|-------|
| Score | 0s |
| Tier label | 0.1s |
| Quote | 0.2s |
| Stats cards | 0.3s |
| Lesson name | 0.35s |
| Continue button | 0.4s |
| Guest prompt | 0.5s |

**fadeInUp Animation:**
```css
@keyframes fadeInUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

**Continue Button Behavior:**
- Text: "Continue" (always)
- On click: Navigate to `/?level={levelKey}` (or with `?guest=true` prefix for guests)
- Active state: `translateY(2px)` + reduced shadow
- Does NOT go to next lesson — always returns to curriculum tree at `/`

**Rook Celebration Animation:**
- Component: `<RookCelebrationAnimation />`
- Props: `style={randomStyle}`, `scale={1.8}`, `autoPlay={true}`
- Container: `height: 220px`, flex centered
- Style randomly chosen from: `sparkleBurst`, `wave`, `radiate`, `ripple`, `cascade`, `bloom`

**Confetti (fires on mount):**
```typescript
confetti({
  particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
  angle: 60,  // Left side
  spread: 55,
  origin: { x: 0, y: 0.65 },
  colors: isPerfect
    ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']  // Gold
    : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'], // Green/Blue
  gravity: 1.2,
  ticks: 200,
});
// Mirror burst from right side (angle: 120, origin.x: 1)
```

**Sound (fires on mount):**
```typescript
playCelebrationSound(correctCount);
```

**Tier Labels (from `/data/celebration-quotes.ts`):**
| Score | Tier Label |
|-------|------------|
| 6/6 | "Perfect!" |
| 5/6 | "Great Job!" |
| 4/6 | "Good Work!" |
| 3/6 | "Nice Try!" |
| 2/6 | "Keep Going!" |
| 1/6 | "You Got One!" |
| 0/6 | "Complete!" |

**Preview File:** `/lesson-complete-preview.html` — standalone HTML demo of the screen

**Preview File:** `/lesson-complete-preview.html`

---

## 17b. Tutorial (Lesson 1.1.1)

Lesson 1.1.1 ("Queen Checkmate: Easy") renders a **guided tutorial** instead of the standard lesson flow. It uses 6 fixed puzzles with progressive scaffolding to onboard new users.

### How It Works:
- `app/lesson/[lessonId]/page.tsx` checks `lessonId === '1.1.1'` and renders `<TutorialFlow>` from `app/test-tutorial/page.tsx`
- On completion, shows the same `LessonCompleteScreen` as all other lessons
- Progress persists normally via `completeLesson` + `recordLessonComplete`
- **"Skip Tutorial" navigates to `/lesson/1.1.1?skipTutorial=true`**, which renders the standard lesson flow (random puzzles from the pool, no guided overlays). The user must solve all puzzles like any other lesson — no free credit is given.

### The 6 Puzzles (fixed, not random):
All are mateIn1 queen checkmates from `level1-mateIn1.json`, rating 400-566, 1000+ plays.

| # | Pattern | Color | Queen Move | Scaffolding |
|---|---------|-------|-----------|-------------|
| 1 | Edge mate (pawn trap) | White | Qd4→g7 | Fully guided 8-step walkthrough |
| 2 | Back rank (d-file) | Black | Qd7→d1 | Semi-guided (orientation message) |
| 3 | Queen + Bishop | Black | Qd7→h3 | Light tip |
| 4 | Distance mate | White | Qh5→g6 | Minimal hint |
| 5 | Infiltration | Black | Qd6→h2 | No help |
| 6 | King in center | Black | Qg2→g3 | No help |

### Scaffolding Levels:
- **Level 0 (Puzzle 1):** 8-step walkthrough — welcome, last move, turn indicator, goal, tap queen, see moves, find mate, checkmate
- **Level 1 (Puzzle 2):** Intro popup "Your Turn!" / "Find the queen checkmate!"
- **Level 2 (Puzzle 3):** Tip card "f7 Weakness" / "The f7 pawn is barely guarded — strike!"
- **Level 3 (Puzzle 4):** Tip card "Trapped King" / "The king is boxed in. Crash through!"
- **Level 4-5 (Puzzles 5-6):** No guidance — pure solving

### Guided Steps Copy (Puzzle 1 walkthrough):
All copy must be ultra-short — one sentence max per step. Real phones have browser chrome eating viewport height.

| Step | Title | Message | Button |
|------|-------|---------|--------|
| welcome | Your First Puzzle | Find the best move and play it! | Got It |
| last-move | Yellow Squares | These show your opponent's last move. | Got It |
| your-turn | Your Turn | "White to move" means you're White! | Got It |
| goal | Find Checkmate | Trap the king with your queen! | Let's Do It |
| tap-queen | _(none)_ | Tap the white queen. | _(none)_ |
| see-moves | _(none)_ | One of these circles is checkmate! | _(auto-advance)_ |
| find-mate | _(none)_ | Tap the checkmate square! | _(none)_ |
| checkmate | Checkmate! | The king had no escape! | Next Puzzle |

### Completion Messages (one per puzzle):
1. "Sealed by its own pawns!"
2. "Back rank mate!"
3. "f7 weakness exploited!"
4. "No escape!"
5. "Beautiful mate!"
6. "Six for six! Let's go!"

### Visual Features:
- Pulsing green callout around "Queen Checkmate: Easy" during `goal` step
- Pulsing blue callout around "White to move" during `your-turn` step
- Board dims to highlight queen during `tap-queen` step
- Green hint square appears after 1 wrong attempt (not 3)
- Rook animation in correct popup (same as other lessons)
- **Board never shrinks** — bottom cards are compact to fit below full-width board
- **Checkmate explanation** — WHY? button on all checkmate puzzles shows red/yellow square highlights (see § 18 Checkmate Explanation)

### Files:
- `components/tutorial/TutorialFlow.tsx` — tutorial component
- `app/test-tutorial/page.tsx` — test page at `/test-tutorial`
- `components/puzzle/IntroPopup.tsx` — overlay popup (shared with lessons)
- `app/lesson/[lessonId]/page.tsx` — conditional render for `1.1.1`

---

## 17c. Theme Tutorials

Theme tutorials replace generic intro popups with educational walkthroughs when a chess concept is first introduced. Config lives in `data/theme-tutorials.ts`.

### Three Tiers:

| Tier | Experience | Guided Puzzles |
|------|-----------|----------------|
| **Quick** | Rich intro popup explaining the concept → 6 normal puzzles | 0 |
| **Medium** | Rich intro popup → hint card on puzzle 1 → 5 normal puzzles | 1 |
| **Full** | Rich intro popup → hint cards on puzzles 1-2 → 4 normal puzzles | 2 |

All 6 puzzles still come from the API (no hardcoded puzzles). Hint cards are theme-specific but not position-specific.

### Level 1 Tutorials (12 lessons):

**Quick:** 1.2.1 (backRankMate), 1.2.2 (smotheredMate), 1.2.3 (arabianMate), 1.2.4 (hookMate), 1.5.1 (hangingPiece), 1.9.1 (rookEndgame), 1.10.3 (promotion), 1.11.2 (trappedPiece)

**Medium:** 1.3.1 (mateIn2), 1.7.1 (skewer), 1.11.1 (deflection)

**Full:** 1.6.1 (fork)

### How It Works:
- Lesson page checks `getTutorialForLesson(lessonId)` on mount
- If tutorial exists: tutorial intro replaces the normal themeIntro popup
- Tutorial intro has "Let's Learn!" + "Skip" buttons
- Skip suppresses hint cards for the rest of the lesson
- Hint cards appear below the board (flush, rounded-b-2xl) during guided puzzles
- Hint cards hide when PuzzleResultPopup is showing

### Hint Card Visual:
- Background: `#FFF3CD`, title: `#7A6200` (15px bold), body: `#8B7000` (14px)
- Shadow: `0 2px 8px rgba(180, 140, 0, 0.15)`
- Animation: slideUp 0.3s ease-out
- Same style as 1.1.1 tutorial hint cards

### Feature Flag:
- `SHOW_BLOCK_INTROS: false` in `lib/config/feature-flags.ts` suppresses block intro popups
- Theme tutorials replace themeIntro popups for tutorial lessons
- Non-tutorial lessons still show themeIntro normally

### Files:
- `data/theme-tutorials.ts` — tutorial configs (12 entries)
- `app/lesson/[lessonId]/page.tsx` — tutorial integration
- `lib/config/feature-flags.ts` — SHOW_BLOCK_INTROS flag
- `lib/curriculum-registry.ts` — respects SHOW_BLOCK_INTROS flag

---

## 18. Puzzle Interaction

### Input Methods:
- Click-click: Supported (click piece to select, click again to deselect, click target to move)
- Drag-drop: Supported

### Click-to-Move (OSOT):
All board pages use `hooks/useClickToMove.ts` — the single source of truth for click-to-move behavior. The hook handles: select piece → deselect on reclick → try move → reselect friendly piece or deselect on failed move.

**Pages using the hook:** `/play`, `/daily-challenge`, `/lesson/[id]`, `/level-test/[id]`, `/test/play-rookie`

**Pages with custom handlers:** Tutorial pages (`BasicsTutorial`, `TutorialFlow`) and opening lessons have specialized logic (guided steps, tap-piece phases) that the shared hook doesn't cover. These implement the same select/deselect/move pattern inline but with additional constraints.

### Wrong Move:
1. Red popup
2. Piece stays where user put it
3. Red highlight on wrong square
4. Error sound

### Correct Move:
1. Green highlight
2. Move/capture sound
3. Auto-play opponent response
4. Green popup if last move of puzzle

### Alternate Checkmate Acceptance:
- On **mate-themed puzzles** (theme contains "mate" — e.g. `mateIn1`, `mateIn2`, `backRankMate`), any move that results in checkmate is accepted as correct, even if it differs from the Lichess solution.
- Non-mate-themed puzzles (e.g. `crushing`, `fork`) require the exact solution move, even if the player's move happens to be checkmate.
- Logic is centralized in `lib/puzzle-utils.ts` → `isAlternateCheckmate()`. All pages call this single function.

### Checkmate Explanation ("WHY?" Feature):
When a player delivers checkmate, the success popup shows a **WHY?** toggle button that highlights squares around the checkmated king explaining why it's checkmate.

**Square Colors:**
- **Red** = King can't escape — attacked by the player's pieces
- **Yellow** = King can't move there — blocked by its own pieces

**Behavior:**
- Highlights start **ON** by default (auto-triggered on checkmate popup mount)
- WHY? button **toggles on/off** — board highlights AND legend appear/disappear together
- **Single source of truth:** Parent page owns `showCheckmateHighlights` state, passed to popup as `checkmateExplainActive` prop. Popup has NO local toggle state — it reads and writes the parent's state only.
- Button fills green when active, outline when inactive
- Compact one-line legend above Continue button: `[red square] Attacked Square  [yellow square] Blocked by own pieces`
- Works on **all checkmate puzzles** (tutorial + regular lessons), not just tutorial

**X-Ray Detection:**
- The king is temporarily removed from the board before checking `isAttacked()` — this catches sliding piece attacks through the king's square (e.g. queen on d1 attacking f1 through king on e1)

**Logic:**
- `lib/puzzle-utils.ts` → `getCheckmateSquareHighlights(game, kingColor)` — returns `{ attackedSquares, blockedByFriendlySquares }`
- `components/puzzle/PuzzleResultPopup.tsx` — WHY? button + inline legend (reads `checkmateExplainActive` prop, calls `onShowCheckmateExplain` to toggle)
- Parent page (lesson/tutorial) owns `showCheckmateHighlights` state → passed as `checkmateExplainActive`
- Board highlights applied via `squareStyles` in the lesson/tutorial page, gated by `showCheckmateHighlights`
- **Style clearing:** When toggling highlights OFF, squares must be explicitly set to `{}` (empty style objects) — not omitted from the object. react-chessboard v5 caches square styles internally and won't clear them if the key is simply absent.

---

## 18d. ChessPathBoard Wrapper

**NEVER import `Chessboard` from `react-chessboard` directly.** Always use:

```tsx
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
```

### Why
The raw `Chessboard` component ships with default piece styling and no board colors. Every page that uses it must manually configure `darkSquareStyle`, `lightSquareStyle`, and `boardStyle` — and agents consistently forget this, producing boards that don't match the app's look.

### What It Does
`ChessPathBoard` wraps `react-chessboard`'s `Chessboard` with Chess Path defaults:
- **Board colors:** Green/cream from `BOARD_COLORS` (`#779952` / `#edeed1`)
- **Board style:** `borderRadius: 8px`, `boxShadow: 0 4px 20px rgba(0,0,0,0.3)`
- Same `options` API as `react-chessboard` — just swap the import and component name
- Style props (`boardStyle`, `darkSquareStyle`, `lightSquareStyle`) are **merged** — your overrides win

### Usage
```tsx
<ChessPathBoard
  options={{
    position: fen,
    boardOrientation: 'white',
    onSquareClick: handler,
    squareStyles: highlights,
    boardStyle: { borderRadius: '8px 8px 0 0' },  // override just border-radius
  }}
/>
```

### File
`components/puzzle/ChessPathBoard.tsx` — owned by Chess Agent.

---

## 19. Sounds

| Event | Sound | Source |
|-------|-------|--------|
| Move | Lichess mp3 | `/public/sounds/move.mp3` |
| Capture | Lichess mp3 | `/public/sounds/capture.mp3` |
| Correct answer | Chromatic ascending two-tone | Synthesized |
| Wrong answer | Gentle "womp womp" | Synthesized |
| Celebration | Warm C Major arpeggio (C4→E4→G4→C5) | Synthesized |

### Architecture:
- Move/capture: Preloaded as AudioBuffers for instant playback
- `warmupAudio()`: Call on first user interaction to unlock audio + preload sounds
- All other sounds: Web Audio API synthesized

### Test page:
`/test-sounds` - Compare celebration sound variations

### Enforced In (ONE place only):
`/lib/sounds.ts`

---

## 20. User ELO

**DELETED** - We are NOT tracking user ELO.

Puzzles still have ELO ratings (400-2000) for difficulty selection.

---

## 21. Analytics (PostHog)

**All events defined in `lib/analytics/posthog.ts`.** Import the named event objects — never call `trackEvent()` directly from components.

### Event Groups:

**Auth funnel** (`AuthEvents`): `signup_page_viewed`, `signup_started`, `signup_completed`, `signup_failed`, `login_page_viewed`, `login_completed`, `login_failed`, `logout`

**Learning funnel** (`LearningEvents`): `lesson_started`, `lesson_completed`, `puzzle_attempted`, `lesson_abandoned`

**Play Rookie** (`PlayEvents`): `game_started` (skillLevel, color), `game_ended` (result, moveCount, color, skillLevel, openingName)

**Level Tests** (`LevelTestEvents`): `level_test_started` (transition), `level_test_completed` (transition, passed, score, total)

**Engagement** (`EngagementEvents`): `tree_level_viewed`, `level_test_card_viewed`, `daily_challenge_viewed`, `daily_challenge_started`, `daily_challenge_completed`, `streak_updated`

**Subscription funnel** (`SubscriptionEvents`): `paywall_viewed`, `paywall_dismissed`, `pricing_viewed`, `checkout_started`, `checkout_completed`, `checkout_abandoned`

**Tutorial funnel** (`TutorialEvents`): `tutorial_started`, `tutorial_step_completed`, `tutorial_completed`, `tutorial_skipped`

**Onboarding/Welcome funnel** (`OnboardingEvents`): `onboarding_started`, `onboarding_level_selected`, `onboarding_style_selected`, `onboarding_elo_entered`, `onboarding_completed`

**Share/Viral funnel** (`ShareEvents`): `share_clicked`, `share_generated`, `share_completed`, `share_failed`

### Daily Report:
`scripts/daily-report.ts` — runs at 9:03am via cron, posts to Linear. Covers all funnels above.

---

## 22. Feature Flags

**Two files:**
- `/lib/config/feature-flags.ts` — UI toggles
- `/lib/feature-flags.ts` — `MONETIZATION_ENABLED` gate

| Flag | File | Value | Description |
|------|------|-------|-------------|
| `MONETIZATION_ENABLED` | `lib/feature-flags.ts` | `false` | Master gate for all premium/patron UI. When false, all content is free. |
| `SHOW_STREAK_COUNTER` | `lib/config/feature-flags.ts` | `false` | Streak counter (removed in 3.0, kept for potential future use) |
| `SHOW_SHARING` | `lib/config/feature-flags.ts` | `true` | Share buttons/cards on lesson complete and daily challenge |
| `SHOW_BLOCK_INTROS` | `lib/config/feature-flags.ts` | `false` | Block intro popups at section boundaries |
| `SHOW_OPENINGS` | `lib/config/feature-flags.ts` | `true` | Openings feature in Learn dropdown |

### Permissions & Limits (not feature flags)

Lesson limits and signup prompts are configured as **constants** in `types/permissions.ts`, not feature flags:

**File**: `/types/permissions.ts` → `LESSON_LIMITS`

| Config | Value | Description |
|--------|-------|-------------|
| `anonymous.totalLessons` | `4` | Total lessons before signup required |
| `free.dailyLimit` | `4` | Daily lesson limit for free users |
| `premium.dailyLimit` | `null` | Unlimited for premium users |
| `admin.dailyLimit` | `null` | Unlimited for admin users |

**Implementation**: `hooks/usePermissions.ts`
- Enforces lesson limits based on user tier
- Determines when to show signup/premium prompts
- Tracks lessons via localStorage + server-side validation (httpOnly cookie for anonymous, DB for logged-in users)

---

## 23. Database Tables

### Tables to KEEP:

```sql
profiles
  id, email, display_name, subscription_status, unlocked_levels,
  is_admin, current_streak, last_activity_date, current_position, created_at

lesson_progress
  id, user_id, lesson_id, completed_at, score

puzzle_attempts
  id, user_id, puzzle_id, lesson_id, correct, attempts, created_at

daily_challenge_results
  id, user_id, challenge_date, score, puzzles_completed, time_used_ms, created_at
  -- score = puzzles_completed (for sorting)
  -- time_used_ms = milliseconds taken
  -- UNIQUE(user_id, challenge_date) - one entry per user per day

level_test_attempts
  id, user_id, transition, passed, score, variant_id, created_at

-- puzzle_history: DROPPED 2026-05-18. Was never written; recently-seen
--   dedup is now in-memory per session (see §24).
-- quip_history: DROPPED 2026-05-18. Quip dedup is in-memory per session
--   (see §25 Quip System v2).

email_preferences
  id, user_id, streak_reminders, weekly_digest, marketing, created_at, updated_at
  -- User opt-in/out for different email types

email_log
  id, user_id, email_type, sent_at, metadata
  -- Tracks sent emails to prevent spam
  -- metadata: jsonb (e.g. attempt_number, stripe_invoice_id for payment_failed)

revenue_snapshots
  id, snapshot_date, mrr_cents, arr_cents, total_subscribers,
  monthly_subscribers, yearly_subscribers, churned_last_30d,
  new_subscribers_last_30d, trial_users, free_users, churn_rate_pct,
  ltv_cents, created_at
  -- Nightly snapshot from Stripe. RLS: service_role only.
```

### Columns/Tables to DELETE:
- ~~`theme_performance` table~~ — DROPPED 2026-05-18
- ~~`promo_codes` table~~ — DROPPED 2026-05-18
- ~~`promo_redemptions` table~~ — DROPPED 2026-05-18
- `profiles.elo_rating`
- `profiles.current_level`

### Also dropped 2026-05-18 (were never load-bearing):
- `daily_challenges`, `social_post_queue`, `social_funnel_log` (see §46 archived banner), `puzzle_history`, `quip_history`

---

## 24. Puzzle Selection

### Pre-computed Pools:
- Location: `/data/lesson-pools/{lessonId}.json` (e.g., `1.3.2.json`)
- Count: 40 puzzles per lesson pool
- Verified at build time to match criteria

### On Lesson Start:
1. Load pool file
2. Pick 6 random: 2 easy, 3 medium, 1 hard
3. (No persistent dedup — `puzzle_history` was dropped 2026-05-18; recently-seen tracking is in-memory per session only)

---

## 25. Quip System

Two separate quip systems coexist. Pick the right one for your surface.

### A) Puzzle-response quips (v3) — lesson/puzzle quips
File: `/data/staging/v2-puzzle-responses.ts`. Used by lesson puzzle steps.
Selection via `getQuip()` with piece/theme/context matching.

### B) Unified play pool — Play/touchpoint/greeting/landing/in-game
File: `lib/quips/quip-pool.ts` (exports `QUIP_POOL: SpeechLine[]`).
Selection via `selectLine()` (beat/event-gated, in-game) or
`selectByCategory()` (category prefix match, touchpoints).

**Tone filter (CHE-290).** Every `QueueContext` / `selectByCategory` call
passes a `tone: 'polite' | 'baseline' | 'spicy'` derived from the user's
attitude slider. `matchesConditions` filters so lines tagged with a
specific tone only appear at that setting; tone-unset lines match all
settings. Mapping: slider 1-2 → polite, 3 → baseline, 4-5 → spicy.

**Talkativeness filter.** `isAtLimit()` + `cooldownForTalkativeness(level)`
throttle in-game speech per the user's talkativeness slider. At level 5
Rookie also fires filler commentary on otherwise-silent moves (chatty
override in `useRookieSpeech.onMove`). Levels:

| Level | Cooldown (moves) | Window cap |
|---|---|---|
| 1 Silent | 20 | 1 per 30 |
| 2 Quiet | 12 | 1 per 16 |
| 3 Baseline | 8 | 2 per 16 |
| 4 Chatty | 5 | 3 per 16 |
| 5 Nonstop | 2 | 4 per 16 |

Checkmate / game-end / landing always fire regardless of throttle.

**Claude-generated voice paths** (`/api/rookie-voice`, `/api/rookie-speech`)
also accept `attitudeLevel` and inject matching guidance into the system
prompt via `withTone()` in `lib/rookie-personality.ts`.

### v3 Puzzle-response details:

### Selection Function (v3):
```ts
getQuip(sectionId: string, context: {
  themes?: string[];
  heroPiece?: string;
  playerMoveCount?: number;
  streak?: number;
  puzzleIndex?: number;
  totalPuzzles?: number;
  hadWrongAttempt?: boolean;
}) => string
```

`getV2Response()` is kept during transition but new code should use `getQuip()`.

### Category Keys:

**Context categories** (checked first, in priority order):
- `first` — puzzle index 0 (first puzzle in section)
- `last` — last puzzle in section
- `recovery` — player had a wrong attempt before solving
- `streak:5` — 5+ consecutive correct answers
- `streak:3` — 3+ consecutive correct answers

**Theme tiers** (checked after context, in specificity order):
- Tier 1: `{theme}:{piece}` — most specific (e.g. `fork:N`, `pin:B`)
- Tier 2: `{theme}` — theme only (e.g. `fork`, `pin`, `mateIn2`)
- Tier 3: `piece:{piece}` — piece only (e.g. `piece:N`, `piece:Q`)
- Tier 4: `moves:{count}` — move count (e.g. `moves:1`, `moves:2`)
- Tier 5: `general` — fallback

### Piece Values:
N (knight), B (bishop), R (rook), Q (queen), K (king), P (pawn)

### Theme Mapping:
Lichess theme names are mapped to quip keys via `THEME_KEY_MAP`. Notable mapping: `discoveredCheck` → `discoveredAttack`. Full list: `fork`, `pin`, `skewer`, `discoveredAttack`, `hangingPiece`, `trappedPiece`, `attraction`, `deflection`, `sacrifice`, `quietMove`, `backRankMate`, `mateIn1`, `mateIn2`.

**META_THEMES** (ignored, never matched): `crushing`, `short`, `long`, `master`, `masterVsMaster`, `superBlitz`, `blitz`, `rapid`, `oneMove`, `veryLong`, `advancedPawn`.

### Selection Algorithm:
1. **Context categories** — check `first`, `last`, `recovery`, `streak:5`, `streak:3` in order. First match with a non-empty pool wins.
2. **Tiered theme matching** — for each resolved theme, try Tier 1 → Tier 2. Then try Tier 3, Tier 4, Tier 5 (`general`).
3. **Nuclear fallback** — if dedup exhausted all bags, pick random from `general` without dedup. If no `general` pool exists, return `"Nice!"`.

### Dedup & Randomization:
- **Global dedup ring buffer**: 20 items, cross-section. Prevents the same quip text from appearing across different sections.
- **ShuffleBag per section+key**: cached at module level (`bagCache`), resets on page reload. Ensures all quips in a pool are used before repeating.
- `drawWithSkip(dedupSet)` draws from the bag but skips anything in the dedup ring.

### Detection Functions:
- `getHeroPiece(puzzleFen, movesStr)` — reads puzzle FEN + first player move to identify piece
- `getPlayerMoveCount(solutionMovesLength)` — counts player moves from solution array

### Minimum Quip Counts Per Section:
- 40-50 `general` quips
- 20-25 per theme key (e.g. `fork`, `pin`)
- 12-15 per `{theme}:{piece}` combo (e.g. `fork:N`)
- 3-5 per context category (`first`, `last`, `recovery`, `streak:3`, `streak:5`)

### Speech Pacing (Play Rookie):
- **Never interrupt.** If Rookie is currently speaking (audio playing / `isTalking` true), drop the new quip entirely.
- **Cooldown after speech.** After audio finishes, wait at least 2 seconds (`QUIP_COOLDOWN_MS = 2000`) before allowing a new quip. Fast-moving games should feel *quiet*, not cluttered.
- **Think mode takes priority.** If Rookie is calculating (`rookieThinking`), the talk animation yields to the think shimmer.
- Implementation: `useRookieVoice` hook tracks `isTalking` (live) and `lastSpokeAtRef` (timestamp). `showRookieMsg` checks both before speaking.

---

## 26. Quip Content Guidelines

**Full voice rules: `.claude/rookie-voice-bible.md`** — read that file for the definitive guide.

### DO:
- Playful, witty, confident — Rookie's own personality
- Friendly trash talk
- Chess puns and piece philosophy (each piece has its own personality)
- Rook bias (Rookie loves rooks, slightly jealous of queens)
- Rookie's emotional growth (learning to feel things for the first time)
- Rookie's side projects and hobbies

### DON'T:
- Violence/death language
- Movie/pop culture references (killed in 3.0 — everything internal to Rookie)
- Compute-flex quips ("I analyzed 14 million positions...")
- Any AI-hardware metaphor: circuits, processing, RAM, cores, compute (all banned — overused and off-character)
- Contextual assumptions about board state unless data is confirmed present
- False context: streaks, history, game count, "again", "last time" — only allowed when the data is explicitly in the quip's conditions
- Mean insults, bullying, real people, swearing
- Emojis in UI
- TTS decimals (say "two and a half" not "2.5")

### Tone definitions (attitude slider):
- **polite**: sincere, warm, "rooting for you" energy. Soft edges. Still Rookie, still quirky-AI, just not sharp.
- **baseline**: default Rookie. Playful, earnest, learning-to-feel-things.
- **spicy**: grudging, mock-competitive, sore-loser. King + rooks prominent as characters. Teases but never insults.
- **agnostic** (no `tone` field): works at every setting. Use for the "bigger board" existential register — short frame-break asides + casual return ("Sometimes I wonder if there's a bigger board... Anyway. Your move.").

### Banned Words:
suffocated, death, dead, killed, murdered, destroyed (in violent context), die, dies, kill, coffin, tomb, violence

### Quip Structure Notes:
- Context quips (`first`, `last`, `recovery`, `streak:3`, `streak:5`) are section-specific and should feel situational — not generic praise.
- Piece-specific quips go in `{theme}:{piece}` or `piece:{piece}` keys
- Move-count quips go in `moves:{N}` keys
- Keep quips short (under 60 characters preferred)
- Target pool sizes per section: 40-50 general, 20-25 per theme, 12-15 per theme:piece combo

---

## 27. Lesson/Level/Block Naming

### Lesson Names:
Current names are good - keep them

### Level Names:
| Level | Name |
|-------|------|
| 1 | Checkmate |
| 2 | Double Trouble |
| 3 | The Setup |
| 4 | The Squeeze |
| 5 | Survival Instinct |
| 6 | Between the Lines |
| 7 | No Escape |
| 8 | The Complete Player |

**Note:** Movie spoof names were removed in 3.0. All level names now describe the chess content.

### Level Card Display Rule:
- The `name` field in curriculum data is the level name ONLY (e.g., `"Checkmate"`, NOT `"Level 1: Checkmate"`)
- The sticky level header has a colored badge that says "Level {number}" — the name next to it is ONLY the level name
- The locked level card shows the level name as its heading — no separate "Level X" text
- Never display the level number twice in the same card

### Block Names:
Already defined - keep them

---

## 28. Intro Messages

### When to Show:
- **Block intro popup**: First lesson of each block
- **Theme intro popup**: First lesson of each section

### Stored In:
Curriculum files (`blockIntroMessage`, `themeIntroMessage`)

### Content Guidelines:
Same as quips (Section 26)

---

## 29. Adding New Levels Checklist

When adding Level N:

1. **Create curriculum file**
   - `/data/staging/levelN-v2-curriculum.ts`
   - Structure: 4 blocks, ~3.5 sections each, 4 lessons each (56 lessons total)

2. **Register in curriculum registry**
   - `/lib/curriculum-registry.ts` — add import and LEVELS entry

3. **Generate puzzle files (USE EXISTING SCRIPT)**
   - Add your level to `V2_LEVELS` in `scripts/extract-clean-puzzles.ts`
   - Run `npx tsx scripts/extract-clean-puzzles.ts`
   - Output: `data/clean-puzzles-v2/levelN-{theme}.json` (1,000 puzzles max per file)
   - **DO NOT write a new extraction script** — the existing one handles caps, filtering, and theme detection
   - **WHY:** Vercel has a 250 MB serverless function limit. All puzzle JSON files get bundled. Without the 1,000 cap, files can reach 80+ MB each and break deploys.

4. **Update `getLevelFromRating()` in `/app/api/puzzles/lesson/route.ts`**
   - Add the new level's rating range so puzzles load from the correct `levelN-*.json` files

5. **Add level test config**
   - `/data/level-unlock-tests.ts`

6. **Add quips**
   - Append to `data/staging/v2-puzzle-responses.ts`
   - Register in `allLevelResponses` map
   - Follow content guidelines (no violence/death language, kid-safe)

7. **Update maintenance check**
   - Add level import and entry to `scripts/maintenance-check.ts`

8. **Use unique section IDs**
   - Dot notation: `N.1`, `N.2`, `N.3`, etc.

9. **Follow content guidelines**
   - No death/violence language, weapons, or dark themes
   - Kid-friendly — review all quips against Section 28 guidelines

10. **Test everything**
    - `npm run check` — 0 errors
    - `npx tsx scripts/maintenance-check.ts` — all checks pass
    - Verify total `clean-puzzles-v2/` size stays under ~50 MB

---

---

## 30. Work In Progress (WIP)

**Last updated: 2026-04-08**

### 3.0 Transition Status

**Completed:**
- Phase 0: Purge (dead code, stale issues, test pages, half-built features)
- Phase 1: Foundation (Honcho context provider, brand tokens, loading states, error boundaries, analytics)
- Phase 2: Rookie's Voice (voice bible, quip audit, movie quotes killed, touchpoint content, Rookie on all pages)
- Phase 3 partial: Unified Learn, NavHeader redesign, 10-level difficulty, monetization model decided

**In Progress:**
- Personality-driven chess bot engine (CHE-216)

**Remaining (tracked in Linear "Chess Path 3.0" project):**
- Phase 3: Transition flows between pillars, Daily Challenge polish
- Phase 4: Email pipeline, Rookie-voiced emails, share cards for all pillars, admin dashboard, observability
- Phase 5: Touch-first audit, offline data, native transitions, sound abstraction, push notification hooks
- Bugs: Quip stacking (CHE-251), TTS speed mismatch (CHE-252), victory sound distortion (CHE-250)

### Share System

**Status:** Complete — server-side OG image generation

**Files:**
| File | Purpose |
|------|---------|
| `app/api/og/default/route.tsx` | Default site OG image (server-side) |
| `app/api/og/daily-challenge/route.tsx` | Daily Rook story card (server-side) |
| `app/api/og/lesson/route.tsx` | Lesson share card (server-side, see Section 32) |
| `app/lesson/[lessonId]/share/[status]/layout.tsx` | OG metadata for lesson share routes |
| `app/lesson/[lessonId]/share/[status]/page.tsx` | Redirects to `/path` |
| `components/share/ShareButton.tsx` | Puzzle share button + generation trigger |
| `components/share/PuzzleShareCard.tsx` | Puzzle image card design |
| `lib/share/generate-puzzle-image.ts` | Puzzle card → PNG (client-side) |
| `lib/share/generate-share-text.ts` | Emoji rook text for clipboard |
| `lib/share/piece-svgs.ts` | SVG chess pieces for OG images |

---

## 31. Share Card — "The Daily Rook" Story Card

**Status:** ✅ Complete — LOCKED DESIGN (approved 2026-02-07)

**This is THE ONLY share card format for Daily Rook results. DO NOT CHANGE this layout without explicit approval.**

### Format

**Size:** 9:16 (1080×1920) — Instagram Stories / texting / Reels

### Layout (top to bottom, all content 936px wide)

1. **Gradient bar** — `linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8, #1CB0F6)` — 8px
2. **chesspath logo** — rook icon (12px blocks) + "chesspath" wordmark (28px)
3. **"THE DAILY ROOK" title** — gradient pill (`#FF9600` → `#FF6B6B` → `#FF9600`), 42px, font-black, letterSpacing 6, border `rgba(255,150,0,0.3)`, compact padding (14px vertical)
4. **Tagline** — *"Build the Rook. Improve at Chess."* — 26px, font-black (900), italic, `#6b7c8a`
5. **Date** — e.g. "Feb 7, 2026" — 20px, `#6b7c8a`
6. **Rule pills** — 4 equal-width pills in a row: "22 puzzles" (`#1CB0F6`), "5 min" (`#FF9600`), "3 lives" (`#FF6B6B`), "Easy → Hard" (`#A560E8`) — text centered both axes, 22px font-black
7. **Results card** — white rounded card (24px radius), "Score + Divider" layout (see below)
8. **Rook grid** — 22-block rook shape (130px blocks, 143px spacing), tight below card (32px gap), colored for correct, gray for wrong
9. **Footer** — "chesspath.app" subtle text, pushed to bottom

### Results Card Layout: "Score + Divider"

White card, full 936px width, `border-radius: 24px`, subtle shadow + border.

```
┌────────────────────────────────────────┐
│  18     │  TacticQueen       ❤❤🩶  │
│ SOLVED  │  3:45          Beat 72%  │
└────────────────────────────────────────┘
```

- **Left:** Score number (72px, `#FF9600`, font-black) + "SOLVED" label (18px, `#2A3C45/50`)
- **Divider:** 2px vertical line (`#dce8f0`)
- **Right:** Two rows:
  - Row 1: Name (32px, font-800, `#2A3C45`) + hearts (28px, gap 6)
  - Row 2: Time (24px, `#6b7c8a`) + "Beat X%" (26px, font-900, `#46A302`)

### Background

Light theme: `#eef6fc` (matches Daily Rook page)

### Exact Sizes (DO NOT CHANGE)

| Element | Size | Weight |
|---------|------|--------|
| Title text | 42px | 900 |
| Tagline | 26px | 900 |
| Rule pills | 22px | 800 |
| Score number | 72px | 900 |
| Player name | 32px | 800 |
| Beat % | 26px | 900 |
| Rook blocks | 130px | — |
| Content width | 936px | — |

### Files

| File | Purpose |
|------|---------|
| `app/api/og/daily-challenge/route.tsx` | **THE** server-side story card generation (`renderStoryLayout`) |
| `app/test-share-preview/page.tsx` | Preview page — generate and view the exact share image |
| `app/test-story-cards/page.tsx` | Original mockups (reference only, not used for generation) |
| `lib/daily-rook-blocks.ts` | Rook block positions + colors |

### Test Page

`/test-share-preview` — Generate and preview the exact OG story image

### Generation

1. `renderStoryLayout()` in OG route renders server-side at 1080×1920 via `format=story` param
2. Image is **pre-fetched** when game finishes (cached in ref for instant sharing)
3. Re-fetched when leaderboard data arrives (to include rank/percentage)
4. On "Share Results" tap → `navigator.share()` (mobile share sheet) or download fallback (desktop)

### API Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `format` | `story` (9:16) or `og` (16:9, default) | Image dimensions |
| `score` | Number | Puzzles solved |
| `time` | Number (ms) | Time used |
| `rank` | Number | Leaderboard rank |
| `total` | Number | Total participants |
| `name` | String | Display name |
| `results` | Comma-separated 1/0 | Puzzle results |

### Entry Points

| Location | When it appears |
|----------|-----------------|
| Daily Rook finished screen | "Share Results" button (single button, uses story format) |

---

## 32. Lesson Share Card

**Status:** ✅ Complete — LOCKED DESIGN (approved 2026-02-18)

**This is THE ONLY share card format for lesson completion results. DO NOT CHANGE this layout without explicit approval.**

### Format

**Size:** 1:1 (1080×1080) — social media / texting / link previews

### Layout (centered, stacked vertically)

1. **Rainbow gradient border** — wrapper with `linear-gradient(135deg, #FF9600, #FFC800, #FF6B6B, #FF4B4B, #A560E8, #CE82FF, #1CB0F6, #2FCBEF, #58CC02)` — 24px padding, square outer corners (fills to image edge), rounded inner card
2. **Card background** — `#eef6fc`, rounded corners (32px radius)
3. **Logo fun-box** — white rounded box (28px radius), padding 24px 56px, box-shadow, containing: rook mini-logo SVG + "chesspath" wordmark (36px) + tagline "The fun way to learn chess." (22px, `#94a3b8`)
4. **Level/Result fun-box** — white rounded box (28px radius), padding 24px 56px, containing: "LEVEL X, LESSON Y" (28px, uppercase, `#6b7c8a`, letterSpacing 3) + result text
   - "Completed!" — `#58CC02` (green), 76px, font-weight 900
   - "Perfect!" — `#FFC800` (gold), 76px, font-weight 900 (when score = 6/6)
5. **Celebration rook** — 22-block rook shape (68px blocks, 90px spacing), with 3D shadow effect and sparkles
6. **Confetti** — Seeded random confetti in 5 zones (top burst, left/right cascades, mid-field, bottom scatter)
   - Regular: 35 pieces (densities: 8, 7, 7, 8, 5)
   - Perfect (6/6): 55 pieces (densities: 15, 12, 12, 12, 14)
7. **Watermark** — "chesspath.app" at bottom (20px, `rgba(0,0,0,0.18)`)

### Share Routes

- `/lesson/[lessonId]/share/completed` — scores 4/6, 5/6
- `/lesson/[lessonId]/share/perfect` — score 6/6
- OG metadata serves certificate image as link preview
- Clicking shared link redirects to `/learn`

### OG Image Params

- `?level=X&lesson=Y&score=N/6` (score=6/6 → perfect, otherwise → completed)

### Files

| File | Purpose |
|------|---------|
| `share-card-preview.html` | HTML mockup (approved design reference) |
| `app/api/og/lesson/route.tsx` | Server-side OG image generation (Satori) |
| `app/lesson/[lessonId]/share/[status]/layout.tsx` | OG metadata for share routes |
| `app/lesson/[lessonId]/share/[status]/page.tsx` | Redirects to `/learn` |
| `components/lesson/LessonCompleteScreen.tsx` | Tap-rook-to-share trigger |

### Colors (from design system)

- Green (Completed): `#58CC02`
- Gold (Perfect): `#FFC800`
- Card background: `#eef6fc`
- Subtitle text: `#6b7c8a`
- Tagline: `#94a3b8`
- Logo text: `#2A3C45`
- Watermark: `rgba(0,0,0,0.18)`

### Test Page

`/test-lesson-share` — Generate and preview the exact OG lesson share image

---

## 33. SEO & Marketing

### Target Audience

**Primary:** Dads aged 25-50 who want to beat their friends/kids at chess
**Secondary:** Kids learning through schools or parents

### Brand Positioning

- "The Fun Way to Learn Chess."
- "The Fun Way to Learn Chess"
- "Chess tactics that actually work"
- NOT competing with Chess.com for serious players

### Domain Name

**Always use `chesspath.app`** - never chesspath.com or other variations.

- Share links: `chesspath.app/daily-challenge`
- Display text: `chesspath.app`
- This is our official domain

### SEO Keywords (Target These)

**Primary:**
- "chess tactics for beginners"
- "learn chess fast"
- "beat friends at chess"
- "basic chess tactics"

**Long-tail:**
- "how to beat my friend at chess"
- "chess tricks to win quickly"
- "chess for dads"
- "simple chess tactics"

### Meta Tags

**Global (app/layout.tsx):**
```typescript
title: 'The Chess Path'
description: 'The Fun Way to Learn Chess.'
```

**Page-Specific (override in each page.tsx):**

| Page | Title | Description |
|------|-------|-------------|
| `/` | The Chess Path - The Fun Way to Learn Chess | The Fun Way to Learn Chess. Learn chess tactics in 15 min/day. The fastest way to stop losing and start winning. |
| `/learn` | Redirects to `/` | N/A |
| `/daily-challenge` | The Daily Rook \| The Chess Path | Test your skills with 22 puzzles. Compete on the leaderboard. |
| `/pricing` | Chess Path Premium - Unlimited Tactics Training | Unlock all lessons, remove limits, accelerate your chess improvement. |

### Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Global meta tags, OpenGraph, Twitter cards |
| `app/sitemap.ts` | Dynamic sitemap for Google |
| `app/robots.ts` | Search engine crawl rules |
| `app/api/og/default/route.tsx` | Default social share image (dynamic, 1200x630) |

### OpenGraph Image

- Size: 1200x630px
- Shows: Logo + tagline + value prop pills + starting chess board
- Location: `/api/og/default` (dynamic edge route, same pattern as daily-challenge and lesson OG routes)
- Used when sharing links on social media

### Tracking (PostHog)

**Key Events to Track:**

| Event | When | Why |
|-------|------|-----|
| `signup_started` | User clicks signup | Measure funnel top |
| `signup_completed` | User finishes signup | Measure conversion |
| `puzzle_attempted` | User tries a puzzle | Engagement |
| `puzzle_solved` | User solves correctly | Success rate |
| `lesson_completed` | User finishes lesson | Progress |
| `upgrade_clicked` | User clicks premium | Revenue intent |
| `upgrade_completed` | User pays | Revenue |
| `share_clicked` | User shares puzzle | Virality |

### Analytics Dashboard Goals

- Landing → Signup: >20%
- Signup → First Puzzle: >80%
- Day 1 → Day 7 Retention: >30%
- Free → Paid: >5%

---

## 34. Daily Maintenance Check

### What It Does
Automated health check script that validates curriculum, puzzles, quips, database connectivity, and page rendering.

### How to Run
```bash
npx tsx scripts/maintenance-check.ts              # All 8 checks (includes dev server smoke test)
npx tsx scripts/maintenance-check.ts --fix        # Auto-fix missing puzzle files
npx tsx scripts/maintenance-check.ts --no-server  # Skip smoke test (faster, checks 1-7 only)
```

### The 8 Checks

| Check | What It Validates | Auto-Fix? |
|-------|-------------------|-----------|
| **Lesson Puzzles** | Every lesson has puzzle files with sufficient puzzles in rating range | Yes |
| **Daily Rook** | Coverage for today + future days | No |
| **Quip Coverage** | All sections have quip responses | No |
| **Puzzle File Integrity** | JSON files parse correctly, puzzles have required fields | No |
| **Lesson ID Uniqueness** | No duplicate lesson IDs across curriculum | No |
| **Database Connectivity** | Can connect to Supabase and query profiles | No |
| **Feature Flags** | All flags have valid boolean values | No |
| **Page Render Smoke Test** | Key pages (/, /learn, /lesson/*, /daily-challenge, APIs) return 200 with no SSR errors | No |

### Auto-Fix Capability
When run with `--fix`, the script can:
- Create missing puzzle files by extracting from source CSVs
- Adjust rating ranges to match available data
- Generate summary reports

### File Location
`scripts/maintenance-check.ts`

### When to Run
- Before deploying new curriculum changes
- After adding new levels or sections
- Weekly health check
- When pages seem broken or puzzles are missing

---

## 35. Failed Payment Recovery

### Dunning Flow:
When a Stripe `invoice.payment_failed` event fires, the system sends up to 3 recovery emails:

| Attempt | Timing | Tone | Subject |
|---------|--------|------|---------|
| 1 | Immediate | Calm | "Your payment didn't go through" |
| 2 | 3 days later | Warning | "Your subscription is at risk" |
| 3 | 7 days later | Final | "Final notice: subscription cancellation" |

### Key Behaviors:
- **Transactional emails** — bypass all email preferences (users cannot opt out of payment failure notices)
- Each email includes a **Stripe billing portal link** for updating payment method
- Dunning cron checks `email_log` for previous attempts — won't re-send
- If user's subscription resolves to `premium` between attempts, remaining emails are skipped
- Webhook logs `attempt_number`, `stripe_invoice_id`, `stripe_customer_id` in `email_log.metadata`

### Files:
| File | Purpose |
|------|---------|
| `app/api/stripe/webhook/route.ts` | Sends attempt 1 on payment failure |
| `app/api/cron/dunning/route.ts` | Daily cron sends attempts 2 & 3 |
| `lib/email/templates/PaymentFailed.tsx` | 3-variant email template |

---

## 36. Revenue Dashboard

### What It Shows:
Nightly Stripe snapshot with key metrics:
- **MRR** (Monthly Recurring Revenue) in dollars
- **ARR** (Annual Recurring Revenue)
- **Total Subscribers** (monthly + yearly + trial)
- **Churn Rate** (churned last 30d / total)
- **LTV** (lifetime value estimate)
- **Subscriber breakdown** (monthly vs yearly)
- **90-day MRR trend** (SVG chart)

### How It Works:
1. Nightly cron paginates ALL Stripe subscriptions
2. Calculates metrics and upserts into `revenue_snapshots`
3. Admin dashboard queries last 90 days

### Files:
| File | Purpose |
|------|---------|
| `app/api/cron/revenue-snapshot/route.ts` | Nightly cron (02:00 UTC) |
| `app/api/admin/revenue/route.ts` | Admin API (last 90 days) |
| `app/admin/revenue/page.tsx` | Dashboard UI |

---

## 37. Paywall Analytics

### What It Shows:
Conversion rate per paywall trigger point (e.g. `guest_limit`, `daily_limit`), powered by PostHog server-side API.

### Metrics:
- Views per trigger (from `paywall_viewed` events)
- Conversions per trigger (from `checkout_completed` events)
- Conversion rate per trigger

### Known Gap:
`checkout_completed` events don't currently pass a `trigger` property. Until the checkout flow forwards the trigger value (via URL param or session storage), conversion attribution will be incomplete.

### Files:
| File | Purpose |
|------|---------|
| `lib/posthog-server.ts` | Server-side PostHog API client (HogQL) |
| `app/api/admin/paywall-analytics/route.ts` | Admin API with period filter |
| `app/admin/paywall-analytics/page.tsx` | Dashboard UI |

### Env Var:
`POSTHOG_PERSONAL_API_KEY` — PostHog personal API key for server-side queries

---

## 38. Dynamic Pricing

### How It Works:
PostHog feature flag `pricing-experiment` assigns users to a pricing variant. Different variants see different Stripe prices.

### Variants:
| Variant | Description | Stripe Price Env Vars |
|---------|-------------|----------------------|
| `control` | Default prices | `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_YEARLY` |
| `low` | Lower test price | `STRIPE_PRICE_MONTHLY_LOW`, `STRIPE_PRICE_YEARLY_LOW` |
| `high` | Higher test price | `STRIPE_PRICE_MONTHLY_HIGH`, `STRIPE_PRICE_YEARLY_HIGH` |

### Key Behaviors:
- PostHog flag evaluation falls back to `control` on any error
- Anonymous users get a cookie-based distinct ID (`cp_anon_id`)
- Variant is passed to Stripe checkout and stored in session + subscription metadata as `pricing_variant`
- Low/high env vars fall back to default prices if not set

### Files:
| File | Purpose |
|------|---------|
| `lib/posthog-flags.ts` | Server-side feature flag evaluation |
| `lib/stripe.ts` | `EXPERIMENT_PRICES` map (variant → price IDs) |
| `app/api/stripe/checkout/route.ts` | Accepts `variant`, uses correct price |
| `app/api/pricing-experiment/route.ts` | Returns user's variant + prices |
| `app/pricing/page.tsx` | Fetches and displays dynamic price |
| `app/admin/pricing-experiments/page.tsx` | Experiment results dashboard |

---

## 39. Ad Placement

### What It Does:
Feature-flagged ad slots show self-promo upgrade CTAs to free users. Premium users see nothing.

### Positions:
| Position | Page | When Shown |
|----------|------|------------|
| `learn-page` | `/` | Always (bottom of curriculum) |
| `daily-complete` | `/daily-challenge` | After challenge completion |
| `after-lesson` | `/lesson/[lessonId]` | After lesson completion |

### Key Behaviors:
- `AdSlot` component returns `null` for premium/admin users
- Tracks `ad_impression` (on mount) and `ad_click` (on click) via PostHog
- Properties: `{ position, ad_type: 'self_promo' }`
- Config in `lib/ad-config.ts` — enable/disable per position
- Global kill switch: `NEXT_PUBLIC_SHOW_ADS=false` env var

### ONE Premium Upsell Design:
**There is exactly ONE premium upsell card used across the entire app: `SelfPromoCard`.** It renders the gold gradient premium card (amber background, crown icon, "BEST VALUE" badge, "$4.99/mo", gold "Start Premium" button). Do NOT create alternative premium upsell designs — always use `SelfPromoCard` via `AdSlot`. The same design from `CreateProfileModal`'s premium tier card is used here for consistency.

### Files:
| File | Purpose |
|------|---------|
| `components/ads/AdSlot.tsx` | Smart wrapper (checks subscription, tracks events) |
| `components/ads/SelfPromoCard.tsx` | ONE premium upsell card (gold gradient) |
| `lib/ad-config.ts` | Position config + enable/disable |
| `app/admin/ad-performance/page.tsx` | Impressions/CTR dashboard |

---

## 40. Cron Schedule

All crons are defined in `vercel.json` and protected with `CRON_SECRET` Bearer token. Every cron is wrapped in `withCronHeartbeat()` (`lib/cron/heartbeat.ts`) which records each run to the `cron_heartbeats` table and posts to `CRON_ALERT_WEBHOOK_URL` (if set) on failure. Admin dashboard `/admin/dashboard` surfaces health (CHE-239).

| Endpoint | Schedule (UTC) | Purpose |
|----------|----------------|---------|
| `/api/cron/drip` | Daily 18:00 | 3-day inactivity email |
| `/api/cron/revenue-snapshot` | Daily 02:00 | Stripe metrics snapshot |
| `/api/cron/report/revenue` | Daily 07:00 | Revenue report → `dashboard_reports` |
| `/api/cron/report/engagement` | Daily 07:00 | PostHog engagement report |
| `/api/cron/report/content` | Daily 07:00 | Puzzle content report |
| `/api/cron/report/growth` | Daily 07:00 | Funnel/growth report |
| `/api/cron/morning-brief` | Daily 07:30 | Reads the 4 stored reports, posts one prioritized brief to Slack (`SLACK_WEBHOOK_URL`), stores as `morning_brief` |

**Planned (not yet built):** streak-check, re-engagement, dunning, weekly-digest, ux-report.

---

## Appendix A: Quick Reference - Where Things Are Enforced

| Behavior | Enforced In (ONE place) |
|----------|-------------------------|
| Lesson unlocking | `/hooks/useProgress.ts` → `isLessonUnlocked()` |
| Level unlocking | `/hooks/useProgress.ts` → `isLevelUnlocked()` |
| Current position tracking | `/hooks/useProgress.ts` → `currentPosition` + `setCurrentPosition()` |
| Scroll behavior | `/components/learn/LearnPageContent.tsx` → ONE useEffect |
| Navigation after lesson | `/components/lesson/LessonCompleteScreen.tsx` → Continue button |
| Permissions/limits | `/hooks/usePermissions.ts` |
| Header | `/components/layout/NavHeader.tsx` |
| Quips | `/data/staging/v2-puzzle-responses.ts` |
| Feature flags | `/lib/config/feature-flags.ts` |
| Curriculum | `/lib/curriculum-registry.ts` |
| Maintenance checks | `scripts/maintenance-check.ts` |
| Daily challenge puzzles | `/data/daily-challenge-puzzles.json` |
| Progress bar (lessons/tests) | `/components/puzzle/ChessProgressBar.tsx` |
| Dunning emails | `/app/api/cron/dunning/route.ts` |
| Revenue snapshots | `/app/api/cron/revenue-snapshot/route.ts` |
| Ad placement | `/components/ads/AdSlot.tsx` + `/lib/ad-config.ts` |
| Dynamic pricing | `/lib/posthog-flags.ts` + `/lib/stripe.ts` |
| Cron schedule | `/vercel.json` |

---

## Appendix B: Checklist for Changes

Before modifying any behavior:

- [ ] Read the relevant section in this document
- [ ] Find where it's currently enforced (ONE place)
- [ ] Check if other code references that behavior
- [ ] Make the change in ONE place
- [ ] Update this document if the rule changed
- [ ] Test the change
- [ ] Verify no duplicate implementations exist
- [ ] **CSS containment check** — Before adding `overflow-hidden`, `max-height`, or `clip` to any container, verify no child uses absolute/fixed positioning that extends beyond bounds (popups, tooltips, dropdowns). Test all interactive flows, not just the visual animation.

---

## 41. Loading Indicator — Breathing Rook

The **Breathing Rook** (`components/ui/BreathingRook.tsx`) is the standard loading indicator across the entire app. It replaces all generic spinners.

### What It Is
The 22-block rook logo where blocks stay perfectly still but colors pulse with a gentle breathing wave — top-to-bottom, slightly staggered left-to-right. Blocks dim to 45% opacity then brighten to 130% in a 2.4s cycle.

### When to Use It
- **Any loading state**: page loads, data fetches, OAuth redirects, skeleton screens
- **Any "please wait" moment**: form submissions, puzzle loading, challenge setup
- **Splash/boot screens**: app startup, PWA install

### Sizes
| Size | Block px | Use Case |
|------|----------|----------|
| `xs` | 6px | Inline loading (next to text, inside buttons) |
| `sm` | 10px | Small containers, card loading |
| `md` | 16px | Default — page loading, modals |
| `lg` | 24px | Full-page loading, splash screens |

### Usage
```tsx
import { BreathingRook } from '@/components/ui/BreathingRook';

// Default (md, no label)
<BreathingRook />

// Inside a button
<BreathingRook size="xs" />

// Full-page loading
<BreathingRook size="lg" label="Loading puzzles..." />
```

### Rules
1. **Never use generic spinners.** If something is loading, use the Breathing Rook.
2. **Blocks don't move.** The shape is static. Only color/opacity animates.
3. **Wave direction** is top-to-bottom with a subtle left-to-right offset.
4. **Optional label** appears below in `text-xs text-gray-400 animate-pulse`.
5. **Uses `ROOK_BLOCKS` from `lib/daily-rook-blocks.ts`** — single source of truth for the rook shape and colors.

---

## 42. Admin Dashboard

The admin dashboard at `/admin/dashboard` is the **operational command center** for Chess Path. Its goal is to **automate as many operational tasks as possible** so Tyler never has to manually check analytics, hunt for bugs, or remember what needs attention.

### Philosophy
- **Morning briefing, not raw data.** The dashboard surfaces actionable suggestions, not raw numbers to interpret.
- **Automate everything.** If something can be checked by a cron job, it should be. Every new feature should consider: "Can this report to the dashboard?"
- **Fun and branded.** This is Chess Path, not a generic admin panel. Use the design system.

### Architecture

| Layer | What | Where |
|-------|------|-------|
| **Cron Reports** | 5 daily jobs at 7am UTC analyze data and store suggestions | `app/api/cron/report/{type}/route.ts` |
| **Reports Table** | `dashboard_reports` stores metrics + suggestions per report type | Supabase, service-role only |
| **Reports API** | Single endpoint returns latest reports for all types | `app/api/admin/dashboard/reports/route.ts` |
| **Dashboard Page** | 7 panels read from APIs and reports table | `app/admin/dashboard/page.tsx` |
| **Components** | 11 files in `components/admin/dashboard/` | Reusable cards, badges, panels |

### Panels (render order)

1. **Morning Briefing** — Time-aware greeting, yesterday's highlights (lessons, daily rooks, signups, puzzles), prioritized suggestion feed from all 5 reports
2. **Command Center** — Skill command clipboard buttons, user search + grant/revoke premium, feature flag display
3. **Revenue & Monetization** — MRR/ARR/LTV/Churn cards, MRR sparkline, subscriber mix, paywall conversion funnel, A/B pricing results
4. **Health & Ops** — 6 cron job status cards (healthy/warning/stale), email sent/failed stats, email type breakdown
5. **User Engagement** — DAU/WAU/MAU, 7-day activity, 4 funnel visualizations with drop-off %, retention (D1/D7/D30)
6. **UX Report** — Auto-detected issues by severity, rage clicks, exit pages, device split, top events
7. **Production Status** — Feature flags table, built-not-deployed items, dead analytics list, quick wins

### Daily Intelligence Crons

All run at `0 7 * * *` (7am UTC). Auth: `CRON_SECRET` header (Vercel auto-injects).

| Report Type | Data Sources | Key Metrics |
|-------------|-------------|-------------|
| `engagement` | PostHog | lessons_yesterday, daily_rooks_yesterday, signups, puzzles_solved, DAU, 7d averages + change % |
| `revenue` | Stripe + revenue_snapshots | MRR, MRR change %, new/churned subscribers, trial conversions, dunning recovery |
| `ux` | PostHog | rage_clicks_24h, top_rage_element, highest_exit_page, mobile %, error_events |
| `content` | Supabase puzzle_attempts | hardest/easiest puzzle, avg_accuracy, most_attempted_theme |
| `growth` | PostHog + Stripe | paywall_conversion_rate, signup→lesson rate, lesson→subscriber rate, shares |

Each cron generates `suggestions[]` with `{ priority, title, detail, action }`. Priority thresholds are defined in each cron file.

### Adding New Automation

When building new features, always ask: **"Should this report to the dashboard?"**

To add a new report type:
1. Create `app/api/cron/report/{type}/route.ts` following the existing pattern
2. Query your data sources, compute metrics, generate suggestions
3. Delete + insert into `dashboard_reports` with `report_type = '{type}'`
4. Add the cron schedule to `vercel.json`
5. The Morning Briefing automatically picks up new suggestions — no frontend changes needed

To add a new dashboard panel:
1. Create `components/admin/dashboard/{PanelName}.tsx`
2. Accept `refreshKey` prop for the refresh button
3. Add to `app/admin/dashboard/page.tsx` in the grid
4. Use `DashboardCard` wrapper for consistent styling

### Files

| File | Purpose |
|------|---------|
| `app/admin/dashboard/page.tsx` | Main page, grid layout, refresh state |
| `components/admin/dashboard/MorningBriefing.tsx` | Greeting + highlights + suggestions |
| `components/admin/dashboard/CommandCenter.tsx` | Actions, user search, feature flags |
| `components/admin/dashboard/RevenuePanel.tsx` | Revenue metrics + conversion data |
| `components/admin/dashboard/HealthPanel.tsx` | Cron status + email health |
| `components/admin/dashboard/EngagementPanel.tsx` | Active users + funnels + retention |
| `components/admin/dashboard/UXReportPanel.tsx` | UX issues + rage clicks + exits |
| `components/admin/dashboard/ProductionStatus.tsx` | Flags, deployments, quick wins |
| `components/admin/dashboard/DashboardCard.tsx` | Collapsible card wrapper |
| `components/admin/dashboard/MetricCard.tsx` | Stat card with value + delta |
| `components/admin/dashboard/StatusBadge.tsx` | Colored status pill |
| `app/api/admin/dashboard/reports/route.ts` | Reads latest reports from table |
| `app/api/admin/dashboard/health/route.ts` | Live cron + email health queries |
| `app/api/admin/dashboard/engagement/route.ts` | Live PostHog engagement queries |
| `app/api/admin/dashboard/ux-report/route.ts` | Live PostHog UX queries |
| `app/api/cron/report/*.ts` | 5 daily intelligence cron jobs |
| `supabase/migrations/add-dashboard-reports.sql` | Table schema |

---

## 43. Design System Compliance

**Every component must follow the design system.** The full reference is in `.claude/design-system.md`. The rendered style guide lives at `/style-guide`.

### Colors — Always Use Tokens

All colors come from `globals.css` `@theme` tokens. **Never use raw hex values** in components.

| Instead of | Use |
|------------|-----|
| `bg-white` | `bg-chess-surface` |
| `bg-[#131F24]` | `bg-chess-bg` |
| `bg-[#1A2C35]` | `bg-chess-bg-light` |
| `bg-[#0D1A1F]` | `bg-chess-bg-deep` |
| `text-gray-*` / `text-slate-*` (for primary text) | `text-chess-text`, `text-chess-text-muted`, `text-chess-text-faint` |
| `text-[#A3B8C2]` | `text-chess-text-light` |
| `bg-[#D7FFB8]` / `bg-[#FFDFE0]` | `bg-chess-correct-bg` / `bg-chess-wrong-bg` |
| `bg-[#FFF3CD]` | `bg-chess-hint-bg` |
| `text-[#FF4B4B]` | `text-chess-red` |
| `bg-[#58CC02]` | `bg-chess-green` |
| `bg-[#1CB0F6]` | `bg-chess-blue` |

**Exception:** `border-slate-200` is fine for light borders. `bg-slate-200`/`bg-slate-300` are fine for skeleton loaders.

### Buttons — 3D Duolingo Style

Primary and premium buttons use a 3D bottom-shadow effect:

```
bg-chess-green border-b-4 border-chess-green-dark active:border-b-0 active:mt-1
  text-white font-bold rounded-xl transition-all hover:brightness-105
```

| Pattern | Use |
|---------|-----|
| `bg-chess-green` + shadow | Primary actions (Start, Continue, Sign Up) |
| `bg-chess-blue` + shadow | Secondary actions (navigation) |
| `bg-gradient-to-r from-yellow-500 to-orange-500` + shadow | Premium/upgrade CTAs |
| `text-chess-text-muted hover:text-chess-text` | Ghost/text-only buttons |

**Never use:** `hover:opacity-90` (use `hover:brightness-105`), `rounded-lg` on buttons (use `rounded-xl`).

### Cards

```
bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4
```

**Never use:** `bg-white` (use `bg-chess-surface`), `rounded-lg` or `rounded-xl` on cards (use `rounded-2xl`), `shadow-lg` on cards (use `shadow-sm`).

### Modals

Two themes:
- **Dark modals** (in-lesson, puzzles): `bg-chess-bg-light rounded-2xl border border-white/10 shadow-2xl`
- **Light modals** (auth, profile): `bg-chess-surface rounded-2xl border border-slate-200 shadow-xl`

Both use `fixed inset-0 z-50` backdrop with `bg-black/80 backdrop-blur-sm`.

### No Emojis

**Never use emoji characters** in the UI. Replace with:
- Breathing Rook (`<BreathingRook size="xs" />`) for loading/branding
- AnimatedLogo for premium features
- Chess unicode (`♔ ♕ ♗ ♘`) only in feature lists where a chess piece is contextually appropriate
- SVG icons for functional indicators (flame, checkmark, etc.)

### Typography

| Element | Classes |
|---------|---------|
| Page titles | `text-xl font-black` or `text-2xl font-bold` |
| Section headings | `text-lg font-bold` |
| Body text | `text-sm` or `text-base` |
| Captions/hints | `text-xs text-chess-text-faint` |

**Never use:** `font-semibold` (use `font-bold`), Tailwind default grays (`text-gray-*`) for primary text.

### Chess Board

Always use `ChessPathBoard` wrapper, never raw `Chessboard`. Board colors come from `BOARD_COLORS` in `lib/puzzle-utils.ts`.

### File Reference

| File | Purpose |
|------|---------|
| `app/globals.css` | Token definitions (`@theme` block) |
| `.claude/design-system.md` | Full written reference |
| `app/style-guide/page.tsx` | Visual rendered reference |
| `app/style-guide/before-after/page.tsx` | Before/after comparison examples |

## 44. Daily Puzzle Video

**Status:** Active — renders daily for social media (Instagram Reels, TikTok, Stories)

### Format

**Size:** 1080×1920 (9:16 vertical reel)
**FPS:** 30
**Codec:** H.264 (MP4)
**Font:** DM Sans (loaded via `@remotion/google-fonts`)

### 3-Zone Layout (every stage)

All stages share the same `ReelLayout` — the board never moves.

```
┌──────────────────────────┐
│       TOP ZONE (468px)   │
│  Logo (rook + wordmark)  │
│  "Daily Puzzle" badge    │
├──────────────────────────┤
│     BOARD (936×936px)    │
│  ChessPathBoard, amber   │
│  last-move highlights    │
├──────────────────────────┤
│    BOTTOM ZONE (468px)   │
│  3D BottomCard (green)   │
│  "chesspath.app" footer  │
└──────────────────────────┘
```

- **Safe padding:** 72px on all sides (content isn't clipped by Reels UI)
- **Background:** `#EBF0F5` (light)
- **Board size:** `1080 - 72×2 = 936px`

### Logo — ReelLogo

Rook icon (22 colored blocks, 2× scale) + "chesspath" wordmark (144px, DM Sans 700).

- **"chess" color:** `#2A3C45` (dark type — light background)
- **"path" color:** gradient `#FFC800 → #FF6B6B → #1CB0F6`
- **Rook blocks:** gentle breathe animation (brightness oscillates 1.0–1.25 via sine wave, offset by distance from center)

**DO NOT use light/white text for "chess" — the video background is light.**

### "Daily Puzzle" Badge

Green pill below logo: `linear-gradient(135deg, #58CC02, #46a302)`, white text, 40px, font-700, uppercase, letter-spacing 0.12em.

### Bottom Card — 3D Layered Style

- Dark card: `#1a2a33` background, `#58CC02` (green) 8px border, `border-radius: 32px`
- Two depth-shadow layers behind (10px and 20px offset, green at 0.2/0.4 opacity)
- Corner accent: 45° green gradient triangle (top-right)
- Height: 272px, content padded 48px horizontal

### Footer

"chesspath.app" — 44px, DM Sans 700, `#2A3C45`, centered below the card.

### 4 Stages

| Stage | Name | Duration | Bottom Card Content |
|-------|------|----------|---------------------|
| 1 | Initial | 2s (60f) | "Can you find the solution?" (68px) + "{Color} to play" (44px) |
| 2 | Countdown | 4s (120f) | "Solution in 3" → "2" → "1" → "GO!" (72px) + "(Tap Screen to Pause)" (32px) |
| 3 | Solution | 1.2s × N moves | "SOLUTION" label (44px, uppercase) + SAN notation (46–80px, auto-sized) |
| 4 | Celebrate | 3s (90f) | Quip in italic (64px) |

**Total duration:** `2 + 4 + (1.2 × solutionMoves) + 3` seconds

### Stage Details

**Stage 1 (Initial):** Static board showing puzzle position (after opponent's setup move). Opponent's last move highlighted in amber.

**Stage 2 (Countdown):** Same board, 1s per count (30 frames). Text changes: 3 → 2 → 1 → GO!

**Stage 3 (Solution):** Board animates one move every 36 frames (1.2s). SAN notation builds left-to-right (e.g. "1. Qg8+ Rxg8 2. Nf7#"). Font auto-sizes: 80px (≤12 chars) → 68px → 56px → 46px (28+ chars).

**Stage 4 (Celebrate):** Final position with result overlay on board (dark semi-transparent badge, 72px white text). Result is auto-generated: "Checkmate in N!", "Won the Queen!", "Won a Piece!", "Brilliant Move!", etc.

### Result Badge (Board Overlay)

Dark pill on the board center: `rgba(0,0,0,0.75)`, `backdrop-blur: 16px`, `border-radius: 32px`, padding 80px/48px. Text: 72px, white, DM Sans 700.

### Move Highlights

Lichess-style amber squares:
- From square: `rgba(255, 170, 0, 0.5)`
- To square: `rgba(255, 170, 0, 0.6)`

### Puzzle Pool & Rendering

**Pool file:** `data/video-puzzle-pool.json` (~200 puzzles)
**Usage tracker:** `data/video-puzzle-usage.json`
**Rating range:** 500–2000 (use `--min-rating=N` for harder puzzles)
**Solution moves:** 3–7 (not too short for video, not too long)
**Preferred themes:** mateIn1-3, backRankMate, smotheredMate, fork, pin, skewer, sacrifice, discoveredAttack, kingsideAttack, queensideAttack, deflection, attraction

**Render command:**
```bash
npx tsx scripts/render-daily-video.ts                  # next unused puzzle
npx tsx scripts/render-daily-video.ts --min-rating=1700  # hard puzzle
```

**Refill pool:**
```bash
npx tsx scripts/curate-video-puzzles.ts
```

**Output:** `out/videos/{M.DD.YY}/daily.{M.DD.YY}-{puzzleId}.mp4` + `.txt` caption file

### Caption Format

Auto-generated per puzzle. Theme-specific hook + rating + quip + CTA + hashtags.

```
{Theme hook}

Rating: {rating} ⭐
"{quip}"

Play daily puzzles free → chesspath.app

#chess #chesspuzzle #chesspath #dailypuzzle {+2 rotating tags}
```

### Files

| File | Purpose |
|------|---------|
| `remotion/DailyPuzzleVideo.tsx` | Main composition — 4 Sequences |
| `remotion/components/ReelLayout.tsx` | 3-zone layout (logo, board, bottom) |
| `remotion/components/ReelLogo.tsx` | Rook icon + wordmark (breathe animation) |
| `remotion/components/BottomCard.tsx` | 3D layered green card |
| `remotion/components/BoardSlot.tsx` | ChessPathBoard at 936px + highlights |
| `remotion/components/ResultPopup.tsx` | Dark overlay badge (stage 4) |
| `remotion/components/FooterTagline.tsx` | "chesspath.app" footer |
| `remotion/stages/StageInitial.tsx` | Stage 1: prompt |
| `remotion/stages/StageCountdown.tsx` | Stage 2: countdown |
| `remotion/stages/StageSolution.tsx` | Stage 3: animated solution |
| `remotion/stages/StageCelebrate.tsx` | Stage 4: result + quip |
| `remotion/lib/timing.ts` | FPS, frame counts, layout constants |
| `remotion/lib/describe-result.ts` | Auto-generates result text from position |
| `scripts/render-daily-video.ts` | Render pipeline (pick puzzle → render → caption → mark used) |
| `scripts/curate-video-puzzles.ts` | Pool generation from clean-puzzles-v2 |
| `data/video-puzzle-pool.json` | Pre-curated puzzle bank |
| `data/video-puzzle-usage.json` | Tracks which puzzles have been rendered |

---

## 45. Opening Lessons

### Minimum Interactive Steps
**6 interactive steps per opening lesson** (play-move, quiz, or puzzle). No lesson should feel like a slideshow — the player must always have enough hands-on practice.

### Lesson Structure
- 2–4 new moves per lesson
- Instruction steps set up context; play-move steps are the core
- Every lesson needs at least one recall section (replay moves without hints)
- Punish lessons can be shorter on new content but must still hit the 6-step minimum through recall

### Play-Through Auto-Advance
In recall/play-through sections, the user's correct moves **auto-advance without a Continue popup**. This makes the section feel like a real game — user plays, opponent responds, user plays again.

**Detection rule:** If the NEXT step after a `play-move` is an `instruction` with `autoAdvance`, the current move is in play-through mode. On correct: play move sound (not celebration), skip the popup, auto-advance after 400ms into the opponent's auto-advancing instruction.

Teaching sections (where the next step is NOT an auto-advance instruction) still show the "Correct!" popup with feedback.

### Level Test Unlocks Deviations
Completing a level test unlocks ALL deviation nodes for that level, regardless of their individual `unlockedBy` value. The test proves mastery — if you passed the test, every deviation from that level is accessible. This prevents deviations from appearing locked when a user's progress data doesn't include them (e.g., deviations added after the user already progressed past that level).

**Implementation:** In `isNodeUnlocked`, a deviation node is unlocked if its normal `unlockedBy` is completed OR if any test node that comes after it in the `completionOrder` is completed.

### Key Files
| File | Purpose |
|------|---------|
| `data/openings/{slug}.ts` | Tree data (nodes, grid, completion order) |
| `data/openings/{slug}-lessons.ts` | Lesson steps (FENs, moves, quips) |
| `data/openings/registry.ts` | Master registry (slug, name, colors, hasData flag) |
| `lib/opening-trees.ts` | Tree lookup map |
| `app/openings/[slug]/[lessonId]/page.tsx` | Shared lesson player |

---

## 46. Social Media Sales Funnel

> **PAUSED 2026-05-18.** The backing table `social_funnel_log` was dropped during cleanup; no code currently reads or writes it. Spec retained as a blueprint — to revive, recreate the table and wire `lib/social/funnel-tracker.ts`.

Automated social media engagement pipeline via **Late.dev** API. Covers Instagram, Twitter, and YouTube. All automation saves as **drafts for Tyler to approve** — nothing posts automatically without review.

### Architecture

| Component | File | Purpose |
|-----------|------|---------|
| Late.dev client | `lib/late.ts` | Unified API client for posts, DMs, comments, media, webhooks, analytics |
| ELO parser | `lib/social/elo-mapper.ts` | Extracts rating from free text, maps to tier + personalized level-test link |
| Response templates | `lib/social/response-templates.ts` | DM replies, comment replies, engagement posts — Tyler's voice, randomly rotated |
| Funnel tracker | `lib/social/funnel-tracker.ts` | Supabase logging + dedup on conversation/comment/post IDs |
| Video poster | `lib/social/video-poster.ts` | Reads rendered puzzle video, uploads to Late.dev as draft |
| Webhook route | `app/api/webhooks/social/route.ts` | Late.dev post lifecycle events (no DM webhooks available) |

### Cron Schedule

| Cron | Schedule | Route | What it does |
|------|----------|-------|-------------|
| DM polling | Every 30 min | `/api/cron/social-dm` | Polls Instagram/Twitter/YouTube for unread DMs, auto-replies with personalized level-test links |
| Comment engagement | Every 2 hours | `/api/cron/social-comments` | Auto-likes all comments, replies to ELO mentions publicly, sends Instagram private DMs with links |
| Daily video | Daily noon UTC | `/api/cron/social-video` | Uploads latest rendered puzzle video as draft to Late.dev |
| Engagement post | Daily 6pm UTC | `/api/cron/social-post` | Picks non-recently-used post template, saves as draft |

### ELO Tiers & Personalization

The funnel personalizes responses based on detected ELO rating:

| Tier | ELO Range | Level Test Link | DM Tone |
|------|-----------|----------------|---------|
| Beginner | < 800 | `/` (homepage) | Welcoming, encouraging |
| Intermediate | 800–1199 | `/level-test/1-2` | "Sweet spot for improvement" |
| Advancing | 1200–1399 | `/level-test/2-3` | "Getting serious" |
| Advanced | 1400–1599 | `/level-test/3-4` | Respectful, targeted |
| Expert | 1600+ | `/level-test/5-6` | "Beast mode", challenge them |
| Unknown | No ELO detected | `/` (homepage) | General invite |

ELO parser handles: "1200", "~1.2k", "rated 800 on lichess", "my elo is 1200", etc.

### Comment Engagement Rules

1. **Auto-like** all comments on our posts (dedup by comment ID)
2. **Public reply** to comments mentioning an ELO — encouraging, no link (keeps it organic)
3. **Instagram private DM** to ELO commenters — personalized link with UTM tracking (7-day window, one per comment)
4. All actions logged to `social_funnel_log` for dedup and analytics

### Engagement Post Templates

15 rotating templates covering: ELO polls, chess tips (openings, tactics, blunders, endgame, time management, analysis), milestones, challenges, motivation, teasers, behind-the-scenes, daily promo. Each has platform targets (Instagram/Twitter/YouTube). Rotation avoids repeating the same type within 3 days.

### UTM Tracking

All links include UTM params: `utm_source` (platform), `utm_medium` (social_dm/social_comment), `utm_campaign` (elo_funnel), `utm_content` (tier name).

### Database

Table: `social_funnel_log` (service-role only, RLS enabled)

| Column | Type | Purpose |
|--------|------|---------|
| event_type | TEXT | dm_reply, comment_like, comment_reply, comment_dm, video_post, engagement_post |
| platform | TEXT | instagram, twitter, youtube |
| conversation_id | TEXT | Late.dev conversation ID (DM dedup) |
| comment_id | TEXT | Late.dev comment ID (comment dedup) |
| post_id | TEXT | Puzzle ID or post ID |
| elo_detected | INTEGER | Parsed ELO (null if none) |
| link_sent | TEXT | Personalized link sent |
| content_type | TEXT | Engagement post type (rotation dedup) |
| metadata | JSONB | Extra context |

Indexes on conversation_id, comment_id, post_id, and engagement_type for fast dedup lookups.

### Environment Variables

- `LATE_API_KEY` — Late.dev API key (required)
- Late.dev account IDs are hardcoded in `lib/late.ts`

### Key Rules

1. **Nothing auto-publishes.** Videos and engagement posts save as drafts. Tyler approves.
2. **DMs and comment replies send automatically** — they're responses, not content.
3. **Dedup everything.** Every action checks `social_funnel_log` before executing.
4. **Tyler's voice.** All templates written as Tyler, not a brand. Casual, encouraging, real.
5. **No link in public comments.** Links only go in DMs to keep engagement organic.

---

## 47. Welcome Funnel

### Route
`/welcome` — the front door for unauthenticated users.

### Middleware Routing (`lib/supabase/middleware.ts`)
- `GET /` with session → redirect `/learn`
- `GET /` without session → redirect `/welcome`
- `/welcome` is in the `PUBLIC_PATHS` list (no auth check)

### Funnel Steps (3.0)

```
/welcome
  ├─ Play → /play (game vs Rookie)
  │   └─ Game over → RookieNameAsk → SignupPrompt (modal) → /path
  │
  └─ Learn (expands to two options)
      ├─ Basics → /basics (how pieces move)
      │   └─ Done screen → SignupPrompt (modal) → /lesson/1-1-1
      │
      └─ Checkmate → /lesson/1-1-1 (Queen Checkmate: Easy)
          └─ Celebration → RookieNameAsk → SignupPrompt (modal) → /path
```

### Three Entry Paths
1. **Play** → `/play` — play a game against Rookie immediately
2. **Learn → Basics** → `/basics` — learn how all pieces move (existing tutorial)
3. **Learn → Checkmate** → `/lesson/1-1-1` — skip basics, jump to first checkmate lesson

### Signup Gate
- **Soft gate, not hard.** After completing any path, a modal signup prompt appears.
- The prompt is dismissible (X button, backdrop click, or "Maybe later").
- If dismissed, user continues into the app with localStorage-only progress.
- **NavHeader shows "Sign Up" button** for all guest users as a safety net.

### SignupPrompt (Modal)
- Modal card over dimmed backdrop with BreathingRook (happy mood)
- Random Rookie quip about saving progress
- "Sign Up Free" button → `/auth/signup`
- "I already have an account" button → `/auth/login`
- X button + "Maybe later" to dismiss
- Component: `components/onboarding/SignupPrompt.tsx`

### RookieNameAsk
- Asked after completing a game or the checkmate tutorial (if no name in localStorage)
- Skipped if name already exists (e.g., user came through basics first)
- Saves to `chess_path_name` in localStorage

### LocalStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `chess_path_onboarded` | `'true'` | Marks funnel complete (prevents re-showing) |
| `chess_path_name` | `string` | Player's name (asked after tutorial/game) |

### Analytics Events

| Event | When | Properties |
|-------|------|------------|
| `onboarding_started` | Flow mounts | — |
| `onboarding_route_selected` | Play or Learn chosen | `id` |
| `onboarding_completed` | User proceeds to next page | `level` |

### Design Rules
- **NO HEADER ON `/welcome` or `/basics`.** Full-screen, immersive experience only.
- **Header shows on all other pages for guests** with a "Sign Up" button.
- **BreathingRook on every step** — varies by animation (`enter`, `breathe`, `think`, `celebrate`).
- **Duolingo-style 3D buttons** — colored background + `box-shadow` bottom edge + `active:translate-y-[2px]`.
- **Learn button expands** into Basics + Checkmate sub-options on tap.
- **SignupPrompt is a modal**, not a full-screen takeover.

### Key Files

| File | Purpose |
|------|---------|
| `app/welcome/page.tsx` | Route + metadata |
| `components/onboarding/OnboardingFlow.tsx` | Welcome page (Play / Learn with sub-options) |
| `components/onboarding/SignupPrompt.tsx` | Soft signup modal (post-tutorial/game) |
| `components/onboarding/RookieNameAsk.tsx` | Name collection mid-flow |
| `components/layout/NavHeader.tsx` | Sign Up button for guests |
| `lib/supabase/middleware.ts` | Root redirect logic (`/` → `/welcome` or `/learn`) |

---

## 48. Rookie Play Engine (/play)

Rookie's move selection at each of the 10 difficulty levels. Three engines in one pipeline: opening book → Maia (mid-range) → Stockfish sampled.

### Dispatch order (per Rookie move)
1. **Opening book** (`lib/rookie-opening-book.ts`) — walks the combined opening trie from `data/openings/registry.ts`. Capped at L1–L4 to Rookie's first 5 moves; L5+ use the full trie.
2. **Maia-2** (`lib/maia/maia-adapter.ts`) — fires only at L5/L6 when the model is downloaded and ready. ONNX model at `public/maia3/maia3_simplified.onnx` (~45 MB, lazy-downloaded, IndexedDB cached).
3. **Random move injection** — at L1/L2/L3 only. Probabilistic (30%/15%/5%). Picks uniformly from all legal moves. This is how we get sub-1000 effective ELO — vanilla Stockfish can't play that weakly on its own.
4. **Stockfish sampled** (`lib/stockfish/stockfish-adapter.ts::getBestMoveSampled`) — MultiPV top-N candidate pool. L1–L6 take a uniform random pick from the top `poolSize`. L7–L10 use **eval-gated sampling**: a `tolerance` (cp) picks uniformly among every candidate within that many centipawns of the best move. Handles everything that falls through 1–3.

### Engine configs per level
Source: `lib/rookie-levels.ts::ENGINE_CONFIGS`.

| Level | Engine | Skill | Depth | Pool | Random % | Tolerance (cp) | Nominal ELO |
|---|---|---|---|---|---|---|---|
| 1 | SF sampled | 0 | 3 | 8/8 | 30% | — | 200 |
| 2 | SF sampled | 0 | 3 | 8/8 | 15% | — | 400 |
| 3 | SF sampled | 1 | 4 | 5/6 | 5% | — | 600 |
| 4 | SF sampled | 3 | 5 | 4/4 | — | — | 800 |
| 5 | Maia eloSelf=1300 | — | — | — | — | — | 1000 |
| 6 | Maia eloSelf=1500 | — | — | — | — | — | 1200 |
| 7 | SF sampled | 14 | 12 | 3/3 | — | 60 | 1400 |
| 8 | SF sampled | 16 | 12 | 3/3 | — | 50 | 1600 |
| 9 | SF sampled | 18 | 13 | 3/3 | — | 40 | 1800 |
| 10 | SF sampled | 20 | 14 | 3/3 | — | 30 | 2000 |

**Eval-gated sampling (L7–L10):** these levels were `poolSize:1` = pure argmax, so identical play produced byte-identical games every time (and Rookie's speech, keyed to game state, repeated too). Now they sample uniformly among moves within `tolerance` cp of the best. One clearly-best move → she plays it; near-equal moves → she varies. Strength holds (she never picks a meaningfully worse move) but games diverge wherever a real choice exists. Tolerance tightens as the level climbs.

"Nominal ELO" is the label shown in `ROOKIE_LEVELS`. Effective strength is usually +100–300 above nominal at the low end because of Stockfish's implicit floor.

### Maia specifics
- Loads on page mount (`maia.init()`) — spins up worker, no download yet.
- Download triggers when user selects L5 or L6 (`maia.ensureReady()`).
- Uses weighted-random sampling over the policy (never argmax) so Rookie doesn't play identical games from identical positions.
- Falls through to Stockfish sampled if Maia returns null or isn't ready.

### Hard rules
- **Never bring back minimax.** The old `lib/rookie-engine.ts` was deleted for a reason — "3 perfect moves then hangs a queen" is the worst possible beginner feel.
- **Never raise L10's depth above 14.** Without that cap, unrestricted Stockfish 18 plays ~2800+ and nobody can beat L10. Current L10 targets ~2100 (strong club / weak expert).
- **Never skip the opening book at L1–L3.** Beginners still see plausible openings; the *middlegame* is where the 30% random move kicks in.
- **Never make `poolSize > multiPV`.** It's clamped at runtime but the config should match.
- **Never put L7–L10 back to pure argmax** (`poolSize:1` / `multiPV:1` with no `tolerance`). That is the "identical game every time" bug — Stockfish is deterministic, so argmax replays the same game (and the same speech) against the same play. Keep eval-gated `tolerance` with `multiPV >= 2`.

### Dev-only tools
- `/play` floating bottom-right panel (`process.env.NODE_ENV === 'development'` only): engine log per move + 1–10 level picker.
- Clickable level numbers above the progress bar (also dev-only).

---

## 49. Rookie's Run (/run)

**Goal:** A daily roguelike chess puzzle. Rookie spawns on rank 1 and must reach rank 8, advancing level-by-level through a themed run of 10 levels.

### Architecture (single source of truth)
- **Page:** `app/run/page.tsx` — single client component, all state.
- **Engine:** `lib/run/engine.ts` — pure state transitions (Rookie move → enemy move → status check).
- **Movement:** `lib/run/movement.ts` — legal-move generation per form.
- **Enemy AI:** `lib/run/pawn-ai.ts` — handles pawn/knight/bishop/queen behavior + rabid-piece overrides + per-turn ticks for freeze/poison/rabies/decoy timers.
- **Abilities:** `lib/run/abilities.ts` — 12 shipped ability defs, tier ladders, activation/resolution. Tempo fills → offer rolls → permanent for the run.
- **Runs:** `lib/run/runs.ts` — `RUNS` array: Daily Climb + 5 themed runs (Knight Academy, Bishop's Path, Speed Demon, Hazard Maze, Boss Gauntlet). Each is 10 levels.
- **Daily levels:** `lib/run/daily-levels.ts` — the 10 Daily Climb level builders (`DAILY_LEVELS`). Imported by `runs.ts` only.
- **Seed:** `lib/run/seed.ts` — deterministic per-date PRNG → Rookie's starting file (b–g).
- **Scoring/share:** `lib/run/scoring.ts`, `lib/run/share.ts`.
- **History:** `lib/run/history.ts` — local run-history persistence for the picker/vault.

### Hard rules
- **`RunDef.levels` is the only level source.** Never add a parallel level array or builder index outside `lib/run/`.
- **Rookie always starts rank 1, file b–g** (never the corner files a or h).
- **Same date → same starting file** for every run that day. Levels themselves don't change between players on the same day.
- **Forms unlock by level**, defined by `allowedForms` on each puzzle. Daily Climb: rook L1–3, knight unlock L4, bishop unlock L7.
- **Move limit is optional per level.** When set, the TempoBar counts down. Run out → fail level.
- **Run progression:** completing a run advances `currentRunId` in localStorage and the SummaryModal shows a "Next Run" CTA cycling through `RUNS`.
- **Ghost-blocker rule (fair-play, enemies-per-turn ≥ 2):** When multiple enemies move in one turn, every enemy after the first treats the *original* squares of pieces that already moved this turn as still occupied. No slider can pass through them, no knight can land on them, no pawn can advance into them. The player only ever needs to plan from the board they saw at the start of the turn. Tracked in `BoardState.enemyVacatedSquares`, cleared when control returns to Rookie.
- **Shipped abilities (13):** bishop-step, knight-hop, queen-pulse, become-king, freeze-ray, poison-dart, rabies-dart, convert, drones, squad, surge, aegis, decoy. The 22 candidate abilities (queenkiller + 21 from the 2026-05-13 batch), `detonate`, `pawn-charge`, `phase-step`, and `leap` were removed — do not re-introduce. New abilities ship from `ABILITY_DEFS` straight into `SHIPPED_ABILITY_IDS` (which is now an alias for `ALL_ABILITY_IDS`).
- **Line-of-sight rule (dart abilities):** Freeze Ray, Poison Dart, and Rabies Dart can only target enemies Rookie can currently *see* — i.e. an enemy that sits on a square in `rookieLegalMoves(state)` for her current form. Rays stop at the first piece, so a piece behind a blocker is not a legal dart target. If Rookie transforms, her sight changes (knight = L-squares, bishop = diagonals, queen = everything). Computed via `visibleEnemySquares(state)`.
- **Status markers travel with the piece.** Poisoned, rabid, and frozen entries are keyed by algebraic square. When a piece moves the marker follows (`relocateStatusMarkers`); when a piece dies the marker clears (`clearStatusOnSquare`). End-of-enemy-turn ticks each timer down by 1; poisoned pieces hitting 0 die and grant tempo as a normal capture; rabid pieces hitting 0 revert to normal AI.
- **Rabid action priority:** A rabid piece, on its turn, tries to capture the nearest entity (Rookie + every other enemy). On Chebyshev ties the biggest piece wins (Rookie counts as queen-tier). If no capture is reachable this turn it approaches the top-priority target with a non-capture move. Rabid pieces are picked *before* normal Rookie-capture priority in `chooseEnemyAction`. Rabid-on-friendly is friendly fire — the victim dies, Rookie banks the capture (tempo + share), the rabid piece keeps its mark.

### Files / dirs that should NOT exist (cleaned up 2026-05-12)
- ~~`components/run/levels/`~~ — moved to `lib/run/daily-levels.ts`.
- ~~`components/run/CapturedModal.tsx`~~, ~~`EscapedModal.tsx`~~, ~~`TransformButtons.tsx`~~ — superseded by `RunSummaryModal` and auto-transform UX.

### Daily ritual (added 2026-05-18 when Rookie's Run replaced Daily Rook)

- **Today's run mapping:** `lib/run/daily.ts` → `getRunIdForDate(yyyyMmDd)` is a deterministic rotation across the non-STC entries of `RUNS`. Anchored to `2026-01-01`. STC runs are excluded — they live behind `/run/stc` only.
- **Day boundary is the user's local TZ**, never server UTC. Resolved via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- **`/run`** defaults to today's mapping for fresh visitors and STC fallbacks. An explicit `?run=` or a non-STC value in `localStorage.rookies-run-current` still wins — daily mapping is the default, not a lock.
- **`/run/[date]`** is a server-component redirect: validates the date, rejects future or garbage to `/run`, else forwards to `/run?date=YYYY-MM-DD&run=<daily-runId>`.

### Completion + streak (foundation only — UI not mounted yet)

- **Table:** `run_completions` (`user_id`, `run_date`, `run_id`, `levels_cleared`, `tz`, `completed_at`). PK `(user_id, run_date)` — idempotent upsert. RLS: user reads/writes own rows.
- **"Completed"** = cleared every level of the run (binary, not partial).
- **POST `/api/run/complete`** records the completion. Auth required server-side; anonymous callers receive 200 silently (page plays, nothing recorded).
- **Only the canonical daily for that date records.** STC runs and hand-picked non-daily runs are intentionally silent — they do not contribute to a streak.
- **GET `/api/run/streak?tz=...`** returns `{ current, longest, completedToday }`. Streak is **derived** on every read by walking back from today (in user TZ) until the first gap. **Never stored.** Past streak bugs all traced to stored counters drifting from the source of truth.
- **No shields, freezes, backfills, or grace periods.** Each one is a known streak-bug vector. Add only if retention data demands it.
- **Anonymous users do not have streaks.** UI for streak/vault gates on auth. This kills the entire anonymous-merge bug class.
- **Components shipped, unwired (2026-05-18):** `components/run/StreakChip.tsx`, `components/run/VaultList.tsx`. Completion POST is wired so history accumulates; mount UI when ready.

---

## 50. Responsive Design (Mobile / iPad / Desktop)

**Status:** Core rule — applies to EVERY production page and component. Part of the 10K DAU mandate: the site must feel intentional on a phone, an iPad, and a laptop. No page ships looking like a phone layout floating in desktop whitespace.

### The model: scaled centered column

We are mobile-first with ONE column everywhere. We do **not** build separate desktop layouts (no sidebars, no 2-up content reflows). On bigger screens the same column simply gets a comfortable max-width and larger board/type. This matches Duolingo and keeps all 67 pages consistent and cheap to maintain.

```
Phone   (<640px):  full-width column, edge padding
iPad    (≥768px):  same column, wider cap, bigger board + type
Desktop (≥1024px): same column, capped, centered, never sprawling
```

### The three breakpoints (only these)

Tailwind v4 defaults. Use ONLY these three prefixes for layout — do not invent custom pixel breakpoints for page layout.

| Prefix | Min width | Target device |
|--------|-----------|---------------|
| (none) | 0 | Phone (design here first) |
| `md:` | 768px | iPad / small tablet |
| `lg:` | 1024px | Laptop / desktop |

`sm:` and `xl:` are allowed for fine-tuning but are not required. Always design the **base (no-prefix) styles for the phone**, then layer `md:` and `lg:` on top.

### Container width — the standard scale

The global `<main>` is capped at `max-w-3xl` (768px) and centered. **Page content must live inside one of these standard caps** — stop hand-picking widths per page:

| Content type | Width class |
|--------------|-------------|
| Reading / forms / lessons / single-board flows | `max-w-md md:max-w-lg` |
| Wider content (path, dashboards, lists) | `max-w-lg md:max-w-2xl` |
| Full-bleed marketing / landing sections | `w-full` (manage inner padding) |
| Admin / data tables (internal only) | `max-w-5xl` to `max-w-7xl` |

Every page wrapper gets `mx-auto w-full px-4 md:px-6`. Never let content touch the screen edge on phone; never let it sprawl on desktop.

### The chess board

The board is the most size-sensitive element. It must scale with the viewport, never overflow, never force horizontal scroll.

- Board container: `w-full max-w-[min(92vw,440px)] md:max-w-[520px] mx-auto aspect-square`.
- Always use the `ChessPathBoard` wrapper (it already handles square sizing) — never raw `Chessboard`.
- On phone the board fills the column with a little breathing room; on iPad/desktop it caps so it doesn't become comically large.

### Touch targets & type

- **Interactive elements ≥ 44×44px** on touch (`min-h-[44px]`, adequate padding). This is non-negotiable for mobile.
- Type may step up one notch on desktop where it helps readability: `text-base md:text-lg` for body, `text-2xl md:text-3xl` for page titles. Don't over-scale.

### Test-page exception

Test pages (`/test/*`, `/test-*`) still require `overflow-auto` on their container (body is `overflow: hidden` globally). They are exempt from the column standard but should still not break on mobile.

### Definition of done (every page must pass)

A page is **not** responsive-complete until it passes all four:

1. **No horizontal scroll** at 360px, 768px, and 1280px widths.
2. **Content is centered and capped** at iPad/desktop — no phone-column-in-whitespace, no edge-to-edge sprawl.
3. **Board (if present) scales** and never overflows the column.
4. **All tap targets ≥ 44px**; nothing is clipped or overlapping at any of the three widths.

### How to verify

```bash
./scripts/ensure-dev.sh && open http://localhost:3000/{page}
```

Then resize the browser through phone (360px) → iPad (768px) → desktop (1280px). Chrome DevTools device toolbar covers all three.

---

*This document is the source of truth. If code disagrees with this document, either the code is wrong or this document needs updating. There is no third option.*
