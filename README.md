# The Chess Path

A mobile-first chess learning app that teaches tactics through interactive puzzles organized in a skill tree curriculum. Think Duolingo for chess.

**Live features:**
- 3-level curriculum (168 lessons) from beginner to advanced
- Puzzle-based lessons with immediate feedback
- Daily challenge with adaptive ELO (400→2000) and global leaderboard
- Streak tracking displayed in header
- Level tests to skip ahead
- Premium subscriptions via Stripe

**Documentation:**
- **[RULES.md](./RULES.md)** - Source of truth for all app behavior
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant instructions and coding conventions

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Required environment variables** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key  # for admin features
STRIPE_SECRET_KEY=your-stripe-key           # for subscriptions
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email + Google OAuth) |
| Chess Logic | chess.js |
| Board UI | react-chessboard |
| Payments | Stripe |
| Analytics | PostHog |

---

## Project Structure

```
app/                        # Next.js pages and API routes
├── api/                   # Backend endpoints
├── auth/                  # Login, signup, OAuth callback
├── learn/                 # Main curriculum tree page
├── lesson/[lessonId]/     # Puzzle-solving experience
├── level-test/[transition]/ # Level unlock tests
├── daily-challenge/       # Daily challenge mode
├── pricing/               # Subscription plans
└── admin/                 # Admin tools

components/                # React components by feature
├── puzzle/               # Chessboard, feedback, progress bar
├── tree/                 # Curriculum visualization
├── layout/               # Header, containers
└── prompts/              # Signup prompts

data/                      # Curriculum and puzzle data
├── staging/              # V2 curriculum definitions
│   ├── level1-v2-curriculum.ts
│   ├── level2-v2-curriculum.ts
│   └── level3-v2-curriculum.ts
├── lesson-pools/         # Pre-computed puzzle pools (40 per lesson)
├── puzzles-by-rating/    # Lichess CSV files
│   ├── 0400-0800/
│   ├── 0800-1200/
│   ├── 1200-1600/
│   ├── 1600-2000/
│   └── 2000-plus/
├── clean-puzzles-v2/     # Filtered puzzle JSONs
└── level-unlock-tests.ts # Level test configurations

lib/                       # Core utilities
├── curriculum-registry.ts # SINGLE SOURCE OF TRUTH for levels
├── puzzle-selector.ts     # Puzzle selection algorithm
├── puzzle-utils.ts        # Move parsing and transformation
├── progress-sync.ts       # Client-server data sync
├── sounds.ts              # Sound effects
├── config/
│   └── feature-flags.ts   # Feature toggles
└── supabase/             # Database clients

hooks/                     # React hooks
├── useProgress.ts        # Lesson completion, unlocking
├── useUser.ts            # Auth state
└── usePermissions.ts     # Limits and access

types/                     # TypeScript definitions
└── curriculum.ts         # Level, Block, Section, Lesson types
```

---

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing (new users) or redirect to /learn (returning) |
| `/about` | Step 2 of new user flow |
| `/learn` | Main curriculum tree |
| `/lesson/[lessonId]` | Puzzle solving (6 puzzles per lesson) |
| `/level-test/[transition]` | Level unlock tests (10 puzzles) |
| `/daily-challenge` | Daily challenge with timer and lives |
| `/pricing` | Subscription plans |
| `/auth/login` | Login |
| `/auth/signup` | Signup |
| `/admin/*` | Admin tools |

---

## Naming Conventions (Dot Notation)

All IDs use dot notation for consistency:

| Thing | Format | Example |
|-------|--------|---------|
| Level | `{level}` | `1`, `2`, `5` |
| Section ID | `{level}.{section}` | `1.3`, `5.12` |
| Lesson ID | `{level}.{section}.{lesson}` | `1.3.2`, `5.12.4` |
| Quip ID | `{level}.{section}.{type}.{number}` | `1.1.g.01`, `2.6.fork.03` |

Quip types: `g` (general), `fork`, `pin`, `mateIn1`, `mateIn2`, `skewer`, etc.

---

# The Curriculum System

## Overview

The curriculum is a **strict hierarchy**:

```
Level (e.g., "Level 1: How to Lose Friends")
└── Block (e.g., "End the Game")
    └── Section (e.g., "Mate in One: Queen & Rook")
        └── Lesson (e.g., "Queen Checkmate: Easy")
```

Each level has **4 blocks**. Each block has **4 sections**. Each section has **4 lessons**.

**Current curriculum:**
| Level | Name | Rating Range | Lessons |
|-------|------|-------------|---------|
| 1 | How to Lose Friends | 400-800 ELO | 56 lessons |
| 2 | The Assassin's Toolkit | 800-1200 ELO | 56 lessons |
| 3 | Never Apologize for Being Great | 1000-1250 ELO | 56 lessons |

## The Single Source of Truth

**File: `lib/curriculum-registry.ts`**

This is the ONLY place that defines how levels work. Everything else derives from it.

```typescript
export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    data: level1V2,              // Imported curriculum data
    puzzleDir: '0400-0800',      // Puzzle CSV folder
    treeId: '400-800',           // Progress tracking ID
    color: '#58CC02',            // UI color (green)
    darkColor: '#3d8c01',        // Shadow color
  },
  // ...
];
```

