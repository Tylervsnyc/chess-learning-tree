'use client'

import { useState, useRef } from 'react'
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup'
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

export default function TestOpeningRook() {
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showCorrect, setShowCorrect] = useState(false)
  const [showWrong, setShowWrong] = useState(false)

  const correctAnimStyles = Object.keys(ANIMATION_STYLES) as AnimationStyle[]
  const wrongAnimStyles = Object.keys(WRONG_ANIMATION_STYLES) as WrongAnimationStyle[]
  const rookCorrectStyle = correctAnimStyles[correctCount % correctAnimStyles.length]
  const rookWrongStyle = wrongAnimStyles[wrongCount % wrongAnimStyles.length]

  const rookProgressRef = useRef<RookProgressAnimationRef>(null)
  const rookWrongRef = useRef<RookWrongAnimationRef>(null)

  const triggerCorrect = () => {
    setShowCorrect(true)
    setShowWrong(false)
    setCorrectCount(c => c + 1)
  }

  const triggerWrong = () => {
    setShowWrong(true)
    setShowCorrect(false)
    setWrongCount(c => c + 1)
  }

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="p-4">
        <h1 className="text-lg font-bold text-chess-text mb-2">In-Lesson Rook Popup Test</h1>
        <p className="text-sm text-chess-text-muted mb-4">
          Now uses the real PuzzleResultPopup — identical to /learn.
        </p>
        <div className="flex gap-3 mb-6">
          <button onClick={triggerCorrect} className="px-4 py-2 bg-chess-green text-white rounded-lg font-medium text-sm">
            Correct
          </button>
          <button onClick={triggerWrong} className="px-4 py-2 bg-chess-red text-white rounded-lg font-medium text-sm">
            Wrong
          </button>
          <button onClick={() => { setShowCorrect(false); setShowWrong(false) }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm">
            Reset
          </button>
        </div>
        <p className="text-xs text-chess-text-faint mb-2">
          Style: {showCorrect ? rookCorrectStyle : showWrong ? rookWrongStyle : '—'}
        </p>
      </div>

      {/* Fake board area */}
      <div className="mx-4 bg-amber-800/20 rounded-t-lg" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-chess-text-faint text-sm">(board area)</span>
      </div>

      {/* The actual PuzzleResultPopup — same component as /learn */}
      <div>
        {showCorrect && (
          <PuzzleResultPopup
            type="correct"
            message="That's the Giuoco Piano! Bishop to c4 controls the center."
            onContinue={() => setShowCorrect(false)}
            rookAnimationStyle={rookCorrectStyle}
            rookProgressRef={rookProgressRef}
            rookCurrentStage={correctCount}
          />
        )}

        {showWrong && (
          <PuzzleResultPopup
            type="incorrect"
            message="Not quite — try again!"
            onContinue={() => setShowWrong(false)}
            rookWrongStyle={rookWrongStyle}
            rookWrongRef={rookWrongRef}
          />
        )}
      </div>
    </div>
  )
}
