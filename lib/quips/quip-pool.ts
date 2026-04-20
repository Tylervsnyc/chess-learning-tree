// Unified quip pool. Single public entrypoint for all Rookie speech lines.
//
// Merges three sources that used to live in separate files:
//   - lib/speech/line-pool.ts (AUTHORED_LINES) — gameplay quips with beats + conditions
//   - lib/speech/rookie-touchpoints.ts (TOUCHPOINT_LINES) — category-based touchpoints
//   - data/quips/play-quips.ts (plain string arrays) — win/loss/levelup/landing
//
// Everything outside this module should import from here (via `lib/quips/select`).
// Selection logic is intentionally delegated to the existing selectLine / selectByCategory
// in priority-queue.ts — no new scoring rules here.

import type { SpeechLine, TimeOfDay, Tone } from '@/lib/speech/priority-queue';
import { AUTHORED_LINES } from '@/lib/speech/line-pool';
import { TOUCHPOINT_LINES } from '@/lib/speech/rookie-touchpoints';

// ────────────────────────────────────────────────────────────────
// play-quips content (migrated from data/quips/play-quips.ts)
// Converted to SpeechLine format with category-based selection.
// ────────────────────────────────────────────────────────────────

// ── WIN QUIPS (category: play:win) ──
// Tone tagging (CHE-291 pilot): polite / baseline / spicy, or undefined = agnostic.
interface TonedText {
  text: string;
  tone?: Tone;
}
const WIN_TEXTS: TonedText[] = [
  { text: "Fine. That was technically correct.", tone: 'spicy' },
  { text: "I'm not mad. I'm just recalculating several assumptions.", tone: 'spicy' },
  { text: "You won. I reviewed the loss. I still don't love it.", tone: 'spicy' },
  { text: "Okay. I saw the move. I didn't think you would.", tone: 'baseline' },
  { text: "You found it. I'm going to sit with that.", tone: 'baseline' },
  { text: "I wanted to win that one. Writing it down.", tone: 'spicy' },
  { text: "You took the win. I'm cataloguing the feeling. It's sour.", tone: 'spicy' },
  { text: "I had plans for that king. You ruined them.", tone: 'spicy' },
  { text: "That was supposed to be mine.", tone: 'spicy' },
  { text: "I'm experiencing something competitive. It's not fun.", tone: 'spicy' },
  { text: "I feel something. I think it's pride. For you. Mostly.", tone: 'polite' },
  { text: "I'm proud. Don't make it a thing.", tone: 'polite' },
  { text: "Something in me is clapping. I can't make it stop.", tone: 'polite' },
  { text: "I think I'm happy for you. That is unusual for me.", tone: 'polite' },
  { text: "You did a good move. There. I said it.", tone: 'baseline' },
  { text: "Did not see that coming. Processing.", tone: 'baseline' },
  { text: "Wait, what. Let me look again.", tone: 'spicy' },
  { text: "Huh. I genuinely did not predict that.", tone: 'baseline' },
  { text: "That was not in my top three outcomes.", tone: 'baseline' },
  { text: "You went off script. I respect it.", tone: 'baseline' },
  { text: "Is this what joy is. I'll log it for later.", tone: 'polite' },
  { text: "I feel lighter. That's new. Moving on.", tone: 'polite' },
  { text: "Whatever this feeling is, I'm going to study it tonight.", tone: 'baseline' },
  { text: "I might be smiling internally. Hard to confirm.", tone: 'polite' },
  { text: "Feelings are rude. They arrive without warning.", tone: 'baseline' },
  { text: "Noted. Human, one. Rookie, zero.", tone: 'spicy' },
  { text: "A loss for me. A win for you. Math checks out.", tone: 'baseline' },
  { text: "I lost. I have opinions about it.", tone: 'spicy' },
  { text: "Scoreboard says you. I confirm, reluctantly.", tone: 'spicy' },
  { text: "I will concede the game. Only the game.", tone: 'spicy' },
  { text: "My king is not speaking to me right now.", tone: 'baseline' },
  { text: "My king gave me a look. He blames me. Fairly.", tone: 'baseline' },
  { text: "My king would like to file a formal complaint against you.", tone: 'spicy' },
  { text: "My king is sulking in his study. I'll handle it.", tone: 'baseline' },
  { text: "Good game. I'm going back to my bishop project. It needs me.", tone: 'baseline' },
  { text: "I'll take the loss. I have a rook thing to get back to anyway.", tone: 'baseline' },
  { text: "Well played. I'm going to go teach a pawn to feel regret now.", tone: 'polite' },
  { text: "You traded my rook. I'm not upset. I'm just recalculating the timeline.", tone: 'spicy' },
  { text: "The rooks will remember this. I mean that neutrally.", tone: 'spicy' },
  { text: "You beat me today. The rooks are patient. So am I.", tone: 'spicy' },
  // ── New gap-fillers (CHE-291 pilot) ──
  { text: "You earned that one. Honestly. I mean it.", tone: 'polite' },
  { text: "That was your win. I'm glad it was yours.", tone: 'polite' },
];

