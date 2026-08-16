# Multi-Threat — variant 3

**Archetype:** Multi-Threat (id: `multi-threat`)
**Variant:** 3 / 5
**Sequential index:** 38
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

2 knights + 1 bishop + 4 pawns + 1 queen. Boss-density without the boss-queen drama. Forces multi-piece awareness.

## Board diagram

```
8 | . . . . . . . .
7 | . . . q . . . .
6 | . . . . . b . .
5 | . . n . p . n .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.9 | 1.30 | — |
| T4 | 20 | 100.0% | 5.0 | 1.20 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(3, 5), pawn(5, 5), knight(7, 5),
  bishop(6, 6),
  queen(4, 7),
  ],
    { moveLimit: 17, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 13
- hazards: 0
- moveLimit: 17
- allowedForms: knight, bishop
- enemiesPerTurn: 1
