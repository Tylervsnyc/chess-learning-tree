# Testing Standards

## Testing Pyramid

```
        E2E Tests
       (critical flows)
      ─────────────────
      Integration Tests
     (API routes, hooks)
    ─────────────────────
        Unit Tests
   (lib/, business logic)
  ─────────────────────────
```

- **Unit tests** for pure functions in `lib/` and business logic in `hooks/`
- **Integration tests** for API routes (request → response)
- **E2E tests** for critical user flows (auth, lesson completion, payment)

## Coverage Targets

| Area | Target | Rationale |
|------|--------|-----------|
| `lib/` utilities | 80% | Core business logic, easy to unit test |
| `hooks/` | 80% | State management, unlock logic |
| API routes | 100% of routes | Every endpoint needs at least a happy path test |
| E2E critical flows | Auth, lesson complete, daily challenge, payment | User-facing journeys |

## What Must Be Tested Before Merge

- Any new or modified function in `lib/`
- Any new or modified API route
- Any new or modified hook
- Any bug fix (regression test proving the fix works)

## Test Naming Convention

```typescript
describe('functionName', () => {
  it('should return true when input is valid', () => { ... });
  it('should throw when input is missing', () => { ... });
});

// For components
describe('ComponentName', () => {
  it('renders correctly with default props', () => { ... });
  it('handles click event', () => { ... });
});
```

## Test File Location

- Unit tests: `__tests__/{filename}.test.ts` (mirror source structure)
- E2E tests: `e2e/{flow-name}.spec.ts`
- Test utilities: `__tests__/helpers/`

## Common Test Pitfalls

1. **Time-dependent tests** — Streaks, daily challenge dates. Mock `Date.now()`.
2. **localStorage state** — Clear between tests. Old state leaks across test runs.
3. **Async data loading** — Wait for data to settle before asserting. Use `waitFor`.
4. **Puzzle randomness** — Seed random selection in tests for determinism.
5. **Auth state** — Tests requiring auth need proper Supabase test user setup.

## Running Tests

```bash
npm run check        # Lint + type-check (fast, run before every commit)
npm run validate     # Lint + type-check + build (thorough, run before push)
npm run test:e2e     # Playwright E2E tests
npm run test:e2e:ui  # Playwright with UI inspector
```
