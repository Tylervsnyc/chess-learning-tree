# The Chess Path

A mobile-first chess learning app (Duolingo for chess). Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS 4, Stripe, PostHog.

---

## Working With Tyler

- **Vibe coder** — explain simply, no jargon dumps. Short responses preferred.
- **Ask before big changes.** Propose, don't just do. List the blast radius.
- When Tyler says "fix this" — investigate briefly in main conversation, then dispatch to the owning agent.
- Don't over-explain. If the fix is obvious, just do it (or dispatch it).
- When Tyler asks "how does X work?" — answer directly, don't launch an agent.
- Celebrate wins briefly. Tyler likes to see progress.

---

## Agent Dispatch — THIS IS THE DEFAULT

**If a task touches files owned by an agent, you MUST dispatch. Do NOT do the work inline.**

See **AGENTS.md** for the full agent roster, file ownership map, and parallel safety matrix.

Spawn via Task tool (`subagent_type: "general-purpose"`). Prompt format:
```
Read .claude/agents/{type}-agent.md, then execute: TASK: {description}
RULES.md section: § {number} {name}
```

### Dispatch Rules

1. **Dispatch multiple agents in parallel** when tasks are independent.
2. **Use `model: "haiku"` for simple/mechanical tasks** (typo fixes, token conversions, single-line changes). Use default model for complex tasks.
3. **Don't pre-read files for agents.** Agents read their own context files (agent.md, RULES.md, etc). Don't waste tokens reading files you're going to hand off.
4. **Multi-file bugs:** Investigate root cause in main, then dispatch fixes to each owning agent in parallel.

### When NOT to Dispatch

- Truly trivial: single typo, one-line fix you can see right now
- Pure questions: "how does X work?" — answer from what you know
- Ambiguous requests: clarify with Tyler first, then dispatch
- Multi-agent coordination: orchestrate from main, dispatch subtasks

---

## Token Efficiency

- **Be concise.** Short paragraphs, not walls of text. No boilerplate summaries.
- **Don't re-read RULES.md every task.** Only when you genuinely need a specific section.
- **Don't echo file contents** back to Tyler unless he asked to see them.
- **Don't duplicate agent work.** If you dispatch a search to an agent, don't also search yourself.
- **Agents are self-sufficient.** They read their own context files — don't paste RULES.md content into agent prompts.

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
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run check      # Lint + type-check (pre-commit)
npm run validate   # Lint + type-check + build (pre-push)
```

Requires `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`

Supabase project ref: `ruseupjmldymfvpybqdl`

---

## Testing Rule

When testing changes: clear `.next` cache, start `npm run dev` (background), and `open http://localhost:3000/{page}` to pull it up in Tyler's browser automatically. Never make Tyler start the server or navigate manually.

---

## Three Rules

1. **Search before changing.** Search ALL code touching a feature before modifying any of it. Delete competing implementations first.
2. **RULES.md is the source of truth.** When in doubt, read RULES.md — not your memory, not this file.
3. **Dispatch to agents.** If it touches agent-owned files, dispatch. The main conversation is a router, not a workshop.
