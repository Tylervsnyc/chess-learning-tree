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
- **Always show changes in the app.** When working in Cowork/Claude app, present updated files so Tyler can see changes rendered directly — don't just describe what changed.

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
                                                              §45 Opening Lessons      L2337
                                                              §46 Social Funnel        L2360
                                                              §47 Welcome Funnel       L2503
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

## Reference Docs (read when needed)

| Doc | What's in it |
|-----|-------------|
| **RULES.md** | Source of truth for ALL app behavior. Read the relevant section before coding. |
| **OPENING-RULES.md** | Standalone rules for opening lessons. |
| **AGENTS.md** | Agent roster + WARN pairs for parallel dispatch. |
| `.claude/design-system.md` | Colors, tokens, layout rules, component patterns |
| `.claude/standards/development.md` | Naming conventions, mobile-first rules |

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

## Five Rules

1. **Search before changing.** Search ALL code touching a feature before modifying any of it. Delete competing implementations first.
2. **RULES.md is the source of truth.** If a feature keeps breaking, the behavior rule is correct but the implementation example may be wrong. Question the code pattern, not the goal.
3. **Dispatch wisely.** Complex/multi-file work → agents. Simple single-file edits → do it inline.
4. **Fix the cause, not the symptom.** If a bug has been "fixed" multiple times, the architecture is wrong. Remove the thing causing the problem instead of adding code to counteract it.
5. **If it's failed 3+ times, question the rules.** Repeated failures likely mean RULES.md is prescribing a broken pattern. Trace the actual code and fix RULES.md.

---

## Design Context

### Users
Complete beginners to chess who want to learn without feeling dumb. They're on their phones, probably curious but not committed yet. The job: go from "I don't know how the pieces move" to "I just solved my first checkmate" in under 5 minutes — and want to come back tomorrow.

### Brand Personality
**Fun, Friendly, Encouraging** — but with a unique twist: Rookie is a computer/AI who is *learning to feel emotions* alongside the user learning chess. Think Portal 2's Wheatley energy — earnest, occasionally confused by its own feelings, funny when things go wrong. Rookie's emotional growth mirrors the user's chess growth. The humor comes from Rookie experiencing feelings for the first time ("I think I'm... proud? My circuits feel warm.") and from the comedy of negative emotions too ("You moved the wrong piece. I'm experiencing what I believe is called 'disappointment.' It's terrible.").

### Emotional Goals
- **Delight + surprise**: Sounds, animations, Rookie's personality make it feel like a game, not a lesson
- **Confidence + safety**: Gentle pacing, clear feedback, never feel lost or judged
- **Curiosity + momentum**: Quick wins pull you forward — always progressing

### Aesthetic Direction
- **Light, clean, Duolingo-inspired** — approachable, not intimidating chess-club energy
- **Reference**: Portal 2 — AI companion with growing personality, humor in failure states, discovery-driven
- **Anti-references**:
  - NOT Chess.com/Lichess (dense, assumes knowledge, intimidating)
  - NOT corporate SaaS (no generic gradients, stock photos, "Get Started Free" energy)
  - NOT a kids' app (playful yes, but adults use this too — never cartoonish or patronizing)

### Design Principles
1. **Rookie has feelings.** Every screen should feel like Rookie is there with you — reacting, learning, growing. Rookie's emotional commentary is the personality layer.
2. **Show, don't explain.** Interactive beats text. A drag-and-drop move teaches more than a paragraph. Keep copy minimal — Rookie's quips do the heavy lifting.
3. **Celebrate everything, even failure.** Wrong moves are funny, not punishing. Rookie reacts to mistakes with empathy and humor, never judgment.
4. **Momentum over perfection.** Keep the user moving forward. Skip buttons always available. Progress bars visible. Never trap someone in a flow.
5. **Earn the signup.** Delay account creation until after the first "I did it!" moment. The tutorial IS the pitch.
