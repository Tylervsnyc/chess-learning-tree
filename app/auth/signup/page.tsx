'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLesson = searchParams.get('from') === 'lesson';
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    AuthEvents.signupPageViewed();
  }, []);

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
    if (digit && index < 5) {
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
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otpCode];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpCode(newOtp);
      // Focus the appropriate input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setVerifying(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });

    if (error) {
      setError(error.message);
      setVerifying(false);
      setOtpCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email, displayName });
    }
    AuthEvents.signupCompleted('email');

    router.push(redirectTo || '/learn');
    router.refresh();
  };

  const handleGoogleSignup = async () => {
    setError(null);
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
      AuthEvents.signupFailed(error.message);
      setError(error.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    AuthEvents.signupStarted();

    const supabase = createClient();

    // Build the callback URL with redirect
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      AuthEvents.signupFailed(error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    setPendingVerification(true);
    setLoading(false);
    // Focus first OTP input after render
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  if (pendingVerification) {
    return (
      <div className="h-screen bg-[#eef6fc] flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <div className="max-w-[320px] w-full">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-5xl mb-4">✉️</div>
              <h1 className="text-2xl font-bold text-[#3c3c3c] mb-2">Enter verification code</h1>
              <p className="text-slate-500 mb-6">
                We sent a code to <strong className="text-[#3c3c3c]">{email}</strong>
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
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
                    className="w-11 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-lg text-[#3c3c3c] focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={verifying || otpCode.join('').length !== 6}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none"
                style={{ backgroundColor: '#58CC02' }}
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </button>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-400 text-sm mb-3">Didn&apos;t receive the code?</p>
                {resendSuccess ? (
                  <p className="text-[#58CC02] text-sm">New code sent!</p>
                ) : (
                  <button
                    onClick={handleResendConfirmation}
                    disabled={resending}
                    className="text-[#1CB0F6] hover:underline text-sm font-medium disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend code'}
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setPendingVerification(false);
                  setOtpCode(['', '', '', '', '', '']);
                  setError(null);
                }}
                className="mt-4 text-slate-400 hover:text-slate-600 text-sm"
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
    <div className="h-screen bg-[#eef6fc] flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Brand header */}
        <div className="mb-4 text-center">
          <Image
            src="/brand/logo-stacked-light.svg"
            alt="Chess Path"
            width={180}
            height={108}
            className="mx-auto mb-2"
            priority
          />
        </div>

        <div className="w-full max-w-[320px]">
          {/* Card container */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            {/* Congratulatory header for guests who completed a lesson */}
            {fromLesson ? (
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-[#3c3c3c] mb-1">Nice work! 🎉</h1>
                <p className="text-slate-500 text-sm">Create an account to save progress</p>
              </div>
            ) : (
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-[#3c3c3c] mb-1">Create Account</h1>
                <p className="text-slate-500 text-sm">Start your chess journey</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-3 rounded-2xl font-bold text-gray-700 bg-white border-2 border-slate-200 transition-all active:translate-y-[2px] shadow-[0_4px_0_#e2e8f0] flex items-center justify-center gap-3 hover:border-slate-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-600 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[#3c3c3c] placeholder-slate-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="ChessMaster2000"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[#3c3c3c] placeholder-slate-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[#3c3c3c] placeholder-slate-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none"
                style={{ backgroundColor: '#58CC02' }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-500 text-sm pt-4">
            Already have an account?{' '}
            <Link
              href={redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login'}
              className="text-[#58CC02] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#eef6fc] flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
