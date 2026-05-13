# Rookie's Run — Strategy Bible

The reference document for understanding **why** a position is good or bad in Rookie's Run. Used by the playtest discovery scripts to annotate moves with chess reasoning, and by agents writing strategy commentary.

This is not a memo — it's a working document. Update it when sims reveal patterns that aren't here.

---

## The game in one sentence

Rookie (default form: rook) must reach **rank 8** from her start square on rank 1, while enemies move 1+ times per Rookie turn. She has access to abilities that transform her piece type, blast enemies, freeze them, or refund tempo.

## The winning condition

A move that lands Rookie on **any square on rank 8** ends the game in victory. There is no checkmate concept — reach rank 8, win.

## Core strategic principles

### 1. The open-file mandate
A rook can fly an entire file in one move. The dominant strategic objective is finding an **open file** — a file where no enemy or hazard sits between Rookie's current rank and rank 8. If such a file exists AND Rookie can reach it, she can win in 1-2 moves.

**Definition**: a file `f` is "open from rank `r`" when no enemy piece or hazard occupies `(f, r+1) … (f, 7)`. Rank 8 itself can be empty or hold a capturable enemy.

The eval bonus for **open paths** dominates eval for **raw rank**. A rook on rank 2 with a clear file beats a rook on rank 7 of a blocked file.

### 1b. Captures reshape the open-file landscape
An "open file" is not just one with no current blockers — it's one Rookie can **make** open by capturing the right blocker. A pawn at d5 blocking the d-file is only a blocker as long as it lives. Rookie slides d1→d5, captures the pawn, lands on d5 with the d-file now open above her.

The critical check is **defense**: an enemy at (f, r) is **undefended** when no OTHER enemy attacks the square (f, r). Capturing an undefended piece is a "free" move — Rookie lands there safely. Capturing a defended piece means Rookie lands in an attack set and gets recaptured next turn.

**Capture-to-open pattern**: slide up a file to the first blocker. If undefended, capture. New state: Rookie is on a higher rank, one piece is gone, and the file beyond is checked again for open status.

**Defense detection**: pawns defend the two squares diagonally toward rank 1 (so a pawn at (4,4) defends (3,3) and (5,3)). Bishops defend along diagonals; knights along L-jumps; queens everywhere. A "defended pawn chain" exists when each pawn in a row defends the next.

### 2. Rank-1 freedom
Enemies almost never spawn on rank 1 (the starting rank). Rank 1 is therefore the **highway** — Rookie can sidestep along it freely without being threatened. The standard opening: stay on rank 1, slide to a good file, then climb.

### 3. Queen sightlines are the most dangerous threat
Queens attack along ranks, files, AND diagonals. A single queen on rank 4 typically covers:
- All of its file (8 squares)
- All of its rank (8 squares)
- All 4 diagonals (up to ~14 squares)

That's ~30 covered squares out of 64. Queens are the dominant blocker.

**Counter-strategy**: stay off the queen's lines, or remove the queen via Queenkiller / Detonate / Freeze Ray. Bishop Step or Knight Hop also gives transit through queen sightlines because those forms don't share the rook's straight-line vulnerability.

### 4. Pawn walls and defended chains
Enemy pawns attack diagonally toward rank 1. A pawn wall on rank 3 doesn't directly block a rook on rank 1 — Rookie can slide UP to rank 2, where she's safe unless a pawn is at `(rookie.file ± 1, 3)`.

A **defended chain** is two or more pawns where one defends another (pawn at (3,3) defends (4,4) attack square). Capturing a defended pawn means Rookie lands on a square attacked by the defender, getting recaptured on the enemy turn.

**Counter-strategy**: capture the OUTER pawn first (no defender behind it), or transform to knight/bishop to jump over the chain, or use Detonate to remove multiple pawns at once.

### 5. Bishop diagonals are color-bound
Bishops attack along diagonals only. A bishop on a dark square never attacks a light square. **You can dodge bishops by staying on the opposite-color squares.**

A rook moving along a single file ALTERNATES colors with each step — so bishops always cover half of any vertical path.

### 6. Knight forks are unpredictable
Knights attack the 8 L-shape squares. Hard to anticipate. The only safe response is reading every knight's coverage before each move.

**Counter-strategy**: stay 2+ squares from any knight, OR remove the knight via Detonate, OR transform Rookie to a knight herself (becoming the threat).

### 7. Choke points
Some levels have a **rank** where only 1-2 files are safe to traverse. Rookie has to thread the needle. Choke-point levels strongly favor Phase Step (walk through pieces) or Knight Hop (jump over them).

### 8. Move limit cliffs
Levels with tight `moveLimit` force speed. If Rookie can't reach rank 8 in N moves, she loses regardless of position. Counter: Surge (extra moves), Tempo Tax (refund tempo / pseudo-extra moves), or routes that minimize total moves.

### 9. enemiesPerTurn tempo imbalance
Most levels have `enemiesPerTurn: 1` — Rookie and enemies move at the same pace. When `enemiesPerTurn` is 2 or 3, enemies converge faster than Rookie can escape. These levels demand decisive openings (no wasted moves) and frequently require abilities to win at all.

### 10. Hazards as permanent blocks
Hazard squares can't be occupied by anyone. They turn into a feature of the board geometry. Hazards in the **approach zone** (ranks 2-7) reduce winning paths and amplify choke points.

---

## Tactical patterns

### A. Sidestep & Climb
Move along rank 1 to a file with a clear path to rank 8. Then slide up. Works when an open file exists.

### B. Capture & Slide
Capture an outer pawn (no defender), which opens the file behind it. Then slide up that file.

### C. Knight Tour
Transform to knight via Knight Hop. Use L-jumps to land on squares no rook can reach. Useful for jumping over pawn walls.

