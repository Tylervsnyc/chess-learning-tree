# IG Ad Sprint — $5/day × 10 days ($50) (2026-06-03 → 2026-06-13)

**The probe:** Instagram in-app boost, **$5/day for 10 days = $50 total**, goal = website visits.
**Destination:** `https://chesspath.app/?utm_source=instagram&utm_medium=paid&utm_campaign=ad1`
**Started:** 2026-06-03 by Tyler.

---

## Reality check (read this first)

$5/day is a **real sample.** At a typical $0.10–0.30 CPC that's ~**20–50 clicks/day →
~200–500 total** over the 10 days (consistent with Tyler's "~50/day" estimate). That's
enough to read the funnel clearly day-by-day and to do a clean **before/after** on a landing
fix — though still well short of A/B statistical significance.

But here's the catch: against the funnel as it stands today (94–95% of cold IG visitors bounce
on the landing screen, 0 signups in 30 days), those ~50 clicks/day would produce **~0–1
signups/day** — i.e. we'd spend $50 mostly re-confirming the bounce. **Every day we run the ad
before fixing the landing screen, ~50 clicks die on screen one.**

So the urgent move is to **fix the landing cliff in the first day or two**, so the bulk of the
~500 clicks flow through the better funnel. With picked-a-path lifted 6% → 20% and the one-tap
capture that's already live, ~500 clicks could realistically yield **a handful to a dozen+
signups** — which would roughly double the *entire* recent signup rate. That's the prize.

The spend's job: (1) a clean isolated paid-IG baseline, and (2) a real before/after that proves
(or kills) the landing fix.

---

## The one number that matters

**Cold-IG "Picked a path" rate** — of people who land from IG, what % tap Play or Learn instead of bouncing.

| | Landed | Picked a path | Rate |
|---|---:|---:|---:|
| **Baseline (organic IG, 30d)** | 357 | 21 | **~6%** |
| **Target by Jun 13** | — | — | **≥20%** |

Everything downstream (activity → signup prompt → signup) is gated by this. Triple it and the same ad spend produces 3× the signups, for free.

---

## Daily ship plan (one experiment/day)

Days 1–5 attack the landing cliff from different angles; 6 capture, 7–8 retention, 9 viral, 10 lock-in.

| Day | Ship | Flag (`IG_SPRINT_FLAGS`) | Metric it moves |
|---|---|---|---|
| 1 | Fast-path landing (instant CTAs) | `IG_LANDING_FASTPATH` | picked-a-path |
| 2 | Single dominant "Play" CTA (kill the fork) | `IG_SINGLE_CTA` | picked-a-path |
| 3 | Landing copy echoes the ad hook | `IG_LANDING_COPY` | picked-a-path |
| 4 | Drop straight into a game (skip setup) | `IG_AUTOPLAY` | activity-started |
| 5 | Rigged first win → hit one-tap signup at peak | `IG_EASY_FIRST_WIN` | win-rate, prompt-shown |
| 6 | Win-prompt timing + copy iteration | (tune `win_signup_capture`) | prompt→oauth→signup |
| 7 | Post-signup activation (push 2nd action) | `IG_ACTIVATION` | D0 2nd-action |
| 8 | Explicit "come back tomorrow" + day-1 email | `IG_D1_NUDGE` | D1 (cohort) |
| 9 | Post-win share nudge | `IG_SHARE_LOOP` | share_clicked |
| 10 | Lock winners, kill losers, decision doc | — | full paid funnel before/after |

---

## DAILY AGENT RUNBOOK (read this — you run one day per fire)

You are a scheduled agent firing once each morning. Do **exactly one** day, then stop.

**Procedure:**
1. Read the **Progress Log** below. Do the lowest-numbered day NOT marked `DONE`.
   If yesterday's day is marked `BLOCKED`, retry it (don't skip ahead).
1b. **Reconcile before you build (anti-collision — this is mandatory).** An interactive
   session (Claude + Tyler) may have shipped a lever out of order while you were idle. Before
   implementing anything: run `git log --oneline -15`, `gh pr list` (look for open
   `ig-sprint/*` PRs), and read `IG_SPRINT_FLAGS` in `lib/config/feature-flags.ts`. If today's
   lever — or its *goal* — already shipped OR has an open PR, do NOT build a competing version.
   Instead: point the Progress Log at the existing commit/PR, mark that day `DONE`/`IN REVIEW`,
   and move on to the next genuinely-undone lever (or iterate on what shipped). **One goal = one
   implementation, ever.** Shipping a second take of an already-solved day is the failure this
   step exists to prevent.
2. Read that day's spec under **Per-day specs**. Implement it:
   - Add/flip the day's flag in `lib/config/feature-flags.ts` (`IG_SPRINT_FLAGS`).
   - Gate ALL new behavior behind `isIgCohort()` (`lib/growth/ig-cohort.ts`) so only
     cold IG traffic is affected. Default the flag ON (= live for the IG cohort).
