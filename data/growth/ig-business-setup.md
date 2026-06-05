# Instagram Business Setup — one-time, ~20 min

> **STATUS (2026-06-01): DONE + superseded.** This setup is complete and auto-posting is LIVE via the Instagram Login API direct (not Upload-Post) → Vercel Blob queue → daily cron `/api/cron/ig-post`, flag `IG_AUTOPOST=true`. The Upload-Post / Meta-Page plan below is historical — we went a different route. Open item: the IG access token needs an **App Secret** to self-refresh past 60 days, or the channel silently dies (see memory `project_ig_business_setup`).

**Why:** auto-posting (Upload-Post / Meta API) only works for an **Instagram Business** account linked to a **Facebook Page**. Creator accounts can't publish via API. Do this once and posting can be fully automated forever.

**Do it all on your phone in the Instagram + Facebook apps.** Have both installed and logged into the Rookie account.

---

## Part 1 — Create a Facebook Page (5 min)

You need a Page (not a personal profile). If a Chess Path / Rookie Page already exists, skip to Part 2.

1. Open the **Facebook** app (or facebook.com), logged in as you.
2. Tap the **menu** (☰, bottom-right on iOS / top-right on Android).
3. Tap **Pages** → **Create** → **Get Started**.
4. **Page name:** `Chess Path` (or `Rookie`).
5. **Category:** type and pick **"App Page"** or **"Education"** — either works.
6. Tap **Create**. Skip the optional bio/photo prompts for now (or add the logo from `public/event/chess-path-logo.png`).
7. You now have a Page. Done.

---

## Part 2 — Switch Instagram to a Business account (5 min)

1. Open the **Instagram** app, logged into the Rookie account.
2. Go to your **profile** → tap the **☰ menu** (top-right) → **Settings and privacy**.
3. Scroll to **For professionals** → tap **Account type and tools**.
4. Tap **Switch to professional account**.
5. Pick a **category** (e.g. "Education" or "App Page") → tap **Done**.
6. When asked **Creator** vs **Business** → choose **Business**. (This is the important one — Creator can't auto-post.)
7. Skip the contact-info / next-steps prompts. You're now Business.

---

## Part 3 — Link Instagram to the Facebook Page (5 min)

This is the connection the API actually checks.

1. Still in **Instagram** → profile → **☰ menu** → **Settings and privacy**.
2. Tap **Account Center** (near the top — the Meta hub that links your accounts).
3. Tap **Accounts** → **Add accounts** → **Facebook**.
4. Select the **Chess Path Page** you made in Part 1 (not your personal profile).
5. Confirm. Instagram and the Page are now linked under one Account Center.

> If Account Center shows your personal FB but not the Page, that's fine — the API links via the Page, and as long as the Page and IG Business are under the same login, the connection works. The aggregator's OAuth step (next) will surface the Page to pick.

---

## Part 4 — Verify it took (1 min)

1. Instagram → profile → you should see **"Professional dashboard"** / Insights available. That confirms Business.
2. On the Facebook Page, tap **Settings** → **Linked accounts** (or **Instagram**) → it should show the Rookie IG account connected.

If both show connected, you're done. **Tell me when this is set** and I'll wire the daily render straight into the posting API — after that, the daily video posts itself with zero clicks from either of us.

---

## What I handle after you finish

- Sign up the Upload-Post account (free tier, 10 posts/mo to prototype) — they're the **audited client**, so they absorb the TikTok audit + Meta App Review. You just do the OAuth connect once (tap "Connect Instagram," pick the Page).
- Wire `scripts/render-daily-video.ts` → one `POST /api/upload` with the MP4 + caption.
- Gate it behind a flag, test on the free tier, then flip to daily.

**Cost when live:** ~$16/mo (annual) for daily posting to IG + TikTok + YT Shorts from one call.
