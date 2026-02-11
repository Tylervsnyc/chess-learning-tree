# PRODUCTION.md — What's Built vs What's Live

**Last updated:** Feb 10, 2026

This is the single source of truth for features that are built but not yet live. If you build something, it goes here until it ships.

---

## Feature Flags

| Flag | Status | Feature | What's hidden | To ship |
|------|--------|---------|--------------|---------|
| `SHOW_STREAK_COUNTER` | **OFF** | Streak fire badge in NavHeader | Fire emoji + streak count on `/learn` and `/daily-challenge` | Flip to `true`. Data pipeline fully wired. |
| `SHOW_SHARING` | **OFF** | Share buttons everywhere | Lesson complete share (text + link), Daily Rook share (image card), puzzle result share button | Flip to `true`. OG images, native share, download fallback all working. QA on iOS/Android. |

**File:** `lib/config/feature-flags.ts`

---

## Dead Analytics (defined, never called)

These events exist in `lib/analytics/posthog.ts` but are never fired from any production code:

| Event | Group | Impact | Where it should fire |
|-------|-------|--------|---------------------|
| `paywall_viewed` | SubscriptionEvents | **CRITICAL** — can't measure conversion | `LessonLimitModal` on open, lesson gate screen |
| `pricing_viewed` | SubscriptionEvents | **CRITICAL** | `/pricing` page mount |
| `checkout_started` | SubscriptionEvents | **CRITICAL** | `startCheckout()` / `startGuestCheckout()` |
| `checkout_completed` | SubscriptionEvents | **CRITICAL** | Stripe success redirect |
| `checkout_abandoned` | SubscriptionEvents | High | Stripe cancel redirect |
| `daily_challenge_viewed` | EngagementEvents | High | `/daily-challenge` mount |
| `daily_challenge_started` | EngagementEvents | High | Start button click |
| `daily_challenge_completed` | EngagementEvents | High | Game finish |
| `lesson_abandoned` | LearningEvents | Medium | User navigating away mid-lesson |
| `tree_level_viewed` | LearningEvents | Medium | `/learn` page level scroll |
| `logout` | AuthEvents | Low | Sign out button |
| `streak_updated` | EngagementEvents | Low | Streak increment |
| `profile_viewed` | EngagementEvents | Low | No profile page exists yet |

### Should delete (features removed):
| Event | Group | Reason |
|-------|-------|--------|
| `workout_started` | EngagementEvents | Workout feature deleted |
| `workout_puzzle_completed` | EngagementEvents | Workout feature deleted |
| ALL 7 `OnboardingEvents` | OnboardingEvents | Onboarding flow archived |

---

## Test Pages (31 total)

All publicly accessible at `/test-*`. Not blocked from crawlers.

### Prototypes (should ship or archive)
| Route | What | Production route? | Status |
|-------|------|-------------------|--------|
| `/test-tutorial` | 6-puzzle beginner tutorial with scaffolding | Should replace lesson 1.1.1 | Uncommitted |
| `/test-kings-path` | Fog-of-war chess minigame | Needs `/kings-path` route | Uncommitted |
| `/test-daily-video` | Instagram reel generator (4 stages) | Content tool, may stay as test | Uncommitted |

### Dev tools (keep, but block from crawlers)
| Route | What |
|-------|------|
| `/test-chess` | Interactive puzzle solver |
| `/test-sounds` | Audio preview |
| `/test-celebration` | LessonCompleteScreen preview |
| `/test-pwa` | PWA install prompt testing |

### Design previews (served their purpose, consider archiving)
| Route | What |
|-------|------|
| `/test-animated-logo` | Logo sizes/variants |
| `/test-rook-animations` | Correct/wrong answer rook animations |
| `/test-lesson-animations` | Lesson answer animations (uncommitted) |
| `/test-section-animations` | Section expand/collapse (uncommitted) |
| `/test-app-icons` | App icon centering audit (uncommitted) |
| `/test-quotes` | Celebration quote tiers |
| `/test-share` | Static share card mockups |
| `/test-share-cards` | OG image share card variants |
| `/test-share-preview` | OG image renderer |
| `/test-story-cards` | Daily Rook share card |
| `/test-guest-daily` | Guest daily challenge finish |
| `/test-theme-help` | Chess theme explanations |
| `/test-theme-connections` | Puzzle theme connections |
| `/test-login-button` | Login button styles |
| `/test-header-buttons` | Header button styles |
| `/test-learn-logout-buttons` | Learn/logout buttons |
| `/test-sections` | Section expand/collapse |
| `/test-backgrounds` | Background variants |
| `/test-landing` | 3 landing page A/B variants |
| `/test-about` | 3 about page variants |
| `/test-curriculum-layout` | Tree layout variations |
| `/test-curriculum-v2` | V2 curriculum browser |
| `/test-level-designs` | Level badge/card designs |
| `/test-ends-means` | Ends & means curriculum |

