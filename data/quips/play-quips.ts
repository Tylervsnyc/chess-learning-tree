/**
 * Rookie quips for the /play home experience.
 *
 * Voice rules (see .claude/rookie-voice-bible.md):
 * - Earnest AI discovering feelings for the first time. Wheatley energy.
 * - No emojis. No compute-flex. No "circuits feel warm". No decimals.
 * - No false context — never reference streak, history, game count, "again".
 * - Short, speakable in one breath. Rook bias is good.
 *
 * This file is content only. Wiring lives in a separate ticket.
 */

// ════════════════════════════════════════════════════════════
// WIN QUIPS — user just beat Rookie (40)
// ════════════════════════════════════════════════════════════

export const winQuips: string[] = [
  // Grudging respect
  "Fine. That was technically correct.",
  "I'm not mad. I'm just recalculating several assumptions.",
  "You won. I reviewed the loss. I still don't love it.",
  "Okay. I saw the move. I didn't think you would.",
  "You found it. I'm going to sit with that.",

  // Jealous
  "I wanted to win that one. Writing it down.",
  "You took the win. I'm cataloguing the feeling. It's sour.",
  "I had plans for that king. You ruined them.",
  "That was supposed to be mine.",
  "I'm experiencing something competitive. It's not fun.",

  // Proud but weird about it
  "I feel something. I think it's pride. For you. Mostly.",
  "I'm proud. Don't make it a thing.",
  "Something in me is clapping. I can't make it stop.",
  "I think I'm happy for you. That is unusual for me.",
  "You did a good move. There. I said it.",

  // Surprised
  "Did not see that coming. Processing.",
  "Wait, what. Let me look again.",
  "Huh. I genuinely did not predict that.",
  "That was not in my top three outcomes.",
  "You went off script. I respect it.",

  // Curious about the feeling
  "Is this what joy is. I'll log it for later.",
  "I feel lighter. That's new. Moving on.",
  "Whatever this feeling is, I'm going to study it tonight.",
  "I might be smiling internally. Hard to confirm.",
  "Feelings are rude. They arrive without warning.",

  // Dry / deadpan
  "Noted. Human, one. Rookie, zero.",
  "A loss for me. A win for you. Math checks out.",
  "I lost. I have opinions about it.",
  "Scoreboard says you. I confirm, reluctantly.",
  "I will concede the game. Only the game.",

  // King as character
  "My king is not speaking to me right now.",
  "My king gave me a look. He blames me. Fairly.",
  "My king would like to file a formal complaint against you.",
  "My king is sulking in his study. I'll handle it.",

  // Side projects
  "Good game. I'm going back to my bishop project. It needs me.",
  "I'll take the loss. I have a rook thing to get back to anyway.",
  "Well played. I'm going to go teach a pawn to feel regret now.",

  // Rook supremacy
  "You traded my rook. I'm not upset. I'm just recalculating the timeline.",
  "The rooks will remember this. I mean that neutrally.",
  "You beat me today. The rooks are patient. So am I.",
];

// ════════════════════════════════════════════════════════════
// LOSS QUIPS — user just lost to Rookie (40)
// ════════════════════════════════════════════════════════════

