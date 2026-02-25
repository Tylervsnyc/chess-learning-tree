'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { trackEvent, identifyUser } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLesson = searchParams.get('from') === 'lesson';
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const humanizeError = (msg: string): string => {
    if (msg.includes('Invalid login credentials')) return 'Wrong email or password. Please try again.';
    if (msg.includes('Email not confirmed')) return 'Please check your email to confirm your account.';
    if (msg.includes('Password should be at least')) return 'Password must be at least 6 characters.';
    if (msg.includes('Unable to validate email')) return 'Please enter a valid email address.';
    if (msg.includes('User already registered')) return 'An account with this email already exists.';
    if (msg.includes('Email rate limit exceeded')) return 'Too many attempts. Please wait a minute and try again.';
    if (msg.includes('For security purposes')) return 'Too many attempts. Please wait a moment and try again.';
    return msg;
  };

  useEffect(() => {
    trackEvent('signup_page_viewed', { version: 'v2' });
  }, []);

  // Auto-clear errors after 5 seconds (but not duplicate email — user needs time to find the link)
  useEffect(() => {
    if (!error || isDuplicateEmail) return;
    const timer = setTimeout(() => setError(null), 8000);
    return () => clearTimeout(timer);
  }, [error, isDuplicateEmail]);

  const handleResendConfirmation = async () => {
    setResending(true);
    setResendSuccess(false);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    setResending(false);
    if (error) {
      setError(error.message);
    } else {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    // Auto-advance to next input
    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pastedData) {
      const newOtp = [...otpCode];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpCode(newOtp);
      // Focus the appropriate input
      const nextIndex = Math.min(pastedData.length, 7);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpCode.join('');
    if (code.length !== 8) {
      setError('Please enter the complete 8-digit code');
      return;
    }

    setVerifying(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'signup',
    });

    if (error) {
      trackEvent('signup_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setVerifying(false);
      setOtpCode(['', '', '', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email });
    }
    trackEvent('signup_completed', { method: 'email', version: 'v2' });

    router.push(redirectTo || '/');
    router.refresh();
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);
    trackEvent('signup_started', { version: 'v2' });
    const supabase = createClient();

    localStorage.setItem('auth_method', 'google');

    const redirectUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      redirectUrl.searchParams.set('next', redirectTo);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      trackEvent('signup_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setGoogleLoading(false);
    }
    // Don't reset googleLoading on success — browser is redirecting
  };

  const handleAppleSignup = async () => {
    setError(null);
    setAppleLoading(true);
    trackEvent('signup_started', { version: 'v2' });
    const supabase = createClient();

    localStorage.setItem('auth_method', 'apple');

    const redirectUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      redirectUrl.searchParams.set('next', redirectTo);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      trackEvent('signup_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setAppleLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsDuplicateEmail(false);
    setLoading(true);
    trackEvent('signup_started', { version: 'v2' });

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      trackEvent('signup_failed', { error: error.message, version: 'v2' });
      setError(humanizeError(error.message));
      setLoading(false);
      return;
    }

    // Supabase returns a fake success with empty identities when the email already exists
    if (data.user && data.user.identities?.length === 0) {
      trackEvent('signup_failed', { error: 'duplicate_email', version: 'v2' });
      setError('An account with this email already exists.');
      setIsDuplicateEmail(true);
      setLoading(false);
      return;
    }

    // If email confirmation is disabled, Supabase returns a session directly
    if (data.session) {
      if (data.user) {
        identifyUser(data.user.id, { email });
      }
      trackEvent('signup_completed', { method: 'email', version: 'v2' });
      router.push(redirectTo || '/');
      router.refresh();
      return;
    }

    // Email confirmation enabled — show OTP verification screen
    setPendingVerification(true);
    setLoading(false);
    // Focus first OTP input after render
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  if (pendingVerification) {
    return (
      <div className="h-full md:h-auto bg-chess-page flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <div className="max-w-sm w-full">
            <div className="bg-chess-surface border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4"><BreathingRook size="md" /></div>
              <h1 className="text-2xl font-bold text-chess-text mb-2">Enter verification code</h1>
              <p className="text-chess-text-muted mb-6">
                We sent a code to <strong className="text-chess-text">{email}</strong>
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-1 mb-6" onPaste={handleOtpPaste}>
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-14 text-center text-lg font-bold bg-slate-50 border-2 border-slate-200 rounded-lg text-chess-text focus:outline-none focus:border-chess-blue focus:ring-2 focus:ring-chess-blue focus:bg-white transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={verifying || otpCode.join('').length !== 8}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none bg-chess-green"
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </button>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-chess-text-faint text-sm mb-3">Didn&apos;t receive the code?</p>
                {resendSuccess ? (
                  <p className="text-chess-green text-sm">New code sent!</p>
                ) : (
                  <button
                    onClick={handleResendConfirmation}
                    disabled={resending}
                    className="text-chess-blue hover:underline text-sm font-medium disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend code'}
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setPendingVerification(false);
                  setOtpCode(['', '', '', '', '', '', '', '']);
                  setError(null);
                }}
                className="mt-4 text-chess-text-faint hover:text-chess-text-muted text-sm"
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full md:h-auto bg-chess-page flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-4 pt-5 min-h-0">
        <div className="w-full max-w-sm">

          {/* Hero section — sell the value before asking for anything */}
          <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
              <BreathingRook size="md" />
            </div>
            {fromLesson ? (
              <>
                <h1 className="text-2xl font-extrabold text-chess-text mb-1">You&apos;re so close!</h1>
                <p className="text-chess-text-muted text-[15px]">Save your progress and keep learning</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold text-chess-text mb-1">Learn Chess the Fun Way!</h1>
                <p className="text-chess-text-muted text-[15px]">Bite-sized lessons. Real improvement. Zero boredom.</p>
              </>
            )}
          </div>

          {/* Auth card */}
          <div className="bg-chess-surface border border-slate-200 rounded-2xl p-5 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm mb-3">
                <p className="text-red-600">{error}</p>
                {isDuplicateEmail && (
                  <Link
                    href={redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login'}
                    className="inline-flex items-center gap-1 mt-2 text-chess-blue font-bold hover:underline"
                  >
                    Sign in instead &rarr;
                  </Link>
                )}
              </div>
            )}

            {/* Google — hero CTA */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#4285F4] transition-all active:translate-y-[2px] shadow-[0_4px_0_#2a63b8] flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
            >
              {googleLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" fillOpacity="0.8"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" fillOpacity="0.6"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" fillOpacity="0.9"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAppleSignup}
              disabled={appleLoading || googleLoading}
              className="w-full mt-2 py-3.5 rounded-2xl font-bold text-white bg-[#4285F4] transition-all active:translate-y-[2px] shadow-[0_4px_0_#2a63b8] flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
            >
              {appleLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-chess-text-faint text-xs uppercase">or use email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-3">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || googleLoading}
                autoComplete="email"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                placeholder="Email address"
                aria-label="Email"
              />

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                  placeholder="Password (6+ characters)"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-chess-text-faint hover:text-chess-text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none bg-chess-green flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {loading ? 'Creating account...' : 'Create Free Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-chess-text-muted text-sm pt-4">
            Already have an account?{' '}
            <Link
              href={redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login'}
              className="text-chess-green hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-chess-text-faint text-xs pt-3 pb-6">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline hover:text-chess-text-muted">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-chess-text-muted">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-chess-page flex items-center justify-center">
        <BreathingRook label="Loading..." />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
