'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">✉️</div>
        <h1 className="text-2xl font-bold text-white mb-3">Check your email!</h1>
        <p className="text-gray-400 mb-2">
          We sent a confirmation link to
        </p>
        <p className="text-white font-medium text-lg mb-6">{email}</p>
        <p className="text-gray-500 text-sm">
          Click the link in your email to activate your free premium membership and start learning.
        </p>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