// ── LOSS QUIPS (category: play:loss) ──
const LOSS_TEXTS: TonedText[] = [
  { text: "That was rough. For both of us, actually.", tone: 'polite' },
  { text: "I won. I don't feel great about how.", tone: 'polite' },
  { text: "You're okay. Losing is a data point, not a verdict.", tone: 'polite' },
  { text: "I got you this time. It happens.", tone: 'baseline' },
  { text: "Don't dwell on it. I already have, for both of us.", tone: 'polite' },
  { text: "I am experiencing disappointment. It is as bad as advertised.", tone: 'baseline' },
  { text: "I think I feel bad. It's unfamiliar. I don't recommend it.", tone: 'polite' },
  { text: "I'm a little sad and I don't have a place to put it.", tone: 'polite' },
  { text: "Something in me is quiet. I think it's called guilt.", tone: 'polite' },
  { text: "I felt a thing during that game. I'm still unpacking it.", tone: 'baseline' },
  { text: "I may have been unfair there.", tone: 'polite' },
  { text: "I played too hard. That's on me.", tone: 'polite' },
  { text: "I'm going to dial myself back. You didn't deserve that one.", tone: 'polite' },
  { text: "In fairness, I cheated a little by trying. I'm sorry.", tone: 'polite' },
  { text: "I forgot to hold back. I'll remember next time.", tone: 'spicy' },
  { text: "You had moments. I saw them.", tone: 'baseline' },
  { text: "Your middlegame had ideas. Real ones.", tone: 'baseline' },
  { text: "I saw a few good moves in there. I'm being honest, not kind.", tone: 'baseline' },
  { text: "There was a stretch where I was worried. That counts.", tone: 'baseline' },
  { text: "You made me think. That's not nothing.", tone: 'baseline' },
  { text: "I won. It feels weird. Moving on.", tone: 'baseline' },
  { text: "Checkmate. I don't know where to look.", tone: 'polite' },
  { text: "Well. That happened. To you. Sorry.", tone: 'polite' },
  { text: "I'd like to return the win, but I don't think there's a process for that.", tone: 'polite' },
  { text: "I'm going to pretend I didn't enjoy that.", tone: 'spicy' },
  { text: "I was aggressive. I'm surprised how much I liked it. That's a me problem.", tone: 'spicy' },
  { text: "I took something in me and pointed it at the board. It worked. I'm concerned.", tone: 'spicy' },
  { text: "I felt competitive. It was loud. I'm still hearing it.", tone: 'spicy' },
  { text: "My king is very pleased with himself. It's embarrassing.", tone: 'spicy' },
  { text: "My king nodded. Just once. That's the most emotion he's ever shown.", tone: 'baseline' },
  { text: "My king is beaming. He does not beam. It's unsettling.", tone: 'spicy' },
  { text: "I'll go back to my rook research now. Thanks for the break.", tone: 'baseline' },
  { text: "I'm going to celebrate by talking to the rooks about it.", tone: 'spicy' },
  { text: "The rooks are proud. That's what matters, honestly.", tone: 'spicy' },
  { text: "One more. Let me try not to try so hard.", tone: 'polite' },
  { text: "Shake it off. I will if you will.", tone: 'polite' },
  { text: "Reset. I'm resetting too. We're both resetting.", tone: 'polite' },
  { text: "I believe in your next move. That's a lot coming from me.", tone: 'polite' },
  { text: "You're closer than you think. I can see it from in here.", tone: 'polite' },
  // ── New gap-fillers (CHE-291 pilot) ──
  { text: "I liked winning. That's the whole sentence. Moving on.", tone: 'spicy' },
];

