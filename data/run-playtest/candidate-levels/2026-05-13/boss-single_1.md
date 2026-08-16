# Boss Single — variant 1

**Archetype:** Boss Single (id: `boss-single`)
**Variant:** 1 / 5
**Sequential index:** 46
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

1 queen at d7/d8 + 4-5 supporting pieces. Strategic hazards on queen file. Climax level template.

## Board diagram

```
8 | . . . . q . . .
7 | . . . . . . . .
6 | . p p . . p n .
5 | b . . p p . . .
4 | . . . . . . . .
3 | p p p p . p p p
2 | . . . . # . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.4 | 2.45 | — |
| T4 | 20 | 100.0% | 5.5 | 1.25 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  bishop(1, 5), pawn(4, 5), pawn(5, 5),
  pawn(2, 6), pawn(3, 6), pawn(6, 6), knight(7, 6),
  queen(5, 8),
  ],
    { hazards: [{ file: 5, rank: 2 }], moveLimit: 19, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 15
- hazards: 1
- moveLimit: 19
- allowedForms: knight, bishop
- enemiesPerTurn: 1
