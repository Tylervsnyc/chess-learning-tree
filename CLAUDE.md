# CLAUDE.md - The Chess Path

A mobile-first chess learning web app that teaches tactics through interactive puzzles in a skill-tree curriculum. Think Duolingo for chess.

**Tech stack:** Next.js 16 (App Router, React 19, TypeScript) + Supabase (PostgreSQL + Auth) + Tailwind CSS 4 + Stripe + PostHog

**This app is maintained by a vibe coder — explain things simply, ask before implementing big changes.**

---

## Agent System

Tasks are auto-dispatched to specialized agents. Just describe what you want in plain English.

| Request mentions... | Agent | File |
|---|---|---|
| Colors, tokens, brand, design system, theme | **Design System** | `.claude/agents/design-system-agent.md` |
| Components, pages, styling, a11y, CSS | **Frontend** | `.claude/agents/frontend-agent.md` |
| API routes, server logic, auth (not progress) | **Backend** | `.claude/agents/backend-agent.md` |
| Schema, migrations, queries | **Database** | `.claude/agents/database-agent.md` |
| Chess board, puzzles, moves, sounds, animation | **Chess** | `.claude/agents/chess-agent.md` |
| Progress sync, merge, data flow, race conditions | **Sync** | `.claude/agents/sync-agent.md` |
| Puzzle content, quips, curriculum, lessons | **Content** | `.claude/agents/content-agent.md` |
| Tests, verify, check, QA, audit | **QA** | `.claude/agents/qa-agent.md` |
| Architecture, dependencies, design | **Architect** | `.claude/agents/architect-agent.md` |
| Sharing, OG images, share cards, viral loops | **Growth** | `.claude/agents/growth-agent.md` |
| CI/CD, deployment, monitoring, env | **DevOps** | `.claude/agents/devops-agent.md` |

Spawn agents via Task tool with `subagent_type: "general-purpose"`. Prompt: `Read .claude/agents/{type}-agent.md, then execute: TASK: {description}`.

**Use agents aggressively.** Default to dispatching — don't do work in the main conversation that an agent should own. Examples:
- "daily health check" → **QA Agent**
- "this page is broken" → investigate briefly, then dispatch fix to the owning agent
- "add a feature" → dispatch to the relevant agent immediately
- Multi-file bugs → investigate in main, then dispatch fixes to each agent in parallel

**When NOT to dispatch:** Only for truly trivial tasks (fix a typo), pure questions ("how does X work?"), or ambiguous requests (clarify first).

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
| Lesson unlocking | `hooks/useProgress.ts` → `isLessonUnlocked()` (client only — server trusts client) |
| Current position | `hooks/useProgress.ts` → `currentPosition` |
| Puzzle utilities | `lib/puzzle-utils.ts` |
| Puzzle selection | `lib/puzzle-selector.ts` |
| Sound effects | `lib/sounds.ts` |
| Curriculum data | `lib/curriculum-registry.ts` |
| Feature flags | `lib/config/feature-flags.ts` |
| Database schema | `supabase/schema.sql` |
| Daily puzzles | `data/daily-challenge-puzzles.json` |
| Default OG image | `app/api/og/default/route.tsx` (dynamic, edge) |
| Share card (story) | `app/api/og/daily-challenge/route.tsx` → `renderStoryLayout()` **LOCKED DESIGN** |
| Rook blocks | `lib/daily-rook-blocks.ts` |
| Quips | `data/staging/v2-puzzle-responses.ts` |

### Single Source of Truth

| Behavior | Enforced In |
|----------|-------------|
| Lesson unlocking | `hooks/useProgress.ts` → `isLessonUnlocked()` (client only — server trusts client) |
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
| Share card design | `app/api/og/daily-challenge/route.tsx` (`format=story` = 9:16 "Score + Divider") |

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

**Full design system: `.claude/design-system.md`** — read this before any visual work.

**Theme:** Light everywhere. All user-facing pages use `bg-chess-page` (#eef6fc). No dark backgrounds except landing hero.

**Colors — always use tokens, never raw hex:**
- Page bg: `bg-chess-page` | Cards: `bg-chess-surface`
- Text: `text-chess-text` / `text-chess-text-muted` / `text-chess-text-faint`
- Actions: `bg-chess-green` (primary) / `bg-chess-blue` (secondary)
- Accents: `chess-gold`, `chess-orange`, `chess-red`, `chess-purple`

**Layout:** Mobile-first. Body (`flex-col, overflow-hidden`) → NavHeader → main (`flex-1`) → page (`h-full`). Use `h-full` NOT `h-screen`. Only `/learn` and `/test-*` get `overflow-auto`.

**Desktop containment:** Every page/feature must look correct at wide viewports, not just mobile. All content sections within a page must share the same max-width container (e.g., `max-w-sm mx-auto` or `max-w-lg mx-auto`). Never leave a section unconstrained while others are constrained — this causes misalignment on desktop. For phone-width experiences (Daily Rook, lessons), wrap the outermost page div in `max-w-lg mx-auto w-full`.

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

## Common Pitfalls (Top 6)

1. **Competing code** — Search ALL code touching a feature before changing any. Delete competing implementations first.
2. **Data flow gaps** — Trace every field: DB → API → sync → hook → component. If any layer drops it, the feature breaks.
3. **Schema drift** — `schema.sql` may not match live DB. Check both.
4. **Race conditions** — POST and GET can race after navigation. Local wins for recent actions.
5. **Uncommitted files** — After fixing, `git status` to verify ALL related files are committed.
6. **Desktop overflow** — Every section on a page must share the same max-width container. If one section is `max-w-sm mx-auto` and another has no constraint, desktop breaks.
7. **Server should not duplicate client validation** — The server trusts the client for lesson unlock order. Don't add server-side unlock checks — they cause cascading sync failures when earlier lessons are missing from the DB.

Full list: `.claude/lessons-learned.md` (24 entries from real debugging sessions)

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
├── daily-challenge/       # The Daily Rook mode
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