3. Run `npm run check` then `npm run build`. **If either fails, fix it; if you can't in
   reasonable effort, mark the day `BLOCKED` in the log, ship NOTHING, Slack-report the
   blocker, and stop.**
4. If green: **NEVER push to `main`.** Interactive sessions (Claude + Tyler) work live on
   `main`; pushing there is exactly what caused the Day-2 collision. Use a branch + PR:
   - `git checkout -b ig-sprint/day-N-<flag>`
   - `git add` only the files you changed, commit (Co-Authored-By line).
   - `git push -u origin ig-sprint/day-N-<flag>`
   - Open a PR: `gh pr create --base main --title "IG sprint Day N — <flag>" --body "<spec + how to verify>"`.
     If `gh` isn't authed in the sandbox, skip it and Slack the one-click PR link instead:
     `https://github.com/Tylervsnyc/chess-learning-tree/compare/main...ig-sprint/day-N-<flag>?expand=1`
   - **Do NOT merge it yourself.** Tyler (or an interactive session) reviews + merges — that's
     when it deploys and goes live for the IG cohort. The PR gets a Vercel **preview** URL;
     verify your change on it with `?utm_source=instagram&utm_medium=paid` before reporting.
5. Append an `IN REVIEW` entry to the Progress Log (day, date, flag, branch, PR # or link,
   one-line what). It flips to `DONE` only once the PR is merged — until then, step 1b treats
   it as in-flight so the next fire won't rebuild it.
6. **Slack report → channel `#all-learnthroughstories` (id `C09J5AV49FT`) via the Slack
   connector.** Generate the report by running `npx tsx scripts/daily-report.ts --days=10`
   (capture stdout — do NOT rely on `--slack`, the webhook isn't configured). Post the report
   text to that channel via the Slack connector, then a one-line human note: the day + flag +
   **PR link**, an explicit "⏳ awaiting Tyler's merge — not live yet," and yesterday→today
   movement in the PAID IG AD FUNNEL picked-a-path rate. If the report script can't run (missing
   env), still post the one-line note + PR link.

**Environment notes (you run in a fresh cloud sandbox):**
- Run `npm install` first if `node_modules` is missing.
- There is likely NO `.env.local` here (no Supabase/PostHog/Slack/Stripe keys). So:
  - **Hard gate = `npm run check`** (lint + typecheck — needs no env vars). It MUST pass.
  - Attempt `npm run build`, but it may fail purely from missing env — that's NOT a code
    failure. If `check` is green and the only build error is missing-env, proceed: Vercel
    builds with the real env on deploy, and if Vercel's build fails, prod simply stays on the
    last good deploy (safe). If you cannot even run `npm run check`, mark `BLOCKED`.
  - If `scripts/daily-report.ts --slack` fails for missing keys, post your report via the
    **Slack connector** instead (a short note: day shipped, flag, commit). Don't block on it.

**Hard safety rules (never violate):**
- NEVER touch Stripe, billing, `subscription_status`, `is_admin`, auth security, or the RLS
  triggers. Funnel/landing/onboarding/play UX only.
- EVERYTHING gated by `isIgCohort()` + a flag. Non-IG users must see zero change. If a change
  can't be cohort-scoped, mark `BLOCKED` and report — do not ship it broadly.
- Ship only if `npm run build` passes. No `--no-verify`. One commit, one day.
- Do NOT change the ad's destination URL or anything in Meta/Instagram (Tyler-only).
- Respect the $50 cap — you don't control spend, just the funnel.
- If the PAID funnel shows picked-a-path *dropping* vs the prior day after your last ship,
  flag it loudly in Slack (a regression may need reverting).

---

## Per-day specs

**Day 1 — `IG_LANDING_FASTPATH`** ✅ done. `OnboardingFlow` jumps to phase 5 for the IG cohort so CTAs are instant (no staged power-on). Also fixed the `/`→`/welcome` redirect to preserve the UTM.

**Day 2 — `IG_LANDING_VALUE_CTA`** ✅ done (shipped as `ColdLanding`, commit c4a3399). For the IG cohort, replace the whole Play/Learn fork with a value-led screen: "Learn chess in 5 minutes. Free." headline + ONE dominant "Start playing" CTA, basics demoted to a link. Kills choice paralysis AND adds the value hook. Metric: picked-a-path. (Superseded the removed `IG_SINGLE_CTA` take.)

**Day 3 — `IG_LANDING_COPY`.** The value headline already shipped in `ColdLanding` (Day 2), so this is now **copy iteration only**: tune the existing `ColdLanding` headline text to match the live ad creative (e.g. "Beat me in 60 seconds?" / "Chess, the fun way — your first game's on me"). Edit the headline in `components/onboarding/ColdLanding.tsx` — do NOT add a new flag or a competing landing. Metric: picked-a-path.

