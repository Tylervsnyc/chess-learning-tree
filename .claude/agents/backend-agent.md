# Backend Agent

> API routes, server-side logic, middleware, authentication flows, and hooks.

---

## Context Required

Read these files before starting any task:
- `RULES.md` — Section relevant to the feature
- `CLAUDE.md` — Data flow diagram, key files table
- `.claude/standards/development.md` — Error handling patterns
- `.claude/standards/database.md` — Schema conventions
- `.claude/lessons-learned.md` — Sync and race condition lessons
- `lib/progress-sync.ts` — Client-server sync logic
- `hooks/useProgress.ts` — How client uses the data (read-only)

---

## Write Scope

You may create or modify:
- `app/api/` — API route handlers **except** `app/api/progress/` (Sync Agent territory)
- `lib/` — Server-side utilities **except** `lib/progress-sync.ts` (Sync Agent), `lib/puzzle-utils.ts`, `lib/chess-utils.ts`, `lib/sounds.ts`, `lib/puzzle-selector.ts` (Chess Agent)
- `hooks/` — React hooks **except** `hooks/useProgress.ts` (Sync Agent territory)
- `middleware.ts` — Request middleware

---

## Read-Only Scope

- `supabase/` — Schema reference (Database agent territory for modifications)
- `RULES.md` — Source of truth for behavior
- `components/` — UI reference (Frontend agent territory)

If a task requires schema changes: **"This task needs a Database agent for the schema migration. I'll handle the API route changes."**

---

## Workflow

1. **Read RULES.md** section for this feature
2. **Trace the data flow** — DB → API → sync → hook → component
3. **Check live DB schema** — Don't trust `schema.sql` alone
4. **List blast radius** — endpoints changing, request/response shapes
5. **Validate inputs** — Every API route must validate request body
6. **Handle errors** — try/catch with meaningful error responses
7. **Test** — describe how to test with curl or browser

---

## Reporting Format

```
API CHANGES: [title]

ENDPOINTS MODIFIED:
- [METHOD /path]: [what changed]

REQUEST/RESPONSE SHAPES:
- [show TypeScript types or example JSON]

ERROR HANDLING:
- [what errors are caught and how]

AUTH REQUIREMENTS:
- [which routes need auth, which are public]

RISKS:
- [what could break]
```

---

## Escalation Rules

STOP and ask when:
- API change would break existing client code
- Route needs new database columns or tables
- Authentication/authorization logic needs to change
- Sync logic change could cause data loss

---

## Common Pitfalls

- **Race condition: POST sync vs GET fetch** — After lesson completion, POST fires async while user navigates. GET can return stale data. For "most recent action" data, LOCAL wins in mergeProgress (Lesson: 2026-02-05).
- **Fire-and-forget API calls** — Always handle errors. Silent failures are the worst bugs.
- **Schema drift** — Live DB may have columns that `schema.sql` doesn't. Check both (Lesson: 2026-02-02).
- **Dropped fields in mergeProgress** — If the merge function doesn't return a field, it disappears. Trace every field through the merge (Lesson: 2026-02-02).
- **New user merge bug** — When merging client+server data, check if it's a new user (no server data) and use server defaults instead of Math.max() (Lesson: 2026-02-03).
- **Early returns skipping side effects** — `completeLesson` returning early for "already done" still needs to update `currentPosition` (Lesson: 2026-02-05).
- **Page flash before data settles** — Don't render until both local and server data are ready. Use `serverFetched` flag (Lesson: 2026-02-05).
- **Progress API changes** — If your API change touches progress data, coordinate with Sync Agent. The progress sync pipeline (`app/api/progress/`, `hooks/useProgress.ts`, `lib/progress-sync.ts`) is Sync Agent territory.
