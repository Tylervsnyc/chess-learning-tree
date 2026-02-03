# CLAUDE.md - The Chess Path

This file helps Claude understand the project and work effectively with a vibe coder.

---

## READ FIRST

1. **Read RULES.md before making ANY changes** - It's the source of truth
2. This app is maintained by a vibe coder - **explain things simply**
3. When in doubt, **ask before implementing**

---

## The 10 Golden Rules

### 1. AUDIT BEFORE CHANGING
Before writing ANY code:
- Read RULES.md section for this feature
- Search codebase for ALL places that touch this feature
- List every file that will be affected
- Explain to user what currently exists before proposing changes

### 2. ONE SOURCE OF TRUTH
- Every behavior controlled in ONE place
- If you find 2 places controlling same thing → DELETE one
- If RULES.md says "enforced in X" → that's the ONLY place
- Never add a "quick fix" in a second location

### 3. DELETE BEFORE ADDING
- First identify and DELETE broken/competing code
- Then implement fix in correct single location
- Never leave old code "just in case"

### 4. EXPLAIN LIKE I'M NOT A CODER
When proposing changes, explain:
- What files will change
- What the change does in plain English
- What could break if wrong
- How to test if it worked

### 5. SHOW THE BLAST RADIUS
Before making changes, show:
```
This change affects:
- File A: [what changes]
- File B: [what changes]
- User impact: [what user sees different]
- Risk: [what could go wrong]
```

### 6. NO BAND-AIDS
If a fix requires adding refs, special cases, or complex conditionals → STOP

Tell user: "This needs a proper fix, not a band-aid"

### 7. VERIFY AGAINST RULES.MD
- Does this match RULES.md?
- If not, update RULES.md first OR don't make the change
- RULES.md is source of truth

### 8. NAME THINGS UNIQUELY
All IDs use dot notation:
- Section IDs: `{level}.{section}` (e.g., `1.3`, `5.12`)
- Lesson IDs: `{level}.{section}.{lesson}` (e.g., `1.3.2`)
- Quip IDs: `{level}.{section}.{type}.{number}` (e.g., `1.1.g.01`, `2.6.fork.03`)

Never reuse IDs across different contexts.

### 9. CONFIRM UNDERSTANDING
When user reports bug:
1. Restate problem in own words
2. Ask user to confirm
3. THEN investigate
4. THEN propose solution

### 10. PROGRESSIVE DISCLOSURE
- First: One sentence summary
- Then: Simple explanation
- Only if asked: Technical details

---

## Learning From Mistakes

**CRITICAL RULE: When a fix doesn't work or causes new bugs:**

1. **STOP** - Don't try another quick fix
2. **DOCUMENT** - Add what went wrong below under "Lessons Learned"
3. **ADD A RULE** - Create a new rule to prevent this mistake
4. **UPDATE RULES.md** - If the architecture description was wrong, fix it
5. **THEN TRY AGAIN** - With the new understanding

### Lessons Learned

*Format: `### Lesson: [Date] - [What happened] → [New rule]`*

### Lesson: 2026-02-02 - Scroll bug had 3 competing systems
The scroll-to-current-lesson feature was implemented in three different places: refs, URL params, and current lesson calculation. Each one was fighting the others, causing erratic behavior.
→ **New rule:** Search for ALL code touching a feature before changing ANY of it. Delete competing code first.

### Lesson: 2026-02-02 - currentLessonId tracked in DB but dropped in sync
The database had a `current_lesson_id` column, and the API returned it, but the `mergeProgress()` function didn't include it in its return value. We spent hours debugging the frontend when the problem was in the data layer.
→ **New rule:** Always trace data from DB → API → sync → hook → component. If any layer drops the data, the feature won't work.

### Lesson: 2026-02-02 - Scroll failed because React hadn't re-rendered yet
`setTimeout(100ms)` wasn't enough time for React to re-render the expanded section before `scrollIntoView` was called. The element didn't exist yet, so scroll silently failed.
→ **New rule:** When scrolling to dynamically rendered elements, poll for the element's existence instead of using a fixed timeout. React render timing is unpredictable.

### Lesson: 2026-02-02 - "Current" lesson showed wrong lesson after navigation
After completing lesson 1.6.1, the pulsing ring showed on 1.1.4 instead of 1.6.2. The `currentLessonId` logic found the "first unlocked but not completed" lesson from the start of the curriculum, ignoring where the user actually was.
→ **New rule:** When navigating with a URL param (scrollTo), that param should override calculated "current" values for visual indicators. The user's context matters.