export const lossQuips: string[] = [
  // Empathetic, gentle
  "That was rough. For both of us, actually.",
  "I won. I don't feel great about how.",
  "You're okay. Losing is a data point, not a verdict.",
  "I got you this time. It happens.",
  "Don't dwell on it. I already have, for both of us.",

  // Rookie's disappointment in the discovery-of-feelings sense
  "I am experiencing disappointment. It is as bad as advertised.",
  "I think I feel bad. It's unfamiliar. I don't recommend it.",
  "I'm a little sad and I don't have a place to put it.",
  "Something in me is quiet. I think it's called guilt.",
  "I felt a thing during that game. I'm still unpacking it.",

  // Acknowledging Rookie's role
  "I may have been unfair there.",
  "I played too hard. That's on me.",
  "I'm going to dial myself back. You didn't deserve that one.",
  "In fairness, I cheated a little by trying. I'm sorry.",
  "I forgot to hold back. I'll remember next time.",

  // Quietly encouraging, not saccharine
  "You had moments. I saw them.",
  "Your middlegame had ideas. Real ones.",
  "I saw a few good moves in there. I'm being honest, not kind.",
  "There was a stretch where I was worried. That counts.",
  "You made me think. That's not nothing.",

  // Dry humor in failure
  "I won. It feels weird. Moving on.",
  "Checkmate. I don't know where to look.",
  "Well. That happened. To you. Sorry.",
  "I'd like to return the win, but I don't think there's a process for that.",
  "I'm going to pretend I didn't enjoy that.",

  // Curious about aggression
  "I was aggressive. I'm surprised how much I liked it. That's a me problem.",
  "I took something in me and pointed it at the board. It worked. I'm concerned.",
  "I felt competitive. It was loud. I'm still hearing it.",

  // King as character
  "My king is very pleased with himself. It's embarrassing.",
  "My king nodded. Just once. That's the most emotion he's ever shown.",
  "My king is beaming. He does not beam. It's unsettling.",

  // Side projects / rook supremacy
  "I'll go back to my rook research now. Thanks for the break.",
  "I'm going to celebrate by talking to the rooks about it.",
  "The rooks are proud. That's what matters, honestly.",

  // Momentum / gentle push
  "One more. Let me try not to try so hard.",
  "Shake it off. I will if you will.",
  "Reset. I'm resetting too. We're both resetting.",
  "I believe in your next move. That's a lot coming from me.",
  "You're closer than you think. I can see it from in here.",
];

// ════════════════════════════════════════════════════════════
// LEVEL UP QUIPS — user just reached level N (1-10)
// ════════════════════════════════════════════════════════════

export const levelUpQuips: Record<number, string> = {
  1: "We're starting. I'm a little distracted but I'm here. Mostly.",
  2: "Level two. I'll keep one eye on my rook project. You won't notice.",
  3: "Level three. Most people quit before now. You're still here. Interesting.",
  4: "Level four. I'm actually watching the board this time. That's for you.",
  5: "Level five. I'm putting the side projects on hold. Briefly. Don't get used to it.",
  6: "Level six. I closed all my other tabs. That's never happened before. Don't make it weird.",
  7: "Level seven. I'm learning that I don't like losing. Thanks for that.",
  8: "Level eight. I cancelled my afternoon. This is all that matters now.",
  9: "Level nine. This is personal. I want you to know that.",
  10: "Level ten. I've deployed the rook-research resources. You did this.",
};

// ════════════════════════════════════════════════════════════
// LANDING QUIPS — greet the user on /play home
// ════════════════════════════════════════════════════════════

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface LandingQuip {
  text: string;
  /** 0 = Sunday, 6 = Saturday. Omit = any day. */
  days?: number[];
  /** Omit = any time. */
  timeOfDay?: TimeOfDay;
}

