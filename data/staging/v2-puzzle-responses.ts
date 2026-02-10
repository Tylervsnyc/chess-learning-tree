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
  '1.1': {
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
  '1.2': {
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
  '1.3': {
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
  '1.4': {
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
  '1.5': {
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
      "Dangling like a pi\u00f1ata. Taken.",
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
  '1.6': {
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
  '1.7': {
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
  '1.8': {
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
  '1.9': {
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
  '1.10': {
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
  '1.11': {
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
  '1.12': {
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
  '1.13': {
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
  '1.14': {
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
  '1.15': {
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
  '1.16': {
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
// LEVEL 2: THE ASSASSIN'S TOOLKIT (800-1000)
// Tone: Lethal precision, tactical weapons, material gain, professional execution
// ═══════════════════════════════════════════════════════════════════════════

export const level2Responses: Record<string, Record<string, string[]>> = {
  // Section 1: Fork Basics
  '2.1': {
    general: [
      "Two targets. One move. No survivors.",
      "The fork finds its mark.",
      "Can't defend both. Pick your poison.",
      "Double trouble delivered.",
      "Fork executed. Material secured.",
      "Attack here, attack there, win everywhere.",
      "The dual threat. Your signature move.",
      "They chose poorly. You chose both.",
      "When one threat isn't enough, use two.",
      "Precision bifurcation. Textbook.",
    ],
    fork: [
      "The classic fork. Still lethal.",
      "Knight says hello to king AND queen.",
      "Two pieces enter. One leaves.",
      "Forked and forgotten.",
    ],
  },

  // Section 2: Fork Patterns
  '2.2': {
    general: [
      "Pattern recognized. Pattern executed.",
      "The royal fork lands.",
      "You've seen this setup a hundred times. Works every time.",
      "Fork geometry: mastered.",
      "The angles don't lie.",
      "Diagonal destruction delivered.",
      "Classic fork pattern. Classic win.",
      "Setup complete. Fork deployed.",
      "The squares aligned. The pieces fell.",
      "Pattern hunting: successful.",
    ],
    fork: [
      "Royal fork spotted. Royals collected.",
      "King and queen in the crosshairs.",
      "The family fork. Devastating.",
    ],
  },

  // Section 3: Forks & More
  '2.3': {
    general: [
      "Fork plus opportunity equals material.",
      "The hanging piece didn't hang for long.",
      "Mixed tactics, unified result: winning.",
      "Forks find friends in every position.",
      "Tactical vision expanding nicely.",
      "The combination emerges.",
      "Not just a fork - a plan.",
      "Setup, fork, collect. Repeat.",
      "The tactical web tightens.",
      "Every threat compounds.",
    ],
    hangingPiece: [
      "They left it hanging. You took it.",
      "Undefended piece? Don't mind if I do.",
      "Hanging there like an invitation.",
    ],
  },

  // Section 4: Review - Double Attacks
  '2.4': {
    general: [
      "Double attack review: still deadly.",
      "The fork skills remain sharp.",
      "Pattern recognition on autopilot.",
      "Mixed forks, same results.",
      "Review mode. Still crushing it.",
      "All the forks. All the time.",
      "Double attack mastery: confirmed.",
      "The two-threat toolkit: complete.",
      "Fork fundamentals: locked in.",
      "Review complete. Forks deployed.",
    ],
  },

  // Section 5: Absolute Pins
  '2.5': {
    general: [
      "Pinned to the king. Nowhere to go.",
      "The absolute pin locks them down.",
      "Frozen in place. Easy target.",
      "X-ray vision activated.",
      "Pinned piece = dead piece.",
      "The line attack strikes.",
      "King behind it? Can't move.",
      "Absolute pin deployed. Absolutely winning.",
      "They're stuck. You're not.",
      "The pin holds. The material falls.",
    ],
    pin: [
      "Pin applied. Pressure sustained.",
      "The bishop sees through them.",
      "Rook pin. King behind. GG.",
      "The geometry of destruction.",
    ],
  },

  // Section 6: Exploiting Pins
  '2.6': {
    general: [
      "Pinned and piled on.",
      "Add attackers. Overwhelm the pin.",
      "The relative pin pays dividends.",
      "They CAN move... but they won't.",
      "Pile on the pinned piece.",
      "Exploiting weakness: your specialty.",
      "The pin creates the opportunity.",
      "Stack the attackers. Break the position.",
      "Pinned piece under fire.",
      "Maximum pressure on the frozen target.",
    ],
    pin: [
      "Pin exploited. Material won.",
      "One more attacker tips the scale.",
      "The relative pin becomes absolute loss.",
    ],
  },

  // Section 7: The Skewer
  '2.7': {
    general: [
      "Skewer deployed. Piece collected.",
      "Royal skewer finds its mark.",
      "Move the king, lose the queen.",
      "The reverse pin pierces through.",
      "High value in front? Perfect.",
      "Through and through.",
      "The skewer alignment was too tempting.",
      "King runs, queen dies.",
      "Pierced both targets.",
      "The line attack strikes from behind.",
    ],
    skewer: [
      "Skewered clean through.",
      "The rook sees all the way through.",
      "Queen behind king = queen goodbye.",
      "The pierce attack delivers.",
    ],
  },

  // Section 8: Review - Line Tactics
  '2.8': {
    general: [
      "Pins and skewers: the line attacks.",
      "X-ray tactics review: flawless.",
      "The lines are always there. You find them.",
      "Pin or skewer? Both win.",
      "Line mastery demonstrated.",
      "Review the lines. Win the games.",
      "Geometry doesn't forget. Neither do you.",
      "The diagonal. The file. The rank. All yours.",
      "Line tactics locked in.",
      "Pin, skewer, win. The formula works.",
    ],
  },

  // Section 9: Basic Discoveries
  '2.9': {
    general: [
      "Hidden threat revealed.",
      "The discovery strikes.",
      "Move one piece, attack with another.",
      "The concealed weapon fires.",
      "Discovery unlocked.",
      "Two-piece coordination at its finest.",
      "The reveal was devastating.",
      "Behind the scenes, chaos.",
      "Discovered attack deployed.",
      "The hidden threat emerges.",
    ],
    discoveredAttack: [
      "Discovery executed perfectly.",
      "The piece steps aside, reveals doom.",
      "Hidden attack? Not anymore.",
    ],
  },

  // Section 10: Double Threats
  '2.10': {
    general: [
      "Discovery plus check. Maximum pressure.",
      "Two threats with one move.",
      "The discovered check demands attention.",
      "Discover and capture. Chef's kiss.",
      "The double threat lands.",
      "Check from one, attack from another.",
      "They can't address both.",
      "Discovery math: 1 move = 2 threats.",
      "The coordination is lethal.",
      "Discovered and devastating.",
    ],
    discoveredAttack: [
      "Discovered check plus capture.",
      "The double whammy connects.",
      "Discovery + threat = profit.",
    ],
  },

  // Section 11: Tactical Checkmates
  '2.11': {
    general: [
      "Two moves to checkmate. Found it.",
      "The mating net closes.",
      "Calculate two. Execute two. Win.",
      "Mate in 2: the kill shot.",
      "The forcing sequence ends in checkmate.",
      "Setup, checkmate. Simple.",
      "Two-move calculation: complete.",
      "The kill is visualized and delivered.",
      "Checkmate was always the answer.",
      "The king has nowhere to go.",
    ],
    mateIn2: [
      "Mate in 2 executed.",
      "Two moves, game over.",
      "The checkmate was hiding in plain sight.",
    ],
  },

  // Section 12: Review - Discoveries & Mates
  '2.12': {
    general: [
      "Discoveries, mates, endgames. Covered.",
      "The complete Level 2 toolkit.",
      "Mixed practice, unified excellence.",
      "Review shows: you're ready.",
      "Discoveries and death. Your wheelhouse.",
      "The tactical foundation is solid.",
      "All the weapons. All the time.",
      "Review complete. Skills confirmed.",
      "From discovery to checkmate. Smooth.",
      "The arsenal is loaded.",
    ],
  },

  // Section 13: Level 2 Review
  '2.13': {
    general: [
      "Everything from Level 2. Handled.",
      "Forks, pins, skewers, discoveries. All yours.",
      "The complete assassin's toolkit.",
      "Mixed puzzles? Mixed excellence.",
      "Full spectrum tactical review.",
      "Level 2 mastery on display.",
      "Every weapon deployed successfully.",
      "The fundamentals are unshakeable.",
      "Tactical review: aced.",
      "From basic to brutal. Ready.",
    ],
  },

  // Section 14: Level 2 Final
  '2.14': {
    general: [
      "Level 2 Final: conquered.",
      "The graduation exam? Easy.",
      "Ready for Level 3. Obviously.",
      "Tactical mastery: proven.",
      "The final test reveals: you're legit.",
      "All tactics. All wins.",
      "Level 2: mastered.",
      "Graduate with honors.",
      "The toolkit is complete. Time to upgrade.",
      "From student to tactician. Certified.",
      "Level 2 complete. Level 3 awaits.",
      "The assassin's training is done.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 3: NEVER APOLOGIZE FOR BEING GREAT (1000-1200)
// Tone: Confident setup, trap-setting, rising power, sophisticated destruction
// ═══════════════════════════════════════════════════════════════════════════

export const level3Responses: Record<string, Record<string, string[]>> = {
  // Section 1: Deflection
  '3.1': {
    general: [
      "The defender had a job. Had.",
      "Deflected away from what matters.",
      "Remove the guard, take the prize.",
      "Their defender is now YOUR attacker's friend.",
      "Deflection executed. Defense collapsed.",
      "Forced away. Advantage gained.",
      "The key defender abandons its post.",
      "One deflection, total destruction.",
      "Make them move the piece that matters.",
      "Deflect, infiltrate, dominate.",
    ],
    deflection: [
      "Deflection tactics on point.",
      "The defender had to choose. They chose wrong.",
      "Pulled away from duty. Punished.",
    ],
  },

  // Section 2: Attraction
  '3.2': {
    general: [
      "Lured to the perfect square.",
      "The attraction was irresistible.",
      "Come here, king. I have something for you.",
      "Attracted to doom.",
      "The bait worked perfectly.",
      "Drawn into the trap.",
      "Attraction tactics: devastating.",
      "They came willingly. They left losing.",
      "Lure, trap, win. The cycle continues.",
      "Attracted and attacked.",
    ],
    attraction: [
      "The king came to the party. Didn't leave.",
      "Attracted to the wrong neighborhood.",
      "The lure was too tempting.",
    ],
  },

  // Section 3: Clearance & Interference
  '3.3': {
    general: [
      "Clear the path. Strike the target.",
      "Interference disrupts their coordination.",
      "The line is now blocked. They're now lost.",
      "Clearance sacrifice opens everything.",
      "Their pieces can't communicate.",
      "The path is clear. The attack is deadly.",
      "Interference deployed. Chaos created.",
      "Remove the obstacle. Create the threat.",
      "Block their harmony. Create your melody.",
      "Cleared for destruction.",
    ],
    clearance: [
      "Clearance executed. Highway to checkmate.",
      "Out of the way. Victory incoming.",
    ],
    interference: [
      "Interference complete. Coordination destroyed.",
      "Blocked the defender. Claimed the prize.",
    ],
  },

  // Section 4: Review - Enablers
  '3.4': {
    general: [
      "Deflection, attraction, clearance. The enablers.",
      "Setup tactics mastered.",
      "The tactics that make other tactics work.",
      "Enabler review: flawless execution.",
      "Creating opportunities from nothing.",
      "The setup is the art.",
      "Enabling destruction since forever.",
      "Review complete. Enablers enabled.",
      "The sophisticated tactics land.",
      "Prep work pays off.",
    ],
  },

  // Section 5: The Sacrifice
  '3.5': {
    general: [
      "Give a piece, get a position.",
      "The sacrifice paid off handsomely.",
      "Material is temporary. Checkmate is forever.",
      "Calculated sacrifice executed.",
      "Give to get more.",
      "The investment returns tenfold.",
      "Sacrifice accepted. Advantage seized.",
      "Sometimes you have to give to take.",
      "The bold move wins.",
      "Sacrifice now, celebrate later.",
    ],
    sacrifice: [
      "Sacrificial precision.",
      "Given with purpose. Taken with interest.",
      "The sacrifice creates the win.",
    ],
  },

  // Section 6: Sacrifice for Material
  '3.6': {
    general: [
      "Exchange sacrifice: rook for domination.",
      "Temporary sacrifice, permanent advantage.",
      "Give the rook, get the game.",
      "The calculation justified the sacrifice.",
      "Material down, position up, game won.",
      "Sacrificed and collected.",
      "The exchange was worth it.",
      "Short-term loss, long-term gain.",
      "Give material, get checkmate.",
      "The trade that wasn't equal... in your favor.",
    ],
    sacrifice: [
      "Exchange sacrifice delivered.",
      "Rook for bishop? Plus the win.",
      "Temporary material debt, permanent positional credit.",
    ],
  },

  // Section 7: Advanced Tactics
  '3.7': {
    general: [
      "Advanced fork deployed.",
      "The sophisticated tactics emerge.",
      "Next-level tactical vision.",
      "Advanced patterns, same results.",
      "The tactics evolve. The wins continue.",
      "Deeper calculation, cleaner execution.",
      "Tactical complexity: handled.",
      "Advanced mode: activated.",
      "The patterns get harder. You get better.",
      "Sophisticated destruction delivered.",
    ],
    fork: [
      "Advanced fork executed.",
      "The complex fork lands.",
    ],
    pin: [
      "Advanced pin technique.",
      "Sophisticated line attack.",
    ],
  },

  // Section 8: Review - Sacrifice & Tactics
  '3.8': {
    general: [
      "Sacrifices and tactics reviewed.",
      "The combination toolkit: sharp.",
      "Give and take mastery.",
      "Sacrifice skills remain deadly.",
      "Review mode, same excellence.",
      "Calculated aggression confirmed.",
      "The sacrifice review: all gains.",
      "Tactics plus sacrifice equals devastation.",
      "Bold play review: successful.",
      "The aggressive skills are locked in.",
    ],
  },

  // Section 9: Multi-Move Checkmates
  '3.9': {
    general: [
      "Mate in 2. Calculated perfectly.",
      "The checkmate sequence visualized.",
      "Three moves to glory.",
      "Deep calculation, clean finish.",
      "The mating attack unfolds.",
      "Multiple moves, one destination: checkmate.",
      "Visualize the end, execute the path.",
      "The forcing sequence is beautiful.",
      "Calculate deep, finish clean.",
      "The checkmate was always there.",
    ],
    mateIn2: [
      "Mate in 2 delivered.",
      "Two moves to victory.",
    ],
    mateIn3: [
      "Mate in 3 executed.",
      "Three moves of pure calculation.",
    ],
  },

  // Section 10: Endgame Mastery
  '3.10': {
    general: [
      "Endgame technique on display.",
      "Converting the advantage cleanly.",
      "The grind leads to the win.",
      "Technical precision in the ending.",
      "Endgame knowledge pays dividends.",
      "From middlegame to victory.",
      "The conversion is smooth.",
      "Technique beats hope every time.",
      "Endgame execution: flawless.",
      "The ending was never in doubt.",
    ],
    rookEndgame: [
      "Rook ending mastered.",
      "Activity and technique combine.",
    ],
    pawnEndgame: [
      "King and pawn perfection.",
      "Opposition secured. Promotion incoming.",
    ],
    knightEndgame: [
      "Knight endgame technique.",
      "The knight finds its path.",
    ],
  },

  // Section 11: Combined Tactics
  '3.11': {
    general: [
      "Fork plus pin equals destruction.",
      "Combined tactics devastate.",
      "When one tactic sets up another.",
      "The tactical chain reaction.",
      "Combination chess at its finest.",
      "Multiple tactics, one goal.",
      "The tactics compound.",
      "Stack the threats, stack the wins.",
      "Tactical synergy achieved.",
      "The combination lands perfectly.",
    ],
  },

  // Section 12: Review - Combinations
  '3.12': {
    general: [
      "Combination review: excellent.",
      "Multi-move tactics confirmed.",
      "The chain reaction skills are solid.",
      "Checkmates, endgames, combinations.",
      "The complete tactical picture.",
      "Review shows mastery.",
      "Combinations deployed successfully.",
      "The deep calculation review: passed.",
      "All the pieces fit together.",
      "Tactical depth demonstrated.",
    ],
  },

  // Section 13: Level 3 Review
  '3.13': {
    general: [
      "Level 3 in review: dominant.",
      "Enablers, sacrifices, combinations. Yours.",
      "The full Level 3 toolkit: deployed.",
      "Everything mixed, everything mastered.",
      "Review complete. Ready to advance.",
      "The sophisticated tactics are natural now.",
      "From setup to execution: smooth.",
      "All the skills, all the time.",
      "Level 3 mastery demonstrated.",
      "The foundation is complete.",
    ],
  },

  // Section 14: Level 3 Final
  '3.14': {
    general: [
      "Level 3 Final: crushed.",
      "Never apologize for being great.",
      "The graduation test? Easy work.",
      "Ready for Level 4. No doubt.",
      "Enablers, sacrifices, combinations: mastered.",
      "Level 3: complete domination.",
      "The sophisticated player emerges.",
      "Tactical artist: certified.",
      "Level 3 conquered. Level 4 awaits.",
      "From rising to risen.",
      "Never apologize. Never explain. Just win.",
      "The underdog becomes the favorite.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 4: I AM THE ONE WHO KNOCKS (1200-1400)
// Tone: Dominance, empire building, inevitable destruction, no mercy
// ═══════════════════════════════════════════════════════════════════════════

export const level4Responses: Record<string, Record<string, string[]>> = {
  // Section 1: Sacrifice Patterns
  '4.1': {
    general: [
      "The sacrifice opens everything.",
      "Chemistry is change. So is their position.",
      "Calculated destruction.",
      "The formula works. It always works.",
      "Sacrifice pattern executed perfectly.",
      "Lines opened. Position destroyed.",
      "The classic sacrifice delivers.",
      "Apply the formula, get the result.",
      "Sacrificial precision.",
      "The pattern recognition is elite now.",
    ],
    sacrifice: [
      "Sacrifice for attack: classic.",
      "Give the piece, get the king.",
      "The investment returns checkmate.",
    ],
  },

  // Section 2: Trapped Pieces
  '4.2': {
    general: [
      "Trapped. No escape. No mercy.",
      "The cage closes.",
      "They wandered. They won't wander back.",
      "Trapped piece collected.",
      "No squares left. No hope left.",
      "The net catches its prey.",
      "Trapped and eliminated.",
      "Nowhere to run.",
      "The piece had potential. Had.",
      "Boxed in and taken out.",
    ],
    trappedPiece: [
      "Trapped piece tactics: perfection.",
      "Find the cage, lock it, profit.",
      "The piece died in a cage of its own making.",
    ],
  },

  // Section 3: Exposed King Hunt
  '4.3': {
    general: [
      "That king is in danger. You ARE the danger.",
      "The hunt begins. The hunt ends quickly.",
      "Exposed king = open season.",
      "The king run begins... and ends.",
      "No pawn shield? No chance.",
      "Chase the king. Catch the king.",
      "The exposed king falls.",
      "You knock. They answer. They lose.",
      "King in the open? Time to hunt.",
      "The attack on the king is relentless.",
    ],
    exposedKing: [
      "Exposed king exploited.",
      "The uncastled king regrets everything.",
      "Open king, open coffin.",
    ],
  },

  // Section 4: Review - Attack Training
  '4.4': {
    general: [
      "Attack training complete.",
      "Sacrifices, traps, king hunts. The toolkit.",
      "The offensive skills are locked in.",
      "Review mode: still dangerous.",
      "Attack review: flawless execution.",
      "The aggression is calculated.",
      "From setup to kill: smooth.",
      "Review confirms: you're the danger.",
      "Attack patterns on autopilot.",
      "The formula is internalized.",
    ],
  },

  // Section 5: Mate in 4
  '4.5': {
    general: [
      "Four moves. One destination.",
      "Calculate deep. Execute deeper.",
      "Mate in 4: the long kill.",
      "The forcing sequence is beautiful.",
      "Four moves of pure precision.",
      "Deep calculation delivers.",
      "The checkmate was always there.",
      "Visualize four, execute four, win.",
      "The long combination pays off.",
      "Calculated to the end.",
    ],
    mateIn4: [
      "Mate in 4 executed flawlessly.",
      "Four moves of inevitability.",
      "The deep checkmate lands.",
    ],
  },

  // Section 6: The Quiet Storm
  '4.6': {
    general: [
      "No check. No capture. Total destruction.",
      "The quiet move screams loudest.",
      "The silent killer strikes.",
      "Unstoppable threats created quietly.",
      "The calm before their storm.",
      "Quiet move, loud consequences.",
      "Non-forcing but unstoppable.",
      "The gentle move that ends games.",
      "No drama. Just doom.",
      "Subtle devastation.",
    ],
    quietMove: [
      "Quiet move perfection.",
      "The non-obvious obvious move.",
      "Silence is deadly.",
    ],
  },

  // Section 7: Positional Pressure
  '4.7': {
    general: [
      "Squeeze until they break.",
      "Any move makes it worse.",
      "Positional suffocation.",
      "They wish they could pass. They can't.",
      "The pressure is unbearable.",
      "Zugzwang territory.",
      "Every square is wrong for them.",
      "Positional domination complete.",
      "The squeeze tightens.",
      "Self-destruction forced.",
    ],
    quietMove: [
      "Quiet pressure applied.",
      "The position speaks. It says 'lose.'",
    ],
  },

  // Section 8: Review - Deep Calculation
  '4.8': {
    general: [
      "Deep calculation review: sharp.",
      "Mate in 4, quiet moves, zugzwang.",
      "The precision skills are locked in.",
      "Calculate and dominate.",
      "Review complete. Depth confirmed.",
      "The long combinations work.",
      "Calculation training: successful.",
      "No half measures in calculation.",
      "The deep think delivers.",
      "99.1% pure calculation.",
    ],
  },

  // Section 9: Decisive Tactics
  '4.9': {
    general: [
      "Decisive. Final. Absolute.",
      "End them with authority.",
      "The finishing blow lands.",
      "No slow grind. Maximum impact.",
      "Decisive tactics deployed.",
      "The kill shot connects.",
      "Empire business: crushing opponents.",
      "Decisive and dominant.",
      "The winning blow delivered.",
      "This is how empires are built.",
    ],
    fork: [
      "Decisive fork executed.",
      "The double attack finishes it.",
    ],
    deflection: [
      "Deflection for the win.",
      "Remove defender, claim victory.",
    ],
  },

  // Section 10: Promotion Warfare
  '4.10': {
    general: [
      "The pawn becomes a queen.",
      "Promotion secured.",
      "The race to the eighth rank: won.",
      "Queening time.",
      "The passed pawn delivers.",
      "Promotion tactics on point.",
      "New queen, new problems for them.",
      "The pawn's journey complete.",
      "Promote and dominate.",
      "The eighth rank belongs to you.",
    ],
    promotion: [
      "Promotion tactics executed.",
      "The pawn's ultimate form.",
      "Race to promote: won.",
    ],
  },

  // Section 11: Minor Piece Endgames
  '4.11': {
    general: [
      "Minor piece mastery.",
      "Bishop vs knight: classic battle.",
      "The endgame technique is clean.",
      "Minor pieces, major results.",
      "Endgame conversion smooth.",
      "Technical precision in the ending.",
      "The minor pieces do major work.",
      "Converting with technique.",
      "Endgame theory applied.",
      "The technique is professional.",
    ],
    bishopEndgame: [
      "Bishop endgame mastered.",
      "Diagonal domination.",
    ],
    knightEndgame: [
      "Knight endgame technique.",
      "The knight finds its path.",
    ],
  },

  // Section 12: Review - Conversion
  '4.12': {
    general: [
      "Conversion review: flawless.",
      "Decisive tactics, promotion, endgames.",
      "The conversion skills are solid.",
      "Review shows: winning technique.",
      "Block 3 review: all wins.",
      "Empire building: on track.",
      "Conversion mastery confirmed.",
      "From advantage to victory: smooth.",
      "The techniques combine perfectly.",
      "Building the empire, one win at a time.",
    ],
  },

  // Section 13: Level 4 Review
  '4.13': {
    general: [
      "Level 4 review: dominant.",
      "I am the one who knocks.",
      "Sacrifices, calculation, conversion.",
      "The complete Level 4 toolkit.",
      "Review mode: still dangerous.",
      "You're not in danger. You ARE the danger.",
      "All skills firing.",
      "Level 4 mastery displayed.",
      "The formula is perfected.",
      "Chemistry complete.",
    ],
  },

  // Section 14: Level 4 Final
  '4.14': {
    general: [
      "Level 4 Final: conquered.",
      "Say my name.",
      "The empire is built.",
      "You're goddamn right.",
      "Level 4: total domination.",
      "Ready for the final level.",
      "From danger to dominance.",
      "The one who knocks: certified.",
      "Level 4 complete. Level 5 awaits.",
      "You are the danger. Confirmed.",
      "No half measures. Full mastery.",
      "The empire stands. On to the finale.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 5: NO COUNTRY FOR BEGINNERS (1400-1600)
// Tone: Tournament pressure, inevitable endings, virtuoso technique
// ═══════════════════════════════════════════════════════════════════════════

export const level5Responses: Record<string, Record<string, string[]>> = {
  // Section 1: Mate in 5+
  '5.1': {
    general: [
      "Five moves ahead. All calculated.",
      "The long checkmate visualized.",
      "Deep calculation delivers deep checkmate.",
      "Mate in 5: the long goodbye.",
      "Five moves of pure inevitability.",
      "The extended forcing sequence.",
      "Calculate the whole line. Execute it.",
      "Long range planning, precise execution.",
      "The deep mate lands.",
      "From here to checkmate: calculated.",
    ],
    mateIn5: [
      "Mate in 5 executed.",
      "Five moves of destiny.",
      "The long checkmate arrives.",
    ],
  },

  // Section 2: Double Check
  '5.2': {
    general: [
      "Double check. No blocks. No captures. Just run.",
      "Two pieces give check. Zero options.",
      "The most forcing move in chess.",
      "Double check delivered.",
      "They can only move the king. Perfect.",
      "The devastating double check.",
      "Two attackers, one overwhelmed king.",
      "Double check is double trouble.",
      "The forcing move to end all forcing moves.",
      "When one check isn't enough.",
    ],
    doubleCheck: [
      "Double check executed perfectly.",
      "Two pieces, one devastating check.",
      "The ultimate forcing move.",
    ],
  },

  // Section 3: Windmill of Doom
  '5.3': {
    general: [
      "The windmill spins. Material falls.",
      "Check, take, check, take. Repeat.",
      "Spin cycle: total destruction.",
      "The windmill pattern devastates.",
      "Discovery after discovery after discovery.",
      "They can only watch and lose pieces.",
      "The devastating repeated discovery.",
      "Windmill activated. Game over.",
      "Spin them into submission.",
      "The most beautiful tactical pattern.",
    ],
    discoveredAttack: [
      "Discovery windmill in action.",
      "The spin of doom.",
      "Repeated discovery, repeated collection.",
    ],
    doubleCheck: [
      "Windmill with double check.",
      "The devastating spin.",
    ],
  },

  // Section 4: Review - Multiple Threats
  '5.4': {
    general: [
      "Multiple threat review: excellent.",
      "Long mates, double checks, discoveries.",
      "The forcing move toolkit: complete.",
      "Block 1 review: all threats covered.",
      "When they can't handle one, give two.",
      "Review confirms: you create chaos.",
      "The multiple threat skills are sharp.",
      "From deep mates to devastating checks.",
      "Threat creation mastery.",
      "The coin flip always lands in your favor.",
    ],
  },

  // Section 5: Defensive Resources
  '5.5': {
    general: [
      "The saving move found.",
      "Defense that attacks.",
      "Hold the position. Find the counter.",
      "Defensive resources discovered.",
      "Not dead yet. Not even close.",
      "The hidden defense emerges.",
      "Defense is offense in disguise.",
      "The counter-threat saves the day.",
      "Resourceful defense.",
      "They thought they were winning. They were wrong.",
    ],
    defensiveMove: [
      "Defensive move executed.",
      "The saving resource found.",
      "Defense becomes counterattack.",
    ],
  },

  // Section 6: The Fortress
  '5.6': {
    general: [
      "The fortress holds.",
      "Impenetrable defense achieved.",
      "Down material but drawing.",
      "The fortress cannot be broken.",
      "Build the wall. Hold the wall.",
      "Drawing from a lost position.",
      "The fortress structure saves the game.",
      "Unbreakable defense.",
      "Material means nothing if they can't win.",
      "The fortress stands eternal.",
    ],
    defensiveMove: [
      "Fortress constructed.",
      "The impenetrable position.",
      "Built to survive.",
    ],
  },

  // Section 7: Counterattack
  '5.7': {
    general: [
      "Defend and attack. Simultaneously.",
      "The counterattack changes everything.",
      "Reverse uno deployed.",
      "They attack, you counter harder.",
      "The tables turn.",
      "Defense becomes offense.",
      "The counterpunch lands.",
      "Suddenly they're the ones scrambling.",
      "Counterattack timing: perfect.",
      "From defense to dominance.",
    ],
    defensiveMove: [
      "Counterattack executed.",
      "Defense that strikes back.",
      "The reverse offensive.",
    ],
  },

  // Section 8: Review - Defense & Counter
  '5.8': {
    general: [
      "Defense and counter review: solid.",
      "You can't stop what's coming... from you.",
      "The defensive toolkit: complete.",
      "Hold and strike: mastered.",
      "Review confirms: unbreakable.",
      "Defense, fortress, counter. All yours.",
      "The survival skills are elite.",
      "From worst to winning.",
      "Defensive mastery achieved.",
      "They can't stop what's coming.",
    ],
  },

  // Section 9: Complex Sacrifices
  '5.9': {
    general: [
      "Multi-piece sacrifice pays off.",
      "Give three pieces, win the game.",
      "The complex sacrifice requires trust.",
      "Calculated chaos.",
      "Deep sacrifice, deeper reward.",
      "The investment is massive. So is the return.",
      "Trust the calculation.",
      "Give everything, get checkmate.",
      "The bold sacrifice lands.",
      "When one sacrifice isn't enough.",
    ],
    sacrifice: [
      "Complex sacrifice executed.",
      "Multi-piece investment returns victory.",
      "The ultimate gambit pays off.",
    ],
  },

  // Section 10: Advanced Deflection
  '5.10': {
    general: [
      "The defender is overloaded.",
      "Remove the guard at any cost.",
      "Deflection at the highest level.",
      "Force them to abandon their post.",
      "The overloaded piece can't hold.",
      "Advanced deflection deployed.",
      "One piece, too many jobs.",
      "The defender had to choose. Lost either way.",
      "Deflect and collect.",
      "The removal is surgical.",
    ],
    deflection: [
      "Advanced deflection executed.",
      "The key defender removed.",
      "Overloaded and overwhelmed.",
    ],
  },

  // Section 11: Theoretical Endgames
  '5.11': {
    general: [
      "Theoretical endgame: converted.",
      "The boring part that wins games.",
      "Endgame theory applied perfectly.",
      "Technique beats hope.",
      "The theoretical knowledge pays off.",
      "Expert endgame execution.",
      "From theory to victory.",
      "The endgame mastery is complete.",
      "Technical precision wins.",
      "The grind leads to glory.",
    ],
    rookEndgame: [
      "Rook endgame mastered.",
      "Lucena, Philidor, victory.",
    ],
    pawnEndgame: [
      "Pawn endgame perfection.",
      "Opposition and triangulation.",
    ],
    queenEndgame: [
      "Queen endgame technique.",
      "No stalemate. Only checkmate.",
    ],
  },

  // Section 12: Review - Virtuoso Skills
  '5.12': {
    general: [
      "Virtuoso skills confirmed.",
      "Sacrifices, deflection, endgames.",
      "The complete toolkit review.",
      "Block 3 review: all skills firing.",
      "The advanced techniques work.",
      "From sacrifice to conversion.",
      "Virtuoso mode: activated.",
      "Review shows elite understanding.",
      "The moment of decision: correct.",
      "Call it. Win it.",
    ],
  },

  // Section 13: Level 5 Review
  '5.13': {
    general: [
      "Level 5 review: mastery.",
      "No country for beginners.",
      "Everything combined. Everything working.",
      "The complete Level 5 experience.",
      "Mixed excellence across the board.",
      "Review confirms: tournament ready.",
      "From coin flip to call it.",
      "All systems go.",
      "Level 5 skills: comprehensive.",
      "The end of the line approaches.",
    ],
  },

  // Section 14: Level 5 Final
  '5.14': {
    general: [
      "Level 5 Final: conquered.",
      "No country for beginners. You're no beginner.",
      "The ultimate test: passed.",
      "You know how this ends.",
      "From Level 1 to Level 5: complete.",
      "The end of the line. You made it.",
      "Virtuoso status: achieved.",
      "No more levels. Just opponents to crush.",
      "The journey ends. The dominance continues.",
      "What's the most you ever lost on a coin flip? Nothing.",
      "Call it. You won.",
      "Graduate. Go find someone to destroy.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 6: WHY SO SERIOUS (THE DARK KNIGHT)
// Tone: Gotham's finest, agent of chaos on the board, calculated madness,
//       the hero chess deserves, plans within plans
// ═══════════════════════════════════════════════════════════════════════════

export const level6Responses: Record<string, Record<string, string[]>> = {

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 1: "Why So Serious?" — Subtle, surprising tactics
  // ─────────────────────────────────────────────────────────────────────────

  // Section 1: Quiet Moves
  '6.1': {
    general: [
      "No check. No capture. Just a plan they never saw coming.",
      "Why so serious? Because that quiet move just won the game.",
      "The best moves don't announce themselves.",
      "Gotham's finest move: the one nobody expected.",
      "Not every threat needs to shout.",
      "Silence on the board. Panic in their position.",
      "That move didn't look like much. It was everything.",
      "Some moves wear a mask. This one wore a cape.",
      "The subtle approach. The devastating result.",
      "You want to know how you got these wins? Quiet moves.",
    ],
    quietMove: [
      "The quiet move speaks volumes.",
      "No fireworks. Just an unstoppable threat.",
      "They searched for checks and captures. The answer was neither.",
      "Gotham sleeps. The quiet move strikes.",
      "The calm before their resignation.",
      "Sometimes the scariest move is the quietest one.",
    ],
  },

  // Section 2: The Zwischenzug
  '6.2': {
    general: [
      "An in-between move that changes everything.",
      "They expected a recapture. You had other plans.",
      "The intermezzo strikes when they least expect it.",
      "Gotham loves a plot twist. So does your chess.",
      "Not yet. First, this. Then checkmate.",
      "The unexpected detour that wins the highway.",
      "They blinked. You squeezed in an extra move.",
      "That wasn't in their script.",
      "Patience has a middle name: zwischenzug.",
      "Why recapture when you can win instead?",
    ],
    intermezzo: [
      "Zwischenzug executed. They never saw the intermission.",
      "The in-between move rewrites the story.",
      "One extra move. One extra advantage. One stunned opponent.",
      "Intermezzo timing: immaculate.",
      "They planned for your recapture. You planned for their defeat.",
      "The best detours lead to victory.",
    ],
  },

  // Section 3: X-Ray Vision
  '6.3': {
    general: [
      "You see through their pieces. They see through nothing.",
      "X-ray vision activated. Gotham has a new hero.",
      "The attack passes right through the obstacle.",
      "Transparent defense meets unstoppable offense.",
      "Seeing what others can't. That's the job.",
      "Hidden threats behind every piece.",
      "The discovery reveals what was always there.",
      "Your pieces have eyes everywhere.",
      "Like sonar for the chessboard.",
      "They hid behind their pieces. You saw right through them.",
    ],
    xRayAttack: [
      "X-ray attack pierces through the defense.",
      "The hidden line was always there. You found it.",
      "Through the obstacle, to the prize.",
      "X-ray vision: Gotham's tactical advantage.",
      "They thought that piece was safe. X-ray disagrees.",
      "See through. Strike through. Win through.",
    ],
    discoveredAttack: [
      "One piece steps aside. Another delivers justice.",
      "The discovered attack was hiding in plain sight.",
      "Reveal and conquer. The Gotham way.",
      "The curtain rises. The attack begins.",
      "They focused on the decoy. The real threat walked in.",
      "Behind every piece, another threat lurks.",
    ],
  },

  // Section 4: Review - The Unexpected
  '6.4': {
    general: [
      "Quiet moves, zwischenzugs, x-rays. The unexpected arsenal.",
      "They never see it coming. That's the point.",
      "Review confirms: you play the moves nobody expects.",
      "Block 1 mastery. The subtle game is yours.",
      "When obvious fails, the unexpected thrives.",
      "Gotham's tactical playbook: reviewed and ready.",
      "The element of surprise is your best advantage.",
      "Subtlety wins where brute force can't.",
      "All the hidden threats. All the quiet wins.",
      "The unexpected review: expectedly excellent.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 2: "The Rook Gotham Deserves" — Deep calculation
  // ─────────────────────────────────────────────────────────────────────────

  // Section 5: Deep Sacrifices
  '6.5': {
    general: [
      "It's not about the material. It's about sending a message.",
      "Give up the piece. Keep the initiative. Win the war.",
      "A sacrifice so deep even the engine needs a moment.",
      "Bold sacrifice. Bolder follow-up.",
      "They thought they were winning material. They were losing the game.",
      "Gotham rewards the brave and the calculated.",
      "The deeper the sacrifice, the sweeter the victory.",
      "Material is a suggestion. Checkmate is mandatory.",
      "You don't need all your pieces. Just the right moves.",
      "Sacrificed with purpose. Collected with interest.",
    ],
    sacrifice: [
      "Deep sacrifice executed. The board trembles.",
      "Give a rook, gain a legend.",
      "They accepted the gift. They didn't read the fine print.",
      "Sacrifice depth: unfathomable. Result: inevitable.",
      "The deepest sacrifice reveals the clearest path.",
      "Not reckless. Calculated to the last move.",
    ],
  },

  // Section 6: Complex Combinations
  '6.6': {
    general: [
      "Four moves deep and still calculating.",
      "The combination that took vision, nerve, and precision.",
      "Complex? For them. Clean? For you.",
      "Gotham's longest night has nothing on this calculation.",
      "The deeper you see, the harder they fall.",
      "That wasn't a combination. That was architecture.",
      "Multi-move mastery on full display.",
      "Calculated from the first move to the last gasp.",
      "The whole sequence visualized. The whole game decided.",
      "When the line is long, you follow it to the end.",
    ],
    mateIn4: [
      "Mate in 4. Every move accounted for.",
      "Four moves. Four steps closer to Gotham's finest hour.",
      "The four-move sequence unfolds like a plan.",
      "Calculated four deep. Executed four perfect.",
      "They had four moves to survive. They needed five.",
      "Long checkmate. Short celebration.",
    ],
    mateIn5: [
      "Mate in 5. The long arm of justice reaches.",
      "Five moves of pure, unstoppable calculation.",
      "See five, execute five, win.",
      "The five-move checkmate lands with authority.",
      "Deep calculation, clean finish. Five moves of precision.",
      "From here to checkmate: five moves, zero doubt.",
    ],
  },

  // Section 7: Attraction & Lure
  '6.7': {
    general: [
      "Come into the light. Where the traps are.",
      "Attracted to the wrong square. Gotham sends its regards.",
      "The lure worked. It always works on the unsuspecting.",
      "Drawn in. Locked down. Game over.",
      "They followed the bait right into the trap.",
      "Attraction tactics: irresistible and inescapable.",
      "Lured to the perfect square for the perfect finish.",
      "The invitation was tempting. The result was devastating.",
      "Step right up. Into the trap.",
      "The board is a stage, and you just directed the finale.",
    ],
    attraction: [
      "Attracted to exactly where you needed them.",
      "The king came willingly. Left involuntarily.",
      "Lured into the danger zone. No way back.",
      "Attraction play: textbook Gotham.",
      "They accepted the invitation. The party was a trap.",
      "Drawn forward, punished backward.",
    ],
    clearance: [
      "Clear the square. Unleash the attack.",
      "The path is now open. The king is now finished.",
      "Clearance sacrifice opens the highway to checkmate.",
      "Out of the way. Gotham has business to handle.",
      "The piece moved aside. The threat moved in.",
      "Cleared for takeoff. Destination: victory.",
    ],
  },

  // Section 8: Review - Calculated Justice
  '6.8': {
    general: [
      "Sacrifices, combinations, lures. Calculated justice served.",
      "Block 2 review: deep calculation confirmed.",
      "The hero Gotham's chessboard deserves.",
      "From sacrifice to checkmate: flawless sequence.",
      "Review shows: you calculate deeper than they can defend.",
      "Deep play reviewed. Deep play approved.",
      "Attraction, clearance, long mates. The full arsenal.",
      "Every sacrifice accounted for. Every combination landed.",
      "The calculated approach wins again.",
      "Justice is served. Four moves at a time.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 3: "Some Men Just Want to Watch the Board Burn" — Aggressive play
  // ─────────────────────────────────────────────────────────────────────────

  // Section 9: Kingside Assault
  '6.9': {
    general: [
      "The kingside is crumbling. You brought the pressure.",
      "Full-scale assault on the king's fortress.",
      "Their castled king thought it was safe. It wasn't.",
      "When the pawns storm forward, the king has nowhere to hide.",
      "Gotham shines brightest on the kingside.",
      "The attack is relentless. The defense is crumbling.",
      "Pawn storm deployed. King storm follows.",
      "Some positions just want to watch the kingside crumble.",
      "Every piece aimed at one target. One terrified target.",
      "The kingside collapsed. The king had nowhere to go.",
    ],
    kingsideAttack: [
      "Kingside assault: devastating and complete.",
      "The pawn storm breaks through.",
      "All forces converge on the kingside. All forces win.",
      "The kingside attack is textbook aggression.",
      "Storm the castle. Claim the crown.",
      "Kingside pressure converts to kingside checkmate.",
    ],
    exposedKing: [
      "The king stands exposed. The checkmate arrives.",
      "No pawn shield. No chance.",
      "Exposed king in Gotham? That's game over.",
      "Their king needed a mask. And a fortress.",
      "The exposed king has nowhere to hide.",
      "Open king, open file, open bar on wins.",
    ],
  },

  // Section 10: Breaking the Defense
  '6.10': {
    general: [
      "Their defense had a weakness. You found it.",
      "Interference disrupts. Deflection conquers.",
      "Break the chain and the whole defense collapses.",
      "One link removed. The entire structure falls.",
      "Gotham's defenses are only as strong as their weakest piece.",
      "The defender is compromised. The position follows.",
      "Disrupt, dismantle, dominate.",
      "They built a wall. You built a wrecking ball.",
      "Every defense has a flaw. You are that flaw's worst nightmare.",
      "When the defense breaks, the win floods in.",
    ],
    interference: [
      "Interference complete. Communication severed.",
      "Block the defender. Claim the prize.",
      "The pieces can no longer coordinate. By design.",
      "One piece between them changes everything.",
      "Interference deployed. Harmony dismantled.",
      "Block the lifeline. Win the game.",
    ],
    deflection: [
      "Deflected away from the critical square.",
      "The key defender had two jobs. You gave it a third.",
      "Pulled from duty. Position collapses.",
      "The guard abandoned its post. Checkmate follows.",
      "Deflection: Gotham's favorite disarmament tactic.",
      "Look away from the threat. Too late to look back.",
    ],
  },

  // Section 11: Complex Endgames
  '6.11': {
    general: [
      "The endgame is where legends are made.",
      "Technique smoother than the Batmobile.",
      "Complex ending, clean conversion.",
      "The pieces are few. The precision is everything.",
      "Gotham's finest endgame technique.",
      "When the board clears, the real skill shows.",
      "Endgame mastery: the cape and cowl of chess.",
      "From chaos to conversion. That's the discipline.",
      "Fewer pieces, higher stakes, same excellence.",
      "Technical endgame? Technical victory.",
    ],
    rookEndgame: [
      "Rook endgame navigated like a Gotham alley. Expertly.",
      "The rook cuts off escape. The pawn marches home.",
      "Rook activity wins. You wrote the playbook.",
      "Lucena, Philidor, and now your personal collection.",
      "The rook endgame: where patience meets precision.",
      "Active rook, passive opponent, predictable outcome.",
    ],
    pawnEndgame: [
      "King and pawn versus king and hope. Hope loses.",
      "The opposition is seized. The promotion is secured.",
      "Every tempo counts. You counted them all.",
      "Pawn endgame precision. Every square calculated.",
      "The key squares are yours. The game is yours.",
      "March forward. The eighth rank awaits.",
    ],
    queenEndgame: [
      "Queen technique on display. No stalemate tricks today.",
      "The queen dances to checkmate. Gracefully.",
      "Queen endgame converted without a stalemate scare.",
      "The queen finishes what the middlegame started.",
      "Precise queen play. Gotham approves.",
      "From queen advantage to queen checkmate. Textbook.",
    ],
  },

  // Section 12: Review - Controlled Chaos
  '6.12': {
    general: [
      "Kingside attacks, defensive breaks, complex endings. Controlled chaos.",
      "Block 3 review: aggressive play, disciplined results.",
      "Some positions crumbled. All of them crumbled in your favor.",
      "Chaos on the board, clarity in your mind.",
      "The board erupted. You controlled the chaos.",
      "Review confirms: you bring the chaos, they bring the resignation.",
      "From attack to endgame to victory. The full arc.",
      "Aggressive play with endgame precision. Rare combination.",
      "The chaos was never random. It was calculated.",
      "Controlled chaos mastery: confirmed.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 4: "Checkmate Is the Best Policy, Harvey" — Mastery review
  // ─────────────────────────────────────────────────────────────────────────

  // Section 13: Level 6 Review
  '6.13': {
    general: [
      "Level 6 review: the whole arsenal deployed.",
      "Quiet moves to king hunts. You do it all.",
      "Why so serious? Because Level 6 demands it.",
      "Gotham's complete tactical package: reviewed.",
      "From subtle zwischenzugs to relentless kingside assaults.",
      "All four blocks. All the skills. All the wins.",
      "The review reveals: you earned every section.",
      "Mixed themes? Mixed excellence.",
      "Every tactic from Level 6, ready for action.",
      "The hero the chessboard deserves. Reviewed and confirmed.",
    ],
  },

  // Section 14: Level 6 Final
  '6.14': {
    general: [
      "Level 6 Final: Gotham is yours.",
      "Why so serious? Because you just graduated Level 6.",
      "The night is darkest before the dawn. Dawn arrived.",
      "You either solve the puzzle or you play long enough to become the puzzle.",
      "Level 6: conquered. The board bows.",
      "From quiet moves to controlled chaos: mastered.",
      "Gotham's finest tactician. Certified.",
      "Not the hero they expected. The hero they got.",
      "Level 6 complete. Level 7 awaits in the shadows.",
      "You wanted to prove yourself. Consider it proven.",
      "Some rise by luck, some by instinct. You rose by calculation.",
      "The signal is lit. You answered. Level 6: complete.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 7: THERE IS ALWAYS HOPE... UNLESS IT'S CHECKMATE (THE TWO TOWERS)
// Tone: Rohan's resilience, Helm's Deep stand, Ents awakening, Gollum's duality,
//       the long march, hope against the odds, towers of strength
// ═══════════════════════════════════════════════════════════════════════════

export const level7Responses: Record<string, Record<string, string[]>> = {

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 1: "The Battle of Helm's Deep" — Fortification and defense themes
  // ─────────────────────────────────────────────────────────────────────────

  // Section 1: Back Rank Mastery
  '7.1': {
    general: [
      "The Deeping Wall has been breached. Their back rank never stood a chance.",
      "Fortress sealed. No escape through the back door.",
      "Their back rank held like Helm's Deep at dawn. Not well enough.",
      "The wall behind the king is both shield and prison.",
      "Back rank sealed tighter than the gates of Isengard.",
      "Their own pawns became the walls of their dungeon.",
      "Some fortresses protect. This one trapped.",
      "Nowhere to retreat. The back rank says no.",
      "They built a stronghold. You turned it into a cage.",
      "The final rank: a fortress for some, a tomb for others.",
    ],
    backRankMate: [
      "Back rank sealed. Checkmate delivered like a battering ram.",
      "Their pawns stood guard. Their pawns stood in the way.",
      "The rook charges down the file. The king has no window.",
      "Should have made a luft move. Too late now.",
      "The deep wall of pawns became a deep problem.",
      "Locked behind their own defenses. Classic back rank.",
    ],
  },

  // Section 2: The Promotion Race
  '7.2': {
    general: [
      "The pawn marches to the eighth rank like the Ents march to Isengard.",
      "Slow. Steady. Unstoppable. That pawn is going all the way.",
      "The long march pays off. A new queen rises.",
      "Promotion secured. The board just changed entirely.",
      "Every pawn dreams of the eighth rank. This one made it.",
      "They raced. You arrived first. Crown claimed.",
      "The march forward was patient. The promotion was decisive.",
      "From the smallest piece, the greatest threat emerges.",
      "Push forward. Don't look back. Promote.",
      "The pawn crossed enemy lines and came back royalty.",
    ],
    promotion: [
      "Promoted. The pawn's journey from the Shire to the throne.",
      "New queen on the board. The balance tips immediately.",
      "The little piece that could. And did.",
      "From foot soldier to royalty in one move.",
      "They underestimated the pawn. That was their first mistake.",
      "The promotion parade has arrived.",
    ],
    advancedPawn: [
      "That passed pawn is more relentless than an Ent on the move.",
      "The advanced pawn demands attention. And respect.",
      "One square from promotion. One square from panic.",
      "The pawn is too far gone. Nothing can stop it now.",
      "An advanced pawn is a promise of destruction.",
      "Deep in their territory. The threat is obvious and unstoppable.",
    ],
  },

  // Section 3: Trapped Pieces
  '7.3': {
    general: [
      "Trapped like Gollum in the forbidden pools. Nowhere to swim.",
      "That piece wandered too deep. No way home.",
      "Cornered. Surrounded. Collected.",
      "The net closes. The piece has no squares.",
      "They placed it there boldly. It stays there permanently.",
      "Every retreat cut off. Every escape blocked.",
      "Trapped pieces don't fight back. They just wait.",
      "When a piece runs out of squares, it runs out of time.",
      "Hemmed in on all sides. A tactical Isengard.",
      "That piece was an adventurer. Now it's a prisoner.",
    ],
    trappedPiece: [
      "Trapped piece spotted. Trapped piece collected.",
      "No squares left. No hope left.",
      "The bishop wandered into Fangorn. It didn't come back.",
      "Surrounded with no retreat. The capture is just a formality.",
      "That piece is stuck like Saruman in his tower.",
      "Every exit sealed. Every square covered. Goodbye, piece.",
    ],
  },

  // Section 4: Review - The Unexpected Arsenal
  '7.4': {
    general: [
      "Back ranks, promotions, and trapped pieces. The full arsenal of Helm's Deep.",
      "Block 1 reviewed. Your fortress game is unbreakable.",
      "From trapping pieces to racing pawns: all confirmed.",
      "The unexpected review reveals: you're ready for deeper battles.",
      "Mixed themes, unified excellence. Rohan rides again.",
      "Review complete. The wall holds. The pawns march. The traps spring.",
      "Every tool from Block 1 at your fingertips.",
      "The fortress themes are locked in tight.",
      "Back rank mastery, promotion races, trapped pieces. All yours.",
      "The Deeping Wall of skills: reviewed and reinforced.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 2: "The March of the Ents" — Power and patience themes
  // ─────────────────────────────────────────────────────────────────────────

  // Section 5: Deeper Sacrifices
  '7.5': {
    general: [
      "Treebeard doesn't make hasty decisions. Neither did that sacrifice.",
      "Give up the piece. Gain the position. Win the war.",
      "The sacrifice ran deeper than the roots of Fangorn.",
      "Material is temporary. Initiative is permanent.",
      "They accepted the offering. They didn't read the terms.",
      "Bold sacrifice. Patient follow-up. Inevitable conclusion.",
      "The deeper you sacrifice, the sweeter the reward.",
      "That wasn't a loss. That was an investment with compound interest.",
      "Sacrificed with the patience of an Ent and the precision of an arrow.",
      "They thought they were winning material. They were losing everything.",
    ],
    sacrifice: [
      "Deep sacrifice planted. The position blooms in your favor.",
      "The sacrifice was three moves ahead. They caught on two moves late.",
      "Give a piece, gain a symphony of threats.",
      "Sacrificed cleanly. The compensation is overwhelming.",
      "That sacrifice shook the board like an Ent shakes Isengard.",
      "Not reckless. Calculated to the final check.",
    ],
  },

  // Section 6: Long Combinations
  '7.6': {
    general: [
      "The Ents are going to Isengard. Four moves at a time.",
      "Long calculation. Clean execution. Checkmate.",
      "The combination stretched further than the road to Mordor.",
      "Every move forced. Every response predicted. Every outcome: yours.",
      "See deep. Play deep. Win deep.",
      "That sequence took patience, vision, and nerve.",
      "Long combinations separate the tacticians from the legends.",
      "The whole line visualized before a single piece moved.",
      "From the first sacrifice to the final check: perfection.",
      "They ran out of defensive moves before you ran out of attacking ones.",
    ],
    mateIn4: [
      "Mate in 4. Every branch calculated like an Entmoot debate.",
      "Four moves, four steps to checkmate. All foreseen.",
      "The four-move sequence lands like a falling tree.",
      "Calculated four deep. The finish was never in doubt.",
      "They had four chances to survive. None of them worked.",
      "Four precise moves. One devastating outcome.",
    ],
    mateIn5: [
      "Mate in 5. The long march ends in checkmate.",
      "Five moves deep and the board bends to your will.",
      "The five-move combination: patient, powerful, perfect.",
      "See five, execute five. The Ents would be proud.",
      "Five moves of relentless pressure. Then silence.",
      "From here to checkmate: five moves of pure calculation.",
    ],
  },

  // Section 7: Defensive Resources
  '7.7': {
    general: [
      "The best defense is a Helm's Deep defense.",
      "Hold the line. The counterattack is coming.",
      "Sometimes the strongest move is the one that says 'not today.'",
      "Defense isn't weakness. It's delayed strength.",
      "The position looked lost. The resource said otherwise.",
      "They thought they were winning. You found the save.",
      "Defensive brilliance. The tide turns.",
      "Survive first. Punish second.",
      "The fortress holds. The counterplay begins.",
      "When the position screams danger, cool heads find resources.",
    ],
    defensiveMove: [
      "Defensive resource found. The position stabilizes.",
      "The only move. And you found it.",
      "That defensive shot turned the entire game around.",
      "Hold the wall. The Riders of Rohan are coming.",
      "The saving move was hiding in plain sight.",
      "From lost to level. One defensive resource changes everything.",
    ],
  },

  // Section 8: Review - Calculated March
  '7.8': {
    general: [
      "Sacrifices, combinations, defensive saves. The march continues.",
      "Block 2 review: the patience of Ents, the power of calculation.",
      "From deep sacrifices to long combinations to clutch defense.",
      "The calculated march through Block 2: complete.",
      "Review confirms: your calculation runs deep as Fangorn's roots.",
      "Every sacrifice, every combination, every save: accounted for.",
      "The Ents marched. You calculated. Both unstoppable.",
      "Deep play reviewed. Deep play confirmed.",
      "Sacrifices that bloom, combinations that land, defenses that hold.",
      "The march was long. The review was flawless.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 3: "The Two Towers of Tactics" — Classic themes elevated
  // ─────────────────────────────────────────────────────────────────────────

  // Section 9: Pin Mastery
  '7.9': {
    general: [
      "Pinned like Wormtongue to his lies. Not going anywhere.",
      "The pin holds. The pressure builds. The piece falls.",
      "Absolute pin deployed. Absolutely winning.",
      "Frozen in place by geometry and patience.",
      "The line attack finds its mark once again.",
      "Pinned to the king. Pinned to their fate.",
      "They can see the danger. They just can't escape it.",
      "The invisible thread holds the piece hostage.",
      "Pin mastery means seeing lines others miss.",
      "That piece is going nowhere. Except off the board.",
    ],
    pin: [
      "Pin applied. The piece crumbles under the pressure.",
      "The bishop sees right through to the king. The knight pays the price.",
      "Absolute pin. Absolute advantage.",
      "Pinned and piled on. The classic combination.",
      "The pin is the thread. The win is the tapestry.",
      "Stuck in place like Saruman in Orthanc. Not by choice.",
    ],
  },

  // Section 10: Skewer & Fork Mastery
  '7.10': {
    general: [
      "Two targets, one move. The algebra of winning.",
      "Skewered or forked? Either way, they lose a piece.",
      "The dual threat strikes again.",
      "Line up the targets. Collect the spoils.",
      "Their pieces stood on the wrong squares. Your pieces noticed.",
      "Fork the royals. Skewer the valuables. Win the game.",
      "Double attacks are the bread and butter of tactical chess.",
      "The horse rides to Rohan. And takes everything.",
      "Two threats with one move. The efficiency is beautiful.",
      "When pieces align, profits follow.",
    ],
    skewer: [
      "Skewered clean through, like a lance at Helm's Deep.",
      "The king steps aside. The queen stays behind. Forever.",
      "Through and through. Thanks for the material.",
      "The reverse pin delivers again.",
      "Big piece in front, small piece behind. The skewer writes itself.",
      "Pierced both targets. Only one survived.",
    ],
    fork: [
      "Forked like a crossroads in Rohan. Both paths lead to loss.",
      "The knight lands and two pieces tremble.",
      "Double attack deployed. Pick which piece to save.",
      "The fork is elegant. The result is brutal.",
      "Two targets, zero solutions for the defender.",
      "Fork executed. Material advantage: secured.",
    ],
  },

  // Section 11: Endgame Mastery
  '7.11': {
    general: [
      "The endgame is where kings become warriors.",
      "Fewer pieces. Higher stakes. Same precision.",
      "Technique sharper than the blade of Rohan.",
      "The long game rewards the patient tactician.",
      "When the dust settles, technique decides everything.",
      "Endgame mastery: the crown jewel of chess skill.",
      "Convert the advantage. Close the game. Claim the win.",
      "The board is open. The king steps forward. Victory follows.",
      "From middlegame chaos to endgame clarity.",
      "The final phase. The decisive phase. Your phase.",
    ],
    endgame: [
      "Endgame technique on full display. Textbook conversion.",
      "The position simplified. Your advantage didn't.",
      "Clean endgame. Clean win. No complications survived.",
      "Technical precision from the first trade to the final check.",
      "The endgame road is narrow. You walked it perfectly.",
      "Converted with the patience of Treebeard counting the seasons.",
    ],
  },

  // Section 12: Review - The Full Stew
  '7.12': {
    general: [
      "Pins, skewers, forks, endgames. The full stew, Precious.",
      "Block 3 review: every classic tactic elevated.",
      "The Two Towers of tactics: line attacks and double threats.",
      "All the classic themes. All at a higher level.",
      "Review confirms: your tactical foundation is a fortress.",
      "Pins that paralyze. Forks that plunder. Endgames that convert.",
      "From pin mastery to endgame precision: the full package.",
      "Every tactic sharpened. Every theme covered.",
      "The stew is ready. Every ingredient accounted for.",
      "Block 3 mastery: the classic tactics bow to your command.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 4: "The Horn of Helm Hammerhand" — Full mastery
  // ─────────────────────────────────────────────────────────────────────────

  // Section 13: Level 7 Review
  '7.13': {
    general: [
      "Level 7 review: from back rank traps to endgame conversions.",
      "Every theme, every tactic, every block. Reviewed and confirmed.",
      "The full Level 7 arsenal: deployed and devastating.",
      "Mixed puzzles from all four blocks. All four handled.",
      "There is always hope. Unless you're on the other side of this board.",
      "From Helm's Deep to the march of the Ents: all skills accounted for.",
      "The review reveals: you've earned every section of Level 7.",
      "Back ranks, promotions, sacrifices, pins. The complete warrior.",
      "All themes mixed. All themes mastered.",
      "The horn sounds. Level 7 skills answer the call.",
    ],
  },

  // Section 14: Level 7 Final
  '7.14': {
    general: [
      "Level 7 Final: the towers have fallen. You still stand.",
      "There is always hope. And you just proved it.",
      "The Two Towers crumbled. Your skills are the ones still standing.",
      "From back rank prisons to five-move combinations: mastered.",
      "Level 7: conquered with the resilience of Rohan.",
      "The horn of Helm Hammerhand sounds for the last time. You've graduated.",
      "Through sacrifice, defense, and precision: Level 7 complete.",
      "Not all who wander through puzzles are lost. Some of them are you.",
      "Level 7 complete. The path ahead grows steeper. You're ready.",
      "Helm's Deep held. So did you.",
      "The march is done. The Ents would nod in slow approval.",
      "Level 7: where hope meets calculation, and calculation wins.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 8: TARANTINO VIBES
// General Tarantino energy: swagger, sharp dialogue, cool under pressure,
// pop culture wit, non-linear thinking, soundtrack vibes
// ═══════════════════════════════════════════════════════════════════════════

export const level8Responses: Record<string, Record<string, string[]>> = {

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 1: "En Passant, Do You Speak It?" — Subtle, positional, cool
  // ─────────────────────────────────────────────────────────────────────────

  // Section 1: Zugzwang
  '8.1': {
    general: [
      "That's what I thought you'd play. Just didn't think you'd play it that COOL.",
      "You just served them a Royale with Checkmate.",
      "That wasn't a move. That was a monologue.",
      "Smooth. Real smooth. Jukebox-in-a-diner smooth.",
      "You didn't rush. You let the scene play out. Perfection.",
      "Style points? Off the charts. Effectiveness? Also off the charts.",
      "That move had its own soundtrack.",
      "Cool, calm, and absolutely devastating.",
      "They didn't see it. You didn't blink. Beautiful.",
      "Like ordering something off-menu and getting exactly what you wanted.",
    ],
    zugzwang: [
      "Every move they make is wrong. And they HAVE to move. That's the cruelty of it.",
      "You put them in the chair, and the chair has no good options.",
      "They're stuck. Not because they can't move — because they CAN'T NOT move.",
      "Zugzwang: the one word in chess that means 'you're already done.'",
      "Pass? There is no pass. There's only worse.",
      "The board is a locked room and every door leads somewhere bad for them.",
    ],
    defensiveMove: [
      "The save nobody expected. Including your opponent.",
      "Defense isn't boring when it's this smooth.",
      "Defensive resources: found. Crisis: averted.",
      "They thought they had you. They thought wrong.",
      "One move. The ONLY move. And you found it.",
      "Cool under pressure. The board was on fire and you walked through it.",
    ],
  },

  // Section 2: Quiet Moves
  '8.2': {
    general: [
      "The quiet move. The one nobody heard coming.",
      "No check. No capture. Just pure, quiet menace.",
      "That's the move that doesn't announce itself. It just arrives.",
      "Understated. Lethal. Like a bass line you don't notice until it owns you.",
      "Quiet moves speak louder than checks.",
      "The most dangerous thing in the room is the one that isn't making noise.",
      "You whispered. The board screamed.",
      "Not every great move needs an exclamation mark. Some just need a period.",
      "That move walked in, sat down, and ordered a drink like it owned the place.",
      "Low-key brilliance. The best kind.",
    ],
    quietMove: [
      "No check, no capture, no warning. Just a quiet move that changes everything.",
      "The calm before their storm of panic.",
      "Quiet like a conversation you overhear that changes the whole plot.",
      "They were waiting for fireworks. You gave them a slow burn.",
      "The gentlest move on the board. The most dangerous one too.",
      "Sometimes the best line has no dialogue at all.",
    ],
  },

  // Section 3: Intermezzo
  '8.3': {
    general: [
      "Non-linear. Unpredictable. Exactly right.",
      "You just rearranged the sequence and they never recovered.",
      "That wasn't the expected move. That was the BETTER move.",
      "Plot twist. Their recapture can wait — you had business to handle first.",
      "Out of order, but in perfect control.",
      "They expected Scene 2. You jumped to Scene 5. Brilliant.",
      "The timeline just got reshuffled. In your favor.",
      "Linear is predictable. You're not predictable.",
      "They had a plan. Your intermezzo had a better one.",
      "You cut to a different scene. And it was the scene that mattered most.",
    ],
    intermezzo: [
      "In-between move. In-between genius.",
      "The intermezzo: chess's version of 'wait, before that...'",
      "They thought you'd recapture. You had a detour in mind.",
      "One move out of sequence. One whole position out of their control.",
      "The intermediate move that rewrites the whole script.",
      "Pause the expected. Insert the brilliant. Resume winning.",
    ],
  },

  // Section 4: Review - Palate Cleanser
  '8.4': {
    general: [
      "Zugzwang, quiet moves, intermezzos. The refined palate on full display.",
      "Block 1 review: cool under pressure, sharp in execution.",
      "The Royale with Cheese block: sophisticated, precise, confident.",
      "You didn't just solve these. You solved them with STYLE.",
      "Quiet moves that roar. Intermezzos that redirect. Zugzwangs that squeeze.",
      "The subtle arts of chess, handled with zero subtlety in quality.",
      "Review passed. Your positional taste is impeccable.",
      "From trapped positions to plot twists: the whole menu, devoured.",
      "Refined. Calculated. Cool. Block 1: complete.",
      "That's a wrap on the appetizer course. Main course incoming.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 2: "Does He Look Like a Bishop?" — Deep calculation, interrogation
  // ─────────────────────────────────────────────────────────────────────────

  // Section 5: Sacrifices
  '8.5': {
    general: [
      "You put something on the table. They took it. Now they owe you everything.",
      "That sacrifice wasn't reckless. That sacrifice was an INVESTMENT.",
      "Give a piece, get a position. The exchange rate is in your favor.",
      "Cool under pressure. Giving up material while the room watches.",
      "The sacrifice said 'trust me.' The follow-up said 'told you.'",
      "Material is temporary. Initiative is forever.",
      "You didn't lose a piece. You deployed a piece.",
      "That wasn't generosity. That was a setup.",
      "The briefcase glows for a reason. What's inside is worth more than what you gave up.",
      "You traded a piece for the whole position. Good deal.",
    ],
    sacrifice: [
      "Sacrifice landed. The compensation is rolling in.",
      "They accepted the gift. They shouldn't have accepted the gift.",
      "You offered the piece like a handshake. What came next wasn't friendly.",
      "Material down, winning chances up. The math checks out.",
      "The sacrifice had a plan, a backup plan, and a getaway car.",
      "Gave up the piece with a smile. Got back the game with a grin.",
    ],
  },

  // Section 6: Long Mates
  '8.6': {
    general: [
      "You saw the whole movie before the first scene played.",
      "Five moves deep. Five moves perfect.",
      "That wasn't calculation. That was choreography.",
      "You didn't just find the move. You KNEW the move.",
      "Long combination, short result: checkmate.",
      "The long game. The patient game. YOUR game.",
      "They thought they had time. You'd already written the ending.",
      "That sequence played out like a scene you'd rehearsed a hundred times.",
      "Move by move. Beat by beat. Check by checkmate.",
      "Seeing five moves ahead is talent. Executing all five is mastery.",
    ],
    mateIn5: [
      "Mate in five. The whole sequence, visualized and executed.",
      "Five moves from now, it's over. And you knew from move one.",
      "The five-move combination: scripted, directed, and wrapped.",
      "Long-range checkmate. Every move essential. No filler.",
      "From opening move to final check: five acts of pure precision.",
      "Five moves. One outcome. Zero doubt.",
    ],
  },

  // Section 7: X-Ray & Interference
  '8.7': {
    general: [
      "You see through pieces like they're not even there.",
      "Lines, diagonals, the geometry of winning.",
      "That piece was in the way. Correction: that piece WAS the way.",
      "You see the board differently. That's why you're winning.",
      "Through the clutter, through the noise, straight to the target.",
      "The line was always there. You just had to clear it.",
      "X-ray vision isn't a superpower on the chessboard. It's a requirement.",
      "Interference played. Communication cut. Position won.",
      "You interrupted their coordination like a record scratch.",
      "The diagonal tells stories. You just read the whole chapter.",
    ],
    xRayAttack: [
      "X-ray: seeing the threat through the piece that thought it was safe.",
      "The piece in front doesn't matter. The line behind it does.",
      "Through and through. The x-ray reveals all.",
      "Looking past the obvious to the devastating.",
      "The attack went through the bodyguard straight to the principal.",
      "X-ray deployed. Hidden threats exposed.",
    ],
    interference: [
      "You stepped right between their pieces and cut the conversation.",
      "Interference: the move that says 'you two don't talk anymore.'",
      "Communication severed. Their pieces are islands now.",
      "One piece in the right square disconnects their entire defense.",
      "The interference piece didn't need to survive. It needed to interrupt.",
      "Block the line. Break the coordination. Win the game.",
    ],
  },

  // Section 8: Review - Full Technique
  '8.8': {
    general: [
      "Sacrifices, long mates, x-rays, interference. The full technique.",
      "Block 2 review: precision from start to checkmate.",
      "The Five Point Checkmate Technique: studied and certified.",
      "Give up material, see deep, cut lines. That's the toolkit right there.",
      "From calculated sacrifices to surgical interference. All clean.",
      "Deep calculation confirmed. Your technique has zero plot holes.",
      "Every sacrifice landed. Every combination connected. Every line cleared.",
      "Block 2 was the test of depth. You passed with room to spare.",
      "The technique block: where cool meets calculated.",
      "Review complete. Your depth of play would make any director proud.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 3: "That IS a Tasty Fork" — Winning material, tactical satisfaction
  // ─────────────────────────────────────────────────────────────────────────

  // Section 9: Deflection & Attraction
  '8.9': {
    general: [
      "You pulled them where you wanted them. They didn't even argue.",
      "Misdirection is an art. You just painted a masterpiece.",
      "Their defender had a job. You gave it a different one.",
      "Push here, pull there. The whole position rearranged to your liking.",
      "You're not just moving pieces. You're directing traffic.",
      "The defender left its post. That's what you were counting on.",
      "Attraction and deflection: the push and pull of tactical genius.",
      "You lured them in. Then you closed the door.",
      "Like pulling strings. Except the strings are rooks and bishops.",
      "They went where you pointed. Right into the trap.",
    ],
    deflection: [
      "Deflected. That defender had somewhere more important to NOT be.",
      "Pull the guard from the gate and the fortress falls.",
      "The defender was loyal. Until you gave it a reason to move.",
      "One piece deflected, one position collapsed.",
      "Deflection: making their best piece their worst problem.",
      "They can't guard everything. You just proved it.",
    ],
    attraction: [
      "Attracted to the wrong square. Everything falls apart from there.",
      "Come closer. Closer. Perfect. Checkmate.",
      "Lured into position like a character walking into the wrong room.",
      "Attraction: the art of making them stand exactly where you want.",
      "The king walked forward. The king shouldn't have walked forward.",
      "Drawn in, set up, finished off. The whole sequence was scripted.",
    ],
  },

  // Section 10: Endgames (Rook + Pawn)
  '8.10': {
    general: [
      "The final act. Where everything that happened before pays off.",
      "Fewer pieces, higher stakes. This is where it all matters.",
      "Endgame technique sharper than the dialogue in a diner scene.",
      "The board is almost empty. Your advantage isn't.",
      "Convert. Close. Collect. That's the endgame motto.",
      "From opening chaos to endgame clarity. The long arc of a well-played game.",
      "The last act is always the most important. You nailed it.",
      "Simple position, precise technique. That's how it's done.",
      "They survived the middlegame. They won't survive this.",
      "When the smoke clears, technique decides who's standing.",
    ],
    rookEndgame: [
      "Rook endgame converted. Lucena, Philidor, whatever it took.",
      "The rook endgame: where precision separates contenders from pretenders.",
      "Active rook, right technique, clean conversion.",
      "Rook behind the passed pawn. Textbook. Effective. Done.",
      "The rook did what rooks do in endgames: everything.",
      "Rook endgame mastery. The most common endgame, handled uncommonly well.",
    ],
    pawnEndgame: [
      "King and pawns. The purest form of chess. And you played it perfectly.",
      "Pawn endgame: where every tempo matters and you didn't waste one.",
      "The opposition was key. You held it like a briefcase full of checkmate.",
      "Pawn structure won. King activity won. You won.",
      "Every pawn move was permanent. Every one was correct.",
      "The pawn endgame is a conversation of tempi. You had the last word.",
    ],
  },

  // Section 11: Kingside & Queenside Attacks
  '8.11': {
    general: [
      "Both flanks. Both lethal. Pick a side — they're both losing.",
      "The Mexican standoff of chess: tension on every side of the board.",
      "Left side, right side, doesn't matter. You brought the pressure.",
      "The attack came from where they weren't looking. Classic.",
      "Flank attack executed with diner-booth cool.",
      "When you attack both sides, they can only defend one.",
      "The board is a stage. The attack played on both wings.",
      "Tension on the kingside. Tension on the queenside. Tension everywhere.",
      "They reinforced one flank. You broke through the other. Predictable.",
      "Full-board pressure. The kind that doesn't let up.",
    ],
    kingsideAttack: [
      "Kingside assault: direct, aggressive, and very much on purpose.",
      "The king's neighborhood just got a lot less safe.",
      "Pawns forward, pieces aimed, king exposed. Your kind of position.",
      "The kingside attack hit like a soundtrack change from smooth to intense.",
      "Storming the kingside with purpose and precision.",
      "The h-file opened. The king wished it hadn't.",
    ],
    queensideAttack: [
      "Queenside pressure: the slow squeeze that wins games.",
      "While they watched the kingside, the queenside fell apart.",
      "Queenside breakthrough. The minority attack pays dividends.",
      "The a and b pawns marched. The queenside crumbled.",
      "Positional pressure on the queenside. The kind they can't ignore.",
      "Queenside attack: patient, methodical, and ultimately decisive.",
    ],
  },

  // Section 12: Review - The Full Lineup
  '8.12': {
    general: [
      "Deflections, endgames, flank attacks. The full lineup, assembled.",
      "Block 3 review: tension on every square, technique on every move.",
      "Stuck in the middle with you — and you played your way out beautifully.",
      "Push, pull, convert, attack. The middle block was your showcase.",
      "Every piece mattered. Every move counted. Block 3: wrapped.",
      "From misdirection to endgame conversion to full-board attacks.",
      "The lineup reviewed. Every member accounted for.",
      "Block 3 demanded everything. You gave it and then some.",
      "Tension, technique, and tactical fireworks. All present.",
      "Review complete. Your middlegame-to-endgame transition is seamless.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOCK 4: "The Path of the Righteous Pawn" — The final journey
  // ─────────────────────────────────────────────────────────────────────────

  // Section 13: Level 8 Review
  '8.13': {
    general: [
      "Level 8 review: every theme, every scene, every move accounted for.",
      "From zugzwang to flank attacks. The whole script, revisited.",
      "Say checkmate again. SAY. CHECKMATE. AGAIN.",
      "The ensemble cast of tactics: all present, all performing.",
      "Quiet moves, loud sacrifices, everything in between. Reviewed.",
      "The full Tarantino: non-linear, stylish, and impossible to look away from.",
      "Mixed puzzles from all four blocks. All four handled with swagger.",
      "Every chapter revisited. Every chapter passed.",
      "From the Royale with Cheese to the Final Chapter. All skills confirmed.",
      "The review reel plays. Nothing but highlights.",
    ],
  },

  // Section 14: Level 8 Final
  '8.14': {
    general: [
      "That's a bingo. Checkmate's a bingo.",
      "Level 8: wrapped. Credits rolling. Standing ovation.",
      "You didn't just finish Level 8. You DIRECTED Level 8.",
      "The final chapter closes. And what a chapter it was.",
      "From quiet moves to long mates to full-board attacks: mastered.",
      "Say checkmate one more time. Actually, don't. They've heard enough.",
      "Level 8 complete. Tarantino would nod. Slowly. With respect.",
      "The whole level was a long take. And you didn't blink once.",
      "Cool under pressure from move one to the final checkmate.",
      "You came in with swagger. You're leaving with mastery.",
      "Level 8 done. The briefcase is yours. Don't ask what's inside.",
      "Roll credits. You're the one still standing.",
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

// Level 1 block responses (original structure)
const level1BlockResponses: Record<string, Record<string, SectionResponses>> = {
  'block-1': block1Responses,
  'block-2': block2Responses,
  'block-3': block3Responses,
  'block-4': block4Responses,
};

// All level responses indexed by level number
const allLevelResponses: Record<string, Record<string, Record<string, string[]>>> = {
  '1': {}, // Will use level1BlockResponses
  '2': level2Responses,
  '3': level3Responses,
  '4': level4Responses,
  '5': level5Responses,
  '6': level6Responses,
  '7': level7Responses,
  '8': level8Responses,
};

/**
 * Get a section-specific response for the v2 curriculum
 * @param sectionId - The section ID (e.g., '1.1', '2.5', '3.12') using dot notation
 * @param themes - Array of puzzle themes to match against
 * @returns A themed response or general section response
 */
export function getV2Response(sectionId: string, themes?: string[]): string {
  const parts = sectionId.split('.');
  const levelNum = parts[0] || '1';
  const sectionNum = parts.length >= 2 ? parseInt(parts[1], 10) : 1;

  let sectionResponses: SectionResponses | undefined;

  // Level 1 uses the block-based structure
  if (levelNum === '1') {
    let blockId: string;
    if (sectionNum <= 4) blockId = 'block-1';
    else if (sectionNum <= 8) blockId = 'block-2';
    else if (sectionNum <= 12) blockId = 'block-3';
    else blockId = 'block-4';

    const blockResponses = level1BlockResponses[blockId];
    if (blockResponses) {
      sectionResponses = blockResponses[sectionId];
    }
  } else {
    // Levels 2-8 use flat structure by section ID
    const levelResponses = allLevelResponses[levelNum];
    if (levelResponses) {
      sectionResponses = levelResponses[sectionId] as SectionResponses | undefined;
    }
  }

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
 * Lesson ID format: {level}.{section}.{lesson} (e.g., '1.5.3')
 * Returns section ID in dot notation: {level}.{section} (e.g., '1.5')
 */
export function getSectionFromLessonId(lessonId: string): string {
  const parts = lessonId.split('.');
  if (parts.length < 2) return '1.1';
  return `${parts[0]}.${parts[1]}`;
}
