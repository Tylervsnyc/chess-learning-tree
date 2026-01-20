# The Chess Path

A structured chess learning app that takes players from beginner to intermediate through puzzle-based lessons organized by ELO rating.

## MVP Focus

The core product is simple: **Login → Learning Tree → Lessons**

### What We're Building (MVP)

| Component | Status | Description |
|-----------|--------|-------------|
| Auth | 🔨 Building | Login/Signup with Supabase |
| Learning Tree | 🔨 Building | Visual curriculum showing all lessons by ELO level |
| Lesson Player | 🔨 Building | Solve 6 puzzles per lesson to progress |

### Curriculum Structure

```
Level 1: Beginner (400-600 ELO)
├── 1.1 Mate in 1
├── 1.2 Piece Values
├── 1.3 Capturing
├── 1.4 Protecting
├── 1.5 Check
├── 1.6 Basic Checkmates
├── 1.7 Stalemate
├── 1.8 Opening Principles
├── 1.9 Simple Tactics
└── 1.10 Pawn Basics

Level 2: Intermediate (600-800 ELO)
├── 2.1 Mate in 2
├── 2.2 Forks
├── 2.3 Pins
├── 2.4 Skewers
├── 2.5 Discovered Attacks
├── 2.6 Double Attack
├── 2.7 Basic Endgames
├── 2.8 Castling
├── 2.9 Opening Repertoire
└── 2.10 Piece Activity

Level 3: Advanced Beginner (800-1000 ELO)
├── 3.1 Mate in 3
├── 3.2 Combination Patterns
├── 3.3 Positional Concepts
├── 3.4 Advanced Endgames
└── 3.5 Game Analysis
```

**Total: 25 lessons × 6 themes each = 150 theme progressions**

---

## The Pantry (Future Features)

These are built but **not part of MVP**. Ship the core first.

| Feature | What It Does | Why It Waits |
|---------|--------------|--------------|
| Daily Challenge | 5-min timed mode with lives | Engagement feature, not core learning |
| Workout | Unlimited puzzle practice | Nice to have, not progression |
| Profile/Stats | Bubble chart of strengths | Analytics, not core |
| Flagged Puzzles | Save problematic puzzles | Admin tool |
| Review Tool | Approve/reject puzzles | Admin tool |
| Home Dashboard | Feature card navigation | Can use learning tree as home |
| Test Pages | Design variants | Development only |

---

## How Lessons Are Created

We use **Claude Code** to design and iterate on the curriculum. This includes:

- Defining lesson criteria (required tags, rating ranges, piece filters)
- Adding learning science principles (mixed practice every 4 lessons, module reviews)
- Setting puzzle quality thresholds (min plays, variety filters)
- Documenting the puzzle pipeline at `/admin/puzzle-process`

The curriculum lives in `data/level1-curriculum.ts` and puzzles are generated via `scripts/generate-lesson-puzzles.ts`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Auth/DB:** Supabase
- **Chess:** chess.js + react-chessboard
- **Curriculum Design:** Claude Code

---

## MVP Launch Checklist

- [ ] Auth flow works end-to-end (signup → confirm email → login)
- [ ] Learning tree displays all 25 lessons
- [ ] Lessons show locked/unlocked/completed states
- [ ] Lesson player loads 6 puzzles correctly
- [ ] Progress saves to Supabase
- [ ] User can complete Level 1 fully
- [ ] Mobile responsive
- [ ] Deploy to production

---

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
/app
  /admin          # Admin dashboard (MVP vs Pantry view)
  /auth           # MVP - Login, Signup
  /learn          # MVP - Learning tree
  /lesson/[id]    # MVP - Lesson player
  /daily-challenge # Pantry
  /workout        # Pantry
  /profile        # Pantry
  /home           # Pantry
  /review         # Pantry
  /flagged        # Pantry
/components
/data
  curriculum.ts   # All 25 lessons defined here
/hooks
/lib
/types
```
