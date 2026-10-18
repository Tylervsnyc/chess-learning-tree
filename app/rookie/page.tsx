import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { ACTIVE_MOODS, POTENTIAL_MOODS, ALARM_VARIANTS } from '@/lib/rookie-os/types';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { RookieTour } from './RookieTour';

export const metadata: Metadata = {
  title: 'Meet Rookie',
  description: 'A guided tour of Rookie, the Chess Path mascot.',
  robots: { index: false, follow: false },
};

// Unlisted pitch page. Stats are read from the repo at build time so the
// numbers on the closing slide are real, not typed in.
function countVoicedLines(): number {
  try {
    const file = path.join(process.cwd(), 'public/rookie-voice/manifest.json');
    return Object.keys(JSON.parse(fs.readFileSync(file, 'utf8'))).length;
  } catch {
    return 0;
  }
}

async function countSfxGags(): Promise<number> {
  const { AUTHORED_LINES } = await import('@/lib/speech/line-pool');
  return AUTHORED_LINES.filter((l) => l.id.startsWith('sore_loser') && l.sfx).length;
}

export default async function RookiePage() {
  const stats = {
    voicedLines: countVoicedLines(),
    moods: ACTIVE_MOODS.length + POTENTIAL_MOODS.length,
    liveMoods: ACTIVE_MOODS.length,
    tapReactions: LEARN_TAP_REACTIONS.length,
    alarms: ALARM_VARIANTS.length,
    sfxGags: await countSfxGags(),
  };
  return (
    <>
      {/* Full-width page: opt out of the root layout's 48rem shell cap */}
      <style>{':root{--shell-max:none}'}</style>
      <RookieTour stats={stats} />
    </>
  );
}
