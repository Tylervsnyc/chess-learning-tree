'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Chess, Square } from 'chess.js'
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard'
import { ChessProgressBar } from '@/components/puzzle/ChessProgressBar'
import { OpeningLessonComplete } from '@/components/openings/OpeningLessonComplete'
import {
  RookProgressAnimation,
  RookProgressAnimationRef,
  ANIMATION_STYLES,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation'
import {
  RookWrongAnimation,
  RookWrongAnimationRef,
  WRONG_ANIMATION_STYLES,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation'
import { BOARD_COLORS } from '@/lib/puzzle-utils'
import {
  playCorrectSound,
  playMoveSound,
  playErrorSound,
  playCelebrationSound,
  warmupAudio,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds'
import { useAudioWarmup } from '@/hooks/useAudioWarmup'
import { getRuyLopezLesson } from '@/data/openings/ruy-lopez-lessons'
import { getPircLesson } from '@/data/openings/pirc-lessons'
import { getItalianLesson } from '@/data/openings/italian-lessons'
import type { OpeningLesson, LessonStep, PlayMoveStep, QuizStep } from '@/types/opening-lesson'

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function getCorrectMoveSquares(step: PlayMoveStep): { from: Square; to: Square } | null {
  try {
    const game = new Chess(step.fen)
    const move = game.move(step.correctMove)
    if (!move) return null
    return { from: move.from as Square, to: move.to as Square }
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════
// ANIMATED GUIDE ARROW (blue flowing rectangles)
// ═══════════════════════════════════════════

function AnimatedGuideArrow({
  from,
  to,
  orientation,
}: {
  from: Square
  to: Square
  orientation: 'white' | 'black'
}) {
  const toPercent = (sq: string) => {
    const file = sq.charCodeAt(0) - 97
    const rank = parseInt(sq[1]) - 1
    const col = orientation === 'white' ? file : 7 - file
    const row = orientation === 'white' ? 7 - rank : rank
    return { x: (col + 0.5) * 12.5, y: (row + 0.5) * 12.5 }
  }

  const s = toPercent(from)
  const e = toPercent(to)
  const dx = e.x - s.x
  const dy = e.y - s.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / len
  const ny = dy / len
  const px = -ny
  const py = nx

  // Arrowhead
  const headSize = 5
  const stemEnd = { x: e.x - nx * headSize, y: e.y - ny * headSize }
  const tip = e
  const hL = { x: stemEnd.x + px * headSize * 0.7, y: stemEnd.y + py * headSize * 0.7 }
  const hR = { x: stemEnd.x - px * headSize * 0.7, y: stemEnd.y - py * headSize * 0.7 }

  const headGradId = `matte-head-${from}-${to}`
  const stemGradId = `matte-stem-${from}-${to}`

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <defs>
        {/* Matte gradient along the stem direction (light→base→dark) */}
        <linearGradient id={stemGradId} x1={s.x} y1={s.y} x2={stemEnd.x} y2={stemEnd.y} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6BA3E8" />
          <stop offset="20%" stopColor="#4A82C7" />
          <stop offset="100%" stopColor="#3568A6" />
        </linearGradient>
        {/* Matte gradient for arrowhead */}
        <linearGradient id={headGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BA3E8" />
          <stop offset="30%" stopColor="#4A82C7" />
          <stop offset="100%" stopColor="#2A5590" />
        </linearGradient>
      </defs>

      {/* Animated flowing dashes (matte blue, solid) */}
      <line
        x1={s.x} y1={s.y} x2={stemEnd.x} y2={stemEnd.y}
        stroke={`url(#${stemGradId})`}
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeDasharray="4 6"
        className="opening-arrow-flow"
      />

      {/* Solid matte arrowhead */}
      <polygon
        points={`${tip.x},${tip.y} ${hL.x},${hL.y} ${hR.x},${hR.y}`}
        fill={`url(#${headGradId})`}
        stroke="#2A5590"
        strokeWidth={0.4}
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ═══════════════════════════════════════════
// LESSON PLAYER PAGE
// ═══════════════════════════════════════════

export default function OpeningLessonPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const lessonId = params.lessonId as string

  useAudioWarmup()

  const lesson = useMemo((): OpeningLesson | undefined => {
    const lookups: Record<string, (id: string) => OpeningLesson | undefined> = {
      'ruy-lopez': getRuyLopezLesson,
      'pirc-defense': getPircLesson,
      'italian': getItalianLesson,
    }
    return lookups[slug]?.(lessonId)
  }, [slug, lessonId])

  // ─── State ───
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [boardFen, setBoardFen] = useState('')
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white')
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [moveStatus, setMoveStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting')
  const [showComplete, setShowComplete] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [activePostMoveArrow, setActivePostMoveArrow] = useState<[Square, Square] | null>(null)

  // For puzzle steps
  const [puzzleMoveIndex, setPuzzleMoveIndex] = useState(0)
  const [puzzleFen, setPuzzleFen] = useState('')

  const advancingRef = useRef(false)
  const prevOrientationRef = useRef(boardOrientation)
  // Disable animation when orientation flips so pieces don't glitch
  const orientationJustChanged = prevOrientationRef.current !== boardOrientation
  useEffect(() => { prevOrientationRef.current = boardOrientation }, [boardOrientation])

  // ─── Rook animation ───
  const correctAnimStyles = Object.keys(ANIMATION_STYLES) as AnimationStyle[]
  const wrongAnimStyles = Object.keys(WRONG_ANIMATION_STYLES) as WrongAnimationStyle[]
  const [lessonAnimIndex] = useState(() => Math.floor(Math.random() * correctAnimStyles.length))
  const [wrongAnimCount, setWrongAnimCount] = useState(() => Math.floor(Math.random() * wrongAnimStyles.length))
  const rookCorrectStyle = correctAnimStyles[lessonAnimIndex % correctAnimStyles.length]
  const rookWrongStyle = wrongAnimStyles[wrongAnimCount % wrongAnimStyles.length]
  const rookProgressRef = useRef<RookProgressAnimationRef>(null)
  const rookWrongRef = useRef<RookWrongAnimationRef>(null)

  // ─── Init first step ───
  useEffect(() => {
    if (!lesson) return
    const step = lesson.steps[0]
    setBoardFen(step.fen)
    setBoardOrientation(step.orientation || lesson.defaultOrientation)
  }, [lesson])

  const currentStep = lesson?.steps[currentStepIndex]

  const getStepOrientation = useCallback((step: LessonStep) => {
    return step.orientation || lesson?.defaultOrientation || 'white'
  }, [lesson])

  // ─── Advance to next step ───
  const advanceStep = useCallback(() => {
    if (!lesson || advancingRef.current) return
    advancingRef.current = true
    const nextIndex = currentStepIndex + 1

    if (nextIndex >= lesson.steps.length) {
      playCelebrationSound()
      setShowComplete(true)
      advancingRef.current = false
      return
    }

    const nextStep = lesson.steps[nextIndex]
    setCurrentStepIndex(nextIndex)
    setBoardFen(nextStep.fen)
    setBoardOrientation(getStepOrientation(nextStep))
    setWrongAttempts(0)
    setSelectedSquare(null)
    setMoveStatus('waiting')
    setActivePostMoveArrow(null)
    setPuzzleMoveIndex(0)
    setPuzzleFen('')
    advancingRef.current = false
  }, [lesson, currentStepIndex, getStepOrientation])

  // ─── Auto-advance for instruction steps with autoAdvance ───
  useEffect(() => {
    if (currentStep?.type === 'instruction' && currentStep.autoAdvance) {
      const delay = currentStep.autoAdvance
      const timer = setTimeout(() => advanceStep(), delay)
      return () => clearTimeout(timer)
    }
  }, [currentStep, advanceStep])

  // ─── Handle play-move ───
  const handlePlayMove = useCallback((from: Square, to: Square) => {
    if (!currentStep || currentStep.type !== 'play-move') return false
    if (moveStatus !== 'waiting') return false

    if (wrongAttempts >= 2) {
      // After 2 wrong attempts, only allow correct moves (primary + accepted)
      const allCorrect = [currentStep.correctMove, ...(currentStep.acceptMoves || [])]
      const isAllowed = allCorrect.some(san => {
        try {
          const g = new Chess(currentStep.fen)
          const m = g.move(san)
          return m && m.from === from && m.to === to
        } catch { return false }
      })
      if (!isAllowed) return false
    }

    try {
      const game = new Chess(currentStep.fen)
      const move = game.move({ from, to, promotion: 'q' })
      if (!move) return false

      const isCorrect = move.san === currentStep.correctMove ||
        (currentStep.acceptMoves?.includes(move.san) ?? false)

      if (isCorrect) {
        setBoardFen(game.fen())
        setSelectedSquare(null)
        setMoveStatus('correct')
        setCorrectCount(prev => prev + 1)
        playCorrectSound(correctCount)
        vibrateOnCorrect()

        // Trigger rook progress
        setTimeout(() => rookProgressRef.current?.triggerNextStage(), 150)

        if (currentStep.postMoveArrow) {
          const arrow = currentStep.postMoveArrow
          setTimeout(() => setActivePostMoveArrow(arrow), 350)
          setTimeout(() => advanceStep(), 2000)
        } else {
          setTimeout(() => advanceStep(), 1000)
        }
        return true
      } else {
        setBoardFen(game.fen())
        playErrorSound()
        vibrateOnError()

        // Trigger wrong rook animation
        setWrongAnimCount(prev => prev + 1)
        setTimeout(() => rookWrongRef.current?.triggerAnimation(), 250)

        const newAttempts = wrongAttempts + 1
        setWrongAttempts(newAttempts)
        setMoveStatus('wrong')

        setTimeout(() => {
          setBoardFen(currentStep.fen)
          setSelectedSquare(null)
          setMoveStatus('waiting')
        }, 600)

        return true
      }
    } catch {
      return false
    }
  }, [currentStep, moveStatus, correctCount, wrongAttempts, advanceStep])

  // ─── Handle puzzle move ───
  const handlePuzzleMove = useCallback((from: Square, to: Square) => {
    if (!currentStep || currentStep.type !== 'puzzle') return false
    if (moveStatus !== 'waiting') return false

    const fen = puzzleFen || currentStep.fen
    try {
      const game = new Chess(fen)
      const expectedSan = currentStep.solutionMoves[puzzleMoveIndex]
      const move = game.move({ from, to, promotion: 'q' })
      if (!move) return false

      if (move.san === expectedSan) {
        setBoardFen(game.fen())
        setPuzzleFen(game.fen())
        setSelectedSquare(null)
        playMoveSound()
        vibrateOnCorrect()

        const nextIdx = puzzleMoveIndex + 1
        if (nextIdx >= currentStep.solutionMoves.length) {
          setCorrectCount(prev => prev + 1)
          playCorrectSound(correctCount)
          setMoveStatus('correct')
          setTimeout(() => rookProgressRef.current?.triggerNextStage(), 150)
          return true
        }

        const opponentMove = currentStep.solutionMoves[nextIdx]
        setTimeout(() => {
          try {
            const g2 = new Chess(game.fen())
            g2.move(opponentMove)
            setBoardFen(g2.fen())
            setPuzzleFen(g2.fen())
            setPuzzleMoveIndex(nextIdx + 1)
            playMoveSound()
          } catch { /* ignore */ }
        }, 300)
        return true
      } else {
        setBoardFen(game.fen())
        playErrorSound()
        vibrateOnError()
        setWrongAnimCount(prev => prev + 1)
        setTimeout(() => rookWrongRef.current?.triggerAnimation(), 250)
        setWrongAttempts(prev => prev + 1)
        setMoveStatus('wrong')
        setTimeout(() => {
          setBoardFen(fen)
          setSelectedSquare(null)
          setMoveStatus('waiting')
        }, 600)
        return true
      }
    } catch {
      return false
    }
  }, [currentStep, moveStatus, puzzleFen, puzzleMoveIndex, correctCount])

  // ─── Square click ───
  const handleSquareClick = useCallback((square: Square) => {
    if (!currentStep) return
    if (currentStep.type !== 'play-move' && currentStep.type !== 'puzzle') return
    if (moveStatus !== 'waiting') return

    const fen = currentStep.type === 'puzzle' ? (puzzleFen || currentStep.fen) : currentStep.fen

    try {
      const game = new Chess(fen)

      if (selectedSquare) {
        if (currentStep.type === 'play-move') {
          handlePlayMove(selectedSquare, square)
        } else {
          handlePuzzleMove(selectedSquare, square)
        }
        setSelectedSquare(null)
        return
      }

      const piece = game.get(square)
      if (piece) {
        const playerColor = currentStep.type === 'puzzle'
          ? currentStep.playerColor
          : (game.turn() === 'w' ? 'white' : 'black')
        if ((piece.color === 'w' ? 'white' : 'black') === playerColor) {
          setSelectedSquare(square)
        }
      }
    } catch { /* ignore */ }
  }, [currentStep, selectedSquare, puzzleFen, moveStatus, handlePlayMove, handlePuzzleMove])

  // ─── Piece drop ───
  const handlePieceDrop = useCallback(({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }) => {
    if (!currentStep || !targetSquare || moveStatus !== 'waiting') return true
    warmupAudio()
    if (currentStep.type === 'play-move') {
      handlePlayMove(sourceSquare as Square, targetSquare as Square)
    } else if (currentStep.type === 'puzzle') {
      handlePuzzleMove(sourceSquare as Square, targetSquare as Square)
    }
    return true
  }, [currentStep, moveStatus, handlePlayMove, handlePuzzleMove])

  // ─── Square styles ───
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {}

    if (currentStep?.type === 'play-move' && moveStatus === 'waiting') {
      if (currentStep.highlightSquares && wrongAttempts === 0) {
        for (const sq of currentStep.highlightSquares) {
          styles[sq] = { backgroundColor: 'rgba(255, 160, 0, 0.45)' }
        }
      }

      if (wrongAttempts >= 1 && !currentStep.highlightSquares) {
        const correct = getCorrectMoveSquares(currentStep)
        if (correct) {
          styles[correct.from] = { backgroundColor: 'rgba(255, 160, 0, 0.45)' }
          if (wrongAttempts >= 2) {
            styles[correct.to] = { backgroundColor: 'rgba(255, 160, 0, 0.45)' }
          }
        }
      }

      if (wrongAttempts >= 1 && currentStep.highlightSquares) {
        const correct = getCorrectMoveSquares(currentStep)
        if (correct) {
          styles[correct.from] = { backgroundColor: 'rgba(255, 160, 0, 0.45)' }
          styles[correct.to] = { backgroundColor: 'rgba(255, 160, 0, 0.45)' }
        }
      }
    }

    if (selectedSquare && moveStatus === 'waiting') {
      styles[selectedSquare] = { backgroundColor: 'rgba(255, 160, 0, 0.5)' }

      if (currentStep && (currentStep.type === 'play-move' || currentStep.type === 'puzzle')) {
        const fen = currentStep.type === 'puzzle' ? (puzzleFen || currentStep.fen) : currentStep.fen
        try {
          const game = new Chess(fen)
          const moves = game.moves({ square: selectedSquare, verbose: true })
          for (const m of moves) {
            styles[m.to] = {
              background: 'radial-gradient(circle, rgba(0,0,0,0.15) 25%, transparent 25%)',
              borderRadius: '50%',
            }
          }
        } catch { /* ignore */ }
      }
    }

    if (currentStep?.type === 'instruction' && currentStep.highlightSquares) {
      for (const sq of currentStep.highlightSquares) {
        styles[sq] = { backgroundColor: 'rgba(255, 160, 0, 0.4)', ...styles[sq] }
      }
    }

    return styles
  }, [selectedSquare, currentStep, puzzleFen, moveStatus, wrongAttempts])

  // ─── Arrows (library — for attack/instruction arrows) ───
  const arrows = useMemo(() => {
    const attackColor = 'rgba(239, 68, 68, 0.8)'
    if (activePostMoveArrow) {
      return [{
        startSquare: activePostMoveArrow[0],
        endSquare: activePostMoveArrow[1],
        color: attackColor,
      }]
    }
    if (currentStep?.type === 'instruction' && currentStep.arrow) {
      return [{
        startSquare: currentStep.arrow[0],
        endSquare: currentStep.arrow[1],
        color: attackColor,
      }]
    }
    return []
  }, [currentStep, activePostMoveArrow])

  // ─── Guide arrow (custom animated blue) ───
  const guideArrow = useMemo(() => {
    if (currentStep?.type === 'play-move' && currentStep.highlightSquares && moveStatus === 'waiting') {
      return getCorrectMoveSquares(currentStep)
    }
    return null
  }, [currentStep, moveStatus])

  const boardInteractive = moveStatus === 'waiting' &&
    (currentStep?.type === 'play-move' || currentStep?.type === 'puzzle')

  if (!lesson) {
    return (
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <p className="text-chess-text-muted">Lesson not found</p>
      </div>
    )
  }

  // ─── Progress ───
  const interactiveSteps = lesson.steps.filter(
    s => s.type === 'play-move' || s.type === 'quiz' || s.type === 'puzzle'
  )
  const completedInteractive = lesson.steps
    .slice(0, currentStepIndex)
    .filter(s => s.type === 'play-move' || s.type === 'quiz' || s.type === 'puzzle')
    .length
  const isCurrentDone = moveStatus === 'correct'
  const isCurrentInteractive = currentStep &&
    (currentStep.type === 'play-move' || currentStep.type === 'quiz' || currentStep.type === 'puzzle')
  const progressCurrent = completedInteractive + (isCurrentInteractive && isCurrentDone ? 1 : 0)

  // ─── Render feedback popup (matches PuzzleResultPopup exactly) ───
  const renderCorrectPopup = (message: string, showButton: boolean, buttonText = 'Continue', onContinue?: () => void) => (
    <div
      className="w-full py-2.5 pr-4 rounded-b-2xl bg-chess-correct-bg"
      style={{ animation: 'slideUpBounce 0.3s ease-out', paddingLeft: 16 }}
    >
      <div className="max-w-lg mx-auto flex items-center" style={{ gap: 12 }}>
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 66, height: 80 }}>
          <RookProgressAnimation
            ref={rookProgressRef}
            style={rookCorrectStyle}
            currentStage={correctCount > 0 ? correctCount - 1 : 0}
            scale={0.7}
            showProgress={false}
            showLabel={false}
            compact
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="font-bold leading-tight flex-1 text-chess-green-dark" style={{ fontSize: 15 }}>
              {message}
            </p>
          </div>
          {showButton && (
            <button
              onClick={onContinue}
              className="w-full py-1.5 bg-chess-green text-white font-bold rounded-xl uppercase tracking-wide text-[13px] shadow-[0_3px_0_var(--color-chess-green-dark)] active:translate-y-[1px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const renderWrongPopup = (message: string) => (
    <div
      className="w-full py-2.5 rounded-b-2xl bg-chess-wrong-bg"
      style={{ animation: 'fadeIn 0.2s ease-out', paddingLeft: 6, paddingRight: 16 }}
    >
      <div className="max-w-lg mx-auto flex items-center" style={{ gap: 22 }}>
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 66, height: 80 }}>
          <RookWrongAnimation
            ref={rookWrongRef}
            style={rookWrongStyle}
            scale={0.7}
            visibleStages={6}
            compact
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight text-chess-red" style={{ fontSize: 15 }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )

  // ─── Render step content below board ───
  const renderStepContent = () => {
    if (!currentStep) return null

    // ── Instruction step ──
    if (currentStep.type === 'instruction') {
      if (currentStep.autoAdvance) {
        return renderCorrectPopup(currentStep.text, false)
      }
      return renderCorrectPopup(
        currentStep.text,
        true,
        currentStep.buttonText || 'Continue',
        advanceStep,
      )
    }

    // ── Play-move step ──
    if (currentStep.type === 'play-move') {
      if (moveStatus === 'correct') {
        return renderCorrectPopup(currentStep.correctFeedback, false)
      }
      // Waiting or wrong — show prompt with "Try again" after a wrong attempt
      return (
        <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col flex-1">
          {wrongAttempts > 0 && (
            <p className="text-sm font-semibold text-chess-red mb-1">Try again</p>
          )}
          <p className="text-sm font-semibold text-chess-text mb-1">
            {currentStep.prompt}
          </p>
          {wrongAttempts >= 2 && currentStep.hint && (
            <p className="text-xs text-chess-hint-text italic">
              💡 {currentStep.hint}
            </p>
          )}
        </div>
      )
    }

    // ── Quiz step ──
    if (currentStep.type === 'quiz') {
      return <QuizStepContent step={currentStep} onComplete={advanceStep} />
    }

    // ── Puzzle step ──
    if (currentStep.type === 'puzzle') {
      if (moveStatus === 'correct') {
        return renderCorrectPopup(currentStep.correctFeedback, true, 'Continue', advanceStep)
      }
      return (
        <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col flex-1">
          <p className="text-sm font-semibold text-chess-text mb-1">
            {currentStep.prompt}
          </p>
          {wrongAttempts >= 2 && currentStep.hint && (
            <p className="text-xs text-chess-hint-text italic">
              💡 {currentStep.hint}
            </p>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="h-full bg-chess-page flex flex-col overflow-hidden">
      <style>{`
        @keyframes slideUpBounce {
          0% { opacity: 0; transform: translateY(20px); }
          70% { transform: translateY(-3px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes arrowFlow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        .opening-arrow-flow {
          animation: arrowFlow 2.5s linear infinite;
        }
      `}</style>

      {/* ─── Header (matches /learn) ─── */}
      <div className="bg-chess-page border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(`/openings/${slug}`)}
            className="text-chess-text-faint hover:text-chess-text-muted"
          >
            ✕
          </button>
          <div className="flex-1 mx-4">
            <ChessProgressBar
              current={progressCurrent}
              total={interactiveSteps.length}
              streak={0}
            />
          </div>
        </div>
      </div>

      {/* ─── Board + Content (matches /learn layout) ─── */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-auto">
        <div className="w-full max-w-lg relative">
          <ChessPathBoard
            options={{
              position: boardFen,
              boardOrientation: boardOrientation,
              onSquareClick: boardInteractive
                ? (args: { square: string }) => handleSquareClick(args.square as Square)
                : undefined,
              onPieceDrop: boardInteractive ? handlePieceDrop : undefined,
              allowDragging: boardInteractive,
              squareStyles,
              arrows,
              animationDurationInMs: orientationJustChanged ? 0 : 300,
              boardStyle: {
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              },
              darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
              lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
            }}
          />
          {guideArrow && (
            <AnimatedGuideArrow
              from={guideArrow.from}
              to={guideArrow.to}
              orientation={boardOrientation}
            />
          )}
        </div>
        <div className="w-full max-w-lg">
          {renderStepContent()}
        </div>
      </div>

      {showComplete && (
        <OpeningLessonComplete
          lessonTitle={lesson.title}
          accentColor="#FF9600"
          onContinue={() => router.push(`/openings/${slug}`)}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════
// QUIZ STEP (inline component)
// ═══════════════════════════════════════════

function QuizStepContent({ step, onComplete }: { step: QuizStep; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null
  const isCorrect = selected === step.correctIndex

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
  }

  if (answered) {
    return (
      <div
        className={`w-full py-3 px-4 rounded-b-2xl ${isCorrect ? 'bg-chess-correct-bg' : 'bg-chess-wrong-bg'}`}
        style={{ animation: 'slideUpBounce 0.3s ease-out' }}
      >
        <div className="max-w-lg mx-auto">
          <p className={`font-bold mb-1 ${isCorrect ? 'text-chess-green-dark' : 'text-chess-red'}`} style={{ fontSize: 15 }}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </p>
          <p className="text-sm text-chess-text mb-3 leading-relaxed">{step.explanation}</p>
          <button
            onClick={onComplete}
            className={`w-full py-1.5 font-bold rounded-xl uppercase tracking-wide text-[13px] transition-all active:translate-y-[1px] ${
              isCorrect
                ? 'bg-chess-green text-white shadow-[0_3px_0_var(--color-chess-green-dark)] active:shadow-[0_2px_0_var(--color-chess-green-dark)]'
                : 'bg-chess-red text-white shadow-[0_3px_0_var(--color-chess-red-shadow)] active:shadow-[0_2px_0_var(--color-chess-red-shadow)]'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col flex-1">
      <p className="text-sm font-semibold text-chess-text mb-3">{step.question}</p>
      <div className="flex flex-col gap-2">
        {step.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className="bg-chess-surface border border-gray-200 rounded-xl px-3 py-2.5 text-left text-sm text-chess-text active:bg-gray-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

