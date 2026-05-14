# Strategic Hazards — variant 4

**Archetype:** Strategic Hazards (id: `strategic-hazards`)
**Variant:** 4 / 5
**Sequential index:** 24
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

4 hazards placed to block specific enemy attack lines (iron-curtain/7 template). Hazards make the level EASIER by walling off threats.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . p . . .
6 | . . p p . . . .
5 | # . q . . . . #
4 | . . # . . . . .
3 | p p . p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 4.1 | 1.20 | — |
| T4 | 20 | 100.0% | 3.0 | 2.00 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  queen(3, 5),
  pawn(3, 6), pawn(4, 6),
  pawn(5, 7),
  ],
    { hazards: [{ file: 3, rank: 4 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 17, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 11
- hazards: 3
- moveLimit: 17
- allowedForms: knight, bishop
- enemiesPerTurn: 1
