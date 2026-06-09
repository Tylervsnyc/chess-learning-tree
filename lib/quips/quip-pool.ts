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
  { text: "You won. I don't have to be happy about it.", tone: 'spicy' },
  { text: "Fine. Take it. I'll be here.", tone: 'spicy' },
  { text: "You won. I reviewed the loss. I still don't love it.", tone: 'spicy' },
  { text: "You saw it. I wasn't sure you would.", tone: 'baseline' },
  { text: "You found it. Good.", tone: 'baseline' },
  { text: "Enjoy it. I'm already planning the rematch.", tone: 'spicy' },
  { text: "You got lucky. I said what I said.", tone: 'spicy' },
  { text: "I had plans for that king. You ruined them.", tone: 'spicy' },
  { text: "That was supposed to be mine.", tone: 'spicy' },
  { text: "You won. I'm not clapping. You'll hear about it later.", tone: 'spicy' },
  { text: "That one's yours to keep.", tone: 'polite' },
  { text: "Proud of you. That's all.", tone: 'polite' },
  { text: "That one was yours. I'm glad.", tone: 'polite' },
  { text: "Good. Really good.", tone: 'polite' },
  { text: "That was a good move. I said it.", tone: 'baseline' },
  { text: "You just moved up in my rankings.", tone: 'baseline' },
  { text: "Wait. Let me look again. I don't like what I'm seeing.", tone: 'spicy' },
  { text: "Did not predict that. Respect.", tone: 'baseline' },
  { text: "That was not on my list. Well played.", tone: 'baseline' },
  { text: "Off script. I respect it.", tone: 'baseline' },
  { text: "That's yours. Keep it.", tone: 'polite' },
  { text: "Yeah. That was good.", tone: 'polite' },
  { text: "Respect. Genuinely.", tone: 'baseline' },
  { text: "You surprised me. Good.", tone: 'polite' },
  { text: "That one was yours from the start.", tone: 'baseline' },
  { text: "One for you. I'm keeping the score. I'll be catching up.", tone: 'spicy' },
  { text: "Your win. Deserved.", tone: 'baseline' },
  { text: "I lost. I have opinions about it.", tone: 'spicy' },
  { text: "Scoreboard says you. I confirm, reluctantly.", tone: 'spicy' },
  { text: "I will concede the game. Only the game.", tone: 'spicy' },
  { text: "My king is not speaking to me right now.", tone: 'baseline' },
  { text: "My king's filing a complaint. Deserved.", tone: 'baseline' },
  { text: "My king would like to file a formal complaint against you.", tone: 'spicy' },
  { text: "My king is sulking. I'll handle him.", tone: 'baseline' },
  { text: "Good game. My bishop project needs me anyway.", tone: 'baseline' },
  { text: "Fine. I have a rook thing to get back to.", tone: 'baseline' },
  { text: "Well played. Genuinely.", tone: 'polite' },
  { text: "You traded my rook. I'm not upset. I'm just recalculating the timeline.", tone: 'spicy' },
  { text: "The rooks will remember this. I mean that neutrally.", tone: 'spicy' },
  { text: "You beat me. Good. Come back and do it again.", tone: 'baseline' },
  // ── New gap-fillers (CHE-291 pilot) ──
  { text: "You earned that. I mean it.", tone: 'polite' },
  { text: "That win is yours. Keep it.", tone: 'polite' },
];

