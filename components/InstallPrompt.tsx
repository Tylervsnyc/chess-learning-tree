'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'chess-path-install-dismissed';

/**
 * PWA install prompt — bottom sheet that appears after first puzzle completion.
 *
 * Trigger it by dispatching a custom event anywhere in the app:
 *   window.dispatchEvent(new Event('chess-path:puzzle-complete'))
 *
 * Also registers the service worker on mount.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'native' | 'ios-safari' | 'ios-other' | 'desktop'>('desktop');

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Already installed as PWA — nothing to do
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // User previously dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Detect platform for install instructions
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
    if (isIOS) {
      // Only Safari on iOS supports Add to Home Screen
      const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
      setPlatform(isSafari ? 'ios-safari' : 'ios-other');
    }

    // Capture the browser's deferred install prompt (Chrome/Edge/Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show the prompt when a puzzle is completed
    const handlePuzzleComplete = () => {
      setShowPrompt(true);
    };
    window.addEventListener('chess-path:puzzle-complete', handlePuzzleComplete);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('chess-path:puzzle-complete', handlePuzzleComplete);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  }, []);

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]"
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      <div className="max-w-lg mx-auto px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-[42px] h-[50px]">
              <AnimatedLogo iconOnly size={0.44} theme="light" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-chess-text text-base">
                Add Chess Path to Home Screen
              </h3>
              <p className="text-chess-text-muted text-sm mt-0.5">
                Quick access to your daily puzzles
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-chess-text-faint hover:text-chess-text-muted p-1 -mt-1 -mr-1"
              aria-label="Dismiss"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 6l8 8M14 6l-8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {deferredPrompt ? (
            <button
              onClick={handleInstall}
              className="w-full mt-4 bg-chess-green text-white font-bold py-3 rounded-xl transition-all border-b-[4px] border-chess-green-shadow hover:brightness-105 active:border-b-[2px] active:translate-y-[2px]"
            >
              Install App
            </button>
          ) : platform === 'ios-safari' ? (
            <div className="mt-4 bg-chess-page rounded-xl p-3 text-center">
              <p className="text-chess-text text-sm font-medium">
                Tap the <span className="inline-block mx-0.5 align-text-bottom"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M12 3l4 4M12 3L8 7" stroke="#1CB0F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5" stroke="#1CB0F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span> icon below, then <strong>&quot;Add to Home Screen&quot;</strong>
              </p>
            </div>
          ) : platform === 'ios-other' ? (
            <div className="mt-4 bg-chess-page rounded-xl p-3 text-center">
              <p className="text-chess-text text-sm">
                Open in <strong>Safari</strong> to add to your home screen
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin + '/learn');
                }}
                className="mt-2 text-chess-blue text-sm font-semibold hover:underline"
              >
                Copy link
              </button>
            </div>
          ) : (
            <div className="mt-4 bg-chess-page rounded-xl p-3 text-center">
              <p className="text-chess-text text-sm">
                Look for <strong>&quot;Install&quot;</strong> in your browser&apos;s address bar or menu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
