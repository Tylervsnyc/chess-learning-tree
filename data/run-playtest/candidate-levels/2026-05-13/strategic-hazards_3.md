# Strategic Hazards — variant 3

**Archetype:** Strategic Hazards (id: `strategic-hazards`)
**Variant:** 3 / 5
**Sequential index:** 23
**Fun-hard score:** **60.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 95.0%  
**T4 win rate:** 100.0%

## Design intent

4 hazards placed to block specific enemy attack lines (iron-curtain/7 template). Hazards make the level EASIER by walling off threats.

## Board diagram

```
8 | . . . . . . . .
7 | . . p . p . . .
6 | . . . p . p . .
5 | . q . . . . . .
4 | # b . . . . . #
3 | . # p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 95.0% | 7.7 | 1.80 | captured:1 |
| T4 | 20 | 100.0% | 6.6 | 1.85 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  bishop(2, 4),
  queen(2, 5),
  pawn(4, 6), pawn(6, 6),
  pawn(3, 7), pawn(5, 7),
  ],
    { hazards: [{ file: 2, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 20, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 12
- hazards: 3
- moveLimit: 20
- allowedForms: knight, bishop
- enemiesPerTurn: 1
