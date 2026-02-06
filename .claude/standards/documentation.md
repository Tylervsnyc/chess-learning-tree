# Documentation Standards

## Inline Comments

- Only add comments where the logic isn't self-evident
- Don't add comments to explain *what* code does — the code should be readable
- DO add comments to explain *why* — business rules, non-obvious decisions, workarounds

```typescript
// Good: explains WHY
// Lichess puzzle moves[0] is the opponent's setup move, not the player's
const puzzleFen = applyMove(originalFen, moves[0]);

// Bad: explains WHAT (the code already says this)
// Set the animation duration to 300
setAnimationDuration(300);
```

## RULES.md

- Update RULES.md whenever app behavior changes
- RULES.md is the source of truth — code should match it, not the other way around
- If code and RULES.md disagree, fix the code (unless RULES.md is outdated, then fix both)

## API Route Documentation

Every API route should have a JSDoc comment at the top:

```typescript
/**
 * POST /api/progress/sync
 * Syncs user progress between client and server.
 * Auth: Required (uses Supabase session)
 * Body: { completedLessons, currentPosition, streak, ... }
 * Returns: { merged progress object }
 */
export async function POST(request: Request) { ... }
```

## Architecture Decision Records (ADRs)

For decisions that affect multiple files or change architecture:

**File:** `docs/adr/NNNN-title.md`

```markdown
# ADR-NNNN: Title

## Status
Accepted / Superseded / Deprecated

## Context
What problem are we solving?

## Decision
What did we decide?

## Consequences
What are the trade-offs?
```

## What NOT to Document

- Don't add docstrings to every function (only complex ones)
- Don't create README files for every directory
- Don't add type annotations as comments (use TypeScript types)
- Don't document internal implementation details that change frequently
