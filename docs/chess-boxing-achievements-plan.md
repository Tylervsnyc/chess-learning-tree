# Chess Boxing Achievements — Master Plan

*2026-08-09 · Status: PLAN (nothing built) · Inspiration: Dungeon Crawler Carl's achievement system — the joke IS the reward*

Chess Path achievements (lessons/levels side) are explicitly **out of scope** for now — this plan is Chess Boxing first. A short "how this extends to Chess Path later" note is at the bottom so we don't paint ourselves into a corner.

---

## 1. The Vision

Achievements in Dungeon Crawler Carl work because the system is a character: it's watching you, it has opinions, and it hands out awards for things you're not sure you should be proud of. We already have that character — **Rookie**. Every achievement is Rookie noticing something specific about your fighting career and being unreasonably invested in it.

**Tone rules (from the voice bible + `BOUT_LINES`):**
- Name + one-to-two-sentence description in Rookie's voice. Short, warm, over-invested, no emojis.
- Failure achievements are a first-class category. Wrong turns are funny, not punishing — getting KO'd in round one earns you a medal AND a roast.
- The description is the reward. Nothing is gated behind achievements — no points, no unlocks, no gameplay effect. Cosmetic only, same rule as Chess Path ELO (RULES §20).
- Never cruel about the *player*. Rookie roasts the situation, the opening's reputation, or herself.

---

## 2. Achievement Anatomy

Every achievement is defined in a code-side catalog (like the quip pool — copy lives in code, not the DB):

```ts
// lib/achievements/catalog.ts
type AchievementDef = {
  id: string                    // 'opening-caro-kann', 'bout-first-ko', stable forever
  category: 'bout' | 'opening' | 'puzzle' | 'training' | 'dedication' | 'shame'
  name: string                  // or per-tier names
  description: string           // Rookie's line; {tier}/{count} interpolation allowed
  icon: string                  // emoji or /public/achievements/*.webp (512px WebP rule)
  tiers?: TierDef[]             // absent = one-shot binary achievement
  secret?: boolean              // shows as "???" until unlocked (the shame category mostly)
  detector: DetectorKey         // which pure function evaluates it (see §5)
}
```

### Two kinds of tiers

**A. Opening achievements — tier = the Rookie level you beat with it (1–10).**
Beat Rookie playing the Caro-Kann at level 1 → Caro-Kann achievement at tier 1. Later beat her at level 8 with it → the same achievement upgrades to tier 8. One row per opening per user, `tier` = highest level ever beaten. Because "tier 7" means nothing to a new user, tiers display as **boxing belt bands** (this is Chess Boxing — belts are the native metaphor):

| Rookie level beaten | Belt band | Visual |
|---|---|---|
| 1–2 | **Amateur** | plain gray belt |
| 3–4 | **Contender** | bronze belt |
| 5–6 | **Title Shot** | silver belt |
| 7–8 | **Champion** | gold belt |
| 9–10 | **Undisputed** | gold belt + gem, animated shimmer |

The card shows both: the belt band big, "beat Level 8 — Serious" small. Upgrading within a band (L7→L8) still counts and re-fires a (small) celebration.

**B. Count achievements — tier = thresholds (I / II / III / IV).**
E.g. Puzzles solved 100 / 1,000 / 5,000 / 10,000. Standard ladder, same upgrade mechanics, belt bands map I=Amateur … IV=Undisputed so the whole system reads as one language.

---

## 3. The Catalog (v1 — ~40 achievements)

Copy below is draft Rookie voice — final pass against `.claude/rookie-voice-bible.md` before shipping.

### 🥊 Bout (the flagship category)

| Achievement | How | Rookie's line |
|---|---|---|
| **First Blood** | Win your first bout | "Your first win. I'm framing this. I already framed it." |
| **KO Artist** (tiers: 1/10/50/200 KOs) | Win by checkmate | "Checkmate is just a KO where the referee is math." |
| **Went the Distance** | Reach the final bell with every boxing round behind you | "Every round. Every bell. Somewhere a training montage is playing about you." |
| **Judges' Favorite** (tiers: 1/10/50 decision wins) | Win on the cards | "You didn't knock me out, you just quietly took all my pawns. Colder, honestly." |
| **Hometown Decision** | Win a decision with material dead even | "Dead even and they gave it to you. The crowd loves you. I demand an inquiry." |
| **The Meltdown Button** | Checkmate Rookie while she's up material (triggers her meltdown) | "I was WINNING. I want that recorded: I was winning, and this still happened." |
| **Buzzer Beater** | Deliver checkmate with under 10 seconds on your bank | "Eight seconds left and you found mate. I need to sit down. I am sitting down. I need to sit down more." |
| **And STILL Champion** | Win a ranked bout 5 days in a row | "Five Fight Nights, five wins. Defend the belt or I'm taking it back." |
| **Championship Rounds** | Finish a Championship-format bout (6 chess rounds) | "Thirty-three minutes of chess boxing. Your cardio is now a chess piece." |
| **Up the Ladder** (tiers = level bands) | Win a bout at Rookie level N | "Level {N}. I stopped going easy on you several levels ago. This is concerning." |

