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

### Lesson: 2026-02-03 - New account showed 146-day streak from previous user's localStorage
The `/api/progress/sync` endpoint merged localStorage with server data using `Math.max()` for streak. When a user logged out and created a new account, their old localStorage streak (146) overwrote the new account's streak (0).
→ **New rule:** When merging client data with server data, check if it's a "new user" (no server data) and use server defaults instead of merging. localStorage can be stale from previous sessions.

### Lesson: 2026-02-03 - Unlock logic was duplicated and stored implicit data
The learn page had its own `getLessonStatus()` function that duplicated unlock logic from `useProgress.ts`. Also, unlocking level 5 stored `[1, 5]` instead of `[1, 2, 3, 4, 5]`, requiring complex "level < highest" derivation logic that had bugs.
→ **New rule:** Store explicit state, not implicit. When unlocking level 5, store `[1,2,3,4,5]` so the check is just "is level in array?" Also, before fixing unlock bugs, grep for `getLessonStatus`, `isLessonUnlocked`, `locked`, `unlocked` to find ALL places with unlock logic.

### Lesson: 2026-02-03 - Header buttons wrapped text on mobile, logo text overlapped
On mobile, "Log out" wrapped to two lines and the logo "chess" and "path" text appeared too close or overlapping. Multi-word button labels wrap when space is tight; SVG text positioning varies across devices/fonts.
→ **New rule:** Header buttons must use single-word labels (Logout, Signup) and `whitespace-nowrap`. Never let "path" overlap or crowd "chess" in the logo - this looks unprofessional. Test header on mobile before shipping.

### Lesson: 2026-02-03 - Pre-generate data for reliability
The daily challenge puzzle selection was flaky when computed on-the-fly. Pre-generating 37,000+ puzzles into a JSON file made it instant and deterministic.
→ **New rule:** If a feature computes data that should be the same for all users (daily puzzles, static content), pre-generate it into a data file rather than computing it on each request.

### Lesson: 2026-02-03 - Navigation after completing flows gets forgotten
After passing a level test, users were sent to `/learn` but not to the specific new level. The "happy path" navigation (what happens AFTER success) is often overlooked.
→ **New rule:** When building a flow (test, quiz, challenge), explicitly design the post-success navigation. Where does the user go after they win? Test it end-to-end.

### Lesson: 2026-02-03 - Popups cut off on mobile edges
The lesson info popup was positioned relative to the button but could overflow off-screen on mobile edges.
→ **New rule:** Any popup/tooltip needs boundary detection. Check if it would overflow left/right edges and flip positioning accordingly. Use `getBoundingClientRect()` to detect.

### Lesson: 2026-02-04 - Pages scrolled on mobile because NavHeader + h-screen > viewport
Pages used `h-screen` (100vh) but NavHeader was rendered outside them in layout.tsx. Total height = NavHeader + 100vh = scrollable body. Using JavaScript (ScrollToTop) to fix a CSS problem is a band-aid.
→ **New rule:** Page layout is controlled in `globals.css` (body flex) + `layout.tsx` (main wrapper). Pages use `h-full` not `h-screen`. Only `/learn` has `overflow-auto` for scrolling. Never use `h-screen` in pages - it ignores the NavHeader.

### Lesson: 2026-02-05 - Early returns in state updates skipped side effects
The `completeLesson` function returned early for already-completed lessons, which meant `currentPosition` never got updated when replaying a lesson. The user's position appeared stuck at an old value because the server had stale data and server wins on merge.
→ **New rule:** When a function updates state AND has side effects (like syncing to server), the early return for "already done" cases must still handle any side effects that should happen regardless. In this case, `currentPosition` should update even for replays.

### Lesson: 2026-02-05 - Progress bar glitched when updating because transition-all animated gradients
The progress bar used `transition-all` on the fill element, which meant when the streak state changed (causing gradient colors to change), the entire gradient would animate between states, causing visual glitching and size flickering.
→ **New rule:** Never use `transition-all` on elements with dynamic backgrounds/gradients. Only transition specific properties that should animate (e.g., `transition: 'width 500ms ease-out'`). CSS background gradients don't interpolate smoothly.

