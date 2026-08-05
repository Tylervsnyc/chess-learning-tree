# Chess Boxing App — Structure (agreed with Tyler, 2026-07-31)

Visual chart: https://claude.ai/code/artifact/65f22bbf-96e7-4a1e-8b56-98dd6d61cf05

The iOS app (Capacitor shell). Web app parked for now. Printable sheets excluded.

## Tabs

| Tab | What it is | Built from |
|---|---|---|
| **Chess Box** (home) | The fight. Today screen (streak, last score, rank, big Start) → pick **Puzzle Workout** or **Bout vs Rookie** → finish screen (score, punches, streak claim, ELO, share) → round review. Leaderboard lives here as the payoff (Day/Week/Month × Crew/Global, join crew by code, share rank card). | `/workout`, `/leaderboard`, workout review |
| **Train** | Daily puzzles + Chess Path tactics lessons. Rest-day activity — counts toward the streak. | `/solve` + tactics slice of the path |
| **Play** | Straight speed chess vs Rookie, no gloves. Same engine powers the bout. | `/play` |
| **Profile** | Streak, ELO, punch totals, bout record, history, settings (username, crew, camera, leaderboard opt-in). | `/profile` |

Plus first-launch **onboarding**: what chess boxing is → pick username → camera permission (punch counter).

## Bout mode — the flagship new build

"That's what chess boxing really is." ONE game vs Rookie split across chess rounds; the board freezes during boxing rounds; you resume the same position gassed.

**Clock design (decided):**
- **One real clock — the user's.** A ~9:00 bank carried across all chess rounds. Flagging = real loss.
- **Rookie's clock is pacing, not stakes.** She thinks 2–4s/move (micro-recovery for the user); her clock ticks for flavor; she cannot flag (a bot flag would be scripted).
- **The bell always wins.** Round timer hits zero → board freezes → gloves on. Final bell with no mate → points decision.
- **Three ways to lose:** checkmated, flagged, outscored on the cards.
- Rookie reacts to the USER's clock — leans in under 30s; sore-loser meltdown when mated in a bout she was winning on points.
- Later, if the gym crew wants it: "Pro Bout" mode with a true two-clock setup.

## HARD RULE — No scrolling (Tyler, 2026-08-05)

Every native app screen is designed to FIT the app window — no vertical scrolling,
ever. If content doesn't fit, redesign it (compact it, split it into steps, put it
behind a tap) — never let it scroll. Fit target: iPhone SE viewport (375×667 minus
safe areas and the tab bar) up through Pro Max.

Applies to all app-owned screens: /box (locker home), /box/bout (every phase),
/box/onboarding, /box/settings. Enforced 2026-08-05: each screen is a fixed
`h-full` column (no overflow-auto); the locker / bout board / punch cam scale to
leftover height via container queries, and /box/settings became a compact row
list where Handle and Crew open sub-panels instead of expanding in place. The Train/Play/Profile tabs currently reuse shared
website pages and are exempt UNTIL they get their app-mode compact redesign (open
project — the rule is the end state for every tab).

## Build list (what's actually new)

Most of the map exists already (workout engine, punch counter, leaderboards + crews, share card, review, puzzles, tactics, play-vs-Rookie). New work:

1. Tab-bar shell + Today pre-screen (workout currently drops straight into the session)
2. **Bout mode** — weld /play engine + workout timer: pause/resume one game, bout time bank, bout scoring
3. Onboarding flow
4. Settings screen

Suggested order: shell + Today first (everything hangs off them), then Bout.