### 📖 Openings (tiered by level beaten — the Caro-Kann joke, systematized)

One achievement per opening in the registry (18 top-level openings + the Witty Alien family). Win a bout or a /play game with the opening on the board (you reached its book position) and tier = the Rookie level you beat. Sampler of the fun:

| Opening | Rookie's line |
|---|---|
| **Caro-Kann** | "You played the Caro-Kann and didn't lose. Nobody plays the Caro-Kann that well. I've checked." |
| **London System** | "The London. Congratulations on your new personality." |
| **Sicilian Defense** | "You played the Sicilian on purpose and lived. Most people just say they play the Sicilian." |
| **King's Gambit** | "You gave away a pawn on move two and called it a plan. The worst part is it worked." |
| **Scandinavian** | "Queen out by move two, like a person with nothing to lose. I respect it and I fear it." |
| **French Defense** | "You locked your own bishop in a closet and STILL won. That poor bishop believed in you." |
| **Ruy Lopez** | "They call it the Spanish Torture. You were the one doing the torturing. Noted." |
| **Italian Game** | "The Italian. Four hundred years of theory and you used it to bully me specifically." |
| **Queen's Gambit** | "You offered me a pawn and I've regretted everything since. That's the whole opening." |
| **King's Indian** | "You let me have the whole center and then took the whole board. That's a scam. A beautiful scam." |
| **Witty Alien** | "My opening. You beat me with MY opening. This is either flattery or treason and I haven't decided." |

