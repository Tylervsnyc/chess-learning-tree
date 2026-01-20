// Fun responses for puzzle feedback
// Keep them short, punchy, and encouraging!

// ===========================================
// GENERIC CORRECT RESPONSES (fallback)
// ===========================================
export const correctResponses = [
  "Nailed it!",
  "Boom!",
  "Chef's kiss.",
  "You see it.",
  "Sharp eyes!",
  "That's the move.",
  "Textbook.",
  "Clean.",
  "Smooth.",
  "Crushed it.",
  "Nice find!",
  "Gotcha.",
  "Beautiful.",
  "Yep, that's it.",
  "Spot on.",
  "Money.",
  "There it is.",
  "You're cooking.",
  "Big brain move.",
  "Like butter.",
];

// ===========================================
// THEME-SPECIFIC CORRECT RESPONSES
// Keys match against theme names/tags (case-insensitive, partial match)
// ===========================================
export const themedCorrectResponses: Record<string, string[]> = {
  // FORKS
  fork: [
    "Forking brilliant!",
    "Stick a fork in 'em!",
    "Two birds, one piece.",
    "Fork yeah!",
    "Double trouble served.",
    "They're forked.",
    "Can't save both!",
    "Fork-tastic!",
    "Dinner is served. 🍴",
    "Two targets, one move.",
  ],
  "knight fork": [
    "The knight strikes twice!",
    "Horsey goes brrr.",
    "L-shaped destruction.",
    "The fork master!",
    "Knights are sneaky like that.",
  ],
  "pawn fork": [
    "Little pawn, big damage!",
    "Pawn power!",
    "The mighty pawn strikes.",
    "Never underestimate a pawn.",
    "Small but deadly.",
  ],
  "royal fork": [
    "King AND Queen? Greedy!",
    "The royal treatment.",
    "Forking royalty!",
    "Bow before the fork.",
    "Crown jewels attacked!",
  ],

  // PINS
  pin: [
    "Pinned and helpless.",
    "Stuck like glue.",
    "They can't move!",
    "Frozen in place.",
    "Pinned to perfection.",
    "That piece isn't going anywhere.",
    "Absolute dominance.",
    "X-ray vision!",
    "The pin is in.",
    "Immobilized!",
  ],
  "absolute pin": [
    "Absolutely pinned!",
    "Can't move, won't move.",
    "Illegal to escape!",
    "The king says stay.",
  ],

  // SKEWERS
  skewer: [
    "Skewered!",
    "Shish kebab!",
    "Run away... into danger.",
    "Move and lose more.",
    "The reverse pin!",
    "Skewered like a kebab.",
    "X-ray attack!",
    "Through and through.",
    "Step aside? Don't mind if I do.",
    "Nowhere to hide.",
  ],

  // DISCOVERED ATTACKS
  discovered: [
    "Surprise!",
    "Didn't see that coming!",
    "The hidden threat.",
    "Revealed!",
    "Double whammy.",
    "Discovery channel.",
    "Now you see it.",
    "Unmasked!",
    "Two threats for one.",
    "Ambush!",
  ],
  "double check": [
    "DOUBLE CHECK!",
    "Two checks, one move!",
    "Can't block that.",
    "King must run!",
    "The ultimate threat.",
  ],

  // CHECKMATE PATTERNS
  mate: [
    "Checkmate!",
    "Game over.",
    "The king falls.",
    "No escape.",
    "That's mate!",
    "Lights out.",
    "GG.",
    "Crown taken.",
    "Finished!",
    "The end.",
  ],
  "mateIn1": [
    "One and done!",
    "Mate in one, seen!",
    "Quick finish.",
    "Instant checkmate.",
    "One-move wonder.",
  ],
  "mateIn2": [
    "Two moves to glory!",
    "Calculated.",
    "Saw it all the way.",
    "Two steps ahead.",
    "The setup pays off.",
  ],
  "mateIn3": [
    "Three moves deep!",
    "Big brain calculation.",
    "You saw all that?!",
    "Grandmaster vision.",
    "Calculated to the end.",
  ],
  "back rank": [
    "Back rank beauty!",
    "No escape square!",
    "Trapped on the back rank.",
    "Classic back rank.",
    "The corridor of doom.",
  ],
  "smothered": [
    "Smothered mate!",
    "Suffocated by friends.",
    "The knight does it again.",
    "No room to breathe.",
    "Classic smother!",
  ],
  "arabian": [
    "Arabian mate!",
    "Rook and knight combo.",
    "Ancient technique.",
    "The Arabian classic.",
  ],
  "anastasia": [
    "Anastasia's mate!",
    "The deadly duo.",
    "Knight and rook strike.",
    "Anastasia approved.",
  ],

  // SACRIFICES
  sacrifice: [
    "Worth it!",
    "Sacrifice accepted... and punished!",
    "Gave to gain.",
    "The gambit pays off.",
    "Brilliant sacrifice!",
    "Material is temporary.",
    "Who needs that piece anyway?",
    "Sacrifice for glory!",
  ],
  "queen sacrifice": [
    "QUEEN SAC!",
    "The queen dies... for glory!",
    "Worth the crown.",
    "Bold move!",
    "The ultimate sacrifice.",
  ],

  // DEFLECTION / DECOY / INTERFERENCE
  deflection: [
    "Deflected!",
    "Look over there!",
    "Distraction successful.",
    "Defender removed.",
    "Misdirection master.",
  ],
  decoy: [
    "Baited!",
    "Walked right into it.",
    "The trap worked.",
    "Lured into position.",
    "Decoy deployed.",
  ],
  interference: [
    "Interference!",
    "Blocked the connection.",
    "Communication cut.",
    "In the way!",
    "Disrupted.",
  ],
  overloading: [
    "Overloaded!",
    "Too many jobs.",
    "Can't do both!",
    "Stretched too thin.",
    "One piece, two duties.",
  ],
  "removing the defender": [
    "Defender deleted.",
    "Who's protecting now?",
    "Support removed.",
    "Exposed!",
    "No more backup.",
  ],
  attraction: [
    "Come here...",
    "Lured in!",
    "Walked right into it.",
    "The trap is set.",
  ],

  // ZWISCHENZUG (INTERMEZZO)
  zwischenzug: [
    "Zwischenzug!",
    "In-between move!",
    "Wait, not yet!",
    "Sneaky intermezzo.",
    "The unexpected pause.",
  ],
  intermezzo: [
    "Intermezzo!",
    "In-between brilliance.",
    "Patience pays.",
    "Not so fast!",
  ],

  // TRAPPED PIECES
  "trapped piece": [
    "Trapped!",
    "No way out.",
    "Caged!",
    "Going nowhere.",
    "Caught!",
  ],
  trapping: [
    "Trapped!",
    "Nowhere to run.",
    "Boxed in!",
    "The cage closes.",
    "Escape impossible.",
  ],

  // HANGING PIECES
  hanging: [
    "Free piece!",
    "Don't mind if I do.",
    "Undefended? Mine!",
    "Easy pickings.",
    "Gift accepted.",
  ],

  // ENDGAME
  endgame: [
    "Endgame technique!",
    "The finish line.",
    "Converting the advantage.",
    "Endgame excellence.",
    "Technical precision.",
  ],
  promotion: [
    "New queen incoming!",
    "Pawn's big day!",
    "Promotion!",
    "From pawn to queen!",
    "Level up!",
  ],
  opposition: [
    "Opposition seized!",
    "King battle won.",
    "The key squares.",
    "Endgame fundamentals.",
  ],

  // CAPTURES
  capture: [
    "Clean capture!",
    "Material gained.",
    "Took it.",
    "Nom nom.",
    "Piece collected.",
  ],
  "winning material": [
    "Free real estate.",
    "Material advantage!",
    "That's profit.",
    "Banking material.",
  ],

  // CHECK
  check: [
    "Check!",
    "King under fire.",
    "Move that king!",
    "Incoming!",
    "Your majesty, duck!",
  ],

  // CASTLING
  castling: [
    "Castle complete!",
    "King is safe.",
    "Tucked away.",
    "Safety first.",
    "Fortress built.",
  ],

  // OPENING
  opening: [
    "Strong opening!",
    "Development first.",
    "Center control.",
    "Principles followed.",
    "Solid start.",
  ],

  // DEFENSE
  defense: [
    "Solid defense!",
    "Held the line.",
    "Not today!",
    "Threat neutralized.",
    "Defense wins games.",
  ],
  "defensive move": [
    "Great defense!",
    "Crisis averted.",
    "Saved it!",
    "Dodged that one.",
  ],

  // QUIET MOVES
  "quiet move": [
    "Quiet but deadly.",
    "The calm before the storm.",
    "Subtle!",
    "No rush.",
    "Positional!",
  ],
};