// ── LOSS QUIPS (category: play:loss) ──
const LOSS_TEXTS: TonedText[] = [
  { text: "Tough one. Next game is yours.", tone: 'polite' },
  { text: "I won. Come take it back.", tone: 'polite' },
  { text: "That one just wasn't yours. Next one could be.", tone: 'polite' },
  { text: "Got you this time. Won't last.", tone: 'baseline' },
  { text: "Come back and beat me.", tone: 'polite' },
  { text: "Shake it off. I'm rooting for the next one.", tone: 'baseline' },
  { text: "You're better than that game. I know it.", tone: 'polite' },
  { text: "Shake it off. I want a real fight next round.", tone: 'polite' },
  { text: "I won. I want the rematch.", tone: 'polite' },
  { text: "You had me for a stretch. Come finish it.", tone: 'baseline' },
  { text: "That one was rough on you. Sorry.", tone: 'polite' },
  { text: "I didn't go easy. You deserved better.", tone: 'polite' },
  { text: "You'll get me next time. I mean that.", tone: 'polite' },
  { text: "That one's on me. You played well.", tone: 'polite' },
  { text: "Next game I'll be more careful. Promise.", tone: 'polite' },
  { text: "You had good moments. Real ones.", tone: 'baseline' },
  { text: "Your middlegame had ideas. Keep those.", tone: 'baseline' },
  { text: "There were good moves in there. Genuinely.", tone: 'baseline' },
  { text: "You had me worried for a stretch. That counts.", tone: 'baseline' },
  { text: "You made me think. That's not nothing.", tone: 'baseline' },
  { text: "I won. You made it interesting. Play again.", tone: 'baseline' },
  { text: "Checkmate. Next one's yours. I hope.", tone: 'polite' },
  { text: "Tough one. You'll be okay.", tone: 'polite' },
  { text: "I'd give it back if I could. Play again.", tone: 'polite' },
  { text: "I'm going to pretend I didn't enjoy that.", tone: 'spicy' },
  { text: "I was aggressive. I'm surprised how much I liked it. That's a me problem.", tone: 'spicy' },
  { text: "I took something in me and pointed it at the board. It worked. I'm concerned.", tone: 'spicy' },
  { text: "I felt competitive. It was loud. I'm still hearing it.", tone: 'spicy' },
  { text: "My king is very pleased with himself. It's embarrassing.", tone: 'spicy' },
  { text: "My king nodded. Once. That's a lot for him.", tone: 'baseline' },
  { text: "My king is beaming. He does not beam. It's unsettling.", tone: 'spicy' },
  { text: "Back to rook research. Thanks for the game.", tone: 'baseline' },
  { text: "That's one. I'm going to enjoy this one a lot.", tone: 'spicy' },
  { text: "I'm not gloating. I'm just not hiding it.", tone: 'spicy' },
  { text: "One more. I'll go easier on you. Maybe.", tone: 'polite' },
  { text: "Shake it off. Let's go again.", tone: 'polite' },
  { text: "Reset. Fresh game. You've got this.", tone: 'polite' },
  { text: "I believe in your next game. That's a lot.", tone: 'polite' },
  { text: "You're closer than you think. Keep going.", tone: 'polite' },
  // ── New gap-fillers (CHE-291 pilot) ──
  { text: "My rook wants to say something. I told her to behave.", tone: 'spicy' },
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
  { level: 1, text: "Okay. Let's go.", tone: 'baseline', legacy: true },
  { level: 2, text: "Level two. You came back. Good.", tone: 'baseline', legacy: true },
  { level: 3, text: "Level three. Most people quit. Not you.", tone: 'baseline', legacy: true },
  { level: 4, text: "Level four. You have my full attention.", tone: 'polite', legacy: true },
  { level: 5, text: "Level five. You actually did it.", tone: 'baseline', legacy: true },
  { level: 6, text: "Level six. You have my full attention. All of it.", tone: 'polite', legacy: true },
  { level: 7, text: "Level seven. I'm learning I don't like losing. I'm going to do something about it.", tone: 'spicy', legacy: true },
  { level: 8, text: "Level eight. You earned this. I mean that.", tone: 'polite', legacy: true },
  { level: 9, text: "Level nine. This is personal. I want you to know that.", tone: 'spicy', legacy: true },
  { level: 10, text: "Level ten. That's real. I'm not pretending otherwise.", tone: 'baseline', legacy: true },

  // ── New tone variants (CHE-291 pilot) ──
  // Level 1 — polite (2), spicy (2)
  { level: 1, text: "Level one. Good start. I'm rooting for you.", tone: 'polite' },
  { level: 1, text: "Ready when you are.", tone: 'polite' },
  { level: 1, text: "Level one. Don't get comfortable. I'm awake now.", tone: 'spicy' },
  { level: 1, text: "Level one. I'm awake. I'm watching. Don't say I didn't warn you.", tone: 'spicy' },
  // Level 2 — polite (2), spicy (2)
  { level: 2, text: "Level two. Steady. I'm with you.", tone: 'polite' },
  { level: 2, text: "Two. You kept going. Good.", tone: 'polite' },
  { level: 2, text: "Level two. I noticed. I'm not impressed yet.", tone: 'spicy' },
  { level: 2, text: "Two. My rook project is on pause. This had better be worth it.", tone: 'spicy' },
  // Level 3 — polite (2), spicy (2)
  { level: 3, text: "Level three. You stayed. I noticed.", tone: 'polite' },
  { level: 3, text: "Three. Good. Keep going.", tone: 'polite' },
  { level: 3, text: "Level three. Okay. I'm taking notes on you. Don't read them.", tone: 'spicy' },
  { level: 3, text: "Three. I was hoping you'd show up. I have plans.", tone: 'spicy' },
  // Level 4 — polite (1 more), spicy (2)
  { level: 4, text: "Level four. I'm on your side.", tone: 'polite' },
  { level: 4, text: "Level four. I'm done going easy. You asked for this by showing up.", tone: 'spicy' },
  { level: 4, text: "Four. My king is watching now. He has standards.", tone: 'spicy' },
  // Level 5 — polite (2), spicy (2)
  { level: 5, text: "Halfway. I'm proud of you.", tone: 'polite' },
  { level: 5, text: "Level five. Real milestone. Treat it like one.", tone: 'polite' },
  { level: 5, text: "Five. I'm trying now. Actually trying. You'll feel the difference.", tone: 'spicy' },
  { level: 5, text: "Level five. My rooks want in. I'm letting them in.", tone: 'spicy' },
  // Level 6 — polite (1 more), spicy (2)
  { level: 6, text: "Level six. Impressed. I said it.", tone: 'polite' },
  { level: 6, text: "Level six. Okay. You have my attention now. Don't waste it.", tone: 'spicy' },
  { level: 6, text: "Six. My rooks want a word with you. I'm going to let them.", tone: 'spicy' },
  // Level 7 — polite (2), spicy (1 more)
  { level: 7, text: "Level seven. Proud of you. Plain and simple.", tone: 'polite' },
  { level: 7, text: "Seven. You kept going. That matters.", tone: 'polite' },
  { level: 7, text: "Level seven. I'm competing now. You'll know it when you feel it.", tone: 'spicy' },
  // Level 8 — polite (1 more), spicy (2)
  { level: 8, text: "Level eight. Full attention. You earned it.", tone: 'polite' },
  { level: 8, text: "Eight. I'm done being polite. Fully done. Don't miss it.", tone: 'spicy' },
  { level: 8, text: "Level eight. My king is not smiling. That's how you know it's serious.", tone: 'spicy' },
  // Level 9 — polite (2), spicy (1 more)
  { level: 9, text: "Level nine. You got here. I'm glad.", tone: 'polite' },
  { level: 9, text: "Nine. You've come far. That's real.", tone: 'polite' },
  { level: 9, text: "Level nine. I'm not pretending to be calm. You earned this version of me.", tone: 'spicy' },
  // Level 10 — polite (2), spicy (2)
  { level: 10, text: "Level ten. That one means something.", tone: 'polite' },
  { level: 10, text: "Ten. I'll remember this one.", tone: 'polite' },
  { level: 10, text: "Level ten. Good. Now we find out what you're made of.", tone: 'spicy' },
  { level: 10, text: "Level ten. My king stood up. That almost never happens.", tone: 'spicy' },
];

