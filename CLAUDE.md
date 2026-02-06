# CLAUDE.md - The Chess Path

A mobile-first chess learning web app that teaches tactics through interactive puzzles in a skill-tree curriculum. Think Duolingo for chess.

**Tech stack:** Next.js 16 (App Router, React 19, TypeScript) + Supabase (PostgreSQL + Auth) + Tailwind CSS 4 + Stripe + PostHog

**This app is maintained by a vibe coder — explain things simply, ask before implementing big changes.**

---

## Agent System

Tasks are auto-dispatched to specialized agents. Just describe what you want in plain English.

| Request mentions... | Agent | File |
|---|---|---|
| Components, pages, styling, a11y, CSS | **Frontend** | `.claude/agents/frontend-agent.md` |
| API routes, hooks, server logic, auth | **Backend** | `.claude/agents/backend-agent.md` |
| Schema, migrations, sync, queries | **Database** | `.claude/agents/database-agent.md` |
| Puzzles, quips, curriculum, lessons | **Content** | `.claude/agents/content-agent.md` |
| Tests, verify, check, QA, audit | **QA** | `.claude/agents/qa-agent.md` |
| Architecture, dependencies, design | **Architect** | `.claude/agents/architect-agent.md` |
| CI/CD, deployment, monitoring, env | **DevOps** | `.claude/agents/devops-agent.md` |

Spawn agents via Task tool with `subagent_type: "general-purpose"`. Prompt: `Read .claude/agents/{type}-agent.md, then execute: TASK: {description}`.

**When NOT to dispatch:** Trivial tasks (fix a typo), questions ("how does X work?"), or ambiguous requests (clarify first).

See `AGENTS.md` for parallel safety matrix, branching strategy, and full details.

---

## Architecture

```
User Action → Component (UI) → Hook → Sync Layer → API Route → Supabase (DB)
```

### Key Files

| Responsibility | File(s) |
|----------------|---------|
| User state & type | `hooks/useUser.ts` |
| Progress tracking | `hooks/useProgress.ts`, `lib/progress-sync.ts` |
| Permissions/limits | `hooks/usePermissions.ts` |
| Lesson unlocking | `hooks/useProgress.ts` → `isLessonUnlocked()` |
| Current position | `hooks/useProgress.ts` → `currentPosition` |
| Puzzle selection | `lib/puzzle-selector.ts` |
| Sound effects | `lib/sounds.ts` |
| Curriculum data | `lib/curriculum-registry.ts` |
| Feature flags | `lib/config/feature-flags.ts` |
| Database schema | `supabase/schema.sql` |
| Daily puzzles | `data/daily-challenge-puzzles.json` |
| Quips | `data/staging/v2-puzzle-responses.ts` |

### Single Source of Truth

| Behavior | Enforced In |
|----------|-------------|
| Lesson unlocking | `hooks/useProgress.ts` → `isLessonUnlocked()` |
| Level unlocking | `hooks/useProgress.ts` → `isLevelUnlocked()` |
| Current position | `hooks/useProgress.ts` → `currentPosition` |
| Page layout/height | `app/globals.css` + `app/layout.tsx` |
| Scroll to top | `components/providers/ScrollToTop.tsx` (except /learn) |
| Scroll on /learn | `app/learn/page.tsx` → ONE useEffect |
| Post-lesson nav | `components/lesson/LessonCompleteScreen.tsx` |
| Celebration screen | `components/lesson/LessonCompleteScreen.tsx` |
| Permissions | `hooks/usePermissions.ts` |
| Header | `components/layout/NavHeader.tsx` |
| Animated logo | `components/brand/AnimatedLogo.tsx` |

**If you find logic in multiple places, consolidate it first!**

### Three Questions Before Coding with Data

1. **Where is it stored?** → `supabase/schema.sql`
2. **How does it flow?** → API routes + `lib/progress-sync.ts`
3. **Where is it used?** → Hooks and components

---

## Naming Conventions

### IDs (dot notation)
- Section: `{level}.{section}` (e.g., `1.3`)
- Lesson: `{level}.{section}.{lesson}` (e.g., `1.3.2`)
- Quip: `{level}.{section}.{type}.{number}` (e.g., `1.1.g.01`)

### Level Names
- The `name` field is the movie spoof name ONLY (e.g., `"Begin to Believe"`)
- The UI adds `L{number}` in a badge — never display level number twice

