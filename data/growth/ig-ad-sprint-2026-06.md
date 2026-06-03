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

## Daily plan

| Day | Date | Focus |
|---|---|---|
| 0 | **Jun 3** | ✅ Ad live + UTM link in. ✅ Paid-only funnel built into `daily-report.ts`. ✅ One-tap win-moment signup live. Record day-0 baseline. |
| 1–2 | Jun 4–5 | **Fix the landing cliff** (the whole ballgame — see below). Ship behind a flag. |
| 3 | Jun 6 | First read of the paid funnel. Confirm clicks are landing + attributing to `utm_medium=paid`. Sanity-check CPC vs expectation. |
| 4–5 | Jun 7–8 | Iterate the landing fix on what the paid+organic IG funnel shows. Confirm the one-tap prompt is actually *reached* and `oauth_started` fires. |
| 6–7 | Jun 9–10 | Watch for first paid signups. If any signed up: do they come back (D1)? Email lifecycle (day1) should fire. |
| 8–9 | Jun 11–12 | Hold changes steady to get a clean tail-end read. Don't move the destination URL mid-flight. |
| 10 | **Jun 13** | **Readout + decision** (template below). Kill, scale, or fix-and-retry. |

---

## Day 1–2: fix the landing cliff (highest leverage)

The ad lands on `/` (OnboardingFlow). Cold IG traffic from a video hits a Play-vs-Learn
choice and 95% bounce. Leading hypotheses, cheapest-first:

1. **Choice paralysis.** They came from a 15-second video; a two-option fork kills momentum.
   → Detect IG/paid traffic (the UTM is in the URL) and serve **one dominant CTA** — lead with
   "Play Rookie" / drop them closer to the first move. Learn stays as a secondary link.
2. **Slow entrance.** Rookie's power-on animation delays time-to-tappable. → Fast-path the
   intro for UTM visitors so the CTA is instant.
3. **Value mismatch.** The landing headline should echo the ad's hook, not a generic line.

**Approach:** keep the destination `/?utm_source=instagram&utm_medium=paid` (don't change the
ad), and make **OnboardingFlow read the UTM and adapt** — streamlined single-CTA variant for
cold traffic, behind a flag. That way we control the experience in code without touching the ad
or muddying attribution. Tracked in Linear: **CHE-359**.

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
