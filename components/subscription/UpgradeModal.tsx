'use client';

import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPuzzlesUsed?: number;
}

export function UpgradeModal({ isOpen, onClose, dailyPuzzlesUsed = 15 }: UpgradeModalProps) {
  const { startCheckout, isAuthenticated } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login?redirect=/pricing';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await startCheckout('monthly');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A2C35] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Go Premium</h2>
          <p className="text-gray-400">
            You've solved {dailyPuzzlesUsed} puzzles today! Upgrade for unlimited practice.
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-[#0D1A1F] rounded-xl p-4 mb-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-[#58CC02]">$4.99</span>
            <span className="text-gray-400">/month</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Billed monthly</p>
        </div>

        {/* Features */}
        <div className="bg-[#131F24] rounded-xl p-4 mb-6">
          <div className="text-sm font-medium text-gray-300 mb-3">Premium includes:</div>
          <ul className="space-y-2">
            {[
              'Unlimited puzzles every day',
              'Access to all difficulty levels',
              'Detailed performance analytics',
              'Priority support',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-[#58CC02] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#4CAF00] text-white font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : isAuthenticated ? 'Upgrade Now' : 'Sign In to Upgrade'}
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}
