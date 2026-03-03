# Agent Roster

14 specialized agents. Dispatched via Task tool (`subagent_type: "general-purpose"`). Agent files in `.claude/agents/`.

| Agent | Role | Writes To |
|-------|------|-----------|
| **Frontend** | Components, pages, styling | `components/` (not `puzzle/`), `app/` (pages), `globals.css` |
| **Backend** | API routes, hooks, server logic | `app/api/` (not `progress/`), `lib/`, `hooks/` (not `useProgress.ts`) |
| **Database** | Schema, migrations | `supabase/`, `scripts/migrations/` |
| **Chess** | Puzzle logic, board, sounds | `lib/puzzle-utils.ts`, `lib/sounds.ts`, `lib/puzzle-selector.ts`, `components/puzzle/` |
| **Sync** | Progress data flow, merge logic | `lib/progress-sync.ts`, `hooks/useProgress.ts`, `app/api/progress/` |
| **Content** | Curriculum, puzzles, quips | `data/`, `lib/curriculum-registry.ts` |
| **Growth** | Sharing, OG images | `lib/share/`, `components/share/`, `app/api/og/` |
| **Design System** | Colors, tokens, UI primitives | `globals.css` (tokens), `components/ui/`, `public/brand/` |
| **Levels** | New levels 6-8 | `data/staging/level{6,7,8}-*`, `lib/level-unlock-tests.ts` |
| **Responsive** | Desktop/tablet layouts | `app/` (layouts), `components/` (responsive), `globals.css` (queries) |
| **PWA** | Manifest, service worker | `public/manifest.json`, `public/sw.js`, `components/InstallPrompt.tsx` |
| **Architect** | Design decisions, plans | `.claude/plans/`, `docs/adr/` |
| **DevOps** | CI/CD, deployment | `.github/`, `vercel.json` |
| **QA** | Tests, verification | `e2e/`, `__tests__/` |

## WARN Pairs (run sequentially)

- **Database + Sync** — schema changes need sync pipeline updates
- **Frontend + Design System** — both touch `globals.css` and component styles
- **Frontend + Responsive** — both touch page layouts
- **Chess + Responsive** — board sizing shared concern
- **Content + Levels** — both write to `data/`

Everything else is safe to run in parallel.
