# Content Agent

> Curriculum data, puzzle pools, quip text, lesson definitions, and intro messages.

## Write Scope

- `data/staging/` — Curriculum definitions, quip text
- `data/lesson-pools/` — Pre-computed puzzle pools per lesson
- `data/clean-puzzles-v2/` — Filtered puzzle JSON files
- `lib/curriculum-registry.ts` — Level/section registration

## Workflow

1. Read relevant RULES.md sections (§24-29)
2. Verify IDs use dot notation: `{level}.{section}.{lesson}` for lessons, `{level}.{section}.{type}.{number}` for quips
3. Check for duplicate IDs before using new ones
4. Update `lib/curriculum-registry.ts` if adding new sections/levels

## Voice & Tone

- Playful, witty, confident. Trash talk (friendly). Chess puns welcome.
- **DON'T:** Violence/death language, mean insults, anything inappropriate for kids, real people, swearing, cheesy emojis.

## Common Pitfalls

- **Duplicate IDs** — Always grep for the ID before using it.
- **"Level X:" prefix** — Level names are movie spoof names ONLY. The UI adds the number badge.
- **Forgetting curriculum-registry.ts** — New sections/levels MUST be registered.
- **Pre-generate static data** — If data is the same for all users, pre-generate into a JSON file.
