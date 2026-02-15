'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { isAdEnabled, getAdType } from '@/lib/ad-config';
import { trackEvent } from '@/lib/analytics/posthog';
import { SelfPromoCard, SelfPromoVariant } from './SelfPromoCard';

interface AdSlotProps {
  position: string;
}

/** Map position to the best visual variant for that context */
function getVariantForPosition(position: string): SelfPromoVariant {
  switch (position) {
    case 'after-lesson':
      return 'dark'; // Lesson complete screen has dark bg
    case 'learn-page':
      return 'compact'; // Inline in the learning tree
    case 'daily-complete':
      return 'compact'; // Inside the finished results
    default:
      return 'default';
  }
}

export function AdSlot({ position }: AdSlotProps) {
  const { isPremium, loading } = useSubscription();
  const hasTrackedImpression = useRef(false);

  const adType = getAdType(position);
  const variant = getVariantForPosition(position);

  // Track impression once per mount
  useEffect(() => {
    if (loading || isPremium || hasTrackedImpression.current) return;
    if (!isAdEnabled(position)) return;

    hasTrackedImpression.current = true;
    trackEvent('ad_impression', {
      position,
      ad_type: adType,
      variant,
    });
  }, [loading, isPremium, position, adType, variant]);

  // Don't render while loading, for premium users, or if position is disabled
  if (loading || isPremium || !isAdEnabled(position)) {
    return null;
  }

  const handleClick = () => {
    trackEvent('ad_click', {
      position,
      ad_type: adType,
      variant,
    });
  };

  // Currently only self-promo; third-party slot can be added here later
  if (adType === 'self_promo') {
    return (
      <div className="w-full">
        <SelfPromoCard variant={variant} onClick={handleClick} />
      </div>
    );
  }

  // Future: third-party ad rendering
  return null;
}