### Lesson: 2026-02-05 - Progress bar container resized because siblings had variable width
The progress bar was in a `flex-1` container, meaning its width depended on sibling elements. The counter text ("1/6" vs "10/6") and SyncStatus component (null vs "Saving...") had different widths, causing the progress bar to resize when these changed.
→ **New rule:** When using `flex-1` for a container that should have stable width, ensure all sibling elements have fixed/minimum widths. Use `tabular-nums` for number displays so all digits have equal width. Use `min-w-[...]` on variable-content containers.

### Lesson: 2026-02-05 - Progress bar jumped because value was calculated from two states that update at different times
The progress value was `currentIndex + (moveStatus === 'correct' ? 1 : 0)`. When clicking Continue: (1) currentIndex updates, (2) re-render shows wrong value, (3) useEffect resets moveStatus, (4) re-render shows correct value. The intermediate render caused the bar to jump forward then shrink.
→ **New rule:** Don't calculate UI values from multiple pieces of state that update at different times. Use a single source of truth (like `completedPuzzleCount`) that updates atomically at the right moment.

### Lesson: 2026-02-05 - First fix attempt failed because I didn't audit properly
User reported progress bar was "glitchy and changing size." I jumped to the first plausible cause (transition-all on gradients) without doing a full audit. The fix didn't work. Only after user pushed back and I used the Explore agent to audit ALL code touching the component did I find: (1) container width instability from siblings, (2) state coupling causing shrink-then-grow, (3) same bug in level-test page, (4) unused dead code. There were 4 issues, not 1.
→ **New rule:** For visual glitches in shared components, ALWAYS use Task tool with Explore agent to audit ALL usages before attempting any fix. Don't guess at the cause - trace the data flow from state → props → render in every file that uses the component.

### Lesson: 2026-02-05 - Race condition between POST sync and GET fetch
After completing a lesson, the sync POST fires async while the user navigates to /learn. The GET fetch can return before POST completes, causing old server data to overwrite the fresh local data. User completed 4.5.1 but landed at 1.1.1 because server won the merge.
→ **New rule:** For data that represents "most recent user action" (like currentPosition), LOCAL should win in mergeProgress, not server. Only use server if local is at default. This prevents race conditions where GET returns stale data.

<!-- Add new lessons here -->

---

## Quick Reference - Where Things Are Enforced

| Behavior | Enforced In (ONE place) |
|----------|-------------------------|
| Lesson unlocking | `/hooks/useProgress.ts` → `isLessonUnlocked()` |
| Current position (scroll target) | `/hooks/useProgress.ts` → `currentPosition` (server is source of truth) |
| Level unlocking | `/hooks/useProgress.ts` → `isLevelUnlocked()` |
| Page layout/height | `/app/globals.css` + `/app/layout.tsx` → flex structure |
| Scroll to top (pages) | `/components/providers/ScrollToTop.tsx` (except /learn) |
| Scroll behavior (/learn) | `/app/learn/page.tsx` → ONE useEffect |
| Navigation after lesson | `/app/lesson/[lessonId]/page.tsx` → Continue button |
| Permissions/limits | `/hooks/usePermissions.ts` |
| Header | `/components/layout/NavHeader.tsx` |
| Quips | `/data/staging/v2-puzzle-responses.ts` |
| Feature flags | `/lib/config/feature-flags.ts` |
| Curriculum | `/lib/curriculum-registry.ts` |
| Daily challenge puzzles | `/data/daily-challenge-puzzles.json` (pre-generated) |
| Daily challenge leaderboard | `/app/api/daily-challenge/leaderboard/route.ts` |
| Animated logo | `/components/brand/AnimatedLogo.tsx` |

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
- Use `h-full` for pages (NOT `h-screen` - that ignores NavHeader)
- Fixed heights to prevent layout shift
- Layout structure: body (flex-col, overflow-hidden) → NavHeader → main (flex-1) → page (h-full)

### Design Rules
- **Mobile-first**: All designs must fit a mobile screen
- **Pages load at the top**: Body has `overflow: hidden`, no scroll restoration
- **No scrolling**: Pages use `h-full overflow-hidden` EXCEPT `/learn` and `/test-*` pages which use `h-full overflow-auto`

---

## Chess Board Rules

**Test page:** `/test-chess` - See all these rules in action

### 1. Lichess Puzzle Format (CRITICAL)

**The first move in a Lichess puzzle is the OPPONENT'S move, not the player's!**

