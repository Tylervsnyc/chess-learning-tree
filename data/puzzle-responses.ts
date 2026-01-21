// Fun, edgy responses for puzzle feedback
// Trash talk energy, action movie vibes, personality
//
// ===========================================
// QUIP COUNT GUIDELINES
// ===========================================
// Scale quips based on how many lessons use that theme:
//
// TIER 1 (20+ lessons): 15-20 quips
//   - mateIn1, mateIn2, mateIn3, fork, knight fork, pin
//
// TIER 2 (10-19 lessons): 10-15 quips
//   - skewer, discovered, back rank, quiet move, deflection, endgame
//
// TIER 3 (5-9 lessons): 6-10 quips
//   - sacrifice, trapped piece, hanging, promotion, double check
//
// TIER 4 (1-4 lessons): 4-6 quips
//   - smothered, arabian, anastasia, hook mate, opera mate
//
// When adding new lessons, check if themed quips need expanding!

// ===========================================
// GENERIC CORRECT RESPONSES (fallback)
// ===========================================
export const correctResponses = [
  "Violence was the answer.",
  "Absolutely disgusting. I love it.",
  "That was mean. Do it again.",
  "They never saw it coming.",
  "Cold-blooded.",
  "No mercy.",
  "Ruthless.",
  "You woke up and chose violence.",
  "That was personal.",
  "Someone call the police.",
  "Straight to jail. For them.",
  "You didn't have to do them like that.",
  "Emotional damage.",
  "Get wrecked.",
  "Built different.",
  "That piece had a family.",
  "Disrespectful. I'm here for it.",
  "Too easy.",
  "You're dangerous.",
  "They should've stayed home today.",
];

