'use client';

import { useState, useCallback } from 'react';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import {
  useFireworksCelebration,
  useRealisticCelebration,
  useStarsCelebration,
  useSideCannonsCelebration,
  useEmojiCelebration,
} from '@/components/puzzle/StreakCelebrations';

export default function TestProgressBar() {
  const [current, setCurrent] = useState(2);
  const [streak, setStreak] = useState(0);
  const [hadWrong, setHadWrong] = useState(false);

  const total = 6;

  // Professional canvas-confetti celebrations
  const fireworks = useFireworksCelebration();
  const realistic = useRealisticCelebration();
  const stars = useStarsCelebration();
  const sideCannons = useSideCannonsCelebration();
  const emoji = useEmojiCelebration();

  // Simulate the magic streak animation (orb travels along bar and bursts)
  const simulateMagicStreak = useCallback(() => {
    setHadWrong(false);
    setStreak(4);
    setCurrent(4);

    // After a brief moment, hit streak 5 to trigger the magic streak
    setTimeout(() => {
      setStreak(5);
      setCurrent(5);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-8">
      <style>{progressBarStyles}</style>

      <div className="max-w-lg mx-auto space-y-12">
        <h1 className="text-2xl font-bold text-center mb-8">Progress Bar Preview</h1>

        {/* Main preview */}
        <div className="space-y-4 relative">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Lesson Progress</span>
            <span>{current}/{total}</span>
          </div>
          <ChessProgressBar
            current={current}
            total={total}
            streak={streak}
            hadWrongAnswer={hadWrong}
          />
        </div>

        {/* Lightning Streak - Duolingo-style supercharged animation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lightning Streak (Supercharged)</h2>
          <p className="text-sm text-gray-400">Duolingo-style lightning bolt shoots across the progress bar and explodes. Extends outside the bar for dramatic effect.</p>

          <button
            onClick={simulateMagicStreak}
            className="w-full py-5 px-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl font-bold text-left hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition-all transform hover:scale-[1.01] active:scale-[0.99] ring-2 ring-yellow-300/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div>
                <div className="text-lg">Lightning Bolt (5 Streak)</div>
                <div className="text-sm font-normal opacity-80">Lightning shoots across bar with electric trail, explodes with mini-bolts</div>
              </div>
            </div>
          </button>
        </div>

        {/* Full-page celebrations using canvas-confetti */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Full-Page Celebrations (canvas-confetti)</h2>
          <p className="text-sm text-gray-400">These cover the whole screen. Good for lesson completion.</p>

          <div className="grid gap-3">
            <button
              onClick={realistic}
              className="w-full py-3 px-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-left hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💥</span>
                <div>
                  <div>Realistic Burst</div>
                  <div className="text-xs font-normal opacity-80">Layered explosion - 5 particle waves</div>
                </div>
              </div>
            </button>

            <button
              onClick={sideCannons}
              className="w-full py-3 px-5 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl font-bold text-left hover:from-green-500 hover:to-emerald-400 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎊</span>
                <div>
                  <div>Side Cannons</div>
                  <div className="text-xs font-normal opacity-80">Duolingo-style from both edges</div>
                </div>
              </div>
            </button>

            <button
              onClick={stars}
              className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl font-bold text-left hover:from-amber-400 hover:to-yellow-300 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <div>
                  <div>Golden Stars</div>
                  <div className="text-xs font-normal opacity-80">Star shapes, zero gravity</div>
                </div>
              </div>
            </button>

            <button
              onClick={fireworks}
              className="w-full py-3 px-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-left hover:from-orange-500 hover:to-red-500 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎆</span>
                <div>
                  <div>Fireworks</div>
                  <div className="text-xs font-normal opacity-80">Random bursts over 2 seconds</div>
                </div>
              </div>
            </button>

            <button
              onClick={emoji}
              className="w-full py-3 px-5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-left hover:from-purple-500 hover:to-pink-400 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👑</span>
                <div>
                  <div>Chess Emoji</div>
                  <div className="text-xs font-normal opacity-80">👑⭐🔥✨🏆 everywhere</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 p-6 bg-[#1A2C35] rounded-xl">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Current: {current}/{total}
            </label>
            <input
              type="range"
              min="0"
              max={total}
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Streak: {streak} {streak >= 5 ? '💥' : streak >= 4 ? '🔥' : streak >= 2 ? '✨' : ''}
            </label>
            <input
              type="range"
              min="0"
              max="6"
              value={streak}
              onChange={(e) => setStreak(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hadWrong"
              checked={hadWrong}
              onChange={(e) => setHadWrong(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="hadWrong" className="text-sm text-gray-400">
              Had wrong answer (disables streak effects)
            </label>
          </div>
        </div>

        {/* State previews */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">All States</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Default (no streak) - cool emerald</p>
              <ChessProgressBar current={3} total={6} streak={0} />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Streak 2-3 - warming green with gentle surge</p>
              <ChessProgressBar current={3} total={6} streak={3} />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Streak 4+ - molten lava 🔥</p>
              <ChessProgressBar current={4} total={6} streak={4} />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Streak 5+ - celebration mode! 💥 (use button above to see burst)</p>
              <ChessProgressBar current={5} total={6} streak={5} />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Complete! Perfect run 🏆</p>
              <ChessProgressBar current={6} total={6} streak={6} />
            </div>
          </div>
        </div>

        {/* Comparison with old */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Before / After</h2>

          <div>
            <p className="text-sm text-gray-400 mb-3">Old progress bar (flat, basic)</p>
            <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-[#58CC02] transition-all duration-300"
                style={{ width: '50%' }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Current (metal containment)</p>
            <ChessProgressBar current={3} total={6} streak={0} />
          </div>
        </div>

        {/* Cyberpunk Border Options */}
        <div className="space-y-8">
          <h2 className="text-lg font-semibold">Cyberpunk Border Options</h2>

          {/* Option 1: Neon Edge */}
          <div>
            <p className="text-sm text-cyan-400 mb-3 font-medium">Option 1: Neon Edge</p>
            <p className="text-xs text-gray-500 mb-3">Glowing cyan outline with dark glass interior</p>
            <div className="relative">
              {/* Outer neon glow */}
              <div
                className="absolute -inset-1 rounded-full blur-sm"
                style={{
                  background: 'linear-gradient(90deg, #00FFFF, #00CCFF, #00FFFF)',
                  opacity: 0.6,
                }}
              />
              {/* Main frame */}
              <div
                className="relative rounded-full p-[2px]"
                style={{
                  background: 'linear-gradient(180deg, #00FFFF 0%, #008B8B 50%, #004444 100%)',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.3)',
                }}
              >
                <div
                  className="relative h-4 rounded-full overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #0a1a1a 0%, #001515 50%, #000a0a 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: '50%',
                      background: 'linear-gradient(90deg, #58CC02, #7FE030, #58CC02)',
                    }}
                  />
                </div>
              </div>
              {/* End caps */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-cyan-400" style={{ background: '#001515', boxShadow: '0 0 8px #00FFFF' }} />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-cyan-400" style={{ background: '#001515', boxShadow: '0 0 8px #00FFFF' }} />
            </div>
          </div>

          {/* Option 2: Industrial Pneumatic */}
          <div>
            <p className="text-sm text-orange-400 mb-3 font-medium">Option 2: Industrial Pneumatic</p>
            <p className="text-xs text-gray-500 mb-3">Heavy ridged metal with pressure gauge aesthetic</p>
            <div className="relative">
              {/* Ridged outer shell */}
              <div
                className="relative rounded-full"
                style={{
                  background: `
                    repeating-linear-gradient(
                      90deg,
                      #3d3d3d 0px,
                      #5a5a5a 2px,
                      #4a4a4a 4px,
                      #3d3d3d 6px
                    )
                  `,
                  padding: '4px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Inner chrome ring */}
                <div
                  className="rounded-full p-[2px]"
                  style={{
                    background: 'linear-gradient(180deg, #888 0%, #444 50%, #222 100%)',
                  }}
                >
                  {/* Glass tube */}
                  <div
                    className="relative h-4 rounded-full overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, rgba(20,30,20,0.95) 0%, rgba(10,15,10,0.98) 100%)',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9), inset 0 -1px 4px rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: '50%',
                        background: 'linear-gradient(90deg, #58CC02, #7FE030, #58CC02)',
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Hex bolts */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            </div>
          </div>

          {/* Option 3: Holographic Display */}
          <div>
            <p className="text-sm text-purple-400 mb-3 font-medium">Option 3: Holographic Display</p>
            <p className="text-xs text-gray-500 mb-3">Floating hologram with scan lines and purple glow</p>
            <div className="relative py-2">
              {/* Holographic base glow */}
              <div
                className="absolute inset-x-4 -bottom-1 h-2 rounded-full blur-md"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.5), transparent)' }}
              />
              {/* Main display */}
              <div
                className="relative rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.3) 0%, rgba(79, 70, 229, 0.2) 100%)',
                  border: '1px solid rgba(147, 51, 234, 0.6)',
                  padding: '3px',
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), inset 0 0 20px rgba(147, 51, 234, 0.1)',
                }}
              >
                {/* Scan line overlay */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                  }}
                />
                {/* Inner display */}
                <div
                  className="relative h-4 rounded overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(20,10,30,0.9) 100%)',
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded"
                    style={{
                      width: '50%',
                      background: 'linear-gradient(90deg, #58CC02, #7FE030, #9EF050, #7FE030, #58CC02)',
                      boxShadow: '0 0 10px rgba(88, 204, 2, 0.5)',
                    }}
                  />
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-purple-500 rounded-r" style={{ boxShadow: '0 0 8px #9333ea' }} />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-purple-500 rounded-l" style={{ boxShadow: '0 0 8px #9333ea' }} />
            </div>
          </div>

          {/* Option 4: Circuit Trace */}
          <div>
            <p className="text-sm text-green-400 mb-3 font-medium">Option 4: Circuit Trace</p>
            <p className="text-xs text-gray-500 mb-3">PCB-inspired with copper traces and solder points</p>
            <div className="relative">
              {/* PCB base */}
              <div
                className="relative rounded-full"
                style={{
                  background: '#1a472a',
                  padding: '4px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {/* Copper trace border */}
                <div
                  className="rounded-full p-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, #b87333, #d4956a, #b87333, #d4956a, #b87333)',
                    boxShadow: '0 0 4px rgba(184, 115, 51, 0.5)',
                  }}
                >
                  {/* Inner track */}
                  <div
                    className="relative h-4 rounded-full overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, #0d2818 0%, #071510 100%)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: '50%',
                        background: 'linear-gradient(90deg, #58CC02, #7FE030, #58CC02)',
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Solder points */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle, #e8e8e8 30%, #b87333 70%)', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle, #e8e8e8 30%, #b87333 70%)', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
              {/* Trace lines */}
              <div className="absolute -left-4 top-1/2 w-4 h-[2px]" style={{ background: '#b87333' }} />
              <div className="absolute -right-4 top-1/2 w-4 h-[2px]" style={{ background: '#b87333' }} />
            </div>
          </div>

          {/* Option 5: Plasma Containment */}
          <div>
            <p className="text-sm text-red-400 mb-3 font-medium">Option 5: Plasma Containment</p>
            <p className="text-xs text-gray-500 mb-3">Heavy-duty containment vessel with warning indicators</p>
            <div className="relative">
              {/* Warning stripes on edges */}
              <div className="absolute left-0 top-0 bottom-0 w-6 overflow-hidden rounded-l-full">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(135deg, #facc15 0px, #facc15 4px, #1f1f1f 4px, #1f1f1f 8px)',
                  }}
                />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-6 overflow-hidden rounded-r-full">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #facc15 0px, #facc15 4px, #1f1f1f 4px, #1f1f1f 8px)',
                  }}
                />
              </div>
              {/* Main containment */}
              <div
                className="relative rounded-full mx-2"
                style={{
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                  padding: '3px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                  border: '2px solid #3f3f3f',
                }}
              >
                {/* Glass viewport with thick frame */}
                <div
                  className="rounded-full p-[3px]"
                  style={{
                    background: 'linear-gradient(180deg, #1f1f1f 0%, #2f2f2f 50%, #1f1f1f 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className="relative h-4 rounded-full overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #030303 100%)',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,50,50,0.1)',
                    }}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: '50%',
                        background: 'linear-gradient(90deg, #58CC02, #7FE030, #58CC02)',
                        boxShadow: '0 0 15px rgba(88, 204, 2, 0.4)',
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Status lights */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #22c55e' }} />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #22c55e' }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
