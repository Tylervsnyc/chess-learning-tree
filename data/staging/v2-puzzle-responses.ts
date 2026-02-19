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

import { ShuffleBag } from '@/lib/shuffle-bag';

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK 1: END THE GAME
// Tone: Savage finishes, try not to gloat, good game energy
// ═══════════════════════════════════════════════════════════════════════════

export const block1Responses = {
  // Section 1: Mate in One - The Basics
  '1.1': {
    first: [
      "First puzzle down. Poker face: activated.",
      "And we're off. Clean start.",
      "Opening move: nailed it.",
      "That's how you set the tone. GG to the warm-up.",
    ],
    last: [
      "Final checkmate. Close the curtain.",
      "That's a wrap on section one. Take a bow.",
      "Last one down. Try not to gloat on the way out.",
    ],
    recovery: [
      "Missed it, then mashed it. Respect.",
      "Second attempt, first-class finish.",
      "The comeback checkmate. Even sweeter.",
      "Stumble, recover, deliver. That's the script.",
    ],
    'streak:3': [
      "Three in a row. The checkmate machine warms up.",
      "Hat trick of mates. Keep the streak alive.",
      "Three straight. They should be worried.",
    ],
    'streak:5': [
      "Five checkmates running. Absolutely clinical.",
      "Five in a row. Save some GGs for later.",
      "On a tear. Nobody's safe.",
      "Five straight. That's not luck, that's pattern recognition.",
    ],
    general: [
      "Say good game. Try not to smirk.",
      "That's checkmate. Act surprised.",
      "Try not to smile too big. They're watching.",
      "GG. Keep a straight face.",
      "Checkmate. Now look humble.",
      "That was fast. Pretend you had to think about it.",
      "The king falls. Look sympathetic.",
      "Game over. Don't dance. Yet.",
      "Checkmate delivered. Poker face: ON.",
    ],
    mateIn1: [
      "Blink and it's checkmate.",
      "They never saw it coming. You did.",
      "Speed run: complete.",
      "The fastest goodbye in chess.",
      "In and out. Clean finish.",
    ],
    'moves:1': [
      "One move to end a friendship.",
      "One move. One win. One awkward handshake.",
      "One move. One win. That's all it took.",
      "Single move, total impact.",
    ],
    smotheredMate: [
      "Trapped by their own pieces. Poetic.",
      "The knight whispered 'shhh' and it was over.",
      "Smothered. By a horse. Embarrassing.",
      "Their own army betrayed them.",
      "No room to breathe. No room to escape.",
      "The ultimate betrayal: boxed in by friends.",
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
    first: [
      "Pattern recognized on the first try. Nice opener.",
      "First puzzle, first pattern, first win.",
      "The warm-up pattern falls. Here we go.",
    ],
    last: [
      "Last pattern locked in. Textbook finish.",
      "Section complete. The classics are yours now.",
      "Final pattern executed. Close the playbook.",
      "That's every pattern in the chapter. Done.",
    ],
    recovery: [
      "Missed the pattern, then found it. Growth.",
      "Second look, better result. That's learning.",
      "The pattern hid. You found it anyway.",
    ],
    'streak:3': [
      "Three patterns in a row. The library's growing.",
      "Pattern, pattern, pattern. You're collecting these.",
      "Triple pattern recognition. The brain's firing.",
      "Three for three. The patterns can't hide.",
    ],
    'streak:5': [
      "Five patterns running. Walking encyclopedia.",
      "Five in a row. The pattern vault is stacked.",
      "Unstoppable pattern machine. Five straight.",
    ],
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
      "Two bishops, one checkmate.",
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
    first: [
      "Advanced section, instant results. Off to a hot start.",
      "First advanced pattern spotted. The eye is sharp.",
      "Big brain activated on puzzle one.",
    ],
    last: [
      "Last advanced pattern crushed. Section complete.",
      "That's the advanced chapter, done. Mic dropped.",
      "Final puzzle. The advanced section bows to you.",
      "Closed out the hard stuff. Respect.",
    ],
    recovery: [
      "Advanced patterns are tricky. You adjusted.",
      "It hid deeper this time. You dug deeper.",
      "Missed it, recalculated, delivered.",
    ],
    'streak:3': [
      "Three advanced patterns running. Leveling up.",
      "Triple advanced streak. The brain's cooking.",
      "Three in a row on the hard ones. Impressive.",
    ],
    'streak:5': [
      "Five advanced patterns straight. That's elite.",
      "Five for five on the advanced stuff. Show-off.",
      "Unstoppable on the hard patterns. Five running.",
      "Five streak on advanced mates. Just flexing now.",
    ],
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
      "Reveal and conquer.",
      "One steps aside. One attacks. Confusion ensues.",
      "The ambush worked perfectly.",
    ],
    mateIn3: [
      "Saw it all. Did it all.",
      "The long con. The short victory.",
      "Calculated. Precise. Brutal.",
      "The checkmate hid behind layers. You found it.",
    ],
    'moves:3': [
      "Three moves of pure calculation.",
      "Three steps to their downfall.",
      "Three deep. Three perfect.",
    ],
  },

  // Section 4: Multi-Move Checkmates
  '1.4': {
    first: [
      "Multi-move section opens with a clean solve.",
      "First sequence nailed. The vision is there.",
      "Calculated from the start. Great opener.",
      "That's how you open the multi-move chapter.",
    ],
    last: [
      "Final multi-move checkmate. Block 1 conquered.",
      "Last sequence executed. What a closer.",
      "The curtain falls on multi-move mates. Standing ovation.",
    ],
    recovery: [
      "The sequence tripped you up. Then you owned it.",
      "Recalculated and re-delivered. Multi-move resilience.",
      "Missed a step, found the path. That's depth.",
      "Second attempt, full sequence. Redemption arc complete.",
    ],
    'streak:3': [
      "Three multi-move solves running. Deep thinker.",
      "Calculated three in a row. The depth is real.",
      "Triple multi-move streak. Big brain energy.",
    ],
    'streak:5': [
      "Five multi-move mates in a row. Calculator mode.",
      "Five deep sequences straight. Can't be touched.",
      "Five for five on multi-movers. Absolute machine.",
    ],
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
      "Setup, strike. Done.",
      "The one-two punch lands.",
      "First the trap. Then the finish.",
      "They had one response. Both led here.",
      "Short but decisive.",
    ],
    'moves:2': [
      "Two moves. Two perfect moves.",
      "Two-move checkmate. Clean and final.",
      "Saw it two deep. Executed two deep.",
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
    first: [
      "First piece pocketed. The heist begins.",
      "Opening score of the section. Clean grab.",
      "And the collection starts. First freebie claimed.",
    ],
    last: [
      "Last piece swiped. The vault is full.",
      "Final collection. Walk away clean.",
      "That's every freebie in the section. Pockets heavy.",
      "Section swept. Nothing left unclaimed.",
    ],
    recovery: [
      "Almost walked past the loot. Grabbed it on the way back.",
      "Missed the freebie, then snagged it. Still counts.",
      "Second grab successful. No piece left behind.",
    ],
    'streak:3': [
      "Three freebies in a row. The shelves are empty.",
      "Triple grab. They can't leave anything out.",
      "Three pieces collected. Running a tab now.",
    ],
    'streak:5': [
      "Five straight grabs. Professional looter status.",
      "Five for five. This is organized collection.",
      "Five in a row. They should bolt things down.",
      "Five freebies running. The warehouse is cleared.",
    ],
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
    first: [
      "First fork landed. Two targets, zero survivors.",
      "Opening fork. The horsey means business.",
      "First puzzle, first double threat. Here we go.",
      "The fork section opens with a bang.",
    ],
    last: [
      "Final fork of the section. Drop the mic.",
      "Last double attack. The fork master graduates.",
      "Section forked and finished. Walk away rich.",
    ],
    recovery: [
      "Missed the fork, then found it. The knight forgives.",
      "The horse gave you a second chance. You took it.",
      "Fork attempt two: success. Redemption delivered.",
    ],
    'streak:3': [
      "Three forks running. L-shaped larceny spree.",
      "Fork, fork, fork. They can't stop the horse.",
      "Triple fork streak. Pockets overflowing.",
    ],
    'streak:5': [
      "Five forks in a row. The knight's on a rampage.",
      "Five straight forks. Professional fork artist.",
      "Five double attacks running. Nobody's safe.",
      "Fork factory output: five for five.",
    ],
    general: [
      "The fork master strikes.",
      "They can't guard what they can't predict.",
      "Fork around and find out.",
      "Two targets. One move. Zero solutions.",
      "Double attack deployed. Pick your loss.",
      "Hop in, hop out, pockets full.",
      "Fork delivered. Both targets trembling.",
      "Two pieces, one threat, their problem.",
    ],
    fork: [
      "Two targets. Pick which one to lose.",
      "Fork delivered. Payment received.",
      "Double attack, double trouble.",
      "Forked and they can't get up.",
      "Two pieces threatened. One piece saved. One piece gone.",
      "The double attack lands clean.",
    ],
    'fork:N': [
      "L-shaped larceny at its finest.",
      "Horsey chose chaos. And profit.",
      "Two victims. One horse. No survivors.",
      "The tricky pony profits again.",
      "One knight, two problems, zero solutions.",
      "The horse sees what others miss.",
    ],
    'piece:N': [
      "The knight is a menace. Your menace.",
      "The horse doesn't care about your plans.",
      "Knights jump over problems. Into profit.",
      "The L stands for Loot.",
      "Bounce, bounce, bank.",
      "Knights don't ask. They take.",
    ],
  },

  // Section 7: Pins
  '1.7': {
    first: [
      "First pin applied. They're not going anywhere.",
      "Pinned on puzzle one. Setting the tone.",
      "The pin section starts with a freeze. Theirs.",
    ],
    last: [
      "Final pin in the collection. Section locked down.",
      "Last pin deployed. Everything's frozen except your progress.",
      "That's a wrap on pins. They never moved.",
      "Section pinned shut. Moving on.",
    ],
    recovery: [
      "Missed the pin, then stuck it. Better late than never.",
      "The geometry clicked on the second try.",
      "Took another look and found the line. Pinned.",
    ],
    'streak:3': [
      "Three pins running. Everything's stuck.",
      "Triple pin streak. The board's a parking lot.",
      "Three in a row. They can't move anywhere.",
    ],
    'streak:5': [
      "Five pins straight. Professional freezer.",
      "Five for five on pins. The board is a museum. Nothing moves.",
      "Five pin streak. You see every line.",
      "Five in a row. The geometry of greed, perfected.",
    ],
    general: [
      "Pinned and soon to be collected.",
      "Frozen piece. Easy pickings.",
      "Can't move. Won't survive.",
      "Stuck between a rock and your taking it.",
      "The invisible leash tightens.",
      "Paralyzed. Profitable.",
      "Move? Can't. Stay? Lose.",
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
    first: [
      "First skewer lands. Through and through.",
      "Opening kebab of the section. Delicious.",
      "Skewer section starts with a clean pierce.",
    ],
    last: [
      "Last skewer served. Section complete.",
      "Final piece threaded. Block 2 conquered.",
      "That's the skewer section, done. Take your spoils.",
    ],
    recovery: [
      "Missed the line, found the pierce. Second time's the charm.",
      "The skewer hid. You found it on the retry.",
      "Almost missed the kebab. Grabbed it anyway.",
      "Took two tries to thread the needle. Still counts.",
    ],
    'streak:3': [
      "Three skewers running. Everything's on a stick.",
      "Triple thread. They keep lining up for you.",
      "Three in a row. The kebab shop is open.",
    ],
    'streak:5': [
      "Five skewers straight. All-you-can-pierce buffet.",
      "Five for five. Professional skewer artist.",
      "Five in a row. They should stop lining up.",
    ],
    general: [
      "Run and leave your friend behind.",
      "Big piece moves, little piece falls.",
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
    first: [
      "First rook endgame converted. The grind begins.",
      "Rook endgames start now. First one handled.",
      "Opening endgame solved. Cold efficiency from the start.",
    ],
    last: [
      "Final rook endgame ground out. Section conquered.",
      "That's the rook endgame chapter closed. Technique proven.",
      "Last endgame in the section. Crushing complete.",
      "Rook endgame mastery: confirmed. Section done.",
    ],
    recovery: [
      "The endgame tripped you up. Then you ground it out.",
      "Rook endgames are tricky. Second attempt was textbook.",
      "Missed the technique, found the resilience.",
    ],
    'streak:3': [
      "Three rook endgames running. The grind is real.",
      "Triple endgame conversion. Relentless technique.",
      "Three in a row. The rook never rests.",
    ],
    'streak:5': [
      "Five endgames straight. Crushing their hope, one rook at a time.",
      "Five in a row. Endgame machine mode.",
      "Five rook endgames running. Spirit fully broken.",
      "Five straight conversions. Cold, efficient, devastating.",
    ],
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
    first: [
      "First pawn endgame solved. The march begins.",
      "Pawn endgames start strong. Push forward.",
      "Opening pawn endgame converted. Every tempo counted.",
    ],
    last: [
      "Last pawn endgame marched home. Section promoted.",
      "Final push complete. The pawns bow to nobody.",
      "Section done. Every pawn reached its destiny.",
    ],
    recovery: [
      "The opposition slipped. Then you seized it back.",
      "Miscounted tempi, then recalculated. Promoted anyway.",
      "Pawn endgames punish mistakes. You punished yours and moved on.",
      "Second try, clean promotion. That's the spirit.",
    ],
    'streak:3': [
      "Three pawn endgames running. The march is relentless.",
      "Triple conversion. Pawns grinding forward.",
      "Three in a row. Every pawn dreams of this.",
    ],
    'streak:5': [
      "Five pawn endgames straight. Promotion parade.",
      "Five in a row. The pawns can't be stopped.",
      "Five consecutive conversions. The eighth rank belongs to you.",
    ],
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
    first: [
      "Advanced tactics kick off with a solve. Sharp eye.",
      "First sneaky tactic found. The subtle stuff works.",
      "Opening the advanced chapter with style.",
    ],
    last: [
      "Last advanced tactic crushed. Section spirit: broken.",
      "Advanced tactics section wrapped. They never saw any of it.",
      "Final subtle blow landed. Section complete.",
      "That's every trick in the advanced chapter. All yours.",
    ],
    recovery: [
      "The trick hid. You found it on the second pass.",
      "Advanced tactics are sneaky. So is your resilience.",
      "Missed the subtlety, caught the point.",
    ],
    'streak:3': [
      "Three advanced tactics running. The sneaky stuff stacks.",
      "Triple streak on the hard ones. Impressive depth.",
      "Three in a row. The hidden stuff can't hide from you.",
    ],
    'streak:5': [
      "Five advanced tactics straight. Absolutely ruthless.",
      "Five in a row on the tricky section. That's dominance.",
      "Five consecutive advanced solves. They had no chance.",
    ],
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
      "Defender distracted. Defenses dismantled.",
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
    first: [
      "Mixed endgame section opens clean. Technique ready.",
      "First mixed endgame converted. Versatility on display.",
      "Endgame mix begins with a win. Set the tone.",
    ],
    last: [
      "Final endgame ground out. Block 3 crushed.",
      "That's the endgame mix, done. Spirit: fully broken.",
      "Last mixed endgame handled. Clinical from start to finish.",
    ],
    recovery: [
      "Mixed endgames throw curveballs. You adjusted.",
      "Different endgame, different technique, same resilience.",
      "Stumbled on the mix, then found the right tool.",
      "The recovery grind is real. Technique prevailed.",
    ],
    'streak:3': [
      "Three mixed endgames running. Versatile technique.",
      "Triple conversion across different endings. Adaptable.",
      "Three in a row. Every endgame type handled.",
    ],
    'streak:5': [
      "Five mixed endgames straight. Grinding machine.",
      "Five in a row across all endgame types. Complete player.",
      "Five consecutive mixed conversions. Their spirit is powder.",
    ],
    general: [
      "Endgame technique wins another one.",
      "Convert, convert, convert.",
      "From advantage to victory. Clinical.",
      "The long game pays off.",
      "Grinding complete. Spirit broken.",
      "Technique over tricks. Always.",
      "You're not just ahead. You're winning.",
      "The conversion is textbook.",
      "Slow squeeze. Fast surrender.",
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
    first: [
      "Review starts strong. Still got the touch.",
      "First review puzzle down. Muscle memory intact.",
      "Opening the review with a flex. Classic.",
      "Checkmate review begins. The patterns remember you.",
    ],
    last: [
      "Checkmate review complete. Mastery reaffirmed.",
      "Last review puzzle handled. Still sharp.",
      "Final checkmate reviewed. Nothing forgotten.",
    ],
    recovery: [
      "Rusty on that one, but the second attempt was clean.",
      "Review means dusting off the cobwebs. Done.",
      "A little shaky, then solid. That's what review is for.",
    ],
    'streak:3': [
      "Three review puzzles running. It all came back.",
      "Triple streak on review. The patterns are permanent.",
      "Three in a row. The checkmates never left.",
    ],
    'streak:5': [
      "Five review puzzles straight. Like they never left.",
      "Five in a row on review. Permanent knowledge.",
      "Five consecutive reviews aced. The fundamentals are bulletproof.",
      "Five straight. Review mode, but still flexing.",
    ],
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
    first: [
      "Material review opens with a clean grab. Still thieving.",
      "First review piece taken. The instincts are sharp.",
      "Review starts and the material flows in. Natural.",
    ],
    last: [
      "Last material review puzzle done. Still sharp, still stealing.",
      "Material review wrapped. Everything accounted for.",
      "Final review grab. The tactics don't fade.",
      "Section complete. The loot is confirmed.",
    ],
    recovery: [
      "Missed the tactic, grabbed it on the retry. Review working.",
      "That one needed a second look. Review is doing its job.",
      "Shook off the rust and snatched the piece.",
    ],
    'streak:3': [
      "Three material grabs running. Review mode is still deadly.",
      "Triple streak on review. The eyes never stopped looking.",
      "Three in a row. Proven fundamentals.",
    ],
    'streak:5': [
      "Five material wins straight. Review formality at this point.",
      "Five in a row. Tactical recall: flawless.",
      "Five consecutive review solves. The skills are permanent.",
    ],
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
    'piece:N': [
      "The knight does knight things. Profitably.",
      "Horsey hopping into trouble. Their trouble.",
      "The L-shape finds another victim.",
    ],
    'piece:Q': [
      "The queen does it all. Attack, defend, collect.",
      "When the queen moves, pieces fall.",
      "Royal power on full display.",
    ],
    'piece:R': [
      "The rook owns the open file. And the game.",
      "Heavy piece, heavy impact.",
      "The rook slides in. Material slides out.",
    ],
    'piece:B': [
      "The bishop's diagonal vision pays off.",
      "Long-range sniper on the diagonal.",
      "The bishop sees what others can't.",
      "I got 99 problems but a bishop ain't one.",
    ],
  },

  // Section 15: Review Endgames
  '1.15': {
    first: [
      "Endgame review starts clean. The technique remembers.",
      "First endgame review solved. Still grinding.",
      "Opening the endgame review with a conversion.",
    ],
    last: [
      "Endgame review locked. Technique: still there.",
      "Last review endgame handled. Proven and polished.",
      "Final endgame reviewed. Section sealed.",
    ],
    recovery: [
      "The endgame technique needed a second gear. Found it.",
      "Missed the conversion, then ground it out. Classic review.",
      "Second attempt endgame. Still counts as technique.",
      "The review shook something loose. Back on track.",
    ],
    'streak:3': [
      "Three endgame reviews running. Technique on autopilot.",
      "Triple endgame streak. The conversion skills are locked.",
      "Three in a row. Review confirmed: you know endgames.",
    ],
    'streak:5': [
      "Five endgame reviews straight. Machine-level technique.",
      "Five consecutive endgame conversions on review. Bulletproof.",
      "Five in a row. The endgame skills are forever.",
    ],
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
    first: [
      "Final exam starts strong. First puzzle owned.",
      "The Level 1 finale opens with a statement.",
      "First final puzzle solved. Set the pace.",
    ],
    last: [
      "Last puzzle of Level 1. The cap and gown fit perfectly.",
      "Level 1 Final: done. Graduate with honors.",
      "That's the final puzzle. Level 1 is yours.",
      "The finish line crossed. Level 1: complete.",
    ],
    recovery: [
      "Final exams allow retakes. You recovered.",
      "Stumbled in the final, bounced right back.",
      "The final pushed back. You pushed harder.",
    ],
    'streak:3': [
      "Three running in the final. Cruising to graduation.",
      "Triple streak in the final. Making it look easy.",
      "Three in a row on the big exam. Confidence.",
      "Final exam streak: three and counting.",
    ],
    'streak:5': [
      "Five straight in the final. Valedictorian material.",
      "Five in a row on the Level 1 final. Flawless.",
      "Five consecutive solves in the finale. Untouchable.",
    ],
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
    first: [
      "First fork of Level 2. The toolkit opens sharp.",
      "Fork basics begin. First target acquired.",
      "Opening double attack landed. Here we go.",
    ],
    last: [
      "Final fork basics puzzle. Two targets, one closer.",
      "Fork basics complete. The weapon is loaded.",
      "Last double attack of the section. Clean exit.",
      "Section wrapped. The fork is yours now.",
    ],
    recovery: [
      "Missed the fork, found it on the second scan.",
      "The targets were hiding. Second attempt exposed them.",
      "Fork recovery: still two targets, still one win.",
    ],
    'streak:3': [
      "Three forks running. The dual threat is automatic.",
      "Triple fork streak. Precision forking.",
      "Three double attacks in a row. Locked in.",
    ],
    'streak:5': [
      "Five forks straight. The assassin's bread and butter.",
      "Five in a row. Fork detection is second nature.",
      "Five consecutive double attacks. Professional precision.",
      "Five for five. The toolkit's sharpest tool.",
    ],
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
      "Two pieces enter. One leaves.",
      "Forked and forgotten.",
      "Double attack, double profit.",
    ],
    'fork:N': [
      "The knight says hello to everyone. And takes from everyone.",
      "L-shaped chaos finds two targets at once.",
      "The horse hops in, the material hops out.",
    ],
  },

  // Section 2: Fork Patterns
  '2.2': {
    first: [
      "First fork pattern recognized. The eye is trained.",
      "Pattern section opens with a hit. Geometry loaded.",
      "Opening fork pattern found and executed.",
    ],
    last: [
      "Last fork pattern solved. The angles are locked in.",
      "Fork pattern section complete. Every angle covered.",
      "Final pattern down. The geometry is permanent now.",
    ],
    recovery: [
      "The pattern was subtle. Second look found it.",
      "Fork geometry tripped you up. Then it clicked.",
      "Missed the setup, nailed the retry.",
      "Pattern recognition recalibrated. Fork found.",
    ],
    'streak:3': [
      "Three fork patterns running. Geometry on autopilot.",
      "Triple pattern streak. The angles reveal themselves.",
      "Three in a row. Fork pattern library growing.",
    ],
    'streak:5': [
      "Five fork patterns straight. The squares light up for you.",
      "Five consecutive pattern matches. Professional.",
      "Five in a row. Fork geometry mastered.",
    ],
    general: [
      "Pattern recognized. Pattern executed.",
      "The royal fork lands.",
      "You've seen this setup a hundred times. Works every time.",
      "Fork geometry: mastered.",
      "The angles don't lie.",
      "Classic fork pattern. Classic win.",
      "Setup complete. Fork deployed.",
      "The squares aligned. The pieces fell.",
      "Pattern hunting: successful.",
      "The double attack pattern emerges again.",
    ],
    fork: [
      "Royal fork spotted. Royals collected.",
      "The family fork. Devastating.",
      "Two targets in the crosshairs.",
    ],
    'fork:N': [
      "The knight's geometry is unforgiving.",
      "L-shape finds two victims. Every time.",
      "The pony hops to the perfect square.",
    ],
    'fork:Q': [
      "The queen forks with authority. Two targets, one move.",
      "Queen attack hits two pieces at once. Royal privilege.",
      "The queen's range finds both targets. Effortless.",
    ],
    'fork:B': [
      "Diagonal fork. The bishop sees both targets.",
      "The bishop's long diagonal catches two pieces.",
      "Bishop fork deployed. Both targets on the same diagonal.",
    ],
  },

  // Section 3: Forks & More
  '2.3': {
    first: [
      "Forks and more begins. First mixed tactic solved.",
      "Opening the combo section with a clean hit.",
      "First puzzle down. The tactical web starts here.",
    ],
    last: [
      "Last mixed tactic of the section. Clean sweep.",
      "Forks and more: done. The combination game is strong.",
      "Final puzzle handled. Mixed tactics conquered.",
    ],
    recovery: [
      "Mixed tactics are tricky. Second attempt cracked it.",
      "The combo hid. You uncovered it on the retry.",
      "Forks plus extras needed an extra look. Solved.",
    ],
    'streak:3': [
      "Three mixed solves running. Versatile and sharp.",
      "Triple streak. Forks and their friends fall alike.",
      "Three in a row on mixed tactics. Adaptable.",
      "Fork plus bonus streak: three and counting.",
    ],
    'streak:5': [
      "Five mixed tactics straight. Complete tactical vision.",
      "Five in a row. Forks, hanging pieces, all of it.",
      "Five consecutive solves. The mixed section can't slow you down.",
    ],
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
    first: [
      "Review opens clean. Double attack instincts intact.",
      "First review puzzle solved. The forks remember you.",
      "Double attack review starts with a win.",
    ],
    last: [
      "Double attack review: wrapped. All fundamentals confirmed.",
      "Last review puzzle done. Fork skills: permanent.",
      "Final double attack reviewed. Moving on.",
    ],
    recovery: [
      "The review shook out some rust. Cleaned it up.",
      "Second attempt on review. That's literally what review is for.",
      "Fork review needed a retry. Now it's locked.",
      "Recalibrated and solved. Review doing its job.",
    ],
    'streak:3': [
      "Three review solves running. Fundamentals are solid.",
      "Triple review streak. Double attacks are muscle memory.",
      "Three in a row on review. No rust here.",
    ],
    'streak:5': [
      "Five review puzzles straight. The skills didn't fade.",
      "Five in a row. Double attack review is a formality.",
      "Five consecutive review wins. Permanent toolkit.",
    ],
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
    first: [
      "Absolute pins begin. First piece frozen solid.",
      "Opening pin deployed. The line is clear.",
      "First absolute pin of the section. X-ray activated.",
      "Pin section starts with a clean lock.",
    ],
    last: [
      "Final absolute pin applied. Section frozen shut.",
      "Last pin in the chapter. Nothing moves anymore.",
      "Absolute pin section complete. Precision confirmed.",
    ],
    recovery: [
      "The pin line wasn't obvious. Found it on the second pass.",
      "Missed the absolute pin, then locked it down.",
      "The geometry needed another look. Pin applied.",
    ],
    'streak:3': [
      "Three absolute pins running. The x-ray is on.",
      "Triple pin streak. Everything's frozen.",
      "Three in a row. Line attacks at will.",
    ],
    'streak:5': [
      "Five absolute pins straight. X-ray vision confirmed.",
      "Five in a row. They can't move anything near their king.",
      "Five consecutive pins. The geometry is automatic.",
      "Five for five on absolute pins. Lethal precision.",
    ],
    general: [
      "Pinned to the king. Nowhere to go.",
      "The absolute pin locks them down.",
      "Frozen in place. Easy target.",
      "X-ray vision activated.",
      "The line attack strikes.",
      "Absolute pin deployed. Absolutely winning.",
      "They're stuck. You're not.",
      "The pin holds. The material falls.",
      "Pinned piece, free piece.",
      "The geometry of winning on display.",
    ],
    pin: [
      "Pin applied. Pressure sustained.",
      "The geometry of the pin prevails.",
      "Pinned and paralyzed. Collected soon.",
      "The line is lethal. The piece is stuck.",
    ],
    'pin:B': [
      "The bishop sees right through them.",
      "Diagonal pin locks them down tight.",
      "The bishop's x-ray finds the king behind.",
    ],
    'pin:R': [
      "Rook pin. Royalty behind. GG.",
      "The rook's file is a prison for that piece.",
      "Pinned along the rank. The rook demands tribute.",
    ],
  },

  // Section 6: Exploiting Pins
  '2.6': {
    first: [
      "First pin exploited. Piled on and profited.",
      "Exploiting pins starts now. First target overwhelmed.",
      "Opening exploitation: clean and profitable.",
    ],
    last: [
      "Last pin exploited. Section crushed.",
      "Pin exploitation complete. Every frozen piece collected.",
      "Final pinned piece piled on. Section done.",
    ],
    recovery: [
      "Piling on needed a second try. The pressure worked.",
      "Missed the exploitation angle. Found it on the retry.",
      "The pin was there, the pile-on took a moment. Got it.",
    ],
    'streak:3': [
      "Three pin exploits running. Maximum pressure applied.",
      "Triple pile-on streak. The pinned pieces don't stand a chance.",
      "Three in a row. Exploitation is an art form.",
    ],
    'streak:5': [
      "Five pin exploits straight. Relentless pressure.",
      "Five in a row. Every pin gets punished.",
      "Five consecutive exploits. Professional pile-on artist.",
      "Five for five. The pinned pieces never survive.",
    ],
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
    first: [
      "First skewer pierces through. Section on.",
      "Skewer section opens with a clean thread.",
      "Opening pierce deployed. Two targets, one line.",
    ],
    last: [
      "Final skewer served. Section threaded shut.",
      "Last pierce of the chapter. Clean through.",
      "Skewer section complete. Every line accounted for.",
      "Section done. The reverse pins are yours.",
    ],
    recovery: [
      "The skewer hid behind the pieces. Found it second try.",
      "Missed the line, found the pierce. Recovery skewer.",
      "Took another look through the position. Skewer found.",
    ],
    'streak:3': [
      "Three skewers running. Threading everything.",
      "Triple skewer streak. They keep lining up.",
      "Three in a row. The reverse pin is automatic.",
    ],
    'streak:5': [
      "Five skewers straight. Everything's on a line.",
      "Five in a row. Professional piercing.",
      "Five consecutive skewers. Lethal line vision.",
    ],
    general: [
      "Skewer deployed. Piece collected.",
      "Royal skewer finds its mark.",
      "The reverse pin pierces through.",
      "High value in front? Perfect.",
      "Through and through.",
      "The skewer alignment was too tempting.",
      "Pierced both targets.",
      "The line attack strikes from behind.",
      "Step aside and leave your friend behind.",
      "The skewer special: move or lose.",
    ],
    skewer: [
      "Skewered clean through.",
      "The pierce attack delivers.",
      "Big piece in front, prize behind. Classic skewer.",
      "One line, two pieces, one loss for them.",
    ],
    'skewer:R': [
      "The rook sees all the way through.",
      "Rook skewer pierces two targets on the file.",
      "The rook's reach catches them both.",
    ],
    'skewer:B': [
      "The bishop's diagonal skewers both targets.",
      "Diagonal piercing. Two pieces, one line.",
      "The bishop sees front and back. Both suffer.",
    ],
  },

  // Section 8: Review - Line Tactics
  '2.8': {
    first: [
      "Line tactics review opens clean. Geometry intact.",
      "First review puzzle solved. Pins and skewers remember.",
      "Review starts with a line attack. Locked in.",
    ],
    last: [
      "Line tactics review complete. Every line accounted for.",
      "Final review puzzle done. Geometry confirmed.",
      "Last line tactic reviewed. The toolkit is sharp.",
    ],
    recovery: [
      "The line hid during review. Found it on retry.",
      "Review caught a gap. Now it's fixed.",
      "Geometry needed a refresh. Done.",
    ],
    'streak:3': [
      "Three line reviews running. Automatic geometry.",
      "Triple review streak. Lines, diagonals, all clear.",
      "Three in a row. The review is a formality.",
      "Three straight on line review. Sharp.",
    ],
    'streak:5': [
      "Five line reviews straight. Permanent knowledge.",
      "Five in a row. Pin and skewer skills: bulletproof.",
      "Five consecutive review wins. The geometry never fades.",
    ],
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
    first: [
      "First discovery revealed. The concealed weapon works.",
      "Discovery section starts with a reveal. Hidden no more.",
      "Opening discovery deployed. Behind the curtain: chaos.",
    ],
    last: [
      "Final discovery of the section. All weapons revealed.",
      "Last hidden attack uncovered. Section complete.",
      "Discovery section done. Nothing stays hidden from you.",
    ],
    recovery: [
      "The discovery was deeper than expected. Found it second try.",
      "Hidden attacks need patience. Second attempt delivered.",
      "Missed the reveal, then pulled back the curtain.",
    ],
    'streak:3': [
      "Three discoveries running. Concealed weapon spree.",
      "Triple reveal streak. Behind every piece, a threat.",
      "Three in a row. Discovery vision sharpening.",
    ],
    'streak:5': [
      "Five discoveries straight. Nothing hides from you.",
      "Five in a row. Discovery detection is instinct now.",
      "Five consecutive reveals. The curtain never closes.",
      "Five for five. Every hidden threat exposed.",
    ],
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
    first: [
      "Double threat section opens. First combo landed.",
      "First discovery-plus deployed. Maximum pressure.",
      "Opening with check and attack. Setting the tone.",
    ],
    last: [
      "Final double threat executed. Section handled.",
      "Last combo of the chapter. Two threats, one exit.",
      "Double threat section wrapped. Precision confirmed.",
    ],
    recovery: [
      "The double threat hid. Second attempt found both parts.",
      "Missed the combo, then connected. Recovery hit.",
      "Two threats on the retry. Still counts double.",
      "The discovery plus check needed a second look. Delivered.",
    ],
    'streak:3': [
      "Three double threats running. They can't address any of them.",
      "Triple combo streak. Checks and captures flowing.",
      "Three in a row. Double threat detection: online.",
    ],
    'streak:5': [
      "Five double threats straight. Overwhelming force.",
      "Five in a row. The two-threat game is elite.",
      "Five consecutive combos. Professional devastation.",
    ],
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
    first: [
      "Tactical checkmates begin. First mating net closed.",
      "Opening the chapter with a forced finish.",
      "First tactical mate found. The net was tight.",
    ],
    last: [
      "Final tactical checkmate. Section complete.",
      "Last forced mate of the chapter. Clean close.",
      "Tactical checkmate section: done. Lethal precision confirmed.",
    ],
    recovery: [
      "The forcing sequence wasn't obvious. Found it on retry.",
      "Missed the mate, recalculated, delivered.",
      "The checkmate hid deeper this time. Second attempt found it.",
    ],
    'streak:3': [
      "Three tactical mates running. The nets keep closing.",
      "Triple checkmate streak. Forcing sequences on point.",
      "Three in a row. The mating patterns just flow.",
    ],
    'streak:5': [
      "Five tactical mates straight. Every net closes.",
      "Five in a row. Checkmate detection is automatic.",
      "Five consecutive forced mates. The finishing weapon is sharp.",
    ],
    general: [
      "The mating net closes.",
      "The forcing sequence ends in checkmate.",
      "Setup, checkmate. Simple.",
      "Checkmate was always the answer.",
      "The checkmate was visualized and delivered.",
      "The mating pattern emerges. Game over.",
      "Checkmate hiding in plain sight. You found it.",
      "The final blow lands. Clean finish.",
    ],
    mateIn2: [
      "Mate in 2 executed.",
      "Two moves, game over.",
      "The checkmate was hiding in plain sight.",
    ],
    'moves:2': [
      "Two moves to checkmate. Found it.",
      "Calculate two. Execute two. Win.",
      "Two-move calculation: complete.",
    ],
  },

  // Section 12: Review - Discoveries & Mates
  '2.12': {
    first: [
      "Review opens strong. Discoveries and mates intact.",
      "First review puzzle nailed. The weapons are sharp.",
      "Mixed review starts with a solve. Toolkit confirmed.",
    ],
    last: [
      "Discovery and mate review complete. Arsenal ready.",
      "Final review puzzle handled. All systems go.",
      "Last mixed review done. The toolkit is polished.",
      "Review wrapped. Discoveries and mates: permanent.",
    ],
    recovery: [
      "Review found the gap. Second attempt closed it.",
      "The discovery hid during review. Retry exposed it.",
      "Mixed review needed a second look. Now it's clean.",
    ],
    'streak:3': [
      "Three review puzzles running. The combo skills hold.",
      "Triple review streak. Discoveries and mates flowing.",
      "Three in a row on review. Comprehensive skills.",
    ],
    'streak:5': [
      "Five review puzzles straight. Every weapon accounted for.",
      "Five in a row. The review is just a victory lap.",
      "Five consecutive review wins. Complete arsenal confirmed.",
    ],
    general: [
      "Discoveries, mates, endgames. Covered.",
      "The complete Level 2 toolkit.",
      "Mixed practice, unified excellence.",
      "Review shows: you're ready.",
      "Discoveries and checkmates. Your wheelhouse.",
      "The tactical foundation is solid.",
      "All the weapons. All the time.",
      "Review complete. Skills confirmed.",
      "From discovery to checkmate. Smooth.",
      "The arsenal is loaded.",
    ],
  },

  // Section 13: Level 2 Review
  '2.13': {
    first: [
      "Level 2 review starts. First puzzle shows the skills held.",
      "Full review begins clean. All weapons ready.",
      "Opening the Level 2 review with a win. Standard.",
    ],
    last: [
      "Level 2 review complete. Every weapon in the kit confirmed.",
      "Last review puzzle done. Ready for the final.",
      "Full review wrapped. Nothing left unchecked.",
    ],
    recovery: [
      "Full review caught something. Second try cleaned it up.",
      "The mixed review needed a retry. That's what it's for.",
      "One hiccup in the full review. Resolved.",
    ],
    'streak:3': [
      "Three review puzzles running across all tactics. Sharp.",
      "Triple streak on the full review. Comprehensive excellence.",
      "Three in a row. Every tactic from Level 2: confirmed.",
    ],
    'streak:5': [
      "Five review puzzles straight. Level 2 is locked in.",
      "Five in a row on the full review. Every skill accounted for.",
      "Five consecutive review wins. The assassin's toolkit is complete.",
      "Five straight. Level 2 review is a formality.",
    ],
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
    first: [
      "The Level 2 final begins. First puzzle handled with precision.",
      "Final exam opens with a statement. Assassin mode.",
      "First solve in the finale. Setting the pace.",
    ],
    last: [
      "Level 2 Final: last puzzle solved. Graduation day.",
      "That's the final puzzle. The assassin graduates.",
      "Level 2 complete. The toolkit is yours forever.",
    ],
    recovery: [
      "Final exams test everything. Recovered and solved.",
      "The finale pushed back. You pushed through.",
      "One retry in the final. Still graduating.",
      "Stumble in the final, then a clean finish. Character.",
    ],
    'streak:3': [
      "Three running in the Level 2 final. Cruising.",
      "Triple streak in the finale. Making the exam look easy.",
      "Three in a row on the final. Assassin precision.",
    ],
    'streak:5': [
      "Five straight in the Level 2 final. Flawless graduation.",
      "Five in a row on the final exam. Valedictorian.",
      "Five consecutive solves in the finale. Untouchable.",
    ],
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
    first: [
      "Deflection section opens. First guard removed.",
      "First deflection executed. The setup game begins.",
      "Opening with a guard removal. Sophisticated start.",
    ],
    last: [
      "Final deflection. Section dismantled.",
      "Last guard pulled from duty. Section complete.",
      "Deflection chapter closed. Every defender compromised.",
      "Section wrapped. Nobody guards against you.",
    ],
    recovery: [
      "The deflection was hidden. Second try found the guard.",
      "Missed the removal, then executed on retry.",
      "Deflection takes vision. Second attempt had it.",
    ],
    'streak:3': [
      "Three deflections running. Pulling guards left and right.",
      "Triple deflection streak. The defenders are helpless.",
      "Three in a row. Nobody stays on their post.",
    ],
    'streak:5': [
      "Five deflections straight. Professional guard removal.",
      "Five in a row. Every defender is compromised.",
      "Five consecutive deflections. The setup mastery is real.",
    ],
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
    first: [
      "First lure set. They walked right in.",
      "Attraction section opens with a trap sprung.",
      "Opening bait taken. The section begins.",
    ],
    last: [
      "Final lure of the section. They all fell for it.",
      "Last attraction puzzle. Section trapped and sealed.",
      "Attraction chapter closed. Every lure worked.",
    ],
    recovery: [
      "The bait wasn't obvious. Found the lure on retry.",
      "Missed the attraction, then set the trap perfectly.",
      "Second attempt, cleaner lure. They came willingly.",
      "The attraction needed refinement. Delivered on retry.",
    ],
    'streak:3': [
      "Three lures set, three traps sprung.",
      "Triple attraction streak. Irresistible.",
      "Three in a row. The bait game is on point.",
    ],
    'streak:5': [
      "Five attractions straight. Every trap set, every trap sprung.",
      "Five in a row. The lure game is unstoppable.",
      "Five consecutive attractions. Professional trap-setter.",
    ],
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
    first: [
      "First path cleared. The attack highway is open.",
      "Clearance section starts. Obstacles removed.",
      "Opening interference deployed. Communication cut.",
    ],
    last: [
      "Final clearance move. Section path: wide open.",
      "Last interference of the chapter. All lines severed.",
      "Section complete. Every path cleared, every line blocked.",
    ],
    recovery: [
      "The clearance was subtle. Second try opened the path.",
      "Missed the interference, then cut the line.",
      "Path unclear at first. Retry cleared the way.",
    ],
    'streak:3': [
      "Three clearances running. Opening highways.",
      "Triple streak. Paths clear, lines blocked, wins stacked.",
      "Three in a row. The setup game is surgical.",
    ],
    'streak:5': [
      "Five clearances straight. Every path opened, every line cut.",
      "Five in a row. The obstacle removal game is elite.",
      "Five consecutive clears. Nothing stands between you and the win.",
      "Five for five. Clearance and interference mastered.",
    ],
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
      "Interference complete. Coordination severed.",
      "Blocked the defender. Claimed the prize.",
    ],
  },

  // Section 4: Review - Enablers
  '3.4': {
    first: [
      "Enablers review opens. First setup tactic confirmed.",
      "Review starts clean. The enabler skills are there.",
      "Opening the enablers review with a solve.",
    ],
    last: [
      "Enablers review complete. Every setup tactic confirmed.",
      "Last enabler reviewed. The sophisticated tools are locked.",
      "Final review puzzle done. Deflection, attraction, clearance: yours.",
    ],
    recovery: [
      "Review found a rough edge. Polished on retry.",
      "The enabler hid in review. Second pass caught it.",
      "Setup tactics needed a refresh. Done.",
    ],
    'streak:3': [
      "Three enabler reviews running. Setup skills sharp.",
      "Triple streak on enabler review. The prep work is solid.",
      "Three in a row. The setup game is permanent.",
    ],
    'streak:5': [
      "Five enabler reviews straight. Sophisticated skills locked.",
      "Five in a row. Enabler review: just a formality.",
      "Five consecutive enabler reviews. The foundation is steel.",
    ],
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
    first: [
      "Sacrifice section opens. First investment pays off.",
      "First bold move of the chapter. Calculated risk, calculated reward.",
      "The sacrifice section begins with a win. Bold start.",
    ],
    last: [
      "Final sacrifice of the section. Every investment returned.",
      "Last calculated risk. Section complete.",
      "Sacrifice chapter sealed. Give to get: mastered.",
      "Section done. The bold game is yours.",
    ],
    recovery: [
      "The sacrifice line was deeper than expected. Found it on retry.",
      "Bold moves need precision. Second attempt was precise.",
      "Missed the return. Found the payoff on the second try.",
    ],
    'streak:3': [
      "Three sacrifices running. Every investment returning.",
      "Triple sacrifice streak. Bold and accurate.",
      "Three in a row. Calculated aggression flowing.",
    ],
    'streak:5': [
      "Five sacrifices straight. Give to get, every time.",
      "Five in a row. The sacrifice game is automatic.",
      "Five consecutive calculated risks. All paid off.",
    ],
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
    first: [
      "Material sacrifice section starts. First trade-up executed.",
      "Opening sacrifice for profit. The exchange was worth it.",
      "First material sacrifice solved. Give less, get more.",
    ],
    last: [
      "Final material sacrifice. Section profits collected.",
      "Last exchange sacrifice of the chapter. All gains banked.",
      "Section complete. Every sacrifice returned more than it cost.",
    ],
    recovery: [
      "The exchange was tricky. Found the compensation on retry.",
      "Material sacrifice needed a second calculation. Worth it.",
      "Missed the return on the sacrifice. Second try balanced the books.",
    ],
    'streak:3': [
      "Three material sacrifices running. Profitable streak.",
      "Triple exchange streak. Every trade-up works.",
      "Three in a row. The sacrifice math is on point.",
      "Three straight material sacrifices. Banking wins.",
    ],
    'streak:5': [
      "Five material sacrifices straight. The exchange game is elite.",
      "Five in a row. Every sacrifice yields more than it costs.",
      "Five consecutive profitable sacrifices. The books always balance.",
    ],
    general: [
      "Temporary sacrifice, permanent advantage.",
      "The calculation justified the sacrifice.",
      "Material down, position up, game won.",
      "Sacrificed and collected.",
      "The exchange was worth it.",
      "Short-term loss, long-term gain.",
      "Give material, get checkmate.",
      "The trade that wasn't equal... in your favor.",
      "Give a piece, gain the whole position.",
      "The sacrifice math checks out. Every time.",
    ],
    sacrifice: [
      "Exchange sacrifice delivered.",
      "Temporary material debt, permanent positional credit.",
      "The sacrifice converts to a winning advantage.",
    ],
    'piece:R': [
      "Exchange sacrifice: rook for domination.",
      "Give the rook, get the game.",
      "Rook for minor piece? Plus the win.",
    ],
  },

  // Section 7: Advanced Tactics
  '3.7': {
    first: [
      "Advanced tactics opened. First sophisticated solve in the bag.",
      "The advanced section begins. Complexity handled.",
      "First advanced tactic of Level 3. Rising power.",
    ],
    last: [
      "Final advanced tactic. Section conquered.",
      "Last sophisticated move of the chapter. Clean close.",
      "Advanced tactics complete. The evolution continues.",
    ],
    recovery: [
      "Advanced complexity needed a second look. Found it.",
      "The sophisticated line hid. Retry uncovered it.",
      "Complex tactic, clean recovery. Growth.",
    ],
    'streak:3': [
      "Three advanced tactics running. Leveling up fast.",
      "Triple advanced streak. Sophisticated and sharp.",
      "Three in a row on the hard stuff. Impressive.",
    ],
    'streak:5': [
      "Five advanced tactics straight. Next-level vision.",
      "Five in a row on advanced problems. That's elite.",
      "Five consecutive advanced solves. The skills are evolving.",
      "Five for five on advanced tactics. Rising power confirmed.",
    ],
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
    first: [
      "Sacrifice and tactics review starts. First solve: clean.",
      "Review opens with a hit. The bold skills are intact.",
      "First review puzzle down. Calculated aggression confirmed.",
    ],
    last: [
      "Sacrifice and tactics review done. Everything sharp.",
      "Last review puzzle solved. Bold play: confirmed.",
      "Review wrapped. Sacrifices and tactics are locked in.",
    ],
    recovery: [
      "Review found something. Second try sharpened it.",
      "Bold play needed a retry during review. Now it's locked.",
      "The sacrifice review tripped up. Then it clicked.",
    ],
    'streak:3': [
      "Three review puzzles running. Sacrifice skills hold.",
      "Triple review streak. The bold game is permanent.",
      "Three in a row on sacrifice review. Steady.",
    ],
    'streak:5': [
      "Five review puzzles straight. Calculated aggression: bulletproof.",
      "Five in a row. Sacrifice and tactics review: ace.",
      "Five consecutive review wins. The bold play never fades.",
    ],
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
    first: [
      "Multi-move mates begin. First sequence calculated.",
      "Opening the deep chapter with a forced finish.",
      "First multi-move mate. The calculation starts now.",
    ],
    last: [
      "Final forced sequence. Multi-move mates: complete.",
      "Last checkmate of the section. Deep calculation proven.",
      "Section finished. Every sequence calculated to the end.",
    ],
    recovery: [
      "The forcing line was deep. Found it on the second try.",
      "Multi-move calculation needed a retry. Found the path.",
      "Missed a move in the sequence. Recalculated and delivered.",
      "The checkmate was hiding deeper. Second attempt reached it.",
    ],
    'streak:3': [
      "Three multi-move mates running. Deep calculation flowing.",
      "Triple forced mate streak. The depth is there.",
      "Three in a row. Deep vision confirmed.",
    ],
    'streak:5': [
      "Five multi-move mates straight. Calculator mode engaged.",
      "Five in a row. Every forcing sequence found.",
      "Five consecutive deep mates. The calculation runs deep.",
    ],
    general: [
      "The checkmate sequence visualized.",
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
      "The two-move checkmate lands.",
    ],
    mateIn3: [
      "Mate in 3 executed.",
      "The three-move sequence unfolds perfectly.",
    ],
    'moves:2': [
      "Mate in 2. Calculated perfectly.",
      "Two moves to victory. Both forced.",
      "Two-move calculation, clean finish.",
    ],
    'moves:3': [
      "Three moves to glory. All calculated.",
      "Three moves of pure calculation.",
      "Three deep. Three precise. Checkmate.",
    ],
  },

  // Section 10: Endgame Mastery
  '3.10': {
    first: [
      "Endgame mastery starts. First conversion: clean.",
      "The endgame section opens with technique.",
      "First endgame at Level 3 difficulty. Handled.",
    ],
    last: [
      "Final endgame mastered. Section complete.",
      "Last conversion of the chapter. Technique proven.",
      "Endgame mastery section: wrapped. From advantage to victory.",
    ],
    recovery: [
      "Endgame technique needed adjustment. Retry was textbook.",
      "Conversion stumbled, then smoothed out.",
      "The ending was tricky. Second approach was cleaner.",
    ],
    'streak:3': [
      "Three endgame conversions running. Technique on point.",
      "Triple conversion streak. The technique is real.",
      "Three in a row. Endgame mastery building.",
    ],
    'streak:5': [
      "Five endgame conversions straight. Mastery level technique.",
      "Five in a row. From advantage to win: automatic.",
      "Five consecutive conversions. The endgame is your domain.",
      "Five straight. Endgame mastery isn't a goal, it's a fact.",
    ],
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
    first: [
      "Combined tactics start. First chain reaction solved.",
      "Opening the combo section with a multi-tactic solve.",
      "First combined puzzle down. The tactics compound.",
    ],
    last: [
      "Final combined tactic. Section connected.",
      "Last chain reaction solved. Every tactic stacks.",
      "Combined section sealed. Tactical synergy confirmed.",
    ],
    recovery: [
      "Combined tactics are complex. Second attempt connected the dots.",
      "The chain reaction needed a retry. Now it flows.",
      "Missed a link in the combination. Found it on the second try.",
    ],
    'streak:3': [
      "Three combined tactics running. The chains keep connecting.",
      "Triple combo streak. Every tactic enables the next.",
      "Three in a row. Combination chess at its finest.",
    ],
    'streak:5': [
      "Five combined tactics straight. Tactical synergy on display.",
      "Five in a row. Every combination connects perfectly.",
      "Five consecutive chain reactions. Unstoppable combinations.",
    ],
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
    first: [
      "Combination review starts. First deep solve: clean.",
      "Review opens with a hit. The combination skills hold.",
      "First review puzzle solved. Chain reactions intact.",
    ],
    last: [
      "Combination review complete. Depth confirmed.",
      "Last review puzzle done. The deep skills are locked.",
      "Final combo reviewed. Checkmates, endgames, combinations: all yours.",
    ],
    recovery: [
      "The combo hid during review. Found it on retry.",
      "Review caught a gap in the chain. Now it's forged.",
      "Combination review needed a second pass. Polished now.",
    ],
    'streak:3': [
      "Three combo reviews running. Deep skills confirmed.",
      "Triple review streak on combinations. Solid foundation.",
      "Three in a row. The depth doesn't fade in review.",
    ],
    'streak:5': [
      "Five combo reviews straight. Comprehensive depth.",
      "Five in a row. Combination skills: bulletproof.",
      "Five consecutive combination reviews aced. The foundation is steel.",
    ],
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
    first: [
      "Level 3 review opens. First solve across all skills.",
      "Full review starts strong. The sophistication is there.",
      "First Level 3 review puzzle handled. Everything intact.",
    ],
    last: [
      "Level 3 review wrapped. Every sophisticated skill confirmed.",
      "Last review puzzle. Ready for the final exam.",
      "Full Level 3 review done. The rising power is established.",
    ],
    recovery: [
      "Full review caught an edge. Second try sharpened it.",
      "The mixed review tripped a wire. Reset and solved.",
      "Review found something to polish. Polished.",
      "One hiccup in the full review. Cleaned up.",
    ],
    'streak:3': [
      "Three Level 3 review puzzles running. All skills firing.",
      "Triple streak on full review. The sophistication is natural.",
      "Three in a row across mixed skills. Consistent.",
    ],
    'streak:5': [
      "Five Level 3 review puzzles straight. Complete mastery.",
      "Five in a row. The full review is a victory lap.",
      "Five consecutive wins across all Level 3 skills. Dominant.",
    ],
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
    first: [
      "Level 3 final opens. First puzzle: confident.",
      "The graduation exam begins with a statement.",
      "First solve in the Level 3 finale. Setting the tone.",
    ],
    last: [
      "Level 3 Final: conquered. Never apologize for that.",
      "Last puzzle of Level 3. Graduation complete.",
      "The final closes. Level 3 is yours. Unapologetically.",
    ],
    recovery: [
      "The finale tested you. You came back swinging.",
      "One stumble in the final. Then a clean recovery. Class.",
      "Final exam retry. Still graduating with honors.",
    ],
    'streak:3': [
      "Three running in the Level 3 final. Smooth sailing.",
      "Triple streak in the finale. Making it look effortless.",
      "Three in a row. The final is a formality.",
    ],
    'streak:5': [
      "Five straight in the Level 3 final. Flawless graduation.",
      "Five in a row on the final. The sophisticated player emerges.",
      "Five consecutive solves in the finale. Unapologetic excellence.",
      "Five for five in the final. Never apologize for being great.",
    ],
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
    first: [
      "Level 4 begins. First sacrifice pattern executed.",
      "The empire starts here. Opening formula applied.",
      "First puzzle, first formula. The chemistry begins.",
    ],
    last: [
      "Final sacrifice pattern. The formula is yours.",
      "Last pattern of the section. Empire foundations laid.",
      "Section complete. The sacrifice formula works every time.",
    ],
    recovery: [
      "The formula needed recalibration. Second attempt: pure.",
      "Missed the pattern, then applied the formula. Chemistry.",
      "The sacrifice hid. The second try found the reaction.",
    ],
    'streak:3': [
      "Three sacrifice patterns running. The formula flows.",
      "Triple pattern streak. Chemistry in action.",
      "Three in a row. The sacrifice game is dialed in.",
    ],
    'streak:5': [
      "Five sacrifice patterns straight. Empire chemistry.",
      "Five in a row. The formula never fails.",
      "Five consecutive patterns. Pure, uncut precision.",
      "Five for five. The empire runs on this formula.",
    ],
    general: [
      "The sacrifice opens everything.",
      "Chemistry is change. So is their position.",
      "Calculated destruction.",
      "The formula works. It always works.",
      "Sacrifice pattern executed perfectly.",
      "Lines opened. Position dismantled.",
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
    first: [
      "First trapped piece collected. The cage works.",
      "Trapped pieces section opens. First net deployed.",
      "Opening with a trap. No mercy from the start.",
    ],
    last: [
      "Final trapped piece. Section caged and locked.",
      "Last piece captured from the trap. Section done.",
      "Trapping section complete. No escape was ever an option.",
    ],
    recovery: [
      "Missed the trap, then closed the cage on retry.",
      "The net needed adjustment. Second attempt: sealed tight.",
      "Took another look and found the cage. Trapped.",
      "The piece almost escaped. Almost.",
    ],
    'streak:3': [
      "Three trapped pieces running. The nets keep closing.",
      "Triple trap streak. Everything gets caged.",
      "Three in a row. No squares left for anyone.",
    ],
    'streak:5': [
      "Five trapped pieces straight. Nobody escapes.",
      "Five in a row. Professional trapper status.",
      "Five consecutive traps. The whole board is a cage.",
    ],
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
      "The piece fell in a cage of its own making.",
    ],
  },

  // Section 3: Exposed King Hunt
  '4.3': {
    first: [
      "King hunt section opens. First exposed king punished.",
      "Opening attack on an exposed king. You ARE the danger.",
      "First hunt begins and ends quickly.",
    ],
    last: [
      "Final king hunt. Section conquered. No mercy given.",
      "Last exposed king chased down. Section sealed.",
      "King hunt chapter done. The danger is confirmed.",
    ],
    recovery: [
      "The hunt needed a second start. Still caught the king.",
      "Missed the chase line. Retry ran them down.",
      "King hunt recovery. They ran, you followed, you won.",
    ],
    'streak:3': [
      "Three king hunts running. Open season.",
      "Triple hunt streak. Every exposed king falls.",
      "Three in a row. The danger is relentless.",
      "Three straight chases. No king is safe.",
    ],
    'streak:5': [
      "Five king hunts straight. You are the danger personified.",
      "Five in a row. Every exposed king meets its end.",
      "Five consecutive hunts. The board is your territory.",
    ],
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
      "Open king, open season.",
    ],
  },

  // Section 4: Review - Attack Training
  '4.4': {
    first: [
      "Attack training review starts. First strike: clean.",
      "Review opens with aggression. The offense is intact.",
      "First review puzzle down. Still dangerous.",
    ],
    last: [
      "Attack training review complete. Every weapon confirmed.",
      "Last review puzzle. The offensive skills are permanent.",
      "Review done. Sacrifices, traps, hunts: all locked.",
    ],
    recovery: [
      "Review found a gap in the attack. Plugged on retry.",
      "Attack review needed a second pass. Now it's sharp.",
      "The offense needed recalibration. Done.",
    ],
    'streak:3': [
      "Three attack reviews running. The offense is automatic.",
      "Triple review streak. The danger never left.",
      "Three in a row. Attack skills: confirmed and permanent.",
    ],
    'streak:5': [
      "Five attack reviews straight. The empire's offense holds.",
      "Five in a row. Review? More like victory lap.",
      "Five consecutive review wins. The danger is forever.",
    ],
    general: [
      "Attack training complete.",
      "Sacrifices, traps, king hunts. The toolkit.",
      "The offensive skills are locked in.",
      "Review mode: still dangerous.",
      "Attack review: flawless execution.",
      "The aggression is calculated.",
      "From setup to finish: smooth.",
      "Review confirms: you're the danger.",
      "Attack patterns on autopilot.",
      "The formula is internalized.",
    ],
  },

  // Section 5: Mate in 4
  '4.5': {
    first: [
      "Mate in 4 section starts. First deep calculation landed.",
      "Deep chess begins. Opening four-mover solved.",
      "First long mate of the section. The depth is there.",
    ],
    last: [
      "Final mate in 4. Section calculated to completion.",
      "Last deep mate of the chapter. Precision confirmed.",
      "Mate in 4 section done. The calculation depth is locked.",
    ],
    recovery: [
      "Four moves deep and the line was tricky. Found it on retry.",
      "Deep calculation needed rechecking. Second try was precise.",
      "The long mate hid. Deeper calculation on retry found it.",
    ],
    'streak:3': [
      "Three deep mates running. Calculating four moves ahead on repeat.",
      "Triple deep mate streak. The vision runs deep.",
      "Three in a row. Four-move calculation: on demand.",
    ],
    'streak:5': [
      "Five deep mates straight. Calculator doesn't make errors.",
      "Five in a row. Deep calculation at will.",
      "Five consecutive four-movers. Inevitability personified.",
    ],
    general: [
      "Calculate deep. Execute deeper.",
      "The forcing sequence is beautiful.",
      "Deep calculation delivers.",
      "The checkmate was always there.",
      "The long combination pays off.",
      "Calculated to the end.",
      "Deep vision, clean execution.",
      "The mating net was inevitable.",
    ],
    mateIn4: [
      "Mate in 4 executed flawlessly.",
      "The deep checkmate lands.",
      "The four-move sequence unfolds perfectly.",
    ],
    'moves:4': [
      "Four moves. One destination.",
      "Four moves of pure precision.",
      "Visualize four, execute four, win.",
      "Four moves of inevitability.",
    ],
  },

  // Section 6: The Quiet Storm
  '4.6': {
    first: [
      "The quiet storm begins. First silent move lands.",
      "No drama. Just the opening quiet move. Devastating.",
      "First puzzle: no check, no capture, total domination.",
    ],
    last: [
      "Final quiet move. The storm passes. Section done.",
      "Last silent strike. Nothing louder than a quiet closer.",
      "Quiet storm section complete. Whispers that won wars.",
    ],
    recovery: [
      "Quiet moves hide. Found the silence on the second try.",
      "Looked for checks first. The quiet move was the answer all along.",
      "Missed the subtle move, then whispered the win.",
      "Second try found the calm in the storm.",
    ],
    'streak:3': [
      "Three quiet moves running. Silent but devastating.",
      "Triple quiet streak. The subtlety compounds.",
      "Three in a row. No drama, all results.",
    ],
    'streak:5': [
      "Five quiet moves straight. The silent storm rages.",
      "Five in a row. No checks, no captures, all wins.",
      "Five consecutive quiet moves. The deadliest silence in chess.",
    ],
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
    first: [
      "Positional pressure starts. First squeeze applied.",
      "Opening the grind section. They wish they could pass.",
      "First positional win. The walls close in.",
    ],
    last: [
      "Final positional squeeze. Section crushed.",
      "Last puzzle. The pressure section is done. They can breathe now.",
      "Positional pressure complete. The empire's grip is tight.",
    ],
    recovery: [
      "The squeeze wasn't obvious. Found the pressure on retry.",
      "Positional play needed a second look. The grip tightened.",
      "Missed the zugzwang. Second try found the trap of forced moves.",
    ],
    'streak:3': [
      "Three positional wins running. The squeeze is relentless.",
      "Triple pressure streak. They can't make a good move.",
      "Three in a row. Positional stranglehold.",
    ],
    'streak:5': [
      "Five positional wins straight. Total domination.",
      "Five in a row. Every square is wrong for them.",
      "Five consecutive squeezes. The empire's grip never loosens.",
      "Five for five. Zugzwang central.",
    ],
    general: [
      "Squeeze until they break.",
      "Any move makes it worse.",
      "Positional stranglehold.",
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
    first: [
      "Deep calculation review opens. First solve: precise.",
      "Review starts with depth. The calculation is there.",
      "First review puzzle calculated and conquered.",
    ],
    last: [
      "Deep calculation review done. Precision locked in.",
      "Last review puzzle. The depth is permanent.",
      "Review complete. Calculation confirmed at every level.",
    ],
    recovery: [
      "Review found depth to sharpen. Second try polished it.",
      "Deep calculation review needed a retry. Recalibrated.",
      "The calculation wasn't deep enough first time. Now it is.",
    ],
    'streak:3': [
      "Three deep reviews running. Precision holds.",
      "Triple review streak. Depth confirmed across the board.",
      "Three in a row on deep review. No half measures.",
    ],
    'streak:5': [
      "Five deep reviews straight. The calculation runs pure.",
      "Five in a row. Deep review is routine at this point.",
      "Five consecutive deep calculation reviews. Flawless depth.",
    ],
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
    first: [
      "Decisive tactics begin. First finishing blow: delivered.",
      "Opening with authority. The decisive section starts now.",
      "First decisive tactic. Maximum impact from move one.",
    ],
    last: [
      "Final decisive blow. Section ended with authority.",
      "Last finishing move. The empire expands.",
      "Decisive tactics complete. Every blow landed.",
      "Section sealed with a decisive strike.",
    ],
    recovery: [
      "The finishing blow missed. The second one didn't.",
      "Decisive play needed another attempt. Delivered with authority.",
      "Missed the decisive moment, then seized it on retry.",
    ],
    'streak:3': [
      "Three decisive tactics running. Finishing blow on repeat.",
      "Triple decisive streak. They can't survive the impact.",
      "Three in a row. Every blow lands.",
    ],
    'streak:5': [
      "Five decisive tactics straight. No mercy.",
      "Five in a row. The finishing game is absolute.",
      "Five consecutive decisive blows. Empire business.",
    ],
    general: [
      "Decisive. Final. Absolute.",
      "End them with authority.",
      "The finishing blow lands.",
      "No slow grind. Maximum impact.",
      "Decisive tactics deployed.",
      "The finishing blow connects.",
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
    first: [
      "Promotion warfare starts. First pawn reaches the throne.",
      "The eighth rank calls. First promotion secured.",
      "Opening the section with a queen. Brand new.",
    ],
    last: [
      "Final promotion. Section warfare: won.",
      "Last pawn promoted. The section is yours.",
      "Promotion warfare done. Every pawn found the eighth rank.",
    ],
    recovery: [
      "The promotion path was blocked. Found a way through on retry.",
      "Missed the promotion tactic. Second try queened the pawn.",
      "Pawn got stuck. Then it found the highway.",
    ],
    'streak:3': [
      "Three promotions running. The pawns march in formation.",
      "Triple promotion streak. New queens everywhere.",
      "Three in a row. The eighth rank belongs to you.",
    ],
    'streak:5': [
      "Five promotions straight. Pawn factory at full capacity.",
      "Five in a row. The promotion game is relentless.",
      "Five consecutive promotions. The empire mints queens on demand.",
      "Five for five. Every pawn believes in the eighth rank.",
    ],
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
    first: [
      "Minor piece endgames start. First conversion: smooth.",
      "Opening the minor piece chapter. Technique online.",
      "First bishop vs knight endgame handled. Clean technique.",
    ],
    last: [
      "Final minor piece endgame. Section technique: proven.",
      "Last conversion of the chapter. Minor pieces, major results.",
      "Section done. Minor piece mastery confirmed.",
    ],
    recovery: [
      "Minor piece technique needed adjustment. Retry was clean.",
      "The endgame was tricky. Second approach found the path.",
      "Bishop vs knight confusion cleared. Solved on retry.",
    ],
    'streak:3': [
      "Three minor piece endgames running. The technique holds.",
      "Triple conversion streak. Bishops, knights, all handled.",
      "Three in a row. Minor piece technique on point.",
    ],
    'streak:5': [
      "Five minor piece endgames straight. Technical mastery.",
      "Five in a row. Every ending converted. Professional technique.",
      "Five consecutive minor piece conversions. The empire converts everything.",
    ],
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
    first: [
      "Conversion review starts. First advantage turned into a win.",
      "Review opens with a clean conversion. The technique is there.",
      "First review puzzle converted. Empire building on track.",
    ],
    last: [
      "Conversion review complete. Every advantage converts.",
      "Last review done. The conversion pipeline is bulletproof.",
      "Final conversion reviewed. Building the empire, one win at a time.",
    ],
    recovery: [
      "Conversion review found a leak. Plugged on retry.",
      "The technique needed refreshing. Review did its job.",
      "Missed the conversion in review. Second try sealed it.",
    ],
    'streak:3': [
      "Three conversion reviews running. The pipeline flows.",
      "Triple review streak. Every advantage becomes a win.",
      "Three in a row. Conversion technique: permanent.",
    ],
    'streak:5': [
      "Five conversion reviews straight. The pipeline never leaks.",
      "Five in a row. Every advantage, every time, every win.",
      "Five consecutive conversions on review. Empire efficiency.",
    ],
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
    first: [
      "Level 4 review starts. First full-kit puzzle solved.",
      "The empire review begins. First solve: dominant.",
      "Opening the Level 4 review. All systems firing.",
    ],
    last: [
      "Level 4 review complete. The empire stands.",
      "Last review puzzle. Ready for the final.",
      "Full Level 4 review done. You're the danger. Confirmed.",
    ],
    recovery: [
      "Full review caught something. Fixed on the second try.",
      "The empire review found a crack. Now it's sealed.",
      "One retry across the full review. The formula holds.",
    ],
    'streak:3': [
      "Three Level 4 review puzzles running. The formula works.",
      "Triple streak on full review. The empire is solid.",
      "Three in a row across all Level 4 skills. Dominant.",
    ],
    'streak:5': [
      "Five Level 4 review puzzles straight. Total domination.",
      "Five in a row. The full review is a coronation.",
      "Five consecutive review wins. The empire doesn't crack.",
    ],
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
    first: [
      "The Level 4 final begins. First puzzle: say your name.",
      "Opening the empire's final exam. First solve: dominant.",
      "Level 4 finale starts strong. The danger is real.",
    ],
    last: [
      "Level 4 Final: last puzzle. Say your name. You're done.",
      "The empire is built. Level 4 graduation complete.",
      "That's the final puzzle. You're goddamn right it's over.",
    ],
    recovery: [
      "The final tested the empire. It held on retry.",
      "One stumble in the Level 4 final. No half measures on the fix.",
      "The empire recovered. No half measures.",
    ],
    'streak:3': [
      "Three running in the Level 4 final. The empire cruises.",
      "Triple streak in the finale. Total control.",
      "Three in a row. The Level 4 final bows.",
      "Three straight in the final. No half measures. Full wins.",
    ],
    'streak:5': [
      "Five straight in the Level 4 final. Flawless empire.",
      "Five in a row. The one who knocks doesn't miss.",
      "Five consecutive solves in the finale. Pure domination.",
    ],
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
    first: [
      "Level 5 opens with a deep mate. The virtuoso arrives.",
      "First long checkmate solved. Tournament-ready depth.",
      "Mate in 5+ section starts with a clean calculation.",
    ],
    last: [
      "Final deep mate. The long calculation section is yours.",
      "Last mate in 5+. Section calculated to completion.",
      "Deep mates done. The virtuoso showed up.",
    ],
    recovery: [
      "Five moves deep is no joke. Found the line on retry.",
      "The long calculation stumbled. Second try was flawless.",
      "Deep mate needed a recalculation. Got there.",
      "Missed a branch. Re-read the tree. Checkmate.",
    ],
    'streak:3': [
      "Three deep mates running. The depth is effortless now.",
      "Triple long-mate streak. Virtuoso calculation.",
      "Three in a row on 5+ moves. Tournament vision.",
    ],
    'streak:5': [
      "Five deep mates straight. The calculation never stops.",
      "Five in a row. Long-range precision at its finest.",
      "Five consecutive deep mates. Unstoppable depth.",
    ],
    general: [
      "The long checkmate visualized.",
      "Deep calculation delivers deep checkmate.",
      "The extended forcing sequence.",
      "Calculate the whole line. Execute it.",
      "Long range planning, precise execution.",
      "The deep mate lands.",
      "From here to checkmate: calculated.",
      "The deepest checkmate. Found and executed.",
    ],
    mateIn5: [
      "Mate in 5 executed.",
      "The long checkmate arrives.",
      "Deep mate delivered with precision.",
    ],
    'moves:5': [
      "Five moves ahead. All calculated.",
      "Five moves of pure inevitability.",
      "Five moves of destiny. All foreseen.",
    ],
  },

  // Section 2: Double Check
  '5.2': {
    first: [
      "Double check section starts. First devastating blow delivered.",
      "Opening with the most forcing move in chess. Strong start.",
      "First double check landed. They had zero options.",
    ],
    last: [
      "Final double check. Section complete. Total forcing.",
      "Last double check of the chapter. Nothing could be blocked.",
      "Double check section done. The ultimate forcing tool mastered.",
    ],
    recovery: [
      "The double check needed coordination. Found it on retry.",
      "Missed the double. Second try coordinated both pieces.",
      "Double check recovery. Two attackers, one king, solved.",
    ],
    'streak:3': [
      "Three double checks running. Maximum force applied.",
      "Triple double-check streak. Zero defensive options given.",
      "Three in a row. The most forcing tactic on repeat.",
    ],
    'streak:5': [
      "Five double checks straight. Overwhelming coordination.",
      "Five in a row. They can only run. Every time.",
      "Five consecutive double checks. The forcing game is elite.",
    ],
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
    first: [
      "Windmill section starts spinning. First combo devastates.",
      "Opening windmill deployed. The spin cycle begins.",
      "First windmill pattern. Check, take, repeat. Beautiful.",
    ],
    last: [
      "Final windmill. Section spun to completion.",
      "Last spin of the section. Material completely harvested.",
      "Windmill section done. The most beautiful pattern mastered.",
    ],
    recovery: [
      "The windmill stalled. Restarted on retry. Full spin.",
      "Missed the discovery loop. Second try caught the rhythm.",
      "Windmill needed a push to start. Then it was unstoppable.",
    ],
    'streak:3': [
      "Three windmills running. Check, take, check, take, repeat.",
      "Triple windmill streak. The spin never stops.",
      "Three in a row. Discovery after discovery.",
      "Three straight spins. Material flowing in.",
    ],
    'streak:5': [
      "Five windmills straight. The spin cycle of doom.",
      "Five in a row. Unlimited discovery power.",
      "Five consecutive windmills. They can only watch and lose.",
    ],
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
    first: [
      "Threat review opens. First multi-threat puzzle solved.",
      "Review starts with pressure. The forcing skills are intact.",
      "First review puzzle. Deep mates and double checks: confirmed.",
    ],
    last: [
      "Multiple threats reviewed. Every forcing tool confirmed.",
      "Last review puzzle done. The threat arsenal is stacked.",
      "Review complete. Deep mates, double checks, windmills: all yours.",
    ],
    recovery: [
      "The review found something. Sharpened on the second try.",
      "Forcing moves needed a refresh. Review delivered.",
      "One retry in the threat review. Now it's locked.",
    ],
    'streak:3': [
      "Three threat reviews running. The forcing toolkit holds.",
      "Triple streak on multiple threat review. All systems go.",
      "Three in a row. Every forcing move accounted for.",
    ],
    'streak:5': [
      "Five threat reviews straight. Comprehensive forcing skills.",
      "Five in a row. The review is just a showcase now.",
      "Five consecutive review wins. The coin always lands your way.",
    ],
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
    first: [
      "Defense section opens. First saving move found.",
      "Defensive resources begin. First counter deployed.",
      "Opening with a save. Not done yet.",
    ],
    last: [
      "Final defensive resource found. Section saved.",
      "Last saving move of the chapter. Every counter discovered.",
      "Defense section complete. You find every resource.",
      "Section done. Nothing catches you off guard.",
    ],
    recovery: [
      "The defense hid deeper. Found the resource on retry.",
      "Defensive resources are subtle. Second try spotted it.",
      "Missed the save first time. Found the counter second time.",
    ],
    'streak:3': [
      "Three defensive resources running. Nothing gets past you.",
      "Triple save streak. The counter-game is strong.",
      "Three in a row. Every attack has an answer.",
    ],
    'streak:5': [
      "Five defensive saves straight. Untouchable.",
      "Five in a row. Every threat answered. Every resource found.",
      "Five consecutive saves. The defense is virtuoso-level.",
    ],
    general: [
      "The saving move found.",
      "Defense that attacks.",
      "Hold the position. Find the counter.",
      "Defensive resources discovered.",
      "Not done yet. Not even close.",
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
    first: [
      "Fortress section starts. First impenetrable position built.",
      "The wall goes up. First fortress constructed.",
      "Opening with an unbreakable defense. Tournament steel.",
    ],
    last: [
      "Final fortress built. Section: impenetrable.",
      "Last fortress puzzle. Every wall held.",
      "Fortress section done. They can't break in.",
    ],
    recovery: [
      "The fortress had a crack. Second try sealed it.",
      "Finding the draw took two attempts. The wall holds now.",
      "Fortress construction needed a redo. Now it's airtight.",
    ],
    'streak:3': [
      "Three fortresses running. The walls don't fall.",
      "Triple fortress streak. Impenetrable on repeat.",
      "Three in a row. Material means nothing against your walls.",
    ],
    'streak:5': [
      "Five fortresses straight. Nothing gets through.",
      "Five in a row. The defensive architecture is perfect.",
      "Five consecutive fortresses. The walls are eternal.",
    ],
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
    first: [
      "Counterattack section starts. First reverse strike landed.",
      "Opening with a counterpunch. Defense turns to offense.",
      "First counterattack deployed. The tables turn immediately.",
    ],
    last: [
      "Final counterattack. Section reversed.",
      "Last reverse strike. From defense to dominance.",
      "Counterattack section done. Every attack got answered and then some.",
    ],
    recovery: [
      "The counter was hidden. Found the reverse on retry.",
      "Missed the counterpunch. Second try landed it clean.",
      "Counterattack timing was off. Retry was perfect.",
    ],
    'streak:3': [
      "Three counterattacks running. They attack, you punish.",
      "Triple counter streak. Every offense meets a stronger defense.",
      "Three in a row. Reverse uno deployed repeatedly.",
    ],
    'streak:5': [
      "Five counterattacks straight. Don't bring attacks you can't finish.",
      "Five in a row. From defense to dominance, every single time.",
      "Five consecutive counters. The reverse game is elite.",
      "Five for five. They should stop attacking you.",
    ],
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
    first: [
      "Defense review opens. First save confirmed.",
      "Review starts with a defensive hit. The shield is ready.",
      "First review: defense and counter skills intact.",
    ],
    last: [
      "Defense and counter review: done. The shield never cracks.",
      "Last review puzzle. The defensive game is proven.",
      "Final defense review complete. Unbreakable confirmed.",
    ],
    recovery: [
      "Defense review found a gap. Plugged on retry.",
      "The shield needed a patch in review. Fixed.",
      "One defensive retry in review. The wall holds now.",
    ],
    'streak:3': [
      "Three defense reviews running. The shield holds.",
      "Triple review streak. Defense and counter: solid.",
      "Three in a row. The defensive game doesn't fade.",
    ],
    'streak:5': [
      "Five defense reviews straight. Unbreakable skills.",
      "Five in a row. Defense review is a formality.",
      "Five consecutive defensive reviews. The wall is permanent.",
    ],
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
    first: [
      "Complex sacrifices begin. First multi-piece investment pays off.",
      "Opening with a bold sacrifice. Trust the calculation.",
      "First complex sacrifice solved. The returns are massive.",
    ],
    last: [
      "Final complex sacrifice. Section boldly conquered.",
      "Last multi-piece sacrifice. Every investment returned.",
      "Complex sacrifice section done. Give everything, get checkmate.",
    ],
    recovery: [
      "The complex sacrifice needed deeper trust. Found it on retry.",
      "Multi-piece sacrifice hid the compensation. Second try found it.",
      "The sacrifice was bold. The retry was bolder.",
      "Missed the return on the investment. Recalculated and profited.",
    ],
    'streak:3': [
      "Three complex sacrifices running. Bold and accurate.",
      "Triple sacrifice streak. Every investment returns tenfold.",
      "Three in a row on complex sacrifices. Trust the calculation.",
    ],
    'streak:5': [
      "Five complex sacrifices straight. Fearless calculation.",
      "Five in a row. Give everything, win everything.",
      "Five consecutive complex sacrifices. Virtuoso boldness.",
    ],
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
    first: [
      "Advanced deflection starts. First overloaded piece broken.",
      "Opening the section with a guard removal. Surgical.",
      "First advanced deflection solved. The technique evolves.",
    ],
    last: [
      "Final advanced deflection. Section disarmed.",
      "Last overloaded piece exploited. Every guard removed.",
      "Advanced deflection section done. Nothing stays defended.",
    ],
    recovery: [
      "The deflection was well-hidden. Found it on the second pass.",
      "Advanced deflection needed deeper analysis. Retry delivered.",
      "Missed the overload. Second try found the breaking point.",
    ],
    'streak:3': [
      "Three advanced deflections running. Guards dropping everywhere.",
      "Triple deflection streak. No defender is safe.",
      "Three in a row. The removal game is surgical.",
    ],
    'streak:5': [
      "Five advanced deflections straight. Every guard compromised.",
      "Five in a row. Nothing stays defended against you.",
      "Five consecutive advanced deflections. Virtuoso guard removal.",
    ],
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
    first: [
      "Theoretical endgames start. First textbook position converted.",
      "The theory section opens. First named position: handled.",
      "Opening with endgame theory applied perfectly.",
    ],
    last: [
      "Final theoretical endgame. Section theory: mastered.",
      "Last textbook position solved. The boring stuff that wins tournaments.",
      "Theory section done. Lucena, Philidor, all of them. Yours.",
    ],
    recovery: [
      "The theory was in there somewhere. Second try applied it.",
      "Theoretical endgame needed a review. Found the technique.",
      "Missed the named position. Retry recognized and converted it.",
    ],
    'streak:3': [
      "Three theoretical endgames running. The textbook is open.",
      "Triple theory streak. Every named position handled.",
      "Three in a row. Theory applied on demand.",
      "Three straight textbook conversions. Knowledge is power.",
    ],
    'streak:5': [
      "Five theoretical endgames straight. The theory is permanent.",
      "Five in a row. Every textbook position: automatic.",
      "Five consecutive theory positions converted. Expert level.",
    ],
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
    first: [
      "Virtuoso review opens. First advanced skill confirmed.",
      "Review starts with a hit. The elite skills are intact.",
      "First virtuoso review puzzle solved. All systems go.",
    ],
    last: [
      "Virtuoso review complete. Sacrifices, deflections, theory: all yours.",
      "Last review puzzle. The advanced toolkit is polished.",
      "Final virtuoso review done. Tournament-ready confirmed.",
    ],
    recovery: [
      "The virtuoso review found a rough edge. Smoothed on retry.",
      "Elite skills needed a touch-up. Review delivered.",
      "One retry in the advanced review. Now it shines.",
    ],
    'streak:3': [
      "Three virtuoso reviews running. The elite skills hold.",
      "Triple streak on virtuoso review. Advanced and automatic.",
      "Three in a row. The elite game doesn't fade.",
    ],
    'streak:5': [
      "Five virtuoso reviews straight. Tournament polish.",
      "Five in a row. The virtuoso review is a concert.",
      "Five consecutive elite reviews. Standing ovation material.",
    ],
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
    first: [
      "Level 5 review starts. First full-spectrum puzzle solved.",
      "The comprehensive review opens. First solve: clean.",
      "Full Level 5 review begins. All skills present.",
    ],
    last: [
      "Level 5 review complete. Tournament-ready across the board.",
      "Last review puzzle. Ready for the final.",
      "Full review done. No country for beginners. You're no beginner.",
    ],
    recovery: [
      "Full review caught something. Sharpened on retry.",
      "The comprehensive review found an edge to hone. Done.",
      "One retry in the full review. The edge is sharper now.",
    ],
    'streak:3': [
      "Three Level 5 reviews running. Comprehensive excellence.",
      "Triple streak on the full review. All skills confirmed.",
      "Three in a row across all Level 5 themes. Consistent.",
    ],
    'streak:5': [
      "Five Level 5 reviews straight. Complete mastery.",
      "Five in a row. The full review is a celebration.",
      "Five consecutive wins across all Level 5 skills. Call it.",
    ],
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
    first: [
      "Level 5 final begins. First puzzle: called it.",
      "The ultimate test opens. First solve sets the tone.",
      "Level 5 finale starts strong. You know how this ends.",
    ],
    last: [
      "Level 5 Final: conquered. No country for beginners, and you're not one.",
      "Last puzzle ever. You made it to the end.",
      "The finish line. Virtuoso status: achieved.",
    ],
    recovery: [
      "The final pushed you. You pushed back harder.",
      "One stumble in the Level 5 finale. Then a clean finish.",
      "The ultimate test allowed a retry. Still graduating.",
      "Last-level resilience. Recovered and closed.",
    ],
    'streak:3': [
      "Three running in the Level 5 final. Cruising to the end.",
      "Triple streak in the finale. Making the last exam look easy.",
      "Three in a row. The final is your victory lap.",
    ],
    'streak:5': [
      "Five straight in the Level 5 final. Flawless finish.",
      "Five in a row on the ultimate test. Call it. You won.",
      "Five consecutive solves in the finale. Virtuoso confirmed.",
    ],
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
      "Graduate. Go find someone to outplay.",
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
    first: [
      "Level 6 begins in silence. First quiet move, loudest result.",
      "Gotham's quiet section opens. First puzzle whispered to victory.",
      "Opening with a quiet move. The signal is lit.",
      "First solve. No check, no capture. Just a plan.",
    ],
    last: [
      "Final quiet move. Gotham's subtlest section: complete.",
      "Last silent strike. The quiet game is yours.",
      "Section done. The quietest moves won the loudest victories.",
    ],
    recovery: [
      "Looked for fireworks first. The quiet move was the answer all along. Got it on retry.",
      "Gotham's subtle game takes a second look sometimes.",
      "The quiet move hid. You listened harder on retry.",
    ],
    'streak:3': [
      "Three quiet moves running. The silence is deafening.",
      "Triple quiet streak. Gotham's subtlest weapon on repeat.",
      "Three in a row. No checks needed. No captures needed.",
    ],
    'streak:5': [
      "Five quiet moves straight. The silent hero of Gotham.",
      "Five in a row. Not a single check or capture. All wins.",
      "Five consecutive quiet devastations. Why so serious? Because it works.",
    ],
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
    first: [
      "First zwischenzug. The in-between move nobody expected.",
      "Intermezzo section opens with a plot twist.",
      "Opening with a detour that wins the highway. Classic.",
    ],
    last: [
      "Final zwischenzug. Section plot-twisted to completion.",
      "Last in-between move. Every script got rewritten.",
      "Zwischenzug section done. The detour game is yours.",
    ],
    recovery: [
      "Expected the recapture first. The intermezzo was the play. Got it on retry.",
      "The zwischenzug hid between the obvious moves. Found it.",
      "In-between move needed a second pass. Gotham rewards patience.",
    ],
    'streak:3': [
      "Three zwischenzugs running. Every script gets a rewrite.",
      "Triple intermezzo streak. The plot twists keep coming.",
      "Three in a row. Non-linear chess at its best.",
    ],
    'streak:5': [
      "Five zwischenzugs straight. The timeline bends to your will.",
      "Five in a row. Every expected recapture gets a plot twist.",
      "Five consecutive intermezzos. Gotham's finest script doctor.",
    ],
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
    first: [
      "X-ray section starts. First hidden line found.",
      "Opening with see-through vision. Gotham has a new hero.",
      "First x-ray puzzle solved. You see through everything.",
    ],
    last: [
      "Final x-ray attack. Section seen through entirely.",
      "Last hidden line discovered. X-ray mastery confirmed.",
      "X-ray section done. Nothing is hidden from you.",
    ],
    recovery: [
      "The line was blocked. Second look saw right through it.",
      "X-ray vision needed a recalibration. Retry pierced through.",
      "Missed the hidden attack. Second pass found the see-through line.",
    ],
    'streak:3': [
      "Three x-rays running. Seeing through everything.",
      "Triple x-ray streak. Gotham's tactical sonar on full blast.",
      "Three in a row. Transparent defenses everywhere.",
    ],
    'streak:5': [
      "Five x-rays straight. Nothing is opaque to you.",
      "Five in a row. X-ray vision at full power.",
      "Five consecutive see-throughs. Gotham's hero sees all.",
      "Five for five. Every hidden line exposed.",
    ],
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
    first: [
      "Unexpected review opens. First subtle skill confirmed.",
      "Review starts with the element of surprise. Intact.",
      "First review puzzle. Quiet moves and x-rays: still there.",
    ],
    last: [
      "Unexpected review complete. The subtle arsenal is locked.",
      "Last review puzzle. The quiet game never fades.",
      "Block 1 review done. The unexpected remains your advantage.",
    ],
    recovery: [
      "The unexpected review caught something. Polished on retry.",
      "Subtle skills needed a refresh. Review delivered.",
      "One retry in the unexpected review. The edge is sharper.",
    ],
    'streak:3': [
      "Three unexpected reviews running. Subtlety confirmed.",
      "Triple streak on the subtle review. Everything unexpected still works.",
      "Three in a row. The element of surprise doesn't fade.",
    ],
    'streak:5': [
      "Five unexpected reviews straight. The subtle game is permanent.",
      "Five in a row. Gotham's unexpected playbook: bulletproof.",
      "Five consecutive reviews. The unexpected arsenal never dulls.",
    ],
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
    first: [
      "Deep sacrifice section starts. First bold investment paid off.",
      "Opening with a sacrifice so deep the engine pauses.",
      "First deep sacrifice solved. It's about sending a message.",
    ],
    last: [
      "Final deep sacrifice. Section: invested and returned.",
      "Last bold move of the chapter. Every message sent.",
      "Deep sacrifice section done. Material is just a suggestion.",
    ],
    recovery: [
      "The deep sacrifice needed deeper trust. Found it on retry.",
      "Gotham rewards the bold. Second try was bolder.",
      "The sacrifice line hid the return. Retry found the profit.",
    ],
    'streak:3': [
      "Three deep sacrifices running. Every gift has strings attached.",
      "Triple sacrifice streak. The returns keep rolling in.",
      "Three in a row. Gotham's boldest tactician.",
    ],
    'streak:5': [
      "Five deep sacrifices straight. Material is just a number to you.",
      "Five in a row. Every sacrifice deeper, every return larger.",
      "Five consecutive deep sacrifices. Gotham rewards the brave.",
      "Five for five. Not reckless. Calculated. Every time.",
    ],
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
    first: [
      "Complex combos begin. First long sequence: calculated.",
      "Opening the deep chapter. First combination architected.",
      "First complex combo solved. The vision runs deep.",
    ],
    last: [
      "Final complex combination. Section: architecturally complete.",
      "Last long sequence. Every branch calculated.",
      "Complex combination section done. The depth is permanent.",
    ],
    recovery: [
      "The combination branched. Found the right path on retry.",
      "Complex combos need precision. Second attempt had it.",
      "Missed a move in the sequence. Recalculated on retry.",
    ],
    'streak:3': [
      "Three complex combos running. The architecture flows.",
      "Triple combination streak. Deep and clean.",
      "Three in a row. Gotham's longest night has nothing on your calculation.",
    ],
    'streak:5': [
      "Five complex combinations straight. Every sequence mapped.",
      "Five in a row. Deep calculation at will.",
      "Five consecutive complex combos. Gotham's architect of destruction.",
    ],
    general: [
      "The combination that took vision, nerve, and precision.",
      "Complex? For them. Clean? For you.",
      "Gotham's longest night has nothing on this calculation.",
      "The deeper you see, the harder they fall.",
      "That wasn't a combination. That was architecture.",
      "Multi-move mastery on full display.",
      "The whole sequence visualized. The whole game decided.",
      "When the line is long, you follow it to the end.",
      "Calculated from the opening move to the final check.",
      "Deep combination, clean conclusion.",
    ],
    mateIn4: [
      "Mate in 4. Every move accounted for.",
      "The four-move sequence unfolds like a plan.",
      "Long checkmate. Short celebration.",
    ],
    mateIn5: [
      "Mate in 5. The long arm of justice reaches.",
      "See five, execute five, win.",
      "The deep checkmate lands with authority.",
    ],
    'moves:4': [
      "Four moves. Four steps closer to Gotham's finest hour.",
      "Calculated four deep. Executed four perfect.",
      "They had four moves to survive. They needed five.",
      "Four moves deep and still calculating. Impressive.",
    ],
    'moves:5': [
      "Five moves of pure, unstoppable calculation.",
      "Deep calculation, clean finish. Five moves of precision.",
      "From here to checkmate: five moves, zero doubt.",
    ],
  },

  // Section 7: Attraction & Lure
  '6.7': {
    first: [
      "Attraction section opens. First lure: irresistible.",
      "Opening with a trap that worked. Come into the light.",
      "First lure set and sprung. The section begins.",
    ],
    last: [
      "Final lure of the section. Every trap sprung perfectly.",
      "Last attraction puzzle. Gotham sends its regards.",
      "Attraction section done. They always follow the bait.",
      "Section complete. The lure game is yours.",
    ],
    recovery: [
      "The lure was subtle. Found the bait on the second cast.",
      "Missed the attraction. Retry set the perfect trap.",
      "The trap needed a different approach. Second try worked.",
    ],
    'streak:3': [
      "Three lures set, three traps sprung. Gotham's finest.",
      "Triple attraction streak. Irresistible on repeat.",
      "Three in a row. They keep walking into the light.",
    ],
    'streak:5': [
      "Five attractions straight. The bait game is flawless.",
      "Five in a row. Every lure, every trap, every win.",
      "Five consecutive attractions. Step right up. Into the trap.",
    ],
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
    first: [
      "Calculated justice review opens. First deep solve confirmed.",
      "Review starts with a sacrifice. The bold skills are intact.",
      "First review puzzle. Deep play confirmed.",
    ],
    last: [
      "Calculated justice review done. Block 2 mastery confirmed.",
      "Last review puzzle. Gotham's deep game is proven.",
      "Review complete. Sacrifices, combos, lures: all accounted for.",
    ],
    recovery: [
      "The review found something to sharpen. Second try honed it.",
      "Deep play review needed a retry. Gotham is patient.",
      "Justice review caught a crack. Sealed on retry.",
    ],
    'streak:3': [
      "Three justice reviews running. Deep skills confirmed.",
      "Triple review streak. The calculated game is permanent.",
      "Three in a row. Block 2 review: flawless.",
    ],
    'streak:5': [
      "Five justice reviews straight. The hero Gotham deserves.",
      "Five in a row. Block 2 review is a victory march.",
      "Five consecutive reviews. Calculated justice: certified.",
    ],
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
    first: [
      "Kingside assault begins. First attack launched.",
      "Opening with a full-scale kingside strike. Gotham burns bright.",
      "First kingside puzzle. The pressure hits immediately.",
    ],
    last: [
      "Final kingside assault. Section stormed and conquered.",
      "Last attack on the king's fortress. Section: breached.",
      "Kingside section done. Some positions just crumbled.",
    ],
    recovery: [
      "The kingside attack missed a line. Retry found the breach.",
      "Assault plan needed adjustment. Second attack plan worked.",
      "The fortress had a hidden wall. Second try found the crack.",
    ],
    'streak:3': [
      "Three kingside assaults running. The walls keep falling.",
      "Triple assault streak. The kingside is burning.",
      "Three in a row. Storm after storm after storm.",
    ],
    'streak:5': [
      "Five kingside assaults straight. Some boards just want to burn.",
      "Five in a row. Every king's fortress crumbles.",
      "Five consecutive kingside storms. Relentless aggression.",
      "Five for five. Gotham's board is always on fire.",
    ],
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
    first: [
      "Defense-breaking section opens. First chain link removed.",
      "Opening by dismantling their defense. Gotham's wrecking ball.",
      "First defensive structure broken. The chain collapses.",
    ],
    last: [
      "Final defense broken. Section dismantled completely.",
      "Last chain link removed. Every defense crumbled.",
      "Breaking the defense: section complete. Nothing held.",
    ],
    recovery: [
      "The defense was sturdier than expected. Retry found the flaw.",
      "Missed the weak link. Second try broke the chain.",
      "Defensive break needed a second approach. Wrecked it.",
    ],
    'streak:3': [
      "Three defenses broken running. The wrecking ball swings.",
      "Triple break streak. Every defense has a crack.",
      "Three in a row. Chains breaking everywhere.",
    ],
    'streak:5': [
      "Five defenses broken straight. Nothing holds against you.",
      "Five in a row. Every wall, every chain, every defense: broken.",
      "Five consecutive breaks. Gotham's finest wrecking crew.",
    ],
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
    first: [
      "Complex endgames begin. First technical position: converted.",
      "Opening the endgame chapter. Smoother than the Batmobile.",
      "First complex ending handled. The discipline is there.",
    ],
    last: [
      "Final complex endgame. Section technique: legendary.",
      "Last endgame of the chapter. Every position converted.",
      "Complex endgames done. The cape and cowl of chess mastery.",
    ],
    recovery: [
      "The complex ending needed a second approach. Found the path.",
      "Endgame technique needed recalibrating. Retry was clean.",
      "Missed the conversion. Second try found the Gotham way.",
      "Complex endgame stumbled. Then technique took over.",
    ],
    'streak:3': [
      "Three complex endgames running. Technique under pressure.",
      "Triple endgame streak. The discipline holds.",
      "Three in a row. Complex endings are just endings to you.",
    ],
    'streak:5': [
      "Five complex endgames straight. Gotham's finest technique.",
      "Five in a row. Every complex ending converted. Legendary.",
      "Five consecutive conversions. The endgame is where legends are made.",
    ],
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
    first: [
      "Controlled chaos review opens. First aggressive solve confirmed.",
      "Review starts with chaos. The aggression is intact.",
      "First review puzzle. Kingside attacks and endgames: both there.",
    ],
    last: [
      "Controlled chaos review complete. Block 3 confirmed.",
      "Last review puzzle. The chaos was never random.",
      "Review done. Attack, break, convert: the full arc confirmed.",
    ],
    recovery: [
      "The chaos review found something. Controlled it on retry.",
      "Aggressive play needed a touch-up in review. Sharpened.",
      "One chaotic retry. Now it's controlled.",
    ],
    'streak:3': [
      "Three chaos reviews running. Controlled and confirmed.",
      "Triple streak on the chaos review. Aggressive and disciplined.",
      "Three in a row. The chaos is always calculated.",
    ],
    'streak:5': [
      "Five chaos reviews straight. Controlled chaos mastery.",
      "Five in a row. Block 3 review: pure excellence.",
      "Five consecutive chaos reviews. The board erupts. You control it.",
    ],
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
    first: [
      "Level 6 review starts. First full-arsenal puzzle solved.",
      "Gotham's review opens. First solve: serious.",
      "Full review begins. Why so serious? Because Level 6 demands it.",
    ],
    last: [
      "Level 6 review complete. Gotham's full tactical package confirmed.",
      "Last review puzzle. Ready for the final.",
      "Full review done. The hero the chessboard deserves.",
    ],
    recovery: [
      "Full review caught something. Gotham doesn't leave gaps.",
      "Level 6 review needed a retry. The signal was answered.",
      "One fix in the full review. The toolkit is polished.",
    ],
    'streak:3': [
      "Three Level 6 reviews running. All four blocks confirmed.",
      "Triple streak on the full review. From quiet to chaotic: mastered.",
      "Three in a row across all Level 6 themes. Gotham approves.",
    ],
    'streak:5': [
      "Five Level 6 reviews straight. The complete hero.",
      "Five in a row. Gotham's full review is a parade.",
      "Five consecutive wins across all Level 6 skills. Why so serious? Because you're that good.",
    ],
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
    first: [
      "Level 6 final begins. First puzzle: Gotham's opening act.",
      "The finale starts. First solve sets the stage.",
      "Opening the Level 6 final. The signal is lit. You answer.",
    ],
    last: [
      "Level 6 Final: Gotham is yours. The night is over. Dawn arrived.",
      "Last puzzle of Level 6. The hero graduated.",
      "The signal dims. Level 6: conquered.",
    ],
    recovery: [
      "The Level 6 final tested you. Gotham tests everyone. You passed.",
      "One retry in the finale. The night was dark, the dawn still came.",
      "Final exam stumble. Then a heroic recovery.",
    ],
    'streak:3': [
      "Three running in the Level 6 final. Gotham's finest moment.",
      "Triple streak in the finale. The hero the board deserves.",
      "Three in a row. The Level 6 final bows to you.",
    ],
    'streak:5': [
      "Five straight in the Level 6 final. Flawless graduation from Gotham.",
      "Five in a row. Not the hero they expected. The hero they got.",
      "Five consecutive solves in the finale. Level 6: complete. Dawn arrived.",
    ],
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
    first: [
      "Level 7 begins at the back rank. First fortress breached.",
      "Opening with a back rank strike. The Deeping Wall falls.",
      "First puzzle: their back rank was a prison. You found the key.",
    ],
    last: [
      "Final back rank. Section sealed tighter than Isengard's gates.",
      "Last back rank puzzle. Every fortress was a trap in disguise.",
      "Back rank section done. Rohan rides on.",
    ],
    recovery: [
      "The back rank line hid. Second try found the breach.",
      "Missed the prison door. Retry opened it.",
      "Back rank puzzles are subtle. Second attempt delivered.",
      "The wall looked solid. Looked again and found the crack.",
    ],
    'streak:3': [
      "Three back rank solves running. Every fortress falls.",
      "Triple back rank streak. No wall is safe.",
      "Three in a row. The back rank is your specialty now.",
    ],
    'streak:5': [
      "Five back rank solves straight. Every prison opened.",
      "Five in a row. Back rank mastery: the Helm's Deep of tactics.",
      "Five consecutive back rank strikes. No fortification holds.",
    ],
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
      "The final rank: a fortress for some, a trap for others.",
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
    first: [
      "Promotion race starts. First pawn crosses enemy lines.",
      "Opening the march. First promotion secured.",
      "First pawn reaches the throne. Like the Ents reaching Isengard.",
    ],
    last: [
      "Final promotion race won. Section marched to completion.",
      "Last pawn promoted. Every march ended in coronation.",
      "Promotion section done. The eighth rank belongs to Rohan.",
    ],
    recovery: [
      "The race was close. Won it on the second attempt.",
      "Promotion path was blocked. Found the detour on retry.",
      "The march stumbled. Then it resumed. Unstoppable.",
    ],
    'streak:3': [
      "Three promotions running. The march of the pawns continues.",
      "Triple promotion streak. Every pawn finds the eighth rank.",
      "Three in a row. Slow, steady, unstoppable.",
    ],
    'streak:5': [
      "Five promotions straight. The pawn army is relentless.",
      "Five in a row. Every march ends in a crown.",
      "Five consecutive promotions. The Ents march. The pawns march. Victory.",
    ],
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
    first: [
      "Trapped piece section opens. First net deployed.",
      "Opening with a trap. Like Gollum in the forbidden pools.",
      "First piece cornered and collected. The hunt begins.",
    ],
    last: [
      "Final trapped piece. Section cornered and sealed.",
      "Last piece caught. Every adventurer became a prisoner.",
      "Trapped pieces done. No piece wanders into your territory safely.",
      "Section complete. Saruman would be proud of these cages.",
    ],
    recovery: [
      "The trap was hidden. Found the net on the second try.",
      "Missed the corner. Retry sealed every exit.",
      "The piece almost escaped. Almost only counts in horseshoes.",
    ],
    'streak:3': [
      "Three traps running. Every piece walks into the net.",
      "Triple trap streak. Fangorn catches everything.",
      "Three in a row. No squares, no hope, no escape.",
    ],
    'streak:5': [
      "Five trapped pieces straight. Professional warden status.",
      "Five in a row. Every adventurer becomes a prisoner.",
      "Five consecutive traps. Isengard's finest jailkeeper.",
    ],
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
    first: [
      "Block 1 review opens. First fortress skill confirmed.",
      "Review starts with a hit. Back ranks and traps: intact.",
      "First review puzzle. The Helm's Deep skills hold.",
    ],
    last: [
      "Block 1 review complete. Fortress skills: reinforced.",
      "Last review puzzle. Every Block 1 weapon confirmed.",
      "Review done. The wall holds. The pawns march. The traps spring.",
    ],
    recovery: [
      "Review found a crack in the wall. Patched on retry.",
      "Fortress skills needed a touch-up. Review delivered.",
      "One retry in the arsenal review. The Deeping Wall stands.",
    ],
    'streak:3': [
      "Three arsenal reviews running. Every weapon ready.",
      "Triple streak on Block 1 review. The fortress holds.",
      "Three in a row. Back ranks, promotions, traps: all confirmed.",
    ],
    'streak:5': [
      "Five arsenal reviews straight. Block 1 is bulletproof.",
      "Five in a row. The unexpected arsenal never dulls.",
      "Five consecutive reviews. Rohan's toolkit: battle-tested.",
    ],
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
    first: [
      "Deeper sacrifices begin. First bold investment with Ent-like patience.",
      "Opening with a sacrifice deeper than Fangorn's roots.",
      "First deep sacrifice solved. The initiative was worth the material.",
    ],
    last: [
      "Final deep sacrifice. Section planted and bloomed.",
      "Last bold investment. Every sacrifice bore fruit.",
      "Deep sacrifice section done. Not hasty. Calculated.",
    ],
    recovery: [
      "The sacrifice ran deep. Found the return on retry.",
      "Deeper trust needed. Second attempt believed in the calculation.",
      "The Ents don't rush. Neither did your second attempt.",
    ],
    'streak:3': [
      "Three deep sacrifices running. Every investment compounds.",
      "Triple sacrifice streak. Patience and precision combined.",
      "Three in a row. Deep as Fangorn. Calculated as Treebeard.",
    ],
    'streak:5': [
      "Five deep sacrifices straight. Bold and brilliant on repeat.",
      "Five in a row. The sacrifice game grows like old Fangorn.",
      "Five consecutive deep investments. The march of the Ents: calculated.",
    ],
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
    first: [
      "Long combo section starts. First extended sequence solved.",
      "Opening with a combination longer than the road to Mordor.",
      "First long combination. Every move forced. Every move found.",
    ],
    last: [
      "Final long combination. Section calculated to the end.",
      "Last extended sequence. Every branch explored.",
      "Long combo section done. See deep, play deep, win deep.",
    ],
    recovery: [
      "The long line branched. Found the right path on retry.",
      "Combination stretched further than expected. Retry reached the end.",
      "Missed a move deep in the sequence. Second try found it.",
    ],
    'streak:3': [
      "Three long combos running. The depth just flows.",
      "Triple long-combo streak. Patient, powerful, perfect.",
      "Three in a row. Every sequence lands.",
    ],
    'streak:5': [
      "Five long combinations straight. The calculation never quits.",
      "Five in a row. Extended sequences solved on demand.",
      "Five consecutive long combos. The Ents would nod slowly in approval.",
    ],
    general: [
      "Long calculation. Clean execution. Checkmate.",
      "The combination stretched further than the road to Mordor.",
      "Every move forced. Every response predicted. Every outcome: yours.",
      "See deep. Play deep. Win deep.",
      "That sequence took patience, vision, and nerve.",
      "Long combinations separate the tacticians from the legends.",
      "The whole line visualized before a single piece moved.",
      "From the first sacrifice to the final check: perfection.",
      "They ran out of defensive moves before you ran out of attacking ones.",
      "The deep combination lands with authority.",
    ],
    mateIn4: [
      "Mate in 4. Every branch calculated like an Entmoot debate.",
      "The four-move sequence lands like a falling tree.",
      "Calculated to the finish. Never in doubt.",
    ],
    mateIn5: [
      "Mate in 5. The long march ends in checkmate.",
      "The deep combination: patient, powerful, perfect.",
      "The Ents would be proud of that sequence.",
    ],
    'moves:4': [
      "The Ents are going to Isengard. Four moves at a time.",
      "Four moves, four steps to checkmate. All foreseen.",
      "Calculated four deep. The finish was never in doubt.",
      "They had four chances to survive. None of them worked.",
      "Four precise moves. One devastating outcome.",
    ],
    'moves:5': [
      "Five moves deep and the board bends to your will.",
      "See five, execute five. The Ents would be proud.",
      "Five moves of relentless pressure. Then silence.",
      "From here to checkmate: five moves of pure calculation.",
    ],
  },

  // Section 7: Defensive Resources
  '7.7': {
    first: [
      "Defensive resources begin. First save: Helm's Deep-worthy.",
      "Opening with a defensive find. The line holds.",
      "First resource discovered. Not today.",
    ],
    last: [
      "Final defensive resource. Section saved and sealed.",
      "Last saving move. The Riders of Rohan arrived every time.",
      "Defensive section done. Every position had a resource. You found it.",
    ],
    recovery: [
      "The save was hidden. Second try held the line.",
      "Defensive resource needed a deeper search. Retry found it.",
      "Helm's Deep doesn't fall on the first attempt. Neither do you.",
    ],
    'streak:3': [
      "Three defensive saves running. The fortress never falls.",
      "Triple save streak. Hold the line on repeat.",
      "Three in a row. Every attack has an answer.",
    ],
    'streak:5': [
      "Five defensive saves straight. Rohan's resilience personified.",
      "Five in a row. Nothing gets through the wall.",
      "Five consecutive saves. The Deeping Wall stands eternal.",
      "Five for five. The Riders always arrive.",
    ],
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
    first: [
      "Calculated march review opens. First deep skill confirmed.",
      "Review starts with a sacrifice. The patience holds.",
      "First review puzzle. Block 2 skills: intact.",
    ],
    last: [
      "Calculated march review done. Every deep skill confirmed.",
      "Last review puzzle. Sacrifices, combos, defense: all proven.",
      "Review complete. The march was long. The march was flawless.",
    ],
    recovery: [
      "The march review found a stumble. Fixed on retry.",
      "Deep skills needed a refresh in review. Done.",
      "One retry in the calculated march. The Ents don't rush.",
    ],
    'streak:3': [
      "Three march reviews running. Deep calculation holds.",
      "Triple streak on Block 2 review. The roots run deep.",
      "Three in a row. Sacrifices, combos, saves: confirmed.",
    ],
    'streak:5': [
      "Five march reviews straight. The Ents would approve.",
      "Five in a row. Block 2 review: unstoppable march.",
      "Five consecutive reviews. Deep as Fangorn's roots.",
    ],
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
    first: [
      "Pin mastery begins. First piece frozen like Wormtongue.",
      "Opening with a pin. The invisible thread holds.",
      "First pin of the section. Not going anywhere.",
    ],
    last: [
      "Final pin. Section frozen shut.",
      "Last pin applied. Every piece was held hostage.",
      "Pin mastery section done. Stuck like Saruman in Orthanc.",
    ],
    recovery: [
      "The pin line hid. Second try found the thread.",
      "Missed the geometry. Retry caught the line.",
      "Pin needed a second look. Now the piece is frozen.",
    ],
    'streak:3': [
      "Three pins running. Everything's stuck in place.",
      "Triple pin streak. The geometry is automatic.",
      "Three in a row. Pinned and piled on repeatedly.",
    ],
    'streak:5': [
      "Five pins straight. Nothing moves on this board.",
      "Five in a row. Every line finds a pin.",
      "Five consecutive pins. The Two Towers of tactics: pin mastery.",
      "Five for five. The invisible threads hold everything.",
    ],
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
      "Absolute pin. Absolute advantage.",
      "Pinned and piled on. The classic combination.",
      "The pin is the thread. The win is the tapestry.",
      "Stuck in place like Saruman in Orthanc. Not by choice.",
      "The line holds. The piece stays. The win comes.",
    ],
    'pin:B': [
      "The bishop sees right through to the royalty behind.",
      "Diagonal pin locks down the target. Classic bishop work.",
      "The bishop's line of sight is a prison cell.",
    ],
    'pin:R': [
      "The rook's file pins the piece to its fate.",
      "Pinned along the rank. The rook won't let go.",
      "Rook pin deployed. Nowhere to move along the file.",
    ],
  },

  // Section 10: Skewer & Fork Mastery
  '7.10': {
    first: [
      "Skewer and fork mastery starts. First double attack landed.",
      "Opening with a dual threat. Two targets, one move.",
      "First skewer or fork of the section. Material incoming.",
    ],
    last: [
      "Final skewer or fork. Section plundered.",
      "Last dual threat. Every alignment exploited.",
      "Skewer and fork section done. The algebra of winning.",
    ],
    recovery: [
      "The double attack hid. Second try found both targets.",
      "Missed the alignment. Retry spotted the line.",
      "Skewer or fork needed another look. Found it.",
    ],
    'streak:3': [
      "Three dual attacks running. Targets falling everywhere.",
      "Triple streak on skewers and forks. The spoils accumulate.",
      "Three in a row. Double threats on demand.",
    ],
    'streak:5': [
      "Five dual attacks straight. Professional plunderer.",
      "Five in a row. Every alignment becomes profit.",
      "Five consecutive skewers and forks. The Riders take everything.",
    ],
    general: [
      "Two targets, one move. The algebra of winning.",
      "Skewered or forked? Either way, they lose a piece.",
      "The dual threat strikes again.",
      "Line up the targets. Collect the spoils.",
      "Their pieces stood on the wrong squares. Your pieces noticed.",
      "Double attacks are the bread and butter of tactical chess.",
      "Two threats with one move. The efficiency is beautiful.",
      "When pieces align, profits follow.",
      "The double attack finds two targets at once.",
      "Fork the valuables. Skewer the royals. Win the game.",
    ],
    skewer: [
      "Skewered clean through, like a lance at Helm's Deep.",
      "Through and through. Thanks for the material.",
      "The reverse pin delivers again.",
      "Big piece in front, small piece behind. The skewer writes itself.",
      "Pierced both targets. Only one survived.",
      "Step aside, leave a friend behind.",
    ],
    fork: [
      "Forked like a crossroads in Rohan. Both paths lead to loss.",
      "Double attack deployed. Pick which piece to save.",
      "The fork is elegant. The result is brutal.",
      "Two targets, zero solutions for the defender.",
      "Fork executed. Material advantage: secured.",
      "Both pieces threatened. Only one survives.",
    ],
    'fork:N': [
      "The knight lands and two pieces tremble.",
      "The horse rides to Rohan. And takes everything.",
      "L-shaped fork finds two targets. Classic horsey chaos.",
    ],
  },

  // Section 11: Endgame Mastery
  '7.11': {
    first: [
      "Endgame mastery starts. First position: converted with precision.",
      "Opening the endgame chapter. Technique sharper than Rohan's blade.",
      "First Level 7 endgame handled. The discipline is there.",
    ],
    last: [
      "Final endgame converted. Section technique: proven.",
      "Last endgame of the chapter. From chaos to clarity.",
      "Endgame mastery section done. The crown jewel of chess skill.",
    ],
    recovery: [
      "The endgame needed a second approach. Patience rewarded.",
      "Conversion stumbled. Then Treebeard's patience kicked in.",
      "Endgame technique recalibrated on retry. Clean conversion.",
    ],
    'streak:3': [
      "Three endgames running. Technique under pressure.",
      "Triple endgame streak. The discipline never wavers.",
      "Three in a row. Endgame mastery is becoming natural.",
    ],
    'streak:5': [
      "Five endgames straight. Fewer pieces, higher stakes, same excellence.",
      "Five in a row. The final phase is your domain.",
      "Five consecutive endgame conversions. The patience of Treebeard.",
    ],
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
    first: [
      "Full stew review opens. First classic tactic confirmed.",
      "Review starts with a pin or a fork. Block 3 skills intact.",
      "First review puzzle. The stew ingredients are all there.",
    ],
    last: [
      "Full stew review done. Every classic tactic elevated.",
      "Last review puzzle. Pins, forks, endgames: all yours.",
      "Review complete. The stew is ready. Every ingredient perfect.",
    ],
    recovery: [
      "The stew needed more seasoning. Retry added it.",
      "Block 3 review found a gap. Filled on the second try.",
      "One ingredient needed a refresh. Now the stew is complete.",
    ],
    'streak:3': [
      "Three stew reviews running. Every tactic holds.",
      "Triple streak on the full stew. Classic tactics: elevated.",
      "Three in a row. Pins, forks, endgames flowing together.",
    ],
    'streak:5': [
      "Five stew reviews straight. The full recipe perfected.",
      "Five in a row. Block 3 review: every ingredient accounted for.",
      "Five consecutive reviews. The stew is ready, Precious.",
    ],
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
    first: [
      "Level 7 review starts. First full-level puzzle solved.",
      "The horn sounds. First review solve: answered the call.",
      "Full Level 7 review begins. All blocks present.",
    ],
    last: [
      "Level 7 review complete. From Helm's Deep to the march: confirmed.",
      "Last review puzzle. Ready for the final horn blast.",
      "Full review done. The complete warrior stands ready.",
    ],
    recovery: [
      "Level 7 review caught something. Fixed like a crack in the Deeping Wall.",
      "Full review needed a patch. The wall holds now.",
      "One retry in the comprehensive review. There is always hope.",
    ],
    'streak:3': [
      "Three Level 7 reviews running. All four blocks firing.",
      "Triple streak on full review. The complete warrior's arsenal.",
      "Three in a row. The horn sounds and all skills answer.",
    ],
    'streak:5': [
      "Five Level 7 reviews straight. The horn of Helm Hammerhand echoes.",
      "Five in a row. Full Level 7 review: total mastery.",
      "Five consecutive wins. Every theme, every block, every win.",
    ],
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
    first: [
      "Level 7 final begins. First puzzle: hope against the odds.",
      "The final horn blast. First solve: Rohan answers.",
      "Opening the Level 7 finale. The towers stand. You stand taller.",
    ],
    last: [
      "Level 7 Final: the towers fell. You still stand.",
      "Last puzzle of Level 7. There was always hope. You proved it.",
      "The horn sounds for the last time. Level 7: graduated.",
    ],
    recovery: [
      "The Level 7 final tested your resilience. Rohan endures.",
      "One stumble in the final. Then the Riders arrived.",
      "Final exam retry. Helm's Deep held. So did you.",
    ],
    'streak:3': [
      "Three running in the Level 7 final. Rohan rides strong.",
      "Triple streak in the finale. The horn echoes with each win.",
      "Three in a row. The Level 7 final bows to the warrior.",
    ],
    'streak:5': [
      "Five straight in the Level 7 final. Not all who wander are lost.",
      "Five in a row. The Ents would nod in slow approval.",
      "Five consecutive solves. Level 7: where hope meets calculation.",
    ],
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
    first: [
      "Level 8 opens. First puzzle had its own soundtrack.",
      "The Tarantino section begins. First solve: smooth.",
      "Opening with a Royale with Checkmate. Perfect start.",
      "First puzzle, maximum cool. The scene is set.",
    ],
    last: [
      "Final zugzwang served. Section: wrapped with style.",
      "Last puzzle. Cool, calm, done. Credits approaching.",
      "Zugzwang section complete. Every move they made was wrong.",
    ],
    recovery: [
      "Missed the scene. Replayed it. Nailed the take.",
      "Second take was cleaner. That's how films get made.",
      "The move had its own subplot. Found it on retry.",
    ],
    'streak:3': [
      "Three in a row. The jukebox keeps playing.",
      "Triple streak. Smooth like a diner-booth conversation.",
      "Three straight. Style points accumulating.",
    ],
    'streak:5': [
      "Five in a row. The whole scene is yours.",
      "Five straight. Cooler than a jukebox in a diner.",
      "Five consecutive solves. That's not a streak, that's a montage.",
      "Five for five. Somebody cue the soundtrack.",
    ],
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
    first: [
      "Quiet moves section starts. First one walked in and sat down.",
      "Opening with silence. The most dangerous kind.",
      "First quiet move found. No check, no capture, all swagger.",
    ],
    last: [
      "Final quiet move. Section whispered to completion.",
      "Last silent move. The quietest section is done.",
      "Quiet moves wrapped. Sometimes the best line has no dialogue.",
    ],
    recovery: [
      "Looked for fireworks. The answer was a whisper. Got it on retry.",
      "Quiet moves hide in plain sight. Second look heard it.",
      "Missed the calm. Found the storm on the second take.",
    ],
    'streak:3': [
      "Three quiet moves running. The bass line owns the room.",
      "Triple quiet streak. Understated. Lethal.",
      "Three in a row. No checks, no captures, no problems.",
    ],
    'streak:5': [
      "Five quiet moves straight. The silent film of chess mastery.",
      "Five in a row. Not a single exclamation mark needed.",
      "Five consecutive quiet moves. Low-key brilliance on repeat.",
    ],
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
    first: [
      "Intermezzo section opens. First plot twist deployed.",
      "Opening with a non-linear move. Tarantino approves.",
      "First intermezzo. They expected Scene 2. You jumped to Scene 5.",
    ],
    last: [
      "Final intermezzo. Section reshuffled to completion.",
      "Last plot twist landed. Every timeline bent your way.",
      "Intermezzo section done. Non-linear chess at its finest.",
    ],
    recovery: [
      "Expected the obvious. The intermezzo was the play. Got it on retry.",
      "Non-linear thinking needed a second take. Nailed it.",
      "The plot twist hid between the obvious moves. Found it.",
    ],
    'streak:3': [
      "Three intermezzos running. The timeline is yours to shuffle.",
      "Triple plot twist streak. Every script gets rewritten.",
      "Three in a row. Non-linear and unstoppable.",
      "Three straight intermezzos. They never know which scene is next.",
    ],
    'streak:5': [
      "Five intermezzos straight. The whole movie plays out of order.",
      "Five in a row. Every expected recapture becomes a plot twist.",
      "Five consecutive intermezzos. Tarantino-level timeline control.",
    ],
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
    first: [
      "Palate cleanser review opens. First refined solve confirmed.",
      "Review starts with style. The appetizer skills are intact.",
      "First review puzzle. Zugzwang, quiet moves, intermezzos: all there.",
    ],
    last: [
      "Palate cleanser review done. Block 1: devoured with taste.",
      "Last review puzzle. The refined palate is confirmed.",
      "Review complete. Main course incoming.",
    ],
    recovery: [
      "The palate review found a rough edge. Smoothed on retry.",
      "Refined skills needed a polish. Review delivered.",
      "One retry in the appetizer review. The taste is sharper now.",
    ],
    'streak:3': [
      "Three palate reviews running. The refined skills hold.",
      "Triple streak on the Royale with Cheese block. Impeccable taste.",
      "Three in a row. Sophisticated, precise, confident.",
    ],
    'streak:5': [
      "Five palate reviews straight. The appetizer was flawless.",
      "Five in a row. Block 1 review: Michelin-star chess.",
      "Five consecutive refined reviews. The palate is impeccable.",
    ],
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
    first: [
      "Sacrifice section opens. First investment on the table.",
      "Opening with a setup. They took the bait. You took the game.",
      "First sacrifice solved. Cool under pressure from the start.",
    ],
    last: [
      "Final sacrifice. Section: invested and collected.",
      "Last piece put on the table. Every deal closed.",
      "Sacrifice section done. The briefcase glows for a reason.",
    ],
    recovery: [
      "The sacrifice line hid. Second take found the payoff.",
      "The investment needed recalculating. Retry returned tenfold.",
      "Missed the setup. The follow-through was flawless on retry.",
    ],
    'streak:3': [
      "Three sacrifices running. Every gift has a plan behind it.",
      "Triple sacrifice streak. Cool, calculated, collected.",
      "Three in a row. Every piece deployed, not lost.",
    ],
    'streak:5': [
      "Five sacrifices straight. The briefcase keeps getting heavier.",
      "Five in a row. Material goes out, wins come in.",
      "Five consecutive sacrifices. That wasn't generosity. That was a setup.",
      "Five for five. The investment strategy never fails.",
    ],
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
    first: [
      "Long mates section starts. First deep sequence choreographed.",
      "Opening with a long mate. You knew the ending before the first move.",
      "First long checkmate. The whole movie, visualized.",
    ],
    last: [
      "Final long mate. Section: directed and wrapped.",
      "Last deep checkmate. Every act played out perfectly.",
      "Long mates done. Move by move. Beat by beat.",
    ],
    recovery: [
      "The sequence branched. Found the right scene on retry.",
      "Long mate needed a reshoot. Second take was flawless.",
      "Missed a beat in the choreography. Retry hit every note.",
    ],
    'streak:3': [
      "Three long mates running. The choreography flows.",
      "Triple deep mate streak. Every sequence lands.",
      "Three in a row. The long game is YOUR game.",
    ],
    'streak:5': [
      "Five long mates straight. Deep sight, clean execution.",
      "Five in a row. The whole line played out exactly as scripted.",
      "Five consecutive deep mates. That's not calculation. That's choreography.",
    ],
    general: [
      "You saw the whole movie before the first scene played.",
      "That wasn't calculation. That was choreography.",
      "You didn't just find the move. You KNEW the move.",
      "Long combination, short result: checkmate.",
      "The long game. The patient game. YOUR game.",
      "They thought they had time. You'd already written the ending.",
      "That sequence played out like a scene you'd rehearsed a hundred times.",
      "Move by move. Beat by beat. Check by checkmate.",
      "Deep sight, clean execution. That's the formula.",
      "The whole line played out exactly as calculated.",
    ],
    mateIn5: [
      "Mate in five. The whole sequence, visualized and executed.",
      "The deep combination: scripted, directed, and wrapped.",
      "Long-range checkmate. Every move essential. No filler.",
    ],
    'moves:5': [
      "Five moves deep. Five moves perfect.",
      "Five moves from now, it's over. And you knew from move one.",
      "From opening move to final check: five acts of pure precision.",
      "Five moves. One outcome. Zero doubt.",
      "Seeing five moves ahead is talent. Executing all five is mastery.",
    ],
  },

  // Section 7: X-Ray & Interference
  '8.7': {
    first: [
      "X-ray and interference section starts. First line cleared.",
      "Opening with see-through vision. The clutter disappears.",
      "First x-ray or interference. You see the board differently.",
    ],
    last: [
      "Final x-ray or interference. Section seen through entirely.",
      "Last line cleared. Every communication cut.",
      "X-ray and interference done. You see through everything.",
    ],
    recovery: [
      "The line was cluttered. Second look cut through the noise.",
      "Interference needed a second approach. Communication severed on retry.",
      "Missed the x-ray. Second pass saw right through.",
    ],
    'streak:3': [
      "Three x-rays and interferences running. Every line accounted for.",
      "Triple streak on line play. Through the clutter, to the target.",
      "Three in a row. Lines, diagonals, all clear.",
    ],
    'streak:5': [
      "Five x-rays and interferences straight. Total board transparency.",
      "Five in a row. Every line seen, every communication cut.",
      "Five consecutive line plays. The geometry is a superpower.",
    ],
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
    first: [
      "Full technique review opens. First deep skill confirmed.",
      "Review starts with precision. Block 2 skills: intact.",
      "First review puzzle. Sacrifices, mates, x-rays: all there.",
    ],
    last: [
      "Full technique review done. Zero plot holes.",
      "Last review puzzle. The technique block is certified.",
      "Review complete. From sacrifices to surgical interference: all clean.",
    ],
    recovery: [
      "The technique review found a rough cut. Edited on retry.",
      "Deep skills needed a reshoot. Second take was perfect.",
      "One retry in the technique block. Now it's polished.",
    ],
    'streak:3': [
      "Three technique reviews running. Precision confirmed.",
      "Triple streak on full technique. Cool meets calculated.",
      "Three in a row. The depth of play is confirmed.",
    ],
    'streak:5': [
      "Five technique reviews straight. Would make any director proud.",
      "Five in a row. Block 2 review: zero plot holes.",
      "Five consecutive technique reviews. The Five Point Technique: certified.",
    ],
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
    first: [
      "Deflection and attraction starts. First string pulled.",
      "Opening by redirecting traffic. First piece moved where you wanted.",
      "First push-pull puzzle solved. You're directing the whole board.",
    ],
    last: [
      "Final deflection or attraction. Section puppeted to completion.",
      "Last string pulled. Every piece went where you pointed.",
      "Deflection and attraction done. Traffic director of the board.",
    ],
    recovery: [
      "The pull wasn't obvious. Second try found the strings.",
      "Misdirection needed a second approach. Retry redirected perfectly.",
      "Missed the push. Found the pull on retry.",
    ],
    'streak:3': [
      "Three push-pull solves running. The board moves where you want.",
      "Triple string-pulling streak. Every piece redirected.",
      "Three in a row. Push here, pull there. Win everywhere.",
    ],
    'streak:5': [
      "Five deflections and attractions straight. Master puppeteer.",
      "Five in a row. Like pulling strings. Except the strings are rooks.",
      "Five consecutive misdirections. Professional traffic director.",
      "Five for five. Every defender moved. Every trap sprung.",
    ],
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
    first: [
      "Endgame section opens. First rook and pawn position converted.",
      "The final act begins. First technique puzzle handled.",
      "Opening the endgame with a clean conversion. The last act matters.",
    ],
    last: [
      "Final endgame. Section converted to completion.",
      "Last rook and pawn endgame. The technique closes the movie.",
      "Endgame section done. When the smoke clears, you're standing.",
    ],
    recovery: [
      "The endgame needed a second approach. Found the technique on retry.",
      "Rook and pawn technique stumbled. Second try was textbook.",
      "The final act needed a reshoot. Nailed the take.",
    ],
    'streak:3': [
      "Three endgames running. Technique in the final act.",
      "Triple endgame streak. Every position converted.",
      "Three in a row. The last act is always the most important.",
    ],
    'streak:5': [
      "Five endgames straight. The final act on repeat.",
      "Five in a row. Every endgame technique: flawless.",
      "Five consecutive conversions. Sharper than diner-scene dialogue.",
    ],
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
    first: [
      "Flank attacks section opens. First pressure applied.",
      "Opening with a flank strike. Both sides of the board: dangerous.",
      "First kingside or queenside attack landed. Tension everywhere.",
    ],
    last: [
      "Final flank attack. Section pressured from both sides.",
      "Last attack. Both flanks conquered.",
      "Flank attacks done. Left side, right side, doesn't matter.",
      "Section wrapped. Full-board pressure confirmed.",
    ],
    recovery: [
      "The flank attack needed redirection. Retry found the break.",
      "Missed the breakthrough side. Second try chose correctly.",
      "Both flanks were options. Found the right one on retry.",
    ],
    'streak:3': [
      "Three flank attacks running. Tension on every square.",
      "Triple flank streak. They can only defend one side at a time.",
      "Three in a row. Full-board pressure on demand.",
    ],
    'streak:5': [
      "Five flank attacks straight. Both sides of the board belong to you.",
      "Five in a row. The Mexican standoff of chess: you always win.",
      "Five consecutive flank attacks. Pressure from every direction.",
    ],
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
    first: [
      "Full lineup review opens. First middle-block skill confirmed.",
      "Review starts with a hit. Block 3 skills: intact.",
      "First review puzzle. Deflections, endgames, attacks: all present.",
    ],
    last: [
      "Full lineup review done. Every member accounted for.",
      "Last review puzzle. Block 3: the full lineup, assembled.",
      "Review complete. From misdirection to full-board attacks: confirmed.",
    ],
    recovery: [
      "The lineup review found a gap. Filled on retry.",
      "Block 3 skills needed a touch-up. Review sharpened them.",
      "One retry in the lineup review. The roster is complete now.",
    ],
    'streak:3': [
      "Three lineup reviews running. Every skill accounted for.",
      "Triple streak on the full lineup. Tension and technique confirmed.",
      "Three in a row. The middle block was your showcase.",
    ],
    'streak:5': [
      "Five lineup reviews straight. The full cast: assembled.",
      "Five in a row. Block 3 review: standing ovation.",
      "Five consecutive reviews. Every lineup member performing.",
    ],
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
    first: [
      "Level 8 review starts. First full-level puzzle: solved with swagger.",
      "The review reel opens. First scene: handled.",
      "Full Level 8 review begins. Every chapter represented.",
    ],
    last: [
      "Level 8 review complete. From Royale with Cheese to the Final Chapter.",
      "Last review puzzle. Ready for the finale.",
      "Full review done. Say checkmate again. SAY. CHECKMATE. AGAIN.",
    ],
    recovery: [
      "Full review caught a rough cut. Edited on retry.",
      "The Level 8 review needed a second take. Nailed it.",
      "One reshoot in the full review. The reel is clean now.",
    ],
    'streak:3': [
      "Three Level 8 reviews running. The whole script confirmed.",
      "Triple streak on the full review. Nothing but highlights.",
      "Three in a row across all Level 8 themes. Every chapter passed.",
    ],
    'streak:5': [
      "Five Level 8 reviews straight. The highlight reel plays.",
      "Five in a row. Level 8 review: standing ovation.",
      "Five consecutive wins across all themes. The full Tarantino: reviewed.",
    ],
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
    first: [
      "Level 8 final begins. First puzzle: the opening scene of the finale.",
      "The final chapter opens. First solve: cool under pressure.",
      "Opening the Level 8 finale. That's a bingo.",
    ],
    last: [
      "Level 8 Final: wrapped. Credits rolling. You directed this.",
      "Last puzzle of Level 8. Roll credits. You're still standing.",
      "The briefcase is yours. Don't ask what's inside. Level 8: complete.",
    ],
    recovery: [
      "The Level 8 final tested you. Second take was flawless.",
      "One reshoot in the finale. The ending is still perfect.",
      "Cool under pressure even on the retry. That's the Tarantino way.",
    ],
    'streak:3': [
      "Three running in the Level 8 final. The credits are approaching.",
      "Triple streak in the finale. Making the final exam look stylish.",
      "Three in a row. The final chapter writes itself.",
    ],
    'streak:5': [
      "Five straight in the Level 8 final. Standing ovation.",
      "Five in a row. Tarantino would nod. Slowly. With respect.",
      "Five consecutive solves in the finale. The whole level was a long take. You didn't blink.",
    ],
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

// ═══════════════════════════════════════════════════════════════════════════
// V3 QUIP SYSTEM — getQuip() + supporting infrastructure
// ═══════════════════════════════════════════════════════════════════════════

// ── Theme Mapping Table ──────────────────────────────────────────────────
// Maps Lichess puzzle theme names → quip category keys.
// Meta themes (crushing, short, long, master, etc.) are intentionally excluded.

const THEME_KEY_MAP: Record<string, string> = {
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  discoveredCheck: 'discoveredAttack',
  discoveredAttack: 'discoveredAttack',
  hangingPiece: 'hangingPiece',
  trappedPiece: 'trappedPiece',
  attraction: 'attraction',
  deflection: 'deflection',
  sacrifice: 'sacrifice',
  quietMove: 'quietMove',
  backRankMate: 'backRankMate',
  mateIn1: 'mateIn1',
  mateIn2: 'mateIn2',
};

const META_THEMES = new Set([
  'crushing', 'short', 'long', 'master', 'masterVsMaster',
  'superBlitz', 'blitz', 'rapid', 'oneMove', 'veryLong', 'advancedPawn',
]);

// ── resolveThemeKeys() ──────────────────────────────────────────────────
/** Maps raw Lichess themes through THEME_KEY_MAP, filtering out unmapped/meta themes. */
function resolveThemeKeys(themes: string[] | undefined): string[] {
  if (!themes || themes.length === 0) return [];
  const keys: string[] = [];
  for (const t of themes) {
    if (META_THEMES.has(t)) continue;
    const mapped = THEME_KEY_MAP[t];
    if (mapped && !keys.includes(mapped)) {
      keys.push(mapped);
    }
  }
  return keys;
}

// ── Global Dedup Ring Buffer ─────────────────────────────────────────────
const DEDUP_MAX = 20;
const dedupRing: string[] = [];

function addToDedup(quip: string): void {
  dedupRing.push(quip);
  if (dedupRing.length > DEDUP_MAX) {
    dedupRing.shift();
  }
}

function getDedupSet(): Set<string> {
  return new Set(dedupRing);
}

// ── Bag Cache ────────────────────────────────────────────────────────────
const bagCache = new Map<string, ShuffleBag<string>>();

function getBag(sectionId: string, key: string, pool: string[]): ShuffleBag<string> {
  const cacheKey = `${sectionId}:${key}`;
  let bag = bagCache.get(cacheKey);
  if (!bag) {
    bag = new ShuffleBag(pool);
    bagCache.set(cacheKey, bag);
  }
  return bag;
}

// ── lookupSectionResponses() ─────────────────────────────────────────────
/** Returns the response map for a section (e.g. '1.5', '3.2', '6.10'). */
function lookupSectionResponses(sectionId: string): Record<string, string[]> | undefined {
  const parts = sectionId.split('.');
  const levelNum = parts[0] || '1';
  const sectionNum = parts.length >= 2 ? parseInt(parts[1], 10) : 1;

  if (levelNum === '1') {
    let blockId: string;
    if (sectionNum <= 4) blockId = 'block-1';
    else if (sectionNum <= 8) blockId = 'block-2';
    else if (sectionNum <= 12) blockId = 'block-3';
    else blockId = 'block-4';

    const blockResponses = level1BlockResponses[blockId];
    return blockResponses?.[sectionId];
  }

  const levelResponses = allLevelResponses[levelNum];
  return levelResponses?.[sectionId] as Record<string, string[]> | undefined;
}

// ── tryDrawFromBag() — shared helper ─────────────────────────────────────
/** Try to draw a non-deduped quip from a bag. Returns the quip or null. */
function tryDrawFromBag(sectionId: string, key: string, pool: string[]): string | null {
  const bag = getBag(sectionId, key, pool);
  const skip = getDedupSet();
  return bag.drawWithSkip(skip);
}

// ── getQuip() — v3 quip selection algorithm ──────────────────────────────
/**
 * Select a context-aware quip for a completed puzzle.
 *
 * Selection priority:
 *   1. Context categories (first, last, recovery, streak:5, streak:3)
 *   2. Tiered theme matching (theme+piece → theme → piece → moves → general)
 *   3. Nuclear fallback ("Nice!")
 */
export function getQuip(sectionId: string, context: {
  themes?: string[];
  heroPiece?: string;
  playerMoveCount?: number;
  streak?: number;
  puzzleIndex?: number;
  totalPuzzles?: number;
  hadWrongAttempt?: boolean;
}): string {
  const responses = lookupSectionResponses(sectionId);
  if (!responses) return 'Nice!';

  // ── Step 1: Context categories (checked first, in order) ──
  const contextKeys: string[] = [];

  if (context.puzzleIndex === 0) contextKeys.push('first');
  if (
    context.puzzleIndex !== undefined &&
    context.totalPuzzles !== undefined &&
    context.puzzleIndex === context.totalPuzzles - 1
  ) {
    contextKeys.push('last');
  }
  if (context.hadWrongAttempt) contextKeys.push('recovery');
  if (context.streak !== undefined && context.streak >= 5) contextKeys.push('streak:5');
  if (context.streak !== undefined && context.streak >= 3) contextKeys.push('streak:3');

  for (const key of contextKeys) {
    const pool = responses[key];
    if (pool && pool.length > 0) {
      const quip = tryDrawFromBag(sectionId, key, pool);
      if (quip) {
        addToDedup(quip);
        return quip;
      }
    }
  }

  // ── Step 2: Tiered theme matching ──
  const themeKeys = resolveThemeKeys(context.themes);

  for (const theme of themeKeys) {
    // Tier 1: {theme}:{heroPiece} — most specific
    if (context.heroPiece) {
      const t1Key = `${theme}:${context.heroPiece}`;
      const t1Pool = responses[t1Key];
      if (t1Pool && t1Pool.length > 0) {
        const quip = tryDrawFromBag(sectionId, t1Key, t1Pool);
        if (quip) { addToDedup(quip); return quip; }
      }
    }

    // Tier 2: {theme} — theme only
    const t2Pool = responses[theme];
    if (t2Pool && t2Pool.length > 0) {
      const quip = tryDrawFromBag(sectionId, theme, t2Pool);
      if (quip) { addToDedup(quip); return quip; }
    }
  }

  // Tier 3: piece:{heroPiece} — piece only
  if (context.heroPiece) {
    const t3Key = `piece:${context.heroPiece}`;
    const t3Pool = responses[t3Key];
    if (t3Pool && t3Pool.length > 0) {
      const quip = tryDrawFromBag(sectionId, t3Key, t3Pool);
      if (quip) { addToDedup(quip); return quip; }
    }
  }

  // Tier 4: moves:{playerMoveCount} — move count
  if (context.playerMoveCount) {
    const t4Key = `moves:${context.playerMoveCount}`;
    const t4Pool = responses[t4Key];
    if (t4Pool && t4Pool.length > 0) {
      const quip = tryDrawFromBag(sectionId, t4Key, t4Pool);
      if (quip) { addToDedup(quip); return quip; }
    }
  }

  // Tier 5: general — fallback
  const generalPool = responses.general;
  if (generalPool && generalPool.length > 0) {
    const quip = tryDrawFromBag(sectionId, 'general', generalPool);
    if (quip) { addToDedup(quip); return quip; }
  }

  // ── Step 3: Nuclear fallback ──
  // If everything failed (dedup exhausted all bags), pick random from general without dedup
  if (generalPool && generalPool.length > 0) {
    return pickRandom(generalPool);
  }
  return 'Nice!';
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDUP TRACKING (session-level, resets on page reload)
// ═══════════════════════════════════════════════════════════════════════════

const recentlyUsedMap = new Map<string, Set<string>>();

/** Reset quip history for a section (or all sections). For testing. */
export function resetQuipHistory(sectionId?: string): void {
  if (sectionId) {
    recentlyUsedMap.delete(sectionId);
  } else {
    recentlyUsedMap.clear();
  }
}

/**
 * Get a section-specific response for the v2 curriculum.
 *
 * Supports piece-aware keys (e.g. "fork:N"), move-count keys (e.g. "moves:1"),
 * and session-level dedup so the same quip doesn't repeat in one lesson.
 *
 * @param sectionId - The section ID (e.g., '1.1', '2.5', '3.12') using dot notation
 * @param themes - Array of puzzle themes to match against
 * @param heroPiece - The piece executing the tactic ('N','B','R','Q','K','P')
 * @param playerMoveCount - Number of player moves in the solution (1, 2, 3...)
 * @returns A themed response or general section response
 */
export function getV2Response(
  sectionId: string,
  themes?: string[],
  heroPiece?: string,
  playerMoveCount?: number
): string {
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

  // Build candidate pool from all matching buckets
  const candidates: string[] = [];

  // 1. Add piece:{heroPiece} quips (e.g. "piece:N")
  if (heroPiece && sectionResponses[`piece:${heroPiece}`]) {
    candidates.push(...sectionResponses[`piece:${heroPiece}`]);
  }

  // 2. Add {theme}:{heroPiece} quips (e.g. "fork:N")
  if (themes && heroPiece) {
    for (const theme of themes) {
      const pieceKey = `${theme.toLowerCase()}:${heroPiece}`;
      for (const key of Object.keys(sectionResponses)) {
        if (key.toLowerCase() === pieceKey && sectionResponses[key]) {
          candidates.push(...sectionResponses[key]);
        }
      }
    }
  }

  // 3. Add theme-matched quips (exact and partial match, skip general and keyed buckets)
  if (themes && themes.length > 0) {
    for (const theme of themes) {
      const themeLower = theme.toLowerCase();
      for (const key of Object.keys(sectionResponses)) {
        if (key === 'general' || key.includes(':')) continue;
        const keyLower = key.toLowerCase();
        if (themeLower.includes(keyLower) || keyLower.includes(themeLower)) {
          candidates.push(...sectionResponses[key]);
        }
      }
    }
  }

  // 4. Add moves:{count} quips (e.g. "moves:1")
  if (playerMoveCount && sectionResponses[`moves:${playerMoveCount}`]) {
    candidates.push(...sectionResponses[`moves:${playerMoveCount}`]);
  }

  // 5. If no candidates found, fall back to general
  const pool = candidates.length > 0 ? candidates : sectionResponses.general;
  if (!pool || pool.length === 0) return "Nice!";

  // Dedup: filter out recently used quips for this section
  if (!recentlyUsedMap.has(sectionId)) {
    recentlyUsedMap.set(sectionId, new Set());
  }
  const used = recentlyUsedMap.get(sectionId)!;

  let available = pool.filter(q => !used.has(q));

  // If all candidates filtered out, reset and try again
  if (available.length === 0) {
    used.clear();
    available = pool;
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  used.add(pick);

  return pick;
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
