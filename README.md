# The Chess Path

A mobile-first chess learning app that teaches tactics through interactive puzzles organized in a skill tree curriculum. Think Duolingo for chess.

**Live features:**
- 3-level curriculum (168 lessons) from beginner to intermediate
- Puzzle-based lessons with immediate feedback
- Streak tracking and gamification
- Daily challenges with lives and timer
- Unlimited workout mode
- Profile with skill bubble visualization
- Premium subscriptions via Stripe

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
| Visualization | D3.js (force layout) |
| Payments | Stripe |
| Analytics | PostHog |
| Email | Resend + React Email |

---

## Project Structure

```
app/                        # Next.js pages and API routes
├── api/                   # Backend endpoints (37 routes)
├── auth/                  # Login, signup, OAuth callback
├── learn/                 # Main curriculum tree page
├── lesson/[lessonId]/     # Puzzle-solving experience
├── level-test/[transition]/ # Level unlock tests
├── daily-challenge/       # Timed daily puzzle mode
├── workout/               # Unlimited practice
├── profile/               # User stats and skills
├── pricing/               # Subscription plans
└── admin/                 # Admin tools

components/                # React components by feature
├── puzzle/               # Chessboard, feedback, progress bar
├── tree/                 # Curriculum visualization
├── onboarding/           # First-run experience
└── subscription/         # Paywalls and limits

data/                      # Curriculum and puzzle data
├── staging/              # V2 curriculum definitions
│   ├── level1-v2-curriculum.ts
│   ├── level2-v2-curriculum.ts
│   └── level3-v2-curriculum.ts
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
└── supabase/             # Database clients

hooks/                     # React hooks
├── useProgress.ts        # Lesson completion, streaks
├── useUser.ts            # Auth state
└── usePermissions.ts     # Free vs premium access

types/                     # TypeScript definitions
└── curriculum.ts         # Level, Block, Section, Lesson types
```

---

# The Curriculum System

## Overview

The curriculum is a **strict hierarchy**:

```
Level (e.g., "Level 1: Beginner")
└── Block (e.g., "End the Game")
    └── Section (e.g., "Mate in One: Queen & Rook")
        └── Lesson (e.g., "Queen Checkmate: Easy")
```

Each level has **4 blocks**. Each block has **4 sections**. Each section has **4 lessons**.

**Current curriculum:**
| Level | Name | Rating Range | Lessons |
|-------|------|-------------|---------|
| 1 | Beginner | 400-800 ELO | 56 lessons |
| 2 | Intermediate | 800-1200 ELO | 56 lessons |
| 3 | Advanced | 1000-1250 ELO | 56 lessons |

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
  {
    level: 2,
    data: level2V2,
    puzzleDir: '0800-1200',
    treeId: '800-1200',
    color: '#1CB0F6',            // Blue
    darkColor: '#1487c0',
  },
  {
    level: 3,
    data: level3V2,
    puzzleDir: '0800-1200',      // Uses same puzzle dir as L2
    treeId: '1200+',
    color: '#CE82FF',            // Purple
    darkColor: '#a855c7',
  },
];
```

## Lesson ID Format

Every lesson has a unique ID: **`X.Y.Z`**

- **X** = Level number (1, 2, 3, ...)
- **Y** = Block number within level (1-4)
- **Z** = Lesson number within block (1-4, mapping to sections)

Examples:
- `1.1.1` = Level 1, Block 1, Lesson 1
- `2.3.4` = Level 2, Block 3, Lesson 4
- `3.4.4` = Level 3, Block 4, Lesson 4 (last lesson of Level 3)

## Type Definitions

**File: `types/curriculum.ts`**

```typescript
interface LessonCriteria {
  id: string;                    // "1.2.3"
  name: string;                  // "Knight Fork: Basics"
  description: string;           // What to learn
  requiredTags: string[];        // Puzzle themes (ALL must match)
  excludeTags?: string[];        // Themes to exclude
  ratingMin: number;             // Min puzzle difficulty
  ratingMax: number;             // Max puzzle difficulty
  pieceFilter?: 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  minPlays?: number;             // Quality threshold (default 1000)
  isMixedPractice?: boolean;     // true = ANY theme matches
  mixedThemes?: string[];        // For mixed practice lessons
}

