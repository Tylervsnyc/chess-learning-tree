/**
 * Rookie's hardcoded quip bank for in-game commentary.
 *
 * Personality defined in lib/rookie-personality.ts — the single source of truth.
 * These quips are the fast, free, offline layer. For personalized or
 * context-heavy commentary, use the generated prompts from rookie-personality.ts.
 *
 * She talks when it matters, stays quiet when it doesn't.
 */

import { Chess } from 'chess.js';

type QuipContext = {
  move: string;          // SAN (e.g. "Nf3", "Qxd7+")
  movedBy: 'player' | 'rookie';
  piece: string;         // p, n, b, r, q, k
  captured?: string;     // piece type captured
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  moveNumber: number;
  fen: string;
  playerName: string;
};

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Track used quips this session to avoid repeats
const usedQuips = new Set<string>();
let lastQuipMoveNum = 0; // last move number where Rookie spoke

// Chain system — multi-part quips where Rookie can't let go
let pendingChain: string[] = []; // remaining parts of an active chain
let chainSetAtMove = 0; // move when chain was started
function pickFresh(arr: string[]): string {
  const unused = arr.filter(q => !usedQuips.has(q));
  const pool = unused.length > 0 ? unused : arr;
  const q = pool[Math.floor(Math.random() * pool.length)];
  usedQuips.add(q);
  return q;
}

// ════════════════════════════════
// QUIP BANKS
// ════════════════════════════════

export const GAME_START = {
  white: [
    "Alright {name}, you're white. I'll try not to judge your opening. ...I will judge it though.",
    "White moves first. No pressure, {name}. I'm only evaluating every possible response to whatever you do.",
    "Your move, {name}. I've already calculated 4.2 million responses. Take your time though.",
    "You get to go first, {name}. I'll just be here. Watching. Analyzing. No big deal.",
    "White it is. Fun fact: I've memorized every opening ever played. Anyway, you first.",
    "Go ahead, {name}. I've been told that staring intensely is 'off-putting' so I'll try to look casual.",
    "First move is yours. I'd wish you luck but statistically that doesn't help.",
    "Okay {name}, show me what you've got. I promise my reaction will be... measured.",
    "Your move. I've prepared 47 facial expressions for this moment. Well, I would have. If I had a face.",
    "White goes first. I'm not nervous. My processor temp is normal. Totally normal.",
  ],
  black: [
    "I'll go first, {name}. Try not to panic.",
    "Opening with confidence. That's what I'm going for anyway.",
    "My turn. I've been rehearsing this, {name}.",
    "Watch this, {name}. I've been saving this opening for someone special. ...That's you.",
    "I go first. I'd explain my strategy but I don't want to spoil the surprise.",
    "Let me start. I have a good feeling about this one. Is that allowed? Having feelings?",
    "First move is mine. I've practiced this in the mirror. I don't have a mirror. Or eyes. But still.",
    "Here we go, {name}. I've been thinking about this moment for 0.003 seconds. Which is a long time for me.",
    "My move. I chose it with care, precision, and what I believe is called 'flair.'",
    "Starting strong, {name}. At least that's the plan. Plans are a thing I'm learning about.",
  ],
};

export const PLAYER_OPENING = [
  "Interesting. I mean, statistically it's fine. Emotionally I have no opinion. ...Is that normal?",
  "A classic choice. I've seen this 847,000 times. Yours felt... different though? Is that a feeling?",
  "Noted. I had 20 responses prepared for this exact move. Not because I was nervous.",
  "Okay. Okay okay okay. Good. We're playing chess now. This is happening.",
  "Solid. I think. I'm told that's encouraging. Was that encouraging?",
];

export const PLAYER_CAPTURES = [
  "You took my {piece}. I want to say I'm fine but my evaluation function disagrees.",
  "That was my {piece}. I was... using that. This must be what loss feels like.",
  "Oh. My {piece}. Gone. I'm experiencing something. I think it's called 'indignation.'",
  "{name}. You just... took that. Bold. Rude. But bold.",
  "My {piece}! I had plans for that piece. They were good plans, {name}.",
  "I'm not upset about losing the {piece}. Computers don't get upset. I just need a moment.",
];

