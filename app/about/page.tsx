'use client';

import Link from 'next/link';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

export default function AboutPage() {
  return (
    <div className="h-full md:h-auto bg-chess-page text-chess-text flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10 overflow-y-auto">
        <div className="max-w-md w-full">
          {/* Heading + Logo */}
          <h1 className="text-lg font-bold text-center mb-3">How It Works</h1>
          <div className="flex justify-center mb-5">
            <AnimatedLogo theme="dark" perpetual autoPlay size={0.75} iconOnly />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="bg-chess-surface rounded-2xl p-3 flex gap-3 items-center">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-chess-green shadow-[0_4px_0_var(--color-chess-green-shadow)] flex items-center justify-center">
                <span className="text-white font-black text-base">1</span>
              </div>
              <div>
                <p className="font-bold text-chess-text text-sm">Try 4 free lessons</p>
                <p className="text-xs text-chess-text-muted mt-0.5">No sign-in needed. Jump right in.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-chess-surface rounded-2xl p-3 flex gap-3 items-center">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-chess-blue shadow-[0_4px_0_var(--color-chess-blue-shadow)] flex items-center justify-center">
                <span className="text-white font-black text-base">2</span>
              </div>
              <div>
                <p className="font-bold text-chess-text text-sm">Take the level test</p>
                <p className="text-xs text-chess-text-muted mt-0.5">Not a beginner? Sign in and scroll down to find your level.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-chess-surface rounded-2xl p-3 flex gap-3 items-center">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-chess-orange shadow-[0_4px_0_var(--color-chess-gold-dark)] flex items-center justify-center">
                <span className="text-white font-black text-base">3</span>
              </div>
              <div>
                <p className="font-bold text-chess-text text-sm">Daily Rook challenge</p>
                <p className="text-xs text-chess-text-muted mt-0.5">Sign in to unlock fresh puzzles every day.</p>
              </div>
            </div>
          </div>

          {/* Free info */}
          <div className="bg-chess-surface rounded-2xl p-3 mt-4 shadow-sm">
            <p className="text-chess-text-muted text-sm leading-relaxed text-center">
              <span className="font-semibold text-chess-green">Free forever.</span> Premium members help keep it that way.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-5 space-y-3 pb-6">
            <Link
              href="/"
              className="block w-full py-4 text-center font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_var(--color-chess-green-shadow)] bg-chess-green"
            >
              Begin Learning
            </Link>
            <Link
              href="/tutorial/basics"
              className="block w-full py-4 text-center font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_var(--color-chess-blue-shadow)] bg-chess-blue"
            >
              Learn Chess Basics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
