/**
 * V2 Curriculum Puzzle Responses
 *
 * Section-specific quips that match the block themes:
 * - Block 1: "End the Game" - Try not to smile too big, say good game, savage checkmate energy
 * - Block 2: "Take Their Stuff" - Greedy, thievery, pocket-picking energy
 * - Block 3: "Break Their Spirit" - Grinding, crushing hope, converting advantages
 * - Block 4: "Display Your Strength" - Show-off, proving yourself, confidence
 *
 * ~30 quips per section, tagged by theme for piece-specific responses
 */

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK 1: END THE GAME
// Tone: Savage finishes, try not to gloat, good game energy
// ═══════════════════════════════════════════════════════════════════════════

export const block1Responses = {
  // Section 1: Mate in One - The Basics
  'sec-1': {
    general: [
      "Say good game. Try not to smirk.",
      "That's checkmate. Act surprised.",
      "One move. One win. One awkward handshake.",
      "Try not to smile too big. They're watching.",
      "GG. Keep a straight face.",
      "Checkmate. Now look humble.",
      "That was fast. Pretend you had to think about it.",
      "The king falls. Look sympathetic.",
      "Game over. Don't dance. Yet.",
      "Checkmate delivered. Poker face: ON.",
    ],
    mateIn1: [
      "One move to end a friendship.",
      "Blink and it's checkmate.",
      "They never saw it coming. You did.",
      "Speed run: complete.",
      "The fastest goodbye in chess.",
      "In and out. Clean finish.",
    ],
    smotheredMate: [
      "Suffocated by their own pieces. Poetic.",
      "The knight whispered 'shhh' and it was over.",
      "Smothered. By a horse. Embarrassing.",
      "Their own army betrayed them.",
      "No room to breathe. No room to escape.",
      "The ultimate betrayal: death by friends.",
    ],
    backRankMate: [
      "They built a wall. It became a prison.",
      "Should've made a window.",
      "Trapped at home. Classic.",
      "Their pawns sealed their fate.",
      "No escape hatch. No hope.",
      "Back rank problems require back rank solutions.",
    ],
    arabianMate: [
      "Knight and rook: the dynamic duo strikes.",
      "Ancient technique. Timeless destruction.",
      "The Arabian finish. Chef's kiss.",
      "A classic for a reason.",
    ],
  },

  // Section 2: Mating Patterns
  'sec-2': {
    general: [
      "Pattern recognized. Pattern executed.",
      "You've seen this before. They haven't.",
      "The classics never go out of style.",
      "Textbook finish. Close the book.",
      "Another one for the highlight reel.",
      "Patterns win games. You know the patterns.",
      "They walked into a known trap.",
      "History repeats itself. For them, badly.",
      "Seen it. Solved it. Served it.",
      "The old tricks are the best tricks.",
    ],
    doubleBishopMate: [
      "Two bishops, one coffin.",
      "The diagonal duo delivers.",
      "Criss-cross destruction.",
      "Bishops see everything. Including the end.",
      "Double diagonal doom.",
    ],
    hookMate: [
      "Hooked and cooked.",
      "The hook pattern lands again.",
      "Caught on the hook. Game over.",
      "That's bait they couldn't resist.",
    ],
  },

  // Section 3: Advanced Mating Patterns
  'sec-3': {
    general: [
      "Big brain checkmate. Act casual.",
      "They didn't see that coming. You did.",
      "The hidden checkmate reveals itself.",
      "Complexity? What complexity? Easy.",
      "Found it. Finished it.",
      "The sneaky checkmate strikes again.",
      "Now that's advanced. And painful.",
      "Layers of pain, all leading to mate.",
      "You see deeper. They see defeat.",
      "When the checkmate hides, you find it.",
    ],
    dovetailMate: [
      "The queen pins them to oblivion.",
      "Dovetailed and done.",
      "Nowhere to fly. Nowhere to hide.",
      "The perfect fitting end.",
    ],
    discoveredAttack: [
      "Surprise! It's over.",
      "The real threat was behind the curtain.",
      "Reveal and destroy.",
      "One moves. One kills. Confusion ensues.",
      "The ambush worked perfectly.",
    ],
    mateIn3: [
      "Three moves of pure calculation.",
      "Saw it all. Did it all.",
      "The long con. The short victory.",
      "Three steps to their demise.",
      "Calculated. Precise. Brutal.",
    ],
  },

  // Section 4: Multi-Move Checkmates
  'sec-4': {
    general: [
      "Plan executed. Crown collected.",
      "You saw further. They fell harder.",
      "Multiple moves, one outcome: checkmate.",
      "The setup was beautiful. The finish, brutal.",
      "Patience rewarded with checkmate.",
      "They thought they had time. They didn't.",
      "Every move led here. To their end.",
      "Forced all the way. No escaping fate.",
      "The net closes. The king falls.",
      "Calculated destruction. Say GG.",
    ],
    mateIn2: [
      "Two moves. Two perfect moves.",
      "Setup, strike. Done.",
      "The one-two punch lands.",
      "First the trap. Then the finish.",
      "They had one response. Both led here.",
      "Short but decisive.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK 2: TAKE THEIR STUFF
// Tone: Greedy, thievery, collecting pieces, pocket-picking
// ═══════════════════════════════════════════════════════════════════════════

export const block2Responses = {
  // Section 5: Free Pieces
  'sec-5': {
    general: [
      "Finders keepers.",
      "Thanks for the donation.",
      "That piece was just sitting there. Not anymore.",
      "Free real estate.",
      "Unattended valuables collected.",
      "They left the door open. You walked in.",
      "Gift accepted. No receipt needed.",
      "That's mine now.",
      "You didn't steal it. They gave it away.",
      "Easy pickings.",
    ],
    hangingPiece: [
      "Hanging? Hanging gone.",
      "Undefended means unemployed.",
      "Lonely piece, now your piece.",
      "They forgot about that one. You didn't.",
      "Dangling like a piñata. Taken.",
      "No bodyguard? No piece.",
    ],
    crushing: [
      "Crushing complete. Collect the pieces.",
      "The advantage converts itself.",
      "When you're winning, keep winning.",
      "Pile on. It's allowed.",
      "The snowball becomes an avalanche.",
    ],
  },

  // Section 6: Knight Forks
  'sec-6': {
    general: [
      "The knight takes what it wants.",
      "L-shaped larceny.",
      "Horsey chose chaos. And profit.",
      "Two victims. One horse. No survivors.",
      "The fork master strikes.",
      "Knights don't ask. They take.",
      "Hop in, hop out, pockets full.",
      "The tricky pony profits again.",
      "They can't guard what they can't predict.",
      "Fork around and find out.",
    ],
    fork: [
      "Two targets. Pick which one to lose.",
      "Fork delivered. Payment received.",
      "Double attack, double trouble.",
      "One knight, two problems, zero solutions.",
      "The horse sees what others miss.",
      "Forked and they can't get up.",
    ],
    knight: [
      "The knight is a menace. Your menace.",
      "L-shaped violence pays well.",
      "The horse doesn't care about your plans.",
      "Knights jump over problems. Into profit.",
      "The L stands for Loot.",
      "Bounce, bounce, bank.",
    ],
  },

  // Section 7: Pins
  'sec-7': {
    general: [
      "Pinned and soon to be collected.",
      "Frozen piece. Easy pickings.",
      "Can't move. Won't survive.",
      "Stuck between a rock and your taking it.",
      "The invisible leash tightens.",
      "Paralyzed. Profitable.",
      "Move? Can't. Stay? Die.",
      "Pinned to the board of shame.",
      "Glued in place. Soon to be removed.",
      "The geometry of greed.",
    ],
    pin: [
      "Pinned piece, free piece.",
      "See through you. Take from you.",
      "The pin collects its toll.",
      "Stuck there. Stuck forever. Well, until you take it.",
      "The x-ray sees, the x-ray takes.",
      "Line them up, collect the prize.",
    ],
  },

  // Section 8: Skewers
  'sec-8': {
    general: [
      "Run and leave your friend behind.",
      "Big piece moves, little piece dies.",
      "The reverse pin pays dividends.",
      "Step aside. I'm taking what's behind you.",
      "Through and through. Thanks for the piece.",
      "The skewer special: move and lose.",
      "Threaded the needle. Through their defense.",
      "Shish kebab'd. Delicious.",
      "Save yourself. Abandon ship.",
      "X-ray robbery successful.",
    ],
    skewer: [
      "Skewered. Served.",
      "The big one flees. The small one falls.",
      "Attack through. Take behind.",
      "One line, two pieces, one loss (theirs).",
      "The coward tax is paid.",
      "Run away, leave a tip.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK 3: BREAK THEIR SPIRIT
// Tone: Grinding, crushing hope, converting, slow inevitable doom
// ═══════════════════════════════════════════════════════════════════════════

export const block3Responses = {
  // Section 9: Rook Endgames
  'sec-9': {
    general: [
      "The rook does what rooks do.",
      "Active rook, passive opponent, predictable outcome.",
      "Endgame technique. Cold efficiency.",
      "The rook grinds. The opponent folds.",
      "Slow, steady, devastating.",
      "Rook endings are drawn? Not this one.",
      "The heavy piece does heavy lifting.",
      "From here, it's just a matter of time.",
      "Technical. Brutal. Effective.",
      "The rook remembers. The rook punishes.",
    ],
    rookEndgame: [
      "Rook endgame mastery on display.",
      "Activity is everything. You have it.",
      "The rook cuts off hope.",
      "Behind the pawn, ahead in the game.",
      "Lucena who? You got this.",
      "The rook dominates the open file. And the game.",
    ],
  },

  // Section 10: Pawn Endgames
  'sec-10': {
    general: [
      "Every pawn dreams of this moment.",
      "March forward. Don't look back.",
      "The little piece becomes the big threat.",
      "Opposition seized. Game decided.",
      "Push. Promote. Punish.",
      "The king finally fights. And wins.",
      "Pawn endgames: where calculation matters most.",
      "One square at a time. To victory.",
      "The promotion parade begins.",
      "Pawns don't forget. Pawns deliver.",
    ],
    pawnEndgame: [
      "King and pawn vs king. Your king wins.",
      "The square of the pawn says yes.",
      "Opposition is everything. You have it.",
      "The pawn reaches the promised land.",
      "Key squares controlled. Game controlled.",
    ],
    promotion: [
      "From peasant to queen. Inspiring.",
      "The glow-up is complete.",
      "New queen just dropped.",
      "The pawn believed. The pawn achieved.",
      "Promotion: the ultimate flex.",
    ],
  },

  // Section 11: Advanced Tactics
  'sec-11': {
    general: [
      "The sneaky stuff works too.",
      "Distract, deflect, dominate.",
      "Not all tactics are obvious. This one worked.",
      "The subtle approach. The crushing result.",
      "They never saw it. You always did.",
      "Advanced problems require advanced solutions.",
      "Finesse beats force. Sometimes.",
      "The hidden tactic reveals itself.",
      "Outplayed on another level.",
      "When simple doesn't work, smart does.",
    ],
    deflection: [
      "Defender distracted. Defenses destroyed.",
      "Look over there! Too late.",
      "Pulled away from duty. Paid the price.",
      "The decoy worked. It always works.",
    ],
    xRayAttack: [
      "Seen through. Taken through.",
      "X-ray vision, x-ray destruction.",
      "The attack goes through obstacles.",
      "Transparent defense.",
    ],
    trappedPiece: [
      "Nowhere to run. Nowhere to hide.",
      "The walls closed in. Game over.",
      "Trapped like a rat. Taken like a snack.",
      "That piece was already gone. They just didn't know.",
    ],
    attraction: [
      "Come here... closer... gotcha.",
      "Lured to destruction.",
      "They walked right into it.",
      "Attracted to their own demise.",
    ],
  },

  // Section 12: Endgames Mix
  'sec-12': {
    general: [
      "Endgame technique wins another one.",
      "Convert, convert, convert.",
      "From advantage to victory. Clinical.",
      "The long game pays off.",
      "Grinding complete. Spirit broken.",
      "Technique over tricks. Always.",
      "You're not just ahead. You're winning.",
      "The conversion is textbook.",
      "Slow suffocation. Fast surrender.",
      "When you know endgames, you win endgames.",
    ],
    knightEndgame: [
      "The knight finds the outpost. The knight wins.",
      "Knights are weird. Weird wins.",
      "The horse does horsey things. Successfully.",
    ],
    bishopEndgame: [
      "The bishop sees far. The bishop wins.",
      "Diagonal domination.",
      "Long-range endgame sniper.",
    ],
    queenEndgame: [
      "The queen cleans up what the queen created.",
      "Queen vs king. The queen always wins. Eventually.",
      "Don't stalemate. Do checkmate.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK 4: DISPLAY YOUR STRENGTH
// Tone: Show-off, proving mastery, confident, "told you so" energy
// ═══════════════════════════════════════════════════════════════════════════

export const block4Responses = {
  // Section 13: Review Checkmates
  'sec-13': {
    general: [
      "Still got it.",
      "Checkmates? Easy. Next.",
      "Remembered and executed.",
      "The patterns are burned in.",
      "You know these. You crush these.",
      "Review complete. Mastery confirmed.",
      "Old friends, these checkmates.",
      "Like riding a bike. A checkmate bike.",
      "The fundamentals never fail.",
      "Been there, mated that.",
    ],
    mateIn1: [
      "One move win. Muscle memory.",
      "Speed checkmate. Autopilot.",
      "Seen it, solved it, served it.",
    ],
    mateIn2: [
      "Two moves. Zero hesitation.",
      "The setup and finish? Automatic.",
      "Calculated instantly.",
    ],
    backRankMate: [
      "Back rank? Back to basics. Back to winning.",
      "The classic. Still deadly.",
      "Trapped at home. Classic you.",
    ],
  },

  // Section 14: Review Winning Material
  'sec-14': {
    general: [
      "Still stealing. Still winning.",
      "The tactics remain sharp.",
      "Pattern recognition: elite.",
      "They can't hide from what you know.",
      "Material advantage? Secured.",
      "Your tactical vision is locked in.",
      "Proven again. You see it all.",
      "The tricks don't work on you. Yours work on them.",
      "Review mode, still deadly mode.",
      "Fundamentals fortified.",
    ],
    fork: [
      "Fork spotted. Fork executed.",
      "Two pieces, one problem. Solved.",
      "The double attack is automatic now.",
    ],
    pin: [
      "Pinned and collected. As always.",
      "The frozen piece falls. As expected.",
      "X-ray vision never fades.",
    ],
    skewer: [
      "Skewer skills: still sharp.",
      "Through and through. Every time.",
      "The reverse pin delivers again.",
    ],
  },

  // Section 15: Review Endgames
  'sec-15': {
    general: [
      "Endgame technique: polished.",
      "Converting advantages is what you do.",
      "The grind? You love the grind.",
      "Technical excellence on display.",
      "Review endgames? You mean showcase endgames.",
      "The ending is always the same: you win.",
      "Technique doesn't fade. Neither do you.",
      "From ahead to victorious. Routine.",
      "The endgame is where you shine.",
      "Proven conversion skills.",
    ],
    rookEndgame: [
      "Rook endings? Your specialty.",
      "Activity wins. You know this.",
    ],
    pawnEndgame: [
      "King and pawn mastery confirmed.",
      "Opposition secured. Again.",
    ],
    queenEndgame: [
      "Queen technique: flawless.",
      "No stalemates. Only checkmates.",
    ],
  },

  // Section 16: Level 1 Final
  'sec-16': {
    general: [
      "Final boss? More like final flex.",
      "Everything you learned, all at once. Handled.",
      "Mixed puzzles? Mixed results: all wins.",
      "The ultimate test. Aced.",
      "Level 1 mastery: CONFIRMED.",
      "Ready for Level 2. Clearly.",
      "You proved it. You're ready.",
      "The final exam? Easy A.",
      "When everything's mixed, you still shine.",
      "Graduate with honors.",
      "This was the test. You passed.",
      "No theme? No problem. You see everything.",
      "The real final boss was the puzzles we crushed along the way.",
      "Level 1 complete. Level 2 awaits.",
      "Mastery test: mastered.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type SectionResponses = {
  general: string[];
  [theme: string]: string[];
};

const allBlockResponses: Record<string, Record<string, SectionResponses>> = {
  'block-1': block1Responses,
  'block-2': block2Responses,
  'block-3': block3Responses,
  'block-4': block4Responses,
};

/**
 * Get a section-specific response for the v2 curriculum
 * @param sectionId - The section ID (e.g., 'sec-1', 'sec-5')
 * @param themes - Array of puzzle themes to match against
 * @returns A themed response or general section response
 */
export function getV2Response(sectionId: string, themes?: string[]): string {
  // Determine which block this section belongs to
  const sectionNum = parseInt(sectionId.replace('sec-', ''), 10);
  let blockId: string;

  if (sectionNum <= 4) blockId = 'block-1';
  else if (sectionNum <= 8) blockId = 'block-2';
  else if (sectionNum <= 12) blockId = 'block-3';
  else blockId = 'block-4';

  const blockResponses = allBlockResponses[blockId];
  if (!blockResponses) return "Nice!";

  const sectionResponses = blockResponses[sectionId];
  if (!sectionResponses) return "Nice!";

  // Try to find a theme-specific response
  if (themes && themes.length > 0) {
    for (const theme of themes) {
      const themeLower = theme.toLowerCase();

      // Check for exact matches and partial matches
      for (const key of Object.keys(sectionResponses)) {
        if (key === 'general') continue;

        const keyLower = key.toLowerCase();
        if (themeLower.includes(keyLower) || keyLower.includes(themeLower)) {
          return pickRandom(sectionResponses[key]);
        }
      }
    }
  }

  // Fall back to general section responses
  return pickRandom(sectionResponses.general);
}

/**
 * Get the block ID from a lesson ID
 */
export function getBlockFromLessonId(lessonId: string): string {
  const parts = lessonId.split('.');
  if (parts.length < 2) return 'block-1';

  const sectionNum = parseInt(parts[1], 10);
  if (sectionNum <= 4) return 'block-1';
  if (sectionNum <= 8) return 'block-2';
  if (sectionNum <= 12) return 'block-3';
  return 'block-4';
}

/**
 * Get the section ID from a lesson ID
 */
export function getSectionFromLessonId(lessonId: string): string {
  const parts = lessonId.split('.');
  if (parts.length < 2) return 'sec-1';
  return `sec-${parts[1]}`;
}