interface Section {
  id: string;                    // "sec-1"
  name: string;                  // "Fork Basics"
  description: string;
  themeIntroMessage?: string;    // Popup on first lesson
  isReview?: boolean;            // Mixed practice section
  lessons: LessonCriteria[];
}

interface Block {
  id: string;                    // "block-1"
  name: string;                  // "End the Game"
  description: string;
  blockIntroMessage?: string;    // Popup on first lesson
  sections: Section[];
}

interface Level {
  id: string;                    // "level-1"
  name: string;                  // "Level 1: How to Lose Friends"
  ratingRange: string;           // "400-800"
  blocks: Block[];
}
```

## Lesson Selection Rules

When fetching puzzles for a lesson, the system uses these criteria:

| Field | Behavior |
|-------|----------|
| `requiredTags` | ALL tags must be present in puzzle |
| `excludeTags` | NO tags can be present |
| `ratingMin/Max` | Puzzle difficulty must be in range |
| `pieceFilter` | First solution move must use this piece |
| `minPlays` | Puzzle must have this many Lichess plays |
| `isMixedPractice` | If true, ANY `mixedThemes` can match |

## Block and Section Pattern

**Blocks 1-3** follow this structure:
- 3 content sections (focused tactics)
- 1 review section (mixed practice with `isMixedPractice: true`)

**Block 4** is the level final:
- 2 review sections (cumulative practice)

**Progressive difficulty within sections:**
```typescript
// Section: Fork Basics
lessons: [
  { id: '1.1.1', ratingMin: 400, ratingMax: 500 },  // Easiest
  { id: '1.1.2', ratingMin: 450, ratingMax: 550 },  // Slightly harder
  { id: '1.1.3', ratingMin: 500, ratingMax: 600 },  // Medium
  { id: '1.1.4', ratingMin: 550, ratingMax: 700 },  // Hardest
]
```

---

# The Level Test System

## Overview

Users can skip ahead by passing a **level test**. Tests validate readiness for the next level.

## Transition Format

A transition is written as **`X-Y`** where:
- **X** = Current level (1-7)
- **Y** = Target level to unlock (2-8)

Available transitions: `1-2`, `2-3`, `3-4`, `4-5`, `5-6`, `6-7`, `7-8`

## Test Rules (Hardcoded)

**File: `data/level-unlock-tests.ts`**

```typescript
LEVEL_TEST_CONFIG = {
  puzzleCount: 10,        // Exactly 10 puzzles
  maxWrongAnswers: 3,     // Fail if 3+ wrong
  passingScore: 7,        // Need 7/10 correct
}
```

**Pass condition:** Complete all 10 puzzles with at least 7 correct (max 2 wrong)

**Fail condition:** Either 3 wrong answers OR less than 7 correct after all 10

## Test Variants (Anti-Memorization)

Each transition has **5 variants** with different theme combinations:

```typescript
'1-2': {
  fromLevel: 1,
  toLevel: 2,
  ratingMin: 800,
  ratingMax: 1000,
  variants: [
    { id: '1-2-v1', themes: ['fork', 'pin', 'mateIn1', 'hangingPiece'] },
    { id: '1-2-v2', themes: ['skewer', 'discoveredAttack', 'mateIn1', 'fork'] },
    { id: '1-2-v3', themes: ['pin', 'trappedPiece', 'hangingPiece', 'backRankMate'] },
    { id: '1-2-v4', themes: ['fork', 'discoveredAttack', 'mateIn1', 'skewer'] },
    { id: '1-2-v5', themes: ['mateIn1', 'pin', 'fork', 'trappedPiece'] },
  ],
}
```

**Variant selection:** System picks the least-recently-used variant for each user.

## Puzzle Selection for Tests

1. Uses puzzles from the **TARGET level's** rating range
2. For `1-2` test: Uses Level 2 puzzles (800-1000 rating)
3. Pulls from `data/clean-puzzles-v2/level{N}-{theme}.json`
4. Distributes evenly across variant themes
5. Shuffles and takes exactly 10

## On Pass

When a user passes:
1. `unlockLevel(targetLevel)` adds level to `profiles.unlocked_levels`
2. `setStartingLesson(firstLessonId)` unlocks the first lesson
3. User redirected to `/learn` to start new level

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
API Route (selection algorithm)
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

**CSV columns:**
```
PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
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

