# Chess Boxing — Monetization & Exit Plan

Written 2026-08-24. Research: Dr. Wolf / chess-app pricing, Chess.com M&A history, small-app exit benchmarks (sources at bottom).

## The one-paragraph thesis

Chess.com does not buy traffic. It buys three things: engine/tech + team (Komodo 2018), a **distinct learning product with its own personality that serves a segment the main app doesn't** (Dr. Wolf 2020 — still standalone six years later), or a bundle with a star + audience (Play Magnus, $83M, then mostly shut down). Under PE ownership since 2022 (General Atlantic; CVC joined June 2026) it is in consolidate-and-profit mode: chess24 closed, Aimchess dormant, print divested, layoffs. Chessboxing to Chess.com is entertainment adjacency (they hosted the Mogul event; their only "chessboxing feature" was an April Fools joke), not a category. So the sale story is **"the Dr. Wolf slot for a segment nobody serves, with real retained subscribers"** — not "a chessboxing app." Chess boxing is the wedge that makes the brand un-copyable and gets a community; Rookie + a beginner-friendly train/bout loop is what a buyer actually pays for.

Realistic prices, from marketplace data (Flippa/Acquire.com 2024-26: ~2-3x revenue, 3-4x profit for small subscription apps):

| Stage | What we have | Price range |
|---|---|---|
| Today | ~$20 MRR, iOS app just shipped, no IAP | not sellable as a business; code + brand only, $5-30K |
| Cash-flow | $10-20K MRR, 2+ yrs old, clean cohorts, mostly organic | $150-600K on Acquire.com |
| Strategic | $30-80K MRR + de facto app of the sport (gyms, WCBO, scoring standard) | $1-4M (Chess.com, Take Take Take, a promoter, or a fitness co) |

## Monetization model (decided by what works everywhere else)

Every winning chess app under $10M revenue has **one paid SKU, play never paywalled, depth gated, $4-12/mo with annual as the anchor** (Dr. Wolf $5.99/$39.99, ChessKid $49/yr, Chessable $74.99/yr, Chessly $89.99/yr). Hardware+sub boxing (FightCamp $90M raised → ~$9.6M rev and shrinking; Liteboxer pivoted to VR) is the cautionary tale; software-only Boxx at ~£40/yr survives.

**Chess Boxing Pro — $5.99/mo · $39.99/yr, 7-day full-access trial, one tier.**
(Current Stripe Premium is $4.99/$39.99; move monthly to $5.99 = Dr. Wolf parity. iOS must use StoreKit IAP — Apple forbids linking out for digital goods — so this needs RevenueCat via Capacitor, which also gives us the cohort/churn data buyers ask for.)

Free forever (this is the community and the growth engine):
- Play vs Rookie, unlimited
- 1 bout/day, 1 workout/day
- Leaderboards, crews, streak, share cards
- Daily puzzles

Pro (depth, not access):
- Unlimited bouts + workouts, custom round configs (sport-official 11-round format, "Pro Bout" two-clock mode)
- Bout history + Rookie's post-bout review (the Dr. Wolf-style coaching unit — Rookie is the sellable personality)
- Full Chess Path lesson tree inside TRAIN
- Punch-cam / Quadrant Fight stats history
- Season badges on the leaderboard (cosmetic)

**Second revenue line — Crew Packs (B2B2C, the ChessKid model).** ChessKid grows on $20-30/yr bulk seats sold to schools, not $10/mo parents. Our analog: a gym or club buys Pro for its crew at $25/seat/yr, min 10. Targets: Chessboxing NYC at Gleason's (already the test cohort; they sell 3-month memberships, so an app seat is an easy add-on), CBOI India (~1,000 registered chess boxers — the largest disclosed base anywhere), WCBO member clubs in 38 countries, LA/London/Berlin clubs. A dozen gyms = $3-5K ARR each and, more importantly, the "de facto app of the sport" story.

