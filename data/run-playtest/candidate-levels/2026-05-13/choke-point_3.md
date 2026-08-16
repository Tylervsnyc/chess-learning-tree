# Choke Point — variant 3

**Archetype:** Choke Point (id: `choke-point`)
**Variant:** 3 / 5
**Sequential index:** 28
**Fun-hard score:** **60.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 95.0%  
**T4 win rate:** 100.0%

## Design intent

Heavy rank-4/5 wall except for 1-2 safe files. Thread the needle. Knight/bishop transforms help when the corridor is too narrow.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . . . p .
6 | p . p . . . . .
5 | p p . p p p n n
4 | . . . n . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 95.0% | 8.8 | 2.90 | captured:1 |
| T4 | 20 | 100.0% | 10.6 | 4.65 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(4, 4),
  pawn(1, 5), pawn(2, 5), pawn(4, 5), pawn(5, 5), pawn(6, 5), knight(7, 5), knight(8, 5),
  pawn(1, 6), pawn(3, 6),
  pawn(7, 7),
  ],
    { moveLimit: 18, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 19
- hazards: 0
- moveLimit: 18
- allowedForms: knight, bishop
- enemiesPerTurn: 1
