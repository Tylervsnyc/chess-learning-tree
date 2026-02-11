# Chess Path — Planning Session

**Status:** Big productivity day. Level 8 shipped, level tests redesigned, auth gate on Daily Rook, design token sweep continuing, puzzle data cleanup.

**Last updated:** Feb 10, 2026 (evening)

---

## Priority List (in recommended order)

### 1. Design System / Style Guide Agent ✅ DONE
**Agent created:** `.claude/agents/design-system-agent.md`
**Design system doc:** `.claude/design-system.md`

**What got done:**
- Formalized 18 color tokens in `globals.css` @theme block
- Decided: **light theme everywhere** (no more dark backgrounds on user-facing pages)
- Tokenized all core user-facing pages (~30+ files converted from hardcoded hex to tokens)
- Created `.claude/design-system.md` — full reference guide for colors, typography, spacing, component patterns
- Updated CLAUDE.md styling reference to point to design system doc
- Added Design System agent to CLAUDE.md dispatch table
- Fixed mobile header spacing (responsive logo sizing, tighter gaps)
- Fixed learn page lesson circles on mobile (scale-based responsive fix)
- Rewrote pricing page as compact single-screen layout

**More token conversion (Feb 10, uncommitted):**
- Converted ~10 more pages to design tokens: landing page, about, auth/login, auth/signup, auth/error, auth/welcome, flagged, gift/welcome
- NavHeader: responsive logo sizing (`w-[110px] sm:w-[140px] md:w-[160px]`), tighter mobile padding (`px-1.5 sm:px-2.5`), token shadows
- Share cards (DailyChallengeShareCard, PuzzleShareCard) — CSS variable tokens
- ChessProgressBar — gold token in SVG gradients

**Remaining:**
- ~790 hardcoded hex values in test/admin/preview pages (low priority, down from original count)
- Shared UI component library (`components/ui/`) not yet built (Button, Card, Badge, etc.)

---

### 2. Responsive Sizing Agent — DESCOPED FOR NOW
**Agent created:** `.claude/agents/responsive-agent.md` (spec written, work deferred)

Tyler decided to focus on mobile-first and skip desktop layout improvements for now. The app is primarily used on phones. Desktop can wait until after launch marketing.

---

### 3. PWA Agent ✅ DONE
**Agent created:** `.claude/agents/pwa-agent.md`

**What got done (via terminal Claude Code):**
- Web app manifest with proper metadata
- Service worker (cache-first for static assets, network-first for API)
- Install prompt bottom sheet triggered after puzzle completion
- Generated PNG icons from SVG at proper PWA sizes
- Per-platform install instructions (iOS Safari vs Chrome vs desktop)
- Hotfix: only show install prompt on browsers that actually support it

---

### 4. Levels / Curriculum Builder Agent ✅ LEVELS 6, 7, & 8 DONE

**What got done:**

**Level 6 — "The Dark Knight" (1600-1800 ELO):**
- Full curriculum: 14 sections, 56 lessons, 4 blocks
- 41 puzzle theme files, 250 Dark Knight-themed quips

**Level 7 — "There Is Always Hope..." (1800-2000 ELO):**
- Full curriculum: 14 sections, 56 lessons, 4 blocks (Two Towers theme)
- 39 puzzle theme files, ~200 quips

**Level 8 — "Say Checkmate Again" (2000-2200 ELO) ✅ SHIPPED:**
- Full curriculum: Pulp Fiction-themed master tactics
- Shipped Feb 10, 2026 (committed)

**Remaining:**
- Pricing page still says "All levels unlocked" (future-proofed wording)

---

### 5. Beginner Tutorial (Lesson 1.1.1) — SHIPPED
**Status:** Live in production (Feb 11, 2026)
**Files:** `app/test-tutorial/page.tsx`, `app/lesson/[lessonId]/page.tsx`
**Docs:** RULES.md section 17b

Guided tutorial replaces lesson 1.1.1. 6 diverse queen checkmate puzzles with progressive scaffolding. Wired into real lesson flow with progress persistence, analytics, and LessonCompleteScreen celebration.

**Future ideas:**
- [ ] Tutorials for other first-in-section lessons?
- [ ] Track tutorial funnel per-step (PostHog events for each guided step)
- [ ] Template into reusable `<TutorialFlow puzzles={...} />` for other themes