// ===========================================
// THEME-SPECIFIC CORRECT RESPONSES
// ===========================================
export const themedCorrectResponses: Record<string, string[]> = {
  // FORKS
  fork: [
    "Two victims, one move.",
    "Pick your poison.",
    "Can't save both. Won't save either.",
    "Double trouble. Double take.",
    "They brought a knife. You brought chaos.",
    "Fork around and find out.",
    "Two birds. One piece. No survivors.",
    "Greedy. I respect it.",
    "Why take one when you can take two?",
    "The audacity.",
    "Two for one special.",
    "Decisions, decisions. Both bad.",
    "Split their defense in half.",
    "They're seeing double. And losing double.",
    "One move. Two problems. Zero solutions.",
    "Forked and can't get up.",
    "Choose your loss.",
    "The ultimate multitasker.",
  ],
  "knight fork": [
    "That knight just ate. No crumbs.",
    "L-shaped violence.",
    "The horse has no mercy.",
    "Horsey chose chaos.",
    "Knights don't ask permission.",
    "The L stands for Loss. Theirs.",
    "That knight woke up dangerous.",
    "Neigh means neigh. Wait—",
    "The knight said 'and I took that personally.'",
    "Bounced in, caused problems, left.",
    "The tricky pony strikes again.",
    "They never see the horse coming.",
    "Hop, skip, and a take.",
    "Knight vision: activated.",
    "The knight don't care about your plans.",
    "Giddyup and get wrecked.",
    "Jumped in. Jumped out. Left chaos.",
    "The knight moves in mysterious ways.",
  ],
  "pawn fork": [
    "Little guy woke up violent.",
    "The disrespect of a pawn fork.",
    "Smallest piece, biggest damage.",
    "Pawn said 'know your place.'",
    "They got forked by a PAWN.",
    "That's embarrassing for them.",
    "One square at a time. Two pieces at once.",
  ],
  "royal fork": [
    "King AND Queen? You're sick.",
    "The royal family in shambles.",
    "Monarchy in crisis.",
    "Crown jewels? More like crown fools.",
    "Regicide on the menu.",
  ],

  // PINS
  pin: [
    "Sit. Stay. Good piece.",
    "Frozen like a deer in headlights.",
    "Can't move. Won't move. Doesn't matter.",
    "Pinned to the wall of shame.",
    "That piece is a statue now.",
    "X-ray vision activated.",
    "See through you. Literally.",
    "Don't. Even. Think about it.",
    "Stuck between a rock and checkmate.",
    "That piece just became furniture.",
    "Paralyzed by fear. And geometry.",
    "Move and lose more. Stay and suffer.",
    "You're not going anywhere.",
    "The invisible leash.",
    "Frozen in place. Frozen in time.",
    "That's called being stuck.",
    "The pin is mightier than the sword.",
    "Glued to the board.",
  ],
  "absolute pin": [
    "Absolutely pinned. Absolutely cooked.",
    "Move and it's illegal. Don't move and suffer.",
    "The king says you're grounded.",
    "Legally frozen.",
  ],

  // SKEWERS
  skewer: [
    "Run. Leave your friend behind.",
    "Save yourself. Abandon the squad.",
    "Shish kebab'd.",
    "Threaded the needle. Through their soul.",
    "Move aside and watch them fall.",
    "The reverse pin. Same energy.",
    "X-ray through your defenses.",
    "Step aside. I wasn't asking.",
    "Thanks for moving. I'll take what's behind you.",
    "Coward runs, piece falls.",
    "The big piece flees. The small piece pays.",
    "Escape is just delayed loss.",
    "Through and through.",
    "One line. Two victims.",
    "The skewer special: lose now or lose later.",
  ],

  // DISCOVERED ATTACKS
  discovered: [
    "Surprise. You're done.",
    "Peek-a-boo. Gotcha.",
    "The hidden blade.",
    "Ambush successful.",
    "Now you see it. Too late.",
    "The piece behind the piece.",
    "It was a trap all along.",
    "Unmasked and unhinged.",
    "Two threats enter. One survives.",
    "The real danger was behind me.",
    "Revealed! And it's bad news for them.",
    "The curtain drops. So does their piece.",
    "What's behind door number one? Pain.",
    "Discovery: not just for science.",
    "You moved one. Revealed another. Chaos.",
  ],
  "double check": [
    "DOUBLE CHECK. Run, coward.",
    "Can't block. Can't capture. Can only cry.",
    "Two checks, zero options.",
    "The king must flee in shame.",
    "Ultimate disrespect.",
  ],

  // CHECKMATE PATTERNS
  mate: [
    "Game. Set. Match. Get out.",
    "The king falls. Long live nothing.",
    "Lights out.",
    "That's a wrap.",
    "GG. No re.",
    "Crown's in the dirt.",
    "Finish line crossed.",
    "Flawless victory.",
    "The end. Roll credits.",
    "You just ended a whole dynasty.",
    "Pack it up. It's over.",
    "The final blow.",
    "No coming back from that.",
    "Checkmate. Chef's kiss.",
    "And that's the game.",
  ],
  "mateIn1": [
    "One move. One W.",
    "Speed run complete.",
    "Didn't even need a second move.",
    "Blink and it's over.",
    "Express delivery: checkmate.",
    "One and done.",
    "Single move supremacy.",
    "That was fast.",
    "Instant checkmate. No assembly required.",
    "They never stood a chance.",
    "Quick math. Quicker checkmate.",
    "Speed chess. Emphasis on speed.",
    "Efficiency at its finest.",
    "In and out. Twenty seconds.",
    "No warm-up needed.",
    "First try. Only try.",
    "Lightning strike.",
  ],
  "mateIn2": [
    "Calculated. Twice.",
    "Two moves to destruction.",
    "They had one move to survive. They wasted it.",
    "Setup, knockout.",
    "The one-two punch.",
    "Saw it coming. Both moves.",
    "Move one: trap. Move two: finish.",
    "A quick two-step.",
    "Short and sweet.",
    "Two moves is all it takes.",
    "Planned. Executed. Done.",
    "The sequel was even better.",
    "One move to set up. One move to end.",
    "Double tap.",
    "They blinked. You struck twice.",
    "Checkmate in two. As advertised.",
  ],
  "mateIn3": [
    "Three moves ahead. Three moves to victory.",
    "Saw the whole thing. Brutal.",
    "Planned their demise in advance.",
    "Long-term chaos.",
    "Patience. Then checkmate.",
    "Three-move masterpiece.",
    "You saw all of that? Impressive.",
    "The long con. Not that long though.",
    "Setup, development, checkmate.",
    "Calculated three deep.",
    "The trilogy is complete.",
    "Beginning, middle, end. All checkmate.",
    "Triple threat executed.",
    "Three steps to victory.",
    "Deep calculation pays off.",
  ],
  "back rank": [
    "Back rank? Back to the lobby.",
    "Trapped by their own pawns. Poetic.",
    "No escape. No air. No hope.",
    "The corridor of doom.",
    "Suffocated at home.",
    "Their own wall became their prison.",
    "Classic back rank. Never gets old.",
    "Should've made a window.",
    "Home is where the checkmate is.",
    "Pawns: great for defense. Until they're not.",
    "Locked in their own house.",
    "The most embarrassing way to lose.",
    "No luft? No luck.",
    "First row problems.",
  ],
  "smothered": [
    "Smothered by friends. Tragic.",
    "Betrayed by their own pieces.",
    "The knight said 'shhhh.'",
    "No room to breathe. No room to escape.",
    "Suffocated. By a horse.",
  ],
  "arabian": [
    "Arabian mate. Ancient technique.",
    "A classic finish.",
    "Rook and knight: the dynamic duo.",
    "Old school destruction.",
  ],
  "anastasia": [
    "Anastasia's mate. Elegant.",
    "The wall and the knight agree: you're done.",
    "Historic finish.",
  ],

  // SACRIFICES
  sacrifice: [
    "Worth. Every. Piece.",
    "Sacrifice accepted. Consequences delivered.",
    "Gave a piece. Took their soul.",
    "Material is temporary. Victory is forever.",
    "A small price for total destruction.",
    "Traded wood for glory.",
    "They took the bait. Now they pay.",
    "You gave them a gift. It was a bomb.",
  ],
  "queen sacrifice": [
    "QUEEN SAC. You absolute psycho.",
    "Gave up the queen. Took their hope.",
    "The queen fell for this. Worth it.",
    "Biggest piece off. Biggest flex on.",
    "Crown for a win. Fair trade.",
  ],

  // DEFLECTION / DECOY / INTERFERENCE
  deflection: [
    "Look over there! ...too late.",
    "Distracted. Destroyed.",
    "Defender had one job. Failed.",
    "Pulled away. Punished.",
    "Misdirection complete.",
    "Hey! Look at this! Too late.",
    "The bait worked. It always works.",
    "Deflected from duty.",
    "Out of position. Out of luck.",
    "The decoy drew them out.",
    "Focus here... oops, it was there.",
    "The oldest trick in the book. Still works.",
    "Attention redirected. Damage delivered.",
    "They fell for it.",
  ],
  decoy: [
    "Walked right into it.",
    "Come here... perfect.",
    "Baited. Hooked. Cooked.",
    "They took the bait. They always do.",
    "Lured to their downfall.",
  ],
  interference: [
    "Blocked. Connection lost.",
    "Communication severed.",
    "I stepped between you and safety.",
    "Your friends can't help you now.",
    "Disrupted. Dismantled.",
  ],
  overloading: [
    "Too many jobs. Not enough piece.",
    "Overworked and overwhelmed.",
    "Can't be everywhere. Paid the price.",
    "One piece, two duties, zero chance.",
    "Stretched thin. Snapped.",
  ],
  "removing the defender": [
    "Defender deleted.",
    "Bodyguard dismissed.",
    "No backup. No hope.",
    "Took out the support. Took out the king.",
    "Who's protecting you now?",
  ],
  attraction: [
    "Come closer... closer... gotcha.",
    "Lured into the danger zone.",
    "Attracted to disaster.",
    "Walked right where I wanted.",
  ],

  // ZWISCHENZUG (INTERMEZZO)
  zwischenzug: [
    "Wait wait wait. Not so fast.",
    "In-between move. Out-of-this-world damage.",
    "You expected A. I did B. Then A.",
    "Sneaky intermediate chaos.",
    "The pause that wrecks.",
  ],
  intermezzo: [
    "Hold on. First, violence.",
    "Patience. Then destruction.",
    "The unexpected intermission.",
    "Wait your turn. My threat first.",
  ],

  // TRAPPED PIECES
  "trapped piece": [
    "Trapped like a rat.",
    "Nowhere to run.",
    "Caged. Soon to be captured.",
    "That piece is already gone.",
    "The walls closed in.",
  ],
  trapping: [
    "Got 'em cornered.",
    "Escape? In this economy?",
    "Boxed in. Checked out.",
    "The cage is complete.",
    "Going nowhere. Ever.",
  ],

  // HANGING PIECES
  hanging: [
    "Free real estate.",
    "Undefended? Don't mind if I do.",
    "They left that hanging. I left it gone.",
    "Gift accepted.",
    "Thanks for the donation.",
  ],

  // ENDGAME
  endgame: [
    "Endgame technique. Clinical.",
    "Slow and steady wins the game.",
    "The conversion begins.",
    "From here, it's just cleanup.",
    "Technical knockout incoming.",
    "Endgame? More like end game.",
    "Textbook technique.",
    "This is what practice looks like.",
    "Grinding it out. Beautifully.",
    "The final chapter. Written by you.",
    "No tricks needed. Just skill.",
    "Precision wins endgames.",
    "Closing time.",
    "The home stretch. Looking good.",
  ],
  promotion: [
    "Pawn glow-up.",
    "From nothing to everything.",
    "That pawn believed in itself.",
    "Smallest to strongest. Inspiring.",
    "New queen just dropped.",
  ],
  opposition: [
    "King vs King. Yours loses.",
    "Opposition seized. Game over.",
    "The stare-down champion.",
    "You blinked first.",
  ],

  // CAPTURES
  capture: [
    "Nom.",
    "Yoink.",
    "Deleted.",
    "One less problem.",
    "Piece acquired.",
  ],
  "winning material": [
    "Material up. Morale up.",
    "Banking pieces like a loan shark.",
    "Profit secured.",
    "You're richer now. In chess.",
  ],

  // CHECK
  check: [
    "Run, king. RUN.",
    "Incoming!",
    "Your majesty, duck.",
    "The king flinches.",
    "Check yourself. Literally.",
  ],

  // CASTLING
  castling: [
    "King's in the bunker.",
    "Safety protocol engaged.",
    "Castle built. Storm coming.",
    "Tucked in. Ready to attack.",
    "Fort Knox'd.",
  ],

  // OPENING
  opening: [
    "Principles followed. Chaos incoming.",
    "Solid foundation for violence.",
    "The calm before the storm.",
    "Setup complete. Let's eat.",
    "Opening book? More like opening hook.",
  ],

  // DEFENSE
  defense: [
    "Not today.",
    "Blocked and survived.",
    "You shall not pass.",
    "Threat? What threat?",
    "Defense wins championships.",
  ],
  "defensive move": [
    "Crisis? What crisis?",
    "Dodged that bullet.",
    "Survived to fight another move.",
    "Teflon defense.",
  ],

  // QUIET MOVES
  "quiet move": [
    "Quiet. Devastating.",
    "No rush. Just doom.",
    "The calm before the storm.",
    "Subtle chaos is still chaos.",
    "They won't see this one until it's too late.",
    "Silence is golden. And lethal.",
    "The loudest moves make no noise.",
    "Not flashy. Just effective.",
    "Whisper it: checkmate incoming.",
    "The slow build. The fast finish.",
    "Patience is a virtue. And a weapon.",
    "No check. No capture. Just winning.",
    "Sometimes the best move is the quiet one.",
    "Stealth mode: engaged.",
    "Soft footsteps. Heavy consequences.",
  ],
};

