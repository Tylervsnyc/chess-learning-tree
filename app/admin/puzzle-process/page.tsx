'use client'

import Link from 'next/link'

export default function PuzzleProcessPage() {
  return (
    <div className="min-h-screen bg-chess-bg text-white">
      {/* Header */}
      <div className="bg-chess-bg-light border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Puzzle Pipeline</h1>
            <p className="text-sm text-gray-400">How puzzles get from Lichess to lessons</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-chess-blue hover:text-chess-green transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-chess-green">Overview</h2>
          <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
            <p className="text-gray-300 leading-relaxed">
              The Chess Path uses puzzles from the <span className="text-chess-blue">Lichess open database</span> (5.6 million puzzles).
              We preprocess, filter, validate, and curate these puzzles to create structured lessons
              that teach specific tactical concepts at appropriate difficulty levels.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chess-green"></div>
                <span className="text-gray-400">5.6M source puzzles</span>
              </div>
              <div className="text-gray-600">→</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chess-blue"></div>
                <span className="text-gray-400">~150 curated lessons</span>
              </div>
              <div className="text-gray-600">→</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chess-purple"></div>
                <span className="text-gray-400">6 puzzles each</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-chess-green">The Pipeline</h2>

          {/* Step 1 */}
          <div className="relative pl-8 pb-8 border-l-2 border-gray-700">
            <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-chess-green border-4 border-chess-bg"></div>
            <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-green/20 text-chess-green">Step 1</span>
                <h3 className="text-lg font-semibold">Source Data</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Download the complete Lichess puzzle database. Each puzzle includes:
              </p>
              <div className="bg-chess-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-500 mb-2"># Lichess CSV format</div>
                <div><span className="text-chess-green">PuzzleId</span>: Unique ID (e.g., "009tE")</div>
                <div><span className="text-chess-green">FEN</span>: Chess position notation</div>
                <div><span className="text-chess-green">Moves</span>: UCI format (e.g., "e2e4 d7d5 e4d5")</div>
                <div><span className="text-chess-green">Rating</span>: Difficulty (Glicko-2, 400-2500)</div>
                <div><span className="text-chess-green">NbPlays</span>: Times solved (quality signal)</div>
                <div><span className="text-chess-green">Themes</span>: Tactical tags (fork, pin, mateIn1...)</div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-8 pb-8 border-l-2 border-gray-700">
            <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-chess-blue border-4 border-chess-bg"></div>
            <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-blue/20 text-chess-blue">Step 2</span>
                <h3 className="text-lg font-semibold">Preprocessing</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Split the massive CSV into organized chunks by rating and theme:
              </p>
              <div className="bg-chess-bg rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-500 mb-2"># Output structure</div>
                <div className="text-gray-300">
                  <div>data/puzzles-by-rating/</div>
                  <div className="ml-4">├── <span className="text-chess-green">0400-0800</span>/</div>
                  <div className="ml-8">├── fork.csv</div>
                  <div className="ml-8">├── pin.csv</div>
                  <div className="ml-8">├── mateIn1.csv</div>
                  <div className="ml-8">└── ... (25+ themes)</div>
                  <div className="ml-4">├── <span className="text-chess-blue">0800-1200</span>/</div>
                  <div className="ml-4">├── <span className="text-chess-purple">1200-1600</span>/</div>
                  <div className="ml-4">└── ...</div>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Script: <code className="bg-chess-bg px-1.5 py-0.5 rounded">preprocess-puzzles.sh</code>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-8 pb-8 border-l-2 border-gray-700">
            <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-chess-purple border-4 border-chess-bg"></div>
            <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-purple/20 text-chess-purple">Step 3</span>
                <h3 className="text-lg font-semibold">Filtering & Validation</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Each lesson has criteria. Puzzles must pass all filters:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-chess-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chess-green text-xs">1</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Rating Range</span>
                    <span className="text-gray-400 ml-2">e.g., 400-600 for beginners</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-chess-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chess-green text-xs">2</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Required Tags</span>
                    <span className="text-gray-400 ml-2">Must have "fork" for fork lessons</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-chess-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chess-green text-xs">3</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Excluded Tags</span>
                    <span className="text-gray-400 ml-2">No "mateIn1" in fork lessons</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-chess-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chess-green text-xs">4</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Quality Filter</span>
                    <span className="text-gray-400 ml-2">Min 2,000 plays (well-tested)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-chess-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chess-green text-xs">5</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Theme Analyzer</span>
                    <span className="text-gray-400 ml-2">Confirm the PRIMARY tactic matches lesson intent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative pl-8 pb-8 border-l-2 border-gray-700">
            <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-chess-orange border-4 border-chess-bg"></div>
            <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-orange/20 text-chess-orange">Step 4</span>
                <h3 className="text-lg font-semibold">Theme Analyzer (The Secret Sauce)</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Lichess tags puzzles with <em>all</em> themes that apply. But a puzzle tagged "fork mateIn2"
                might be primarily about the mate, not the fork. Our analyzer determines the <strong className="text-white">primary</strong> theme.
              </p>
              <div className="bg-chess-bg rounded-lg p-4">
                <div className="text-gray-500 text-sm mb-3">Priority order (highest = primary):</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-chess-red">1.</span>
                    <span className="text-gray-300">Specific mate patterns</span>
                    <span className="text-gray-600 text-xs">(backRankMate, smotheredMate...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-chess-orange">2.</span>
                    <span className="text-gray-300">Mate in N</span>
                    <span className="text-gray-600 text-xs">(mateIn1, mateIn2, mateIn3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-chess-green">3.</span>
                    <span className="text-gray-300">Tactical themes</span>
                    <span className="text-gray-600 text-xs">(fork, pin, skewer, discoveredAttack)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-chess-blue">4.</span>
                    <span className="text-gray-300">Endgame types</span>
                    <span className="text-gray-600 text-xs">(rookEndgame, pawnEndgame)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">5.</span>
                    <span className="text-gray-500">Meta themes (ignored)</span>
                    <span className="text-gray-600 text-xs">(crushing, advantage, short)</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Script: <code className="bg-chess-bg px-1.5 py-0.5 rounded">lib/theme-analyzer.ts</code>
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative pl-8 pb-8 border-l-2 border-gray-700">
            <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-chess-red border-4 border-chess-bg"></div>
            <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-red/20 text-chess-red">Step 5</span>
                <h3 className="text-lg font-semibold">Selection & Ranking</h3>
              </div>
              <p className="text-gray-400 mb-4">
                From all passing puzzles, select the best 6 for each lesson:
              </p>
              <div className="bg-chess-bg rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-500 mb-2"># Ranking criteria</div>
                <div className="text-gray-300">
                  <div>1. Sort by <span className="text-chess-green">rating</span> (ascending) → easier first</div>
                  <div>2. Then by <span className="text-chess-blue">plays</span> (descending) → most tested</div>
                  <div>3. Take <span className="text-chess-purple">top 6</span> with variety filter</div>
                </div>
              </div>

              {/* Variety Filter */}
              <div className="mt-4 p-4 bg-chess-bg rounded-lg border border-chess-red/30">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-chess-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium text-chess-red">Variety Filter</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Consecutive puzzles cannot have the same piece moving to the same square.
                  This prevents repetitive patterns like "knight to e4" appearing back-to-back.
                </p>
                <div className="text-sm font-mono">
                  <div className="text-gray-500 mb-1"># Example signatures:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-chess-bg-light rounded text-gray-300">knight-e4</span>
                    <span className="px-2 py-1 bg-chess-bg-light rounded text-gray-300">queen-h7</span>
                    <span className="px-2 py-1 bg-chess-bg-light rounded text-gray-300">bishop-f7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-chess-gold border-4 border-chess-bg"></div>
            <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-gold/20 text-chess-gold">Step 6</span>
                <h3 className="text-lg font-semibold">Output</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Generate static puzzle sets that the app serves:
              </p>
              <div className="bg-chess-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-500 mb-2">// lesson-puzzle-sets.json</div>
                <div className="text-gray-300">{'{'}</div>
                <div className="ml-4">"<span className="text-chess-green">lessonId</span>": "1.1.1",</div>
                <div className="ml-4">"<span className="text-chess-green">lessonName</span>": "Easy Forks",</div>
                <div className="ml-4">"<span className="text-chess-green">puzzleIds</span>": ["WzveJ", "YfOqO", "JCbll", "HzPON", "uIs5W", "V4TWq"],</div>
                <div className="ml-4">"<span className="text-chess-green">criteria</span>": {'{'}</div>
                <div className="ml-8">"requiredTags": ["fork"],</div>
                <div className="ml-8">"ratingRange": "400-600"</div>
                <div className="ml-4">{'}'}</div>
                <div className="text-gray-300">{'}'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Human Review */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-chess-green">Human Review (Optional)</h2>
          <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 mb-4">
              The <Link href="/review" className="text-chess-blue hover:underline">/review</Link> page
              lets us manually approve/reject puzzles:
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-chess-bg rounded-lg p-4">
                <div className="text-2xl mb-2 text-chess-green">A</div>
                <div className="text-sm text-gray-400">Approve</div>
              </div>
              <div className="bg-chess-bg rounded-lg p-4">
                <div className="text-2xl mb-2 text-chess-red">R</div>
                <div className="text-sm text-gray-400">Reject</div>
              </div>
              <div className="bg-chess-bg rounded-lg p-4">
                <div className="text-2xl mb-2 text-chess-orange">M</div>
                <div className="text-sm text-gray-400">Maybe</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Reviews saved to <code className="bg-chess-bg px-1.5 py-0.5 rounded">data/puzzle-reviews.json</code>
            </p>
          </div>
        </section>

        {/* Mixed Practice & Module Reviews */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-chess-green">Mixed Practice & Reviews</h2>
          <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 mb-4">
              To prevent pattern-matching based on lesson titles, we add variety lessons:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Mixed Practice */}
              <div className="bg-chess-bg rounded-lg p-4 border border-chess-blue/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-chess-blue"></div>
                  <span className="font-medium text-chess-blue">Mixed Practice</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  Every 4 themed lessons, insert a "best move" lesson.
                </p>
                <div className="text-xs text-gray-500">
                  Example: After Knight Forks 1-4, add "Mixed Practice: Knight Forks"
                </div>
              </div>

              {/* Module Review */}
              <div className="bg-chess-bg rounded-lg p-4 border border-chess-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-chess-purple"></div>
                  <span className="font-medium text-chess-purple">Module Review</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  At the end of each module, add a review lesson.
                </p>
                <div className="text-xs text-gray-500">
                  Example: "Module 4 Review: Best Move" covers all module themes
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-chess-bg rounded-lg p-4">
              <div className="text-sm font-medium mb-2 text-chess-gold">Rules for Best Move Puzzles:</div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-chess-green">✓</span>
                  <span>Minimum <strong className="text-white">5,000+ plays</strong> (higher quality bar)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-chess-green">✓</span>
                  <span>No theme validation (any tactic is valid)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-chess-green">✓</span>
                  <span>Can limit to <code className="bg-chess-bg-light px-1 rounded">mixedThemes</code> array</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-chess-green">✓</span>
                  <span>Variety filter still applies (no same piece to same square)</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 text-sm font-mono bg-chess-bg rounded-lg p-4 overflow-x-auto">
              <div className="text-gray-500 mb-2">// Lesson criteria for mixed practice</div>
              <div className="text-gray-300">{'{'}</div>
              <div className="ml-4">"id": "<span className="text-chess-green">1.4.R</span>",</div>
              <div className="ml-4">"name": "Module 4 Review: Best Move",</div>
              <div className="ml-4">"<span className="text-chess-blue">isMixedPractice</span>": true,</div>
              <div className="ml-4">"<span className="text-chess-purple">mixedThemes</span>": ["fork"],</div>
              <div className="ml-4">"<span className="text-chess-gold">minPlays</span>": 5000</div>
              <div className="text-gray-300">{'}'}</div>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-chess-green">API Endpoints</h2>
          <div className="space-y-4">
            <div className="bg-chess-bg-light rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-green/20 text-chess-green">GET</span>
                <code className="text-white">/api/lesson-puzzles?lessonId=1.1.1</code>
              </div>
              <p className="text-gray-400 text-sm">Returns the 6 curated puzzles for a lesson</p>
            </div>
            <div className="bg-chess-bg-light rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-blue/20 text-chess-blue">GET</span>
                <code className="text-white">/api/puzzles?rating=0400-0800&theme=fork</code>
              </div>
              <p className="text-gray-400 text-sm">Browse raw puzzles by rating/theme (for review)</p>
            </div>
            <div className="bg-chess-bg-light rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-chess-purple/20 text-chess-purple">GET</span>
                <code className="text-white">/api/challenge-puzzle?rating=400&seed=20260119</code>
              </div>
              <p className="text-gray-400 text-sm">Daily challenge (seeded for consistency)</p>
            </div>
          </div>
        </section>

        {/* Key Files */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-chess-green">Key Files</h2>
          <div className="bg-chess-bg-light rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-chess-bg">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">File</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-3"><code className="text-chess-green">preprocess-puzzles.sh</code></td>
                  <td className="px-4 py-3 text-gray-400">Splits Lichess CSV by rating/theme</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-chess-green">generate-lesson-puzzles.ts</code></td>
                  <td className="px-4 py-3 text-gray-400">Selects 6 puzzles per lesson</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-chess-green">lib/theme-analyzer.ts</code></td>
                  <td className="px-4 py-3 text-gray-400">Determines primary theme</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-chess-green">data/lesson-puzzle-sets.json</code></td>
                  <td className="px-4 py-3 text-gray-400">Final curated puzzle IDs</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-chess-green">data/puzzle-reviews.json</code></td>
                  <td className="px-4 py-3 text-gray-400">Human review decisions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
