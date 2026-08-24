# Chess Boxing Pro — setup checklist (Tyler)

Code is behind `CHESSBOXING_PRO` in `lib/config/feature-flags.ts` (default OFF). Everything below is what must exist OUTSIDE the repo before flipping it on. Spec: `docs/chess-boxing-monetization-and-exit-plan.md`.

**One entitlement.** Pro == the existing Premium (`profiles.subscription_status` + `subscription_expires_at`, checked by `isPremiumSubscription` / `isProSubscription` in `lib/subscription.ts`). Stripe writes it on the web; RevenueCat writes it from the iOS app via `/api/iap/revenuecat-webhook`. No second column, no second concept.

## 1. App Store Connect (in-app purchases)

App: Chess Boxing (the existing iOS record). Features → In-App Purchases → Subscriptions:

1. Create a Subscription Group: `Chess Boxing Pro`.
2. Add two auto-renewable subscriptions in that group:
   - Product ID `chessboxing_pro_monthly` — $5.99 / 1 month — introductory offer: **Free trial, 7 days**
   - Product ID `chessboxing_pro_yearly` — $39.99 / 1 year — introductory offer: **Free trial, 7 days**
   - Display name / description: "Chess Boxing Pro" — unlimited bouts and workouts, custom round cards, full history.
3. Localizations + review screenshot for each (Apple requires it before "Ready to Submit").
4. Agreements, Tax, Banking → Paid Apps agreement must be **Active** or products never load in the SDK.
5. Users and Access → Integrations → **App Store Server Notifications** are NOT needed (RevenueCat handles it) — but create an **In-App Purchase Key** (Users and Access → Integrations → In-App Purchase) and note its Key ID + Issuer ID for RevenueCat.
6. Sandbox tester: Users and Access → Sandbox → add a test Apple ID for TestFlight/sandbox purchases.

## 2. RevenueCat

1. Create a project `Chess Boxing`, add an **Apple App Store** app with the bundle id from `capacitor.config.ts` and upload the In-App Purchase Key from step 1.5.
2. Products: import `chessboxing_pro_monthly` and `chessboxing_pro_yearly`.
3. Entitlement: identifier **`pro`** — attach both products.
4. Offering: identifier **`default`** (mark it Current) with two packages: `$rc_monthly` → monthly product, `$rc_annual` → yearly product. (`lib/iap/revenuecat.ts` reads `current.monthly` / `current.annual`.)
5. API keys: copy the **Apple public SDK key** (`appl_…`).
6. Integrations → Webhooks → add:
   - URL: `https://chesspath.app/api/iap/revenuecat-webhook`
   - Authorization header value: a long random secret (this becomes `REVENUECAT_WEBHOOK_SECRET`)
   - Events: all (the route handles INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, PRODUCT_CHANGE, TRANSFER, CANCELLATION, EXPIRATION, BILLING_ISSUE; others are ignored with 200).
   - Environment: send both Sandbox and Production (the route logs `env=` so sandbox rows are visible).
7. Identity: the app calls `Purchases.configure({ appUserID: <supabase user id> })`, so RevenueCat `app_user_id` == `profiles.id`. Leave "anonymous → identified" merging at RevenueCat defaults.

## 3. Env vars (Vercel `chess-path` project — set via the REST API, then verify by behavior; the CLI silently stores empty values)

| Var | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_REVENUECAT_IOS_KEY` | prod + preview + `.env.local` | RevenueCat Apple public SDK key (`appl_…`) — client-side, must be `NEXT_PUBLIC_` and requires a rebuild of the iOS bundle |
| `REVENUECAT_WEBHOOK_SECRET` | prod | the Authorization value from step 2.6 |
| `STRIPE_PRICE_MONTHLY` / `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | prod | the NEW $5.99 monthly price id (see 4) |

Verify the webhook: `curl -X POST https://chesspath.app/api/iap/revenuecat-webhook -H "Authorization: <secret>" -H 'Content-Type: application/json' -d '{"event":{"type":"TEST"}}'` → `{"ok":true,"ignored":"TEST"}`. Wrong secret → 401.

## 4. Stripe (web pricing — dashboard only, no code)

Do NOT edit the existing $4.99 price (you cannot change a price's amount; active subscribers stay on it). Instead:

1. Products → Premium → **Add another price**: $5.99 / month, recurring. Add a 7-day trial at checkout later if wanted (the checkout route already passes `trial_period_days` only if configured — check `app/api/stripe/checkout/route.ts` before promising a web trial).
2. Copy the new price id (`price_…`) into `STRIPE_PRICE_MONTHLY` + `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` on Vercel, redeploy.
3. Update `PRICE_DETAILS.MONTHLY.amount` (499 → 599) and `description` in `lib/stripe.ts` so `/pricing` shows the right number (one-line code change; not done yet because the price id must exist first).
4. Yearly stays $39.99 — nothing to do.

## 5. iOS build

```
npm install            # already added @revenuecat/purchases-capacitor
npm run build
npm run ios:sync       # cap sync ios — pulls the RevenueCat pod into ios/App
npm run ios:open       # Xcode → Signing & Capabilities → + In-App Purchase capability
```

Then archive and upload a new build (the SDK key is baked in at build time). Test with a sandbox Apple ID on a device (Simulator cannot complete StoreKit purchases through RevenueCat reliably).

## 6. Flip the flag

`CHESSBOXING_PRO: true` in `lib/config/feature-flags.ts` → deploy web → new iOS build. Check `npx tsx scripts/daily-report.ts` → "CHESS BOXING PRO" section for limit hits, paywall shows, purchases, and the DB-truth active count.

## What the flag gates (all OFF = today's behavior)

- Free: 1 bout + 1 workout per local day (`/api/pro/limits`, enforced at launch points via `hooks/useProGate`: Ring/Locker home corners, the bout's Fight button, leaderboard empty-state link). Logged-out users are never limited.
- Pro: unlimited; custom bout cards + Official 11-round preset (bout pre-fight); full bout history + punch log (`/box/profile`, `/api/pro/history`); gold name + Pro pill on leaderboards and profile (patrons keep gold).
- Paywall: `components/chessboxing/ProPaywall.tsx` — StoreKit in the app, Stripe checkout on the web.
- Note: the lesson tree is NOT currently gated by premium anywhere in the code (only the daily puzzle counter exists and limits are disabled), so "full lesson tree in Train" is a no-op until a lesson gate exists. Decide before marketing it as a Pro perk.
