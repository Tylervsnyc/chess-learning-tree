# Development Standards

## Branching Strategy

Branch names follow: `agent/{role}/{task-name}`

Examples:
- `agent/frontend/redesign-level-cards`
- `agent/backend/add-rate-limiting`
- `agent/database/add-puzzle-index`

## PR Conventions

**Title format:** `[Agent] Short description` (under 70 chars)

**Description template:**
```
## Summary
- What changed and why

## Blast Radius
- Files modified
- User-facing impact

## Testing
- How to verify this works
```

**Required checks before merge:**
- `npm run check` passes (lint + type-check)
- `npm run build` succeeds
- Manual test of affected feature on mobile viewport

## Naming Conventions

### IDs (dot notation)
- Level: `1`, `2`, `5`
- Section: `1.3`, `5.12`
- Lesson: `1.3.2`, `5.12.4`
- Quip: `1.1.g.01`, `2.6.fork.03`

### Files
- Pages: `app/{route}/page.tsx`
- API routes: `app/api/{name}/route.ts`
- Components: `components/{category}/{ComponentName}.tsx`
- Hooks: `hooks/use{Name}.ts`
- Utilities: `lib/{name}.ts`

### Functions
- Handlers: `handle{Action}` (e.g., `handleClick`)
- Getters: `get{Thing}` (e.g., `getNextLesson`)
- Checkers: `is{Condition}` or `can{Action}` (e.g., `isLessonUnlocked`)
- Updates: `update{Thing}` (e.g., `updateProgress`)

## Error Handling Patterns

### API Routes
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // validate input
    // do work
    return Response.json({ data });
  } catch (error) {
    console.error('[route-name] Error:', error);
    return Response.json({ error: 'Description' }, { status: 500 });
  }
}
```

### Client Components
- Use error boundaries for unexpected failures
- Show user-friendly error messages, not raw errors
- Log errors to console with context (component name, action)

### Data Sync
- Never fire-and-forget API calls — always handle errors
- On sync failure, keep local state and retry on next action
- Use optimistic updates: show change immediately, sync in background

## Import Ordering

1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Internal hooks
5. Internal lib/utils
6. Types
7. Styles/CSS

## Mobile-First Development

- All UI starts at mobile viewport (375px)
- Use `h-full` not `h-screen` (pages are inside flex layout with NavHeader)
- No horizontal scroll on mobile
- Touch targets minimum 44x44px
- Test on mobile viewport before shipping
