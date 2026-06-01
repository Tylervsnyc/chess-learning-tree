'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { useSubscription } from '@/hooks/useSubscription';

interface PatronModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * "Become a Patron" pop-up. This is support-only — it unlocks NOTHING.
 * The single reward is a gold profile. Copy makes that crystal clear so nobody
 * feels misled into thinking they bought features.
 */
export function PatronModal({ isOpen, onClose }: PatronModalProps) {
  const { startPatron } = useSubscription();
  const [loading, setLoading] = useState(false);
  const didNavigateRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      didNavigateRef.current = false;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePatron = async () => {
    setLoading(true);
    didNavigateRef.current = true;
    try {
      await startPatron();
    } catch {
      setLoading(false);
      didNavigateRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`
        @keyframes pm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pm-slide {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: 'pm-fade 0.3s ease-out' }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative bg-white rounded-3xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden"
        style={{ animation: 'pm-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <div className="px-6 pt-6 pb-5">
          <div className="flex justify-center mb-4">
            <AnimatedLogo iconOnly size={0.8} theme="light" autoPlay perpetual />
          </div>

          <h2 className="text-xl font-black text-chess-text text-center mb-1">
            Become a Patron
          </h2>
          <p className="text-chess-text-muted text-sm text-center mb-5">
            This doesn&apos;t unlock anything. It just helps keep chesspath.app
            running — and turns your profile gold as a thank-you.
          </p>

          {/* What you get — honesty up front */}
          <div
            className="rounded-2xl p-4 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="currentColor" />
                  <path d="M5 19a2 2 0 012-2h10a2 2 0 012 2v0a2 2 0 01-2 2H7a2 2 0 01-2-2v0z" fill="currentColor" />
                </svg>
                <p className="font-bold text-chess-text text-sm">A gold profile</p>
              </div>
              <div className="text-right">
                <span className="text-amber-700 font-black text-lg">$4.99</span>
                <span className="text-amber-700/50 text-xs">/mo</span>
              </div>
            </div>
            <p className="text-amber-700/70 text-xs leading-snug">
              That&apos;s the whole reward. No extra lessons, no extra puzzles —
              everything in the app is exactly the same. You&apos;re just being
              generous. Cancel anytime.
            </p>
          </div>

          <button
            onClick={handlePatron}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base text-amber-950 flex items-center justify-center gap-2 active:translate-y-[3px] transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #FFD968 0%, #FFB628 55%, #F59E0B 100%)',
              boxShadow: '0 4px 0 #C77F0B, 0 8px 18px rgba(217,160,23,0.4)',
            }}
          >
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-900" aria-hidden>
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
                <path d="M5 19a2 2 0 012-2h10a2 2 0 012 2 2 2 0 01-2 2H7a2 2 0 01-2-2z" />
              </svg>
            )}
            {loading ? 'Opening checkout…' : 'Support chesspath.app'}
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 py-2.5 rounded-xl font-bold text-chess-text-muted text-sm active:translate-y-[1px] transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
