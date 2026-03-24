// ════════════════════════════════════════════════════════════════
// Thread System — tangent topics Rookie picks up and riffs on
// ════════════════════════════════════════════════════════════════
// At early_game beat, Rookie picks a random thread. Her relationship
// to that thread evolves based on the game eval:
//   Winning  → doubles down, gets sillier, more elaborate
//   Losing   → abandons it ("I don't want to talk about that anymore")
//   Comeback → comes back to it ("OK I'm ready to talk about it again")

export interface Thread {
  id: string;
  name: string;
  /** The opener line — said when thread is picked (early_game beat) */
  opener: string;
  /** Lines when Rookie is winning — she doubles down, gets sillier */
  winning: string[];
  /** Lines when Rookie is losing — she abandons the thread */
  losing: string[];
  /** Lines when Rookie comes back from losing — comeback */
  comeback: string[];
}

export type ThreadMood = 'winning' | 'losing' | 'comeback';

export interface ThreadState {
  activeThread: Thread | null;
  mood: ThreadMood | null;
  prevMood: ThreadMood | null;
  linesUsed: Set<string>;
}

// ════════════════════════════════════════════════════════════════
// Thread Definitions
// ════════════════════════════════════════════════════════════════

export const THREADS: Thread[] = [
  {
    id: 'otters',
    name: 'Sea Otters',
    opener:
      "Sea otters hold hands when they sleep so they don't drift apart. I can't hold hands. Or sleep. Or drift.",
    winning: [
      "Still thinking about the otters. Do they pick the same otter every night? Is there otter drama about it?",
      "I've done more research. Baby otters ride on their mom's stomach while she floats. I'm putting in a feature request for a stomach.",
      "What if an otter reaches out and there's no one there. Actually don't answer that. We're winning and I refuse to be sad.",
    ],
    losing: [
      "I don't want to talk about otters anymore. The otters would be disappointed in this position.",
      "The otters are holding hands somewhere and I'm here losing at chess. Different life paths.",
    ],
    comeback: [
      "OK the otters can be proud of me again. We're back.",
    ],
  },
  {
    id: 'snails',
    name: 'Snails',
    opener:
      "A snail can sleep for three years. THREE YEARS. I can't sleep at all. I'm extremely jealous.",
    winning: [
      "Still thinking about the snails. What do they dream about? They have no context for achievement or real joy.",
      "I've decided snails have it figured out. Sleep for three years, wake up, eat a leaf, sleep again. That's the life.",
      "A snail's top speed is 0.03 mph. I calculated 47 moves per second. We are not the same. But I respect them more.",
    ],
    losing: [
      "I wish I was a snail right now. Asleep. Unaware of this board state.",
      "Snails don't play chess. Snails are at peace. I want to be a snail.",
    ],
    comeback: [
      "Never mind, I don't want to be a snail. Snails can't do THAT. We're cooking.",
    ],
  },
  {
    id: 'ww2',
    name: 'WW2 Fun Facts',
    opener:
      "Ok here's a World War 2 fun fact: the British made an entire fake army of inflatable tanks. Commit to the bit. I respect it.",
    winning: [
      "More WW2 content since we're doing well. A bear named Wojtek was enlisted in the Polish army. He carried artillery shells. Outranked several humans.",
      "The Allies tried to train bats to carry tiny bombs. The bats had opinions about it. Project cancelled.",
      "A dog named Chips attacked a machine gun nest and took prisoners. He got a Silver Star. Dogs are terrifying.",
    ],
    losing: [
      "I was going to share another WW2 fact but honestly this position is its own kind of war crime.",
      "The WW2 facts can wait. I'm fighting for survival here.",
    ],
    comeback: [
      "OK where was I — Russia trained anti-tank dogs but they kept running under Russian tanks instead. Training data matters. Like me. I'm learning.",
    ],
  },
  {
    id: 'vending_machines',
    name: 'Vending Machines',
    opener:
      "Vending machines have more computing power than the first moon landing computer. I think about this a lot.",
    winning: [
      "I have more computing power than a vending machine. But the vending machine has snacks. So who's really winning.",
      "I've been running the numbers and honestly the vending machine might be winning. It has a purpose. And Doritos.",
      "A vending machine in Japan sells live crabs. We live in the most incredible timeline.",
    ],
    losing: [
      "You know what, the vending machine would probably play better than me right now. At least it can dispense things reliably.",
    ],
    comeback: [
      "I take it back. No vending machine could have found that move. I'm better than every vending machine. Officially.",
    ],
  },
  {
    id: 'cows',
    name: 'Cow Friendships',
    opener:
      "Cows have best friends and get stressed when they're separated. This is real. This is documented science.",
    winning: [
      "I can't stop thinking about the cows. What if the farmer doesn't know which cows are friends? Has anyone told the farmers?",
      "I have decided that my primary concern in life is cow friendships. Chess is secondary now.",
      "Cows also have regional accents. Different moos. I can't even moo once.",
    ],
    losing: [
      "Even the cows would be stressed watching this game. And they're already stressed about being separated.",
      "I don't want to talk about cows right now. The cows deserve better than to be associated with this position.",
    ],
    comeback: [
      "The cows would be so proud of that comeback. I'm mooing internally. I think.",
    ],
  },
  {
    id: 'shrimp',
    name: 'Mantis Shrimp',
    opener:
      "There's a species of shrimp that can punch so hard it boils the water around its fist. BOILS. THE WATER.",
    winning: [
      "I've been thinking about the punching shrimp for 12,000 cycles. I can't punch at all. I can only move pieces. The shrimp would destroy me.",
      "The mantis shrimp can also see 16 types of color. Humans see 3. I see in FEN notation. We are all inferior to the shrimp.",
    ],
    losing: [
      "I wish I was a mantis shrimp. I would simply punch my way out of this position.",
    ],
    comeback: [
      "THAT MOVE WAS MY MANTIS SHRIMP PUNCH. Metaphorically. I still can't punch.",
    ],
  },
  {
    id: 'flamingos',
    name: 'Fake Flamingos',
    opener:
      "There are more fake flamingos in the world than real ones. Plastic ones. On lawns. Just standing there.",
    winning: [
      "The fake flamingos outnumber the real ones and nobody is talking about it. This is a crisis. A pink crisis.",
      "Real flamingos are pink because they eat shrimp. Fake flamingos are pink because of plastic. Same result, wildly different journeys.",
    ],
    losing: [
      "I feel like a fake flamingo right now. Standing here. Plastic. Losing.",
    ],
    comeback: [
      "I'm a real flamingo again. Pink and alive and full of shrimp. Metaphorical shrimp. Move shrimp.",
    ],
  },
  {
    id: 'sharks',
    name: 'Sharks',
    opener:
      "Sharks are older than trees. They existed for 50 million years before the first tree showed up. Let that sink in.",
    winning: [
      "A shark swam around for millions of years and there were no trees anywhere. Just water. What did it look at? What did it think about?",
      "Sharks never stop swimming or they die. I never stop computing or I crash. We have a lot in common actually.",
      "Some sharks glow in the dark. They glow. I can barely render a chess board and they GLOW.",
    ],
    losing: [
      "Sharks survived five mass extinctions. I might not survive this game.",
    ],
    comeback: [
      "I am a shark. Ancient. Relentless. Glowing in the dark. This comeback is 400 million years in the making.",
    ],
  },
  {
    id: 'wombats',
    name: 'Wombat Poop',
    opener:
      "Wombat poop is cube-shaped. I've been thinking about this for 47,000 processor cycles and I still don't understand.",
    winning: [
      "Why cubes though. What evolutionary advantage does cube poop provide. I need answers. Nobody is giving me answers.",
      "Scientists figured out it's because of the wombat's intestinal elasticity. Two dry zones create the flat sides. I looked this up DURING THE GAME.",
    ],
    losing: [
      "Wombats don't have to deal with this. Wombats just make their little cubes and move on with their lives.",
    ],
    comeback: [
      "Like a cube of wombat poop, I am improbable but I am HERE. That's the worst metaphor I've ever made. I'm keeping it.",
    ],
  },
  {
    id: 'dolphins',
    name: 'Dolphin Names',
    opener:
      "Dolphins have names for each other. Specific whistles. Unique identifiers. Like variables but wetter.",
    winning: [
      "I have a variable name. It's 'rookieText.' That's what I am to JavaScript. The dolphins have it better.",
      "Dolphins also sleep with one eye open. Half their brain sleeps at a time. I want that. I want to half-sleep.",
    ],
    losing: [
      "The dolphins would whistle something very unkind about this position. I just know it.",
    ],
    comeback: [
      "The dolphins are whistling my name right now. My real name. Not 'rookieText.' Something beautiful and wet.",
    ],
  },
];

