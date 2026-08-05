# UglyBaby Onboarding Test — chesspath.app

**Created:** 2026-06-23 · **Format:** unmoderated video, think-aloud · **Device:** mobile only

## Why we're running this

Our #1 bottleneck is the **first-action cliff**: ~91% of cold visitors land and never make a first move on the board. We have evidence a big chunk of that is *perf* on the IG in-app webview (8s blank screen on throttled mobile). UglyBaby testers will be on decent phones/connections, so **this test does NOT measure the perf cliff** — it isolates the other half: *when the page loads fine, is the onboarding understandable and motivating enough to make someone take a first move and want to come back?*

If testers on good phones STILL hesitate, get confused, or don't make a move → it's a comprehension/motivation problem we can fix in copy + flow. If they sail through → the cliff is almost entirely perf, and we stop touching the onboarding and go fix load time.

---

## Tester screening (important)

Recruit people who match our actual target, NOT chess players:
- **Does NOT play chess regularly** (ideally "I don't really know how to play" or "I know the rules but never play"). Exclude anyone who plays weekly.
- **On a phone**, not a tablet or desktop.
- General consumers, curious-but-casual. Mix of ages 18–55.

Recommend **6–8 testers** (5+ surfaces ~85% of usability issues; a couple extra covers screening noise).

---

## Setup instructions (give to testers)

- Use your **phone**, held normally (portrait).
- **Talk out loud the entire time** — say what you see, what you expect, what confuses you. Silence is useless to us; narration is the whole point.
- Don't research anything or ask anyone. React naturally.
- Start URL: **https://chesspath.app**

---

## Scenario (read to the tester before they start)

> "This is a new app for learning chess — aimed at people who don't really play. A friend texted you the link and said 'you should try this.' You tapped it on your phone. I want you to react exactly like you would in real life — including bailing if you'd normally bail. Keep talking the whole time."

---

## Tasks (in order)

**Task 1 — 5-second gut read.**
Look at the first screen for about 5 seconds, then say out loud:
- Based on this screen, what do you think you'll be able to do here?
- What does it want you to do *first*?
- Does it feel like it's for someone like you (a non-chess-player)? Why or why not?

**Task 2 — Do the obvious thing.**
"Now do whatever this screen seems to be inviting you to do. Keep narrating — what do you expect to happen when you tap?"

**Task 3 — Keep going until you do something real.**
Continue forward. The moment you feel **confused, bored, unsure what to do, or dumb** — stop and say *exactly* what caused it. If you'd normally close the app here, say "I'd leave now" and why.
- (We're specifically watching: do they make a first move on a chess board? If they don't — what stopped them?)

**Task 4 — The signup moment.**
Keep going until the app asks you to create an account. When it does:
- Would you sign up right now? Yes or no — and why?
- If no: what would the app have needed to show you first to make it worth it?

**Task 5 — Free roam (2 min).**
Poke around wherever you want. Narrate what draws you in and what you'd ignore.

---

## Post-test questions (written answers)

1. In one sentence, what is this app for?
2. How easy was it to know what to do first? (1 = no idea, 5 = totally obvious) — and why that number?
3. What was the single most confusing or frustrating moment?
4. Did you actually move a chess piece or play anything? If not, what stopped you?
5. Would you come back and use this again tomorrow? Why or why not?
6. What, if anything, would make you more likely to create an account?
7. **(Speed check)** When the page first opened, roughly how long until you saw something you could tap? Did anything feel slow, broken, or stuck-loading?

---

## What WE look for (internal — not shown to testers)

| Signal | What it tells us |
|---|---|
| **Time to first move on the board** (and whether it happens at all) | The cliff, directly. This is THE metric. |
| 5-sec comprehension (Task 1) | Does the screen communicate "learn chess the fun way" instantly, or is it ambiguous? |
| Where they hesitate / first "I'd leave now" | The exact drop point in the flow. |
| Reaction to Rookie (the mascot + quips) | Asset (charming, lowers the stakes) or friction (in the way, slow, confusing)? |
| Play vs Learn choice | Which CTA pulls beginners, and does the other one confuse? |
| Signup reaction (Task 4 / Q6) | Is "earn the signup" working — did they hit a real win before being asked? |
| Any mention of slowness/blank/loading (Q7) | Even on good phones, a perf smell = confirmation the real-traffic cliff is load time. |

---

## Results

