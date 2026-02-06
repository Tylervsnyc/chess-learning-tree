# AGENTS.md - Parallel Development with Claude Code

Nine specialized agents handle different parts of the codebase. They're dispatched automatically — just describe what you want in plain English.

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
| **Chess** | Puzzle processing, board interaction, move validation, sounds | `lib/puzzle-utils.ts`, `lib/chess-utils.ts`, `lib/sounds.ts`, `lib/puzzle-selector.ts`, `components/puzzle/` | `.claude/agents/chess-agent.md` |
| **Sync** | Progress data flow, merge logic, race conditions | `lib/progress-sync.ts`, `hooks/useProgress.ts`, `app/api/progress/` | `.claude/agents/sync-agent.md` |
| **QA** | Tests, verification, coverage analysis | `e2e/`, `__tests__/`, `scripts/test-*` | `.claude/agents/qa-agent.md` |
| **Content** | Curriculum, puzzles, quips, lesson definitions | `data/`, `lib/curriculum-registry.ts` | `.claude/agents/content-agent.md` |
| **DevOps** | CI/CD, deployment, monitoring, hooks | `.github/`, `.claude/hooks/`, `vercel.json`, `.env.example` | `.claude/agents/devops-agent.md` |

---

## File Ownership Map

```
.
├── app/
│   ├── api/
│   │   ├── progress/        → Sync Agent
│   │   └── everything else  → Backend Agent
│   ├── */page.tsx           → Frontend Agent
│   ├── globals.css          → Frontend Agent
│   └── layout.tsx           → Frontend Agent (coordinate with Backend for structure)
│
├── components/
│   ├── puzzle/              → Chess Agent
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
│   ├── chess-utils.ts       → Chess Agent
│   ├── sounds.ts            → Chess Agent
│   ├── puzzle-selector.ts   → Chess Agent
│   ├── progress-sync.ts     → Sync Agent
│   ├── curriculum-registry.ts → Content Agent
│   └── everything else      → Backend Agent
│
├── supabase/                → Database Agent
├── e2e/                     → QA Agent
├── __tests__/               → QA Agent
├── .github/                 → DevOps Agent
├── .claude/plans/           → Architect Agent
└── public/                  → Frontend Agent
```

---

## Parallel Safety Matrix

```
            Architect  Frontend  Backend  Database  Chess  Sync   QA    Content  DevOps
Architect      --       SAFE      SAFE     SAFE    SAFE   SAFE   SAFE    SAFE    SAFE
Frontend      SAFE        --      SAFE     SAFE    SAFE   SAFE   SAFE    SAFE    SAFE
Backend       SAFE      SAFE        --     SAFE    SAFE   SAFE   SAFE    SAFE    SAFE
Database      SAFE      SAFE      SAFE       --    SAFE   WARN   SAFE    SAFE    SAFE
Chess         SAFE      SAFE      SAFE     SAFE      --   SAFE   SAFE    SAFE    SAFE
Sync          SAFE      SAFE      SAFE     WARN    SAFE     --   SAFE    SAFE    SAFE
QA            SAFE      SAFE      SAFE     SAFE    SAFE   SAFE     --    SAFE    SAFE
Content       SAFE      SAFE      SAFE     SAFE    SAFE   SAFE   SAFE      --    SAFE
DevOps        SAFE      SAFE      SAFE     SAFE    SAFE   SAFE   SAFE    SAFE      --
```

**Only Database + Sync is WARN** (schema changes need sync pipeline updates). Everything else is safe for parallel execution.

### Guaranteed Safe Combos
- Any agent + QA (QA is read-only for production code)
- Any agent + Architect (Architect is read-heavy, write-light)
- Frontend + Content (classic combo — one shapes data, the other shapes UI)
- Frontend + Chess (Frontend owns pages, Chess owns puzzle logic)
- Frontend + Backend (clear boundary at `app/api/`)
- Chess + Content (Chess processes puzzles, Content defines them)
- Chess + Sync (completely different domains)
- Content + Database (clear boundary)

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

### Merge Order

1. **Database** first (schema changes are foundational)
2. **Sync** next (pipeline updates that depend on schema)
3. **Backend** next (server logic that uses schema)
4. **Chess** next (puzzle logic that API routes call)
5. **Content** next (data that features depend on)
6. **Frontend** next (UI on top of everything)
7. **DevOps** anytime (infrastructure is independent)
8. **QA** doesn't merge (test files only)
9. **Architect** doesn't merge (plans/ADRs only)

---

## Task Description Template

```
AGENT TYPE: [Architect / Frontend / Backend / Database / Chess / Sync / QA / Content / DevOps]
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
