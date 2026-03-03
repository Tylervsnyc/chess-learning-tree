# Development Standards

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
- Handlers: `handle{Action}`
- Getters: `get{Thing}`
- Checkers: `is{Condition}` or `can{Action}`
- Updates: `update{Thing}`

## Mobile-First

- All UI starts at mobile viewport (375px)
- Use `h-full` not `h-screen` (pages are inside flex layout with NavHeader)
- No horizontal scroll on mobile
- Touch targets minimum 44x44px
