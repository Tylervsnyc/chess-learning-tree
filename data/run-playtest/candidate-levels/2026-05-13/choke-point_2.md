# Choke Point — variant 2

**Archetype:** Choke Point (id: `choke-point`)
**Variant:** 2 / 5
**Sequential index:** 27
**Fun-hard score:** **70.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 85.0%  
**T4 win rate:** 90.0%

## Design intent

Heavy rank-4/5 wall except for 1-2 safe files. Thread the needle. Knight/bishop transforms help when the corridor is too narrow.

## Board diagram

```
8 | . . . . . . . .
7 | . . p . p . . .
6 | . p . . . p . .
5 | b . . p . . . .
4 | . p . . p p . b
3 | p . p p . . p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 85.0% | 9.4 | 2.95 | captured:3 |
| T4 | 20 | 90.0% | 7.8 | 2.30 | captured:2 |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(7, 3), pawn(8, 3),
  pawn(2, 4), pawn(5, 4), pawn(6, 4), bishop(8, 4),
  bishop(1, 5), pawn(4, 5),
  pawn(2, 6), pawn(6, 6),
  pawn(3, 7), pawn(5, 7),
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
