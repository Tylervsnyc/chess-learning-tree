# Tune Eval

Safely adjust chess evaluation zones and see ripple effects across all systems.

## Input

What to adjust: $ARGUMENTS (e.g., "make ADVANTAGE 2.0 instead of 1.5", "show current zones", "what does desperate threshold affect?")

## Context

All eval thresholds live in **one file**: `lib/eval-zones.ts` (OSOT — One Source of Truth).
Values are in **pawn units** (centipawns / 100). So +1.0 = one pawn advantage, +5.0 = crushing.

## Workflow

### 1. Show Current Config
Read `lib/eval-zones.ts` and display the current zone thresholds:
```
EVAL_ZONES:
  CRUSHING:   5.0 pawns
  WINNING:    3.0 pawns
  ADVANTAGE:  1.5 pawns
  SLIGHT:     0.5 pawns
  EQUAL:      0

SWING: 1.0 (notable), 2.5 (massive)
ALARM: -5.0 (Rookie getting crushed)
```

### 2. Map Consumers
List every system that reads from these zones:

| Consumer | What it uses | File |
|----------|-------------|------|
| **Mood system** | Zone thresholds → RookieMood mapping | `lib/eval-zones.ts` (evalToRookieMood) |
| **Quip system** | EvalMood (winning/even/losing/desperate) | `lib/eval-zones.ts` (getEvalMood) → `lib/speech/beat-sheet.ts` |
| **Beat sheet** | Swing threshold for turning points | `lib/speech/beat-sheet.ts` (imports SWING_THRESHOLD) |
| **Chess intelligence** | Blunder/brilliant detection, turning points | `lib/rookie-os/chess-intelligence.ts` |
| **Alarm animations** | ALARM_THRESHOLD for alarm variant | `lib/eval-zones.ts` |
| **Honcho logging** | Blunder/mistake thresholds (pawn delta) | `app/play/page.tsx` |
| **Zone descriptions** | Human-readable labels | `lib/eval-zones.ts` (describeZone) |

### 3. Preview Ripple Effects
For the requested change, explain what changes:
- Which moods shift at which eval?
- Do quip triggers change? (EvalMood boundaries)
- Does turning point detection get more/less sensitive?
- Does alarm fire earlier/later?

### 4. Make the Change
Edit `lib/eval-zones.ts` — the single file. All consumers auto-inherit.

### 5. Verify
Run `npm run check` to confirm no type errors.

## Important Notes
- **Never add thresholds to other files.** If you find a magic number in another file that should be here, move it.
- **Pawn units only.** Never use centipawns or win% in this file.
- The mood mapping in `evalToRookieMood` uses these zones directly — changing a zone boundary changes mood behavior.
- `getEvalMood` maps to the 4-value EvalMood type (winning/even/losing/desperate) that the quip system uses. Changing these boundaries affects which quips can fire.
