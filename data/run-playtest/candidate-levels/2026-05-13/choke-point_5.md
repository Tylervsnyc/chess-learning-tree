# Choke Point — variant 5

**Archetype:** Choke Point (id: `choke-point`)
**Variant:** 5 / 5
**Sequential index:** 30
**Fun-hard score:** **90.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 20.0%  
**T4 win rate:** 90.0%

## Design intent

Heavy rank-4/5 wall except for 1-2 safe files. Thread the needle. Knight/bishop transforms help when the corridor is too narrow.

## Board diagram

```
8 | . . . . . . . .
7 | . . p p . . . .
6 | . p . . p . . .
5 | p . . p . b . p
4 | . . p . p . n .
3 | p p . p . p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 20.0% | 12.0 | 2.35 | captured:11, move-limit:5 |
| T4 | 20 | 90.0% | 14.9 | 4.80 | move-limit:1, captured:1 |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(3, 4), pawn(5, 4), knight(7, 4),
  pawn(1, 5), pawn(4, 5), bishop(6, 5), pawn(8, 5),
  pawn(2, 6), pawn(5, 6),
  pawn(3, 7), pawn(4, 7),
  ],
    { moveLimit: 19, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 17
- hazards: 0
- moveLimit: 19
- allowedForms: knight, bishop
- enemiesPerTurn: 1
