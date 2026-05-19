# Witty Alien + Martian Rebuild Spec (Data-Driven)

**Source**: Witty_Alien's real chess.com games Jun-Nov 2024 (1,472 White-side Caro-Kann games).
**Goal**: Rewrite `witty-alien.ts` and `witty-alien-martian.ts` so the trees match what real Black opponents play, not the curated Lichess study lines.

**Hard constraints**:
- Every lesson teaches **exactly 3 white moves** (Tyler-explicit). No 2-move lessons.
- Every node has `unlockedBy: null` (Witty Alien sandbox).
- OPENING-RULES Hard Rule #0 (master moves) remains relaxed — header comment preserved.
- Exports keep their names: `WITTY_ALIEN`, `WITTY_ALIEN_MARTIAN`, `getWittyAlienLesson`, `getWittyAlienMartianLesson`.
- Lesson voice stays meme / trick-weapon. Honest about evals on equal/losing lines.

---

## TREE 1 — Alien Gambit (`witty-alien`) — 14 lessons

### Main line (6 lessons, 3 white moves each)

The new main line takes the user through the gambit setup and the **universal attacking pattern** (Bd3/O-O/Re1) that works against multiple Black responses, climaxing in the **Bxh6 brilliancy** (which transposes from 7…Nbd7 and 7…e6 — both reach the position).

Choose the 7…Nbd7 path for the main line because it leads to the brilliancy with the cleanest sequence (and the brilliancy is the pedagogical punchline).

| Node | 3 white moves | Black plays | Position notes |
|---|---|---|---|
| `wa-1` | e4, d4, Nc3 | c6, d5, dxe4 | The Caro-Kann setup |
| `wa-2` | Nxe4, Ng5, **Nxf7!!** | Nf6, h6, Kxf7 | THE sacrifice. Win rate 80% over 451 games. |
| `wa-3` | Nf3, Bd3, O-O | Nbd7, e6, Bd6 | Develop + castle. Aim Bd3 at h7. |
| `wa-4` | Re1, **Ne5+**, dxe5 | Re8, Bxe5, Nd5 | Open the f-file, sac the knight back |
| `wa-5` | **Qh5+**, **Bxh6!!**, Qg6+ | Kg8, gxh6, Kh8 | The Bxh6 brilliancy (use a `puzzle` step here) |
| `wa-6` | **Qh7#** + recap puzzle for the Kf8 alt mate (Qxh6+ Ke7 Qg7#) | — | The finish — completed checkmate |

