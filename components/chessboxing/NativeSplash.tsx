'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';
import { RookMark } from '@/components/brand/RookMark';
import { ROOK_FRACTION, ROOK_W, ROOK_H, SPLASH_BG } from '@/lib/brand/rook-mark';
import { isNativeApp } from '@/lib/native-app';
import { IS_CHESSPATH_APP } from '@/lib/config/offline';
import { markAppReady, onAppReady } from '@/lib/native-splash';
import { ShellColor } from '@/components/chessboxing/ShellColor';
import { SHELL_DEEP } from '@/components/chessboxing/ShellChrome';

/**
 * NativeSplash — the cold-start screen inside a Capacitor native shell. Web
 * visitors never see it. Debug on web with ?nativeSplash=1 (or
 * ?nativeSplash=<variant>), or replay it on /test/native-splash.
 *
 * Chess Boxing bundle: unchanged — BoxingLogoLoader on navy for a fixed
 * ~2.2s, hidden by the native splash's own auto-hide.
 *
 * Chess Path bundle — ONE continuous sequence, no logo swap, no blank gap:
 *   1. iOS shows the launch image: the bare rook mark on page blue, drawn from
 *      lib/brand/rook-mark at ROOK_FRACTION of the long screen side.
 *   2. This overlay paints the SAME rook at the SAME size/position/colour
 *      (`max(100vw,100vh)` mirrors the native scaleAspectFill), then tells
 *      the Capacitor SplashScreen plugin to drop away with no fade — the two
 *      are pixel-identical so nothing visibly changes.
 *   3. A random Rookie intro plays (hop / wiggle / shimmer / scatter) and the
 *      wordmark fades in beneath. Every variant STARTS from the static pose,
 *      which is what keeps step 2 seamless.
 *   4. The overlay fades the moment the first real screen has painted
 *      (lib/native-splash markAppReady — the root redirect to /play), but
 *      never before the intro has had MIN_SHOW_MS, and never later than
 *      MAX_SHOW_MS.
 */

export type SplashVariant = 'hop' | 'wiggle' | 'shimmer' | 'scatter';
export const SPLASH_VARIANTS: SplashVariant[] = ['hop', 'wiggle', 'shimmer', 'scatter'];

const MIN_SHOW_MS = 1150;
const MAX_SHOW_MS = 4000;
const FADE_MS = 320;

/** Chess Boxing (legacy timing, untouched). */
const BOX_INTRO_MS = 2200;
const BOX_FADE_MS = 400;

const LINES = [
  'Setting up the board.',
  'Rookie is warming up.',
  'Polishing the pieces.',
  'Rookie picked white. Again.',
];

function pickVariant(forced?: string | null): SplashVariant {
  if (forced && (SPLASH_VARIANTS as string[]).includes(forced)) return forced as SplashVariant;
  return SPLASH_VARIANTS[Math.floor(Math.random() * SPLASH_VARIANTS.length)];
}

export function NativeSplash() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'hidden' | 'shown' | 'fading'>('hidden');
  const [variant, setVariant] = useState<SplashVariant>('hop');

  // Chess Path: the root redirect landed somewhere real. Give it two frames
  // to paint, then release the splash.
  useEffect(() => {
    if (!IS_CHESSPATH_APP || phase === 'hidden') return;
    if (!pathname || pathname === '/') return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => markAppReady());
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname, phase]);

  useEffect(() => {
    const isNative = isNativeApp();
    const debug = new URLSearchParams(window.location.search).get('nativeSplash');
    if (!isNative && debug === null) return;
    setVariant(pickVariant(debug));
    setPhase('shown');

    if (!IS_CHESSPATH_APP) {
      const fadeTimer = setTimeout(() => setPhase('fading'), BOX_INTRO_MS);
      const doneTimer = setTimeout(() => setPhase('hidden'), BOX_INTRO_MS + BOX_FADE_MS);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }

    const start = performance.now();
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setPhase('fading');
      doneTimer = setTimeout(() => setPhase('hidden'), FADE_MS);
    };
    const release = () => {
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - start));
      minTimer = setTimeout(dismiss, wait);
    };
    let minTimer: ReturnType<typeof setTimeout> | undefined;
    const unsub = onAppReady(release);
    const maxTimer = setTimeout(dismiss, MAX_SHOW_MS);

    // Our overlay is painted after two frames; only then drop the native
    // launch splash. fadeOutDuration 0 — the frames are identical.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!isNative) return;
        import('@capacitor/splash-screen')
          .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 0 }))
          .catch(() => {});
      });
    });

    return () => {
      unsub();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  if (!IS_CHESSPATH_APP) {
    return (
      <>
      {/* The splash is `fixed inset-0`, which inside the natively-inset web
          view stops BELOW the status bar — so the navy splash used to show a
          pale band above it on every cold start. This paints the strip too. */}
      <ShellColor value={SHELL_DEEP} />
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
          transition: `opacity ${BOX_FADE_MS}ms ease-out`,
          pointerEvents: phase === 'fading' ? 'none' : 'auto',
        }}
      >
        <BoxingLogoLoader size={140} />
      </div>
      </>
    );
  }

  return <SplashScene variant={variant} exiting={phase === 'fading'} />;
}

