# Queen Shielded — variant 4

**Archetype:** Queen Shielded (id: `queen-shielded`)
**Variant:** 4 / 5
**Sequential index:** 9
**Fun-hard score:** **60.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 95.0%  
**T4 win rate:** 100.0%

## Design intent

Queens behind pawn shields. Capturing the shield exposes Rookie to the queen sightline. Knight transform required to leap.

## Board diagram

```
8 | . . . . . . . .
7 | . . p . . . . .
6 | . . . p . p . .
5 | . . . q p . . .
4 | . . . p . . q .
3 | p p p . p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 95.0% | 7.3 | 1.80 | move-limit:1 |
| T4 | 20 | 100.0% | 6.2 | 1.40 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(4, 4), queen(7, 4),
  queen(4, 5), pawn(5, 5),
  pawn(4, 6), pawn(6, 6),
  pawn(3, 7),
  ],
    { moveLimit: 17, allowedForms: ['knight'] },
)
```

## Parameters

- pieces: 14
- hazards: 0
- moveLimit: 17
- allowedForms: knight
- enemiesPerTurn: 1
