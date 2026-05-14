# Open Approach — variant 3

**Archetype:** Open Approach (id: `open-approach`)
**Variant:** 3 / 5
**Sequential index:** 43
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Sparse rank 2-3, dense rank 5-7. Free run forward then a hard wall to crack. Tests pacing.

## Board diagram

```
8 | . . . . . . . .
7 | . . . p p . . .
6 | . p b p . . p .
5 | . p p . p p . p
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.8 | 1.45 | — |
| T4 | 20 | 100.0% | 7.5 | 2.60 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(2, 5), pawn(3, 5), pawn(5, 5), pawn(6, 5), pawn(8, 5),
  pawn(2, 6), bishop(3, 6), pawn(4, 6), pawn(7, 6),
  pawn(4, 7), pawn(5, 7),
  ],
    { moveLimit: 15, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 19
- hazards: 0
- moveLimit: 15
- allowedForms: knight, bishop
- enemiesPerTurn: 1
