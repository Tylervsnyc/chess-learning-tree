# Curriculum V2 Plan

## The Big Idea: ENDS vs MEANS

Chess tactics fall into two categories:

- **ENDS (Goals)**: What you're trying to achieve
  - Checkmate patterns (mate in 1, back rank, smothered)
  - Forks, pins, skewers
  - Winning material (hanging pieces, trapped pieces)
  - Promotion

- **MEANS (Tools)**: How you achieve the goals
  - Sacrifice
  - Deflection
  - Attraction
  - Clearance
  - Quiet moves

**Teaching Order:**
1. First teach ENDS so students know WHAT they're trying to achieve
2. Then teach MEANS showing HOW to achieve what they already understand

This creates the "aha!" moment: *"Oh, THAT'S how I get the fork I already know!"*

---

## Structure

```
Level → Block → Section → Lesson

- 4 BLOCKS per Level (with funny names!)
- 4 SECTIONS per Block (3 content + 1 review)
- 2-4 LESSONS per Section
- Review sections: "The Easy Way" + "The Hard Way"
- Each lesson = 6 puzzles
```

---

## Level 1: Pattern Spotter (ENDS ONLY)

**Philosophy:** Pure pattern recognition. See it, take it. No setup moves.

```
BLOCK 1: "Oops, You're Dead"
  → Queen Says Checkmate (4 lessons)
  → Rook n Roll (4 lessons)
  → Sneak Attack From Behind (3 lessons) - back rank
  → Block 1 Victory Lap [REVIEW]

BLOCK 2: "The Fork Awakens"
  → Horsey Goes Boing (4 lessons) - knight forks
  → Little Guys, Big Dreams (3 lessons) - pawn & bishop forks
  → Big Guns, Big Forks (3 lessons) - queen & rook forks
  → Fork Yeah! [REVIEW]

BLOCK 3: "Stuck in the Middle With You"
  → Pinned Like a Butterfly (4 lessons)
  → The Old Switcheroo (3 lessons) - skewers
  → Peek-a-Boo! (3 lessons) - discovered attacks
  → Line Dance Party [REVIEW]

BLOCK 4: "Free Real Estate"
  → Thanks For the Free Stuff (3 lessons) - hanging pieces
  → Nowhere to Run (3 lessons) - trapped pieces
  → Glow Up (3 lessons) - pawn promotion
  → Level 1 Boss Fight [REVIEW]

TOTALS: 4 blocks, 16 sections, 52 lessons (312 puzzles)
```

---

## Level 2+ (Future): Skill-Stacking (MEANS → ENDS)

**Philosophy:** Now that you know the patterns, learn to CREATE them.

Potential blocks:
- "Sacrifice for Glory" - sacrifice → mate combinations
- "The Art of Distraction" - deflection → fork/mate
- "Come Here, Little One" - attraction → fork/mate
- "Clear the Way" - clearance → mate

Each section teaches a MEANS, then combines it with ENDS they already know.

---

## Files

| File | Purpose |
|------|---------|
| `/data/staging/level1-ends-only.ts` | Level 1 curriculum (ENDS only) |
| `/app/test-level1-ends/page.tsx` | Test page for Level 1 |
| `/data/staging/level1-curriculum-v2.ts` | Old ENDS→MEANS attempt (too advanced for L1) |
| `/data/staging/level1-v2-curriculum.ts` | Original block structure reference |

---

## Key Decisions Made

1. **Level 1 = ENDS only** - MEANS concepts like sacrifice/deflection are too advanced for 400-800 players
2. **Block structure** - 4 blocks, 4 sections each, review every 4th section
3. **Funny names** - Makes it memorable and fun
4. **Review format** - "Easy Way" (lower rating) + "Hard Way" (higher rating)
5. **Puzzle diversity** - API tracks mate pattern, piece type, game phase to avoid repetitive puzzles

---

## Next Steps

- [ ] Test Level 1 curriculum thoroughly at `/test-level1-ends`
- [ ] Refine puzzle criteria if some lessons have bad puzzles
- [ ] Design Level 2 curriculum (MEANS → ENDS skill-stacking)
- [ ] Design Level 3+ curricula
- [ ] Replace production curriculum with V2 when ready
