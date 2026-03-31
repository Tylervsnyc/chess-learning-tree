# Honcho Integration

Wire up Honcho memory logging for a game mode so it builds conclusions about the user's chess ability.

## Input

Target: $ARGUMENTS — one of `play`, `daily`, `path`, `openings`, or `all`.

If no arguments, ask which mode to wire up.

## Mental Model (read this first)

Honcho builds a **representation** (set of conclusions) about each user by reasoning over messages logged across all sessions. The pipeline:

```
Messages logged to session → Token buffer fills (~1000 tokens) → Reasoning runs async
→ Conclusions updated → Dream (end-of-session consolidation) → Refined conclusions
```

**Peer** = one user. Peer ID = Supabase `user.id`. Stable across all sessions and modes.
**Session** = one interaction (one game, one lesson, one daily challenge). Scoped by a unique ID.
**Conclusions** = what Honcho learns about the peer. Built automatically from messages. We don't write conclusions — we write good messages and Honcho reasons over them.

**Our job:** Log high-quality, plain-language pedagogical messages. Honcho does the rest.

## Architecture

All Honcho calls go through the server-side API route:

```
Client (fire-and-forget fetch) → POST /api/honcho → lib/honcho.ts → Honcho SDK
```

**Key files:**
- `lib/honcho.ts` — SDK wrapper (createSession, logToHoncho, triggerDream, getPlayerContext)
- `lib/honcho-logger.ts` — Event formatting (BoardEvent, BehavioralEvent, GameSummaryEvent)
- `app/api/honcho/route.ts` — Server-side proxy (all actions)
- `lib/rookie-memory.ts` — Formats Honcho context for Rookie's prompt

**Existing API actions:** `start_session`, `get_context`, `get_last_game`, `log_opening`, `log_event`, `log_summary`, `seed_card`

## Session ID Convention

Each mode uses a predictable session ID so Honcho can scope context:

| Mode | Session ID format | Example |
|------|------------------|---------|
| `/play` | `game-{timestamp}` | `game-1711900800000` |
| `/daily` | `daily-{YYYY-MM-DD}` | `daily-2026-03-31` |
| `/path` | `lesson-{lessonId}` | `lesson-1.3.2` |
| `/openings` | `opening-{slug}-{lessonId}` | `opening-ruy-lopez-rl-3` |

## What Each Mode Logs

### /play (ALREADY WIRED — reference only)

**Lifecycle:** mount → start_session + get_context → log_event (blunders/mistakes/behavioral) → log_opening (move 8) → log_summary + dream

**Messages Honcho receives:**
- "Player opened with the Sicilian Defense (B20) playing black."
- "Player blundered on move 14, playing Nf3 instead of Bxe5. 32% evaluation swing."
- "Player took 18s to think on move 22 before playing Qd7."
- "Game ended: lost in 34 moves as black playing the Sicilian Defense. Accuracy: 62%. Blunders: 2."

### /daily — Speed & Pattern Recognition

**Session:** One session per daily challenge. ID: `daily-{YYYY-MM-DD}`

**When to log:**

| Trigger | Message template |
|---------|-----------------|
| Challenge started | `Daily challenge started. {puzzleCount} puzzles, 5-minute timer.` |
| Puzzle solved (correct) | `Solved puzzle #{n} ({themes}) rated {rating} on first attempt in {seconds}s.` |
| Puzzle failed (wrong) | `Failed puzzle #{n} ({themes}) rated {rating}. Wrong move: {san}. Correct was: {solution}.` |
| Challenge ended | See summary below |

**End-of-session summary message:**
```
Daily challenge complete: {solved}/{total} puzzles in {time}.
Accuracy: {accuracy}%. Lives remaining: {lives}/3.
Themes correct: {themeList}. Themes missed: {themeList}.
Highest puzzle solved: rated {maxRating}. Stopped at: rated {failRating}.
Streak: {streak} days.
```

**What Honcho concludes from this:** Tactical pattern recognition speed, which themes are weak/strong, ELO ceiling under time pressure, consistency (streak), improvement trend over days.

### /path — Curriculum Mastery

**Session:** One session per lesson attempt. ID: `lesson-{lessonId}`

**When to log:**

| Trigger | Message template |
|---------|-----------------|
| Lesson started | `Started lesson {lessonId} "{lessonName}" — theme: {themes}, rating range: {min}-{max}.` |
| Puzzle correct (1st attempt) | `Solved puzzle #{n} ({themes}, rated {rating}) on first attempt.` |
| Puzzle wrong (with retry) | `Missed puzzle #{n} ({themes}, rated {rating}). Took {attempts} attempts. Wrong move: {san}.` |
| Puzzle needed hint | `Needed hint on puzzle #{n} ({themes}, rated {rating}) after {attempts} wrong attempts.` |
| Lesson complete (pass) | See summary below |
| Lesson complete (fail) | See summary below |

**End-of-session summary message (pass):**
```
Lesson {lessonId} "{lessonName}" PASSED. Score: {score}/6.
Theme: {themes}. Rating range: {min}-{max}.
First-attempt correct: {count}/6. Retries needed: {retryCount}.
Time: {seconds}s. Now advancing to {nextLessonId}.
```

