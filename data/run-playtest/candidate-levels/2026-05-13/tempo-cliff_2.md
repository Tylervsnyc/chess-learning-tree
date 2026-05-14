# Tempo Cliff — variant 2

**Archetype:** Tempo Cliff (id: `tempo-cliff`)
**Variant:** 2 / 5
**Sequential index:** 32
**Fun-hard score:** **55.0** (target T3 30–55%, T4 70%+)
**T3 win rate:** 100.0%  
**T4 win rate:** 100.0%

## Design intent

Tight move limit (~10-13). Modest piece count. Forces straight-line speed; can't pause for captures.

## Board diagram

```
8 | . . . . . . . .
7 | . . . . . . . .
6 | . . . . b . . .
5 | . . n p . n . .
4 | . . . . . . . .
3 | p p p p p p p p
2 | . . . . . . . .
1 | . . . R . . . .
    a b c d e f g h
```

## Stats

| Tier | Trials | Win rate | Mean moves | Mean captures | Top fail modes |
|---|---:|---:|---:|---:|---|
| T3 | 20 | 100.0% | 4.4 | 1.20 | — |
| T4 | 20 | 100.0% | 5.5 | 1.40 | — |

## Level definition (paste into runs.ts)

```ts
make(
  <LEVEL_NUMBER>,
  [
  pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
  knight(3, 5), pawn(4, 5), knight(6, 5),
  bishop(5, 6),
  ],
    { moveLimit: 8, allowedForms: ['knight', 'bishop'] },
)
```

## Parameters

- pieces: 12
- hazards: 0
- moveLimit: 8
- allowedForms: knight, bishop
- enemiesPerTurn: 1
