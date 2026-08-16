# Tempo Cliff — variant 1

**Archetype:** Tempo Cliff (id: `tempo-cliff`)
**Variant:** 1 / 5
**Sequential index:** 31
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Tight move limit (~10-13). Modest piece count. Forces straight-line speed; can't pause for captures.

## Board diagram

```
8 | . . . . . . . .
7 | . . . p p . . .
6 | . p . . . . n .
5 | . . n . . . . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 4.4 | 1.75 | — |
| T4 | 20 | 100.0% | 6.3 | 1.35 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(3, 5),
  pawn(2, 6), knight(7, 6),
  pawn(4, 7), pawn(5, 7),
  ],
    { moveLimit: 11, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 13
- hazards: 0
- moveLimit: 11
- allowedForms: knight, bishop
- enemiesPerTurn: 1
