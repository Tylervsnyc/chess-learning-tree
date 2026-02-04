# RULES.md - The Chess Path Source of Truth

**This document defines how The Chess Path works.** Every behavior, limit, and interaction is documented here. When in doubt, this document is correct.

Last Updated: 2026-02-04

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
12. [Daily Challenge](#12-daily-challenge)
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
| Unlocked | Colored, no icon | Navigate to lesson |
| Completed | Colored, checkmark | Navigate to lesson (replay) |
| Current | Colored, pulsing | Navigate to lesson |

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
2. Show completion popup with stats
3. On "Continue" button click:
   - If next lesson exists AND is unlocked → `/learn?scrollTo={nextLessonId}`
   - If last lesson of level → Next level unlocks → `/learn?scrollTo={firstLessonOfNextLevel}`
   - If last lesson of app → `/learn?scrollTo={lastLessonId}`

### Enforced In (ONE place only):
`/app/lesson/[lessonId]/page.tsx` → Continue button onClick handler

---

## 5. Scroll Behavior on /learn

### The Rules:
| Scenario | Behavior |
|----------|----------|
| Section expand/collapse | **NO scrolling. Ever.** Just toggle. |
| Returning from lesson (URL has `scrollTo`) | Expand section, scroll to lesson |
| Opening /learn fresh (no URL param) | Scroll to last completed lesson |

### Critical:
- **NO FALLBACK BEHAVIOR** - Code must guarantee target exists
- Enforced in ONE `useEffect` in `/app/learn/page.tsx`

### Sticky Headers:
| Element | Position | Z-Index | Behavior |
|---------|----------|---------|----------|
| Nav header | `sticky top-0` | `z-50` | Always visible at top |
| Level header | `sticky top-10` | `z-40` | Tucks slightly behind nav header |

The level header overlaps the nav header slightly, creating a layered effect while keeping nav buttons accessible.

### Implementation:
```typescript
// In /app/learn/page.tsx - the ONLY place this happens
useEffect(() => {
  const scrollTo = searchParams.get('scrollTo');
  if (scrollTo) {
    // Expand the section containing this lesson
    // Scroll to the lesson element
  } else if (lastCompletedLessonId) {
    // Scroll to last completed
  }
}, [searchParams, lastCompletedLessonId]);
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
Complete **1 lesson OR 1 daily challenge** per day

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

## 12. Daily Challenge

### Header Toggle:
`[Path] [Daily]` toggle - only shown on `/learn` and `/daily-challenge`

### Core Rules:
| Rule | Value |
|------|-------|
| Timer | 5 minutes |
| Lives | 3 (3 wrong = out) |
| Puzzles | 20 total |
| Difficulty | Progressive: 400 → 2600 ELO (hidden from user) |
| Correct answer | Advance to next puzzle |
| Wrong answer | Lose a life, advance to next puzzle |
| Same puzzles for all users | Yes (seeded by date) |
| **Once per day** | Users can only play once per day. Returning shows results. |

### How It Works:
- Display shows "Puzzle X / 20" (no ELO shown to users)
- Puzzles get progressively harder behind the scenes
- Rating targets: 400-550, 500-650, 600-750... up to 2300-2600
- Goal: How many can you solve in 5 minutes?

### Puzzle Selection (Pre-generated):
```
/api/daily-challenge/puzzles
```
- **Puzzles are pre-generated** in `data/daily-challenge-puzzles.json`
- 90 days of coverage, regenerate with: `npx ts-node scripts/generate-daily-puzzles.ts`
- Uses date-seeded random number generator (same puzzles for everyone)
- 20 deliberate rating targets spanning 400-2600 ELO
- Prioritizes tactical themes (forks, pins, mates) over endgames
- Each puzzle comes from a different theme when possible

### Rating Brackets Used:
| Bracket | Puzzles | Rating Range |
|---------|---------|--------------|
| 0400-0800 | 1-4 | 400-850 |
| 0800-1200 | 5-8 | 800-1250 |
| 1200-1600 | 9-12 | 1200-1650 |
| 1600-2000 | 13-16 | 1600-2050 |
| 2000-plus | 17-20 | 2000-2600 |

### End Conditions:
- Complete all 20 puzzles, OR
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
| "DAILY CHALLENGE" title | Nunito font, font-black, gradient text (orange→red), in gradient box with orange border |
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

### Daily Challenge Leaderboard:
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
3. Navigate to `/learn?scrollTo={firstLessonOfNewLevel}`

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
| `/daily-challenge` | KEEP | Daily challenge mode |
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
**Header is sticky** - stays fixed at top of viewport when scrolling. This allows users to access the Daily Challenge toggle without losing their place in the curriculum.

### Logo Rules:
- **Icon**: Colorful queen made of 22 dots (5 columns × 6 rows)
- **Text**: "chess" in white/dark + "path" with yellow→coral→blue gradient
- **"chess" and "path" must NEVER overlap or touch** - this looks unprofessional
- SVG logos must use inline `<tspan>` elements (not separate `<text>` elements with fixed positions)
- Prefer horizontal logo (`logo-horizontal-*.svg`) over stacked for most uses
- Logo files: `/public/brand/logo-horizontal-*.svg` and `/public/brand/logo-stacked-*.svg`
- Icon colors: Blue (#1CB0F6), Cyan (#2FCBEF), Purple (#A560E8), Green (#58CC02), Yellow (#FFC800), Orange (#FF9600), Coral (#FF6B6B), Red (#FF4B4B)
- "path" gradient: Yellow (#FFC800) → Coral (#FF6B6B) → Blue (#1CB0F6)

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

### X Button Behavior:
- Back to `/learn?scrollTo={currentLessonId}`
- **No partial save**

### Completion:
1. Show score popup
2. Continue button
3. Navigate to `/learn?scrollTo={nextLessonId}`

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

| Event | Status |
|-------|--------|
| Correct move | KEEP (chromatic ascending) |
| Wrong move | CHECK/ADD |
| Capture | KEEP |
| Move | KEEP |
| Lesson complete | REDO |
| Daily challenge sounds | ADD |

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
  is_admin, current_streak, last_activity_date, created_at

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
- `profiles.current_lesson_id`
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
| 1 | How to Lose Friends |
| 2 | The Assassin's Toolkit |
| 3 | Never Apologize for Being Great |
| 4 | I Am the One Who Knocks |
| 5 | No Country for Beginners |

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

**Last updated: 2026-02-02**

This section tracks features currently being tested on localhost:3000 before pushing to production.

### 30.1 Share Feature

**Status:** ✅ Complete - PNG generation working

**What it does:**
- Generates a shareable PNG image for any puzzle
- Shows puzzle position with "I SOLVED this tricky puzzle" + "SWIPE TO SEE THE SOLUTION"
- Designed for Instagram/Twitter virality

**User Flow:**
```
User solves puzzle
    ↓
Green "Correct!" popup appears with SHARE button
    ↓
Tap Share → Image generates (~2-3 seconds)
    ↓
Mobile: Native share sheet (Instagram, Twitter, Messages, etc.)
Desktop: Downloads PNG file
```

**Where Share Button Appears:**
1. **Puzzle success popup** - After solving any puzzle in a lesson (primary entry point)
2. **Daily challenge review** - User can pick their favorite puzzle to share after finishing

**Design Details:**
- Cards have 3D layered effect on chessboard (colored border + offset shadows)
- Corner triangle accents (top-right, bottom-left) for stylized look
- Green accent (#58CC02)
- CTA buttons have 3D shadow effect

**Files:**
| File | Purpose |
|------|---------|
| `components/share/ShareButton.tsx` | Button component, handles generation flow |
| `components/share/PuzzleShareCard.tsx` | Static image card design |
| `lib/share/generate-puzzle-image.ts` | PNG generation with html-to-image |
| `app/test-share/page.tsx` | Test page for previewing share card |

**To test:** Visit `/test-share`

---

### 30.2 Daily Challenge

**Status:** ✅ Core mechanics complete and tested

**What it does:**
- Timed puzzle sprint (5 minutes, 3 lives)
- Progressive difficulty: 400 → 2600 ELO (hidden from user)
- 20 puzzles total, "Puzzle X / 20" display
- Same puzzles for everyone each day (seeded by date)
- Accurate timer using `Date.now()` reference
- Chromatic ascending sound (G3→D5) for correct answers
- Leaderboard with Top 10 and "My Standing" views
- Review mode to replay puzzles after finishing

**Files:**
| File | Purpose |
|------|---------|
| `app/daily-challenge/page.tsx` | Main game UI (ready/playing/finished screens) |
| `app/api/daily-challenge/puzzles/route.ts` | Returns seeded puzzles for today |
| `app/api/daily-challenge/leaderboard/route.ts` | Returns leaderboard data |

**Puzzle Distribution:**
- 20 puzzles with deliberate rating targets
- Spans 5 brackets: 0400-0800, 0800-1200, 1200-1600, 1600-2000, 2000-plus
- Prioritizes tactical themes over endgames

**To test:**
- Visit `/daily-challenge`
- Use `?testSeed=123` to get different puzzle sets for testing

**TODO:**
- [ ] Verify leaderboard API works with real user data
- [ ] Test score recording to `daily_challenge_results` table
- [ ] Add share button to results screen
- [ ] Verify same puzzles for different users on same day

---

### 30.3 Header Buttons

**Status:** Styling finalized

**What it does:**
- Learn/Path button: always green, bottom shadow when active, faded when inactive (shown for ALL users)
- Daily button: always blue with shimmer animation, bottom shadow when active, faded when inactive (shown for ALL users)
- Premium button (gradient gold) for non-premium users
- Signup button for logged-out users (no separate Login button - login link on signup page)
- Logout button for logged-in users

**File:** `components/layout/NavHeader.tsx`

**To test:** Check header on various pages while logged in/out

**TODO:**
- [ ] Verify Premium button hides for premium/admin users
- [ ] Test button sizing on various mobile screens
- [x] Learn/Daily buttons now shown for logged-out users

---

### 30.4 Other Test Pages (Exploratory)

These pages exist for design exploration but aren't production features yet:

| Page | Purpose |
|------|---------|
| `/test-share` | Share asset preview |
| `/test-level-designs` | Level design exploration |
| `/test-theme-sankey` | Theme visualization |

---

### 30.5 Tomorrow's TODOs (2026-02-03)

**LET'S GO. The Chess Path is about to be UNSTOPPABLE. Money by EOM. No question.**

- [ ] Increase quip effectiveness/specificity - Make quips more targeted to specific puzzle themes and situations. Time to make these quips HIT DIFFERENT.

---

### Quick Resume Checklist

When resuming work:

1. **Start dev server:** `npm run dev`
2. **Test share feature:** `/test-share` - try generating PNG
3. **Test daily challenge:** `/daily-challenge` - full flow: start → solve → finish
4. **Test header:** Check logged in vs logged out states
5. **Check console:** Look for any errors during testing

---

## 31. Puzzle Share Feature

**Status:** ✅ Complete

**What it does:**
Allows users to share a puzzle they just solved with a shareable PNG image card.

### Image Layout (top to bottom)
- Chess Path logo (horizontal version, centered)
- "I SOLVED this" + "tricky puzzle" header text
- Chessboard with opponent's last move highlighted
- "White/Black to move" indicator
- Green CTA button: "SWIPE TO SEE THE SOLUTION" + "chesspath.app"

**Size:** 1080x1080 for Instagram

### Files

| File | Purpose |
|------|---------|
| `components/share/PuzzleShareCard.tsx` | Static image card component |
| `components/share/ShareButton.tsx` | Share button + generation trigger |
| `lib/share/generate-puzzle-image.ts` | Converts card → PNG |
| `components/puzzle/PuzzleResultPopup.tsx` | Shows share button on correct answers |

### Test Page

`/test-share` - Preview share card design

### Generation Approach

**On-demand generation:**
1. Browser captures the puzzle card as PNG using html-to-image
2. File is created client-side (~2-3 seconds)
3. Web Share API (mobile) or download fallback (desktop)

### Entry Points

| Location | When it appears |
|----------|-----------------|
| Puzzle success popup | After solving any puzzle correctly |
| Daily challenge review | When reviewing a completed puzzle |

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
| `/daily-challenge` | Daily Chess Challenge \| Chess Path | Test your skills with 20 puzzles. Compete on the leaderboard. |
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
| **Daily Challenge** | All 5 rating bracket files exist and have puzzles | No |
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

✗ Check 2: Daily Challenge Files
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
| Scroll behavior | `/app/learn/page.tsx` → ONE useEffect |
| Navigation after lesson | `/app/lesson/[lessonId]/page.tsx` → Continue button |
| Permissions/limits | `/hooks/usePermissions.ts` |
| Header | `/components/layout/NavHeader.tsx` |
| Quips | `/data/staging/v2-puzzle-responses.ts` |
| Feature flags | `/lib/config/feature-flags.ts` |
| Curriculum | `/lib/curriculum-registry.ts` |
| Maintenance checks | `scripts/maintenance-check.ts` |
| Daily challenge puzzles | `/data/daily-challenge-puzzles.json` |

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
