# Queen Shielded — variant 1

**Archetype:** Queen Shielded (id: `queen-shielded`)
**Variant:** 1 / 5
**Sequential index:** 6
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Queens behind pawn shields. Capturing the shield exposes Rookie to the queen sightline. Knight transform required to leap.

## Board diagram

```
8 | . . . . . . . .
7 | . . p . p . . .
6 | . . . p . p . .
5 | . . . q . . . .
4 | . . . p p . . .
3 | p p p p . p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 3.8 | 1.00 | — |
| T4 | 20 | 100.0% | 6.3 | 1.35 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(4, 4), pawn(5, 4),
  queen(4, 5),
  pawn(4, 6), pawn(6, 6),
  pawn(3, 7), pawn(5, 7),
  ],
    { moveLimit: 19, allowedForms: ['knight'] },
)
```

## Parameters

- pieces: 14
- hazards: 0
- moveLimit: 19
- allowedForms: knight
- enemiesPerTurn: 1
