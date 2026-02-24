'use client'

import { useEffect, useMemo, useRef } from 'react'
import { BreathingRook } from '@/components/ui/BreathingRook'
import { getRandomOpeningQuote } from '@/data/openings/opening-celebration-quotes'

interface OpeningLessonCompleteProps {
  lessonTitle: string
  /** Opening accent color */
  accentColor?: string
  onContinue: () => void
}

export function OpeningLessonComplete({
  lessonTitle,
  accentColor = '#FF9600',
  onContinue,
}: OpeningLessonCompleteProps) {
  const ref = useRef<HTMLDivElement>(null)
  const quote = useMemo(() => getRandomOpeningQuote(), [])

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '0'
      ref.current.style.transform = 'scale(0.95)'
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
          ref.current.style.opacity = '1'
          ref.current.style.transform = 'scale(1)'
        }
      })
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-chess-surface rounded-2xl mx-6 p-6 text-center max-w-sm w-full shadow-xl">
        {/* Breathing Rook */}
        <div className="mx-auto mb-4">
          <BreathingRook size="lg" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-chess-text mb-1">
          Lesson Complete!
        </h2>
        <p className="text-sm text-chess-text-muted mb-6">
          {lessonTitle}
        </p>

        {/* Encouragement */}
        <p className="text-sm text-chess-text mb-6 italic">
          &ldquo;{quote}&rdquo;
        </p>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl font-bold text-white text-base active:brightness-90 transition-all"
          style={{ backgroundColor: accentColor }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
