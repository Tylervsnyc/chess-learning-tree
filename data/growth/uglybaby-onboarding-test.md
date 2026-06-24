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

_(paste findings + per-tester notes here after the run; then decide: onboarding-copy fix vs. go-fix-perf)_
