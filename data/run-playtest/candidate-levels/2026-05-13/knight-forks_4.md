# Knight Forks — variant 4

**Archetype:** Knight Forks (id: `knight-forks`)
**Variant:** 4 / 5
**Sequential index:** 14
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Enemy knights cover overlapping L-jumps. Rookie can transform to knight and fight back. Optional hazard blocks a fork square.

## Board diagram

```
8 | . . . . . . . .
7 | . . . p . . p .
6 | . . . . n . . .
5 | . n n . . . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 4.3 | 1.65 | — |
| T4 | 20 | 100.0% | 4.9 | 1.15 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(2, 5), knight(3, 5),
  knight(5, 6),
  pawn(4, 7), pawn(7, 7),
  ],
    { moveLimit: 16, allowedForms: ['knight'] },
)
```

## Parameters

- pieces: 13
- hazards: 0
- moveLimit: 16
- allowedForms: knight
- enemiesPerTurn: 1
