'use client';

import { useState, useEffect, useCallback } from 'react';

interface SubscriptionState {
  status: 'free' | 'premium' | 'trial';
  isPremium: boolean;
  dailyPuzzlesUsed: number;
  dailyPuzzlesRemaining: number;
  canSolvePuzzle: boolean;
  expiresAt: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  status: 'free',
  isPremium: false,
  dailyPuzzlesUsed: 0,
  dailyPuzzlesRemaining: 15,
  canSolvePuzzle: true,
  expiresAt: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(initialState);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/subscription/status');
      if (!res.ok) throw new Error('Failed to fetch subscription status');

      const data = await res.json();
      setState({
        status: data.status,
        isPremium: data.isPremium,
        dailyPuzzlesUsed: data.dailyPuzzlesUsed,
        dailyPuzzlesRemaining: data.dailyPuzzlesRemaining,
        canSolvePuzzle: data.canSolvePuzzle,
        expiresAt: data.expiresAt,
        isAuthenticated: data.isAuthenticated,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load subscription status',
      }));
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const startCheckout = async (priceId: 'monthly' | 'yearly') => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to start checkout');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const openPortal = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to open portal');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      throw error;
    }
  };

  return {
    ...state,
    refresh: fetchStatus,
    startCheckout,
    openPortal,
  };
}
