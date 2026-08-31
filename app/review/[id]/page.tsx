'use client';

/**
 * /review/[id] — web deep link to a past-game review.
 * Thin wrapper; the whole page lives in components/review/PastGameReview.
 * (The iOS app uses /review?id= instead — static exports can't ship an
 * unbounded dynamic route, see scripts/offline-build.config.mjs.)
 */

import { useParams } from 'next/navigation';
import { PastGameReview } from '@/components/review/PastGameReview';

export default function ReviewGamePage() {
  const params = useParams<{ id: string }>();
  return <PastGameReview gameId={params?.id ?? null} />;
}
