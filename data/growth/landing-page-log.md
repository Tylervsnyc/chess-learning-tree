# Landing-Page Experiment Log (cold IG funnel)

The cliff is screen one: cold Instagram traffic lands on `/welcome` (`OnboardingFlow`)
and bounces before doing anything. Every variant is gated by `isIgCohort()`
(`lib/growth/ig-cohort.ts`) so it only affects cold IG traffic — existing users
never see these. Flags live in `lib/config/feature-flags.ts` (`IG_SPRINT_FLAGS`).

**Read this before trying another landing variant — don't repeat dead ends.**
Append a row every time we swing. Truth = the PAID IG AD FUNNEL section of
`scripts/daily-report.ts`.

## Attempts

| # | Variant (flag) | Dates live | What it was | Result | Takeaway |
|---|---|---|---|---|---|
| 0 | Staged reveal (default `OnboardingFlow`) | pre-sprint | Rookie powers on, buttons appear ~1000ms, Play/Learn fork | ~94–95% bounce on cold IG | Hiding CTAs behind animation hurt; the menu fork was unclear |
| 1 | `IG_LANDING_FASTPATH` | 2026-06-03 (D1) | Skip the staged animation — CTAs instant | All 18 paid clicks saw the CTAs instantly, only 2 tapped | **Speed was NOT the cliff** |
| 2 | `IG_LANDING_VALUE_CTA` | 2026-06-04 → (D2) | "Learn chess in 5 minutes. Free." headline + one dominant "Start playing" CTA, basics demoted to a link | 48 paid landed → **1** tapped through → **0** signups (~98% bounce) | A value headline + single button is STILL a menu choice cold traffic won't make. 47/48 tapped nothing. |
| 3 | `IG_LANDING_COPY` | 2026-06-05 (D3) | Copy-only swap inside `ColdLanding`: challenge-framed headline echoing the ad hook ("Beat me in 60 seconds?", "Play me now") instead of the "learn" promise — reframes work → game | 53 paid landed → 3 picked a path (~6%) → 0 signups | Copy framing isn't the lever either. Words on a menu screen don't fix the menu. KILLED at lock-in. |
| 5 | `IG_LANDING_CHECKMATE` | 2026-06-06 → live (D5) | Drop cold IG **straight onto the ad's mate-in-1 board** (`/lesson/1.1.1`'s PUZZLE_1: Qd3→h7#, h7 glows green). Tap queen → tap glowing square → win → signup → continue lesson 1.1.1. New component `CheckmateLanding.tsx`; highest precedence. | Jun 6–9: 193 paid landed → **18 touched the board (~10%)** → 5 won the mate → 0 signups | **WINNER — only variant that moved a number** (~5x lift over the ~2% menu baseline). But 90% still bounce without touching, and 5 winners → 0 signups points the next fix at post-win capture (suspected: Google OAuth blocked in the IG in-app webview), NOT at more landing variants. Stays ON. |

Notes: Days 0–2 are the same *shape* (land → choose a button). Day 3 keeps that
shape but changes the words. Day 5 is the first variant that **removes the menu**
— the board is the screen. (Day 4 not run / not recorded.)

## Principles learned (so far)
- **Don't ask cold traffic to choose.** Every menu-shaped screen (fork, single CTA) bounced ~95–98%. The product should start before they decide.
- **Speed isn't the lever.** Instant CTAs (D1) barely moved tapping.
- **Message-match the ad.** The paid creative shows lesson 1.1.1's highlighted checkmate; the landing should BE that, not a pitch about it (the thesis behind D5).
- **Earn the signup.** Win first, capture at peak — never gate the board behind an account.
- **Measure the new failure mode.** Each variant must emit events that show WHERE it drops. D5 added `onboarding_board_touched` + `onboarding_checkmate_won` so the funnel finally distinguishes *landed-but-untouched* from *touched-but-didn't-win*.
- **No A/B/C yet.** At ~48 cold visitors/day a 3-way split needs ~2 months for significance. We run sequential single-variant swings vs the known ~0 baseline instead.

## How to read results
```
SLACK_WEBHOOK_URL= npx tsx scripts/daily-report.ts --date=<YYYY-MM-DD> --days=1
```
Read the **PAID IG AD FUNNEL** section. For D5 watch the new `Board touched` and
`Checkmate won` rows. Verify paid links in **incognito** (`$initial_utm` freezes
on first touch). After a variant has a day of traffic, fill its Result/Takeaway row.