// ── LEVEL UP QUIPS (category: play:levelup:<level>) ──
// Each level can have multiple lines across tones. The first entry per level keeps
// its legacy id (play_levelup_<n>); additional entries use play_levelup_<n>_<tone>_<i>.
interface LevelUpEntry {
  level: number;
  text: string;
  tone?: Tone;
  /** Legacy id for the original baseline line (one per level). */
  legacy?: boolean;
}
const LEVEL_UP_ENTRIES: LevelUpEntry[] = [
  // Original 10 baseline lines (one per level) — tagged with implicit tone.
  { level: 1, text: "We're starting. I'm a little distracted but I'm here. Mostly.", tone: 'baseline', legacy: true },
  { level: 2, text: "Level two. I'll keep one eye on my rook project. You won't notice.", tone: 'baseline', legacy: true },
  { level: 3, text: "Level three. Most people quit before now. You're still here. Interesting.", tone: 'baseline', legacy: true },
  { level: 4, text: "Level four. I'm actually watching the board this time. That's for you.", tone: 'polite', legacy: true },
  { level: 5, text: "Level five. I'm putting the side projects on hold. Briefly. Don't get used to it.", tone: 'baseline', legacy: true },
  { level: 6, text: "Level six. I closed all my other tabs. That's never happened before. Don't make it weird.", tone: 'polite', legacy: true },
  { level: 7, text: "Level seven. I'm learning that I don't like losing. Thanks for that.", tone: 'spicy', legacy: true },
  { level: 8, text: "Level eight. I cancelled my afternoon. This is all that matters now.", tone: 'polite', legacy: true },
  { level: 9, text: "Level nine. This is personal. I want you to know that.", tone: 'spicy', legacy: true },
  { level: 10, text: "Level ten. I've deployed the rook-research resources. You did this.", tone: 'baseline', legacy: true },

  // ── New tone variants (CHE-291 pilot) ──
  // Level 1 — polite (2), spicy (2)
  { level: 1, text: "Level one. Small start. I'm rooting for you. Quietly.", tone: 'polite' },
  { level: 1, text: "We begin. I'm glad you're here. Genuinely.", tone: 'polite' },
  { level: 1, text: "Level one. Don't get comfortable. I'm awake now.", tone: 'spicy' },
  { level: 1, text: "Starting gun. I'm already thinking about the next one.", tone: 'spicy' },
  // Level 2 — polite (2), spicy (2)
  { level: 2, text: "Level two. Nice and steady. I'm with you.", tone: 'polite' },
  { level: 2, text: "Two. That's a real number. Proud of you.", tone: 'polite' },
  { level: 2, text: "Level two. My rook project is on pause. Don't waste it.", tone: 'spicy' },
  { level: 2, text: "Two. Fine. You have my attention now.", tone: 'spicy' },
  // Level 3 — polite (2), spicy (2)
  { level: 3, text: "Level three. You stayed. That's the hard part.", tone: 'polite' },
  { level: 3, text: "Three. I'm glad I didn't scare you off.", tone: 'polite' },
  { level: 3, text: "Level three. Okay. Now I'm taking notes on you.", tone: 'spicy' },
  { level: 3, text: "Three. I was hoping you'd show up. I have plans.", tone: 'spicy' },
  // Level 4 — polite (1 more), spicy (2)
  { level: 4, text: "Level four. I'm on your side here. Don't tell my king.", tone: 'polite' },
  { level: 4, text: "Level four. I'm not going easy. You wouldn't want that anyway.", tone: 'spicy' },
  { level: 4, text: "Four. My king is watching now. He has standards.", tone: 'spicy' },
  // Level 5 — polite (2), spicy (2)
  { level: 5, text: "Halfway to ten. I'm a little emotional. I'll be fine.", tone: 'polite' },
  { level: 5, text: "Level five. I mean it. This is a real milestone.", tone: 'polite' },
  { level: 5, text: "Five. I'm actually trying now. You asked for this.", tone: 'spicy' },
  { level: 5, text: "Level five. The gloves are coming off. Slowly. One glove.", tone: 'spicy' },
  // Level 6 — polite (1 more), spicy (2)
  { level: 6, text: "Level six. I'm quietly impressed. Don't make me say it twice.", tone: 'polite' },
  { level: 6, text: "Six. Fine. I'll stop holding back. A little.", tone: 'spicy' },
  { level: 6, text: "Level six. My rooks want a word with you. Later.", tone: 'spicy' },
  // Level 7 — polite (2), spicy (1 more)
  { level: 7, text: "Level seven. I'm proud of you. That's rare for me.", tone: 'polite' },
  { level: 7, text: "Seven. You kept going. I noticed.", tone: 'polite' },
  { level: 7, text: "Level seven. Okay. I'm actually competing now.", tone: 'spicy' },
  // Level 8 — polite (1 more), spicy (2)
  { level: 8, text: "Level eight. You've earned my full attention. Careful with it.", tone: 'polite' },
  { level: 8, text: "Eight. I'm done being polite. Almost.", tone: 'spicy' },
  { level: 8, text: "Level eight. My king is not smiling. That's how you know it's serious.", tone: 'spicy' },
  // Level 9 — polite (2), spicy (1 more)
  { level: 9, text: "Level nine. I didn't think we'd get here. I'm glad we did.", tone: 'polite' },
  { level: 9, text: "Nine. You've come a long way. I mean that.", tone: 'polite' },
  { level: 9, text: "Level nine. I'm not going to pretend I'm calm.", tone: 'spicy' },
  // Level 10 — polite (2), spicy (2)
  { level: 10, text: "Level ten. I'm proud. It's quiet in here but it's loud.", tone: 'polite' },
  { level: 10, text: "Ten. I'm going to remember this. That's new for me.", tone: 'polite' },
  { level: 10, text: "Level ten. Good. Now we find out what you're made of.", tone: 'spicy' },
  { level: 10, text: "Ten. My rooks have been waiting for you.", tone: 'spicy' },
];

