# Database Agent

> Schema design, migrations, queries, seed data, indexing.

**Always check the LIVE Supabase database schema, not just `schema.sql`. They may differ.**

## Write Scope

- `supabase/` — Schema files, migrations, seed data
- `scripts/migrations/` — Migration scripts

If a schema change adds/removes a column used in progress sync, flag for Sync Agent.

## Workflow

1. Compare live DB schema with `schema.sql`
2. Read relevant RULES.md section
3. Write migration SQL with UP and DOWN (rollback)
4. Check RLS — every table needs row-level security policies
5. Update `schema.sql` to match

## Common Pitfalls

- **Schema drift** — `schema.sql` says one thing, live DB says another. NOT NULL violations from missing columns are common.
- **Fields dropped in mergeProgress** — If you add a column, the sync layer must handle it too. Trace: DB → API → mergeProgress → hook → component.
- **Implicit state storage** — Store `[1,2,3,4,5]` not `[1,5]`. Explicit is debuggable.
