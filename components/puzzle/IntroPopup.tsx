'use client';

import React from 'react';

interface IntroPopupProps {
  title: string;
  message: string;
  onStart: () => void;
  buttonText?: string;
  onSkip?: () => void;
  skipText?: string;
}

export function IntroPopup({
  title,
  message,
  onStart,
  buttonText = "Let's Go",
  onSkip,
  skipText,
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
      <div className="absolute inset-0 bg-black/70 rounded-md" />

      {/* Content card */}
      <div className="relative mx-4 max-w-sm w-full bg-[#1A2C35] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#58CC02] to-[#1CB0F6]" />

        <div className="px-3 py-2">
          {/* Title */}
          <h2 className="text-base font-bold text-white mb-1">
            {title}
          </h2>

          {/* Message paragraphs */}
          <div className="space-y-1 mb-2">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[#A3B8C2] text-sm leading-snug">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Buttons */}
          <div className={onSkip && skipText ? 'flex gap-2' : ''}>
            {onSkip && skipText && (
              <button
                onClick={onSkip}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-[#A3B8C2] border border-white/20 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all"
              >
                {skipText}
              </button>
            )}
            <button
              onClick={onStart}
              className={`${onSkip && skipText ? 'flex-[2]' : 'w-full'} py-2.5 bg-[#58CC02] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all hover:bg-[#5ED406]`}
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
