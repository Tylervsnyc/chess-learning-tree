# Pro — setup checklist (Tyler)

One Pro across **Chess Path, Chess Boxing and Rookie's Revenge**. Code is behind `PRO` in `lib/config/feature-flags.ts` (default OFF; was `CHESSBOXING_PRO` until 2026-09-08). Everything below is what must exist OUTSIDE the repo before flipping it on. Spec: `docs/chess-boxing-monetization-and-exit-plan.md`; rollout plan: "Part 2 — Pro across all apps" in the family plan.

**One entitlement.** Pro == the existing Premium (`profiles.subscription_status` + `subscription_expires_at`, checked by `isPremiumSubscription` / `isProSubscription` in `lib/subscription.ts`). Stripe writes it on the web; RevenueCat writes it from BOTH iOS apps via `/api/iap/revenuecat-webhook`. No second column, no second concept.

**How cross-app unlock works.** Two Apple apps = two App Store Connect records = two subscription groups and two sets of product ids. They both live in ONE RevenueCat project, attach to ONE entitlement `pro`, and identify the customer by the Supabase uid (`app_user_id`). So a purchase in Chess Boxing lands on the same RevenueCat customer the Chess Path app sees, and vice versa; the webhook writes the same `profiles` row either way. The paywall (`components/pro/ProPaywall.tsx`) hides its buy buttons when the account is already Pro, so nobody subscribes twice.

## 1. App Store Connect (in-app purchases) — do this for BOTH apps

### 1a. Chess Boxing (existing iOS record)

Features → In-App Purchases → Subscriptions:

1. Create a Subscription Group: `Chess Boxing Pro`.
2. Add two auto-renewable subscriptions in that group:
   - Product ID `chessboxing_pro_monthly` — $5.99 / 1 month — introductory offer: **Free trial, 7 days**
   - Product ID `chessboxing_pro_yearly` — $39.99 / 1 year — introductory offer: **Free trial, 7 days**
   - Display name / description: "Chess Boxing Pro" — unlimited Chess Boxing and workouts, custom round cards, full history. One Pro also works in Chess Path and Rookie's Revenge. (Never the word "bout" in store copy.)
3. Localizations + review screenshot for each (Apple requires it before "Ready to Submit").
4. Agreements, Tax, Banking → Paid Apps agreement must be **Active** or products never load in the SDK.
5. Users and Access → Integrations → **App Store Server Notifications** are NOT needed (RevenueCat handles it) — but create an **In-App Purchase Key** (Users and Access → Integrations → In-App Purchase) and note its Key ID + Issuer ID for RevenueCat. One key serves both apps.
6. Sandbox tester: Users and Access → Sandbox → add a test Apple ID for TestFlight/sandbox purchases.

### 1b. Chess Path (app 6806865294)

Same steps, own group and ids:

1. Subscription Group: `Chess Path Pro`.
2. Products: `chesspath_pro_monthly` — $5.99 / 1 month, 7-day free trial; `chesspath_pro_yearly` — $39.99 / 1 year, 7-day free trial.
   - Display name / description: "Chess Path Pro" — all 8 levels, unlimited lessons, Rookie's full review. One Pro also works in Chess Boxing and Rookie's Revenge.
3. Localizations + review screenshot for each.
4. Xcode: add the **In-App Purchase** capability to BOTH projects (`ios/App` and `ios-chesspath/App`).

## 2. RevenueCat (ONE project, two apps)