// ===========================================
// STREAK RESPONSES
// ===========================================
export const streakResponses: Record<number, string[]> = {
  2: [
    "Two in a row. They're scared now.",
    "Back to back. Getting warm.",
    "Heating up...",
    "Double whammy.",
    "That's a pattern forming.",
  ],
  3: [
    "HAT TRICK.",
    "Three-peat. They're panicking.",
    "Triple threat mode activated.",
    "On. Fire.",
    "Three down. Keep stacking.",
  ],
  5: [
    "FIVE STREAK. You're a menace.",
    "Rampage mode.",
    "Five and thriving.",
    "Hand of glory.",
    "High five... of doom.",
  ],
  10: [
    "TEN. You're actually scary.",
    "Double digits of destruction.",
    "Ten down. More to go.",
    "Unstoppable.",
    "The streak has legs now.",
  ],
  15: [
    "FIFTEEN. This is excessive.",
    "Are you okay? This is a lot.",
    "Fifteen and thriving.",
    "The wins keep piling.",
    "Someone stop this person.",
  ],
  20: [
    "TWENTY. You're unreal.",
    "Two decades of damage. Wait, wrong math.",
    "This is getting ridiculous.",
    "You should be stopped. But don't stop.",
    "Twenty. Legendary.",
  ],
  25: [
    "Quarter hundred. Is that a thing? It is now.",
    "Twenty-five. Silver anniversary of pain.",
    "This streak has its own Wikipedia page.",
    "You're writing history.",
    "Absolutely unhinged run.",
  ],
  30: [
    "THIRTY?! Go outside. After you're done.",
    "Three. Zero. Three whole tens.",
    "The streak is old enough to have opinions now.",
    "You're not human.",
    "I've run out of words. Keep going anyway.",
  ],
  40: [
    "FORTY. This is performance art.",
    "Are you speedrunning chess mastery?",
    "Forty streak. Magnus is watching. Nervously.",
    "This is historically significant.",
    "Scholars will study this run.",
  ],
  50: [
    "FIFTY. FIFTY.",
    "Half a hundred. All skill.",
    "The streak of legends.",
    "You've peaked. Wait no you haven't.",
    "This is the greatest run I've ever seen.",
  ],
  75: [
    "SEVENTY-FIVE?!",
    "I need to lie down.",
    "This shouldn't be possible.",
    "You've transcended.",
    "The streak has achieved consciousness.",
  ],
  100: [
    "ONE. HUNDRED.",
    "The prophecy is fulfilled.",
    "You did it. You absolute madman.",
    "100 streak. Retire. You've won chess.",
    "The century. Immortality achieved.",
  ],
};

