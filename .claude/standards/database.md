# Database Standards

## Migration Workflow

1. Write migration SQL with UP and DOWN (rollback) sections
2. Test locally against dev database
3. Apply to staging, verify data integrity
4. Apply to production
5. Update `supabase/schema.sql` to match live DB

**Always check LIVE DB vs schema.sql before assuming schema.sql is accurate.**

## Naming Conventions

- Tables: `snake_case` plural (e.g., `puzzle_attempts`, `lesson_progress`)
- Columns: `snake_case` (e.g., `created_at`, `user_id`, `unlocked_levels`)
- Functions: `{table}_{action}` (e.g., `profiles_update_streak`)
- Indexes: `idx_{table}_{column}` (e.g., `idx_puzzle_attempts_user_id`)

## Indexing Rules

- Index all foreign keys
- Index columns used in WHERE clauses frequently
- Index columns used in ORDER BY for large tables
- Composite indexes for common multi-column queries

## Row Level Security (RLS)

Every table MUST have RLS policies:
- Users can only read/write their own data
- Service role key bypasses RLS (server-side only)
- Test with both `anon` and `authenticated` roles

```sql
-- Standard pattern
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Key Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User info, subscription, streak, unlocked_levels |
| `puzzle_attempts` | Every puzzle try |
| `lesson_progress` | Completed lessons |
| `daily_challenge_results` | Daily challenge scores |
| `level_test_attempts` | Level test history |
| `puzzle_history` | Recently seen puzzles (90-day cleanup) |
| `quip_history` | Recently seen quips |

## Data Integrity Rules

- Never delete user data without explicit confirmation
- Destructive migrations (DROP COLUMN, ALTER TYPE) require rollback plan
- Seed data changes should be idempotent (safe to run multiple times)
- Schema drift between `schema.sql` and live DB is a common bug source — verify both