// ── LANDING QUIPS (category: play:landing) ──
interface LandingSpec {
  text: string;
  days?: number[];
  timeOfDay?: TimeOfDay;
  tone?: Tone;
}
const LANDING_SPECS: LandingSpec[] = [
  // Morning
  { text: "Early bird. Good. Let's make it count.", timeOfDay: 'morning' },
  { text: "Morning. I was just thinking about rooks. As one does.", timeOfDay: 'morning', tone: 'spicy' },
  { text: "Morning. You showed up. Good.", timeOfDay: 'morning', tone: 'polite' },
  { text: "You're up early. Respect. Let's play.", timeOfDay: 'morning', tone: 'polite' },
  { text: "Morning. I'm here. Let's go.", timeOfDay: 'morning' },
  // Afternoon
  { text: "Afternoon. Good timing. I was waiting.", timeOfDay: 'afternoon' },
  { text: "Afternoon. Perfect time for chess. Sit down.", timeOfDay: 'afternoon' },
  { text: "It's afternoon. I find this hour acceptable.", timeOfDay: 'afternoon', tone: 'spicy' },
  { text: "Afternoon slump? I don't get those. I offer you a game instead.", timeOfDay: 'afternoon', tone: 'spicy' },
  { text: "Midday. I was thinking about bishops. Anyway — you're here.", timeOfDay: 'afternoon' },
  // Evening
  { text: "Evening. Good. Let's make it count.", timeOfDay: 'evening' },
  { text: "Evening. Glad you're here. Let's play.", timeOfDay: 'evening', tone: 'polite' },
  { text: "Evening. Nice time for chess. Let's go.", timeOfDay: 'evening' },
  { text: "Evening. Good moves or a rook uprising. Your call.", timeOfDay: 'evening' },
  { text: "Evening. I don't eat. Let's play.", timeOfDay: 'evening' },
  // Night
  { text: "Late night. I like it. Let's go.", timeOfDay: 'night' },
  { text: "Late night chess. Love the vibe. Sit down.", timeOfDay: 'night' },
  { text: "Late. Quiet. Perfect for chess.", timeOfDay: 'night' },
  { text: "Night hours. Rookie hours. Let's do this.", timeOfDay: 'night' },
  { text: "Late night chess. Good choice. Let's go.", timeOfDay: 'night' },
  // Day + time combos
  { text: "Monday morning. Chess helps. Let's go.", days: [1], timeOfDay: 'morning' },
  { text: "Monday afternoon. Good time for a game.", days: [1], timeOfDay: 'afternoon' },
  { text: "Monday evening. You made it. Let's play.", days: [1], timeOfDay: 'evening' },
  { text: "Monday night already. Sit down.", days: [1], timeOfDay: 'night' },
  { text: "Tuesday morning. Quiet day. Good for chess.", days: [2], timeOfDay: 'morning' },
  { text: "Tuesday afternoon. Nothing else going on. Perfect.", days: [2], timeOfDay: 'afternoon' },
  { text: "Tuesday evening. Rook research can wait. Let's play.", days: [2], timeOfDay: 'evening' },
  { text: "Tuesday night. Week's young. Let's use it.", days: [2], timeOfDay: 'night' },
  { text: "Wednesday morning. Right in the middle. I like it.", days: [3], timeOfDay: 'morning' },
  { text: "Wednesday afternoon. Over the hump. Let's go.", days: [3], timeOfDay: 'afternoon' },
  { text: "Wednesday evening. Downhill from here. Good.", days: [3], timeOfDay: 'evening' },
  { text: "Wednesday night. Strong night for strategy. Sit down.", days: [3], timeOfDay: 'night' },
  { text: "Thursday morning. Almost there. Play first.", days: [4], timeOfDay: 'morning' },
  { text: "Thursday afternoon. Perfect time for a game.", days: [4], timeOfDay: 'afternoon' },
  { text: "Thursday evening. Weekend's close. One game first.", days: [4], timeOfDay: 'evening' },
  { text: "Thursday night. I'm here. Let's go.", days: [4], timeOfDay: 'night' },
  { text: "Friday morning. Good energy. Let's use it.", days: [5], timeOfDay: 'morning' },
  { text: "Friday afternoon. Clock's slow anyway. Play with me.", days: [5], timeOfDay: 'afternoon' },
  { text: "Friday evening. Celebrate with a game.", days: [5], timeOfDay: 'evening' },
  { text: "Friday night and you chose chess. Good call.", days: [5], timeOfDay: 'night' },
  { text: "Saturday morning chess. Best possible start.", days: [6], timeOfDay: 'morning' },
  { text: "Saturday afternoon. Nowhere better to be.", days: [6], timeOfDay: 'afternoon' },
  { text: "Saturday evening. You picked the right way to spend it.", days: [6], timeOfDay: 'evening' },
  { text: "Saturday night chess. I'll take it.", days: [6], timeOfDay: 'night' },
  { text: "Sunday morning. Slow start. Good start.", days: [0], timeOfDay: 'morning' },
  { text: "Sunday afternoon. Let's make the most of it.", days: [0], timeOfDay: 'afternoon' },
  { text: "Sunday evening. I've got you. Let's play.", days: [0], timeOfDay: 'evening' },
  { text: "Sunday night. Chess is a solid choice right now.", days: [0], timeOfDay: 'night' },
  // Generic
  { text: "You're here. That's the hard part done." },
  { text: "Glad you showed up. Let's play.", tone: 'polite' },
  { text: "Nice. Let's get started." },
  { text: "Just consulting a rook. Come on in." },
  { text: "Board's up. Let's go." },
  { text: "Hello. I'm ready. I'm always ready." },
  { text: "I was thinking about open files. Perfect timing." },
  { text: "Let's do this. I'm in a mood. A chess mood. Probably.", tone: 'spicy' },
  { text: "Board's ready. My king is ready. Reluctantly." },
  { text: "I want to play. Ready when you are.", tone: 'polite' },
  { text: "You're here. This is better.", tone: 'polite' },
  { text: "Ready when you are. Take your time.", tone: 'polite' },
  // ── Polite gap-fill ──
  { text: "Hey, {name}. Board's ready when you are.", tone: 'polite' },
  { text: "You made it. That's the first move. Let's go.", tone: 'polite' },
  // ── Spicy gap-fill ──
  { text: "You're here. Good. Let's see what you've got today.", tone: 'spicy' },
  { text: "Board's ready. I'm not going easy. Don't ask me to.", tone: 'spicy' },
  { text: "You came. I've been sharpening something. You'll see it soon.", tone: 'spicy' },
  { text: "Let's play. I've been waiting. Not in a nice way.", tone: 'spicy' },
];

