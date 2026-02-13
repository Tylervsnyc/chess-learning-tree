# AGENTS.md - Parallel Development with Claude Code

Fourteen specialized agents handle different parts of the codebase. They're dispatched automatically — just describe what you want in plain English.

---

## How It Works

**Just talk normally.** The coordinator reads your request, figures out which agent(s) are needed, and dispatches them using the Task tool. You don't need to pick agents.

**Example:**
> "Add quips for level 6 and make the level cards look better"

Claude auto-dispatches:
- **Content Agent** → writes the quips (modifies `data/staging/`)
- **Frontend Agent** → polishes the cards (modifies `components/`)

Both run in parallel (Content + Frontend = safe combo), results reported back together.

---

## Agent Roster

| Agent | Role | Writes To | File |
|-------|------|-----------|------|
| **Architect** | Design decisions, dependency eval, migration planning | `.claude/plans/`, `docs/adr/`, `package.json` (deps only) | `.claude/agents/architect-agent.md` |
| **Frontend** | Components, pages, styling, a11y | `components/` (except `puzzle/`), `app/` (pages only), `app/globals.css`, `public/` | `.claude/agents/frontend-agent.md` |
| **Backend** | API routes (except progress), hooks (except useProgress), server logic | `app/api/` (except `progress/`), `lib/` (except chess/sync files), `hooks/` (except `useProgress.ts`), `middleware.ts` | `.claude/agents/backend-agent.md` |
| **Database** | Schema, migrations, seed data | `supabase/`, `scripts/migrations/` | `.claude/agents/database-agent.md` |
| **Chess** | Puzzle processing, board interaction, move validation, sounds | `lib/puzzle-utils.ts`, `lib/sounds.ts`, `lib/puzzle-selector.ts`, `components/puzzle/` | `.claude/agents/chess-agent.md` |
| **Sync** | Progress data flow, merge logic, race conditions | `lib/progress-sync.ts`, `hooks/useProgress.ts`, `app/api/progress/` | `.claude/agents/sync-agent.md` |
| **QA** | Tests, verification, coverage analysis | `e2e/`, `__tests__/`, `scripts/test-*` | `.claude/agents/qa-agent.md` |
| **Content** | Curriculum, puzzles, quips, lesson definitions | `data/`, `lib/curriculum-registry.ts` | `.claude/agents/content-agent.md` |
| **Growth** | Sharing flows, OG images, share cards, viral loops | `lib/share/`, `components/share/`, `components/daily-challenge/DailyChallengeShareCard.tsx`, `app/api/og/`, `app/test-share*/` | `.claude/agents/growth-agent.md` |
| **DevOps** | CI/CD, deployment, monitoring, hooks | `.github/`, `.claude/hooks/`, `vercel.json`, `.env.example` | `.claude/agents/devops-agent.md` |
| **Design System** | Color palette, typography, component library, brand consistency | `app/globals.css` (tokens), `tailwind.config.ts` (theme), `components/ui/`, `.claude/design-system/`, `public/brand/` | `.claude/agents/design-system-agent.md` |
| **Responsive** | Desktop/tablet layouts, breakpoints, content width scaling | `app/` (layout adjustments), `components/` (responsive wrappers), `app/globals.css` (media queries) | `.claude/agents/responsive-agent.md` |
| **PWA** | Manifest, service worker, install prompts, offline support | `public/manifest.json`, `public/sw.js`, `public/brand/` (PWA icons), `components/InstallPrompt.tsx` | `.claude/agents/pwa-agent.md` |
| **Levels** | Building new levels 6-8, curriculum design, puzzle pools | `data/staging/level{6,7,8}-*.ts`, `data/lesson-pools/` (new levels), `lib/level-unlock-tests.ts` | `.claude/agents/levels-agent.md` |
| **Test Screen** | Visual comparison pages for evaluating design variants | `app/test-*/page.tsx` | `.claude/agents/test-screen-agent.md` |

---

## File Ownership Map