### D. Bishop Diagonal
Transform to bishop via Bishop Step. Use diagonals to bypass queens (they can't both attack the same diagonal Rookie travels).

### E. Queen Sprint
Transform to queen via Queen Pulse. Single move can reach rank 8 from many positions because queens cover ranks, files, and diagonals.

### F. Ability Chain
Use multiple abilities in one turn. Aegis (free action) + Knight Hop (consumes Rookie's move) = defended jump. Surge (free action, +1 move) + Capture-on-move = double tempo.

### G. Detonate Through Wall
Detonate a 3×3 (T3) or 5×5 (T5) blast at the center of a pawn wall. Clears the wall, opens multiple files at once.

### H. Defensive Aegis Pre-Tap
When Rookie predicts a capture is unavoidable next turn (e.g., queen sliding in), tap Aegis BEFORE moving. The shield absorbs the capture.

---

## Ability usage decision tree

For each ability, the right "smart use" trigger:

| Ability | When to USE | When NOT to use |
|---|---|---|
| **Aegis** | Rookie's current OR target square is in enemy attack set next turn | Rookie has a safe move that doesn't need shield |
| **Surge** | Combo: this move + Surge's bonus move chains to a winning move OR captures 2 pieces | Single move would already win without it (wasted use) |
| **Bishop Step** | A bishop diagonal from current square reaches an open winning file or rank 8 directly | Rook moves give equal/better access |
| **Knight Hop** | A knight L-jump bypasses a pawn wall or reaches a square no rook can | Open files exist for the rook |
| **Queen Pulse** | A queen move would reach rank 8 directly from current position | Rook already has a winning slide |
| **Phase Step** | A piece blocks the only winning file and capturing it leaves Rookie threatened | Rook can route around |
| **Leap** | Multiple ranks of empty space ahead with enemies blocking middle ranks | Single-rank advance via rook is safe |
| **Pawn Charge** | A pawn on Rookie's column blocks advance AND can be plowed (T4+) | Rook can sidestep around |
| **Freeze Ray** | A queen or knight will capture Rookie next turn AND no escape exists | Defensive Aegis is cheaper |
| **Detonate** | 3+ enemies cluster on a small region of the board | Single high-value target — Queenkiller wins |
| **Queenkiller** | A queen blocks Rookie's path AND her attack set covers Rookie's best advance squares | Queen is on the periphery — ignore it |

---

## How to read a discovery report

When the discovery script outputs "first move c1 wins 24%", check:
1. **What's on c1's file?** Look at the puzzle definition. Open file from c1 → likely wins.
2. **What attacks c1?** If a queen attacks c1, the move puts Rookie in immediate threat → puzzling that it wins.
3. **What's the natural follow-up?** Does the bot have a clear winning move from c1 next turn?

When an opening "d2 → h2" wins 31% of trials, look at:
1. The d2 → h2 path along rank 2 — is it traversable (no enemies between)?
2. The h-file from h2 — is it open to rank 8?
3. What attacks d2 and h2?

When an ability shows positive "lift" (winners use it more), the cause is usually:
- The ability clears a specific blocker that exists on this level
- The ability prevents a specific capture pattern this level produces
- The level has a tempo cliff and the ability buys moves

---

## Common puzzle archetypes (and their counters)

### Pawn Wall Archetype
Layered pawn rows (ranks 3, 5, 6). Rook can capture outermost, but defended pawns are deadly. **Counter**: Knight Hop over the wall, or Detonate the wall.

### Royal Court Archetype
Multiple queens behind a pawn shield. Greedy captures get recaptured by queens. **Counter**: Queenkiller a queen first, OR Bishop Step around queen lines, OR Aegis-tank a capture.

### Speed Demon Archetype
Tight move limit, board is mostly empty. **Counter**: don't pause for captures, beeline to an open file. Surge if available.

### Iron Curtain Archetype
Heavy defended pawn chains, choke points. **Counter**: combination of Detonate + Knight Hop to break the curtain.

### Hazard Maze Archetype
Hazards force a narrow path. **Counter**: Phase Step to walk through one blocker; otherwise just thread the needle.

### Crossfire Archetype
Multiple bishops cover crossing diagonals. **Counter**: Stay on safe-color squares; bishops are color-bound.

### Hornet's Nest Archetype
Knights everywhere. **Counter**: Read every knight's coverage; transform Rookie to knight to escape predictability.

### Boss Gauntlet Archetype
Mix of high-value pieces (queen, multiple bishops, knights). **Counter**: prioritize removing the queen, then maneuver through the rest.

---

## Glossary

- **Tier (T1-T5)**: ability power level. T1 weakest, T5 strongest. Same ability ID, different parameters.
- **Tempo**: a meter that fills with captures. When full, an ability offer is rolled. Spending captures = earning ability picks.
- **Form**: Rookie's current piece type. Default rook. Transforms (Knight Hop, Bishop Step, Queen Pulse) change form for N turns.
- **Hazard**: permanent blocked square. Cannot be occupied by Rookie or enemies.
- **moveLimit**: cap on Rookie's total moves before automatic loss.
- **enemiesPerTurn**: how many enemy pieces act between each Rookie move.
- **shieldUp**: Aegis is active. Next attempted capture is blocked (or T5: capturer dies).
- **bonusMovesLeft**: Surge-granted extra moves. Each consumes 1.
- **threatDensity**: count of unique squares attacked by enemies in starting position.
- **openFiles**: count of files with no enemy pawn on ranks 2-7 (the feature definition; the strategic concept of "open file" is broader — see Principle 1).
- **chokePointCount**: ranks between rookie's start and rank 8 where ≤1 safe file is reachable.
