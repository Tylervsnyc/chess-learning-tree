# The Chess Path

A mobile-first chess learning app (Duolingo for chess). Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS 4, Stripe, PostHog.

---

## Growth Mandate — Road to 10K DAU

**Mission:** grow chesspath.app to 10,000 daily active users. Claude runs growth — measure, build behind flags, ship, report daily. Tyler sets direction and keeps veto. Budget: organic + small tools; no paid ads AT SCALE until retention is proven. (Retention measured as of 2026-06-02. The $50 IG probe ran Jun 3–12 and is CLOSED — 296 paid clicks → 0 signups; no more spend until the funnel converts, see Next priority.)

**North Star = engaged DAU** (users who come back and *do* something) — a retention metric, not signups or visitors.

**Verified baseline (2026-05-30, DB = source of truth):** 77 users · ~19 signups/60d · 22 premium-flagged, ~4 actually paying (~$20 MRR) · ~25 visitors/day, Instagram-driven · **engaged DAU ≈ 0.6.** Today's stored engagement report: active_users=4, signups_7d=0, lessons −59% WoW. The gap is RETENTION — and as of 2026-06-01 the retention SURFACE is largely built (Chess Boxing workout + reworked streak + profile) but we still **cannot see return-rate.** The new bottleneck is measurement, not more product. (Pull DB truth with `scripts/db-baseline.ts`.)

**Strategy order:** see clearly (DONE — return-rate + funnel instrumented) → **fix CONVERSION (now = the 91% first-action cliff) + the capture leak (CHE-390)** → activate retention levers → scale a proven channel → compound (SEO, referral). Never pour traffic into a bucket that leaks at the first action or at "coming back," and never build more bucket before you can read whether the last one holds.

**Next priority (explicit, reset 2026-06-15) — PROVE THE FIX ON FREE TRAFFIC, then attack the ENGAGEMENT cliff. We are NOT at the scale step.**
The $50 paid probe is CLOSED (Jun 12): **296 paid clicks → 0 signups.** Root cause found, not guessed — the capture exit was SEALED: every cold-IG OAuth tap happened inside Instagram's in-app webview where Google OAuth is hard-blocked. **CHE-390 (webview-safe auth) fixes it** — in a webview Google is hidden and email signup completes end-to-end. Verified 2026-06-15 in a real headless browser spoofing the IG UA (account + session → `/play`); **still UNPROVEN on live traffic** — need to see one webview signup in the wild.

The 14-day funnel (run `npx tsx scripts/daily-report.ts --days=14`) is the honest picture: landing→signup is **2% all traffic, 1% all-IG, 0% paid IG** (~1 signup/day, 16 in 14d). **The dominant leak is NOT signup — it's the FIRST ACTION: ~91% of IG visitors land and never touch the board.** Signup polish operates on the ~19 who reach the prompt; it cannot move a top line losing ~290 at the landing screen. **At 1–2% conversion, no volume reaches 10K — pouring traffic in just leaks faster. Do not scale until conversion + retention are fixed.**

1. **SHIP CHE-390 + prove on free organic IG.** No paid spend. Let free IG hit the now-open funnel a few days; watch the `in_webview` split in the daily report. First webview signup in the wild = leak truly closed.
2. **ATTACK THE 91% ENGAGEMENT CLIFF (the real bottleneck).** Why do 9 of 10 landers never make a first move? This is where the next BUILD goes — not more signup/landing copy. Cold-IG landing has failed 95–98% across every variant (`data/growth/landing-page-log.md`), which is itself the signal: **cold IG may just be a bad audience.** Live variant = checkmate board (`IG_LANDING_CHECKMATE`).
3. **8K email list = the only 10K-scale lever, but ON HOLD (Tyler, 2026-06-15)** until the funnel is proven. It's a WARM audience (≠ cold IG) and the honest test of whether the product converts when intent exists — but test with a ~200-person batch, never a blast, and only after conversion is fixed. See [[project_email_list_8k]].
4. Email lifecycle is **ON** (`EMAIL_LIFECYCLE_ENABLED=true`) — day1/day7/winback fire as users hit those windows. Watch open/click + unsubscribe rates.

