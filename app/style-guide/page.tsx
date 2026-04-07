'use client';

import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { BOARD_COLORS, MOVE_INDICATOR } from '@/lib/puzzle-utils';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const MIDGAME_FEN = 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 4 6';

export default function StyleGuidePage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-black text-chess-text">Style Guide</h1>
          <p className="text-chess-text-muted text-sm mt-1">
            Every color, component, and pattern used in Chess Path.
          </p>
        </div>

        {/* ── Brand / Logo ── */}
        <Section title="Brand">
          <Subsection title="Breathing Rook">
            <p className="text-xs text-chess-text-muted mb-3">
              The signature loading indicator &amp; mascot. Use everywhere you need a loading state or empty state. Staggered color wave animation.
            </p>
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-end justify-around">
                <div className="flex flex-col items-center gap-2">
                  <BreathingRook size="xs" />
                  <code className="text-[10px] text-chess-text-faint">xs</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BreathingRook size="sm" />
                  <code className="text-[10px] text-chess-text-faint">sm</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BreathingRook size="md" />
                  <code className="text-[10px] text-chess-text-faint">md</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BreathingRook size="lg" />
                  <code className="text-[10px] text-chess-text-faint">lg</code>
                </div>
              </div>
            </div>
            <div className="mt-3 bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-2">With Label</p>
              <div className="flex justify-center">
                <BreathingRook size="md" label="Finding puzzles..." />
              </div>
            </div>
          </Subsection>

          <Subsection title="Animated Logo">
            <p className="text-xs text-chess-text-muted mb-3">
              Full brand logo with staggered block entrance + wordmark fade. Used on splash screens and modals.
            </p>
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-6 flex justify-center overflow-hidden">
              <AnimatedLogo theme="light" size="sm" perpetual />
            </div>
          </Subsection>

          <Subsection title="Icon Only (Perpetual Glow)">
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-6 flex justify-center">
              <AnimatedLogo theme="light" size="md" iconOnly perpetual />
            </div>
          </Subsection>
        </Section>

        {/* ── Colors ── */}
        <Section title="Colors">
          <Subsection title="Backgrounds">
            <div className="grid grid-cols-2 gap-3">
              <ColorSwatch color="bg-chess-page" label="chess-page" hex="#eef6fc" />
              <ColorSwatch color="bg-chess-surface" label="chess-surface" hex="#ffffff" border />
              <ColorSwatch color="bg-chess-bg" label="chess-bg" hex="#131F24" dark />
              <ColorSwatch color="bg-chess-bg-light" label="chess-bg-light" hex="#1A2C35" dark />
            </div>
          </Subsection>

          <Subsection title="Brand">
            <div className="grid grid-cols-2 gap-3">
              <ColorSwatch color="bg-chess-green" label="chess-green" hex="#58CC02" dark />
              <ColorSwatch color="bg-chess-green-dark" label="chess-green-dark" hex="#46A302" dark />
              <ColorSwatch color="bg-chess-blue" label="chess-blue" hex="#1CB0F6" dark />
              <ColorSwatch color="bg-chess-blue-dark" label="chess-blue-dark" hex="#1899D6" dark />
              <ColorSwatch color="bg-chess-gold" label="chess-gold" hex="#FFD700" />
              <ColorSwatch color="bg-chess-gold-dark" label="chess-gold-dark" hex="#B8860B" dark />
              <ColorSwatch color="bg-chess-orange" label="chess-orange" hex="#FF9500" dark />
              <ColorSwatch color="bg-chess-red" label="chess-red" hex="#FF4B4B" dark />
              <ColorSwatch color="bg-chess-purple" label="chess-purple" hex="#CE82FF" />
            </div>
          </Subsection>

          <Subsection title="Text">
            <div className="space-y-2">
              <TextSwatch className="text-chess-text" label="chess-text" hex="#2A3C45" sample="Primary headings and body text" />
              <TextSwatch className="text-chess-text-muted" label="chess-text-muted" hex="#6b7c8a" sample="Secondary text and descriptions" />
              <TextSwatch className="text-chess-text-faint" label="chess-text-faint" hex="#94a3b8" sample="Hints, placeholders, captions" />
            </div>
          </Subsection>

          <Subsection title="Utility">
            <div className="grid grid-cols-2 gap-3">
              <ColorSwatch color="bg-chess-gray" label="chess-gray" hex="#4B4B4B" dark />
              <ColorSwatch color="bg-chess-gray-light" label="chess-gray-light" hex="#6B6B6B" dark />
            </div>
          </Subsection>
        </Section>

        {/* ── Chess Board ── */}
        <Section title="Chess Board">
          <Subsection title="Board Colors (Lichess Green Theme)">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3 flex flex-col justify-end min-h-[72px]" style={{ backgroundColor: BOARD_COLORS.light }}>
                <p className="text-xs font-bold text-chess-text">Light Squares</p>
                <p className="text-[10px] text-chess-text-muted">{BOARD_COLORS.light}</p>
              </div>
              <div className="rounded-xl p-3 flex flex-col justify-end min-h-[72px]" style={{ backgroundColor: BOARD_COLORS.dark }}>
                <p className="text-xs font-bold text-white">Dark Squares</p>
                <p className="text-[10px] text-white/70">{BOARD_COLORS.dark}</p>
              </div>
            </div>
          </Subsection>

          <Subsection title="Starting Position">
            <div className="flex justify-center">
              <div className="w-full max-w-[340px]">
                <ChessPathBoard options={{ position: STARTING_FEN }} />
              </div>
            </div>
            <p className="text-xs text-chess-text-faint mt-2 text-center">
              <code>ChessPathBoard</code> — wrapper around react-chessboard with pre-applied colors
            </p>
          </Subsection>

          <Subsection title="Mid-Game Example">
            <div className="flex justify-center">
              <div className="w-full max-w-[340px]">
                <ChessPathBoard options={{ position: MIDGAME_FEN }} />
              </div>
            </div>
          </Subsection>

          <Subsection title="Square Highlight Styles">
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded" style={{ backgroundColor: 'rgba(255, 170, 0, 0.55)', border: '2px solid rgba(255, 170, 0, 0.8)' }} />
                <div>
                  <p className="text-sm font-medium text-chess-text">Last Move</p>
                  <p className="text-[10px] text-chess-text-faint">rgba(255, 170, 0, 0.5-0.6)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded" style={{ backgroundColor: 'rgba(100, 200, 255, 0.6)', border: '2px solid rgba(100, 200, 255, 0.8)' }} />
                <div>
                  <p className="text-sm font-medium text-chess-text">Selected Square</p>
                  <p className="text-[10px] text-chess-text-faint">rgba(100, 200, 255, 0.6)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded" style={{ backgroundColor: 'rgba(88, 204, 2, 0.7)', boxShadow: 'inset 0 0 0 3px var(--color-chess-green)' }} />
                <div>
                  <p className="text-sm font-medium text-chess-text">Hint (from square)</p>
                  <p className="text-[10px] text-chess-text-faint">rgba(88, 204, 2, 0.7) + green inset border</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: BOARD_COLORS.light }}>
                  <div className="w-3 h-3 rounded-full bg-black/20" />
                </div>
                <div>
                  <p className="text-sm font-medium text-chess-text">Legal Move (empty)</p>
                  <p className="text-[10px] text-chess-text-faint">Dot: radial-gradient rgba(0,0,0,0.2) 25%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded" style={{ backgroundColor: BOARD_COLORS.light, background: MOVE_INDICATOR.capture }} />
                <div>
                  <p className="text-sm font-medium text-chess-text">Legal Capture</p>
                  <p className="text-[10px] text-chess-text-faint">Corner ring: radial-gradient transparent 79%, rgba(0,0,0,0.3) 80%</p>
                </div>
              </div>
            </div>
          </Subsection>

          <Subsection title="Pieces (react-chessboard defaults)">
            <p className="text-xs text-chess-text-muted mb-3">
              Standard SVG pieces from react-chessboard (Wikipedia/Lichess style). No custom piece images.
            </p>
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-2">White</p>
              <div className="flex justify-center mb-3">
                <div className="w-full max-w-[340px]">
                  <ChessPathBoard options={{ position: '8/8/8/8/8/8/8/KQRBNP2 w - - 0 1', showNotation: false }} />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-2">Black</p>
              <div className="flex justify-center">
                <div className="w-full max-w-[340px]">
                  <ChessPathBoard options={{ position: 'kqrbnp2/8/8/8/8/8/8/8 w - - 0 1', showNotation: false }} />
                </div>
              </div>
            </div>
          </Subsection>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-1">DM Sans &middot; Display</p>
              <p className="text-2xl font-bold text-chess-text">Page Title (text-2xl font-bold)</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-1">DM Sans &middot; Display</p>
              <p className="text-xl font-black text-chess-text">Alt Title (text-xl font-black)</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-1">DM Sans &middot; Heading</p>
              <p className="text-lg font-bold text-chess-text">Section Heading (text-lg font-bold)</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-1">DM Sans &middot; Body</p>
              <p className="text-base text-chess-text">Body text at text-base. This is what most content looks like throughout the app.</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-1">DM Sans &middot; Small</p>
              <p className="text-sm text-chess-text">Small body text at text-sm. Used for compact layouts and secondary info.</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-chess-text-faint font-bold mb-1">DM Sans &middot; Caption</p>
              <p className="text-xs text-chess-text-faint">Caption text (text-xs text-chess-text-faint) — hints and metadata</p>
            </div>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <Subsection title="Primary (Green) — Main Actions">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <button className="bg-chess-green text-white font-bold py-3 px-6 rounded-xl hover:bg-chess-green-dark active:scale-95 transition-all">
                  Continue
                </button>
                <code className="text-[11px] text-chess-text-faint">Flat style</code>
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-chess-green text-white font-bold py-3 px-6 rounded-xl border-b-[4px] border-chess-green-shadow hover:brightness-105 active:border-b-[2px] active:translate-y-[2px] transition-all">
                  Start Lesson
                </button>
                <code className="text-[11px] text-chess-text-faint">3D / Duolingo style</code>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-full max-w-xs bg-chess-green text-white font-bold py-3 px-6 rounded-xl border-b-[4px] border-chess-green-shadow hover:brightness-105 active:border-b-[2px] active:translate-y-[2px] transition-all">
                  Full Width
                </button>
                <code className="text-[11px] text-chess-text-faint">Full-width CTA</code>
              </div>
            </div>
          </Subsection>

          <Subsection title="Secondary (Blue) — Navigation">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <button className="bg-chess-blue text-white font-bold py-2 px-4 rounded-xl hover:bg-chess-blue-dark transition-colors">
                  View More
                </button>
                <code className="text-[11px] text-chess-text-faint">Flat style</code>
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-chess-blue text-white font-bold py-2 px-4 rounded-xl border-b-[4px] border-chess-blue-shadow hover:brightness-105 active:border-b-[2px] active:translate-y-[2px] transition-all">
                  Try Again
                </button>
                <code className="text-[11px] text-chess-text-faint">3D style</code>
              </div>
            </div>
          </Subsection>

          <Subsection title="Premium (Gold Gradient) — Upsell">
            <div className="flex items-center gap-4">
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-white font-bold py-3 px-6 rounded-xl transition-all hover:opacity-90">
                Unlock Premium
              </button>
              <code className="text-[11px] text-chess-text-faint">Gradient + 3D</code>
            </div>
          </Subsection>

          <Subsection title="Ghost — Text Only">
            <div className="flex items-center gap-4">
              <button className="text-chess-text-muted hover:text-chess-text transition-colors font-medium">
                Maybe Later
              </button>
              <code className="text-[11px] text-chess-text-faint">Ghost / text-only</code>
            </div>
          </Subsection>

          <Subsection title="Disabled">
            <div className="flex items-center gap-4">
              <button className="bg-chess-green/40 text-white/60 font-bold py-3 px-6 rounded-xl cursor-not-allowed" disabled>
                Continue
              </button>
              <code className="text-[11px] text-chess-text-faint">Disabled state</code>
            </div>
          </Subsection>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Standard Card</p>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
                <p className="font-bold text-chess-text">Lesson: Knight Forks</p>
                <p className="text-sm text-chess-text-muted mt-1">Learn how to attack two pieces at once with your knight.</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Card with Action</p>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-chess-text">Daily Rook</p>
                    <p className="text-sm text-chess-text-muted">22 puzzles, climb the ranks</p>
                  </div>
                  <button className="bg-chess-green text-white font-bold py-2 px-4 rounded-xl text-sm hover:bg-chess-green-dark transition-colors">
                    Play
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Premium / Gold Border</p>
              <div className="bg-chess-surface rounded-2xl border-2 border-chess-gold shadow-sm p-4 celebratory-glow">
                <div className="flex items-center gap-3">
                  <BreathingRook size="xs" />
                  <div>
                    <p className="font-bold text-chess-text">Premium Lesson</p>
                    <p className="text-sm text-chess-text-muted">Advanced endgame technique</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Stat Card</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-3 text-center">
                  <p className="text-2xl font-black text-chess-green">12</p>
                  <p className="text-xs text-chess-text-muted">Streak</p>
                </div>
                <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-3 text-center">
                  <p className="text-2xl font-black text-chess-blue">847</p>
                  <p className="text-xs text-chess-text-muted">Puzzles</p>
                </div>
                <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-3 text-center">
                  <p className="text-2xl font-black text-chess-gold">1450</p>
                  <p className="text-xs text-chess-text-muted">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Inputs">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Text Input</p>
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-chess-surface text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green"
                readOnly
              />
            </div>
            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Gold Focus (Premium)</p>
              <input
                type="text"
                placeholder="Display name"
                className="w-full px-4 py-3 bg-chess-surface border-2 border-chess-gold rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none transition-colors shadow-sm"
                readOnly
              />
            </div>
          </div>
        </Section>

        {/* ── Popups & Modals ── */}
        <Section title="Popups & Modals">
          <p className="text-sm text-chess-text-muted mb-4">
            All modals follow: <code className="bg-slate-100 px-1 rounded text-xs">fixed inset-0</code> container &rarr; absolute backdrop &rarr; centered card. Two themes: dark (navy) for in-lesson contexts, light (white) for auth/profile flows.
          </p>

          <Subsection title="Backdrop Styles">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <div className="bg-black/50 h-24 flex items-center justify-center">
                  <code className="text-white text-[10px]">bg-black/50</code>
                </div>
                <p className="text-[10px] text-chess-text-faint p-2 text-center">Standard (auth, profile)</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <div className="bg-black/80 backdrop-blur-sm h-24 flex items-center justify-center">
                  <code className="text-white text-[10px]">bg-black/80 + blur</code>
                </div>
                <p className="text-[10px] text-chess-text-faint p-2 text-center">Heavy (paywall, limit)</p>
              </div>
            </div>
          </Subsection>

          <Subsection title="Dark Modal (In-Lesson / Paywall)">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-black/80 backdrop-blur-sm p-5 flex items-center justify-center min-h-[340px]">
                <div className="relative bg-chess-bg-light rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
                  {/* Logo container */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <BreathingRook size="xs" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">Keep Learning?</h3>
                  <p className="text-sm text-white/60 text-center mt-1 mb-5">You&apos;ve used your free lessons for today.</p>
                  {/* Option cards */}
                  <div className="space-y-2.5 mb-4">
                    <div className="bg-chess-bg-deep rounded-xl p-3">
                      <p className="text-sm font-bold text-white">Save Progress</p>
                      <p className="text-xs text-white/50 mt-0.5">Sign up free, keep your streaks</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-3 border border-yellow-500/20">
                      <p className="text-sm font-bold text-white">Unlock Everything</p>
                      <p className="text-xs text-white/50 mt-0.5">All lessons, no limits</p>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-chess-green border-b-4 border-chess-green-dark text-white font-bold transition-all">
                    Sign Up Free
                  </button>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-orange-700 text-white font-bold transition-all mt-2">
                    Go Premium
                  </button>
                  <button className="w-full text-white/40 hover:text-white/60 transition-colors font-medium mt-3 text-sm">
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              Card: <code>bg-chess-bg-light rounded-2xl border border-white/10 shadow-2xl p-6 max-w-sm</code>
            </p>
          </Subsection>

          <Subsection title="Light Modal (Auth / Profile)">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-black/50 p-5 flex items-center justify-center min-h-[320px]">
                <div className="relative bg-white rounded-3xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden">
                  <div className="px-6 pt-6 pb-5">
                    <div className="flex justify-center mb-3">
                      <AnimatedLogo theme="light" size={0.4} iconOnly perpetual />
                    </div>
                    <h3 className="text-lg font-bold text-chess-text text-center">Create Your Profile</h3>
                    <p className="text-sm text-chess-text-muted text-center mt-1 mb-4">Save your progress across devices</p>
                    {/* Free tier */}
                    <div className="bg-chess-page rounded-xl p-4 mb-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-chess-text">Free</span>
                        <span className="text-xs font-bold text-chess-green bg-chess-green/10 px-2 py-0.5 rounded-full">$0</span>
                      </div>
                      <button className="w-full py-2.5 rounded-xl bg-chess-green text-white font-bold text-sm shadow-[0_3px_0_#3d8c01] active:translate-y-[1px] active:shadow-[0_2px_0_#3d8c01] transition-all">
                        Sign Up Free
                      </button>
                    </div>
                    {/* Premium tier */}
                    <div className="relative rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' }}>
                      <div className="absolute top-2 right-2 bg-gradient-to-l from-amber-600 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Best Value</div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-chess-text">Premium</span>
                        <span className="text-xs font-bold text-amber-700">$4.99/mo</span>
                      </div>
                      <button className="w-full py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-[0_3px_0_#7A5A00]" style={{ background: 'linear-gradient(135deg, #D4A017, #B8860B)' }}>
                        Start Premium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              Card: <code>bg-white rounded-3xl shadow-2xl max-w-sm mx-4</code> &middot; Slides up with <code>cubic-bezier(0.16, 1, 0.3, 1)</code>
            </p>
          </Subsection>

          <Subsection title="Board Overlay Popup (Intro / Help)">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-black/70 p-5 flex items-center justify-center min-h-[240px]">
                <div className="relative max-w-sm w-full bg-chess-bg-light rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Green-to-blue accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-chess-green to-chess-blue" />
                  <div className="px-4 py-3">
                    <h3 className="text-base font-bold text-white">Knight Forks</h3>
                    <p className="text-sm text-chess-text-light mt-1 leading-snug">Attack two pieces at once by moving your knight to a square that threatens both targets.</p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 rounded-xl border border-white/20 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors">
                        Skip
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-chess-green text-white text-sm font-bold uppercase tracking-wide shadow-[0_4px_0_#46A302] active:translate-y-[1px] active:shadow-[0_2px_0_#46A302] transition-all">
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              Accent bar: <code>h-1.5 bg-gradient-to-r from-chess-green to-chess-blue</code> &middot; Positioned over the board, not fixed
            </p>
          </Subsection>

          <Subsection title="Puzzle Result (Correct / Wrong)">
            <div className="space-y-3">
              <div className="w-full rounded-b-2xl bg-chess-correct-bg py-2.5 pr-4 pl-4">
                <div className="flex items-center gap-3">
                  <BreathingRook size="xs" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-chess-green-dark">Correct!</p>
                    <button className="w-full mt-1.5 py-2 rounded-xl bg-chess-green text-white text-sm font-bold shadow-[0_3px_0_var(--color-chess-green-dark)] active:translate-y-[1px] transition-all">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full rounded-b-2xl bg-chess-wrong-bg py-2.5 pr-4 pl-2">
                <div className="flex items-center gap-3">
                  <BreathingRook size="xs" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-chess-red">Not quite — try again.</p>
                    <button className="w-full mt-1.5 py-2 rounded-xl bg-chess-red text-white text-sm font-bold shadow-[0_3px_0_#CC3939] active:translate-y-[1px] transition-all">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              Sits below the board. Correct: <code>bg-chess-correct-bg</code> &middot; Wrong: <code>bg-chess-wrong-bg</code> &middot; Slides up with bounce
            </p>
          </Subsection>
        </Section>

        {/* ── Celebrations ── */}
        <Section title="Celebrations">
          <p className="text-sm text-chess-text-muted mb-4">
            Full-screen celebration on lesson complete. Staggered <code className="bg-slate-100 px-1 rounded text-xs">fadeInUp</code> animation cascades through every element (0.1s increments).
          </p>

          <Subsection title="Lesson Complete — Pass">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-chess-bg min-h-[420px] flex flex-col items-center px-5 py-6">
                {/* Rook */}
                <div className="mb-3 animate-fadeInUp">
                  <BreathingRook size="lg" />
                </div>
                {/* Score */}
                <p className="text-4xl font-black text-chess-green mb-1 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>5/6</p>
                <p className="text-sm font-bold text-chess-gold animate-fadeInUp" style={{ animationDelay: '0.15s' }}>Great Job!</p>
                <p className="text-xs text-white/50 mt-1 mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>&quot;Every master was once a beginner.&quot;</p>
                {/* Share card mock */}
                <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-gradient-to-br from-chess-green to-emerald-700 p-4 text-center">
                    <p className="text-white/60 text-xs">chesspath.app</p>
                    <p className="text-white text-lg font-bold mt-1">Knight Forks</p>
                    <p className="text-3xl font-black text-white mt-1">5/6</p>
                  </div>
                </div>
                {/* Share buttons */}
                <div className="flex gap-2 w-full max-w-xs mb-4 animate-fadeInUp" style={{ animationDelay: '0.38s' }}>
                  <button className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm shadow-[0_4px_0_#0077A3] transition-all" style={{ background: 'linear-gradient(135deg, var(--color-chess-blue), #0A9FE0)' }}>
                    Share
                  </button>
                  <button className="py-2.5 px-4 rounded-xl bg-white/10 text-white/70 text-sm font-medium border border-white/20">
                    Copy
                  </button>
                </div>
                {/* CTA */}
                <button className="w-full max-w-xs py-3.5 rounded-xl bg-chess-green text-white font-bold text-lg shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[1px] transition-all animate-fadeInUp" style={{ animationDelay: '0.45s' }}>
                  Continue
                </button>
              </div>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              Background: <code>bg-chess-bg</code> (dark) &middot; Canvas confetti on mount &middot; Score color: green (pass), gold (perfect), red (fail)
            </p>
          </Subsection>

          <Subsection title="Lesson Complete — Fail">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-chess-page min-h-[300px] flex flex-col items-center px-5 py-6">
                <div className="mb-3">
                  <BreathingRook size="lg" />
                </div>
                <p className="text-4xl font-black text-chess-red mb-1">2/6</p>
                <p className="text-sm font-bold text-chess-red">Keep Practicing!</p>
                <p className="text-xs text-chess-text-faint mt-1 mb-5">&quot;Mistakes are proof that you are trying.&quot;</p>
                <div className="w-full max-w-xs space-y-2">
                  <button className="w-full py-3.5 rounded-xl bg-chess-blue text-white font-bold text-lg shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-[1px] transition-all">
                    Try Again
                  </button>
                  <button className="w-full py-3 rounded-xl text-chess-text-muted font-medium hover:text-chess-text transition-colors">
                    Back to Learn
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              Background: <code>bg-chess-page</code> (light) &middot; No confetti &middot; Two buttons: retry (blue) + back (ghost)
            </p>
          </Subsection>

          <Subsection title="Daily Rook Score Card">
            <div className="bg-chess-surface rounded-2xl p-4 celebratory-glow">
              <p className="text-center text-transparent bg-clip-text font-black text-sm mb-1" style={{ backgroundImage: 'linear-gradient(90deg, #FF9500, #FF6B6B)' }}>
                Daily Rook Complete
              </p>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-5xl font-black text-chess-orange">18</span>
                <span className="text-lg text-chess-orange/35">/22</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-base font-semibold text-chess-text/40">2:34</span>
              </div>
            </div>
            <div className="mt-3">
              <button className="w-full py-3 rounded-xl text-white font-bold shadow-[0_3px_0_#CC6600] active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(135deg, var(--color-chess-orange), #FF6B6B)' }}>
                Share Results
              </button>
            </div>
            <p className="text-[10px] text-chess-text-faint mt-2">
              <code>celebratory-glow</code> animation on card &middot; Orange gradient share button
            </p>
          </Subsection>

          <Subsection title="Animation Cascade Pattern">
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-chess-text-muted mb-3">Every celebration element staggers with <code className="bg-slate-100 px-1 rounded text-[10px]">fadeInUp 0.4s ease-out</code> at increasing delays:</p>
              <div className="space-y-1.5">
                {[
                  { delay: '0s', label: 'Rook animation' },
                  { delay: '0.1s', label: 'Score (5/6)' },
                  { delay: '0.15s', label: 'Tier label' },
                  { delay: '0.2s', label: 'Quote' },
                  { delay: '0.3s', label: 'OG share card' },
                  { delay: '0.38s', label: 'Share buttons' },
                  { delay: '0.45s', label: 'Continue / action buttons' },
                  { delay: '0.55s', label: 'Guest signup prompt' },
                ].map(({ delay, label }) => (
                  <div key={delay} className="flex items-center gap-3">
                    <code className="text-[10px] text-chess-blue font-bold w-10 shrink-0">{delay}</code>
                    <div className="h-2 bg-chess-blue/20 rounded-full flex-1">
                      <div className="h-full bg-chess-blue/60 rounded-full" style={{ width: `${100 - parseFloat(delay) * 120}%` }} />
                    </div>
                    <span className="text-xs text-chess-text-muted shrink-0">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Subsection>
        </Section>

        {/* ── Progress / Feedback ── */}
        <Section title="Progress & Feedback">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Progress Bar</p>
              <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex justify-between text-xs text-chess-text-muted mb-1.5">
                  <span>Lesson Progress</span>
                  <span>7 / 10</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-chess-green rounded-full transition-all" style={{ width: '70%' }} />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Success State</p>
              <div className="bg-chess-green/10 border border-chess-green rounded-xl p-3 text-center">
                <p className="text-chess-green font-bold text-sm">Correct! Great move.</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Error State</p>
              <div className="bg-chess-red/10 border border-chess-red rounded-xl p-3 text-center">
                <p className="text-chess-red font-bold text-sm">Not quite — try again.</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">Warning / Info</p>
              <div className="bg-chess-orange/10 border border-chess-orange rounded-xl p-3">
                <p className="text-chess-orange font-bold text-sm">Heads up: Your streak is about to expire!</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Badges / Chips ── */}
        <Section title="Badges & Chips">
          <div className="flex flex-wrap gap-2">
            <span className="bg-chess-green/15 text-chess-green text-xs font-bold px-2.5 py-1 rounded-full">Completed</span>
            <span className="bg-chess-blue/15 text-chess-blue text-xs font-bold px-2.5 py-1 rounded-full">In Progress</span>
            <span className="bg-chess-gold/20 text-chess-gold-dark text-xs font-bold px-2.5 py-1 rounded-full">Premium</span>
            <span className="bg-chess-purple/15 text-chess-purple text-xs font-bold px-2.5 py-1 rounded-full">Achievement</span>
            <span className="bg-chess-red/15 text-chess-red text-xs font-bold px-2.5 py-1 rounded-full">Locked</span>
            <span className="bg-slate-100 text-chess-text-muted text-xs font-bold px-2.5 py-1 rounded-full">Default</span>
          </div>
        </Section>

        {/* ── Spacing Reference ── */}
        <Section title="Spacing">
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider">Common Spacing Values</p>
            <div className="space-y-2">
              {[
                { label: 'gap-2 (8px)', width: 'w-8' },
                { label: 'gap-3 (12px)', width: 'w-12' },
                { label: 'gap-4 (16px)', width: 'w-16' },
                { label: 'px-4 (16px)', width: 'w-16' },
                { label: 'px-5 (20px)', width: 'w-20' },
                { label: 'py-3 (12px)', width: 'w-12' },
              ].map(({ label, width }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`h-4 ${width} bg-chess-blue/30 rounded`} />
                  <code className="text-xs text-chess-text-muted">{label}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Border Radius ── */}
        <Section title="Border Radius">
          <div className="flex flex-wrap gap-4 items-end">
            {[
              { label: 'rounded-lg', r: 'rounded-lg', size: 'w-16 h-16' },
              { label: 'rounded-xl', r: 'rounded-xl', size: 'w-16 h-16' },
              { label: 'rounded-2xl', r: 'rounded-2xl', size: 'w-16 h-16' },
              { label: 'rounded-full', r: 'rounded-full', size: 'w-16 h-16' },
            ].map(({ label, r, size }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className={`${size} ${r} bg-chess-blue/20 border-2 border-chess-blue/40`} />
                <code className="text-[10px] text-chess-text-faint">{label}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Animations ── */}
        <Section title="Animations">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-chess-green rounded-xl animate-bounce-subtle" />
              <code className="text-[10px] text-chess-text-faint">bounce-subtle</code>
            </div>
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-chess-blue rounded-xl animate-pulse-glow text-chess-blue" />
              <code className="text-[10px] text-chess-text-faint">pulse-glow</code>
            </div>
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-chess-gold rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <code className="text-[10px] text-chess-text-faint">shimmer</code>
            </div>
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-chess-purple rounded-xl celebratory-glow" />
              <code className="text-[10px] text-chess-text-faint">celebratory-glow</code>
            </div>
          </div>
        </Section>

        {/* ── Do's and Don'ts ── */}
        <Section title="Rules">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-chess-green/10 border border-chess-green/30 rounded-xl p-4">
              <p className="font-bold text-chess-green text-sm mb-2">DO</p>
              <ul className="text-sm text-chess-text space-y-1">
                <li>Use design tokens for every color</li>
                <li>Use <code className="bg-slate-100 px-1 rounded text-xs">rounded-xl</code> or <code className="bg-slate-100 px-1 rounded text-xs">rounded-2xl</code></li>
                <li>Keep pages compact and mobile-friendly</li>
                <li>Use <code className="bg-slate-100 px-1 rounded text-xs">chess-green</code> as primary action color</li>
                <li>Test on mobile first</li>
              </ul>
            </div>
            <div className="bg-chess-red/10 border border-chess-red/30 rounded-xl p-4">
              <p className="font-bold text-chess-red text-sm mb-2">DON&apos;T</p>
              <ul className="text-sm text-chess-text space-y-1">
                <li>Use raw hex values — always use tokens</li>
                <li>Use dark backgrounds on user-facing pages</li>
                <li>Use Tailwind default grays for primary colors</li>
                <li>Add horizontal scroll on mobile</li>
                <li>Use more than 2-3 colors on a single page</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ── Helper Components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-chess-text mb-4 pb-2 border-b border-slate-200">{title}</h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-chess-text-faint font-bold uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function ColorSwatch({ color, label, hex, dark, border }: { color: string; label: string; hex: string; dark?: boolean; border?: boolean }) {
  return (
    <div className={`${color} ${border ? 'border border-slate-200' : ''} rounded-xl p-3 flex flex-col justify-end min-h-[72px]`}>
      <p className={`text-xs font-bold ${dark ? 'text-white' : 'text-chess-text'}`}>{label}</p>
      <p className={`text-[10px] ${dark ? 'text-white/70' : 'text-chess-text-muted'}`}>{hex}</p>
    </div>
  );
}

function TextSwatch({ className, label, hex, sample }: { className: string; label: string; hex: string; sample: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <div className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: hex }} />
      <div className="min-w-0">
        <p className={`${className} text-sm font-medium`}>{sample}</p>
        <p className="text-[10px] text-chess-text-faint">{label} &middot; {hex}</p>
      </div>
    </div>
  );
}