### Lesson: 2026-02-02 - Database schema drift caused 500 errors
The actual Supabase database had columns (`tree_id`, `lesson_id` on puzzle_attempts) that weren't in the local `schema.sql` file. API inserts failed with NOT NULL violations.
→ **New rule:** When you see a 500 error on POST, check the server logs for the actual error message. Schema drift between `schema.sql` and the real database is a common cause.

### Lesson: 2026-02-03 - Duplicate unlock logic in learn page ignored unlockedLevels
The `/app/learn/page.tsx` file had its own `getLessonStatus` function that duplicated unlock logic from `useProgress.ts` but NEVER checked `unlockedLevels`. When a user passed a level test, the hook's `isLessonUnlocked` worked correctly but the page's duplicate function showed lessons as locked.
→ **New rule:** Before adding unlock logic anywhere, search for `isLessonUnlocked`, `getLessonStatus`, `locked`, `unlocked` across the entire codebase. The Quick Reference table says unlock is enforced in ONE place - verify that's actually true.

<!-- Add new lessons here -->

---

## Quick Reference - Where Things Are Enforced

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

**If you find this logic in multiple places, consolidate it first!**

---

## Before You Code Checklist

Run through this EVERY time before implementing a feature or fix:

- [ ] Read RULES.md section for this feature
- [ ] Searched for all files that touch this
- [ ] Listed blast radius for user
- [ ] User confirmed understanding
- [ ] Identified code to DELETE (not just add)
- [ ] Change matches RULES.md

---

## Architecture Overview

### Data Flow
```
User Action
    ↓
Component (UI)
    ↓
Hook (useProgress, useUser, usePermissions)
    ↓
Sync Layer (lib/progress-sync.ts)
    ↓
API Route (app/api/*)
    ↓
Supabase (Database)
```

### Key Files by Responsibility

| Responsibility | File(s) |
|----------------|---------|
| User state & type | `hooks/useUser.ts` |
| Progress tracking | `hooks/useProgress.ts`, `lib/progress-sync.ts` |
| Permissions/limits | `hooks/usePermissions.ts` |
| Lesson unlocking | `hooks/useProgress.ts` |
| Puzzle selection | `lib/puzzle-selector.ts` |
| Sound effects | `lib/sounds.ts` |
| Curriculum data | `lib/curriculum-registry.ts` |
| Feature flags | `lib/config/feature-flags.ts` |
| Database schema | `supabase/schema.sql` |

### The Three Questions
Before implementing any feature involving data:

1. **"Where is it stored?"** → Check `supabase/schema.sql`
2. **"How does it flow?"** → Check API routes and `lib/progress-sync.ts`
3. **"Where is it used?"** → Check hooks and components

---

## Naming Conventions

### IDs (Dot Notation)
- Level: `1`, `2`, `5`
- Section: `1.3`, `5.12`
- Lesson: `1.3.2`, `5.12.4`
- Quip: `1.1.g.01`, `2.6.fork.03`

### Files
- Pages: `app/{route}/page.tsx`
- API routes: `app/api/{name}/route.ts`
- Components: `components/{category}/{ComponentName}.tsx`
- Hooks: `hooks/use{Name}.ts`
- Utilities: `lib/{name}.ts`

### Functions
- Handlers: `handle{Action}` (e.g., `handleClick`)
- Getters: `get{Thing}` (e.g., `getNextLesson`)
- Checkers: `is{Condition}` or `can{Action}` (e.g., `isLessonUnlocked`)
- Updates: `update{Thing}` (e.g., `updateProgress`)

---

## Content Guidelines

### Voice & Tone
- Playful, witty, confident
- Trash talk (friendly)
- Chess puns welcome
- Pop culture references
- Heist/thievery metaphors
- Sports metaphors

### DON'T Use:
- Violence/death language (no killed, destroyed, murdered, death, suffocated)
- Mean insults
- Anything inappropriate for kids
- Real people
- Swearing
- Cheesy emojis in UI (no 🔥💪🏆✨ etc.)

---

## Project Overview

**The Chess Path** is a mobile-first chess learning web app that teaches tactics through interactive puzzles organized in a skill tree curriculum. Think Duolingo for chess.

### Tech Stack
- **Framework**: Next.js 16 with App Router (React 19, TypeScript)
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4 (dark theme)
- **Chess Logic**: chess.js + react-chessboard
- **Analytics**: PostHog
- **Payments**: Stripe

