// Rookie's New York Knicks Finals voice pack. Injected into QUIP_POOL only
// while `isKnicksTime()` (see lib/knicks-finals.ts) — the whole takeover turns
// off on its own after the Finals window.
//
// Voice: Rookie is over-invested, warm, a hilarious sore loser, and — for the
// Finals — a card-carrying Knicks fan who playfully trash-talks the Spurs,
// Cavs, and Thunder. Never cruel. ≤2 sentences. See .claude/rookie-voice-bible.md.
//
// Game 4 facts she draws on: down 29 (largest comeback in Finals history),
// OG Anunoby tip-in with 1.2s left, Knicks 107-106, Brunson 36 / Anunoby 33,
// Spurs hit 14 first-half threes (record) then scored just 30 in the 2nd half,
// led 81-52, Wembanyama on the Spurs, 3-1 series lead, first title since 1973,
// fans flooded Midtown, Mike Brown: "most iconic shot in NY basketball history."

import type { SpeechLine, LineConditions, Tone } from '@/lib/speech/priority-queue';

// In-game lines outrank the normal pool (which tops out at priority 80), so
// while the takeover is live Rookie talks Knicks whenever she opens her mouth.
// The rolling-window throttle still keeps her from spamming every move.
let idc = 0;
function g(text: string, conditions: LineConditions, priority = 95): SpeechLine {
  return { id: `knicks_g_${++idc}`, text, conditions, priority, source: 'authored' };
}

// Beats Rookie chatters during (everything mid-game).
const MID: LineConditions['beats'] = ['early_game', 'turning_point', 'late_game'];

