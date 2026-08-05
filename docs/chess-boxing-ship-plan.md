# Chess Boxing — Ship Plan (2026-08-04)

Where things stand: the full app shell from `chess-boxing-app-structure.md` is BUILT and
committed on `chess-boxing-preview` (12a0f50) — tabs, Today, Bout v1, onboarding, settings.
Nothing is on prod yet. This is the ordered path from here.

## Phase 1 — Get it on prod (the app loads chesspath.app live)

1. **Merge `main` into `chess-boxing-preview`.** Main has 2 commits we need
   (punch-counter double-count fix #21, IG cron weekday picker). Resolve, `npm run validate`.
2. **Test the merged branch locally** — full loop at `/box?boxapp=1`:
   onboarding → Today → workout (punch cam) → bout → settings.
3. **Merge to `main` + push** → auto-deploys to chesspath.app in seconds.
   Everything is invisible to web visitors (native/`?boxapp=1` gated), so this is safe.
4. **Open the app on chesspath.app prod with `?boxapp=1`** on your phone browser — real-device
   smoke test without waiting on TestFlight.

## Phase 2 — Point the iOS app at the new home

5. **Web-side redirect, not a native rebuild:** natives currently land on `/`. Add a tiny
   check (same `Capacitor.isNativePlatform()` pattern) that redirects native visitors
   from `/` to `/box`. Ships with a git push — no App Store review needed.
6. **TestFlight on-device pass:** first-launch onboarding (camera prompt is the real native
   one), tab bar safe-area on the home-indicator, bout end-to-end with real punches.
7. **Commit the uncommitted iOS work** — `project.pbxproj`, `Info.plist`, new app icon,
   the new Fastlane lanes (`ios/App/fastlane/Fastfile` +104 lines). These are the
   TestFlight-upload changes from 2026-08-01 and should be preserved.

## Phase 3 — App Store

8. Metadata + screenshots (the /box screens ARE the screenshots) → submit for review.
   The workout + punch camera + bout are the native-grade functionality that clears
   Apple Guideline 4.2.
9. NYC/Gleason's crew test cohort once approved (crew code flow already works via settings).

## Phase 4 — Bout v2 (after real-device feedback)

- Persist bouts to DB + bout record on Profile tab
- Bout counts toward the streak + leaderboards (deliberately cut from v1)
- Share card for bout results (reuse the OG share-card system)
- Wire `cp:punch-camera` setting into workout session setup (settings writes it;
  workout doesn't read it yet)
- Dev-speed rounds via query param for faster testing
- Later: "Pro Bout" true two-clock mode if the gym crew wants it

## The other 77 uncommitted files — commit in these batches

| Batch | Files | Action |
|---|---|---|
| **Classics pipeline** | `.claude/commands/chess-path-classics.md`, content ledger, `classics-scripts-4-10.md`, `audit-classics-fens.ts`, `bake-saavedra-alignment.ts`, remotion Root/BoardSlot, `render-daily-video.ts`, all `generate-*-voice.ts` + `post-classics-*.ts` + `verify-*.ts` | Commit as one "Classics eps 4-12 pipeline" batch — it's the working production tooling |
| **IG ops** | OSOT consolidation (2026-08-05): new `lib/ig-captions.ts` + `lib/ig-reels.ts`, `lib/ig-difficult-days.ts` owns the ET clock, new `scripts/ig-reconcile.ts` + `ig-token-check.ts`; deleted `ig-upload-queue.ts`, `ig-post-daily.ts`, `ig-push-difficult.ts`, `ig-test-post.ts`, `render-daily-video-from-id.ts`; plus `ig-insights.ts`, `ig-recaption-queue.ts` | Commit together with the RULES.md §44 rewrite — the doc describes the script swap, they must land as one |
| **Rookie's Run playtest** | `app/run/page.tsx`, `run-playtest/bots/mcts.ts`, `sweep.ts`, `_smoke-thex.ts`, `app/api/dev/run-live` | Verify `/api/dev/run-live` is dev-gated before committing (it's a live stream endpoint) |
| **Social one-offs** | knicks/linkedin/fable-day/opening-ig/hat-designs test pages, capture + post scripts, `public/social/*`, `types/email.ts`, `KnicksTakeover.tsx`, substack md | Commit as an archive batch; the 4 loose PNGs at repo root (fable-launch-day, rookie-meet-card, etc.) should move into `public/social/` or be deleted first |
| **Chessboxing extras** | test pages (chessboxing-home/icon/loader/locker-live), locker/chase/home-concept generator scripts, `public/test-assets/` | Commit — design exploration behind the shell work |
| **SQL** | `scripts/sql/2026-07-31-best-round-points.sql` | Confirm it was already run on the live DB (Tyler runs DDL manually), then commit as the record |
| **Growth notes** | `data/growth/uglybaby-onboarding-test.md`, `paid-session-quality.ts`, `streak-count.ts` | Commit with whichever batch they belong to; quick skim first |

Rule of thumb: nothing here blocks Phase 1-2 — the chess-boxing commits are already clean
and self-contained. Batch-commit the rest as housekeeping between phases.
