'use client';

/**
 * /review?id=<gameId> — query-param twin of /review/[id].
 * This is the form the iOS app uses (and what profile links to): the app is a
 * static export, which can prerender /review but not /review/<uuid>.
 * Thin wrapper; the whole page lives in components/review/PastGameReview.
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PastGameReview } from '@/components/review/PastGameReview';

function ReviewFromQuery() {
  const searchParams = useSearchParams();
  return <PastGameReview gameId={searchParams.get('id')} />;
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="h-full bg-chess-page" />}>
      <ReviewFromQuery />
    </Suspense>
  );
}
