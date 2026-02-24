// Chess-opening themed celebration quotes for opening lesson completion screens
// One flat pool — openings don't have score tiers like Daily Rook

export const OPENING_QUOTES = [
  // Classic chess wisdom / players
  "You could teach Morphy a thing or two",
  "Capablanca would approve",
  "Kasparov just called. He wants his prep back.",
  "Even Fischer needed to study openings — you're doing it right",
  "That was textbook. Literally.",

  // Piece-specific
  "That bishop knew exactly where to go",
  "Your knights are developing beautifully",
  "Those pawns are marching with purpose",
  "Your pieces are talking to each other now",
  "That castle was chef's kiss",

  // Opening-themed
  "Your opening repertoire is leveling up",
  "You're building something dangerous here",
  "The middlegame won't know what hit it",
  "Your opponent's already in trouble and they don't know it yet",
  "That's how you seize the initiative",
  "Center controlled. Pieces developed. King safe. Textbook.",
  "You're playing with a plan — that's the difference",
  "Every move had a purpose. That's real chess.",

  // Encouraging / fun
  "You're starting to think like a master",
  "The opening is the appetizer — and you just cooked",
  "Your future opponents are already nervous",
  "That was smooth. Really smooth.",
  "Theory? Mastered. Confidence? Through the roof.",
  "You didn't just learn moves — you learned ideas",
  "One more opening in the toolbox",
  "The board bends to your will now",
  "You just unlocked a new weapon",
  "That was 500 years of theory, and you nailed it",
  "Opening prep complete. Time to crush.",
  "You're becoming genuinely dangerous",
]

/** Pick a random opening celebration quote (stable across re-renders when memoized) */
export function getRandomOpeningQuote(): string {
  return OPENING_QUOTES[Math.floor(Math.random() * OPENING_QUOTES.length)]
}