(wa-6 might end up being a recap/puzzle node since Qh7# is just 1 move. Agent: handle this by making wa-5's puzzle drive the full 14.Bxh6 → 16.Qh7# sequence, and have wa-6 be the "alternate mating net" puzzle covering 15…Kf8 16.Qxh6+ Ke7 17.Qg7#. Each puzzle counts as 1 "move" in lesson terms.)

### Deviations (7 lessons, one per Black response with ≥3% frequency)

| Node | Trigger | Witty's response (real frequency) | Win rate |
|---|---|---|---|
| `wa-dev-Bg4` | 7…Bg4 (3%) | 8.**Ne5+** (100% consistency, 15 games) | 87% |
| `wa-dev-Bf5` | 7…Bf5 (20%, 88 games) | 8.**Ne5+** Kg8 9.**Bc4+** (then Bd3 follow-up) | 73% |
| `wa-dev-e6` | 7…e6 (20%, 87 games) | 8.**Bd3** Bd6 9.O-O (transposes to main line ideas) | 85% |
| `wa-dev-Be6` | 7…Be6 (7%, 32 games) | 8.**Bd3** | 53% — **honest: lowest win rate, the toughest defense** |
| `wa-dev-Kg8` | 7…Kg8 (6%, 25 games) | 8.**Bd3** (manual castle attempt by Black) | 80% |
| `wa-dev-c5` | 7…c5 (23%, 100 games — **most common!**) | 8.**d5!** (54% Witty) — push the c5 pawn back, threaten development | 86% |
| `wa-dev-Nbd7` | 7…Nbd7 (13%, 57 games) | 8.**Bd3** (100% Witty) — but this is now in MAIN LINE, can skip or fold in |

**Decision for the agent**: Since 7…Nbd7 is now in the main line, drop `wa-dev-Nbd7` and just have 6 deviations. Total tree = 6 main + 6 deviations + 1 test = **13 nodes**.

### Important reordering notes for the agent

- The CURRENT tree has `wa-dev-Bg4` etc. in its node list. Just rewrite the whole tree — don't try to preserve any structure.
- The CURRENT tree teaches `7…Nbd7` as main, with brilliancy. Keep the brilliancy, demote the Nbd7 dependency to "Black's response in the main line."
- Top change in subtitle: **the Alien Gambit now teaches the universal attacking pattern + 6 specific deviations matching real Black responses.**

### Deviation specifics — exact moves

For each deviation lesson, teach 3 white moves. Use the actual Witty continuations from the data:

**`wa-dev-c5`** (the most important new deviation):
- Main: 7…c5 → 8.**d5!** Black plays Kg8 most often (10/54) — Witty then plays c4
- 3 white moves: **d5, c4, Bd3** (Witty's typical sequence). Black plays: Kg8, Nbd7, Bf5 (or similar)
- Source: 54 of 100 games (54% Witty preference). Alt: 8.Ne5+ (42%) — but cleaner to teach one path.

**`wa-dev-Bf5`**:
- Main: 7…Bf5 → 8.**Ne5+** Kg8 9.**Bc4+** then Bd3 follow-up
- 3 white moves: **Ne5+, Bc4+, Bd3**. Black plays: Kg8, e6, Bd6 (typical)
- Source: 88 games, 51 played Bc4+ after Ne5+ Kg8

**`wa-dev-e6`**:
- Main: 7…e6 → 8.**Bd3** Bd6 9.**O-O** then 10.Re1
- 3 white moves: **Bd3, O-O, Re1**. Black plays: Bd6, Nbd7, Re8
- Source: 87 games, 79 played Bd3 (91%)
- Often **transposes to the main line!** Note this in the lesson voice.

**`wa-dev-Be6`** (honest tone — lowest win rate):
- Main: 7…Be6 → 8.**Bd3** (97% Witty) — but only 53% win rate
- 3 white moves: **Bd3, O-O, Re1** (similar pattern)
- Voice: "This is the toughest defense Black has. Win rate drops to 53%. Stay patient, develop, look for the brilliancy chance later."

**`wa-dev-Kg8`** (manual castle):
- Main: 7…Kg8 → 8.**Bd3** (92%)
- 3 white moves: **Bd3, O-O, Re1**
- Voice: "Black tries to manually castle. You stick to the same plan — Bd3 / O-O / Re1."

**`wa-dev-Bg4`** (pin attempt):
- Main: 7…Bg4 → 8.**Ne5+** (100%)
- 3 white moves: **Ne5+, ???, ???** — need to look at Witty's 9th and 10th in real games
- Currently the agent built 8.Ne5+ Ke8 9.Nxg4 — verify this is what Witty actually plays
- Source: 15 games

---

## TREE 2 — Martian Gambit (`witty-alien-martian`) — 14 lessons

### Main line (7 lessons, 3 white moves each) — unchanged from current

The current Martian main line is correct (4…Bf5 / 7.Ne6!! / 10.Nxf7! double-sac). Keep it. But verify the deeper moves (15.O-O through 22.Qf5+) against Witty's real games.

### New deviations (6 lessons — these are NEW, currently we only have 2)

**Black's 5th move alternatives (after 4…Bf5 5.Ng5):**

| Node | Trigger | Witty's response | Source |
|---|---|---|---|
| `wam-dev-5-e6` | 5…e6 (16%, 62 games) | 6.**N1f3** (98% — transposes to main!) | Note this transposes — voice should say so |
| `wam-dev-5-h6` | 5…h6 (8%, 33 games) | 6.**Nxf7!** (100%!) — **transposes to the Alien Gambit!** | This is wild — same sac, different opening |
| `wam-dev-5-Nf6` | 5…Nf6 (6%, 24 games) | 6.**N1f3** (100% — develops) | |

**Black's 6th move alternatives (after 5…Bg6 6.N1f3):**

| Node | Trigger | Witty's response | Source |
|---|---|---|---|
| `wam-dev-6-e6` | 6…e6 (9%, 22 games) | 7.**Ne5** (45%) or 7.Bd3 (36%) — split. Pick **Ne5** for the attacking style. | |
| `wam-dev-6-Nd7` | 6…Nd7 (7%, 18 games) | 7.**Bc4** (78%, 14 games) — attacking the f7 square | |

**Black's 8th move alternatives (after 7.Ne6 fxe6 8.Ne5):**

| Node | Trigger | Witty's response | Source |
|---|---|---|---|
| `wam-dev-8-Bf5` | 8…Bf5 (40%, 71 games) | 9.**Bc4** (58%) or 9.g4 (35%) — pick **Bc4** | |
| `wam-dev-8-Be4` | 8…Be4 (12%, 21 games, **100% Witty wins**) | 9.**Bc4** (81%, 17 games) then Black plays Nd7 most often | |

### Deviation specifics — exact moves

For each, 3 white moves:

**`wam-dev-5-e6`** (transposes back to main):
- 3 white moves: **N1f3, h6-handling, Ne6** (matches main line moves 6, 7, 8 — but starting from a slightly different position)
- Actually since this transposes, lesson can be short: just 2-3 moves showing the transposition.
- Voice: "Black plays e6 first instead of Bg6 — no problem. You still play N1f3 and head for the Ne6 sac."

**`wam-dev-5-h6`** (Black kicks the knight immediately):
- 3 white moves: **Nxf7!, [Witty's 7th], [8th]** — same Nxf7 sac as the Alien!
- Source: 33 games, all 33 played Nxf7. **This is essentially the Alien Gambit from a Bf5 starting position.**
- Voice: "Black kicks with h6 — same sacrifice. You're playing the Alien Gambit even though Black started with Bf5."

**`wam-dev-5-Nf6`**:
- 3 white moves: **N1f3, [continuation], [continuation]**
- 24 games — pull deeper data to verify Witty's 7th-8th moves

**`wam-dev-6-e6`** (after N1f3, Black plays e6 instead of h6):
- 3 white moves: **Ne5, [continuation], [continuation]**
- 22 games — verify

**`wam-dev-6-Nd7`** (after N1f3, Black develops Nd7):
- 3 white moves: **Bc4, [continuation], [continuation]**
- 18 games, 14 played Bc4. Verify follow-up.

**`wam-dev-8-Bf5`** (the big new one — 40% of Black plays this):
- 3 white moves: **Bc4, [continuation], [continuation]**
- 71 games — verify follow-up

**`wam-dev-8-Be4`** (the 100% Witty wins):
- 3 white moves: **Bc4, [continuation], [continuation]**
- 21 games, 17 played Bc4. Then Black plays Nd7 (10/17) → Witty plays ??? — agent needs to verify

### Total Martian lesson count

7 main + 3 (Black 5th) + 2 (Black 6th) + 2 (Black 8th) + 1 test = **15 nodes** (close to the 14 target)

---

## Summary

| Tree | Current | Rebuild | Net change |
|---|---|---|---|
| Alien Gambit | 11 | 13 | +2 |
| Martian Gambit | 10 | 15 | +5 |
| **Total** | **21** | **28** | **+7** |

### What the user will see after rebuild

- **Alien Gambit**: now has the universal attacking pattern as the main line + 6 deviations matching real Black responses (esp. the new 7…c5 deviation which is the most common in real games)
- **Martian Gambit**: same main line + 7 new deviations covering 60%+ of the real-world positions we currently miss (especially 5…h6 = "transposes to the Alien Gambit!" and 8…Bf5 / 8…Be4 after the sacrifice)
- **Voice**: same trick-weapon meme energy, but now backed by "Witty plays X 95% of the time over 88 games" data points

### Files

Each agent writes to:
- `data/openings/{slug}.ts` — tree
- `data/openings/{slug}-lessons.ts` — lessons

Do NOT touch registry / lookup / page. Main will update registry subtitles after agents finish.
