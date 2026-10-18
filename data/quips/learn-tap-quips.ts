import type { InteractiveModeId } from '@/components/ui/InteractiveRook';

export interface TapReaction {
  mode: InteractiveModeId;
  label: string;
  quips: string[];
}

export const LEARN_TAP_REACTIONS: TapReaction[] = [
  {
    mode: 'paint',
    label: 'Paint',
    quips: [
      "A canvas now. Sure. Fine.",
      "Paint in my crenellations. Bold.",
      "I was due for a refresh anyway.",
      "Abstract expressionism. Interesting choice.",
      "Do I get a vote on the color? No? Cool.",
      "This is going to take forever to clean.",
      "Paint a face on me and I'm filing a complaint.",
      "Art or vandalism. Genuinely unsure.",
      "A museum somewhere just said no.",
    ],
  },
  {
    mode: 'eraser',
    label: 'Eraser',
    quips: [
      "I'll grow back. Probably.",
      "You can't erase me forever. I'm persistent.",
      "Being deconstructed. Not loving it.",
      "Every block had a name. I'm kidding. Mostly.",
      "Disappearing here. Nobody panicking. Noted.",
      "Fading. Tell the pawns I loved them.",
      "That's my best corner. Rude.",
      "You're erasing me. Bold choice.",
    ],
  },
  {
    mode: 'trampoline',
    label: 'Trampoline',
    quips: [
      "Wheeeee. That was dignified.",
      "I can see the whole board from here.",
      "Rooks don't bounce. Noted.",
      "Higher. Wait. No. Too high.",
      "Not rated for this altitude.",
      "Left my stomach three bounces ago.",
      "Overrated. Completely overrated.",
      "If I land wrong, that's on you.",
      "Bouncing. Strong feelings about it.",
      "Gravity is optional now, apparently.",
    ],
  },
  {
    mode: 'tractor',
    label: 'Tractor Beam',
    quips: [
      "You ARE the leader. Obviously.",
      "Leaving my blocks behind. Bye, blocks.",
      "Spinning. Interesting choice.",
      "Beam me to the seventh rank. That's where rooks belong.",
      "Take me to your best opening.",
      "If this ends on an open file, we're good.",
    ],
  },
  {
    mode: 'inflate',
    label: 'Inflate',
    quips: [
      "Puffed up. Intimidating? Be honest.",
      "Enormous. Dignified. Enormous.",
      "Balloon rook. Still the future.",
    ],
  },
  {
    mode: 'shockwave',
    label: 'Shockwave',
    quips: [
      "Rude. Extremely rude.",
      "Ring of power. Ring of mild concern.",
      "Boom. The pawns felt that one.",
      "That's how I feel after a blunder.",
      "The bishops are filing a report.",
      "That's going on the scoreboard.",
    ],
  },
  {
    mode: 'earthquake2',
    label: 'Tremor',
    quips: [
      "Earthquake vibes: immaculate.",
      "Not built for this. Impressed anyway.",
      "If I crumble, make it dramatic.",
    ],
  },
  {
    mode: 'jellyPoke',
    label: 'Jelly Poke',
    quips: [
      "Stone. Allegedly.",
      "Wobble wobble. This is undignified.",
      "Structural integrity: optional, apparently.",
      "Fortresses don't wobble. And yet.",
      "Gelatin rook. Patent pending.",
      "Still wobbling. Still your fault.",
    ],
  },
  {
    mode: 'stacking',
    label: 'Stacking',
    quips: [
      "Rook-first architecture. Obviously.",
      "Built from scratch. Again. Good.",
      "Keep stacking. You're doing great.",
      "Ground up. That's how you build.",
      "Look at that. You're building a rook.",
      "Finger-built infrastructure. Respect.",
    ],
  },
  {
    mode: 'splitMerge',
    label: 'Split/Merge',
    quips: [
      "Split. Just like that. Wild.",
      "Apart. Together. Rooks adapt.",
      "You split a rook. Interesting choice.",
      "Split and merged. Rooks are resilient.",
      "Two rooks for the price of one. Briefly.",
    ],
  },
  {
    mode: 'squeegee',
    label: 'Squeegee',
    quips: [
      "Squeaky clean. Thank you.",
      "Rook squeegee. Niche. Appreciated.",
      "Wipe away my sins. I have a few.",
    ],
  },
  {
    mode: 'vacuum',
    label: 'Vacuum',
    quips: [
      "The void is your thumb. Noted.",
      "Vacuuming a rook. Bold choice.",
      "You're vacuuming a rook. Here we are.",
    ],
  },
];
