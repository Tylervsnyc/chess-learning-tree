'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ActionButton } from '@/components/ui/ActionButton';
import { useRookieVoice } from '@/hooks/useRookieVoice';
import { warmupAudio } from '@/lib/sounds';
import {
  ROOKIE_LEVELS,
  getContextualGreeting,
  type GreetingContext,
} from '@/lib/rookie-levels';

// Prototype page — keeps its own copy now that production has no win counter
// (Rookie is matched to your rating; see RULES.md §20b).
const WINS_TO_ADVANCE = 3;

// ════════════════════════════════
// LEVEL PROGRESS BAR
// ════════════════════════════════

function LevelProgressBar({ currentLevel, winsAtLevel }: { currentLevel: number; winsAtLevel: number }) {
  const levelPct = (lvl: number) => ((lvl - 1) / 9) * 100;
  const fillPct = levelPct(currentLevel) + (winsAtLevel / WINS_TO_ADVANCE) * (100 / 9);

  return (
    <div className="w-full">
      {/* Level numbers above */}
      <div className="relative h-4 mb-1">
        {ROOKIE_LEVELS.map((l) => {
          const pos = levelPct(l.level);
          const isCompleted = l.level < currentLevel;
          const isCurrent = l.level === currentLevel;
          return (
            <span
              key={l.level}
              className={`absolute -translate-x-1/2 text-[10px] font-bold tabular-nums ${
                isCurrent ? 'text-chess-green'
                  : isCompleted ? 'text-chess-text-muted' : 'text-chess-disabled'
              }`}
              style={{ left: `${pos}%` }}
            >
              {l.level}
            </span>
          );
        })}
      </div>
      {/* Bar track */}
      <div className="relative h-3.5 rounded-full overflow-hidden bg-slate-200"
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)' }}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(fillPct, 1)}%`,
            background: 'linear-gradient(to right, #58CC02, #6EE018)',
            boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        />
        {/* Shine */}
        <div
          className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
          style={{
            width: `${Math.max(fillPct, 1)}%`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 50%)',
          }}
        />
        {/* Level divider lines (skip level 1 at 0% and level 10 at 100%) */}
        {ROOKIE_LEVELS.slice(1, -1).map((l) => {
          const pos = levelPct(l.level);
          const isCompleted = l.level < currentLevel;
          return (
            <div
              key={l.level}
              className="absolute top-0 bottom-0 w-[2px] z-10"
              style={{
                left: `${pos}%`,
                background: isCompleted
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.12)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════
// WINS INDICATOR
// ════════════════════════════════

function WinsIndicator({ wins, needed, nextLevel }: { wins: number; needed: number; nextLevel: number }) {
  if (nextLevel > 10) {
    return (
      <div className="text-center">
        <span className="text-xs font-bold text-chess-gold">MAX LEVEL</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: needed }).map((_, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              i < wins
                ? 'bg-chess-green text-white scale-105'
                : 'bg-slate-200'
            }`}
            style={i < wins ? {
              boxShadow: '0 2px 0 var(--color-chess-green-dark)',
            } : {
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
            }}
          >
            {i < wins && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <span className="text-xs text-chess-text-muted font-semibold">
        {wins === 0
          ? `Win ${needed} to reach Level ${nextLevel}`
          : `${needed - wins} more win${needed - wins !== 1 ? 's' : ''} to Level ${nextLevel}`
        }
      </span>
    </div>
  );
}

// ════════════════════════════════
// PAGE
// ════════════════════════════════

export default function PlayDesignPreview() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(5);
  const [winsAtLevel, setWinsAtLevel] = useState(0);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [greetingContext, setGreetingContext] = useState<GreetingContext>({ type: 'default' });
  const [quipKey, setQuipKey] = useState(0); // force re-roll on context change

  const [audioOn, setAudioOn] = useState(false);
  const { speakQuip, talkIntensity, isTalking } = useRookieVoice(audioOn);

  const rookieLevel = ROOKIE_LEVELS[currentLevel - 1];
  const greeting = getContextualGreeting(greetingContext, currentLevel);

  // Enable audio on first interaction (iOS requirement)
  const enableAudio = () => {
    if (!audioOn) {
      warmupAudio();
      setAudioOn(true);
    }
  };

  // Speak the greeting when it changes (only if audio is on)
  useEffect(() => {
    if (!audioOn) return;
    const timer = setTimeout(() => {
      speakQuip(greeting.quote);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quipKey, audioOn]);

  // Demo controls
  const addWin = () => {
    if (winsAtLevel + 1 >= WINS_TO_ADVANCE && currentLevel < 10) {
      setCurrentLevel(currentLevel + 1);
      setWinsAtLevel(0);
    } else if (currentLevel < 10) {
      setWinsAtLevel(winsAtLevel + 1);
    }
    setGreetingContext({ type: 'default' });
    setQuipKey(k => k + 1);
  };

  const resetDemo = () => {
    setCurrentLevel(1);
    setWinsAtLevel(0);
    setGreetingContext({ type: 'default' });
    setQuipKey(k => k + 1);
  };

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col overflow-auto" onClick={enableAudio} onTouchStart={enableAudio}>
      {/* Top section: Level bar */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <LevelProgressBar currentLevel={currentLevel} winsAtLevel={winsAtLevel} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4">
        <div className="w-full max-w-sm space-y-5">

          {/* Level badge + Rookie */}
          <div className="flex flex-col items-center gap-2">
            {/* Level badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(88,204,2,0.12), rgba(88,204,2,0.06))',
                border: '1px solid rgba(88,204,2,0.2)',
              }}
            >
              <span className="text-chess-green font-black text-sm">LV. {currentLevel}</span>
              <span className="text-chess-text-muted font-semibold text-xs">&middot;</span>
              <span className="text-chess-text-muted font-semibold text-xs">{rookieLevel.title}</span>
            </div>

            {/* Rookie */}
            <div className="my-1">
              <BreathingRook
                size="lg"
                mood={greeting.mood}
                animate={!isTalking}
                talkIntensity={isTalking ? talkIntensity : undefined}
              />
            </div>

            {/* Speech bubble — fixed height so layout doesn't shift */}
            <div className="relative w-full h-[88px]" key={quipKey}>
              <div
                className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
                style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
              />
              <div className="relative bg-white rounded-2xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] h-full flex items-center justify-center">
                <p className="text-chess-text text-[14px] leading-relaxed font-medium text-center">
                  {greeting.quote}
                </p>
              </div>
            </div>
          </div>

          {/* Wins progress */}
          <div className="flex justify-center">
            <WinsIndicator
              wins={winsAtLevel}
              needed={WINS_TO_ADVANCE}
              nextLevel={currentLevel + 1}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="text-[11px] font-semibold text-chess-text-muted uppercase tracking-wide mb-1.5 block">
              Your color
            </label>
            <div className="flex gap-2">
              {(['white', 'black'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setPlayerColor(c)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    playerColor === c
                      ? c === 'white'
                        ? 'bg-white text-chess-text ring-2 ring-chess-green shadow-md'
                        : 'bg-gray-800 text-white ring-2 ring-chess-green shadow-md'
                      : 'bg-chess-surface text-chess-text-muted border border-slate-200'
                  }`}
                >
                  {c === 'white' ? 'White' : 'Black'}
                </button>
              ))}
            </div>
          </div>

          {/* Play button */}
          <ActionButton color="green" size="lg" fullWidth onClick={() => {
            localStorage.setItem('rookie-level', String(currentLevel));
            localStorage.setItem('rookie-level-wins', String(winsAtLevel));
            router.push('/play');
          }}>
            Let&apos;s Play
          </ActionButton>
        </div>
      </div>

      {/* Demo controls - remove in production */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-5 py-3 space-y-2">
        <p className="text-[10px] text-chess-text-faint uppercase tracking-wide font-bold">Demo Controls</p>

        {/* Level controls */}
        <div className="flex gap-2">
          <button
            onClick={addWin}
            className="flex-1 py-2 rounded-lg bg-chess-green text-white text-xs font-bold"
          >
            Simulate Win
          </button>
          <button
            onClick={resetDemo}
            className="flex-1 py-2 rounded-lg bg-slate-200 text-chess-text text-xs font-bold"
          >
            Reset
          </button>
          <button
            onClick={() => { setCurrentLevel(10); setWinsAtLevel(0); setGreetingContext({ type: 'default' }); setQuipKey(k => k + 1); }}
            className="flex-1 py-2 rounded-lg bg-chess-gold text-chess-text text-xs font-bold"
          >
            Lv.10
          </button>
        </div>

        {/* Context controls */}
        <div className="flex gap-2">
          <button
            onClick={() => { setGreetingContext({ type: 'default' }); setQuipKey(k => k + 1); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold ${greetingContext.type === 'default' ? 'bg-chess-blue text-white' : 'bg-slate-200 text-chess-text'}`}
          >
            Default
          </button>
          <button
            onClick={() => { setGreetingContext({ type: 'from-daily', score: 18, total: 22 }); setQuipKey(k => k + 1); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold ${greetingContext.type === 'from-daily' ? 'bg-chess-blue text-white' : 'bg-slate-200 text-chess-text'}`}
          >
            From Daily (18/22)
          </button>
          <button
            onClick={() => { setGreetingContext({ type: 'from-learn', lessonName: 'Knight Forks' }); setQuipKey(k => k + 1); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold ${greetingContext.type === 'from-learn' ? 'bg-chess-blue text-white' : 'bg-slate-200 text-chess-text'}`}
          >
            From Learn
          </button>
        </div>
      </div>
    </div>
  );
}
