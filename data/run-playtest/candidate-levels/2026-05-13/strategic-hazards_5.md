# Strategic Hazards — variant 5

**Archetype:** Strategic Hazards (id: `strategic-hazards`)
**Variant:** 5 / 5
**Sequential index:** 25
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

4 hazards placed to block specific enemy attack lines (iron-curtain/7 template). Hazards make the level EASIER by walling off threats.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . . . . .
6 | . . p . p p . .
5 | # . . p . . . #
4 | . . . q . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.0 | 1.15 | — |
| T4 | 20 | 100.0% | 5.7 | 1.05 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  queen(4, 4),
  pawn(4, 5),
  pawn(3, 6), pawn(5, 6), pawn(6, 6),
  ],
    { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 19, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 13
- hazards: 2
- moveLimit: 19
- allowedForms: knight, bishop
- enemiesPerTurn: 1