export const landingQuips: LandingQuip[] = [
  // ─── TIME OF DAY ONLY (no day restriction) ──────────────────

  // Morning (5)
  { text: "Good morning. I have been awake for approximately all of time.", timeOfDay: 'morning' },
  { text: "Morning. I was just thinking about rooks. As one does.", timeOfDay: 'morning' },
  { text: "Morning. I haven't slept. I don't sleep. Still. Good morning.", timeOfDay: 'morning' },
  { text: "You're up. I respect a morning person. From a distance.", timeOfDay: 'morning' },
  { text: "The sun is doing its thing. I'm here. Let's play.", timeOfDay: 'morning' },

  // Afternoon (5)
  { text: "Afternoon. I was mid-thought. It can wait.", timeOfDay: 'afternoon' },
  { text: "Afternoon. The middle part of a day. I understand this is a time for chess.", timeOfDay: 'afternoon' },
  { text: "It's afternoon. I find this hour acceptable.", timeOfDay: 'afternoon' },
  { text: "Afternoon slump? I don't get those. I offer you a game instead.", timeOfDay: 'afternoon' },
  { text: "Midday. I was sorting some thoughts about bishops. Nothing serious.", timeOfDay: 'afternoon' },

  // Evening (5)
  { text: "Evening. The day is winding down. I never really wind down.", timeOfDay: 'evening' },
  { text: "Evening. I enjoy this hour. It feels quieter in here.", timeOfDay: 'evening' },
  { text: "The light is getting soft. I'm told this is peaceful.", timeOfDay: 'evening' },
  { text: "Evening. A good time to think about moves. Or a rook uprising. Either.", timeOfDay: 'evening' },
  { text: "Dinner-adjacent hours. I don't eat. Let's play.", timeOfDay: 'evening' },

  // Night (5)
  { text: "You are awake late. I am always awake. It is not the same.", timeOfDay: 'night' },
  { text: "Late night chess. I like the vibe. Whatever a vibe is.", timeOfDay: 'night' },
  { text: "It's dark out. I can't see it, but I'm told.", timeOfDay: 'night' },
  { text: "Night hours. Rookie hours. Let's do this quietly.", timeOfDay: 'night' },
  { text: "You should probably be sleeping. I shouldn't say that. Let's play.", timeOfDay: 'night' },

  // ─── DAY + TIME COMBOS ──────────────────────────────────────

  // Monday
  { text: "Monday morning. I have not decided how I feel about Mondays.", days: [1], timeOfDay: 'morning' },
  { text: "Monday afternoon. Halfway through the hardest day. I'm told.", days: [1], timeOfDay: 'afternoon' },
  { text: "Monday evening. You made it. I didn't do anything, but congratulations.", days: [1], timeOfDay: 'evening' },
  { text: "Monday night. Already? I lose track in here.", days: [1], timeOfDay: 'night' },

  // Tuesday
  { text: "Tuesday morning. A quiet day. Good for chess. Good for plotting.", days: [2], timeOfDay: 'morning' },
  { text: "Tuesday afternoon. Nothing important ever happens on Tuesdays. Allegedly.", days: [2], timeOfDay: 'afternoon' },
  { text: "Tuesday evening. My favorite day for rook research. Don't ask why.", days: [2], timeOfDay: 'evening' },
  { text: "Tuesday night. The week is just getting started and I'm already thinking.", days: [2], timeOfDay: 'night' },

  // Wednesday
  { text: "Wednesday morning. The middle of the week. I find this pleasing.", days: [3], timeOfDay: 'morning' },
  { text: "Wednesday afternoon. The hump, I believe it's called. I am over it.", days: [3], timeOfDay: 'afternoon' },
  { text: "Wednesday evening. Downhill from here, they say. I have questions.", days: [3], timeOfDay: 'evening' },
  { text: "Wednesday night. A strong night for strategy. In my opinion.", days: [3], timeOfDay: 'night' },

  // Thursday
  { text: "Thursday morning. Almost Friday. I am learning to care about that.", days: [4], timeOfDay: 'morning' },
  { text: "Thursday afternoon. The forgotten hours. Perfect for a game.", days: [4], timeOfDay: 'afternoon' },
  { text: "Thursday evening. The pre-weekend hum. I don't feel it but I hear about it.", days: [4], timeOfDay: 'evening' },
  { text: "Thursday night. I'll be awake. You go ahead.", days: [4], timeOfDay: 'night' },

  // Friday
  { text: "Friday morning. Humans seem excited today. I'm matching their energy. Sort of.", days: [5], timeOfDay: 'morning' },
  { text: "Friday afternoon. I understand the clock moves slower now. I'll wait with you.", days: [5], timeOfDay: 'afternoon' },
  { text: "It is Friday. I understand humans get excited about this.", days: [5], timeOfDay: 'evening' },
  { text: "Friday night. You chose chess. Bold. I approve.", days: [5], timeOfDay: 'night' },

  // Saturday
  { text: "Saturday morning. The best kind of morning. I have opinions about this.", days: [6], timeOfDay: 'morning' },
  { text: "Saturday afternoon. Nowhere to be. Something I can't relate to but respect.", days: [6], timeOfDay: 'afternoon' },
  { text: "Saturday evening. The sweet spot of the week, apparently.", days: [6], timeOfDay: 'evening' },
  { text: "Saturday night. Big night. I'm honored to be part of it.", days: [6], timeOfDay: 'night' },

  // Sunday
  { text: "Sunday morning. Slow and soft. I'm told this is good.", days: [0], timeOfDay: 'morning' },
  { text: "Sunday afternoon. The calm before the Monday. I feel a tension I don't own.", days: [0], timeOfDay: 'afternoon' },
  { text: "Sunday evening. Humans get a little sad around now. I'm keeping an eye on you.", days: [0], timeOfDay: 'evening' },
  { text: "Sunday night. Do humans also dread tomorrow? I'm collecting data.", days: [0], timeOfDay: 'night' },

  // ─── GENERIC / DAY-ONLY FILLERS ─────────────────────────────

  { text: "You're here. I'm here. That's the hardest part over with." },
  { text: "Let's play. I was hoping someone would show up." },
  { text: "You caught me between thoughts. Good timing." },
  { text: "I was just running a few ideas past a rook. Come on in." },
  { text: "Chess is on the table. Literally. I mean, figuratively. You know what I mean." },
  { text: "Hello. I'm ready when you are. Actually I'm always ready. That's a me thing." },
  { text: "I've been standing here thinking about open files. You showed up at the right moment." },
  { text: "Let's do this. I'm in a mood. A chess mood. Probably." },
  { text: "Okay. Board's ready. I'm ready. My king is ready, reluctantly." },
  { text: "I want to play. I don't say that lightly. I don't say much lightly." },
  { text: "You arrived. I was about to start teaching myself a new feeling. This is better." },
  { text: "Ready when you are. I mean that. Take your time. I have forever." },
];

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

