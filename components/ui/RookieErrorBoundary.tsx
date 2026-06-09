'use client';

import React from 'react';
import Link from 'next/link';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { getQuipPool } from '@/lib/quips/load-quip-pool';

// This component renders in the root layout, so it must not statically import
// the quip pool (~282KB of speech data). The pool is loaded only when an
// error is actually caught; until then (or if loading fails) we show this.
const FALLBACK_MESSAGE = "Something went wrong. Try refreshing?";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class RookieErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true, message: FALLBACK_MESSAGE };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RookieErrorBoundary]', error, info.componentStack);
    // Swap in a Rookie line once the pool chunk arrives; keep the fallback if it fails.
    Promise.all([getQuipPool(), import('@/lib/speech/priority-queue')])
      .then(([pool, { selectByCategory }]) => {
        const text = selectByCategory(pool, 'error')?.text;
        if (text) {
          this.setState((s) => (s.hasError ? { hasError: true, message: text } : s));
        }
      })
      .catch(() => { /* keep FALLBACK_MESSAGE */ });
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[100dvh] bg-chess-page px-6 text-center gap-6">
          <BreathingRook size="lg" mood="defeated" animate />
          <p className="text-chess-text text-lg max-w-sm">{this.state.message}</p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-chess-blue text-white font-semibold text-sm"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-chess-border text-chess-text font-semibold text-sm"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