```
.
├── app/
│   ├── api/
│   │   ├── progress/        → Sync Agent
│   │   ├── og/              → Growth Agent
│   │   └── everything else  → Backend Agent
│   ├── */page.tsx           → Frontend Agent
│   ├── globals.css          → Frontend Agent
│   └── layout.tsx           → Frontend Agent (coordinate with Backend for structure)
│
├── components/
│   ├── puzzle/              → Chess Agent
│   ├── share/               → Growth Agent
│   ├── daily-challenge/DailyChallengeShareCard.tsx → Growth Agent
│   ├── ui/                  → Design System Agent
│   ├── InstallPrompt.tsx    → PWA Agent
│   └── everything else      → Frontend Agent
│
├── data/                    → Content Agent
│
├── hooks/
│   ├── useProgress.ts       → Sync Agent
│   └── everything else      → Backend Agent
│
├── lib/
│   ├── puzzle-utils.ts      → Chess Agent
│   ├── sounds.ts            → Chess Agent
│   ├── puzzle-selector.ts   → Chess Agent
│   ├── progress-sync.ts     → Sync Agent
│   ├── curriculum-registry.ts → Content Agent
│   ├── share/               → Growth Agent
│   └── everything else      → Backend Agent
│
├── supabase/                → Database Agent
├── e2e/                     → QA Agent
├── __tests__/               → QA Agent
├── .github/                 → DevOps Agent
├── .claude/plans/           → Architect Agent
├── .claude/design-system/   → Design System Agent
├── public/brand/            → Design System Agent + PWA Agent (icons)
├── public/manifest.json     → PWA Agent
├── public/sw.js             → PWA Agent
└── public/ (everything else) → Frontend Agent
```

---

## Parallel Safety Matrix

```
              Arch  Front  Back  DB    Chess  Sync  QA    Cont  Grow  DevO  DSys  Resp  PWA   Lvls
Architect      --   SAFE   SAFE  SAFE  SAFE   SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE
Frontend      SAFE    --   SAFE  SAFE  SAFE   SAFE  SAFE  SAFE  SAFE  SAFE  WARN  WARN  SAFE  SAFE
Backend       SAFE  SAFE     --  SAFE  SAFE   SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE
Database      SAFE  SAFE   SAFE    --  SAFE   WARN  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE
Chess         SAFE  SAFE   SAFE  SAFE    --   SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  WARN  SAFE  SAFE
Sync          SAFE  SAFE   SAFE  WARN  SAFE     --  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE
QA            SAFE  SAFE   SAFE  SAFE  SAFE   SAFE    --  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE
Content       SAFE  SAFE   SAFE  SAFE  SAFE   SAFE  SAFE    --  SAFE  SAFE  SAFE  SAFE  SAFE  WARN
Growth        SAFE  SAFE   SAFE  SAFE  SAFE   SAFE  SAFE  SAFE    --  SAFE  SAFE  SAFE  SAFE  SAFE
DevOps        SAFE  SAFE   SAFE  SAFE  SAFE   SAFE  SAFE  SAFE  SAFE    --  SAFE  SAFE  SAFE  SAFE
DesignSys     SAFE  WARN   SAFE  SAFE  SAFE   SAFE  SAFE  SAFE  SAFE  SAFE    --  SAFE  SAFE  SAFE
Responsive    SAFE  WARN   SAFE  SAFE  WARN   SAFE  SAFE  SAFE  SAFE  SAFE  SAFE    --  SAFE  SAFE
PWA           SAFE  SAFE   SAFE  SAFE  SAFE   SAFE  SAFE  SAFE  SAFE  SAFE  SAFE  SAFE    --  SAFE
Levels        SAFE  SAFE   SAFE  SAFE  SAFE   SAFE  SAFE  WARN  SAFE  SAFE  SAFE  SAFE  SAFE    --
```

**WARN pairs** (run sequentially or split into distinct files):
- **Database + Sync** — schema changes need sync pipeline updates
- **Frontend + Design System** — both touch `globals.css` and component styles
- **Frontend + Responsive** — both touch page layouts and component sizing
- **Chess + Responsive** — board sizing is a shared concern
- **Content + Levels** — both write to `data/` and `curriculum-registry.ts`

