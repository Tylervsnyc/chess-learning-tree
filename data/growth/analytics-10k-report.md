# Chess Path — Road to 10K DAU: Consolidated Analytics Report

**Date:** 2026-06-06
**Source of truth:** Supabase DB (89 users) + Stripe `revenue_snapshots`. PostHog used only where it agrees with the DB, and explicitly distrusted where it doesn't.
**Inputs:** 8 parallel studies — Power Users, Aha-Moment, Event/Data-Quality Audit, Retention, Monetization, Cold-IG Activation, Feature Adoption, Acquisition Attribution.

> **Read this first — the one-line story.** We have a tiny, deeply-skewed base (89 signups, the founder + ~3 family accounts produce ~half of all activity). The product *works* for the few who engage — but **65% of everyone who ever does anything does it on exactly ONE day and never returns**, and the channel we're paying to scale (Instagram) is both the lowest-intent and worst-retaining source we have. The cliff is **screen one → first action → first return**, not the paywall and not the signup button. And almost every event-based number we've been quoting is wrong, in the direction that makes things look better than they are.

---

## Executive Summary

Across all eight studies, four facts converge and should drive every decision:

**1. There is a clear power-user profile, and it's about BREADTH, not volume.** Real champions (3 non-admin users: Aleh, walker, lemnsquare) do **3+ activity types across many days** — puzzles AND Play-Rookie AND Daily Rook. One-and-dones touch ONE thing on ONE day. The single cleanest statistical separator we found is *number of distinct activity types*: return rate climbs monotonically 0%→25%→54%→100% as users adopt 1→2→3→4+ features. The **1→2 feature jump more than doubles retention.** Two users with 481–485 puzzles each *still churned* because they never broadened past puzzles — proving volume in one mode does not retain. **Play Rookie is the retention engine** (68% of live actives use it; 55% return after a Play-only day, vs 14% for a lesson-only day).

**2. The aha-moment is "solve 1 puzzle correctly in the first 48h."** Hitters retain to D7 at **50% vs 12%** (4.2x), and to D1 at **43% vs 4%** (10.3x). It's binary — going from 0 to just 1–2 correct solves is where retention flips. Crucially, **speed does NOT help** (churned users actually hit their first puzzle *faster*), and **difficulty is not the problem** (95% of anyone who attempts a puzzle solves one). The bottleneck is purely *reaching a solvable puzzle at all* — and the recent IG cohort reaches it only **14% of the time vs 42% all-time.**

**3. Retention is a cliff, not a curve, and the headline number is flattering.** The "D7 40%" in the daily report is real but rests on **6 of 16 users** in a 60-day window and includes the founder. Honest full-history numbers: **D1 20%, D7 29%, D30 38% rolling** — but *exact-day* return collapses to D7 3% / D30 3%, meaning returns are sparse one-offs, not a habit. The worst single drop-off is signup-day → D1. Instagram retains worst of any source (D30 26% vs Direct 58%); the $50 paid IG probe has produced **~0 retained DB users.**

**4. We are flying blind, and we know which way the errors point.** `signup_completed` undercounts OAuth signups ~2.6–5x (recent window: DB 13 vs event 5) because the OAuth callback fires no analytics — **57% of recent signups (12/21) have no linkable PostHog identity at all.** `puzzle_attempted` overstates real activity ~10x and active users ~4x (PostHog 27 users vs DB 7). The level-test table is dead (0 rows ever) while its "completed" events still fire. The monetization funnel is effectively uninstrumented (1 checkout event for 22 premium accounts). **Every event-based count makes us look healthier or busier than the DB truth.**

**The strategic conclusion:** Stop building more retention surface and stop pouring paid traffic into the funnel. The next dollar of effort goes to (a) getting cold traffic to a *guaranteed first solve* on screen one, and (b) engineering the *second activity type* + the *first return*. Everything else is tuning a faucet with no water behind it.

---

