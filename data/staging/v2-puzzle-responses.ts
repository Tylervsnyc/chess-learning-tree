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
    // Levels 2-5 use flat structure by section ID
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
