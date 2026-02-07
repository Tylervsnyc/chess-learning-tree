# RULES.md - The Chess Path Source of Truth

**This document defines how The Chess Path works.** Every behavior, limit, and interaction is documented here. When in doubt, this document is correct.

Last Updated: 2026-02-07

---

## Table of Contents

1. [User Types](#1-user-types)
2. [Lesson Unlocking](#2-lesson-unlocking)
3. [Level Unlocking](#3-level-unlocking)
4. [Navigation After Lesson Complete](#4-navigation-after-lesson-complete)
5. [Scroll Behavior on /learn](#5-scroll-behavior-on-learn)
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
25. [Quip System](#25-quip-system)
26. [Quip Content Guidelines](#26-quip-content-guidelines)
27. [Lesson/Level/Block Naming](#27-lessonlevelblock-naming)
28. [Intro Messages](#28-intro-messages)
29. [Adding New Levels Checklist](#29-adding-new-levels-checklist)
30. [Work In Progress (WIP)](#30-work-in-progress-wip)
31. [Puzzle Share Feature](#31-puzzle-share-feature)
32. [SEO & Marketing](#32-seo--marketing)
33. [Daily Maintenance Check](#33-daily-maintenance-check)

---

## 1. User Types

There are exactly **four** user types:

| Type | Can Do Lessons | Limit | Progress Storage |
|------|----------------|-------|------------------|
| **Anonymous** | Yes | 2 total, then signup prompt | localStorage only |
| **Free** | Yes | Unlimited (limits currently disabled) | localStorage + Supabase |
| **Premium** | Yes | Unlimited | localStorage + Supabase |
| **Admin** | Yes | Unlimited, ALL lessons unlocked | localStorage + Supabase |

### Key Behaviors:
- Anonymous progress transfers to account on signup
- Signup prompt every 2 lessons for anonymous users (dismissible, not blocking)

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

### Enforced In (ONE place only):
`/hooks/useProgress.ts` → `isLessonUnlocked()`

### Visual States:
| State | Appearance | Click Action |
|-------|------------|--------------|
| Locked | Gray, lock icon | Show "Complete previous lesson" toast |
| Unlocked | Colored (faded), no ring | Navigate to lesson |
| Completed | Gold, checkmark sparkles | Navigate to lesson (replay) |
| Current | Colored, pulsing ring | Navigate to lesson |
| Completed + Current | Gold, checkmark sparkles, pulsing ring | Navigate to lesson (replay) |

**Note:** The pulsing ring always shows on `currentPosition`, even if that lesson is completed. This indicates "you are here" in the curriculum.

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
4. On "Continue" button click → `/learn`
5. `/learn` page reads `currentPosition` and auto-scrolls to that lesson

### Key Point:
No URL params needed. The `currentPosition` field stored in the database determines where the user lands on `/learn`.

### Enforced In (ONE place only):
`/components/lesson/LessonCompleteScreen.tsx` → Continue button onClick handler

---

## 5. Scroll Behavior on /learn

### The Rules:
| Scenario | Behavior |
|----------|----------|
| Section expand/collapse | **NO scrolling. Ever.** Just toggle. |
| Opening /learn | Expand section containing `currentPosition`, scroll to it |

### The `currentPosition` Field:
- Stored in `profiles.current_position` (database)
- Represents where the user IS in their journey
- Updated when: lesson completes (→ next lesson), level test passes (→ first lesson of new level)
- Server is source of truth

### Critical:
- **NO FALLBACK BEHAVIOR** - Code must guarantee target exists
- **NO URL PARAMS** - Use `currentPosition` from hook, not URL params
- **WAIT FOR SERVER DATA** - Don't render/scroll until `serverFetched` is true (prevents flash to default position)
- Enforced in ONE `useEffect` in `/app/learn/page.tsx`

### Sticky Headers:
| Element | Position | Z-Index | Behavior |
|---------|----------|---------|----------|
| Nav header | `sticky top-0` | `z-50` | Always visible at top |
| Level header | `sticky top-2` | `z-40` | Sits just below nav header with small gap |

The level header sits just below the nav header with a small gap, keeping both visible and accessible.

### Implementation:
```typescript
// In /app/learn/page.tsx - the ONLY place this happens
useEffect(() => {
  // Wait for BOTH local AND server data before scrolling
  if (!progressLoaded || !serverFetched || !currentPosition) return;

  // Expand the section containing currentPosition
  // Poll for element existence, then scroll
}, [progressLoaded, serverFetched, currentPosition]);
```

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

### Current Status:
**DISABLED** via `FEATURE_FLAGS.ENABLE_LESSON_LIMITS = false`

### When Enabled:
| User Type | Limit | Reset |
|-----------|-------|-------|
| Anonymous | 2 total | Never (must sign up) |
| Free | 2 per day | Midnight UTC |
| Premium | Unlimited | N/A |
| Admin | Unlimited | N/A |

### Enforced In:
`/hooks/usePermissions.ts`

### Config:
`/lib/config/feature-flags.ts`

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
- Shown in header on `/learn` and `/daily-challenge`

### Stored In:
```sql
profiles.current_streak       -- Current count
profiles.last_activity_date   -- YYYY-MM-DD format
```

---

## 12. The Daily Rook

### Header Toggle:
`[Path] [Daily]` toggle - only shown on `/learn` and `/daily-challenge`

### Core Rules:
| Rule | Value |
|------|-------|
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
| Background | `#1A2C35` (lighter dark) |
| Cards | `#131F24` (darker) |
| Brand logo | chesspath logo + wordmark above title |
| Header (playing) | Orange-red gradient bar with lives, timer, solved count |
| Board | Fixed position, doesn't shift when UI updates |

### Ready Screen:
- 5 Minutes on the Clock
- Puzzles Get Harder
- 3 Mistakes and You're Out
- Compete Globally

### Playing Screen:
- Lives (hearts) - top bar
- Timer (countdown) - top bar
- Puzzle counter ("Puzzle X / 20") - above board
- "White/Black to move" indicator
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
| Pass requirement | 2 or fewer wrong |
| Must complete | All 10 puzzles |
| Retry | Unlimited, immediate |

### On Pass:
1. Level unlocks
2. All previous lessons unlock
3. `currentPosition` set to first lesson of new level
4. Navigate to `/learn` (auto-scrolls to currentPosition)

### Enforced In:
`/app/level-test/[transition]/page.tsx`

### Stored In:
`profiles.unlocked_levels`

---

## 15. Pages

| Page | Status | Purpose |
|------|--------|---------|
| `/` | KEEP | Landing (new users) or redirect to /learn (returning) |
| `/about` | KEEP | Step 2 of new user flow |
| `/learn` | KEEP | Main curriculum tree |
| `/lesson/[lessonId]` | KEEP | Puzzle solving |
| `/level-test/[transition]` | KEEP | Level unlock tests |
| `/daily-challenge` | KEEP | The Daily Rook mode |
| `/pricing` | KEEP | Subscription (always accessible) |
| `/auth/login` | KEEP | Login |
| `/auth/signup` | KEEP | Signup |
| `/admin/*` | KEEP | Admin tools |
| `/workout` | **DELETE** | Not needed |
| `/profile` | **DELETE** | Not needed yet |

### User Flows:
- **New user**: `/` → `/about` → `/learn`
- **Returning user**: `/` → redirect to `/learn`

---

## 16. Header

### Scroll Behavior:
**Header is sticky** - stays fixed at top of viewport when scrolling. This allows users to access the Daily Rook toggle without losing their place in the curriculum.

### Logo Rules:
- **Icon**: Colorful rook made of 22 dots (5 columns × 6 rows)
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
- **Landing page (`/`) MUST use animated logo** - not the static SVG
- Props: `theme="light"|"dark"`, `size="sm"|"md"|"lg"`, `iconOnly`, `autoPlay`
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
  - `/learn` - curriculum tree needs to scroll
  - `/test-*` pages - test pages often have lots of content

### Elements by Location:

| Element | Where Shown | Links To |
|---------|-------------|----------|
| Logo | All pages | `/learn` (logged in), `/` (logged out) |
| Learn/Path button | All pages | `/learn` |
| Daily button | All pages | `/daily-challenge` |
| Premium button | All pages (non-premium, non-admin) | `/pricing` (logged in), `/premium-signup` (logged out) |
| Signup button | All pages (logged out) | `/auth/signup` |
| Logout button | All pages (logged in) | Signs out |
| Streak counter | `/learn`, `/daily-challenge` (logged in only) | Nothing |

**Note:** Logged-in users see "Path", logged-out users see "Learn" - same destination, different label.

### Learn/Daily Button Styling:

| Button | Color | Always Visible |
|--------|-------|----------------|
| Learn/Path | Green (`#58CC02`) | Yes |
| Daily | Blue gradient (`#1CB0F6` → `#0d9ee0`) + shimmer animation | Yes |

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
- Back to `/learn`
- **No partial save**

### Completion:
1. `currentPosition` updates to next lesson
2. `LessonCompleteScreen` renders with animated rook celebration, confetti, sound, score, quote
3. Continue button → `/learn` (always returns to curriculum tree)

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
When a user completes a lesson (any score), `LessonCompleteScreen` renders with:

1. **Animated rook** — random celebration animation at 1.8x scale
2. **Confetti** — two bursts from left and right corners (gold for perfect, green/blue otherwise)
3. **Celebration sound** — C Major arpeggio via `playCelebrationSound()`
4. **Score** — `correctCount/6` with tier label (Perfect / Great / Complete)
5. **Quote** — random funny quote from `/data/celebration-quotes.ts` (300 total, tiered by score)
6. **Stats cards** — first-try correct count + accuracy percentage
7. **Continue button** — always returns to `/learn` (curriculum tree)
8. **Guest signup prompt** — shown if user is not logged in

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
- On click: Navigate to `/learn?level={levelKey}` (or with `?guest=true` prefix for guests)
- Active state: `translateY(2px)` + reduced shadow
- Does NOT go to next lesson — always returns to curriculum tree

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

## 18. Puzzle Interaction

### Input Methods:
- Click-click: Supported
- Drag-drop: Supported

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

### Events Tracked:
- `lesson_started`
- `lesson_completed`
- `puzzle_attempted`
- `daily_challenge_started`
- `daily_challenge_ended`
- `level_test_started`
- `level_test_completed`
- `signup`
- `subscription_started`

---

## 22. Feature Flags

**File**: `/lib/config/feature-flags.ts`

| Flag | Value | Description |
|------|-------|-------------|
| `ENABLE_LESSON_LIMITS` | `false` | Daily lesson limits |
| `ANONYMOUS_LESSON_LIMIT` | `2` | Total lessons before signup prompt |
| `FREE_DAILY_LESSON_LIMIT` | `2` | Daily limit for free users |
| `SHOW_PREMIUM_UPSELLS` | `false` | Premium upsell prompts |
| `PROMPT_SIGNUP_EVERY_N_LESSONS` | `2` | Signup prompt frequency |
| `ENABLE_DAILY_CHALLENGE` | `true` | Daily challenge feature |
| `ENABLE_STREAKS` | `true` | Streak tracking |

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

puzzle_history
  id, user_id, puzzle_id, seen_at
  -- Cleanup: delete rows older than 90 days

quip_history
  id, user_id, quip_id, seen_at

email_preferences
  id, user_id, streak_reminders, weekly_digest, marketing, created_at, updated_at
  -- User opt-in/out for different email types

email_log
  id, user_id, email_type, sent_at
  -- Tracks sent emails to prevent spam
```

### Columns/Tables to DELETE:
- `theme_performance` table
- `profiles.elo_rating`
- `profiles.current_level`

---

## 24. Puzzle Selection

### Pre-computed Pools:
- Location: `/data/lesson-pools/{lessonId}.json` (e.g., `1.3.2.json`)
- Count: 40 puzzles per lesson pool
- Verified at build time to match criteria

### On Lesson Start:
1. Load pool file
2. Filter out recently seen (puzzle_history, last 30 days)
3. Pick 6 random: 2 easy, 3 medium, 1 hard
4. Record seen puzzles to puzzle_history

### Edge Case:
If all 40 seen in last 30 days → include oldest seen

---

## 25. Quip System

### Quip ID Format:
`{level}.{section}.{type}.{number}`

### Examples:
- `1.1.g.01` - General quip
- `2.6.fork.03` - Fork-specific quip
- `5.12.mateIn2.07` - Mate in 2 specific quip

### Tracking:
Store seen quips in `quip_history` table

### Selection Priority:
1. Section + theme specific quips
2. Global theme pool
3. Block general quips
4. Reset and start over

### Global Theme Pools Needed:
| Theme | Minimum Count |
|-------|---------------|
| checkmate | 100+ |
| mateIn1 | 50+ |
| mateIn2 | 50+ |
| fork | 50+ |
| pin | 50+ |

---

## 26. Quip Content Guidelines

### DO:
- Playful, witty, confident
- Trash talk (friendly)
- Chess puns
- Pop culture references
- Heist/thievery metaphors
- Sports metaphors

### DON'T:
- Violence/death language
- Mean insults
- Anything inappropriate for kids
- Bullying
- Real people
- Swearing
- Cheesy emojis (no 🔥💪🏆✨ etc. in UI)

### Words to REMOVE from app:
- suffocated
- death
- dead
- killed
- murdered
- destroyed (in violent context)

---

## 27. Lesson/Level/Block Naming

### Lesson Names:
Current names are good - keep them

### Level Names (Movie Spoofs):
| Level | Name |
|-------|------|
| 1 | Begin to Believe |
| 2 | One Does Not Simply Win at Chess |
| 3 | We Need to Go Deeper |
| 4 | I Am the One Who Knocks |
| 5 | No Country for Beginners |

### Level Card Display Rule:
- The `name` field in curriculum data is the movie spoof name ONLY (e.g., `"Begin to Believe"`, NOT `"Level 1: Begin to Believe"`)
- The sticky level header has a colored badge that says "Level {number}" — the name next to it is ONLY the movie spoof title
- The locked level card shows the movie spoof name as its heading — no separate "Level X" text
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
   - Structure: 4 blocks, 4 sections each, 4 lessons each

2. **Register in curriculum registry**
   - `/lib/curriculum-registry.ts`

3. **Ensure puzzle CSVs exist**
   - For the rating range

4. **Generate puzzle pools**
   - Output to `/data/lesson-pools/`

5. **Add level test config**
   - `/data/level-unlock-tests.ts`

6. **Add quips**
   - Section quips
   - Global theme quips

7. **Use unique section IDs**
   - Dot notation: `N.1`, `N.2`, `N.3`, etc.

8. **Follow content guidelines**
   - No death/violence language

9. **Test everything**

---

---

## 30. Work In Progress (WIP)

**Last updated: 2026-02-07**

This section tracks features currently being tested on localhost:3000 before pushing to production.

### 30.1 Share System

**Status:** ✅ Complete — server-side OG image generation

**Two sharing systems:**

**A. Daily Rook Story Card** (9:16, 1080×1920 — see Section 31 for full spec)
- Server-side OG route renders card → client fetches as blob → Web Share API or download
- Pre-fetched on game finish for instant sharing when user taps button
- Entry points: "Share Card" button, "Copy Rook" (emoji text), link icon (clipboard URL)

**B. Puzzle Share Card** (1:1, 1080×1080)
- Client-side html-to-image generation
- Shows puzzle position with "I SOLVED this tricky puzzle" + "SWIPE TO SEE THE SOLUTION"
- Entry point: Puzzle success popup share button

**Files:**
| File | Purpose |
|------|---------|
| `app/api/og/daily-challenge/route.tsx` | Daily Rook story card (server-side) |
| `app/api/og/lesson/route.tsx` | Lesson share card (server-side) |
| `components/share/ShareButton.tsx` | Puzzle share button + generation trigger |
| `components/share/PuzzleShareCard.tsx` | Puzzle image card design |
| `lib/share/generate-puzzle-image.ts` | Puzzle card → PNG (client-side) |
| `lib/share/generate-share-text.ts` | Emoji rook text for clipboard |
| `lib/share/piece-svgs.ts` | SVG chess pieces for OG images |

**Test pages:** `/test-share` (puzzles), `/test-story-cards` (Daily Rook)

---

### 30.2 The Daily Rook

**Status:** ✅ Complete — full flow with sharing, leaderboard, rook visualization

All features implemented and tested:
- [x] Leaderboard API works with real user data
- [x] Score recording to `daily_challenge_results` table
- [x] Share button on results screen (3 share options)
- [x] Same puzzles for different users on same day (date-seeded)
- [x] Split-screen rook visualization (DailyRookDisplay component)
- [x] Pre-fetched share image for instant sharing

**Files:** See Section 12 for full spec.

**To test:**
- Visit `/daily-challenge` — full flow: start → solve → finish → share
- Use `?testSeed=123` to get different puzzle sets for testing

---

### 30.3 Header Buttons

**Status:** ✅ Complete

All features implemented:
- [x] Learn/Daily buttons shown for ALL users (logged in + logged out)
- [x] Premium button hides for premium/admin users
- [x] Single-word labels, no text wrapping on mobile

**File:** `components/layout/NavHeader.tsx`

---

### 30.4 Other Test Pages (Exploratory)

These pages exist for design exploration but aren't production features yet:

| Page | Purpose |
|------|---------|
| `/test-share` | Puzzle share card preview |
| `/test-story-cards` | Daily Rook story card preview |
| `/test-level-designs` | Level design exploration |
| `/test-share-cards` | Share card variations |

---

### Quick Resume Checklist

When resuming work:

1. **Start dev server:** `npm run dev`
2. **Test Daily Rook:** `/daily-challenge` — full flow: start → solve → finish → share
3. **Test share cards:** `/test-story-cards` — verify OG image renders
4. **Test puzzle sharing:** `/test-share` — try generating PNG
5. **Check console:** Look for any errors during testing

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

## 32. SEO & Marketing

### Target Audience

**Primary:** Dads aged 25-50 who want to beat their friends/kids at chess
**Secondary:** Kids learning through schools or parents

### Brand Positioning

- "The shortest path to chess improvement"
- "Beat your friends at chess"
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
description: 'The shortest path to chess improvement'
```

**Page-Specific (override in each page.tsx):**

| Page | Title | Description |
|------|-------|-------------|
| `/` | The Chess Path - Beat Your Friends at Chess | Learn chess tactics in 15 min/day. The fastest way to stop losing and start winning. |
| `/learn` | Learn Chess Tactics \| Chess Path | Master chess tactics step by step. From beginner to beating your friends. |
| `/daily-challenge` | The Daily Rook \| The Chess Path | Test your skills with 22 puzzles. Compete on the leaderboard. |
| `/pricing` | Chess Path Premium - Unlimited Tactics Training | Unlock all lessons, remove limits, accelerate your chess improvement. |

### Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Global meta tags, OpenGraph, Twitter cards |
| `app/sitemap.ts` | Dynamic sitemap for Google |
| `app/robots.ts` | Search engine crawl rules |
| `public/og-image.png` | Default social share image (1200x630) |

### OpenGraph Image

- Size: 1200x630px
- Shows: Logo + tagline + chess visual
- Location: `/public/og-image.png`
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

## 33. Daily Maintenance Check

### What It Does
Automated health check script that validates curriculum, puzzles, quips, and database connectivity.

### How to Run
```bash
npx ts-node scripts/maintenance-check.ts        # Report only
npx ts-node scripts/maintenance-check.ts --fix  # Auto-fix missing puzzle files
```

### The 7 Checks

| Check | What It Validates | Auto-Fix? |
|-------|-------------------|-----------|
| **Lesson Puzzles** | Every lesson has puzzle files with sufficient puzzles in rating range | Yes |
| **Daily Rook** | All 5 rating bracket files exist and have puzzles | No |
| **Quip Coverage** | All sections have quip responses | No |
| **Puzzle File Integrity** | JSON files parse correctly, puzzles have required fields | No |
| **Lesson ID Uniqueness** | No duplicate lesson IDs across curriculum | No |
| **Database Connectivity** | Can connect to Supabase and query profiles | No |
| **Feature Flags** | All flags have valid boolean values | No |

### Output Format
```
=== Chess Path Maintenance Check ===
Running at: 2026-02-04T12:00:00.000Z

✓ Check 1: Lesson Puzzle Availability
  └─ 278 lessons checked, 0 issues

✗ Check 2: Daily Rook Files
  └─ Missing: 0800-1200.json

...

=== Summary ===
Passed: 6/7
Failed: 1/7
```

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
- When puzzles seem to be missing

---

## Appendix A: Quick Reference - Where Things Are Enforced

| Behavior | Enforced In (ONE place) |
|----------|-------------------------|
| Lesson unlocking | `/hooks/useProgress.ts` → `isLessonUnlocked()` |
| Level unlocking | `/hooks/useProgress.ts` → `isLevelUnlocked()` |
| Current position tracking | `/hooks/useProgress.ts` → `currentPosition` + `setCurrentPosition()` |
| Scroll behavior | `/app/learn/page.tsx` → ONE useEffect |
| Navigation after lesson | `/components/lesson/LessonCompleteScreen.tsx` → Continue button |
| Permissions/limits | `/hooks/usePermissions.ts` |
| Header | `/components/layout/NavHeader.tsx` |
| Quips | `/data/staging/v2-puzzle-responses.ts` |
| Feature flags | `/lib/config/feature-flags.ts` |
| Curriculum | `/lib/curriculum-registry.ts` |
| Maintenance checks | `scripts/maintenance-check.ts` |
| Daily challenge puzzles | `/data/daily-challenge-puzzles.json` |
| Progress bar (lessons/tests) | `/components/puzzle/ChessProgressBar.tsx` |

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

---

*This document is the source of truth. If code disagrees with this document, either the code is wrong or this document needs updating. There is no third option.*