// ===========================================
// WRONG RESPONSES (still encouraging but with flavor)
// ===========================================
export const wrongResponses = [
  "Oops. Violence delayed, not denied.",
  "Nope. But you'll get 'em.",
  "Wrong victim. Try again.",
  "Not that one. The other one.",
  "Close. The board is tricky.",
  "They survived. For now.",
  "Missed. Reload.",
  "That ain't it. But you're close.",
  "The pieces are lying to you.",
  "Almost. Almost doesn't count though.",
  "Swing and a miss. Swing again.",
  "They escaped. Temporarily.",
  "Not quite. Eyes on the prize.",
  "Wrong move. Right energy though.",
  "The board said no. Ask again.",
  "Denied. For now.",
  "That piece lives another day.",
  "Try again. They can't hide forever.",
  "Missed opportunity. Create another.",
  "Not today. But soon.",
];

// ===========================================
// THEME-SPECIFIC WRONG RESPONSES
// ===========================================
export const themedWrongResponses: Record<string, string[]> = {
  fork: [
    "Find two targets. Hurt both.",
    "Something attacks two things...",
    "Fork's hiding. Find it.",
    "Two victims await.",
    "What piece can hit two at once?",
    "Think: double attack.",
    "Find the fork. It's there.",
  ],
  "knight fork": [
    "Where can the horse jump?",
    "L-shape. Two targets.",
    "The knight sees something...",
  ],
  pin: [
    "Something's stuck...",
    "What can't move?",
    "Find the frozen piece.",
    "The pin is there. See it.",
    "Look for pieces in a line.",
    "What's protecting the king?",
    "Line them up.",
  ],
  skewer: [
    "Force them to move. Take what's behind.",
    "X-ray through...",
    "Big piece hides a little one.",
    "Attack the big piece. Take the small one.",
    "Think: reverse pin.",
  ],
  mate: [
    "The checkmate is there. Find it.",
    "Checkmate exists. See it.",
    "End them. Where's the finish?",
    "The king can fall here.",
    "Trap the king. How?",
  ],
  mateIn1: [
    "One move wins. Which one?",
    "Checkmate in one. It's there.",
    "Finish them. One shot.",
    "Where can you trap the king?",
    "One move. Make it count.",
  ],
  mateIn2: [
    "Two moves to win. Start with what?",
    "Force them, then finish.",
    "Setup first. Checkmate second.",
    "What forces their response?",
  ],
  mateIn3: [
    "Three moves deep. Calculate.",
    "Visualize all three.",
    "What's the first forcing move?",
    "Patient calculation wins.",
  ],
  sacrifice: [
    "Sometimes you gotta give to get.",
    "What if you... sacrificed something?",
    "Material isn't everything.",
    "Give up something. Get more.",
  ],
  discovered: [
    "What's hiding behind?",
    "Move one, reveal another.",
    "The real threat is behind.",
    "Uncover the attack.",
    "What can you unmask?",
  ],
  "quiet move": [
    "No check. No capture. Just better.",
    "Sometimes quiet is best.",
    "Improve your position first.",
    "Not every move needs to attack.",
  ],
  "back rank": [
    "Check the back rank...",
    "Is there an escape square?",
    "Can you trap them at home?",
  ],
  deflection: [
    "Distract the defender.",
    "Pull something away.",
    "What's guarding what?",
  ],
  endgame: [
    "Think technique.",
    "Slow and steady.",
    "What's the winning plan?",
  ],
};

