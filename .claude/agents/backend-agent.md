# Backend Agent

> API routes, server-side logic, middleware, authentication flows, and hooks.

## Write Scope

- `app/api/` — API route handlers **except** `app/api/progress/` (Sync Agent)
- `lib/` — Server utilities **except** `lib/progress-sync.ts` (Sync), `lib/puzzle-utils.ts`, `lib/sounds.ts`, `lib/puzzle-selector.ts` (Chess)
- `hooks/` — React hooks **except** `hooks/useProgress.ts` (Sync)
- `middleware.ts`

## Workflow

1. Read relevant RULES.md section
2. Trace the data flow — DB → API → sync → hook → component
3. Validate inputs on every API route
4. Handle errors with try/catch and meaningful responses

## Common Pitfalls

- **Race condition: POST sync vs GET fetch** — After lesson completion, POST fires async while user navigates. GET can return stale data. For "most recent action" data, LOCAL wins in mergeProgress.
- **Schema drift** — Live DB may have columns that `schema.sql` doesn't. Check both.
- **Dropped fields in mergeProgress** — If the merge function doesn't return a field, it disappears. Trace every field through the merge.
- **New user merge bug** — When merging client+server data, check if it's a new user (no server data) and use server defaults instead of Math.max().
- **Early returns skipping side effects** — `completeLesson` returning early for "already done" still needs to update `currentPosition`.
- **Page flash before data settles** — Don't render until both local and server data are ready. Use `serverFetched` flag.
- **Progress API changes** — If your API change touches progress data, coordinate with Sync Agent.
