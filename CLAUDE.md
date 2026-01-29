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

### IMPORTANT: Lichess Puzzle Format

**The first move in a Lichess puzzle is the OPPONENT'S move, not the player's!**

When loading a puzzle from Lichess:
- `fen`: Position BEFORE the opponent's last move
- `moves[0]`: Opponent's "setup" move that creates the tactic (NOT the player's move!)
- `moves[1+]`: Player's solution moves

**Correct way to display a puzzle:**
1. Load the FEN
2. Apply `moves[0]` to get the actual puzzle position
3. Show the board to the player (now it's their turn)
4. Player's color = whoever's turn it is AFTER `moves[0]`
5. Validate player moves against `moves[1]`, `moves[3]`, etc.
6. Auto-play opponent responses from `moves[2]`, `moves[4]`, etc.

```typescript
// Example: Transform raw Lichess puzzle
function processPuzzle(raw: RawPuzzle): ProcessedPuzzle {
  const chess = new Chess(raw.fen);

  // Apply the setup move (opponent's last move)
  const setupMove = raw.moves[0];
  chess.move({ from: setupMove.slice(0,2), to: setupMove.slice(2,4) });

  return {
    puzzleFen: chess.fen(),           // Position player sees
    solutionMoves: raw.moves.slice(1), // Player's moves (index 1+)
    playerColor: chess.turn() === 'w' ? 'white' : 'black',
  };
}
```

**Common mistake:** Showing the raw FEN without applying `moves[0]` first - this shows the wrong position!

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

## Puzzle Page Standards

**IMPORTANT:** All puzzle pages (lessons, diagnostic, daily challenge, workout) MUST follow these standards for consistency.

### Required Layout Structure
```tsx
<div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
  {/* Header with progress bar - ALWAYS visible */}
  <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <button>✕</button>
      {/* Progress bar */}
      <div className="flex-1 mx-4">
        <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10">
          <div className="h-full" style={{ width: `${progress}%`, background: '#58CC02' }} />
        </div>
      </div>
      <div>1/6</div>
    </div>
  </div>

  {/* Main content - NO vertical centering, fixed top padding */}
  <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
    <div className="w-full max-w-lg">
      {/* Fixed height sections to prevent layout shift */}
      <div className="h-12">Title area</div>
      <div className="h-8">Turn indicator</div>

      {/* Chessboard with popup overlay */}
      <div className="relative">
        <Chessboard ... />
        {showPopup && <PuzzleResultPopup ... />}
      </div>

      {/* Fixed height status area */}
      <div className="h-6">Status text</div>
    </div>
  </div>
</div>
```

### Key Requirements

1. **No Scrolling**: Use `h-screen overflow-hidden` on container
2. **Progress Bar Always Visible**: Header with progress bar at top
3. **Static Board Position**:
   - Use `pt-2` (fixed padding) NOT `justify-center`
   - Fixed height sections (`h-12`, `h-8`, `h-6`) prevent layout shift
4. **Popup Over Board**: Use `PuzzleResultPopup` component with `position: relative` wrapper
5. **Sounds**: Import from `@/lib/sounds`:
   - `playCorrectSound(index)` - chromatic scale on correct
   - `playErrorSound()` - error buzz on wrong
   - `playMoveSound()` / `playCaptureSound()` - move feedback
6. **Loading State**: Must match exact same layout structure to prevent shift

### Puzzle Pages Using These Standards
- `/app/lesson/[lessonId]/page.tsx` - Chess path lessons
- `/app/onboarding/diagnostic/page.tsx` - Diagnostic puzzles
- `/components/onboarding/OnboardingPuzzleBoard.tsx` - Shared puzzle board

### Shared Components
- `PuzzleResultPopup` (`components/puzzle/PuzzleResultPopup.tsx`) - Correct/incorrect overlay
- Streak progress bar styles with rainbow animation

---

## Curriculum V2 Rules

### Intro Popup Messages

Every lesson page must show a popup message overlay (over the board) before puzzles begin:

1. **Block Intro**: When starting the FIRST lesson of a new block, show the block intro message
2. **Theme Intro**: When starting the FIRST lesson of a new theme/section, show the theme intro message

If a lesson is both (first lesson of a new block AND first of a theme), show the block intro first, then the theme intro on dismiss.

### Message Tone & Voice
- Punchy, casual, slightly cheeky
- Beginner-friendly - no jargon without explanation
- Short paragraphs (2-3 sentences max)
- End with something actionable ("Let's go", "Find the checkmate", etc.)

### Message Content
- **Block intros**: Set the stage for the whole block's goal (e.g., "Welcome to Chess Path! Here's how to win...")
- **Theme intros**: Explain the specific tactic/concept they're about to practice

### Storage
- Messages should be stored in the curriculum data structure (add `blockIntroMessage` to Block type, `themeIntroMessage` to Section type)
- Or in a separate messages file that maps to block/section IDs

### UI Requirements
- Popup appears over the chessboard (similar to PuzzleResultPopup positioning)
- Single "Let's Go" or "Start" button to dismiss
- Dark overlay behind the message card
- Message card matches app styling (bg-[#1A2C35], rounded corners, etc.)

---

## Pre-Flight Checklist for New Features

**IMPORTANT:** Before attempting to implement ANY new feature, Claude MUST verify each layer of the data flow exists. Do NOT attempt workarounds if a layer is missing—tell the user what's missing first.

### The Three-Layer Check

For any feature that involves user data or state, verify:

| Layer | Question to Ask | Where to Look |
|-------|-----------------|---------------|
| **1. Database** | Does this data exist in the schema? | `supabase/schema.sql` |
| **2. API/Sync** | Is this data fetched and returned to the frontend? | `lib/progress-sync.ts`, `app/api/` routes |
| **3. UI Hook** | Is this data exposed to components? | `hooks/useProgress.ts`, other hooks |

### Example: "Navigate to Next Lesson"

❌ **What went wrong:** Spent a week trying to implement this without realizing `currentLessonId` was tracked in the database but dropped during sync.

✅ **What should have happened:**
1. Check schema → `current_lesson_id` exists in `profiles` table ✓
2. Check sync → `mergeProgress()` returns `currentLessonId`? **NO** ← Stop here
3. Tell user: "The database tracks this but the sync function drops it. Fix needed in `lib/progress-sync.ts` first."

### Questions Claude Should Ask Before Starting

1. **"Does the backend track this?"** - Check `supabase/schema.sql` for the relevant column/table
2. **"Does the API return it?"** - Check the API route and `ServerProgress` interface
3. **"Does the sync preserve it?"** - Check `mergeProgress()` actually includes the field
4. **"Does the hook expose it?"** - Check the hook's return statement
5. **"Is there UI that uses it?"** - Check if any component consumes this data

### Red Flags to Watch For

- Field exists in `ServerProgress` but not in `Progress` interface
- Field is received from API but not included in `mergeProgress()` return
- Frontend calculates something the backend should own (trust issues)
- "Fire and forget" API calls with no error handling or confirmation
- Data stored but never retrieved or displayed

### When to Stop and Report

If ANY of these are true, stop and tell the user before writing code:

- "The database doesn't have a column for this—we need a schema change"
- "The API returns this data but the sync function drops it—bug fix needed"
- "The hook doesn't expose this field—need to add it to the return"
- "This feature requires X, Y, Z changes across multiple files"

---

## Notes & Learnings

*Add notes here about things that worked, didn't work, or important decisions:*

### TODO (This Week)
- [ ] **Build out user permissions** - Current system only has Free vs Premium (puzzle limit). Needs: admin role, role-based access control, feature gates, content permissions. See conversation from Jan 24, 2026 for details.

<!-- Example:
- 2024-01: Tried using Zustand for state, reverted to hooks + localStorage
- 2024-02: D3-force works better than CSS for bubble layout
-->
