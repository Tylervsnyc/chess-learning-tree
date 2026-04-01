# Game Review

Build and improve the chess coach summary system that translates eval data into meaningful game narratives.

## Input

What to work on: $ARGUMENTS (e.g., "improve post-game summaries", "add key moment descriptions", "make summaries use zone language")

## Context

The eval zones OSOT (`lib/eval-zones.ts`) defines the shared vocabulary:
- **Pawn units**: +1.0 = one pawn advantage, +5.0 = crushing
- **Zone names**: crushing, winning, advantage, slight, equal
- **`describeZone(rookiePawns)`**: Returns human-readable strings like "Player has a solid advantage"
- **`getEvalMood(rookiePawns)`**: Returns winning/even/losing/desperate

The goal: game summaries that sound like a chess coach, not a spreadsheet.

## Anti-patterns (don't do these)
- "Move 14: eval went from +148cp to -201cp" — raw numbers, meaningless to a beginner
- "Your accuracy was 67.3%" — number without context
- "You made 3 blunders" — count without story

## Good patterns (do these)
- "You had a slight advantage out of the opening, but hanging your bishop on move 14 let Rookie take over."
- "That knight sacrifice on move 8 was brilliant — you went from even to clearly winning in one move."
- "The game was balanced until the endgame, where Rookie's passed pawn was too much to handle."

## Summary Structure
A coach-quality game review has:

1. **Opening assessment** — how did the game start? Who got the better position? Was it theoretical?
2. **Key moments** (2-3 max) — the moves that decided the game. Described in chess terms, not numbers. Use zone transitions as the drama: "You went from *slight advantage* to *losing*."
3. **Turning point** — the single move where the game shifted. Why was it a mistake? What should they have done?
4. **Result** — how the game ended. Was the conversion clean?
5. **One takeaway** — a single, actionable thing to work on. Not "play better" — something specific like "Look for hanging pieces before trading" or "Castle earlier in the Italian Game."

## Key Files

| File | What it does |
|------|-------------|
| `lib/eval-zones.ts` | OSOT — zone vocabulary, `describeZone()`, `getEvalMood()` |
| `lib/game-eval.ts` | `analyzeGameMoves()`, `extractKeyMoments()`, move classification |
| `hooks/usePostGameAnalysis.ts` | Post-game analysis hook, collects position evals |
| `app/play/page.tsx` | Game loop, stores `positionEvalsRef` during play |
| `lib/rookie-os/chess-intelligence.ts` | Briefing system, turning point detection |

## Workflow

### 1. Read Current State
- Read `lib/eval-zones.ts` for zone vocabulary and `describeZone()` function
- Read `lib/game-eval.ts` for existing analysis infrastructure (`analyzeGameMoves`, `extractKeyMoments`, `KeyMoment`)
- Read `hooks/usePostGameAnalysis.ts` for how post-game analysis currently works

### 2. Identify What Needs Building/Improving
Based on $ARGUMENTS, determine:
- Is the coach narration layer missing entirely? Build it.
- Does it exist but use raw numbers? Convert to zone language.
- Does it exist but lack chess insight? Improve the key moment descriptions.

### 3. Implement
- Use `describeZone()` from eval-zones for all position descriptions
- Use zone transitions as story beats (SLIGHT → LOSING is the drama)
- Describe swings in pawn units: "That move cost you about 2 pawns of position"
- Keep it beginner-friendly — no jargon, no raw centipawns

### 4. Verify
- Run `npm run check` to confirm no type errors
- Test with a completed game to verify the summary reads naturally

## Integration Points
- **Post-game screen**: The summary should appear after the game ends
- **Rookie's voice**: Could feed into Rookie's post-game commentary for more insightful quips
- **Honcho memory**: Key moments and takeaways could be stored for cross-game learning
