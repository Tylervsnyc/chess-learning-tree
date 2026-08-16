'use client';

import React from 'react';
import Link from 'next/link';
import { BreathingRook } from '@/components/ui/BreathingRook';

// Chess Path pulled the error line from its 282KB quip pool via a dynamic
// import. That pool is a /play asset and doesn't ship here, so the standalone
// app carries a small local set instead — same voice, no payload.
const ERROR_LINES = [
  'That was not supposed to happen. Pretend you saw nothing.',
  'I broke something. It was almost certainly the board.',
  'Well. That is embarrassing for one of us.',
  'Something went wrong and I refuse to take responsibility.',
];

const FALLBACK_MESSAGE = 'Something went wrong. Try refreshing?';

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
    return {
      hasError: true,
      message: ERROR_LINES[Math.floor(Math.random() * ERROR_LINES.length)] ?? FALLBACK_MESSAGE,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RookieErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-chess-page px-6 text-center gap-6">
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
