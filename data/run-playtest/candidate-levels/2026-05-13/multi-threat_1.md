# Multi-Threat — variant 1

**Archetype:** Multi-Threat (id: `multi-threat`)
**Variant:** 1 / 5
**Sequential index:** 36
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

2 knights + 1 bishop + 4 pawns + 1 queen. Boss-density without the boss-queen drama. Forces multi-piece awareness.

## Board diagram

```
8 | . . . . . . . .
7 | . . q . . . . .
6 | . . . p b . . .
5 | . n n . . . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.3 | 1.90 | — |
| T4 | 20 | 100.0% | 4.0 | 1.00 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(2, 5), knight(3, 5),
  pawn(4, 6), bishop(5, 6),
  queen(3, 7),
  ],
    { moveLimit: 18, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 13
- hazards: 0
- moveLimit: 18
- allowedForms: knight, bishop
- enemiesPerTurn: 1
