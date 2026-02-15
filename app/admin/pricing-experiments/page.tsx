'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VariantData {
  variant: string;
  usersSeen: number;
  conversions: number;
  conversionRate: number;
  avgRevenue: number;
}

export default function PricingExperimentsPage() {
  const [data, setData] = useState<VariantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperimentData();
  }, []);

  const fetchExperimentData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/pricing-experiments');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch experiment data');
      }
      const result = await res.json();
      setData(result.variants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatPercent = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const getVariantBadgeColor = (variant: string) => {
    switch (variant) {
      case 'control':
        return 'bg-gray-500/20 text-gray-400';
      case 'low':
        return 'bg-[#1CB0F6]/20 text-[#1CB0F6]';
      case 'high':
        return 'bg-[#FF9600]/20 text-[#FF9600]';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const totalUsers = data.reduce((sum, d) => sum + d.usersSeen, 0);
  const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0);

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Pricing Experiments</h1>
              <p className="text-sm text-gray-400">A/B test results for pricing variants</p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Users Seen</p>
            <p className="text-2xl font-bold">{loading ? '...' : totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Conversions</p>
            <p className="text-2xl font-bold text-[#58CC02]">{loading ? '...' : totalConversions.toLocaleString()}</p>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Overall Conversion Rate</p>
            <p className="text-2xl font-bold">
              {loading ? '...' : totalUsers > 0 ? formatPercent(totalConversions / totalUsers) : '0%'}
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchExperimentData}
              className="ml-3 text-sm underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="bg-[#1A2C35] rounded-xl border border-gray-700 p-12 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#58CC02] border-t-transparent rounded-full" />
          </div>
        ) : (
          /* Results Table */
          <div className="bg-[#1A2C35] rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="font-semibold">Experiment Results by Variant</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 text-left">
                    <th className="px-6 py-3 text-sm font-medium text-gray-400">Variant</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400 text-right">Users Seen</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400 text-right">Conversions</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400 text-right">Conversion Rate</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400 text-right">Avg Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No experiment data yet. Set up the &quot;pricing-experiment&quot; feature flag in PostHog to start collecting data.
                      </td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr key={row.variant} className="hover:bg-[#131F24] transition-colors">
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getVariantBadgeColor(row.variant)}`}>
                            {row.variant}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono">{row.usersSeen.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono text-[#58CC02]">{row.conversions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono">
                          <span className={row.conversionRate > 0 ? 'text-white' : 'text-gray-500'}>
                            {formatPercent(row.conversionRate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono">
                          {row.avgRevenue > 0 ? formatCurrency(row.avgRevenue) : '--'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-[#1A2C35] rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-3">Setup Instructions</h3>
          <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Create a feature flag named <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">pricing-experiment</code> in PostHog</li>
            <li>Set variants: <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">control</code>, <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">low</code>, <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">high</code></li>
            <li>Configure rollout percentage and targeting rules</li>
            <li>Set <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">STRIPE_PRICE_MONTHLY_LOW</code>, <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">STRIPE_PRICE_YEARLY_LOW</code>, <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">STRIPE_PRICE_MONTHLY_HIGH</code>, <code className="bg-[#131F24] px-1.5 py-0.5 rounded text-gray-300">STRIPE_PRICE_YEARLY_HIGH</code> env vars in Vercel</li>
            <li>Data flows in automatically via Stripe checkout metadata</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
