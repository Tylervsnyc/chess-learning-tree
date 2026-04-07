'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

/**
 * Before/After comparison page for design system standardization.
 * Shows what currently exists vs what it will look like after fixes.
 */
export default function BeforeAfterPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-chess-text">Before / After</h1>
          <p className="text-chess-text-muted text-sm mt-1">
            Side-by-side comparison of current patterns vs standardized versions.
            Most changes are invisible (same color, just using tokens). Visible changes are called out.
          </p>
        </div>

        {/* ── Buttons ── */}
        <CompareSection title="Buttons — Raw Hex → Tokens" note="These should look identical. Just swapping hardcoded hex for design tokens.">
          <Compare label="Primary Green Button">
            <Before>
              <button className="w-full py-3 bg-chess-green hover:bg-chess-green-dark text-white font-semibold rounded-lg transition-colors shadow-[0_4px_0_#3d8c01]">
                Try Again
              </button>
              <Tags values={['bg-chess-green', 'rounded-lg', 'font-semibold']} />
            </Before>
            <After>
              <button className="w-full py-3 bg-chess-green hover:bg-chess-green-dark text-white font-bold rounded-xl transition-colors shadow-[0_4px_0_var(--color-chess-green-shadow)]">
                Try Again
              </button>
              <Tags values={['bg-chess-green', 'rounded-xl', 'font-bold']} />
            </After>
          </Compare>

          <Compare label="3D Green Button (Duolingo style)">
            <Before>
              <button className="w-full py-3 rounded-xl bg-chess-green border-b-4 border-chess-green-dark active:border-b-0 active:mt-1 text-white font-bold text-lg transition-all hover:bg-chess-green-dark">
                Sign Up Free
              </button>
              <Tags values={['bg-chess-green', 'border-chess-green-dark', 'hover:bg-chess-green-dark']} />
            </Before>
            <After>
              <button className="w-full py-3 rounded-xl bg-chess-green border-b-[4px] border-chess-green-shadow text-white font-bold text-lg transition-all hover:brightness-105 active:border-b-[2px] active:translate-y-[2px]">
                Sign Up Free
              </button>
              <Tags values={['bg-chess-green', 'border-chess-green-shadow', 'hover:brightness-105']} />
            </After>
          </Compare>

          <Compare label="Blue Button">
            <Before>
              <button className="w-full py-3 bg-chess-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-center">
                Try Signing In
              </button>
              <Tags values={['hover:bg-blue-600', 'rounded-lg', 'font-semibold']} />
            </Before>
            <After>
              <button className="w-full py-3 bg-chess-blue hover:bg-chess-blue-dark text-white font-bold rounded-xl transition-colors text-center">
                Try Signing In
              </button>
              <Tags values={['hover:bg-chess-blue-dark', 'rounded-xl', 'font-bold']} />
            </After>
          </Compare>

          <Compare label="Premium Button Hover">
            <Before>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 text-white font-bold transition-all hover:opacity-90">
                Go Premium
              </button>
              <Tags values={['hover:opacity-90']} />
            </Before>
            <After>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 text-white font-bold transition-all hover:brightness-105">
                Go Premium
              </button>
              <Tags values={['hover:brightness-105']} />
            </After>
          </Compare>

          <Compare label="Dark Secondary Button">
            <Before>
              <button className="w-full py-3 bg-chess-bg hover:bg-chess-bg-deep text-white font-semibold rounded-lg transition-colors border border-gray-600 text-center">
                Back to Home
              </button>
              <Tags values={['bg-chess-bg', 'rounded-lg', 'font-semibold', 'border-gray-600']} />
            </Before>
            <After>
              <button className="w-full py-3 bg-chess-bg hover:bg-chess-bg-light text-white font-bold rounded-xl transition-colors border border-white/20 text-center">
                Back to Home
              </button>
              <Tags values={['bg-chess-bg', 'rounded-xl', 'font-bold', 'border-white/20']} />
            </After>
          </Compare>
        </CompareSection>

        {/* ── Cards ── */}
        <CompareSection title="Cards — bg-white → bg-chess-surface + borders" note="bg-white and bg-chess-surface are both #ffffff so the color is identical. The visible changes are: rounded-xl → rounded-2xl (slightly rounder) and added subtle borders.">
          <Compare label="Auth Card (Login/Signup)">
            <Before>
              <div className="bg-white rounded-2xl shadow-md p-4">
                <p className="font-bold text-chess-text text-sm">Welcome Back</p>
                <p className="text-slate-500 text-xs mt-1">Sign in to continue</p>
              </div>
              <Tags values={['bg-white', 'no border']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-2xl shadow-sm border border-slate-200 p-4">
                <p className="font-bold text-chess-text text-sm">Welcome Back</p>
                <p className="text-chess-text-muted text-xs mt-1">Sign in to continue</p>
              </div>
              <Tags values={['bg-chess-surface', 'border border-slate-200']} />
            </After>
          </Compare>

          <Compare label="Daily Rook Info Cards">
            <Before>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <p className="text-lg font-black text-chess-text">5:00</p>
                  <p className="text-xs text-chess-text-muted">Time</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <p className="text-lg font-black text-chess-red">3</p>
                  <p className="text-xs text-chess-text-muted">Lives</p>
                </div>
              </div>
              <Tags values={['bg-white', 'rounded-xl', 'no border']} />
            </Before>
            <After>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-chess-surface rounded-2xl border border-slate-200 p-3 text-center shadow-sm">
                  <p className="text-lg font-black text-chess-text">5:00</p>
                  <p className="text-xs text-chess-text-muted">Time</p>
                </div>
                <div className="bg-chess-surface rounded-2xl border border-slate-200 p-3 text-center shadow-sm">
                  <p className="text-lg font-black text-chess-red">3</p>
                  <p className="text-xs text-chess-text-muted">Lives</p>
                </div>
              </div>
              <Tags values={['bg-chess-surface', 'rounded-2xl', 'border border-slate-200']} />
            </After>
          </Compare>

          <Compare label="Error Page Card">
            <Before>
              <div className="bg-chess-bg-light rounded-xl p-4">
                <p className="text-white font-bold text-sm">Something went wrong</p>
                <p className="text-gray-400 text-xs mt-1">Please try again</p>
              </div>
              <Tags values={['bg-chess-bg-light', 'rounded-xl', 'text-gray-400']} />
            </Before>
            <After>
              <div className="bg-chess-bg-light rounded-2xl p-4 border border-white/10">
                <p className="text-white font-bold text-sm">Something went wrong</p>
                <p className="text-chess-text-faint text-xs mt-1">Please try again</p>
              </div>
              <Tags values={['bg-chess-bg-light', 'rounded-2xl', 'text-chess-text-faint']} />
            </After>
          </Compare>
        </CompareSection>

        {/* ── Text Colors ── */}
        <CompareSection title="Text Colors — gray/slate → chess tokens" note="Some of these are very close in shade, others shift noticeably. The chess tokens are designed to feel warmer and more cohesive with our blue-tinted page background.">
          <Compare label="Secondary Text">
            <Before>
              <div className="bg-chess-surface rounded-xl p-4 border border-slate-200">
                <p className="text-sm font-bold text-chess-text">Lesson Complete</p>
                <p className="text-gray-400 text-xs mt-1">You&apos;ve completed your chess learning for today</p>
                <p className="text-gray-500 text-xs mt-2">Cancel anytime</p>
              </div>
              <Tags values={['text-gray-400 (#9ca3af)', 'text-gray-500 (#6b7280)']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-xl p-4 border border-slate-200">
                <p className="text-sm font-bold text-chess-text">Lesson Complete</p>
                <p className="text-chess-text-muted text-xs mt-1">You&apos;ve completed your chess learning for today</p>
                <p className="text-chess-text-faint text-xs mt-2">Cancel anytime</p>
              </div>
              <Tags values={['text-chess-text-muted (#6b7c8a)', 'text-chess-text-faint (#94a3b8)']} />
            </After>
          </Compare>

          <Compare label="Auth Page Text (slate → chess)">
            <Before>
              <div className="bg-chess-surface rounded-xl p-4 border border-slate-200">
                <p className="text-slate-500 text-sm">Enter your email to get started</p>
                <p className="text-slate-400 text-xs mt-2">OR</p>
                <p className="text-sm font-medium text-slate-600 mt-2">Continue with Google</p>
                <p className="text-slate-400 text-xs mt-2">Already have an account? <span className="hover:text-slate-500">Sign in</span></p>
              </div>
              <Tags values={['text-slate-400', 'text-slate-500', 'text-slate-600']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-xl p-4 border border-slate-200">
                <p className="text-chess-text-muted text-sm">Enter your email to get started</p>
                <p className="text-chess-text-faint text-xs mt-2">OR</p>
                <p className="text-sm font-medium text-chess-text-muted mt-2">Continue with Google</p>
                <p className="text-chess-text-faint text-xs mt-2">Already have an account? <span className="hover:text-chess-text-muted">Sign in</span></p>
              </div>
              <Tags values={['text-chess-text-faint', 'text-chess-text-muted']} />
            </After>
          </Compare>

          <Compare label="Dark Modal Text">
            <Before>
              <div className="bg-chess-bg-light rounded-xl p-4">
                <p className="text-white font-bold text-sm">Save Your Progress!</p>
                <p className="text-gray-400 text-xs mt-1">Create a free account to keep your streak alive.</p>
                <button className="w-full mt-3 py-2 rounded-xl bg-transparent text-gray-400 font-medium text-sm hover:text-white transition-colors">
                  Maybe Later
                </button>
              </div>
              <Tags values={['text-gray-400 (neutral gray)']} />
            </Before>
            <After>
              <div className="bg-chess-bg-light rounded-xl p-4">
                <p className="text-white font-bold text-sm">Save Your Progress!</p>
                <p className="text-chess-text-muted text-xs mt-1">Create a free account to keep your streak alive.</p>
                <button className="w-full mt-3 py-2 rounded-xl bg-transparent text-chess-text-muted font-medium text-sm hover:text-white transition-colors">
                  Maybe Later
                </button>
              </div>
              <Tags values={['text-chess-text-muted (blue-tinted gray)']} />
            </After>
          </Compare>
        </CompareSection>

        {/* ── Modals ── */}
        <CompareSection title="Modal Popups — Raw Hex → Tokens" note="Dark modal backgrounds swap #1A2C35 for bg-chess-bg-light (same color). Accent bar swaps raw hex for token gradients.">
          <Compare label="Intro Popup (Board Overlay)">
            <Before>
              <div className="rounded-xl overflow-hidden">
                <div className="bg-black/70 p-4 flex items-center justify-center">
                  <div className="bg-chess-bg-light rounded-2xl border border-white/10 shadow-2xl overflow-hidden w-full max-w-xs">
                    <div className="h-1.5 bg-gradient-to-r from-chess-green to-chess-blue" />
                    <div className="px-3 py-2">
                      <h3 className="text-sm font-bold text-white">Knight Forks</h3>
                      <p className="text-chess-text-light text-xs mt-1">Attack two pieces at once.</p>
                      <button className="w-full mt-2 py-2 bg-chess-green text-white font-bold rounded-xl text-xs uppercase tracking-wide shadow-[0_4px_0_#46A302]">
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Tags values={['bg-chess-bg-light', 'from-chess-green', 'text-chess-text-light', 'bg-chess-green']} />
            </Before>
            <After>
              <div className="rounded-xl overflow-hidden">
                <div className="bg-black/70 p-4 flex items-center justify-center">
                  <div className="bg-chess-bg-light rounded-2xl border border-white/10 shadow-2xl overflow-hidden w-full max-w-xs">
                    <div className="h-1.5 bg-gradient-to-r from-chess-green to-chess-blue" />
                    <div className="px-3 py-2">
                      <h3 className="text-sm font-bold text-white">Knight Forks</h3>
                      <p className="text-chess-text-faint text-xs mt-1">Attack two pieces at once.</p>
                      <button className="w-full mt-2 py-2 bg-chess-green text-white font-bold rounded-xl text-xs uppercase tracking-wide shadow-[0_4px_0_var(--color-chess-green-dark)]">
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Tags values={['bg-chess-bg-light', 'from-chess-green', 'text-chess-text-faint', 'bg-chess-green']} />
            </After>
          </Compare>
        </CompareSection>

        {/* ── Emojis ── */}
        <CompareSection title="Emojis → Rook / SVG Icons" note="Replacing emojis with the breathing rook or the animated logo. This is the most visible change.">
          <Compare label="Premium Badge">
            <Before>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <span className="text-3xl">&#x1F451;</span>
                <div>
                  <p className="font-bold text-chess-text text-sm">Premium Member</p>
                  <p className="text-chess-text-muted text-xs">Unlimited lessons</p>
                </div>
              </div>
              <Tags values={['Crown emoji']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <AnimatedLogo theme="light" size={0.35} iconOnly perpetual />
                <div>
                  <p className="font-bold text-chess-text text-sm">Premium Member</p>
                  <p className="text-chess-text-muted text-xs">Unlimited lessons</p>
                </div>
              </div>
              <Tags values={['AnimatedLogo iconOnly perpetual']} />
            </After>
          </Compare>

          <Compare label="Email Verification">
            <Before>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 p-6 text-center">
                <div className="text-5xl mb-3">&#x2709;&#xFE0F;</div>
                <p className="font-bold text-chess-text">Check Your Email</p>
                <p className="text-chess-text-muted text-sm mt-1">We sent you a verification link</p>
              </div>
              <Tags values={['Envelope emoji']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 p-6 text-center">
                <div className="flex justify-center mb-3">
                  <BreathingRook size="md" />
                </div>
                <p className="font-bold text-chess-text">Check Your Email</p>
                <p className="text-chess-text-muted text-sm mt-1">We sent you a verification link</p>
              </div>
              <Tags values={['BreathingRook size="md"']} />
            </After>
          </Compare>

          <Compare label="Streak in Nav">
            <Before>
              <div className="bg-chess-surface rounded-xl border border-slate-200 p-3 flex items-center gap-2 w-fit">
                <span>&#x1F525;</span>
                <span className="font-bold text-chess-text text-sm">12</span>
              </div>
              <Tags values={['Fire emoji']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-xl border border-slate-200 p-3 flex items-center gap-2 w-fit">
                <svg className="w-4 h-4 text-chess-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.13 3.08-7.46.58-.71 1.26-1.39 1.92-2.04.24-.24.65-.04.6.3-.24 1.68.18 3.04 1.15 4.08.1.1.26.08.33-.05.47-.84.68-2.07.53-3.64-.02-.24.27-.38.44-.21C13.93 8.6 16 11.65 16 15c0 .55-.06 1.08-.17 1.58-.04.16.12.3.27.21.88-.52 1.57-1.32 2.02-2.25.1-.2.38-.2.44.02.36 1.1.44 2.34.44 2.94 0 4.42-4.03 8-9 8h2z"/>
                </svg>
                <span className="font-bold text-chess-text text-sm">12</span>
              </div>
              <Tags values={['SVG flame icon']} />
            </After>
          </Compare>
        </CompareSection>

        {/* ── Install Prompt ── */}
        <CompareSection title="Other Fixes" note="Smaller fixes across various components.">
          <Compare label="Install Prompt Card">
            <Before>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                <p className="font-bold text-chess-text text-sm">Install Chess Path</p>
                <p className="text-chess-text-muted text-xs mt-1">Add to your home screen</p>
              </div>
              <Tags values={['bg-white', 'shadow-lg', 'border-gray-200']} />
            </Before>
            <After>
              <div className="bg-chess-surface rounded-2xl shadow-sm border border-slate-200 p-4">
                <p className="font-bold text-chess-text text-sm">Install Chess Path</p>
                <p className="text-chess-text-muted text-xs mt-1">Add to your home screen</p>
              </div>
              <Tags values={['bg-chess-surface', 'shadow-sm', 'border-slate-200']} />
            </After>
          </Compare>

          <Compare label="Lesson Complete Guest Signup">
            <Before>
              <div className="bg-chess-bg-light rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-3 text-center">Create a free account to save progress</p>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white text-center bg-chess-text hover:bg-[#3A4C55] transition-colors">
                    Sign Up
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white text-center bg-chess-text hover:bg-[#3A4C55] transition-colors">
                    Sign In
                  </button>
                </div>
              </div>
              <Tags values={['rounded-lg', 'font-semibold', 'hover:bg-[#3A4C55]', 'text-gray-400']} />
            </Before>
            <After>
              <div className="bg-chess-bg-light rounded-2xl p-4 border border-white/10">
                <p className="text-chess-text-muted text-sm mb-3 text-center">Create a free account to save progress</p>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white text-center bg-chess-text hover:brightness-110 transition-all">
                    Sign Up
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white text-center bg-chess-text hover:brightness-110 transition-all">
                    Sign In
                  </button>
                </div>
              </div>
              <Tags values={['rounded-xl', 'font-bold', 'hover:brightness-110', 'text-chess-text-muted']} />
            </After>
          </Compare>
        </CompareSection>

        {/* Summary */}
        <div className="bg-chess-green/10 border border-chess-green/30 rounded-2xl p-5 mt-4">
          <p className="font-bold text-chess-green text-sm mb-2">What to look for</p>
          <ul className="text-sm text-chess-text space-y-1.5">
            <li><strong>Colors:</strong> Most hex→token swaps are invisible (same exact color). A few grays shift slightly warmer.</li>
            <li><strong>Corners:</strong> <code className="bg-slate-100 px-1 rounded text-xs">rounded-lg</code> → <code className="bg-slate-100 px-1 rounded text-xs">rounded-xl</code> is the most noticeable shape change.</li>
            <li><strong>Font weight:</strong> <code className="bg-slate-100 px-1 rounded text-xs">font-semibold</code> → <code className="bg-slate-100 px-1 rounded text-xs">font-bold</code> is slightly heavier.</li>
            <li><strong>Borders:</strong> Cards that were missing borders get a subtle <code className="bg-slate-100 px-1 rounded text-xs">border-slate-200</code>.</li>
            <li><strong>Hover:</strong> <code className="bg-slate-100 px-1 rounded text-xs">hover:opacity-90</code> → <code className="bg-slate-100 px-1 rounded text-xs">hover:brightness-105</code> — brightens instead of fading.</li>
            <li><strong>Emojis:</strong> Replaced with BreathingRook / AnimatedLogo / SVG icons.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Layout Components ── */

function CompareSection({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-chess-text mb-1">{title}</h2>
      <p className="text-xs text-chess-text-faint mb-4">{note}</p>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Compare({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-chess-text-muted font-bold uppercase tracking-wider mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

function Before({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-chess-red uppercase tracking-wider mb-1.5">Before</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function After({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-chess-green uppercase tracking-wider mb-1.5">After</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Tags({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {values.map(v => (
        <code key={v} className="text-[9px] bg-slate-100 text-chess-text-muted px-1.5 py-0.5 rounded">
          {v}
        </code>
      ))}
    </div>
  );
}
