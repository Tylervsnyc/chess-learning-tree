# Pawn Wall — variant 5

**Archetype:** Pawn Wall (id: `pawn-wall`)
**Variant:** 5 / 5
**Sequential index:** 5
**Fun-hard score:** **60.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 95.0%  
**T4 win rate:** 100.0%

## Design intent

Layered pawn rows on ranks 3, 5, 6. Capture an outer pawn to open the file behind it. Tests "defended-chain" awareness.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . b . . .
6 | . p . p . p . .
5 | p p p . . p . p
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 95.0% | 5.0 | 2.25 | move-limit:1 |
| T4 | 20 | 100.0% | 7.2 | 1.55 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(1, 5), pawn(2, 5), pawn(3, 5), pawn(6, 5), pawn(8, 5),
  pawn(2, 6), pawn(4, 6), pawn(6, 6),
  bishop(5, 7),
  ],
    { moveLimit: 17 },
)
```

## Parameters

- pieces: 17
- hazards: 0
- moveLimit: 17
- allowedForms: rook only
- enemiesPerTurn: 1
