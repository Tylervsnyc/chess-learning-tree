# Witty Alien Opening Section — Plan

Built around streamer **Witty_Alien** (CM Volen Dyulgerov) and his signature knight sacrifices vs the Caro-Kann. Models the Italian Game pattern: one parent opening with 2-4 variation trees underneath.

## Registry Entry (proposed)

```ts
{
  slug: 'witty-alien',
  name: 'Witty Alien',
  subtitle: 'Knight sacrifices that crush the Caro-Kann',
  moves: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4',
  description: 'Bulgarian streamer Witty_Alien\'s aggressive system — sacrifice a knight on f7 or e6 to drag the king out and attack.',
  side: 'white',
  category: '1.e4',
  color: '#8B5CF6',       // alien purple — TBD
  colorDark: '#6D28D9',
  colorLight: '#A78BFA',
  ghostPiece: '♘',
  icon: 'lightning',
  mainLine: {
    name: 'Alien Gambit',
    subtitle: '5.Ng5 h6 6.Nxf7! — the signature sacrifice · 10 lessons',
  },
  variations: [
    { name: 'Martian Gambit', subtitle: 'vs 4...Nd7 — Ne6 instead of f7', icon: 'knight', hasData: false, slug: 'witty-alien-martian' },
    { name: 'Two Knights Trap', subtitle: '2.Nc3 move order — Hikaru\'s mate', icon: 'lightning', hasData: false, slug: 'witty-alien-two-knights' },
    { name: 'Bonjour Variation', subtitle: 'vs the French Defense', icon: 'pawn', hasData: false, slug: 'witty-alien-bonjour' },
  ],
}
```

## ⚠️ Rules Conflict to Resolve First

**OPENING-RULES.md Hard Rule #0**: "Every move we teach must be #1 in the Lichess masters database."

The Alien Gambit **violates this rule** — `6.Nxf7` is objectively unsound and masters never play it. Same for `6.Ne6`. The whole "Witty Alien" section is built on tricky blitz/bullet weapons, not master theory.

**Options:**
1. **Relax the rule** for the Witty Alien section — use Lichess all-games database (60% White winrate over 150k+ games at 6.Nxf7) instead of masters DB
2. **Don't build this section** and stick to sound openings only
3. **Build but label clearly** ("⚡ Trick Weapon — not master-approved")

→ **Recommendation: option 1 + 3.** Use the openingtree.com winrate from Witty_Alien's own games (79.1% over 456 games after 7.Nf3) as our authority. Label the section as a "Trick Weapon."

---

## Tree 1 — Alien Gambit Main (slug: `witty-alien`)

**The main 6.Nxf7 line.** User plays White. 10 lessons.

### Main line (5 nodes, col 0)

| # | Lesson | Moves | Key Idea |
|---|---|---|---|
| 1 | The Setup | 1.e4 c6, 2.d4 d5, 3.Nc3 dxe4 | Enter the Caro-Kann main line. Knight to c3 invites Black to capture |
| 2 | Bait the Knight | 4.Nxe4 Nf6, 5.Ng5 h6 | Recapture, jump to g5 attacking f7. Black thinks "easy — h6 kicks it" |
| 3 | **The Sacrifice** | 6.Nxf7! Kxf7, 7.Nf3 | The signature move — knight for two pawns + king exposure |
| 4 | Load the Diagonal | 7…Nbd7, 8.Bd3 e6, 9.O-O | Develop with tempo, castle, aim Bd3 at h7 |
| 5 | Open the f-file | 9…Bd6, 10.Re1 Re8, 11.Ne5+ | Rook on e1, knight check forces a critical decision |
| 6 | Win the Tempo | 11…Bxe5, 12.dxe5 Nd5, 13.Qh5+ | After Bxe5? we recapture, queen joins with check |
| 7 | **The Bxh6 Brilliancy** | 13…Kg8, 14.Bxh6!! gxh6, 15.Qg6+ | The "don't boo, spam the brilliant emote" moment |
| 8 | Finish the King | 15…Kh8 16.Qh7# (or 15…Kf8 16.Qxh6+ Ke7 17.Qg7#) | Two mating nets to memorize |

### Deviations (3 nodes, col -1)

| # | Lesson | Trigger | Our Response |
|---|---|---|---|
| D1 | If 7…Bg4 | Black pins your knight | 8.Ne5+! Bxd1?? 9.Bg6# (Witty's real game) — or 8…Ke8 9.Nxg4 +3.9 |
| D2 | If 7…Bf5 | Black develops the bishop | 8.Ne5+ Kg8 9.Bc4+ e6 10.g4! Be4 11.Bxe6+ Kh7 12.g5 → g6# pawn mate |
| D3 | If 7…c5 | The actual refutation | 8.c3 Nc6 9.Bd3 — give back the piece, keep attacking, eval is roughly equal but practical chances |