---

### 6. PostHog Funnel Analysis — NOT STARTED
**Agent: analysis session with Tyler**

PostHog tracking is comprehensive (40+ events). Need to build actual funnel views before marketing push. Key funnels: Landing→Signup, Signup→First Puzzle, Free→Paid conversion.

---

### 7. Social Media Sharable Video — IN PROGRESS
**Agent: Growth agent + Frontend**
**Test page:** `app/test-daily-video/page.tsx`
**Rules:** `.claude/daily-puzzle-video-rules.md`

Instagram Reel storyboard for daily puzzles — 4-stage flow in 9:16 frames:
1. Initial position (logo + "White to play")
2. Countdown ("Solution in 3... 2... 1... GO!")
3. Animated solution (moves play on board, notation builds below)
4. Celebration (confetti + CTA)

**What got done (Feb 10):**
- Built test page showing all 4 stages side-by-side as phone-frame mockups
- Board goes edge-to-edge (270px = full frame width)
- Countdown now says "Solution in 3" / "Solution in 2" / "Solution in 1"
- Logo rendered in shared ReelLayout with absolute positioning
- Confetti burst confined to bottom zone (never overlaps board)
- Rules file created with NON-NEGOTIABLE layout constraints

**Remaining / known issues:**
- Logo still rendering inconsistently across frames — needs debugging (visual diff between stages despite identical code path). Countdown stage looks closest to desired result.
- Not yet producing actual video output — still a test/preview page
- Need to decide: canvas API recording vs server-side ffmpeg vs manual screen-record
- No real puzzle data integration yet (hardcoded demo puzzle)

---

### 8. The King's Path — IN PROGRESS (new daily game)
**Rules doc:** `KINGS-PATH-RULES.md`
**Test page:** `app/test-kings-path/page.tsx`

A minesweeper-meets-chess fog-of-war daily puzzle. Guide a white King through fog to reach a Golden Rook. Enemy pieces hide in the fog — as you explore, they're revealed. Only visible enemies can hurt you (no guessing). Pieces block each other's sliding attacks, creating satisfying "aha" moments. Same puzzle for everyone each day (Wordle formula). Variable board size: Monday 5x5 → Sunday 8x8+.

**What got done (Feb 10):**
- Full playable demo with 4 hand-crafted, BFS-validated levels
- Core mechanics: fog of war (reveal radius 2), 3 lives, piece blocking, no-guessing rule
- Lichess SVG pieces (not Unicode), chess board colors, sounds from existing system
- BFS level validator built into the page (logs to console on level start)
- Animations: fog reveal, piece pop-in, board shake on damage, golden rook pulse
- Level design showcasing key patterns:
  - **Monday (5x5):** "First Steps" — 2 knights, learn the mechanics (6 moves)
  - **Wednesday (6x6):** "The Bishop Gate" — bishop diagonal blocked by knight (7 moves)
  - **Saturday (7x7):** "The Rook Tunnel" — rook row blocked by knight, creating a gap (9 moves)
  - **Sunday (8x8):** "The Gauntlet" — bishop forces right-side routing, rook tunnel is the only way through (11 moves)
- Comprehensive rules doc created (`KINGS-PATH-RULES.md`)

**Next steps:**
- [ ] Algorithmic puzzle generator (constraint satisfaction + BFS validation)
- [ ] Daily puzzle seeded by date (same puzzle for everyone)
- [ ] Share card (dark board + glowing golden path — unique visual for group chats)
- [ ] Extract game logic into `useKingsPath` hook
- [ ] Production route at `/kings-path`
- [ ] Database table for results + streak integration
- [ ] Tutorial/onboarding for first-time players
- [ ] Attack line visualization (tap a revealed piece to see its threats)

---

### 9. Landing Page Improvements — NOT STARTED
**Agent: Frontend + Design System collaboration**

Current landing page is minimal (logo, tagline, one button). Needs: value prop sections, social proof, curriculum preview, "how it works" flow. Should happen now that design system is established.

---

### 10. Fix Pricing Page Copy ✅ DONE
Pricing page now uses future-proof "All levels unlocked" wording. Compact single-screen layout with no scrolling.

---

