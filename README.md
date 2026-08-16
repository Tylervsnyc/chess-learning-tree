# Rookie's Run

A daily chess roguelike. Rookie spawns on rank 1 and has to reach rank 8 — no
checkmate, just cross the board. Enemies move 1–3 times per turn. Capturing
fills a tempo bar; a full bar rolls an ability offer you keep for the rest of
the run. A run is 10 levels with an escalating arc, and the date deterministically
picks the run and Rookie's starting file, so everyone plays the same board.

Web app at **run.chesspath.app**, plus an iOS shell that ships to TestFlight.

Extracted from [chess-learning-tree](https://github.com/Tylervsnyc/chess-learning-tree)
(The Chess Path), where it lived at `/run`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm install` is also a prerequisite for any iOS work — see [docs/ios.md](docs/ios.md).

### Environment

Create `.env.local` (gitignored). Everything is optional — the game is fully
playable with none of it set.

```
NEXT_PUBLIC_POSTHOG_KEY=       # analytics (12 run_* events)
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_SUPABASE_URL=      # shared with The Chess Path
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-only: playtest trace capture
```

## Routes

| Route | What |
|---|---|
| `/` | The game |
| `/[date]` | Date-locked deep link into a past run (`/2026-08-16`) |
| `/stc` | Story Time Chess co-branded basics mini-runs |
| `/api/run/complete`, `/api/run/streak` | Daily completion + derived streak (Supabase) |
| `/api/run-trace` | Human playtest trace capture |
| `/api/og` | OG image |
| `/admin/replay/...` | Playtest replay viewer |

## Layout

```
app/               routes
components/run/    the game UI (Board, AbilityCard, modals, logos)
lib/run/           engine, abilities, enemy AI, scoring, level data
scripts/run-playtest/   simulation harness + bots
data/run-playtest/      sim corpus, digests, curated replays
.claude/           level-design agents, strategy bible, nightly routine
ios/               Capacitor iOS shell (see docs/ios.md)
```

`lib/run/` has no imports outside itself — the engine is a closed system, which
is what made the extraction clean.

## Gameplay rules

`.claude/run-strategy-bible.md` (why positions are good or bad) and
`.claude/run-level-design.md` (how to author a 10-level run). Chess Path's
RULES.md §49 is the historical engine contract.

## Playtesting

```bash
npm run playtest              # nightly sim + digest
npm run playtest:sweep        # parameter sweep
npx tsx scripts/run-playtest/pull-traces.ts    # deployed traces -> disk
```

Traces from the deployed app land in Supabase (`run_traces`), because the
filesystem is read-only on Vercel — Chess Path wrote them to disk and silently
lost every trace from a phone. Apply
`supabase/migrations/2026-08-16-run-traces.sql` by hand in the Supabase SQL
editor to turn capture on; until then the route is a logged no-op and the game
is unaffected.

## Deploy

Vercel, auto-deploying from `main` to `run.chesspath.app`. Set env vars in the
dashboard or via the REST API — **not** `vercel env add`, which stores empty
values silently in the CLI version this project uses.

The iOS app is a WKWebView on the live site, so **a web deploy ships to iOS
too**. Native rebuilds are only for icon, splash, `Info.plist` and plugins.

## Known debt

- `scripts/run-playtest/` is excluded from `tsc --noEmit`. It carries ~30
  pre-existing type errors inherited from Chess Path, where `scripts` was
  excluded too so they were never visible. The scripts run fine (`tsx` strips
  types without checking). Worth a cleanup pass, out of scope for the extraction.
- No E2E coverage. A Playwright smoke test over `/`, `/[date]`, `/stc` and the
  ability art `<img>` elements would be cheap insurance — the art assertion in
  particular guards the `.webp`/`.png` trap that caused CHE-377.
- `public/stc/logo.png` is 3.5 MB, the largest asset in the repo by far.
  Converting to webp would take it under ~200 KB.
- `components/run/StreakChip.tsx` and `VaultList.tsx` are still unmounted, as
  they were in Chess Path. The streak players actually see is computed locally
  in `lib/run/history.ts` and rendered by `RunSummaryModal`.
