# AGENTS.md - Parallel Development with Claude Code

Seven specialized agents handle different parts of the codebase. They're dispatched automatically — just describe what you want in plain English.

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
| **Frontend** | Components, pages, styling, a11y | `components/`, `app/` (pages only), `app/globals.css`, `public/` | `.claude/agents/frontend-agent.md` |
| **Backend** | API routes, hooks, server logic, auth | `app/api/`, `lib/`, `hooks/`, `middleware.ts` | `.claude/agents/backend-agent.md` |
| **Database** | Schema, migrations, sync logic, seed data | `supabase/`, `scripts/migrations/`, `lib/progress-sync.ts` | `.claude/agents/database-agent.md` |
| **QA** | Tests, verification, coverage analysis | `e2e/`, `__tests__/`, `scripts/test-*` | `.claude/agents/qa-agent.md` |
| **Content** | Curriculum, puzzles, quips, lesson definitions | `data/`, `lib/curriculum-registry.ts` | `.claude/agents/content-agent.md` |
| **DevOps** | CI/CD, deployment, monitoring, hooks | `.github/`, `.claude/hooks/`, `vercel.json`, `.env.example` | `.claude/agents/devops-agent.md` |

---

## File Ownership Map

```
.
├── app/
│   ├── api/              → Backend Agent
│   ├── */page.tsx        → Frontend Agent
│   ├── globals.css       → Frontend Agent
│   └── layout.tsx        → Frontend Agent (coordinate with Backend for structure)
│
├── components/           → Frontend Agent
│
├── data/                 → Content Agent
│
├── hooks/                → Backend Agent
│
├── lib/
│   ├── curriculum-registry.ts → Content Agent
│   ├── progress-sync.ts      → Database Agent
│   └── everything else        → Backend Agent
│
├── supabase/             → Database Agent
├── e2e/                  → QA Agent
├── __tests__/            → QA Agent
├── .github/              → DevOps Agent
├── .claude/plans/        → Architect Agent
└── public/               → Frontend Agent
```

---

## Parallel Safety Matrix

```
            Architect  Frontend  Backend  Database  QA    Content  DevOps
Architect      --       SAFE      SAFE     SAFE    SAFE    SAFE    SAFE
Frontend      SAFE        --      SAFE     SAFE    SAFE    SAFE    SAFE
Backend       SAFE      SAFE        --     WARN    SAFE    SAFE    SAFE
Database      SAFE      SAFE      WARN       --    SAFE    SAFE    SAFE
QA            SAFE      SAFE      SAFE     SAFE      --    SAFE    SAFE
Content       SAFE      SAFE      SAFE     SAFE    SAFE      --    SAFE
DevOps        SAFE      SAFE      SAFE     SAFE    SAFE    SAFE      --
```

**Only Backend + Database is WARN** (both can touch `lib/progress-sync.ts`). Everything else is safe for parallel execution.

### Guaranteed Safe Combos
- Any agent + QA (QA is read-only for production code)
- Any agent + Architect (Architect is read-heavy, write-light)
- Frontend + Content (classic combo — one shapes data, the other shapes UI)
- Frontend + Backend (clear boundary at `app/api/`)
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
- `agent/content/add-level-6-quips`

### Merge Order

1. **Database** first (schema/API changes are foundational)
2. **Backend** next (server logic that uses schema)
3. **Content** next (data that features depend on)
4. **Frontend** next (UI on top of data + APIs)
5. **DevOps** anytime (infrastructure is independent)
6. **QA** doesn't merge (test files only)
7. **Architect** doesn't merge (plans/ADRs only)

---

## Task Description Template

```
AGENT TYPE: [Architect / Frontend / Backend / Database / QA / Content / DevOps]
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
- **Backend + Database needs coordination** — Run sequentially if both touch sync
- **Every agent reads `.claude/lessons-learned.md`** — 20 real debugging lessons
- **Agents report in structured format** — Each has a reporting template in their agent file
