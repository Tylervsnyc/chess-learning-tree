'use client';

import { useRouter } from 'next/navigation';

export default function SubscriptionCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1A2C35] flex items-center justify-center border border-white/10">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Checkout Cancelled</h1>
        <p className="text-gray-400 mb-8">
          No worries! Your checkout was cancelled and you haven't been charged.
        </p>

        {/* Free tier reminder */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-8">
          <div className="text-sm font-medium text-gray-300 mb-3">Free tier includes:</div>
          <ul className="space-y-2 text-left">
            {[
              '15 puzzles per day',
              'Basic progress tracking',
              'Access to beginner puzzles',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-[#1CB0F6] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/workout')}
            className="w-full py-4 rounded-xl bg-[#1CB0F6] text-white font-bold text-lg transition-all hover:opacity-90"
          >
            Continue with Free
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            Go Back
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Changed your mind? You can upgrade anytime from your profile.
        </p>
      </div>
    </div>
  );
}