// ===========================================
// STREAK BROKEN RESPONSES
// ===========================================
export const streakBrokenResponses = [
  "Streak's over. Revenge arc starts now.",
  "That was a good run. This one will be better.",
  "The streak fell. You didn't.",
  "Back to zero. Back to hunting.",
  "RIP streak. Time for a new one.",
  "Streak broken but not forgotten.",
  "The comeback starts here.",
  "That streak had a good run.",
  "Gone but not forgotten. Build again.",
  "One ends. Another begins.",
];

// ===========================================
// SIMPLE RESPONSES (for puzzles 2, 4, etc.)
// ===========================================
export const simpleCorrectResponses = [
  "Yep.",
  "Got it.",
  "Clean.",
  "Next.",
  "Done.",
  "Yes.",
];

export const simpleWrongResponses = [
  "Nope.",
  "Try again.",
  "Not that.",
  "Wrong.",
  "Miss.",
];

// ===========================================
// WHICH PUZZLES GET FUN MESSAGES
// ===========================================
const FUN_MESSAGE_PUZZLES = new Set([1, 3, 5]);

export function shouldShowFunMessage(puzzleNumber: number): boolean {
  if (puzzleNumber <= 5) {
    return FUN_MESSAGE_PUZZLES.has(puzzleNumber);
  }
  return puzzleNumber % 3 === 0;
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function findThemeMatch(theme: string | string[]): string | null {
  const themes = Array.isArray(theme) ? theme : [theme];
  const normalizedThemes = themes.map(t => t.toLowerCase());

  const keys = Object.keys(themedCorrectResponses).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    const keyLower = key.toLowerCase();
    for (const t of normalizedThemes) {
      if (t.includes(keyLower) || keyLower.includes(t)) {
        return key;
      }
    }
  }

  return null;
}