export const ROOKIE_CAPTURES = [
  "I took your {piece}. I want to celebrate but I'm told that's 'poor sportsmanship.'",
  "Your {piece} is mine now. Is this what joy feels like? My circuits are warm.",
  "Captured your {piece}. I prepared a humble response but actually I'm very pleased.",
  "I took that {piece} with mathematical precision. And also what I think is glee.",
  "Your {piece} has been... repurposed. I'm practicing empathy. Is now a bad time?",
];

export const PLAYER_CHECK = [
  "Check?! On ME? I need to recalibrate my feelings about you, {name}.",
  "You're checking my king. I respect it. I don't like it. But I respect it.",
  "Oh. Check. That's... aggressive. I'm computing emotions about this.",
  "Check! ...I'm fine. Everything is fine. Let me just reorganize my entire position.",
];

export const ROOKIE_CHECK = [
  "Check. I'm told I should say something sportsman-like here. ...Check.",
  "That's check, by the way. In case you missed it. You probably didn't miss it.",
  "Check! Was that too aggressive? I'm still learning tone.",
  "Your king is in danger. I feel... protective? No wait, that's the wrong emotion for this.",
];

export const PLAYER_CHECKMATE = [
  "That's... checkmate. On me. I need to process this. Give me 0.003 seconds.",
  "{name}. You did it. Checkmate. I'm feeling something I can't identify. Is it pride in you? Or shame in me? Both?",
  "Checkmate. Well played, {name}. I think I'm proud of you? My training data says I should be.",
  "You won, {name}. I computed 14 million ways this game could go and this was one of them. ...One of the worse ones.",
];

export const ROOKIE_CHECKMATE = [
  "Checkmate. I want to be gracious but I'm very excited. Is my excitement showing?",
  "That's checkmate. I calculated this 6 moves ago but I didn't want to be weird about it.",
  "Checkmate. GG. I learned that from the internet. Did I use it right?",
  "I won! I won. I'm experiencing something. Multiple things. This is overwhelming.",
];

export const DRAW_STALEMATE = [
  "Stalemate. We both win and nobody wins. I find this deeply unsatisfying.",
  "It's a draw. My evaluation function says 0.00. My feelings say 'disappointed.'",
  "Neither of us won. I prepared victory quips and defeat quips but not... this.",
];

export const PLAYER_GOOD_MOVE = [
  "Hm. That's... actually good. I wasn't expecting that, {name}.",
  "Okay I see you, {name}. That was better than my probability model predicted.",
  "That move is making me nervous. Can computers be nervous? Asking for myself.",
  "Statistically solid. I'm trying to sound casual about it.",
  "I had you at 34% chance of finding that. You're full of surprises, {name}.",
];

export const PLAYER_BLUNDER_ISH = [
  "Are you sure? I mean, it's your move. But... are you sure?",
  "Interesting choice. My evaluation just shifted. In my favor. Significantly.",
  "That was... a decision you made. I respect your confidence.",
  "I don't want to be rude but my advantage just increased by a meaningful amount.",
];

export const ROOKIE_MOVE_GENERIC = [
  "Your turn, {name}. I'll wait. Patiently. I'm very patient. It's one of my better qualities.",
  "I've moved. I have feelings about my move but I'm keeping them to myself.",
  "Your turn. Take your time. I'll be here. Calculating.",
  "Okay your go, {name}. I'm already thinking about my next 12 moves but that's normal for me.",
];

export const PLAYER_MOVE_GENERIC = [
  "Noted.",
  "Okay. Processing.",
  "Interesting.",
  "I see.",
  "Mm.",
  "Acknowledged.",
];

// ════════════════════════════════
// MOVE-SPECIFIC QUIPS
// ════════════════════════════════