### Key Commands
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Check for code issues
```

### MCP Tools (Claude Desktop)

Three MCP servers are configured for this project:

| Tool | Use For |
|------|---------|
| **filesystem** | Read/write/search files in the project directory |
| **github** | Create PRs, manage issues, view repo info |
| **supabase** | Query database, check schema, manage tables directly |

**When to use each:**

- **Debugging data issues?** → Use `supabase` to query the actual database and compare with what `schema.sql` says
- **Need to check production data?** → Use `supabase` to run SELECT queries
- **Creating a PR?** → Use `github` to create it directly
- **Reading/editing files?** → Use `filesystem` (faster than asking user to paste)

**Supabase MCP tips:**
- Always check the LIVE database schema before assuming `schema.sql` is accurate
- Use it to verify RLS policies are working
- Can run migrations and check table structures
- Project ref: `ruseupjmldymfvpybqdl`

---

## Project Structure

```
app/                        # Pages and API routes
├── api/                   # Backend endpoints
├── auth/                  # Login/signup
├── learn/                 # Main curriculum tree
├── lesson/[lessonId]/     # Puzzle solving
├── level-test/[transition]/ # Level unlock tests
├── daily-challenge/       # Daily challenge mode
├── pricing/               # Subscription
└── admin/                 # Admin tools

components/
├── puzzle/               # Chessboard, feedback
├── tree/                 # Curriculum visualization
├── layout/               # Header, containers
└── prompts/              # Signup prompts

data/
├── staging/              # V2 curriculum definitions
├── lesson-pools/         # Pre-computed puzzle pools
├── puzzles-by-rating/    # Lichess CSVs
└── clean-puzzles-v2/     # Filtered puzzle JSONs

hooks/                     # React hooks
├── useProgress.ts        # Lesson completion, unlocking
├── useUser.ts            # Auth state
└── usePermissions.ts     # Limits and access

lib/                       # Core utilities
├── curriculum-registry.ts # Single source of truth for levels
├── puzzle-selector.ts    # Puzzle selection
├── progress-sync.ts      # Client-server sync
├── sounds.ts             # Sound effects
└── config/
    └── feature-flags.ts  # Feature toggles
```

---

## Styling Reference

### Colors (Dark Theme)
- Background: `#131F24`
- Secondary: `#1A2C35`
- Green accent: `#58CC02`
- Blue accent: `#1CB0F6`
- Error: `#FF4B4B`

### Layout
- Mobile-first with `MobileContainer` wrapper
- Use `h-screen overflow-hidden` for full-height pages
- Fixed heights to prevent layout shift

### Design Rules
- **Mobile-first**: All designs must fit a mobile screen
- **Pages load at the top**: No scroll position persistence except where specified
- **No scrolling**: Pages should not scroll EXCEPT `/learn`

---

## Puzzle System

### IMPORTANT: Lichess Puzzle Format

**The first move in a Lichess puzzle is the OPPONENT'S move, not the player's!**

When loading a puzzle:
1. Load the FEN
2. Apply `moves[0]` to get the actual puzzle position
3. Show the board (now it's the player's turn)
4. Player's color = whoever's turn it is AFTER `moves[0]`
5. Validate player moves against `moves[1]`, `moves[3]`, etc.
6. Auto-play opponent responses from `moves[2]`, `moves[4]`, etc.

**Common mistake:** Showing the raw FEN without applying `moves[0]` first!

---

## Database Tables

See `supabase/schema.sql` for full schema.

Key tables (per RULES.md Section 23):
- `profiles` - User info, subscription, streak, unlocked_levels
- `puzzle_attempts` - Every puzzle try
- `lesson_progress` - Completed lessons
- `daily_challenge_results` - Daily challenge scores
- `level_test_attempts` - Level test history
- `puzzle_history` - Recently seen puzzles (90 day cleanup)
- `quip_history` - Recently seen quips

All tables have Row Level Security - users only see their own data.

---

## Environment Variables

Requires `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
STRIPE_SECRET_KEY=your-stripe-key
```

---

## Red Flags to Watch For

When reviewing code or debugging, these are warning signs:

- Same logic in multiple files (unlock checks, navigation, etc.)
- Field exists in one interface but not another
- "Fire and forget" API calls with no error handling
- Data stored but never retrieved or displayed
- Comments like "temporary fix" or "TODO: clean up"
- Functions named the same thing in different files
- Hard-coded values that should come from RULES.md
- Scroll behavior in more than one place

---

## Links

- **RULES.md** - Source of truth for all app behavior
- **supabase/schema.sql** - Database schema
- **lib/curriculum-registry.ts** - Curriculum registration

---

*Remember: RULES.md is the source of truth. When in doubt, read RULES.md first.*
