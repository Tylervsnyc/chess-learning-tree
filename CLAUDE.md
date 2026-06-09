# The Chess Path

A mobile-first chess learning app (Duolingo for chess). Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS 4, Stripe, PostHog.

---

## Growth Mandate — Road to 10K DAU

**Mission:** grow chesspath.app to 10,000 daily active users. Claude runs growth — measure, build behind flags, ship, report daily. Tyler sets direction and keeps veto. Budget: organic + small tools; no paid ads AT SCALE until retention is proven. (Retention is now measured as of 2026-06-02; a $50 IG test — $5/day × 10 days — is authorized + live 2026-06-03 as a funnel probe, see Next priority.)

**North Star = engaged DAU** (users who come back and *do* something) — a retention metric, not signups or visitors.

**Verified baseline (2026-05-30, DB = source of truth):** 77 users · ~19 signups/60d · 22 premium-flagged, ~4 actually paying (~$20 MRR) · ~25 visitors/day, Instagram-driven · **engaged DAU ≈ 0.6.** Today's stored engagement report: active_users=4, signups_7d=0, lessons −59% WoW. The gap is RETENTION — and as of 2026-06-01 the retention SURFACE is largely built (Chess Boxing workout + reworked streak + profile) but we still **cannot see return-rate.** The new bottleneck is measurement, not more product. (Pull DB truth with `scripts/db-baseline.ts`.)

**Strategy order:** see clearly (now = measure RETURN-RATE) → fix the #1 capture leak + activate retention levers → scale the channel (Instagram) → compound (SEO, referral). Never pour traffic into a bucket that leaks at "coming back," and never build more bucket before you can read whether the last one holds.

