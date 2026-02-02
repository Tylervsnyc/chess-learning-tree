# RULES.md - The Chess Path Source of Truth

**This document defines how The Chess Path works.** Every behavior, limit, and interaction is documented here. When in doubt, this document is correct.

Last Updated: 2026-02-02

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

### Rules:
| Rule | Value |
|------|-------|
| Timer | 5 minutes |
| Lives | 3 (3 wrong = out) |
| Starting ELO | 400 |
| Correct answer | +200 ELO |
| Wrong answer | Same ELO |
| Same puzzles for all users | Yes (seeded by date) |

### Puzzle Pool Per Day:
| ELO Range | Puzzles |
|-----------|---------|
| 400-1800 | 3 each |
| 2000 | 10 |

### Win Conditions:
- Complete all 2000 ELO puzzles, OR
- Timer runs out, OR
- Lose 3 lives

### On Completion:
1. Show score
2. Allow puzzle review
3. Show global leaderboard

---

## 13. Leaderboard

### Daily Challenge Leaderboard:
| Column | Description |
|--------|-------------|
| Rank | Position |
| Username | Display name |
| Puzzles | Completed count |
| Time | Completion time |

### Display:
- Top 10 by default
- Toggle to see your rank
- Today only (no history)

### Sort Order:
1. Puzzles completed (desc) - more puzzles = higher rank
2. Completion time (asc) - faster wins ties

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

### Elements by Location:

| Element | Where Shown | Links To |
|---------|-------------|----------|
| Logo | All pages | Nothing (no link) |
| [Path]/[Daily] toggle | `/learn`, `/daily-challenge` | Switches between |
| Premium button | All pages (non-premium, non-admin) | `/pricing` |
| Login button | All pages (logged out) | `/auth/login` |
| Avatar + dropdown | All pages (logged in) | Dropdown with 'Log out' |
| Streak counter | `/learn`, `/daily-challenge` | Nothing |

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
  id, user_id, challenge_date, puzzles_completed, completion_time, created_at

level_test_attempts
  id, user_id, transition, passed, score, variant_id, created_at

puzzle_history
  id, user_id, puzzle_id, seen_at
  -- Cleanup: delete rows older than 90 days

quip_history
  id, user_id, quip_id, seen_at
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
