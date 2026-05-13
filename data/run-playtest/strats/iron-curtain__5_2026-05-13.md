# Strategy Discovery — iron-curtain/5

Each tier played the level multiple times with seed-varied bots. We compare what winners did vs losers to surface winning patterns. Each square / opening is annotated with a chess-reasoning "why" derived from the level's piece geometry. See `.claude/run-strategy-bible.md` for the principles.

## Level summary

- Pieces: 11 pawns · 3 bishops · 1 knight
- Rookie start: d1
- Move limit: 16
- Enemies per turn: 3
- Allowed forms: rook + knight, bishop
- Hazards at: a5, h5, d5, e5
- Open files from start rank: NONE — every file has a blocker

## T3

**59 wins / 41 losses** (59% win rate over 100 trials)

Mean moves in wins: 8.4
Mean moves in losses: 7.5

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| d1 | 100 | 59% | safe (no current attackers); no immediate open files from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| pawn-charge | 34% | 44% | -10pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| d1 → g1 | 40 | 50% | rank-1 sidestep |
| d1 → h1 | 26 | 69% | rank-1 sidestep |
| d1 → b1 | 19 | 58% | rank-1 sidestep |
| d1 → f1 | 15 | 67% | rank-1 sidestep |

## T4

**100 wins / 0 losses** (100% win rate over 100 trials)

Mean moves in wins: 3.6

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| d1 | 100 | 100% | safe (no current attackers); no immediate open files from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| pawn-charge | 35% | 0% | +35pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| d1 → c1 | 100 | 100% | rank-1 sidestep |

## T5

**100 wins / 0 losses** (100% win rate over 100 trials)

Mean moves in wins: 3.0

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| d1 | 100 | 100% | safe (no current attackers); no immediate open files from rank 1 |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| d1 → c1 | 100 | 100% | rank-1 sidestep |

## How to read this

- A first move with high "Win rate" relative to total = a good opening on this level. If 80% of trials starting with c1 won but only 20% starting with f1 won, that's a strong directional signal.
- "Lift" = ability use share in wins minus losses. Positive lift = winners used it more = the ability mattered.
- Top 2-move openings reveal whether wins cluster around a few approaches or are spread out. Concentrated openings mean there's a "right way" to play; spread means many paths work.