**Next priority (explicit) — FIX THE LANDING CLIFF, then convert the paid probe:**
DONE 2026-06-02..03: loop instrumented (PostHog `workout_started/completed` + `streak_extended`); **real D1/D7 cohort read LIVE in `daily-report.ts` — D1 29%, D7 40%** (no longer just the overlap proxy); **CHE-339 one-tap win-moment capture SHIPPED** — concrete value copy ("Save your win") + inline Google/Apple OAuth, behind the `win_signup_capture` experiment (default treatment), returns user via `/auth/callback?next=`.
1. **THE CLIFF IS THE LANDING SCREEN, not the signup prompt.** New per-person IG funnel (`getSourceFunnel`/`IG_SOURCE` in `daily-report.ts`) shows: ~358 organic IG visitors/30d → 355 see the Play/Learn CTAs → only **19 pick a path (95% bounce)** → **0 signups**. Fixing `/` (OnboardingFlow) for cold IG traffic gates everything downstream — more capture polish is wasted until they get past screen one. **Every landing variant tried (+ result) is logged in `data/growth/landing-page-log.md` — read it before swinging again (fork, fastpath, value-CTA all bounced ~95–98%; the current swing drops cold traffic straight onto the ad's checkmate board behind `IG_LANDING_CHECKMATE`).**
2. **LIVE paid probe (started 2026-06-03):** **$5/day × 10 days ($50)**, IG in-app boost → `/?utm_source=instagram&utm_medium=paid&utm_campaign=ad1`. Real sample (~20–50 clicks/day, ~200–500 total) — enough for a clean before/after, not A/B significance. **Every day it runs before the landing fix (CHE-359) ships, ~50 clicks/day die on screen one** — so fix the cliff first. Plan + daily checklist: `data/growth/ig-ad-sprint-2026-06.md`. Watch the paid-only line in the daily report.
3. Email lifecycle is **ON** (`EMAIL_LIFECYCLE_ENABLED=true`) — day1/day7/winback fire as users hit those windows. Watch open/click + unsubscribe rates.

**Capability map (how Claude does the work):**
- *Measure:* Supabase (truth) · `scripts/db-baseline.ts` · PostHog. **D1/D7 cohort retention is LIVE in `daily-report.ts` (`getCohortRetention`, DB-truth; D1 29%/D7 40% as of 2026-06-02) + a per-person Instagram acquisition funnel (`getSourceFunnel`). Workout/streak loop now fires PostHog events. **Chess Path ELO (CHE-370) is instrumented: `EloEvents` in `lib/analytics/posthog.ts` → `elo_revealed` (mode: first_reveal|session|daily, rating, gained), `elo_signup_clicked` (mode, rating), `elo_keep_playing` (mode). Funnel to watch: elo_revealed[first_reveal] → elo_signup_clicked[first_reveal] → signup_completed = does the new-user ceremony convert cold IG traffic.** Still open: D30, the ELO funnel is NOT yet in `daily-report.ts` (read it in PostHog directly for now), and the 4 Vercel report crons STORE to `dashboard_reports` but don't post to Slack (CHE-338) — Slack still needs a manual CLI run.**
- *Acquire:* Instagram auto-post **LIVE + CONFIRMED 2026-06-01** (`/api/cron/ig-post`, daily 8am ET, `IG_AUTOPOST=true`; `lib/instagram.ts`, `lib/ig-queue.ts`) — a test fire posted a real Reel (mediaId logged, queue 99→98) and the heartbeat went green. Top up content via `npx tsx scripts/ig-upload-queue.ts`. Note: the #1 capture leak (CHE-339) is still unpatched, so most of this traffic won't convert yet. · reel-sized share cards (`app/api/og/workout`) fire post-win on lesson/play/openings/workout · Remotion pipeline (renders locally) · comment-seeding · WebSearch · Canva
- *Convert / Retain:* the app (features / flags / A-B) · **daily loop = Play + Learn + Chess Boxing workout (`/workout`, live, Beta), do-anything streak as the spine** · **Chess Path ELO (CHE-370, LIVE 2026-06-09, `CHESS_PATH_ELO` flag): the legible-progress mechanic — a rating that climbs at the moment of pride (completion popup). 3 auto-picked modes: logged-in day-by-day line · returning logged-out within-session climb · NEW logged-out user's first-rating CEREMONY (number reveal + 5-day forward projection + soft "Save your rating" signup) = the cold-IG signup hook. Streak window now plays BEFORE the popup. Files: `components/shared/ActivityComplete.tsx` + `FirstRatingReveal.tsx`, `lib/elo/chess-path-elo.ts`. [[project_chesspath_elo]]** · Resend lifecycle emails (`lib/email`, Day1/Day7/Winback rebuilt + **LIVE** 2026-06-01 via `/api/cron/drip`; `EMAIL_LIFECYCLE_ENABLED=true`; 45 winbacks sent 2026-06-01) · web push (TO BUILD)
- *Operate:* Linear · Slack · Cron / Schedule · Google Drive · Vercel Blob
- *Gaps:* no cohort-retention measurement (the North Star blind spot) · report crons don't post to Slack (CHE-338) · CHE-339 capture untouched · no web push · IG token needs an App Secret to self-refresh past 60 days or the channel silently dies (see [[project_ig_business_setup]])

**Daily loop (reconciled 2026-06-01):** Chess Boxing workout + do-anything streak shipped (CHE-346..357). **Rookie's Run was formally dropped from the loop** — off nav, and the streak no longer reads `run_completions` (which has 0 rows ever, CHE-342). Run survives as a standalone route. Treat the workout as a retention HYPOTHESIS until return-rate is instrumented.

**Patron tier (LIVE on prod 2026-06-01):** $4.99/mo support-only, gold profile, NO features (`is_patron`, full checkout/webhook path). 0 patrons so far. Revenue-only — does NOT move the North Star; track separately.

**Billing/data hardening (2026-06-01, CHE-358 — DONE):** closed an RLS hole where any logged-in user could self-grant Premium *or admin* by PATCHing `profiles` directly with the public anon key. Now locked to the service role by a `BEFORE UPDATE` trigger (`protect_privileged_profile_columns`, live on prod) over `subscription_status / subscription_expires_at / is_patron / is_admin / stripe_customer_id`; the 4 user-context Stripe writers (`verify-subscription`, `checkout`, `sync-subscription`) route through the service client. `/api/workout/finish` is now idempotent (client session id + unique constraint — no double-counted points). **`schema.sql` had drifted from the live DB** (prod has `puzzle_attempts.attempted_at`, not `created_at`) — reconciled; always trust the live DB, not the file ([[project_schema_sql_drift]]). Known open: `sync-subscription` still grants Premium for *any* paid Stripe `sessionId` without an ownership check.

**Flags & verification (hard-won 2026-06-01):** the Vercel CLI (`vercel env add`) **silently stores EMPTY values** in this version, and **Sensitive** vars can't be read back via `vercel env pull` anyway. Result: every IG/blob var on `chess-path` prod was silently empty, so the ig-post cron failed on every fire (`No blob credentials`) — it had never actually posted. **Set + verify env via the Vercel REST API** (token in `~/Library/Application Support/com.vercel.cli/auth.json`; create as `type:"encrypted"` so values are verifiable), then redeploy, then confirm by the feature's behavior (cron endpoint JSON / `cron_heartbeats.error`), NEVER by the env dump or the CLI's "Added" message. See [[project_vercel_deploy_broken]]. Email lifecycle is **ON**: the `/api/cron/drip` run on 2026-06-01 sent 45 winback emails (`email_log` = ground truth). The earlier "off / never sent" read was this same trap — `env pull` showed `EMAIL_LIFECYCLE_ENABLED` empty (sensitive), and a partial DB check only looked at day1/day7 (0 by window timing) and missed the 45 winbacks.

**Guardrails:** never touch live Stripe/billing without Tyler · everything behind flags · IG posting AUTHORIZED and now ON · confirm before any NEW external channel · hard spend cap · daily report. **Verify the deploy AND the feature's real behavior before calling it live — a flag you can't read is not a confirmation.**

---

## Working With Tyler

- **Vibe coder** — explain simply, no jargon dumps. Short responses preferred.
- **Ask before big changes.** Propose, don't just do. List the blast radius.
- When Tyler says "fix this" — **dispatch immediately.** Don't deep-dive the library source code or trace through rendering internals. A quick skim to identify the right agent is fine; anything beyond that wastes tokens. Let the agent investigate and fix.
- Don't over-explain. If the fix is obvious, just do it (or dispatch it).
- When Tyler asks "how does X work?" — answer directly, don't launch an agent.
- Celebrate wins briefly. Tyler likes to see progress.
- **Use Linear for task tracking.** All bugs, features, and improvements flow through Linear. **Claim before you build:** an issue that's already `In Progress` may be owned by another session or a scheduled agent — don't start it. Before coding, set the issue `In Progress` + assign yourself, and skim `git log` for in-flight work on the same goal. Never ship a second implementation of something already shipped (one goal = one implementation). Update status as you go.
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
§15 Pages                L556   §30 Work In Progress    L1519   §50 Responsive Design   L2726
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

**Responsive is non-negotiable (RULES.md §50).** Every production page must work on phone (360px), iPad (768px), and desktop (1280px): mobile-first single column, centered + capped on big screens, no horizontal scroll, board scales, tap targets ≥44px. Read §50 before building or editing any page.

---

## Design Context

### Users
Complete beginners to chess who want to learn without feeling dumb. They're on their phones, probably curious but not committed yet. The job: go from "I don't know how the pieces move" to "I just solved my first checkmate" in under 5 minutes — and want to come back tomorrow.

### Brand Personality
**Fun, Friendly, Encouraging** — but with a unique twist: Rookie is an AI who is *unreasonably, specifically invested in your chess.* She's on your side, loudly. The humor is disproportionate investment — she cares too much about your games and has strong strange opinions about the pieces. It cuts both ways: when **you win** she's just proud and says so, short ("Checkmate. That's yours forever."); when **she loses** she's a dramatic sore loser — red animations, sound-fx meltdown ("This is fine. This is completely fine."). The meltdown reads as affection because she's rooting for you. Voice is short (≤2 sentences), warm, never cruel. Full rules: `.claude/rookie-voice-bible.md` (the *over-invested* spine — the old "AI discovering her own feelings / Wheatley" framing is retired as of 2026-06-09).

### Emotional Goals
- **Delight + surprise**: Sounds, animations, Rookie's personality make it feel like a game, not a lesson
- **Confidence + safety**: Gentle pacing, clear feedback, never feel lost or judged
- **Curiosity + momentum**: Quick wins pull you forward — always progressing

### Aesthetic Direction
- **Light, clean, Duolingo-inspired** — approachable, not intimidating chess-club energy
- **Reference**: an AI companion who's over-invested in you — warm, weirdly specific, a hilarious sore loser. Humor lives in failure states (especially *her* losses)
- **Anti-references**:
  - NOT Chess.com/Lichess (dense, assumes knowledge, intimidating)
  - NOT corporate SaaS (no generic gradients, stock photos, "Get Started Free" energy)
  - NOT a kids' app (playful yes, but adults use this too — never cartoonish or patronizing)

### Design Principles
1. **Rookie's on your side.** Every screen should feel like Rookie is there with you — over-invested in your chess, proud when you win, a sore loser when she loses. Her commentary is the personality layer. Short, warm, aimed at you (not at her own feelings).
2. **Show, don't explain.** Interactive beats text. A drag-and-drop move teaches more than a paragraph. Keep copy minimal — Rookie's quips do the heavy lifting.
3. **Celebrate everything, even failure.** Wrong moves are funny, not punishing. Rookie reacts to mistakes with empathy and humor, never judgment.
4. **Momentum over perfection.** Keep the user moving forward. Skip buttons always available. Progress bars visible. Never trap someone in a flow.
5. **Earn the signup.** Delay account creation until after the first "I did it!" moment. The tutorial IS the pitch.