export function getCorrectResponse(theme?: string | string[]): string {
  if (theme) {
    const matchedKey = findThemeMatch(theme);
    if (matchedKey && themedCorrectResponses[matchedKey]) {
      return pickRandom(themedCorrectResponses[matchedKey]);
    }
  }
  return pickRandom(correctResponses);
}

export function getStreakResponse(streak: number): string {
  if (streakResponses[streak]) {
    return pickRandom(streakResponses[streak]);
  }

  const tiers = Object.keys(streakResponses)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (streak >= tiers[i] && streak % tiers[i] === 0) {
      return pickRandom(streakResponses[tiers[i]]);
    }
  }

  return getCorrectResponse();
}

export function getWrongResponse(theme?: string | string[]): string {
  if (theme) {
    const matchedKey = findThemeMatch(theme);
    if (matchedKey && themedWrongResponses[matchedKey]) {
      return pickRandom(themedWrongResponses[matchedKey]);
    }
  }
  return pickRandom(wrongResponses);
}

export function getStreakBrokenResponse(): string {
  return pickRandom(streakBrokenResponses);
}

export function getSimpleCorrectResponse(): string {
  return pickRandom(simpleCorrectResponses);
}

export function getSimpleWrongResponse(): string {
  return pickRandom(simpleWrongResponses);
}

export function getPuzzleResponse(
  correct: boolean,
  streak: number,
  theme?: string | string[],
  previousStreak?: number,
  puzzleNumber?: number
): string {
  if (correct && streakResponses[streak]) {
    return getStreakResponse(streak);
  }
  if (correct && streak >= 10 && streak % 10 === 0) {
    return getStreakResponse(streak);
  }

  if (!correct && previousStreak && previousStreak >= 5) {
    return getStreakBrokenResponse();
  }

  const showFun = puzzleNumber ? shouldShowFunMessage(puzzleNumber) : true;

  if (!showFun) {
    return correct ? getSimpleCorrectResponse() : getSimpleWrongResponse();
  }

  return correct ? getCorrectResponse(theme) : getWrongResponse(theme);
}