## Step 2: Clean Puzzle Extraction

**Script:** `scripts/extract-clean-puzzles.ts`

**Output:** `data/clean-puzzles-v2/`

```
level1-fork.json      # 4361 fork puzzles, 400-800 rating
level2-pin.json       # Pin puzzles, 800-1200 rating
level3-mateIn2.json   # Mate in 2, 1200+ rating
[100+ files]
```

**Quality filters:**
- Level 1: 1000+ plays minimum
- Level 2-3: 3000+ plays minimum
- Single primary theme (community-vetted)

## Step 3: API Selection

**Route:** `GET /api/puzzles/lesson`

**Parameters:**
```
themes=fork,pin       # Required themes
ratingMin=400         # Min difficulty
ratingMax=600         # Max difficulty
mixed=true|false      # ANY vs ALL theme matching
pieceFilter=queen     # Optional: filter by solving piece
excludeThemes=mateIn1 # Optional: themes to exclude
```

**Selection algorithm** (`lib/puzzle-selector.ts`):

1. Load candidate puzzles matching criteria
2. Split into 3 tiers by difficulty:
   - **Tier 1** (easy): Bottom 30%
   - **Tier 2** (medium): Middle 40%
   - **Tier 3** (hard): Top 30%
3. Check diversity (no similar solutions)
4. Select 2-2-2 pattern: 2 easy, 2 medium, 2 hard
5. Return 6 puzzles

## Step 4: Client Transformation

**Function:** `transformPuzzle()` in `lib/puzzle-utils.ts`

```typescript
// Input: Raw Lichess puzzle
{
  fen: "original position",
  moves: "e2e4 d7d5 e4d5"  // First move is opponent's
}

// Output: Ready for display
{
  fen: "original position",
  puzzleFen: "position after opponent's move",  // What player sees
  solutionMoves: ["d5"],  // Player's correct moves
  playerColor: "white"
}
```

## Available Puzzle Themes

**Checkmates:** mateIn1, mateIn2, mateIn3, backRankMate, smotheredMate, arabianMate, hookMate

**Tactics:** fork, skewer, pin, deflection, attraction, discoveredAttack, clearance, interference, xray

**Material:** hangingPiece, trappedPiece, crushing, exposedKing

**Endgames:** rookEndgame, pawnEndgame, knightEndgame, bishopEndgame, queenEndgame

**Other:** quietMove, sacrifice, promotion, defensiveMove

---

# How to Add a New Level

## Step 1: Create Curriculum File

Create `data/staging/level4-v2-curriculum.ts`:

```typescript
import { Level } from '@/types/curriculum';

export const level4V2: Level = {
  id: 'level-4',
  name: 'Level 4: Club Player',
  ratingRange: '1200-1600',
  blocks: [
    {
      id: 'block-1',
      name: 'Block 1 Name',
      description: 'What this block teaches',
      blockIntroMessage: `Welcome to Level 4!

