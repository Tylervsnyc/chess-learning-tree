import type { Metadata } from 'next';
import { BoxSettings } from '@/components/chessboxing/BoxSettings';

/**
 * /box/settings — the Chess Boxing app's settings screen (username, crew,
 * camera, leaderboard opt-in). Reached from the gear on the Today screen
 * (components/chessboxing/BoxToday.tsx). Web preview: /box/settings?boxapp=1.
 */

export const metadata: Metadata = {
  title: 'Settings — Chess Boxing',
  description: 'Your handle, crew, camera and leaderboard settings.',
};

export default function BoxSettingsPage() {
  return <BoxSettings />;
}
