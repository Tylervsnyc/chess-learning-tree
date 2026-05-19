# Witty_Alien Real-Play Analysis: Alien + Martian Gambits

Source: Witty_Alien's chess.com archives, **June–November 2024** (6 months, post-virality peak).
Total games analyzed: 21,042 | As White vs Caro-Kann: 1,472
Filter: ECO B10-B19 + White = Witty_Alien

---

## ALIEN GAMBIT — Reality vs Our Lesson

### Frequency funnel

| Position | Games | Witty's win rate |
|---|---|---|
| Reached 5.Ng5 (4…Nf6 line) | **722** | 75% |
| Black played 5…h6 → Witty played 6.Nxf7 | **443** | (gambit fired) |
| Gambit accepted (Kxf7) | **451** total | **80%** |

### Black's 5th move (response to 5.Ng5)

| Black move | Games | % | Witty win rate |
|---|---|---|---|
| **5…h6** | 446 | **62%** | 79% |
| 5…Bf5 | 146 | 20% | 68% |
| 5…e6 | 75 | 10% | 67% |
| 5…c5 | 14 | 2% | 79% |
| 5…Bg4 | 12 | 2% | 67% |

### Witty's response is rock-solid

- After 5…h6: **99%** plays 6.Nxf7 (443/446)
- After 6.Nxf7 Kxf7: **96%** plays 7.Nf3 (432/451)

### Black's 7th move (THE key fork after 7.Nf3)

| Black move | Games | % | Win rate | Witty's response |
|---|---|---|---|---|
| **7…c5** | 100 | **23%** | 86% | d5 (54%) or Ne5+ (42%) — Witty himself varies |
| **7…Bf5** | 88 | 20% | 73% | Ne5+ (89%) |
| **7…e6** | 87 | 20% | 85% | Bd3 (91%) |
| 7…Nbd7 | 57 | 13% | 81% | Bd3 (100%) |
| 7…Be6 | 32 | 7% | 53% | Bd3 (97%) |
| 7…Kg8 | 25 | 6% | 80% | Bd3 (92%) |
| 7…Bg4 | 15 | 3% | 87% | Ne5+ (100%) |

### Big gap in our current tree

Our current `witty-alien.ts` teaches **7…Nbd7** as the main continuation. **Real-world frequency is only 13%.**
The top three Black responses (c5, Bf5, e6 = **63% combined**) are either taught as a single deviation or not at all.

---

## MARTIAN GAMBIT — Reality vs Our Lesson

### Frequency funnel

| Position | Games | Win rate |
|---|---|---|
| Reached 5.Ng5 (4…Bf5 line) | 392 | 77% |
| Black played 5…Bg6, Witty played 6.N1f3, Black h6, Witty Ne6 | **195** | **85%** |
| Black recaptured fxe6 → Witty's 8.Ne5 | 178 | 85% |

### Witty's main-line consistency is wild

| Move | Consistency |
|---|---|
| 6.N1f3 after 5…Bg6 | 95% |
| 7.Ne6 after 6…h6 | **98%** |
| 8.Ne5 after 7…fxe6 | 92% |
| 9.Bc4 after 8…Bf7 | 91% |

### But Black branches out at move 8

After 8.Ne5, Black has 3 common responses — our current lesson only covers **one** (Bf7):

| Black 8th | Games | % | Witty's response | Win rate |
|---|---|---|---|---|
| **8…Bf7** | 76 | 43% | 9.Bc4 (91%) | 84% |
| **8…Bf5** | 71 | 40% | (not yet analyzed) | 80% |
| 8…Be4 | 21 | 12% | (not yet analyzed) | **100%** |
| 8…Bh7 | 8 | 5% | | 100% |

### And at move 5 + 6 too

Black's 5th move when bishop is on f5:
- 5…Bg6: 67% (our line)
- **5…e6: 16%** (not covered)
- 5…h6: 8% (not covered)
- 5…Nf6: 6% (not covered)

Black's 6th move after Witty's N1f3:
- 6…h6: 79% (our line)
- **6…e6: 9%** (not covered)
- **6…Nd7: 7%** (not covered)

---

## Scoping a "Data-Driven" Rebuild

### ALIEN GAMBIT — recommended lesson count

| Layer | Count | Content |
|---|---|---|
| Main line | 6 | The setup → 6.Nxf7 → 7.Nf3 (3 white moves/lesson, like current Martian) |
| Black 5th move deviations | 2 | If 5…Bf5, if 5…e6 |
| Black 7th move deviations (THE big new layer) | 7 | 7…c5 (with both d5 and Ne5+ paths), 7…Bf5, 7…e6, 7…Nbd7, 7…Be6, 7…Kg8, 7…Bg4 |
| Test | 1 | |
| **Subtotal** | **~16 lessons** | (currently 11) |

### MARTIAN GAMBIT — recommended lesson count

| Layer | Count | Content |
|---|---|---|
| Main line | 6 | Existing 7-lesson trunk, ~unchanged |
| Black 5th move deviations | 3 | If 5…e6, 5…h6, 5…Nf6 |
| Black 6th move deviations (after N1f3) | 2 | 6…e6, 6…Nd7 |
| Black 8th move deviations (after Ne5) | 2 | 8…Bf5, 8…Be4 (Bf7 is main line) |
| Test | 1 | |
| **Subtotal** | **~14 lessons** | (currently 10) |

### Combined scope

| | Current | Data-driven rebuild |
|---|---|---|
| Alien Gambit lessons | 11 | ~16 |
| Martian Gambit lessons | 10 | ~14 |
| **Total** | **21** | **~30** |
| Net add | | **+9 lessons** |

Most importantly: the **main line shifts** in the Alien Gambit (away from 7…Nbd7 toward c5 / Bf5 / e6).

---

## Methodology Notes

- 6 months sampled (~21k games total). Larger sample (24+ months) would improve rare-line accuracy but the main-line numbers stabilize quickly.
- "Witty's win rate" includes flagging — bullet games end on time, so the 80% reflects practical playing strength, not engine evaluation.
- Threshold for "include as a lesson": ≥3% of relevant games. Anything below 3% is noise.
- Some deviations need follow-up analysis (e.g. 8…Bf5 and 8…Be4 in Martian — what does Witty actually play in response?). 1-2 more hours of analysis.
