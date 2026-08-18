import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support | Chess Boxing & The Chess Path',
  description: 'Get help with Chess Boxing and The Chess Path — contact, FAQ, billing, and account deletion.',
};

const SUPPORT_EMAIL = 'tyler@tylervsnyc.com';

export default function SupportPage() {
  return (
    <div className="h-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-2xl px-4 md:px-6 py-12">
        <Link href="/" className="inline-flex min-h-[44px] items-center text-chess-green text-sm font-medium hover:underline">&larr; Back to Chess Path</Link>
        <h1 className="text-2xl font-bold mt-4 mb-1">Chess Boxing &amp; The Chess Path &mdash; Support</h1>
        <p className="text-sm text-chess-text-muted mb-8">We are a tiny team. Real humans answer.</p>

        <div className="space-y-6 text-sm leading-relaxed text-chess-text-muted">
          <section className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-base font-semibold text-chess-text mb-2">Contact</h2>
            <p>
              Email <a href={`mailto:${SUPPORT_EMAIL}`} className="text-chess-green font-medium hover:underline break-all">{SUPPORT_EMAIL}</a> with
              any question, bug, or billing issue. Expect a reply within 2 business days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-chess-text mb-3">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-chess-text">Why does the app ask for my camera?</h3>
                <p>Only Quadrant Fight uses the camera, and it is optional. Video is processed on your device to detect punches and dodges. Nothing is recorded or uploaded, ever.</p>
              </div>
              <div>
                <h3 className="font-semibold text-chess-text">How do bouts and the streak work?</h3>
                <p>A bout is one chess-plus-exercise session. Finish a bout, lesson, game, or opening lesson and today counts toward your streak. Your streak is calculated from what you actually finish, in your local timezone.</p>
              </div>
              <div>
                <h3 className="font-semibold text-chess-text">Subscription and billing</h3>
                <p>Manage your plan from your <Link href="/profile" className="text-chess-green hover:underline">profile page</Link>. For refunds or anything billing-related, email us and include the address on your account.</p>
              </div>
              <div>
                <h3 className="font-semibold text-chess-text">How do I delete my account?</h3>
                <p>Open your <Link href="/profile" className="text-chess-green hover:underline">profile page</Link>, scroll to the bottom, tap <strong>Delete account</strong>, and type DELETE to confirm. This permanently removes your account, progress, streak, and rating. You can also email us from your account address to request deletion.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 text-xs text-chess-text-muted flex flex-wrap gap-x-6">
          <Link href="/privacy" className="inline-flex min-h-[44px] items-center text-chess-green hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="inline-flex min-h-[44px] items-center text-chess-green hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
