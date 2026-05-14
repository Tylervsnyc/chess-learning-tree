# Boss Single — variant 3

**Archetype:** Boss Single (id: `boss-single`)
**Variant:** 3 / 5
**Sequential index:** 48
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

1 queen at d7/d8 + 4-5 supporting pieces. Strategic hazards on queen file. Climax level template.

## Board diagram

```
8 | . . . . . . . .
7 | . . . q . . . .
6 | . b p . . . p .
5 | n . . . p . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.6 | 1.45 | — |
| T4 | 20 | 100.0% | 3.0 | 1.00 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(1, 5), pawn(5, 5),
  bishop(2, 6), pawn(3, 6), pawn(7, 6),
  queen(4, 7),
  ],
    { moveLimit: 19, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 14
- hazards: 0
- moveLimit: 19
- allowedForms: knight, bishop
- enemiesPerTurn: 1