(Every registry opening gets one — remaining lines written at build time, same formula: the opening's reputation is the joke.)

### 🧩 Puzzles (Puzzle Boxing + tactics)

| Achievement | How | Rookie's line |
|---|---|---|
| **Puzzle Grinder** (100/1k/5k/10k solved) | Lifetime `puzzle_attempts` + workout corrects | "Ten thousand puzzles. Your pattern recognition is now legally a superpower." |
| **Combo Meal** | Hit an 8-streak in one workout (the 2× multiplier) | "Eight in a row. The multiplier maxed out. The multiplier has never been more proud." |
| **Flawless** (tiers by duration: 8/16/24/32 min) | Perfect workout session, zero wrong | "A full flawless session. I checked the math twice because frankly I didn't believe the math." |
| **Fork Yeah** (50 fork-theme puzzles) | Theme counter | "Fifty forks. Knights everywhere are filing restraining orders." |
| **Pin Pal** (50 pin-theme puzzles) | Theme counter | "Fifty pins. That bishop isn't going anywhere. Nothing is going anywhere. You've seen to that." |
| **Skewer Season** (50 skewers) | Theme counter | "A skewer is just a pin where the important one runs first. You've made a lot of important pieces run." |
| **Mate Radar** (100 mate-in-N puzzles) | Theme counter | "You see checkmates the way other people see typos. Instantly, and slightly smug about it." |

### 🏋️ Training (workout-machine achievements)

| Achievement | How | Rookie's line |
|---|---|---|
| **Fired Up** | 80 punches in one exercise round (the multiplier trigger) | "Eighty punches, one round. Your next chess round is legally required to be 25% better. House rules." |
| **Thousand Fists** (1k/10k/100k lifetime punches) | `workout_sessions.punches` sum | "One hundred thousand punches. At some point this stopped being a chess app and I didn't stop you." |
| **New Belt Day** (tiers: 5/25/100 personal bests) | `isPersonalBest` at finish | "Another personal best. Your old best is in the locker room questioning its life choices." |
| **Round of Your Life** | best_round_points ≥ 500 in a single round | "Five hundred points in one round. I'd review the tape but honestly it would just embarrass the tape." |

### 🔥 Dedication (streak-derived — reads the same live streak, touches nothing)

| Achievement | How | Rookie's line |
|---|---|---|
| **The Regular** (3/7/30/100/365-day streak) | `getStreak().current` high-water | "A hundred days. I see you more than I see my own engine. I mean that warmly and also I'm worried about both of us." |
| **Comeback Kid** | Return and finish a unit after a 7+ day gap | "You came back. I kept the campfire going. I never doubted you. I doubted you a medium amount." |
| **Night Shift** | Finish a workout between midnight and 4 a.m. local | "It's the middle of the night and you chose chess boxing. Correct choice. Go to bed." |

### 💀 Shame (secret until earned — the Dungeon Crawler Carl specialty)

| Achievement | How | Rookie's line |
|---|---|---|
| **Glass Jaw** | Get checkmated in the first chess round of a bout | "KO'd in round one. In boxing they'd call that a puncher's chance. I had one. Sorry. Not that sorry." |
| **Flagged** | Lose a bout on time | "You had four whole minutes. You spent them like a lottery winner. The clock says hi." |
| **Three Strikes** | Strike out in the first chess segment of a workout | "Three strikes in the opening segment. The puzzles started a group chat about you. I'm in it." |
| **Gift Wrapped** | Hang your queen and lose that game | "You handed me your queen like it was my birthday. It was not my birthday. I took it anyway." |
| **The Full Carlsberg** | Lose 5 bouts in one day | "Five losses in one day and you kept getting back up. That's the most boxer thing I've ever seen. Medal. Now go drink water." |

Secret achievements render as "???" in the case until unlocked — discovering them is the content.

---

## 4. Data Model

Follows the `bout_sessions` security pattern exactly (SELECT-own RLS, **no client INSERT** — all writes via service role so nobody hand-mints an Undisputed belt).

```sql
-- supabase/migrations/2026-08-XX-achievements.sql
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,          -- catalog id, e.g. 'opening-caro-kann'
  tier integer NOT NULL DEFAULT 1,       -- opening: level beaten (1-10); count: ladder rung; binary: 1
  progress integer,                      -- current counter for count achievements (nullable)
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  upgraded_at timestamptz,               -- last tier bump
  seen boolean NOT NULL DEFAULT false,   -- has the unlock animation played yet
  UNIQUE (user_id, achievement_id)
);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);
-- no INSERT/UPDATE policies: service role only, same as bout_sessions
```

One row per achievement per user; tier upgrades UPDATE the row. `seen` lets the celebration fire on the *next* completion screen if the unlock happened server-side without a UI moment (e.g. backfill). All code degrades gracefully with `needsMigration` if the table isn't live yet — house style, since Tyler runs DDL by hand.

### Prerequisite migration: persist the opening

Opening detection exists (`lib/opening-classifier.ts` — pure, 3,600-entry ECO longest-prefix match) but is never saved. The bridge:

```sql
ALTER TABLE public.bout_sessions ADD COLUMN opening_eco text, ADD COLUMN opening_name text, ADD COLUMN opening_slug text;
ALTER TABLE public.game_sessions ADD COLUMN opening_eco text, ADD COLUMN opening_name text, ADD COLUMN opening_slug text;
```

- **Bouts:** the client already holds the full SAN history (`movesRef` / `reviewMovesRef` in `app/box/bout/page.tsx`). Add `moveSans: string[]` to the `/api/bout/finish` payload (cap ~200, like seenPuzzleIds) and classify **server-side** — never trust a client-claimed opening, same reasoning as the server-derived `level`. `opening_slug` comes from `detectOpeningBook` when the game matches one of our own 51 trees (that's what ties an achievement to a registry opening card); `opening_eco`/`name` from `classifyOpening` for everything else.
- **/play:** `GameSession.end()` (`lib/game-session.ts`) already has the move list in `session_moves` — classify at end and write the same three columns.

This column is independently valuable beyond achievements (Honcho already wants it, PostHog gets honest opening data, future "your repertoire" features).

---

## 5. Detection Engine

**One pure module, called from the finish routes — no new endpoints, no cron, no client-side detection.**

```
lib/achievements/engine.ts
  evaluate(event: AchievementEvent, ctx: UserSnapshot): Unlock[]   // pure, unit-testable
lib/achievements/detectors/*.ts                                    // one small fn per detector key
```

- `AchievementEvent` = a discriminated union: `bout_finished` (the full bout row + opening + level + outcome), `workout_finished` (session row + streaks + isPersonalBest), `play_game_finished`.
- `UserSnapshot` = the cheap aggregates the detectors need (existing achievement rows + a handful of COUNTs). Fetched in one round-trip inside the finish route; most counters live in `progress` on the achievement row itself so we increment rather than re-scan history.
- Call sites: `/api/bout/finish`, `/api/workout/finish`, and `GameSession.end()`'s server path. Each route appends `newAchievements: Unlock[]` to its existing JSON response — **the client learns about unlocks in the same response it already awaits**, so zero extra requests on the hot path.
- Idempotent by construction: the UNIQUE constraint + the same `client_session_id` idempotency the finish routes already have. A replayed finish returns `newAchievements: []`.
- **Backfill script** (`scripts/backfill-achievements.ts`): one-time scan of `bout_sessions`, `workout_sessions`, `puzzle_attempts`, streak history → grants everything already earned with `seen: false`. Day-one users open their profile and find a case already half full — that's the launch moment, not a cold empty grid.

**Puzzle themes:** `puzzle_attempts` has no theme column, but every workout/tactics puzzle id resolves to its theme via the per-level theme files (`lib/puzzle-file-loader.ts`) and `data/puzzle-rating-index.json`. Theme counters are computed at finish time from the session's solved ids (server-side lookup), then stored as increments in `progress` — no schema change to `puzzle_attempts` needed.

---

## 6. Where You See Them

### A. Web profile (`app/profile/page.tsx`) — **The Trophy Case**

New section between Lifetime Stats (`:574`) and the Beta Product block (`:577`), using the existing section pattern (uppercase h2 + `bg-chess-surface rounded-2xl` card):

- Grid of medal tiles (3–4 per row): icon + belt-band color ring + name. Locked = dimmed silhouette; secret = "???".
- Header shows `12 / 41` earned. Tap a medal → bottom sheet (the established ELO-card pattern): big icon, belt band, Rookie's line, tier progress ("Caro-Kann — Champion · beat Level 8 · next: Level 9"), date earned, Share button.
- Sort: newest unlocks first, then by band descending. Respect the gold/patron theming the page already does.

### B. Box profile (`app/box/profile/page.tsx`) — belt rack, sheet for detail

Binding constraint: **fits the window, never scrolls** (375×667). So:
- One compact row added near the Fight Record: the 3 most recent/highest medals as small belt icons + `12/41` count. `shrink-0`, one line tall.
- Tapping opens the full trophy case as a bottom sheet — the exact escape hatch the ELO card already uses on this page. The sheet reuses the same trophy-case component as the web profile.

### C. Unlock moments (where the animation fires)

- **Bout result screen** (`app/box/bout/page.tsx`): after the existing result card content, driven by `newAchievements` from `/api/bout/finish`.
- **Workout results popup** (`app/workout/page.tsx`): after `StreakComplete` in the same card, from `/api/workout/finish`.
- **ActivityComplete** (`/play`, openings): extend the phase machine `'await' | 'celebrate' | 'main'` → insert an `'achievements'` phase **between** `celebrate` and `main`. This is safe re: the one-streak-trigger rule (CHE-388): the streak claim is a one-shot atomic POST that has already resolved before our phase runs — we add a step to the existing owner, we do NOT add a second trigger, watcher, or popup owner. Sequence stays: streak window → achievement moment(s) → main card.
- Multiple unlocks in one session queue and play sequentially, biggest first, max ~3 with a "+2 more in your trophy case" collapse — never trap someone in a celebration chain (momentum over perfection).

---

## 7. Tiered Unlock Animations

Three sizes, mapped from belt band + rarity. All built from machinery we already own — no new libraries.

| Size | When | What happens |
|---|---|---|
| **S — "the nod"** | Common one-shots, count-tier I, shame achievements | Inline card slides up in the result screen: icon pops (spring scale), belt ring draws itself, `playWoodClap()`, one small `fireConfetti()` puff. ~1.5s, non-blocking, auto-settles into the card. Shame achievements get the error-sound sting instead of the clap — the roast IS the celebration. |
| **M — "new belt"** | Contender/Title Shot bands, count tiers II–III | Takes over the result card briefly: dark spotlight backdrop, belt asset swings in with the `LevelUpCelebration` gold spark burst, `playBoxingBell()` ×1, medium confetti burst, Rookie's line types in. Dismiss to continue. ~3s. |
| **L — "title fight"** | Champion/Undisputed (opening beaten at L7+), tier IV counts, Meltdown Button | Full-screen ceremony modeled on `FirstRatingReveal` (the proven big-moment pattern): 550ms of dark, boxing bell ×3, belt descends with punch-scale animation, gold confetti palette (`#FFD43B/#FFAA00/#1CB0F6/#FFFFFF`), achievement name in the Fight Night type treatment, Rookie's line, then a Share button (see §8). Undisputed adds the shimmer loop on the belt. ~5s, skippable by tap (always). |

Implementation: one `AchievementUnlock` component with `size: 's'|'m'|'l'`, lazy-loaded (confetti already is; keep the belt art as 512px WebP per the asset rule). Sounds via existing `lib/sounds.ts` exports only. Respect `prefers-reduced-motion`: reduce to a fade + the sound.

---

## 8. Growth Tie-in (why this serves the mandate)

Achievements are a retention surface (reasons to come back: "one more level on my Caro-Kann belt") **and** a share surface:

- **Share card:** `/api/og/achievement?id=&tier=&username=` — Fight Night visual language, belt + name + Rookie's line. Wire into the L-size ceremony and the trophy-case sheet. Rookie's roast lines are inherently screenshot-able; the shame category especially ("Glass Jaw" is exactly the kind of thing people post).
- **PostHog:** `AchievementEvents.unlocked(id, tier, size)`, `.shared(id)`, `.caseOpened(count)` — so the daily report can say whether anyone actually looks at the trophy case before we invest in more art.
- **IG content:** each shame achievement is a ready-made Reel concept ("Can you earn Glass Jaw?").

Everything behind `FEATURE_FLAGS.ACHIEVEMENTS` (house-style doc comment), default `false` until the catalog copy passes a voice-bible review.

---

## 8b. Status (2026-08-24 — the gym-Saturday rework)

**Live:** 64 → 88 medals. Five first-timers at a real gym earned one medal total, so the catalog was reworked for a Clash-of-Clans finish: a first workout now EARNS 5-7 cheap medals (only 2 play per finish — see below) (Day One, First Punch, Twenty-Five, First Solve, Swing and a Miss, Combo Meal I, On the Board, New Belt Day I, Showed Up), a first bout 3-5 (Ring Time I, Heard the Bell, First Blood or Learning Tax, Ring Fists I, Showed Up).

- **Ladders start low.** Every count medal now begins at a rung reachable in one session and climbs to the old lifetime numbers (Puzzle Grinder 10→5000, Thousand Fists 50→25000, Punch Clock 3→1000, Gym Minutes 15→5000, KO Artist 1→500…). Same `thresholds` + belt-tier mechanism; `engine.ts` gained `best()` (a high-water feeder for combo / best round / streak) beside `count()`.
- **Unseen backlog replays.** `processAchievementEvent` returns fresh unlocks + any `seen=false` rows; **the overlay plays at most 2 per finish** (Tyler's cap, 2026-08-24) with a "1 of 2" counter and marks only played ones seen; the rest drip out 2 per session. Nothing is missed forever, and a big first session becomes several reasons to come back.
- **Next-medal teaser.** `nextMedalTeaser()` picks the in-progress ladder closest to its next rung; `FightResultCard` shows "Next medal: Thousand Fists 412/1000" on both kinds.
- **New facts:** `wrong` on the workout event; `localWeekday`, `boutsToday` (both events) in the context. No schema changes.
- Review every line at `/test/achievements` (full catalog, tap to play).

## 9. Build Phases

**Phase 1 — Foundation + Bout/Training/Dedication/Shame (no new game data needed).**
Migration (`user_achievements`), catalog + engine + detectors for everything derivable from existing tables (bouts, workouts, streak, personal bests), trophy case on both profiles, S + M animations, backfill script, flag. *This ships ~30 achievements including all the shame ones.*

**Phase 2 — Openings (the Caro-Kann milestone).**
Opening-persistence migration + `moveSans` in the bout finish payload + server-side classification on both finish paths, the 18+ opening achievements with belt tiers, the L "title fight" ceremony, belt art (WebP). *This is the headline feature Tyler asked for.*

**Phase 3 — Puzzle themes + share.**
Theme counters via the puzzle-index lookup, the theme achievements (Fork Yeah et al.), `/api/og/achievement` share card, PostHog funnel in the daily report.

**Later — Chess Path achievements.** Same engine, same table, same trophy case — just new detectors (`lesson_progress`, level tests, opening lessons) and a `'path'` category, surfaced on the web profile. The architecture above requires zero rework to add it; it's purely catalog + detectors. Planned separately when Tyler's ready.

## 10. Risks & Guardrails

- **Streak rule (CHE-388):** we extend `ActivityComplete`'s phase machine; we never add a watcher/second popup owner. Code-review checklist item.
- **Box profile no-scroll:** one `shrink-0` row max; everything else in the sheet. Verify on 375×667 + `/test/responsive`.
- **Server-authoritative:** level, opening, and all unlock writes are server-derived (the bout route already re-derives level for exactly this reason). Client never names its own achievement.
- **RULES.md updates on ship:** new §23 table entry, §22 flag row, and a new §52 Achievements behavior section.
- **Copy bar:** every line through the voice bible (≤2 sentences, no emojis, roast the situation not the player) before the flag flips.
