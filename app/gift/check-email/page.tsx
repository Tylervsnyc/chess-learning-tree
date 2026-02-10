'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="min-h-full bg-chess-page flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">✉️</div>
        <h1 className="text-2xl font-bold text-chess-text mb-3">Check your email!</h1>
        <p className="text-chess-text-muted mb-2">
          We sent a confirmation link to
        </p>
        <p className="text-chess-text font-medium text-lg mb-6">{email}</p>
        <p className="text-chess-text-muted text-sm">
          Click the link in your email to activate your free premium membership and start learning.
        </p>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <div className="text-chess-text">Loading...</div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
