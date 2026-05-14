# Bishop Cross — variant 1

**Archetype:** Bishop Cross (id: `bishop-cross`)
**Variant:** 1 / 5
**Sequential index:** 16
**Fun-hard score:** **60.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 95.0%  
**T4 win rate:** 100.0%

## Design intent

Overlapping bishop diagonals. Stay colour-aware. Bishop transform lets Rookie counter on her own diagonals.

## Board diagram

```
8 | . . . . . . . .
7 | . b p . . b . .
6 | . . . . . . b .
5 | p p . p p . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 95.0% | 4.3 | 1.55 | captured:1 |
| T4 | 20 | 100.0% | 5.2 | 1.85 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(1, 5), pawn(2, 5), pawn(4, 5), pawn(5, 5),
  bishop(7, 6),
  bishop(2, 7), pawn(3, 7), bishop(6, 7),
  ],
    { moveLimit: 18, allowedForms: ['bishop'] },
)
```

## Parameters

- pieces: 16
- hazards: 0
- moveLimit: 18
- allowedForms: bishop
- enemiesPerTurn: 1