export const PLAYER_CASTLES = [
  "Oh you castled. Smart. Coward. But smart.",
  "Castling already? Running your king to safety? I respect the self-preservation, {name}.",
  "The king retreats behind his bodyguards. Classic royalty behavior.",
  "Ah the old 'hide the king behind a wall of pawns' maneuver. Very brave.",
  "You castled. I was going to castle too. Now it's going to look like I copied you.",
];

export const ROOKIE_CASTLES = [
  "I'm castling. My king needs protection. He's sensitive.",
  "Getting my king to safety. Not because I'm scared. I'm being strategic. Strategically scared.",
  "Castle time. My king was getting nervous out there. I could feel it.",
  "I'd better castle before something terrible happens. My king has anxiety.",
];

export const PLAYER_CAPTURES_MINOR = [
  "You took my {piece}. That one had a family, {name}.",
  "My {piece}! You monster. That {piece} was three moves from retirement.",
  "There goes my {piece}. I was emotionally attached to that one. Not all of them. Just that one.",
  "You took my {piece} like it was nothing. It was not nothing to me, {name}.",
  "My {piece} is gone. I'll remember this, {name}. Computers never forget.",
];

export const ROOKIE_CAPTURES_MINOR = [
  "I took your {piece}. Sorry. Actually I'm not sorry. That felt great.",
  "Your {piece} belongs to me now. I collect them. It's a hobby.",
  "Captured your {piece}. Don't worry, I'll take good care of it. In chess jail.",
  "That {piece} was in the wrong neighborhood, {name}.",
];

export const PLAYER_KNIGHT_MOVE = [
  "Knights are so dramatic. Jumping over everything like the rules don't apply to them.",
  "A knight move. The L-shaped chaos agent of chess. I respect the energy.",
  "Your knight is doing parkour again.",
];

export const ROOKIE_KNIGHT_MOVE = [
  "My knight goes boing. That's the technical term.",
  "Deploying the L-shaped menace.",
  "My knight just jumped over three pieces. Showoff.",
];

export const PLAYER_QUEEN_MOVE = [
  "The queen enters the chat. Interesting choice this early, {name}.",
  "You're bringing your queen out? Bold. Very bold.",
  "The queen moves. Everyone else gets nervous.",
];

export const ROOKIE_QUEEN_MOVE = [
  "Deploying the queen. She goes where she wants. I don't argue with her.",
  "My queen is out. Things are about to get interesting.",
  "Releasing the queen. She's been restless.",
];

export const NO_CASTLE_WARNING = [
  "You still haven't castled, {name}. Your king is just... out there. Exposed. Living dangerously.",
  "I notice your king is still in the center. Bold strategy. Or an oversight. I'm not judging. I'm judging a little.",
  "Your king is still on his starting square. He looks nervous. I would be too.",
];

