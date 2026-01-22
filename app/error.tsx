'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-400">
            We hit an unexpected error. Don&apos;t worry, your progress is saved.
          </p>
        </div>

        <div className="bg-[#1A2C35] rounded-xl p-6 space-y-4">
          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="w-full py-3 bg-[#58CC02] hover:bg-[#4CAF00] text-white font-semibold rounded-lg transition-colors shadow-[0_4px_0_#3d8c01]"
            >
              Try Again
            </button>

            <a
              href="/"
              className="w-full py-3 bg-[#131F24] hover:bg-[#0D1A1F] text-white font-semibold rounded-lg transition-colors border border-gray-600 text-center block"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
