'use client';

import React from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { getThemeExplanation, ThemeExplanation } from '@/data/theme-explanations';

interface ThemeHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: string;
}

export function ThemeHelpModal({ isOpen, onClose, themeId }: ThemeHelpModalProps) {
  const theme = getThemeExplanation(themeId);

  if (!isOpen || !theme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-chess-bg-light rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-chess-bg-light px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-chess-blue/20 border border-chess-blue/50 text-chess-blue text-sm">
              ?
            </span>
            {theme.name}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Description */}
          <p className="text-white/90 text-base leading-relaxed">
            {theme.description}
          </p>

          {/* Example Position */}
          <div className="bg-chess-bg rounded-xl p-3">
            <p className="text-chess-blue text-sm font-semibold mb-2">Example Position</p>
            <p className="text-white/50 text-xs mb-2">{theme.toMove}</p>
            <div className="w-full aspect-square max-w-[280px] mx-auto">
              <ChessPathBoard
                options={{
                  position: theme.exampleFen,
                  squareStyles: theme.highlights,
                  boardStyle: { borderRadius: '8px' },
                }}
              />
            </div>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              {theme.exampleDescription}
            </p>
          </div>

          {/* Key Points */}
          <div>
            <p className="text-chess-green text-sm font-semibold mb-2">Key Points</p>
            <ul className="space-y-2">
              {theme.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                  <span className="text-chess-green mt-0.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-chess-bg-light px-4 py-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-chess-green text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple help icon button component
interface HelpIconButtonProps {
  onClick: () => void;
  className?: string;
}

export function HelpIconButton({ onClick, className = '' }: HelpIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center rounded-full bg-chess-blue/20 border border-chess-blue/50 text-chess-blue text-xs font-bold hover:bg-chess-blue/30 transition-colors ${className}`}
      title="What is this tactic?"
    >
      ?
    </button>
  );
}
