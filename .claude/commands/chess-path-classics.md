# /chess-path-classics — produce an episode of Chess Path Classics

Chess Path Classics is the branded teaching series: Rookie explains one famous
chess position/study/game per episode as a vertical reel (1080x1920). Episode 1
(the Saavedra position) shipped 2026-07-17 — every file it produced is the
reference implementation for the next episode.

**The brand promise: a reliable learning tool.** Measured language, verified
chess, one star idea per episode given real narration time. This is NOT the
meme/POV register — that's a separate cut if Tyler asks for one.

---

## Pipeline at a glance

1. Pick + verify the chess → 2. Write the segmented script → 3. Generate voice
→ 4. Bake word alignment → 5. Build the composition → 6. Render + frame-check
→ 7. Tyler reviews → 8. Post.

Reference files (episode 1):
| Step | File |
|------|------|
| Voice script + TTS | `scripts/generate-saavedra-teach-voice.ts` |
| Word alignment bake | `scripts/bake-saavedra-alignment.ts` |
| Composition | `remotion/SaavedraReel.tsx` (`buildReel` factory + `SaavedraTeachReel`) |
| Registration | `remotion/Root.tsx` |
| IG post | `scripts/post-classics-saavedra.ts` |
| Published video | `public/social/classics-saavedra.mp4` |

---

## 1. Pick + verify the chess

Good episodes: famous studies (Saavedra, Réti, Lucena, Philidor), famous games
(Opera Game, Immortal Game), famous ideas (windmill, smothered mate). The hook
is always a surprising truth ("White is down a full rook — and wins").

**Source material: `data/growth/pietro-reel-scripts.md`** — 6 full transcripts
of @pietrocheckmate's biggest position explainers (496K–2.2M views) with
structure notes. Adapt STRUCTURE, never lines. The devices that earn the views:
- **The short formula wins biggest** (his 2.2M reel is 238 words): one "has
  White blundered?" fake-out, two mysterious quiet moves, trap snaps shut.
- **Fake-out before every payoff**: "So is this it? Well, not exactly." Every
  apparent win gets refuted once before the real answer.
- **Teach a rule mid-story, then break it**: "the king can never step toward
  the center... Didn't we say that? Well, the situation has changed."
