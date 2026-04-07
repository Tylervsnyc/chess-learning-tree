# Play Rookie

Play Rookie is where the user takes everything they've learned and plays a real chess game. Rookie is both the opponent and the coach — she reacts emotionally during the game, plays at the user's level so they can actually win, and then walks them through what happened afterward.

It's the bridge between "I learned how the pieces move" and "I understand how a real game works." Lessons teach concepts in isolation. Daily Rook drills tactics. Play Rookie is where it all comes together.

---

## The Loop

Play Rookie is part of a larger learning cycle:

**Learn (Path) → Practice (Daily Rook) → Play (Rookie) → Get Coached → Learn More**

After a game, Rookie identifies weaknesses and recommends specific lessons or puzzles. The user goes does those, comes back, plays again. That's the retention engine.

---

## Phases

A Play Rookie session moves through four phases:

### 1. Setup
Pick color, name, difficulty. Five difficulty levels from "I just learned the rules" to "Challenge me."

### 2. Playing
A full chess game against Rookie. During the game:

- **Rookie plays at your level.** Beginner uses a pure JS minimax engine (no Stockfish). Higher levels use Stockfish WASM at increasing skill/depth.
- **Rookie has feelings.** Her mood shifts based on the engine evaluation — she's smug when winning, nervous when losing, surprised by big swings. Her colors change (BreathingRook mood tinting) and she speaks through a queued speech system.
- **The eval bar shows who's winning.** Uses the Lichess sigmoid so small advantages near equal look dramatic and huge leads at the extremes flatten out — matching actual game impact.
- **Everything is tracked.** Every move, every position eval, timing, hanging pieces, missed captures — all stored in memory during play for instant post-game analysis.

### 3. Game Over
Shows the result + instant analysis: accuracy percentage, move classifications (great/inaccuracy/mistake/blunder). No loading — analysis is computed from evals already collected during play.

### 4. Review
Step through the game move-by-move. Key moments highlighted with arrows on the board. Rookie narrates what went right and wrong. Recommendations link back to specific lessons and puzzles.

---

## Two Systems: Eval and Speech

Eval and speech are **separate systems** that talk to each other. They should be built, maintained, and tracked as independent concerns.

**Eval system** answers: what's happening in the game? Who's winning? Was that move good or bad? How accurate was the player?

**Speech system** answers: given what's happening, what does Rookie say and when?

Eval is an input to speech. Speech never changes the eval. The interface between them is simple: speech asks eval "what's Rookie's win%, did the eval just swing, what's the move classification" and that's it.

---

## Eval System

### Live Eval (during game)
- Stockfish WASM at depth 10 (~100ms per position)
- Drives the eval bar and Rookie's mood
- Each eval is stored for post-game use

### Post-Game Analysis (instant)
- Uses the evals already collected during play — no re-analysis
- Classifies every move by win% delta (Lichess thresholds: 10% = inaccuracy, 20% = mistake, 30% = blunder)
- Computes accuracy using Lichess formula: exponential decay on win% drop per move, game accuracy = blend of volatility-weighted mean + harmonic mean
- Feeds into the review screen and coaching recommendations

### Why Not Deeper?
Depth 10 is good enough for beginner games against a minimax/low-skill engine. The positions aren't sharp enough to need depth 18. If we add premium deep analysis later, we can run it in the background and refine the numbers — but the instant results are the priority.

---

## Speech System

Rookie's speech has two parts: a **beat sheet** and a **priority queue**.

### Beat Sheet

The beat sheet is the emotional arc of the game. Every game has roughly the same shape:

1. **Opening** — Rookie greets you, sets the tone, maybe references something from a past game
2. **Early game** — Rookie's relaxed, might go on a tangent (a thread — otters, snails, vending machines, ww2)
3. **Turning point** — the biggest eval swing so far. Rookie's thread shifts based on whether she's winning or losing
4. **Late game** — tension builds. Shorter and more focused if losing. More playful if winning
5. **Game end** — checkmate, draw, whatever. Rookie reacts to the outcome
6. **Post-game** — accuracy, coaching, "want to review?"

The beat sheet tells us *when* Rookie speaks and *what emotional register* she's in. Not what she says — just the vibe. The eval system provides the data that determines which beat we're in and what the emotional register should be.

### Priority Queue

The priority queue is *what* Rookie actually says. It's a pool of possible lines, each tagged with conditions:

- What beat are we in? (opening, early, turning point, late, end)
- What's Rookie's eval mood? (winning, losing, even, desperate)
- What just happened? (capture, check, castle, blunder, nothing)
- What thread is she on? (otters, snails, ww2, none yet)
- What has she already said this game?

The system scores all valid lines and picks the best fit. Once she says it, it's **drained** — gone for this game and deprioritized for future games. No repeats, ever. This is the Hades model (Supergiant's "dialogue priority queue" — every line has preconditions and a priority, system picks the highest-priority valid line the player hasn't heard).

### Threads

A thread is what makes it feel like a narrative, not a soundboard. At beat 2 (early game), Rookie picks a thread — a topic she's going to riff on. As the game evolves, her relationship to that thread changes:

