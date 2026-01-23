'use client';

import { useState } from 'react';
import Link from 'next/link';

const PAGES_TO_REVIEW = [
  { name: 'Landing Page', path: '/', status: 'updated' },
  { name: 'Onboarding Choice', path: '/onboarding', status: 'updated' },
  { name: 'Diagnostic', path: '/onboarding/diagnostic', status: 'updated' },
  { name: 'Sign Up', path: '/auth/signup', status: 'needs-review' },
  { name: 'Login', path: '/auth/login', status: 'needs-review' },
  { name: 'Auth Welcome', path: '/auth/welcome', status: 'needs-review' },
  { name: 'Gift Welcome', path: '/gift/welcome', status: 'needs-review' },
  { name: 'Learn (logged out)', path: '/learn?guest=true', status: 'needs-review' },
];

const COMPONENTS_TO_REVIEW = [
  { name: 'NavHeader', path: '/admin/brand-review', note: 'See header above - uses horizontal logo' },
];

const EMAIL_TEMPLATES = [
  { name: 'Welcome Email', file: 'lib/email/templates/Welcome.tsx' },
  { name: 'Re-engagement Email', file: 'lib/email/templates/ReEngagement.tsx' },
  { name: 'Email Layout', file: 'lib/email/templates/components/EmailLayout.tsx' },
];

export default function BrandReviewPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Brand Review</h1>
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">
            ← Back to Admin
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Pages Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAGES_TO_REVIEW.map((page) => (
              <div key={page.path} className="bg-[#1A2C35] rounded-xl overflow-hidden border border-white/10">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{page.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      page.status === 'updated'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {page.status === 'updated' ? '✓ Updated' : 'Review'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPage(selectedPage === page.path ? null : page.path)}
                      className="flex-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg transition-colors"
                    >
                      {selectedPage === page.path ? 'Hide' : 'Preview'}
                    </button>
                    <Link
                      href={page.path}
                      target="_blank"
                      className="flex-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1.5 rounded-lg transition-colors text-center"
                    >
                      Open ↗
                    </Link>
                  </div>
                </div>
                {selectedPage === page.path && (
                  <div className="border-t border-white/10">
                    <iframe
                      src={page.path}
                      className="w-full h-[500px] bg-[#131F24]"
                      title={page.name}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Components</h2>
          <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10">
            {COMPONENTS_TO_REVIEW.map((comp) => (
              <div key={comp.name} className="flex items-center justify-between">
                <span className="font-medium">{comp.name}</span>
                <span className="text-gray-400 text-sm">{comp.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Email Templates */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Email Templates</h2>
          <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10 space-y-2">
            {EMAIL_TEMPLATES.map((email) => (
              <div key={email.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="font-medium">{email.name}</span>
                <code className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">{email.file}</code>
              </div>
            ))}
            <p className="text-gray-500 text-sm mt-2">
              Email templates need to be tested via the email preview system or by sending test emails.
            </p>
          </div>
        </section>

        {/* Quick Preview All */}
        <section>
          <h2 className="text-lg font-bold mb-4">Side-by-Side Mobile Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PAGES_TO_REVIEW.slice(0, 4).map((page) => (
              <div key={page.path} className="bg-[#1A2C35] rounded-xl overflow-hidden border border-white/10">
                <div className="bg-black/30 px-3 py-2 text-xs font-medium border-b border-white/10">
                  {page.name}
                </div>
                <div className="relative" style={{ paddingBottom: '177%' }}>
                  <iframe
                    src={page.path}
                    className="absolute inset-0 w-full h-full"
                    style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                    title={page.name}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
