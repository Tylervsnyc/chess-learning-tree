# Choke Point — variant 4

**Archetype:** Choke Point (id: `choke-point`)
**Variant:** 4 / 5
**Sequential index:** 29
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Heavy rank-4/5 wall except for 1-2 safe files. Thread the needle. Knight/bishop transforms help when the corridor is too narrow.

## Board diagram

```
8 | . . . . . . . .
7 | . p . p p . . .
6 | . . p . . . . .
5 | . . . . . b p b
4 | p p . b . . . .
3 | . . p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 8.1 | 2.30 | — |
| T4 | 20 | 100.0% | 6.9 | 2.05 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(1, 4), pawn(2, 4), bishop(4, 4),
  bishop(6, 5), pawn(7, 5), bishop(8, 5),
  pawn(3, 6),
  pawn(2, 7), pawn(4, 7), pawn(5, 7),
  ],
    { moveLimit: 19, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 16
- hazards: 0
- moveLimit: 19
- allowedForms: knight, bishop
- enemiesPerTurn: 1