// ===========================================
// STREAK RESPONSES
// ===========================================
export const streakResponses: Record<number, string[]> = {
  2: [
    "Two in a row!",
    "Double trouble.",
    "Heating up...",
    "Back to back!",
    "Encore!",
  ],
  3: [
    "Three-peat!",
    "Hat trick!",
    "On fire!",
    "Unstoppable.",
    "Triple threat.",
  ],
  5: [
    "High five! 🖐️",
    "Halfway to legend.",
    "Five alive!",
    "Dominant.",
    "Can't touch this.",
  ],
  10: [
    "Double digits!",
    "TEN. Sheesh.",
    "Machine mode.",
    "Are you a GM?",
    "Flawless.",
  ],
  15: [
    "Fifteen and thriving!",
    "You're built different.",
    "This is scary good.",
    "No signs of stopping.",
    "Legendary run.",
  ],
  20: [
    "TWENTY. Wow.",
    "Hall of fame stuff.",
    "Is this even legal?",
    "Absolute monster.",
    "Peak performance.",
  ],
  25: [
    "Quarter century!",
    "You can't be stopped.",
    "Grandmaster vibes.",
    "This is art.",
    "Incredible.",
  ],
  30: [
    "THIRTY?!",
    "You're in the zone.",
    "History in the making.",
    "Unreal.",
    "Built different.",
  ],
  40: [
    "Forty and counting!",
    "Save some for the rest of us.",
    "This is getting ridiculous.",
    "Untouchable.",
    "Magnus who?",
  ],
  50: [
    "FIFTY! 🔥",
    "Half a hundred!",
    "You're a legend.",
    "Take a bow.",
    "Absolutely insane.",
  ],
  75: [
    "75?! Unbelievable.",
    "You're writing history.",
    "I'm out of words.",
    "GOAT status.",
    "Bow down.",
  ],
  100: [
    "💯 ONE HUNDRED! 💯",
    "The promised land.",
    "You did it. You crazy legend.",
    "Perfection achieved.",
    "Century club!",
  ],
};

