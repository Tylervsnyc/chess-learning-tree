'use client';

import { useState, useEffect } from 'react';

export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

interface SyncStatusProps {
  state: SyncState;
  onRetry?: () => void;
  className?: string;
}

/**
 * Visual indicator for sync status.
 * Shows nothing when idle, spinner when syncing, warning when error/offline.
 */
export function SyncStatus({ state, onRetry, className = '' }: SyncStatusProps) {
  const [showError, setShowError] = useState(false);

  // Show error state for at least 3 seconds
  useEffect(() => {
    if (state === 'error' || state === 'offline') {
      setShowError(true);
    } else if (state === 'idle') {
      // Delay hiding error to let user see it
      const timer = setTimeout(() => setShowError(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (state === 'idle' && !showError) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {state === 'syncing' && (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white/60">Saving...</span>
        </>
      )}

      {(state === 'error' || (showError && state === 'idle')) && (
        <>
          <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xs">
            !
          </div>
          <span className="text-yellow-400">Not saved</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-yellow-400 underline hover:text-yellow-300"
            >
              Retry
            </button>
          )}
        </>
      )}

      {state === 'offline' && (
        <>
          <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12h.01" />
            </svg>
          </div>
          <span className="text-gray-400">Offline - will sync later</span>
        </>
      )}
    </div>
  );
}

/**
 * Hook to track online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
