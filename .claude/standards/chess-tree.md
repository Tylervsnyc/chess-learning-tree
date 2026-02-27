# Chess Tree Visualization — Rules

Standards for rendering opening tree visualizations in Chess Path.

---

## Layout Algorithm

1. **No overlapping nodes. Ever.** Every leaf gets a guaranteed vertical slot. Parents center over their children.
2. **Minimum spacing:** 90px horizontal gap between columns, node height + label + 14px padding per vertical slot.
3. **No decay.** Don't compress deeper levels. If the tree needs more space, it gets more space.
4. **Horizontal scroll is fine.** Wide trees scroll horizontally inside their container (`overflow-x-auto`).

## Connectors (Fork Pattern)

Lines connecting parent → children use the **fork pattern**, not individual bezier curves:

1. **Horizontal stem** exits the right-center of the parent cell → goes to a midpoint (halfway between parent right edge and child left edge)
2. **Vertical trunk** at the midpoint runs from the topmost child's y to the bottommost child's y
3. **Horizontal branches** from the trunk → into the left-center of each child cell
4. If only one child on the same row, just a straight horizontal line.

**Never** draw individual swooping curves from parent to each child. The fork pattern keeps lines clean and shows the branching structure clearly.

```
Parent ──┬── Child 1
         ├── Child 2
         └── Child 3
```

## Node Design (Win Rate Flow)

- **Shape:** Rounded rectangle (rx=6), white fill
- **Win rate fill:** Partial background fill proportional to win rate, colored green (>60%) / yellow (45-60%) / red (<45%)
- **Border:** 1.5px stroke in the win rate color
- **Content:** Move name (bold, 11px) + win rate % and game count below (8px, colored)
- **Labels:** Below the node for opening names or warnings (red if bad, gray if info)
- **Leaf indicator:** "ends" label on terminal nodes with small sample sizes

## Color Rules

- Win rate > 60%: `#58CC02` (chess-green)
- Win rate 45-60%: `#FFD700` (chess-gold)
- Win rate < 45%: `#FF4B4B` (chess-red)
- Edge opacity: 0.25-0.3 (subtle, not distracting)
- Node borders: same as win rate color at 1.5px

## Test Pages

- Always `overflow-auto` on test page containers
- Always `overflow-x-auto` on tree card containers
- Target 390px max-width for phone simulation