/**
 * The visual, on its own so /test/native-splash can replay it. `exiting`
 * fades the overlay and eases the rook up 6% — a small "into the app" push.
 */
export function SplashScene({
  variant,
  exiting,
  line,
  style,
}: {
  variant: SplashVariant;
  exiting: boolean;
  line?: string;
  style?: React.CSSProperties;
}) {
  const tagline = useMemo(() => line ?? LINES[Math.floor(Math.random() * LINES.length)], [line]);
  return (
    <div
      aria-hidden
      data-variant={variant}
      className="cp-splash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: SPLASH_BG,
        opacity: exiting ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: exiting ? 'none' : 'auto',
        // The rook is ROOK_FRACTION of the long side — same as the native
        // launch image after scaleAspectFill.
        ['--rw' as string]: `calc(${ROOK_FRACTION} * max(100vw, 100vh))`,
        ['--rh' as string]: `calc(var(--rw) * ${ROOK_H} / ${ROOK_W})`,
        ...style,
      }}
    >
      <style>{SPLASH_CSS}</style>
      <div
        className="cp-splash-rook"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 'var(--rw)',
          height: 'var(--rh)',
          marginLeft: 'calc(var(--rw) / -2)',
          marginTop: 'calc(var(--rh) / -2)',
          transform: exiting ? 'scale(1.06)' : 'scale(1)',
          transition: `transform ${FADE_MS}ms ease-in`,
        }}
      >
        <div className="cp-splash-body">
          <RookMark style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <div
        className="cp-splash-word"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 'calc(50% + var(--rh) / 2 + var(--rw) * 0.22)',
          textAlign: 'center',
          fontFamily: 'var(--font-dm-sans, "DM Sans"), system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 'calc(var(--rw) * 0.42)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#0F172A',
        }}
      >
        chess
        <span
          style={{
            backgroundImage: 'linear-gradient(90deg,#FFC800 0%,#FFC800 55%,#FF6B6B 75%,#1CB0F6 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          path
        </span>
        <div
          className="cp-splash-line"
          style={{
            marginTop: 'calc(var(--rw) * 0.16)',
            fontWeight: 500,
            fontSize: 'calc(var(--rw) * 0.15)',
            letterSpacing: 0,
            color: '#64748B',
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
}

/**
 * Every variant holds the static pose for the first ~150ms (the native →
 * web handoff window), then plays. Block-level rules use --i (fill order,
 * bottom→top) and --dx/--dy (direction from centre) set by RookMark.
 */
const SPLASH_CSS = `
.cp-splash .cp-splash-body { width:100%; height:100%; transform-origin: 50% 100%; }
.cp-splash .rm-block { transform-box: fill-box; transform-origin: center; }
.cp-splash .cp-splash-word { opacity:0; transform: translateY(6px); animation: cpWordIn 420ms ease-out 260ms forwards; }
.cp-splash .cp-splash-line { opacity:0; animation: cpLineIn 400ms ease-out 620ms forwards; }
@keyframes cpWordIn { to { opacity:1; transform: translateY(0); } }
@keyframes cpLineIn { to { opacity:1; } }

/* hop — squash, jump, land, settle */
.cp-splash[data-variant="hop"] .cp-splash-body { animation: cpHop 900ms cubic-bezier(.3,.7,.3,1) 150ms both; }
@keyframes cpHop {
  0%   { transform: translateY(0) scale(1,1); }
  18%  { transform: translateY(0) scale(1.08,.86); }
  45%  { transform: translateY(-22%) scale(.96,1.06); }
  70%  { transform: translateY(0) scale(1.06,.92); }
  85%  { transform: translateY(-4%) scale(.99,1.02); }
  100% { transform: translateY(0) scale(1,1); }
}

/* wiggle — a happy side-to-side dance on the base */
.cp-splash[data-variant="wiggle"] .cp-splash-body { animation: cpWiggle 800ms ease-in-out 150ms both; }
@keyframes cpWiggle {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(-9deg); }
  45%  { transform: rotate(8deg); }
  70%  { transform: rotate(-4deg); }
  85%  { transform: rotate(2deg); }
  100% { transform: rotate(0deg); }
}

/* shimmer — a brightness wave rolling bottom→top, twice */
.cp-splash[data-variant="shimmer"] .rm-block { animation: cpShimmer 700ms ease-in-out calc(150ms + var(--i) * 22ms) 2; }
@keyframes cpShimmer {
  0%,100% { filter: brightness(1); transform: scale(1); }
  40%     { filter: brightness(1.55); transform: scale(1.14); }
}

/* scatter — blocks burst outward, spin, snap back with overshoot */
.cp-splash[data-variant="scatter"] .rm-block { animation: cpScatter 820ms cubic-bezier(.34,1.4,.5,1) calc(150ms + var(--i) * 8ms) both; }
@keyframes cpScatter {
  0%   { transform: translate(0,0) rotate(0deg); }
  35%  { transform: translate(calc(var(--dx) * 9px), calc(var(--dy) * 9px)) rotate(calc(var(--dx) * 40deg)); }
  100% { transform: translate(0,0) rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .cp-splash .cp-splash-body, .cp-splash .rm-block { animation: none !important; }
}
`;
