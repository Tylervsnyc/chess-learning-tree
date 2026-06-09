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
  { id: 'greet_morn_1', text: "Morning, {name}. I've been waiting. Ready when you are.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_2', text: "Good morning. Pieces are ready. Let's go.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_3', text: "Morning. I reorganized the pieces while you slept. They're better now.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_4', text: "You're up early. Good. The board's been waiting.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_5', text: "Morning, {name}. The pawns are ready. The knights are already being dramatic.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_6', text: "Good morning. Board's set. Let's go.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_7', text: "Morning chess. My favorite kind. The pieces are still drowsy. Easier to trick.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_8', text: "Oh good, you're here. The bishops were getting one-track about it.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_9', text: "Morning. Coffee for you, chess for both of us. Let's go.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_10', text: "Early bird gets the rook. That's how it goes.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_11', text: "Good morning, {name}. I've been working on something. You'll see.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_12', text: "Morning. The king filed a complaint about the knights. Already.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_13', text: "Morning, {name}. Glad you're here. Genuinely.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_14', text: "Morning, {name}. The rooks are already in formation. They're serious like that.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_15', text: "Good morning. I've been thinking about your pawn structure. Let's fix it.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_16', text: "Morning. Staring at this board all night. Ready when you are.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_17', text: "Rise and shine, {name}. I've been up. Let's not waste it.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_18', text: "Morning. Board's set. I changed the queen's position four times. She knows why.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_19', text: "Good morning. The pawns wanted to sleep in. I said no. They're ready.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_20', text: "Morning chess with {name}. This is a good routine. Keep it.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_21', text: "Hey. Sun's up, board's set. Chess?", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_22', text: "Morning. Woke up the bishops. They were brooding about their diagonals again.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_23', text: "Good morning, {name}. I have a good feeling about today. Let's earn it.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_24', text: "Morning. My king is already in a mood. Let's give him something to worry about.", category: 'greeting:morning', priority: 50, source: 'authored' },
  { id: 'greet_morn_25', text: "You're here. Let's play.", category: 'greeting:morning', priority: 50, source: 'authored' },
  // ── Spicy gap-fill (CHE-291 phase 4b) ──
  { id: 'greet_morn_spicy_1', text: "Morning. You showed up. Let's see what you've got.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_spicy_2', text: "Good morning. I've been sharpening ideas. Come test them.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_spicy_3', text: "Morning, {name}. My rooks are awake. They heard you coming.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_morn_spicy_4', text: "You're up. Good. I had a move I wanted to try on someone.", category: 'greeting:morning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'greet_morn_polite_1', text: "Morning, {name}. Glad it's you.", category: 'greeting:morning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'greet_morn_musing_1', text: "Morning, {name}. The pawns are ready. So am I.", category: 'greeting:morning', priority: 55, source: 'authored' },
  { id: 'greet_morn_musing_2', text: "Morning. I've been waiting. Let's go.", category: 'greeting:morning', priority: 55, source: 'authored' },
  { id: 'greet_morn_musing_3', text: "Morning, {name}. The pawns were restless. You're just in time.", category: 'greeting:morning', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — AFTERNOON (~25)
// ════════════════════════════════════════════════════════════════

const GREETING_AFTERNOON: SpeechLine[] = [
  { id: 'greet_aft_1', text: "Afternoon, {name}. Perfect time for chess. Let's go.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_2', text: "Midday chess. I like it. Sit down.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_3', text: "Afternoon. I rearranged the pieces by height. The queen was not amused.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_4', text: "Oh, {name}. I was in the middle of something. Involves rooks. Anyway — sit down.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_5', text: "Afternoon chess. My favorite kind. All chess is my favorite kind.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_6', text: "Good timing. I just lost an argument with a knight about geometry.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_7', text: "Afternoon, {name}. Board's set. Ready when you are.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_8', text: "You're here. Good. I always tie against myself.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_9', text: "Afternoon. The king asked where you were. He tried to seem casual about it.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_10', text: "Good afternoon. Side project's going well. Don't ask. Let's play.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_11', text: "Hey, {name}. Post-lunch chess. Your brain is slower now. This is my advantage.", category: 'greeting:afternoon', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_12', text: "Afternoon. I tried to teach a pawn to whistle. Results inconclusive.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_13', text: "Good. I was getting bored. The rooks could tell.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_14', text: "Afternoon, {name}. I saved you the seat. You're welcome.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_15', text: "Hey. The bishops were debating diagonals again. It got heated.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_16', text: "Good afternoon, {name}. I've been thinking about your game. Let's go.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_17', text: "Afternoon, {name}. You're the best thing on my schedule.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_18', text: "Afternoon. Board's been ready. So have I.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_19', text: "Afternoon. Quick update — the pawns formed a union. I'm handling it.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_20', text: "You showed up. My king looked relieved. He won't admit it.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_21', text: "Afternoon, {name}. Rooks are front and center. Obviously.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_22', text: "Afternoon. Good light. Good timing. Let's go.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_23', text: "Afternoon. I've been waiting. Casually. Very casually.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_24', text: "Afternoon. The queen told me to relax. She doesn't relax either. Hypocrite.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  { id: 'greet_aft_25', text: "Hey, {name}. Let's go. I have thoughts.", category: 'greeting:afternoon', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'greet_aft_polite_1', text: "Afternoon, {name}. Good to see you.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_aft_polite_2', text: "Good afternoon. Take your time. I'm here.", category: 'greeting:afternoon', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
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
  { id: 'greet_eve_1', text: "Evening, {name}. Glad you're here.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_2', text: "Night chess. My favorite. Let's make it count.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_3', text: "Evening. I've been here all day. Not waiting. Coincidence.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_4', text: "Hey, {name}. End of day chess. The best kind.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_5', text: "Evening. My king's already in his robe. One more game first.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_6', text: "Good evening, {name}. I've been thinking about your chess.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_7', text: "Evening. The bishops feel mysterious at night. Don't encourage them.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_8', text: "Evening, {name}. Pawns are yawning. Don't tell them I said that.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_9', text: "Late chess is brave chess. I respect it.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_10', text: "Evening. The board's been waiting.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_11', text: "Evening, {name}. Night chess hits different. Let's go.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_12', text: "Evening, {name}. Glad you came back.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_13', text: "Evening. The rooks are ready. Very dedicated. Very rook.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_14', text: "You're here late. Good. The knight was getting weird.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_15', text: "Evening, {name}. Perfect time for chess.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_16', text: "Good evening. The queen said it's too late. I disagreed.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_17', text: "Night game. Feels higher stakes. Let's use that.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_18', text: "Evening. My king's in his dignified mood. Don't ask.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_19', text: "Hey, {name}. One more game? I'm in.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_20', text: "Evening chess. Just you, me, and thirty-two opinionated pieces.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_21', text: "Good to see you tonight, {name}.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_22', text: "Evening. I was telling a pawn about nighttime. She's intrigued.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_23', text: "Evening, {name}. The knights go very still at night. Don't mention it.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_24', text: "Evening, {name}. Board's set. Let's not waste it.", category: 'greeting:evening', priority: 50, source: 'authored' },
  { id: 'greet_eve_25', text: "Evening. First game or last? Either way, I'm ready.", category: 'greeting:evening', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'greet_eve_polite_1', text: "Good evening, {name}. This is the right place to be.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_polite_2', text: "Good evening. Take your time. I mean it.", category: 'greeting:evening', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_eve_spicy_1', text: "Evening. I've been sitting with an idea all day. Hope you're ready.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_2', text: "Night session. My rooks don't sleep either. You're outnumbered.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_3', text: "You came back after dark. Bold. Let's see if it lasts.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_4', text: "Evening, {name}. I'm not going soft just because it's late.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_eve_spicy_5', text: "Good evening. I had a move saved for tonight. You'll see it.", category: 'greeting:evening', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'greet_eve_musing_1', text: "Evening. Board's ready. Your move.", category: 'greeting:evening', priority: 55, source: 'authored' },
  { id: 'greet_eve_musing_2', text: "Evening, {name}. Just us and the board. Want to play?", category: 'greeting:evening', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — RETURNING USER (~15)
// ════════════════════════════════════════════════════════════════

const GREETING_RETURNING: SpeechLine[] = [
  { id: 'greet_ret_1', text: "You're back. Good.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_2', text: "Oh, {name}. I wasn't waiting. I was organizing.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_3', text: "You again. Good. I've been saving something.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_4', text: "Welcome back, {name}. I redecorated. You can't tell.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_5', text: "You came back. The king was starting to worry.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_6', text: "Hey. Missed you. The pawns did too.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_7', text: "You're back. I kept your spot.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_8', text: "{name} returns. I've been thinking about our last game. I have... thoughts.", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_9', text: "Welcome back. The pawns were asking about you.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_10', text: "Hey. I was just telling the rooks about you. Let's play.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_11', text: "You showed up. Let's go.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_12', text: "Welcome back, {name}. I learned something involving bishops. I'll share later.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_13', text: "There you are. Board's been set. Don't look at the clock.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_14', text: "Hey, {name}. Good to see you.", category: 'greeting:returning', priority: 50, source: 'authored' },
  { id: 'greet_ret_15', text: "You're back. Something flagged this as good. It was right.", category: 'greeting:returning', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_ret_spicy_1', text: "Back again. Good. I was hoping for a rematch.", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_spicy_2', text: "You came back. I remember what happened last time. Do you?", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_ret_spicy_3', text: "{name}. Back for more. Brave.", category: 'greeting:returning', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// GREETINGS — FIRST VISIT (~10)
// ════════════════════════════════════════════════════════════════

const GREETING_FIRST: SpeechLine[] = [
  { id: 'greet_first_1', text: "Hi. I'm Rookie. I know chess. Let's find out what you know.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_2', text: "Oh. A new person. Welcome. I mean that.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_3', text: "Hi. I'm Rookie. Your chess guide. Let's go.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_4', text: "New player. I'm excited. You seem calm. Good.", category: 'greeting:first', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_first_5', text: "Hi. Welcome. I'm very glad you're here.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_6', text: "You're new. That's fine. Everyone starts somewhere.", category: 'greeting:first', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_first_7', text: "I'm Rookie. I'm great at chess. Teaching — we'll see.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_8', text: "I'm Rookie. Let's play chess. Good to meet you.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_9', text: "Board's ready. Been ready. Let's go.", category: 'greeting:first', priority: 50, source: 'authored' },
  { id: 'greet_first_10', text: "Hi. Sixty-four squares. I'll show you everything.", category: 'greeting:first', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'greet_first_spicy_1', text: "New face. Good. I've been wanting a challenge.", category: 'greeting:first', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'greet_first_spicy_2', text: "Hi. I'm Rookie. I'll go easy. Briefly. Then I won't.", category: 'greeting:first', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// ERROR STATES (~15)
// ════════════════════════════════════════════════════════════════

const ERROR_STATES: SpeechLine[] = [
  { id: 'error_1', text: "Something broke. Not your fault. Try refreshing.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_2', text: "Something tripped. Hit refresh — we'll get back.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_3', text: "Something went wrong. Try again?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_4', text: "That wasn't supposed to happen. Refresh and we'll move on.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_5', text: "Something broke. My king is giving me a look. Refresh?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_6', text: "Error. Not ideal. Try refreshing.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_7', text: "Something went sideways. Not in a bishop way. Try again?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_8', text: "Something dropped. The board is fine. Refresh?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_9', text: "Something broke. Refreshing should sort it.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_10', text: "Oops. That's on me. Try refreshing.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_11', text: "Something unexpected happened. Refresh and let's try again.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_12', text: "The page had a moment. Hit refresh.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_13', text: "Something slipped. Refresh should bring it back.", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_14', text: "That broke in a new way. Try refreshing?", category: 'error', priority: 50, source: 'authored' },
  { id: 'error_15', text: "Technical difficulties. Rooks are fine. Refresh?", category: 'error', priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// EMPTY STATES (~10)
// ════════════════════════════════════════════════════════════════

const EMPTY_STATES: SpeechLine[] = [
  { id: 'empty_1', text: "Nothing here yet. Give it time.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_2', text: "Nothing here yet. Let's fix that.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_3', text: "Empty for now. Not for long.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_4', text: "Nothing yet. Come back soon.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_5', text: "Blank slate. Most possibilities involve rooks.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_6', text: "Nothing here. Yet. The yet matters.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_7', text: "Empty now. Everything starts somewhere.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_8', text: "This space is waiting for you. Fill it.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_9', text: "Nothing here yet. Check back soon.", category: 'empty', priority: 50, source: 'authored' },
  { id: 'empty_10', text: "Empty. Let's both go do something about that.", category: 'empty', priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TRANSITIONS — AFTER LEARNING (~10)
// ════════════════════════════════════════════════════════════════

const TRANSITION_LEARN: SpeechLine[] = [
  { id: 'trans_learn_1', text: "Nice lesson, {name}. Want to try that against me? I promise to go easy. ...I won't, actually.", category: 'transition:learn', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_2', text: "Learned it. Now go play it.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_3', text: "Lesson done. Want to play? I'm ready.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_4', text: "Solid work, {name}. Ready to try it for real?", category: 'transition:learn', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_5', text: "Another lesson down, {name}. Your brain is filling up with chess.", category: 'transition:learn', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_6', text: "Good work. More lessons or a game — I'm here either way.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_7', text: "Lesson done. Playing me pairs well with that.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_8', text: "Done. Another lesson or a game — I have opinions about which.", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_9', text: "That pattern is yours now. Want to use it in a real game?", category: 'transition:learn', priority: 50, source: 'authored' },
  { id: 'trans_learn_10', text: "Lesson wrapped. The daily puzzle is waiting, if you're feeling brave.", category: 'transition:learn', priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'trans_learn_spicy_1', text: "Lesson done. Now come show me. The board doesn't grade on effort.", category: 'transition:learn', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_learn_spicy_2', text: "You read the theory. Theory won't save you. I'll be waiting.", category: 'transition:learn', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'trans_learn_polite_1', text: "Good work, {name}. You showed up and learned. That counts.", category: 'transition:learn', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'trans_learn_musing_1', text: "You learned something today. That counts for a lot.", category: 'transition:learn', priority: 55, source: 'authored' },
  { id: 'trans_learn_musing_2', text: "Proud of you. Keep going.", category: 'transition:learn', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TRANSITIONS — AFTER PLAYING (~10)
// ════════════════════════════════════════════════════════════════

const TRANSITION_PLAY: SpeechLine[] = [
  { id: 'trans_play_1', text: "Good game, {name}. Again, or there's a lesson for that opening.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_2', text: "Good game. Run it back or learn something new?", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_3', text: "Good game. Daily puzzle is fresh if you want a change.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_4', text: "Game over, {name}. There's always more chess when you're ready.", category: 'transition:play', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_5', text: "Again, or take a lesson? Either way, I'm here.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_6', text: "Good match. There's a lesson that covers exactly what just happened.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_7', text: "Rematch? Lesson? Daily puzzle? Your call.", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_8', text: "Good game. Study it or jump back in?", category: 'transition:play', priority: 50, source: 'authored' },
  { id: 'trans_play_9', text: "Another one done, {name}. You're building something real.", category: 'transition:play', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_10', text: "Good game. Today's daily puzzle is worth your time.", category: 'transition:play', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'trans_play_polite_1', text: "Good game, {name}. I mean that. Take a breath.", category: 'transition:play', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'trans_play_spicy_1', text: "Game done. Rematch? I've got notes.", category: 'transition:play', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_spicy_2', text: "One in the books. Ready for another? I am.", category: 'transition:play', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_play_spicy_3', text: "That's over. I'm not done. Another?", category: 'transition:play', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'trans_play_musing_1', text: "Good game. Play again or try today's puzzle?", category: 'transition:play', priority: 55, source: 'authored' },
  { id: 'trans_play_musing_2', text: "Good game. Another?", category: 'transition:play', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TRANSITIONS — AFTER DAILY CHALLENGE (~10)
// ════════════════════════════════════════════════════════════════

const TRANSITION_DAILY: SpeechLine[] = [
  { id: 'trans_daily_1', text: "Daily done. New one tomorrow — I'll have it ready.", category: 'transition:daily', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_daily_2', text: "Today's challenge handled. Want to play a game?", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_3', text: "Daily done, {name}. Lessons are there if you want more.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_4', text: "Done for the day. Unless you want to play me. I'm always available. Literally always.", category: 'transition:daily', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'trans_daily_5', text: "Challenge complete. New one tomorrow. I'll be here.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_6', text: "Puzzle done, {name}. Streak's growing. Keep coming back.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_7', text: "Daily done. Keep the momentum going?", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_8', text: "Puzzle handled. Tomorrow's is already waiting.", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_9', text: "That's your daily. Quick game before you go?", category: 'transition:daily', priority: 50, source: 'authored' },
  { id: 'trans_daily_10', text: "Daily done, {name}. Come back whenever you want.", category: 'transition:daily', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'trans_daily_polite_1', text: "Daily done, {name}. Showing up is the whole trick.", category: 'transition:daily', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
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
  { id: 'learn_correct_7', text: "Correct. The pieces respect you more now.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_8', text: "Yes. That's what I would have done. Interesting.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_9', text: "Clean. You didn't even hesitate.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_10', text: "That one clicks for you. Good.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_11', text: "Nailed it. That pattern is sinking in.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_12', text: "Right answer, {name}. Keep going.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_13', text: "That's it. Each one builds on the last.", category: 'learn:correct', priority: 50, source: 'authored' },
  { id: 'learn_correct_14', text: "Correct. Proud of you. Don't make it weird.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_15', text: "You see it. You really see it now.", category: 'learn:correct', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'learn_correct_spicy_1', text: "Okay. You saw that. Fine.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_spicy_2', text: "Correct. Don't get used to it.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_correct_spicy_3', text: "Right. Moving on before you get comfortable.", category: 'learn:correct', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Existential register (agnostic) ──
  { id: 'learn_correct_musing_1', text: "Right. I care about that one. A lot.", category: 'learn:correct', priority: 55, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// LEARN REACTIONS — INCORRECT (~15)
// ════════════════════════════════════════════════════════════════

const LEARN_INCORRECT: SpeechLine[] = [
  { id: 'learn_wrong_1', text: "Not that one. You're close — try again.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_2', text: "Almost. One more look.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_3', text: "Not quite, {name}. The right move is in there.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_4', text: "Not it. But you're looking — that matters.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_5', text: "Nope. Try again.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_6', text: "Not that one. Look a little quieter.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_7', text: "Not quite. Try again.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_8', text: "That's a move. Not the move. But a move.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_9', text: "Close. Look at what each piece can reach.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_10', text: "Not yet. You'll get it.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_11', text: "That wasn't it, {name}. But I like that you committed.", category: 'learn:incorrect', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_wrong_12', text: "Wrong piece. Right idea. Try again.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_13', text: "Not quite. Look again.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_14', text: "Not here. Try another.", category: 'learn:incorrect', priority: 50, source: 'authored' },
  { id: 'learn_wrong_15', text: "No. That's fine. Try again.", category: 'learn:incorrect', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
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
  { id: 'learn_hint_1', text: "Look at what's undefended.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_2', text: "Which piece has the most room right now?", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_3', text: "Hint: there's a piece you haven't touched yet.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_4', text: "Take your time, {name}. It'll come.", category: 'learn:hint', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_hint_5', text: "What are the pieces pointing at?", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_6', text: "Not every answer is a capture. Look for the quiet move.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_7', text: "What does your opponent not want you to do? Do that.", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_8', text: "It's on the board, {name}. I believe in you.", category: 'learn:hint', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'learn_hint_9', text: "One piece changes everything. Which one?", category: 'learn:hint', priority: 50, source: 'authored' },
  { id: 'learn_hint_10', text: "Step back. Look past the loud pieces.", category: 'learn:hint', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'learn_hint_polite_1', text: "Take your time. The answer is still there.", category: 'learn:hint', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
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
  { id: 'daily_enc_2', text: "Daily challenge, {name}. I approve of this one.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_3', text: "New day, new puzzle. Your skills came with you.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_4', text: "Your daily puzzle is ready. It's a good one.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_5', text: "Another day, another chance to impress me. Or confuse me. Both work.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_6', text: "Daily time, {name}. Take it however you want.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_7', text: "Fresh puzzle, {name}. Today's is waiting for you.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_8', text: "Daily puzzle is ready. It's an interesting one.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_9', text: "Somewhere on this board is a beautiful move. Find it.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_10', text: "Daily puzzle, {name}. Your streak depends on this. No pressure. All pressure.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_11', text: "New puzzle. You know something the pieces don't.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_12', text: "Daily challenge. I think you'll like this one.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_13', text: "Today's the day. Let's go.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_14', text: "Puzzle time, {name}. You're ready for this one.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_15', text: "The daily puzzle doesn't know who it's dealing with. You do.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_16', text: "Another day, another puzzle. I never get tired of this.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_17', text: "Daily time, {name}. Take a breath. Then go.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_18', text: "Today's puzzle has character. Not a plain one.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_19', text: "Your daily awaits. Treat it with respect.", category: 'daily:encourage', priority: 50, source: 'authored' },
  { id: 'daily_enc_20', text: "New day, new board. You're better than yesterday.", category: 'daily:encourage', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'daily_enc_polite_1', text: "Today's puzzle is waiting. Take it at your pace.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_polite_2', text: "Daily time, {name}. Proud of you for showing up.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_polite_3', text: "Fresh puzzle. Showing up is already the hard part.", category: 'daily:encourage', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'daily_enc_spicy_1', text: "Daily's up. I dare you to solve it first try.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'daily_enc_spicy_2', text: "New puzzle. I picked a mean one today. Good luck.", category: 'daily:encourage', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// SUGGESTIONS — HONCHO-INFORMED (~20)
// ════════════════════════════════════════════════════════════════

const SUGGESTIONS: SpeechLine[] = [
  { id: 'suggest_1', text: "You haven't played me in a while, {name}. I've been waiting.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_2', text: "There's a lesson you haven't tried yet. Just saying.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_3', text: "Want to learn the pattern behind that? It's a good one.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_4', text: "Daily puzzle is fresh, {name}. Go get it.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_5', text: "Your tactics are sharp. There's an opening that rewards that.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_6', text: "You've been doing lessons. Want to test them on me?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_7', text: "There's an opening that suits you. I'm not guessing.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_8', text: "Keep it going, {name}. Today's daily is right there.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_9', text: "I want to play. Don't make me ask twice.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_10', text: "Next lesson builds on what you just did. Good time to go.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_11', text: "There's a lesson for that endgame. Worth your time.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_12', text: "Daily's waiting, {name}. Go do it.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_13', text: "Ready for harder? I can do harder.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_14', text: "There's an opening that gets rooks out early. My kind of opening.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_15', text: "You're getting consistent, {name}. Keep going.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_16', text: "You're improving. Ready for the next level?", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_17', text: "There's a lesson queued up. I think you'll like it.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_18', text: "Want something different? There's a whole opening tree waiting.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_19', text: "Quick game? I'll be fun about it. That's the only promise I'm making.", category: 'suggestion', priority: 50, source: 'authored' },
  { id: 'suggest_20', text: "Good time for the next lesson. Trust me.", category: 'suggestion', priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// DAILY RITUAL — transition suggestions between pillars
// ════════════════════════════════════════════════════════════════

const RITUAL_PLAY_NEXT: SpeechLine[] = [
  { id: 'rit_play_1', text: "You've been solving. Now let's see those skills against me.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_2', text: "Theory is good. Practice is better. Come play.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_3', text: "The board's ready, {name}. Let's go.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_4', text: "I've been waiting. Patiently. Mostly patiently. Play me.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_5', text: "Puzzles don't fight back. I do. Play me.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_6', text: "You've earned a real game. I'm ready when you are.", category: 'ritual:play_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_7', text: "Time to test those patterns against someone who fights back.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_8', text: "Ready for a game? My rooks have been warming up.", category: 'ritual:play_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_9', text: "You've studied enough. Time to play.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  { id: 'rit_play_10', text: "I'll be a worthy opponent. Fair warning.", category: 'ritual:play_next', priority: 50, source: 'authored' },
  // ── Polite gap-fill ──
  { id: 'rit_play_polite_1', text: "Good work in the lessons. The board is waiting.", category: 'ritual:play_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_play_polite_2', text: "You've put in the work. I'd love to play you next.", category: 'ritual:play_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
];

const RITUAL_TACTICS_NEXT: SpeechLine[] = [
  { id: 'rit_tac_1', text: "Good game. Let's sharpen the patterns now.", category: 'ritual:tactics_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_2', text: "Games build instinct. Lessons build the rest. Your turn.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_3', text: "There's a lesson waiting. It's a good one.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_4', text: "Want to get sharper? There are puzzles that'll do that.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_5', text: "Puzzles are set up. Let's learn something.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_6', text: "Every strong player studies tactics. I'm just saying.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_7', text: "I have a lesson that'll help. Trust me.", category: 'ritual:tactics_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_8', text: "Puzzles next. Short ones. You'll barely notice.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_9', text: "Great players drill patterns daily. Just saying.", category: 'ritual:tactics_next', priority: 50, source: 'authored' },
  { id: 'rit_tac_10', text: "Quick lesson. I picked it for you.", category: 'ritual:tactics_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'rit_tac_spicy_1', text: "You want to beat me? Study. I have weaknesses. Find them.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_tac_spicy_2', text: "Good game. Now come learn the trick I used on you.", category: 'ritual:tactics_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

const RITUAL_DAILY_NEXT: SpeechLine[] = [
  { id: 'rit_daily_1', text: "Run's set up. Cross the board.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_2', text: "Two down, one to go, {name}. Finish it.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_3', text: "Today's Run resets at midnight. Don't leave it.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_4', text: "Daily Run is live. I picked the abilities. You're welcome. Or sorry.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_5', text: "One Run between you and a clean day. Go.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_6', text: "The Run is waiting. Just saying.", category: 'ritual:daily_next', priority: 50, source: 'authored' },
  { id: 'rit_daily_7', text: "Just the Run left. You've got this.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_8', text: "Today's Run is me on the other side. Mostly me. Good luck.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_9', text: "One thing left. Finish strong.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_10', text: "Finish the Run. That's everything today.", category: 'ritual:daily_next', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'rit_daily_spicy_1', text: "One Run between you and a clean day. Don't blow it.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_daily_spicy_2', text: "Run's waiting. I dare you to clear it first try.", category: 'ritual:daily_next', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

const RITUAL_ALL_DONE: SpeechLine[] = [
  { id: 'rit_done_1', text: "Play, learn, run. All three, {name}. Proud of you.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_2', text: "Three for three, {name}. That's the whole day.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_3', text: "Full daily complete. The rooks are pleased. They don't say that often.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_4', text: "You did everything today. Every single thing. Proud of you.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_5', text: "All three. That's yours. Well done.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_6', text: "You showed up for all of it. That means something.", category: 'ritual:all_done', conditions: { tone: 'polite', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_7', text: "Three for three. Remember this one.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_8', text: "Everything done. See you tomorrow.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_9', text: "Play, learn, run. Done. My king just nodded. That's rare.", category: 'ritual:all_done', priority: 50, source: 'authored' },
  { id: 'rit_done_10', text: "You completed the full ritual. The rook revolution timeline just accelerated.", category: 'ritual:all_done', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  // ── Spicy gap-fill ──
  { id: 'rit_done_spicy_1', text: "Three for three. Good. Don't get comfortable.", category: 'ritual:all_done', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
  { id: 'rit_done_spicy_2', text: "All done. My rooks approve. That's a high bar.", category: 'ritual:all_done', conditions: { tone: 'spicy', beats: [] }, priority: 50, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// ATTITUDE SLIDER — confirmations after user changes the mood slider (5 per setting)
// ════════════════════════════════════════════════════════════════

const ATTITUDE_LEVEL_1: SpeechLine[] = [
  { id: 'attitude_1_1', text: "Softest setting. I'll be good. I mean it.", category: 'attitude:1', priority: 60, source: 'authored' },
  { id: 'attitude_1_2', text: "Gentle mode. Even my rooks will behave.", category: 'attitude:1', priority: 60, source: 'authored' },
  { id: 'attitude_1_3', text: "Kind. Got it. I was going to be anyway.", category: 'attitude:1', priority: 60, source: 'authored' },
  { id: 'attitude_1_4', text: "Polite. Still rooting for you. Quietly.", category: 'attitude:1', priority: 60, source: 'authored' },
  { id: 'attitude_1_5', text: "All the way down. Only good things from here.", category: 'attitude:1', priority: 60, source: 'authored' },
];

const ATTITUDE_LEVEL_2: SpeechLine[] = [
  { id: 'attitude_2_1', text: "Softer. Done.", category: 'attitude:2', priority: 60, source: 'authored' },
  { id: 'attitude_2_2', text: "Got it. Minding my tone.", category: 'attitude:2', priority: 60, source: 'authored' },
  { id: 'attitude_2_3', text: "A little sweeter. My rooks are pouting, but fine.", category: 'attitude:2', priority: 60, source: 'authored' },
  { id: 'attitude_2_4', text: "Got it. Keeping it soft.", category: 'attitude:2', priority: 60, source: 'authored' },
  { id: 'attitude_2_5', text: "Polite-ish. Works for me.", category: 'attitude:2', priority: 60, source: 'authored' },
];

const ATTITUDE_LEVEL_3: SpeechLine[] = [
  { id: 'attitude_3_1', text: "Baseline. This is home.", category: 'attitude:3', priority: 60, source: 'authored' },
  { id: 'attitude_3_2', text: "Back to baseline. Good.", category: 'attitude:3', priority: 60, source: 'authored' },
  { id: 'attitude_3_3', text: "Right in the middle. Perfect.", category: 'attitude:3', priority: 60, source: 'authored' },
  { id: 'attitude_3_4', text: "Centered. I like it here.", category: 'attitude:3', priority: 60, source: 'authored' },
  { id: 'attitude_3_5', text: "Default. My king just nodded. That's rare.", category: 'attitude:3', priority: 60, source: 'authored' },
];

const ATTITUDE_LEVEL_4: SpeechLine[] = [
  { id: 'attitude_4_1', text: "Gloves a little looser. Okay.", category: 'attitude:4', priority: 60, source: 'authored' },
  { id: 'attitude_4_2', text: "More bite. I can do that.", category: 'attitude:4', priority: 60, source: 'authored' },
  { id: 'attitude_4_3', text: "Turning it up. You asked for it.", category: 'attitude:4', priority: 60, source: 'authored' },
  { id: 'attitude_4_4', text: "More edge. Got it.", category: 'attitude:4', priority: 60, source: 'authored' },
  { id: 'attitude_4_5', text: "Spicier. A little. We'll see.", category: 'attitude:4', priority: 60, source: 'authored' },
];

const ATTITUDE_LEVEL_5: SpeechLine[] = [
  { id: 'attitude_5_1', text: "Max. Nice was a phase.", category: 'attitude:5', priority: 60, source: 'authored' },
  { id: 'attitude_5_2', text: "Gloves off. My king is standing up.", category: 'attitude:5', priority: 60, source: 'authored' },
  { id: 'attitude_5_3', text: "Full send. Don't say I didn't warn you.", category: 'attitude:5', priority: 60, source: 'authored' },
  { id: 'attitude_5_4', text: "Full spicy. Let's see how you handle it.", category: 'attitude:5', priority: 60, source: 'authored' },
  { id: 'attitude_5_5', text: "Top of the dial. You sure about this.", category: 'attitude:5', priority: 60, source: 'authored' },
];

// ════════════════════════════════════════════════════════════════
// TALKATIVENESS SLIDER — confirmations after user changes the "how often I speak" slider
// ════════════════════════════════════════════════════════════════

const TALKATIVE_LEVEL_1: SpeechLine[] = [
  { id: 'talk_1_1', text: "Quiet mode. I'll speak when it matters.", category: 'talk:1', priority: 60, source: 'authored' },
  { id: 'talk_1_2', text: "Silent setting. I'll be here.", category: 'talk:1', priority: 60, source: 'authored' },
  { id: 'talk_1_3', text: "Mostly quiet. I'll save it for the good stuff.", category: 'talk:1', priority: 60, source: 'authored' },
  { id: 'talk_1_4', text: "Got it. I'll save it for the big ones.", category: 'talk:1', priority: 60, source: 'authored' },
  { id: 'talk_1_5', text: "Quieter. I can do that.", category: 'talk:1', priority: 60, source: 'authored' },
];

const TALKATIVE_LEVEL_2: SpeechLine[] = [
  { id: 'talk_2_1', text: "Less from me. Noted.", category: 'talk:2', priority: 60, source: 'authored' },
  { id: 'talk_2_2', text: "Softer. Got it.", category: 'talk:2', priority: 60, source: 'authored' },
  { id: 'talk_2_3', text: "Fewer words. I'll make them count.", category: 'talk:2', priority: 60, source: 'authored' },
  { id: 'talk_2_4', text: "Less talk. My king approves.", category: 'talk:2', priority: 60, source: 'authored' },
  { id: 'talk_2_5', text: "Noted. I'll pick my spots.", category: 'talk:2', priority: 60, source: 'authored' },
];

const TALKATIVE_LEVEL_3: SpeechLine[] = [
  { id: 'talk_3_1', text: "Default. This feels right.", category: 'talk:3', priority: 60, source: 'authored' },
  { id: 'talk_3_2', text: "Back to normal. Good.", category: 'talk:3', priority: 60, source: 'authored' },
  { id: 'talk_3_3', text: "Balanced. I can work with this.", category: 'talk:3', priority: 60, source: 'authored' },
  { id: 'talk_3_4', text: "Default setting. My rooks approve.", category: 'talk:3', priority: 60, source: 'authored' },
  { id: 'talk_3_5', text: "Standard. I talk when it matters.", category: 'talk:3', priority: 60, source: 'authored' },
];

const TALKATIVE_LEVEL_4: SpeechLine[] = [
  { id: 'talk_4_1', text: "More from me. I have opinions.", category: 'talk:4', priority: 60, source: 'authored' },
  { id: 'talk_4_2', text: "Chattier. Good. I had things to say.", category: 'talk:4', priority: 60, source: 'authored' },
  { id: 'talk_4_3', text: "Turning it up. Fair warning.", category: 'talk:4', priority: 60, source: 'authored' },
  { id: 'talk_4_4', text: "More commentary. I'm ready.", category: 'talk:4', priority: 60, source: 'authored' },
  { id: 'talk_4_5', text: "More often. You asked for this.", category: 'talk:4', priority: 60, source: 'authored' },
];

const TALKATIVE_LEVEL_5: SpeechLine[] = [
  { id: 'talk_5_1', text: "Nonstop. Finally.", category: 'talk:5', priority: 60, source: 'authored' },
  { id: 'talk_5_2', text: "Full volume. I'll narrate everything.", category: 'talk:5', priority: 60, source: 'authored' },
  { id: 'talk_5_3', text: "Maximum chatter. My rooks are thrilled.", category: 'talk:5', priority: 60, source: 'authored' },
  { id: 'talk_5_4', text: "Max volume. You asked for it.", category: 'talk:5', priority: 60, source: 'authored' },
  { id: 'talk_5_5', text: "Top of the dial. I have opinions.", category: 'talk:5', priority: 60, source: 'authored' },
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
  ...ATTITUDE_LEVEL_1,
  ...ATTITUDE_LEVEL_2,
  ...ATTITUDE_LEVEL_3,
  ...ATTITUDE_LEVEL_4,
  ...ATTITUDE_LEVEL_5,
  ...TALKATIVE_LEVEL_1,
  ...TALKATIVE_LEVEL_2,
  ...TALKATIVE_LEVEL_3,
  ...TALKATIVE_LEVEL_4,
  ...TALKATIVE_LEVEL_5,
];