Kill / don't do:
- Patron tier — fold into Pro (0 patrons, splits the pitch)
- Ads, gem currencies, multiple tiers, hardware
- Paid acquisition until trial→paid and D30 are known (same lesson as the $50 IG probe)

## Roadmap to a sale

**Phase 0 — Instrument for a buyer (now → Nov 2026).** App Store approval lands; ship IAP behind a flag with RevenueCat; 7-day trial; fold Patron. Track the exact list buyers ask for: install→trial→paid, D30, monthly churn, annual renewal, organic share, ops hours/week. Goal: first 10 paying, dashboard exists. This is a Measure-stage step on the board.

**Phase 1 — First real revenue (Dec 2026 → mid 2027).** Target $2-5K MRR and the start of 12 months of clean data. Channels that are free and already working: IG reels (difficult-puzzle reels do 1-2K views; make chessboxing bout clips the second format), Gleason's crew → first Crew Pack, Alexander Selden's group, Bridge Bout and similar events as content. Ask WCBO/CBOI for an "official training app" conversation — cheap for them, huge for the story.

**Phase 2 — Sellable business (2027 → 2028).** $10-20K MRR, 2+ years old, 4+ months of subscriber cohorts, ≤5% monthly churn (2% = great), 60%+ annual renewal, 80%+ organic. Listable on Acquire.com at $150-600K. Also the point where Chess.com/Take Take Take conversations are worth opening (warm intro via the Mogul/Chess.com events people, or Dr. Wolf's founder).

**Phase 3 — Strategic (2028+).** $30K+ MRR and the sport's default app (rating standard, gym network, event scoring). Buyers: Chess.com (Dr. Wolf slot — keep Rookie standalone-able), Take Take Take (building play/learn, the active challenger), a promoter (Mogul / IFC Paris / WCBO) who wants the community, or a fitness brand wanting a novelty category. $1-4M.

## Buyer-readiness checklist (start now, cheap)

- Entity + IP clean: everything under Learn Through Stories; Lichess puzzle licence documented; art/asset licences listed
- Data room: 12 months of RevenueCat + Supabase cohorts, one page per month
- Key-person risk: the repo already has RULES.md/agent docs — keep them buyer-readable; a buyer must run this without Tyler
- Written gym/club agreements (even $0 "official app" MOUs) — these are the moat on paper
- Trademark check on "Chess Boxing by Chess Path" (chessboxing itself is generic; the mark is Rookie + Chess Path)
- Keep the web app and the iOS app one codebase (already true) — buyers pay a premium for iOS subscription apps

## Next 30 days

1. IAP + RevenueCat behind `CHESSBOXING_PRO` flag; trial 7 days; Stripe monthly → $5.99 to match
2. Buyer-metrics section in `daily-report.ts` (trial→paid, D30, churn)
3. Fold Patron into Pro
4. First Crew Pack pitch to Chessboxing NYC after App Store approval
5. Email WCBO + CBOI: "official training app" ask

## Sources (condensed)

Dr. Wolf App Store + Sensor Tower (~$100K/mo US on $5.99, 10M installs) · Chess.com pricing/revenue (Allebest: $100M 2024, ~$200M 2026, 10M DAU) · Play Magnus 2021 annual report (65K payers, ARPU $22, sold $82.9M) · Chessable/ChessKid/Chessly/Noctie/Chess Universe store pages · Lichess 2024 review (€650K donations) · FightCamp (FOS, Latka), Boxx, Litesport · Chess.com acquisition posts (ChessPark 2009, Komodo 2018, Dr. Wolf 2020, PMG 2022, chess24 closure 2024, NIC divestment 2024, CVC 2026) · Flippa 2025 valuation report, Acquire.com Jan 2026 multiples, RevenueCat "guide to selling apps" · WCBO, CBOI (Caravan), Chessboxing NYC, Mogul Chessboxing viewership (esports.gg).
