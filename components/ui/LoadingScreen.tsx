'use client';

import { BreathingRook } from './BreathingRook';

interface LoadingScreenProps {
  label?: string;
}

/**
 * Full-page loading screen with breathing rook.
 * Use as a gate while auth/data is resolving to prevent content flash.
 */
export function LoadingScreen({ label }: LoadingScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 bg-chess-page">
      <BreathingRook size="lg" animate label={label} />
    </div>
  );
}