**Day 4 — `IG_AUTOPLAY`.** For IG cohort, the Play CTA routes into `/play` and auto-starts a game (skip the /play setup screen) — land them as close to the first move as possible. `/play` reads a query/flag to autostart. Metric: activity-started (`game_started`).

**Day 5 — `IG_EASY_FIRST_WIN`.** For the IG cohort's first game, start Rookie at a low skill level / blunder-prone so they get a fast win and hit the (already-live) one-tap signup at the dopamine peak. Metric: new-session win-rate, prompt-shown.

**Day 6 — win-prompt iteration.** Tune the live `win_signup_capture` prompt for IG: timing (fire immediately on win vs after the celebration) and `valueLabel`/copy. Metric: prompt-shown → `oauth_started`.

**Day 7 — `IG_ACTIVATION`.** After an IG signup, nudge the new user toward a 2nd action (start the streak / a 2nd game) instead of dropping them at home — reduce one-and-done. Metric: D0 second-action rate.

**Day 8 — `IG_D1_NUDGE`.** Make the "come back tomorrow" promise explicit at the IG win moment, and verify the day-1 lifecycle email fires for the IG cohort. Metric: D1 (cohort read).

**Day 9 — `IG_SHARE_LOOP`.** Nudge IG visitors to share the post-win share card (viral coefficient). Metric: `share_clicked` from the paid/IG cohort.

**Day 10 — lock-in.** No new feature. Read the full paid funnel before/after, set winning flags to stay ON and losers to `false`, fill in the Decision template below, and post the final readout to Slack.

---

## Progress log (the daily agent appends here)

- **Day 0** — 2026-06-03 — `DONE` — ad live + UTM, paid funnel + cohort retention in daily-report, one-tap win capture (CHE-339). Baseline picked-a-path (IG) ~6%.
- **Day 1** — 2026-06-03 — `DONE` — `IG_LANDING_FASTPATH` — commit 33497fb — instant landing for IG cohort + UTM-preserving redirect fix.
- **Day 2** — 2026-06-04 — `DONE` — `IG_LANDING_VALUE_CTA` — commit c4a3399 — value-led `ColdLanding` for the IG cohort: **"Learn chess in 5 minutes. Free."** headline + ONE dominant "Start playing" CTA, basics demoted to a link (`components/onboarding/ColdLanding.tsx`). Supersedes the earlier `IG_SINGLE_CTA`/1f1a8ad take, which was **removed** — same single-CTA goal *plus* the value hook. **This also delivers Day 3's value-copy intent**, so Day 3 = copy iteration on this headline, not a new mechanism.
  > Collision note: `IG_SINGLE_CTA` (1f1a8ad) and `ColdLanding` (c4a3399) were two parallel implementations of Day 2 — the scheduled agent and an interactive session shipped the same day at once. Resolved to one. See the anti-collision step in the runbook.
- **Day 3** — 2026-06-05 — `DONE` — `IG_LANDING_COPY` — commit 483395a — copy iteration on the existing `ColdLanding` (no new landing): swap the headline to challenge-framed copy that echoes the paid IG ad hook — **"Beat me in 60 seconds?"** + "Your first game's on me. No account needed." + CTA "Play me now". Reframes the screen from "learn" (work) to "play me" (a game). Gated behind `IG_SPRINT_FLAGS.IG_LANDING_COPY` (default ON) + `isIgCohort()`; off → falls back to the Day-2 value headline. `npm run check` + `npm run build` both green. Metric: picked-a-path.

---

## How to read it

```bash
# Paid-IG funnel (and all-IG, cohort retention, welcome funnel) for the last N days:
npx tsx scripts/daily-report.ts --days=10
```
Look at the **PAID IG AD FUNNEL** section. It counts distinct *people* attributed to the
boosted ad by first-touch `utm_medium=paid`, so it's isolated from organic IG and from your
existing traffic.

---

## Decision template (Jun 13)

- Clicks delivered: ___ · CPC: $___ · Landed: ___
- Picked-a-path rate (paid): ___% (baseline 6%, target ≥20%)
- Signups (paid): ___ · Cost per signup: $___
- D1 return of any paid signups: ___

**Decision:**
- **Picked-a-path ≥20% and ≥1 signup** → the funnel works for cold traffic; scale spend cautiously.
- **Picked-a-path lifted but 0 signups** → activation works, capture/value needs another pass.
- **Picked-a-path still <10%** → the landing fix didn't land; cold IG may need a different creative or a dedicated landing page before more spend.

---

## Guardrails

- **$50 hard cap** ($5/day × 10 days). This is a learning probe, not a budget to grow. No top-ups or daily-budget increases without Tyler.
- **Don't change the destination URL mid-flight** (breaks attribution) — change the *experience* in code instead.
- Everything behind flags. Daily report watch. No new external channels without Tyler.
