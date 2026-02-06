# Migration Plan

Plan a safe database schema or dependency migration.

## Input

Migration description: $ARGUMENTS

## Steps

### 1. Current State
- Read `supabase/schema.sql` for schema migrations
- Read `package.json` for dependency migrations
- Check LIVE database if schema migration (may differ from schema.sql)

### 2. Desired State
- What does the end result look like?
- What tables/columns/types change?
- What dependencies are added/removed/updated?

### 3. Migration SQL (for schema changes)

Write both directions:

```sql
-- UP (apply)
ALTER TABLE ...;
CREATE INDEX ...;

-- DOWN (rollback)
ALTER TABLE ...;
DROP INDEX ...;
```

### 4. Data Loss Risk Assessment

| Change | Risk | Mitigation |
|--------|------|------------|
| ADD COLUMN | None | Default value |
| DROP COLUMN | HIGH | Backup data first |
| ALTER TYPE | Medium | Test conversion |
| ADD INDEX | None | May slow writes briefly |

### 5. Deployment Sequence

For schema migrations:
1. Apply schema change (ADD COLUMN is safe)
2. Deploy code that uses the new schema
3. Verify data integrity
4. Remove old column (if applicable) in a later migration

For dependency updates:
1. Update package.json
2. Run `npm install`
3. Run `npm run check` (lint + typecheck)
4. Run `npm run build`
5. Test affected features

### 6. Verification Steps

- [ ] Migration applies cleanly
- [ ] Rollback works
- [ ] RLS policies still work
- [ ] No data loss
- [ ] Application builds
- [ ] Affected features work

## Output Format

```
MIGRATION PLAN: [title]
TYPE: Schema / Dependency / Both
RISK: Low / Medium / High

CURRENT STATE:
- [what exists now]

DESIRED STATE:
- [what it should look like after]

MIGRATION:
[SQL or package changes]

ROLLBACK:
[SQL or revert steps]

DEPLOYMENT ORDER:
1. [step]
2. [step]

VERIFICATION:
- [ ] [check]
```
