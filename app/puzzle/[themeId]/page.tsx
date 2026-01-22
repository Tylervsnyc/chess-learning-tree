'use client';

import React, { useState, useCallback, use } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { PuzzleBoard } from '@/components/puzzle/PuzzleBoard';
import { PuzzleHeader } from '@/components/puzzle/PuzzleHeader';
import { PuzzleFeedback } from '@/components/puzzle/PuzzleFeedback';
import { PuzzleComplete } from '@/components/puzzle/PuzzleComplete';
import { ThemeHelpModal } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';
import { getPuzzlesByTheme } from '@/data/puzzles';
import { getThemeById } from '@/data/curriculum';

interface PageProps {
  params: Promise<{ themeId: string }>;
}

export default function PuzzlePage({ params }: PageProps) {
  const { themeId } = use(params);
  const puzzles = getPuzzlesByTheme(themeId);
  const theme = getThemeById(themeId);

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const themeName = theme?.name || 'Unknown Theme';
  const hasHelpExplanation = !!getThemeExplanation(themeId);

  const handleCorrectMove = useCallback(() => {
    setFeedback('correct');
  }, []);

  const handleWrongMove = useCallback(() => {
    setFeedback('incorrect');
  }, []);

  const handleFeedbackComplete = useCallback(() => {
    if (feedback === 'correct') {
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }
    setFeedback(null);
  }, [feedback, currentPuzzleIndex, puzzles.length]);

  // Handle case where no puzzles exist for this theme
  if (puzzles.length === 0) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h1 className="text-xl font-bold text-white mb-4">No Puzzles Available</h1>
          <p className="text-gray-400 mb-6">
            Puzzles for this theme are coming soon!
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-[#1CB0F6] text-white font-bold rounded-xl"
          >
            Go Back
          </button>
        </div>
      </MobileContainer>
    );
  }

  // Show completion screen
  if (isComplete) {
    return (
      <MobileContainer>
        <PuzzleComplete themeName={themeName} totalPuzzles={puzzles.length} />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="flex flex-col h-full px-4 py-6">
        <PuzzleHeader
          themeName={themeName}
          currentPuzzle={currentPuzzleIndex + 1}
          totalPuzzles={puzzles.length}
          onHelpClick={hasHelpExplanation ? () => setShowHelpModal(true) : undefined}
        />

        {/* Puzzle instruction */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">
            {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
          </p>
        </div>

        {/* Chess board */}
        <div className="flex-1 flex items-center justify-center">
          <PuzzleBoard
            key={currentPuzzle.id}
            puzzle={currentPuzzle}
            onCorrectMove={handleCorrectMove}
            onWrongMove={handleWrongMove}
          />
        </div>

        {/* Feedback overlay */}
        <PuzzleFeedback type={feedback} onAnimationComplete={handleFeedbackComplete} />

        {/* Theme help modal */}
        <ThemeHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          themeId={themeId}
        />
      </div>
    </MobileContainer>
  );
}