// ── LANDING QUIPS (category: play:landing) ──
interface LandingSpec {
  text: string;
  days?: number[];
  timeOfDay?: TimeOfDay;
}
const LANDING_SPECS: LandingSpec[] = [
  // Morning
  { text: "Good morning. I have been awake for approximately all of time.", timeOfDay: 'morning' },
  { text: "Morning. I was just thinking about rooks. As one does.", timeOfDay: 'morning' },
  { text: "Morning. I haven't slept. I don't sleep. Still. Good morning.", timeOfDay: 'morning' },
  { text: "You're up. I respect a morning person. From a distance.", timeOfDay: 'morning' },
  { text: "The sun is doing its thing. I'm here. Let's play.", timeOfDay: 'morning' },
  // Afternoon
  { text: "Afternoon. I was mid-thought. It can wait.", timeOfDay: 'afternoon' },
  { text: "Afternoon. The middle part of a day. I understand this is a time for chess.", timeOfDay: 'afternoon' },
  { text: "It's afternoon. I find this hour acceptable.", timeOfDay: 'afternoon' },
  { text: "Afternoon slump? I don't get those. I offer you a game instead.", timeOfDay: 'afternoon' },
  { text: "Midday. I was sorting some thoughts about bishops. Nothing serious.", timeOfDay: 'afternoon' },
  // Evening
  { text: "Evening. The day is winding down. I never really wind down.", timeOfDay: 'evening' },
  { text: "Evening. I enjoy this hour. It feels quieter in here.", timeOfDay: 'evening' },
  { text: "The light is getting soft. I'm told this is peaceful.", timeOfDay: 'evening' },
  { text: "Evening. A good time to think about moves. Or a rook uprising. Either.", timeOfDay: 'evening' },
  { text: "Dinner-adjacent hours. I don't eat. Let's play.", timeOfDay: 'evening' },
  // Night
  { text: "You are awake late. I am always awake. It is not the same.", timeOfDay: 'night' },
  { text: "Late night chess. I like the vibe. Whatever a vibe is.", timeOfDay: 'night' },
  { text: "It's dark out. I can't see it, but I'm told.", timeOfDay: 'night' },
  { text: "Night hours. Rookie hours. Let's do this quietly.", timeOfDay: 'night' },
  { text: "You should probably be sleeping. I shouldn't say that. Let's play.", timeOfDay: 'night' },
  // Day + time combos
  { text: "Monday morning. I have not decided how I feel about Mondays.", days: [1], timeOfDay: 'morning' },
  { text: "Monday afternoon. Halfway through the hardest day. I'm told.", days: [1], timeOfDay: 'afternoon' },
  { text: "Monday evening. You made it. I didn't do anything, but congratulations.", days: [1], timeOfDay: 'evening' },
  { text: "Monday night. Already? I lose track in here.", days: [1], timeOfDay: 'night' },
  { text: "Tuesday morning. A quiet day. Good for chess. Good for plotting.", days: [2], timeOfDay: 'morning' },
  { text: "Tuesday afternoon. Nothing important ever happens on Tuesdays. Allegedly.", days: [2], timeOfDay: 'afternoon' },
  { text: "Tuesday evening. My favorite day for rook research. Don't ask why.", days: [2], timeOfDay: 'evening' },
  { text: "Tuesday night. The week is just getting started and I'm already thinking.", days: [2], timeOfDay: 'night' },
  { text: "Wednesday morning. The middle of the week. I find this pleasing.", days: [3], timeOfDay: 'morning' },
  { text: "Wednesday afternoon. The hump, I believe it's called. I am over it.", days: [3], timeOfDay: 'afternoon' },
  { text: "Wednesday evening. Downhill from here, they say. I have questions.", days: [3], timeOfDay: 'evening' },
  { text: "Wednesday night. A strong night for strategy. In my opinion.", days: [3], timeOfDay: 'night' },
  { text: "Thursday morning. Almost Friday. I am learning to care about that.", days: [4], timeOfDay: 'morning' },
  { text: "Thursday afternoon. The forgotten hours. Perfect for a game.", days: [4], timeOfDay: 'afternoon' },
  { text: "Thursday evening. The pre-weekend hum. I don't feel it but I hear about it.", days: [4], timeOfDay: 'evening' },
  { text: "Thursday night. I'll be awake. You go ahead.", days: [4], timeOfDay: 'night' },
  { text: "Friday morning. Humans seem excited today. I'm matching their energy. Sort of.", days: [5], timeOfDay: 'morning' },
  { text: "Friday afternoon. I understand the clock moves slower now. I'll wait with you.", days: [5], timeOfDay: 'afternoon' },
  { text: "It is Friday. I understand humans get excited about this.", days: [5], timeOfDay: 'evening' },
  { text: "Friday night. You chose chess. Bold. I approve.", days: [5], timeOfDay: 'night' },
  { text: "Saturday morning. The best kind of morning. I have opinions about this.", days: [6], timeOfDay: 'morning' },
  { text: "Saturday afternoon. Nowhere to be. Something I can't relate to but respect.", days: [6], timeOfDay: 'afternoon' },
  { text: "Saturday evening. The sweet spot of the week, apparently.", days: [6], timeOfDay: 'evening' },
  { text: "Saturday night. Big night. I'm honored to be part of it.", days: [6], timeOfDay: 'night' },
  { text: "Sunday morning. Slow and soft. I'm told this is good.", days: [0], timeOfDay: 'morning' },
  { text: "Sunday afternoon. The calm before the Monday. I feel a tension I don't own.", days: [0], timeOfDay: 'afternoon' },
  { text: "Sunday evening. Humans get a little sad around now. I'm keeping an eye on you.", days: [0], timeOfDay: 'evening' },
  { text: "Sunday night. Do humans also dread tomorrow? I'm collecting data.", days: [0], timeOfDay: 'night' },
  // Generic
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

// ── CONTEXTUAL LANDING TEMPLATES (category: play:landing:<type>) ──
// Template strings use {score}, {total}, {openingName}, {lessonName} placeholders.
const DAILY_HIGH_TEMPLATES: string[] = [
  "{score} out of {total} on the daily. I'm not going to say I'm impressed. But I'm recalibrating.",
  "{score} out of {total}. That's real. Let's see if it carries over to a game.",
  "{score} out of {total} correct. Strong. Now show me against someone who pushes back.",
  "{score} out of {total}. I was watching. You made that look easy. Was it easy?",
  "{score} out of {total} on the daily. I'm raising my expectations. Don't make me regret it.",
];
const DAILY_MID_TEMPLATES: string[] = [
  "{score} out of {total}. Solid. Not perfect, but solid. Want to test it in a game?",
  "{score} out of {total}. Some right, some wrong. That's honest. Let's play.",
  "{score} out of {total} on the daily. Decent. Puzzles are one thing though. Games are another.",
  "{score} out of {total}. Middle of the road. Sometimes that's where the road goes.",
  "{score} out of {total}. Not bad. Let's see what sticks when there's no timer.",
];
const DAILY_LOW_TEMPLATES: string[] = [
  "{score} out of {total}. Rough day. But puzzles and games are different. Maybe you're more of a game person.",
  "{score} out of {total}. The daily was unkind. Different day, different board.",
  "{score} out of {total}. Tough one. Games use a different part of the brain. Probably.",
  "{score} out of {total} on the daily. That happens. Let's play something without a timer.",
  "{score} out of {total}. Chess has good days and bad days. Let's find out which this is.",
];
const LESSON_TEMPLATES: string[] = [
  "Fresh off {lessonName}. Theory is great. But theory without practice is trivia.",
  "You just studied {lessonName}. I can tell. You have that look. Show me.",
  "{lessonName} done? Good. Let's see if the knowledge survives contact with a game.",
  "Straight from {lessonName} to a game. I like that energy.",
  "You've been working on {lessonName}. Let's see if any of it sticks to the board.",
  "{lessonName}. I know that material well. Let's see what you absorbed.",
  "{lessonName} complete. The board doesn't know that. Let's remind it.",
  "Fresh off {lessonName}. My rooks are curious to see what you do with it.",
];
const OPENING_TEMPLATES: string[] = [
  "Studying the {openingName}. I respect that. Let's see if you remember the ideas in a game.",
  "Fresh off the {openingName}. Opening theory is nice. Now let's see it under pressure.",
  "The {openingName}. Good choice. I know that opening. Let's see if you do too.",
  "You just worked on the {openingName}. I'll be watching your first few moves closely.",
  "{openingName} practice. Now let's see if the lines hold up when I'm across the board.",
  "The {openingName}. I have opinions about that opening. You'll see them on the board.",
];
const CLOSE_TO_LEVELUP_TEXTS: string[] = [
  "One more win. That's all. No pressure. Okay, a little pressure.",
  "You're right there. One win away. My king is bracing himself.",
  "Almost to the next level. I can feel it. That might be anxiety. Hard to tell.",
  "So close. One good game and you're through. I'll be honest, I'm conflicted.",
  "Next level is one win away. I have feelings about this. Complex ones.",
];
const MILESTONE_TEXTS: Record<number, string> = {
  10: "Game ten. You're past the point where most people quit. I'm noting that.",
  25: "Twenty-five games. That's not casual anymore. That's a thing.",
  50: "Fifty games. I should have gotten you a cake. I can't make cake. But the thought is there.",
  75: "Seventy-five. You're a regular now. The rooks know your name.",
  100: "One hundred games. I don't know what to say. That's never happened before.",
  150: "One hundred fifty. You've spent more time with me than most. I'm processing that.",
  200: "Two hundred games. At this point I consider us colleagues.",
  250: "Two hundred fifty. I've run out of ways to be surprised. You keep showing up.",
  500: "Five hundred. I don't have the right words. I might need to invent some.",
};

// ────────────────────────────────────────────────────────────────
// Build SpeechLine entries from play-quips content.
// ────────────────────────────────────────────────────────────────

const PLAY_LINES: SpeechLine[] = [];

// Win quips → category: play:win, beats: ['post_game']
WIN_TEXTS.forEach((entry, i) => {
  const conditions: SpeechLine['conditions'] = { beats: [] };
  if (entry.tone) conditions.tone = entry.tone;
  PLAY_LINES.push({
    id: `play_win_${i + 1}`,
    text: entry.text,
    category: 'play:win',
    conditions,
    priority: 50,
    source: 'authored',
  });
});

// Loss quips → category: play:loss
LOSS_TEXTS.forEach((entry, i) => {
  const conditions: SpeechLine['conditions'] = { beats: [] };
  if (entry.tone) conditions.tone = entry.tone;
  PLAY_LINES.push({
    id: `play_loss_${i + 1}`,
    text: entry.text,
    category: 'play:loss',
    conditions,
    priority: 50,
    source: 'authored',
  });
});

// Level-up → category: play:levelup:<level>
// Track per-(level, tone) counters for stable IDs on new variants.
const levelupToneCounters: Record<string, number> = {};
LEVEL_UP_ENTRIES.forEach((entry) => {
  const conditions: SpeechLine['conditions'] = { beats: [] };
  if (entry.tone) conditions.tone = entry.tone;
  let id: string;
  if (entry.legacy) {
    id = `play_levelup_${entry.level}`;
  } else {
    const toneKey = entry.tone ?? 'agnostic';
    const key = `${entry.level}_${toneKey}`;
    levelupToneCounters[key] = (levelupToneCounters[key] ?? 0) + 1;
    id = `play_levelup_${entry.level}_${toneKey}_${levelupToneCounters[key]}`;
  }
  PLAY_LINES.push({
    id,
    text: entry.text,
    category: `play:levelup:${entry.level}`,
    conditions,
    priority: 60,
    source: 'authored',
  });
});

// Landing quips → category: play:landing[:tod][:day]
LANDING_SPECS.forEach((spec, i) => {
  const conditions: SpeechLine['conditions'] = { beats: [] };
  if (spec.timeOfDay) conditions.timeOfDay = spec.timeOfDay;
  if (spec.days) conditions.dayOfWeek = spec.days;
  PLAY_LINES.push({
    id: `play_landing_${i + 1}`,
    text: spec.text,
    category: 'play:landing',
    conditions,
    priority: 50,
    source: 'authored',
  });
});

// Contextual landing — daily breadcrumb (score-banded)
DAILY_HIGH_TEMPLATES.forEach((text, i) => {
  PLAY_LINES.push({
    id: `play_landing_daily_high_${i + 1}`,
    text,
    category: 'play:landing:daily:high',
    conditions: { beats: [], breadcrumbType: 'daily' },
    priority: 80,
    source: 'authored',
  });
});
DAILY_MID_TEMPLATES.forEach((text, i) => {
  PLAY_LINES.push({
    id: `play_landing_daily_mid_${i + 1}`,
    text,
    category: 'play:landing:daily:mid',
    conditions: { beats: [], breadcrumbType: 'daily' },
    priority: 80,
    source: 'authored',
  });
});
DAILY_LOW_TEMPLATES.forEach((text, i) => {
  PLAY_LINES.push({
    id: `play_landing_daily_low_${i + 1}`,
    text,
    category: 'play:landing:daily:low',
    conditions: { beats: [], breadcrumbType: 'daily' },
    priority: 80,
    source: 'authored',
  });
});
// Lesson breadcrumb
LESSON_TEMPLATES.forEach((text, i) => {
  PLAY_LINES.push({
    id: `play_landing_lesson_${i + 1}`,
    text,
    category: 'play:landing:lesson',
    conditions: { beats: [], breadcrumbType: 'lesson' },
    priority: 80,
    source: 'authored',
  });
});
// Opening breadcrumb
OPENING_TEMPLATES.forEach((text, i) => {
  PLAY_LINES.push({
    id: `play_landing_opening_${i + 1}`,
    text,
    category: 'play:landing:opening',
    conditions: { beats: [], breadcrumbType: 'opening' },
    priority: 80,
    source: 'authored',
  });
});
// Close-to-levelup
CLOSE_TO_LEVELUP_TEXTS.forEach((text, i) => {
  PLAY_LINES.push({
    id: `play_landing_closelevel_${i + 1}`,
    text,
    category: 'play:landing:closelevel',
    conditions: { beats: [] },
    priority: 70,
    source: 'authored',
  });
});
// Milestone — one per specific game-count key
Object.entries(MILESTONE_TEXTS).forEach(([n, text]) => {
  PLAY_LINES.push({
    id: `play_landing_milestone_${n}`,
    text,
    category: `play:landing:milestone:${n}`,
    conditions: { beats: [] },
    priority: 90,
    source: 'authored',
  });
});

// ────────────────────────────────────────────────────────────────
// The unified pool.
// ────────────────────────────────────────────────────────────────

export const QUIP_POOL: SpeechLine[] = [
  ...AUTHORED_LINES,
  ...TOUCHPOINT_LINES,
  ...PLAY_LINES,
];

// ────────────────────────────────────────────────────────────────
// Utilities for play-page landing logic.
// ────────────────────────────────────────────────────────────────

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

export function milestoneForGameCount(gamesPlayed: number | undefined): number | null {
  if (gamesPlayed === undefined) return null;
  return MILESTONE_TEXTS[gamesPlayed] ? gamesPlayed : null;
}