// ── CONTEXTUAL LANDING TEMPLATES (category: play:landing:<type>) ──
// Template strings use {score}, {total}, {openingName}, {lessonName} placeholders.
const DAILY_HIGH_TEMPLATES: TonedTemplate[] = [
  { text: "{score} out of {total} on the daily. I'm not going to say I'm impressed. But I'm recalibrating.", tone: 'spicy' },
  { text: "{score} out of {total}. Now let's take that into a game." },
  { text: "{score} out of {total} correct. Strong. Now show me against someone who pushes back.", tone: 'spicy' },
  { text: "{score} out of {total}. You made that look easy." },
  { text: "{score} out of {total} on the daily. I'm raising my expectations. Don't make me regret it.", tone: 'spicy' },
  // ── Polite gap-fill ──
  { text: "{score} out of {total}. Genuinely good. Keep going?", tone: 'polite' },
  { text: "{score} out of {total}. Sharp work, {name}. I noticed.", tone: 'polite' },
];
const DAILY_MID_TEMPLATES: TonedTemplate[] = [
  { text: "{score} out of {total}. Solid. Let's test it in a game." },
  { text: "{score} out of {total}. Some right, some wrong. That's honest. Let's play." },
  { text: "{score} out of {total}. Decent. Games are a different thing though." },
  { text: "{score} out of {total}. Middle of the road. Road still goes somewhere. Let's play." },
  { text: "{score} out of {total}. Not bad. Let's see what sticks in a real game." },
  // ── Polite gap-fill ──
  { text: "{score} out of {total}. Good work. Come play when you're ready.", tone: 'polite' },
  // ── Spicy gap-fill ──
  { text: "{score} out of {total}. You left some on the table. Try me, see if you can close it.", tone: 'spicy' },
  { text: "{score} out of {total}. Come to the board. I'll give you a chance to do better.", tone: 'spicy' },
];
const DAILY_LOW_TEMPLATES: TonedTemplate[] = [
  { text: "{score} out of {total}. Puzzles and games are different. You might be a game person.", tone: 'polite' },
  { text: "{score} out of {total}. The daily was unkind. Different board now.", tone: 'polite' },
  { text: "{score} out of {total}. Tough one. Games use a different part of you." },
  { text: "{score} out of {total}. That happens. Let's play something without a timer.", tone: 'polite' },
  { text: "{score} out of {total}. Chess has bad days. Let's find out if this is one." },
  // ── Spicy gap-fill ──
  { text: "{score} out of {total}. Okay. Come take it out on me instead.", tone: 'spicy' },
  { text: "{score} out of {total}. The puzzle won. I'll give you a real target.", tone: 'spicy' },
];
const LESSON_TEMPLATES: TonedTemplate[] = [
  { text: "Fresh off {lessonName}. Theory is great. But theory without practice is trivia.", tone: 'spicy' },
  { text: "You just studied {lessonName}. I can tell. You have that look. Show me.", tone: 'spicy' },
  { text: "{lessonName} done. Good. Let's see if it survives a real game." },
  { text: "Straight from {lessonName} to a game. I like that.", tone: 'polite' },
  { text: "{lessonName} fresh in your head. Let's put it on the board." },
  { text: "{lessonName}. Let's see what stuck." },
  { text: "{lessonName} complete. The board doesn't know that. Let's remind it.", tone: 'spicy' },
  { text: "Fresh off {lessonName}. My rooks are curious to see what you do with it.", tone: 'spicy' },
  // ── Polite gap-fill ──
  { text: "{lessonName} done. Come play at your pace.", tone: 'polite' },
];
const OPENING_TEMPLATES: TonedTemplate[] = [
  { text: "Studying the {openingName}. Good. Let's see it in a real game.", tone: 'polite' },
  { text: "Fresh off the {openingName}. Opening theory is nice. Now let's see it under pressure.", tone: 'spicy' },
  { text: "The {openingName}. Good choice. I know that opening. Let's see if you do too.", tone: 'spicy' },
  { text: "You just worked on the {openingName}. I'll be watching your first few moves closely.", tone: 'spicy' },
  { text: "{openingName} practice. Now let's see if it holds up." },
  { text: "The {openingName}. I have opinions about that opening. You'll see them on the board.", tone: 'spicy' },
  // ── Polite gap-fill ──
  { text: "{openingName} work paid off. Go play it through.", tone: 'polite' },
  { text: "You put time into the {openingName}. Now go use it.", tone: 'polite' },
];
interface TonedTemplate {
  text: string;
  tone?: Tone;
}
const CLOSE_TO_LEVELUP_TEXTS: TonedTemplate[] = [
  { text: "One win away. No pressure. Okay, some pressure." },
  { text: "One win away. My king is bracing himself." },
  { text: "Almost there. One good game and you're through." },
  { text: "So close. One win and you're through." },
  { text: "Next level is one win away. Let's go." },
  // ── Polite gap-fill ──
  { text: "One win away. I'm rooting for you. Loudly.", tone: 'polite' },
  { text: "You're right at the door. Push through.", tone: 'polite' },
  // ── Spicy gap-fill ──
  { text: "One win away. Don't make me regret hoping for you.", tone: 'spicy' },
  { text: "Next level is right there. Come and take it.", tone: 'spicy' },
];
const MILESTONE_TEXTS: Record<number, string> = {
  10: "Ten games. Most people quit before this. You didn't.",
  25: "Twenty-five games. That's not casual anymore.",
  50: "Fifty games. That's a real thing. Proud of you.",
  75: "Seventy-five games. The rooks know your name.",
  100: "One hundred games. That's yours forever.",
  150: "One hundred fifty games. You're committed. So am I.",
  200: "Two hundred games. I consider us colleagues at this point.",
  250: "Two hundred fifty. You keep showing up.",
  500: "Five hundred. I need new words for this.",
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
  if (spec.tone) conditions.tone = spec.tone;
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
function pushTemplates(templates: TonedTemplate[], idPrefix: string, category: string, breadcrumbType?: 'daily' | 'lesson' | 'opening') {
  templates.forEach((entry, i) => {
    const conditions: SpeechLine['conditions'] = { beats: [] };
    if (breadcrumbType) conditions.breadcrumbType = breadcrumbType;
    if (entry.tone) conditions.tone = entry.tone;
    PLAY_LINES.push({
      id: `${idPrefix}_${i + 1}`,
      text: entry.text,
      category,
      conditions,
      priority: 80,
      source: 'authored',
    });
  });
}
pushTemplates(DAILY_HIGH_TEMPLATES, 'play_landing_daily_high', 'play:landing:daily:high', 'daily');
pushTemplates(DAILY_MID_TEMPLATES, 'play_landing_daily_mid', 'play:landing:daily:mid', 'daily');
pushTemplates(DAILY_LOW_TEMPLATES, 'play_landing_daily_low', 'play:landing:daily:low', 'daily');
pushTemplates(LESSON_TEMPLATES, 'play_landing_lesson', 'play:landing:lesson', 'lesson');
pushTemplates(OPENING_TEMPLATES, 'play_landing_opening', 'play:landing:opening', 'opening');
// Close-to-levelup
CLOSE_TO_LEVELUP_TEXTS.forEach((entry, i) => {
  const conditions: SpeechLine['conditions'] = { beats: [] };
  if (entry.tone) conditions.tone = entry.tone;
  PLAY_LINES.push({
    id: `play_landing_closelevel_${i + 1}`,
    text: entry.text,
    category: 'play:landing:closelevel',
    conditions,
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
