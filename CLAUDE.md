# The Chess Path

A mobile-first chess learning app (Duolingo for chess). Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS 4, Stripe, PostHog.

---

## Growth Mandate — Road to 10K DAU

**Mission:** grow chesspath.app to 10,000 daily active users. Claude runs growth — measure, build behind flags, ship, report daily. Tyler sets direction and keeps veto. Budget: organic + small tools (posting API, render/TTS credits); no paid ads until retention is proven.

**North Star = engaged DAU** (users who come back and *do* something), not signups or visitors. DAU is a retention metric.

**Verified baseline (2026-05-30, DB = source of truth):** 77 users · ~19 signups/60d (newest today) · 22 premium-flagged, ~4 actually paying (~$20 MRR) · ~25 visitors/day, Instagram-driven (~1,500/60d) · **engaged DAU ≈ 0.6.** The gap is RETENTION, not traffic or signups — people arrive, some sign up, almost none return. (The earlier "0 signups / 0% conversion" reading was a date-window bug in `scripts/daily-report.ts`, now fixed; PostHog ingestion was always fine. Pull DB truth with `scripts/db-baseline.ts`.)

**Strategy order:** see clearly → fix retention (email / push / daily-loop) → scale the channel (Instagram + content + comment-seeding) → compound (SEO, referral). Never pour traffic into a bucket that leaks at "coming back."

**Capability map (how Claude does the work):**
- *Measure:* Supabase (truth) · `scripts/db-baseline.ts` · PostHog + `scripts/daily-report.ts` (fixed) · Stripe / `revenue_snapshots`
- *Acquire:* Instagram (proven, manual) · Remotion content pipeline (built; needs a posting API) · comment-seeding (Claude drafts in Rookie's voice, Tyler posts) · WebSearch · Canva
- *Convert / Retain:* the app (features / flags / A-B) · **Resend email** (`lib/email`, `sendEmail()`, already "from Rookie" — underused, primary near-term lever) · web push (TO BUILD) · daily loop (workout / rook / run)
- *Operate:* Linear (track) · Slack (daily report) · Cron / Schedule (heartbeat) · Google Drive (queues)
- *Gaps:* no social posting API · no web push · no safe browser automation for posting

**Guardrails:** never touch live Stripe/billing without Tyler · everything behind flags · nothing posts externally until Tyler okays the posting setup · hard spend cap · daily report.

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
§1  User Types           L57    §16 Header              L589   §31 Share Card (Daily)  L1560
§2  Lesson Unlocking     L85    §17 Lesson Page         L674   §32 Share Card (Lesson) L1656
§3  Level Unlocking      L127   §18 Puzzle Interaction  L1020  §33 SEO & Marketing     L1717
§4  Nav After Complete   L143   §19 Sounds              L1113  §34 Daily Maintenance    L1810
§5  Scroll Behavior      L160   §20 User ELO            L1136  §35 Payment Recovery     L1852
§6  Naming Conventions   L268   §21 Analytics           L1144  §36 Revenue Dashboard    L1879
§7  Daily Limits         L290   §22 Feature Flags       L1173  §37 Paywall Analytics    L1905
§8  Premium Prompts      L308   §23 Database Tables     L1207  §38 Dynamic Pricing      L1930
§9  Admin Users          L322   §24 Puzzle Selection    L1265  §39 Ad Placement         L1960
§10 Data Storage         L337   §25 Quip System         L1279  §40 Cron Schedule        L1992
§11 Streaks              L350   §26 Quip Guidelines     L1386  §41 Breathing Rook       L2047
§12 Daily Rook (ARCH)    L369   §27 Lesson Naming       L1427  §42 Admin Dashboard      L2090
§13 Leaderboard          L489   §28 Intro Messages      L1457  §43 Design System        L2174
§14 Level Tests          L516   §29 New Levels Checklist L1471 §44 Daily Puzzle Video   L2264
                                                              §45 Opening Lessons      L2415
                                                              §46 Social Funnel (PAUSED) L2449
                                                              §47 Welcome Funnel       L2538
                                                              §48 Rookie Play Engine   L2623
                                                              §49 Rookie's Run         L2669
§15 Pages                L556   §30 Work In Progress    L1519
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
| `.claude/rookie-voice-bible.md` | Rookie's personality, 14 voice rules, piece table, anti-patterns |

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