## Pillar 1 — Power-User Microscope *(lead — this is the profile)*

**Headline:** Champions do 3+ activity types across many days; one-and-dones touch ONE thing on ONE day. Champions avg ~385 puzzles / 26 games / 17 active days vs ~13 puzzles / 1 game / 1 day for everyone else (admin excluded).

### The power-user profile (what our best users do differently)
- **Breadth is the signal.** 100% of champions do puzzles AND play a game AND complete a Daily Rook (avg breadth 3.5 activity types). One-and-dones: 67% puzzle / 36% game / 15% daily, avg breadth **1.2 types.**
- **Play-Rookie, not Lessons, is the engagement engine.** `game_sessions` are 89% Play-Rookie (301/339). The Learn path is effectively dead for real users — only 3 users *ever* completed a lesson and 84 of 90 completions are the admin.
- **The base barely retains:** only 24 of 89 users *ever* had more than one active day; just **9 are champion/engaged.** 37 profiles never logged a single action; 33 are pure one-and-dones.

### Key numbers
| Metric | Value |
|---|---|
| Champions (real, admin excluded) | **3** — Aleh, walker, lemnsquare |
| Engaged | 3 — martin, Shawn, thekap1 |
| One-and-done | 33 (largest behavioral cohort) |
| Never-active | 32 (incl. **3 premium-flagged**) |
| At-risk (31–90d cold) | 10 |
| Champion breadth / one-and-done breadth | 3.5 vs 1.2 activity types |
| `game_sessions` mix | play-rookie 301 / daily-rook 35 / lesson 3 |
| Game results | win 210, null 95, loss 22, draw 12 |