Your intro message here.`,
      sections: [
        {
          id: 'sec-1',
          name: 'Section Name',
          description: 'Section description',
          themeIntroMessage: `Section intro message.`,
          lessons: [
            {
              id: '4.1.1',
              name: 'First Lesson',
              description: 'Description',
              requiredTags: ['fork'],
              ratingMin: 1200,
              ratingMax: 1350,
              minPlays: 1000,
            },
            // 3 more lessons for this section
          ],
        },
        // 3 more sections for this block
      ],
    },
    // 3 more blocks
  ],
};
```

## Step 2: Register in Curriculum Registry

Edit `lib/curriculum-registry.ts`:

```typescript
// Add import
import { level4V2 } from '@/data/staging/level4-v2-curriculum';

// Add to LEVELS array
export const LEVELS: LevelConfig[] = [
  // ... existing levels
  {
    level: 4,
    data: level4V2,
    puzzleDir: '1200-1600',     // Must match puzzle CSV folder
    treeId: '1200-1600',
    color: '#FF9500',           // Choose a color
    darkColor: '#cc7700',
  },
];
```

## Step 3: Ensure Puzzles Exist

Verify `data/puzzles-by-rating/1200-1600/` has CSV files for your themes:
- `fork.csv`
- `pin.csv`
- `mateIn2.csv`
- etc.

## Step 4: Add Level Test (Optional)

Edit `data/level-unlock-tests.ts`:

```typescript
'3-4': {
  fromLevel: 3,
  toLevel: 4,
  ratingMin: 1200,
  ratingMax: 1400,
  levelKey: 'club',
  variants: [
    { id: '3-4-v1', themes: ['mateIn2', 'fork', 'pin', 'discoveredAttack'] },
    { id: '3-4-v2', themes: ['deflection', 'skewer', 'mateIn2', 'fork'] },
    // 3 more variants
  ],
},
```

## Step 5: Test

```typescript
import { getLevelConfig, getLessonById } from '@/lib/curriculum-registry';

// These should work
getLevelConfig(4);           // Returns Level 4 config
getLessonById('4.1.1');      // Returns first lesson
```

Then:
1. Run `npm run dev`
2. Navigate to `/learn`
3. Verify Level 4 appears (if unlocked)
4. Test a lesson loads puzzles correctly

---

# Database Schema

**File:** `supabase/schema.sql`

## Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts, ELO, subscription, progress |
| `lesson_progress` | Completed lessons per user |
| `puzzle_attempts` | Every puzzle attempt (for analytics) |
| `theme_performance` | Aggregated stats per theme |
| `daily_challenges` | Daily puzzle completion tracking |
| `level_test_attempts` | Level test history |

## Key Columns in `profiles`

```sql
id UUID PRIMARY KEY REFERENCES auth.users,
email TEXT,
display_name TEXT,
elo_rating INTEGER DEFAULT 400,
subscription_status TEXT DEFAULT 'free',
current_streak INTEGER DEFAULT 0,
best_streak INTEGER DEFAULT 0,
current_lesson_id TEXT,
current_level INTEGER DEFAULT 1,
unlocked_levels INTEGER[] DEFAULT '{1}',
lessons_completed_today INTEGER DEFAULT 0,
is_admin BOOLEAN DEFAULT FALSE
```

## Row Level Security

All tables have RLS enabled. Users can only access their own data via `auth.uid() = user_id`.

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
| `/api/puzzles` | GET | Random puzzles (workout/daily) |
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
npm run test:e2e     # Run Playwright tests
npm run email:dev    # Preview email templates
```

---

# Contributing

1. Read `CLAUDE.md` for detailed coding conventions
2. All files use TypeScript
3. Use `'use client'` for interactive components
4. Styling: Tailwind CSS with dark theme
5. Mobile-first: All pages use `MobileContainer` wrapper

**Before adding features:** Check the "Pre-Flight Checklist" in `CLAUDE.md` to verify database, API, and UI layers exist.

---

# License

Private - All rights reserved.