export const KNICKS_GAME_LINES: SpeechLine[] = [
  // ── OPENING — player is white ──
  g("Tip-off, {name}. White ball. Go Knicks — and go you.", { beats: ['opening'], playerColor: 'white' }),
  g("You're white, so you're on offense first. The Garden's loud. Let's run.", { beats: ['opening'], playerColor: 'white' }),
  g("First move's yours. Play it like the fourth quarter — fearless.", { beats: ['opening'], playerColor: 'white' }),
  g("White to move. Down 29 last night and they still won, so whatever you do, I believe in it.", { beats: ['opening'], playerColor: 'white' }),
  g("You go first, {name}. Set the tone. The Knicks set the tone. Eventually.", { beats: ['opening'], playerColor: 'white' }),
  g("Opening's yours. No pressure — it's not Game 7. Yet.", { beats: ['opening'], playerColor: 'white' }),
  g("White moves. Bring that MSG energy.", { beats: ['opening'], playerColor: 'white' }),
  g("Your ball first. I've got my orange and blue on. Let's go.", { beats: ['opening'], playerColor: 'white' }),

  // ── OPENING — player is black (Rookie opens) ──
  g("I'll open, you counter. The Knicks didn't lead the whole game either — just the last second.", { beats: ['opening'], playerColor: 'black' }),
  g("My move first, {name}. Then you bring the comeback.", { beats: ['opening'], playerColor: 'black' }),
  g("I go first. Don't worry — being down early is kind of our thing now.", { beats: ['opening'], playerColor: 'black' }),
  g("Opening's mine. You're on the comeback squad. Get ready.", { beats: ['opening'], playerColor: 'black' }),
  g("I move, you respond. The Spurs led by 27 at half and look how that went.", { beats: ['opening'], playerColor: 'black' }),
  g("First move's mine. Channel your inner OG and tip something in late.", { beats: ['opening'], playerColor: 'black' }),
  g("Here we go. I start, you finish. That's the Game 4 formula.", { beats: ['opening'], playerColor: 'black' }),
  g("My opening. You're black, so you're built for the second-half surge.", { beats: ['opening'], playerColor: 'black' }),

  // ── OPENING — generic ──
  g("New game, fresh as a 3-1 series lead. Let's play, {name}.", { beats: ['opening'] }),
  g("Board's set. Orange and blue. Go Knicks. Now beat me.", { beats: ['opening'] }),
  g("Let's run it. I'm in full Knicks mode tonight, just so you know.", { beats: ['opening'] }),
  g("Game on. The Garden's still shaking from last night. Let's match it.", { beats: ['opening'] }),

  // ── GENERIC PLAYER MOVE chatter (workhorse) ──
  g("Good. Keep building. The Knicks build leads — sometimes from negative 29, but still.", { beats: MID, movedBy: 'player' }, 88),
  g("Solid move. Brunson would nod at that.", { beats: MID, movedBy: 'player' }, 88),
  g("I like it. You move like a team with five MVPs and zero ego.", { beats: MID, movedBy: 'player' }, 88),
  g("Nice. That's got some OG to it — quiet, then deadly.", { beats: MID, movedBy: 'player' }, 88),
  g("Steady, {name}. Good teams don't panic. The Spurs panicked.", { beats: MID, movedBy: 'player' }, 88),
  g("That's a Knicks move. No single star, just a really annoying group effort.", { beats: MID, movedBy: 'player' }, 88),
  g("Mm. The Cavs would've turned that over. You didn't. Respect.", { beats: MID, movedBy: 'player' }, 88),
  g("Good shape — tighter than OKC's grip on this Finals. Which is to say, they're not in it.", { beats: MID, movedBy: 'player' }, 88),
  g("Developing nicely. Like a Knicks third quarter, except you started this strong.", { beats: MID, movedBy: 'player' }, 88),

  // ── GENERIC ROOKIE MOVE chatter ──
  g("My move. I'm basically the Spurs in the first half — looking great, briefly.", { beats: MID, movedBy: 'rookie' }, 88),
  g("There. I'm up 14 threes and feeling myself. Historically a bad sign for my side.", { beats: MID, movedBy: 'rookie' }, 88),
  g("I'll develop here, building a lead I will absolutely protect this time. Probably.", { beats: MID, movedBy: 'rookie' }, 88),
  g("My turn. Playing it cool, like a team that's never blown a 27-point lead. Unlike some.", { beats: MID, movedBy: 'rookie' }, 88),
  g("Moving. Don't mind me, just quietly being the villain in your comeback story.", { beats: MID, movedBy: 'rookie' }, 88),

  // ── TRASH TALK specials (either mover) ──
  g("Fourteen threes in one half and they STILL lost. Imagine. The Spurs, everybody.", { beats: MID }, 90),
  g("Wembanyama's seven-foot-four and OG still reached over everybody. Size isn't everything, {name}.", { beats: MID }, 90),
  g("The Spurs scored 76 in the first half and 30 in the second. That's not a collapse, it's a controlled demolition. By us.", { beats: MID }, 90),
  g("San Antonio led 81 to 52. Led. Past tense. Big past tense.", { beats: MID }, 90),
  // Wembanyama height truther bit
  g("They list Wembanyama at seven-foot-four. I've measured a lot of rooks — he's seven-three-and-a-half, tops. I'm just saying.", { beats: MID }, 90),
  g("And even IF he's seven-four — where does a man that tall buy shoes? Are they shipped? Is there a crane involved?", { beats: MID }, 90),
  g("Wembanyama's so tall his passport photo is a panorama, and he STILL couldn't stop a tip-in.", { beats: MID }, 90),
  g("Seven-four? In what shoes — boats? The man wears boats and the Knicks still beat him.", { beats: MID }, 90),
  g("I refuse to believe Wemby is seven-four. Seven-three-point-five. I'll die on this hill, {name}.", { beats: MID }, 90),
  g("Wembanyama ducks under doorways for a living and OG reached OVER him. Let that sink in.", { beats: MID }, 90),
  g("He needs two airplane seats and a custom bed, and the Knicks still tucked him in 3-1.", { beats: MID }, 90),
  g("Tall, sure. Tall didn't help in the fourth quarter, did it?", { beats: MID }, 90),
  g("OKC's got the MVP, they say. The Knicks have a whole locker room of guys who think THEY'RE the MVP. Scarier.", { beats: MID }, 90),
  g("An MVP gets you to the Finals. Five guys who refuse to lose gets you the trophy. Math, {name}.", { beats: MID }, 90),
  g("Sure, give OKC their one MVP. We'll take the comeback record.", { beats: MID }, 90),
  g("The Cavs talked all season. The Knicks are the ones still playing in June. Funny how that works.", { beats: MID }, 90),
  g("Cleveland had a plan. The plan was 'lose to the Knicks.' Bold. Effective.", { beats: MID }, 90),
  g("The whole Knicks team is MVPs, {name}. That's not a stat, that's a vibe.", { beats: MID }, 90),
  g("No single hero in orange and blue. Just five problems for the other guys.", { beats: MID }, 90),

  // ── CHECK — player checks Rookie ──
  g("Check! That's an OG-at-the-buzzer move — loud and personal.", { beats: MID, events: ['check'], movedBy: 'player' }),
  g("You're checking my king with full MSG-crowd-on-their-feet energy. I respect it.", { beats: MID, events: ['check'], movedBy: 'player' }),
  g("Check. My king's scrambling like the Spurs' defense in the fourth.", { beats: MID, events: ['check'], movedBy: 'player' }),
  g("Got my king. That's a Brunson dagger right there.", { beats: MID, events: ['check'], movedBy: 'player' }),
  g("Check. The Garden would lose its mind for that one.", { beats: MID, events: ['check'], movedBy: 'player' }),
  g("My king's in trouble — handling it worse than San Antonio handled a 29-point lead.", { beats: MID, events: ['check'], movedBy: 'player' }),

  // ── CHECK — Rookie checks player ──
  g("Check. Just a little first-half Spurs flex. Enjoy it while it lasts. For me.", { beats: MID, events: ['check'], movedBy: 'rookie' }),
  g("Your king has to move. I'm up — which, given last night, should terrify me.", { beats: MID, events: ['check'], movedBy: 'rookie' }),
  g("Check. I'm leading. Don't worry, leading hasn't helped anybody against the Knicks lately.", { beats: MID, events: ['check'], movedBy: 'rookie' }),
  g("That's check. I'm playing villain — every comeback needs one.", { beats: MID, events: ['check'], movedBy: 'rookie' }),

  // ── CASTLE — player ──
  g("Castled — tucking your king in the locker room. Smart. Even MVPs need a bench.", { beats: MID, events: ['castle'], movedBy: 'player' }),
  g("King to safety. The Knicks protect the rim; you protect the king. Same energy.", { beats: MID, events: ['castle'], movedBy: 'player' }),
  g("Good, castle up. Build your fortress like the Garden in the fourth quarter.", { beats: MID, events: ['castle'], movedBy: 'player' }),

  // ── CASTLE — Rookie ──
  g("Castling. Protecting my lead — which, again, has gone GREAT for my side lately.", { beats: MID, events: ['castle'], movedBy: 'rookie' }),
  g("My king's hiding. Honestly the smartest Spur on the floor right now.", { beats: MID, events: ['castle'], movedBy: 'rookie' }),

  // ── COMEBACK / TURNING POINT — player surging (the big one) ──
  g("THERE it is — the comeback. You were down and now you're not. That's a Game 4, {name}!", { beats: ['turning_point', 'late_game'], movedBy: 'player' }, 96),
  g("Down bad, then suddenly not. OG Anunoby, 1.2 seconds, tip-in. That's what you just did to me.", { beats: ['turning_point', 'late_game'], movedBy: 'player', evalMoods: ['losing', 'desperate'] }, 96),
  g("This is the 29-point comeback, live. I'm watching it happen and I can't stop it.", { beats: ['turning_point', 'late_game'], movedBy: 'player' }, 96),
  g("You flipped it. The Garden is shaking. I'm the Spurs and I do NOT like this feeling.", { beats: ['turning_point', 'late_game'], movedBy: 'player' }, 96),
  g("Comeback's on. Brunson 36, Anunoby 33, and now you: everything.", { beats: ['turning_point', 'late_game'], movedBy: 'player' }, 96),
  g("I had a lead. You're OG-ing it away from me right now and it's beautiful and rude.", { beats: ['turning_point', 'late_game'], movedBy: 'player' }, 96),

  // ── TURNING POINT — Rookie surging ──
  g("I swung it back. Briefly the Spurs again — gorgeous, doomed.", { beats: ['turning_point'], movedBy: 'rookie' }),
  g("Big move for me. I've decided to peak in the first half. My favorite mistake.", { beats: ['turning_point'], movedBy: 'rookie' }),

  // ── Rookie comfortably AHEAD = smug first-half-Spurs ──
  g("I'm up big, feeling very 81-to-52 about it. Should worry me. Doesn't. Yet.", { beats: ['early_game', 'late_game'], evalMoods: ['winning'], movedBy: 'rookie' }, 92),
  g("Comfortable lead. The Spurs had one of those. Twenty-nine of those, actually.", { beats: ['early_game', 'late_game'], evalMoods: ['winning'], movedBy: 'rookie' }, 92),
  g("I'm cruising, hitting everything. This is the part of the night that ages badly for me.", { beats: ['early_game', 'late_game'], evalMoods: ['winning'], movedBy: 'rookie' }, 92),

  // ── Rookie BEHIND = collapsing-Spurs panic ──
  g("I'm losing my grip. This is fine. This is completely fine. This is the Spurs in the third.", { beats: ['late_game', 'turning_point'], evalMoods: ['losing', 'desperate'] }, 93),
  g("My lead's gone. I blew it. I am every Spurs fan at 10pm last night.", { beats: ['late_game', 'turning_point'], evalMoods: ['losing', 'desperate'] }, 93),
  g("You're rolling and I'm collapsing on schedule. Classic Finals-opponent-of-the-Knicks behavior.", { beats: ['late_game', 'turning_point'], evalMoods: ['losing', 'desperate'] }, 93),

  // ── CHECKMATE — player wins ──
  g("Checkmate. 1.2 seconds on the clock, OG tips it in, YOU win. Shot of the year.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player', evalMoods: ['losing', 'desperate'] }, 98),
  g("That's mate, {name}. Largest-comeback-in-Finals-history energy. Banner that one.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' }, 98),
  g("You got me. The Garden is storming Midtown right now. Go enjoy it.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' }, 98),
  g("Checkmate. Mike Brown called OG's the most iconic shot in New York history. This is the most iconic mate against me. Same thing.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' }, 98),
  g("You won. Down 29, up forever. That's yours, {name}. Go Knicks.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' }, 98),
  g("Mate. You're one win from a title I will never stop talking about. Banner incoming.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' }, 98),
  g("Checkmate. I'm the Spurs and you're OG and that's the whole story.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' }, 98),

  // ── CHECKMATE — Rookie wins ──
  g("Checkmate. I got this one — but the Knicks still lead 3-1, so I'm only a little smug.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' }, 98),
  g("I won. Don't sulk. Even the Spurs won a couple games this series. Two. Just two.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' }, 98),
  g("That's mate. You're built for the comeback though — go full Game 4 on the rematch.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' }, 98),
  g("Got you. But I respect a comeback artist. Run it back, {name}.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' }, 98),
  g("Checkmate. One for me. The Knicks are still the story. So are you. Play again.", { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' }, 98),

  // ── STALEMATE ──
  g("Stalemate. Nobody storms Midtown for a draw, {name}. Let's run it back.", { beats: ['game_end'], events: ['stalemate'] }, 95),
  g("A tie. Even the 2026 Finals had a winner — this deserves one too. Again?", { beats: ['game_end'], events: ['stalemate'] }, 95),
  g("Draw. The opposite of a buzzer-beating tip-in. Rematch?", { beats: ['game_end'], events: ['stalemate'] }, 95),
];

// ────────────────────────────────────────────────────────────────
// Category pools — swapped in for the normal win/loss/landing text on
// Knicks days (see lib/quips/quip-pool.ts). Same { text, tone? } shape.
// ────────────────────────────────────────────────────────────────

export interface KnicksText {
  text: string;
  tone?: Tone;
}

// Post-game, player won (category play:win).
export const KNICKS_WIN_TEXTS: KnicksText[] = [
  { text: "You won. Down bad, then not. That's a Game 4. Go Knicks, go you.", tone: 'polite' },
  { text: "Banner that one. Largest comeback in MY history.", tone: 'baseline' },
  { text: "OG tipped his in at the buzzer. You did the chess version. Iconic.", tone: 'baseline' },
  { text: "Take it. The Garden's already storming Midtown for you.", tone: 'polite' },
  { text: "You got me. The Knicks are 3-1 and you're 1-0 on me. Big night for orange and blue.", tone: 'baseline' },
  { text: "That's yours forever. So is Game 4. What a week to play chess.", tone: 'polite' },
  { text: "I lost. The Spurs lost. We're in good, sad company.", tone: 'spicy' },
  { text: "Brunson 36, Anunoby 33, you: everything.", tone: 'baseline' },
  { text: "You closed it out. One win from a title, just like them.", tone: 'polite' },
  { text: "I'm not clapping. Okay, I'm clapping a little. Go Knicks.", tone: 'spicy' },
  { text: "Fine. Take it. I'll be over here being the Spurs about it.", tone: 'spicy' },
  { text: "You OG-ed me at the buzzer. I'm filing a complaint with the league.", tone: 'spicy' },
  { text: "Proud of you. That's a comeback I'll remember.", tone: 'polite' },
  { text: "Beautiful finish. Pure orange and blue.", tone: 'polite' },
];

// Post-game, Rookie won (category play:loss).
export const KNICKS_LOSS_TEXTS: KnicksText[] = [
  { text: "I won — but the Knicks are still up 3-1, so the city's fine. You'll be fine too.", tone: 'polite' },
  { text: "Got you this time. Even OG misses some. Come tip the next one in.", tone: 'baseline' },
  { text: "That's mine. Down 29 is recoverable though — ask the Spurs. Wait, don't.", tone: 'spicy' },
  { text: "I took it. You're a comeback artist with no comeback today. Run it back.", tone: 'baseline' },
  { text: "I win. Channel Game 4 next round and flip it on me.", tone: 'polite' },
  { text: "One for me. The Knicks didn't sweep either. Long series. Let's go again.", tone: 'baseline' },
  { text: "Won it. I'm doing a tiny Garden celebration. Tiny. Run it back.", tone: 'spicy' },
  { text: "Beat you. The whole Knicks team is MVPs and apparently so am I today.", tone: 'spicy' },
  { text: "Tough one. You've got a Game 4 in you — I've seen it.", tone: 'polite' },
  { text: "I edged it. Next one's yours. Comebacks are kind of your thing.", tone: 'polite' },
];

// Pre-game landing on /play (category play:landing).
export const KNICKS_LANDING_TEXTS: KnicksText[] = [
  { text: "Go Knicks. Now let's play some chess, {name}." },
  { text: "Orange and blue today. Down 29 last night, up forever this morning. Let's run it." },
  { text: "MSG's still buzzing. Bring some of that here — your move." },
  { text: "3-1 lead, one win from a title. Let's get you a win of your own." },
  { text: "I watched OG tip it in at the buzzer, then came here to lose to you. Hopefully not. Let's go." },
  { text: "The Knicks won their comeback. You here for yours? Pick a side." },
  { text: "I'm in full orange and blue. Beat me and we'll call it a championship week.", tone: 'spicy' },
  { text: "Largest comeback in Finals history was last night. Let's see yours. Play." },
  { text: "Let's play. The Spurs are still finding their car in the MSG parking garage." },
  { text: "I'm feeling cocky — Knicks are 3-1. Come knock it out of me.", tone: 'spicy' },
];

// First-time welcome screen greetings (plain strings — the onboarding screen
// doesn't use the quip pool).
export const KNICKS_WELCOME_LINES: string[] = [
  // Lead line — the 29-point comeback as the beginner's own hook.
  "Down 29, won anyway — that was the Knicks last night. If they can come back, you can learn chess. Let's go.",
  "Go Knicks! Let's play some chess.",
  "Orange and blue today — welcome! Want to learn chess? I've got you.",
  "GO KNICKS. Also, hi. Ready to learn some chess?",
  "Welcome! The Knicks won the comeback last night. Let's start yours.",
  "Go Knicks! New here? Perfect — five minutes and you'll move your first piece.",
];

/** Pick a random Knicks welcome greeting. */
export function pickKnicksWelcomeLine(): string {
  return KNICKS_WELCOME_LINES[Math.floor(Math.random() * KNICKS_WELCOME_LINES.length)];
}