1. In the existing project (`Chess Boxing`), Apps → **add a second Apple App Store app** for Chess Path with the bundle id from `ios-chesspath` (`capacitor.config.chesspath.ts`), reusing the In-App Purchase Key from step 1a.5.
2. Products: import `chessboxing_pro_monthly` + `chessboxing_pro_yearly` (Chess Boxing app) and `chesspath_pro_monthly` + `chesspath_pro_yearly` (Chess Path app).
3. Entitlement: identifier **`pro`** — attach ALL FOUR products. This is the cross-app unlock; a product missing here = that app's purchase does nothing.
4. Offering: identifier **`default`** (mark it Current) with two packages: `$rc_monthly` → monthly product, `$rc_annual` → yearly product. Each app is served its own products from the same offering (RevenueCat resolves per app). (`lib/iap/revenuecat.ts` reads `current.monthly` / `current.annual` and falls back to the product id per target.)
5. API keys: copy the **Apple public SDK key** (`appl_…`) for EACH app — there are two now.
6. Integrations → Webhooks → add (one webhook serves both apps; the route logs `app=` from the event's `app_id`):
   - URL: `https://chesspath.app/api/iap/revenuecat-webhook`
   - Authorization header value: a long random secret (this becomes `REVENUECAT_WEBHOOK_SECRET`)
   - Events: all (the route handles INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, PRODUCT_CHANGE, TRANSFER, CANCELLATION, EXPIRATION, BILLING_ISSUE; others are ignored with 200).
   - Environment: send both Sandbox and Production (the route logs `env=` so sandbox rows are visible).
7. Identity: BOTH apps call `Purchases.configure({ appUserID: <supabase user id> })`, so RevenueCat `app_user_id` == `profiles.id` everywhere. Leave "anonymous → identified" merging at RevenueCat defaults. Cross-app restore: `restorePro()` re-reads customer info once after `restorePurchases` so a purchase from the other app shows up on the first tap.

## 3. Env vars (Vercel `chess-path` project — set via the REST API, then verify by behavior; the CLI silently stores empty values)

| Var | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY` | prod + preview + `.env.local` | RevenueCat Apple public SDK key (`appl_…`) for the **Chess Boxing** app — client-side, must be `NEXT_PUBLIC_` and requires a rebuild of the iOS bundle |
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY_CHESSPATH` | prod + preview + `.env.local` | RevenueCat Apple public SDK key for the **Chess Path** app (`lib/iap/revenuecat.ts` picks it when `IS_CHESSPATH_APP`). `build-offline.mjs` WARNS (does not fail) if the target's key is missing — IAP is simply disabled in that bundle |
| `REVENUECAT_WEBHOOK_SECRET` | prod | the Authorization value from step 2.6 |
| `STRIPE_PRICE_MONTHLY` / `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | prod | the NEW $5.99 monthly price id (see 4) |

Verify the webhook: `curl -X POST https://chesspath.app/api/iap/revenuecat-webhook -H "Authorization: <secret>" -H 'Content-Type: application/json' -d '{"event":{"type":"TEST"}}'` → `{"ok":true,"ignored":"TEST"}`. Wrong secret → 401.

## 4. Stripe (web pricing — dashboard only, no code)

Do NOT edit the existing $4.99 price (you cannot change a price's amount; active subscribers stay on it). Instead:

1. Products → Premium → **Add another price**: $5.99 / month, recurring. Add a 7-day trial at checkout later if wanted (the checkout route already passes `trial_period_days` only if configured — check `app/api/stripe/checkout/route.ts` before promising a web trial).
2. Copy the new price id (`price_…`) into `STRIPE_PRICE_MONTHLY` + `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` on Vercel, redeploy.
3. Update `PRICE_DETAILS.MONTHLY.amount` (499 → 599) and `description` in `lib/stripe.ts` so `/pricing` shows the right number (one-line code change; not done yet because the price id must exist first).
4. Yearly stays $39.99 — nothing to do.

## 5. iOS builds (both apps, one at a time)

```
npm install                        # already added @revenuecat/purchases-capacitor
npm run build:offline && npm run ios:sync                       # Chess Boxing
npm run build:offline:chesspath && npm run ios:sync:chesspath   # Chess Path
```

Xcode → Signing & Capabilities → + In-App Purchase capability in BOTH projects. Then archive and upload each (the SDK key is baked in at build time; grep the synced chunks for `chessboxing_pro_` / `chesspath_pro_` to confirm the right ids shipped per bundle). Test with a sandbox Apple ID on a device (Simulator cannot complete StoreKit purchases through RevenueCat reliably).

## 6. Flip the flag

`PRO: true` in `lib/config/feature-flags.ts` → deploy web FIRST → then new builds of both iOS apps. Check `npx tsx scripts/daily-report.ts` → "PRO" section for gate hits by feature + app, paywall shows, purchases, restores, and the DB-truth active count.

## Tyler checklist (only Tyler can do these)

- [ ] ASC Chess Path (6806865294): subscription group, `chesspath_pro_monthly` $5.99 / `chesspath_pro_yearly` $39.99, 7-day trial; screenshots + localizations.
- [ ] Xcode: In-App Purchase capability in **both** projects.
- [ ] RevenueCat: add the Chess Path app to the existing project; attach its two products to entitlement `pro` and the `default` offering; copy the new `appl_` key.
- [ ] Env via Vercel REST API + `.env.local`: `NEXT_PUBLIC_REVENUECAT_IOS_KEY_CHESSPATH`; confirm the Boxing key + `REVENUECAT_WEBHOOK_SECRET` are really set (verify by behavior — the CLI stores empties).
- [ ] Stripe: new $5.99 monthly price; decide on the web 7-day trial.
- [ ] Confirm the product calls: 2 free levels, "3 free commented moves", Patron fold.
- [ ] Rebuild both apps → flip `PRO` (web first, then apps).

## What the flag gates (all OFF = today's behavior)

- Free: 1 Chess Boxing + 1 workout per local day (`/api/pro/limits`, enforced at launch points via `hooks/useProGate`: Ring/Locker home corners, the Fight button, leaderboard empty-state link). Logged-out users are never limited.
- Pro: unlimited; custom round cards + Official 11-round preset (pre-fight); full Chess Boxing history + punch log (`/box/profile`, `/api/pro/history`); gold name + Pro pill on leaderboards and profile (patrons keep gold).
- Patron fold: the "Become a Patron" CTA on `/profile` is hidden while `PRO` is on (webhook + `is_patron` gold stay for existing patrons). No Patron surface exists on `/pricing`.
- Chess Path gates (lesson depth Levels 3+, Rookie's full review / Try it / Fix-It) are the next steps in the plan (2.2 / 2.3) — not built yet. `hooks/useProGate` already carries the `ProGateFeature` ids for them and fires `pro_gate_hit {feature, app}`.
- Perks per app: `lib/pro/benefits.ts` (`PRO_BENEFITS`) — read by the paywall, `/pricing`, and the locked-level card. Change the pitch there, nowhere else.
- Paywall: `components/pro/ProPaywall.tsx` — StoreKit in the apps, Stripe checkout on the web; headline "Chess Path Pro" / "Chess Boxing Pro" by target; already-Pro accounts see only Restore.
