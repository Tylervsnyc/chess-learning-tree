# Boss Single — variant 2

**Archetype:** Boss Single (id: `boss-single`)
**Variant:** 2 / 5
**Sequential index:** 47
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

1 queen at d7/d8 + 4-5 supporting pieces. Strategic hazards on queen file. Climax level template.

## Board diagram

```
8 | . . . . q . . .
7 | . . . . p . . .
6 | . n p n . . p .
5 | . . . . . . . .
4 | . . . . # . . .
3 | p p p p . p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 3.0 | 2.00 | — |
| T4 | 20 | 100.0% | 3.9 | 1.40 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(2, 6), pawn(3, 6), knight(4, 6), pawn(7, 6),
  pawn(5, 7),
  queen(5, 8),
  ],
    { hazards: [{ file: 5, rank: 4 }], moveLimit: 18, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 13
- hazards: 1
- moveLimit: 18
- allowedForms: knight, bishop
- enemiesPerTurn: 1
