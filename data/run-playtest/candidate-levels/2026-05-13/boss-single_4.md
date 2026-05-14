# Boss Single — variant 4

**Archetype:** Boss Single (id: `boss-single`)
**Variant:** 4 / 5
**Sequential index:** 49
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

1 queen at d7/d8 + 4-5 supporting pieces. Strategic hazards on queen file. Climax level template.

## Board diagram

```
8 | . . . . q . . .
7 | . . . . p . . .
6 | . b . p . . . .
5 | n . b . . p . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 6.7 | 3.00 | — |
| T4 | 20 | 100.0% | 6.0 | 2.40 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(1, 5), bishop(3, 5), pawn(6, 5),
  bishop(2, 6), pawn(4, 6),
  pawn(5, 7),
  queen(5, 8),
  ],
    { moveLimit: 22, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 15
- hazards: 0
- moveLimit: 22
- allowedForms: knight, bishop
- enemiesPerTurn: 1
