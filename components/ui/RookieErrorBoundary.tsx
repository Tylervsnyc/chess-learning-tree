'use client';

import React from 'react';
import Link from 'next/link';
import { BreathingRook } from '@/components/ui/BreathingRook';

const ERROR_MESSAGES = [
  "Well, something broke. Even I don't know what happened.",
  "I tripped over a wire somewhere. Try refreshing?",
  "My circuits got confused. This is embarrassing.",
];

function getRandomMessage() {
  return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
}

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
    return { hasError: true, message: getRandomMessage() };
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
