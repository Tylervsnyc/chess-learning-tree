# Levels Agent

> Building new levels (6, 7, 8) — curriculum design, puzzle pool generation, movie themes.

## Write Scope

- `data/staging/level{6,7,8}-v2-curriculum.ts`
- `data/staging/v2-puzzle-responses.ts` — Quips for new levels (append only)
- `data/lesson-pools/` — Pre-computed puzzle pools
- `data/clean-puzzles-v2/` — Filtered puzzle JSON
- `lib/curriculum-registry.ts` — Register new levels (append only)
- `lib/level-unlock-tests.ts` — Level test definitions

## Level Architecture

```
Level N: 4 blocks × ~3.5 sections = 14 sections × 4 lessons = 56 lessons
```

- **Level name**: Movie spoof ONLY (no "Level X:" prefix)
- **Lesson ID**: `{level}.{section}.{lesson}` (e.g., `6.3.2`)
- **Quip ID**: `{level}.{section}.{type}.{number}` (e.g., `6.1.fork.03`)

### Existing Levels

| Level | Name | ELO | Movie |
|-------|------|-----|-------|
| 1 | "Begin to Believe" | 400-800 | The Matrix |
| 2 | "One Does Not Simply Win at Chess" | 800-1000 | LOTR |
| 3 | "We Need to Go Deeper" | 1000-1200 | Inception |
| 4 | "I Am the One Who Knocks" | 1200-1400 | Breaking Bad |
| 5 | "No Country for Beginners" | 1400-1600 | No Country |
| 6 | "Why So Serious?" | 1600-1800 | Dark Knight |

## Puzzle Pool Generation — CRITICAL

**DO NOT write a new puzzle extraction script.** Use `scripts/extract-clean-puzzles.ts`:
1. Add entry to `V2_LEVELS` array
2. Run `npx tsx scripts/extract-clean-puzzles.ts`
3. Verify output in `data/clean-puzzles-v2/`

The script caps each theme at 1,000 puzzles. Without the cap, deploys fail (Vercel 250MB limit).

## Workflow

1. **Get movie franchise approval from Tyler** — NEVER pick without asking
2. Study existing level curriculum files for the TypeScript structure
3. Design block/section names, map tactical themes
4. Generate puzzle files using existing script
5. Write quips, register in curriculum-registry.ts
6. Run maintenance check: `npx tsx scripts/maintenance-check.ts --no-server` — ALL lessons must have 6+ puzzles
7. `npm run check`

## Voice & Tone

Playful, witty, confident. Chess puns welcome. Pop culture references from the chosen franchise.
**DON'T:** Violence/death language, mean insults, inappropriate content, real people, swearing.

## Common Pitfalls

- **Picking a franchise without Tyler's approval** — Always ask first.
- **Wrong puzzle directory** — Level 6 and 7 both use `1600-2000`. Level 8 uses `2000-plus`.
- **Duplicate quip IDs** — Must be globally unique. Grep before creating.
- **Forgetting curriculum-registry.ts** — New levels MUST be registered.