---

# The Daily Challenge

## Rules

| Rule | Value |
|------|-------|
| Timer | 5 minutes |
| Lives | 3 (3 wrong = out) |
| Starting ELO | 400 |
| Correct answer | +200 ELO |
| Wrong answer | Same ELO |
| Same puzzles for all users | Yes (seeded by date) |

## Puzzle Pool Per Day

| ELO Range | Puzzles |
|-----------|---------|
| 400-1800 | 3 each |
| 2000 | 10 |

## Win Conditions
- Complete all 2000 ELO puzzles, OR
- Timer runs out, OR
- Lose 3 lives

## Leaderboard
- Top 10 by default + toggle to see your rank
- Today only (no history)
- Sort: Puzzles completed (desc), then completion time (asc)

---

# The Level Test System

## Overview

Users can skip ahead by passing a **level test**. Tests validate readiness for the next level.

## Test Rules

| Rule | Value |
|------|-------|
| Puzzles | 10 |
| Pass requirement | 2 or fewer wrong |
| Must complete | All 10 puzzles |
| Retry | Unlimited, immediate |

## On Pass

1. Level unlocks
2. All previous lessons unlock
3. Navigate to `/learn?scrollTo={firstLessonOfNewLevel}`

---

# The Puzzle Pipeline

## Overview

Puzzles flow through this pipeline:

```
Lichess Database
    ↓
CSV Files (by rating bracket)
    ↓
Clean Puzzles (filtered JSON by theme)
    ↓
Lesson Pools (40 pre-computed puzzles per lesson)
    ↓
API Route (selection: 2 easy, 3 medium, 1 hard)
    ↓
Client (transformation + display)
```

## Step 1: Lichess CSVs

**Location:** `data/puzzles-by-rating/`

```
0400-0800/          # ~130k puzzles
├── fork.csv
├── pin.csv
├── mateIn1.csv
└── [25+ theme files]
0800-1200/
1200-1600/
1600-2000/
2000-plus/
```

### CRITICAL: Lichess Puzzle Format

**The first move in `Moves` is the OPPONENT'S move, not the player's!**

```
FEN: Position BEFORE opponent's setup move
Moves[0]: Opponent's move (creates the tactic)
Moves[1+]: Player's solution moves
```

To display a puzzle:
1. Load the FEN
2. Apply `Moves[0]` to get the actual puzzle position
3. Player solves from `Moves[1]` onward

## Step 2: Lesson Pools

**Location:** `data/lesson-pools/{lessonId}.json` (e.g., `1.3.2.json`)

- 40 puzzles per lesson pool
- Verified at build time to match criteria

## Step 3: Puzzle Selection

On lesson start:
1. Load pool file
2. Filter out recently seen (puzzle_history, last 30 days)
3. Pick 6 random: 2 easy, 3 medium, 1 hard
4. Record seen puzzles to puzzle_history

---

# Database Schema

**File:** `supabase/schema.sql`

## Core Tables

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

## Row Level Security

All tables have RLS enabled. Users can only access their own data via `auth.uid() = user_id`.

---

# How to Add a New Level

See **RULES.md Section 29** for the complete checklist:

1. Create curriculum file: `/data/staging/levelN-v2-curriculum.ts`
2. Register in: `/lib/curriculum-registry.ts`
3. Ensure puzzle CSVs exist for the rating range
4. Generate puzzle pools to `/data/lesson-pools/`
5. Add level test config in `/data/level-unlock-tests.ts`
6. Add section quips and global theme quips
7. Use unique section IDs with dot notation: `N.1`, `N.2`, etc.
8. Follow content guidelines (no death/violence language)
9. Test everything

---

# API Routes Reference

## Progress

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/progress` | GET | Fetch user's complete progress |
| `/api/progress` | POST | Record lesson/puzzle completion |
| `/api/progress/sync` | POST | Bulk sync localStorage to server |

## Puzzles

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/puzzles/lesson` | GET | Get 6 puzzles for a lesson |
| `/api/puzzles` | GET | Random puzzles (daily challenge) |
| `/api/puzzles/by-theme` | GET | Theme-specific puzzles |

## Level Tests

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/level-test` | GET | Get test puzzles for transition |
| `/api/level-test` | POST | Record test attempt result |

## Auth

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/logout` | GET/POST | Sign out user |
| `/api/auth/callback` | GET | OAuth callback handler |

## Subscription

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/subscription/status` | GET | Check subscription |
| `/api/stripe/checkout` | POST | Create Stripe session |
| `/api/stripe/webhook` | POST | Handle Stripe events |

---

# Key Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Check for code issues
```

---

# Contributing

1. **Read `RULES.md` first** - Source of truth for all behavior
2. **Read `CLAUDE.md`** - Coding conventions and golden rules
3. All files use TypeScript
4. Use `'use client'` for interactive components
5. Styling: Tailwind CSS with dark theme
6. Mobile-first: All pages use `MobileContainer` wrapper

---

# License

Private - All rights reserved.