- **Name the idea something memorable** (the staircase, the king walk).
- **Put the emotional beat on the opponent's realization**, not the hero move.
- **Drop ONE teachable principle per episode** ("piece activity is the real
  king").

**Verify every line yourself before writing a word.** Play each branch with
chess.js or on a board. If the episode covers "why the obvious move fails,"
verify the refutation too — including stalemate claims (enumerate the legal
moves; do not trust memory).

**NEVER hand-write a FEN into a comp.** Every board-state FEN must be
copy-pasted from the verify script's output — extend the script to emit any
extra demo states you need. (Ep. 3 shipped a review round with a vanished b6
pawn because one demo state was typed from memory. Tyler caught it.)

**Before every render:** `npx tsx scripts/audit-classics-fens.ts` — replays
each episode's verified lines and fails on any comp FEN that a legal replay
cannot produce. Add the new episode's comp file + lines to it.

**If the source is a reference video** — the proven pipeline (eps. 2-3):
1. **Ask Tyler, then yt-dlp** the reel to the scratchpad (his established
   workflow; state file + size when asking; DELETE the file after extraction).
2. **Transcript**: `ffmpeg -vn` the audio to mp3, then
   `scripts/voice/.venv/bin/python scripts/voice/align-voice.py <mp3>` —
   ElevenLabs STT gives the full transcript.
3. **Boards**: ffmpeg tile filter over the board crop, e.g.
   `-vf "fps=1/3.5,crop=<board>,scale=262:262,tile=4x2"` → grid pages you can
   read; then single large frames at the key moments. Watch for a composer
   credit on the player plates (that's how Gurvich 1959 was confirmed).
4. Reconstruct the line, then VERIFY it with chess.js — the video is a lead,
   not a source of truth.
Fallback if downloading is off the table: the IG EMBED player
(`instagram.com/p/<id>/embed/`) sometimes loads where the normal player won't —
drive the `<video>` with javascript_tool and tile cropped frames onto an
appended canvas, then screenshot it. Either way: take the chess CONTENT only;
never reuse the creator's signature phrases or script.

## 2. Script rules

- **Segments of one or two sentences**, each with a stable id (`hook1`,
  `setup1`, `push`, `trap1a`, ... `cta`). Segment text doubles as the on-screen
  caption, so keep each under ~25 words.
- **Tone:** Rookie, but professional. Warm, plain, precise. NO hyperbole — not
  "the greatest move ever," but "one of the most famous endgame studies."
  State drawn lines plainly. Light personality is fine ("...Almost."); bits are
  not. No redundant beats — if a fact was just shown, don't restate it.
- **One star idea per episode** gets the most narration time (Saavedra: the
  king walk got 3 beats). Name it explicitly ("the quiet star move").
- **TTS conventions:** spell numbers out ("one hundred and thirty years"),
  "chess path dot app", no decimals, squares as plain text ("c7" reads fine).
  Write "It is / cannot" over contractions when the line should land slowly.
- **Fixed endings:** second-to-last beat ties the episode up; `cta` is always
  `"Chess Path Classics. Come learn with me at chess path dot app."`

## 3. Voice

Clone `scripts/generate-saavedra-teach-voice.ts` → `generate-<episode>-voice.ts`:
- Output dir `public/remotion/<episode>-voice/`.
- Settings for the teaching read: `stability: 0.45, style: 0.45`,
  model `eleven_turbo_v2_5`, and **NO atempo speedup** (the 1.08 speedup used
  by older reels made Rookie sound rushed — Tyler flagged it).
- Re-record a single line: `npx tsx scripts/generate-<episode>-voice.ts <segId>`,
  then delete that clip's stale `.align.json` and re-run the bake. NOTE: a
  re-recorded clip changes its duration, which SHIFTS every later beat's start
  time — recompute beat times before frame-checking (ep. 3 lesson).
- Removing a segment WITHOUT re-recording the rest: delete it from `SEGMENTS`,
  run with a bogus arg (`npx tsx ... __keep_existing__`) — existing clips are
  kept, the dropped id just leaves the json.

## 4. Bake word alignment (the talking animation)

Rookie's blocks beat once per spoken word — driven by ElevenLabs forced
alignment, NOT the RMS amplitude track. Add the new voice dir to `VOICE_DIRS`
in `scripts/bake-saavedra-alignment.ts` and run it. It aligns any clip missing
`.align.json` and bakes a per-frame `env` array into `voice-data.json`.
**Re-run it whenever a clip is regenerated** (delete that clip's stale
`.align.json` first — the bake skips existing ones).

## 5. Composition

`remotion/SaavedraReel.tsx` has the factory: `buildReel(voiceData, opts)` where
opts = `{ blackName, whiteName, title, states?, arrows?, xmarks?, badges? }`.
New episodes import it (see `ZugzwangReel.tsx` / `ChosenOneReel.tsx` — ~100
lines each: states + overlays + one buildReel call).

The factory handles automatically — do NOT rebuild these:
- **App move/capture sounds** on every state land (`sounds/move.mp3` /
  `sounds/capture.mp3`; capture detected from 'x' in the label). Mark
  rewind/reset states `silent: true` or the board clicks when it rewinds.
- **/learn checkmate explainer** at any state with `redSquares` /
  `yellowSquares` (red = attacked escapes, yellow = own-piece blocks). Compute
  them with the app's `getCheckmateSquareHighlights` from lib/puzzle-utils —
  never eyeball them. If cage X's precede the mate, END them at the cage beat
  so they hand off to the yellow squares (no doubled overlays).
- **Caption shows `chesspath.app`** while the voice says "chess path dot app".

Details:

- **Board states** are explicit `{ seg, frac, fen, from, to, label }` — frac is
  the fraction through that voice segment when the move lands. Explicit FENs
  (not cumulative SAN) so the board can REWIND to show failed variations.
  States are sorted by land frame inside the factory — order in the list
  doesn't matter, but every `seg` must exist in the voice data (missing segs
  are skipped, which is how POV/teach variants share config).
- **Land moves on their words**: when the narration says "king b5," the piece
  moves at that word. Compute beat start times with the voice-data durations
  (`durationFrames + 12 pad + EXTRA_FRAMES`) and eyeball fracs, then verify
  with frame extraction (step 6).
- **Overlays:** `ARROWS` (spring-drawn), `XMARKS` (red X), `BADGES` ("??"/"!!"
  circles), `StalemateStamp`. Use arrows to show WHY (the skewer file, the
  covered square), badges for promotion moments, the notation card label for
  every move (`'6. c8=R!!'`).
- **Title badge** = `Chess Path Classics · <Position Name>` (nowrap, fontSize
  27 fits ~45 chars).
- Register the composition in `remotion/Root.tsx`; duration comes from the
  exported total.

## 6. Render + verify (do not skip)

```bash
npx remotion render remotion/index.ts <CompositionId> out/<episode>.mp4
```
Then extract frames at each key beat and LOOK at them:
```bash
ffmpeg -y -ss <t> -i out/<episode>.mp4 -frames:v 1 -vf scale=270:480 /tmp/f.png
```
Checklist: badge fits · captions readable and not covered by Rookie · every
move lands on its word · arrows/X/badges appear at the right beat · board
never shows a stale state (the ep-1 bug: unsorted states froze the board).
`npm run video:studio` (Remotion Studio) for Tyler to scrub — open the
composition URL directly, e.g. `http://localhost:3001/<CompositionId>`.

## 7. Tyler reviews

Send the mp4 with SendUserFile. Tyler has veto on script and cut. Expect 1-3
revision rounds (pace, redundant lines, emphasis). Do NOT post without his go.

## 8. Post

Clone `scripts/post-classics-saavedra.ts`: copy the mp4 to
`public/social/classics-<episode>.mp4`, caption format:

```
Chess Path Classics, No. <n>: <Position Name> (<year>).

<The surprising truth, one short paragraph.>

<What Rookie walks through, one paragraph.>

<CREDIT LINE — always. Name the composer/players + year when known, and
where we found it: e.g. "Study by A. Gurvich, 1959. We found it thanks to
@pietrocheckmate." If the composer is unknown after a real search, say so
and invite the comments: "Composer unknown to us — if you know this study,
tell us in the comments.">

A new classic position, explained simply, every week.

The fun way to learn chess: chesspath.app — link in bio.

#chess #learnchess #chesspuzzle #endgame #chessstudy #chesshistory #chessreels #chesseducation
```

Credit is non-negotiable (Tyler, 2026-07-18): every caption names the original
composer/game when known AND the account/channel where we found the position.

No emojis anywhere (captions run through `stripEmojis` anyway). Dry-run first;
`--post` publishes via `lib/instagram.ts`.

**Scheduled posts** ("post it tomorrow at 10"): prepare + dry-run the post
script, then CronCreate a one-shot with the exact command — but it is
SESSION-BOUND (dies if the Claude session closes), so ALWAYS also create a
Penelope task with `scheduled_at` documenting the one-line fallback command.
Close the task once the post is confirmed live.

## Episode log

| No. | Position | Composition | Posted | Media id |
|-----|----------|-------------|--------|----------|
| 1 | The Saavedra Position (1895) | `SaavedraTeachReel` | 2026-07-17 | 18601938340033459 |
| 2 | Zugzwang — A. Gurvich study (1959) | `ZugzwangReel` | 2026-07-18 | 18365382673244370 |
| 3 | The Two-Pawn Checkmate (sacrifice cascade) | `ChosenOneReel` | 2026-07-19 | 17975966700100774 |

Format note (Tyler, 2026-07-18): part of the fun is REVELING in the
impossibility — show all the variations, take your time. The short formula is
a tool, not a rule; when a study's joy is escalation (No. 3), let it breathe.
Never spoil the payoff in the hook — tease the impossibility, not the moves.

(The Saavedra also has a POV companion cut, `SaavedraReel` — Rookie AS the
black rook, sore-loser register, `out/saavedra-reel.mp4`, unposted.)
