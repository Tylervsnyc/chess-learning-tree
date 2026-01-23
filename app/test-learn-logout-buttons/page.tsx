'use client';

import Link from 'next/link';

export default function TestLearnLogoutButtonsPage() {
  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <h1 className="text-xl font-bold mb-6">Learn & Logout Button Styling Options</h1>

      {/* Current State */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Current (inconsistent)</h2>
        <div className="bg-[#1A2C35] p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-3">Logged in user sees:</p>
          <nav className="flex items-center gap-1.5">
            <button className="px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 bg-[#58CC02]/20 text-[#58CC02] font-semibold">
              Learn
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              Premium
            </Link>
            <button
              className="px-2.5 py-1 text-xs text-white rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#ef4444' }}
            >
              Log out
            </button>
          </nav>
          <p className="text-xs text-gray-500 mt-3">Logged out user sees:</p>
          <nav className="flex items-center gap-1.5 mt-2">
            <Link
              href="#"
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              Premium
            </Link>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs text-white rounded-md"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              Login
            </Link>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs text-white rounded-md"
              style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </section>

      {/* Option A: All solid colors */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Option A: All solid colors</h2>
        <div className="bg-[#1A2C35] p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-3">Logged in user sees:</p>
          <nav className="flex items-center gap-1.5">
            <button
              className="px-2.5 py-1 text-xs text-white font-semibold rounded-md flex items-center gap-1"
              style={{ backgroundColor: '#58CC02' }}
            >
              Learn
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{ backgroundColor: '#FFD700', color: '#000' }}
            >
              Premium
            </Link>
            <button
              className="px-2.5 py-1 text-xs text-white font-semibold rounded-md"
              style={{ backgroundColor: '#ef4444' }}
            >
              Log out
            </button>
          </nav>
        </div>
      </section>

      {/* Option B: All gradients */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Option B: All gradients</h2>
        <div className="bg-[#1A2C35] p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-3">Logged in user sees:</p>
          <nav className="flex items-center gap-1.5">
            <button
              className="px-2.5 py-1 text-xs text-white font-semibold rounded-md flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #58CC02 0%, #45a001 100%)' }}
            >
              Learn
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              Premium
            </Link>
            <button
              className="px-2.5 py-1 text-xs text-white font-semibold rounded-md"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
            >
              Log out
            </button>
          </nav>
        </div>
      </section>

      {/* Option C: Match Login/SignUp style exactly */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Option C: Learn=green, Logout=blue (like Login)</h2>
        <div className="bg-[#1A2C35] p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-3">Logged in user sees:</p>
          <nav className="flex items-center gap-1.5">
            <button
              className="px-2.5 py-1 text-xs text-white rounded-md flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
            >
              Learn
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              Premium
            </Link>
            <button
              className="px-2.5 py-1 text-xs text-white rounded-md"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              Log out
            </button>
          </nav>
        </div>
      </section>

      {/* Option D: Subtle/outlined for secondary actions */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Option D: Learn solid, Logout subtle/outlined</h2>
        <div className="bg-[#1A2C35] p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-3">Logged in user sees:</p>
          <nav className="flex items-center gap-1.5">
            <button
              className="px-2.5 py-1 text-xs text-white font-semibold rounded-md flex items-center gap-1"
              style={{ backgroundColor: '#58CC02' }}
            >
              Learn
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link
              href="#"
              className="px-2.5 py-1 text-xs font-semibold rounded-md"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              Premium
            </Link>
            <button className="px-2.5 py-1 text-xs text-gray-300 rounded-md border border-gray-500 hover:bg-white/10">
              Log out
            </button>
          </nav>
        </div>
      </section>

      {/* Full header mockups */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Full Header Mockups (375px mobile)</h2>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Option A in header:</p>
            <div className="mx-auto" style={{ width: '375px', border: '2px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
              <header className="bg-[#1A2C35] border-b border-white/10">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-bold">
                    <span className="text-white">chess</span>
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
                  </span>
                  <nav className="flex items-center gap-1.5">
                    <button
                      className="px-2.5 py-1 text-xs text-white font-semibold rounded-md flex items-center gap-1"
                      style={{ backgroundColor: '#58CC02' }}
                    >
                      Learn
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <Link
                      href="#"
                      className="px-2.5 py-1 text-xs font-semibold rounded-md"
                      style={{ backgroundColor: '#FFD700', color: '#000' }}
                    >
                      Premium
                    </Link>
                    <button
                      className="px-2.5 py-1 text-xs text-white font-semibold rounded-md"
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      Log out
                    </button>
                  </nav>
                </div>
              </header>
              <div className="h-32 bg-[#131F24]" />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Option B in header:</p>
            <div className="mx-auto" style={{ width: '375px', border: '2px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
              <header className="bg-[#1A2C35] border-b border-white/10">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-bold">
                    <span className="text-white">chess</span>
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
                  </span>
                  <nav className="flex items-center gap-1.5">
                    <button
                      className="px-2.5 py-1 text-xs text-white font-semibold rounded-md flex items-center gap-1"
                      style={{ background: 'linear-gradient(135deg, #58CC02 0%, #45a001 100%)' }}
                    >
                      Learn
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <Link
                      href="#"
                      className="px-2.5 py-1 text-xs font-semibold rounded-md"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                      }}
                    >
                      Premium
                    </Link>
                    <button
                      className="px-2.5 py-1 text-xs text-white font-semibold rounded-md"
                      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                    >
                      Log out
                    </button>
                  </nav>
                </div>
              </header>
              <div className="h-32 bg-[#131F24]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
