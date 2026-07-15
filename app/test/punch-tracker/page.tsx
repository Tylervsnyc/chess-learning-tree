'use client';

/**
 * Test page for the camera punch counter (see components/workout/PunchTracker).
 * Debug mode: L/R split, FPS, live extension values, sensitivity slider.
 */

import { PunchTracker } from '@/components/workout/PunchTracker';

export default function PunchTrackerTestPage() {
  return (
    <div className="min-h-full bg-chess-page overflow-auto p-4">
      <div className="max-w-sm mx-auto space-y-4 pb-12">
        <h1 className="text-lg font-bold text-chess-text">🥊 Rookie&apos;s Corner</h1>
        <p className="text-sm text-chess-text-muted">
          Rookie&apos;s in your corner, counting every punch. Prop your phone up, step back
          so your upper body is in frame, and stand at a slight angle. Everything runs on
          your phone — no video is uploaded, ever.
        </p>
        <PunchTracker debug />
      </div>
    </div>
  );
}