### Files & Functions
- Pages: `app/{route}/page.tsx` | API: `app/api/{name}/route.ts`
- Components: `components/{category}/{Name}.tsx` | Hooks: `hooks/use{Name}.ts`
- Handlers: `handle{Action}` | Getters: `get{Thing}` | Checkers: `is{Condition}`

---

## Styling Reference

| Color | Value |
|-------|-------|
| Background | `#131F24` |
| Secondary | `#1A2C35` |
| Green accent | `#58CC02` |
| Blue accent | `#1CB0F6` |
| Error | `#FF4B4B` |

**Layout:** Mobile-first. Body (`flex-col, overflow-hidden`) → NavHeader → main (`flex-1`) → page (`h-full`). Use `h-full` NOT `h-screen`. Only `/learn` and `/test-*` get `overflow-auto`.

---

## Chess Board Rules

**The first move in a Lichess puzzle is the OPPONENT'S move, not the player's!**

Processing: Load FEN → Apply `moves[0]` → Get `puzzleFen` → Animate setup move → Player solves from `moves[1]`

- Store solutions as **SAN** not UCI. Normalize: strip `+` and `#` before comparing
- Accept ANY checkmate in mate puzzles. Auto-queen all promotions
- Wrong answer flow: 1st wrong → warning (2 left), 2nd → warning (1 left), 3rd → green hint
- Dynamic `animationDurationInMs`: 0 for instant snaps, 300 for animated moves
- Board: dark squares `#779952`, light squares `#edeed1`

See `RULES.md` for full details. Test page: `/test-chess`

---

## Content Guidelines

**Voice:** Playful, witty, confident. Chess puns, pop culture refs, heist metaphors, sports metaphors.

**DON'T:** Violence/death language, mean insults, inappropriate for kids, real people, swearing, cheesy emojis.

---

## Error Handling

- **API routes:** try/catch, meaningful error responses, `console.error` with context
- **Client sync:** Optimistic updates, keep local on failure, retry next action
- **Data display:** Don't render until local + server data are ready (`serverFetched` flag)
- **Race conditions:** For "most recent action" data, LOCAL wins in mergeProgress

---

## Environment & Commands

```bash
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run lint       # Code issues
npm run check      # Lint + type-check (pre-commit)
npm run validate   # Lint + type-check + build (pre-push)
```

Requires `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`

Supabase project ref: `ruseupjmldymfvpybqdl`

---

## Common Pitfalls (Top 5)

1. **Competing code** — Search ALL code touching a feature before changing any. Delete competing implementations first.
2. **Data flow gaps** — Trace every field: DB → API → sync → hook → component. If any layer drops it, the feature breaks.
3. **Schema drift** — `schema.sql` may not match live DB. Check both.
4. **Race conditions** — POST and GET can race after navigation. Local wins for recent actions.
5. **Uncommitted files** — After fixing, `git status` to verify ALL related files are committed.

Full list: `.claude/lessons-learned.md` (20 entries from real debugging sessions)

---

## Before You Code Checklist

- [ ] Read RULES.md section for this feature
- [ ] Searched for all files that touch this
- [ ] Listed blast radius for user
- [ ] Identified code to DELETE (not just add)
- [ ] Change matches RULES.md

---

## Project Structure

```
app/                        # Pages and API routes
├── api/                   # Backend endpoints
├── learn/                 # Main curriculum tree
├── lesson/[lessonId]/     # Puzzle solving
├── level-test/[transition]/ # Level unlock tests
├── daily-challenge/       # Daily challenge mode
components/                 # UI components
data/                       # Curriculum data, puzzle pools
hooks/                      # React hooks (progress, user, permissions)
lib/                        # Core utilities
supabase/                   # Database schema
```

---

## Links

- **RULES.md** — Source of truth for all app behavior
- **AGENTS.md** — Agent system, parallel safety, branching
- `.claude/standards/` — Development, database, testing, documentation standards
- `.claude/lessons-learned.md` — Battle-tested debugging knowledge (20 entries)
- `.claude/commands/` — Skill commands: `/project:code-review`, `/project:bug-triage`, `/project:feature-scaffold`, `/project:migration-plan`, `/project:dependency-audit`

*RULES.md is the source of truth. When in doubt, read RULES.md first.*