### 11. Nav Bar Mobile Cleanup ✅ PARTIALLY DONE
Fixed header button spacing on mobile (responsive logo sizing, tighter gaps/padding). Full hamburger menu or bottom tab bar deferred to later.

---

## Work Done Feb 10

### Committed
**Level Test Redesign (4 commits):**
- Animated logo, strike system (hearts for lives), no emojis
- Shimmer animation → replaced with ripple glow animation
- Compact intro screen (smaller logo, perpetual float animation)
- Level test layout locked in RULES.md

**Daily Rook Auth Gate:**
- Gated Daily Rook behind auth — require login to play
- Redirect back to Daily Rook after signup/login from gate screen

**Bug Fixes:**
- Fixed mobile chess board clipping in Daily Rook (documented sizing rule in RULES.md)
- Fixed /learn scrolling to 1.1.1 after failed level test
- Fixed 7 QA health check warnings: layout, schema drift, dead URLs, docs, middleware

### Uncommitted (in progress)
**Design Token Sweep:**
- ~10 pages converted from hardcoded hex to `chess-*` tokens (landing, about, auth/*, flagged, gift/welcome)
- NavHeader: responsive logo sizing + tighter mobile padding
- Share cards + ChessProgressBar tokenized

**Puzzle Data Cleanup:**
- ~58 puzzle JSON files re-sorted across levels 1-5 (data/clean-puzzles-v2/)

**AGENTS.md Expansion:**
- Updated from 10 → 14 agents (added Design System, Responsive, PWA, Levels)
- Expanded parallel safety matrix from 10x10 to 14x14
- Added more guaranteed-safe combos + WARN pair documentation

**Small Fixes:**
- Signup page: handle Supabase returning fake success for existing emails (empty identities array)
- Daily challenge API: added `force-dynamic` to prevent stale caching
- Added `sharp` package (image processing)

### Previous Days (for reference)
**Learn Page Polish:**
- Pop-in animations on lesson popup cards
- 3 z-index / stacking fixes: popups were getting clipped by overflow-hidden from section animations
- Separate positioning wrapper from animation wrapper to prevent transform conflicts

**Other:**
- Feature-flagged sharing UI (off for now) on lesson complete + daily challenge screens
- Favicon centering fix
- AnimatedLogo centering fix (equal 4px horizontal margins)
- 1st draft of Substack blog post (`substack-draft-chesspath.md`)

---

## Current State of the App

**Live Levels (8 active):**
1. "Begin to Believe" — 400-800 ELO (Matrix)
2. "One Does Not Simply Win at Chess" — 800-1000 ELO (LOTR)
3. "We Need to Go Deeper" — 1000-1200 ELO (Inception)
4. "I Am the One Who Knocks" — 1200-1400 ELO (Breaking Bad)
5. "No Country for Beginners" — 1400-1600 ELO (No Country for Old Men)
6. "The Dark Knight" — 1600-1800 ELO (Batman)
7. "There Is Always Hope..." — 1800-2000 ELO (Two Towers)
8. "Say Checkmate Again" — 2000-2200 ELO (Pulp Fiction)

**Agents (14):** Frontend, Backend, Database, Chess, Sync, Content, QA, Architect, Growth, DevOps, Design System, Responsive, PWA, Levels

**Design System:** Light theme, 18 color tokens, documented in `.claude/design-system.md`

**PWA:** Manifest, service worker, install prompts — all live

**Total:** 448 lessons (56×8), 271+ puzzle theme files, 100k+ puzzles, 20+ API endpoints

---

## What's Next (suggested priority)

1. **Commit uncommitted work** — design token sweep, puzzle re-sort, AGENTS.md, signup fix (lots of good stuff sitting unstaged)
2. **Beginner tutorial — wire into production** — connect test-tutorial to real lesson 1.1.1 flow, persist completion
3. **King's Path — build out to production** — puzzle generator, daily seeding, share card, production route
4. **Finish daily video reel** — fix logo consistency bug, then decide on video export method
5. **Landing page improvements** — design system is ready, landing page is the front door
6. **PostHog funnels** — understand user behavior before spending on marketing
7. **Blog post** — finalize and publish the Substack draft

---

*Originally created Feb 9, 2026. Updated Feb 10, 2026 (evening).*
