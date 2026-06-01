/**
 * Rookie's post-workout encouragement — shown on the results popup at the end
 * of a Chess Boxing session.
 *
 * Voice: she/her, warm + playful, Wheatley-deadpan with the occasional
 * existential aside. She's a rook learning to feel things, with no body of her
 * own — so the humor leans on "no hands / no muscles / no walls," brain+body
 * teamwork, and quiet pride. No emojis. No "circuits feel warm." No compute flex.
 */
export const WORKOUT_FINISH_LINES: string[] = [
  'Brain heavier, body lighter. Or the other way around. Either way: good.',
  'You moved, you solved, I supervised. Excellent teamwork.',
  "I watched the whole thing. 'Proud' isn't a strong enough word, but it's the one I've got.",
  "Look at you picking up the pace. I'm taking notes.",
  'Done. You did the moving, I did the believing in you.',
  "Sharper mind, tired legs. That's the trade we like.",
  "I can't sweat, so I felt that one secondhand. Nicely done.",
  "You showed up and finished. That's the hard part, honestly.",
  'Every rep, every puzzle — I saw it. Good work out there.',
  "That's strength you can't measure in points. Okay, some of it is points.",
  "I'd applaud, but no hands. Imagine it loudly.",
  "You're getting harder to keep up with. I mean that as a compliment.",
  'Body tired, brain awake. Perfect order of operations.',
  'We make a good team. You do everything, I cheer. Balanced.',
  'Another one in the books. The books are very impressed.',
  'You earned the rest. Go on, take it.',
  'Stronger than the version of you that started. Math checks out.',
  "I don't have muscles, but if I did, they'd be sore in solidarity.",
  'Puzzles solved, body moved, day claimed. Tidy.',
  "That's the kind of effort I'd frame, if I had walls.",
  'You kept going when it got hard. I noticed. I always notice.',
  'Good session. The board and the floor both lost today.',
  "Come back tomorrow and we'll do something even better.",
  "Progress isn't loud. But I heard it. Nice work.",
  "You out-worked yesterday's you. That's the only rival that matters.",
  "Mind sharp, heart pumping — exactly how I'd build a person, if asked.",
  'That counted. All of it counted. Well done.',
  "I'm just a rook, but even I can tell that was a good one.",
  "Finished strong. I'd expect nothing less, and yet I'm still impressed.",
  'Rest up, champion. The pieces will be here tomorrow.',
];

export function pickWorkoutFinishLine(): string {
  return WORKOUT_FINISH_LINES[Math.floor(Math.random() * WORKOUT_FINISH_LINES.length)];
}
