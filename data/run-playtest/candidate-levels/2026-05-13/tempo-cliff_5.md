# Tempo Cliff — variant 5

**Archetype:** Tempo Cliff (id: `tempo-cliff`)
**Variant:** 5 / 5
**Sequential index:** 35
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Tight move limit (~10-13). Modest piece count. Forces straight-line speed; can't pause for captures.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . . . . .
6 | . . p . . . . .
5 | . p . p n . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 5.6 | 2.25 | — |
| T4 | 20 | 100.0% | 6.3 | 1.40 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  pawn(2, 5), pawn(4, 5), knight(5, 5),
  pawn(3, 6),
  ],
    { moveLimit: 9, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 12
- hazards: 0
- moveLimit: 9
- allowedForms: knight, bishop
- enemiesPerTurn: 1
