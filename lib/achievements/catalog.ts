import type { AchievementDef } from './types';

/**
 * The achievement catalog (Phase 1 — Chess Boxing).
 *
 * Copy lives in code, not the DB (same pattern as the quip pool). Every line
 * is Rookie: short, warm, over-invested, never cruel about the player — the
 * roast targets the situation. Voice rules: .claude/rookie-voice-bible.md.
 *
 * IDs are stable forever — they're stored in user_achievements. Add new
 * achievements freely; never rename or reuse an id.
 */
export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  // ── Bout ──────────────────────────────────────────────────────────────────
  {
    id: 'bout-first-blood',
    category: 'bout',
    name: 'First Blood',
    description: "Your first win. I'm framing this. I already framed it.",
    icon: '🥊',
  },
  {
    id: 'bout-ko-artist',
    category: 'bout',
    name: 'KO Artist',
    description: 'Checkmate is just a KO where the referee is math.',
    icon: '💥',
    thresholds: [1, 10, 50, 200],
  },
  {
    id: 'bout-went-the-distance',
    category: 'bout',
    name: 'Went the Distance',
    description: 'Every round. Every bell. Somewhere a training montage is playing about you.',
    icon: '🔔',
  },
  {
    id: 'bout-judges-favorite',
    category: 'bout',
    name: "Judges' Favorite",
    description: "You didn't knock me out, you just quietly took all my pawns. Colder, honestly.",
    icon: '📋',
    thresholds: [1, 10, 50],
  },
  {
    id: 'bout-hometown-decision',
    category: 'bout',
    name: 'Hometown Decision',
    description: 'Dead even and they gave it to you. The crowd loves you. I demand an inquiry.',
    icon: '🏟️',
  },
  {
    id: 'bout-meltdown-button',
    category: 'bout',
    name: 'The Meltdown Button',
    description: 'I was WINNING. I want that recorded: I was winning, and this still happened.',
    icon: '🌋',
  },
  {
    id: 'bout-buzzer-beater',
    category: 'bout',
    name: 'Buzzer Beater',
    description:
      'Under ten seconds left and you found mate. I need to sit down. I am sitting down. I need to sit down more.',
    icon: '⏱️',
  },
  {
    id: 'bout-and-still',
    category: 'bout',
    name: 'And STILL Champion',
    description: "Five Fight Nights, five wins. Defend the belt or I'm taking it back.",
    icon: '👑',
  },
  {
    id: 'bout-championship-rounds',
    category: 'bout',
    name: 'Championship Rounds',
    description: 'Thirty-three minutes of chess boxing. Your cardio is now a chess piece.',
    icon: '🏆',
  },
  {
    id: 'bout-up-the-ladder',
    category: 'bout',
    name: 'Up the Ladder',
    description: 'I stopped going easy on you several levels ago. This is concerning.',
    icon: '🪜',
    levelTiered: true,
  },
  {
    id: 'bout-sparring-partner',
    category: 'bout',
    name: 'Sparring Partner',
    description:
      "Ten exhibition bouts. No stakes, all heart. That's either love of the game or fear of Fight Night.",
    icon: '🤝',
    thresholds: [10],
  },

  // ── Finishing moves (all detected by replaying the bout's real moves) ─────
  {
    id: 'mate-her-majesty',
    category: 'checkmate',
    name: 'Her Majesty',
    description: 'A queen mate. She files the paperwork AND performs the execution. Efficient. Terrifying.',
    icon: '👸',
  },
  {
    id: 'mate-the-lawnmower',
    category: 'checkmate',
    name: 'The Lawnmower',
    description: "A rook mate. One straight line, no mercy. I heard it coming and still couldn't move.",
    icon: '🚜',
  },
  {
    id: 'mate-long-distance-call',
    category: 'checkmate',
    name: 'Long-Distance Call',
    description: 'Mated by a bishop from across the board. I never even saw the area code.',
    icon: '📞',
  },
  {
    id: 'mate-the-horse-kick',
    category: 'checkmate',
    name: 'The Horse Kick',
    description: 'A knight mate. The only piece that jumps, and it landed on my king.',
    icon: '🐴',
  },
  {
    id: 'mate-pawnbroker',
    category: 'checkmate',
    name: 'Pawnbroker',
    description: 'Mated by a PAWN. The smallest guy on the board just retired my king. I need a minute.',
    icon: '♟️',
    band: 'contender',
  },
  {
    id: 'mate-the-quiet-step',
    category: 'checkmate',
    name: 'The Quiet Step',
    description:
      "You moved your KING and I got checkmated. That's not even supposed to be legal. I looked it up. It's legal.",
    icon: '👑',
    band: 'champion',
  },
  {
    id: 'mate-castle-doctrine',
    category: 'checkmate',
    name: 'Castle Doctrine',
    description: 'Checkmate BY CASTLING. Do you know the odds? I do. I calculated them mid-collapse.',
    icon: '🏰',
    band: 'undisputed',
  },
  {
    id: 'mate-the-sneak',
    category: 'checkmate',
    name: 'The Sneak',
    description: 'En passant checkmate. The rarest crime in chess, committed in front of everyone.',
    icon: '🥷',
    band: 'undisputed',
  },
  {
    id: 'mate-coronation-day',
    category: 'checkmate',
    name: 'Coronation Day',
    description: 'A pawn walked the whole board, got crowned, and delivered mate in the same breath. Cinema.',
    icon: '⚜️',
    band: 'champion',
  },
  {
    id: 'mate-philidors-ghost',
    category: 'checkmate',
    name: "Philidor's Ghost",
    description: 'A smothered mate. My own pieces boxed me in. This is a betrayal on several levels.',
    icon: '👻',
    band: 'champion',
  },
  {
    id: 'mate-back-rank-business',
    category: 'checkmate',
    name: 'Back Rank Business',
    description: 'Back rank. I KNOW about the back rank. Everyone knows about the back rank. And yet.',
    icon: '🚪',
  },
  {
    id: 'chess-speedrun',
    category: 'checkmate',
    name: 'Speedrun',
    description: "Checkmate in under ten moves. I've had warmups longer than that game.",
    icon: '🏃',
    band: 'contender',
  },
  {
    id: 'chess-the-marathon',
    category: 'checkmate',
    name: 'The Marathon',
    description: 'Sixty moves of chess boxing. We aged together in that ring.',
    icon: '🏁',
  },
  {
    id: 'chess-never-needed-her',
    category: 'checkmate',
    name: 'Never Needed Her',
    description: "You lost your queen and won by knockout anyway. That's not a comeback, that's a statement.",
    icon: '🎭',
    band: 'contender',
  },
  {
    id: 'chess-untouchable',
    category: 'checkmate',
    name: 'Untouchable',
    description: 'A knockout without losing a single piece. Not one. I checked the tape frame by frame.',
    icon: '🛡️',
    band: 'champion',
  },
  {
    id: 'chess-total-demolition',
    category: 'checkmate',
    name: 'Total Demolition',
    description: "Everything I owned was gone by the end. The king doesn't count. He never counts.",
    icon: '🧹',
    band: 'contender',
  },
  {
    id: 'chess-field-promotion',
    category: 'checkmate',
    name: 'Field Promotion',
    description: "A pawn made it all the way to the end of the board. I watched every step and couldn't stop any of them.",
    icon: '🎖️',
  },
  {
    id: 'chess-the-long-con',
    category: 'checkmate',
    name: 'The Long Con',
    description: 'You promoted to a KNIGHT. On purpose. And it WORKED. I have questions and also respect.',
    icon: '🃏',
    band: 'champion',
  },
  {
    id: 'chess-harassment-campaign',
    category: 'checkmate',
    name: 'Harassment Campaign',
    description: 'Ten checks in one bout. My king filed a complaint. It was denied.',
    icon: '📣',
  },

  // ── Openings (belt-tiered: tier = the Rookie level you beat with it on the
  //    board — win a bout featuring the opening, climb the belt by re-earning
  //    it at higher levels) ──────────────────────────────────────────────────
  {
    id: 'opening-caro-kann',
    category: 'opening',
    name: 'Caro-Kann',
    description: "The Caro-Kann was on the board and you didn't lose. Nobody survives the Caro-Kann that well. I've checked.",
    icon: '🧱',
    levelTiered: true,
  },
  {
    id: 'opening-london',
    category: 'opening',
    name: 'London System',
    description: 'The London. Congratulations on your new personality.',
    icon: '🎡',
    levelTiered: true,
  },
  {
    id: 'opening-sicilian',
    category: 'opening',
    name: 'Sicilian Defense',
    description: "A real Sicilian, on the board, on purpose. Most people just SAY they've played the Sicilian.",
    icon: '🌋',
    levelTiered: true,
  },
  {
    id: 'opening-kings-gambit',
    category: 'opening',
    name: "King's Gambit",
    description: 'A pawn, donated on move two, described as a plan. The worst part is that it worked.',
    icon: '🎁',
    levelTiered: true,
  },
  {
    id: 'opening-scandinavian',
    category: 'opening',
    name: 'Scandinavian Defense',
    description: 'Queen out by move two, like someone with nothing to lose. I respect it and I fear it.',
    icon: '🛶',
    levelTiered: true,
  },
  {
    id: 'opening-french',
    category: 'opening',
    name: 'French Defense',
    description: 'The French. A bishop spent the whole game locked in a closet and somebody still won. That bishop believed.',
    icon: '🥖',
    levelTiered: true,
  },
  {
    id: 'opening-ruy-lopez',
    category: 'opening',
    name: 'Ruy Lopez',
    description: "The Ruy Lopez. They call it the Spanish Torture. Someone at this board got tortured, and it wasn't you.",
    icon: '💃',
    levelTiered: true,
  },
  {
    id: 'opening-italian',
    category: 'opening',
    name: 'Italian Game',
    description: 'The Italian Game. Four hundred years of theory, used to bully me specifically.',
    icon: '🍝',
    levelTiered: true,
  },
  {
    id: 'opening-queens-gambit',
    category: 'opening',
    name: "Queen's Gambit",
    description: "The Queen's Gambit. A pawn was offered. Regret followed. That's the whole opening, and it's undefeated.",
    icon: '♛',
    levelTiered: true,
  },
  {
    id: 'opening-kings-indian',
    category: 'opening',
    name: "King's Indian",
    description: "The King's Indian. The whole center, handed over, then taken back with interest. A beautiful scam.",
    icon: '🐅',
    levelTiered: true,
  },
  {
    id: 'opening-petroff',
    category: 'opening',
    name: 'Petroff Defense',
    description: "The Petroff. The chess equivalent of saying 'no, you.' Somehow a real opening. Somehow it worked.",
    icon: '🪞',
    levelTiered: true,
  },
  {
    id: 'opening-scotch',
    category: 'opening',
    name: 'Scotch Game',
    description: 'The Scotch Game. The center exploded on move three and only one of us had a plan.',
    icon: '🥃',
    levelTiered: true,
  },
  {
    id: 'opening-slav',
    category: 'opening',
    name: 'Slav Defense',
    description: 'The Slav. A brick wall with a zip code. I ran into it at full speed.',
    icon: '🧊',
    levelTiered: true,
  },
  {
    id: 'opening-grunfeld',
    category: 'opening',
    name: 'Grünfeld Defense',
    description: 'The Grünfeld. I was GIVEN the center. It was a trap. The center was a trap.',
    icon: '🪤',
    levelTiered: true,
  },
  {
    id: 'opening-nimzo-indian',
    category: 'opening',
    name: 'Nimzo-Indian',
    description: 'The Nimzo-Indian. My pawns got doubled and so did my regrets.',
    icon: '🪢',
    levelTiered: true,
  },
  {
    id: 'opening-english',
    category: 'opening',
    name: 'English Opening',
    description: 'The English Opening. It starts sideways and ends badly. For me, specifically.',
    icon: '☕',
    levelTiered: true,
  },
  {
    id: 'opening-pirc',
    category: 'opening',
    name: 'Pirc Defense',
    description: 'The Pirc. Quiet, patient, and then suddenly everywhere. Frankly, rude.',
    icon: '🕸️',
    levelTiered: true,
  },
  {
    id: 'opening-witty-alien',
    category: 'opening',
    name: 'Witty Alien',
    description: "MY opening. Beaten with MY opening. This is either flattery or treason and I haven't decided.",
    icon: '👽',
    levelTiered: true,
  },

  // ── Puzzles ───────────────────────────────────────────────────────────────
  {
    id: 'puzzle-grinder',
    category: 'puzzle',
    name: 'Puzzle Grinder',
    description: 'Your pattern recognition is now legally a superpower.',
    icon: '🧩',
    thresholds: [100, 1000, 5000, 10000],
  },
  {
    id: 'puzzle-combo-meal',
    category: 'puzzle',
    name: 'Combo Meal',
    description: 'Eight in a row. The multiplier maxed out. The multiplier has never been more proud.',
    icon: '🍔',
  },
  {
    id: 'puzzle-flawless',
    category: 'puzzle',
    name: 'Flawless',
    description:
      "A full flawless session. I checked the math twice because frankly I didn't believe the math.",
    icon: '💎',
    thresholds: [1, 2, 3, 4], // tier = longest flawless duration band (8/16/24/32 min)
  },

  // ── Training ──────────────────────────────────────────────────────────────
  {
    id: 'training-fired-up',
    category: 'training',
    name: 'Fired Up',
    description:
      'Eighty punches, one round. Your next chess round is legally required to be 25% better. House rules.',
    icon: '🔥',
  },
  {
    id: 'training-thousand-fists',
    category: 'training',
    name: 'Thousand Fists',
    description: "At some point this stopped being a chess app and I didn't stop you.",
    icon: '👊',
    thresholds: [1000, 10000, 100000],
  },
  {
    id: 'training-new-belt-day',
    category: 'training',
    name: 'New Belt Day',
    description:
      'Another personal best. Your old best is in the locker room questioning its life choices.',
    icon: '📈',
    thresholds: [5, 25, 100],
  },
  {
    id: 'training-round-of-your-life',
    category: 'training',
    name: 'Round of Your Life',
    description:
      "Five hundred points in one round. I'd review the tape but honestly it would just embarrass the tape.",
    icon: '⚡',
  },
  {
    id: 'training-double-shift',
    category: 'training',
    name: 'Double Shift',
    description: 'Two full sessions in one day. The gym has a cot in the back if it comes to that.',
    icon: '🕐',
  },

  // ── Dedication ────────────────────────────────────────────────────────────
  {
    id: 'dedication-the-regular',
    category: 'dedication',
    name: 'The Regular',
    description:
      "I see you more than I see my own engine. I mean that warmly and also I'm worried about both of us.",
    icon: '🔥',
    thresholds: [3, 7, 30, 100, 365],
  },
  {
    id: 'dedication-comeback-kid',
    category: 'dedication',
    name: 'Comeback Kid',
    description:
      'You came back. I kept the campfire going. I never doubted you. I doubted you a medium amount.',
    icon: '🏕️',
  },
  {
    id: 'dedication-night-shift',
    category: 'dedication',
    name: 'Night Shift',
    description: "It's the middle of the night and you chose chess boxing. Correct choice. Go to bed.",
    icon: '🌙',
  },

  // ── Shame (secret until earned — the Dungeon Crawler Carl specialty) ──────
  {
    id: 'shame-glass-jaw',
    category: 'shame',
    name: 'Glass Jaw',
    description:
      "KO'd before the gloves even came on. In boxing they'd call that a puncher's chance. I had one. Sorry. Not that sorry.",
    icon: '🫙',
    secret: true,
  },
  {
    id: 'shame-flagged',
    category: 'shame',
    name: 'Flagged',
    description: 'You had all that time. You spent it like a lottery winner. The clock says hi.',
    icon: '🚩',
    secret: true,
  },
  {
    id: 'shame-three-strikes',
    category: 'shame',
    name: 'Three Strikes',
    description:
      "Struck out in the opening segment. The puzzles started a group chat about you. I'm in it.",
    icon: '❌',
    secret: true,
  },
  {
    id: 'shame-full-carlsberg',
    category: 'shame',
    name: 'The Full Carlsberg',
    description:
      "Five losses in one day and you kept getting back up. That's the most boxer thing I've ever seen. Medal. Now go drink water.",
    icon: '🥤',
    secret: true,
  },
];

const BY_ID = new Map(ACHIEVEMENT_CATALOG.map((d) => [d.id, d]));

export function getAchievementDef(id: string): AchievementDef | undefined {
  return BY_ID.get(id);
}
