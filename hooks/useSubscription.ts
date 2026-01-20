'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Subscription } from '@/types/subscription';

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/subscription');

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in, that's okay
          setSubscription(null);
          setIsPremium(false);
          return;
        }
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscription(data.subscription);
      setIsPremium(data.isPremium);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    isPremium,
    isLoading,
    error,
    refetch: fetchSubscription,
  };
}
