'use client';

export default function TestLoginButtonPage() {
  return (
    <div className="min-h-screen bg-[#131F24] text-white p-8">
      <h1 className="text-2xl font-bold mb-2">Login Button Style Options</h1>
      <p className="text-gray-400 mb-8">5 options for consistent button styling in the header</p>

      {/* Current State */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Current (Inconsistent)</h2>
        <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 text-sm font-semibold rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              Buy Premium
            </span>
            <span className="text-gray-300 text-sm">Login</span>
            <span
              className="px-4 py-1.5 text-sm text-white rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
              }}
            >
              Sign Up
            </span>
          </div>
        </div>
      </section>

      {/* Option 1: Outline/Border Style */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-green-400 mb-2">Option 1: Outline/Border Style</h2>
        <p className="text-gray-400 text-sm mb-4">Transparent background with white/gray border - subtle but consistent shape</p>

        <div className="space-y-4">
          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With Premium + Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </span>
              <span className="px-3 py-1.5 text-sm text-gray-300 rounded-lg border border-gray-500 hover:border-white hover:text-white transition-colors cursor-pointer">
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>

          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With just Sign Up:</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-sm text-gray-300 rounded-lg border border-gray-500 hover:border-white hover:text-white transition-colors cursor-pointer">
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Option 2: Subtle Dark Fill */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-green-400 mb-2">Option 2: Subtle Dark Fill</h2>
        <p className="text-gray-400 text-sm mb-4">Dark background fill that blends with header but still has button shape</p>

        <div className="space-y-4">
          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With Premium + Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </span>
              <span className="px-3 py-1.5 text-sm text-gray-300 rounded-lg bg-white/10 hover:bg-white/20 hover:text-white transition-colors cursor-pointer">
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>

          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With just Sign Up:</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-sm text-gray-300 rounded-lg bg-white/10 hover:bg-white/20 hover:text-white transition-colors cursor-pointer">
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Option 3: Blue Solid */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-green-400 mb-2">Option 3: Blue Solid</h2>
        <p className="text-gray-400 text-sm mb-4">Solid blue matching the chess-blue accent color (#1CB0F6)</p>

        <div className="space-y-4">
          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With Premium + Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </span>
              <span
                className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>

          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With just Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#1CB0F6' }}
              >
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Option 4: Blue Gradient (Different from Sign Up) */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-green-400 mb-2">Option 4: Blue Gradient</h2>
        <p className="text-gray-400 text-sm mb-4">Blue-to-purple gradient - styled button but distinct from Sign Up</p>

        <div className="space-y-4">
          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With Premium + Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </span>
              <span
                className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #1CB0F6 0%, #8B5CF6 100%)' }}
              >
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>

          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With just Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #1CB0F6 0%, #8B5CF6 100%)' }}
              >
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Option 5: Gray/Muted Gradient */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-green-400 mb-2">Option 5: Gray/Muted Style</h2>
        <p className="text-gray-400 text-sm mb-4">Subtle gray gradient - same shape but clearly secondary action</p>

        <div className="space-y-4">
          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With Premium + Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                }}
              >
                Buy Premium
              </span>
              <span
                className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)' }}
              >
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>

          <div className="bg-[#1A2C35] border-b border-white/10 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">With just Sign Up:</p>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)' }}
              >
                Login
              </span>
              <span
                className="px-4 py-1.5 text-sm text-white rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)',
                }}
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-12 p-6 bg-[#1A2C35] rounded-lg border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li><strong className="text-white">Option 1 (Outline):</strong> Clean, minimal - Login feels like secondary action</li>
          <li><strong className="text-white">Option 2 (Dark Fill):</strong> Subtle but consistent shape - blends with header</li>
          <li><strong className="text-white">Option 3 (Blue Solid):</strong> Eye-catching, uses your accent color</li>
          <li><strong className="text-white">Option 4 (Blue Gradient):</strong> Distinctive gradient, adds visual interest</li>
          <li><strong className="text-white">Option 5 (Gray/Muted):</strong> Clearly secondary to Sign Up while still being a button</li>
        </ul>
      </section>
    </div>
  );
}