- **Winning:** She doubles down, gets sillier, more elaborate
- **Losing:** She abandons it, gets quiet. "I don't want to talk about that anymore."
- **Comeback:** She comes back to it. "OK I'm ready to talk about it again."

The thread is the connective tissue that makes 4-5 quips across a game feel like a conversation instead of isolated one-liners.

### Frequency

Rookie speaks **4-5 times per game max.** One line per beat, roughly. Not every move, not every capture. She talks when it matters and stays quiet when it doesn't. The moments that earn a quip:

- Game start (always)
- One early personality moment (the thread opener)
- The turning point (biggest eval swing)
- Game end (always)
- Maybe one more — earned, not guaranteed

Everything else: she stays quiet and lets the chess breathe.

### Claude's Role

The priority queue is a mix of authored templates (fast, free, offline) and Claude-generated lines (specific, fresh, costs an API call).

- **Opening line:** One small Claude call at game start. Takes Rookie's personality prompt + player's cross-game history + chosen thread. Writes a custom opener. This is where "Rookie remembers you" lives.
- **Mid-game lines (2-3):** Authored templates with eval variables. Fast, no API cost. The thread + eval state make them feel specific even though they're templated.
- **Game-end line:** Another Claude call with the full game context — eval trajectory, accuracy, key moments. Rookie reacts to the whole game, not just the last move.

2 Claude calls per game. The rest is templates. Fast, cheap, and every game feels different because the opening and closing are always fresh.

### Mood

Rookie's mood is eval-driven. Stockfish runs at depth 10 after every move. The eval is converted to win% via the Lichess sigmoid, then mapped to Rookie's mood from her perspective. This is the baseline mood that controls BreathingRook's color tinting.

- **Events override briefly.** Check, checkmate, and stalemate override the eval mood immediately — they're unambiguous.
- **Captures do NOT override** because the eval already accounts for recaptures. Avoids the "capture a queen, panic, recapture, calm down" problem.
- Mood influences which lines are valid in the priority queue, but mood and speech are not the same thing. Mood is continuous (updates every move). Speech is sparse (4-5 times per game).

### Speech Playback

All speech flows through a single queue. Rookie finishes one line before starting the next. She finishes talking before making her move. No interruptions, no dropped lines.

---

## Cross-Game Memory

After each game, extract 2-3 discrete facts about the player:

- "Tyler hung his bishop again"
- "Tyler beat Rookie for the first time"
- "Tyler's longest game was 34 moves"
- "Tyler always plays the Italian Opening"

Store in Supabase. Retrieve at game start and inject into the Claude call that generates Rookie's opening line. Specific callbacks beat vague familiarity: "Last time you hung a bishop on move 12. Just saying." feels like a real friend remembering.

**Later (with scale):** A user modeling layer like Honcho could sit between the raw facts and Claude, building a theory of mind: "Tyler is a visual learner who gets impatient in equal middlegames." That model would influence Rookie's entire approach, not just her callbacks. But that's a future layer — the discrete facts are enough to start.

---

## Key Files

| File | What it does |
|------|-------------|
| `app/play/page.tsx` | The page — game state, UI, phase management |
| `lib/rookie-engine.ts` | Pure JS minimax chess AI for Beginner level |
| `lib/stockfish/stockfish-adapter.ts` | Stockfish WASM wrapper (getBestMove, getFullEval) |
| `lib/game-eval.ts` | Lichess sigmoid, move classification, accuracy math |
| `lib/rookie-mood-eval.ts` | Maps eval to Rookie's mood (win% zones + swing detection) |
| `lib/rookie-quips.ts` | Current quip banks (to be replaced by priority queue system) |
| `lib/game-session.ts` | Session tracker — records moves, writes to Supabase on end |
| `lib/board-analysis.ts` | Simple heuristics — hanging pieces, missed captures |
| `lib/game-review.ts` | Key moment detection for review mode |
| `hooks/useRookieVoice.ts` | TTS playback — ElevenLabs cache + live generation |
| `hooks/usePostGameAnalysis.ts` | Instant analysis from stored evals |
| `hooks/useRookieQuipQueue.ts` | Speech queue (started, needs to be wired in) |

---

## What Needs Work

### Speech system (rebuild)
Replace the current category-based quip banks with the beat sheet + priority queue system described above. Wire in the quip queue for sequential playback. Add Claude calls for opening and game-end lines. Build the thread system.

### Eval system (polish)
The core math is built (game-eval.ts). Needs: better eval bar display during play, wiring eval-based move classifications into the review screen (currently uses simple heuristics), and connecting accuracy data to coaching recommendations.

### Mood coordination
Eval-based mood and event-based mood are two separate code paths in the page. Should be one hook that takes both inputs and outputs a single mood.

### Page refactor
1,100+ lines. Game logic, mood logic, eval logic, speech logic, and UI are all in one file. Extract into focused hooks and components. The speech and eval systems being independent makes this cleaner — each becomes its own hook.

### Cross-game memory
Build the fact extraction + storage after each game. Wire retrieval into the opening Claude call. Start simple — 2-3 facts per game in Supabase.

### Review mode
Wire eval-based move classifications into key moment detection. Replace simple heuristics (hanging pieces) with win% delta analysis. The data exists, it's just not connected yet.
