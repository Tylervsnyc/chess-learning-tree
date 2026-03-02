// Response Templates — Tyler's voice for DM replies, comment replies, and engagement posts
// Randomly selected per tier to avoid sounding robotic

type EloTier = 'beginner' | 'intermediate' | 'advancing' | 'advanced' | 'expert' | 'unknown';

// --- DM Reply Templates ---
// Sent as private messages when someone mentions their ELO

const DM_TEMPLATES: Record<EloTier, string[]> = {
  beginner: [
    "Welcome to the game! I built Chess Path specifically for people starting out — it teaches you the patterns that took me years to learn. Start here: {link}",
    "Everyone starts somewhere! I made Chess Path to give beginners the fastest path to improvement. Jump in: {link}",
    "Love that you're getting into chess. I built a free app that teaches chess like Duolingo — pattern by pattern. Check it out: {link}",
  ],
  intermediate: [
    "{elo}? You're in the sweet spot for massive improvement. I built a level test for exactly your range: {link}",
    "Nice — {elo} is where things start getting really fun. I made a level test that figures out exactly where to start your training: {link}",
    "{elo} is solid. To break through to the next level, the key is pattern recognition. Take this quick level test and I'll set you up: {link}",
    "At {elo} you probably already see basic tactics — now it's about seeing them faster. I built something for that: {link}",
  ],
  advancing: [
    "{elo}? Getting serious! I built a level test that'll match you with the right training: {link}",
    "Nice rating. At {elo} the biggest gains come from pattern drilling. I made something for exactly that: {link}",
    "{elo} is a great spot — you're past the basics. This level test will figure out your exact weak points: {link}",
  ],
  advanced: [
    "{elo} — you clearly know your stuff. I built a level test for players at your range: {link}",
    "Respect the {elo}. I made Chess Path with advanced training paths for players like you. Quick level test here: {link}",
    "At {elo} you need targeted training, not generic puzzles. Take this level test — it'll find your gaps: {link}",
  ],
  expert: [
    "{elo}? Beast mode. I'd be curious what you think of Chess Path — built it for serious players too: {link}",
    "Solid {elo}. The advanced level test will push you — I built it specifically for 1600+ players: {link}",
    "{elo} is impressive. I made Chess Path to challenge players at every level. Give the expert test a shot: {link}",
  ],
  unknown: [
    "Hey! I built Chess Path — it's like Duolingo for chess. Takes 5 min to figure out your level: {link}",
    "Thanks for reaching out! I made a free chess learning app. Quick level test to get you started: {link}",
    "Hey! If you're looking to improve at chess, I built something for that. Start here: {link}",
  ],
};

// --- Comment Reply Templates ---
// Public replies to comments that mention an ELO (short, encouraging, no link)

const COMMENT_TEMPLATES: Record<EloTier, string[]> = {
  beginner: [
    "Welcome to the chess journey! The best time to start is now",
    "Everyone was a beginner once. Keep at it!",
    "Love the energy. Keep playing and you'll surprise yourself",
  ],
  intermediate: [
    "{elo} is the sweet spot for rapid improvement. Keep grinding!",
    "Solid foundation at {elo}. Big things are coming",
    "The jump from {elo} to 1200+ is all about pattern recognition. You got this",
  ],
  advancing: [
    "{elo} — you're putting in the work and it shows!",
    "Nice rating. The grind from {elo} is real but worth it",
    "{elo} is no joke. Keep pushing!",
  ],
  advanced: [
    "{elo}? Respect. That takes serious dedication",
    "Big respect for the {elo}. Keep climbing!",
    "{elo} is impressive. The game opens up at this level",
  ],
  expert: [
    "{elo}? Absolute beast mode",
    "Respect the {elo}. That's serious skill",
    "{elo} — you're in rare company. Keep going!",
  ],
  unknown: [
    "Thanks for watching! What's your rating? Curious where you're at",
    "Appreciate the comment! Drop your rating — I'd love to know",
    "Let me know your rating — I might be able to help with your training",
  ],
};

// --- Engagement Post Templates ---
// Carousel of content types rotated daily

export type EngagementPost = {
  type: string;
  text: string;
  platforms: ('instagram' | 'twitter' | 'youtube')[];
};