**Capability map (how Claude does the work):**
- *Measure:* Supabase (truth) · `scripts/db-baseline.ts` · PostHog. **D1/D7 cohort retention is LIVE in `daily-report.ts` (`getCohortRetention`, DB-truth; D1 29%/D7 40% as of 2026-06-02) + a per-person Instagram acquisition funnel (`getSourceFunnel`). Workout/streak loop now fires PostHog events. **Chess Path ELO (CHE-370) is instrumented: `EloEvents` in `lib/analytics/posthog.ts` → `elo_revealed` (mode: first_reveal|session|daily, rating, gained), `elo_signup_clicked` (mode, rating), `elo_keep_playing` (mode). Funnel to watch: elo_revealed[first_reveal] → elo_signup_clicked[first_reveal] → signup_completed = does the new-user ceremony convert cold IG traffic. NOW auto-reported: `getEloFunnel` adds a CHESS PATH ELO section to `daily-report.ts` (reach by mode + ceremony→tap CTR + ceremony→signup conversion + keep-playing escapes).** Still open: D30, and the 4 Vercel report crons STORE to `dashboard_reports` but don't post to Slack (CHE-338) — Slack still needs a manual CLI run.**
- *Acquire:* Instagram auto-post **LIVE + CONFIRMED 2026-06-01** (`/api/cron/ig-post`, daily 8am ET, `IG_AUTOPOST=true`; `lib/instagram.ts`, `lib/ig-queue.ts`) — a test fire posted a real Reel (mediaId logged, queue 99→98) and the heartbeat went green. Top up content via `npx tsx scripts/ig-refill.ts --render=14` (renders ahead + uploads; the cron is weekday-aware — difficult reels on Thu/Sat — see RULES.md §44 Posting Pipeline). Note: the #1 capture leak (CHE-339) is still unpatched, so most of this traffic won't convert yet. · reel-sized share cards (`app/api/og/workout`) fire post-win on lesson/play/openings/workout · Remotion pipeline (renders locally) · comment-seeding · WebSearch · Canva
- *Convert / Retain:* the app (features / flags / A-B) · **daily loop = Play + Learn + Chess Boxing workout (`/workout`, live, Beta), do-anything streak as the spine** · **Chess Path ELO (CHE-370, LIVE 2026-06-09, `CHESS_PATH_ELO` flag): the legible-progress mechanic — a rating that climbs at the moment of pride (completion popup). 3 auto-picked modes: logged-in day-by-day line · returning logged-out within-session climb · NEW logged-out user's first-rating CEREMONY (number reveal + 5-day forward projection + soft "Save your rating" signup) = the cold-IG signup hook. Streak window now plays BEFORE the popup. Files: `components/shared/ActivityComplete.tsx` + `FirstRatingReveal.tsx`, `lib/elo/chess-path-elo.ts`. [[project_chesspath_elo]]** · Resend lifecycle emails (`lib/email`, Day1/Day7/Winback rebuilt + **LIVE** 2026-06-01 via `/api/cron/drip`; `EMAIL_LIFECYCLE_ENABLED=true`; 45 winbacks sent 2026-06-01) · web push (TO BUILD)
- *Operate:* Penelope (`workroom` MCP — board of record, NOT Linear as of 2026-06-15) · Slack · Cron / Schedule · Google Drive · Vercel Blob
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
- **Use Penelope (the `workroom` MCP) for task tracking — NOT Linear (as of 2026-06-15).** This project lives in the Penelope `chess-learning-tree` project (a 5-stage workflow: Measure → Acquire → Convert → Retain → Scale). All bugs, features, and improvements flow through Penelope: add a step (`add_step`) or task, move it on the board, `complete_item` when done, and `log_work` when you ship something real. CHE-xxx IDs still appear in commits/history as labels, but the live board of record is Penelope, not Linear. **Claim before you build:** check the project + board first (`get_project` / `get_my_board`) — a step already in `doing` may be owned by another session or a scheduled agent; don't start it. Skim `git log` for in-flight work on the same goal. Never ship a second implementation of something already shipped (one goal = one implementation). Update status as you go.
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
§15 Pages                L556   §30 Work In Progress    L1519   §50 Responsive Design   L2832
                                                              §51 Premove              L2908
