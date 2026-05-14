# Open Approach — variant 1

**Archetype:** Open Approach (id: `open-approach`)
**Variant:** 1 / 5
**Sequential index:** 41
**Fun-hard score:** **85.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 70.0%  
**T4 win rate:** 100.0%

## Design intent

Sparse rank 2-3, dense rank 5-7. Free run forward then a hard wall to crack. Tests pacing.

## Board diagram

```
8 | . . . . . . . .
7 | . . . p . p . .
6 | . n p . n p . .
5 | p p p p p . p .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 70.0% | 6.9 | 2.75 | captured:6 |
| T4 | 20 | 100.0% | 8.8 | 3.00 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(1, 5), pawn(2, 5), pawn(3, 5), pawn(4, 5), pawn(5, 5), pawn(7, 5),
  knight(2, 6), pawn(3, 6), knight(5, 6), pawn(6, 6),
  pawn(4, 7), pawn(6, 7),
  ],
    { moveLimit: 16, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 20
- hazards: 0
- moveLimit: 16
- allowedForms: knight, bishop
- enemiesPerTurn: 1