### Test (1 node, top of tree)

| # | Lesson | Description |
|---|---|---|
| T1 | Lvl 1 Test | Play the full main line + handle every deviation we taught |

**Total: 10 lessons** (5 main + 3 deviations + 1 brilliancy + 1 test, with mating-net lesson and finish lesson combined as #8)

---

## Tree 2 — Martian Gambit (slug: `witty-alien-martian`)

**For when Black plays 4…Nd7 instead of 4…Nf6.** ~8 lessons.

### Main line outline

| # | Lesson | Moves |
|---|---|---|
| 1 | The Detour | 1.e4 c6, 2.d4 d5, 3.Nc3 dxe4 |
| 2 | Different Defense | 4.Nxe4 Nd7, 5.Ng5 |
| 3 | The Ne6 Sac | 5…Ngf6, 6.Ne6!? fxe6 |
| 4 | Queen Joins | 7.Qh5+ g6, 8.Qxg6# (if Black takes — 4-move mate!) |
| 5 | If Black Plays Smart | Realistic continuation when fxe6 isn't forced |
| 6 | Build the Attack | Bd3 / Qe2 / O-O-O ideas |
| 7 | Mating Patterns | Common finishes |
| 8 | Lvl 1 Test | |

### Deviations
- If 5…h6 (kicks the knight) → still 6.Ne6!? same idea
- If 4…Nd7 5.Bd3 (positional alternative) — sidestep variation

---

## Tree 3 — Two Knights Trap (slug: `witty-alien-two-knights`)

**The 2.Nc3 move order — Hikaru's mate.** ~6-8 lessons.

### Main line outline

| # | Lesson | Moves |
|---|---|---|
| 1 | Different Move Order | 1.e4 c6, 2.Nc3 d5, 3.Nf3 |
| 2 | Same Idea | 3…dxe4, 4.Nxe4 Nf6 |
| 3 | The Jump | 5.Neg5 h6, 6.Nxf7! |
| 4 | The Check | 6…Kxf7, 7.Ne5+ |
| 5 | **Bg6# Trap** | 7…Ke8 8.Bd3 Be6?? 9.Bg6+ Bf7 10.Bxf7# (Hikaru vs FM) |
| 6 | If Black Defends | What to do when Black doesn't fall in |
| 7 | Lvl 1 Test | |

---

## Tree 4 — Bonjour Variation (slug: `witty-alien-bonjour`)

**Alien Gambit vs the French Defense.** ~6-8 lessons. Lowest priority — different opening entirely, only build if the first 3 land.

Need to research the move tree separately — Witty's Bonjour line isn't in the Lichess studies I pulled. Punt to a follow-up.

---

## Build Order Recommendation

1. **Tree 1 (Alien Gambit main)** — 10 lessons, highest impact, killer Bxh6 brilliancy
2. **Tree 2 (Martian)** — 8 lessons, covers the most common deviation (Black plays Nd7)
3. **Tree 3 (Two Knights)** — 6-8 lessons, niche but Hikaru-endorsed for marketing
4. **Tree 4 (Bonjour)** — defer until first 3 ship

**Phase 1 deliverable: Trees 1+2 = 18 lessons, 2 variation slugs, 1 parent registry entry.**

---

## Research Sources (saved to `/research`)

- `alien-gambit-ishaan.pgn` — 9 trap chapters, gamebook style (best lesson template)
- `alien-gambit-mikewolf.pgn` — 11 chapters incl. real Witty_Alien games
- `alien-gambit-captainamogus.pgn` — most thorough refutation analysis
- `alien-gambit-oneandonly.pgn` — cleanest intro + Martian Gambit chapter

## Open Questions for Tyler

1. **Trick-weapon labeling** — call out that this isn't master theory? (My vote: yes, lean into it — "Witty Alien's Tricks" framing.)
2. **Color** — currently picked purple `#8B5CF6` for the "alien" vibe. Open to suggestions.
3. **Scope confirmation** — Phase 1 = Trees 1+2 (18 lessons)? Or just Tree 1 to start (10 lessons)?
4. **Where in curriculum** — Witty Alien fits into the 1.e4 White section. Slot it next to King's Gambit (other "trick weapon" White opening)?
