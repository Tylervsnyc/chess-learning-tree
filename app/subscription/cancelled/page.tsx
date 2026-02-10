'use client';

import { useRouter } from 'next/navigation';

export default function SubscriptionCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-chess-page flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-chess-surface flex items-center justify-center border border-chess-text-faint/10 shadow-sm">
          <svg className="w-12 h-12 text-chess-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-chess-text mb-2">Checkout Cancelled</h1>
        <p className="text-chess-text-muted mb-8">
          No worries! Your checkout was cancelled and you haven't been charged.
        </p>

        {/* Free tier reminder */}
        <div className="bg-chess-surface rounded-xl p-6 mb-8 shadow-sm">
          <div className="text-sm font-medium text-chess-text-muted mb-3">Free tier includes:</div>
          <ul className="space-y-2 text-left">
            {[
              '15 puzzles per day',
              'Basic progress tracking',
              'Access to beginner puzzles',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-chess-text-muted">
                <svg className="w-4 h-4 text-chess-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/learn')}
            className="w-full py-4 rounded-xl bg-chess-blue text-white font-bold text-lg transition-all hover:opacity-90 shadow-sm"
          >
            Continue with Free
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl border border-chess-text-faint/10 text-chess-text-muted hover:text-chess-text hover:border-chess-text-faint/20 transition-all"
          >
            Go Back
          </button>
        </div>

        <p className="text-chess-text-faint text-sm mt-6">
          Changed your mind? You can upgrade anytime from the pricing page.
        </p>
      </div>
    </div>
  );
}
