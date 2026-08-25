import type { Metadata } from 'next';
import { RingHome } from '@/components/chessboxing/RingHome';

/**
 * /box — the Chess Boxing app's home ("Today") screen. This is the first tab
 * of the native-shell tab bar (components/chessboxing/BoxTabBar.tsx). Web
 * preview: /box?boxapp=1. Note: /boxing is the unrelated printable sheets.
 *
 * ONE home screen: RingHome (the Living Ring). The old locker-room scene and
 * its BOX_RING_HOME flag were deleted 2026-08-25 — they were a second, fully
 * parallel home with their own streak/leaderboard/handle fetches.
 */

export const metadata: Metadata = {
  title: 'Chess Boxing — The Chess Path',
  description: 'Rounds of puzzles and punches. Train, fight, climb the board.',
};

export default function BoxPage() {
  return <RingHome />;
}
