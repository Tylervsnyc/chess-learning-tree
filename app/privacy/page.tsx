import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Chess Path',
  description: 'How Chess Path collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <div className="h-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-2xl px-4 md:px-6 py-12">
        <Link href="/" className="inline-flex min-h-[44px] items-center text-chess-green text-sm font-medium hover:underline">&larr; Back to Chess Path</Link>
        <h1 className="text-2xl font-bold mt-4 mb-1">Privacy Policy</h1>
        <p className="text-sm text-chess-text-muted mb-8">Last updated: February 17, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-chess-text-muted">
          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">What We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account info:</strong> Email address and display name when you sign up (directly or via Google).</li>
              <li><strong>Learning progress:</strong> Lesson completions, puzzle attempts, streaks, and Daily Rook scores.</li>
              <li><strong>Payment info:</strong> Processed securely by Stripe. We never see or store your card number.</li>
              <li><strong>Usage analytics:</strong> Page views and feature usage via PostHog to improve the app.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">How We Use It</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Personalize your learning experience and track progress.</li>
              <li>Process premium subscriptions and send transactional emails (receipts, password resets).</li>
              <li>Send optional learning emails (you can unsubscribe anytime).</li>
              <li>Analyze aggregate usage to improve lessons and features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">Third-Party Services</h2>
            <p>We use the following services that may process your data under their own privacy policies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — Authentication and database hosting.</li>
              <li><strong>Stripe</strong> — Payment processing.</li>
              <li><strong>PostHog</strong> — Product analytics.</li>
              <li><strong>Resend</strong> — Transactional and marketing emails.</li>
              <li><strong>Vercel</strong> — Application hosting.</li>
              <li><strong>Google OAuth</strong> — Sign-in authentication.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">Google User Data</h2>
            <p>When you sign in with Google, we receive your name and email address. We use this only to create and manage your Chess Path account. We do not share your Google data with third parties beyond the services listed above.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">Data Retention</h2>
            <p>We keep your account and progress data as long as your account is active. You can request deletion of your account and all associated data by emailing us.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">Cookies</h2>
            <p>We use essential cookies for authentication sessions and optional analytics cookies via PostHog. No third-party advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">Children&apos;s Privacy</h2>
            <p>Chess Path is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">Contact</h2>
            <p>Questions about this policy? Email us at <a href="mailto:tyler@tylervsnyc.com" className="text-chess-green hover:underline">tyler@tylervsnyc.com</a>.</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-xs text-chess-text-muted">
          <Link href="/terms" className="inline-flex min-h-[44px] items-center text-chess-green hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
