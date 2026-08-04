import type { Metadata } from 'next';
import { BoxToday } from '@/components/chessboxing/BoxToday';

/**
 * /box — the Chess Boxing app's home ("Today") screen. This is the first tab
 * of the native-shell tab bar (components/chessboxing/BoxTabBar.tsx). Web
 * preview: /box?boxapp=1. Note: /boxing is the unrelated printable sheets.
 */

export const metadata: Metadata = {
  title: 'Chess Boxing — The Chess Path',
  description: 'Rounds of puzzles and punches. Train, fight, climb the board.',
};

export default function BoxPage() {
  return <BoxToday />;
}
