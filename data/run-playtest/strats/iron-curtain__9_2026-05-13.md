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

Mean moves in wins: 8.0
Mean moves in losses: 4.0

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| h1 | 51 | 0% | safe (no current attackers); no open files reachable from rank 1 |
| f1 | 19 | 5% | safe (no current attackers); no open files reachable from rank 1 |
| g1 | 16 | 6% | safe (no current attackers); no open files reachable from rank 1 |
| b1 | 14 | 0% | safe (no current attackers); no open files reachable from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| knight-hop | 50% | 2% | +48pp |
| bishop-step | 0% | 2% | -2pp |
| queen-pulse | 0% | 1% | -1pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| h1 → b1 | 37 | 0% | rank-1 sidestep |
| g1 → b1 | 9 | 0% | rank-1 sidestep |
| f1 → b1 | 9 | 0% | rank-1 sidestep |
| f1 → h1 | 8 | 13% | rank-1 sidestep |
| h1 → d1 | 6 | 0% | rank-1 sidestep |
| b1 → h1 | 6 | 0% | rank-1 sidestep |
| b1 → f1 | 4 | 0% | rank-1 sidestep |
| h1 → g1 | 4 | 0% | rank-1 sidestep |

## T4

**15 wins / 85 losses** (15% win rate over 100 trials)

Mean moves in wins: 12.1
Mean moves in losses: 5.7

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| d2 | 73 | 14% | safe (no current attackers); no open files reachable from rank 2 |
| c1 | 15 | 7% | safe (no current attackers); no open files reachable from rank 1 |
| a1 | 9 | 44% | safe (no current attackers); no open files reachable from rank 1 |
| f1 | 1 | 0% | safe (no current attackers); no open files reachable from rank 1 |
| h1 | 1 | 0% | safe (no current attackers); no open files reachable from rank 1 |
| g1 | 1 | 0% | safe (no current attackers); no open files reachable from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| aegis | 27% | 0% | +27pp |
| bishop-step | 13% | 1% | +12pp |
| phase-step | 0% | 1% | -1pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| d2 → h2 | 32 | 31% | rank-2 sidestep; 2 attackers on h2 |
| d2 → b2 | 29 | 0% | rank-2 sidestep |
| d2 → d1 | 12 | 0% | climb file d +-1 |
| c1 → d1 | 10 | 10% | rank-1 sidestep |
| a1 → f1 | 3 | 0% | rank-1 sidestep |
| a1 → b1 | 2 | 0% | rank-1 sidestep |
| a1 → a2 | 2 | 100% | climb file a +1; 2 attackers on a2 |
| c1 → c2 | 2 | 0% | climb file c +1; 2 attackers on c2 |

## T5

**20 wins / 80 losses** (20% win rate over 100 trials)

Mean moves in wins: 9.6
Mean moves in losses: 6.7

### Most common first moves

| First square | Total | Win rate | Why |
|---|---:|---:|---|
| c1 | 85 | 20% | safe (no current attackers); no open files reachable from rank 1 |
| b1 | 15 | 20% | safe (no current attackers); no open files reachable from rank 1 |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| aegis | 5% | 0% | +5pp |
| surge | 5% | 0% | +5pp |
| pawn-charge | 5% | 0% | +5pp |
| knight-hop | 0% | 3% | -3pp |
| bishop-step | 0% | 1% | -1pp |

### Top 2-move openings

| Sequence | Times | Win rate | Why |
|---|---:|---:|---|
| c1 → g1 | 27 | 37% | rank-1 sidestep |
| c1 → d1 | 26 | 23% | rank-1 sidestep |
| c1 → b1 | 17 | 6% | rank-1 sidestep |
| b1 → h1 | 8 | 25% | rank-1 sidestep |
| c1 → h1 | 8 | 0% | rank-1 sidestep |
| c1 → c2 | 6 | 0% | climb file c +1; 2 attackers on c2 |
| b1 → d1 | 4 | 25% | rank-1 sidestep |
| b1 → f1 | 3 | 0% | rank-1 sidestep |

## How to read this

- A first move with high "Win rate" relative to total = a good opening on this level. If 80% of trials starting with c1 won but only 20% starting with f1 won, that's a strong directional signal.
- "Lift" = ability use share in wins minus losses. Positive lift = winners used it more = the ability mattered.
- Top 2-move openings reveal whether wins cluster around a few approaches or are spread out. Concentrated openings mean there's a "right way" to play; spread means many paths work.