// ===========================================
// WRONG RESPONSES (encouraging)
// ===========================================
export const wrongResponses = [
  "Not quite. Try again!",
  "Close! Keep going.",
  "Oops. You got this.",
  "Almost there.",
  "Tricky one! Retry?",
  "Nope, but you're learning.",
  "Missed it. No worries.",
  "That's a tough one.",
  "Shake it off.",
  "Part of the journey.",
  "Good try though.",
  "The board is sneaky.",
  "Happens to the best.",
  "Reset and refocus.",
  "Keep looking!",
  "Not this time.",
  "Learn and move on.",
  "Chess is hard!",
  "One step closer.",
  "You'll get the next one.",
];

// ===========================================
// THEME-SPECIFIC WRONG RESPONSES
// ===========================================
export const themedWrongResponses: Record<string, string[]> = {
  fork: [
    "Look for two targets!",
    "Find the fork!",
    "Which piece attacks two?",
    "Think forks...",
  ],
  pin: [
    "Something's pinned...",
    "Look for the line!",
    "What can't move?",
    "Find the pin!",
  ],
  skewer: [
    "X-ray through!",
    "Make them move into trouble.",
    "Think skewer...",
  ],
  mate: [
    "Checkmate is close!",
    "The king can be trapped.",
    "Find the killing blow.",
    "Mate is there!",
  ],
  mateIn1: [
    "One move wins!",
    "Checkmate in one exists.",
    "Look closer!",
  ],
  sacrifice: [
    "Sometimes you have to give.",
    "What if you sacrificed?",
    "Material isn't everything.",
  ],
  discovered: [
    "What's hiding?",
    "Move one, reveal another.",
    "The hidden attack...",
  ],
};