```

---

## Streak — ONE Source of Truth (CHE-388, 2026-06-10 — do not regress)

The streak broke 3 times because every fix ADDED a layer instead of removing one (at the worst point: 4 competing implementations, 2 popup owners racing). The rule now is structural — one implementation per job, and any change that adds a second one is wrong by definition:

- **What counts:** finish ONE unit today — lesson, /play game, opening lesson, or workout. Derived LIVE from the 4 completion tables (`lesson_progress`, `game_sessions`, `workout_sessions`, `opening_progress`) in the user's local timezone by `/api/workout/streak`. Nothing is stored as a counter; `profiles.current_streak` is write-dead ghost data (CHE-368) — never read or write it.
- **All client reads** go through `lib/streak-client.ts` (`getStreak()` / `peekStreak()`): one shared cache + one day-and-user-validated localStorage snapshot. Every surface (nav badge, profile, completion screens) renders the same object, so two surfaces showing different numbers is impossible. Never fetch the endpoint directly, never keep a private copy.
- **The celebration has ONE trigger:** `claimStreakToday()` (in streak-client), called ONLY from completion screens — `ActivityComplete`'s pre-step and `StreakComplete` (workout finish). It polls for the just-landed write, then atomically claims via POST `/api/workout/celebrate` (first claim per user+day wins). If the write lands too late, it celebrates at the NEXT finished unit. **NEVER add a global watcher, navigation trigger, or layout-mounted backstop that can pop the celebration mid-activity** — that was the mid-lesson popup, deleted in CHE-388 (`DailyWorkoutWatcher`).
- **Server-side** (crons/emails) derives activity via `lib/streak/activity.ts` from the same 4 tables. Full rules: RULES.md §11.

## Performance Conventions (2026-06-09 audit — do not regress)

These shaved ~300KB off every page and ~20 DB queries per session. New code MUST follow them:

- **QUIP_POOL is lazy.** Never static-import `lib/quips/quip-pool` (or `lib/speech/line-pool` / `rookie-touchpoints`) from anything reachable from a page or the root layout — that re-ships 282KB to every visitor. Use `getQuipPool()` from `lib/quips/load-quip-pool.ts`.
- **Streak reads go through the cache.** Never `fetch('/api/workout/streak')` directly — use `getStreak()` from `lib/streak-client.ts` (`{ fresh: true }` only at completion surfaces). The raw endpoint is a 4-table scan.
- **Confetti is lazy.** Use `fireConfetti()` from `lib/confetti.ts`, never `import confetti from 'canvas-confetti'`.
- **Fonts are self-hosted.** DM Sans lives in `public/fonts/` with a preload in `app/layout.tsx`. Never add a Google Fonts `@import`/`<link>` to production CSS (render-blocking; killed in CHE-372). Test pages are exempt.
- **Middleware skips static files by extension.** If you add a new binary asset type to `public/`, add its extension to the `middleware.ts` matcher exclusion — otherwise every request runs a Supabase auth call.
- **Ability art ships as 512px WebP** (`public/abilities/*.webp`, ~20-30KB). The 1-2MB PNGs are source files only — never point `artFile()` at a `.png`; convert with sharp first (see CHE-377).

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
4. **Fix the cause, not the symptom.** Before editing any code for a bug fix, state the root cause in 2-3 sentences. Never ship a cache layer, duplicate call, retry, or localStorage mask to hide a bug — if you can't name the root cause, you haven't found it yet. If a bug has been "fixed" multiple times, the architecture is wrong. Remove the thing causing the problem instead of adding code to counteract it.
5. **If it's failed 3+ times, question the rules.** Repeated failures likely mean RULES.md is prescribing a broken pattern. Trace the actual code and fix RULES.md.

**Responsive is non-negotiable (RULES.md §50).** Every production page must work on phone (360px), iPad (768px), and desktop (1280px): mobile-first single column, centered + capped on big screens, no horizontal scroll, board scales (`ChessPathBoard`), tap targets ≥44px, `md:`/`lg:` breakpoints only. Read §50 before building or editing any page. **This applies to EVERY page without exception** — new or edited, primary or secondary. A page is not done until it passes the §50 4-point checklist. **Verify visually at `/test/responsive`**, which renders every route in phone/iPad/desktop frames side by side — add any new user-facing route to that page's `ROUTES` list.

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
