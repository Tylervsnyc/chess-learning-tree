# Rookies Run — Level Design

The single source of truth for **authoring** Rookies Run levels. Sister doc to:

- **`.claude/run-strategy-bible.md`** — *why* a position is hard (bot/eval reasoning).
- **`RULES.md §49`** — engine rules (what's legal, what's wired up).
- **`scripts/run-playtest/`** — *measures* difficulty after the fact.

This doc is about **how to author a 10-level run that feels right.** Update it when playtests teach us something new.

---

## The north star: what a run should feel like

A run is a **story arc of escalating impossibility**. The player should feel:

1. **L1–3 — Warmup.** "Oh I get it, this is fun." Pure rook play, open files visible. Win without thinking.
2. **L4–6 — Choices.** "I need to actually plan." First abilities offered. Multiple plausible paths, each with tradeoffs.
3. **L7–9 — Pressure.** "I'm in trouble." Abilities feel necessary, not optional. One wrong move = caught.
4. **L10 — Spectacle.** "There's no way." Should be **impossible without abilities.** The capstone should make the player exhale when they win.

If every level feels the same, the run failed. The *progression* is the product.

---

## Anti-patterns (do not ship)

### 🚫 Uncapturable pieces guarded forever
Throne Room–style levels where a queen is always defended and Rookie can never take it. Players intuitively want to **capture the queen** — denying that the entire level is unfun. **Rule:** every enemy must be capturable on some realistic line (even if hard). If you want a "permanent" threat, use a hazard, not a piece.

### 🚫 Same strategy every level
If L1 and L7 both reduce to "find the open file and slide," the run is one level repeated 10 times. Each level must demand a **distinct primary decision** — sacrifice tempo? change form? burn an ability? bait a pawn? snake around a queen?

### 🚫 Difficulty by accretion only
Adding "+1 queen" between levels is not progression — it's the same strategy with more counters. Real progression changes **what the player has to do**, not just how many enemies are doing it.

### 🚫 Levels indistinguishable from each other
A run of 10 levels should have 10 silhouettes a player could sketch from memory. If two levels share a silhouette, redesign one.

### 🚫 Cheese paths
If a single ability (or no ability) one-shots the level the same way every time, the level is decorative. Verify with `sweep.ts` — if T3/T4/T5 all win the same way, the level is solved.

---

## Patterns that work

### ✅ Iron Curtain (the gold standard for hard)
Layered pawn walls + defended chains. Forces *capture order* decisions — you can't just slide, you have to break the chain at the right link. Fun-hard because the puzzle is legible.

### ✅ Cavalry Charge (light progression baseline)
Knights spread across the board, escalating in count. Works because knight movement geometry makes path-planning genuinely different from rook-vs-pawn. **But:** doesn't change enough between levels — the *strategy* stays "thread the L-jumps." Use as a baseline, not a peak.

### ✅ The chess-game silhouette (experiment to run next)
A **row of pawns on rank 6** with an escalating set of pieces on **rank 7**, increasing across the run. Feels like a real chess game collapsing on Rookie. Each level adds a back-rank piece (rook → bishop → knight → queen → multiples) so the *kind* of threat changes, not just the count. Test whether this stays fresh across 10 levels or compresses to one strategy.

---

## Difficulty scaling rubric

The playtest sweep (`scripts/run-playtest/sweep.ts`) gives win % per tier (T3 casual, T4 sharp, T5 expert). Target curves for a 10-level run:

| Level | T3 win% (casual) | T4 win% (sharp) | T5 win% (expert) | Felt difficulty |
|------:|-----------------:|----------------:|-----------------:|-----------------|
| 1     | 95–100           | 100             | 100              | Trivial — joy   |
| 2     | 85–95            | 100             | 100              | Trivial         |
| 3     | 70–85            | 95–100          | 100              | First thinking  |
| 4     | 55–75            | 90–100          | 100              | First ability   |
| 5     | 40–60            | 80–95           | 95–100           | Real choice     |
| 6     | 30–50            | 70–90           | 90–100           | Real choice     |
| 7     | 15–35            | 55–80           | 85–100           | Pressure        |
| 8     | 5–25             | 40–70           | 75–95            | Pressure        |
| 9     | 0–15             | 25–55           | 60–90            | Brink           |
| 10    | 0–10             | 10–35           | 35–70            | Capstone — needs abilities |

**Hard rule for L10:** T5-expert-without-abilities (run ablation with all abilities removed) should win **≤ 10%**. If a no-ability bot can solve it, it's not the capstone.

**Difficulty smell tests** (independent of sweep numbers):
- Can you describe the **primary strategic question** of this level in 8 words? If not, it's muddy.
- Does that primary question **differ** from every other level in the run? If not, cut or redesign.
- If you remove the hardest ability the player could be offered, does the level become *interesting* (good) or *impossible* (bad — over-tuned)?

---

## Authoring checklist

Before shipping a new level / run:

1. **Silhouette test** — sketch the 10 levels side by side. Are they visibly different?
2. **Primary-question test** — write the one-sentence "what is this level asking?" for each. Any duplicates? Redesign.
3. **Captureability** — every enemy reachable on at least one realistic line.
4. **No-ability run** — solo-rook bot should clear L1–3 trivially, struggle by L5, fail L8+.
5. **Ability necessity** — L10 must require abilities (verified via ablation in `scripts/run-playtest/ablation.ts`).
6. **Sweep** — run `npx tsx scripts/run-playtest/sweep.ts` and compare to the rubric above. Iterate until each level lands in its target band.
7. **Read the digest** — `data/run-playtest/digests/latest.md`. Fail-mode histogram should show a *mix* (captured-by, move-limit, dead-end). All-one-fail-mode = one-dimensional level.

---

## Open experiments

- **Rank-6 pawn row + escalating rank-7 pieces** — does it stay fresh across 10 levels? (next up)
- **Form-required levels** — a level where rook-form is dead and Rookie *must* transform to bishop/knight to progress. Currently rare.
- **Hazard-anchored levels** — pieces few, but hazards force routes. Counterweight to dense-piece designs.

---

## How to add an insight to this doc

When a playtest, a play session, or a Tyler review reveals something new:

- **New anti-pattern** → add to "Anti-patterns" with the *example level* that taught us.
- **New working pattern** → add to "Patterns that work" with the example.
- **Rubric shift** → update the table, leave a dated note at the bottom of the section.
- **New experiment** → append to "Open experiments."

Always cite the source level/sim/conversation date so we can trace decisions later.
