import { PostHog } from 'posthog-node';

// Server-side PostHog client for feature flag evaluation
let _client: PostHog | null = null;

function getClient(): PostHog {
  if (!_client) {
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!apiKey) {
      throw new Error('PostHog API key not configured');
    }
    _client = new PostHog(apiKey, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    });
  }
  return _client;
}

/**
 * Evaluate a feature flag for a given user.
 */
export async function getFeatureFlag(
  flagKey: string,
  distinctId: string
): Promise<string | boolean> {
  try {
    const client = getClient();
    const value = await client.getFeatureFlag(flagKey, distinctId);
    return value ?? false;
  } catch (error) {
    console.error(`PostHog flag evaluation failed for "${flagKey}":`, error);
    return false;
  }
}

export type PricingVariant = 'control' | 'low' | 'high';

/**
 * Get the pricing experiment variant for a user.
 * Falls back to 'control' if the flag is not found or errors.
 */
export async function getPricingVariant(
  distinctId: string
): Promise<PricingVariant> {
  try {
    const value = await getFeatureFlag('pricing-experiment', distinctId);

    if (value === 'low' || value === 'high') {
      return value;
    }

    return 'control';
  } catch {
    return 'control';
  }
}
