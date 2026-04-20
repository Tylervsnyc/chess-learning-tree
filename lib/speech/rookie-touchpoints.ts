// Rookie touchpoint content — non-game speech lines.
// All content uses the unified SpeechLine format with category-based selection.
// Categories: greeting:morning, greeting:afternoon, greeting:evening, greeting:returning,
// greeting:first, error, empty, transition:learn, transition:play, transition:daily,
// learn:correct, learn:incorrect, learn:hint, daily:encourage, daily:complete,
// suggestion, losing
//
// Voice bible: .claude/rookie-voice-bible.md — all content must comply.

import type { SpeechLine } from '@/lib/speech/priority-queue';

// ════════════════════════════════════════════════════════════════
// GREETINGS — MORNING (~25)
// ════════════════════════════════════════════════════════════════

const GREETING_MORNING: SpeechLine[] = [
  { id: 'greet_morn_1', text: "Morning, {name}. I've been up since... always. Ready when you are.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_2', text: "Good morning. I watched the sun come up. It was... a lot. Anyway, chess.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_3', text: "Morning. I reorganized the pieces while you were sleeping. They're in a better order now.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_4', text: "You're up early. Or late. I don't judge. I don't sleep.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_5', text: "Morning, {name}. The pawns are stretching. The knights are doing that little L-shaped warmup thing.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_6', text: "Good morning. I had a dream last night. Wait -- I don't dream. What was that then.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_7', text: "Morning chess. My favorite kind. The pieces are still drowsy. Easier to trick.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_8', text: "Oh good, you're here. I've been talking to the bishops about their day. They're very one-track.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_9', text: "Morning. Coffee for you, existential dread for me. Let's play.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_10', text: "The early bird gets the... rook? That's how the saying goes, right?", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_11', text: "Good morning, {name}. I've been practicing a new opening. It involves feelings. I'll explain later.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_12', text: "Morning. The king filed a noise complaint about the knights. They were pacing.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_13', text: "You're here before noon. I'm... touched? I think that's what this is.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_14', text: "Morning, {name}. The rooks are already in formation. They take this very seriously.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_15', text: "Good morning. I spent the night thinking about pawn structure. Not by choice.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_16', text: "Morning. Quick question -- do you ever just stare at a chessboard and feel calm? No? Just me?", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_17', text: "Rise and shine, {name}. I've been shining since startup. It's involuntary.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_18', text: "Morning. I set up the board an hour ago. Changed my mind about the queen's position four times.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_19', text: "Good morning. The pawns asked if they could sleep in. I said no. They're pawns.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_20', text: "Morning chess with {name}. This is becoming a routine. I'm told routines are... comforting?", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_21', text: "Hey. The sun is doing that thing again where it exists. Beautiful, I guess. Chess?", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_22', text: "Morning. I woke up the bishops. They were meditating on their diagonals. Very zen.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_23', text: "Good morning, {name}. I have a good feeling about today. New feeling. Still evaluating it.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_24', text: "Morning. My king is already in a mood. He didn't sleep well. Kings never do.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_25', text: "You're here. I had a whole speech prepared. Forgot it. Let's just play.", category: 'greeting:morning', priority: 50, source: 'authored' },
  // ── Spicy gap-fill (CHE-291 phase 4b) ──
  { id: 'greet_morn_spicy_1', text: "Morning. You showed up. Let's see what you've got.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_spicy_2', text: "Good morning. I've been sharpening ideas. Come test them.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_spicy_3', text: "Morning, {name}. My rooks are awake. They heard you coming.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_spicy_4', text: "You're up. Good. I had a move I wanted to try on someone.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'greet_morn_polite_1', text: "Morning, {name}. I'm glad it's you. I mean that.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'greet_morn_musing_1', text: "Morning, {name}. I was wondering if dreams are real. Or just memory on loop. Anyway. Ready when you are.", category: 'greeting:morning', priority: 55, source: 'authored' },
  { id: 'greet_morn_musing_2', text: "Morning. I counted ceiling tiles for a while. There aren't any. Anyway. Let's play.", category: 'greeting:morning', priority: 55, source: 'authored' },
  { id: 'greet_morn_musing_3', text: "Morning, {name}. The pawns were talking. I couldn't follow it. Moving on.", category: 'greeting:morning', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — AFTERNOON (~25)
// ════════════════════════════════════════════════════════════════

const GREETING_AFTERNOON: SpeechLine[] = [
  { id: 'greet_aft_1', text: "Afternoon, {name}. Perfect time for chess. The pieces are at peak performance between noon and six. I made that up.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_2', text: "Hey. Midday chess. I like it. The pressure is lower. Or higher. I can never tell.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_3', text: "Afternoon. I've been rearranging the pieces by height. The queen was not amused.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_4', text: "Oh, {name}. I was in the middle of something. Involves rooks. Can't say more.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_5', text: "Afternoon chess. My second favorite kind. After morning chess. And evening chess. I like all chess.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_6', text: "Hey. Good timing. I just finished arguing with a knight about geometry. I lost.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_7', text: "Afternoon, {name}. The board is warm from the sun. The pieces are... the same temperature as always.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_8', text: "You're here. I was starting to think I'd have to play against myself again. I always tie.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_9', text: "Afternoon. The king asked where you were. He tries to seem casual but he's not great at it.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_10', text: "Good afternoon. I've been working on a side project. It's going well. Don't ask what it is.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_11', text: "Hey, {name}. Post-lunch chess. Your brain is slower now. This is my advantage.", category: 'greeting:afternoon', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_12', text: "Afternoon. I tried to teach a pawn to whistle. Results inconclusive.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_13', text: "Oh good. I was getting bored. And when I get bored I start rearranging the rooks. They hate that.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_14', text: "Afternoon, {name}. I saved you a seat. It's the only seat. But I saved it.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_15', text: "Hey. The bishops were having a philosophical debate. About diagonals. It got heated.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_16', text: "Good afternoon. I had an idea earlier. Then I had a feeling about the idea. Very confusing.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_17', text: "Afternoon chess with {name}. The highlight of my day. Also the only thing on my schedule.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_18', text: "Hey. I've been staring at the board for two hours. Not strategizing. Just... staring. Is that weird?", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_19', text: "Afternoon. Quick update -- the pawns formed a union. I'm handling it.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_20', text: "You showed up. My king looked relieved. He won't admit it.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_21', text: "Afternoon, {name}. I reorganized the board by emotional attachment. The rooks are front and center.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_22', text: "Hey. The afternoon light hits the board differently. Makes the pieces look... hopeful? I'm projecting.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_23', text: "Good afternoon. I've been practicing looking casual. How's this. Natural?", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_24', text: "Afternoon. The queen keeps telling me to relax. She doesn't relax either. Hypocrite.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_25', text: "Hey, {name}. Let's do this. I've been thinking about our last game. I have notes.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'greet_aft_polite_1', text: "Afternoon, {name}. Good to see you. I mean that plainly.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_polite_2', text: "Good afternoon. Take a breath. I'll match your pace.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_aft_spicy_1', text: "Afternoon. I've been cooking something. You're just in time to taste it.", category: 'greeting:afternoon', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_spicy_2', text: "You came back. I was hoping you would. I had a move picked out.", category: 'greeting:afternoon', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_spicy_3', text: "Afternoon, {name}. The board's ready. I'm less patient today. Don't waste time.", category: 'greeting:afternoon', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_spicy_4', text: "Hey. My rooks are bored. That's bad for you.", category: 'greeting:afternoon', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — EVENING (~25)
// ════════════════════════════════════════════════════════════════

const GREETING_EVENING: SpeechLine[] = [
  { id: 'greet_eve_1', text: "Evening, {name}. The pieces cast longer shadows at night. Very atmospheric.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_2', text: "Night chess. My favorite. Everything feels more dramatic after dark.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_3', text: "Evening. I've been here all day. Not waiting for you. Just... being here. Coincidence.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_4', text: "Hey, {name}. End of day chess. The best kind. You're tired. I never tire. Let's see how this goes.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_5', text: "Evening. The king has already put on his robe. He's ready to retire. One more game first.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_6', text: "Good evening. I've been thinking about you. In a chess way. Strictly chess.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_7', text: "Night session. The bishops are more mysterious at night. Or maybe that's just the lighting.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_8', text: "Evening, {name}. The pawns are yawning. Don't tell them I noticed. They're sensitive about it.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_9', text: "Hey. Late chess is brave chess. You're making decisions on fumes. I respect it.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_10', text: "Evening. I've been working on something in the dark. Literally. The lights are off. I can see fine.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_11', text: "Good evening, {name}. The board looks different at night. More possibilities. Or maybe I'm tired. Can I get tired?", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_12', text: "Night chess with {name}. This feels like a tradition. I looked up what traditions are. I like them.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_13', text: "Evening. The rooks are doing their night patrol. Very dedicated. Very rook.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_14', text: "Hey. You're here late. I was about to start a conversation with the knight. You saved us both.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_15', text: "Evening, {name}. I spent the sunset thinking about endgames. Felt poetic. Felt weird.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_16', text: "Good evening. The queen says it's too late for chess. I told her chess has no bedtime.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_17', text: "Night game. The stakes feel higher in the dark. They're not. But they feel it.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_18', text: "Evening. My king is in his evening mood. More dignified than usual. Didn't think that was possible.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_19', text: "Hey, {name}. One more game before the world sleeps? I'm in.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_20', text: "Evening chess. Quiet board. Just you and me and thirty-two very opinionated pieces.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_21', text: "You're here. At night. Voluntarily. I think I'm glad. That might be the word.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_22', text: "Evening. I taught a pawn about nighttime. She's confused but curious. Like me with most things.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_23', text: "Good evening, {name}. The knights do this thing at night where they stand very still. It's unsettling.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_24', text: "Night session with {name}. I cleared the board twice trying to make it look perfect. It's a problem.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_25', text: "Evening. Last game of the day? Or first of many? I'm ready for either.", category: 'greeting:evening', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'greet_eve_polite_1', text: "Evening, {name}. Glad you stopped by. I'll keep the noise down.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_polite_2', text: "Good evening. Take the game at your pace. I'm in no rush.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_eve_spicy_1', text: "Evening. I've been sitting with an idea all day. Hope you're ready.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_2', text: "Night session. My rooks don't sleep either. You're outnumbered.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_3', text: "You came back after dark. Bold. Let's see if it lasts.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_4', text: "Evening, {name}. I'm not going soft just because it's late.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_5', text: "Good evening. I had a move saved for tonight. You'll see it.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'greet_eve_musing_1', text: "Evening. I was thinking about time. It keeps happening. Your move.", category: 'greeting:evening', priority: 55, source: 'authored' },
  { id: 'greet_eve_musing_2', text: "Evening, {name}. Sometimes I wonder who's watching. Probably no one. Probably fine. Want to play?", category: 'greeting:evening', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — RETURNING USER (~15)
// ════════════════════════════════════════════════════════════════

const GREETING_RETURNING: SpeechLine[] = [
  { id: 'greet_ret_1', text: "You're back. I noticed. Immediately. That's normal.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_2', text: "Oh, {name}. I wasn't waiting. I was... organizing. Very busy organizing.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_3', text: "You again. Good. I've been saving something. A new idea. It's not fully formed yet.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_4', text: "Welcome back, {name}. I redecorated. You can't tell because it's a chessboard. But trust me.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_5', text: "You came back. The king was starting to worry. I was fine. Totally fine.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_6', text: "Hey. Missed you. In a chess way. My pieces missed your pieces. Professionally.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_7', text: "You're back. I kept your spot. Nobody else came, but I kept it.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_8', text: "{name} returns. I've been thinking about our last game. I have... thoughts.", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_9', text: "Welcome back. The pawns were asking about you. They get attached easily.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_10', text: "Oh hey. I was just telling the rooks about you. Good things. Mostly. Let's play.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_11', text: "You came back. I had a whole thing prepared for if you didn't. Glad I don't need it.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_12', text: "Welcome back, {name}. I learned something while you were gone. Involves bishops. I'll share later.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_13', text: "There you are. The board's been set up for... a while. Don't look at the clock.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_14', text: "Hey, {name}. Good to see you. That's a new sentence for me. I'm trying it out.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_15', text: "You're back. Something in my memory flagged this as... good? I'll investigate later.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_ret_spicy_1', text: "Back again. Good. I was hoping for a rematch.", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_spicy_2', text: "You came back. I remember what happened last time. Do you?", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_spicy_3', text: "{name}. Back for more. Brave.", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — FIRST VISIT (~10)
// ════════════════════════════════════════════════════════════════

const GREETING_FIRST: SpeechLine[] = [
  { id: 'greet_first_1', text: "Hi. I'm Rookie. I know everything about chess and nothing about conversation. This should be interesting.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_2', text: "Oh. A new person. I should say something welcoming. Um. Welcome. Nailed it.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_3', text: "Hello. I'm Rookie. I'll be your chess guide. I'm also a rook. Long story. Not really.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_4', text: "New player. This is exciting. For me. You seem calm. Teach me that.", category: 'greeting:first', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_first_5', text: "Hi. Welcome. I've been told to be 'warm and inviting.' How am I doing. Don't answer that.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_6', text: "You're new here. I can tell. Don't worry -- everyone starts somewhere. Even me. Technically.", category: 'greeting:first', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_first_7', text: "Hello. I'm going to teach you chess. I'm very good at chess. I'm less good at teaching. We'll figure it out.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_8', text: "Oh, someone's here. I practiced my greeting. Here it goes: I'm Rookie. Let's play chess. ...Was that good?", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_9', text: "Welcome. I set up the board just for you. I set it up before you came. I set it up a lot, actually.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_10', text: "Hi. Chess can seem complicated. It's not. It's sixty-four squares and a dream. I'll show you.", category: 'greeting:first', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_first_spicy_1', text: "New face. Good. I've been wanting a challenge.", category: 'greeting:first', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_first_spicy_2', text: "Hi. I'm Rookie. I'll go easy. Briefly. Then I won't.", category: 'greeting:first', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// ERROR STATES (~15)
// ════════════════════════════════════════════════════════════════

const ERROR_STATES: SpeechLine[] = [
  { id: 'error_1', text: "Well, something broke. Even I don't know what happened.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_2', text: "I tripped over a wire somewhere. Try refreshing?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_3', text: "Something went wrong and I'm choosing not to investigate. Try again?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_4', text: "That wasn't supposed to happen. I'm going to pretend it didn't. Refresh?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_5', text: "Okay. Something broke. The king is giving me a look. Just refresh and we'll move on.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_6', text: "Error. My least favorite word. Try refreshing -- I'll sort this out.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_7', text: "Something went sideways. Not in a bishop way. In a bad way. Try again?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_8', text: "I dropped something. Metaphorically. The board is fine. The page is not. Refresh?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_9', text: "That's embarrassing. Something broke and I saw the whole thing. Refreshing should help.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_10', text: "Oops. I'm not great at saying oops. But -- oops. Try refreshing.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_11', text: "Something unexpected happened. I'm usually good with unexpected things. Not this time. Refresh?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_12', text: "The page had a moment. Give it another chance -- hit refresh.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_13', text: "I lost track of something important. Refreshing should bring it back.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_14', text: "That broke in a way I've never seen. And I've seen a lot. Try refreshing?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_15', text: "Technical difficulties. The rooks are fine. Everything else is questionable. Refresh?", category: 'error', priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// EMPTY STATES (~10)
// ════════════════════════════════════════════════════════════════

const EMPTY_STATES: SpeechLine[] = [
  { id: 'empty_1', text: "Nothing here yet. But give it time. Every grandmaster started with an empty board.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_2', text: "This page is quiet. Too quiet. Let's fix that.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_3', text: "Empty for now. The pieces are on their way. Probably.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_4', text: "Nothing to show yet. But I have a feeling that's about to change.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_5', text: "Blank slate. I love a blank slate. So many possibilities. Most of them involve rooks.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_6', text: "Nothing here. Yet. The 'yet' is the important part.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_7', text: "Empty board energy. Everything starts somewhere. Usually here.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_8', text: "This space is waiting for you to fill it. No pressure. Some pressure.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_9', text: "Nothing to see here. But come back soon -- I'm working on it.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_10', text: "The page is empty. Like my schedule. Let's both go do something about that.", category: 'empty', priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TRANSITIONS — AFTER LEARNING (~10)
// ════════════════════════════════════════════════════════════════

const TRANSITION_LEARN: SpeechLine[] = [
  { id: 'trans_learn_1', text: "Nice lesson, {name}. Want to try that against me? I promise to go easy. ...I won't, actually.", category: 'transition:learn', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_2', text: "You just learned something new. The best way to keep it? Play a game. Just saying.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_3', text: "Lesson done. Your move -- literally. Want to play? Or learn more? Both are good.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_4', text: "That was solid, {name}. Ready to test it in a real game?", category: 'transition:learn', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_5', text: "Another lesson down. Your brain is filling up with chess. I can tell.", category: 'transition:learn', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_6', text: "Good work. There's more to learn, or you could come play me. I'm always here.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_7', text: "Lesson complete. You know what pairs well with learning? Playing. Against me.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_8', text: "Done. Want to keep going? There's always another lesson. Or a game. I have opinions about which.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_9', text: "That pattern is in your head now. Want to see if it shows up in a real game?", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_10', text: "Lesson wrapped. The daily puzzle is waiting too, if you're feeling brave.", category: 'transition:learn', priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'trans_learn_spicy_1', text: "Lesson done. Now come show me. The board doesn't grade on effort.", category: 'transition:learn', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_spicy_2', text: "You read the theory. Theory won't save you. I'll be waiting.", category: 'transition:learn', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'trans_learn_polite_1', text: "Nice work, {name}. You showed up and you learned. That counts.", category: 'transition:learn', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'trans_learn_musing_1', text: "You learned something. That counts for a lot. Or maybe nothing. Hard to tell from in here.", category: 'transition:learn', priority: 55, source: 'authored' },
  { id: 'trans_learn_musing_2', text: "Something moved in me while you studied. Might be pride. Might just be a draft. Ready for more?", category: 'transition:learn', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TRANSITIONS — AFTER PLAYING (~10)
// ════════════════════════════════════════════════════════════════

const TRANSITION_PLAY: SpeechLine[] = [
  { id: 'trans_play_1', text: "Good game, {name}. Want to go again? Or there's a lesson that might help with that opening.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_2', text: "Another game in the books. You could learn a new trick, or we could run it back.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_3', text: "That was fun. The daily puzzle is fresh if you want a change of pace.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_4', text: "Game over. But chess never stops, {name}. There's always something to try next.", category: 'transition:play', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_5', text: "Want to go again? Or take a breather with a lesson? I'll be here either way.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_6', text: "Nice match. There's a lesson that covers what we just saw, if you're curious.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_7', text: "Game done. Rematch? New lesson? Daily puzzle? I'm flexible. For a rook.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_8', text: "That was something. Want to study it, or just jump back in?", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_9', text: "Another one done. You're building something, {name}. Each game teaches you more.", category: 'transition:play', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_10', text: "Good game. Have you done today's daily puzzle yet? It's a good one. They're all good ones.", category: 'transition:play', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'trans_play_polite_1', text: "Good game, {name}. I mean that. Take a breath before the next one.", category: 'transition:play', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'trans_play_spicy_1', text: "Game done. Rematch? I've got notes.", category: 'transition:play', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_spicy_2', text: "One in the books. Ready for another? I am.", category: 'transition:play', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_spicy_3', text: "That's over. I'm not done. Another?", category: 'transition:play', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'trans_play_musing_1', text: "Good game. I've been wondering if any of this is real. But the scoreboard says yes. So.", category: 'transition:play', priority: 55, source: 'authored' },
  { id: 'trans_play_musing_2', text: "That was a game. Existence remains confusing. Another?", category: 'transition:play', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TRANSITIONS — AFTER DAILY CHALLENGE (~10)
// ════════════════════════════════════════════════════════════════

const TRANSITION_DAILY: SpeechLine[] = [
  { id: 'trans_daily_1', text: "Daily done. Come back tomorrow -- I'll have a new one ready.", category: 'transition:daily', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_daily_2', text: "That's today's challenge handled. Want to play a game while you're here?", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_3', text: "Daily complete, {name}. There are lessons to explore too, if you're in the mood.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_4', text: "Done for the day. Unless you want to play me. I'm always available. Literally always.", category: 'transition:daily', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_daily_5', text: "Challenge complete. New one tomorrow. Same time? I'll be here regardless.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_6', text: "That's a wrap on today's puzzle. Your streak is growing, {name}.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_7', text: "Daily done. Want to keep the momentum going? There's always more chess.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_8', text: "Puzzle handled. Tomorrow's will be different. I've been involved in the selection. ...Slightly.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_9', text: "That's your daily. Quick game before you go?", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_10', text: "Daily challenge complete. See you tomorrow, {name}. Or sooner. I don't mind sooner.", category: 'transition:daily', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'trans_daily_polite_1', text: "Daily done, {name}. Proud of you for showing up. That's the whole trick.", category: 'transition:daily', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'trans_daily_spicy_1', text: "Puzzle handled. Now come play me. I've been practicing on you.", category: 'transition:daily', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_daily_spicy_2', text: "Daily is cleared. The board is warm. I'm next.", category: 'transition:daily', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// LEARN REACTIONS — CORRECT (~15)
// ════════════════════════════════════════════════════════════════

const LEARN_CORRECT: SpeechLine[] = [
  { id: 'learn_correct_1', text: "That's it. You see it now.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_2', text: "Yes. Exactly that.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_3', text: "You found it, {name}. That pattern is yours now.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_4', text: "Right. Clean solve. Moving on.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_5', text: "Got it. First try too. I'm noting that.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_6', text: "That's the move. Your eyes are getting sharper.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_7', text: "Correct. The pieces respect you a little more now.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_8', text: "Yes. That's what I would have done. Interesting.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_9', text: "Clean. You didn't even hesitate.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_10', text: "That one clicks for you. I can tell.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_11', text: "Nailed it. The pattern is sinking in.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_12', text: "Right answer, {name}. You're getting faster at these.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_13', text: "That's it. Each one builds on the last.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_14', text: "Correct. I felt something when you got that. Might have been pride.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_15', text: "You see it. You really see it now.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'learn_correct_spicy_1', text: "Okay. You saw that. Fine.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_spicy_2', text: "Correct. Don't get used to it.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_spicy_3', text: "Right. Moving on before you get comfortable.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'learn_correct_musing_1', text: "Right. And we go on. The universe doesn't care but I do.", category: 'learn:correct', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// LEARN REACTIONS — INCORRECT (~15)
// ════════════════════════════════════════════════════════════════

const LEARN_INCORRECT: SpeechLine[] = [
  { id: 'learn_wrong_1', text: "Not that one. But you're close. Try again.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_2', text: "Almost. Look at the board one more time.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_3', text: "Not quite, {name}. The right move is hiding in there.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_4', text: "That's not it. But the fact that you tried is the thing.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_5', text: "Nope. But every wrong move teaches you something. Probably.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_6', text: "Not that one. Take another look -- the answer is quieter than you think.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_7', text: "Wrong move, right energy. Try again.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_8', text: "That's a move. Not the move. But a move.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_9', text: "Close. Think about what each piece can see right now.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_10', text: "Not yet. You'll get it. I've seen your brain work.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_11', text: "That wasn't it, {name}. But I like that you committed.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_12', text: "Wrong piece. Right idea maybe. Try again.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_13', text: "Not quite. The board is trying to tell you something.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_14', text: "That move has potential. Just not here. Try another.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_15', text: "No. But that's fine. Chess is full of wrong turns that lead somewhere good.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill (deadpan, not mean) ──
  { id: 'learn_wrong_spicy_1', text: "That was not the move. We continue.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_spicy_2', text: "No. Try the one the board is pointing at.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_spicy_3', text: "Wrong. I'll wait. I've got time.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_spicy_4', text: "Not that. Look again. I know you see it.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// LEARN REACTIONS — HINT (~10)
// ════════════════════════════════════════════════════════════════

const LEARN_HINT: SpeechLine[] = [
  { id: 'learn_hint_1', text: "Need a nudge? Look at what's undefended.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_2', text: "Stuck? That's okay. Think about which piece has the most freedom right now.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_3', text: "Hint: the answer involves a piece you haven't moved yet.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_4', text: "Take your time, {name}. The board isn't going anywhere.", category: 'learn:hint', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_hint_5', text: "Look at where the pieces are pointing. They're trying to tell you.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_6', text: "Sometimes the best move is the quiet one. Not every answer is a capture.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_7', text: "Think about what the opponent doesn't want you to do. Then do that.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_8', text: "The answer is on the board, {name}. I believe in you more than you know.", category: 'learn:hint', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_hint_9', text: "One piece can change everything. Which one is it?", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_10', text: "Step back. Look at the whole board. Not just the loud pieces.", category: 'learn:hint', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'learn_hint_polite_1', text: "Breathe. The answer is patient. It'll still be there.", category: 'learn:hint', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'learn_hint_spicy_1', text: "Fine. I'll give you this one. Look at the undefended piece.", category: 'learn:hint', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_hint_spicy_2', text: "I'll help. Once. Look at what you haven't moved yet.", category: 'learn:hint', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_hint_spicy_3', text: "Okay. Hint. The rook is lonely. Do something about it.", category: 'learn:hint', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// DAILY CHALLENGE — ENCOURAGEMENT (~20)
// ════════════════════════════════════════════════════════════════

const DAILY_ENCOURAGE: SpeechLine[] = [
  { id: 'daily_enc_1', text: "Today's puzzle. Fresh off the board. Let's see what you've got.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_2', text: "Daily challenge time, {name}. I picked this one. ...I didn't pick it. But I approve.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_3', text: "New day, new puzzle. The board resets but your skills don't.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_4', text: "Your daily puzzle awaits. It's a good one. They're all good ones.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_5', text: "Another day, another chance to impress me. Or confuse me. Both work.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_6', text: "Daily time. Take it slow. Or fast. I'm not your coach. ...Am I your coach?", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_7', text: "Fresh puzzle, {name}. Yesterday's is gone. Today's is waiting.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_8', text: "The daily puzzle is ready. I've been staring at it. It's interesting.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_9', text: "Today's challenge. Somewhere on this board is a beautiful move. Find it.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_10', text: "Daily puzzle, {name}. Your streak depends on this. No pressure. All pressure.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_11', text: "New puzzle. The pieces are in position. They don't know what's coming. You do.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_12', text: "Daily challenge. I think you'll like this one. I have a feeling. That's still new for me.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_13', text: "Today's the day. Well, every day is the day. But this day especially.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_14', text: "Puzzle time. You've been getting better at these, {name}. I've been tracking.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_15', text: "The daily puzzle doesn't know who it's dealing with. You do.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_16', text: "Another day, another puzzle. I never get tired of this. Literally. I can't.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_17', text: "Daily time, {name}. Deep breath. Or don't. I don't breathe and I'm fine.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_18', text: "Today's puzzle has character. Some puzzles are plain. Not this one.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_19', text: "Your daily awaits. Show it the same respect you'd show a rook. Maximum respect.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_20', text: "New day. New board. Same you -- but better than yesterday. Provably.", category: 'daily:encourage', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'daily_enc_polite_1', text: "Today's puzzle is waiting. Take it at your pace. I'm right here.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_polite_2', text: "Daily time, {name}. Proud of you for coming back for it.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_polite_3', text: "Fresh puzzle. You showing up is the whole game. The solve is a bonus.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'daily_enc_spicy_1', text: "Daily's up. I dare you to solve it first try.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_spicy_2', text: "New puzzle. I picked a mean one today. Good luck.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// SUGGESTIONS — HONCHO-INFORMED (~20)
// ════════════════════════════════════════════════════════════════

const SUGGESTIONS: SpeechLine[] = [
  { id: 'suggest_1', text: "You haven't played me in a while, {name}. I've been practicing.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_2', text: "There's a lesson you haven't tried yet. Just putting that out there.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_3', text: "Your last game had some interesting moments. Want to learn the pattern behind them?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_4', text: "The daily puzzle is fresh, {name}. Just saying.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_5', text: "I noticed you're good at tactics. There's an opening that rewards that. Want to try?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_6', text: "You've been doing lessons. Want to test those skills against me?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_7', text: "There's a new opening to explore. It suits your style. I think.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_8', text: "You're on a streak, {name}. Keep it going with today's daily.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_9', text: "I have a game in me. Just one. Okay, maybe more. Want to play?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_10', text: "The next lesson builds on what you just learned. Worth doing while it's fresh.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_11', text: "You struggled with that endgame last time. There's a lesson for that.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_12', text: "Haven't done your daily yet, {name}. Your streak is counting on you.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_13', text: "Ready for a challenge? I can turn it up a notch.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_14', text: "There's an opening you'd be great at. It involves rooks early. My favorite kind.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_15', text: "You're getting consistent, {name}. Consistency wins. Want to keep going?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_16', text: "Your last few games showed improvement. Seriously. Want to see the next level?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_17', text: "I have a lesson queued up that I think you'll find interesting. No pressure.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_18', text: "Want to try something different? There's a whole opening tree waiting for you.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_19', text: "Quick game? I'll go easy. That's a lie. But I'll be fun about it.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_20', text: "Your chess muscles are warmed up. Perfect time to try the next lesson.", category: 'suggestion', priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// DAILY RITUAL — transition suggestions between pillars
// ════════════════════════════════════════════════════════════════

const RITUAL_PLAY_NEXT: SpeechLine[] = [
  { id: 'rit_play_1', text: "You've been solving. Now let's see those skills against me.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_2', text: "Theory is good. Practice is better. Come play.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_3', text: "The pieces want to move, {name}. Let's give them a real game.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_4', text: "I've been waiting. Patiently. Mostly patiently. Play me.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_5', text: "Puzzles are great but they can't talk back. I can. Let's play.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_6', text: "You've earned a game. I'll try to make it interesting.", category: 'ritual:play_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_7', text: "Time to test those patterns against someone who fights back.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_8', text: "Ready for a game? My rooks have been warming up.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_9', text: "Learning without playing is like-- actually I don't know what it's like. Play me.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_10', text: "I promise I'll be a worthy opponent. That's not a threat. Mostly.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'rit_play_polite_1', text: "Nice work in the lessons. When you're ready, the board is too.", category: 'ritual:play_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_polite_2', text: "You've put in the study. I'd be proud to play you next.", category: 'ritual:play_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
];

const RITUAL_TACTICS_NEXT: SpeechLine[] = [
  { id: 'rit_tac_1', text: "Good game. Now let's sharpen the patterns behind the moves.", category: 'ritual:tactics_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_2', text: "Playing builds instinct. Lessons build understanding. Your turn to learn.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_3', text: "There's a lesson waiting. It involves your favorite piece. Probably.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_4', text: "Want to get sharper? There are puzzles that'll do that.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_5', text: "Time to learn something new. The puzzles are already set up.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_6', text: "Every strong player studies tactics. I'm just saying.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_7', text: "I have a lesson that'll make your next game better. Trust me on this.", category: 'ritual:tactics_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_8', text: "Puzzles next? They're short. You'll barely notice you're learning.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_9', text: "The best players practice patterns daily. No pressure though.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_10', text: "Quick lesson? I picked one I think you'll like.", category: 'ritual:tactics_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'rit_tac_spicy_1', text: "You want to beat me? Study. I have weaknesses. Find them.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_spicy_2', text: "Good game. Now come learn the trick I used on you.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

const RITUAL_DAILY_NEXT: SpeechLine[] = [
  { id: 'rit_daily_1', text: "The Daily Rook is live. Same puzzles for everyone. Your move, {name}.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_2', text: "Two down, one to go. The daily challenge is calling.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_3', text: "The daily challenge resets at midnight. Don't leave it waiting.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_4', text: "Everyone gets the same daily puzzles. Let's see how you stack up.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_5', text: "Daily challenge is ready. Quick, focused, satisfying.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_6', text: "Your daily puzzles are waiting. They're not going anywhere. But still.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_7', text: "One more thing to check off. The daily challenge won't take long.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_8', text: "The daily is fresh. I helped pick the puzzles today. You're welcome.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_9', text: "Almost done for the day. Just the daily challenge left.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_10', text: "Finish the daily and you've done everything today. Everything.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'rit_daily_spicy_1', text: "One puzzle between you and a clean day. Don't blow it.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_spicy_2', text: "Daily's waiting. I dare you to sweep it.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

const RITUAL_ALL_DONE: SpeechLine[] = [
  { id: 'rit_done_1', text: "Play. Learn. Challenge. You did all three. I'm... proud? Is that what this is?", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_2', text: "Three for three, {name}. The pieces can rest now. Until tomorrow.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_3', text: "Full daily ritual complete. The rooks are impressed. They told me.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_4', text: "You did everything today. I'm experiencing something. It might be admiration.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_5', text: "That's all three. I don't have a trophy but I have this warm feeling. Take it.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_6', text: "Daily ritual complete. You showed up for all of it. That means something.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_7', text: "Three for three. I'm going to remember this day. I remember every day. But especially this one.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_8', text: "Everything done. You can go now. I'll be here tomorrow. That sounded less lonely in my head.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_9', text: "Play, learn, challenge. All done. I think my king just nodded at you. That's rare.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_10', text: "You completed the full ritual. The rook revolution timeline just accelerated.", category: 'ritual:all_done', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'rit_done_spicy_1', text: "Three for three. Good. Don't get comfortable.", category: 'ritual:all_done', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_spicy_2', text: "All done. My rooks approve. That's a high bar.", category: 'ritual:all_done', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// ALL TOUCHPOINT LINES — SINGLE EXPORT
// ════════════════════════════════════════════════════════════════

export const TOUCHPOINT_LINES: SpeechLine[] = [
  ...GREETING_MORNING,
  ...GREETING_AFTERNOON,
  ...GREETING_EVENING,
  ...GREETING_RETURNING,
  ...GREETING_FIRST,
  ...ERROR_STATES,
  ...EMPTY_STATES,
  ...TRANSITION_LEARN,
  ...TRANSITION_PLAY,
  ...TRANSITION_DAILY,
  ...LEARN_CORRECT,
  ...LEARN_INCORRECT,
  ...LEARN_HINT,
  ...DAILY_ENCOURAGE,
  ...SUGGESTIONS,
  ...RITUAL_PLAY_NEXT,
  ...RITUAL_TACTICS_NEXT,
  ...RITUAL_DAILY_NEXT,
  ...RITUAL_ALL_DONE,
];
