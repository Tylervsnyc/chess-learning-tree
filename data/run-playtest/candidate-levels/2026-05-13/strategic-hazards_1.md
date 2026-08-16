# Strategic Hazards — variant 1

**Archetype:** Strategic Hazards (id: `strategic-hazards`)
**Variant:** 1 / 5
**Sequential index:** 21
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

4 hazards placed to block specific enemy attack lines (iron-curtain/7 template). Hazards make the level EASIER by walling off threats.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . . . . .
6 | . p p . p . . .
5 | . . . q . . . .
4 | # . . # . . . #
3 | p p p . p p p .
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.5 | 1.65 | — |
| T4 | 20 | 100.0% | 8.6 | 1.75 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3),
  queen(4, 5),
  pawn(2, 6), pawn(3, 6), pawn(5, 6),
  ],
    { hazards: [{ file: 4, rank: 4 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 17, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 10
- hazards: 3
- moveLimit: 17
- allowedForms: knight, bishop
- enemiesPerTurn: 1
