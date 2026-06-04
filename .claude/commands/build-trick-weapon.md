# /build-trick-weapon — data-driven opening lessons from a player's real games

Build (or rebuild) a **trick-weapon** opening — a meme/gambit line taught from
ONE player's real games, NOT master theory. This is the OPPOSITE of
`/build-opening` (which enforces Hard Rule #0: every move #1 in the masters DB).
Here the source of truth is **what the player actually plays and what their
opponents actually do**.

Used for the Witty Alien arsenal (Bulgarian streamer `witty_alien` on chess.com).

## Why this exists

The original Witty Alien lessons were hand-written and **fabricated**: invented
stats, lines the player never plays, and at least two catastrophic bugs (the
Elephant taught a move order that hangs the queen to the opponent's #1 reply; the
Martian had illegal-move FENs that broke the lesson). Root cause: nobody chose
the **opponent's** scripted replies by what opponents actually play, and nothing
validated the data. This pipeline fixes both: real frequencies drive every line,
and a hard gate runs before anything ships.

## The pipeline

All scripts live in `scripts/witty/`. Games cache to `data/witty-games/` (gitignored).

1. **Fetch** — `npx tsx scripts/witty/fetch-archives.ts [monthsBack=24]`
   Pulls the player's monthly archives from the chess.com public API (lowercase
   username; needs a `User-Agent` header). ~57k games over 24 months.

2. **Confirm it's real** — `npx tsx scripts/witty/analyze-opening.ts`
   Sanity-check that the player actually plays the opening, with real frequency +
   win rate. If they don't play it, PULL the lesson — don't fake it.

3. **Extract the real lines** — `npx tsx scripts/witty/line-tree.ts <white|black> "<prefix SAN>" [depth] [minPct]`
   Walks the dominant continuation from a move prefix, showing every child above a
   frequency threshold with game counts + win rate. `*` marks the player's own
   moves. THIS is the source of truth for both the main line AND which opponent
   replies to script (always the most common real one).

4. **Write a spec + generate** — copy `scripts/witty/build-elephant.ts` (Black) or
   `scripts/witty/build-martian.ts` (White) and edit the spec. Then run it.
   - `buildOpening(spec)` (`scripts/witty/lib/build-opening.ts`) computes every FEN
     with chess.js — **correct by construction, impossible to desync**.
   - Spec rules:
     - `playerColor: 'white' | 'black'`.
     - Each `LineSpec.plies` is the FULL line from move 1, alternating W/B SAN.
       Player plies carry voice (`teach`/`prompt`/`hint`/`ok`); opponent plies are
       bare `{ san }` (highlights auto-derived).
     - `teachFrom` = index of the first taught player ply; `teachCount` defaults to
       **exactly 3** player moves per node (hard rule).
     - Main-line nodes share ONE `plies` array, with different `teachFrom`.
     - Pick opponent replies = the **most common real move** (from step 3). Never an
       unnatural "safe" move that hides a refutation — that's the original sin.
     - Voice: trick-weapon/meme energy, honest about evals ("unsound by the engine,
       lethal in bullet"), no emojis. When a queen goes active, teach "move the
       attacked queen, never abandon it."
     - Grid: main trunk `col 0` rows ascending; deviations `col -1`/`col 1`; test on
       top. `lineFrom` = parent node id. `unlockedBy: null` (sandbox).

5. **GATE (must pass before shipping):**
   - `npx tsx scripts/verify-witty-alien.ts` — structural: every FEN legal, every
     `correctMove` legal, side-to-move matches orientation, positions chain
     forward. **Hard pass/fail.**
   - `npx tsx scripts/verify-witty-queen-traps.ts` — advisory: simulates the player
     blindly following the script and flags lines where a natural opponent move
     wins the queen. Review each: a flag on the *scripted* reply = real bug;
     a flag only on a *rare opponent deviation* (verify the % in step 3) = acceptable.
   - `npx tsc --noEmit -p tsconfig.json` — in-project typecheck.
   - Render: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/openings/<slug>/<nodeId>` → 200.

6. **Ship** — the generated `data/openings/<slug>.ts` + `<slug>-lessons.ts` are
   drop-in (same export names the registry/page import). Commit the data files +
   the build script, push (auto-deploys). Update `OPENINGS_REGISTRY` subtitle stats
   if they changed.

## Generated-file contract (do not break)

- Tree export name + getter name must match `lib/opening-trees.ts` and
  `app/openings/[slug]/[lessonId]/page.tsx` (e.g. `WITTY_ALIEN_ELEPHANT`,
  `getWittyAlienElephantLesson`).
- Data files are **generated** — edit the spec in `scripts/witty/build-<name>.ts`
  and regenerate; do not hand-edit the `data/openings/*` output.

## The 8 Witty Alien openings

White: `witty-alien` (Alien main), `witty-alien-martian`, `witty-alien-two-knights`,
`witty-alien-bonjour`, `witty-alien-danish`.
Black: `witty-alien-elephant`, `witty-alien-englund`, `witty-alien-scandi`.

Done from real data: Elephant, Martian. (Rebuild the rest the same way.)