### Guaranteed Safe Combos
- Any agent + QA (QA is read-only for production code)
- Any agent + Architect (Architect is read-heavy, write-light)
- Frontend + Content (classic combo — one shapes data, the other shapes UI)
- Frontend + Chess (Frontend owns pages, Chess owns puzzle logic)
- Frontend + Backend (clear boundary at `app/api/`)
- Chess + Content (Chess processes puzzles, Content defines them)
- Chess + Sync (completely different domains)
- Content + Database (clear boundary)
- Growth + Frontend (Growth builds share components, Frontend integrates them into pages)
- Growth + Content (Growth handles share copy, Content handles curriculum copy)
- Design System + Backend (zero overlap)
- Design System + Levels (zero overlap)
- PWA + Content (zero overlap)
- PWA + Levels (zero overlap)
- PWA + Chess (zero overlap)
- Responsive + Content (zero overlap)
- Levels + Frontend (Levels writes data, Frontend writes UI)

### When You See WARN
Run agents **sequentially**, or split the task so each agent modifies distinct files.

---

## Branching Strategy

```
agent/{role}/{task-name}
```

Examples:
- `agent/frontend/redesign-level-cards`
- `agent/backend/add-rate-limiting`
- `agent/database/add-puzzle-index`
- `agent/chess/fix-animation-timing`
- `agent/sync/add-field-to-pipeline`
- `agent/content/add-level-6-quips`
- `agent/design-system/unify-color-tokens`
- `agent/responsive/desktop-lesson-layout`
- `agent/pwa/initial-setup`
- `agent/levels/build-level-6`

### Merge Order

1. **Database** first (schema changes are foundational)
2. **Sync** next (pipeline updates that depend on schema)
3. **Backend** next (server logic that uses schema)
4. **Chess** next (puzzle logic that API routes call)
5. **Content** next (data that features depend on)
6. **Levels** next (new level data, after Content so registry doesn't conflict)
7. **Growth** next (share components that pages reference)
8. **Design System** next (tokens and primitives that pages consume)
9. **Frontend** next (UI on top of everything)
10. **Responsive** next (layout adjustments on top of Frontend's work)
11. **PWA** next (manifest/SW on top of final pages)
12. **DevOps** anytime (infrastructure is independent)
13. **QA** doesn't merge (test files only)
14. **Architect** doesn't merge (plans/ADRs only)

---

## Task Description Template

```
AGENT TYPE: [Architect / Frontend / Backend / Database / Chess / Sync / QA / Content / Growth / DevOps / Design System / Responsive / PWA / Levels]
TASK: [one sentence description]
CONTEXT: [why this is needed]
OWNED FILES: [explicit list of files this agent can modify]
ACCEPTANCE CRITERIA:
- [ ] [what "done" looks like]
- [ ] [testable outcome]
BRANCH: agent/{role}/{task-name}
```

---

## Handoff Protocol

When one agent's work depends on another's:

1. **First agent** completes and describes what changed
2. **Second agent** merges the first branch before starting
3. Or merge to `main` first, then second agent works off `main`

### Cross-Agent Escalation

If an agent discovers it needs changes in another agent's territory:
1. Stop working on that part
2. Report what the other agent needs to do
3. Continue with the parts it CAN do
4. The coordinator assigns the task to the right agent

---

## Skill Commands

Reusable workflows available as slash commands:

| Command | Purpose |
|---------|---------|
| `/project:code-review` | Structured code review against checklist |
| `/project:bug-triage` | Systematic bug investigation |
| `/project:feature-scaffold` | New feature setup with blast radius |
| `/project:migration-plan` | Safe schema/dependency migration |
| `/project:dependency-audit` | Package health check |

---

## Tips

- **Start with QA** — Verify current state before making changes
- **Frontend + Content is the power combo** — Zero file conflicts
- **Frontend + Chess is another power combo** — Pages + puzzle logic, zero conflicts
- **Database + Sync needs coordination** — Run sequentially if schema changes affect progress pipeline
- **Chess logic stays centralized** — If a page has inline `processPuzzle` or `normalizeMove`, that's a bug for Chess Agent to fix
- **Every agent reads `.claude/lessons-learned.md`** — 20 real debugging lessons
- **Agents report in structured format** — Each has a reporting template in their agent file
- **Design System before Responsive** — Get tokens and components right first, then adapt layouts for different screens
- **Levels agent needs Tyler's approval** — Never pick a movie franchise without asking. Level names are creative choices.
- **PWA is self-contained** — Safe to run in parallel with almost everything
- **Content vs Levels boundary** — Content maintains existing levels 1-5. Levels builds new levels 6-8. Both write to `data/` so run sequentially.
