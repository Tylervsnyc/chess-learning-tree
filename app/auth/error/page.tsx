'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Common error messages
  const getErrorMessage = () => {
    if (errorDescription) return errorDescription;

    switch (error) {
      case 'access_denied':
        return 'Access was denied. Please try signing in again.';
      case 'invalid_request':
        return 'The sign-in link was invalid or has expired.';
      case 'server_error':
        return 'A server error occurred. Please try again later.';
      case 'temporarily_unavailable':
        return 'The service is temporarily unavailable. Please try again later.';
      default:
        return 'Something went wrong during sign-in. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-chess-page flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <BreathingRook size="md" mood="defeated" animate />
          </div>
          <h1 className="text-2xl font-bold text-chess-text mb-2">Authentication Error</h1>
          <p className="text-chess-text-muted">{getErrorMessage()}</p>
        </div>

        <div className="bg-chess-surface rounded-2xl p-6 space-y-4 border border-slate-200">
          <p className="text-chess-text-muted text-sm">
            If you clicked a confirmation link from your email, it may have expired.
            Try signing up again to receive a new link.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full py-3 bg-chess-blue hover:bg-chess-blue-dark text-white font-bold rounded-xl transition-colors text-center"
            >
              Try Signing In
            </Link>

            <Link
              href="/auth/signup"
              className="w-full py-3 bg-chess-page hover:bg-slate-100 text-chess-text font-bold rounded-xl transition-colors border border-slate-200 text-center"
            >
              Create New Account
            </Link>

            <Link
              href="/"
              className="text-chess-text-muted hover:text-chess-text text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-chess-page flex items-center justify-center">
        <div className="text-chess-text-muted">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