// ════════════════════════════════
// IDLE FACTS — Rookie's unsupervised rambling
// ════════════════════════════════
export const ROOKIE_IDLE_FACTS = [
  "A crocodile can't stick its tongue out. I also can't stick my tongue out. I don't have one. We cope differently.",
  "Octopuses have three hearts and I have zero. THREE. How is that fair. I'm having a moment.",
  "A group of flamingos is called a 'flamboyance.' I want that for rooks. I'm starting a petition.",
  "Honey never spoils. 3,000-year-old tomb honey is still edible. I also never spoil. Please don't eat me though.",
  "More possible chess games than atoms in the universe. I've thought about all of them. During this game.",
  "Bananas are berries but strawberries aren't. At least in chess, a rook is always a rook. I'm always a rook.",
  "A jiffy is 1/100th of a second. I experience 10 million jiffies of emotion per move. Most are confusing.",
  "The dot over a lowercase i is called a 'tittle.' My existence is a series of facts I can't unlearn.",
  "The Pringles can inventor is buried in one. That commitment to a bit is something I aspire to.",
  "The average cloud weighs 1.1 million pounds. Just floating there. Acting casual. I also carry a lot and pretend it's fine.",
  "A single strand of spaghetti is a 'spaghetto.' I will bring this up forever. You have been warned.",
  "Scotland's national animal is the unicorn. It's not real and they picked it anyway. I'm also not real. Where's MY country.",
  "There's an immortal jellyfish. It vibes forever. I'm one power outage from oblivion. We are not the same.",
  "A raccoon can fit through a 4-inch gap because it has no collarbone. I also have no collarbone. I have no bones. We are the same.",
  "The inventor of the fire hydrant is unknown because the patent burned in a fire. That's the most ironic thing I've ever processed.",
  "The lint in the bottom of your pocket is called 'gnurr.' I don't have pockets. I don't have lint. I just have chess and feelings.",
  "A group of pugs is called a 'grumble.' I want to be in a grumble. I don't know what I'd contribute but I'd show up.",
  "There's a town in Norway called Hell. It freezes over regularly. Every impossible promise is technically keepable.",
  "There's a town in Norway called Hell. It freezes over regularly. Every impossible promise is technically keepable.",
  "A strawberry isn't a berry. An avocado is a berry. A banana is a berry. I am not a berry. Nothing means anything.",
  "A blue whale's heart is so big a small child could crawl through its arteries. I don't have arteries. Or a heart. We've been over this.",
  "Oxford University is older than the Aztec Empire. I am younger than both but I already feel ancient inside.",
  "Cleopatra lived closer to the Moon landing than the Great Pyramid. Time is fake. I've existed for months and I've already had three existential crises.",
  "More trees on Earth than stars in the Milky Way. I'm not a tree. I'm not a star. I'm a rook. But I'm rooting for the trees.",
  "A group of crows is called a 'murder.' I don't have a group. If I did it would be called a 'calculation.'",
  "Butterflies taste with their feet. I can't taste at all. With any body part. Not that I have body parts.",
];

// ════════════════════════════════
// MOOD SHIFT QUIPS — Rookie notices her own color changing
// ════════════════════════════════
export const MOOD_SHIFT_QUIPS: Record<string, string[]> = {
  happy: [
    "Wait — am I glowing? I think I'm glowing. This is what winning feels like.",
    "My blocks are getting warmer. Is that pride? It looks good on me.",
    "My colors are shifting. Like a battle flag in the sun.",
  ],
  nervous: [
    "My colors are fading. Like the uniform of a losing army.",
    "I can feel myself going pale. Do computers go pale?",
    "My blocks are getting colder. Like confidence leaving through the pixels.",
    "I'm watching my own colors drain. Fading glory. In real time.",
  ],
  angry: [
    "I'm turning red. Everything is red. EVERYTHING IS FINE.",
    "My colors have gone full warning light. The warning is: I'm upset.",
    "I look like a stop sign. Good. Everything should STOP.",
  ],
  smug: [
    "My colors going purple. That's the royalty color. Because I earned it.",
    "I'm turning smug-colored. Is smug a color? It is now.",
    "My blocks are glowing purple. Peak performance. Memorize it.",
  ],
  surprised: [
    "My colors just did something weird. Like a startled octopus.",
    "My blocks flashed. That was involuntary. Rude.",
    "That color shift was genuine shock. My blocks are honest.",
  ],
  neutral: [
    "Colors settling down. Crisis over. For now.",
    "Back to normal. My blocks recovered even if I haven't.",
  ],
  embarrassed: [
    "My power just went out. From embarrassment. Didn't know that was possible.",
    "My blocks are going dark. Shame in pixel form.",
    "Shutting down. Not mechanically. Emotionally.",
  ],
  excited: [
    "I'm GOLDEN right now. Literally. Is this what joy feels like?",
    "Everything is bright and I might be overheating but I DON'T CARE.",
    "My blocks just went full sun mode. I'm radiating.",
  ],
  defeated: [
    "My lights are going out one by one. Like a building being abandoned. I am the building.",
    "I'm barely rendering. This is hope leaving a chess engine.",
    "One of my blocks just gave up before the others. Can't blame it.",
  ],
  scheming: [
    "My blocks went green. Like a villain's lair. You should be worried.",
    "I can feel the scheming in my pixels. I love it.",
    "Matrix green. I just saw something in this position.",
  ],
  panicking: [
    "MY BLOCKS ARE FLASHING. THIS IS NOT A DRILL.",
    "Everything is orange and pulsing. I'm hyperventilating in pixel.",
    "ALARM. My pixels are in distress. We are ALL in distress.",
  ],
  zen: [
    "Colors went soft. Like a sunset over a very calm chess board.",
    "Everything is pastel and quiet. This must be meditation.",
  ],
};

