# Chess Boxing — App Store listing copy

Draft 2026-08-14. Paste into App Store Connect → iOS 1.0 → App Information / Version.

**Accuracy note:** every claim below maps to something that actually ships today.

Camera, corrected 2026-08-14: the app DOES use the camera. `WORKOUT_PUNCH_CAM`
(the old MediaPipe punch counter) is off, but **Quadrant Fight** — a live opt-in
camera game in the workout's exercise segments and the bout's boxing rounds — is
gated only by localStorage, not by a flag. `NSCameraUsageDescription` must stay in
Info.plist, the App Privacy form must declare camera use, and review notes must not
claim the app is camera-free.

---

## Name (30 char max)

```
Chess Boxing by Chess Path
```
26 characters.

## Subtitle (30 char max)

Pick one — first is my recommendation:

```
Fight rounds. Chess rounds.
```
27 characters. Explains the sport in four words, reads like a poster.

Alternates:
- `Train chess while exhausted` (27)
- `Speed chess between rounds` (26)
- `The chess boxing trainer` (24)

## Promotional text (170 char max, editable without review)

LIVE in ASC (2026-08-18):
```
The only app that trains your chess while you work out. Speed chess rounds, boxing rounds, and puzzle rounds. Compete against your friends and the world.
```
152 characters.

## Description

```
Chess boxing is a real sport: eleven alternating rounds of speed chess and boxing.
You play a round. You fight a round. You sit back down at the board with your heart
rate at 170 and try to calculate.

That last part is the whole sport, and it is almost impossible to practice. Playing
chess is easy. Playing chess gassed is a different game entirely.

Chess Boxing is a trainer for it.

PUZZLE BOXING (RANKED)
The scored mode. Tactics puzzles in the chess rounds, conditioning in the boxing
rounds, all on one bout clock. Every puzzle you solve while gassed earns points, and
points are how you climb the daily, weekly, and monthly leaderboards. This is where
you compete against your friends and the world.

BOUT MODE
One game against Rookie, split across the chess rounds of a real bout. The board
freezes when the bell rings, you work through the boxing round, then you come back
to the exact same position — only now you're breathing hard. Win by checkmate, by
flagging your opponent, or on points at the final bell.

QUADRANT FIGHT (BETA, OPTIONAL)
Point your phone at yourself and the boxing round becomes a game: the screen splits
into four quadrants, one lights up, and you punch it before it fills — or slip your
head out of the way when it goes red. Runs entirely on your phone. The video is never
recorded, uploaded, or seen by anyone. Off unless you turn it on.

LEADERBOARDS
Global rankings, reset daily, weekly, and monthly, fed by your Puzzle Boxing points.
Or start a crew with a join code and keep the fight inside your gym.

TRAIN
Daily puzzles and tactics lessons from Chess Path, for the days you're not fighting.
Keeps your streak alive.

PLAY
Straight speed chess against Rookie, who is enormously invested in your chess and
takes losing extremely badly.

Built for people who actually do this sport, and for people who want to find out
what their chess looks like when they're tired. Free.
```

## Keywords (100 char max, comma-separated, NO spaces after commas)

```
chessboxing,boxing,chess,hiit,interval,workout,tactics,puzzle,blitz,speed chess,training,rounds
```
95 characters. "Chess Boxing" is already in the app name, so the keyword field spends
its budget on terms the name doesn't cover.

## Support URL

```
https://chesspath.app
```
NOTE: Apple wants a page with actual support contact info. If chesspath.app has no
visible contact route, make a simple /support page before submitting — this is a
common, avoidable rejection.

## Marketing URL (optional)

```
https://chesspath.app
```

## Privacy Policy URL

```
https://chesspath.app/privacy
```
Already exists (`app/privacy/page.tsx`).

---

## App Review notes (paste into the review notes field)

```
Chess Boxing is a trainer for the sport of chess boxing (alternating rounds of speed
chess and boxing).

The core experience is Bout Mode: a single real-time game against an on-device chess
engine, split across the chess rounds of a timed bout, with the board freezing and
resuming across conditioning rounds. This is not a repackaged website — it is a
timed, stateful, real-time game experience.

Camera use: one optional feature, "Quadrant Fight," uses the front camera to track
punches and dodges during boxing rounds. It is off by default and the user must turn
it on explicitly. All video is processed on-device via MediaPipe pose detection and
is never uploaded, recorded, or transmitted. The rest of the app works fully without
granting camera access.

Demo account:
  email: appreview@chesspath.app
  password: ChessBoxing-Review-2026!

To see the core experience: sign in, tap "PLAY BOXING" on the home screen, choose
the "Sparring" format (11 minutes, the shortest), and tap Fight. You will be placed
in a live game against the engine with your own countdown clock running. The board
freezes when the round bell sounds and resumes, in the same position, after the
boxing round.
```

---

## Screenshots

Built by `scripts/build-appstore-screenshots.ts` → `out/appstore/`, all 1320x2868
(Apple's required 6.9" iPhone slot). Raw device grabs are 1179x2556, composited onto
a branded canvas rather than upscaled — which also crops off the phone status bar
(one grab had a screen-recording dot, another a low battery icon).

Upload in this order. Order is deliberate: the bout comes second because Guideline
4.2 is the main rejection risk, and a reviewer skimming images needs to see a
real-time game with running clocks before anything else.

1. `01-home.png` — Fight rounds. Chess rounds.
2. `02-bout-live.png` — live bout, dual clocks, "Chess 1 of 3", bell timer
3. `03-bout-setup.png` — round card, three formats
4. `04-puzzles.png` — tactics round on the bout clock
5. `05-quadrant.png` — Quadrant Fight camera game

## Still needs Tyler (in the App Store Connect browser UI)

- [ ] App Privacy questionnaire — you collect email + account data, no tracking
- [ ] Age rating questionnaire
- [ ] Demo account credentials for review notes — the account EXISTS (appreview@chesspath.app, email/password, confirmed, created by `scripts/create-demo-account.ts`; re-run it to reset the password). Just paste the credentials above into the review notes.
- [ ] Upload screenshots
- [ ] Hit Submit
