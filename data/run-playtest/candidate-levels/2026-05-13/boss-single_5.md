# Boss Single — variant 5

**Archetype:** Boss Single (id: `boss-single`)
**Variant:** 5 / 5
**Sequential index:** 50
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

1 queen at d7/d8 + 4-5 supporting pieces. Strategic hazards on queen file. Climax level template.

## Board diagram

```
8 | . . . . q . . .
7 | . . . . . . . .
6 | . . p p . p . p
5 | . n . . p . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 6.3 | 2.85 | — |
| T4 | 20 | 100.0% | 8.0 | 2.85 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(2, 5), pawn(5, 5),
  pawn(3, 6), pawn(4, 6), pawn(6, 6), pawn(8, 6),
  queen(5, 8),
  ],
    { moveLimit: 18, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 15
- hazards: 0
- moveLimit: 18
- allowedForms: knight, bishop
- enemiesPerTurn: 1