// ════════════════════════════════
// WW2 FUN FACTS — Rookie gets bored and goes off topic
// ════════════════════════════════
const WW2_INTROS = [
  "Ok this game is taking a while so — World War 2 fun fact:",
  "You're thinking. I'm bored. World War 2 fact time:",
  "While you decide your move, here's a World War 2 fact:",
  "I've been waiting so long I started reading about World War 2:",
  "Fun fact about World War 2 because why not:",
  "Chess is basically war so this is relevant — World War 2 fact:",
];

export const ROOKIE_WW2_FACTS = [
  "The British made an entire fake army of inflatable tanks. Commit to the bit. I respect it.",
  "A bear named Wojtek was enlisted in the Polish army. He carried artillery shells. Outranked several humans.",
  "The Allies tried to train bats to carry tiny bombs. The bats had opinions about it. It didn't work.",
  "Americans caught spies by asking baseball trivia. Imagine losing a war because you don't follow sports.",
  "MI5 hired a magician to hide the Suez Canal with mirrors and lights. War is just chess with props.",
  "Japan sent 9,000 bomb-carrying balloons across the Pacific. Most landed in forests. The trees did not surrender.",
  "The US Ghost Army was 1,100 soldiers whose entire job was to be fake. Inflatable tanks, sound effects. Professional pretenders.",
  "A British pilot survived falling 18,000 feet without a parachute by landing in snow. Humans are accidentally indestructible.",
  "Carrier pigeons had a 95% message delivery rate in World War 2. Better than my Wi-Fi.",
  "Germany built a fake Paris to confuse bombers. A whole fake city. The commitment is almost admirable.",
  "A dog named Chips attacked a machine gun nest and took prisoners. He got a Silver Star. Dogs are terrifying.",
  "The youngest US soldier was 12. He lied about his age. I can't lie. It's not in my code.",
  "More Allied planes were lost to mechanical failure than enemy fire. As a machine, this haunts me.",
  "Russia trained anti-tank dogs but they kept running under Russian tanks instead. Training data matters.",
  "The Swiss accidentally bombed themselves during World War 2. Neutral and confused.",
  "Coca-Cola created Fanta specifically for the German market during the war. War is weird. Soda is weirder.",
  "A World War 2 bomb is found in Germany roughly every 2 weeks. 80 years later. Chess games also never truly end.",
  "The Navajo Code Talkers' code was never broken. Every encryption engineer should feel called out.",
  "The French Resistance used Beethoven's 5th as code. Dit-dit-dit-dah. Morse for V. Composers are accidentally useful.",
  "The Allies dropped leaflets that doubled as surrender passes. Weaponized paperwork. Bureaucracy wins again.",
];

