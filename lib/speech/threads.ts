// Thread topics — random tangent themes Rookie might riff on.
// Used only to give Claude a topic hint for the opening line.

const THREAD_NAMES = [
  'Sea Otters',
  'Snails',
  'WW2 Fun Facts',
  'Vending Machines',
  'Cow Friendships',
  'Mantis Shrimp',
  'Fake Flamingos',
  'Sharks',
  'Wombat Poop',
  'Dolphin Names',
];

/** Pick a random thread topic name */
export function pickThread(): { name: string } {
  const name = THREAD_NAMES[Math.floor(Math.random() * THREAD_NAMES.length)];
  return { name };
}
