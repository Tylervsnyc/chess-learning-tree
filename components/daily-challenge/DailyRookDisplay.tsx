'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ROOK_BLOCKS, ROOK_FILL_ORDER } from '@/lib/daily-rook-blocks';

export type BlockResult = 'correct' | 'wrong' | 'pending';

interface DailyRookDisplayProps {
  results: BlockResult[]; // 22 entries, one per puzzle in fill order
  lives: number;
  maxLives: number;
  timeLeft: number; // ms remaining
  mode: 'demo' | 'playing' | 'finished';
  totalTime?: number; // ms total for finished display
  statusNode?: React.ReactNode; // Status text to show in playing mode right column
}

// Grid sizing
const GRID_COLS = 5;
const GRID_ROWS = 6;

// Colors (light theme — matches /learn bg #eef6fc)
const PENDING_BG = '#dce8f0';
const PENDING_BORDER = '#c5d4de';
const WRONG_BG = '#c5d4de';

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Build a lookup: for each block index in ROOK_BLOCKS, what fill position (0-21) does it have?
const blockToFillPosition = new Map<number, number>();
ROOK_FILL_ORDER.forEach((blockIdx, fillPos) => {
  blockToFillPosition.set(blockIdx, fillPos);
});

export function DailyRookDisplay({
  results,
  lives,
  maxLives,
  timeLeft,
  mode,
  totalTime,
  statusNode,
}: DailyRookDisplayProps) {
  // Track previous results to detect changes for animation
  const prevResultsRef = useRef<BlockResult[]>(results);
  const [animatingBlocks, setAnimatingBlocks] = useState<Set<number>>(new Set());
  const [shakingHeartIndex, setShakingHeartIndex] = useState<number | null>(null);
  const prevLivesRef = useRef(lives);

  // Demo mode state
  const [demoResults, setDemoResults] = useState<BlockResult[]>(Array(22).fill('pending'));
  const [demoLives, setDemoLives] = useState(maxLives);
  const [demoTime, setDemoTime] = useState(30000);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const demoStepRef = useRef(0);

  // Detect block changes and trigger animations
  useEffect(() => {
    if (mode === 'demo') return;
    const prev = prevResultsRef.current;
    const newAnimating = new Set<number>();

    results.forEach((result, i) => {
      if (prev[i] !== result && result !== 'pending') {
        newAnimating.add(i);
      }
    });

    if (newAnimating.size > 0) {
      setAnimatingBlocks(newAnimating);
      const timer = setTimeout(() => setAnimatingBlocks(new Set()), 500);
      prevResultsRef.current = results;
      return () => clearTimeout(timer);
    }

    prevResultsRef.current = results;
  }, [results, mode]);

  // Detect heart loss and trigger shake
  useEffect(() => {
    if (mode === 'demo') return;
    if (lives < prevLivesRef.current) {
      // Shake the heart that was just lost (the one at index = lives, since it just went from filled to empty)
      setShakingHeartIndex(lives);
      const timer = setTimeout(() => setShakingHeartIndex(null), 600);
      prevLivesRef.current = lives;
      return () => clearTimeout(timer);
    }
    prevLivesRef.current = lives;
  }, [lives, mode]);

  // Demo animation loop
  const runDemo = useCallback(() => {
    demoStepRef.current = 0;
    setDemoResults(Array(22).fill('pending'));
    setDemoLives(maxLives);
    setDemoTime(30000);

    // Script: fill blocks one by one. Block 7 (8th puzzle) is wrong.
    const WRONG_PUZZLE = 7;
    const DEMO_SPEED = 350; // ms per step
    let step = 0;
    let currentLives = maxLives;
    let currentTime = 30000;

    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);

    demoIntervalRef.current = setInterval(() => {
      if (step >= 22) {
        // Pause at end, then reset
        setTimeout(() => {
          step = 0;
          setDemoResults(Array(22).fill('pending'));
          setDemoLives(maxLives);
          setDemoTime(30000);
          currentLives = maxLives;
          currentTime = 30000;
        }, 2000);
        if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
        // Restart after pause
        setTimeout(() => runDemo(), 3000);
        return;
      }

      const isWrong = step === WRONG_PUZZLE;
      setDemoResults(prev => {
        const next = [...prev];
        next[step] = isWrong ? 'wrong' : 'correct';
        return next;
      });

      if (isWrong) {
        currentLives--;
        setDemoLives(currentLives);
      }

      currentTime -= 1200;
      setDemoTime(Math.max(0, currentTime));
      step++;
    }, DEMO_SPEED);
  }, [maxLives]);

  useEffect(() => {
    if (mode === 'demo') {
      runDemo();
      return () => {
        if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      };
    }
  }, [mode, runDemo]);

  // Pick the active data source
  const activeResults = mode === 'demo' ? demoResults : results;
  const activeLives = mode === 'demo' ? demoLives : lives;
  const activeTime = mode === 'demo' ? demoTime : (mode === 'finished' && totalTime != null ? totalTime : timeLeft);
  const isTimeLow = mode === 'playing' && timeLeft < 30000;

  // Playing mode: side-by-side layout (rook left, stats right)
  if (mode === 'playing') {
    return (
      <div className="flex items-center justify-center gap-3 px-3 pb-1 pt-1 flex-shrink-0">
        {/* Rook grid — left */}
        <RookGrid
          results={activeResults}
          animatingBlocks={animatingBlocks}
        />

        {/* Stats — right */}
        <div className="flex flex-col items-center gap-2 flex-1">
          {/* Status text */}
          {statusNode && (
            <div className="text-center text-base font-bold">
              {statusNode}
            </div>
          )}

          {/* Timer card */}
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <div
              className={`text-2xl font-black tabular-nums transition-colors ${
                isTimeLow ? 'text-[#FF4B4B] animate-pulse' : 'text-[#2A3C45]'
              }`}
            >
              {formatTime(activeTime)}
            </div>
          </div>

          {/* Lives card */}
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-center gap-1.5">
            {Array.from({ length: maxLives }).map((_, i) => {
              const isFilled = i < activeLives;
              const isShaking = shakingHeartIndex === i;
              return (
                <svg
                  key={i}
                  className={`w-7 h-7 transition-all duration-300 ${
                    isFilled ? 'text-[#FF4B4B]' : 'text-[#c5d4de]'
                  } ${isShaking ? 'animate-heart-shake' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Demo + Finished: side-by-side layout (same as playing — rook left, stats right)
  return (
    <div className="flex items-center justify-center gap-3 px-3 pb-1 pt-1 flex-shrink-0">
      {/* Rook grid — left */}
      <RookGrid
        results={activeResults}
        animatingBlocks={mode === 'demo' ? new Set() : animatingBlocks}
      />

      {/* Stats — right */}
      <div className="flex flex-col items-center gap-2 flex-1">
        {/* Timer card */}
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
          <div
            className={`text-2xl font-black tabular-nums transition-colors ${
              isTimeLow ? 'text-[#FF4B4B] animate-pulse' : 'text-[#2A3C45]'
            }`}
          >
            {mode === 'finished' && totalTime != null
              ? formatTime(totalTime)
              : formatTime(activeTime)}
          </div>
        </div>

        {/* Lives card */}
        <div className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-center gap-1.5">
          {Array.from({ length: maxLives }).map((_, i) => {
            const isFilled = i < activeLives;
            const isShaking = shakingHeartIndex === i;
            return (
              <svg
                key={i}
                className={`w-7 h-7 transition-all duration-300 ${
                  isFilled ? 'text-[#FF4B4B]' : 'text-[#c5d4de]'
                } ${isShaking ? 'animate-heart-shake' : ''}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Renders the rook shape as a CSS grid of blocks
function RookGrid({
  results,
  animatingBlocks,
}: {
  results: BlockResult[];
  animatingBlocks: Set<number>;
}) {
  // Each cell is a square. We use absolute positioning within a relative container.
  // Block size adapts to screen width.
  const blockSize = 'clamp(24px, 10vw, 42px)';
  const gap = 'clamp(2px, 0.8vw, 4px)';

  return (
    <div
      className="relative"
      style={{
        // Total width: GRID_COLS blocks + (GRID_COLS-1) gaps
        width: `calc(${GRID_COLS} * ${blockSize} + ${GRID_COLS - 1} * ${gap})`,
        height: `calc(${GRID_ROWS} * ${blockSize} + ${GRID_ROWS - 1} * ${gap})`,
      }}
    >
      {ROOK_BLOCKS.map((block, blockIdx) => {
        const fillPos = blockToFillPosition.get(blockIdx);
        if (fillPos === undefined) return null;
        const result = results[fillPos];
        const isAnimating = animatingBlocks.has(fillPos);

        return (
          <RookBlockCell
            key={blockIdx}
            x={block.x}
            y={block.y}
            color={block.color}
            result={result}
            isAnimating={isAnimating}
            puzzleNumber={fillPos + 1}
            blockSize={blockSize}
            gap={gap}
          />
        );
      })}
    </div>
  );
}

function RookBlockCell({
  x,
  y,
  color,
  result,
  isAnimating,
  puzzleNumber,
  blockSize,
  gap,
}: {
  x: number;
  y: number;
  color: string;
  result: BlockResult;
  isAnimating: boolean;
  puzzleNumber: number;
  blockSize: string;
  gap: string;
}) {
  const isCorrect = result === 'correct';
  const isWrong = result === 'wrong';
  const isPending = result === 'pending';

  let bgColor: string;
  let borderStyle: string;
  let shadowStyle: string;
  let numberColor: string;

  if (isCorrect) {
    bgColor = color;
    borderStyle = 'none';
    shadowStyle = `0 3px 0 rgba(0,0,0,0.2), 0 4px 12px ${color}40`;
    numberColor = 'rgba(255,255,255,0.9)';
  } else if (isWrong) {
    bgColor = WRONG_BG;
    borderStyle = `1px solid ${PENDING_BORDER}`;
    shadowStyle = '0 2px 0 rgba(0,0,0,0.06)';
    numberColor = 'rgba(0,0,0,0.15)';
  } else {
    bgColor = PENDING_BG;
    borderStyle = `1px solid ${PENDING_BORDER}`;
    shadowStyle = 'none';
    numberColor = 'rgba(0,0,0,0.12)';
  }

  // Animation class
  let animClass = '';
  if (isAnimating && isCorrect) {
    animClass = 'animate-block-pop';
  } else if (isAnimating && isWrong) {
    animClass = 'animate-block-shake';
  }

  return (
    <div
      className={`absolute flex items-center justify-center transition-colors duration-300 ${animClass}`}
      style={{
        left: `calc(${x} * (${blockSize} + ${gap}))`,
        top: `calc(${y} * (${blockSize} + ${gap}))`,
        width: blockSize,
        height: blockSize,
        borderRadius: 'clamp(4px, 1vw, 8px)',
        backgroundColor: bgColor,
        border: borderStyle,
        boxShadow: shadowStyle,
        // 3D depth gradient for correct blocks (matching OG route style)
        backgroundImage: isCorrect
          ? 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.08) 100%)'
          : isPending
            ? 'none'
            : 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.03) 100%)',
      }}
    >
      <span
        className="font-black select-none"
        style={{
          fontSize: `calc(${blockSize} * 0.32)`,
          color: numberColor,
          textShadow: isCorrect ? '0 1px 2px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        {puzzleNumber}
      </span>
    </div>
  );
}
