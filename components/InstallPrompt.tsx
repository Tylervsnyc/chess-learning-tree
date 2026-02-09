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
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Already installed as PWA — nothing to do
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // User previously dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Detect iOS (no beforeinstallprompt — show manual instructions instead)
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    setIsIOS(ios);

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

  // Don't render if: hidden, or neither Android install nor iOS instructions available
  if (!showPrompt || (!deferredPrompt && !isIOS)) return null;

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
                {isIOS
                  ? 'Tap Share, then "Add to Home Screen"'
                  : 'Quick access to your daily puzzles'}
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
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="w-full mt-4 bg-chess-green text-white font-bold py-3 rounded-xl transition-all border-b-[4px] border-chess-green-shadow hover:brightness-105 active:border-b-[2px] active:translate-y-[2px]"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
