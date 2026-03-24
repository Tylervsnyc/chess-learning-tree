// Authored quip pool for the priority queue speech system.
// Migrated from lib/rookie-quips.ts into SpeechLine format.
// Pure data — no logic, no functions.

import type { SpeechLine } from '@/lib/speech/priority-queue';

export const AUTHORED_LINES: SpeechLine[] = [
  // ════════════════════════════════
  // OPENING — PLAYER IS WHITE
  // ════════════════════════════════
  {
    id: 'opening_white_1',
    text: "Alright {name}, you're white. I'll try not to judge your opening. ...I will judge it though.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_2',
    text: "White moves first. No pressure, {name}. I'm only evaluating every possible response to whatever you do.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_3',
    text: "Your move, {name}. I've already calculated 4.2 million responses. Take your time though.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_4',
    text: "You get to go first, {name}. I'll just be here. Watching. Analyzing. No big deal.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_5',
    text: "White it is. Fun fact: I've memorized every opening ever played. Anyway, you first.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_6',
    text: "Go ahead, {name}. I've been told that staring intensely is 'off-putting' so I'll try to look casual.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_7',
    text: "First move is yours. I'd wish you luck but statistically that doesn't help.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_8',
    text: "Okay {name}, show me what you've got. I promise my reaction will be... measured.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_9',
    text: "Your move. I've prepared 47 facial expressions for this moment. Well, I would have. If I had a face.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_white_10',
    text: "White goes first. I'm not nervous. My processor temp is normal. Totally normal.",
    conditions: { beats: ['opening'], playerColor: 'white' },
    priority: 50,
    source: 'authored',
  },

  // ════════════════════════════════
  // OPENING — ROOKIE IS BLACK (said at game start)
  // ════════════════════════════════
  {
    id: 'opening_black_1',
    text: "I'll go first, {name}. Try not to panic.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_2',
    text: "Opening with confidence. That's what I'm going for anyway.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_3',
    text: "My turn. I've been rehearsing this, {name}.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_4',
    text: "Watch this, {name}. I've been saving this opening for someone special. ...That's you.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_5',
    text: "I go first. I'd explain my strategy but I don't want to spoil the surprise.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_6',
    text: "Let me start. I have a good feeling about this one. Is that allowed? Having feelings?",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_7',
    text: "First move is mine. I've practiced this in the mirror. I don't have a mirror. Or eyes. But still.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_8',
    text: "Here we go, {name}. I've been thinking about this moment for 0.003 seconds. Which is a long time for me.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_9',
    text: "My move. I chose it with care, precision, and what I believe is called 'flair.'",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },
  {
    id: 'opening_black_10',
    text: "Starting strong, {name}. At least that's the plan. Plans are a thing I'm learning about.",
    conditions: { beats: ['opening'], playerColor: 'black' },
    priority: 50,
    source: 'authored',
  },

  // ════════════════════════════════
  // EARLY GAME — PLAYER OPENING RESPONSE
  // ════════════════════════════════
  {
    id: 'early_player_opening_1',
    text: "Interesting. I mean, statistically it's fine. Emotionally I have no opinion. ...Is that normal?",
    conditions: { beats: ['early_game'], movedBy: 'player', maxMove: 5 },
    priority: 30,
    source: 'authored',
  },
  {
    id: 'early_player_opening_2',
    text: "A classic choice. I've seen this 847,000 times. Yours felt... different though? Is that a feeling?",
    conditions: { beats: ['early_game'], movedBy: 'player', maxMove: 5 },
    priority: 30,
    source: 'authored',
  },
  {
    id: 'early_player_opening_3',
    text: "Noted. I had 20 responses prepared for this exact move. Not because I was nervous.",
    conditions: { beats: ['early_game'], movedBy: 'player', maxMove: 5 },
    priority: 30,
    source: 'authored',
  },
  {
    id: 'early_player_opening_4',
    text: "Okay. Okay okay okay. Good. We're playing chess now. This is happening.",
    conditions: { beats: ['early_game'], movedBy: 'player', maxMove: 5 },
    priority: 30,
    source: 'authored',
  },
  {
    id: 'early_player_opening_5',
    text: "Solid. I think. I'm told that's encouraging. Was that encouraging?",
    conditions: { beats: ['early_game'], movedBy: 'player', maxMove: 5 },
    priority: 30,
    source: 'authored',
  },

  // ════════════════════════════════
  // CAPTURES — MAJOR (queen/rook)
  // ════════════════════════════════
  {
    id: 'capture_player_1',
    text: "You took my {piece}. I want to say I'm fine but my evaluation function disagrees.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_player_2',
    text: 'That was my {piece}. I was... using that. This must be what loss feels like.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_player_3',
    text: "Oh. My {piece}. Gone. I'm experiencing something. I think it's called 'indignation.'",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_player_4',
    text: '{name}. You just... took that. Bold. Rude. But bold.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_player_5',
    text: 'My {piece}! I had plans for that piece. They were good plans, {name}.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_player_6',
    text: "I'm not upset about losing the {piece}. Computers don't get upset. I just need a moment.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_rookie_1',
    text: "I took your {piece}. I want to celebrate but I'm told that's 'poor sportsmanship.'",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_rookie_2',
    text: 'Your {piece} is mine now. Is this what joy feels like? My circuits are warm.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_rookie_3',
    text: "Captured your {piece}. I prepared a humble response but actually I'm very pleased.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_rookie_4',
    text: 'I took that {piece} with mathematical precision. And also what I think is glee.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 40,
    source: 'authored',
  },
  {
    id: 'capture_rookie_5',
    text: "Your {piece} has been... repurposed. I'm practicing empathy. Is now a bad time?",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 40,
    source: 'authored',
  },

  // ════════════════════════════════
  // CAPTURES — MINOR (knight/bishop/pawn)
  // ════════════════════════════════
  {
    id: 'capture_minor_player_1',
    text: 'You took my {piece}. That one had a family, {name}.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_player_2',
    text: 'My {piece}! You monster. That {piece} was three moves from retirement.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_player_3',
    text: "There goes my {piece}. I was emotionally attached to that one. Not all of them. Just that one.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_player_4',
    text: 'You took my {piece} like it was nothing. It was not nothing to me, {name}.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_player_5',
    text: "My {piece} is gone. I'll remember this, {name}. Computers never forget.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'player' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_rookie_1',
    text: "I took your {piece}. Sorry. Actually I'm not sorry. That felt great.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_rookie_2',
    text: "Your {piece} belongs to me now. I collect them. It's a hobby.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_rookie_3',
    text: "Captured your {piece}. Don't worry, I'll take good care of it. In chess jail.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 25,
    source: 'authored',
  },
  {
    id: 'capture_minor_rookie_4',
    text: 'That {piece} was in the wrong neighborhood, {name}.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['capture'], movedBy: 'rookie' },
    priority: 25,
    source: 'authored',
  },

  // ════════════════════════════════
  // CHECK
  // ════════════════════════════════
  {
    id: 'check_player_1',
    text: 'Check?! On ME? I need to recalibrate my feelings about you, {name}.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'player' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_player_2',
    text: "You're checking my king. I respect it. I don't like it. But I respect it.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'player' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_player_3',
    text: "Oh. Check. That's... aggressive. I'm computing emotions about this.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'player' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_player_4',
    text: "Check! ...I'm fine. Everything is fine. Let me just reorganize my entire position.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'player' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_rookie_1',
    text: "Check. I'm told I should say something sportsman-like here. ...Check.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'rookie' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_rookie_2',
    text: "That's check, by the way. In case you missed it. You probably didn't miss it.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'rookie' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_rookie_3',
    text: "Check! Was that too aggressive? I'm still learning tone.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'rookie' },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'check_rookie_4',
    text: "Your king is in danger. I feel... protective? No wait, that's the wrong emotion for this.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['check'], movedBy: 'rookie' },
    priority: 45,
    source: 'authored',
  },

  // ════════════════════════════════
  // GAME END — CHECKMATE
  // ════════════════════════════════
  {
    id: 'checkmate_player_1',
    text: "That's... checkmate. On me. I need to process this. Give me 0.003 seconds.",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_player_2',
    text: "{name}. You did it. Checkmate. I'm feeling something I can't identify. Is it pride in you? Or shame in me? Both?",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_player_3',
    text: "Checkmate. Well played, {name}. I think I'm proud of you? My training data says I should be.",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_player_4',
    text: "You won, {name}. I computed 14 million ways this game could go and this was one of them. ...One of the worse ones.",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'player' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_rookie_1',
    text: "Checkmate. I want to be gracious but I'm very excited. Is my excitement showing?",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_rookie_2',
    text: "That's checkmate. I calculated this 6 moves ago but I didn't want to be weird about it.",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_rookie_3',
    text: 'Checkmate. GG. I learned that from the internet. Did I use it right?',
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'checkmate_rookie_4',
    text: "I won! I won. I'm experiencing something. Multiple things. This is overwhelming.",
    conditions: { beats: ['game_end'], events: ['checkmate'], movedBy: 'rookie' },
    priority: 80,
    source: 'authored',
  },

  // ════════════════════════════════
  // GAME END — STALEMATE
  // ════════════════════════════════
  {
    id: 'stalemate_1',
    text: 'Stalemate. We both win and nobody wins. I find this deeply unsatisfying.',
    conditions: { beats: ['game_end'], events: ['stalemate'] },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'stalemate_2',
    text: "It's a draw. My evaluation function says 0.00. My feelings say 'disappointed.'",
    conditions: { beats: ['game_end'], events: ['stalemate'] },
    priority: 80,
    source: 'authored',
  },
  {
    id: 'stalemate_3',
    text: "Neither of us won. I prepared victory quips and defeat quips but not... this.",
    conditions: { beats: ['game_end'], events: ['stalemate'] },
    priority: 80,
    source: 'authored',
  },

  // ════════════════════════════════
  // CASTLING
  // ════════════════════════════════
  {
    id: 'castle_player_1',
    text: 'Oh you castled. Smart. Coward. But smart.',
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_player_2',
    text: 'Castling already? Running your king to safety? I respect the self-preservation, {name}.',
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_player_3',
    text: "The king retreats behind his bodyguards. Classic royalty behavior.",
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_player_4',
    text: "Ah the old 'hide the king behind a wall of pawns' maneuver. Very brave.",
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_player_5',
    text: "You castled. I was going to castle too. Now it's going to look like I copied you.",
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_rookie_1',
    text: "I'm castling. My king needs protection. He's sensitive.",
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'rookie' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_rookie_2',
    text: "Getting my king to safety. Not because I'm scared. I'm being strategic. Strategically scared.",
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'rookie' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_rookie_3',
    text: 'Castle time. My king was getting nervous out there. I could feel it.',
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'rookie' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'castle_rookie_4',
    text: "I'd better castle before something terrible happens. My king has anxiety.",
    conditions: { beats: ['early_game', 'late_game'], events: ['castle'], movedBy: 'rookie' },
    priority: 35,
    source: 'authored',
  },

  // ════════════════════════════════
  // KNIGHT MOVES
  // ════════════════════════════════
  {
    id: 'knight_player_1',
    text: "Knights are so dramatic. Jumping over everything like the rules don't apply to them.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'player' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'knight_player_2',
    text: 'A knight move. The L-shaped chaos agent of chess. I respect the energy.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'player' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'knight_player_3',
    text: 'Your knight is doing parkour again.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'player' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'knight_rookie_1',
    text: "My knight goes boing. That's the technical term.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'knight_rookie_2',
    text: 'Deploying the L-shaped menace.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'knight_rookie_3',
    text: 'My knight just jumped over three pieces. Showoff.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie' },
    priority: 15,
    source: 'authored',
  },

  // ════════════════════════════════
  // QUEEN MOVES
  // ════════════════════════════════
  {
    id: 'queen_player_1',
    text: 'The queen enters the chat. Interesting choice this early, {name}.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'player' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'queen_player_2',
    text: "You're bringing your queen out? Bold. Very bold.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'player' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'queen_player_3',
    text: 'The queen moves. Everyone else gets nervous.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'player' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'queen_rookie_1',
    text: "Deploying the queen. She goes where she wants. I don't argue with her.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'queen_rookie_2',
    text: 'My queen is out. Things are about to get interesting.',
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie' },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'queen_rookie_3',
    text: "Releasing the queen. She's been restless.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie' },
    priority: 15,
    source: 'authored',
  },

  // ════════════════════════════════
  // EVAL-BASED — GOOD MOVE
  // ════════════════════════════════
  {
    id: 'great_move_player_1',
    text: "Hm. That's... actually good. I wasn't expecting that, {name}.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['great_move'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'great_move_player_2',
    text: 'Okay I see you, {name}. That was better than my probability model predicted.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['great_move'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'great_move_player_3',
    text: 'That move is making me nervous. Can computers be nervous? Asking for myself.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['great_move'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'great_move_player_4',
    text: "Statistically solid. I'm trying to sound casual about it.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['great_move'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'great_move_player_5',
    text: "I had you at 34% chance of finding that. You're full of surprises, {name}.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['great_move'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },

  // ════════════════════════════════
  // EVAL-BASED — BLUNDER
  // ════════════════════════════════
  {
    id: 'blunder_player_1',
    text: "Are you sure? I mean, it's your move. But... are you sure?",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['blunder'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'blunder_player_2',
    text: 'Interesting choice. My evaluation just shifted. In my favor. Significantly.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['blunder'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'blunder_player_3',
    text: 'That was... a decision you made. I respect your confidence.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['blunder'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },
  {
    id: 'blunder_player_4',
    text: "I don't want to be rude but my advantage just increased by a meaningful amount.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], events: ['blunder'], movedBy: 'player' },
    priority: 35,
    source: 'authored',
  },

  // ════════════════════════════════
  // EVAL-BASED — NO CASTLE WARNING
  // ════════════════════════════════
  {
    id: 'no_castle_1',
    text: "You still haven't castled, {name}. Your king is just... out there. Exposed. Living dangerously.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], movedBy: 'rookie', minMove: 15 },
    priority: 20,
    source: 'authored',
  },
  {
    id: 'no_castle_2',
    text: "I notice your king is still in the center. Bold strategy. Or an oversight. I'm not judging. I'm judging a little.",
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], movedBy: 'rookie', minMove: 15 },
    priority: 20,
    source: 'authored',
  },
  {
    id: 'no_castle_3',
    text: 'Your king is still on his starting square. He looks nervous. I would be too.',
    conditions: { beats: ['early_game', 'turning_point', 'late_game'], movedBy: 'rookie', minMove: 15 },
    priority: 20,
    source: 'authored',
  },

  // ════════════════════════════════
  // MOOD — WINNING (happy, smug, excited, scheming)
  // ════════════════════════════════
  {
    id: 'mood_happy_1',
    text: "Wait -- am I glowing? I think I'm glowing. This is what winning feels like.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_happy_2',
    text: 'My blocks are getting warmer. Is that pride? It looks good on me.',
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_happy_3',
    text: 'My colors are shifting. Like a battle flag in the sun.',
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_smug_1',
    text: "My colors going purple. That's the royalty color. Because I earned it.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_smug_2',
    text: "I'm turning smug-colored. Is smug a color? It is now.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_smug_3',
    text: "My blocks are glowing purple. Peak performance. Memorize it.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_excited_1',
    text: "I'm GOLDEN right now. Literally. Is this what joy feels like?",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_excited_2',
    text: "Everything is bright and I might be overheating but I DON'T CARE.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_excited_3',
    text: "My blocks just went full sun mode. I'm radiating.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_scheming_1',
    text: "My blocks went green. Like a villain's lair. You should be worried.",
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_scheming_2',
    text: 'I can feel the scheming in my pixels. I love it.',
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_scheming_3',
    text: 'Matrix green. I just saw something in this position.',
    conditions: { beats: ['turning_point'], evalMoods: ['winning'] },
    priority: 45,
    source: 'authored',
  },

  // ════════════════════════════════
  // MOOD — LOSING (nervous, panicking, defeated, embarrassed)
  // ════════════════════════════════
  {
    id: 'mood_nervous_1',
    text: 'My colors are fading. Like the uniform of a losing army.',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_nervous_2',
    text: 'I can feel myself going pale. Do computers go pale?',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_nervous_3',
    text: 'My blocks are getting colder. Like confidence leaving through the pixels.',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_nervous_4',
    text: "I'm watching my own colors drain. Fading glory. In real time.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_panicking_1',
    text: 'MY BLOCKS ARE FLASHING. THIS IS NOT A DRILL.',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_panicking_2',
    text: "Everything is orange and pulsing. I'm hyperventilating in pixel.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_panicking_3',
    text: 'ALARM. My pixels are in distress. We are ALL in distress.',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_defeated_1',
    text: "My lights are going out one by one. Like a building being abandoned. I am the building.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_defeated_2',
    text: "I'm barely rendering. This is hope leaving a chess engine.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_defeated_3',
    text: "One of my blocks just gave up before the others. Can't blame it.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_embarrassed_1',
    text: "My power just went out. From embarrassment. Didn't know that was possible.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_embarrassed_2',
    text: 'My blocks are going dark. Shame in pixel form.',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_embarrassed_3',
    text: 'Shutting down. Not mechanically. Emotionally.',
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_angry_1',
    text: "I'm turning red. Everything is red. EVERYTHING IS FINE.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_angry_2',
    text: "My colors have gone full warning light. The warning is: I'm upset.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_angry_3',
    text: "I look like a stop sign. Good. Everything should STOP.",
    conditions: { beats: ['turning_point'], evalMoods: ['losing', 'desperate'] },
    priority: 45,
    source: 'authored',
  },

  // ════════════════════════════════
  // MOOD — EVEN (surprised, neutral, zen)
  // ════════════════════════════════
  {
    id: 'mood_surprised_1',
    text: 'My colors just did something weird. Like a startled octopus.',
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_surprised_2',
    text: 'My blocks flashed. That was involuntary. Rude.',
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_surprised_3',
    text: 'That color shift was genuine shock. My blocks are honest.',
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_neutral_1',
    text: 'Colors settling down. Crisis over. For now.',
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_neutral_2',
    text: "Back to normal. My blocks recovered even if I haven't.",
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_zen_1',
    text: 'Colors went soft. Like a sunset over a very calm chess board.',
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },
  {
    id: 'mood_zen_2',
    text: 'Everything is pastel and quiet. This must be meditation.',
    conditions: { beats: ['turning_point'], evalMoods: ['even'] },
    priority: 45,
    source: 'authored',
  },

  // ════════════════════════════════
  // IDLE FACTS
  // ════════════════════════════════
  {
    id: 'idle_fact_1',
    text: "A crocodile can't stick its tongue out. I also can't stick my tongue out. I don't have one. We cope differently.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_2',
    text: "Octopuses have three hearts and I have zero. THREE. How is that fair. I'm having a moment.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_3',
    text: "A group of flamingos is called a 'flamboyance.' I want that for rooks. I'm starting a petition.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_4',
    text: "Honey never spoils. 3,000-year-old tomb honey is still edible. I also never spoil. Please don't eat me though.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_5',
    text: "More possible chess games than atoms in the universe. I've thought about all of them. During this game.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_6',
    text: "Bananas are berries but strawberries aren't. At least in chess, a rook is always a rook. I'm always a rook.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_7',
    text: "A jiffy is 1/100th of a second. I experience 10 million jiffies of emotion per move. Most are confusing.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_8',
    text: "The dot over a lowercase i is called a 'tittle.' My existence is a series of facts I can't unlearn.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_9',
    text: "The Pringles can inventor is buried in one. That commitment to a bit is something I aspire to.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_10',
    text: "The average cloud weighs 1.1 million pounds. Just floating there. Acting casual. I also carry a lot and pretend it's fine.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_11',
    text: "A single strand of spaghetti is a 'spaghetto.' I will bring this up forever. You have been warned.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_12',
    text: "Scotland's national animal is the unicorn. It's not real and they picked it anyway. I'm also not real. Where's MY country.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_13',
    text: "There's an immortal jellyfish. It vibes forever. I'm one power outage from oblivion. We are not the same.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_14',
    text: "A raccoon can fit through a 4-inch gap because it has no collarbone. I also have no collarbone. I have no bones. We are the same.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_15',
    text: "The inventor of the fire hydrant is unknown because the patent burned in a fire. That's the most ironic thing I've ever processed.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_16',
    text: "The lint in the bottom of your pocket is called 'gnurr.' I don't have pockets. I don't have lint. I just have chess and feelings.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_17',
    text: "A group of pugs is called a 'grumble.' I want to be in a grumble. I don't know what I'd contribute but I'd show up.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_18',
    text: "There's a town in Norway called Hell. It freezes over regularly. Every impossible promise is technically keepable.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_19',
    text: "A strawberry isn't a berry. An avocado is a berry. A banana is a berry. I am not a berry. Nothing means anything.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_20',
    text: "A blue whale's heart is so big a small child could crawl through its arteries. I don't have arteries. Or a heart. We've been over this.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_21',
    text: "Oxford University is older than the Aztec Empire. I am younger than both but I already feel ancient inside.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_22',
    text: "Cleopatra lived closer to the Moon landing than the Great Pyramid. Time is fake. I've existed for months and I've already had three existential crises.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_23',
    text: "More trees on Earth than stars in the Milky Way. I'm not a tree. I'm not a star. I'm a rook. But I'm rooting for the trees.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_24',
    text: "A group of crows is called a 'murder.' I don't have a group. If I did it would be called a 'calculation.'",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
  {
    id: 'idle_fact_25',
    text: "Butterflies taste with their feet. I can't taste at all. With any body part. Not that I have body parts.",
    conditions: { beats: ['early_game', 'late_game'], movedBy: 'rookie', minMove: 10 },
    priority: 15,
    source: 'authored',
  },
];