**Action needed:** Add middleware or `robots.txt` to block `/test-*` from crawlers.

---

## Orphaned Pages

| Page | Problem | Fix |
|------|---------|-----|
| `/auth/welcome` | Signup flow skips it, goes straight to `/learn` | Wire into signup redirect |
| `/gift/welcome` | CTA links to `/onboarding` which was deleted | Fix CTA to link to `/learn` |
| `/flagged` | No "flag puzzle" button exists in puzzle UI | Add flag button or remove page |
| `/brand` | Internal tool, not linked anywhere | Fine as-is, link from admin if desired |

---

## Built Systems Not Deployed

### Email System (5 templates, 3 cron jobs)
- **Templates:** Welcome, Streak Warning, Streak Lost, Weekly Digest, Re-Engagement
- **Code:** `lib/email/templates/`, `lib/email/send.ts`, `app/api/cron/streak-check/`, `weekly-digest/`, `re-engagement/`
- **Status:** `vercel.json` has `"crons": []` — explicitly disabled
- **To ship:** Set `CRON_SECRET` + `RESEND_API_KEY` env vars, add cron schedules to `vercel.json`, test delivery
- **Effort:** Medium

### King's Path (fog-of-war minigame)
- **Code:** `app/test-kings-path/` (uncommitted), `KINGS-PATH-RULES.md`
- **Status:** Playable demo with 4 hand-crafted levels
- **To ship:** Production route, daily puzzle generator, scoring, share cards, DB table
- **Effort:** Large

### Beginner Tutorial
- **Code:** `app/test-tutorial/` (uncommitted)
- **Status:** 6 puzzles with progressive scaffolding, fully interactive
- **To ship:** Wire into lesson 1.1.1, persist completion, analytics
- **Effort:** Medium

### Daily Puzzle Video
- **Code:** `app/test-daily-video/` (uncommitted), `.claude/daily-puzzle-video-rules.md`
- **Status:** 4-stage mockup, not producing actual video
- **To ship:** Decide: content tool vs user feature. Fix logo consistency bug.
- **Effort:** Medium

---

## Agent System

### Status: Built, never used

14 agents defined, 0 dispatched this week. See `AGENTS.md` for full details.

**Issues found:**
- 4 agent files never committed (design-system, growth, pwa, responsive)
- 3 agents missing from CLAUDE.md dispatch table (Levels, PWA, Responsive)
- 4 agent files reference deleted `lib/chess-utils.ts` (should be `puzzle-utils.ts`)

---

## Uncommitted Work

### Should commit now
| What | Files | Why |
|------|-------|-----|
| Design token sweep | 10 pages + 4 components | Production visual consistency |
| Signup bug fix | `app/auth/signup/page.tsx` | Duplicate email detection broken |
| Daily challenge API | `app/api/daily-challenge/puzzles/route.ts` | `force-dynamic` prevents stale cache |
| Agent system files | 4 agent .md files + AGENTS.md | Need these committed to use agents |
| Design system doc | `.claude/design-system.md` | Reference doc for all visual work |
| sharp package | `package.json` | Image processing dependency |
| Planning & rules docs | `PLANNING.md`, `KINGS-PATH-RULES.md`, video rules | Documentation |
| Sound files | 2 Lichess mp3s | Already used in production |

### Should .gitignore
| What | Why |
|------|-----|
| 14 `chesspath-*.html` prototypes | Standalone design experiments |
| 5 asset directories (`*-animations/`, `*-assets/`) | Binary design files |
| `ads/` | Ad creative experiments |
| `social-media/` | Social content generation scripts |
| `Chess-Path-Duolingo-Quality-Audit.pdf` | Reference doc, not code |

### Decide
| What | Options |
|------|---------|
| 58 puzzle JSON re-sorts (~900K lines) | Commit as separate "Re-sort puzzle pools" or revert |
| `_archive/` directory | Commit or .gitignore |
| 6 uncommitted test pages | Commit for collaboration or keep local |

---

## Quick Wins (flip today, ship today)

| # | What | Effort | Impact |
|---|------|--------|--------|
| 1 | `SHOW_STREAK_COUNTER: true` | 1 line | Retention |
| 2 | `SHOW_SHARING: true` | 1 line | Growth |
| 3 | Wire `SubscriptionEvents` (paywall, pricing, checkout) | ~30 min | Conversion data |
| 4 | Wire `EngagementEvents` (daily challenge start/complete) | ~15 min | Engagement data |
| 5 | Fix `/gift/welcome` broken CTA | 1 line | Bug fix |
| 6 | Block `/test-*` from crawlers | ~10 min | SEO |
| 7 | Commit agent system files | `git add` | Unblock agent workflow |

---

*When a feature moves from this doc to production, delete it from here. This list should shrink over time, not grow.*
