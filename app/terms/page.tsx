import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Chess Path',
  description: 'Terms and conditions for using Chess Path.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-chess-page text-chess-text">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="text-chess-green text-sm font-medium hover:underline">&larr; Back to Chess Path</Link>
        <h1 className="text-2xl font-bold mt-4 mb-1">Terms of Service</h1>
        <p className="text-sm text-chess-text-muted mb-8">Last updated: February 17, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-chess-text-muted">
          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">1. Acceptance</h2>
            <p>By using Chess Path (&quot;the Service&quot;), you agree to these terms. If you don&apos;t agree, please don&apos;t use the Service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">2. The Service</h2>
            <p>Chess Path is a chess learning platform that provides interactive lessons, puzzles, and daily challenges. Some features are free; others require a premium subscription.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">3. Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You can try lessons without an account. Signing up saves your progress.</li>
              <li>You&apos;re responsible for keeping your login credentials secure.</li>
              <li>One account per person. We may suspend accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">4. Premium Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Premium is billed monthly or yearly via Stripe.</li>
              <li>You can cancel anytime. Access continues until the end of your billing period.</li>
              <li>Refunds are handled on a case-by-case basis — email us if you have an issue.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">5. Acceptable Use</h2>
            <p>Don&apos;t use Chess Path to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Scrape content, reverse-engineer the app, or circumvent paywalls.</li>
              <li>Harass other users or disrupt the service.</li>
              <li>Create multiple accounts to abuse free-tier limits.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">6. Content</h2>
            <p>Chess puzzles are sourced from the Lichess open database (CC0 license). All other content, including lessons, design, and branding, is owned by Chess Path.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">7. Availability</h2>
            <p>We aim for high uptime but don&apos;t guarantee uninterrupted access. We may modify or discontinue features with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">8. Limitation of Liability</h2>
            <p>Chess Path is provided &quot;as is.&quot; We&apos;re not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">9. Changes</h2>
            <p>We may update these terms. Continued use after changes constitutes acceptance. We&apos;ll notify users of significant changes via email.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-2">10. Contact</h2>
            <p>Questions? Email <a href="mailto:support@chesspath.com" className="text-chess-green hover:underline">support@chesspath.com</a>.</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-xs text-chess-text-muted">
          <Link href="/privacy" className="text-chess-green hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
