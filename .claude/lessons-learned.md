# Lessons Learned

Battle-tested knowledge from debugging this codebase. Every entry here represents a real bug that cost real time. Read these before making changes.

**Format:** `### Lesson: [Date] - [What happened] → [New rule]`

---

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
→ **New rule:** Header buttons must use single-word labels (Logout, Signup) and `whitespace-nowrap`. Never let "path" overlap or crowd "chess" in the logo.

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
→ **New rule:** Page layout is controlled in `globals.css` (body flex) + `layout.tsx` (main wrapper). Pages use `h-full` not `h-screen`. Only `/learn` has `overflow-auto` for scrolling. Never use `h-screen` in pages.

### Lesson: 2026-02-05 - Early returns in state updates skipped side effects
The `completeLesson` function returned early for already-completed lessons, which meant `currentPosition` never got updated when replaying a lesson. The user's position appeared stuck at an old value because the server had stale data and server wins on merge.
→ **New rule:** When a function updates state AND has side effects (like syncing to server), the early return for "already done" cases must still handle any side effects that should happen regardless.

### Lesson: 2026-02-05 - Progress bar glitched when updating because transition-all animated gradients
The progress bar used `transition-all` on the fill element, which meant when the streak state changed (causing gradient colors to change), the entire gradient would animate between states, causing visual glitching and size flickering.
→ **New rule:** Never use `transition-all` on elements with dynamic backgrounds/gradients. Only transition specific properties (e.g., `transition: 'width 500ms ease-out'`).

### Lesson: 2026-02-05 - Progress bar container resized because siblings had variable width
The progress bar was in a `flex-1` container, meaning its width depended on sibling elements. The counter text ("1/6" vs "10/6") and SyncStatus component (null vs "Saving...") had different widths, causing the progress bar to resize when these changed.
→ **New rule:** When using `flex-1` for a container that should have stable width, ensure all sibling elements have fixed/minimum widths. Use `tabular-nums` for number displays. Use `min-w-[...]` on variable-content containers.

### Lesson: 2026-02-05 - Progress bar jumped because value was calculated from two states that update at different times
The progress value was `currentIndex + (moveStatus === 'correct' ? 1 : 0)`. When clicking Continue: (1) currentIndex updates, (2) re-render shows wrong value, (3) useEffect resets moveStatus, (4) re-render shows correct value. The intermediate render caused the bar to jump forward then shrink.
→ **New rule:** Don't calculate UI values from multiple pieces of state that update at different times. Use a single source of truth that updates atomically at the right moment.

### Lesson: 2026-02-05 - First fix attempt failed because I didn't audit properly
User reported progress bar was "glitchy and changing size." I jumped to the first plausible cause (transition-all on gradients) without doing a full audit. The fix didn't work. Only after using the Explore agent to audit ALL code touching the component did I find 4 issues, not 1.
→ **New rule:** For visual glitches in shared components, ALWAYS use Task tool with Explore agent to audit ALL usages before attempting any fix. Don't guess at the cause.

### Lesson: 2026-02-05 - Race condition between POST sync and GET fetch
After completing a lesson, the sync POST fires async while the user navigates to /learn. The GET fetch can return before POST completes, causing old server data to overwrite the fresh local data.
→ **New rule:** For data that represents "most recent user action" (like currentPosition), LOCAL should win in mergeProgress, not server. Only use server if local is at default.

### Lesson: 2026-02-05 - Page rendered before async data settled, causing flash to wrong position
Even after fixing the merge strategy, users saw a flash to 1.1.1 before landing at the correct position. The page rendered with localStorage data (which had default currentPosition), THEN the server fetch completed and updated it.
→ **New rule:** When a page depends on merged server+local data, don't render until BOTH are ready. Add a `serverFetched` flag. Pattern: `if (!loaded || !serverFetched) return <Skeleton />`.

### Lesson: 2026-02-05 - Fix looked correct locally but was never committed
When fixing the duplicate "Level X:" prefix in level cards, the curriculum data files were modified locally but never staged/committed. Reading the local files showed clean data, but production still had the old data.
→ **New rule:** After making a fix, always run `git diff` (unstaged) to check if ALL changed files were included in the commit. Don't trust `Read` tool output alone.

---

*Add new lessons at the bottom. Follow the format above.*
