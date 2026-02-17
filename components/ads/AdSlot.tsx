'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { isAdEnabled, getAdType } from '@/lib/ad-config';
import { trackEvent } from '@/lib/analytics/posthog';
import { SelfPromoCard } from './SelfPromoCard';

interface AdSlotProps {
  position: string;
}

export function AdSlot({ position }: AdSlotProps) {
  const { isPremium, loading } = useSubscription();
  const hasTrackedImpression = useRef(false);

  const adType = getAdType(position);

  // Track impression once per mount
  useEffect(() => {
    if (loading || isPremium || hasTrackedImpression.current) return;
    if (!isAdEnabled(position)) return;

    hasTrackedImpression.current = true;
    trackEvent('ad_impression', {
      position,
      ad_type: adType,
    });
  }, [loading, isPremium, position, adType]);

  // Don't render while loading, for premium users, or if position is disabled
  if (loading || isPremium || !isAdEnabled(position)) {
    return null;
  }

  const handleClick = () => {
    trackEvent('ad_click', {
      position,
      ad_type: adType,
    });
  };

  // Currently only self-promo; third-party slot can be added here later
  if (adType === 'self_promo') {
    return (
      <div className="w-full">
        <SelfPromoCard onClick={handleClick} />
      </div>
    );
  }

  // Future: third-party ad rendering
  return null;
}