### Spotlight users
- **Aleh** (top real champion, FREE): 228 puzzles, 42 games, 17 active days, active today — a free user out-engaging nearly every premium account. **Prime upgrade target.**
- **martin** (lapsing, PREMIUM): 700 puzzles (#2 volume), 48 active days, but 4 games and 0 lessons; last active 20d ago. **Highest-value winback.**
- **Levi** (hot new signup, FREE): joined 2 days ago, already 102 puzzles + 2 games. The exact cold-traffic conversion we're chasing — nurture NOW.
- **francogabrielj965 / vickywakefieldjarrett** (churned, FREE): 485 / 481 puzzles, **0 games, 0 daily**, ~91–97d cold. Proof that heavy single-mode puzzle volume does NOT retain.
- **steve.roark.72** (DATA BUG): `current_streak = 167`, zero puzzles/games/daily, last activity 102d ago — a ghost streak (see Data Trust).

### Reproducible queries
```sql
-- game_sessions by type (client-side GROUP BY on .select('session_type'))
-- => play-rookie 301, daily-rook 35, lesson 3
-- Active-days per user = union of date-truncated timestamps across:
--   puzzle_attempts.attempted_at, lesson_progress.started_at,
--   game_sessions.started_at, workout_sessions.created_at,
--   daily_challenge_results.challenge_date
-- Segmentation keyed on REAL activity-days (NOT the buggy streak field):
--   totalActions==0 -> neverActive; activeDays==1 -> oneAndDone;
--   activeDays>=5 && recDays<=14 -> champion; activeDays>=3 && recDays<=30 -> engaged;
--   recDays<=30 -> casual; recDays<=90 -> atRisk; else dormant
-- Concentration: top-1 user = 2307/6464 puzzles (36%) + 170/339 games (50%); top-5 = 54% puzzles / 73% games
```

---

## Pillar 2 — Activation / Aha-Moment *(lead — this is the lever)*

**Headline:** The activation milestone is **"solve 1+ puzzle correctly in the first 48h."** Hitters retain to D7 at 50% vs 12% (4.2x), D1 43% vs 4% (10.3x). The lever is getting new users *to* a puzzle — not making puzzles easier.

### Why this is the milestone
- **Binary, not a dose curve:** 0 correct → 12% D7; 1–2 correct → **63%**; 21+ → 71%. The very *first* solve is where retention flips.
- **It's the SOLVE, not mere activity:** among users active in 48h, those who also solved retained 50% vs 11% for active-but-no-solve. Survives dropping power users.
- **Speed is a red herring:** churned median time-to-first-puzzle 0.1h (86% within 1h) vs retained 0.4h. Getting them moving *faster* is the wrong instinct — guaranteeing the first session *ends in a solve* is the right one.
- **Difficulty is NOT the bottleneck:** attempt→solve pass-through is ~95% everywhere. The leak is entirely "never reaches a puzzle."
- **Recent cohorts collapse at the milestone:** last 30d only **3/21 (14%)** solved in 48h vs 42% all-time. The IG-era funnel is failing to deliver users to the value moment.

### Key numbers
| Cohort | Solved 1+ in 48h | D7 retention |
|---|---|---|
| Hitters | — | **50%** (17/34) |
| Non-hitters | — | 12% (5/42) |
| All-time signups | 42% (37/89) | — |
| Last 30d signups | **14%** (3/21) | — |
| Active-but-no-solve | — | 11% (2/19) |
| Ghosts (zero activity ever) | — | 0 |

> Lesson completion is **NOT** a usable milestone: only 3 distinct users ever show `completed=true`, and all 92 "completed" rows have `puzzles_completed=0`. The flag is broken/legacy.

### Reproducible queries
```
within48(uid,when) = (when - signup) <= 48h
solved48(uid) = count(puzzle_attempts WHERE correct=true AND within48) >= 1
D7 retained = active on any DB activity offset 1..7 (DB-truth, mirrors getCohortRetention)
=> D7: HIT 17/34 (50%) vs MISS 5/42 (12%);  D1: HIT 15/35 (43%) vs MISS 2/48 (4%)
Funnel by cohort: signup -> attempted puzzle 48h -> solved>=1 48h
=> ALL 89 -> 39 -> 37 (42%);  last 30d 21 -> 3 -> 3 (14%)
```

---

## Pillar 3 — Data Trust / Event Taxonomy Audit *(brutally honest section)*

**Headline:** We track 70 live events but most counts are untrustworthy — and they all err toward making us look better/busier than the DB.

### Every number we now KNOW is wrong (and by how much)
| What | Event says | DB truth says | Error |
|---|---|---|---|
| **Signups (9d window)** | 5 (`signup_completed`) | **13** (auth.users) | ~2.6x undercount; recent OAuth ~5x |
| **OAuth signup capture (90d)** | 10 google | **25** OAuth (22 google + 3 apple) | **40% captured** (email path = 90%) |
| **Active puzzlers (30d)** | 27 distinct_ids | **7** (puzzle_attempts) | ~4x user inflation |
| **Puzzle volume (30d)** | 2,913 events | **276** rows | ~10x volume inflation |
| **Level-test completions** | 9 completed + 296 card-views (90d) | **0 rows EVER** in level_test_attempts | feature persists nowhere — silent integrity hole |
| **Premium / checkout** | 1 `checkout_completed` (90d) | **22** premium-flagged / 4 real subs | funnel uninstrumented |
| **Streak activity** | 9 `streak_extended` (90d) | 55 profiles with `current_streak>0` | spine badly under-fired |
| **Distinct users (30d, all events)** | 880 distinct_ids | **89** accounts ever | ~791 are anonymous guests |

### Root causes (confirmed in code)
- **Signup undercount:** the OAuth server callback (`app/auth/callback/route.ts`) fires **no analytics** — it only exchanges the code + emails. The signup event is client-side in `hooks/useUser.ts` (L182–195) behind TWO fragile gates: `localStorage.getItem('auth_method')` must survive the OAuth round-trip, AND `Date.now() - created_at < 60_000`. A slow redirect or any localStorage loss silently drops the signup. Email signups don't depend on the redirect, so they survive (90% captured).
- **puzzle_attempted** fires for anonymous/guest attempts that are never persisted, plus likely multiple fires per stored attempt.
- **Dead-alias events** (0 fires in 365d): `share_failed`, `checkout_abandoned`, `level_up` (live twin: `play_level_up`), `lesson_complete` (live twin: `lesson_completed`). Naming-drift orphans that will silently catch nothing if mis-wired.
- **`distinct_id` is reused across humans/sessions** (no `posthog.reset()` on logout): some June accounts carry event history back to January.

### Three corrupted PROFILE fields (do not use to score engagement)
- **ELO is frozen:** 88/89 users stuck at the 800 starting value (only the admin moved to 1700). Cannot anchor progression or a paywall.
- **best_streak is dead:** only 4/89 non-zero, while 55 have `current_streak>0`, and **52 have current > best** (impossible if maintained).
- **current_streak has ghosts:** steve.roark.72=167, timcox=25, mleteli1=12 — all with zero logged activity, likely orphaned from the dead `run_completions` feature (0 rows ever).

### Reproducible queries
```sql
-- HogQL: every event, count, distinct_ids, recency
SELECT event, count() c, count(DISTINCT distinct_id) u, max(timestamp) FROM events
WHERE timestamp >= now() - interval 30 day GROUP BY event ORDER BY c DESC;
-- signup_completed by method, 9d/90d  vs  auth.users by app_metadata.provider
-- puzzle_attempted: PH 2913/27 (30d)  vs  puzzle_attempts gte 30d => 276 rows / 7 users
-- level_test_attempts => count(*) = 0 all time; lesson_progress lesson_id ILIKE '%test%' => 0
-- RECOMMENDED: add an "event vs DB" reconciliation guard to daily-report.ts (flag any ratio outside 0.8–1.2)
```

---

## Pillar 4 — Retention Curves (DB truth)

**Headline:** True retention is a cliff, not a curve. 65% of activated users (46/71) have exactly ONE active day ever; the worst drop-off is signup-day → D1; and the "engaged base" is mostly founder + family.

### Key numbers
| Metric | Rolling (returned within N days) | Exact-day (active ON day N) |
|---|---|---|
| D1 | 20% (17/83) | 20% (17/83) |
| D7 | 29% (22/76) | **3%** (2/76) |
| D30 | 38% (26/68) | **3%** (2/68) |

- **The headline "D7 40%" reproduced and explained:** the 60-day-window clone gives D1 26% (6/23), D7 38% (6/16) — matching the daily-report within cohort drift. The gap vs full-history is the *window*, not a bug; older Feb/Mar cohorts retained worse and drag the honest number down.
- **The rolling-vs-exact divergence is the tell:** rolling D30 38% but exact-day D30 3% means a wider window just gives more chances to catch a *single* return — stickiness is NOT improving.
- **Engaged base is tiny + skewed:** 15/89 active last 7d (4 today). Founder alone = 37% of all active-user-days; top 3 = 56%. Only ~3 non-founders have real depth (Aleh 17 days, lemnsquare 9).
- **Source retention (62/89 matched to PostHog first-touch):** Instagram D7 22% / D30 26% / alive 13%; **Direct D7 41% / D30 58% / alive 20%** (~2x IG). Instagram — the channel being scaled — retains worst.
- **Paid IG probe:** exactly **1** DB signup attributed to `utm_medium=paid`. Resurrection is organically possible (10/71 came back after a 14d+ gap) but 56/71 are dormant now.

### Reproducible queries
```sql
-- offset = floor(activity_utc_day) - floor(signup_utc_day) over ALL activity tables
-- cohort eligible if (todayUTCday - signupUTCday) >= N+1
-- rolling-N = any offset in 1..N; exact-N = offset == N
-- Reconciliation vs daily-report getCohortRetention (60d window, game.ended_at) => 6/23, 6/16
-- PostHog first-touch per DB uuid: any(person.properties.$initial_utm_source / $initial_referring_domain)
--   classify instagram if utm ILIKE 'ig'/'instagram' OR ref ILIKE '%instagram%'  (NOTE: utm value is 'ig')
```

---

## Pillar 5 — Monetization

**Headline:** True MRR is **$19.96** from 4 Stripe subs (only **3 real external payers, ~$14.97** — the 4th is Tyler's admin). MRR has been frozen 6+ weeks. The biggest leak is the top of the funnel: 2,396 visitors (90d) → 4 paywall views → 1 checkout → 1 purchase.

### Key numbers
| Metric | Value |
|---|---|
| True MRR (Stripe `revenue_snapshots`) | **$19.96/mo**, flat since 2026-04-23 |
| Real external payers | **3** (drumrman, martin, rginns), ~$14.97 |
| Premium-flagged (DB) | 22 — but **only 4 have a Stripe link** (82% drift) |
| New subs last 30d / churned | 0 / 0 (flat 6+ weeks while free base grew 46→65) |
| 90d paywall funnel | 2,396 visitors → 4 paywall → 1 checkout → 1 paid (0.04%) |
| Last checkout event fired | **2026-03-25** (effectively dead since) |
| Patrons (`is_patron`) | 0 |

- The "22 paying" read is **86% wrong** — 18 are comped/manual Jan-Feb grants with no Stripe link; 4 are even past expiry but still flagged premium.
- The 3 real payers were high-engagement *before* paying, but 2 are now dormant auto-renewals (drumrman last active 2026-03-05; martin 2026-05-06) and **rginns has zero lifetime activity** — a phantom payer. At 3 payers, losing one is a 33% MRR hit.

### Reproducible queries
```sql
SELECT subscription_status, count(*) FROM profiles GROUP BY subscription_status; -- free 67, premium 22
-- Real payers: premium AND stripe_customer_id NOT NULL AND expiry future AND NOT is_admin => 3
SELECT count(*) FROM profiles WHERE subscription_status='premium' AND stripe_customer_id IS NULL; -- 18 (drift)
SELECT snapshot_date,total_subscribers,mrr_cents,new_subscribers_last_30d FROM revenue_snapshots ORDER BY 1;
-- => stable total_subscribers=4, mrr_cents=1996 since 2026-04-23; new30=0 since ~2026-05-01
-- PostHog 90d: paywall_viewed=4, checkout_started=1, checkout_completed=1 (last fired 2026-03-25)
```

---

## Pillar 6 — Cold-IG Activation (the live $5/day ad funnel)

**Headline:** Leak (a) the pre-touch bounce is ~30x bigger than leak (b): **97% of cold-IG (148/153) and 99% of paid-IG (139/141) land on `/welcome` and never touch the checkmate board.** They're real humans (96% iOS Mobile Safari) who bail in ~2s.

### Key numbers
| Funnel step | Cold IG (all) | Paid IG |
|---|---|---|
| Landed on `/welcome` | 153 | 141 |
| Touched the board (1st tap) | **5 (3%)** | **2 (1%)** |
| Won the mate | 5 (100% of touchers) | 2 (100%) |
| Signed up | ~1 (of ~6 winners) | 0 |

- **81% are silent** — only the auto pageview + the ~1s-delayed `onboarding_started`, no click, no board touch, not even a `$pageleave`. Cleanest paid bounces: 2–3 events, **0.0s** measured dwell; `/welcome` dwell median **1.9s**, 52% under 2s.
- **Engagement quality is perfect once they engage** (100% of touchers won the mate) — the board *works*; the problem is purely getting the first tap inside the ~2s window before the IG in-app webview unloads.
- **Leak (b) is real but tiny** (n=6 winners): 6 saw the prompt → 3 started OAuth → 2 dismissed → 1 signed up. Not worth optimizing until board-touch rate clears ~15–20%.
- **DB-reconciled:** cold IG genuinely produced ~0 signups (none of the 12 DB signups in 7d are IG first-touch), but the cause is upstream — the 97% never reach the board.
- **#1 missing measurement:** there is **no mount-time `board_rendered` event**, so we can't separate "rendered but idle" from "webview killed JS before render." `onboarding_started` fires too late (~1s post-mount).

### Reproducible queries
```sql
-- Per-person cold-IG funnel (7d). IG_SOURCE = initial_utm_source='instagram' OR initial_referring_domain ILIKE '%instagram%'
SELECT uniqIf(person_id, event='$pageview' AND properties.$pathname IN ('/','/welcome')) landing,
       uniqIf(person_id, event='onboarding_board_touched') board_touched,
       uniqIf(person_id, event='onboarding_checkmate_won') checkmate_won,
       uniqIf(person_id, event='signup_completed') signups
FROM events WHERE <7d window> AND <IG_SOURCE>;
-- => IG_ALL {landing:153, boardTouched:5, won:5, signups:0}; PAID {141, 2, 2, 0}
-- Dwell: properties.$prev_pageview_duration WHERE $prev_pageview_pathname='/welcome' (paid n=27: median 1.9s)
```
> Prior landing variants (all logged in `data/growth/landing-page-log.md`, all bounced ~95–98%): staged-reveal, fastpath, value-CTA, copy-swap. The constant failure across every variant: **nothing happens until the user acts.** The untried lever is *immediate motion/auto-progress* on screen one.

---

## Pillar 7 — Feature-Adoption vs Retention

**Headline:** Play Rookie is the retention engine (68% of last-30d actives, 55% standalone return). Chess Boxing Workout — the official "retention hypothesis" — has had **ZERO real users**; all 4 sessions are the admin.

### Key numbers
| Feature | All-time adopters | Last-30d real reach | Isolated-day return |
|---|---|---|---|
| **Play Rookie** | 27 | **68% (15/22)** | **55%** |
| Openings | 17 (19%) | 45% (10/22) | 43% (adopter return 67%) |
| Lessons | 50 (56%) | 41% (9/22) | **14%** |
| Puzzles | 45 (51%) | 27% (6/22) | 50% |
| Daily Challenge | 17 | 5% (1/22) | n/a (always bundled) |
| Workout | **1 (admin only)** | **0%** | n/a (4 rows, all admin) |
| Rookie's Run | 0 (dead) | 0% | — |

**The breadth ladder (the core finding, corroborates Pillar 1):**
| Features adopted | Return rate |
|---|---|
| 0 | 0% (0/16) |
| 1 | 25% (6/24) |
| 2 | **54% (13/24)** |
| 3 | 56% (5/9) |
| 4–6 | 100% (10/10) |

- **The 1→2 jump is the biggest inflection** — and Play is the most natural, most engaging 2nd surface.
- **Lessons/puzzles are the ACQUISITION surface, not retention** (highest adoption, where 56% of users land first — but a lesson-only day returns at just 14%). The retention work is the *handoff*, not more lessons.
- **Daily Challenge's apparent 76%/71% retention is a measurement trap** — admin played 56 distinct days, and it's structurally circular (you can only play once/day, so replaying IS returning). Among real users it's nearly dead.
- **Admin = 35% of all feature events; top 10 = 81%.** `daily-report.ts getCohortRetention` does NOT currently exclude the admin — every retention/feature metric that includes Tyler is distorted on an 89-user base.

### Reproducible queries
```sql
-- Adoption: distinct user_id per feature table. Breadth: count distinct feature tables per user.
-- Isolated-day causal test (admins excluded): key = uid|dayIndex; days where features.size==1 and feature==X,
--   check if user has a later active day  => play 55% (11/20), lesson 14% (2/14), puzzle 50% (7/14)
-- Live mix: among 22 non-admin users active last 30d, fraction touching each feature
-- Workout reality check: SELECT user_id,created_at FROM workout_sessions => all 4 rows = admin
```

---

## Pillar 8 — Acquisition Attribution + Identity Stitching

**Headline:** We can attribute almost none of our real signups: **57% of recent accounts (12/21)** — nearly all Google/Apple OAuth — have NO linkable PostHog person. The $50 IG ad drove 141 visitors and produced **ZERO** signups; the only IG-attributed signup in 30d was *organic*.

### Key numbers
| Metric | Value |
|---|---|
| Recent (30d) signups fully untracked | **12/21** (11 are OAuth) |
| `signup_completed` undercount (30d) | 8 events vs 21 DB accounts; Google capture ~27% (4/15) |
| Paid-IG visitors → signups | 141 → **0** (only 5 reached the signup prompt) |
| Anon persons carrying IG first-touch | 1,357 (first-touch capture works *in anon-land*) |
| IG-referrer visitors keeping first-touch | 463/468 — the break is at `identify()`, not capture |

- **The break is specifically the OAuth `identify()` boundary.** `identify()` only fires on the client email-signup/login/premium pages — never in the server OAuth callback. So a Google/Apple user's prior anonymous IG browsing is never linked to their account, and they get misfiled as "direct."
- **The IG ad's "0 signups" is partly real (a true 5/141 landing cliff) and partly a measurement artifact** (any paid-IG visitor who signed up via Google/Apple is invisible). The reported 0 is a *floor*, not a confirmed zero.
- **`distinct_id` reuse** pollutes person histories (events from January attached to a June account) — fix with `posthog.reset()` on logout.

### Reproducible queries
```sql
-- DB truth: sb.auth.admin.listUsers paged, app_metadata.provider + created_at (9d: g9/e3/a1; 30d: g15/e4/a2)
-- Match cohort emails to PostHog persons => only 10/21 matched, 9/21 have events under their uuid
SELECT uniqIf(person_id,event='signup_completed') signups, uniq(person_id) any FROM events
WHERE <30d> AND person.properties.$initial_utm_source='instagram' AND person.properties.$initial_utm_medium='paid';
-- => 141 landers / 5 prompt / 0 signups
-- 468 IG-referrer visitors: 463 keep $initial_referring_domain=instagram, 4 overwritten => anon first-touch is fine
```

---

## Data We Still Can't See (gaps)

**Measurement holes that gate decisions:**
1. **OAuth signup attribution is blind.** Channel is unknowable for 18 of 21 recent signups until the server-callback `identify()` ships. We literally cannot tell if the paid IG probe is working — its "0 signups" is a floor, not a fact.
2. **No `board_rendered` mount-time event** on the cold-IG landing — can't separate "rendered but idle" from "webview killed JS before render." This is the single missing measurement gating the whole landing sprint.
3. **Level-test outcomes persist nowhere** (0 rows ever in `level_test_attempts`, no `test` lesson_ids) — completion events have no DB to reconcile against; needs a code trace of the finish handler.
4. **Monetization funnel is uninstrumented** (1 checkout event in 90d) — free→paid conversion is unmeasurable from events; DB/Stripe only.
5. **`distinct_id` ≠ user.** ~791 of 880 30d distinct_ids are anonymous guests; event "distinct users" must be joined to identified persons before it means anything.

**Sample / confounding limits (read everything as directional):**
6. **n is tiny and admin-dominated.** 89 users; the founder is 35–37% of all activity. Only 3 real champions. Segment averages have very wide error bars.
7. **Causality is unproven everywhere** — breadth/solve/feature correlations could be selection (motivated users do more *and* return). Only a forced-first-solve A/B would prove the aha-moment causally.
8. **Workout (4 rows) and Daily Challenge (1 real user)** are too sparse to measure retention — adoption/reach conclusions only.
9. **Streak fields are corrupted** (best_streak dead, current_streak has ghosts) — any streak-based campaign or KPI is built on bad data until repaired.
10. **Dwell is measured on a ~13–26% subsample** (IG webview rarely fires `$pageleave`) and likely *overstates* real time-on-page — the silent 81% are probably faster than the 1.9s median.
11. **Apple "Hide My Email"** addresses can't be matched to PostHog by email even after a stitch fix — needs distinct_id-based linking.
12. **D30 cohort is single-digit counts** (rolling 26, exact 2) — directionally real, not statistically robust.

---

## Prioritized Action List

Ordered by leverage. Effort: quick (hours) / medium (days) / large (weeks).

### 1. Fix OAuth signup attribution — fire `identify()` + signup event from the server callback `[medium]`
**Why:** This single gap makes 57% of signups untrackable, undercounts OAuth ~2.6–5x, and makes the $50 IG probe look like 0 signups when we genuinely *cannot know*. Every attribution and funnel number for 60% of users is blind until this ships. **This is the highest-leverage data fix — it unblocks judging everything else.** Append `?just_authed=1&method=google` to the `/auth/callback` redirect and call `identifyUser(userId)` + `signupCompleted(method)` once on the landing client.

### 2. Get cold traffic to a GUARANTEED first solve on screen one — and measure board-touch `[medium]`
**Why:** The aha-moment (solve in 48h → D7 50% vs 12%) and the cold-IG cliff (97% never touch the board, but 100% who touch *win*) point to the same fix. Render the checkmate board at frame 0 (no logo/phase delays for the IG cohort), add a giant pulsing queen→h7 arrow, and add a mount-time `board_rendered` event so we can finally time `board_rendered → board_touched`. Judge the landing fix by the **IG-cohort "solved in 48h" rate**, not bounce or path-pick.

### 3. Engineer the SECOND activity type after the first win — Play Rookie as the spine `[medium]`
**Why:** Breadth is the clearest retention separator (1→2 features doubles return, 0%→25%→54%→100%). After a user's first puzzle/lesson win, surface a one-tap "Now beat Rookie" prompt. Play has the highest live reach (68%), best isolated-day return (55%), and a satisfying win rate (210 wins / 22 losses). Target: % of activated users who do ≥2 activity types within 48h.

### 4. Stop scaling Instagram spend + sequence monetization AFTER the landing fix `[quick]`
**Why:** IG retains worst of any source (D30 26% vs Direct 58%), the paid probe has produced ~1 retained DB user, and only 5/141 paid visitors even saw a signup prompt. The growth mandate says no paid scale until retention is proven. Pause/cap the $5/day boost until the screen-one fix (CHE-359/365) ships. Likewise, hold all paywall A/B tests — free→paid is 0/869 in 30d because almost nobody gets deep enough to hit a limit; tuning the paywall now is tuning a faucet with no water.

### 5. Ship a D1 return trigger + fix the streak data integrity bug `[medium]`
**Why:** The worst single drop-off is signup-day → D1 (exact-day return collapses to D7 3%), and 65% of activated users are one-and-done. Fire the existing Day1 email + a web push ~20h after a user's FIRST activity, deep-linked to one easy puzzle (not the home screen), targeting non-solvers specifically. **But first repair the streak fields** (best_streak dead in 4/89; ghosts like steve=167 with zero activity) — the streak is "the spine" of the loop yet currently can't be trusted as a return hook or a KPI.

*(Honorable mentions, lower rank: clean up `subscription_status` drift so "paying" = Stripe-linked + non-expired + non-admin; add an `is_admin` exclusion to `daily-report.ts getCohortRetention`; add an "event vs DB" reconciliation guard; investigate/remove the dead level-test pipeline; pull or instrument the Chess Boxing Workout — 0 real users.)*

---

*Compiled from 8 parallel DB-truth studies, 2026-06-06. All counts reconciled to Supabase + Stripe; PostHog used only as a labeled, distrusted secondary. Report path: `data/growth/analytics-10k-report.md`.*