```
Raw Lichess puzzle:
├─ fen: Position BEFORE opponent's setup move
├─ moves[0]: Opponent's "setup" move (creates the tactic)
└─ moves[1+]: Player's solution moves
```

**Processing flow:**
1. Load the original FEN
2. Apply `moves[0]` to get `puzzleFen` (the actual puzzle position)
3. **Animate the setup move** (show piece sliding from original to puzzle position)
4. Player's color = whoever's turn it is AFTER `moves[0]`
5. Validate player moves against `moves[1]`, `moves[3]`, etc. (odd indices)
6. Auto-play opponent responses from `moves[2]`, `moves[4]`, etc. (even indices)

**Common mistake:** Showing the raw FEN without applying `moves[0]` first!

### 2. Animate the Setup Move (No Flying Pieces)

When a puzzle loads, animate ONLY the opponent's setup move. Prevent pieces from flying across the board when switching puzzles:

```tsx
const [animationDuration, setAnimationDuration] = useState(0);

// On puzzle change:
// Step 1: Instantly snap to starting position (animation = 0)
setAnimationDuration(0);
setCurrentFen(puzzle.originalFen);

// Step 2: After brief delay, enable animation and show setup move
setTimeout(() => {
  setAnimationDuration(300); // Enable animation
  setCurrentFen(puzzle.puzzleFen); // This move animates
  setTimeout(() => {
    setIsAnimatingSetup(false); // Allow interaction
  }, 300);
}, 100);
```

**Key pattern:** Dynamic `animationDurationInMs` - set to 0 for instant position changes, 300 for animated moves.

**Why:** react-chessboard animates ALL position changes. When switching puzzles, pieces would fly from old positions to new ones. Setting duration to 0 first makes the initial position appear instantly.

### 3. Board Styling (Consistent Colors)

| Element | Color | CSS |
|---------|-------|-----|
| Dark squares | Green-brown | `#779952` |
| Light squares | Cream | `#edeed1` |
| Selected piece | Yellow | `rgba(255, 255, 0, 0.4)` |
| Last move (from) | Orange | `rgba(255, 170, 0, 0.5)` |
| Last move (to) | Orange | `rgba(255, 170, 0, 0.6)` |
| Hint squares | Green | `#58CC02` with `boxShadow: inset 0 0 0 3px` |
| Legal move (empty) | Dot | `radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 25%)` |
| Legal move (capture) | Ring | `radial-gradient(circle, transparent 60%, rgba(0,0,0,0.3) 60%)` |

### 4. Move Validation

- Store solution moves as **SAN** (e.g., "Nf3"), not UCI ("g1f3")
- **Normalize before comparing:** Strip `+` and `#` symbols
  ```tsx
  const normalize = (m: string) => m.replace(/[+#]$/, '');
  if (normalize(move.san) === normalize(expectedMove)) { /* correct */ }
  ```
- **Alternate checkmates:** In mate puzzles, accept ANY checkmate move
- **Auto-queen promotion:** Always promote to queen (no UI choice)

### 5. Wrong Answer Flow (Duolingo-style)

```
1st wrong → "Oops, that's not correct. 2 attempts remaining."
2nd wrong → "Oops, that's not correct. 1 attempt remaining."
3rd wrong → Show green hint (highlight from/to squares)
```

### 6. Key Files

| Responsibility | File |
|----------------|------|
| Puzzle processing | `/lib/puzzle-utils.ts` |
| Main lesson board | `/app/lesson/[lessonId]/page.tsx` |
| Daily challenge board | `/app/daily-challenge/page.tsx` |
| Level test board | `/app/level-test/[transition]/page.tsx` |
| Reusable component | `/components/puzzle/PuzzleBoard.tsx` |
| Sounds | `/lib/sounds.ts` |
| Test page | `/app/test-chess/page.tsx` |

### 7. Common Gotchas

1. **Lichess first move** - MUST apply `moves[0]` before showing puzzle
2. **SAN vs UCI** - Solution stored as SAN, not UCI coordinates
3. **Auto-queen** - All pawn promotions default to queen
4. **Check symbols** - "Qe6+" and "Qe6#" should match
5. **Mobile audio** - Call `warmupAudio()` on first user interaction
6. **Board sizing** - No explicit size; scales to container width automatically

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