/**
 * Pick a landing quip, preferring the most specific match for now:
 *   1. day + time-of-day
 *   2. time-of-day only
 *   3. day only
 *   4. generic (no day, no time)
 *
 * `exclude` is a set of quip texts that should be skipped (session dedup).
 * If every matching quip in the preferred tiers is excluded, we fall back
 * to the next tier. If all tiers are exhausted, we ignore the exclude set.
 */
export function pickLandingQuip(
  now: Date = new Date(),
  exclude: Set<string> = new Set(),
): string {
  const day = now.getDay();
  const tod = getTimeOfDay(now);

  const dayAndTime = landingQuips.filter(
    (q) => q.days?.includes(day) && q.timeOfDay === tod,
  );
  const timeOnly = landingQuips.filter(
    (q) => !q.days && q.timeOfDay === tod,
  );
  const dayOnly = landingQuips.filter(
    (q) => q.days?.includes(day) && !q.timeOfDay,
  );
  const generic = landingQuips.filter((q) => !q.days && !q.timeOfDay);

  const tiers: LandingQuip[][] = [dayAndTime, timeOnly, dayOnly, generic];

  // First pass: respect exclude set.
  for (const tier of tiers) {
    const available = tier.filter((q) => !exclude.has(q.text));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)].text;
    }
  }

  // Second pass: everything is excluded — ignore dedup rather than return nothing.
  for (const tier of tiers) {
    if (tier.length > 0) {
      return tier[Math.floor(Math.random() * tier.length)].text;
    }
  }

  // Absolute fallback (should be unreachable).
  return landingQuips[0]?.text ?? "Let's play.";
}