const ENGAGEMENT_TEMPLATES: EngagementPost[] = [
  {
    type: 'elo_poll',
    text: "What's your chess rating? Drop it below!\n\nI'm genuinely curious where everyone's at. Whether you're 400 or 2400, we all started somewhere.\n\n#chess #chessrating #chessimprovement",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'tip_openings',
    text: "Chess tip: Stop memorizing openings. Start understanding them.\n\nThe reason most players plateau isn't because they don't know enough theory — it's because they don't understand WHY the moves work.\n\nFocus on principles first. The moves will make sense after.\n\n#chesstips #chessimprovement #chessopenings",
    platforms: ['instagram', 'twitter', 'youtube'],
  },
  {
    type: 'tip_tactics',
    text: "Want to gain 200 rating points fast? Do 15 minutes of tactics every day.\n\nNot random puzzles. Pattern-based training. Forks, pins, skewers — drill them until you see them instantly.\n\nThat's literally how Chess Path works.\n\n#chesstactics #chessimprovement #chesspuzzles",
    platforms: ['instagram', 'twitter', 'youtube'],
  },
  {
    type: 'tip_blunders',
    text: "The #1 thing holding back 90% of chess players under 1200:\n\nHanging pieces.\n\nBefore every move, ask: \"Is anything attacking my pieces?\" That one habit will change your game.\n\n#chess #chesstips #chessbeginners",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'milestone',
    text: "Building Chess Path has been one of the most rewarding things I've done.\n\nEvery day I get DMs from people who went from 600 to 1000, or 1000 to 1400, just by doing 10 minutes a day.\n\nIf you haven't tried it yet, link's in bio.\n\n#chesspath #chessimprovement #indiedev",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'challenge',
    text: "Can you solve today's puzzle? It's a tricky one.\n\nDrop your answer in the comments — no peeking at other responses!\n\n#chesspuzzle #chess #dailychess",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'motivation',
    text: "You don't need to be talented to be good at chess.\n\nYou need consistency. 15 minutes a day beats 3 hours once a week.\n\nMost people who tell me they \"can't improve\" are playing tons of games but never training. Flip the ratio.\n\n#chess #chessimprovement #consistency",
    platforms: ['instagram', 'twitter', 'youtube'],
  },
  {
    type: 'teaser',
    text: "Something new is coming to Chess Path this week...\n\nLet's just say if you've been asking for opening training, you'll want to check back soon.\n\n#chesspath #chessopenings #comingsoon",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'elo_poll_2',
    text: "Be honest — what's the lowest-rated player you've ever lost to?\n\nI'll go first: I once blundered a queen against a 600. Chess humbles everyone.\n\n#chess #chesshumor #chesslife",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'tip_endgame',
    text: "Hot take: Endgame knowledge matters more than opening knowledge below 1400.\n\nYou can botch an opening and recover. You can't botch a king and pawn endgame.\n\nLearn basic checkmates, king activity, and pawn promotion. That alone is worth 100 rating points.\n\n#chess #chessendgame #chesstips",
    platforms: ['instagram', 'twitter', 'youtube'],
  },
  {
    type: 'behind_scenes',
    text: "Here's what building a chess app looks like:\n\n- 6am: wake up, check if the cron job posted today's puzzle\n- 6:30am: reply to overnight DMs\n- 7am: code new features\n- 12pm: render tomorrow's puzzle video\n- Repeat\n\nIndie dev life. Wouldn't trade it.\n\n#indiedev #chesspath #buildinpublic",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'tip_time',
    text: "Losing on time? Try this:\n\nSpend your time on moves 10-25. That's the critical middlegame where games are won or lost.\n\nThe opening? Play your prep quickly. The endgame? Trust your fundamentals.\n\nBut moves 10-25 — that's where you think.\n\n#chess #chesstips #timemanagement",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'elo_tiers',
    text: "Chess players by rating:\n\n400-600: \"I just learned the rules\"\n600-800: \"Why does everyone know Scholar's Mate?\"\n800-1000: \"I can see one-move tactics now\"\n1000-1200: \"Opening theory is overwhelming\"\n1200-1400: \"I keep blundering in time pressure\"\n1400+: \"I blunder less often, but it hurts more\"\n\nWhich one are you? Comment below.\n\n#chess #chessrating #chesshumor",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'daily_promo',
    text: "Every day at noon I post a new chess puzzle.\n\nIt starts easy and gets harder based on your level. Free. No account needed. Just chess.\n\nTry today's: chesspath.app/daily-challenge\n\n#chesspuzzle #dailychess #chesspath",
    platforms: ['instagram', 'twitter'],
  },
  {
    type: 'tip_analysis',
    text: "After every game, ask yourself one question:\n\n\"What was my worst move and why?\"\n\nYou don't need an engine. You don't need 30 minutes of analysis. Just find that one moment where things went wrong.\n\nThat habit alone will make you a better player.\n\n#chess #chesstips #improvement",
    platforms: ['instagram', 'twitter', 'youtube'],
  },
];

// --- Helpers ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template: string, elo: number | null, link: string): string {
  let result = template;
  if (elo !== null) {
    result = result.replace(/\{elo\}/g, String(elo));
  }
  result = result.replace(/\{link\}/g, link);
  return result;
}

/**
 * Get a random DM reply for the given tier
 */
export function getDmReply(tier: EloTier, elo: number | null, link: string): string {
  const template = pickRandom(DM_TEMPLATES[tier]);
  return fillTemplate(template, elo, link);
}

/**
 * Get a random public comment reply for the given tier
 */
export function getCommentReply(tier: EloTier, elo: number | null): string {
  const template = pickRandom(COMMENT_TEMPLATES[tier]);
  return fillTemplate(template, elo, '');
}

/**
 * Get the next engagement post, avoiding recent types.
 * recentTypes = types posted in the last 3 days
 */
export function getEngagementPost(recentTypes: string[]): EngagementPost | null {
  const available = ENGAGEMENT_TEMPLATES.filter((t) => !recentTypes.includes(t.type));
  if (available.length === 0) return null;
  return pickRandom(available);
}

export { ENGAGEMENT_TEMPLATES };
