'use client';

import { useEffect, useState } from 'react';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';

/**
 * NativeSplash — full-screen animated logo shown ONLY inside the Capacitor
 * native shell (the Chess Boxing iOS app) while the web app cold-loads.
 * Web visitors never see it. Debug on web with ?nativeSplash=1.
 *
 * Plays the BoxingLogoLoader intro (~2s), then fades out.
 */

declare global {
  interface Window {
    Capacitor?: { isNativePlatform?: () => boolean };
  }
}

const INTRO_MS = 2200;
const FADE_MS = 400;

export function NativeSplash() {
  const [phase, setPhase] = useState<'hidden' | 'shown' | 'fading'>('hidden');

  useEffect(() => {
    const isNative = window.Capacitor?.isNativePlatform?.() === true;
    const isDebug = new URLSearchParams(window.location.search).has('nativeSplash');
    if (!isNative && !isDebug) return;
    setPhase('shown');
    const fadeTimer = setTimeout(() => setPhase('fading'), INTRO_MS);
    const doneTimer = setTimeout(() => setPhase('hidden'), INTRO_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#101a33',
        opacity: phase === 'fading' ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      <BoxingLogoLoader size={140} />
    </div>
  );
}
