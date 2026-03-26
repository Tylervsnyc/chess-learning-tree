'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BreathingRook, RookieMood } from '@/components/ui/BreathingRook';
import { CoachingScript, CoachingMessage } from '@/lib/coaching-prompt';
import { useRouter } from 'next/navigation';

interface CoachingDrawerProps {
  script: CoachingScript;
  onClose: () => void;
  onPremiumUpsell?: () => void;
  playerName?: string;
}

/**
 * CoachingDrawer — Rookie's post-game coaching conversation.
 * Slides up from the bottom. Messages animate in one at a time.
 * Tap to advance. Voice plays on each message (if available).
 */
export function CoachingDrawer({ script, onClose, onPremiumUpsell, playerName }: CoachingDrawerProps) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Slide in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  // Show first message after drawer opens
  useEffect(() => {
    if (isOpen && visibleCount === 0) {
      const timer = setTimeout(() => setVisibleCount(1), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visibleCount]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount]);

  const advance = useCallback(() => {
    if (visibleCount < script.messages.length) {
      setVisibleCount(v => v + 1);
    }
  }, [visibleCount, script.messages.length]);

  const dismiss = useCallback(() => {
    setIsDismissing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleTap = useCallback(() => {
    if (visibleCount < script.messages.length) {
      advance();
    } else {
      dismiss();
    }
  }, [visibleCount, script.messages.length, advance, dismiss]);

  const handleRecommendationTap = useCallback((lessonId: string) => {
    dismiss();
    router.push(`/lesson/${lessonId}`);
  }, [router, dismiss]);

  const allShown = visibleCount >= script.messages.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen && !isDismissing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={dismiss}
      />

      {/* Drawer */}
      <div
        ref={containerRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-chess-page rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out ${
          isOpen && !isDismissing ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '80dvh' }}
        onClick={handleTap}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-chess-disabled" />
        </div>

        <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(80dvh - 16px)' }}>
          {/* Rookie header */}
          <div className="flex items-center gap-3 mb-4">
            <BreathingRook
              size="sm"
              mood={script.mood as RookieMood}
            />
            <div>
              <p className="text-sm font-bold text-chess-text">Rookie</p>
              <p className="text-xs text-chess-text-faint">Post-game review</p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {script.messages.slice(0, visibleCount).map((msg, i) => (
              <CoachingBubble
                key={i}
                message={msg}
                index={i}
                onRecommendationTap={handleRecommendationTap}
              />
            ))}

            {/* Premium upsell teaser */}
            {!script.isPremium && allShown && onPremiumUpsell && (
              <div
                className="coaching-bubble-enter mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onPremiumUpsell();
                }}
              >
                <div className="bg-chess-surface/50 rounded-2xl px-4 py-3 border border-dashed border-chess-disabled cursor-pointer hover:border-chess-green/50 transition-colors">
                  <p className="text-chess-text-muted text-[13px] leading-relaxed">
                    Rookie has more to say about your game...
                  </p>
                  <p className="text-chess-green text-xs font-semibold mt-1">
                    Unlock full coaching
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom area */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-chess-text-faint">
              {allShown ? 'Tap anywhere to close' : 'Tap to continue'}
            </p>
            {allShown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss();
                }}
                className="text-xs font-semibold text-chess-green px-3 py-1.5 rounded-lg hover:bg-chess-green/10 transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>

      <style>{`
        .coaching-bubble-enter {
          animation: coachBubbleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes coachBubbleIn {
          0% { opacity: 0; transform: translateY(12px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

// ════════════════════════════════
// COACHING BUBBLE — individual message
// ════════════════════════════════

function CoachingBubble({
  message,
  index,
  onRecommendationTap,
}: {
  message: CoachingMessage;
  index: number;
  onRecommendationTap: (lessonId: string) => void;
}) {
  // Recommendation messages are tappable cards
  if (message.type === 'recommendation' && message.lessonId) {
    return (
      <div
        className="coaching-bubble-enter"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={(e) => {
          e.stopPropagation();
          onRecommendationTap(message.lessonId!);
        }}
      >
        <div className="bg-chess-green/10 rounded-2xl px-4 py-3 border border-chess-green/20 cursor-pointer hover:bg-chess-green/15 transition-colors">
          <p className="text-chess-text text-[14px] leading-relaxed">
            {message.text}
          </p>
          {message.lessonName && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-chess-green text-xs font-semibold">
                Go to lesson
              </span>
              <span className="text-chess-text-faint text-xs">
                {message.lessonName}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Improvement messages get a subtle different treatment
  const isImprovement = message.type === 'improvement';

  return (
    <div
      className="coaching-bubble-enter"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`rounded-2xl px-4 py-3 ${
        isImprovement
          ? 'bg-amber-500/8 border border-amber-500/15'
          : 'bg-chess-surface shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
      }`}>
        <p className="text-chess-text text-[14px] leading-relaxed">
          {message.text}
        </p>
      </div>
    </div>
  );
}
