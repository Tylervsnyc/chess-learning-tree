'use client';

import Link from 'next/link';

export default function TestHeaderButtonsPage() {
  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Current Header (for comparison) */}
      <section className="p-4 border-b border-white/20">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Current (inconsistent)</h2>
        <header className="bg-[#1A2C35] border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <span className="text-lg font-bold text-white">The Chess Path</span>
            <nav className="flex items-center gap-2">
              <Link
                href="#"
                className="px-3 py-1.5 text-sm font-semibold rounded-lg transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </Link>
              <Link
                href="#"
                className="px-3 py-1.5 text-sm text-white rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </Link>
              <Link
                href="#"
                className="px-4 py-1.5 text-sm text-white rounded-lg transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>
      </section>

      {/* Fixed Header - smaller, consistent sizing */}
      <section className="p-4 border-b border-white/20">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Fixed (consistent, smaller)</h2>
        <header className="bg-[#1A2C35] border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <span className="text-lg font-bold text-white">The Chess Path</span>
            <nav className="flex items-center gap-1.5">
              <Link
                href="#"
                className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Premium
              </Link>
              <Link
                href="#"
                className="px-2.5 py-1 text-xs text-white rounded-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </Link>
              <Link
                href="#"
                className="px-2.5 py-1 text-xs text-white rounded-md transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>
      </section>

      {/* Alt: Even smaller with tighter spacing */}
      <section className="p-4 border-b border-white/20">
        <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Alt: Tighter spacing</h2>
        <header className="bg-[#1A2C35] border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <span className="text-lg font-bold text-white">The Chess Path</span>
            <nav className="flex items-center gap-1">
              <Link
                href="#"
                className="px-2 py-1 text-xs font-semibold rounded transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Premium
              </Link>
              <Link
                href="#"
                className="px-2 py-1 text-xs text-white rounded transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </Link>
              <Link
                href="#"
                className="px-2 py-1 text-xs text-white rounded transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>
      </section>

      {/* Button comparison side by side */}
      <section className="p-4">
        <h2 className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Button comparison (stacked)</h2>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current buttons:</p>
            <div className="flex items-center gap-2 bg-[#1A2C35] p-3 rounded-lg">
              <Link
                href="#"
                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </Link>
              <Link
                href="#"
                className="px-3 py-1.5 text-sm text-white rounded-lg"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </Link>
              <Link
                href="#"
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Fixed buttons (smaller, consistent px-2.5 py-1 text-xs):</p>
            <div className="flex items-center gap-1.5 bg-[#1A2C35] p-3 rounded-lg">
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
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Alt: minimum size (px-2 py-0.5 text-xs):</p>
            <div className="flex items-center gap-1 bg-[#1A2C35] p-3 rounded-lg">
              <Link
                href="#"
                className="px-2 py-0.5 text-xs font-semibold rounded"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Premium
              </Link>
              <Link
                href="#"
                className="px-2 py-0.5 text-xs text-white rounded"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </Link>
              <Link
                href="#"
                className="px-2 py-0.5 text-xs text-white rounded"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile frame mockup */}
      <section className="p-4">
        <h2 className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Mobile frame preview (375px width)</h2>
        <div className="mx-auto" style={{ width: '375px', border: '2px solid #333', borderRadius: '20px', overflow: 'hidden' }}>
          <header className="bg-[#1A2C35] border-b border-white/10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-base font-bold text-white">The Chess Path</span>
              <nav className="flex items-center gap-1.5">
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
                  style={{
                    background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                  }}
                >
                  Sign Up
                </Link>
              </nav>
            </div>
          </header>
          <div className="h-64 bg-[#131F24] flex items-center justify-center text-gray-500 text-sm">
            Page content...
          </div>
        </div>
      </section>
    </div>
  );
}
