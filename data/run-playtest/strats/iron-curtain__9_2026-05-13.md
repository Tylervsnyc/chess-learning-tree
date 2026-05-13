# Strategy Discovery — iron-curtain/9

Each tier played the level multiple times with seed-varied bots. We compare what winners did vs losers to surface winning patterns. Each square / opening is annotated with a chess-reasoning "why" derived from the level's piece geometry. See `.claude/run-strategy-bible.md` for the principles.

## Level summary

- Pieces: 8 pawns · 3 knights · 3 bishops · 2 queens
- Rookie start: d1
- Move limit: 20
- Enemies per turn: 4
- Allowed forms: rook + knight, bishop
- Hazards at: a5, h5, d5, e5, b7, g7
- Open files from start rank: NONE — every file has a blocker

## T3

**2 wins / 98 losses** (2% win rate over 100 trials)

Mean moves in wins: 7.5
Mean moves in losses: 4.1

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| h1 | 51 | 2% | safe (no current attackers); no immediate open files from rank 1 |
| f1 | 19 | 0% | safe (no current attackers); no immediate open files from rank 1 |
| g1 | 16 | 0% | safe (no current attackers); no immediate open files from rank 1 |
| b1 | 14 | 7% | safe (no current attackers); no immediate open files from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| knight-hop | 50% | 1% | +49pp |
| bishop-step | 0% | 2% | -2pp |
| phase-step | 0% | 1% | -1pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| h1 → b1 | 37 | 0% | rank-1 sidestep |
| f1 → b1 | 13 | 0% | rank-1 sidestep |
| g1 → b1 | 9 | 0% | rank-1 sidestep |
| h1 → h2 | 6 | 0% | climb file h +1; 2 attackers on h2 |
| b1 → h1 | 6 | 17% | rank-1 sidestep |
| b1 → f1 | 5 | 0% | rank-1 sidestep |
| f1 → h1 | 5 | 0% | rank-1 sidestep |
| g1 → d1 | 4 | 0% | rank-1 sidestep |

## T4

**31 wins / 69 losses** (31% win rate over 100 trials)

Mean moves in wins: 10.8
Mean moves in losses: 6.0

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| d2 | 72 | 31% | safe (no current attackers); no immediate open files from rank 2 |
| a1 | 12 | 42% | safe (no current attackers); no immediate open files from rank 1 |
| c1 | 12 | 25% | safe (no current attackers); no immediate open files from rank 1 |
| b1 | 2 | 0% | safe (no current attackers); no immediate open files from rank 1 |
| e1 | 1 | 100% | safe (no current attackers); no immediate open files from rank 1 |
| h1 | 1 | 0% | safe (no current attackers); no immediate open files from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| freeze-ray | 6% | 0% | +6pp |
| aegis | 6% | 0% | +6pp |
| bishop-step | 6% | 0% | +6pp |
| queen-pulse | 3% | 0% | +3pp |
| pawn-charge | 3% | 0% | +3pp |
| knight-hop | 3% | 0% | +3pp |
| phase-step | 3% | 4% | -1pp |
| surge | 3% | 0% | +3pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| d2 → h2 | 41 | 54% | rank-2 sidestep; 2 attackers on h2 |
| d2 → b2 | 19 | 0% | rank-2 sidestep |
| d2 → d1 | 12 | 0% | climb file d +-1 |
| a1 → d1 | 6 | 50% | rank-1 sidestep |
| c1 → d1 | 5 | 0% | rank-1 sidestep |
| c1 → h1 | 4 | 50% | rank-1 sidestep |
| a1 → f1 | 3 | 0% | rank-1 sidestep |
| c1 → c3 | 2 | 0% | climb file c +2 |

## T5

**26 wins / 74 losses** (26% win rate over 100 trials)

Mean moves in wins: 11.5
Mean moves in losses: 6.8

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| c1 | 78 | 24% | safe (no current attackers); no immediate open files from rank 1 |
| b1 | 22 | 32% | safe (no current attackers); no immediate open files from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| aegis | 23% | 0% | +23pp |
| pawn-charge | 4% | 0% | +4pp |
| freeze-ray | 4% | 0% | +4pp |
| knight-hop | 4% | 1% | +2pp |
| queen-pulse | 4% | 0% | +4pp |
| bishop-step | 0% | 4% | -4pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| c1 → d1 | 25 | 16% | rank-1 sidestep |
| c1 → h1 | 19 | 21% | rank-1 sidestep |
| c1 → b1 | 16 | 38% | rank-1 sidestep |
| c1 → g1 | 14 | 36% | rank-1 sidestep |
| b1 → h1 | 13 | 31% | rank-1 sidestep |
| b1 → d1 | 6 | 50% | rank-1 sidestep |
| c1 → c2 | 4 | 0% | climb file c +1; 2 attackers on c2 |
| b1 → f1 | 3 | 0% | rank-1 sidestep |

## How to read this

- A first move with high "Win rate" relative to total = a good opening on this level. If 80% of trials starting with c1 won but only 20% starting with f1 won, that's a strong directional signal.
- "Lift" = ability use share in wins minus losses. Positive lift = winners used it more = the ability mattered.
- Top 2-move openings reveal whether wins cluster around a few approaches or are spread out. Concentrated openings mean there's a "right way" to play; spread means many paths work.