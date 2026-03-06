'use client';

import React from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';

type RookAnimation = 'breathe' | 'enter' | 'think' | 'celebrate';

interface IntroPopupProps {
  title: string;
  message: string;
  onStart: () => void;
  buttonText?: string;
  onSkip?: () => void;
  skipText?: string;
  showRookie?: boolean;
  rookieAnimation?: RookAnimation;
}

export function IntroPopup({
  title,
  message,
  onStart,
  buttonText = "Let's Go",
  onSkip,
  skipText,
  showRookie = false,
  rookieAnimation = 'breathe',
}: IntroPopupProps) {
  // Split message by newlines to create paragraphs
  const paragraphs = message.split('\n\n').filter(p => p.trim());

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-md" />

      {/* Content card */}
      <div className="relative mx-4 max-w-sm w-full bg-chess-bg-light rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-chess-green to-chess-blue" />

        <div className="px-4 py-3">
          {showRookie ? (
            <div className="flex items-start gap-4 mb-3">
              <BreathingRook size="lg" animation={rookieAnimation} />
              <div>
                {title && (
                  <h2 className="text-base font-bold text-white mb-1">
                    {title}
                  </h2>
                )}
                <div className="space-y-1">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-white font-bold text-lg leading-snug">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {title && (
                <h2 className="text-base font-bold text-white mb-1">
                  {title}
                </h2>
              )}
              <div className="space-y-1 mb-2">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-chess-text-light text-sm leading-snug">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className={onSkip && skipText ? 'flex gap-2' : ''}>
            {onSkip && skipText && (
              <button
                onClick={onSkip}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-chess-text-light border border-white/20 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all"
              >
                {skipText}
              </button>
            )}
            <button
              onClick={onStart}
              className={`${onSkip && skipText ? 'flex-[2]' : 'w-full'} py-2.5 bg-chess-green text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all hover:brightness-105`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