**End-of-session summary message (fail):**
```
Lesson {lessonId} "{lessonName}" FAILED. Score: {score}/6.
Theme: {themes}. Rating range: {min}-{max}.
Puzzles missed: #{n1} ({theme}), #{n2} ({theme}).
This is attempt #{attemptNumber} at this lesson.
```

**What Honcho concludes from this:** Which tactical concepts are mastered vs struggling, learning pace, whether they need more practice at a rating range, which themes require repeated attempts, curriculum progress velocity.

### /openings — Repertoire Knowledge

**Session:** One session per opening lesson. ID: `opening-{slug}-{lessonId}`

**When to log:**

| Trigger | Message template |
|---------|-----------------|
| Lesson started | `Started opening lesson "{title}" in the {openingName} ({slug}).` |
| Predict correct (1st attempt) | `Correctly predicted {san} in the {openingName} on first try.` |
| Predict wrong | `Predicted wrong move in {openingName}. Played {wrongSan}, correct was {correctSan}. Position: move {n}.` |
| Recall correct | `Recalled {san} from memory in the {openingName}. No hints needed.` |
| Recall wrong | `Failed to recall {correctSan} in the {openingName}. Played {wrongSan} instead.` |
| Quiz correct | `Answered quiz correctly in {openingName}: "{question}"` |
| Quiz wrong | `Answered quiz wrong in {openingName}: "{question}". Chose "{wrongAnswer}", correct: "{correctAnswer}".` |
| Lesson complete | See summary below |

**End-of-session summary message:**
```
Opening lesson "{title}" in {openingName} complete.
Accuracy: {accuracy}%. Time: {seconds}s.
Predict accuracy: {predictCorrect}/{predictTotal}. Recall accuracy: {recallCorrect}/{recallTotal}.
{nodeType} lesson — covers moves: {moveList}.
Progress: {completedCount}/{totalNodes} nodes in {openingName} tree.
```

**What Honcho concludes from this:** Which openings the player knows, how deep their prep goes, recall vs recognition gap (predict vs recall accuracy), which lines they struggle to remember, breadth vs depth of repertoire.

## Implementation Checklist

When wiring up a mode, follow this exact order:

### Step 1: Add session ID ref and guard

```typescript
// In the page component
const honchoSessionIdRef = useRef<string | null>(null);
```

### Step 2: Start session on mount/game-start

```typescript
if (user?.id) {
  const sessionId = `{prefix}-{identifier}`;  // See convention table
  honchoSessionIdRef.current = sessionId;

  fetch('/api/honcho', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start_session', gameId: sessionId, userId: user.id }),
  }).catch(() => {});
}
```

### Step 3: Log events during interaction

Every log call follows this pattern:

```typescript
if (user?.id && honchoSessionIdRef.current) {
  fetch('/api/honcho', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'log_message',
      gameId: honchoSessionIdRef.current,
      userId: user.id,
      message: `Plain-language pedagogical message here.`,
    }),
  }).catch(() => {});
}
```

### Step 4: Log summary + trigger dream at session end

```typescript
fetch('/api/honcho', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'log_summary_message',
    gameId: honchoSessionIdRef.current,
    userId: user.id,
    message: summaryText,  // Built from the templates above
  }),
}).catch(() => {});
```

### Step 5: Add new API actions if needed

The current `/api/honcho` route handles Play Rookie events. For other modes, add a `log_message` action that takes a plain string:

```typescript
if (action === 'log_message') {
  const { gameId, userId, message } = body;
  const honcho = await createHonchoGameSession(gameId, userId);
  await honcho.session.addMessages([honcho.user.message(message)]);
  return NextResponse.json({ ok: true });
}
```

And a `log_summary_message` that logs + triggers dream:

```typescript
if (action === 'log_summary_message') {
  const { gameId, userId, message } = body;
  const honcho = await createHonchoGameSession(gameId, userId);
  await honcho.session.addMessages([honcho.user.message(message)]);
  await triggerDream(userId);
  return NextResponse.json({ ok: true });
}
```

### Step 6: Verify

After wiring, test with Tyler's user ID (`e52d08d3-c76f-4eba-bacd-91ff050a4019`):

1. Complete one session in the mode
2. Wait 30s for dream processing
3. Call `get_context` and verify the new mode's data appears in conclusions

## Message Quality Rules

1. **Plain language, not JSON.** Honcho reasons over natural language. Write messages like a chess coach taking notes.
2. **Include the concept name.** "Failed a fork puzzle" is better than "got puzzle #3 wrong."
3. **Include difficulty.** Rating numbers help Honcho gauge ability level.
4. **Include what they did wrong.** "Played Nf3 instead of Bxe5" gives Honcho the tactical detail.
5. **Include context.** "This is their 3rd attempt at this lesson" matters more than raw score.
6. **End-of-session summaries are critical.** This is where dreams fire. Make them comprehensive.
7. **Don't log noise.** Skip trivial events (correct move in an easy lesson, navigating the UI). Only log learning-relevant moments.
8. **Fire-and-forget.** Never await Honcho calls in the UI thread. Use `.catch(() => {})`.
9. **Guard every call.** Always check `user?.id && honchoSessionIdRef.current` before logging.
10. **One session per interaction.** Don't reuse sessions across lessons or days.