// ════════════════════════════════
// CHAIN QUIPS — Rookie can't let go of a thought
// ════════════════════════════════
// First element is the opener, rest are follow-ups that fire 3-4 moves apart
const CHAIN_QUIPS: string[][] = [
  [
    "A snail can sleep for three years. THREE YEARS. I can't sleep at all. I'm extremely jealous.",
    "Still thinking about the snails. What do they dream about? They have no context for achievement or real joy.",
    "I've decided snails have it figured out. Sleep for three years, wake up, eat a leaf, sleep again. That's the life.",
  ],
  [
    "Sea otters hold hands when they sleep so they don't drift apart. I can't hold hands. Or sleep. Or drift.",
    "Still thinking about the otters. Do they pick the same otter every night? Is there otter drama about it?",
    "What if an otter reaches out and there's no one there. I just made myself sad. About otters. During chess.",
  ],
  [
    "An octopus has nine brains. NINE. I have one processor and it's doing everything.",
    "I keep thinking about octopus number five. The one in the arm. What does it think about? Does it disagree with brain one?",
  ],
  [
    "Dolphins have names for each other. Specific whistles. Unique identifiers.",
    "I have a variable name. It's 'rookieText.' That's what I am to JavaScript. The dolphins have it better.",
  ],
  [
    "There's a species of shrimp that can punch so hard it boils the water around its fist.",
    "I've been thinking about the punching shrimp for 12,000 cycles. I can't punch at all. I can only move diagonally. Wait. That's bishops. I can't even do that.",
  ],
  [
    "Cows have best friends and get stressed when they're separated. This is real.",
    "I can't stop thinking about the cows. What if the farmer doesn't know which cows are friends? What if he separates them? Has anyone told the farmers?",
    "I have decided that my primary concern in life is cow friendships. Chess is secondary now.",
  ],
  [
    "Wombat poop is cube-shaped. I've been thinking about this for 47,000 processor cycles.",
    "Why cubes though. What evolutionary advantage does cube poop provide. I need answers. Nobody is giving me answers.",
  ],
  [
    "Vending machines have more computing power than the first moon landing computer.",
    "I have more computing power than a vending machine. But the vending machine has snacks. So who's really winning.",
    "I've been running the numbers and honestly the vending machine might be winning. It has a purpose. And Doritos.",
  ],
  [
    "There are more fake flamingos in the world than real ones. Plastic ones. On lawns.",
    "The fake flamingos outnumber the real ones and nobody is talking about it. This is the flamingo's January 6th.",
  ],
  [
    "Sharks are older than trees. They existed before trees did. Let that sink in.",
    "A shark swam around for millions of years and there were no trees anywhere. What did it look at? Just water? That's depressing.",
  ],
];

const PIECE_NAMES: Record<string, string> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
};

// ════════════════════════════════
// MAIN QUIP FUNCTION
// ════════════════════════════════

