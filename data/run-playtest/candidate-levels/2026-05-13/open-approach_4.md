# Open Approach — variant 4

**Archetype:** Open Approach (id: `open-approach`)
**Variant:** 4 / 5
**Sequential index:** 44
**Fun-hard score:** **100.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 55.0%  
**T4 win rate:** 100.0%

## Design intent

Sparse rank 2-3, dense rank 5-7. Free run forward then a hard wall to crack. Tests pacing.

## Board diagram

```
8 | . . . . . . . .
7 | . . p . . . . .
6 | . p . p . . n .
5 | p p . . p p p p
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 55.0% | 7.8 | 2.65 | captured:8, move-limit:1 |
| T4 | 20 | 100.0% | 8.0 | 3.50 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(1, 5), pawn(2, 5), pawn(5, 5), pawn(6, 5), pawn(7, 5), pawn(8, 5),
  pawn(2, 6), pawn(4, 6), knight(7, 6),
  pawn(3, 7),
  ],
    { moveLimit: 16, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 18
- hazards: 0
- moveLimit: 16
- allowedForms: knight, bishop
- enemiesPerTurn: 1
