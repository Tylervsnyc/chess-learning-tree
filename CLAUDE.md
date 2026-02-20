# The Chess Path

A mobile-first chess learning app (Duolingo for chess). Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS 4, Stripe, PostHog.

---

## Working With Tyler

- **Vibe coder** — explain simply, no jargon dumps. Short responses preferred.
- **Ask before big changes.** Propose, don't just do. List the blast radius.
- When Tyler says "fix this" — **dispatch immediately.** Don't deep-dive the library source code or trace through rendering internals. A quick skim to identify the right agent is fine; anything beyond that wastes tokens. Let the agent investigate and fix.
- Don't over-explain. If the fix is obvious, just do it (or dispatch it).
- When Tyler asks "how does X work?" — answer directly, don't launch an agent.
- Celebrate wins briefly. Tyler likes to see progress.
- **Use Linear for task tracking.** All bugs, features, and improvements flow through Linear. Check issues before starting work, update status as you go.

---

## Agent Dispatch

**Dispatch for complex or multi-file tasks. Do simple single-file edits inline.**

See **AGENTS.md** for the full agent roster, file ownership map, and parallel safety matrix.

Spawn via Task tool (`subagent_type: "general-purpose"`). Prompt format:
```
Read .claude/agents/{type}-agent.md, then execute: TASK: {description}
Read RULES.md lines {start}-{end} (§{number} {name}) — use offset/limit, not the full file.
```

### When to Dispatch

- **Multi-file changes** spanning agent boundaries
- **Complex logic** — sync, puzzle mechanics, progress pipeline, curriculum wiring
- **New features** that need RULES.md compliance
- **Parallel work** — dispatch multiple agents when tasks are independent

### When NOT to Dispatch (do it inline)

- **Single-file edits** — styling, spacing, prop changes, class swaps
- **Obvious fixes** — you can see the problem and the fix after reading the file
- **Pure questions** — "how does X work?" — answer from what you know
- **Ambiguous requests** — clarify with Tyler first, then dispatch
- **Multi-agent coordination** — orchestrate from main, dispatch subtasks

### Dispatch Rules (when you do dispatch)

1. **Use `model: "haiku"` for simple/mechanical tasks** (typo fixes, token conversions, single-line changes).
2. **Don't pre-read files for agents.** Agents read their own context.
3. **Tell agents which RULES.md section to read by number.** Don't make them scan the whole file. Use the index below.

---

## RULES.md Section Index (line numbers)

Use `offset` and `limit` to read only the section you need — never read the full 2,300-line file.

```
§1  User Types           L57    §16 Header              L521   §31 Share Card (Daily)  L1471
§2  Lesson Unlocking     L85    §17 Lesson Page         L595   §32 Share Card (Lesson) L1567
§3  Level Unlocking      L127   §18 Puzzle Interaction  L941   §33 SEO & Marketing     L1628
§4  Nav After Complete   L143   §19 Sounds              L1027  §34 Daily Maintenance    L1721
§5  Scroll Behavior      L160   §20 User ELO            L1050  §35 Payment Recovery     L1763
§6  Naming Conventions   L212   §21 Analytics           L1058  §36 Revenue Dashboard    L1790
§7  Daily Limits         L234   §22 Feature Flags       L1073  §37 Paywall Analytics    L1816
§8  Premium Prompts      L252   §23 Database Tables     L1103  §38 Dynamic Pricing      L1841
§9  Admin Users          L266   §24 Puzzle Selection    L1160  §39 Ad Placement         L1871
§10 Data Storage         L281   §25 Quip System         L1178  §40 Cron Schedule        L1903
§11 Streaks              L294   §26 Quip Guidelines     L1244  §41 Breathing Rook       L1958
§12 Daily Rook           L313   §27 Lesson Naming       L1275  §42 Admin Dashboard      L2001
§13 Leaderboard          L430   §28 Intro Messages      L1303  §43 Design System        L2085
§14 Level Tests          L457   §29 New Levels Checklist L1317 §44 Daily Puzzle Video   L2175
§15 Pages                L497   §30 Work In Progress    L1365
```

---

## Token Efficiency

- **Be concise.** Short paragraphs, not walls of text. No boilerplate summaries.
- **RULES.md: read by section, not by file.** Use the index above. Read 50-100 lines at the offset, never the full file.
- **Skip RULES.md entirely** for simple styling/layout tasks that don't need behavioral rules.
- **Agents: skip startup reading for trivial tasks.** A color change doesn't need lessons-learned.md or development.md.
- **Don't echo file contents** back to Tyler unless he asked to see them.
- **Don't duplicate agent work.** If you dispatch a search to an agent, don't also search yourself.

---

## Reference Docs (don't inline — just read when needed)

| Doc | What's in it |
|-----|-------------|
| **RULES.md** | Source of truth for ALL app behavior. Read the relevant section before coding. |
| **AGENTS.md** | Parallel safety matrix, branching strategy, agent ownership maps |
| **PRODUCTION.md** | What's built vs. what's live. Feature tracker. |
| `.claude/design-system.md` | Colors, tokens, layout rules, component patterns |
| `.claude/standards/development.md` | Naming conventions, PR format, error handling patterns |
| `.claude/lessons-learned.md` | 24 battle-tested debugging insights from real sessions |
| `.claude/commands/` | Skill commands: code-review, bug-triage, feature-scaffold, migration-plan, dependency-audit |

---

## Environment & Commands

```bash
npm run dev        # Dev server with Turbopack at localhost:3000
npm run build      # Production build
npm run check      # Lint + type-check (pre-commit)
npm run validate   # Lint + type-check + build (pre-push)
./scripts/dev-server.sh  # Resilient dev server (auto-restarts on crash)
```

Requires `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`

Supabase project ref: `ruseupjmldymfvpybqdl`

---

## Testing Rule

When testing changes, run: `./scripts/ensure-dev.sh && open http://localhost:3000/{page}`

That script checks if the server is already running and only starts it if needed. Never restart, kill, or clear cache on a running server. Never make Tyler start the server or navigate manually.

**Test pages (`/test/*`, `/test-*`) MUST always have `overflow-auto` on their container.** Body has `overflow: hidden` globally — test pages need scrolling. Never create a test page without it.

---

## Three Rules

1. **Search before changing.** Search ALL code touching a feature before modifying any of it. Delete competing implementations first.
2. **RULES.md is the source of truth.** When in doubt, read RULES.md — not your memory, not this file.
3. **Dispatch wisely.** Complex/multi-file work → agents. Simple single-file edits → do it inline.
