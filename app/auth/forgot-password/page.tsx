'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';

/**
 * Password reset — CODE flow, not link flow.
 *
 * The reset email carries a 6-digit code ({{ .Token }} in the Supabase
 * template); the user types it here with their new password and everything
 * completes in THIS browser/webview via verifyOtp. No email link, so nothing
 * can open in the wrong browser — the failure mode that killed link-based
 * resets inside the Chess Boxing shell (PKCE verifier lives where the flow
 * started). The /auth/confirm token_hash route still exists as a link
 * fallback if a template ever includes one.
 */
function ForgotPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [resent, setResent] = useState(false);

  const sendCode = async () => {
    const supabase = createClient();
    // redirectTo keeps the link fallback working if the template has one.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });
    return error;
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const error = await sendCode();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    trackEvent('password_reset_requested', { version: 'v3-code' });
    setStep('code');
    setLoading(false);
  };

  const handleResend = async () => {
    setError(null);
    setResent(false);
    const error = await sendCode();
    if (error) {
      setError(error.message);
      return;
    }
    setResent(true);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'recovery',
    });

    if (verifyError) {
      setError(
        verifyError.message.toLowerCase().includes('expired') || verifyError.message.toLowerCase().includes('invalid')
          ? 'That code is wrong or expired. Check the email or resend a new code.'
          : verifyError.message
      );
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    trackEvent('password_reset_completed', { version: 'v3-code' });
    router.push('/auth/login?reset=success');
  };

  return (
    <div className="h-full md:h-auto bg-chess-page flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-4 md:px-6 pt-6 min-h-0 overflow-y-auto">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <Image
            src="/brand/logo-horizontal-light.svg"
            alt="Chess Path"
            width={260}
            height={60}
            className="mx-auto mb-2"
            priority
          />
        </div>

        <div className="mx-auto w-full max-w-md md:max-w-lg">
          <div className="bg-chess-surface border border-slate-200 rounded-2xl p-5 shadow-sm">
            {step === 'email' ? (
              <>
                <h1 className="text-xl font-bold text-chess-text text-center mb-1">Reset your password</h1>
                <p className="text-chess-text-muted text-sm text-center mb-4">
                  Enter your email and we&apos;ll send you a reset code
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendEmail} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-chess-text-muted mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none bg-chess-green flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-chess-text text-center mb-1">Enter your code</h1>
                <p className="text-chess-text-muted text-sm text-center mb-4">
                  We emailed a 6-digit code to <span className="font-bold text-chess-text">{email}</span>
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3">
                    {error}
                  </div>
                )}
                {resent && !error && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm mb-3">
                    New code sent. Check your email.
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-3">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-chess-text-muted mb-1">
                      Reset code
                    </label>
                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text text-center text-2xl font-bold tracking-[0.3em] placeholder-slate-300 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                      placeholder="000000"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-chess-text-muted mb-1">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        disabled={loading}
                        className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                        placeholder="6+ characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-chess-text-faint hover:text-chess-text-muted transition-colors text-xs font-bold uppercase"
                        tabIndex={-1}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-chess-text-muted mb-1">
                      Confirm new password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                      placeholder="Same password again"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none bg-chess-green flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {loading ? 'Resetting...' : 'Set New Password'}
                  </button>
                </form>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setError(null); setResent(false); }}
                    className="text-chess-text-muted text-sm hover:text-chess-text transition-colors"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-chess-blue text-sm font-medium hover:underline"
                  >
                    Resend code
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-chess-text-muted text-sm pt-4 pb-6">
            <Link href="/auth/login" className="text-chess-green hover:underline font-medium">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="h-full bg-chess-page flex items-center justify-center">
        <BreathingRook label="Loading..." />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
