'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  /** What to render if a child throws. Defaults to nothing (the safe choice
   *  for non-essential global widgets like the streak watcher). */
  fallback?: React.ReactNode;
  /** Label for the console error so we can tell which widget crashed. */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * SilentErrorBoundary — contains a crash to itself.
 *
 * Global, non-essential widgets (e.g. NavHeader) live OUTSIDE
 * the page-level RookieErrorBoundary in the root layout, so a throw there used
 * to white-screen the ENTIRE app ("Application error: a client-side exception").
 * Wrapping each one here means a single widget failing just renders its
 * fallback (usually nothing) while the rest of the app keeps working.
 *
 * The error is still logged to the console with its component stack so we can
 * find and fix the real cause.
 */
export class SilentErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[SilentErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