**Run date:** 2026-06-25 · ~10 tester videos, mobile think-aloud.

### Headline read
On good phones, **nobody flagged slowness/loading (Q7)** — perf was isolated out as designed. Yet testers still got lost, confused, and **bailed**. Conclusion: the 91% first-action cliff is **two stacked problems** — perf on cold-IG webview *and* a genuinely broken onboarding (comprehension/motivation). This is NOT a "go fix perf, leave onboarding alone" result.

### What caused bails (the cliff, directly)
- **Rookie's creepy non-sequitur lines — 2 explicit bails.** "What the heck was that? That's creepy and weird... This is the bailing part. I would bail." (V4, 01:38); "If I had feelings, they would be hurt. Update, I do have feelings. They are hurt." (V9, 04:34). These are the **retired voice register** (old "discovering feelings / Wheatley" framing, killed 2026-06-09; corpus rework was still TODO so live app still serves them).
- **Rookie's sass as a dealbreaker — 1 hard pass within 20 seconds.** "The humor style doesn't hit with me, just comes across as really obnoxious and annoying" (V8, 01:36); "I'd hard pass... within the first 20 seconds" (V8, 09:22). Voice is polarizing: biggest strength for some, instant exit for others.
- **Dumped into a confusing game with no intro — 2 users.** "this just sort of throws you right into it. That's not ideal." (V4, 00:28); "I don't know what's happening. I'm very lost." (V1, 00:13).

### What stopped the first move (friction, not bail)
- **No in-game move hints during live play — 3 users (most common complaint).** "I wish it would say that when I was playing, then I don't have to remember." (V6, 02:57); "There's not a lot of guidance... should be more guidance." (V1, 03:45).
- **Clunky navigation — 2 users.** Repeated Back, no home path, lessons buried. "annoying that you have to hit Back every single time... I don't see a way to get back." (V10, 01:18); "want to see these lessons... earlier and easier." (V7, 03:35).
- **Opponent too easy / lets you win — 2 users.** "they're just going to let me win." (V1, 01:27); "this is not a particularly hard game of chess." (V4, 04:28).
- **Name-gate before the tutorial — 1 user.** "Why do I have to give my name to continue a tutorial? Seems stupid." (V8, 04:41).
- **Lessons = colors with no "why" — 1 user.** "The colors are useful, but without context... kind of useless." (V8, 09:07).
- **Mobile touch input — 1 user.** "having to click it and pick it up with my mouse. Not sure that will work on my phone" (V3, 01:59). ⚠️ Caveat: this tester was clearly on **desktop** ("my mouse") — screening leaked; verify before treating as a real mobile bug.
- **Unclear value prop / differentiation — 1 user.** "I'm not sure what the difference is" (V9, 00:41).
- **Weird voice (TTS) — 1 user.** "The voice is super weird, too." (V4, 04:28).

### What testers liked
- Move-option hints **when shown** during gameplay: "shows you what the move options are. That's generally really good." (V4, 00:44).
- Free, no ads: "I don't think I'd bail... this is free. I don't even think there's ads." (V7, 03:22).
- Rookie beginner difficulty naming: "I like that it's rookie level, because honestly, I don't really know how to play." (V7, 01:59).

### Possible improvements (tester-sourced)
- Add in-game move hints during live play (legal moves + piece-move reminders). **3 users.**
- Remove/seriously tone down the off-the-rails chatbot lines (the "children/cages" and "fake feelings/cookie" bits) — they caused bails. Keep chess-themed jokes, cut creepy non-sequiturs.
- Make Rookie's personality optional/dial-able from the start — a "just teach me" mode skeptics can pick before the sass.
- Fix onboarding so it doesn't dump users into a confusing game state; add a clear Learn-vs-Play choice up front.
- Surface lesson plan/categories on home + add persistent home/back navigation.
- Add text explanations of WHY a move/checkmate works, not just colored squares.
- Increase opponent difficulty or add adjustable AI levels.
- Verify and fix mobile touch input + name-entry keyboard.
- Sharpen the value proposition / differentiation.

### Decision (deferred)
Findings logged 2026-06-25. Fix-order recommendation drafted (Tier 1: purge retired Rookie lines + opt-in "just teach me" mode + Learn-vs-Play intro; Tier 2: in-game hints + nav; Tier 3: difficulty/why-text/name-gate/value-prop). **No work dispatched yet — awaiting Tyler's call.**
