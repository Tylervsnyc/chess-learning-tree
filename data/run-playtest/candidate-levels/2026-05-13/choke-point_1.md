# Choke Point — variant 1

**Archetype:** Choke Point (id: `choke-point`)
**Variant:** 1 / 5
**Sequential index:** 26
**Fun-hard score:** **65.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 90.0%  
**T4 win rate:** 100.0%

## Design intent

Heavy rank-4/5 wall except for 1-2 safe files. Thread the needle. Knight/bishop transforms help when the corridor is too narrow.

## Board diagram

```
8 | . . . . . . . .
7 | . . . p p . . .
6 | . p p . . p p .
5 | b . . . . . b .
4 | . p p . . p . p
3 | p . . p p . p .
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 90.0% | 9.1 | 2.80 | captured:2 |
| T4 | 20 | 100.0% | 10.1 | 3.25 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
  pawn(2, 4), pawn(3, 4), pawn(6, 4), pawn(8, 4),
  bishop(1, 5), bishop(7, 5),
  pawn(2, 6), pawn(3, 6), pawn(6, 6), pawn(7, 6),
  pawn(4, 7), pawn(5, 7),
  ],
    { moveLimit: 17, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 16
- hazards: 0
- moveLimit: 17
- allowedForms: knight, bishop
- enemiesPerTurn: 1