// ===========================================
// STREAK BROKEN RESPONSES
// ===========================================
export const streakBrokenResponses = [
  "Streak broken, but what a run!",
  "All good things... Now rebuild!",
  "That was impressive though.",
  "Back to zero, back to greatness.",
  "The comeback starts now.",
  "Shake it off. Go again.",
  "Nice streak! Let's beat it.",
  "Reset the counter, not the skill.",
  "That was a good run!",
  "Time for a new streak.",
];

// ===========================================
// SIMPLE RESPONSES (for puzzles 2, 4, etc.)
// ===========================================
export const simpleCorrectResponses = [
  "Correct.",
  "Got it.",
  "Right.",
  "Yes.",
  "Correct!",
  "✓",
];

export const simpleWrongResponses = [
  "Try again.",
  "Not quite.",
  "Nope.",
  "Incorrect.",
  "Miss.",
];

// ===========================================
// WHICH PUZZLES GET FUN MESSAGES
// Puzzles 1, 3, 5 get themed/fun responses
// Puzzles 2, 4 get simple "Correct" / "Try again"
// ===========================================
const FUN_MESSAGE_PUZZLES = new Set([1, 3, 5]);

export function shouldShowFunMessage(puzzleNumber: number): boolean {
  // First 5 puzzles follow the 1,3,5 pattern
  if (puzzleNumber <= 5) {
    return FUN_MESSAGE_PUZZLES.has(puzzleNumber);
  }
  // After puzzle 5, show fun message every 3rd puzzle
  return puzzleNumber % 3 === 0;
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Match theme string against our themed responses
 * Handles: "Knight forks", "fork", "mateIn2", "back rank mate", etc.
 */
function findThemeMatch(theme: string | string[]): string | null {
  const themes = Array.isArray(theme) ? theme : [theme];
  const normalizedThemes = themes.map(t => t.toLowerCase());

  // Priority order: more specific matches first
  const keys = Object.keys(themedCorrectResponses).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    const keyLower = key.toLowerCase();
    for (const t of normalizedThemes) {
      // Check if theme contains the key or key contains the theme
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
  // Find exact streak tier
  if (streakResponses[streak]) {
    return pickRandom(streakResponses[streak]);
  }

  // For non-exact matches, find applicable tier
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

/**
 * Main function - get appropriate response based on puzzle result
 *
 * @param correct - Whether the puzzle was solved correctly
 * @param streak - Current streak count (after this puzzle)
 * @param theme - Puzzle theme(s) for themed responses
 * @param previousStreak - Streak before this puzzle (for streak broken messages)
 * @param puzzleNumber - Which puzzle in the set (1-indexed) for fun/simple message logic
 */
export function getPuzzleResponse(
  correct: boolean,
  streak: number,
  theme?: string | string[],
  previousStreak?: number,
  puzzleNumber?: number
): string {
  // Streak milestones ALWAYS get special messages
  if (correct && streakResponses[streak]) {
    return getStreakResponse(streak);
  }
  if (correct && streak >= 10 && streak % 10 === 0) {
    return getStreakResponse(streak);
  }

  // Streak broken ALWAYS gets special message
  if (!correct && previousStreak && previousStreak >= 5) {
    return getStreakBrokenResponse();
  }

  // Check if this puzzle should get a fun message
  const showFun = puzzleNumber ? shouldShowFunMessage(puzzleNumber) : true;

  if (!showFun) {
    // Simple response for puzzles 2, 4, etc.
    return correct ? getSimpleCorrectResponse() : getSimpleWrongResponse();
  }

  // Fun response for puzzles 1, 3, 5, etc.
  return correct ? getCorrectResponse(theme) : getWrongResponse(theme);
}
