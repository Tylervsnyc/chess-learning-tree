'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-gray-400">{getErrorMessage()}</p>
        </div>

        <div className="bg-[#1A2C35] rounded-xl p-6 space-y-4">
          <p className="text-gray-400 text-sm">
            If you clicked a confirmation link from your email, it may have expired.
            Try signing up again to receive a new link.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-center"
            >
              Try Signing In
            </Link>

            <Link
              href="/auth/signup"
              className="w-full py-3 bg-[#131F24] hover:bg-[#0D1A1F] text-white font-semibold rounded-lg transition-colors border border-gray-600 text-center"
            >
              Create New Account
            </Link>

            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
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
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
