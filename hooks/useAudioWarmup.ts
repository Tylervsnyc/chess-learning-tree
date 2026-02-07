'use client';

import { useEffect } from 'react';
import { warmupAudio } from '@/lib/sounds';

/**
 * Unlocks AudioContext on mobile browsers by listening for the first
 * user interaction (click/touch) and calling warmupAudio().
 *
 * Critical for iOS Safari — AudioContext must be created synchronously
 * inside a user gesture handler or audio will be permanently blocked.
 */
export function useAudioWarmup() {
  useEffect(() => {
    const handleFirstInteraction = () => {
      warmupAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);
}
