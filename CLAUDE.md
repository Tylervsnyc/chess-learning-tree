# CLAUDE.md - The Chess Path

This file helps Claude understand the project and work more effectively.

## Project Overview

**The Chess Path** is a mobile-first chess learning web app that teaches tactics through interactive puzzles organized in a skill tree curriculum. Think Duolingo for chess.

## Tech Stack

- **Framework**: Next.js 16 with App Router (React 19, TypeScript)
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS (dark theme)
- **Chess Logic**: chess.js + react-chessboard
- **Visualization**: D3.js for skill bubbles

## Key Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Check for code issues
```

## Project Structure

```
app/                    # Pages and API routes
├── api/               # Backend endpoints
├── auth/              # Login/signup pages
├── learn/             # Main curriculum tree
├── lesson/[lessonId]/ # Individual lessons
├── puzzle/[themeId]/  # Puzzle solving
├── daily-challenge/   # Daily puzzle
├── workout/           # Unlimited practice
└── profile/           # User stats

components/            # Reusable UI pieces
├── tree/             # Curriculum tree components
├── puzzle/           # Chess board & feedback
├── layout/           # Headers, containers
└── ui/               # Icons, buttons

data/                  # Curriculum & puzzle data
├── level1-curriculum.ts  # Beginner (400-800 ELO)
├── level2-curriculum.ts  # Intermediate (800-1200)
├── level3-curriculum.ts  # Advanced (1200+)
└── puzzles-by-rating/    # Lichess puzzle CSVs

hooks/                 # Custom React hooks
lib/                   # Utilities (Supabase client, chess helpers)
types/                 # TypeScript definitions
supabase/             # Database schema
```

## Coding Conventions

### React Components
- Use `'use client'` at top of files with interactivity (buttons, state, effects)
- Server components are default for layouts and data fetching
- Keep components small and focused

### Styling
- Tailwind CSS utility classes
- Dark theme colors:
  - Background: `#131F24`
  - Secondary: `#1A2C35`
  - Green accent: `#58CC02`
  - Blue accent: `#1CB0F6`
- Mobile-first with `MobileContainer` wrapper

### TypeScript
- All files use TypeScript (.ts, .tsx)
- Types defined in `types/curriculum.ts`
- Key types: `Lesson`, `Theme`, `Puzzle`, `NodeStatus`

### Data Flow
- User auth state: `useUser()` hook
- Progress tracking: `useProgress()` hook + localStorage + Supabase
- Profile data: `useProfileData()` hook

## Database Tables (Supabase)

- `profiles` - User info, ELO rating, subscription
- `puzzle_attempts` - Every puzzle try (for stats)
- `daily_challenges` - Daily puzzle tracking
- `lesson_progress` - Completed lessons
- `theme_performance` - Aggregated stats per theme

All tables have Row Level Security - users only see their own data.

## Puzzle System

Puzzles come from Lichess database (CSV files in `data/puzzles-by-rating/`).

API endpoint: `/api/puzzles?mode=random&userRating=800&theme=fork`

Puzzles have:
- FEN (chess position)
- Solution moves (UCI format like "e2e4")
- Rating, themes, popularity

## Current Status

### Working Features
- Authentication (email/password)
- 3-level curriculum tree
- Puzzle solving with move validation
- Daily challenges
- User profiles with stats
- D3 skill bubble visualization

### Test Pages (experimental)
Files prefixed with `test-` are design experiments, not production code.

## Environment Variables

Requires `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Common Patterns

### Adding a new page
1. Create folder in `app/` with `page.tsx`
2. Add `'use client'` if interactive
3. Wrap content in `MobileContainer`

### Adding a new API route
1. Create `app/api/[name]/route.ts`
2. Export async `GET` or `POST` function
3. Use `createClient()` from `lib/supabase/server` for DB access

### Working with puzzles
1. User selects theme/lesson
2. API fetches puzzles matching criteria
3. PuzzleBoard validates moves against solution
4. Results saved to `puzzle_attempts` table

---

## Notes & Learnings

*Add notes here about things that worked, didn't work, or important decisions:*

<!-- Example:
- 2024-01: Tried using Zustand for state, reverted to hooks + localStorage
- 2024-02: D3-force works better than CSS for bubble layout
-->
