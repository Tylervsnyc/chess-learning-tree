# Deep Audit To-Do List

Generated 2026-02-06 from a 5-agent code audit (Architect, Frontend, Chess, Sync, Backend).

---

## NEXT TIME: Start here

1. **Commit the changes** — everything is local, nothing pushed. Suggest 2 commits:
   - Commit 1: Dead code cleanup (no behavior changes, safe)
   - Commit 2: Bug fixes + security fixes (behavior changes)
2. **Push and deploy**
3. **Test in production** — especially: lesson completion (does currentPosition persist?), level test (alternate checkmates accepted?), lesson replay (daily count shouldn't inflate)
4. Then continue with Phase 4 (shared puzzle refactor) or pick off remaining Phase 3/5/6 items

---

## Phase 1: Dead Code Cleanup (Zero Risk) - DONE

- [x] Delete `lib/chess-utils.ts` (only used by archived code)
- [x] Delete `lib/puzzles.ts` (zero imports)
- [x] Delete `lib/curriculum-utils.ts` (pure re-export, zero consumers)
- [x] Delete `lib/skill-stack-validator.ts` (zero imports, 569 lines)
- [x] Delete `types/subscription.ts` (dead, conflicts with `lib/subscription.ts`)
- [x] Delete `data/lichess-puzzles.ts`, `data/puzzle-responses.ts`, `data/theme-hierarchy.ts`
- [x] Delete `data/staging/level1-ends-only.ts` (zero imports)
- [x] Delete 14+ dead components (Header, MobileContainer, PuzzleComplete, PuzzleFeedback, StreakCelebrationPopup, JourneyPath, ProgressRing, ThemeItem, NextLevelCard, DailyPuzzleCounter, UpgradeModal, UnlockTestModal, StreakCelebrations, ChessTacticsTree, PuzzleBoard, CurriculumTree, LessonNode)
- [x] Remove `dedupePuzzleAttempts` from `lib/progress-sync.ts`
- [x] Remove unused exports from `lib/sounds.ts`: `playMellowCoin`, `isAudioReady`, `getStreakStyle`
- [x] Delete dead API routes: `api/reviews`, `api/analyze-themes`, `api/puzzles/by-theme`, `api/fetch-rating`, `api/stripe/subscription`, `api/_analyze-difficulty-disabled`
- [x] Remove `html2canvas` and all `d3` packages + `@types/d3-*` from `package.json`
- [x] Remove `lib/chain-analyzer.ts` and `lib/theme-analyzer.ts` (2,170 lines)
- [x] Delete 4 broken test pages: `test-theme-sankey`, `test-theme-map`, `test-progress-bar`, `test-daily-report`
- [x] Exclude `scripts/` from tsconfig (utility scripts, not app code)
- [ ] Consider moving remaining 22 `test-*` pages out of production (or add middleware to block in prod)

## Phase 2: Critical Bug Fixes (Small, Targeted) - DONE

- [x] **Fix `setCurrentPosition` server sync** — Created new `position` type handler in API. No longer sends `lessonId: ''`.
- [x] **Fix `/api/progress/sync` to include `currentPosition`** — Added to interface, query, merge logic, update, and response.
- [x] **Add alternate checkmate acceptance to level test** — Added checkmate check in `tryMove` for mate-themed puzzles.
- [x] **Fix `isCorrectMove` promotion comparison** — Now only accepts auto-queen (promotion='q'), not arbitrary promotions.
- [x] **Add `updateStreak` flag check to server lesson handler** — Server now skips daily count/streak updates when `updateStreak: false`.
- [x] **Fix `solvedPuzzleCount` not reset on level test retry** — Added `setSolvedPuzzleCount(0)` to retry handler.
- [x] **Fix level test retry animation** — Uses 3-step animation pattern (originalFen → wait → puzzleFen) on retry.

## Phase 3: Security Fixes (Mostly Additive) - MOSTLY DONE

- [ ] **Add auth to unsubscribe endpoint** — `api/email/unsubscribe/route.ts` accepts arbitrary userId. Add HMAC-signed token verification.
- [x] **Sanitize path params in puzzle routes** — Added regex sanitization to `api/puzzles/route.ts` and `api/theme-puzzles/route.ts`.
- [x] **Fix `listUsers()` full scan** — Both routes now query profiles table by email instead of loading all users.
- [ ] **Add auth to Stripe session route** — `api/stripe/session/route.ts` exposes customer data to anyone with a session ID.
- [x] **Validate `subscriptionStatus` values in admin route** — Whitelist validation added.
- [ ] **Fix promo code race condition** — `api/promo/redeem/route.ts:55-152`. Use DB-level atomic increment instead of read-then-write.
- [x] **Add runtime check for `STRIPE_WEBHOOK_SECRET`** — Removed `!` assertion, added guard before use.
- [x] **Standardize `CRON_SECRET` checking** — Both cron routes now return false when `CRON_SECRET` is undefined.

## Phase 4: Shared Puzzle Logic Refactor (Biggest Change)

- [ ] **Export `normalizeMove` from `lib/puzzle-utils.ts`** — Currently reimplemented inline in 6 files. Create one canonical version and import everywhere.
- [ ] **Consolidate `processPuzzle`/`transformPuzzle`** — Daily challenge and lesson page have their own versions. Unify into `lib/puzzle-utils.ts`.
- [ ] **Standardize move validation** — Lesson page uses SAN comparison, level test uses UCI via `isCorrectMove()`. Pick one strategy.
- [ ] **Extract `useAudioWarmup` hook** — Same useEffect (click/touchstart → warmupAudio) copy-pasted in 4 files.
- [ ] **Extract shared board interaction logic** — `onSquareClick`, `squareStyles` calculation duplicated in 4 files.
- [ ] **Centralize board square colors** — `#779952` / `#edeed1` hardcoded in every board file. Put in one constant.
- [ ] **Consolidate `getRatingBracket` / `getRatingDir`** — Duplicated in 4 API route files.
- [ ] **Consolidate `processPuzzle` in API routes** — Same function in `challenge-puzzle`, `onboarding-puzzles`, `lesson-puzzles`, `theme-puzzles` routes.

## Phase 5: Frontend Quality (Gradual) - PARTIALLY DONE

- [x] **Fix `h-screen` → `h-full`** in `LevelUnlockTest.tsx` (4 places)
- [ ] **Add `aria-label` to close buttons** in `LevelUnlockTest.tsx`
- [ ] **Add `aria-hidden="true"` to decorative emojis** (fire emoji in NavHeader, lock emoji in tree)
- [ ] **Add focus trap to modals** (share preview, lesson button popup)
- [ ] **Fix `window.location.href` navigation** — `LessonCompleteScreen.tsx:158`, `NavHeader.tsx:17`. Use Next.js router for client-side nav.
- [ ] **Move `dummyLeaderboard` to module-level constant** — `daily-challenge/page.tsx:864-875`
- [x] **Fix `mergeProgress` comment** — Fixed to say "local wins" instead of "server wins"
- [ ] **Eventually break up** `daily-challenge/page.tsx` (1563 lines) and `lesson/[lessonId]/page.tsx` (1147 lines)

## Phase 6: Data/Sync Cleanup (When Touching Sync)

- [ ] **Resolve two competing permission systems** — `usePermissions.ts` vs `useSubscription.ts`. Pick one, delete the other.
- [ ] **Sync feature flags with RULES.md** — RULES.md documents 7 flags, code has 1 different one.
- [ ] **Add server-side validation to `unlockLevel`** — `api/progress/route.ts:248-275` trusts client. Verify level test was passed.
- [ ] **Fix tab sync `currentPosition` overwrite** — `useProgress.ts:327-339` spreads other tab's position, breaking "local wins" rule.
- [ ] **Add pruning for `puzzleAttempts` in localStorage** — Array grows unbounded.
- [ ] **Stop polluting `puzzle_attempts` with daily challenge records** — `useProgress.ts:713-743` syncs with fake `puzzleId: 'daily-challenge'`.
- [ ] **Consolidate `Puzzle` interface** — Defined in 3 places with different shapes: `types/curriculum.ts`, `lib/puzzle-selector.ts`, `lib/puzzles.ts` (puzzles.ts now deleted).
- [ ] **Write `score` field to `lesson_progress`** — Schema has it, API never writes it.

---

## Progress Summary

| Category | Done | Remaining |
|----------|------|-----------|
| Dead code cleanup | 16 | 1 |
| Critical bugs | 7 | 0 |
| Security fixes | 5 | 3 |
| Shared logic refactor | 0 | 8 |
| Frontend quality | 2 | 6 |
| Data/sync cleanup | 0 | 8 |
| **Total** | **30** | **26** |
