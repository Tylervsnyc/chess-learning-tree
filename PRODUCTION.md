# PRODUCTION.md — What's Built vs What's Live

**Last updated:** Feb 11, 2026

This is the single source of truth for features that are built but not yet live. If you build something, it goes here until it ships.

---

## Feature Flags

| Flag | Status | Feature | What's hidden | To ship |
|------|--------|---------|--------------|---------|
| `SHOW_STREAK_COUNTER` | **OFF** | Streak fire badge in NavHeader | Fire emoji + streak count on `/learn` and `/daily-challenge` | Flip to `true`. Data pipeline fully wired. |
| `SHOW_SHARING` | **OFF** | Share buttons everywhere | Lesson complete share (text + link), Daily Rook share (image card), puzzle result share button | Flip to `true`. OG images, native share, download fallback all working. QA on iOS/Android. |
| `FREE_UNTIL_MARCH` | **ON** | Free lessons until March 1 | All lessons unlocked without subscription | Auto-expires March 1. Remove flag + `usePermissions.ts` check after. |

**File:** `lib/config/feature-flags.ts`

---

## Dead Analytics (defined, never called)

Critical analytics were wired on Feb 11 (commit `9abf8d1`). Remaining unwired events:

| Event | Group | Impact | Where it should fire |
|-------|-------|--------|---------------------|
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
| `/test-tutorial` | 6-puzzle beginner tutorial with scaffolding | **Shipped** — wired into lesson 1.1.1 | Committed |
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

### Tutorial System — SHIPPED + EXPANDED
- **Code:** `app/lesson/[lessonId]/page.tsx`, `data/theme-tutorials.ts`, `components/tutorial/TutorialFlow.tsx`
- **Status:** Live — lesson 1.1.1 has guided tutorial (6 queen checkmate puzzles). All 12 Level 1 lessons have theme-specific intro screens + yellow hint cards.
- **Docs:** RULES.md section 17b
- **Next:** Extend to Level 2+

### Promo Code System — REMOVED (Feb 11)
- **Deleted:** `/api/promo/redeem`, `/redeem`, `/gift/*` pages, `supabase/promo-codes.sql` (~400 lines)
- **Replaced by:** Free lessons until March 1 feature flag

### Daily Rook Personal Bests — SHIPPED (Feb 11)
- **Code:** `/api/daily-challenge/personal-best/route.ts`, `app/daily-challenge/page.tsx`
- **Status:** Live — replaced Top 10 leaderboard with "My Best" personal scores on results screen

### Daily Puzzle Video
- **Code:** `app/test-daily-video/`, `.claude/daily-puzzle-video-rules.md`, Remotion pipeline
- **Status:** Remotion pipeline added (Feb 11) — can render actual video. Per-day output folders.
- **To ship:** Real puzzle data integration, fix logo consistency, decide distribution method
- **Effort:** Medium

---

## Agent System

### Status: Finalized (Feb 11)

14 agents defined, all committed. Stale refs fixed. CLAUDE.md dispatch table complete. See `AGENTS.md` for full details.

---

## Uncommitted Work

### Should commit now
| What | Files | Why |
|------|-------|-----|
| Design token sweep | ~15 pages + components | Production visual consistency |
| useProgress changes | `hooks/useProgress.ts` | Progress sync improvements |
| Puzzle data re-sorts | ~58 JSON files in `data/clean-puzzles-v2/` | Consistent ordering (~900K lines) |

### Should .gitignore
| What | Why |
|------|-----|
| 14 `chesspath-*.html` prototypes | Standalone design experiments |
| 5 asset directories (`*-animations/`, `*-assets/`) | Binary design files |
| `ads/` | Ad creative experiments |
| `social-media/` | Social content generation scripts |
| `Chess-Path-Duolingo-Quality-Audit.pdf` | Reference doc, not code |
| `_archive/` directory | Old code archive |

### Previously uncommitted, now committed (Feb 11)
- Agent system files (14 agents + AGENTS.md) ✅
- Signup duplicate email fix ✅
- Critical analytics wiring ✅
- CLAUDE.md slim-down ✅

---

## Quick Wins (flip today, ship today)

| # | What | Effort | Impact |
|---|------|--------|--------|
| 1 | `SHOW_STREAK_COUNTER: true` | 1 line | Retention |
| 2 | `SHOW_SHARING: true` | 1 line | Growth |
| 3 | Block `/test-*` from crawlers | ~10 min | SEO |
| 4 | Commit design token sweep + puzzle re-sorts | `git add` | Visual consistency |
| 5 | Remove `FREE_UNTIL_MARCH` flag after March 1 | Cleanup | — |

---

*When a feature moves from this doc to production, delete it from here. This list should shrink over time, not grow.*
