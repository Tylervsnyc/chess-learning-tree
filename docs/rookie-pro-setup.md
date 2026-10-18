# Rookie Pro — setup checklist (Tyler)

**Rookie Pro (Tyler, 2026-10-18):** ONE subscription unlocks Pro in all three apps — Chess Path (web + iOS `ios-chesspath/`), Chess Boxing (iOS `ios/` + `/box` on the web) and Rookie's Revenge (`~/rookies-run`, its own repo). $4.99/mo or $39.99/yr, 7-day free trial, **one trial per person** across every app. Patron folds into Pro (Pro members get the gold profile; Patron is no longer sold while `PRO` is on; existing patrons keep their gold).

Code is behind ONE flag: `PRO` in `lib/config/feature-flags.ts` (default OFF — OFF = today's behavior, no limits, no paywall, no IAP UI). Everything below is what must exist OUTSIDE the repo before flipping it on.

**One entitlement.** Pro == the existing Premium (`profiles.subscription_status` + `subscription_expires_at`, `isProSubscription` in `lib/subscription.ts`). Stripe writes it on the web; RevenueCat writes it from all three iOS apps via `/api/iap/revenuecat-webhook`. No second column, no second concept.

**How cross-app unlock works.** Three Apple apps = three App Store Connect records = three subscription groups and three sets of product ids. All three live in ONE RevenueCat project, attach to ONE entitlement `pro`, and identify the customer by the Supabase uid (`app_user_id`). A purchase in any app lands on the same RevenueCat customer and the same `profiles` row. The paywall hides its buy buttons when the account is already Pro, so nobody subscribes twice. Product ids live in `lib/iap/products.ts`.

## 0. Run the SQL (Supabase SQL editor)

`docs/rookie-pro-sql.sql` — `review_usage` table (1 free game review a day) + `profiles.pro_trial_used_at` (one trial per person) + adds that column to `protect_privileged_profile_columns`. Code works before it runs (reviews unmetered, trial reads "not used").

## 1. App Store Connect — per app (Chess Path, Chess Boxing, Rookie's Revenge)

Shared, once: Agreements, Tax, Banking → **Paid Apps agreement Active** (or products never load). Users and Access → Integrations → **In-App Purchase key** (note Key ID + Issuer ID for RevenueCat; one key serves all apps). Users and Access → Sandbox → a sandbox tester Apple ID.

For EACH app — Features → Subscriptions:

| App | ASC record | Group | Monthly ($4.99) | Yearly ($39.99) |
|---|---|---|---|---|
| Chess Path | 6806865294 (`com.learnthroughstories.chesspath`) | `Rookie Pro` | `chesspath_pro_monthly` | `chesspath_pro_yearly` |
| Chess Boxing | 6796812770 (`com.learnthroughstories.chessboxing`) | `Rookie Pro` | `chessboxing_pro_monthly` | `chessboxing_pro_yearly` |
| Rookie's Revenge | its record (`com.learnthroughstories.rookiesrun`) | `Rookie Pro` | `revenge_pro_monthly` | `revenge_pro_yearly` |

1. Each product: auto-renewable, introductory offer **Free trial, 7 days**, display name "Rookie Pro", description e.g. "Unlimited lessons, game reviews, fights and Puzzle Boxing, plus the full Revenge ladder. One subscription works in all three apps." (never the word "bout", no emoji). Localizations + review screenshot each.
2. **Optional no-trial products** (for people who already used their one trial in another app — Apple would otherwise give them a second trial per app): same group, same prices, NO introductory offer: `<id>_notrial`, e.g. `chesspath_pro_monthly_notrial`, `chesspath_pro_yearly_notrial` (same for `chessboxing_` and `revenge_`). The webhook already accepts these ids. Skip this and the paywall still says "Start Rookie Pro" (no trial copy) for those people — but StoreKit will still grant Apple's trial on an app they have never subscribed in.
3. Xcode → Signing & Capabilities → **In-App Purchase** in `ios-chesspath/App`, `ios/App` (and the Revenge project).

## 2. RevenueCat — ONE project, three apps

1. Project (the existing one) → Apps → make sure there are three **Apple App Store** apps: Chess Path, Chess Boxing, Rookie's Revenge (bundle ids above), each with the In-App Purchase key from step 1.
2. Products: import all six (plus the six `_notrial` ones if you made them).
3. Entitlement identifier **`pro`** → attach EVERY product from all three apps. A product missing here = that app's purchase does nothing.
4. Offerings:
   - **`default`** (mark Current): packages `$rc_monthly` → each app's `*_pro_monthly`, `$rc_annual` → each app's `*_pro_yearly` (RevenueCat serves each app its own products from the same offering).
   - **`no_trial`** (optional, only if you made the `_notrial` products): `$rc_monthly` → `*_pro_monthly_notrial`, `$rc_annual` → `*_pro_yearly_notrial`. The paywall asks for it when the account already used a trial and falls back to `default` if it doesn't exist.
5. Project settings → **Restore behavior: "Transfer to new App User ID"** (the default). This is the "wrong account" fix: Restore moves the Apple ID's subscription to the signed-in account; the webhook gets `TRANSFER` and revokes the old account / grants the new one. The paywall shows "This Apple ID already has Rookie Pro on another account…" when it sees the mismatch.
6. API keys: copy the **Apple public SDK key** (`appl_…`) for EACH app (three). Also create a **secret API key** (v1, read-only is enough) — optional but recommended: the webhook uses it on `TRANSFER` to read the true expiry instead of copying it from the old account.
7. Integrations → Webhooks → ONE webhook for all three apps:
   - URL: `https://chesspath.app/api/iap/revenuecat-webhook`
   - Authorization header value: a long random secret → `REVENUECAT_WEBHOOK_SECRET`
   - Events: all. Handled: INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, NON_RENEWING_PURCHASE, PRODUCT_CHANGE, SUBSCRIPTION_EXTENDED, TEMPORARY_ENTITLEMENT_GRANT, REFUND_REVERSED (grant) · CANCELLATION, SUBSCRIPTION_PAUSED, BILLING_ISSUE (keep until expiry) · EXPIRATION (revoke, unless they also pay on Stripe) · TRANSFER (move). Anything not tied to entitlement `pro` / a Pro product is ignored with 200.
   - Environment: Sandbox + Production (the route logs `env=` and `app=`).
8. Identity: every app calls `Purchases.configure({ appUserID: <supabase user id> })`, so `app_user_id` == `profiles.id` everywhere.

## 3. Stripe (web) — dashboard only

1. Prices on the Premium product: **$4.99 / month** (the existing one) and **$39.99 / year** (existing). Nothing new needed if those are the current `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_YEARLY` ids. `lib/stripe.ts` already displays 499 / 3999.
2. Do NOT put a trial on the price — the 7-day web trial is in code (`app/api/stripe/checkout/route.ts`, only while `PRO` is on): skipped when the account already trialed anywhere (`profiles.pro_trial_used_at`) or the Stripe customer ever had a Pro sub. Patron checkout returns 410 while `PRO` is on.

## 4. Sign in with Apple — one person, one account in every app

Apple gives the same user id (`sub`) and the same private-relay email across apps ONLY when the apps are grouped. Without this, "Hide my email" users get a different Supabase account per app and their Pro won't follow them.

1. Apple Developer → Identifiers → App IDs: on **Chess Path** (`com.learnthroughstories.chesspath`) enable Sign in with Apple → **Enable as a primary App ID**.
2. On **Chess Boxing** (`com.learnthroughstories.chessboxing`) and **Rookie's Revenge** (`com.learnthroughstories.rookiesrun`): Sign in with Apple → **Group with an existing primary App ID** → Chess Path.
3. The web Services ID (used by chesspath.app + run.chesspath.app) → Configure → primary App ID = Chess Path; return URLs = the Supabase callback.
4. Supabase → Authentication → Providers → Apple → **Client IDs**: comma-separated list of the Services ID AND all three bundle ids: `<services id>,com.learnthroughstories.chesspath,com.learnthroughstories.chessboxing,com.learnthroughstories.rookiesrun`.

## 5. Env var NAMES (Vercel `chess-path` — set via the REST API as `type:"encrypted"`, redeploy, verify by behavior; the CLI silently stores empty values)

| Var | Where | What |
|---|---|---|
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY` | prod + preview + `.env.local` | Apple public SDK key, **Chess Boxing** app (baked into the iOS bundle at build) |
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY_CHESSPATH` | prod + preview + `.env.local` | Apple public SDK key, **Chess Path** app |
| `REVENUECAT_WEBHOOK_SECRET` | prod | the webhook Authorization value (2.7) |
| `REVENUECAT_SECRET_API_KEY` | prod | optional, recommended — RevenueCat secret API key for TRANSFER (2.6) |
| `STRIPE_PRICE_MONTHLY` / `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | prod | $4.99 monthly price id |
| `STRIPE_PRICE_YEARLY` / `NEXT_PUBLIC_STRIPE_PRICE_YEARLY` | prod | $39.99 yearly price id |

Revenge's own RevenueCat key lives in the `~/rookies-run` project, not here.

Verify the webhook: `curl -X POST https://chesspath.app/api/iap/revenuecat-webhook -H "Authorization: <secret>" -H 'Content-Type: application/json' -d '{"event":{"type":"TEST"}}'` → `{"ok":true,"ignored":"not_pro"}`. Wrong secret → 401.

## 6. iOS builds (one at a time, to completion)

```
npm run build:offline && npm run ios:sync                       # Chess Boxing
npm run build:offline:chesspath && npm run ios:sync:chesspath   # Chess Path
```

Grep the synced chunks for `chessboxing_pro_` / `chesspath_pro_` to confirm the right ids shipped. Test with a sandbox Apple ID on a device. A synced bundle is not an updated app — needs fastlane + review.

## 7. Flip the flag

`PRO: true` → deploy web FIRST → then new builds of both iOS apps (and Revenge from its repo). Watch `npx tsx scripts/daily-report.ts` → PRO section (gate hits, `pro_limit_hit` by kind = lesson / review / bout / workout, paywall shows, purchases, restores).

## Tyler checklist

- [ ] Run `docs/rookie-pro-sql.sql` in the Supabase SQL editor.
- [ ] ASC, all three apps: group `Rookie Pro`, monthly $4.99 + yearly $39.99, 7-day free trial; (optional) `_notrial` products; screenshots + localizations; In-App Purchase capability.
- [ ] RevenueCat: three apps in one project; entitlement `pro` on every product; offerings `default` (+ optional `no_trial`); restore behavior = Transfer; webhook URL + secret; copy three `appl_` keys + one secret API key.
- [ ] Stripe: confirm the $4.99 / $39.99 price ids are what the env points at.
- [ ] Sign in with Apple: Chess Path primary App ID, Boxing + Revenge grouped under it; Supabase Apple Client IDs = Services ID + three bundle ids.
- [ ] Vercel env via REST API (names above), redeploy, verify by behavior.
- [ ] Rebuild the iOS apps → flip `PRO` (web first).

## What `PRO` gates (all OFF = today's behavior)

**Chess Path** — every level open. Free accounts: **2 lessons a local day** (server-counted from `lesson_progress`, `/api/pro/limits`; lesson page opens the paywall on the 3rd) and **1 full game review a day** (`/api/coach-review`, `review_usage`; past the limit the model is not called and every move shows the locked row → paywall). Pro: unlimited both. Play vs Rookie is always free. Logged-out visitors are never limited (no server row to count; the limit is a reason to buy, not a reason to bounce a cold visitor).

**Chess Boxing** — free: 1 fight + 1 Puzzle Boxing a local day (`/api/pro/limits` via `hooks/useProGate` at the launch points). Pro: unlimited both, custom round cards + Official preset, full history + punch log, workout report lines, Fix-It, Box settings Pro row, gold name + Pro pill on the Chess Boxing leaderboard.

**Shared** — paywall `components/pro/ProPaywall.tsx` (design at `/test/pro-family-popup`), perks `lib/pro/benefits.ts` (one row per app), `/pricing` Pro table, Patron CTA hidden on `/profile`, one trial per person.
