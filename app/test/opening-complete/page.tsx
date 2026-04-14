'use client'

import { useState, useRef, useMemo } from 'react'
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard'
import { ChessProgressBar } from '@/components/puzzle/ChessProgressBar'
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup'
import { ActivityComplete } from '@/components/shared/ActivityComplete'
import { BOARD_COLORS } from '@/lib/puzzle-utils'
import {
  RookProgressAnimationRef,
  ANIMATION_STYLES,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation'
import {
  RookWrongAnimationRef,
  WRONG_ANIMATION_STYLES,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation'

const STARTING_FEN = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'

export default function TestOpeningComplete() {
  const [popup, setPopup] = useState<'none' | 'correct' | 'wrong' | 'learn-pass' | 'learn-fail' | 'opening'>('none')
  const [correctCount, setCorrectCount] = useState(0)

  const rookProgressRef = useRef<RookProgressAnimationRef>(null)
  const rookWrongRef = useRef<RookWrongAnimationRef>(null)

  const correctAnimStyles = Object.keys(ANIMATION_STYLES) as AnimationStyle[]
  const wrongAnimStyles = Object.keys(WRONG_ANIMATION_STYLES) as WrongAnimationStyle[]
  const rookCorrectStyle = useMemo(() => correctAnimStyles[Math.floor(Math.random() * correctAnimStyles.length)], [correctAnimStyles])
  const rookWrongStyle = useMemo(() => wrongAnimStyles[Math.floor(Math.random() * wrongAnimStyles.length)], [wrongAnimStyles])

  return (
    <div className="h-full bg-chess-page flex flex-col overflow-hidden">
      {/* ─── Header ─── */}
      <div className="bg-chess-page border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button className="text-chess-text-faint" onClick={() => setPopup('none')}>✕</button>
          <div className="flex-1 mx-4">
            <ChessProgressBar current={4} total={10} streak={0} />
          </div>
        </div>
      </div>

      {/* ─── Board + below-board area ─── */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-auto">
        <div className="w-full max-w-lg relative">
          <ChessPathBoard
            options={{
              position: STARTING_FEN,
              boardOrientation: 'white',
              allowDragging: false,
              boardStyle: {
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              },
              darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
              lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
            }}
          />
        </div>

        {/* ─── PuzzleResultPopup below board ─── */}
        <div className="w-full max-w-lg">
          {popup === 'correct' && (
            <PuzzleResultPopup
              key={`correct-${correctCount}`}
              type="correct"
              message="Nice! Bb5 targets the knight defending e5."
              onContinue={() => setPopup('none')}
              rookAnimationStyle={rookCorrectStyle}
              rookProgressRef={rookProgressRef}
              rookCurrentStage={correctCount}
            />
          )}
          {popup === 'wrong' && (
            <PuzzleResultPopup
              key="wrong"
              type="incorrect"
              message="Not quite — try again"
              onContinue={() => setPopup('none')}
              showSolution={false}
              rookWrongStyle={rookWrongStyle}
              rookWrongRef={rookWrongRef}
            />
          )}

          {/* Controls */}
          {popup === 'none' && (
            <div className="py-4 space-y-3">
              <p className="text-xs font-bold text-chess-text-muted uppercase tracking-wide">In-lesson popup</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCorrectCount(c => c + 1); setPopup('correct') }}
                  className="flex-1 py-2.5 bg-chess-green text-white rounded-xl font-bold text-sm active:brightness-90"
                >
                  Correct
                </button>
                <button
                  onClick={() => setPopup('wrong')}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm active:brightness-90"
                >
                  Wrong
                </button>
              </div>

              <p className="text-xs font-bold text-chess-text-muted uppercase tracking-wide pt-2">Lesson complete (all modal now)</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPopup('learn-pass')}
                  className="flex-1 py-2.5 bg-chess-green text-white rounded-xl font-bold text-sm active:brightness-90"
                >
                  Learn 5/6
                </button>
                <button
                  onClick={() => setPopup('learn-fail')}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm active:brightness-90"
                >
                  Learn 2/6
                </button>
                <button
                  onClick={() => setPopup('opening')}
                  className="flex-1 py-2.5 text-white rounded-xl font-bold text-sm active:brightness-90"
                  style={{ backgroundColor: '#FF9600' }}
                >
                  Opening
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── ActivityComplete screens ─── */}
      {popup === 'learn-pass' && (
        <ActivityComplete
          source="path"
          mode="terminal"
          correctCount={5}
          totalCount={6}
          activityName="Forks & Skewers"
          onContinue={() => setPopup('none')}
        />
      )}
      {popup === 'learn-fail' && (
        <ActivityComplete
          source="path"
          mode="terminal"
          correctCount={2}
          totalCount={6}
          activityName="Discovered Attacks"
          onContinue={() => setPopup('none')}
          onRetry={() => setPopup('none')}
        />
      )}
      {popup === 'opening' && (
        <ActivityComplete
          source="opening"
          mode="terminal"
          activityName="Main Line 1: The Opening Moves"
          accentColor="#FF9600"
          onContinue={() => setPopup('none')}
        />
      )}
    </div>
  )
}