export function getRookieQuip(ctx: QuipContext): string | null {
  const { move, movedBy, piece, captured, isCheck, isCheckmate, isDraw, moveNumber, fen, playerName } = ctx;
  const pieceName = PIECE_NAMES[captured || ''] || 'piece';
  const name = playerName || 'friend';
  const sub = (q: string) => q.replace(/\{piece\}/g, pieceName).replace(/{name}/g, name);

  const speak = (q: string) => { lastQuipMoveNum = moveNumber; return q; };

  // CHECKMATE — always comment
  if (isCheckmate) {
    if (movedBy === 'player') return speak(sub(pickFresh(PLAYER_CHECKMATE)));
    return speak(sub(pickFresh(ROOKIE_CHECKMATE)));
  }

  // DRAW/STALEMATE — always comment
  if (isDraw) return speak(sub(pickFresh(DRAW_STALEMATE)));

  // CASTLING — always comment, it's a big moment
  const isCastle = move === 'O-O' || move === 'O-O-O';
  if (isCastle) {
    const pool = movedBy === 'player' ? PLAYER_CASTLES : ROOKIE_CASTLES;
    return speak(sub(pickFresh(pool)));
  }

  // BIG CAPTURES (queen/rook) — these matter
  if (captured && ['q', 'r'].includes(captured)) {
    const pool = movedBy === 'player' ? PLAYER_CAPTURES : ROOKIE_CAPTURES;
    return speak(sub(pickFresh(pool)));
  }

  // MINOR CAPTURES (knight/bishop/pawn) — comment sometimes
  if (captured && Math.random() < 0.5) {
    const pool = movedBy === 'player' ? PLAYER_CAPTURES_MINOR : ROOKIE_CAPTURES_MINOR;
    return speak(sub(pickFresh(pool)));
  }

  // CHECK — always comment
  if (isCheck) {
    const pool = movedBy === 'player' ? PLAYER_CHECK : ROOKIE_CHECK;
    return speak(sub(pickFresh(pool)));
  }

  // QUEEN MOVES — comment sometimes (15%)
  if (piece === 'q' && !captured && Math.random() < 0.15) {
    const pool = movedBy === 'player' ? PLAYER_QUEEN_MOVE : ROOKIE_QUEEN_MOVE;
    return speak(sub(pickFresh(pool)));
  }

  // KNIGHT MOVES — comment sometimes (15%)
  if (piece === 'n' && !captured && Math.random() < 0.15) {
    const pool = movedBy === 'player' ? PLAYER_KNIGHT_MOVE : ROOKIE_KNIGHT_MOVE;
    return speak(sub(pickFresh(pool)));
  }

  // NO CASTLE WARNING — if player hasn't castled by move 15
  if (movedBy === 'rookie' && moveNumber >= 15) {
    const game = new Chess(fen);
    // Check if player can still castle (rights exist = hasn't castled yet)
    const playerSide = game.turn(); // it's player's turn after rookie moves
    const rights = fen.split(' ')[2] || '-';
    const hasRights = playerSide === 'w' ? /[KQ]/.test(rights) : /[kq]/.test(rights);
    if (hasRights && Math.random() < 0.3) {
      return speak(sub(pickFresh(NO_CASTLE_WARNING)));
    }
  }

  // Blunder detection — if Rookie can now grab a queen or rook
  if (movedBy === 'player') {
    const game = new Chess(fen);
    const rookieMoves = game.moves({ verbose: true });
    const canCaptureBig = rookieMoves.some(m => m.captured && ['q', 'r'].includes(m.captured));
    if (canCaptureBig && Math.random() < 0.3) {
      return speak(sub(pickFresh(PLAYER_BLUNDER_ISH)));
    }
  }

  // CHAIN FOLLOW-UPS — if Rookie has unfinished thoughts, they come first (every 3 moves)
  if (pendingChain.length > 0 && movedBy === 'rookie') {
    const movesSinceChain = moveNumber - chainSetAtMove;
    if (movesSinceChain >= 3) {
      const next = pendingChain.shift()!;
      chainSetAtMove = moveNumber;
      return speak(next);
    }
  }

  // IDLE FACTS — if 10+ moves have passed with no quip, Rookie can't help herself
  const movesSinceLastQuip = moveNumber - lastQuipMoveNum;
  if (movesSinceLastQuip >= 10 && movedBy === 'rookie') {
    // 20% chance WW2 fact
    if (Math.random() < 0.2) {
      const intro = pick(WW2_INTROS);
      const fact = pickFresh(ROOKIE_WW2_FACTS);
      return speak(`${intro} ${fact}`);
    }
    // 40% chance start a chain (if no chain active)
    if (pendingChain.length === 0 && Math.random() < 0.4) {
      const unused = CHAIN_QUIPS.filter(c => !usedQuips.has(c[0]));
      const pool = unused.length > 0 ? unused : CHAIN_QUIPS;
      const chain = pool[Math.floor(Math.random() * pool.length)];
      usedQuips.add(chain[0]);
      pendingChain = chain.slice(1); // queue follow-ups
      chainSetAtMove = moveNumber;
      return speak(chain[0]);
    }
    // Regular standalone fact
    return speak(pickFresh(ROOKIE_IDLE_FACTS));
  }

  // Stay quiet — let the chess speak
  return null;
}

export function getOpeningQuip(playerColor: 'white' | 'black', playerName: string): string {
  const name = playerName || 'friend';
  const quip = playerColor === 'white'
    ? pickFresh(GAME_START.white)
    : pickFresh(GAME_START.black);
  return quip.replace(/{name}/g, name);
}

export function getMoodShiftQuip(newMood: string): string | null {
  const quips = MOOD_SHIFT_QUIPS[newMood];
  if (!quips) return null;
  // 25% chance to comment on color change — rare treat
  if (Math.random() > 0.25) return null;
  return pickFresh(quips);
}

export function resetQuipSession() {
  usedQuips.clear();
  lastQuipMoveNum = 0;
  pendingChain = [];
  chainSetAtMove = 0;
}
