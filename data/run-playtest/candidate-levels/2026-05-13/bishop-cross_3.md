# Bishop Cross — variant 3

**Archetype:** Bishop Cross (id: `bishop-cross`)
**Variant:** 3 / 5
**Sequential index:** 18
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Overlapping bishop diagonals. Stay colour-aware. Bishop transform lets Rookie counter on her own diagonals.

## Board diagram

```
8 | . . . . . . . .
7 | . b b . p . . .
6 | . . . . . . . .
5 | . . . p . . p p
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.2 | 2.05 | — |
| T4 | 20 | 100.0% | 6.5 | 2.00 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(4, 5), pawn(7, 5), pawn(8, 5),
  bishop(2, 7), bishop(3, 7), pawn(5, 7),
  ],
    { moveLimit: 18, allowedForms: ['bishop'] },
)
```

## Parameters

- pieces: 14
- hazards: 0
- moveLimit: 18
- allowedForms: bishop
- enemiesPerTurn: 1
