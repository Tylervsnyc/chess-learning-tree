# Strategy Discovery — iron-curtain/9

Each tier played the level multiple times with seed-varied bots. We compare what winners did vs losers to surface winning patterns.

## T3

**2 wins / 98 losses** (2% win rate over 100 trials)

Mean moves in wins: 8.5
Mean moves in losses: 3.9

### Most common first moves

| First square | Total | Win rate |
|---|---:|---:|
| h1 | 51 | 2% |
| f1 | 19 | 0% |
| g1 | 16 | 0% |
| b1 | 14 | 7% |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| knight-hop | 0% | 4% | -4pp |
| bishop-step | 0% | 1% | -1pp |

### Top 2-move openings

| Sequence | Times played | Win rate |
|---|---:|---:|
| h1 → b1 | 39 | 0% |
| f1 → b1 | 11 | 0% |
| g1 → b1 | 9 | 0% |
| f1 → h1 | 8 | 0% |
| b1 → h1 | 7 | 14% |
| g1 → h1 | 5 | 0% |
| b1 → f1 | 5 | 0% |
| h1 → h2 | 5 | 20% |

## T4

**19 wins / 81 losses** (19% win rate over 100 trials)

Mean moves in wins: 11.4
Mean moves in losses: 6.2

### Most common first moves

| First square | Total | Win rate |
|---|---:|---:|
| d2 | 72 | 17% |
| c1 | 13 | 23% |
| a1 | 9 | 11% |
| b1 | 3 | 33% |
| e1 | 1 | 100% |
| f1 | 1 | 100% |
| h1 | 1 | 0% |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| aegis | 11% | 0% | +11pp |
| pawn-charge | 5% | 1% | +4pp |
| phase-step | 5% | 1% | +4pp |
| bishop-step | 5% | 0% | +5pp |
| knight-hop | 5% | 1% | +4pp |
| freeze-ray | 0% | 2% | -2pp |
| queen-pulse | 0% | 1% | -1pp |

### Top 2-move openings

| Sequence | Times played | Win rate |
|---|---:|---:|
| d2 → h2 | 39 | 31% |
| d2 → d1 | 17 | 0% |
| d2 → b2 | 16 | 0% |
| c1 → d1 | 5 | 0% |
| c1 → h1 | 3 | 67% |
| c1 → g1 | 3 | 33% |
| a1 → d1 | 3 | 33% |
| b1 → d1 | 2 | 0% |

## T5

**24 wins / 76 losses** (24% win rate over 100 trials)

Mean moves in wins: 11.1
Mean moves in losses: 6.9

### Most common first moves

| First square | Total | Win rate |
|---|---:|---:|
| c1 | 79 | 24% |
| b1 | 21 | 24% |

### Ability use: winners vs losers

| Ability | Share of wins using it | Share of losses using it | Lift |
|---|---:|---:|---:|
| queen-pulse | 8% | 1% | +7pp |
| aegis | 8% | 0% | +8pp |
| knight-hop | 8% | 5% | +3pp |
| phase-step | 4% | 0% | +4pp |
| bishop-step | 0% | 5% | -5pp |

### Top 2-move openings

| Sequence | Times played | Win rate |
|---|---:|---:|
| c1 → d1 | 30 | 27% |
| c1 → g1 | 18 | 28% |
| c1 → h1 | 16 | 25% |
| b1 → d1 | 9 | 22% |
| c1 → b1 | 9 | 22% |
| b1 → h1 | 8 | 38% |
| c1 → c2 | 6 | 0% |
| b1 → f1 | 4 | 0% |

## How to read this

- A first move with high "Win rate" relative to total = a good opening on this level. If 80% of trials starting with c1 won but only 20% starting with f1 won, that's a strong directional signal.
- "Lift" = ability use share in wins minus losses. Positive lift = winners used it more = the ability mattered.
- Top 2-move openings reveal whether wins cluster around a few approaches or are spread out. Concentrated openings mean there's a "right way" to play; spread means many paths work.