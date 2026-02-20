# Opening Lesson Tree Template

> Reference: Tyler's Ruy Lopez tree diagram (Feb 2026)
> Source image: Desktop/Screenshot 2026-02-20 at 5.22.36 PM.png

## Structure

Every opening module follows this pattern:
- **Main Trunk** — follows the most popular line move-by-move (bottom → top)
- **Branch Lessons** — peel off at each decision point to teach alternatives
- **Punish Mistakes** — teach WHY the main line works by showing what happens when opponents deviate
- **Level Test** — sits at the top, gates completion of the module

## Visual System — Two Connection Types

### Lines (no arrowhead) = Trunk Sequence
Plain lines connect the main trunk lessons in order. They show **sequential flow** — you play through these moves in one continuous game. Main 1 → Main 2 → Main 3 → Main 4 are all connected by lines because they're the same game progressing forward.

### Arrows (with arrowhead) = Unlock Dependencies
Arrows point FROM a lesson TO the lesson it unlocks. They show **gating** — "you must complete this before that opens up." Arrows can cross between any nodes, not just adjacent ones.

### Text Inside Each Node = States Its Own Prerequisite
Every lesson note contains its unlock source (e.g., "Unlocked by Lesson 1", "Unlocked by PM1"). This is redundant with the arrows on purpose — the node is self-documenting even without tracing connections.

```
LINES:    Main 1 ── Main 2 ── Main 3 ── Main 4    (trunk flow, same game)
ARROWS:   Main 2 ──→ Exchange Variation 1           (unlock dependency)
TEXT:     "Exchange Variation 1: Unlocked by PM1"    (self-documenting)
```

---

## Ruy Lopez Lvl 1 — Sample Tree

### Main Trunk (connected by LINES — one continuous game)

```
Main 1 (Lesson 1)
  1.e4 e5  2.Nf3 Nc6  3.Bb5
  │
  │  (line)
  │
Main 2 (Lesson 2) — "Unlocked by Lesson 1"
  3...a6  4.Ba4 Nf6  5.O-O
  │
  │  (line)
  │
Main 3 (Lesson 3) — "Unlocked by Lesson 2"
  5...Be7  6.Re1 b5  7.Bb3
  │
  │  (line)
  │
Main 4 (Lesson 4) — "Unlocked by Main 3"
  7...d6  8.c3 O-O  9.h3 Na5  10.Bc2
```

### Branch Lessons (connected by ARROWS — unlock dependencies)

```
Exchange Variation 1 — "Unlocked by PM1"
  ←── (arrow from Punish Mistakes 1)
  4.Bxc6 dxc6  5.O-O f6

Punish Mistakes 2 — "Unlocked by Exchange Variation 1"
  ←── (arrow from Exchange Variation 1)
  What does Black do after 5.Nxe5?

Berlin Defense — "Unlocked by EV 1"
  ←── (arrow from Exchange Variation 1)
  3...Nf6  4.O-O Nxe4  5.Re1 Nd6  6.Bxc6 dxc6  7.dxe5

Punish Mistakes 1 — "Unlocked by Lesson 3"
  ←── (arrow from Main 2)
  1...f6  2.Nxe5 fxe5  3.Qh5+ g6  4.Qxe5+
  Showing the fork winning the rook

Marshall Attack 1 — "Unlocked by BD1"
  ←── (arrow from Berlin Defense 1)
  7...O-O  8.c3 d5!  9.exd5 Nxd5  10.Nxe5 Nxe5  11.Rxe5
```

### Level Test (ARROWS from Main 4 + Marshall Attack)

```
Ruy Lopez Lvl 1 Test
  ←── (arrow from Main 4)
  ←── (arrow from Marshall Attack 1)
  Tests knowledge of: main line, key branches, punishment patterns
```

---

## Unlock Graph

```
                        ┌─────────────────────┐
                        │  Ruy Lopez Lvl 1    │
                        │      Test           │
                        └──▲──────────────▲───┘
                           │(arrow)       │(arrow)
                     ┌─────┘              └──────┐
                     │                           │
               ┌─────┴─────┐            ┌───────┴────────┐
               │  Main 4   │            │ Marshall       │
               │  7...d6   │            │ Attack 1       │
               │  8.c3 O-O │            │ 8.c3 d5!       │
               └─────▲─────┘            └───────▲────────┘
                     │(line)                    │(arrow)
               ┌─────┴──────┐           ┌──────┴─────────┐
               │  Main 3    │           │ Berlin Defense  │
               │  5...Be7   │           │ 3...Nf6        │
               │  6.Re1 b5  │           │ Unlocked by    │
               └─────▲──────┘           │ EV 1           │
                     │(line)            └──────▲─────────┘
                     │                         │(arrow)
               ┌─────┴──────────────────────────┴──────────┐
               │              Main 2                        │
               │  3...a6  4.Ba4 Nf6  5.O-O                │
               │  Unlocked by Lesson 1                      │
               └──▲───┬─────────────────┬──────────────────┘
                  │   │(arrow)          │(arrow)
                  │   ▼                 ▼
                  │  ┌──────────┐  ┌────────────────┐
                  │  │ Exchange │  │ Punish          │
                  │  │ Var 1    │  │ Mistakes 1      │
                  │  │ 4.Bxc6  │  │ 1...f6 2.Nxe5  │
                  │  │ Unlocked │  │ Unlocked by     │
                  │  │ by PM1   │  │ Lesson 3        │
                  │  └──┬───┘  │  └─────────────────┘
                  │     │(arrow)
                  │     ▼
                  │  ┌──────────┐
                  │  │ PM 2     │
                  │  │ After    │
                  │  │ 5.Nxe5? │
                  │  └──────────┘
                  │(line)
            ┌─────┴──────┐
            │  Main 1    │
            │  1.e4 e5   │
            │  2.Nf3 Nc6 │
            │  3.Bb5     │
            │  Lesson 1  │
            └────────────┘
```

---

## Lesson Types

| Type | Purpose | Visual | Example |
|------|---------|--------|---------|
| **Main** | Teach the most popular continuation | Yellow box, connected by LINES | Main 1-4 (the trunk) |
| **Branch** | Teach a sideline/alternative | Yellow box, connected by ARROWS | Exchange Variation, Berlin Defense |
| **Punish Mistakes** | Show WHY deviations fail | Yellow box, connected by ARROWS | Fork winning the rook after 1...f6 |
| **Level Test** | Gate to next opening module | Purple oval, ARROWS point in | Tests all variations in the tree |

## Design Rules

1. **Locked lessons are invisible.** The player only sees what they've unlocked. No previewing what's ahead — the tree reveals itself as you progress. This keeps focus on the current lesson and makes each unlock feel like a discovery.
2. **One lesson can unlock many.** A single completion can reveal multiple branches at once (e.g., Main 2 unlocks Exchange Variation, Berlin Defense, and Punish Mistakes simultaneously). The player chooses which to tackle next — autonomy in the middle. But all paths must converge before the Level Test opens — control at the gates.
2. **Main trunk = lines.** These are one continuous game flowing bottom to top.
3. **Unlocks = arrows.** Arrows show gating — complete this to open that.
4. **Each node is self-documenting.** The text inside says "Unlocked by X" even though the arrow already shows it.
5. **Punish Mistakes teach consequences.** Tactical refutations of bad moves — the "why" behind the theory.
6. **Level Test requires all paths.** Arrows from the final main + final branch both point to the test.
7. **Each lesson covers 2-5 new moves.** Short enough to feel like progress, long enough to teach a real idea.
8. **Moves shown from the position where the branch diverges**, not from move 1 every time.