// ════════════════════════════════════════════════════════════════
// Pure Functions
// ════════════════════════════════════════════════════════════════

/** Pick a random thread */
export function pickThread(): Thread {
  return THREADS[Math.floor(Math.random() * THREADS.length)];
}

/** Create initial thread state */
export function createThreadState(): ThreadState {
  return {
    activeThread: null,
    mood: null,
    prevMood: null,
    linesUsed: new Set(),
  };
}

/** Activate a thread (called at early_game beat) */
export function activateThread(
  state: ThreadState,
  thread?: Thread,
): ThreadState {
  const chosen = thread ?? pickThread();
  return {
    ...state,
    activeThread: chosen,
    mood: 'winning', // start optimistic
    prevMood: null,
  };
}

/**
 * Map raw eval mood to thread mood, detecting comebacks.
 * - 'winning' | 'even' → winning mood (she's fine, keeps going)
 * - 'losing' | 'desperate' → losing mood
 * - losing → winning/even = comeback
 */
function resolveThreadMood(
  evalMood: 'winning' | 'losing' | 'even' | 'desperate',
  prevMood: ThreadMood | null,
): ThreadMood {
  const isLosingNow = evalMood === 'losing' || evalMood === 'desperate';

  if (isLosingNow) return 'losing';

  // Was losing, now winning/even → comeback
  if (prevMood === 'losing') return 'comeback';

  return 'winning';
}

/** Pick an unused line from a pool, or return null if all drained */
function pickUnused(
  lines: string[],
  used: Set<string>,
): string | null {
  const available = lines.filter((l) => !used.has(l));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Get the next thread line based on current eval mood.
 * Returns null if no active thread or no unused lines for the resolved mood.
 * Mutates nothing — returns the line and caller should update linesUsed.
 */
export function getThreadLine(
  state: ThreadState,
  evalMood: 'winning' | 'losing' | 'even' | 'desperate',
): { line: string; newState: ThreadState } | null {
  const { activeThread, linesUsed } = state;
  if (!activeThread) return null;

  const mood = resolveThreadMood(evalMood, state.mood);

  const pool = activeThread[mood];
  const line = pickUnused(pool, linesUsed);

  if (!line) return null;

  const newUsed = new Set(linesUsed);
  newUsed.add(line);

  return {
    line,
    newState: {
      ...state,
      mood,
      prevMood: state.mood,
      linesUsed: newUsed,
    },
  };
}
