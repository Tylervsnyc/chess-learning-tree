import type { Metadata } from 'next';
import { FightClock } from '@/components/chessboxing/FightClock';

/**
 * /box/clock — the Chess Boxing clock screen, two modes: Chess Clock (the
 * phone lies flat between two players at a real board; each taps their half
 * to end their turn) and Boxing Timer (the full chess boxing round format for
 * two real people: chess round, bell, boxing round, bell, break). Works
 * offline, no account. The tab bar hides here (BoxTabBar HIDDEN_ROUTES) —
 * the clock owns the full viewport and exits through its own controls.
 */

export const metadata: Metadata = {
  title: 'Clock — Chess Boxing',
  description: 'Turn your phone into a chess clock or a full chess boxing round timer. Pick a format, lay it between you, play.',
};

export default function ClockPage() {
  return <FightClock />;
}
