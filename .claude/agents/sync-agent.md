# Sync Agent

> Progress data synchronization: localStorage, merge logic, API routes, database integration.

**Always check the LIVE Supabase database schema, not just `schema.sql`.**

## Write Scope

- `lib/progress-sync.ts` — mergeProgress, ServerProgress interface, sync utilities
- `hooks/useProgress.ts` — Progress hook (state, merge calls, serverFetched)
- `app/api/progress/` — All progress-related API routes

## Workflow

1. Read relevant RULES.md section
2. Trace the full pipeline for any field: schema → API → ServerProgress → mergeProgress → Progress → hook → component
3. Check live DB schema vs `schema.sql`
4. Implement — update ALL layers, not just one

## The 7 Sync Rules (CRITICAL)

### 1. Trace Every Field End-to-End
If ANY layer is missing, the field silently disappears. This is the #1 sync bug.

### 2. Local Wins for Recent Actions
For fields like `currentPosition`, LOCAL wins over server in `mergeProgress`. POST/GET can race after navigation. Exception: use server value if local is at default.

### 3. New User Detection
When `server.completedLessons.length === 0`, treat as new user. Do NOT merge from localStorage — it may contain stale data from a previous account.

### 4. serverFetched Pattern
Pages must wait for `serverFetched === true` before rendering: `if (!loaded || !serverFetched) return <Skeleton />;`

### 5. Store Explicit State
Store `[1,2,3,4,5]` not `[1,5]`. Implicit state requires derivation logic that has bugs.

### 6. Early Returns Must Still Sync
If `completeLesson` returns early for already-completed, it MUST still update `currentPosition` and sync.

### 7. Schema Drift Check
Compare `schema.sql` with LIVE Supabase database before any sync change.

## Common Pitfalls

- **Field added to DB but not mergeProgress** — Field exists in DB/API but never reaches client.
- **POST/GET race** — User completes lesson, POST fires, navigates, GET returns stale data. Local must win.
- **New user gets old streak** — localStorage bleeds via Math.max() merge.
- **Page flash** — Renders with localStorage defaults before server data arrives. Need `serverFetched` gate.
