'use client';

import { useState } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

export default function TestAnimatedLogoPage() {
  const [key, setKey] = useState(0);
  const [iconOnly, setIconOnly] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  const replay = () => setKey((k) => k + 1);

  return (
    <div className="h-full overflow-auto bg-chess-bg p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Animated Logo Test</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={replay}
          className="px-4 py-2 bg-chess-green text-white rounded-lg font-semibold"
        >
          Replay Animation
        </button>
        <button
          onClick={() => setIconOnly(!iconOnly)}
          className="px-4 py-2 bg-chess-bg-light text-white rounded-lg"
        >
          {iconOnly ? 'Show Wordmark' : 'Icon Only'}
        </button>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}
          className="px-4 py-2 bg-chess-bg-light text-white rounded-lg"
        >
          <option value="sm">Small (50%)</option>
          <option value="md">Medium (100%)</option>
          <option value="lg">Large (150%)</option>
        </select>
      </div>

      {/* Dark theme demo */}
      <div className="mb-12">
        <h2 className="text-lg text-gray-400 mb-4">Dark Theme</h2>
        <div className="bg-chess-bg border border-gray-700 rounded-xl p-8 flex items-center justify-center">
          <AnimatedLogo
            key={`dark-${key}-${iconOnly}-${size}`}
            theme="dark"
            iconOnly={iconOnly}
            size={size}
            onAnimationComplete={() => console.log('Animation complete!')}
          />
        </div>
      </div>

      {/* Light theme demo */}
      <div className="mb-12">
        <h2 className="text-lg text-gray-400 mb-4">Light Theme</h2>
        <div className="bg-white border border-gray-300 rounded-xl p-8 flex items-center justify-center">
          <AnimatedLogo
            key={`light-${key}-${iconOnly}-${size}`}
            theme="light"
            iconOnly={iconOnly}
            size={size}
          />
        </div>
      </div>

      {/* Sizes comparison */}
      <div className="mb-12">
        <h2 className="text-lg text-gray-400 mb-4">Icon Only - All Sizes</h2>
        <div className="flex items-end gap-8 bg-chess-bg-light rounded-xl p-8">
          <div className="text-center">
            <AnimatedLogo key={`sm-${key}`} iconOnly size="sm" />
            <p className="text-gray-500 mt-2 text-sm">Small</p>
          </div>
          <div className="text-center">
            <AnimatedLogo key={`md-${key}`} iconOnly size="md" />
            <p className="text-gray-500 mt-2 text-sm">Medium</p>
          </div>
          <div className="text-center">
            <AnimatedLogo key={`lg-${key}`} iconOnly size="lg" />
            <p className="text-gray-500 mt-2 text-sm">Large</p>
          </div>
        </div>
      </div>

      {/* Usage info */}
      <div className="bg-chess-bg-light rounded-xl p-6 text-gray-300">
        <h2 className="text-lg font-semibold text-white mb-3">Usage</h2>
        <pre className="text-sm overflow-x-auto">
{`import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

// Basic - auto plays on mount
<AnimatedLogo />

// Dark/light theme
<AnimatedLogo theme="dark" />
<AnimatedLogo theme="light" />

// Icon only (no wordmark)
<AnimatedLogo iconOnly />

// Sizes
<AnimatedLogo size="sm" />  // 50%
<AnimatedLogo size="md" />  // 100%
<AnimatedLogo size="lg" />  // 150%
<AnimatedLogo size={0.75} /> // custom

// Callback when done
<AnimatedLogo onAnimationComplete={() => doSomething()} />

// Don't auto-play
<AnimatedLogo autoPlay={false} />`}
        </pre>
      </div>
    </div>
  );
}
