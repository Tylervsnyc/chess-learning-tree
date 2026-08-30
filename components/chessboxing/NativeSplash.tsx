'use client';

import { useEffect, useState } from 'react';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';
import { isNativeApp } from '@/lib/native-app';
import { IS_CHESSPATH_APP } from '@/lib/config/offline';

/**
 * NativeSplash — full-screen animated logo shown ONLY inside a Capacitor
 * native shell while the web app cold-loads. Web visitors never see it.
 * Debug on web with ?nativeSplash=1.
 *
 * Chess Boxing bundle: BoxingLogoLoader on navy #101a33 (must match the
 * native Splash.imageset + SplashScreen.backgroundColor, or cold start
 * flashes between colors). Chess Path bundle: the brand logo on the app's
 * light page blue #eef6fc — same rule, matched to ITS native splash.
 */

const INTRO_MS = 2200;
const FADE_MS = 400;

export function NativeSplash() {
  const [phase, setPhase] = useState<'hidden' | 'shown' | 'fading'>('hidden');

  useEffect(() => {
    const isNative = isNativeApp();
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
        background: IS_CHESSPATH_APP ? '#eef6fc' : '#101a33',
        opacity: phase === 'fading' ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      {IS_CHESSPATH_APP ? (
        // eslint-disable-next-line @next/next/no-img-element -- splash overlay, no optimizer offline
        <img src="/brand/logo-stacked-light.svg" alt="" style={{ width: 180 }} />
      ) : (
        <BoxingLogoLoader size={140} />
      )}
    </div>
  );
}
