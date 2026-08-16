# Strategic Hazards — variant 2

**Archetype:** Strategic Hazards (id: `strategic-hazards`)
**Variant:** 2 / 5
**Sequential index:** 22
**Fun-hard score:** **100.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 55.0%  
**T4 win rate:** 100.0%

## Design intent

4 hazards placed to block specific enemy attack lines (iron-curtain/7 template). Hazards make the level EASIER by walling off threats.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . . . . .
6 | . . p p p . p .
5 | # b . . . q . .
4 | . # . . . # . #
3 | p p p p p p p .
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 55.0% | 13.1 | 3.10 | move-limit:7, dead-end:1, captured:1 |
| T4 | 20 | 100.0% | 9.2 | 3.25 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3),
  bishop(2, 5), queen(6, 5),
  pawn(3, 6), pawn(4, 6), pawn(5, 6), pawn(7, 6),
  ],
    { hazards: [{ file: 2, rank: 4 }, { file: 6, rank: 4 }, { file: 1, rank: 5 }, { file: 8, rank: 4 }], moveLimit: 17, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 13
- hazards: 4
- moveLimit: 17
- allowedForms: knight, bishop
- enemiesPerTurn: 1
