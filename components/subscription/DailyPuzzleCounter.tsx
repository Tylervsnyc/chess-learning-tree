'use client';

import { useSubscription } from '@/hooks/useSubscription';

interface DailyPuzzleCounterProps {
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export function DailyPuzzleCounter({ onUpgradeClick, compact = false }: DailyPuzzleCounterProps) {
  const { isPremium, dailyPuzzlesUsed, dailyPuzzlesRemaining, loading, isAuthenticated } = useSubscription();

  if (loading) {
    return compact ? null : (
      <div className="bg-[#1A2C35] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
        <div className="h-2 bg-gray-700 rounded w-full" />
      </div>
    );
  }

  // Don't show for premium users or unauthenticated users
  if (isPremium || !isAuthenticated) {
    return null;
  }

  const totalLimit = 15;
  const percentUsed = (dailyPuzzlesUsed / totalLimit) * 100;
  const isLow = dailyPuzzlesRemaining <= 5;
  const isEmpty = dailyPuzzlesRemaining === 0;

  if (compact) {
    return (
      <button
        onClick={onUpgradeClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          isEmpty
            ? 'bg-red-500/20 text-red-400'
            : isLow
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-white/5 text-gray-400 hover:bg-white/10'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>{dailyPuzzlesRemaining} left today</span>
      </button>
    );
  }

  return (
    <div className={`bg-[#1A2C35] rounded-xl p-4 ${isEmpty ? 'border border-red-500/30' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">Daily Puzzles</span>
        <span className={`text-sm font-bold ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
          {dailyPuzzlesRemaining} / {totalLimit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[#131F24] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${
            isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-[#58CC02]'
          }`}
          style={{ width: `${100 - percentUsed}%` }}
        />
      </div>

      {isEmpty ? (
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">You've reached your daily limit!</p>
          <button
            onClick={onUpgradeClick}
            className="text-sm text-[#58CC02] hover:text-[#4CAF00] font-medium"
          >
            Upgrade for unlimited puzzles
          </button>
        </div>
      ) : isLow ? (
        <button
          onClick={onUpgradeClick}
          className="w-full text-center text-sm text-amber-400 hover:text-amber-300"
        >
          Running low? Go premium for unlimited
        </button>
      ) : null}
    </div>
  );
}
